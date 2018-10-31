/**
 * Sparkline Enum
 */

 /**
  * Specifies the sparkline types.
  * `Line`, `Column`, `WinLoss`, `Pie` and `Area`.
  */
 export type SparklineType =
 /** Define the Sparkline Line type series. */
 'Line' |
 /** Define the Sparkline Column type series. */
 'Column' |
 /** Define the Sparkline WinLoss type series. */
 'WinLoss' |
 /** Define the Sparkline Pie type series. */
 'Pie' |
 /** Define the Sparkline Area type series. */
 'Area';

/**
 * Specifies the sparkline data value types.
 * `Numeric`, `Category` and `DateTime`.
 */
 export type SparklineValueType =
 /** Define the Sparkline Numeric value type series. */
 'Numeric' |
 /** Define the Sparkline Category value type series. */
 'Category' |
 /** Define the Sparkline DateTime value type series. */
 'DateTime';

 /**
  * Specifies the sparkline marker | datalabel visible types.
  * `All`,  `High`,  `Low`,  `Start`,  `End`,  `Negative` and `None`.
  */
 export type VisibleType =
 /** Define the Sparkline marker | datalabel  Visbile All type */
 'All' |
 /** Define the Sparkline marker | datalabel Visbile High type */
 'High' |
 /** Define the Sparkline marker | datalabel Visbile Low type */
 'Low' |
 /** Define the Sparkline marker | datalabel Visbile Start type */
 'Start' |
 /** Define the Sparkline marker | datalabel Visbile End type */
 'End' |
 /** Define the Sparkline marker | datalabel Visbile Negative type */
 'Negative';
/** 
 * Defines Theme of the sparkline. They are
 * * Material - Render a sparkline with Material theme.
 * * Fabric - Render a sparkline with Fabric theme
 * * Bootstrap - Render a sparkline with Bootstrap theme
 * * HighContrast - Render a sparkline with HighContrast theme
 */
export type SparklineTheme =
    /**  Render a sparkline with Material theme. */
    'Material' |
    /**  Render a sparkline with Fabric theme. */
    'Fabric' |
    /**  Render a sparkline with Bootstrap theme. */
    'Bootstrap' |
    /**  Render a sparkline with HighContrast theme. */
    'Highcontrast';

/**
 * Defines edge data label placement for datalabel, if exceeds the sparkline area horizontally.
 * * None - Edge data label shown as clipped text.
 * * Shift - Edge data label moved inside the sparkline area.
 * * Hide - Edge data label will hide, if exceeds the sparkline area.
 */
export type EdgeLabelMode =
/** Edge data label shown as clipped text */
'None' |
/** Edge data label moved inside the sparkline area */
'Shift' |
/** Edge data label will hide, if exceeds the sparkline area */
'Hide';