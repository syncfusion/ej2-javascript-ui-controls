import { createElement, Browser, isBlazor, isNullOrUndefined, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { Toolbar as tool, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { ComboBox, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { PdfViewer, PdfViewerBase, AnnotationToolbar, CustomToolbarItemModel } from '../index';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { DropDownButton, ItemModel, OpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ToolbarItem, FormFieldDataFormat } from '../base/types';
import { FormDesignerToolbar } from './formdesigner-toolbar';
/* eslint-disable valid-jsdoc */
/**
 * Toolbar module
 *
 * @param {string} args - args
 * @param {Event} event - args
 * @returns {void}
 */
export class Toolbar {
    /**
     * @private
     */
    public toolbar: tool;
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private currentPageBox: NumericTextBox;
    private zoomDropDown: ComboBox;
    private currentPageBoxElement: HTMLElement;
    /**
     * @private
     */
    public uploadedFile: string | Uint8Array;
    /**
     * @private
     */
    public uploadedDocumentName: string;
    /**
     * @private
     */
    public toolbarElement: HTMLElement;
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
    /**
     * @private
     */
    public submitItem: HTMLElement;
    private fileInputElement: HTMLElement;
    private textSelectItem: HTMLElement;
    private panItem: HTMLElement;
    private printItem: HTMLElement;
    private textSearchItem: HTMLElement;
    private undoItem: HTMLElement;
    private redoItem: HTMLElement;
    private commentItem: HTMLElement;
    /**
     * @private
     */
    public annotationItem: HTMLElement;
    /**
     * @private
     */
    public formDesignerItem: HTMLElement;
    private moreOptionItem: HTMLElement;
    private organizePageItem: HTMLElement;
    /**
     * @private
     */
    public annotationToolbarModule: AnnotationToolbar;
    /**
     * @private
     */
    public formDesignerToolbarModule: FormDesignerToolbar;
    /**
     * @private
     */
    public moreDropDown: DropDownButton;
    private isPageNavigationToolDisabled: boolean = false;
    private isMagnificationToolDisabled: boolean = false;
    /**
     * @private
     */
    public isSelectionToolDisabled: boolean = false;
    private isScrollingToolDisabled: boolean = false;
    private isOpenBtnVisible: boolean = true;
    private isNavigationToolVisible: boolean = true;
    private isMagnificationToolVisible: boolean = true;
    private isSelectionBtnVisible: boolean = true;
    private isScrollingBtnVisible: boolean = true;
    private isDownloadBtnVisible: boolean = true;
    private isPrintBtnVisible: boolean = true;
    private isSearchBtnVisible: boolean = true;
    /**
     * @private
     */
    public isTextSearchBoxDisplayed: boolean = false;
    private isUndoRedoBtnsVisible: boolean = true;
    private isAnnotationEditBtnVisible: boolean = true;
    private isFormDesignerEditBtnVisible: boolean = true;
    private isCommentBtnVisible: boolean = true;
    private isSubmitbtnvisible: boolean = true;
    private toolItems: any[] = [];
    private itemsIndexArray: any[] = [];

    /**
     * @private
     */
    public PanElement: any;

    /**
     * @private
     */
    public SelectToolElement: HTMLElement;

    /**
     * @private
     */
    public CommentElement: HTMLElement;

    /**
     * @param {PdfViewer} viewer - It describes about the viewer
     * @param {PdfViewerBase} viewerBase - It describes about the viewer base
     * @private
     * @returns {void}
     */
    constructor(viewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
    }

    /**
     * @param {string} width - It describes about the width
     * @private
     * @returns {HTMLElement} - html element
     */
    public intializeToolbar(width: string): HTMLElement {
        let toolbarDiv: HTMLElement;
        if (!isBlazor()) {
            toolbarDiv = this.createToolbar(width);
        } else {
            if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                toolbarDiv = this.pdfViewer.element.querySelector('.e-pv-toolbar');
                this.toolbarElement = toolbarDiv;
            }
        }
        const isIE: boolean = !!(document as any).documentMode;
        if (isIE) {
            if (isBlazor()) {
                this.pdfViewerBase.blazorUIAdaptor.totalPageElement.classList.add('e-pv-total-page-ms');
            } else {
                if (!Browser.isDevice) {
                    this.totalPageItem.classList.add('e-pv-total-page-ms');
                }
            }
        }
        this.createFileElement(toolbarDiv);
        this.wireEvent();
        if (!isBlazor()) {
            this.updateToolbarItems();
            if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                this.applyToolbarSettings();
                this.initialEnableItems();
                this.pdfViewerBase.navigationPane.adjustPane();
            } else {
                this.initialEnableItems();
            }
            if (this.pdfViewer.annotationModule) {
                this.annotationToolbarModule = new AnnotationToolbar(this.pdfViewer, this.pdfViewerBase, this);
                if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                    this.annotationToolbarModule.initializeAnnotationToolbar();
                }
            }
            if (this.pdfViewer.formDesignerModule) {
                this.formDesignerToolbarModule = new FormDesignerToolbar(this.pdfViewer, this.pdfViewerBase, this);
                if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                    this.formDesignerToolbarModule.initializeFormDesignerToolbar();
                }
            }
        } else {
            if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                this.initialEnableItems();
                this.pdfViewerBase.navigationPane.adjustPane();
                if (this.pdfViewer.enableToolbar) {
                    this.bindOpenIconEvent();
                }
            }
            this.PanElement = document.getElementById(this.pdfViewer.element.id + '_handTool').children[0];
            this.PanElement.classList.add('e-pv-tbar-btn');
            this.SelectToolElement = document.getElementById(this.pdfViewer.element.id + '_selectTool').children[0] as HTMLElement;
            this.SelectToolElement.classList.add('e-pv-tbar-btn');
            this.CommentElement = document.getElementById(this.pdfViewer.element.id + '_comment').children[0] as HTMLElement;
            this.CommentElement.classList.add('e-pv-tbar-btn');
            this.annotationToolbarModule = new AnnotationToolbar(this.pdfViewer, this.pdfViewerBase, this);
            if (this.pdfViewer.enableToolbar && this.pdfViewer.enableAnnotationToolbar ||
                (this.pdfViewer.enableDesktopMode && Browser.isDevice)) {
                this.annotationToolbarModule.afterAnnotationToolbarCreationInBlazor();
            }
        }
        return toolbarDiv;
    }

    private bindOpenIconEvent(): void {
        const openElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_open');
        if (openElement) {
            openElement.addEventListener('click', this.openFileDialogBox.bind(this));
        }
    }

    private InitializeMobileToolbarInBlazor(): void {
        const toolbarDiv: HTMLElement = this.pdfViewer.element.querySelector('.e-pv-mobile-toolbar');
        this.createFileElement(toolbarDiv);
        this.wireEvent();
    }
    /**
     * Shows /hides the toolbar in the PdfViewer
     *
     * @param  {boolean} enableToolbar - If set true , its show the Toolbar
     * @returns {void}
     */
    public showToolbar(enableToolbar: boolean): void {
        let toolbar: HTMLElement;
        if (!isNullOrUndefined(this.toolbarElement)) {
            toolbar = this.toolbarElement;
        }
        if (enableToolbar) {
            if (!isNullOrUndefined(toolbar) && !(this.pdfViewerBase.navigationPane &&
                this.pdfViewerBase.navigationPane.isNavigationToolbarVisible)) {
                toolbar.style.display = 'block';
            }
            const toolbarContainer: HTMLElement = this.pdfViewerBase.getElement('_toolbarContainer');
            if (toolbarContainer) {
                let toolbarHeight: number = toolbarContainer.clientHeight;
                if (toolbarHeight === 0) {
                    toolbarHeight = parseFloat(window.getComputedStyle(toolbarContainer)['height']) + 1;
                }
                this.pdfViewerBase.toolbarHeight = toolbarHeight;
            }
            if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.pdfViewer.toolbarModule &&
            this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.hideMobileAnnotationToolbar();
            }
        } else {
            this.pdfViewerBase.toolbarHeight = 0;
            if (enableToolbar) {
                if (Browser.isDevice && this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar) {
                    this.annotationToolbarModule.toolbarCreated = false;
                    this.annotationToolbarModule.adjustMobileViewer();
                    this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar.element.style.display = 'none';
                }
                if (Browser.isDevice && this.annotationToolbarModule.propertyToolbar) {
                    this.annotationToolbarModule.propertyToolbar.element.style.display = 'none';
                }
            }
            if (!isNullOrUndefined(toolbar)) {
                toolbar.style.display = 'none';
            }
        }
    }

    /**
     * Shows/hides the Navigation toolbar in the PdfViewer
     *
     * @param  {boolean} enableNavigationToolbar - If set true , its show the Navigation Toolbar
     * @returns {void}
     */
    public showNavigationToolbar(enableNavigationToolbar: boolean): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            const navigationToolbar: HTMLElement = this.pdfViewerBase.navigationPane.sideBarToolbar;
            const navigationToolbarSplitter: HTMLElement = this.pdfViewerBase.navigationPane.sideBarToolbarSplitter;
            if (enableNavigationToolbar) {
                if (!isNullOrUndefined(navigationToolbar)) {
                    navigationToolbar.style.display = 'block';
                }
                if (!isNullOrUndefined(navigationToolbarSplitter)) {
                    navigationToolbarSplitter.style.display = 'block';
                }
                if (this.pdfViewerBase.navigationPane.isBookmarkOpen || this.pdfViewerBase.navigationPane.isThumbnailOpen) {
                    this.pdfViewerBase.navigationPane.clear();
                }
            } else {
                if (!isNullOrUndefined(navigationToolbar)) {
                    navigationToolbar.style.display = 'none';
                }
                if (!isNullOrUndefined(navigationToolbarSplitter)) {
                    navigationToolbarSplitter.style.display = 'none';
                }
                if (this.pdfViewerBase.navigationPane.isBookmarkOpen || this.pdfViewerBase.navigationPane.isThumbnailOpen) {
                    this.pdfViewerBase.navigationPane.updateViewerContainerOnClose();
                }
            }
        }
    }

    /**
     * Shows /hides the annotation toolbar in the PdfViewer
     *
     * @param  {boolean} enableAnnotationToolbar - If set true , its show the annotation Toolbar
     * @returns {void}
     */
    public showAnnotationToolbar(enableAnnotationToolbar: boolean): void {
        if (enableAnnotationToolbar) {
            this.annotationToolbarModule.isToolbarHidden = true;
            this.annotationToolbarModule.showAnnotationToolbar();
        } else {
            this.annotationToolbarModule.isToolbarHidden = false;
            this.annotationToolbarModule.showAnnotationToolbar();
        }
    }

    /**
     * Shows /hides the the toolbar items in the PdfViewer
     *
     * @param  {string[]} items - Defines the toolbar items in the toolbar
     * @param  {boolean} isVisible - If set true, then its show the toolbar Items
     * @returns {void}
     */
    public showToolbarItem(items: (CustomToolbarItemModel | ToolbarItem)[], isVisible: boolean): void {
        for (let i: number = 0; i < items.length; i++) {
            switch (items[parseInt(i.toString(), 10)]) {
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
            case 'UndoRedoTool':
                this.showUndoRedoTool(isVisible);
                break;
            case 'AnnotationEditTool':
                this.showAnnotationEditTool(isVisible);
                break;
            case 'FormDesignerEditTool':
                this.showFormDesignerEditTool(isVisible);
                break;
            case 'CommentTool':
                this.showCommentOption(isVisible);
                break;
            case 'SubmitForm':
                this.showSubmitForm(isVisible);
                break;
            }
        }
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.applyHideToToolbar(true, this.itemsIndexArray[0].endIndex + 1, this.itemsIndexArray[0].endIndex + 1);
            this.applyHideToToolbar(true, this.itemsIndexArray[1].endIndex + 1, this.itemsIndexArray[1].endIndex + 1);
            this.applyHideToToolbar(true, this.itemsIndexArray[2].endIndex + 1, this.itemsIndexArray[2].endIndex + 1);
            this.applyHideToToolbar(true, this.itemsIndexArray[4].endIndex + 1, this.itemsIndexArray[4].endIndex + 1);
            this.applyHideToToolbar(true, this.itemsIndexArray[5].endIndex + 1, this.itemsIndexArray[5].endIndex + 1);
        }
        else {
            this.applyHideToToolbar(true, 1, 1);
            this.applyHideToToolbar(true, 8, 8);
            this.applyHideToToolbar(true, 12, 12);
            this.applyHideToToolbar(true, 15, 15);
        }
        this.showSeparator(items);
    }

    /**
     * Enables /disables the the toolbar items in the PdfViewer
     *
     * @param  {string[]} items - Defines the toolbar items in the toolbar
     * @param  {boolean} isEnable - If set true, then its Enable the toolbar Items
     * @returns {void}
     */
    public enableToolbarItem(items: (CustomToolbarItemModel | ToolbarItem)[], isEnable: boolean): void {
        for (let i: number = 0; i < items.length; i++) {
            switch (items[parseInt(i.toString(), 10)]) {
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
            case 'UndoRedoTool':
                this.enableUndoRedoTool(isEnable);
                break;
            case 'AnnotationEditTool':
                this.enableAnnotationEditTool(isEnable);
                break;
            case 'FormDesignerEditTool':
                this.enableFormDesignerEditTool(isEnable);
                break;
            case 'CommentTool':
                this.enableCommentsTool(isEnable);
                break;
            case 'OrganizePagesTool':
                this.enableOrganizePagesButton(isEnable);
                break;
            }
        }
    }

    /**
     * @param {any} restrictionSummary - It describes about the restriction summary
     * @param {boolean} isEnable - It describes about the isEnable boolean value
     * @private
     * @returns {void}
     */
    public DisableToolbarItems(restrictionSummary: any, isEnable: boolean): void {
        switch (restrictionSummary) {
        case 'Print':
            this.enablePrintOption(isEnable);
            break;
        case 'CopyContent':
            this.isSelectionToolDisabled = isEnable;
            this.enableSelectionTool(isEnable);
            if (isEnable) {
                this.pdfViewerBase.initiateTextSelectMode();
                this.updateInteractionTools(isEnable);
            } else {
                this.pdfViewerBase.initiatePanning();
                this.updateInteractionTools(isEnable);
            }
            break;
        case 'EditAnnotations':
            this.enableAnnotationEditTool(isEnable);
            if (this.annotationToolbarModule && !this.annotationToolbarModule.isToolbarHidden) {
                this.annotationToolbarModule.showAnnotationToolbar();
            }
            break;
        }
    }

    private showOpenOption(enableOpenOption: boolean): void {
        this.isOpenBtnVisible = enableOpenOption;
        //For mobile devices, the default previous value for OpenOption has been passed as (0,0).
        this.applyHideToToolbar(enableOpenOption, !isNullOrUndefined(this.itemsIndexArray[0]) ?
            this.itemsIndexArray[0].startIndex : 0, !isNullOrUndefined(this.itemsIndexArray[0]) ? this.itemsIndexArray[0].endIndex : 0);
    }

    private showPageNavigationTool(enablePageNavigationTool: boolean): void {
        this.isNavigationToolVisible = enablePageNavigationTool;
        //For mobile devices, the default previous value for PageNavigationTool has been passed as (2,7).
        this.applyHideToToolbar(enablePageNavigationTool, !isNullOrUndefined(this.itemsIndexArray[1]) ?
            this.itemsIndexArray[1].startIndex : 2, !isNullOrUndefined(this.itemsIndexArray[1]) ? this.itemsIndexArray[1].endIndex : 7);
    }

    private showMagnificationTool(enableMagnificationTool: boolean): void {
        this.isMagnificationToolVisible = enableMagnificationTool;
        //For mobile devices, the default previous value for MagnificationTool has been passed as (9,11).
        this.applyHideToToolbar(enableMagnificationTool, !isNullOrUndefined(this.itemsIndexArray[2]) ?
            this.itemsIndexArray[2].startIndex : 9, !isNullOrUndefined(this.itemsIndexArray[2]) ? this.itemsIndexArray[2].endIndex : 11);
    }

    private showSelectionTool(enableSelectionTool: boolean): void {
        this.isSelectionBtnVisible = enableSelectionTool;
        //For mobile devices, the default previous value for SelectionTool has been passed as (13,13).
        this.applyHideToToolbar(enableSelectionTool, !isNullOrUndefined(this.itemsIndexArray[3]) ?
            this.itemsIndexArray[3].startIndex : 13, !isNullOrUndefined(this.itemsIndexArray[3]) ? this.itemsIndexArray[3].endIndex : 13);
    }

    private showScrollingTool(enableScrollingTool: boolean): void {
        this.isScrollingBtnVisible = enableScrollingTool;
        //For mobile devices, the default previous value for ScrollingTool has been passed as (14,14).
        this.applyHideToToolbar(enableScrollingTool, !isNullOrUndefined(this.itemsIndexArray[4]) ?
            this.itemsIndexArray[4].startIndex : 14, !isNullOrUndefined(this.itemsIndexArray[4]) ? this.itemsIndexArray[4].endIndex : 14);
    }

    private showDownloadOption(enableDownloadOption: boolean): void {
        this.isDownloadBtnVisible = enableDownloadOption;
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            //The itemsIndexArray is null, the default previous value for DownloadOption has been passed as (26,26).
            this.applyHideToToolbar(enableDownloadOption, !isNullOrUndefined(this.itemsIndexArray[12]) ?
                this.itemsIndexArray[12].startIndex : 26, !isNullOrUndefined(this.itemsIndexArray[12]) ?
                this.itemsIndexArray[12].endIndex : 26);
        } else {
            this.applyHideToToolbar(enableDownloadOption, 6, 6);
        }
    }

    private showPageOrganizerToolbar(enablePageOrganizer: boolean): void {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.applyHideToToolbar(enablePageOrganizer, 4, 4);
        }
    }

    private showPrintOption(enablePrintOption: boolean): void {
        this.isPrintBtnVisible = enablePrintOption;
        //For mobile devices, the default previous value for PrintOption has been passed as (25,25).
        this.applyHideToToolbar(enablePrintOption, !isNullOrUndefined(this.itemsIndexArray[11]) ?
            this.itemsIndexArray[11].startIndex : 25, !isNullOrUndefined(this.itemsIndexArray[11]) ?
            this.itemsIndexArray[11].endIndex : 25);
    }

    private showSearchOption(enableSearchOption: boolean): void {
        this.isSearchBtnVisible = enableSearchOption;
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            //The itemsIndexArray is null, the default previous value for SearchOption has been passed as (22,22).
            this.applyHideToToolbar(enableSearchOption, !isNullOrUndefined(this.itemsIndexArray[8]) ?
                this.itemsIndexArray[8].startIndex : 22, !isNullOrUndefined(this.itemsIndexArray[8]) ?
                this.itemsIndexArray[8].endIndex : 22);
        } else {
            this.applyHideToToolbar(enableSearchOption, 6, 6);
        }
    }

    private showUndoRedoTool(isEnable: boolean): void {
        this.isUndoRedoBtnsVisible = isEnable;
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            //The itemsIndexArray is null, the default previous value for PageNavigationTool has been passed as (16,17).
            this.applyHideToToolbar(isEnable, !isNullOrUndefined(this.itemsIndexArray[5]) ? this.itemsIndexArray[5].startIndex : 16,
                                    !isNullOrUndefined(this.itemsIndexArray[5]) ? this.itemsIndexArray[5].endIndex : 17);
        } else {
            this.applyHideToToolbar(isEnable, 2, 3);
        }
    }

    private showCommentOption(isEnable: boolean): void {
        if (!this.pdfViewer.enableStickyNotesAnnotation) {
            this.isCommentBtnVisible = isEnable;
            //For mobile devices, the default previous value for CommentOption has been passed as (18,19).
            this.applyHideToToolbar(this.pdfViewer.enableStickyNotesAnnotation, !isNullOrUndefined(this.itemsIndexArray[6]) ?
                this.itemsIndexArray[6].startIndex : 18, !isNullOrUndefined(this.itemsIndexArray[6]) ?
                this.itemsIndexArray[6].endIndex : 19);
        } else {
            this.isCommentBtnVisible = isEnable;
            //For mobile devices, the default previous value for CommentOption has been passed as (18,19).
            this.applyHideToToolbar(isEnable, !isNullOrUndefined(this.itemsIndexArray[6]) ? this.itemsIndexArray[6].startIndex : 18,
                                    !isNullOrUndefined(this.itemsIndexArray[6]) ? this.itemsIndexArray[6].endIndex : 19);
        }
    }

    private showAnnotationEditTool(isEnable: boolean): void {
        this.isAnnotationEditBtnVisible = isEnable;
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            //The itemsIndexArray is null, the default previous value for AnnotationEditTool has been passed as (23,23).
            this.applyHideToToolbar(isEnable, !isNullOrUndefined(this.itemsIndexArray[9]) ?
                this.itemsIndexArray[9].startIndex : 23, !isNullOrUndefined(this.itemsIndexArray[9]) ?
                this.itemsIndexArray[9].endIndex : 23);
        } else {
            this.applyHideToToolbar(isEnable, 5, 5);
        }
    }

    private showFormDesignerEditTool(isEnable: boolean): void {
        this.isFormDesignerEditBtnVisible = isEnable;
        //For mobile devices, the default previous value for FormDesignerEditTool has been passed as (24,24).
        this.applyHideToToolbar(isEnable, !isNullOrUndefined(this.itemsIndexArray[10]) ?
            this.itemsIndexArray[10].startIndex : 24, !isNullOrUndefined(this.itemsIndexArray[10]) ?
            this.itemsIndexArray[10].endIndex : 24);
    }

    private showSubmitForm(isEnable: boolean): void {
        this.isSubmitbtnvisible = isEnable;
        //For mobile devices, the default previous value for SubmitForm has been passed as (20,21).
        this.applyHideToToolbar(isEnable, !isNullOrUndefined(this.itemsIndexArray[7]) ?
            this.itemsIndexArray[7].startIndex : 20, !isNullOrUndefined(this.itemsIndexArray[7]) ?
            this.itemsIndexArray[7].endIndex : 21);
    }

    private enableOpenOption(enableOpenOption: boolean): void {
        this.enableItems(this.openDocumentItem.parentElement, enableOpenOption);
    }

    private enablePageNavigationTool(enablePageNavigationTool: boolean): void {
        this.enableItems(this.firstPageItem.parentElement, enablePageNavigationTool);
        this.enableItems(this.previousPageItem.parentElement, enablePageNavigationTool);
        this.enableItems(this.nextPageItem.parentElement, enablePageNavigationTool);
        this.enableItems(this.lastPageItem.parentElement, enablePageNavigationTool);
        this.currentPageBox.readonly = !enablePageNavigationTool;
    }

    private enableMagnificationTool(enableMagnificationTool: boolean): void {
        this.enableItems(this.zoomInItem.parentElement, enableMagnificationTool);
        this.enableItems(this.zoomOutItem.parentElement, enableMagnificationTool);
        this.zoomDropDown.readonly = !enableMagnificationTool;
    }

    private enableSelectionTool(enableSelectionTool: boolean): void {
        if (this.textSelectItem && this.textSelectItem.parentElement) {
            this.enableItems(this.textSelectItem.parentElement, enableSelectionTool);
        }
    }

    private enableScrollingTool(enableScrollingTool: boolean): void {
        this.enableItems(this.panItem.parentElement, enableScrollingTool);
    }

    private enableDownloadOption(enableDownloadOption: boolean): void {
        this.enableItems(this.downloadItem.parentElement, enableDownloadOption);
    }

    private enablePrintOption(enablePrintOption: boolean): void {
        this.enableItems(this.printItem.parentElement, enablePrintOption);
    }

    private enableSearchOption(enableSearchOption: boolean): void {
        this.enableItems(this.textSearchItem.parentElement, enableSearchOption);
    }

    private enableUndoRedoTool(isEnable: boolean): void {
        this.enableItems(this.undoItem.parentElement, isEnable);
        this.enableItems(this.redoItem.parentElement, isEnable);
    }

    private enableAnnotationEditTool(isEnable: boolean): void {
        this.enableItems(this.annotationItem.parentElement, isEnable);
    }

    private enableFormDesignerEditTool(isEnable: boolean): void {
        this.enableItems(this.formDesignerItem.parentElement, isEnable);
    }

    private enableCommentsTool(isEnable: boolean): void {
        if (this.pdfViewer.enableStickyNotesAnnotation) {
            this.enableItems(this.annotationItem.parentElement, isEnable);
        }
    }

    private enableOrganizePagesButton(isEnable: boolean): void {
        if (!isNullOrUndefined(this.organizePageItem) && !isNullOrUndefined(this.organizePageItem.parentElement) &&
         this.pdfViewer.enablePageOrganizer) {
            this.enableItems(this.organizePageItem.parentElement, isEnable);
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public resetToolbar(): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (!isNullOrUndefined(this.currentPageBox)) {
                this.currentPageBox.min = 0;
                this.currentPageBox.value = 0;
            }
            this.updateTotalPage();
            this.updateToolbarItems();
            if (this.annotationToolbarModule) {
                this.annotationToolbarModule.clear();
            } else {
                if (this.annotationToolbarModule) {
                    if (this.annotationToolbarModule.propertyToolbar) {
                        this.annotationToolbarModule.propertyToolbar.destroy();
                    }
                    const commentsContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commentscontentcontainer');
                    if (commentsContainer) {
                        commentsContainer.innerHTML = '';
                    }
                }
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public updateToolbarItems(): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (this.toolbar) {
                if (this.pdfViewerBase.pageCount === 0) {
                    this.enableItems(this.downloadItem.parentElement, false);
                    this.enableItems(this.printItem.parentElement, false);
                    this.enableItems(this.commentItem.parentElement, false);
                    this.updateUndoRedoButtons();
                    this.updateNavigationButtons();
                    this.enableItems(this.zoomInItem.parentElement, false);
                    this.enableItems(this.zoomOutItem.parentElement, false);
                    if (this.pdfViewer.magnificationModule) {
                        this.zoomDropDown.readonly = true;
                    }
                    this.enableItems(this.submitItem.parentElement, false);
                    this.toolbar.enableItems(this.pdfViewerBase.getElement('_currentPageInputContainer'), false);
                    this.enableItems(this.pdfViewerBase.getElement('_zoomDropDownContainer'), false);
                    this.enableItems(this.textSelectItem.parentElement, false);
                    this.enableItems(this.annotationItem.parentElement, false);
                    this.enableItems(this.formDesignerItem.parentElement, false);
                    this.enableItems(this.panItem.parentElement, false);
                    this.enableItems(this.textSearchItem.parentElement, false);
                    this.deSelectItem(this.annotationItem);
                    if (this.annotationToolbarModule) {
                        this.annotationToolbarModule.resetToolbar();
                    }
                    this.deSelectItem(this.formDesignerItem);
                    if (this.formDesignerToolbarModule) {
                        this.formDesignerToolbarModule.resetFormDesignerToolbar();
                    }
                } else if (this.pdfViewerBase.pageCount > 0) {
                    const obj: HTMLElement = this.pdfViewerBase.getElement('_currentPageInputContainer');
                    if (obj) {
                        this.enableItems(this.downloadItem.parentElement, true);
                        this.enableItems(this.printItem.parentElement, true);
                        this.toolbar.enableItems(this.pdfViewerBase.getElement('_currentPageInputContainer'), true);
                        this.enableItems(this.pdfViewerBase.getElement('_zoomDropDownContainer'), true);
                        this.updateUndoRedoButtons();
                        this.updateNavigationButtons();
                        this.updateZoomButtons();
                        if (this.pdfViewer.magnificationModule) {
                            this.zoomDropDown.readonly = false;
                        }
                        this.updateInteractionItems();
                        // modify this condition if new annotation types are added.
                        if (this.pdfViewer.annotationModule && this.pdfViewer.enableAnnotation) {
                            this.enableItems(this.annotationItem.parentElement, true);
                        }
                        if (this.pdfViewer.formDesignerModule && this.pdfViewer.enableFormDesigner) {
                            this.enableItems(this.formDesignerItem.parentElement, true);
                        }
                        if (this.pdfViewer.textSearchModule && this.pdfViewer.enableTextSearch) {
                            this.enableItems(this.textSearchItem.parentElement, true);
                        }
                        if (this.pdfViewer.annotationModule && this.pdfViewer.enableStickyNotesAnnotation) {
                            this.enableItems(this.commentItem.parentElement, true);
                        }
                    }
                }
                if (this.pdfViewer.toolbarSettings.annotationToolbarItems) {
                    if (this.pdfViewer.toolbarSettings.annotationToolbarItems.length === 0 ||
                         !this.pdfViewer.annotationModule || !this.pdfViewer.enableAnnotationToolbar) {
                        this.enableToolbarItem(['AnnotationEditTool'], false);
                    }
                }
                if (this.pdfViewer.toolbarSettings.formDesignerToolbarItems) {
                    if (this.pdfViewer.toolbarSettings.formDesignerToolbarItems.length === 0 ||
                         !this.pdfViewer.formDesignerModule || !this.pdfViewer.enableFormDesignerToolbar) {
                        this.enableToolbarItem(['FormDesignerEditTool'], false);
                    }
                }
                if (!this.pdfViewer.enableDownload) {
                    this.enableDownloadOption(false);
                }
                if (!this.pdfViewer.enablePrint) {
                    this.enablePrintOption(false);
                }
            }
        } else {
            if (this.pdfViewerBase.pageCount === 0) {
                this.enableItems(this.textSearchItem.parentElement, false);
                this.enableItems(this.moreOptionItem.parentElement, false);
                this.enableItems(this.annotationItem.parentElement, false);
            } else if (this.pdfViewerBase.pageCount > 0) {
                this.enableItems(this.textSearchItem.parentElement, true);
                this.enableItems(this.moreOptionItem.parentElement, true);
                if (this.pdfViewer.annotationModule && this.pdfViewer.enableAnnotation) {
                    this.enableItems(this.annotationItem.parentElement, true);
                }
                if (!this.pdfViewer.annotationModule || !this.pdfViewer.enableAnnotationToolbar) {
                    this.enableToolbarItem(['AnnotationEditTool'], false);
                }
                this.updateUndoRedoButtons();
                if (this.pdfViewer && this.pdfViewer.element && this.pdfViewer.element.id && this.pdfViewer.isAnnotationToolbarOpen) {
                    const annotationId: string = this.pdfViewer.element.id + '_annotationIcon';
                    this.annotationToolbarModule.createAnnotationToolbarForMobile(annotationId);
                }
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public updateNavigationButtons(): void {
        if (this.pdfViewer.navigationModule && !this.isPageNavigationToolDisabled) {
            if (this.pdfViewerBase.pageCount === 0 || (this.pdfViewerBase.currentPageNumber === 1 && this.pdfViewerBase.pageCount === 1)) {
                this.enableItems(this.firstPageItem.parentElement, false);
                this.enableItems(this.previousPageItem.parentElement, false);
                this.enableItems(this.nextPageItem.parentElement, false);
                this.enableItems(this.lastPageItem.parentElement, false);
            } else if (this.pdfViewerBase.currentPageNumber === 1 && this.pdfViewerBase.pageCount > 0) {
                this.enableItems(this.firstPageItem.parentElement, false);
                this.enableItems(this.previousPageItem.parentElement, false);
                this.enableItems(this.nextPageItem.parentElement, true);
                this.enableItems(this.lastPageItem.parentElement, true);
            } else if (this.pdfViewerBase.currentPageNumber === this.pdfViewerBase.pageCount && this.pdfViewerBase.pageCount > 0) {
                this.enableItems(this.firstPageItem.parentElement, true);
                this.enableItems(this.previousPageItem.parentElement, true);
                this.enableItems(this.nextPageItem.parentElement, false);
                this.enableItems(this.lastPageItem.parentElement, false);
            } else if (this.pdfViewerBase.currentPageNumber > 1 && this.pdfViewerBase.currentPageNumber < this.pdfViewerBase.pageCount) {
                this.enableItems(this.firstPageItem.parentElement, true);
                this.enableItems(this.previousPageItem.parentElement, true);
                this.enableItems(this.nextPageItem.parentElement, true);
                this.enableItems(this.lastPageItem.parentElement, true);
            }
        } else {
            this.enableItems(this.firstPageItem.parentElement, false);
            this.enableItems(this.previousPageItem.parentElement, false);
            this.enableItems(this.nextPageItem.parentElement, false);
            this.enableItems(this.lastPageItem.parentElement, false);
            this.currentPageBox.readonly = true;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public updateZoomButtons(): void {
        if (this.pdfViewer.magnificationModule && !this.isMagnificationToolDisabled && (!Browser.isDevice ||
             this.pdfViewer.enableDesktopMode)) {
            if (this.pdfViewer.minZoom != null || this.pdfViewer.maxZoom != null) {
                if (this.pdfViewer.magnificationModule.zoomFactor <= this.pdfViewer.minZoom / 100) {
                    this.enableItems(this.zoomInItem.parentElement, true);
                    this.enableItems(this.zoomOutItem.parentElement, false);
                } else if (this.pdfViewer.magnificationModule.zoomFactor >= this.pdfViewer.maxZoom / 100) {
                    this.enableItems(this.zoomInItem.parentElement, false);
                    this.enableItems(this.zoomOutItem.parentElement, true);
                } else {
                    this.enableItems(this.zoomInItem.parentElement, true);
                    this.enableItems(this.zoomOutItem.parentElement, true);
                }
            }
            else {
                if (this.pdfViewer.magnificationModule.zoomFactor <= 0.1) {
                    this.enableItems(this.zoomInItem.parentElement, true);
                    this.enableItems(this.zoomOutItem.parentElement, false);
                } else if (this.pdfViewer.magnificationModule.zoomFactor >= 4) {
                    this.enableItems(this.zoomInItem.parentElement, false);
                    this.enableItems(this.zoomOutItem.parentElement, true);
                } else {
                    this.enableItems(this.zoomInItem.parentElement, true);
                    this.enableItems(this.zoomOutItem.parentElement, true);
                }
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public updateUndoRedoButtons(): void {
        if (this.pdfViewer.annotationModule) {
            if (this.pdfViewerBase.pageCount > 0) {
                if (isBlazor()) {
                    this.enableCollectionAvailableInBlazor(this.pdfViewer.annotationModule.actionCollection, 'undo');
                    this.enableCollectionAvailableInBlazor(this.pdfViewer.annotationModule.redoCollection, 'redo');
                } else {
                    if (!isNullOrUndefined(this.undoItem) && !isNullOrUndefined(this.undoItem.parentElement)) {
                        this.enableCollectionAvailable(this.pdfViewer.annotationModule.actionCollection, this.undoItem.parentElement);
                    }
                    if (!isNullOrUndefined(this.redoItem) && !isNullOrUndefined(this.redoItem.parentElement)) {
                        this.enableCollectionAvailable(this.pdfViewer.annotationModule.redoCollection, this.redoItem.parentElement);
                    }
                }
            } else {
                if (isBlazor()) {
                    //this.pdfViewer._dotnetInstance.invokeMethodAsync('DisableUndoRedoButton', null);
                    this.pdfViewerBase.blazorUIAdaptor.disableUndoRedoButton();
                } else {
                    this.disableUndoRedoButtons();
                }
            }
        } else {
            if (isBlazor()) {
                //this.pdfViewer._dotnetInstance.invokeMethodAsync('DisableUndoRedoButton', null);
                this.pdfViewerBase.blazorUIAdaptor.disableUndoRedoButton();
            } else {
                this.disableUndoRedoButtons();
            }
        }
    }

    private enableCollectionAvailable(collection: any[], item: HTMLElement): void {
        if (collection.length > 0) {
            this.toolbar.enableItems(item, true);
        } else {
            this.toolbar.enableItems(item, false);
        }
    }

    private enableCollectionAvailableInBlazor(collection: any[], item: string): void {
        if (collection.length > 0) {
            //this.pdfViewer._dotnetInstance.invokeMethodAsync('UpdateUndoRedoButton', item, true);
            this.pdfViewerBase.blazorUIAdaptor.updateUndoRedoButton(item, true);
        } else {
            // this.pdfViewer._dotnetInstance.invokeMethodAsync('UpdateUndoRedoButton', item, false);
            this.pdfViewerBase.blazorUIAdaptor.updateUndoRedoButton(item, false);
        }
    }
    private disableUndoRedoButtons(): void {
        this.enableItems(this.undoItem.parentElement, false);
        this.enableItems(this.redoItem.parentElement, false);
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (!isBlazor()) {
            this.unWireEvent();
            this.destroyComponent();
            if (this.moreDropDown) {
                this.moreDropDown.destroy();
            }
            if (this.annotationToolbarModule) {
                this.annotationToolbarModule.destroy();
            }
            if (this.formDesignerToolbarModule) {
                this.formDesignerToolbarModule.destroy();
            }
            if (this.toolbar) {
                this.toolbar.destroy();
            }
            if (this.toolbarElement) {
                this.toolbarElement.parentElement.removeChild(this.toolbarElement);
            }
        }
    }

    private destroyComponent(): void {
        const componentElement: any = [this.openDocumentItem, this.firstPageItem, this.previousPageItem, this.nextPageItem,
            this.lastPageItem, this.currentPageBoxElement, this.zoomOutItem, this.zoomInItem, this.zoomDropdownItem, this.textSelectItem,
            this.panItem, this.submitItem, this.undoItem, this.redoItem, this.commentItem, this.textSearchItem, this.annotationItem,
            this.formDesignerItem, this.printItem, this.downloadItem];
        for (let i: number = 0; i < componentElement.length; i++) {
            if (componentElement[parseInt(i.toString(), 10)]) {
                this.destroyDependentComponent(componentElement[parseInt(i.toString(), 10)]);
            }
        }
    }

    private destroyDependentComponent(component: any): void {
        if (component.ej2_instances) {
            for (let i: number = component.ej2_instances.length - 1; i >= 0; i--) {
                component.ej2_instances[parseInt(i.toString(), 10)].destroy();
            }
        }
    }

    /**
     * @param {number} pageIndex - It describes about the page index
     * @private
     * @returns {void}
     */
    public updateCurrentPage(pageIndex: number): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (!isBlazor()) {
                if (!isNullOrUndefined(this.currentPageBox)) {
                    if (this.currentPageBox.value === pageIndex) {
                        (this.currentPageBoxElement as HTMLInputElement).value = pageIndex.toString();
                    }
                    this.currentPageBox.value = pageIndex;
                }
            } else {
                //this.pdfViewer._dotnetInstance.invokeMethodAsync('OnPageChanged', pageIndex);
                this.pdfViewerBase.blazorUIAdaptor.pageChanged(pageIndex);
            }
            this.pdfViewerBase.currentPageNumber = pageIndex;
            this.pdfViewer.currentPageNumber = pageIndex;
        } else {
            this.pdfViewerBase.mobileSpanContainer.innerHTML = pageIndex.toString();
            this.pdfViewerBase.mobilecurrentPageContainer.innerHTML = pageIndex.toString();
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public updateTotalPage(): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (this.pdfViewerBase.pageCount > 0) {
                if (!isNullOrUndefined(this.currentPageBox))
                {this.currentPageBox.min = 1; }
            }
            if (!isNullOrUndefined(this.totalPageItem))
            {this.totalPageItem.textContent = this.pdfViewer.localeObj.getConstant('of') + this.pdfViewerBase.pageCount.toString(); }
        }
    }

    /**
     * @param {event} event - It describes about the event
     * @private
     * @returns {void}
     */
    public openFileDialogBox(event: Event): void {
        event.preventDefault();
        this.fileInputElement.click();
    }

    private createToolbar(controlWidth: string | number): HTMLElement {
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_toolbarContainer', className: 'e-pv-toolbar' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.toolbar = new tool({
                clicked: this.toolbarClickHandler, width: '', height: '', overflowMode: 'Popup', cssClass: 'e-pv-toolbar-scroll',
                items: this.createToolbarItems(), created: () => {
                    this.createZoomDropdown();
                    this.createNumericTextBox();
                    this.toolbar.refreshOverflow();
                }
            });
            this.toolbar.isStringTemplate = true;
            if (this.pdfViewer.enableRtl) {
                this.toolbar.enableRtl = true;
            }
            this.toolbar.appendTo(this.toolbarElement);
            this.applyToolbarSettings();
            this.afterToolbarCreation();
            this.updateTotalPage();
            this.toolbarElement.addEventListener('keydown', this.onToolbarKeydown);
            this.toolbarElement.setAttribute('aria-label', 'Toolbar');
        } else {
            this.createToolbarItemsForMobile();
            this.afterToolbarCreationInMobile();
            if (this.pdfViewer.enableRtl) {
                this.toolbar.enableRtl = true;
            }
            this.applyToolbarSettingsForMobile();
            this.disableUndoRedoButtons();
        }
        return this.toolbarElement;
    }

    /**
     * Create a custom toolbar item in the PdfViewer
     *
     * @param  {number} startIndex - It describes about the start index
     * @returns {void}
     */
    private createCustomItem(startIndex: number): any {
        for (let j: number = startIndex; j < this.pdfViewer.toolbarSettings.toolbarItems.length; j++) {
            if (typeof (this.pdfViewer.toolbarSettings.toolbarItems[parseInt(j.toString(), 10)]) === 'object') {
                const customToolbarItem: CustomToolbarItemModel =
                 (this.pdfViewer.toolbarSettings.toolbarItems[parseInt(j.toString(), 10)] as CustomToolbarItemModel);
                if (!isNullOrUndefined(customToolbarItem.prefixIcon) && customToolbarItem.prefixIcon !== '') {
                    customToolbarItem.prefixIcon += ' e-pv-icon';
                }
                //Generate a text button template
                if ((isNullOrUndefined(customToolbarItem.prefixIcon) || customToolbarItem.prefixIcon === '') && isNullOrUndefined(customToolbarItem.template)) {
                    const text: string = !isNullOrUndefined(customToolbarItem.text) ? customToolbarItem.text : 'Custom Toolbar Item';
                    customToolbarItem.template = '<button id="Custom" class="e-tbar-btn" style="font-size:14px"><span>' + text + '</span></button>';
                }
                this.toolItems.push(customToolbarItem);
                if (isNullOrUndefined(customToolbarItem.align) || customToolbarItem.align === 'left' || customToolbarItem.align === 'Left') {
                    this.toolItems.push({ type: 'Separator', align: 'Left' });
                }
            }
            else {
                break;
            }
        }
    }

    private createToolbarItems(): any {
        const currentPageInputTemplate: string = this.createCurrentPageInputTemplate();
        const totalPageTemplate: string = this.createTotalPageTemplate();
        const zoomDropDownTemplateString: string = this.createZoomDropdownElement();
        const submitButton: string = '<button id="' + this.pdfViewer.element.id + '_submitForm" class="e-tbar-btn" style="font-size:15px"><span id="' + this.pdfViewer.element.id + '_submitFormSpan" class="e-tbar-btn-text e-pv-submitform-text">' + this.pdfViewer.localeObj.getConstant('SubmitForm') + '</span></button>';
        const defaultToolbarOrder: any = ['OpenOption', 'PageNavigationTool', 'MagnificationTool', 'SelectionTool', 'PanTool', 'UndoRedoTool', 'CommentTool', 'SubmitForm', 'SearchOption', 'AnnotationEditTool', 'FormDesignerEditTool', 'PrintOption', 'DownloadOption'];
        for (let i: number = 0; i < defaultToolbarOrder.length; i++) {
            if (i === 0) {
                this.createCustomItem(i);
            }
            const toolbarItemOrder: number = i;
            switch (toolbarItemOrder) {
            case 0:
                this.itemsIndexArray.push({ item: 'OpenOption', startIndex: this.toolItems.length, endIndex: this.toolItems.length });
                this.toolItems.push({ prefixIcon: 'e-pv-open-document-icon e-pv-icon', cssClass: 'e-pv-open-document-container', id: this.pdfViewer.element.id + '_open', text: this.pdfViewer.localeObj.getConstant('Open text'), align: 'Left' });
                this.toolItems.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-open-separator-container' });
                break;
            case 1:
                if (!this.pdfViewer.enableRtl) {
                    this.itemsIndexArray.push({ item: 'PageNavigationTool', startIndex: this.toolItems.length, endIndex: this.toolItems.length + 5 });
                    this.toolItems.push({ prefixIcon: 'e-pv-first-page-navigation-icon e-pv-icon', cssClass: 'e-pv-first-page-navigation-container', id: this.pdfViewer.element.id + '_firstPage', text: this.pdfViewer.localeObj.getConstant('First text'), align: 'Left' });
                    this.toolItems.push({ prefixIcon: 'e-pv-previous-page-navigation-icon e-pv-icon', cssClass: 'e-pv-previous-page-navigation-container', id: this.pdfViewer.element.id + '_previousPage', text: this.pdfViewer.localeObj.getConstant('Previous text'), align: 'Left' });
                    this.toolItems.push({ prefixIcon: 'e-pv-next-page-navigation-icon e-pv-icon', cssClass: 'e-pv-next-page-navigation-container', id: this.pdfViewer.element.id + '_nextPage', text: this.pdfViewer.localeObj.getConstant('Next text'), align: 'Left' });
                    this.toolItems.push({ prefixIcon: 'e-pv-last-page-navigation-icon e-pv-icon', cssClass: 'e-pv-last-page-navigation-container', id: this.pdfViewer.element.id + '_lastPage', text: this.pdfViewer.localeObj.getConstant('Last text'), align: 'Left' });
                    this.toolItems.push({ template: currentPageInputTemplate, align: 'Left', cssClass: 'e-pv-current-page-container' });
                    this.toolItems.push({ template: totalPageTemplate, align: 'Left', cssClass: 'e-pv-total-page-container' });
                } else {
                    this.toolItems.push({ prefixIcon: 'e-pv-last-page-navigation-icon e-pv-icon', cssClass: 'e-pv-last-page-navigation-container', id: this.pdfViewer.element.id + '_firstPage', text: this.pdfViewer.localeObj.getConstant('First text'), align: 'Left' });
                    this.toolItems.push({ prefixIcon: 'e-pv-next-page-navigation-icon e-pv-icon', cssClass: 'e-pv-next-page-navigation-container', id: this.pdfViewer.element.id + '_previousPage', text: this.pdfViewer.localeObj.getConstant('Previous text'), align: 'Left' });
                    this.toolItems.push({ prefixIcon: 'e-pv-previous-page-navigation-icon e-pv-icon', cssClass: 'e-pv-previous-page-navigation-container', id: this.pdfViewer.element.id + '_nextPage', text: this.pdfViewer.localeObj.getConstant('Next text'), align: 'Left' });
                    this.toolItems.push({ prefixIcon: 'e-pv-first-page-navigation-icon e-pv-icon', cssClass: 'e-pv-first-page-navigation-container', id: this.pdfViewer.element.id + '_lastPage', text: this.pdfViewer.localeObj.getConstant('Last text'), align: 'Left' });
                    this.toolItems.push({ template: totalPageTemplate, align: 'Left', cssClass: 'e-pv-total-page-container' });
                    this.toolItems.push({ template: currentPageInputTemplate, align: 'Left', cssClass: 'e-pv-current-page-container' });
                }
                this.toolItems.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-navigation-separator-container' });
                break;
            case 2:
                this.itemsIndexArray.push({ item: 'MagnificationTool', startIndex: this.toolItems.length, endIndex: this.toolItems.length + 2 });
                this.toolItems.push({ prefixIcon: 'e-pv-zoom-out-icon e-pv-icon', cssClass: 'e-pv-zoom-out-container', id: this.pdfViewer.element.id + '_zoomOut', text: this.pdfViewer.localeObj.getConstant('Zoom out text'), align: 'Left' });
                this.toolItems.push({ prefixIcon: 'e-pv-zoom-in-icon e-pv-icon', cssClass: 'e-pv-zoom-in-container', id: this.pdfViewer.element.id + '_zoomIn', text: this.pdfViewer.localeObj.getConstant('Zoom in text'), align: 'Left' });
                this.toolItems.push({ template: zoomDropDownTemplateString, cssClass: 'e-pv-zoom-drop-down-container', align: 'Left' });
                this.toolItems.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-magnification-separator-container' });
                break;
            case 3:
                this.itemsIndexArray.push({ item: 'SelectionTool', startIndex: this.toolItems.length, endIndex: this.toolItems.length });
                this.toolItems.push({ prefixIcon: 'e-pv-text-select-tool-icon e-pv-icon', cssClass: 'e-pv-text-select-tool-container', id: this.pdfViewer.element.id + '_selectTool', text: this.pdfViewer.localeObj.getConstant('Selection text') });
                break;
            case 4:
                this.itemsIndexArray.push({ item: 'PanTool', startIndex: this.toolItems.length, endIndex: this.toolItems.length });
                this.toolItems.push({ prefixIcon: 'e-pv-pan-tool-icon e-pv-icon', cssClass: 'e-pv-pan-tool-container', id: this.pdfViewer.element.id + '_handTool', text: this.pdfViewer.localeObj.getConstant('Pan text') });
                this.toolItems.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-pan-separator-container' });
                break;
            case 5:
                this.itemsIndexArray.push({ item: 'UndoRedoTool', startIndex: this.toolItems.length, endIndex: this.toolItems.length + 1 });
                this.toolItems.push({ prefixIcon: 'e-pv-undo-icon e-pv-icon', cssClass: 'e-pv-undo-container', id: this.pdfViewer.element.id + '_undo', text: this.pdfViewer.localeObj.getConstant('Undo'), align: 'Left' });
                this.toolItems.push({ prefixIcon: 'e-pv-redo-icon e-pv-icon', cssClass: 'e-pv-redo-container', id: this.pdfViewer.element.id + '_redo', text: this.pdfViewer.localeObj.getConstant('Redo'), align: 'Left' });
                this.toolItems.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-undo-separator-container' });
                break;
            case 6:
                this.itemsIndexArray.push({ item: 'CommentTool', startIndex: this.toolItems.length, endIndex: this.toolItems.length + 1 });
                this.toolItems.push({ prefixIcon: 'e-pv-comment-icon e-pv-icon', cssClass: 'e-pv-comment-container', id: this.pdfViewer.element.id + '_comment', text: this.pdfViewer.localeObj.getConstant('Add Comments'), align: 'Left' });
                this.toolItems.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-comment-separator-container' });
                break;
            case 7:
                this.itemsIndexArray.push({ item: 'SubmitForm', startIndex: this.toolItems.length, endIndex: this.toolItems.length });
                this.toolItems.push({ template: submitButton, cssClass: 'e-pv-submit', align: 'Left' });
                break;
            case 8:
                this.itemsIndexArray.push({ item: 'SearchOption', startIndex: this.toolItems.length, endIndex: this.toolItems.length });
                this.toolItems.push({ prefixIcon: 'e-pv-text-search-icon e-pv-icon', cssClass: 'e-pv-text-search-container', id: this.pdfViewer.element.id + '_search', text: this.pdfViewer.localeObj.getConstant('Search text'), align: 'Right' });
                break;
            case 9:
                this.itemsIndexArray.push({ item: 'AnnotationEditTool', startIndex: this.toolItems.length, endIndex: this.toolItems.length });
                this.toolItems.push({ prefixIcon: 'e-pv-annotation-icon e-pv-icon', cssClass: 'e-pv-annotation-container', id: this.pdfViewer.element.id + '_annotation', text: this.pdfViewer.localeObj.getConstant('Annotation Edit text'), align: 'Right' });
                break;
            case 10:
                this.itemsIndexArray.push({ item: 'FormDesignerEditTool', startIndex: this.toolItems.length, endIndex: this.toolItems.length });
                this.toolItems.push({ prefixIcon: 'e-pv-formdesigner-icon e-pv-icon', cssClass: 'e-pv-formdesigner-container', id: this.pdfViewer.element.id + '_formdesigner', text: this.pdfViewer.localeObj.getConstant('FormDesigner Edit text'), align: 'Right' });
                break;
            case 11:
                this.itemsIndexArray.push({ item: 'PrintOption', startIndex: this.toolItems.length, endIndex: this.toolItems.length });
                this.toolItems.push({ prefixIcon: 'e-pv-print-document-icon e-pv-icon', cssClass: 'e-pv-print-document-container', id: this.pdfViewer.element.id + '_print', text: this.pdfViewer.localeObj.getConstant('Print text'), align: 'Right' });
                break;
            case 12:
                this.itemsIndexArray.push({ item: 'DownloadOption', startIndex: this.toolItems.length, endIndex: this.toolItems.length });
                this.toolItems.push({ prefixIcon: 'e-pv-download-document-icon e-pv-icon', cssClass: 'e-pv-download-document-container', id: this.pdfViewer.element.id + '_download', text: this.pdfViewer.localeObj.getConstant('Download'), align: 'Right' });
                break;
            }
            for (let k: number = 0; k < this.pdfViewer.toolbarSettings.toolbarItems.length; k++) {
                if (defaultToolbarOrder[parseInt(i.toString(), 10)] ===
                this.pdfViewer.toolbarSettings.toolbarItems[parseInt(k.toString(), 10)]) {
                    if (typeof (this.pdfViewer.toolbarSettings.toolbarItems[k + 1]) === 'object') {
                        this.createCustomItem(k + 1);
                    }
                    else {
                        break;
                    }
                }
            }
        }
        return this.toolItems;
    }

    private afterToolbarCreationInMobile(): void {
        this.itemsContainer = this.toolbar.element.childNodes[0] as HTMLElement;
        this.itemsContainer.id = this.pdfViewer.element.id + '_toolbarItemsContainer';
        this.openDocumentItem = this.addClassToolbarItem('_open', 'e-pv-open-document', this.pdfViewer.localeObj.getConstant('Open'));
        this.undoItem = this.addClassToolbarItem('_undo', 'e-pv-undo', this.pdfViewer.localeObj.getConstant('Undo'));
        this.redoItem = this.addClassToolbarItem('_redo', 'e-pv-redo', this.pdfViewer.localeObj.getConstant('Redo'));
        this.annotationItem = this.addClassToolbarItem('_annotation', 'e-pv-annotation', this.pdfViewer.localeObj.getConstant('Annotation'));
        this.textSearchItem = this.addClassToolbarItem('_search', 'e-pv-text-search', this.pdfViewer.localeObj.getConstant('Text Search'));
    }

    private afterToolbarCreation(): void {
        const isMac: boolean = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
        this.itemsContainer = this.toolbar.element.childNodes[0] as HTMLElement;
        this.itemsContainer.id = this.pdfViewer.element.id + '_toolbarItemsContainer';
        this.openDocumentItem = this.addClassToolbarItem('_open', 'e-pv-open-document', this.pdfViewer.localeObj.getConstant('Open') + (isMac ? ' (⌘+O)' : ' (Ctrl+O)'));
        this.undoItem = this.addClassToolbarItem('_undo', 'e-pv-undo', this.pdfViewer.localeObj.getConstant('Undo') + (isMac ? ' (⌘+Z)' : ' (Ctrl+Z)'));
        this.redoItem = this.addClassToolbarItem('_redo', 'e-pv-redo', this.pdfViewer.localeObj.getConstant('Redo') + (isMac ? ' (⌘+Y)' : ' (Ctrl+Y)'));
        if (!this.pdfViewer.enableRtl) {
            this.firstPageItem = this.addClassToolbarItem('_firstPage', 'e-pv-first-page-navigation', this.pdfViewer.localeObj.getConstant('Go To First Page') + (isMac ? ' (⌘+← or ⌘+↑)' : ' (Ctrl+← or Ctrl+↑)'));
            this.previousPageItem = this.addClassToolbarItem('_previousPage', 'e-pv-previous-page-navigation', this.pdfViewer.localeObj.getConstant('Previous Page') + (' (←)'));
            this.nextPageItem = this.addClassToolbarItem('_nextPage', 'e-pv-next-page-navigation', this.pdfViewer.localeObj.getConstant('Next Page') + (' (→)'));
            this.lastPageItem = this.addClassToolbarItem('_lastPage', 'e-pv-last-page-navigation', this.pdfViewer.localeObj.getConstant('Go To Last Page') + (isMac ? ' (⌘+→ or ⌘+↓)' : ' (Ctrl+→ or Ctrl+↓)'));
        } else {
            this.firstPageItem = this.addClassToolbarItem('_firstPage', 'e-pv-last-page-navigation', this.pdfViewer.localeObj.getConstant('Go To First Page') + (isMac ? ' (⌘+← or ⌘+↑)' : ' (Ctrl+← or Ctrl+↑)'));
            this.previousPageItem = this.addClassToolbarItem('_previousPage', 'e-pv-next-page-navigation', this.pdfViewer.localeObj.getConstant('Previous Page') + (' (←)'));
            this.nextPageItem = this.addClassToolbarItem('_nextPage', 'e-pv-previous-page-navigation', this.pdfViewer.localeObj.getConstant('Next Page') + (' (→)'));
            this.lastPageItem = this.addClassToolbarItem('_lastPage', 'e-pv-first-page-navigation', this.pdfViewer.localeObj.getConstant('Go To Last Page') + (isMac ? ' (⌘+→ or ⌘+↓)' : ' (Ctrl+→ or Ctrl+↓)'));
        }
        this.zoomOutItem = this.addClassToolbarItem('_zoomOut', 'e-pv-zoom-out', this.pdfViewer.localeObj.getConstant('Zoom Out') + (isMac ? ' (⌘+Minus)' : ' (Ctrl+Minus)'));
        this.zoomInItem = this.addClassToolbarItem('_zoomIn', 'e-pv-zoom-in', this.pdfViewer.localeObj.getConstant('Zoom In') + (isMac ? ' (⌘+Plus)' : ' (Ctrl+Plus)'));
        this.textSelectItem = this.addClassToolbarItem('_selectTool', 'e-pv-text-select-tool', this.pdfViewer.localeObj.getConstant('Text Selection') + (isMac ? ' (⇧+V)' : ' (Shift+V)'));
        this.panItem = this.addClassToolbarItem('_handTool', 'e-pv-pan-tool', this.pdfViewer.localeObj.getConstant('Panning') + (isMac ? ' (⇧+H)' : ' (Shift+H)'));
        this.commentItem = this.addClassToolbarItem('_comment', 'e-pv-comment', this.pdfViewer.localeObj.getConstant('Add Comments'));
        this.textSearchItem = this.addClassToolbarItem('_search', 'e-pv-text-search', this.pdfViewer.localeObj.getConstant('Text Search') + (isMac ? ' (⌘+F)' : ' (Ctrl+F)'));
        this.textSearchItem.setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('Search text'));
        this.annotationItem = this.addClassToolbarItem('_annotation', 'e-pv-annotation', this.pdfViewer.localeObj.getConstant('Annotation') + (isMac ? ' (⌘+⇧+A)' : ' (Ctrl+Shift+A)'));
        this.annotationItem.setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('Annotation Edit text'));
        this.formDesignerItem = this.addClassToolbarItem('_formdesigner', 'e-pv-formdesigner', this.pdfViewer.localeObj.getConstant('FormDesigner'));
        this.printItem = this.addClassToolbarItem('_print', 'e-pv-print-document', this.pdfViewer.localeObj.getConstant('Print') + (isMac ? ' (⌘+P)' : ' (Ctrl+P)'));
        this.downloadItem = this.addClassToolbarItem('_download', 'e-pv-download-document', this.pdfViewer.localeObj.getConstant('Download file') + (isMac ? ' (⌘+S)' : ' (Ctrl+S)'));
        this.zoomDropdownItem = this.pdfViewerBase.getElement('_zoomDropDown');
        this.createTooltip(this.zoomDropdownItem, this.pdfViewer.localeObj.getConstant('Zoom'));
        this.zoomDropdownItem.setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('Zoom'));
        this.addPropertiesToolItemContainer(this.zoomDropdownItem.parentElement.parentElement, null, '_zoomDropDownContainer');
        this.createTooltip(this.currentPageBoxElement, this.pdfViewer.localeObj.getConstant('Page Number') + (isMac ? ' (⌘+G)' : ' (Ctrl+G)'));
        this.currentPageBoxElement.setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('Page Number'));
        this.submitItem = this.pdfViewerBase.getElement('_submitForm');
        this.addPropertiesToolItemContainer(this.submitItem.parentElement, 'e-pv-submit', '_submitFormContainer');
        this.createTooltip(this.submitItem, this.pdfViewer.localeObj.getConstant('SubmitForm'));
        this.submitItem.setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('SubmitForm'));
        this.addPropertiesToolItemContainer(this.currentPageBoxElement.parentElement.parentElement, 'e-pv-current-page-container', '_currentPageInputContainer');
        this.pdfViewerBase.getElement('_currentPageInputContainer').style.minWidth = '20px';
        this.totalPageItem = this.pdfViewerBase.getElement('_totalPage');
        this.addPropertiesToolItemContainer(this.totalPageItem.parentElement, 'e-pv-total-page-container', '_totalPageContainer');
    }

    /**
     * @param {string} idString - It describes about the idString value
     * @param {string} className - It describes about the class name
     * @param {string} tooltipText - It describes about the tooltip text
     * @private
     * @returns {HTMLElement} - html element
     */
    public addClassToolbarItem(idString: string, className: string, tooltipText: string): HTMLElement {
        const element: HTMLElement = this.pdfViewerBase.getElement(idString);
        element.classList.add(className);
        element.classList.add('e-pv-tbar-btn');
        element.setAttribute('aria-label', tooltipText);
        element.parentElement.classList.add(className + '-container');
        element.parentElement.classList.add('e-popup-text');
        element.parentElement.id = this.pdfViewer.element.id + idString + 'Container';
        if (element.childNodes.length > 0) {
            const spanElement: HTMLElement = element.childNodes[0] as HTMLElement;
            spanElement.id = this.pdfViewer.element.id + idString + 'Icon';
            spanElement.classList.remove('e-icons');
            spanElement.classList.remove('e-btn-icon');
            if (this.pdfViewer.enableRtl) {
                spanElement.classList.add('e-right');
            }
            const textElement: HTMLElement = element.childNodes[1] as HTMLElement;
            if (textElement) {
                if (textElement.classList.contains('e-tbar-btn-text')) {
                    textElement.id = this.pdfViewer.element.id + idString + 'Text';
                }
            }
        }
        element.style.width = '';
        this.createTooltip(element, tooltipText);
        return element;
    }

    private addPropertiesToolItemContainer(element: HTMLElement, className: string, idString: string): void {
        if (className !== null) {
            element.classList.add(className);
        }
        element.classList.add('e-popup-text');
        element.id = this.pdfViewer.element.id + idString;
    }

    private createZoomDropdownElement(): string {
        const zoomDropdownElement: HTMLElement = this.createToolbarItem('input', this.pdfViewer.element.id + '_zoomDropDown', null);
        return zoomDropdownElement.outerHTML;
    }

    private createZoomDropdown(): void {
        // eslint-disable-next-line
        const proxy: any = this;
        let minZoom: number = proxy.pdfViewer.minZoom;
        let maxZoom: number = proxy.pdfViewer.maxZoom;
        const items: { percent: string; id: string }[] = [];
        const zoomValues: number[] = [10, 25, 50, 75, 100, 125, 150, 200, 400];
        if (minZoom != null && maxZoom != null && minZoom > maxZoom) {
            const tempZoomValue: number = maxZoom;
            maxZoom = minZoom;
            minZoom = tempZoomValue;
        }
        if (minZoom != null || maxZoom != null) {
            const isWithinRange: (zoom: number) => boolean = (zoom: number): boolean => {
                return (minZoom == null || zoom >= minZoom) && (maxZoom == null || zoom <= maxZoom);
            };
            let idCounter: number = 0;
            if (minZoom != null && !items.some((item: any) => parseInt(item.id, 10) === minZoom)) {
                items.push({ percent: minZoom + '%', id: idCounter.toString() });
                idCounter++;
            }
            for (let i: number = 0; i < zoomValues.length; i++) {
                const zoom: number = zoomValues[parseInt(i.toString(), 10)];
                if (isWithinRange(zoom) && zoom !== minZoom && zoom !== maxZoom) {
                    items.push({ percent: zoom + '%', id: idCounter.toString() });
                    idCounter++;
                }
            }
            if (maxZoom != null && !items.some((item: any) => parseInt(item.id, 10) === maxZoom) && maxZoom !== minZoom) {
                items.push({ percent: maxZoom + '%', id: idCounter.toString() });
                idCounter++;
            }
            items.sort((a: any, b: any) => parseInt(a.id, 10) - parseInt(b.id, 10));
        }
        else {
            items.push({ percent: '10%', id: '0' }, { percent: '35%', id: '1' }, { percent: '50%', id: '2' }, { percent: '75%', id: '3' }, { percent: '100%', id: '4' }, { percent: '125%', id: '5' }, { percent: '150%', id: '6' }, { percent: '200%', id: '7' }, { percent: '400%', id: '8' });
        }
        items.push({ percent: proxy.pdfViewer.localeObj.getConstant('Fit Page'), id: 'fitPage' }, { percent: proxy.pdfViewer.localeObj.getConstant('Fit Width'), id: 'fitWidth' }, { percent: proxy.pdfViewer.localeObj.getConstant('Automatic'), id: 'automatic' });
        if (!proxy.pdfViewer.enableRtl) {
            proxy.zoomDropDown = new ComboBox({
                dataSource: items, text: '100%', fields: { text: 'percent', value: 'id' }, readonly: true, cssClass: 'e-pv-zoom-drop-down', popupHeight: '450px', showClearButton: false, open: proxy.openZoomDropdown.bind(proxy), select: function (args: any): void {
                    if (args.e.type === 'keydown' && args.itemData.percent !== proxy.zoomDropDown.element.value) {
                        proxy.zoomDropDownChange(proxy.zoomDropDown.element.value);
                        args.cancel = true;
                    }
                }
            });
        } else {
            proxy.zoomDropDown = new ComboBox({
                dataSource: items, text: '100%', enableRtl: true, fields: { text: 'percent', value: 'id' }, readonly: true, cssClass: 'e-pv-zoom-drop-down-rtl', popupHeight: '450px', showClearButton: false, open: proxy.openZoomDropdown.bind(proxy), select: function (args: any): void {
                    if (args.e.type === 'keydown' && args.itemData.percent !== proxy.zoomDropDown.element.value) {
                        proxy.zoomDropDownChange(proxy.zoomDropDown.element.value);
                        args.cancel = true;
                    }
                }
            });
        }
        proxy.zoomDropDown.appendTo(proxy.pdfViewerBase.getElement('_zoomDropDown'));
    }

    private createCurrentPageInputTemplate(): string {
        const goToPageElement: HTMLElement = this.createToolbarItem('input', this.pdfViewer.element.id + '_currentPageInput', null);
        return goToPageElement.outerHTML;
    }

    private createTotalPageTemplate(): string {
        const totalPageElement: HTMLElement = this.createToolbarItem('span', this.pdfViewer.element.id + '_totalPage', 'e-pv-total-page');
        return totalPageElement.outerHTML;
    }

    private createNumericTextBox(): void {
        this.currentPageBox = new NumericTextBox({ value: 0, format: '##', cssClass: 'e-pv-current-page-box', showSpinButton: false });
        this.currentPageBoxElement = this.pdfViewerBase.getElement('_currentPageInput') as HTMLElement;
        this.currentPageBox.appendTo(this.currentPageBoxElement);
    }

    private onToolbarKeydown = (event: KeyboardEvent): void => {
        const isSkip: boolean = event.key === 'Tab' || event.shiftKey === true || event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight';
        const targetId: string = (event.target as HTMLElement).id;
        const customItem: any = this.toolItems.filter((toolItem: any) => toolItem.id === targetId);
        if (!(targetId === this.pdfViewer.element.id + '_currentPageInput' || targetId === this.pdfViewer.element.id + '_zoomDropDown' || customItem.length > 0) && !isSkip) {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    private createToolbarItemsForMobile(): void {
        this.toolbarElement.classList.add('e-pv-mobile-toolbar');
        const template: string = '<button id="' + this.pdfViewer.element.id + '_more_option" class="e-tbar-btn"></button>';
        this.toolbar = new tool({
            items: [{ prefixIcon: 'e-pv-open-document-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Open'), id: this.pdfViewer.element.id + '_open' },
                { type: 'Separator', align: 'Left' },
                { prefixIcon: 'e-pv-undo-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Undo'), id: this.pdfViewer.element.id + '_undo' },
                { prefixIcon: 'e-pv-redo-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Redo'), id: this.pdfViewer.element.id + '_redo' },
                {
                    tooltipText: 'Organize PDF', id: this.pdfViewer.element.id + '_menu_organize',
                    prefixIcon: 'e-pv-organize-view-icon e-pv-icon', align: 'Right',
                    disabled: true
                },
                { prefixIcon: 'e-pv-annotation-icon e-pv-icon', cssClass: 'e-pv-annotation-container', tooltipText: this.pdfViewer.localeObj.getConstant('Annotation'), id: this.pdfViewer.element.id + '_annotation', align: 'Right' },
                { prefixIcon: 'e-pv-text-search-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Text Search'), id: this.pdfViewer.element.id + '_search', align: 'Right' },
                { template: template, align: 'Right' }
            ], clicked: this.toolbarClickHandler, width: '', height: '', overflowMode: 'Popup'
        });
        this.toolbar.isStringTemplate = true;
        this.toolbar.appendTo(this.toolbarElement);
        this.openDocumentItem = this.pdfViewerBase.getElement('_open');
        this.openDocumentItem.classList.add('e-pv-open-document');
        this.openDocumentItem.firstElementChild.id = this.pdfViewer.element.id + '_openIcon';
        this.annotationItem = this.pdfViewerBase.getElement('_annotation');
        this.annotationItem.classList.add('e-pv-annotation');
        this.annotationItem.firstElementChild.id = this.pdfViewer.element.id + '_annotationIcon';
        this.organizePageItem = this.pdfViewerBase.getElement('_menu_organize');
        this.organizePageItem.classList.add('e-pv-organize-view');
        this.annotationItem.firstElementChild.id = this.pdfViewer.element.id + '_organize-view' + '_icon';
        this.textSearchItem = this.pdfViewerBase.getElement('_search');
        this.textSearchItem.classList.add('e-pv-text-search');
        this.textSearchItem.firstElementChild.id = this.pdfViewer.element.id + '_searchIcon';
        this.undoItem = this.pdfViewerBase.getElement('_undo');
        this.undoItem.classList.add('e-pv-undo');
        this.redoItem = this.pdfViewerBase.getElement('_redo');
        this.redoItem.classList.add('e-pv-redo');
        this.redoItem.firstElementChild.id = this.pdfViewer.element.id + '_redoIcon';
        this.undoItem.firstElementChild.id = this.pdfViewer.element.id + '_undoIcon';
        this.createMoreOption(this.pdfViewer.element.id + '_more_option');
    }

    private createMoreOption(idString: string): void {
        this.moreOptionItem = document.getElementById(idString);
        const items: ItemModel[] = [
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
                const dropdownButtonPosition: ClientRect = this.moreDropDown.element.getBoundingClientRect();
                if (!this.pdfViewer.enableRtl) {
                    args.element.parentElement.style.left = dropdownButtonPosition.left + dropdownButtonPosition.width - args.element.parentElement.offsetWidth + 'px';
                }
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

    private createToolbarItem(elementName: string, id: string, className: string): HTMLElement {
        const toolbarItem: HTMLElement = createElement(elementName, { id: id });
        if (className !== null) {
            toolbarItem.className = className;
        }
        if (elementName === 'input' && id !== this.pdfViewer.element.id + '_zoomDropDown') {
            (toolbarItem as HTMLInputElement).type = 'text';
        }
        return toolbarItem;
    }

    /**
     * @param {HTMLElement} toolbarItem - It describes about the toolbar item
     * @param {string} tooltipText - It describes about the tooltip text
     * @private
     * @returns {void}
     */
    public createTooltip(toolbarItem: HTMLElement, tooltipText: string): void {
        if (tooltipText !== null) {
            const tooltip: Tooltip = new Tooltip({
                content: initializeCSPTemplate(
                    function (): string { return tooltipText; }
                ), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this)
            });
            tooltip.appendTo(toolbarItem);
        }
    }

    private onTooltipBeforeOpen(args: TooltipEventArgs): void {
        if (!this.pdfViewer.toolbarSettings.showTooltip && this.toolbarElement.contains(args.target)) {
            args.cancel = true;
        }
        if (this.annotationToolbarModule) {
            if (!this.pdfViewer.toolbarSettings.showTooltip && ((this.annotationToolbarModule.toolbarElement &&
                 this.annotationToolbarModule.toolbarElement.contains(args.target)) ||
                  (this.annotationToolbarModule.shapeToolbarElement &&
                    this.annotationToolbarModule.shapeToolbarElement.contains(args.target)))) {
                args.cancel = true;
            }
        }
        if (this.formDesignerToolbarModule) {
            if (!this.pdfViewer.toolbarSettings.showTooltip && (this.formDesignerToolbarModule.toolbarElement &&
                this.formDesignerToolbarModule.toolbarElement.contains(args.target))) {
                args.cancel = true;
            }
        }
    }

    private createFileElement(toolbarElement: HTMLElement): void {
        if (toolbarElement) {
            if (!isBlazor()) {
                this.fileInputElement = createElement('input', { id: this.pdfViewer.element.id + '_fileUploadElement', styles: 'position:fixed; left:-100em', attrs: { 'type': 'file' } });
                this.fileInputElement.setAttribute('accept', '.pdf');
                this.fileInputElement.setAttribute('aria-label', 'file upload element');
                this.fileInputElement.setAttribute('tabindex', '-1');
            } else {
                this.fileInputElement = this.pdfViewer.element.querySelector('.e-pv-fileupload-element');
            }
            if (toolbarElement) {
                toolbarElement.appendChild(this.fileInputElement);
            }
        }
    }

    private wireEvent(): void {
        if (this.fileInputElement) {
            this.fileInputElement.addEventListener('change', this.loadDocument);
        }
        if (!isBlazor()) {
            if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                this.toolbarElement.addEventListener('mouseup', this.toolbarOnMouseup.bind(this));
                this.currentPageBoxElement.addEventListener('focusout', this.textBoxFocusOut);
                this.currentPageBoxElement.addEventListener('keypress', this.navigateToPage);
                this.zoomDropDown.change = this.zoomPercentSelect.bind(this);
                this.zoomDropDown.element.addEventListener('keypress', this.onZoomDropDownInput.bind(this));
                this.zoomDropDown.element.addEventListener('click', this.onZoomDropDownInputClick.bind(this));
            }
        }
    }

    private unWireEvent(): void {
        if (this.fileInputElement) {
            this.fileInputElement.removeEventListener('change', this.loadDocument);
        }
        if ((!Browser.isDevice || this.pdfViewer.enableDesktopMode) && !isBlazor()) {
            if (!isNullOrUndefined(this.toolbarElement)) {
                this.toolbarElement.removeEventListener('mouseup', this.toolbarOnMouseup.bind(this));
            }
            if (!isNullOrUndefined(this.currentPageBoxElement)) {
                this.currentPageBoxElement.removeEventListener('focusout', this.textBoxFocusOut);
                this.currentPageBoxElement.removeEventListener('keypress', this.navigateToPage);
            }
            if (!isNullOrUndefined(this.zoomDropDown)) {
                this.zoomDropDown.removeEventListener('change', this.zoomPercentSelect);
                this.zoomDropDown.element.removeEventListener('keypress', this.onZoomDropDownInput);
                this.zoomDropDown.element.removeEventListener('click', this.onZoomDropDownInputClick);
            }

        }
    }

    /**
     * @param {number} viewerWidth - It describes about the viewer width
     * @private
     * @returns {void}
     */
    public onToolbarResize(viewerWidth: number): void {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.pdfViewerBase.navigationPane.toolbarResize();
        } else {
            if (!isNullOrUndefined(this.toolbar)) {
                this.toolbar.refreshOverflow();
            }
        }
    }

    private toolbarOnMouseup(event: MouseEvent): void {
        if (event.target === this.itemsContainer || event.target === this.toolbarElement) {
            this.pdfViewerBase.focusViewerContainer();
        }
    }

    private applyHideToToolbar(show: boolean, startIndex: number, endIndex: number): void {
        const isHide: boolean = !show;
        for (let index: number = startIndex; index <= endIndex; index++) {
            if (!isNullOrUndefined(this.toolbar) && this.toolbar.items[parseInt(index.toString(), 10)]) {
                const className: string = this.toolbar.items[parseInt(index.toString(), 10)].cssClass;
                if (className && className !== '') {
                    // Querying the toolbar item
                    const element: Element = this.toolbar.element.querySelector('.' + className);
                    if (element) {
                        this.toolbar.hideItem(element, isHide);
                    }
                } else {
                    this.toolbar.hideItem(index, isHide);
                }
            }
        }
    }

    private toolbarClickHandler = (args: ClickEventArgs): void => {
        const isKeyBoardEvent: boolean = args.originalEvent && (args.originalEvent as any).pointerType !== 'mouse' && (args.originalEvent as any).pointerType !== 'touch';
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[1] ||
                 args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[2]) {
                args.cancel = true;
            } else if ((args.originalEvent.target as HTMLElement).id === this.pdfViewer.element.id + '_openIcon') {
                const tooltipData: DOMStringMap = (args.originalEvent.target as HTMLElement).parentElement.dataset;
                if (tooltipData && tooltipData.tooltipId) {
                    const tooltipElement: HTMLElement = document.getElementById(tooltipData.tooltipId);
                    if (tooltipElement) {
                        tooltipElement.style.display = 'none';
                    }
                }
            }
        }
        this.handleToolbarBtnClick(args, isKeyBoardEvent);
        const targetElement: any = args.originalEvent.target;
        let customItem: any[] = [];
        if (!isNullOrUndefined(args.item)) {
            customItem = this.toolItems.filter((toolItem: any) => toolItem.id === args.item.id);
        }
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (!(args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[1] ||
                 args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[2] ||
                  args.originalEvent.target === this.currentPageBoxElement ||
                  args.originalEvent.target === this.textSearchItem.childNodes[0] || customItem.length > 0)) {
                if (!isKeyBoardEvent && targetElement.parentElement.id !== this.pdfViewer.element.id + '_toolbarContainer_nav' && targetElement.id !== this.pdfViewer.element.id + '_toolbarContainer_nav') {
                    (args.originalEvent.target as HTMLElement).blur();
                    this.pdfViewerBase.focusViewerContainer();
                }
            }
        } else {
            (args.originalEvent.target as HTMLElement).blur();
            this.pdfViewerBase.focusViewerContainer();
        }
    };

    private handleOpenIconClick(args: ClickEventArgs, isKeyBoardEvent?: boolean): void {
        this.fileInputElement.click();
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode && !isKeyBoardEvent) {
            if (!isBlazor()) {
                (args.originalEvent.target as HTMLElement).blur();
            }
            this.pdfViewerBase.focusViewerContainer();
        }
    }

    private handleToolbarBtnClick(args: ClickEventArgs, isKeyBoardEvent?: boolean): void {
        this.addInkAnnotation();
        this.deSelectCommentAnnotation();
        switch ((args.originalEvent.target as HTMLElement).id || (!isNullOrUndefined(args.item as HTMLElement) &&
         (args.item as HTMLElement).id)) {
        case this.pdfViewer.element.id + '_open':
        case this.pdfViewer.element.id + '_openIcon': case this.pdfViewer.element.id + '_openText':
            this.handleOpenIconClick(args, isKeyBoardEvent);
            break;
        case this.pdfViewer.element.id + '_download':
        case this.pdfViewer.element.id + '_downloadIcon': case this.pdfViewer.element.id + '_downloadText':
            this.pdfViewerBase.download();
            break;
        case this.pdfViewer.element.id + '_print':
        case this.pdfViewer.element.id + '_printIcon': case this.pdfViewer.element.id + '_printText':
            if (this.pdfViewer.printModule) {
                this.pdfViewer.firePrintStart();
            }
            break;
        case this.pdfViewer.element.id + '_undo':
        case this.pdfViewer.element.id + '_undoIcon': case this.pdfViewer.element.id + '_undoText':
            if (this.pdfViewer.annotationModule) {
                this.pdfViewer.annotationModule.undo();
            }
            break;
        case this.pdfViewer.element.id + '_redo':
        case this.pdfViewer.element.id + '_redoIcon': case this.pdfViewer.element.id + '_redoText':
            if (this.pdfViewer.annotationModule) {
                this.pdfViewer.annotationModule.redo();
            }
            break;
        case this.pdfViewer.element.id + '_firstPage':
        case this.pdfViewer.element.id + '_firstPageIcon':
        case this.pdfViewer.element.id + '_firstPageText':
            if (this.pdfViewer.navigationModule) {
                this.pdfViewer.navigationModule.goToFirstPage();
            }
            break;
        case this.pdfViewer.element.id + '_previousPage':
        case this.pdfViewer.element.id + '_previousPageIcon':
        case this.pdfViewer.element.id + '_previousPageText':
            if (this.pdfViewer.navigationModule) {
                this.pdfViewer.navigationModule.goToPreviousPage();
            }
            break;
        case this.pdfViewer.element.id + '_nextPage':
        case this.pdfViewer.element.id + '_nextPageIcon':
        case this.pdfViewer.element.id + '_nextPageText':
            if (this.pdfViewer.navigationModule) {
                this.pdfViewer.navigationModule.goToNextPage();
            }
            break;
        case this.pdfViewer.element.id + '_lastPage':
        case this.pdfViewer.element.id + '_lastPageIcon':
        case this.pdfViewer.element.id + '_lastPageText':
            if (this.pdfViewer.navigationModule) {
                this.pdfViewer.navigationModule.goToLastPage();
            }
            break;
        case this.pdfViewer.element.id + '_zoomIn':
        case this.pdfViewer.element.id + '_zoomInIcon':
        case this.pdfViewer.element.id + '_zoomInText':
            this.pdfViewer.magnificationModule.zoomIn();
            break;
        case this.pdfViewer.element.id + '_zoomOut':
        case this.pdfViewer.element.id + '_zoomOutIcon':
        case this.pdfViewer.element.id + '_zoomOutText':
            this.pdfViewer.magnificationModule.zoomOut();
            break;
        case this.pdfViewer.element.id + '_selectTool':
        case this.pdfViewer.element.id + '_selectToolIcon':
        case this.pdfViewer.element.id + '_selectToolText':
            if (!this.isSelectionToolDisabled) {
                this.pdfViewerBase.initiateTextSelectMode();
                this.updateInteractionTools(true);
            }
            break;
        case this.pdfViewer.element.id + '_handTool':
        case this.pdfViewer.element.id + '_handToolIcon':
        case this.pdfViewer.element.id + '_handToolText':
            if (!(this.isScrollingToolDisabled || this.getStampMode())) {
                this.pdfViewerBase.initiatePanning();
                this.updateInteractionTools(false);
            }
            break;
        case this.pdfViewer.element.id + '_search':
        case this.pdfViewer.element.id + '_searchIcon':
        case this.pdfViewer.element.id + '_searchText':
            this.textSearchButtonHandler();
            break;
        case this.pdfViewer.element.id + '_annotation':
        case this.pdfViewer.element.id + '_annotationIcon':
        case this.pdfViewer.element.id + '_annotationText':
            this.initiateAnnotationMode((args.originalEvent.target as HTMLElement).id, isKeyBoardEvent);
            break;
        case this.pdfViewer.element.id + '_formdesigner':
        case this.pdfViewer.element.id + '_formdesignerIcon':
        case this.pdfViewer.element.id + '_formdesignerText':
            this.initiateFormDesignerMode(isKeyBoardEvent);
            this.formDesignerToolbarModule.showHideDeleteIcon(false);
            break;
        case this.pdfViewer.element.id + '_comment':
        case this.pdfViewer.element.id + '_commentIcon':
            this.pdfViewerBase.isAddComment = true;
            this.pdfViewerBase.isCommentIconAdded = true;
            this.annotationToolbarModule.deselectAllItems();
            this.pdfViewer.annotation.triggerAnnotationUnselectEvent();
            this.pdfViewer.annotation.triggerSignatureUnselectEvent();
            this.addComments(args.originalEvent.target as HTMLElement);
            break;
        case this.pdfViewer.element.id + '_submitForm':
        case this.pdfViewer.element.id + '_submitFormSpan': {
            let data: string;
            this.pdfViewerBase.exportFormFields(data, FormFieldDataFormat.Json);
            break;
        }
        case this.pdfViewer.element.id + '_menu_organize':
            if (!isNullOrUndefined(this.pdfViewer.pageOrganizer)) {
                this.pdfViewer.pageOrganizer.createOrganizeWindowForMobile();
            }
            break;
        default:
            this.pdfViewer.fireCustomToolbarClickEvent(args);
            break;
        }
    }

    public addInkAnnotation(): void {
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            const currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber, 10);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
        if (this.annotationToolbarModule) {
            this.pdfViewer.toolbar.annotationToolbarModule.deselectInkAnnotation();
            this.annotationToolbarModule.inkAnnotationSelected = false;
        }
    }

    public deSelectCommentAnnotation(): void {
        if (!isBlazor()) {
            this.pdfViewer.toolbar.deSelectItem(this.commentItem);
        } else {
            this.pdfViewer.toolbar.deSelectItem(this.CommentElement);
        }
        this.pdfViewerBase.isCommentIconAdded = false;
    }

    /**
     * @param {any} targetElement - It describes about the target element
     * @private
     * @returns {void}
     */
    public addComments(targetElement: any): void {
        if (!isBlazor()) {
            if (targetElement.id === this.pdfViewer.element.id + '_comment' || targetElement.id === this.pdfViewer.element.id + '_commentIcon') {
                if (targetElement.id === this.pdfViewer.element.id + '_commentIcon' && targetElement.parentElement) {
                    targetElement.parentElement.classList.add('e-pv-select');
                } else {
                    targetElement.classList.add('e-pv-select');
                }
            } else {
                if (this.pdfViewer.enableRtl) {
                    targetElement.className = 'e-pv-comment-selection-icon e-pv-icon e-icon-left e-right';
                } else {
                    targetElement.className = 'e-pv-comment-selection-icon e-pv-icon e-icon-left';
                }
            }
        } else {
            this.pdfViewerBase.isCommentIconAdded = true;
            this.pdfViewerBase.isAddComment = true;
            this.annotationToolbarModule.deselectAllItemsInBlazor();
            const commentsButton: HTMLElement = this.CommentElement;
            commentsButton.classList.add('e-pv-select');
        }
        this.updateStampItems();
        document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).addEventListener('mousedown', this.pdfViewer.annotationModule.stickyNotesAnnotationModule.drawIcons.bind(this));
    }

    public openZoomDropdown(): void {
        // eslint-disable-next-line
        const toolbarData: any = this;
        if (document.fullscreen) {
            if (isBlazor()) {
                const fullscreenElement: any = (document as any).fullscreenElement;
                if (fullscreenElement && fullscreenElement.tagName !== 'BODY' && fullscreenElement.tagName !== 'HTML') {
                    setTimeout(() => {
                        const popupElement: any = document.getElementById(toolbarData.pdfViewer.element.id + '_zoomCombo_popup');
                        const targetElement: HTMLElement = document.getElementById(toolbarData.toolbarElement.id);
                        if (popupElement && targetElement && popupElement.ej2_instances) {
                            targetElement.appendChild(popupElement);
                            popupElement.ej2_instances[0].refreshPosition();
                        }
                    }, 100);
                }
            } else {
                const popupElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_zoomDropDown_popup');
                const targetElement: HTMLElement = document.getElementById(this.toolbarElement.id);
                if (popupElement) {
                    targetElement.appendChild(popupElement);
                }
            }
        }
    }

    private loadDocument = (args: any): void => {
        const upoadedFiles: any = args.target.files;
        if (args.target.files[0] !== null) {
            const uploadedFile: File = upoadedFiles[0];
            if (uploadedFile) {
                this.uploadedDocumentName = uploadedFile.name;
                const reader: FileReader = new FileReader();
                if (this.pdfViewerBase.clientSideRendering) {
                    reader.readAsArrayBuffer(uploadedFile);
                } else {
                    reader.readAsDataURL(uploadedFile);
                }
                reader.onload = (e: any): void => {
                    args.target.value = null;
                    const uploadedFileUrl: any = e.currentTarget.result;
                    this.pdfViewer.uploadedFileByteArray = new Uint8Array(uploadedFileUrl);
                    if (isBlazor()) {
                        this.pdfViewer._dotnetInstance.invokeMethodAsync('LoadDocumentFromClient', uploadedFileUrl);
                    } else {
                        if (this.pdfViewerBase.clientSideRendering) {
                            this.uploadedFile = this.pdfViewer.uploadedFileByteArray;
                            this.pdfViewer.load(this.pdfViewer.uploadedFileByteArray, null);
                            this.pdfViewerBase.isSkipDocumentPath = true;
                            this.pdfViewer.documentPath = this.pdfViewer.uploadedFileByteArray as unknown as string;
                            this.pdfViewerBase.documentPathByteArray = this.pdfViewer.documentPath;
                        } else {
                            this.uploadedFile = uploadedFileUrl;
                            this.pdfViewer.load(uploadedFileUrl, null);
                            this.pdfViewerBase.isSkipDocumentPath = true;
                            this.pdfViewer.documentPath = uploadedFileUrl;
                            this.pdfViewerBase.documentPathByteArray = this.pdfViewer.documentPath;
                        }
                    }
                    if (!isNullOrUndefined(this.fileInputElement)) {
                        (this.fileInputElement as any).value = '';
                    }
                };
            }
        }
    };

    private navigateToPage = (args: KeyboardEvent): void => {
        if (args.which === 13) {
            const enteredValue: number = parseInt((this.currentPageBoxElement as HTMLInputElement).value, 10);
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
    };

    private textBoxFocusOut = (): void => {
        if (this.currentPageBox.value === null || this.currentPageBox.value >= this.pdfViewerBase.pageCount ||
             this.currentPageBox.value !== this.pdfViewerBase.currentPageNumber) {
            this.updateCurrentPage(this.pdfViewerBase.currentPageNumber);
        }
    };

    private onZoomDropDownInput(event: KeyboardEvent): boolean {
        if ((event.which < 48 || event.which > 57) && event.which !== 8 && event.which !== 13 && event.which !== 32) {
            event.preventDefault();
            return false;
        } else {
            if (event.which === 13) {
                event.preventDefault();
                const value: string = (this.zoomDropDown.element as HTMLInputElement).value.trim();
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
                    const zoomText: string = (args.itemData as any).percent;
                    this.zoomDropDownChange(zoomText);
                }
            } else {
                this.updateZoomPercentage(this.pdfViewer.magnificationModule.zoomFactor);
            }
        }
    }

    private zoomDropDownChange(zoomText: string): void {
        if (zoomText !== this.pdfViewer.localeObj.getConstant('Fit Width') && zoomText !== this.pdfViewer.localeObj.getConstant('Fit Page') && zoomText !== this.pdfViewer.localeObj.getConstant('Automatic')) {
            this.pdfViewer.magnificationModule.isAutoZoom = false;
            this.pdfViewer.magnificationModule.zoomTo(parseFloat(zoomText));
            this.updateZoomPercentage(this.pdfViewer.magnificationModule.zoomFactor);
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
     * @param {number} zoomFactor - It describes about the zoom factor
     * @private
     * @returns {void}
     */
    public updateZoomPercentage(zoomFactor: number): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            const currentPercent: string = parseInt((zoomFactor * 100).toString(), 10) + '%';
            if (isBlazor()) {
                const blazorZoomDropDown: any = this.pdfViewerBase.getElement('_zoomDropDown');
                if (blazorZoomDropDown && blazorZoomDropDown.children.length > 0) {
                    blazorZoomDropDown.children[0].children[0].value = currentPercent;
                }
            } else if (!isNullOrUndefined(this.zoomDropDown)) {
                if (this.zoomDropDown.text === currentPercent) {
                    (this.zoomDropDown.element as HTMLInputElement).value = currentPercent;
                }
                if (this.zoomDropDown.index === 11) {
                    this.zoomDropDown.value = 4;
                }
                if (zoomFactor <= 0.25) {
                    this.pdfViewerBase.isMinimumZoom = true;
                } else {
                    this.pdfViewerBase.isMinimumZoom = false;
                }
                this.zoomDropDown.text = currentPercent;
            }
        }
    }

    private updateInteractionItems(): void {
        if (this.pdfViewer.textSelectionModule) {
            if (this.pdfViewer.enableTextSelection) {
                this.enableItems(this.textSelectItem.parentElement, true);
            } else {
                this.enableItems(this.textSelectItem.parentElement, false);
            }
        } else {
            this.enableItems(this.textSelectItem.parentElement, false);
        }
        this.enableItems(this.panItem.parentElement, true);
        if (this.pdfViewer.interactionMode === 'TextSelection' && this.pdfViewer.enableTextSelection) {
            this.selectItem(this.textSelectItem);
            this.textSelectItem.setAttribute('tabindex', '-1');
            this.deSelectItem(this.panItem);
            this.panItem.setAttribute('tabindex', '0');
        } else {
            this.selectItem(this.panItem);
            this.panItem.setAttribute('tabindex', '-1');
            this.deSelectItem(this.textSelectItem);
            this.textSelectItem.setAttribute('tabindex', '0');
            this.pdfViewerBase.initiatePanning();
        }
    }

    /**
     * @param {boolean} iskeyboardClick - It describes about the iskeyboardclick boolean value
     * @private
     * @returns {void}
     */
    public textSearchButtonHandler(iskeyboardClick?: boolean): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (this.pdfViewer.textSearchModule && this.pdfViewerBase.pageCount > 0) {
                this.isTextSearchBoxDisplayed = !this.isTextSearchBoxDisplayed;
                this.pdfViewer.textSearchModule.showSearchBox(this.isTextSearchBoxDisplayed);
                if (this.isTextSearchBoxDisplayed) {
                    if (!isBlazor()) {
                        this.selectItem(this.textSearchItem);
                        this.textSearchItem.setAttribute('tabindex', '0');
                    }
                    const searchInputElement: HTMLInputElement = document.getElementById(this.pdfViewer.element.id + '_search_input') as HTMLInputElement;
                    searchInputElement.select();
                    searchInputElement.focus();
                } else {
                    if (!isBlazor()) {
                        this.deSelectItem(this.textSearchItem);
                        this.textSearchItem.blur();
                    } else {
                        const searchItem: any = this.pdfViewerBase.getElement('_search') as HTMLElement;
                        if (iskeyboardClick) {
                            searchItem.firstElementChild.focus();
                        }
                        else {
                            searchItem.firstElementChild.blur();
                            this.pdfViewerBase.focusViewerContainer();
                        }
                    }
                }
            }
        } else {
            this.showToolbar(false);
            this.pdfViewerBase.navigationPane.createNavigationPaneMobile('search');
        }
    }

    /**
     * @param {string} id - It describes about the id value
     * @param {boolean} isKeyBoardEvent - It describes about the whether isKeyBoardEvent true or not
     * @private
     * @returns {void}
     */
    public initiateAnnotationMode(id?: string, isKeyBoardEvent?: boolean): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (this.annotationToolbarModule && this.pdfViewer.enableAnnotationToolbar) {
                this.annotationToolbarModule.showAnnotationToolbar(this.annotationItem);
                this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar.refreshOverflow();
                if (isKeyBoardEvent || this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar.items.length > 0) {
                    document.getElementById(this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar.items[0].id).focus();
                }
                if (this.pdfViewer.isAnnotationToolbarVisible && this.pdfViewer.isFormDesignerToolbarVisible) {
                    const formDesignerMainDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_formdesigner_toolbar');
                    formDesignerMainDiv.style.display = 'none';
                    this.formDesignerToolbarModule.isToolbarHidden = false;
                    this.formDesignerToolbarModule.showFormDesignerToolbar(this.formDesignerItem);
                    this.annotationToolbarModule.adjustViewer(true);
                }
            }
        } else {
            if (!isBlazor()) {
                if (id === this.pdfViewer.element.id + '_annotation') {
                    id = this.pdfViewer.element.id + '_annotationIcon';
                }
                this.annotationToolbarModule.createAnnotationToolbarForMobile(id);
            }
        }
    }

    private initiateFormDesignerMode(isKeyBoardEvent?: boolean): void {
        if (this.formDesignerToolbarModule && this.pdfViewer.enableFormDesignerToolbar) {
            this.formDesignerToolbarModule.showFormDesignerToolbar(this.formDesignerItem);
            if (this.pdfViewer.isAnnotationToolbarVisible && this.pdfViewer.isFormDesignerToolbarVisible) {
                const annotationMainDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotation_toolbar');
                annotationMainDiv.style.display = 'none';
                const commentPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
                if (!isNullOrUndefined(commentPanel) && !isNullOrUndefined(this.pdfViewerBase.navigationPane)) {
                    if (commentPanel.style.display === 'block') {
                        this.pdfViewerBase.navigationPane.closeCommentPanelContainer();
                    }
                }
                this.annotationToolbarModule.isToolbarHidden = false;
                this.annotationToolbarModule.showAnnotationToolbar(this.annotationItem);
                this.formDesignerToolbarModule.adjustViewer(true);
            }
            if (isKeyBoardEvent && this.pdfViewer.toolbarModule.formDesignerToolbarModule.toolbar.items.length > 0) {
                document.getElementById(this.pdfViewer.toolbarModule.formDesignerToolbarModule.toolbar.items[0].id).focus();
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public DisableInteractionTools(): void {
        this.deSelectItem(this.textSelectItem);
        this.deSelectItem(this.panItem);
    }

    /**
     * @param {HTMLElement} element - It describes about the element value
     * @private
     * @returns {void}
     */
    public selectItem(element: HTMLElement): void {
        if (element) {
            element.classList.add('e-pv-select');
        }
    }

    /**
     * @param {HTMLElement} element - It describes about the element value
     * @private
     * @returns {void}
     */
    public deSelectItem(element: HTMLElement): void {
        if (element) {
            element.classList.remove('e-pv-select');
        }
    }

    /**
     * @param {boolean} isTextSelect - It describes about the isTextSelect boolean value
     * @private
     * @returns {void}
     */
    public updateInteractionTools(isTextSelect: boolean): void {
        const isBlazorPlatform: boolean = isBlazor();
        if (isTextSelect) {
            if (isBlazorPlatform) {
                this.selectItem(this.SelectToolElement);
                this.deSelectItem(this.PanElement);
            } else {
                this.selectItem(this.textSelectItem);
                if (!isNullOrUndefined(this.textSelectItem)) {
                    this.textSelectItem.setAttribute('tabindex', '-1');
                }
                this.deSelectItem(this.panItem);
                if (!isNullOrUndefined(this.panItem)) {
                    this.panItem.setAttribute('tabindex', '0');
                }

            }
        } else {
            if (isBlazorPlatform) {
                this.selectItem(this.PanElement);
                this.deSelectItem(this.SelectToolElement);
            } else {
                this.selectItem(this.panItem);
                if (!isNullOrUndefined(this.panItem)) {
                    this.panItem.setAttribute('tabindex', '-1');
                }
                this.deSelectItem(this.textSelectItem);
                if (!isNullOrUndefined(this.textSelectItem)) {
                    this.textSelectItem.setAttribute('tabindex', '0');
                }
            }
        }
    }

    private initialEnableItems(): void {
        if (this.pdfViewer.enableToolbar) {
            this.showToolbar(true);
        } else {
            this.showToolbar(false);
        }
        if (this.pdfViewer.enableNavigationToolbar) {
            this.showNavigationToolbar(true);
        } else {
            this.showNavigationToolbar(false);
        }
        if (this.pdfViewer.pageOrganizer) {
            this.showPageOrganizerToolbar(true);
        }
        else {
            this.showPageOrganizerToolbar(false);
        }
        if (!isBlazor()) {
            if (this.isPrintBtnVisible) {
                this.showPrintOption(true);
            } else {
                this.showPrintOption(false);
            }
            if (this.isDownloadBtnVisible) {
                this.showDownloadOption(true);
            } else {
                this.showDownloadOption(false);
            }
            if (this.isSearchBtnVisible) {
                this.showSearchOption(true);
            } else {
                this.showSearchOption(false);
            }
            if (this.isCommentBtnVisible) {
                this.showCommentOption(true);
            } else {
                this.showCommentOption(false);
            }
        }
    }

    private showSeparator(toolbarItems: (CustomToolbarItemModel | ToolbarItem)[]): void {
        if (!this.isOpenBtnVisible || (!this.isNavigationToolVisible && !this.isMagnificationToolVisible &&
             !this.isSelectionBtnVisible && !this.isScrollingBtnVisible && !this.isUndoRedoBtnsVisible)) {
            //For mobile devices, the default previous value has been passed as (1,1).
            this.applyHideToToolbar(false, !isNullOrUndefined(this.itemsIndexArray[0]) ? this.itemsIndexArray[0].endIndex + 1 : 1,
                                    !isNullOrUndefined(this.itemsIndexArray[0]) ? this.itemsIndexArray[0].endIndex + 1 : 1);
        }
        if (((!this.isNavigationToolVisible && !this.isMagnificationToolVisible) && !this.isOpenBtnVisible) ||
            (this.isOpenBtnVisible && !this.isNavigationToolVisible) ||
            ((!this.isOpenBtnVisible && !this.isNavigationToolVisible) || (!this.isMagnificationToolVisible &&
                !this.isScrollingBtnVisible && !this.isSelectionBtnVisible))) {
            //For mobile devices, the default previous value has been passed as (8,8).
            this.applyHideToToolbar(false, !isNullOrUndefined(this.itemsIndexArray[1]) ? this.itemsIndexArray[1].endIndex + 1 : 8,
                                    !isNullOrUndefined(this.itemsIndexArray[1]) ? this.itemsIndexArray[1].endIndex + 1 : 8);
        }
        if ((!this.isMagnificationToolVisible && !this.isSelectionBtnVisible && !this.isScrollingBtnVisible) ||
            (this.isMagnificationToolVisible && (!this.isSelectionBtnVisible && !this.isScrollingBtnVisible)) ||
            (!this.isMagnificationToolVisible && (this.isSelectionBtnVisible || this.isScrollingBtnVisible))) {
            //For mobile devices, the default previous value has been passed as (12,12).
            this.applyHideToToolbar(false, !isNullOrUndefined(this.itemsIndexArray[2]) ?
                this.itemsIndexArray[2].endIndex + 1 : 12, !isNullOrUndefined(this.itemsIndexArray[2]) ?
                this.itemsIndexArray[2].endIndex + 1 : 12);
        }
        if (((!this.isMagnificationToolVisible && !this.isNavigationToolVisible && !this.isScrollingBtnVisible
            && !this.isSelectionBtnVisible) && this.isUndoRedoBtnsVisible || !this.isUndoRedoBtnsVisible)) {
            //For mobile devices, the default previous value has been passed as (15,15).
            this.applyHideToToolbar(false, !isNullOrUndefined(this.itemsIndexArray[4]) ?
                this.itemsIndexArray[4].endIndex + 1 : 15, !isNullOrUndefined(this.itemsIndexArray[4]) ?
                this.itemsIndexArray[4].endIndex + 1 : 15);
        }
        if ((!this.isUndoRedoBtnsVisible || (this.isUndoRedoBtnsVisible && !this.isCommentBtnVisible &&
             !this.isSubmitbtnvisible)) && (!isNullOrUndefined(this.itemsIndexArray[5]))) {
            this.applyHideToToolbar(false, this.itemsIndexArray[5].endIndex + 1, this.itemsIndexArray[5].endIndex + 1);
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public applyToolbarSettings(): void {
        const toolbarSettingsItems: (CustomToolbarItemModel | ToolbarItem)[] = this.pdfViewer.toolbarSettings.toolbarItems;
        if (toolbarSettingsItems) {
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
            if (toolbarSettingsItems.indexOf('UndoRedoTool') !== -1) {
                this.showUndoRedoTool(true);
            } else {
                this.showUndoRedoTool(false);
            }
            if (toolbarSettingsItems.indexOf('AnnotationEditTool') !== -1) {
                this.showAnnotationEditTool(true);
            } else {
                this.showAnnotationEditTool(false);
            }
            if (toolbarSettingsItems.indexOf('FormDesignerEditTool') !== -1) {
                this.showFormDesignerEditTool(true);
            } else {
                this.showFormDesignerEditTool(false);
            }
            if (toolbarSettingsItems.indexOf('CommentTool') !== -1) {
                this.showCommentOption(true);
            } else {
                this.showCommentOption(false);
            }
            if (toolbarSettingsItems.indexOf('SubmitForm') !== -1) {
                this.showSubmitForm(true);
            } else {
                this.showSubmitForm(false);
            }
            this.showSeparator(toolbarSettingsItems);
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public applyToolbarSettingsForMobile(): void {
        const toolbarSettingsItems: (CustomToolbarItemModel | ToolbarItem)[] = this.pdfViewer.toolbarSettings.toolbarItems;
        if (toolbarSettingsItems) {
            if (toolbarSettingsItems.indexOf('OpenOption') !== -1) {
                this.showOpenOption(true);
            } else {
                this.showOpenOption(false);
            }
            if (toolbarSettingsItems.indexOf('UndoRedoTool') !== -1) {
                this.showUndoRedoTool(true);
            } else {
                this.showUndoRedoTool(false);
            }
            if (toolbarSettingsItems.indexOf('AnnotationEditTool') !== -1) {
                this.showAnnotationEditTool(true);
            } else {
                this.showAnnotationEditTool(false);
            }
            if (toolbarSettingsItems.indexOf('SearchOption') !== -1) {
                this.showSearchOption(true);
            } else {
                this.showSearchOption(false);
            }
        }
    }

    private getStampMode(): boolean {
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.stampAnnotationModule) {
            return this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode;
        } else {
            return false;
        }
    }

    private stampBeforeOpen(args: any): void {
        this.annotationToolbarModule.resetFreeTextAnnot();
        if (args.ParentItem.Text === '' && this.pdfViewer.customStampSettings.isAddToMenu && args.Items.length > 0) {
            let currentElements: any = null;
            for (let i: number = 0; i < args.Items.length; i++) {
                if (args.Items[parseInt(i.toString(), 10)].Text === 'Custom Stamp') {
                    args.Items[parseInt(i.toString(), 10)].Items = [];
                    currentElements = args.Items[parseInt(i.toString(), 10)];
                    break;
                }
            }
            const elements: any = this.pdfViewerBase.customStampCollection;
            const stampElements: any = this.pdfViewer.customStampSettings.customStamps;
            if (elements.length === 0 && stampElements && stampElements.length > 0) {
                for (let n: number = 0; n < stampElements.length; n++) {
                    elements.push({ customStampName: stampElements[parseInt(n.toString(), 10)].customStampName,
                        customStampImageSource: stampElements[parseInt(n.toString(), 10)].customStampImageSource });
                }
            }
            for (let m: number = 0; m < elements.length; m++) {
                if (currentElements != null) {
                    currentElements.Items.push({ text: elements[parseInt(m.toString(), 10)].customStampName });
                }
            }
        }
    }

    private stampBeforeClose(args: any, showItemOnClick: boolean): void {
        if ((args.ParentItem && args.ParentItem.Text !== 'Custom Stamp' && args.ParentItem.Text !== 'Standard Business' && args.ParentItem.Text !== 'Dynamic' && args.ParentItem.Text !== 'Sign Here') || !args.ParentItem) {
            showItemOnClick = true;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public updateStampItems(): void {
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.stampAnnotationModule &&
             this.pdfViewer.annotationModule.stampAnnotationModule.isNewStampAnnot) {
            if (this.pdfViewer.selectedItems.annotations[0]) {
                this.pdfViewer.remove(this.pdfViewer.selectedItems.annotations[0]);
                this.pdfViewer.clearSelection(this.pdfViewer.currentPageNumber - 1);
                this.pdfViewer.renderDrawing();
                this.pdfViewerBase.tool = null;
            }
            this.pdfViewerBase.isAlreadyAdded = false;
            this.pdfViewer.annotationModule.stampAnnotationModule.isNewStampAnnot = false;
        }
    }

    private stampSelect(args: any, stampParentID: string): void {
        this.pdfViewerBase.isAlreadyAdded = false;
        this.updateStampItems();
        if (args.Item.Text === 'Custom Stamp') {
            this.annotationToolbarModule.checkStampAnnotations();
            this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = true;
            const stampImage: HTMLElement = createElement('input', { id: this.pdfViewer.element.id + '_stampElement', attrs: { 'type': 'file' } });
            stampImage.setAttribute('accept', '.jpg,.jpeg,.png');
            stampImage.style.position = 'absolute';
            stampImage.style.left = '0px';
            stampImage.style.top = '0px';
            stampImage.style.visibility = 'hidden';
            document.body.appendChild(stampImage);
            stampImage.click();
            stampImage.addEventListener('change', this.annotationToolbarModule.addStampImage);
            document.body.removeChild(stampImage);
        } else if (stampParentID === 'Custom Stamp' && args.Item.Text !== '') {
            const elements: any = this.pdfViewerBase.customStampCollection;
            for (let n: number = 0; n < elements.length; n++) {
                if (elements[parseInt(n.toString(), 10)].customStampName === args.Item.Text) {
                    this.pdfViewer.annotationModule.stampAnnotationModule.customStampName = args.Item.Text;
                    this.annotationToolbarModule.checkStampAnnotations();
                    this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = true;
                    this.pdfViewer.annotationModule.stampAnnotationModule.isStampAnnotSelected = true;
                    this.pdfViewerBase.stampAdded = true;
                    this.pdfViewerBase.isAlreadyAdded = true;
                    this.pdfViewer.annotationModule.stampAnnotationModule.
                        createCustomStampAnnotation(elements[parseInt(n.toString(), 10)].customStampImageSource);
                    this.pdfViewerBase.stampAdded = false;
                }
            }
        } else if (args.Item.Text !== 'Dynamic' && args.Item.Text !== '' && args.Item.Text !== 'Standard Business' && (stampParentID === 'Sign Here' || args.Item.Text !== 'Sign Here')) {
            this.annotationToolbarModule.checkStampAnnotations();
            this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = true;
            this.pdfViewer.annotationModule.stampAnnotationModule.isStampAnnotSelected = true;
            this.pdfViewerBase.stampAdded = true;
            if (stampParentID === 'Dynamic') {
                this.pdfViewerBase.isDynamicStamp = true;
                this.pdfViewer.annotationModule.stampAnnotationModule.retrieveDynamicStampAnnotation(args.Item.Text);
            } else {
                this.pdfViewerBase.isDynamicStamp = false;
                this.pdfViewer.annotationModule.stampAnnotationModule.retrievestampAnnotation(args.Item.Text);
            }
        }
    }

    private enableItems(element: HTMLElement, isEnable: boolean): void {
        this.toolbar.enableItems(element, isEnable);
        if (element && element.id === this.pdfViewer.element.id + '_zoomDropDownContainer') {
            this.pdfViewerBase.getElement('_zoomDropDown').setAttribute('tabindex', isEnable ? '0' : '-1');
            this.pdfViewerBase.getElement('_zoomDropDown').setAttribute('data-tabindex', isEnable ? '0' : '-1');
        }
        else if (element.firstElementChild && element.id !== this.pdfViewer.element.id + '_zoomDropDownContainer') {
            element.firstElementChild.setAttribute('tabindex', isEnable ? '0' : '-1');
            element.firstElementChild.setAttribute('data-tabindex', isEnable ? '0' : '-1');
        }
    }

    /**
     * @private
     * @returns {string} - string
     */
    public getModuleName(): string {
        return 'Toolbar';
    }
}
