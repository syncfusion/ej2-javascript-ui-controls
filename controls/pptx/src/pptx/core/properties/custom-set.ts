/**
 * Custom document properties (`docProps/custom.xml`).
 *
 * Citation: ECMA-376-1 §15.2.12.2; Transitional
 * `shared-documentPropertiesCustom.xsd` `CT_Properties` / `CT_Property`;
 * [MS-OI29500] custom file properties example
 * (`fmtid="{D5CDD505-2E9C-101B-9397-08002B2CF9AE}"`, `vt:lpwstr`).
 * Content type: `application/vnd.openxmlformats-officedocument.custom-properties+xml`
 * (ECMA-376-1 §15.2.12.2).
 */

import { PresentationError } from '../errors';
import { OpcPackage, PackagePart } from '../package/package-model';
import { PackageRelationship } from '../package/relationships';
import { relativeTarget } from '../package/paths';
import { PackageLimitError } from '../security/errors';
import { asMutable } from '../shapes/dom-utils';
import { arrayAt } from '../util/es5-compat';
import { OoxmlElement, OoxmlText, parseXml, serializeXmlDocument } from '../xml/index';

const CUSTOM_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/custom-properties';
const VT_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes';
const CUSTOM_REL_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties';
const CUSTOM_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.custom-properties+xml';
const CUSTOM_PART: string = '/docProps/custom.xml';
/** User-defined property set FMTID from [MS-OI29500] custom property examples. */
const USER_FMTID: string = '{D5CDD505-2E9C-101B-9397-08002B2CF9AE}';
const MIN_PID: number = 2;
/** Cap on custom property entries. There is no dedicated SecurityLimits field. */
const MAX_CUSTOM_PROPERTIES: number = 256;
const MAX_VALUE_CHARS: number = 32767;
const SUPPORTED_VARIANTS: ReadonlyArray<string> = ['lpwstr', 'i4', 'r8', 'bool', 'filetime'];

/** A custom property value the library reads and writes. */
export type CustomPropertyValue = string | number | boolean | Date;

/**
 * Named custom document properties.
 *
 * @remarks Unknown `property` children and unsupported variant elements are
 * preserved. Vector and array variants are preserve-only. Values are data and
 * are never executed. New properties use the user-defined FMTID and the next
 * free `pid` (minimum 2); existing `fmtid` and `pid` are not rewritten.
 */
export class CustomProperties {
    private root: OoxmlElement | undefined;
    private dirty: boolean = false;

    /**
     * @param pkg - Live package the properties belong to.
     * @internal
     */
    constructor(private readonly pkg: OpcPackage) {}

    /**
     * Reads one custom property by name.
     *
     * @param name - Property name (`CT_Property/@name`).
     * @returns The stored value, or `undefined` when absent or preserve-only.
     */
    public get(name: string): CustomPropertyValue | undefined {
        const property: OoxmlElement | undefined = this.find(name);
        if (property === undefined) {
            return undefined;
        }
        return readValue(property);
    }

    /**
     * Reports whether a named custom property exists, including preserve-only variants.
     *
     * @param name - Property name.
     * @returns `true` when a `property` with that name is present.
     */
    public contains(name: string): boolean {
        return this.find(name) !== undefined;
    }

    /**
     * Adds a custom property. Fails when the name already exists.
     *
     * @param name - Non-empty property name.
     * @param value - string, finite number, boolean, or `Date`.
     * @returns {void}
     */
    public add(name: string, value: CustomPropertyValue): void {
        requireName(name);
        if (this.find(name) !== undefined) {
            throw new PresentationError('model/invalid-argument', `Custom property "${name}" already exists`);
        }
        const root: OoxmlElement = this.ensureRoot();
        if (countProperties(root) >= MAX_CUSTOM_PROPERTIES) {
            throw new PackageLimitError('entryCount', { partName: CUSTOM_PART, actual: MAX_CUSTOM_PROPERTIES + 1 });
        }
        asMutable(root).children.push(propertyElement(name, value, nextPid(root)));
        this.dirty = true;
    }

    /**
     * Sets an existing custom property, replacing its variant child.
     *
     * @param name - Property name.
     * @param value - Replacement value. A type change rewrites the variant element.
     * @returns {void}
     */
    public set(name: string, value: CustomPropertyValue): void {
        requireName(name);
        const property: OoxmlElement | undefined = this.find(name);
        if (property === undefined) {
            throw new PresentationError('model/invalid-argument', `Custom property "${name}" does not exist`);
        }
        const mutable = asMutable(property);
        const kept: Array<OoxmlElement | OoxmlText> = [];
        for (let i: number = 0; i < mutable.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(mutable.children, i);
            if (child.kind !== 'element') {
                kept.push(child);
            }
        }
        kept.push(variantElement(value));
        mutable.children = kept;
        this.dirty = true;
    }

