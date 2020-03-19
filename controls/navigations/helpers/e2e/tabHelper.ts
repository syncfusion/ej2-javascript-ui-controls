import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class TabHelper extends TestHelper {
    // tslint:disable
    public id: string;
    public wrapperFn: Function;

    /**
    * Initialize the Tab E2E helpers
    * @param {string} id Element id of the Tab
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
      * Retrieves the rendered html element of Tab.
      */
    getElement() {
        return this.selector('#' + this.id);
    }

    /**
      * Retrieves the rendered html element of Left Scroll Navigation.
      */
    getLeftScrollNavigationElement() {
        return this.selector('#' + this.id + ' .e-tab-header .e-toolbar-items.e-hscroll .e-scroll-nav.e-scroll-left-nav');
    }

    /**
      * Retrieves the rendered html element of Right Scroll Navigation.
      */
    getRightScrollNavigationElement() {
        return this.selector('#' + this.id + ' .e-tab-header .e-toolbar-items.e-hscroll .e-scroll-nav.e-scroll-right-nav');
    }

    /**
      * Retrieves the rendered html element of Overflow Navigation.
      */
    getOverflowNavigationElement() {
        return this.selector('#' + this.id + ' .e-tab-header .e-_nav.e-hor-nav');
    }

    /**
      * Retrieves the rendered html element of Tab Header.
      */
    getHeader() {
        return this.selector('#' + this.id + ' .e-tab-header');
    }

    /**
      * Retrieves the rendered html element of Tab Content.
      */
    getContent() {
        return this.selector('#' + this.id + ' .e-content');
    }

    /**
      * Retrieves the rendered html element of Overflow Item.
      */
    getOverflowItemElement() {
        return this.selector('#' + this.id + ' .e-tab-header .e-toolbar-pop.e-popup .e-toolbar-item');
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
     * @param {any} property denotes name of the property which value is to be updated.
     */
    getModel(property: any) {
        let cy: any;
        return cy.get('#' + this.id).then((ele: any) => {
            return ele[0].ej2_instances[0][property];
        });
    }

    /**
     * The invoke method is used to access the public methods available in Tab control.
     * @param {any} - fName denotes the function name of the Tab control.
     * @param {any} - args denotes the arguments of function. 
     */
    invoke(fName: any, args: any = []) {
        let cy: any;
        return cy.get('#' + this.id).then((ele: any) => {
            var inst = ele[0].ej2_instances[0];
            return inst[fName].apply(inst, args);
        });
    }
    // tslint:enable
}

