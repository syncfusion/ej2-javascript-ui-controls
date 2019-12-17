import { Property, Complex, Collection, ChildProperty, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';import { IDataSet, IDataOptions, IFieldOptions, IFilter, ISort, ICalculatedFieldSettings } from '../../base/engine';import { IDrillOptions, IValueSortSettings, IFormatSettings, IConditionalFormatSettings, IGroupSettings } from '../../base/engine';import { SummaryTypes, Sorting, FilterType, Operators, Condition, DateGroup, GroupType, ProviderType } from '../../base/types';import { IStyle, ICustomGroups } from '../../base/engine';import { DataManager } from '@syncfusion/ej2-data';

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

    /**
     * It allows to show a field has named set type.
     * Note: This option is applicable only for OLAP data source.
     * @default false
     */
    isNamedSet?: boolean;

    /**
     * It allows to show a field has calculated member type.
     * Note: This option is applicable only for OLAP data source.
     * @default false
     */
    isCalculatedField?: boolean;

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

    /**
     * It allows to set level count of the field to fetch data from the cube.
     * Note: This option is applicable only for user-defined hierarchies.
     * @default 1
     */
    levelCount?: number;

    /**
     * It allows to set level name of a dimension, where the filtering settings to be applied.
     * Note: This option is applicable only for user-defined hierarchies.
     */
    selectedField?: string;

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

    /**
     * It allows to apply conditional formatting to grand total
     */
    applyGrandTotals?: boolean;

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
     * * `None`: It allows to display the field members based on JSON order. 
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
 * Interface for a class GroupSettings
 */
export interface GroupSettingsModel {

    /**
     * It allows to set the field name to apply group settings.
     */
    name?: string;

    /**
     * It allows to set the group interval for group field.
     */
    groupInterval?: DateGroup[];

    /**
     * It allows to set the start time of group field.
     */
    startingAt?: string | Date | number;

    /**
     * It allows to set the end time of group field.
     */
    endingAt?: string | Date | number;

    /**
     * It allows to set the type of field.
     * @default Date
     */
    type?: GroupType;

    /**
     * It allows to set the interval range of group field.
     */
    rangeInterval?: number;

    /**
     * It allows to set the caption to custom field that will be created from group settings.
     */
    caption?: string;

    /**
     * It allows to set the custom group settings of group field.
     * @default []
     */
    customGroups?: ICustomGroups[];

}

/**
 * Interface for a class CustomGroups
 */
export interface CustomGroupsModel {

    /**
     * It allows to set the group name to apply custom group settings.
     */
    groupName?: string;

    /**
     * It allows to set the members to be grouped.
     * @default []
     */
    items?: string[];

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

    /**
     * It allows to set hierarchy unique name, that used to create calculated member.
     * Note: This option is applicable only for OLAP data source.
     */
    hierarchyUniqueName?: string;

    /**
     * It allows to set format string that used to create calculated member.
     * Note: This option is applicable only for OLAP data source.
     */
    formatString?: string;

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

    /**
     * It allows to set the delimiter.
     */
    delimiter?: string;

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

    /**
     * It allows to set the measure name to achieve value sorting based on this.
     */
    measure?: string;

}

/**
 * Interface for a class DataSourceSettings
 */
export interface DataSourceSettingsModel {

    /**
     * It allows to set the cube catalog name.
     */
    catalog?: string;

    /**
     * It allows to set the cube name.
     */
    cube?: string;

    /**
     * It allows to set the provider type.
     * @default Relational
     */
    providerType?: ProviderType;

    /**
     * It allows to set the url string.
     */
    url?: string;

    /**
     * It allows to set the locale code.
     * @default 1033
     */
    localeIdentifier?: number;

    /**
     * It allows to set the data source.
     * @isGenericType true
     */
    dataSource?: IDataSet[] | DataManager;

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
     * It allows to hide fields from fieldlist.
     * @default []
     */
    excludeFields?: string[];

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
     * It allows member filtering operation through UI and code-behind.
     * @default true
     */
    allowMemberFilter?: boolean;

    /**
     * It allows excel-like label filtering operation through UI and code-behind.
     * @default false
     */
    allowLabelFilter?: boolean;

    /**
     * It allows excel-like value filtering operation through UI and code-behind.
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
     * It allows enable/disable single measure headers in pivot table.
     * @default false
     */
    alwaysShowValueHeader?: boolean;

    /**
     * If `showHeaderWhenEmpty` is set to false, then it will hide blank headers in pivot table.
     * @default true
     */
    showHeaderWhenEmpty?: boolean;

    /**
     * It allows enable/disable show aggregation on PivotButton.
     * @default true
     */
    showAggregationOnValueField?: boolean;

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

    /**
     * It allows to set the custom values to empty value cells .
     */
    emptyCellsTextContent?: string;

    /**
     * It allows to set the settings for grouping the field.
     * @default []
     */
    groupSettings?: GroupSettingsModel[];

}