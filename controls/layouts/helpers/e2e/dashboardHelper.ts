import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class DashboardHelper extends TestHelper {
    // tslint:disable
    public id: string;
    public wrapperFn: Function;

    /**
     * Initialize the Dashboard Layout E2E helpers.
     * @param id element id of the Dashboard Layout component.
     * @param wrapperFn pass the wrapper function.
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
     * Gets the selector of the Dashboard Layout component.
     */
    selector(arg: any) {
        return (this.wrapperFn ? this.wrapperFn(arg) : arg);
    }

    /**
     * Gets root element of the Dashboard Layout component.
     */
    getElement() {
        return this.selector('#' + this.id);
    }

    /**
     * Gets the element of the Dashboard Layout component.
     */
    getDashboardLayout() {
        return this.selector('#'+ this.id +'.e-dashboardlayout');
    }

    /**
     * Gets a panel container and its inner elements with the given id from dashboard layout component.
     */
    getPanelContainer() {
        return this.selector('#'+ this.id +'.e-dashboardlayout .e-panel-container');
    }

    /**
     * Gets the panel element of Dashboard Layout component which consists the panel container and its inner elements
     */
    getPanelElement() {
        return this.selector('#'+ this.id +'.e-dashboardlayout .e-panel')
    }

    /**
     * Used to get the panel header of Dashboard Layout component which contains the header details.
     */
    getPanelHeader() {
        return this.selector('#'+ this.id +'.e-dashboardlayout  .e-panel-header');
    }

    /**
     * Gets the panel content of Dashboard Layout component which contains the panel content class.
     */
    getPanelContent() {
        return this.selector('#'+ this.id +'.e-dashboardlayout .e-panel-content');
    }

    /**
     * Gets the resize icon positioned on the South-East side in panel container.
     */
    getSouthEastResizeIcon() {
        return this.selector('#'+ this.id +'.e-dashboardlayout .e-south-east .e-resize');
    }

    /**
     * Gets the resize icon positioned on the North-East side in panel container.
     */
    getNorthEastResizeIcon() {
        return this.selector('#'+ this.id +'.e-dashboardlayout .e-north-east .e-resize');
    }

    /**
     * Gets the resize icon positioned on the North-West side in panel container.
     */
    getNorthWestResizeIcon() {
        return this.selector('#'+ this.id +'.e-dashboardlayout .e-north-west .e-resize');
    }

    /**
     * Gets the resize icon positioned on the South-West side in panel container.
     */
    getSouthWestResizeIcon() {
        return this.selector('#'+ this.id +'.e-dashboardlayout .e-south-west .e-resize');
    }

    /**
     * Gets the clear icon from the panel element.
     */
    getClearIcon() {
        return this.selector('#'+ this.id +'.e-dashboardlayout .e-clear-icon');
    }

    /**
     * Gets the transition of panel in Dashboard Layout component which is used to achieve the resizing behavior.
     */
    getPanelTansition() {
        return this.selector('#'+ this.id +'.e-dashboardlayout .e-panel-transition')
    }
    // tslint:enable
    
}