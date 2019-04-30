import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

/**
 * E2E test helpers for Button to easily interact and the test the component
 */

export class listboxHelper extends TestHelper {
    public id: string;
    public wrapperFn: Function;

    /**
     * Initialize the Button E2E helpers
     * @param id Element id of the Button element
     * @param wrapperFn Pass the wrapper function
     */

    constructor(id:string, wrapperFn:Function) {
        super();
        this.id = id;
        if(wrapperFn!==undefined){
            this.wrapperFn = wrapperFn
        }
        return this;
    }
    /**
     * Used to get root element of the Button component
     */
    getElement() {
        return this.selector('#' + this.id);
    }
    
    selectElement(element_id: string){

        document.getElementById(element_id).click();
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
