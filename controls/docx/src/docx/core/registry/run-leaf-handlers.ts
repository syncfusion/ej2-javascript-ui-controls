import { FeatureRunLeaf } from '../../features/document/feature-run-leaf';
import { isWml, isWmlNamespace } from '../../features/document/wml';
import { OpenXmlElement } from '../xml/index';
import { FeatureId } from './feature-registry';
/**
 *  Internal feature run leaf content. Not part of the public API.
 *
 * @private
 */
export type FeatureRunLeafContent = {
    readonly type: 'feature';
    readonly featureId: FeatureId;
    readonly value: FeatureRunLeaf;
};
/**
 *  Internal feature handler interface. Not part of the public API.
 *
 * @private
 */
export interface FeatureRunLeafHandler {
    readonly featureId: FeatureId;
    readonly wmlLocalName: string;
    /**
     * Element namespace. When omitted, WordprocessingML transitional **or** strict
     * namespaces match (same as {@link isWml}). When set, the URI must match
     * exactly (for non-WML roots such as `mc:AlternateContent`).
     */
    readonly namespaceUri?: string;
    tryParse(element: OpenXmlElement): FeatureRunLeaf | undefined;
}
const handlersByLocalName: Map<string, FeatureRunLeafHandler[]> = new Map<string, FeatureRunLeafHandler[]>();
function elementMatchesHandler(element: OpenXmlElement, handler: FeatureRunLeafHandler): boolean {
    if (element.localName !== handler.wmlLocalName) {
        return false;
    }
    if (handler.namespaceUri === undefined) {
        return isWml(element, handler.wmlLocalName);
    }
    // Explicit non-default namespace (e.g. Markup Compatibility).
    if (isWmlNamespace(handler.namespaceUri)) {
        return isWmlNamespace(element.namespaceUri) && element.localName === handler.wmlLocalName;
    }
    return element.namespaceUri === handler.namespaceUri;
}
/**
 * @returns {void} Nothing is returned.
 *  Test hook. Not part of the public API.
 *
 * @private
 */
export function resetFeatureRunLeafHandlers(): void {
    handlersByLocalName.clear();
}
/**
 * @param {FeatureRunLeafHandler} handler - The handler.
 * @param {Object} options - The options.
 * @returns {void} Nothing is returned.
 *  Internal feature registration. Not part of the public API.
 *
 * @private
 */
export function registerFeatureRunLeafHandler(handler: FeatureRunLeafHandler, options?: {
    readonly prepend?: boolean;
}): void {
    const existing: FeatureRunLeafHandler[] = handlersByLocalName.get(handler.wmlLocalName);
    if (existing === undefined) {
        handlersByLocalName.set(handler.wmlLocalName, [handler]);
        return;
    }
    // Charts (and similar owners) prepend so residual drawing can still claim later.
    if ((options == null ? undefined : options.prepend) === true) {
        existing.unshift(handler);
        return;
    }
    existing.push(handler);
}
/**
 * @param {OpenXmlElement} element - The element.
 * @returns {FeatureRunLeafContent | undefined} The result.
 *  Internal feature run leaf parsing. Not part of the public API.
 *
 * @private
 */
export function tryParseFeatureRunLeaf(element: OpenXmlElement): FeatureRunLeafContent | undefined {
    const handlers: FeatureRunLeafHandler[] = handlersByLocalName.get(element.localName);
    if (handlers === undefined) {
        return undefined;
    }
    for (const handler of handlers) {
        if (!elementMatchesHandler(element, handler)) {
            continue;
        }
        const value: FeatureRunLeaf = handler.tryParse(element);
        if (value !== undefined) {
            return { type: 'feature', featureId: handler.featureId, value };
        }
    }
    return undefined;
}
/**
 * @param {FeatureRunLeafContent} leaf - The leaf.
 * @returns {OpenXmlElement} The result.
 *  Internal feature serialization. Not part of the public API.
 *
 * @private
 */
export function serializeFeatureRunLeaf(leaf: FeatureRunLeafContent): OpenXmlElement {
    return leaf.value.toOpenXml();
}
