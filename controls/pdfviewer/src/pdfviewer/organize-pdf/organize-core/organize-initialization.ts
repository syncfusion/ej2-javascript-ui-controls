import { createElement, Browser, isNullOrUndefined, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { createSpinner } from '../../base/spinner';
import { showSpinner, hideSpinner } from '../../base/spinner';
import { Tooltip, TooltipEventArgs, Dialog } from '@syncfusion/ej2-popups';
import { OrganizeDetails, PageOrganizerSettingsModel } from '../../index';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { importDocUnWireEvent, initEventListeners, removeEventListeners } from './organize-event-handler';
import { addPageZoomDropDown, createContentArea, createPageZoomDropDown, enableDisableToolbarItems, onTooltipBeforeOpen } from './organize-toolbar';
import { createMobileContextMenu } from './organize-contextmenu';
import { updateUndoRedoButtons } from './organize-undoredo';
import { disableTileDeleteButton, organizeWindowFocus } from './tile-interaction';
import { pageZoomSliderUnwireEvents, pageZoomUnWireEvents, handlePageZoomPopupMobile } from './slider-zoomaction';


/**
 * @private
 * @param { boolean } isReConstruct - It's describe about the organize window created or not for desktop mode.
 * @returns { void }
 */
export function createOrganizeWindow(isReConstruct?: boolean): void {
    const elementID: string = this.pdfViewer.element.id;
    if (!isNullOrUndefined(document.getElementById(elementID + '_organize_window')) && !isNullOrUndefined(this.organizeDialog)) {
        if (!this.isOrganizeWindowOpen) {
            this.organizeDialog.show(true);
            this.isOrganizeWindowOpen = true;
            this.pdfViewer.isPageOrganizerOpen = true;
        }
        return;
    }
    this.dialogDivElement = createElement('div', { id: elementID + '_organize_window', className: 'e-pv-organize-window' });
    const dialogDiv: HTMLElement = this.dialogDivElement;
    const contentRegion: HTMLElement = createContentArea.call(this);
    this.pdfViewerBase.mainContainer.appendChild(dialogDiv);
    this.organizeDialog = new Dialog({
        showCloseIcon: true,
        closeOnEscape: true,
        isModal: true,
        header: this.pdfViewer.localeObj.getConstant('Organize Pages'),
        target: this.pdfViewerBase.mainContainer,
        content: contentRegion,
        visible: false,
        open: () => {
            organizeWindowFocus.call(this);
        },
        close: (args: any) => {
            if (!this.isSkipRevert) {
                this.tempOrganizePagesCollection = JSON.parse(JSON.stringify(this.organizePagesCollection));
                this.undoOrganizeCollection = [];
                this.redoOrganizeCollection = [];
                this.isDocumentModified = false;
                this.pdfViewerBase.isImportDoc = false;
                this.startTile = null;
                this.ctrlKey = false;
                this.shiftKey = false;
                this.isTouchEvent = false;
                this.isClickedOnCheckBox = false;
                this.totalCheckedCount = 0;
                this.isOrganizeWindowOpen = false;
                destroyDialogWindow.call(this);
                this.pdfViewer.isPageOrganizerOpen = false;
                this.isExtractToolbarVisible = false;
                this.createOrganizeWindow(true);
            }
            else {
                this.isSkipRevert = false;
                this.isOrganizeWindowOpen = false;
                this.pdfViewer.isPageOrganizerOpen = false;
            }
        },
        created: (args: any) => {
            if (this.pdfViewer.pageOrganizerSettings.showImageZoomingSlider) {
                createPageZoomDropDown.call(this);
            }
        }
    });
    if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
        const pagecount: number = this.pdfViewerBase.pageCount;
        this.organizeDialog.buttons = [
            { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Save As'), isPrimary: true }, click: this.onSaveasClicked.bind(this) },
            { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Save'), isPrimary: true }, click: this.onSaveClicked.bind(this) },
            { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Total') + ' ' + pagecount.toString() + ' ' + this.pdfViewer.localeObj.getConstant('Pages'), cssClass: 'e-pv-organize-total-page-button', disabled: true } }
        ];
    }
    // Listen to window resize events to update the dialog size dynamically
    window.addEventListener('resize', () => {
        updateOrganizeDialogSize.call(this);
    });
    if (this.pdfViewer.enableRtl) {
        this.organizeDialog.enableRtl = true;
    }
    this.waitingPopup = createElement('div', { id: elementID + '_organizeLoadingIndicator' });
    dialogDiv.appendChild(this.waitingPopup);
    createSpinner({ target: this.waitingPopup, cssClass: 'e-spin-center' });
    this.pdfViewerBase.setLoaderProperties(this.waitingPopup);
    this.organizeDialog.appendTo(dialogDiv);
    if (!isReConstruct) {
        this.organizeDialog.show(true);
        this.isOrganizeWindowOpen = true;
        this.pdfViewer.isPageOrganizerOpen = true;
    }
    if (!this.pdfViewer.pageOrganizerSettings.showExtractPagesOption && this.pdfViewerBase.clientSideRendering &&
        Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
        this.showRemoveExtractIcon(false);
    }
    disableTileDeleteButton.call(this);
    enableDisableToolbarItems.call(this);
    updateUndoRedoButtons.call(this);
    initEventListeners.call(this);
}

/**
 * @private
 * @param { boolean } isReConstruct - It's describe about the organize window created or not for mobile mode.
 * @returns { void }
 */
export function createOrganizeWindowForMobile(isReConstruct?: boolean): void {
    const elementID: string = this.pdfViewer.element.id;
    if (!isNullOrUndefined(document.getElementById(elementID + '_organize_window')) && !isNullOrUndefined(this.organizeDialog)) {
        if (!this.isOrganizeWindowOpen) {
            this.organizeDialog.show(true);
            this.isOrganizeWindowOpen = true;
            this.pdfViewer.isPageOrganizerOpen = true;
        }
        return;
    }
    this.dialogDivElement = createElement('div', { id: elementID + '_organize_window', className: 'e-pv-organize-window' });
    const dialogDiv: HTMLElement = this.dialogDivElement;
    const contentRegion: HTMLElement = createContentArea.call(this);
    this.pdfViewerBase.mainContainer.appendChild(dialogDiv);
    this.organizeDialog = new Dialog({
        showCloseIcon: true,
        closeOnEscape: true,
        isModal: true,
        header: this.pdfViewer.localeObj.getConstant('Organize Pages'),
        target: this.pdfViewerBase.mainContainer,
        content: contentRegion,
        visible: false,
        animationSettings: { effect: 'None' },
        created: () => {
            if (this.pdfViewer.pageOrganizerSettings.showImageZoomingSlider) {
                createPageZoomDropDown.call(this);
            }
        },
        open: () => {
            this.toolbar.refreshOverflow();
            if (this.pdfViewer.pageOrganizerSettings.showImageZoomingSlider) {
                handlePageZoomPopupMobile.call(this);
            }
        },
        close: () => {
            if (!this.isSkipRevert) {
                this.tempOrganizePagesCollection = JSON.parse(JSON.stringify(this.organizePagesCollection));
                this.undoOrganizeCollection = [];
                this.redoOrganizeCollection = [];
                this.isDocumentModified = false;
                this.pdfViewerBase.isImportDoc = false;
                this.startTile = null;
                this.ctrlKey = false;
                this.shiftKey = false;
                this.isTouchEvent = false;
                this.isClickedOnCheckBox = false;
                this.isOrganizeWindowOpen = false;
                this.totalCheckedCount = 0;
                destroyDialogWindow.call(this);
                this.pdfViewer.isPageOrganizerOpen = false;
                this.createOrganizeWindowForMobile(true);
            }
            else {
                this.isSkipRevert = false;
                this.isOrganizeWindowOpen = false;
                this.pdfViewer.isPageOrganizerOpen = false;
            }
        }
    });
    if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
        const pagecount: number = this.pdfViewerBase.pageCount;
        this.organizeDialog.buttons = [
            { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Save As'), isPrimary: true }, click: this.onSaveasClicked.bind(this) },
            { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Save'), isPrimary: true }, click: this.onSaveClicked.bind(this) },
            { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Total') + ' ' + pagecount.toString() + ' ' + this.pdfViewer.localeObj.getConstant('Pages'), cssClass: 'e-pv-organize-total-page-button', disabled: true } }
        ];
    }
    // Listen to window resize events to update the dialog size dynamically
    window.addEventListener('resize', () => {
        updateOrganizeDialogSize.call(this);
    });
    if (this.pdfViewer.enableRtl) {
        this.organizeDialog.enableRtl = true;
    }
    this.waitingPopup = createElement('div', { id: elementID + '_organizeLoadingIndicator' });
    dialogDiv.appendChild(this.waitingPopup);
    createSpinner({ target: this.waitingPopup, cssClass: 'e-spin-center' });
    this.pdfViewerBase.setLoaderProperties(this.waitingPopup);
    this.organizeDialog.appendTo(dialogDiv);
    if (!isReConstruct) {
        this.organizeDialog.show(true);
        this.isOrganizeWindowOpen = true;
        this.pdfViewer.isPageOrganizerOpen = true;
    }
    createMobileContextMenu.call(this);
    disableTileDeleteButton.call(this);
    enableDisableToolbarItems.call(this);
    updateUndoRedoButtons.call(this);
    initEventListeners.call(this);
}

/**
 * @private
 * @param { pageOrganizerSettings } pageOrganizerSettings - It's describe about change the organize window properties.
 * @param { oldPageOrganizerSettings } oldPageOrganizerSettings - It's describe about previous organize window properties.
 * @returns { void }
 */

export function setPageOrganizerSettings(pageOrganizerSettings: PageOrganizerSettingsModel,
                                         oldPageOrganizerSettings: PageOrganizerSettingsModel): void {
    if (!isNullOrUndefined(pageOrganizerSettings)) {
        if (isNullOrUndefined(pageOrganizerSettings.canDelete)) {
            this.pdfViewer.pageOrganizerSettings.canDelete = true;
        }
        if (isNullOrUndefined(pageOrganizerSettings.canRotate)) {
            this.pdfViewer.pageOrganizerSettings.canRotate = true;
        }
        if (isNullOrUndefined(pageOrganizerSettings.canInsert)) {
            this.pdfViewer.pageOrganizerSettings.canInsert = true;
        }
        if (isNullOrUndefined(pageOrganizerSettings.canCopy)) {
            this.pdfViewer.pageOrganizerSettings.canCopy = true;
        }
        if (isNullOrUndefined(pageOrganizerSettings.canRearrange)) {
            this.pdfViewer.pageOrganizerSettings.canRearrange = true;
        }
        if (isNullOrUndefined(pageOrganizerSettings.canImport)) {
            this.pdfViewer.pageOrganizerSettings.canImport = true;
        }
        if (isNullOrUndefined(pageOrganizerSettings.showImageZoomingSlider)) {
            this.pdfViewer.pageOrganizerSettings.showImageZoomingSlider = false;
        }
        if (isNullOrUndefined(pageOrganizerSettings.imageZoomMin)) {
            this.pdfViewer.pageOrganizerSettings.imageZoomMin = 1;
        }
        if (isNullOrUndefined(pageOrganizerSettings.imageZoomMax)) {
            this.pdfViewer.pageOrganizerSettings.imageZoomMax = 5;
        }
        if (this.pdfViewer.pageOrganizerSettings.imageZoomMin >= this.pdfViewer.pageOrganizerSettings.imageZoomMax) {
            this.pdfViewer.pageOrganizerSettings.imageZoomMin = 1;
            this.pdfViewer.pageOrganizerSettings.imageZoomMax = 5;
        }
        if (this.pdfViewer.pageOrganizerSettings.imageZoomMin < 1 || this.pdfViewer.pageOrganizerSettings.imageZoomMin >= 5) {
            this.pdfViewer.pageOrganizerSettings.imageZoomMin = 1;
        }
        if (this.pdfViewer.pageOrganizerSettings.imageZoomMax > 5 || this.pdfViewer.pageOrganizerSettings.imageZoomMax <= 1) {
            this.pdfViewer.pageOrganizerSettings.imageZoomMax = 5;
        }
        const range: number = this.pdfViewer.pageOrganizerSettings.imageZoomMax - this.pdfViewer.pageOrganizerSettings.imageZoomMin;
        this.pageZoomSliderStep = range / 100;
        if (isNullOrUndefined(pageOrganizerSettings.imageZoom)) {
            this.pdfViewer.pageOrganizerSettings.imageZoom = this.pdfViewer.pageOrganizerSettings.imageZoomMin;
        }
        if (this.pdfViewer.pageOrganizerSettings.imageZoom > this.pdfViewer.pageOrganizerSettings.imageZoomMax) {
            this.pdfViewer.pageOrganizerSettings.imageZoom = this.pdfViewer.pageOrganizerSettings.imageZoomMax;
        }
        else if (this.pdfViewer.pageOrganizerSettings.imageZoom < this.pdfViewer.pageOrganizerSettings.imageZoomMin) {
            this.pdfViewer.pageOrganizerSettings.imageZoom = this.pdfViewer.pageOrganizerSettings.imageZoomMin;
        }
        if (!isNullOrUndefined(oldPageOrganizerSettings)) {
            if (!isNullOrUndefined(pageOrganizerSettings.showExtractPagesOption)) {
                this.pdfViewer.pageOrganizerSettings.showExtractPagesOption = pageOrganizerSettings.showExtractPagesOption;
            }
            else {
                this.pdfViewer.pageOrganizerSettings.showExtractPagesOption = oldPageOrganizerSettings.showExtractPagesOption;
            }
            if (!isNullOrUndefined(pageOrganizerSettings.canExtractPages)) {

                this.pdfViewer.pageOrganizerSettings.canExtractPages = pageOrganizerSettings.canExtractPages;

            }
            else {
                this.pdfViewer.pageOrganizerSettings.canExtractPages = oldPageOrganizerSettings.canExtractPages;
            }

        }
        else {
            if (isNullOrUndefined(pageOrganizerSettings.showExtractPagesOption)) {
                this.pdfViewer.pageOrganizerSettings.showExtractPagesOption = true;
            }
            if (isNullOrUndefined(pageOrganizerSettings.canExtractPages)) {
                this.pdfViewer.pageOrganizerSettings.canExtractPages = true;
            }
        }
    }
}

/**
 * @private
 * @returns { boolean } - It's describe about organize window rendered or not.
 */
export function isOrganizeDialogRendered(): boolean {
    if (!isNullOrUndefined(document.getElementById(this.pdfViewer.element.id + '_organize_window')) && !isNullOrUndefined(this.organizeDialog)) {
        return true;
    }
    return false;
}

/**
 * @private
 * @param { boolean } isShow - It's describe about show or hide the loading indicator in organize window.
 * @returns { void }
 */
export function showOrganizeLoadingIndicator(isShow: boolean): void {
    const waitingPopup: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_organizeLoadingIndicator');
    if (waitingPopup) {
        if (isShow) {
            waitingPopup.style.display = 'block';
            showSpinner(waitingPopup);
        } else {
            waitingPopup.style.display = 'none';
            hideSpinner(waitingPopup);
        }
    }
}

/**
 * @private
 * @returns { void }
 */
export function updateOrganizePageDetailsInViewer(): void {
    for (const pageDetail of this.organizePagesCollection) {
        const pageIndex: number = pageDetail.pageIndex;
        const rotateAngle: number = pageDetail.rotateAngle;
        let pageSizeDetails: any;
        if (pageIndex !== -1) {
            pageSizeDetails = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
        }
        else {
            pageSizeDetails = this.pdfViewerBase.pageSize[parseInt(pageDetail.copiedPageIndex.toString(), 10)];
        }
        const pageWidth: any = pageSizeDetails.width * this.pdfViewerBase.getZoomFactor();
        const pageHeight: any = pageSizeDetails.height * this.pdfViewerBase.getZoomFactor();
        const pageTop: number = pageSizeDetails.top * this.pdfViewerBase.getZoomFactor();
        // Find the corresponding pageDiv using pageIndex
        const pageDiv: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + pageIndex);
        const pageCanvas: HTMLImageElement = this.pdfViewerBase.getElement('_pageCanvas_' + pageIndex) as HTMLImageElement;
        if (pageDiv && pageCanvas) {
            pageDiv.style.width = pageWidth + 'px';
            pageDiv.style.height = pageHeight + 'px';
            if (this.pdfViewer.enableRtl) {
                pageDiv.style.right = this.pdfViewerBase.updateLeftPosition(pageIndex) + 'px';
            } else {
                pageDiv.style.left = this.pdfViewerBase.updateLeftPosition(pageIndex) + 'px';
            }
            pageDiv.style.top = pageTop + 'px';
            this.pdfViewerBase.pageContainer.style.width = (this.pdfViewerBase.isMixedSizeDocument && (this.pdfViewerBase.highestWidth * this.pdfViewerBase.getZoomFactor()) > this.pdfViewerBase.viewerContainer.clientWidth) ? (this.pdfViewerBase.highestWidth * this.pdfViewerBase.getZoomFactor()) + 'px' : this.pdfViewerBase.viewerContainer.clientWidth + 'px';
            // Update the width and height for div
            if (rotateAngle === 90 || rotateAngle === 270) {
                const swapWidth: string = pageDiv.style.width;
                pageDiv.style.width = pageDiv.style.height;
                pageDiv.style.height = swapWidth;
            } else {
                pageDiv.style.width = '';
                pageDiv.style.height = '';
            }
            pageDiv.style.left = (this.pdfViewerBase.viewerContainer.clientWidth - (parseInt(pageDiv.style.width, 10) * this.pdfViewerBase.getZoomFactor())) / 2 + 'px';

            // Apply rotation to the canvas
            pageCanvas.style.transform = `rotate(${rotateAngle}deg)`;
            if (rotateAngle === 90 || rotateAngle === 270) {
                const swap: number = pageCanvas.width;
                pageCanvas.style.width = `${pageCanvas.height}px`;
                pageCanvas.width = pageCanvas.height;
                pageCanvas.style.height = `${swap}px`;
                pageCanvas.height = swap;
                pageCanvas.style.margin = '0px';
                // Adjust margins to center the rotated canvas
                pageCanvas.style.marginLeft = `${(pageCanvas.height - pageCanvas.width) / 2}px`;
                pageCanvas.style.marginTop = `${(pageCanvas.width - pageCanvas.height) / 2}px`;
            }
            else {
                // Reset margins if not rotated by 90 or 270 degrees
                pageCanvas.style.margin = '0px';
            }
            this.applyElementStyles(pageCanvas, pageIndex);
        }
    }
}

/**
 * @private
 * @param { HTMLElement } toolbarItem - It's describe about toolbar item in organize window.
 * @param { string } tooltipText - It's describe about tooltipText for toolbar item in organize window.
 * @returns { void }
 */
export function createTooltip(toolbarItem: HTMLElement, tooltipText: string): void {
    if (tooltipText !== null) {
        const tooltip: Tooltip = new Tooltip({
            content: initializeCSPTemplate(
                function (): string { return tooltipText; }
            ), opensOn: 'Hover', beforeOpen: onTooltipBeforeOpen.bind(this)
        });
        tooltip.appendTo(toolbarItem);
    }
}

/**
 * @private
 * @returns { void }
 */
export function switchPageOrganizer(): void {
    if (!isNullOrUndefined(this.pdfViewer.pageOrganizer)) {
        if (!isNullOrUndefined(this.organizeDialog) && this.organizeDialog.visible) {
            this.closePageOrganizer();
        } else {
            this.openPageOrganizer();
        }
    }
}

/**
 * @private
 * @param { boolean } showImageZoomingSlider - It's describe about show or hide zooming slider in organize toolbar.
 * @returns { void }
 */
export function handleImageResizerVisibility(showImageZoomingSlider: boolean): void {
    if (!isOrganizeDialogRendered.call(this)) {
        return;
    }
    if (isNullOrUndefined(showImageZoomingSlider) || !showImageZoomingSlider) {
        const resizerIndex: number = this.toolbar.items.findIndex(
            (item: ItemModel) => item.id === this.pdfViewer.element.id + '_page_zoom');
        if (resizerIndex !== -1) {
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.toolbar.hideItem(this.pdfViewerBase.getElement('_page_zoom').parentElement, true);
            }
            else {
                this.toolbar.removeItems(this.pdfViewerBase.getElement('_page_zoom').parentElement);
            }
            if (!isNullOrUndefined(this.pageZoomSlider)) {
                pageZoomSliderUnwireEvents.call(this);
                this.pageZoomSlider.destroy();
                this.pageZoomSlider = null;
            }
            if (!isNullOrUndefined(this.pageZoomDropDown)) {
                pageZoomUnWireEvents.call(this);
                this.pageZoomDropDown.destroy();
                this.pageZoomDropDown = null;
            }
            if (!isNullOrUndefined(this.pageZoomIncreaseButton)) {
                this.pageZoomIncreaseButton = null;
            }
            if (!isNullOrUndefined(this.pageZoomDecreaseButton)) {
                this.pageZoomDecreaseButton = null;
            }
            // Removes the margin left or margin right property of center group in page organizer toolbar
            this.toolbar.element.children[0].children[1].removeAttribute('style');
        }
    }
    else {
        const pageZoomIndex: number = this.toolbar.items.findIndex(
            (item: ItemModel) => item.id === this.pdfViewer.element.id + '_page_zoom');
        if (pageZoomIndex === -1 || (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
            addPageZoomDropDown.call(this, false);
            createPageZoomDropDown.call(this);
        }
    }
    if (this.isOrganizeWindowOpen) {
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && showImageZoomingSlider) {
            this.toolbar.refreshOverflow();
            handlePageZoomPopupMobile.call(this);
        }
    }
}

/**
 * @private
 * @returns { void }
 */
export function destroyDialogWindow(): void {
    removeEventListeners.call(this);
    this.isOrganizeWindowOpen = false;
    if (!isNullOrUndefined(this.pageZoomSlider)) {
        pageZoomSliderUnwireEvents.call(this);
        this.pageZoomSlider.destroy();
        this.pageZoomSlider = null;
    }
    if (!isNullOrUndefined(this.pageZoomDropDown)) {
        pageZoomUnWireEvents.call(this);
        this.pageZoomDropDown.destroy();
        this.pageZoomDropDown = null;
    }
    if (!isNullOrUndefined(this.organizeDialog)) {
        importDocUnWireEvent.call(this);
        this.organizeDialog.destroy();
        this.organizeDialog = null;
    }
    const dialogElement: HTMLElement = this.pdfViewerBase.getElement('_organize_window');
    if (!isNullOrUndefined(dialogElement)) {
        dialogElement.parentElement.removeChild(dialogElement);
    }
    const pageZoomPopup: HTMLElement = this.pdfViewerBase.getElement('_page_zoom-popup');
    if (!isNullOrUndefined(pageZoomPopup)) {
        pageZoomPopup.parentElement.removeChild(pageZoomPopup);
    }
}

/**
 * @private
 * @returns { void }
 */
export function clear(): void {
    if (!isNullOrUndefined(this.pdfViewerBase.navigationPane)) {
        this.pdfViewerBase.navigationPane.enableOrganizeButton(false);
    }
    if (!isNullOrUndefined(this.pdfViewer.toolbar)) {
        this.pdfViewer.toolbar.enableToolbarItem(['OrganizePagesTool'], false);
    }
    destroyDialogWindow.call(this);
    this.organizePagesCollection = [];
    this.tempOrganizePagesCollection = [];
    this.undoOrganizeCollection = [];
    this.redoOrganizeCollection = [];
    this.isDocumentModified = false;
    this.pdfViewerBase.isImportDoc = false;
    this.mobileContextMenu = [];
    this.dataDetails = [];
    this.isInitialLoading = true;
    this.isPageZoomPopupOpen = false;
    this.lastRequestedPageIndex = 0;
    this.previouslyRequestedImageZoom = Math.round(this.currentPageZoomSliderValue);
    this.isAllImagesReceived = false;
}

/**
 * @private
 * @param { any } pageCanvas - It's describe about page canvas.
 * @param { pageNumber } pageNumber - It's describe about page number.
 * @returns { void }
 */
export function applyElementStyles(pageCanvas: any, pageNumber: number): void {
    if (pageCanvas) {
        const canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageNumber);
        const oldCanvas: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_oldCanvas_' + pageNumber);
        if (canvasElement && canvasElement.offsetLeft > 0) {
            // Update marginLeft, marginRight, and top positions
            const offsetLeft: number = canvasElement.offsetLeft;
            const offsetTop: number = canvasElement.offsetTop;
            pageCanvas.style.marginLeft = offsetLeft + 'px';
            pageCanvas.style.marginRight = offsetLeft + 'px';
            pageCanvas.style.top = offsetTop + 'px';
        } else if (oldCanvas && oldCanvas.offsetLeft > 0) {
            // Update marginLeft, marginRight, and top positions using oldCanvas
            const offsetLeft: number = oldCanvas.offsetLeft;
            const offsetTop: number = oldCanvas.offsetTop;
            pageCanvas.style.marginLeft = offsetLeft + 'px';
            pageCanvas.style.marginRight = offsetLeft + 'px';
            pageCanvas.style.top = offsetTop + 'px';
        } else {
            // Reset the positions
            pageCanvas.style.marginLeft = 'auto';
            pageCanvas.style.marginRight = 'auto';
            pageCanvas.style.top = 'auto';
        }
    }
}

/**
 * @private
 * @returns { void }
 */
export function updateOrganizeDialogSize(): void {
    // Update the dialog size based on the viewer container size
    const dialogWidth: number = this.pdfViewer.element.getBoundingClientRect().width;
    const dialogHeight: number = this.pdfViewer.element.getBoundingClientRect().height;
    if (!isNullOrUndefined(this.organizeDialog)) {
        this.organizeDialog.width = `${dialogWidth}px`;
        this.organizeDialog.height = `${dialogHeight}px`;
    }
}

/**
 * @private
 * @param { MouseEvent | TouchEvent} event - It's describe about mouse or touch event.
 * @returns { void }
 */
export function handleImageContainerClick(event: MouseEvent | TouchEvent): void {
    const anchorNode: any = (event.target as HTMLElement).closest('.e-pv-organize-anchor-node');
    const nearestCheckBox: any = anchorNode.querySelector('.e-pv-organize-tile-checkbox.e-control.e-checkbox.e-lib');
    if (event instanceof PointerEvent) {
        if (event.pointerType === 'touch') {
            this.isTouchEvent = true;
        } else if (event.pointerType === 'mouse') {
            this.isTouchEvent = false;
        }
    } else if (!(this.pdfViewerBase.isMacSafari) && event instanceof TouchEvent) {
        this.isTouchEvent = true;
    } else if (event instanceof MouseEvent) {
        this.isTouchEvent = false;
    }
    if (nearestCheckBox && !isNullOrUndefined(nearestCheckBox) &&
        !isNullOrUndefined((nearestCheckBox as any).ej2_instances) && (nearestCheckBox as any).ej2_instances.length > 0) {
        (nearestCheckBox as any).ej2_instances[0].click();
    }
}

/**
 * @private
 * @returns { void }
 */
export function addSelectionRingStyle(): void {
    const anchorElements: any = this.tileAreaDiv.querySelectorAll('.e-pv-organize-anchor-node');
    for (let i: number = 0; i < this.selectedPageIndexes.length; i++) {
        anchorElements[this.selectedPageIndexes[parseInt(i.toString(), 10)]].classList.add('e-pv-dragging-style');
    }
}

/**
 * @private
 * @returns { void }
 */
export function removeSelectionRingStyle(): void {
    const anchorElements: any = this.tileAreaDiv.querySelectorAll('.e-pv-organize-anchor-node');
    for (let i: number = 0; i < this.selectedPageIndexes.length; i++) {
        anchorElements[this.selectedPageIndexes[parseInt(i.toString(), 10)]].classList.remove('e-pv-dragging-style');
    }
}

/**
 * @private
 * @returns { void }
 */
export function updatePageDetail(): void {
    updateTotalPageCount.call(this);
    updatePageNumber.call(this);
}

/**
 * @private
 * @returns { void }
 */
export function updateTotalPageCount(): void {
    const totalPages: number = document.querySelectorAll('.e-pv-organize-anchor-node').length;
    const totalPageNumberElement: Element = document.querySelector('.e-pv-organize-total-page-button');
    if (!isNullOrUndefined(totalPageNumberElement)) {
        (totalPageNumberElement as HTMLElement).textContent = this.pdfViewer.localeObj.getConstant('Total') + ' ' + totalPages.toString() + ' ' + this.pdfViewer.localeObj.getConstant('Pages');
    }
}

/**
 * @private
 * @returns { void }
 */
export function updatePageNumber(): void {
    const totalPages: any = document.querySelectorAll('.e-pv-organize-anchor-node');
    totalPages.forEach((element: any) => {
        const pageOrder: number = parseInt(element.getAttribute('data-page-order'), 10);
        const thumbnailPageNumber: HTMLElement = element.querySelector('.e-pv-tile-number') as HTMLElement;
        if (thumbnailPageNumber) {
            const currentPageNumber: OrganizeDetails = this.tempOrganizePagesCollection.
                find((item: OrganizeDetails) => { return item.currentPageIndex === pageOrder; });
            if (currentPageNumber.isImportedDoc) {
                thumbnailPageNumber.textContent = currentPageNumber.documentName;
                const pageNumberTooltip: Tooltip = new Tooltip({
                    content: initializeCSPTemplate(function (): any { return thumbnailPageNumber.textContent; }, this), opensOn: 'Hover', beforeOpen: onTooltipBeforeOpen.bind(this)
                });
                pageNumberTooltip.appendTo(thumbnailPageNumber);
            }
            else {
                thumbnailPageNumber.textContent = (pageOrder + 1).toString();
            }
        }
    });
    organizeWindowFocus.call(this);
}
