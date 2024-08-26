/**
 * public Enum for `PdfLayoutType`.
 * @private
 */
export enum PdfLayoutType {
    /**
     * Specifies the type of `Paginate`.
     * @private
     */
    Paginate,
    /**
     * Specifies the type of `OnePage`.
     * @private
     */
    OnePage
}
/**
 * public Enum for `PdfLayoutBreakType`.
 * @private
 */
export enum PdfLayoutBreakType {
    /**
     * Specifies the type of `FitPage`.
     * @private
     */
    FitPage,
    /**
     * Specifies the type of `FitElement`.
     * @private
     */
    FitElement,
    /**
     * Specifies the type of `FitColumnsToPage`.
     * @private
     */
    FitColumnsToPage
}

export enum PathPointType {
    /**
     * Specifies the path point type of `Start`.
     * @private
     */
    Start = 0,
    /**
     * Specifies the path point type of `Line`.
     * @private
     */
    Line = 1,
    /**
     * Specifies the path point type of `Bezier3`.
     * @private
     */
    Bezier3 = 3,
    /**
     * Specifies the path point type of `Bezier`.
     * @private
     */
    Bezier = 3,
    /**
     * Specifies the path point type of `PathTypeMask`.
     * @private
     */
    PathTypeMask = 7,
    /**
     * Specifies the path point type of `DashMode`.
     * @private
     */
    DashMode = 16,
    /**
     * Specifies the path point type of `PathMarker`.
     * @private
     */
    PathMarker = 32,
    /**
     * Specifies the path point type of `CloseSubpath`.
     * @private
     */
    CloseSubpath = 128,
}