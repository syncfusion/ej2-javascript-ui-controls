import { ownerNamespace } from '../xml/office-dialect';
import { arrayAt } from '../util/es5-compat';
/**
 * DrawingML `EG_ColorChoice` parse helpers (shared by theme load and text resolve).
 *
 * @remarks
 * Citation: Transitional `dml-main.xsd` `EG_ColorChoice` — `srgbClr`, `scrgbClr`,
 * `hslClr`, `sysClr`, `schemeClr`, `prstClr`. Colour transforms under those
 * elements are not modelled here.
 */
import { findChild, getAttr } from '../shapes/dom-utils';
import { InvalidPackageError } from '../security/errors';
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { ColorValue } from './color-value';
import { DML_NS } from './constants';
/**
 * Reads the first `EG_ColorChoice` child under a parent (e.g. `a:solidFill` or a scheme slot).
 *
 * @remarks Non-throwing. Prefer this for optional run/`defRPr` fills. Theme slots with a missing choice still use {@link
 * parseRequiredColorChoice}.
 * @internal
 * @param {OoxmlElement} parent - Element that may contain one colour-choice child.
 * @param {string} namespaceUri - Expected DrawingML namespace; defaults to the source owner dialect.
 * @returns {ColorValue | undefined} Direct {@link ColorValue}, or `undefined` when no choice child is present.
 */
export function tryParseColorChoiceChild(
    parent: OoxmlElement, namespaceUri: string = ownerNamespace(parent.namespaceUri, DML_NS)
): ColorValue | undefined {
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind !== 'element' || child.namespaceUri !== namespaceUri) {
            continue;
        }
        switch (child.localName) {
        case 'srgbClr': {
            const val: string = getAttr(child, '', 'val');
            if (val === undefined) {
                return undefined;
            }
            return { kind: 'srgb', val };
        }
        case 'scrgbClr': {
            const r: string = getAttr(child, '', 'r');
            const g: string = getAttr(child, '', 'g');
            const b: string = getAttr(child, '', 'b');
            if (r === undefined || g === undefined || b === undefined) {
                return undefined;
            }
            return { kind: 'scrgb', r, g, b };
        }
        case 'hslClr': {
            const hue: string = getAttr(child, '', 'hue');
            const sat: string = getAttr(child, '', 'sat');
            const lum: string = getAttr(child, '', 'lum');
            if (hue === undefined || sat === undefined || lum === undefined) {
                return undefined;
            }
            return { kind: 'hsl', hue, sat, lum };
        }
        case 'sysClr': {
            const val: string = getAttr(child, '', 'val');
            if (val === undefined) {
                return undefined;
            }
            return { kind: 'sys', val, lastClr: getAttr(child, '', 'lastClr') };
        }
        case 'schemeClr': {
            const val: string = getAttr(child, '', 'val');
            if (val === undefined) {
                return undefined;
            }
            return { kind: 'scheme', val };
        }
        case 'prstClr': {
            const val: string = getAttr(child, '', 'val');
            if (val === undefined) {
                return undefined;
            }
            return { kind: 'prst', val };
        }
        default:
            break;
        }

    }
    return undefined;
}
/**
 * Parses a required colour choice under a theme scheme slot (or similar).
 *
 * @throws {Error} When no valid colour-choice child exists.
 * @internal
 * @param {OoxmlElement} parent - Slot element that must contain one `EG_ColorChoice` child.
 * @param {string} partName - Part URI for diagnostics.
 * @param {string} label - Human label (e.g. scheme slot name) for the error message.
 * @returns {ColorValue} Direct {@link ColorValue}.
 */
export function parseRequiredColorChoice(parent: OoxmlElement, partName: string, label: string): ColorValue {
    const value: ColorValue = tryParseColorChoiceChild(parent);
    if (value !== undefined) {
        return value;
    }
    throw new InvalidPackageError(`a:${label} requires one EG_ColorChoice child (srgbClr, scrgbClr, hslClr, sysClr, schemeClr, or prstClr)`,
                                  { partName });
}
/**
 * Reads `a:solidFill` colour under character properties (`CT_TextCharacterProperties`).
 *
 * @internal
 * @param {OoxmlElement} rPr - `a:rPr` or `a:defRPr` element.
 * @returns {ColorValue | undefined} Direct colour if `solidFill` + choice present; otherwise `undefined`.
 */
export function tryParseSolidFillColor(rPr: OoxmlElement): ColorValue | undefined {
    const solidFill: OoxmlElement = findChild(rPr, DML_NS, 'solidFill');
    if (solidFill === undefined) {
        return undefined;
    }
    return tryParseColorChoiceChild(solidFill);
}
