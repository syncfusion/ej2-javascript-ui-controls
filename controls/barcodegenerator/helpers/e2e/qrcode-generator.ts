/**
 * QR Code Generator component
 */
import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

declare let cy: any;

/**
 * Represents the QR Code Generator helpers.
 */
export class QRCodeGeneratorHelper extends TestHelper {
    /**
     * Specifies the ID of the QR Code Generator.
     */
    public id: string;

    /**
     * Specifies the current helper function of the QR Code Generator.
     */
    public wrapperFn: Function;

    /**
     * Constructor for creating the helper object for QR Code Generator component.
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
     * Gets the root element of the QR Code Generator component.
     */
    public getElement() {
        return this.selector('#' + this.id);
    }

}