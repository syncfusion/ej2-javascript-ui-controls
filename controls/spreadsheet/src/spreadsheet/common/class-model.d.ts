import { Property, ChildProperty } from '@syncfusion/ej2-base';import { SelectionMode } from '../common/index';

/**
 * Interface for a class ScrollSettings
 */
export interface ScrollSettingsModel {

    /**
     * By default, the scroll mode is infinite. Set it to `true` to make it as finite.
     * @default false
     */
    isFinite?: boolean;

    /**
     * If `enableVirtualization` is set to true, then the spreadsheet will render only the rows and columns visible within the view-port
     * and load subsequent rows and columns based on scrolling.
     * @default true
     */
    enableVirtualization?: boolean;

}

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * Specifies the selection mode. The possible values are,
     * * `None`: It disables UI selection.
     * * `Single`: It allows single selection of cell / row / column and disables multiple selection.
     * * `Multiple`: It allows single / multiple selection of cell / row / column.
     * @default 'Multiple'
     */
    mode?: SelectionMode;

}