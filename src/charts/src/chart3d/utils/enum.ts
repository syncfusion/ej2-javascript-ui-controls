/**
 * Defines the type series in 3D chart. They are
 * * column - Renders the column series.
 * * bar - Renders the stacking column series
 * * stackingColumn - Renders the stacking column series.
 * * stackingBar - Renders the stacking bar series.
 * * StackingColumn100 - Renders the stacking column series.
 * * StackingBar100 - Renders the stacking bar 100 percent series.
 */
export type Chart3DSeriesType =
    /**  Define the Column series. */
    'Column' |
    /**  Define the Bar series. */
    'Bar' |
    /**  Define the StackingColumn series. */
    'StackingColumn' |
    /**  Define the StackingBar series. */
    'StackingBar' |
    /** Define the StackingColumn100 series */
    'StackingColumn100' |
    /** Define the StackingBar100 series */
    'StackingBar100'

/**
 * Defines the LabelPosition, They are.
 * * top - Position the label on top of the point.
 * * bottom - Position the label on bottom of the point.
 * * middle - Position the label to middle of the point.
 */
export type Chart3DDataLabelPosition =
    /** Position the label on top of the point. */
    'Top' |
    /** Position the label on bottom of the point. */
    'Bottom' |
    /** Position the label to middle of the point. */
    'Middle'

/**
 * Defines the 3D chart SelectionMode, They are.
 * * none - Disable the selection.
 * * series - To select a series.
 * * point - To select a point.
 * * cluster - To select a cluster of point.
 */
export type Chart3DSelectionMode =
    /** Disable the selection. */
    'None' |
    /** To select a series. */
    'Series' |
    /** To select a point. */
    'Point' |
    /** To select a cluster of point. */
    'Cluster'

/**
 * Defines the mode for rendering legend items.
 * * Series - Render legend items based on visible series.
 * * Point - Render legend items based on points.
 */
export type Chart3DLegendMode =
    /** Render legend items based on visible series */
    'Series' |
    /** Render legend items based on points  */
    'Point'
