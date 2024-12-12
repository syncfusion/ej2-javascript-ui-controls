import { ChildProperty, Property, Collection } from '@syncfusion/ej2-base';
import { SortDescriptorModel } from './sort-settings-model';
import { SortDirection } from '../base/enum';

/**
 * Represents the field name and direction of sort column.
 */
export class SortDescriptor extends ChildProperty<SortDescriptor> {
    /**
     * Defines the field (column) name to sort by.
     *
     * @default ''
     */
    @Property()
    public field: string;

    /**
     * Defines the direction of the sort operation.
     * * `Ascending`: Sorts the column in ascending order.
     * * `Descending`: Sorts the column in descending order.
     *
     * @default null
     * @isEnumeration true
     * @asptype SortDirection
     *
     */
    @Property()
    public direction: SortDirection;

}

/**
 * Configures the sorting behavior of Gantt.
 */
export class SortSettings extends ChildProperty<SortSettings> {
    /**
     * Specifies the columns to sort by when the Gantt chart is initially rendered.
     * It also allows access to the currently sorted columns.
     *
     * @default []
     */
    @Collection<SortDescriptorModel>([], SortDescriptor)
    public columns: SortDescriptorModel[];

    /**
     * If `allowUnsort` set to false, the user can not get the Tree grid in unsorted state by clicking the sorted column header.
     *
     * @default true
     */
    @Property(true)
    public allowUnsort: boolean;
}

