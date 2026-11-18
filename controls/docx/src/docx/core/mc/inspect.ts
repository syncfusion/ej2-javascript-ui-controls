import { MarkupCompatibilityError } from '../errors/docx-error';
import { OpenXmlElement } from '../xml/index';
import { readMarkupCompatibilityAttributes, MarkupCompatibilityAttributes } from './attributes';
import { assertAlternateContentShape } from './alternate-content';
import { MARKUP_COMPATIBILITY_NAMESPACE } from './namespaces';
import { inScopeNamespaces } from './scope';
import { OpenXmlAttribute, OpenXmlChild } from '../xml/model';
function bindRequires(choice: OpenXmlElement, scope: ReadonlyMap<string, string>): void {
    const requires: OpenXmlAttribute = choice.attributes.find((a: OpenXmlAttribute) => a.localName === 'Requires' && a.namespaceUri === '');
    if (requires === undefined) {
        return;
    }
    const tokens: string[] = requires.value.trim().length === 0 ? [] : requires.value.trim().split(/\s+/);
    for (const prefix of tokens) {
        const namespaceUri: string = scope.get(prefix);
        if (namespaceUri === undefined) {
            throw new MarkupCompatibilityError('xml/markup-compatibility', `Choice Requires prefix "${prefix}" is not bound (ECMA-376-3 §7.6)`);
        }
    }
}
export enum MarkupConformance {
    Lax = 'lax',
    Strict = 'strict'
}
export interface InspectMarkupCompatibilityOptions {
    readonly conformance?: MarkupConformance;
    readonly understoodNamespaces?: ReadonlySet<string>;
}
function childElements(element: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return element.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element');
}
function walk(element: OpenXmlElement, ancestors: ReadonlyArray<OpenXmlElement>, ignorableUris: Set<string>, options: Required<Pick<InspectMarkupCompatibilityOptions, 'conformance'>> & {
    readonly understoodNamespaces: ReadonlySet<string>;
}): void {
    const chain: OpenXmlElement[] = [...ancestors, element];
    const scope: ReadonlyMap<string, string> = inScopeNamespaces(chain);
    const mc: MarkupCompatibilityAttributes = readMarkupCompatibilityAttributes(element, scope);
    for (const item of mc.ignorable) {
        ignorableUris.add(item.namespaceUri);
    }
    for (const token of mc.processContent) {
        if (!ignorableUris.has(token.namespaceUri)) {
            throw new MarkupCompatibilityError('xml/markup-compatibility', `ProcessContent namespace ${token.namespaceUri} is not declared Ignorable (ECMA-376-3 §7.3)`);
        }
    }
    if (options.conformance === MarkupConformance.Strict) {
        for (const item of mc.mustUnderstand) {
            if (!options.understoodNamespaces.has(item.namespaceUri)) {
                throw new MarkupCompatibilityError('xml/markup-compatibility', `MustUnderstand namespace is not understood: ${item.namespaceUri} (ECMA-376-3 §7.4)`);
            }
        }
    }
    assertAlternateContentShape(element);
    if (element.namespaceUri === MARKUP_COMPATIBILITY_NAMESPACE && element.localName === 'Choice') {
        bindRequires(element, scope);
    }
    for (const child of childElements(element)) {
        walk(child, chain, ignorableUris, options);
    }
}
/**
 * Walk a preservation DOM: resolve MC prefixes, keep AlternateContent intact,
 * and optionally fail MustUnderstand in strict mode. Never deletes Ignorable
 * markup. Depth of MC elements is already counted by the XML parser.
 *
 * @param {OpenXmlElement} root - The root.
 * @param {InspectMarkupCompatibilityOptions} options - The options.
 * @returns {void} Nothing is returned.
 * @private
 */
export function inspectMarkupCompatibility(root: OpenXmlElement, options?: InspectMarkupCompatibilityOptions): void {
    let ts330: any; let ts331: any;
    const understood: Set<string> = new Set<string>(
        ((ts330 = options == null ? undefined : options.understoodNamespaces), ts330 != null ? ts330 : [])
    );
    understood.add(MARKUP_COMPATIBILITY_NAMESPACE);
    walk(root, [], new Set<string>(), {
        conformance: ((ts331 = options == null ? undefined : options.conformance),
        ts331 != null ? ts331 : MarkupConformance.Lax) as MarkupConformance,
        understoodNamespaces: understood
    });
}
