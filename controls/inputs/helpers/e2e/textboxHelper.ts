import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class textboxHelper extends TestHelper {
    // tslint:disable
    public id: string;
    public wrapperFn: Function;

    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn
        }
        return this;
    }

    selector(arg: any) {
        return (this.wrapperFn ? this.wrapperFn(arg) : arg);
    }

    getElement() {
        return this.selector('#' + this.id);
    }

    getWrapperElement(){
        return this.selector('.e-float-input.e-control-wrapper');
    }

    getInputElement(){
        return this.selector('.e-float-input.e-control-wrapper .e-control.e-textbox.e-lib');
    }
    getClearIconElement(){
        return this.selector('.e-float-input.e-control-wrapper .e-float-line .e-clear-icon');
    }
    getFloatLabelElement(){
        return this.selector('#' + 'label_' + this.id);
    }
    setModel(property: any, value: any) {
        let cy: any;
        return cy.get('#' + this.id).then((ele: any) => {
            return ele[0].ej2_instances[0][property] = value;
        });
    }
}