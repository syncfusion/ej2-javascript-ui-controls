import { DocxError } from '../../core/errors/docx-error';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeatureMultiPackagePart } from '../document/feature-multi-package-part';
import { partByName, relationshipsForPart, OpcPackage, PackagePart } from '../../core/opc/package';
import { resolveInternalTarget, PartName } from '../../core/opc/part-name';
import { featureId, registerFeature, registerFeatureMultiPartHandler } from '../../core/registry/index';
import { FeatureMultiPartLoadContext } from '../../core/registry/multi-part-handlers';
import { parseXml, OpenXmlElement } from '../../core/xml/index';
import { FeatureId } from '../../core/registry/feature-registry';
import { OpenXmlAttribute, OpenXmlChild } from '../../core/xml/model';
const BIBLIOGRAPHY: FeatureId = featureId('bibliography');
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
/**
 * @private
 * Transitional bibliography namespace (ECMA-376-4 §13.2.3). */
export const BIBLIOGRAPHY_NAMESPACE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/bibliography';
/**
 * @private
 * Strict bibliography namespace (ECMA-376-1 §15.2.3). */
export const BIBLIOGRAPHY_STRICT_NAMESPACE: string = 'http://purl.oclc.org/ooxml/officeDocument/bibliography';
/**
 * @private
 * Transitional customXml relationship used by Bibliography parts (ECMA-376-1 §15.2.3). */
export const BIBLIOGRAPHY_CUSTOM_XML_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml';
/**
 * @private
 * Strict customXml relationship used by Bibliography parts. */
export const STRICT_BIBLIOGRAPHY_CUSTOM_XML_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/customXml';
/**
 * @private
 * Bibliography part content type (ECMA-376-1 §15.2.3). */
