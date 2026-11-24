import { DocxError } from '../../core/errors/docx-error';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeaturePackageLevelPart } from '../document/feature-package-level-part';
import { allocateRelationshipId, OpcRelationship, RelationshipId } from '../../core/opc/relationships';
import { partName, PartName } from '../../core/opc/part-name';
import { OpcPackage, PackagePart } from '../../core/opc/package';
import { featureId, registerFeature, registerFeaturePackagePartHandler } from '../../core/registry/index';
import { findPackageRelatedPart, replaceOrAddPackageLevelPart, usedPackageRelationshipIds, FeaturePackagePartLoadContext } from '../../core/registry/package-part-handlers';
import { BuiltinDocumentProperties, CustomDocumentProperties, CUSTOM_PROPERTIES_NAMESPACE, EXTENDED_FIELD_KEYS, FieldMap } from './document-properties';
import { parseXml, serializeXml, NamespaceDeclaration, OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { FeatureId } from '../../core/registry/feature-registry';
const PROPERTIES: FeatureId = featureId('properties');
export * from './document-properties';
/**
 * @private
 * Package core properties relationship (ECMA-376-2 §11). */
export const CORE_PROPERTIES_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties';
/**
 * @private
 * Extended properties relationship (ECMA-376-1 §15.2.12.3). */
export const EXTENDED_PROPERTIES_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties';
/**
 * @private
 * Custom properties relationship (ECMA-376-1 §15.2.12.2). */
export const CUSTOM_PROPERTIES_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties';
/**
 * @private
 * ECMA-376-2 core properties content type. */
export const CORE_PROPERTIES_CONTENT_TYPE: string = 'application/vnd.openxmlformats-package.core-properties+xml';
/**
 * @private
 * ECMA-376-1 extended properties content type. */
export const EXTENDED_PROPERTIES_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.extended-properties+xml';
/**
 * @private
 * ECMA-376-1 custom properties content type. */
export const CUSTOM_PROPERTIES_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.custom-properties+xml';
/**
 * @private
 */
export const CORE_PROPERTIES_PART_NAME: PartName = partName('/docProps/core.xml');
/**
 * @private
 */
export const EXTENDED_PROPERTIES_PART_NAME: PartName = partName('/docProps/app.xml');
/**
 * @private
 */
export const CUSTOM_PROPERTIES_PART_NAME: PartName = partName('/docProps/custom.xml');
const CORE_NS: string = 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties';
const DC_NS: string = 'http://purl.org/dc/elements/1.1/';
const DCTERMS_NS: string = 'http://purl.org/dc/terms/';
const XSI_NS: string = 'http://www.w3.org/2001/XMLSchema-instance';
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
const utf8: TextEncoder = new TextEncoder();
function elementChildren(el: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return el.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element');
}
function textContent(el: OpenXmlElement): string {
    let out: string = '';
    for (const child of el.children) {
        if (child.kind === 'text') {
            out += child.value;
        }
    }
    return out;
}
function isCoreElement(el: OpenXmlElement, localName: string): boolean {
    return el.namespaceUri === CORE_NS && el.localName === localName;
}
function isDcElement(el: OpenXmlElement, localName: string): boolean {
    return el.namespaceUri === DC_NS && el.localName === localName;
}
function coreElement(localName: string, text: string, prefix: string): OpenXmlElement {
    return {
        kind: 'element',
        namespaceUri: CORE_NS,
        localName,
        prefix,
        attributes: [],
        namespaceDeclarations: [],
        children: text.length > 0 ? [{ kind: 'text', value: text }] : []
    };
}
function dcElement(localName: string, text: string): OpenXmlElement {
    return {
        kind: 'element',
        namespaceUri: DC_NS,
        localName,
        prefix: 'dc',
        attributes: [],
        namespaceDeclarations: [],
        children: text.length > 0 ? [{ kind: 'text', value: text }] : []
    };
}
const CP_KEYS_DC: string[] = ['title', 'creator', 'subject', 'description'];
const CP_KEYS_CORE: string[] = ['keywords', 'lastModifiedBy', 'revision', 'lastPrinted', 'category'];
const CP_KEYS_TERMS: string[] = ['created', 'modified'];
const EXT_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties';
function isDctermsElement(el: OpenXmlElement, localName: string): boolean {
    return el.namespaceUri === DCTERMS_NS && el.localName === localName;
}
function termsElement(localName: string, text: string): OpenXmlElement {
    return {
        kind: 'element',
        namespaceUri: DCTERMS_NS,
        localName,
        prefix: 'dcterms',
        attributes: [{ namespaceUri: XSI_NS, localName: 'type', prefix: 'xsi', value: 'dcterms:W3CDTF' }],
        namespaceDeclarations: [],
        children: text.length > 0 ? [{ kind: 'text', value: text }] : []
    };
}
/**
 * In-memory core file properties (`docProps/core.xml`).
 * Package infrastructure used by document-level property helpers; not a public
 * mutation surface. Prefer `documentTitle` / `setDocumentTitle` and siblings.
 *
 * @private
 */
export class CoreProperties {
    private readonly rootAttributes: ReadonlyArray<OpenXmlAttribute>;
    private readonly rootNamespaceDeclarations: ReadonlyArray<NamespaceDeclaration>;
    private readonly opaque: OpenXmlElement[];
    /**
     * @private
     */
    readonly fields: FieldMap;
    private readonly rootPrefix: string;
    private dirty: boolean;
    /**
     * @param {ReadonlyArray<OpenXmlAttribute>} rootAttributes - The root attributes.
     * @param {ReadonlyArray<NamespaceDeclaration>} rootNamespaceDeclarations - The root namespace declarations.
     * @param {OpenXmlElement[]} opaque - The opaque.
     * @param {FieldMap} fields - The fields.
     * @param {boolean} dirty - The dirty.
     * @param {string} rootPrefix - The root prefix.
     * @private
     */
    constructor(rootAttributes: ReadonlyArray<OpenXmlAttribute>, rootNamespaceDeclarations: ReadonlyArray<NamespaceDeclaration>, opaque: OpenXmlElement[], fields: FieldMap, dirty: boolean, rootPrefix: string = '') {
        this.rootPrefix = rootPrefix;
        this.rootAttributes = rootAttributes;
        this.rootNamespaceDeclarations = rootNamespaceDeclarations;
        this.opaque = opaque;
        this.fields = fields;
        this.dirty = dirty;
    }
    /**
     * @private
     * Dublin Core title (`dc:title`), if present. */
    get title(): string | undefined {
        return this.fields.get('title');
    }
    /**
     * @param {string | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    set title(value: string | undefined) {
        this.fields.set('title', value);
    }
    /**
     * @private
     * Dublin Core creator (`dc:creator`), if present. */
    get creator(): string | undefined {
        return this.fields.get('creator');
    }
    /**
     * @param {string | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    set creator(value: string | undefined) {
        this.fields.set('creator', value);
    }
    /**
     * @private
     * Dublin Core subject (`dc:subject`), if present. */
    get subject(): string | undefined {
        return this.fields.get('subject');
    }
    /**
     * @param {string | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    set subject(value: string | undefined) {
        this.fields.set('subject', value);
    }
    /**
     * @private
     * Dublin Core description (`dc:description`), if present. */
    get description(): string | undefined {
        return this.fields.get('description');
    }
    /**
     * @param {string | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    set description(value: string | undefined) {
        this.fields.set('description', value);
    }
    /**
     * @private
     * Core keywords (`cp:keywords`), if present. */
    get keywords(): string | undefined {
        return this.fields.get('keywords');
    }
    /**
     * @param {string | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    set keywords(value: string | undefined) {
        this.fields.set('keywords', value);
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isDirty(): boolean {
        return this.dirty || this.fields.dirty;
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    markClean(): void {
        this.dirty = false;
        this.fields.markClean();
    }
    /**
     * @returns {Uint8Array} The result.
     * @private
     */
    serialize(): Uint8Array {
        const children: OpenXmlChild[] = [];
        for (const key of CP_KEYS_DC) {
            const v: string = this.fields.get(key);
            if (v !== undefined) {
                children.push(dcElement(key, v));
            }
        }
        for (const key of CP_KEYS_CORE) {
            const v: string = this.fields.get(key);
            if (v !== undefined) {
                children.push(coreElement(key, v, this.rootPrefix));
            }
        }
        for (const key of CP_KEYS_TERMS) {
            const v: string = this.fields.get(key);
            if (v !== undefined) {
                children.push(termsElement(key, v));
            }
        }
        children.push(...this.opaque);
        const decls: NamespaceDeclaration[] = this.rootNamespaceDeclarations.slice();
        if (!decls.some((d: NamespaceDeclaration) => d.prefix === this.rootPrefix && d.namespaceUri === CORE_NS)) {
            decls.unshift({ prefix: this.rootPrefix, namespaceUri: CORE_NS });
        }
        for (const [prefix, uri] of [['dc', DC_NS], ['dcterms', DCTERMS_NS], ['xsi', XSI_NS]]) {
            if (!decls.some((d: NamespaceDeclaration) => d.prefix === prefix)) {
                decls.push({ prefix, namespaceUri: uri });
            }
        }
        const root: OpenXmlElement = {
            kind: 'element',
            namespaceUri: CORE_NS,
            localName: 'coreProperties',
            prefix: this.rootPrefix,
            attributes: this.rootAttributes,
            namespaceDeclarations: decls,
            children
        };
        return utf8.encode(serializeXml(root));
    }
}
function parseCoreProperties(bytes: Uint8Array | undefined): CoreProperties {
    const fields: FieldMap = new FieldMap();
    if (bytes === undefined) {
        return new CoreProperties([], [], [], fields, false);
    }
    const root: OpenXmlElement = parseXml(utf8Decoder.decode(bytes));
    if (root.localName !== 'coreProperties' || root.namespaceUri !== CORE_NS) {
        return new CoreProperties([], [], [], fields, false);
    }
    const opaque: OpenXmlElement[] = [];
    for (const child of elementChildren(root)) {
        const known: string = (CP_KEYS_DC.some((k: string) => isDcElement(child, k)) ? child.localName : undefined)
            || (CP_KEYS_CORE.some((k: string) => isCoreElement(child, k)) ? child.localName : undefined)
            || (CP_KEYS_TERMS.some((k: string) => isDctermsElement(child, k)) ? child.localName : undefined);
        if (known === undefined) {
            opaque.push(child);
            continue;
        }
        if (fields.get(known) === undefined) {
            fields.set(known, textContent(child), true);
        }
    }
    return new CoreProperties(root.attributes, root.namespaceDeclarations, opaque, fields, false, root.prefix);
}
/**
 * Extended (application) properties, `docProps/app.xml`.
 *
 * @private
 */
export class ExtendedProperties {
    /**
     * @private
     */
    readonly fields: FieldMap;
    private readonly root: OpenXmlElement | undefined;
    private readonly opaque: OpenXmlElement[];
    /**
     * @param {FieldMap} fields - The fields.
     * @param {OpenXmlElement | undefined} root - The root.
     * @param {OpenXmlElement[]} opaque - The opaque.
     * @private
     */
    constructor(fields: FieldMap, root: OpenXmlElement | undefined, opaque: OpenXmlElement[]) {
        this.fields = fields;
        this.root = root;
        this.opaque = opaque;
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isDirty(): boolean {
        return this.fields.dirty;
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    markClean(): void {
        this.fields.markClean();
    }
    /**
     * @returns {Uint8Array} The result.
     * @private
     */
    serialize(): Uint8Array {
        const children: OpenXmlElement[] = [];
        for (const key of EXTENDED_FIELD_KEYS) {
            const v: string = this.fields.get(key);
            if (v !== undefined) {
                children.push({
                    kind: 'element',
                    namespaceUri: EXT_NS,
                    localName: key,
                    prefix: this.root === undefined ? '' : this.root.prefix,
                    attributes: [],
                    namespaceDeclarations: [],
                    children: v.length > 0 ? [{ kind: 'text', value: v }] : []
                });
            }
        }
        children.push(...this.opaque);
        const root: OpenXmlElement = {
            kind: 'element',
            namespaceUri: EXT_NS,
            localName: 'Properties',
            prefix: this.root === undefined ? '' : this.root.prefix,
            attributes: this.root === undefined ? [] : this.root.attributes,
            namespaceDeclarations: this.root === undefined || this.root.namespaceDeclarations.length === 0
                ? [{ prefix: '', namespaceUri: EXT_NS }]
                : this.root.namespaceDeclarations,
            children
        };
        return utf8.encode(serializeXml(root));
    }
}
function parseExtendedProperties(bytes: Uint8Array | undefined): ExtendedProperties {
    const fields: FieldMap = new FieldMap();
    if (bytes === undefined) {
        return new ExtendedProperties(fields, undefined, []);
    }
    const root: OpenXmlElement = parseXml(utf8Decoder.decode(bytes));
    if (root.localName !== 'Properties' || root.namespaceUri !== EXT_NS) {
        return new ExtendedProperties(fields, undefined, []);
    }
    const opaque: OpenXmlElement[] = [];
    for (const child of elementChildren(root)) {
        if (
            child.namespaceUri === EXT_NS &&
            EXTENDED_FIELD_KEYS.indexOf(child.localName) >= 0 &&
            fields.get(child.localName) === undefined
        ) {
            fields.set(child.localName, textContent(child), true);
        } else {
            opaque.push(child);
        }
    }
    return new ExtendedProperties(fields, root, opaque);
}
function parseCustomProperties(bytes: Uint8Array | undefined): CustomDocumentProperties {
    if (bytes === undefined) {
        return new CustomDocumentProperties();
    }
    const root: OpenXmlElement = parseXml(utf8Decoder.decode(bytes));
    if (root.localName !== 'Properties' || root.namespaceUri !== CUSTOM_PROPERTIES_NAMESPACE) {
        return new CustomDocumentProperties();
    }
    return CustomDocumentProperties.fromXml(root);
}
/**
 * File properties parts for a document package.
 *
 * @private
 */
export class PropertiesParts implements FeaturePackageLevelPart {
    private coreValue: CoreProperties;
    private corePartName: PartName;
    private coreRelationshipId: RelationshipId | undefined;
    private corePendingRelationship: OpcRelationship | undefined;
    private readonly extValue: ExtendedProperties;
    private extPartName: PartName;
    private extRelationshipId: RelationshipId | undefined;
    private readonly customValue: CustomDocumentProperties;
    private customPartName: PartName;
    private customRelationshipId: RelationshipId | undefined;
    private builtinValue: BuiltinDocumentProperties | undefined;
    /**
     * @param {CoreProperties} core - The core.
     * @param {PartName} corePartName - The core part name.
     * @param {RelationshipId | undefined} coreRelationshipId - The core relationship id.
     * @param {ExtendedProperties} ext - The ext.
     * @param {Object} extPart - The ext part.
     * @param {CustomDocumentProperties} custom - The custom.
     * @param {Object} customPart - The custom part.
     * @private
     */
    constructor(
        core: CoreProperties,
        corePartName: PartName,
        coreRelationshipId: RelationshipId | undefined,
        ext?: ExtendedProperties,
        extPart?: { name: PartName; id: RelationshipId | undefined },
        custom?: CustomDocumentProperties,
        customPart?: { name: PartName; id: RelationshipId | undefined }
    ) {
        this.coreValue = core;
        this.corePartName = corePartName;
        this.coreRelationshipId = coreRelationshipId;
        this.corePendingRelationship = undefined;
        this.extValue = ext === undefined ? new ExtendedProperties(new FieldMap(), undefined, []) : ext;
        this.extPartName = extPart === undefined ? EXTENDED_PROPERTIES_PART_NAME : extPart.name;
        this.extRelationshipId = extPart === undefined ? undefined : extPart.id;
        this.customValue = custom === undefined ? new CustomDocumentProperties() : custom;
        this.customPartName = customPart === undefined ? CUSTOM_PROPERTIES_PART_NAME : customPart.name;
        this.customRelationshipId = customPart === undefined ? undefined : customPart.id;
    }
    /**
     * Extended (`docProps/app.xml`) properties.
     *
     * @private
     */
    get extended(): ExtendedProperties {
        return this.extValue;
    }
    /** Core Dublin Core properties. */
    get core(): CoreProperties {
        return this.coreValue;
    }
    /**
     * Built-in document properties view over core/extended parts.
     *
     * @private
     */
    get builtin(): BuiltinDocumentProperties {
        if (this.builtinValue === undefined) {
            this.builtinValue = new BuiltinDocumentProperties(this.coreValue.fields, this.extValue.fields);
        }
        return this.builtinValue;
    }
    /**
     * Custom document properties.
     *
     * @private
     */
    get custom(): CustomDocumentProperties {
        return this.customValue;
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isDirty(): boolean {
        return this.coreValue.isDirty() || this.extValue.isDirty() || this.customValue.isDirty();
    }
    /**
     * @param {OpcPackage} pkg - The pkg.
     * @returns {void} Nothing is returned.
     * @private
     */
    ensureCorePart(pkg: OpcPackage): void {
        if (this.coreRelationshipId !== undefined) {
            return;
        }
        const relId: RelationshipId = this.freshRelationshipId(pkg);
        this.corePartName = CORE_PROPERTIES_PART_NAME;
        this.coreRelationshipId = relId;
        this.corePendingRelationship = this.makeRelationship(relId, CORE_PROPERTIES_RELATIONSHIP_TYPE, 'docProps/core.xml');
    }
    private freshRelationshipId(pkg: OpcPackage): RelationshipId {
        const used: Set<string> = usedPackageRelationshipIds(pkg);
        for (const pending of [this.corePendingRelationship, this.extPendingRelationship, this.customPendingRelationship]) {
            if (pending !== undefined) {
                used.add(pending.id);
            }
        }
        return allocateRelationshipId(used);
    }
    private makeRelationship(id: RelationshipId, type: string, target: string): OpcRelationship {
        return { id, type, target, extraAttributes: [], children: [] };
    }
    private extPendingRelationship: OpcRelationship | undefined;
    private customPendingRelationship: OpcRelationship | undefined;
    private existingRelationship(pkg: OpcPackage, id: RelationshipId | undefined): OpcRelationship | undefined {
        return id === undefined ? undefined : pkg.packageRelationships.items.find((item: OpcRelationship) => item.id === id);
    }
    /**
     * @param {OpcPackage} pkg - The pkg.
     * @returns {OpcPackage} The result.
     * @private
     */
    applyToPackage(pkg: OpcPackage): OpcPackage {
        let next: OpcPackage = pkg;
        if (this.coreValue.isDirty() || this.corePendingRelationship !== undefined) {
            this.ensureCorePart(next);
            next = replaceOrAddPackageLevelPart(
                next,
                this.corePartName,
                CORE_PROPERTIES_CONTENT_TYPE,
                this.coreValue.serialize(),
                this.corePendingRelationship != null
                    ? this.corePendingRelationship
                    : this.existingRelationship(next, this.coreRelationshipId)
            );
            this.coreValue.markClean();
            this.corePendingRelationship = undefined;
        }
        if (this.extValue.isDirty()) {
            if (this.extRelationshipId === undefined) {
                this.extRelationshipId = this.freshRelationshipId(next);
                this.extPendingRelationship = this.makeRelationship(this.extRelationshipId, EXTENDED_PROPERTIES_RELATIONSHIP_TYPE, 'docProps/app.xml');
            }
            next = replaceOrAddPackageLevelPart(
                next,
                this.extPartName,
                EXTENDED_PROPERTIES_CONTENT_TYPE,
                this.extValue.serialize(),
                this.extPendingRelationship != null ? this.extPendingRelationship : this.existingRelationship(next, this.extRelationshipId)
            );
            this.extValue.markClean();
            this.extPendingRelationship = undefined;
        }
        if (this.customValue.isDirty()) {
            if (this.customRelationshipId === undefined) {
                this.customRelationshipId = this.freshRelationshipId(next);
                this.customPendingRelationship = this.makeRelationship(this.customRelationshipId, CUSTOM_PROPERTIES_RELATIONSHIP_TYPE, 'docProps/custom.xml');
            }
            next = replaceOrAddPackageLevelPart(
                next,
                this.customPartName,
                CUSTOM_PROPERTIES_CONTENT_TYPE,
                utf8.encode(serializeXml(this.customValue.toXml())),
                this.customPendingRelationship != null
                    ? this.customPendingRelationship
                    : this.existingRelationship(next, this.customRelationshipId)
            );
            this.customValue.markClean();
            this.customPendingRelationship = undefined;
        }
        return next;
    }
}
function loadPropertiesParts(pkg: OpcPackage): PropertiesParts {
    const coreRelated: { readonly relationship: OpcRelationship; readonly part: PackagePart } = findPackageRelatedPart(
        pkg,
        CORE_PROPERTIES_RELATIONSHIP_TYPE
    );
    // Empty packages (Document.create) have no core-properties relationship yet.
    // parseCoreProperties already accepts missing bytes and returns a clean shell.
    const core: CoreProperties = parseCoreProperties(coreRelated === undefined ? undefined : coreRelated.part.data);
    const corePartName: PartName = coreRelated === undefined ? CORE_PROPERTIES_PART_NAME : coreRelated.part.name;
    const coreRelationshipId: RelationshipId = coreRelated === undefined ? undefined : coreRelated.relationship.id;
    const extRelated: { readonly relationship: OpcRelationship; readonly part: PackagePart } = findPackageRelatedPart(
        pkg,
        EXTENDED_PROPERTIES_RELATIONSHIP_TYPE
    );
    const customRelated: { readonly relationship: OpcRelationship; readonly part: PackagePart } = findPackageRelatedPart(
        pkg,
        CUSTOM_PROPERTIES_RELATIONSHIP_TYPE
    );
    return new PropertiesParts(
        core,
        corePartName,
        coreRelationshipId,
        parseExtendedProperties(extRelated === undefined ? undefined : extRelated.part.data),
        {
            name: extRelated === undefined ? EXTENDED_PROPERTIES_PART_NAME : extRelated.part.name,
            id: extRelated === undefined ? undefined : extRelated.relationship.id
        },
        parseCustomProperties(customRelated === undefined ? undefined : customRelated.part.data),
        {
            name: customRelated === undefined ? CUSTOM_PROPERTIES_PART_NAME : customRelated.part.name,
            id: customRelated === undefined ? undefined : customRelated.relationship.id
        }
    );
}
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetPropertiesFeatureForTests(): void {
    registered = false;
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register the file properties package-part handler. Idempotent.
 */
export function registerPropertiesFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: PROPERTIES });
    registerFeaturePackagePartHandler({
        featureId: PROPERTIES,
        loadParts(pkg: OpcPackage, ctx: FeaturePackagePartLoadContext): PropertiesParts {
            void ctx;
            return loadPropertiesParts(pkg);
        }
    });
}
/**
 * File properties for a document. Requires {@link registerPropertiesFeature}.
 *
 * @param {WordDocument} document - The document.
 * @returns {PropertiesParts} The result.
 * @throws DocxError `UNKNOWN_FEATURE` when the module was not registered before load.
 * @private
 */
export function propertiesFor(document: WordDocument): PropertiesParts {
    const part: FeaturePartState = document.featurePart(PROPERTIES);
    if (part === undefined || !(part instanceof PropertiesParts)) {
        throw new DocxError('feature/not-registered', 'Properties parts were not loaded; call registerPropertiesFeature() before WordDocument.open');
    }
    return part;
}
function mutateCore(document: WordDocument, apply: (core: CoreProperties) => void): void {
    const properties: PropertiesParts = propertiesFor(document);
    apply(properties.core);
    properties.ensureCorePart(document.opcPackage());
}
/**
 * WordDocument title (`dc:title`).
 *
 * @param {WordDocument} document - The document.
 * @returns {string | undefined} The result.
 * @private
 */
export function documentTitle(document: WordDocument): string | undefined {
    return propertiesFor(document).core.title;
}
/**
 * Set document title (`dc:title`).
 *
 * @param {WordDocument} document - The document.
 * @param {string | undefined} title - The title.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setDocumentTitle(document: WordDocument, title: string | undefined): void {
    mutateCore(document, (core: CoreProperties) => {
        core.title = title;
    });
}
/**
 * WordDocument creator (`dc:creator`).
 *
 * @param {WordDocument} document - The document.
 * @returns {string | undefined} The result.
 * @private
 */
export function documentCreator(document: WordDocument): string | undefined {
    return propertiesFor(document).core.creator;
}
/**
 * Set document creator (`dc:creator`).
 *
 * @param {WordDocument} document - The document.
 * @param {string | undefined} creator - The creator.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setDocumentCreator(document: WordDocument, creator: string | undefined): void {
    mutateCore(document, (core: CoreProperties) => {
        core.creator = creator;
    });
}
/**
 * WordDocument subject (`dc:subject`).
 *
 * @param {WordDocument} document - The document.
 * @returns {string | undefined} The result.
 * @private
 */
export function documentSubject(document: WordDocument): string | undefined {
    return propertiesFor(document).core.subject;
}
/**
 * Set document subject (`dc:subject`).
 *
 * @param {WordDocument} document - The document.
 * @param {string | undefined} subject - The subject.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setDocumentSubject(document: WordDocument, subject: string | undefined): void {
    mutateCore(document, (core: CoreProperties) => {
        core.subject = subject;
    });
}
/**
 * WordDocument description (`dc:description`).
 *
 * @param {WordDocument} document - The document.
 * @returns {string | undefined} The result.
 * @private
 */
export function documentDescription(document: WordDocument): string | undefined {
    return propertiesFor(document).core.description;
}
/**
 * Set document description (`dc:description`).
 *
 * @param {WordDocument} document - The document.
 * @param {string | undefined} description - The description.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setDocumentDescription(document: WordDocument, description: string | undefined): void {
    mutateCore(document, (core: CoreProperties) => {
        core.description = description;
    });
}
/**
 * WordDocument keywords (`keywords`).
 *
 * @param {WordDocument} document - The document.
 * @returns {string | undefined} The result.
 * @private
 */
export function documentKeywords(document: WordDocument): string | undefined {
    return propertiesFor(document).core.keywords;
}
/**
 * Set document keywords (`keywords`).
 *
 * @param {WordDocument} document - The document.
 * @param {string | undefined} keywords - The keywords.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setDocumentKeywords(document: WordDocument, keywords: string | undefined): void {
    mutateCore(document, (core: CoreProperties) => {
        core.keywords = keywords;
    });
}
registerPropertiesFeature();

function builtinPropertiesFor(document: WordDocument): BuiltinDocumentProperties {
    return propertiesFor(document).builtin;
}
function customPropertiesFor(document: WordDocument): CustomDocumentProperties {
    return propertiesFor(document).custom;
}
Object.defineProperty(WordDocument.prototype, 'builtinDocumentProperties', {
    configurable: true,
    enumerable: false,
    get(this: WordDocument): BuiltinDocumentProperties {
        return builtinPropertiesFor(this);
    }
});
Object.defineProperty(WordDocument.prototype, 'customDocumentProperties', {
    configurable: true,
    enumerable: false,
    get(this: WordDocument): CustomDocumentProperties {
        return customPropertiesFor(this);
    }
});
