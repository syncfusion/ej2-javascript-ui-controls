/**
 * Picture layout and transform domain types (WordprocessingDrawing + DrawingML).
 *
 * Enumerations are taken from Transitional `dml-wordprocessingDrawing.xsd`
 * (`ST_RelFromH`, `ST_RelFromV`, `ST_AlignH`, `ST_AlignV`) and picture host
 * placement conventions. Do not invent tokens.
 *
 * @packageDocumentation
 */
import { enumValues } from '../../core/compat/object-compat';
/**
 * Drawing host placement (`wp:inline` vs `wp:anchor`).
 *
 * @private
 */
export enum PicturePlacement {
    Inline = 'inline',
    Anchored = 'anchored'
}
/**
 * Specifies how text wraps around a picture.
 *
 * Inline places the picture in the line of text, and the remaining values wrap text around the picture.
 *
 * @public
 */
export enum TextWrappingStyle {
    /** Specifies the inline style. */
    Inline = 'inline',
    /** Specifies the none style. */
    None = 'none',
    /** Specifies the square style. */
    Square = 'square',
    /** Specifies the tight style. */
    Tight = 'tight',
    /** Specifies the through style. */
    Through = 'through',
    /** Specifies the top and bottom style. */
    TopAndBottom = 'topAndBottom'
}
/**
 * Specifies the horizontal reference that a shape or picture is positioned against.
 *
 * @public
 */
export enum HorizontalOrigin {
    /** Specifies the margin origin. */
    Margin = 'margin',
    /** Specifies the page origin. */
    Page = 'page',
    /** Specifies the column origin. */
    Column = 'column',
    /** Specifies the character origin. */
    Character = 'character',
    /** Specifies the left margin origin. */
    LeftMargin = 'leftMargin',
    /** Specifies the right margin origin. */
    RightMargin = 'rightMargin',
    /** Specifies the inside margin origin. */
    InsideMargin = 'insideMargin',
    /** Specifies the outside margin origin. */
    OutsideMargin = 'outsideMargin'
}
/**
 * Specifies the vertical reference that a shape or picture is positioned against.
 *
 * @public
 */
export enum VerticalOrigin {
    /** Specifies the margin origin. */
    Margin = 'margin',
    /** Specifies the page origin. */
    Page = 'page',
    /** Specifies the paragraph origin. */
    Paragraph = 'paragraph',
    /** Specifies the line origin. */
    Line = 'line',
    /** Specifies the top margin origin. */
    TopMargin = 'topMargin',
    /** Specifies the bottom margin origin. */
    BottomMargin = 'bottomMargin',
    /** Specifies the inside margin origin. */
    InsideMargin = 'insideMargin',
    /** Specifies the outside margin origin. */
    OutsideMargin = 'outsideMargin'
}
/**
 * Specifies the horizontal alignment of a shape or picture relative to its origin.
 *
 * @public
 */
export enum HorizontalAlignment {
    /** Specifies the left alignment. */
    Left = 'left',
    /** Specifies the right alignment. */
    Right = 'right',
    /** Specifies the center alignment. */
    Center = 'center',
    /** Specifies the inside alignment. */
    Inside = 'inside',
    /** Specifies the outside alignment. */
    Outside = 'outside',
    /** Model-only: axis uses posOffset (no wp:align). Not a schema token. */
    None = 'none',
    /** Model-only: residual align token was unrecognized. Not a schema token. */
    Unknown = 'unknown'
}
/**
 * Schema ST_AlignH wire tokens (excludes model-only None/Unknown).
 *
 * @private
 */
export const HORIZONTAL_ALIGNMENT_WIRE_VALUES: ReadonlyArray<HorizontalAlignment> = [
    HorizontalAlignment.Left,
    HorizontalAlignment.Right,
    HorizontalAlignment.Center,
    HorizontalAlignment.Inside,
    HorizontalAlignment.Outside
];
/**
 * Closed set of public HorizontalAlignment values.
 *
 * @public
 */
export const HORIZONTAL_ALIGNMENT_VALUES: ReadonlyArray<HorizontalAlignment> = enumValues<HorizontalAlignment>(HorizontalAlignment);
/**
 * Specifies the vertical alignment of a shape or picture relative to its origin.
 *
 * @public
 */
export enum VerticalAlignment {
    /** Specifies the top alignment. */
    Top = 'top',
    /** Specifies the bottom alignment. */
    Bottom = 'bottom',
    /** Specifies the center alignment. */
    Center = 'center',
    /** Specifies the inside alignment. */
    Inside = 'inside',
    /** Specifies the outside alignment. */
    Outside = 'outside',
    /** Model-only: axis uses posOffset (no wp:align). Not a schema token. */
    None = 'none',
    /** Model-only: residual align token was unrecognized. Not a schema token. */
    Unknown = 'unknown'
}
/**
 * Schema ST_AlignV wire tokens (excludes model-only None/Unknown).
 *
 * @private
 */
