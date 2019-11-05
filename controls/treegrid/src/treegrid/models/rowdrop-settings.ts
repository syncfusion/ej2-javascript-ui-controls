import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Configures the row drop settings of the TreeGrid.
 */
export class RowDropSettings extends ChildProperty<RowDropSettings> {
    /**   
     * Defines the ID of droppable component on which row drop should occur.
     * @default null
     */
    @Property()
    public targetID: string;
}
