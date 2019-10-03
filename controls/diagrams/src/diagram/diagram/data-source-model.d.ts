import { DataManager } from '@syncfusion/ej2-data';import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { DataMappingItems as DataMappingItems } from './data-mapping';import { DataMappingItemsModel } from './data-mapping-model';

/**
 * Interface for a class CrudAction
 */
export interface CrudActionModel {

    /**
     * set an URL to get a data from database

     */
    read?: string;

    /**
     * set an URL to add a data into database

     */
    create?: string;

    /**
     * set an URL to update the existing data in database

     */
    update?: string;

    /**
     * set an URL to remove an data in database

     */
    destroy?: string;

    /**
     * Add custom fields to node



     */
    customFields?: Object[];

}

/**
 * Interface for a class ConnectionDataSource
 */
export interface ConnectionDataSourceModel {

    /**
     * set an id for connector dataSource

     */
    id?: string;

    /**
     * define sourceID to connect with connector

     */
    sourceID?: string;

    /**
     * define targetID to connect with connector

     */
    targetID?: string;

    /**
     * define sourcePoint to render connector startPoint

     */
    sourcePointX?: number;

    /**
     * define sourcePoint to render connector startPoint

     */
    sourcePointY?: number;

    /**
     * define targetPoint to render connector targetPoint

     */
    targetPointX?: number;

    /**
     * define targetPoint to render connector targetPoint

     */
    targetPointY?: number;

    /**
     * Sets the data source either as a collection of objects or as an URL of DataManager

     */
    dataManager?: DataManager;

    /**
     * Add CrudAction to connector data source



     */
    crudAction?: CrudActionModel;

}

/**
 * Interface for a class DataSource
 */
export interface DataSourceModel {

    /**
     * Sets the unique id of the data source items

     */

    id?: string;

    /**
     * Sets the data source either as a collection of objects or as an URL of DataManager


     */

    dataManager?: DataManager;

    /**
     * Sets the data source either as a collection of objects or as an URL of DataManager

     */

    dataSource?: DataManager;

    /**
     * Sets the unique id of the root data source item

     */
    root?: string;

    /**
     * Sets the unique id that defines the relationship between the data source items

     */
    parentId?: string;

    /**
     * Binds the custom data with node model




     */
    doBinding?: Function | string;

    /**
     * A collection of JSON objects where each object represents an Data Map Items.

     */
    dataMapSettings?: DataMappingItemsModel[];

    /**
     * Add CrudAction to data source



     */
    crudAction?: CrudActionModel;

    /**
     * define connectorDataSource collection



     */
    connectionDataSource?: ConnectionDataSourceModel;

}