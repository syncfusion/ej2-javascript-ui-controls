/**
 * Document-level math settings (`m:mathPr`, `CT_MathPr`).
 *
 * Source: ECMA-376 shared-math.xsd `CT_MathPr`; parity with compression
 * `OfficeMathProperties` / `SerializeMathProperties`.
 *
 * @packageDocumentation
 */
import { ownValue, setOwnValue } from '../../core/own-value';
import { MATH_NAMESPACE } from './constants';
import { MathmlValidationError } from './errors';
import { createElement, attrValue, childElements, OpenXmlChild, OpenXmlElement } from './openxml';
import { MathBreakBin, MathBreakBinSub, MathJc, MathLimLoc, parseMathBreakBin, parseMathBreakBinSub, parseMathJc, parseMathLimLoc, parseOnOff } from './model/enums';

/**
 * Typed `m:mathPr` settings. All members are optional; absent means "not specified".
 *
 * @public
 */
export interface MathSettings {
    /** Math font name (`m:mathFont`). */
    mathFont?: string;
    /** Break on binary operators (`m:brkBin`). */
    breakOnBinaryOperators?: MathBreakBin;
    /** Break on binary subtraction (`m:brkBinSub`). */
    breakOnBinarySubtraction?: MathBreakBinSub;
    /** Use small fractions (`m:smallFrac`). */
    smallFraction?: boolean;
    /** Display math defaults (`m:dispDef`). */
    displayMathDefaults?: boolean;
    /** Left margin in twips (`m:lMargin`). */
    leftMargin?: number;
    /** Right margin in twips (`m:rMargin`). */
    rightMargin?: number;
    /** Default justification (`m:defJc`). */
    defaultJustification?: MathJc;
    /** Spacing before (`m:preSp`). */
    preSpacing?: number;
    /** Spacing after (`m:postSp`). */
    postSpacing?: number;
    /** Spacing between (`m:interSp`). */
    interSpacing?: number;
    /** Spacing within (`m:intraSp`). */
    intraSpacing?: number;
    /** Wrap indent in twips (`m:wrapIndent`); exclusive with {@link wrapRight}. */
    wrapIndent?: number;
    /** Wrap right (`m:wrapRight`); exclusive with {@link wrapIndent}. */
    wrapRight?: boolean;
    /** Integral limit location (`m:intLim`). */
    integralLimitLocation?: MathLimLoc;
    /** N-ary limit location (`m:naryLim`). */
    naryLimitLocation?: MathLimLoc;
}

const TWIPS_ELEMENTS: ReadonlyArray<[keyof MathSettings, string]> = [
    ['leftMargin', 'lMargin'],
    ['rightMargin', 'rMargin'],
    ['defaultJustification', 'defJc'],
    ['preSpacing', 'preSp'],
    ['postSpacing', 'postSp'],
    ['interSpacing', 'interSp'],
    ['intraSpacing', 'intraSp']
];

/**
 * The child.
 *
 * @param {OpenXmlElement} pr - The pr.
 * @param {string} name - The name.
 * @returns {OpenXmlElement | undefined} The result.
 */
function child(pr: OpenXmlElement, name: string): OpenXmlElement | undefined {
    return childElements(pr).find((c: OpenXmlElement) => c.namespaceUri === MATH_NAMESPACE && c.localName === name);
}
/**
 * The val.
 *
 * @param {OpenXmlElement} pr - The pr.
 * @param {string} name - The name.
 * @returns {string | undefined} The result.
 */
function val(pr: OpenXmlElement, name: string): string | undefined {
    const c: OpenXmlElement = child(pr, name);
    return c ? attrValue(c, 'val') : undefined;
}
/**
 * The twips.
 *
 * @param {OpenXmlElement} pr - The pr.
 * @param {string} name - The name.
 * @returns {number | undefined} The result.
 */
function twips(pr: OpenXmlElement, name: string): number | undefined {
    const v: string = val(pr, name);
    return v !== undefined && /^\d+$/.test(v) ? Number(v) : undefined;
}
/**
 * The on off.
 *
 * @param {OpenXmlElement} pr - The pr.
 * @param {string} name - The name.
 * @returns {boolean | undefined} The result.
 */
function onOff(pr: OpenXmlElement, name: string): boolean | undefined {
    const c: OpenXmlElement = child(pr, name);
    if (!c) {
        return undefined;
    }
    const v: string = attrValue(c, 'val');
    return v === undefined ? true : parseOnOff(v);
}

/**
 * Parse an `m:mathPr` element. Unknown or invalid values are omitted (tolerant).
 *
 * @param {OpenXmlElement} mathPr - The math pr.
 * @returns {MathSettings} The result.
 * @public
 */
