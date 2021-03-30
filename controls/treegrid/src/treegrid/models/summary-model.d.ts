import { Property, ChildProperty, Collection, getEnumValue, compile, DateFormatOptions, NumberFormatOptions } from '@syncfusion/ej2-base';import { Internationalization } from '@syncfusion/ej2-base';import { CustomSummaryType, AggregateType, CellType } from '@syncfusion/ej2-grids';

/**
 * Interface for a class AggregateColumn
 */
export interface AggregateColumnModel {

    /**
     * Defines the aggregate type of a particular column.
     * To use multiple aggregates for single column, specify the `type` as array.
     * Types of aggregate are,
     * * sum
     * * average
     * * max
     * * min
     * * count
     * * falsecount
     * * truecount
     * * custom
     * > Specify the `type` value as `custom` to use custom aggregation.
     *
     * @aspType string
     * @default null
     */
    type?: AggregateType | AggregateType[] | string;

    /**
     * Defines the footer cell template as a string for the aggregate column.
     * The `type` name should be used to access aggregate values inside the template.
     *
     * {% codeBlock src="grid/footer-template-api/index.ts" %}{% endcodeBlock %}
     *
     * @default null
     */
    footerTemplate?: string;

    /**
     * Defines the column name to perform aggregation.
     *
     * @default null
     */
    field?: string;

    /**
     * Format is applied to a calculated value before it is displayed.
     * Gets the format from the user, which can be standard or custom
     * [`number`](../../../common/internationalization/#supported-format-string)
     * and [`date`](../../../common/internationalization/#supported-format-string-1) formats.
     *
     * @aspType string
     * @blazorType string
     * @default null
     */
    format?: string | NumberFormatOptions | DateFormatOptions;

    /**
     * Defines the column name to display the aggregate value. If `columnName` is not defined,
     * then `field` name value will be assigned to the `columnName` property.
     *
     * @default null
     */
    columnName?: string;

    /**
     * Defines a function to calculate custom aggregate value. The `type` value should be set to `custom`.
     * To use custom aggregate value in the template, use the key as `${custom}`.
     * **Total aggregation**: The custom function will be called with the whole data and the current `AggregateColumn` object.
     * **Group aggregation**: This will be called with the current group details and the `AggregateColumn` object.
     *
     * @default null
     */
    customAggregate?: CustomSummaryType | string;

}

/**
 * Interface for a class AggregateRow
 */
export interface AggregateRowModel {

    /**
     * Configures the aggregate columns.
     *
     * @default []
     */
    columns?: AggregateColumnModel[];

    /**
     * Display the childSummary for each parent.
     */
    showChildSummary?: boolean;

}