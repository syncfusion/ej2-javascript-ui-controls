/**
 * Built-in presentation properties (core + scalar extended).
 *
 * @remarks
 * Citations:
 * - ECMA-376-2 `opc-coreProperties.xsd` `CT_CoreProperties` (`cp:category`,
 *   `cp:contentStatus`, `dcterms:created`, `dc:creator`, `dc:description`,
 *   `dc:identifier`, `cp:keywords`, `dc:language`, `cp:lastModifiedBy`,
 *   `cp:lastPrinted`, `dcterms:modified`, `cp:revision`, `dc:subject`,
 *   `dc:title`, `cp:version`).
 * - ECMA-376-4 Transitional `shared-documentPropertiesExtended.xsd`
 *   `CT_Properties` scalar children. Vector/blob children (`HeadingPairs`,
 *   `TitlesOfParts`, `HLinks`, `DigSig`) are preserve-only.
 *
 * Getters read the live DOM. Set upserts one cited element and does not
 * delete siblings. A missing part is created with the corpus relationship
 * type and content type on first write.
 *
 * `Slides` is owned by `refreshExtendedProperties` on save. A metadata set
 * of another extended property must not drop that statistic, and the
 * statistic refresh must not drop metadata siblings.
 */
import { PresentationError } from '../errors';
import { CORE_PROPS_CONTENT_TYPE, CORE_PROPS_REL_TYPE, EXTENDED_PROPS_CONTENT_TYPE, EXTENDED_PROPS_REL_TYPE } from '../package/constants';
import { OpcPackage, PackagePart } from '../package/package-model';
import { PackageRelationship } from '../package/relationships';
import { relativeTarget } from '../package/paths';
import { asMutable, findChild } from '../shapes/dom-utils';
import { arrayAt } from '../util/es5-compat';
import { OoxmlElement, OoxmlText, parseXml, serializeXmlDocument } from '../xml/index';

/** Core-properties namespace (ECMA-376-2 opc-coreProperties.xsd). */
const CP_NS: string = 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties';
/** Dublin Core elements (imported by opc-coreProperties.xsd). */
const DC_NS: string = 'http://purl.org/dc/elements/1.1/';
/** DCMI terms (imported by opc-coreProperties.xsd). */
const DCTERMS_NS: string = 'http://purl.org/dc/terms/';
/** DCMI type namespace declared on core properties roots in the create template. */
const DCMITYPE_NS: string = 'http://purl.org/dc/dcmitype/';
/** XML Schema instance, used for `xsi:type` on `dcterms` date elements. */
const XSI_NS: string = 'http://www.w3.org/2001/XMLSchema-instance';
/** Extended properties namespace (ECMA-376-4 shared-documentPropertiesExtended.xsd). */
const EXT_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties';
/** Variant types namespace retained on extended-property roots. */
const VT_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes';

/** Maximum stored string length for a built-in property value. */
const MAX_BUILTIN_STRING: number = 65536;

const CORE_PART: string = '/docProps/core.xml';
const APP_PART: string = '/docProps/app.xml';

/** Public built-in names. Core names are camelCase schema locals; extended names match the XSD local name. */
export type BuiltInProperty =
    | 'category'
    | 'comments'
    | 'contentStatus'
    | 'created'
    | 'creator'
    | 'description'
    | 'identifier'
    | 'keywords'
    | 'language'
    | 'lastModifiedBy'
    | 'lastPrinted'
    | 'modified'
    | 'revision'
    | 'subject'
    | 'title'
    | 'version'
    | 'Template'
    | 'Manager'
    | 'Company'
    | 'Pages'
    | 'Words'
    | 'Characters'
    | 'PresentationFormat'
    | 'Lines'
    | 'Paragraphs'
    | 'Slides'
    | 'Notes'
    | 'TotalTime'
    | 'HiddenSlides'
    | 'MMClips'
    | 'ScaleCrop'
    | 'LinksUpToDate'
    | 'CharactersWithSpaces'
    | 'SharedDoc'
    | 'HyperlinkBase'
    | 'HyperlinksChanged'
    | 'Application'
    | 'AppVersion'
    | 'DocSecurity';

interface PropertySpec {
    readonly part: 'core' | 'extended';
    readonly namespaceUri: string;
    readonly localName: string;
    readonly kind: 'string' | 'date' | 'int' | 'boolean';
}

