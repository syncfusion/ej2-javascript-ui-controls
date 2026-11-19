import { MATH_NAMESPACE, OfficeRunFormat, OpenXmlElement } from '@syncfusion/ej2-office-common';
import { CharacterFormat, CharacterFormatHost, parseCharacterFormat } from '../document/character-format';
import { isWml, wmlElement } from '../document/wml';

/**
 * @private
 * Host for a math-owned native {@link CharacterFormat}.
 */
export class MathFormatHost implements CharacterFormatHost {
    notifyCharacterFormatMutation(): void {
        // Math formats are serialized from the live object; nothing to invalidate.
    }
}

/**
 * @private
 * Native {@link CharacterFormat} carried by a math function's control properties (`m:ctrlPr/w:rPr`).
 */
export class MathCharacterFormat implements OfficeRunFormat {
    readonly format: CharacterFormat;

    constructor(format?: CharacterFormat) {
        this.format = format !== undefined ? format : new CharacterFormat(new MathFormatHost());
    }

    clone(): MathCharacterFormat {
        const copy: MathCharacterFormat = new MathCharacterFormat();
        copy.format.hydrate(this.format.snapshot());
        return copy;
    }

    equals(other: OfficeRunFormat): boolean {
        return other instanceof MathCharacterFormat
            && JSON.stringify(other.format.buildRPrChildren()) === JSON.stringify(this.format.buildRPrChildren());
    }
}

/**
 *   Builds a native format from a `w:rPr` element.
 *
 * @param {OpenXmlElement | undefined} rPr - The r pr.
 * @returns {CharacterFormat} The result.
 * @private
 */
export function characterFormatFromRPr(rPr: OpenXmlElement | undefined): CharacterFormat {
    const format: CharacterFormat = new CharacterFormat(new MathFormatHost());
    if (rPr !== undefined) {
        format.hydrate(parseCharacterFormat(rPr));
    }
    return format;
}

/**
 *   Serializes a native format back to `w:rPr` (undefined when empty).
 *
 * @param {CharacterFormat} format - The format.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function rPrFromCharacterFormat(format: CharacterFormat): OpenXmlElement | undefined {
    const children: OpenXmlElement[] = format.buildRPrChildren();
    return children.length === 0 ? undefined : wmlElement('rPr', { children });
}

/**
 *   Extracts the `w:rPr` of an `m:ctrlPr` carrier.
 *
 * @param {OpenXmlElement | undefined} ctrlPr - The ctrl pr.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function rPrOfCtrlPr(ctrlPr: OpenXmlElement | undefined): OpenXmlElement | undefined {
    if (ctrlPr === undefined) {
        return undefined;
    }
    for (const child of ctrlPr.children) {
        if (child.kind === 'element' && isWml(child, 'rPr')) {
            return child;
        }
    }
    return undefined;
}

/**
 *   Whether the element is in the math namespace.
 *
 * @param {OpenXmlElement} element - The element.
 * @param {string} localName - The local name.
 * @returns {boolean} The result.
 * @private
 */
export function isMathElement(element: OpenXmlElement, localName: string): boolean {
    return element.namespaceUri === MATH_NAMESPACE && element.localName === localName;
}
