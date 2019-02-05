import { Property, Complex, Collection, ChildProperty, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';import { IDataSet, IDataOptions, IFieldOptions, IFilter, ISort, ICalculatedFieldSettings } from '../../base/engine';import { IDrillOptions, IValueSortSettings, IFormatSettings, IConditionalFormatSettings } from '../../base/engine';import { SummaryTypes, Sorting, FilterType, Operators, Condition } from '../../base/types';import { IStyle } from '../../base/engine';import { DataManager } from '@syncfusion/ej2-data';

/**
 * Interface for a class FieldOptions
 */
export interface FieldOptionsModel {

    /**
     * It allows to set field name.
     */
    name?: string;

    /**
     * It allows to set field caption.
     */
    caption?: string;

    /**
     * It allows to set the summary type of the field. The available types are,
     * * `Sum`: The summary cells calculated by the sum of its cells. 
     * * `Count`: The summary cells calculated by the count of its cells.
     * * `Min`: The summary cells shows the value which is the minimum value of its cells. 
     * * `Max`: The summary cells shows the value which is the maximum value of its cells.
     * * `Percentage`: The summary cells displays in percentage format.
     * * `Avg`: The summary cells calculated by the average of its cells.
     * * `CalculatedField`: It should set to include calculated fields.
     * @default Sum
     */
    type?: SummaryTypes;

    /**
     * It allows to set the axis to render the field in it.
     */
    axis?: string;

    /**
     * It allows to display all the items of its field even any items haven't data in its row/column intersection in data source.
     * @default false
     */
    showNoDataItems?: boolean;

    /**
     * It allows to set the base field to aggregate the values.
     */
    baseField?: string;

    /**
     * It allows to set the base item to aggregate the values.
     */
    baseItem?: string;

    /**
     * It allows to disable or enable sub totals in row/column axis.
     * @default true
     */
    showSubTotals?: boolean;

}

/**
 * Interface for a class FieldListFieldOptions
 */
export interface FieldListFieldOptionsModel extends FieldOptionsModel{

}

/**
 * Interface for a class Style
 */
export interface StyleModel {

    /**
     * It allows to set the background color.
     */
    backgroundColor?: string;

    /**
     * It allows to set the color.
     */
    color?: string;

    /**
     * It allows to set the font family.
     */
    fontFamily?: string;

    /**
     * It allows to set the font size.
     */
    fontSize?: string;

}

/**
 * Interface for a class Filter
 */
export interface FilterModel {

    /**
     * It allows to set the field name.
     */
    name?: string;

    /**
     * It allows to set the filter type.
     * @default Include
     */
    type?: FilterType;

    /**
     * It allows to set the filter items.
     */
    items?: string[];

    /**
     * It allows to set the filter conditions to the field.
     * @default DoesNotEquals
     */
    condition?: Operators;

    /**
     * It allows to set filter operand value for condition evaluation with single label.
     */
    value1?: string | Date;

    /**
     * It allows to set filter operand value for between condition evaluation.
     */
    value2?: string | Date;

    /**
     * It allows to set value field for evaluation using conditions and operands.
     */
    measure?: string;

}

/**
 * Interface for a class ConditionalFormatSettings
 */
export interface ConditionalFormatSettingsModel {

    /**
     * It allows to set the field name to apply conditional format.
     */
    measure?: string;

    /**
     * It allows to set the label name to apply conditional format.
     */
    label?: string;

    /**
     * It allows to set the conditions to apply format.
     */
    conditions?: Condition;

    /**
     * It allows to set the value1 to apply format.
     */
    value1?: number;

    /**
     * It allows to set the value2 to apply format.
     */
    value2?: number;

    /**
     * It allows to set the style to apply.
     */
    style?: IStyle;

}

/**
 * Interface for a class Sort
 */
export interface SortModel {

    /**
     * It allows to set the field name to sort.
     */
    name?: string;

    /**
     * It allows to set the sort order. The types are,
     * * `Ascending`: It allows to display the field members in ascending order. 
     * * `Descending`: It allows to display the field members in descending order.
     * @default Ascending
     */
    order?: Sorting;

}

/**
 * Interface for a class FormatSettings
 */
export interface FormatSettingsModel {

    /**
     * It allows to set the field name to apply format settings.
     */
    name?: string;

    /**
     * It allows to specify minimum fraction digits in formatted value.
     */
    minimumFractionDigits?: number;

    /**
     * It allows to specify maximum fraction digits in formatted value.
     */
    maximumFractionDigits?: number;

    /**
     * It allows to specify minimum significant digits in formatted value.
     */
    minimumSignificantDigits?: number;

    /**
     * It allows to specify maximum significant digits in formatted value.
     */
    maximumSignificantDigits?: number;

    /**
     * It allows to specify whether to use grouping or not in formatted value,
     * @default true
     */
    useGrouping?: boolean;

    /**
     * It allows to specify the skeleton for perform formatting.
     */
    skeleton?: string;

    /**
     * It allows to specify the type of date formatting either date, dateTime or time.
     */
    type?: string;

    /**
     * It allows to specify the currency code to be used for formatting.
     */
    currency?: string;

    /**
     * It allows to specify minimum integer digits in formatted value.
     */
    minimumIntegerDigits?: number;

    /**
     * It allows to specify custom number format for formatting.
     */
    format?: string;

}

/**
 * Interface for a class CalculatedFieldSettings
 */
export interface CalculatedFieldSettingsModel {

    /**
     * It allows to set the field name to sort.
     */
    name?: string;

    /**
     * It allows to set the formula for calculated fields. 
     */
    formula?: string;

}

/**
 * Interface for a class DrillOptions
 */
export interface DrillOptionsModel {

    /**
     * It allows to set the field name whose members to be drilled.
     */
    name?: string;

    /**
     * It allows to set the members to be drilled.
     */
    items?: string[];

}

/**
 * Interface for a class ValueSortSettings
 */
export interface ValueSortSettingsModel {

    /**
     * It allows to set the members name to achieve value sorting based on this.
     */
    headerText?: string;

    /**
     * It allows to set the delimiters to separate the members.
     * @default '.'
     */
    headerDelimiter?: string;

    /**
     * It allows to set the sort order. The types are,
     * * `Ascending`: It allows to display the field members in ascending order. 
     * * `Descending`: It allows to display the field members in descending order.
     * @default None
     */
    sortOrder?: Sorting;

}

/**
 * Interface for a class DataSource
 */
export interface DataSourceModel {

    /**
     * It allows to set the data source.
     */
    data?: IDataSet[] | DataManager;

    /**
     * It allows to set the row fields.
     * @default []
     */
    rows?: FieldOptionsModel[];

    /**
     * It allows to set the column fields.
     * @default []
     */
    columns?: FieldOptionsModel[];

    /**
     * It allows to set the value fields.
     * @default []
     */
    values?: FieldOptionsModel[];

    /**
     * It allows to set the filter fields.
     * @default []
     */
    filters?: FieldOptionsModel[];

    /**
     * It allows to set the expanded state of headers.
     * @default false
     */
    expandAll?: boolean;

    /**
     * It allows to set the value fields in both column and row axis.
     * @default 'column'
     */
    valueAxis?: string;

    /**
     * It allows to set the settings of filtering operation.
     * @default []
     */
    filterSettings?: FilterModel[];

    /**
     * It allows to set the settings of sorting operation.
     * @default []
     */
    sortSettings?: SortModel[];

    /**
     * It allows sorting operation UI.
     * @default true
     */
    enableSorting?: boolean;

    /**
     * It allows excel-like label filtering operation.
     * @default false
     */
    allowLabelFilter?: boolean;

    /**
     * It allows excel-like value filtering operation.
     * @default false
     */
    allowValueFilter?: boolean;

    /**
     * It allows enable/disable sub total in pivot table.
     * @default true
     */
    showSubTotals?: boolean;

    /**
     * It allows enable/disable row sub total in pivot table.
     * @default true
     */
    showRowSubTotals?: boolean;

    /**
     * It allows enable/disable column sub total in pivot table.
     * @default true
     */
    showColumnSubTotals?: boolean;

    /**
     * It allows enable/disable grand total in pivot table.
     * @default true
     */
    showGrandTotals?: boolean;

    /**
     * It allows enable/disable row grand total in pivot table.
     * @default true
     */
    showRowGrandTotals?: boolean;

    /**
     * It allows enable/disable column grand total in pivot table.
     * @default true
     */
    showColumnGrandTotals?: boolean;

    /**
     * It allows to set the settings of number formatting.
     * @default []
     */
    formatSettings?: FormatSettingsModel[];

    /**
     * It allows to set the drilled state for desired field members.
     * @default []
     */
    drilledMembers?: DrillOptionsModel[];

    /**
     * It allows to set the settings of value sorting operation.
     */
    valueSortSettings?: ValueSortSettingsModel;

    /**
     * It allows to set the settings of calculated field operation.
     * @default []
     */
    calculatedFieldSettings?: CalculatedFieldSettingsModel[];

    /**
     * It allows to set the settings of Conditional Format operation.
     * @default []
     */
    conditionalFormatSettings?: ConditionalFormatSettingsModel[];

}