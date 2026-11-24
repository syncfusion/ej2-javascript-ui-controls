import { DocxError } from '../../core/errors/docx-error';
import { parseBodyBlocks, serializeBodyBlocks } from '../document/body-blocks';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeatureBlock } from '../document/feature-block';
import { FeatureInline } from '../document/feature-inline';
import { FeatureMultiPackagePart } from '../document/feature-multi-package-part';
import { BlockContent, Paragraph } from '../document/paragraph';
import {
    FeatureInlineParagraphItem,
    ParagraphItem,
    TextRange,
    ParagraphItemOwner,
    serializeTextRange
} from '../document/text-range';
import { FeatureInlineContent } from '../../core/registry/inline-handlers';
import { elementChildren, isWml, wmlAttr, wmlElement } from '../document/wml';
import { partByName, relationshipsForPart, OpcPackage, PackagePart } from '../../core/opc/package';
import { resolveInternalTarget, PartName } from '../../core/opc/part-name';
import { featureId, registerFeature, registerFeatureBlockHandler, registerFeatureInlineHandler, registerFeatureMultiPartHandler } from '../../core/registry/index';
import { BodyBlockParseContext, detachedBodyBlockParseContext } from '../../core/registry/block-handlers';
import { serializeFeatureInline, tryParseFeatureInline } from '../../core/registry/inline-handlers';
import { FeatureMultiPartLoadContext } from '../../core/registry/multi-part-handlers';
import { parseXml, OpenXmlElement } from '../../core/xml/index';
import { FeatureId } from '../../core/registry/feature-registry';
import { OpenXmlAttribute } from '../../core/xml/model';
const CUSTOM_XML: FeatureId = featureId('custom-xml');
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
/**
 * @private
 * Transitional custom XML datastore relationship (ECMA-376-1 Â§15.2.5). */
export const CUSTOM_XML_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml';
/**
 * @private
 * Strict custom XML datastore relationship. */
export const STRICT_CUSTOM_XML_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/customXml';
/**
 * @private
 * Transitional custom XML properties relationship (ECMA-376-1 Â§15.2.6). */
export const CUSTOM_XML_PROPS_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXmlProps';
/**
 * @private
 * Strict custom XML properties relationship. */
export const STRICT_CUSTOM_XML_PROPS_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/customXmlProps';
/**
 * @private
 * Custom XML Data Storage Properties part content type. */
export const CUSTOM_XML_PROPS_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.customXmlProperties+xml';
/**
 * @private
 * Custom XML Data Storage part content type (ECMA-376-1 Â§15.2.5). */
export const CUSTOM_XML_DATA_CONTENT_TYPE: string = 'application/xml';
/**
 * @private
 * Root namespace for custom XML properties parts. */
export const CUSTOM_XML_PROPS_NAMESPACE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/customXml';
const CUSTOM_XML_RELATIONSHIP_TYPES: string[] = [
    CUSTOM_XML_RELATIONSHIP_TYPE,
    STRICT_CUSTOM_XML_RELATIONSHIP_TYPE
];
const CUSTOM_XML_PROPS_RELATIONSHIP_TYPES: string[] = [
    CUSTOM_XML_PROPS_RELATIONSHIP_TYPE,
    STRICT_CUSTOM_XML_PROPS_RELATIONSHIP_TYPE
];
function unqualifiedAttribute(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName &&
        (a.namespaceUri === '' || a.prefix === 'w' || a.namespaceUri.includes('wordprocessingml')))), ts330 == null ? undefined : ts330.value);
}
/**
 * Custom XML property attribute from `w:customXmlPr/w:attr`.
 * Preserve-only; not part of the supported public surface.
 *
 * @private
 */
