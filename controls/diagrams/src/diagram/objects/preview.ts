import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { SymbolDescription } from '../../symbol-palette/symbol-palette';
import { DiagramElement } from '..';

/**
 * customize the size of the individual palette items.
 */
export class SymbolSize extends ChildProperty<SymbolSize> {

    /**
     * Sets the width of the symbols
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Sets the height of the symbols
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

}

/**
 * Defines the size and description of a symbol
 */
export class SymbolPaletteInfo extends ChildProperty<SymbolPaletteInfo> {

    /**
     * Defines the width of the symbol description
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Defines the height of the symbol description
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

    /**
     * Defines whether the symbol has to be fit inside the size, that is defined by the symbol palette
     *
     * @default true
     */
    @Property()
    public fit: boolean;

    /**
     * Define the text to be displayed and how that is to be handled.
     *
     * @default null
     */
    @Property()
    public description: SymbolDescription;
    /**
     * Define the template of the symbol that is to be drawn over the palette
     *
     * @default null
     */
    @Property()
    public template: DiagramElement;

    /**
     * Define the text to be displayed when mouse hover on the shape.
     *
     * @default ''
     */
    @Property()
    public tooltip: string;
}
