import { Property, ChildProperty } from '@syncfusion/ej2-base';import { Actions } from '../interaction/actions';

/**
 * Interface for a class CustomCursorAction
 */
export interface CustomCursorActionModel {

    /**
     * Defines the property of a Data Map Items
     *
     */
    action?: Actions;

    /**
     * Defines the Fields for the Data Map Items
     *
     * @default ''
     */
    cursor?: string;

}