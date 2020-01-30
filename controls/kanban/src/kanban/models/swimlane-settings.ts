import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { SortType } from '../base/type';

/**  
 * Holds the configuration of swimlane settings in kanban board.
 */
export class SwimlaneSettings extends ChildProperty<SwimlaneSettings> {

    /**
     * Defines the swimlane key field
     * @default null
     */
    @Property()
    public keyField: string;

    /**
     * Defines the swimlane header text field
     * @default null
     */
    @Property()
    public textField: string;

    /**
     * Enable or disable empty swimlane
     * @default false
     */
    @Property(false)
    public showEmptyRow: boolean;

    /**
     * Enable or disable items count
     * @default true
     */
    @Property(true)
    public showItemCount: boolean;

    /**
     * Enable or disable the card drag and drop actions
     * @default false
     */
    @Property(false)
    public allowDragAndDrop: boolean;

    /**
     * Defines the swimlane row template
     * @default null
     */
    @Property()
    public template: string;

    /**
     * Sort the swimlane resources in ascending or descending order.
     * @default 'Ascending'
     */
    @Property('Ascending')
    public sortBy: SortType;

}
