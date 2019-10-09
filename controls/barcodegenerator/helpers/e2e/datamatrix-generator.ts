/**
 * Data Matrix Generator component
 */
import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

declare let cy: any;

/**
 * Represents the Data Matrix Generator helpers.
 */
export class DataMatrixGeneratorHelper extends TestHelper {
    /**
     * Specifies the ID of the Data Matrix Generator.
     */
    public id: string;

    /**
     * Specifies the current helper function of the Data Matrix Generator.
     */
    public wrapperFn: Function;

    /**
     * Constructor for creating the helper object for Data Matrix Generator component.
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
     * Gets the root element of the Data Matrix Generator component.
     */
    public getElement() {
        return this.selector('#' + this.id);
    }

}