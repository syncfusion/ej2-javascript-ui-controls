import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class maskedtextboxHelper extends TestHelper {
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
        return this.selector('.e-control-wrapper.e-mask.e-input-group');
    }

    getInputElement(){
        return this.selector('.e-control-wrapper.e-mask.e-input-group .e-control.e-maskedtextbox.e-lib.e-input');
    }
    
    getFocusElement(){
        return this.selector('.e-control-wrapper.e-mask.e-input-group.e-input-focus');
    }

    getClearIconElement(){
        return this.selector('.e-control-wrapper.e-mask.e-input-group .e-clear-icon');
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