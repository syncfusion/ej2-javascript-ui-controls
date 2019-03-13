import { Property, ChildProperty } from '@syncfusion/ej2-base';import { SearchHierarchyMode } from '../base/enum';

/**
 * Interface for a class SearchSettings
 */
export interface SearchSettingsModel {

    /**
     * Specifies the columns to be searched at initial rendering of the Gantt.
     * You can also get the columns that were currently filtered.
     * @default []
     */
    fields?: string[];

    /**
     * If ignoreCase set to true, then search ignores the diacritic characters or accents while filtering.
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
     */
    operator?: string;

    /**
     * A key word for searching the Gantt content.
     */
    key?: string;

    /**
     * Defines the search types. The available options are,
     * `Parent`: Shows the searched record with parent record.
     * `Child`: Shows the searched record with child record. 
     * `Both` : shows the searched record with both parent and child record.
     * `None` : Shows only searched record.
     * @default Parent
     * @isEnumeration true
     */
    hierarchyMode?: SearchHierarchyMode;

}