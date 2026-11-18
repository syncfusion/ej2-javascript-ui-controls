import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { SortComparerFunction } from '../base/interface';
import { SortDirection } from '../base/type';

/**
 * Holds the configuration of swimlane settings in kanban board.
 */
export class SwimlaneSettings extends ChildProperty<SwimlaneSettings> {

    /**
     * Defines the swimlane key field
     *
     * @default null
     */
    @Property()
    public keyField: string;

    /**
     * Defines the swimlane header text field
     *
     * @default null
     */
    @Property()
    public textField: string;

    /**
     * Enable or disable empty swimlane
     *
     * @default false
     */
    @Property(false)
    public showEmptyRow: boolean;

    /**
     * Enable or disable items count
     *
     * @default true
     */
    @Property(true)
    public showItemCount: boolean;

    /**
     * Enable or disable the card drag and drop actions
     *
     * @default false
     */
    @Property(false)
    public allowDragAndDrop: boolean;

    /**
     * Defines the swimlane row template
     *
     * @default null
     * @aspType string
     */
    @Property()
    public template: string | Function;

    /**
     * Sort the swimlane resources. The possible values are:
     * * Ascending
     * * Descending
     *
     * @default 'Ascending'
     */
    @Property('Ascending')
    public sortDirection: SortDirection;

    /**
     * Defines the custom sort comparer function.
     * The sort comparer function has the same functionality like
     * [`Array.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) sort comparer.
     *
     * @default null
     */
    @Property()
    public sortComparer: SortComparerFunction;

    /**
     * Enable or disable unassigned swimlane group
     *
     * @default true
     */
    @Property(true)
    public showUnassignedRow: boolean;

    /**
     * Enables or disables the freeze the swimlane rows
     *
     * @default false
     */
    @Property(false)
    public enableFrozenRows: boolean;
}
