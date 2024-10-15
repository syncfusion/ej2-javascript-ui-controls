import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Holds the configuration of stacked header settings in kanban board.
 */
export class StackedHeaders extends ChildProperty<StackedHeaders> {

    /**
     * Defines the column header text
     *
     * @default null
     */
    @Property()
    public text: string;

    /**
     * Defines the multiple columns keyField
     *
     * @default null
     */
    @Property()
    public keyFields: string;

}