const SPECS: Record<BuiltInProperty, PropertySpec> = {
    category: { part: 'core', namespaceUri: CP_NS, localName: 'category', kind: 'string' },
    comments: { part: 'core', namespaceUri: DC_NS, localName: 'description', kind: 'string' },
    contentStatus: { part: 'core', namespaceUri: CP_NS, localName: 'contentStatus', kind: 'string' },
    created: { part: 'core', namespaceUri: DCTERMS_NS, localName: 'created', kind: 'date' },
    creator: { part: 'core', namespaceUri: DC_NS, localName: 'creator', kind: 'string' },
    description: { part: 'core', namespaceUri: DC_NS, localName: 'description', kind: 'string' },
    identifier: { part: 'core', namespaceUri: DC_NS, localName: 'identifier', kind: 'string' },
    keywords: { part: 'core', namespaceUri: CP_NS, localName: 'keywords', kind: 'string' },
    language: { part: 'core', namespaceUri: DC_NS, localName: 'language', kind: 'string' },
    lastModifiedBy: { part: 'core', namespaceUri: CP_NS, localName: 'lastModifiedBy', kind: 'string' },
    lastPrinted: { part: 'core', namespaceUri: CP_NS, localName: 'lastPrinted', kind: 'date' },
    modified: { part: 'core', namespaceUri: DCTERMS_NS, localName: 'modified', kind: 'date' },
    revision: { part: 'core', namespaceUri: CP_NS, localName: 'revision', kind: 'string' },
    subject: { part: 'core', namespaceUri: DC_NS, localName: 'subject', kind: 'string' },
    title: { part: 'core', namespaceUri: DC_NS, localName: 'title', kind: 'string' },
    version: { part: 'core', namespaceUri: CP_NS, localName: 'version', kind: 'string' },
    Template: { part: 'extended', namespaceUri: EXT_NS, localName: 'Template', kind: 'string' },
    Manager: { part: 'extended', namespaceUri: EXT_NS, localName: 'Manager', kind: 'string' },
    Company: { part: 'extended', namespaceUri: EXT_NS, localName: 'Company', kind: 'string' },
    Pages: { part: 'extended', namespaceUri: EXT_NS, localName: 'Pages', kind: 'int' },
    Words: { part: 'extended', namespaceUri: EXT_NS, localName: 'Words', kind: 'int' },
    Characters: { part: 'extended', namespaceUri: EXT_NS, localName: 'Characters', kind: 'int' },
    PresentationFormat: { part: 'extended', namespaceUri: EXT_NS, localName: 'PresentationFormat', kind: 'string' },
    Lines: { part: 'extended', namespaceUri: EXT_NS, localName: 'Lines', kind: 'int' },
    Paragraphs: { part: 'extended', namespaceUri: EXT_NS, localName: 'Paragraphs', kind: 'int' },
    Slides: { part: 'extended', namespaceUri: EXT_NS, localName: 'Slides', kind: 'int' },
    Notes: { part: 'extended', namespaceUri: EXT_NS, localName: 'Notes', kind: 'int' },
    TotalTime: { part: 'extended', namespaceUri: EXT_NS, localName: 'TotalTime', kind: 'int' },
    HiddenSlides: { part: 'extended', namespaceUri: EXT_NS, localName: 'HiddenSlides', kind: 'int' },
    MMClips: { part: 'extended', namespaceUri: EXT_NS, localName: 'MMClips', kind: 'int' },
    ScaleCrop: { part: 'extended', namespaceUri: EXT_NS, localName: 'ScaleCrop', kind: 'boolean' },
    LinksUpToDate: { part: 'extended', namespaceUri: EXT_NS, localName: 'LinksUpToDate', kind: 'boolean' },
    CharactersWithSpaces: { part: 'extended', namespaceUri: EXT_NS, localName: 'CharactersWithSpaces', kind: 'int' },
    SharedDoc: { part: 'extended', namespaceUri: EXT_NS, localName: 'SharedDoc', kind: 'boolean' },
    HyperlinkBase: { part: 'extended', namespaceUri: EXT_NS, localName: 'HyperlinkBase', kind: 'string' },
    HyperlinksChanged: { part: 'extended', namespaceUri: EXT_NS, localName: 'HyperlinksChanged', kind: 'boolean' },
    Application: { part: 'extended', namespaceUri: EXT_NS, localName: 'Application', kind: 'string' },
    AppVersion: { part: 'extended', namespaceUri: EXT_NS, localName: 'AppVersion', kind: 'string' },
    DocSecurity: { part: 'extended', namespaceUri: EXT_NS, localName: 'DocSecurity', kind: 'int' }
};

