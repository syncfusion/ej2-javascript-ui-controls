import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class ResourceFields
 */
export interface ResourceFieldsModel {

    /**
     * To map id of resource from resource collection.
     * @default null
     */
    id?: string;

    /**
     * To map name of resource from resource collection.
     * @default null     
     */
    name?: string;

    /**
     * To map unit of resource from resource collection.
     * @default null
     */
    unit?: string;

    /**
     * To map group of resource from resource collection.
     * @default null      
     */
    group?: string;

}