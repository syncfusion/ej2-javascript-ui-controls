import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class DropDownListHelper extends TestHelper {
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
    getValueElement() {
        return this.selector('#' + this.id + '_hidden');
    }
    getListItemElement() {
        return this.selector('.e-popup .e-content .e-list-parent .e-list-item');
    }
    getListGroupingElemnt(){
        return this.selector('.e-popup .e-content .e-list-parent .e-list-group-item');
    }
    getWrapperElement() {
        return this.selector('.e-input-group.e-control-wrapper.e-ddl.e-lib.e-keyboard');
    }
    getInputGroupIconElement() {
        return this.selector('.e-input-group.e-control-wrapper.e-ddl.e-lib.e-keyboard .e-input-group-icon');
    }
    getSpinnerElement() {
        return this.selector('.e-input-group.e-control-wrapper.e-ddl.e-lib.e-keyboard .e-input-group-icon .e-spinner-pane');
    }
    getSpinnerInnerElement() {
        return this.selector('.e-input-group.e-control-wrapper.e-ddl.e-lib.e-keyboard .e-input-group-icon .e-spinner-pane .e-spinner-inner');
    }
    getFilterParentElement() {
        return this.selector('.e-popup .e-filter-parent');
    }
    getfilterInputGroupElement() {
        return this.selector('.e-popup .e-filter-parent .e-input-group');
    }
    getFilterInputElement() {
        return this.selector('.e-popup .e-filter-parent .e-input-group .e-input-filter');
    }
    getFilterClearIconElement() {
        return this.selector('.e-popup .e-filter-parent .e-input-group .e-clear-icon');
    }   
}

