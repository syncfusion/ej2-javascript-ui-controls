import { DataManager } from '@syncfusion/ej2-data';import { Property, ChildProperty } from '@syncfusion/ej2-base';

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
     */

    dataManager?: DataManager;

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
     * Binds the custom data with the node model
     * @aspDefaultValueIgnore
     * @default undefined
     */
    data?: Object[];

    /**
     * Binds the custom data with node model
     * @aspDefaultValueIgnore
     * @default undefined
     */
    doBinding?: Function | string;

}