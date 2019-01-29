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
