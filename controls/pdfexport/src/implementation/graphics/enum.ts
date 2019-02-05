/**
 * public Enum for `PdfHorizontalAlignment`.
 * @private
 */
export enum PdfHorizontalAlignment {
    /**
     * Specifies the type of `Left`.
     * @private
     */
    Left,
    /**
     * Specifies the type of `Center`.
     * @private
     */
    Center,
    /**
     * Specifies the type of `Right`.
     * @private
     */
    Right
}
/**
 * public Enum for `PdfVerticalAlignment`.
 * @private
 */
export enum PdfVerticalAlignment {
    /**
     * Specifies the type of `Top`.
     * @private
     */
    Top,
    /**
     * Specifies the type of `Middle`.
     * @private
     */
    Middle,
    /**
     * Specifies the type of `Bottom`.
     * @private
     */
    Bottom,
}
/**
 * public Enum for `public`.
 * @private
 */
export enum PdfTextAlignment {
    /**
     * Specifies the type of `Left`.
     * @private
     */
    Left,
    /**
     * Specifies the type of `Center`.
     * @private
     */
    Center,
    /**
     * Specifies the type of `Right`.
     * @private
     */
    Right,
    /**
     * Specifies the type of `Justify`.
     * @private
     */
    Justify
}
/**
 * public Enum for `TextRenderingMode`.
 * @private
 */
export enum TextRenderingMode {
    /**
     * Specifies the type of `Fill`.
     * @private
     */
    Fill = 0,
    /**
     * Specifies the type of `Stroke`.
     * @private
     */
    Stroke = 1,
    /**
     * Specifies the type of `FillStroke`.
     * @private
     */
    FillStroke = 2,
    /**
     * Specifies the type of `None`.
     * @private
     */
    None = 3,
    /**
     * Specifies the type of `ClipFlag`.
     * @private
     */
    ClipFlag = 4,
    /**
     * Specifies the type of `ClipFill`.
     * @private
     */
    ClipFill = Fill | ClipFlag,
    /**
     * Specifies the type of `ClipStroke`.
     * @private
     */
    ClipStroke = Stroke | ClipFlag,
    /**
     * Specifies the type of `ClipFillStroke`.
     * @private
     */
    ClipFillStroke = FillStroke | ClipFlag,
    /**
     * Specifies the type of `Clip`.
     * @private
     */
    Clip = None | ClipFlag,
}
/**
 * public Enum for `PdfLineJoin`.
 * @private
 */
export enum PdfLineJoin {
    /**
     * Specifies the type of `Miter`.
     * @private
     */
    Miter = 0,
    /**
     * Specifies the type of `Round`.
     * @private
     */
    Round = 1,
    /**
     * Specifies the type of `Bevel`.
     * @private
     */
    Bevel = 2
}
/**
 * public Enum for `PdfLineCap`.
 * @private
 */
export enum PdfLineCap {
    /**
     * Specifies the type of `Flat`.
     * @private
     */
    Flat = 0,
    /**
     * Specifies the type of `Round`.
     * @private
     */
    Round = 1,
    /**
     * Specifies the type of `Square`.
     * @private
     */
    Square = 2
}
/**
 * public Enum for `PdfDashStyle`.
 * @private
 */
export enum PdfDashStyle {
    /**
     * Specifies the type of `Solid`.
     * @private
     */
    Solid = 0,
    /**
     * Specifies the type of `Dash`.
     * @private
     */
    Dash = 1,
    /**
     * Specifies the type of `Dot`.
     * @private
     */
    Dot = 2,
    /**
     * Specifies the type of `DashDot`.
     * @private
     */
    DashDot = 3,
    /**
     * Specifies the type of `DashDotDot`.
     * @private
     */
    DashDotDot = 4,
    /**
     * Specifies the type of `Custom`.
     * @private
     */
    Custom = 5,
}
/**
 * public Enum for `PdfFillMode`.
 * @private
 */
