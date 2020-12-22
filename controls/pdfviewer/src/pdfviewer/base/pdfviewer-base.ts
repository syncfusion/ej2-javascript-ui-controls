import { createElement, Browser, isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { PdfViewer, TextLayer, ContextMenu, Signature, AnnotationType, TileRenderingSettingsModel } from '../index';
import { NavigationPane } from './navigation-pane';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { TextMarkupAnnotation, StampAnnotation, IPageAnnotations } from '../annotation';
import { AjaxHandler } from '../index';
// tslint:disable-next-line:max-line-length
import { IElement, Point, DrawingElement, PointModel, Rect, Matrix, identityMatrix, transformPointByMatrix, contains, Info, rotateMatrix } from '@syncfusion/ej2-drawings';
import { ToolBase, Actions, MouseEventArgs, SelectTool, MoveTool, ResizeTool, ConnectTool, NodeDrawingTool, PolygonDrawingTool, LineTool, RotateTool, StampTool , InkDrawingTool} from '../drawing/tools';
import { Selector } from '../drawing/selector';
import { ActiveElements, findActiveElement } from '../drawing/action';
import { PdfAnnotationBaseModel } from '../drawing/pdf-annotation-model';
import { renderAdornerLayer } from '../drawing/dom-util';
import { FreeTextAnnotation } from '../annotation/free-text-annotation';
import { AnnotationDataFormat, AnnotationResizerLocation } from './types';
import { cloneObject } from '../drawing/drawing-util';
import { IContextMenu, MouseDownEventArgs } from './interfaces';
import { BlazorContextMenu } from './blazor-context-menu';
import { createSpinner, showSpinner, hideSpinner } from './spinner';
import { BlazorUiAdaptor } from './blazor-ui-adaptor';
/**
 * The `ISize` module is used to handle page size property of PDF viewer.
 * @hidden
 */
export interface ISize {
    width: number;
    height: number;
    top: number;
    rotation?: number;
}

/**
 * The `IPinchZoomStorage` module is used to handle pinch zoom storage of PDF viewer.
 * @hidden
 */
export interface IPinchZoomStorage {
    index: number;
    pinchZoomStorage: object;
}

/**
 * The `IAnnotationCollection` module is used to handle page size property of PDF viewer.
 * @hidden
 */
export interface IAnnotationCollection {
    textMarkupAnnotation: object;
    shapeAnnotation: object;
    measureShapeAnnotation: object;
    stampAnnotations: object;
    stickyNotesAnnotation: object;
    freeTextAnnotation: object;
    signatureAnnotation?: object;
    signatureInkAnnotation?: object;
}
/**
 * @hidden
 */
interface ICustomStampItems {
    customStampName: string;
    customStampImageSource: string;
}
/**
 * The `PdfViewerBase` module is used to handle base methods of PDF viewer.
 * @hidden
 */
export class PdfViewerBase {
    /**
     * @private
     */
    public viewerContainer: HTMLElement;
    /**
     * @private
     */
    public contextMenuModule: IContextMenu;
    /**
     * @private
     */
    public pageSize: ISize[] = [];
    /**
     * @private
     */
    public pageCount: number = 0;
    /**
     * @private
     */
    public currentPageNumber: number = 0;
    /**
     * @private
     */
    public activeElements: ActiveElements = new ActiveElements();

    /**
     * @private
     */
    public mouseDownEvent: Event = null;

    /**
     * @private
     */
    public textLayer: TextLayer;
    private pdfViewer: PdfViewer;

    /**
     * @private
     */
    public blazorUIAdaptor: BlazorUiAdaptor;

    // tslint:disable-next-line
    private unload: any;
    /**
     * @private
     */
    public isDocumentLoaded: boolean = false;
    /**
     * @private
     */
    public documentId: string;
    /**
     * @private
     */
    public jsonDocumentId: string;
    /**
     * @private
     */
    public renderedPagesList: number[] = [];
    /**
     * @private
     */
    public pageGap: number = 8;
    /**
     * @private
     */
    public signatureAdded: boolean = false;
    /**
     * @private
     */
    public loadedData: string;
    /**
     * @private
     */
    // tslint:disable-next-line
    public formfieldvalue: any;
    private pageLeft: number = 5;
    private sessionLimit: number = 1000;
    private pageStopValue: number = 300;
    /**
     * @private
     */
    public toolbarHeight: number = 56;
    private pageLimit: number = 0;
    private previousPage: number = 0;
    private isViewerMouseDown: boolean = false;
    private isViewerMouseWheel: boolean = false;
    private scrollPosition: number = 0;
    private sessionStorage: string[] = [];
    /**
     * @private
     */
    public pageContainer: HTMLElement;
    // tslint:disable-next-line
    private scrollHoldTimer: any;
    private isFileName: boolean;
    private pointerCount: number = 0;
    private pointersForTouch: PointerEvent[] = [];
    private corruptPopup: Dialog;
    private passwordPopup: Dialog;
    private goToPagePopup: Dialog;
    /**
     * @private
     */
    public isPasswordAvailable: boolean = false;
    private document: string;
    /**
     * @private
     */
    public passwordData: string = '';
    /**
     * @private
     */
    public reRenderedCount: number = 0;
    private passwordInput: HTMLElement;
    private promptElement: HTMLElement;
    /**
     * @private
     */
    public navigationPane: NavigationPane;
    private mouseX: number = 0;
    private mouseY: number = 0;
    /**
     * @private
     */
    public hashId: string;
    private documentLiveCount: number;
    /**
     * @private
     */
    public mainContainer: HTMLElement;
    /**
     * @private
     */
    public viewerMainContainer: HTMLElement;
    private printMainContainer: HTMLElement;
    /**
     * @private
     */
    public mobileScrollerContainer: HTMLElement;
    /**
     * @private
     */
    public mobilePageNoContainer: HTMLElement;
    /**
     * @private
     */
    public mobileSpanContainer: HTMLElement;
    /**
     * @private
     */
    public mobilecurrentPageContainer: HTMLElement;
    private mobilenumberContainer: HTMLElement;
    private mobiletotalPageContainer: HTMLElement;
    private touchClientX: number = 0;
    private touchClientY: number = 0;
    private previousTime: number = 0;
    private currentTime: number = 0;
    private isTouchScrolled: boolean = false;
    private goToPageInput: HTMLElement;
    /**
     * @private
     */
    public pageNoContainer: HTMLElement;
    private goToPageElement: HTMLElement;
    private isLongTouchPropagated: boolean = false;
    // tslint:disable-next-line
    private longTouchTimer: any = null;
    private isViewerContainerDoubleClick: boolean = false;
    // tslint:disable-next-line
    private dblClickTimer: any = null;
    /**
     * @private
     */
    public pinchZoomStorage: IPinchZoomStorage[] = [];
    private isPinchZoomStorage: boolean;
    /**
     * @private
     */
    public isTextSelectionDisabled: boolean = false;
    /**
     * @private
     */
    public isPanMode: boolean = false;
    private dragX: number = 0;
    private dragY: number = 0;
    private isScrollbarMouseDown: boolean = false;
    private scrollX: number = 0;
    private scrollY: number = 0;
    private ispageMoved: boolean = false;
    private isThumb: boolean = false;
    private isTapHidden: boolean = false;
    // tslint:disable-next-line
    private singleTapTimer: any = null;
    private tapCount: number = 0;
    private inputTapCount: number = 0;
    /**
     * @private
     */
    public isInitialLoaded: boolean = false;
    private loadRequestHandler: AjaxHandler;
    private unloadRequestHandler: AjaxHandler;
    private dowonloadRequestHandler: AjaxHandler;
    private pageRequestHandler: AjaxHandler;
    private virtualLoadRequestHandler: AjaxHandler;
    private exportAnnotationRequestHandler: AjaxHandler;
    private importAnnotationRequestHandler: AjaxHandler;
    private exportFormFieldsRequestHandler: AjaxHandler;
    private importFormFieldsRequestHandler: AjaxHandler;
    private annotationPageList: number[] = [];
    private importPageList: number[] = [];
    /**
     * @private
     */
    // tslint:disable-next-line
    public importedAnnotation: any;
    /**
     * @private
     */
    public isImportAction: boolean = false;
    private isImportedAnnotation: boolean = false;
    /**
     * @private
     */
    public isAnnotationCollectionRemoved: boolean = false;
    /**
     * @private
     */
    public tool: ToolBase = null;
    // tslint:disable-next-line
    public action: | any = 'Select';
    /**
     * @private
     */
    public eventArgs: MouseEventArgs = null;
    /**
     * @private
     */
    public inAction: boolean = false;
    /**
     * @private
     */
    public isMouseDown: boolean = false;
    /**
     * @private
     */
    public isStampMouseDown: boolean = false;
    /**
     * @private
     */
    public currentPosition: PointModel;
    /**
     * @private
     */
    public prevPosition: PointModel;
    private initialEventArgs: MouseEventArgs;
    /**
     * @private
     */
    public stampAdded: boolean = false;
    /**
     * @private
     */
    public customStampCount: number = 0;
    /**
     * @private
     */
    public isDynamicStamp: boolean = false;
    /**
     * @private
     */
    public isMixedSizeDocument: boolean = false;
    /**
     * @private
     */
    public highestWidth: number = 0;
    /**
     * @private
     */
    public customStampCollection: ICustomStampItems[] = [];
    /**
     * @private
     */
    public isAlreadyAdded: boolean = false;
    /**
     * @private
     */
    public isWebkitMobile: boolean = false;
    /**
     * @private
     */
    public isFreeTextContextMenu: boolean = false;
    /**
     * @private
     */
    public signatureModule: Signature;
    /**
     * @private
     */
    public isSelection: boolean = false;
    /**
     * @private
     */
    // tslint:disable-next-line
    public annotationComments: any = null;
    /**
     * @private
     */
    public isToolbarSignClicked: boolean = false;
    /**
     * @private
     */
    public signatureCount: number = 0;
    /**
     * @private
     */
    public isSignatureAdded: boolean = false;
    /**
     * @private
     */
    public isNewSignatureAdded: boolean = false;
    /**
     * @private
     */
    // tslint:disable-next-line
    public currentSignatureAnnot: any;
    /**
     * @private
     */
    public isInitialPageMode: boolean = false;
    /**
     * @private
     */
    // tslint:disable-next-line
    public ajaxData: any;
    /**
     * @private
     */
    // tslint:disable-next-line
    public documentAnnotationCollections: any = null;
    /**
     * @private
     */
    public annotationRenderredList: number[] = [];
    /**
     * @private
     */
    // tslint:disable-next-line
    public annotationStorage: any = {};
    /**
     * @private
     */
    public isStorageExceed: boolean = false;
    /**
     * @private
     */
    public isNewStamp: boolean = false;
    /**
     * @private
     */
    // tslint:disable-next-line
    public downloadCollections: any = {};
    /**
     * @private
     */
    public isAnnotationAdded: boolean = false;
    /**
     * @private
     */
    // tslint:disable-next-line
    public annotationEvent: any = null;
    private isAnnotationDrawn: boolean = false;
    /**
     * @private
     */
    public isAnnotationSelect: boolean = false;
    /**
     * @private
     */
    public isAnnotationMouseDown: boolean = false;
    /**
     * @private
     */
    public isAnnotationMouseMove: boolean = false;
    /**
     * @private
     */
    public validateForm: boolean = false;
    /**
     * @private
     */
    public isMinimumZoom: boolean = false;
    /**
     * @private
     */
    public documentLoaded: boolean = false;
    private tileRenderCount: number = 0;
    private tileRequestCount: number = 0;
    /**
     * @private
     */
    public isTileImageRendered: boolean = false;
    private isDataExits: boolean = false;
    private requestLists: string[] = [];
    private tilerequestLists: string[] = [];
    /**
     * @private
     */
    public isToolbarInkClicked: boolean;
    /**
     * @private
     */
    public isInkAdded: boolean = false;
    /**
     * @private
     */
    public inkCount: number = 0;
    /**
     * @private
     */
    public isAddedSignClicked: boolean = false;
    /**
     * @private
     */
    public imageCount: number = 0;
    /**
     * @private
     */
    public isMousedOver: boolean = false;
    /**
     * @private
     */
    public isPassword: boolean = false;

    constructor(viewer: PdfViewer) {
        this.pdfViewer = viewer;
        this.navigationPane = new NavigationPane(this.pdfViewer, this);
        this.textLayer = new TextLayer(this.pdfViewer, this);
        this.signatureModule = new Signature(this.pdfViewer, this);
        // tslint:disable-next-line:max-line-length
        this.isWebkitMobile = /Chrome/.test(navigator.userAgent) || /Google Inc/.test(navigator.vendor) || (navigator.userAgent.indexOf('Safari') !== -1);

    }
    /**
     * @private
     */
    public initializeComponent(): void {
        let element: HTMLElement = document.getElementById(this.pdfViewer.element.id);
        if (element) {
            this.blazorUIAdaptor = isBlazor() ? new BlazorUiAdaptor(this.pdfViewer, this) : null;
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.pdfViewer.element.classList.add('e-pv-mobile-view');
            }
            let controlWidth: string = '100%';
            let toolbarDiv: HTMLElement;
            // tslint:disable-next-line:max-line-length
            this.viewerMainContainer =  isBlazor() ? element.querySelector('.e-pv-viewer-main-container') : createElement('div', { id: this.pdfViewer.element.id + '_viewerMainContainer', className: 'e-pv-viewer-main-container' });
            // tslint:disable-next-line:max-line-length
            this.viewerContainer = isBlazor() ? element.querySelector('.e-pv-viewer-container') : createElement('div', { id: this.pdfViewer.element.id + '_viewerContainer', className: 'e-pv-viewer-container', attrs: { 'aria-label': 'pdfviewer scroll view' } });
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.createMobilePageNumberContainer();
            }
            // tslint:disable-next-line
            (this.viewerContainer as any).tabIndex = 0;
            if (this.pdfViewer.enableRtl) {
                this.viewerContainer.style.direction = 'rtl';
            }
            element.style.touchAction = 'pan-x pan-y';
            this.setMaximumHeight(element);
            // tslint:disable-next-line:max-line-length
            this.mainContainer = isBlazor() ? element.querySelector('.e-pv-main-container') : createElement('div', { id: this.pdfViewer.element.id + '_mainContainer', className: 'e-pv-main-container' });
            this.mainContainer.appendChild(this.viewerMainContainer);
            element.appendChild(this.mainContainer);
            this.applyViewerHeight(this.mainContainer);
            if (this.pdfViewer.toolbarModule) {
                this.navigationPane.initializeNavigationPane();
                toolbarDiv = this.pdfViewer.toolbarModule.intializeToolbar(controlWidth);
            } else {
                if (isBlazor()) {
                    this.navigationPane.initializeNavigationPane();
                    toolbarDiv = this.pdfViewer.element.querySelector('.e-pv-toolbar');
                    if (!this.pdfViewer.enableToolbar) {
                        this.toolbarHeight = 0;
                        toolbarDiv.style.display = 'none';
                    }
                    if (!this.pdfViewer.enableNavigationToolbar) {
                        this.navigationPane.sideBarToolbar.style.display = 'none';
                        this.navigationPane.sideBarToolbarSplitter.style.display = 'none';
                        if (this.navigationPane.isBookmarkOpen || this.navigationPane.isThumbnailOpen) {
                            this.navigationPane.updateViewerContainerOnClose();
                        }
                    }
                }
            }
            if (toolbarDiv) {
                // tslint:disable-next-line:max-line-length
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 56);
            } else {
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 0);
            }
            // tslint:disable-next-line:max-line-length
            let viewerWidth: number = this.pdfViewer.element.clientWidth;
            if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                viewerWidth = viewerWidth - (this.navigationPane.sideBarToolbar ? this.navigationPane.getViewerContainerLeft() : 0) -
                    (this.navigationPane.commentPanelContainer ? this.navigationPane.getViewerContainerRight() : 0);
            }
            this.viewerContainer.style.width = viewerWidth + 'px';
            this.viewerMainContainer.appendChild(this.viewerContainer);
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.mobileScrollerContainer.style.left = (viewerWidth - parseFloat(this.mobileScrollerContainer.style.width)) + 'px';
                this.mobilePageNoContainer.style.left = (viewerWidth / 2) - (parseFloat(this.mobilePageNoContainer.style.width) / 2) + 'px';
                this.mobilePageNoContainer.style.top = (this.pdfViewer.element.clientHeight / 2) + 'px';
                this.mobilePageNoContainer.style.display = 'none';
                this.mobilePageNoContainer.appendChild(this.mobilecurrentPageContainer);
                this.mobilePageNoContainer.appendChild(this.mobilenumberContainer);
                this.mobilePageNoContainer.appendChild(this.mobiletotalPageContainer);
                this.viewerContainer.appendChild(this.mobilePageNoContainer);
                this.viewerMainContainer.appendChild(this.mobileScrollerContainer);
                this.mobileScrollerContainer.appendChild(this.mobileSpanContainer);
            }
            // tslint:disable-next-line:max-line-length
            this.pageContainer = createElement('div', { id: this.pdfViewer.element.id + '_pageViewContainer', className: 'e-pv-page-container', attrs: { 'tabindex': '0', 'aria-label': 'pdfviewer Page View' } });
            if (this.pdfViewer.enableRtl) {
                this.pageContainer.style.direction = 'ltr';
            }
            this.viewerContainer.appendChild(this.pageContainer);
            this.pageContainer.style.width = this.viewerContainer.clientWidth + 'px';
            if (toolbarDiv && this.pdfViewer.thumbnailViewModule && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
                this.pdfViewer.thumbnailViewModule.createThumbnailContainer();
            }
            this.createPrintPopup();
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.createGoToPagePopup();
            }
            let waitingPopup: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_loadingIndicator' });
            this.viewerContainer.appendChild(waitingPopup);
            createSpinner({ target: waitingPopup, cssClass: 'e-spin-center' });
            this.setLoaderProperties(waitingPopup);
            if (isBlazor()) {
                this.contextMenuModule = new BlazorContextMenu(this.pdfViewer, this);
            } else {
                this.contextMenuModule = new ContextMenu(this.pdfViewer, this);
            }
            this.contextMenuModule.createContextMenu();
            this.wireEvents();
            if (this.pdfViewer.textSearchModule && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
                this.pdfViewer.textSearchModule.createTextSearchBox();
            }
            if (this.pdfViewer.documentPath) {
                this.pdfViewer.load(this.pdfViewer.documentPath, null);
            }
            if (this.pdfViewer.annotationModule) {
                this.pdfViewer.annotationModule.initializeCollection();
            }
        }
    }

    private createMobilePageNumberContainer(): void {
        // tslint:disable-next-line:max-line-length
        this.mobilePageNoContainer = createElement('div', { id: this.pdfViewer.element.id + '_mobilepagenoContainer', className: 'e-pv-mobilepagenoscroll-container' });
        // tslint:disable-next-line:max-line-length
        this.mobilecurrentPageContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobilecurrentpageContainer', className: 'e-pv-mobilecurrentpage-container' });
        // tslint:disable-next-line:max-line-length
        this.mobilenumberContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobiledashedlineContainer', className: 'e-pv-mobiledashedline-container' });
        // tslint:disable-next-line:max-line-length
        this.mobiletotalPageContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobiletotalpageContainer', className: 'e-pv-mobiletotalpage-container' });
        this.mobileScrollerContainer = createElement('div', { id: this.pdfViewer.element.id + '_mobilescrollContainer', className: 'e-pv-mobilescroll-container' });
        // tslint:disable-next-line:max-line-length
        this.mobileSpanContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobilespanContainer', className: 'e-pv-mobilespanscroll-container' });
        this.mobileSpanContainer.innerHTML = '1';
        this.mobilecurrentPageContainer.innerHTML = '1';
        this.mobilenumberContainer.innerHTML = '&#x2015;&#x2015;&#x2015;&#x2015;&#x2015;';
        this.mobileScrollerContainer.style.cssFloat = 'right';
        this.mobileScrollerContainer.style.width = '40px';
        this.mobileScrollerContainer.style.height = '32px';
        this.mobileScrollerContainer.style.zIndex = '100';
        this.mobilePageNoContainer.style.width = '120px';
        this.mobilePageNoContainer.style.height = '100px';
        this.mobilePageNoContainer.style.zIndex = '100';
        this.mobilePageNoContainer.style.position = 'fixed';
        this.mobileScrollerContainer.addEventListener('touchstart', this.mobileScrollContainerDown.bind(this));
        this.mobileScrollerContainer.addEventListener('touchend', this.mobileScrollContainerEnd.bind(this));
        this.mobileScrollerContainer.style.display = 'none';
    }

    /**
     * @private
     */
    public initiatePageRender(documentData: string, password: string): void {
        this.loadedData = documentData;
        this.documentId = this.createGUID();
        if (this.viewerContainer) {
            this.viewerContainer.scrollTop = 0;
        }
        this.showLoadingIndicator(true);
        this.hashId = ' ';
        this.isFileName = false;
        this.saveDocumentInfo();
        if (this.pdfViewer.interactionMode === 'Pan') {
            this.initiatePanning();
        }
        documentData = this.checkDocumentData(documentData);
        this.setFileName();
        if (!this.pdfViewer.downloadFileName) {
            this.pdfViewer.downloadFileName = this.pdfViewer.fileName;
        }
        let jsonObject: object = this.constructJsonObject(documentData, password);
        this.createAjaxRequest(jsonObject, documentData, password);
    }
    // tslint:disable-next-line
    private mobileScrollContainerDown(event: any) {
        this.ispageMoved = false;
        this.isThumb = true;
        if (this.isTextMarkupAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage != null && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
                let pageNumber: number = this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearAnnotationSelection(pageNumber);
                this.pdfViewer.toolbar.showToolbar(true);
            }
        }
        this.mobileScrollerContainer.addEventListener('touchmove', this.viewerContainerOnScroll.bind(this), true);
    }

    /**
     * @private
     */
    public relativePosition(e: MouseEvent): PointModel {
        // tslint:disable-next-line
        let currentRect: any = this.viewerContainer.getBoundingClientRect();
        let left: number = e.clientX - currentRect.left;
        let top: number = e.clientY - currentRect.top;
        return { x: left, y: top };
    }
    // tslint:disable-next-line
    private setMaximumHeight(element: any): void {
        // tslint:disable-next-line
        let currentRect: any = element.getBoundingClientRect();
        if ((!Browser.isDevice || this.pdfViewer.enableDesktopMode) || (currentRect && currentRect.height === 0)) {
            element.style.minHeight = '500px';
        }
        this.updateWidth();
        this.updateHeight();
    }
    // tslint:disable-next-line
    private applyViewerHeight(element: any): void {
        // tslint:disable-next-line
        let currentRect: any = element.getBoundingClientRect();
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && currentRect && currentRect.height === 0) {
            element.style.minHeight = '500px';
        }
    }

    /**
     * @private
     */
    public updateWidth(): void {
        if (this.pdfViewer.width.toString() !== 'auto') {
            // tslint:disable-next-line
            (this.pdfViewer.element as any).style.width = this.pdfViewer.width;
        }
    }

    /**
     * @private
     */
    public updateHeight(): void {
        if (this.pdfViewer.height.toString() !== 'auto') {
            // tslint:disable-next-line
            (this.pdfViewer.element as any).style.height = this.pdfViewer.height;
        }
    }

    /**
     * @private
     */
    public updateViewerContainer(): void {
        let sideBarContentContainer: HTMLElement = this.getElement('_sideBarContentContainer');
        if (sideBarContentContainer) {
            this.navigationPane.updateViewerContainerOnClose();
        } else {
            this.updateViewerContainerSize();
        }
        // tslint:disable-next-line
        let toolbarModule: any = this.pdfViewer.toolbarModule;
        if (toolbarModule) {
            if (this.pdfViewer.enableToolbar) {
                toolbarModule.toolbar.refreshOverflow();
            }
            if (this.pdfViewer.enableAnnotationToolbar && toolbarModule.annotationToolbarModule) {
                toolbarModule.annotationToolbarModule.toolbar.refreshOverflow();
            }
        }
    }

    private updateViewerContainerSize(): void {
        // tslint:disable-next-line:max-line-length
        this.viewerContainer.style.width = this.pdfViewer.element.clientWidth + 'px';
        // tslint:disable-next-line:max-line-length
        this.pageContainer.style.width = this.viewerContainer.offsetWidth + 'px';
        this.updateZoomValue();
    }

    // tslint:disable-next-line
    private mobileScrollContainerEnd(event: any) {
        if (!this.ispageMoved) {
            this.goToPagePopup.show();
        }
        this.isThumb = false;
        this.ispageMoved = false;
        this.mobileScrollerContainer.removeEventListener('touchmove', this.viewerContainerOnScroll.bind(this), true);
        this.mobilePageNoContainer.style.display = 'none';
    }

    // tslint:disable-next-line
    private createAjaxRequest(jsonObject: any, documentData: string, password: string): void {
        let proxy: PdfViewerBase = this;
        if (this.pdfViewer.serverActionSettings) {
            this.loadRequestHandler = new AjaxHandler(this.pdfViewer);
            this.loadRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.load;
            this.loadRequestHandler.responseType = 'json';
            this.loadRequestHandler.mode = true;
            // tslint:disable-next-line
            jsonObject['action'] = 'Load';
            // tslint:disable-next-line
            jsonObject['elementId'] = this.pdfViewer.element.id;
            this.loadRequestHandler.send(jsonObject);
            // tslint:disable-next-line
            this.loadRequestHandler.onSuccess = function (result: any) {
                // tslint:disable-next-line
                let data: any = result.data;
                if (data) {
                    if (typeof data !== 'object') {
                        try {
                            data = JSON.parse(data);
                        } catch (error) {
                            proxy.onControlError(500, data, this.pdfViewer.serverActionSettings.load);
                            data = null;
                        }
                    }
                    if (data) {
                        while (typeof data !== 'object') {
                            data = JSON.parse(data);
                            // tslint:disable-next-line
                            if (typeof parseInt(data) === 'number' && !isNaN(parseInt(data))) {
                                // tslint:disable-next-line
                                data = parseInt(data);
                                break;
                            }
                        }
                        // tslint:disable-next-line
                        if (data.uniqueId === proxy.documentId || (typeof parseInt(data) === 'number' && !isNaN(parseInt(data)))) {
                            proxy.requestSuccess(data, documentData, password);
                        }
                    }
                }
            };
            // tslint:disable-next-line
            this.loadRequestHandler.onFailure = function (result: any) {
                let statusString: string = result.status.toString().split('')[0];
                if (statusString === '4') {
                    proxy.openNotificationPopup('Client error');
                } else {
                    proxy.openNotificationPopup();
                }
                proxy.showLoadingIndicator(false);
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.load);
            };
            // tslint:disable-next-line
            this.loadRequestHandler.onError = function (result: any) {
                proxy.openNotificationPopup();
                proxy.showLoadingIndicator(false);
                // tslint:disable-next-line
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.load);
            };
        }
    }

    /**
     * @private
     */
    public openNotificationPopup(errorString?: string): void {
        if (this.pdfViewer.showNotificationDialog) {
            if (errorString === 'Client error') {
                this.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('Client error'));
            } else {
                this.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('Server error'));
            }
            if (this.getElement('_notify')) {
                this.getElement('_notify').classList.add('e-pv-notification-large-content');
            }
        }
    }

    /**
     * @private
     */
    public showNotificationPopup(errorString: string): void {
        if (!this.pdfViewer.showNotificationDialog && errorString !== '') {
            this.textLayer.createNotificationPopup(errorString);
            if (this.getElement('_notify')) {
                this.getElement('_notify').classList.add('e-pv-notification-large-content');
            }
        }
    }

    // tslint:disable-next-line
    private requestSuccess(data: any, documentData: string, password: string): void {
        if (data && data.pageCount !== undefined) {
            if (isBlazor() && this.isPassword) {
                this.isPassword = false;
                this.isPasswordAvailable = false;
                this.pdfViewer._dotnetInstance.invokeMethodAsync('ClosePasswordDialog');
            }
            this.pageCount = data.pageCount;
            this.pdfViewer.pageCount = data.pageCount;
            this.hashId = data.hashId;
            this.documentLiveCount = data.documentLiveCount;
            this.isAnnotationCollectionRemoved = false;
            this.saveDocumentHashData();
            this.saveFormfieldsData(data);
            this.pageRender(data);
            // tslint:disable-next-line
            let pageData: any = { pageCount: data.pageCount, pageSizes: data.pageSizes };
            window.sessionStorage.setItem(this.documentId + '_pagedata', JSON.stringify(pageData));
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.mobileScrollerContainer.style.display = '';
                // tslint:disable-next-line
                let toolbarHeight: any = this.pdfViewer.toolbarModule ? this.toolbarHeight : 0;
                this.mobileScrollerContainer.style.top = (toolbarHeight) + 'px';
            }
        } else {
            this.pageCount = 0;
            this.currentPageNumber = 0;
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.mobileScrollerContainer.style.display = 'none';
            }
            if (data === 4) {
                if (isBlazor()) {
                    this.isPassword = true;
                }
                // 4 is error code for encrypted document.
                this.renderPasswordPopup(documentData, password);
            } else if (data === 3) {
                // 3 is error code for corrupted document.
                this.renderCorruptPopup();
            }
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.toolbarModule.updateToolbarItems();
            }
        }
        // tslint:disable-next-line
        let annotationModule: any = this.pdfViewer.annotationModule;
        // tslint:disable-next-line:max-line-length
        if (annotationModule && annotationModule.textMarkupAnnotationModule && annotationModule.textMarkupAnnotationModule.isEnableTextMarkupResizer(annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode)) {
            annotationModule.textMarkupAnnotationModule.createAnnotationSelectElement();
        }
    }

    // tslint:disable-next-line
    private pageRender(data: any): void {
        this.document = null;
        this.passwordDialogReset();
        if (this.passwordPopup) {
            this.passwordPopup.hide();
        }
        let pageIndex: number = 0;
        this.initPageDiv(data);
        this.currentPageNumber = pageIndex + 1;
        this.pdfViewer.currentPageNumber = pageIndex + 1;
        let isZoomMode: boolean = false;
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.isAutoZoom = true;
            if (this.pdfViewer.zoomValue) {
                if (this.pdfViewer.zoomValue > 0) {
                    isZoomMode = true;
                    this.isInitialPageMode = true;
                    this.pdfViewer.magnification.zoomTo(this.pdfViewer.zoomValue);
                }
            }
            if (this.pdfViewer.zoomMode === 'FitToWidth') {
                this.isInitialPageMode = true;
                this.pdfViewer.magnificationModule.fitToWidth();
            } else if (this.pdfViewer.zoomMode === 'FitToPage') {
                this.isInitialPageMode = true;
                this.pdfViewer.magnificationModule.fitToPage();
            }
            this.documentLoaded = true;
            this.pdfViewer.magnificationModule.isInitialLoading = true;
            this.onWindowResize();
            this.documentLoaded = false;
            this.pdfViewer.magnificationModule.isInitialLoading = false;
        }
        this.isDocumentLoaded = true;
        // tslint:disable-next-line
        let viewPortWidth: any = 816;
        // tslint:disable-next-line:radix
        viewPortWidth = parseInt(viewPortWidth);
        let pageWidth: number = this.pageSize[pageIndex].width;
        if (this.renderedPagesList.indexOf(pageIndex) === -1 && !isZoomMode) {
            this.createRequestForRender(pageIndex);
            let pageNumber: number = pageIndex + 1;
            if (pageNumber < this.pageCount) {
                this.createRequestForRender(pageNumber);
                pageNumber = pageNumber + 1;
            }
            if (this.pageSize[pageNumber]) {
                let pageTop: number = this.getPageTop(pageNumber);
                let viewerHeight: number = this.viewerContainer.clientHeight;
                while (viewerHeight > pageTop) {
                    if (this.pageSize[pageNumber]) {
                        this.renderPageElement(pageNumber);
                        this.createRequestForRender(pageNumber);
                        pageTop = this.getPageTop(pageNumber);
                        pageNumber = pageNumber + 1;
                    } else {
                        break;
                    }
                }
            }
        }
        this.showLoadingIndicator(false);
        if (!isBlazor()) {
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.toolbarModule.uploadedDocumentName = null;
                this.pdfViewer.toolbarModule.updateCurrentPage(this.currentPageNumber);
                this.pdfViewer.toolbarModule.updateToolbarItems();
                if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableAnnotationAddTools(true);
                }
                // tslint:disable-next-line:max-line-length
                this.viewerContainer.setAttribute('aria-labelledby', this.pdfViewer.element.id + '_pageDiv_' + (this.currentPageNumber - 1));
            }
        }
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.mobileSpanContainer.innerHTML = this.currentPageNumber.toString();
            this.mobilecurrentPageContainer.innerHTML = this.currentPageNumber.toString();
        }
    }

    private renderPasswordPopup(documentData: string, password: string): void {
        if (!isBlazor()) {
            if (!this.isPasswordAvailable) {
                if (this.isFileName) {
                    this.document = documentData;
                } else {
                    this.document = 'data:application/pdf;base64,' + documentData;
                }
                this.isPasswordAvailable = true;
                this.createPasswordPopup();
                this.pdfViewer.fireDocumentLoadFailed(true, null);
                this.passwordPopup.show();
            } else {
                this.pdfViewer.fireDocumentLoadFailed(true, password);
                this.promptElement.classList.add('e-pv-password-error');
                this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Invalid Password');
                this.promptElement.focus();
                if (this.isFileName) {
                    this.document = documentData;
                } else {
                    this.document = 'data:application/pdf;base64,' + documentData;
                }
                this.passwordPopup.show();
            }
        } else {
            // tslint:disable-next-line
            let promptElement: any = document.getElementById(this.pdfViewer.element.id + '_prompt');
            promptElement.textContent = this.pdfViewer.localeObj.getConstant('Enter Password');
            // tslint:disable-next-line
            let passwordInput: any = document.querySelector('#' + this.pdfViewer.element.id + '_password_input');
            passwordInput.addEventListener('keyup', () => {
                if ((passwordInput as HTMLInputElement).value === '') {
                    this.passwordDialogReset();
                }
            });
            passwordInput.addEventListener('focus', () => {
                passwordInput.parentElement.classList.add('e-input-focus');
            });
            passwordInput.addEventListener('blur', () => {
                passwordInput.parentElement.classList.remove('e-input-focus');
            });
            if (!this.isPasswordAvailable) {
                if (this.isFileName) {
                    this.document = documentData;
                } else {
                    this.document = 'data:application/pdf;base64,' + documentData;
                }
                this.isPasswordAvailable = true;
                this.pdfViewer.fireDocumentLoadFailed(true, null);
            } else {
                this.pdfViewer.fireDocumentLoadFailed(true, password);
                promptElement.classList.add('e-pv-password-error');
                promptElement.textContent = this.pdfViewer.localeObj.getConstant('Invalid Password');
                promptElement.focus();
                if (this.isFileName) {
                    this.document = documentData;
                } else {
                    this.document = 'data:application/pdf;base64,' + documentData;
                }
            }
            this.pdfViewer._dotnetInstance.invokeMethodAsync('OpenPasswordDialog');
        }
    }

    private renderCorruptPopup(): void {
        this.pdfViewer.fireDocumentLoadFailed(false, null);
        this.documentId = null;
        if (!isBlazor()) {
            this.createCorruptedPopup();
            this.corruptPopup.show();
        } else {
            this.pdfViewer._dotnetInstance.invokeMethodAsync('OpenCorruptedDialog');
        }
    }
    private constructJsonObject(documentData: string, password: string): object {
        let jsonObject: object;
        if (password) {
            this.isPasswordAvailable = true;
            this.passwordData = password;
            // tslint:disable-next-line:max-line-length
            jsonObject = { document: documentData, password: password, zoomFactor: 1, isFileName: this.isFileName, uniqueId: this.documentId };
        } else {
            this.isPasswordAvailable = false;
            this.passwordData = '';
            jsonObject = { document: documentData, zoomFactor: 1, isFileName: this.isFileName, uniqueId: this.documentId };
        }
        return jsonObject;
    }
    private checkDocumentData(documentData: string): string {
        let base64String: string = documentData.split('base64,')[1];
        if (base64String === undefined) {
            this.isFileName = true;
            this.jsonDocumentId = documentData;
            if (this.pdfViewer.fileName === null) {
                // tslint:disable-next-line:max-line-length
                let documentStringArray: string[] = (documentData.indexOf('\\') !== -1) ? documentData.split('\\') : documentData.split('/');
                this.pdfViewer.fileName = documentStringArray[documentStringArray.length - 1];
                this.jsonDocumentId = this.pdfViewer.fileName;
                base64String = documentData;
            }
        } else {
            this.jsonDocumentId = null;
        }
        return base64String;
    }

    private setFileName(): void {
        if (this.pdfViewer.fileName === null) {
            if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.uploadedDocumentName) {
                this.pdfViewer.fileName = this.pdfViewer.toolbarModule.uploadedDocumentName;
                this.jsonDocumentId = this.pdfViewer.fileName;
            } else {
                this.pdfViewer.fileName = 'undefined.pdf';
                this.jsonDocumentId = null;
            }
        }
    }
    private saveDocumentInfo(): void {
        window.sessionStorage.setItem('currentDocument', this.documentId);
        window.sessionStorage.setItem('serviceURL', this.pdfViewer.serviceUrl);
        if (this.pdfViewer.serverActionSettings) {
            window.sessionStorage.setItem('unload', this.pdfViewer.serverActionSettings.unload);
        }
    }
    private saveDocumentHashData(): void {
        window.sessionStorage.setItem('hashId', this.hashId);
        if (this.documentLiveCount) {
            window.sessionStorage.setItem('documentLiveCount', this.documentLiveCount.toString());
        }
    }
    // tslint:disable-next-line
    private saveFormfieldsData(data: any): void {
        this.pdfViewer.isFormFieldDocument = false;
        this.enableFormFieldButton(false);
        if (data && data.PdfRenderedFormFields && data.PdfRenderedFormFields.length > 0) {
            if (this.formfieldvalue) {
                window.sessionStorage.setItem(this.documentId + '_formfields', JSON.stringify(this.formfieldvalue));
                this.formfieldvalue = null;
            } else {
                window.sessionStorage.setItem(this.documentId + '_formfields', JSON.stringify(data.PdfRenderedFormFields));
            }
            if (this.pdfViewer.enableFormFields) {
                this.pdfViewer.formFieldsModule.formFieldCollections();
            }
            if (this.pdfViewer.formFieldCollections.length > 0) {
            this.pdfViewer.isFormFieldDocument = true;

            this.enableFormFieldButton(true);
            }
        }
    }
    private enableFormFieldButton(isEnable: boolean): void {
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.submitItem) {
            this.pdfViewer.toolbarModule.toolbar.enableItems(this.pdfViewer.toolbarModule.submitItem.parentElement, isEnable);
        }
    }
    private updateWaitingPopup(pageNumber: number): void {
        if (this.pageSize[pageNumber].top != null) {
            // tslint:disable-next-line:max-line-length
            let pageCurrentRect: ClientRect = this.getElement('_pageDiv_' + pageNumber).getBoundingClientRect();
            let waitingPopup: HTMLElement = this.getElement('_pageDiv_' + pageNumber).firstChild.firstChild as HTMLElement;
            if (pageCurrentRect.top < 0) {
                if (this.toolbarHeight + (this.viewerContainer.clientHeight / 2) - pageCurrentRect.top < pageCurrentRect.height) {
                    waitingPopup.style.top = ((this.viewerContainer.clientHeight / 2) - pageCurrentRect.top) - this.toolbarHeight + 'px';
                } else {
                    if (this.toolbarHeight + (pageCurrentRect.bottom / 2) - pageCurrentRect.top < pageCurrentRect.height) {
                        waitingPopup.style.top = ((pageCurrentRect.bottom / 2) - pageCurrentRect.top) - this.toolbarHeight + 'px';
                    }
                }
            } else {
                waitingPopup.style.top = this.viewerContainer.clientHeight / 2 + 'px';
            }
            if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && pageCurrentRect.width > this.viewerContainer.clientWidth) {
                waitingPopup.style.left = (this.viewerContainer.clientWidth / 2) + (this.viewerContainer.scrollLeft) + 'px';
            } else if (this.getZoomFactor() > 1.25 && pageCurrentRect.width > this.viewerContainer.clientWidth) {
                waitingPopup.style.left = this.viewerContainer.clientWidth / 2 + 'px';
            } else {
                waitingPopup.style.left = pageCurrentRect.width / 2 + 'px';
            }
        }
    }
    private createWaitingPopup(pageNumber: number): void {
        // tslint:disable-next-line:max-line-length
        let waitingPopup: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageNumber);
        if (waitingPopup) {
            createSpinner({ target: waitingPopup });
            this.setLoaderProperties(waitingPopup);
        }
    }

    private showLoadingIndicator(isShow: boolean): void {
        let waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
        if (waitingPopup) {
            if (isShow) {
                showSpinner(waitingPopup);
            } else {
                hideSpinner(waitingPopup);
            }
        }
    }

    private showPageLoadingIndicator(pageIndex: number, isShow: boolean): void {
        let waitingPopup: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
        if (waitingPopup != null) {
            if (isShow) {
                showSpinner(waitingPopup);
            } else {
                hideSpinner(waitingPopup);
            }
            this.updateWaitingPopup(pageIndex);
        }
    }
    /**
     * @private
     */
    public showPrintLoadingIndicator(isShow: boolean): void {
        let printWaitingPopup: HTMLElement = this.getElement('_printLoadingIndicator');
        if (printWaitingPopup != null) {
            if (isShow) {
                this.printMainContainer.style.display = 'block';
                showSpinner(printWaitingPopup);
            } else {
                this.printMainContainer.style.display = 'none';
                hideSpinner(printWaitingPopup);
            }
        }
    }

    private setLoaderProperties(element: HTMLElement): void {
        let spinnerElement: HTMLElement = (element.firstChild.firstChild.firstChild as HTMLElement);
        if (spinnerElement) {
            spinnerElement.style.height = '48px';
            spinnerElement.style.width = '48px';
            spinnerElement.style.transformOrigin = '24px 24px 24px';
        }
    }
    /**
     * @private
     */
    public updateScrollTop(pageNumber: number): void {
        // tslint:disable-next-line
        if (this.pageSize[pageNumber] != null) {
            this.viewerContainer.scrollTop = this.getPageTop(pageNumber);
            this.renderElementsVirtualScroll(pageNumber);
            if (this.renderedPagesList.indexOf(pageNumber) === -1) {
                this.createRequestForRender(pageNumber);
            }
            setTimeout(
                () => {
                    let currentPageNumber: number = pageNumber + 1;
                    if (currentPageNumber !== this.currentPageNumber) {
                        this.pdfViewer.currentPageNumber = currentPageNumber;
                        this.currentPageNumber = currentPageNumber;
                        this.pdfViewer.toolbarModule.updateCurrentPage(currentPageNumber);
                    }
                },
                800);
        }
    }
    /**
     * @private
     */
    public getZoomFactor(): number {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.zoomFactor;
        } else {
            // default value
            return 1;
        }
    }
    /**
     * @private
     */
    public getPinchZoomed(): boolean {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPinchZoomed;
        } else {
            // default value
            return false;
        }
    }
    /**
     * @private
     */
    public getMagnified(): boolean {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isMagnified;
        } else {
            // default value
            return false;
        }
    }

    private getPinchScrolled(): boolean {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPinchScrolled;
        } else {
            // default value
            return false;
        }
    }

    private getPagesPinchZoomed(): boolean {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPagePinchZoomed;
        } else {
            // default value
            return false;
        }
    }

    private getPagesZoomed(): boolean {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPagesZoomed;
        } else {
            // default value
            return false;
        }
    }

    private getRerenderCanvasCreated(): boolean {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isRerenderCanvasCreated;
        } else {
            // default value
            return false;
        }
    }
    /**
     * @private
     */
    public getDocumentId(): string {
        return this.documentId;
    }
    /**
     * @private
     */
    public download(): void {
        if (this.pageCount > 0) {
            this.createRequestForDownload();
        }
    }

    /**
     * @private
     */
    public saveAsBlob(): Promise<Blob> {
        if (this.pageCount > 0) {
            return new Promise((resolve: Function, reject: Function) => {
                this.saveAsBlobRequest().then((value: Blob) => {
                    resolve(value);
                });
            });
        }
        return null;
    }

    private saveAsBlobRequest(): Promise<Blob> {
        let proxy: PdfViewerBase = this;
        let promise: Promise<Blob> = new Promise((resolve: Function, reject: Function) => {
            // tslint:disable-next-line
            let jsonObject: any = proxy.constructJsonDownload();
            this.dowonloadRequestHandler = new AjaxHandler(this.pdfViewer);
            this.dowonloadRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.download;
            this.dowonloadRequestHandler.responseType = 'text';
            this.dowonloadRequestHandler.send(jsonObject);
            // tslint:disable-next-line
            this.dowonloadRequestHandler.onSuccess = function (result: any) {
                // tslint:disable-next-line
                let data: any = result.data;
                if (data) {
                    if (typeof data === 'object') {
                        data = JSON.parse(data);
                    }
                    if (typeof data !== 'object' && data.indexOf('data:application/pdf') === -1) {
                        proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.download);
                        data = null;
                    }
                    if (data) {
                        let blobUrl: string = proxy.createBlobUrl(data.split('base64,')[1], 'application/pdf');
                        resolve(blobUrl);
                    }
                }
            };
            // tslint:disable-next-line
            this.dowonloadRequestHandler.onFailure = function (result: any) {
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
            };
            // tslint:disable-next-line
            this.dowonloadRequestHandler.onError = function (result: any) {
                proxy.openNotificationPopup();
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
            };
        });
        return promise;
    }

    /**
     * @private
     */
    public clear(isTriggerEvent: boolean): void {
        this.isPasswordAvailable = false;
        this.isDocumentLoaded = false;
        this.isInitialLoaded = false;
        this.isImportAction = false;
        this.annotationPageList = [];
        this.annotationComments = null;
        this.pdfViewer.isDocumentEdited = false;
        this.pdfViewer.annotationCollection = [];
        this.pdfViewer.signatureCollection = [];
        this.isAnnotationCollectionRemoved = false;
        this.documentAnnotationCollections = null;
        this.annotationRenderredList = [];
        this.isImportAction = false;
        this.isImportedAnnotation = false;
        this.importedAnnotation = [];
        this.isStorageExceed = false;
        this.annotationStorage = {};
        this.downloadCollections = {};
        this.annotationEvent = null;
        this.highestWidth = 0;
        this.requestLists = [];
        this.tilerequestLists = [];
        this.pdfViewer.formFieldCollections = [];
        this.initiateTextSelectMode();
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (this.navigationPane.sideBarToolbar) {
                this.navigationPane.clear();
            }
        }
        if (this.pdfViewer.thumbnailViewModule) {
            this.pdfViewer.thumbnailViewModule.clear();
        }
        if (this.pdfViewer.bookmarkViewModule) {
            this.pdfViewer.bookmarkViewModule.clear();
        }
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.clearIntervalTimer();
        }
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        if (this.pdfViewer.textSearchModule) {
            this.pdfViewer.textSearchModule.resetTextSearch();
        }
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.clear();
        }
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.initializeCollection();
        }
        if (this.pdfViewer.formFieldsModule) {
            this.pdfViewer.formFieldsModule.readOnlyCollection = [];
        }
        if (this.signatureModule) {
            this.signatureModule.signaturecollection = [];
            this.signatureModule.outputcollection = [];
        }
        if (this.pageSize) {
            this.pageSize = [];
        }
        if (this.renderedPagesList) {
            this.renderedPagesList = [];
        }
        if (this.pageContainer) {
            while (this.pageContainer.hasChildNodes()) {
                this.pageContainer.removeChild(this.pageContainer.lastChild);
            }
        }
        if (this.pageCount > 0) {
            this.unloadDocument(this);
            // tslint:disable-next-line
            this.textLayer.characterBound = new Array();
        }
        this.windowSessionStorageClear();
        if (this.pinchZoomStorage) {
            this.pinchZoomStorage = [];
        }
        if (isTriggerEvent && this.pageCount > 0) {
            this.pdfViewer.fireDocumentUnload(this.pdfViewer.fileName);
        }
        this.pdfViewer.fileName = null;
    }
    /**
     * @private
     */
    public destroy(): void {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.pdfViewer.element.classList.remove('e-pv-mobile-view');
        }
        this.unWireEvents();
        this.clear(false);
        this.pageContainer.parentNode.removeChild(this.pageContainer);
        this.viewerContainer.parentNode.removeChild(this.viewerContainer);
        this.contextMenuModule.destroy();
        if (this.pdfViewer.toolbarModule) {
            this.navigationPane.destroy();
        }
        let measureElement: HTMLElement = document.getElementById('measureElement');
        if (measureElement) {
            measureElement = undefined;
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public unloadDocument(proxy: PdfViewerBase): void {
        let documentId: string = window.sessionStorage.getItem('hashId');
        let documentLiveCount: string = window.sessionStorage.getItem('documentLiveCount');
        if (documentId !== null) {
            // tslint:disable-next-line:max-line-length
            let jsonObject: object = { hashId: documentId, documentLiveCount: documentLiveCount, action: 'Unload', elementId: proxy.pdfViewer.element.id };
            let actionName: string = window.sessionStorage.getItem('unload');
            if (window.sessionStorage.getItem('serviceURL') && window.sessionStorage.getItem('serviceURL') !== 'undefined') {
                try {
                    // tslint:disable-next-line
                    let browserSupportsKeepalive: any = 'keepalive' in new Request('');
                    if (browserSupportsKeepalive) {
                        // tslint:disable-next-line
                        let headerValue: any = this.setUnloadRequestHeaders();
                        let credentialsData: RequestCredentials = this.pdfViewer.ajaxRequestSettings.withCredentials ? 'include' : 'omit';
                        fetch(window.sessionStorage.getItem('serviceURL') + '/' + actionName, {
                            method: 'POST',
                            credentials: credentialsData,
                            headers: headerValue,
                            body: JSON.stringify(jsonObject)
                        });
                    }
                } catch (error) {
                    this.unloadRequestHandler = new AjaxHandler(this.pdfViewer);
                    this.unloadRequestHandler.send(jsonObject);
                }
            } else if (window.sessionStorage.getItem('serviceURL') && isBlazor()) {
                this.unloadRequestHandler = new AjaxHandler(this.pdfViewer);
                this.unloadRequestHandler.url = window.sessionStorage.getItem('serviceURL') + '/' + actionName;
                this.unloadRequestHandler.mode = false;
                this.unloadRequestHandler.responseType = null;
                this.unloadRequestHandler.send(jsonObject);
                // tslint:disable-next-line
                this.unloadRequestHandler.onSuccess = function (result: any) {
                    // tslint:disable-next-line
                    let data: any = result.data;
                    if (data) {
                        if (typeof data !== 'object') {
                            if (data.indexOf('Document') === -1) {
                                proxy.onControlError(500, data, actionName);
                                data = null;
                            }
                        }
                    }
                };
                // tslint:disable-next-line
                this.unloadRequestHandler.onFailure = function (result: any) {
                    proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, actionName);
                };
                // tslint:disable-next-line
                this.unloadRequestHandler.onError = function (result: any) {
                    proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, actionName);
                };
            }
        }
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.zoomFactor = 1;
        }
        window.sessionStorage.removeItem('hashId');
        window.sessionStorage.removeItem('documentLiveCount');
        if (this.documentId) {
            window.sessionStorage.removeItem(this.documentId + '_formfields');
            window.sessionStorage.removeItem(this.documentId + '_annotations_shape');
            window.sessionStorage.removeItem(this.documentId + '_annotations_shape_measure');
            window.sessionStorage.removeItem(this.documentId + '_annotations_stamp');
            window.sessionStorage.removeItem(this.documentId + '_annotations_sticky');
            window.sessionStorage.removeItem(this.documentId + '_annotations_textMarkup');
            window.sessionStorage.removeItem(this.documentId + '_annotations_freetext');
            window.sessionStorage.removeItem(this.documentId + '_formfields');
            window.sessionStorage.removeItem(this.documentId + '_annotations_sign');
            window.sessionStorage.removeItem(this.documentId + '_annotations_ink');
        }
    }

    // tslint:disable-next-line
    private setUnloadRequestHeaders(): any {
        // tslint:disable-next-line
        let myHeaders: any = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=UTF-8');
        for (let i: number = 0; i < this.pdfViewer.ajaxRequestSettings.ajaxHeaders.length; i++) {
            // tslint:disable-next-line:max-line-length
            myHeaders.append(this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerName, this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerValue);
        }
        return myHeaders;
    }

    /**
     * @private
     */
    private windowSessionStorageClear(): void {
        window.sessionStorage.removeItem('currentDocument');
        window.sessionStorage.removeItem('serviceURL');
        window.sessionStorage.removeItem('unload');
        for (let i: number = 0; i < this.sessionStorage.length; i++) {
            window.sessionStorage.removeItem(this.sessionStorage[i]);
        }
    }

    private updateCommentPanel(): void {
        // tslint:disable-next-line
        let moreOptionsButton: any = document.querySelectorAll('#' + this.pdfViewer.element.id + '_more-options');
        for (let i: number = 0; i < moreOptionsButton.length; i++) {
            moreOptionsButton[i].style.visibility = 'hidden';
        }
        // tslint:disable-next-line
        let commentTextBox: any = document.querySelectorAll('.e-pv-new-comments-div');
        for (let j: number = 0; j < commentTextBox.length; j++) {
            commentTextBox[j].style.display = 'none';
        }
        // tslint:disable-next-line
        let commentContainer: any = document.querySelectorAll('.e-pv-comments-border');
        for (let j: number = 0; j < commentContainer.length; j++) {
            commentContainer[j].classList.remove('e-pv-comments-border');
        }
        // tslint:disable-next-line
        let editableElement: any = document.querySelectorAll('.e-editable-inline');
        for (let j: number = 0; j < editableElement.length; j++) {
            editableElement[j].style.display = 'none';
        }
        // tslint:disable-next-line
        let commentSelect: any = document.querySelectorAll('.e-pv-comments-select');
        for (let z: number = 0; z < commentSelect.length; z++) {
            commentSelect[z].classList.remove('e-pv-comments-select');
        }
        // tslint:disable-next-line
        let commentsDiv: any = document.querySelectorAll('.e-pv-comments-div');
        for (let j: number = 0; j < commentsDiv.length; j++) {
            commentsDiv[j].style.minHeight = 60 + 'px';
        }
    }
    /**
     * @private
     */
    public focusViewerContainer(isMouseDown?: boolean): void {
        let scrollX: number = window.scrollX;
        let scrollY: number = window.scrollY;
        // tslint:disable-next-line
        let parentNode: any = this.getScrollParent(this.viewerContainer);
        let scrollNodeX: number = 0;
        let scrollNodeY: number = 0;
        if (parentNode !== null) {
            scrollNodeX = parentNode.scrollLeft;
            scrollNodeY = parentNode.scrollTop;
        }
        this.viewerContainer.focus();
        if (this.currentPageNumber > 0) {
            this.viewerContainer.setAttribute('aria-labelledby', this.pdfViewer.element.id + '_pageDiv_' + (this.currentPageNumber - 1));
        }
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.stickyNotesAnnotationModule.accordionContainer) {
            this.updateCommentPanel();
        }
        // tslint:disable-next-line:max-line-length
        if ((navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1 || navigator.userAgent.indexOf('Edge') !== -1) && parentNode !== null) {
            parentNode.scrollLeft = scrollNodeX;
            parentNode.scrollTop = scrollNodeY;
        } else if (parentNode !== null) {
            parentNode.scrollTo(scrollNodeX, scrollNodeY);
        }
        window.scrollTo(scrollX, scrollY);
    }
    // tslint:disable-next-line
    private getScrollParent(node: any): any {
        if (node === null || node.nodeName === 'HTML') {
            return null;
        }
        let style: CSSStyleDeclaration = getComputedStyle(node);
        if (this.viewerContainer.id !== node.id && (style.overflowY === 'scroll' || style.overflowY === 'auto')) {
            return node;
        } else {
            return this.getScrollParent(node.parentNode);
        }
    }
    private createCorruptedPopup(): void {
        // tslint:disable-next-line:max-line-length
        let popupElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_corrupted_popup', className: 'e-pv-corrupted-popup' });
        this.pageContainer.appendChild(popupElement);
        this.corruptPopup = new Dialog({
            showCloseIcon: true, closeOnEscape: true, isModal: true,
            // tslint:disable-next-line:max-line-length
            header: '<div class="e-pv-corrupted-popup-header"> ' + this.pdfViewer.localeObj.getConstant('File Corrupted') + '</div>', visible: false,
            // tslint:disable-next-line:max-line-length
            buttons: [{ buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.closeCorruptPopup.bind(this) }],
            target: this.pdfViewer.element, beforeClose: (): void => {
                this.corruptPopup.destroy();
                this.getElement('_corrupted_popup').remove();
                this.corruptPopup = null;
                let waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
                if (waitingPopup != null) {
                    hideSpinner(waitingPopup);
                }
            }
        });
        if (this.pdfViewer.enableRtl) {
            // tslint:disable-next-line:max-line-length
            this.corruptPopup.content = '<div id="templatertl" class="e-pv-notification-icon-rtl"> <div class="e-pv-corrupted-popup-content-rtl" tabindex="0">' + this.pdfViewer.localeObj.getConstant('File Corrupted Content') + '</div></div>';
            this.corruptPopup.enableRtl = true;
        } else {
            // tslint:disable-next-line:max-line-length
            this.corruptPopup.content = '<div id="template" class="e-pv-notification-icon"> <div class="e-pv-corrupted-popup-content" tabindex="0">' + this.pdfViewer.localeObj.getConstant('File Corrupted Content') + '</div></div>';
        }
        this.corruptPopup.appendTo(popupElement);
    }

    /**
     * @private
     */
    public hideLoadingIndicator(): void {
        let waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
        if (waitingPopup !== null) {
            hideSpinner(waitingPopup);
        }
    }

    private closeCorruptPopup(): void {
        this.corruptPopup.hide();
        let waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
        if (waitingPopup !== null) {
            hideSpinner(waitingPopup);
        }
    }

    private createPrintPopup(): void {
        let element: HTMLElement = document.getElementById(this.pdfViewer.element.id);
        this.printMainContainer = createElement('div', {
            id: this.pdfViewer.element.id + '_printcontainer',
            className: 'e-pv-print-popup-container'
        });
        element.appendChild(this.printMainContainer);
        this.printMainContainer.style.display = 'none';
        let printWaitingPopup: HTMLElement = createElement('div', {
            id: this.pdfViewer.element.id + '_printLoadingIndicator',
            className: 'e-pv-print-loading-container'
        });
        this.printMainContainer.appendChild(printWaitingPopup);
        createSpinner({ target: printWaitingPopup, cssClass: 'e-spin-center' });
        this.setLoaderProperties(printWaitingPopup);
    }
    private createGoToPagePopup(): void {
        // tslint:disable-next-line:max-line-length
        let popupElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_goTopage_popup', className: 'e-pv-gotopage-popup' });
        this.goToPageElement = createElement('span', { id: this.pdfViewer.element.id + '_prompt' });
        this.goToPageElement.textContent = this.pdfViewer.localeObj.getConstant('Enter pagenumber');
        popupElement.appendChild(this.goToPageElement);
        let inputContainer: HTMLElement = createElement('span', { className: 'e-pv-text-input' });
        // tslint:disable-next-line:max-line-length
        this.goToPageInput = createElement('input', { id: this.pdfViewer.element.id + '_page_input', className: 'e-input' });
        (this.goToPageInput as HTMLInputElement).type = 'text';
        (this.goToPageInput as HTMLInputElement).style.maxWidth = '80%';
        this.pageNoContainer = createElement('span', { className: '.e-pv-number-ofpages' });
        inputContainer.appendChild(this.goToPageInput);
        inputContainer.appendChild(this.pageNoContainer);
        popupElement.appendChild(inputContainer);
        this.pageContainer.appendChild(popupElement);
        this.goToPagePopup = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true,
            header: this.pdfViewer.localeObj.getConstant('GoToPage'), visible: false, buttons: [
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') },
                    click: this.GoToPageCancelClick.bind(this),
                },
                // tslint:disable-next-line:max-line-length
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('Apply'), disabled: true, cssClass: 'e-pv-gotopage-apply-btn', isPrimary: true },
                    click: this.GoToPageApplyClick.bind(this),
                },
            ], close: this.closeGoToPagePopUp.bind(this),
        });
        if (this.pdfViewer.enableRtl) {
            this.goToPagePopup.enableRtl = true;
        }
        this.goToPagePopup.appendTo(popupElement);
        let goToPageTextBox: NumericTextBox = new NumericTextBox({ format: '##', showSpinButton: false });
        goToPageTextBox.appendTo(this.goToPageInput);
        this.goToPageInput.addEventListener('keyup', () => {
            // tslint:disable-next-line
            let inputValue: any = (this.goToPageInput as HTMLInputElement).value;
            if (inputValue !== '' && parseFloat(inputValue) > 0 && (this.pdfViewer.pageCount + 1) > parseFloat(inputValue)) {
                this.EnableApplyButton();
            } else {
                this.DisableApplyButton();
            }
        });
    }
    private closeGoToPagePopUp(): void {
        (this.goToPageInput as HTMLInputElement).value = '';
        this.DisableApplyButton();
    }

    private EnableApplyButton(): void {
        // tslint:disable-next-line
        let popupElements: any = document.getElementsByClassName('e-pv-gotopage-apply-btn')[0];
        popupElements.removeAttribute('disabled');
    }
    private DisableApplyButton(): void {
        // tslint:disable-next-line
        let popupElements: any = document.getElementsByClassName('e-pv-gotopage-apply-btn')[0];
        popupElements.setAttribute('disabled', true);
    }
    private GoToPageCancelClick(): void {
        this.goToPagePopup.hide();
    }
    private GoToPageApplyClick(): void {
        this.goToPagePopup.hide();
        // tslint:disable-next-line
        let pageNumber: any = (this.goToPageInput as HTMLInputElement).value;
        this.pdfViewer.navigation.goToPage(pageNumber);
        this.updateMobileScrollerPosition();
    }
    /**
     * @private
     */
    public updateMobileScrollerPosition(): void {
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.mobileScrollerContainer) {
            // tslint:disable-next-line
            let ratio: any = (this.viewerContainer.scrollHeight - this.viewerContainer.clientHeight) / (this.viewerContainer.clientHeight - 56);
            // tslint:disable-next-line
            let differenceRatio: any = (this.viewerContainer.scrollTop) / ratio;
            // tslint:disable-next-line
            let toolbarHeight: any = this.pdfViewer.toolbarModule ? this.toolbarHeight : 0;
            this.mobileScrollerContainer.style.top = (toolbarHeight + differenceRatio) + 'px';
        }
    }
    private createPasswordPopup(): void {
        // tslint:disable-next-line:max-line-length
        let popupElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_password_popup', className: 'e-pv-password-popup', attrs: { 'tabindex': '-1' } });
        this.promptElement = createElement('span', { id: this.pdfViewer.element.id + '_prompt', attrs: { 'tabindex': '-1' } });
        this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Enter Password');
        popupElement.appendChild(this.promptElement);
        let inputContainer: HTMLElement = createElement('span', { className: 'e-input-group e-pv-password-input' });
        // tslint:disable-next-line:max-line-length
        this.passwordInput = createElement('input', { id: this.pdfViewer.element.id + '_password_input', className: 'e-input' });
        (this.passwordInput as HTMLInputElement).type = 'password';
        (this.passwordInput as HTMLInputElement).name = 'Required';
        inputContainer.appendChild(this.passwordInput);
        popupElement.appendChild(inputContainer);
        this.pageContainer.appendChild(popupElement);
        this.passwordPopup = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true,
            header: this.pdfViewer.localeObj.getConstant('Password Protected'), visible: false,
            close: this.passwordCancel.bind(this), target: this.pdfViewer.element, beforeClose: (): void => {
                this.passwordPopup.destroy();
                this.getElement('_password_popup').remove();
                this.passwordPopup = null;
                let waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
                if (waitingPopup != null) {
                    hideSpinner(waitingPopup);
                }
            }
        });
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.passwordPopup.buttons = [
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true },
                    click: this.applyPassword.bind(this)
                },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.passwordCancelClick.bind(this) }
            ];
        } else {
            this.passwordPopup.buttons = [
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.passwordCancelClick.bind(this) },
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true },
                    click: this.applyPassword.bind(this)
                }
            ];
        }
        if (this.pdfViewer.enableRtl) {
            this.passwordPopup.enableRtl = true;
        }
        this.passwordPopup.appendTo(popupElement);
        this.passwordInput.addEventListener('keyup', () => {
            if ((this.passwordInput as HTMLInputElement).value === '') {
                this.passwordDialogReset();
            }
        });
        this.passwordInput.addEventListener('focus', () => {
            this.passwordInput.parentElement.classList.add('e-input-focus');
        });
        this.passwordInput.addEventListener('blur', () => {
            this.passwordInput.parentElement.classList.remove('e-input-focus');
        });
    }

    // tslint:disable-next-line
    private passwordCancel(args: any): void {
        if (args.isInteraction) {
            this.clear(false);
            this.passwordDialogReset();
            (this.passwordInput as HTMLInputElement).value = '';
        }
        let waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
        if (waitingPopup !== null) {
            hideSpinner(waitingPopup);
        }
    }

    private passwordCancelClick(): void {
        this.clear(false);
        this.passwordDialogReset();
        this.passwordPopup.hide();
        let waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
        if (waitingPopup !== null) {
            hideSpinner(waitingPopup);
        }
    }

    private passwordDialogReset(): void {
        if (isBlazor()) {
            // tslint:disable-next-line
            let passwordInput: any = document.querySelector('#' + this.pdfViewer.element.id + '_password_input');
            // tslint:disable-next-line
            let promptElement: any = document.querySelector('#' + this.pdfViewer.element.id + '_prompt');
            if (promptElement) {
                promptElement.classList.remove('e-pv-password-error');
                promptElement.textContent = this.pdfViewer.localeObj.getConstant('Enter Password');
                (passwordInput as HTMLInputElement).value = '';
            }
        } else {
            if (this.promptElement) {
                this.promptElement.classList.remove('e-pv-password-error');
                this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Enter Password');
                (this.passwordInput as HTMLInputElement).value = '';
            }
        }
    }

    /**
     * @private
     */
    public applyPassword(): void {
        if (isBlazor()) {
            // tslint:disable-next-line
            let passwordInput: any = document.querySelector('#' + this.pdfViewer.element.id + '_password_input');
            let password: string = (passwordInput as HTMLInputElement).value;
            if (password !== '') {
                this.pdfViewer.load(this.document, password);
            }
        } else {
            let password: string = (this.passwordInput as HTMLInputElement).value;
            if (password !== '') {
                this.pdfViewer.load(this.document, password);
            }
        }
        this.focusViewerContainer();
    }

    private wireEvents(): void {
        this.viewerContainer.addEventListener('scroll', this.viewerContainerOnScroll, true);
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.viewerContainer.addEventListener('touchmove', this.viewerContainerOnScroll, true);
        }
        this.viewerContainer.addEventListener('mousedown', this.viewerContainerOnMousedown);
        this.viewerContainer.addEventListener('mouseup', this.viewerContainerOnMouseup);
        this.viewerContainer.addEventListener('wheel', this.viewerContainerOnMouseWheel);
        this.viewerContainer.addEventListener('mousemove', this.viewerContainerOnMousemove);
        this.viewerContainer.addEventListener('mouseleave', this.viewerContainerOnMouseLeave);
        this.viewerContainer.addEventListener('mouseenter', this.viewerContainerOnMouseEnter);
        this.viewerContainer.addEventListener('mouseover', this.viewerContainerOnMouseOver);
        this.viewerContainer.addEventListener('click', this.viewerContainerOnClick);
        this.viewerContainer.addEventListener('dblclick', this.viewerContainerOnClick);
        this.viewerContainer.addEventListener('dragstart', this.viewerContainerOnDragStart);
        this.pdfViewer.element.addEventListener('keydown', this.viewerContainerOnKeyDown);
        window.addEventListener('mouseup', this.onWindowMouseUp);
        window.addEventListener('touchend', this.onWindowTouchEnd);
        this.unload = () => this.unloadDocument(this);
        window.addEventListener('unload', this.unload);
        window.addEventListener('beforeunload', this.clearSessionStorage);
        window.addEventListener('resize', this.onWindowResize);
        // tslint:disable-next-line:max-line-length
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Trident') !== -1) {
            this.viewerContainer.addEventListener('pointerdown', this.viewerContainerOnPointerDown);
            this.viewerContainer.addEventListener('pointermove', this.viewerContainerOnPointerMove);
            this.viewerContainer.addEventListener('pointerup', this.viewerContainerOnPointerEnd);
            this.viewerContainer.addEventListener('pointerleave', this.viewerContainerOnPointerEnd);
        } else {
            this.viewerContainer.addEventListener('touchstart', this.viewerContainerOnTouchStart);
            this.viewerContainer.addEventListener('touchmove', this.viewerContainerOnTouchMove);
            this.viewerContainer.addEventListener('touchend', this.viewerContainerOnTouchEnd);
            this.viewerContainer.addEventListener('touchleave', this.viewerContainerOnTouchEnd);
            this.viewerContainer.addEventListener('touchcancel', this.viewerContainerOnTouchEnd);
        }
    }

    private unWireEvents(): void {
        this.viewerContainer.removeEventListener('scroll', this.viewerContainerOnScroll, true);
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.viewerContainer.removeEventListener('touchmove', this.viewerContainerOnScroll, true);
        }
        this.viewerContainer.removeEventListener('mousedown', this.viewerContainerOnMousedown);
        this.viewerContainer.removeEventListener('mouseup', this.viewerContainerOnMouseup);
        this.viewerContainer.removeEventListener('wheel', this.viewerContainerOnMouseWheel);
        this.viewerContainer.removeEventListener('mousemove', this.viewerContainerOnMousemove);
        this.viewerContainer.removeEventListener('mouseleave', this.viewerContainerOnMouseLeave);
        this.viewerContainer.removeEventListener('mouseenter', this.viewerContainerOnMouseEnter);
        this.viewerContainer.removeEventListener('mouseover', this.viewerContainerOnMouseOver);
        this.viewerContainer.removeEventListener('click', this.viewerContainerOnClick);
        this.viewerContainer.removeEventListener('dragstart', this.viewerContainerOnDragStart);
        this.viewerContainer.removeEventListener('contextmenu', this.viewerContainerOnContextMenuClick);
        this.pdfViewer.element.removeEventListener('keydown', this.viewerContainerOnKeyDown);
        window.removeEventListener('mouseup', this.onWindowMouseUp);
        window.removeEventListener('unload', this.unload);
        window.removeEventListener('resize', this.onWindowResize);
        // tslint:disable-next-line:max-line-length
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Trident') !== -1) {
            this.viewerContainer.removeEventListener('pointerdown', this.viewerContainerOnPointerDown);
            this.viewerContainer.removeEventListener('pointermove', this.viewerContainerOnPointerMove);
            this.viewerContainer.removeEventListener('pointerup', this.viewerContainerOnPointerEnd);
            this.viewerContainer.removeEventListener('pointerleave', this.viewerContainerOnPointerEnd);
        } else {
            this.viewerContainer.removeEventListener('touchstart', this.viewerContainerOnTouchStart);
            this.viewerContainer.removeEventListener('touchmove', this.viewerContainerOnTouchMove);
            this.viewerContainer.removeEventListener('touchend', this.viewerContainerOnTouchEnd);
            this.viewerContainer.removeEventListener('touchleave', this.viewerContainerOnTouchEnd);
            this.viewerContainer.removeEventListener('touchcancel', this.viewerContainerOnTouchEnd);
        }
    }
    private clearSessionStorage = (): void => {
        let documentId: string = window.sessionStorage.getItem('hashId');
        let documentLiveCount: string = window.sessionStorage.getItem('documentLiveCount');
        if (documentId !== null) {
            // tslint:disable-next-line:max-line-length
            let jsonObject: object = { hashId: documentId, documentLiveCount: documentLiveCount, action: 'Unload', elementId: this.pdfViewer.element.id };
            let actionName: string = window.sessionStorage.getItem('unload');
            if (window.sessionStorage.getItem('serviceURL') && window.sessionStorage.getItem('serviceURL') !== 'undefined') {
                // tslint:disable-next-line
                let browserSupportsKeepalive: any = 'keepalive' in new Request('');
                if (browserSupportsKeepalive) {
                    // tslint:disable-next-line
                    let headerValue: any = this.setUnloadRequestHeaders();
                    let credentialsData: RequestCredentials = this.pdfViewer.ajaxRequestSettings.withCredentials ? 'include' : 'omit';
                    fetch(window.sessionStorage.getItem('serviceURL') + '/' + actionName, {
                        method: 'POST',
                        credentials: credentialsData,
                        headers: headerValue,
                        body: JSON.stringify(jsonObject)
                    });
                }
            } else if (window.sessionStorage.getItem('serviceURL') && isBlazor()) {
                let httpRequest: XMLHttpRequest = new XMLHttpRequest();
                httpRequest.open('POST', window.sessionStorage.getItem('serviceURL') + '/' + actionName, false);
                httpRequest.setRequestHeader('Accept', 'application/json');
                httpRequest.setRequestHeader('Content-type', 'application/json');
                httpRequest.send(JSON.stringify(jsonObject));
            }
        }
        window.sessionStorage.removeItem(this.documentId + '_annotations_textMarkup');
        window.sessionStorage.removeItem(this.documentId + '_annotations_shape');
        window.sessionStorage.removeItem(this.documentId + '_annotations_shape_measure');
        window.sessionStorage.removeItem(this.documentId + '_annotations_stamp');
        window.sessionStorage.removeItem(this.documentId + '_annotations_sticky');
        window.sessionStorage.removeItem(this.documentId + '_annotations_freetext');
        window.sessionStorage.removeItem(this.documentId + '_formfields');
        window.sessionStorage.removeItem(this.documentId + '_annotations_sign');
        window.sessionStorage.getItem(this.documentId + '_pagedata');
        window.sessionStorage.removeItem('hashId');
        window.sessionStorage.removeItem('documentLiveCount');
        window.sessionStorage.removeItem('currentDocument');
        window.sessionStorage.removeItem('serviceURL');
        window.sessionStorage.removeItem('unload');
    }
    /**
     * @private
     */
    public onWindowResize = (event?: MouseEvent): void => {
        let proxy: PdfViewerBase = this;
        if (this.pdfViewer.enableRtl) {
            // tslint:disable-next-line:max-line-length
            proxy.viewerContainer.style.right = (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) + 'px';
            // tslint:disable-next-line:max-line-length
            proxy.viewerContainer.style.left = (proxy.navigationPane.commentPanelContainer ? proxy.navigationPane.commentPanelContainer.offsetWidth : 0) + 'px';
        } else {
            // tslint:disable-next-line:max-line-length
            proxy.viewerContainer.style.left = (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) + 'px';
            // tslint:disable-next-line:max-line-length
            proxy.viewerContainer.style.right = (proxy.navigationPane.commentPanelContainer ? proxy.navigationPane.commentPanelContainer.offsetWidth : 0) + 'px';
        }
        // tslint:disable-next-line
        let viewerElementWidth: any = (proxy.pdfViewer.element.clientWidth > 0 ? proxy.pdfViewer.element.clientWidth : proxy.pdfViewer.element.style.width);
        // tslint:disable-next-line
        let viewerWidth: any = (viewerElementWidth - (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) - (proxy.navigationPane.commentPanelContainer ? proxy.navigationPane.getViewerContainerRight() : 0));
        proxy.viewerContainer.style.width = viewerWidth + 'px';
        if (proxy.pdfViewer.toolbarModule) {
            // tslint:disable-next-line
            let toolbarContainer: any = isBlazor() ? proxy.pdfViewer.element.querySelector('.e-pv-toolbar') : proxy.getElement('_toolbarContainer');
            let toolbarHeight: number = 0;
            if (toolbarContainer) {
                toolbarHeight = toolbarContainer.getBoundingClientRect().height;
            }
            if (proxy.isAnnotationToolbarHidden() || (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
                // tslint:disable-next-line:max-line-length
                proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, toolbarHeight);
            } else {
                // tslint:disable-next-line
                let annotationToolbarContainer: any = isBlazor() ? proxy.pdfViewer.element.querySelector('.e-pv-annotation-toolbar') : proxy.getElement('_annotation_toolbar');
                let annotationToolbarHeight: number = 0;
                if (annotationToolbarContainer) {
                    annotationToolbarHeight = annotationToolbarContainer.getBoundingClientRect().height;
                }
                // tslint:disable-next-line:max-line-length
                proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, toolbarHeight + annotationToolbarHeight);
            }
        } else {
            proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 0);
        }
        if (proxy.pdfViewer.bookmarkViewModule && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
            let bookmarkContainer: HTMLElement = proxy.getElement('_bookmarks_container');
            if (bookmarkContainer) {
                bookmarkContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 0);
            }
        }
        if (proxy.viewerContainer.style.height === '0px') {
            if (proxy.pdfViewer.height.toString() === 'auto') {
                proxy.pdfViewer.height = 500;
                proxy.viewerContainer.style.height = proxy.pdfViewer.height + 'px';
            } else {
                proxy.viewerContainer.style.height = proxy.pdfViewer.element.style.height;
            }
        }
        if (proxy.viewerContainer.style.width === '0px') {
            if (proxy.pdfViewer.width.toString() === 'auto') {
                proxy.pdfViewer.width = 500;
                proxy.viewerContainer.style.width = proxy.pdfViewer.width + 'px';
            } else {
                proxy.viewerContainer.style.width = proxy.pdfViewer.element.style.width;
            }
        }
        proxy.pageContainer.style.width = proxy.viewerContainer.clientWidth + 'px';
        if (proxy.viewerContainer.clientWidth === 0) {
            proxy.pageContainer.style.width = proxy.pdfViewer.element.style.width;
        }
        if (!isBlazor()) {
            if (proxy.pdfViewer.toolbarModule) {
                // tslint:disable-next-line:max-line-length
                proxy.pdfViewer.toolbarModule.onToolbarResize((proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerMainContainerWidth() : proxy.pdfViewer.element.clientWidth));
            }
        }
        if (this.pdfViewer.enableToolbar && this.pdfViewer.thumbnailViewModule) {
            proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.currentPageNumber - 1);
        }
        if (proxy.pdfViewer.textSearchModule && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
            proxy.pdfViewer.textSearchModule.textSearchBoxOnResize();
        }
        if (viewerWidth !== 0) {
            if (!proxy.navigationPane.isBookmarkListOpen) {
                proxy.updateZoomValue();
            }
        }
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            proxy.mobileScrollerContainer.style.left = (viewerWidth - parseFloat(proxy.mobileScrollerContainer.style.width)) + 'px';
            proxy.mobilePageNoContainer.style.left = (viewerWidth / 2) - (parseFloat(proxy.mobilePageNoContainer.style.width) / 2) + 'px';
            proxy.mobilePageNoContainer.style.top = (proxy.pdfViewer.element.clientHeight / 2) + 'px';
            proxy.updateMobileScrollerPosition();
        } else {
            proxy.navigationPane.setResizeIconTop();
            proxy.navigationPane.setCommentPanelResizeIconTop();
            if (event && event.type === 'resize') {
                proxy.signatureModule.updateCanvasSize();
            }
        }
    }
    /**
     * @private
     */
    public updateZoomValue(): void {
        if (this.pdfViewer.magnificationModule) {
            if (this.pdfViewer.magnificationModule.isAutoZoom) {
                this.pdfViewer.magnificationModule.fitToAuto();
            } else if (this.pdfViewer.zoomMode !== 'FitToWidth' && this.pdfViewer.magnificationModule.fitType === 'fitToWidth') {
                this.pdfViewer.magnificationModule.fitToWidth();
            }
        }
        for (let i: number = 0; i < this.pageCount; i++) {
            this.applyLeftPosition(i);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public updateFreeTextProperties(annotation: any): void {
        if (this.pdfViewer.enableShapeLabel) {
            if (this.pdfViewer.shapeLabelSettings.fillColor) {
                annotation.labelFillColor = this.pdfViewer.shapeLabelSettings.fillColor;
            }
            if (this.pdfViewer.shapeLabelSettings.fontColor) {
                annotation.fontColor = this.pdfViewer.shapeLabelSettings.fontColor;
            }
            if (this.pdfViewer.shapeLabelSettings.fontSize) {
                annotation.fontSize = this.pdfViewer.shapeLabelSettings.fontSize;
            }
            if (this.pdfViewer.shapeLabelSettings.fontFamily) {
                annotation.fontFamily = this.pdfViewer.shapeLabelSettings.fontFamily;
            }
            if (this.pdfViewer.shapeLabelSettings.opacity) {
                annotation.labelOpacity = this.pdfViewer.shapeLabelSettings.opacity;
            }
            if (this.pdfViewer.shapeLabelSettings.labelContent) {
                annotation.labelContent = this.pdfViewer.shapeLabelSettings.labelContent;
            }
        }
    }

    private viewerContainerOnMousedown = (event: MouseEvent): void => {
        this.isFreeTextContextMenu = false;
        let isUpdate: Boolean = false;
        this.isSelection = true;
        if (event.button === 0 && !this.getPopupNoteVisibleStatus() && !this.isClickedOnScrollBar(event, false)) {
            this.isViewerMouseDown = true;
            // tslint:disable-next-line
            let target: any = event.target;
            if (event.detail === 1 && target.className !== 'e-pdfviewer-formFields' && target.className !== 'free-text-input') {
                isUpdate = true;
                this.focusViewerContainer(true);
            }
            this.scrollPosition = this.viewerContainer.scrollTop / this.getZoomFactor();
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
            // tslint:disable-next-line
            let isIE: boolean = !!(document as any).documentMode;
            if (this.pdfViewer.textSelectionModule && !this.isClickedOnScrollBar(event, true) && !this.isTextSelectionDisabled) {
                if (!isIE && target.className !== 'e-pdfviewer-formFields' && target.className !== 'e-pdfviewer-ListBox') {
                    event.preventDefault();
                }
                if (target.className !== 'e-pv-droplet') {
                    this.pdfViewer.textSelectionModule.clearTextSelection();
                }
            }
        }
        if (this.isClickedOnScrollBar(event, false)) {
            this.isViewerMouseDown = true;
        }
        if (this.isPanMode) {
            this.dragX = event.pageX;
            this.dragY = event.pageY;
            // tslint:disable-next-line:max-line-length
            if (this.viewerContainer.contains(event.target as HTMLElement) && ((event.target as HTMLElement) !== this.viewerContainer) && ((event.target as HTMLElement) !== this.pageContainer) && this.isPanMode) {
                this.viewerContainer.style.cursor = 'grabbing';
            }
        }
        if (this.isShapeBasedAnnotationsEnabled()) {
            this.diagramMouseDown(event);
        }
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.stickyNotesAnnotationModule.accordionContainer) {
            if (!isUpdate) {
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.isEditableElement = false;
                this.updateCommentPanel();
                isUpdate = true;
            }
        }
        if (isBlazor()) {
            this.mouseDownHandler(event);
        }
    }

// tslint:disable-next-line:max-func-body-length
public mouseDownHandler(event: MouseEvent): void {
    let isEnableDelete: boolean;
    let isCancel: boolean;
    let hidenItems: string[] = Array();
    let disabledItems: string[] = Array();
    if (event && event.target) {
        this.mouseDownEvent  = event;
        this.contextMenuModule.currentTarget = event.target as HTMLElement;
    }
    isEnableDelete = this.pdfViewer.annotationModule.isEnableDelete();
    if (!isEnableDelete) {
        disabledItems.push('DeleteContext');
    }
    if (this.pdfViewer.contextMenuOption === 'None') {
        isCancel = true;
    } else if (this.pdfViewer.textSelectionModule || this.isShapeBasedAnnotationsEnabled()) {
        if (event) {
            let isClickWithinSelectionBounds: boolean = this.isClickWithinSelectionBounds(event);
            // tslint:disable-next-line:max-line-length
            if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus ) {
                this.isFreeTextContextMenu = true;
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewer.annotation.freeTextAnnotationModule && !this.pdfViewer.annotation.freeTextAnnotationModule.isTextSelected) {
                    disabledItems.push('Cut');
                    disabledItems.push('Copy');
                }
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewer.annotation.freeTextAnnotationModule && this.pdfViewer.annotation.freeTextAnnotationModule.selectedText === '') {
                    disabledItems.push('Paste');
                }
                hidenItems.push('HighlightContext');
                hidenItems.push('UnderlineContext');
                hidenItems.push('StrikethroughContext');
                hidenItems.push('ScaleRatio');
                hidenItems.push('Properties');
                hidenItems.push('Comment');
                hidenItems.push('DeleteContext');
            } else  if (isClickWithinSelectionBounds && this.pdfViewer.textSelectionModule ) {
                    // tslint:disable-next-line:max-line-length
                    if ((!(event.target as HTMLElement).classList.contains('e-pv-maintaincontent') && (event.target as HTMLElement).classList.contains('e-pv-text') || (event.target as HTMLElement).classList.contains('e-pv-text-layer'))) {
                        if (this.checkIsNormalText()) {
                            isCancel = true;
                        }
                // tslint:disable-next-line:max-line-length
                    } else if ((Browser.isIE || Browser.info.name === 'edge') && (event.target as HTMLElement).classList.contains('e-pv-page-container')) {
                        isCancel = true;
                    }
                    hidenItems.push('Cut');
                    hidenItems.push('Paste');
                    hidenItems.push('DeleteContext');
                    hidenItems.push('ScaleRatio');
                    hidenItems.push('Comment');
                    hidenItems.push('Properties');
            // tslint:disable-next-line:max-line-length
            } else if (this.pdfViewer.selectedItems.annotations.length !== 0 && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature') {
                this.shapeMenuItems(hidenItems, disabledItems, false, true);
            // tslint:disable-next-line:max-line-length
            } else if (this.pdfViewer.selectedItems.annotations.length !== 0 && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType !== 'Path') {
                this.shapeMenuItems(hidenItems, disabledItems, true);
            } else {
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewer.annotation && this.pdfViewer.annotation.isShapeCopied && ((event.target as HTMLElement).classList.contains('e-pv-text-layer') ||
                        (event.target as HTMLElement).classList.contains('e-pv-text')) && !this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        hidenItems.push('Properties');
                        this.shapeMenuItems(hidenItems, disabledItems, false);
                        // tslint:disable-next-line:max-line-length
                        } else if (this.isCalibrateAnnotationModule() && this.pdfViewer.annotationModule.measureAnnotationModule.currentAnnotationMode) {
                            hidenItems.push('HighlightContext');
                            hidenItems.push('UnderlineContext');
                            hidenItems.push('StrikethroughContext');
                            hidenItems.push('Properties');
                            disabledItems.push('Cut');
                            disabledItems.push('Copy');
                            disabledItems.push('Paste');
                            disabledItems.push('DeleteContext');
                            disabledItems.push('Comment');
                        // tslint:disable-next-line:max-line-length
                        } else if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                            hidenItems.push('HighlightContext');
                            hidenItems.push('UnderlineContext');
                            hidenItems.push('StrikethroughContext');
                            hidenItems.push('Properties');
                            hidenItems.push('Cut');
                            hidenItems.push('Copy');
                            hidenItems.push('Paste');
                            hidenItems.push('ScaleRatio');
                        } else {
                            isCancel = true;
                        }
                    }
                } else if (this.pdfViewer.textSelectionModule && (this.pdfViewer.contextMenuOption === 'MouseUp')) {
            hidenItems.push('Cut');
            hidenItems.push('Paste');
            hidenItems.push('DeleteContext');
            hidenItems.push('ScaleRatio');
            hidenItems.push('Comment');
            hidenItems.push('Properties');
        } else if (this.pdfViewer.selectedItems.annotations.length === 0) {
            hidenItems.push('Cut');
            hidenItems.push('Paste');
            hidenItems.push('DeleteContext');
            hidenItems.push('ScaleRatio');
            hidenItems.push('Properties');
        }
        if (!this.pdfViewer.enableCommentPanel) {
            disabledItems.push('Comment');
        }
     } else {
        isCancel = true;
     }
    let eventArgs: MouseDownEventArgs = { hidenItems: hidenItems, disabledItems: disabledItems, isCancel : isCancel };
    this.pdfViewer._dotnetInstance.invokeMethodAsync('MouseDownHandler', eventArgs);
}

    public OnItemSelected(selectedMenu: string ): void {
        // tslint:disable-next-line
        let target: any = this.contextMenuModule.currentTarget;
        switch (selectedMenu) {
            case this.pdfViewer.localeObj.getConstant('Copy'):
                let isSkip: boolean = false;
                // tslint:disable-next-line:max-line-length
                if (this.isFreeTextContextMenu || (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus)) {
                    this.pdfViewer.annotation.freeTextAnnotationModule.copySelectedText();
                    this.contextMenuModule.close();
                    isSkip = true;
                } else if (this.pdfViewer.textSelectionModule) {
                    this.pdfViewer.textSelectionModule.copyText();
                    this.contextMenuModule.close();
                }
                if (this.pdfViewer.selectedItems.annotations.length && !isSkip) {
                    this.pdfViewer.copy();
                    this.contextMenuModule.previousAction = 'Copy';
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Highlight context'):
                if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = false;
                    this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations('Highlight');
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                    this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAddMode = '';
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = true;
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Underline context'):
                if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = false;
                    this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations('Underline');
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                    this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAddMode = '';
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = true;
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Strikethrough context'):
                if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = false;
                    this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations('Strikethrough');
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                    this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAddMode = '';
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = true;
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Properties'):
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'LineWidthArrowHead' ||
                    this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
                    this.pdfViewer.annotation.createPropertiesWindow();
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Cut'):
                // tslint:disable-next-line:max-line-length
                if (this.isFreeTextContextMenu || this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus && (target && target.className === 'free-text-input' && target.tagName === 'TEXTAREA')) {
                    this.pdfViewer.annotation.freeTextAnnotationModule.cutSelectedText(target);
                    this.contextMenuModule.close();
                } else if (this.pdfViewer.selectedItems.annotations.length === 1) {
                    let pageIndex: number = this.pdfViewer.selectedItems.annotations[0].pageIndex;
                    this.pdfViewer.cut();
                    this.pdfViewer.clearSelection(pageIndex);
                    this.contextMenuModule.previousAction = 'Cut';
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Paste'):
                // tslint:disable-next-line:max-line-length
                if (this.isFreeTextContextMenu || this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus && (target && target.className === 'free-text-input' && target.tagName === 'TEXTAREA')) {
                    this.pdfViewer.annotation.freeTextAnnotationModule.pasteSelectedText(target);
                    this.contextMenuModule.close();
                } else {
                    this.pdfViewer.paste();
                    this.contextMenuModule.previousAction = 'Paste';
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Delete Context'):
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.deleteAnnotation();
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Scale Ratio'):
                if (this.isCalibrateAnnotationModule()) {
                    this.pdfViewer.annotation.measureAnnotationModule.createScaleRatioWindow();
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Comment'):
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.showCommentsPanel();
                    if (this.pdfViewer.selectedItems.annotations.length !== 0 ||
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        // tslint:disable-next-line
                        let currentAnnotation: any;
                        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                            currentAnnotation = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
                        } else {
                            currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
                        }
                        // tslint:disable-next-line
                        let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                        if (accordionExpand) {
                            accordionExpand.ej2_instances[0].expandItem(true);
                        }
                        // tslint:disable-next-line
                        let commentsDiv: any = document.getElementById(currentAnnotation.annotName);
                        if (commentsDiv) {
                            if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                                commentsDiv.firstChild.click();
                            }
                        }
                    }
                }
                break;
            default:
                break;
        }
    }

    private shapeMenuItems( hidenItems: string[], disabledItems: string[], enableProperties: boolean, isSignature?: boolean ): void {
        if (this.pdfViewer.annotation && !this.pdfViewer.annotation.isShapeCopied) {
          disabledItems.push('Paste');
        }
        hidenItems.push('HighlightContext');
        hidenItems.push('UnderlineContext');
        hidenItems.push('StrikethroughContext');
        hidenItems.push('ScaleRatio');
        if (enableProperties) {
            // tslint:disable-next-line:max-line-length
            if (!(this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'LineWidthArrowHead' ||
                this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance')) {
                    hidenItems.push('Properties');
                }
        } else if (isSignature) {
            hidenItems.push('Properties');
            hidenItems.push('Comment');
        } else {
            hidenItems.push('Cut');
            hidenItems.push('Copy');
            hidenItems.push('DeleteContext');
            hidenItems.push('Comment');
        }
    }

    private checkIsRtlText(text: string): boolean {
        // tslint:disable-next-line:max-line-length
        let ltrChars: string = 'A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02B8\\u0300-\\u0590\\u0800-\\u1FFF' + '\\u2C00-\\uFB1C\\uFDFE-\\uFE6F\\uFEFD-\\uFFFF';
        let rtlChars: string = '\\u0591-\\u07FF\\uFB1D-\\uFDFD\\uFE70-\\uFEFC';
        // tslint:disable-next-line
        let rtlDirCheck: any = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']');
        return rtlDirCheck.test(text);
    }

     // tslint:disable-next-line
     public isClickWithinSelectionBounds(event: any): boolean {
        let isWithin: boolean = false;
        if (this.pdfViewer.textSelectionModule) {
            let bounds: ClientRect = this.pdfViewer.textSelectionModule.getCurrentSelectionBounds(this.currentPageNumber - 1);
            if (bounds) {
                let currentBound: ClientRect = bounds;
                if (this.getHorizontalValue(currentBound.left) < event.clientX && this.getHorizontalValue(currentBound.right) >
                    event.clientX && this.getVerticalValue(currentBound.top) < event.clientY &&
                    this.getVerticalValue(currentBound.bottom) > event.clientY) {
                    isWithin = true;
                }
            }
            if ((Browser.isIE || Browser.info.name === 'edge') && bounds) {
                isWithin = true;
            }
        }
        return isWithin;
    }

    private getHorizontalClientValue(value: number): number {
        let pageDiv: HTMLElement = this.getElement('_pageDiv_' + (this.currentPageNumber - 1));
        let pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value - pageBounds.left);
    }

    private getVerticalClientValue(value: number): number {
        let pageDiv: HTMLElement = this.getElement('_pageDiv_' + (this.currentPageNumber - 1));
        let pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value - pageBounds.top);
    }

    private getHorizontalValue(value: number): number {
        let pageDiv: HTMLElement = this.getElement('_pageDiv_' + (this.currentPageNumber - 1));
        let pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value * this.getZoomFactor()) + pageBounds.left;
    }

    private getVerticalValue(value: number): number {
        let pageDiv: HTMLElement = this.getElement('_pageDiv_' + (this.currentPageNumber - 1));
        let pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value * this.getZoomFactor()) + pageBounds.top;
    }

    /**
     * @private
     */
    public checkIsNormalText(): boolean {
        let isText: boolean = true;
        let currentText: string = '';
        // tslint:disable-next-line
        let textSelectionModule: any = this.pdfViewer.textSelectionModule;
        if (textSelectionModule && textSelectionModule.selectionRangeArray && textSelectionModule.selectionRangeArray.length === 1) {
            currentText = textSelectionModule.selectionRangeArray[0].textContent;
        } else if (window.getSelection() && window.getSelection().anchorNode) {
            currentText = window.getSelection().toString();
        }
        if (currentText !== '' && this.checkIsRtlText(currentText)) {
            isText = false;
        }
        return isText;
    }
    private viewerContainerOnMouseup = (event: MouseEvent): void => {
        if (!this.getPopupNoteVisibleStatus()) {
            if (this.isViewerMouseDown) {
                if (this.scrollHoldTimer) {
                    clearTimeout(this.scrollHoldTimer);
                    this.scrollHoldTimer = null;
                }
                if ((this.scrollPosition * this.getZoomFactor()) !== this.viewerContainer.scrollTop) {
                    this.pageViewScrollChanged(this.currentPageNumber);
                }
            }
            if (this.isShapeBasedAnnotationsEnabled()) {
                this.diagramMouseUp(event);
                this.pdfViewer.annotation.onAnnotationMouseUp();
            }
            this.isSelection = false;
            // tslint:disable-next-line:max-line-length
            let commentElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
            if (commentElement && commentElement.style.display === 'block') {
                if (this.pdfViewer.selectedItems) {
                    if (this.pdfViewer.selectedItems.annotations.length !== 0) {
                        // tslint:disable-next-line
                        let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                        if (accordionExpand) {
                            accordionExpand.ej2_instances[0].expandItem(true);
                        }
                        // tslint:disable-next-line
                        let commentsDiv: any = document.getElementById(this.pdfViewer.selectedItems.annotations[0].annotName);
                        if (commentsDiv) {
                            if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                                commentsDiv.firstChild.click();
                            }
                        }
                    }
                }
            }
            if (event.button === 0 && !this.isClickedOnScrollBar(event, false)) {
                // 0 is for left button.
                let eventTarget: HTMLElement = event.target as HTMLElement;
                let offsetX: number = event.clientX;
                let offsetY: number = event.clientY;
                let zoomFactor: number = this.getZoomFactor();
                let pageIndex: number = this.currentPageNumber;
                if (eventTarget) {
                    // tslint:disable-next-line
                    let pageString: any = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1] || eventTarget.id.split('_pageDiv_')[1];
                    // tslint:disable-next-line
                    pageIndex = parseInt(pageString);
                }
                let pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
                if (pageDiv) {
                    let pageCurrentRect: ClientRect = pageDiv.getBoundingClientRect();
                    offsetX = (event.clientX - pageCurrentRect.left) / zoomFactor;
                    offsetY = (event.clientY - pageCurrentRect.top) / zoomFactor;
                }
                // tslint:disable-next-line:max-line-length
                if (eventTarget && eventTarget.classList && !eventTarget.classList.contains('e-pv-hyperlink') && !eventTarget.classList.contains('e-pv-page-container')) {
                    // tslint:disable-next-line
                    this.pdfViewer.firePageClick(offsetX, offsetY, pageIndex + 1);
                }
                if (this.isTextMarkupAnnotationModule() && !this.isToolbarInkClicked) {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationMouseUp(event);
                }
                // tslint:disable-next-line:max-line-length
                if (this.viewerContainer.contains(event.target as HTMLElement) && ((event.target as HTMLElement) !== this.viewerContainer) && ((event.target as HTMLElement) !== this.pageContainer) && this.isPanMode) {
                    this.viewerContainer.style.cursor = 'move';
                    this.viewerContainer.style.cursor = '-webkit-grab';
                    this.viewerContainer.style.cursor = '-moz-grab';
                    this.viewerContainer.style.cursor = 'grab';
                }
            }
            this.isViewerMouseDown = false;
        }
    }

    private viewerContainerOnMouseWheel = (event: WheelEvent): void => {
        this.isViewerMouseWheel = true;
        if (this.getRerenderCanvasCreated()) {
            event.preventDefault();
        }
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.pageRerenderOnMouseWheel();
            if (event.ctrlKey) {
                event.preventDefault();
            }
            this.pdfViewer.magnificationModule.fitPageScrollMouseWheel(event);
        }
        if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
            if (this.isViewerMouseDown) {
                if (!(event.target as HTMLElement).classList.contains('e-pv-text')) {
                    this.pdfViewer.textSelectionModule.textSelectionOnMouseWheel(this.currentPageNumber - 1);
                }
            }
        }
    }

    private viewerContainerOnKeyDown = (event: KeyboardEvent): void => {
        let isMac: boolean = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
        let isCommandKey: boolean = isMac ? event.metaKey : false;
        if ((this.isFreeTextAnnotationModule() && this.pdfViewer.annotationModule
            && (this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus === true
                || this.pdfViewer.annotationModule.inputElementModule.isInFocus === true))) {
            return;
        }
        if (event.ctrlKey || isCommandKey) {
            // add keycodes if shift key is used.
            if ((event.shiftKey && !isMac) || (isMac && !event.shiftKey)) {
                switch (event.keyCode) {
                    case 38: // up arrow
                    case 33: // page up
                        event.preventDefault();
                        if (this.currentPageNumber !== 1) {
                            this.updateScrollTop(0);
                        }
                        break;
                    case 40: // down arrow
                    case 34: // page down
                        event.preventDefault();
                        if (this.currentPageNumber !== this.pageCount) {
                            this.updateScrollTop(this.pageCount - 1);
                        }
                        break;
                    default:
                        break;
                }
            }
            switch (event.keyCode) {
                case 79: // o key
                    if (this.pdfViewer.toolbarModule && this.pdfViewer.enableToolbar) {
                        this.pdfViewer.toolbarModule.openFileDialogBox(event);
                    }
                    break;
                case 67: // c key
                    if (this.pdfViewer.textSelectionModule && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled) {
                        event.preventDefault();
                        this.pdfViewer.textSelectionModule.copyText();
                    }
                    if (this.pdfViewer.selectedItems.annotations.length) {
                        this.pdfViewer.copy();
                    }
                    break;
                case 70: // f key
                    if (this.pdfViewer.textSearchModule && this.pdfViewer.enableTextSearch) {
                        event.preventDefault();
                        this.pdfViewer.toolbarModule.textSearchButtonHandler();
                    }
                    break;
                case 80: // p key
                    if (this.pdfViewer.printModule && this.pdfViewer.enablePrint) {
                        event.preventDefault();
                        this.pdfViewer.print.print();
                    }
                    break;
                case 90: //z key
                    if (this.pdfViewer.annotationModule) {
                        this.pdfViewer.annotationModule.undo();
                    }
                    break;
                case 88: //x key
                    if (this.pdfViewer.selectedItems.annotations.length) {
                        this.pdfViewer.cut();
                        this.pdfViewer.clearSelection(this.pdfViewer.selectedItems.annotations[0].pageIndex);
                    }
                    break;
                case 89: //y key
                    if (this.pdfViewer.annotationModule) {
                        this.pdfViewer.annotationModule.redo();
                    }
                    break;
                case 86: //v key
                    if (this.pdfViewer.annotation && this.pdfViewer.annotation.isShapeCopied) {
                        this.pdfViewer.paste();
                    }
                    break;
                default:
                    break;
            }
        } else {
            switch (event.keyCode) {
                case 46:
                    if (this.pdfViewer.annotation) {
                        if (this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
                            this.pdfViewer.annotationModule.deleteAnnotation();
                        }
                        if (this.pdfViewer.selectedItems.annotations.length > 0) {
                            // tslint:disable-next-line
                            let annotation: any = this.pdfViewer.selectedItems.annotations[0];
                            if (annotation.annotationSettings && annotation.annotationSettings.isLock) {
                                if (this.pdfViewer.annotationModule.checkAllowedInteractions('Delete', annotation)) {
                                    this.pdfViewer.remove(annotation);
                                    this.pdfViewer.renderSelector(this.pdfViewer.annotation.getEventPageNumber(event));
                                }
                            } else {
                                this.pdfViewer.remove(annotation);
                                this.pdfViewer.renderSelector(this.pdfViewer.annotation.getEventPageNumber(event));
                            }
                        }
                    }
                    break;
                case 27:
                    if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
                        // tslint:disable-next-line
                        let currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
                        this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
                    }
                    if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                        this.pdfViewer.toolbar.annotationToolbarModule.deselectInkAnnotation();
                    }
            }
        }
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.magnifyBehaviorKeyDown(event);
        }
    }

    private viewerContainerOnMousemove = (event: MouseEvent): void => {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        // tslint:disable-next-line
        let isIE: boolean = !!(document as any).documentMode;
        let target: HTMLElement = event.target as HTMLElement;
        if (this.action === 'Drag') {
            event.preventDefault();
        }
        // tslint:disable-next-line:max-line-length
        if (this.isViewerMouseDown && !(this.action === 'Perimeter' || this.action === 'Polygon' || this.action === 'Line' || this.action === 'DrawTool' || this.action === 'Distance')) {
            // tslint:disable-next-line:max-line-length
            if (this.pdfViewer.textSelectionModule && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled && !this.getPopupNoteVisibleStatus()) {
                // text selection won't perform if we start the selection from hyperlink content by commenting this line.
                // this region block the toc/hyperlink navigation on sometimes.
                // if ((event.target as HTMLElement).classList.contains('e-pv-hyperlink') && this.pdfViewer.linkAnnotationModule) {
                // this.pdfViewer.linkAnnotationModule.modifyZindexForHyperlink((event.target as HTMLElement), true);
                // }
                if (!isIE) {
                    event.preventDefault();
                    this.mouseX = event.clientX;
                    this.mouseY = event.clientY;
                    // tslint:disable-next-line
                    let annotationModule: any = this.pdfViewer.annotationModule;
                    // tslint:disable-next-line:max-line-length
                    if (annotationModule && annotationModule.textMarkupAnnotationModule && annotationModule.textMarkupAnnotationModule.isDropletClicked && annotationModule.textMarkupAnnotationModule.isEnableTextMarkupResizer(annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode)) {
                        annotationModule.textMarkupAnnotationModule.textSelect(event.target, this.mouseX, this.mouseY);
                    } else {
                        this.pdfViewer.textSelectionModule.textSelectionOnMouseMove(event.target, this.mouseX, this.mouseY);
                    }
                } else {
                    let selection: Selection = window.getSelection();
                    if (!selection.type && !selection.isCollapsed && selection.anchorNode !== null) {
                        this.pdfViewer.textSelectionModule.isTextSelection = true;
                    }
                }
            } else if (this.skipPreventDefault(target)) {
                event.preventDefault();
            }
        }
        if (this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationMouseMove(event);
        }
        if (this.isPanMode) {
            this.panOnMouseMove(event);
        }

        if (this.isShapeBasedAnnotationsEnabled()) {
            let canvas: Rect;
            // tslint:disable-next-line:max-line-length
            if (event.target && ((event.target as PdfAnnotationBaseModel).id.indexOf('_text') > -1 || (event.target as PdfAnnotationBaseModel).id.indexOf('_annotationCanvas') > -1 || (event.target as HTMLElement).classList.contains('e-pv-hyperlink')) && this.pdfViewer.annotation) {
                let pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(event);
                let diagram: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
                if (diagram) {
                    let canvas1: Rect = diagram.getBoundingClientRect() as Rect;
                    let left: number = canvas1.x ? canvas1.x : canvas1.left;
                    let top: number = canvas1.y ? canvas1.y : canvas1.top;
                    canvas = new Rect(left + 10, top + 10, canvas1.width - 10, canvas1.height - 10);
                }
            }
            let stampModule: StampAnnotation = this.pdfViewer.annotationModule.stampAnnotationModule;
            if (canvas && canvas.containsPoint({ x: this.mouseX, y: this.mouseY }) && !stampModule.isStampAnnotSelected) {
                this.diagramMouseMove(event);
                this.annotationEvent = event;
            } else {
                this.diagramMouseLeave(event);
                if (this.isAnnotationDrawn && this.action !== 'Ink') {
                    this.diagramMouseUp(event);
                    this.isAnnotationAdded = true;
                }
            }
            if (this.pdfViewer.enableStampAnnotations) {
                if (stampModule && stampModule.isStampAnnotSelected) {
                    this.pdfViewer.tool = 'Stamp';
                    this.tool = new StampTool(this.pdfViewer, this);
                    this.isMouseDown = true;
                    stampModule.isStampAnnotSelected = false;
                    stampModule.isNewStampAnnot = true;
                }
            }
            if (this.isSignatureAdded && this.pdfViewer.enableHandwrittenSignature) {
                this.pdfViewer.tool = 'Stamp';
                this.tool = new StampTool(this.pdfViewer, this);
                this.isMouseDown = true;
                this.isSignatureAdded = false;
                this.isNewSignatureAdded = true;
            }
        }

    }

    private panOnMouseMove = (event: MouseEvent): void => {
        let isStampMode: boolean = false;
        // tslint:disable-next-line:max-line-length
        if (this.action === 'Drag' || this.action.indexOf('Rotate') !== -1 || this.action.indexOf('Resize') !== -1) {
            isStampMode = true;
        }
        // tslint:disable-next-line:max-line-length
        if (this.viewerContainer.contains(event.target as HTMLElement) && ((event.target as HTMLElement) !== this.viewerContainer) && ((event.target as HTMLElement) !== this.pageContainer) && !isStampMode) {
            if (this.isViewerMouseDown) {
                let deltaX: number = this.dragX - event.pageX;
                let deltaY: number = this.dragY - event.pageY;
                this.viewerContainer.scrollTop = this.viewerContainer.scrollTop + deltaY;
                this.viewerContainer.scrollLeft = this.viewerContainer.scrollLeft + deltaX;
                this.viewerContainer.style.cursor = 'move';
                this.viewerContainer.style.cursor = '-webkit-grabbing';
                this.viewerContainer.style.cursor = '-moz-grabbing';
                this.viewerContainer.style.cursor = 'grabbing';
                this.dragX = event.pageX;
                this.dragY = event.pageY;
            } else {
                if (!this.navigationPane.isNavigationPaneResized) {
                    this.viewerContainer.style.cursor = 'move';
                    this.viewerContainer.style.cursor = '-webkit-grab';
                    this.viewerContainer.style.cursor = '-moz-grab';
                    this.viewerContainer.style.cursor = 'grab';
                }
            }
        } else {
            if (!this.navigationPane.isNavigationPaneResized) {
                this.viewerContainer.style.cursor = 'auto';
            }
        }
    }

    /**
     * @private
     */
    public initiatePanning(): void {
        this.isPanMode = true;
        this.textLayer.modifyTextCursor(false);
        this.disableTextSelectionMode();
        if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule && !isBlazor()) {
            this.pdfViewer.toolbar.annotationToolbarModule.deselectAllItems();
        }
    }

    /**
     * @private
     */
    public initiateTextSelectMode(): void {
        this.isPanMode = false;
        if (this.viewerContainer) {
            this.viewerContainer.style.cursor = 'auto';
            if (this.pdfViewer.textSelectionModule) {
                this.textLayer.modifyTextCursor(true);
                this.pdfViewer.textSelectionModule.enableTextSelectionMode();
            }
            if ((!Browser.isDevice || this.pdfViewer.enableDesktopMode) && !isBlazor()) {
                this.enableAnnotationAddTools(true);
            }
        }
    }

    private enableAnnotationAddTools(isEnable: boolean): void {
        if (this.pdfViewer.toolbarModule) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableAnnotationAddTools(isEnable);
            }
        }
    }

    private viewerContainerOnMouseLeave = (event: MouseEvent): void => {
        if (this.isViewerMouseDown) {
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                this.pdfViewer.textSelectionModule.textSelectionOnMouseLeave(event);
            }
        }
    }

    private viewerContainerOnMouseEnter = (event: MouseEvent): void => {
        if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
            this.pdfViewer.textSelectionModule.clear();
        }
    }

    private viewerContainerOnMouseOver = (event: MouseEvent): void => {
        // tslint:disable-next-line
        let isIE: boolean = !!(document as any).documentMode;
        if (this.isViewerMouseDown) {
            if (!isIE) {
                event.preventDefault();
            }
        }
    }

    private viewerContainerOnClick = (event: MouseEvent): void => {
        if (event.type === 'dblclick') {
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled && !this.getCurrentTextMarkupAnnotation()) {
                if ((event.target as HTMLElement).classList.contains('e-pv-text')) {
                    this.isViewerContainerDoubleClick = true;
                    if (!this.getTextMarkupAnnotationMode()) {
                        let pageNumber: number = parseFloat((event.target as HTMLElement).id.split('_')[2]);
                        this.pdfViewer.fireTextSelectionStart(pageNumber + 1);
                    }
                    this.pdfViewer.textSelectionModule.selectAWord(event.target, event.clientX, event.clientY, false);
                    if (this.pdfViewer.contextMenuSettings.contextMenuAction === 'MouseUp') {
                        this.pdfViewer.textSelectionModule.calculateContextMenuPosition(event.clientY, event.clientX);
                    }
                    if (!this.getTextMarkupAnnotationMode()) {
                        this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(true, false);
                        this.dblClickTimer = setTimeout(
                            () => { this.applySelection(); }, 100);
                        this.pdfViewer.textSelectionModule.fireTextSelectEnd();
                    } else if (this.isTextMarkupAnnotationModule() && this.getTextMarkupAnnotationMode()) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
                    }
                }
            } else if (this.getCurrentTextMarkupAnnotation()) {
                // this.pdfViewer.annotationModule.showAnnotationPopup(event);
            }
            if (this.action && (this.action === 'Perimeter' || this.action === 'Polygon') && this.tool) {
                this.eventArgs.position = this.currentPosition;
                this.getMouseEventArgs(this.currentPosition, this.eventArgs, event, this.eventArgs.source);
                let ctrlKey: boolean = this.isMetaKey(event);
                let info: Info = { ctrlKey: event.ctrlKey, shiftKey: event.shiftKey };
                this.eventArgs.info = info;
                this.eventArgs.clickCount = event.detail;
                (this.tool as PolygonDrawingTool).mouseUp(this.eventArgs, true);

            }
            if (this.pdfViewer.selectedItems ||
                (this.pdfViewer.annotation && this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation)) {
                if (this.pdfViewer.selectedItems.annotations.length !== 0) {
                    // tslint:disable-next-line
                    let currentAnnotation: any = this.pdfViewer.selectedItems.annotations[0];
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.annotationSelect(currentAnnotation.annotName, currentAnnotation.pageIndex, currentAnnotation, null, true);
                    if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus === false) {
                        if (this.isFreeTextAnnotation(this.pdfViewer.selectedItems.annotations) === true) {
                            let elmtPosition: PointModel = {};
                            elmtPosition.x = this.pdfViewer.selectedItems.annotations[0].bounds.x;
                            elmtPosition.y = this.pdfViewer.selectedItems.annotations[0].bounds.y;
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotation.freeTextAnnotationModule.addInuptElemet(elmtPosition, this.pdfViewer.selectedItems.annotations[0]);
                        } else if (this.pdfViewer.selectedItems.annotations[0].enableShapeLabel === true) {
                            let elmtPosition: PointModel = {};
                            elmtPosition.x = this.pdfViewer.selectedItems.annotations[0].bounds.x;
                            elmtPosition.y = this.pdfViewer.selectedItems.annotations[0].bounds.y;
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotation.inputElementModule.editLabel(elmtPosition, this.pdfViewer.selectedItems.annotations[0]);
                        } else {
                            // tslint:disable-next-line
                            let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                            if (accordionExpand) {
                                accordionExpand.ej2_instances[0].expandItem(true);
                            }
                            // tslint:disable-next-line
                            let commentsDiv: any = document.getElementById(this.pdfViewer.selectedItems.annotations[0].annotName);
                            if (commentsDiv) {
                                if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                                    commentsDiv.firstChild.click();
                                }
                            }
                        }
                    }
                } else {
                    // tslint:disable-next-line:max-line-length
                    if (this.pdfViewer.annotation && this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        // tslint:disable-next-line
                        let annotation: any = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotationModule.annotationSelect(annotation.annotName, this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage, annotation, null, true);
                        // tslint:disable-next-line
                        let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.currentPageNumber);
                        if (accordionExpand) {
                            accordionExpand.ej2_instances[0].expandItem(true);
                        }
                        // tslint:disable-next-line
                        let comments: any = document.getElementById(annotation.annotName);
                        if (comments) {
                            comments.firstChild.click();
                        }
                    }
                }
            }
        } else {
            if (event.detail === 3) {
                if (this.isViewerContainerDoubleClick) {
                    clearTimeout(this.dblClickTimer);
                    this.isViewerContainerDoubleClick = false;
                }
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled && !this.getTextMarkupAnnotationMode()) {
                    this.pdfViewer.textSelectionModule.selectEntireLine(event);
                    this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(true, false);
                    this.pdfViewer.textSelectionModule.fireTextSelectEnd();
                    this.applySelection();
                }
            }
        }
    }

    private applySelection(): void {
        if (window.getSelection().anchorNode !== null) {
            this.pdfViewer.textSelectionModule.applySpanForSelection();
        }
        this.isViewerContainerDoubleClick = false;
    }

    private viewerContainerOnDragStart = (event: DragEvent): void => {
        // tslint:disable-next-line
        let isIE: boolean = !!(document as any).documentMode;
        if (!isIE) {
            event.preventDefault();
        }
    }

    // tslint:disable-next-line
    private viewerContainerOnContextMenuClick = (event: any): void => {
        this.isViewerMouseDown = false;
    }

    // tslint:disable-next-line
    private onWindowMouseUp = (event: MouseEvent): any => {
        this.isFreeTextContextMenu = false;
        this.isNewStamp = false;
        this.signatureAdded = false;
        // tslint:disable-next-line
        let annotationModule:any= this.pdfViewer.annotationModule;
        // tslint:disable-next-line:max-line-length
        if (annotationModule && annotationModule.textMarkupAnnotationModule && annotationModule.textMarkupAnnotationModule.isEnableTextMarkupResizer(annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode)) {
            // tslint:disable-next-line
            let modules: any = annotationModule.textMarkupAnnotationModule;
            modules.isLeftDropletClicked = false;
            modules.isDropletClicked = false;
            modules.isRightDropletClicked = false;
            if (!modules.currentTextMarkupAnnotation && window.getSelection().anchorNode === null) {
                modules.showHideDropletDiv(true);
            } else if (!modules.currentTextMarkupAnnotation && modules.currentTextMarkupAddMode === '') {
                modules.isTextMarkupAnnotationMode = false;
            }
        }
        if (!this.getPopupNoteVisibleStatus()) {
            if (event.button === 0) {
                // tslint:disable-next-line:max-line-length
                if (this.isNewFreeTextAnnotation()) {
                    if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled && !this.getTextMarkupAnnotationMode()) {
                        // tslint:disable-next-line:max-line-length
                        if (event.detail === 1 && !this.viewerContainer.contains(event.target as HTMLElement) && !this.contextMenuModule.contextMenuElement.contains(event.target as HTMLElement)) {
                            if (window.getSelection().anchorNode !== null) {
                                this.pdfViewer.textSelectionModule.textSelectionOnMouseup(event);
                            }
                        }
                        // tslint:disable-next-line
                        let target: any = event.target;
                        if (this.viewerContainer.contains(event.target as HTMLElement) && target.className !== 'e-pdfviewer-formFields') {
                            if (!this.isClickedOnScrollBar(event, true) && !this.isScrollbarMouseDown) {
                                this.pdfViewer.textSelectionModule.textSelectionOnMouseup(event);
                            } else {
                                if (window.getSelection().anchorNode !== null) {
                                    this.pdfViewer.textSelectionModule.applySpanForSelection();
                                }
                            }
                        }
                    } else if (this.getTextMarkupAnnotationMode()) {
                        // tslint:disable-next-line
                        let viewerElement: any = this.pdfViewer.element;
                        // tslint:disable-next-line
                        let targetElement: any = event.target;
                        if (viewerElement && targetElement) {
                            if (viewerElement.id.split('_')[0] === targetElement.id.split('_')[0]) {
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
                            }
                        }
                    }
                }
            } else if (event.button === 2) {
                if (this.viewerContainer.contains(event.target as HTMLElement) && this.skipPreventDefault(event.target as HTMLElement)) {
                    if (this.checkIsNormalText()) {
                        window.getSelection().removeAllRanges();
                    }
                }
            }
            if (this.isViewerMouseDown) {
                this.isViewerMouseDown = false;
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                    this.pdfViewer.textSelectionModule.clear();
                    this.pdfViewer.textSelectionModule.selectionStartPage = null;
                }
                event.preventDefault();
                event.stopPropagation();
                return false;
            } else {
                return true;
            }
        }
    }

    private onWindowTouchEnd = (event: TouchEvent): void => {
        this.signatureAdded = false;
        // tslint:disable-next-line:max-line-length
        if (!this.pdfViewer.element.contains(event.target as HTMLElement) && !this.contextMenuModule.contextMenuElement.contains(event.target as HTMLElement)) {
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                this.pdfViewer.textSelectionModule.clearTextSelection();
            }
        }
    }

    private viewerContainerOnTouchStart = (event: TouchEvent): void => {
        let touchPoints: TouchList = event.touches;
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.setTouchPoints(touchPoints[0].clientX, touchPoints[0].clientY);
        }
        let target: HTMLElement = event.target as HTMLElement;
        // tslint:disable-next-line:max-line-length
        if (touchPoints.length === 1 && !(target.classList.contains('e-pv-hyperlink')) && this.skipPreventDefault(target)) {
            this.preventTouchEvent(event);
        }
        if (event.touches.length === 1 && this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
            if (!this.isToolbarInkClicked) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationTouchEnd(event);
            }
        }
        this.touchClientX = touchPoints[0].clientX;
        this.touchClientY = touchPoints[0].clientY;
        this.scrollY = touchPoints[0].clientY;
        this.previousTime = new Date().getTime();
        // tslint:disable-next-line:max-line-length
        if (touchPoints.length === 1 && !((event.target as HTMLElement).classList.contains('e-pv-touch-select-drop') || (event.target as HTMLElement).classList.contains('e-pv-touch-ellipse'))) {
            if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.pageCount > 0 && !this.isThumb && !((event.target as HTMLElement).classList.contains('e-pv-hyperlink'))) {
                this.handleTaps(touchPoints);
            } else if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                this.handleTextBoxTaps(touchPoints);
            }
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                this.pdfViewer.textSelectionModule.clearTextSelection();
                this.contextMenuModule.close();
                // event.preventDefault();
                if (!this.isLongTouchPropagated) {
                    this.longTouchTimer = setTimeout(
                        () => { this.viewerContainerOnLongTouch(event); }, 1000);
                }
                this.isLongTouchPropagated = true;
            }
        }
        this.diagramMouseDown(event);
        // tslint:disable-next-line:max-line-length
        if (this.action === 'Drag' || this.action.indexOf('Rotate') !== -1 || this.action.indexOf('Resize') !== -1) {
            event.preventDefault();
        }
    }

    private handleTaps(touchPoints: TouchList): void {
        if (!this.singleTapTimer) {
            this.singleTapTimer = setTimeout(
                () => {
                    this.onSingleTap(touchPoints);
                // tslint:disable-next-line
                } , 300);
            this.tapCount++;
        } else {
            if (this.pdfViewer.enablePinchZoom) {
                this.tapCount++;
                clearTimeout(this.singleTapTimer);
                this.singleTapTimer = null;
                this.onDoubleTap(touchPoints);
            }
        }
    }
    private handleTextBoxTaps(touchPoints: TouchList): void {
        setTimeout(
            () => { this.inputTapCount = 0; }, 300);
        this.inputTapCount++;
        // tslint:disable-next-line
        let timer: any = setTimeout(
            () => { this.onTextBoxDoubleTap(touchPoints); }, 200);
        if (this.inputTapCount > 2) {
            this.inputTapCount = 0;
        }
    }
    private onTextBoxDoubleTap(touches: TouchList): void {
        let target: HTMLElement = touches[0].target as HTMLElement;
        if (this.inputTapCount === 2) {
            if (this.pdfViewer.selectedItems.annotations.length !== 0) {
                if (this.isFreeTextAnnotation(this.pdfViewer.selectedItems.annotations) === true) {
                    let elmtPosition: PointModel = {};
                    elmtPosition.x = this.pdfViewer.selectedItems.annotations[0].bounds.x;
                    elmtPosition.y = this.pdfViewer.selectedItems.annotations[0].bounds.y;
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.freeTextAnnotationModule.addInuptElemet(elmtPosition, this.pdfViewer.selectedItems.annotations[0]);
                } else if (this.pdfViewer.selectedItems.annotations[0].enableShapeLabel === true) {
                    let elmtPosition: PointModel = {};
                    elmtPosition.x = this.pdfViewer.selectedItems.annotations[0].bounds.x;
                    elmtPosition.y = this.pdfViewer.selectedItems.annotations[0].bounds.y;
                    this.pdfViewer.annotation.inputElementModule.editLabel(elmtPosition, this.pdfViewer.selectedItems.annotations[0]);
                }
            }
        }
    }
    private onSingleTap(touches: TouchList): void {
        let target: HTMLElement = touches[0].target as HTMLElement;
        let isFormfields: boolean = false;
        this.singleTapTimer = null;
        if (target && (target.classList.contains('e-pdfviewer-formFields')
            || target.classList.contains('e-pdfviewer-ListBox') || target.classList.contains('e-pdfviewer-signatureformFields'))) {
            isFormfields = true;
        }
        if (!this.isLongTouchPropagated && !this.navigationPane.isNavigationToolbarVisible && !isFormfields) {
            if (this.pdfViewer.toolbarModule) {
                if ((this.touchClientX >= touches[0].clientX - 10) && (this.touchClientX <= touches[0].clientX + 10) &&
                    (this.touchClientY >= touches[0].clientY - 10) && (this.touchClientY <= touches[0].clientY + 10)) {
                    if (!this.isTapHidden) {
                        if (!isBlazor()) {
                            this.viewerContainer.scrollTop -= this.getElement('_toolbarContainer').clientHeight * this.getZoomFactor();
                        } else {
                            // tslint:disable-next-line:max-line-length
                            this.viewerContainer.scrollTop -= this.pdfViewer.element.querySelector('.e-pv-mobile-toolbar').clientHeight * this.getZoomFactor();
                        }
                        this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 0);
                        if (this.pdfViewer.toolbar.moreDropDown) {
                            let dropDown: HTMLElement = this.getElement('_more_option-popup');
                            if (dropDown.firstElementChild) {
                                dropDown.classList.remove('e-popup-open');
                                dropDown.classList.add('e-popup-close');
                                dropDown.removeChild(dropDown.firstElementChild);
                            }
                        }
                    } else {
                        if (!isBlazor) {
                            this.viewerContainer.scrollTop += this.getElement('_toolbarContainer').clientHeight * this.getZoomFactor();
                        } else {
                            // tslint:disable-next-line:max-line-length
                            this.viewerContainer.scrollTop += this.pdfViewer.element.querySelector('.e-pv-mobile-toolbar').clientHeight * this.getZoomFactor();
                        }
                        // tslint:disable-next-line:max-line-length
                        this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 56);
                    }
                    if (this.isTapHidden && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
                        this.mobileScrollerContainer.style.display = '';
                        this.updateMobileScrollerPosition();
                    // tslint:disable-next-line:max-line-length
                    } else if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.getSelectTextMarkupCurrentPage() == null) {
                        this.mobileScrollerContainer.style.display = 'none';
                    }
                    if (this.getSelectTextMarkupCurrentPage() == null) {
                        if (!isBlazor()) {
                            this.pdfViewer.toolbarModule.showToolbar(this.isTapHidden);
                        } else {
                            //this.pdfViewer._dotnetInstance.invokeMethodAsync('TapOnMobileDevice', this.isTapHidden);
                            this.blazorUIAdaptor.tapOnMobileDevice(this.isTapHidden);
                        }
                        this.isTapHidden = !this.isTapHidden;
                    }
                }
                this.tapCount = 0;
            }
        }
    }

    private onDoubleTap(touches: TouchList): void {
        let target: HTMLElement = touches[0].target as HTMLElement;
        let isFormfields: boolean = false;
        if (target && (target.classList.contains('e-pdfviewer-formFields')
            || target.classList.contains('e-pdfviewer-ListBox') || target.classList.contains('e-pdfviewer-signatureformFields'))) {
            isFormfields = true;
        }
        if (this.tapCount === 2 && !isFormfields) {
            this.tapCount = 0;
            /**
             * Sometimes the values gets differ by some decimal points. So converted the decimal points values to Integer values.
             */
            // tslint:disable-next-line
            if ((this.touchClientX >= parseInt((touches[0].clientX - 10).toString())) && (this.touchClientX <= touches[0].clientX + 10) &&
                (this.touchClientY >= touches[0].clientY - 10) && (this.touchClientY <= touches[0].clientY + 30)) {
                if (this.pdfViewer.magnification) {
                    this.pdfViewer.magnification.onDoubleTapMagnification();
                }
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 0);
                this.isTapHidden = false;
                clearTimeout(this.singleTapTimer);
            }
        }
    }

    private viewerContainerOnLongTouch = (event: TouchEvent): void => {
        this.touchClientX = event.touches[0].clientX;
        this.touchClientY = event.touches[0].clientY;
        event.preventDefault();
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.initiateTouchSelection(event, this.touchClientX, this.touchClientY);
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                clearTimeout(this.singleTapTimer);
                this.tapCount = 0;
            }
        }
    }

    private viewerContainerOnPointerDown = (event: PointerEvent): void => {
        if (event.pointerType === 'touch') {
            this.pointerCount++;
            if (this.pointerCount <= 2) {
                event.preventDefault();
                this.pointersForTouch.push(event);
                if (this.pointerCount === 2) {
                    this.pointerCount = 0;
                }
                if (this.pdfViewer.magnificationModule) {
                    this.pdfViewer.magnificationModule.setTouchPoints(event.clientX, event.clientY);
                }
            }
        }
    }

    private preventTouchEvent(event: TouchEvent): void {
        if (this.pdfViewer.textSelectionModule) {
            // tslint:disable-next-line:max-line-length
            if (!this.isPanMode && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled && this.getSelectTextMarkupCurrentPage() == null) {
                if (!(this.isWebkitMobile && (Browser.isDevice && !this.pdfViewer.enableDesktopMode))) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
    }

    private viewerContainerOnTouchMove = (event: TouchEvent): void => {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            clearTimeout(this.singleTapTimer);
            this.tapCount = 0;
        }
        this.preventTouchEvent(event);
        if (this.isToolbarInkClicked) {
            event.preventDefault();
        }
        let touchPoints: TouchList = event.touches;
        if (this.pdfViewer.magnificationModule) {
            this.isTouchScrolled = true;
            if (touchPoints.length > 1 && this.pageCount > 0) {
                if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                    this.isTouchScrolled = false;
                }
                if (this.pdfViewer.enablePinchZoom) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.magnificationModule.initiatePinchMove(touchPoints[0].clientX, touchPoints[0].clientY, touchPoints[1].clientX, touchPoints[1].clientY);
                }
            } else if (touchPoints.length === 1 && this.getPagesPinchZoomed()) {
                if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                    this.isTouchScrolled = false;
                }
                this.pdfViewer.magnificationModule.pinchMoveScroll();
            }
        }
        this.mouseX = touchPoints[0].clientX;
        this.mouseY = touchPoints[0].clientY;
        let canvas: Rect;
        // tslint:disable-next-line:max-line-length
        if (event.target && ((event.target as PdfAnnotationBaseModel).id.indexOf('_text') > -1 || (event.target as PdfAnnotationBaseModel).id.indexOf('_annotationCanvas') > -1 || (event.target as HTMLElement).classList.contains('e-pv-hyperlink')) && this.pdfViewer.annotation) {
            let pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(event);
            let diagram: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
            if (diagram) {
                let canvas1: Rect = diagram.getBoundingClientRect() as Rect;
                let left: number = canvas1.x ? canvas1.x : canvas1.left;
                let top: number = canvas1.y ? canvas1.y : canvas1.top;
                canvas = new Rect(left + 10, top + 10, canvas1.width - 10, canvas1.height - 10);
            }
        }
        if (canvas && canvas.containsPoint({ x: this.mouseX, y: this.mouseY })) {
            this.diagramMouseMove(event);
            this.annotationEvent = event;
        } else {
            this.diagramMouseLeave(event);
            if (this.isAnnotationDrawn) {
                this.diagramMouseUp(event);
                this.isAnnotationAdded = true;
            }
        }
        touchPoints = null;
    }

    private viewerContainerOnPointerMove = (event: PointerEvent): void => {
        if (event.pointerType === 'touch' && this.pageCount > 0) {
            event.preventDefault();
            if (this.pointersForTouch.length === 2) {
                for (let i: number = 0; i < this.pointersForTouch.length; i++) {
                    if (event.pointerId === this.pointersForTouch[i].pointerId) {
                        this.pointersForTouch[i] = event;
                        break;
                    }
                }
                if (this.pdfViewer.magnificationModule && this.pdfViewer.enablePinchZoom) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.magnificationModule.initiatePinchMove(this.pointersForTouch[0].clientX, this.pointersForTouch[0].clientY, this.pointersForTouch[1].clientX, this.pointersForTouch[1].clientY);
                }
            }
        }
    }

    private viewerContainerOnTouchEnd = (event: TouchEvent): void => {
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.pinchMoveEnd();
        }
        this.isLongTouchPropagated = false;
        clearInterval(this.longTouchTimer);
        this.longTouchTimer = null;
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.isTouchScrolled) {
            this.currentTime = new Date().getTime();
            let duration: number = this.currentTime - this.previousTime;
            // tslint:disable-next-line
            let difference: any = this.scrollY - event.changedTouches[0].pageY;
            // tslint:disable-next-line
            let speed: any = (difference) / (duration);
            if (Math.abs(speed) > 1.5) {
                // tslint:disable-next-line
                let scrollTop: any = (difference) + ((duration) * speed);
                this.viewerContainer.scrollTop += scrollTop;
                this.updateMobileScrollerPosition();
            }
        }
        this.diagramMouseUp(event);
        this.renderStampAnnotation(event);
    }

    private renderStampAnnotation(event: TouchEvent): void {
        if (this.pdfViewer.annotation) {
            let zoomFactor: number = this.getZoomFactor();
            let pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(event);
            let pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
            if (this.pdfViewer.enableStampAnnotations) {
                let stampModule: StampAnnotation = this.pdfViewer.annotationModule.stampAnnotationModule;
                if (stampModule && stampModule.isStampAnnotSelected) {
                    if (pageDiv) {
                        let pageCurrentRect: ClientRect = pageDiv.getBoundingClientRect();
                        // tslint:disable-next-line:max-line-length
                        stampModule.renderStamp((event.changedTouches[0].clientX - pageCurrentRect.left) / zoomFactor, (event.changedTouches[0].clientY - pageCurrentRect.top) / zoomFactor, null, null, pageIndex, null, null, null, null);
                        stampModule.isStampAnnotSelected = false;
                    }
                }
                this.pdfViewer.annotation.onAnnotationMouseDown();
            }
            if (this.pdfViewer.enableHandwrittenSignature && this.isSignatureAdded && pageDiv) {
                let pageCurrentRect: ClientRect = pageDiv.getBoundingClientRect();
                // tslint:disable-next-line:max-line-length
                this.signatureModule.renderSignature((event.changedTouches[0].clientX - pageCurrentRect.left) / zoomFactor, (event.changedTouches[0].clientY - pageCurrentRect.top) / zoomFactor);
                this.isSignatureAdded = false;
            }
            if (event.touches.length === 1 && this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationTouchEnd(event);
            }
        }
    }

    private viewerContainerOnPointerEnd = (event: PointerEvent): void => {
        if (event.pointerType === 'touch') {
            event.preventDefault();
            if (this.pdfViewer.magnificationModule) {
                this.pdfViewer.magnificationModule.pinchMoveEnd();
            }
            this.pointersForTouch = [];
            this.pointerCount = 0;
        }
    }

    // tslint:disable-next-line
    private initPageDiv(pageValues: { pageCount: any, pageSizes: any }): void {
        if (!isBlazor()) {
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.toolbarModule.updateTotalPage();
            }
        }
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.mobiletotalPageContainer) {
            this.mobiletotalPageContainer.innerHTML = this.pageCount.toString();
            this.pageNoContainer.innerHTML = '(1-' + this.pageCount.toString() + ')';
        }
        if (this.pageCount > 0) {
            let topValue: number = 0;
            let pageLimit: number = 0;
            this.isMixedSizeDocument = false;
            if (this.pageCount > 100) {
                // to render 100 pages intially.
                pageLimit = 100;
                this.pageLimit = pageLimit;
            } else {
                pageLimit = this.pageCount;
            }
            let isPortrait: boolean = false;
            let isLandscape: boolean = false;
            let differentPageSize: boolean = false;
            for (let i: number = 0; i < pageLimit; i++) {
                if (typeof pageValues.pageSizes[i] !== 'object') {
                    let pageSize: string[] = pageValues.pageSizes[i].split(',');
                    if (pageValues.pageSizes[i - 1] !== null && i !== 0) {
                        let previousPageHeight: string = pageValues.pageSizes[i - 1].split(',');
                        topValue = this.pageGap + parseFloat(previousPageHeight[1]) + topValue;
                    } else {
                        topValue = this.pageGap;
                    }
                    let size: ISize = { width: parseFloat(pageSize[0]), height: parseFloat(pageSize[1]), top: topValue };
                    this.pageSize.push(size);
                } else {
                    if (pageValues.pageSizes[i - 1] !== null && i !== 0) {
                        // tslint:disable-next-line
                        let previousPageHeight: any = pageValues.pageSizes[i - 1];
                        topValue = this.pageGap + parseFloat(previousPageHeight.Height) + topValue;
                    } else {
                        topValue = this.pageGap;
                    }
                    let size: ISize = { width: pageValues.pageSizes[i].Width, height: pageValues.pageSizes[i].Height, top: topValue };
                    this.pageSize.push(size);
                }
                if (this.pageSize[i].height > this.pageSize[i].width) {
                    isPortrait = true;
                }
                if (this.pageSize[i].width > this.pageSize[i].height) {
                    isLandscape = true;
                }
                if (i > 0 && this.pageSize[i].width !== this.pageSize[i - 1].width) {
                    differentPageSize = true;
                }
                let pageWidth: number = this.pageSize[i].width;
                if (pageWidth > this.highestWidth) {
                    this.highestWidth = pageWidth;
                }
            }
            if ((isPortrait && isLandscape) || differentPageSize) {
                this.isMixedSizeDocument = true;
            }
            let limit: number = this.pageCount < 10 ? this.pageCount : 10;
            for (let i: number = 0; i < limit; i++) {
                this.renderPageContainer(i, this.getPageWidth(i), this.getPageHeight(i), this.getPageTop(i));
            }
            // tslint:disable-next-line:max-line-length
            this.pageContainer.style.height = this.getPageTop(this.pageSize.length - 1) + this.getPageHeight(this.pageSize.length - 1) + 'px';
            this.pageContainer.style.position = 'relative';
            if (this.pageLimit === 100) {
                let pageDiv: HTMLElement = this.getElement('_pageDiv_' + this.pageLimit);
                if (pageDiv === null && this.pageLimit < this.pageCount) {
                    Promise.all([this.renderPagesVirtually()]);
                }
            }
        }
    }

    private renderElementsVirtualScroll(pageNumber: number): void {
        let lowerLimit: number = 1;
        let higherLimit: number = 3;
        if (this.pageStopValue <= 200) {
            lowerLimit = 4;
            higherLimit = 4;
        } else {
            lowerLimit = 2;
            higherLimit = 3;
        }
        let pageValue: number = pageNumber + lowerLimit;
        if (pageValue > this.pageCount) {
            pageValue = this.pageCount;
        }
        for (let i: number = pageNumber - 1; i <= pageValue; i++) {
            if (i !== -1) {
                this.renderPageElement(i);
            }
        }
        let lowerPageValue: number = pageNumber - 3;
        if (lowerPageValue < 0) {
            lowerPageValue = 0;
        }
        for (let i: number = pageNumber - 1; i >= lowerPageValue; i--) {
            if (i !== -1) {
                this.renderPageElement(i);
            }
        }
        for (let j: number = 0; j < this.pageCount; j++) {
            if (!((lowerPageValue <= j) && (j <= pageValue))) {
                let pageDiv: HTMLElement = this.getElement('_pageDiv_' + j);
                let pageCanvas: HTMLElement = this.getElement('_pageCanvas_' + j);
                let textLayer: HTMLElement = this.getElement('_textLayer_' + j);
                if (pageCanvas) {
                    pageCanvas.parentNode.removeChild(pageCanvas);
                    if (textLayer) {
                        if (this.pdfViewer.textSelectionModule && textLayer.childNodes.length !== 0 && !this.isTextSelectionDisabled) {
                            this.pdfViewer.textSelectionModule.maintainSelectionOnScroll(j, true);
                        }
                        textLayer.parentNode.removeChild(textLayer);
                    }
                    let indexInArray: number = this.renderedPagesList.indexOf(j);
                    if (indexInArray !== -1) {
                        this.renderedPagesList.splice(indexInArray, 1);
                    }
                }
                if (pageDiv) {
                    pageDiv.parentNode.removeChild(pageDiv);
                    let indexInArray: number = this.renderedPagesList.indexOf(j);
                    if (indexInArray !== -1) {
                        this.renderedPagesList.splice(indexInArray, 1);
                    }
                }
            }
        }
    }

    private renderPageElement(i: number): void {
        let pageDiv: HTMLElement = this.getElement('_pageDiv_' + i);
        let canvas: HTMLCanvasElement = this.getElement('_pageCanvas_' + i) as HTMLCanvasElement;
        if (canvas == null && pageDiv == null && i < this.pageSize.length) {
            // tslint:disable-next-line
            this.renderPageContainer(i, this.getPageWidth(i), this.getPageHeight(i), this.getPageTop(i));
        }
    }

    private async renderPagesVirtually(): Promise<void> {
        // tslint:disable-next-line
        let proxy: any = this;
        setTimeout(
            () => { this.initiateRenderPagesVirtually(proxy); }, 500);
    }

    // tslint:disable-next-line
    private initiateRenderPagesVirtually(proxy: any): void {
        let jsonObject: object = { hashId: proxy.hashId, isCompletePageSizeNotReceived: true, action: 'VirtualLoad', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.documentId };
        if (proxy.jsonDocumentId) {
            // tslint:disable-next-line
            (jsonObject as any).documentId = proxy.jsonDocumentId;
        }
        this.virtualLoadRequestHandler = new AjaxHandler(this.pdfViewer);
        this.virtualLoadRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.load;
        this.virtualLoadRequestHandler.responseType = 'json';
        this.virtualLoadRequestHandler.mode = true;
        this.virtualLoadRequestHandler.send(jsonObject);
        // tslint:disable-next-line
        this.virtualLoadRequestHandler.onSuccess = function (result: any) {
            // tslint:disable-next-line
            let data: any = result.data;
            if (data) {
                if (typeof data !== 'object') {
                    try {
                        data = JSON.parse(data);
                    } catch (error) {
                        proxy.onControlError(500, data, 'VirtualLoad');
                    }
                }
            }
            if (data) {
                while (typeof data !== 'object') {
                    data = JSON.parse(data);
                }
                if (proxy.documentId === data.uniqueId) {
                    // tslint:disable-next-line
                    let pageValues: { pageCount: any; pageSizes: any; } = data;
                    if (proxy.pageSize[proxy.pageLimit - 1]) {
                        let topValue: number = proxy.pageSize[proxy.pageLimit - 1].top;
                        for (let i: number = proxy.pageLimit; i < proxy.pageCount; i++) {
                            let pageSize: string[] = pageValues.pageSizes[i].split(',');
                            if (proxy.pageSize[i - 1] !== null && i !== 0) {
                                let previousPageHeight: string = proxy.pageSize[i - 1].height;
                                topValue = proxy.pageGap + parseFloat(previousPageHeight) + topValue;
                            }
                            let size: ISize = { width: parseFloat(pageSize[0]), height: parseFloat(pageSize[1]), top: topValue };
                            proxy.pageSize.push(size);
                        }
                        // tslint:disable-next-line:max-line-length
                        proxy.pageContainer.style.height = proxy.getPageTop(proxy.pageSize.length - 1) + proxy.getPageHeight(proxy.pageSize.length - 1) + 'px';
                        // tslint:disable-next-line
                        let pageData: any = window.sessionStorage.getItem(proxy.documentId + '_pagedata');
                        if (proxy.pageCount > 100) {
                            proxy.pdfViewer.fireDocumentLoad(pageData);
                        }
                    }
                }
            }
        };
        // tslint:disable-next-line
        this.virtualLoadRequestHandler.onFailure = function (result: any) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
        };
        // tslint:disable-next-line
        this.virtualLoadRequestHandler.onError = function (result: any) {
            proxy.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
        };
    }

    // tslint:disable-next-line
    private tileRenderPage(data: any, pageIndex: number): void {
        let proxy: PdfViewerBase = this;
        if (data && this.pageSize[pageIndex]) {
            let pageWidth: number = this.getPageWidth(pageIndex);
            let pageHeight: number = this.getPageHeight(pageIndex);
            // tslint:disable-next-line:max-line-length
            let canvas: HTMLCanvasElement = this.getElement('_pageCanvas_' + pageIndex) as HTMLCanvasElement;
            let pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
            if (pageDiv) {
                if (this.isMixedSizeDocument && this.highestWidth > 0) {
                    pageDiv.style.width = (this.highestWidth * this.getZoomFactor()) + 'px';
                } else {
                    pageDiv.style.width = pageWidth + 'px';
                }
                pageDiv.style.height = pageHeight + 'px';
                pageDiv.style.top = this.getPageTop(pageIndex) + 'px';
                if (this.pdfViewer.enableRtl) {
                    pageDiv.style.right = this.updateLeftPosition(pageIndex) + 'px';
                } else {
                    pageDiv.style.left = this.updateLeftPosition(pageIndex) + 'px';
                }
            }
            if (canvas) {
                canvas.style.backgroundColor = '#fff';
                canvas.style.width = pageWidth + 'px';
                canvas.style.height = pageHeight + 'px';
                let zoomFactor: number = this.retrieveCurrentZoomFactor();
                let currentString: string = this.documentId + '_' + pageIndex + '_' + zoomFactor + '_' + data.tileX + '_' + data.tileY;
                // tslint:disable-next-line:max-line-length
                if (((this.tilerequestLists.indexOf(currentString) === -1) && this.pdfViewer.restrictZoomRequest) || (!this.pdfViewer.restrictZoomRequest)) {
                this.tilerequestLists.push(currentString);
                // tslint:disable-next-line
                let imageData: string = data['image'];
                // tslint:disable-next-line
                let matrix = data['transformationMatrix'];
                if (imageData) {
                    let image: HTMLImageElement = new Image();
                    image.onload = (): void => {
                        let pagecanvas: HTMLElement = this.getElement('_pageCanvas_' + pageIndex);
                        if (pagecanvas) {
                            let scaleFactor: number = (!isNullOrUndefined(data.scaleFactor)) ? data.scaleFactor : 1.5;
                            // tslint:disable-next-line
                            let pageCanvasWidth: number = parseInt(((pagecanvas as HTMLCanvasElement).width).toString());
                            // tslint:disable-next-line
                            let pageCanvasStyleWidth: number = parseInt((parseFloat(pagecanvas.style.width) * scaleFactor).toString());
                            // tslint:disable-next-line
                            if (!isNaN(parseFloat(pagecanvas.style.width)) && pageCanvasWidth !== pageCanvasStyleWidth) {
                                pagecanvas.style.width = pageWidth + 'px';
                                pagecanvas.style.height = pageHeight + 'px';
                                // tslint:disable-next-line
                                (pagecanvas as HTMLCanvasElement).height = parseInt((pageHeight * scaleFactor).toString());
                                // tslint:disable-next-line
                                (pagecanvas as HTMLCanvasElement).width = parseInt((pageWidth * scaleFactor).toString());
                            }
                            proxy.tileRenderCount = proxy.tileRenderCount + 1;
                            let zoomFactor: number = this.retrieveCurrentZoomFactor();
                            if (data.zoomFactor) {
                                zoomFactor = data.zoomFactor;
                            }
                            let matrix0: number = (matrix.Elements[0] * this.getZoomFactor()) / zoomFactor;
                            let matrix1: number = (matrix.Elements[1] * this.getZoomFactor()) / zoomFactor;
                            let matrix2: number = (matrix.Elements[2] * this.getZoomFactor()) / zoomFactor;
                            let matrix3: number = (matrix.Elements[3] * this.getZoomFactor()) / zoomFactor;
                            let matrix4: number = (matrix.Elements[4] * this.getZoomFactor()) / zoomFactor;
                            let matrix5: number = (matrix.Elements[5] * this.getZoomFactor()) / zoomFactor;
                            let context: CanvasRenderingContext2D = (pagecanvas as HTMLCanvasElement).getContext('2d');
                            // tslint:disable-next-line
                            context.setTransform(matrix0, matrix1, matrix2, matrix3, matrix4, matrix5);
                            context.drawImage(image, 0, 0);
                            this.showPageLoadingIndicator(pageIndex, false);
                            if (isNaN(data.tileX) && isNaN(data.tileY)) {
                                if (pageIndex === 0 && this.isDocumentLoaded) {
                                    this.renderPDFInformations();
                                    this.isInitialLoaded = true;
                                    // tslint:disable-next-line
                                    let pageData: any = window.sessionStorage.getItem(this.documentId + '_pagedata');
                                    if (this.pageCount <= 100) {
                                        this.pdfViewer.fireDocumentLoad(pageData);
                                    }
                                    this.isDocumentLoaded = false;
                                    if (this.pdfViewer.textSearch && this.pdfViewer.isExtractText) {
                                        this.pdfViewer.textSearchModule.getPDFDocumentTexts();
                                    }
                                }
                            }
                            if (proxy.tileRenderCount === proxy.tileRequestCount && proxy.isTileImageRendered) {
                                proxy.isTileImageRendered = false;
                                proxy.tileRenderCount = 0;
                                if (this.pdfViewer.magnificationModule) {
                                    this.pdfViewer.magnificationModule.rerenderCountIncrement();
                                }
                            }
                            image.onload = null;
                            image = null;
                        }
                    };
                    image.src = imageData;
                }
                }
                if (isNaN(data.tileX) && isNaN(data.tileY)) {
                    this.onPageRender(data, pageIndex, pageDiv);
                }
            }
        }
    }

    private calculateImageWidth(pageWidth: number, zoomFactor: number, scaleFactor: number, imageWidth: number): number {
        let width: number = (pageWidth / this.getZoomFactor()) * zoomFactor * scaleFactor;
        // tslint:disable-next-line
        if ((parseInt(imageWidth.toString())) === (parseInt(width.toString()))) {
            imageWidth = width;
        }
        imageWidth = ((imageWidth * this.getZoomFactor()) / zoomFactor);
        return imageWidth;
    }

    // tslint:disable-next-line
    private renderPage(data: any, pageIndex: number): void {
        if (data && this.pageSize[pageIndex]) {
            let pageWidth: number = this.getPageWidth(pageIndex);
            let pageHeight: number = this.getPageHeight(pageIndex);
            // tslint:disable-next-line:max-line-length
            let canvas: HTMLCanvasElement = this.getElement('_pageCanvas_' + pageIndex) as HTMLCanvasElement;
            let pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
            if (pageDiv) {
                if (this.isMixedSizeDocument && this.highestWidth > 0) {
                    pageDiv.style.width = (this.highestWidth * this.getZoomFactor()) + 'px';
                } else {
                    pageDiv.style.width = pageWidth + 'px';
                }
                pageDiv.style.height = pageHeight + 'px';
                pageDiv.style.top = this.getPageTop(pageIndex) + 'px';
                if (this.pdfViewer.enableRtl) {
                    pageDiv.style.right = this.updateLeftPosition(pageIndex) + 'px';
                } else {
                    pageDiv.style.left = this.updateLeftPosition(pageIndex) + 'px';
                }
            }

            if (canvas) {
                canvas.style.width = pageWidth + 'px';
                canvas.style.height = pageHeight + 'px';
                let context: CanvasRenderingContext2D = canvas.getContext('2d');
                // tslint:disable-next-line
                let imageData: string = data['image'];
                // tslint:disable-next-line
                let matrix = data['transformationMatrix'];
                if (imageData) {
                    let image: HTMLImageElement = new Image();
                    image.onload = (): void => {
                        let imageWidth: number = image.width;
                        let scaleFactor: number = (!isNullOrUndefined(data.scaleFactor)) ? data.scaleFactor : 1.5;
                        let zoomFactor: number = this.retrieveCurrentZoomFactor();
                        if (data.zoomFactor) {
                            imageWidth = this.calculateImageWidth(pageWidth, data.zoomFactor, scaleFactor, imageWidth);
                        } else {
                            imageWidth = this.calculateImageWidth(pageWidth, zoomFactor, scaleFactor, imageWidth);
                        }
                        // tslint:disable-next-line
                        if (parseInt((pageWidth * scaleFactor).toString()) === parseInt(imageWidth.toString())) {
                            if (!isNaN(parseFloat(canvas.style.width))) {
                                canvas.style.width = pageWidth + 'px';
                                canvas.style.height = pageHeight + 'px';
                                canvas.height = pageHeight * window.devicePixelRatio;
                                canvas.width = pageWidth * window.devicePixelRatio;
                            }
                            if (pageWidth < parseFloat(pageDiv.style.width)) {
                                pageDiv.style.boxShadow = 'none';
                            }
                            // tslint:disable-next-line
                            context.setTransform(matrix.Elements[0], matrix.Elements[1], matrix.Elements[2], matrix.Elements[3], matrix.Elements[4], matrix.Elements[5]);
                            context.drawImage(image, 0, 0, canvas.width, canvas.height);
                            this.showPageLoadingIndicator(pageIndex, false);
                            if (pageIndex === 0 && this.isDocumentLoaded) {
                                this.renderPDFInformations();
                                this.isInitialLoaded = true;
                                // tslint:disable-next-line
                                let pageData: any = window.sessionStorage.getItem(this.documentId + '_pagedata');
                                if (this.pageCount <= 100) {
                                    this.pdfViewer.fireDocumentLoad(pageData);
                                }
                                this.isDocumentLoaded = false;
                                if (this.pdfViewer.textSearch && this.pdfViewer.isExtractText) {
                                    this.pdfViewer.textSearchModule.getPDFDocumentTexts();
                                }
                            }
                            if (this.pdfViewer.magnificationModule) {
                                this.pdfViewer.magnificationModule.rerenderCountIncrement();
                            }
                        }
                        image.onload = null;
                        image = null;
                    };
                    image.src = imageData;
                    if (this.pdfViewer.magnificationModule) {
                        this.pdfViewer.magnificationModule.pushImageObjects(image);
                    }
                }
                this.onPageRender(data, pageIndex, pageDiv);
            }
        }
    }

    // tslint:disable-next-line
    private onPageRender(data: any, pageIndex: number, pageDiv: HTMLElement): void {
        let aElement: NodeListOf<HTMLAnchorElement> = pageDiv.getElementsByTagName('a');
        let isAnnotationRendered: boolean = false;
        if (aElement.length !== 0) {
            for (let index: number = aElement.length - 1; index >= 0; index--) {
                aElement[index].parentNode.removeChild(aElement[index]);
            }
        }
        if (this.pdfViewer.textSearchModule || this.pdfViewer.textSelectionModule || this.pdfViewer.annotationModule) {
            this.renderTextContent(data, pageIndex);
        }
        if (this.pdfViewer.formFieldsModule) {
            this.pdfViewer.formFieldsModule.renderFormFields(pageIndex);
        }
        if (this.pdfViewer.enableHyperlink && this.pdfViewer.linkAnnotationModule) {
            this.pdfViewer.linkAnnotationModule.renderHyperlinkContent(data, pageIndex);
        }
        if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
            this.pdfViewer.textSelectionModule.applySelectionRangeOnScroll(pageIndex);
        }
        if (this.documentAnnotationCollections) {
            let isAnnotationAdded: boolean = false;
            for (let i: number = 0; i < this.annotationRenderredList.length; i++) {
                if (this.annotationRenderredList[i] === pageIndex) {
                    isAnnotationAdded = true;
                }
            }
            // tslint:disable-next-line
            let pageAnnotations: any = this.documentAnnotationCollections[pageIndex];
            if (pageAnnotations && !isAnnotationAdded) {
                data.shapeAnnotation = pageAnnotations.shapeAnnotation;
                data.measureShapeAnnotation = pageAnnotations.measureShapeAnnotation;
                data.textMarkupAnnotation = pageAnnotations.textMarkupAnnotation;
                data.freeTextAnnotation = pageAnnotations.freeTextAnnotation;
                data.stampAnnotations = pageAnnotations.stampAnnotations;
                data.stickyNotesAnnotation = pageAnnotations.stickyNotesAnnotation;
                data.signatureInkAnnotation = pageAnnotations.signatureInkAnnotation;
                this.annotationRenderredList.push(pageIndex);
            }
        }
        if (this.isImportAction) {
            // tslint:disable-next-line
            let pageAnnotations: any = this.checkDocumentCollectionData(pageIndex);
            if (pageAnnotations) {
                data.shapeAnnotation = pageAnnotations.shapeAnnotation;
                data.measureShapeAnnotation = pageAnnotations.measureShapeAnnotation;
                data.textMarkupAnnotation = pageAnnotations.textMarkupAnnotation;
                data.freeTextAnnotation = pageAnnotations.freeTextAnnotation;
                data.stampAnnotations = pageAnnotations.stampAnnotations;
                data.stickyNotesAnnotation = pageAnnotations.stickyNotesAnnotation;
                data.signatureInkAnnotation = pageAnnotations.signatureInkAnnotation;
                isAnnotationRendered = true;
            }
        }
        if (this.isTextMarkupAnnotationModule() || this.isShapeBasedAnnotationsEnabled()) {
            if (this.isStampAnnotationModule()) {
                // tslint:disable-next-line
                let stampData: any = data['stampAnnotations'];
                if (isAnnotationRendered) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotations(stampData, pageIndex, null, true);
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotations(stampData, pageIndex);
                }
            }
            if (isAnnotationRendered) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.renderAnnotations(pageIndex, data.shapeAnnotation, data.measureShapeAnnotation, data.textMarkupAnnotation, null, true);
            } else {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.renderAnnotations(pageIndex, data.shapeAnnotation, data.measureShapeAnnotation, data.textMarkupAnnotation);
            }
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderStickyNotesAnnotations(data.stickyNotesAnnotation, pageIndex);
        }
        if (this.pdfViewer.textSearchModule) {
            if (this.pdfViewer.textSearchModule.isTextSearch) {
                this.pdfViewer.textSearchModule.highlightOtherOccurrences(pageIndex);
            }
        }
        if (this.isShapeBasedAnnotationsEnabled()) {
            let canvas1: HTMLElement = this.getElement('_annotationCanvas_' + pageIndex);
            let commonStyle: string = 'position:absolute;top:0px;left:0px;overflow:hidden;pointer-events:none;';
            if (canvas1) {
                let bounds: ClientRect = canvas1.getBoundingClientRect();
                renderAdornerLayer(bounds, commonStyle, canvas1, pageIndex, this.pdfViewer);
                this.pdfViewer.renderSelector(pageIndex, this.pdfViewer.annotationSelectorSettings);
            }
        }
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.selectCommentsAnnotation(pageIndex);
        }
        if (this.isFreeTextAnnotationModule() && data.freeTextAnnotation) {
            if (isAnnotationRendered) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.freeTextAnnotationModule.renderFreeTextAnnotations(data.freeTextAnnotation, pageIndex, true);
            } else {
                this.pdfViewer.annotationModule.freeTextAnnotationModule.renderFreeTextAnnotations(data.freeTextAnnotation, pageIndex);
            }
        }
        if (this.isInkAnnotationModule() && data && data.signatureInkAnnotation) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotationModule.inkAnnotationModule.renderExistingInkSignature(data.signatureInkAnnotation, pageIndex, isAnnotationRendered);
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.isAnnotationSelected && this.pdfViewer.annotationModule.annotationPageIndex === pageIndex) {
            this.pdfViewer.annotationModule.selectAnnotationFromCodeBehind();
        }
    }

    /**
     * @private
     */
    public renderAnnotations(pageIndex: number ): void {
        // tslint:disable-next-line
        let data: any = {};
        if (this.documentAnnotationCollections) {
            let isAnnotationAdded: boolean = false;
            for (let i: number = 0; i < this.annotationRenderredList.length; i++) {
                if (this.annotationRenderredList[i] === pageIndex) {
                    isAnnotationAdded = true;
                }
            }
            // tslint:disable-next-line
            let pageAnnotations: any = this.documentAnnotationCollections[pageIndex];
            if (pageAnnotations && !isAnnotationAdded) {
                data.shapeAnnotation = pageAnnotations.shapeAnnotation;
                data.measureShapeAnnotation = pageAnnotations.measureShapeAnnotation;
                data.textMarkupAnnotation = pageAnnotations.textMarkupAnnotation;
                data.freeTextAnnotation = pageAnnotations.freeTextAnnotation;
                data.stampAnnotations = pageAnnotations.stampAnnotations;
                data.stickyNotesAnnotation = pageAnnotations.stickyNotesAnnotation;
                data.signatureAnnotation = pageAnnotations.signatureAnnotation;
                data.signatureInkAnnotation = pageAnnotations.signatureInkAnnotation;
                this.annotationRenderredList.push(pageIndex);
            }
        }
        if (this.isAnnotationCollectionRemoved) {
            data.shapeAnnotation = [];
            data.measureShapeAnnotation = [];
            data.textMarkupAnnotation = [];
            data.freeTextAnnotation = [];
            data.stampAnnotations = [];
            data.stickyNotesAnnotation = [];
            data.signatureInkAnnotation = [];
        }
        if (this.isTextMarkupAnnotationModule() || this.isShapeBasedAnnotationsEnabled()) {
            if (this.isStampAnnotationModule()) {
                // tslint:disable-next-line
                let stampData: any = data['stampAnnotations'];
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotations(stampData, pageIndex);
            }
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotationModule.renderAnnotations(pageIndex, data.shapeAnnotation, data.measureShapeAnnotation, data.textMarkupAnnotation);
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderStickyNotesAnnotations(data.stickyNotesAnnotation, pageIndex);
        }
        if (this.pdfViewer.textSearchModule) {
            if (this.pdfViewer.textSearchModule.isTextSearch) {
                this.pdfViewer.textSearchModule.highlightOtherOccurrences(pageIndex);
            }
        }
        if (this.isImportAction) {
            let isAnnotationAdded: boolean = false;
            for (let i: number = 0; i < this.annotationPageList.length; i++) {
                if (this.annotationPageList[i] === pageIndex) {
                    isAnnotationAdded = true;
                }
            }
            if (!isAnnotationAdded) {
                if (this.importedAnnotation) {
                    this.drawPageAnnotations(this.importedAnnotation, pageIndex, true);
                    this.annotationPageList[this.annotationPageList.length] = pageIndex;
                }
            }
        }
        if (this.isShapeBasedAnnotationsEnabled()) {
            let canvas1: HTMLElement = this.getElement('_annotationCanvas_' + pageIndex);
            let commonStyle: string = 'position:absolute;top:0px;left:0px;overflow:hidden;pointer-events:none;';
            if (canvas1) {
                let bounds: ClientRect = canvas1.getBoundingClientRect();
                renderAdornerLayer(bounds, commonStyle, canvas1, pageIndex, this.pdfViewer);
                this.pdfViewer.renderSelector(pageIndex);
            }
        }
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.selectCommentsAnnotation(pageIndex);
        }
        if (this.isFreeTextAnnotationModule() && data.freeTextAnnotation) {
            this.pdfViewer.annotationModule.freeTextAnnotationModule.renderFreeTextAnnotations(data.freeTextAnnotation, pageIndex);
        }
        if (data && data.signatureAnnotation) {
            this.signatureModule.renderExistingSignature(data.signatureAnnotation, pageIndex, false);
        }
        if (this.isInkAnnotationModule() && data && data.signatureInkAnnotation) {
            this.pdfViewer.annotationModule.inkAnnotationModule.renderExistingInkSignature(data.signatureInkAnnotation, pageIndex, false);
        }
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.isAnnotationSelected) {
            this.pdfViewer.annotationModule.selectAnnotationFromCodeBehind();
        }
    }
    // tslint:disable-next-line
    private renderTextContent(data: any, pageIndex: number): void {
        // tslint:disable-next-line
        let texts: string[] = data['textContent'];
        // tslint:disable-next-line
        let bounds: any = data['textBounds'];
        // tslint:disable-next-line
        let rotation: any = data['rotation'];
        let textLayer: HTMLElement = this.getElement('_textLayer_' + pageIndex);
        if (!textLayer) {
            // tslint:disable-next-line:max-line-length
            textLayer = this.textLayer.addTextLayer(pageIndex, this.getPageWidth(pageIndex), this.getPageHeight(pageIndex), this.getElement('_pageDiv_' + pageIndex));
        }
        if (textLayer && texts && bounds) {
            textLayer.style.display = 'block';
            if (textLayer.childNodes.length === 0) {
                this.textLayer.renderTextContents(pageIndex, texts, bounds, rotation);
            } else {
                this.textLayer.resizeTextContents(pageIndex, texts, bounds, rotation, true);
            }
        }
    }

    private renderPageContainer(pageNumber: number, pageWidth: number, pageHeight: number, topValue: number): void {
        // tslint:disable-next-line:max-line-length
        let pageDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_pageDiv_' + pageNumber, className: 'e-pv-page-div', attrs: { 'tabindex': '0' } });
        if (this.isMixedSizeDocument && this.highestWidth > 0) {
            pageDiv.style.width = (this.highestWidth * this.getZoomFactor()) + 'px';
        } else {
            pageDiv.style.width = pageWidth + 'px';
        }
        pageDiv.style.height = pageHeight + 'px';
        if (this.pdfViewer.enableRtl) {
            pageDiv.style.right = this.updateLeftPosition(pageNumber) + 'px';
        } else {
            pageDiv.style.left = this.updateLeftPosition(pageNumber) + 'px';
        }
        pageDiv.style.top = topValue + 'px';
        this.pageContainer.appendChild(pageDiv);
        this.pageContainer.style.width = this.viewerContainer.clientWidth + 'px';
        this.createWaitingPopup(pageNumber);
        this.orderPageDivElements(pageDiv, pageNumber);
        this.renderPageCanvas(pageDiv, pageWidth, pageHeight, pageNumber, 'block');
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && !this.isThumb) {
            this.updateMobileScrollerPosition();
        }
    }

    private renderPDFInformations(): void {
        if (this.pdfViewer.thumbnailViewModule && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
            this.pdfViewer.thumbnailViewModule.createRequestForThumbnails();
        }
        if (this.pdfViewer.bookmarkViewModule) {
            this.pdfViewer.bookmarkViewModule.createRequestForBookmarks();
        }
        if (this.pdfViewer.annotationModule) {
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.initializeAcccordionContainer();
            }
            if (this.pdfViewer.isCommandPanelOpen) {
                this.pdfViewer.annotation.showCommentsPanel();
            }
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.createRequestForComments();
        }
    }

    private orderPageDivElements(pageDiv: HTMLElement, pageIndex: number): void {
        let nextElement: HTMLElement = this.getElement('_pageDiv_' + (pageIndex + 1));
        if (nextElement) {
            this.pageContainer.insertBefore(pageDiv, nextElement);
        } else {
            this.pageContainer.appendChild(pageDiv);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public renderPageCanvas(pageDiv: HTMLElement, pageWidth: number, pageHeight: number, pageNumber: number, displayMode: string): any {
        if (pageDiv) {
            // tslint:disable-next-line:max-line-length
            let pageCanvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_pageCanvas_' + pageNumber, className: 'e-pv-page-canvas' }) as HTMLCanvasElement;
            pageCanvas.width = pageWidth;
            pageCanvas.height = pageHeight;
            pageCanvas.style.display = displayMode;
            if (this.isMixedSizeDocument && this.highestWidth > 0) {
                pageCanvas.style.marginLeft = 'auto';
                pageCanvas.style.marginRight = 'auto';
            }
            pageDiv.appendChild(pageCanvas);
            if (this.pdfViewer.textSearchModule || this.pdfViewer.textSelectionModule || this.pdfViewer.annotationModule) {
                this.textLayer.addTextLayer(pageNumber, pageWidth, pageHeight, pageDiv);
            }
            if (this.pdfViewer.annotationModule && this.pdfViewer.annotation) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.createAnnotationLayer(pageDiv, pageWidth, pageHeight, pageNumber, displayMode);
            }
            return pageCanvas;
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public applyElementStyles(pageCanvas: any, pageNumber: number): void {
        if (this.isMixedSizeDocument && pageCanvas) {
            let canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageNumber);
            let oldCanvas: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_oldCanvas_' + pageNumber);
            if (pageCanvas && canvasElement && canvasElement.offsetLeft > 0) {
                pageCanvas.style.marginLeft = canvasElement.offsetLeft + 'px';
                pageCanvas.style.marginRight = canvasElement.offsetLeft + 'px';
            } else if (oldCanvas && oldCanvas.offsetLeft > 0) {
                pageCanvas.style.marginLeft = oldCanvas.offsetLeft + 'px';
                pageCanvas.style.marginRight = oldCanvas.offsetLeft + 'px';
            } else {
                pageCanvas.style.marginLeft = 'auto';
                pageCanvas.style.marginRight = 'auto';
            }
        }
    }
    /**
     * @private
     */
    public updateLeftPosition(pageIndex: number): number {
        let leftPosition: number;
        let width: number = this.viewerContainer.getBoundingClientRect().width;
        if (width === 0) {
            width = parseFloat(this.pdfViewer.width.toString());
        }
        // tslint:disable-next-line:max-line-length
        if (this.isMixedSizeDocument && this.highestWidth > 0) {
            leftPosition = (width - (this.highestWidth * this.getZoomFactor())) / 2;
        } else {
            leftPosition = (width - this.getPageWidth(pageIndex)) / 2;
        }
        let isLandscape: boolean = false;
        if (this.pageSize[pageIndex].width > this.pageSize[pageIndex].height) {
            isLandscape = true;
        }
        // tslint:disable-next-line:max-line-length
        if (leftPosition < 0 || (this.pdfViewer.magnificationModule ? ((this.pdfViewer.magnificationModule.isAutoZoom && this.getZoomFactor() < 1) || this.pdfViewer.magnificationModule.fitType === 'fitToWidth') : false)) {
            let leftValue: number = leftPosition;
            if (leftPosition > 0 && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
                leftPosition = leftPosition;
            } else {
                leftPosition = this.pageLeft;
            }
            if ((leftPosition > 0) && this.isMixedSizeDocument) {
                if (leftValue > 0) {
                    leftPosition = leftValue;
                }
            }
        }
        return leftPosition;
    }
    /**
     * @private
     */
    public applyLeftPosition(pageIndex: number): void {
        let leftPosition: number;
        if (this.pageSize[pageIndex]) {
            if (this.isMixedSizeDocument && this.highestWidth > 0) {
                // tslint:disable-next-line:max-line-length
                leftPosition = (this.viewerContainer.getBoundingClientRect().width - (this.highestWidth * this.getZoomFactor())) / 2;
            } else {
                // tslint:disable-next-line:max-line-length
                leftPosition = (this.viewerContainer.getBoundingClientRect().width - this.pageSize[pageIndex].width * this.getZoomFactor()) / 2;
            }
            let isLandscape: boolean = false;
            if (this.pageSize[pageIndex].width > this.pageSize[pageIndex].height) {
                isLandscape = true;
            }
            // tslint:disable-next-line:max-line-length
            if (leftPosition < 0 || (this.pdfViewer.magnificationModule ? ((this.pdfViewer.magnificationModule.isAutoZoom && this.getZoomFactor() < 1) || this.pdfViewer.magnificationModule.fitType === 'fitToWidth') : false)) {
                let leftValue: number = leftPosition;
                leftPosition = this.pageLeft;
                // tslint:disable-next-line:max-line-length
                if ((leftValue > 0) && this.isMixedSizeDocument) {
                    leftPosition = leftValue;
                }
            }
            // tslint:disable-next-line:max-line-length
            let pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            if (pageDiv) {
                if (!this.pdfViewer.enableRtl) {
                    pageDiv.style.left = leftPosition + 'px';
                } else {
                    pageDiv.style.right = leftPosition + 'px';
                }
            }
        }
    }

    private updatePageHeight(viewerHeight: number, toolbarHeight: number): string {
        return ((viewerHeight - toolbarHeight) / viewerHeight) * 100 + '%';
    }
    // tslint:disable-next-line
    private viewerContainerOnScroll = (event: any): void => {
        let proxy: PdfViewerBase = this;
        let scrollposX: number = 0;
        let scrollposY: number = 0;
        if (event.touches && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
            // tslint:disable-next-line
            let ratio: any = (this.viewerContainer.scrollHeight - this.viewerContainer.clientHeight) / (this.viewerContainer.clientHeight - this.toolbarHeight);
            if (this.isThumb) {
                this.ispageMoved = true;
                event.preventDefault();
                this.mobilePageNoContainer.style.display = 'block';
                scrollposX = event.touches[0].pageX - this.scrollX;
                scrollposY = event.touches[0].pageY - this.viewerContainer.offsetTop;
                this.viewerContainer.scrollTop = scrollposY * ratio;
                // tslint:disable-next-line
                let containerValue: any = event.touches[0].pageY;
                // tslint:disable-next-line
                let toolbarHeight: any = this.pdfViewer.toolbarModule ? 0 : 50;
                if (this.viewerContainer.scrollTop !== 0 && ((containerValue) <= (this.viewerContainer.clientHeight - toolbarHeight))) {
                    this.mobileScrollerContainer.style.top = containerValue + 'px';
                }
            } else if (event.touches[0].target.className !== 'e-pv-touch-ellipse') {
                if (!(this.isWebkitMobile && (Browser.isDevice && !this.pdfViewer.enableDesktopMode))) {
                    this.mobilePageNoContainer.style.display = 'none';
                    scrollposY = this.touchClientY - event.touches[0].pageY;
                    scrollposX = this.touchClientX - event.touches[0].pageX;
                    this.viewerContainer.scrollTop = this.viewerContainer.scrollTop + (scrollposY);
                    this.viewerContainer.scrollLeft = this.viewerContainer.scrollLeft + (scrollposX);
                }
                // tslint:disable-next-line
                this.updateMobileScrollerPosition();
                this.touchClientY = event.touches[0].pageY;
                this.touchClientX = event.touches[0].pageX;
            }
        }
        if (this.scrollHoldTimer) {
            clearTimeout(this.scrollHoldTimer);
        }
        let pageIndex: number = this.currentPageNumber;
        this.scrollHoldTimer = null;
        this.contextMenuModule.close();
        let verticalScrollValue: number = this.viewerContainer.scrollTop;
        // tslint:disable-next-line:max-line-length
        for (let i: number = 0; i < this.pageCount; i++) {
            if (this.pageSize[i] != null) {
                let pageHeight: number = this.getPageHeight(i);
                if (pageHeight < 150) {
                    this.pageStopValue = 75;
                } else if (pageHeight >= 150 && pageHeight < 300) {
                    this.pageStopValue = 125;
                } else if (pageHeight >= 300 && pageHeight < 500) {
                    this.pageStopValue = 200;
                } else {
                    this.pageStopValue = 300;
                }
                // tslint:disable-next-line:max-line-length
                if ((verticalScrollValue + this.pageStopValue) <= (this.getPageTop(i) + pageHeight)) {
                    this.currentPageNumber = i + 1;
                    this.pdfViewer.currentPageNumber = i + 1;
                    break;
                }
            }
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.magnificationModule && this.pdfViewer.magnificationModule.fitType === 'fitToPage' && this.currentPageNumber > 0) {
            if (this.pageSize[this.currentPageNumber - 1]) {
                this.viewerContainer.scrollTop = this.pageSize[this.currentPageNumber - 1].top * this.getZoomFactor();
            }
        }
        this.renderElementsVirtualScroll(this.currentPageNumber);
        // tslint:disable-next-line:max-line-length
        if (!this.isViewerMouseDown && !this.getPinchZoomed() && !this.getPinchScrolled() && !this.getPagesPinchZoomed() || this.isViewerMouseWheel) {
            this.pageViewScrollChanged(this.currentPageNumber);
            this.isViewerMouseWheel = false;
        } else {
            this.showPageLoadingIndicator(this.currentPageNumber - 1, false);
        }
        if (this.pdfViewer.toolbarModule) {
            if (!isBlazor()) {
                this.pdfViewer.toolbarModule.updateCurrentPage(this.currentPageNumber);
            }
            this.viewerContainer.setAttribute('aria-labelledby', this.pdfViewer.element.id + '_pageDiv_' + (this.currentPageNumber - 1));
            if (!isBlazor()) {
                if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                    this.pdfViewer.toolbarModule.updateNavigationButtons();
                }
            }
        }
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.mobileSpanContainer.innerHTML = this.currentPageNumber.toString();
            this.mobilecurrentPageContainer.innerHTML = this.currentPageNumber.toString();
        }
        if (pageIndex !== this.currentPageNumber) {
            if (proxy.pdfViewer.thumbnailViewModule && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
                proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.currentPageNumber - 1);
                proxy.pdfViewer.thumbnailViewModule.isThumbnailClicked = false;
            }
            this.pdfViewer.firePageChange(pageIndex);
        }
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.updatePagesForFitPage(this.currentPageNumber - 1);
        }
        let currentPage: HTMLElement = this.getElement('_pageDiv_' + (this.currentPageNumber - 1));
        if (currentPage) {
            currentPage.style.visibility = 'visible';
        }
        if (this.isViewerMouseDown) {
            if (this.getRerenderCanvasCreated() && !this.isPanMode) {
                this.pdfViewer.magnificationModule.clearIntervalTimer();
            }
            // tslint:disable-next-line
            let data: any = this.getStoredData(this.currentPageNumber);
            if (data) {
                this.isDataExits = true;
                this.initiatePageViewScrollChanged();
                this.isDataExits = false;
            } else {
                // tslint:disable-next-line:max-line-length
                let timer: number = this.pdfViewer.scrollSettings.delayPageRequestTimeOnScroll ? this.pdfViewer.scrollSettings.delayPageRequestTimeOnScroll : 100;
                this.scrollHoldTimer = setTimeout(
                    () => { this.initiatePageViewScrollChanged(); }, timer);
            }
        }
        if (this.pdfViewer.annotation && this.navigationPane.commentPanelContainer) {
            this.pdfViewer.annotation.stickyNotesAnnotationModule.updateCommentPanelScrollTop(this.currentPageNumber);
        }
        // tslint:disable-next-line:max-line-length
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && event.touches && event.touches[0].target.className !== 'e-pv-touch-ellipse') {
            setTimeout(
                () => { this.updateMobileScrollerPosition(); }, 500);
        }
    }

    private initiatePageViewScrollChanged(): void {
        if (this.scrollHoldTimer) {
            clearTimeout(this.scrollHoldTimer);
        }
        this.scrollHoldTimer = null;
        if ((this.scrollPosition * this.getZoomFactor()) !== this.viewerContainer.scrollTop) {
            this.scrollPosition = this.viewerContainer.scrollTop;
            this.pageViewScrollChanged(this.currentPageNumber);
        }
    }

    private renderCountIncrement(): void {
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.renderCountIncrement();
        }
    }
    /**
     * @private
     */
    public pageViewScrollChanged(currentPageNumber: number): void {
        if (this.isPanMode) {
            if (this.renderedPagesList.indexOf(currentPageNumber - 1) === -1) {
                this.reRenderedCount = 0;
            }
        } else {
            this.reRenderedCount = 0;
        }
        let currentPageIndex: number = currentPageNumber - 1;
        if (currentPageNumber !== this.previousPage && currentPageNumber <= this.pageCount) {
            let isSkip: boolean = false;
            if (this.isDataExits && !this.getStoredData(currentPageIndex)) {
                isSkip = true;
            }
            if (this.renderedPagesList.indexOf(currentPageIndex) === -1 && !this.getMagnified() && !isSkip) {
                this.createRequestForRender(currentPageIndex);
                this.renderCountIncrement();
            }
        }
        if (!(this.getMagnified() || this.getPagesPinchZoomed())) {
            let previous: number = currentPageIndex - 1;
            let isSkip: boolean = false;
            let canvas: HTMLCanvasElement = this.getElement('_pageCanvas_' + previous) as HTMLCanvasElement;
            if (this.isDataExits && !this.getStoredData(previous)) {
                isSkip = true;
            }
            if (canvas !== null && !isSkip) {
                if (this.renderedPagesList.indexOf(previous) === -1 && !this.getMagnified()) {
                    this.createRequestForRender(previous);
                    this.renderCountIncrement();
                }
            }
            if (this.isMinimumZoom) {
                this.renderPreviousPagesInScroll(previous);
            }
            let next: number = currentPageIndex + 1;
            let pageHeight: number = 0;
            if (next < this.pageCount) {
                pageHeight = this.getPageHeight(next);
                if (this.renderedPagesList.indexOf(next) === -1 && !this.getMagnified() && pageHeight) {
                    this.createRequestForRender(next);
                    this.renderCountIncrement();
                    while (this.viewerContainer.clientHeight > pageHeight) {
                        next = next + 1;
                        if (next < this.pageCount) {
                            this.renderPageElement(next);
                            this.createRequestForRender(next);
                            pageHeight += this.getPageHeight(next);
                            this.renderCountIncrement();
                        } else {
                            break;
                        }
                    }
                }
            }
        }
    }

    private renderPreviousPagesInScroll(pageIndex: number): void {
        let next: number = pageIndex - 1;
        let pageNumber: number = next - 1;
        if (next > 0) {
            if (this.renderedPagesList.indexOf(next) === -1 && !this.getMagnified()) {
                this.createRequestForRender(next);
                this.renderCountIncrement();
            }
            if (pageNumber > 0) {
                if (this.renderedPagesList.indexOf(pageNumber) === -1 && !this.getMagnified()) {
                    this.createRequestForRender(pageNumber);
                    this.renderCountIncrement();
                }
            }
        }
    }

    private downloadDocument(blobUrl: string): void {
        // tslint:disable-next-line
        let Url: any = URL || webkitURL;
        blobUrl = Url.createObjectURL(blobUrl);
        let anchorElement: HTMLElement = createElement('a');
        if (anchorElement.click) {
            (anchorElement as HTMLAnchorElement).href = blobUrl;
            (anchorElement as HTMLAnchorElement).target = '_parent';
            if ('download' in anchorElement) {
                (anchorElement as HTMLAnchorElement).download = this.pdfViewer.downloadFileName;
            }
            (document.body || document.documentElement).appendChild(anchorElement);
            anchorElement.click();
            anchorElement.parentNode.removeChild(anchorElement);
        } else {
            if (window.top === window &&
                blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
                let padCharacter: string = blobUrl.indexOf('?') === -1 ? '?' : '&';
                blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
            }
            window.open(blobUrl, '_parent');
        }
    }

    private downloadExportAnnotationJson(blobUrl: string, isForm?: boolean): void {
        // tslint:disable-next-line
        let Url: any = URL || webkitURL;
        blobUrl = Url.createObjectURL(blobUrl);
        let anchorElement: HTMLElement = createElement('a');
        if (anchorElement.click) {
            (anchorElement as HTMLAnchorElement).href = blobUrl;
            (anchorElement as HTMLAnchorElement).target = '_parent';
            if ('download' in anchorElement) {
                if (this.pdfViewer.exportAnnotationFileName !== null) {
                    (anchorElement as HTMLAnchorElement).download = this.pdfViewer.exportAnnotationFileName.split('.')[0] + '.json';
                } else {
                    (anchorElement as HTMLAnchorElement).download = this.pdfViewer.fileName.split('.')[0] + '.json';
                }
            }
            (document.body || document.documentElement).appendChild(anchorElement);
            anchorElement.click();
            anchorElement.parentNode.removeChild(anchorElement);
            if (isForm) {
                this.pdfViewer.fireFormExportSuccess(blobUrl, (anchorElement as HTMLAnchorElement).download);
            } else {
                this.pdfViewer.fireExportSuccess(blobUrl, (anchorElement as HTMLAnchorElement).download);
            }
        } else {
            if (window.top === window &&
                blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
                let padCharacter: string = blobUrl.indexOf('?') === -1 ? '?' : '&';
                blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
            }
            window.open(blobUrl, '_parent');
            if (isForm) {
                this.pdfViewer.fireFormExportSuccess(blobUrl, this.pdfViewer.fileName.split('.')[0] + '.json');
            } else {
                this.pdfViewer.fireExportSuccess(blobUrl, this.pdfViewer.fileName.split('.')[0] + '.json');
            }
        }
    }

    private downloadExportedXFdfAnnotation(blobUrl: string): void {
        // tslint:disable-next-line
        let Url: any = URL || webkitURL;
        blobUrl = Url.createObjectURL(blobUrl);
        let anchorElement: HTMLElement = createElement('a');
        if (anchorElement.click) {
            (anchorElement as HTMLAnchorElement).href = blobUrl;
            (anchorElement as HTMLAnchorElement).target = '_parent';
            if ('download' in anchorElement) {
                if (this.pdfViewer.exportAnnotationFileName !== null) {
                    (anchorElement as HTMLAnchorElement).download = this.pdfViewer.exportAnnotationFileName.split('.')[0] + '.xfdf';
                } else {
                    (anchorElement as HTMLAnchorElement).download = this.pdfViewer.fileName.split('.')[0] + '.xfdf';
                }
            }
            (document.body || document.documentElement).appendChild(anchorElement);
            anchorElement.click();
            anchorElement.parentNode.removeChild(anchorElement);
            this.pdfViewer.fireExportSuccess(blobUrl, (anchorElement as HTMLAnchorElement).download);
        }
    }
    /**
     * @private
     */
    public exportFormFields(path?: string): void {
        this.createRequestForExportFormfields(false, path);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public importFormFields(source: any): void {
        this.createRequestForImportingFormfields(source);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public createRequestForExportFormfields(isObject?: boolean, path?: string): any {
        let proxy: PdfViewerBase = this;
        let promise: Promise<Blob> = new Promise((resolve: Function, reject: Function) => {
            // tslint:disable-next-line
            let jsonObject: any = proxy.createFormfieldsJsonData();
            proxy.pdfViewer.fireFormExportStarted(jsonObject.pdfAnnotation);
            jsonObject.action = 'ExportFormFields';
            // tslint:disable-next-line
            jsonObject['hashId'] = proxy.hashId;
            // tslint:disable-next-line
            jsonObject['fileName'] = proxy.pdfViewer.fileName;
            if (path && path !== '' && !isObject) {
                // tslint:disable-next-line
                jsonObject['filePath'] = path;
            }
            // tslint:disable-next-line
            jsonObject['elementId'] = this.pdfViewer.element.id;
            // tslint:disable-next-line:max-line-length
            if (proxy.jsonDocumentId) {
                // tslint:disable-next-line
                (jsonObject as any).document = proxy.jsonDocumentId;
            }
            let url: string = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.exportFormFields;
            proxy.exportFormFieldsRequestHandler = new AjaxHandler(this.pdfViewer);
            proxy.exportFormFieldsRequestHandler.url = url;
            proxy.exportFormFieldsRequestHandler.mode = true;
            proxy.exportFormFieldsRequestHandler.responseType = 'text';
            proxy.exportFormFieldsRequestHandler.send(jsonObject);
            // tslint:disable-next-line
            proxy.exportFormFieldsRequestHandler.onSuccess = function (result: any) {
                // tslint:disable-next-line
                let data: any = result.data;
                if (data) {
                    if (data) {
                        if (isObject) {
                            // tslint:disable-next-line
                            let annotationJson: any = decodeURIComponent(escape(atob(data.split(',')[1])));
                            resolve(annotationJson);
                            proxy.pdfViewer.fireFormExportSuccess(annotationJson, proxy.pdfViewer.fileName);
                        } else if (data.split('base64,')[1]) {
                            let blobUrl: string = proxy.createBlobUrl(data.split('base64,')[1], 'application/json');
                            if (Browser.isIE || Browser.info.name === 'edge') {
                                window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.fileName.split('.')[0] + '.json');
                            } else {
                                proxy.downloadExportAnnotationJson(blobUrl, true);
                            }
                        }
                    }
                }
            };
            // tslint:disable-next-line
            proxy.exportFormFieldsRequestHandler.onFailure = function (result: any) {
                proxy.pdfViewer.fireFormExportFailed(jsonObject.pdfAnnotation, result.statusText);
            };
            // tslint:disable-next-line
            proxy.exportFormFieldsRequestHandler.onError = function (result: any) {
                proxy.pdfViewer.fireFormExportFailed(jsonObject.pdfAnnotation, result.statusText);
            };

        });
        if (isObject) {
            return promise;
        } else {
            return true;
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public createRequestForImportingFormfields(source: any): void {
        let proxy: PdfViewerBase = this;
        // tslint:disable-next-line
        let jsonObject: any = {};
        if (typeof source === 'object') {
            jsonObject.data = JSON.stringify(source);
        } else {
            jsonObject.data = source;
            // tslint:disable-next-line
            jsonObject['fileName'] = proxy.pdfViewer.fileName;
        }
        proxy.pdfViewer.fireFormImportStarted(source);
        // tslint:disable-next-line
        jsonObject.action = 'ImportFormFields';
        // tslint:disable-next-line
        jsonObject['hashId'] = proxy.hashId;
        // tslint:disable-next-line
        jsonObject['elementId'] = this.pdfViewer.element.id;
        // tslint:disable-next-line:max-line-length
        if (proxy.jsonDocumentId) {
            // tslint:disable-next-line
            (jsonObject as any).document = proxy.jsonDocumentId;
        }
        let url: string = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.importFormFields;
        proxy.importFormFieldsRequestHandler = new AjaxHandler(this.pdfViewer);
        proxy.importFormFieldsRequestHandler.url = url;
        proxy.importFormFieldsRequestHandler.mode = true;
        proxy.importFormFieldsRequestHandler.responseType = 'text';
        proxy.importFormFieldsRequestHandler.send(jsonObject);
        // tslint:disable-next-line
        proxy.importFormFieldsRequestHandler.onSuccess = function (result: any) {
            // tslint:disable-next-line
            let data: any = result.data;
            if (data && data !== 'null') {
                if (typeof data !== 'object') {
                    try {
                        data = JSON.parse(data);
                        if (typeof data !== 'object') {
                            proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.importFormFields);
                            proxy.pdfViewer.fireFormImportFailed(source, result.statusText);
                            data = null;
                        }
                    } catch (error) {
                        proxy.pdfViewer.fireFormImportFailed(source, proxy.pdfViewer.localeObj.getConstant('File not found'));
                        proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('File not found'));
                        proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.importFormFields);
                        data = null;
                    }

                }
                proxy.pdfViewer.fireFormImportSuccess(source);
                window.sessionStorage.removeItem(this.documentId + '_formfields');
                proxy.saveFormfieldsData(data);
                for (let i: number = 0; i < proxy.renderedPagesList.length; i++) {
                    this.pdfViewer.formFieldsModule.renderFormFields(i);
                }
            } else {
                proxy.pdfViewer.fireFormImportFailed(source, result.statusText);
                proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('File not found'));
                }
            };
        // tslint:disable-next-line
        proxy.importFormFieldsRequestHandler.onFailure = function (result: any) {
            proxy.pdfViewer.fireFormImportFailed(source, result.statusText);
        };
        // tslint:disable-next-line
        proxy.importFormFieldsRequestHandler.onError = function (result: any) {
            proxy.pdfViewer.fireFormImportFailed(source, result.statusText);
        };
    }

    /**
     * @public
     */
    // tslint:disable-next-line
    public createFormfieldsJsonData(): any {
        // tslint:disable-next-line
        let jsonObject: any = {};
        if (this.pdfViewer.formFieldsModule) {
            let fieldsData: string = this.pdfViewer.formFieldsModule.downloadFormFieldsData();
            // tslint:disable-next-line
            jsonObject['fieldsData'] = fieldsData;
        }
        return jsonObject;
    }

    // tslint:disable-next-line
    private constructJsonDownload(): any {
        // tslint:disable-next-line
        let jsonObject: any = { hashId: this.hashId };
        if (this.jsonDocumentId) {
            // tslint:disable-next-line
            (jsonObject as any).documentId = this.jsonDocumentId;
        }
        this.importPageList = [];
        if (this.pdfViewer.annotationModule) {
            this.saveImportedAnnotations();
        }
        if (this.isTextMarkupAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            let textMarkupAnnotationCollection: string = this.pdfViewer.annotationModule.textMarkupAnnotationModule.saveTextMarkupAnnotations();
            // tslint:disable-next-line
            jsonObject['textMarkupAnnotations'] = textMarkupAnnotationCollection;
        }
        if (this.isShapeAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            let shapeAnnotations: string = this.pdfViewer.annotationModule.shapeAnnotationModule.saveShapeAnnotations();
            // tslint:disable-next-line
            jsonObject['shapeAnnotations'] = shapeAnnotations;
        }
        if (this.isCalibrateAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            let calibrateAnnotations: string = this.pdfViewer.annotationModule.measureAnnotationModule.saveMeasureShapeAnnotations();
            // tslint:disable-next-line
            jsonObject['measureShapeAnnotations'] = calibrateAnnotations;
        }
        if (this.isStampAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            let stampAnnotationCollection: string = this.pdfViewer.annotationModule.stampAnnotationModule.saveStampAnnotations();
            // tslint:disable-next-line
            jsonObject['stampAnnotations'] = stampAnnotationCollection;
        }
        if (this.isCommentAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            let stickyAnnotationCollection: string = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.saveStickyAnnotations();
            // tslint:disable-next-line
            jsonObject['stickyNotesAnnotation'] = stickyAnnotationCollection;
        }
        if (this.isImportAction) {
            let importList: string = JSON.stringify(this.importPageList);
            // tslint:disable-next-line
            jsonObject['importPageList'] = importList;
        }
        if (this.pdfViewer.formFieldsModule) {
            let fieldsData: string = this.pdfViewer.formFieldsModule.downloadFormFieldsData();
            // tslint:disable-next-line
            jsonObject['fieldsData'] = fieldsData;
        }
        let signatureData: string = this.signatureModule.saveSignature();
        // tslint:disable-next-line
        jsonObject['signatureData'] = signatureData;
        if (this.pdfViewer.isSignatureEditable) {
            // tslint:disable-next-line
            jsonObject['isSignatureEdited'] = this.pdfViewer.isSignatureEditable;
        }
        if (this.isFreeTextAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            let freeTextAnnotationCollection: string = this.pdfViewer.annotationModule.freeTextAnnotationModule.saveFreeTextAnnotations();
            // tslint:disable-next-line
            jsonObject['freeTextAnnotation'] = freeTextAnnotationCollection;
        }
        if (this.isInkAnnotationModule()) {
            let inkSignatureData: string = this.pdfViewer.annotationModule.inkAnnotationModule.saveInkSignature();
            // tslint:disable-next-line
            jsonObject['inkSignatureData'] = inkSignatureData;
        }
        // tslint:disable-next-line
        jsonObject['action'] = 'Download';
        // tslint:disable-next-line
        jsonObject['elementId'] = this.pdfViewer.element.id;
        return jsonObject;
    }
    /**
     * @private
     */
    public isFreeTextAnnotationModule(): boolean {
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.freeTextAnnotationModule) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    // tslint:disable-next-line
    private createRequestForDownload(): void {
        let proxy: PdfViewerBase = this;
        proxy.pdfViewer.fireDownloadStart(proxy.pdfViewer.downloadFileName);
        // tslint:disable-next-line
        let jsonObject: any = this.constructJsonDownload();
        this.dowonloadRequestHandler = new AjaxHandler(this.pdfViewer);
        this.dowonloadRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.download;
        this.dowonloadRequestHandler.responseType = 'text';
        if (this.validateForm && this.pdfViewer.enableFormFieldsValidation) {
            this.pdfViewer.fireValidatedFailed(proxy.pdfViewer.serverActionSettings.download);
            this.validateForm = false;
        } else {
            this.dowonloadRequestHandler.send(jsonObject);
        }
        // tslint:disable-next-line
        this.dowonloadRequestHandler.onSuccess = function (result: any) {
            // tslint:disable-next-line
            let data: any = result.data;
            if (data) {
                if (typeof data !== 'object' && data.indexOf('data:application/pdf') === -1) {
                    proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.download);
                    data = null;
                }
                if (typeof data === 'object') {
                    data = JSON.parse(data);
                }
                if (data) {
                    let blobUrl: string = proxy.createBlobUrl(data.split('base64,')[1], 'application/pdf');
                    if (Browser.isIE || Browser.info.name === 'edge') {
                        window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.downloadFileName);
                    } else {
                        proxy.downloadDocument(blobUrl);
                    }
                    proxy.pdfViewer.fireDownloadEnd(proxy.pdfViewer.downloadFileName, data);
                }
                proxy.updateDocumentAnnotationCollections();
            } else {
                proxy.pdfViewer.fireDownloadEnd(proxy.pdfViewer.downloadFileName, 'PDF Document saved in server side successfully');
            }
        };
        // tslint:disable-next-line
        this.dowonloadRequestHandler.onFailure = function (result: any) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
        };
        // tslint:disable-next-line
        this.dowonloadRequestHandler.onError = function (result: any) {
            proxy.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
        };
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public getTileCount(pageWidth: any): number {
        if (pageWidth && typeof pageWidth === 'number') {
            let defaultWidth: number = 816;
            let tileCount: number = 1;
            if (this.getZoomFactor() > 2 && pageWidth <= 1200) {
                tileCount = 2;
            } else {
                tileCount = pageWidth / defaultWidth;
            }
            // tslint:disable-next-line:radix
            let tileValue: number = parseInt(tileCount.toFixed());
            if (tileValue <= 0) {
                return 1;
            } else {
                if (this.pdfViewer.tileRenderingSettings.enableTileRendering) {
                    return tileValue;
                } else {
                    return 1;
                }
            }
        } else {
            return 1;
        }
    }

    private createRequestForRender(pageIndex: number): void {
        let proxy: PdfViewerBase = this;
        let canvas: HTMLElement = proxy.getElement('_pageCanvas_' + pageIndex);
        let oldCanvas: HTMLElement = proxy.getElement('_oldCanvas_' + pageIndex);
        if (this.pageSize && this.pageSize[pageIndex]) {
            let pageWidth: number = this.pageSize[pageIndex].width;
            let pageHeight: number = this.pageSize[pageIndex].height;
            let tilecanvas: HTMLCanvasElement = this.getElement('_pageCanvas_' + pageIndex) as HTMLCanvasElement;
            // tslint:disable-next-line
            let viewPortWidth: any = 1200; // On diving the value greater than 1200 we will get the tile count as 2.
            // tslint:disable-next-line
            let viewPortHeight: any = proxy.pdfViewer.element.clientHeight > 0 ? proxy.pdfViewer.element.clientHeight : proxy.pdfViewer.element.style.height;
            // tslint:disable-next-line:radix
            viewPortWidth = parseInt(viewPortWidth);
            // tslint:disable-next-line:radix
            viewPortHeight = parseInt(viewPortHeight);
            let noTileX: number;
            let noTileY: number;
            let tileCount: number = this.getTileCount(pageWidth);
            if (canvas) {
                if (!isNaN(parseFloat(canvas.style.width)) || oldCanvas) {
                    if (proxy.isInitialLoaded) {
                        proxy.showPageLoadingIndicator(pageIndex, false);
                    }
                }
                // tslint:disable-next-line
                let data: any = proxy.getStoredData(pageIndex);
                let isPageRequestSent: boolean = this.pageRequestSent(pageIndex);
                noTileX = noTileY = tileCount;
                let tileSettings: TileRenderingSettingsModel =  proxy.pdfViewer.tileRenderingSettings;
                if (tileSettings.enableTileRendering && tileSettings.x > 0 && tileSettings.y > 0) {
                    if ((viewPortWidth < pageWidth || this.getZoomFactor() > 2)) {
                        noTileX = tileSettings.x;
                        noTileY = tileSettings.y;
                    }
                }
                proxy.tileRequestCount = noTileX * noTileY;
                if (data && (viewPortWidth < pageWidth || this.getZoomFactor() > 2) && tileSettings.enableTileRendering) {
                    for (let k: number = 0; k < noTileX; k++) {
                        for (let l: number = 0; l < noTileY; l++) {
                            if (k === 0 && l === 0) {
                                continue;
                            }
                            let zoomFactor: number = this.retrieveCurrentZoomFactor();
                            let data: string = JSON.parse(this.getWindowSessionStorageTile(pageIndex, k, l, zoomFactor));
                            if (!data) {
                                window.sessionStorage.removeItem(this.documentId + '_' + pageIndex + '_' + zoomFactor);
                                data = null;
                            }
                        }
                    }
                }
                if (data && data.uniqueId === proxy.documentId) {
                    canvas.style.backgroundColor = '#fff';
                    if ((proxy.pdfViewer.magnification && proxy.pdfViewer.magnification.isPinchZoomed) || !this.pageSize[pageIndex]) {
                        return;
                    }
                    let zoomFactor: number = this.retrieveCurrentZoomFactor();
                    if (zoomFactor > 2 && pageWidth <= 1200) {
                        viewPortWidth = 700;
                    } else {
                        viewPortWidth = 1200;
                    }
                    if (!proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                        viewPortWidth = 1200;
                    }
                    if ((viewPortWidth >= pageWidth) || !proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                        proxy.renderPage(data, pageIndex);
                    } else {
                        proxy.isTileImageRendered = true;
                        proxy.tileRenderCount = 0;
                        proxy.tileRenderPage(data, pageIndex);
                        for (let k: number = 0; k < noTileX; k++) {
                            for (let l: number = 0; l < noTileY; l++) {
                                if (k === 0 && l === 0) {
                                    continue;
                                }
                                let zoomFactor: number = this.retrieveCurrentZoomFactor();
                                let data: string = JSON.parse(this.getWindowSessionStorageTile(pageIndex, k, l, zoomFactor));
                                if (data) {
                                    proxy.tileRenderPage(data, pageIndex);
                                }
                            }
                        }
                    }
                    data = null;
                } else if (!isPageRequestSent) {
                    if (this.getPagesPinchZoomed()) {
                        proxy.showPageLoadingIndicator(pageIndex, false);
                    } else {
                        proxy.showPageLoadingIndicator(pageIndex, true);
                    }
                    if (proxy.getPagesZoomed()) {
                        if (proxy.isInitialLoaded) {
                            proxy.showPageLoadingIndicator(pageIndex, false);
                        }
                    }
                    if (proxy.pdfViewer.magnification && proxy.pdfViewer.magnification.isPinchZoomed) {
                        return;
                    }
                    if (!proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                        noTileX = 1;
                        noTileY = 1;
                    }
                    proxy.tileRenderCount = 0;
                    proxy.isTileImageRendered = true;
                    for (let x: number = 0; x < noTileX; x++) {
                        for (let y: number = 0; y < noTileY; y++) {
                            let jsonObject: object;
                            let zoomFactor: number = this.retrieveCurrentZoomFactor();
                            if (zoomFactor > 2 && pageWidth <= 1200) {
                                viewPortWidth = 700;
                            } else {
                                viewPortWidth = 1200;
                            }
                            if (!proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                                viewPortWidth = 1200;
                            }
                            // tslint:disable-next-line:max-line-length
                            jsonObject = {
                                xCoordinate: x, yCoordinate: y, viewPortWidth: viewPortWidth, viewPortHeight: viewPortHeight,
                                pageNumber: pageIndex, hashId: proxy.hashId, tilecount: tileCount, tileXCount: noTileX, tileYCount: noTileY,
                               // tslint:disable-next-line:max-line-length
                                zoomFactor: zoomFactor, action: 'RenderPdfPages', uniqueId: this.documentId, elementId: proxy.pdfViewer.element.id
                            };
                            if (this.jsonDocumentId) {
                                // tslint:disable-next-line
                                (jsonObject as any).documentId = this.jsonDocumentId;
                            }
                            proxy.pageRequestHandler = new AjaxHandler(this.pdfViewer);
                            // tslint:disable-next-line:max-line-length
                            proxy.pageRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.renderPages;
                            proxy.pageRequestHandler.responseType = 'json';
                            proxy.pageRequestHandler.send(jsonObject);
                            proxy.requestLists.push(proxy.documentId + '_' + pageIndex + '_' + zoomFactor);
                            // tslint:disable-next-line
                            proxy.pageRequestHandler.onSuccess = function (result: any) {
                                // tslint:disable-next-line:max-line-length
                                if ((proxy.pdfViewer.magnification && proxy.pdfViewer.magnification.isPinchZoomed) || !proxy.pageSize[pageIndex]) {
                                    return;
                                }
                                // tslint:disable-next-line
                                let data: any = result.data;
                                if (data) {
                                    if (typeof data !== 'object') {
                                        try {
                                            data = JSON.parse(data);
                                        } catch (error) {
                                            proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.renderPages);
                                            data = null;
                                        }
                                    }
                                }
                                if (data) {
                                    while (typeof data !== 'object') {
                                        data = JSON.parse(data);
                                    }
                                    if (data.image && data.uniqueId === proxy.documentId) {
                                        let pageNumber: number = (data.pageNumber !== undefined) ? data.pageNumber : pageIndex;
                                        if ((viewPortWidth >= pageWidth) || !proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                                            proxy.storeWinData(data, pageNumber);
                                        } else {
                                            proxy.storeWinData(data, pageNumber, data.tileX, data.tileY);
                                        }
                                        if ((viewPortWidth >= pageWidth) || !proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                                            proxy.renderPage(data, pageNumber);
                                        } else {
                                            proxy.tileRenderPage(data, pageNumber);
                                        }
                                    }
                                }
                            };
                            // tslint:disable-next-line
                            this.pageRequestHandler.onFailure = function (result: any) {
                                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.renderPages);
                            };
                            // tslint:disable-next-line
                            this.pageRequestHandler.onError = function (result: any) {
                                proxy.openNotificationPopup();
                                // tslint:disable-next-line:max-line-length
                                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.renderPages);
                            };
                        }
                    }
                }
                proxy.renderedPagesList.push(pageIndex);
            }
        }
    }

    private pageRequestSent(pageIndex: number): boolean {
        let zoomFactor: number = this.retrieveCurrentZoomFactor();
        let currentString: string = this.documentId + '_' + pageIndex + '_' + zoomFactor;
        if (this.requestLists && this.requestLists.indexOf(currentString) > -1) {
            return true;
        }
        return false;
    }

    /**
     * @private
     */
    public onControlError(status: number, errorMessage: string, action: string): void {
        this.openNotificationPopup();
        this.pdfViewer.fireAjaxRequestFailed(status, errorMessage, action);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public getStoredData(pageIndex: number): any {
        let zoomFactor: number = this.retrieveCurrentZoomFactor();
        // tslint:disable-next-line
        let storedData: any = this.getWindowSessionStorage(pageIndex, zoomFactor) ? this.getWindowSessionStorage(pageIndex, zoomFactor) : this.getPinchZoomPage(pageIndex);
        // tslint:disable-next-line
        let data: any = null;
        if (storedData) {
            // tslint:disable-next-line
            data = storedData;
            if (!this.isPinchZoomStorage) {
                data = JSON.parse(storedData);
            }
            this.isPinchZoomStorage = false;
        }
        return data;
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public storeWinData(data: any, pageIndex: number, tileX?: number, tileY?: number): void {
        // tslint:disable-next-line
        let blobObj: string = this.createBlobUrl(data['image'].split('base64,')[1], 'image/png');
        // tslint:disable-next-line
        let Url: any = URL || webkitURL;
        let blobUrl: string = Url.createObjectURL(blobObj);
        // tslint:disable-next-line
        let storeObject: any;
        if (isNaN(tileX) && isNaN(tileY)) {
            storeObject = {
                // tslint:disable-next-line
                image: blobUrl, transformationMatrix: data['transformationMatrix'], hyperlinks: data['hyperlinks'], hyperlinkBounds: data['hyperlinkBounds'], linkAnnotation: data['linkAnnotation'], linkPage: data['linkPage'], annotationLocation: data['annotationLocation'],
                // tslint:disable-next-line
                textContent: data['textContent'], textBounds: data['textBounds'], pageText: data['pageText'], rotation: data['rotation'], scaleFactor: data['scaleFactor'], uniqueId: data['uniqueId'], zoomFactor : data['zoomFactor']
            };
            if (this.pageSize[pageIndex]) {
                // tslint:disable-next-line
                this.pageSize[pageIndex].rotation = parseFloat(data['rotation']);
            }
            // tslint:disable-next-line
            this.textLayer.characterBound[pageIndex] = data['characterBounds'];
        } else {
            storeObject = {
                // tslint:disable-next-line
                image: blobUrl, transformationMatrix: data['transformationMatrix'], tileX: tileX, tileY: tileY, zoomFactor : data['zoomFactor']
            };
        }
        // tslint:disable-next-line
        let viewPortWidth: any = 816;
        let pageWidth: number = 0;
        if (this.pageSize[pageIndex]) {
            pageWidth = this.pageSize[pageIndex].width;
        }
        this.manageSessionStorage(pageIndex, storeObject, tileX, tileY);
    }

    /**
     * @private
     */
    public setCustomAjaxHeaders(request: XMLHttpRequest): void {
        for (let i: number = 0; i < this.pdfViewer.ajaxRequestSettings.ajaxHeaders.length; i++) {
            // tslint:disable-next-line:max-line-length
            request.setRequestHeader(this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerName, this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerValue);
        }
    }

    private getPinchZoomPage(pageIndex: number): object {
        // tslint:disable-next-line
        for (let key in this.pinchZoomStorage) {
            if (this.pinchZoomStorage.hasOwnProperty(key)) {
                if (this.pinchZoomStorage[key].index === pageIndex) {
                    this.isPinchZoomStorage = true;
                    return this.pinchZoomStorage[key].pinchZoomStorage;
                }
            }
        }
        return null;
    }

    private getWindowSessionStorage(pageIndex: number, zoomFactor: number): string {
        return window.sessionStorage.getItem(this.documentId + '_' + pageIndex + '_' + zoomFactor);
    }

    private getWindowSessionStorageTile(pageIndex: number, tileX: number, tileY: number, zoomFactor: number): string {
        return window.sessionStorage.getItem(this.documentId + '_' + pageIndex + '_' + tileX + '_' + tileY + '_' + zoomFactor);
    }

    private retrieveCurrentZoomFactor(): number {
        let zoomFactor: number = this.getZoomFactor();
        if (this.pdfViewer.enableZoomOptimization) {
            if ((zoomFactor) <= 1) {
                zoomFactor = 1;
            } else if ((zoomFactor) > 1 && zoomFactor <= 2) {
                zoomFactor = 2;
            } else if ((zoomFactor) > 2 && zoomFactor <= 3) {
                zoomFactor = 3;
            } else if ((zoomFactor) > 3 && zoomFactor <= 4) {
                zoomFactor = 4;
            }
            return zoomFactor;
        } else {
            if (zoomFactor <= 0) {
                zoomFactor = 1;
            }
            return zoomFactor;
        }
    }

    // tslint:disable-next-line
    private manageSessionStorage(pageIndex: number, storeObject: any, tileX?: number, tileY?: number): void {
        // tslint:disable-next-line
        let sessionSize: any =  Math.round(JSON.stringify(window.sessionStorage).length / 1024);
        let maxSessionSize: number = 5000;
        if (sessionSize >= maxSessionSize) {
            if (!this.isStorageExceed) {
                // tslint:disable-next-line
                let annotationList: any = [];
                for (let i: number = 0; i < window.sessionStorage.length; i++) {
                    if (window.sessionStorage.key(i) && window.sessionStorage.key(i).split('_')[3]) {
                        if (window.sessionStorage.key(i).split('_')[3] === 'annotations') {
                            // tslint:disable-next-line:max-line-length
                            this.annotationStorage[window.sessionStorage.key(i)] = window.sessionStorage.getItem(window.sessionStorage.key(i));
                            annotationList.push(window.sessionStorage.key(i));
                        }
                    }
                }
                if (annotationList) {
                    for (let i: number = 0; i < annotationList.length; i++) {
                        window.sessionStorage.removeItem(annotationList[i]);
                    }
                }
            }
            this.isStorageExceed = true;
            sessionSize =  Math.round(JSON.stringify(window.sessionStorage).length / 1024);
            if (sessionSize >= 5000) {
                let storageLength: number = window.sessionStorage.length;
                if (storageLength > 200) {
                    storageLength = 200;
                }
                for (let i: number = 0; i < storageLength; i++) {
                    if (window.sessionStorage.key(i) && window.sessionStorage.key(i).split('_')[3]) {
                        if (window.sessionStorage.key(i).split('_')[3] !== 'annotations') {
                            window.sessionStorage.removeItem(window.sessionStorage.key(i));
                        }
                    }
                }
            }
        }
        let zoomFactor: number = this.retrieveCurrentZoomFactor();
        if (isNaN(tileX) && isNaN(tileY)) {
            // tslint:disable-next-line:max-line-length
            window.sessionStorage.setItem(this.documentId + '_' + pageIndex + '_' + zoomFactor, JSON.stringify(storeObject));
            this.sessionStorage.push(this.documentId + '_' + pageIndex + '_' + zoomFactor);
        } else {
            this.sessionStorage.push(this.documentId + '_' + pageIndex + '_' + tileX + '_' + tileY + '_' + zoomFactor);
            // tslint:disable-next-line:max-line-length
            window.sessionStorage.setItem(this.documentId + '_' + pageIndex + '_' + tileX + '_' + tileY + '_' + zoomFactor, JSON.stringify(storeObject));
        }
    }

    private createBlobUrl(base64String: string, contentType: string): string {
        let sliceSize: number = 512;
        let byteCharacters: string = atob(base64String);
        // tslint:disable-next-line
        let byteArrays: any = [];
        for (let offset: number = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice: string = byteCharacters.slice(offset, offset + sliceSize);
            // tslint:disable-next-line
            let byteNumbers: any = new Array(slice.length);
            for (let i: number = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            // tslint:disable-next-line
            let byteArray: any = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        // tslint:disable-next-line
        let blob: any = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    private getRandomNumber(): string {
        // tslint:disable-next-line
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: any): string {
            // tslint:disable-next-line
            let random: any = Math.random() * 16 | 0, v = c == 'x' ? random : (random & 0x3 | 0x8);
            return random.toString(16);
        });
    }

    private createGUID(): string {
        // tslint:disable-next-line:max-line-length
        return 'Sync_PdfViewer_' + this.getRandomNumber();
    }

    /**
     * @private
     */
    public isClickedOnScrollBar(event: MouseEvent, isNeedToSet?: boolean): boolean {
        let isScrollBar: boolean = false;
        if (isNeedToSet) {
            this.setScrollDownValue(event.type, false);
        }
        // tslint:disable-next-line:max-line-length
        if ((this.viewerContainer.clientWidth + this.viewerContainer.offsetLeft) < event.clientX && event.clientX < (this.viewerContainer.offsetWidth + this.viewerContainer.offsetLeft)) {
            isScrollBar = true;
            if (isNeedToSet) {
                this.setScrollDownValue(event.type, true);
            }
        }
        // tslint:disable-next-line:max-line-length
        if ((this.viewerContainer.clientHeight + this.viewerContainer.offsetTop) < event.clientY && event.clientY < (this.viewerContainer.offsetHeight + this.viewerContainer.offsetTop)) {
            isScrollBar = true;
            if (isNeedToSet) {
                this.setScrollDownValue(event.type, true);
            }
        }
        return isScrollBar;
    }

    private setScrollDownValue(eventType: string, boolValue: boolean): void {
        if (eventType === 'mousedown') {
            this.isScrollbarMouseDown = boolValue;
        }
    }

    /**
     * @private
     */
    public disableTextSelectionMode(): void {
        this.isTextSelectionDisabled = true;
        this.viewerContainer.classList.remove('e-enable-text-selection');
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        this.viewerContainer.classList.add('e-disable-text-selection');
        this.viewerContainer.addEventListener('selectstart', () => { return false; });
    }

    /**
     * @private
     */
    public getElement(idString: string): HTMLElement {
        return document.getElementById(this.pdfViewer.element.id + idString);
    }
    /**
     * @private
     */
    public getPageWidth(pageIndex: number): number {
        if (this.pageSize[pageIndex]) {
            return this.pageSize[pageIndex].width * this.getZoomFactor();
        } else {
            return 0;
        }
    }
    /**
     * @private
     */
    public getPageHeight(pageIndex: number): number {
        if (this.pageSize[pageIndex]) {
            return this.pageSize[pageIndex].height * this.getZoomFactor();
        } else {
            return 0;
        }
    }
    /**
     * @private
     */
    public getPageTop(pageIndex: number): number {
        if (this.pageSize[pageIndex]) {
            return this.pageSize[pageIndex].top * this.getZoomFactor();
        } else {
            return 0;
        }
    }

    private isAnnotationToolbarHidden(): boolean {
        if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
            return this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden;
        } else {
            return true;
        }
    }

    /**
     * @private
     */
    public getTextMarkupAnnotationMode(): boolean {
        if (this.isTextMarkupAnnotationModule()) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode;
        } else {
            return false;
        }
    }

    private isNewFreeTextAnnotation(): boolean {
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule) {
            if (!this.pdfViewer.annotationModule.freeTextAnnotationModule.isNewFreeTextAnnot) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    private getCurrentTextMarkupAnnotation(): boolean {
        if (this.isTextMarkupAnnotationModule()) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * @private
     */
    public getSelectTextMarkupCurrentPage(): number {
        if (this.isTextMarkupAnnotationModule()) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
        } else {
            return null;
        }
    }

    /**
     * @private
     */
    public getAnnotationToolStatus(): boolean {
        if (this.pdfViewer.toolbarModule) {
            return this.pdfViewer.toolbarModule.annotationToolbarModule.isAnnotationButtonsEnabled();
        } else {
            return false;
        }
    }

    /**
     * @private
     */
    public getPopupNoteVisibleStatus(): boolean {
        if (this.pdfViewer.annotationModule) {
            return this.pdfViewer.annotationModule.isPopupNoteVisible;
        } else {
            return false;
        }
    }

    /**
     * @private
     */
    public isTextMarkupAnnotationModule(): TextMarkupAnnotation {
        if (this.pdfViewer.annotationModule) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule;
        } else {
            return null;
        }
    }

    /**
     * @private
     */
    public isShapeAnnotationModule(): boolean {
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.shapeAnnotationModule) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * @private
     */
    public isCalibrateAnnotationModule(): boolean {
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.measureAnnotationModule) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * @private
     */
    public isStampAnnotationModule(): boolean {
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.stampAnnotationModule) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    /**
     * @private
     */
    public isInkAnnotationModule(): boolean {
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.inkAnnotationModule) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    /**
     * @private
     */
    public isCommentAnnotationModule(): boolean {
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.stickyNotesAnnotationModule) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * @private
     */
    public isShapeBasedAnnotationsEnabled(): boolean {
        // tslint:disable-next-line:max-line-length
        if (this.isShapeAnnotationModule() || this.isCalibrateAnnotationModule() || this.isStampAnnotationModule() || this.isCommentAnnotationModule()) {
            return true;
        } else {
            return false;
        }
    }

    /** @private */
    public getMousePosition(e: MouseEvent | PointerEvent | TouchEvent): PointModel {
        let touchArg: TouchEvent;
        let offsetX: number;
        let offsetY: number;
        if (e.type.indexOf('touch') !== -1) {
            touchArg = <TouchEvent & PointerEvent>e;
            if (this.pdfViewer.annotation) {
                let pageDiv: HTMLElement = this.getElement('_pageDiv_' + this.pdfViewer.annotation.getEventPageNumber(e));
                if (pageDiv) {
                    let pageCurrentRect: ClientRect =
                        pageDiv.getBoundingClientRect();

                    offsetX = touchArg.changedTouches[0].clientX - pageCurrentRect.left;
                    offsetY = touchArg.changedTouches[0].clientY - pageCurrentRect.top;
                }
            }
        } else {
            if ((e.target as HTMLElement).classList.contains('e-pv-hyperlink')) {
                offsetX = (e as PointerEvent).offsetX + (e.target as HTMLElement).offsetLeft;
                offsetY = (e as PointerEvent).offsetY + (e.target as HTMLElement).offsetTop;
            } else if ((e.target as HTMLElement).classList.contains('e-pv-text') && (e.target as HTMLElement).parentElement) {
                let targetParentRect: ClientRect = (e.target as HTMLElement).parentElement.getBoundingClientRect();
                offsetX = (e as PointerEvent).clientX - targetParentRect.left ;
                offsetY =  (e as PointerEvent).clientY - targetParentRect.top;
            } else {
                offsetX = (e as PointerEvent).offsetX;
                offsetY = (e as PointerEvent).offsetY;
            }
        }
        return { x: offsetX, y: offsetY };
    }
    private getMouseEventArgs(position: PointModel, args: MouseEventArgs, evt: MouseEvent | TouchEvent, source?: IElement): MouseEventArgs {
        args.position = position;
        let obj: IElement;
        let objects: IElement[];
        if (!source) {
            if (this.action === 'Drag' || this.action === 'ConnectorSourceEnd' || this.action === 'SegmentEnd' ||
                this.action === 'OrthoThumb' || this.action === 'BezierSourceThumb' || this.action === 'BezierTargetThumb' ||
                this.action === 'ConnectorTargetEnd' || this.action.indexOf('Rotate') !== -1 || this.action.indexOf('Resize') !== -1) {
                obj = this.pdfViewer.selectedItems as IElement;
                if (this.action === 'Drag' && obj && this.pdfViewer.selectedItems.annotations.length > 0) {
                    obj = findActiveElement(evt, this, this.pdfViewer);
                }
            } else {
                obj = findActiveElement(evt, this, this.pdfViewer);
            }
        } else {
            //   objects = this.diagram.findObjectsUnderMouse(this.currentPosition, source);
            obj = findActiveElement(evt, this, this.pdfViewer);
        }
        let wrapper: DrawingElement;
        if (obj) {
            wrapper = obj.wrapper;
        }
        if (!source) {
            args.source = obj;
            args.sourceWrapper = wrapper;
        } else {
            args.target = obj;
            args.targetWrapper = wrapper;
        }
        args.actualObject = this.eventArgs.actualObject;
        //args.startTouches = this.touchStartList;
        //args.moveTouches = this.touchMoveList;
        return args;
    }
    /**
     * @private
     */
    public findToolToActivate(obj: PdfAnnotationBaseModel, position: PointModel): Actions | string {
        position = { x: position.x / this.getZoomFactor(), y: position.y / this.getZoomFactor() };

        let element: DrawingElement = this.pdfViewer.selectedItems.wrapper;
        obj = obj;
        if (element && obj) {
            let selectorBnds: Rect = element.bounds; //let handle: SelectorModel = diagram.selectedItems;
            let paddedBounds: Rect = new Rect(selectorBnds.x, selectorBnds.y, selectorBnds.width, selectorBnds.height);
            if (obj.shapeAnnotationType === 'Line' || obj.shapeAnnotationType === 'LineWidthArrowHead' ||
                obj.shapeAnnotationType === 'Distance' || obj.shapeAnnotationType === 'Polygon') {
                let conn: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
                if (conn) {
                    for (let i: number = 0; i < conn.vertexPoints.length; i++) {
                        if (contains(position, conn.vertexPoints[i], 10) && conn.leaderHeight !== 0 ) {
                            return 'ConnectorSegmentPoint_' + i;
                        }
                    }
                }
            }

            if (obj.shapeAnnotationType === 'Distance') {
                let leaderCount: number = 0;
                let newPoint1: PointModel;
                if (obj && obj.wrapper) {
                    for (let i: number = 0; i < obj.wrapper.children.length; i++) {
                        let elementAngle: number = Point.findAngle(obj.sourcePoint, obj.targetPoint);
                        // tslint:disable-next-line
                        let segment: any = obj.wrapper.children[i];
                        if (segment.id.indexOf('leader') > -1) {
                            let centerPoint: PointModel = obj.wrapper.children[0].bounds.center;
                            if (leaderCount === 0) {
                                newPoint1 = { x: obj.sourcePoint.x, y: obj.sourcePoint.y - obj.leaderHeight };
                                centerPoint = obj.sourcePoint;
                            } else {
                                newPoint1 = { x: obj.targetPoint.x, y: obj.targetPoint.y - obj.leaderHeight };
                                centerPoint = obj.targetPoint;
                            }
                            let matrix: Matrix = identityMatrix();
                            rotateMatrix(matrix, elementAngle, centerPoint.x, centerPoint.y);
                            let rotatedPoint: PointModel = transformPointByMatrix(matrix, { x: newPoint1.x, y: newPoint1.y });
                            if (contains(position, rotatedPoint, 10)) {
                                return 'Leader' + leaderCount;
                            }
                            leaderCount++;
                        }
                    }
                }
            }
            let ten: number = 10 / this.getZoomFactor();
            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, obj.rotateAngle + element.parentTransform, element.offsetX, element.offsetY);
            //check for resizing tool
            let x: number = element.offsetX - element.pivot.x * element.actualSize.width;
            let y: number = element.offsetY - element.pivot.y * element.actualSize.height;

            let rotateThumb: PointModel = {
                x: x + ((element.pivot.x === 0.5 ? element.pivot.x * 2 : element.pivot.x) * element.actualSize.width / 2),
                y: y - 30 / this.getZoomFactor()
            };
            rotateThumb = transformPointByMatrix(matrix, rotateThumb);
            if (obj.shapeAnnotationType === 'Stamp' && contains(position, rotateThumb, ten)) {
                return 'Rotate';
            }
            paddedBounds = this.inflate(ten, paddedBounds);
            if (paddedBounds.containsPoint(position, 0)) {
                let action: Actions = this.checkResizeHandles(this.pdfViewer, element, position, matrix, x, y);
                if (action) { return action; }
            }
            if (this.pdfViewer.selectedItems.annotations.indexOf(obj) > -1) {
                return 'Drag';
            }

            return 'Select';
        }
        return this.pdfViewer.tool || 'Select';
    }

    private inflate(padding: number, bound: Rect): Rect {
        bound.x -= padding;
        bound.y -= padding;
        bound.width += padding * 2;
        bound.height += padding * 2;
        return bound;
    }
    public checkResizeHandles(
        diagram: PdfViewer, element: DrawingElement, position: PointModel, matrix: Matrix, x: number, y: number): Actions {
        let action: Actions;

        if (!action) {
            action = this.checkForResizeHandles(diagram, element, position, matrix, x, y);
        }
        if (action) { return action; }
        return null;
    }
    public checkForResizeHandles(
        diagram: PdfViewer, element: DrawingElement, position: PointModel, matrix: Matrix, x: number, y: number): Actions {
        let forty: number = 40 / 1;
        let ten: number = 10 / 1;
        let selectedItems: Selector = diagram.selectedItems as Selector;
        let isStamp: boolean = false;
        let isSticky: boolean = false;
        let isNodeShape: boolean = false;
        let isInk: boolean = false;
        let resizerLocation: AnnotationResizerLocation = this.pdfViewer.annotationSelectorSettings.resizerLocation;
        if (resizerLocation < 1 || resizerLocation > 3) {
            resizerLocation = 3;
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0] && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Stamp'
            || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Image' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature')) {
            isStamp = true;
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'StickyNotes') {
            isSticky = true;
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ink') {
            isInk = true;
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0] && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ellipse' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Radius' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Rectangle')) {
            isNodeShape = true;
        }
        if (!isSticky) {
            // tslint:disable-next-line:max-line-length
            if ((isInk || isStamp || (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature')) || ((element.actualSize.width >= forty && element.actualSize.height >= forty) && isNodeShape && (resizerLocation === 1 || resizerLocation === 3))) {
                if (contains(
                    position, transformPointByMatrix(matrix, { x: x + element.actualSize.width, y: y + element.actualSize.height }), ten)) {
                    return 'ResizeSouthEast';
                }
                if (contains(position, transformPointByMatrix(matrix, { x: x, y: y + element.actualSize.height }), ten)) {
                    return 'ResizeSouthWest';
                }
                if (contains(position, transformPointByMatrix(matrix, { x: x + element.actualSize.width, y: y }), ten)) {
                    return 'ResizeNorthEast';
                }
                if (contains(position, transformPointByMatrix(matrix, { x: x, y: y }), ten)) {
                    return 'ResizeNorthWest';
                }
            }
            // tslint:disable-next-line:max-line-length
            if (isInk || !isNodeShape || (isNodeShape && (resizerLocation === 2 || resizerLocation === 3 || (!(element.actualSize.width >= forty && element.actualSize.height >= forty) && resizerLocation === 1)))) {
                if (contains(
                    // tslint:disable-next-line:max-line-length
                    position, transformPointByMatrix(matrix, { x: x + element.actualSize.width, y: y + element.actualSize.height / 2 }), ten) && !isStamp) {
                    return 'ResizeEast';
                }
                // tslint:disable-next-line:max-line-length
                if (contains(position, transformPointByMatrix(matrix, { x: x, y: y + element.actualSize.height / 2 }), ten) && !isStamp) {
                    return 'ResizeWest';
                }
                if (contains(
                    // tslint:disable-next-line:max-line-length
                    position, transformPointByMatrix(matrix, { x: x + element.actualSize.width / 2, y: y + element.actualSize.height }), ten) && !isStamp) {
                    return 'ResizeSouth';
                }
                // tslint:disable-next-line:max-line-length
                if (contains(position, transformPointByMatrix(matrix, { x: x + element.actualSize.width / 2, y: y }), ten) && !isStamp) {
                    return 'ResizeNorth';
                }
            }
        }
        return null;
    }

    /** @private */
    public diagramMouseMove(evt: MouseEvent | TouchEvent): void {
        this.currentPosition = this.getMousePosition(evt);
        this.pdfViewer.firePageMouseover(this.currentPosition.x, this.currentPosition.y);
        if (this.pdfViewer.annotation) {
            this.activeElements.activePageID = this.pdfViewer.annotation.getEventPageNumber(evt);
        }
        let obj: IElement = findActiveElement(evt as MouseEvent, this, this.pdfViewer);
        if ((this.tool instanceof NodeDrawingTool) || (this.tool instanceof LineTool)) {
            obj = this.pdfViewer.drawingObject as IElement;
        }
        let target: PdfAnnotationBaseModel;
        if ((Point.equals(this.currentPosition, this.prevPosition) === false || this.inAction)) {
            if (this.isMouseDown === false) {
                this.eventArgs = {};
                let sourceDrawingElement: DrawingElement = null;
                if (obj) {
                    this.tool = this.getTool(this.action);
                    if (obj.wrapper) {
                        sourceDrawingElement = obj.wrapper.children[0];
                        if (sourceDrawingElement) {
                            target = obj;
                        }
                    }
                }
                let eventTarget: HTMLElement = evt.target as HTMLElement;

                this.action = this.findToolToActivate(obj, this.currentPosition);
                // tslint:disable-next-line
                if (obj && (obj as any).annotationSettings && (obj as any).annotationSettings.isLock) {
                    if (this.action === 'Select') {
                        if (this.pdfViewer.annotationModule.checkAllowedInteractions('Select', obj)) {
                            this.action = this.action;
                        } else {
                            this.action = '';
                        }
                    }
                    if (this.action === 'Drag') {
                        if (this.pdfViewer.annotationModule.checkAllowedInteractions('Move', obj)) {
                            this.action = this.action;
                        } else {
                            this.action = 'Select';
                        }
                    }
                    // tslint:disable-next-line:max-line-length
                    if (this.action === 'ResizeSouthEast' || this.action === 'ResizeNorthEast' || this.action === 'ResizeNorthWest' || this.action === 'ResizeSouthWest' ||
                    // tslint:disable-next-line:max-line-length
                    this.action === 'ResizeNorth' || this.action === 'ResizeWest' || this.action === 'ResizeEast' || this.action === 'ResizeSouth' || this.action.includes('ConnectorSegmentPoint') || this.action.includes('Leader')) {
                        if (this.pdfViewer.annotationModule.checkAllowedInteractions('Resize', obj)) {
                            this.action = this.action;
                        } else {
                            this.action = 'Select';
                        }
                    }
                }
                this.tool = this.getTool(this.action);
                this.setCursor(eventTarget, evt);
            } else {
                if (this.eventArgs && this.eventArgs.source) {
                    let eventTarget: HTMLElement = evt.target as HTMLElement;
                    this.updateDefaultCursor(this.eventArgs.source, eventTarget, evt);
                } else {
                    this.setCursor(evt.target as HTMLElement, evt);
                }
                this.diagramMouseActionHelper(evt as MouseEvent);

                if (this.tool) {
                    let currentObject: PdfAnnotationBaseModel = obj as PdfAnnotationBaseModel;
                     // tslint:disable-next-line:max-line-length
                    if (currentObject && (currentObject.shapeAnnotationType === 'Path' || currentObject.shapeAnnotationType === 'SignatureImage' || currentObject.shapeAnnotationType === 'SignatureText')) {
                        this.tool = null;
                    }
                    if (currentObject && currentObject.shapeAnnotationType === 'FreeText') {
                        if (this.pdfViewer.freeTextSettings.allowEditTextOnly) {
                            let eventTarget: HTMLElement = event.target as HTMLElement;
                            eventTarget.style.cursor = 'default';
                            this.tool = null;
                        }
                    }
                    if (this.tool != null) {
                        this.tool.mouseMove(this.eventArgs);
                    }
                }
            }
            this.prevPosition = this.currentPosition;

        }
    }
    // tslint:disable-next-line
    private updateDefaultCursor(source: any, target: any, event: any): void {
        // tslint:disable-next-line:max-line-length
        if (source && source.pageIndex !== undefined && source.pageIndex !== this.activeElements.activePageID && target) {
            this.isPanMode ? target.style.cursor = 'grab' : target.style.cursor = 'default';
        } else {
            this.setCursor(target, event);
        }
    }

    /** @private */
    public diagramMouseLeave(evt: MouseEvent | TouchEvent): void {
        this.currentPosition = this.getMousePosition(evt);
        if (this.pdfViewer.annotation) {
            this.activeElements.activePageID = this.pdfViewer.annotation.getEventPageNumber(evt);
        }
        let shapeElement: IElement = findActiveElement(evt as MouseEvent, this, this.pdfViewer);
        let mouseMoveforce: boolean = false; let target: PdfAnnotationBaseModel;
        if (Point.equals(this.currentPosition, this.prevPosition) === false || this.inAction) {
            if (this.isMouseDown === false || mouseMoveforce) {
                this.eventArgs = {};
                let sourceElement: DrawingElement = null;
                if (shapeElement) {
                    sourceElement = shapeElement.wrapper.children[0];
                    if (sourceElement) {
                        target = shapeElement;
                    }
                    mouseMoveforce = false;
                }
            } else {
                this.diagramMouseActionHelper(evt as MouseEvent);
                // tslint:disable-next-line:max-line-length
                if (this.tool && this.action !== 'Drag' && this.pdfViewer.tool !== 'Stamp' && (this.tool.currentElement as PdfAnnotationBaseModel) && (this.tool.currentElement as PdfAnnotationBaseModel).shapeAnnotationType !== 'Stamp') {
                    this.tool.mouseLeave(this.eventArgs);
                    this.tool = null;
                    if (this.pdfViewer.annotation) {
                        this.pdfViewer.annotationModule.renderAnnotations(this.previousPage, null, null, null);
                    }
                }
            }
            this.prevPosition = this.currentPosition;
        }
    }

    private diagramMouseActionHelper(evt: MouseEvent): void {
        this.eventArgs.position = this.currentPosition;
        if (this.action === 'Drag' &&
            this.eventArgs.source instanceof Selector) {
            this.getMouseEventArgs(this.currentPosition, this.eventArgs, evt as MouseEvent);
        }
        this.getMouseEventArgs(this.currentPosition, this.eventArgs, evt as MouseEvent, this.eventArgs.source);
        this.inAction = true;
        this.initialEventArgs = null;
    }

    // tslint:disable-next-line
    private setCursor(eventTarget: HTMLElement, event: any): void {
        let freeTextAnnotModule: FreeTextAnnotation = this.pdfViewer.annotationModule.freeTextAnnotationModule;
        let cursorType: string;
        if (this.tool instanceof ResizeTool) {
            if (this.tool.corner === 'ResizeNorthWest') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'nw-resize' : cursorType;
            } else if (this.tool.corner === 'ResizeNorthEast') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'ne-resize' : cursorType;
            } else if (this.tool.corner === 'ResizeSouthWest') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'sw-resize' : cursorType;
            } else if (this.tool.corner === 'ResizeSouthEast') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'se-resize' : cursorType;
            } else if (this.tool.corner === 'ResizeNorth') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'n-resize' : cursorType;
            } else if (this.tool.corner === 'ResizeWest') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'w-resize' : cursorType;
            } else if (this.tool.corner === 'ResizeEast') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'e-resize' : cursorType;
            } else if (this.tool.corner === 'ResizeSouth') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 's-resize' : cursorType;
            }
        } else if (this.pdfViewer.enableHandwrittenSignature && this.isNewSignatureAdded && this.tool instanceof StampTool) {
            eventTarget.style.cursor = 'crosshair';
        } else if (this.tool instanceof MoveTool) {
            eventTarget.style.cursor = 'move';
            // tslint:disable-next-line:max-line-length
        } else if (this.tool instanceof NodeDrawingTool || this.tool instanceof LineTool || this.tool instanceof PolygonDrawingTool || (freeTextAnnotModule && freeTextAnnotModule.isNewAddedAnnot) || this.tool instanceof InkDrawingTool) {
            eventTarget.style.cursor = 'crosshair';
        } else if (this.tool instanceof ConnectTool) {
            if (this.tool.endPoint && this.tool.endPoint.indexOf('Leader0')) {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'nw-resize' : cursorType;
            } else if (this.tool.endPoint && this.tool.endPoint.indexOf('Leader1')) {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'ne-resize' : cursorType;
            } else if (this.tool.endPoint && this.tool.endPoint.indexOf('ConnectorSegmentPoint')) {
                eventTarget.style.cursor = 'sw-resize';
            }
        } else {
            if (eventTarget.classList.contains('e-pv-text')) {
                eventTarget.style.cursor = 'text';
            } else if (eventTarget.classList.contains('e-pv-hyperlink')) {
                eventTarget.style.cursor = 'pointer';
            } else if (this.isPanMode) {
                if (this.isViewerMouseDown && event.type === 'mousemove') {
                    eventTarget.style.cursor = 'grabbing';
                } else {
                    let obj: IElement = findActiveElement(event as MouseEvent, this, this.pdfViewer);
                    if (obj && event.type === 'mousemove') {
                        eventTarget.style.cursor = 'pointer';
                        let currentObject: PdfAnnotationBaseModel = obj as PdfAnnotationBaseModel;
                        // tslint:disable-next-line
                        let currentPosition: any = this.getMousePosition(event);
                        // tslint:disable-next-line
                        let relativePosition: any = this.relativePosition(event);
                        // tslint:disable-next-line
                        let viewerPositions: any = { left: relativePosition.x, top: relativePosition.y }
                        // tslint:disable-next-line
                        let mousePositions: any = { left: currentPosition.x, top: currentPosition.y };
                        // tslint:disable-next-line
                        let annotationSettings: any = { opacity: currentObject.opacity, fillColor: currentObject.fillColor, strokeColor: currentObject.strokeColor, thicknes: currentObject.thickness, author: currentObject.author, subject: currentObject.subject, modifiedDate: currentObject.modifiedDate };
                        // tslint:disable-next-line:max-line-length
                        this.isMousedOver = true;
                        this.pdfViewer.fireAnnotationMouseover(currentObject.annotName, currentObject.pageIndex, currentObject.shapeAnnotationType as AnnotationType, currentObject.bounds, annotationSettings, mousePositions, viewerPositions);
                    } else {
                        eventTarget.style.cursor = 'grab';
                        if (this.isMousedOver) {
                            let pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(event);
                            this.pdfViewer.fireAnnotationMouseLeave(pageIndex);
                            this.isMousedOver = false;
                        }
                    }
                }
            } else {
                let obj: IElement = findActiveElement(event as MouseEvent, this, this.pdfViewer);
                if (obj && this.pdfViewer.selectedItems.annotations.length === 0 && event.type === 'mousemove') {
                    let currentObject: PdfAnnotationBaseModel = obj as PdfAnnotationBaseModel;
                    // tslint:disable-next-line
                    let annotationObject: any = (this.pdfViewer.nameTable as any)[currentObject.id];
                    // tslint:disable-next-line:max-line-length
                    if (annotationObject.shapeAnnotationType !== 'HandWrittenSignature' && annotationObject.shapeAnnotationType !== 'Ink' && annotationObject.annotationSettings.isLock !== undefined) {
                        annotationObject.annotationSettings.isLock = JSON.parse(annotationObject.annotationSettings.isLock);
                    }
                    if (annotationObject.annotationSettings.isLock) {
                        eventTarget.style.cursor = 'default';
                    } else {
                        eventTarget.style.cursor = 'pointer';
                    }
                    // tslint:disable-next-line
                    let currentPosition: any = this.getMousePosition(event);
                    // tslint:disable-next-line
                    let relativePosition: any = this.relativePosition(event);
                    // tslint:disable-next-line
                    let viewerPositions: any = { left: relativePosition.x, top: relativePosition.y };
                    // tslint:disable-next-line
                    let mousePositions: any = { left: currentPosition.x, top: currentPosition.y };
                    // tslint:disable-next-line
                    let annotationSettings: any = { opacity: currentObject.opacity, fillColor: currentObject.fillColor, strokeColor: currentObject.strokeColor, thicknes: currentObject.thickness, author: currentObject.author, subject: currentObject.subject, modifiedDate: currentObject.modifiedDate };
                    // tslint:disable-next-line:max-line-length
                    this.isMousedOver = true;
                    this.pdfViewer.fireAnnotationMouseover(currentObject.annotName, currentObject.pageIndex, currentObject.shapeAnnotationType as AnnotationType, currentObject.bounds, annotationSettings, mousePositions, viewerPositions);
                } else {
                    if (this.isMousedOver) {
                        let pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(event);
                        this.pdfViewer.fireAnnotationMouseLeave(pageIndex);
                        this.isMousedOver = false;
                    }
                    eventTarget.style.cursor = 'default';
                }
            }
        }
    }
    private setResizerCursorType(): string {
        let cursorType: string;
         // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0] && isNullOrUndefined(this.pdfViewer.selectedItems.annotations[0].annotationSelectorSettings.resizerCursorType)) {
            if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText') {
                // tslint:disable-next-line:max-line-length
                cursorType = !isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings) ? this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerCursorType : null;
            } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Stamp') {
                // tslint:disable-next-line:max-line-length
                cursorType = !isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings) ? this.pdfViewer.stampSettings.annotationSelectorSettings.resizerCursorType : null;
            } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature') {
                // tslint:disable-next-line:max-line-length
                cursorType = !isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) ? this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerCursorType : null;
            } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ink') {
                // tslint:disable-next-line:max-line-length
                cursorType = !isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) ? this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerCursorType : null;
            } else if (!this.pdfViewer.selectedItems.annotations[0].measureType) {
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings) ? this.pdfViewer.lineSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'LineWidthArrowHead') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings) ? this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Rectangle') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings) ? this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ellipse') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings) ? this.pdfViewer.circleSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Polygon') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings) ? this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerCursorType : null;
                }
            } else if (this.pdfViewer.selectedItems.annotations[0].measureType) {
                if (this.pdfViewer.selectedItems.annotations[0].subject === 'Distance calculation') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings) ? this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Perimeter calculation') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings) ? this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Area calculation') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings) ? this.pdfViewer.areaSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Radius calculation') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings) ? this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Volume calculation') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings) ? this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerCursorType : null;
                }
            }
        } else {
            if (this.pdfViewer.selectedItems.annotations[0]) {
                cursorType = this.pdfViewer.selectedItems.annotations[0].annotationSelectorSettings.resizerCursorType;
            }
        }
        if (!cursorType) {
            cursorType = this.pdfViewer.annotationSelectorSettings.resizerCursorType;
        }
        return cursorType;
    }

    /** @private */
    public getTool(action: Actions | string): ToolBase {
        switch (action) {
            case 'Select':
                return new SelectTool(this.pdfViewer, this);
            case 'Drag':
                return new MoveTool(this.pdfViewer, this);
            case 'ResizeSouthEast':
            case 'ResizeSouthWest':
            case 'ResizeNorthEast':
            case 'ResizeNorthWest':
            case 'ResizeSouth':
            case 'ResizeNorth':
            case 'ResizeWest':
            case 'ResizeEast':
                return new ResizeTool(this.pdfViewer, this, action);
            case 'ConnectorSourceEnd':
            case 'ConnectorTargetEnd':
            case 'Leader':
            case 'ConnectorSegmentPoint':
                return new ConnectTool(this.pdfViewer, this, action);
            case 'DrawTool':
                return new NodeDrawingTool(this.pdfViewer, this, this.pdfViewer.drawingObject);
            case 'Polygon':
                return new PolygonDrawingTool(this.pdfViewer, this, 'Polygon');
            case 'Distance':
                return new LineTool(this.pdfViewer, this, 'Leader1', undefined);
            case 'Line':
                return new LineTool(this.pdfViewer, this, 'ConnectorSegmentPoint_1', this.pdfViewer.drawingObject);
            case 'Perimeter':
                return new PolygonDrawingTool(this.pdfViewer, this, 'Perimeter');
            case 'Rotate':
                return new RotateTool(this.pdfViewer, this);
            case 'Stamp':
                return new StampTool(this.pdfViewer, this);
            case 'Ink':
                return new InkDrawingTool(this.pdfViewer, this, this.pdfViewer.drawingObject);
        }
        if (action.indexOf('ConnectorSegmentPoint') > -1 || action.indexOf('Leader') > -1) {
            return new ConnectTool(this.pdfViewer, this, action);

        }
        return null;
    }

    /** @private */
    public diagramMouseUp(evt: MouseEvent | TouchEvent): void {
        let touches: TouchList;
        if (this.tool) {
            if (!this.inAction && (evt as MouseEvent).which !== 3) {
                if (this.action === 'Drag') {
                    this.action = 'Select';
                    let obj: IElement = findActiveElement(evt, this, this.pdfViewer);
                    let isMultipleSelect: boolean = true;
                }
            }
            let isGroupAction: boolean;
            if (!(this.tool instanceof PolygonDrawingTool) && !(this.tool instanceof LineTool) && !(this.tool instanceof NodeDrawingTool)) {
                this.inAction = false;
                this.isMouseDown = false;
            }
            this.currentPosition = this.getMousePosition(evt);
            if (this.tool) {
                this.eventArgs.position = this.currentPosition;
                this.getMouseEventArgs(this.currentPosition, this.eventArgs, evt, this.eventArgs.source);
                let ctrlKey: boolean = this.isMetaKey(evt);
                let info: Info = { ctrlKey: evt.ctrlKey, shiftKey: evt.shiftKey };
                this.eventArgs.info = info;
                this.eventArgs.clickCount = evt.detail;
                this.tool.mouseUp(this.eventArgs);
                this.isAnnotationMouseDown = false;
                // tslint:disable-next-line:max-line-length
                if ((this.tool instanceof NodeDrawingTool || this.tool instanceof LineTool || this.tool instanceof PolygonDrawingTool) && !this.tool.dragging) {
                    this.inAction = false;
                    this.isMouseDown = false;
                }
                let obj: IElement = findActiveElement(evt, this, this.pdfViewer);
                // tslint:disable-next-line:max-line-length
                if ((this.isShapeAnnotationModule() && this.isCalibrateAnnotationModule()) && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
                    this.pdfViewer.annotation.onShapesMouseup(obj as PdfAnnotationBaseModel, evt);
                }
                this.isAnnotationDrawn = false;
            }
        }
        let target: HTMLElement = evt.target as HTMLElement;
           // tslint:disable-next-line:max-line-length
        if (!touches && evt.cancelable && this.skipPreventDefault(target) && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
            evt.preventDefault();
        }
        this.eventArgs = {};
    }
    /**
     * @private
     */
    public skipPreventDefault(target: HTMLElement): boolean {
        let isSkipped: boolean = false;
        let isSkip: boolean = false;
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus) {
            isSkip = true;
        }
        // tslint:disable-next-line:max-line-length
        if (target && !target.classList.contains('e-pdfviewer-formFields')
            && !target.classList.contains('e-pdfviewer-ListBox') && !target.classList.contains('e-pdfviewer-signatureformFields')
            && !((target).className === 'free-text-input' && (target).tagName === 'TEXTAREA')
            && !isSkip && !((target).className === 'e-pv-hyperlink')) {
            isSkipped = true;
        }
        return isSkipped;
    }
    private isMetaKey(evt: MouseEvent | TouchEvent | WheelEvent | KeyboardEvent): boolean {
        return navigator.platform.match('Mac') ? evt.metaKey : evt.ctrlKey;
    }
    /**
     * @private
     */
    public diagramMouseDown(evt: MouseEvent | TouchEvent): void {
        let touches: TouchList;
        touches = (<TouchEvent & PointerEvent>evt).touches;
        this.isMouseDown = true;
        this.isAnnotationAdded = false;
        this.currentPosition = this.prevPosition = this.getMousePosition(evt);
        this.eventArgs = {};
        let isStamp: boolean = false;
        if (this.pdfViewer.tool === 'Stamp') {
            this.pdfViewer.tool = '';
            isStamp = true;
        }
        let target: PdfAnnotationBaseModel;
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.pdfViewer.annotation) {
            this.activeElements.activePageID = this.pdfViewer.annotation.getEventPageNumber(evt);
        }
        let obj: IElement = findActiveElement(evt, this, this.pdfViewer);
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && obj) {
            evt.preventDefault();
        }
        if (this.pdfViewer.annotation && this.pdfViewer.enableStampAnnotations) {
            let stampModule: StampAnnotation = this.pdfViewer.annotationModule.stampAnnotationModule;
            if (stampModule && stampModule.isNewStampAnnot) {
                let stampObj: PdfAnnotationBaseModel = obj as PdfAnnotationBaseModel;
                if (stampObj === undefined && this.pdfViewer.selectedItems.annotations[0]) {
                    stampObj = this.pdfViewer.selectedItems.annotations[0];
                }
                if (stampObj) {
                    this.isViewerMouseDown = false;
                    stampObj.opacity = this.pdfViewer.stampSettings.opacity;
                    this.isNewStamp = true;
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.nodePropertyChange(stampObj, { opacity: this.pdfViewer.stampSettings.opacity });
                    this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = false;
                    if (stampObj.shapeAnnotationType === 'Image' && !this.isAlreadyAdded) {
                        this.stampAdded = true;
                        let stampName: string = stampObj.id;
                        if (stampModule.currentStampAnnotation && stampModule.currentStampAnnotation.signatureName) {
                            stampName = stampModule.currentStampAnnotation.signatureName;
                        }
                        let isSkip: boolean = false;
                        for (let i: number = 0; i < this.customStampCollection.length; i++) {
                            if (this.customStampCollection[i].customStampName === stampName) {
                                isSkip = true;
                                break;
                            }
                        }
                        if (isSkip) {
                            stampName = stampObj.id;
                        }
                        this.customStampCollection.push({ customStampName: stampName, customStampImageSource: stampObj.data });
                    }
                    this.isAlreadyAdded = false;
                    stampModule.updateDeleteItems(stampObj.pageIndex, stampObj, stampObj.opacity);
                    stampModule.resetAnnotation();
                    stampModule.isNewStampAnnot = false;
                }
            }
        }
        if (this.isNewSignatureAdded) {
            this.signatureCount++;
            this.currentSignatureAnnot = null;
            let signObject: PdfAnnotationBaseModel = obj as PdfAnnotationBaseModel;
            if (signObject === undefined && this.pdfViewer.selectedItems.annotations[0]) {
                signObject = this.pdfViewer.selectedItems.annotations[0];
            }
            if (signObject) {
                this.signatureAdded = true;
                this.signatureModule.storeSignatureData(signObject.pageIndex, signObject);
                // tslint:disable-next-line
                let bounds: any = { left: signObject.bounds.x, top: signObject.bounds.y, width: signObject.bounds.width, height: signObject.bounds.height };
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.fireSignatureAdd(signObject.pageIndex, signObject.signatureName, signObject.shapeAnnotationType as AnnotationType, bounds, signObject.opacity, signObject.strokeColor, signObject.thickness);
            }
            this.isNewSignatureAdded = false;
        }
        if (this.pdfViewer.annotationModule) {
            let freeTextAnnotModule: FreeTextAnnotation = this.pdfViewer.annotationModule.freeTextAnnotationModule;
            // tslint:disable-next-line
            let currentObj: any = obj;
            if (freeTextAnnotModule.isNewFreeTextAnnot === true && !(currentObj && currentObj.shapeAnnotationType === 'FreeText')) {
                let canvas: Rect;
                // tslint:disable-next-line:max-line-length
                if (evt.target && ((evt.target as PdfAnnotationBaseModel).id.indexOf('_text') > -1 || (evt.target as PdfAnnotationBaseModel).id.indexOf('_annotationCanvas') > -1 || (evt.target as HTMLElement).classList.contains('e-pv-hyperlink')) && this.pdfViewer.annotation) {
                    let pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(evt);
                    let diagram: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
                    if (diagram) {
                        let canvas1: Rect = diagram.getBoundingClientRect() as Rect;
                        let left: number = canvas1.x ? canvas1.x : canvas1.left;
                        let top: number = canvas1.y ? canvas1.y : canvas1.top;
                        canvas = new Rect(left + 10, top + 10, canvas1.width - 10, canvas1.height - 10);
                    }
                }
                if (touches) {
                    this.mouseX = touches[0].clientX;
                    this.mouseY = touches[0].clientY;
                }
                if (canvas && canvas.containsPoint({ x: this.mouseX, y: this.mouseY }) && freeTextAnnotModule.isNewAddedAnnot) {
                    let pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(evt);
                    freeTextAnnotModule.addInuptElemet(this.currentPosition, null, pageIndex);
                    if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                        // tslint:disable-next-line
                        let annotModule: any = this.pdfViewer.toolbar.annotationToolbarModule;
                        if (!isBlazor()) {
                            annotModule.primaryToolbar.deSelectItem(annotModule.freeTextEditItem);
                        }
                    }
                    evt.preventDefault();
                    freeTextAnnotModule.isNewAddedAnnot = false;
                }
            }
        }
        let sourceElement: DrawingElement = null;
        if (obj) {
            sourceElement = obj.wrapper.children[0];
            if (sourceElement) {
                target = obj;
            }
        }
        if (!this.tool || (this.tool && !(this.tool as PolygonDrawingTool).drawingObject)) {
            if (!isStamp) {
                this.action = this.findToolToActivate(obj, this.currentPosition);
                // tslint:disable-next-line
                if (obj && (obj as any).annotationSettings && (obj as any).annotationSettings.isLock) {
                    if (this.action === 'Select') {
                        if (this.pdfViewer.annotationModule.checkAllowedInteractions('Select', obj)) {
                            this.action = this.action;
                        } else {
                            this.action = '';
                        }
                    }
                    if (this.action === 'Drag') {
                        if (this.pdfViewer.annotationModule.checkAllowedInteractions('Move', obj)) {
                            this.action = this.action;
                        } else {
                            this.action = 'Select';
                        }
                    }
                    // tslint:disable-next-line:max-line-length
                    if (this.action === 'ResizeSouthEast' || this.action === 'ResizeNorthEast' || this.action === 'ResizeNorthWest' || this.action === 'ResizeSouthWest' || this.action === 'ResizeSouth' ||                    // tslint:disable-next-line:max-line-length
                    this.action === 'ResizeNorth' || this.action === 'ResizeWest' || this.action === 'ResizeEast' || this.action.includes('ConnectorSegmentPoint') || this.action.includes('Leader')) {
                        if (this.pdfViewer.annotationModule.checkAllowedInteractions('Resize', obj)) {
                            this.action = this.action;
                        } else {
                            this.action = 'Select';
                        }
                    }
                }
                this.tool = this.getTool(this.action);
                if (!this.tool) {
                    this.action = this.pdfViewer.tool || 'Select';
                    this.tool = this.getTool(this.action);
                }
            } else {
                this.action = 'Select';
                this.tool = this.getTool(this.action);
            }
        }
        this.getMouseEventArgs(this.currentPosition, this.eventArgs, evt);
        this.eventArgs.position = this.currentPosition;
        if (this.tool) {
            this.isAnnotationMouseDown = false;
            this.isAnnotationMouseMove = false;
            this.tool.mouseDown(this.eventArgs);
            this.isAnnotationDrawn = true;
            this.signatureAdded = true;
        }
        if (this.pdfViewer.annotation) {
            this.pdfViewer.annotation.onAnnotationMouseDown();
        }
        this.initialEventArgs = { source: this.eventArgs.source, sourceWrapper: this.eventArgs.sourceWrapper };
        this.initialEventArgs.position = this.currentPosition;
        this.initialEventArgs.info = this.eventArgs.info;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public exportAnnotationsAsObject(): any {
        if (this.pdfViewer.annotationModule) {
            let isAnnotations: boolean = this.updateExportItem();
            if (isAnnotations) {
                return new Promise((resolve: Function, reject: Function) => {
                    this.createRequestForExportAnnotations(true, AnnotationDataFormat.Json).then((value: object) => {
                        resolve(value);
                    });
                });
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public exportFormFieldsAsObject(): any {
        if (this.pdfViewer.formFieldsModule) {
            return new Promise((resolve: Function, reject: Function) => {
                this.createRequestForExportFormfields(true).then((value: object) => {
                    resolve(value);
                });
            });
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public importAnnotations(importData: any, annotationDataFormat?: AnnotationDataFormat): void {
        if (this.pdfViewer.annotationModule) {
            this.createRequestForImportAnnotations(importData, annotationDataFormat);
        }
    }

    /**
     * @private
     */
    public exportAnnotations(annotationDataFormat?: AnnotationDataFormat): void {
        if (this.pdfViewer.annotationModule) {
            let isAnnotations: boolean = this.updateExportItem();
            if (isAnnotations) {
                this.createRequestForExportAnnotations(false, annotationDataFormat);
            }
        }
    }

    // tslint:disable-next-line
    private createRequestForExportAnnotations(isObject?: boolean, annotationDataFormat?: AnnotationDataFormat): any {
        let proxy: PdfViewerBase = this;
        let promise: Promise<Blob> = new Promise((resolve: Function, reject: Function) => {
            // tslint:disable-next-line
            let jsonObject: any;
            if (annotationDataFormat === 'Json') {
                // tslint:disable-next-line:max-line-length
               jsonObject = { hashId: proxy.hashId, action: 'ExportAnnotations', pdfAnnotation: proxy.createAnnotationJsonData(), elementId: proxy.pdfViewer.element.id, annotationDataFormat: annotationDataFormat };
               proxy.pdfViewer.fireExportStart(jsonObject.pdfAnnotation);

           } else {
               jsonObject = this.constructJsonDownload();
               proxy.pdfViewer.fireExportStart(jsonObject);
               jsonObject.annotationDataFormat = annotationDataFormat;
               // tslint:disable-next-line
               jsonObject['action'] = 'ExportAnnotations';
           }
            if (proxy.jsonDocumentId) {
                // tslint:disable-next-line
                (jsonObject as any).document = proxy.jsonDocumentId;
            }
            let url: string = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.exportAnnotations;
            proxy.exportAnnotationRequestHandler = new AjaxHandler(this.pdfViewer);
            proxy.exportAnnotationRequestHandler.url = url;
            proxy.exportAnnotationRequestHandler.mode = true;
            proxy.exportAnnotationRequestHandler.responseType = 'text';
            proxy.exportAnnotationRequestHandler.send(jsonObject);
            // tslint:disable-next-line
            proxy.exportAnnotationRequestHandler.onSuccess = function (result: any) {
                // tslint:disable-next-line
                let data: any = result.data;
                if (data) {
                    if (typeof data === 'object') {
                        data = JSON.parse(data);
                    }
                    if (data) {
                        if (isObject) {
                            if (data.split('base64,')[1]) {
                                // tslint:disable-next-line
                                let annotationJson: any = atob(data.split(',')[1]);
                                let exportObject: object = JSON.parse(annotationJson);
                                if (proxy.pdfViewer.exportAnnotationFileName !== null) {
                                    proxy.pdfViewer.fireExportSuccess(exportObject, proxy.pdfViewer.exportAnnotationFileName);
                                } else {
                                    proxy.pdfViewer.fireExportSuccess(exportObject, proxy.pdfViewer.fileName);
                                }
                                proxy.updateDocumentAnnotationCollections();
                                resolve(annotationJson);
                            } else {
                                // tslint:disable-next-line:max-line-length
                                proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                            }
                        } else {
                            if (annotationDataFormat === 'Json') {
                                if (data.split('base64,')[1]) {
                                    let blobUrl: string = proxy.createBlobUrl(data.split('base64,')[1], 'application/json');
                                    if (Browser.isIE || Browser.info.name === 'edge') {
                                        if (proxy.pdfViewer.exportAnnotationFileName !== null) {
                                            // tslint:disable-next-line:max-line-length
                                            window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.exportAnnotationFileName.split('.')[0] + '.json');
                                        } else {
                                            window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.fileName.split('.')[0] + '.json');
                                        }
                                    } else {
                                        proxy.downloadExportAnnotationJson(blobUrl);
                                    }
                                    proxy.updateDocumentAnnotationCollections();
                                } else {
                                    proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                                    // tslint:disable-next-line:max-line-length
                                    proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                                }
                            } else {
                                if (data.split('base64,')[1]) {
                                    let blobUrl: string = proxy.createBlobUrl(data.split('base64,')[1], 'application/vnd.adobe.xfdf');
                                    if (Browser.isIE || Browser.info.name === 'edge') {
                                        window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.fileName.split('.')[0] + '.xfdf');
                                    } else {
                                        proxy.downloadExportedXFdfAnnotation(blobUrl);
                                    }
                                } else {
                                    proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                                    // tslint:disable-next-line:max-line-length
                                    proxy.pdfViewer.fireExportFailed(jsonObject, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                                }
                            }
                        }
                    }

                    if (typeof data !== 'string') {
                        try {
                            if (typeof data === 'string') {
                                proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.exportAnnotations);
                                data = null;
                            }
                        } catch (error) {
                            // tslint:disable-next-line:max-line-length
                            proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                            proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.exportAnnotations);
                            data = null;
                        }
                    }
                } else {
                    let fileName: string;
                    if (proxy.pdfViewer.exportAnnotationFileName !== null) {
                          fileName = proxy.pdfViewer.exportAnnotationFileName;
                    } else {
                        fileName = proxy.pdfViewer.fileName;
                    }
                    proxy.pdfViewer.fireExportSuccess('Exported data saved in server side successfully', fileName);
                }
            };
            // tslint:disable-next-line
            proxy.exportAnnotationRequestHandler.onFailure = function (result: any) {
                proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, result.statusText);
            };
            // tslint:disable-next-line
            proxy.exportAnnotationRequestHandler.onError = function (result: any) {
                proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, result.statusText);
            };
        });
        if (isObject) {
            return promise;
        } else {
            return true;
        }
    }

    // tslint:disable-next-line
    private createRequestForImportAnnotations(importData: any, annotationDataFormat?: AnnotationDataFormat): void {
        let jsonObject: object;
        let proxy: PdfViewerBase = this;
        if (typeof importData === 'object') {
            proxy.reRenderAnnotations(importData.pdfAnnotation);
            proxy.isImportedAnnotation = true;
            proxy.pdfViewer.isDocumentEdited = true;
            proxy.pdfViewer.fireImportSuccess(importData.pdfAnnotation);
        } else {
            proxy.pdfViewer.fireImportStart(importData);
            if (annotationDataFormat === 'Json') {
                // tslint:disable-next-line:max-line-length
                jsonObject = { fileName: importData, action: 'ImportAnnotations', elementId: proxy.pdfViewer.element.id };
            } else {
                // tslint:disable-next-line:max-line-length
                jsonObject = { importedData: importData, action: 'ImportAnnotations', elementId: proxy.pdfViewer.element.id,  hashId: this.hashId, uniqueId: this.documentId };
            }
            if (proxy.jsonDocumentId) {
                // tslint:disable-next-line
                (jsonObject as any).document = proxy.jsonDocumentId;
            }
            let url: string = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.importAnnotations;
            proxy.importAnnotationRequestHandler = new AjaxHandler(proxy.pdfViewer);
            proxy.importAnnotationRequestHandler.url = url;
            proxy.importAnnotationRequestHandler.mode = true;
            proxy.importAnnotationRequestHandler.responseType = 'text';
            proxy.importAnnotationRequestHandler.send(jsonObject);
            // tslint:disable-next-line
            proxy.importAnnotationRequestHandler.onSuccess = function (result: any) {
                // tslint:disable-next-line
                let data: any = result.data;
                if (data) {
                    if (typeof data !== 'object') {
                        try {
                            data = JSON.parse(data);
                            if (typeof data !== 'object') {
                                proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.importAnnotations);
                                data = null;
                            }
                        } catch (error) {
                            proxy.pdfViewer.fireImportFailed(importData, proxy.pdfViewer.localeObj.getConstant('File not found'));
                            proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('File not found'));
                            proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.importAnnotations);
                            data = null;
                        }
                    }
                    if (data) {
                        if (data.pdfAnnotation) {
                            proxy.reRenderAnnotations(data.pdfAnnotation);
                            proxy.isImportedAnnotation = true;
                            proxy.pdfViewer.isDocumentEdited = true;
                            proxy.pdfViewer.fireImportSuccess(data.pdfAnnotation);
                        }
                    }
                }
            };
            // tslint:disable-next-line
            proxy.importAnnotationRequestHandler.onFailure = function (result: any) {
                proxy.pdfViewer.fireImportFailed(importData, result.statusText);
            };
            // tslint:disable-next-line
            proxy.importAnnotationRequestHandler.onError = function (result: any) {
                proxy.pdfViewer.fireImportFailed(importData, result.statusText);
            };
        }
    }

    /**
     * @private
     */
    public openImportExportNotificationPopup(errorDetails: string): void {
        if (this.pdfViewer.showNotificationDialog) {
        this.textLayer.createNotificationPopup(errorDetails);
        }
    }

    // tslint:disable-next-line
    private reRenderAnnotations(annotation: any): any {
        if (annotation) {
            this.isImportAction = true;
            let count: number;
            if (this.isImportedAnnotation) {
                this.importedAnnotation = this.combineImportedData(this.importedAnnotation, annotation);
            } else {
                if (this.pageCount > 0) {
                    this.importedAnnotation = annotation;
                }
            }
            if (!this.isImportedAnnotation) {
                count = 0;
            }
            for (let i: number = 0; i < this.pageCount; i++) {
                if (annotation[i]) {
                    // tslint:disable-next-line
                    let importPageCollections: any = [];
                    // tslint:disable-next-line
                    let textMarkupObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_textMarkup');
                    // tslint:disable-next-line
                    let shapeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape');
                    // tslint:disable-next-line
                    let measureShapeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape_measure');
                    // tslint:disable-next-line
                    let stampObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_stamp');
                    // tslint:disable-next-line
                    let stickyObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sticky');
                    // tslint:disable-next-line
                    let freeTextObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_freetext');
                    // tslint:disable-next-line
                    let signatureObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sign');
                    // tslint:disable-next-line
                    let inkObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_ink');
                    if (this.isStorageExceed) {
                        textMarkupObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
                        shapeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
                        measureShapeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
                        stampObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
                        stickyObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
                        freeTextObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
                        inkObject = this.annotationStorage[this.documentId + '_annotations_ink'];
                    }
                    let annotationCanvas: HTMLElement = this.getElement('_annotationCanvas_' + i);
                    if (annotationCanvas) {
                        this.drawPageAnnotations(annotation[i], i);
                        if (this.isImportedAnnotation) {
                            let isAdded: boolean = false;
                            for (let j: number = 0; j < this.annotationPageList.length; j++) {
                                if (this.annotationPageList[j] === i) {
                                    isAdded = true;
                                }
                            }
                            if (isAdded) {
                                this.annotationPageList[count] = i;
                                count = count + 1;
                            }
                        } else {
                            this.annotationPageList[count] = i;
                            count = count + 1;
                        }
                    }
                    if (annotation[i].textMarkupAnnotation && annotation[i].textMarkupAnnotation.length !== 0) {
                        if (textMarkupObject) {
                            let annotObject: IPageAnnotations[] = JSON.parse(textMarkupObject);
                            // tslint:disable-next-line:max-line-length
                            annotation[i].textMarkupAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].textMarkupAnnotation, i);
                        }
                        annotation[i].textMarkupAnnotation = this.checkAnnotationCommentsCollections(annotation[i].textMarkupAnnotation, i);
                        importPageCollections.textMarkupAnnotation = annotation[i].textMarkupAnnotation;
                        if (annotation[i].textMarkupAnnotation.length !== 0) {
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].textMarkupAnnotation, i);
                            for (let j: number = 0; j < annotation[i].textMarkupAnnotation.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.textMarkupAnnotationModule.updateTextMarkupAnnotationCollections(annotation[i].textMarkupAnnotation[j], i));
                            }
                        }
                    }
                    if (annotation[i].shapeAnnotation && annotation[i].shapeAnnotation.length !== 0) {
                        if (shapeObject) {
                            let annotObject: IPageAnnotations[] = JSON.parse(shapeObject);
                            annotation[i].shapeAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].shapeAnnotation, i);
                        }
                        annotation[i].shapeAnnotation = this.checkAnnotationCommentsCollections(annotation[i].shapeAnnotation, i);
                        importPageCollections.shapeAnnotation = annotation[i].shapeAnnotation;
                        if (annotation[i].shapeAnnotation.length !== 0) {
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].shapeAnnotation, i);
                            for (let j: number = 0; j < annotation[i].shapeAnnotation.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.shapeAnnotationModule.updateShapeAnnotationCollections(annotation[i].shapeAnnotation[j], i));
                            }
                        }
                    }
                    if (annotation[i].measureShapeAnnotation && annotation[i].measureShapeAnnotation.length !== 0) {
                        if (measureShapeObject) {
                            let annotObject: IPageAnnotations[] = JSON.parse(measureShapeObject);
                            // tslint:disable-next-line:max-line-length
                            annotation[i].measureShapeAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].measureShapeAnnotation, i);
                        }
                        // tslint:disable-next-line:max-line-length
                        annotation[i].measureShapeAnnotation = this.checkAnnotationCommentsCollections(annotation[i].measureShapeAnnotation, i);
                        importPageCollections.measureShapeAnnotation = annotation[i].measureShapeAnnotation;
                        if (annotation[i].measureShapeAnnotation.length !== 0) {
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].measureShapeAnnotation, i);
                            for (let j: number = 0; j < annotation[i].measureShapeAnnotation.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.measureAnnotationModule.updateMeasureAnnotationCollections(annotation[i].measureShapeAnnotation[j], i));
                            }
                        }
                    }
                    if (annotation[i].stampAnnotations && annotation[i].stampAnnotations.length !== 0) {
                        if (stampObject) {
                            let annotObject: IPageAnnotations[] = JSON.parse(stampObject);
                            // tslint:disable-next-line:max-line-length
                            annotation[i].stampAnnotations = this.checkAnnotationCollections(annotObject, annotation[i].stampAnnotations, i);
                        }
                        annotation[i].stampAnnotations = this.checkAnnotationCommentsCollections(annotation[i].stampAnnotations, i);
                        importPageCollections.stampAnnotations = annotation[i].stampAnnotations;
                        if (annotation[i].stampAnnotations.length !== 0) {
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].stampAnnotations, i);
                            for (let j: number = 0; j < annotation[i].stampAnnotations.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.stampAnnotationModule.updateStampAnnotationCollections(annotation[i].stampAnnotations[j], i));
                            }
                        }
                    }
                    if (annotation[i].stickyNotesAnnotation && annotation[i].stickyNotesAnnotation.length !== 0) {
                        if (stickyObject) {
                            let annotObject: IPageAnnotations[] = JSON.parse(stickyObject);
                            // tslint:disable-next-line:max-line-length
                            annotation[i].stickyNotesAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].stickyNotesAnnotation, i);
                        }
                        // tslint:disable-next-line:max-line-length
                        annotation[i].stickyNotesAnnotation = this.checkAnnotationCommentsCollections(annotation[i].stickyNotesAnnotation, i);
                        importPageCollections.stickyNotesAnnotation = annotation[i].stickyNotesAnnotation;
                        if (annotation[i].stickyNotesAnnotation.length !== 0) {
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].stickyNotesAnnotation, i);
                            for (let j: number = 0; j < annotation[i].stickyNotesAnnotation.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateStickyNotesAnnotationCollections(annotation[i].stickyNotesAnnotation[j], i));
                            }
                        }
                    }
                    if (annotation[i].freeTextAnnotation && annotation[i].freeTextAnnotation.length !== 0) {
                        if (freeTextObject) {
                            let annotObject: IPageAnnotations[] = JSON.parse(freeTextObject);
                            // tslint:disable-next-line:max-line-length
                            annotation[i].freeTextAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].freeTextAnnotation, i);
                        }
                        annotation[i].freeTextAnnotation = this.checkAnnotationCommentsCollections(annotation[i].freeTextAnnotation, i);
                        importPageCollections.freeTextAnnotation = annotation[i].freeTextAnnotation;
                        if (annotation[i].freeTextAnnotation.length !== 0) {
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].freeTextAnnotation, i);
                            for (let j: number = 0; j < annotation[i].freeTextAnnotation.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.freeTextAnnotationModule.updateFreeTextAnnotationCollections(annotation[i].freeTextAnnotation[j], i));
                            }
                        }
                    }
                    if (annotation[i].signatureAnnotation && annotation[i].signatureAnnotation.length !== 0) {
                        if (signatureObject) {
                            let annotObject: IPageAnnotations[] = JSON.parse(signatureObject);
                            // tslint:disable-next-line:max-line-length
                            annotation[i].signatureAnnotation = this.checkSignatureCollections(annotObject, annotation[i].signatureAnnotation, i);
                        }
                        importPageCollections.signatureAnnotation = annotation[i].signatureAnnotation;
                        if (annotation[i].signatureAnnotation.length !== 0) {
                            for (let j: number = 0; j < annotation[i].signatureAnnotation.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.signatureModule.updateSignatureCollections(annotation[i].signatureAnnotation[j], i), true);
                            }
                        }
                    }
                    if (annotation[i].signatureInkAnnotation && annotation[i].signatureInkAnnotation.length !== 0) {
                        if (inkObject) {
                            let annotObject: IPageAnnotations[] = JSON.parse(inkObject);
                            // tslint:disable-next-line:max-line-length
                            annotation[i].signatureInkAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].signatureInkAnnotation, i);
                        }
                        // tslint:disable-next-line:max-line-length
                        annotation[i].signatureInkAnnotation = this.checkAnnotationCommentsCollections(annotation[i].signatureInkAnnotation, i);
                        importPageCollections.signatureInkAnnotation = annotation[i].signatureInkAnnotation;
                        if (annotation[i].signatureInkAnnotation.length !== 0) {
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].signatureInkAnnotation, i);
                            for (let j: number = 0; j < annotation[i].signatureInkAnnotation.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                // this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.freeTextAnnotationModule.updateFreeTextAnnotationCollections(annotation[i].freeTextAnnotation[j], i));
                            }
                        }
                    }
                    this.updateImportedAnnotationsInDocumentCollections(importPageCollections, i);
                }
            }
            if (this.pageCount > 0) {
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewer.annotationModule.stickyNotesAnnotationModule && !this.pdfViewer.annotationModule.stickyNotesAnnotationModule.isAnnotationRendered) {
                    // tslint:disable-next-line
                    let annotationCollection: any = this.createAnnotationsCollection();
                    if (annotationCollection) {
                        // tslint:disable-next-line:max-line-length
                        this.documentAnnotationCollections = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationsInDocumentCollections(this.importedAnnotation, annotationCollection);
                    }
                }
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    private updateImportedAnnotationsInDocumentCollections(importedAnnotations: any, pageNumber: number): void {
        if (this.documentAnnotationCollections) {
            // tslint:disable-next-line
            let documentAnnotationCollection: any = this.documentAnnotationCollections;
            // tslint:disable-next-line
            let pageCollections: any = documentAnnotationCollection[pageNumber];
            if (pageCollections) {
                if (importedAnnotations.textMarkupAnnotation && importedAnnotations.textMarkupAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.textMarkupAnnotation.length; i++) {
                        pageCollections.textMarkupAnnotation.push(importedAnnotations.textMarkupAnnotation[i]);
                    }
                }
                if (importedAnnotations.shapeAnnotation && importedAnnotations.shapeAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.shapeAnnotation.length; i++) {
                        pageCollections.shapeAnnotation.push(importedAnnotations.shapeAnnotation[i]);
                    }
                }
                if (importedAnnotations.measureShapeAnnotation && importedAnnotations.measureShapeAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.measureShapeAnnotation.length; i++) {
                        pageCollections.measureShapeAnnotation.push(importedAnnotations.measureShapeAnnotation[i]);
                    }
                }
                if (importedAnnotations.stampAnnotations && importedAnnotations.stampAnnotations.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.stampAnnotations.length; i++) {
                        pageCollections.stampAnnotations.push(importedAnnotations.stampAnnotations[i]);
                    }
                }
                if (importedAnnotations.stickyNotesAnnotation && importedAnnotations.stickyNotesAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.stickyNotesAnnotation.length; i++) {
                        pageCollections.stickyNotesAnnotation.push(importedAnnotations.stickyNotesAnnotation[i]);
                    }
                }
                if (importedAnnotations.freeTextAnnotation && importedAnnotations.freeTextAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.freeTextAnnotation.length; i++) {
                        pageCollections.freeTextAnnotation.push(importedAnnotations.freeTextAnnotation[i]);
                    }
                }
                if (importedAnnotations.signatureAnnotation && importedAnnotations.signatureAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.signatureAnnotation.length; i++) {
                        pageCollections.signatureAnnotation.push(importedAnnotations.signatureAnnotation[i]);
                    }
                }
                if (importedAnnotations.signatureInkAnnotation && importedAnnotations.signatureInkAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.signatureInkAnnotation.length; i++) {
                        pageCollections.signatureInkAnnotation.push(importedAnnotations.signatureInkAnnotation[i]);
                    }
                }
                this.documentAnnotationCollections[pageNumber] = pageCollections;
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public checkDocumentCollectionData(pageIndex: number, pageCollections?: any): any {
        // tslint:disable-next-line
        let importPageCollections: any;
        if (pageCollections) {
            importPageCollections = pageCollections;
        } else if (this.documentAnnotationCollections) {
            // tslint:disable-next-line
            let documetCollections: any = this.documentAnnotationCollections[pageIndex];
            if (documetCollections) {
                importPageCollections = cloneObject(documetCollections);
            }
        }
        if (importPageCollections) {
            // tslint:disable-next-line
            let textMarkupObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_textMarkup');
            // tslint:disable-next-line
            let shapeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape');
            // tslint:disable-next-line
            let measureShapeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape_measure');
            // tslint:disable-next-line
            let stampObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_stamp');
            // tslint:disable-next-line
            let stickyObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sticky');
            // tslint:disable-next-line
            let freeTextObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_freetext');
            // tslint:disable-next-line
            let inkObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_ink');
            if (this.isStorageExceed) {
                textMarkupObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
                shapeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
                measureShapeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
                stampObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
                stickyObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
                freeTextObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
                inkObject = this.annotationStorage[this.documentId + '_annotations_ink'];
            }
            if (importPageCollections.textMarkupAnnotation && importPageCollections.textMarkupAnnotation.length !== 0) {
                if (textMarkupObject) {
                    let annotationObject: IPageAnnotations[] = JSON.parse(textMarkupObject);
                    if (annotationObject) {
                        // tslint:disable-next-line:max-line-length
                        importPageCollections.textMarkupAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.textMarkupAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.shapeAnnotation && importPageCollections.shapeAnnotation.length !== 0) {
                if (shapeObject) {
                    let annotationObject: IPageAnnotations[] = JSON.parse(shapeObject);
                    if (annotationObject) {
                        // tslint:disable-next-line:max-line-length
                        importPageCollections.shapeAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.shapeAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.measureShapeAnnotation && importPageCollections.measureShapeAnnotation.length !== 0) {
                if (measureShapeObject) {
                    let annotationObject: IPageAnnotations[] = JSON.parse(measureShapeObject);
                    if (annotationObject) {
                        // tslint:disable-next-line:max-line-length
                        importPageCollections.measureShapeAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.measureShapeAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.stampAnnotations && importPageCollections.stampAnnotations.length !== 0) {
                if (stampObject) {
                    let annotationObject: IPageAnnotations[] = JSON.parse(stampObject);
                    if (annotationObject) {
                        // tslint:disable-next-line:max-line-length
                        importPageCollections.stampAnnotations = this.findImportedAnnotations(annotationObject, importPageCollections.stampAnnotations, pageIndex);
                    }
                }
            }
            if (importPageCollections.stickyNotesAnnotation && importPageCollections.stickyNotesAnnotation.length !== 0) {
                if (stickyObject) {
                    let annotationObject: IPageAnnotations[] = JSON.parse(stickyObject);
                    if (annotationObject) {
                        // tslint:disable-next-line:max-line-length
                        importPageCollections.stickyNotesAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.stickyNotesAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.freeTextAnnotation && importPageCollections.freeTextAnnotation.length !== 0) {
                if (freeTextObject) {
                    let annotationObject: IPageAnnotations[] = JSON.parse(freeTextObject);
                    if (annotationObject) {
                        // tslint:disable-next-line:max-line-length
                        importPageCollections.freeTextAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.freeTextAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.signatureInkAnnotation && importPageCollections.signatureInkAnnotation.length !== 0) {
                if (inkObject) {
                    let annotationObject: IPageAnnotations[] = JSON.parse(inkObject);
                    if (annotationObject) {
                        // tslint:disable-next-line:max-line-length
                        importPageCollections.signatureInkAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.signatureInkAnnotation, pageIndex);
                    }
                }
            }
            return importPageCollections;
        }
    }
    // tslint:disable-next-line
    private findImportedAnnotations(annotationCollection: any, importAnnotations: any, pageNumber: number) {
        // tslint:disable-next-line
        let pageCollections: any = null;
        for (let a: number = 0; a < annotationCollection.length; a++) {
            if (annotationCollection[a].pageIndex === pageNumber) {
                pageCollections = annotationCollection[a].annotations;
            }
        }
        if (pageCollections) {
            for (let i: number = 0; i < pageCollections.length; i++) {
                for (let j: number = 0; j < importAnnotations.length; j++) {
                    if (pageCollections[i].annotName === importAnnotations[j].AnnotName) {
                        importAnnotations.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
        }
        pageCollections = null;
        return importAnnotations;
    }

    // tslint:disable-next-line
    private drawPageAnnotations(annotation: any, pageIndex: number, isNewlyAdded?: boolean): void {
        if (isNewlyAdded) {
            annotation = annotation[pageIndex];
        }
        if (annotation) {
            if (annotation.textMarkupAnnotation && annotation.textMarkupAnnotation.length !== 0) {
                // tslint:disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_textMarkup');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
                }
                if (storeObject) {
                    let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                    if (annotObject) {
                        // tslint:disable-next-line:max-line-length
                        annotation.textMarkupAnnotation = this.checkAnnotationCollections(annotObject, annotation.textMarkupAnnotation, pageIndex);
                    }
                }
                annotation.textMarkupAnnotation = this.checkAnnotationCommentsCollections(annotation.textMarkupAnnotation, pageIndex);
                if (annotation.textMarkupAnnotation.length !== 0) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.renderAnnotations(pageIndex, null, null, annotation.textMarkupAnnotation, null, true);
                }
            }
            if (annotation.shapeAnnotation && annotation.shapeAnnotation.length !== 0) {
                // tslint:disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
                }
                if (storeObject) {
                    let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                    annotation.shapeAnnotation = this.checkAnnotationCollections(annotObject, annotation.shapeAnnotation, pageIndex);
                }
                annotation.shapeAnnotation = this.checkAnnotationCommentsCollections(annotation.shapeAnnotation, pageIndex);
                if (annotation.shapeAnnotation.length !== 0) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.renderAnnotations(pageIndex, annotation.shapeAnnotation, null, null, null, true);
                }
            }
            if (annotation.measureShapeAnnotation && annotation.measureShapeAnnotation.length !== 0) {
                // tslint:disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape_measure');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
                }
                if (storeObject) {
                    let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                    // tslint:disable-next-line:max-line-length
                    annotation.measureShapeAnnotation = this.checkAnnotationCollections(annotObject, annotation.measureShapeAnnotation, pageIndex);
                }
                annotation.measureShapeAnnotation = this.checkAnnotationCommentsCollections(annotation.measureShapeAnnotation, pageIndex);
                if (annotation.measureShapeAnnotation.length !== 0) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.renderAnnotations(pageIndex, null, annotation.measureShapeAnnotation, null, null, true);
                }
            }
            if (annotation.stampAnnotations && annotation.stampAnnotations.length !== 0) {
                // tslint:disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_stamp');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
                }
                if (storeObject) {
                    let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                    annotation.stampAnnotations = this.checkAnnotationCollections(annotObject, annotation.stampAnnotations, pageIndex);
                }
                annotation.stampAnnotations = this.checkAnnotationCommentsCollections(annotation.stampAnnotations, pageIndex);
                if (annotation.stampAnnotations.length !== 0) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotations(annotation.stampAnnotations, pageIndex, null, true);
                }
            }
            if (annotation.stickyNotesAnnotation && annotation.stickyNotesAnnotation.length !== 0) {
                // tslint:disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sticky');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
                }
                if (storeObject) {
                    let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                    // tslint:disable-next-line:max-line-length
                    annotation.stickyNotesAnnotation = this.checkAnnotationCollections(annotObject, annotation.stickyNotesAnnotation, pageIndex);
                }
                annotation.stickyNotesAnnotation = this.checkAnnotationCommentsCollections(annotation.stickyNotesAnnotation, pageIndex);
                if (annotation.stickyNotesAnnotation.length !== 0) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderStickyNotesAnnotations(annotation.stickyNotesAnnotation, pageIndex);
                }
            }
            if (annotation.freeTextAnnotation && annotation.freeTextAnnotation.length !== 0) {
                // tslint:disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_freetext');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
                }
                if (storeObject) {
                    let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                    annotation.freeTextAnnotation = this.checkAnnotationCollections(annotObject, annotation.freeTextAnnotation, pageIndex);
                }
                annotation.freeTextAnnotation = this.checkAnnotationCommentsCollections(annotation.freeTextAnnotation, pageIndex);
                if (annotation.freeTextAnnotation.length !== 0) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.renderFreeTextAnnotations(annotation.freeTextAnnotation, pageIndex, true);
                }
            }
            if (annotation.signatureAnnotation && annotation.signatureAnnotation.length !== 0) {
                // tslint:disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sign');
                let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                if (annotObject) {
                    annotation.signatureAnnotation = this.checkSignatureCollections(annotObject, annotation.signatureAnnotation, pageIndex);
                }
                this.signatureModule.renderExistingSignature(annotation.signatureAnnotation, pageIndex, true);
            }
            if (annotation.signatureInkAnnotation && annotation.signatureInkAnnotation.length !== 0) {
                // tslint:disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_ink');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_ink'];
                }
                if (storeObject) {
                    let annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                    // tslint:disable-next-line:max-line-length
                    annotation.signatureInkAnnotation = this.checkAnnotationCollections(annotObject, annotation.signatureInkAnnotation, pageIndex);
                }
                annotation.signatureInkAnnotation = this.checkAnnotationCommentsCollections(annotation.signatureInkAnnotation, pageIndex);
                if (annotation.signatureInkAnnotation.length !== 0) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.inkAnnotationModule.renderExistingInkSignature(annotation.signatureInkAnnotation, pageIndex, true);
                }
            }
        }
    }
    // tslint:disable-next-line
    private checkSignatureCollections(annotationCollection: any, annotation: any, pageNumber: number): any {
        // tslint:disable-next-line
        let pageCollections: any = null;
        for (let a: number = 0; a < annotationCollection.length; a++) {
            if (annotationCollection[a].pageIndex === pageNumber) {
                pageCollections = annotationCollection[a].annotations;
            }
        }
        if (pageCollections) {
            for (let i: number = 0; i < pageCollections.length; i++) {
                for (let j: number = 0; j < annotation.length; j++) {
                    if (pageCollections[i].signatureName === annotation[j].SignatureName) {
                        annotation.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
        }
        pageCollections = null;
        return annotation;
    }
    // tslint:disable-next-line
    private checkAnnotationCollections(annotationCollection: any, annotation: any, pageNumber: number): any {
        // tslint:disable-next-line
        let pageCollections: any = null;
        for (let a: number = 0; a < annotationCollection.length; a++) {
            if (annotationCollection[a].pageIndex === pageNumber) {
                pageCollections = annotationCollection[a].annotations;
            }
        }
        if (pageCollections) {
            for (let i: number = 0; i < pageCollections.length; i++) {
                for (let j: number = 0; j < annotation.length; j++) {
                    if (pageCollections[i].annotName === annotation[j].AnnotName) {
                        annotation.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
        }
        pageCollections = null;
        return annotation;
    }

    // tslint:disable-next-line
    private checkAnnotationCommentsCollections(annotation: any, pageNumber: number): any {
        if (this.annotationComments) {
            // tslint:disable-next-line
            let annotationCollections: any = this.annotationComments[pageNumber];
            annotationCollections = this.selectAnnotationCollections(annotationCollections);
            if (annotationCollections) {
                for (let i: number = 0; i < annotationCollections.length; i++) {
                    for (let j: number = 0; j < annotation.length; j++) {
                        if (annotationCollections[i].AnnotName === annotation[j].AnnotName) {
                            annotation.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
            }
            annotationCollections = null;
        }
        return annotation;
    }

    // tslint:disable-next-line
    private selectAnnotationCollections(pageAnnotations: any): void {
        // tslint:disable-next-line
        let pageCollections: any = [];
        if (pageAnnotations) {
            if (pageAnnotations.textMarkupAnnotation && pageAnnotations.textMarkupAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.textMarkupAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.textMarkupAnnotation[i]);
                }
            }
            if (pageAnnotations.shapeAnnotation && pageAnnotations.shapeAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.shapeAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.shapeAnnotation[i]);
                }
            }
            if (pageAnnotations.measureShapeAnnotation && pageAnnotations.measureShapeAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.measureShapeAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.measureShapeAnnotation[i]);
                }
            }
            if (pageAnnotations.stampAnnotations && pageAnnotations.stampAnnotations.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.stampAnnotations.length; i++) {
                    pageCollections.push(pageAnnotations.stampAnnotations[i]);
                }
            }
            if (pageAnnotations.stickyNotesAnnotation && pageAnnotations.stickyNotesAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.stickyNotesAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.stickyNotesAnnotation[i]);
                }
            }
            if (pageAnnotations.freeTextAnnotation && pageAnnotations.freeTextAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.freeTextAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.freeTextAnnotation[i]);
                }
            }
            if (pageAnnotations.signatureInkAnnotation && pageAnnotations.signatureInkAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.signatureInkAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.signatureInkAnnotation[i]);
                }
            }
        }
        return pageCollections;
    }

    private saveImportedAnnotations(): void {
        // tslint:disable-next-line
        let textMarkupObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_textMarkup');
        // tslint:disable-next-line
        let shapeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape');
        // tslint:disable-next-line
        let measureShapeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape_measure');
        // tslint:disable-next-line
        let stampObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_stamp');
        // tslint:disable-next-line
        let stickyObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sticky');
        // tslint:disable-next-line
        let freeTextObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_freetext');
        // tslint:disable-next-line
        let inkObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_ink');
        if (this.isStorageExceed) {
            textMarkupObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
            shapeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
            measureShapeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
            stampObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
            stickyObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
            freeTextObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
            inkObject = this.annotationStorage[this.documentId + '_annotations_ink'];
        }
        // tslint:disable-next-line:max-line-length
        this.downloadCollections = { textMarkupObject: textMarkupObject, shapeObject: shapeObject, measureShapeObject: measureShapeObject, stampObject: stampObject, stickyObject: stickyObject, freeTextObject: freeTextObject, inkObject: inkObject };
        if (this.documentAnnotationCollections) {
            for (let i: number = 0; i < this.pageCount; i++) {
                if (this.documentAnnotationCollections[i]) {
                    // tslint:disable-next-line
                    let pageCollections: any = cloneObject(this.documentAnnotationCollections[i]);
                    pageCollections = this.checkDocumentCollectionData(i, pageCollections);
                    this.savePageAnnotations(pageCollections, i);
                }
            }
        }
    }

    // tslint:disable-next-line
    private savePageAnnotations(annotation: any, pageIndex: number): void {
        if (annotation.textMarkupAnnotation.length !== 0) {
            for (let s: number = 0; s < annotation.textMarkupAnnotation.length; s++) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.saveImportedTextMarkupAnnotations(annotation.textMarkupAnnotation[s], pageIndex);
            }
        }
        if (annotation.shapeAnnotation.length !== 0) {
            for (let s: number = 0; s < annotation.shapeAnnotation.length; s++) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.shapeAnnotationModule.saveImportedShapeAnnotations(annotation.shapeAnnotation[s], pageIndex);
            }
        }
        if (annotation.measureShapeAnnotation.length !== 0) {
            for (let s: number = 0; s < annotation.measureShapeAnnotation.length; s++) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.measureAnnotationModule.saveImportedMeasureAnnotations(annotation.measureShapeAnnotation[s], pageIndex);
            }
        }
        if (annotation.stampAnnotations.length !== 0) {
            for (let s: number = 0; s < annotation.stampAnnotations.length; s++) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.stampAnnotationModule.saveImportedStampAnnotations(annotation.stampAnnotations[s], pageIndex);
            }
        }
        if (annotation.stickyNotesAnnotation.length !== 0) {
            for (let s: number = 0; s < annotation.stickyNotesAnnotation.length; s++) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.saveImportedStickyNotesAnnotations(annotation.stickyNotesAnnotation[s], pageIndex);
            }
        }
        if (annotation.freeTextAnnotation.length !== 0) {
            for (let s: number = 0; s < annotation.freeTextAnnotation.length; s++) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.freeTextAnnotationModule.saveImportedFreeTextAnnotations(annotation.freeTextAnnotation[s], pageIndex);
            }
        }
    }

    private updateDocumentAnnotationCollections(): void {
        window.sessionStorage.removeItem(this.documentId + '_annotations_textMarkup');
        window.sessionStorage.removeItem(this.documentId + '_annotations_shape');
        window.sessionStorage.removeItem(this.documentId + '_annotations_shape_measure');
        window.sessionStorage.removeItem(this.documentId + '_annotations_stamp');
        window.sessionStorage.removeItem(this.documentId + '_annotations_sticky');
        window.sessionStorage.removeItem(this.documentId + '_annotations_freetext');
        window.sessionStorage.removeItem(this.documentId + '_annotations_ink');
        if (this.downloadCollections) {
            if (this.downloadCollections.textMarkupObject) {
                window.sessionStorage.setItem(this.documentId + '_annotations_textMarkup', this.downloadCollections.textMarkupObject);
            }
            if (this.downloadCollections.shapeObject) {
                window.sessionStorage.setItem(this.documentId + '_annotations_shape', this.downloadCollections.shapeObject);
            }
            if (this.downloadCollections.measureShapeObject) {
                window.sessionStorage.setItem(this.documentId + '_annotations_shape_measure', this.downloadCollections.measureShapeObject);
            }
            if (this.downloadCollections.stampObject) {
                window.sessionStorage.setItem(this.documentId + '_annotations_stamp', this.downloadCollections.stampObject);
            }
            if (this.downloadCollections.stickyObject) {
                window.sessionStorage.setItem(this.documentId + '_annotations_sticky', this.downloadCollections.stickyObject);
            }
            if (this.downloadCollections.freeTextObject) {
                window.sessionStorage.setItem(this.documentId + '_annotations_freetext', this.downloadCollections.freeTextObject);
            }
            if (this.downloadCollections.inkObject) {
                window.sessionStorage.setItem(this.documentId + '_annotations_ink', this.downloadCollections.inkObject);
            }
            if (this.isStorageExceed) {
                this.annotationStorage[this.documentId + '_annotations_textMarkup'] = this.downloadCollections.textMarkupObject;
                this.annotationStorage[this.documentId + '_annotations_shape'] = this.downloadCollections.shapeObject;
                this.annotationStorage[this.documentId + '_annotations_shape_measure'] = this.downloadCollections.measureShapeObject;
                this.annotationStorage[this.documentId + '_annotations_stamp'] = this.downloadCollections.stampObject;
                this.annotationStorage[this.documentId + '_annotations_sticky'] = this.downloadCollections.stickyObject;
                this.annotationStorage[this.documentId + '_annotations_freetext'] = this.downloadCollections.freeTextObject;
                this.annotationStorage[this.documentId + '_annotations_ink'] = this.downloadCollections.inkObject;
            }
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public createAnnotationJsonData(): any {
        // tslint:disable-next-line
        let annotationCollection: any = {};
        let textMarkupAnnotationCollection: string;
        let shapeAnnotations: string;
        let calibrateAnnotations: string;
        let stampAnnotationCollection: string;
        let stickyAnnotationCollection: string;
        let freeTextAnnotationCollection: string;
        let signaturCollection: string;
        let signaturInkCollection: string;
        this.saveImportedAnnotations();
        if (this.isTextMarkupAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            textMarkupAnnotationCollection = this.pdfViewer.annotationModule.textMarkupAnnotationModule.saveTextMarkupAnnotations();
        }
        if (this.isShapeAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            shapeAnnotations = this.pdfViewer.annotationModule.shapeAnnotationModule.saveShapeAnnotations();
        }
        if (this.isCalibrateAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            calibrateAnnotations = this.pdfViewer.annotationModule.measureAnnotationModule.saveMeasureShapeAnnotations();
        }
        if (this.isStampAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            stampAnnotationCollection = this.pdfViewer.annotationModule.stampAnnotationModule.saveStampAnnotations();
        }
        if (this.isCommentAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            stickyAnnotationCollection = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.saveStickyAnnotations();
        }
        if (this.isFreeTextAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            freeTextAnnotationCollection = this.pdfViewer.annotationModule.freeTextAnnotationModule.saveFreeTextAnnotations();
        }
        if (this.isInkAnnotationModule()) {
            // tslint:disable-next-line
            signaturInkCollection =  this.pdfViewer.annotationModule.inkAnnotationModule.saveInkSignature();
        }
        if (this.pdfViewer.isSignatureEditable) {
            // tslint:disable-next-line
            signaturCollection = this.signatureModule.saveSignature();
        } else {
            // tslint:disable-next-line
            let annotations: Array<any> = new Array();
            for (let j: number = 0; j < this.pageCount; j++) {
                annotations[j] = [];
            }
            signaturCollection = JSON.stringify(annotations);
        }
        for (let s: number = 0; s < this.pageCount; s++) {
            // tslint:disable-next-line:max-line-length
            let annotation: IAnnotationCollection = {
                textMarkupAnnotation: JSON.parse(textMarkupAnnotationCollection)[s], shapeAnnotation: JSON.parse(shapeAnnotations)[s],
                measureShapeAnnotation: JSON.parse(calibrateAnnotations)[s], stampAnnotations: JSON.parse(stampAnnotationCollection)[s],
                // tslint:disable-next-line:max-line-length
                stickyNotesAnnotation: JSON.parse(stickyAnnotationCollection)[s], freeTextAnnotation: JSON.parse(freeTextAnnotationCollection)[s], signatureAnnotation: JSON.parse(signaturCollection)[s], signatureInkAnnotation: JSON.parse(signaturInkCollection)[s]
            };
            annotationCollection[s] = annotation;
        }
        return JSON.stringify(annotationCollection);
    }

    // tslint:disable-next-line
    private combineImportedData(excistingImportAnnotation: any, newlyImportAnnotation: any): any {
        for (let i: number = 0; i < this.pageCount; i++) {
            if (newlyImportAnnotation[i]) {
                if (excistingImportAnnotation[i]) {
                    if (newlyImportAnnotation[i].textMarkupAnnotation && newlyImportAnnotation[i].textMarkupAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].textMarkupAnnotation) {
                            // tslint:disable-next-line:max-line-length
                            newlyImportAnnotation[i].textMarkupAnnotation = this.checkImportedData(excistingImportAnnotation[i].textMarkupAnnotation, newlyImportAnnotation[i].textMarkupAnnotation, i);
                            if (newlyImportAnnotation[i].textMarkupAnnotation.length !== 0) {
                                // tslint:disable-next-line:max-line-length
                                excistingImportAnnotation[i].textMarkupAnnotation = excistingImportAnnotation[i].textMarkupAnnotation.concat(newlyImportAnnotation[i].textMarkupAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[i].textMarkupAnnotation = newlyImportAnnotation[i].textMarkupAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[i].shapeAnnotation && newlyImportAnnotation[i].shapeAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].shapeAnnotation) {
                            // tslint:disable-next-line:max-line-length
                            newlyImportAnnotation[i].shapeAnnotation = this.checkImportedData(excistingImportAnnotation[i].shapeAnnotation, newlyImportAnnotation[i].shapeAnnotation, i);
                            if (newlyImportAnnotation[i].shapeAnnotation.length !== 0) {
                                // tslint:disable-next-line:max-line-length
                                excistingImportAnnotation[i].shapeAnnotation = excistingImportAnnotation[i].shapeAnnotation.concat(newlyImportAnnotation[i].shapeAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[i].shapeAnnotation = newlyImportAnnotation[i].shapeAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[i].measureShapeAnnotation && newlyImportAnnotation[i].measureShapeAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].measureShapeAnnotation) {
                            // tslint:disable-next-line:max-line-length
                            newlyImportAnnotation[i].measureShapeAnnotation = this.checkImportedData(excistingImportAnnotation[i].measureShapeAnnotation, newlyImportAnnotation[i].measureShapeAnnotation, i);
                            if (newlyImportAnnotation[i].measureShapeAnnotation.length !== 0) {
                                // tslint:disable-next-line:max-line-length
                                excistingImportAnnotation[i].measureShapeAnnotation = excistingImportAnnotation[i].measureShapeAnnotation.concat(newlyImportAnnotation[i].measureShapeAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[i].measureShapeAnnotation = newlyImportAnnotation[i].measureShapeAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[i].stampAnnotations && newlyImportAnnotation[i].stampAnnotations.length !== 0) {
                        if (excistingImportAnnotation[i].stampAnnotations) {
                            // tslint:disable-next-line:max-line-length
                            newlyImportAnnotation[i].stampAnnotations = this.checkImportedData(excistingImportAnnotation[i].stampAnnotations, newlyImportAnnotation[i].stampAnnotations, i);
                            if (newlyImportAnnotation[i].stampAnnotations.length !== 0) {
                                // tslint:disable-next-line:max-line-length
                                excistingImportAnnotation[i].stampAnnotations = excistingImportAnnotation[i].stampAnnotations.concat(newlyImportAnnotation[i].stampAnnotations);
                            }
                        } else {
                            excistingImportAnnotation[i].stampAnnotations = newlyImportAnnotation[i].stampAnnotations;
                        }
                    }
                    if (newlyImportAnnotation[i].stickyNotesAnnotation && newlyImportAnnotation[i].stickyNotesAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].stickyNotesAnnotation) {
                            // tslint:disable-next-line:max-line-length
                            newlyImportAnnotation[i].stickyNotesAnnotation = this.checkImportedData(excistingImportAnnotation[i].stickyNotesAnnotation, newlyImportAnnotation[i].stickyNotesAnnotation, i);
                            if (newlyImportAnnotation[i].stickyNotesAnnotation.length !== 0) {
                                // tslint:disable-next-line:max-line-length
                                excistingImportAnnotation[i].stickyNotesAnnotation = excistingImportAnnotation[i].stickyNotesAnnotation.concat(newlyImportAnnotation[i].stickyNotesAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[i].stickyNotesAnnotation = newlyImportAnnotation[i].stickyNotesAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[i].freeTextAnnotation && newlyImportAnnotation[i].freeTextAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].freeTextAnnotation) {
                            // tslint:disable-next-line:max-line-length
                            newlyImportAnnotation[i].freeTextAnnotation = this.checkImportedData(excistingImportAnnotation[i].freeTextAnnotation, newlyImportAnnotation[i].freeTextAnnotation, i);
                            if (newlyImportAnnotation[i].freeTextAnnotation.length !== 0) {
                                // tslint:disable-next-line:max-line-length
                                excistingImportAnnotation[i].freeTextAnnotation = excistingImportAnnotation[i].freeTextAnnotation.concat(newlyImportAnnotation[i].freeTextAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[i].freeTextAnnotation = newlyImportAnnotation[i].freeTextAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[i].signatureInkAnnotation && newlyImportAnnotation[i].signatureInkAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].signatureInkAnnotation) {
                            // tslint:disable-next-line:max-line-length
                            newlyImportAnnotation[i].signatureInkAnnotation = this.checkImportedData(excistingImportAnnotation[i].signatureInkAnnotation, newlyImportAnnotation[i].signatureInkAnnotation, i);
                            if (newlyImportAnnotation[i].signatureInkAnnotation.length !== 0) {
                                // tslint:disable-next-line:max-line-length
                                excistingImportAnnotation[i].signatureInkAnnotation = excistingImportAnnotation[i].signatureInkAnnotation.concat(newlyImportAnnotation[i].signatureInkAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[i].signatureInkAnnotation = newlyImportAnnotation[i].signatureInkAnnotation;
                        }
                    }
                } else {
                    // tslint:disable-next-line:max-line-length
                    let annotation: IAnnotationCollection = {
                        textMarkupAnnotation: newlyImportAnnotation[i].textMarkupAnnotation, shapeAnnotation: newlyImportAnnotation[i].shapeAnnotation,
                        // tslint:disable-next-line:max-line-length
                        measureShapeAnnotation: newlyImportAnnotation[i].measureShapeAnnotation, stampAnnotations: newlyImportAnnotation[i].stampAnnotations,
                        stickyNotesAnnotation: newlyImportAnnotation[i].stickyNotesAnnotation, freeTextAnnotation: newlyImportAnnotation[i].freeTextAnnotation,
                        signatureInkAnnotation: newlyImportAnnotation[i].signatureInkAnnotation
                    };
                    excistingImportAnnotation[i] = annotation;
                }
            }
        }
        return excistingImportAnnotation;
    }

    private updateExportItem(): boolean {
        // tslint:disable-next-line
        let shapeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape');
        // tslint:disable-next-line
        let measureObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape_measure');
        // tslint:disable-next-line
        let stampObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_stamp');
        // tslint:disable-next-line
        let stickyObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sticky');
        // tslint:disable-next-line
        let textMarkupObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_textMarkup');
        // tslint:disable-next-line
        let freeTextObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_freetext');
        let isSignatureEditable: boolean = false;
         // tslint:disable-next-line
        let inkAnnotationObjct: any = window.sessionStorage.getItem(this.documentId + '_annotations_ink');
        if (this.pdfViewer.isSignatureEditable) {
            // tslint:disable-next-line
            let signatureObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sign');
            if (signatureObject) {
                isSignatureEditable = true;
            }
        }
         // tslint:disable-next-line:max-line-length
        if (shapeObject || measureObject || stampObject || stickyObject || textMarkupObject || freeTextObject || this.isImportAction || this.isStorageExceed || isSignatureEditable || inkAnnotationObjct) {
            return true;
        } else {
            return false;
        }
    }
    private isFreeTextAnnotation(annotations: PdfAnnotationBaseModel[]): boolean {
        let resut: boolean = false;
        if (annotations && annotations.length > 0) {
            resut = annotations.some((s: PdfAnnotationBaseModel) => s.shapeAnnotationType === 'FreeText' && s.subject === 'Text Box');
        }
        return resut;
    }

    // tslint:disable-next-line
    private checkImportedData(existingCollection: any, newCollection: any, pageIndex?: number): any {
        for (let i: number = 0; i < existingCollection.length; i++) {
            for (let j: number = 0; j < newCollection.length; j++) {
                if (existingCollection[i].AnnotName === newCollection[j].AnnotName) {
                    newCollection.splice(j, 1);
                    j = j - 1;
                }
            }
        }
        if (this.annotationComments) {
            // tslint:disable-next-line
            let annotationCollections: any = this.annotationComments[pageIndex];
            annotationCollections = this.selectAnnotationCollections(annotationCollections);
            if (annotationCollections) {
                for (let i: number = 0; i < annotationCollections.length; i++) {
                    for (let j: number = 0; j < newCollection.length; j++) {
                        if (annotationCollections[i].AnnotName === newCollection[j].AnnotName) {
                            newCollection.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
            }
        }
        return newCollection;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public checkAnnotationWidth(points: any): object {
        let width: number;
        let height: number;
        let minWidth: number;
        let maxWidth: number;
        let minHeight: number;
        let maxHeight: number;
        for (let i: number = 0; i < points.length; i++) {
            if (!minWidth) {
                minWidth = points[i].x;
                maxWidth = points[i].x;
                minHeight = points[i].y;
                maxHeight = points[i].y;
            } else {
                if (minWidth > points[i].x) {
                    minWidth = points[i].x;
                } else if (maxWidth < points[i].x) {
                    maxWidth = points[i].x;
                }
                if (minHeight > points[i].y) {
                    minHeight = points[i].y;
                } else if (maxHeight < points[i].y) {
                    maxHeight = points[i].y;
                }
            }
        }
        width = maxWidth - minWidth;
        height = maxHeight - minHeight;
        return { width: width, height: height };
    }


    public deleteAnnotations(): void {
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotations = [];
            this.pdfViewer.zIndexTable = [];
            this.pdfViewer.annotationCollection = [];
            this.pdfViewer.signatureCollection = [];
            // tslint:disable-next-line
            let annotationCollection: any = this.createAnnotationsCollection();
            this.annotationComments = annotationCollection;
            this.documentAnnotationCollections = annotationCollection;
            this.annotationRenderredList = [];
            window.sessionStorage.removeItem(this.documentId + '_annotations_shape');
            window.sessionStorage.removeItem(this.documentId + '_annotations_shape_measure');
            window.sessionStorage.removeItem(this.documentId + '_annotations_stamp');
            window.sessionStorage.removeItem(this.documentId + '_annotations_sticky');
            window.sessionStorage.removeItem(this.documentId + '_annotations_textMarkup');
            window.sessionStorage.removeItem(this.documentId + '_annotations_freetext');
            window.sessionStorage.removeItem(this.documentId + '_annotations_sign');
            window.sessionStorage.removeItem(this.documentId + '_annotations_ink');
            for (let i: number = 0; i < this.pageCount; i++) {
                this.pdfViewer.annotationModule.renderAnnotations(i, null, null, null);
                this.pdfViewer.renderDrawing(undefined, i);
                this.pdfViewer.clearSelection(i);
                let accordionContent: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + (i + 1));
                if (accordionContent) {
                    accordionContent.remove();
                }
                // tslint:disable-next-line:max-line-length
                let accordionContentContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContentContainer');
                if (accordionContentContainer) {
                    if (accordionContentContainer.childElementCount === 0) {
                        accordionContentContainer.style.display = 'none';
                        if (document.getElementById(this.pdfViewer.element.id + '_commentsPanelText')) {
                            // tslint:disable-next-line:max-line-length
                            this.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], false);
                            document.getElementById(this.pdfViewer.element.id + '_commentsPanelText').style.display = 'block';
                        }
                    }
                }
            }
            this.isImportedAnnotation = false;
            this.isImportAction = false;
            this.importedAnnotation = [];
            this.annotationPageList = [];
            this.pdfViewer.annotationModule.freeTextAnnotationModule.freeTextPageNumbers = [];
            this.pdfViewer.annotationModule.stampAnnotationModule.stampPageNumber = [];
            this.pdfViewer.annotation.inkAnnotationModule.inkAnnotationindex = [];
            this.isAnnotationCollectionRemoved = true;
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public createAnnotationsCollection(pageNumber?: number, isObject?: boolean): any {
        // tslint:disable-next-line
        let annotationCollectionList: any = [];
        if (!isObject) {
            for (let i: number = 0; i < this.pageCount; i++) {
                let annotation: IAnnotationCollection = {
                    // tslint:disable-next-line:max-line-length
                    textMarkupAnnotation: [], shapeAnnotation: [], measureShapeAnnotation: [], stampAnnotations: [], stickyNotesAnnotation: [], freeTextAnnotation: [], signatureAnnotation: [], signatureInkAnnotation: [],
                };
                annotationCollectionList.push(annotation);
            }
        } else {
            annotationCollectionList = {};
            let annotation: IAnnotationCollection = {
                // tslint:disable-next-line:max-line-length
                textMarkupAnnotation: [], shapeAnnotation: [], measureShapeAnnotation: [], stampAnnotations: [], stickyNotesAnnotation: [], freeTextAnnotation: [], signatureAnnotation: [], signatureInkAnnotation: [],
            };
            annotationCollectionList[pageNumber] = annotation;
        }
        return annotationCollectionList;
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public addAnnotation(importAnnotation: any): void {
        // tslint:disable-next-line
        let pdfAnnotation: any = {};
        // tslint:disable-next-line
        let documentCollections: any;
        if (importAnnotation) {
            let isAnnotationObject: boolean = false;
            let annotationCount: number = 1;
            if (importAnnotation.shapeAnnotationType || importAnnotation.author) {
                isAnnotationObject = true;
                documentCollections = this.createAnnotationsCollection(importAnnotation.pageNumber, true);
            } else {
                if (importAnnotation.length) {
                    annotationCount = importAnnotation.length;
                    documentCollections = this.createAnnotationsCollection();
                } else {
                    isAnnotationObject = true;
                    documentCollections = this.createAnnotationsCollection(importAnnotation.pageNumber, true);
                }
            }
            for (let a: number = 0; a < annotationCount; a++) {
                // tslint:disable-next-line
                let annotation: any;
                if (isAnnotationObject) {
                    annotation = importAnnotation;
                } else {
                    annotation = importAnnotation[a];
                }
                // tslint:disable-next-line
                let newAnnotation: any = {};
                newAnnotation.ShapeAnnotationType = annotation.shapeAnnotationType;
                newAnnotation.AnnotationAddMode = annotation.annotationAddMode;
                newAnnotation.Author = annotation.author;
                newAnnotation.AnnotationSelectorSettings = annotation.annotationSelectorSettings;
                newAnnotation.AnnotationSettings = annotation.annotationSettings;
                newAnnotation.PageNumber = annotation.pageNumber;
                newAnnotation.ModifiedDate = annotation.modifiedDate;
                newAnnotation.Subject = annotation.subject;
                newAnnotation.Note = annotation.note;
                newAnnotation.AnnotName = annotation.annotationId;
                newAnnotation.Comments = annotation.comments;
                if (annotation.comments && annotation.comments.length > 0) {
                    // tslint:disable-next-line
                    let comments: any = [];
                    for (let i: number = 0; i < annotation.comments.length; i++) {
                        comments.push(this.updateComments(annotation, annotation.comments[i]));
                    }
                    newAnnotation.Comments = comments;
                }
                if (annotation.review) {
                    newAnnotation.State = annotation.review.state;
                    newAnnotation.StateModel = annotation.review.stateModel;
                }
                newAnnotation.CustomData = annotation.customData;
                newAnnotation.Opacity = annotation.opacity;
                if (annotation.shapeAnnotationType === 'textMarkup') {
                    newAnnotation.AnnotType = 'textMarkup';
                    newAnnotation.Color = annotation.color;
                    newAnnotation.IsMultiSelect = annotation.isMultiSelect;
                    newAnnotation.TextMarkupAnnotationType = annotation.textMarkupAnnotationType;
                    newAnnotation.TextMarkupContent = annotation.textMarkupContent;
                    newAnnotation.TextMarkupStartIndex = annotation.textMarkupStartIndex;
                    newAnnotation.TextMarkupEndIndex = annotation.textMarkupEndIndex;
                    if (annotation.rect) {
                        newAnnotation.Rect = this.convertBounds(annotation.rect);
                    }
                    if (annotation.bounds && annotation.bounds.length >= 1) {
                        // tslint:disable-next-line
                        let bounds: Array<any> = new Array();
                        for (let i: number = 0; i < annotation.bounds.length; i++) {
                            bounds.push(this.convertBounds(annotation.bounds[i]));
                        }
                        newAnnotation.Bounds = bounds;
                    }
                    documentCollections[annotation.pageNumber].textMarkupAnnotation.push(newAnnotation);
                } else if (annotation.shapeAnnotationType === 'sticky') {
                    newAnnotation.AnnotType = 'sticky';
                    newAnnotation.Icon = 'Comment';
                    newAnnotation.Bounds = this.convertBounds(annotation.bounds);
                    newAnnotation.StrokeColor = annotation.strokeColor;
                    newAnnotation.Color = annotation.color;
                    documentCollections[annotation.pageNumber].stickyNotesAnnotation.push(newAnnotation);
                } else if (annotation.shapeAnnotationType === 'FreeText') {
                    newAnnotation.AnnotType = 'freeText';
                    newAnnotation.Name = annotation.annotationId;
                    newAnnotation.MarkupText = annotation.dynamicText;
                    newAnnotation.Text = annotation.dynamicText;
                    newAnnotation.TextAlign = annotation.textAlign;
                    newAnnotation.Thickness = annotation.thicknes;
                    newAnnotation.StrokeColor = annotation.strokeColor;
                    newAnnotation.FillColor = annotation.fillColor;
                    newAnnotation.FontColor = annotation.fontColor;
                    newAnnotation.FontSize = annotation.fontSize;
                    newAnnotation.FontFamily = annotation.fontFamily;
                    newAnnotation.Rotate = annotation.rotateAngle;
                    newAnnotation.Bounds = this.convertBounds(annotation.bounds);
                    // tslint:disable-next-line:max-line-length
                    newAnnotation.Font = { 'Name': annotation.fontFamily, 'Size': annotation.fontSize, 'Bold': annotation.font.isBold, 'Italic': annotation.font.isItalic, 'Strikeout': annotation.font.isStrikeout, 'Underline': annotation.font.isUnderline };
                    documentCollections[annotation.pageNumber].freeTextAnnotation.push(newAnnotation);
                } else if (annotation.shapeAnnotationType === 'stamp') {
                    newAnnotation.AnnotType = 'stamp';
                    newAnnotation.Icon = annotation.icon;
                    newAnnotation.isDynamic = false;
                    newAnnotation.Rect = this.convertBounds(annotation.bounds);
                    newAnnotation.RotateAngle = annotation.rotateAngle;
                    newAnnotation.FillColor = annotation.fillColor;
                    newAnnotation.StrokeColor = annotation.strokeColor;
                    newAnnotation.StampAnnotationType = annotation.stampAnnotationType;
                    newAnnotation.CreationDate = annotation.creationDate;
                    if (annotation.stampAnnotationType === 'image') {
                        // tslint:disable-next-line
                        let apperarance: any = [];
                        // tslint:disable-next-line
                        let imageData: any = { 'imagedata': annotation.stampAnnotationPath };
                        apperarance.push(imageData);
                        newAnnotation.Apperarance = apperarance;
                    }
                    if (annotation.isDynamicStamp) {
                        newAnnotation.IsDynamic = true;
                        newAnnotation.StrokeColor = annotation.stampFillcolor;
                        // tslint:disable-next-line
                        let apperarance: any = [];
                        // tslint:disable-next-line
                        let imageData: any = { 'type': 'string', 'text': annotation.dynamicText, 'currentFontname': '95b303ab-d397-438a-83af-e2ff8a9900f1', 'baseFontName': 'Helvetica-BoldOblique', 'fontSize': 10, 'isImport': true };
                        apperarance.push(imageData);
                        newAnnotation.Apperarance = apperarance;
                    }
                    documentCollections[annotation.pageNumber].stampAnnotations.push(newAnnotation);
                } else if (annotation.shapeAnnotationType === 'Ink' || annotation.shapeAnnotationType === 'Signature') {
                    newAnnotation.StrokeColor = annotation.strokeColor;
                    newAnnotation.FillColor = annotation.fillColor;
                    newAnnotation.Thickness = annotation.thickness;
                    newAnnotation.Bounds = this.convertBounds(annotation.bounds);
                    newAnnotation.PathData = annotation.data;
                    newAnnotation.pageIndex = annotation.pageNumber;
                    if (annotation.shapeAnnotationType === 'Ink') {
                        newAnnotation.AnnotType = 'Ink';
                        newAnnotation.IsPathData = true;
                        documentCollections[annotation.pageNumber].signatureInkAnnotation.push(newAnnotation);
                    }
                    if (annotation.shapeAnnotationType === 'Signature') {
                        newAnnotation.AnnotType = 'Signature';
                        newAnnotation.SignatureName = annotation.annotationId;
                        newAnnotation.IsSignature = true;
                        documentCollections[annotation.pageNumber].signatureAnnotation.push(newAnnotation);
                    }
                } else {
                    // tslint:disable-next-line:max-line-length
                    if (annotation.shapeAnnotationType === 'Line' || annotation.shapeAnnotationType === 'LineWidthArrowHead' || annotation.shapeAnnotationType === 'Polyline' || annotation.shapeAnnotationType === 'Polygon' || annotation.shapeAnnotationType === 'Polyline' || annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Oval' || annotation.shapeAnnotationType === 'Rectangle' || annotation.shapeAnnotationType === 'Square' || annotation.shapeAnnotationType === 'Ellipse') {
                        newAnnotation.AnnotType = 'shape';
                        newAnnotation.StrokeColor = annotation.strokeColor;
                        newAnnotation.FillColor = annotation.fillColor;
                        newAnnotation.Thickness = annotation.thickness;
                        newAnnotation.BorderStyle = annotation.borderStyle;
                        newAnnotation.BorderDashArray = annotation.borderDashArray;
                        newAnnotation.RotateAngle = annotation.rotateAngle;
                        newAnnotation.IsCloudShape = annotation.isCloudShape;
                        newAnnotation.CloudIntensity = annotation.cloudIntensity;
                        newAnnotation.RectangleDifference = annotation.rectangleDifference;
                        newAnnotation.LineHeadStart = annotation.lineHeadStart;
                        newAnnotation.LineHeadEnd = annotation.lineHeadEnd;
                        newAnnotation.IsLocked = annotation.isLocked;
                        newAnnotation.EnableShapeLabel = annotation.enableShapeLabel;
                        newAnnotation.LabelContent = annotation.labelContent;
                        newAnnotation.LabelFillColor = annotation.labelFillColor;
                        newAnnotation.LabelBorderColor = annotation.labelBorderColor;
                        newAnnotation.FontColor = annotation.fontColor;
                        newAnnotation.FontSize = annotation.fontSize;
                        newAnnotation.LabelBounds = this.convertBounds(annotation.labelBounds);
                        newAnnotation.LabelSettings = annotation.labelSettings;
                        newAnnotation.Bounds = this.convertBounds(annotation.bounds);
                        newAnnotation.LeaderLength = annotation.leaderLength;
                        newAnnotation.LeaderLineExtenstion = annotation.leaderLineExtension;
                        if (annotation.vertexPoints && annotation.vertexPoints.length >= 1) {
                            // tslint:disable-next-line
                            let points: Array<any> = new Array();
                            for (let i: number = 0; i < annotation.vertexPoints.length; i++) {
                                points.push(this.convertVertexPoints(annotation.vertexPoints[i]));
                            }
                            newAnnotation.VertexPoints = points;
                        }
                        newAnnotation.EnableShapeLabel = annotation.enableShapeLabel;
                        // tslint:disable-next-line:max-line-length
                        if (annotation.subject === 'Distance calculation' || annotation.subject === 'Perimeter calculation' || annotation.subject === 'Area calculation' || annotation.subject === 'Radius calculation' || annotation.subject === 'Volume calculation') {
                            newAnnotation.AnnotType = 'shape_measure';
                            // tslint:disable-next-line
                            let calibrate: any = annotation.calibrate;
                            if (calibrate) {
                                // tslint:disable-next-line
                                newAnnotation.Calibrate = {
                                    'Ratio': calibrate.ratio, 'X': [{ 'Unit': calibrate.x[0].unit, 'ConversionFactor': calibrate.x[0].conversionFactor, 'FractionalType': calibrate.x[0].fractionalType, 'Denominator': calibrate.x[0].denominator, 'FormatDenominator': calibrate.x[0].formatDenominator }],
                                    // tslint:disable-next-line
                                    'Distance': [{ 'Unit': calibrate.distance[0].unit, 'ConversionFactor': calibrate.distance[0].conversionFactor, 'FractionalType': calibrate.distance[0].fractionalType, 'Denominator': calibrate.distance[0].denominator, 'FormatDenominator': calibrate.distance[0].formatDenominator }],
                                    // tslint:disable-next-line
                                    'Area': [{ 'Unit': calibrate.area[0].unit, 'ConversionFactor': calibrate.area[0].conversionFactor, 'FractionalType': calibrate.area[0].fractionalType, 'Denominator': calibrate.area[0].denominator, 'FormatDenominator': calibrate.area[0].formatDenominator }],
                                    // tslint:disable-next-line
                                    'Angle': null, 'Volume': null, 'TargetUnitConversion': calibrate.targetUnitConversion, 'Depth': calibrate.depth
                                };
                            }
                            newAnnotation.Indent = annotation.indent;
                            newAnnotation.Caption = annotation.caption;
                            newAnnotation.CaptionPosition = annotation.captionPosition;
                            newAnnotation.LeaderLineExtension = annotation.leaderLineExtension;
                            newAnnotation.LeaderLength = annotation.leaderLength;
                            newAnnotation.LeaderLineOffset = annotation.leaderLineOffset;
                            documentCollections[annotation.pageNumber].measureShapeAnnotation.push(newAnnotation);
                        } else {
                            documentCollections[annotation.pageNumber].shapeAnnotation.push(newAnnotation);
                        }
                    }
                }
            }
            pdfAnnotation.pdfAnnotation = documentCollections;
            this.pdfViewer.importAnnotation(pdfAnnotation);
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public convertBounds(bounds: any): any {
        if (bounds) {
            let x: number = bounds.x ? bounds.x : bounds.left ? bounds.left : bounds.Left ? bounds.Left : 0;
            let y: number = bounds.y ? bounds.y : bounds.top ? bounds.top : bounds.Top ? bounds.Top : 0;
            let width: number = bounds.width ? bounds.width : bounds.Width ? bounds.Width : 0;
            let height: number = bounds.height ? bounds.height : bounds.Height ? bounds.Height : 0;
            return { X: x, Y: y, Left: x, Top: y, Height: height, Width: width };
        }
    }

    // tslint:disable-next-line
    private convertVertexPoints(points: any): any {
        if (points) {
            let x: number = points.x ? points.x : points.X ? points.X : 0;
            let y: number = points.y ? points.y : points.Y ? points.Y : 0;
            return { X: x, Y: y, Left: x, Top: y };
        }
    }

    // tslint:disable-next-line
    private updateComments(annotation: any, comments: any): any {
        if (annotation && comments) {
            // tslint:disable-next-line
            let newAnnotation: any = {};
            newAnnotation.ShapeAnnotationType = annotation.shapeAnnotationType;
            newAnnotation.Author = comments.author;
            newAnnotation.AnnotationSelectorSettings = annotation.annotationSelectorSettings;
            newAnnotation.AnnotationSettings = annotation.annotationSettings;
            newAnnotation.PageNumber = annotation.pageNumber;
            newAnnotation.ModifiedDate = comments.modifiedDate;
            newAnnotation.Subject = annotation.subject;
            newAnnotation.Note = comments.note;
            newAnnotation.AnnotName = comments.annotName;
            newAnnotation.Comments = comments.comments;
            newAnnotation.State = comments.review.state;
            newAnnotation.StateModel = comments.review.stateModel;
            newAnnotation.CustomData = annotation.customData;
            return newAnnotation;
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public removeFocus(): any {
        if (isBlazor()) {
            // tslint:disable-next-line
            let currentPageContainer: any = this.pdfViewer.element.querySelector('#' + this.pdfViewer.element.id + '_totalPage');
            // tslint:disable-next-line:max-line-length
            if (currentPageContainer && currentPageContainer.firstElementChild && currentPageContainer.firstElementChild.firstElementChild) {
                currentPageContainer.firstElementChild.firstElementChild.blur();
            }
        }
    }
}
