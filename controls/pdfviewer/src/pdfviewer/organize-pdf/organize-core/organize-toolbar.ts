import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Toolbar, ClickEventArgs, ItemModel } from '@syncfusion/ej2-navigations';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { TooltipEventArgs } from '@syncfusion/ej2-popups';
import { importDocUnWireEvent, importDocWireEvent, onSelectAllClick } from './organize-event-handler';
import { createPageZoomSlider, pageZoomSliderWireEvents, pageZoomWireEvents } from './slider-zoomaction';
import { getCopiedItems, getImportedItems, openContextMenu } from './organize-contextmenu';
import { renderThumbnailImage } from './organize-thumbnail';
import { updateTileButtons } from './tile-interaction';
import { bindImportDocEvent } from './organize-importaction';
import { onToolbarCopyButtonClick, onToolbarDeleteButtonClick, onToolbarLeftButtonClick, onToolbarRightButtonClick } from './organizepages-editor';
import { createTooltip } from './organize-initialization';
import { addExtractionIcon, onToolbarExtractButtonClick } from './organize-extract';


/**
 * @private
 * @returns {any} - It's describe about organize window container.
 */
export function createContentArea(): any {
    const elementID: string = this.pdfViewer.element.id;
    const contentDiv: HTMLElement = createElement('div', { id: elementID + '_content_appearance', className: 'e-pv-organize-content-apperance' });
    const toolbarDiv: HTMLElement = createElement('div', { id: elementID + '_toolbar_appearance', className: 'e-pv-organize-toolbar-apperance' });
    this.tileAreaWrapper = createElement('div', { id: this.pdfViewer.element.id + '_organize_tile_view_wrapper', className: 'e-pv-organize-tile-view-wrapper' });
    this.tileAreaDiv = createElement('div', { id: this.pdfViewer.element.id + '_organize_tile_view', className: 'e-pv-organize-tile-view e-pv-thumbnail-row' });
    this.tileAreaWrapper.style.width = '100%';
    this.tileAreaWrapper.style.height = 'calc(100% - 48px)';
    this.tileAreaWrapper.style.position = 'relative';
    contentDiv.style.width = '100%';
    contentDiv.style.height = '100%';
    toolbarDiv.style.height = '48px';
    this.tileAreaDiv.style.height = '100%';
    this.selectAllCheckBox = new CheckBox(
        { label: Browser.isDevice && !this.pdfViewer.enableDesktopMode ? '' : this.pdfViewer.localeObj.getConstant('Select All'), cssClass: 'e-pv-organize-select-all', checked: false, change: onSelectAllClick.bind(this) });
    const toolbarItems: ItemModel[] = [];
    const toolbarItemsForDesktop: ItemModel[] = [
        { type: 'Input', template: this.selectAllCheckBox, id: 'selectAllCheckbox', align: 'Left' },
        { type: 'Separator', align: 'Left' },
        {
            prefixIcon: 'e-pv-undo-icon e-pv-icon', visible: true, cssClass: 'e-pv-undo-container', id: this.pdfViewer.element.id + '_undo_organize_Pages', align: 'Left', click: (args: ClickEventArgs) => {
                this.undo();
            }
        },
        {
            prefixIcon: 'e-pv-redo-icon e-pv-icon', visible: true, cssClass: 'e-pv-redo-container', id: this.pdfViewer.element.id + '_redo_organize_Pages', align: 'Left', click: (args: ClickEventArgs) => {
                this.redo();
            }
        },
        {
            prefixIcon: 'e-pv-rotate-left-icon e-pv-icon', visible: true, cssClass: 'e-pv-toolbar-rotate-left', id: this.pdfViewer.element.id + '_rotate_page_left', align: 'Center', click: (args: ClickEventArgs) => {
                onToolbarLeftButtonClick.call(this);
            }
        },
        {
            prefixIcon: 'e-pv-rotate-right-icon e-pv-icon', visible: true, cssClass: 'e-pv-toolbar-rotate-right', id: this.pdfViewer.element.id + '_rotate_page_right', align: 'Center', click: (args: ClickEventArgs) => {
                onToolbarRightButtonClick.call(this);
            }
        },
        { type: 'Separator', align: 'Center' },
        {
            prefixIcon: 'e-pv-copy-icon e-pv-icon', visible: true, cssClass: 'e-pv-toolbar-rotate-right', id: this.pdfViewer.element.id + '_copy_page', align: 'Center', click: (args: ClickEventArgs) => {
                onToolbarCopyButtonClick.call(this);
            }
        },
        { type: 'Separator', align: 'Center' },
        {
            prefixIcon: 'e-pv-delete-icon e-pv-icon', visible: true, cssClass: 'e-pv-delete-selected', id: this.pdfViewer.element.id + '_delete_selected', align: 'Center', click: (args: ClickEventArgs) => {
                onToolbarDeleteButtonClick.call(this);
            }
        },
        { type: 'Separator', align: 'Center', visible: this.pdfViewerBase.clientSideRendering },
        {
            prefixIcon: 'e-pv-extract-page-icon e-pv-icon', visible: this.pdfViewerBase.clientSideRendering, cssClass: 'e-pv-extract-pages', id: this.pdfViewer.element.id + '_extract_pages', align: 'Center', click: (args: ClickEventArgs) => {
                onToolbarExtractButtonClick.call(this);
            }
        },
        {
            prefixIcon: 'e-pv-import-icon e-pv-icon', text: this.pdfViewer.localeObj.getConstant('Import Document'), visible: true, cssClass: 'e-pv-import-pages', id: this.pdfViewer.element.id + '_import_pages', align: 'Right', click: (args: ClickEventArgs) => {
                bindImportDocEvent.call(this);
            }
        }
    ];
    if (this.pdfViewer.pageOrganizerSettings.showImageZoomingSlider) {
        addPageZoomDropDown.call(this, true, toolbarItemsForDesktop);
    }
    if (!this.pdfViewer.pageOrganizerSettings.showExtractPagesOption) {
        addExtractionIcon.call(this, true, toolbarItemsForDesktop);
    }
    const toolbarItemsForMobile: ItemModel[] = [
        { type: 'Input', template: this.selectAllCheckBox, id: 'selectAllCheckbox', align: 'Left' },
        { type: 'Separator', align: 'Left' },
        {
            prefixIcon: 'e-pv-undo-icon e-pv-icon', visible: true, cssClass: 'e-pv-undo-container', id: this.pdfViewer.element.id + '_undo_organize_Pages', align: 'Left', click: (args: ClickEventArgs) => {
                this.undo();
            }
        },
        {
            prefixIcon: 'e-pv-redo-icon e-pv-icon', visible: true, cssClass: 'e-pv-redo-container', id: this.pdfViewer.element.id + '_redo_organize_Pages', align: 'Left', click: (args: ClickEventArgs) => {
                this.redo();
            }
        },
        {
            prefixIcon: 'e-pv-rotate-left-icon e-pv-icon', visible: true, cssClass: 'e-pv-toolbar-rotate-left', id: this.pdfViewer.element.id + '_rotate_page_left', align: 'Right', click: (args: ClickEventArgs) => {
                onToolbarLeftButtonClick.call(this);
            }
        },
        {
            prefixIcon: 'e-pv-rotate-right-icon e-pv-icon', visible: true, cssClass: 'e-pv-toolbar-rotate-right', id: this.pdfViewer.element.id + '_rotate_page_right', align: 'Right', click: (args: ClickEventArgs) => {
                onToolbarRightButtonClick.call(this);
            }
        },
        {
            prefixIcon: 'e-pv-delete-icon e-pv-icon', visible: true, cssClass: 'e-pv-delete-selected', id: this.pdfViewer.element.id + '_delete_selected', align: 'Right', click: (args: ClickEventArgs) => {
                onToolbarDeleteButtonClick.call(this);
            }
        },
        {
            prefixIcon: 'e-pv-extract-page-icon e-pv-icon', visible: this.pdfViewerBase.clientSideRendering, cssClass: 'e-pv-extract-pages', id: this.pdfViewer.element.id + '_extract_pages', align: 'Right', click: (args: ClickEventArgs) => {
                onToolbarExtractButtonClick.call(this);
            }
        },
        { type: 'Separator', align: 'Right' },
        {
            prefixIcon: 'e-pv-more-icon e-pv-icon', visible: true, cssClass: 'e-pv-toolbar-rotate-right', id: this.pdfViewer.element.id + '_organize_more_button', align: 'Right',
            click: openContextMenu.bind(this)
        }
    ];
    addPageZoomDropDown.call(this, true, toolbarItemsForMobile);
    if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
        toolbarItems.push(...toolbarItemsForMobile);
    }
    else {
        toolbarItems.push(...toolbarItemsForDesktop);
    }
    this.toolbar = new Toolbar({
        items: toolbarItems
    });
    this.toolbar.cssClass = 'e-pv-organize-toolbar';
    this.toolbar.height = '48px';
    this.toolbar.width = 'auto';
    if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
        this.toolbar.overflowMode = 'Popup';
    }
    this.toolbar.appendTo(toolbarDiv);
    contentDiv.appendChild(toolbarDiv);
    renderThumbnailImage.call(this);
    this.tileAreaWrapper.appendChild(this.tileAreaDiv);
    contentDiv.appendChild(this.tileAreaWrapper);
    createImportDocElement.call(this, toolbarDiv);
    importDocWireEvent.call(this);
    const rotateRightToolbarButton: HTMLElement = toolbarDiv.querySelector('#' + this.pdfViewer.element.id + '_rotate_page_right');
    if (!isNullOrUndefined(rotateRightToolbarButton)) {
        createTooltip.call(this, rotateRightToolbarButton, this.pdfViewer.localeObj.getConstant('Rotate Right'));
    }
    const rotateLeftToolbarButton: HTMLElement = toolbarDiv.querySelector('#' + this.pdfViewer.element.id + '_rotate_page_left');
    if (!isNullOrUndefined(rotateLeftToolbarButton)) {
        createTooltip.call(this, rotateLeftToolbarButton, this.pdfViewer.localeObj.getConstant('Rotate Left'));
    }
    const copyToolbarButton: HTMLElement = toolbarDiv.querySelector('#' + this.pdfViewer.element.id + '_copy_page');
    if (!isNullOrUndefined(copyToolbarButton)) {
        createTooltip.call(this, copyToolbarButton, this.pdfViewer.localeObj.getConstant('Copy Pages'));
    }
    const deleteToolbarButton: HTMLElement = toolbarDiv.querySelector('#' + this.pdfViewer.element.id + '_delete_selected');
    if (!isNullOrUndefined(deleteToolbarButton)) {
        createTooltip.call(this, deleteToolbarButton, this.pdfViewer.localeObj.getConstant('Delete Pages'));
    }
    const undoToolbarButton: HTMLElement = toolbarDiv.querySelector('#' + this.pdfViewer.element.id + '_undo_organize_Pages');
    if (!isNullOrUndefined(undoToolbarButton)) {
        createTooltip.call(this, undoToolbarButton, this.pdfViewer.localeObj.getConstant('Undo'));
    }
    const redoToolbarButton: HTMLElement = toolbarDiv.querySelector('#' + this.pdfViewer.element.id + '_redo_organize_Pages');
    if (!isNullOrUndefined(redoToolbarButton)) {
        createTooltip.call(this, redoToolbarButton, this.pdfViewer.localeObj.getConstant('Redo'));
    }
    const ExtractPagesButton: HTMLElement = toolbarDiv.querySelector('#' + this.pdfViewer.element.id + '_extract_pages');
    if (!isNullOrUndefined(ExtractPagesButton)) {
        createTooltip.call(this, ExtractPagesButton, this.pdfViewer.localeObj.getConstant('Extract Pages'));
    }
    return contentDiv;
}

