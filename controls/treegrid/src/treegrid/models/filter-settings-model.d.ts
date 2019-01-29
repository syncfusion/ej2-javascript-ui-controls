import { Collection, Property, ChildProperty } from '@syncfusion/ej2-base';import { ICustomOptr, FilterBarMode, FilterType, PredicateModel, Predicate } from '@syncfusion/ej2-grids';import { FilterHierarchyMode } from '../enum';

/**
 * Interface for a class FilterSettings
 */
export interface FilterSettingsModel {

    /**
     * Specifies the columns to be filtered at initial rendering of the TreeGrid. You can also get the columns that were currently filtered.
     * @default []
     */
    columns?: PredicateModel[];

    /**
     * Defines options for filtering type. The available options are
     * * `Menu` - Specifies the filter type as menu.
     * * `FilterBar` - Specifies the filter type as filterbar.
     * @default FilterBar
     */
    type?: FilterType;

    /**
     * Defines the filter bar modes. The available options are,
     * * `OnEnter`: Initiates filter operation after Enter key is pressed.
     * * `Immediate`: Initiates filter operation after a certain time interval. By default, time interval is 1500 ms.
     * @default OnEnter
     * @aspDefaultValueIgnore
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.FilterBarMode
     */
    mode?: FilterBarMode;

    /**
     * Shows or hides the filtered status message on the pager.
     * @default true
     */
    showFilterBarStatus?: boolean;

    /**
     * Defines the time delay (in milliseconds) in filtering records when the `Immediate` mode of filter bar is set.
     * @default 1500
     */
    immediateModeDelay?: number;

    /**
     * The `operators` is used to override the default operators in filter menu. This should be defined by type wise
     * (string, number, date and boolean). Based on the column type, this customize operator list will render in filter menu.
     *
     * > Check the [`Filter Menu Operator`](./how-to.html#customizing-filter-menu-operators-list) customization.
     * @default null
     */
    operators?: ICustomOptr;

    /**
     * If ignoreAccent set to true, then filter ignores the diacritic characters or accents while filtering.
     *
     * > Check the [`Diacritics`](./filtering.html/#diacritics) filtering.
     * @default false
     */
    ignoreAccent?: boolean;

    /**
     * Defines the filter types. The available options are,
     * `Parent`: Shows the filtered record with parent record.
     * `Child`: Shows the filtered record with child record. 
     * `Both` : shows the filtered record with both parent and child record.
     * `None` : Shows only filtered record.
     * @default Parent
     */
    hierarchyMode?: FilterHierarchyMode;

}