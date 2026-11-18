import { FeatureBlock } from './feature-block';
import { BlockContent } from './paragraph';
import { elementChildren, isWml } from './wml';
import { partByName, relationshipsForPart, officeDocumentPartName, OpcPackage } from '../../core/opc/index';
import { resolveInternalTarget, PartName } from '../../core/opc/part-name';
import { TargetMode } from '../../core/opc/relationships';
import { featureId, registerFeature, registerFeatureBlockHandler } from '../../core/registry/index';
import { OpenXmlElement } from '../../core/xml/index';
import { FeatureId } from '../../core/registry/feature-registry';
import { OpenXmlAttribute } from '../../core/xml/model';
import { PackagePart } from '../../core/opc/package';
const ALT_CHUNK: FeatureId = featureId('alt-chunk');
/** @public WordDocument surface for altChunk binding. */
type AltChunkDocument = {
    listBlocks(): ReadonlyArray<BlockContent>;
    opcPackage(): OpcPackage;
};
/**
 * Transitional aFChunk relationship (ECMA-376-4 §9.2.1).
 *
 * @public
 */
export const AFCHUNK_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk';
/**
 * Strict aFChunk relationship (ECMA-376-1 §11.3.1).
 *
 * @public
 */
export const STRICT_AFCHUNK_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/aFChunk';
const AFCHUNK_RELATIONSHIP_TYPES: string[] = [
    AFCHUNK_RELATIONSHIP_TYPE,
    STRICT_AFCHUNK_RELATIONSHIP_TYPE
];
/** Office WordDocument relationships namespace for `r:id` on `CT_Rel`. */
const OFFICE_RELATIONSHIPS_NAMESPACE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
function relationshipIdAttribute(element: OpenXmlElement): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === 'id' &&
        (attribute.namespaceUri === OFFICE_RELATIONSHIPS_NAMESPACE ||
            attribute.prefix === 'r' ||
            attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
/**
 * Resolved Alternative Format Import part metadata.
 *
 * @public
 */
export type AltChunkTarget = {
    readonly partName: PartName;
    readonly contentType: string;
};
function resolveAltChunkTarget(pkg: OpcPackage, mainPartName: PartName, relationshipId: string): AltChunkTarget | undefined {
    for (const rel of relationshipsForPart(pkg, mainPartName).items) {
        if (rel.id !== relationshipId) {
            continue;
        }
        if (AFCHUNK_RELATIONSHIP_TYPES.indexOf(rel.type as (typeof AFCHUNK_RELATIONSHIP_TYPES)[number]) === -1 ||
            rel.targetMode === TargetMode.External) {
            return undefined;
        }
        const target: PartName = resolveInternalTarget(rel.target, mainPartName);
        const part: PackagePart = partByName(pkg, target);
        if (part === undefined) {
            return undefined;
        }
        return { partName: part.name, contentType: part.contentType };
    }
    return undefined;
}
/**
 * Body-level anchor for imported external content (`w:altChunk`).
 *
 * @private
 */
export class AltChunkAnchor implements FeatureBlock {
    private readonly element: OpenXmlElement;
    private documentOwner: AltChunkDocument | undefined;
    /**
     * @param {OpenXmlElement} element - The element.
     * @private
     */
    constructor(element: OpenXmlElement) {
        this.element = element;
    }
    /**
     * @param {AltChunkDocument} document - The document.
     * @returns {void} Nothing is returned.
     * @private
     */
    bindDocument(document: AltChunkDocument): void {
        this.documentOwner = document;
    }
    /**
     * `r:id` referencing the Alternative Format Import part, or `undefined` when absent.
     *
     * @public
     */
    get relationshipId(): string | undefined {
        return relationshipIdAttribute(this.element);
    }
    /**
     * Resolved import part metadata when this anchor is bound to a document.
     *
     * @public
     */
    get target(): AltChunkTarget | undefined {
        const id: string = this.relationshipId;
        if (id === undefined || this.documentOwner === undefined) {
            return undefined;
        }
        const pkg: OpcPackage = this.documentOwner.opcPackage();
        const main: PartName = officeDocumentPartName(pkg);
        return resolveAltChunkTarget(pkg, main, id);
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        return this.element;
    }
}
function parseAltChunk(element: OpenXmlElement): AltChunkAnchor | undefined {
    if (!isWml(element, 'altChunk')) {
        return undefined;
    }
    void elementChildren(element);
    return new AltChunkAnchor(element);
}
let coreHandlersRegistered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Ensure core body block handlers are registered before parse.
 */
export function ensureCoreBlockHandlers(): void {
    if (coreHandlersRegistered) {
        return;
    }
    coreHandlersRegistered = true;
    registerFeature({ id: ALT_CHUNK });
    registerFeatureBlockHandler({
        featureId: ALT_CHUNK,
        wmlLocalName: 'altChunk',
        tryParse(element: OpenXmlElement): AltChunkAnchor | undefined {
            return parseAltChunk(element);
        }
    });
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetCoreBlockHandlersForTests(): void {
    coreHandlersRegistered = false;
}
/**
 * Whether a body block is a modeled `w:altChunk` anchor.
 *
 * @param {BlockContent} block - The block.
 * @returns {Object} The result.
 * @private
 */
export function isAltChunkBlock(block: BlockContent): block is {
    type: 'feature';
    featureId: typeof ALT_CHUNK;
    value: AltChunkAnchor;
} {
    return block.type === 'feature' && block.featureId === ALT_CHUNK && block.value instanceof AltChunkAnchor;
}
/**
 * Modeled `w:altChunk` anchors in a block list, in document order.
 *
 * @param {ReadonlyArray<BlockContent>} blocks - The blocks.
 * @returns {ReadonlyArray<AltChunkAnchor>} The result.
 * @private
 */
export function altChunksInBlocks(blocks: ReadonlyArray<BlockContent>): ReadonlyArray<AltChunkAnchor> {
    const found: AltChunkAnchor[] = [];
    for (const block of blocks) {
        if (isAltChunkBlock(block)) {
            found.push(block.value);
        }
    }
    return found;
}
/**
 * Modeled `w:altChunk` anchors in the Main Document body.
 *
 * @param {Object} document - The document.
 * @returns {ReadonlyArray<AltChunkAnchor>} The result.
 * @deprecated Use {@link WordDocument.altChunks} instead.
 * @private
 */
export function altChunks(document: {
    listBlocks(): ReadonlyArray<BlockContent>;
}): ReadonlyArray<AltChunkAnchor> {
    return altChunksInBlocks(document.listBlocks());
}
/**
 * @param {ReadonlyArray<BlockContent>} blocks - The blocks.
 * @param {AltChunkDocument} document - The document.
 * @returns {void} Nothing is returned.
 * @private
 * Bind altChunk anchors to their owning document after load or append.
 */
export function bindAltChunkDocument(blocks: ReadonlyArray<BlockContent>, document: AltChunkDocument): void {
    for (const block of blocks) {
        if (isAltChunkBlock(block)) {
            block.value.bindDocument(document);
        }
    }
}
