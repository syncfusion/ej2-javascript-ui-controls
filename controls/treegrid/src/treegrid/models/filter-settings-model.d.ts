import { Collection, Property, ChildProperty } from '@syncfusion/ej2-base';import { ICustomOptr, FilterBarMode, FilterType } from '@syncfusion/ej2-grids';import { FilterHierarchyMode } from '../enum';

/**
 * Interface for a class Predicate
 */
export interface PredicateModel {

    /**
     * Specifies the field name of the column to apply the filter on.
     *
     * @default ''
     */
    field?: string;

    /**
     * Specifies the operator used for filtering TreeGrid records. The available operators support a variety of data types
     * and offer different filtering mechanisms. Details for each operator are provided below:
     * <table>
     * <tr>
     * <td colspan=1 rowspan=1>
     * Operator<br/></td><td colspan=1 rowspan=1>
     * Description<br/></td><td colspan=1 rowspan=1>
     * Supported Data Types<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * startswith<br/></td><td colspan=1 rowspan=1>
     * Checks if the value starts with the specified input.<br/></td><td colspan=1 rowspan=1>
     * String<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * endswith<br/></td><td colspan=1 rowspan=1>
     * Checks if the value ends with the specified input.<br/><br/></td><td colspan=1 rowspan=1>
     * <br/>String<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * contains<br/></td><td colspan=1 rowspan=1>
     * Checks if the value contains the specified input anywhere within it.<br/><br/></td><td colspan=1 rowspan=1>
     * <br/>String<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * equal<br/></td><td colspan=1 rowspan=1>
     * Checks if the value is exactly equal to the specified input.<br/><br/></td><td colspan=1 rowspan=1>
     * <br/>String | Number | Boolean | Date<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * notequal<br/></td><td colspan=1 rowspan=1>
     * Identifies values that are not equal to the specified input.<br/><br/></td><td colspan=1 rowspan=1>
     * <br/>String | Number | Boolean | Date<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * greaterthan<br/></td><td colspan=1 rowspan=1>
     * Verifies if the value is greater than the specified input.<br/><br/></td><td colspan=1 rowspan=1>
     * Number | Date<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * greaterthanorequal<br/></td><td colspan=1 rowspan=1>
     * Verifies if the value is greater than or equal to the specified input.<br/><br/></td><td colspan=1 rowspan=1>
     * <br/>Number | Date<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * lessthan<br/></td><td colspan=1 rowspan=1>
     * Checks if the value is less than the specified input.<br/><br/></td><td colspan=1 rowspan=1>
     * <br/>Number | Date<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * lessthanorequal<br/></td><td colspan=1 rowspan=1>
     * Checks if the value is less than or equal to the specified input.<br/><br/></td><td colspan=1 rowspan=1>
     * <br/>Number | Date<br/></td></tr>
     * </table>
     *
     * @default null
     */
    operator?: string;

    /**
     * Specifies the value to filter the column's data by.
     *
     * @default ''
     */
    value?: string | number | Date | boolean;

    /**
     * Applies case-sensitive filtering if set to `true`. When false, filtering is case-insensitive.
     *
     * @default null
     */
    matchCase?: boolean;

    /**
     * Ignores diacritic characters during filtering if set to `true`.
     *
     * @default false
     */
    ignoreAccent?: boolean;

    /**
     * Defines the logical relationship between multiple filter conditions ('AND' / 'OR').
     *
     * @default null
     */
    predicate?: string;

    /**
     * @hidden
     * Holds the actual value used for filtering the column.
     */
    actualFilterValue?: Object;

    /**
     * @hidden
     * Represents the actual filter operator applied to the column.
     */
    actualOperator?: Object;

    /**
     * @hidden
     * Defines the data type of the filter column.
     */
    type?: string;

    /**
     * @hidden
     * Represents the internal predicate condition for the filter column.
     */
    ejpredicate?: Object;

    /**
     * @hidden
     * Unique identifier for the filter column.
     */
    uid?: string;

    /**
     * @hidden
     * Indicates whether the column is a foreign key in the filter set.
     */
    isForeignKey?: boolean;

}

/**
 * Interface for a class FilterSettings
 */
export interface FilterSettingsModel {

    /**
     * Specifies the initial filter configuration for TreeGrid columns or retrieves the current filter state.
     *
     * @default []
     */
    columns?: PredicateModel[];

    /**
     * Sets the filtering interface type. Options include:
     * * `Menu`: Provides a menu for filtering options.
     * * `FilterBar`: Allows direct input filtering in a bar at the top of each column.
     * * `Excel` : Specifies the filter type as excel.
     * * `CheckBox` : Specifies the filter type as check box.
     *
     * @default FilterBar
     */
    type?: FilterType;

    /**
     * Determines the mode of the filter bar operation. Options include:
     * * `OnEnter`: Filtering is triggered upon pressing the Enter key.
     * * `Immediate`: Filtering occurs after a short delay automatically.
     *
     * @default Syncfusion.EJ2.Grids.FilterBarMode.OnEnter
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.FilterBarMode
     */
    mode?: FilterBarMode;

    /**
     * Shows or hides the status message related to filtering actions on the pager.
     *
     * @default true
     */
    showFilterBarStatus?: boolean;

    /**
     * Determines the delay in milliseconds before filtering is triggered in `Immediate` mode.
     *
     * @default 1500
     */
    immediateModeDelay?: number;

    /**
     * Allows customization of the default operators offered in the filter menu by defining custom operators for string, number, date, and boolean types.
     *
     * @default null
     */
    operators?: ICustomOptr;

    /**
     * If set to `true`, filtering ignores accent characters, making diacritic characters identical to their unaccented versions.
     *
     * @default false
     */
    ignoreAccent?: boolean;

    /**
     * Specifies how the hierarchy should be maintained during filtering:
     * * `Parent`: Displays the filtered records along with their parent records.
     * * `Child`: Displays the filtered records along with their child records.
     * * `Both`: Displays the filtered records with both parent and child records.
     * * `None`: Only displays the filtered records.
     *
     * @default Parent
     * @isEnumeration true
     * @aspType FilterHierarchyMode
     */
    hierarchyMode?: FilterHierarchyMode;

}