export const BIBLIOGRAPHY_CONTENT_TYPE: string = 'application/xml';
const CUSTOM_XML_RELATIONSHIP_TYPES: string[] = [
    BIBLIOGRAPHY_CUSTOM_XML_RELATIONSHIP_TYPE,
    STRICT_BIBLIOGRAPHY_CUSTOM_XML_RELATIONSHIP_TYPE
];
const EMPTY_METADATA: {
    present: boolean;
    sourceCount: number;
    styleName: string;
    selectedStyle: string;
    sourceTags: ReadonlyArray<string>;
} = {
    present: false,
    sourceCount: 0,
    styleName: undefined as string | undefined,
    selectedStyle: undefined as string | undefined,
    sourceTags: [] as ReadonlyArray<string>
};
function isBibliographyNamespace(namespaceUri: string): boolean {
    return namespaceUri === BIBLIOGRAPHY_NAMESPACE || namespaceUri === BIBLIOGRAPHY_STRICT_NAMESPACE;
}
function bibliographyAttribute(element: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === localName &&
        (isBibliographyNamespace(attribute.namespaceUri) || attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
function bibliographyChildElements(element: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return element.children.filter((child: OpenXmlChild): child is OpenXmlElement => child.kind === 'element' && isBibliographyNamespace(child.namespaceUri));
}
function bibliographyText(element: OpenXmlElement): string | undefined {
    for (const child of element.children) {
        if (child.kind === 'text' && child.value.length > 0) {
            return child.value;
        }
    }
    return undefined;
}
interface BibliographyMetadata {
    readonly present: boolean;
    readonly sourceCount: number;
    readonly styleName: string | undefined;
    readonly selectedStyle: string | undefined;
    readonly sourceTags: ReadonlyArray<string>;
}
function parseBibliographyMetadata(root: OpenXmlElement): BibliographyMetadata | undefined {
    if (root.localName !== 'Sources' || !isBibliographyNamespace(root.namespaceUri)) {
        return undefined;
    }
    const sourceTags: string[] = [];
    let sourceCount: number = 0;
    for (const child of bibliographyChildElements(root)) {
        if (child.localName !== 'Source') {
            continue;
        }
        sourceCount += 1;
        for (const field of bibliographyChildElements(child)) {
            if (field.localName !== 'Tag') {
                continue;
            }
            const tag: string = bibliographyText(field);
            if (tag !== undefined && tag.length > 0) {
                sourceTags.push(tag);
            }
            break;
        }
    }
    return {
        present: true,
        sourceCount,
        styleName: bibliographyAttribute(root, 'StyleName'),
        selectedStyle: bibliographyAttribute(root, 'SelectedStyle'),
        sourceTags
    };
}
function parseBibliographyMetadataFromBytes(bytes: Uint8Array): BibliographyMetadata | undefined {
    if (bytes.byteLength === 0) {
        return undefined;
    }
    try {
        const root: OpenXmlElement = parseXml(utf8Decoder.decode(bytes));
        return parseBibliographyMetadata(root);
    }
    catch {
        return undefined;
    }
}
/**
 * Preserve-only bibliography sources catalog linked from the Main Document via a
 * `customXml` relationship. Source field content is opaque; style name and tags
 * are read-only metadata. No source editor or mutation API is provided.
 *
 * @private
 */
export class BibliographyCatalog implements FeatureMultiPackagePart {
    private readonly metadata: BibliographyMetadata;
    /**
     * @param {BibliographyMetadata} metadata - The metadata.
     * @private
     */
    constructor(metadata: BibliographyMetadata) {
        this.metadata = metadata;
    }
    /**
     * Whether a Bibliography part (`b:Sources` root) was found.
     *
     * @returns {boolean} The result.
     * @public
     */
    present(): boolean {
        return this.metadata.present;
    }
    /**
     * Count of `b:Source` children under `b:Sources`.
     *
     * @returns {number} The result.
     * @public
     */
    sourceCount(): number {
        return this.metadata.sourceCount;
    }
    /**
     * `b:Sources/@StyleName`, or `undefined` when absent.
     *
     * @returns {string | undefined} The result.
     * @public
     */
    styleName(): string | undefined {
        return this.metadata.styleName;
    }
    /**
     * `b:Sources/@SelectedStyle`, or `undefined` when absent.
     *
     * @returns {string | undefined} The result.
     * @public
     */
    selectedStyle(): string | undefined {
        return this.metadata.selectedStyle;
    }
    /**
     * `b:Source/b:Tag` text values in document order.
     *
     * @returns {ReadonlyArray<string>} The result.
     * @public
     */
    sourceTags(): ReadonlyArray<string> {
        return this.metadata.sourceTags;
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
function loadBibliographyCatalog(pkg: OpcPackage, mainPartName: PartName): BibliographyCatalog {
    for (const rel of relationshipsForPart(pkg, mainPartName).items) {
        if (CUSTOM_XML_RELATIONSHIP_TYPES.indexOf(rel.type as (typeof CUSTOM_XML_RELATIONSHIP_TYPES)[number]) === -1) {
            continue;
        }
        const itemPartName: PartName = resolveInternalTarget(rel.target, mainPartName);
        const itemPart: PackagePart = partByName(pkg, itemPartName);
        if (itemPart === undefined) {
            continue;
        }
        const metadata: BibliographyMetadata = parseBibliographyMetadataFromBytes(itemPart.data);
        if (metadata === undefined) {
            continue;
        }
        return new BibliographyCatalog(metadata);
    }
    return new BibliographyCatalog({ ...EMPTY_METADATA });
}
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetBibliographyFeatureForTests(): void {
    registered = false;
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register the bibliography detection handler. Idempotent.
 */
export function registerBibliographyFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: BIBLIOGRAPHY });
    registerFeatureMultiPartHandler({
        featureId: BIBLIOGRAPHY,
        relationshipTypes: CUSTOM_XML_RELATIONSHIP_TYPES,
        loadParts(pkg: OpcPackage, ctx: FeatureMultiPartLoadContext): BibliographyCatalog {
            return loadBibliographyCatalog(pkg, ctx.mainPartName);
        }
    });
}
/**
 * Bibliography catalog for a document. Requires {@link registerBibliographyFeature}.
 *
 * @param {WordDocument} document - The document.
 * @returns {BibliographyCatalog} The result.
 * @throws DocxError `UNKNOWN_FEATURE` when the module was not registered before load.
 *
 * @private
 */
export function bibliographyFor(document: WordDocument): BibliographyCatalog {
    const part: FeaturePartState = document.featurePart(BIBLIOGRAPHY);
    if (part === undefined || !(part instanceof BibliographyCatalog)) {
        throw new DocxError('feature/not-registered', 'Bibliography catalog was not loaded; call registerBibliographyFeature() before WordDocument.open');
    }
    return part;
}
registerBibliographyFeature();
