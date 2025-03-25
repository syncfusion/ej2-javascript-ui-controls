import { Property, ChildProperty } from '@syncfusion/ej2-base';import { FilterHierarchyMode } from '../enum';

/**
 * Interface for a class SearchSettings
 */
export interface SearchSettingsModel {

    /**
     * Specifies the columns to be searched upon the initial rendering of the TreeGrid.
     * You can also retrieve the list of columns that are currently searched.
     *
     * @default []
     */
    fields?: string[];

    /**
     * When set to true, the search operation ignores case sensitivity,
     * including diacritic characters or accents while filtering.
     *
     * > Check the [`Diacritics`](../../treegrid/filtering/filtering#diacritics) filtering.
     *
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
     *
     * @default 'contains'
     */
    operator?: string;

    /**
     * A keyword used for searching within the TreeGrid content.
     *
     */
    key?: string;

    /**
     * Defines the search hierarchy modes dictating which parts of the tree should be included in search results.
     * The available options are:
     * * `Parent`: Shows the searched record along with its parent record.
     * * `Child`: Shows the searched record along with its child record.
     * * `Both`: Shows the searched record with both its parent and child records.
     * * `None`: Shows only the searched record.
     *
     * @default Parent
     * @isEnumeration true
     * @aspType FilterHierarchyMode
     */
    hierarchyMode?: FilterHierarchyMode;

}