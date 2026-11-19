/**
 * Public enumerations for DrawingML text character properties (`CT_TextCharacterProperties`).
 *
 * @remarks
 * Values are **only** the Transitional `dml-main.xsd` tokens cited below — never invented
 * strings. Public keys use PascalCase Office-facing names; values are the OOXML tokens
 * written to `a:rPr` / `a:defRPr` attributes.
 *
 * Citations:
 * - `ST_TextUnderlineType` (~2854–2874)
 * - `ST_TextStrikeType` (~2893–2898)
 * - `ST_TextCapsType` (~2900–2905)
 */
/**
 * Underline style tokens (`a:rPr` / `a:defRPr` `@u` / `ST_TextUnderlineType`).
 *
 * @public
 */
import { arrayIncludes, objectValues } from '../util/es5-compat';
export const TextUnderlineType: Readonly<Record<string, string>> = Object.freeze({
    /** No underline (`none`). */
    None: 'none',
    /** Underline words only (`words`). */
    Words: 'words',
    /** Single underline (`sng`). */
    Single: 'sng',
    /** Double underline (`dbl`). */
    Double: 'dbl',
    /** Heavy underline (`heavy`). */
    Heavy: 'heavy',
    /** Dotted underline (`dotted`). */
    Dotted: 'dotted',
    /** Heavy dotted underline (`dottedHeavy`). */
    DottedHeavy: 'dottedHeavy',
    /** Dash underline (`dash`). */
    Dash: 'dash',
    /** Heavy dash underline (`dashHeavy`). */
    DashHeavy: 'dashHeavy',
    /** Long dash underline (`dashLong`). */
    DashLong: 'dashLong',
    /** Heavy long dash underline (`dashLongHeavy`). */
    DashLongHeavy: 'dashLongHeavy',
    /** Dot-dash underline (`dotDash`). */
    DotDash: 'dotDash',
    /** Heavy dot-dash underline (`dotDashHeavy`). */
    DotDashHeavy: 'dotDashHeavy',
    /** Dot-dot-dash underline (`dotDotDash`). */
    DotDotDash: 'dotDotDash',
    /** Heavy dot-dot-dash underline (`dotDotDashHeavy`). */
    DotDotDashHeavy: 'dotDotDashHeavy',
    /** Wavy underline (`wavy`). */
    Wavy: 'wavy',
    /** Heavy wavy underline (`wavyHeavy`). */
    WavyHeavy: 'wavyHeavy',
    /** Double wavy underline (`wavyDbl`). */
    WavyDouble: 'wavyDbl'
});
/**
 * One public underline token (`ST_TextUnderlineType` value).
 *
 * @public
 */
export type TextUnderlineTypeValue = (typeof TextUnderlineType)[keyof typeof TextUnderlineType];
const TEXT_UNDERLINE_TYPE_VALUES: ReadonlyArray<TextUnderlineTypeValue> = Object.freeze(
    objectValues(TextUnderlineType) as TextUnderlineTypeValue[]
);
/**
 * Returns `true` when `value` is a public {@link TextUnderlineType} token.
 *
 * @public
 * @param {string} value - The value value.
 * @returns {boolean} The result.
 */
export function isTextUnderlineType(value: string): value is TextUnderlineTypeValue {
    return arrayIncludes(TEXT_UNDERLINE_TYPE_VALUES as ReadonlyArray<string>, value);
}
/**
 * Strike-through style tokens (`@strike` / `ST_TextStrikeType`).
 *
 * @public
 */
export const TextStrikeType: Readonly<{ NoStrike: 'noStrike'; Single: 'sngStrike'; Double: 'dblStrike'; }> = Object.freeze({
    /** No strike (`noStrike`). */
    NoStrike: 'noStrike' as 'noStrike',
    /** Single strike (`sngStrike`). */
    Single: 'sngStrike' as 'sngStrike',
    /** Double strike (`dblStrike`). */
    Double: 'dblStrike' as 'dblStrike'
});
/**
 * One public strike token (`ST_TextStrikeType` value).
 *
 * @public
 */
export type TextStrikeTypeValue = (typeof TextStrikeType)[keyof typeof TextStrikeType];
const TEXT_STRIKE_TYPE_VALUES: ReadonlyArray<TextStrikeTypeValue> = Object.freeze(objectValues(TextStrikeType) as TextStrikeTypeValue[]);
/**
 * Returns `true` when `value` is a public {@link TextStrikeType} token.
 *
 * @public
 * @param {string} value - The value value.
 * @returns {boolean} The result.
 */
export function isTextStrikeType(value: string): value is TextStrikeTypeValue {
    return arrayIncludes(TEXT_STRIKE_TYPE_VALUES as ReadonlyArray<string>, value);
}
/**
 * Capitalization tokens (`@cap` / `ST_TextCapsType`).
 *
 * @public
 */
export const TextCapsType: Readonly<{ None: 'none'; Small: 'small'; All: 'all'; }> = Object.freeze({
    /** No small/all caps (`none`). XSD default when attribute omitted. */
    None: 'none' as 'none',
    /** Small caps (`small`). */
    Small: 'small' as 'small',
    /** All caps (`all`). */
    All: 'all' as 'all'
});
/**
 * One public caps token (`ST_TextCapsType` value).
 *
 * @public
 */
export type TextCapsTypeValue = (typeof TextCapsType)[keyof typeof TextCapsType];
const TEXT_CAPS_TYPE_VALUES: ReadonlyArray<TextCapsTypeValue> = Object.freeze(objectValues(TextCapsType) as TextCapsTypeValue[]);
/**
 * Returns `true` when `value` is a public {@link TextCapsType} token.
 *
 * @public
 * @param {string} value - The value value.
 * @returns {boolean} The result.
 */
export function isTextCapsType(value: string): value is TextCapsTypeValue {
    return arrayIncludes(TEXT_CAPS_TYPE_VALUES as ReadonlyArray<string>, value);
}
