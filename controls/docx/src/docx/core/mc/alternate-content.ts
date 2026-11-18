import { MarkupCompatibilityError } from '../errors/docx-error';
import { OpenXmlElement } from '../xml/index';
import { MARKUP_COMPATIBILITY_NAMESPACE } from './namespaces';
import { OpenXmlChild, OpenXmlAttribute } from '../xml/model';
export function isMarkupCompatibilityElement(element: OpenXmlElement, localName: string): boolean {
    return element.namespaceUri === MARKUP_COMPATIBILITY_NAMESPACE && element.localName === localName;
}
export function isAlternateContent(element: OpenXmlElement): boolean {
    return isMarkupCompatibilityElement(element, 'AlternateContent');
}
function childElements(element: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return element.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element');
}
/**
 * Structural checks from ECMA-376-3 §7.5–§7.7 without flattening the tree.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {void} Nothing is returned.
 * @private
 */
export function assertAlternateContentShape(element: OpenXmlElement): void {
    if (!isAlternateContent(element)) {
        return;
    }
    const mcChildren: OpenXmlElement[] = childElements(element).filter(
        (c: OpenXmlElement) => c.namespaceUri === MARKUP_COMPATIBILITY_NAMESPACE
    );
    let seenFallback: boolean = false;
    let choiceCount: number = 0;
    for (const child of mcChildren) {
        if (child.localName === 'Choice') {
            if (seenFallback) {
                throw new MarkupCompatibilityError('xml/markup-compatibility', 'Choice must not follow Fallback (ECMA-376-3 §7.5)');
            }
            const requires: OpenXmlAttribute = child.attributes.find((a: OpenXmlAttribute) => a.localName === 'Requires' && a.namespaceUri === '');
            if (requires === undefined || requires.value.trim().length === 0) {
                throw new MarkupCompatibilityError('xml/markup-compatibility', 'Choice Requires is required and must list one or more prefixes (ECMA-376-3 §7.6)');
            }
            choiceCount += 1;
            continue;
        }
        if (child.localName === 'Fallback') {
            if (seenFallback) {
                throw new MarkupCompatibilityError('xml/markup-compatibility', 'AlternateContent may have at most one Fallback (ECMA-376-3 §7.5)');
            }
            seenFallback = true;
            continue;
        }
        throw new MarkupCompatibilityError('xml/markup-compatibility', `Unexpected Markup Compatibility child ${child.localName} of AlternateContent (ECMA-376-3 §7.5)`);
    }
    if (choiceCount < 1) {
        throw new MarkupCompatibilityError('xml/markup-compatibility', 'AlternateContent shall contain one or more Choice children (ECMA-376-3 §7.5)');
    }
}
