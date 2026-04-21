import { isNullOrUndefined, Browser, createElement } from '@syncfusion/ej2-base';
import { ContextMenu, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { OrganizeDetails } from '../organize-pdf';
import { bindImportDocEvent } from './organize-importaction';
import { onToolbarCopyButtonClick } from './organizepages-editor';

/**
 * @private
 * @returns { void }
 */
export function createMobileContextMenu(): void {
    this.mobileContextMenu = [
        { text: this.pdfViewer.localeObj.getConstant('Save'), iconCss: 'e-icons e-pv-save-icon e-pv-icon' },
        { text: this.pdfViewer.localeObj.getConstant('Save As'), iconCss: 'e-icons e-pv-save-as-icon e-pv-icon' },
        {
            separator: true
        },
        { text: this.pdfViewer.localeObj.getConstant('Copy'), iconCss: 'e-pv-copy-icon e-pv-icon' },
        {
            separator: true
        },
        { text: this.pdfViewer.localeObj.getConstant('Import Document'), id: this.pdfViewer.element.id + '_import_pages', iconCss: 'e-pv-import-icon e-pv-icon' }
    ];
    const contextMenuElement: HTMLElement = createElement('ul', { id: this.pdfViewer.element.id + '_organize_context_menu' });
    this.pdfViewer.element.appendChild(contextMenuElement);
    if (isNullOrUndefined(this.contextMenuObj)) {
        this.contextMenuObj = new ContextMenu({
            target: '#' + this.pdfViewer.element.id + '_organize_more_button', items: this.mobileContextMenu,
            beforeOpen: contextMenuBeforeOpen.bind(this),
            select: contextMenuItemSelect.bind(this)
        });
        if (this.pdfViewer.enableRtl) {
            this.contextMenuObj.enableRtl = true;
        }
        this.contextMenuObj.appendTo(contextMenuElement);
    }
    if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
        this.contextMenuObj.animationSettings.effect = 'ZoomIn';
    }
    else {
        this.contextMenuObj.animationSettings.effect = 'SlideDown';
    }
}

/**
 * @private
 * @param { BeforeOpenCloseMenuEventArgs } args - It's describes about the before open close menu events.
 * @returns { void }
 */
export function contextMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
    this.contextMenuObj.enableItems(['Save', 'Save As'], true);
    this.contextMenuObj.enableItems(['Copy'], false);
    this.contextMenuObj.enableItems(['Import Document'], false);
    const isCopyDisabled: boolean = false;
    const isCopyRotateDisabled: boolean = false;
    if ((this.selectAllCheckBox.checked || this.selectAllCheckBox.indeterminate) &&
        this.pdfViewer.pageOrganizerSettings.canCopy && !getCopiedItems.call(this, isCopyDisabled) &&
        !getImportedItems.call(this, isCopyRotateDisabled)) {
        this.contextMenuObj.enableItems(['Copy'], true);
    }
    if (this.pdfViewer.pageOrganizerSettings.canImport) {
        this.contextMenuObj.enableItems(['Import Document'], true);
    }
}

/**
 * @private
 * @param { boolean } isCopyDisabled - It's describes about enable or disable copy action.
 * @returns { boolean } - It's return copied item.
 */
export function getCopiedItems(isCopyDisabled: boolean): boolean {
    const selectedNodes: NodeListOf<Element> = this.tileAreaDiv.querySelectorAll('.e-pv-organize-node-selection-ring');
    selectedNodes.forEach((selectedElements: HTMLElement) => {
        const mainTileElement: HTMLElement = selectedElements.closest('.e-pv-organize-anchor-node') as HTMLElement;
        const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
        const currentPageDetails: OrganizeDetails = this.tempOrganizePagesCollection.
            find((item: OrganizeDetails) => { return item.currentPageIndex === pageOrder; });
        if (currentPageDetails.isInserted && !currentPageDetails.isDeleted) {
            isCopyDisabled = true;
        }
    });
    return isCopyDisabled;
}

/**
 * @private
 * @param { boolean } isCopyRotateDisabled - It's describes about enable or disable copy ans rotate action.
 * @returns { boolean} - It's describe about enable or disable the copy delete icon.
 */
export function getImportedItems(isCopyRotateDisabled: boolean): boolean {
    const selectedNodes: NodeListOf<Element> = this.tileAreaDiv.querySelectorAll('.e-pv-organize-node-selection-ring');
    selectedNodes.forEach((selectedElements: HTMLElement) => {
        const mainTileElement: HTMLElement = selectedElements.closest('.e-pv-organize-anchor-node') as HTMLElement;
        const pageOrder: number = parseInt(mainTileElement.getAttribute('data-page-order'), 10);
        const currentPageDetails: OrganizeDetails = this.tempOrganizePagesCollection.
            find((item: OrganizeDetails) => { return item.currentPageIndex === pageOrder; });
        if (currentPageDetails.isImportedDoc && !currentPageDetails.isDeleted) {
            isCopyRotateDisabled = true;
        }
    });
    return isCopyRotateDisabled;
}

/**
 * @private
 * @param { any } args - It's describes about context menu selected item.
 * @returns { void }
 */
export function contextMenuItemSelect(args: any): void {
    switch (args.item.text) {
    case 'Save':
        this.onSaveClicked();
        break;
    case 'Save As':
        this.onSaveasClicked();
        break;
    case 'Copy':
        onToolbarCopyButtonClick.call(this);
        break;
    case 'Import Document':
        bindImportDocEvent.call(this);
        break;
    default:
        break;
    }
}

/**
 * @private
 * @param { any } event - It's describes about openContextMenu.
 * @returns { void }
 */
export function openContextMenu(event: any): void {
    const contextMenu: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_organize_context_menu');
    if (!isNullOrUndefined(contextMenu) && contextMenu.style.display !== 'block') {
        this.contextMenuObj.open(event.originalEvent.clientY, event.originalEvent.clientX, event.originalEvent.currentTarget);
    }
}