export enum PdfFillMode {
    /**
     * Specifies the type of `Winding`.
     * @private
     */
    Winding,
    /**
     * Specifies the type of `Alternate`.
     * @private
     */
    Alternate
}
/**
 * public Enum for `PdfColorSpace`.
 * @private
 */
export enum PdfColorSpace {
    /**
     * Specifies the type of `Rgb`.
     * @private
     */
    Rgb,
    /**
     * Specifies the type of `Cmyk`.
     * @private
     */
    Cmyk,
    /**
     * Specifies the type of `GrayScale`.
     * @private
     */
    GrayScale,
    /**
     * Specifies the type of `Indexed`.
     * @private
     */
    Indexed
}
/**
 * public Enum for `PdfBlendMode`.
 * @private
 */
export enum PdfBlendMode {
    /**
     * Specifies the type of `Normal`.
     * @private
     */
    Normal,
    /**
     * Specifies the type of `Multiply`.
     * @private
     */
    Multiply,
    /**
     * Specifies the type of `Screen`.
     * @private
     */
    Screen,
    /**
     * Specifies the type of `Overlay`.
     * @private
     */
    Overlay,
    /**
     * Specifies the type of `Darken`.
     * @private
     */
    Darken,
    /**
     * Specifies the type of `Lighten`.
     * @private
     */
    Lighten,
    /**
     * Specifies the type of `ColorDodge`.
     * @private
     */
    ColorDodge,
    /**
     * Specifies the type of `ColorBurn`.
     * @private
     */
    ColorBurn,
    /**
     * Specifies the type of `HardLight`.
     * @private
     */
    HardLight,
    /**
     * Specifies the type of `SoftLight`.
     * @private
     */
    SoftLight,
    /**
     * Specifies the type of `Difference`.
     * @private
     */
    Difference,
    /**
     * Specifies the type of `Exclusion`.
     * @private
     */
    Exclusion,
    /**
     * Specifies the type of `Hue`.
     * @private
     */
    Hue,
    /**
     * Specifies the type of `Saturation`.
     * @private
     */
    Saturation,
    /**
     * Specifies the type of `Color`.
     * @private
     */
    Color,
    /**
     * Specifies the type of `Luminosity`.
     * @private
     */
    Luminosity
}
/**
 * public Enum for `PdfGraphicsUnit`.
 * @private
 */
export enum PdfGraphicsUnit {
    /**
     * Specifies the type of `Centimeter`.
     * @private
     */
    Centimeter = 0,
    /**
     * Specifies the type of `Pica`.
     * @private
     */
    Pica = 1,
    /**
     * Specifies the type of `Pixel`.
     * @private
     */
    Pixel = 2,
    /**
     * Specifies the type of `Point`.
     * @private
     */
    Point = 3,
    /**
     * Specifies the type of `Inch`.
     * @private
     */
    Inch = 4,
    /**
     * Specifies the type of `Document`.
     * @private
     */
    Document = 5,
    /**
     * Specifies the type of `Millimeter`.
     * @private
     */
    Millimeter = 6,
}
/**
 * public Enum for `PdfGridImagePosition`.
 * @private
 */
export enum PdfGridImagePosition {
    /**
     * Specifies the type of `Fit`.
     * @private
     */
    Fit,
    /**
     * Specifies the type of `Center`.
     * @private
     */
    Center,
    /**
     * Specifies the type of `Stretch`.
     * @private
     */
    Stretch,
    /**
     * Specifies the type of `Tile`.
     * @private
     */
    Tile,
}
/**
 * public Enum for `the text rendering direction`.
 * @private
 */
export enum PdfTextDirection {
    /**
     * Specifies the type of `None`.
     * @private
     */
    None,
    /**
     * Specifies the type of `LeftToRight`.
     * @private
     */
    LeftToRight,
    /**
     * Specifies the type of `RightToLeft`.
     * @private
     */
    RightToLeft
}