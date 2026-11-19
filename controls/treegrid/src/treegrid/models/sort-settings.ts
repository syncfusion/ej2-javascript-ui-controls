import { ChildProperty, Property, Collection } from '@syncfusion/ej2-base';
import { SortDirection } from '@syncfusion/ej2-grids';
import { SortDescriptorModel } from './sort-settings-model';

/**
 * Represents the field name and direction of a sort column in the TreeGrid.
 */
export class SortDescriptor extends ChildProperty<SortDescriptor> {
    /**
     * Specifies the field name of the column to be sorted.
     *
     * @default ''
     */
    @Property()
    public field: string;

    /**
     * Specifies the direction of sorting for the column. The available options are:
     * * `Ascending`: Sorts the column in ascending order.
     * * `Descending`: Sorts the column in descending order.
     *
     * @default ''
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.SortDirection
     */
    @Property()
    public direction: SortDirection;
}

/**
 * Configures the sorting behavior of the TreeGrid.
 */
export class SortSettings extends ChildProperty<SortSettings> {
    /**
     * Specifies the columns to be sorted at initial rendering of the TreeGrid.
     * This property can also be used to get or modify the currently sorted columns at runtime.
     *
     * @default []
     */
    @Collection<SortDescriptorModel>([], SortDescriptor)
    public columns: SortDescriptorModel[];

    /**
     * If set to false, the user cannot reset the TreeGrid to an unsorted state by clicking on the sorted column header.
     * When true, clicking an already sorted column header will toggle the sort direction or remove sorting.
     *
     * @default true
     */
    @Property(true)
    public allowUnsort: boolean;
}