/**
 * @private
 * @param {boolean} isInitialCreation - It's describe about is initial creation or not.
 * @param {ItemModel[]} toolbarItems - It's describe about toolbar items.
 * @returns {void}
 */
export function addPageZoomDropDown(isInitialCreation: boolean, toolbarItems?: ItemModel[]): void {
    if (isInitialCreation) {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            const insertIndex: number = toolbarItems.findIndex((item: ItemModel) => item.id === this.pdfViewer.element.id + '_organize_more_button');
            toolbarItems.splice(insertIndex - 1, 0,
                // eslint-disable-next-line @typescript-eslint/indent
                { visible: this.pdfViewer.pageOrganizerSettings.showImageZoomingSlider, cssClass: 'e-pv-page-zoom', id: this.pdfViewer.element.id + '_page_zoom', align: 'Right' });
        }
        else {
            const insertIndex: number = toolbarItems.findIndex((item: ItemModel) => item.cssClass === 'e-pv-import-pages');
            toolbarItems.splice(insertIndex, 0, { type: 'Separator', align: 'Center' },
                // eslint-disable-next-line @typescript-eslint/indent
                { visible: true, cssClass: 'e-pv-page-zoom', id: this.pdfViewer.element.id + '_page_zoom', align: 'Center' });
        }
    }
    else {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            const insertIndex: number = this.toolbar.items.findIndex((item: ItemModel) => item.id === this.pdfViewer.element.id + '_page_zoom');
            if (insertIndex !== -1) {
                this.toolbar.hideItem(this.pdfViewerBase.getElement('_page_zoom').parentElement, false);
            }
        }
        else {
            const insertIndex: number = this.toolbar.items.findIndex((item: ItemModel) => item.cssClass === 'e-pv-import-pages');
            if (this.toolbar.items[insertIndex - 1].type !== 'Separator') {
                this.toolbar.addItems([{ type: 'Separator', align: 'Center' },
                    { visible: true, cssClass: 'e-pv-page-zoom', id: this.pdfViewer.element.id + '_page_zoom', align: 'Center' }], insertIndex);
            }
            else {
                this.toolbar
                    .addItems([{ visible: true, cssClass: 'e-pv-page-zoom', id: this.pdfViewer.element.id + '_page_zoom', align: 'Center' }], insertIndex);
            }
        }
        // Removes the margin left or margin right property of center group in page organizer toolbar
        this.toolbar.element.children[0].children[1].removeAttribute('style');
    }
}

