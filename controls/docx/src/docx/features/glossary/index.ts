import { DocxError } from '../../core/errors/docx-error';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeaturePackagePart } from '../document/feature-package-part';
import { elementChildren, isWml } from '../document/wml';
import { partName, PartName } from '../../core/opc/part-name';
import { PackagePart } from '../../core/opc/package';
import { featureId, registerFeature, registerFeaturePartHandler } from '../../core/registry/index';
import { FeaturePartLoadContext } from '../../core/registry/part-handlers';
import { parseXml, WML_TRANSITIONAL_NAMESPACE, OpenXmlElement } from '../../core/xml/index';
import { FeatureId } from '../../core/registry/feature-registry';
import { OpenXmlAttribute } from '../../core/xml/model';
const GLOSSARY: FeatureId = featureId('glossary');
/**
 * @private
 * Transitional glossary document relationship (ECMA-376-4 §9.2.8). */
export const GLOSSARY_DOCUMENT_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/glossaryDocument';
/**
 * @private
 * Strict glossary document relationship (ECMA-376-1 §11.3.8). */
export const STRICT_GLOSSARY_DOCUMENT_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/glossaryDocument';
/**
 * @private
 * ECMA-376-1 §11.3.8 Glossary WordDocument content type. */
export const GLOSSARY_DOCUMENT_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml';
/**
 * @private
 */
