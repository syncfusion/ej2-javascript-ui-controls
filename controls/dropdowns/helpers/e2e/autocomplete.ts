import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class AutoCompleteHelper extends TestHelper {
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

    getInputElement() {
        return this.selector('#' + this.id);
    }
    getPopupElement() {
        return this.selector('#' + this.id + '_popup');
    }
    getListItemElement() {
        return this.selector('.e-popup .e-content .e-list-parent .e-list-item');
    }
    getListGroupingElemnt(){
        return this.selector('.e-popup .e-content .e-list-parent .e-list-group-item');
    }
    getValueElement() {
        return this.selector('#' + this.id + '_hidden');
    }
    getWrapperElement() {
        return this.selector('.e-input-group.e-control-wrapper.e-ddl');
    }
    getClearIconElement() {
        return this.selector('.e-input-group.e-control-wrapper.e-ddl .e-clear-icon')
    }
    getSpinnerElement() {
        return this.selector ('.e-input-group.e-control-wrapper.e-ddl .e-clear-icon .e-spinner-pane')
    }
    getSpinnerInnerElement() {
        return this.selector('.e-input-group.e-control-wrapper.e-ddl .e-clear-icon .e-spinner-pane .e-spinner-inner'); 
    }
}