export const VERTICAL_ALIGNMENT_WIRE_VALUES: ReadonlyArray<VerticalAlignment> = [
    VerticalAlignment.Top,
    VerticalAlignment.Bottom,
    VerticalAlignment.Center,
    VerticalAlignment.Inside,
    VerticalAlignment.Outside
];
/**
 * Closed set of public VerticalAlignment values.
 *
 * @public
 */
export const VERTICAL_ALIGNMENT_VALUES: ReadonlyArray<VerticalAlignment> = enumValues<VerticalAlignment>(VerticalAlignment);
const PICTURE_PLACEMENT_VALUES: Set<string> = new Set<string>(enumValues<PicturePlacement>(PicturePlacement));
const TEXT_WRAPPING_STYLE_VALUES: Set<string> = new Set<string>(enumValues<TextWrappingStyle>(TextWrappingStyle));
const HORIZONTAL_ORIGIN_VALUES: Set<string> = new Set<string>(enumValues<HorizontalOrigin>(HorizontalOrigin));
const VERTICAL_ORIGIN_VALUES: Set<string> = new Set<string>(enumValues<VerticalOrigin>(VerticalOrigin));
const HORIZONTAL_ALIGNMENT_ALL_SET: Set<string> = new Set<string>(HORIZONTAL_ALIGNMENT_VALUES as ReadonlyArray<string>);
const VERTICAL_ALIGNMENT_ALL_SET: Set<string> = new Set<string>(VERTICAL_ALIGNMENT_VALUES as ReadonlyArray<string>);
const HORIZONTAL_ALIGNMENT_WIRE_SET_INTERNAL: Set<string> = new Set<string>(
    HORIZONTAL_ALIGNMENT_WIRE_VALUES as ReadonlyArray<string>
);
const VERTICAL_ALIGNMENT_WIRE_SET_INTERNAL: Set<string> = new Set<string>(
    VERTICAL_ALIGNMENT_WIRE_VALUES as ReadonlyArray<string>
);
/**
 * @param {string} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isPicturePlacement(value: string): value is PicturePlacement {
    return PICTURE_PLACEMENT_VALUES.has(value);
}
/**
 * @param {string} value - Specifies the value.
 * @returns {boolean} Returns the result.
 * @public
 */
export function isTextWrappingStyle(value: string): value is TextWrappingStyle {
    return TEXT_WRAPPING_STYLE_VALUES.has(value);
}
/**
 * @param {string} value - Specifies the value.
 * @returns {boolean} Returns the result.
 * @public
 */
export function isHorizontalOrigin(value: string): value is HorizontalOrigin {
    return HORIZONTAL_ORIGIN_VALUES.has(value);
}
/**
 * @param {string} value - Specifies the value.
 * @returns {boolean} Returns the result.
 * @public
 */
export function isVerticalOrigin(value: string): value is VerticalOrigin {
    return VERTICAL_ORIGIN_VALUES.has(value);
}
/**
 * @param {string} value - Specifies the value.
 * @returns {boolean} Returns the result.
 * @public
 */
export function isHorizontalAlignment(value: string): value is HorizontalAlignment {
    return HORIZONTAL_ALIGNMENT_ALL_SET.has(value);
}
/**
 * Whether value is a serializable ST_AlignH token (excludes None/Unknown).
 *
 * @param {string} value - The value.
 * @returns {boolean} The result.
 * @private
 */
export function isHorizontalAlignmentWire(value: string): boolean {
    return HORIZONTAL_ALIGNMENT_WIRE_SET_INTERNAL.has(value);
}
/**
 * @param {string} value - Specifies the value.
 * @returns {boolean} Returns the result.
 * @public
 */
export function isVerticalAlignment(value: string): value is VerticalAlignment {
    return VERTICAL_ALIGNMENT_ALL_SET.has(value);
}
/**
 * Whether value is a serializable ST_AlignV token (excludes None/Unknown).
 *
 * @param {string} value - The value.
 * @returns {boolean} The result.
 * @private
 */
export function isVerticalAlignmentWire(value: string): boolean {
    return VERTICAL_ALIGNMENT_WIRE_SET_INTERNAL.has(value);
}
/**
 * Throws {@link RangeError} when `value` is not a known enum member.
 *
 * @param {string} label - The label.
 * @param {string} value - The value.
 * @param {ReadonlySet<string>} allowed - The allowed.
 * @returns {void} Nothing is returned.
 * @private
 */