    /**
     * Removes one custom property. Sibling properties are unchanged.
     *
     * @param name - Property name.
     * @returns {void}
     */
    public remove(name: string): void {
        const root: OoxmlElement | undefined = this.ensureLoaded(false);
        if (root === undefined) {
            return;
        }
        const property: OoxmlElement | undefined = findNamed(root, name);
        if (property === undefined) {
            return;
        }
        const mutable = asMutable(root);
        const kept: Array<OoxmlElement | OoxmlText> = [];
        for (let i: number = 0; i < mutable.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(mutable.children, i);
            if (child !== property) {
                kept.push(child);
            }
        }
        mutable.children = kept;
        this.dirty = true;
    }

    /**
     * Writes the custom part when it changed.
     *
     * @returns {void}
     * @internal
     */
    public flush(): void {
        if (this.dirty && this.root !== undefined) {
            writeCustomPart(this.pkg, this.root);
            this.dirty = false;
        }
    }

    private find(name: string): OoxmlElement | undefined {
        const root: OoxmlElement | undefined = this.ensureLoaded(false);
        if (root === undefined) {
            return undefined;
        }
        return findNamed(root, name);
    }

    private ensureRoot(): OoxmlElement {
        const root: OoxmlElement | undefined = this.ensureLoaded(true);
        if (root === undefined) {
            throw new PresentationError('model/invalid-argument', 'Custom properties part is unavailable');
        }
        return root;
    }

    private ensureLoaded(create: boolean): OoxmlElement | undefined {
        if (this.root === undefined) {
            this.root = loadCustom(this.pkg, create ? emptyCustomRoot() : undefined);
        }
        return this.root;
    }
}

function requireName(name: string): void {
    if (name.length === 0) {
        throw new PresentationError('model/invalid-argument', 'Custom property name must not be empty');
    }
}

function emptyCustomRoot(): OoxmlElement {
    return {
        kind: 'element',
        namespaceUri: CUSTOM_NS,
        localName: 'Properties',
        attributes: [],
        children: []
    };
}

function countProperties(root: OoxmlElement): number {
    let count: number = 0;
    for (let i: number = 0; i < root.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(root.children, i);
        if (child.kind === 'element' && child.localName === 'property' && child.namespaceUri === CUSTOM_NS) {
            count += 1;
        }
    }
    return count;
}

function nextPid(root: OoxmlElement): number {
    let max: number = MIN_PID - 1;
    for (let i: number = 0; i < root.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(root.children, i);
        if (child.kind !== 'element' || child.localName !== 'property') {
            continue;
        }
        const pid: string | undefined = attr(child, 'pid');
        const n: number = pid === undefined ? 0 : Number(pid);
        if (Number.isFinite(n) && n > max) {
            max = n;
        }
    }
    return max + 1;
}

function findNamed(root: OoxmlElement, name: string): OoxmlElement | undefined {
    for (let i: number = 0; i < root.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(root.children, i);
        if (child.kind === 'element' && child.localName === 'property' && attr(child, 'name') === name) {
            return child;
        }
    }
    return undefined;
}

function propertyElement(name: string, value: CustomPropertyValue, pid: number): OoxmlElement {
    return {
        kind: 'element',
        namespaceUri: CUSTOM_NS,
        localName: 'property',
        attributes: [
            { namespaceUri: '', localName: 'fmtid', value: USER_FMTID },
            { namespaceUri: '', localName: 'pid', value: String(pid) },
            { namespaceUri: '', localName: 'name', value: name }
        ],
        children: [variantElement(value)]
    };
}

function variantElement(value: CustomPropertyValue): OoxmlElement {
    if (typeof value === 'string') {
        return vt('lpwstr', value);
    }
    if (typeof value === 'boolean') {
        return vt('bool', value ? 'true' : 'false');
    }
    if (value instanceof Date) {
        return vt('filetime', value.toISOString().replace(/\.\d{3}Z$/, 'Z'));
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
        if (Number.isInteger(value) && value >= -2147483648 && value <= 2147483647) {
            return vt('i4', String(value));
        }
        return vt('r8', String(value));
    }
    throw new PresentationError('model/invalid-argument', 'Custom property value must be a string, finite number, boolean, or Date');
}

function filetimeText(value: Date): string {
    const pad = (n: number, width: number): string => {
        let out: string = String(n);
        while (out.length < width) {
            out = `0${out}`;
        }
        return out;
    };
    return `${String(value.getUTCFullYear())}-${pad(value.getUTCMonth() + 1, 2)}-${pad(value.getUTCDate(), 2)}`
        + `T${pad(value.getUTCHours(), 2)}:${pad(value.getUTCMinutes(), 2)}:${pad(value.getUTCSeconds(), 2)}Z`;
}

