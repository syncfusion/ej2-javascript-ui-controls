import { createElement, Browser } from '@syncfusion/ej2-base';
import { Toolbar as tool, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { ComboBox, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { PdfViewer, PdfViewerBase } from '../index';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { DropDownButton, ItemModel, OpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ToolbarItem } from '../base/types';

/**
 * Toolbar module
 */
export class Toolbar {
    private toolbar: tool;
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private currentPageBox: NumericTextBox;
    private zoomDropDown: ComboBox;
    private currentPageBoxElement: HTMLElement;
    /** 
     * @private
     */
    public uploadedDocumentName: string;
    private toolbarElement: HTMLElement;
    private itemsContainer: HTMLElement;
    private openDocumentItem: HTMLElement;
    private firstPageItem: HTMLElement;
    private previousPageItem: HTMLElement;
    private nextPageItem: HTMLElement;
    private lastPageItem: HTMLElement;
    private zoomInItem: HTMLElement;
    private zoomOutItem: HTMLElement;
    private totalPageItem: HTMLElement;
    private downloadItem: HTMLElement;
    private zoomDropdownItem: HTMLElement;
    private fileInputElement: HTMLElement;
    private textSelectItem: HTMLElement;
    private panItem: HTMLElement;
    private printItem: HTMLElement;
    private textSearchItem: HTMLElement;
    private moreOptionItem: HTMLElement;
    /** 
     * @private
     */
    public moreDropDown: DropDownButton;
    private isPageNavigationToolDisabled: boolean = false;
    private isMagnificationToolDisabled: boolean = false;
    private isSelectionToolDisabled: boolean = false;
    private isScrollingToolDisabled: boolean = false;
    private isOpenBtnVisible: boolean = true;
    private isNavigationToolVisible: boolean = true;
    private isMagnificationToolVisible: boolean = true;
    private isSelectionBtnVisible: boolean = true;
    private isScrollingBtnVisible: boolean = true;
    private isDownloadBtnVisible: boolean = true;
    private isPrintBtnVisible: boolean = true;
    private isSearchBtnVisible: boolean = true;
    private isTextSearchBoxDisplayed: boolean = false;

    /**
     * @private
     */
    constructor(viewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
    }
    /** 
     * @private
     */
    public intializeToolbar(width: string): HTMLElement {
        let toolbarDiv: HTMLElement = this.createToolbar(width);
        // tslint:disable-next-line
        let isIE: boolean = !!(document as any).documentMode;
        if (isIE) {
            this.totalPageItem.classList.add('e-pv-total-page-ms');
        }
        this.createFileElement(toolbarDiv);
        this.wireEvent();
        this.updateToolbarItems();
        if (!Browser.isDevice) {
            this.applyToolbarSettings();
            this.initialEnableItems();
        }
        return toolbarDiv;
    }
    /**
     * Shows /hides the toolbar in the PdfViewer
     * @param  {boolean} enableToolbar - If set true , its show the Toolbar
     * @returns void
     */
    public showToolbar(enableToolbar: boolean): void {
        let toolbar: HTMLElement = this.toolbarElement;
        if (enableToolbar) {
            toolbar.style.display = 'block';
        } else {
            toolbar.style.display = 'none';
            if (!Browser.isDevice) {
                this.pdfViewerBase.navigationPane.sideBarToolbar.style.display = 'none';
            }
        }
    }
    /**
     * Shows /hides the the toolbar items in the PdfViewer
     * @param  {string[]} items - Defines the toolbar items in the toolbar
     * @param  {boolean} isVisible - If set true, then its show the toolbar Items
     * @returns void
     */
    public showToolbarItem(items: ToolbarItem[], isVisible: boolean): void {
        for (let i: number = 0; i < items.length; i++) {
            switch (items[i]) {
                case 'OpenOption':
                    this.showOpenOption(isVisible);
                    break;
                case 'PageNavigationTool':
                    this.showPageNavigationTool(isVisible);
                    break;
                case 'MagnificationTool':
                    this.showMagnificationTool(isVisible);
                    break;
                case 'SelectionTool':
                    this.showSelectionTool(isVisible);
                    break;
                case 'PanTool':
                    this.showScrollingTool(isVisible);
                    break;
                case 'DownloadOption':
                    this.showDownloadOption(isVisible);
                    break;
                case 'PrintOption':
                    this.showPrintOption(isVisible);
                    break;
                case 'SearchOption':
                    this.showSearchOption(isVisible);
                    break;
            }
        }
        this.applyHideToToolbar(true, 1, 1);
        this.applyHideToToolbar(true, 8, 8);
        this.applyHideToToolbar(true, 12, 12);
        this.showSeparator(items);
    }

    /**
     * Enables /disables the the toolbar items in the PdfViewer
     * @param  {string[]} items - Defines the toolbar items in the toolbar
     * @param  {boolean} isEnable - If set true, then its Enable the toolbar Items
     * @returns void
     */
    public enableToolbarItem(items: ToolbarItem[], isEnable: boolean): void {
        for (let i: number = 0; i < items.length; i++) {
            switch (items[i]) {
                case 'OpenOption':
                    this.enableOpenOption(isEnable);
                    break;
                case 'PageNavigationTool':
                    this.isPageNavigationToolDisabled = isEnable;
                    this.enablePageNavigationTool(isEnable);
                    break;
                case 'MagnificationTool':
                    this.isMagnificationToolDisabled = isEnable;
                    this.enableMagnificationTool(isEnable);
                    break;
                case 'SelectionTool':
                    this.isSelectionToolDisabled = isEnable;
                    this.enableSelectionTool(isEnable);
                    break;
                case 'PanTool':
                    this.isScrollingToolDisabled = isEnable;
                    this.enableScrollingTool(isEnable);
                    break;
                case 'DownloadOption':
                    this.enableDownloadOption(isEnable);
                    break;
                case 'PrintOption':
                    this.enablePrintOption(isEnable);
                    break;
                case 'SearchOption':
                    this.enableSearchOption(isEnable);
                    break;
            }
        }
    }

    private showOpenOption(enableOpenOption: boolean): void {
        this.isOpenBtnVisible = enableOpenOption;
        this.applyHideToToolbar(enableOpenOption, 0, 0);
    }

    private showPageNavigationTool(enablePageNavigationTool: boolean): void {
        this.isNavigationToolVisible = enablePageNavigationTool;
        this.applyHideToToolbar(enablePageNavigationTool, 2, 7);
    }

    private showMagnificationTool(enableMagnificationTool: boolean): void {
        this.isMagnificationToolVisible = enableMagnificationTool;
        this.applyHideToToolbar(enableMagnificationTool, 9, 11);
    }

    private showSelectionTool(enableSelectionTool: boolean): void {
        this.isSelectionBtnVisible = enableSelectionTool;
        this.applyHideToToolbar(enableSelectionTool, 13, 13);
    }

    private showScrollingTool(enableScrollingTool: boolean): void {
        this.isScrollingBtnVisible = enableScrollingTool;
        this.applyHideToToolbar(enableScrollingTool, 14, 14);
    }

    private showDownloadOption(enableDownloadOption: boolean): void {
        this.isDownloadBtnVisible = enableDownloadOption;
        this.applyHideToToolbar(enableDownloadOption, 16, 16);
    }

    private showPrintOption(enablePrintOption: boolean): void {
        this.isPrintBtnVisible = enablePrintOption;
        this.applyHideToToolbar(enablePrintOption, 17, 17);
    }

    private showSearchOption(enableSearchOption: boolean): void {
        this.isSearchBtnVisible = enableSearchOption;
        this.applyHideToToolbar(enableSearchOption, 15, 15);
    }

    private enableOpenOption(enableOpenOption: boolean): void {
        this.toolbar.enableItems(this.openDocumentItem.parentElement, enableOpenOption);
    }

    private enablePageNavigationTool(enablePageNavigationTool: boolean): void {
        this.toolbar.enableItems(this.firstPageItem.parentElement, enablePageNavigationTool);
        this.toolbar.enableItems(this.previousPageItem.parentElement, enablePageNavigationTool);
        this.toolbar.enableItems(this.nextPageItem.parentElement, enablePageNavigationTool);
        this.toolbar.enableItems(this.lastPageItem.parentElement, enablePageNavigationTool);
        this.currentPageBox.readonly = !enablePageNavigationTool;
    }

    private enableMagnificationTool(enableMagnificationTool: boolean): void {
        this.toolbar.enableItems(this.zoomInItem.parentElement, enableMagnificationTool);
        this.toolbar.enableItems(this.zoomOutItem.parentElement, enableMagnificationTool);
        this.zoomDropDown.readonly = !enableMagnificationTool;
    }

    private enableSelectionTool(enableSelectionTool: boolean): void {
        this.toolbar.enableItems(this.textSelectItem.parentElement, enableSelectionTool);
    }

    private enableScrollingTool(enableScrollingTool: boolean): void {
        this.toolbar.enableItems(this.panItem.parentElement, enableScrollingTool);
    }

    private enableDownloadOption(enableDownloadOption: boolean): void {
        this.toolbar.enableItems(this.downloadItem.parentElement, enableDownloadOption);
    }

    private enablePrintOption(enablePrintOption: boolean): void {
        this.toolbar.enableItems(this.printItem.parentElement, enablePrintOption);
    }

    private enableSearchOption(enableSearchOption: boolean): void {
        this.toolbar.enableItems(this.textSearchItem.parentElement, enableSearchOption);
    }
    /** 
     * @private
     */
    public resetToolbar(): void {
        if (!Browser.isDevice) {
            this.currentPageBox.min = 0;
            this.currentPageBox.value = 0;
            this.updateTotalPage();
            this.updateToolbarItems();
        }
    }
    /** 
     * @private
     */
    public updateToolbarItems(): void {
        if (!Browser.isDevice) {
            if (this.pdfViewerBase.pageCount === 0) {
                this.toolbar.enableItems(this.downloadItem.parentElement, false);
                this.toolbar.enableItems(this.printItem.parentElement, false);
                this.updateNavigationButtons();
                this.toolbar.enableItems(this.zoomInItem.parentElement, false);
                this.toolbar.enableItems(this.zoomOutItem.parentElement, false);
                if (this.pdfViewer.magnificationModule) {
                    this.zoomDropDown.readonly = true;
                }
                this.toolbar.enableItems(this.pdfViewerBase.getElement('_currentPageInputContainer'), false);
                this.toolbar.enableItems(this.pdfViewerBase.getElement('_zoomDropDownContainer'), false);
                this.toolbar.enableItems(this.textSelectItem.parentElement, false);
                this.toolbar.enableItems(this.panItem.parentElement, false);
                this.toolbar.enableItems(this.textSearchItem.parentElement, false);
            } else if (this.pdfViewerBase.pageCount > 0) {
                this.toolbar.enableItems(this.downloadItem.parentElement, true);
                this.toolbar.enableItems(this.printItem.parentElement, true);
                this.toolbar.enableItems(this.pdfViewerBase.getElement('_currentPageInputContainer'), true);
                this.toolbar.enableItems(this.pdfViewerBase.getElement('_zoomDropDownContainer'), true);
                this.updateNavigationButtons();
                this.updateZoomButtons();
                if (this.pdfViewer.magnificationModule) {
                    this.zoomDropDown.readonly = false;
                }
                this.updateInteractionItems();
                if (this.pdfViewer.textSearchModule && this.pdfViewer.enableTextSearch) {
                    this.toolbar.enableItems(this.textSearchItem.parentElement, true);
                }
            }
        } else {
            if (this.pdfViewerBase.pageCount === 0) {
                this.toolbar.enableItems(this.textSearchItem.parentElement, false);
                this.toolbar.enableItems(this.moreOptionItem.parentElement, false);
            } else if (this.pdfViewerBase.pageCount > 0) {
                this.toolbar.enableItems(this.textSearchItem.parentElement, true);
                this.toolbar.enableItems(this.moreOptionItem.parentElement, true);
            }
        }
    }
    /** 
     * @private
     */
    public updateNavigationButtons(): void {
        if (this.pdfViewer.navigationModule && !this.isPageNavigationToolDisabled) {
            if (this.pdfViewerBase.pageCount === 0 || (this.pdfViewerBase.currentPageNumber === 1 && this.pdfViewerBase.pageCount === 1)) {
                this.toolbar.enableItems(this.firstPageItem.parentElement, false);
                this.toolbar.enableItems(this.previousPageItem.parentElement, false);
                this.toolbar.enableItems(this.nextPageItem.parentElement, false);
                this.toolbar.enableItems(this.lastPageItem.parentElement, false);
            } else if (this.pdfViewerBase.currentPageNumber === 1 && this.pdfViewerBase.pageCount > 0) {
                this.toolbar.enableItems(this.firstPageItem.parentElement, false);
                this.toolbar.enableItems(this.previousPageItem.parentElement, false);
                this.toolbar.enableItems(this.nextPageItem.parentElement, true);
                this.toolbar.enableItems(this.lastPageItem.parentElement, true);
            } else if (this.pdfViewerBase.currentPageNumber === this.pdfViewerBase.pageCount && this.pdfViewerBase.pageCount > 0) {
                this.toolbar.enableItems(this.firstPageItem.parentElement, true);
                this.toolbar.enableItems(this.previousPageItem.parentElement, true);
                this.toolbar.enableItems(this.nextPageItem.parentElement, false);
                this.toolbar.enableItems(this.lastPageItem.parentElement, false);
            } else if (this.pdfViewerBase.currentPageNumber > 1 && this.pdfViewerBase.currentPageNumber < this.pdfViewerBase.pageCount) {
                this.toolbar.enableItems(this.firstPageItem.parentElement, true);
                this.toolbar.enableItems(this.previousPageItem.parentElement, true);
                this.toolbar.enableItems(this.nextPageItem.parentElement, true);
                this.toolbar.enableItems(this.lastPageItem.parentElement, true);
            }
        } else {
            this.toolbar.enableItems(this.firstPageItem.parentElement, false);
            this.toolbar.enableItems(this.previousPageItem.parentElement, false);
            this.toolbar.enableItems(this.nextPageItem.parentElement, false);
            this.toolbar.enableItems(this.lastPageItem.parentElement, false);
            this.currentPageBox.readonly = true;
        }
    }
    /** 
     * @private
     */
    public updateZoomButtons(): void {
        if (this.pdfViewer.magnificationModule && !this.isMagnificationToolDisabled && !Browser.isDevice) {
            if (this.pdfViewer.magnificationModule.zoomFactor <= 0.5) {
                this.toolbar.enableItems(this.zoomInItem.parentElement, true);
                this.toolbar.enableItems(this.zoomOutItem.parentElement, false);
            } else if (this.pdfViewer.magnificationModule.zoomFactor >= 4) {
                this.toolbar.enableItems(this.zoomInItem.parentElement, false);
                this.toolbar.enableItems(this.zoomOutItem.parentElement, true);
            } else {
                this.toolbar.enableItems(this.zoomInItem.parentElement, true);
                this.toolbar.enableItems(this.zoomOutItem.parentElement, true);
            }
        }
    }
    /** 
     * @private
     */
    public destroy(): void {
        this.unWireEvent();
        if (this.moreDropDown) {
            this.moreDropDown.destroy();
        }
        this.toolbar.destroy();
        this.toolbarElement.remove();
    }
    /** 
     * @private
     */
    public updateCurrentPage(pageIndex: number): void {
        if (!Browser.isDevice) {
            if (this.currentPageBox.value === pageIndex) {
                (this.currentPageBoxElement as HTMLInputElement).value = pageIndex.toString();
            }
            this.currentPageBox.value = pageIndex;
        } else {
            this.pdfViewerBase.mobileSpanContainer.innerHTML = pageIndex.toString();
            this.pdfViewerBase.mobilecurrentPageContainer.innerHTML = pageIndex.toString();
        }
        this.pdfViewerBase.currentPageNumber = pageIndex;
    }
    /** 
     * @private
     */
    public updateTotalPage(): void {
        if (!Browser.isDevice) {
            if (this.pdfViewerBase.pageCount > 0) {
                this.currentPageBox.min = 1;
            }
            this.totalPageItem.textContent = 'of ' + this.pdfViewerBase.pageCount.toString();
        }
    }

    /**
     * @private
     */
    public openFileDialogBox(event: Event): void {
        event.preventDefault();
        this.fileInputElement.click();
    }

    private createToolbar(controlWidth: string | number): HTMLElement {
        // tslint:disable-next-line:max-line-length
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_toolbarContainer', className: 'e-pv-toolbar' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
        if (!Browser.isDevice) {
            this.itemsContainer = createElement('div', { id: this.pdfViewer.element.id + '_toolbarItemsContainer' });
            this.itemsContainer.style.position = 'absolute';
            this.toolbarElement.appendChild(this.itemsContainer);
            this.createToolbarItemsGeneral();
            this.toolbar = new tool({ clicked: this.toolbarClickHandler, width: '', height: '', overflowMode: 'Popup' });
            if (this.pdfViewer.enableRtl) {
                this.toolbar.enableRtl = true;
            }
            this.toolbar.appendTo(this.toolbarElement);
            this.toolbarElement.addEventListener('keydown', this.onToolbarKeydown);
        } else {
            this.createToolbarItemsForMobile();
        }
        return this.toolbarElement;
    }

    private createToolbarItemsGeneral(): void {
        // tslint:disable-next-line:max-line-length
        let openButtonContainer: HTMLElement = this.createToolbarItem('button', this.pdfViewer.element.id + '_open', this.pdfViewer.localeObj.getConstant('Open'), 'e-pv-open-document');
        this.openDocumentItem = openButtonContainer.firstChild as HTMLElement;
        this.itemsContainer.appendChild(openButtonContainer);
        let seperatorDiv1: HTMLElement = createElement('div', { className: 'e-separator' });
        this.itemsContainer.appendChild(seperatorDiv1);
        this.createToolbarNavigationItems();
        let seperatorDiv2: HTMLElement = createElement('div', { className: 'e-separator' });
        this.itemsContainer.appendChild(seperatorDiv2);
        this.createToolbarMagnificationItems();
        let seperatorDiv3: HTMLElement = createElement('div', { className: 'e-separator' });
        this.itemsContainer.appendChild(seperatorDiv3);
        // tslint:disable-next-line:max-line-length
        let selectToolContainer: HTMLElement = this.createToolbarItem('button', this.pdfViewer.element.id + '_selectTool', this.pdfViewer.localeObj.getConstant('Text Selection'), 'e-pv-text-select-tool');
        this.textSelectItem = selectToolContainer.firstChild as HTMLElement;
        this.itemsContainer.appendChild(selectToolContainer);
        // tslint:disable-next-line:max-line-length
        let handToolContainer: HTMLElement = this.createToolbarItem('button', this.pdfViewer.element.id + '_handTool', this.pdfViewer.localeObj.getConstant('Panning'), 'e-pv-pan-tool');
        this.panItem = handToolContainer.firstChild as HTMLElement;
        this.itemsContainer.appendChild(handToolContainer);
        // tslint:disable-next-line:max-line-length
        let searchButtonContainer: HTMLElement = this.createToolbarItem('button', this.pdfViewer.element.id + '_search', this.pdfViewer.localeObj.getConstant('Text Search'), 'e-pv-text-search');
        this.textSearchItem = searchButtonContainer.firstChild as HTMLElement;
        this.itemsContainer.appendChild(searchButtonContainer);
        searchButtonContainer.style.position = 'absolute';
        // tslint:disable-next-line:max-line-length
        let downloadButtonContainer: HTMLElement = this.createToolbarItem('button', this.pdfViewer.element.id + '_download', this.pdfViewer.localeObj.getConstant('Download file'), 'e-pv-download-document');
        this.downloadItem = downloadButtonContainer.firstChild as HTMLElement;
        downloadButtonContainer.style.position = 'absolute';
        if (this.pdfViewer.enableRtl) {
            // tslint:disable-next-line:max-line-length
            downloadButtonContainer.style.right = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft()) + 'px';
        } else {
            // tslint:disable-next-line:max-line-length
            downloadButtonContainer.style.left = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft()) + 'px';
        }
        this.itemsContainer.appendChild(downloadButtonContainer);
        // tslint:disable-next-line:max-line-length
        let printButtonContainer: HTMLElement = this.createToolbarItem('button', this.pdfViewer.element.id + '_print', this.pdfViewer.localeObj.getConstant('Print'), 'e-pv-print-document');
        this.printItem = printButtonContainer.firstChild as HTMLElement;
        printButtonContainer.style.position = 'absolute';
        if (this.pdfViewer.enableRtl) {
            if (downloadButtonContainer !== undefined) {
                // tslint:disable-next-line:max-line-length
                printButtonContainer.style.right = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft() - 40 ) + 'px';
            } else {
                // tslint:disable-next-line:max-line-length
                printButtonContainer.style.right = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft() ) + 'px';
            }
        } else {
            if (downloadButtonContainer !== undefined) {
                // tslint:disable-next-line:max-line-length
                printButtonContainer.style.left = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft() - 43) + 'px';
            } else {
                // tslint:disable-next-line:max-line-length
                printButtonContainer.style.left = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft()) + 'px';
            }
        }
        if (this.pdfViewer.enableRtl) {
            // tslint:disable-next-line:max-line-length
            searchButtonContainer.style.right = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft() - downloadButtonContainer.clientWidth - printButtonContainer.clientWidth - 56 ) + 'px';
            searchButtonContainer.style.paddingTop = '7px';
        } else {
            // tslint:disable-next-line:max-line-length
            searchButtonContainer.style.left = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft() - downloadButtonContainer.clientWidth - printButtonContainer.clientWidth - 54) + 'px';
        }
        this.itemsContainer.appendChild(printButtonContainer);
        // tslint:disable-next-line:max-line-length
        let items: { [key: string]: Object }[] = [{ percent: '50%', id: '0' }, { percent: '75%', id: '1' }, { percent: '100%', id: '2' }, { percent: '125%', id: '3' },
        // tslint:disable-next-line:max-line-length
        { percent: '150%', id: '4' }, { percent: '200%', id: '5' }, { percent: '400%', id: '6' }, { percent: this.pdfViewer.localeObj.getConstant('Fit Page'), id: '7' }, { percent: this.pdfViewer.localeObj.getConstant('Fit Width'), id: '8' }, { percent: this.pdfViewer.localeObj.getConstant('Automatic'), id: '9' }
        ];
        // tslint:disable-next-line:max-line-length
        this.zoomDropDown = new ComboBox({ dataSource: items, text: '100%', fields: { text: 'percent', value: 'id' }, readonly: true, cssClass: 'e-pv-zoom-drop-down', popupHeight: '402px', showClearButton: false });
        this.zoomDropDown.appendTo(this.zoomDropdownItem);
    }

    private createToolbarNavigationItems(): void {
        let firstPageContainer: HTMLElement;
        let previousContainer: HTMLElement;
        let nextContainer: HTMLElement;
        let lastPageContainer: HTMLElement;
        if (!this.pdfViewer.enableRtl) {
            // tslint:disable-next-line:max-line-length
            firstPageContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_firstPage', this.pdfViewer.localeObj.getConstant('Go To First Page'), 'e-pv-first-page-navigation');
        } else {
            // tslint:disable-next-line:max-line-length
            firstPageContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_firstPage', this.pdfViewer.localeObj.getConstant('Go To First Page'), 'e-pv-last-page-navigation');
        }
        this.firstPageItem = firstPageContainer.firstChild as HTMLElement;
        this.itemsContainer.appendChild(firstPageContainer);
        if (!this.pdfViewer.enableRtl) {
            // tslint:disable-next-line:max-line-length
            previousContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_previousPage', this.pdfViewer.localeObj.getConstant('Previous Page'), 'e-pv-previous-page-navigation');
        } else {
            // tslint:disable-next-line:max-line-length
            previousContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_previousPage', this.pdfViewer.localeObj.getConstant('Previous Page'), 'e-pv-next-page-navigation');
        }
        this.previousPageItem = previousContainer.firstChild as HTMLElement;
        this.itemsContainer.appendChild(previousContainer);
        if (!this.pdfViewer.enableRtl) {
            // tslint:disable-next-line:max-line-length
            nextContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_nextPage', this.pdfViewer.localeObj.getConstant('Next Page'), 'e-pv-next-page-navigation');
        } else {
            // tslint:disable-next-line:max-line-length
            nextContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_nextPage', this.pdfViewer.localeObj.getConstant('Next Page'), 'e-pv-previous-page-navigation');
        }
        this.nextPageItem = nextContainer.firstChild as HTMLElement;
        this.itemsContainer.appendChild(nextContainer);
        if (!this.pdfViewer.enableRtl) {
            // tslint:disable-next-line:max-line-length
            lastPageContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_lastPage', this.pdfViewer.localeObj.getConstant('Go To Last Page'), 'e-pv-last-page-navigation');
        } else {
            // tslint:disable-next-line:max-line-length
            lastPageContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_lastPage', this.pdfViewer.localeObj.getConstant('Go To Last Page'), 'e-pv-first-page-navigation');
        }
        this.lastPageItem = lastPageContainer.firstChild as HTMLElement;
        this.itemsContainer.appendChild(lastPageContainer);
        // tslint:disable-next-line:max-line-length
        let goToPageContainer: HTMLElement = this.createToolbarItem('input', this.pdfViewer.element.id + '_currentPageInput', this.pdfViewer.localeObj.getConstant('Page Number'), null);
        this.currentPageBox = new NumericTextBox({ value: 0, format: '##', cssClass: 'e-pv-current-page-box', showSpinButton: false });
        this.currentPageBoxElement = goToPageContainer.firstChild as HTMLElement;
        this.currentPageBox.appendTo(this.currentPageBoxElement);
        // tslint:disable-next-line:max-line-length
        let totalPageContainer: HTMLElement = this.createToolbarItem('span', this.pdfViewer.element.id + '_totalPage', null, 'e-pv-total-page');
        this.totalPageItem = totalPageContainer.firstChild as HTMLElement;
        if (this.pdfViewer.enableRtl) {
            this.itemsContainer.appendChild(totalPageContainer);
            goToPageContainer.style.paddingLeft = '8px';
            this.itemsContainer.appendChild(goToPageContainer);
        } else {
            this.itemsContainer.appendChild(goToPageContainer);
            this.itemsContainer.appendChild(totalPageContainer);
        }
        this.updateTotalPage();
    }

    private createToolbarMagnificationItems(): void {
        // tslint:disable-next-line:max-line-length
        let zoomOutContainer: HTMLElement = this.createToolbarItem('button', this.pdfViewer.element.id + '_zoomOut', this.pdfViewer.localeObj.getConstant('Zoom Out'), 'e-pv-zoom-out');
        this.zoomOutItem = zoomOutContainer.firstChild as HTMLElement;
        this.itemsContainer.appendChild(zoomOutContainer);
        // tslint:disable-next-line:max-line-length
        let zoomInContainer: HTMLElement = this.createToolbarItem('button', this.pdfViewer.element.id + '_zoomIn', this.pdfViewer.localeObj.getConstant('Zoom In'), 'e-pv-zoom-in');
        this.zoomInItem = zoomInContainer.firstChild as HTMLElement;
        this.itemsContainer.appendChild(zoomInContainer);
        // tslint:disable-next-line:max-line-length
        let zoomDropdownContainer: HTMLElement = this.createToolbarItem('input', this.pdfViewer.element.id + '_zoomDropDown', this.pdfViewer.localeObj.getConstant('Zoom'), null);
        zoomDropdownContainer.className = zoomDropdownContainer.className + ' e-pv-zoom-drop-down-container';
        this.zoomDropdownItem = zoomDropdownContainer.firstChild as HTMLElement;
        this.itemsContainer.appendChild(zoomDropdownContainer);
    }

    private onToolbarKeydown = (event: KeyboardEvent): void => {
        let targetId: string = (event.target as HTMLElement).id;
        if (!(targetId === this.pdfViewer.element.id + '_currentPageInput' || targetId === this.pdfViewer.element.id + '_zoomDropDown')) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    private createToolbarItemsForMobile(): void {
        this.toolbarElement.classList.add('e-pv-mobile-toolbar');
        let template: string = '<button id="' + this.pdfViewer.element.id + '_more_option" class="e-tbar-btn"></button>';
        this.toolbar = new tool({
            // tslint:disable-next-line:max-line-length
            items: [{ prefixIcon: 'e-pv-open-document-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Open'), id: this.pdfViewer.element.id + '_open' },
            // tslint:disable-next-line:max-line-length
            { prefixIcon: 'e-pv-text-search-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Text Search'), id: this.pdfViewer.element.id + '_search', align: 'Right' },
            { template: template, align: 'Right' }
            ], clicked: this.toolbarClickHandler, width: '', height: '', overflowMode: 'Popup'
        });
        this.toolbar.appendTo(this.toolbarElement);
        this.openDocumentItem = this.pdfViewerBase.getElement('_open');
        this.openDocumentItem.classList.add('e-pv-open-document');
        this.openDocumentItem.firstElementChild.id = this.pdfViewer.element.id + '_openIcon';
        this.textSearchItem = this.pdfViewerBase.getElement('_search');
        this.textSearchItem.classList.add('e-pv-text-search');
        this.textSearchItem.firstElementChild.id = this.pdfViewer.element.id + '_searchIcon';
        this.createMoreOption(this.pdfViewer.element.id + '_more_option');
    }

    private createMoreOption(idString: string): void {
        this.moreOptionItem = document.getElementById(idString);
        let items: ItemModel[] = [
            {
                text: this.pdfViewer.localeObj.getConstant('Download'), id: this.pdfViewer.element.id + '_menu_download',
                iconCss: 'e-icons e-pv-download-document-icon e-pv-icon'
            },
            {
                text: this.pdfViewer.localeObj.getConstant('Bookmarks'), id: this.pdfViewer.element.id + '_menu_bookmarks',
                iconCss: 'e-icons e-pv-bookmark-icon e-pv-icon'
            }
        ];
        this.moreDropDown = new DropDownButton({
            items: items, iconCss: 'e-pv-more-icon e-pv-icon', cssClass: 'e-caret-hide',
            open: (args: OpenCloseMenuEventArgs) => {
                let dropdownButtonPosition: ClientRect = this.moreDropDown.element.getBoundingClientRect();
                // tslint:disable-next-line:max-line-length
                args.element.parentElement.style.left = dropdownButtonPosition.left + dropdownButtonPosition.width - args.element.parentElement.offsetWidth + 'px';
            }, select: (args: MenuEventArgs) => {
                switch (args.item.id) {
                    case this.pdfViewer.element.id + '_menu_download':
                        this.pdfViewerBase.download();
                        break;
                    case this.pdfViewer.element.id + '_menu_bookmarks':
                        this.showToolbar(false);
                        this.pdfViewerBase.navigationPane.createNavigationPaneMobile('bookmarks');
                        break;
                    default:
                        break;
                }
            }, beforeItemRender: (args: MenuEventArgs) => {
                if (args.item.id === this.pdfViewer.element.id + '_menu_bookmarks') {
                    if (!this.pdfViewer.bookmarkViewModule || !this.pdfViewer.bookmarkViewModule.bookmarks) {
                        args.element.classList.add('e-disabled');
                    } else {
                        args.element.classList.remove('e-disabled');
                    }
                }
            }, close: (args: OpenCloseMenuEventArgs) => {
                this.moreOptionItem.blur();
                this.pdfViewerBase.focusViewerContainer();
            }
        });
        this.moreDropDown.appendTo('#' + idString);
    }

    private createToolbarItem(elementName: string, id: string, tooltipText: string, className: string): HTMLElement {
        let containerElement: HTMLElement = createElement('div', { id: id + 'Container' });
        let toolbarItem: HTMLElement = createElement(elementName, { id: id });
        if (className !== null) {
            containerElement.className = className + '-container e-overflow-show e-popup-text';
            toolbarItem.className = className;
        }
        if (elementName === 'button' && id !== this.pdfViewer.element.id + '_zoomDropDown') {
            toolbarItem.className = 'e-btn e-tbar-btn e-icon-btn e-pv-tbar-btn ' + className;
            if (!this.pdfViewer.enableRtl) {
                let buttonSpan: HTMLElement = createElement('span', { id: id + 'Icon', className: className + '-icon e-pv-icon' });
                toolbarItem.appendChild(buttonSpan);
            } else {
                let buttonSpan: HTMLElement = createElement('span', { id: id + 'Icon', className: className + '-icon e-pv-icon e-right' });
                toolbarItem.appendChild(buttonSpan);
            }
        } else if (elementName === 'input' && id !== this.pdfViewer.element.id + '_zoomDropDown') {
            (toolbarItem as HTMLInputElement).type = 'text';
        }
        containerElement.appendChild(toolbarItem);
        if (tooltipText !== null) {
            // tslint:disable-next-line
            let tooltip: Tooltip = new Tooltip({ content: tooltipText, opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
            tooltip.appendTo(toolbarItem);
        }
        return containerElement;
    }

    private onTooltipBeforeOpen(args: TooltipEventArgs): void {
        if (!this.pdfViewer.toolbarSettings.showTooltip) {
            args.cancel = true;
        }
    }

    private createFileElement(toolbarElement: HTMLElement): void {
        // tslint:disable-next-line:max-line-length
        this.fileInputElement = createElement('input', { id: this.pdfViewer.element.id + '_fileUploadElement', styles: 'position:fixed; left:-100em', attrs: { 'type': 'file' } });
        this.fileInputElement.setAttribute('accept', '.pdf');
        toolbarElement.appendChild(this.fileInputElement);
    }

    private wireEvent(): void {
        this.fileInputElement.addEventListener('change', this.loadDocument);
        if (!Browser.isDevice) {
            this.toolbarElement.addEventListener('mouseup', this.toolbarOnMouseup.bind(this));
            this.currentPageBoxElement.addEventListener('focusout', this.textBoxFocusOut);
            this.currentPageBoxElement.addEventListener('keypress', this.navigateToPage);
            this.zoomDropDown.change = this.zoomPercentSelect.bind(this);
            this.zoomDropDown.element.addEventListener('keypress', this.onZoomDropDownInput.bind(this));
            this.zoomDropDown.element.addEventListener('click', this.onZoomDropDownInputClick.bind(this));
        }
    }

    private unWireEvent(): void {
        this.fileInputElement.removeEventListener('change', this.loadDocument);
        if (!Browser.isDevice) {
            this.toolbarElement.removeEventListener('mouseup', this.toolbarOnMouseup.bind(this));
            this.currentPageBoxElement.removeEventListener('focusout', this.textBoxFocusOut);
            this.currentPageBoxElement.removeEventListener('keypress', this.navigateToPage);
            this.zoomDropDown.removeEventListener('change', this.zoomPercentSelect);
            this.zoomDropDown.element.removeEventListener('keypress', this.onZoomDropDownInput);
            this.zoomDropDown.element.removeEventListener('click', this.onZoomDropDownInputClick);
        }
    }
    /** 
     * @private
     */
    public onToolbarResize(viewerWidth: number): void {
        if (!Browser.isDevice) {
            let navigationToolbar: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_toolbarContainer_nav');
            let downloadButtonElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_downloadContainer');
            let printButtonElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_printContainer');
            let searchButtonElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_searchContainer');
            if (!navigationToolbar) {
                if (downloadButtonElement) {
                    if (this.pdfViewer.enableRtl) {
                        downloadButtonElement.style.right = viewerWidth + 'px';
                        downloadButtonElement.style.position = 'absolute';
                    } else {
                        downloadButtonElement.style.left = viewerWidth + 'px';
                        downloadButtonElement.style.position = 'absolute';
                    }
                }
                if (printButtonElement) {
                    if (this.pdfViewer.enableRtl) {
                        if (downloadButtonElement !== null) {
                            printButtonElement.style.right = (viewerWidth - downloadButtonElement.clientWidth + 3 ) + 'px';
                            printButtonElement.style.position = 'absolute';
                        } else {
                            printButtonElement.style.right = viewerWidth + 'px';
                            printButtonElement.style.position = 'absolute';
                        }
                    } else {
                        if (downloadButtonElement !== null) {
                            printButtonElement.style.left = (viewerWidth - downloadButtonElement.clientWidth) + 'px';
                            printButtonElement.style.position = 'absolute';
                        } else {
                            printButtonElement.style.left = viewerWidth + 'px';
                            printButtonElement.style.position = 'absolute';
                        }
                    }
                }
                if (searchButtonElement) {
                    searchButtonElement.style.position = 'absolute';
                    if (printButtonElement !== null) {
                        if (this.pdfViewer.enableRtl) {
                            // tslint:disable-next-line:max-line-length
                            searchButtonElement.style.right = (viewerWidth - downloadButtonElement.clientWidth - printButtonElement.clientWidth + 2) + 'px';
                        } else {
                            // calculate the search Icon left Position value
                            // tslint:disable-next-line:max-line-length
                            searchButtonElement.style.left = (parseFloat(printButtonElement.style.left) - printButtonElement.clientWidth) + 'px';
                        }
                    } else if (downloadButtonElement !== null) {
                        if (this.pdfViewer.enableRtl) {
                            searchButtonElement.style.right =  (viewerWidth - downloadButtonElement.clientWidth + 3) + 'px';
                        }
                        // tslint:disable-next-line:max-line-length
                        searchButtonElement.style.left = (parseFloat(downloadButtonElement.style.left) - downloadButtonElement.clientWidth) + 'px';
                    } else {
                        if (this.pdfViewer.enableRtl) {
                            searchButtonElement.style.right = viewerWidth + 'px';
                        }
                        searchButtonElement.style.left = viewerWidth + 'px';
                    }
                }
            }
        } else {
            this.pdfViewerBase.navigationPane.toolbarResize();
        }
    }

    private toolbarOnMouseup(event: MouseEvent): void {
        if (event.target === this.itemsContainer || event.target === this.toolbarElement) {
            this.pdfViewerBase.focusViewerContainer();
        }
    }

    private applyHideToToolbar(show: boolean, startIndex: number, endIndex: number): void {
        let isHide: boolean = !show;
        for (let index: number = startIndex; index <= endIndex; index++) {
            this.toolbar.hideItem(index, isHide);
        }
    }

    private toolbarClickHandler = (args: ClickEventArgs): void => {
        // tslint:disable-next-line:max-line-length
        if (!Browser.isDevice) {
            if (args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[1] || args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[2]) {
                args.cancel = true;
            } else if ((args.originalEvent.target as HTMLElement).id === this.pdfViewer.element.id + '_openIcon') {
                let tooltipData: DOMStringMap = (args.originalEvent.target as HTMLElement).parentElement.dataset;
                if (tooltipData && tooltipData.tooltipId) {
                    let tooltipElement: HTMLElement = document.getElementById(tooltipData.tooltipId);
                    if (tooltipElement) {
                        tooltipElement.style.display = 'none';
                    }
                }
            }
        }
        switch ((args.originalEvent.target as HTMLElement).id) {
            case this.pdfViewer.element.id + '_open':
            case this.pdfViewer.element.id + '_openIcon':
                this.fileInputElement.click();
                if (Browser.isDevice) {
                    (args.originalEvent.target as HTMLElement).blur();
                    this.pdfViewerBase.focusViewerContainer();
                }
                break;
            case this.pdfViewer.element.id + '_download':
            case this.pdfViewer.element.id + '_downloadIcon':
                this.pdfViewerBase.download();
                break;
            case this.pdfViewer.element.id + '_print':
            case this.pdfViewer.element.id + '_printIcon':
                if (this.pdfViewer.printModule) {
                    this.pdfViewer.printModule.print();
                }
                break;
            case this.pdfViewer.element.id + '_firstPage':
            case this.pdfViewer.element.id + '_firstPageIcon':
                if (this.pdfViewer.navigationModule) {
                    this.pdfViewer.navigationModule.goToFirstPage();
                }
                break;
            case this.pdfViewer.element.id + '_previousPage':
            case this.pdfViewer.element.id + '_previousPageIcon':
                if (this.pdfViewer.navigationModule) {
                    this.pdfViewer.navigationModule.goToPreviousPage();
                }
                break;
            case this.pdfViewer.element.id + '_nextPage':
            case this.pdfViewer.element.id + '_nextPageIcon':
                if (this.pdfViewer.navigationModule) {
                    this.pdfViewer.navigationModule.goToNextPage();
                }
                break;
            case this.pdfViewer.element.id + '_lastPage':
            case this.pdfViewer.element.id + '_lastPageIcon':
                if (this.pdfViewer.navigationModule) {
                    this.pdfViewer.navigationModule.goToLastPage();
                }
                break;
            case this.pdfViewer.element.id + '_zoomIn':
            case this.pdfViewer.element.id + '_zoomInIcon':
                this.pdfViewer.magnificationModule.zoomIn();
                break;
            case this.pdfViewer.element.id + '_zoomOut':
            case this.pdfViewer.element.id + '_zoomOutIcon':
                this.pdfViewer.magnificationModule.zoomOut();
                break;
            case this.pdfViewer.element.id + '_selectTool':
            case this.pdfViewer.element.id + '_selectToolIcon':
                if (!this.isSelectionToolDisabled) {
                    this.pdfViewerBase.initiateTextSelectMode();
                    this.updateInteractionTools(true);
                }
                break;
            case this.pdfViewer.element.id + '_handTool':
            case this.pdfViewer.element.id + '_handToolIcon':
                if (!this.isScrollingToolDisabled) {
                    this.pdfViewerBase.initiatePanning();
                    this.updateInteractionTools(false);
                }
                break;
            case this.pdfViewer.element.id + '_search':
            case this.pdfViewer.element.id + '_searchIcon':
                this.textSearchButtonHandler();
                break;
        }
        // tslint:disable-next-line:max-line-length
        if (!Browser.isDevice) {
            if (!(args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[1] || args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[2] || args.originalEvent.target === this.currentPageBoxElement || args.originalEvent.target === this.textSearchItem.childNodes[0])) {
                (args.originalEvent.target as HTMLElement).blur();
                this.pdfViewerBase.focusViewerContainer();
            }
        }
    }

    // tslint:disable-next-line
    private loadDocument = (args: any): void => {
        // tslint:disable-next-line
        let upoadedFiles: any = args.target.files;
        if (args.target.files[0] !== null) {
            let uploadedFile: File = upoadedFiles[0];
            if (uploadedFile) {
                this.uploadedDocumentName = uploadedFile.name;
                let reader: FileReader = new FileReader();
                reader.readAsDataURL(uploadedFile);
                // tslint:disable-next-line
                reader.onload = (e: any): void => {
                    let uploadedFileUrl: string = e.currentTarget.result;
                    this.pdfViewer.load(uploadedFileUrl, null);
                };
            }
        }
    }

    private navigateToPage = (args: KeyboardEvent): void => {
        if (args.which === 13) {
            // tslint:disable-next-line
            let enteredValue: number = parseInt((this.currentPageBoxElement as HTMLInputElement).value);
            if (enteredValue !== null) {
                if (enteredValue > 0 && enteredValue <= this.pdfViewerBase.pageCount) {
                    if (this.pdfViewer.navigationModule) {
                        this.pdfViewer.navigationModule.goToPage(enteredValue);
                    }
                } else {
                    this.updateCurrentPage(this.pdfViewerBase.currentPageNumber);
                }
            } else {
                this.updateCurrentPage(this.pdfViewerBase.currentPageNumber);
            }
            this.currentPageBoxElement.blur();
            this.pdfViewerBase.focusViewerContainer();
        }
    }

    private textBoxFocusOut = (): void => {
        // tslint:disable-next-line
        if (this.currentPageBox.value === null || this.currentPageBox.value >= this.pdfViewerBase.pageCount || this.currentPageBox.value !== this.pdfViewerBase.currentPageNumber) {
            this.updateCurrentPage(this.pdfViewerBase.currentPageNumber);
        }
    }

    private onZoomDropDownInput(event: KeyboardEvent): boolean {
        if ((event.which < 48 || event.which > 57) && event.which !== 8 && event.which !== 13) {
            event.preventDefault();
            return false;
        } else {
            if (event.which === 13) {
                event.preventDefault();
                let value: string = (this.zoomDropDown.element as HTMLInputElement).value;
                this.zoomDropDownChange(value);
            }
            return true;
        }
    }

    private onZoomDropDownInputClick(): void {
        (this.zoomDropDown.element as HTMLInputElement).select();
    }

    private zoomPercentSelect(args: ChangeEventArgs): void {
        if (this.pdfViewerBase.pageCount > 0) {
            if (args.isInteracted) {
                if (args.itemData) {
                    // tslint:disable-next-line:no-any
                    let zoomText: string = (args.itemData as any).percent;
                    this.zoomDropDownChange(zoomText);
                }
            } else {
                this.updateZoomPercentage(this.pdfViewer.magnificationModule.zoomFactor);
            }
        }
    }

    private zoomDropDownChange(zoomText: string): void {
        // tslint:disable-next-line:max-line-length
        if (zoomText !== this.pdfViewer.localeObj.getConstant('Fit Width') && zoomText !== this.pdfViewer.localeObj.getConstant('Fit Page') && zoomText !== this.pdfViewer.localeObj.getConstant('Automatic')) {
            this.pdfViewer.magnificationModule.isAutoZoom = false;
            this.pdfViewer.magnificationModule.zoomTo(parseFloat(zoomText));
            this.zoomDropDown.focusOut();
        } else if (zoomText === this.pdfViewer.localeObj.getConstant('Fit Width')) {
            this.pdfViewer.magnificationModule.isAutoZoom = false;
            this.pdfViewer.magnificationModule.fitToWidth();
            this.zoomDropDown.focusOut();
        } else if (zoomText === this.pdfViewer.localeObj.getConstant('Fit Page')) {
            this.pdfViewer.magnificationModule.fitToPage();
            this.zoomDropDown.focusOut();
        } else if (zoomText === this.pdfViewer.localeObj.getConstant('Automatic')) {
            this.pdfViewer.magnificationModule.isAutoZoom = true;
            this.pdfViewer.magnificationModule.fitToAuto();
            this.zoomDropDown.focusOut();
        }
    }
    /** 
     * @private
     */
    public updateZoomPercentage(zoomFactor: number): void {
        if (!Browser.isDevice) {
            // tslint:disable-next-line:radix
            let currentPercent: string = parseInt((zoomFactor * 100).toString()) + '%';
            if (this.zoomDropDown.text === currentPercent) {
                (this.zoomDropDown.element as HTMLInputElement).value = currentPercent;
            }
            if (this.zoomDropDown.index === 9) {
                this.zoomDropDown.value = 2;
            }
            // tslint:disable-next-line
            this.zoomDropDown.text = currentPercent;
        }
    }

    private updateInteractionItems(): void {
        if (this.pdfViewer.textSelectionModule) {
            if (this.pdfViewer.enableTextSelection) {
                this.toolbar.enableItems(this.textSelectItem.parentElement, true);
            } else {
                this.toolbar.enableItems(this.textSelectItem.parentElement, false);
            }
        } else {
            this.toolbar.enableItems(this.textSelectItem.parentElement, false);
        }
        this.toolbar.enableItems(this.panItem.parentElement, true);
        if (this.pdfViewer.interactionMode === 'TextSelection') {
            this.selectItem(this.textSelectItem);
            this.deSelectItem(this.panItem);
        } else {
            this.selectItem(this.panItem);
            this.deSelectItem(this.textSelectItem);
            this.pdfViewerBase.initiatePanning();
        }
    }
    /** 
     * @private
     */
    public textSearchButtonHandler(): void {
        if (!Browser.isDevice) {
            if (this.pdfViewer.textSearchModule && this.pdfViewerBase.pageCount > 0) {
                this.isTextSearchBoxDisplayed = !this.isTextSearchBoxDisplayed;
                this.pdfViewer.textSearchModule.showSearchBox(this.isTextSearchBoxDisplayed);
                if (this.isTextSearchBoxDisplayed) {
                    this.selectItem(this.textSearchItem);
                    // tslint:disable-next-line:max-line-length
                    let searchInputElement: HTMLInputElement = document.getElementById(this.pdfViewer.element.id + '_search_input') as HTMLInputElement;
                    searchInputElement.select();
                    searchInputElement.focus();
                } else {
                    this.deSelectItem(this.textSearchItem);
                }
            }
        } else {
            this.showToolbar(false);
            this.pdfViewerBase.navigationPane.createNavigationPaneMobile('search');
        }
    }

    private selectItem(element: HTMLElement): void {
        element.classList.add('e-pv-select');
    }

    private deSelectItem(element: HTMLElement): void {
        element.classList.remove('e-pv-select');
    }

    private updateInteractionTools(isTextSelect: boolean): void {
        if (isTextSelect) {
            this.selectItem(this.textSelectItem);
            this.deSelectItem(this.panItem);
        } else {
            this.selectItem(this.panItem);
            this.deSelectItem(this.textSelectItem);
        }
    }

    private initialEnableItems(): void {
        if (this.pdfViewer.enableToolbar) {
            this.showToolbar(true);
        } else {
            this.showToolbar(false);
        }
        if (this.pdfViewer.enablePrint) {
            this.showPrintOption(true);
        } else {
            this.showPrintOption(false);
        }
        if (this.pdfViewer.enableDownload) {
            this.showDownloadOption(true);
        } else {
            this.showDownloadOption(false);
        }
        if (this.pdfViewer.enableTextSearch) {
            this.showSearchOption(true);
        } else {
            this.showSearchOption(false);
        }
    }

    private showSeparator(toolbarItems: ToolbarItem[]): void {
        if (!this.isOpenBtnVisible || (!this.isNavigationToolVisible && this.isOpenBtnVisible && this.isDownloadBtnVisible
            && this.isPrintBtnVisible) || (this.isOpenBtnVisible && toolbarItems.length === 1)) {
            this.applyHideToToolbar(false, 1, 1);
        }
        if ((!this.isNavigationToolVisible || !this.isMagnificationToolVisible) && !this.isOpenBtnVisible) {
            this.applyHideToToolbar(false, 8, 8);
        }
        if ((!this.isMagnificationToolVisible && !this.isSelectionBtnVisible && !this.isScrollingBtnVisible) ||
            (this.isMagnificationToolVisible && (!this.isSelectionBtnVisible && !this.isScrollingBtnVisible)) ||
            (!this.isMagnificationToolVisible && (this.isSelectionBtnVisible && this.isScrollingBtnVisible))) {
            this.applyHideToToolbar(false, 12, 12);
        }
    }

    private applyToolbarSettings(): void {
        let toolbarSettingsItems: ToolbarItem[] = this.pdfViewer.toolbarSettings.toolbarItem;
        if (toolbarSettingsItems.indexOf('OpenOption') !== -1) {
            this.showOpenOption(true);
        } else {
            this.showOpenOption(false);
        }
        if (toolbarSettingsItems.indexOf('PageNavigationTool') !== -1) {
            this.showPageNavigationTool(true);
        } else {
            this.showPageNavigationTool(false);
        }
        if (toolbarSettingsItems.indexOf('MagnificationTool') !== -1) {
            this.showMagnificationTool(true);
        } else {
            this.showMagnificationTool(false);
        }
        if (toolbarSettingsItems.indexOf('SelectionTool') !== -1) {
            this.showSelectionTool(true);
        } else {
            this.showSelectionTool(false);
        }
        if (toolbarSettingsItems.indexOf('PanTool') !== -1) {
            this.showScrollingTool(true);
        } else {
            this.showScrollingTool(false);
        }
        if (toolbarSettingsItems.indexOf('PrintOption') !== -1) {
            this.showPrintOption(true);
        } else {
            this.showPrintOption(false);
        }
        if (toolbarSettingsItems.indexOf('DownloadOption') !== -1) {
            this.showDownloadOption(true);
        } else {
            this.showDownloadOption(false);
        }
        if (toolbarSettingsItems.indexOf('SearchOption') !== -1) {
            this.showSearchOption(true);
        } else {
            this.showSearchOption(false);
        }
        this.showSeparator(toolbarSettingsItems);
    }

    /** 
     * @private
     */
    public getModuleName(): string {
        return 'Toolbar';
    }
}