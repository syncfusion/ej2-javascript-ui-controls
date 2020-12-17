import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { SortDirection, SortOrderBy } from '../base/type';

/**
 * Holds the configuration of sort settings in kanban board.
 */
export class SortSettings extends ChildProperty<SortSettings> {

    /**
     * Sort the cards. The possible values are:
     * * DataSourceOrder
     * * Index
     * * Custom
     * @default 'Index'
     */
    @Property('Index')
    public sortBy: SortOrderBy;

    /**
     * Defines the sort field
     * @default null
     */
    @Property()
    public field: string;

    /**
     * Sort the cards. The possible values are:
     * * Ascending
     * * Descending
     * @default 'Ascending'
     */
    @Property('Ascending')
    public direction: SortDirection;

}
