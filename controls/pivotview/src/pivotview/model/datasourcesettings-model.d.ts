import { Property, Complex, Collection, ChildProperty, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';import { IDataSet, IDataOptions, IFieldOptions, IFilter, ISort, ICalculatedFieldSettings } from '../../base/engine';import { IDrillOptions, IValueSortSettings, IFormatSettings, IConditionalFormatSettings, IGroupSettings } from '../../base/engine';import { SummaryTypes, Sorting, FilterType, Operators, Condition, DateGroup, GroupType, ProviderType, RenderMode } from '../../base/types';import { DataSourceType } from '../../base/types';import { IStyle, ICustomGroups, IAuthenticationInfo } from '../../base/engine';import { DataManager } from '@syncfusion/ej2-data';

/**
 * Interface for a class FieldOptions
 */
export interface FieldOptionsModel {

    /**
     * Allows you to set the field name that needs to be displayed in row/column/value/filter axis of pivot table.
     */
    name?: string;

    /**
     * Allows you to set caption to the specific field. It will be used to display instead of its name in pivot table component's UI.
     */
    caption?: string;

    /**
     * Allows to display the values in the pivot table with appropriate aggregations such as sum, product, count, average, etc… The available types are,
     * * `Sum`: Allows to display the pivot table values with sum.
     * * `Product`: Allows to display the pivot table values with product.
     * * `Count`: Allows to display the pivot table values with count.
     * * `DistinctCount`: Allows to display the pivot table values with distinct count.
     * * `Min`: Allows to display the pivot table with minimum value.
     * * `Max`: Allows to display the pivot table with maximum value.
     * * `Avg`: Allows to display the pivot table values with average.
     * * `Median`: Allows to display the pivot table values with median.
     * * `Index`: Allows to display the pivot table values with index.
     * * `PopulationStDev`: Allows to display the pivot table values with population standard deviation.
     * * `SampleStDev`: Allows to display the pivot table values with sample standard deviation.
     * * `PopulationVar`: Allows to display the pivot table values with population variance.
     * * `SampleVar`: Allows to display the pivot table values with sample variance.
     * * `RunningTotals`: Allows to display the pivot table values with running totals.
     * * `DifferenceFrom`: Allows to display the pivot table values with difference from the value of the base item in the base field.
     * * `PercentageOfDifferenceFrom`: Allows to display the pivot table values with percentage difference from the value of the base item in the base field.
     * * `PercentageOfGrandTotal`: Allows to display the pivot table values with percentage of grand total of all values.
     * * `PercentageOfColumnTotal`: Allows to display the pivot table values in each column with percentage of total values for the column.
     * * `PercentageOfRowTotal`: Allows to display the pivot table values in each row with percentage of total values for the row.
     * * `PercentageOfParentTotal`: Allows to display the pivot table values with percentage of total of all values based on selected field.
     * * `PercentageOfParentColumnTotal`: Allows to display the pivot table values with percentage of its parent total in each column.
     * * `PercentageOfParentRowTotal`: Allows to display the pivot table values with percentage of its parent total in each row.
     * * `CalculatedField`: Allows to display the pivot table with calculated field values. It allows user to create a new calculated field alone.
     *
     * > It is applicable only for relational data source.
     * @default Sum
     */
    type?: SummaryTypes;

    /**
     * Allows you to set the axis name to the specific field. This will help to display the field in specified axis such as row/column/value/filter axis of pivot table.
     */
    axis?: string;

    /**
     * Allows you to display all members items of a specific field to the pivot table, even doesn't have any data in its row/column intersection in data source.
     * > It is applicable only for relational data source.
     * @default false
     */
    showNoDataItems?: boolean;

    /**
     * Allows you to set the selective field, which used to display the values with either DifferenceFrom or PercentageOfDifferenceFrom or PercentageOfParentTotal aggregate types.
     * > It is applicable only for relational data source.
     */
    baseField?: string;

    /**
     * Allows you to set the selective item of a specific field, which used to display the values with either DifferenceFrom or PercentageOfDifferenceFrom aggregate types.
     * The selective item should be set the from field specified in the baseField property.
     * > It is applicable only for relational data source.
     */
    baseItem?: string;

    /**
     * Allows to show or hide sub-totals to a specific field in row/column axis of the pivot table.
     * @default true
     */
    showSubTotals?: boolean;

    /**
     * Allows you to set whether the specified field is a named set or not.
     * In general, the named set is a set of dimension members or a set expression (MDX query) to be created as a dimension in the SSAS OLAP cube itself.
     * > It is applicable only for OLAP data source.
     * @default false
     */
    isNamedSet?: boolean;

    /**
     * Allows to set whether the specified field is a calculated field or not. In general, a calculated field is created from the bound data source or using simple formula with basic arithmetic operators in the pivot table.
     * > This option is applicable only for OLAP data source.
     * @default false
     */
    isCalculatedField?: boolean;

    /**
     * Allows you to show or hide the filter icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This filter icon is used to filter the members of a specified field at runtime in the pivot table.
     * @default true
     */
    showFilterIcon?: boolean;

    /**
     * Allows you to show or hide the sort icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This sort icon is used to order members of a specified field either in ascending or descending at runtime.
     * @default true
     */
    showSortIcon?: boolean;

    /**
     * Allows you to show or hide the remove icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This remove icon is used to remove the specified field during runtime.
     * @default true
     */
    showRemoveIcon?: boolean;

    /**
     * Allows you to show or hide the value type icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This value type icon helps to select the appropriate aggregation type to specified value field at runtime.
     * @default true
     */
    showValueTypeIcon?: boolean;

    /**
     * Allows you to show or hide the edit icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This edit icon is used to modify caption, formula, and format of a specified calculated field at runtime that to be displayed in the pivot table.
     * @default true
     */
    showEditIcon?: boolean;

    /**
     * Allows you to restrict the specific field's pivot button that is used to drag on runtime in the grouping bar and field list UI.
     * This will prevent you from modifying the current report.
     * @default true
     */
    allowDragAndDrop?: boolean;

    /**
     * Allows to specify the data type of specific field.
     */
    dataType?: string;

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
     * It allows to set the background color to the value cell in the pivot table.
     */
    backgroundColor?: string;

    /**
     * It allows to set the font color to the value cell in the pivot table.
     */
    color?: string;

    /**
     * It allows to set the font family to the value cell in the pivot table.
     */
    fontFamily?: string;

    /**
     * It allows to set the font size to the value cell in the pivot table.
     */
    fontSize?: string;

}

/**
 * Interface for a class Filter
 */
export interface FilterModel {

    /**
     * Allows you to set the field name that used to display the selective or conditional-based filter members that used to be displayed in the pivot table.
     */
    name?: string;

    /**
     * Allows you to set the specific filter type to display the filter members in the pivot table. They are:
     * * Include - Specifies the filter type as include for member filter.
     * * Exclude - Specifies the filter type as exclude for member filter.
     * * Label - Specifies the filter type as label for header filter.
     * * Date - Specifies the filter type as date for date based filter.
     * * Number - Specifies the filter type as number for number based filter.
     * * Value - Specifies the filter type as value for value based filter.
     * @default Include
     */
    type?: FilterType;

    /**
     * Allows yoy to specify the field members that used to be displayed based on the filter type provided in the pivot table.
     */
    items?: string[];

    /**
     * Allows you to choose the operator type such as equals, greater than, less than, etc. for conditional-based filtering.
     * > It is applicable only for label and value filtering.
     * @default DoesNotEquals
     */
    condition?: Operators;

    /**
     * Allows you to set the start value to display the filter items in the pivot table based on the condition applied.
     * > It is applicable only for label and value filtering.
     */
    value1?: string | Date;

    /**
     * Allows you to set the end value to display the filter items in the pivot table based on the condition applied.
     * > This option will be used by default when the operator **Between** and **NotBetween** is chosen to apply. Also, it is applicable only for label and value filtering.
     */
    value2?: string | Date;

    /**
     * Allows to set value field for evaluation using conditions and operands for filtering.
     * > It is applicable only for label and value filtering.
     */
    measure?: string;

    /**
     * Allows to set level of the field to fetch data from the cube for filtering.
     * > This option is applicable only for user-defined hierarchies in OLAP data source.
     * @default 1
     */
    levelCount?: number;

    /**
     * Allows to set level name of a specified field, where the filtering settings to be applied.
     * > This option is applicable only for user-defined hierarchies in OLAP data source.
     */
    selectedField?: string;

}

/**
 * Interface for a class ConditionalFormatSettings
 */
export interface ConditionalFormatSettingsModel {

    /**
     * Allows to set the value field name to apply conditional formatting.
     */
    measure?: string;

    /**
     * Allows to set the header text of a specific row/column field to apply conditional formatting.
     */
    label?: string;

    /**
     * Allows you to choose the operator type such as equals, greater than, less than, etc. for conditional formatting.
     */
    conditions?: Condition;

    /**
     * Allows you to set the start value for applying conditional formatting.
     */
    value1?: number;

    /**
     * Allows you to set the end value for applying conditional formatting.
     * > This option will be used by default when the operator **Between** and **NotBetween** is chosen to apply.
     */
    value2?: number;

    /**
     * Allows to set the custom styles for the formatting applied values in the pivot table.
     */
    style?: IStyle;

    /**
     * Allows to apply conditional formatting to the grand totals of row and column axis in the pivot table.
     */
    applyGrandTotals?: boolean;

}

/**
 * Interface for a class Sort
 */
export interface SortModel {

    /**
     * Allows to set the field name to order their members either in ascending or descending in the pivot table.
     */
    name?: string;

    /**
     * Allows to apply sorting to the specified field either by ascending or descending or JSON order. The types are,
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
     * It allows to specify minimum fraction digits to the formatted value.
     */
    minimumFractionDigits?: number;

    /**
     * It allows to specify maximum fraction digits to the  formatted value.
     */
    maximumFractionDigits?: number;

    /**
     * It allows to specify minimum significant digits to the formatted value.
     */
    minimumSignificantDigits?: number;

    /**
     * It allows to specify maximum significant digits to the formatted value.
     */
    maximumSignificantDigits?: number;

    /**
     * It allows to use grouping to the formatted value,
     * @default true
     */
    useGrouping?: boolean;

    /**
     * It allows to specify the skeleton such as full, medium, long, short, etc. to perform date formatting.
     * > It is applicable only fot date type formatting.
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
     * It allows to specify minimum integer digits to the formatted value.
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
     * It allows to set the specific field name to apply group settings.
     */
    name?: string;

    /**
     * It allows to specify the date group intervals such as years or quarter or months or days or hours or minutes or seconds to group fields based on that in the pivot table. They options are:
     * * Years - Defines group field as 'Years' for date type field.
     * * Quarters - Defines group field as 'Quarters' for date type field.
     * * QuarterYear - Defines group field as 'Quarter Year' for date type field.
     * * Months - Defines group field as 'Months' for date type field.
     * * Days - Defines group field as 'Days' for date type field.
     * * Hours - Defines group field as 'Hours' for date type field.
     * * Minutes - Defines group field as 'Minutes' for date type field.
     * * Seconds - Defines group field as 'Seconds' for date type field.
     *
     * > It is applicable only for date type grouping.
     */
    groupInterval?: DateGroup[];

    /**
     * It allows to set the start value/date to group fields from the specified range that to be displayed in the pivot table.
     */
    startingAt?: string | Date | number;

    /**
     * It allows to set the start value/date to group fields to the specified range that to be displayed in the pivot table.
     */
    endingAt?: string | Date | number;

    /**
     * It allows to set the type as date or number or custom to the specified field for apply grouping. The types are:
     * * Date - Defines group type as 'Date' for date type field
     * * Number - Defines group type as 'Number' for numeric type field.
     * * Custom - Defines group type as 'Custom' for custom group field.
     * @default Date
     */
    type?: GroupType;

    /**
     * It allows to set the interval range to group field based on the specified range.
     * > It is applicable only of number type grouping.
     */
    rangeInterval?: number;

    /**
     * It allows to set the caption to custom field that will be used to created from custom group fields in the pivot table.
     * > It is applicable only for custom grouping.
     */
    caption?: string;

    /**
     * It allows to set the custom group information to create custom group fields.
     * > It is applicable only for custom grouping.
     * @default []
     */
    customGroups?: ICustomGroups[];

}

/**
 * Interface for a class CustomGroups
 */
export interface CustomGroupsModel {

    /**
     * Allows user to set the group name (or title) for selected headers for custom grouping.
     */
    groupName?: string;

    /**
     * It allows to set the headers which needs to be grouped from display.
     * @default []
     */
    items?: string[];

}

/**
 * Interface for a class CalculatedFieldSettings
 */
export interface CalculatedFieldSettingsModel {

    /**
     * It allows to set the field name that used to create as a calculated field.
     */
    name?: string;

    /**
     * It allows to set the formula/expression to the specified calculated field.
     */
    formula?: string;

    /**
     * It allows to set hierarchy unique name, that used to create calculated member.
     * > It is applicable only for OLAP data source.
     */
    hierarchyUniqueName?: string;

    /**
     * It allows to set format string that used to create calculated member with specified formatted values that to be displayed in the pivot table.
     * > It is applicable only for OLAP data source.
     */
    formatString?: string;

}

/**
 * Interface for a class DrillOptions
 */
export interface DrillOptionsModel {

    /**
     * It allows to set the field name whose members to be either expanded or collapsed in the pivot table.
     */
    name?: string;

    /**
     * It allows to set the members to be either expanded or collapsed in the pivot table.
     */
    items?: string[];

    /**
     * It allows to set the delimiter, which is used a separator to split the given members.
     */
    delimiter?: string;

}

/**
 * Interface for a class ValueSortSettings
 */
export interface ValueSortSettingsModel {

    /**
     * It allows to set the member name of a specific field for value sorting.
     */
    headerText?: string;

    /**
     * It allows to set the delimiter, which is used a separator to split the given header text.
     * @default '.'
     */
    headerDelimiter?: string;

    /**
     * Allows to apply sorting to the specified field either by ascending or descending. The types are,
     * * `Ascending`: It allows to display the field members in ascending order.
     * * `Descending`: It allows to display the field members in descending order.
     * @default None
     */
    sortOrder?: Sorting;

    /**
     * It allows to set the measure name to achieve value sorting based on this.
     * > It is applicable only for OLAP data source.
     */
    measure?: string;

}

/**
 * Interface for a class Authentication
 */
export interface AuthenticationModel {

    /**
     * It allows to set the user name to access the specified SSAS cube.
     */
    userName?: string;

    /**
     * It allows to set the password to access the specified SSAS cube.
     */
    password?: string;

}

/**
 * Interface for a class DataSourceSettings
 */
export interface DataSourceSettingsModel {

    /**
     * Allows to set the mode of rendering the pivot table.
     * @default Local
     */
    mode?: RenderMode;

    /**
     * Allows to set the database name of SSAS cube as string type that used to retrieve the data from the specified connection string.
     * > It is applicable only for OLAP data source.
     */
    catalog?: string;

    /**
     * Allows you to set the SSAS cube name as string type that used to retrieve data for pivot table rendering.
     * > It is applicable only for OLAP data source.
     */
    cube?: string;

    /**
     * Allows to set the provider type to identify the given connection is either **Relational** or **SSAS** to render the pivot table and field list. The following options are:
     * * `Relational`: Allows to render the pivot table with JSON data collection either fetch at local or remote server.
     * * `SSAS`: Allows to render the pivot table with OLAP data fetch from OLAP cube.
     * @default Relational
     */
    providerType?: ProviderType;

    /**
     * Allows to set the URL as string type, which helps to identify the service endpoint where the data are processed and retrieved to render the pivot table and field list.
     * > It is applicable only for OLAP data source.
     */
    url?: string;

    /**
     * Allows you to set the specific culture code as number type to render pivot table with desired localization.
     * By default, the pivot table displays with culture code **1033**, which indicates "en-US" locale.
     * > It is applicale only for OLAP data source.
     * @default 1033
     */
    localeIdentifier?: number;

    /**
     * Allows you to set the data source as JSON collection to the pivot report either from local or from remote server to the render the pivot that and field list.
     * You can fetch JSON data from remote server by using DataManager.
     * > It is applicable only for relational data source.
     * @isGenericType true
     */
    dataSource?: IDataSet[] | DataManager | string[][];

    /**
     * Allows specific fields associated with field information that needs to be displayed in row axis of pivot table. The following configurations which are applicable are as follows:
     * * `name`: Allows you to set the field name that needs to be displayed in row axis of pivot table.
     * * `caption`: Allows you to set caption to the specific field. It will be used to display instead of its name in pivot table component's UI.
     * * `showNoDataItems`: Allows you to display all members items of a specific field to the pivot table,
     * even doesn't have any data in its row/column intersection in data source. **Note: It is applicable only for relational data source.**
     * * `showSubTotals`: Allows to show or hide sub-totals to a specific field in row axis of the pivot table.
     * * `isNamedSet`: Allows you to set whether the specified field is a named set or not. In general,
     * the named set is a set of dimension members or a set expression (MDX query) to be created as a dimension in the SSAS OLAP cube itself. **Note: It is applicable only for OLAP data source.**
     * * `isCalculatedField`: Allows to set whether the specified field is a calculated field or not.
     * In general, the calculated field is created from the bound data source or using simple formula with basic arithmetic operators in the pivot table. **Note: It is applicable only for OLAP data source.**
     * * `showFilterIcon`: Allows you to show or hide the filter icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This filter icon is used to filter the members of a specified field at runtime in the pivot table.
     * * `showSortIcon`: Allows you to show or hide the sort icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This sort icon is used to order members of a specified field either in ascending or descending at runtime.
     * * `showRemoveIcon`: Allows you to show or hide the remove icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This remove icon is used to remove the specified field during runtime.
     * * `showEditIcon`: Allows you to show or hide the edit icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This edit icon is used to modify caption, formula, and format of a specified calculated field at runtime that to be displayed in the pivot table.
     * * `allowDragAndDrop`: Allows you to restrict the specific field's pivot button that is used to drag on runtime in the grouping bar and field list UI.
     * This will prevent you from modifying the current report.
     * @default []
     */
    rows?: FieldOptionsModel[];

    /**
     * Allows specific fields associated with field information that needs to be displayed in column axis of pivot table. The following configurations which are applicable are as follows:
     * * `name`: Allows you to set the field name that needs to be displayed in column axis of pivot table.
     * * `caption`: Allows you to set caption to the specific field. It will be used to display instead of its name in pivot table component's UI.
     * * `showNoDataItems`: Allows you to display all members items of a specific field to the pivot table,
     * even doesn't have any data in its row/column intersection in data source. **Note: It is applicable only for relational data source.**
     * * `showSubTotals`: Allows to show or hide sub-totals to a specific field in column axis of the pivot table.
     * * `isNamedSet`: Allows you to set whether the specified field is a named set or not. In general,
     * the named set is a set of dimension members or a set expression (MDX query) to be created as a dimension in the SSAS OLAP cube itself. **Note: It is applicable only for OLAP data source.**
     * * `isCalculatedField`: Allows to set whether the specified field is a calculated field or not.
     * In general, the calculated field is created from the bound data source or using simple formula with basic arithmetic operators in the pivot table. **Note: It is applicable only for OLAP data source.**
     * * `showFilterIcon`: Allows you to show or hide the filter icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This filter icon is used to filter the members of a specified field at runtime in the pivot table.
     * * `showSortIcon`: Allows you to show or hide the sort icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This sort icon is used to order members of a specified field either in ascending or descending at runtime.
     * * `showRemoveIcon`: Allows you to show or hide the remove icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This remove icon is used to remove the specified field during runtime.
     * * `showEditIcon`: Allows you to show or hide the edit icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This edit icon is used to modify caption, formula, and format of a specified calculated field at runtime that to be displayed in the pivot table.
     * * `allowDragAndDrop`: Allows you to restrict the specific field's pivot button that is used to drag on runtime in the grouping bar and field list UI.
     * This will prevent you from modifying the current report.
     * @default []
     */
    columns?: FieldOptionsModel[];

    /**
     * Allows specific fields associated with field information that needs to be displayed as aggregated numeric values in pivot table. The following configurations which are applicable are as follows:
     * * `name`: Allows you to set the field name that needs to be displayed in row/column/value/filter axis of pivot table.
     * * `caption`: Allows you to set caption to the specific field. It will be used to display instead of its name in pivot table component's UI.
     * * `type`: Allows to display the values in the pivot table with appropriate aggregations such as sum, product, count, average, etc… **Note: It is applicable only for relational data source.**
     * * `baseField`: Allows you to set the selective field, which used to display the values with either
     *  DifferenceFrom or PercentageOfDifferenceFrom or PercentageOfParentTotal aggregate types. **Note: It is applicable only for relational data source.**
     * * `baseItem`: Allows you to set the selective item of a specific field, which used to display the values with either DifferenceFrom or PercentageOfDifferenceFrom aggregate types.
     * The selective item should be set the from field specified in the baseField property. **Note: It is applicable only for relational data source.**
     * * `isCalculatedField`: Allows to set whether the specified field is a calculated field or not.
     * In general, the calculated field is created from the bound data source or using simple formula with basic arithmetic operators in the pivot table. **Note: It is applicable only for OLAP data source.**
     * * `showRemoveIcon`: Allows you to show or hide the remove icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This remove icon is used to remove the specified field during runtime.
     * * `showValueTypeIcon`: Allows you to show or hide the value type icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This value type icon helps to select the appropriate aggregation type to specified value field at runtime.
     * * `showEditIcon`: Allows you to show or hide the edit icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This edit icon is used to modify caption, formula, and format of a specified calculated field at runtime that to be displayed in the pivot table.
     * * `allowDragAndDrop`: Allows you to restrict the specific field's pivot button that is used to drag on runtime in the grouping bar and field list UI.
     * This will prevent you from modifying the current report.
     * @default []
     */
    values?: FieldOptionsModel[];

    /**
     * Allows to filter the values in other axis based on the collection of filter fields in pivot table. The following configurations which are applicable are as follows:
     * * `name`: Allows you to set the field name that needs to be displayed in row/column/value/filter axis of pivot table.
     * * `caption`: Allows you to set caption to the specific field. It will be used to display instead of its name in pivot table component's UI.
     * * `isNamedSet`: Allows you to set whether the specified field is a named set or not. In general,
     * the named set is a set of dimension members or a set expression (MDX query) to be created as a dimension in the SSAS OLAP cube itself. **Note: It is applicable only for OLAP data source.**
     * * `isCalculatedField`: Allows to set whether the specified field is a calculated field or not.
     * In general, the calculated field is created from the bound data source or using simple formula with basic arithmetic operators in the pivot table. **Note: It is applicable only for OLAP data source.**
     * * `showFilterIcon`: Allows you to show or hide the filter icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This filter icon is used to filter the members of a specified field at runtime in the pivot table.
     * * `showRemoveIcon`: Allows you to show or hide the remove icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This remove icon is used to remove the specified field during runtime.
     * * `showEditIcon`: Allows you to show or hide the edit icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This edit icon is used to modify caption, formula, and format of a specified calculated field at runtime that to be displayed in the pivot table.
     * * `allowDragAndDrop`: Allows you to restrict the specific field's pivot button that is used to drag on runtime in the grouping bar and field list UI.
     * This will prevent you from modifying the current report.
     * @default []
     */
    filters?: FieldOptionsModel[];

    /**
     * Allows specific fields associated with field information that can be used while creating fieldlist. The following configurations which are applicable are as follows:
     * * `name`: Allows you to set the field name which is going to configure while creating the fieldlist.
     * * `caption`: Allows you to set caption to the specific field. It will be used to display instead of its name in pivot table component's UI.
     * * `showNoDataItems`: Allows you to display all members items of a specific field to the pivot table,
     * even doesn't have any data in its row/column intersection in data source. **Note: It is applicable only for relational data source.**
     * * `showSubTotals`: Allows to show or hide sub-totals to a specific field in row axis of the pivot table.
     * * `isNamedSet`: Allows you to set whether the specified field is a named set or not. In general,
     * the named set is a set of dimension members or a set expression (MDX query) to be created as a dimension in the SSAS OLAP cube itself. **Note: It is applicable only for OLAP data source.**
     * * `isCalculatedField`: Allows to set whether the specified field is a calculated field or not.
     * In general, the calculated field is created from the bound data source or using simple formula with basic arithmetic operators in the pivot table. **Note: It is applicable only for OLAP data source.**
     * * `showFilterIcon`: Allows you to show or hide the filter icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This filter icon is used to filter the members of a specified field at runtime in the pivot table.
     * * `showSortIcon`: Allows you to show or hide the sort icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This sort icon is used to order members of a specified field either in ascending or descending at runtime.
     * * `showRemoveIcon`: Allows you to show or hide the remove icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This remove icon is used to remove the specified field during runtime.
     * * `showEditIcon`: Allows you to show or hide the edit icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This edit icon is used to modify caption, formula, and format of a specified calculated field at runtime that to be displayed in the pivot table.
     * * `allowDragAndDrop`: Allows you to restrict the specific field's pivot button that is used to drag on runtime in the grouping bar and field list UI.
     * This will prevent you from modifying the current report.
     * @default []
     */
    fieldMapping?: FieldOptionsModel[];

    /**
     * Allows you to restrict the specific field(s) from displaying it in the field list UI.
     * You may also be unable to render the pivot table with this field(s) by doing so.
     * > It is applicable only for relational data source.
     * @default []
     */
    excludeFields?: string[];

    /**
     * Allows you to either expand or collapse all the headers that are displayed in the pivot table.
     * By default, all the headers are collapsed in the pivot table.
     * > It is applicable only for Relational data.
     * @default false
     */
    expandAll?: boolean;

    /**
     * Allows you to set the value fields that to be plotted either in row or column axis in the pivot table.
     * @default 'column'
     */
    valueAxis?: string;

    /**
     * Allows you to display the value headers based on the index position in row or column axis in the pivot table.
     * By default, the value headers are displayed at last index position based on the `valueAxis` property.
     * > It is applicale only for relational data source.
     * @default '-1'
     */
    valueIndex?: number;

    /**
     * Allows specific fields associated with either selective or conditional-based filter members that used to be displayed in the pivot table.
     * @default []
     */
    filterSettings?: FilterModel[];

    /**
     * Allows specific fields associated with sort settings to order their members either in ascending or descending that used to be displayed in the pivot table.
     * By default, the data source containing fields are display with Ascending order alone. To use this option, it requires the `enableSorting` property to be **true**.
     * @default []
     */
    sortSettings?: SortModel[];

    /**
     * Allows to perform sort operation to order members of a specific fields either in ascending or descending that used to be displayed in the pivot table.
     * @default true
     */
    enableSorting?: boolean;

    /**
     * Allows to define the data source type.
     * @default JSON
     */
    type?: DataSourceType;

    /**
     * Allows to perform filter operation based on the selective filter members of the specific fields used to be displayed in the pivot table.
     * @default true
     */
    allowMemberFilter?: boolean;

    /**
     * Allows to perform filter operation based on the selective headers used to be displayed in the pivot table.
     * @default false
     */
    allowLabelFilter?: boolean;

    /**
     * Allows to perform filter operation based only on value fields and its resultant aggregated values over other fields defined in row and column axes that used to be displayed in the pivot table.
     * @default false
     */
    allowValueFilter?: boolean;

    /**
     * Allows to show or hide sub-totals in both rows and columns axis of the pivot table.
     * @default true
     */
    showSubTotals?: boolean;

    /**
     * Allows to show or hide sub-totals in row axis of the pivot table.
     * @default true
     */
    showRowSubTotals?: boolean;

    /**
     * Allows to show or hide sub-totals in column axis of the pivot table.
     * @default true
     */
    showColumnSubTotals?: boolean;

    /**
     * Allows to show or hide grand totals in both rows and columns axis of the pivot table.
     * @default true
     */
    showGrandTotals?: boolean;

    /**
     * Allows to show or hide grand totals in row axis of the pivot table.
     * @default true
     */
    showRowGrandTotals?: boolean;

    /**
     * Allows to show or hide grand totals in column axis of the pivot table.
     * @default true
     */
    showColumnGrandTotals?: boolean;

    /**
     * Allows to show the value field header always in pivot table, even if it holds a single field in the value field axis.
     * @default false
     */
    alwaysShowValueHeader?: boolean;

    /**
     * Allows the undefined headers to be displayed in the pivot table, when the specific field(s) are not defined in the raw data.
     * For example, if the raw data for the field ‘Country’ is defined as “United Kingdom” and “State” is not defined means, it will be shown as “United Kingdom >> Undefined” in the header section.
     * @default true
     */
    showHeaderWhenEmpty?: boolean;

    /**
     * Allows the pivot button with specific value field caption along with the aggregation type, to be displayed in the grouping bar and field list UI.
     * For example, if the value field "Sold Amount" is aggregated with Sum, it will be displayed with caption "Sum of Sold Amount" in its pivot button.
     * @default true
     */
    showAggregationOnValueField?: boolean;

    /**
     * Allows specific fields used to display the values with specific format that used to be displayed in the pivot table.
     * For example, to display a specific field with currency formatted values in the pivot table, the set the `format` property to be **C**.
     * @default []
     */
    formatSettings?: FormatSettingsModel[];

    /**
     * Allows specific fields used to display their the headers to be either expanded or collapsed in the pivot table.
     * @default []
     */
    drilledMembers?: DrillOptionsModel[];

    /**
     * Allows to sort individual value field and its aggregated values either in row or column axis to ascending or descending order.
     */
    valueSortSettings?: ValueSortSettingsModel;

    /**
     * Allows to create new calculated fields from the bound data source or using simple formula with basic arithmetic operators in the pivot table.
     * @default []
     */
    calculatedFieldSettings?: CalculatedFieldSettingsModel[];

    /**
     * Allows a collection of values fields to change the appearance of the pivot table value cells with different style properties such as background color, font color, font family, and font size based on specific conditions.
     * @default []
     */
    conditionalFormatSettings?: ConditionalFormatSettingsModel[];

    /**
     * Allows to show custom string to the empty value cells that used to display in the pivot table. You can fill empty value cells with any value like “0”, ”-”, ”*”, “(blank)”, etc.
     */
    emptyCellsTextContent?: string;

    /**
     * Allows specific fields to group their data on the basis of their type.
     * For example, the date type fields can be formatted and displayed based on year, quarter, month, and more. Likewise, the number type fields can be grouped range-wise, such as 1-5, 6-10, etc.
     * You can perform custom group to the string type fields that used to displayed in the pivot table.
     * @default []
     */
    groupSettings?: GroupSettingsModel[];

    /**
     * Allows you to set the credential information to access the specified SSAS cube.
     * > It is applicable only for OLAP data source.
     */
    authentication?: AuthenticationModel;

}