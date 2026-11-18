import { Literal } from '../../../core/literal-type';
/**
 * Office Math authoring enumerations.
 *
 * Values mirror the Compression `Syncfusion.Office` Math enums so scratch-level
 * authoring behaves identically to DocIO. OMML token mapping lives in the
 * parser/serializer.
 */

/** Math paragraph justification. @public */
export enum MathJustification {
    CenterGroup = 0,
    Center = 1,
    Left = 2,
    Right = 3,
}

/** Math script (font family class) of a run. @public */
export enum MathFontType {
    DoubleStruck = 0,
    Fraktur = 1,
    Monospace = 2,
    Roman = 3,
    SansSerif = 4,
    Script = 5,
}

/** Math run style. @public */
export enum MathStyleType {
    Italic = 0,
    BoldItalic = 1,
    Bold = 2,
    Regular = 3,
}

/** Identifies the concrete Math function created by the function factory. @public */
export enum MathFunctionType {
    /** Unrecognized `m:*` element preserved verbatim; never created by the factory. */
    Unknown = 0,
    Accent = 1,
    Bar = 2,
    BorderBox = 3,
    Box = 4,
    Delimiter = 5,
    EquationArray = 6,
    Fraction = 7,
    Function = 8,
    GroupCharacter = 9,
    Limit = 10,
    Matrix = 11,
    NArray = 12,
    Phantom = 13,
    Radical = 14,
    LeftSubSuperscript = 15,
    SubSuperscript = 16,
    RightSubSuperscript = 17,
    RunElement = 18,
}

/** Delimiter shape. @public */
export enum MathDelimiterShapeType {
    Centered = 0,
    Match = 1,
}

/** Fraction type. @public */
export enum MathFractionType {
    NormalFractionBar = 0,
    NoFractionBar = 1,
    SkewedFractionBar = 2,
    FractionInline = 3,
}

/** Horizontal alignment of a matrix column. @public */
export enum MathHorizontalAlignment {
    Center = 0,
    Left = 1,
    Right = 2,
}

/** Vertical alignment of a matrix or equation array. @public */
export enum MathVerticalAlignment {
    Center = 0,
    Top = 1,
    Bottom = 2,
}

/** Spacing rule for matrix and equation array spacing. @public */
export enum SpacingRule {
    Single = 0,
    OneAndHalf = 1,
    Double = 2,
    Exactly = 3,
    Multiple = 4,
}

/** Script type of a single sub/superscript function. @public */
export enum MathScriptType {
    Superscript = 0,
    Subscript = 1,
}

/** Limit type of a limit function. @public */
export enum MathLimitType {
    LowerLimit = 0,
    UpperLimit = 1,
}

/** Em constant used by matrix spacing (half-em snapping). */
export const MATH_EM: Literal<12> = 12;
