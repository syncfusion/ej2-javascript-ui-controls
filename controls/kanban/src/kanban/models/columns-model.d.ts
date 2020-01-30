import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class Columns
 */
export interface ColumnsModel {

    /**
     * Defines the column keyField
     * @default null
     */
    keyField?: string;

    /**
     * Defines the column header title
     * @default null
     */
    headerText?: string;

    /**
     * Defines the column template
     * @default null
     */
    template?: string;

    /**
     * Enable or disable toggle column
     * @default false
     */
    allowToggle?: boolean;

    /**
     * Defines the collapsed or expandable state
     * @default true
     */
    isExpanded?: boolean;

    /**
     * Defines the minimum card count in column
     * @default null
     */
    minCount?: number;

    /**
     * Defines the maximum card count in column
     * @default null
     */
    maxCount?: number;

    /**
     * Enable or disable card count in column
     * @default false
     */
    showItemCount?: boolean;

}