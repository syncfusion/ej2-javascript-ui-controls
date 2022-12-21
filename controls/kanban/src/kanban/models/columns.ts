import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Holds the configuration of columns in kanban board.
 */
export class Columns extends ChildProperty<Columns> {

    /**
     * Defines the column keyField. It supports both number and string type.
     * String type supports the multiple column keys and number type does not support the multiple column keys.
     *
     * @default null
     */

    @Property()
    public keyField: string | number;

    /**
     * Defines the column header title
     *
     * @default null
     */
    @Property()
    public headerText: string;

    /**
     * Defines the column template
     *
     * @default null
     */
    @Property()
    public template: string;

    /**
     * Enable or disable toggle column
     *
     * @default false
     */
    @Property(false)
    public allowToggle: boolean;

    /**
     * Defines the collapsed or expandable state
     *
     * @default true
     */
    @Property(true)
    public isExpanded: boolean;

    /**
     * Defines the minimum card count in column
     *
     * @default null
     * @aspType int
     */
    @Property()
    public minCount: number;

    /**
     * Defines the maximum card count in column
     *
     * @default null
     * @aspType int
     */
    @Property()
    public maxCount: number;

    /**
     * Enable or disable card count in column
     *
     * @default true
     */
    @Property(true)
    public showItemCount: boolean;

    /**
     * Enable or disable cell add button
     *
     * @default false
     */
    @Property(false)
    public showAddButton: boolean;

    /**
     * Enable or disable column drag
     *
     * @default true
     */
    @Property(true)
    public allowDrag: boolean;

    /**
     * Enable or disable column drop
     *
     * @default true
     */
    @Property(true)
    public allowDrop: boolean;

    /**
     * Defines the column transition
     *
     * @default []
     */
    @Property([])
    public transitionColumns: string[];

}
