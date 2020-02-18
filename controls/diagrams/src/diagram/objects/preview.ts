import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * customize the size of the individual palette items.
 */
export class SymbolSize extends ChildProperty<SymbolSize> {

    /**
     * Defines diagram symbol width
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Defines diagram symbol height.
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

}