export const GLOSSARY_DOCUMENT_PART_NAME: PartName = partName('/glossary/document.xml');
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
interface DocPartSummary {
    readonly name: string;
    readonly category: string | undefined;
    readonly gallery: string | undefined;
}
interface GlossaryMetadata {
    readonly docParts: ReadonlyArray<DocPartSummary>;
}
const EMPTY_METADATA: GlossaryMetadata = { docParts: [] };
function wmlAttribute(element: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === localName &&
        (attribute.namespaceUri === WML_TRANSITIONAL_NAMESPACE || attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
function parseDocPartProperties(docPartPr: OpenXmlElement): DocPartSummary | undefined {
    let name: string | undefined;
    let category: string | undefined;
    let gallery: string | undefined;
    for (const child of elementChildren(docPartPr)) {
        if (isWml(child, 'name')) {
            name = wmlAttribute(child, 'val');
            continue;
        }
        if (!isWml(child, 'category')) {
            continue;
        }
        for (const categoryChild of elementChildren(child)) {
            if (isWml(categoryChild, 'name')) {
                category = wmlAttribute(categoryChild, 'val');
            }
            else if (isWml(categoryChild, 'gallery')) {
                gallery = wmlAttribute(categoryChild, 'val');
            }
        }
    }
    if (name === undefined || name.length === 0) {
        return undefined;
    }
    return { name, category, gallery };
}
function parseDocPart(docPart: OpenXmlElement): DocPartSummary | undefined {
    for (const child of elementChildren(docPart)) {
        if (isWml(child, 'docPartPr')) {
            return parseDocPartProperties(child);
        }
    }
    return undefined;
}
function parseGlossaryMetadata(root: OpenXmlElement): GlossaryMetadata | undefined {
    if (!isWml(root, 'glossaryDocument')) {
        return undefined;
    }
    const docParts: DocPartSummary[] = [];
    for (const child of elementChildren(root)) {
        if (!isWml(child, 'docParts')) {
            continue;
        }
        for (const docPart of elementChildren(child)) {
            if (!isWml(docPart, 'docPart')) {
                continue;
            }
            const summary: DocPartSummary = parseDocPart(docPart);
            if (summary !== undefined) {
                docParts.push(summary);
            }
        }
    }
    return { docParts };
}
function parseGlossaryMetadataFromBytes(bytes: Uint8Array): GlossaryMetadata | undefined {
    if (bytes.byteLength === 0) {
        return undefined;
    }
    try {
        const root: OpenXmlElement = parseXml(utf8Decoder.decode(bytes));
        return parseGlossaryMetadata(root);
    }
    catch {
        return undefined;
    }
}
/**
 * Preserve-only Glossary WordDocument part (`glossary/document.xml`).
 * Building-block body content is opaque; name/category/gallery metadata is
 * read-only catalog access. No building-block editor or mutation API is provided.
 *
 * @private
 */
export class GlossaryDocumentPart implements FeaturePackagePart {
    private readonly bytes: Uint8Array | undefined;
    private readonly metadata: GlossaryMetadata;
    private readonly dirty: boolean;
    /**
     * @param {Uint8Array | undefined} bytes - The bytes.
     * @param {GlossaryMetadata} metadata - The metadata.
     * @param {boolean} dirty - The dirty.
     * @private
     */
    constructor(bytes: Uint8Array | undefined, metadata: GlossaryMetadata, dirty: boolean) {
        this.bytes = bytes;
        this.metadata = metadata;
        this.dirty = dirty;
    }
    /**
     * Whether the glossary part was present in the package.
     *
     * @returns {boolean} The result.
     * @public
     */
    present(): boolean {
        return this.bytes !== undefined;
    }
    /**
     * Count of `w:docParts/w:docPart` entries with a readable `w:name`.
     *
     * @returns {number} The result.
     * @public
     */
    docPartCount(): number {
        return this.metadata.docParts.length;
    }
    /**
     * `w:docPartPr/w:name/@w:val` values in document order.
     *
     * @returns {ReadonlyArray<string>} The result.
     * @public
     */
    docPartNames(): ReadonlyArray<string> {
        return this.metadata.docParts.map((entry: DocPartSummary) => entry.name);
    }
    /**
     * `w:category/w:name/@w:val` for a doc part name, or `undefined` when absent.
     *
     * @param {string} name - The name.
     * @returns {string | undefined} The result.
     * @public
     */
    docPartCategory(name: string): string | undefined {
        let ts330: any;
        return (
            (ts330 = this.metadata.docParts.find((entry: DocPartSummary) => entry.name === name)),
            ts330 == null ? undefined : ts330.category
        );
    }
    /**
     * `w:category/w:gallery/@w:val` for a doc part name, or `undefined` when absent.
     *
     * @param {string} name - The name.
     * @returns {string | undefined} The result.
     * @public
     */
    docPartGallery(name: string): string | undefined {
        let ts331: any;
        return (
            (ts331 = this.metadata.docParts.find((entry: DocPartSummary) => entry.name === name)),
            ts331 == null ? undefined : ts331.gallery
        );
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isDirty(): boolean {
        return this.dirty;
    }
    /**
     * @returns {Uint8Array} The result.
     * @private
     */
    serialize(): Uint8Array {
        if (this.bytes !== undefined) {
            return this.bytes;
        }
        return new Uint8Array(0);
    }
}
function loadGlossaryDocumentPart(part: PackagePart | undefined): GlossaryDocumentPart {
    let ts332: any;
    if (part === undefined) {
        return new GlossaryDocumentPart(undefined, EMPTY_METADATA, false);
    }
    const metadata: GlossaryMetadata = ((ts332 = parseGlossaryMetadataFromBytes(part.data)), ts332 != null ? ts332 : EMPTY_METADATA);
    return new GlossaryDocumentPart(part.data, metadata, false);
}
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetGlossaryFeatureForTests(): void {
    registered = false;
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register the glossary document package-part handler. Idempotent.
 */
export function registerGlossaryFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: GLOSSARY });
    registerFeaturePartHandler({
        featureId: GLOSSARY,
        relationshipTypes: [GLOSSARY_DOCUMENT_RELATIONSHIP_TYPE, STRICT_GLOSSARY_DOCUMENT_RELATIONSHIP_TYPE],
        defaultRelativeTarget: 'glossary/document.xml',
        partName: GLOSSARY_DOCUMENT_PART_NAME,
        contentType: GLOSSARY_DOCUMENT_CONTENT_TYPE,
        loadPart(part: PackagePart | undefined, ctx: FeaturePartLoadContext): GlossaryDocumentPart {
            void ctx;
            return loadGlossaryDocumentPart(part);
        }
    });
}
/**
 * Glossary document catalog for a package. Requires {@link registerGlossaryFeature}.
 *
 * @param {WordDocument} document - The document.
 * @returns {GlossaryDocumentPart} The result.
 * @throws DocxError `UNKNOWN_FEATURE` when the module was not registered before load.
 *
 * @private
 */
export function glossaryFor(document: WordDocument): GlossaryDocumentPart {
    const part: FeaturePartState = document.featurePart(GLOSSARY);
    if (part === undefined || !(part instanceof GlossaryDocumentPart)) {
        throw new DocxError('feature/not-registered', 'Glossary document part was not loaded; call registerGlossaryFeature() before WordDocument.open');
    }
    return part;
}
registerGlossaryFeature();