/** Schema child order for core properties (`CT_CoreProperties` `xs:all` document order). */
const CORE_ORDER: ReadonlyArray<{ namespaceUri: string; localName: string }> = [
    { namespaceUri: CP_NS, localName: 'category' },
    { namespaceUri: CP_NS, localName: 'contentStatus' },
    { namespaceUri: DCTERMS_NS, localName: 'created' },
    { namespaceUri: DC_NS, localName: 'creator' },
    { namespaceUri: DC_NS, localName: 'description' },
    { namespaceUri: DC_NS, localName: 'identifier' },
    { namespaceUri: CP_NS, localName: 'keywords' },
    { namespaceUri: DC_NS, localName: 'language' },
    { namespaceUri: CP_NS, localName: 'lastModifiedBy' },
    { namespaceUri: CP_NS, localName: 'lastPrinted' },
    { namespaceUri: DCTERMS_NS, localName: 'modified' },
    { namespaceUri: CP_NS, localName: 'revision' },
    { namespaceUri: DC_NS, localName: 'subject' },
    { namespaceUri: DC_NS, localName: 'title' },
    { namespaceUri: CP_NS, localName: 'version' }
];

/** Schema child order for extended properties (`CT_Properties` `xsd:all` document order). */
const EXTENDED_ORDER: ReadonlyArray<string> = [
    'Template', 'Manager', 'Company', 'Pages', 'Words', 'Characters', 'PresentationFormat',
    'Lines', 'Paragraphs', 'Slides', 'Notes', 'TotalTime', 'HiddenSlides', 'MMClips',
    'ScaleCrop', 'HeadingPairs', 'TitlesOfParts', 'LinksUpToDate', 'CharactersWithSpaces',
    'SharedDoc', 'HyperlinkBase', 'HLinks', 'HyperlinksChanged', 'DigSig', 'Application',
    'AppVersion', 'DocSecurity'
];

/**
 * Read/write view of built-in document properties on one presentation.
 */
export interface BuiltInProperties {
    /** Core `cp:category`. */
    category: string | undefined;
    /** Office Comments field. Same stored element as `description` (`dc:description`). */
    comments: string | undefined;
    /** Core `cp:contentStatus`. */
    contentStatus: string | undefined;
    /** Core `dcterms:created`. */
    created: Date | undefined;
    /** Core `dc:creator`. */
    creator: string | undefined;
    /** Core `dc:description`. */
    description: string | undefined;
    /** Core `dc:identifier`. */
    identifier: string | undefined;
    /** Core `cp:keywords`. Structured keywords are preserve-only. */
    keywords: string | undefined;
    /** Core `dc:language`. */
    language: string | undefined;
    /** Core `cp:lastModifiedBy`. */
    lastModifiedBy: string | undefined;
    /** Core `cp:lastPrinted`. */
    lastPrinted: Date | undefined;
    /** Core `dcterms:modified`. */
    modified: Date | undefined;
    /** Core `cp:revision`. */
    revision: string | undefined;
    /** Core `dc:subject`. */
    subject: string | undefined;
    /** Core `dc:title`. */
    title: string | undefined;
    /** Core `cp:version`. */
    version: string | undefined;
    /** Extended `Template`. */
    Template: string | undefined;
    /** Extended `Manager`. */
    Manager: string | undefined;
    /** Extended `Company`. */
    Company: string | undefined;
    /** Extended `Pages`. Written as an integer; read back as a number. */
    Pages: number | undefined;
    /** Extended `Words`. Written as an integer; read back as a number. */
    Words: number | undefined;
    /** Extended `Characters`. Written as an integer; read back as a number. */
    Characters: number | undefined;
    /** Extended `PresentationFormat`. */
    PresentationFormat: string | undefined;
    /** Extended `Lines`. Written as an integer; read back as a number. */
    Lines: number | undefined;
    /** Extended `Paragraphs`. Written as an integer; read back as a number. */
    Paragraphs: number | undefined;
    /** Extended `Slides`. Written as an integer; read back as a number. Refreshed on save. */
    Slides: number | undefined;
    /** Extended `Notes`. Written as an integer; read back as a number. */
    Notes: number | undefined;
    /** Extended `TotalTime`. Written as an integer; read back as a number. */
    TotalTime: number | undefined;
    /** Extended `HiddenSlides`. Written as an integer; read back as a number. */
    HiddenSlides: number | undefined;
    /** Extended `MMClips`. Written as an integer; read back as a number. */
    MMClips: number | undefined;
    /** Extended `ScaleCrop`. */
    ScaleCrop: boolean | undefined;
    /** Extended `LinksUpToDate`. */
    LinksUpToDate: boolean | undefined;
    /** Extended `CharactersWithSpaces`. Written as an integer; read back as a number. */
    CharactersWithSpaces: number | undefined;
    /** Extended `SharedDoc`. */
    SharedDoc: boolean | undefined;
    /** Extended `HyperlinkBase`. */
    HyperlinkBase: string | undefined;
    /** Extended `HyperlinksChanged`. */
    HyperlinksChanged: boolean | undefined;
    /** Extended `Application`. */
    Application: string | undefined;
    /** Extended `AppVersion`. */
    AppVersion: string | undefined;
    /** Extended `DocSecurity`. Written as an integer; read back as a number. */
    DocSecurity: number | undefined;
}

