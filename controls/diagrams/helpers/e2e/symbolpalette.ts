/**
 * Symbolpalette component
 */
import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';
// tslint:disable
declare let cy: any;

export class SymbolpaletteHelper extends TestHelper {
    public id: string;
    public wrapperFn: Function;
    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn;
        }
        return this;
    }
    public getElement() {
        return this.selector('#' + this.id);
    }
    public getSearchElement() {
        return this.selector('#' + this.id + '_search');
    }
    public getHeadderElement() {
        return this.selector('#' + this.id);
    }
    public getPaletteElement(paletteId: string) {
        return this.selector('#' + paletteId);
    }
    public getSymbolElement(symbolId: string) {
        return this.selector('#' + symbolId);
    }
}