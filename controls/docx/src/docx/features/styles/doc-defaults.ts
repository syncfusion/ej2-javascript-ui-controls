import { elementChildren, isWml, wmlElement } from '../document/wml';
import { OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { EMPTY_MODELED_PARAGRAPH_PROPERTIES, parseModeledParagraphProperties, ModeledParagraphProperties } from './paragraph-properties';
import { EMPTY_MODELED_RUN_PROPERTIES, parseModeledRunProperties, ModeledRunProperties } from './run-properties';
/**
 * WordDocument-level default paragraph and run properties (`w:docDefaults` / `CT_DocDefaults`).
 *
 * Sequence: optional `w:rPrDefault`, optional `w:pPrDefault` (Transitional `wml.xsd`).
 * Unmodeled children are retained and re-emitted after the two known slots.
 *
 * @private
 */
export class DocDefaults {
    private readonly rPrDefaultElement: OpenXmlElement | undefined;
    private readonly pPrDefaultElement: OpenXmlElement | undefined;
    private readonly extras: OpenXmlElement[];
    /**
     * @param {OpenXmlElement | undefined} rPrDefault - The r pr default.
     * @param {OpenXmlElement | undefined} pPrDefault - The p pr default.
     * @param {OpenXmlElement[]} extras - The extras.
     * @private
     */
    constructor(rPrDefault: OpenXmlElement | undefined, pPrDefault: OpenXmlElement | undefined, extras: OpenXmlElement[] = []) {
        this.rPrDefaultElement = rPrDefault;
        this.pPrDefaultElement = pPrDefault;
        this.extras = extras;
    }
    /**
     * Opaque `w:rPrDefault` element when present.
     *
     * @returns {OpenXmlElement | undefined} The result.
     * @public
     */
    rPrDefault(): OpenXmlElement | undefined {
        return this.rPrDefaultElement;
    }
    /**
     * Modeled run properties from `w:rPrDefault/w:rPr`.
     *
     * @returns {ModeledRunProperties} The result.
     * @public
     */
    runProperties(): ModeledRunProperties {
        if (this.rPrDefaultElement === undefined) {
            return EMPTY_MODELED_RUN_PROPERTIES;
        }
        for (const child of elementChildren(this.rPrDefaultElement)) {
            if (isWml(child, 'rPr')) {
                return parseModeledRunProperties(child);
            }
        }
        return EMPTY_MODELED_RUN_PROPERTIES;
    }
    /**
     * Opaque `w:pPrDefault` element when present.
     *
     * @returns {OpenXmlElement | undefined} The result.
     * @public
     */
    pPrDefault(): OpenXmlElement | undefined {
        return this.pPrDefaultElement;
    }
    /**
     * Modeled paragraph properties from `w:pPrDefault/w:pPr`.
     *
     * Spacing fields use plain point `number`s (twips on the wire). Absent markup
     * yields an empty model (`spacing` undefined) — create-path defaults are not
     * injected on load.
     *
     * @returns {ModeledParagraphProperties} The result.
     * @public
     */
    paragraphProperties(): ModeledParagraphProperties {
        if (this.pPrDefaultElement === undefined) {
            return EMPTY_MODELED_PARAGRAPH_PROPERTIES;
        }
        for (const child of elementChildren(this.pPrDefaultElement)) {
            if (isWml(child, 'pPr')) {
                return parseModeledParagraphProperties(child);
            }
        }
        return EMPTY_MODELED_PARAGRAPH_PROPERTIES;
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    serialize(): OpenXmlElement {
        const children: OpenXmlChild[] = [];
        if (this.rPrDefaultElement !== undefined) {
            children.push(this.rPrDefaultElement);
        }
        if (this.pPrDefaultElement !== undefined) {
            children.push(this.pPrDefaultElement);
        }
        children.push(...this.extras);
        return wmlElement('docDefaults', { children });
    }
}
/**
 * Parse `w:docDefaults` into {@link DocDefaults}.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {DocDefaults | undefined} The result.
 * @private
 */
export function parseDocDefaults(element: OpenXmlElement): DocDefaults | undefined {
    if (!isWml(element, 'docDefaults')) {
        return undefined;
    }
    let rPrDefault: OpenXmlElement | undefined;
    let pPrDefault: OpenXmlElement | undefined;
    const extras: OpenXmlElement[] = [];
    for (const child of elementChildren(element)) {
        if (isWml(child, 'rPrDefault') && rPrDefault === undefined) {
            rPrDefault = child;
            continue;
        }
        if (isWml(child, 'pPrDefault') && pPrDefault === undefined) {
            pPrDefault = child;
            continue;
        }
        extras.push(child);
    }
    return new DocDefaults(rPrDefault, pPrDefault, extras);
}
