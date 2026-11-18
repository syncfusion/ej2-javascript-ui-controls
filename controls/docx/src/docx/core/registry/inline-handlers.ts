import { FeatureInline } from '../../features/document/feature-inline';
import { WML } from '../../features/document/wml';
import { OpenXmlElement } from '../xml/index';
import { FeatureId } from './feature-registry';
/**
 *  Internal feature inline content. Not part of the public API.
 *
 * @private
 */
export type FeatureInlineContent = {
    readonly type: 'feature';
    readonly featureId: FeatureId;
    readonly value: FeatureInline;
};
/**
 *  Internal feature handler interface. Not part of the public API.
 *
 * @private
 */
export interface FeatureInlineHandler {
    readonly featureId: FeatureId;
    readonly wmlLocalName: string;
    /** When omitted, the WordprocessingML transitional namespace is assumed. */
    readonly namespaceUri?: string;
    tryParse(element: OpenXmlElement): FeatureInline | undefined;
}
const handlersByLocalName: Map<string, FeatureInlineHandler> = new Map<string, FeatureInlineHandler>();
function elementMatchesHandler(element: OpenXmlElement, handler: FeatureInlineHandler): boolean {
    if (element.localName !== handler.wmlLocalName) {
        return false;
    }
    const namespaceUri: string = handler.namespaceUri != null ? handler.namespaceUri : WML;
    return element.namespaceUri === namespaceUri;
}
/**
 * @returns {void} Nothing is returned.
 *  Test hook. Not part of the public API.
 *
 * @private
 */
export function resetFeatureInlineHandlers(): void {
    handlersByLocalName.clear();
}
/**
 * @param {FeatureInlineHandler} handler - The handler.
 * @returns {void} Nothing is returned.
 *  Internal feature registration. Not part of the public API.
 *
 * @private
 */
export function registerFeatureInlineHandler(handler: FeatureInlineHandler): void {
    handlersByLocalName.set(handler.wmlLocalName, handler);
}
/**
 * @param {OpenXmlElement} element - The element.
 * @returns {FeatureInlineContent | undefined} The result.
 *  Internal feature inline parsing. Not part of the public API.
 *
 * @private
 */
export function tryParseFeatureInline(element: OpenXmlElement): FeatureInlineContent | undefined {
    const handler: FeatureInlineHandler = handlersByLocalName.get(element.localName);
    if (handler === undefined || !elementMatchesHandler(element, handler)) {
        return undefined;
    }
    const value: FeatureInline = handler.tryParse(element);
    if (value === undefined) {
        return undefined;
    }
    return { type: 'feature', featureId: handler.featureId, value };
}
/**
 * @param {FeatureInlineContent} inline - The inline.
 * @returns {OpenXmlElement} The result.
 *  Internal feature serialization. Not part of the public API.
 *
 * @private
 */
export function serializeFeatureInline(inline: FeatureInlineContent): OpenXmlElement {
    return inline.value.toOpenXml();
}