export class BuiltInProperties {
    /** @internal */
    private readonly pkg: OpcPackage;
    /** @internal */
    private coreRoot: OoxmlElement | undefined;
    /** @internal */
    private extendedRoot: OoxmlElement | undefined;
    /** @internal */
    private coreDirty: boolean = false;
    /** @internal */
    private extendedDirty: boolean = false;

    /**
     * @param {OpcPackage} pkg - Package that owns the property parts.
     */
    public constructor(pkg: OpcPackage) {
        this.pkg = pkg;
        const names: BuiltInProperty[] = Object.keys(SPECS) as BuiltInProperty[];
        for (let i: number = 0; i < names.length; i++) {
            defineProperty(this, arrayAt(names, i));
        }
    }

    /**
     * Reads one built-in property.
     *
     * @param {BuiltInProperty} name - Locked property name.
     * @returns {string | number | boolean | Date | undefined} Stored value, or `undefined` when the element is absent.
     * Date properties return a `Date`. Integer properties return a number. Boolean
     * properties return a boolean. The stored XML text is not rewritten.
     */
    public get(name: BuiltInProperty): string | number | boolean | Date | undefined {
        const spec: PropertySpec = requireSpec(name);
        const root: OoxmlElement | undefined = this.rootFor(spec.part, false);
        if (root === undefined) {
            return undefined;
        }
        const child: OoxmlElement | undefined = findChild(root, spec.namespaceUri, spec.localName);
        if (child === undefined) {
            return undefined;
        }
        if (spec.localName === 'keywords' && hasElementChild(child)) {
            return undefined;
        }
        const text: string = directText(child);
        if (spec.kind === 'date') {
            const parsed: number = Date.parse(text);
            return Number.isNaN(parsed) ? undefined : new Date(parsed);
        }
        if (spec.kind === 'int') {
            if (!/^-?\d+$/.test(text)) {
                return undefined;
            }
            const parsed: number = Number(text);
            return Number.isSafeInteger(parsed) ? parsed : undefined;
        }
        if (spec.kind === 'boolean') {
            if (text === 'true') {
                return true;
            }
            if (text === 'false') {
                return false;
            }
            return undefined;
        }
        return text;
    }

    /**
     * Upserts one built-in property. Unknown siblings are kept.
     *
     * @param {BuiltInProperty} name - Locked property name.
     * @param {string | number | boolean | Date} value - New value. Dates are written as ISO-8601 UTC.
     * Integers and booleans are stored as their schema text forms.
     * @returns {void}
     */
    public set(name: BuiltInProperty, value: string | number | boolean | Date): void {
        const spec: PropertySpec = requireSpec(name);
        const stored: string = coerce(spec, value);
        const root: OoxmlElement = this.rootFor(spec.part, true) as OoxmlElement;
        const existing: OoxmlElement | undefined = findChild(root, spec.namespaceUri, spec.localName);
        if (spec.localName === 'keywords' && existing !== undefined && hasElementChild(existing)) {
            throw new PresentationError(
                'model/invalid-argument',
                'Structured cp:keywords is preserve-only and cannot be overwritten'
            );
        }
        const next: OoxmlElement = elementFor(spec, stored);
        const mutable = asMutable(root);
        if (existing !== undefined) {
            const index: number = mutable.children.indexOf(existing);
            mutable.children[index] = next;
        } else {
            insertInOrder(mutable.children, next, spec.part);
        }
        if (spec.part === 'core') {
            this.coreDirty = true;
        } else {
            this.extendedDirty = true;
        }
    }

