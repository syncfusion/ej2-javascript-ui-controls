import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * Sets the space to be left from the left side of the immediate parent of an element
     * @default 10
     */
    left?: number;

    /**
     * Sets the space to be left from the right side of the immediate parent of an element
     * @default 10
     */
    right?: number;

    /**
     * Sets the space to be left from the top side of the immediate parent of an element
     * @default 10
     */
    top?: number;

    /**
     * Sets the space to be left from the bottom side of the immediate parent of an element
     * @default 10
     */
    bottom?: number;

}