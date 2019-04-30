import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class numerictextboxHelper extends TestHelper {
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

    getWrapperElement() {
        return this.selector('.e-control-wrapper.e-numeric.e-input-group');
    }

    getInputElement() {
        return this.selector('.e-control-wrapper.e-numeric.e-input-group .e-numerictextbox');
    }

    getUpIconElement() {
        return this.selector('.e-control-wrapper.e-numeric.e-input-group .e-input-group-icon.e-spin-up');
    }

    getDownIconElement() {
        return this.selector('.e-control-wrapper.e-numeric.e-input-group .e-input-group-icon.e-spin-down');
    }

    getFocusElement() {
        return this.selector('.e-control-wrapper.e-numeric.e-input-group.e-input-focus');
    }
    getClearIconElement(){
        return this.selector('.e-control-wrapper.e-numeric.e-input-group .e-clear-icon');
    }
    getFloatLabelElement(){
        return this.selector('#' + 'label_' + this.id);
    }
}