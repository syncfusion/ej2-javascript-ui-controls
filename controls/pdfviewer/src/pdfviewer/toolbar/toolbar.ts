/* eslint-disable */
import { createElement, Browser, isBlazor } from '@syncfusion/ej2-base';
import { Toolbar as tool, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { ComboBox, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { PdfViewer, PdfViewerBase, AnnotationToolbar } from '../index';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { DropDownButton, ItemModel, OpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ToolbarItem } from '../base/types';
import { FormDesignerToolbar } from './formdesigner-toolbar';

/**
 * Toolbar module
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
    private isUndoRedoBtnsVisible: boolean = true;
    private isAnnotationEditBtnVisible: boolean = true;
    private isFormDesignerEditBtnVisible: boolean = true;
    private isCommentBtnVisible: boolean = true;
    private isSubmitbtnvisible: boolean = true;
    /**
     * @param viewer
     * @param viewerBase
     * @param viewer
     * @param viewerBase
     * @private
     */
    constructor(viewer: PdfViewer, viewerBase: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
    }

    /**
     * @param width
     * @private
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
        // eslint-disable-next-line
        let isIE: boolean = !!(document as any).documentMode;
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
            if(this.pdfViewer.formDesignerModule) {
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
            this.annotationToolbarModule = new AnnotationToolbar(this.pdfViewer, this.pdfViewerBase, this);
            if (this.pdfViewer.enableToolbar && this.pdfViewer.enableAnnotationToolbar || (this.pdfViewer.enableDesktopMode && Browser.isDevice)) {
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
        let toolbarDiv: HTMLElement;
        toolbarDiv = this.pdfViewer.element.querySelector('.e-pv-mobile-toolbar');
        this.createFileElement(toolbarDiv);
        this.wireEvent();
    }
    /**
     * Shows /hides the toolbar in the PdfViewer
     *
     * @param  {boolean} enableToolbar - If set true , its show the Toolbar
     * @returns void
     */
    public showToolbar(enableToolbar: boolean): void {
        const toolbar: HTMLElement = this.toolbarElement;
        if (enableToolbar) {
            toolbar.style.display = 'block';
            // eslint-disable-next-line max-len
            if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
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
            toolbar.style.display = 'none';
        }
    }
    /**
     * Shows/hides the Navigation toolbar in the PdfViewer
     *
     * @param  {boolean} enableNavigationToolbar - If set true , its show the Navigation Toolbar
     * @returns void
     */
    public showNavigationToolbar(enableNavigationToolbar: boolean): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            const navigationToolbar: HTMLElement = this.pdfViewerBase.navigationPane.sideBarToolbar;
            const navigationToolbarSplitter: HTMLElement = this.pdfViewerBase.navigationPane.sideBarToolbarSplitter;
            if (enableNavigationToolbar) {
                navigationToolbar.style.display = 'block';
                navigationToolbarSplitter.style.display = 'block';
                if (this.pdfViewerBase.navigationPane.isBookmarkOpen || this.pdfViewerBase.navigationPane.isThumbnailOpen) {
                    this.pdfViewerBase.navigationPane.clear();
                }
            } else {
                navigationToolbar.style.display = 'none';
                navigationToolbarSplitter.style.display = 'none';
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
     * @returns void
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
            case 'UndoRedoTool':
                this.showUndoRedoTool(isVisible);
                break;
            case 'AnnotationEditTool':
                this.showAnnotationEditTool(isVisible);
                break;
            case 'CommentTool':
                this.showCommentOption(isVisible);
                break;
            case 'SubmitForm':
                this.showSubmitForm(isVisible);
                break;
            }
        }
        this.applyHideToToolbar(true, 1, 1);
        this.applyHideToToolbar(true, 8, 8);
        this.applyHideToToolbar(true, 12, 12);
        this.applyHideToToolbar(true, 15, 15);
        this.showSeparator(items);
    }

    /**
     * Enables /disables the the toolbar items in the PdfViewer
     *
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
            }
        }
    }
    /**
     * @param restrictionSummary
     * @param isEnable
     * @param restrictionSummary
     * @param isEnable
     * @private
     */
    // eslint-disable-next-line
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
            break;
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
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.applyHideToToolbar(enableDownloadOption, 26, 26);
        }else {
            this.applyHideToToolbar(enableDownloadOption, 5, 5);
        }
    }

    private showPrintOption(enablePrintOption: boolean): void {
        this.isPrintBtnVisible = enablePrintOption;
        this.applyHideToToolbar(enablePrintOption, 25, 25);
    }

    private showSearchOption(enableSearchOption: boolean): void {
        this.isSearchBtnVisible = enableSearchOption;
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.applyHideToToolbar(enableSearchOption, 22, 22);
        }else {
            this.applyHideToToolbar(enableSearchOption, 4, 4);
        }
    }

    private showUndoRedoTool(isEnable: boolean): void {
        this.isUndoRedoBtnsVisible = isEnable;
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.applyHideToToolbar(isEnable, 16, 17);
        }else {
            this.applyHideToToolbar(isEnable, 2, 3);
        }
    }

    private showCommentOption(isEnable: boolean): void {
        if (!this.pdfViewer.enableStickyNotesAnnotation) {
            this.isCommentBtnVisible = isEnable;
            this.applyHideToToolbar(this.pdfViewer.enableStickyNotesAnnotation, 18, 19);
        } else {
            this.isCommentBtnVisible = isEnable;
            this.applyHideToToolbar(isEnable, 18, 19);
        }
    }

    private showAnnotationEditTool(isEnable: boolean): void {
        this.isAnnotationEditBtnVisible = isEnable;
        this.applyHideToToolbar(isEnable, 23, 23);
    }

    private showFormDesignerEditTool(isEnable: boolean): void {
        this.isFormDesignerEditBtnVisible = isEnable;
        this.applyHideToToolbar(isEnable, 24, 24);
    }

    private showSubmitForm(isEnable : boolean): void  {
        this.isSubmitbtnvisible = isEnable;
        this.applyHideToToolbar(isEnable, 20, 21);
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

    private enableUndoRedoTool(isEnable: boolean): void {
        this.toolbar.enableItems(this.undoItem.parentElement, isEnable);
        this.toolbar.enableItems(this.redoItem.parentElement, isEnable);
    }

    private enableAnnotationEditTool(isEnable: boolean): void {
        this.toolbar.enableItems(this.annotationItem.parentElement, isEnable);
    }

    private enableFormDesignerEditTool(isEnable: boolean): void {
        this.toolbar.enableItems(this.formDesignerItem.parentElement, isEnable);
    }

    private enableCommentsTool(isEnable: boolean): void {
        if (this.pdfViewer.enableStickyNotesAnnotation) {
            this.toolbar.enableItems(this.annotationItem.parentElement, isEnable);
        }
    }

    /**
     * @private
     */
    public resetToolbar(): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.currentPageBox.min = 0;
            this.currentPageBox.value = 0;
            this.updateTotalPage();
            this.updateToolbarItems();
            if (this.annotationToolbarModule) {
                this.annotationToolbarModule.clear();
            } else {
                if (this.annotationToolbarModule) {
                    if (this.annotationToolbarModule.propertyToolbar) {
                        this.annotationToolbarModule.propertyToolbar.destroy();
                    }
                    // eslint:disable-next-line
                    let commentsContainer: any = document.getElementById(this.pdfViewer.element.id + '_commentscontentcontainer');
                    if (commentsContainer) {
                        commentsContainer.innerHTML = '';
                    }
                }
            }    
        }
    }
    /**
     * @private
     */
    public updateToolbarItems(): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (this.toolbar) {
                if (this.pdfViewerBase.pageCount === 0) {
                    this.toolbar.enableItems(this.downloadItem.parentElement, false);
                    this.toolbar.enableItems(this.printItem.parentElement, false);
                    this.toolbar.enableItems(this.commentItem.parentElement, false);
                    this.updateUndoRedoButtons();
                    this.updateNavigationButtons();
                    this.toolbar.enableItems(this.zoomInItem.parentElement, false);
                    this.toolbar.enableItems(this.zoomOutItem.parentElement, false);
                    if (this.pdfViewer.magnificationModule) {
                        this.zoomDropDown.readonly = true;
                    }
                    this.toolbar.enableItems(this.submitItem.parentElement, false);
                    this.toolbar.enableItems(this.pdfViewerBase.getElement('_currentPageInputContainer'), false);
                    this.toolbar.enableItems(this.pdfViewerBase.getElement('_zoomDropDownContainer'), false);
                    this.toolbar.enableItems(this.textSelectItem.parentElement, false);
                    this.toolbar.enableItems(this.annotationItem.parentElement, false);
                    this.toolbar.enableItems(this.formDesignerItem.parentElement, false);
                    this.toolbar.enableItems(this.panItem.parentElement, false);
                    this.toolbar.enableItems(this.textSearchItem.parentElement, false);
                    this.deSelectItem(this.annotationItem);
                    if (this.annotationToolbarModule) {
                        this.annotationToolbarModule.resetToolbar();
                    }
                    this.deSelectItem(this.formDesignerItem);
                } else if (this.pdfViewerBase.pageCount > 0) {
                    this.toolbar.enableItems(this.downloadItem.parentElement, true);
                    this.toolbar.enableItems(this.printItem.parentElement, true);
                    this.toolbar.enableItems(this.pdfViewerBase.getElement('_currentPageInputContainer'), true);
                    this.toolbar.enableItems(this.pdfViewerBase.getElement('_zoomDropDownContainer'), true);
                    this.updateUndoRedoButtons();
                    this.updateNavigationButtons();
                    this.updateZoomButtons();
                    if (this.pdfViewer.magnificationModule) {
                        this.zoomDropDown.readonly = false;
                    }
                    this.updateInteractionItems();
                    // modify this condition if new annotation types are added.
                    if (this.pdfViewer.annotationModule && this.pdfViewer.enableAnnotation) {
                        this.toolbar.enableItems(this.annotationItem.parentElement, true);
                    }
                    if (this.pdfViewer.formDesignerModule && this.pdfViewer.enableFormDesigner) {
                        this.toolbar.enableItems(this.formDesignerItem.parentElement, true);
                    }
                    if (this.pdfViewer.textSearchModule && this.pdfViewer.enableTextSearch) {
                        this.toolbar.enableItems(this.textSearchItem.parentElement, true);
                    }
                    if (this.pdfViewer.annotationModule && this.pdfViewer.enableStickyNotesAnnotation) {
                        this.toolbar.enableItems(this.commentItem.parentElement, true);
                    }
                }
                if (this.pdfViewer.toolbarSettings.annotationToolbarItems) {
                    // eslint-disable-next-line max-len
                    if (this.pdfViewer.toolbarSettings.annotationToolbarItems.length === 0 || !this.pdfViewer.annotationModule || !this.pdfViewer.enableAnnotationToolbar) {
                        this.enableToolbarItem(['AnnotationEditTool'], false);
                    }
                }
                if (this.pdfViewer.toolbarSettings.formDesignerToolbarItems) {
                    // eslint-disable-next-line max-len
                    if (this.pdfViewer.toolbarSettings.formDesignerToolbarItems.length === 0 || !this.pdfViewer.formDesignerModule || !this.pdfViewer.enableFormDesignerToolbar) {
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
                this.toolbar.enableItems(this.textSearchItem.parentElement, false);
                this.toolbar.enableItems(this.moreOptionItem.parentElement, false);
                this.toolbar.enableItems(this.annotationItem.parentElement, false);
            } else if (this.pdfViewerBase.pageCount > 0) {
                this.toolbar.enableItems(this.textSearchItem.parentElement, true);
                this.toolbar.enableItems(this.moreOptionItem.parentElement, true);
                if (this.pdfViewer.annotationModule && this.pdfViewer.enableAnnotation) {
                    this.toolbar.enableItems(this.annotationItem.parentElement, true);
                }
                if (!this.pdfViewer.annotationModule || !this.pdfViewer.enableAnnotationToolbar) {
                    this.enableToolbarItem(['AnnotationEditTool'], false);
                }
                this.updateUndoRedoButtons();
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
        // eslint-disable-next-line max-len
        if (this.pdfViewer.magnificationModule && !this.isMagnificationToolDisabled && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
            if (this.pdfViewer.magnificationModule.zoomFactor <= 0.1) {
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
    public updateUndoRedoButtons(): void {
        if (this.pdfViewer.annotationModule) {
            if (this.pdfViewerBase.pageCount > 0) {
                if (isBlazor()) {
                    this.enableCollectionAvailableInBlazor(this.pdfViewer.annotationModule.actionCollection, 'undo');
                    this.enableCollectionAvailableInBlazor(this.pdfViewer.annotationModule.redoCollection, 'redo');
                } else {
                    this.enableCollectionAvailable(this.pdfViewer.annotationModule.actionCollection, this.undoItem.parentElement);
                    this.enableCollectionAvailable(this.pdfViewer.annotationModule.redoCollection, this.redoItem.parentElement);
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

    // eslint-disable-next-line
    private enableCollectionAvailable(collection: any[], item: HTMLElement): void {
        if (collection.length > 0) {
            this.toolbar.enableItems(item, true);
        } else {
            this.toolbar.enableItems(item, false);
        }
    }

    // eslint-disable-next-line
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
        this.toolbar.enableItems(this.undoItem.parentElement, false);
        this.toolbar.enableItems(this.redoItem.parentElement, false);
    }

    /**
     * @private
     */
    public destroy(): void {
        if (!isBlazor()) {
            this.unWireEvent();
            if (this.moreDropDown) {
                this.moreDropDown.destroy();
            }
            if (this.annotationToolbarModule) {
                this.annotationToolbarModule.destroy();
            }
            this.toolbar.destroy();
            this.toolbarElement.remove();
        }
    }
    /**
     * @param pageIndex
     * @private
     */
    public updateCurrentPage(pageIndex: number): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (!isBlazor()) {
                if (this.currentPageBox.value === pageIndex) {
                    (this.currentPageBoxElement as HTMLInputElement).value = pageIndex.toString();
                }
                this.currentPageBox.value = pageIndex;
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
     */
    public updateTotalPage(): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (this.pdfViewerBase.pageCount > 0) {
                this.currentPageBox.min = 1;
            }
            this.totalPageItem.textContent = this.pdfViewer.localeObj.getConstant('of') + this.pdfViewerBase.pageCount.toString();
        }
    }

    /**
     * @param event
     * @private
     */
    public openFileDialogBox(event: Event): void {
        event.preventDefault();
        this.fileInputElement.click();
    }

    private createToolbar(controlWidth: string | number): HTMLElement {
        // eslint-disable-next-line max-len
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_toolbarContainer', className: 'e-pv-toolbar' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.toolbar = new tool({
                clicked: this.toolbarClickHandler, width: '', height: '', overflowMode: 'Popup', cssClass:'e-pv-toolbar-scroll',
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
        } else {
            this.createToolbarItemsForMobile();
            this.afterToolbarCreationInMobile();
            if (this.pdfViewer.enableRtl) {
                this.toolbar.enableRtl = true;
            }
            this.applyToolbarSettings();
            this.disableUndoRedoButtons();
        }
        return this.toolbarElement;
    }

    // eslint-disable-next-line
    private createToolbarItems(): any {
        const currentPageInputTemplate: string = this.createCurrentPageInputTemplate();
        const totalPageTemplate: string = this.createTotalPageTemplate();
        const zoomDropDownTemplateString: string = this.createZoomDropdownElement();
        // eslint-disable-next-line
        let items: any[] = [];
        const submitButton : string = '<button id="' + this.pdfViewer.element.id + '_submitForm" class="e-tbar-btn" style="font-size:15px"> Submit Form</button>';
        // eslint-disable-next-line max-len
        items.push({ prefixIcon: 'e-pv-open-document-icon e-pv-icon', cssClass: 'e-pv-open-document-container', id: this.pdfViewer.element.id + '_open', text: this.pdfViewer.localeObj.getConstant('Open text'), align: 'Left' });
        items.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-open-separator-container' });
        if (!this.pdfViewer.enableRtl) {
            // eslint-disable-next-line max-len
            items.push({ prefixIcon: 'e-pv-first-page-navigation-icon e-pv-icon', cssClass: 'e-pv-first-page-navigation-container', id: this.pdfViewer.element.id + '_firstPage', text: this.pdfViewer.localeObj.getConstant('First text'), align: 'Left' });
            items.push({ prefixIcon: 'e-pv-previous-page-navigation-icon e-pv-icon', cssClass: 'e-pv-previous-page-navigation-container', id: this.pdfViewer.element.id + '_previousPage', text: this.pdfViewer.localeObj.getConstant('Previous text'), align: 'Left' });
            // eslint-disable-next-line max-len
            items.push({ prefixIcon: 'e-pv-next-page-navigation-icon e-pv-icon', cssClass: 'e-pv-next-page-navigation-container', id: this.pdfViewer.element.id + '_nextPage', text: this.pdfViewer.localeObj.getConstant('Next text'), align: 'Left' });
            items.push({ prefixIcon: 'e-pv-last-page-navigation-icon e-pv-icon', cssClass: 'e-pv-last-page-navigation-container', id: this.pdfViewer.element.id + '_lastPage', text: this.pdfViewer.localeObj.getConstant('Last text'), align: 'Left' });
            items.push({ template: currentPageInputTemplate, align: 'Left', cssClass: 'e-pv-current-page-container' });
            items.push({ template: totalPageTemplate, align: 'Left', cssClass: 'e-pv-total-page-container' });
        } else {
            // eslint-disable-next-line max-len
            items.push({ prefixIcon: 'e-pv-last-page-navigation-icon e-pv-icon', cssClass: 'e-pv-last-page-navigation-container', id: this.pdfViewer.element.id + '_firstPage', text: this.pdfViewer.localeObj.getConstant('First text'), align: 'Left' });
            items.push({ prefixIcon: 'e-pv-next-page-navigation-icon e-pv-icon', cssClass: 'e-pv-next-page-navigation-container', id: this.pdfViewer.element.id + '_previousPage', text: this.pdfViewer.localeObj.getConstant('Previous text'), align: 'Left' });
            // eslint-disable-next-line max-len
            items.push({ prefixIcon: 'e-pv-previous-page-navigation-icon e-pv-icon', cssClass: 'e-pv-previous-page-navigation-container', id: this.pdfViewer.element.id + '_nextPage', text: this.pdfViewer.localeObj.getConstant('Next text'), align: 'Left' });
            items.push({ prefixIcon: 'e-pv-first-page-navigation-icon e-pv-icon', cssClass: 'e-pv-first-page-navigation-container', id: this.pdfViewer.element.id + '_lastPage', text: this.pdfViewer.localeObj.getConstant('Last text'), align: 'Left' });
            items.push({ template: totalPageTemplate, align: 'Left', cssClass: 'e-pv-total-page-container' });
            items.push({ template: currentPageInputTemplate, align: 'Left', cssClass: 'e-pv-current-page-container' });
        }
        items.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-navigation-separator-container' });
        // eslint-disable-next-line max-len
        items.push({ prefixIcon: 'e-pv-zoom-out-icon e-pv-icon', cssClass: 'e-pv-zoom-out-container', id: this.pdfViewer.element.id + '_zoomOut', text: this.pdfViewer.localeObj.getConstant('Zoom out text'), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-zoom-in-icon e-pv-icon', cssClass: 'e-pv-zoom-in-container', id: this.pdfViewer.element.id + '_zoomIn', text: this.pdfViewer.localeObj.getConstant('Zoom in text'), align: 'Left' });
        items.push({ template: zoomDropDownTemplateString, cssClass: 'e-pv-zoom-drop-down-container', align: 'Left' });
        items.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-magnification-separator-container' });
        // eslint-disable-next-line max-len
        items.push({ prefixIcon: 'e-pv-text-select-tool-icon e-pv-icon', cssClass: 'e-pv-text-select-tool-container', id: this.pdfViewer.element.id + '_selectTool', text: this.pdfViewer.localeObj.getConstant('Selection text') });
        items.push({ prefixIcon: 'e-pv-pan-tool-icon e-pv-icon', cssClass: 'e-pv-pan-tool-container', id: this.pdfViewer.element.id + '_handTool', text: this.pdfViewer.localeObj.getConstant('Pan text') });
        items.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-pan-separator-container' });
        // eslint-disable-next-line max-len
        items.push({ prefixIcon: 'e-pv-undo-icon e-pv-icon', cssClass: 'e-pv-undo-container', id: this.pdfViewer.element.id + '_undo', text: this.pdfViewer.localeObj.getConstant('Undo'), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-redo-icon e-pv-icon', cssClass: 'e-pv-redo-container', id: this.pdfViewer.element.id + '_redo', text: this.pdfViewer.localeObj.getConstant('Redo'), align: 'Left' });
        items.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-undo-separator-container' });
        // eslint-disable-next-line max-len
        items.push({ prefixIcon: 'e-pv-comment-icon e-pv-icon', cssClass: 'e-pv-comment-container', id: this.pdfViewer.element.id + '_comment', text: this.pdfViewer.localeObj.getConstant('Add Comments'), align: 'Left' });
        items.push({ type: 'Separator', align: 'Left', cssClass: 'e-pv-comment-separator-container' });
        items.push({template: submitButton, cssClass: 'e-pv-submit' , align:  'Left' });
        // eslint-disable-next-line max-len
        items.push({ prefixIcon: 'e-pv-text-search-icon e-pv-icon', cssClass: 'e-pv-text-search-container', id: this.pdfViewer.element.id + '_search', text: this.pdfViewer.localeObj.getConstant('Search text'), align: 'Right' });
        items.push({ prefixIcon: 'e-pv-annotation-icon e-pv-icon', cssClass: 'e-pv-annotation-container', id: this.pdfViewer.element.id + '_annotation', text: this.pdfViewer.localeObj.getConstant('Annotation Edit text'), align: 'Right' });
        items.push({ prefixIcon: 'e-pv-formdesigner-icon e-pv-icon', cssClass: 'e-pv-formdesigner-container', id: this.pdfViewer.element.id + '_formdesigner', text: this.pdfViewer.localeObj.getConstant('FormDesigner Edit text'), align: 'Right' });
        // eslint-disable-next-line max-len
        items.push({ prefixIcon: 'e-pv-print-document-icon e-pv-icon', cssClass: 'e-pv-print-document-container', id: this.pdfViewer.element.id + '_print', text: this.pdfViewer.localeObj.getConstant('Print text'), align: 'Right' });
        items.push({ prefixIcon: 'e-pv-download-document-icon e-pv-icon', cssClass: 'e-pv-download-document-container', id: this.pdfViewer.element.id + '_download', text: this.pdfViewer.localeObj.getConstant('Download'), align: 'Right' });
        return items;
    }

    private afterToolbarCreationInMobile(): void {
        this.itemsContainer = this.toolbar.element.childNodes[0] as HTMLElement;
        this.itemsContainer.id = this.pdfViewer.element.id + '_toolbarItemsContainer';
        this.openDocumentItem = this.addClassToolbarItem('_open', 'e-pv-open-document', this.pdfViewer.localeObj.getConstant('Open'));
        this.undoItem = this.addClassToolbarItem('_undo', 'e-pv-undo', this.pdfViewer.localeObj.getConstant('Undo'));
        this.redoItem = this.addClassToolbarItem('_redo', 'e-pv-redo', this.pdfViewer.localeObj.getConstant('Redo'));
        this.annotationItem = this.addClassToolbarItem('_annotation', 'e-pv-annotation', this.pdfViewer.localeObj.getConstant('Annotation'));
    }
    private afterToolbarCreation(): void {
        this.itemsContainer = this.toolbar.element.childNodes[0] as HTMLElement;
        this.itemsContainer.id = this.pdfViewer.element.id + '_toolbarItemsContainer';
        this.openDocumentItem = this.addClassToolbarItem('_open', 'e-pv-open-document', this.pdfViewer.localeObj.getConstant('Open'));
        this.undoItem = this.addClassToolbarItem('_undo', 'e-pv-undo', this.pdfViewer.localeObj.getConstant('Undo'));
        this.redoItem = this.addClassToolbarItem('_redo', 'e-pv-redo', this.pdfViewer.localeObj.getConstant('Redo'));
        if (!this.pdfViewer.enableRtl) {
            // eslint-disable-next-line max-len
            this.firstPageItem = this.addClassToolbarItem('_firstPage', 'e-pv-first-page-navigation', this.pdfViewer.localeObj.getConstant('Go To First Page'));
            this.previousPageItem = this.addClassToolbarItem('_previousPage', 'e-pv-previous-page-navigation', this.pdfViewer.localeObj.getConstant('Previous Page'));
            // eslint-disable-next-line max-len
            this.nextPageItem = this.addClassToolbarItem('_nextPage', 'e-pv-next-page-navigation', this.pdfViewer.localeObj.getConstant('Next Page'));
            this.lastPageItem = this.addClassToolbarItem('_lastPage', 'e-pv-last-page-navigation', this.pdfViewer.localeObj.getConstant('Go To Last Page'));
        } else {
            // eslint-disable-next-line max-len
            this.firstPageItem = this.addClassToolbarItem('_firstPage', 'e-pv-last-page-navigation', this.pdfViewer.localeObj.getConstant('Go To First Page'));
            this.previousPageItem = this.addClassToolbarItem('_previousPage', 'e-pv-next-page-navigation', this.pdfViewer.localeObj.getConstant('Previous Page'));
            // eslint-disable-next-line max-len
            this.nextPageItem = this.addClassToolbarItem('_nextPage', 'e-pv-previous-page-navigation', this.pdfViewer.localeObj.getConstant('Next Page'));
            this.lastPageItem = this.addClassToolbarItem('_lastPage', 'e-pv-first-page-navigation', this.pdfViewer.localeObj.getConstant('Go To Last Page'));
        }
        this.zoomOutItem = this.addClassToolbarItem('_zoomOut', 'e-pv-zoom-out', this.pdfViewer.localeObj.getConstant('Zoom Out'));
        this.zoomInItem = this.addClassToolbarItem('_zoomIn', 'e-pv-zoom-in', this.pdfViewer.localeObj.getConstant('Zoom In'));
        // eslint-disable-next-line max-len
        this.textSelectItem = this.addClassToolbarItem('_selectTool', 'e-pv-text-select-tool', this.pdfViewer.localeObj.getConstant('Text Selection'));
        this.panItem = this.addClassToolbarItem('_handTool', 'e-pv-pan-tool', this.pdfViewer.localeObj.getConstant('Panning'));
        this.commentItem = this.addClassToolbarItem('_comment', 'e-pv-comment', this.pdfViewer.localeObj.getConstant('Add Comments'));
        // eslint-disable-next-line max-len
        this.textSearchItem = this.addClassToolbarItem('_search', 'e-pv-text-search', this.pdfViewer.localeObj.getConstant('Text Search'));
        this.annotationItem = this.addClassToolbarItem('_annotation', 'e-pv-annotation', this.pdfViewer.localeObj.getConstant('Annotation'));
        this.formDesignerItem = this.addClassToolbarItem('_formdesigner', 'e-pv-formdesigner', this.pdfViewer.localeObj.getConstant('FormDesigner'));
        // eslint-disable-next-line max-len
        this.printItem = this.addClassToolbarItem('_print', 'e-pv-print-document', this.pdfViewer.localeObj.getConstant('Print'));
        this.downloadItem = this.addClassToolbarItem('_download', 'e-pv-download-document', this.pdfViewer.localeObj.getConstant('Download file'));
        this.zoomDropdownItem = this.pdfViewerBase.getElement('_zoomDropDown');
        this.createTooltip(this.zoomDropdownItem, this.pdfViewer.localeObj.getConstant('Zoom'));
        this.zoomDropdownItem.setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('Zoom'));
        // eslint-disable-next-line max-len
        this.addPropertiesToolItemContainer(this.zoomDropdownItem.parentElement.parentElement, null, '_zoomDropDownContainer');
        this.pdfViewerBase.getElement('_zoomDropDownContainer').style.minWidth = '';
        this.createTooltip(this.currentPageBoxElement, this.pdfViewer.localeObj.getConstant('Page Number'));
        this.currentPageBoxElement.setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('Page Number'));
        this.submitItem = this.pdfViewerBase.getElement('_submitForm');
        this.addPropertiesToolItemContainer(this.submitItem.parentElement, 'e-pv-submit', '_submitForm');
        this.createTooltip(this.submitItem, this.pdfViewer.localeObj.getConstant('SubmitForm'));
        // eslint-disable-next-line max-len
        this.addPropertiesToolItemContainer(this.currentPageBoxElement.parentElement.parentElement, 'e-pv-current-page-container', '_currentPageInputContainer');
        this.pdfViewerBase.getElement('_currentPageInputContainer').style.minWidth = '20px';
        this.totalPageItem = this.pdfViewerBase.getElement('_totalPage');
        this.addPropertiesToolItemContainer(this.totalPageItem.parentElement, 'e-pv-total-page-container', '_totalPageContainer');
    }

    /**
     * @param idString
     * @param className
     * @param tooltipText
     * @param idString
     * @param className
     * @param tooltipText
     * @private
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
        // eslint-disable-next-line max-len
        const zoomDropdownElement: HTMLElement = this.createToolbarItem('input', this.pdfViewer.element.id + '_zoomDropDown', null);
        return zoomDropdownElement.outerHTML;
    }

    private createZoomDropdown(): void {
        // eslint-disable-next-line max-len
        const items: { [key: string]: Object }[] = [{ percent: '10%', id: '0' }, { percent: '25%', id: '1' }, { percent: '50%', id: '2' }, { percent: '75%', id: '3' }, { percent: '100%', id: '4' }, { percent: '125%', id: '5' },
        // eslint-disable-next-line max-len
            { percent: '150%', id: '6' }, { percent: '200%', id: '7' }, { percent: '400%', id: '8' }, { percent: this.pdfViewer.localeObj.getConstant('Fit Page'), id: '9' }, { percent: this.pdfViewer.localeObj.getConstant('Fit Width'), id: '10' }, { percent: this.pdfViewer.localeObj.getConstant('Automatic'), id: '11' }
        ];
        // eslint-disable-next-line max-len
        this.zoomDropDown = new ComboBox({ dataSource: items, text: '100%', fields: { text: 'percent', value: 'id' }, readonly: true, cssClass: 'e-pv-zoom-drop-down', popupHeight: '450px', showClearButton: false, open: this.openZoomDropdown.bind(this), select: function(args){
            if (args.e.type == 'keydown' && args.itemData.text !== this.zoomDropDown.element.value) {
                args.cancel = true;
              }
            } 
        });
        this.zoomDropDown.appendTo(this.pdfViewerBase.getElement('_zoomDropDown'));
    }

    private createCurrentPageInputTemplate(): string {
        // eslint-disable-next-line max-len
        const goToPageElement: HTMLElement = this.createToolbarItem('input', this.pdfViewer.element.id + '_currentPageInput', null);
        return goToPageElement.outerHTML;
    }

    private createTotalPageTemplate(): string {
        // eslint-disable-next-line max-len
        const totalPageElement: HTMLElement = this.createToolbarItem('span', this.pdfViewer.element.id + '_totalPage', 'e-pv-total-page');
        return totalPageElement.outerHTML;
    }

    private createNumericTextBox(): void {
        this.currentPageBox = new NumericTextBox({ value: 0, format: '##', cssClass: 'e-pv-current-page-box', showSpinButton: false });
        this.currentPageBoxElement = this.pdfViewerBase.getElement('_currentPageInput') as HTMLElement;
        this.currentPageBox.appendTo(this.currentPageBoxElement);
    }

    private onToolbarKeydown = (event: KeyboardEvent): void => {
        const targetId: string = (event.target as HTMLElement).id;
        if (!(targetId === this.pdfViewer.element.id + '_currentPageInput' || targetId === this.pdfViewer.element.id + '_zoomDropDown')) {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    private createToolbarItemsForMobile(): void {
        this.toolbarElement.classList.add('e-pv-mobile-toolbar');
        const template: string = '<button id="' + this.pdfViewer.element.id + '_more_option" class="e-tbar-btn"></button>';
        this.toolbar = new tool({
            // eslint-disable-next-line max-len
            items: [{ prefixIcon: 'e-pv-open-document-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Open'), id: this.pdfViewer.element.id + '_open' },
                { type: 'Separator', align: 'Left' },
                // eslint-disable-next-line max-len
                { prefixIcon: 'e-pv-undo-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Undo'), id: this.pdfViewer.element.id + '_undo' },
                // eslint-disable-next-line max-len
                { prefixIcon: 'e-pv-redo-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Redo'), id: this.pdfViewer.element.id + '_redo' },
                // eslint-disable-next-line max-len
                { prefixIcon: 'e-pv-annotation-icon e-pv-icon', cssClass: 'e-pv-annotation-container', tooltipText: this.pdfViewer.localeObj.getConstant('Annotation'), id: this.pdfViewer.element.id + '_annotation', align: 'Right' },
                // eslint-disable-next-line max-len
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
                // eslint-disable-next-line max-len
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
     * @param toolbarItem
     * @param tooltipText
     * @param toolbarItem
     * @param tooltipText
     * @private
     */
    public createTooltip(toolbarItem: HTMLElement, tooltipText: string): void {
        if (tooltipText !== null) {
            // eslint-disable-next-line
            let tooltip: Tooltip = new Tooltip({ content: tooltipText, opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
            tooltip.appendTo(toolbarItem);
        }
    }

    private onTooltipBeforeOpen(args: TooltipEventArgs): void {
        if (!this.pdfViewer.toolbarSettings.showTooltip && this.toolbarElement.contains(args.target)) {
            args.cancel = true;
        }
        if (this.annotationToolbarModule) {
            // eslint-disable-next-line max-len
            if (!this.pdfViewer.toolbarSettings.showTooltip && this.annotationToolbarModule.toolbarElement.contains(args.target)) {
                args.cancel = true;
            }
        }
    }

    private createFileElement(toolbarElement: HTMLElement): void {
        if (toolbarElement) {
            if (!isBlazor()) {
                // eslint-disable-next-line max-len
                this.fileInputElement = createElement('input', { id: this.pdfViewer.element.id + '_fileUploadElement', styles: 'position:fixed; left:-100em', attrs: { 'type': 'file' } });
                this.fileInputElement.setAttribute('accept', '.pdf');
                this.fileInputElement.setAttribute('aria-label', 'file upload element');
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
            this.toolbarElement.removeEventListener('mouseup', this.toolbarOnMouseup.bind(this));
            this.currentPageBoxElement.removeEventListener('focusout', this.textBoxFocusOut);
            this.currentPageBoxElement.removeEventListener('keypress', this.navigateToPage);
            this.zoomDropDown.removeEventListener('change', this.zoomPercentSelect);
            this.zoomDropDown.element.removeEventListener('keypress', this.onZoomDropDownInput);
            this.zoomDropDown.element.removeEventListener('click', this.onZoomDropDownInputClick);
        }
    }
    /**
     * @param viewerWidth
     * @private
     */
    public onToolbarResize(viewerWidth: number): void {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.pdfViewerBase.navigationPane.toolbarResize();
        } else {
            this.toolbar.refreshOverflow();
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
            if (this.toolbar.items[index]) {
                let className = this.toolbar.items[index].cssClass;
                if (className && className !== '') {
                    // Querying the toolbar item
                    let element = this.toolbar.element.querySelector('.' + className);
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
        // eslint-disable-next-line max-len
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[1] || args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[2]) {
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
        this.handleToolbarBtnClick(args);
        // eslint-disable-next-line
        let targetElement : any = args.originalEvent.target;
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            // eslint-disable-next-line max-len
            if (!(args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[1] || args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[2] || args.originalEvent.target === this.currentPageBoxElement || args.originalEvent.target === this.textSearchItem.childNodes[0])) {
                if (targetElement.parentElement.id !== this.pdfViewer.element.id + '_toolbarContainer_nav' && targetElement.id !== this.pdfViewer.element.id + '_toolbarContainer_nav') {
                    (args.originalEvent.target as HTMLElement).blur();
                    this.pdfViewerBase.focusViewerContainer();
                }
            }
        } else {
            (args.originalEvent.target as HTMLElement).blur();
            this.pdfViewerBase.focusViewerContainer();
        }
    };

    private handleOpenIconClick(args: ClickEventArgs): void {
        this.fileInputElement.click();
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            if (!isBlazor()) {
                (args.originalEvent.target as HTMLElement).blur();
            }
            this.pdfViewerBase.focusViewerContainer();
        }
    }

    // eslint-disable-next-line
    private handleToolbarBtnClick(args: ClickEventArgs): void {
        this.addInkAnnotation();
        switch ((args.originalEvent.target as HTMLElement).id) {
        case this.pdfViewer.element.id + '_open':
        case this.pdfViewer.element.id + '_openIcon': case this.pdfViewer.element.id + '_openText':
            this.handleOpenIconClick(args);
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
            this.initiateAnnotationMode((args.originalEvent.target as HTMLElement).id);
            break;
        case this.pdfViewer.element.id + '_formdesigner':
        case this.pdfViewer.element.id + '_formdesignerIcon':
        case this.pdfViewer.element.id + '_formdesignerText':
            this.initiateFormDesignerMode();
            this.formDesignerToolbarModule.showHideDeleteIcon(false);
            break;
        case this.pdfViewer.element.id + '_comment':
        case this.pdfViewer.element.id + '_commentIcon':
            this.pdfViewerBase.isAddComment = true;
            this.pdfViewerBase.isCommentIconAdded = true;
            this.addComments(args.originalEvent.target as HTMLElement);
            break;
        case this.pdfViewer.element.id + '_submitForm':
            this.pdfViewerBase.exportFormFields();
            break;
        }
    }
    private addInkAnnotation(): void {
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            // eslint-disable-next-line
            let currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
        if (this.annotationToolbarModule) {
            this.annotationToolbarModule.inkAnnotationSelected = false;
        }
    }

    /**
    * @private
    */
    // eslint-disable-next-line
    public addComments(targetElement: any): void {
        if (!isBlazor()) {
            // eslint-disable-next-line max-len
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
            const commentsButton: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_comment');
            commentsButton.classList.add('e-pv-select');
        }
        this.updateStampItems();
        document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).addEventListener
        ('mousedown', this.pdfViewer.annotationModule.stickyNotesAnnotationModule.drawIcons.bind(this));
    }

    public openZoomDropdown(): void {
        const toolbarData = this;
        if(document.fullscreen) {
            if (isBlazor()) {
            setTimeout(()=>{
                let popupElement = document.getElementById(toolbarData.pdfViewer.element.id + "_zoomCombo_popup"); 
                let targetElement = document.getElementById(toolbarData.toolbarElement.id); 
                if(popupElement) {
                targetElement.appendChild(popupElement); 
                }
            }, 200);
           } else {
            let popupElement = document.getElementById(this.pdfViewer.element.id + "_zoomDropDown_popup"); 
            let targetElement = document.getElementById(this.toolbarElement.id); 
            if(popupElement) {
            targetElement.appendChild(popupElement); 
            }
           }
        }
    }

    // eslint-disable-next-line
    private loadDocument = (args: any): void => {
        // eslint-disable-next-line
        let upoadedFiles: any = args.target.files;
        if (args.target.files[0] !== null) {
            const uploadedFile: File = upoadedFiles[0];
            if (uploadedFile) {
                this.uploadedDocumentName = uploadedFile.name;
                const reader: FileReader = new FileReader();
                reader.readAsDataURL(uploadedFile);
                // eslint-disable-next-line
                reader.onload = (e: any): void => {
                    const uploadedFileUrl: string = e.currentTarget.result;
                    this.pdfViewer.load(uploadedFileUrl, null);
                };
            }
        }
    };

    private navigateToPage = (args: KeyboardEvent): void => {
        if (args.which === 13) {
            // eslint-disable-next-line
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
    };

    private textBoxFocusOut = (): void => {
        // eslint-disable-next-line
        if (this.currentPageBox.value === null || this.currentPageBox.value >= this.pdfViewerBase.pageCount || this.currentPageBox.value !== this.pdfViewerBase.currentPageNumber) {
            this.updateCurrentPage(this.pdfViewerBase.currentPageNumber);
        }
    };

    private onZoomDropDownInput(event: KeyboardEvent): boolean {
        if ((event.which < 48 || event.which > 57) && event.which !== 8 && event.which !== 13) {
            event.preventDefault();
            return false;
        } else {
            if (event.which === 13) {
                event.preventDefault();
                const value: string = (this.zoomDropDown.element as HTMLInputElement).value;
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
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const zoomText: string = (args.itemData as any).percent;
                    this.zoomDropDownChange(zoomText);
                }
            } else {
                this.updateZoomPercentage(this.pdfViewer.magnificationModule.zoomFactor);
            }
        }
    }

    private zoomDropDownChange(zoomText: string): void {
        // eslint-disable-next-line max-len
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
     * @param zoomFactor
     * @private
     */
    public updateZoomPercentage(zoomFactor: number): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            // eslint-disable-next-line radix
            const currentPercent: string = parseInt((zoomFactor * 100).toString()) + '%';
            if (isBlazor()) {
                // eslint-disable-next-line
                let blazorZoomDropDown: any = this.pdfViewerBase.getElement('_zoomDropDown');
                if (blazorZoomDropDown && blazorZoomDropDown.children.length > 0) {
                    blazorZoomDropDown.children[0].children[0].value = currentPercent;
                }
            } else {
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
                // eslint-disable-next-line
                this.zoomDropDown.text = currentPercent;
            }
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
        if (this.pdfViewer.interactionMode === 'TextSelection' && this.pdfViewer.enableTextSelection) {
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
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (this.pdfViewer.textSearchModule && this.pdfViewerBase.pageCount > 0) {
                this.isTextSearchBoxDisplayed = !this.isTextSearchBoxDisplayed;
                this.pdfViewer.textSearchModule.showSearchBox(this.isTextSearchBoxDisplayed);
                if (this.isTextSearchBoxDisplayed) {
                    if (!isBlazor()) {
                        this.selectItem(this.textSearchItem);
                    }
                    // eslint-disable-next-line max-len
                    const searchInputElement: HTMLInputElement = document.getElementById(this.pdfViewer.element.id + '_search_input') as HTMLInputElement;
                    searchInputElement.select();
                    searchInputElement.focus();
                } else {
                    if (!isBlazor()) {
                        this.deSelectItem(this.textSearchItem);
                        this.textSearchItem.blur();
                    } else {
                        let searchItem: any = this.pdfViewerBase.getElement('_search') as HTMLElement;
                        searchItem.firstElementChild.blur();
                    }
                }
            }
        } else {
            this.showToolbar(false);
            this.pdfViewerBase.navigationPane.createNavigationPaneMobile('search');
        }
    }

    private initiateAnnotationMode(id?: string): void {
 if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
        if (this.annotationToolbarModule && this.pdfViewer.enableAnnotationToolbar) {
            this.annotationToolbarModule.showAnnotationToolbar(this.annotationItem);
            if (this.pdfViewer.isAnnotationToolbarVisible && this.pdfViewer.isFormDesignerToolbarVisible) {
            let formDesignerMainDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + "_formdesigner_toolbar");
            formDesignerMainDiv.style.display = "none"; 
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

    private initiateFormDesignerMode(): void {
        if (this.formDesignerToolbarModule && this.pdfViewer.enableFormDesignerToolbar) {
            this.formDesignerToolbarModule.showFormDesignerToolbar(this.formDesignerItem);
            if (this.pdfViewer.isAnnotationToolbarVisible && this.pdfViewer.isFormDesignerToolbarVisible) {
            let annotationMainDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + "_annotation_toolbar");
            annotationMainDiv.style.display = "none"; 
            this.annotationToolbarModule.isToolbarHidden = false;
            this.annotationToolbarModule.showAnnotationToolbar(this.annotationItem);
            this.formDesignerToolbarModule.adjustViewer(true);
            }
        }
    }
    /**
     * @private
     */
    public DisableInteractionTools(): void {
        this.deSelectItem(this.textSelectItem);
        this.deSelectItem(this.panItem);
    }

    /**
     * @param element
     * @private
     */
    public selectItem(element: HTMLElement): void {
        if (element) {
            element.classList.add('e-pv-select');
        }
    }

    /**
     * @param element
     * @private
     */
    public deSelectItem(element: HTMLElement): void {
        if (element) {
            element.classList.remove('e-pv-select');
        }
    }
    /**
     * @param isTextSelect
     * @private
     */
    public updateInteractionTools(isTextSelect: boolean): void {
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
        if (this.pdfViewer.enableNavigationToolbar) {
            this.showNavigationToolbar(true);
        } else {
            this.showNavigationToolbar(false);
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

    private showSeparator(toolbarItems: ToolbarItem[]): void {
        // eslint-disable-next-line max-len
        if (!this.isOpenBtnVisible || (!this.isNavigationToolVisible && !this.isMagnificationToolVisible && !this.isSelectionBtnVisible && !this.isScrollingBtnVisible && !this.isUndoRedoBtnsVisible)) {
            this.applyHideToToolbar(false, 1, 1);
        }
        if (((!this.isNavigationToolVisible && !this.isMagnificationToolVisible) && !this.isOpenBtnVisible) ||
            (this.isOpenBtnVisible && !this.isNavigationToolVisible) ||
            // eslint-disable-next-line max-len
            ((!this.isOpenBtnVisible && !this.isNavigationToolVisible) || (!this.isMagnificationToolVisible && !this.isScrollingBtnVisible && !this.isSelectionBtnVisible))) {
            this.applyHideToToolbar(false, 8, 8);
        }
        if ((!this.isMagnificationToolVisible && !this.isSelectionBtnVisible && !this.isScrollingBtnVisible) ||
            (this.isMagnificationToolVisible && (!this.isSelectionBtnVisible && !this.isScrollingBtnVisible)) ||
            (!this.isMagnificationToolVisible && (this.isSelectionBtnVisible || this.isScrollingBtnVisible))) {
            this.applyHideToToolbar(false, 12, 12);
        }
        if (((!this.isMagnificationToolVisible && !this.isNavigationToolVisible && !this.isScrollingBtnVisible
            && !this.isSelectionBtnVisible) && this.isUndoRedoBtnsVisible || !this.isUndoRedoBtnsVisible)) {
            this.applyHideToToolbar(false, 15, 15);
        }
    }


    private applyToolbarSettings(): void {
        const toolbarSettingsItems: ToolbarItem[] = this.pdfViewer.toolbarSettings.toolbarItems;
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

    private getStampMode(): boolean {
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.stampAnnotationModule) {
            return this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode;
        } else {
            return false;
        }
    }
    // eslint-disable-next-line
    private stampBeforeOpen(args: any): void {
        this.annotationToolbarModule.resetFreeTextAnnot();
        if (args.ParentItem.Text === '' && this.pdfViewer.customStampSettings.isAddToMenu && args.Items.length > 0) {
            // eslint-disable-next-line
            let currentElements: any = null;
            for (let i: number = 0; i < args.Items.length; i++) {
                if (args.Items[i].Text === 'Custom Stamp') {
                    args.Items[i].Items = [];
                    currentElements = args.Items[i];
                    break;
                }
            }
            // eslint-disable-next-line
            let elements: any = this.pdfViewerBase.customStampCollection;
            // eslint-disable-next-line
            let stampElements: any = this.pdfViewer.customStampSettings.customStamps;
            if (elements.length === 0 && stampElements && stampElements.length > 0) {
                for (let n: number = 0; n < stampElements.length; n++) {
                    // eslint-disable-next-line max-len
                    elements.push({ customStampName: stampElements[n].customStampName, customStampImageSource: stampElements[n].customStampImageSource });
                }
            }
            for (let m: number = 0; m < elements.length; m++) {
                if (currentElements != null) {
                    currentElements.Items.push({ text: elements[m].customStampName });
                }
            }
        }
    }
    // eslint-disable-next-line
    private stampBeforeClose(args: any, showItemOnClick: boolean): void {
        // eslint-disable-next-line max-len
        if ((args.ParentItem && args.ParentItem.Text !== 'Custom Stamp' && args.ParentItem.Text !== 'Standard Business' && args.ParentItem.Text !== 'Dynamic' && args.ParentItem.Text !== 'Sign Here') || !args.ParentItem) {
            showItemOnClick = true;
        }
    }
    /**
     * @private
     */
    // eslint-disable-next-line
    public updateStampItems(): void {
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.stampAnnotationModule && this.pdfViewer.annotationModule.stampAnnotationModule.isNewStampAnnot) {
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
    // eslint-disable-next-line
    private stampSelect(args: any, stampParentID: string): void {
        this.pdfViewerBase.isAlreadyAdded = false;
        this.updateStampItems();
        if (args.Item.Text === 'Custom Stamp') {
            this.annotationToolbarModule.checkStampAnnotations();
            this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = true;
            // eslint-disable-next-line
            let stampImage: any = createElement('input', { id: this.pdfViewer.element.id + '_stampElement', attrs: { 'type': 'file' } });
            stampImage.setAttribute('accept', '.jpg,.jpeg');
            stampImage.style.position = 'absolute';
            stampImage.style.left = '0px';
            stampImage.style.top = '0px';
            stampImage.style.visibility = 'hidden';
            document.body.appendChild(stampImage);
            stampImage.click();
            stampImage.addEventListener('change', this.annotationToolbarModule.addStampImage);
            document.body.removeChild(stampImage);
            // eslint-disable-next-line max-len
        } else if (stampParentID === 'Custom Stamp' && args.Item.Text !== '') {
            // eslint-disable-next-line
            let elements: any = this.pdfViewerBase.customStampCollection;
            for (let n: number = 0; n < elements.length; n++) {
                if (elements[n].customStampName === args.Item.Text) {
                    this.pdfViewer.annotationModule.stampAnnotationModule.customStampName = args.Item.Text;
                    this.annotationToolbarModule.checkStampAnnotations();
                    this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = true;
                    this.pdfViewer.annotationModule.stampAnnotationModule.isStampAnnotSelected = true;
                    this.pdfViewerBase.stampAdded = true;
                    this.pdfViewerBase.isAlreadyAdded = true;
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.stampAnnotationModule.createCustomStampAnnotation(elements[n].customStampImageSource);
                    this.pdfViewerBase.stampAdded = false;
                }
            }
            // eslint-disable-next-line max-len
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
    /**
     * @private
     */
    public getModuleName(): string {
        return 'Toolbar';
    }
}
