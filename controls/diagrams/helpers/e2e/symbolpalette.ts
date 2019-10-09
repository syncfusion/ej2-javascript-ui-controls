/**
 * Symbolpalette component
 */
import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';
// tslint:disable
declare let cy: any;

/**
 * Represents the symbol palette helpers.
 */
export class SymbolpaletteHelper extends TestHelper {
    /**
     * Specifies the ID of the symbol palette component.
     */
    public id: string;

    /**
     * Specifies the current helper function of the symbol palette component.
     */
    public wrapperFn: Function;

    /**
     * Constructor for creating the helper object for symbol palette component.
     */
    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn;
        }
        return this;
    }

    /**
     * Gets the root element of the symbol palette component.
     */
    public getElement() {
        return this.selector('#' + this.id);
    }

    /**
     * Gets the search box element of the symbol palette component.
     */
    public getSearchElement() {
        return this.selector('#' + this.id + '_search');
    }

    /**
     * Gets the header element of the specific palette in the symbol palette. 
     */
    public getHeadderElement() {
        return this.selector('#' + this.id);
    }

    /**
     * Gets the palette content of the specific palette in the symbol palette. 
     * @param paletteId Defines the ID of the specific palette.
     */
    public getPaletteElement(paletteId: string) {
        return this.selector('#' + paletteId);
    }

    /**
     * Gets the specific palette item of the specific palette in the symbol palette. 
     * @param paletteId Defines the ID of the specific palette.
     */
    public getSymbolElement(symbolId: string) {
        return this.selector('#' + symbolId);
    }
}