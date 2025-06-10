import { createElement, Browser, isNullOrUndefined, isBlazor, Internationalization, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { PdfViewer, TextLayer, ContextMenu, Signature, AnnotationType, TileRenderingSettingsModel, PdfFormFieldBase, AccessibilityTags, KeyboardCommand, PdfAnnotationBase, PdfRenderedFields , ISignAnnotation } from '../index';
import { NavigationPane } from './navigation-pane';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { TextMarkupAnnotation, StampAnnotation, IPageAnnotations, Annotation, IPoint } from '../annotation';
import { AjaxHandler } from '../index';
import { IElement, Point, DrawingElement, PointModel, Rect, Matrix, identityMatrix, transformPointByMatrix, contains, Info, rotateMatrix, PathElement } from '@syncfusion/ej2-drawings';
import { ToolBase, Actions, MouseEventArgs, SelectTool, MoveTool, ResizeTool, ConnectTool, NodeDrawingTool, PolygonDrawingTool, LineTool, RotateTool, StampTool, InkDrawingTool } from '../drawing/tools';
import { Selector } from '../drawing/selector';
import { ActiveElements, findActiveElement } from '../drawing/action';
import { PdfAnnotationBaseModel, PdfFormFieldBaseModel } from '../drawing/pdf-annotation-model';
import { renderAdornerLayer } from '../drawing/dom-util';
import { FreeTextAnnotation } from '../annotation/free-text-annotation';
import { AnnotationDataFormat, AnnotationResizerLocation, FormFieldDataFormat, PdfKeys } from './types';
import { cloneObject } from '../drawing/drawing-util';
import { IContextMenu, MouseDownEventArgs } from './interfaces';
import { BlazorContextMenu } from './blazor-context-menu';
import { createSpinner, showSpinner, hideSpinner } from './spinner';
import { BlazorUiAdaptor } from './blazor-ui-adaptor';
import { IFormField } from '../form-designer';
import { CommandManagerModel, FormFieldModel, KeyboardCommandModel } from '../pdfviewer-model';
import { FormFieldDoubleClickArgs } from './events-helper';
import { Print } from '../print';
import { TextSearch } from '../text-search';
import { BookmarkView } from '../bookmark-view';
import { ThumbnailView } from '../thumbnail-view';
import { Magnification } from '../magnification';
import { IRectangle, TextSelection } from '../text-selection';
import { FormFields } from '../form-fields';
import { PdfiumRunner } from '../pdfium/pdfium-runner';
import { PageOrganizer } from '../index';
import { PageRenderer, PageRotation } from '../index';
import { PdfPage, _getPageIndex } from '@syncfusion/ej2-pdf';
import { PdfViewerSessionStorage, PdfiumTaskScheduler, TaskPriorityLevel } from './pdfviewer-utlis';

/**
 * The `ISize` module is used to handle page size property of PDF viewer.
 *
 * @hidden
 */
export interface ISize {
    width: number
    height: number
    top: number
    rotation?: number
}

/**
 * The `IPinchZoomStorage` module is used to handle pinch zoom storage of PDF viewer.
 *
 * @hidden
 */
export interface IPinchZoomStorage {
    index: number
    pinchZoomStorage: object
}

/**
 * The `IAnnotationCollection` module is used to handle page size property of PDF viewer.
 *
 * @hidden
 */
export interface IAnnotationCollection {
    textMarkupAnnotation: object
    shapeAnnotation: object
    measureShapeAnnotation: object
    stampAnnotations: object
    stickyNotesAnnotation: object
    freeTextAnnotation: object
    signatureAnnotation?: object
    signatureInkAnnotation?: object
}
/**
 * @hidden
 */
interface ICustomStampItems {
    customStampName: string
    customStampImageSource: string
}

export class PdfViewerBase {
    /**
     * @private
     */
    public hyperlinkAndLinkAnnotation: any = {};
    /**
     * @private
     */
    public pageTextDetails: any = {};
    /**
     * @private
     */
    public pageImageDetails: any = {};
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
    public documentPathByteArray: string | Uint8Array;
    /**
     * @private
     */
    public pageSize: ISize[] = [];
    /**
     * @private
     */
    public existingFieldImport: boolean = true;
    /**
     * @private
     */
    public pageCount: number = 0;
    /**
     * @private
     */
    public customZoomValues: any[] = [];
    /**
     * @private
     */
    public isReRenderRequired: boolean = true;
    /**
     * @private
     */
    public currentPageNumber: number = 0;
    private previousZoomValue: number;
    private initialZoomValue: any = {};
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
    public accessibilityTags: AccessibilityTags;
    /**
     * @private
     */
    public textLayer: TextLayer;
    /**
     * @private
     */
    public pdfViewer: PdfViewer;
    /**
     *
     * @private
     */
    public pngData: any[] = [];
    /**
     * @private
     */
    public blazorUIAdaptor: BlazorUiAdaptor;
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
    public isSignInitialClick: boolean = false;
    /**
     * @private
     */
    public loadedData: string;
    /**
     * @private
     */
    public isFreeTextSelected: boolean = false;
    /**
     * @private
     */
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
    public static sessionStorageManager: PdfViewerSessionStorage = new PdfViewerSessionStorage(false);
    /**
     * @private
     */
    public pageContainer: HTMLElement;
    /**
     * @private
     */
    public isLoadedFormFieldAdded: boolean = false;
    private scrollHoldTimer: any;
    private isFileName: boolean;
    private isInkAnnot: boolean = false;
    private modifiedPageIndex: any[] = [];
    private pointerCount: number = 0;
    private pointersForTouch: PointerEvent[] = [];
    private corruptPopup: Dialog;
    /**
     * @private
     */
    public passwordPopup: Dialog;
    private goToPagePopup: Dialog;
    /**
     * @private
     */
    public isPasswordAvailable: boolean = false;
    /**
     * @private
     */
    public isBounds: boolean = false;
    /**
     * @private
     */
    public isImportDoc: boolean = false;
    private document: string | Uint8Array;
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
    public mouseLeft: number = 0;
    /**
     * @private
     */
    public mouseTop: number = 0;
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
    private isgetFocused: boolean = false;
    private goToPageInput: HTMLElement;
    /**
     * @private
     */
    public pageNoContainer: HTMLElement;
    private goToPageElement: HTMLElement;
    private isLongTouchPropagated: boolean = false;
    private longTouchTimer: any = null;
    private isViewerContainerDoubleClick: boolean = false;
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
    private singleTapTimer: any = null;
    private tapCount: number = 0;
    private inputTapCount: number = 0;
    /**
     * @private
     */
    public isInitialLoaded: boolean = false;
    /**
     * @private
     */
    public loadRequestHandler: AjaxHandler;
    private unloadRequestHandler: AjaxHandler;
    private dowonloadRequestHandler: AjaxHandler;
    private pageRequestHandler: AjaxHandler;
    private textRequestHandler: AjaxHandler;
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
    public highestHeight: number = 0;
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
    public isAddAnnotation: boolean = false;
    /**
     * @private
     */
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
    public currentSignatureAnnot: any;
    /**
     * @private
     */
    public isInitialPageMode: boolean = false;
    /**
     * @private
     */
    public ajaxData: any;
    /**
     * @private
     */
    public documentAnnotationCollections: any = null;
    /**
     * @private
     */
    public annotationRenderredList: number[] = [];
    /**
     * @private
     */
    public annotationStorage: any = {};
    /**
     * @private
     */
    public formFieldStorage: any = {};
    /**
     * @private
     */
    public isStorageExceed: boolean = false;
    /**
     * @private
     */
    public isFormStorageExceed: boolean = false;
    /**
     * @private
     */
    public isNewStamp: boolean = false;
    /**
     * @private
     */
    public downloadCollections: any = {};
    /**
     * @private
     */
    public isAnnotationAdded: boolean = false;
    /**
     * @private
     */
    public annotationEvent: any = null;
    /**
     * @private
     */
    public isAnnotationDrawn: boolean = false;
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
    private textrequestLists: number[] = [];
    private renderThumbnailImages: boolean = false;
    /**
     * @private
     */
    public pageRenderCount: number = 2;
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
    public isFormFieldSelect: boolean = false;
    /**
     * @private
     */
    public isFormFieldMouseDown: boolean = false;
    /**
     * @private
     */
    public isFormFieldMouseMove: boolean = false;
    /**
     * @private
     */
    public isFormFieldMousedOver: boolean = false;
    /**
     * @private
     */
    public isPassword: boolean = false;
    /**
     * @private
     */
    public digitalSignaturePages: number[] = [];
    private isDigitalSignaturePresent: boolean = false;
    /**
     * @private
     */
    public restrictionList: any;
    private isDrawnCompletely: boolean = false;
    /**
     * @private
     */
    public isAddComment: boolean = false;
    /**
     * @private
     */
    public isCommentIconAdded: boolean;
    /**
     * @private
     */
    public currentTarget: any;
    /**
     * @private
     */
    private fromTarget: any;
    /**
     * @private
     */
    public drawSignatureWithTool: boolean = false;
    /**
     * @private
     */
    public formFieldCollection: any[] = [];
    /**
     * @private
     */
    public requestCollection: any[] = [];
    /**
     * @private
     */
    public nonFillableFields: any = {};
    /**
     * @private
     */
    public pdfViewerRunner: PdfiumTaskScheduler;
    /**
     * @private
     */
    public isInitialField: boolean = false;
    /**
     * @private
     */
    public isTouchDesignerMode: boolean = false;
    /**
     * @private
     */
    public designerModetarget: any;
    /**
     * @private
     */
    public isPrint: boolean = false;
    /**
     * @private
     */
    public isPDFViewerJson: boolean = false;
    /**
     * @private
     */
    public isJsonImported: boolean = false;
    /**
     * @private
     */
    public isJsonExported: boolean = false;
    /**
     * @private
     */
    public isPageRotated: boolean = false;
    public preventContextmenu: boolean;
    private downloadFileName: string = '';
    /**
     * @private
     */
    public isFocusField: boolean = false;
    /**
     * @private
     */
    public isTouchPad: boolean = false;
    /**
     * @private
     */
    public isMacGestureActive: boolean = false;
    /**
     * @private
     */
    public macGestureStartScale: number = 0;
    /**
     * @private
     */
    public zoomInterval: number = 5;
    /**
     * @private
     */
    public isTaggedPdf: boolean = false;
    private accessibilityTagsHandler: AjaxHandler = null;
    private accessibilityTagsCollection: any = [];
    private pageRequestListForAccessibilityTags: number[] = [];
    private enableAccessibilityMultiPageRequest: boolean = true;
    /**
     * @private
     */
    public clientSideRendering: boolean = false;
    /**
     * @private
     */
    public focusField: any = [];
    /**
     * @private
     */
    public isPasswordProtected: boolean;
    private isMoving: boolean;
    /**
     * EJ2CORE-813 - This flag is represent current device is 'iPad' or 'iPhone' or'iPod' device.
     *
     * @private
     */

    public isDeviceiOS: boolean;
    /**
     * @private
     */

    public isMacSafari: boolean;
    private globalize: Internationalization;
    /**
     * @private
     */
    public isSkipDocumentPath: boolean = false;
    private isScrollerMoving: boolean = false;
    private isScrollerMovingTimer: any = null;
    /**
     * @private
     */
    public isMessageBoxOpen: boolean;
    private notifyDialog: Dialog;
    /**
     * @private
     */
    public previousScrollbarWidth: number = 0;

    /**
     * Initialize the constructor of PDFViewerBase
     *
     * @param { PdfViewer } viewer - Specified PdfViewer class.
     */
    public constructor(viewer: PdfViewer) {
        this.pdfViewer = viewer;
        this.navigationPane = new NavigationPane(this.pdfViewer, this);
        this.textLayer = new TextLayer(this.pdfViewer, this);
        this.accessibilityTags = new AccessibilityTags(this.pdfViewer, this);
        this.signatureModule = new Signature(this.pdfViewer, this);

    }

    /**
     * @private
     * @returns {void}
     */
    public initializeComponent(): void {
        const element: HTMLElement = document.getElementById(this.pdfViewer.element.id);
        if (element) {
            this.blazorUIAdaptor = isBlazor() ? new BlazorUiAdaptor(this.pdfViewer, this) : null;
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.pdfViewer.element.classList.add('e-pv-mobile-view');
            }
            const controlWidth: string = '100%';
            let toolbarDiv: HTMLElement;
            this.viewerMainContainer = isBlazor() ? element.querySelector('.e-pv-viewer-main-container') : createElement('div', { id: this.pdfViewer.element.id + '_viewerMainContainer', className: 'e-pv-viewer-main-container' });
            this.viewerContainer = isBlazor() ? element.querySelector('.e-pv-viewer-container') : createElement('div', { id: this.pdfViewer.element.id + '_viewerContainer', className: 'e-pv-viewer-container' });
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.createMobilePageNumberContainer();
            }

            (this.viewerContainer as HTMLElement).tabIndex = -1;
            if (this.pdfViewer.enableRtl) {
                this.viewerContainer.style.direction = 'rtl';
            }
            element.style.touchAction = 'pan-x pan-y';
            this.setMaximumHeight(element);
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
                    if (!this.pdfViewer.enableNavigationToolbar && ((Browser.isDevice &&
                         this.pdfViewer.enableDesktopMode) || (!Browser.isDevice))) {
                        this.navigationPane.sideBarToolbar.style.display = 'none';
                        this.navigationPane.sideBarToolbarSplitter.style.display = 'none';
                        if (this.navigationPane.isBookmarkOpen || this.navigationPane.isThumbnailOpen) {
                            this.navigationPane.updateViewerContainerOnClose();
                        }
                    }
                }
            }
            if (toolbarDiv) {
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 56);
            } else {
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 0);
            }
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
                if (this.pdfViewer.isAnnotationToolbarVisible && this.pdfViewer.toolbarModule) {
                    this.pdfViewer.toolbar.showAnnotationToolbar(true);
                }
            }
            this.pageContainer = createElement('div', { id: this.pdfViewer.element.id + '_pageViewContainer', className: 'e-pv-page-container', attrs: { 'role': 'document' } });
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
            const waitingPopup: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_loadingIndicator' });
            this.viewerContainer.appendChild(waitingPopup);
            createSpinner({ target: waitingPopup, cssClass: 'e-spin-center' });
            this.setLoaderProperties(waitingPopup);
            if (isBlazor()) {
                this.contextMenuModule = new BlazorContextMenu(this.pdfViewer, this);
                const spinnerElement: any = document.getElementsByClassName(this.pdfViewer.element.id + '_spinner');
                if (spinnerElement && spinnerElement[0] && (!spinnerElement[0].classList.contains('e-spin-hide'))) {
                    spinnerElement[0].classList.remove('e-spin-show');
                    spinnerElement[0].classList.add('e-spin-hide');
                }
            } else {
                this.contextMenuModule = new ContextMenu(this.pdfViewer, this);
            }
            this.contextMenuModule.createContextMenu();
            this.createFileInputElement();
            this.wireEvents();
            if (this.pdfViewer.textSearchModule && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
                this.pdfViewer.textSearchModule.createTextSearchBox();
            }
            if (this.pdfViewer.documentPath) {
                if (this.pdfViewer.enableHtmlSanitizer) {
                    this.pdfViewer.documentPath = SanitizeHtmlHelper.sanitize(this.pdfViewer.documentPath as string);
                }
                if (isBlazor()) {
                    this.pdfViewer._dotnetInstance.invokeMethodAsync('LoadDocumentFromClient', this.pdfViewer.documentPath);
                } else {
                    this.pdfViewer.load(this.pdfViewer.documentPath, null);
                }
            }
            if (this.pdfViewer.annotationModule) {
                this.pdfViewer.annotationModule.initializeCollection();
            }
        }
        if (Browser.isDevice && this.pdfViewer.enableDesktopMode && this.pdfViewer.toolbarModule) {
            this.pdfViewer.interactionMode = 'Pan';
        }
    }

    private createMobilePageNumberContainer(): void {
        this.mobilePageNoContainer = createElement('div', { id: this.pdfViewer.element.id + '_mobilepagenoContainer', className: 'e-pv-mobilepagenoscroll-container' });
        this.mobilecurrentPageContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobilecurrentpageContainer', className: 'e-pv-mobilecurrentpage-container' });
        this.mobilenumberContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobiledashedlineContainer', className: 'e-pv-mobiledashedline-container' });
        this.mobiletotalPageContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobiletotalpageContainer', className: 'e-pv-mobiletotalpage-container' });
        this.mobileScrollerContainer = createElement('div', { id: this.pdfViewer.element.id + '_mobilescrollContainer', className: 'e-pv-mobilescroll-container' });
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
     * @param  {string} documentData - file name or base64 string.
     * @param {string} password - password of the PDF document.
     * @param  {boolean} isSkipDocumentId - It indicates whether we need to skip removing the jsonDocumentId
     * @returns {void}
     */
    public initiatePageRender(documentData: any, password: string, isSkipDocumentId: boolean = true): void {
        this.isPasswordProtected = (!isNullOrUndefined(password) && password !== '') ? true : false;
        if (this.clientSideRendering) {
            this.pdfViewer.unload();
        }
        this.loadedData = documentData;
        this.documentId = this.createGUID();
        PdfViewerBase.sessionStorageManager.documentId = this.documentId;
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
        if (documentData instanceof Uint8Array) {
            this.pdfViewer.fileByteArray = documentData;
            if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.uploadedDocumentName) {
                this.setFileName();
            }
            if (this.clientSideRendering) {
                if (this.pdfViewer.fileName === null && typeof this.loadedData === 'string') {
                    this.setDocumentName(this.loadedData);
                }
            }
            if (this.pdfViewer.downloadFileName) {
                this.downloadFileName = this.pdfViewer.downloadFileName;
            } else {
                this.downloadFileName = this.pdfViewer.fileName;
            }
            const jsonObject: object = this.constructJsonObject(documentData, password, false);
            this.createAjaxRequest(jsonObject, documentData, password);
        } else {
            this.getPdfByteArray(documentData).then((pdfbytearray: any) => {
                let isUrlLoaded: boolean = false;
                let isValidData: boolean = true;
                let isDataLoaded: boolean = false;
                if (typeof documentData == 'string' && (documentData.startsWith('http://') || documentData.startsWith('https://'))) {
                    isUrlLoaded = true;
                }
                if (typeof documentData == 'string' && (documentData.includes('pdf;base64,') || documentData.startsWith('blob:'))) {
                    isDataLoaded = true;
                }
                let isbase64: boolean = false;
                if (typeof this.loadedData === 'string') {
                    isbase64 = this.loadedData.includes('pdf;base64,');
                }
                if ((isUrlLoaded || isDataLoaded) && this.clientSideRendering) {
                    this.pdfViewer.fileByteArray = pdfbytearray;
                    this.pdfViewer.uploadedFileByteArray = pdfbytearray;
                    documentData = pdfbytearray;
                }
                else if (!isUrlLoaded && !documentData.includes('pdf;base64,') && this.clientSideRendering) {
                    const dataType: string = this.identifyDataType(documentData);
                    const isDataType: boolean = dataType === 'URL';
                    isValidData = this.isValidPDFBase64(documentData) || isDataType;
                    if (isValidData) {
                        documentData = this.convertBase64(pdfbytearray);
                        this.pdfViewer.fileByteArray = documentData;
                        isDataLoaded = true;
                    }
                    else {
                        this.invalidFilePopup();
                    }
                }
                else {
                    documentData = this.checkDocumentData(this.loadedData, isSkipDocumentId);
                }
                if (isValidData) {
                    if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.uploadedDocumentName || isDataLoaded ||
                        (!isDataLoaded && !isUrlLoaded && !documentData.includes('pdf;base64,'))) {
                        this.setFileName();
                    }
                    if (isUrlLoaded && this.clientSideRendering) {
                        if (this.pdfViewer.fileName === null) {
                            this.setDocumentName(this.loadedData);
                        }
                    }
                    if (this.pdfViewer.downloadFileName) {
                        this.downloadFileName = this.pdfViewer.downloadFileName;
                    } else {
                        this.downloadFileName = this.pdfViewer.fileName;
                    }
                    const jsonObject: object = this.constructJsonObject(documentData, password, isbase64);
                    this.createAjaxRequest(jsonObject, documentData, password);
                }
            });
        }
    }

    /**
     * @param {string} documentId - It describes about the document id
     * @param {boolean} isFileName - It describes about the whether isFileName is true or not
     * @param {string} fileName - It describes about the file name
     * @private
     * @returns {void}
     */
    public initiateLoadDocument(documentId: string, isFileName: boolean, fileName: string): void {
        if (documentId) {
            this.documentId = documentId;
            PdfViewerBase.sessionStorageManager.documentId = this.documentId;
        }
        if (this.viewerContainer) {
            this.viewerContainer.scrollTop = 0;
        }
        this.showLoadingIndicator(true);
        this.hashId = ' ';
        this.isFileName = isFileName;
        this.saveDocumentInfo();
        if (this.pdfViewer.interactionMode === 'Pan') {
            this.initiatePanning();
        }
        this.setFileName();
        if (this.pdfViewer.fileName === null) {
            if (isFileName && fileName) {
                this.pdfViewer.fileName = fileName;
                this.jsonDocumentId = this.pdfViewer.fileName;
            } else {
                this.pdfViewer.fileName = 'undefined.pdf';
                this.jsonDocumentId = null;
            }
        }
        if (this.pdfViewer.downloadFileName) {
            this.downloadFileName = this.pdfViewer.downloadFileName;
        } else {
            this.downloadFileName = this.pdfViewer.fileName;
        }
    }

    /**
     * @param {string} base64 - It describes about the base64
     * @private
     * @returns {Uint8Array} - Uint8Array
     */
    public convertBase64(base64: string): Uint8Array {
        return new Uint8Array(atob(base64).split('').map((char: string) => char.charCodeAt(0)));
    }

    /**
     * @param {any} documentDetails - It describes about the document details
     * @param {string} password - It describes about the password
     * @private
     * @returns {void}
     */
    public loadSuccess(documentDetails: any, password?: string): void {
        let data: any = documentDetails;
        if (data) {
            if (typeof data !== 'object') {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    this.onControlError(500, data, this.pdfViewer.serverActionSettings.load);
                    data = null;
                }
            }
            if (data) {
                while (typeof data !== 'object') {
                    data = JSON.parse(data);
                    if (typeof parseInt(data, 10) === 'number' && !isNaN(parseInt(data, 10))) {
                        data = parseInt(data, 10);
                        break;
                    }
                }
                if (data.StatusText && (data.StatusText === 'File Does not Exist')) {
                    this.showLoadingIndicator(false);
                }
                if (data.uniqueId === this.documentId || (typeof parseInt(data, 10) === 'number' && !isNaN(parseInt(data, 10)))) {
                    this.pdfViewer.fireAjaxRequestSuccess(this.pdfViewer.serverActionSettings.load, data);
                    this.requestSuccess(data, null, password);
                }
            }
        }
    }

    private mobileScrollContainerDown(event: any): void {
        this.ispageMoved = false;
        this.isThumb = true;
        this.isScrollerMoving = false;
        if (this.isTextMarkupAnnotationModule()) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage != null &&
                 (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
                const pageNumber: number = this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearAnnotationSelection(pageNumber);
                this.pdfViewer.toolbar.showToolbar(true);
            }
        }
        this.mobileScrollerContainer.addEventListener('touchmove', this.viewerContainerOnScroll.bind(this), true);
    }

    /**
     * @private
     * @param {MouseEvent} e - default mouse event.
     * @returns {PointModel} - retuns the bounds.
     */
    public relativePosition(e: MouseEvent): PointModel {
        const currentRect: any = this.viewerContainer.getBoundingClientRect();
        const left: number = e.clientX - currentRect.left;
        const top: number = e.clientY - currentRect.top;
        return { x: left, y: top };
    }

    /**
     * Gets the annotation canvas for a given annotation ID and page index.
     *
     * @param {string} id - The unique identifier of the annotation.
     * @param {number} pageIndex - The index of the page containing the annotation.
     * @private
     * @returns {HTMLElement} - The HTML canvas element for the annotation. If the canvas is not found, a new annotation layer is created and returned.
     */
    public getAnnotationCanvas(id: string, pageIndex: number): HTMLElement {
        let canvas: HTMLElement = this.getElement(id + pageIndex);
        if (canvas || this.isPrint) {
            return canvas;
        } else {
            if (!isNullOrUndefined(pageIndex)) {
                const pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
                const pageSize: ISize = this.pageSize[parseInt(pageIndex.toString(), 10)];
                if (pageDiv && pageSize && pageSize.width && pageSize.height) {
                    const pageWidth: number = pageSize.width;
                    const pageHeight: number = pageSize.height;
                    canvas = this.createAnnotationLayer(pageDiv, pageWidth, pageHeight, pageIndex);
                    if (this.isShapeBasedAnnotationsEnabled()) {
                        const commonStyle: string = 'position:absolute;top:0px;left:0px;overflow:hidden;pointer-events:none;z-index:1000';
                        if (canvas) {
                            const bounds: ClientRect = canvas.getBoundingClientRect();
                            renderAdornerLayer(bounds, commonStyle, canvas, pageIndex, this.pdfViewer);
                            this.pdfViewer.renderSelector(pageIndex, this.pdfViewer.annotationSelectorSettings);
                        }
                    }
                }
            }
            return canvas;
        }
    }

    /**
     * @param {HTMLElement} pageDiv - pageDiv
     * @param {number} pageWidth - pageWidth
     * @param {number} pageHeight - pageHeight
     * @param {number} pageNumber - pageNumber
     * @param {string} displayMode - displayMode
     * @private
     * @returns {HTMLElement} - htmlelement
     */
    public createAnnotationLayer(pageDiv: HTMLElement, pageWidth: number,
                                 pageHeight: number, pageNumber: number, displayMode?: string): HTMLElement {
        const canvas: HTMLElement = this.getElement('_annotationCanvas_' + pageNumber);
        if (canvas) {
            this.updateCanvas(canvas as HTMLCanvasElement, pageWidth, pageHeight, pageNumber);
            return canvas;
        } else {
            const annotationCanvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_annotationCanvas_' + pageNumber, className: 'e-pv-annotation-canvas' }) as HTMLCanvasElement;
            this.updateCanvas(annotationCanvas, pageWidth, pageHeight, pageNumber);
            pageDiv.appendChild(annotationCanvas);
            return annotationCanvas;
        }

    }

    private setMaximumHeight(element: any): void {
        const currentRect: any = element.getBoundingClientRect();
        if ((!Browser.isDevice || this.pdfViewer.enableDesktopMode) || (currentRect && currentRect.height === 0)) {
            element.style.minHeight = '500px';
        }
        this.updateWidth();
        this.updateHeight();
    }

    private applyViewerHeight(element: any): void {
        const currentRect: any = element.getBoundingClientRect();
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && currentRect && currentRect.height === 0) {
            element.style.minHeight = '500px';
        }
    }

    /**
     * @param {HTMLElement} canvas - canvas
     * @param {number} pageWidth - pageWidth
     * @param {number} pageHeight - pageHeight
     * @param {number} pageNumber - pageNumber
     * @private
     * @returns {void}
     */
    public updateCanvas(canvas: HTMLCanvasElement, pageWidth: number, pageHeight: number, pageNumber: number): void {
        const zoom: number = this.getZoomFactor();
        const ratio: number = this.getZoomRatio(zoom);
        canvas.width = pageWidth * ratio;
        canvas.height = pageHeight * ratio;
        canvas.style.width = (pageWidth * zoom) + 'px';
        canvas.style.height = (pageHeight * zoom) + 'px';
        canvas.style.position = 'absolute';
        canvas.style.zIndex = '1';
        this.applyElementStyles(canvas, pageNumber);
    }

    /**
     * @private
     * @returns {void}
     */
    public updateWidth(): void {
        if (this.pdfViewer.width.toString() !== 'auto') {
            (this.pdfViewer.element as any).style.width = this.pdfViewer.width;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public updateHeight(): void {
        if (this.pdfViewer.height.toString() !== 'auto') {
            (this.pdfViewer.element as any).style.height = this.pdfViewer.height;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public updateViewerContainer(): void {
        const sideBarContentContainer: HTMLElement = this.getElement('_sideBarContentContainer');
        if (sideBarContentContainer && sideBarContentContainer.style.display === 'none') {
            this.navigationPane.updateViewerContainerOnClose();
        } else if (sideBarContentContainer && sideBarContentContainer.style.display === 'block') {
            this.navigationPane.updateViewerContainerOnExpand();
        } else {
            this.updateViewerContainerSize();
        }
        const toolbarModule: any = this.pdfViewer.toolbarModule;
        if (!isNullOrUndefined(this.viewerContainer) && !isNullOrUndefined(toolbarModule) &&
        !isNullOrUndefined(toolbarModule.toolbarElement)) {
            // eslint-disable-next-line
            if (toolbarModule.toolbarElement.style.display == 'none') {
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 0);
            }// eslint-disable-next-line
            else if (toolbarModule.toolbarElement.style.display == 'block') {
                const toolbarContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_toolbarContainer');
                if (toolbarContainer) {
                    const toolbarHeight: number = toolbarContainer.getBoundingClientRect().height;
                    this.viewerContainer.style.height =
                    this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, toolbarHeight);
                }
            }
            if (this.navigationPane.sideBarToolbar) {
                this.navigationPane.sideBarToolbar.style.height =
                this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 0);
            }
        }
        if (toolbarModule) {
            if (isBlazor()) {
                if (this.pdfViewer.enableToolbar || this.pdfViewer.enableAnnotationToolbar) {
                    this.pdfViewer._dotnetInstance.invokeMethodAsync('RefreshToolbarItems');
                }
            } else {
                if (this.pdfViewer.enableToolbar) {
                    if (!isNullOrUndefined(toolbarModule.toolbar)) {
                        toolbarModule.toolbar.refreshOverflow();
                    }
                }
                if (this.pdfViewer.enableAnnotationToolbar && toolbarModule.annotationToolbarModule) {
                    if (!isNullOrUndefined(toolbarModule.annotationToolbarModule) &&
                    !isNullOrUndefined(toolbarModule.annotationToolbarModule.toolbar)) {
                        toolbarModule.annotationToolbarModule.toolbar.refreshOverflow();
                    }
                }
            }
        }
    }

    private updateViewerContainerSize(): void {
        if (!isNullOrUndefined(this.viewerContainer)) {
            this.viewerContainer.style.width = this.pdfViewer.element.clientWidth + 'px';
        }
        if (!isNullOrUndefined(this.pageContainer)) {
            this.pageContainer.style.width = this.viewerContainer.offsetWidth + 'px';
        }
        this.updateZoomValue();
    }

    private mobileScrollContainerEnd(event: any): void {
        if (!this.ispageMoved) {
            this.goToPagePopup.show();
        }
        this.isThumb = false;
        this.ispageMoved = false;
        this.isScrollerMoving = false;
        this.pageViewScrollChanged(this.currentPageNumber);
        this.mobileScrollerContainer.removeEventListener('touchmove', this.viewerContainerOnScroll.bind(this), true);
        this.mobilePageNoContainer.style.display = 'none';
    }

    /**
     * @private
     * @param {any} data - data.
     * @returns {boolean} - boolean
     */
    public checkRedirection(data: any): boolean {
        let redirect: boolean = false;
        if (data && typeof (data) === 'object' && (data.redirectUrl || data.redirectUri || data.redirectUrl === '' || data.redirectUri === '')) {
            if (data.redirectUrl === '' || data.redirectUri === '') {
                redirect = true;
            } else {
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                } else {
                    window.location.href = data.redirectUri;
                }
            }
        } else if (data && typeof (data) === 'string' && (data.includes('redirectUrl') || data.includes('redirectUri'))) {
            if (JSON.parse(data).redirectUrl === '' || JSON.parse(data).redirectUri === '') {
                redirect = true;
            } else {
                if (!isNullOrUndefined(JSON.parse(data).redirectUrl) || !isNullOrUndefined(JSON.parse(data).redirectUri)) {
                    if (data.includes('redirectUrl')) {
                        window.location.href = JSON.parse(data).redirectUrl;
                    } else {
                        window.location.href = JSON.parse(data).redirectUri;
                    }
                }
            }
        }
        return redirect;
    }

    /**
     * @param {string} input - Gets the input
     * @private
     * @returns {Promise<string | null>} - promise
     */
    public getPdfByteArray(input: string): Promise<any | null> {
        // eslint-disable-next-line
        const proxy: any = this;
        if (typeof input == 'string' && this.clientSideRendering && (input.startsWith('http://') || input.startsWith('https://') || input.includes('pdf;base64,') || input.startsWith('blob:'))) {
            return fetch(input)
                .then((response: any) => {
                    if (response.ok) {
                        return response.arrayBuffer();
                    } else {
                        throw new Error(response.statusText);
                    }
                })
                .then((pdfData: any) => {
                    return new Uint8Array(pdfData);
                })
                .catch((error: any) => {
                    proxy.openNotificationPopup('CORS policy error');
                    proxy.pdfViewer.fireDocumentLoadFailed(false, null);
                    throw error;
                });
        } else {
            // eslint-disable-next-line
            return Promise.resolve(input);
        }
    }

    /**
     * @param {string} input - Gets the input
     * @private
     * @returns {Promise<string | null>} - promise
     */
    public getPdfBase64(input: string): Promise<string | null> {
        if (input.startsWith('http://') || input.startsWith('https://') || input.startsWith('blob:')) {
            return fetch(input)
                .then((response: any) => {
                    if (response.ok) {
                        return response.arrayBuffer();
                    } else {
                        console.error('Error fetching PDF:', response.statusText);
                        throw new Error(response.statusText);
                    }
                })
                .then((pdfData: any) => {
                    const binary: string = new Uint8Array(pdfData).reduce((str: string, byte: number) => str + String.fromCharCode(byte), '');
                    const base64String: string = btoa(binary);
                    return base64String;
                })
                .catch((error: any) => {
                    console.error('Error fetching PDF:', error.message);
                    throw error;
                });
        } else {
            // eslint-disable-next-line
            return Promise.resolve(input);
        }
    }

    private isValidPDFBase64(str: string): boolean {
        if (str.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(str.replace(/\s/g, ''))) {
            return false;
        }
        try {
            return atob(str).indexOf('%PDF-') > -1;
        } catch {
            return false;
        }
    }
    private isUrl(str: string): boolean {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    }

    private isBase64(str: string): boolean {
        const base64Regex: RegExp = /^[A-Za-z0-9+/=]+$/;
        return base64Regex.test(str);
    }

    private identifyDataType(input: string): string {
        if (this.isUrl(input)) {
            return 'URL';
        } else if (this.isBase64(input)) {
            return 'Base64';
        } else {
            return 'Unknown';
        }
    }

    private createAjaxRequest(jsonObject: any, documentData: string | Uint8Array, password: string): void {
        if (this.corruptPopup) {
            this.closeCorruptPopup();
        }
        if (this.notifyDialog) {
            this.closeNotification();
        }
        let proxy: PdfViewerBase = null;
        // eslint-disable-next-line
        proxy = this;
        if (this.pdfViewer.serverActionSettings) {
            this.loadRequestHandler = new AjaxHandler(this.pdfViewer);
            this.loadRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.load;
            this.loadRequestHandler.responseType = 'json';
            this.loadRequestHandler.mode = true;
            jsonObject['action'] = 'Load';
            jsonObject['elementId'] = this.pdfViewer.element.id;
            if (this.clientSideRendering) {
                let data: any = this.pdfViewer.pdfRendererModule.load(documentData, this.documentId, password, jsonObject);
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
                            if (typeof parseInt(data, 10) === 'number' && !isNaN(parseInt(data, 10))) {
                                data = parseInt(data, 10);
                                break;
                            }
                        }
                        if (data.uniqueId === proxy.documentId || (typeof parseInt(data, 10) === 'number' && !isNaN(parseInt(data, 10)))) {
                            proxy.updateFormFieldName(data);
                            proxy.pdfViewer.fireAjaxRequestSuccess(this.pdfViewer.serverActionSettings.load, data);
                            if (!isNullOrUndefined(data['isTaggedPdf']) && data['isTaggedPdf']) {
                                proxy.isTaggedPdf = true;
                            }
                            proxy.requestSuccess(data, documentData, password);
                        }
                    }
                } else {
                    proxy.invalidFilePopup();
                }
            }
            else {
                if ((documentData as string).startsWith('blob:')) {
                    proxy.getPdfBase64((documentData as string))
                        .then((pdfBase64: string) => {
                            if (pdfBase64) {
                                jsonObject.document = pdfBase64;
                                jsonObject.isFileName = false;
                            }
                            proxy.loadRequestHandler.send(jsonObject);
                        })
                        .catch((error: Error) => {
                            proxy.invalidFilePopup();
                        });
                } else {
                    proxy.loadRequestHandler.send(jsonObject);
                }
                this.loadRequestHandler.onSuccess = function (result: any): void {
                    let data: any = result.data;
                    const redirect: boolean = proxy.checkRedirection(data);
                    if (redirect) {
                        proxy.showLoadingIndicator(false);
                    }
                    else {
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
                                    if (typeof parseInt(data, 10) === 'number' && !isNaN(parseInt(data, 10))) {
                                        data = parseInt(data, 10);
                                        break;
                                    }
                                }
                                if (data.uniqueId === proxy.documentId || (typeof parseInt(data, 10) === 'number' && !isNaN(parseInt(data, 10)))) {
                                    proxy.updateFormFieldName(data);
                                    proxy.pdfViewer.fireAjaxRequestSuccess(this.pdfViewer.serverActionSettings.load, data);
                                    if (!isNullOrUndefined(data['isTaggedPdf']) && data['isTaggedPdf']) {
                                        proxy.isTaggedPdf = true;
                                    }
                                    proxy.requestSuccess(data, documentData, password);
                                }
                            }
                        } else {
                            proxy.showLoadingIndicator(false);
                            proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('Import PDF Failed'));
                        }
                    }
                };
                this.loadRequestHandler.onFailure = function (result: any): void {
                    const statusString: string = result.status.toString().split('')[0];
                    if (statusString === '4') {
                        proxy.openNotificationPopup('Client error');
                    } else if (statusString === '5') {
                        proxy.openNotificationPopup('CORS policy error');
                    } else {
                        proxy.openNotificationPopup();
                    }
                    proxy.showLoadingIndicator(false);
                    proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.load);
                };
                this.loadRequestHandler.onError = function (result: any): void {
                    proxy.openNotificationPopup();
                    proxy.showLoadingIndicator(false);
                    proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.load);
                };
            }
        }
    }

    private invalidFilePopup(): void {
        this.showLoadingIndicator(false);
        this.openImportExportNotificationPopup(this.pdfViewer.localeObj.getConstant('Import PDF Failed'));
    }

    // EJ2-60380 - As of now, in form designer the element name is taken fromfield.ActualFieldName (with hypen) but for
    // Form fields it is taken from field.FieldName (without hypen).
    // For this reason when user taken the form feilds on button click, name of the form feilds are different with and without form designer module

    private updateFormFieldName(data: any): void {
        if (data && data.PdfRenderedFormFields && data.PdfRenderedFormFields.length > 0) {
            let field: any;
            for (let i: number = 0; i < data.PdfRenderedFormFields.length; i++) {
                field = data.PdfRenderedFormFields[parseInt(i.toString(), 10)];
                if (field) {
                    if (field.ActualFieldName) {
                        field.FieldName = field.ActualFieldName;
                    }
                    if (isNullOrUndefined(field.Value)) {
                        field.Value = '';
                    }
                }
            }
        }
    }

    /**
     * @param {string} text - The text.
     * @returns {void}
     * @private
     */
    public createNotificationPopup(text: string): void {
        if (!this.isMessageBoxOpen) {
            const popupElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_notify', className: 'e-pv-notification-popup' });
            if (!isNullOrUndefined(this.pdfViewer.pageOrganizer) && this.pdfViewer.pageOrganizer.dialogDivElement){
                this.pdfViewer.pageOrganizer.dialogDivElement.appendChild(popupElement);
            }
            else{
                this.viewerContainer.appendChild(popupElement);
            }
            this.notifyDialog = new Dialog({
                showCloseIcon: true, closeOnEscape: false, isModal: true, header: this.pdfViewer.localeObj.getConstant('PdfViewer'),
                buttons: [{
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true },
                    click: this.closeNotification.bind(this)
                }],
                content: '<div class="e-pv-notification-popup-content" tabindex = "0">' + text + '</div>', target: this.pdfViewer.element,
                beforeClose: (): void => {
                    this.notifyDialog.destroy();
                    if (this.pdfViewer.pageOrganizerModule) {
                        this.pdfViewer.pageOrganizerModule.showOrganizeLoadingIndicator(false);
                    }
                    if (this.pdfViewer.element) {
                        try {
                            this.pdfViewer.element.removeChild(popupElement);
                        } catch (error) {
                            popupElement.parentElement.removeChild(popupElement);
                        }
                    }
                    if (this.pdfViewer.textSearchModule) {
                        this.pdfViewer.textSearch.isMessagePopupOpened = false;
                    }
                    this.isMessageBoxOpen = false;
                }
            });
            if (this.pdfViewer.enableRtl) {
                this.notifyDialog.enableRtl = true;
            }
            this.notifyDialog.appendTo(popupElement);
            this.isMessageBoxOpen = true;
        }
    }

    /**
     * @returns {void}
     */
    private closeNotification = (): void => {
        this.notifyDialog.hide();
    };

    /**
     * @private
     * @param {string} errorString - The message to be displayed.
     * @returns {void}
     */
    public openNotificationPopup(errorString?: string): void {
        if (this.pdfViewer.showNotificationDialog) {
            if (errorString === 'Client error') {
                if (isBlazor()) {
                    const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_Clienterror');
                    promise.then((value: string) => {
                        this.createNotificationPopup(value);
                    });
                } else {
                    this.createNotificationPopup(this.pdfViewer.localeObj.getConstant('Client error'));
                }
            } else if (errorString === 'CORS policy error') {
                this.createNotificationPopup(this.pdfViewer.localeObj.getConstant('Cors policy error'));
            } else {
                if (isBlazor()) {
                    const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_Servererror');
                    promise.then((value: string) => {
                        this.createNotificationPopup(value);
                    });
                } else {
                    this.createNotificationPopup(this.pdfViewer.localeObj.getConstant('Server error'));
                }
            }
            if (this.getElement('_notify')) {
                this.getElement('_notify').classList.add('e-pv-notification-large-content');
            }
        }
    }

    /**
     * @private
     * @param {string} errorString - The message to be shown.
     * @returns {void}
     */
    public showNotificationPopup(errorString: string): void {
        if (!this.pdfViewer.showNotificationDialog && errorString !== '') {
            this.createNotificationPopup(errorString);
            if (this.getElement('_notify')) {
                this.getElement('_notify').classList.add('e-pv-notification-large-content');
            }
        }
    }

    private requestSuccess(data: any, documentData: string | Uint8Array, password: string): void {
        if (this.clientSideRendering) {
            if (data.isDigitalSignaturePresent && !isNullOrUndefined(data.digitialSignatureFile) && data.digitialSignatureFile
                && this.pdfViewer.pdfRenderer.digitialByteArray && this.pdfViewer.pdfRenderer.digitialByteArray.length > 0) {
                this.pdfViewer.fileByteArray = this.pdfViewer.pdfRenderer.digitialByteArray;
                this.pdfViewer.pdfRenderer.digitialByteArray = null;
            }
            else if (isNullOrUndefined(this.pdfViewer.fileByteArray) && this.pdfViewer.uploadedFileByteArray) {
                this.pdfViewer.fileByteArray = this.pdfViewer.uploadedFileByteArray;
                this.pdfViewer.uploadedFileByteArray = null;
            }
            else if (!this.pdfViewer.fileByteArray && !isNullOrUndefined(this.pdfViewer.toolbarModule) &&
             this.pdfViewer.toolbarModule.uploadedFile) {
                if (typeof this.pdfViewer.toolbarModule.uploadedFile == 'string') {
                    this.pdfViewer.fileByteArray = this.convertBase64(this.pdfViewer.toolbarModule.uploadedFile.replace(/^data:+[a-zA-Z]+\/[a-zA-Z]+;base64,/g, ''));
                }
            } else if (!this.pdfViewer.fileByteArray && data.documentData) {
                this.pdfViewer.fileByteArray = this.convertBase64(data.documentData);
            }
        }
        if (data && data.pageCount !== undefined) {
            if (isBlazor() && this.isPassword) {
                this.isPassword = false;
                this.isPasswordAvailable = false;
                this.pdfViewer._dotnetInstance.invokeMethodAsync('ClosePasswordDialog');
            }
            if (password && password !== '') {
                this.passwordData = password;
            }
            this.pdfViewer.allowServerDataBinding = false;
            this.pageCount = data.pageCount;
            this.pdfViewer.pageCount = data.pageCount;
            this.hashId = data.hashId;
            this.documentLiveCount = data.documentLiveCount;
            this.isAnnotationCollectionRemoved = false;
            this.saveDocumentHashData();
            if (data.pageCount < 100) {
                this.saveFormfieldsData(data);
            }
            this.pdfViewer.allowServerDataBinding = true;
            if (this.clientSideRendering) {
                this.isDigitalSignaturePresent = data.isDigitalSignaturePresent;
            } else {
                this.digitalSignaturePages = data.digitalSignaturePages;
            }
            this.pageRender(data);
            const pageData: any = { pageCount: data.pageCount, pageSizes: data.pageSizes };
            PdfViewerBase.sessionStorageManager.setItem(this.documentId + '_pagedata', JSON.stringify(pageData));
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.mobileScrollerContainer.style.display = '';
                const toolbarHeight: any = this.pdfViewer.toolbarModule ? this.toolbarHeight : 0;
                this.mobileScrollerContainer.style.top = (toolbarHeight) + 'px';
            }
            this.restrictionList = data.RestrictionSummary;
            this.RestrictionEnabled(this.restrictionList, false);
        } else {
            this.pageCount = 0;
            this.currentPageNumber = 0;
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.mobileScrollerContainer.style.display = 'none';
            }
            if (data === 4) {
                if (!isBlazor()) {
                    // 4 is error code for encrypted document.
                    this.renderPasswordPopup(documentData, password, this.isImportDoc);
                }
            } else if (data === 3) {
                if (!isBlazor()) {
                    // 3 is error code for corrupted document.
                    this.renderCorruptPopup(this.isImportDoc);
                }
            }
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.toolbarModule.updateToolbarItems();
            }
        }
        const annotationModule: any = this.pdfViewer.annotationModule;
        if (annotationModule && annotationModule.textMarkupAnnotationModule &&
             annotationModule.textMarkupAnnotationModule.
                 isEnableTextMarkupResizer(annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode)) {
            annotationModule.textMarkupAnnotationModule.createAnnotationSelectElement();
        }
    }

    private RestrictionEnabled(restrictionSummary: any, isEnable: boolean): void {
        if (restrictionSummary) {
            for (let i: number = 0; i < restrictionSummary.length; i++) {
                this.EnableRestriction(restrictionSummary[parseInt(i.toString(), 10)], isEnable);
                if (!isBlazor()) {
                    if (this.pdfViewer.toolbarModule) {
                        this.pdfViewer.toolbarModule.DisableToolbarItems(restrictionSummary[parseInt(i.toString(), 10)], isEnable);
                    }
                } else {
                    if (this.pdfViewer.toolbarModule) {
                        this.pdfViewer._dotnetInstance.invokeMethodAsync('RestrictToolbarItems', restrictionSummary, isEnable);
                    }
                }
            }
        }
    }

    private EnableRestriction(restrictionSummary: any, isEnable: boolean): void {
        switch (restrictionSummary) {
        case 'Print':
            this.pdfViewer.enablePrint = isEnable;
            break;
        case 'CopyContent':
            this.pdfViewer.enableTextSelection = isEnable;
            break;
        case 'FillFields':
            this.pdfViewer.enableFormFields = isEnable;
            this.enableFormFieldButton(isEnable);
            break;
        case 'EditAnnotations':
            this.pdfViewer.annotationSettings.isLock = true;
            break;
        }
    }

    private pageRender(data: any): void {
        this.document = null;
        this.passwordDialogReset();
        if (this.passwordPopup) {
            this.passwordPopup.hide();
        }
        this.initPageDiv(data);
    }

    private loadPage(pageIndex: number): void {
        this.currentPageNumber = pageIndex + 1;
        this.pdfViewer.currentPageNumber = pageIndex + 1;
        this.previousZoomValue = this.pdfViewer.zoomValue;
        let isZoomMode: boolean = false;
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.isAutoZoom = true;
            if (this.pdfViewer.zoomValue && this.pdfViewer.zoomValue > 0) {
                if (this.pdfViewer.zoomValue !== 100) {
                    isZoomMode = true;
                }
                this.isInitialPageMode = true;
                this.pdfViewer.magnification.zoomTo(this.pdfViewer.zoomValue);
            }
            if (this.pdfViewer.zoomMode === 'FitToWidth') {
                this.isInitialPageMode = true;
                isZoomMode = true;
                this.pdfViewer.magnificationModule.fitToWidth();
            } else if (this.pdfViewer.zoomMode === 'FitToPage') {
                this.isInitialPageMode = true;
                isZoomMode = true;
                this.pdfViewer.magnificationModule.fitToPage();
            }
            this.documentLoaded = true;
            this.pdfViewer.magnificationModule.isInitialLoading = true;
            this.onWindowResize();
            this.documentLoaded = false;
            this.pdfViewer.magnificationModule.isInitialLoading = false;
        }
        this.isDocumentLoaded = true;
        let viewPortWidth: any = 816;
        viewPortWidth = parseInt(viewPortWidth, 10);
        if (this.clientSideRendering) {
            // eslint-disable-next-line
            const proxy: any = this;
            let fileByteArray: any = this.pdfViewer.fileByteArray;
            if (!isNullOrUndefined(fileByteArray) && fileByteArray.length > 0) {
                this.pdfViewerRunner.addTask({ uploadedFile: fileByteArray, message: 'LoadPageCollection', password: this.passwordData, pageIndex: pageIndex, isZoomMode: isZoomMode }, TaskPriorityLevel.High);
                fileByteArray = null;
            } else {
                this.renderCorruptPopup(false);
            }
            this.pdfViewerRunner.onMessage('PageLoaded,LoadedStampForFormFields,LoadedStamp', function (event: any): void {
                if (event.data.message === 'PageLoaded') {
                    proxy.initialPagesRendered(event.data.pageIndex, event.data.isZoomMode);
                }
                else if (event.data.message === 'LoadedStampForFormFields') {
                    proxy.initialPagesRenderedForSign(event.data);
                }
                else if (event.data.message === 'LoadedStamp') {
                    proxy.pdfViewer.pdfRendererModule.renderer.initialPagesRendered(event.data);
                }
            });
        } else {
            this.initialPagesRendered(pageIndex, isZoomMode);
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
            }
        }
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.mobileSpanContainer.innerHTML = this.currentPageNumber.toString();
            this.mobilecurrentPageContainer.innerHTML = this.currentPageNumber.toString();
        }
    }

    private initialPagesRenderedForSign(data: {
        value: Uint8ClampedArray; width: number; height: number; formFieldName: string; formFieldList: string;
        PageIndex: number;
    }): void {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const { value, width, height, formFieldName, formFieldList, PageIndex } = data;
        const formFieldLists: any = JSON.parse(formFieldList);
        canvas.width = width;
        canvas.height = height;
        const canvasContext: CanvasRenderingContext2D = canvas.getContext('2d');
        const imageData: ImageData = canvasContext.createImageData(width, height);
        imageData.data.set(value);
        canvasContext.putImageData(imageData, 0, 0);
        const imageUrl: string = canvas.toDataURL();
        const formFieldBaseName: string = this.removeTrailingNumber(formFieldName);
        const formField: any | undefined = formFieldLists.find((field: any) => field.FieldName === formFieldBaseName);
        const { LineBounds } = formField;
        const padding: number = Math.min(LineBounds.Height / this.pdfViewer.formFieldsModule.paddingDifferenceValue,
                                         LineBounds.Width / this.pdfViewer.formFieldsModule.paddingDifferenceValue);
        const maxHeight: number = LineBounds.Height - padding;
        const maxWidth: number = LineBounds.Width - padding;
        const ratio: number = Math.min(maxWidth / width, maxHeight / height);
        const adjustedWidth: number = width * ratio;
        const adjustedHeight: number = height * ratio;
        const x: number = LineBounds.X + (LineBounds.Width - adjustedWidth) / 2;
        const y: number = LineBounds.Y + (LineBounds.Height - adjustedHeight) / 2;
        const formFieldObject: PdfRenderedFields = new PdfRenderedFields();
        formFieldObject.LineBounds = {
            X: x,
            Y: y,
            Width: adjustedWidth,
            Height: adjustedHeight
        };
        formFieldObject.Value = imageUrl;
        formFieldObject.ActualFieldName = null;
        formFieldObject.Name = 'SignatureImage';
        formFieldObject.FieldName = formFieldName;
        formFieldObject.PageIndex = PageIndex;
        const index: number = this.pdfViewer.formFieldCollections.findIndex(
            (field: any) => (field.type === 'SignatureField' || field.type === 'InitialField') &&
            formFieldObject.FieldName && formFieldObject.FieldName.includes(field.name) &&
            formFieldObject.FieldName.includes(field.name + '_'));
        if (index >= 0) {
            this.pdfViewer.formFieldCollections[parseInt(index.toString(), 10)].value = formFieldObject.Value;
        }
        this.pdfViewer.pdfRendererModule.formFieldsBase.PdfRenderedFormFields.push(formFieldObject);
        const updatedFormData: string = JSON.stringify(this.pdfViewer.pdfRendererModule.formFieldsBase.PdfRenderedFormFields);
        this.setItemInSessionStorage(updatedFormData, '_formfields');
    }

    private removeTrailingNumber(input: string): string {
        return input.replace(/_\d+$/, '');
    }

    private initialPagesRendered(pageIndex: number, isZoomMode: boolean): void {
        if (this.renderedPagesList.indexOf(pageIndex) === -1 && !isZoomMode) {
            this.createRequestForRender(pageIndex);
            let pageNumber: number = pageIndex + 1;
            const renderLimit: number = this.pdfViewer.initialRenderPages <= this.pageCount ?
                (this.pdfViewer.initialRenderPages > this.pageRenderCount) ?
                    this.pdfViewer.initialRenderPages : 2 : this.pageCount;
            for (let i: number = 1; i < renderLimit; i++) {
                this.createRequestForRender(i);
                pageNumber = pageNumber + 1;
            }
            if (this.pageSize[parseInt(pageNumber.toString(), 10)]) {
                let pageTop: number = this.getPageTop(pageNumber);
                const viewerHeight: number = this.viewerContainer.clientHeight;
                while (viewerHeight > pageTop) {
                    if (this.pageSize[parseInt(pageNumber.toString(), 10)]) {
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
    }

    /**
     * @private
     * @param {string} documentData - It gets the document data
     * @param {string} password - It gets the password
     * @param {boolean} isImportDoc - It gets whether the isImportDoc is true or false
     * @returns {void}
     */
    public renderPasswordPopup(documentData: string | Uint8Array, password: string, isImportDoc: boolean): void {
        if (!isBlazor()) {
            if (!this.isPasswordAvailable) {
                if (this.isFileName) {
                    this.document = documentData;
                } else {
                    if (documentData instanceof Uint8Array) {
                        this.document = documentData;
                    } else {
                        this.document = 'data:application/pdf;base64,' + documentData;
                    }
                }
                this.isPasswordAvailable = true;
                this.createPasswordPopup(isImportDoc);
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
                    if (documentData instanceof Uint8Array) {
                        this.document = documentData;
                    } else {
                        this.document = 'data:application/pdf;base64,' + documentData;
                    }
                }
                this.passwordPopup.show();
            }
        } else {
            const promptElement: any = document.getElementById(this.pdfViewer.element.id + '_prompt');
            const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_EnterPassword');
            promise.then((value: string) => {
                promptElement.textContent = value;
            });
            const passwordInput: any = document.querySelector('#' + this.pdfViewer.element.id + '_password_input');
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
                const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_InvalidPassword');
                promise.then((value: string) => {
                    promptElement.textContent = value;
                });
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

    /**
     * @param {boolean} isImportDoc - Checks it is imported doc or npt
     * @private
     * @returns {void}
     */
    public renderCorruptPopup(isImportDoc: boolean): void {
        this.pdfViewer.fireDocumentLoadFailed(false, null);
        this.documentId = null;
        if (this.pdfViewer.showNotificationDialog) {
            if (!isBlazor()) {
                this.createCorruptedPopup(isImportDoc);
                this.corruptPopup.show();
            } else {
                this.pdfViewer._dotnetInstance.invokeMethodAsync('OpenCorruptedDialog');
            }
        }
    }

    /**
     * @param {string} documentData - It gets the document data
     * @param {string} password - It gets the password
     * @param {boolean} isBase64String - It gets whether the isBase64String is true or not
     * @private
     * @returns {Object} - Object
     */
    public constructJsonObject(documentData: string | Uint8Array, password: string, isBase64String?: boolean): object {
        let jsonObject: object;
        if (password) {
            this.isPasswordAvailable = true;
            this.passwordData = password;
            jsonObject = { document: documentData, password: password, isClientsideLoading: isBase64String, zoomFactor: '1', isFileName: this.isFileName.toString(), uniqueId: this.documentId, showDigitalSignatureAppearance: this.pdfViewer.showDigitalSignatureAppearance };
        } else {
            this.isPasswordAvailable = false;
            this.passwordData = '';
            jsonObject = { document: documentData, zoomFactor: '1', isClientsideLoading: isBase64String, isFileName: this.isFileName.toString(), uniqueId: this.documentId, hideEmptyDigitalSignatureFields: this.pdfViewer.hideEmptyDigitalSignatureFields, showDigitalSignatureAppearance: this.pdfViewer.showDigitalSignatureAppearance };
        }
        return jsonObject;
    }

    /**
     * @private
     * @param {string} documentData - It describes about the document data
     * @param  {boolean} isSkipDocumentId - It indicates whether we need to skip removing the jsonDocumentId
     * @returns {string} - string
     */
    public checkDocumentData(documentData: string, isSkipDocumentId: boolean = true): string {
        let base64String: string;
        if (this.isValidPDFBase64(documentData)) {
            base64String = documentData;
        } else {
            base64String = documentData.split('base64,')[1];
        }
        if (base64String === undefined || !this.isValidPDFBase64(base64String)) {
            this.isFileName = true;
            this.jsonDocumentId = documentData;
            if (this.pdfViewer.fileName === null && (documentData.startsWith('http://') || documentData.startsWith('https://') || documentData.endsWith('.pdf'))) {
                this.setDocumentName(documentData);
                base64String = documentData;
            }
            else {
                this.setFileName();
                base64String = documentData;
            }
        } else if (isSkipDocumentId) {
            this.jsonDocumentId = null;
        }
        return base64String;
    }

    private setDocumentName(documentData: string): void {
        const documentStringArray: string[] = (documentData.indexOf('\\') !== -1) ? documentData.split('\\') : documentData.split('/');
        this.pdfViewer.fileName = documentStringArray[documentStringArray.length - 1];
        this.jsonDocumentId = this.pdfViewer.fileName;
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
        const currentSize: number = PdfViewerBase.sessionStorageManager.getWindowSessionStorageSize();
        const newObjectSize: number = Math.round(JSON.stringify(this.documentId).length / 1024);
        const sessionSize: number = currentSize + newObjectSize;
        const maxSessionSize: number = 5000;
        if (sessionSize < maxSessionSize) {
            PdfViewerBase.sessionStorageManager.setItem(this.documentId + '_currentDocument', this.documentId);
            PdfViewerBase.sessionStorageManager.setItem(this.documentId + '_serviceURL', this.pdfViewer.serviceUrl);
            if (this.pdfViewer.serverActionSettings) {
                PdfViewerBase.sessionStorageManager.setItem(this.documentId + '_unload', this.pdfViewer.serverActionSettings.unload);
            }
        }
        else {
            this.sessionStorage.push(this.documentId + '_currentDocument', this.documentId);
            this.sessionStorage.push(this.documentId + '_serviceURL', this.pdfViewer.serviceUrl);
            if (this.pdfViewer.serverActionSettings) {
                this.sessionStorage.push(this.documentId + '_unload', this.pdfViewer.serverActionSettings.unload);
            }
        }
    }

    private saveDocumentHashData(): void {
        let hashId: string = '';
        if (Browser.isIE || Browser.info.name === 'edge') {
            hashId = encodeURI(this.hashId);
        } else {
            hashId = this.hashId;
        }
        PdfViewerBase.sessionStorageManager.setItem(this.documentId + '_hashId', hashId);
        if (this.documentLiveCount) {
            PdfViewerBase.sessionStorageManager.setItem(this.documentId + '_documentLiveCount', this.documentLiveCount.toString());
        }
    }

    /**
     * @private
     * @param {any} input - It is the value of the signature
     * @returns {any} - any
     */
    public signatureValue(input: any): any
    {
        if (typeof input === 'string' && input.trim().startsWith('[')) {
            const commands: any = JSON.parse(input);
            const pathString: any = commands.map(function (cmd: any): any {
                const x: any = Math.round(cmd.x);
                const y: any = Math.round(cmd.y);
                return '' + cmd.command + x + ',' + y;
            }).join(' ');
            return pathString;
        }
    }

    private saveFormfieldsData(data: any): void {
        // Moved the signature value collection to the bottom.
        if (!this.clientSideRendering) {
            const moveToBottom: string[] = ['ink', 'SignatureText', 'SignatureImage'];
            data.PdfRenderedFormFields = data.PdfRenderedFormFields.filter((item: any) => moveToBottom.indexOf(item['Name']) === -1).concat(data.PdfRenderedFormFields.filter((item: any) => moveToBottom.indexOf(item['Name']) !== -1));
        }
        this.pdfViewer.isFormFieldDocument = false;
        this.enableFormFieldButton(false);
        if (data && data.PdfRenderedFormFields && data.PdfRenderedFormFields.length > 0) {
            if (this.formfieldvalue) {
                if (this.pdfViewer.formFieldsModule) {
                    this.setItemInSessionStorage(this.formfieldvalue, '_formfields');
                }
                this.formfieldvalue = null;
            } else if (this.pdfViewer.formFieldsModule) {
                for (let i: number = 0; i < data.PdfRenderedFormFields.length; i++) {
                    if (data.PdfRenderedFormFields[parseInt(i.toString(), 10)].FieldName === '') {
                        data.PdfRenderedFormFields.splice(i, 1);
                    }
                }
                this.setItemInSessionStorage(data.PdfRenderedFormFields, '_formfields');
            }
            if (this.pdfViewer.enableFormFields && this.pdfViewer.formFieldsModule) {
                this.pdfViewer.formFieldsModule.formFieldCollections(data);
            }
            if (this.pdfViewer.formFieldCollections.length > 0) {
                this.pdfViewer.isFormFieldDocument = true;
                this.enableFormFieldButton(true);
            }
        }
    }

    /**
     * @param {boolean} isEnable - Enable or disable the toolbar itema.
     * @returns {void}
     * @private
     */
    public enableFormFieldButton(isEnable: boolean): void {
        if (isEnable) {
            this.pdfViewer.isFormFieldDocument = true;
        }
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.submitItem) {
            this.pdfViewer.toolbarModule.toolbar.enableItems(this.pdfViewer.toolbarModule.submitItem.parentElement, isEnable);
        }
    }

    private updateWaitingPopup(pageNumber: number): void {
        if (this.pageSize[parseInt(pageNumber.toString(), 10)].top != null) {
            const pageCurrentRect: ClientRect = this.getElement('_pageDiv_' + pageNumber).getBoundingClientRect();
            const waitingPopup: HTMLElement = this.getElement('_pageDiv_' + pageNumber).firstChild.firstChild as HTMLElement;
            if (pageCurrentRect.top < 0) {
                if (this.toolbarHeight + (this.viewerContainer.clientHeight / 2) - pageCurrentRect.top < pageCurrentRect.height) {
                    waitingPopup.style.top = ((this.getElement('_pageDiv_' + pageNumber).clientHeight / 2) - this.getElement('_pageDiv_' + pageNumber).clientTop) - this.toolbarHeight + 'px';
                } else {
                    if (this.toolbarHeight + (pageCurrentRect.bottom / 2) - pageCurrentRect.top < pageCurrentRect.height) {
                        waitingPopup.style.top = ((pageCurrentRect.bottom / 2) - this.getElement('_pageDiv_' + pageNumber).clientTop) - this.toolbarHeight + 'px';
                    }
                }
            } else {
                waitingPopup.style.top = this.getElement('_pageDiv_' + pageNumber).clientHeight / 2 + 'px';
            }
            if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && pageCurrentRect.width > this.viewerContainer.clientWidth) {
                waitingPopup.style.left = (this.getElement('_pageDiv_' + pageNumber).clientWidth / 2) + (this.viewerContainer.scrollLeft) + 'px';
            } else if (this.getZoomFactor() > 1.25 && pageCurrentRect.width > this.viewerContainer.clientWidth) {
                waitingPopup.style.left = this.getElement('_pageDiv_' + pageNumber).clientWidth / 2 + 'px';
            } else {
                waitingPopup.style.left = this.getElement('_pageDiv_' + pageNumber).clientWidth / 2 + 'px';
            }
        }
    }

    /**
     * @param {boolean} isPageNumber - It describes about the whether isPageNumber true or not
     * @private
     * @returns {number} - returned the page value.
     */
    public getActivePage(isPageNumber?: boolean): number {
        if (this.activeElements && !isNullOrUndefined(this.activeElements.activePageID)) {
            if (isPageNumber) {
                return this.activeElements.activePageID + 1;
            } else {
                return this.activeElements.activePageID;
            }
        } else {
            if (isPageNumber) {
                return this.currentPageNumber;
            } else {
                return this.currentPageNumber - 1;
            }
        }
    }

    private createWaitingPopup(pageNumber: number): void {
        const waitingPopup: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageNumber);
        if (waitingPopup) {
            createSpinner({ target: waitingPopup });
            this.setLoaderProperties(waitingPopup);
        }
    }

    private showLoadingIndicator(isShow: boolean): void {
        const waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
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

    private spinnerPosition(container: HTMLElement, pageIndex: number): void {
        const inner: HTMLElement = container.querySelector('.e-spinner-inner') as HTMLElement;
        const zoomValue: number = this.getZoomFactor();
        const width: number = this.pageSize[parseInt(pageIndex.toString(), 10)].width * zoomValue;
        const height: number = this.pageSize[parseInt(pageIndex.toString(), 10)].height * zoomValue;
        inner.style.top = (height / 2) + 'px';
        inner.style.left = (width / 2) + 'px';
        const circle: HTMLElement = inner.children[0] as HTMLElement;
        if (zoomValue <= 0.20) {
            circle.style.width = '20px';
            circle.style.height = '20px';
            circle.style.transformOrigin = '10px 10px 10px';
        } else if (zoomValue <= 0.45) {
            circle.style.width = '30px';
            circle.style.height = '30px';
            circle.style.transformOrigin = '15px 15px 15px';
        } else {
            circle.style.width = '48px';
            circle.style.height = '48px';
            circle.style.transformOrigin = '24px 24px 24px';
        }
    }

    /**
     * @param {number} pageIndex - It describes about the page index
     * @param {boolean} isShow - Show or hide page loading indicator.
     * @returns {void}
     * @private
     */
    public showPageLoadingIndicator(pageIndex: number, isShow: boolean): void {
        const waitingPopup: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
        if (waitingPopup != null) {
            this.spinnerPosition(waitingPopup, pageIndex);
            if (isShow) {
                showSpinner(waitingPopup);
            } else {
                hideSpinner(waitingPopup);
            }
            if (!isNullOrUndefined(this.pdfViewer.magnificationModule) && !this.pdfViewer.magnificationModule.isWaitingPopupUpdated) {
                this.updateWaitingPopup(pageIndex);
            }
        }
    }

    /**
     * @param {boolean} isShow - Show or hide print loading indicator.
     * @returns {void}
     * @private
     */
    public showPrintLoadingIndicator(isShow: boolean): void {
        const printWaitingPopup: HTMLElement = this.getElement('_printLoadingIndicator');
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

    /**
     * @param {HTMLElement} element - specifies the element.
     * @returns {void}
     * @private
     */
    public setLoaderProperties(element: HTMLElement): void {
        const spinnerElement: HTMLElement = (element.firstChild.firstChild.firstChild as HTMLElement);
        if (spinnerElement) {
            spinnerElement.style.height = '48px';
            spinnerElement.style.width = '48px';
            spinnerElement.style.transformOrigin = '24px 24px 24px';
        }
    }

    /**
     * @param {number} pageNumber - Specify the pageNumber.
     * @param {boolean} needToScroll - Ensure need to scroll or not
     * @returns {void}
     * @private
     */
    public updateScrollTop(pageNumber: number, needToScroll?: boolean): void {
        if (this.pageSize[parseInt(pageNumber.toString(), 10)] != null) {
            this.renderElementsVirtualScroll(pageNumber);
            if (isNullOrUndefined(needToScroll)) {
                this.viewerContainer.scrollTop = this.getPageTop(pageNumber);
            }
            if (this.renderedPagesList.indexOf(pageNumber) === -1) {
                this.createRequestForRender(pageNumber);
            }
            let pageIndex: number = pageNumber + 1;
            if (pageIndex < this.pdfViewer.pageCount) {
                if (this.renderedPagesList.indexOf(pageIndex) === -1) {
                    this.createRequestForRender(pageIndex);
                }
            }
            if (this.pageSize[parseInt(pageIndex.toString(), 10)]) {
                let pageTop: number = this.getPageTop(pageIndex);
                const viewerHeight: number = this.viewerContainer.clientHeight + this.getPageTop(pageIndex - 1);
                while (viewerHeight > pageTop) {
                    if (this.pageSize[parseInt(pageIndex.toString(), 10)]) {
                        this.renderPageElement(pageIndex);
                        if (this.renderedPagesList.indexOf(pageIndex) === -1) {
                            this.createRequestForRender(pageIndex);
                        }
                        pageTop = this.getPageTop(pageIndex);
                        pageIndex = pageIndex + 1;
                    } else {
                        break;
                    }
                }
            }
            setTimeout(
                () => {
                    const currentPageNumber: number = pageNumber + 1;
                    if (currentPageNumber !== this.currentPageNumber) {
                        this.pdfViewer.currentPageNumber = currentPageNumber;
                        this.currentPageNumber = currentPageNumber;
                        if (this.pdfViewer.toolbarModule) {
                            this.pdfViewer.toolbarModule.updateCurrentPage(currentPageNumber);
                        }
                    }
                },
                100);
        }
    }

    /**
     * @private
     * @returns {number} - Returns the zoom factor value.
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
     * @returns {number} - Get the custom zoom values
     */
    public getCustomZoomValues(): void {
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.isInitialCustomZoomValues = false;
        }
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
                this.customZoomValues.push(minZoom);
                idCounter++;
            }
            for (let i: number = 0; i < zoomValues.length; i++) {
                const zoom: number = zoomValues[parseInt(i.toString(), 10)];
                if (isWithinRange(zoom) && zoom !== minZoom && zoom !== maxZoom) {
                    items.push({ percent: zoom + '%', id: idCounter.toString() });
                    this.customZoomValues.push(zoom);
                    idCounter++;
                }
            }
            if (maxZoom != null && !items.some((item: any) => parseInt(item.id, 10) === maxZoom) && maxZoom !== minZoom) {
                items.push({ percent: maxZoom + '%', id: idCounter.toString() });
                this.customZoomValues.push(maxZoom);
                idCounter++;
            }
            items.sort((a: any, b: any) => parseInt(a.id, 10) - parseInt(b.id, 10));
            this.customZoomValues.sort((a: any, b: any) => parseInt(a.id, 10) - parseInt(b.id, 10));
        }
    }

    /**
     * @private
     * @returns {boolean} - Returns whether the pinch zoom is performed or not.
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
     * @returns {boolean} -Returns whether the zoom is performed or not.
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
     * @returns {string} - retrun the docuumentid.
     */
    public getDocumentId(): string {
        return this.documentId;
    }

    /**
     * @private
     * @returns {void}
     */
    public download(): void {
        if (this.pageCount > 0) {
            this.createRequestForDownload();
        }
    }

    /**
     * @private
     * @returns {promise<Blob>} - Returns the blob object.
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

    private fireCustomCommands(event: KeyboardEvent): void {
        let proxy: PdfViewerBase = null;
        // eslint-disable-next-line
        proxy = this;
        const commands: CommandManagerModel = proxy.pdfViewer.commandManager;
        const keyboardCommands: any =
        commands.keyboardCommand.map((command: { name: any; gesture: { pdfKeys: any; modifierKeys: any; }; }) => ({
            name: command.name,
            gesture: {
                pdfKeys: command.gesture.pdfKeys,
                modifierKeys: command.gesture.modifierKeys
            }
        }));
        const keyboardCommandJSONString: string = JSON.stringify(keyboardCommands);
        if (Object.keys(commands).length !== 0) {
            const commandsArr: any = JSON.parse(keyboardCommandJSONString);
            const modifiers: number = proxy.getModifiers(event);
            if (modifiers != null && event.keyCode) {
                const keyboardCommand: KeyboardCommandModel = {
                    name: '',
                    gesture: {
                        pdfKeys: event.keyCode,
                        modifierKeys: modifiers
                    }
                };
                // Find the matched command in the list
                const matchedCommand: any = commandsArr.find(function (commandObj: any): boolean {
                    return commandObj.gesture &&
                        commandObj.gesture.pdfKeys === keyboardCommand.gesture.pdfKeys &&
                        commandObj.gesture.modifierKeys === keyboardCommand.gesture.modifierKeys;
                });
                if (matchedCommand != null) {
                    keyboardCommand.name = matchedCommand.name;
                    keyboardCommand.gesture.modifierKeys = matchedCommand.gesture.modifierKeys;
                    keyboardCommand.gesture.pdfKeys = matchedCommand.gesture.pdfKeys;
                    proxy.pdfViewer.fireKeyboardCustomCommands(keyboardCommand);
                }
            }
        }
    }

    private getModifiers(event: any): number {
        const isMac: boolean = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)
            ? true
            : false;
        const isCommandKey: any = isMac ? event.metaKey : false;
        let modifiers: number = 0;
        if (event.ctrlKey || isCommandKey) { modifiers |= 1 << 0; }
        if (event.altKey) { modifiers |= 1 << 1; }
        if (event.shiftKey) { modifiers |= 1 << 2; }
        if (event.metaKey) { modifiers |= 1 << 3; }

        return modifiers;
    }

    private saveAsBlobRequest(): Promise<Blob> {
        let proxy: PdfViewerBase = null;
        // eslint-disable-next-line
        proxy = this;
        const promise: Promise<Blob> = new Promise((resolve: Function, reject: Function) => {
            const jsonObject: any = proxy.constructJsonDownload();
            const digitalSignature: boolean = proxy.clientSideRendering ? proxy.isDigitalSignaturePresent :
                (proxy.digitalSignaturePages && proxy.digitalSignaturePages.length !== 0);
            if (digitalSignature) {
                if (proxy.pdfViewer.isDocumentEdited) {
                    jsonObject['digitalSignatureDocumentEdited'] = true;
                } else {
                    jsonObject['digitalSignatureDocumentEdited'] = false;
                }
            }
            if (proxy.pdfViewer.isDocumentEdited || (!isNullOrUndefined(proxy.pdfViewer.pageOrganizer) &&
            proxy.pdfViewer.pageOrganizer.isDocumentModified)) {
                jsonObject['isPdfEdited'] = true;
            }
            else {
                jsonObject['isPdfEdited'] = false;
            }
            if (!isNullOrUndefined(this.pdfViewer.pageOrganizer) &&
             !isNullOrUndefined(this.pdfViewer.pageOrganizer.organizePagesCollection) && this.pdfViewer.pageOrganizer.isDocumentModified) {
                jsonObject['organizePages'] = JSON.stringify(this.pdfViewer.pageOrganizer.organizePagesCollection);
            }
            this.dowonloadRequestHandler = new AjaxHandler(this.pdfViewer);
            this.dowonloadRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.download;
            this.dowonloadRequestHandler.responseType = 'text';
            if (this.validateForm && this.pdfViewer.enableFormFieldsValidation) {
                this.pdfViewer.fireValidatedFailed(proxy.pdfViewer.serverActionSettings.download);
                this.validateForm = false;
            }
            else if (this.clientSideRendering) {
                const data: Uint8Array = this.pdfViewer.pdfRendererModule.getDocumentAsBase64(jsonObject);
                const resultdata: any = proxy.saveAsBlobFile(data, proxy);
                resolve(resultdata);
            } else {
                this.dowonloadRequestHandler.send(jsonObject);
            }
            this.dowonloadRequestHandler.onSuccess = function (result: any): void {
                const data: any = result.data;
                const resultdata: any = proxy.saveAsBlobFile(data, proxy);
                resolve(resultdata);
            };
            this.dowonloadRequestHandler.onFailure = function (result: any): void {
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
            };
            this.dowonloadRequestHandler.onError = function (result: any): void {
                proxy.openNotificationPopup();
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
            };
        });
        return promise;
    }

    private saveAsBlobFile(data: any, proxy: PdfViewerBase): Promise<unknown> {
        if (!this.clientSideRendering) {
            // eslint-disable-next-line
            return new Promise(function (resolve) {
                if (data) {
                    if (typeof data === 'object') {
                        data = JSON.parse(data);
                    }
                    if (typeof data !== 'object' && data.indexOf('data:application/pdf') === -1) {
                        proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.download);
                        data = null;
                    }
                    if (data) {
                        if (!proxy.clientSideRendering) {
                            proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.download, data);
                        }
                        const blobUrl: any = proxy.createBlobUrl(data.split('base64,')[1], 'application/pdf');
                        resolve(blobUrl);
                    }
                }
            });
        } else {
            return new Promise((resolve: any) => {
                if (data) {
                    if (typeof data !== 'object') {
                        proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.download);
                        data = null;
                    }
                    if (data) {
                        if (!proxy.clientSideRendering) {
                            proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.download, data);
                        }
                        const blobUrl: any = new Blob([data], { type: 'application/pdf' });
                        resolve(blobUrl);
                    }
                }
            });
        }
    }

    /**
     * @param {boolean} isTriggerEvent - check to trigger the event.
     * @returns {void}
     * @private
     */
    public clear(isTriggerEvent: boolean): void {
        // eslint-disable-next-line
        const proxy: PdfViewerBase = this;
        const pdfViewer: PdfViewer = proxy.pdfViewer;
        const printModule: Print = pdfViewer.printModule;
        const textSearchModule: TextSearch = pdfViewer.textSearchModule;
        const bookmarkViewModule: BookmarkView = pdfViewer.bookmarkViewModule;
        const thumbnailViewModule: ThumbnailView = pdfViewer.thumbnailView;
        const annotationModule: Annotation = pdfViewer.annotation;
        const magnificationModule: Magnification = pdfViewer.magnificationModule;
        const textSelectionModule: TextSelection = pdfViewer.textSelectionModule;
        const formFieldsModule: FormFields = pdfViewer.formFieldsModule;
        const signatureModule: Signature = proxy.signatureModule;
        const pageOrganizerModule: PageOrganizer = pdfViewer.pageOrganizer;
        proxy.isPasswordAvailable = false;
        proxy.isDocumentLoaded = false;
        proxy.isInitialLoaded = false;
        proxy.isImportAction = false;
        proxy.navigationPane.isThumbnailAddedProgrammatically = false;
        proxy.navigationPane.isThumbnail = false;
        proxy.annotationPageList = [];
        proxy.annotationComments = null;
        pdfViewer.annotationCollection = [];
        pdfViewer.signatureCollection = [];
        pdfViewer.formFieldCollection = [];
        pdfViewer.customContextMenuItems = [];
        proxy.isAnnotationCollectionRemoved = false;
        proxy.documentAnnotationCollections = null;
        proxy.isDrawnCompletely = false;
        proxy.annotationRenderredList = [];
        proxy.isImportAction = false;
        proxy.isImportedAnnotation = false;
        proxy.importedAnnotation = [];
        proxy.isStorageExceed = false;
        proxy.annotationStorage = {};
        proxy.formFieldStorage = {};
        proxy.downloadCollections = {};
        proxy.annotationEvent = null;
        proxy.highestWidth = 0;
        proxy.highestHeight = 0;
        proxy.requestLists = [];
        proxy.tilerequestLists = [];
        proxy.isToolbarInkClicked = false;
        pdfViewer.formFieldCollections = [];
        proxy.passwordData = '';
        proxy.isFocusField = false;
        proxy.focusField = [];
        proxy.modifiedPageIndex = [];
        proxy.isInkAnnot = false;
        proxy.updateDocumentEditedProperty(false);
        pdfViewer.clipboardData.clipObject = {};
        if (pdfViewer.pdfRendererModule && proxy.clientSideRendering) {
            proxy.pdfViewer.pdfRendererModule.pageRotationCollection = [];
        }
        if (pdfViewer.toolbar) {
            pdfViewer.toolbar.uploadedFile = null;
        }
        proxy.isTaggedPdf = false;
        if (pdfViewer.formDesignerModule) {
            pdfViewer.formDesignerModule.formFieldIndex = 0;
            if (proxy.activeElements) {
                pdfViewer.clearSelection(proxy.activeElements.activePageID);
            }
            pdfViewer.zIndexTable = [];
        }
        proxy.initiateTextSelectMode();
        proxy.RestrictionEnabled(proxy.restrictionList, true);
        proxy.restrictionList = null;
        if (!Browser.isDevice || pdfViewer.enableDesktopMode) {
            if (proxy.navigationPane.sideBarToolbar) {
                proxy.navigationPane.clear();
            }
        }
        if (!isBlazor() && Browser.isDevice || !pdfViewer.enableDesktopMode) {
            proxy.navigationPane.clear();
        }
        if (thumbnailViewModule) {
            thumbnailViewModule.clear();
        }
        if (bookmarkViewModule) {
            bookmarkViewModule.clear();
        }
        if (magnificationModule) {
            magnificationModule.isMagnified = false;
            magnificationModule.isFormFieldPageZoomed = false;
            magnificationModule.clearIntervalTimer();
        }
        if (textSelectionModule) {
            textSelectionModule.clearTextSelection();
        }
        if (textSearchModule) {
            textSearchModule.resetTextSearch(true);
        }
        if (annotationModule) {
            annotationModule.clear();
            annotationModule.initializeCollection();
        }
        if (formFieldsModule) {
            formFieldsModule.readOnlyCollection = [];
            formFieldsModule.signatureFieldCollection = [];
            formFieldsModule.renderedPageList = [];
            formFieldsModule.currentTarget = null;
        }
        if (signatureModule){
            signatureModule.signAnnotationIndex = [];
        }
        if (pageOrganizerModule) {
            pageOrganizerModule.clear();
        }
        if (proxy.pageSize) {
            proxy.pageSize = [];
        }
        if (proxy.renderedPagesList) {
            proxy.renderedPagesList = [];
        }
        if (proxy.accessibilityTagsCollection) {
            proxy.accessibilityTagsCollection = [];
        }
        if (proxy.pageRequestListForAccessibilityTags) {
            proxy.pageRequestListForAccessibilityTags = [];
        }
        if (proxy.pageContainer) {
            while (proxy.pageContainer.hasChildNodes()) {
                proxy.pageContainer.removeChild(proxy.pageContainer.lastChild);
            }
        }
        if (proxy.pageCount > 0) {
            proxy.unloadDocument(proxy);
            proxy.textLayer.characterBound = [];
            if (proxy.loadRequestHandler) {
                proxy.loadRequestHandler.clear();
            }
            if (proxy.requestCollection) {
                for (let i: number = 0; i < proxy.requestCollection.length; i++) {
                    const request: any = proxy.requestCollection[parseInt(i.toString(), 10)];
                    request.clear();
                }
                proxy.requestCollection = [];
            }
            if (proxy.virtualLoadRequestHandler) { proxy.virtualLoadRequestHandler.clear(); }
            if (proxy.pageRequestHandler) { proxy.pageRequestHandler.clear(); }
            if (proxy.dowonloadRequestHandler) { proxy.dowonloadRequestHandler.clear(); }
            if (proxy.importAnnotationRequestHandler) { proxy.importAnnotationRequestHandler.clear(); }
            if (proxy.exportAnnotationRequestHandler) { proxy.exportAnnotationRequestHandler.clear(); }
            if (proxy.importFormFieldsRequestHandler) { proxy.importFormFieldsRequestHandler.clear(); }
            if (proxy.exportFormFieldsRequestHandler) { proxy.exportFormFieldsRequestHandler.clear(); }
            if (printModule && printModule.printRequestHandler) {
                printModule.printRequestHandler.clear();
            }
        }
        proxy.windowSessionStorageClear();
        PdfViewerBase.sessionStorageManager.clear();
        if (proxy.pinchZoomStorage) {
            proxy.pinchZoomStorage = [];
        }
        if ((proxy.previousZoomValue || proxy.previousZoomValue === 0) && proxy.previousZoomValue !== pdfViewer.zoomValue) {
            pdfViewer.zoomValue = proxy.previousZoomValue;
        }
        if (isTriggerEvent && proxy.pageCount > 0) {
            pdfViewer.fireDocumentUnload(this.pdfViewer.fileName);
        }
        this.pdfViewer.fileName = null;
        if ((<any>window).customStampCollection instanceof Map) {
            (<any>window).customStampCollection.clear();
        }
        if ((<any>window).signatureCollection instanceof Map) {
            (<any>window).signatureCollection.clear();
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.pdfViewer.element.classList.remove('e-pv-mobile-view');
        }
        this.unWireEvents();
        this.clear(false);
        if (this.pageContainer) {
            if (this.pageContainer.parentNode) {
                this.pageContainer.parentNode.removeChild(this.pageContainer);
            }
        }
        if (this.viewerContainer) {
            if (this.viewerContainer.parentNode) {
                this.viewerContainer.parentNode.removeChild(this.viewerContainer);
            }
        }
        if (this.contextMenuModule) {
            const contextMenuElement: any = this.contextMenuModule.contextMenuElement;
            if (contextMenuElement && contextMenuElement.ej2_instances && contextMenuElement.ej2_instances.length > 0) {
                this.contextMenuModule.destroy();
            }
        }
        if (this.pdfViewer.toolbarModule) {
            this.navigationPane.destroy();
        }
        let measureElement: HTMLElement = document.getElementById('measureElement');
        if (measureElement) {
            measureElement = undefined;
        }
        if (!isNullOrUndefined(this.pdfViewer.annotationModule) && this.pdfViewer.annotationModule.measureAnnotationModule) {
            this.pdfViewer.annotationModule.measureAnnotationModule.destroy();
        }
    }

    /**
     * @param {PdfViewerBase} proxy - PdfviewerBase class.
     * @returns {void}
     * @private
     */
    public unloadDocument(proxy: PdfViewerBase): void {
        if (!this.clientSideRendering) {
            let documentId: string = '';
            const hashId: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_hashId');
            const documentLiveCount: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_documentLiveCount');
            const serviceURL: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_serviceURL');
            if (Browser.isIE || Browser.info.name === 'edge') {
                documentId = decodeURI(hashId);
            } else {
                documentId = proxy.hashId ? proxy.hashId : hashId;
            }
            if (documentId !== null) {
                const jsonObject: object = { hashId: documentId, documentLiveCount: documentLiveCount, action: 'Unload', elementId: proxy.pdfViewer.element.id };
                const actionName: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_unload');
                if (serviceURL !== 'undefined' && serviceURL !== 'null' && serviceURL !== '' && !isNullOrUndefined(serviceURL)) {
                    try {
                        const browserSupportsKeepalive: any = 'keepalive' in new Request('');
                        if (browserSupportsKeepalive) {
                            const headerValue: any = this.setUnloadRequestHeaders();
                            const credentialsData: RequestCredentials = this.pdfViewer.ajaxRequestSettings.withCredentials ? 'include' : 'omit';
                            fetch(serviceURL + '/' + actionName, {
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
                } else if (isBlazor()) {
                    this.clearCache(actionName, jsonObject, proxy);
                }
            }
        }
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.zoomFactor = 1;
        }
        this.formFieldCollection = [];
        this.textrequestLists = [];
        if (proxy.pdfViewer.textSearchModule && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
            this.pdfViewer.textSearchModule.showSearchBox(false);
            this.pdfViewer.textSearchModule.isDocumentTextCollectionReady = false;
        }
        PdfViewerBase.sessionStorageManager.clear();
    }

    private clearCache(actionName: string, jsonObject: any, proxy: PdfViewerBase): void {
        this.unloadRequestHandler = new AjaxHandler(this.pdfViewer);
        this.unloadRequestHandler.url = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_serviceURL') + '/' + actionName;
        this.unloadRequestHandler.mode = false;
        this.unloadRequestHandler.responseType = null;
        this.unloadRequestHandler.send(jsonObject);
        this.unloadRequestHandler.onSuccess = function (result: any): void {
            let data: any = result.data;
            if (data) {
                if (typeof data !== 'object') {
                    if (data.indexOf('Document') === -1) {
                        proxy.onControlError(500, data, actionName);
                        data = null;
                    }
                }
                if (data) {
                    proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.unload, data);
                }
            }
        };
        this.unloadRequestHandler.onFailure = function (result: any): void {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, actionName);
        };
        this.unloadRequestHandler.onError = function (result: any): void {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, actionName);
        };
    }

    private setUnloadRequestHeaders(): any {
        const myHeaders: any = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=UTF-8');
        if (!isNullOrUndefined(this.pdfViewer.ajaxRequestSettings) && !isNullOrUndefined(this.pdfViewer.ajaxRequestSettings.ajaxHeaders)) {
            for (let i: number = 0; i < this.pdfViewer.ajaxRequestSettings.ajaxHeaders.length; i++) {
                myHeaders.append(this.pdfViewer.ajaxRequestSettings.ajaxHeaders[parseInt(i.toString(), 10)].headerName,
                                 this.pdfViewer.ajaxRequestSettings.ajaxHeaders[parseInt(i.toString(), 10)].headerValue);
            }
        }
        return myHeaders;
    }

    private windowSessionStorageClear(): void {
        PdfViewerBase.sessionStorageManager.removeItem(this.documentId + '_currentDocument');
        PdfViewerBase.sessionStorageManager.removeItem(this.documentId + '_serviceURL');
        PdfViewerBase.sessionStorageManager.removeItem(this.documentId + '_unload');
        for (let i: number = 0; i < this.sessionStorage.length; i++) {
            PdfViewerBase.sessionStorageManager.removeItem(this.sessionStorage[parseInt(i.toString(), 10)]);
        }
    }

    private updateCommentPanel(): void {
        const moreOptionsButton: any = document.querySelectorAll('.e-pv-more-options-button');
        for (let i: number = 0; i < moreOptionsButton.length; i++) {
            moreOptionsButton[parseInt(i.toString(), 10)].style.visibility = 'hidden';
        }
        const commentTextBox: any = document.querySelectorAll('.e-pv-new-comments-div');
        for (let j: number = 0; j < commentTextBox.length; j++) {
            commentTextBox[parseInt(j.toString(), 10)].style.display = 'none';
        }
        const commentContainer: any = document.querySelectorAll('.e-pv-comments-border');
        for (let j: number = 0; j < commentContainer.length; j++) {
            commentContainer[parseInt(j.toString(), 10)].classList.remove('e-pv-comments-border');
        }
        const editableElement: any = document.querySelectorAll('.e-editable-inline');
        for (let j: number = 0; j < editableElement.length; j++) {
            editableElement[parseInt(j.toString(), 10)].style.display = 'none';
        }
        const commentSelect: any = document.querySelectorAll('.e-pv-comments-select');
        for (let z: number = 0; z < commentSelect.length; z++) {
            commentSelect[parseInt(z.toString(), 10)].classList.remove('e-pv-comments-select');
        }
        const commentsDiv: any = document.querySelectorAll('.e-pv-comments-div');
        for (let j: number = 0; j < commentsDiv.length; j++) {
            commentsDiv[parseInt(j.toString(), 10)].style.minHeight = 60 + 'px';
        }
    }

    /**
     * @param {boolean} isMouseDown - check whether the mouse down is triggered.
     * @returns {void}
     * @private
     */
    public focusViewerContainer(isMouseDown?: boolean): void {
        const scrollX: number = window.scrollX;
        const scrollY: number = window.scrollY;
        const parentNode: any = this.getScrollParent(this.viewerContainer);
        let scrollNodeX: number = 0;
        let scrollNodeY: number = 0;
        if (parentNode !== null) {
            scrollNodeX = parentNode.scrollLeft;
            scrollNodeY = parentNode.scrollTop;
        }
        if (!this.isgetFocused) {
            this.viewerContainer.focus();
        }
        this.isgetFocused = false;
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.stickyNotesAnnotationModule.accordionContainer) {
            this.updateCommentPanel();
        }
        if ((navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1 || navigator.userAgent.indexOf('Edge') !== -1) && parentNode !== null) {
            parentNode.scrollLeft = scrollNodeX;
            parentNode.scrollTop = scrollNodeY;
        } else if (parentNode !== null) {
            parentNode.scrollTo(scrollNodeX, scrollNodeY);
        }
        window.scrollTo(scrollX, scrollY);
    }

    private getScrollParent(node: any): any {
        if (node === null || node.nodeName === 'HTML') {
            return null;
        }
        const style: CSSStyleDeclaration = getComputedStyle(node);
        if (this.viewerContainer.id !== node.id && (style.overflowY === 'scroll' || style.overflowY === 'auto')) {
            return node;
        } else {
            return this.getScrollParent(node.parentNode);
        }
    }

    private createCorruptedPopup(isImportDoc: boolean): void {
        const popupElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_corrupted_popup', className: 'e-pv-corrupted-popup' });
        if (isImportDoc){
            this.pdfViewer.pageOrganizerModule.dialogDivElement.appendChild(popupElement);
        }
        else{
            this.pageContainer.appendChild(popupElement);
        }
        this.corruptPopup = new Dialog({
            showCloseIcon: true, closeOnEscape: true, isModal: true,
            header: '<div class="e-pv-corrupted-popup-header"> ' + this.pdfViewer.localeObj.getConstant('File Corrupted') + '</div>', visible: false,
            buttons: [{ buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.closeCorruptPopup.bind(this) }],
            target: this.pdfViewer.element, beforeClose: (): void => {
                this.corruptPopup.destroy();
                this.getElement('_corrupted_popup').remove();
                this.corruptPopup = null;
                const waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
                if (isImportDoc && this.pdfViewer.pageOrganizerModule.waitingPopup != null){
                    hideSpinner(this.pdfViewer.pageOrganizerModule.waitingPopup);
                }
                else if (waitingPopup != null) {
                    hideSpinner(waitingPopup);
                }
            }
        });
        if (this.pdfViewer.enableRtl) {
            this.corruptPopup.content = '<div id="e-pv-corrupted-templatertl" class="e-pv-notification-icon-rtl"> <div class="e-pv-corrupted-popup-content-rtl" tabindex="0">' + this.pdfViewer.localeObj.getConstant('File Corrupted Content') + '</div></div>';
            this.corruptPopup.enableRtl = true;
        } else {
            this.corruptPopup.content = '<div id="e-pv-corrupted-template" class="e-pv-notification-icon"> <div class="e-pv-corrupted-popup-content" tabindex="0">' + this.pdfViewer.localeObj.getConstant('File Corrupted Content') + '</div></div>';
        }
        this.corruptPopup.appendTo(popupElement);
    }

    /**
     * @private
     * @returns {void}
     */
    public hideLoadingIndicator(): void {
        const waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
        if (waitingPopup !== null) {
            hideSpinner(waitingPopup);
        }
    }

    private closeCorruptPopup(): void {
        this.corruptPopup.hide();
        const waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
        if (this.isImportDoc && this.pdfViewer.pageOrganizerModule.waitingPopup != null){
            hideSpinner(this.pdfViewer.pageOrganizerModule.waitingPopup);
        }
        else if (waitingPopup != null) {
            hideSpinner(waitingPopup);
        }
    }

    private createPrintPopup(): void {
        const element: HTMLElement = document.getElementById(this.pdfViewer.element.id);
        this.printMainContainer = createElement('div', {
            id: this.pdfViewer.element.id + '_printcontainer',
            className: 'e-pv-print-popup-container'
        });
        element.appendChild(this.printMainContainer);
        this.printMainContainer.style.display = 'none';
        const printWaitingPopup: HTMLElement = createElement('div', {
            id: this.pdfViewer.element.id + '_printLoadingIndicator',
            className: 'e-pv-print-loading-container'
        });
        this.printMainContainer.appendChild(printWaitingPopup);
        createSpinner({ target: printWaitingPopup, cssClass: 'e-spin-center' });
        this.setLoaderProperties(printWaitingPopup);
    }

    private createGoToPagePopup(): void {
        const popupElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_goTopage_popup', className: 'e-pv-gotopage-popup' });
        this.goToPageElement = createElement('span', { id: this.pdfViewer.element.id + '_prompt' });
        this.goToPageElement.textContent = this.pdfViewer.localeObj.getConstant('Enter pagenumber');
        popupElement.appendChild(this.goToPageElement);
        const inputContainer: HTMLElement = createElement('span', { className: 'e-pv-text-input' });
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
                    click: this.GoToPageCancelClick.bind(this)
                },
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('Apply'), disabled: true, cssClass: 'e-pv-gotopage-apply-btn', isPrimary: true },
                    click: this.GoToPageApplyClick.bind(this)
                }
            ], close: this.closeGoToPagePopUp.bind(this)
        });
        if (this.pdfViewer.enableRtl) {
            this.goToPagePopup.enableRtl = true;
        }
        this.goToPagePopup.appendTo(popupElement);
        if (!isBlazor()) {
            const goToPageTextBox: NumericTextBox = new NumericTextBox({ format: '##', showSpinButton: false });
            goToPageTextBox.appendTo(this.goToPageInput);
        }
        this.goToPageInput.addEventListener('keyup', () => {
            const inputValue: any = (this.goToPageInput as HTMLInputElement).value;
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
        const popupElements: any = document.getElementsByClassName('e-pv-gotopage-apply-btn')[0];
        popupElements.removeAttribute('disabled');
    }

    private DisableApplyButton(): void {

        const popupElements: any = document.getElementsByClassName('e-pv-gotopage-apply-btn')[0];
        popupElements.setAttribute('disabled', true);
    }
    private GoToPageCancelClick(): void {
        this.goToPagePopup.hide();
    }
    private GoToPageApplyClick(): void {
        this.goToPagePopup.hide();
        const pageNumber: any = (this.goToPageInput as HTMLInputElement).value;
        this.pdfViewer.navigation.goToPage(pageNumber);
        this.updateMobileScrollerPosition();
    }

    /**
     * @private
     * @returns {void}
     */
    public updateMobileScrollerPosition(): void {
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.mobileScrollerContainer) {
            const ratio: any = (this.viewerContainer.scrollHeight - this.viewerContainer.clientHeight) /
             (this.viewerContainer.clientHeight - 56);
            const differenceRatio: any = (this.viewerContainer.scrollTop) / ratio;
            const toolbarHeight: any = this.pdfViewer.toolbarModule ? this.toolbarHeight : 0;
            this.mobileScrollerContainer.style.top = (toolbarHeight + differenceRatio) + 'px';
        }
    }

    private createPasswordPopup(isImportDoc: boolean): void {
        const popupElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_password_popup', className: 'e-pv-password-popup', attrs: { 'tabindex': '-1' } });
        this.promptElement = createElement('span', { id: this.pdfViewer.element.id + '_prompt', attrs: { 'tabindex': '-1' } });
        this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Enter Password');
        popupElement.appendChild(this.promptElement);
        const inputContainer: HTMLElement = createElement('span', { className: 'e-input-group e-pv-password-input' });
        this.passwordInput = createElement('input', { id: this.pdfViewer.element.id + '_password_input', className: 'e-input' });
        (this.passwordInput as HTMLInputElement).type = 'password';
        (this.passwordInput as HTMLInputElement).name = 'Required';
        inputContainer.appendChild(this.passwordInput);
        popupElement.appendChild(inputContainer);
        if (isImportDoc){
            this.pdfViewer.pageOrganizerModule.dialogDivElement.appendChild(popupElement);
        }
        else{
            this.pageContainer.appendChild(popupElement);
        }
        this.passwordPopup = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true,
            header: this.pdfViewer.localeObj.getConstant('Password Protected'), visible: false,
            close: this.passwordCancel.bind(this), target: this.pdfViewer.element, beforeClose: (): void => {
                this.passwordPopup.destroy();
                this.getElement('_password_popup').remove();
                this.passwordPopup = null;
                const waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
                if (isImportDoc && this.pdfViewer.pageOrganizerModule.waitingPopup != null){
                    hideSpinner(this.pdfViewer.pageOrganizerModule.waitingPopup);
                }
                else if (waitingPopup != null) {
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


    private passwordCancel(args: any): void {
        if (args.isInteraction) {
            if (!this.isImportDoc && !this.pdfViewer.pageOrganizerModule){
                this.clear(false);
            }
            this.passwordDialogReset();
            (this.passwordInput as HTMLInputElement).value = '';
        }
        const waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
        if (this.isImportDoc && this.pdfViewer.pageOrganizerModule.waitingPopup != null){
            hideSpinner(this.pdfViewer.pageOrganizerModule.waitingPopup);
        }
        else if (waitingPopup !== null) {
            hideSpinner(waitingPopup);
        }
    }

    private passwordCancelClick(): void {
        if  (!this.isImportDoc && !this.pdfViewer.pageOrganizerModule){
            this.clear(false);
        }
        this.passwordDialogReset();
        this.passwordPopup.hide();
        const waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
        if (this.isImportDoc && this.pdfViewer.pageOrganizerModule.waitingPopup != null){
            hideSpinner(this.pdfViewer.pageOrganizerModule.waitingPopup);
        }
        else if (waitingPopup !== null) {
            hideSpinner(waitingPopup);
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public passwordDialogReset(): void {
        if (!isBlazor()) {
            if (this.promptElement) {
                this.promptElement.classList.remove('e-pv-password-error');
                this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Enter Password');
                (this.passwordInput as HTMLInputElement).value = '';
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public applyPassword(): void {
        if (!isBlazor()) {
            const password: string = (this.passwordInput as HTMLInputElement).value;
            if (!isNullOrUndefined(password) && password.length > 0) {
                if (this.isImportDoc && this.pdfViewer.pageOrganizerModule){
                    this.pdfViewer.pageOrganizerModule.loadImportDoc(this.pdfViewer.
                        pageOrganizerModule.importedDocumentData, password, true);
                }
                else{
                    this.pdfViewer.load(this.document, password);
                    this.focusViewerContainer();
                }
            }
        }
    }

    private createFileInputElement(): void {
        if (this.pdfViewer.enableAnnotationToolbar && this.pdfViewer.toolbarModule &&
                this.pdfViewer.toolbarModule.annotationToolbarModule) {
            this.pdfViewer.toolbarModule.annotationToolbarModule.createCustomStampElement();
        }
        if (this.signatureModule) {
            this.signatureModule.createSignatureFileElement();
        }
    }

    private wireEvents(): void {
        this.isDeviceiOS = ((['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'] as any).includes(navigator.platform) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document));
        this.isMacSafari = navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') === -1 && !this.isDeviceiOS;
        this.isWebkitMobile = /Chrome/.test(navigator.userAgent) || /Google Inc/.test(navigator.vendor) || (navigator.userAgent.indexOf('Safari') !== -1) || (navigator.userAgent.indexOf('WebKit') !== -1);
        this.viewerContainer.addEventListener('scroll', this.viewerContainerOnScroll, true);
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.viewerContainer.addEventListener('touchmove', this.viewerContainerOnScroll, true);
        }
        this.viewerContainer.addEventListener('mousedown', this.viewerContainerOnMousedown);
        this.viewerContainer.addEventListener('mouseup', this.viewerContainerOnMouseup);
        this.viewerContainer.addEventListener('wheel', this.detectTouchPad, false);
        this.viewerContainer.addEventListener('wheel', this.viewerContainerOnMouseWheel);
        if (this.isMacSafari) {
            window.addEventListener('gesturestart', (e: any) => e.preventDefault());
            window.addEventListener('gesturechange', (e: any) => e.preventDefault());
            window.addEventListener('gestureend', (e: any) => e.preventDefault());
            this.viewerContainer.addEventListener('gesturestart', this.handleMacGestureStart, false);
            this.viewerContainer.addEventListener('gesturechange', this.handleMacGestureChange, false);
            this.viewerContainer.addEventListener('gestureend', this.handleMacGestureEnd, false);
        }
        this.viewerContainer.addEventListener('mousemove', this.viewerContainerOnMousemove);
        this.viewerContainer.addEventListener('mouseleave', this.viewerContainerOnMouseLeave);
        this.viewerContainer.addEventListener('mouseenter', this.viewerContainerOnMouseEnter);
        this.viewerContainer.addEventListener('mouseover', this.viewerContainerOnMouseOver);
        this.viewerContainer.addEventListener('click', this.viewerContainerOnClick);
        this.viewerContainer.addEventListener('dblclick', this.viewerContainerOnClick);
        this.viewerContainer.addEventListener('dragstart', this.viewerContainerOnDragStart);
        this.pdfViewer.element.addEventListener('keydown', this.viewerContainerOnKeyDown);
        window.addEventListener('keydown', this.onWindowKeyDown);
        window.addEventListener('mouseup', this.onWindowMouseUp);
        window.addEventListener('touchend', this.onWindowTouchEnd);
        this.unload = () => { if (this.pdfViewerRunner !== null && this.pdfViewerRunner !== undefined) {
            this.pdfViewerRunner.terminate();
        }
        };
        this.unloadDocument(this);
        window.addEventListener('unload', this.unload);
        window.addEventListener('beforeunload', this.clearSessionStorage);
        window.addEventListener('resize', this.onWindowResize);
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Trident') !== -1) {
            this.viewerContainer.addEventListener('pointerdown', this.viewerContainerOnPointerDown);
            this.viewerContainer.addEventListener('pointermove', this.viewerContainerOnPointerMove);
            this.viewerContainer.addEventListener('pointerup', this.viewerContainerOnPointerEnd);
            this.viewerContainer.addEventListener('pointerleave', this.viewerContainerOnPointerEnd);
        } else {
            this.viewerContainer.addEventListener('touchstart', this.viewerContainerOnTouchStart);
            if (this.isWebkitMobile && this.isDeviceiOS) {
                this.viewerContainer.addEventListener('touchmove', (e: any) => { if (!isNullOrUndefined((e as any).scale) && ((e as any).scale !== 1)) { e.preventDefault(); } }, { passive: false });
            }
            this.viewerContainer.addEventListener('touchmove', this.viewerContainerOnTouchMove);
            this.viewerContainer.addEventListener('touchend', this.viewerContainerOnTouchEnd);
            this.viewerContainer.addEventListener('touchleave', this.viewerContainerOnTouchEnd);
            this.viewerContainer.addEventListener('touchcancel', this.viewerContainerOnTouchEnd);
        }
    }

    private unWireEvents(): void {
        if (this.viewerContainer) {
            this.viewerContainer.removeEventListener('scroll', this.viewerContainerOnScroll, true);
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.viewerContainer.removeEventListener('touchmove', this.viewerContainerOnScroll, true);
            }
            this.viewerContainer.removeEventListener('mousedown', this.viewerContainerOnMousedown);
            this.viewerContainer.removeEventListener('mouseup', this.viewerContainerOnMouseup);
            this.viewerContainer.removeEventListener('wheel', this.detectTouchPad, false);
            this.viewerContainer.removeEventListener('wheel', this.viewerContainerOnMouseWheel);
            if (this.isMacSafari) {
                window.removeEventListener('gesturestart', (e: any) => e.preventDefault());
                window.removeEventListener('gesturechange', (e: any) => e.preventDefault());
                window.removeEventListener('gestureend', (e: any) => e.preventDefault());
                this.viewerContainer.removeEventListener('gesturestart', this.handleMacGestureStart, false);
                this.viewerContainer.removeEventListener('gesturechange', this.handleMacGestureChange, false);
                this.viewerContainer.removeEventListener('gestureend', this.handleMacGestureEnd, false);
            }
            this.viewerContainer.removeEventListener('mousemove', this.viewerContainerOnMousemove);
            this.viewerContainer.removeEventListener('mouseleave', this.viewerContainerOnMouseLeave);
            this.viewerContainer.removeEventListener('mouseenter', this.viewerContainerOnMouseEnter);
            this.viewerContainer.removeEventListener('mouseover', this.viewerContainerOnMouseOver);
            this.viewerContainer.removeEventListener('click', this.viewerContainerOnClick);
            this.viewerContainer.removeEventListener('dragstart', this.viewerContainerOnDragStart);
            this.viewerContainer.removeEventListener('contextmenu', this.viewerContainerOnContextMenuClick);
            this.pdfViewer.element.removeEventListener('keydown', this.viewerContainerOnKeyDown);
            window.addEventListener('keydown', this.onWindowKeyDown);
            window.removeEventListener('mouseup', this.onWindowMouseUp);
            window.removeEventListener('unload', this.unload);
            window.removeEventListener('resize', this.onWindowResize);
            if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Trident') !== -1) {
                this.viewerContainer.removeEventListener('pointerdown', this.viewerContainerOnPointerDown);
                this.viewerContainer.removeEventListener('pointermove', this.viewerContainerOnPointerMove);
                this.viewerContainer.removeEventListener('pointerup', this.viewerContainerOnPointerEnd);
                this.viewerContainer.removeEventListener('pointerleave', this.viewerContainerOnPointerEnd);
            } else {
                this.viewerContainer.removeEventListener('touchstart', this.viewerContainerOnTouchStart);
                if (this.isWebkitMobile && this.isDeviceiOS) {
                    this.viewerContainer.removeEventListener('touchmove', (e: any) => { if (!isNullOrUndefined((e as any).scale) && ((e as any).scale !== 1)) { e.preventDefault(); } }, false);
                }
                this.viewerContainer.removeEventListener('touchmove', this.viewerContainerOnTouchMove);
                this.viewerContainer.removeEventListener('touchend', this.viewerContainerOnTouchEnd);
                this.viewerContainer.removeEventListener('touchleave', this.viewerContainerOnTouchEnd);
                this.viewerContainer.removeEventListener('touchcancel', this.viewerContainerOnTouchEnd);
            }
        }
    }

    /**
     * @returns {void}
     */
    private clearSessionStorage = (): void => {
        if (!this.clientSideRendering) {
            let documentId: string = '';
            const hashId: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_hashId');
            const documentLiveCount: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_documentLiveCount');
            const serviceURL: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_serviceURL');
            if (Browser.isIE || Browser.info.name === 'edge') {
                documentId = decodeURI(hashId);
            } else {
                documentId = hashId;
            }
            if (documentId != null) {
                const jsonObject: object = { hashId: documentId, documentLiveCount: documentLiveCount, action: 'Unload', elementId: this.pdfViewer.element.id };
                const actionName: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_unload');
                if (!isNullOrUndefined(serviceURL)) {
                    const browserSupportsKeepalive: any = 'keepalive' in new Request('');
                    if (browserSupportsKeepalive) {
                        const headerValue: any = this.setUnloadRequestHeaders();
                        const credentialsData: RequestCredentials = this.pdfViewer.ajaxRequestSettings.withCredentials ? 'include' : 'omit';
                        fetch(serviceURL + '/' + actionName, {
                            method: 'POST',
                            credentials: credentialsData,
                            headers: headerValue,
                            body: JSON.stringify(jsonObject)
                        });
                    }
                } else if (isBlazor()) {
                    this.clearCache(actionName, jsonObject, this);
                }
            }
        }
        PdfViewerBase.sessionStorageManager.clear();
    };

    /**
     * @private
     * @param {MouseEvent} event - Mouse event.
     * @returns {void}
     */
    public onWindowResize = (event?: MouseEvent): void => {
        let proxy: PdfViewerBase = null;
        // eslint-disable-next-line
        proxy = this;
        if (this.pdfViewer.enableRtl) {
            proxy.viewerContainer.style.right = (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) + 'px';
            proxy.viewerContainer.style.left = (proxy.navigationPane.commentPanelContainer ? proxy.navigationPane.commentPanelContainer.offsetWidth : 0) + 'px';
        } else {
            proxy.viewerContainer.style.left = (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) + 'px';
            proxy.viewerContainer.style.right = (proxy.navigationPane.commentPanelContainer ? proxy.navigationPane.commentPanelContainer.offsetWidth : 0) + 'px';
        }
        const viewerElementWidth: any = (proxy.pdfViewer.element.clientWidth > 0 ?
            proxy.pdfViewer.element.clientWidth : proxy.pdfViewer.element.style.width);
        const viewerWidth: any = (viewerElementWidth - (proxy.navigationPane.sideBarToolbar ?
            proxy.navigationPane.getViewerContainerLeft() : 0) - (proxy.navigationPane.commentPanelContainer ?
            proxy.navigationPane.getViewerContainerRight() : 0));
        proxy.viewerContainer.style.width = viewerWidth + 'px';
        if (proxy.pdfViewer.toolbarModule) {
            const toolbarContainer: any = isBlazor() ? proxy.pdfViewer.element.querySelector('.e-pv-toolbar') : proxy.getElement('_toolbarContainer');
            let toolbarHeight: number = 0;
            let formDesignerToolbarHeight: number = 0;
            if (toolbarContainer) {
                toolbarHeight = toolbarContainer.getBoundingClientRect().height;
            }
            if (proxy.isAnnotationToolbarHidden() || (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
                if (toolbarHeight === 0) {
                    if (this.navigationPane.isNavigationToolbarVisible) {

                        const navigationToolbar: any = proxy.getElement('_navigationToolbar');
                        toolbarHeight = navigationToolbar.getBoundingClientRect().height;
                    }
                }
                if (!proxy.isFormDesignerToolbarHidded()) {
                    const formDesignerToolbar: any = proxy.getElement('_formdesigner_toolbar');
                    formDesignerToolbarHeight = formDesignerToolbar ? formDesignerToolbar.getBoundingClientRect().height : 0;
                }
                proxy.viewerContainer.style.height =
                 proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, toolbarHeight + formDesignerToolbarHeight);
            } else {
                const annotationToolbarContainer: any = isBlazor() ? proxy.pdfViewer.element.querySelector('.e-pv-annotation-toolbar') : proxy.getElement('_annotation_toolbar');
                let annotationToolbarHeight: number = 0;
                if (annotationToolbarContainer) {
                    annotationToolbarHeight = annotationToolbarContainer.getBoundingClientRect().height;
                }
                proxy.viewerContainer.style.height =
                 proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, toolbarHeight + annotationToolbarHeight);
            }
        } else {
            proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 0);
        }
        if (proxy.pdfViewer.bookmarkViewModule && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
            const bookmarkContainer: HTMLElement = proxy.getElement('_bookmarks_container');
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
                proxy.pdfViewer.toolbarModule.onToolbarResize((proxy.navigationPane.sideBarToolbar ?
                    proxy.navigationPane.getViewerMainContainerWidth() : proxy.pdfViewer.element.clientWidth));
            }
        }
        if (this.pdfViewer.enableToolbar && this.pdfViewer.thumbnailViewModule) {
            proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.currentPageNumber - 1);
            if (proxy.navigationPane.sideBarToolbar && proxy.navigationPane.sideBarContentContainer) {
                proxy.navigationPane.sideBarContentContainer.style.height = proxy.viewerContainer.style.height;
            }
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
        if (proxy.navigationPane.sideBarToolbar) {
            proxy.navigationPane.sideBarToolbar.style.height = proxy.viewerContainer.style.height;
        }
    };

    /**
     * @private
     * @returns {void}
     */
    public updateZoomValue(): void {
        if (this.pdfViewer.magnificationModule) {
            if (this.pdfViewer.magnificationModule.isAutoZoom) {
                this.pdfViewer.magnificationModule.fitToAuto();
            } else if (this.pdfViewer.zoomMode !== 'FitToWidth' && this.pdfViewer.magnificationModule.fitType === 'fitToWidth') {
                this.pdfViewer.magnificationModule.fitToWidth();
            } else if (this.pdfViewer.zoomMode !== 'FitToPage' && this.pdfViewer.magnificationModule.fitType === 'fitToPage') {
                this.pdfViewer.magnificationModule.fitToPage();
            }
        }
        for (let i: number = 0; i < this.pageCount; i++) {
            this.applyLeftPosition(i);
        }
    }

    /**
     * @private
     * @param {any} annotation - The annotation type of any.
     * @returns {void}
     */
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

    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
    private viewerContainerOnMousedown = (event: MouseEvent): void => {
        this.isFreeTextContextMenu = false;
        let isUpdate: boolean = false;
        this.isSelection = true;
        const target: any = event.target;
        if (event.button === 0 && !this.getPopupNoteVisibleStatus() && !this.isClickedOnScrollBar(event, false)) {
            this.isViewerMouseDown = true;
            if (event.detail === 1 && target.className !== 'e-pdfviewer-formFields' && target.className !== 'free-text-input') {
                isUpdate = true;
                this.focusViewerContainer(true);
            }
            this.scrollPosition = this.viewerContainer.scrollTop / this.getZoomFactor();
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
            this.mouseLeft = event.clientX;
            this.mouseTop = event.clientY;
            const isIE: boolean = !!(document as any).documentMode;
            if (this.pdfViewer.textSelectionModule && !this.isClickedOnScrollBar(event, true) && !this.isTextSelectionDisabled) {
                if (!isIE && target.className !== 'e-pdfviewer-formFields' && target.className !== 'e-pdfviewer-ListBox' && target.className.indexOf('e-pv-formfield-dropdown') === -1 && target.className !== 'e-pv-formfield-listbox' && target.className !== 'e-pv-formfield-input' && target.className !== 'e-pv-formfield-textarea') {
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
            if (this.viewerContainer.contains(event.target as HTMLElement) && ((event.target as HTMLElement) !==
             this.viewerContainer) && ((event.target as HTMLElement) !== this.pageContainer) && this.isPanMode) {
                this.viewerContainer.style.cursor = 'grabbing';
            }
        }
        if (this.isShapeBasedAnnotationsEnabled() && (this.isAnnotationDrawn || !(target.className === 'e-pv-page-container' || (target.className === 'foreign-object' && isNaN(this.activeElements.activePageID))))) {
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
    };

    /**
     * @private
     * @param {MouseEvent} event - The mouse event.
     * @returns {void}
     */
    public mouseDownHandler(event: MouseEvent): void {
        let isEnableDelete: boolean = false;
        let isCancel: boolean;
        const hidenItems: string[] = [];
        const disabledItems: string[] = [];
        if (event && event.target) {
            this.mouseDownEvent = event;
            this.contextMenuModule.currentTarget = event.target as HTMLElement;
        }
        if (this.pdfViewer.annotationModule) {
            isEnableDelete = this.pdfViewer.annotationModule.isEnableDelete();
        }
        if (!isEnableDelete) {
            disabledItems.push('DeleteContext');
        }
        if (this.pdfViewer.contextMenuOption === 'None') {
            isCancel = true;
        } else if (this.pdfViewer.textSelectionModule || this.isShapeBasedAnnotationsEnabled()) {
            if (event) {
                const isClickWithinSelectionBounds: boolean = this.isClickWithinSelectionBounds(event);
                if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule &&
                     this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus) {
                    this.isFreeTextContextMenu = true;
                    if (this.pdfViewer.annotation.freeTextAnnotationModule &&
                         !this.pdfViewer.annotation.freeTextAnnotationModule.isTextSelected) {
                        disabledItems.push('Cut');
                        disabledItems.push('Copy');
                    }
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
                } else if (isClickWithinSelectionBounds && this.pdfViewer.textSelectionModule) {
                    if ((!(event.target as HTMLElement).classList.contains('e-pv-maintaincontent') && (event.target as HTMLElement).classList.contains('e-pv-text') || (event.target as HTMLElement).classList.contains('e-pv-text-layer'))) {
                        if (this.checkIsNormalText()) {
                            isCancel = true;
                        }
                    } else if ((Browser.isIE || Browser.info.name === 'edge') && (event.target as HTMLElement).classList.contains('e-pv-page-container')) {
                        isCancel = true;
                    }
                    hidenItems.push('Cut');
                    hidenItems.push('Paste');
                    hidenItems.push('DeleteContext');
                    hidenItems.push('ScaleRatio');
                    hidenItems.push('Comment');
                    hidenItems.push('Properties');
                } else if (this.pdfViewer.selectedItems.annotations.length !== 0 && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureText' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureImage')) {
                    this.shapeMenuItems(hidenItems, disabledItems, false, true);
                } else if (this.pdfViewer.selectedItems.annotations.length !== 0 && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType !== 'Path') {
                    this.shapeMenuItems(hidenItems, disabledItems, true);
                } else {
                    if (this.pdfViewer.annotation && this.pdfViewer.annotation.isShapeCopied && ((event.target as HTMLElement).classList.contains('e-pv-text-layer') ||
                        (event.target as HTMLElement).classList.contains('e-pv-text')) && !this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        hidenItems.push('Properties');
                        this.shapeMenuItems(hidenItems, disabledItems, false);
                    } else if (this.isCalibrateAnnotationModule() &&
                     this.pdfViewer.annotationModule.measureAnnotationModule.currentAnnotationMode) {
                        hidenItems.push('HighlightContext');
                        hidenItems.push('UnderlineContext');
                        hidenItems.push('StrikethroughContext');
                        hidenItems.push('Properties');
                        disabledItems.push('Cut');
                        disabledItems.push('Copy');
                        disabledItems.push('Paste');
                        disabledItems.push('DeleteContext');
                        disabledItems.push('Comment');
                    } else if (this.pdfViewer.annotationModule &&
                         this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
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
        const eventArgs: MouseDownEventArgs = { hidenItems: hidenItems, disabledItems: disabledItems, isCancel: isCancel };
        this.pdfViewer._dotnetInstance.invokeMethodAsync('MouseDownHandler', eventArgs);
    }

    /**
     * @private
     * @param {string} selectedMenu - The selected menu.
     * @returns {void}
     */
    public OnItemSelected(selectedMenu: string): void {
        const target: any = this.contextMenuModule.currentTarget;
        const commentPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
        const isCommentPanelPanel: boolean = commentPanel && commentPanel.style.display === 'block' ? true : false;
        switch (selectedMenu) {
        case this.pdfViewer.localeObj.getConstant('Copy'):
            this.CopyItemSelected();
            break;
        case this.pdfViewer.localeObj.getConstant('Highlight context'):
            this.TextMarkUpSelected('Highlight');
            if (!isCommentPanelPanel) {
                this.focusViewerContainer();
            }
            break;
        case this.pdfViewer.localeObj.getConstant('Underline context'):
            this.TextMarkUpSelected('Underline');
            if (!isCommentPanelPanel) {
                this.focusViewerContainer();
            }
            break;
        case this.pdfViewer.localeObj.getConstant('Strikethrough context'):
            this.TextMarkUpSelected('Strikethrough');
            if (!isCommentPanelPanel) {
                this.focusViewerContainer();
            }
            break;
        case this.pdfViewer.localeObj.getConstant('Properties'):
            this.PropertiesItemSelected();
            break;
        case this.pdfViewer.localeObj.getConstant('Cut'):
            this.CutItemSelected(target);
            this.focusViewerContainer();
            break;
        case this.pdfViewer.localeObj.getConstant('Paste'):
            this.pasteItemSelected(target);
            break;
        case this.pdfViewer.localeObj.getConstant('Delete Context'):
            this.DeleteItemSelected();
            this.focusViewerContainer();
            break;
        case this.pdfViewer.localeObj.getConstant('Scale Ratio'):
            this.ScaleRatioSelected();
            break;
        case this.pdfViewer.localeObj.getConstant('Comment'):
            this.CommentItemSelected();
            break;
        default:
            break;
        }
    }

    private CommentItemSelected(): void {
        if (this.pdfViewer.annotation) {
            this.pdfViewer.annotation.showCommentsPanel();
            if (this.pdfViewer.selectedItems.annotations.length !== 0 ||
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                let currentAnnotation: any;
                if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                    currentAnnotation = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
                } else {
                    currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
                }
                const accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                if (accordionExpand) {
                    accordionExpand.ej2_instances[0].expandItem(true);
                }
                const commentsDiv: any = document.getElementById(currentAnnotation.annotName);
                if (commentsDiv) {
                    if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                        commentsDiv.firstChild.click();
                    }
                }
            }
        }
    }

    private ScaleRatioSelected(): void {
        if (this.isCalibrateAnnotationModule()) {
            this.pdfViewer.annotation.measureAnnotationModule.createScaleRatioWindow();
        }
    }

    private DeleteItemSelected(): void {
        if (this.pdfViewer.formDesignerModule && this.pdfViewer.selectedItems.formFields.length !== 0) {
            this.pdfViewer.formDesignerModule.deleteFormField(this.pdfViewer.selectedItems.formFields[0].id);
        } else if (this.pdfViewer.annotation) {
            this.pdfViewer.annotation.deleteAnnotation();
        }
    }

    private pasteItemSelected(target: any): void {
        if (this.isFreeTextContextMenu || (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus) && (target && target.className === 'free-text-input' && target.tagName === 'TEXTAREA')) {
            this.pdfViewer.annotation.freeTextAnnotationModule.pasteSelectedText(target);
            this.contextMenuModule.close();
        } else {
            this.pdfViewer.paste();
            this.contextMenuModule.previousAction = 'Paste';
        }
    }

    private CutItemSelected(target: any): void {
        if (this.isFreeTextContextMenu || (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus) && (target && target.className === 'free-text-input' && target.tagName === 'TEXTAREA')) {
            this.pdfViewer.annotation.freeTextAnnotationModule.cutSelectedText(target);
            this.contextMenuModule.close();
        } else if (this.pdfViewer.selectedItems.annotations.length === 1) {
            const pageIndex: number = this.pdfViewer.selectedItems.annotations[0].pageIndex;
            this.pdfViewer.cut();
            this.contextMenuModule.previousAction = 'Cut';
        } else if (this.pdfViewer.selectedItems.formFields.length === 1) {
            this.pdfViewer.cut();
            this.contextMenuModule.previousAction = 'Cut';
        }
    }

    private CopyItemSelected(): void {
        let isSkip: boolean = false;
        if (this.isFreeTextContextMenu || (this.pdfViewer.annotationModule &&
             this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus)) {
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
        } else if (this.pdfViewer.selectedItems.formFields.length > 0) {
            this.pdfViewer.copy();
            this.contextMenuModule.previousAction = 'Copy';
        }
    }

    private PropertiesItemSelected(): void {
        if (this.pdfViewer.selectedItems.annotations.length !== 0 && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'LineWidthArrowHead' ||
            this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance')) {
            this.pdfViewer.annotation.createPropertiesWindow();
        } else if (this.pdfViewer.selectedItems.formFields.length !== 0 &&
             this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType) {
            this.pdfViewer.formDesigner.createPropertiesWindow();
        }
    }

    private TextMarkUpSelected(type: string): void {
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
            this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = false;
            this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations(type);
            this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
            this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAddMode = '';
            this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = true;
        }
    }

    private shapeMenuItems(hidenItems: string[], disabledItems: string[], enableProperties: boolean, isSignature?: boolean): void {
        if (this.pdfViewer.annotation && !this.pdfViewer.annotation.isShapeCopied) {
            disabledItems.push('Paste');
        }
        hidenItems.push('HighlightContext');
        hidenItems.push('UnderlineContext');
        hidenItems.push('StrikethroughContext');
        hidenItems.push('ScaleRatio');
        if (enableProperties) {
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

    /**
     * @param {string} text - It describes about the text
     * @private
     * @returns {boolean} - boolean
     */
    public checkIsRtlText(text: string): boolean {
        const ltrChars: string = 'A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02B8\\u0300-\\u0590\\u0800-\\u1FFF' + '\\u2C00-\\uFB1C\\uFDFE-\\uFE6F\\uFEFD-\\uFFFF';
        const rtlChars: string = '\\u0591-\\u07FF\\uFB1D-\\uFDFD\\uFE70-\\uFEFC';
        // eslint-disable-next-line
        const rtlDirCheck: any = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']');
        return rtlDirCheck.test(text);
    }

    /**
     * @private
     * @param {any} event - Specifies the event.
     * @returns {boolean} - retruned the beolean value.
     */
    public isClickWithinSelectionBounds(event: any): boolean {
        let bounds: IRectangle;
        let isWithin: boolean = false;
        const diCount: number = 5;
        const negativeCount: number = ((this.currentPageNumber - diCount) < 0) ? 0 : this.currentPageNumber - diCount;
        const positiveCount: number = ((this.currentPageNumber - diCount) > this.pageCount) ?
            this.pageCount : this.currentPageNumber + diCount;
        if (this.pdfViewer.textSelectionModule) {
            for (let i: number = negativeCount; i < positiveCount; i++) {
                if (i >= 0) {
                    bounds = this.pdfViewer.textSelectionModule.getCurrentSelectionBounds(i);
                    if (bounds) {
                        const currentBound: IRectangle = bounds;
                        if ((this.getHorizontalValue(currentBound.left, i) < event.clientX &&
                         this.getHorizontalValue(currentBound.right, i) >
                            event.clientX && this.getVerticalValue(currentBound.top, i) < event.clientY &&
                            this.getVerticalValue(currentBound.bottom, i) > event.clientY) ||
                             (this.pdfViewer.textSelectionModule.selectionRangeArray[0].rectangleBounds.length === 1 &&
                                 event.clientX !== 0) && !this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                                 isTextMarkupAnnotationMode) {
                            isWithin = true;
                            break;
                        }
                    }
                }
            }
            if ((Browser.isDevice && this.pdfViewer.textSelectionModule.selectionRangeArray &&
                this.pdfViewer.textSelectionModule.selectionRangeArray.length === 1) ||
                ((Browser.isIE || Browser.info.name === 'edge') && bounds) || this.pdfViewer.textSelectionModule.isTouchSelection) {
                if (this.pdfViewer.textSelectionModule.selectionRangeArray.length > 0 &&
                    !this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                    isWithin = true;
                }
            }
        }
        return isWithin;
    }

    private getHorizontalClientValue(value: number): number {
        const pageDiv: HTMLElement = this.getElement('_pageDiv_' + (this.currentPageNumber - 1));
        const pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value - pageBounds.left);
    }

    private getVerticalClientValue(value: number): number {
        const pageDiv: HTMLElement = this.getElement('_pageDiv_' + (this.currentPageNumber - 1));
        const pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value - pageBounds.top);
    }

    private getHorizontalValue(value: number, pageNumber: number): number {
        const pageDiv: HTMLElement = this.getElement('_pageDiv_' + (pageNumber || this.currentPageNumber - 1));
        const pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value * this.getZoomFactor()) + pageBounds.left;
    }

    private getVerticalValue(value: number, pageNumber: number): number {
        const pageDiv: HTMLElement = this.getElement('_pageDiv_' + (pageNumber || this.currentPageNumber - 1));
        const pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value * this.getZoomFactor()) + pageBounds.top;
    }

    /**
     * @private
     * @returns {boolean} - retruned the beolean value.
     */
    public checkIsNormalText(): boolean {
        let isText: boolean = true;
        let currentText: string = '';

        const textSelectionModule: any = this.pdfViewer.textSelectionModule;
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

    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
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
            let isSignatureFieldReadOnly: boolean = false;
            if (event.target) {
                if ((event.target as HTMLElement).className === 'e-pv-show-designer-name' && (event.target as HTMLElement).id.split('_', 1) as any !== '') {
                    isSignatureFieldReadOnly = (document.getElementById((event.target as HTMLElement).id.split('_', 1) as any) as any).disabled;
                }
                if ((event.target as HTMLElement).className === 'foreign-object' && (event.target as HTMLElement).children[0]) {
                    isSignatureFieldReadOnly = ((event.target as HTMLElement).children[0] as any).disabled;
                }
            }
            if (isSignatureFieldReadOnly && this.pdfViewer.annotation) {
                this.pdfViewer.annotation.clearSelection();
            }
            if (this.isShapeBasedAnnotationsEnabled() && !isSignatureFieldReadOnly && (this.isAnnotationDrawn || this.action !== 'DrawTool')) {
                this.diagramMouseUp(event);
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.onAnnotationMouseUp();
                }
            }
            if (this.pdfViewer.selectedItems.formFields.length > 0) {
                if (!isNullOrUndefined(this.pdfViewer.toolbar) &&
                 !isNullOrUndefined(this.pdfViewer.toolbar.formDesignerToolbarModule) && !Browser.isDevice) {
                    this.pdfViewer.toolbar.formDesignerToolbarModule.showHideDeleteIcon(true);
                }
            } else {
                if (!isNullOrUndefined(this.pdfViewer.toolbar) &&
                 !isNullOrUndefined(this.pdfViewer.toolbar.formDesignerToolbarModule) && !Browser.isDevice) {
                    this.pdfViewer.toolbar.formDesignerToolbarModule.showHideDeleteIcon(false);
                }
            }
            this.isSelection = false;
            const commentElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
            if (commentElement && commentElement.style.display === 'block') {
                if (this.pdfViewer.selectedItems) {
                    if (this.pdfViewer.selectedItems.annotations.length !== 0) {
                        const accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                        if (accordionExpand) {
                            accordionExpand.ej2_instances[0].expandItem(true);
                        }
                        const commentsDiv: any = document.getElementById(this.pdfViewer.selectedItems.annotations[0].annotName);
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
                const eventTarget: HTMLElement = event.target as HTMLElement;
                let offsetX: number = event.clientX;
                let offsetY: number = event.clientY;
                const zoomFactor: number = this.getZoomFactor();
                let pageIndex: number = this.currentPageNumber;
                if (eventTarget) {
                    const pageString: any = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1] || eventTarget.id.split('_pageDiv_')[1] || eventTarget.id.split('_freeText_')[1] || eventTarget.id.split('_')[1];
                    pageIndex = parseInt(pageString, 10);
                    if (isNaN(pageIndex) && this.pdfViewer.formFieldCollection) {
                        const formFieldsTargetId: any = this.pdfViewer.formFieldCollection.filter((targetFormField: any) => (targetFormField.id === eventTarget.id) || (targetFormField.id === eventTarget.id.split('_')[0]));
                        if (formFieldsTargetId.length > 0) {
                            pageIndex = formFieldsTargetId[0].pageIndex;
                        }
                    }
                }
                const pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
                if (pageDiv) {
                    const pageCurrentRect: ClientRect = pageDiv.getBoundingClientRect();
                    offsetX = (event.clientX - pageCurrentRect.left) / zoomFactor;
                    offsetY = (event.clientY - pageCurrentRect.top) / zoomFactor;
                }
                if (eventTarget && eventTarget.classList && !eventTarget.classList.contains('e-pv-hyperlink') && !eventTarget.classList.contains('e-pv-page-container')) {
                    this.pdfViewer.firePageClick(offsetX, offsetY, pageIndex + 1);
                    if (this.pdfViewer.formFieldsModule && !this.pdfViewer.formDesignerModule) {
                        this.signatureModule.removeFocus();
                    }
                }
                if (this.isTextMarkupAnnotationModule() && !this.isToolbarInkClicked) {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationMouseUp(event);
                }
                if (this.pdfViewer.formDesignerModule && !this.pdfViewer.annotationModule) {
                    this.pdfViewer.formDesignerModule.updateCanvas(pageIndex);
                }
                if (this.viewerContainer.contains(event.target as HTMLElement) &&
                 ((event.target as HTMLElement) !== this.viewerContainer) &&
                  ((event.target as HTMLElement) !== this.pageContainer) && this.isPanMode) {
                    this.viewerContainer.style.cursor = 'move';
                    this.viewerContainer.style.cursor = '-webkit-grab';
                    this.viewerContainer.style.cursor = '-moz-grab';
                    this.viewerContainer.style.cursor = 'grab';
                }
            }
            this.isViewerMouseDown = false;
        }
    };

    /**
     * @param {any} event - The Wheel event.
     * @returns {void}
     */
    private detectTouchPad = (event: any): void => {
        this.isTouchPad = event.wheelDeltaY ? (event.wheelDeltaY === (event.deltaY * -3) ?
            true : Math.abs(event.deltaY) < 60) : (event.deltaMode === 0);
    };

    /**
     * @param {any} event - The Wheel event.
     * @returns {void}
     */
    private handleMacGestureStart = (event: any): void => {
        event.preventDefault();
        event.stopPropagation();
        this.macGestureStartScale = this.pdfViewer.magnification.zoomFactor;
    };

    /**
     * @param {any} event - The Wheel event.
     * @returns {void}
     */
    private handleMacGestureChange = (event: any): void => {
        event.preventDefault();
        event.stopPropagation();
        const macX: number = event.clientX;
        const macY: number = event.clientY;
        const scale: number = Number((this.macGestureStartScale * event.scale).toFixed(2));
        if (!this.isMacGestureActive) {
            this.isMacGestureActive = true;
            this.pdfViewer.magnification.initiateMouseZoom(macX, macY, scale * 100);
            setTimeout(() => {
                this.isMacGestureActive = false;
            }, 50);
        }
    };

    /**
     * @param {any} event - The Wheel event.
     * @returns {void}
     */
    private handleMacGestureEnd = (event: any): void => {
        event.preventDefault();
        event.stopPropagation();
    };

    /**
     * @param {WheelEvent} event - The MouseEvent.
     * @returns {void}
     */
    private viewerContainerOnMouseWheel = (event: WheelEvent): void => {
        this.isViewerMouseWheel = true;
        if (this.getRerenderCanvasCreated()) {
            event.preventDefault();
        }
        if (event.ctrlKey) {
            let zoomDifference: number = 25;
            if (this.pdfViewer.magnificationModule ? this.pdfViewer.magnification.zoomFactor : this.pdfViewer.zoomValue < 1) {
                zoomDifference = 10;
            }
            if (this.pdfViewer.magnificationModule ? this.pdfViewer.magnification.zoomFactor : this.pdfViewer.zoomValue >= 2) {
                zoomDifference = 50;
            }
            if (this.isTouchPad && !this.isMacSafari) {
                zoomDifference = zoomDifference / this.zoomInterval;
            }

            if (this.pdfViewer.magnificationModule) {
                if ((event as any).wheelDelta > 0) {
                    this.pdfViewer.magnification.initiateMouseZoom(event.x, event.y, (this.pdfViewer.magnification.zoomFactor * 100)
                     + zoomDifference);
                } else {
                    this.pdfViewer.magnification.initiateMouseZoom(event.x, event.y, (this.pdfViewer.magnification.zoomFactor * 100)
                     - zoomDifference);
                }
            }
            this.isTouchPad = false;
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
    };

    /**
     * @param {KeyboardEvent} event - The KeyboardEvent.
     * @returns {void}
     */
    private onWindowKeyDown = (event: KeyboardEvent): void => {
        const isMac: boolean = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
        const isCommandKey: boolean = isMac ? event.metaKey : false;
        if ((this.isFreeTextAnnotationModule() && this.pdfViewer.annotationModule
            && (this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus === true
                || this.pdfViewer.annotationModule.inputElementModule.isInFocus === true))) {
            return;
        }
        if (!event.ctrlKey || !isCommandKey) {
            switch (event.keyCode) {
            case 46: {
                const activeElement: HTMLElement = document.activeElement as HTMLElement;
                if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA' && !activeElement.isContentEditable) {
                    this.DeleteKeyPressed(event);
                }
                break;
            }
            case 27:
                if (this.pdfViewer.toolbar) {
                    this.pdfViewer.toolbar.addInkAnnotation();
                    this.pdfViewer.toolbar.deSelectCommentAnnotation();
                    this.pdfViewer.toolbar.updateStampItems();
                    if (this.pdfViewer.toolbar.annotationToolbarModule) {
                        if (isBlazor()) {
                            this.pdfViewer.toolbar.annotationToolbarModule.deselectAllItemsInBlazor();
                        } else {
                            this.pdfViewer.toolbar.annotationToolbarModule.deselectAllItems();
                        }
                    }
                    if (this.pdfViewer.isFormDesignerToolbarVisible && document.getElementById('FormField_helper_html_element')) {
                        const formFieldElement: HTMLElement = document.getElementById('FormField_helper_html_element');
                        if (formFieldElement) {
                            formFieldElement.remove();
                        }
                    }
                    this.pdfViewer.tool = '';
                    this.focusViewerContainer();
                }
                if (this.pdfViewer.textSearchModule) {
                    if (this.pdfViewer.textSearchModule.textSearchOpen) {
                        this.pdfViewer.textSearchModule.showSearchBox(false);
                    }
                }
                break;
            case 13:
                if (this.pdfViewer.formDesignerModule) {
                    if ((event.type === 'keydown' && event.keyCode === 13)) {
                        if (event.target && ((event.target as any).id || (event.target as any).tabIndex) &&
                         this.pdfViewer.formFieldCollections) {
                            let fieldId: any;
                            let currentTarget: any = event.target;
                            if (((event.target as any).tabIndex && !(event.target as any).id)) {
                                currentTarget = (event.target as any).parentElement;
                                fieldId = currentTarget.id.split('_content_html_element')[0];
                            } else {
                                currentTarget = event.target;
                                fieldId = currentTarget.id.split('_')[0];
                            }
                            for (let i: number = 0; i < this.pdfViewer.formFieldCollections.length; i++) {
                                const formfield: FormFieldModel = this.pdfViewer.formFieldCollections[parseInt(i.toString(), 10)];
                                if (fieldId === formfield.id && (formfield.type === 'SignatureField' || formfield.type === 'InitialField')) {
                                    this.pdfViewer.fireFormFieldClickEvent('formFieldClicked', this.pdfViewer.formFieldCollections[parseInt(i.toString(), 10)]);
                                    event.preventDefault();
                                }
                            }
                        }
                    }
                }
                break;
            case 32:
                if (this.pdfViewer.formDesignerModule) {
                    if ((event.type === 'keydown' && event.keyCode === 32)) {
                        if (event.target && (event.target as any).id && this.pdfViewer.formFields) {
                            for (let i: number = 0; i < this.pdfViewer.formFields.length; i++) {
                                const formField: PdfFormFieldBaseModel = this.pdfViewer.formFields[parseInt(i.toString(), 10)];
                                if ((event.target as any).id.split('_')[0] === formField.id && (formField.formFieldAnnotationType === 'Checkbox')) {
                                    this.pdfViewer.formDesignerModule.setCheckBoxState(event);
                                    event.preventDefault();
                                    break;
                                }
                            }
                        }
                    }
                }
                break;
            case 9:
                if (event.target && ((event.target as any).id || (event.target as any).tabIndex) && this.pdfViewer.formFieldCollections) {
                    {
                        if ((event.target as any).className === 'e-pv-formfield-input' || (event.target as any).className === 'foreign-object' || (event.target as any).id === this.pdfViewer.element.id + '_viewerContainer') {
                            let nextField: any;
                            let fieldIndex: any;
                            let currentTarget: any = event.target;
                            let id: any;
                            if (((event.target as any).tabIndex && !(event.target as any).id)) {
                                currentTarget = (event.target as any).parentElement;
                                id = currentTarget.id.split('_content_html_element')[0];
                            } else {
                                currentTarget = event.target;
                                id = currentTarget.id.split('_input')[0];
                            }
                            if (this.pdfViewer.formDesignerModule) {
                                if ((event.shiftKey && event.key === 'Tab')) {
                                    fieldIndex = this.pdfViewer.formFieldCollections.findIndex(function (field: any): boolean
                                    { return field.id === id; });
                                    nextField = fieldIndex > 0 ? this.pdfViewer.formFieldCollections[fieldIndex - 1] :
                                        this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.length - 1];
                                }
                                else {
                                    fieldIndex = this.pdfViewer.formFieldCollections.findIndex((field: any) => field.id === id);
                                    nextField = fieldIndex + 1 < this.pdfViewer.formFieldCollections.length ?
                                        this.pdfViewer.formFieldCollections[fieldIndex + 1] : this.pdfViewer.formFieldCollections[0];
                                }
                                this.pdfViewer.focusFormField(nextField);
                                event.preventDefault();
                            }
                            if (!this.pdfViewer.formDesigner) {
                                if (!(currentTarget.className === 'e-pdfviewer-formFields')) {
                                    if ((event.shiftKey && event.key === 'Tab')) {
                                        fieldIndex = this.pdfViewer.formFieldCollections.findIndex(function (field: any): boolean
                                        { return field.id === currentTarget.id; });
                                        nextField = fieldIndex > 0 ? this.pdfViewer.formFieldCollections[fieldIndex - 1] :
                                            this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.length - 1];
                                    }
                                    else {
                                        fieldIndex = this.pdfViewer.formFieldCollections.
                                            findIndex((field: any) => field.id === currentTarget.id);
                                        nextField = fieldIndex + 1 < this.pdfViewer.formFieldCollections.length ?
                                            this.pdfViewer.formFieldCollections[fieldIndex + 1] : this.pdfViewer.formFieldCollections[0];
                                    }
                                    this.pdfViewer.focusFormField(nextField);
                                    event.preventDefault();
                                }
                            }
                        }
                    }
                }
                if (event.target && (event.target as any).id && this.pdfViewer.formFields) {
                    for (let i: number = 0; i < this.pdfViewer.formFields.length; i++) {
                        const formField: PdfFormFieldBaseModel = this.pdfViewer.formFields[parseInt(i.toString(), 10)];
                        if ((event.target as any).id === formField.id) {
                            const field: any = {
                                value: (formField as any).value, fontFamily: formField.fontFamily,
                                fontSize: formField.fontSize, fontStyle: (formField as any).fontStyle,
                                color: formField.color, backgroundColor: formField.backgroundColor,
                                alignment: formField.alignment, isReadonly: (formField as any).isReadonly,
                                visibility: (formField as any).visibility,
                                maxLength: (formField as any).maxLength, isRequired: (formField as any).isRequired,
                                isPrint: formField.isPrint, rotation: (formField as any).rotateAngle, tooltip: (formField as any).tooltip,
                                options: (formField as any).options, isChecked: (formField as any).isChecked,
                                isSelected: (formField as any).isSelected
                            };
                            this.pdfViewer.fireFocusOutFormField((field as any), (formField as any).pageIndex);
                        }
                    }
                }
                break;
            case 40:
                if (event.key === 'ArrowDown') {
                    const targetElement: HTMLElement = event.target as HTMLElement;
                    if (targetElement.id === this.pdfViewer.element.id + '_zoomDropDown') {
                        this.pdfViewer.magnificationModule.zoomIn();
                        targetElement.focus();
                    }
                }
                break;
            case 38:
                if (event.key === 'ArrowUp') {
                    const targetElement: HTMLElement = event.target as HTMLElement;
                    if (targetElement.id === this.pdfViewer.element.id + '_zoomDropDown') {
                        this.pdfViewer.magnificationModule.zoomOut();
                        targetElement.focus();
                    }
                }
                break;
            }
        }
    };

    /**
     * @param {KeyboardEvent} event - The KeyboardEvent.
     * @returns {void}
     */
    private viewerContainerOnKeyDown = (event: KeyboardEvent): void => {
        const isMac: boolean = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
        const isCommandKey: boolean = isMac ? event.metaKey : false;
        const commands: CommandManagerModel = this.pdfViewer.commandManager;
        if (Object.keys(commands).length !== 0) {
            this.fireCustomCommands(event);
        }
        if ((!this.pdfViewer.pageOrganizerModule) ||
            (this.pdfViewer.pageOrganizerModule && (!this.pdfViewer.pageOrganizerModule.isOrganizeWindowOpen
                || ((event.ctrlKey || event.metaKey) && event.altKey && event.keyCode === 51 && !event.shiftKey)))) {
            if ((this.isFreeTextAnnotationModule() && this.pdfViewer.annotationModule
            && (this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus === true
                || this.pdfViewer.annotationModule.inputElementModule.isInFocus === true))) {
                return;
            }
            if (event.shiftKey) {
                if (!(event.target as HTMLElement).classList.contains('e-pv-formfield-input') &&
                    (!(event.target as HTMLElement).classList.contains('e-textbox')) &&
                    (!(event.target as HTMLElement).classList.contains('e-pdfviewer-formFields')) &&
                    (!(event.target as HTMLElement).classList.contains('e-pv-formfield-textarea')) &&
                    (event.target as HTMLElement).id !== this.pdfViewer.element.id + '_search_input') {
                    switch (event.keyCode) {
                    case 72: { //h key
                        event.preventDefault();
                        if (this.pdfViewer.toolbarModule && this.pdfViewer.enableToolbar &&
                            this.pdfViewer.toolbarSettings.toolbarItems.indexOf('PanTool') !== -1) {
                            //this used to select pan mode
                            this.pdfViewer.interactionMode = 'Pan';
                            this.focusViewerContainer();
                        }
                    }
                        break;
                    case 86: {   //v key
                        event.preventDefault();
                        if (this.pdfViewer.toolbarModule && this.pdfViewer.enableToolbar &&
                            this.pdfViewer.toolbarSettings.toolbarItems.indexOf('SelectionTool') !== -1) {
                            //this used to select text selection mode
                            this.pdfViewer.interactionMode = 'TextSelection';
                            this.focusViewerContainer();
                        }
                    }
                        break;
                    }
                }
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
                    if (this.pdfViewer.toolbarModule && this.pdfViewer.enableToolbar &&
                        this.pdfViewer.toolbarSettings.toolbarItems.indexOf('OpenOption') !== -1) {
                        this.pdfViewer.toolbarModule.openFileDialogBox(event);
                    }
                    else {
                        event.preventDefault();
                    }
                    break;
                case 67: // c key
                    if (this.pdfViewer.textSelectionModule &&
                        this.pdfViewer.enableTextSelection &&
                        !this.isTextSelectionDisabled && this.isTargetClassNameValid(event)) {
                        event.preventDefault();
                        this.pdfViewer.textSelectionModule.copyText();
                    }
                    if (this.pdfViewer.selectedItems.annotations.length || this.pdfViewer.selectedItems.formFields.length) {
                        this.pdfViewer.copy();
                        this.contextMenuModule.previousAction = 'Copy';
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
                        this.pdfViewer.firePrintStart();
                    }
                    break;
                case 83: {  //s key
                    event.preventDefault();
                    this.pdfViewer.download();
                }
                    break;
                case 90: //z key
                    if (!(this.pdfViewer.textSearchModule && this.isTextSearchBoxOpen())) {
                        if (this.pdfViewer.annotationModule && this.focusOnViewerContainer()) {
                            if (!isNullOrUndefined(this.pdfViewer.annotationModule) &&
                                this.pdfViewer.toolbarModule.annotationToolbarModule.inkAnnotationSelected) {
                                this.pdfViewer.annotationModule.setAnnotationMode('None');
                            }
                            this.pdfViewer.annotationModule.undo();
                        }
                    }
                    break;
                case 88: //x key
                    if (this.pdfViewer.selectedItems.annotations.length || this.pdfViewer.selectedItems.formFields.length) {
                        this.pdfViewer.cut();
                        this.contextMenuModule.previousAction = 'Cut';
                    }
                    break;
                case 89: //y key
                    if (!(this.pdfViewer.textSearchModule && this.isTextSearchBoxOpen())) {
                        if (this.pdfViewer.annotationModule && this.focusOnViewerContainer()) {
                            this.pdfViewer.annotationModule.redo();
                        }
                    }
                    break;
                case 86: //v key
                    if ((this.pdfViewer.annotation && this.pdfViewer.annotation.isShapeCopied) ||
                    (this.pdfViewer.formFields && this.pdfViewer.formDesigner && this.pdfViewer.formDesigner.isShapeCopied)) {
                        let isSearchboxDialogOpen: boolean;
                        const searchBoxId: any = document.getElementById(this.pdfViewer.element.id + '_search_box');
                        if (searchBoxId) {
                            isSearchboxDialogOpen = searchBoxId.style.display !== 'none';
                        }
                        if (!isSearchboxDialogOpen && this.pdfViewer.formDesigner && this.isTargetClassNameValid(event) && (event.target as any).className !== 'e-pv-properties-tooltip-prop-input e-input e-lib e-textbox e-control') {
                            this.pdfViewer.paste();
                            this.contextMenuModule.previousAction = 'Paste';
                        }
                    }
                    break;
                case 71: // 'g' key
                    {
                        // this is used to focus the Go to Page Input textbox
                        event.preventDefault();
                        const gotoPageInput: HTMLElement = document.querySelector(
                            '.e-control.e-numerictextbox.e-lib.e-input'
                        );
                        if (
                            this.pdfViewer.toolbarModule &&
                                this.pdfViewer.enableToolbar &&
                                gotoPageInput != null &&
                                gotoPageInput.style.display !== 'none'
                        ) {
                            gotoPageInput.blur();
                            gotoPageInput.focus();
                        }
                    }
                    break;
                case 48:  //0 key
                    {
                        //this is used to open the comment panel
                        if (event.altKey) {
                            event.preventDefault();
                            const commentPanel: HTMLElement = document.getElementById(
                                this.pdfViewer.element.id + '_commantPanel'
                            );
                            if (this.pageCount > 0 && commentPanel.style.display === 'none') {
                                this.pdfViewer.annotationModule.showCommentsPanel();
                            } else {
                                this.navigationPane.closeCommentPanelContainer();
                            }
                        }
                    }
                    break;
                case 49:    //1 key
                    {
                        //this is used to open the thumbnail pane
                        if (event.altKey) {
                            event.preventDefault();
                            if (this.pageCount > 0 && this.pdfViewer.enableThumbnail) {
                                event.preventDefault();
                                this.navigationPane.sideToolbarOnClick(event);
                                this.focusViewerContainer();
                            }
                        }
                    }
                    break;
                case 50:    //2 key
                    {
                        //this is used to open the bookmark panel
                        if (event.altKey) {
                            event.preventDefault();
                            if (this.pageCount > 0 && this.pdfViewer.enableBookmark) {
                                this.navigationPane.bookmarkButtonOnClick(event);
                                this.focusViewerContainer();
                            }
                        }
                    }
                    break;
                case 51:
                    {
                        if (event.altKey) {
                            event.preventDefault();
                            if (!isNullOrUndefined(this.pdfViewer.pageOrganizer) && this.pageCount > 0
                            && this.pdfViewer.enablePageOrganizer) {
                                this.pdfViewer.pageOrganizer.switchPageOrganizer();
                                this.focusViewerContainer();
                            }
                        }
                    }
                    break;
                case 65:  //"a" key
                    if (event.shiftKey) {
                        //this is used to open annoatation bar
                        event.preventDefault();
                        if (this.pageCount > 0 && this.pdfViewer.enableAnnotationToolbar &&
                            this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
                            this.pdfViewer.toolbarModule.initiateAnnotationMode(null, true);
                            this.focusViewerContainer();
                        }
                        const hightLightButton: HTMLElement =
                        document.getElementById(this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar.items[0].id);
                        if (hightLightButton) {
                            hightLightButton.focus();
                        }

                    }
                    break;
                default:
                    break;
                }
            } else {
                if (this.pdfViewer.annotationModule && !this.pdfViewer.textSearchModule) {
                    if (event.key === 'Delete') {
                        const activeElement: HTMLElement = document.activeElement as HTMLElement;
                        if ((event.target as HTMLElement).className !== 'e-pdfviewer-formFields' && activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA' && !activeElement.isContentEditable)
                        {this.DeleteKeyPressed(event); }
                    }
                }
            }
            if (this.pdfViewer.magnificationModule) {
                this.pdfViewer.magnificationModule.magnifyBehaviorKeyDown(event);
            }
        }
    };

    private isTextSearchBoxOpen(): boolean{
        let isSearchboxDialogOpen: boolean;
        const searchBoxId: any = document.getElementById(this.pdfViewer.element.id + '_search_box');
        if (searchBoxId) {
            isSearchboxDialogOpen = searchBoxId.style.display !== 'none';
        }
        return isSearchboxDialogOpen;
    }

    private isTargetClassNameValid(event: KeyboardEvent): boolean {
        return (event.target as any).className !== 'e-pv-formfield-input' &&
            (event.target as any).className !== 'e-pv-formfield-textarea' &&
            (event.target as any).className !== 'e-pv-properties-name-edit-input e-input e-lib e-textbox e-control' &&
            (event.target as any).className !== 'e-pv-properties-value-input e-input e-lib e-textbox e-control' && (event.target as any).id !== this.pdfViewer.element.id + '_search_input' && (event.target as any).className !== 'e-input-group e-pv-search-input e-input-focus' && (event.target as any).className !== 'e-pdfviewer-formFields';
    }

    private DeleteKeyPressed(event: KeyboardEvent): void {
        let isSearchboxDialogOpen: boolean;
        const searchBoxId: any = document.getElementById(this.pdfViewer.element.id + '_search_box');
        if (searchBoxId) {
            isSearchboxDialogOpen = searchBoxId.style.display !== 'none';
        }
        if (this.pdfViewer.formDesignerModule && !this.pdfViewer.formDesigner.isPropertyDialogOpen &&
             this.pdfViewer.designerMode && this.pdfViewer.selectedItems.formFields.length !== 0 && !isSearchboxDialogOpen) {
            this.pdfViewer.formDesignerModule.deleteFormField(this.pdfViewer.selectedItems.formFields[0].id);
        } else if (this.pdfViewer.annotation && !this.pdfViewer.designerMode && (event.srcElement as HTMLElement).parentElement.classList && !(event.srcElement as HTMLElement).parentElement.classList.contains('e-input-focus')) {
            if (this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus() && !isSearchboxDialogOpen) {
                this.pdfViewer.annotationModule.deleteAnnotation();
            }
            if (this.pdfViewer.selectedItems.annotations.length > 0) {
                const annotation: any = this.pdfViewer.selectedItems.annotations[0];
                let isReadOnly: boolean = true;
                const type: any = annotation.shapeAnnotationType;
                if (type === 'Path' || annotation.formFieldAnnotationType === 'SignatureField' || annotation.formFieldAnnotationType === 'InitialField' || type === 'HandWrittenSignature' || type === 'SignatureText' || type === 'SignatureImage') {
                    const inputFields: any = document.getElementById(annotation.id);
                    if (inputFields && inputFields.disabled) {
                        isReadOnly = true;
                    }
                }
                if (!isReadOnly) {
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
        }
    }

    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
    private viewerContainerOnMousemove = (event: MouseEvent): void => {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        const isIE: boolean = !!(document as any).documentMode;
        const target: HTMLElement = event.target as HTMLElement;
        if (this.action === 'Drag') {
            event.preventDefault();
        }
        if (this.isViewerMouseDown && !(this.action === 'Perimeter' || this.action === 'Polygon' || this.action === 'Line' || this.action === 'DrawTool' || this.action === 'Distance')) {
            if (this.pdfViewer.textSelectionModule && this.pdfViewer.enableTextSelection &&
                 !this.isTextSelectionDisabled && !this.getPopupNoteVisibleStatus()) {
                // text selection won't perform if we start the selection from hyperlink content by commenting this line.
                // this region block the toc/hyperlink navigation on sometimes.
                // if ((event.target as HTMLElement).classList.contains('e-pv-hyperlink') && this.pdfViewer.linkAnnotationModule) {
                // this.pdfViewer.linkAnnotationModule.modifyZindexForHyperlink((event.target as HTMLElement), true);
                // }
                if (!isIE) {
                    if ((event.target as HTMLElement).className !== 'e-pdfviewer-formFields') { event.preventDefault(); }
                    this.mouseX = event.clientX;
                    this.mouseY = event.clientY;
                    const annotationModule: any = this.pdfViewer.annotationModule;
                    if (annotationModule && annotationModule.textMarkupAnnotationModule &&
                         annotationModule.textMarkupAnnotationModule.isDropletClicked &&
                          annotationModule.textMarkupAnnotationModule.
                              isEnableTextMarkupResizer(annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode)) {
                        annotationModule.textMarkupAnnotationModule.textSelect(event.target, this.mouseX, this.mouseY);
                    } else {
                        this.pdfViewer.textSelectionModule.textSelectionOnMouseMove(event.target, this.mouseX, this.mouseY);
                    }
                } else {
                    const selection: Selection = window.getSelection();
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
            if (event.target && ((event.target as PdfAnnotationBaseModel).id.indexOf('_text') > -1 || ((event.target as HTMLElement).parentElement.classList.contains('foreign-object')) || (event.target as PdfAnnotationBaseModel).id.indexOf('_annotationCanvas') > -1 || (event.target as HTMLElement).classList.contains('e-pv-hyperlink')) && this.pdfViewer.annotation || (event.target as HTMLElement).classList.contains('e-pdfviewer-formFields') || (event.target as HTMLElement).classList.contains('e-pv-text-layer')) {
                let pageIndex: number;
                if (this.pdfViewer.annotation) {
                    pageIndex = this.pdfViewer.annotation.getEventPageNumber(event);
                }
                else {
                    const pageId: string = (event.target as HTMLElement).id;
                    const match: RegExpMatchArray = pageId.match(/\d+/);
                    pageIndex = match ? parseInt(match[0], 10) : this.pdfViewer.currentPageNumber - 1;
                }
                const diagram: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
                if (diagram) {
                    const canvas1: Rect = diagram.getBoundingClientRect() as any;
                    const left: number = canvas1.x ? canvas1.x : canvas1.left;
                    const top: number = canvas1.y ? canvas1.y : canvas1.top;
                    if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.stampAnnotationModule.currentStampAnnotation && this.pdfViewer.annotationModule.stampAnnotationModule.currentStampAnnotation.shapeAnnotationType === 'Image') {
                        canvas = new Rect(left, top, canvas1.width - 10, canvas1.height - 10);
                    } else {
                        canvas = new Rect(left + 1, top + 1, canvas1.width - 3, canvas1.height - 3);
                    }
                }
            } else if (!this.pdfViewer.annotationModule && this.pdfViewer.formDesignerModule) {
                const pageIndex: number = this.pdfViewer.formDesignerModule.getEventPageNumber(event);
                const diagram: HTMLElement = this.getAnnotationCanvas('_annotationCanvas_', pageIndex);
                if (diagram) {
                    const canvas1: Rect = diagram.getBoundingClientRect() as any;
                    const left: number = canvas1.x ? canvas1.x : canvas1.left;
                    const top: number = canvas1.y ? canvas1.y : canvas1.top;
                    canvas = new Rect(left + 10, top + 10, canvas1.width - 10, canvas1.height - 10);
                }
            }
            const stampModule: StampAnnotation = this.pdfViewer.annotationModule ?
                this.pdfViewer.annotationModule.stampAnnotationModule : null;
            if (canvas && canvas.containsPoint({ x: this.mouseX, y: this.mouseY }) && !(stampModule && stampModule.isStampAnnotSelected)) {
                this.diagramMouseMove(event);
                this.annotationEvent = event;
            } else {
                this.diagramMouseLeave(event);
                if (this.isAnnotationDrawn && !this.pdfViewer.isFormDesignerToolbarVisible) {
                    if (this.eventArgs && !this.eventArgs.source) {
                        const entries: any = (<any>Object).entries(this.pdfViewer.nameTable);
                        if (entries.length > 0) {
                            const lastValue: any = entries[entries.length - 1][1];
                            this.eventArgs.source = lastValue;
                        }
                    }
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
    };

    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
    private panOnMouseMove = (event: MouseEvent): void => {
        let isStampMode: boolean = false;
        if (this.action === 'Ink' || this.action === 'Line' || this.action === 'Perimeter' || this.action === 'Polygon' || this.action === 'DrawTool' || this.action === 'Drag' || this.action.indexOf('Rotate') !== -1 || this.action.indexOf('Resize') !== -1) {
            isStampMode = true;
        }
        if (this.viewerContainer.contains(event.target as HTMLElement) && ((event.target as HTMLElement) !==
         this.viewerContainer) && ((event.target as HTMLElement) !== this.pageContainer) && !isStampMode) {
            if (this.isViewerMouseDown) {
                const deltaX: number = this.dragX - event.pageX;
                const deltaY: number = this.dragY - event.pageY;
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
    };

    /**
     * @private
     * @returns {void}
     */
    public initiatePanning(): void {
        this.isPanMode = true;
        this.textLayer.modifyTextCursor(false);
        this.disableTextSelectionMode();
        if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
            this.pdfViewer.toolbar.annotationToolbarModule.deselectAllItems();
        }
    }

    /**
     * @private
     * @returns {void}
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

    /**
     * @private
     * @returns {void}
     */
    public initiateTextSelection(): void {
        if (this.pdfViewer.toolbar && !this.pdfViewer.toolbar.isSelectionToolDisabled) {
            this.initiateTextSelectMode();
            this.pdfViewer.toolbar.updateInteractionTools(true);
        }
    }

    private enableAnnotationAddTools(isEnable: boolean): void {
        if (this.pdfViewer.toolbarModule) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableAnnotationAddTools(isEnable);
            }
        }
    }

    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
    private viewerContainerOnMouseLeave = (event: MouseEvent): void => {
        if (this.isViewerMouseDown) {
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                this.pdfViewer.textSelectionModule.textSelectionOnMouseLeave(event);
            }
        }
        if (this.pdfViewer.textSelectionModule && this.pdfViewer.textSelectionModule.isTextSelection) {
            event.preventDefault();
        }
        if (this.action === 'Ink') {
            this.diagramMouseUp(event);
            this.isAnnotationAdded = true;
        }
    };

    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
    private viewerContainerOnMouseEnter = (event: MouseEvent): void => {
        if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
            this.pdfViewer.textSelectionModule.clear();
        }
    };

    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
    private viewerContainerOnMouseOver = (event: MouseEvent): void => {

        const isIE: boolean = !!(document as any).documentMode;
        if (this.isViewerMouseDown) {
            if (!isIE) {
                event.preventDefault();
            }
        }
    };

    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
    private viewerContainerOnClick = (event: MouseEvent): void => {
        if (event.type === 'dblclick') {
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled && !this.getCurrentTextMarkupAnnotation()) {
                if ((event.target as HTMLElement).classList.contains('e-pv-text')) {
                    this.isViewerContainerDoubleClick = true;
                    if (!this.getTextMarkupAnnotationMode()) {
                        const pageNumber: number = parseFloat((event.target as HTMLElement).id.split('_')[2]);
                        this.pdfViewer.fireTextSelectionStart(pageNumber + 1);
                    }
                    this.pdfViewer.textSelectionModule.selectAWord(event.target, event.clientX, event.clientY, false);
                    if (this.pdfViewer.contextMenuSettings.contextMenuAction === 'MouseUp') {
                        this.pdfViewer.textSelectionModule.calculateContextMenuPosition(event.clientY, event.clientX);
                    }
                    if (!this.getTextMarkupAnnotationMode()) {
                        this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(true, false);
                        this.dblClickTimer = setTimeout(
                            () => {
                                this.applySelection();
                            }, 100);
                        this.pdfViewer.textSelectionModule.fireTextSelectEnd();
                    } else if (this.isTextMarkupAnnotationModule() && this.getTextMarkupAnnotationMode()) {

                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                            drawTextMarkupAnnotations(this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
                    }
                }
            } else if (this.getCurrentTextMarkupAnnotation()) {
                // this.pdfViewer.annotationModule.showAnnotationPopup(event);
            }
            if (this.action && (this.action === 'Perimeter' || this.action === 'Polygon') && this.tool) {
                this.eventArgs.position = this.currentPosition;
                this.getMouseEventArgs(this.currentPosition, this.eventArgs, event, this.eventArgs.source);
                const ctrlKey: boolean = this.isMetaKey(event);
                const info: Info = { ctrlKey: event.ctrlKey, shiftKey: event.shiftKey };
                this.eventArgs.info = info;
                this.eventArgs.clickCount = event.detail;
                this.eventArgs.isTouchMode = false;
                (this.tool as PolygonDrawingTool).mouseUp(this.eventArgs, true);

            }
            if ((this.pdfViewer.selectedItems ||
                (this.pdfViewer.annotation &&
                     this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation)) &&
                      !this.pdfViewer.annotationSettings.isLock) {
                const currentAnnotation: any = this.pdfViewer.selectedItems.annotations[0];
                if (this.pdfViewer.selectedItems.annotations.length !== 0 &&
                     !(currentAnnotation.annotationSettings.isLock || currentAnnotation.isLock)) {
                    if (this.pdfViewer.annotationModule && !currentAnnotation.formFieldAnnotationType) {
                        this.pdfViewer.annotationModule.annotationSelect(currentAnnotation.annotName,
                                                                         currentAnnotation.pageIndex, currentAnnotation, null, true);
                        if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus === false) {
                            if (this.isFreeTextAnnotation(this.pdfViewer.selectedItems.annotations) === true &&
                             !this.pdfViewer.selectedItems.annotations[0].isLock) {
                                const elmtPosition: PointModel = {};
                                elmtPosition.x = this.pdfViewer.selectedItems.annotations[0].bounds.x;
                                elmtPosition.y = this.pdfViewer.selectedItems.annotations[0].bounds.y;
                                this.pdfViewer.annotation.freeTextAnnotationModule.
                                    addInuptElemet(elmtPosition, this.pdfViewer.selectedItems.annotations[0]);
                            } else if (this.pdfViewer.selectedItems.annotations[0].enableShapeLabel === true) {
                                const elmtPosition: PointModel = {};
                                elmtPosition.x = this.pdfViewer.selectedItems.annotations[0].bounds.x;
                                elmtPosition.y = this.pdfViewer.selectedItems.annotations[0].bounds.y;
                                this.pdfViewer.annotation.inputElementModule.
                                    editLabel(elmtPosition, this.pdfViewer.selectedItems.annotations[0]);
                            } else {
                                const accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                                if (accordionExpand) {
                                    accordionExpand.ej2_instances[0].expandItem(true);
                                }
                                if (this.pdfViewer.toolbarModule && this.pdfViewer.isFormDesignerToolbarVisible &&
                                     this.pdfViewer.enableAnnotationToolbar && !this.pdfViewer.isAnnotationToolbarVisible &&
                                      !isNullOrUndefined(this.pdfViewer.toolbarModule.annotationToolbarModule)) {
                                    this.pdfViewer.toolbarModule.annotationToolbarModule.
                                        showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                                }
                                const commentsDiv: any = document.getElementById(this.pdfViewer.selectedItems.annotations[0].annotName);
                                if (commentsDiv) {
                                    if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                                        commentsDiv.firstChild.click();
                                    }
                                }
                            }
                        }
                    }
                } else {
                    const annotation: any = this.pdfViewer.annotation;
                    const annotationModule: any = this.pdfViewer.annotationModule;
                    if (annotation && annotationModule.textMarkupAnnotationModule &&
                         annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        const annotation: any =
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
                        this.pdfViewer.annotationModule.
                            annotationSelect(annotation.annotName,
                                             this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage,
                                             annotation, null, true);
                        const accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.currentPageNumber);
                        if (accordionExpand) {
                            accordionExpand.ej2_instances[0].expandItem(true);
                        }
                        const comments: any = document.getElementById(annotation.annotName);
                        if (comments) {
                            comments.firstChild.click();
                        }
                    }
                }
            }
            if (this.pdfViewer.designerMode && this.pdfViewer.selectedItems.formFields.length > 0) {
                const eventArgs: FormFieldDoubleClickArgs = { name: 'formFieldDoubleClick', field: this.pdfViewer.selectedItems.formFields[0] as IFormField, cancel: false };
                this.pdfViewer.fireFormFieldDoubleClickEvent(eventArgs);
                if (!eventArgs.cancel) {
                    this.pdfViewer.formDesigner.createPropertiesWindow();
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
    };

    private applySelection(): void {
        if (window.getSelection().anchorNode !== null) {
            this.pdfViewer.textSelectionModule.applySpanForSelection();
        }
        this.isViewerContainerDoubleClick = false;
    }

    /**
     * @param {DragEvent} event - The DragEvent.
     * @returns {void}
     */
    private viewerContainerOnDragStart = (event: DragEvent): void => {
        const isIE: boolean = !!(document as any).documentMode;
        if (!isIE) {
            event.preventDefault();
        }
    };

    private viewerContainerOnContextMenuClick = (event: any): void => {
        this.isViewerMouseDown = false;
    };

    private onWindowMouseUp = (event: MouseEvent): any => {
        this.isFreeTextContextMenu = false;
        this.isNewStamp = false;
        this.signatureAdded = false;
        const annotationModule: Annotation = this.pdfViewer.annotationModule;
        if (annotationModule && annotationModule.textMarkupAnnotationModule &&
             annotationModule.textMarkupAnnotationModule.
                 isEnableTextMarkupResizer(annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode)) {
            const modules: any = annotationModule.textMarkupAnnotationModule;
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
                if (this.isNewFreeTextAnnotation()) {
                    if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled && !this.getTextMarkupAnnotationMode()) {
                        if (event.detail === 1 && !this.viewerContainer.contains(event.target as HTMLElement) &&
                         !this.contextMenuModule.contextMenuElement.contains(event.target as HTMLElement)) {
                            if (window.getSelection().anchorNode !== null) {
                                this.pdfViewer.textSelectionModule.textSelectionOnMouseup(event);
                            }
                        }
                        const target: any = event.target;
                        if (this.viewerContainer.contains(event.target as HTMLElement) && target.className !== 'e-pdfviewer-formFields' && target.className !== 'e-pv-formfield-input' && target.className !== 'e-pv-formfield-textarea') {
                            if (!this.isClickedOnScrollBar(event, true) && !this.isScrollbarMouseDown) {
                                this.pdfViewer.textSelectionModule.textSelectionOnMouseup(event);
                            } else {
                                if (window.getSelection().anchorNode !== null) {
                                    this.pdfViewer.textSelectionModule.applySpanForSelection();
                                }
                            }
                        }
                    } else if (this.getTextMarkupAnnotationMode()) {
                        const viewerElement: HTMLElement = this.pdfViewer.element;
                        const targetElement: any = event.target;
                        if (viewerElement && targetElement) {
                            if (viewerElement.id.split('_')[0] === targetElement.id.split('_')[0] && targetElement.id.split('_')[1] !== 'commenttextbox') {
                                this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                                    drawTextMarkupAnnotations(this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                                        currentTextMarkupAddMode);
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
    };

    /**
     * @param {TouchEvent} event - The DragEvent.
     * @returns {void}
     */
    private onWindowTouchEnd = (event: TouchEvent): void => {
        this.signatureAdded = false;
        if (!this.pdfViewer.element.contains(event.target as HTMLElement) &&
         !this.contextMenuModule.contextMenuElement.contains(event.target as HTMLElement)) {
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                this.pdfViewer.textSelectionModule.clearTextSelection();
            }
        }
    };

    /**
     * @param {TouchEvent} event - The TouchEvent.
     * @returns {void}
     */
    private viewerContainerOnTouchStart = (event: TouchEvent): void => {
        const touchPoints: TouchList = event.touches;
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.setTouchPoints(touchPoints[0].clientX, touchPoints[0].clientY);
        }
        const target: HTMLElement = event.target as HTMLElement;

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
        this.diagramMouseDown(event);
        if (touchPoints.length === 1 && !((event.target as HTMLElement).classList.contains('e-pv-touch-select-drop') || (event.target as HTMLElement).classList.contains('e-pv-touch-ellipse'))) {
            if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.pageCount > 0 && !this.isThumb && !((event.target as HTMLElement).classList.contains('e-pv-hyperlink'))) {
                this.handleTaps(touchPoints, event);
            }
            if (!isBlazor() || !Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                this.handleTextBoxTaps(touchPoints);
            }
            const designerMode: boolean = this.isDesignerMode(target);
            if (designerMode) {
                this.contextMenuModule.close();
                // event.preventDefault();
                if (!this.isLongTouchPropagated) {
                    this.longTouchTimer = setTimeout(
                        () => {
                            if (!this.isMoving) {
                                this.isTouchDesignerMode = true;
                                this.contextMenuModule.open(this.touchClientY, this.touchClientX, this.viewerContainer);
                            }
                        }, 1000);
                }
                this.isLongTouchPropagated = true;
                this.isMoving = false;
            }
            else if ((this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled)) {
                this.pdfViewer.textSelectionModule.clearTextSelection();
                this.contextMenuModule.close();
                // event.preventDefault();
                if (!this.isLongTouchPropagated) {
                    this.longTouchTimer = setTimeout(
                        () => {
                            this.viewerContainerOnLongTouch(event);
                        }, 1000);
                }
                this.isLongTouchPropagated = true;
            }
            else {
                this.contextMenuModule.close();
            }
        }
        const toolbarModule: any = this.pdfViewer.toolbarModule ? this.pdfViewer.toolbarModule.annotationToolbarModule : 'null';
        if (target.classList.contains('e-pv-text') && (!toolbarModule || !toolbarModule.textMarkupToolbarElement || toolbarModule.textMarkupToolbarElement.children.length === 0)) {
            target.classList.add('e-pv-text-selection-none');
        }
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            target.classList.remove('e-enable-text-selection');
        }
        if (this.action === 'Perimeter' || this.action === 'Distance' || this.action === 'Line' || this.action === 'Polygon' || this.action === 'DrawTool' || this.action === 'Drag' || this.action.indexOf('Rotate') !== -1 || this.action.indexOf('Resize') !== -1) {
            event.preventDefault();
        }
    };

    private isDesignerMode(target: any): boolean {
        let isDesignerMode: boolean = false;
        if (this.pdfViewer.selectedItems.annotations.length !== 0 && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureText' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureImage')) {
            isDesignerMode = true;
        } else if (this.pdfViewer.selectedItems.annotations.length !== 0 && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType !== 'Path') {
            isDesignerMode = true;
        } else if (this.pdfViewer.selectedItems.formFields.length !== 0 &&
             this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType && this.pdfViewer.designerMode) {
            isDesignerMode = true;
        } else {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.isShapeCopied && ((target as HTMLElement).classList.contains('e-pv-text-layer') ||
                (target as HTMLElement).classList.contains('e-pv-text')) && !this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                isDesignerMode = true;
            } else if (this.pdfViewer.formDesigner && this.pdfViewer.formDesigner.isShapeCopied && ((target as HTMLElement).classList.contains('e-pv-text-layer') ||
                (target as HTMLElement).classList.contains('e-pv-text'))) {
                isDesignerMode = true;
            }
        }
        this.designerModetarget = target;
        return isDesignerMode;
    }

    private handleTaps(touchPoints: TouchList, event: TouchEvent): void {
        //EJ2CORE-813 - Implemented focus removing logic for iOS devices
        if (this.isDeviceiOS) {
            const obj: IElement = findActiveElement(event, this, this.pdfViewer);
            const isRemoveFocus: boolean = (!isNullOrUndefined(this.pdfViewer.annotation) && !isNullOrUndefined(this.pdfViewer.annotation.freeTextAnnotationModule) && !this.pdfViewer.annotation.freeTextAnnotationModule.isNewFreeTextAnnot) && (obj && this.pdfViewer.selectedItems.annotations[0] ? (obj as any).id !== this.pdfViewer.selectedItems.annotations[0].id : true) && document.activeElement.classList.contains('free-text-input') && this.isFreeTextAnnotation(this.pdfViewer.selectedItems.annotations);
            if (!this.singleTapTimer) {
                this.singleTapTimer = setTimeout(
                    () => {
                        if (isRemoveFocus && (!isNullOrUndefined(this.pdfViewer.selectedItems) &&
                         !isNullOrUndefined(this.pdfViewer.selectedItems.annotations[0]))) {
                            this.pdfViewer.clearSelection(this.pdfViewer.selectedItems.annotations[0].pageIndex);
                            this.focusViewerContainer(true);
                        }
                        this.onSingleTap(touchPoints);
                    }, 300);
                this.tapCount++;
            } else {
                if (this.pdfViewer.enablePinchZoom) {
                    this.tapCount++;
                    if (this.tapCount > 2) {
                        this.tapCount = 2;
                    }
                    clearTimeout(this.singleTapTimer);
                    this.singleTapTimer = null;
                    this.onDoubleTap(touchPoints);
                }
            }
        }
        else {
            if (!this.singleTapTimer) {
                this.singleTapTimer = setTimeout(
                    () => {
                        this.onSingleTap(touchPoints);
                    }, 300);
                this.tapCount++;
            } else {
                if (this.pdfViewer.enablePinchZoom) {
                    this.tapCount++;
                    if (this.tapCount > 2) {
                        this.tapCount = 2;
                    }
                    clearTimeout(this.singleTapTimer);
                    this.singleTapTimer = null;
                    this.onDoubleTap(touchPoints);
                }
            }
        }
    }

    private handleTextBoxTaps(touchPoints: TouchList): void {
        setTimeout(
            () => {
                this.inputTapCount = 0;
            }, 300);
        this.inputTapCount++;
        //EJ2CORE-813 - Removing timer function for iOS Devices
        if (this.isDeviceiOS) {

            this.onTextBoxDoubleTap(touchPoints);
        }
        else {
            const timer: any = setTimeout(
                () => {
                    this.onTextBoxDoubleTap(touchPoints);
                }, 200);
        }
        if (this.inputTapCount > 2) {
            this.inputTapCount = 0;
        }
    }

    private onTextBoxDoubleTap(touches: TouchList): void {
        const target: HTMLElement = touches[0].target as HTMLElement;
        if (this.inputTapCount === 2) {
            if (this.pdfViewer.selectedItems.annotations.length !== 0) {
                if (this.pdfViewer.annotationModule) {
                    const currentAnnotation: any = this.pdfViewer.selectedItems.annotations[0];
                    //EJ2CORE-813 - Removing focus from all active free text elements before focusing on free text annotation on iOS devices
                    if (this.isDeviceiOS && document.activeElement.classList.contains('free-text-input') && (this.isFreeTextAnnotation(this.pdfViewer.selectedItems.annotations))) {
                        this.focusViewerContainer(true);
                    }
                    this.pdfViewer.annotationModule.annotationSelect(currentAnnotation.annotName, currentAnnotation.pageIndex,
                                                                     currentAnnotation, null, true);
                }
                if (this.isFreeTextAnnotation(this.pdfViewer.selectedItems.annotations) &&
                 !(this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus)) {
                    const elmtPosition: PointModel = {};
                    elmtPosition.x = this.pdfViewer.selectedItems.annotations[0].bounds.x;
                    elmtPosition.y = this.pdfViewer.selectedItems.annotations[0].bounds.y;
                    let targetAnnotation: any;
                    if (this.pdfViewer.selectedItems.annotations[0].id === 'diagram_helper') {
                        targetAnnotation = (this.pdfViewer.nameTable as any)[(this.eventArgs.source as any).id];
                    } else {
                        targetAnnotation = this.pdfViewer.selectedItems.annotations[0];
                    }
                    this.pdfViewer.annotation.freeTextAnnotationModule.addInuptElemet(elmtPosition, targetAnnotation);
                } else if (this.pdfViewer.selectedItems.annotations[0] &&
                     this.pdfViewer.selectedItems.annotations[0].enableShapeLabel &&
                      !(this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus)) {
                    const elmtPosition: PointModel = {};
                    elmtPosition.x = this.pdfViewer.selectedItems.annotations[0].bounds.x;
                    elmtPosition.y = this.pdfViewer.selectedItems.annotations[0].bounds.y;
                    this.pdfViewer.annotation.inputElementModule.editLabel(elmtPosition, this.pdfViewer.selectedItems.annotations[0]);
                }
            }
        }
    }

    private onSingleTap(touches: TouchList): void {
        const target: HTMLElement = touches[0].target as HTMLElement;
        let isFormfields: boolean = false;
        this.singleTapTimer = null;
        if (target && (target.classList.contains('e-pdfviewer-formFields')
            || target.classList.contains('e-pdfviewer-ListBox') || target.classList.contains('e-pdfviewer-signatureformfields'))) {
            isFormfields = true;
        }
        if (!this.isLongTouchPropagated && !this.navigationPane.isNavigationToolbarVisible && !isFormfields) {
            if (this.pdfViewer.toolbarModule) {
                if ((this.touchClientX >= touches[0].clientX - 10) && (this.touchClientX <= touches[0].clientX + 10) &&
                    (this.touchClientY >= touches[0].clientY - 10) && (this.touchClientY <= touches[0].clientY + 10)) {
                    if (!this.isTapHidden) {
                        if (isBlazor()) {
                            this.viewerContainer.scrollTop -= this.pdfViewer.element.querySelector('.e-pv-mobile-toolbar').clientHeight * this.getZoomFactor();
                        }
                        if (this.pdfViewer.toolbar.moreDropDown) {
                            const dropDown: HTMLElement = this.getElement('_more_option-popup');
                            if (dropDown.firstElementChild) {
                                dropDown.classList.remove('e-popup-open');
                                dropDown.classList.add('e-popup-close');
                                dropDown.removeChild(dropDown.firstElementChild);
                            }
                        }
                    } else {
                        if (isBlazor()) {

                            this.viewerContainer.scrollTop += this.pdfViewer.element.querySelector('.e-pv-mobile-toolbar').clientHeight * this.getZoomFactor();
                        }
                    }
                    if (this.isTapHidden && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
                        this.mobileScrollerContainer.style.display = '';
                        this.updateMobileScrollerPosition();

                    } else if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.getSelectTextMarkupCurrentPage() == null) {
                        this.mobileScrollerContainer.style.display = 'none';
                    }
                    if (this.getSelectTextMarkupCurrentPage() == null) {
                        if (!isBlazor()) {
                            if (this.pdfViewer.enableToolbar) {
                                this.pdfViewer.toolbarModule.showToolbar(true);
                            }
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
        const target: HTMLElement = touches[0].target as HTMLElement;
        let isFormfields: boolean = false;
        if (target && (target.classList.contains('e-pdfviewer-formFields')
            || target.classList.contains('e-pdfviewer-ListBox') || target.classList.contains('e-pdfviewer-signatureformfields'))) {
            isFormfields = true;
        }
        if (this.tapCount === 2 && !isFormfields) {
            this.tapCount = 0;
            /**
             * Sometimes the values gets differ by some decimal points. So converted the decimal points values to Integer values.
             */
            if ((this.touchClientX >= parseInt((touches[0].clientX - 10).toString(), 10)) &&
            (this.touchClientX <= touches[0].clientX + 10) &&
                (this.touchClientY >= touches[0].clientY - 10) && (this.touchClientY <= touches[0].clientY + 30)) {
                if (this.pdfViewer.magnification && this.pdfViewer.selectedItems.annotations.length !== 1) {
                    this.pdfViewer.magnification.onDoubleTapMagnification();
                }
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height,
                                                                          this.toolbarHeight);
                this.isTapHidden = false;
                clearTimeout(this.singleTapTimer);
                this.singleTapTimer = null;
            }
        }
    }

    /**
     * @param {TouchEvent} event - The TouchEvent.
     * @returns {void}
     */
    private viewerContainerOnLongTouch = (event: TouchEvent): void => {
        this.touchClientX = event.touches[0].clientX;
        this.touchClientY = event.touches[0].clientY;
        event.preventDefault();
        if (this.pdfViewer.textSelectionModule) {
            const target: HTMLElement = event.target as HTMLElement;
            if (target.classList.contains('e-pv-text-selection-none') && target.classList.contains('e-pv-text')) {
                target.classList.remove('e-pv-text-selection-none');
                if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                    target.classList.add('e-enable-text-selection');
                }
            }
            this.pdfViewer.textSelectionModule.initiateTouchSelection(event, this.touchClientX, this.touchClientY);
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                clearTimeout(this.singleTapTimer);
                this.tapCount = 0;
            }
        }
    };

    /**
     * @param {PointerEvent} event - The PointerEvent.
     * @returns {void}
     */
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
    };

    private preventTouchEvent(event: TouchEvent): void {
        if (this.pdfViewer.textSelectionModule) {

            if (!this.isPanMode && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled &&
                 this.getSelectTextMarkupCurrentPage() == null) {
                if (!(this.isWebkitMobile && (Browser.isDevice && !this.pdfViewer.enableDesktopMode))) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
    }

    /**
     * @param {TouchEvent} event - The TouchEvent.
     * @returns {void}
     */
    private viewerContainerOnTouchMove = (event: TouchEvent): void => {
        if (this.action === 'Drag') {
            this.isMoving = true;
        }
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            clearTimeout(this.singleTapTimer);
            this.singleTapTimer = null;
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

                    this.pdfViewer.magnificationModule.initiatePinchMove(touchPoints[0].clientX, touchPoints[0].clientY,
                                                                         touchPoints[1].clientX, touchPoints[1].clientY);
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
        if (event.target && ((event.target as PdfAnnotationBaseModel).id.indexOf('_text') > -1 || (event.target as PdfAnnotationBaseModel).id.indexOf('_annotationCanvas') > -1 || (event.target as HTMLElement).classList.contains('e-pv-hyperlink')) && this.pdfViewer.annotation) {
            const pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(event);
            const diagram: HTMLElement = this.getAnnotationCanvas('_annotationCanvas_', pageIndex);
            if (diagram) {
                const canvas1: Rect = diagram.getBoundingClientRect() as any;
                const left: number = canvas1.x ? canvas1.x : canvas1.left;
                const top: number = canvas1.y ? canvas1.y : canvas1.top;
                canvas = new Rect(left + 10, top + 10, canvas1.width - 10, canvas1.height - 10);
            }
        }
        if (canvas && canvas.containsPoint({ x: this.mouseX, y: this.mouseY }) || this.action === 'Ink') {
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
    };

    /**
     * @param {PointerEvent} event - The TouchEvent.
     * @returns {void}
     */
    private viewerContainerOnPointerMove = (event: PointerEvent): void => {
        if (event.pointerType === 'touch' && this.pageCount > 0) {
            event.preventDefault();
            if (this.pointersForTouch.length === 2) {
                for (let i: number = 0; i < this.pointersForTouch.length; i++) {
                    if (event.pointerId === this.pointersForTouch[parseInt(i.toString(), 10)].pointerId) {
                        this.pointersForTouch[parseInt(i.toString(), 10)] = event;
                        break;
                    }
                }
                if (this.pdfViewer.magnificationModule && this.pdfViewer.enablePinchZoom) {

                    this.pdfViewer.magnificationModule.initiatePinchMove(this.pointersForTouch[0].clientX,
                                                                         this.pointersForTouch[0].clientY,
                                                                         this.pointersForTouch[1].clientX,
                                                                         this.pointersForTouch[1].clientY);
                }
            }
        }
    };

    /**
     * @param {TouchEvent} event - The TouchEvent.
     * @returns {void}
     */
    private viewerContainerOnTouchEnd = (event: TouchEvent): void => {
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.pinchMoveEnd();
        }
        if (event.cancelable && !(event.target as HTMLElement).classList.contains('e-pv-touch-ellipse') && this.pdfViewer.textSelectionModule && this.pdfViewer.textSelectionModule.isTextSelection) {
            event.preventDefault();
        }
        this.isLongTouchPropagated = false;
        clearInterval(this.longTouchTimer);
        this.longTouchTimer = null;
        if ((Browser.isDevice && !this.isDeviceiOS && !this.pdfViewer.enableDesktopMode) && this.isTouchScrolled) {
            this.currentTime = new Date().getTime();
            const duration: number = this.currentTime - this.previousTime;
            const difference: number = this.scrollY - event.changedTouches[0].pageY;
            const speed: number = (difference) / (duration);
            if (Math.abs(speed) > 1.5) {
                const scrollTop: number = (difference) + ((duration) * speed);
                if (scrollTop > 0) {
                    this.viewerContainer.scrollTop += scrollTop;
                    this.updateMobileScrollerPosition();
                }
            }
        }
        this.diagramMouseUp(event);
        if (this.pdfViewer.selectedItems.annotations.length !== 0) {
            this.disableTextSelectionMode();
        }
        else {
            if (this.pdfViewer.textSelectionModule) {
                this.pdfViewer.textSelectionModule.enableTextSelectionMode();
            }
        }
        this.renderStampAnnotation(event);
        if (!Browser.isDevice) {
            this.isgetFocused = true;
            this.focusViewerContainer();
        }
    };

    private renderStampAnnotation(event: TouchEvent): void {
        if (this.pdfViewer.annotation) {
            const zoomFactor: number = this.getZoomFactor();
            const pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(event);
            const pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
            if (this.pdfViewer.enableStampAnnotations) {
                const stampModule: StampAnnotation = this.pdfViewer.annotationModule.stampAnnotationModule;
                if (stampModule && stampModule.isStampAnnotSelected) {
                    if (pageDiv) {
                        const pageCurrentRect: ClientRect = pageDiv.getBoundingClientRect();
                        if (event.type === 'touchend' && this.pdfViewer.annotationModule.stampAnnotationModule.currentStampAnnotation.shapeAnnotationType === 'Image') {
                            const currentStampObj: any = this.pdfViewer.annotationModule.stampAnnotationModule.currentStampAnnotation;
                            currentStampObj.pageIndex = pageIndex;
                            currentStampObj.bounds.x = (event.changedTouches[0].clientX - pageCurrentRect.left) / zoomFactor;
                            currentStampObj.bounds.y = (event.changedTouches[0].clientY - pageCurrentRect.top) / zoomFactor;
                            stampModule.updateDeleteItems(pageIndex, currentStampObj, currentStampObj.opacity);
                            this.pdfViewer.add(currentStampObj);
                            const canvas: any = this.getAnnotationCanvas('_annotationCanvas_', pageIndex);
                            this.pdfViewer.renderDrawing(canvas, pageIndex);
                        } else {

                            stampModule.renderStamp((event.changedTouches[0].clientX - pageCurrentRect.left) / zoomFactor,
                                                    (event.changedTouches[0].clientY - pageCurrentRect.top) / zoomFactor, null, null,
                                                    pageIndex, null, null, null, null);
                        }
                        stampModule.isStampAnnotSelected = false;
                    }
                }
                this.pdfViewer.annotation.onAnnotationMouseDown();
            }
            if (this.pdfViewer.enableHandwrittenSignature && this.isSignatureAdded && pageDiv) {
                const pageCurrentRect: ClientRect = pageDiv.getBoundingClientRect();
                this.currentSignatureAnnot.pageIndex = pageIndex;

                this.signatureModule.renderSignature((event.changedTouches[0].clientX - pageCurrentRect.left) / zoomFactor,
                                                     (event.changedTouches[0].clientY - pageCurrentRect.top) / zoomFactor);
                this.isSignatureAdded = false;
            }
            if (event.touches.length === 1 && this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationTouchEnd(event);
            }
        }
    }

    /**
     * @param {PointerEvent} event - The PointerEvent.
     * @returns {void}
     */
    private viewerContainerOnPointerEnd = (event: PointerEvent): void => {
        if (event.pointerType === 'touch') {
            event.preventDefault();
            if (this.pdfViewer.magnificationModule) {
                this.pdfViewer.magnificationModule.pinchMoveEnd();
            }
            this.pointersForTouch = [];
            this.pointerCount = 0;
        }
    };

    private focusOnViewerContainer(): boolean{
        const activeElement: Element = document.activeElement;
        const viewerContainer: HTMLElement = document.querySelector('.e-pv-viewer-container');
        return viewerContainer.contains(activeElement);
    }

    private initPageDiv(pageValues: { pageCount: any, pageSizes: any, pageRotation: any }): void {
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
            const pageLimit: number = this.getPageLimit();
            const startIndex: number = 0;
            this.pageSizeCollection(pageValues, startIndex, pageLimit);
            if (this.pageCount <= 100) {
                const limit: number = this.renderPageContainerLimit(pageLimit);
                for (let i: number = 0; i < limit; i++) {
                    this.renderPageContainer(i, this.getPageWidth(i), this.getPageHeight(i), this.getPageTop(i));
                }
                const pageIndex: number = 0;
                this.loadPage(pageIndex);
            }
            this.pageContainer.style.height = this.getPageTop(this.pageSize.length - 1) +
                this.getPageHeight(this.pageSize.length - 1) + 'px';
            this.pageContainer.style.position = 'relative';
            if (this.pageLimit === 100) {
                const pageDiv: HTMLElement = this.getElement('_pageDiv_' + this.pageLimit);
                if (pageDiv === null && this.pageLimit < this.pageCount) {
                    Promise.all([this.renderPagesVirtually()]);
                }
            }
        }
    }

    private renderPageContainerLimit(pageLimit: number): any {
        let limit: number;
        if (this.pageCount > 0) {
            this.isMixedSizeDocument = false;
            let isPortrait: boolean = false;
            let isLandscape: boolean = false;
            let differentPageSize: boolean = false;
            for (let i: number = 0; i < this.pageCount; i++) {
                if (this.pageSize[parseInt(i.toString(), 10)].height > this.pageSize[parseInt(i.toString(), 10)].width) {
                    isPortrait = true;
                }
                if (this.pageSize[parseInt(i.toString(), 10)].width > this.pageSize[parseInt(i.toString(), 10)].height) {
                    isLandscape = true;
                }
                if (i > 0 && this.pageSize[parseInt(i.toString(), 10)].width !== this.pageSize[i - 1].width) {
                    differentPageSize = true;
                }
                const pageWidth: number = this.pageSize[parseInt(i.toString(), 10)].width;
                if (pageWidth > this.highestWidth) {
                    this.highestWidth = pageWidth;
                }
                const pageHeight: number = this.pageSize[parseInt(i.toString(), 10)].height;
                if (pageHeight > this.highestHeight) {
                    this.highestHeight = pageHeight;
                }
            }
            if ((isPortrait && isLandscape) || differentPageSize) {
                this.isMixedSizeDocument = true;
            }
            if (this.pdfViewer.initialRenderPages > 10) {
                if (this.pdfViewer.initialRenderPages > 100) {
                    limit = pageLimit;
                } else {
                    limit = this.pdfViewer.initialRenderPages <= this.pageCount ? this.pdfViewer.initialRenderPages : this.pageCount;
                }
            } else {
                limit = this.pageCount < 10 ? this.pageCount : 10;
            }
        }
        return limit;
    }

    private pageSizeCollection(pageValues: { pageCount: any, pageSizes: any, pageRotation: any }, startIndex: number, pageLimit: number):
    void {
        let topValue: number = 0;
        for (let i: number = startIndex; i < pageLimit; i++) {
            if (typeof pageValues.pageSizes[parseInt(i.toString(), 10)] !== 'object') {
                const pageSize: string[] = pageValues.pageSizes[parseInt(i.toString(), 10)].split(',');
                if (pageValues.pageSizes[i - 1] !== null && i !== 0) {
                    const previousPageHeight: string = pageValues.pageSizes[i - 1].split(',');
                    topValue = this.pageGap + parseFloat(previousPageHeight[1]) + topValue;
                } else {
                    topValue = this.pageGap;
                }
                const size: ISize = {
                    width: parseFloat(pageSize[0]), height: parseFloat(pageSize[1]),
                    top: topValue, rotation: !isNullOrUndefined(pageValues.pageRotation) &&
                        ((!isNullOrUndefined(pageValues.pageRotation.length) && pageValues.pageRotation.length > 0) ||
                            (!isNullOrUndefined(Object.keys(pageValues.pageRotation).length) &&
                                Object.keys(pageValues.pageRotation).length > 0)) ? pageValues.pageRotation[parseInt(i.toString(), 10)] : 0
                };
                this.pageSize.push(size);
            } else {
                if (pageValues.pageSizes[i - 1] !== null && i !== 0) {
                    const previousPageHeight: any = pageValues.pageSizes[i - 1];
                    topValue = this.pageGap + (parseFloat(previousPageHeight.height) ?
                        parseFloat(previousPageHeight.height) : parseFloat(previousPageHeight.Height)) + topValue;
                } else {
                    topValue = this.pageGap;
                }
                const size: ISize = {
                    width: (pageValues.pageSizes[parseInt(i.toString(), 10)].width ?
                        pageValues.pageSizes[parseInt(i.toString(), 10)].width :
                        pageValues.pageSizes[parseInt(i.toString(), 10)].Width),
                    height: (pageValues.pageSizes[parseInt(i.toString(), 10)].height ?
                        pageValues.pageSizes[parseInt(i.toString(), 10)].height :
                        pageValues.pageSizes[parseInt(i.toString(), 10)].Height),
                    top: topValue, rotation: !isNullOrUndefined(pageValues.pageRotation) &&
                        ((!isNullOrUndefined(pageValues.pageRotation.length) && pageValues.pageRotation.length > 0) ||
                            (!isNullOrUndefined(Object.keys(pageValues.pageRotation).length) &&
                                Object.keys(pageValues.pageRotation).length > 0)) ?
                        pageValues.pageRotation[parseInt(i.toString(), 10)] : 0
                };
                this.pageSize.push(size);
            }
        }
    }

    private getPageLimit(): number {
        let pageLimit: number = 0;
        if (this.pageCount > 100) {
            // to render 100 pages intially.
            pageLimit = 100;
            this.pageLimit = pageLimit;
        } else {
            pageLimit = this.pageCount;
        }
        return pageLimit;
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
                const pageDiv: HTMLElement = this.getElement('_pageDiv_' + j);
                const pageCanvas: HTMLElement = this.getElement('_pageCanvas_' + j);
                const textLayer: HTMLElement = this.getElement('_textLayer_' + j);
                const initialLoadedPages: number = this.pdfViewer.initialRenderPages > this.pageRenderCount ?
                    (this.pdfViewer.initialRenderPages <= this.pageCount) ? (this.pdfViewer.initialRenderPages - 1) : this.pageCount : -1;
                if (pageCanvas && j > initialLoadedPages) {
                    pageCanvas.onload = null;
                    pageCanvas.onerror = null;
                    pageCanvas.parentNode.removeChild(pageCanvas);
                    if (textLayer) {
                        if (this.pdfViewer.textSelectionModule && textLayer.childNodes.length !== 0 && !this.isTextSelectionDisabled) {
                            this.pdfViewer.textSelectionModule.maintainSelectionOnScroll(j, true);
                        }
                        textLayer.parentNode.removeChild(textLayer);
                    }
                    const indexInArray: number = this.renderedPagesList.indexOf(j);
                    if (indexInArray !== -1) {
                        this.renderedPagesList.splice(indexInArray, 1);
                    }
                }
                if (pageDiv && j > initialLoadedPages) {
                    pageDiv.parentNode.removeChild(pageDiv);
                    const indexInArray: number = this.renderedPagesList.indexOf(j);
                    if (indexInArray !== -1) {
                        this.renderedPagesList.splice(indexInArray, 1);
                    }
                }
            }
        }
        if (isBlazor()) { this.pdfViewer._dotnetInstance.invokeMethodAsync('UpdateCurrentPageNumber', this.currentPageNumber); }
    }

    private renderPageElement(i: number): void {
        const pageDiv: HTMLElement = this.getElement('_pageDiv_' + i);
        const canvas: HTMLCanvasElement = this.getElement('_pageCanvas_' + i) as HTMLCanvasElement;
        if (canvas == null && pageDiv == null && i < this.pageSize.length) {

            this.renderPageContainer(i, this.getPageWidth(i), this.getPageHeight(i), this.getPageTop(i));
        }
    }

    private async renderPagesVirtually(): Promise<void> {
        // eslint-disable-next-line
        const proxy: any = this;
        this.initiateRenderPagesVirtually(proxy);
    }

    private initiateRenderPagesVirtually(proxy: any): void {
        const jsonObject: object = { hashId: proxy.hashId, isClientsideLoading: this.clientSideRendering, isCompletePageSizeNotReceived: true, action: 'VirtualLoad', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.documentId, password: proxy.passwordData };
        if (proxy.jsonDocumentId) {
            (jsonObject as any).documentId = proxy.jsonDocumentId;
        }
        this.virtualLoadRequestHandler = new AjaxHandler(this.pdfViewer);
        this.virtualLoadRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.load;
        this.virtualLoadRequestHandler.responseType = 'json';
        this.virtualLoadRequestHandler.mode = true;
        if (this.clientSideRendering) {
            const data: string = this.pdfViewer.pdfRendererModule.load(null, this.documentId, null, jsonObject);
            this.viritualload(JSON.parse(data), this);
        } else {
            this.virtualLoadRequestHandler.send(jsonObject);
        }
        this.virtualLoadRequestHandler.onSuccess = function (result: any): void {
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
                proxy.viritualload(data, proxy);
            }
        };
        this.virtualLoadRequestHandler.onFailure = function (result: any): void {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
        };
        this.virtualLoadRequestHandler.onError = function (result: any): void {
            proxy.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
        };
    }

    private viritualload(data: any, proxy: any): void {
        if (proxy.documentId === data.uniqueId) {
            proxy.pdfViewer.fireAjaxRequestSuccess('VirtualLoad', data);
            const pageValues: { pageCount: any; pageSizes: any; pageRotation: any; } = data;
            if (proxy.pageSize[proxy.pageLimit - 1]) {
                let topValue: number = proxy.pageSize[proxy.pageLimit - 1].top;
                for (let i: number = proxy.pageLimit; i < proxy.pageCount; i++) {
                    if (typeof (pageValues.pageSizes[parseInt(i.toString(), 10)]) !== 'object') {
                        const pageSize: string[] = pageValues.pageSizes[parseInt(i.toString(), 10)].split(',');
                        if (proxy.pageSize[i - 1] !== null && i !== 0) {
                            const previousPageHeight: string = proxy.pageSize[i - 1].height;
                            topValue = proxy.pageGap + parseFloat(previousPageHeight) + topValue;
                        }
                        const size: ISize = { width: parseFloat(pageSize[0]), height: parseFloat(pageSize[1]),
                            top: topValue, rotation: !isNullOrUndefined(pageValues.pageRotation) &&
                              ((!isNullOrUndefined(pageValues.pageRotation.length) && pageValues.pageRotation.length > 0) ||
                               (!isNullOrUndefined(Object.keys(pageValues.pageRotation).length) &&
                                Object.keys(pageValues.pageRotation).length > 0)) ?
                                pageValues.pageRotation[parseInt(i.toString(), 10)] : 0 };
                        proxy.pageSize.push(size);
                    } else {
                        if (proxy.pageSize[i - 1] !== null && i !== 0) {
                            const previousPageHeight: string = proxy.pageSize[i - 1].height;
                            topValue = proxy.pageGap + parseFloat(previousPageHeight) + topValue;
                        }
                        const size: ISize = { width: (parseFloat(pageValues.pageSizes[parseInt(i.toString(), 10)].width) ?
                            parseFloat(pageValues.pageSizes[parseInt(i.toString(), 10)].width) :
                            parseFloat(pageValues.pageSizes[parseInt(i.toString(), 10)].Width)),
                        height: (parseFloat(pageValues.pageSizes[parseInt(i.toString(), 10)].height) ?
                            parseFloat(pageValues.pageSizes[parseInt(i.toString(), 10)].height) :
                            parseFloat(pageValues.pageSizes[parseInt(i.toString(), 10)].Height)),
                        top: topValue, rotation: !isNullOrUndefined(pageValues.pageRotation) &&
                                   ((!isNullOrUndefined(pageValues.pageRotation.length) && pageValues.pageRotation.length > 0) ||
                                    (!isNullOrUndefined(Object.keys(pageValues.pageRotation).length) &&
                                     Object.keys(pageValues.pageRotation).length > 0)) ?
                            pageValues.pageRotation[parseInt(i.toString(), 10)] : 0 };
                        proxy.pageSize.push(size);
                    }
                }
                const pageLimit: number = proxy.getPageLimit();
                if (proxy.pageCount > 100) {
                    const limit: number = proxy.renderPageContainerLimit(pageLimit);
                    for (let i: number = 0; i < limit; i++) {
                        proxy.renderPageContainer(i, proxy.getPageWidth(i), proxy.getPageHeight(i), proxy.getPageTop(i));
                    }
                    const pageIndex: number = 0;
                    proxy.loadPage(pageIndex);
                    proxy.saveFormfieldsData(data);
                }
                proxy.pageContainer.style.height = proxy.getPageTop(proxy.pageSize.length - 1) + proxy.getPageHeight(proxy.pageSize.length - 1) + 'px';
                const pageData: string = PdfViewerBase.sessionStorageManager.getItem(proxy.documentId + '_pagedata');
                if (proxy.pageCount > 100) {
                    if (this.pdfViewer.initialRenderPages > 100) {
                        const limit: any = this.pdfViewer.initialRenderPages <= proxy.pageCount ?
                            this.pdfViewer.initialRenderPages : proxy.pageCount;
                        for (let i: number = 100; i < limit; i++) {
                            proxy.renderPageContainer(i, proxy.getPageWidth(i), proxy.getPageHeight(i), proxy.getPageTop(i));
                            proxy.createRequestForRender(i);
                        }
                    }
                    proxy.pdfViewer.fireDocumentLoad(pageData);
                    const linkAnnotationModule: any = proxy.pdfViewer.linkAnnotationModule;
                    if (linkAnnotationModule && linkAnnotationModule.linkAnnotation &&
                        linkAnnotationModule.linkAnnotation.length > 0 && linkAnnotationModule.linkPage.length > 0) {
                        linkAnnotationModule.renderDocumentLink(linkAnnotationModule.linkAnnotation, linkAnnotationModule.linkPage,
                                                                linkAnnotationModule.annotationY, proxy.currentPageNumber - 1);
                    }
                }
            }
        }
    }

    private tileRenderPage(data: any, pageIndex: number): void {
        let proxy: PdfViewerBase = null;
        // eslint-disable-next-line
        proxy = this;
        if (data && this.pageSize[parseInt(pageIndex.toString(), 10)]) {
            const pageWidth: number = this.getPageWidth(pageIndex);
            const pageHeight: number = this.getPageHeight(pageIndex);
            const canvas: HTMLImageElement = this.getElement('_pageCanvas_' + pageIndex) as HTMLImageElement;
            const pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
            const tileX: number = data.tileX ? data.tileX : 0;
            const tileY: number = data.tileY ? data.tileY : 0;
            if (pageDiv) {
                pageDiv.style.width = pageWidth + 'px';
                pageDiv.style.height = pageHeight + 'px';
                pageDiv.style.background = '#fff';
                pageDiv.style.top = this.getPageTop(pageIndex) + 'px';
                if (this.pdfViewer.enableRtl) {
                    pageDiv.style.right = this.updateLeftPosition(pageIndex) + 'px';
                } else {
                    pageDiv.style.left = this.updateLeftPosition(pageIndex) + 'px';
                }
            }
            if (canvas) {
                canvas.style.background = '#fff';
            }
            const imageData: string = data['image'];
            let zoomFactor: number = this.retrieveCurrentZoomFactor();
            const oldCanvases: NodeListOf<Element> = document.querySelectorAll('img[id*="' + proxy.pdfViewer.element.id + '_tileimg_' + pageIndex + '_"]');
            if (oldCanvases.length === 0) {
                this.isReRenderRequired = true;
            }
            if (this.isReRenderRequired) {
                if (data.zoomFactor) {
                    zoomFactor = data.zoomFactor;
                }
                const currentString: string = this.documentId + '_' + pageIndex + '_' + zoomFactor + '_' + data.tileX + '_' + data.tileY;
                this.tilerequestLists.push(currentString);
                const matrix: any = data['transformationMatrix'];
                const width: any = data['width'];
                if (imageData) {
                    const tileX: number = data.tileX ? data.tileX : 0;
                    const tileY: number = data.tileY ? data.tileY : 0;
                    const scaleFactor: number = (!isNullOrUndefined(data.scaleFactor)) ? data.scaleFactor : 1.5;
                    let image: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_tileimg_' + pageIndex + '_' + this.getZoomFactor() + '_' + tileX + '_' + tileY);
                    if (!image) {
                        image = new Image();
                        image.id = this.pdfViewer.element.id + '_tileimg_' + pageIndex + '_' + this.getZoomFactor() + '_' + tileX + '_' + tileY;
                        image.style.userSelect = 'none';
                        if (pageDiv) {
                            pageDiv.append(image);
                        }
                    }
                    if (pageDiv){
                        (image as HTMLImageElement).src = imageData;
                        image.setAttribute('alt', '');
                        image.onload = (): void => {
                            proxy.showPageLoadingIndicator(pageIndex, false);
                            proxy.tileRenderCount = proxy.tileRenderCount + 1;
                            if ((tileX === 0) && (tileY === 0)) {
                                if (pageIndex === 0 && this.isDocumentLoaded) {
                                    proxy.renderPDFInformations();
                                    proxy.isInitialLoaded = true;
                                    const pageData: any = PdfViewerBase.sessionStorageManager.getItem(proxy.documentId + '_pagedata');
                                    if (proxy.pageCount <= 100) {
                                        proxy.pdfViewer.fireDocumentLoad(pageData);
                                    }
                                    proxy.isDocumentLoaded = false;
                                    if (proxy.pdfViewer.textSearch && ((proxy.clientSideRendering && !proxy.pdfViewer.thumbnailViewModule
                                        && !proxy.pdfViewer.pageOrganizer) || !proxy.clientSideRendering)) {
                                        proxy.pdfViewer.textSearchModule.getPDFDocumentTexts();
                                    }
                                }
                            }
                            if (proxy.tileRenderCount === proxy.tileRequestCount && data.uniqueId === proxy.documentId) {
                                if (proxy.isTextMarkupAnnotationModule()) {
                                    proxy.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotations(pageIndex);
                                }
                                if (canvas) {
                                    canvas.style.display = 'none';
                                    canvas.src = '#';
                                }
                                const oldPageDiv: NodeListOf<Element> = document.querySelectorAll('img[id*="' + proxy.pdfViewer.element.id + '_oldCanvas"]');
                                for (let i: number = 0; i < oldPageDiv.length; i++) {
                                    (oldPageDiv[parseInt(i.toString(), 10)] as HTMLImageElement).onload = null;
                                    (oldPageDiv[parseInt(i.toString(), 10)] as HTMLImageElement).onerror = null;
                                    pageDiv.removeChild(oldPageDiv[parseInt(i.toString(), 10)]);
                                }
                                proxy.isTileImageRendered = false;
                                proxy.tileRenderCount = 0;
                                if (proxy.pdfViewer.magnificationModule) {
                                    proxy.pdfViewer.magnificationModule.rerenderCountIncrement();
                                }
                                proxy.isDrawnCompletely = true;
                                proxy.pdfViewer.firePageRenderComplete(data);
                            }
                            image.setAttribute('alt', 'Page ' + (pageIndex + 1));
                        };
                        const currentImageWidth: number = (((width * this.getZoomFactor()) / zoomFactor) / scaleFactor);
                        const matrixElements: any = matrix ? (matrix.Elements ? matrix.Elements : matrix.Values) : [1, 0, 0, 1, 1, 1];
                        const currentImageTop: number = (((matrixElements[5] * this.getZoomFactor()) / zoomFactor) / scaleFactor);
                        const currentImageLeft: number = (((matrixElements[4] * this.getZoomFactor()) / zoomFactor) / scaleFactor);
                        (image as HTMLImageElement).width = currentImageWidth;
                        (image as HTMLImageElement).style.width = currentImageWidth + 'px';
                        image.style.top = currentImageTop + 'px';
                        image.style.left = currentImageLeft + 'px';
                        image.style.position = 'absolute';
                    }
                }
                if ((tileX === 0) && (tileY === 0)) {
                    this.onPageRender(data, pageIndex, pageDiv);
                }
            } else {
                for (let l: number = 0; l < oldCanvases.length; l++) {
                    const tileImgId: string[] = oldCanvases[parseInt(l.toString(), 10)].id.split('_');
                    let zoomFactor: number = proxy.retrieveCurrentZoomFactor();
                    let tileData: any;
                    if (this.clientSideRendering) {
                        tileData = JSON.parse(proxy.getStoredTileImageDetails(pageIndex, parseFloat(tileImgId[tileImgId.length - 2]),
                                                                              parseFloat(tileImgId[tileImgId.length - 1]), zoomFactor));
                    } else {
                        tileData = JSON.parse(proxy.getWindowSessionStorageTile(pageIndex, parseFloat(tileImgId[tileImgId.length - 2]),
                                                                                parseFloat(tileImgId[tileImgId.length - 1]), zoomFactor));
                    } if (tileData && tileData.zoomFactor) {
                        zoomFactor = tileData.zoomFactor;
                    }
                    if (parseFloat(tileImgId[tileImgId.length - 4]) === pageIndex) {
                        const node: Node = oldCanvases[parseInt(l.toString(), 10)];
                        // Make sure it's really an Element
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            (node as HTMLImageElement).onload = (): void => {
                                proxy.showPageLoadingIndicator(pageIndex, false);
                                proxy.tileRenderCount = proxy.tileRenderCount + 1;
                                if ((tileX === 0) && (tileY === 0)) {
                                    if (pageIndex === 0 && this.isDocumentLoaded) {
                                        this.renderPDFInformations();
                                        this.isInitialLoaded = true;
                                        const pageData: string = PdfViewerBase.sessionStorageManager.getItem(proxy.documentId + '_pagedata');
                                        if (proxy.pageCount <= 100) {
                                            proxy.pdfViewer.fireDocumentLoad(pageData);
                                        }
                                        proxy.isDocumentLoaded = false;
                                        if (proxy.pdfViewer.textSearch && ((proxy.clientSideRendering &&
                                            !proxy.pdfViewer.thumbnailViewModule && !proxy.pdfViewer.pageOrganizer) ||
                                            !proxy.clientSideRendering)) {
                                            proxy.pdfViewer.textSearchModule.getPDFDocumentTexts();
                                        }
                                    }
                                }
                                if (proxy.tileRenderCount === proxy.tileRequestCount && data.uniqueId === proxy.documentId) {
                                    canvas.style.display = 'none';
                                    canvas.src = '#';
                                    if (proxy.isTextMarkupAnnotationModule()) {
                                        proxy.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotations(pageIndex);
                                    }
                                    const oldPageDiv: NodeListOf<Element> = document.querySelectorAll('img[id*="' + proxy.pdfViewer.element.id + '_oldCanvas"]');
                                    for (let i: number = 0; i < oldPageDiv.length; i++) {
                                        (oldPageDiv[parseInt(i.toString(), 10)] as HTMLImageElement).onload = null;
                                        (oldPageDiv[parseInt(i.toString(), 10)] as HTMLImageElement).onerror = null;
                                        pageDiv.removeChild(oldPageDiv[parseInt(i.toString(), 10)]);
                                    }
                                    proxy.isTileImageRendered = false;
                                    proxy.tileRenderCount = 0;
                                    if (proxy.pdfViewer.magnificationModule) {
                                        proxy.pdfViewer.magnificationModule.rerenderCountIncrement();
                                    }
                                    proxy.isDrawnCompletely = true;
                                    proxy.pdfViewer.firePageRenderComplete(data);
                                }
                                (node as HTMLImageElement).setAttribute('alt', 'Page ' + (pageIndex + 1));
                            };
                            if (tileData) { (node as HTMLImageElement).src = tileData.image; }
                        }
                    }
                }
                const tileX: number = data.tileX ? data.tileX : 0;
                const tileY: number = data.tileY ? data.tileY : 0;
                if ((tileX === 0) && (tileY === 0)) {
                    this.onPageRender(data, pageIndex, pageDiv);
                }
            }
        }
    }

    private renderTileCanvas(pageWidth: any, pageHeight: any, pageIndex: any, pageDiv: any, zoomFactor: any, scaleFactor: any): any {
        let pageCanvas: any = this.getElement('_pageTileCanvas_' + pageIndex);
        if (!pageCanvas) {
            pageCanvas = createElement('canvas', { id: this.pdfViewer.element.id + '_pageTileCanvas_' + pageIndex, className: 'e-pv-pageTile-canvas' }) as HTMLCanvasElement;
            pageCanvas.style.width = pageWidth + 'px';
            pageCanvas.style.height = pageHeight + 'px';
            pageCanvas.style.display = 'none';
            pageCanvas.style.backgroundColor = '#fff';
            if (this.isMixedSizeDocument && this.highestWidth > 0) {
                pageCanvas.style.marginLeft = 'auto';
                pageCanvas.style.marginRight = 'auto';
            }
            pageDiv.appendChild(pageCanvas);
        }
        return pageCanvas;
    }

    private calculateImageWidth(pageWidth: number, zoomFactor: number, scaleFactor: number, imageWidth: number): number {
        const width: number = (pageWidth / this.getZoomFactor()) * zoomFactor * scaleFactor;
        if ((parseInt(imageWidth.toString(), 10)) === (parseInt(width.toString(), 10))) {
            imageWidth = width;
        }
        imageWidth = ((imageWidth * this.getZoomFactor()) / zoomFactor);
        return imageWidth;
    }

    private renderPage(data: any, pageIndex: number, imageSource?: string): void {
        // eslint-disable-next-line
        const proxy: PdfViewerBase = this;
        if (data && this.pageSize[parseInt(pageIndex.toString(), 10)]) {
            const pageWidth: number = this.getPageWidth(pageIndex);
            const pageHeight: number = this.getPageHeight(pageIndex);
            const canvas: HTMLImageElement = this.getElement('_pageCanvas_' + pageIndex) as HTMLImageElement;
            const pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
            if (pageDiv) {
                pageDiv.style.width = pageWidth + 'px';
                pageDiv.style.height = pageHeight + 'px';
                pageDiv.style.top = this.getPageTop(pageIndex) + 'px';
                if (this.pdfViewer.enableRtl) {
                    pageDiv.style.right = this.updateLeftPosition(pageIndex) + 'px';
                } else {
                    pageDiv.style.left = this.updateLeftPosition(pageIndex) + 'px';
                }
            }
            if (canvas) {
                canvas.style.background = '#fff';
                canvas.style.display = 'block';
                canvas.style.width = pageWidth + 'px';
                canvas.style.height = pageHeight + 'px';
                if (pageWidth < parseFloat(pageDiv.style.width)) {
                    pageDiv.style.boxShadow = 'none';
                }
                const imageData: string = (this.renderThumbnailImages && !this.clientSideRendering) ? imageSource : data['image'];
                if (imageData) {
                    canvas.onload = (): void => {
                        const oldCanvases: NodeListOf<Element> = document.querySelectorAll('img[id*="' + proxy.pdfViewer.element.id + '_tileimg_"]');
                        const pageCanvas: HTMLElement = proxy.getElement('_pageDiv_' + pageIndex);
                        for (let i: number = 0; i < oldCanvases.length; i++) {
                            const tileImgId: string[] = oldCanvases[parseInt(i.toString(), 10)].id.split('_');
                            if (parseFloat(tileImgId[tileImgId.length - 3]) !== proxy.getZoomFactor()) {
                                if (pageIndex !== parseInt(tileImgId[tileImgId.length - 4], 10)) {
                                    (oldCanvases[parseInt(i.toString(), 10)] as HTMLImageElement).onload = null;
                                    (oldCanvases[parseInt(i.toString(), 10)] as HTMLImageElement).onerror = null;
                                    proxy.getElement('_pageDiv_' + tileImgId[tileImgId.length - 4]).removeChild(oldCanvases[parseInt(i.toString(), 10)]);
                                }
                                else {
                                    (oldCanvases[parseInt(i.toString(), 10)] as HTMLImageElement).onload = null;
                                    (oldCanvases[parseInt(i.toString(), 10)] as HTMLImageElement).onerror = null;
                                    pageCanvas.removeChild(oldCanvases[parseInt(i.toString(), 10)]);
                                }
                            }
                        }
                        const oldPageDiv: NodeListOf<Element> = document.querySelectorAll('img[id*="' + proxy.pdfViewer.element.id + '_oldCanvas"]');
                        for (let i: number = 0; i < oldPageDiv.length; i++) {
                            (oldPageDiv[parseInt(i.toString(), 10)] as HTMLImageElement).onload = null;
                            (oldPageDiv[parseInt(i.toString(), 10)] as HTMLImageElement).onerror = null;
                            pageDiv.removeChild(oldPageDiv[parseInt(i.toString(), 10)]);
                        }
                        if (this.pdfViewer.magnificationModule) {
                            this.pdfViewer.magnificationModule.rerenderCountIncrement();
                        }
                        this.showPageLoadingIndicator(pageIndex, false);
                        if (pageIndex === 0 && this.isDocumentLoaded) {
                            this.renderPDFInformations();
                            this.isInitialLoaded = true;
                            const pageData: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_pagedata');
                            if (this.pageCount <= 100) {
                                this.pdfViewer.fireDocumentLoad(pageData);
                            }
                            this.isDocumentLoaded = false;
                            if (this.pdfViewer.textSearch && ((this.clientSideRendering && !this.pdfViewer.thumbnailViewModule &&
                                !this.pdfViewer.pageOrganizer) || !this.clientSideRendering)) {
                                this.pdfViewer.textSearchModule.getPDFDocumentTexts();
                            }
                        }
                        if (this.pdfViewer.magnificationModule) {
                            this.pdfViewer.magnificationModule.pushImageObjects(canvas);
                        }
                        canvas.setAttribute('alt', 'Page ' + (pageIndex + 1));
                    };
                    canvas.src = imageData;
                }
                this.onPageRender(data, pageIndex, pageDiv);
            }
        }
    }

    private updateAnnotationsAndState(data: any, pageAnnotations: any, pageIndex: number, annotationRenderredList: number[]): boolean {
        if (pageAnnotations) {
            data.shapeAnnotation = pageAnnotations.shapeAnnotation;
            data.measureShapeAnnotation = pageAnnotations.measureShapeAnnotation;
            data.textMarkupAnnotation = pageAnnotations.textMarkupAnnotation;
            data.freeTextAnnotation = pageAnnotations.freeTextAnnotation;
            data.stampAnnotations = pageAnnotations.stampAnnotations;
            data.stickyNotesAnnotation = pageAnnotations.stickyNotesAnnotation;
            data.signatureInkAnnotation = pageAnnotations.signatureInkAnnotation;
            annotationRenderredList.push(pageIndex);
            return true;
        }
        return false;
    }

    private isNeedToRenderAnnotations(collection: any, pageIndex: number): boolean {
        const uniquePageIndexes: any = new Set(collection.map((annotation: any) => !isNullOrUndefined(annotation.pageNumber) ?
            annotation.pageNumber : annotation.pageIndex));
        return uniquePageIndexes.has(pageIndex);
    }

    private isFormFieldsNeedtoRender(collection: any[], pageIndex: number): boolean {
        return collection.some((item: any) => {
            const field: any = item.FormField;
            return (
                field.pageNumber === pageIndex + 1
            );
        });
    }

    private onPageRender(data: any, pageIndex: number, pageDiv: HTMLElement): void {
        const aElement: any = pageDiv && pageDiv.getElementsByTagName('a');
        let isAnnotationRendered: boolean = false;
        const isNeedToRender: boolean = this.isNeedToRenderAnnotations(this.pdfViewer.annotationCollection, pageIndex);
        const isSignatureNeedtoRender: boolean = this.isNeedToRenderAnnotations(this.pdfViewer.signatureCollection, pageIndex);
        const isFormFieldsNeedtoRender: boolean = this.isFormFieldsNeedtoRender(this.formFieldCollection, pageIndex);
        if (aElement && aElement.length !== 0) {
            for (let index: number = aElement.length - 1; index >= 0; index--) {
                aElement[parseInt(index.toString(), 10)].parentNode.removeChild(aElement[parseInt(index.toString(), 10)]);
            }
        }
        if (this.pdfViewer.textSearchModule || this.pdfViewer.textSelectionModule || this.pdfViewer.annotationModule) {
            this.renderTextContent(data, pageIndex);
        }
        if (this.pdfViewer.formFieldsModule && !(this.pdfViewer.magnificationModule ?
            this.pdfViewer.magnificationModule.isFormFieldPageZoomed : false)) {
            if (this.pdfViewer.viewerBase.existingFieldImport) {
                this.pdfViewer.formFieldsModule.renderFormFields(pageIndex, false);
            }
            else {
                this.pdfViewer.formFieldsModule.renderFormFields(pageIndex, true);
            }
        }
        if (this.pdfViewer.accessibilityTagsModule && this.pdfViewer.enableAccessibilityTags && this.isTaggedPdf) {
            if (this.accessibilityTagsCollection[pageIndex.toString()]) {
                this.renderAccessibilityTags(pageIndex, this.accessibilityTagsCollection[pageIndex.toString()]);
            }
            else if (this.pageRequestListForAccessibilityTags.indexOf(pageIndex) === -1) {
                this.createRequestForAccessibilityTags(pageIndex);
            }
        }
        if (this.pdfViewer.formDesignerModule && !this.isDocumentLoaded) {
            this.pdfViewer.formDesignerModule.rerenderFormFields(pageIndex);
        }
        if (this.pdfViewer.formFieldsModule && !this.isDocumentLoaded && !this.pdfViewer.formDesignerModule) {
            this.pdfViewer.formFieldsModule.renderFormFields(pageIndex, false);
        }
        if (this.pdfViewer.formDesignerModule && this.isDocumentLoaded &&
            (this.pdfViewer.magnificationModule ? this.pdfViewer.magnificationModule.isFormFieldPageZoomed : true) &&
            this.pdfViewer.formFieldsModule) {
            this.pdfViewer.formFieldsModule.renderFormFields(pageIndex, false);
            if (this.pdfViewer.magnificationModule) {
                this.pdfViewer.magnificationModule.isFormFieldPageZoomed = false;
            }
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
                if (this.annotationRenderredList[parseInt(i.toString(), 10)] === pageIndex) {
                    isAnnotationAdded = true;
                }
            }
            const pageAnnotations: any = this.documentAnnotationCollections[parseInt(pageIndex.toString(), 10)];
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
        if (this.isImportAction) {
            const pageAnnotations: any = this.checkDocumentCollectionData(pageIndex);
            this.drawPageAnnotations(this.importedAnnotation[parseInt(pageIndex.toString(), 10)], pageIndex);
            if (pageAnnotations) {
                data.shapeAnnotation = pageAnnotations.shapeAnnotation;
                data.measureShapeAnnotation = pageAnnotations.measureShapeAnnotation;
                data.textMarkupAnnotation = pageAnnotations.textMarkupAnnotation;
                data.freeTextAnnotation = pageAnnotations.freeTextAnnotation;
                data.stampAnnotations = pageAnnotations.stampAnnotations;
                data.stickyNotesAnnotation = pageAnnotations.stickyNotesAnnotation;
                data.signatureInkAnnotation = pageAnnotations.signatureInkAnnotation;
                this.annotationRenderredList.push(pageIndex);
                isAnnotationRendered = true;
            }
        }
        if (!(this.isImportAction)) {
            const isAnnotationAdded: boolean = false;
            const pageAnnotations: any = this.checkDocumentCollectionData(pageIndex);
            if (pageAnnotations && !isAnnotationAdded) {
                isAnnotationRendered = this.updateAnnotationsAndState(data, pageAnnotations, pageIndex, this.annotationRenderredList);
            }
            if (this.pdfViewer.annotationModule && (this.isTextMarkupAnnotationModule() || this.isShapeBasedAnnotationsEnabled())) {
                if (this.isStampAnnotationModule()) {
                    const stampData: any = data['stampAnnotations'];
                    if (isAnnotationRendered) {
                        this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotations(stampData, pageIndex, null,
                                                                                                     true, null, true);
                    } else {
                        this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotations(stampData, pageIndex);
                    }
                }
                if (isAnnotationRendered && ((data.shapeAnnotation.length > 0 || data.measureShapeAnnotation.length > 0 ||
                    data.textMarkupAnnotation.length > 0) ||
                    (this.pdfViewer.signatureCollection.length > 0 && isSignatureNeedtoRender)
                    || (this.formFieldCollection.length > 0 && isFormFieldsNeedtoRender))) {
                    this.pdfViewer.annotationModule.renderAnnotations(pageIndex, data.shapeAnnotation,
                                                                      data.measureShapeAnnotation, data.textMarkupAnnotation, null, true);
                } else if ((!isNullOrUndefined(data.shapeAnnotation) && data.shapeAnnotation.length > 0) ||
                (!isNullOrUndefined(data.measureShapeAnnotation) && data.measureShapeAnnotation.length > 0) ||
                (!isNullOrUndefined(data.textMarkupAnnotation) && data.textMarkupAnnotation.length > 0) ||
                (this.pdfViewer.annotationCollection.length > 0 && isNeedToRender)) {
                    this.pdfViewer.annotationModule.renderAnnotations(pageIndex, data.shapeAnnotation,
                                                                      data.measureShapeAnnotation, data.textMarkupAnnotation);
                }
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                    renderStickyNotesAnnotations(data.stickyNotesAnnotation, pageIndex);
            }
            if (this.isFreeTextAnnotationModule() && data.freeTextAnnotation && data.freeTextAnnotation.length > 0) {
                if (isAnnotationRendered) {
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.
                        renderFreeTextAnnotations(data.freeTextAnnotation, pageIndex, true, null, true);
                } else {
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.renderFreeTextAnnotations(data.freeTextAnnotation, pageIndex);
                }
            }
            if (this.isInkAnnotationModule() && data && data.signatureInkAnnotation && data.signatureInkAnnotation.length > 0) {
                if (!this.pdfViewer.isSignatureEditable) {
                    data.signatureInkAnnotation = this.canUpdateSignCollection(data.signatureInkAnnotation);
                }
                if (data.signatureInkAnnotation) {
                    this.pdfViewer.annotationModule.inkAnnotationModule.
                        renderExistingInkSignature(data.signatureInkAnnotation, pageIndex, isAnnotationRendered, null, true);
                }
            }
        }
        if (this.pdfViewer.formDesignerModule && !this.pdfViewer.annotationModule) {
            this.pdfViewer.formDesignerModule.updateCanvas(pageIndex);
        }
        if (this.pdfViewer.textSearchModule) {
            if (!this.pdfViewer.textSearchModule.isDocumentTextCollectionReady) {
                if (this.pdfViewer.textSearchModule.isTextSearchHandled && this.pdfViewer.textSearchModule.currentOccurrence !== 0) {
                    this.pdfViewer.textSearchModule.hightlightSearchedTexts(this.pdfViewer.textSearchModule.searchPageIndex, true);
                }
                else {
                    if (!this.pdfViewer.textSearchModule.programaticalSearch && !this.pdfViewer.textSearchModule.isFiltering) {
                        this.pdfViewer.textSearchModule.hightlightSearchedTexts(undefined, true, true);
                    }
                }
            }
            else {
                if (this.pdfViewer.textSearchModule.isTextSearch && this.pdfViewer.textSearchModule.currentOccurrence !== 0) {
                    this.pdfViewer.textSearchModule.highlightOtherOccurrences(pageIndex);
                }
                else {
                    if (!this.pdfViewer.textSearchModule.programaticalSearch && !this.pdfViewer.textSearchModule.isFiltering) {
                        this.pdfViewer.textSearchModule.highlightAfterComplete();
                    }
                }
            }
        }
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.selectCommentsAnnotation(pageIndex);
        }
        if (data && data.signatureAnnotation && data.signatureAnnotation.length > 0 && this.signatureModule) {
            if (!this.pdfViewer.isSignatureEditable) {
                data.signatureAnnotation = this.canUpdateSignCollection(data.signatureAnnotation);
            }
            if (data.signatureAnnotation) {
                this.signatureModule.renderExistingSignature(data.signatureAnnotation, pageIndex, false);
            }
        }
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.isAnnotationSelected &&
             this.pdfViewer.annotationModule.annotationPageIndex === pageIndex &&
             this.pdfViewer.annotationModule.annotationType !== 'image') {
            this.pdfViewer.annotationModule.selectAnnotationFromCodeBehind();
        }
        this.isLoadedFormFieldAdded = false;
    }

    private removeInkFromAnnotCollection(docAnnotations: any): void {
        const annotationCollections: any[] = this.pdfViewer.annotationCollection;
        for (let m: number = 0; m < annotationCollections.length; m++) {
            const Bounds: any = docAnnotations.Bounds;
            if (annotationCollections[parseInt(m.toString(), 10)].shapeAnnotationType === 'Ink' ||
                annotationCollections[parseInt(m.toString(), 10)].shapeAnnotationType === 'ink') {
                const inkBounds: any = annotationCollections[parseInt(m.toString(), 10)].bounds;
                if (Math.round(Bounds.X) === Math.round(inkBounds.x) && Math.round(Bounds.Y) === Math.round(inkBounds.y) &&
                    Math.round(Bounds.Width) === Math.round(inkBounds.width) &&
                    Math.round(Bounds.Height) === Math.round(inkBounds.height)) {
                    this.pdfViewer.annotationCollection.splice(m, 1);
                }
            }
        }
    }

    private canReduse(previousLength: number, currentLength: number, currentValue: number): number {
        if (previousLength === currentLength) {
            return currentValue;
        }
        else {
            return currentValue - 1;
        }
    }

    private isBoundsAreEqual(inkBounds: any, annotBounds: any): boolean {
        if (Math.round(annotBounds.X) === Math.round(inkBounds.X) && Math.round(annotBounds.Y) === Math.round(inkBounds.Y) &&
            Math.round(annotBounds.Width) === Math.round(inkBounds.Width) &&
            Math.round(annotBounds.Height) === Math.round(inkBounds.Height)) {
            return true;
        }
        else {
            return false;
        }
    }

    private removeAnnotFromDoc(annotations: any, updatedCollections?: any): any {
        const Bounds: any = annotations.Bounds;
        const DocumentAnnot: any = this.documentAnnotationCollections[parseInt(annotations.PageNumber.toString(), 10)];
        const signatureInkAnnotation: any = DocumentAnnot.signatureInkAnnotation;
        const signatureAnnotation: any = DocumentAnnot.signatureAnnotation;
        let documentCollection: any = signatureInkAnnotation.length !== 0 ? signatureInkAnnotation : signatureAnnotation;
        if (signatureInkAnnotation.length !== 0 && signatureAnnotation.length) {
            for (let z: number = 0; z < signatureInkAnnotation.length; z++) {
                if (!this.isBoundsAreEqual(signatureInkAnnotation[0].Bounds, Bounds)) {
                    documentCollection = signatureAnnotation;
                }
            }
        }
        for (let k: number = 0; k < documentCollection.length; k++) {
            const previousLength: number = documentCollection.length;
            const inkBounds: any = documentCollection[parseInt(k.toString(), 10)].Bounds;
            if (this.isBoundsAreEqual(inkBounds, Bounds)) {
                this.removeInkFromAnnotCollection(documentCollection[parseInt(k.toString(), 10)]);
                documentCollection.splice(k, 1);
                k = this.canReduse(previousLength, documentCollection.length, k);
                updatedCollections = documentCollection;
            }
        }
        return updatedCollections;
    }

    private isGroupedSignatureFields(fieldName: string): boolean {
        const formFieldsData: any[] = this.pdfViewer.retrieveFormFields();
        let isGroupedFields: boolean = false;
        if (!isNullOrUndefined(fieldName)) {
            isGroupedFields = formFieldsData.filter((field: any) => field.name === fieldName).length > 1;
        }
        return isGroupedFields;
    }

    /**
     * @private
     * @param {any} fieldArray - The form field bounds.
     * @param {any} signArray - The annotation bounds.
     * @returns {boolean} - Returns true or false.
     */
    public isSignatureWithInRect(fieldArray: any, signArray: any): boolean {
        fieldArray = fieldArray[0];
        signArray = signArray[0];
        const fieldx2: number = fieldArray.x + fieldArray.width;
        const signx2: number = signArray.x + signArray.width;
        const fieldy2: number = fieldArray.y + fieldArray.height;
        const signy2: number = signArray.y + signArray.height;
        if ((fieldArray.x - 10) <= signArray.x && (fieldx2 + 10) >= signx2) {
            if ((fieldArray.y - 10) <= signArray.y && (fieldy2 + 10) >= signy2) {
                return true;
            }
        }
        return false;
    }

    /**
     * @private
     * @param {any} bounds - The form field or annotation bounds.
     * @returns {any} - Returns bounds.
     */
    public canvasRectArray(bounds: any): any {
        const array: any = [];
        if (bounds) {
            const left: number = !isNullOrUndefined(bounds.x) ? bounds.x : !isNullOrUndefined(bounds.X) ? bounds.X :
                !isNullOrUndefined(bounds.left) ? bounds.left : bounds.Left;
            const top: number = !isNullOrUndefined(bounds.y) ? bounds.y : !isNullOrUndefined(bounds.Y) ? bounds.Y :
                !isNullOrUndefined(bounds.top) ? bounds.top : bounds.Top;
            const width: number = !isNullOrUndefined(bounds.width) ? bounds.width : bounds.Width;
            const height: number = !isNullOrUndefined(bounds.height) ? bounds.height : bounds.Height;
            const canvas: Rect = new Rect(left + 10, top + 10, width - 10, height - 10);
            array.push(canvas);
        }
        return array;
    }

    private isFormFieldSignature(annotation: any, annotationCollection?: any): any {
        let updatedCollections: any = annotationCollection;
        if (!this.pdfViewer.isSignatureEditable) {
            const formFieldsData: any = this.pdfViewer.retrieveFormFields();
            for (let i: number = 0; i < formFieldsData.length; i++) {
                if (formFieldsData[parseInt(i.toString(), 10)].type === 'SignatureField' || formFieldsData[parseInt(i.toString(), 10)].type === 'InitialField') {
                    const fieldBounds: any = formFieldsData[parseInt(i.toString(), 10)].bounds;
                    const fieldName: string = formFieldsData[parseInt(i.toString(), 10)].name;
                    if (this.isSignatureWithInRect(this.canvasRectArray(fieldBounds), this.canvasRectArray(annotation.Bounds))
                        && !this.isGroupedSignatureFields(fieldName)) {
                        if (annotationCollection) {
                            updatedCollections = this.removeAnnotFromDoc(annotation, annotationCollection);
                        }
                        else {
                            updatedCollections = this.removeAnnotFromDoc(annotation);
                        }
                        if (formFieldsData[parseInt(i.toString(), 10)].value === '') {
                            const currentFieldPageNumber: number = !isNullOrUndefined(annotation.PageNumber) ?
                                annotation.PageNumber : annotation.pageNumber;
                            if (this.modifiedPageIndex.indexOf(currentFieldPageNumber) === -1) {
                                this.modifiedPageIndex.push(currentFieldPageNumber);
                            }
                            formFieldsData[parseInt(i.toString(), 10)].value = annotation.PathData;
                            formFieldsData[parseInt(i.toString(), 10)].signatureType = 'Draw';
                            const bounds: any = {
                                x: annotation.Bounds.X, y: annotation.Bounds.Y,
                                width: annotation.Bounds.Width, height: annotation.Bounds.Height
                            };
                            formFieldsData[parseInt(i.toString(), 10)].signatureBounds = bounds;
                            this.pdfViewer.updateFormFieldsValue(formFieldsData[parseInt(i.toString(), 10)]);
                        }
                        this.isInkAnnot = true;
                        break;
                    }
                }
            }
        }
        return updatedCollections;
    }

    private canUpdateSignCollection(SignatureCollections: any): any {
        for (let i: number = 0; i < SignatureCollections.length; i++) {
            const previousLength: number = SignatureCollections.length;
            SignatureCollections = this.isFormFieldSignature(SignatureCollections[parseInt(i.toString(), 10)],
                                                             SignatureCollections);
            i = this.canReduse(previousLength, SignatureCollections.length, i);
        }
        return SignatureCollections;
    }

    /**
     * @private
     * @param {number} pageIndex - page index for rendering the annotation.
     * @param {any} annotationsCollection -It describes about the annotations collection
     * @param {boolean} isAddedProgrammatically - It describes about the whether the isAddedProgrammatically true or not
     * @returns {Promise<void>} - any
     */
    public async renderAnnotations(pageIndex: number, annotationsCollection: any, isAddedProgrammatically?: boolean): Promise<void> {
        const data: any = {};
        if (this.documentAnnotationCollections) {
            let isAnnotationAdded: boolean = false;
            for (let i: number = 0; i < this.annotationRenderredList.length; i++) {
                if (this.annotationRenderredList[parseInt(i.toString(), 10)] === pageIndex) {
                    isAnnotationAdded = true;
                }
            }
            const pageAnnotations: any = this.documentAnnotationCollections[parseInt(pageIndex.toString(), 10)];
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
        if (this.isImportAction) {
            let isAnnotationAdded: boolean = false;
            for (let i: number = 0; i < this.annotationPageList.length; i++) {
                if (this.annotationPageList[parseInt(i.toString(), 10)] === pageIndex) {
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
        let annotData: any = [];
        const collection: any = annotationsCollection.annotationOrder;
        if (!isNullOrUndefined(collection)) {
            for (let l: number = 0; l < collection.length; l++) {
                this.isInkAnnot = false;
                const type: any = collection[parseInt(l.toString(), 10)].AnnotType ?
                    collection[parseInt(l.toString(), 10)].AnnotType : collection[parseInt(l.toString(), 10)].AnnotationType;
                annotData.push(collection[parseInt(l.toString(), 10)]);
                switch (type) {
                case 'textMarkup':
                    if (!isNullOrUndefined(this.pdfViewer.annotationModule.textMarkupAnnotationModule)) {
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                            renderTextMarkupAnnotationsInPage(annotData, pageIndex, null, true);
                    }
                    break;
                case 'shape_measure':
                    this.pdfViewer.annotationModule.
                        renderAnnotations(pageIndex, null, annotData, null, null, null, true, null, null, (l + 1 === collection.length));
                    break;
                case 'shape':
                    this.pdfViewer.annotationModule.
                        renderAnnotations(pageIndex, annotData, null, null, null, null, true, null, null, (l + 1 === collection.length));
                    break;
                case 'sticky':
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderStickyNotesAnnotations(annotData, pageIndex);
                    break;
                case 'stamp':
                    await this.pdfViewer.annotationModule.stampAnnotationModule.
                        renderStampAnnotations(annotData, pageIndex, null, null, true);
                    break;
                case 'Ink':
                    if (!this.pdfViewer.isSignatureEditable) {
                        this.isFormFieldSignature(annotData[0]);
                    }
                    if (!this.isInkAnnot) {
                        this.pdfViewer.annotationModule.inkAnnotationModule.renderExistingInkSignature(annotData, pageIndex, false, true);
                    }
                    break;
                case 'Text Box':
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.
                        renderFreeTextAnnotations(annotData, pageIndex, undefined, true);
                    break;
                default:
                    break;
                }
                annotData = [];
            }
        }
        if (data && data.signatureAnnotation) {
            if (!this.pdfViewer.isSignatureEditable) {
                data.signatureAnnotation = this.canUpdateSignCollection(data.signatureAnnotation);
            }
            if (data.signatureAnnotation) {
                this.signatureModule.renderExistingSignature(data.signatureAnnotation, pageIndex, false);
            }
        }
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.isAnnotationSelected) {
            this.pdfViewer.annotationModule.selectAnnotationFromCodeBehind();
        }
    }

    private renderTextContent(data: any, pageIndex: number): void {
        const texts: string[] = data['textContent'];
        const bounds: any = data['textBounds'];
        const rotation: any = data['rotation'];
        const rtldoc: any = data.documentTextCollection ?
            this.checkIsRtlText(data.documentTextCollection[0][parseInt(pageIndex.toString(), 10)].PageText) :
            this.checkIsRtlText(data.pageText);
        let textLayer: HTMLElement = this.getElement('_textLayer_' + pageIndex);
        if (!textLayer) {

            textLayer = this.textLayer.addTextLayer(pageIndex, this.getPageWidth(pageIndex), this.getPageHeight(pageIndex), this.getElement('_pageDiv_' + pageIndex));
        }
        if (textLayer && texts && bounds) {
            textLayer.style.display = 'block';
            if (textLayer.childNodes.length === 0) {
                this.textLayer.renderTextContents(pageIndex, texts, bounds, rotation, rtldoc);
            } else {
                this.textLayer.resizeTextContents(pageIndex, texts, bounds, rotation, true);
            }
        }
    }

    private renderAccessibilityTags(pageIndex: number, taggedTextResponse: any): void {
        this.accessibilityTags.renderAccessibilityTags(pageIndex, taggedTextResponse);
    }

    private returnPageListForAccessibilityTags(pageIndex: number): number[] {
        const pageList: number[] = [];
        if (!this.enableAccessibilityMultiPageRequest) {
            return [pageIndex];
        }
        const minPage: number = pageIndex - 2 > 0 ? pageIndex - 2 : 0;
        let maxPage: number = pageIndex + 4 < this.pageCount - 1 ? pageIndex + 4 : this.pageCount - 1;
        for (let i: number = minPage; i <= maxPage; i++) {
            if (this.accessibilityTagsCollection[parseInt(i.toString(), 10)] === undefined) {
                pageList.push(parseInt(i.toString(), 10));
            }
            else {
                maxPage = maxPage + 1 < this.pageCount - 1 ? maxPage + 1 : this.pageCount - 1;
            }
        }
        this.pageRequestListForAccessibilityTags = pageList;
        return pageList;
    }

    private createRequestForAccessibilityTags(pageIndex: number): void {
        // eslint-disable-next-line
        const proxy: any = this;
        const jsonObject: any = { action: 'RenderTaggedContent', elementId: (this.pdfViewer as any).element.id, hashId: this.hashId, uniqueId: this.documentId, pageList: JSON.stringify(this.returnPageListForAccessibilityTags(pageIndex)) };
        if (this.jsonDocumentId) {
            (jsonObject as any).document = this.jsonDocumentId;
        }
        const url: string = this.pdfViewer.serviceUrl + '/' + 'RenderTaggedContent';
        this.accessibilityTagsHandler = new AjaxHandler(this.pdfViewer);
        this.accessibilityTagsHandler.url = url;
        this.accessibilityTagsHandler.mode = true;
        this.accessibilityTagsHandler.responseType = 'text';
        this.accessibilityTagsHandler.send(jsonObject);
        this.accessibilityTagsHandler.onSuccess = function (result: any): void {
            const data: any = JSON.parse(result.data);
            let pageData: any;
            for (let i: number = 0; i < data.length; i++) {
                pageData = data[parseInt(i.toString(), 10)];
                proxy.accessibilityTagsCollection[pageData[0]] = pageData[1];
            }
            proxy.pageRequestListForAccessibilityTags = [];
            if (proxy.accessibilityTagsCollection[parseInt(pageIndex.toString(), 10)]) {
                proxy.renderAccessibilityTags(pageIndex, proxy.accessibilityTagsCollection[parseInt(pageIndex.toString(), 10)]);
            }
            if (proxy.accessibilityTagsCollection[pageIndex - 1 <= 0 ? parseInt((pageIndex - 1).toString(), 10) : 0]) {
                proxy.renderAccessibilityTags(pageIndex - 1 <= 0 ? pageIndex - 1 : 0,
                                              proxy.accessibilityTagsCollection[pageIndex - 1 <= 0 ?
                                                  parseInt((pageIndex - 1).toString(), 10) : 0]);
            }
        };
    }

    private renderPageContainer(pageNumber: number, pageWidth: number, pageHeight: number, topValue: number): void {
        const pageDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_pageDiv_' + pageNumber, className: 'e-pv-page-div', attrs: { 'tabindex': '-1' } });
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            pageDiv.classList.add('e-pv-text-selection-none');
        }
        pageDiv.style.width = pageWidth + 'px';
        pageDiv.style.height = pageHeight + 'px';
        if (this.pdfViewer.enableRtl) {
            pageDiv.style.right = this.updateLeftPosition(pageNumber) + 'px';
        } else {
            pageDiv.style.left = this.updateLeftPosition(pageNumber) + 'px';
        }
        pageDiv.style.top = topValue + 'px';
        this.pageContainer.appendChild(pageDiv);
        this.pageContainer.style.width = (this.isMixedSizeDocument && (this.highestWidth * this.getZoomFactor()) > this.viewerContainer.clientWidth) ? (this.highestWidth * this.getZoomFactor()) + 'px' : this.viewerContainer.clientWidth + 'px';
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
        else if (!isNullOrUndefined(this.pdfViewer.pageOrganizer) && this.pdfViewer.enablePageOrganizer) {
            this.pdfViewer.pageOrganizer.createRequestForPreview();
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
        const nextElement: HTMLElement = this.getElement('_pageDiv_' + (pageIndex + 1));
        if (this.pageContainer && pageDiv) {
            if (nextElement) {
                this.pageContainer.insertBefore(pageDiv, nextElement);
            } else {
                this.pageContainer.appendChild(pageDiv);
            }
        }
    }

    /**
     * @param {HTMLElement} pageDiv - It describes about the page div
     * @param {number} pageWidth - It describes about the page width
     * @param {number} pageHeight - It describes about the page heigght
     * @param {number} pageNumber - It describes about the page number
     * @param {string} displayMode - It describes about the display mode
     * @private
     * @returns {any} - any
     */
    public renderPageCanvas(pageDiv: HTMLElement, pageWidth: number, pageHeight: number, pageNumber: number, displayMode: string): any {
        if (pageDiv) {
            let pageCanvas: any = this.getElement('_pageCanvas_' + pageNumber);
            if (pageCanvas) {
                pageCanvas.width = pageWidth;
                pageCanvas.height = pageHeight;
                pageCanvas.style.display = 'block';
                if (this.isMixedSizeDocument && this.highestWidth > 0) {
                    pageCanvas.style.marginLeft = 'auto';
                    pageCanvas.style.marginRight = 'auto';
                }
            } else {
                pageCanvas = createElement('img', { id: this.pdfViewer.element.id + '_pageCanvas_' + pageNumber, className: 'e-pv-page-canvas' }) as HTMLImageElement;
                pageCanvas.width = pageWidth;
                pageCanvas.height = pageHeight;
                pageCanvas.style.display = displayMode;
                pageCanvas.style.userSelect = 'none';
                if (this.isMixedSizeDocument && this.highestWidth > 0) {
                    pageCanvas.style.marginLeft = 'auto';
                    pageCanvas.style.marginRight = 'auto';
                }
                pageDiv.appendChild(pageCanvas);
            }
            pageCanvas.setAttribute('alt', '');
            if (this.pdfViewer.textSearchModule || this.pdfViewer.textSelectionModule ||
                this.pdfViewer.formFieldsModule || this.pdfViewer.annotationModule) {
                this.textLayer.addTextLayer(pageNumber, pageWidth, pageHeight, pageDiv);
            }
            return pageCanvas;
        }
    }

    /**
     * @private
     * @param {any} pageCanvas - The canvas for rendering the page.
     * @param {any} pageNumber - The page number for adding styles.
     * @returns {void}
     */
    public applyElementStyles(pageCanvas: any, pageNumber: number): void {
        if (this.isMixedSizeDocument && pageCanvas) {
            const canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageNumber);
            const oldCanvas: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_oldCanvas_' + pageNumber);
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
     * @param  {number} pageIndex - page index for updating positon.
     * @returns {void}
     */
    public updateLeftPosition(pageIndex: number): number {
        let leftPosition: number;
        let width: number = this.viewerContainer.getBoundingClientRect().width;
        if (width === 0) {
            width = parseFloat(this.pdfViewer.width.toString());
        }
        if (this.isMixedSizeDocument && this.highestWidth > 0) {
            if (this.viewerContainer.clientWidth > 0) {
                leftPosition = (this.viewerContainer.clientWidth - (this.highestWidth * this.getZoomFactor())) / 2;
            } else {
                leftPosition = (width - (this.highestWidth * this.getZoomFactor())) / 2;
            }
            const pageDiff: number = (this.highestWidth * this.getZoomFactor() - this.getPageWidth(pageIndex)) / 2;
            if (leftPosition > 0) {
                leftPosition += pageDiff;
            } else {
                leftPosition = pageDiff;
            }
            this.pageContainer.style.width = ((this.highestWidth * this.getZoomFactor()) > this.viewerContainer.clientWidth) ? (this.highestWidth * this.getZoomFactor()) + 'px' : this.viewerContainer.clientWidth + 'px';
        } else {
            if (this.viewerContainer.clientWidth > 0) {
                leftPosition = (this.viewerContainer.clientWidth - this.getPageWidth(pageIndex)) / 2;
            } else {
                leftPosition = (width - this.getPageWidth(pageIndex)) / 2;
            }
        }
        let isLandscape: boolean = false;
        if (this.pageSize[parseInt(pageIndex.toString(), 10)].width > this.pageSize[parseInt(pageIndex.toString(), 10)].height) {
            isLandscape = true;
        }
        if (leftPosition < 0 || (this.pdfViewer.magnificationModule ? ((this.pdfViewer.magnificationModule.isAutoZoom && this.getZoomFactor() < 1) || this.pdfViewer.magnificationModule.fitType === 'fitToWidth') : false)) {
            const leftValue: number = leftPosition;
            if (leftPosition > 0 && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {

                leftPosition = leftValue;
            } else {
                leftPosition = this.pageLeft;
            }
            if ((leftPosition > 0) && this.isMixedSizeDocument) {
                if (leftValue > 0) {
                    leftPosition = leftValue;
                }
            }
        }
        if (this.viewerContainer.clientHeight >= this.viewerContainer.scrollHeight && this.previousScrollbarWidth > 0) {
            const scrollBarWidth: number = this.navigationPane.getViewerContainerScrollbarWidth();
            leftPosition = leftPosition - ((this.previousScrollbarWidth - scrollBarWidth) / 2);
        }
        return leftPosition;
    }

    /**
     * @private
     * @param {number} pageIndex - The page index for positon.
     * @returns {void}
     */
    public applyLeftPosition(pageIndex: number): void {
        let leftPosition: number;
        if (this.pageSize[parseInt(pageIndex.toString(), 10)]) {
            if (this.isMixedSizeDocument && this.highestWidth > 0) {
                if (this.viewerContainer.clientWidth > 0) {
                    leftPosition = (this.viewerContainer.clientWidth - (this.highestWidth * this.getZoomFactor())) / 2;
                } else {
                    leftPosition = (this.viewerContainer.getBoundingClientRect().width - (this.highestWidth * this.getZoomFactor())) / 2;
                }
                const pageDiff: number = (this.highestWidth * this.getZoomFactor() - this.getPageWidth(pageIndex)) / 2;
                if (leftPosition > 0) {
                    leftPosition += pageDiff;
                } else {
                    leftPosition = pageDiff;
                }
            } else {
                if (this.viewerContainer.clientWidth > 0) {
                    leftPosition = (this.viewerContainer.clientWidth - this.pageSize[parseInt(pageIndex.toString(), 10)].width *
                    this.getZoomFactor()) / 2;
                } else {
                    leftPosition = (this.viewerContainer.getBoundingClientRect().width -
                    this.pageSize[parseInt(pageIndex.toString(), 10)].width * this.getZoomFactor()) / 2;
                }
            }
            let isLandscape: boolean = false;
            if (this.pageSize[parseInt(pageIndex.toString(), 10)].width > this.pageSize[parseInt(pageIndex.toString(), 10)].height) {
                isLandscape = true;
            }
            if (leftPosition < 0 || (this.pdfViewer.magnificationModule ? ((this.pdfViewer.magnificationModule.isAutoZoom && this.getZoomFactor() < 1) || this.pdfViewer.magnificationModule.fitType === 'fitToWidth') : false)) {
                const leftValue: number = leftPosition;
                leftPosition = this.pageLeft;
                if ((leftValue > 0) && this.isMixedSizeDocument) {
                    leftPosition = leftValue;
                }
            }
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
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

    private viewerContainerOnScroll = (event: any): void => {
        let proxy: PdfViewerBase = null;
        // eslint-disable-next-line
        proxy = this;
        const allowServerDataBind: boolean = proxy.pdfViewer.allowServerDataBinding;
        proxy.pdfViewer.enableServerDataBinding(false);
        let scrollposX: number = 0;
        let scrollposY: number = 0;
        if (event.touches && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
            const ratio: number = (this.viewerContainer.scrollHeight - this.viewerContainer.clientHeight) /
            (this.viewerContainer.clientHeight - this.toolbarHeight);
            if (this.isThumb) {
                this.ispageMoved = true;
                event.preventDefault();
                this.isScrollerMoving = true;
                this.mobilePageNoContainer.style.display = 'block';
                scrollposX = event.touches[0].pageX - this.scrollX;
                scrollposY = event.touches[0].pageY - this.viewerContainer.offsetTop;
                if (isNullOrUndefined(this.isScrollerMovingTimer)) {
                    this.isScrollerMovingTimer = setTimeout(() => {
                        this.isScrollerMoving = false;
                        this.pageViewScrollChanged(this.currentPageNumber);
                    }, 300);
                }
                const differenceY: number = Math.abs(this.viewerContainer.scrollTop - (scrollposY * ratio));
                if (differenceY > 10) {
                    clearTimeout(this.isScrollerMovingTimer);
                    this.isScrollerMovingTimer = null;
                }
                this.viewerContainer.scrollTop = scrollposY * ratio;
                const containerValue: any = event.touches[0].pageY;
                const toolbarHeight: number = this.pdfViewer.toolbarModule ? 0 : 50;
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

                this.updateMobileScrollerPosition();
                this.touchClientY = event.touches[0].pageY;
                this.touchClientX = event.touches[0].pageX;
            }
        }
        if (this.scrollHoldTimer) {
            clearTimeout(this.scrollHoldTimer);
        }
        const pageIndex: number = this.currentPageNumber;
        this.scrollHoldTimer = null;
        this.contextMenuModule.close();
        const verticalScrollValue: number = this.viewerContainer.scrollTop;
        for (let i: number = 0; i < this.pageCount; i++) {
            if (this.pageSize[parseInt(i.toString(), 10)] != null) {
                const pageHeight: number = this.getPageHeight(i);
                if (pageHeight < 150) {
                    this.pageStopValue = 75;
                } else if (pageHeight >= 150 && pageHeight < 300) {
                    this.pageStopValue = 125;
                } else if (pageHeight >= 300 && pageHeight < 500) {
                    this.pageStopValue = 200;
                } else {
                    this.pageStopValue = 300;
                }

                if ((verticalScrollValue + this.pageStopValue) <= (this.getPageTop(i) + pageHeight)) {
                    this.currentPageNumber = i + 1;
                    this.pdfViewer.currentPageNumber = i + 1;
                    break;
                }
            }
        }
        if (this.pdfViewer.magnificationModule && this.pdfViewer.magnificationModule.fitType === 'fitToPage' && this.currentPageNumber > 0) {
            if (this.pageSize[this.currentPageNumber - 1]) {
                if (!this.isPanMode && (!Browser.isDevice && this.pdfViewer.enableDesktopMode)) {
                    this.viewerContainer.scrollTop = this.pageSize[this.currentPageNumber - 1].top * this.getZoomFactor();
                }
            }
        }
        this.renderElementsVirtualScroll(this.currentPageNumber);
        if (this.pdfViewer.toolbarModule) {
            if (!isBlazor()) {
                this.pdfViewer.toolbarModule.updateCurrentPage(this.currentPageNumber);
            }
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
            if (!this.isPanMode && (!Browser.isDevice && this.pdfViewer.enableDesktopMode)) {
                this.pdfViewer.magnificationModule.updatePagesForFitPage(this.currentPageNumber - 1);
            }
        }
        const currentPage: HTMLElement = this.getElement('_pageDiv_' + (this.currentPageNumber - 1));
        if (currentPage) {
            currentPage.style.visibility = 'visible';
        }
        if (this.isViewerMouseDown || (!this.isViewerMouseDown &&
            !this.getPinchZoomed() && !this.getPinchScrolled() &&
            !this.getPagesPinchZoomed() || this.isViewerMouseWheel)) {
            if (this.getRerenderCanvasCreated() && !this.isPanMode) {
                this.pdfViewer.magnificationModule.clearIntervalTimer();
            }
            const data: any = this.clientSideRendering ? this.getLinkInformation(this.currentPageNumber) :
                this.getStoredData(this.currentPageNumber);
            if (data) {
                this.isDataExits = true;
                this.initiatePageViewScrollChanged();
                this.isDataExits = false;
            } else {
                const timer: number = this.pdfViewer.scrollSettings.delayPageRequestTimeOnScroll ?
                    this.pdfViewer.scrollSettings.delayPageRequestTimeOnScroll : 100;
                this.scrollHoldTimer = setTimeout(
                    () => {
                        this.initiatePageViewScrollChanged();
                    }, timer);
            }
        }
        if (this.pdfViewer.annotation && this.navigationPane.commentPanelContainer) {
            this.pdfViewer.annotation.stickyNotesAnnotationModule.updateCommentPanelScrollTop(this.currentPageNumber);
        }
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && event.touches && event.touches[0].target.className !== 'e-pv-touch-ellipse') {
            setTimeout(
                () => {
                    this.updateMobileScrollerPosition();
                }, 500);
        }
        proxy.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
    };

    /**
     * @private
     * @param {Point} clientPoint - The user should provide a x, y coordinates.
     * @returns {number} - number
     */
    public getPageNumberFromClientPoint(clientPoint: Point): number {
        const pointX: number = clientPoint.x + this.viewerContainer.scrollLeft;
        const pointY: number = clientPoint.y + this.viewerContainer.scrollTop;
        for (let i: number = 0; i < this.pageCount; i++) {
            const pageTop: number = this.pageSize[parseInt(i.toString(), 10)].height + this.viewerContainer.scrollTop;
            if (pointY < (this.pageSize[parseInt(i.toString(), 10)].top + pageTop)) {
                const viewerContainerBounds: DOMRect | ClientRect = this.getElement('_pageViewContainer').getBoundingClientRect();
                const pageLeft: number = ((viewerContainerBounds.width - this.pageSize[parseInt(i.toString(), 10)].width) / 2) +
                (viewerContainerBounds as DOMRect).x;
                let verticalScrollPosition: number = 0;
                if (pointY > this.pageSize[parseInt(i.toString(), 10)].top) {
                    verticalScrollPosition = (pointY - this.pageSize[parseInt(i.toString(), 10)].top);
                } else {
                    verticalScrollPosition = (this.pageSize[parseInt(i.toString(), 10)].top - pointY);
                }
                if (verticalScrollPosition > 0) {
                    if (this.pageSize[parseInt(i.toString(), 10)] != null) {
                        const pageHeight: number = this.getPageHeight(i);
                        if (pageLeft >= 0) {
                            if ((pointX < pageLeft) || (pointX > (pageLeft + (this.pageSize[parseInt(i.toString(), 10)].width)))) {
                                return -1;
                            }
                        }
                        if (verticalScrollPosition <= (this.getPageTop(i) + pageTop)) {
                            return i + 1;
                        }
                    }
                }
            }
        }
        return -1;
    }

    /**
     * @private
     * @param {Point} clientPoint - The user should provide a x, y coordinates.
     * @param {number} pageNumber - We need to pass pageNumber.
     * @returns {Point} - point
     */
    public convertClientPointToPagePoint(clientPoint: Point, pageNumber: number): Point {
        if (pageNumber !== -1) {
            const viewerContainerBounds: DOMRect | ClientRect = this.getElement('_pageViewContainer').getBoundingClientRect();
            const pageLeft: number = ((viewerContainerBounds.width - this.pageSize[pageNumber - 1].width) / 2) +
            (viewerContainerBounds as DOMRect).x;
            const pagePoint: any = { x: (clientPoint.x + this.viewerContainer.scrollLeft) - pageLeft, y:
                (clientPoint.y + this.viewerContainer.scrollTop) - this.pageSize[pageNumber - 1].top };
            return pagePoint;
        }
        return null;
    }

    /**
     * @private
     * @param {Point} pagePoint - The user needs to provide a page x, y position.
     * @param {number} pageNumber - We need to pass pageNumber.
     * @returns {Point} - point
     */
    public convertPagePointToClientPoint(pagePoint: any, pageNumber: number): Point {
        if (pageNumber !== -1) {
            const viewerContainerBounds: DOMRect | ClientRect = this.getElement('_pageViewContainer').getBoundingClientRect();
            const pageLeft: number = ((viewerContainerBounds.width - this.pageSize[pageNumber - 1].width) / 2) +
            (viewerContainerBounds as DOMRect).x;
            const clientPoint: any = { x: pagePoint.x + pageLeft, y: pagePoint.y + this.pageSize[pageNumber - 1].top };
            return clientPoint;
        }
        return null;
    }

    /**
     * @private
     * @param {Point} pagePoint - The user needs to provide a page x, y position.
     * @param {number} pageNumber - We need to pass pageNumber.
     * @returns {Point} - point
     */
    public convertPagePointToScrollingPoint(pagePoint: any, pageNumber: number): Point {
        if (pageNumber !== -1) {
            const scrollingPoint: any = { x: pagePoint.x + this.viewerContainer.scrollLeft, y: pagePoint.y +
                this.viewerContainer.scrollTop };
            return scrollingPoint;
        }
        return null;
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
     * @param {number} currentPageNumber - The current pagenumber.
     * @returns {void}
     */
    public pageViewScrollChanged(currentPageNumber: number): void {
        if (this.isPanMode) {
            if (this.renderedPagesList.indexOf(currentPageNumber - 1) === -1) {
                this.reRenderedCount = 0;
            }
        } else {
            this.reRenderedCount = 0;
        }
        const currentPageIndex: number = currentPageNumber - 1;
        if (currentPageNumber !== this.previousPage && currentPageNumber <= this.pageCount) {
            let isSkip: boolean = false;
            const storeData: any = this.clientSideRendering ? this.getLinkInformation(currentPageIndex) :
                this.getStoredData(currentPageIndex);
            if (this.isDataExits && !this.getStoredData(currentPageIndex)) {
                isSkip = true;
            }
            if (this.renderedPagesList.indexOf(currentPageIndex) === -1 && !this.getMagnified() && !isSkip && !this.isScrollerMoving) {
                this.renderCountIncrement();
                this.createRequestForRender(currentPageIndex);
            }
        }
        if (!(this.getMagnified() || this.getPagesPinchZoomed())) {
            const previous: number = currentPageIndex - 1;
            let isSkip: boolean = false;
            const canvas: HTMLImageElement = this.getElement('_pageCanvas_' + previous) as HTMLImageElement;
            const storeData: any = this.clientSideRendering ? this.getLinkInformation(previous) : this.getStoredData(previous);
            if (this.isDataExits && !this.getStoredData(previous)) {
                isSkip = true;
            }
            if (canvas !== null && !isSkip) {
                if (this.renderedPagesList.indexOf(previous) === -1 && !this.getMagnified() && !this.isScrollerMoving) {
                    this.renderCountIncrement();
                    this.createRequestForRender(previous);

                }
            }
            if (this.isMinimumZoom) {
                this.renderPreviousPagesInScroll(previous);
            }
            let next: number = currentPageIndex + 1;
            let pageHeight: number = 0;
            if (next < this.pageCount) {
                pageHeight = this.getPageHeight(next);
                const allowPageRendering: boolean = this.isMinimumZoom ? this.isMinimumZoom : this.renderedPagesList.indexOf(next) === -1;
                if (allowPageRendering && !this.getMagnified() && pageHeight) {
                    const renderLimit: number = this.pdfViewer.initialRenderPages <= this.pageCount ?
                        this.pdfViewer.initialRenderPages : this.pageCount;
                    if (this.isDocumentLoaded && this.pdfViewer.initialRenderPages > this.pageRenderCount &&
                        (this.getPageHeight(renderLimit - 1) +
                        this.getPageTop(renderLimit - 1)) > this.viewerContainer.clientHeight) {
                        for (let i: number = 1; i < renderLimit; i++) {
                            this.createRequestForRender(i);
                        }
                    } else if (!this.isScrollerMoving) {
                        this.createRequestForRender(next);
                        this.renderCountIncrement();
                        while (this.viewerContainer.clientHeight > pageHeight) {
                            next = next + 1;
                            if (next < this.pageCount) {
                                this.renderPageElement(next);
                                this.createRequestForRender(next);
                                pageHeight += this.getPageHeight(next);
                                this.renderCountIncrement();
                            }
                            else {
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    private renderPreviousPagesInScroll(pageIndex: number): void {
        const next: number = pageIndex - 1;
        const pageNumber: number = next - 1;
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
        const Url: any = URL || webkitURL;
        blobUrl = Url.createObjectURL(blobUrl);
        const anchorElement: HTMLElement = createElement('a');
        if (anchorElement.click) {
            (anchorElement as HTMLAnchorElement).href = blobUrl;
            (anchorElement as HTMLAnchorElement).target = '_parent';
            if ('download' in anchorElement) {
                if (!isNullOrUndefined(this.downloadFileName)) {
                    if (this.downloadFileName.endsWith('.pdf')) {
                        (anchorElement as HTMLAnchorElement).download = this.downloadFileName;
                    }
                    else {
                        const splitPdf: string = this.downloadFileName.split('.pdf')[0] + '.pdf';
                        (anchorElement as HTMLAnchorElement).download = splitPdf;
                    }
                } else {
                    (anchorElement as HTMLAnchorElement).download = 'Default.pdf';
                }
            }
            (document.body || document.documentElement).appendChild(anchorElement);
            anchorElement.click();
            anchorElement.parentNode.removeChild(anchorElement);
        } else {
            if (window.top === window &&
                blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
                const padCharacter: string = blobUrl.indexOf('?') === -1 ? '?' : '&';
                blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
            }
            window.open(blobUrl, '_parent');
        }
    }

    private downloadExportFormat(blobUrl: string, annotationDataFormat?: AnnotationDataFormat,
                                 formFieldDataFormat?: FormFieldDataFormat, isForm?: boolean): void {
        const isJson: boolean = annotationDataFormat === 'Json' || formFieldDataFormat === 'Json';
        const extension:  '.json' | '.fdf' | '.xml' | '.xfdf' = isJson ? '.json' : formFieldDataFormat === 'Fdf' ? '.fdf' : formFieldDataFormat === 'Xml' ? '.xml' : (annotationDataFormat === 'Xfdf' || formFieldDataFormat === 'Xfdf') ? '.xfdf' : null;
        if (!isNullOrUndefined(extension)) {
            const Url: any = URL || webkitURL;
            blobUrl = Url.createObjectURL(blobUrl);
            const anchorElement: HTMLElement = createElement('a');
            if (anchorElement.click) {
                (anchorElement as HTMLAnchorElement).href = blobUrl;
                (anchorElement as HTMLAnchorElement).target = '_parent';
                if ('download' in anchorElement) {
                    if (this.pdfViewer.exportAnnotationFileName !== null) {
                        (anchorElement as HTMLAnchorElement).download = this.pdfViewer.exportAnnotationFileName.split('.')[0] + extension;
                    } else {
                        (anchorElement as HTMLAnchorElement).download = this.pdfViewer.fileName.split('.')[0] + extension;
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
            } else if (isJson) {
                if (window.top === window &&
                    blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
                    const padCharacter: string = blobUrl.indexOf('?') === -1 ? '?' : '&';
                    blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
                }
                window.open(blobUrl, '_parent');
                if (isForm) {
                    this.pdfViewer.fireFormExportSuccess(blobUrl, this.pdfViewer.fileName.split('.')[0] + extension);
                } else {
                    this.pdfViewer.fireExportSuccess(blobUrl, this.pdfViewer.fileName.split('.')[0] + extension);
                }
            }
        }
    }

    /**
     * @private
     * @param {string} data - The data for exporting the fields.
     * @param {FormFieldDataFormat} formFieldDataFormat - It describes about the form fiels data format
     * @returns {void}
     */
    public exportFormFields(data?: string, formFieldDataFormat?: FormFieldDataFormat): void {
        this.createRequestForExportFormfields(false, formFieldDataFormat, data);
    }

    /**
     * @param {string} data - It describes about the data value
     * @param {FormFieldDataFormat} formFieldDataFormat - It describes about the form field data format
     * @private
     * @returns {void}
     */
    public importFormFields(data: string, formFieldDataFormat?: FormFieldDataFormat): void {
        this.createRequestForImportingFormfields(data, formFieldDataFormat);
    }

    /**
     * @param {boolean} isObject - It ensures whether the isObject is true or not
     * @param {FormFieldDataFormat} formFieldDataFormat - This describes about the form field data format
     * @param {string} data - The data for exporting the fields.
     * @private
     * @returns {any} - any
     */
    public createRequestForExportFormfields(isObject?: boolean, formFieldDataFormat?: FormFieldDataFormat, data?: string): any {
        let proxy: PdfViewerBase = null;
        // eslint-disable-next-line
        proxy = this;
        const promise: Promise<Blob> = new Promise((resolve: Function, reject: Function) => {
            const jsonObject: any = proxy.createFormfieldsJsonData();
            let canExport: boolean = false;
            if (formFieldDataFormat === 'Json' || formFieldDataFormat === 'Fdf' || formFieldDataFormat === 'Xfdf' || formFieldDataFormat === 'Xml') {
                jsonObject.formFieldDataFormat = formFieldDataFormat;
                canExport = proxy.pdfViewer.fireFormExportStarted(jsonObject);
            }
            if (canExport) {
                jsonObject.action = 'ExportFormFields';
                jsonObject['hashId'] = proxy.hashId;
                jsonObject['fileName'] = proxy.pdfViewer.fileName;
                if (data && data !== '' && !isObject) {
                    jsonObject['filePath'] = data;
                }
                jsonObject['elementId'] = this.pdfViewer.element.id;
                if (proxy.jsonDocumentId) {
                    (jsonObject as any).document = proxy.jsonDocumentId;
                }
                const formFieldsPageList: any = this.getFormFieldsPageList(jsonObject['formDesigner']);
                jsonObject['formFieldsPageList'] = JSON.stringify(formFieldsPageList);
                jsonObject['isFormFieldAnnotationsExist'] = this.isAnnotationsExist(jsonObject['formDesigner']) || this.isFieldsDataExist(jsonObject['fieldsData']) || formFieldsPageList.length > 0;
                const url: string = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.exportFormFields;
                proxy.exportFormFieldsRequestHandler = new AjaxHandler(this.pdfViewer);
                proxy.exportFormFieldsRequestHandler.url = url;
                proxy.exportFormFieldsRequestHandler.mode = true;
                proxy.exportFormFieldsRequestHandler.responseType = 'text';
                if (proxy.validateForm && proxy.pdfViewer.enableFormFieldsValidation) {
                    proxy.pdfViewer.fireValidatedFailed(proxy.pdfViewer.serverActionSettings.download);
                    proxy.validateForm = false;
                }
                else if (!proxy.clientSideRendering) {
                    proxy.exportFormFieldsRequestHandler.send(jsonObject);
                } else {
                    const resultData: any = proxy.pdfViewer.pdfRendererModule.exportFormFields(jsonObject, isObject);
                    const decoder: TextDecoder = new TextDecoder('utf-8');
                    const updatedResultData: string = decoder.decode(resultData);
                    if (isObject) {
                        const annotData:  Promise<string> = this.getDataOnSuccess(updatedResultData);
                        resolve(annotData);
                    } else {
                        proxy.exportFileDownload(resultData, proxy, formFieldDataFormat, jsonObject, isObject);
                    }
                }
                proxy.exportFormFieldsRequestHandler.onSuccess = function (result: any):  void {
                    const data: any = result.data;
                    const redirect: boolean = proxy.checkRedirection(data);
                    if (!redirect) {
                        if (data) {
                            if (isObject) {
                                const annotData: any = proxy.exportFileDownload(data, proxy, formFieldDataFormat, jsonObject, isObject);
                                resolve(annotData);
                            } else {
                                proxy.exportFileDownload(data, proxy, formFieldDataFormat, jsonObject, isObject);
                            }
                        }
                    }
                };
                proxy.exportFormFieldsRequestHandler.onFailure = function (result: any): void {
                    proxy.pdfViewer.fireFormExportFailed(jsonObject.pdfAnnotation, result.statusText);
                };
                proxy.exportFormFieldsRequestHandler.onError = function (result: any): void {
                    proxy.pdfViewer.fireFormExportFailed(jsonObject.pdfAnnotation, result.statusText);
                };
            }
        });
        if (isObject) {
            return promise;
        } else {
            return true;
        }
    }

    private exportFileDownload(data: string, proxy: PdfViewerBase, formFieldDataFormat: FormFieldDataFormat,
                               jsonObject: any, isObject: boolean): Promise<unknown> {
        if (!this.clientSideRendering) {
            return new Promise((resolve: any) => {
                if (data) {
                    if (!proxy.clientSideRendering) {
                        proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.exportFormFields, data);
                    }
                    if (isObject) {
                        const annotationJson: any = decodeURIComponent(escape(atob(data.split(',')[1])));
                        resolve(annotationJson);
                        proxy.pdfViewer.fireFormExportSuccess(annotationJson, proxy.pdfViewer.fileName);
                    } else if (data.split('base64,')[1]) {
                        const blobUrl: string = proxy.createBlobUrl(data.split('base64,')[1], 'application/json');
                        if (Browser.isIE || Browser.info.name === 'edge') {
                            window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.fileName.split('.')[0] + '.json');
                        } else if (jsonObject.formFieldDataFormat === 'Json' || jsonObject.formFieldDataFormat === 'Fdf' || jsonObject.formFieldDataFormat === 'Xfdf' || jsonObject.formFieldDataFormat === 'Xml') {
                            proxy.downloadExportFormat(blobUrl, null, formFieldDataFormat, true);
                        }
                    }
                }
            });
        } else {
            return new Promise((resolve: any) => {
                if (data) {
                    if (!proxy.clientSideRendering) {
                        proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.exportFormFields, data);
                    }
                    if (isObject) {
                        const annotationJson: any = decodeURIComponent(escape(atob(data.split(',')[1])));
                        resolve(annotationJson);
                        proxy.pdfViewer.fireFormExportSuccess(annotationJson, proxy.pdfViewer.fileName);
                    } else if (data && (typeof data !== 'string')) {
                        const blobUrl: any = new Blob([data], { type: 'application/json' });
                        if (Browser.isIE || Browser.info.name === 'edge') {
                            window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.fileName.split('.')[0] + '.json');
                        } else if (jsonObject.formFieldDataFormat === 'Json' || jsonObject.formFieldDataFormat === 'Fdf' || jsonObject.formFieldDataFormat === 'Xfdf' || jsonObject.formFieldDataFormat === 'Xml') {
                            proxy.downloadExportFormat(blobUrl, null, formFieldDataFormat, true);
                        }
                    }
                }
            });
        }
    }

    /**
     * @param {string} fileName - Gets the name of the file name for slicing the last index
     * @param {string} sliceBy - A type to slice the file name; example (".", "_")
     * @private
     * @returns {string} - string
     */
    public getLastIndexValue(fileName: string, sliceBy: string): string {
        const indexName: string = fileName.slice(fileName.lastIndexOf(sliceBy) + 1);
        return indexName;
    }

    /**
     * @param {any} source - It describes about the source
     * @param {FormFieldDataFormat} formFieldDataFormat - It describes about the form field data format
     * @private
     * @returns {void}
     */
    public createRequestForImportingFormfields(source: any, formFieldDataFormat: FormFieldDataFormat): void {
        let proxy: PdfViewerBase = null;
        const index: string = '.';
        // eslint-disable-next-line
        proxy = this;
        let jsonObject: any = {};
        const sourceName: string = this.getLastIndexValue(source, index);
        if (typeof source !== 'object' && (sourceName === 'json' || sourceName === 'fdf' || sourceName === 'xfdf' || sourceName === 'xml')) {
            jsonObject.data = source;
            jsonObject['fileName'] = proxy.pdfViewer.fileName;
            jsonObject.formFieldDataFormat = formFieldDataFormat;
        }
        else {
            jsonObject.formFieldDataFormat = formFieldDataFormat;
            if (formFieldDataFormat === 'Json') {
                jsonObject.data = JSON.stringify(source);
            }
            else {
                jsonObject.data = source;
            }
        }
        proxy.pdfViewer.fireFormImportStarted(source);
        jsonObject['hashId'] = proxy.hashId;
        jsonObject['elementId'] = this.pdfViewer.element.id;
        if (proxy.jsonDocumentId) {
            (jsonObject as any).document = proxy.jsonDocumentId;
        }
        jsonObject = Object.assign(jsonObject, this.constructJsonDownload());
        jsonObject.action = 'ImportFormFields';
        const url: string = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.importFormFields;
        proxy.importFormFieldsRequestHandler = new AjaxHandler(this.pdfViewer);
        proxy.importFormFieldsRequestHandler.url = url;
        proxy.importFormFieldsRequestHandler.mode = true;
        proxy.importFormFieldsRequestHandler.responseType = 'text';
        if (!proxy.clientSideRendering) {
            proxy.importFormFieldsRequestHandler.send(jsonObject);
        } else {
            const resultData: any = proxy.pdfViewer.pdfRendererModule.importFormFields(jsonObject);
            this.importClientSideFormFields(resultData, source);
        }

        proxy.importFormFieldsRequestHandler.onSuccess = function (result: any): void {
            let data: any = result.data;
            const redirect: boolean = proxy.checkRedirection(data);
            if (!redirect) {
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
                            if (isBlazor()) {
                                const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_FileNotFound');
                                promise.then((value: string) => {
                                    proxy.openImportExportNotificationPopup(value);
                                });
                            } else {
                                proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('File not found'));
                            }
                            proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.importFormFields);
                            data = null;
                        }
                    }
                    proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.importFormFields, data);
                    proxy.pdfViewer.fireFormImportSuccess(source);
                    PdfViewerBase.sessionStorageManager.removeItem(this.documentId + '_formfields');
                    if (this.pdfViewer.formFieldsModule) {
                        this.pdfViewer.formFieldsModule.removeExistingFormFields();
                    }
                    PdfViewerBase.sessionStorageManager.removeItem(this.documentId + '_formDesigner');
                    proxy.saveFormfieldsData(data);
                    for (let i: number = 0; i < proxy.renderedPagesList.length; i++) {
                        if (this.pdfViewer.formFieldsModule) {
                            this.pdfViewer.formFieldsModule.renderFormFields(proxy.renderedPagesList[parseInt(i.toString(), 10)], true);
                        }
                    }
                } else {
                    proxy.pdfViewer.fireFormImportFailed(source, result.statusText);
                    if (isBlazor()) {
                        const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_FileNotFound');
                        promise.then((value: string) => {
                            proxy.openImportExportNotificationPopup(value);
                        });
                    } else {
                        proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('File not found'));
                    }
                }
            }
        };

        proxy.importFormFieldsRequestHandler.onFailure = function (result: any): void {
            proxy.pdfViewer.fireFormImportFailed(source, result.statusText);
        };
        proxy.importFormFieldsRequestHandler.onError = function (result: any): void {
            proxy.pdfViewer.fireFormImportFailed(source, result.statusText);
        };
    }

    private importClientSideFormFields(result: any, source: any): void {
        if (!isNullOrUndefined(result)) {
            this.pdfViewer.fireFormImportSuccess(source);
            this.pdfViewer.viewerBase.existingFieldImport = false;
            PdfViewerBase.sessionStorageManager.removeItem(this.documentId + '_formfields');
            if (this.pdfViewer.formFieldsModule) {
                this.pdfViewer.formFieldsModule.removeExistingFormFields();
            }
            PdfViewerBase.sessionStorageManager.removeItem(this.documentId + '_formDesigner');
            this.saveFormfieldsData(result);
            for (let i: number = 0; i < this.renderedPagesList.length; i++) {
                if (this.pdfViewer.formFieldsModule) {
                    this.pdfViewer.formFieldsModule.renderFormFields(this.renderedPagesList[parseInt(i.toString(), 10)], true);
                }
            }
        } else {
            this.pdfViewer.fireFormImportFailed(source, null);
            this.openImportExportNotificationPopup(this.pdfViewer.localeObj.getConstant('File not found'));
        }
    }

    /**
     * @public
     * @returns {any} - Returns the Json data.
     */
    public createFormfieldsJsonData(): any {
        const jsonObject: any = {};
        if (this.pdfViewer.formDesignerModule) {
            const fieldsData: string = this.pdfViewer.formDesignerModule.downloadFormDesigner();

            jsonObject['formDesigner'] = fieldsData;
        } else if (this.pdfViewer.formFieldsModule) {
            const fieldsData: string = this.pdfViewer.formFieldsModule.downloadFormFieldsData();

            jsonObject['fieldsData'] = fieldsData;
        }
        return jsonObject;
    }

    private constructJsonDownload(): any {
        const jsonObject: any = { hashId: this.hashId };
        if (this.jsonDocumentId) {
            jsonObject.documentId = this.jsonDocumentId;
        }
        jsonObject.uniqueId = this.documentId;
        this.importPageList = [];
        if (this.pdfViewer.annotationModule) {
            this.saveImportedAnnotations();
        }
        if (this.isTextMarkupAnnotationModule()) {
            this.isJsonExported = false;
            const textMarkupAnnotationCollection: string =
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.saveTextMarkupAnnotations();
            jsonObject['textMarkupAnnotations'] = textMarkupAnnotationCollection;
        }
        if (this.isShapeAnnotationModule()) {
            this.isJsonExported = false;
            const shapeAnnotations: string = this.pdfViewer.annotationModule.shapeAnnotationModule.saveShapeAnnotations();
            jsonObject['shapeAnnotations'] = shapeAnnotations;
        }
        if (this.isCalibrateAnnotationModule()) {
            this.isJsonExported = false;
            const calibrateAnnotations: string = this.pdfViewer.annotationModule.measureAnnotationModule.saveMeasureShapeAnnotations();
            jsonObject['measureShapeAnnotations'] = calibrateAnnotations;
        }
        if (this.isStampAnnotationModule()) {
            const stampAnnotationCollection: string = this.pdfViewer.annotationModule.stampAnnotationModule.saveStampAnnotations();
            jsonObject['stampAnnotations'] = stampAnnotationCollection;
        }
        if (this.isCommentAnnotationModule()) {
            const stickyAnnotationCollection: string = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.saveStickyAnnotations();
            jsonObject['stickyNotesAnnotation'] = stickyAnnotationCollection;
        }
        if (this.isImportAction) {
            const importList: string = JSON.stringify(this.importPageList);
            jsonObject['importPageList'] = importList;
        }
        if (this.pdfViewer.formDesignerModule) {
            const fieldsData: string = this.pdfViewer.formDesignerModule.downloadFormDesigner();
            jsonObject['formDesigner'] = fieldsData;
        }
        if (this.pdfViewer.formFieldsModule && isNullOrUndefined(jsonObject['formDesigner'])) {
            const fieldsData: string = this.pdfViewer.formFieldsModule.downloadFormFieldsData();
            jsonObject['fieldsData'] = fieldsData;
        }
        const signatureData: string = this.signatureModule.saveSignature();
        jsonObject['signatureData'] = signatureData;
        if (this.pdfViewer.isSignatureEditable) {
            jsonObject['isSignatureEdited'] = this.pdfViewer.isSignatureEditable;
        }
        if (this.isFreeTextAnnotationModule()) {
            const freeTextAnnotationCollection: string = this.pdfViewer.annotationModule.freeTextAnnotationModule.saveFreeTextAnnotations();
            jsonObject['freeTextAnnotation'] = freeTextAnnotationCollection;
        }
        if (this.isInkAnnotationModule()) {
            const inkSignatureData: string = this.pdfViewer.annotationModule.inkAnnotationModule.saveInkSignature();
            jsonObject['inkSignatureData'] = inkSignatureData;
        }
        jsonObject['action'] = 'Download';
        jsonObject['elementId'] = this.pdfViewer.element.id;
        if (this.pdfViewer.annotationModule) {
            const annotationsPageList: any = this.getAnnotationsPageList();
            jsonObject['isAnnotationsExist'] = this.isAnnotationsExist(jsonObject['textMarkupAnnotations']) || this.isAnnotationsExist(jsonObject['shapeAnnotations']) || this.isAnnotationsExist(jsonObject['measureShapeAnnotations']) || this.isAnnotationsExist(jsonObject['stampAnnotations']) || this.isAnnotationsExist(jsonObject['stickyNotesAnnotation']) || this.isAnnotationsExist(jsonObject['signatureData']) || this.isAnnotationsExist(jsonObject['freeTextAnnotation']) || this.isAnnotationsExist(jsonObject['inkSignatureData']) || annotationsPageList.length > 0;
            jsonObject['annotationsPageList'] = JSON.stringify(annotationsPageList);
        }
        if (this.pdfViewer.formDesignerModule || this.pdfViewer.formFieldsModule) {
            const formFieldsPageList: any = this.getFormFieldsPageList(jsonObject['formDesigner']);
            jsonObject['isFormFieldAnnotationsExist'] = this.isAnnotationsExist(jsonObject['formDesigner']) || this.isFieldsDataExist(jsonObject['fieldsData']) || formFieldsPageList.length > 0;
            jsonObject['formFieldsPageList'] = JSON.stringify(formFieldsPageList);
        }
        if (this.pdfViewer.annotationCollection) {
            jsonObject['annotationCollection'] = JSON.stringify(this.pdfViewer.annotationCollection);
        }
        return jsonObject;
    }

    /**
     * @param {string} annotationInfo - It describes about the annotation info
     * @private
     * @returns {boolean} - Returns whether annotation is present.
     */
    private isAnnotationsExist(annotationInfo: string): boolean {
        return !isNullOrUndefined(annotationInfo) ? JSON.parse(annotationInfo).flat(1).length > 0 : false;
    }

    /**
     * @param {string} fieldsData - It describes about the fields data
     * @private
     * @returns {boolean} - Returns whether fields data is present.
     */
    private isFieldsDataExist(fieldsData: string): boolean {
        return !isNullOrUndefined(fieldsData) ? (<any>Object).entries(JSON.parse(fieldsData)).length !== 0 : false;
    }

    /**
     * @private
     * @returns {boolean} - Returns annotations page number list.
     */
    private getAnnotationsPageList(): any {
        const annotCollection: any[] = this.pdfViewer.annotationCollection.map((a: any) => a.pageNumber);
        const annotActionCollection: number[] = this.pdfViewer.annotationModule.actionCollection.filter((value: any) => value.annotation.propName !== 'formFields' && isNullOrUndefined(value.annotation.formFieldAnnotationType)).map((a: any) => a.pageIndex);
        const fullPageList: any[] = annotCollection.concat(annotActionCollection, this.modifiedPageIndex);
        return fullPageList.filter((value: any, index: number, self: any[]) => self.indexOf(value) === index && value !== undefined);
    }

    /**
     * @param {string} formDesignerData - It describes about the form designer data
     * @private
     * @returns {boolean} - Returns form fields page number list.
     */
    private getFormFieldsPageList(formDesignerData: string): any {
        const formFieldsCollection: any[] = this.pdfViewer.formFieldCollection.map(function (item: any): any {
            if (!isNullOrUndefined(item.properties)) {
                return item.properties.pageNumber;
            } else {
                return item.pageNumber + 1;
            }
        });
        const annotActionCollection: any[] = !isNullOrUndefined(this.pdfViewer.annotationModule) ? this.pdfViewer.annotationModule.actionCollection.filter((value: any) => value.annotation.propName === 'formFields' || !isNullOrUndefined(value.annotation.formFieldAnnotationType) || !isNullOrUndefined(value.annotation.type)).map((a: any) => a.pageIndex) : [];
        const fullPageList: any[] = formFieldsCollection.concat(annotActionCollection);
        let designerDataList: any;
        if (!isNullOrUndefined(formDesignerData)) {
            designerDataList = JSON.parse(formDesignerData).map(function (item: any): any {
                return item.FormField.pageNumber;
            });
        }
        const totalPageList: any[] = fullPageList.concat(designerDataList);
        return totalPageList.filter((value: any, index: number, self: any[]) => self.indexOf(value) === index && !isNullOrUndefined(value));
    }

    /**
     * @private
     * @param {string} annotationID - The annotationID.
     * @returns {any} - Returns collection of type.
     */
    public checkFormFieldCollection(annotationID: string): boolean {
        let isFormFieldAnnotation: boolean = false;
        let formDesignerData: any = null;
        formDesignerData = this.getItemFromSessionStorage('_formDesigner');
        if (formDesignerData) {
            const formFieldsData: any = JSON.parse(formDesignerData);
            for (let i: number = 0; i < formFieldsData.length; i++) {
                if (formFieldsData[parseInt(i.toString(), 10)].FormField.formFieldAnnotationType === 'RadioButton') {
                    for (let j: number = 0; j < formFieldsData[parseInt(i.toString(), 10)].FormField.radiobuttonItem.length; j++) {
                        if (annotationID === formFieldsData[parseInt(i.toString(), 10)].FormField.radiobuttonItem[parseInt(j.toString(), 10)].id.split('_')[0]) {
                            isFormFieldAnnotation = true;
                            break;
                        }
                    }
                } else if (formFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0] === annotationID) {
                    isFormFieldAnnotation = true;
                    break;
                }
            }
        }
        return isFormFieldAnnotation;
    }

    /**
     * @private
     * @returns {boolean} - Returns whether freetext module is enabled.
     */
    public isFreeTextAnnotationModule(): boolean {
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

    private createRequestForDownload(): void {
        let proxy: PdfViewerBase = null;
        // eslint-disable-next-line
        proxy = this;
        let canDownload: boolean = false;
        canDownload = proxy.pdfViewer.fireDownloadStart(proxy.downloadFileName);
        if (canDownload) {
            const jsonObject: any = this.constructJsonDownload();
            const digitalSignature: boolean = proxy.clientSideRendering ? proxy.isDigitalSignaturePresent :
                (proxy.digitalSignaturePages && proxy.digitalSignaturePages.length !== 0);
            if (digitalSignature) {
                if (proxy.pdfViewer.isDocumentEdited) {
                    jsonObject['digitalSignatureDocumentEdited'] = true;
                } else {
                    jsonObject['digitalSignatureDocumentEdited'] = false;
                }
            }
            if (proxy.pdfViewer.isDocumentEdited || (!isNullOrUndefined(proxy.pdfViewer.pageOrganizer) &&
            proxy.pdfViewer.pageOrganizer.isDocumentModified)) {
                jsonObject['isPdfEdited'] = true;
            }
            else {
                jsonObject['isPdfEdited'] = false;
            }
            if (!isNullOrUndefined(this.pdfViewer.pageOrganizer) &&
            !isNullOrUndefined(this.pdfViewer.pageOrganizer.organizePagesCollection) && this.pdfViewer.pageOrganizer.isDocumentModified) {
                jsonObject['organizePages'] = JSON.stringify(this.pdfViewer.pageOrganizer.organizePagesCollection);
            }
            this.dowonloadRequestHandler = new AjaxHandler(this.pdfViewer);
            this.dowonloadRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.download;
            this.dowonloadRequestHandler.responseType = 'text';
            if (this.validateForm && this.pdfViewer.enableFormFieldsValidation) {
                this.pdfViewer.fireValidatedFailed(proxy.pdfViewer.serverActionSettings.download);
                this.validateForm = false;
            }
            else if (!this.clientSideRendering) {
                this.dowonloadRequestHandler.send(jsonObject);
            }
            else {
                const data: Uint8Array = this.pdfViewer.pdfRendererModule.getDocumentAsBase64(jsonObject);
                this.fileDownload(data, this);
            }
            this.dowonloadRequestHandler.onSuccess = function (result: any): void {
                const data: any = result.data;
                const redirect: boolean = proxy.checkRedirection(data);
                if (!redirect) {
                    if (data) {
                        proxy.fileDownload(data, proxy);
                    } else {
                        proxy.pdfViewer.fireDownloadEnd(proxy.downloadFileName, 'PDF Document saved in server side successfully');
                    }
                }
            };
            this.dowonloadRequestHandler.onFailure = function (result: any): void {
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
            };
            this.dowonloadRequestHandler.onError = function (result: any): void {
                proxy.openNotificationPopup();
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
            };
        }
    }

    /**
     * @param {string} data - It describes about the download file data
     * @param {PdfViewerBase} proxy - It describes about the current instance
     * @param {boolean} isOrganizeSaveAsRequest - It describes about the request is from Organize PDF window
     * @private
     * @returns {void}
     */
    public fileDownload(data: any, proxy: PdfViewerBase, isOrganizeSaveAsRequest: boolean = false): void {
        if (!this.clientSideRendering) {
            if (data) {
                if (typeof data !== 'object' && data.indexOf('data:application/pdf') === -1) {
                    proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.download);
                    data = null;
                }
                if (typeof data === 'object') {
                    data = JSON.parse(data);
                }
                if (data) {
                    if (proxy.pdfViewer.downloadFileName && (proxy.pdfViewer.downloadFileName !== proxy.downloadFileName)) {
                        proxy.downloadFileName = proxy.pdfViewer.downloadFileName;
                    }
                    if (this.pdfViewer.enableHtmlSanitizer && proxy.pdfViewer.downloadFileName) {
                        proxy.pdfViewer.downloadFileName = SanitizeHtmlHelper.sanitize(proxy.pdfViewer.downloadFileName);
                    }
                    if (!isOrganizeSaveAsRequest) {
                        proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.download, data);
                    }
                    const blobUrl: string = proxy.createBlobUrl(data.split('base64,')[1], 'application/pdf');
                    if (Browser.isIE || Browser.info.name === 'edge') {
                        window.navigator.msSaveOrOpenBlob(blobUrl, proxy.downloadFileName);
                    } else {
                        proxy.downloadDocument(blobUrl);
                    }
                    if (!isOrganizeSaveAsRequest) {
                        proxy.pdfViewer.fireDownloadEnd(proxy.downloadFileName, data);
                    }
                }
                if (!isOrganizeSaveAsRequest) {
                    proxy.updateDocumentAnnotationCollections();
                }
            }
        } else {
            if (data) {
                if (typeof data !== 'object') {
                    proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.download);
                    data = null;
                }
                if (data) {
                    if (proxy.pdfViewer.downloadFileName && (proxy.pdfViewer.downloadFileName !== proxy.downloadFileName)) {
                        proxy.downloadFileName = proxy.pdfViewer.downloadFileName;
                    }
                    if (this.pdfViewer.enableHtmlSanitizer && proxy.pdfViewer.downloadFileName) {
                        proxy.pdfViewer.downloadFileName = SanitizeHtmlHelper.sanitize(proxy.pdfViewer.downloadFileName);
                    }
                    if (proxy.clientSideRendering && !isOrganizeSaveAsRequest) {
                        proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.download, data);
                    }
                    const blobUrl: any = new Blob([data], { type: 'application/pdf' });
                    if (Browser.isIE || Browser.info.name === 'edge') {
                        window.navigator.msSaveOrOpenBlob(blobUrl, proxy.downloadFileName);
                    } else {
                        proxy.downloadDocument(blobUrl);
                    }
                    if (!isOrganizeSaveAsRequest) {
                        proxy.pdfViewer.fireDownloadEnd(proxy.downloadFileName, data);
                    }
                }
                if (!isOrganizeSaveAsRequest) {
                    proxy.updateDocumentAnnotationCollections();
                }
            }
        }
    }

    /**
     * @param {any} pageWidth - It describes about the page width
     * @param {any} pageHeight - It describes about the page height
     * @private
     * @returns {number} - number
     */
    public getTileCount(pageWidth: any, pageHeight: any): number {
        if (pageWidth && typeof pageWidth === 'number') {
            const defaultWidth: number = 816;
            let tileCount: number = 1;
            if (this.getZoomFactor() > 2 && pageWidth <= 1200) {
                tileCount = 2;
            } else {
                tileCount = pageWidth / defaultWidth;
            }
            const tileValue: number = Math.ceil(tileCount);
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
        let proxy: PdfViewerBase = null;
        // eslint-disable-next-line
        proxy = this;
        let jsonData: any;
        const canvas: HTMLElement = proxy.getElement('_pageCanvas_' + pageIndex);
        const oldCanvas: HTMLElement = proxy.getElement('_oldCanvas_' + pageIndex);
        if (this.pageSize && this.pageSize[parseInt(pageIndex.toString(), 10)]) {
            const pageWidth: number = this.pageSize[parseInt(pageIndex.toString(), 10)].width;
            const pageHeight: number = this.pageSize[parseInt(pageIndex.toString(), 10)].height;
            const tilecanvas: HTMLCanvasElement = this.getElement('_pageCanvas_' + pageIndex) as HTMLCanvasElement;
            let viewPortWidth: any = 1200; // On diving the value greater than 1200 we will get the tile count as 2.
            let viewPortHeight: any = proxy.pdfViewer.element.clientHeight > 0 ?
                proxy.pdfViewer.element.clientHeight : proxy.pdfViewer.element.style.height;
            viewPortWidth = parseInt(viewPortWidth, 10);
            viewPortHeight = parseInt(viewPortHeight, 10) ? parseInt(viewPortHeight, 10) : 500; //we have applied minimum-height as 500.
            let noTileX: number;
            let noTileY: number;
            let imageSource: string;
            const object: Object = new Object();
            const thumbnailImageElement: HTMLImageElement = document.getElementById(this.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageIndex) as HTMLImageElement;
            if (this.isMinimumZoom && thumbnailImageElement && thumbnailImageElement.children[0] as HTMLImageElement && !isNullOrUndefined((thumbnailImageElement.children[0] as HTMLImageElement).src) && (thumbnailImageElement.children[0] as HTMLImageElement).src !== '') {
                if ((viewPortWidth >= pageWidth)) {
                    this.renderThumbnailImages = true;
                    imageSource = (thumbnailImageElement.children[0] as HTMLImageElement).src;
                }
            } else {
                this.renderThumbnailImages = false;
            }
            const tileCount: number = this.getTileCount(pageWidth, pageHeight);
            if (canvas) {
                if (!isNaN(parseFloat(canvas.style.width)) || oldCanvas) {
                    if (proxy.isInitialLoaded) {
                        proxy.showPageLoadingIndicator(pageIndex, false);
                    }
                }
                let data: any = proxy.getStoredData(pageIndex);
                noTileX = noTileY = tileCount;
                const tileSettings: TileRenderingSettingsModel = proxy.pdfViewer.tileRenderingSettings;
                if (tileSettings.enableTileRendering && tileSettings.x > 0 && tileSettings.y > 0) {
                    if ((viewPortWidth < pageWidth || this.getZoomFactor() > 2)) {
                        noTileX = tileSettings.x;
                        noTileY = tileSettings.y;
                    }
                }
                proxy.tileRequestCount = noTileX * noTileY;
                const zoomFactor: number = this.retrieveCurrentZoomFactor();
                let isPageRequestSent: boolean;
                if (tileCount === 1) {
                    data = proxy.getStoredData(pageIndex);
                    isPageRequestSent = proxy.pageRequestSent(pageIndex, 0, 0);
                } else {
                    const tileData: any = JSON.parse(proxy.getWindowSessionStorageTile(pageIndex, 0, 0, zoomFactor));
                    if (tileCount > 1) {
                        data = tileData;
                    }
                }
                if (data && data.uniqueId === proxy.documentId && (data['image'] || this.isMinimumZoom)) {
                    canvas.style.backgroundColor = '#fff';
                    if ((proxy.pdfViewer.magnification && proxy.pdfViewer.magnification.isPinchZoomed) ||
                    !this.pageSize[parseInt(pageIndex.toString(), 10)]) {
                        return;
                    }
                    const zoomFactor: number = this.retrieveCurrentZoomFactor();
                    if (zoomFactor > 2 && pageWidth <= 1200) {
                        viewPortWidth = 700;
                    } else {
                        viewPortWidth = 1200;
                    }
                    if (!proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                        viewPortWidth = 1200;
                    }
                    if (((viewPortWidth >= pageWidth) || !proxy.pdfViewer.tileRenderingSettings.enableTileRendering) &&
                            (tileCount === 1)) {
                        if (this.renderThumbnailImages && tileCount === 1) {
                            proxy.renderPage(data, pageIndex, imageSource);
                        } else {
                            proxy.renderPage(data, pageIndex);
                        }
                    } else {
                        proxy.isTileImageRendered = true;
                        proxy.tileRenderCount = 0;
                        if (this.renderThumbnailImages && tileCount === 1) {
                            proxy.renderPage(data, pageIndex, imageSource);
                        } else {
                            proxy.tileRenderPage(data, pageIndex);
                            for (let k: number = 0; k < noTileX; k++) {
                                for (let l: number = 0; l < noTileY; l++) {
                                    if (k === 0 && l === 0) {
                                        continue;
                                    }
                                    data = this.clientSideRendering ?
                                        JSON.parse(this.getStoredTileImageDetails(pageIndex, k, l, zoomFactor)) :
                                        JSON.parse(this.getWindowSessionStorageTile(pageIndex, k, l, zoomFactor));
                                    if (data) {
                                        proxy.tileRenderPage(data, pageIndex);
                                    }
                                }
                            }
                        }
                    }
                    data = null;
                } else if (data === null || !isPageRequestSent) {
                    if (!this.renderThumbnailImages) {
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
                    }
                    if (proxy.pdfViewer.magnification && proxy.pdfViewer.magnification.isPinchZoomed) {
                        return;
                    }
                    if (!proxy.pdfViewer.tileRenderingSettings.enableTileRendering || this.renderThumbnailImages) {
                        noTileX = 1;
                        noTileY = 1;
                    }
                    proxy.tileRenderCount = 0;
                    proxy.isTileImageRendered = true;
                    for (let x: number = 0; x < noTileX; x++) {
                        for (let y: number = 0; y < noTileY; y++) {
                            let jsonObject: object = null;
                            const zoomFactor: number = this.retrieveCurrentZoomFactor();
                            if (zoomFactor > 2 && pageWidth <= 1200) {
                                viewPortWidth = 700;
                            } else {
                                viewPortWidth = 1200;
                            }
                            if (!proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                                viewPortWidth = 1200;
                            }
                            if (this.renderThumbnailImages && !this.clientSideRendering) {
                                proxy.renderPage(object, pageIndex, imageSource);
                                if (this.textrequestLists.indexOf(pageIndex) === -1) {
                                    jsonObject = { pageStartIndex: pageIndex, pageEndIndex: pageIndex + 1, documentId: proxy.getDocumentId(), hashId: proxy.hashId, action: 'RenderPdfTexts', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.documentId };
                                    if (this.jsonDocumentId) {
                                        (jsonObject as any).documentId = this.jsonDocumentId;
                                    }
                                    this.textRequestHandler = new AjaxHandler(this.pdfViewer);
                                    this.textRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderTexts;
                                    this.textRequestHandler.responseType = 'json';
                                    if (!this.clientSideRendering) {
                                        jsonData = JSON.parse(JSON.stringify(jsonObject));
                                        jsonData.action = 'pageRenderInitiate';
                                        proxy.pdfViewer.firePageRenderInitiate(jsonData);
                                        this.textRequestHandler.send(jsonObject);
                                    }
                                    this.textrequestLists.push(pageIndex);
                                    proxy.textRequestHandler.onSuccess = function (result: any): void {
                                        if ((proxy.pdfViewer.magnification && proxy.pdfViewer.magnification.isPinchZoomed) ||
                                        !proxy.pageSize[parseInt(pageIndex.toString(), 10)]) {
                                            return;
                                        }
                                        let data: any = result.data;
                                        if (data) {
                                            if (typeof data !== 'object') {
                                                try {
                                                    data = JSON.parse(data);
                                                } catch (error) {
                                                    proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.renderTexts);
                                                    data = null;
                                                }
                                            }
                                        }
                                        if (data) {
                                            proxy.pageTextRequestOnSuccess(data, proxy, pageIndex);
                                        }
                                    };
                                    this.textRequestHandler.onFailure = function (result: any): void {
                                        proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText,
                                                                              proxy.pdfViewer.serverActionSettings.renderTexts);
                                    };
                                    this.textRequestHandler.onError = function (result: any): void {
                                        proxy.openNotificationPopup();
                                        proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText,
                                                                              proxy.pdfViewer.serverActionSettings.renderTexts);
                                    };
                                    if (this.clientSideRendering) {
                                        const requestType: string = 'pageTextRequest';
                                        this.pdfViewer.pdfRendererModule.getDocumentText(jsonObject, requestType);
                                    }
                                }
                            } else {
                                jsonObject = {
                                    xCoordinate: (x).toString(), yCoordinate: (y).toString(),
                                    viewPortWidth: (viewPortWidth).toString(), viewPortHeight: (viewPortHeight).toString(),
                                    pageNumber: (pageIndex).toString(), hashId: proxy.hashId, tilecount: (tileCount).toString(),
                                    tileXCount: (noTileX).toString(), tileYCount: (noTileY).toString(),
                                    zoomFactor: (zoomFactor).toString(), action: 'RenderPdfPages', uniqueId: this.documentId, elementId: proxy.pdfViewer.element.id, digitalSignaturePresent: proxy.digitalSignaturePresent(pageIndex)
                                };
                                if (this.jsonDocumentId) {

                                    (jsonObject as any).documentId = this.jsonDocumentId;
                                }
                                proxy.pageRequestHandler = new AjaxHandler(this.pdfViewer);
                                proxy.pageRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.renderPages;
                                proxy.pageRequestHandler.responseType = 'json';
                                if (!isNullOrUndefined(proxy.hashId)) {
                                    // eslint-disable-next-line
                                    if ((jsonObject as any).xCoordinate == 0 && (jsonObject as any).yCoordinate == 0) {
                                        jsonData = JSON.parse(JSON.stringify(jsonObject));
                                        jsonData.action = 'pageRenderInitiate';
                                        if (!this.clientSideRendering) {
                                            proxy.pdfViewer.firePageRenderInitiate(jsonData);
                                        }
                                    }
                                    this.requestCollection.push(this.pageRequestHandler);
                                    if (!this.clientSideRendering) {
                                        proxy.pageRequestHandler.send(jsonObject);
                                    }
                                }
                                proxy.requestLists.push(proxy.documentId + '_' + pageIndex + '_' + x + '_' + y + '_' + zoomFactor);
                                proxy.pageRequestHandler.onSuccess = function (result: any): void {
                                    if ((proxy.pdfViewer.magnification && proxy.pdfViewer.magnification.isPinchZoomed) ||
                                    !proxy.pageSize[parseInt(pageIndex.toString(), 10)]) {
                                        return;
                                    }
                                    let data: any = result.data;
                                    const redirect: boolean = proxy.checkRedirection(data);
                                    if (redirect) {
                                        proxy.showLoadingIndicator(false);
                                    }
                                    else {
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
                                            proxy.pageRequestOnSuccess(data, proxy, viewPortWidth, pageWidth, pageIndex);
                                        }
                                    }
                                };
                                this.pageRequestHandler.onFailure = function (result: any): void {
                                    proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText,
                                                                          proxy.pdfViewer.serverActionSettings.renderPages);
                                };
                                this.pageRequestHandler.onError = function (result: any): void {
                                    proxy.openNotificationPopup();
                                    proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText,
                                                                          proxy.pdfViewer.serverActionSettings.renderPages);
                                };
                                if (this.clientSideRendering) {
                                    const textDetailsId: string = proxy.documentId + '_' + pageIndex + '_textDetails';
                                    const isTextNeed: boolean = proxy.pageTextDetails ? proxy.pageTextDetails[`${textDetailsId}`] ? false : true : true;
                                    const currentPage: PdfPage = this.pdfViewer.pdfRenderer.loadedDocument.getPage(pageIndex);
                                    const cropBoxRect: Rect = new Rect(0, 0, 0, 0);
                                    const mediaBoxRect: Rect = new Rect(0, 0, 0, 0);
                                    if (currentPage && currentPage._pageDictionary && currentPage._pageDictionary._map &&
                                         currentPage._pageDictionary._map.CropBox) {
                                        [cropBoxRect.x, cropBoxRect.y, cropBoxRect.width, cropBoxRect.height] =
                                         currentPage._pageDictionary._map.CropBox;
                                    }
                                    if (currentPage && currentPage._pageDictionary && currentPage._pageDictionary._map &&
                                         currentPage._pageDictionary._map.MediaBox) {
                                        [mediaBoxRect.x, mediaBoxRect.y, mediaBoxRect.width, mediaBoxRect.height] =
                                        currentPage._pageDictionary._map.MediaBox;
                                    }
                                    if (viewPortWidth >= pageWidth || !proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                                        jsonData = JSON.parse(JSON.stringify(jsonObject));
                                        jsonData.action = 'pageRenderInitiate';
                                        proxy.pdfViewer.firePageRenderInitiate(jsonData);
                                        this.pdfViewerRunner.addTask({ pageIndex: pageIndex, message: 'renderPage', zoomFactor: zoomFactor, isTextNeed: isTextNeed, textDetailsId: textDetailsId, cropBoxRect: cropBoxRect, mediaBoxRect: mediaBoxRect }, TaskPriorityLevel.High);
                                    }
                                    else {
                                        this.showPageLoadingIndicator(pageIndex, true);
                                        // eslint-disable-next-line
                                        if ((jsonObject as any).xCoordinate == 0 && (jsonObject as any).yCoordinate == 0) {
                                            jsonData = JSON.parse(JSON.stringify(jsonObject));
                                            jsonData.action = 'pageRenderInitiate';
                                            proxy.pdfViewer.firePageRenderInitiate(jsonData);
                                        }
                                        this.pdfViewerRunner.addTask({
                                            pageIndex: pageIndex,
                                            message: 'renderImageAsTile',
                                            zoomFactor: zoomFactor,
                                            tileX: x,
                                            tileY: y,
                                            tileXCount: noTileX,
                                            tileYCount: noTileY,
                                            isTextNeed: isTextNeed,
                                            textDetailsId: textDetailsId,
                                            cropBoxRect: cropBoxRect,
                                            mediaBoxRect: mediaBoxRect
                                        }, TaskPriorityLevel.High);
                                    }
                                    this.pdfViewerRunner.onMessage('imageRendered,renderTileImage,renderThumbnail,renderPreviewTileImage,printImage,textSearched', function (event: any): void {
                                        switch (event.data.message) {
                                        case 'imageRendered':
                                            if (event.data.message === 'imageRendered') {
                                                const canvas: HTMLCanvasElement = document.createElement('canvas');
                                                const { value, width, height, pageIndex } = event.data;
                                                canvas.width = width;
                                                canvas.height = height;
                                                const canvasContext: CanvasRenderingContext2D = canvas.getContext('2d');
                                                const imageData: ImageData = canvasContext.createImageData(width, height);
                                                imageData.data.set(value);
                                                canvasContext.putImageData(imageData, 0, 0);
                                                const imageUrl: string = canvas.toDataURL();
                                                proxy.releaseCanvas(canvas);
                                                const textBounds: any = event.data.textBounds;
                                                const textContent: any = event.data.textContent;
                                                const pageText: any = event.data.pageText;
                                                const rotation: any = event.data.rotation;
                                                const characterBounds: any = event.data.characterBounds;
                                                const hyperlinksDetails: any = proxy.pdfViewer.pdfRendererModule.getHyperlinks(pageIndex);
                                                const data: any = ({ image: imageUrl, pageNumber: pageIndex,
                                                    uniqueId: proxy.documentId, pageWidth: event.data.pageWidth,
                                                    zoomFactor: event.data.zoomFactor, hyperlinks: hyperlinksDetails.hyperlinks,
                                                    hyperlinkBounds: hyperlinksDetails.hyperlinkBounds,
                                                    linkAnnotation: hyperlinksDetails.linkAnnotation,
                                                    linkPage: hyperlinksDetails.linkPage,
                                                    annotationLocation: hyperlinksDetails.annotationLocation,
                                                    characterBounds: characterBounds });
                                                if (event.data.isTextNeed) {
                                                    data.textBounds = textBounds;
                                                    data.textContent = textContent;
                                                    data.rotation = rotation;
                                                    data.pageText = pageText;
                                                    proxy.storeTextDetails(pageIndex, textBounds, textContent, pageText, rotation,
                                                                           characterBounds);
                                                } else {
                                                    const textDetails: any = JSON.parse(proxy.pageTextDetails[`${event.data.textDetailsId}`]);
                                                    data.textBounds = textDetails.textBounds;
                                                    data.textContent = textDetails.textContent;
                                                    data.rotation = textDetails.rotation;
                                                    data.pageText = textDetails.pageText;
                                                    data.characterBounds = textDetails.characterBounds;
                                                }
                                                if (data && data.image && !isNullOrUndefined(data.image.split('base64,')[1]) && data.uniqueId === proxy.documentId) {
                                                    const currentPageWidth: number = (data.pageWidth && data.pageWidth > 0) ?
                                                        data.pageWidth : pageWidth;
                                                    proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.
                                                        renderPages, data);
                                                    const pageNumber: number = (data.pageNumber !== undefined) ? data.pageNumber :
                                                        pageIndex;
                                                    const blobObj: string = proxy.createBlobUrl(data.image.split('base64,')[1], 'image/png');
                                                    const Url: any = URL || webkitURL;
                                                    const blobUrl: string = Url.createObjectURL(blobObj);
                                                    const storeObject: any = {
                                                        image: blobUrl, width: data.pageWidth, uniqueId: data.uniqueId,
                                                        zoomFactor: data.zoomFactor
                                                    };
                                                    proxy.storeImageData(pageNumber, storeObject);
                                                    proxy.pageRequestOnSuccess(data, proxy, viewPortWidth, pageWidth, pageIndex);
                                                }
                                            }
                                            break;
                                        case 'renderTileImage':
                                            if (event.data.message === 'renderTileImage') {
                                                const canvas: any = document.createElement('canvas');
                                                const { value, w, h, noTileX, noTileY, x, y, pageIndex } = event.data;
                                                canvas.setAttribute('height', h);
                                                canvas.setAttribute('width', w);
                                                canvas.width = w;
                                                canvas.height = h;
                                                const canvasContext: any = canvas.getContext('2d');
                                                const imageData: any = canvasContext.createImageData(w, h);
                                                imageData.data.set(value);
                                                canvasContext.putImageData(imageData, 0, 0);
                                                const imageUrl: string = canvas.toDataURL();
                                                proxy.releaseCanvas(canvas);
                                                const tileWidth: number = w;
                                                const tileHeight: number = h;
                                                const textBounds: any = event.data.textBounds;
                                                const textContent: any = event.data.textContent;
                                                const pageText: any = event.data.pageText;
                                                const rotation: any = event.data.rotation;
                                                const characterBounds: any = event.data.characterBounds;
                                                let hyperlinksDetails: any;
                                                if (x === 0 && y === 0) {
                                                    hyperlinksDetails = proxy.pdfViewer.pdfRendererModule.getHyperlinks(pageIndex);
                                                }
                                                const tileData: any = {
                                                    image: imageUrl,
                                                    noTileX: noTileX,
                                                    noTileY: noTileY,
                                                    pageNumber: pageIndex,
                                                    tileX: x,
                                                    tileY: y,
                                                    uniqueId: proxy.documentId,
                                                    pageWidth: pageWidth,
                                                    width: tileWidth,
                                                    transformationMatrix: {
                                                        Values: [1, 0, 0, 1, tileWidth * x, tileHeight * y, 0, 0, 0]
                                                    },
                                                    zoomFactor: event.data.zoomFactor,
                                                    characterBounds: characterBounds,
                                                    isTextNeed: event.data.isTextNeed,
                                                    textDetailsId: event.data.textDetailsId,
                                                    textBounds: textBounds,
                                                    textContent: textContent,
                                                    pageText: pageText,
                                                    hyperlinks: hyperlinksDetails && hyperlinksDetails.hyperlinks,
                                                    hyperlinkBounds: hyperlinksDetails && hyperlinksDetails.hyperlinkBounds,
                                                    linkAnnotation: hyperlinksDetails && hyperlinksDetails.linkAnnotation,
                                                    linkPage: hyperlinksDetails && hyperlinksDetails.linkPage
                                                };
                                                if (tileData && tileData.image && tileData.uniqueId === proxy.documentId) {
                                                    const currentPageWidth: number = (tileData.pageWidth && tileData.pageWidth > 0) ?
                                                        tileData.pageWidth : pageWidth;
                                                    proxy.pdfViewer.
                                                        fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.renderPages, tileData);
                                                    const pageNumber: number = (tileData.pageNumber !== undefined) ?
                                                        tileData.pageNumber : pageIndex;
                                                    if (x === 0 && y === 0) {
                                                        const blobObj: string = proxy.createBlobUrl(tileData.image.split('base64,')[1], 'image/png');
                                                        const Url: any = URL || webkitURL;
                                                        const blobUrl: string = Url.createObjectURL(blobObj);
                                                        if (tileData.isTextNeed) {
                                                            tileData.textBounds = textBounds;
                                                            tileData.textContent = textContent;
                                                            tileData.rotation = rotation;
                                                            tileData.pageText = pageText;
                                                            proxy.storeTextDetails(pageIndex, textBounds, textContent, pageText,
                                                                                   rotation, characterBounds);
                                                        } else {
                                                            const textDetails: any = JSON.parse(proxy.pageTextDetails[`${tileData.textDetailsId}`]);
                                                            tileData.textBounds = textDetails.textBounds;
                                                            tileData.textContent = textDetails.textContent;
                                                            tileData.rotation = textDetails.rotation;
                                                            tileData.pageText = textDetails.pageText;
                                                            tileData.characterBounds = textDetails.characterBounds;
                                                        }
                                                        const storeObject: any = {
                                                            image: blobUrl, width: tileData.width, uniqueId: tileData.uniqueId,
                                                            tileX: tileData.tileX, tileY: tileData.tileY,
                                                            zoomFactor: tileData.zoomFactor,
                                                            transformationMatrix: tileData.transformationMatrix,
                                                            pageText: tileData.pageText, textContent: tileData.textContent,
                                                            textBounds: tileData.textBounds
                                                        };
                                                        proxy.storeImageData(pageNumber, storeObject, tileData.tileX, tileData.tileY);
                                                    }
                                                    else {
                                                        const blobObj: string = proxy.createBlobUrl(tileData.image.split('base64,')[1], 'image/png');
                                                        const Url: any = URL || webkitURL;
                                                        const blobUrl: string = Url.createObjectURL(blobObj);
                                                        const storeObject: any = {
                                                            image: blobUrl, width: tileData.width, uniqueId: tileData.uniqueId,
                                                            tileX: tileData.tileX, tileY: tileData.tileY,
                                                            zoomFactor: tileData.zoomFactor,
                                                            transformationMatrix: tileData.transformationMatrix
                                                        };
                                                        proxy.storeImageData(pageNumber, storeObject, tileData.tileX, tileData.tileY);
                                                    }
                                                    proxy.pageRequestOnSuccess(tileData, proxy, viewPortWidth, pageWidth, pageIndex, true);
                                                }
                                            }
                                            break;
                                        case 'renderThumbnail':
                                            if (proxy.clientSideRendering) {
                                                proxy.pdfViewer.thumbnailViewModule.thumbnailOnMessage(event);
                                                if (proxy.pdfViewer.textSearch) {
                                                    proxy.pdfViewer.pdfRendererModule.textExtractionOnmessage(event);
                                                }
                                            }
                                            break;
                                        case 'renderPreviewTileImage':
                                            proxy.pdfViewer.pageOrganizer.previewOnMessage(event);
                                            if (proxy.pdfViewer.textSearch) {
                                                proxy.pdfViewer.pdfRendererModule.textExtractionOnmessage(event);
                                            }
                                            break;
                                        case 'printImage':
                                            proxy.pdfViewer.printModule.printOnMessage(event);
                                            break;
                                        case 'textSearched':
                                            proxy.pdfViewer.textSearchModule.searchTextAfteresult(event.data.resultPages,
                                                                                                  event.data.totalSearchCount,
                                                                                                  event.data.searchWord,
                                                                                                  event.data.matchCase,
                                                                                                  event.data.isRequestsend,
                                                                                                  event.data.isCompletedSearch,
                                                                                                  event.data.endIndex);
                                            break;
                                        }
                                    });
                                }
                            }

                        }
                    }
                }
                if (this.renderedPagesList.indexOf(pageIndex) === -1) {
                    proxy.renderedPagesList.push(pageIndex);
                }
            }
        }
    }

    private pageRequestOnSuccess(data: any, proxy: PdfViewerBase, viewPortWidth: number, pageWidth: number, pageIndex: number,
                                 isTileRender?: boolean): void {
        while (typeof data !== 'object') {
            data = JSON.parse(data);
        }
        if (data.image && data.uniqueId === proxy.documentId) {
            const currentPageWidth: number = (data.pageWidth && data.pageWidth > 0) ? data.pageWidth : pageWidth;
            proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.renderPages, data);
            pageIndex = !isNullOrUndefined(data.pageNumber) ? data.pageNumber : pageIndex;
            // changed the page index to pageNumber. TaskID - 931967
            data.pageNumber = pageIndex + 1;
            if (((viewPortWidth >= currentPageWidth) || !proxy.pdfViewer.tileRenderingSettings.enableTileRendering) && !isTileRender) {
                proxy.storeWinData(data, pageIndex);
            } else {
                proxy.storeWinData(data, pageIndex, data.tileX, data.tileY);
            }
            if (((viewPortWidth >= currentPageWidth) || !proxy.pdfViewer.tileRenderingSettings.enableTileRendering) && !isTileRender) {
                proxy.renderPage(data, pageIndex);
                proxy.pdfViewer.firePageRenderComplete(data);
            } else {
                proxy.tileRenderPage(data, pageIndex);
            }
        }
    }

    /**
     * @param {any} data - It gets the data
     * @param {number} pageIndex - It describes about the page index
     * @private
     * @returns {void}
     */
    public pageTextRequestSuccess(data: any, pageIndex: number): void {
        this.pageTextRequestOnSuccess(data, this , pageIndex);
    }

    private pageTextRequestOnSuccess(data: any, proxy: PdfViewerBase, pageIndex: number): void {
        while (typeof data !== 'object') {
            data = JSON.parse(data);
        }
        if (data.documentTextCollection && data.uniqueId === proxy.documentId) {
            proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.renderTexts, data);
            proxy.pdfViewer.firePageRenderComplete(data);
            const pageNumber: number = (data.pageNumber !== undefined) ? data.pageNumber : pageIndex;
            proxy.storeWinData(data, pageNumber);
            proxy.renderPage(data, pageIndex);

        }
    }

    /**
     * @param {number} pageIndex - It describes about the page index
     * @param {any} annotationObject - It describes about the annotation object
     * @private
     * @returns {void}
     */
    public requestForTextExtraction(pageIndex: number, annotationObject?: any): void {
        // eslint-disable-next-line
        const proxy: PdfViewerBase = this;
        const jsonObject: any = { pageStartIndex: pageIndex, pageEndIndex: pageIndex + 1, documentId: proxy.getDocumentId(), hashId: proxy.hashId, action: 'RenderPdfTexts', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.documentId };
        if (this.jsonDocumentId) {
            (jsonObject as any).documentId = this.jsonDocumentId;
        }
        this.textRequestHandler = new AjaxHandler(this.pdfViewer);
        this.textRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderTexts;
        this.textRequestHandler.responseType = 'json';
        if (!this.clientSideRendering) {
            this.textRequestHandler.send(jsonObject);
        }
        this.textrequestLists.push(pageIndex);
        proxy.textRequestHandler.onSuccess = function (result: any): void {
            if ((proxy.pdfViewer.magnification && proxy.pdfViewer.magnification.isPinchZoomed) ||
            !proxy.pageSize[parseInt(pageIndex.toString(), 10)]) {
                return;
            }
            let data: any = result.data;
            const redirect: boolean = proxy.checkRedirection(data);
            if (!redirect) {
                if (data) {
                    if (typeof data !== 'object') {
                        try {
                            data = JSON.parse(data);
                        } catch (error) {
                            proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.renderTexts);
                            data = null;
                        }
                    }
                }
                if (data) {
                    proxy.textRequestOnSuccess(data, proxy, pageIndex, annotationObject);
                }
            }
        };
        this.textRequestHandler.onFailure = function (result: any): void {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.renderTexts);
        };
        this.textRequestHandler.onError = function (result: any): void {
            proxy.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.renderTexts);
        };
        if (this.clientSideRendering) {
            const requestType: string = 'textRequest';
            this.pdfViewer.pdfRendererModule.getDocumentText(jsonObject, requestType, annotationObject);
        }
    }

    /**
     * @private
     * @param {any} data - It gets the data
     * @param { number} pageIndex - It gets the page index value
     * @param {any} annotationObject - It gets the annotation object
     * @returns {void}
     */
    public textRequestSuccess(data: any, pageIndex: number, annotationObject: any): void {
        this.textRequestOnSuccess(data, this, pageIndex, annotationObject);
    }

    private textRequestOnSuccess(data: any, proxy: PdfViewerBase, pageIndex: number, annotationObject: any): void {
        while (typeof data !== 'object') {
            data = JSON.parse(data);
        }
        if (data.documentTextCollection && data.uniqueId === proxy.documentId) {
            proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.renderTexts, data);
            const pageNumber: number = (data.pageNumber !== undefined) ? data.pageNumber : pageIndex;
            proxy.storeWinData(data, pageNumber);
            if (!isNullOrUndefined(annotationObject)) {
                const markedBounds: any = annotationObject.bounds;
                const pageCharText: any = data.documentTextCollection[0][parseInt(pageIndex.toString(), 10)].PageText.split('');
                const characterBounds: any = data.characterBounds;
                const textMarkupContent: string = proxy.textMarkUpContent(markedBounds, pageCharText, characterBounds);
                annotationObject.textMarkupContent = textMarkupContent;
                this.pdfViewer.annotationModule.storeAnnotations(pageIndex, annotationObject, '_annotations_textMarkup');
            }
            else {
                proxy.renderPage(data, pageIndex);
            }
        }
    }

    /**
     * @param {any} markedBounds - It describes about the marked bounds
     * @param {any} pageCharText - It describes about the page character text
     * @param {any} characterBounds - It describes about the character bounds
     * @private
     * @returns {void}
     */
    public textMarkUpContent(markedBounds: any, pageCharText: any, characterBounds: any): string {
        let textMarkupContent: string = '';
        for (let k: number = 0; k < markedBounds.length; k++) {
            for (let j: number = 0; j < characterBounds.length; j++) {
                const buffer: number = 0.5;
                if (characterBounds[parseInt(j.toString(), 10)].Y >= markedBounds[parseInt(k.toString(), 10)].Y - buffer &&
                 characterBounds[parseInt(j.toString(), 10)].X >= markedBounds[parseInt(k.toString(), 10)].X - buffer &&
                  characterBounds[parseInt(j.toString(), 10)].Y <= markedBounds[parseInt(k.toString(), 10)].Y +
                   markedBounds[parseInt(k.toString(), 10)].Height + buffer &&
                   characterBounds[parseInt(j.toString(), 10)].X <= markedBounds[parseInt(k.toString(), 10)].X +
                   markedBounds[parseInt(k.toString(), 10)].Width + buffer) {
                    textMarkupContent += pageCharText[parseInt(j.toString(), 10)];
                }
            }
        }
        return textMarkupContent.replace((/(\r\n)/gm), '');
    }

    /**
     * @param {number} pageIndex - It describes about the page index
     * @private
     * @returns {boolean} - boolean
     */
    public digitalSignaturePresent(pageIndex: number): boolean {
        let digitalSignaturePresent: boolean = false;
        if (this.digitalSignaturePages && (this.digitalSignaturePages.length !== 0) &&
         (this.digitalSignaturePages.indexOf(pageIndex) !== -1)) {
            digitalSignaturePresent = true;
        }
        return digitalSignaturePresent;
    }

    private pageRequestSent(pageIndex: number, tileX?: number, tileY?: number): boolean {
        const zoomFactor: number = this.retrieveCurrentZoomFactor();
        const currentString: string = this.documentId + '_' + pageIndex + '_' + tileX + '_' + tileY + '_' + zoomFactor;
        if (this.requestLists && this.requestLists.indexOf(currentString) > -1) {
            return true;
        }
        return false;
    }

    /**
     * @private
     * @param {string} status - The status message.
     * @param {string} errorMessage - The error message.
     * @param {string} action - The action.
     * @returns {void}
     */
    public onControlError(status: number, errorMessage: string, action: string): void {
        this.openNotificationPopup();
        this.pdfViewer.fireAjaxRequestFailed(status, errorMessage, action);
    }

    /**
     * @param {number} pageIndex - It describes about the page index
     * @param {boolean} isTextSearch - It ensures whether the isTextSearch is true or not
     * @private
     * @returns {any} - any
     */
    public getStoredData(pageIndex: number, isTextSearch?: boolean): any {
        let zoomFactor: number = this.retrieveCurrentZoomFactor();
        if (this.pdfViewer.restrictZoomRequest && !this.pdfViewer.tileRenderingSettings.enableTileRendering) {
            zoomFactor = this.initialZoomValue[parseInt(pageIndex.toString(), 10)];
        }
        let storedData: any = this.getWindowSessionStorage(pageIndex, zoomFactor) ?
            this.getWindowSessionStorage(pageIndex, zoomFactor) : this.getPinchZoomPage(pageIndex);
        if (!storedData && isTextSearch) {
            const storedTileData: any = this.clientSideRendering ?
                this.getStoredTileImageDetails(pageIndex, 0, 0, zoomFactor) : this.getWindowSessionStorageTile(pageIndex, 0, 0, zoomFactor);
            const storedTileDataParsed: any = JSON.parse(storedTileData);
            if (storedTileData) {
                storedData = storedTileData;
            }
            if (storedTileDataParsed && isNullOrUndefined(storedTileDataParsed.pageText) &&
            isNullOrUndefined(storedTileDataParsed.textContent)) {
                const SessionData: any = JSON.parse(this.getWindowSessionStorageTile(pageIndex, 0, 0, zoomFactor));
                if (!isNullOrUndefined(SessionData) && SessionData.uniqueId === storedTileDataParsed.uniqueId) {
                    storedData = JSON.stringify(SessionData);
                }
            }
        }
        let data: any = null;
        if (storedData) {
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
     * @param  {any} data - The data.
     * @param {number} pageIndex - The pageIndex.
     * @param {number} tileX - The tileX.
     * @param {number} tileY - The tileY.
     * @returns {void}
     */
    public storeWinData(data: any, pageIndex: number, tileX?: number, tileY?: number): void {
        let storeObject: any;
        if (!data['image']) {
            const pageItems: any = data.documentTextCollection[0][parseInt(pageIndex.toString(), 10)];
            storeObject = {
                textContent: data['textContent'], textBounds: data['textBounds'], pageText: pageItems.PageText, rotation: data['rotation'], uniqueId: data['uniqueId']
            };
            if (this.pageSize[parseInt(pageIndex.toString(), 10)]) {
                this.pageSize[parseInt(pageIndex.toString(), 10)].rotation = parseFloat(data['rotation']);
            }
            this.textLayer.characterBound[parseInt(pageIndex.toString(), 10)] = data['characterBounds'];
        } else {
            const blobObj: string = this.createBlobUrl(data['image'].split('base64,')[1], 'image/png');
            const Url: any = URL || webkitURL;
            const blobUrl: string = Url.createObjectURL(blobObj);
            if ((isNaN(tileX) && isNaN(tileY)) || (tileX === 0 && tileY === 0)) {
                storeObject = {
                    image: blobUrl, transformationMatrix: data['transformationMatrix'], hyperlinks: data['hyperlinks'], hyperlinkBounds: data['hyperlinkBounds'], linkAnnotation: data['linkAnnotation'], linkPage: data['linkPage'], annotationLocation: data['annotationLocation'],
                    textContent: data['textContent'], width: data['width'], textBounds: data['textBounds'], pageText: data['pageText'], rotation: data['rotation'], scaleFactor: data['scaleFactor'], uniqueId: data['uniqueId'], zoomFactor: data['zoomFactor'], tileX: tileX, tileY: tileY
                };
                if (this.pageSize[parseInt(pageIndex.toString(), 10)]) {
                    this.pageSize[parseInt(pageIndex.toString(), 10)].rotation = parseFloat(data['rotation']);
                }
                this.textLayer.characterBound[parseInt(pageIndex.toString(), 10)] = data['characterBounds'];
            } else {
                storeObject = {
                    image: blobUrl, transformationMatrix: data['transformationMatrix'], tileX: tileX, tileY: tileY, width: data['width'], zoomFactor: data['zoomFactor']
                };
            }
        }
        let pageWidth: number = 0;
        if (this.pageSize[parseInt(pageIndex.toString(), 10)]) {
            pageWidth = this.pageSize[parseInt(pageIndex.toString(), 10)].width;
        }
        this.manageSessionStorage(pageIndex, storeObject, tileX, tileY);
    }

    /**
     * @private
     * @param {XMLHttpRequest} request - The Xml request.
     * @returns {void}
     */
    public setCustomAjaxHeaders(request: XMLHttpRequest): void {
        for (let i: number = 0; i < this.pdfViewer.ajaxRequestSettings.ajaxHeaders.length; i++) {
            request.setRequestHeader(this.pdfViewer.ajaxRequestSettings.ajaxHeaders[parseInt(i.toString(), 10)].headerName,
                                     this.pdfViewer.ajaxRequestSettings.ajaxHeaders[parseInt(i.toString(), 10)].headerValue);
        }
    }

    /**
     * @private
     * @param {number} pageIndex - Page index.
     * @returns {object} - object
     */
    public getPinchZoomPage(pageIndex: number): object {
        for (const key in this.pinchZoomStorage) {
            if (Object.prototype.hasOwnProperty.call(this.pinchZoomStorage, key)) {
                /* eslint-disable-next-line security/detect-object-injection */
                if (this.pinchZoomStorage[key].index === pageIndex) {
                    this.isPinchZoomStorage = true;
                    /* eslint-disable-next-line security/detect-object-injection */
                    return this.pinchZoomStorage[key].pinchZoomStorage;
                }
            }
        }
        return null;
    }

    /**
     * @private
     * @param {number} pageIndex - current page index.
     * @param {number} zoomFactor - cuurent zoom factor
     * @returns {string} - string
     */
    public getWindowSessionStorage(pageIndex: number, zoomFactor: number): string {
        return PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_' + pageIndex + '_' + zoomFactor);
    }

    /**
     * @private
     * @param {number} pageIndex - current page index.
     * @param {number} tileX - cuurent tile x
     * @param {number} tileY - cuurent tile y
     * @param {number} zoomFactor - cuurent zoom factor
     * @returns {string} - string
     */
    public getWindowSessionStorageTile(pageIndex: number, tileX: number, tileY: number, zoomFactor: number): string {
        return PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_' + pageIndex + '_' + tileX + '_' + tileY + '_' + zoomFactor);
    }

    /**
     * @param {number} pageIndex - It describes about the page index
     * @param {number} tileX - It describes about the tile X
     * @param {number} tileY - It describes about the tile Y
     * @param {number} zoomFactor - It describes about the zoom factor
     * @private
     * @returns {string} - string
     */
    public getStoredTileImageDetails(pageIndex: number, tileX: number, tileY: number, zoomFactor: number): string {
        return this.pageImageDetails[this.documentId + '_' + pageIndex + '_' + tileX + '_' + tileY + '_' + zoomFactor + '_imageUrl'] || null;
    }

    /**
     * @private
     * @returns {number} - number
     */
    public retrieveCurrentZoomFactor(): number {
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

    /**
     * @param {number} pageNumber - It describes about the page number
     * @param {any} textBounds - It describes about the text bounds
     * @param {any} textContent - It describes about the text content
     * @param {string} pageText - It describes about the page text
     * @param {number} rotation - It describes about the rotation
     * @param {any} characterBounds - It describes about the character bounds
     * @private
     * @returns {void}
     */
    public storeTextDetails(pageNumber: number, textBounds: any, textContent: any, pageText: string, rotation: number,
                            characterBounds: any): void {
        const textObject: any = ({ textBounds: textBounds, textContent: textContent, rotation: rotation, pageText: pageText,
            characterBounds: characterBounds });
        if (this.pageSize[parseInt(pageNumber.toString(), 10)]) {
            this.pageSize[parseInt(pageNumber.toString(), 10)].rotation = rotation;
        }
        this.textLayer.characterBound[parseInt(pageNumber.toString(), 10)] = characterBounds;
        this.pageTextDetails[this.documentId + '_' + pageNumber + '_textDetails'] = JSON.stringify(textObject);
    }

    /**
     * @param {number} pageNumber - It describes about the page number
     * @param {any} storeObject - It describes about the store object
     * @param {number} tileX - It describes about the tile X value
     * @param {number} tileY - It describes about the tile Y
     * @private
     * @returns {void}
     */
    public storeImageData(pageNumber: number, storeObject: any, tileX?: number, tileY?: number): void {
        const zoomFactor: number = !isNullOrUndefined(storeObject.zoomFactor) ? storeObject.zoomFactor : this.retrieveCurrentZoomFactor();
        if (isNaN(tileX) && isNaN(tileY)) {
            this.pageImageDetails[this.documentId + '_' + pageNumber + '_' + zoomFactor + '_imageUrl'] = JSON.stringify(storeObject);
        } else {
            this.pageImageDetails[this.documentId + '_' + pageNumber + '_' + tileX + '_' + tileY + '_' + zoomFactor + '_imageUrl'] = JSON.stringify(storeObject);
        }
    }

    private manageSessionStorage(pageIndex: number, storeObject: any, tileX?: number, tileY?: number): void {
        const currentSize: number = PdfViewerBase.sessionStorageManager.getWindowSessionStorageSize();
        const newObjectSize: number = Math.round(JSON.stringify(storeObject).length / 1024);
        let sessionSize: number = currentSize + newObjectSize;
        let maxSessionSize: number = 5000;
        let maxSessionLength: number = 200;
        if (this.isDeviceiOS || this.isMacSafari){
            maxSessionSize = 2000;
            maxSessionLength = 80;
        }
        if (sessionSize >= maxSessionSize) {
            if (!this.isStorageExceed) {
                const annotationList: any = [];
                const formFieldsList: any = [];
                for (let i: number = 0; i < PdfViewerBase.sessionStorageManager.getSessionLength(); i++) {
                    if (PdfViewerBase.sessionStorageManager.getKey(i) && PdfViewerBase.sessionStorageManager.getKey(i).split('_')[3]) {
                        if (PdfViewerBase.sessionStorageManager.getKey(i).split('_')[3] === 'annotations') {
                            this.annotationStorage[PdfViewerBase.sessionStorageManager.getKey(i)] =
                            PdfViewerBase.sessionStorageManager.getItem(PdfViewerBase.sessionStorageManager.getKey(i));
                            annotationList.push(PdfViewerBase.sessionStorageManager.getKey(i));
                        }
                        else if (PdfViewerBase.sessionStorageManager.getKey(i).split('_')[3] === 'formfields') {
                            this.formFieldStorage[PdfViewerBase.sessionStorageManager.getKey(i)] =
                            PdfViewerBase.sessionStorageManager.getItem(PdfViewerBase.sessionStorageManager.getKey(i));
                            formFieldsList.push(PdfViewerBase.sessionStorageManager.getKey(i));
                        }
                        else if (PdfViewerBase.sessionStorageManager.getKey(i).split('_')[3] === 'formDesigner') {
                            this.formFieldStorage[PdfViewerBase.sessionStorageManager.getKey(i)] =
                            PdfViewerBase.sessionStorageManager.getItem(PdfViewerBase.sessionStorageManager.getKey(i));
                            formFieldsList.push(PdfViewerBase.sessionStorageManager.getKey(i));
                        }
                    }
                }
                if (annotationList) {
                    for (let i: number = 0; i < annotationList.length; i++) {
                        PdfViewerBase.sessionStorageManager.removeItem(annotationList[parseInt(i.toString(), 10)]);
                    }
                }
                if (formFieldsList) {
                    for (let i: number = 0; i < formFieldsList.length; i++) {
                        PdfViewerBase.sessionStorageManager.removeItem(formFieldsList[parseInt(i.toString(), 10)]);
                    }
                }
            }
            this.isStorageExceed = true;
            sessionSize = PdfViewerBase.sessionStorageManager.getWindowSessionStorageSize();
            if (sessionSize >= maxSessionSize) {
                let storageLength: number = PdfViewerBase.sessionStorageManager.getSessionLength();
                if (storageLength > maxSessionLength) {
                    storageLength = maxSessionLength;
                }
                for (let i: number = 0; i < storageLength; i++) {
                    if (PdfViewerBase.sessionStorageManager.getKey(i) && PdfViewerBase.sessionStorageManager.getKey(i).split('_')[3]) {
                        if (PdfViewerBase.sessionStorageManager.getKey(i).split('_')[3] !== 'annotations') {
                            PdfViewerBase.sessionStorageManager.removeItem(PdfViewerBase.sessionStorageManager.getKey(i));
                            storageLength = storageLength - 1;
                            i = i - 1;
                        }
                    }
                }
            }
        }
        const zoomFactor: number = this.retrieveCurrentZoomFactor();
        this.initialZoomValue[parseInt(pageIndex.toString(), 10)] = zoomFactor;
        if (isNaN(tileX) && isNaN(tileY)) {
            if (sessionSize < maxSessionSize) {
                PdfViewerBase.sessionStorageManager.setItem(this.documentId + '_' + pageIndex + '_' + zoomFactor, JSON.stringify(storeObject));
            }
            this.sessionStorage.push(this.documentId + '_' + pageIndex + '_' + zoomFactor);
        } else {
            this.sessionStorage.push(this.documentId + '_' + pageIndex + '_' + tileX + '_' + tileY + '_' + zoomFactor);
            if (sessionSize < maxSessionSize) {
                PdfViewerBase.sessionStorageManager.setItem(this.documentId + '_' + pageIndex + '_' + tileX + '_' + tileY + '_' + zoomFactor, JSON.stringify(storeObject));
            }
        }
    }

    /**
     * @param {string} base64String - It describes about the base64 string
     * @param {string} contentType - It describes about the content type
     * @private
     * @returns {string} - string
     */
    public createBlobUrl(base64String: string, contentType: string): string {
        const sliceSize: number = 512;
        const byteCharacters: string = atob(base64String);
        const byteArrays: any = [];
        for (let offset: number = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice: string = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers: any = new Array(slice.length);
            for (let i: number = 0; i < slice.length; i++) {
                byteNumbers[parseInt(i.toString(), 10)] = slice.charCodeAt(i);
            }
            const byteArray: any = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob: any = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    private getRandomNumber(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: any): string {
            const random: any = Math.random() * 16 | 0;
            const v: any = c === 'x' ? random : (random & 0x3 | 0x8);
            return random.toString(16);
        });
    }

    /**
     * @private
     * @returns {string} - string
     */
    public createGUID(): string {
        return 'Sync_PdfViewer_' + this.getRandomNumber();
    }

    /**
     * @private
     * @param {MouseEvent} event - The mouse event.
     * @param {boolean} isNeedToSet - Is need to test.
     * @returns {boolean} - Returns true or false.
     */
    public isClickedOnScrollBar(event: MouseEvent, isNeedToSet?: boolean): boolean {
        let isScrollBar: boolean = false;
        if (isNeedToSet) {
            this.setScrollDownValue(event.type, false);
        }
        if ((this.viewerContainer.clientWidth + this.viewerContainer.offsetLeft) < event.clientX &&
        event.clientX < (this.viewerContainer.offsetWidth + this.viewerContainer.offsetLeft)) {
            isScrollBar = true;
            if (isNeedToSet) {
                this.setScrollDownValue(event.type, true);
            }
        }
        if ((this.viewerContainer.clientHeight + this.viewerContainer.offsetTop) < event.clientY &&
        event.clientY < (this.viewerContainer.offsetHeight + this.viewerContainer.offsetTop)) {
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
     * @returns {void}
     */
    public disableTextSelectionMode(): void {
        this.isTextSelectionDisabled = true;
        if (!isNullOrUndefined(this.viewerContainer)) {
            this.viewerContainer.classList.remove('e-enable-text-selection');
        }
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        if (!isNullOrUndefined(this.viewerContainer)) {
            this.viewerContainer.classList.add('e-disable-text-selection');
            this.viewerContainer.addEventListener('selectstart', () => {
                return false;
            });
        }
    }

    /**
     * @private
     * @param {string} idString - The Id string.
     * @returns {HTMLElement} - The html element.
     */
    public getElement(idString: string): HTMLElement {
        return document.getElementById(this.pdfViewer.element.id + idString);
    }

    /**
     * @private
     * @param {number} pageIndex - The pageIndex
     * @returns {number} - Returns number
     */
    public getPageWidth(pageIndex: number): number {
        if (this.pageSize[parseInt(pageIndex.toString(), 10)]) {
            return this.pageSize[parseInt(pageIndex.toString(), 10)].width * this.getZoomFactor();
        } else {
            return 0;
        }
    }

    /**
     * @private
     * @param {number} pageIndex - The pageIndex
     * @returns {number} - Returns number
     */
    public getPageHeight(pageIndex: number): number {
        if (this.pageSize[parseInt(pageIndex.toString(), 10)]) {
            return this.pageSize[parseInt(pageIndex.toString(), 10)].height * this.getZoomFactor();
        } else {
            return 0;
        }
    }

    /**
     * @private
     * @param {number} pageIndex - The pageIndex.
     * @returns {number} - Returns number
     */
    public getPageTop(pageIndex: number): number {
        if (this.pageSize[parseInt(pageIndex.toString(), 10)]) {
            return this.pageSize[parseInt(pageIndex.toString(), 10)].top * this.getZoomFactor();
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

    private isFormDesignerToolbarHidded(): boolean {
        const formDesignerToolbar: any = this.pdfViewer.toolbarModule.formDesignerToolbarModule;
        if (formDesignerToolbar) {
            return formDesignerToolbar.isToolbarHidden;
        } else {
            return true;
        }
    }

    /**
     * @private
     * @returns {boolean} - Returns true or false.
     */
    public getTextMarkupAnnotationMode(): boolean {
        if (this.isTextMarkupAnnotationModule()) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode;
        } else {
            return false;
        }
    }

    private isNewFreeTextAnnotation(): boolean {
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
     * @returns {number} - Returns page number.
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
     * @returns {boolean} - Retunrs true or false.
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
     * @returns {boolean} - Retunrs true or false.
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
     * @returns {TextMarkupAnnotation} - TextMarkupAnnotation.
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
     * @returns {boolean} - Returns true or false.
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
     * @returns {boolean} - Retunrs true or false.
     */
    public isFormDesignerModule(): boolean {
        if (this.pdfViewer.formDesignerModule) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @private
     * @returns {boolean} - Retunrs true or false.
     */
    public isFormFieldsModule(): boolean {
        if (this.pdfViewer.formFieldsModule) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @private
     * @returns {boolean} - Retunrs true or false.
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
     * @returns {boolean} - Retunrs true or false.
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
     * @returns {boolean} - Retunrs true or false.
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
     * @returns {boolean} - Retunrs true or false.
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
     * @returns {boolean} - Retunrs true or false.
     */
    public isShapeBasedAnnotationsEnabled(): boolean {
        if (this.isShapeAnnotationModule() || this.isCalibrateAnnotationModule() || this.isStampAnnotationModule() ||
        this.isCommentAnnotationModule() || this.isFormDesignerModule() || this.isFormFieldsModule()) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @private
     * @param {MouseEvent | PointerEvent | TouchEvent} e - Returns event.
     * @returns {PointModel} - Returns points.
     */
    public getMousePosition(e: MouseEvent | PointerEvent | TouchEvent): PointModel {
        let touchArg: TouchEvent;
        let offsetX: number;
        let offsetY: number;
        const currentTarget: HTMLElement = (e.target as HTMLElement).parentElement;
        if (e.type.indexOf('touch') !== -1) {
            touchArg = <TouchEvent & PointerEvent>e;
            if (this.pdfViewer.annotation || this.isDeviceiOS) {
                let pageNumber: number = this.pdfViewer.currentPageNumber - 1;
                if (this.pdfViewer.annotation && !isNaN(this.pdfViewer.annotation.getEventPageNumber(e))) {
                    pageNumber = this.pdfViewer.annotation.getEventPageNumber(e);
                }
                if (isNaN(pageNumber) && this.pdfViewer.formDesignerModule) {
                    pageNumber = this.pdfViewer.formDesignerModule.getEventPageNumber(e);
                }
                const pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageNumber);
                if (pageDiv) {
                    const pageCurrentRect: ClientRect =
                        pageDiv.getBoundingClientRect();
                    offsetX = touchArg.changedTouches[0].clientX - pageCurrentRect.left;
                    offsetY = touchArg.changedTouches[0].clientY - pageCurrentRect.top;
                }
            }
        } else {
            if ((e.target as HTMLElement).classList.contains('e-pv-hyperlink')) {
                offsetX = (e as PointerEvent).offsetX + (e.target as HTMLElement).offsetLeft;
                offsetY = (e as PointerEvent).offsetY + (e.target as HTMLElement).offsetTop;
            } else if ((e.target as HTMLElement).classList.contains('e-pv-text') && currentTarget) {
                const targetParentRect: ClientRect = currentTarget.getBoundingClientRect();
                offsetX = (e as PointerEvent).clientX - targetParentRect.left;
                offsetY = (e as PointerEvent).clientY - targetParentRect.top;
            } else if (e.target && (e && (e as any).path) && currentTarget && (currentTarget.classList.contains('foreign-object') || currentTarget.parentElement.classList.contains('foreign-object'))) {
                let targetParentRect: any;
                if ((e as any).path[4].className === 'e-pv-page-div') {
                    targetParentRect = (e as any).path[4].getBoundingClientRect();
                }
                else {
                    for (let i: number = 0; i < (e as any).path.length; i++) {
                        if ((e as any).path[parseInt(i.toString(), 10)].className === 'e-pv-page-div') {
                            targetParentRect = (e as any).path[parseInt(i.toString(), 10)].getBoundingClientRect();
                            break;
                        }
                    }
                }
                offsetX = (e as PointerEvent).clientX - targetParentRect.left;
                offsetY = (e as PointerEvent).clientY - targetParentRect.top;
            } else if (e.target && currentTarget && currentTarget.classList.contains('foreign-object') || ((e.target as any).classList.contains('e-pv-checkbox-div'))) {
                let targetParentRect: ClientRect;
                if (((e.target as any).classList.contains('e-pv-checkbox-div'))) {
                    targetParentRect = (e.target as any).offsetParent.offsetParent.offsetParent.offsetParent.getBoundingClientRect();
                }
                else {
                    targetParentRect = (e.target as any).offsetParent.offsetParent.offsetParent.getBoundingClientRect();
                }
                offsetX = (e as PointerEvent).clientX - targetParentRect.left;
                offsetY = (e as PointerEvent).clientY - targetParentRect.top;
            }
            else {
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
                } else if (this.action === 'Drag' && obj && this.pdfViewer.selectedItems.formFields.length > 0) {
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
     * @param {PdfAnnotationBaseModel} obj - The object.
     * @param {PointModel} position - The position.
     * @returns {Actions | string} - Returns the string.
     */
    public findToolToActivate(obj: PdfAnnotationBaseModel, position: PointModel): Actions | string {
        position = { x: position.x / this.getZoomFactor(), y: position.y / this.getZoomFactor() };
        const element: DrawingElement = this.pdfViewer.selectedItems.wrapper;
        if (element && obj) {
            const selectorBnds: Rect = element.bounds; //let handle: SelectorModel = diagram.selectedItems;
            let paddedBounds: Rect = new Rect(selectorBnds.x, selectorBnds.y, selectorBnds.width, selectorBnds.height);
            if (obj.shapeAnnotationType === 'Line' || obj.shapeAnnotationType === 'LineWidthArrowHead' ||
                obj.shapeAnnotationType === 'Distance' || obj.shapeAnnotationType === 'Polygon') {
                const conn: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
                if (conn) {
                    for (let i: number = 0; i < conn.vertexPoints.length; i++) {
                        if (contains(position, conn.vertexPoints[parseInt(i.toString(), 10)], 10) && conn.leaderHeight !== 0) {
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
                        const elementAngle: number = Point.findAngle(obj.sourcePoint, obj.targetPoint);

                        const segment: any = obj.wrapper.children[parseInt(i.toString(), 10)];
                        if (segment.id.indexOf('leader') > -1) {
                            let centerPoint: PointModel = obj.wrapper.children[0].bounds.center;
                            if (leaderCount === 0) {
                                newPoint1 = { x: obj.sourcePoint.x, y: obj.sourcePoint.y - obj.leaderHeight };
                                centerPoint = obj.sourcePoint;
                            } else {
                                newPoint1 = { x: obj.targetPoint.x, y: obj.targetPoint.y - obj.leaderHeight };
                                centerPoint = obj.targetPoint;
                            }
                            const matrix: Matrix = identityMatrix();
                            rotateMatrix(matrix, elementAngle, centerPoint.x, centerPoint.y);
                            const rotatedPoint: PointModel = transformPointByMatrix(matrix, { x: newPoint1.x, y: newPoint1.y });
                            if (contains(position, rotatedPoint, 10)) {
                                return 'Leader' + leaderCount;
                            }
                            leaderCount++;
                        }
                    }
                }
            }
            let ten: number = this.pdfViewer.touchPadding;
            if (this.getZoomFactor() <= 1.5) {
                ten = ten / this.getZoomFactor();
            }
            const matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, obj.rotateAngle + element.parentTransform, element.offsetX, element.offsetY);
            //check for resizing tool
            const x: number = element.offsetX - element.pivot.x * element.actualSize.width;
            const y: number = element.offsetY - element.pivot.y * element.actualSize.height;

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
                const action: Actions = this.checkResizeHandles(this.pdfViewer, element, position, matrix, x, y);
                if (action) {
                    return action;
                }
            }
            if (this.pdfViewer.selectedItems.annotations.indexOf(obj) > -1) {
                return 'Drag';
            } else if (this.pdfViewer.selectedItems.formFields.indexOf(obj) > -1 && this.pdfViewer.designerMode) {
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
        if (action) {
            return action;
        }
        return null;
    }

    public checkForResizeHandles(
        diagram: PdfViewer, element: DrawingElement, position: PointModel, matrix: Matrix, x: number, y: number): Actions {
        const forty: number = 40 / 1;
        let ten: number = this.pdfViewer.touchPadding / 1;
        // Resizer cursor adjustment factor for higher zoom values
        const resizerBuffer: number = 1.9;
        if (this.getZoomFactor() >= 2.0 && !Browser.isDevice) {
            ten = ten / (this.getZoomFactor() / resizerBuffer);
        }
        if (element.actualSize.width < 40 || element.actualSize.height < 40 && Browser.isDevice) {
            ten = ten / 2 * this.getZoomFactor() / 1;
        }
        const selectedItems: Selector = diagram.selectedItems as Selector;
        let isStamp: boolean = false;
        let isSticky: boolean = false;
        let isNodeShape: boolean = false;
        let isInk: boolean = false;
        let resizerLocation: AnnotationResizerLocation = this.pdfViewer.annotationSelectorSettings.resizerLocation;
        if (resizerLocation < 1 || resizerLocation > 3) {
            resizerLocation = 3 as AnnotationResizerLocation;
        }
        if (this.pdfViewer.selectedItems.annotations[0] && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Stamp'
            || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Image' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature'
            || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureText' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureImage')) {
            isStamp = true;
        }
        if (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'StickyNotes') {
            isSticky = true;
        }
        if (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ink') {
            isInk = true;
        }
        if (this.pdfViewer.selectedItems.annotations[0] && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ellipse' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Radius' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Rectangle')) {
            isNodeShape = true;
        }
        if (!isSticky) {
            if ((isInk || isStamp || (this.pdfViewer.selectedItems.annotations[0] && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureText' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureImage')) || ((element.actualSize.width >= forty && element.actualSize.height >= forty) && isNodeShape && (resizerLocation === 1 || resizerLocation === 3 as AnnotationResizerLocation)))) {
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
            if (isInk || !isNodeShape || (isNodeShape && (resizerLocation === 2 || resizerLocation === 3 as AnnotationResizerLocation ||
                (!(element.actualSize.width >= forty && element.actualSize.height >= forty) && resizerLocation === 1)))) {
                if (contains(
                    position, transformPointByMatrix(matrix, { x: x + element.actualSize.width, y: y +
                        element.actualSize.height / 2 }), ten) && !isStamp) {
                    return 'ResizeEast';
                }
                if (contains(position, transformPointByMatrix(matrix, { x: x, y: y + element.actualSize.height / 2 }), ten) && !isStamp) {
                    return 'ResizeWest';
                }
                if (contains(
                    position, transformPointByMatrix(matrix, { x: x + element.actualSize.width / 2, y: y +
                    element.actualSize.height }), ten) && !isStamp) {
                    return 'ResizeSouth';
                }
                if (contains(position, transformPointByMatrix(matrix, { x: x + element.actualSize.width / 2, y: y }), ten) && !isStamp) {
                    return 'ResizeNorth';
                }
            }
        }
        return null;
    }

    /**
     * @private
     * @param {string} fieldID - The fieldID
     * @returns {boolean} - Returns true or false.
     */
    public checkSignatureFormField(fieldID: string): boolean {
        let isFormFieldSign: boolean = false;
        if (this.pdfViewer.formDesignerModule) {
            fieldID = fieldID.split('_')[0];
        }
        const formField: any = (this.pdfViewer.nameTable as any)[`${fieldID}`];
        if (formField) {
            if (formField.formFieldAnnotationType === 'SignatureField' || formField.formFieldAnnotationType === 'InitialField' || formField.annotName === 'SignatureField') {
                isFormFieldSign = true;
            }
        }
        return isFormFieldSign;
    }

    /**
     * @private
     * @param {MouseEvent | TouchEvent} evt - The event.
     * @returns {void}
     */
    public diagramMouseMove(evt: MouseEvent | TouchEvent): void {
        const allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        const pageDiv: HTMLElement = this.getElement('_pageDiv_' + (this.currentPageNumber - 1));
        this.pdfViewer.enableServerDataBinding(false);
        this.currentPosition = this.getMousePosition(evt);
        this.pdfViewer.firePageMouseover(this.currentPosition.x, this.currentPosition.y);
        if (this.pdfViewer.annotation) {
            this.activeElements.activePageID = this.pdfViewer.annotation.getEventPageNumber(evt);
        } else if (this.pdfViewer.formDesignerModule) {
            this.activeElements.activePageID = this.pdfViewer.formDesignerModule.getEventPageNumber(evt);
        }
        let obj: IElement = findActiveElement(evt as MouseEvent, this, this.pdfViewer);
        if ((this.tool instanceof NodeDrawingTool) || (this.tool instanceof LineTool)) {
            obj = this.pdfViewer.drawingObject as IElement;
        }
        let target: PdfAnnotationBaseModel;
        const isFormFieldSign: boolean = this.pdfViewer.selectedItems.annotations.length > 0 ?
            this.checkSignatureFormField(this.pdfViewer.selectedItems.annotations[0].id) : false;
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
                const eventTarget: HTMLElement = evt.target as HTMLElement;
                this.action = this.findToolToActivate(obj, this.currentPosition);
                if (obj && (obj as any).annotationSettings && (obj as any).annotationSettings.isLock) {
                    if (this.action === 'Select') {
                        if (!this.pdfViewer.annotationModule.checkAllowedInteractions('Select', obj)) {
                            this.action = '';
                        }
                    }
                    if (this.action === 'Drag') {
                        if (!this.pdfViewer.annotationModule.checkAllowedInteractions('Move', obj)) {
                            this.action = 'Select';
                        }
                    }
                    if (this.action === 'ResizeSouthEast' || this.action === 'ResizeNorthEast' || this.action === 'ResizeNorthWest' || this.action === 'ResizeSouthWest' ||
                        this.action === 'ResizeNorth' || this.action === 'ResizeWest' || this.action === 'ResizeEast' || this.action === 'ResizeSouth' || this.action.includes('ConnectorSegmentPoint') || this.action.includes('Leader')) {
                        if (!this.pdfViewer.annotationModule.checkAllowedInteractions('Resize', obj)) {
                            this.action = 'Select';
                        }
                    }
                }
                if (!this.pdfViewer.designerMode && ((!isNullOrUndefined(target) &&
                (!isNullOrUndefined(target.formFieldAnnotationType))) || isFormFieldSign)) {
                    if (this.action === 'ResizeSouthEast' || this.action === 'ResizeNorthEast' || this.action === 'ResizeNorthWest' || this.action === 'ResizeSouthWest' ||

                        this.action === 'ResizeNorth' || this.action === 'Drag' || this.action === 'ResizeWest' || this.action === 'ResizeEast' || this.action === 'ResizeSouth' || this.action.includes('ConnectorSegmentPoint') || this.action.includes('Leader')) {
                        this.action = '';
                    }
                }
                this.tool = this.getTool(this.action);
                this.setCursor(eventTarget, evt);
                if (this.pdfViewer.linkAnnotationModule && this.pdfViewer.selectedItems.annotations.length !== 0 &&
                    this.pdfViewer.selectedItems.formFields.length !== 0) {
                    this.pdfViewer.linkAnnotationModule.disableHyperlinkNavigationUnderObjects(eventTarget, evt, this);
                }
            } else {
                if (!this.tool && this.action && this.action === 'Rotate') {
                    this.tool = this.getTool(this.action);
                    if (evt.target as HTMLElement) {
                        this.setCursor(evt.target as HTMLElement, evt);
                    }
                }
                if (!this.pdfViewer.designerMode && ((!isNullOrUndefined(target) &&
                (!isNullOrUndefined(target.formFieldAnnotationType))) || isFormFieldSign)) {
                    if (this.action === 'ResizeSouthEast' || this.action === 'ResizeNorthEast' || this.action === 'ResizeNorthWest' || this.action === 'ResizeSouthWest' ||
                        this.action === 'ResizeNorth' || this.action === 'Drag' || this.action === 'ResizeWest' || this.action === 'ResizeEast' || this.action === 'ResizeSouth' || this.action.includes('ConnectorSegmentPoint') || this.action.includes('Leader')) {
                        this.action = '';
                        this.tool = null;
                    }
                }
                if (this.eventArgs && this.eventArgs.source) {
                    const eventTarget: HTMLElement = evt.target as HTMLElement;
                    this.updateDefaultCursor(this.eventArgs.source, eventTarget, evt);
                } else {
                    this.setCursor(evt.target as HTMLElement, evt);
                }
                this.diagramMouseActionHelper(evt as MouseEvent);
                if (this.tool) {
                    const currentObject: PdfAnnotationBaseModel = obj as PdfAnnotationBaseModel;
                    if (currentObject && currentObject.shapeAnnotationType === 'FreeText') {
                        if (this.pdfViewer.freeTextSettings.allowEditTextOnly && this.action !== 'Ink' &&
                            (this.eventArgs.source && (this.eventArgs.source as any).shapeAnnotationType === 'FreeText')) {
                            const eventTarget: HTMLElement = event.target as HTMLElement;
                            eventTarget.style.cursor = 'default';
                            this.tool = null;
                        }
                    }
                    if (this.tool != null) {
                        const info: Info = { ctrlKey: evt.ctrlKey, shiftKey: evt.shiftKey };
                        this.eventArgs.info = info;
                        this.tool.mouseMove(this.eventArgs);
                    }
                }
            }
            if (this.pdfViewer.drawingObject && this.pdfViewer.drawingObject.formFieldAnnotationType && this.action !== 'Drag') {
                if (!(this.tool instanceof ResizeTool)) {
                    this.tool = this.getTool(this.action);
                    if (this.tool instanceof NodeDrawingTool) {
                        const obj: PdfFormFieldBaseModel = this.pdfViewer.drawingObject;
                        const bounds: any = this.pdfViewer.formDesignerModule.
                            updateFormFieldInitialSize(obj as unknown as DrawingElement, (obj as PdfFormFieldBaseModel).
                                formFieldAnnotationType);
                        const pageWidth: number = this.pageContainer.firstElementChild.clientWidth - bounds.width;
                        const pageHeight: number = this.pageContainer.firstElementChild.clientHeight - bounds.height;
                        if (this.pdfViewer.formDesignerModule && (obj as PdfFormFieldBaseModel).formFieldAnnotationType
                            && this.currentPosition.x < pageWidth && this.currentPosition.y < pageHeight) {
                            const formFieldElement: any = document.getElementById('FormField_helper_html_element');
                            if (!formFieldElement) {
                                this.pdfViewer.formDesignerModule.drawHelper((obj as PdfFormFieldBaseModel).formFieldAnnotationType,
                                                                             obj, evt);
                            }
                            else if (formFieldElement) {
                                const previousActivePage: any = formFieldElement.parentElement.id.split('_text_')[1] || formFieldElement.parentElement.id.split('_textLayer_')[1] || formFieldElement.parentElement.id.split('_annotationCanvas_')[1] || formFieldElement.parentElement.id.split('_pageDiv_')[1];
                                if (parseInt(previousActivePage, 10) !== this.activeElements.activePageID) {
                                    formFieldElement.remove('FormField_helper_html_element');
                                } else {
                                    const point: PointModel = this.getMousePosition(event as any);
                                    if (obj.formFieldAnnotationType === 'Checkbox' && formFieldElement.firstElementChild.firstElementChild.lastElementChild as HTMLElement) {
                                        (formFieldElement.firstElementChild.firstElementChild.lastElementChild as HTMLElement).style.visibility = 'visible';
                                    } else if (obj.formFieldAnnotationType === 'SignatureField' || obj.formFieldAnnotationType === 'InitialField') {
                                        (formFieldElement.firstElementChild.firstElementChild as HTMLElement).style.visibility = 'visible';
                                        (formFieldElement.firstElementChild.lastElementChild as HTMLElement).style.visibility = 'visible';
                                    } else {
                                        (formFieldElement.firstElementChild.firstElementChild as HTMLElement).style.visibility = 'visible';
                                    }
                                    formFieldElement.style.cssText = `height: ${bounds.height}px;width: ${bounds.width}px;
                                    left: ${point.x}px;top: ${point.y}px;position: absolute;opacity: 0.5;`;
                                }
                            }
                        } else if (this.currentPosition.x > pageWidth || this.currentPosition.y > pageHeight) {
                            const formFieldElement: any = document.getElementById('FormField_helper_html_element');
                            if (!formFieldElement) {
                                this.pdfViewer.formDesignerModule.drawHelper((obj as PdfFormFieldBaseModel).formFieldAnnotationType,
                                                                             obj, evt);
                            } else if (formFieldElement) {
                                const point: any = this.getMousePosition(event as any);
                                formFieldElement.style.cssText = `height: ${bounds.height}px;width: ${bounds.width}px;left: ${point.x}px;
                                top: ${point.y}px;position: absolute;opacity: 0.5;`;
                                if ((this.currentPosition.x + parseInt(formFieldElement.style.width, 10)) >
                                parseInt(pageDiv.style.width, 10)) {
                                    if (obj.formFieldAnnotationType === 'Checkbox' && formFieldElement.firstElementChild.firstElementChild.lastElementChild) {
                                        formFieldElement.firstElementChild.firstElementChild.lastElementChild.style.visibility = 'hidden';
                                    }
                                    else if (obj.formFieldAnnotationType === 'SignatureField' || obj.formFieldAnnotationType === 'InitialField') {
                                        formFieldElement.firstElementChild.firstElementChild.style.visibility = 'hidden';
                                        formFieldElement.firstElementChild.lastElementChild.style.visibility = 'hidden';
                                    }
                                    else {
                                        formFieldElement.firstElementChild.firstElementChild.style.visibility = 'hidden';
                                    }
                                }
                                else {
                                    if (obj.formFieldAnnotationType === 'Checkbox' && formFieldElement.firstElementChild.firstElementChild.lastElementChild) {
                                        formFieldElement.firstElementChild.firstElementChild.lastElementChild.style.visibility = 'visible';
                                    }
                                    else if (obj.formFieldAnnotationType === 'SignatureField' || obj.formFieldAnnotationType === 'InitialField') {
                                        formFieldElement.firstElementChild.firstElementChild.style.visibility = 'visible';
                                        formFieldElement.firstElementChild.lastElementChild.style.visibility = 'visible';
                                    }
                                    else {
                                        formFieldElement.firstElementChild.firstElementChild.style.visibility = 'visible';
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.prevPosition = this.currentPosition;
        }
        this.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
    }

    private updateDefaultCursor(source: any, target: any, event: any): void {
        if (source && source.pageIndex !== undefined && source.pageIndex !== this.activeElements.activePageID && target) {
            if (this.isPanMode) {
                target.style.cursor = 'grab';
            } else {
                target.style.cursor = 'default';
            }
        } else {
            this.setCursor(target, event);
        }
    }

    /**
     * @private
     * @param {MouseEvent | TouchEvent} evt - The event.
     * @returns {void}
     */
    public diagramMouseLeave(evt: MouseEvent | TouchEvent): void {
        this.currentPosition = this.getMousePosition(evt);
        if (this.pdfViewer.annotation) {
            this.activeElements.activePageID = this.pdfViewer.annotation.getEventPageNumber(evt);
        }
        if (isNaN(this.activeElements.activePageID) && this.pdfViewer.formDesignerModule) {
            this.activeElements.activePageID = this.pdfViewer.formDesignerModule.getEventPageNumber(evt);
        }
        const shapeElement: IElement = findActiveElement(evt as MouseEvent, this, this.pdfViewer);
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

    private setCursor(eventTarget: HTMLElement, event: any): void {
        const freeTextAnnotModule: FreeTextAnnotation = this.pdfViewer.annotationModule ?
            this.pdfViewer.annotationModule.freeTextAnnotationModule : null;
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
        } else if (this.isCommentIconAdded && this.isAddComment) {
            eventTarget.style.cursor = 'crosshair';
        } else if (this.pdfViewer.enableHandwrittenSignature && this.isNewSignatureAdded && this.tool instanceof StampTool) {
            eventTarget.style.cursor = 'crosshair';
        } else if (this.tool instanceof MoveTool) {
            eventTarget.style.cursor = 'move';
        } else if (this.tool instanceof NodeDrawingTool || this.tool instanceof LineTool ||
            this.tool instanceof PolygonDrawingTool || (freeTextAnnotModule && freeTextAnnotModule.isNewAddedAnnot) ||
            this.tool instanceof InkDrawingTool) {
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
                    const obj: IElement = findActiveElement(event as MouseEvent, this, this.pdfViewer);
                    if (obj && event.type === 'mousemove') {
                        eventTarget.style.cursor = 'pointer';
                        const currentObject: PdfAnnotationBaseModel | PdfFormFieldBaseModel = obj as PdfAnnotationBaseModel |
                        PdfFormFieldBaseModel;
                        const currentPosition: PointModel = this.getMousePosition(event);
                        const relativePosition: PointModel = this.relativePosition(event);
                        const viewerPositions: any = { left: relativePosition.x, top: relativePosition.y };
                        const mousePositions: any = { left: currentPosition.x, top: currentPosition.y };
                        const annotationSettings: any = { opacity: currentObject.opacity,
                            fillColor: (currentObject as PdfAnnotationBaseModel).fillColor,
                            strokeColor: (currentObject as PdfAnnotationBaseModel).strokeColor,
                            thicknes: (currentObject as PdfAnnotationBaseModel).thickness,
                            author: (currentObject as PdfAnnotationBaseModel).author,
                            subject: (currentObject as PdfAnnotationBaseModel).subject,
                            modifiedDate: (currentObject as PdfAnnotationBaseModel).modifiedDate };
                        this.isMousedOver = true;
                        const isFormField: boolean = this.checkSignatureFormField(currentObject.id);
                        if (currentObject.formFieldAnnotationType) {
                            this.isFormFieldMousedOver = true;
                            const field: IFormField = {
                                id: (currentObject as any).id, name: (currentObject as any).name,
                                value: (currentObject as any).value, fontFamily: currentObject.fontFamily,
                                fontSize: currentObject.fontSize, fontStyle: (currentObject as any).fontStyle,
                                color: (currentObject as PdfFormFieldBaseModel).color,
                                backgroundColor: (currentObject as PdfFormFieldBaseModel).backgroundColor,
                                borderColor: (currentObject as PdfFormFieldBaseModel).borderColor,
                                thickness: (currentObject as PdfFormFieldBaseModel).thickness,
                                alignment: (currentObject as PdfFormFieldBaseModel).alignment,
                                isReadonly: (currentObject as any).isReadonly, visibility: (currentObject as any).visibility,
                                maxLength: (currentObject as any).maxLength, isRequired: (currentObject as any).isRequired,
                                isPrint: currentObject.isPrint, rotation: (currentObject as any).rotateAngle,
                                tooltip: (currentObject as any).tooltip, options: (currentObject as any).options,
                                isChecked: (currentObject as any).isChecked, isSelected: (currentObject as any).isSelected,
                                customData : (currentObject as any).customData, lineBound: (currentObject as any).bounds,
                                pageNumber: (currentObject as any).pageIndex, insertSpaces: (currentObject as any).insertSpaces,
                                formFieldAnnotationType: (currentObject as any).formFieldAnnotationType,
                                isTransparent: (currentObject as any).isTransparent
                            };
                            this.pdfViewer.fireFormFieldMouseoverEvent('formFieldMouseover', field, currentObject.pageIndex, relativePosition.x, relativePosition.y, currentPosition.x, currentPosition.y);
                        } else {
                            if (!isFormField)
                            { this.pdfViewer.
                                fireAnnotationMouseover((currentObject as PdfAnnotationBaseModel).annotName, currentObject.pageIndex,
                                                        (currentObject as PdfAnnotationBaseModel).shapeAnnotationType as AnnotationType,
                                                        currentObject.bounds, annotationSettings, mousePositions, viewerPositions); }
                        }
                    } else {
                        eventTarget.style.cursor = 'grab';
                        if (this.isMousedOver) {
                            let pageIndex: number;
                            if (this.pdfViewer.formDesignerModule) {
                                pageIndex = this.pdfViewer.formDesignerModule.getEventPageNumber(event);
                            } else {
                                pageIndex = this.pdfViewer.annotation.getEventPageNumber(event);
                            }
                            if (this.isFormFieldMousedOver) {
                                this.pdfViewer.fireFormFieldMouseLeaveEvent('formFieldMouseLeave', null, pageIndex);
                            } else {
                                this.pdfViewer.fireAnnotationMouseLeave(pageIndex);
                            }
                            this.isMousedOver = false;
                            this.isFormFieldMousedOver = false;
                        }
                    }
                }
            } else {
                const obj: IElement = findActiveElement(event as MouseEvent, this, this.pdfViewer);
                if (obj && this.pdfViewer.selectedItems.annotations.length === 0 && event.type === 'mousemove') {
                    const currentObject: PdfAnnotationBaseModel = obj as PdfAnnotationBaseModel;
                    const annotationObject: any = (this.pdfViewer.nameTable as any)[currentObject.id];
                    if (annotationObject.shapeAnnotationType !== 'HandWrittenSignature' && annotationObject.shapeAnnotationType !== 'Ink' && annotationObject.annotationSettings && annotationObject.annotationSettings.isLock !== undefined) {
                        annotationObject.annotationSettings.isLock = JSON.parse(annotationObject.annotationSettings.isLock);
                    }
                    if (annotationObject.annotationSettings && annotationObject.annotationSettings.isLock) {
                        eventTarget.style.cursor = 'default';
                    } else {
                        eventTarget.style.cursor = 'pointer';
                    }
                    const currentPosition: PointModel = this.getMousePosition(event);
                    const relativePosition: PointModel = this.relativePosition(event);
                    const viewerPositions: any = { left: relativePosition.x, top: relativePosition.y };
                    const mousePositions: any = { left: currentPosition.x, top: currentPosition.y };
                    const annotationSettings: any = { opacity: currentObject.opacity, fillColor: currentObject.fillColor,
                        strokeColor: currentObject.strokeColor, thicknes: currentObject.thickness,
                        author: currentObject.author, subject: currentObject.subject, modifiedDate: currentObject.modifiedDate };
                    this.isMousedOver = true;
                    const isFormField: boolean = this.checkSignatureFormField(currentObject.id);
                    if (currentObject.formFieldAnnotationType) {
                        this.isFormFieldMousedOver = true;
                        const field: IFormField = {
                            id: (currentObject as any).id, name: (currentObject as any).name,
                            value: (currentObject as any).value, fontFamily: currentObject.fontFamily,
                            fontSize: currentObject.fontSize, fontStyle: (currentObject as any).fontStyle,
                            color: (currentObject as PdfFormFieldBaseModel).color,
                            backgroundColor: (currentObject as PdfFormFieldBaseModel).backgroundColor,
                            borderColor: (currentObject as PdfFormFieldBaseModel).borderColor,
                            thickness: (currentObject as PdfFormFieldBaseModel).thickness,
                            alignment: (currentObject as PdfFormFieldBaseModel).alignment,
                            isReadonly: (currentObject as any).isReadonly, visibility: (currentObject as any).visibility,
                            maxLength: (currentObject as any).maxLength, isRequired: (currentObject as any).isRequired,
                            isPrint: currentObject.isPrint, rotation: (currentObject as any).rotateAngle,
                            tooltip: (currentObject as any).tooltip, options: (currentObject as any).options,
                            isChecked: (currentObject as any).isChecked, isSelected: (currentObject as any).isSelected,
                            isTransparent: (currentObject as any).isTransparent, customData : (currentObject as any).customData,
                            lineBound: (currentObject as any).bounds, pageNumber: (currentObject as any).pageIndex,
                            insertSpaces: (currentObject as any).insertSpaces,
                            formFieldAnnotationType: (currentObject as any).formFieldAnnotationType
                        };
                        this.fromTarget = currentObject;
                        this.pdfViewer.fireFormFieldMouseoverEvent('formFieldMouseover', field, currentObject.pageIndex, relativePosition.x, relativePosition.y, currentPosition.x, currentPosition.y);
                    } else {
                        if (!isFormField) { this.pdfViewer.fireAnnotationMouseover(currentObject.annotName, currentObject.pageIndex,
                                                                                   currentObject.shapeAnnotationType as AnnotationType,
                                                                                   currentObject.bounds,
                                                                                   annotationSettings, mousePositions, viewerPositions); }
                    }
                }
                else if (!this.pdfViewer.formDesignerModule && event.target.classList.contains('e-pdfviewer-formFields')) {
                    let pageIndex: number;
                    if (this.pdfViewer.annotation) {
                        pageIndex = this.pdfViewer.annotation.getEventPageNumber(event);
                    }
                    const currentPosition: PointModel = this.getMousePosition(event);
                    const relativePosition: PointModel = this.relativePosition(event);
                    const dataJson: any = this.getItemFromSessionStorage('_formfields');
                    const data: any = JSON.parse(dataJson);
                    let field: any;
                    for (let i: number = 0; i < data.length; i++) {
                        if (data[parseInt(i.toString(), 10)].FieldName === event.target.name) {
                            field = { name: data[parseInt(i.toString(), 10)].FieldName, id : data[parseInt(i.toString(), 10)].uniqueID };
                        }
                    }
                    this.isMousedOver = true;
                    this.isFormFieldMousedOver = true;
                    this.pdfViewer.fireFormFieldMouseoverEvent('formFieldMouseover', field, pageIndex, relativePosition.x, relativePosition.y, currentPosition.x, currentPosition.y);

                }
                else {
                    if (this.isMousedOver) {
                        let pageIndex: number;
                        if (this.pdfViewer.formDesignerModule) {
                            pageIndex = this.pdfViewer.formDesignerModule.getEventPageNumber(event);
                        } else if (this.pdfViewer.annotation) {
                            pageIndex = this.pdfViewer.annotation.getEventPageNumber(event);
                        }
                        if (this.isFormFieldMousedOver) {
                            if (this.fromTarget) {
                                const field: IFormField = {
                                    name: (this.fromTarget as any).name, id: (this.fromTarget as any).id,
                                    value: (this.fromTarget as any).value, fontFamily: this.fromTarget.fontFamily,
                                    fontSize: this.fromTarget.fontSize, fontStyle: (this.fromTarget as any).fontStyle,
                                    color: (this.fromTarget as PdfFormFieldBaseModel).color,
                                    backgroundColor: (this.fromTarget as PdfFormFieldBaseModel).backgroundColor,
                                    borderColor: (this.fromTarget as PdfFormFieldBaseModel).borderColor,
                                    thickness: (this.fromTarget as PdfFormFieldBaseModel).thickness,
                                    alignment: (this.fromTarget as PdfFormFieldBaseModel).alignment,
                                    isReadonly: (this.fromTarget as any).isReadonly, visibility: (this.fromTarget as any).visibility,
                                    maxLength: (this.fromTarget as any).maxLength,
                                    isRequired: (this.fromTarget as any).isRequired,
                                    isPrint: this.fromTarget.isPrint, rotation: (this.fromTarget as any).rotateAngle,
                                    tooltip: (this.fromTarget as any).tooltip, options: (this.fromTarget as any).options,
                                    isChecked: (this.fromTarget as any).isChecked,
                                    isSelected: (this.fromTarget as any).isSelected,
                                    customData : (this.fromTarget as any).customData, lineBound: (this.fromTarget as any).bounds,
                                    pageNumber: (this.fromTarget as any).pageIndex, insertSpaces: (this.fromTarget as any).insertSpaces,
                                    formFieldAnnotationType: (this.fromTarget as any).formFieldAnnotationType,
                                    isTransparent: (this.fromTarget as any).isTransparent
                                };
                                this.pdfViewer.fireFormFieldMouseLeaveEvent('formFieldMouseLeave', field, pageIndex);
                            }
                            else {
                                this.pdfViewer.fireFormFieldMouseLeaveEvent('formFieldMouseLeave', null, pageIndex);
                            }
                        } else {
                            this.pdfViewer.fireAnnotationMouseLeave(pageIndex);
                        }
                        this.isMousedOver = false;
                        this.isFormFieldMousedOver = false;
                        eventTarget.style.cursor = 'default';
                    }
                    if (obj && this.pdfViewer.selectedItems.annotations.length === 1 && event.type === 'mousemove') {
                        eventTarget.style.cursor = 'pointer';
                    } else {
                        eventTarget.style.cursor = 'default';
                    }
                }
            }
        }
    }

    private setResizerCursorType(): string {
        let cursorType: string;
        if (this.pdfViewer.selectedItems.annotations[0] &&
            isNullOrUndefined(this.pdfViewer.selectedItems.annotations[0].annotationSelectorSettings.resizerCursorType)) {
            if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText') {
                cursorType = !isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings) ?
                    this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerCursorType : null;
            } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Stamp') {
                cursorType = !isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings) ?
                    this.pdfViewer.stampSettings.annotationSelectorSettings.resizerCursorType : null;
            } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureText' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureImage') {
                cursorType = !isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) ?
                    this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerCursorType : null;
            } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ink') {
                cursorType = !isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) ?
                    this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerCursorType : null;
            } else if (!this.pdfViewer.selectedItems.annotations[0].measureType) {
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line') {
                    cursorType = !isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings) ?
                        this.pdfViewer.lineSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'LineWidthArrowHead') {
                    cursorType = !isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings) ?
                        this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Rectangle') {
                    cursorType = !isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings) ?
                        this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ellipse') {
                    cursorType = !isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings) ?
                        this.pdfViewer.circleSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Polygon') {
                    cursorType = !isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings) ?
                        this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerCursorType : null;
                }
            } else if (this.pdfViewer.selectedItems.annotations[0].measureType) {
                if (this.pdfViewer.selectedItems.annotations[0].subject === 'Distance calculation') {
                    cursorType = !isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings) ?
                        this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Perimeter calculation') {
                    cursorType = !isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings) ?
                        this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Area calculation') {
                    cursorType = !isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings) ?
                        this.pdfViewer.areaSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Radius calculation') {
                    cursorType = !isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings) ?
                        this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Volume calculation') {
                    cursorType = !isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings) ?
                        this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerCursorType : null;
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

    /**
     * @private
     * @param {Actions | string} action - The actions.
     * @returns {ToolBase} - Returns tools.
     */
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

    /**
     * @private
     * @param {MouseEvent | TouchEvent} evt - The events.
     * @returns {void}
     */
    public diagramMouseUp(evt: MouseEvent | TouchEvent): void {
        const allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        this.pdfViewer.enableServerDataBinding(false);
        let touches: TouchList;
        const isAnnotResized: any = (this.action.toLowerCase().includes('resize') || this.action.toLowerCase().includes('connectorsegmentpoint'));
        const isAnnotationDrawn: any = (this.action === 'Drag' || isAnnotResized) || ((this.tool instanceof NodeDrawingTool || this.tool instanceof LineTool || this.tool instanceof PolygonDrawingTool) && (this.tool.dragging && this.tool.drawingObject));
        if (this.tool) {
            if (!this.inAction && (evt as MouseEvent).which !== 3) {
                if (this.action === 'Drag') {
                    this.action = 'Select';
                    const obj: IElement = findActiveElement(evt, this, this.pdfViewer);
                    const isMultipleSelect: boolean = true;
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
                const ctrlKey: boolean = this.isMetaKey(evt);
                const info: Info = { ctrlKey: evt.ctrlKey, shiftKey: evt.shiftKey };
                this.eventArgs.info = info;
                this.eventArgs.clickCount = evt.detail;
                if (evt.type === 'touchend') {
                    this.eventArgs.isTouchMode = true;
                } else {
                    this.eventArgs.isTouchMode = false;
                }
                this.tool.mouseUp(this.eventArgs);
                this.isAnnotationMouseDown = false;
                this.isFormFieldMouseDown = false;
                if ((this.tool instanceof NodeDrawingTool || this.tool instanceof LineTool ||
                    this.tool instanceof PolygonDrawingTool) && !this.tool.dragging) {
                    this.inAction = false;
                    this.isMouseDown = false;
                }
                if (isAnnotationDrawn) {
                    const obj: IElement = findActiveElement(evt, this, this.pdfViewer);
                    if ((this.isShapeAnnotationModule() || this.isCalibrateAnnotationModule())) {
                        this.pdfViewer.annotation.onShapesMouseup(obj as PdfAnnotationBaseModel, evt);
                    }
                }
                this.isAnnotationDrawn = false;
            }
        }
        const target: HTMLElement = evt.target as HTMLElement;
        if (!touches && (evt.cancelable && !(this.isDeviceiOS && !this.pdfViewer.annotationModule)) && this.skipPreventDefault(target)) {
            evt.preventDefault();
        }
        this.eventArgs = {};
        this.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
        if (this.pdfViewer.contextMenuSettings.contextMenuAction === 'MouseUp' && this.pdfViewer.selectedItems && (this.pdfViewer.selectedItems.annotations && this.pdfViewer.selectedItems.annotations.length > 0 ||
            this.pdfViewer.selectedItems.formFields && this.pdfViewer.selectedItems.formFields.length > 0)) {
            this.contextMenuModule.open(this.mouseY, this.mouseX, this.viewerContainer);
        }
    }

    /**
     * @private
     * @param {HTMLElement} target - The target.
     * @returns {boolean} - Returns true or false.
     */
    public skipPreventDefault(target: HTMLElement): boolean {
        let isSkipped: boolean = false;
        let isSkip: boolean = false;
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule &&
            this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus) {
            isSkip = true;
        }
        if (target.parentElement && target.parentElement.className !== 'foreign-object' && !target.classList.contains('e-pv-radio-btn') && !target.classList.contains('e-pv-radiobtn-span') && !target.classList.contains('e-pv-checkbox-div') && !target.classList.contains('e-pdfviewer-formFields')
            && !target.classList.contains('e-pdfviewer-ListBox') && !target.classList.contains('e-pdfviewer-signatureformfields')
            && !((target).className === 'free-text-input' && (target).tagName === 'TEXTAREA')
            && !isSkip && !((target).className === 'e-pv-hyperlink') && target.parentElement.classList.length > 0 && !target.parentElement.classList.contains('e-editable-elements') && !this.isAddComment) {
            isSkipped = true;
        }
        return isSkipped;
    }

    private isMetaKey(evt: MouseEvent | TouchEvent | WheelEvent | KeyboardEvent): boolean {
        return navigator.platform.match('Mac') ? evt.metaKey : evt.ctrlKey;
    }

    /**
     * @private
     * @param {MouseEvent | TouchEvent} evt - The events.
     * @returns {void}
     */
    public diagramMouseDown(evt: MouseEvent | TouchEvent): void {
        if (this.tool instanceof MoveTool && !(this.tool instanceof StampTool) && this.tool['inAction']) {
            this.diagramMouseUp(evt);
            if ((evt as MouseEvent).which === 1) {
                this.preventContextmenu = true;
                setTimeout(() => {
                    this.preventContextmenu = false;
                }, 200);
            }
        }
        const allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        this.pdfViewer.enableServerDataBinding(false);
        let touches: TouchList = null;
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
        if (this.pdfViewer.annotation) {
            const currentActivePageID: number = this.pdfViewer.annotation.getEventPageNumber(evt);
            this.activeElements.activePageID = currentActivePageID >= 0 ? currentActivePageID : this.pdfViewer.currentPageNumber - 1;
        }
        let obj: IElement = findActiveElement(evt, this, this.pdfViewer);
        if (isNullOrUndefined(obj)) {
            const eventTarget: HTMLElement = evt.target as HTMLElement;
            if (!isNullOrUndefined(eventTarget) && !isNullOrUndefined(eventTarget.id)) {
                const id: string = eventTarget.id.split('_')[0];
                obj = (this.pdfViewer.nameTable as any)[`${id}`];
            }
        }
        if ((!isNullOrUndefined(obj)) && ((obj as any).formFieldAnnotationType === 'SignatureField' || (obj as any).formFieldAnnotationType === 'InitialField'  || (obj as any).annotName === 'SignatureField' || (obj as any).annotName === 'InitialField')) {
            this.isSignInitialClick = true;
        }
        else {
            this.isSignInitialClick = false;
        }
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && (obj && !(obj instanceof PdfFormFieldBase))) {
            evt.preventDefault();
        }
        if (this.pdfViewer.annotation && this.pdfViewer.enableStampAnnotations) {
            const stampModule: StampAnnotation = this.pdfViewer.annotationModule.stampAnnotationModule;
            if (stampModule && stampModule.isNewStampAnnot) {
                let stampObj: PdfAnnotationBaseModel = obj as PdfAnnotationBaseModel;
                if (!stampObj && this.pdfViewer.selectedItems.annotations[0]) {
                    stampObj = this.pdfViewer.selectedItems.annotations[0];
                }
                if (stampObj) {
                    this.isViewerMouseDown = false;
                    stampObj.opacity = this.pdfViewer.stampSettings.opacity;
                    this.isNewStamp = true;
                    let opacity: number;
                    if (stampObj.shapeAnnotationType === 'Image') {
                        opacity = this.pdfViewer.customStampSettings.opacity;
                    } else {
                        opacity = this.pdfViewer.stampSettings.opacity;
                    }
                    this.pdfViewer.nodePropertyChange(stampObj, { opacity: opacity });
                    this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = false;
                    if (stampObj.shapeAnnotationType === 'Image' && !this.isAlreadyAdded) {
                        this.stampAdded = true;
                        let stampName: string = stampObj.id;
                        if (stampModule.currentStampAnnotation && stampModule.currentStampAnnotation.signatureName) {
                            stampName = stampModule.currentStampAnnotation.signatureName;
                        }
                        let isSkip: boolean = false;
                        for (let i: number = 0; i < this.customStampCollection.length; i++) {
                            if (this.customStampCollection[parseInt(i.toString(), 10)].customStampName === stampName) {
                                isSkip = true;
                                break;
                            }
                        }
                        if (isSkip) {
                            stampName = stampObj.id;
                        }
                        stampName = stampModule.customStampName ? stampModule.customStampName :
                            stampModule.currentStampAnnotation.signatureName;
                        this.customStampCollection.push({ customStampName: stampName, customStampImageSource: stampObj.data });
                        if (isBlazor()) {
                            this.pdfViewer._dotnetInstance.invokeMethodAsync('UpdateCustomStampCollection', stampName, stampObj.data);
                        }
                    }
                    if (this.pdfViewer.customStampSettings.enableCustomStamp && this.pdfViewer.customStampSettings.isAddToMenu) {
                        this.stampAdded = true;
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
            if (isNullOrUndefined(signObject) && this.pdfViewer.selectedItems.annotations[0]) {
                signObject = this.pdfViewer.selectedItems.annotations[0];
            }
            if (signObject) {
                let signatureData: string = '';
                this.signatureAdded = true;
                this.signatureModule.storeSignatureData(signObject.pageIndex, signObject);
                const bounds: any = { left: signObject.bounds.x, top: signObject.bounds.y, width: signObject.bounds.width,
                    height: signObject.bounds.height };

                if (this.signatureModule.signaturetype === 'Draw') {
                    signatureData = this.signatureModule.saveImageString;
                }
                else {
                    signatureData = signObject.data;
                }
                this.pdfViewer.fireSignatureAdd(signObject.pageIndex, signObject.signatureName,
                                                signObject.shapeAnnotationType as AnnotationType, bounds, signObject.opacity,
                                                signObject.strokeColor, signObject.thickness, signatureData);
            }
            this.isNewSignatureAdded = false;
        }
        if (this.pdfViewer.annotationModule) {
            const freeTextAnnotModule: FreeTextAnnotation = this.pdfViewer.annotationModule.freeTextAnnotationModule;
            const canvasPaddingLeft: number = 5; const canvasPaddingWidth: number = 10;
            if (freeTextAnnotModule.isNewFreeTextAnnot === true) {
                let canvas: Rect;
                if (evt.target && ((evt.target as PdfAnnotationBaseModel).id.indexOf('_text') > -1 || (evt.target as PdfAnnotationBaseModel).id.indexOf('_annotationCanvas') > -1 || (evt.target as HTMLElement).classList.contains('e-pv-hyperlink')) && this.pdfViewer.annotation) {
                    const pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(evt);
                    const diagram: HTMLElement = this.getAnnotationCanvas('_annotationCanvas_', pageIndex);
                    if (diagram) {
                        const canvas1: Rect = diagram.getBoundingClientRect() as any;
                        const left: number = canvas1.x ? canvas1.x : canvas1.left;
                        const top: number = canvas1.y ? canvas1.y : canvas1.top;
                        canvas = new Rect(left + canvasPaddingLeft, top + canvasPaddingLeft, canvas1.width - canvasPaddingWidth,
                                          canvas1.height - canvasPaddingWidth);
                    }
                }
                if (touches) {
                    this.mouseX = touches[0].clientX;
                    this.mouseY = touches[0].clientY;
                }
                if (canvas && canvas.containsPoint({ x: this.mouseX, y: this.mouseY }) && freeTextAnnotModule.isNewAddedAnnot) {
                    const pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(evt);
                    if (!this.pdfViewer.freeTextSettings.enableAutoFit) {
                        const zoomFactor: number = this.getZoomFactor();
                        const width: number = this.currentPosition.x + (freeTextAnnotModule.defautWidth * zoomFactor);
                        const pageWidth: number = this.getPageWidth(pageIndex);
                        if (width >= pageWidth) {
                            this.currentPosition.x = pageWidth - (freeTextAnnotModule.defautWidth * zoomFactor);
                            if (this.currentPosition.x <= 0) {
                                this.currentPosition.x = canvasPaddingLeft;
                            }
                            freeTextAnnotModule.defautWidth = (freeTextAnnotModule.defautWidth * zoomFactor) >=
                            pageWidth ? pageWidth - canvasPaddingWidth : freeTextAnnotModule.defautWidth;
                        }
                    }
                    freeTextAnnotModule.addInuptElemet(this.currentPosition, null, pageIndex);
                    if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {

                        const annotModule: any = this.pdfViewer.toolbar.annotationToolbarModule;
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

                if (obj && (obj as any).annotationSettings && (obj as any).annotationSettings.isLock) {
                    if (this.action === 'Select') {
                        if (!this.pdfViewer.annotationModule.checkAllowedInteractions('Select', obj)) {
                            this.action = '';
                        }
                    }
                    if (this.action === 'Drag') {
                        if (!this.pdfViewer.annotationModule.checkAllowedInteractions('Move', obj)) {
                            this.action = 'Select';
                        }
                    }
                    if (this.action === 'Rotate') {
                        this.action = 'Select';
                    }

                    if (this.action === 'ResizeSouthEast' || this.action === 'ResizeNorthEast' || this.action === 'ResizeNorthWest' || this.action === 'ResizeSouthWest' || this.action === 'ResizeSouth' ||
                        this.action === 'ResizeNorth' || this.action === 'ResizeWest' || this.action === 'ResizeEast' || this.action.includes('ConnectorSegmentPoint') || this.action.includes('Leader')) {
                        if (!this.pdfViewer.annotationModule.checkAllowedInteractions('Resize', obj)) {
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
            this.isFormFieldMouseDown = false;
            this.isAnnotationMouseMove = false;
            this.isFormFieldMouseMove = false;
            if (!isNullOrUndefined(obj) && (obj as any).propName !== 'annotations')
            {
                this.eventArgs.source = obj;
            }
            this.tool.mouseDown(this.eventArgs);
            this.isAnnotationDrawn = true;
            this.signatureAdded = true;
        }
        if (this.pdfViewer.annotation) {
            this.pdfViewer.annotation.onAnnotationMouseDown();
        }
        if (this.pdfViewer.selectedItems && this.pdfViewer.selectedItems.formFields.length === 1) {
            if (!isNullOrUndefined(this.pdfViewer.toolbar) && !isNullOrUndefined(this.pdfViewer.toolbar.formDesignerToolbarModule)) {
                this.pdfViewer.toolbar.formDesignerToolbarModule.showHideDeleteIcon(true);
            }
        }
        let signatureFieldAnnotation: any = this.pdfViewer.selectedItems.annotations.length === 1 ? (this.pdfViewer.nameTable as any)[this.pdfViewer.selectedItems.annotations[0].id.split('_')[0] + '_content'] : null;
        if (!signatureFieldAnnotation) {
            signatureFieldAnnotation = this.pdfViewer.selectedItems.annotations.length === 1 ?
                (this.pdfViewer.nameTable as any)[this.pdfViewer.selectedItems.annotations[0].id] : null;
        }
        if (this.eventArgs && this.eventArgs.source && ((this.eventArgs.source as PdfFormFieldBaseModel).formFieldAnnotationType ||
        signatureFieldAnnotation) && !this.pdfViewer.designerMode) {
            let currentObject: any;
            if (signatureFieldAnnotation) {
                currentObject = (this.pdfViewer.nameTable as any)[this.pdfViewer.selectedItems.annotations[0].id.split('_')[0]];
            } else {
                currentObject = this.eventArgs.source;
            }
            if (!currentObject) {
                currentObject = this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.
                    findIndex((el: any) => el.id === signatureFieldAnnotation.id)];
            }
            if (currentObject) {
                const field: any = {
                    name: currentObject.name, id: currentObject.id, fontFamily: currentObject.fontFamily,
                    fontSize: currentObject.fontSize, fontStyle: (currentObject as any).fontStyle,
                    color: (currentObject as PdfFormFieldBaseModel).color, value: currentObject.value,
                    type: currentObject.formFieldAnnotationType ? currentObject.formFieldAnnotationType : currentObject.type,
                    backgroundColor: (currentObject as PdfFormFieldBaseModel).backgroundColor,
                    alignment: (currentObject as any).alignment, bounds: currentObject.bounds
                };
                let target: any = document.getElementById(currentObject.id);
                target = target ? target : (document.getElementById(currentObject.id + '_content_html_element') ? document.getElementById(currentObject.id + '_content_html_element').children[0].children[0] : null);
                if (target) {
                    this.currentTarget = target;
                    this.pdfViewer.fireFormFieldClickEvent('formFieldClicked', field as unknown as FormFieldModel, false, (evt as any).button === 0);
                }
            }
        }
        this.initialEventArgs = { source: this.eventArgs.source, sourceWrapper: this.eventArgs.sourceWrapper };
        this.initialEventArgs.position = this.currentPosition;
        this.initialEventArgs.info = this.eventArgs.info;
        this.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
    }

    /**
     * @param {AnnotationDataFormat} annotationDataFormat - It describes about the annotaiton data format
     * @private
     * @returns {any} - any
     */
    public exportAnnotationsAsObject(annotationDataFormat?: AnnotationDataFormat): any {
        if (this.pdfViewer.annotationModule) {
            const isAnnotations: boolean = this.updateExportItem();
            if (isAnnotations) {
                return new Promise((resolve: Function, reject: Function) => {
                    this.createRequestForExportAnnotations(true, annotationDataFormat).then((value: object) => {
                        resolve(value);
                    });
                });
            }
        }
    }

    /**
     * @private
     * @param {string} type - The type.
     * @returns {any} - any
     */
    public getItemFromSessionStorage(type: string): string {
        if (this.isStorageExceed) {
            return this.formFieldStorage[this.documentId + type];
        } else {
            return PdfViewerBase.sessionStorageManager.getItem(this.documentId + type);
        }
    }

    /**
     * @param {HTMLElement} textDiv - It describes about the whether the text div element
     * @param {number} left - It describes about the left value
     * @param {number} top - It describes about the top value
     * @param {number} fontHeight - It describes about the font height
     * @param {number} width - It describes about the width
     * @param {number} height - It describes about the height
     * @param {boolean} isPrint - It describes about the isPrint is true or not
     * @private
     * @returns {void}
     */
    public setStyleToTextDiv(textDiv: HTMLElement, left: number, top: number, fontHeight: number, width: number,
                             height: number, isPrint: boolean): void {
        let zoomvalue: number = this.getZoomFactor();
        if (isPrint) {
            zoomvalue = 1;
            textDiv.style.position = 'absolute';
        }
        textDiv.style.left = left * zoomvalue + 'px';
        textDiv.style.top = top * zoomvalue + 'px';
        textDiv.style.height = height * zoomvalue + 'px';
        textDiv.style.width = width * zoomvalue + 'px';
        textDiv.style.margin = '0px';
        if (fontHeight > 0) {
            textDiv.style.fontSize = fontHeight * zoomvalue + 'px';
        }
    }

    /**
     * @param {any} number - It describes about the number
     * @private
     * @returns {number} - number
     */
    public ConvertPointToPixel(number: any): number {
        return (number * (96 / 72));
    }

    /**
     * @param {number} rotation - It describes about the number
     * @private
     * @returns {number} - number
     */
    public getAngle(rotation: number): number {
        let angle: number = 0;
        if (rotation) {
            switch (rotation) {
            case 0:
                angle = 0;
                break;
            case 1:
                angle = 90;
                break;
            case 2:
                angle = 180;
                break;
            case 3:
                angle = 270;
                break;
            }
        }
        return angle;
    }

    /**
     * @param {any} formFieldsData - It describes about the form fields data
     * @param {string} type - It describes about the type
     * @private
     * @returns {void}
     */
    public setItemInSessionStorage(formFieldsData: any, type: string): void {
        const formFieldsSize: number = Math.round(JSON.stringify(formFieldsData).length / 1024);
        const sessionSize: number = PdfViewerBase.sessionStorageManager.getWindowSessionStorageSize();
        if (formFieldsSize > 4500) {
            this.isStorageExceed = true;
            if (this.pdfViewer.formFieldsModule) {
                if (!(this.isFormStorageExceed)) {
                    this.pdfViewer.formFieldsModule.clearFormFieldStorage();
                    this.isFormStorageExceed = true;
                }
            }
        }
        if (this.isStorageExceed) {
            this.formFieldStorage[this.documentId + type] = JSON.stringify(formFieldsData);
        }
        else if ((formFieldsSize + sessionSize) > 4500) {
            this.isStorageExceed = true;
            if (this.pdfViewer.formFieldsModule) {
                this.pdfViewer.formFieldsModule.clearFormFieldStorage();
            }
            this.isFormStorageExceed = true;
            if (this.pdfViewer.annotationModule) {
                this.pdfViewer.annotationModule.clearAnnotationStorage();
            }
            this.formFieldStorage[this.documentId + type] = JSON.stringify(formFieldsData);
        } else {
            if (!isNullOrUndefined(formFieldsData)) {
                PdfViewerBase.sessionStorageManager.setItem(this.documentId + type, JSON.stringify(formFieldsData));
            }
        }
    }

    /**
     * @param {FormFieldDataFormat} formFieldDataFormat - It describes about the form field data format
     * @private
     * @returns {any} - any
     */
    public exportFormFieldsAsObject(formFieldDataFormat?: FormFieldDataFormat): any {
        if (this.pdfViewer.formFieldsModule) {
            return new Promise((resolve: Function, reject: Function) => {
                this.createRequestForExportFormfields(true, formFieldDataFormat).then((value: object) => {
                    resolve(value);
                });
            });
        }
    }

    /**
     * @param {any} importData - It describes about the imported data
     * @param {AnnotationDataFormat} annotationDataFormat -It describes about the annotaiton data format
     * @param {boolean} isXfdf - It describes about the whether the isXfdf is true or not
     * @private
     * @returns {void}
     */
    public importAnnotations(importData: any, annotationDataFormat?: AnnotationDataFormat, isXfdf?: boolean): void {
        if (this.pdfViewer.annotationModule) {
            this.createRequestForImportAnnotations(importData, annotationDataFormat, isXfdf);
        }
    }

    /**
     * @private
     * @param {AnnotationDataFormat} annotationDataFormat - The annotationDataFormat.
     * @returns {void}
     */
    public exportAnnotations(annotationDataFormat?: AnnotationDataFormat): void {
        if (this.pdfViewer.annotationModule) {
            const isAnnotations: boolean = this.updateExportItem();
            if (isAnnotations) {
                this.createRequestForExportAnnotations(false, annotationDataFormat);
            }
        }
    }

    /**
     * @param {boolean} isObject - It describes about the whether the isObject is true or not
     * @param {AnnotationDataFormat} annotationDataFormat - It describes about the annotation data format
     * @param {boolean} isBase64String - It describes about the whether the isBase64String is true or not
     * @private
     * @returns {any} - any
     */
    public createRequestForExportAnnotations(isObject?: boolean, annotationDataFormat?: AnnotationDataFormat,
                                             isBase64String?: boolean): any {
        let proxy: PdfViewerBase = null;
        // eslint-disable-next-line
        proxy = this;
        const promise: Promise<Blob> = new Promise((resolve: Function, reject: Function) => {
            let canExport: boolean = false;
            const jsonObject: any = this.constructJsonDownload();
            jsonObject.annotationDataFormat = annotationDataFormat;
            jsonObject['action'] = 'ExportAnnotations';
            canExport = proxy.pdfViewer.fireExportStart(jsonObject);
            if (canExport) {
                if (proxy.jsonDocumentId) {
                    (jsonObject as any).document = proxy.jsonDocumentId;
                }
                const url: string = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.exportAnnotations;
                proxy.exportAnnotationRequestHandler = new AjaxHandler(this.pdfViewer);
                proxy.exportAnnotationRequestHandler.url = url;
                proxy.exportAnnotationRequestHandler.mode = true;
                proxy.exportAnnotationRequestHandler.responseType = 'text';
                if (!this.clientSideRendering) {
                    proxy.exportAnnotationRequestHandler.send(jsonObject);
                }
                else {
                    const resultData: Uint8Array = this.pdfViewer.pdfRendererModule.exportAnnotation(jsonObject, isObject);
                    if (isObject) {
                        proxy.exportAnnotationFileDownload(resultData, proxy, annotationDataFormat, jsonObject, isObject,
                                                           isBase64String).then(function (annotData: any): void {
                            resolve(annotData);
                        });
                    } else {
                        proxy.exportAnnotationFileDownload(resultData, proxy, annotationDataFormat, jsonObject, isObject,
                                                           isBase64String).then(function (annotData: any): void {
                            resolve(annotData);
                        });
                    }
                }
                proxy.exportAnnotationRequestHandler.onSuccess = function (result: any): void {
                    const data: any = result.data;
                    const redirect: boolean = proxy.checkRedirection(data);
                    if (!redirect) {
                        if (data) {
                            if (isObject) {
                                proxy.exportAnnotationFileDownload(data, proxy, annotationDataFormat, jsonObject, isObject,
                                                                   isBase64String).then(function (annotData: any): void {
                                    resolve(annotData);
                                });
                            } else {
                                proxy.exportAnnotationFileDownload(data, proxy, annotationDataFormat, jsonObject, isObject,
                                                                   isBase64String).then(function (annotData: any): void {
                                    resolve(annotData);
                                });
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
                    }
                };
                proxy.exportAnnotationRequestHandler.onFailure = function (result: any): void {
                    proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, result.statusText);
                };

                proxy.exportAnnotationRequestHandler.onError = function (result: any): void {
                    proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, result.statusText);
                };
            }
        });
        if (isObject || isBase64String) {
            return promise;
        } else {
            return true;
        }
    }

    private handleServerSideExport(data: any, proxy: PdfViewerBase, annotationDataFormat: AnnotationDataFormat,
                                   jsonObject: any, isObject: boolean, isBase64String: boolean): Promise<string> {
        return new Promise((resolve: any) => {
            if (data) {
                if (typeof data === 'object') {
                    data = JSON.parse(data);
                }
                if (data) {
                    const isCancel: boolean = proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.
                        exportAnnotations, data);
                    if (isObject || (isBase64String && !isBlazor())) {
                        if (data.split('base64,')[1]) {
                            let exportObject: string = data;
                            let annotationJson: string = atob(data.split(',')[1]);
                            if (isObject) {
                                if (jsonObject.annotationDataFormat === 'Json') {
                                    annotationJson = proxy.getSanitizedString(annotationJson);
                                    exportObject = JSON.parse(annotationJson);
                                } else {
                                    exportObject = annotationJson;
                                }
                            }
                            if (proxy.pdfViewer.exportAnnotationFileName !== null) {
                                proxy.pdfViewer.fireExportSuccess(exportObject, proxy.pdfViewer.exportAnnotationFileName);
                            } else {
                                proxy.pdfViewer.fireExportSuccess(exportObject, proxy.pdfViewer.fileName);
                            }
                            proxy.updateDocumentAnnotationCollections();
                            if (isBase64String) {
                                resolve(data);
                            } else {
                                resolve(annotationJson);
                            }
                        } else {
                            proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                        }
                    } else {
                        if (annotationDataFormat === 'Json') {
                            if (data.split('base64,')[1]) {
                                if (!isCancel) {
                                    const blobUrl: string = proxy.createBlobUrl(data.split('base64,')[1], 'application/json');
                                    if (Browser.isIE || Browser.info.name === 'edge') {
                                        if (proxy.pdfViewer.exportAnnotationFileName !== null) {

                                            window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.exportAnnotationFileName.split('.')[0] + '.json');
                                        } else {
                                            window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.fileName.split('.')[0] + '.json');
                                        }
                                    } else {
                                        proxy.downloadExportFormat(blobUrl, annotationDataFormat);
                                    }
                                    proxy.updateDocumentAnnotationCollections();
                                } else {
                                    return data;
                                }
                            } else {
                                if (isBlazor()) {
                                    const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_ExportFailed');
                                    promise.then((value: string) => {
                                        proxy.openImportExportNotificationPopup(value);
                                    });
                                } else {
                                    proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                                }
                                proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                            }
                        } else {
                            if (data.split('base64,')[1]) {
                                if (!isCancel) {
                                    const blobUrl: string = proxy.createBlobUrl(data.split('base64,')[1], 'application/vnd.adobe.xfdf');
                                    if (Browser.isIE || Browser.info.name === 'edge') {
                                        window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.fileName.split('.')[0] + '.xfdf');
                                    } else {
                                        proxy.downloadExportFormat(blobUrl, annotationDataFormat);
                                    }
                                    proxy.updateDocumentAnnotationCollections();
                                } else {
                                    return data;
                                }
                            } else {
                                if (isBlazor()) {
                                    const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_ExportFailed');
                                    promise.then((value: string) => {
                                        proxy.openImportExportNotificationPopup(value);
                                    });
                                } else {
                                    proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                                }
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
                        proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                        proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.exportAnnotations);
                        data = null;
                    }
                }
            }
            return '';
        });
    }

    private handleClientSideExport(data: any, proxy: PdfViewerBase, annotationDataFormat: AnnotationDataFormat,
                                   jsonObject: any, isObject: boolean, isBase64String: boolean): Promise<string> {
        return new Promise((resolve: any) => {
            if (data) {
                if (data) {
                    const isCancel: boolean = proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.
                        exportAnnotations, data);
                    if (isObject || (isBase64String && !isBlazor())) {
                        if (data && (typeof data !== 'string')) {
                            let exportObject: any = data;
                            const decoder: any = new TextDecoder('utf-8');
                            let annotationJson: any = decoder.decode(data);
                            if (isObject) {
                                if (jsonObject.annotationDataFormat === 'Json') {
                                    annotationJson = proxy.getSanitizedString(annotationJson);
                                    exportObject = JSON.parse(annotationJson);
                                } else {
                                    exportObject = annotationJson;
                                }
                            }
                            if (proxy.pdfViewer.exportAnnotationFileName !== null) {
                                proxy.pdfViewer.fireExportSuccess(exportObject, proxy.pdfViewer.exportAnnotationFileName);
                            } else {
                                proxy.pdfViewer.fireExportSuccess(exportObject, proxy.pdfViewer.fileName);
                            }
                            proxy.updateDocumentAnnotationCollections();
                            if (isBase64String) {
                                resolve(data);
                            } else {
                                resolve(annotationJson);
                            }
                        } else {
                            proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                        }
                    } else {
                        if (annotationDataFormat === 'Json') {
                            if (data && (typeof data !== 'string')) {
                                if (!isCancel) {
                                    const blobUrl: any = new Blob([data], { type: 'application/json' });
                                    if (Browser.isIE || Browser.info.name === 'edge') {
                                        if (proxy.pdfViewer.exportAnnotationFileName !== null) {

                                            window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.exportAnnotationFileName.split('.')[0] + '.json');
                                        } else {
                                            window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.fileName.split('.')[0] + '.json');
                                        }
                                    } else {
                                        proxy.downloadExportFormat(blobUrl, annotationDataFormat);
                                    }
                                    proxy.updateDocumentAnnotationCollections();
                                } else {
                                    return data;
                                }
                            } else {
                                if (isBlazor()) {
                                    const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_ExportFailed');
                                    promise.then((value: string) => {
                                        proxy.openImportExportNotificationPopup(value);
                                    });
                                } else {
                                    proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                                }
                                proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                            }
                        } else {
                            if (data && (typeof data !== 'string')) {
                                if (!isCancel) {
                                    const blobUrl: any = new Blob([data], { type: 'application/vnd.adobe.xfdf' });
                                    if (Browser.isIE || Browser.info.name === 'edge') {
                                        window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.fileName.split('.')[0] + '.xfdf');
                                    } else {
                                        proxy.downloadExportFormat(blobUrl, annotationDataFormat);
                                    }
                                    proxy.updateDocumentAnnotationCollections();
                                } else {
                                    return data;
                                }
                            } else {
                                if (isBlazor()) {
                                    const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_ExportFailed');
                                    promise.then((value: string) => {
                                        proxy.openImportExportNotificationPopup(value);
                                    });
                                } else {
                                    proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                                }
                                proxy.pdfViewer.fireExportFailed(jsonObject, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                            }
                        }
                    }
                }
            } else {
                try {
                    if (typeof data === 'string') {
                        proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.exportAnnotations);
                        data = null;
                    }
                } catch (error) {
                    proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                    proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.exportAnnotations);
                    data = null;
                }
            }
            return '';
        });
    }

    private exportAnnotationFileDownload(data: any, proxy: PdfViewerBase, annotationDataFormat: AnnotationDataFormat,
                                         jsonObject: any, isObject: boolean, isBase64String: boolean): Promise<string> {
        if (!this.clientSideRendering) {
            return this.handleServerSideExport(data, proxy, annotationDataFormat, jsonObject, isObject, isBase64String);
        }
        else {
            return this.handleClientSideExport(data, proxy, annotationDataFormat, jsonObject, isObject, isBase64String);
        }
    }

    private getDataOnSuccess(resultData: any): Promise<any> {
        // eslint-disable-next-line
        return new Promise((resolve) => {
            let proxy: PdfViewerBase = null;
            // eslint-disable-next-line
            proxy = this;
            proxy.pdfViewer.fireExportSuccess(resultData, proxy.pdfViewer.fileName);
            proxy.updateDocumentAnnotationCollections();
            resolve(resultData);
        });
    }

    /**
     * @param {any} newData - It describes about the new data
     * @param {any} annotationType - It describes about the annotation type
     * @private
     * @returns {void}
     */
    public updateModifiedDateToLocalDate(newData: any, annotationType: any): void {
        if (newData[`${annotationType}`] && newData[`${annotationType}`].length > 0) {
            const data: any = newData[`${annotationType}`];
            if (data) {
                for (let j: number = 0; j < data.length; j++) {
                    data[parseInt(j.toString(), 10)].ModifiedDate =
                    this.convertUTCDateTimeToLocalDateTime(data[parseInt(j.toString(), 10)].ModifiedDate);
                    if (data[parseInt(j.toString(), 10)].Comments) {
                        for (let i: number = 0; i < data[parseInt(j.toString(), 10)].Comments.length; i++) {
                            data[parseInt(j.toString(), 10)].Comments[parseInt(i.toString(), 10)].ModifiedDate =
                            this.convertUTCDateTimeToLocalDateTime(data[parseInt(j.toString(), 10)].
                                Comments[parseInt(i.toString(), 10)].ModifiedDate);
                        }
                    }
                }
            }
        }
    }

    /**
     * @param {any} date - It describes about the date
     * @private
     * @returns {void}
     */
    public convertUTCDateTimeToLocalDateTime(date: any): string {
        let dateTime: Date;
        // We have globalized the date and time based on the given locale.
        this.globalize = new Internationalization(this.pdfViewer.locale);
        if (date !== null && date !== undefined && date !== '') {
            if (!this.clientSideRendering) {
                dateTime = new Date(Date.parse(date + ' ' + 'UTC'));
            }
            else {
                dateTime = new Date(date);
            }
        }
        else {
            const now: Date = new Date() as Date;
            const nowUtc: number = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(),
                                            now.getUTCDate(), now.getUTCHours(),
                                            now.getUTCMinutes(), now.getUTCSeconds());
            dateTime = new Date(nowUtc) as Date;
        }
        const dateTimeValue: string = this.globalize.formatDate(dateTime, { format: 'M/d/yyyy h:mm:ss a', type: 'dateTime' });
        return dateTimeValue;
    }

    private createRequestForImportAnnotations(importData: any, annotationDataFormat?: AnnotationDataFormat, isXfdf?: boolean): void {
        let jsonObject: object;
        let proxy: PdfViewerBase = null;
        // eslint-disable-next-line
        proxy = this;
        if (!isXfdf && proxy.isPDFViewerJson) {
            this.isJsonImported = true;
        } else {
            this.isJsonImported = false;
        }
        if (typeof importData === 'object' && !(importData instanceof Uint8Array)) {
            if (importData && importData.pdfAnnotation) {
                const newArray: string[] = Object.keys(importData.pdfAnnotation);
                for (let i: number = 0; i < newArray.length; i++) {
                    const newData: any = importData.pdfAnnotation[newArray[parseInt(i.toString(), 10)]];
                    this.updateModifiedDateToLocalDate(newData, 'freeTextAnnotation');
                    this.updateModifiedDateToLocalDate(newData, 'measureShapeAnnotation');
                    this.updateModifiedDateToLocalDate(newData, 'shapeAnnotation');
                    this.updateModifiedDateToLocalDate(newData, 'signatureAnnotation');
                    this.updateModifiedDateToLocalDate(newData, 'signatureInkAnnotation');
                    this.updateModifiedDateToLocalDate(newData, 'stampAnnotations');
                    this.updateModifiedDateToLocalDate(newData, 'stickyNotesAnnotation');
                    this.updateModifiedDateToLocalDate(newData, 'textMarkupAnnotation');

                }

            }
            proxy.reRenderAnnotations(importData.pdfAnnotation);
            proxy.isImportedAnnotation = true;
            proxy.updateDocumentEditedProperty(true);
            if (!this.isAddAnnotation) {
                proxy.pdfViewer.fireImportSuccess(importData.pdfAnnotation);
            }
        } else {
            proxy.pdfViewer.fireImportStart(importData);
            if (annotationDataFormat === 'Json') {
                if (proxy.isPDFViewerJson) {
                    jsonObject = { fileName: importData, action: 'ImportAnnotations', elementId: proxy.pdfViewer.element.id, hashId: proxy.hashId, uniqueId: proxy.documentId, annotationDataFormat: annotationDataFormat };
                } else {
                    jsonObject = { importedData: importData, action: 'ImportAnnotations', elementId: proxy.pdfViewer.element.id, hashId: proxy.hashId, uniqueId: proxy.documentId, annotationDataFormat: annotationDataFormat };
                }
            } else {
                jsonObject = { importedData: importData, action: 'ImportAnnotations', elementId: proxy.pdfViewer.element.id, hashId: proxy.hashId, uniqueId: proxy.documentId, annotationDataFormat: annotationDataFormat };
            }
            jsonObject = Object.assign(jsonObject, this.constructJsonDownload());
            (jsonObject as any)['action'] = 'ImportAnnotations';
            if (proxy.jsonDocumentId) {
                if ((jsonObject as any).documentId) {
                    delete (jsonObject as any)['documentId'];
                }
                (jsonObject as any).document = proxy.jsonDocumentId;
            }
            const url: string = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.importAnnotations;
            proxy.importAnnotationRequestHandler = new AjaxHandler(proxy.pdfViewer);
            proxy.importAnnotationRequestHandler.url = url;
            proxy.importAnnotationRequestHandler.mode = true;
            proxy.importAnnotationRequestHandler.responseType = 'text';
            if (!this.clientSideRendering) {
                proxy.importAnnotationRequestHandler.send(jsonObject);
            }
            else {
                const resultData: any = this.pdfViewer.pdfRendererModule.importAnnotations(jsonObject);
                if (resultData) {
                    this.addAnnotationOnImport(resultData, importData);
                }
            }
            proxy.importAnnotationRequestHandler.onSuccess = function (result: any): void {
                let data: any = result.data;
                const redirect: boolean = proxy.checkRedirection(data);
                if (!redirect) {
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
                                if (isBlazor()) {
                                    const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_FileNotFound');
                                    promise.then((value: string) => {
                                        proxy.openImportExportNotificationPopup(value);
                                    });
                                } else {
                                    proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('File not found'));
                                }
                                proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.importAnnotations);
                                data = null;
                            }
                        }
                        if (data) {
                            proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.importAnnotations, data);
                            if (data.pdfAnnotation) {
                                let newData: any;
                                const newArray: any = Object.keys(data.pdfAnnotation);
                                for (let i: number = 0; i < Object.keys(data.pdfAnnotation).length; i++) {
                                    newData = data.pdfAnnotation[newArray[parseInt(i.toString(), 10)]];
                                    proxy.updateModifiedDateToLocalDate(newData, 'annotationOrder');
                                    proxy.updateModifiedDateToLocalDate(newData, 'freeTextAnnotation');
                                    proxy.updateModifiedDateToLocalDate(newData, 'measureShapeAnnotation');
                                    proxy.updateModifiedDateToLocalDate(newData, 'shapeAnnotation');
                                    proxy.updateModifiedDateToLocalDate(newData, 'signatureAnnotation');
                                    proxy.updateModifiedDateToLocalDate(newData, 'signatureInkAnnotation');
                                    proxy.updateModifiedDateToLocalDate(newData, 'stampAnnotations');
                                    proxy.updateModifiedDateToLocalDate(newData, 'stickyNotesAnnotation');
                                    proxy.updateModifiedDateToLocalDate(newData, 'textMarkupAnnotation');
                                }
                                proxy.reRenderAnnotations(data.pdfAnnotation);
                                proxy.isImportedAnnotation = true;
                                proxy.updateDocumentEditedProperty(true);
                                proxy.pdfViewer.fireImportSuccess(data.pdfAnnotation);
                            }
                        }
                    }
                }
            };
            proxy.importAnnotationRequestHandler.onFailure = function (result: any): void {
                proxy.pdfViewer.fireImportFailed(importData, result.statusText);
            };
            proxy.importAnnotationRequestHandler.onError = function (result: any): void {
                proxy.pdfViewer.fireImportFailed(importData, result.statusText);
            };
        }
    }

    private addAnnotationOnImport(resultData: any, importData: any): void {
        let proxy: PdfViewerBase = null;
        // eslint-disable-next-line
        proxy = this;
        if (resultData) {
            proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.importAnnotations, resultData);
            if (resultData.pdfAnnotation) {
                let newData: any;
                const newArray: any = Object.keys(resultData.pdfAnnotation);
                for (let i: number = 0; i < Object.keys(resultData.pdfAnnotation).length; i++) {
                    newData = resultData.pdfAnnotation[newArray[parseInt(i.toString(), 10)]];
                    proxy.updateModifiedDateToLocalDate(newData, 'annotationOrder');
                    proxy.updateModifiedDateToLocalDate(newData, 'freeTextAnnotation');
                    proxy.updateModifiedDateToLocalDate(newData, 'measureShapeAnnotation');
                    proxy.updateModifiedDateToLocalDate(newData, 'shapeAnnotation');
                    proxy.updateModifiedDateToLocalDate(newData, 'signatureAnnotation');
                    proxy.updateModifiedDateToLocalDate(newData, 'signatureInkAnnotation');
                    proxy.updateModifiedDateToLocalDate(newData, 'stampAnnotations');
                    proxy.updateModifiedDateToLocalDate(newData, 'stickyNotesAnnotation');
                    proxy.updateModifiedDateToLocalDate(newData, 'textMarkupAnnotation');
                }
                proxy.reRenderAnnotations(resultData.pdfAnnotation);
                proxy.isImportedAnnotation = true;
                proxy.updateDocumentEditedProperty(true);
                proxy.pdfViewer.fireImportSuccess(resultData.pdfAnnotation);
            } else {
                proxy.pdfViewer.fireImportFailed(importData, proxy.pdfViewer.localeObj.getConstant('File not found'));
            }
        }
    }

    /**
     * @private
     * @param {string} errorDetails - The error details.
     * @returns {void}
     */
    public openImportExportNotificationPopup(errorDetails: string): void {
        if (this.pdfViewer.showNotificationDialog) {
            this.createNotificationPopup(errorDetails);
        }
    }

    private reRenderAnnotations(annotation: any): void {
        if (annotation) {
            this.isImportAction = true;
            let count: number = 0;
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
                if (annotation[parseInt(i.toString(), 10)]) {
                    const importPageCollections: any = [];
                    let textMarkupObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_textMarkup');
                    let shapeObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_shape');
                    let measureShapeObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_shape_measure');
                    let stampObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_stamp');
                    let stickyObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_sticky');
                    let freeTextObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_freetext');
                    const signatureObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_sign');
                    let inkObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_ink');
                    if (this.isStorageExceed) {
                        textMarkupObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
                        shapeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
                        measureShapeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
                        stampObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
                        stickyObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
                        freeTextObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
                        inkObject = this.annotationStorage[this.documentId + '_annotations_ink'];
                    }
                    this.drawPageAnnotations(annotation[parseInt(i.toString(), 10)], i);
                    if (this.isImportedAnnotation) {
                        let isAdded: boolean = false;
                        for (let j: number = 0; j < this.annotationPageList.length; j++) {
                            if (this.annotationPageList[parseInt(j.toString(), 10)] === i) {
                                isAdded = true;
                            }
                        }
                        if (isAdded) {
                            this.annotationPageList[parseInt(count.toString(), 10)] = i;
                            count = count + 1;
                        }
                    } else {
                        this.annotationPageList[parseInt(count.toString(), 10)] = i;
                        count = count + 1;
                    }
                    if (annotation[parseInt(i.toString(), 10)].textMarkupAnnotation &&
                    annotation[parseInt(i.toString(), 10)].textMarkupAnnotation.length !== 0) {
                        if (textMarkupObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(textMarkupObject);
                            annotation[parseInt(i.toString(), 10)].textMarkupAnnotation =
                            this.checkAnnotationCollections(annotObject, annotation[parseInt(i.toString(), 10)].textMarkupAnnotation, i);
                        }
                        annotation[parseInt(i.toString(), 10)].textMarkupAnnotation =
                        this.checkAnnotationCommentsCollections(annotation[parseInt(i.toString(), 10)].textMarkupAnnotation, i);
                        importPageCollections.textMarkupAnnotation = annotation[parseInt(i.toString(), 10)].textMarkupAnnotation;
                    }
                    if (annotation[parseInt(i.toString(), 10)].shapeAnnotation &&
                    annotation[parseInt(i.toString(), 10)].shapeAnnotation.length !== 0) {
                        if (shapeObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(shapeObject);
                            annotation[parseInt(i.toString(), 10)].shapeAnnotation =
                            this.checkAnnotationCollections(annotObject, annotation[parseInt(i.toString(), 10)].shapeAnnotation, i);
                        }
                        annotation[parseInt(i.toString(), 10)].shapeAnnotation =
                        this.checkAnnotationCommentsCollections(annotation[parseInt(i.toString(), 10)].shapeAnnotation, i);
                        importPageCollections.shapeAnnotation = annotation[parseInt(i.toString(), 10)].shapeAnnotation;
                    }
                    if (annotation[parseInt(i.toString(), 10)].measureShapeAnnotation &&
                    annotation[parseInt(i.toString(), 10)].measureShapeAnnotation.length !== 0) {
                        if (measureShapeObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(measureShapeObject);

                            annotation[parseInt(i.toString(), 10)].measureShapeAnnotation =
                            this.checkAnnotationCollections(annotObject, annotation[parseInt(i.toString(), 10)].measureShapeAnnotation, i);
                        }
                        annotation[parseInt(i.toString(), 10)].measureShapeAnnotation =
                        this.checkAnnotationCommentsCollections(annotation[parseInt(i.toString(), 10)].measureShapeAnnotation, i);
                        importPageCollections.measureShapeAnnotation = annotation[parseInt(i.toString(), 10)].measureShapeAnnotation;
                    }
                    if (annotation[parseInt(i.toString(), 10)].stampAnnotations &&
                    annotation[parseInt(i.toString(), 10)].stampAnnotations.length !== 0) {
                        if (stampObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(stampObject);
                            annotation[parseInt(i.toString(), 10)].stampAnnotations =
                            this.checkAnnotationCollections(annotObject, annotation[parseInt(i.toString(), 10)].stampAnnotations, i);
                        }
                        annotation[parseInt(i.toString(), 10)].stampAnnotations =
                        this.checkAnnotationCommentsCollections(annotation[parseInt(i.toString(), 10)].stampAnnotations, i);
                        importPageCollections.stampAnnotations = annotation[parseInt(i.toString(), 10)].stampAnnotations;
                    }
                    if (annotation[parseInt(i.toString(), 10)].stickyNotesAnnotation &&
                    annotation[parseInt(i.toString(), 10)].stickyNotesAnnotation.length !== 0) {
                        if (stickyObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(stickyObject);
                            annotation[parseInt(i.toString(), 10)].stickyNotesAnnotation =
                            this.checkAnnotationCollections(annotObject, annotation[parseInt(i.toString(), 10)].stickyNotesAnnotation, i);
                        }
                        annotation[parseInt(i.toString(), 10)].stickyNotesAnnotation =
                        this.checkAnnotationCommentsCollections(annotation[parseInt(i.toString(), 10)].stickyNotesAnnotation, i);
                        importPageCollections.stickyNotesAnnotation = annotation[parseInt(i.toString(), 10)].stickyNotesAnnotation;
                    }
                    if (annotation[parseInt(i.toString(), 10)].freeTextAnnotation &&
                    annotation[parseInt(i.toString(), 10)].freeTextAnnotation.length !== 0) {
                        if (freeTextObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(freeTextObject);
                            annotation[parseInt(i.toString(), 10)].freeTextAnnotation =
                            this.checkAnnotationCollections(annotObject, annotation[parseInt(i.toString(), 10)].freeTextAnnotation, i);
                        }
                        annotation[parseInt(i.toString(), 10)].freeTextAnnotation =
                        this.checkAnnotationCommentsCollections(annotation[parseInt(i.toString(), 10)].freeTextAnnotation, i);
                        importPageCollections.freeTextAnnotation = annotation[parseInt(i.toString(), 10)].freeTextAnnotation;
                    }
                    if (annotation[parseInt(i.toString(), 10)].signatureAnnotation &&
                    annotation[parseInt(i.toString(), 10)].signatureAnnotation.length !== 0) {
                        if (signatureObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(signatureObject);
                            annotation[parseInt(i.toString(), 10)].signatureAnnotation =
                            this.checkSignatureCollections(annotObject, annotation[parseInt(i.toString(), 10)].signatureAnnotation, i);
                        }
                        importPageCollections.signatureAnnotation = annotation[parseInt(i.toString(), 10)].signatureAnnotation;
                    }
                    if (annotation[parseInt(i.toString(), 10)].signatureInkAnnotation &&
                    annotation[parseInt(i.toString(), 10)].signatureInkAnnotation.length !== 0) {
                        if (inkObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(inkObject);
                            annotation[parseInt(i.toString(), 10)].signatureInkAnnotation =
                            this.checkAnnotationCollections(annotObject, annotation[parseInt(i.toString(), 10)].signatureInkAnnotation, i);
                        }
                        annotation[parseInt(i.toString(), 10)].signatureInkAnnotation =
                        this.checkAnnotationCommentsCollections(annotation[parseInt(i.toString(), 10)].signatureInkAnnotation, i);
                        importPageCollections.signatureInkAnnotation = annotation[parseInt(i.toString(), 10)].signatureInkAnnotation;
                    }
                    if (annotation[parseInt(i.toString(), 10)].annotationOrder) {
                        const annotationOrderCollection: any = annotation[parseInt(i.toString(), 10)].annotationOrder;
                        let annotationData: any = [];
                        for (let index: number = 0; index < annotationOrderCollection.length; index++) {
                            const annotationName: any = annotationOrderCollection[parseInt(index.toString(), 10)].AnnotType ?
                                annotationOrderCollection[parseInt(index.toString(), 10)].AnnotType :
                                annotationOrderCollection[parseInt(index.toString(), 10)].AnnotationType;
                            annotationData.push(annotationOrderCollection[parseInt(index.toString(), 10)]);
                            let annotObject: IPageAnnotations[];
                            switch (annotationName) {
                            case 'textMarkup':
                                if (annotation[parseInt(i.toString(), 10)].textMarkupAnnotation.length !== 0 ||
                                annotationData.length !== 0) {
                                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotationData, i);
                                    for (let j: number = 0; j < annotationData.length; j++) {
                                        if (!isNullOrUndefined(this.pdfViewer.annotationModule.textMarkupAnnotationModule)) {
                                            this.pdfViewer.annotationModule.
                                                stickyNotesAnnotationModule.
                                                updateCollections(this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                                                    updateTextMarkupAnnotationCollections(annotationOrderCollection[
                                                        parseInt(index.toString(), 10)], i));
                                        }
                                    }
                                }
                                break;
                            case 'shape':
                                if (annotation[parseInt(i.toString(), 10)].shapeAnnotation.length !== 0 || annotationData.length !== 0) {
                                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotationData, i);
                                    const shapeAnnotations: any = annotation[parseInt(i.toString(), 10)].shapeAnnotation[0];
                                    if (annotation[parseInt(i.toString(), 10)].shapeAnnotation.length > 0 &&
                                    shapeAnnotations && shapeAnnotations.AnnotName) {
                                        const annotName: any = annotation[parseInt(i.toString(), 10)].shapeAnnotation[0].AnnotName;
                                        const addedAnnot: any = this.pdfViewer.annotationCollection.find(
                                            (annot: any) => annot.annotationId === annotName
                                        );
                                        if (addedAnnot && addedAnnot.enableShapeLabel && addedAnnot.labelContent) {
                                            this.pdfViewer.annotation.stickyNotesAnnotationModule.
                                                addTextToComments(addedAnnot.annotationId, addedAnnot.labelContent);
                                        }
                                    }
                                    for (let j: number = 0; j < annotationData.length; j++) {
                                        this.pdfViewer.annotationModule.
                                            stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.
                                                shapeAnnotationModule.updateShapeAnnotationCollections(annotationOrderCollection[
                                                    parseInt(index.toString(), 10)], i));
                                    }
                                }
                                break;
                            case 'shape_measure':
                                if (annotation[parseInt(i.toString(), 10)].measureShapeAnnotation.length !== 0 ||
                                annotationData.length !== 0) {
                                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotationData, i);
                                    for (let j: number = 0; j < annotationData.length; j++) {
                                        this.pdfViewer.annotationModule.
                                            stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.
                                                measureAnnotationModule.updateMeasureAnnotationCollections(annotationOrderCollection[
                                                    parseInt(index.toString(), 10)], i));
                                    }
                                }
                                break;
                            case 'stamp':
                                if (annotation[parseInt(i.toString(), 10)].stampAnnotations.length !== 0 || annotationData.length !== 0) {
                                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotationData, i);
                                    for (let j: number = 0; j < annotationData.length; j++) {
                                        this.pdfViewer.annotationModule.
                                            stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.
                                                stampAnnotationModule.updateStampAnnotationCollections(annotationOrderCollection[
                                                    parseInt(index.toString(), 10)], i));
                                    }
                                }
                                break;
                            case 'Text Box':
                            case 'freeText':
                                if (annotation[parseInt(i.toString(), 10)].freeTextAnnotation.length !== 0 || annotationData.length !== 0) {
                                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotationData, i);
                                    for (let j: number = 0; j < annotationData.length; j++) {
                                        this.pdfViewer.annotationModule.
                                            stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.
                                                freeTextAnnotationModule.updateFreeTextAnnotationCollections(annotationOrderCollection[
                                                    parseInt(index.toString(), 10)], i));
                                    }
                                }
                                break;
                            case 'sticky':
                                if (annotation[parseInt(i.toString(), 10)].stickyNotesAnnotation.length !== 0 ||
                                annotationData.length !== 0) {
                                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotationData, i);
                                    for (let j: number = 0; j < annotationData.length; j++) {
                                        this.pdfViewer.
                                            annotationModule.stickyNotesAnnotationModule.
                                            updateCollections(this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                                                updateStickyNotesAnnotationCollections(annotationOrderCollection[
                                                    parseInt(index.toString(), 10)], i));
                                    }
                                }
                                break;
                            case 'signature':
                                if (annotation[parseInt(i.toString(), 10)].signatureAnnotation.length !== 0 ||
                                annotationData.length !== 0) {
                                    for (let j: number = 0; j < annotationData.length; j++) {
                                        this.pdfViewer.
                                            annotationModule.stickyNotesAnnotationModule.
                                            updateCollections(this.signatureModule.
                                                updateSignatureCollections(annotationOrderCollection[
                                                    parseInt(index.toString(), 10)], i), true);
                                    }
                                }
                                break;
                            case 'Ink':
                            case 'ink':
                                if (annotation[parseInt(i.toString(), 10)].signatureInkAnnotation.length !== 0 ||
                                annotationData.length !== 0) {
                                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotationData, i);
                                    for (let j: number = 0; j < annotation[parseInt(i.toString(), 10)].
                                        annotationOrder[parseInt(index.toString(), 10)].length; j++) {
                                        this.pdfViewer.
                                            annotationModule.stickyNotesAnnotationModule.
                                            updateCollections(this.pdfViewer.annotationModule.inkAnnotationModule.
                                                updateInkCollections(annotationOrderCollection[parseInt(index.toString(), 10)], i));
                                    }
                                }
                                break;
                            }
                            annotationData = [];
                        }
                    }
                    this.updateImportedAnnotationsInDocumentCollections(importPageCollections, i);
                }
            }
            if (this.pageCount > 0) {
                if (this.pdfViewer.annotationModule.stickyNotesAnnotationModule &&
                    !this.pdfViewer.annotationModule.stickyNotesAnnotationModule.isAnnotationRendered) {
                    const annotationCollection: any = this.createAnnotationsCollection();
                    if (annotationCollection) {
                        this.documentAnnotationCollections =
                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                            updateAnnotationsInDocumentCollections(this.importedAnnotation, annotationCollection);
                    }
                }
            }
        }
        this.isImportAction = false;
    }

    /**
     * @param {any} importedAnnotations - It describes about the imported annotations
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {void}
     */
    private updateImportedAnnotationsInDocumentCollections(importedAnnotations: any, pageNumber: number): void {
        if (this.documentAnnotationCollections) {
            const documentAnnotationCollection: any = this.documentAnnotationCollections;
            const pageCollections: any = documentAnnotationCollection[parseInt(pageNumber.toString(), 10)];
            if (pageCollections) {
                if (importedAnnotations.textMarkupAnnotation && importedAnnotations.textMarkupAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.textMarkupAnnotation.length; i++) {
                        pageCollections.textMarkupAnnotation.push(importedAnnotations.textMarkupAnnotation[parseInt(i.toString(), 10)]);
                    }
                }
                if (importedAnnotations.shapeAnnotation && importedAnnotations.shapeAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.shapeAnnotation.length; i++) {
                        pageCollections.shapeAnnotation.push(importedAnnotations.shapeAnnotation[parseInt(i.toString(), 10)]);
                    }
                }
                if (importedAnnotations.measureShapeAnnotation && importedAnnotations.measureShapeAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.measureShapeAnnotation.length; i++) {
                        pageCollections.measureShapeAnnotation.push(importedAnnotations.measureShapeAnnotation[parseInt(i.toString(), 10)]);
                    }
                }
                if (importedAnnotations.stampAnnotations && importedAnnotations.stampAnnotations.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.stampAnnotations.length; i++) {
                        pageCollections.stampAnnotations.push(importedAnnotations.stampAnnotations[parseInt(i.toString(), 10)]);
                    }
                }
                if (importedAnnotations.stickyNotesAnnotation && importedAnnotations.stickyNotesAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.stickyNotesAnnotation.length; i++) {
                        pageCollections.stickyNotesAnnotation.push(importedAnnotations.stickyNotesAnnotation[parseInt(i.toString(), 10)]);
                    }
                }
                if (importedAnnotations.freeTextAnnotation && importedAnnotations.freeTextAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.freeTextAnnotation.length; i++) {
                        pageCollections.freeTextAnnotation.push(importedAnnotations.freeTextAnnotation[parseInt(i.toString(), 10)]);
                    }
                }
                if (importedAnnotations.signatureAnnotation && importedAnnotations.signatureAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.signatureAnnotation.length; i++) {
                        pageCollections.signatureAnnotation.push(importedAnnotations.signatureAnnotation[parseInt(i.toString(), 10)]);
                    }
                }
                if (importedAnnotations.signatureInkAnnotation && importedAnnotations.signatureInkAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.signatureInkAnnotation.length; i++) {
                        pageCollections.signatureInkAnnotation.push(importedAnnotations.signatureInkAnnotation[parseInt(i.toString(), 10)]);
                    }
                }
                this.documentAnnotationCollections[parseInt(pageNumber.toString(), 10)] = pageCollections;
            }
        }
    }

    /**
     * @param {number} pageIndex - It describes about the page index
     * @param {any} pageCollections - It describes about the page collections
     * @private
     * @returns {any} - any
     */
    public checkDocumentCollectionData(pageIndex: number, pageCollections?: any): any {
        let importPageCollections: any;
        if (pageCollections) {
            importPageCollections = pageCollections;
        } else if (this.documentAnnotationCollections) {
            const documetCollections: any = this.documentAnnotationCollections[parseInt(pageIndex.toString(), 10)];
            if (documetCollections) {
                importPageCollections = cloneObject(documetCollections);
            }
        }
        if (importPageCollections) {
            let textMarkupObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_textMarkup');
            let shapeObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_shape');
            let measureShapeObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_shape_measure');
            let stampObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_stamp');
            let stickyObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_sticky');
            let freeTextObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_freetext');
            let inkObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_ink');
            let signatureObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_sign');
            if (this.isStorageExceed) {
                textMarkupObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
                shapeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
                measureShapeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
                stampObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
                stickyObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
                freeTextObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
                inkObject = this.annotationStorage[this.documentId + '_annotations_ink'];
                signatureObject = this.annotationStorage[this.documentId + '_annotations_sign'];
            }
            if (importPageCollections.textMarkupAnnotation && importPageCollections.textMarkupAnnotation.length !== 0) {
                if (textMarkupObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(textMarkupObject);
                    if (annotationObject) {
                        importPageCollections.textMarkupAnnotation =
                        this.findImportedAnnotations(annotationObject, importPageCollections.textMarkupAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.shapeAnnotation && importPageCollections.shapeAnnotation.length !== 0) {
                if (shapeObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(shapeObject);
                    if (annotationObject) {
                        importPageCollections.shapeAnnotation =
                        this.findImportedAnnotations(annotationObject, importPageCollections.shapeAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.measureShapeAnnotation && importPageCollections.measureShapeAnnotation.length !== 0) {
                if (measureShapeObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(measureShapeObject);
                    if (annotationObject) {
                        importPageCollections.measureShapeAnnotation =
                        this.findImportedAnnotations(annotationObject, importPageCollections.measureShapeAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.stampAnnotations && importPageCollections.stampAnnotations.length !== 0) {
                if (stampObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(stampObject);
                    if (annotationObject) {
                        importPageCollections.stampAnnotations =
                        this.findImportedAnnotations(annotationObject, importPageCollections.stampAnnotations, pageIndex);
                    }
                }
            }
            if (importPageCollections.stickyNotesAnnotation && importPageCollections.stickyNotesAnnotation.length !== 0) {
                if (stickyObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(stickyObject);
                    if (annotationObject) {
                        importPageCollections.stickyNotesAnnotation =
                        this.findImportedAnnotations(annotationObject, importPageCollections.stickyNotesAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.freeTextAnnotation && importPageCollections.freeTextAnnotation.length !== 0) {
                if (freeTextObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(freeTextObject);
                    if (annotationObject) {
                        importPageCollections.freeTextAnnotation =
                        this.findImportedAnnotations(annotationObject, importPageCollections.freeTextAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.signatureInkAnnotation && importPageCollections.signatureInkAnnotation.length !== 0) {
                if (inkObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(inkObject);
                    if (annotationObject) {
                        importPageCollections.signatureInkAnnotation =
                        this.findImportedAnnotations(annotationObject, importPageCollections.signatureInkAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.signatureAnnotation && importPageCollections.signatureAnnotation.length !== 0) {
                if (signatureObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(inkObject);
                    if (annotationObject) {
                        importPageCollections.signatureAnnotation =
                        this.findImportedAnnotations(annotationObject, importPageCollections.signatureAnnotation, pageIndex);
                    }
                }
            }
            return importPageCollections;
        }
    }

    private findImportedAnnotations(annotationCollection: any, importAnnotations: any, pageNumber: number): any {
        let pageCollections: any = null;
        for (let a: number = 0; a < annotationCollection.length; a++) {
            if (annotationCollection[parseInt(a.toString(), 10)].pageIndex === pageNumber) {
                pageCollections = annotationCollection[parseInt(a.toString(), 10)].annotations;
            }
        }
        if (pageCollections) {
            for (let i: number = 0; i < pageCollections.length; i++) {
                for (let j: number = 0; j < importAnnotations.length; j++) {
                    if (pageCollections[parseInt(i.toString(), 10)].annotName === importAnnotations[parseInt(j.toString(), 10)].AnnotName) {
                        importAnnotations.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
        }
        pageCollections = null;
        return importAnnotations;
    }

    private setAnnotationSettings(annotation: any): void {
        if (!isNullOrUndefined(annotation)) {
            annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings :
                this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
            if (annotation.IsLocked) {
                annotation.AnnotationSettings.isLock = annotation.IsLocked;
            }
        }
    }

    private drawPageAnnotations(annotation: any, pageIndex: number, isNewlyAdded?: boolean): void {
        if (isNewlyAdded) {
            annotation = annotation[parseInt(pageIndex.toString(), 10)];
        }
        // When utilising the addAnnotation API, the annotationOrder object is not available; thus, the following code is used to put the annotation object into the annotationOrder.
        if (annotation && !(annotation.annotationOrder)) {
            const annotationTypes: string[] = ['freeTextAnnotation', 'measureShapeAnnotation', 'shapeAnnotation', 'signatureAnnotation', 'signatureInkAnnotation', 'stampAnnotations', 'stickyNotesAnnotation', 'textMarkupAnnotation'];
            const foundAnnotationType: string = annotationTypes.find((type: string) => {
                if (annotation[`${type}`] && annotation[`${type}`].length !== 0) {
                    return annotation[`${type}`];
                }
            });
            if (foundAnnotationType) {
                annotation.annotationOrder = annotation[`${foundAnnotationType}`];
            }
        }
        if (annotation) {
            const annotationOrderCollection: any = annotation.annotationOrder;
            let annotationData: any = [];
            let isRefreshRequired: boolean = true;
            if (!isNullOrUndefined(annotationOrderCollection)) {
                for (let index: number = 0; index < annotationOrderCollection.length; index++) {
                    const annotationName: string = annotationOrderCollection[parseInt(index.toString(), 10)].AnnotType ?
                        annotationOrderCollection[parseInt(index.toString(), 10)].AnnotType :
                        annotationOrderCollection[parseInt(index.toString(), 10)].AnnotationType;
                    annotationData.push(annotationOrderCollection[parseInt(index.toString(), 10)]);
                    let storeObject: any;
                    let annotObject: IPageAnnotations[];
                    const isLastAnnot: boolean = (index === annotationOrderCollection.length - 1) ? true : false;
                    switch (annotationName) {
                    case 'textMarkup':
                        isRefreshRequired = false;
                        storeObject = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_textMarkup');
                        if (this.isStorageExceed) {
                            storeObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
                        }
                        if (storeObject) {
                            annotObject = JSON.parse(storeObject);
                            if (annotObject) {
                                annotationData = this.checkAnnotationCollections(annotObject, annotationData, pageIndex);
                            }
                        }
                        if (annotationData) {
                            this.setAnnotationSettings(annotationData[0]);
                        }
                        annotation.textMarkupAnnotation =
                        this.checkAnnotationCommentsCollections(annotation.textMarkupAnnotation, pageIndex);
                        this.pdfViewer.annotationModule.renderAnnotations(pageIndex, null, null, annotationData, null, true, null,
                                                                          null, null, isLastAnnot);
                        break;
                    case 'shape':
                        isRefreshRequired = false;
                        storeObject = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_shape');
                        if (this.isStorageExceed) {
                            storeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
                        }
                        if (storeObject) {
                            annotObject = JSON.parse(storeObject);
                            annotationData = this.checkAnnotationCollections(annotObject, annotationData, pageIndex);
                        }
                        if (annotationData) {
                            this.setAnnotationSettings(annotationData[0]);
                        }
                        annotation.shapeAnnotation = this.checkAnnotationCommentsCollections(annotation.shapeAnnotation, pageIndex);
                        this.pdfViewer.annotationModule.renderAnnotations(pageIndex, annotationData, null, null, null, true, null,
                                                                          null, null, isLastAnnot);
                        break;
                    case 'shape_measure':
                        isRefreshRequired = false;
                        storeObject = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_shape_measure');
                        if (this.isStorageExceed) {
                            storeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
                        }
                        if (storeObject) {
                            annotObject = JSON.parse(storeObject);
                            annotationData = this.checkAnnotationCollections(annotObject, annotationData, pageIndex);
                        }
                        if (annotationData) {
                            this.setAnnotationSettings(annotationData[0]);
                        }
                        annotation.measureShapeAnnotation =
                    this.checkAnnotationCommentsCollections(annotation.measureShapeAnnotation, pageIndex);
                        this.pdfViewer.annotationModule.renderAnnotations(pageIndex, null, annotationData, null, null, true, null,
                                                                          null, null, isLastAnnot);
                        break;
                    case 'stamp':
                        storeObject = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_stamp');
                        if (this.isStorageExceed) {
                            storeObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
                        }
                        if (storeObject) {
                            annotObject = JSON.parse(storeObject);
                            annotationData = this.checkAnnotationCollections(annotObject, annotationData, pageIndex);
                        }
                        if (annotationData) {
                            this.setAnnotationSettings(annotationData[0]);
                        }
                        annotation.stampAnnotations = this.checkAnnotationCommentsCollections(annotation.stampAnnotations, pageIndex);
                        this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotations(annotationData, pageIndex, null, true,
                                                                                                     null, isLastAnnot);
                        break;
                    case 'Text Box':
                    case 'freeText':
                        storeObject = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_freetext');
                        if (this.isStorageExceed) {
                            storeObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
                        }
                        if (storeObject) {
                            annotObject = JSON.parse(storeObject);
                            annotationData = this.checkAnnotationCollections(annotObject, annotationData, pageIndex);
                        }
                        if (annotationData) {
                            this.setAnnotationSettings(annotationData[0]);
                        }
                        annotation.freeTextAnnotation = this.checkAnnotationCommentsCollections(annotation.freeTextAnnotation, pageIndex);
                        this.pdfViewer.annotationModule.freeTextAnnotationModule.renderFreeTextAnnotations(annotationData, pageIndex, true,
                                                                                                           null, isLastAnnot);
                        break;
                    case 'sticky':
                        storeObject = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_sticky');
                        if (this.isStorageExceed) {
                            storeObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
                        }
                        if (storeObject) {
                            annotObject = JSON.parse(storeObject);
                            annotationData = this.checkAnnotationCollections(annotObject, annotationData, pageIndex);
                        }
                        if (annotationData) {
                            this.setAnnotationSettings(annotationData[0]);
                        }
                        annotation.stickyNotesAnnotation =
                        this.checkAnnotationCommentsCollections(annotation.stickyNotesAnnotation, pageIndex);
                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderStickyNotesAnnotations(annotationData, pageIndex,
                                                                                                                 null, true, isLastAnnot);
                        break;
                    case 'signature':
                    case 'Signature':
                    case 'SignatureText':
                    case 'SignatureImage':
                        storeObject = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_sign');
                        annotObject = JSON.parse(storeObject);
                        if (annotationData) {
                            this.setAnnotationSettings(annotationData[0]);
                        }
                        if (annotObject) {
                            annotation.signatureAnnotation = this.checkSignatureCollections(annotObject, annotationData, pageIndex);
                        }
                        this.signatureModule.renderExistingSignature(annotationData, pageIndex, true, isLastAnnot);
                        break;
                    case 'Ink':
                    case 'ink':
                        storeObject = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_ink');
                        if (this.isStorageExceed) {
                            storeObject = this.annotationStorage[this.documentId + '_annotations_ink'];
                        }
                        if (storeObject) {
                            annotObject = JSON.parse(storeObject);
                            annotationData = this.checkAnnotationCollections(annotObject, annotationData, pageIndex);
                        }
                        if (annotationData) {
                            this.setAnnotationSettings(annotationData[0]);
                        }
                        annotation.signatureInkAnnotation =
                    this.checkAnnotationCommentsCollections(annotation.signatureInkAnnotation, pageIndex);
                        this.pdfViewer.annotationModule.inkAnnotationModule.renderExistingInkSignature(annotationData, pageIndex, true,
                                                                                                       null, isLastAnnot);
                        break;
                    default:
                        break;
                    }
                    annotationData = [];
                }
            }
            if (isRefreshRequired) {
                this.pdfViewer.annotationModule.renderAnnotations(pageIndex, null, null, null);
            }
        }

    }

    private checkSignatureCollections(annotationCollection: any, annotation: any, pageNumber: number): any {
        let pageCollections: any = null;
        for (let a: number = 0; a < annotationCollection.length; a++) {
            if (annotationCollection[parseInt(a.toString(), 10)].pageIndex === pageNumber) {
                pageCollections = annotationCollection[parseInt(a.toString(), 10)].annotations;
            }
        }
        if (pageCollections) {
            for (let i: number = 0; i < pageCollections.length; i++) {
                for (let j: number = 0; j < annotation.length; j++) {
                    if (pageCollections[parseInt(i.toString(), 10)].signatureName ===
                    annotation[parseInt(j.toString(), 10)].SignatureName) {
                        annotation.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
        }
        pageCollections = null;
        return annotation;
    }

    private checkAnnotationCollections(annotationCollection: any, annotation: any, pageNumber: number): any {
        let pageCollections: any = null;
        for (let a: number = 0; a < annotationCollection.length; a++) {
            if (annotationCollection[parseInt(a.toString(), 10)].pageIndex === pageNumber) {
                pageCollections = annotationCollection[parseInt(a.toString(), 10)].annotations;
            }
        }
        if (pageCollections) {
            for (let i: number = 0; i < pageCollections.length; i++) {
                for (let j: number = 0; j < annotation.length; j++) {
                    if (pageCollections[parseInt(i.toString(), 10)].annotName === annotation[parseInt(j.toString(), 10)].AnnotName) {
                        annotation.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
        }
        pageCollections = null;
        return annotation;
    }

    private checkAnnotationCommentsCollections(annotation: any, pageNumber: number): any {
        if (this.annotationComments) {
            let annotationCollections: any = this.annotationComments[parseInt(pageNumber.toString(), 10)];
            annotationCollections = this.selectAnnotationCollections(annotationCollections);
            if (annotationCollections) {
                for (let i: number = 0; i < annotationCollections.length; i++) {
                    for (let j: number = 0; j < annotation.length; j++) {
                        if (annotationCollections[parseInt(i.toString(), 10)].AnnotName ===
                        annotation[parseInt(j.toString(), 10)].AnnotName) {
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

    private selectAnnotationCollections(pageAnnotations: any): void {
        const pageCollections: any = [];
        if (pageAnnotations) {
            if (pageAnnotations.textMarkupAnnotation && pageAnnotations.textMarkupAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.textMarkupAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.textMarkupAnnotation[parseInt(i.toString(), 10)]);
                }
            }
            if (pageAnnotations.shapeAnnotation && pageAnnotations.shapeAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.shapeAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.shapeAnnotation[parseInt(i.toString(), 10)]);
                }
            }
            if (pageAnnotations.measureShapeAnnotation && pageAnnotations.measureShapeAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.measureShapeAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.measureShapeAnnotation[parseInt(i.toString(), 10)]);
                }
            }
            if (pageAnnotations.stampAnnotations && pageAnnotations.stampAnnotations.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.stampAnnotations.length; i++) {
                    pageCollections.push(pageAnnotations.stampAnnotations[parseInt(i.toString(), 10)]);
                }
            }
            if (pageAnnotations.stickyNotesAnnotation && pageAnnotations.stickyNotesAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.stickyNotesAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.stickyNotesAnnotation[parseInt(i.toString(), 10)]);
                }
            }
            if (pageAnnotations.freeTextAnnotation && pageAnnotations.freeTextAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.freeTextAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.freeTextAnnotation[parseInt(i.toString(), 10)]);
                }
            }
            if (pageAnnotations.signatureInkAnnotation && pageAnnotations.signatureInkAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.signatureInkAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.signatureInkAnnotation[parseInt(i.toString(), 10)]);
                }
            }
        }
        return pageCollections;
    }

    private saveImportedAnnotations(): void {
        let textMarkupObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_textMarkup');
        let shapeObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_shape');
        let measureShapeObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_shape_measure');
        let stampObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_stamp');
        let stickyObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_sticky');
        let freeTextObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_freetext');
        let inkObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_ink');
        let signatureObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_sign');
        if (this.isStorageExceed) {
            textMarkupObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
            shapeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
            measureShapeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
            stampObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
            stickyObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
            freeTextObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
            inkObject = this.annotationStorage[this.documentId + '_annotations_ink'];
            signatureObject = this.annotationStorage[this.documentId + '_annotations_sign'];
        }
        this.downloadCollections = { textMarkupObject: textMarkupObject, shapeObject: shapeObject,
            measureShapeObject: measureShapeObject, stampObject: stampObject, stickyObject: stickyObject,
            freeTextObject: freeTextObject, inkObject: inkObject, signatureObject: signatureObject };
        if (this.documentAnnotationCollections) {
            for (let i: number = 0; i < this.pageCount; i++) {
                if (this.documentAnnotationCollections[parseInt(i.toString(), 10)]) {
                    let pageCollections: any = cloneObject(this.documentAnnotationCollections[parseInt(i.toString(), 10)]);
                    pageCollections = this.checkDocumentCollectionData(i, pageCollections);
                    this.savePageAnnotations(pageCollections, i);
                }
            }
        }
    }

    private savePageAnnotations(annotation: any, pageIndex: number): void {
        if (annotation.textMarkupAnnotation.length !== 0) {
            for (let s: number = 0; s < annotation.textMarkupAnnotation.length; s++) {
                if (!isNullOrUndefined(this.pdfViewer.annotationModule.textMarkupAnnotationModule)) {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                        saveImportedTextMarkupAnnotations(annotation.textMarkupAnnotation[parseInt(s.toString(), 10)], pageIndex);
                }
            }
        }
        if (annotation.shapeAnnotation.length !== 0) {
            for (let s: number = 0; s < annotation.shapeAnnotation.length; s++) {
                this.pdfViewer.annotationModule.shapeAnnotationModule.
                    saveImportedShapeAnnotations(annotation.shapeAnnotation[parseInt(s.toString(), 10)], pageIndex);
            }
        }
        if (annotation.measureShapeAnnotation.length !== 0) {
            for (let s: number = 0; s < annotation.measureShapeAnnotation.length; s++) {
                this.pdfViewer.annotationModule.measureAnnotationModule.
                    saveImportedMeasureAnnotations(annotation.measureShapeAnnotation[parseInt(s.toString(), 10)], pageIndex);
            }
        }
        if (annotation.stampAnnotations.length !== 0) {
            for (let s: number = 0; s < annotation.stampAnnotations.length; s++) {
                this.pdfViewer.annotationModule.stampAnnotationModule.
                    saveImportedStampAnnotations(annotation.stampAnnotations[parseInt(s.toString(), 10)], pageIndex);
            }
        }
        if (annotation.stickyNotesAnnotation.length !== 0) {
            for (let s: number = 0; s < annotation.stickyNotesAnnotation.length; s++) {
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                    saveImportedStickyNotesAnnotations(annotation.stickyNotesAnnotation[parseInt(s.toString(), 10)], pageIndex);
            }
        }
        if (annotation.freeTextAnnotation.length !== 0) {
            for (let s: number = 0; s < annotation.freeTextAnnotation.length; s++) {
                this.pdfViewer.annotationModule.freeTextAnnotationModule.
                    saveImportedFreeTextAnnotations(annotation.freeTextAnnotation[parseInt(s.toString(), 10)], pageIndex);
            }
        }
        if (annotation.signatureInkAnnotation.length !== 0) {
            if (!this.pdfViewer.isSignatureEditable) {
                annotation.signatureInkAnnotation = this.canUpdateSignCollection(annotation.signatureInkAnnotation);
            }
            for (let s: number = 0; s < annotation.signatureInkAnnotation.length; s++) {
                this.pdfViewer.annotationModule.inkAnnotationModule.
                    saveImportedInkAnnotation(annotation.signatureInkAnnotation[parseInt(s.toString(), 10)], pageIndex);
            }
        }
        if (annotation.signatureAnnotation.length !== 0) {
            if (!this.pdfViewer.isSignatureEditable) {
                annotation.signatureAnnotation = this.canUpdateSignCollection(annotation.signatureAnnotation);
            }
        }
    }

    private updateDocumentAnnotationCollections(): void {
        PdfViewerBase.sessionStorageManager.removeItem(this.documentId + '_annotations_textMarkup');
        PdfViewerBase.sessionStorageManager.removeItem(this.documentId + '_annotations_shape');
        PdfViewerBase.sessionStorageManager.removeItem(this.documentId + '_annotations_shape_measure');
        PdfViewerBase.sessionStorageManager.removeItem(this.documentId + '_annotations_stamp');
        PdfViewerBase.sessionStorageManager.removeItem(this.documentId + '_annotations_sticky');
        PdfViewerBase.sessionStorageManager.removeItem(this.documentId + '_annotations_freetext');
        PdfViewerBase.sessionStorageManager.removeItem(this.documentId + '_annotations_ink');
        if (this.downloadCollections) {
            if (this.isStorageExceed) {
                this.annotationStorage[this.documentId + '_annotations_textMarkup'] = this.downloadCollections.textMarkupObject;
                this.annotationStorage[this.documentId + '_annotations_shape'] = this.downloadCollections.shapeObject;
                this.annotationStorage[this.documentId + '_annotations_shape_measure'] = this.downloadCollections.measureShapeObject;
                this.annotationStorage[this.documentId + '_annotations_stamp'] = this.downloadCollections.stampObject;
                this.annotationStorage[this.documentId + '_annotations_sticky'] = this.downloadCollections.stickyObject;
                this.annotationStorage[this.documentId + '_annotations_freetext'] = this.downloadCollections.freeTextObject;
                this.annotationStorage[this.documentId + '_annotations_ink'] = this.downloadCollections.inkObject;
            } else {
                if (this.downloadCollections.textMarkupObject) {
                    PdfViewerBase.sessionStorageManager.setItem(this.documentId + '_annotations_textMarkup', this.downloadCollections.textMarkupObject);
                }
                if (this.downloadCollections.shapeObject) {
                    PdfViewerBase.sessionStorageManager.setItem(this.documentId + '_annotations_shape', this.downloadCollections.shapeObject);
                }
                if (this.downloadCollections.measureShapeObject) {
                    PdfViewerBase.sessionStorageManager.setItem(this.documentId + '_annotations_shape_measure', this.downloadCollections.measureShapeObject);
                }
                if (this.downloadCollections.stampObject) {
                    PdfViewerBase.sessionStorageManager.setItem(this.documentId + '_annotations_stamp', this.downloadCollections.stampObject);
                }
                if (this.downloadCollections.stickyObject) {
                    PdfViewerBase.sessionStorageManager.setItem(this.documentId + '_annotations_sticky', this.downloadCollections.stickyObject);
                }
                if (this.downloadCollections.freeTextObject) {
                    PdfViewerBase.sessionStorageManager.setItem(this.documentId + '_annotations_freetext', this.downloadCollections.freeTextObject);
                }
                if (this.downloadCollections.inkObject) {
                    PdfViewerBase.sessionStorageManager.setItem(this.documentId + '_annotations_ink', this.downloadCollections.inkObject);
                }
            }
        }
    }

    /**
     * @private
     * @returns {string} - string
     */
    public createAnnotationJsonData(): string {
        const annotationCollection: any = {};
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
            this.isJsonExported = true;
            textMarkupAnnotationCollection = this.pdfViewer.annotationModule.textMarkupAnnotationModule.saveTextMarkupAnnotations();
        }
        if (this.isShapeAnnotationModule()) {
            this.isJsonExported = true;
            shapeAnnotations = this.pdfViewer.annotationModule.shapeAnnotationModule.saveShapeAnnotations();
        }
        if (this.isCalibrateAnnotationModule()) {
            this.isJsonExported = true;
            calibrateAnnotations = this.pdfViewer.annotationModule.measureAnnotationModule.saveMeasureShapeAnnotations();
        }
        if (this.isStampAnnotationModule()) {
            stampAnnotationCollection = this.pdfViewer.annotationModule.stampAnnotationModule.saveStampAnnotations();
        }
        if (this.isCommentAnnotationModule()) {
            stickyAnnotationCollection = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.saveStickyAnnotations();
        }
        if (this.isFreeTextAnnotationModule()) {
            freeTextAnnotationCollection = this.pdfViewer.annotationModule.freeTextAnnotationModule.saveFreeTextAnnotations();
        }
        if (this.isInkAnnotationModule()) {
            signaturInkCollection = this.pdfViewer.annotationModule.inkAnnotationModule.saveInkSignature();
        }
        if (this.pdfViewer.isSignatureEditable) {
            signaturCollection = this.signatureModule.saveSignature();
        } else {

            const annotations: Array<any> = [];
            for (let j: number = 0; j < this.pageCount; j++) {
                annotations[parseInt(j.toString(), 10)] = [];
            }
            signaturCollection = JSON.stringify(annotations);
        }
        for (let s: number = 0; s < this.pageCount; s++) {
            const annotation: IAnnotationCollection = {
                textMarkupAnnotation: JSON.parse(textMarkupAnnotationCollection)[parseInt(s.toString(), 10)],
                shapeAnnotation: JSON.parse(shapeAnnotations)[parseInt(s.toString(), 10)],
                measureShapeAnnotation: JSON.parse(calibrateAnnotations)[parseInt(s.toString(), 10)],
                stampAnnotations: JSON.parse(stampAnnotationCollection)[parseInt(s.toString(), 10)],
                stickyNotesAnnotation: JSON.parse(stickyAnnotationCollection)[parseInt(s.toString(), 10)],
                freeTextAnnotation: JSON.parse(freeTextAnnotationCollection)[parseInt(s.toString(), 10)],
                signatureAnnotation: JSON.parse(signaturCollection)[parseInt(s.toString(), 10)],
                signatureInkAnnotation: JSON.parse(signaturInkCollection)[parseInt(s.toString(), 10)]
            };
            annotationCollection[parseInt(s.toString(), 10)] = annotation;
        }
        return JSON.stringify(annotationCollection);
    }

    private combineImportedData(excistingImportAnnotation: any, newlyImportAnnotation: any): any {
        for (let i: number = 0; i < this.pageCount; i++) {
            if (newlyImportAnnotation[parseInt(i.toString(), 10)]) {
                if (excistingImportAnnotation[parseInt(i.toString(), 10)]) {
                    if (newlyImportAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation &&
                    newlyImportAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation.length !== 0) {
                        if (excistingImportAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation) {
                            newlyImportAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation =
                            this.checkImportedData(excistingImportAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation,
                                                   newlyImportAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation, i);
                            if (newlyImportAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation.length !== 0) {
                                excistingImportAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation =
                                excistingImportAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation.
                                    concat(newlyImportAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation =
                            newlyImportAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[parseInt(i.toString(), 10)].shapeAnnotation &&
                    newlyImportAnnotation[parseInt(i.toString(), 10)].shapeAnnotation.length !== 0) {
                        if (excistingImportAnnotation[parseInt(i.toString(), 10)].shapeAnnotation) {
                            newlyImportAnnotation[parseInt(i.toString(), 10)].shapeAnnotation =
                            this.checkImportedData(excistingImportAnnotation[parseInt(i.toString(), 10)].shapeAnnotation,
                                                   newlyImportAnnotation[parseInt(i.toString(), 10)].shapeAnnotation, i);
                            if (newlyImportAnnotation[parseInt(i.toString(), 10)].shapeAnnotation.length !== 0) {
                                excistingImportAnnotation[parseInt(i.toString(), 10)].shapeAnnotation =
                                excistingImportAnnotation[parseInt(i.toString(), 10)].shapeAnnotation.
                                    concat(newlyImportAnnotation[parseInt(i.toString(), 10)].shapeAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[parseInt(i.toString(), 10)].shapeAnnotation =
                            newlyImportAnnotation[parseInt(i.toString(), 10)].shapeAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation &&
                    newlyImportAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation.length !== 0) {
                        if (excistingImportAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation) {
                            newlyImportAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation =
                            this.checkImportedData(excistingImportAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation,
                                                   newlyImportAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation, i);
                            if (newlyImportAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation.length !== 0) {
                                excistingImportAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation =
                                excistingImportAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation.
                                    concat(newlyImportAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation =
                            newlyImportAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[parseInt(i.toString(), 10)].stampAnnotations &&
                    newlyImportAnnotation[parseInt(i.toString(), 10)].stampAnnotations.length !== 0) {
                        if (excistingImportAnnotation[parseInt(i.toString(), 10)].stampAnnotations) {
                            newlyImportAnnotation[parseInt(i.toString(), 10)].stampAnnotations =
                            this.checkImportedData(excistingImportAnnotation[parseInt(i.toString(), 10)].stampAnnotations,
                                                   newlyImportAnnotation[parseInt(i.toString(), 10)].stampAnnotations, i);
                            if (newlyImportAnnotation[parseInt(i.toString(), 10)].stampAnnotations.length !== 0) {
                                excistingImportAnnotation[parseInt(i.toString(), 10)].stampAnnotations =
                                excistingImportAnnotation[parseInt(i.toString(), 10)].stampAnnotations.
                                    concat(newlyImportAnnotation[parseInt(i.toString(), 10)].stampAnnotations);
                            }
                        } else {
                            excistingImportAnnotation[parseInt(i.toString(), 10)].stampAnnotations =
                            newlyImportAnnotation[parseInt(i.toString(), 10)].stampAnnotations;
                        }
                    }
                    if (newlyImportAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation &&
                    newlyImportAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation.length !== 0) {
                        if (excistingImportAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation) {
                            newlyImportAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation =
                            this.checkImportedData(excistingImportAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation,
                                                   newlyImportAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation, i);
                            if (newlyImportAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation.length !== 0) {
                                excistingImportAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation =
                                excistingImportAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation.
                                    concat(newlyImportAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation =
                            newlyImportAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation &&
                    newlyImportAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation.length !== 0) {
                        if (excistingImportAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation) {
                            newlyImportAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation =
                             this.checkImportedData(excistingImportAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation,
                                                    newlyImportAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation, i);
                            if (newlyImportAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation.length !== 0) {
                                excistingImportAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation =
                                excistingImportAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation.
                                    concat(newlyImportAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation =
                            newlyImportAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation &&
                    newlyImportAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation.length !== 0) {
                        if (excistingImportAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation) {
                            newlyImportAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation =
                            this.checkImportedData(excistingImportAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation,
                                                   newlyImportAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation, i);
                            if (newlyImportAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation.length !== 0) {
                                excistingImportAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation =
                                excistingImportAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation.
                                    concat(newlyImportAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation =
                            newlyImportAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation;
                        }
                    }
                } else {
                    const annotation: IAnnotationCollection = {
                        textMarkupAnnotation: newlyImportAnnotation[parseInt(i.toString(), 10)].textMarkupAnnotation,
                        shapeAnnotation: newlyImportAnnotation[parseInt(i.toString(), 10)].shapeAnnotation,
                        measureShapeAnnotation: newlyImportAnnotation[parseInt(i.toString(), 10)].measureShapeAnnotation,
                        stampAnnotations: newlyImportAnnotation[parseInt(i.toString(), 10)].stampAnnotations,
                        stickyNotesAnnotation: newlyImportAnnotation[parseInt(i.toString(), 10)].stickyNotesAnnotation,
                        freeTextAnnotation: newlyImportAnnotation[parseInt(i.toString(), 10)].freeTextAnnotation,
                        signatureInkAnnotation: newlyImportAnnotation[parseInt(i.toString(), 10)].signatureInkAnnotation
                    };
                    excistingImportAnnotation[parseInt(i.toString(), 10)] = annotation;
                }
            }
        }
        return excistingImportAnnotation;
    }

    /**
     * @private
     * @returns {boolean} - Returns true or false.
     */
    public updateExportItem(): boolean {
        const shapeObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_shape');
        const measureObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_shape_measure');
        const stampObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_stamp');
        const stickyObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_sticky');
        const textMarkupObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_textMarkup');
        const freeTextObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_freetext');
        let isSignatureEditable: boolean = false;
        const inkAnnotationObjct: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_ink');
        if (this.pdfViewer.isSignatureEditable) {
            const signatureObject: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + '_annotations_sign');
            if (signatureObject) {
                isSignatureEditable = true;
            }
        }
        if (this.checkExportAnnotations(shapeObject) ||
            this.checkExportAnnotations(measureObject) ||
            this.checkExportAnnotations(stampObject) ||
            this.checkExportAnnotations(stickyObject) ||
            this.checkExportAnnotations(textMarkupObject) ||
            this.checkExportAnnotations(freeTextObject) ||
            this.isImportAction ||
            this.isStorageExceed ||
            isSignatureEditable ||
            this.checkExportAnnotations(inkAnnotationObjct) ||
            this.pdfViewer.annotationCollection.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    private checkExportAnnotations(obj: string | null): boolean {
        if (obj) {
            const parsedObj: any = JSON.parse(obj);
            return parsedObj.filter((s: { annotations: string | any[]; }) => s.annotations.length > 0).length > 0;
        }
        return false;
    }

    private isFreeTextAnnotation(annotations: PdfAnnotationBaseModel[]): boolean {
        let resut: boolean = false;
        if (annotations && annotations.length > 0) {
            resut = annotations.some((s: PdfAnnotationBaseModel) => s.shapeAnnotationType === 'FreeText' && !isNullOrUndefined(s.subject));
        }
        return resut;
    }

    private checkImportedData(existingCollection: any, newCollection: any, pageIndex?: number): any {
        for (let i: number = 0; i < existingCollection.length; i++) {
            for (let j: number = 0; j < newCollection.length; j++) {
                if (existingCollection[parseInt(i.toString(), 10)].AnnotName === newCollection[parseInt(j.toString(), 10)].AnnotName) {
                    const len: number = this.pdfViewer.annotationCollection.length;
                    for (let x: number = 0; x < len; x++) {
                        if (this.pdfViewer.annotationCollection[parseInt(x.toString(), 10)].annotationId ===
                        newCollection[parseInt(j.toString(), 10)].AnnotName) {
                            // To update the comment panel values in a collections while importing the annotation with the same name. (EJ2-62092)
                            this.pdfViewer.annotationCollection[parseInt(x.toString(), 10)].comments =
                            this.pdfViewer.annotationModule.getAnnotationComments(newCollection[parseInt(j.toString(), 10)].Comments,
                                                                                  newCollection[parseInt(j.toString(), 10)],
                                                                                  newCollection[parseInt(j.toString(), 10)].Author);
                            this.pdfViewer.annotationCollection[parseInt(x.toString(), 10)].review =
                            { state: newCollection[parseInt(j.toString(), 10)].State,
                                stateModel: newCollection[parseInt(j.toString(), 10)].StateModel,
                                modifiedDate: newCollection[parseInt(j.toString(), 10)].ModifiedDate,
                                author: newCollection[parseInt(j.toString(), 10)].Author };
                            this.pdfViewer.annotationCollection[parseInt(x.toString(), 10)].note =
                            newCollection[parseInt(j.toString(), 10)].Note;
                            const annot: any = this.pdfViewer.annotationCollection[parseInt(x.toString(), 10)];
                            if (existingCollection[parseInt(i.toString(), 10)].AnnotType === 'shape' &&
                            this.pdfViewer.annotationModule.shapeAnnotationModule) {
                                this.documentAnnotationCollections[parseInt(pageIndex.toString(), 10)].
                                    shapeAnnotation[parseInt(i.toString(), 10)] = newCollection[parseInt(j.toString(), 10)];
                                this.updateAnnotationsInSessionStorage(newCollection[parseInt(j.toString(), 10)], annot, '_annotations_shape');
                            }
                            else if (existingCollection[parseInt(i.toString(), 10)].AnnotType === 'textMarkup' && this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
                                this.documentAnnotationCollections[parseInt(pageIndex.toString(), 10)].
                                    textMarkupAnnotation[parseInt(i.toString(), 10)] = newCollection[parseInt(j.toString(), 10)];
                                this.updateAnnotationsInSessionStorage(newCollection[parseInt(j.toString(), 10)], annot, '_annotations_textMarkup');
                            }
                            else if (existingCollection[parseInt(i.toString(), 10)].AnnotType === 'shape_measure' && this.pdfViewer.annotationModule.measureAnnotationModule) {
                                this.documentAnnotationCollections[parseInt(pageIndex.toString(), 10)].
                                    measureShapeAnnotation[parseInt(i.toString(), 10)] = newCollection[parseInt(j.toString(), 10)];
                                this.updateAnnotationsInSessionStorage(newCollection[parseInt(j.toString(), 10)], annot, '_annotations_shape_measure');
                            }
                            else if (existingCollection[parseInt(i.toString(), 10)].AnnotType === 'stamp' && this.pdfViewer.annotationModule.stampAnnotationModule) {
                                this.documentAnnotationCollections[parseInt(pageIndex.toString(), 10)].
                                    stampAnnotations[parseInt(i.toString(), 10)] = newCollection[parseInt(j.toString(), 10)];
                                this.updateAnnotationsInSessionStorage(newCollection[parseInt(j.toString(), 10)], annot, '_annotations_stamp');
                            }
                            else if (existingCollection[parseInt(i.toString(), 10)].AnnotType === 'freeText' && this.pdfViewer.annotationModule.freeTextAnnotationModule) {
                                this.documentAnnotationCollections[parseInt(pageIndex.toString(), 10)].
                                    freeTextAnnotation[parseInt(i.toString(), 10)] = newCollection[parseInt(j.toString(), 10)];
                                this.updateAnnotationsInSessionStorage(newCollection[parseInt(j.toString(), 10)], annot, '_annotations_freetext');
                            }
                            else if (existingCollection[parseInt(i.toString(), 10)].AnnotType === 'ink' && this.pdfViewer.annotationModule.inkAnnotationModule) {
                                this.documentAnnotationCollections[parseInt(pageIndex.toString(), 10)].
                                    signatureInkAnnotation[parseInt(i.toString(), 10)] = newCollection[parseInt(j.toString(), 10)];
                                this.updateAnnotationsInSessionStorage(newCollection[parseInt(j.toString(), 10)], annot, '_annotations_ink');
                            }
                            else if (existingCollection[parseInt(i.toString(), 10)].AnnotType === 'sticky') {
                                this.documentAnnotationCollections[parseInt(pageIndex.toString(), 10)].
                                    stickyNotesAnnotation[parseInt(i.toString(), 10)] = newCollection[parseInt(j.toString(), 10)];
                                this.updateAnnotationsInSessionStorage(newCollection[parseInt(j.toString(), 10)], annot, '_annotations_sticky');
                            }
                            break;
                        }
                    }
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.
                        createCommentControlPanel(newCollection[parseInt(j.toString(), 10)], (pageIndex + 1), null, null, true);
                    newCollection.splice(j, 1);
                    j = j - 1;
                }
            }
        }
        if (this.annotationComments) {
            let annotationCollections: any = this.annotationComments[parseInt(pageIndex.toString(), 10)];
            annotationCollections = this.selectAnnotationCollections(annotationCollections);
            if (annotationCollections) {
                for (let i: number = 0; i < annotationCollections.length; i++) {
                    for (let j: number = 0; j < newCollection.length; j++) {
                        if (annotationCollections[parseInt(i.toString(), 10)].AnnotName ===
                        newCollection[parseInt(j.toString(), 10)].AnnotName) {
                            newCollection.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
            }
        }
        return newCollection;
    }

    // To update the comment panel values in a session storage while importing the annotation with the same name. (EJ2-62092)
    private updateAnnotationsInSessionStorage(newCollection: any, annot: any, type: string): void {
        const annotation: string = PdfViewerBase.sessionStorageManager.getItem(this.documentId + type);
        const annotObject: any = JSON.parse(annotation);
        if (annotObject) {
            for (let b: number = 0; b < annotObject.length; b++) {
                if (annotObject[parseInt(b.toString(), 10)].annotations) {
                    for (let z: number = 0; z < annotObject[parseInt(b.toString(), 10)].annotations.length; z++) {
                        if (annotObject[parseInt(b.toString(), 10)].annotations[parseInt(z.toString(), 10)].annotName ===
                        newCollection.AnnotName) {
                            annotObject[parseInt(b.toString(), 10)].annotations[parseInt(z.toString(), 10)].comments = annot.comments;
                            annotObject[parseInt(b.toString(), 10)].annotations[parseInt(z.toString(), 10)].review = annot.review;
                            annotObject[parseInt(b.toString(), 10)].annotations[parseInt(z.toString(), 10)].note = annot.note;
                            break;
                        }
                    }
                }
            }
            PdfViewerBase.sessionStorageManager.setItem(this.documentId + type, JSON.stringify(annotObject));
        }
    }

    /**
     * @param {any} points - It describes about the points
     * @private
     * @returns {object} - object
     */
    public checkAnnotationWidth(points: any): object {
        let width: number = 0;
        let height: number = 0;
        let minWidth: number;
        let maxWidth: number;
        let minHeight: number;
        let maxHeight: number;
        for (let i: number = 0; i < points.length; i++) {
            if (!minWidth) {
                minWidth = points[parseInt(i.toString(), 10)].x;
                maxWidth = points[parseInt(i.toString(), 10)].x;
                minHeight = points[parseInt(i.toString(), 10)].y;
                maxHeight = points[parseInt(i.toString(), 10)].y;
            } else {
                if (minWidth > points[parseInt(i.toString(), 10)].x) {
                    minWidth = points[parseInt(i.toString(), 10)].x;
                } else if (maxWidth < points[parseInt(i.toString(), 10)].x) {
                    maxWidth = points[parseInt(i.toString(), 10)].x;
                }
                if (minHeight > points[parseInt(i.toString(), 10)].y) {
                    minHeight = points[parseInt(i.toString(), 10)].y;
                } else if (maxHeight < points[parseInt(i.toString(), 10)].y) {
                    maxHeight = points[parseInt(i.toString(), 10)].y;
                }
            }
        }
        width = maxWidth - minWidth;
        height = maxHeight - minHeight;
        return { width: width, height: height };
    }

    public deleteAnnotations(): void {
        if (this.pdfViewer.annotationModule) {
            this.updateAnnotationsUndoRedo();
            this.updateSignatureUndoRedo();
            if (!isNullOrUndefined(this.pdfViewer.annotations))
            {
                this.pdfViewer.annotations.length = 0;
            }
            this.pdfViewer.zIndexTable = [];
            this.pdfViewer.annotationCollection = [];
            this.pdfViewer.signatureCollection = [];
            const annotationCollection: any = this.createAnnotationsCollection();
            this.annotationComments = annotationCollection;
            this.documentAnnotationCollections = annotationCollection;
            this.annotationRenderredList = [];
            for (let i: number = 0; i < this.pageCount; i++) {
                this.pdfViewer.annotationModule.renderAnnotations(i, null, null, null);
                this.pdfViewer.renderDrawing(undefined, i);
                this.pdfViewer.clearSelection(i);
                const accordionContent: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + (i + 1));
                if (accordionContent) {
                    accordionContent.remove();
                }
                const accordionContentContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContentContainer');
                if (accordionContentContainer) {
                    if (accordionContentContainer.childElementCount === 0) {
                        accordionContentContainer.style.display = 'none';
                        if (document.getElementById(this.pdfViewer.element.id + '_commentsPanelText')) {

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
        } else {
            this.getModuleWarningMessage('Annotation');
        }
    }

    private updateAnnotationsUndoRedo(): void {
        for (let j: number = 0; j < this.pdfViewer.annotationCollection.length; j++) {
            let currentAnnotation: any = null;
            // eslint-disable-next-line
            const proxy: any = this;
            if (proxy.pdfViewer.annotationCollection[parseInt(j.toString(), 10)].shapeAnnotationType === 'textMarkup') {
                currentAnnotation = proxy.pdfViewer.annotationCollection[parseInt(j.toString(), 10)];
                const pageAnnotations: any = proxy.pdfViewer.annotation.textMarkupAnnotationModule.
                    getAnnotations(currentAnnotation.pageNumber, null);
                if (pageAnnotations) {
                    for (let i: number = 0; i < pageAnnotations.length; i++) {
                        if (currentAnnotation.annotationId === pageAnnotations[parseInt(i.toString(), 10)].annotName) {
                            const deletedAnnotation: any = pageAnnotations.splice(parseInt(i.toString(), 10), 1)[0];
                            proxy.pdfViewer.annotation.addAction(currentAnnotation.pageNumber, parseInt(i.toString(), 10), deletedAnnotation, 'Text Markup Deleted', null);
                            proxy.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(deletedAnnotation, 'textMarkup');
                            const removeDiv: HTMLElement = document.getElementById(deletedAnnotation.annotName);
                            if (removeDiv) {
                                if (removeDiv.parentElement.childElementCount === 1) {
                                    proxy.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                                }
                                else {
                                    removeDiv.remove();
                                }
                            }
                        }
                    }
                }
                proxy.pdfViewer.annotation.textMarkupAnnotationModule.manageAnnotations(pageAnnotations, currentAnnotation.pageNumber);
            }
            else {
                currentAnnotation = proxy.pdfViewer.annotations.filter(function (s: { annotName: any; }): boolean
                { return s.annotName === proxy.pdfViewer.annotationCollection[parseInt(j.toString(), 10)].annotationId; })[0];
                if (isNullOrUndefined(currentAnnotation)) {
                    currentAnnotation = new PdfAnnotationBase(this.pdfViewer, 'annotations', proxy.pdfViewer.annotationCollection[parseInt(j.toString(), 10)] as PdfAnnotationBase, true);
                    currentAnnotation.id = proxy.pdfViewer.annotationCollection[parseInt(j.toString(), 10)].uniqueId;
                    currentAnnotation.annotName = proxy.pdfViewer.annotationCollection[parseInt(j.toString(), 10)].annotationId;
                    currentAnnotation.annotationId = null;
                }
                let undoElement: any = proxy.pdfViewer.annotation.modifyInCollections(currentAnnotation, 'delete');
                if (isNullOrUndefined(undoElement)) {
                    undoElement = proxy.pdfViewer.annotationCollection[parseInt(j.toString(), 10)];
                    undoElement.annotName = proxy.pdfViewer.annotationCollection[parseInt(j.toString(), 10)].annotationId;
                    delete undoElement.annotationId;
                }
                proxy.pdfViewer.annotation.undoCommentsElement.push(undoElement);
                proxy.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Delete', '', undoElement, currentAnnotation);
                if (currentAnnotation.shapeAnnotationType === 'Square' || currentAnnotation.shapeAnnotationType === 'Line' ||
                    currentAnnotation.shapeAnnotationType === 'Circle' || currentAnnotation.shapeAnnotationType === 'Polygon' ||
                    currentAnnotation.shapeAnnotationType === 'Polyline') {
                    if (currentAnnotation.calibrate) {
                        proxy.pdfViewer.annotation.measureAnnotationModule.
                            manageAnnotations(currentAnnotation, currentAnnotation.pageNumber);
                    }
                    else {
                        proxy.pdfViewer.annotation.shapeAnnotationModule.
                            manageAnnotations(currentAnnotation, currentAnnotation.pageNumber);
                    }
                }
                else if (currentAnnotation.shapeAnnotationType === 'Stamp' || currentAnnotation.shapeAnnotationType === 'Image') {
                    proxy.pdfViewer.annotation.stampAnnotationModule.
                        manageAnnotations(currentAnnotation, currentAnnotation.pageNumber);
                }
                else if (currentAnnotation.shapeAnnotationType === 'FreeText') {
                    proxy.pdfViewer.annotation.freeTextAnnotationModule.
                        manageAnnotations(currentAnnotation, currentAnnotation.pageNumber);
                }
                else if (currentAnnotation.shapeAnnotationType === 'Ink') {
                    proxy.pdfViewer.annotation.inkAnnotationModule.
                        manageInkAnnotations(currentAnnotation, currentAnnotation.pageNumber);
                }
                else if (currentAnnotation.shapeAnnotationType === 'StickyNotes') {
                    const stickyNoteAnnotations: any = proxy.pdfViewer.annotation.stickyNotesAnnotationModule.getAnnotations(currentAnnotation.pageIndex, null, 'sticky');
                    for (let i: number = 0; i < stickyNoteAnnotations.length; i++) {
                        if (stickyNoteAnnotations[parseInt(i.toString(), 10)].annotName === currentAnnotation.annotName) {
                            stickyNoteAnnotations.splice(i, 1);
                            break;
                        }
                    }
                    proxy.pdfViewer.annotation.stickyNotesAnnotationModule.
                        manageAnnotations(stickyNoteAnnotations, currentAnnotation.pageIndex, 'sticky');
                }
            }
        }
    }

    private updateSignatureUndoRedo(): void
    {
        for (let i: number = 0; i < this.pdfViewer.signatureCollection.length; i++) {
            // eslint-disable-next-line
            const proxy: any = this;
            let currentAnnotation: any;
            if (proxy.pdfViewer.signatureCollection[parseInt(i.toString(), 10)].shapeAnnotationType === 'HandWrittenSignature' || proxy.pdfViewer.signatureCollection[parseInt(i.toString(), 10)].shapeAnnotationType === 'SignatureText' || proxy.pdfViewer.signatureCollection[parseInt(i.toString(), 10)].shapeAnnotationType === 'SignatureImage') {
                currentAnnotation = proxy.pdfViewer.signatureCollection[parseInt(i.toString(), 10)];
                const pageAnnotations: ISignAnnotation[] = proxy.signatureModule.getAnnotations(currentAnnotation.pageNumber, null);
                for (const annotation of pageAnnotations) {
                    if (annotation.id === currentAnnotation.uniqueKey) {
                        currentAnnotation = annotation;
                        break;
                    }
                }
                let undoElement: any = proxy.pdfViewer.annotation.modifyInCollections(currentAnnotation, 'delete');
                if (isNullOrUndefined(undoElement)) {
                    undoElement = proxy.pdfViewer.signatureCollection[parseInt(i.toString(), 10)];
                    undoElement.annotName = proxy.pdfViewer.signatureCollection[parseInt(i.toString(), 10)].annotationId;
                    delete undoElement.annotationId;
                }
                proxy.pdfViewer.annotation.undoCommentsElement.push(undoElement);
                proxy.pdfViewer.annotation.addAction(currentAnnotation.pageIndex, null, currentAnnotation, 'Delete', '', undoElement, currentAnnotation);
                if (currentAnnotation.shapeAnnotationType === 'HandWrittenSignature' || currentAnnotation.shapeAnnotationType === 'SignatureText' || currentAnnotation.shapeAnnotationType === 'SignatureImage') {
                    proxy.signatureModule.manageAnnotations(currentAnnotation, currentAnnotation.pageNumber);
                }
            }
            i--;
        }
    }

    /**
     * @param {number} pageNumber - It describes about the page number
     * @param {boolean} isObject - It describes about the whether the isObject is true or not
     * @private
     * @returns {any} - any
     */
    public createAnnotationsCollection(pageNumber?: number, isObject?: boolean): any {
        let annotationCollectionList: any = [];
        if (!isObject) {
            for (let i: number = 0; i < this.pageCount; i++) {
                const annotation: IAnnotationCollection = {
                    textMarkupAnnotation: [], shapeAnnotation: [], measureShapeAnnotation: [], stampAnnotations: [],
                    stickyNotesAnnotation: [], freeTextAnnotation: [], signatureAnnotation: [], signatureInkAnnotation: []
                };
                annotationCollectionList.push(annotation);
            }
        } else {
            annotationCollectionList = {};
            const annotation: IAnnotationCollection = {
                textMarkupAnnotation: [], shapeAnnotation: [], measureShapeAnnotation: [], stampAnnotations: [],
                stickyNotesAnnotation: [], freeTextAnnotation: [], signatureAnnotation: [], signatureInkAnnotation: []
            };
            annotationCollectionList[parseInt(pageNumber.toString(), 10)] = annotation;
        }
        return annotationCollectionList;
    }

    /**
     * @param {any} importAnnotation - It describes about the imported annotation
     * @private
     * @returns {void}
     */
    public addAnnotation(importAnnotation: any): void {
        const pdfAnnotation: any = {};
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
                let annotation: any;
                if (isAnnotationObject) {
                    annotation = importAnnotation;
                } else {
                    annotation = importAnnotation[parseInt(a.toString(), 10)];
                }
                const newAnnotation: any = {};
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
                newAnnotation.IsCommentLock = annotation.isCommentLock;
                newAnnotation.Comments = annotation.comments;
                if (annotation.comments && annotation.comments.length > 0) {
                    const comments: any = [];
                    for (let i: number = 0; i < annotation.comments.length; i++) {
                        comments.push(this.updateComments(annotation, annotation.comments[parseInt(i.toString(), 10)]));
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
                        newAnnotation.Rect = this.convertBounds(annotation.rect, true);
                    }
                    if (annotation.bounds && annotation.bounds.length >= 1) {
                        const bounds: Array<any> = [];
                        for (let i: number = 0; i < annotation.bounds.length; i++) {
                            bounds.push(this.convertBounds(annotation.bounds[parseInt(i.toString(), 10)]));
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
                    newAnnotation.Note = annotation.dynamicText;
                    newAnnotation.TextAlign = annotation.textAlign;
                    newAnnotation.Thickness = annotation.thicknes;
                    newAnnotation.StrokeColor = annotation.strokeColor;
                    newAnnotation.FillColor = annotation.fillColor;
                    newAnnotation.FontColor = annotation.fontColor;
                    newAnnotation.FontSize = annotation.fontSize;
                    newAnnotation.FontFamily = annotation.fontFamily;
                    newAnnotation.Rotate = annotation.rotateAngle;
                    newAnnotation.Bounds = this.convertBounds(annotation.bounds);
                    newAnnotation.Font = { 'Name': annotation.fontFamily, 'Size': annotation.fontSize, 'Bold': annotation.font.isBold, 'Italic': annotation.font.isItalic, 'Strikeout': annotation.font.isStrikeout, 'Underline': annotation.font.isUnderline };
                    documentCollections[annotation.pageNumber].freeTextAnnotation.push(newAnnotation);
                } else if (annotation.shapeAnnotationType === 'stamp') {
                    newAnnotation.AnnotType = 'stamp';
                    newAnnotation.Icon = annotation.icon;
                    newAnnotation.isDynamic = false;
                    newAnnotation.Rect = this.convertBounds(annotation.bounds, false, true);
                    newAnnotation.RotateAngle = annotation.rotateAngle;
                    newAnnotation.FillColor = annotation.fillColor;
                    newAnnotation.StrokeColor = annotation.strokeColor;
                    newAnnotation.StampAnnotationType = annotation.stampAnnotationType;
                    newAnnotation.CreationDate = annotation.creationDate;
                    if (annotation.stampAnnotationType === 'image') {
                        const apperarance: any = [];
                        const imageData: any = { 'imagedata': annotation.stampAnnotationPath };
                        apperarance.push(imageData);
                        newAnnotation.Apperarance = apperarance;
                    }
                    if (annotation.isDynamicStamp) {
                        newAnnotation.IsDynamic = true;
                        newAnnotation.StrokeColor = annotation.stampFillcolor;
                        const apperarance: any = [];
                        const imageData: any = { 'type': 'string', 'text': annotation.dynamicText, 'currentFontname': '95b303ab-d397-438a-83af-e2ff8a9900f1', 'baseFontName': 'Helvetica-BoldOblique', 'fontSize': 10, 'isImport': true };
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
                            const points: Array<any> = [];
                            for (let i: number = 0; i < annotation.vertexPoints.length; i++) {
                                points.push(this.convertVertexPoints(annotation.vertexPoints[parseInt(i.toString(), 10)]));
                            }
                            newAnnotation.VertexPoints = points;
                        }
                        newAnnotation.EnableShapeLabel = annotation.enableShapeLabel;
                        if (annotation.subject === 'Distance calculation' || annotation.subject === 'Perimeter calculation' || annotation.subject === 'Area calculation' || annotation.subject === 'Radius calculation' || annotation.subject === 'Volume calculation') {
                            newAnnotation.AnnotType = 'shape_measure';
                            const calibrate: any = annotation.calibrate;
                            if (calibrate) {
                                newAnnotation.Calibrate = {
                                    'Ratio': calibrate.ratio, 'X': [{ 'Unit': calibrate.x[0].unit, 'ConversionFactor': calibrate.x[0].conversionFactor, 'FractionalType': calibrate.x[0].fractionalType, 'Denominator': calibrate.x[0].denominator, 'FormatDenominator': calibrate.x[0].formatDenominator }],

                                    'Distance': [{ 'Unit': calibrate.distance[0].unit, 'ConversionFactor': calibrate.distance[0].conversionFactor, 'FractionalType': calibrate.distance[0].fractionalType, 'Denominator': calibrate.distance[0].denominator, 'FormatDenominator': calibrate.distance[0].formatDenominator }],

                                    'Area': [{ 'Unit': calibrate.area[0].unit, 'ConversionFactor': calibrate.area[0].conversionFactor, 'FractionalType': calibrate.area[0].fractionalType, 'Denominator': calibrate.area[0].denominator, 'FormatDenominator': calibrate.area[0].formatDenominator }],

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
     * @param {any} bounds - It describes about the bounds
     * @param {boolean} isRect - It describes about the whether the isRect is true or not
     * @param {boolean} isStamp - It describes about the whether the isStamp is true or not
     * @private
     * @returns {any} - any
     */
    public convertBounds(bounds: any, isRect?: boolean, isStamp?: boolean): IRectangleBounds | IRectBounds {
        if (bounds) {
            if (isRect) {
                const left: number = bounds.left ? bounds.left : bounds.Left ? bounds.Left : 0;
                const right: number = bounds.right ? bounds.right : bounds.Right ? bounds.Right : 0;
                const bottom: number = bounds.bottom ? bounds.bottom : bounds.Bottom ? bounds.Bottom : 0;
                const top: number = bounds.top ? bounds.top : bounds.Top ? bounds.Top : 0;
                return { left: left, right: right, bottom: bottom, top: top };
            } else {
                const x: number = bounds.x ? bounds.x : bounds.left ? bounds.left : bounds.Left ? bounds.Left : 0;
                const y: number = bounds.y ? bounds.y : bounds.top ? bounds.top : bounds.Top ? bounds.Top : 0;
                const width: number = bounds.width ? bounds.width : bounds.Width ? bounds.Width : 0;
                const height: number = bounds.height ? bounds.height : bounds.Height ? bounds.Height : 0;
                if (isStamp) {
                    return { X: this.ConvertPixelToPoint(x), Y: this.ConvertPixelToPoint(y), Left: this.ConvertPixelToPoint(x),
                        Top: this.ConvertPixelToPoint(y), Height: this.ConvertPixelToPoint(height),
                        Width: this.ConvertPixelToPoint(width) };
                } else {
                    return { X: x, Y: y, Left: x, Top: y, Height: height, Width: width };
                }
            }
        }
        return null;
    }

    /**
     * @private
     * @param {any} number - It describes about the number
     * @returns {number} - number
     */
    public ConvertPixelToPoint(number: any): number {
        return (number * (72 / 96));
    }


    private convertVertexPoints(points: any): any {
        if (points) {
            const x: number = points.x ? points.x : points.X ? points.X : 0;
            const y: number = points.y ? points.y : points.Y ? points.Y : 0;
            return { X: x, Y: y, Left: x, Top: y };
        }
    }


    private updateComments(annotation: any, comments: any): any {
        if (annotation && comments) {
            const newAnnotation: any = {};
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
            newAnnotation.IsLock = comments.isLock;
            return newAnnotation;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public removeFocus(): void {
        if (isBlazor()) {
            const currentPageContainer: any = this.pdfViewer.element.querySelector('#' + this.pdfViewer.element.id + '_totalPage');
            if (currentPageContainer && currentPageContainer.firstElementChild &&
                currentPageContainer.firstElementChild.firstElementChild) {
                currentPageContainer.firstElementChild.firstElementChild.blur();
            }
        }
    }

    /**
     * @param {boolean} isEdited - It describes about the whether isEdited is true or not
     * @private
     * @returns {void}
     */
    public updateDocumentEditedProperty(isEdited: boolean): void {
        this.pdfViewer.allowServerDataBinding = true;
        this.pdfViewer.isDocumentEdited = isEdited;
        this.pdfViewer.allowServerDataBinding = false;
    }

    /**
     * @private
     * @returns {number} - number
     */
    public getWindowDevicePixelRatio(): number {
        let devicePixelRatio: number = window.devicePixelRatio;
        if (!Browser.isDevice) {
            return devicePixelRatio;
        } else {
            return devicePixelRatio = 2;
        }
    }

    /**
     * @param {any} zoom - It describes about the zoom value
     * @private
     * @returns {number} - number
     */
    public getZoomRatio(zoom?: any): number {
        const zoomFactor: number = this.getZoomFactor();
        const zoomValue: any = zoom ? zoom : 1;
        let ratio: number;
        const devicePixelRatio: any = this.getWindowDevicePixelRatio();
        if (!Browser.isDevice || (Browser.isDevice && zoomFactor <= 0.7)) {
            ratio = zoomValue * devicePixelRatio;
        } else {
            ratio = zoomValue;
        }
        return ratio;
    }

    /**
     * @param {number} Rotate - It describes about the rotate
     * @param {number} pageNumber - It describes about the page number
     * @param {any} bounds - It describes about the bounds
     * @param {number} originalRotation - It describes about the original rotation
     * @private
     * @returns {any} - any
     */
    public importJsonForRotatedDocuments(Rotate: number, pageNumber: number, bounds: any, originalRotation?: number): any {
        let rotateAngle: number = Math.abs(Rotate);
        const pageDetails: ISize = this.pageSize[parseInt(pageNumber.toString(), 10)];
        //originalRotation = !isNullOrUndefined(originalRotation) ? originalRotation : pageDetails.rotation;
        if (originalRotation !== pageDetails.rotation) {
            rotateAngle = this.getRotationAngle(originalRotation, pageNumber);
            this.isPageRotated = true;
        } else {
            rotateAngle = 0;
            this.isPageRotated = false;
        }
        if (rotateAngle === 1) {
            return { X: pageDetails.width - bounds.Y - bounds.Height, Y: bounds.X, Height: bounds.Width, Width: bounds.Height };
        } else if (rotateAngle === 2) {
            return { X: pageDetails.width - bounds.X - bounds.Width, Y: pageDetails.height - bounds.Y - bounds.Height,
                Height: bounds.Height, Width: bounds.Width };
        } else if (rotateAngle === 3) {
            return { X: bounds.Y, Y: pageDetails.height - bounds.X - bounds.Width, Height: bounds.Width, Width: bounds.Height };
        } else {
            return bounds;
        }
    }

    public getRotationAngle(originalRotation: number, pageNumber: number): any {
        const pageDetails: ISize = this.pageSize[parseInt(pageNumber.toString(), 10)];
        originalRotation = Math.abs(originalRotation);
        let rotateAngle: number;
        if (originalRotation === 0) {
            return rotateAngle = pageDetails.rotation;
        } else if (originalRotation === 1 || originalRotation === 90) {
            if (pageDetails.rotation === 0) {
                return rotateAngle = 3;
            } else if (pageDetails.rotation === 2) {
                return rotateAngle = 1;
            } else if (pageDetails.rotation === 3) {
                return rotateAngle = 2;
            }
        } else if (originalRotation === 2 || originalRotation === 180) {
            if (pageDetails.rotation === 0) {
                return rotateAngle = 2;
            } else if (pageDetails.rotation === 1) {
                return rotateAngle = 3;
            } else if (pageDetails.rotation === 3) {
                return rotateAngle = 1;
            }
        } else if (originalRotation === 3 || originalRotation === 270) {
            if (pageDetails.rotation === 0) {
                return rotateAngle = 1;
            } else if (pageDetails.rotation === 2) {
                return rotateAngle = 3;
            } else if (pageDetails.rotation === 1) {
                return rotateAngle = 2;
            }
        }
    }

    /**
     * @param {number} Rotate - It describes about the rotate
     * @param {number} pageNumber - It describes about the page number
     * @param {any} vertexPoints - It describes about the vertex points
     * @param {number} originalRotation - It describes about the original rotation
     * @private
     * @returns {IPoint[]} - IPoint[]
     */
    public calculateVertexPoints(Rotate: number, pageNumber: number, vertexPoints: any, originalRotation?: number): IPoint[] {
        let rotateAngle: number = Math.abs(Rotate);
        const vPoints: IPoint[] = [];
        const pageDetails: ISize = this.pageSize[parseInt(pageNumber.toString(), 10)];
        let x: number;
        let y: number;
        let point: IPoint;
        //originalRotation = !isNullOrUndefined(originalRotation) ? originalRotation : pageDetails.rotation;
        if (originalRotation !== pageDetails.rotation) {
            rotateAngle = this.getRotationAngle(originalRotation, pageNumber);
        } else {
            rotateAngle = 0;
        }
        for (let j: number = 0; j < vertexPoints.length; j++) {
            if (rotateAngle === 1) {
                x = vertexPoints[parseInt(j.toString(), 10)].Y ? pageDetails.width - vertexPoints[parseInt(j.toString(), 10)].Y :
                    pageDetails.width - vertexPoints[parseInt(j.toString(), 10)].y;
                y = vertexPoints[parseInt(j.toString(), 10)].X ? vertexPoints[parseInt(j.toString(), 10)].X :
                    vertexPoints[parseInt(j.toString(), 10)].x;
                point = { x: x, y: y };
                vPoints.push(point);
            } else if (rotateAngle === 2) {
                x = vertexPoints[parseInt(j.toString(), 10)].X ? pageDetails.width - vertexPoints[parseInt(j.toString(), 10)].X :
                    pageDetails.width - vertexPoints[parseInt(j.toString(), 10)].x;
                y = vertexPoints[parseInt(j.toString(), 10)].Y ? pageDetails.height - vertexPoints[parseInt(j.toString(), 10)].Y :
                    pageDetails.height - vertexPoints[parseInt(j.toString(), 10)].y;
                const point: IPoint = { x: x, y: y };
                vPoints.push(point);
            } else if (rotateAngle === 3) {
                x = vertexPoints[parseInt(j.toString(), 10)].Y ? vertexPoints[parseInt(j.toString(), 10)].Y :
                    vertexPoints[parseInt(j.toString(), 10)].y;
                y = vertexPoints[parseInt(j.toString(), 10)].X ? pageDetails.height - vertexPoints[parseInt(j.toString(), 10)].X :
                    pageDetails.height - vertexPoints[parseInt(j.toString(), 10)].x;
                point = { x: x, y: y };
                vPoints.push(point);
            } else {
                x = vertexPoints[parseInt(j.toString(), 10)].X ? vertexPoints[parseInt(j.toString(), 10)].X :
                    vertexPoints[parseInt(j.toString(), 10)].x;
                y = vertexPoints[parseInt(j.toString(), 10)].Y ? vertexPoints[parseInt(j.toString(), 10)].Y :
                    vertexPoints[parseInt(j.toString(), 10)].y;
                const point: IPoint = { x: x, y: y };
                vPoints.push(point);
            }
        }
        return vPoints;
    }

    /**
     * @param {any} data - It describes about the data
     * @private
     * @returns {boolean} - boolean
     */
    public isSignaturePathData(data: any): boolean {
        // eslint-disable-next-line
        const pathRegex = /^([Mm]\s*\d+(\.\d+)?\s*,\s*\d+(\.\d+)?(\s+[Ll]\s*\d+(\.\d+)?\s*,\s*\d+(\.\d+)?)*\s*)+$/;
        // eslint-disable-next-line
        const regex = /^(?:(?:\{(?:\s*"[^"]*"\s*:\s*(?:(?:"[^"]*")|(?:\d+)|(?:true|false)|null|(?:\{.*\}|(?:\[[^\]]*\])))\s*,\s*)*(?:\s*"[^"]*"\s*:\s*(?:(?:"[^"]*")|(?:\d+)|(?:true|false)|null|(?:\{.*\}|(?:\[[^\]]*\]))))?\s*\})|(?:\[(?:(?:"[^"]*")|(?:\d+)|(?:true|false)|null|(?:\{.*\}|(?:\[[^\]]*\])))\s*,\s*)*(?:(?:"[^"]*")|(?:\d+)|(?:true|false)|null|(?:\{.*\}|(?:\[[^\]]*\])))?\s*\])$/;
        if (pathRegex.test(data) || regex.test(data))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * @param {any} data - It describes about the data
     * @private
     * @returns {boolean} - boolean
     */
    public isSignatureImageData(data: any): boolean {
        const base64ImageRegex: RegExp = /^data:image\/([a-z]+);base64,/;
        return base64ImageRegex.test(data);
    }

    /**
     * @param {any} annotationData - It describes about the annotation data
     * @private
     * @returns {string} - string
     */
    public getSanitizedString(annotationData: any): string {
        // eslint-disable-next-line
        const sanitizedString: string = annotationData.replace(/[\x00-\x1F\x7F]/g, (c: any): any => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);
        return sanitizedString;
    }

    /**
     * @param {number} pageIndex - It describes about the page index
     * @param {boolean} isTextSearch - It describes about the whether isTextSearch is true or not
     * @private
     * @returns {object} - object
     */
    public getLinkInformation(pageIndex: number, isTextSearch?: boolean): object {
        let zoomFactor: number = this.retrieveCurrentZoomFactor();
        if (this.pdfViewer.restrictZoomRequest && !this.pdfViewer.tileRenderingSettings.enableTileRendering) {
            zoomFactor = 1;
        }
        const id: string = this.documentId + '_' + pageIndex;
        let storedImage: any = this.pageImageDetails ? this.pageImageDetails[id + '_' + zoomFactor + '_imageUrl'] ? this.pageImageDetails[id + '_' + zoomFactor + '_imageUrl'] : this.getPinchZoomPage(pageIndex) : this.getPinchZoomPage(pageIndex);
        const storedHyperlink: any = this.hyperlinkAndLinkAnnotation ? this.hyperlinkAndLinkAnnotation[id + '_hyperlinkAndLinkAnnotation'] ? this.hyperlinkAndLinkAnnotation[id + '_hyperlinkAndLinkAnnotation'] : this.getPinchZoomPage(pageIndex) : this.getPinchZoomPage(pageIndex);
        const storedTextDetails: any = this.pageTextDetails ? this.pageTextDetails[id + '_textDetails'] ? this.pageTextDetails[id + '_textDetails'] : this.getPinchZoomPage(pageIndex) : this.getPinchZoomPage(pageIndex);
        if (!storedImage) {
            const storedTileData: string = this.getStoredTileImageDetails(pageIndex, 0, 0, zoomFactor);
            if (storedTileData) {
                storedImage = storedTileData;
            }
        }
        let imageUrl: object = null;
        let linkAnnotation: object = null;
        let textDetails: object = null;
        let mergedObj: object = null;
        if (storedImage && storedHyperlink) {
            imageUrl = JSON.parse(storedImage);
            linkAnnotation = JSON.parse(storedHyperlink);
            textDetails = JSON.parse(storedTextDetails);
            mergedObj = Object.assign({}, imageUrl, linkAnnotation, textDetails);
            this.isPinchZoomStorage = false;
        }
        return mergedObj;
    }

    /**
     * @param canvas
     * @private
     */
    // eslint-disable-next-line
    public releaseCanvas(canvas: HTMLCanvasElement): void {
        canvas.width = 1;
        canvas.height = 1;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, 1, 1);
        }
    }

    /**
     * @param {string} moduleName - It describes about the module name
     * @private
     * @returns {void}
     */
    public getModuleWarningMessage(moduleName: string): void {
        console.warn(`[WARNING] :: Module '${moduleName}' is not available in PDF Viewer component! You either misspelled the module name or forgot to load it.`);
    }

    /**
     * @param {any} annotationSelectorSettings - Gets annotationSelectorSettings
     * @private
     * @returns {void}
     */
    public updateSelectorSettings(annotationSelectorSettings: any): void {
        if (this.pdfViewer.annotationSelectorSettings && this.pdfViewer.annotationSelectorSettings.resizerFillColor !== '#FF4081') {
            annotationSelectorSettings.resizerFillColor = this.pdfViewer.annotationSelectorSettings.resizerFillColor;
        }
        if (this.pdfViewer.annotationSelectorSettings && this.pdfViewer.annotationSelectorSettings.resizerBorderColor !== 'black') {
            annotationSelectorSettings.resizerBorderColor = this.pdfViewer.annotationSelectorSettings.resizerBorderColor;
        }
        if (this.pdfViewer.annotationSelectorSettings && this.pdfViewer.annotationSelectorSettings.selectionBorderColor !== '') {
            annotationSelectorSettings.selectionBorderColor = this.pdfViewer.annotationSelectorSettings.selectionBorderColor;
        }
        if (this.pdfViewer.annotationSelectorSettings && this.pdfViewer.annotationSelectorSettings.resizerSize !== 8) {
            annotationSelectorSettings.resizerSize = this.pdfViewer.annotationSelectorSettings.resizerSize;
        }
        if (this.pdfViewer.annotationSelectorSettings && this.pdfViewer.annotationSelectorSettings.resizerShape !== 'Square') {
            annotationSelectorSettings.resizerShape = this.pdfViewer.annotationSelectorSettings.resizerShape;
        }
        if (this.pdfViewer.annotationSelectorSettings && this.pdfViewer.annotationSelectorSettings.resizerCursorType !== null) {
            annotationSelectorSettings.resizerCursorType = this.pdfViewer.annotationSelectorSettings.resizerCursorType;
        }
        if (this.pdfViewer.annotationSelectorSettings && this.pdfViewer.annotationSelectorSettings.selectionBorderThickness !== 1) {
            annotationSelectorSettings.selectionBorderThickness = this.pdfViewer.annotationSelectorSettings.selectionBorderThickness;
        }
        if (this.pdfViewer.annotationSelectorSettings && this.pdfViewer.annotationSelectorSettings.selectorLineDashArray.length !== 0) {
            annotationSelectorSettings.selectorLineDashArray = this.pdfViewer.annotationSelectorSettings.selectorLineDashArray;
        }
    }
    /**
     * @param {any} annotation - Gets the annotation
     * @private
     * @returns {void}
     */
    public annotationSelectorSettingLoad(annotation: any): void {
        if (annotation.AnnotationType === 'shape') {
            if (annotation.ShapeAnnotationType === 'Line') {
                annotation.AnnotationSelectorSettings = this.pdfViewer.lineSettings.annotationSelectorSettings ?
                    this.pdfViewer.lineSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                this.updateSelectorSettings(annotation.AnnotationSelectorSettings);
            }
            else if (annotation.ShapeAnnotationType === 'Arrow') {
                annotation.AnnotationSelectorSettings = this.pdfViewer.arrowSettings.annotationSelectorSettings ?
                    this.pdfViewer.arrowSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                this.updateSelectorSettings(annotation.AnnotationSelectorSettings);
            }
            else if (annotation.ShapeAnnotationType === 'Rectangle' || annotation.ShapeAnnotationType === 'Square') {
                annotation.AnnotationSelectorSettings = this.pdfViewer.rectangleSettings.annotationSelectorSettings ?
                    this.pdfViewer.rectangleSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                this.updateSelectorSettings(annotation.AnnotationSelectorSettings);
            }
            else if (annotation.ShapeAnnotationType === 'Circle' || annotation.ShapeAnnotationType === 'Ellipse') {
                annotation.AnnotationSelectorSettings = this.pdfViewer.circleSettings.annotationSelectorSettings ?
                    this.pdfViewer.circleSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                this.updateSelectorSettings(annotation.AnnotationSelectorSettings);
            }
            else if (annotation.ShapeAnnotationType === 'Polygon') {
                annotation.AnnotationSelectorSettings = this.pdfViewer.polygonSettings.annotationSelectorSettings ?
                    this.pdfViewer.polygonSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                this.updateSelectorSettings(annotation.AnnotationSelectorSettings);
            }

        }
        if (annotation.AnnotType === 'shape_measure') {
            if (annotation.ShapeAnnotationType === 'Circle') {
                annotation.AnnotationSelectorSettings = this.pdfViewer.radiusSettings.annotationSelectorSettings ?
                    this.pdfViewer.radiusSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                this.updateSelectorSettings(annotation.AnnotationSelectorSettings);
            }
            else if (annotation.ShapeAnnotationType === 'Line') {
                annotation.AnnotationSelectorSettings = this.pdfViewer.distanceSettings.annotationSelectorSettings ?
                    this.pdfViewer.distanceSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                this.updateSelectorSettings(annotation.AnnotationSelectorSettings);

            }
            else if (annotation.ShapeAnnotationType === 'Polyline') {
                annotation.AnnotationSelectorSettings = this.pdfViewer.perimeterSettings.annotationSelectorSettings ?
                    this.pdfViewer.perimeterSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                this.updateSelectorSettings(annotation.AnnotationSelectorSettings);
            }
            else if (annotation.ShapeAnnotationType === 'Polygon' && annotation.Indent === 'PolygonVolume') {
                annotation.AnnotationSelectorSettings = this.pdfViewer.volumeSettings.annotationSelectorSettings ?
                    this.pdfViewer.volumeSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                this.updateSelectorSettings(annotation.AnnotationSelectorSettings);
            }
            else if (annotation.ShapeAnnotationType === 'Polygon') {
                annotation.AnnotationSelectorSettings = this.pdfViewer.areaSettings.annotationSelectorSettings ?
                    this.pdfViewer.areaSettings.annotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                this.updateSelectorSettings(annotation.AnnotationSelectorSettings);
            }
        }
    }
    /**
     * @param {any} pageAnotationBounds - Gets pageAnotationBounds
     * @param {any} baseAnnotationBounds - Gets baseAnnotationBounds
     * @private
     * @returns {boolean} - boolean
     */
    public boundsCalculation(pageAnotationBounds: any, baseAnnotationBounds: any): boolean {
        if (isNullOrUndefined(pageAnotationBounds) && isNullOrUndefined(baseAnnotationBounds.x) &&
        isNullOrUndefined(baseAnnotationBounds.y) && isNullOrUndefined(baseAnnotationBounds.width) &&
        isNullOrUndefined(baseAnnotationBounds.height) && isNullOrUndefined(baseAnnotationBounds) &&
        isNullOrUndefined(baseAnnotationBounds.x) && isNullOrUndefined(baseAnnotationBounds.y) &&
        isNullOrUndefined(baseAnnotationBounds.height) && isNullOrUndefined(baseAnnotationBounds.width)){
            return false;
        }
        const left: number = parseFloat(baseAnnotationBounds.x.toFixed(10));
        const top: number = parseFloat(baseAnnotationBounds.y.toFixed(10));
        const width: number = parseFloat(baseAnnotationBounds.width.toFixed(10));
        const height: number = parseFloat(baseAnnotationBounds.height.toFixed(10));
        const pageLeft: number = pageAnotationBounds.x ? parseFloat(pageAnotationBounds.x.toFixed(10)) :
            parseFloat(pageAnotationBounds.left.toFixed(10));
        const pageTop: number = pageAnotationBounds.y ? parseFloat(pageAnotationBounds.y.toFixed(10)) :
            parseFloat(pageAnotationBounds.top.toFixed(10));
        const pageWidth: number = parseFloat(pageAnotationBounds.width.toFixed(10));
        const pageHeight: number = parseFloat(pageAnotationBounds.height.toFixed(10));
        return (left !== pageLeft || top !== pageTop || width !== pageWidth || height !== pageHeight);
    }
}

export interface IRectangleBounds {
    left: number
    right: number
    bottom: number
    top: number
}

export interface IRectBounds {
    X: number
    Y: number
    Left: number
    Top: number
    Height: number
    Width: number
}