export function assertEnumMember(label: string, value: string, allowed: ReadonlySet<string>): void {
    if (!allowed.has(value)) {
        throw new RangeError(`Invalid ${label} value "${value}"; expected one of: ${[...allowed].join(', ')}`);
    }
}
/**
 * @private
 */
export const PICTURE_PLACEMENT_SET: Set<string> = PICTURE_PLACEMENT_VALUES;
/**
 * @private
 */
export const TEXT_WRAPPING_STYLE_SET: Set<string> = TEXT_WRAPPING_STYLE_VALUES;
/**
 * @private
 */
export const HORIZONTAL_ORIGIN_SET: Set<string> = HORIZONTAL_ORIGIN_VALUES;
/**
 * @private
 */
export const VERTICAL_ORIGIN_SET: Set<string> = VERTICAL_ORIGIN_VALUES;
/**
 * Full public set including model-only None/Unknown (type guard / getters).
 *
 * @private
 */
export const HORIZONTAL_ALIGNMENT_SET: Set<string> = HORIZONTAL_ALIGNMENT_ALL_SET;
/**
 * Schema-only ST_AlignH tokens for authoring setters that reject model-only values.
 *
 * @private
 */
export const HORIZONTAL_ALIGNMENT_WIRE_SET: Set<string> = HORIZONTAL_ALIGNMENT_WIRE_SET_INTERNAL;
/**
 * Full public set including model-only None/Unknown (type guard / getters).
 *
 * @private
 */
export const VERTICAL_ALIGNMENT_SET: Set<string> = VERTICAL_ALIGNMENT_ALL_SET;
/**
 * Schema-only ST_AlignV tokens for authoring setters that reject model-only values.
 *
 * @private
 */
export const VERTICAL_ALIGNMENT_WIRE_SET: Set<string> = VERTICAL_ALIGNMENT_WIRE_SET_INTERNAL;

/**
 * Wrap side behavior for anchored square/tight/through hosts.
 *
 * `Unknown` is model-only (not a schema token) and is never written as `@wrapText`.
 *
 * @public
 */
export enum TextWrappingType {
    /** Specifies the both type. */
    Both = 'bothSides',
    /** Specifies the left type. */
    Left = 'left',
    /** Specifies the right type. */
    Right = 'right',
    /** Specifies the largest type. */
    Largest = 'largest',
    /** Model-only: residual wrapText was unrecognized. Not a schema token. */
    Unknown = 'unknown'
}
/**
 * Closed set of public TextWrappingType values.
 *
 * @public
 */
export const TEXT_WRAPPING_TYPE_VALUES: ReadonlyArray<TextWrappingType> = enumValues<TextWrappingType>(TextWrappingType);
/**
 * Schema wrapText tokens (excludes model-only Unknown).
 *
 * @private
 */
export const TEXT_WRAPPING_TYPE_WIRE_VALUES: ('unknown' | 'left' | 'right' | 'bothSides' | 'largest')[] = TEXT_WRAPPING_TYPE_VALUES.filter(function (v: 'unknown' | 'left' | 'right' | 'bothSides' | 'largest'): boolean {
    return v !== TextWrappingType.Unknown;
});
const TEXT_WRAPPING_TYPE_ALL_SET: ReadonlySet<string> = new Set(TEXT_WRAPPING_TYPE_VALUES as ReadonlyArray<string>);
const TEXT_WRAPPING_TYPE_WIRE_SET_INTERNAL: ReadonlySet<string> = new Set(
    TEXT_WRAPPING_TYPE_WIRE_VALUES as ReadonlyArray<string>
);
/**
 * Full public set including Unknown (type guard / getters).
 *
 * @private
 */
export const TEXT_WRAPPING_TYPE_SET: ReadonlySet<string> = TEXT_WRAPPING_TYPE_ALL_SET;
/**
 * Schema-only wrapText tokens for authoring setters.
 *
 * @private
 */
export const TEXT_WRAPPING_TYPE_WIRE_SET: ReadonlySet<string> = TEXT_WRAPPING_TYPE_WIRE_SET_INTERNAL;
/**
 *  @public
 *
 * @param {string} value - Specifies the value.
 * @returns {boolean} Returns the result.
 */
export function isTextWrappingType(value: string): value is TextWrappingType {
    return TEXT_WRAPPING_TYPE_ALL_SET.has(value);
}
/**
 *  Whether value is a serializable wrapText token (excludes Unknown).
 *
 * @param {string} value - The value.
 * @returns {boolean} The result.
 * @private
 */
export function isTextWrappingTypeWire(value: string): boolean {
    return TEXT_WRAPPING_TYPE_WIRE_SET_INTERNAL.has(value);
}