    /**
     * Writes dirty property DOMs back to existing or newly created parts.
     *
     * @returns {void}
     * @internal
     */
    public flush(): void {
        if (this.coreDirty && this.coreRoot !== undefined) {
            writePart(this.pkg, CORE_PROPS_REL_TYPE, CORE_PROPS_CONTENT_TYPE, CORE_PART, this.coreRoot);
            this.coreDirty = false;
        }
        if (this.extendedDirty && this.extendedRoot !== undefined) {
            writePart(this.pkg, EXTENDED_PROPS_REL_TYPE, EXTENDED_PROPS_CONTENT_TYPE, APP_PART, this.extendedRoot);
            this.extendedDirty = false;
        }
    }

    /**
     * Re-reads the extended part after the slide-count refresh so a later
     * metadata set does not drop `Slides` / `HeadingPairs` / `TitlesOfParts`.
     *
     * @returns {void}
     * @internal
     */
    public reloadExtendedAfterStatisticRefresh(): void {
        this.extendedRoot = undefined;
        this.extendedDirty = false;
    }

    private rootFor(part: 'core' | 'extended', create: boolean): OoxmlElement | undefined {
        if (part === 'core') {
            if (this.coreRoot === undefined) {
                this.coreRoot = loadOrCreate(
                    this.pkg,
                    CORE_PROPS_REL_TYPE,
                    'coreProperties',
                    CP_NS,
                    create ? emptyCoreRoot() : undefined
                );
            }
            return this.coreRoot;
        }
        if (this.extendedRoot === undefined) {
            this.extendedRoot = loadOrCreate(
                this.pkg,
                EXTENDED_PROPS_REL_TYPE,
                'Properties',
                EXT_NS,
                create ? emptyExtendedRoot() : undefined
            );
        }
        return this.extendedRoot;
    }
}

/**
 * Field access for one built-in name. Reads and writes go through `get` / `set`
 * so the DOM stays the only source of truth.
 */
function defineProperty(target: BuiltInProperties, name: BuiltInProperty): void {
    Object.defineProperty(target, name, {
        configurable: false,
        enumerable: true,
        get(): string | number | boolean | Date | undefined {
            return target.get(name);
        },
        set(value: string | number | boolean | Date): void {
            target.set(name, value);
        }
    });
}

function requireSpec(name: string): PropertySpec {
    if (!Object.prototype.hasOwnProperty.call(SPECS, name)) {
        throw new PresentationError('model/invalid-argument', `Unknown built-in property "${name}"`);
    }
    return SPECS[name as BuiltInProperty];
}

function coerce(spec: PropertySpec, value: string | number | boolean | Date): string {
    if (spec.kind === 'date') {
        if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
            throw new PresentationError('model/invalid-argument', `${spec.localName} requires a Date`);
        }
        return value.toISOString();
    }
    if (spec.kind === 'int') {
        const text: string = typeof value === 'number' ? String(value) : String(value);
        if (typeof value === 'boolean' || !/^-?\d+$/.test(text)) {
            throw new PresentationError('model/invalid-argument', `${spec.localName} requires an integer`);
        }
        return text;
    }
    if (spec.kind === 'boolean') {
        if (value === true || value === 'true') {
            return 'true';
        }
        if (value === false || value === 'false') {
            return 'false';
        }
        throw new PresentationError('model/invalid-argument', `${spec.localName} requires a boolean`);
    }
    if (typeof value !== 'string') {
        throw new PresentationError('model/invalid-argument', `${spec.localName} requires a string`);
    }
    if (value.length > MAX_BUILTIN_STRING) {
        throw new PresentationError('security/limit-exceeded', `${spec.localName} exceeds ${String(MAX_BUILTIN_STRING)} characters`);
    }
    return value;
}

