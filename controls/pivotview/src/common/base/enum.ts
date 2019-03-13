/**
 * Specifies common enumerations
 */

/** 
 * Defines mode of render. They are
 * * Fixed
 * * Popup
 */
export type Mode =
    /** Shows field list within a popup dialog */
    'Fixed' |
    /** Shows field list in a static position */
    'Popup';

/* Defines modes of editing.
* * Normal
* * Dialog
* * Batch
*/
export declare type EditMode =
    /**  Defines EditMode as Normal */
    'Normal' |
    /**  Defines EditMode as Dialog */
    'Dialog' |
    /**  Defines EditMode as Batch */
    'Batch';

export declare type SelectionMode =
    /**  Defines SelectionMode as Cell */
    'Cell' |
    /**  Defines SelectionMode as Row */
    'Row' |
    /**  Defines SelectionMode as Column */
    'Column' |
    /**  Defines SelectionMode for both Row and Column */
    'Both';

export declare type PdfBorderStyle = 'Solid' | 'Dash' | 'Dot' | 'DashDot' | 'DashDotDot';

export declare type ToolbarItems = 'New' | 'Save' | 'SaveAs' | 'Load' | 'Rename' | 'Remove' | 'Grid' | 'Chart' | 'Export' |
    'SubTotal' | 'GrandTotal' | 'FieldList' | 'ConditionalFormatting';

export declare type View =
    /**  Defines the view port as both chart and table */
    'Both' |
    /**  Defines the view port as chart */
    'Chart' |
    /**  Defines the view port as table */
    'Table';

export declare type Primary =
    /**  Defines the primary view as chart */
    'Chart' |
    /**  Defines the primary view as table */
    'Table';

export declare type ChartSeriesType =
    /**  Define the line series. */
    'Line' |
    /**  Define the Column series. */
    'Column' |
    /**  Define the Area series. */
    'Area' |
    /**  Define the Bar series. */
    'Bar' |
    /**  Define the StackingColumn series. */
    'StackingColumn' |
    /**  Define the StackingArea series. */
    'StackingArea' |
    /**  Define the StackingBar series. */
    'StackingBar' |
    /**  Define the Stepline series. */
    'StepLine' |
    /**  Define the Steparea series. */
    'StepArea' |
    /**  Define the Steparea series. */
    'SplineArea' |
    /**  Define the Scatter series. */
    'Scatter' |
    /**  Define the Spline series. */
    'Spline' |
    /** Define the StackingColumn100 series */
    'StackingColumn100' |
    /** Define the StackingBar100 series */
    'StackingBar100' |
    /** Define the StackingArea100 series */
    'StackingArea100' |
    /** Define the Bubble Series */
    'Bubble' |
    /** Define the Pareto series */
    'Pareto' |
    /** Define the Polar series */
    'Polar' |
    /** Define the Radar series */
    'Radar';

export declare type ChartSelectionMode =
    /** Disable the selection. */
    'None' |
    /** To select a series. */
    'Series' |
    /** To select a point. */
    'Point' |
    /** To select a cluster of point. */
    'Cluster' |
    /** To select points, by dragging with respect to both horizontal and vertical axis. */
    'DragXY' |
    /** To select points, by dragging with respect to vertical axis. */
    'DragY' |
    /** To select points, by dragging with respect to horizontal axis. */
    'DragX';
