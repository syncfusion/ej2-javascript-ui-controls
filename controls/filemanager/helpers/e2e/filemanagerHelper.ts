import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

/**
 * E2E test helpers for FileManager to easily interact and the test the component
 */

export class FileManagerHelpers extends TestHelper { 
    public id: string;
    public wrapperFn: Function;

    /**
     * Initialize the FileManager E2E helpers
     * @param id Element id of the FileManager element
     * @param wrapperFn Pass the wrapper function
     */

    constructor(id:string, wrapperFn:Function) {
        super();
        this.id = id;
        if(wrapperFn!==undefined){
            this.wrapperFn = wrapperFn
        }
        return this;
    }

    selector(arg: any) {
        return (this.wrapperFn ? this.wrapperFn(arg) : arg);
    }

    /**
     * Returns the root element of the FileManager component.
     */
    getElement(){
        return this.selector('#' + this.id);
    }

    /**
     * Returns the toolbar items from the FileManager component.
     */
    getToolbarItems() {
		return this.selector('#' + this.id + '.e-filemanager .e-toolbar .e-toolbar-items .e-toolbar-item');
    }

    /**
     * Returns the active toolbar item element from the FileManager component.
     */
    getToolbarItemsActive() {
        return this.selector('#' + this.id + '.e-filemanager .e-toolbar .e-toolbar-items .e-toolbar-item .e-active');
    }
	
	getTreeviewItems() {
		return this.selector('#' + this.id + '.e-filemanager .e-splitter .e-treeview .e-list-item');
	}

    /**
     * Returns the collapsed treeview node element from the FileManager component.
     */
    getTreeviewCollapsedItems() {
        return this.selector('#' + this.id + '.e-filemanager .e-splitter .e-treeview .e-list-item .e-node-collapsed');
    }
    
    /**
     * Returns the collapsed icon of treeview node element from the FileManager component.
     */
	getTreeviewCollapsedIcon() {
		return this.selector('#' + this.id + '.e-filemanager .e-splitter .e-treeview .e-list-item .e-icons.e-icon-collapsible');
	}
    
    /**
     * Returns the expanded icon of treeview node element from the FileManager component.
     */
	getTreeviewExpandedIcon() {
		return this.selector('#' + this.id + '.e-filemanager .e-splitter .e-treeview .e-list-item .e-icons.e-icon-expandable');
	}
    
    /**
     * Returns the active treeview node element from the FileManager component.
     */    
    getTreeviewActiveItems() {
        return this.selector('#' + this.id + '.e-filemanager .e-splitter .e-treeview .e-list-item .e-active');
    }
    
    /**
     * Returns the treeview items folder icon from the FileManager component.
     */ 
	getTreeviewItemsFolderIcon() { 
	    return this.selector('#' + this.id + '.e-filemanager .e-splitter .e-treeview .e-list-item .e-list-icon.e-fe-folder');
	}
    
    /**
     * Returns the treeview items text from the FileManager component.
     */ 
	getTreeviewItemsText() { 
	   return this.selector('#' + this.id + '.e-filemanager .e-splitter .e-treeview .e-list-item .e-list-text');
	
	}

    /**
     * Returns the largeIcon element from the FileManager component.
     */
    getlargeIconsItems() {
        return this.selector('#' + this.id + '.e-filemanager .e-splitter .e-layout-content .e-large-icons .e-list-parent.e-ul .e-list-item"');
    }

    /**
     * Returns the active list element in largeIcon view from the FileManager component.
     */
    getlargeIconsActiveItems() {
        return this.selector('#' + this.id + '.e-filemanager .e-splitter .e-layout-content .e-large-icons .e-list-parent.e-ul .e-list-item.e-active');
    }

    /**
     * Returns the checked element in largeIcon view from the FileManager component.
     */
    getlargeIconsCheckedItems() {
        return this.selector('#' + this.id + '.e-filemanager .e-splitter .e-layout-content .e-large-icons .e-list-parent.e-ul .e-list-item .e-checkbox-wrapper .e-check');
    }

    /**
     * Returns the grid element from the FileManager component.
     */
    getGridElement() {
        return this.selector('#' + this.id + '.e-filemanager .e-splitter .e-layout-content .e-grid');
    }

    /**
     * Returns the active element in grid view from the FileManager component.
     */
    getGridActiveElements() {
        return this.selector('#' + this.id + '.e-filemanager .e-splitter .e-layout-content .e-grid .e-gridcontent .e-table .e-row .e-rowcell.e-active');
    }

    /**
     * Returns the checked element in grid view from the FileManager component.
     */
    getGridCheckedElements() {
        return this.selector('#' + this.id + '.e-filemanager .e-splitter .e-layout-content .e-grid .e-gridcontent .e-table .e-row .e-rowcell .e-checkbox-wrapper .e-check');
    }

    /**
     * Returns the dialog element from the FileManager component.
     */
    getDialogElement() {
        return this.selector('#' + this.id + '.e-filemanager .e-dialog.e-popup.e-popup-open');
    }

    /**
     * Returns the breadcrumbBar element from the FileManager component.
     */
    getBreadCrumbBarElement() {
        return this.selector('#' + this.id + '.e-filemanager .e-splitter .e-layout-content .e-address .e-addressbar-ul .e-address-list-item');
    }

    /**
     * Returns the splitter element from the FileManager component.
     */
    getSplitterElement() {
        return this.selector('#' + this.id + '.e-filemanager .e-splitter.e-splitter-horizontal');
    }

    /**
     * Returns the contextmenu element from the FileManager component.
     */
    getContextMenuElement() {
      return this.selector('.e-fe-popup .e-contextmenu');
    }

    /**
     * Returns the sortby popup element from the FileManager component.
     */
    getSortByPopupElement() {
        return this.selector('.e-dropdown-popup.e-fe-popup.e-popup-open');
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