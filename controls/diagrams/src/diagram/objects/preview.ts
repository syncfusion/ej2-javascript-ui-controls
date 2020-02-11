import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * customize the size of the individual palette items.
 */
export class SymbolSize extends ChildProperty<SymbolSize> {

    /**
     * Sets the width of the symbols
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Sets the height of the symbols
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

}