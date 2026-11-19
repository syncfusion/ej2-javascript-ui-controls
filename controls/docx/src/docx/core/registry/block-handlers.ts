import { WordDocument } from '../../features/document/document';
import { DetachedObjectError } from '../errors/docx-error';
import { FeatureId } from './feature-registry';
import { FeatureBlock } from '../../features/document/feature-block';
import { BlockContent, Paragraph } from '../../features/document/paragraph';
import { OpenXmlElement } from '../xml/index';
/** @public */
export interface BodyBlockParseContext {
    assertAttachedParagraph(target: Paragraph): void;
    owningDocument(): WordDocument;
}
/**
 * @returns {BodyBlockParseContext} The result.
 * @private
 */
export function detachedBodyBlockParseContext(): BodyBlockParseContext {
    return {
        assertAttachedParagraph(): void {
            return;
        },
        owningDocument(): WordDocument {
            throw new DetachedObjectError('This content is not in a document');
        }
    };
}
/**
 *  Internal feature handler interface. Not part of the public API.
 *
 * @private
 */
export interface FeatureBlockHandler {
    readonly featureId: FeatureId;
    readonly wmlLocalName: string;
    tryParse(element: OpenXmlElement, ctx: BodyBlockParseContext): FeatureBlock | undefined;
}
const handlersByLocalName: Map<string, FeatureBlockHandler> = new Map<string, FeatureBlockHandler>();
/**
 * @returns {void} Nothing is returned.
 *  Test hook. Not part of the public API.
 *
 * @private
 */
export function resetFeatureBlockHandlers(): void {
    handlersByLocalName.clear();
}
/**
 * @param {FeatureBlockHandler} handler - The handler.
 * @returns {void} Nothing is returned.
 *  Internal feature registration. Not part of the public API.
 *
 * @private
 */
export function registerFeatureBlockHandler(handler: FeatureBlockHandler): void {
    handlersByLocalName.set(handler.wmlLocalName, handler);
}
/**
 * @param {OpenXmlElement} element - The element.
 * @param {BodyBlockParseContext} ctx - The ctx.
 * @returns {BlockContent | undefined} The result.
 *  Internal feature block parsing. Not part of the public API.
 *
 * @private
 */
export function tryParseFeatureBlock(element: OpenXmlElement, ctx: BodyBlockParseContext): BlockContent | undefined {
    const handler: FeatureBlockHandler = handlersByLocalName.get(element.localName);
    if (handler === undefined) {
        return undefined;
    }
    const value: FeatureBlock = handler.tryParse(element, ctx);
    if (value === undefined) {
        return undefined;
    }
    return { type: 'feature', featureId: handler.featureId, value };
}
/**
 *  Internal feature body item. Explicit shape (TS 3.3 does not distribute BodyItem & { type: 'feature' }).
 * Not part of the public API.
 *
 * @private
 */
export type FeatureBodyItem = {
    readonly type: 'feature';
    readonly featureId: FeatureId;
    readonly value: FeatureBlock;
};
/**
 * @param {FeatureBodyItem} block - The block.
 * @returns {OpenXmlElement} The result.
 *  Internal feature serialization. Not part of the public API.
 *
 * @private
 */
export function serializeFeatureBlock(block: FeatureBodyItem): OpenXmlElement {
    return block.value.toOpenXml();
}
