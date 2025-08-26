import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * A collection of JSON objects where each object represents a layer.
 * Layer is a named category of diagram shapes.
 */
export class DataMappingItems extends ChildProperty<DataMappingItems> {
    /**
     * Defines the property of a Data Map Items
     *
     * @default ''
     */
    @Property('')
    public property: string;
    /**
     * Defines the Fields for the Data Map Items
     *
     * @default ''
     */
    @Property('')
    public field: string;

}
