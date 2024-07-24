import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Defines the space to be left between an object and its immediate parent
 */
export class Margin extends ChildProperty<Margin> {
    /**
     * Sets the space to be left from the left side of the immediate parent of an element
     *
     * @default 10
     */
    @Property(10)
    public left: number;

    /**
     * Sets the space to be left from the right side of the immediate parent of an element
     *
     * @default 10
     */
    @Property(10)
    public right: number;

    /**
     * Sets the space to be left from the top side of the immediate parent of an element
     *
     * @default 10
     */
    @Property(10)
    public top: number;

    /**
     * Sets the space to be left from the bottom side of the immediate parent of an element
     *
     * @default 10
     */
    @Property(10)
    public bottom: number;
}
