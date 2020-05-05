import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Defines mapping property to get resource details from resource collection.
 */
export class ResourceFields extends ChildProperty<ResourceFields> {
    /**
     * To map id of resource from resource collection.
     * @default null
     */
    @Property(null)
    public id: string;

    /** 
     * To map name of resource from resource collection.
     * @default null     
     */
    @Property(null)
    public name: string;

    /**
     * To map unit of resource from resource collection.
     * @default null
     */
    @Property(null)
    public unit: string;

    /** 
     * To map group of resource from resource collection.
     * @default null      
     */
    @Property(null)
    public group: string;
}