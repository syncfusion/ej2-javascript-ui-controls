import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';
 
export class TreeGridHelper extends TestHelper {
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
        return this.selector('#' + this.id + ' .e-gridheader');
    }
    getContentElement() {
        return this.selector('#' + this.id + ' .e-gridcontent');
    }
    getFooterElement() {
        return this.selector('#' + this.id + ' .e-gridfooter');
    }
    getPagerElement() {
        return this.selector('#' + this.id + ' .e-gridpager');
    }
    getDialogElement() {
        return this.selector('#' + this.id + '_gridcontrol_dialogEdit_wrapper');
   }
    getFilterPopupElement() {
        return this.selector('#' + this.id + ' .e-filter-popup');
    }
    getToolbarElement() {
        return this.selector('#' + this.id + '_gridcontrol_toolbarItems');
    }
    getCurrentPagerElement() {
        return this.selector('#' + this.id + ' .e-numericitem.e-currentitem');
    }
    getPagerDropDownElement() {
        return this.selector('#' + this.id + ' .e-pagerdropdown');
    }
    getExpandedElements() {
        return this.selector('#' + this.id + ' .e-treegridexpand');
    }
    getCollapsedElements() {
        return this.selector('#' + this.id + ' .e-treegridcollapsed');
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
