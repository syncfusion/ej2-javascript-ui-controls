import { enumValues } from '../../core/compat/object-compat';
/**
 * Numbering formats for image-caption `SEQ` fields.
 *
 * Each value maps to the corresponding general-formatting switch of the `SEQ`
 * field instruction (ECMA-376-1 §17.16.5 switch table).
 *
 * @public
 */
export enum CaptionNumberingFormat {
    /** `\* ARABIC` — decimal digits (`1`, `2`, `3`). */
    Arabic = 'arabic',
    /** `\* ROMAN` — uppercase Roman numerals (`I`, `II`, `III`). */
    UpperCaseRoman = 'upperCaseRoman',
    /** `\* roman` — lowercase Roman numerals (`i`, `ii`, `iii`). */
    LowerCaseRoman = 'lowerCaseRoman',
    /** `\* ALPHABETIC` — uppercase letters (`A`, `B`, … `Z`, `AA`). */
    UpperCaseLetter = 'upperCaseLetter',
    /** `\* alphabetic` — lowercase letters (`a`, `b`, … `z`, `aa`). */
    LowerCaseLetter = 'lowerCaseLetter'
}
/**
 * Position of a caption paragraph relative to the image's paragraph.
 *
 * @public
 */
export enum CaptionPosition {
    /** Caption paragraph immediately before the image paragraph. */
    Above = 'above',
    /** Caption paragraph immediately after the image paragraph. */
    Below = 'below'
}
/**
 * Word `SEQ` general-formatting switch for each numbering format
 * (ECMA-376-1 §17.16.5 switch table; tokens must not be invented beyond these).
 *
 * @private
 */
export const CAPTION_FORMAT_SWITCH: Readonly<Record<CaptionNumberingFormat, string>> = {
    [CaptionNumberingFormat.Arabic]: 'ARABIC',
    [CaptionNumberingFormat.UpperCaseRoman]: 'ROMAN',
    [CaptionNumberingFormat.LowerCaseRoman]: 'roman',
    [CaptionNumberingFormat.UpperCaseLetter]: 'ALPHABETIC',
    [CaptionNumberingFormat.LowerCaseLetter]: 'alphabetic'
};
/**
 * @private
 */
export const CAPTION_NUMBERING_FORMATS: ReadonlySet<string> = new Set(enumValues<CaptionNumberingFormat>(CaptionNumberingFormat));
/**
 * @private
 */
export const CAPTION_POSITIONS: ReadonlySet<string> = new Set(enumValues<CaptionPosition>(CaptionPosition));
/**
 *  Format a 1-based sequence value per the numbering format (Word display rules).
 *
 * @param {number} value - The value.
 * @param {CaptionNumberingFormat} format - The format.
 * @returns {string} The result.
 * @private
 */
export function formatSequenceValue(value: number, format: CaptionNumberingFormat): string {
    if (format === CaptionNumberingFormat.Arabic) {
        return String(value);
    }
    if (format === CaptionNumberingFormat.UpperCaseRoman ||
        format === CaptionNumberingFormat.LowerCaseRoman) {
        const roman: string = toRoman(value);
        return format === CaptionNumberingFormat.UpperCaseRoman ? roman : roman.toLowerCase();
    }
    return toAlphabetic(value, format === CaptionNumberingFormat.UpperCaseLetter);
}
const ROMAN_STEPS: ReadonlyArray<[
    number,
    string
]> = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I']
];
function toRoman(value: number): string {
    let remaining: number = value;
    let out: string = '';
    for (const [step, glyph] of ROMAN_STEPS) {
        while (remaining >= step) {
            out += glyph;
            remaining -= step;
        }
    }
    return out;
}
/**
 *  1→`A` … 26→`Z`, 27→`AA` (Word alphabetic wrap).
 *
 * @param {number} value - The value.
 * @param {boolean} upper - The upper.
 * @returns {string} The result.
 */
function toAlphabetic(value: number, upper: boolean): string {
    let remaining: number = value;
    let out: string = '';
    while (remaining > 0) {
        const digit: number = ((remaining - 1) % 26) + 1;
        const char: string = String.fromCharCode((upper ? 64 : 96) + digit);
        out = char + out;
        remaining = Math.floor((remaining - 1) / 26);
    }
    return out;
}