export function parseMathSettings(mathPr: OpenXmlElement): MathSettings {
    const s: MathSettings = {};
    const set: <K extends keyof MathSettings>(k: K, v: MathSettings[K]) => void = <K extends keyof MathSettings>(
        k: K,
        v: MathSettings[K] | undefined
    ): void => {
        if (v !== undefined) {
            setOwnValue(s, k, v);
        }
    };
    set('mathFont', val(mathPr, 'mathFont'));
    const bb: string = val(mathPr, 'brkBin');
    set('breakOnBinaryOperators', bb !== undefined ? parseMathBreakBin(bb) : undefined);
    const bs: string = val(mathPr, 'brkBinSub');
    set('breakOnBinarySubtraction', bs !== undefined ? parseMathBreakBinSub(bs) : undefined);
    set('smallFraction', onOff(mathPr, 'smallFrac'));
    set('displayMathDefaults', onOff(mathPr, 'dispDef'));
    set('leftMargin', twips(mathPr, 'lMargin'));
    set('rightMargin', twips(mathPr, 'rMargin'));
    const jc: string = val(mathPr, 'defJc');
    set('defaultJustification', jc !== undefined ? parseMathJc(jc) : undefined);
    set('preSpacing', twips(mathPr, 'preSp'));
    set('postSpacing', twips(mathPr, 'postSp'));
    set('interSpacing', twips(mathPr, 'interSp'));
    set('intraSpacing', twips(mathPr, 'intraSp'));
    set('wrapIndent', twips(mathPr, 'wrapIndent'));
    set('wrapRight', onOff(mathPr, 'wrapRight'));
    const il: string = val(mathPr, 'intLim');
    set('integralLimitLocation', il !== undefined ? parseMathLimLoc(il) : undefined);
    const nl: string = val(mathPr, 'naryLim');
    set('naryLimitLocation', nl !== undefined ? parseMathLimLoc(nl) : undefined);
    return s;
}

/**
 * Serialize {@link MathSettings} to `m:mathPr` in schema order.
 *
 * @param {MathSettings} settings - The settings.
 * @param {string} prefix - The prefix.
 * @returns {OpenXmlElement} The result.
 * @throws MathmlValidationError when `wrapIndent` and `wrapRight` are both set, or a twips value is not a non-negative integer.
 * @public
 */
export function mathSettingsToOpenXml(settings: MathSettings, prefix: string = 'm'): OpenXmlElement {
    const kids: OpenXmlChild[] = [];
    const el: (name: string, value: string) => void = (name: string, value: string): void => {
        kids.push(createElement(MATH_NAMESPACE, name, prefix, {
            attributes: [{ namespaceUri: '', localName: 'val', prefix: '', value }],
            children: []
        }));
    };
    const flag: (name: string, v: boolean | undefined) => void = (name: string, v: boolean | undefined): void => {
        if (v !== undefined) {
            el(name, v ? '1' : '0');
        }
    };
    const tw: (name: string, v: number | undefined) => void = (name: string, v: number | undefined): void => {
        if (v === undefined) {
            return;
        }
        if (!Number.isInteger(v) || v < 0) {
            throw new MathmlValidationError(`${name} must be a non-negative integer, got ${String(v)}`, `mathPr.${name}`, 'value-range');
        }
        el(name, String(v));
    };
    if (settings.wrapIndent !== undefined && settings.wrapRight !== undefined) {
        throw new MathmlValidationError('wrapIndent and wrapRight are mutually exclusive', 'mathPr', 'child-order');
    }
    if (settings.mathFont !== undefined) { el('mathFont', settings.mathFont); }
    if (settings.breakOnBinaryOperators !== undefined) { el('brkBin', settings.breakOnBinaryOperators); }
    if (settings.breakOnBinarySubtraction !== undefined) { el('brkBinSub', settings.breakOnBinarySubtraction); }
    flag('smallFrac', settings.smallFraction);
    flag('dispDef', settings.displayMathDefaults);
    for (const [key, name] of TWIPS_ELEMENTS) {
        const v: string | number | boolean = ownValue<string | number | boolean>(settings, key);
        if (typeof v === 'string') {
            el(name, v);
        } else {
            tw(name, v as number | undefined);
        }
    }
    tw('wrapIndent', settings.wrapIndent);
    flag('wrapRight', settings.wrapRight);
    if (settings.integralLimitLocation !== undefined) { el('intLim', settings.integralLimitLocation); }
    if (settings.naryLimitLocation !== undefined) { el('naryLim', settings.naryLimitLocation); }
    return createElement(MATH_NAMESPACE, 'mathPr', prefix, { attributes: [], children: kids });
}
