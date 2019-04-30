import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class MultiSelectHelper extends TestHelper {
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
    getInputFocusElement(){
        return this.selector('.e-multiselect.e-input-group.e-input-focus');
    }
    getWrapperElement(){
        return this.selector('.e-multiselect.e-input-group .e-multi-select-wrapper');
    }
    getValueElement() {
        return this.selector('.e-multiselect.e-input-group .e-multi-select-wrapper .e-multi-hidden');
    }
    getDropdownBaseInputElement() {
        return this.selector('.e-multiselect.e-input-group .e-multi-select-wrapper .e-dropdownbase');
    }
    getSpinnerElement() {
        return this.selector('.e-multiselect.e-input-group .e-multi-select-wrapper .e-chips-close .e-spinner-pane');
    }
    getSpinnerInnerElement() {
        return this.selector('.e-multiselect.e-input-group .e-multi-select-wrapper .e-chips-close .e-spinner-pane .e-spinner-inner');
    }
    getDelimValuesElement() {
       return this.selector('.e-multiselect.e-input-group .e-multi-select-wrapper .e-delim-view');
    }
    getChipCollectionElement() {
        return this.selector('.e-multiselect.e-input-group .e-multi-select-wrapper .e-chips-collection');
    }
    getSearcherElement() {
        return this.selector('.e-multiselect.e-input-group .e-multi-select-wrapper .e-searcher');
    }
    getChipCloseElement() {
        return this.selector('.e-multiselect.e-input-group .e-multi-select-wrapper .e-chips-close');
    }
    getInputGroupIconElemet(){
        return this.selector('.e-multiselect.e-input-group .e-multi-select-wrapper .e-input-group-icon');
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
    getSelectAllElement(){
        return this.selector('.e-popup .e-selectall-parent')
    }
    getSelectionReorderElement(){
        return this.selector('.e-popup .e-content .e-list-parent.e-ul.e-reorder');
    }
    getSelectionDisabledElement(){
        return this.selector('.e-popup .e-content .e-list-parent .e-list-item.e-disable');
    }
    getSelectAllCheckboxElement(){
        return this.selector('.e-popup .e-selectall-parent .e-checkbox-wrapper');
    }
    getListItemCheckBoxElement(){
        return this.selector('.e-popup .e-content .e-list-parent .e-list-item .e-checkbox-wrapper');
    }
}

