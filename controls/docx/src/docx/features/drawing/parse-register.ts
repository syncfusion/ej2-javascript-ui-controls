/**
 * Drawing feature registration, parse handlers, and document/paragraph queries.
 *
 * @private
 */
import { WordDocument } from '../document/document';
import { Paragraph } from '../document/paragraph';
import { FeatureRunParagraphItem, ParagraphItem } from '../document/text-range';
import { isWml } from '../document/wml';
import { MARKUP_COMPATIBILITY_NAMESPACE } from '../../core/mc/index';
import { registerFeature, registerFeatureRunLeafHandler } from '../../core/registry/index';
import { OpenXmlElement } from '../../core/xml/index';
import { A_NS, attributeValue, findFirstElement, preferredDrawingElement, readDocPrIdentity, R_NS, WP_NS } from './host-codec';
import { CHART_GRAPHIC_DATA_URI, CHART_GRAPHIC_DATA_URI_STRICT, DIAGRAM_GRAPHIC_DATA_URI, DIAGRAM_GRAPHIC_DATA_URI_STRICT, DRAWING, WORDML_2010_NAMESPACE, WORDPROCESSING_INK_URI } from './types';
import { createDrawingShape, DrawingShape } from './drawing-shape';
import { elementChildren, isElement } from './residual-utils';
export function isInlinePictureDrawing(element: OpenXmlElement): boolean {
    if (!isWml(element, 'drawing')) {
        return false;
    }
    const inline: OpenXmlElement = findFirstElement(element, WP_NS, 'inline');
    if (inline === undefined) {
        return false;
    }
    const blip: OpenXmlElement = findFirstElement(element, A_NS, 'blip');
    if (blip === undefined) {
        return false;
    }
    const embed: string = attributeValue(blip, R_NS, 'embed');
    return embed !== undefined && embed.length > 0;
}
/**
 * Ink hosts (`wordprocessingInk` graphicData, or group/canvas with `w14:contentPart`).
 * No public ink API — decline so the host stays an opaque run leaf and its
 * package parts are not rewritten ([MS-ODRAWXML] §2.2.7.6).
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {boolean} The result.
 */
function isInkOwnedDrawing(element: OpenXmlElement): boolean {
    const graphicData: OpenXmlElement = findFirstElement(element, A_NS, 'graphicData');
    if (graphicData !== undefined) {
        const uri: string = attributeValue(graphicData, '', 'uri');
        if (uri === WORDPROCESSING_INK_URI) {
            return true;
        }
    }
    return findFirstElement(element, WORDML_2010_NAMESPACE, 'contentPart') !== undefined;
}
/**
 * SmartArt / diagram hosts. No public diagrams API — always decline so drawing
 * does not surface them as {@link DrawingShape} (which would rewrite the host).
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {boolean} The result.
 */
function isDiagramOwnedDrawing(element: OpenXmlElement): boolean {
    const graphicData: OpenXmlElement = findFirstElement(element, A_NS, 'graphicData');
    if (graphicData === undefined) {
        return false;
    }
    const uri: string = attributeValue(graphicData, '', 'uri');
    return uri === DIAGRAM_GRAPHIC_DATA_URI || uri === DIAGRAM_GRAPHIC_DATA_URI_STRICT;
}
/**
 * Chart hosts. No public charts API — decline chart graphicData so the host
 * stays opaque and chart package parts are not rewritten.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {boolean} The result.
 */
function isChartOwnedDrawing(element: OpenXmlElement): boolean {
    const graphicData: OpenXmlElement = findFirstElement(element, A_NS, 'graphicData');
    if (graphicData === undefined) {
        return false;
    }
    const uri: string = attributeValue(graphicData, '', 'uri');
    return uri === CHART_GRAPHIC_DATA_URI || uri === CHART_GRAPHIC_DATA_URI_STRICT;
}
export function drawingIsOwnedByOtherFeature(drawing: OpenXmlElement): boolean {
    return (isInlinePictureDrawing(drawing) ||
        isInkOwnedDrawing(drawing) ||
        isDiagramOwnedDrawing(drawing) ||
        isChartOwnedDrawing(drawing));
}
export function parseDrawingShape(element: OpenXmlElement): DrawingShape | undefined {
    if (!isWml(element, 'drawing')) {
        return undefined;
    }
    if (drawingIsOwnedByOtherFeature(element)) {
        return undefined;
    }
    return createDrawingShape('drawingml', element);
}
export function parseVmlPict(element: OpenXmlElement): DrawingShape | undefined {
    if (!isWml(element, 'pict')) {
        return undefined;
    }
    return createDrawingShape('vml', element);
}
/**
 * Parse run-level `mc:AlternateContent` that hosts a non-picture drawing Choice.
 * Residual root remains the full AC element for clean serialize (Policy B).
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {DrawingShape | undefined} The result.
 * @private
 */