export interface CustomXmlAttribute {
    /**
     * @private
     * Attribute namespace URI, when present. */
    readonly uri: string | undefined;
    /**
     * @private
     * Attribute local name (`w:name`). */
    readonly name: string;
    /**
     * @private
     * Attribute value (`w:val`). */
    readonly val: string;
}
/**
 * Custom XML wrapper properties read from `w:customXmlPr`.
 * Preserve-only; not part of the supported public surface.
 *
 * @private
 */
export class CustomXmlProperties {
    /**
     * @private
     * Placeholder text from `w:placeholder/@w:val`, when present. */
    readonly placeholder: string | undefined;
    /**
     * @private
     * `w:attr` entries under `w:customXmlPr`. */
    readonly attributes: ReadonlyArray<CustomXmlAttribute>;
    /**
     * @param {string | undefined} placeholder - The placeholder.
     * @param {ReadonlyArray<CustomXmlAttribute>} attributes - The attributes.
     * @private
     */
    constructor(placeholder: string | undefined, attributes: ReadonlyArray<CustomXmlAttribute>) {
        this.placeholder = placeholder;
        this.attributes = attributes;
    }
}
function parseCustomXmlAttribute(element: OpenXmlElement): CustomXmlAttribute | undefined {
    if (!isWml(element, 'attr')) {
        return undefined;
    }
    const name: string = unqualifiedAttribute(element, 'name');
    const val: string = unqualifiedAttribute(element, 'val');
    if (name === undefined || name.length === 0 || val === undefined) {
        return undefined;
    }
    const uri: string = unqualifiedAttribute(element, 'uri');
    return { uri, name, val };
}
function parseCustomXmlProperties(customXmlPr: OpenXmlElement | undefined): CustomXmlProperties | undefined {
    if (customXmlPr === undefined || !isWml(customXmlPr, 'customXmlPr')) {
        return undefined;
    }
    let placeholder: string | undefined;
    const attributes: CustomXmlAttribute[] = [];
    for (const child of elementChildren(customXmlPr)) {
        if (isWml(child, 'placeholder')) {
            placeholder = unqualifiedAttribute(child, 'val');
            continue;
        }
        const attribute: CustomXmlAttribute = parseCustomXmlAttribute(child);
        if (attribute !== undefined) {
            attributes.push(attribute);
        }
    }
    if (placeholder === undefined && attributes.length === 0) {
        return undefined;
    }
    return new CustomXmlProperties(placeholder, attributes);
}
type CustomXmlInlineItem =
    | { readonly type: 'textRange'; readonly run: TextRange }
    | { readonly type: 'opaque'; readonly xml: OpenXmlElement }
    | FeatureInlineContent;
const detachedRunOwner: ParagraphItemOwner = {
    assertAttachedItem(): void {
        return;
    }
};
function parseInlineContent(children: ReadonlyArray<{
    kind: string;
}>, owner: ParagraphItemOwner): CustomXmlInlineItem[] {
    const inlines: CustomXmlInlineItem[] = [];
    for (const child of children) {
        if (child.kind !== 'element') {
            continue;
        }
        const element: OpenXmlElement = child as OpenXmlElement;
        if (isWml(element, 'r')) {
            inlines.push({ type: 'textRange', run: TextRange.fromXml(element, owner) });
            continue;
        }
        const feature: FeatureInlineContent = tryParseFeatureInline(element);
        if (feature !== undefined) {
            inlines.push(feature);
            continue;
        }
        inlines.push({ type: 'opaque', xml: element });
    }
    return inlines;
}
function serializeInlineContent(inlines: ReadonlyArray<CustomXmlInlineItem>): OpenXmlElement[] {
    const out: OpenXmlElement[] = [];
    for (const inline of inlines) {
        if (inline.type === 'textRange') {
            out.push(serializeTextRange(inline.run));
        }
        else if (inline.type === 'feature') {
            out.push(serializeFeatureInline(inline));
        }
        else {
            out.push(inline.xml);
        }
    }
    return out;
}
function releaseBlockContent(blocks: ReadonlyArray<BlockContent>): void {
    for (const block of blocks) {
        if (block.type === 'feature' && block.value instanceof CustomXmlMarkup) {
            block.value.releaseContent();
        }
    }
}
function releaseInlineContent(inlines: ReadonlyArray<CustomXmlInlineItem>): void {
    for (const inline of inlines) {
        if (inline.type === 'feature' && inline.value instanceof CustomXmlMarkup) {
            inline.value.releaseContent();
        }
    }
}
/**
 * Preserve-only in-body custom XML wrapper (`w:customXml`) at block or run level.
 * Markup and children round-trip; bindings are never resolved. No schema
 * validation, data-source mutation, or binding-editor API is provided.
 *
 * @private
 */
