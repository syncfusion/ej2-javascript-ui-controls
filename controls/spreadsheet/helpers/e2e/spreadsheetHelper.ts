import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

/**
 * E2E test helpers for Spreadsheet to easily interact and the test the component.
 */

export class SpreadsheetHelper extends TestHelper {
    public id: string;
    public wrapperFn: Function;

    /**
     * Initialize the Spreadsheet E2E helpers
     * @param id Element id of the Spreadsheet element
     * @param wrapperFn Pass the wrapper function
     */

    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        return this;
    }
    /**
     * Used to get root element of the Spreadsheet component
     */
    getElement() {
        return this.selector('#' + this.id);
    }

    setModel(property: any, value: any) {
        let cy: any;
        return cy.get('#' + this.id).then((ele: any) => {
            return ele[0].ej2_instances[0][property] = value;
        });
    }

    getModel(property: any) {
        let cy: any;
        return cy.get('#' + this.id).then((ele: any) => {
            return ele[0].ej2_instances[0][property];
        });
    }

    invoke(fName: any, args: any = []) {
        let cy: any;
        return cy.get('#' + this.id).then((ele: any) => {
            var inst = ele[0].ej2_instances[0];
            return inst[fName].apply(inst, args);
        });
    }
}