export function parseAlternateContentDrawing(element: OpenXmlElement): DrawingShape | undefined {
    if (element.namespaceUri !== MARKUP_COMPATIBILITY_NAMESPACE ||
        element.localName !== 'AlternateContent') {
        return undefined;
    }
    const drawing: OpenXmlElement = preferredDrawingElement(element);
    if (drawing === undefined) {
        return undefined;
    }
    if (drawingIsOwnedByOtherFeature(drawing)) {
        return undefined;
    }
    return createDrawingShape('drawingml', element);
}
export function drawingShapesFromLeaves(items: ReadonlyArray<ParagraphItem>): DrawingShape[] {
    const found: DrawingShape[] = [];
    for (const item of items) {
        if (item instanceof DrawingShape) {
            found.push(item);
            continue;
        }
        if (item instanceof FeatureRunParagraphItem && item.featureId === DRAWING && item.value instanceof DrawingShape) {
            found.push(item.value);
        }
    }
    return found;
}
export function maxDocPrIdInDocument(document: WordDocument): number {
    let max: number = 0;
    for (const shape of drawingsInDocument(document)) {
        const id: number = readDocPrIdentity(shape.toOpenXml()).docPrId;
        if (id !== undefined && id > max) {
            max = id;
        }
    }
    return max;
}
export function allocateDocPrId(paragraph: Paragraph): number {
    const document: WordDocument = paragraph.owningDocument();
    return maxDocPrIdInDocument(document) + 1;
}
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetDrawingFeatureForTests(): void {
    registered = false;
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register non-picture DrawingML, VML, and MC drawing run-leaf handlers. Idempotent.
 */
export function registerDrawingFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: DRAWING });
    registerFeatureRunLeafHandler({
        featureId: DRAWING,
        wmlLocalName: 'drawing',
        tryParse: parseDrawingShape
    });
    registerFeatureRunLeafHandler({
        featureId: DRAWING,
        wmlLocalName: 'pict',
        tryParse: parseVmlPict
    });
    registerFeatureRunLeafHandler({
        featureId: DRAWING,
        wmlLocalName: 'AlternateContent',
        namespaceUri: MARKUP_COMPATIBILITY_NAMESPACE,
        tryParse: parseAlternateContentDrawing
    });
}
/**
 * Whether a paragraph item is a modeled drawing shape (projected leaf or wrapper).
 *
 * @param {ParagraphItem | DrawingShape} item - The item.
 * @returns {Object} The result.
 * @private
 */
export function isDrawingShapeLeaf(
    item: ParagraphItem | DrawingShape
): item is (FeatureRunParagraphItem & { value: DrawingShape }) | DrawingShape {
    if (item instanceof DrawingShape) {
        return true;
    }
    return item instanceof FeatureRunParagraphItem && item.featureId === DRAWING && item.value instanceof DrawingShape;
}
/**
 * Drawing shapes in a paragraph, in document order.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<DrawingShape>} The result.
 * @private
 */
export function drawingsInParagraph(paragraph: Paragraph): ReadonlyArray<DrawingShape> {
    return drawingShapesFromLeaves(paragraph.items.toArray());
}
/**
 * Drawing shapes in the Main Document body, in document order.
 *
 * @param {WordDocument} document - The document.
 * @returns {ReadonlyArray<DrawingShape>} The result.
 * @private
 */
export function drawingsInDocument(document: WordDocument): ReadonlyArray<DrawingShape> {
    const found: DrawingShape[] = [];
    for (const block of document.listBlocks()) {
        if (block.type !== 'paragraph') {
            continue;
        }
        found.push(...drawingsInParagraph(block.paragraph));
    }
    return found;
}
