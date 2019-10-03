import { ChildProperty, Property, Collection } from '@syncfusion/ej2-base';
import { SortDirection } from '@syncfusion/ej2-grids';
import { SortDescriptorModel } from './sort-settings-model';

/** 
 * Represents the field name and direction of sort column. 
 */
export class SortDescriptor extends ChildProperty<SortDescriptor> {
    /** 
     * Defines the field name of sort column. 

     */
    @Property()
    public field: string;

    /** 
     * Defines the direction of sort column. 





     */
    @Property()
    public direction: SortDirection;

}

/** 
 * Configures the sorting behavior of TreeGrid. 
 */
export class SortSettings extends ChildProperty<SortSettings> {
    /** 
     * Specifies the columns to sort at initial rendering of TreeGrid.
     * Also user can get current sorted columns. 

     */
    @Collection<SortDescriptorModel>([], SortDescriptor)
    public columns: SortDescriptorModel[];

    /**
     * If `allowUnsort` set to false the user can not get the TreeGrid in unsorted state by clicking the sorted column header.

     */
    @Property(true)
    public allowUnsort: boolean;
}