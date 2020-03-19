import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class AccordionHelper extends TestHelper {
    // tslint:disable
    public id: string;
    public wrapperFn: Function;

    /**
    * Initialize the Accordion E2E helpers
    * @param {string} id Element id of the Accordion
    * @param {Function} wrapperFn Pass the wrapper function
    */
    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn
        }
        return this;
    }

    /**
      * Retrieves the selector.
      */
    selector(arg: any) {
        return (this.wrapperFn ? this.wrapperFn(arg) : arg);
    }

    /**
      * Retrieves the rendered html element of Accordion.
      */
    getElement() {
        return this.selector('#' + this.id);
    }

    /**
      * Retrieves the rendered html element of Accordion Item.
      */
    getItemElement() {
        return this.selector('#' + this.id + ' .e-acrdn-item');
    }

    /**
      * Retrieves the rendered html element of Accordion Header.
      */
    getHeaderElement() {
        return this.selector('#' + this.id + ' .e-acrdn-item .e-acrdn-header');
    }

    /**
      * Retrieves the rendered html element of Accordion Panel.
      */
    getPanelElement() {
        return this.selector('#' + this.id + ' .e-acrdn-item .e-acrdn-panel');
    }

    /**
      * Retrieves the rendered html element of active/selected item.
      */
    getActiveElement() {
        return this.selector('#' + this.id + ' .e-acrdn-item.e-selected.e-active');
    }

    /**
      * Retrieves the rendered html element of expand state item.
      */
    getExpandStateElement() {
        return this.selector('#' + this.id + ' .e-acrdn-item.e-expand-state');
    }

    /**
     * The setModel method is used to set the value of the property.
     * @param {any} property denotes name of the property.
     * @param {any} value denotes corresponding value of the property.
     */
    setModel(property: any, value: any) {
        let cy: any;
        return cy.get('#' + this.id).then((ele: any) => {
            return ele[0].ej2_instances[0][property] = value;
        });
    }

    /**
     * The getModel method is used to return value for the property.
     * @param {any} property denotes name of the property which value is to be get.
     */
    getModel(property: any) {
        let cy: any;
        return cy.get('#' + this.id).then((ele: any) => {
            return ele[0].ej2_instances[0][property];
        });
    }

    /**
     * The invoke method is used to access the public methods available in Accordion control.
     * @param {any} - fName denotes the function name of the Accordion control.
     * @param {any} - args denotes the arguments of function. 
     */
    invoke(functionName: any, args: any = []) {
        let cy: any;
        return cy.get('#' + this.id).then((ele: any) => {
            var inst = ele[0].ej2_instances[0];
            return inst[functionName].apply(inst, args);
        });
    }
    // tslint:enable
}

