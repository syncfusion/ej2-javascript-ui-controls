import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

/**
 * E2E test helpers for ContextMenu to easily interact and the test the component
 */

export class ContextMenuHelper extends TestHelper {
    public id: string;
    public wrapperFn: Function;

    /**
     * Initialize the ContextMenu E2E helpers
     * @param id Element id of the ContextMenu element
     * @param wrapperFn Pass the wrapper function
     * @return ContextMenu any
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
     * Used to get the root element of the ContextMenu component.
     * @return Element
     */
    getElement() {
        return this.selector('#' + this.id);
    }
    /**
     * The setModel method is used to set values for the property. It will accepts two arguments.
     * @param property - Specifies the name of the property whose value has to be updated.
     * @param value - Specifies the corresponding value to the property.
     */
    setModel(property: any, value: any) {
        let cy: any;
        return cy.get('#' + this.id).then((ele: any) => {
            return ele[0].ej2_instances[0][property] = value;
        });
    }
    /**
     * The getModel method is used to return value for the property.
     * @param property - Specifies the name of the property.
     */
    getModel(property: any) {
        let cy: any;
        return cy.get('#' + this.id).then((ele: any) => {
            return ele[0].ej2_instances[0][property];
        });
    }
    /**
     * The invoke method is used to access the public methods available in ContextMenu control.
     * @param fName - Specifies the method name of the ContextMenu control.
     * @param args - Specifies the arguments. This is optional.
     */
    invoke(fName: any, args: any = []) {
        let cy: any;
        return cy.get('#' + this.id).then((ele: any) => {
            var inst = ele[0].ej2_instances[0];
            return inst[fName].apply(inst, args);
        });
    }
}