export class CustomXmlMarkup implements FeatureInline, FeatureBlock {
    /**
     * @private
     * `w:element` attribute value. */
    readonly elementName: string;
    /**
     * @private
     * `w:uri` attribute value, when present. */
    readonly uri: string | undefined;
    /**
     * @private
     * Parsed `w:customXmlPr`, when present. */
    readonly properties: CustomXmlProperties | undefined;
    private readonly customXmlPr: OpenXmlElement | undefined;
    private readonly blocks: BlockContent[] | undefined;
    private readonly inlines: CustomXmlInlineItem[] | undefined;
    private readonly preservedXml: OpenXmlElement | undefined;
    /**
     * @param {string} elementName - The element name.
     * @param {string | undefined} uri - The uri.
     * @param {CustomXmlProperties | undefined} properties - The properties.
     * @param {OpenXmlElement | undefined} customXmlPr - The custom xml pr.
     * @param {BlockContent[] | undefined} blocks - The blocks.
     * @param {CustomXmlInlineItem[] | undefined} inlines - The inlines.
     * @param {OpenXmlElement | undefined} preservedXml - The preserved xml.
     * @private
     */
    constructor(
        elementName: string,
        uri: string | undefined,
        properties: CustomXmlProperties | undefined,
        customXmlPr: OpenXmlElement | undefined,
        blocks: BlockContent[] | undefined,
        inlines: CustomXmlInlineItem[] | undefined,
        preservedXml: OpenXmlElement | undefined
    ) {
        this.elementName = elementName;
        this.uri = uri;
        this.properties = properties;
        this.customXmlPr = customXmlPr;
        this.blocks = blocks;
        this.inlines = inlines;
        this.preservedXml = preservedXml;
    }
    /**
     * @private
     * Block-level inner content, when loaded from a body block. */
    get blockContent(): ReadonlyArray<BlockContent> | undefined {
        return this.blocks;
    }
    /**
     * @private
     * Run-level inner content, when loaded from a paragraph inline. */
    get inlineContent(): ReadonlyArray<CustomXmlInlineItem> | undefined {
        return this.inlines;
    }
    /**
     * @private
     * Visible paragraph text inside a block wrapper, when present. */
    get firstParagraphText(): string | undefined {
        if (this.blocks === undefined) {
            return undefined;
        }
        for (const block of this.blocks) {
            if (block.type !== 'paragraph') {
                continue;
            }
            for (const inline of block.paragraph.items) {
                if (inline instanceof TextRange && inline.text.length > 0) {
                    return inline.text;
                }
            }
        }
        return undefined;
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    releaseContent(): void {
        if (this.blocks !== undefined) {
            releaseBlockContent(this.blocks);
        }
        if (this.inlines !== undefined) {
            releaseInlineContent(this.inlines);
        }
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     * Serialize to `w:customXml` (or preserved original element).
     */
    toOpenXml(): OpenXmlElement {
        if (this.preservedXml !== undefined) {
            return this.preservedXml;
        }
        const attributes: OpenXmlAttribute[] = [wmlAttr('element', this.elementName)];
        if (this.uri !== undefined && this.uri.length > 0) {
            attributes.push(wmlAttr('uri', this.uri));
        }
        const children: OpenXmlElement[] = [];
        if (this.customXmlPr !== undefined) {
            children.push(this.customXmlPr);
        }
        if (this.blocks !== undefined) {
            children.push(...serializeBodyBlocks(this.blocks));
        }
        else if (this.inlines !== undefined) {
            children.push(...serializeInlineContent(this.inlines));
        }
        return wmlElement('customXml', { attributes, children });
    }
}
function splitCustomXmlChildren(element: OpenXmlElement): {
    readonly customXmlPr: OpenXmlElement | undefined;
    readonly content: ReadonlyArray<OpenXmlElement>;
} {
    const content: OpenXmlElement[] = [];
    let customXmlPr: OpenXmlElement | undefined;
    for (const child of elementChildren(element)) {
        if (isWml(child, 'customXmlPr')) {
            customXmlPr = child;
        }
        else {
            content.push(child);
        }
    }
    return { customXmlPr, content };
}
function parseCustomXmlMarkup(element: OpenXmlElement, mode: 'block' | 'inline', ctx: BodyBlockParseContext): CustomXmlMarkup | undefined {
    if (!isWml(element, 'customXml')) {
        return undefined;
    }
    const elementName: string = unqualifiedAttribute(element, 'element');
    if (elementName === undefined || elementName.length === 0) {
        return new CustomXmlMarkup('', undefined, undefined, undefined, undefined, undefined, element);
    }
    const uri: string = unqualifiedAttribute(element, 'uri');
    const { customXmlPr, content } = splitCustomXmlChildren(element);
    const properties: CustomXmlProperties = parseCustomXmlProperties(customXmlPr);
    if (mode === 'block') {
        const blocks: BlockContent[] = parseBodyBlocks(content, ctx);
        return new CustomXmlMarkup(elementName, uri, properties, customXmlPr, blocks, undefined, undefined);
    }
    const inlines: CustomXmlInlineItem[] = parseInlineContent(content, detachedRunOwner);
    return new CustomXmlMarkup(elementName, uri, properties, customXmlPr, undefined, inlines, undefined);
}
function parseItemIdFromProps(data: Uint8Array): string | undefined {
    let ts331: any;
    try {
        const root: OpenXmlElement = parseXml(utf8Decoder.decode(data));
        if (root.localName !== 'datastoreItem') {
            return undefined;
        }
        return ((ts331 = root.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === 'itemID' &&
            (attribute.namespaceUri === CUSTOM_XML_PROPS_NAMESPACE ||
                attribute.namespaceUri === '' ||
                attribute.namespaceUri.includes('customXml')))), ts331 == null ? undefined : ts331.value);
    }
    catch {
        return undefined;
    }
}
/**
 * One Custom XML item part plus optional properties part.
 * Preserve-only; not part of the supported public surface.
 *
 * @private
 */
export class CustomXmlStorageItem {
    /**
     * @private
     * Item part name in the package. */
    readonly partName: PartName;
    /**
     * @private
     * Opaque item payload bytes. */
    readonly data: Uint8Array;
    /**
     * @private
     * Part content type. */
    readonly contentType: string;
    /**
     * @private
     * `itemID` from the properties part, when present. */
    readonly itemId: string | undefined;
    /**
     * @private
     * Linked custom XML properties part name, when present. */
    readonly propertiesPartName: PartName | undefined;
    /**
     * @private
     * Opaque properties-part bytes, when present. */
    readonly propertiesData: Uint8Array | undefined;
    /**
     * @private
     * Properties-part content type, when present. */
    readonly propertiesContentType: string | undefined;
    /**
     * @param {PartName} partNameValue - The part name value.
     * @param {Uint8Array} data - The data.
     * @param {string} contentType - The content type.
     * @param {string | undefined} itemId - The item id.
     * @param {PartName | undefined} propertiesPartName - The properties part name.
     * @param {Uint8Array | undefined} propertiesData - The properties data.
     * @param {string | undefined} propertiesContentType - The properties content type.
     * @private
     */
    constructor(
        partNameValue: PartName,
        data: Uint8Array,
        contentType: string,
        itemId: string | undefined,
        propertiesPartName: PartName | undefined,
        propertiesData: Uint8Array | undefined,
        propertiesContentType: string | undefined
    ) {
        this.partName = partNameValue;
        this.data = data;
        this.contentType = contentType;
        this.itemId = itemId;
        this.propertiesPartName = propertiesPartName;
        this.propertiesData = propertiesData;
        this.propertiesContentType = propertiesContentType;
    }
}
/**
 * Preserve-only Custom XML datastore catalog linked from the Main Document.
 * Items round-trip as opaque bytes; no mutation or binding API is provided.
 * Not part of the supported public surface.
 *
 * @private
 */
export class CustomXmlDatastore implements FeatureMultiPackagePart {
    private readonly storageItems: ReadonlyArray<CustomXmlStorageItem>;
    /**
     * @param {ReadonlyArray<CustomXmlStorageItem>} storageItems - The storage items.
     * @private
     */
    constructor(storageItems: ReadonlyArray<CustomXmlStorageItem>) {
        this.storageItems = storageItems;
    }
    /**
     * @private
     * Loaded datastore items in relationship order. */
    get items(): ReadonlyArray<CustomXmlStorageItem> {
        return this.storageItems;
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isDirty(): boolean {
        return false;
    }
    /**
     * @param {OpcPackage} pkg - The pkg.
     * @param {PartName} mainPartName - The main part name.
     * @returns {OpcPackage} The result.
     * @private
     */
    applyToPackage(pkg: OpcPackage, mainPartName: PartName): OpcPackage {
        void mainPartName;
        return pkg;
    }
}
function isCustomXmlRelationship(type: string): boolean {
    return CUSTOM_XML_RELATIONSHIP_TYPES.indexOf(type as (typeof CUSTOM_XML_RELATIONSHIP_TYPES)[number]) !== -1;
}
function isCustomXmlPropsRelationship(type: string): boolean {
    return CUSTOM_XML_PROPS_RELATIONSHIP_TYPES.indexOf(type as (typeof CUSTOM_XML_PROPS_RELATIONSHIP_TYPES)[number]) !== -1;
}
function loadDatastore(pkg: OpcPackage, mainPartName: PartName): CustomXmlDatastore {
    const items: CustomXmlStorageItem[] = [];
    for (const rel of relationshipsForPart(pkg, mainPartName).items) {
        if (!isCustomXmlRelationship(rel.type)) {
            continue;
        }
        const itemPartName: PartName = resolveInternalTarget(rel.target, mainPartName);
        const itemPart: PackagePart = partByName(pkg, itemPartName);
        if (itemPart === undefined) {
            continue;
        }
        let propertiesPartName: PartName | undefined;
        let propertiesData: Uint8Array | undefined;
        let propertiesContentType: string | undefined;
        let itemId: string | undefined;
        for (const propsRel of relationshipsForPart(pkg, itemPartName).items) {
            if (!isCustomXmlPropsRelationship(propsRel.type)) {
                continue;
            }
            propertiesPartName = resolveInternalTarget(propsRel.target, itemPartName);
            const propsPart: PackagePart = partByName(pkg, propertiesPartName);
            if (propsPart === undefined) {
                continue;
            }
            propertiesData = propsPart.data;
            propertiesContentType = propsPart.contentType;
            itemId = parseItemIdFromProps(propsPart.data);
            break;
        }
        items.push(
            new CustomXmlStorageItem(
                itemPartName,
                itemPart.data,
                itemPart.contentType,
                itemId,
                propertiesPartName,
                propertiesData,
                propertiesContentType
            )
        );
    }
    return new CustomXmlDatastore(items);
}
function markupFromBlocks(blocks: ReadonlyArray<BlockContent>): CustomXmlMarkup[] {
    const found: CustomXmlMarkup[] = [];
    for (const block of blocks) {
        if (block.type === 'feature' && block.value instanceof CustomXmlMarkup) {
            found.push(block.value);
        }
    }
    return found;
}
function markupFromInlines(inlines: ReadonlyArray<ParagraphItem>): CustomXmlMarkup[] {
    const found: CustomXmlMarkup[] = [];
    for (const inline of inlines) {
        if (inline instanceof FeatureInlineParagraphItem && inline.value instanceof CustomXmlMarkup) {
            found.push(inline.value);
        }
    }
    return found;
}
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetCustomXmlFeatureForTests(): void {
    registered = false;
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register custom XML markup and datastore handlers. Idempotent.
 */
export function registerCustomXmlFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: CUSTOM_XML });
    registerFeatureMultiPartHandler({
        featureId: CUSTOM_XML,
        relationshipTypes: CUSTOM_XML_RELATIONSHIP_TYPES,
        loadParts(pkg: OpcPackage, ctx: FeatureMultiPartLoadContext): CustomXmlDatastore {
            return loadDatastore(pkg, ctx.mainPartName);
        }
    });
    registerFeatureInlineHandler({
        featureId: CUSTOM_XML,
        wmlLocalName: 'customXml',
        tryParse(element: OpenXmlElement): CustomXmlMarkup | undefined {
            return parseCustomXmlMarkup(element, 'inline', detachedBodyBlockParseContext());
        }
    });
    registerFeatureBlockHandler({
        featureId: CUSTOM_XML,
        wmlLocalName: 'customXml',
        tryParse(element: OpenXmlElement, ctx: BodyBlockParseContext): CustomXmlMarkup | undefined {
            return parseCustomXmlMarkup(element, 'block', ctx);
        }
    });
}
/**
 * Custom XML datastore linked from the Main Document.
 * Returns the preserve-only catalog; not part of the supported public surface.
 *
 * @param {WordDocument} document - The document.
 * @returns {CustomXmlDatastore} The result.
 * @private
 */