function vt(localName: string, text: string): OoxmlElement {
    if (text.length > MAX_VALUE_CHARS) {
        throw new PackageLimitError('textNodeLengthBytes', { partName: CUSTOM_PART, actual: text.length });
    }
    return {
        kind: 'element',
        namespaceUri: VT_NS,
        localName,
        attributes: [],
        children: [{ kind: 'text', text }]
    };
}

function readValue(property: OoxmlElement): CustomPropertyValue | undefined {
    for (let i: number = 0; i < property.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(property.children, i);
        if (child.kind !== 'element' || child.namespaceUri !== VT_NS) {
            continue;
        }
        if (!includesVariant(child.localName)) {
            return undefined;
        }
        const text: string = textOf(child);
        if (child.localName === 'bool') {
            return text === 'true' || text === '1';
        }
        if (child.localName === 'i4' || child.localName === 'r8') {
            const n: number = Number(text);
            return Number.isFinite(n) ? n : undefined;
        }
        if (child.localName === 'filetime') {
            const date: Date = new Date(text);
            return Number.isNaN(date.getTime()) ? undefined : date;
        }
        return text;
    }
    return undefined;
}

function includesVariant(localName: string): boolean {
    for (let i: number = 0; i < SUPPORTED_VARIANTS.length; i++) {
        if (arrayAt(SUPPORTED_VARIANTS, i) === localName) {
            return true;
        }
    }
    return false;
}

function textOf(el: OoxmlElement): string {
    let out: string = '';
    for (let i: number = 0; i < el.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(el.children, i);
        if (child.kind === 'text') {
            out += child.text;
        }
    }
    return out;
}

function attr(el: OoxmlElement, localName: string): string | undefined {
    for (let i: number = 0; i < el.attributes.length; i++) {
        const attribute = arrayAt(el.attributes, i);
        if (attribute.localName === localName && (attribute.namespaceUri === undefined || attribute.namespaceUri === '')) {
            return attribute.value;
        }
    }
    return undefined;
}

function loadCustom(pkg: OpcPackage, created: OoxmlElement | undefined): OoxmlElement | undefined {
    const rel: PackageRelationship | undefined = findRel(pkg);
    if (rel === undefined || rel.targetPartName === undefined) {
        return created;
    }
    const part: PackagePart | undefined = pkg.parts.get(rel.targetPartName);
    if (part === undefined) {
        return created;
    }
    const root: OoxmlElement = parseXml(new TextDecoder('utf-8').decode(part.data), {
        limits: pkg.limits,
        partName: rel.targetPartName
    });
    if (root.localName !== 'Properties' || root.namespaceUri !== CUSTOM_NS) {
        throw new PresentationError('model/invalid-argument', `Unexpected custom property root on ${rel.targetPartName}`);
    }
    return root;
}

function writeCustomPart(pkg: OpcPackage, root: OoxmlElement): void {
    const data: Uint8Array = new TextEncoder().encode(serializeXmlDocument(root));
    const existing: PackageRelationship | undefined = findRel(pkg);
    const partName: string = existing !== undefined && existing.targetPartName !== undefined
        ? existing.targetPartName
        : CUSTOM_PART;
    const prior: PackagePart | undefined = pkg.parts.get(partName);
    pkg.parts.set(partName, {
        name: partName,
        contentType: prior !== undefined ? prior.contentType : CUSTOM_CONTENT_TYPE,
        data
    });
    if (!pkg.contentTypes.overrides.has(partName)) {
        pkg.contentTypes.overrides.set(partName, CUSTOM_CONTENT_TYPE);
    }
    if (existing === undefined) {
        pkg.packageRelationships.push({
            id: nextPackageRelId(pkg.packageRelationships),
            type: CUSTOM_REL_TYPE,
            target: relativeTarget('/', partName),
            targetMode: 'Internal',
            targetPartName: partName
        });
    }
}

function findRel(pkg: OpcPackage): PackageRelationship | undefined {
    for (let i: number = 0; i < pkg.packageRelationships.length; i++) {
        const candidate: PackageRelationship = arrayAt(pkg.packageRelationships, i);
        if (candidate.type === CUSTOM_REL_TYPE) {
            return candidate;
        }
    }
    return undefined;
}

function nextPackageRelId(rels: ReadonlyArray<PackageRelationship>): string {
    let max: number = 0;
    for (let i: number = 0; i < rels.length; i++) {
        const match: RegExpExecArray | null = /^rId(\d+)$/.exec(arrayAt(rels, i).id);
        if (match !== null) {
            const n: number = Number(match[1]);
            if (n > max) {
                max = n;
            }
        }
    }
    return `rId${String(max + 1)}`;
}
