import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';
 
export class GridHelper extends TestHelper {
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
    getDataGridElement() {
        return this.selector('#' + this.id);
    }
    getHeaderElement() {
        return this.selector('#' + this.id + '.e-gridheader');
    }
    getContentElement() {
        return this.selector('#' + this.id + '.e-gridcontent');
    }
    getFooterElement() {
        return this.selector('#' + this.id + '.e-gridfooter');
    }
    getPagerElement() {
        return this.selector('#' + this.id + '.e-gridpager');
    }
    getDialogElement() {
        return this.selector('#' + this.id + '_dialogEdit_wrapper');
   }
    getFilterPopupElement() {
        return this.selector('#' + this.id + '.e-filter-popup');
    }
    getToolbarElement() {
        return this.selector('#' + this.id + '_toolbarItems');
    }
    getCurrentPagerElement() {
        return this.selector('#' + this.id + '.e-numericitem.e-currentitem');
    }
    getPagerDropDownElement() {
        return this.selector('#' + this.id + '.e-pagerdropdown');
    }
 
}