/**
 * @private
 * @returns {void}
 */
export function createPageZoomDropDown(): void {
    this.pageZoomElement = this.pdfViewerBase.getElement('_page_zoom');
    this.pageZoomContainer = createPageZoomSlider.call(this, this.pageZoomElement.id);
    const dropDownButton: DropDownButton = new DropDownButton({ iconCss: 'e-pv-page-zoom-icon' + ' e-pv-icon e-icons', target: this.pageZoomContainer });
    if (this.pdfViewer.enableRtl) {
        dropDownButton.enableRtl = true;
    }
    dropDownButton.appendTo(this.pageZoomElement);
    createTooltip.call(this, this.pageZoomElement, this.pdfViewer.localeObj.getConstant('Change Page Zoom'));
    this.pageZoomElement.setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('Change Page Zoom'));
    this.pageZoomDropDown = dropDownButton;
    pageZoomWireEvents.call(this);
    pageZoomSliderWireEvents.call(this);
}

/**
 * @private
 * @param {HTMLElement} element - It's describe about element
 * @returns {void}
 */
export function shrinkElement(element: HTMLElement): void {
    const pdfViewerRect: DOMRect = this.pdfViewer.element.getBoundingClientRect() as DOMRect;
    const actualWidth: number = element.clientWidth;
    const decreasePercent: number = (actualWidth - pdfViewerRect.width) / actualWidth;
    const newHeight: number = element.clientHeight * (1 - decreasePercent);
    const newWidth: number = actualWidth * (1 - decreasePercent);
    element.style.width = newWidth + 'px';
    element.style.height = newHeight + 'px';
}

