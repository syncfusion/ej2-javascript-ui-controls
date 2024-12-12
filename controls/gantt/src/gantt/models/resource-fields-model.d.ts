import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class ResourceFields
 */
export interface ResourceFieldsModel {

    /**
     * Specifies the field to map the ID of a resource from the resource collection.
     *
     * @default null
     */
    id?: string;

    /**
     * Specifies the field to map the name of the resource from the resource collection.
     *
     * @default null
     */
    name?: string;

    /**
     * Specifies the field to map the unit of the resource from the resource collection.
     *
     * @default null
     */
    unit?: string;

    /**
     * Specifies the field to map the group of the resource from the resource collection.
     *
     * @default null
     */
    group?: string;

}