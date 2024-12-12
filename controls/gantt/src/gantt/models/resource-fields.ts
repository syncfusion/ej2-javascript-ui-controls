import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Defines the mapping properties to extract resource details from the resource collection.
 */
export class ResourceFields extends ChildProperty<ResourceFields> {
    /**
     * Specifies the field to map the ID of a resource from the resource collection.
     *
     * @default null
     */
    @Property(null)
    public id: string;

    /**
     * Specifies the field to map the name of the resource from the resource collection.
     *
     * @default null
     */
    @Property(null)
    public name: string;

    /**
     * Specifies the field to map the unit of the resource from the resource collection.
     *
     * @default null
     */
    @Property(null)
    public unit: string;

    /**
     * Specifies the field to map the group of the resource from the resource collection.
     *
     * @default null
     */
    @Property(null)
    public group: string;
}
