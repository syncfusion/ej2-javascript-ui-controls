import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { Actions } from '../interaction/actions';

/**
 * A collection of JSON objects where each object represents a layer.
 * Layer is a named category of diagram shapes.
 */
export class CustomCursorAction extends ChildProperty<CustomCursorAction> {
    /**
     * Defines the property of a Data Map Items
     *
     */
    @Property('')
    public action: Actions;
    /**
     * Defines the Fields for the Data Map Items
     *
     * @default ''
     */
    @Property('')
    public cursor: string;

}
