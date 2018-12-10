import { Property, ChildProperty } from '@syncfusion/ej2-base';import { ICustomOptr } from '@syncfusion/ej2-grids';import { FilterHierarchyMode } from '../enum';

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
     * > Check the [`Diacritics`](./filtering.html/#diacritics) filtering.
     * @default false
     */
    ignoreCase?: boolean;

    /**
     * The `operators` is used to override the default operators in filter menu. This should be defined by type wise
     * (string, number, date and boolean). Based on the column type, this customize operator list will render in filter menu.
     *
     * > Check the [`Filter Menu Operator`](./how-to.html#customizing-filter-menu-operators-list) customization.
     * @default null
     */
    operators?: ICustomOptr;

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