function elementFor(spec: PropertySpec, text: string): OoxmlElement {
    const child: OoxmlElement = {
        kind: 'element',
        namespaceUri: spec.namespaceUri,
        localName: spec.localName,
        attributes: spec.kind === 'date' && spec.namespaceUri === DCTERMS_NS
            ? [{ namespaceUri: XSI_NS, localName: 'type', value: 'dcterms:W3CDTF' }]
            : [],
        children: [{ kind: 'text', text }]
    };
    return child;
}

function insertInOrder(children: Array<OoxmlElement | OoxmlText>, next: OoxmlElement, part: 'core' | 'extended'): void {
    const rank: number = rankOf(next, part);
    let index: number = children.length;
    for (let i: number = 0; i < children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(children, i);
        if (child.kind !== 'element') {
            continue;
        }
        if (rankOf(child, part) > rank) {
            index = i;
            break;
        }
    }
    children.splice(index, 0, next);
}

function rankOf(el: OoxmlElement, part: 'core' | 'extended'): number {
    if (part === 'core') {
        for (let i: number = 0; i < CORE_ORDER.length; i++) {
            const row = arrayAt(CORE_ORDER, i);
            if (row.namespaceUri === el.namespaceUri && row.localName === el.localName) {
                return i;
            }
        }
        return CORE_ORDER.length;
    }
    const index: number = EXTENDED_ORDER.indexOf(el.localName);
    return index < 0 ? EXTENDED_ORDER.length : index;
}

function directText(el: OoxmlElement): string {
    let out: string = '';
    for (let i: number = 0; i < el.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(el.children, i);
        if (child.kind === 'text') {
            out += child.text;
        }
    }
    return out;
}

function hasElementChild(el: OoxmlElement): boolean {
    for (let i: number = 0; i < el.children.length; i++) {
        if (arrayAt(el.children, i).kind === 'element') {
            return true;
        }
    }
    return false;
}

function loadOrCreate(
    pkg: OpcPackage,
    relType: string,
    rootLocal: string,
    rootNs: string,
    created: OoxmlElement | undefined
): OoxmlElement | undefined {
    const rel: PackageRelationship | undefined = pkg.packageRelationships.find(
        (candidate: PackageRelationship): boolean => candidate.type === relType
    );
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
    if (root.localName !== rootLocal || root.namespaceUri !== rootNs) {
        throw new PresentationError('model/invalid-argument', `Unexpected property root on ${rel.targetPartName}`);
    }
    return root;
}

function writePart(pkg: OpcPackage, relType: string, contentType: string, conventional: string, root: OoxmlElement): void {
    const xml: string = serializeXmlDocument(root);
    const data: Uint8Array = new TextEncoder().encode(xml);
    const existing: PackageRelationship | undefined = pkg.packageRelationships.find(
        (candidate: PackageRelationship): boolean => candidate.type === relType
    );
    const partName: string = existing !== undefined && existing.targetPartName !== undefined
        ? existing.targetPartName
        : conventional;
    const prior: PackagePart | undefined = pkg.parts.get(partName);
    pkg.parts.set(partName, {
        name: partName,
        contentType: prior !== undefined ? prior.contentType : contentType,
        data
    });
    if (!pkg.contentTypes.overrides.has(partName)) {
        pkg.contentTypes.overrides.set(partName, contentType);
    }
    if (existing === undefined) {
        const id: string = nextPackageRelId(pkg.packageRelationships);
        const created: PackageRelationship = {
            id,
            type: relType,
            target: relativeTarget('/', partName),
            targetMode: 'Internal',
            targetPartName: partName
        };
        pkg.packageRelationships.push(created);
    }
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

function emptyCoreRoot(): OoxmlElement {
    return {
        kind: 'element',
        namespaceUri: CP_NS,
        localName: 'coreProperties',
        prefixHint: 'cp',
        attributes: [],
        namespaceDeclarations: [
            { prefix: 'cp', uri: CP_NS },
            { prefix: 'dc', uri: DC_NS },
            { prefix: 'dcterms', uri: DCTERMS_NS },
            { prefix: 'dcmitype', uri: DCMITYPE_NS },
            { prefix: 'xsi', uri: XSI_NS }
        ],
        children: []
    };
}

function emptyExtendedRoot(): OoxmlElement {
    return {
        kind: 'element',
        namespaceUri: EXT_NS,
        localName: 'Properties',
        attributes: [],
        namespaceDeclarations: [
            { prefix: '', uri: EXT_NS },
            { prefix: 'vt', uri: VT_NS }
        ],
        children: []
    };
}