/**
 * @private
 * @param {HTMLElement} toolbarElement - It's describe about toolbar element
 * @returns {void}
 */
export function createImportDocElement(toolbarElement: HTMLElement): void {
    if (this.pdfViewer.pageOrganizerSettings.canImport) {
        if (toolbarElement) {
            this.importDocInputElement = createElement('input', { id: this.pdfViewer.element.id + '_importDocElement', styles: 'position:fixed; left:-100em', attrs: { 'type': 'file' } });
            this.importDocInputElement.setAttribute('accept', '.pdf');
            this.importDocInputElement.setAttribute('aria-label', 'import document element');
            this.importDocInputElement.setAttribute('tabindex', '-1');
            toolbarElement.appendChild(this.importDocInputElement);
        }
    }
    else {
        if (!isNullOrUndefined(this.importDocInputElement)) {
            if (this.importDocInputElement.parentElement && this.importDocInputElement.parentElement === toolbarElement) {
                toolbarElement.removeChild(this.importDocInputElement);
            }
            this.importDocInputElement = null;
        }
    }
}

/**
 * @private
 * @returns {void}
 */
export function enableDisableToolbarItems(): void {
    const isCopyDisabled: boolean = false;
    const isCopyRotateDisabled: boolean = false;
    if (!isNullOrUndefined(this.toolbar)) {
        this.toolbar.items.forEach((item: ItemModel) => {
            if (item.id === this.pdfViewer.element.id + '_rotate_page_left') {
                enableToolbarItem.call(this, item.id, ((this.selectAllCheckBox.checked || this.selectAllCheckBox.indeterminate) &&
                    this.pdfViewer.pageOrganizerSettings.canRotate) && !getImportedItems.call(this, isCopyRotateDisabled));
            }
            else if (item.id === this.pdfViewer.element.id + '_rotate_page_right') {
                enableToolbarItem.call(this, item.id, ((this.selectAllCheckBox.checked || this.selectAllCheckBox.indeterminate) &&
                    this.pdfViewer.pageOrganizerSettings.canRotate) && !getImportedItems.call(this, isCopyRotateDisabled));
            }
            else if (item.id === this.pdfViewer.element.id + '_copy_page') {
                enableToolbarItem.call(this, item.id, ((this.selectAllCheckBox.checked || this.selectAllCheckBox.indeterminate)
                    && this.pdfViewer.pageOrganizerSettings.canCopy && !getCopiedItems.call(this, isCopyDisabled) &&
                    !getImportedItems.call(this, isCopyRotateDisabled)));
            }
            else if (item.id === this.pdfViewer.element.id + '_delete_selected') {
                enableToolbarItem.call(this, item.id, this.selectAllCheckBox.indeterminate &&
                    this.pdfViewer.pageOrganizerSettings.canDelete);
            }
            else if (item.id === this.pdfViewer.element.id + '_import_pages') {
                enableToolbarItem.call(this, item.id, this.pdfViewer.pageOrganizerSettings.canImport);
            }
            else if (item.id === this.pdfViewer.element.id + '_extract_pages') {
                enableToolbarItem.call(this, item.id, this.pdfViewer.pageOrganizerSettings.canExtractPages &&
                    this.pdfViewerBase.clientSideRendering);
            }
        });
    }
}

