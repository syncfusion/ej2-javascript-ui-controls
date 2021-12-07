import { DataManager } from '@syncfusion/ej2-data';
import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';
import { CrudActionModel, ConnectionDataSourceModel } from './data-source-model';
import { DataMappingItems as DataMappingItems } from './data-mapping';
import { DataMappingItemsModel } from './data-mapping-model';

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

export class CrudAction extends ChildProperty<CrudAction> {
    /**
     * set an URL to get a data from database
     *
     * @default ''
     */
    @Property('')
    public read: string;

    /**
     * set an URL to add a data into database
     *
     * @default ''
     */
    @Property('')
    public create: string;

    /**
     * set an URL to update the existing data in database
     *
     * @default ''
     */
    @Property('')
    public update: string;

    /**
     * set an URL to remove an data in database
     *
     * @default ''
     */
    @Property('')
    public destroy: string;

    /**
     * Add custom fields to node
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public customFields: Object[];
}

export class ConnectionDataSource extends ChildProperty<ConnectionDataSource> {
    /**
     * set an id for connector dataSource
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * define sourceID to connect with connector
     *
     * @default ''
     */
    @Property('')
    public sourceID: string;

    /**
     * define targetID to connect with connector
     *
     * @default ''
     */
    @Property('')
    public targetID: string;

    /**
     * define sourcePoint to render connector startPoint
     *
     * @default null
     */
    @Property(null)
    public sourcePointX: number;

    /**
     * define sourcePoint to render connector startPoint
     *
     * @default null
     */
    @Property(null)
    public sourcePointY: number;

    /**
     * define targetPoint to render connector targetPoint
     *
     * @default null
     */
    @Property(null)
    public targetPointX: number;

    /**
     * define targetPoint to render connector targetPoint
     *
     * @default null
     */
    @Property(null)
    public targetPointY: number;

    /**
     * Sets the data source either as a collection of objects or as an URL of DataManager
     *
     * @default null
     */
    @Property(null)
    public dataManager: DataManager;

    /**
     * Add CrudAction to connector data source
     *
     * @aspDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    @Complex<CrudActionModel>({}, CrudAction)
    public crudAction: CrudActionModel;

}

export class DataSource extends ChildProperty<DataSource> {
    /**
     * Sets the unique id of the data source items
     *
     * @default ''
     */

    @Property('')
    public id: string;

    /**
     * Sets the data source either as a collection of objects or as an URL of DataManager
     *
     * @default null
     * @deprecated
     */

    @Property(null)
    public dataManager: DataManager;

    /**
     * Sets the data source either as a collection of objects or as an URL of DataManager
     *
     * @default null
     */

    @Property(null)
    public dataSource: DataManager;

    /**
     * Sets the unique id of the root data source item
     *
     * @default ''
     */
    @Property('')
    public root: string;

    /**
     * Sets the unique id that defines the relationship between the data source items
     *
     * @default ''
     */
    @Property('')
    public parentId: string;

    /**
     * Binds the custom data with node model
     *
     * @aspDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    @Property()
    public doBinding: Function | string;

    /**
     * A collection of JSON objects where each object represents an Data Map Items.
     *
     * @default []
     */
    @Collection<DataMappingItems>([], DataMappingItems)
    public dataMapSettings: DataMappingItemsModel[];

    /**
     * Add CrudAction to data source
     *
     * @aspDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    @Complex<CrudActionModel>({}, CrudAction)
    public crudAction: CrudActionModel;

    /**
     * define connectorDataSource collection
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Complex<ConnectionDataSourceModel>({}, ConnectionDataSource)
    public connectionDataSource: ConnectionDataSourceModel;

}

