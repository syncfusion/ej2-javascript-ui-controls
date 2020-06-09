import { compile } from '@syncfusion/ej2-base';import { getEnumValue } from '@syncfusion/ej2-base';import { CustomSummaryType } from '../base/type';import { AggregateType, CellType } from '../base/enum';import { Property, Collection, ChildProperty, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';

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
     * * truecount
     * * falsecount
     * * custom
     * > Specify the `type` value as `custom` to use custom aggregation.
     * @aspType string
     * @default null
     */
    type?: AggregateType | AggregateType[] | string;

    /**
     * Defines the column name to perform aggregation.
     * @default null
     */
    field?: string;

    /**
     * Defines the column name to display the aggregate value. If `columnName` is not defined,
     * then `field` name value will be assigned to the `columnName` property.
     * @default null
     */
    columnName?: string;

    /**
     * Format is applied to a calculated value before it is displayed.
     * Gets the format from the user, which can be standard or custom
     * [`number`](../../common/internationalization/#number-formatting/)
     * and [`date`](../../common/internationalization/#number-formatting/) formats.
     * @aspType string
     * @blazorType string
     * @default null    
     */
    format?: string | NumberFormatOptions | DateFormatOptions;

    /**
     * Defines the footer cell template as a string for the aggregate column.
     * The `type` name should be used to access aggregate values inside the template.
     * 
     * {% codeBlock src="grid/footer-template-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    footerTemplate?: string;

    /**
     * Defines the group footer cell template as a string for the aggregate column. 
     * The `type` name should be used to access aggregate values inside the template.
     * Additionally, the following fields can be accessed in the template.
     * * **field**: The current grouped field.
     * * **key**: The current grouped value.
     * 
     * {% codeBlock src="grid/group-footer-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    groupFooterTemplate?: string;

    /**
     * Defines the group caption cell template as a string for the aggregate column.
     * The `type` name should be used to access aggregate values inside the template.
     * Additionally, the following fields can be accessed in the template.
     * * **field**: The current grouped field name.
     * * **key**: The current grouped field value.
     * 
     * {% codeBlock src="grid/group-caption-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    groupCaptionTemplate?: string;

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
     * @default []
     */
    columns?: AggregateColumnModel[];

}