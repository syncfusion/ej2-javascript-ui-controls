/**
 * Barcode Generator component
 */
import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

declare let cy: any;

/**
 * Represents the Barcode Generator helpers.
 */
export class BarcodeGeneratorHelper extends TestHelper {
    /**
     * Specifies the ID of the Barcode Generator.
     */
    public id: string;

    /**
     * Specifies the current helper function of the Barcode Generator.
     */
    public wrapperFn: Function;

    /**
     * Constructor for creating the helper object for Barcode Generator component.
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
     * Gets the root element of the Barcode Generator component.
     */
    public getElement() {
        return this.selector('#' + this.id);
    }

}