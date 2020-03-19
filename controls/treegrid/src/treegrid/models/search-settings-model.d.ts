import { Property, ChildProperty } from '@syncfusion/ej2-base';import { FilterHierarchyMode } from '../enum';

/**
 * Interface for a class SearchSettings
 */
export interface SearchSettingsModel {

    /**
     * Specifies the columns to be searched at initial rendering of the TreeGrid. You can also get the columns that were currently filtered.
     * @default []
     */
    fields?: string[];

    /**
     * If ignoreCase set to true, then search ignores the diacritic characters or accents while filtering.
     *
     * > Check the [`Diacritics`](../../treegrid/filtering/#diacritics/) filtering.
     * @default false
     */
    ignoreCase?: boolean;

    /**
     * Defines the operator to search records. The available operators are:
     * <table> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * Operator<br/></td><td colspan=1 rowspan=1> 
     * Description<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * startswith<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the string begins with the specified string.<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * endswith<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the string ends with the specified string.<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * contains<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the string contains the specified string. <br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * equal<br/></td><td colspan=1 rowspan=1> 
     * Checks whether the string is equal to the specified string.<br/></td></tr> 
     * <tr> 
     * <td colspan=1 rowspan=1> 
     * notequal<br/></td><td colspan=1 rowspan=1> 
     * Checks for strings not equal to the specified string. <br/></td></tr> 
     * </table> 
     * @default 'contains'
     * @blazorType Syncfusion.Blazor.Operator
     * @blazorDefaultValue Syncfusion.Blazor.Operator.Contains
     */
    operator?: string;

    /**
     * A key word for searching the TreeGrid content.
     */
    key?: string;

    /**
     * Defines the filter types. The available options are,
     * * `Parent`: Initiates filter operation after Enter key is pressed.
     * * `Child`: Initiates filter operation after a certain time interval. By default, time interval is 1500 ms.
     * @default Parent
     */
    hierarchyMode?: FilterHierarchyMode;

}