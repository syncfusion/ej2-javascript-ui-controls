import { ChildProperty, Property, Collection } from '@syncfusion/ej2-base';
import { SortDescriptorModel } from './sort-settings-model';
import { SortDirection } from '../base/enum';

/**
 * Represents the field name and direction of sort column. 
 */
export class SortDescriptor extends ChildProperty<SortDescriptor> {
    /** 
     * Defines the field name of sort column. 
     * @default ''
     */
    @Property()
    public field: string;

    /** 
     * Defines the direction of sort column. 
     * @default ''
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @isEnumeration true
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
     * Specifies the columns to sort at initial rendering of Gantt.
     * Also user can get current sorted columns.
     * @default []
     */
    @Collection<SortDescriptorModel>([], SortDescriptor)
    public columns: SortDescriptorModel[];

    /**
     * If `allowUnsort` set to false the user can not get the Tree grid in unsorted state by clicking the sorted column header.
     * @default true
     */
    @Property(true)
    public allowUnsort: boolean;
}