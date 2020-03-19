import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class SideBarHelper extends TestHelper {
    // tslint:disable
    public id: string;
    public wrapperFn: Function;

    /**
     * Initialize the Sidebar E2E helpers.
     * @param id Element id of the Sidebar component.
     * @param wrapperFn Pass the wrapper function.
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
     * Gets the selector of the Sidebar component.
     */
    selector(arg: any) {
        return (this.wrapperFn ? this.wrapperFn(arg) : arg);
    }

    /**
     * Gets the element of the Sidebar component with the given id.
     */
    getElement() {
        return this.selector('#' + this.id);
    }

    /**
     * Gets the Sidebar element.
     */
    getSidebar() {
        return this.selector('.e-sidebar');
    }

    /**
     * Gets the left side opened Sidebar element.
     */
    getLeftSideBar() {
        return this.selector('.e-sidebar.e-left.e-open');
    }

    /**
     * Gets the left side positioned Sidebar element.
     */
    getLeft() {
        return this.selector('.e-sidebar.e-left');
    }

    /**
     * Gets the right side positioned Sidebar element.
     */
    getRight() {
        return this.selector('.e-sidebar.e-right');
    }

    /**
     * Gets the right side opened Sidebar element.
     */
    getRightSideBar() {
        return this.selector('.e-sidebar.e-right.e-open');
    }

    /**
     * Gets the Dock state Sidebar element.
     */
    getDockSidebar() {
        return this.selector('.e-sidebar.e-dock');
    }

    /**
     * Gets the Expanded Dock state Sidebar element.
     */
    getExpandedDockSidebar() {
        return this.selector('.e-selector.e-dock.e-open');
    }

    /**
     * Gets the Collapsed Dock state Sidebar element.
     */
    getCollapsedDockSidebar() {
        return this.selector('.e-sidebar.e-dock.e-close');
    }

    /**
     * Gets the Over state Sidebar element.
     */
    getOverStateSidebar() {
        return this.selector('.e-sidebar.e-over');
    }

    /**
     * Gets the Expanded Over state Sidebar element.
     */
    getExpandedOverStateSidebar() {
        return this.selector('.e-sidebar.e-over.e-open');
    }

    /**
     * Gets the Collapsed Over state Sidebar element.
     */
    getCollapsedOverStateSidebar() {
        return this.selector('.e-sidebar.e-over.e-close');
    }

    /**
     * Gets the Push state Sidebar element.
     */
    getPushStateSidebar() {
        return this.selector('.e-sidebar.e-push');
    }

    /**
     * Gets the Expanded Push state Sidebar element.
     */
    getExpandedPushStateSidebar() {
        return this.selector('.e-sidebar.e-push.e-open');
    }

    /**
     * Gets the Collapsed Push state Sidebar element.
     */
    getCollapsedPushStateSidebar() {
        return this.selector('.e-sidebar.e-push.e-close');
    }

    /**
     * Gets the Slide state Sidebar element.
     */
    getSlideStateSidebar() {
        return this.selector('.e-sidebar.e-slide');
    }

    /**
     * Gets the Collapsed Slide state Sidebar element.
     */
    getExpandedSlideStateSidebar() {
        return this.selector('.e-sidebar.e-slide.e-open');
    }

    /**
     * Gets the Collapsed slide state Sidebar element.
     */
    getCollapsedSlideStateSidebar() {
        return this.selector('.e-sidebar.e-slide.e-close');
    }

    /**
     * Gets the overlay element from the Sidebar.
     */
    getOverlayElement() {
        return this.selector('.e-sidebar-overlay');
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
    // tslint:enable
}
    
