import { MarkupCompatibilityError } from '../errors/docx-error';
import { OpenXmlAttribute, OpenXmlElement } from '../xml/index';
import { MARKUP_COMPATIBILITY_NAMESPACE } from './namespaces';
export interface BoundPrefix {
    readonly prefix: string;
    readonly namespaceUri: string;
}
export interface ProcessContentToken {
    readonly prefix: string;
    readonly localNameOrStar: string;
    readonly namespaceUri: string;
}
export interface MarkupCompatibilityAttributes {
    readonly ignorable: ReadonlyArray<BoundPrefix>;
    readonly mustUnderstand: ReadonlyArray<BoundPrefix>;
    readonly processContent: ReadonlyArray<ProcessContentToken>;
    readonly preserveElements: ReadonlyArray<BoundPrefix>;
    readonly preserveAttributes: ReadonlyArray<BoundPrefix>;
}
function mcAttr(element: OpenXmlElement, localName: string): OpenXmlAttribute | undefined {
    return element.attributes.find((a: OpenXmlAttribute) => a.localName === localName && a.namespaceUri === MARKUP_COMPATIBILITY_NAMESPACE);
}
function splitTokens(value: string): ReadonlyArray<string> {
    return value.trim().length === 0 ? [] : value.trim().split(/\s+/);
}
function bindPrefix(prefix: string, scope: ReadonlyMap<string, string>, what: string): BoundPrefix {
    const namespaceUri: string = scope.get(prefix);
    if (namespaceUri === undefined) {
        throw new MarkupCompatibilityError('xml/markup-compatibility', `${what} prefix "${prefix}" is not bound to an in-scope namespace (ECMA-376-3 §7.2)`);
    }
    if (namespaceUri === MARKUP_COMPATIBILITY_NAMESPACE) {
        throw new MarkupCompatibilityError('xml/markup-compatibility', `${what} prefix "${prefix}" is bound to the Markup Compatibility namespace`);
    }
    return { prefix, namespaceUri };
}
function bindPrefixList(value: string | undefined, scope: ReadonlyMap<string, string>, what: string): ReadonlyArray<BoundPrefix> {
    if (value === undefined) {
        return [];
    }
    return splitTokens(value).map((prefix: string) => bindPrefix(prefix, scope, what));
}
function parseProcessContent(value: string | undefined, scope: ReadonlyMap<string, string>): ReadonlyArray<ProcessContentToken> {
    if (value === undefined) {
        return [];
    }
    const tokens: ProcessContentToken[] = [];
    for (const token of splitTokens(value)) {
        const colon: number = token.indexOf(':');
        if (colon <= 0 || colon === token.length - 1) {
            throw new MarkupCompatibilityError('xml/markup-compatibility', `ProcessContent token must be prefix:local or prefix:* (ECMA-376-3 §7.3), got "${token}"`);
        }
        const prefix: string = token.slice(0, colon);
        const localNameOrStar: string = token.slice(colon + 1);
        const bound: BoundPrefix = bindPrefix(prefix, scope, 'ProcessContent');
        tokens.push({
            prefix,
            localNameOrStar,
            namespaceUri: bound.namespaceUri
        });
    }
    return tokens;
}
/**
 * Read MC attributes on one element. Prefixes are resolved with the in-scope map
 * (ECMA-376-3 §7.2–§7.4). PreserveElements/PreserveAttributes are treated as
 * prefix lists when present; they are not defined in the local Part 3 5th-edition
 * text (see notes).
 *
 * @param {OpenXmlElement} element - The element.
 * @param {ReadonlyMap<string, string>} scope - The scope.
 * @returns {MarkupCompatibilityAttributes} The result.
 * @private
 */
export function readMarkupCompatibilityAttributes(
    element: OpenXmlElement,
    scope: ReadonlyMap<string, string>
): MarkupCompatibilityAttributes {
    let ts330: any; let ts331: any; let ts332: any; let ts333: any; let ts334: any;
    return {
        ignorable: bindPrefixList(((ts330 = mcAttr(element, 'Ignorable')), ts330 == null ? undefined : ts330.value), scope, 'Ignorable'),
        mustUnderstand: bindPrefixList(((ts331 = mcAttr(element, 'MustUnderstand')), ts331 == null ? undefined : ts331.value), scope, 'MustUnderstand'),
        processContent: parseProcessContent(((ts332 = mcAttr(element, 'ProcessContent')), ts332 == null ? undefined : ts332.value), scope),
        preserveElements: bindPrefixList(((ts333 = mcAttr(element, 'PreserveElements')), ts333 == null ? undefined : ts333.value), scope, 'PreserveElements'),
        preserveAttributes: bindPrefixList(((ts334 = mcAttr(element, 'PreserveAttributes')), ts334 == null ? undefined : ts334.value), scope, 'PreserveAttributes')
    };
}
