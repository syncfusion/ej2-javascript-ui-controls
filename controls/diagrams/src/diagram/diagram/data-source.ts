import { DataManager } from '@syncfusion/ej2-data';
import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Configures the data source that is to be bound with diagram
 * ```html
 * <div id='diagram'></div>
 * ```
 * ```typescript
 * let data: object[] = [
 * { Name: "Elizabeth", Role: "Director" },
 * { Name: "Christina", ReportingPerson: "Elizabeth", Role: "Manager" },
 * { Name: "Yoshi", ReportingPerson: "Christina", Role: "Lead" },
 * { Name: "Philip", ReportingPerson: "Christina", Role: "Lead" },
 * { Name: "Yang", ReportingPerson: "Elizabeth", Role: "Manager" },
 * { Name: "Roland", ReportingPerson: "Yang", Role: "Lead" },
 * { Name: "Yvonne", ReportingPerson: "Yang", Role: "Lead" }
 * ];
 * let items: DataManager = new DataManager(data as JSON[]);
 * let diagram: Diagram = new Diagram({
 * ...
 * layout: {
 *             type: 'OrganizationalChart'
 * },
 * dataSourceSettings: {
 * id: 'Name', parentId: 'ReportingPerson', dataManager: items,
 * }
 * ...
 * });
 * diagram.appendTo('#diagram');
 * ```
 */

export class DataSource extends ChildProperty<DataSource> {
    /**
     * Sets the unique id of the data source items
     * @default ''
     */

    @Property('')
    public id: string;

    /**
     * Sets the data source either as a collection of objects or as an URL of DataManager
     * @default null
     */

    @Property(null)
    public dataManager: DataManager;

    /**
     * Sets the unique id of the root data source item
     * @default ''
     */
    @Property('')
    public root: string;

    /**
     * Sets the unique id that defines the relationship between the data source items
     * @default ''
     */
    @Property('')
    public parentId: string;

    /**
     * Binds the custom data with the node model
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public data: Object[];

    /**
     * Binds the custom data with node model
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public doBinding: Function | string;

}