import { DataManager } from '@syncfusion/ej2-data';import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { DataMappingItems as DataMappingItems } from './data-mapping';import { DataMappingItemsModel } from './data-mapping-model';

/**
 * Interface for a class CrudAction
 */
export interface CrudActionModel {

    /**
     * set an URL to get a data from database
     * @default ''
     */
    read?: string;

    /**
     * set an URL to add a data into database
     * @default ''
     */
    create?: string;

    /**
     * set an URL to update the existing data in database
     * @default ''
     */
    update?: string;

    /**
     * set an URL to remove an data in database
     * @default ''
     */
    destroy?: string;

    /**
     * Add custom fields to node
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    customFields?: Object[];

}

/**
 * Interface for a class ConnectionDataSource
 */
export interface ConnectionDataSourceModel {

    /**
     * set an id for connector dataSource
     * @default ''
     */
    id?: string;

    /**
     * define sourceID to connect with connector
     * @default ''
     */
    sourceID?: string;

    /**
     * define targetID to connect with connector
     * @default ''
     */
    targetID?: string;

    /**
     * define sourcePoint to render connector startPoint
     * @default null
     */
    sourcePointX?: number;

    /**
     * define sourcePoint to render connector startPoint
     * @default null
     */
    sourcePointY?: number;

    /**
     * define targetPoint to render connector targetPoint
     * @default null
     */
    targetPointX?: number;

    /**
     * define targetPoint to render connector targetPoint
     * @default null
     */
    targetPointY?: number;

    /**
     * Sets the data source either as a collection of objects or as an URL of DataManager
     * @default null
     */
    dataManager?: DataManager;

    /**
     * Add CrudAction to connector data source
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    crudAction?: CrudActionModel;

}

/**
 * Interface for a class DataSource
 */
export interface DataSourceModel {

    /**
     * Sets the unique id of the data source items
     * @default ''
     */

    id?: string;

    /**
     * Sets the data source either as a collection of objects or as an URL of DataManager
     * @default null
     * @deprecated
     */

    dataManager?: DataManager;

    /**
     * Sets the data source either as a collection of objects or as an URL of DataManager
     * @default null
     */

    dataSource?: DataManager;

    /**
     * Sets the unique id of the root data source item
     * @default ''
     */
    root?: string;

    /**
     * Sets the unique id that defines the relationship between the data source items
     * @default ''
     */
    parentId?: string;

    /**
     * Binds the custom data with node model
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    doBinding?: Function | string;

    /**
     * A collection of JSON objects where each object represents an Data Map Items.
     * @default []
     */
    dataMapSettings?: DataMappingItemsModel[];

    /**
     * Add CrudAction to data source
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    crudAction?: CrudActionModel;

    /**
     * define connectorDataSource collection
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    connectionDataSource?: ConnectionDataSourceModel;

}