export function customXmlDatastore(document: WordDocument): CustomXmlDatastore {
    const part: FeaturePartState = document.featurePart(CUSTOM_XML);
    if (part === undefined || !(part instanceof CustomXmlDatastore)) {
        throw new DocxError('feature/not-registered', 'Custom XML datastore was not loaded; call registerCustomXmlFeature() before WordDocument.open');
    }
    return part;
}
/**
 * Block-level custom XML wrappers in a block list, in document order.
 *
 * @param {ReadonlyArray<BlockContent>} blocks - The blocks.
 * @returns {ReadonlyArray<CustomXmlMarkup>} The result.
 * @private
 */
export function customXmlMarkupInBlocks(blocks: ReadonlyArray<BlockContent>): ReadonlyArray<CustomXmlMarkup> {
    return markupFromBlocks(blocks);
}
/**
 * Run-level custom XML wrappers in a paragraph, in document order.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<CustomXmlMarkup>} The result.
 * @private
 */
export function customXmlMarkupInParagraph(paragraph: Paragraph): ReadonlyArray<CustomXmlMarkup> {
    return markupFromInlines(paragraph.items.toArray());
}
/**
 * Whether inline content is modeled custom XML from this module.
 *
 * @param {ParagraphItem} inline - The inline.
 * @returns {Object} The result.
 * @private
 */
export function isCustomXmlMarkupInline(
    inline: ParagraphItem
): inline is FeatureInlineParagraphItem & { value: CustomXmlMarkup } {
    return (
        inline instanceof FeatureInlineParagraphItem &&
        inline.featureId === CUSTOM_XML &&
        inline.value instanceof CustomXmlMarkup
    );
}
registerCustomXmlFeature();