/**
 * @private
 * @param {string} elementID - It's describe about toolbar element id.
 * @param {boolean} isEnable - It's describe about enable or disable the toolbar item.
 * @returns {void}
 */
export function enableToolbarItem(elementID: string, isEnable: boolean): void {
    const element: HTMLElement = document.getElementById(elementID);
    if (!isNullOrUndefined(element) && !isNullOrUndefined(element.parentElement)) {
        this.toolbar.enableItems(element.parentElement, isEnable);
        element.setAttribute('tabindex', isEnable ? '0' : '-1');
        element.setAttribute('data-tabindex', isEnable ? '0' : '-1');
    }
}

/**
 * @private
 * @returns {void}
 */
export function updateSelectAllCheckbox(): void {
    const totalCheckboxCount: number = this.tileAreaDiv.childElementCount;
    this.totalCheckedCount = this.tileAreaDiv.querySelectorAll('.e-pv-organize-node-selection-ring').length;
    if (this.selectAllCheckBox) {
        if (this.totalCheckedCount === 0) {
            this.selectAllCheckBox.indeterminate = false;
            this.selectAllCheckBox.checked = false;
        }
        else if (totalCheckboxCount === this.totalCheckedCount) {
            this.selectAllCheckBox.indeterminate = false;
            this.selectAllCheckBox.checked = true;
        }
        else {
            this.selectAllCheckBox.indeterminate = true;
        }
    }
}

/**
 * @private
 * @param {TooltipEventArgs} args - It's describe about event.
 * @returns {void}
 */
export function onTooltipBeforeOpen(args: TooltipEventArgs): void {
    if (!this.pdfViewer.toolbarSettings.showTooltip || (args.target as any).disabled) {
        args.cancel = true;
    }
}

/**
 * @private
 * @param {string} property - It's describe about toolbar item.
 * @returns {void}
 */
export function updateToolbarItemState(property?: string): void {
    if (!isNullOrUndefined(property)) {
        if (property === 'canImport') {
            if (this.pdfViewer.pageOrganizerSettings.canImport) {
                createImportDocElement.call(this, this.pdfViewerBase.getElement('_toolbar_appearance'));
                importDocWireEvent.call(this);
            }
            else {
                importDocUnWireEvent.call(this);
                createImportDocElement.call(this, this.pdfViewerBase.getElement('_toolbar_appearance'));
            }
        }
        enableDisableToolbarItems.call(this);
    }
    else {
        enableDisableToolbarItems.call(this);
    }
    updateTileButtons.call(this);
}
