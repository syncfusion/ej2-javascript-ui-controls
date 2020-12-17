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
     * @aspType int
     */
    minCount?: number;

    /**
     * Defines the maximum card count in column
     * @default null
     * @aspType int
     */
    maxCount?: number;

    /**
     * Enable or disable card count in column
     * @default true
     */
    showItemCount?: boolean;

    /**
     * Enable or disable cell add button
     * @default false
     */
    showAddButton?: boolean;

    /**
     * Enable or disable column drag
     * @default true
     */
    allowDrag?: boolean;

    /**
     * Enable or disable column drop
     * @default true
     */
    allowDrop?: boolean;

    /**
     * Defines the column transition
     * @default []
     */
    transitionColumns?: string[];

}