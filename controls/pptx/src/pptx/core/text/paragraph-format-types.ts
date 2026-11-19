/**
 * Public enumerations for DrawingML paragraph properties (`CT_TextParagraphProperties`).
 *
 * @remarks
 * Values are **only** the Transitional `dml-main.xsd` tokens cited below — never invented
 * strings. Public keys use PascalCase Office-facing names; values are the OOXML tokens
 * written to `a:pPr` attributes.
 *
 * Citations:
 * - `ST_TextAlignType` (`dml-main.xsd` ~3008–3018)
 */
/**
 * Horizontal alignment tokens (`a:pPr` `@algn` / `ST_TextAlignType`).
 *
 * @remarks
 * Citation: Transitional `dml-main.xsd` `ST_TextAlignType` enumerates exactly these
 * seven tokens. The XSD default when `@algn` is omitted is `l` (Left) per
 * `CT_TextParagraphProperties`; the public {@link Paragraph.horizontalAlignment}
 * getter reports the **direct** value only (`undefined` when the attribute is
 * absent), it does not resolve that schema default.
 *
 * @public
 */
import { arrayIncludes, objectValues } from '../util/es5-compat';
export const HorizontalAlignmentType: Readonly<Record<string, string>> = Object.freeze({
    /** Left (`l`). */
    Left: 'l',
    /** Center (`ctr`). */
    Center: 'ctr',
    /** Right (`r`). */
    Right: 'r',
    /** Justified (`just`). */
    Justify: 'just',
    /** Low justified (`justLow`). */
    JustifyLow: 'justLow',
    /** Distributed (`dist`). */
    Distributed: 'dist',
    /** Thai distributed (`thaiDist`). */
    ThaiDistributed: 'thaiDist'
});
/**
 * One public horizontal-alignment token (`ST_TextAlignType` value).
 *
 * @public
 */
export type HorizontalAlignmentTypeValue = (typeof HorizontalAlignmentType)[keyof typeof HorizontalAlignmentType];
const HORIZONTAL_ALIGNMENT_TYPE_VALUES: ReadonlyArray<HorizontalAlignmentTypeValue> = Object.freeze(
    objectValues(HorizontalAlignmentType) as HorizontalAlignmentTypeValue[]
);
/**
 * Returns `true` when `value` is a public {@link HorizontalAlignmentType} token.
 *
 * @public
 * @param {string} value - The value value.
 * @returns {boolean} The result.
 */
export function isHorizontalAlignmentType(value: string): value is HorizontalAlignmentTypeValue {
    return arrayIncludes(HORIZONTAL_ALIGNMENT_TYPE_VALUES as ReadonlyArray<string>, value);
}
/**
 * How a paragraph spacing value is expressed on `CT_TextSpacing`
 * (`a:lnSpc` / `a:spcBef` / `a:spcAft`).
 *
 * @remarks
 * Maps to the DrawingML choice under `CT_TextSpacing`:
 * - {@link TextSpacingType.Points} → `a:spcPts` (`ST_TextSpacingPoint`)
 * - {@link TextSpacingType.Percent} → `a:spcPct` (`ST_TextSpacingPercent`
 *   `ST_TextSpacingPercentOrPercentString`)
 *
 * Citations: Transitional `dml-main.xsd` `CT_TextSpacing` (~2947–2966);
 * `ST_TextSpacingPoint` / `ST_TextSpacingPercent`; ECMA-376-1 §21.1.2.2.11–12.
 *
 * @public
 */
export const TextSpacingType: Readonly<{ Points: 'points'; Percent: 'percent'; }> = Object.freeze({
    /** Spacing in typographic points (`a:spcPts`). */
    Points: 'points' as 'points',
    /** Spacing as a percentage (`a:spcPct`). */
    Percent: 'percent' as 'percent'
});
/**
 * One public spacing-expression token (`points` | `percent`).
 *
 * @public
 */
export type TextSpacingTypeValue = (typeof TextSpacingType)[keyof typeof TextSpacingType];
const TEXT_SPACING_TYPE_VALUES: ReadonlyArray<TextSpacingTypeValue> = Object.freeze(
    objectValues(TextSpacingType) as TextSpacingTypeValue[]
);
/**
 * Authoring value for `Paragraph.lineSpacing` / `spaceBefore` / `spaceAfter`.
 *
 * @remarks
 * - **points:** typographic points. Wire form is `a:spcPts@val` =
 *   `round(points * 100)` (`ST_TextSpacingPoint` inclusive `[0, 158400]` →
 *   public `[0, 1584]` pt). ECMA-376-1 §21.1.2.2.12: “100 is equal to 1 point”.
 * - **percent:** percentage of line height / normal spacing. Wire form is
 *   `a:spcPct@val` = `round(percent * 1000)` as `ST_PercentageDecimal`
 *   (thousandths of a percent). Inclusive wire `[0, 13200000]` → public
 *   `[0, 13200]` percent. Templates use e.g. `90000` for 90%.
 *
 * Citations: Transitional `dml-main.xsd` `CT_TextSpacing`, `ST_TextSpacingPoint`,
 * `ST_TextSpacingPercent` / `ST_TextSpacingPercentOrPercentString`; shared
 * `ST_PercentageDecimal`.
 *
 * @public
 */
export interface TextSpacingValue {
    readonly type: TextSpacingTypeValue;
    readonly value: number;
}
/**
 * Returns `true` when `value` is a public {@link TextSpacingType} token.
 *
 * @public
 * @param {string} value - The value value.
 * @returns {boolean} The result.
 */
export function isTextSpacingType(value: string): value is TextSpacingTypeValue {
    return arrayIncludes(TEXT_SPACING_TYPE_VALUES as ReadonlyArray<string>, value);
}
