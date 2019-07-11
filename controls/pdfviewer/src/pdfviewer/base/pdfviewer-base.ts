import { createElement, Browser } from '@syncfusion/ej2-base';
import { Dialog, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { PdfViewer, TextLayer, ContextMenu } from '../index';
import { NavigationPane } from './navigation-pane';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { TextMarkupAnnotation, StampAnnotation } from '../annotation';
import { AjaxHandler } from '../index';
// tslint:disable-next-line:max-line-length
import { IElement, Point, DrawingElement, PointModel, Rect, Matrix, identityMatrix, transformPointByMatrix, contains, Info, rotateMatrix } from '@syncfusion/ej2-drawings';
import { ToolBase, Actions, MouseEventArgs, SelectTool, MoveTool, ResizeTool, ConnectTool, NodeDrawingTool, PolygonDrawingTool, LineTool, RotateTool, StampTool } from '../../diagram/tools';
import { Selector } from '../../diagram/selector';
import { ActiveElements, findActiveElement } from '../../diagram/action';
import { PdfAnnotationBaseModel } from '../../diagram/pdf-annotation-model';
import { renderAdornerLayer } from '../../diagram/dom-util';
/**
 * The `ISize` module is used to handle page size property of PDF viewer.
 * @hidden
 */
export interface ISize {
    width: number;
    height: number;
    top: number;
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
    public contextMenuModule: ContextMenu;
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
    public textLayer: TextLayer;
    private pdfViewer: PdfViewer;
    // tslint:disable-next-line
    private unload: any;
    private isDocumentLoaded: boolean = false;
    /**
     * @private
     */
    public isDocumentEdited: boolean = false;
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
    private isPasswordAvailable: boolean = false;
    private document: string;
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
    /**
     * @private
     */
    public isInitialLoaded: boolean = false;
    private loadRequestHandler: AjaxHandler;
    private unloadRequestHandler: AjaxHandler;
    private dowonloadRequestHandler: AjaxHandler;
    private pageRequestHandler: AjaxHandler;
    private virtualLoadRequestHandler: AjaxHandler;
    /**
     * @private
     */
    public tool: ToolBase = null;
    public action: |string = 'Select';
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
    constructor(viewer: PdfViewer) {
        this.pdfViewer = viewer;
        this.navigationPane = new NavigationPane(this.pdfViewer, this);
        this.textLayer = new TextLayer(this.pdfViewer, this);
    }
    /**
     * @private
     */
    public initializeComponent(): void {
        let element: HTMLElement = document.getElementById(this.pdfViewer.element.id);
        if (element) {
            if (Browser.isDevice) {
                this.pdfViewer.element.classList.add('e-pv-mobile-view');
            }
            let controlWidth: string = '100%';
            let toolbarDiv: HTMLElement;
            // tslint:disable-next-line:max-line-length
            this.viewerMainContainer = createElement('div', { id: this.pdfViewer.element.id + '_viewerMainContainer', className: 'e-pv-viewer-main-container' });
            // tslint:disable-next-line:max-line-length
            this.viewerContainer = createElement('div', { id: this.pdfViewer.element.id + '_viewerContainer', className: 'e-pv-viewer-container', attrs: { 'aria-label': 'pdfviewer scroll view' } });
            if (Browser.isDevice) {
                this.createMobilePageNumberContainer();
            }
            this.viewerContainer.tabIndex = 0;
            if (this.pdfViewer.enableRtl) {
                this.viewerContainer.style.direction = 'rtl';
            }
            element.style.touchAction = 'pan-x pan-y';
            this.setMaximumHeight(element);
            // tslint:disable-next-line:max-line-length
            this.mainContainer = createElement('div', { id: this.pdfViewer.element.id + '_mainContainer', className: 'e-pv-main-container' });
            this.mainContainer.appendChild(this.viewerMainContainer);
            element.appendChild(this.mainContainer);
            if (this.pdfViewer.toolbarModule) {
                this.navigationPane.initializeNavigationPane();
                toolbarDiv = this.pdfViewer.toolbarModule.intializeToolbar(controlWidth);
            }
            if (toolbarDiv) {
                // tslint:disable-next-line:max-line-length
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 56);
            } else {
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 0);
            }
            // tslint:disable-next-line:max-line-length
            let viewerWidth: number = this.pdfViewer.element.clientWidth;
            if (!Browser.isDevice) {
                viewerWidth = viewerWidth - (this.navigationPane.sideBarToolbar ? this.navigationPane.getViewerContainerLeft() : 0) -
                    (this.navigationPane.commentPanelContainer ? this.navigationPane.getViewerContainerRight() : 0);
            }
            this.viewerContainer.style.width = viewerWidth + 'px';
            this.viewerMainContainer.appendChild(this.viewerContainer);
            if (Browser.isDevice) {
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
            if (toolbarDiv && this.pdfViewer.thumbnailViewModule && !Browser.isDevice) {
                this.pdfViewer.thumbnailViewModule.createThumbnailContainer();
            }
            this.createPrintPopup();
            if (Browser.isDevice) {
                this.createGoToPagePopup();
            }
            let waitingPopup: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_loadingIndicator' });
            this.viewerContainer.appendChild(waitingPopup);
            createSpinner({ target: waitingPopup, cssClass: 'e-spin-center' });
            this.setLoaderProperties(waitingPopup);
            this.contextMenuModule = new ContextMenu(this.pdfViewer, this);
            this.contextMenuModule.createContextMenu();
            this.wireEvents();
            if (this.pdfViewer.textSearchModule && !Browser.isDevice) {
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
        this.documentId = this.createGUID();
        this.viewerContainer.scrollTop = 0;
        this.showLoadingIndicator(true);
        this.hashId = ' ';
        this.isFileName = false;
        this.saveDocumentInfo();
        if (this.pdfViewer.interactionMode === 'Pan') {
            this.initiatePanning();
        }
        documentData = this.checkDocumentData(documentData);
        this.setFileName();
        let jsonObject: object = this.constructJsonObject(documentData, password);
        this.createAjaxRequest(jsonObject, documentData, password);
    }
    // tslint:disable-next-line
    private mobileScrollContainerDown(event: any) {
        this.ispageMoved = false;
        this.isThumb = true;
        if (this.isTextMarkupAnnotationModule()) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage != null && Browser.isDevice) {
                let pageNumber: number = this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearAnnotationSelection(pageNumber);
                this.pdfViewer.toolbar.showToolbar(true);
            }
        }
        this.mobileScrollerContainer.addEventListener('touchmove', this.viewerContainerOnScroll.bind(this), true);
    }
    // tslint:disable-next-line
    private setMaximumHeight(element: any): void {
        if (!Browser.isDevice) {
            element.style.minHeight = '500px';
        }
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
        this.loadRequestHandler = new AjaxHandler(this.pdfViewer);
        this.loadRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.load;
        this.loadRequestHandler.responseType = 'json';
        this.loadRequestHandler.mode = true;
        // tslint:disable-next-line
        jsonObject['action'] = 'Load';
        this.loadRequestHandler.send(jsonObject);
        // tslint:disable-next-line
        this.loadRequestHandler.onSuccess = function (result: any) {
            // tslint:disable-next-line
            let data: any = result.data;
            if (typeof data !== 'object') {
                data = JSON.parse(data);
            }
            proxy.requestSuccess(data, documentData, password);
        };
        // tslint:disable-next-line
        this.loadRequestHandler.onFailure = function (result: any) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
        };
        // tslint:disable-next-line
        this.loadRequestHandler.onError = function (result: any) {
            proxy.openNotificationPopup();
            proxy.showLoadingIndicator(false);
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
        };
    }

    /**
     * @private
     */
    public openNotificationPopup(): void {
        this.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('Server error'));
        this.getElement('_notify').classList.add('e-pv-notification-large-content');
    }

    // tslint:disable-next-line
    private requestSuccess(data: any, documentData: string, password: string): void {
        if (data && data.pageCount !== undefined) {
            this.pageCount = data.pageCount;
            this.hashId = data.hashId;
            this.documentLiveCount = data.documentLiveCount;
            this.saveDocumentHashData();
            this.pageRender(data);
            if (Browser.isDevice) {
                this.mobileScrollerContainer.style.display = '';
                this.mobileScrollerContainer.style.top = (this.toolbarHeight) + 'px';
            }
        } else {
            this.pageCount = 0;
            this.currentPageNumber = 0;
            if (Browser.isDevice) {
                this.mobileScrollerContainer.style.display = 'none';
            }
            if (data === 4) {
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
        if (this.pdfViewer.thumbnailViewModule && !Browser.isDevice) {
            this.pdfViewer.thumbnailViewModule.createRequestForThumbnails();
        }
        if (this.pdfViewer.bookmarkViewModule) {
            this.pdfViewer.bookmarkViewModule.createRequestForBookmarks();
        }
        if (this.pdfViewer.annotationModule && this.pdfViewer.toolbar) {
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.initializeAcccordionContainer();
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.createRequestForComments();
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
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.isAutoZoom = true;
            this.pdfViewer.magnificationModule.isInitialLoading = true;
            this.onWindowResize();
            this.pdfViewer.magnificationModule.isInitialLoading = false;
        }
        this.isDocumentLoaded = true;
        if (this.renderedPagesList.indexOf(pageIndex) === -1) {
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
        this.currentPageNumber = pageIndex + 1;
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.uploadedDocumentName = null;
            this.pdfViewer.toolbarModule.updateCurrentPage(this.currentPageNumber);
            this.pdfViewer.toolbarModule.updateToolbarItems();
            this.viewerContainer.setAttribute('aria-labelledby', this.pdfViewer.element.id + '_pageDiv_' + (this.currentPageNumber - 1));
        }
        if (Browser.isDevice) {
            this.mobileSpanContainer.innerHTML = this.currentPageNumber.toString();
            this.mobilecurrentPageContainer.innerHTML = this.currentPageNumber.toString();
        }
    }

    private renderPasswordPopup(documentData: string, password: string): void {
        if (!this.isPasswordAvailable) {
            if (this.isFileName) {
                this.document = documentData;
            } else {
                this.document = 'data:application/pdf;base64,' + documentData;
            }
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
    }

    private renderCorruptPopup(): void {
        this.pdfViewer.fireDocumentLoadFailed(false, null);
        this.createCorruptedPopup();
        this.documentId = null;
        this.corruptPopup.show();
    }
    private constructJsonObject(documentData: string, password: string): object {
        let jsonObject: object;
        if (password) {
            this.isPasswordAvailable = true;
            // tslint:disable-next-line:max-line-length
            jsonObject = { document: documentData, password: password, zoomFactor: 1, isFileName: this.isFileName };
        } else {
            this.isPasswordAvailable = false;
            jsonObject = { document: documentData, zoomFactor: 1, isFileName: this.isFileName };
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
            if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.uploadedDocumentName !== null) {
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
        window.sessionStorage.setItem('unload', this.pdfViewer.serverActionSettings.unload);
    }
    private saveDocumentHashData(): void {
        window.sessionStorage.setItem('hashId', this.hashId);
        window.sessionStorage.setItem('documentLiveCount', this.documentLiveCount.toString());
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
            if (this.getZoomFactor() > 1.25 && pageCurrentRect.width > this.viewerContainer.clientWidth) {
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
        if (waitingPopup != null) {
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
    public clear(isTriggerEvent: boolean): void {
        this.isPasswordAvailable = false;
        this.isDocumentLoaded = false;
        this.isInitialLoaded = false;
        this.initiateTextSelectMode();
        if (!Browser.isDevice) {
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
        if (this.pageSize) {
            this.pageSize = [];
        }
        if (this.renderedPagesList) {
            this.renderedPagesList = [];
        }
        while (this.pageContainer.hasChildNodes()) {
            this.pageContainer.removeChild(this.pageContainer.lastChild);
        }
        if (this.pageCount > 0) {
            this.unloadDocument(this);
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
        if (Browser.isDevice) {
            this.pdfViewer.element.classList.remove('e-pv-mobile-view');
        }
        this.unWireEvents();
        this.clear(false);
        this.pageContainer.parentNode.removeChild(this.pageContainer);
        this.viewerContainer.parentNode.removeChild(this.viewerContainer);
        this.contextMenuModule.destroy();
        let measureElement: HTMLElement = document.getElementById('measureElement');
        if (measureElement) {
            measureElement.parentElement.removeChild(measureElement);
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
            let jsonObject: object = { hashId: documentId, documentLiveCount: documentLiveCount, action: 'Unload' };
            this.unloadRequestHandler = new AjaxHandler(this.pdfViewer);
            this.unloadRequestHandler.url = window.sessionStorage.getItem('serviceURL') + '/' + window.sessionStorage.getItem('unload');
            this.unloadRequestHandler.mode = false;
            this.unloadRequestHandler.responseType = null;
            this.unloadRequestHandler.send(jsonObject);
            // tslint:disable-next-line
            this.unloadRequestHandler.onFailure = function (result: any) {
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
            };
            // tslint:disable-next-line
            this.unloadRequestHandler.onError = function (result: any) {
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
            };
        }
        window.sessionStorage.removeItem('hashId');
        window.sessionStorage.removeItem('documentLiveCount');
    }
    /**
     * @private
     */
    private windowSessionStorageClear(): void {
        window.sessionStorage.removeItem('currentDocument');
        window.sessionStorage.removeItem('serviceURL');
        window.sessionStorage.removeItem('unload');
        this.sessionStorage.forEach((element: string) => {
            window.sessionStorage.removeItem(element);
        });
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
    public focusViewerContainer(): void {
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
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1 || navigator.userAgent.indexOf('Edge') !== -1 && parentNode != null) {
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
        if (Browser.isDevice) {
            // tslint:disable-next-line
            let ratio: any = (this.viewerContainer.scrollHeight - this.viewerContainer.clientHeight) / (this.viewerContainer.clientHeight - 56);
            // tslint:disable-next-line
            let differenceRatio: any = (this.viewerContainer.scrollTop) / ratio;
            this.mobileScrollerContainer.style.top = (this.toolbarHeight + differenceRatio) + 'px';
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
        if (!Browser.isDevice) {
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
        if (this.promptElement) {
            this.promptElement.classList.remove('e-pv-password-error');
            this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Enter Password');
            (this.passwordInput as HTMLInputElement).value = '';
        }
    }

    private applyPassword(): void {
        let password: string = (this.passwordInput as HTMLInputElement).value;
        if (password !== '') {
            this.pdfViewer.load(this.document, password);
        }
        this.focusViewerContainer();
    }

    private wireEvents(): void {
        this.viewerContainer.addEventListener('scroll', this.viewerContainerOnScroll, true);
        if (Browser.isDevice) {
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
        if (Browser.isDevice) {
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
    /**
     * @private
     */
    public onWindowResize = (): void => {
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
        // tslint:disable-next-line:max-line-length
        let viewerWidth: number = (proxy.pdfViewer.element.clientWidth - (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) - (proxy.navigationPane.commentPanelContainer ? proxy.navigationPane.getViewerContainerRight() : 0));
        proxy.viewerContainer.style.width = viewerWidth + 'px';
        if (proxy.pdfViewer.toolbarModule) {
            let toolbarHeight: number = proxy.getElement('_toolbarContainer').getBoundingClientRect().height;
            if (proxy.isAnnotationToolbarHidden() || Browser.isDevice) {
                // tslint:disable-next-line:max-line-length
                proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, toolbarHeight);
            } else {
                let annotationToolbarHeight: number = proxy.getElement('_annotation_toolbar').getBoundingClientRect().height;
                // tslint:disable-next-line:max-line-length
                proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, toolbarHeight + annotationToolbarHeight);
            }
        } else {
            proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 0);
        }
        if (proxy.pdfViewer.bookmarkViewModule && Browser.isDevice) {
            let bookmarkContainer: HTMLElement = proxy.getElement('_bookmarks_container');
            if (bookmarkContainer) {
                bookmarkContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 0);
            }
        }
        if (proxy.viewerContainer.style.height === '0px' && proxy.viewerContainer.style.width === '0px') {
            if (proxy.pdfViewer.width.toString() === 'auto') {
                proxy.pdfViewer.width = 500;
            }
            if (proxy.pdfViewer.height.toString() === 'auto') {
                proxy.pdfViewer.height = 500;
            }
            proxy.viewerContainer.style.width = proxy.pdfViewer.width + 'px';
            proxy.viewerContainer.style.height = proxy.pdfViewer.height + 'px';
        }
        proxy.pageContainer.style.width = proxy.viewerContainer.clientWidth + 'px';
        if (proxy.pdfViewer.toolbarModule) {
            // tslint:disable-next-line:max-line-length
            proxy.pdfViewer.toolbarModule.onToolbarResize((proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerMainContainerWidth() : proxy.pdfViewer.element.clientWidth));
        }
        if (this.pdfViewer.enableToolbar && this.pdfViewer.thumbnailViewModule) {
            proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.currentPageNumber - 1);
        }
        if (proxy.pdfViewer.textSearchModule && !Browser.isDevice) {
            proxy.pdfViewer.textSearchModule.textSearchBoxOnResize();
        }
        if (!proxy.navigationPane.isBookmarkListOpen) {
            proxy.updateZoomValue();
        }
        if (Browser.isDevice) {
            proxy.mobileScrollerContainer.style.left = (viewerWidth - parseFloat(proxy.mobileScrollerContainer.style.width)) + 'px';
            proxy.mobilePageNoContainer.style.left = (viewerWidth / 2) - (parseFloat(proxy.mobilePageNoContainer.style.width) / 2) + 'px';
            proxy.mobilePageNoContainer.style.top = (proxy.pdfViewer.element.clientHeight / 2) + 'px';
            proxy.updateMobileScrollerPosition();
        } else {
            proxy.navigationPane.setResizeIconTop();
        }
    }
    /**
     * @private
     */
    public updateZoomValue(): void {
        if (this.pdfViewer.magnificationModule) {
            if (this.pdfViewer.magnificationModule.isAutoZoom) {
                this.pdfViewer.magnificationModule.fitToAuto();
            } else if (this.pdfViewer.magnificationModule.fitType === 'fitToWidth') {
                this.pdfViewer.magnificationModule.fitToWidth();
            }
        }
        for (let i: number = 0; i < this.pageCount; i++) {
            this.applyLeftPosition(i);
        }
    }

    private viewerContainerOnMousedown = (event: MouseEvent): void => {
        let isUpdate: Boolean = false;
        if (event.button === 0 && !this.getPopupNoteVisibleStatus() && !this.isClickedOnScrollBar(event, false)) {
            this.isViewerMouseDown = true;
            if (event.detail === 1) {
                isUpdate = true;
                this.focusViewerContainer();
            }
            this.scrollPosition = this.viewerContainer.scrollTop / this.getZoomFactor();
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
            // tslint:disable-next-line
            let isIE: boolean = !!(document as any).documentMode;
            if (this.pdfViewer.textSelectionModule && !this.isClickedOnScrollBar(event, true) && !this.isTextSelectionDisabled) {
                if (!isIE) {
                    event.preventDefault();
                }
                this.pdfViewer.textSelectionModule.clearTextSelection();
            }
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
            if (document.getElementById(this.pdfViewer.element.id + '_commantPanel').style.display === 'block') {
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
                if (eventTarget.classList.contains('e-pv-page-canvas')) {
                    let idStringArray: string[] = eventTarget.id.split('_');
                    // tslint:disable-next-line
                    this.pdfViewer.firePageClick(event.offsetX, event.offsetY, parseInt(idStringArray[idStringArray.length - 1]) + 1);
                }
                if (this.isTextMarkupAnnotationModule()) {
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

    private viewerContainerOnMouseWheel = (event: MouseWheelEvent): void => {
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
                    if (this.pdfViewer.annotation.isShapeCopied) {
                        this.pdfViewer.paste();
                    }
                    break;
                default:
                    break;
            }
        } else {
            switch (event.keyCode) {
                case 46:
                    if (this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
                        this.pdfViewer.annotationModule.deleteAnnotation();
                    }
                    if (this.pdfViewer.selectedItems.annotations.length) {
                        this.pdfViewer.remove(this.pdfViewer.selectedItems.annotations[0]);
                        this.pdfViewer.renderSelector(this.pdfViewer.annotation.getEventPageNumber(event));
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
                    this.pdfViewer.textSelectionModule.textSelectionOnMouseMove(event.target, this.mouseX, this.mouseY);
                } else {
                    let selection: Selection = window.getSelection();
                    if (!selection.type && !selection.isCollapsed && selection.anchorNode !== null) {
                        this.pdfViewer.textSelectionModule.isTextSelection = true;
                    }
                }
            } else {
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
            if (event.target && ((event.target as PdfAnnotationBaseModel).id.indexOf('_text') > -1 || (event.target as HTMLElement).classList.contains('e-pv-hyperlink')) && this.pdfViewer.annotation) {
                let pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(event);
                let diagram: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
                let canvas1: Rect = diagram.getBoundingClientRect() as Rect;
                canvas = new Rect(canvas1.x + 10, canvas1.y + 10, canvas1.width - 10, canvas1.height - 10);
            }
            let stampModule: StampAnnotation = this.pdfViewer.annotationModule.stampAnnotationModule;
            if (canvas && canvas.containsPoint({ x: this.mouseX, y: this.mouseY }) && !stampModule.isStampAnnotSelected) {
                this.diagramMouseMove(event);
            } else {
                this.diagramMouseLeave(event);
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
        if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
            this.pdfViewer.toolbar.annotationToolbarModule.deselectAllItems();
        }
    }

    /**
     * @private
     */
    public initiateTextSelectMode(): void {
        this.isPanMode = false;
        this.viewerContainer.style.cursor = 'auto';
        if (this.pdfViewer.textSelectionModule) {
            this.textLayer.modifyTextCursor(true);
            this.pdfViewer.textSelectionModule.enableTextSelectionMode();
        }
        if (!Browser.isDevice) {
            this.enableAnnotationAddTools(true);
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
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled && !this.getTextMarkupAnnotationMode()) {
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
                    this.pdfViewer.textSelectionModule.selectAWord(event.target, event.clientX, event.clientY, false);
                    if (!this.getTextMarkupAnnotationMode()) {
                        this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(true, false);
                        this.dblClickTimer = setTimeout(
                            () => { this.applySelection(); }, 100);
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
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
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
                } else {
                    if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        // tslint:disable-next-line
                        let annotation: any = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
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
        if (!this.getPopupNoteVisibleStatus()) {
            if (event.button === 0) {
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled && !this.getTextMarkupAnnotationMode()) {
                    // tslint:disable-next-line:max-line-length
                    if (event.detail === 1 && !this.viewerContainer.contains(event.target as HTMLElement) && !this.contextMenuModule.contextMenuElement.contains(event.target as HTMLElement)) {
                        if (window.getSelection().anchorNode !== null) {
                            this.pdfViewer.textSelectionModule.textSelectionOnMouseup();
                        }
                    }
                    if (this.viewerContainer.contains(event.target as HTMLElement)) {
                        if (!this.isClickedOnScrollBar(event, true) && !this.isScrollbarMouseDown) {
                            this.pdfViewer.textSelectionModule.textSelectionOnMouseup();
                        } else {
                            if (window.getSelection().anchorNode !== null) {
                                this.pdfViewer.textSelectionModule.applySpanForSelection();
                            }
                        }
                    }
                } else if (this.getTextMarkupAnnotationMode()) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
                }
            } else if (event.button === 2) {
                if (this.viewerContainer.contains(event.target as HTMLElement)) {
                    window.getSelection().removeAllRanges();
                }
            }
            if (this.isViewerMouseDown) {
                this.isViewerMouseDown = false;
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                    this.pdfViewer.textSelectionModule.clear();
                    this.pdfViewer.textSelectionModule.selectionStartPage = null;
                }
                if (this.isShapeBasedAnnotationsEnabled()) {
                    this.diagramMouseUp(event);
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
        if (touchPoints.length === 1 && !((event.target as HTMLElement).classList.contains('e-pv-hyperlink'))) {
            this.preventTouchEvent(event);
        }
        if (event.touches.length === 1 && this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationTouchEnd(event);
        }
        this.touchClientX = touchPoints[0].clientX;
        this.touchClientY = touchPoints[0].clientY;
        this.scrollY = touchPoints[0].clientY;
        this.previousTime = new Date().getTime();
        // tslint:disable-next-line:max-line-length
        if (touchPoints.length === 1 && !((event.target as HTMLElement).classList.contains('e-pv-touch-select-drop') || (event.target as HTMLElement).classList.contains('e-pv-touch-ellipse'))) {
            if (Browser.isDevice && this.pageCount > 0 && !this.isThumb && !((event.target as HTMLElement).classList.contains('e-pv-hyperlink'))) {
                this.handleTaps(touchPoints);
            }
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                this.pdfViewer.textSelectionModule.clearTextSelection();
                this.contextMenuModule.contextMenuObj.close();
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
        this.singleTapTimer = setTimeout(
            () => { this.onSingleTap(touchPoints); }, 300);
        this.tapCount++;
        // tslint:disable-next-line
        let timer: any = setTimeout(
            () => { this.onDoubleTap(touchPoints); }, 200);
        if (this.tapCount > 2) {
            this.tapCount = 0;
        }
    }

    private onSingleTap(touches: TouchList): void {
        if (!this.isLongTouchPropagated && !this.navigationPane.isNavigationToolbarVisible) {
            if (this.pdfViewer.toolbarModule) {
                if ((this.touchClientX >= touches[0].clientX - 10) && (this.touchClientX <= touches[0].clientX + 10) &&
                    (this.touchClientY >= touches[0].clientY - 10) && (this.touchClientY <= touches[0].clientY + 10)) {
                    if (!this.isTapHidden) {
                        this.viewerContainer.scrollTop -= this.getElement('_toolbarContainer').clientHeight * this.getZoomFactor();
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
                        this.viewerContainer.scrollTop += this.getElement('_toolbarContainer').clientHeight * this.getZoomFactor();
                        // tslint:disable-next-line:max-line-length
                        this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 56);
                    }
                    if (this.isTapHidden && Browser.isDevice) {
                        this.mobileScrollerContainer.style.display = '';
                        this.updateMobileScrollerPosition();
                    } else if (Browser.isDevice && this.getSelectTextMarkupCurrentPage() == null) {
                        this.mobileScrollerContainer.style.display = 'none';
                    }
                    if (this.getSelectTextMarkupCurrentPage() == null) {
                        this.pdfViewer.toolbarModule.showToolbar(this.isTapHidden);
                        this.isTapHidden = !this.isTapHidden;
                    }
                }
                this.tapCount = 0;
            }
        }
    }

    private onDoubleTap(touches: TouchList): void {
        if (this.tapCount === 2) {
            if (Browser.isDevice) {
                this.mobileScrollerContainer.style.display = 'none';
            }
            this.tapCount = 0;
            if ((this.touchClientX >= touches[0].clientX - 10) && (this.touchClientX <= touches[0].clientX + 10) &&
                (this.touchClientY >= touches[0].clientY - 10) && (this.touchClientY <= touches[0].clientY + 10)) {
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
            if (Browser.isDevice) {
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
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }

    private viewerContainerOnTouchMove = (event: TouchEvent): void => {
        if (Browser.isDevice) {
            clearTimeout(this.singleTapTimer);
            this.tapCount = 0;
        }
        this.preventTouchEvent(event);
        let touchPoints: TouchList = event.touches;
        if (this.pdfViewer.magnificationModule) {
            this.isTouchScrolled = true;
            if (touchPoints.length > 1 && this.pageCount > 0) {
                if (Browser.isDevice) {
                    this.isTouchScrolled = false;
                    this.mobileScrollerContainer.style.display = 'none';
                }
                if (this.pdfViewer.enablePinchZoom) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.magnificationModule.initiatePinchMove(touchPoints[0].clientX, touchPoints[0].clientY, touchPoints[1].clientX, touchPoints[1].clientY);
                }
            } else if (touchPoints.length === 1 && this.getPagesPinchZoomed()) {
                if (Browser.isDevice) {
                    this.isTouchScrolled = false;
                    this.mobileScrollerContainer.style.display = 'none';
                }
                this.pdfViewer.magnificationModule.pinchMoveScroll();
            }
        }
        let canvas: Rect;
        if (event.target && (event.target as PdfAnnotationBaseModel).id.indexOf('_text') > -1 && this.pdfViewer.annotation) {
            let pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(event);
            let diagram: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
            let canvas1: Rect = diagram.getBoundingClientRect() as Rect;
            canvas = new Rect(canvas1.x + 10, canvas1.y + 10, canvas1.width - 10, canvas1.height - 10);
        }
        if (canvas && canvas.containsPoint({ x: this.mouseX, y: this.mouseY })) {
            this.diagramMouseMove(event);
        } else {
            this.diagramMouseLeave(event);
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
        if (Browser.isDevice && this.isTouchScrolled) {
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
        if (this.pdfViewer.enableStampAnnotations) {
            let zoomFactor: number = this.getZoomFactor();
            let stampModule: StampAnnotation = this.pdfViewer.annotationModule.stampAnnotationModule;
            if (stampModule && stampModule.isStampAnnotSelected) {
                let pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(event);
                let pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
                if (pageDiv) {
                    let pageCurrentRect: ClientRect = pageDiv.getBoundingClientRect();
                    // tslint:disable-next-line:max-line-length
                    stampModule.renderStamp((event.changedTouches[0].clientX - pageCurrentRect.left) / zoomFactor, (event.changedTouches[0].clientY - pageCurrentRect.top) / zoomFactor, null, null, pageIndex, null, null, null, null);
                    stampModule.isStampAnnotSelected = false;
                }
            }
            this.pdfViewer.annotation.onAnnotationMouseDown();
        }
        if (event.touches.length === 1 && this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationTouchEnd(event);
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
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateTotalPage();
            if (Browser.isDevice && this.mobiletotalPageContainer) {
                this.mobiletotalPageContainer.innerHTML = this.pageCount.toString();
                this.pageNoContainer.innerHTML = '(1-' + this.pageCount.toString() + ')';
            }
        }
        if (this.pageCount > 0) {
            let topValue: number = 0;
            let pageLimit: number = 0;
            if (this.pageCount > 100) {
                // to render 100 pages intially.
                pageLimit = 100;
                this.pageLimit = pageLimit;
            } else {
                pageLimit = this.pageCount;
            }
            for (let i: number = 0; i < pageLimit; i++) {
                let pageSize: string[] = pageValues.pageSizes[i].split(',');
                if (pageValues.pageSizes[i - 1] !== null && i !== 0) {
                    let previousPageHeight: string = pageValues.pageSizes[i - 1].split(',');
                    topValue = this.pageGap + parseFloat(previousPageHeight[1]) + topValue;
                } else {
                    topValue = this.pageGap;
                }
                let size: ISize = { width: parseFloat(pageSize[0]), height: parseFloat(pageSize[1]), top: topValue };
                this.pageSize.push(size);
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
        let pageValue: number = pageNumber + 1;
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
        let jsonObject: object = { hashId: proxy.hashId, isCompletePageSizeNotReceived: true, action: 'VirtualLoad' };
        this.virtualLoadRequestHandler = new AjaxHandler(this.pdfViewer);
        this.virtualLoadRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.load;
        this.virtualLoadRequestHandler.responseType = 'json';
        this.virtualLoadRequestHandler.mode = true;
        this.virtualLoadRequestHandler.send(jsonObject);
        // tslint:disable-next-line
        this.virtualLoadRequestHandler.onSuccess = function (result: any) {
            // tslint:disable-next-line
            let data: any = result.data;
            if (typeof data !== 'object') {
                data = JSON.parse(data);
            }
            if (data) {
                // tslint:disable-next-line
                let pageValues: { pageCount: any; pageSizes: any; } = data;
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
    private renderPage(data: any, pageIndex: number): void {
        if (data) {
            let pageWidth: number = this.getPageWidth(pageIndex);
            let pageHeight: number = this.getPageHeight(pageIndex);
            // tslint:disable-next-line:max-line-length
            let canvas: HTMLCanvasElement = this.getElement('_pageCanvas_' + pageIndex) as HTMLCanvasElement;
            let pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
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
                        // tslint:disable-next-line
                        if (parseInt((pageWidth * 1.5).toString()) === image.width) {
                            if (!isNaN(parseFloat(canvas.style.width))) {
                                canvas.style.width = pageWidth + 'px';
                                canvas.style.height = pageHeight + 'px';
                                canvas.height = pageHeight * window.devicePixelRatio;
                                canvas.width = pageWidth * window.devicePixelRatio;
                            }
                            // tslint:disable-next-line
                            context.setTransform(matrix.Elements[0], matrix.Elements[1], matrix.Elements[2], matrix.Elements[3], matrix.Elements[4], matrix.Elements[5]);
                            context.drawImage(image, 0, 0, canvas.width, canvas.height);
                            this.showPageLoadingIndicator(pageIndex, false);
                            if (pageIndex === 0 && this.isDocumentLoaded) {
                                this.isInitialLoaded = true;
                                this.pdfViewer.fireDocumentLoad();
                                this.isDocumentLoaded = false;
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
                let aElement: NodeListOf<HTMLAnchorElement> = pageDiv.getElementsByTagName('a');
                if (aElement.length !== 0) {
                    for (let index: number = aElement.length - 1; index >= 0; index--) {
                        aElement[index].parentNode.removeChild(aElement[index]);
                    }
                }
                this.renderTextContent(data, pageIndex);
                if (this.pdfViewer.enableHyperlink && this.pdfViewer.linkAnnotationModule) {
                    this.pdfViewer.linkAnnotationModule.renderHyperlinkContent(data, pageIndex);
                }
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                    this.pdfViewer.textSelectionModule.applySelectionRangeOnScroll(pageIndex);
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
                if (this.isShapeBasedAnnotationsEnabled()) {
                    let canvas1: HTMLElement = this.getElement('_annotationCanvas_' + pageIndex);
                    let commonStyle: string = 'position:absolute;top:0px;left:0px;overflow:hidden;pointer-events:none;';
                    let bounds: ClientRect = canvas1.getBoundingClientRect();
                    renderAdornerLayer(bounds, commonStyle, canvas1, pageIndex, this.pdfViewer);
                    this.pdfViewer.renderSelector(pageIndex);
                }
            }
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
            if (textLayer.childNodes.length === 0) {
                this.textLayer.renderTextContents(pageIndex, texts, bounds, rotation);
            } else {
                this.textLayer.resizeTextContents(pageIndex, texts, bounds, rotation);
            }
        }
    }

    private renderPageContainer(pageNumber: number, pageWidth: number, pageHeight: number, topValue: number): void {
        // tslint:disable-next-line:max-line-length
        let pageDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_pageDiv_' + pageNumber, className: 'e-pv-page-div', attrs: { 'tabindex': '0' } });
        pageDiv.style.width = pageWidth + 'px';
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
    // tslint:disable-next-line:max-line-length
    public renderPageCanvas(pageDiv: HTMLElement, pageWidth: number, pageHeight: number, pageNumber: number, displayMode: string): HTMLElement {
        let pageCanvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_pageCanvas_' + pageNumber, className: 'e-pv-page-canvas' }) as HTMLCanvasElement;
        pageCanvas.width = pageWidth;
        pageCanvas.height = pageHeight;
        pageCanvas.style.display = displayMode;
        pageDiv.appendChild(pageCanvas);
        this.textLayer.addTextLayer(pageNumber, pageWidth, pageHeight, pageDiv);
        if (this.isTextMarkupAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.createAnnotationLayer(pageDiv, pageWidth, pageHeight, pageNumber, displayMode);
        }
        return pageCanvas;
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
        leftPosition = (width - this.getPageWidth(pageIndex)) / 2;
        // tslint:disable-next-line:max-line-length
        if (leftPosition < 0 || (this.pdfViewer.magnificationModule ? ((this.pdfViewer.magnificationModule.isAutoZoom && this.getZoomFactor() < 1) || this.pdfViewer.magnificationModule.fitType === 'fitToWidth') : false)) {
            leftPosition = this.pageLeft;
        }
        return leftPosition;
    }
    /**
     * @private
     */
    public applyLeftPosition(pageIndex: number): void {
        let leftPosition: number;
        if (this.pageSize[pageIndex]) {
            // tslint:disable-next-line:max-line-length
            leftPosition = (this.viewerContainer.getBoundingClientRect().width - this.pageSize[pageIndex].width * this.getZoomFactor()) / 2;
            // tslint:disable-next-line:max-line-length
            if (leftPosition < 0 || (this.pdfViewer.magnificationModule ? ((this.pdfViewer.magnificationModule.isAutoZoom && this.getZoomFactor() < 1) || this.pdfViewer.magnificationModule.fitType === 'fitToWidth') : false)) {
                leftPosition = this.pageLeft;
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
        if (event.touches && Browser.isDevice) {
            // tslint:disable-next-line
            let ratio: any = (this.viewerContainer.scrollHeight - this.viewerContainer.clientHeight) / (this.viewerContainer.clientHeight - this.toolbarHeight);
            if (this.isThumb) {
                this.ispageMoved = true;
                this.mobilePageNoContainer.style.display = 'block';
                scrollposX = event.touches[0].pageX - this.scrollX;
                scrollposY = event.touches[0].pageY - this.viewerContainer.offsetTop;
                this.viewerContainer.scrollTop = scrollposY * ratio;
                // tslint:disable-next-line
                let containerValue: any = event.touches[0].pageY;
                if (this.viewerContainer.scrollTop !== 0 && ((containerValue) <= this.viewerContainer.clientHeight)) {
                    this.mobileScrollerContainer.style.top = containerValue + 'px';
                }
            } else if (event.touches[0].target.className !== 'e-pv-touch-ellipse') {
                this.mobilePageNoContainer.style.display = 'none';
                scrollposY = this.touchClientY - event.touches[0].pageY;
                scrollposX = this.touchClientX - event.touches[0].pageX;
                this.viewerContainer.scrollTop = this.viewerContainer.scrollTop + (scrollposY);
                this.viewerContainer.scrollLeft = this.viewerContainer.scrollLeft + (scrollposX);
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
        this.contextMenuModule.contextMenuObj.close();
        let verticalScrollValue: number = this.viewerContainer.scrollTop;
        // tslint:disable-next-line:max-line-length
        for (let i: number = 0; i < this.pageCount; i++) {
            if (this.pageSize[i] != null) {
                let pageHeight: number = this.getPageHeight(i);
                // tslint:disable-next-line:max-line-length
                if ((verticalScrollValue + this.pageStopValue) <= (this.getPageTop(i) + pageHeight)) {
                    this.currentPageNumber = i + 1;
                    break;
                }
            }
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.magnificationModule && this.pdfViewer.magnificationModule.fitType === 'fitToPage' && this.currentPageNumber > 0) {
            this.viewerContainer.scrollTop = this.pageSize[this.currentPageNumber - 1].top * this.getZoomFactor();
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
            this.pdfViewer.toolbarModule.updateCurrentPage(this.currentPageNumber);
            this.viewerContainer.setAttribute('aria-labelledby', this.pdfViewer.element.id + '_pageDiv_' + (this.currentPageNumber - 1));
            if (!Browser.isDevice) {
                this.pdfViewer.toolbarModule.updateNavigationButtons();
            }
        }
        if (pageIndex !== this.currentPageNumber) {
            if (proxy.pdfViewer.thumbnailViewModule && !Browser.isDevice) {
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
            if (this.getRerenderCanvasCreated()) {
                this.pdfViewer.magnificationModule.clearIntervalTimer();
            }
            // tslint:disable-next-line
            let data: any = this.getStoredData(this.currentPageNumber);
            if (data) {
                this.initiatePageViewScrollChanged();
            } else {
                this.scrollHoldTimer = setTimeout(
                    () => { this.initiatePageViewScrollChanged(); }, 100);
            }
        }
        if (this.pdfViewer.annotation && this.navigationPane.commentPanelContainer) {
            this.pdfViewer.annotation.stickyNotesAnnotationModule.updateCommentPanelScrollTop(this.currentPageNumber);
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
        this.reRenderedCount = 0;
        let currentPageIndex: number = currentPageNumber - 1;
        if (currentPageNumber !== this.previousPage && currentPageNumber <= this.pageCount) {
            if (this.renderedPagesList.indexOf(currentPageIndex) === -1 && !this.getMagnified()) {
                this.createRequestForRender(currentPageIndex);
                this.renderCountIncrement();
            }
        }
        if (!(this.getMagnified() || this.getPagesPinchZoomed())) {
            let previous: number = currentPageIndex - 1;
            let canvas: HTMLCanvasElement = this.getElement('_pageCanvas_' + previous) as HTMLCanvasElement;
            if (canvas !== null) {
                if (this.renderedPagesList.indexOf(previous) === -1 && !this.getMagnified()) {
                    this.createRequestForRender(previous);
                    this.renderCountIncrement();
                }
            }
            let next: number = currentPageIndex + 1;
            if (next < this.pageCount) {
                if (this.renderedPagesList.indexOf(next) === -1 && !this.getMagnified()) {
                    this.createRequestForRender(next);
                    let pageHeight: number = this.getPageHeight(next);
                    this.renderCountIncrement();
                    let pageNumber: number = next + 1;
                    if (pageNumber < this.pageCount) {
                        this.createRequestForRender(pageNumber);
                        pageHeight = this.getPageHeight(pageNumber);
                        this.renderCountIncrement();
                        next = next + 1;
                    }
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

    private downloadDocument(blobUrl: string): void {
        blobUrl = URL.createObjectURL(blobUrl);
        let anchorElement: HTMLElement = createElement('a');
        if (anchorElement.click) {
            (anchorElement as HTMLAnchorElement).href = blobUrl;
            (anchorElement as HTMLAnchorElement).target = '_parent';
            if ('download' in anchorElement) {
                (anchorElement as HTMLAnchorElement).download = this.pdfViewer.fileName;
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

    private createRequestForDownload(): void {
        let proxy: PdfViewerBase = this;
        // tslint:disable-next-line
        let jsonObject: any = { hashId: proxy.hashId };
        if (this.jsonDocumentId) {
            // tslint:disable-next-line
            (jsonObject as any).document = this.jsonDocumentId;
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
        // tslint:disable-next-line
        jsonObject['action'] = 'Download';
        this.dowonloadRequestHandler = new AjaxHandler(this.pdfViewer);
        this.dowonloadRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.download;
        this.dowonloadRequestHandler.responseType = 'text';
        this.dowonloadRequestHandler.send(jsonObject);
        // tslint:disable-next-line
        this.dowonloadRequestHandler.onSuccess = function (result: any) {
            // tslint:disable-next-line
            let data: any = result.data;
            if (typeof data === 'object') {
                data = JSON.parse(data);
            }
            if (data) {
                let blobUrl: string = proxy.createBlobUrl(data.split('base64,')[1], 'application/pdf');
                if (Browser.isIE || Browser.info.name === 'edge') {
                    window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.fileName);
                } else {
                    proxy.downloadDocument(blobUrl);
                }
            }
        };
        // tslint:disable-next-line
        this.dowonloadRequestHandler.onFailure = function (result: any) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
        };
        // tslint:disable-next-line
        this.dowonloadRequestHandler.onError = function (result: any) {
            proxy.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
        };
    }

    private createRequestForRender(pageIndex: number): void {
        let proxy: PdfViewerBase = this;
        let canvas: HTMLElement = proxy.getElement('_pageCanvas_' + pageIndex);
        let oldCanvas: HTMLElement = proxy.getElement('_oldCanvas_' + pageIndex);
        if (canvas) {
            if (!isNaN(parseFloat(canvas.style.width)) || oldCanvas) {
                if (proxy.isInitialLoaded) {
                    proxy.showPageLoadingIndicator(pageIndex, false);
                }
            }
            // tslint:disable-next-line
            let data: any = proxy.getStoredData(pageIndex);
            if (data) {
                canvas.style.backgroundColor = '#fff';
                proxy.renderPage(data, pageIndex);
                data = null;
            } else {
                proxy.showPageLoadingIndicator(pageIndex, true);
                if (proxy.getPagesZoomed()) {
                    if (proxy.isInitialLoaded) {
                        proxy.showPageLoadingIndicator(pageIndex, false);
                    }
                }
                let noTileX: number = 1;
                let noTileY: number = 1;
                for (let x: number = 0; x < noTileX; x++) {
                    for (let y: number = 0; y < noTileY; y++) {
                        let jsonObject: object;
                        // tslint:disable-next-line:max-line-length
                        jsonObject = { xCoordinate: x, yCoordinate: y, pageNumber: pageIndex, documentId: proxy.documentId, hashId: proxy.hashId, zoomFactor: proxy.getZoomFactor(), action: 'RenderPdfPages' };
                        if (this.jsonDocumentId) {
                            // tslint:disable-next-line
                            (jsonObject as any).document = this.jsonDocumentId;
                        }
                        proxy.pageRequestHandler = new AjaxHandler(this.pdfViewer);
                        proxy.pageRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.renderPages;
                        proxy.pageRequestHandler.responseType = 'json';
                        proxy.pageRequestHandler.send(jsonObject);
                        // tslint:disable-next-line                      
                        proxy.pageRequestHandler.onSuccess = function (result: any) {
                            // tslint:disable-next-line
                            let data: any = result.data;
                            if (typeof data !== 'object') {
                                data = JSON.parse(data);
                            }
                            if (data) {
                                if (data.image) {
                                    let pageNumber: number = data.pageNumber ? data.pageNumber : pageIndex;
                                    proxy.storeWinData(data, pageNumber);
                                    proxy.renderPage(data, pageNumber);
                                }
                            }
                        };
                        // tslint:disable-next-line
                        this.pageRequestHandler.onFailure = function (result: any) {
                            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
                        };
                        // tslint:disable-next-line
                        this.pageRequestHandler.onError = function (result: any) {
                            proxy.openNotificationPopup();
                            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
                        };
                    }
                }
            }
            proxy.renderedPagesList.push(pageIndex);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public getStoredData(pageIndex: number): any {
        // tslint:disable-next-line
        let storedData: any = this.getWindowSessionStorage(pageIndex) ? this.getWindowSessionStorage(pageIndex) : this.getPinchZoomPage(pageIndex);
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
    public storeWinData(data: any, pageIndex: number): void {
        // tslint:disable-next-line
        let blobObj: string = this.createBlobUrl(data['image'].split('base64,')[1], 'image/png');
        let blobUrl: string = URL.createObjectURL(blobObj);
        // tslint:disable-next-line
        let storeObject: any = {
            // tslint:disable-next-line
            image: blobUrl, transformationMatrix: data['transformationMatrix'], hyperlinks: data['hyperlinks'], hyperlinkBounds: data['hyperlinkBounds'], linkAnnotation: data['linkAnnotation'], linkPage: data['linkPage'], annotationLocation: data['annotationLocation'],
            // tslint:disable-next-line
            textContent: data['textContent'], textBounds: data['textBounds'], pageText: data['pageText'], rotation: data['rotation']
        };
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.magnificationModule ? this.pdfViewer.magnificationModule.checkZoomFactor() : true) {
            this.manageSessionStorage(pageIndex, storeObject);
        } else {
            this.pinchZoomStorage.push({ index: pageIndex, pinchZoomStorage: storeObject });
        }
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

    private getWindowSessionStorage(pageIndex: number): string {
        return window.sessionStorage.getItem(this.documentId + '_' + pageIndex + '_' + this.getZoomFactor());
    }

    // tslint:disable-next-line
    private manageSessionStorage(pageIndex: number, storeObject: any): void {
        if (this.pageCount > this.sessionLimit && window.sessionStorage.length > this.sessionLimit) {
            let lowerPageValue: number = this.currentPageNumber - this.sessionLimit;
            if (lowerPageValue < 0) {
                lowerPageValue = 0;
            }
            let higherPageValue: number = this.currentPageNumber + this.sessionLimit;
            if (higherPageValue > this.pageCount) {
                higherPageValue = this.pageCount;
            }
            for (let i: number = 0; i <= this.pageCount; i++) {
                if (!((lowerPageValue <= i) && (i < higherPageValue))) {
                    window.sessionStorage.removeItem(this.documentId + '_' + i + '_' + this.getZoomFactor());
                }
            }
        }
        window.sessionStorage.setItem(this.documentId + '_' + pageIndex + '_' + this.getZoomFactor(), JSON.stringify(storeObject));
        this.sessionStorage.push(this.documentId + '_' + pageIndex + '_' + this.getZoomFactor());
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
        return this.pageSize[pageIndex].width * this.getZoomFactor();
    }
    /**
     * @private
     */
    public getPageHeight(pageIndex: number): number {
        return this.pageSize[pageIndex].height * this.getZoomFactor();
    }
    /**
     * @private
     */
    public getPageTop(pageIndex: number): number {
        return this.pageSize[pageIndex].top * this.getZoomFactor();
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
            let pageDiv: HTMLElement = this.getElement('_pageDiv_' + this.pdfViewer.annotation.getEventPageNumber(e));
            if (pageDiv) {
                let pageCurrentRect: ClientRect =
                    pageDiv.getBoundingClientRect();

                offsetX = touchArg.changedTouches[0].clientX - pageCurrentRect.left;
                offsetY = touchArg.changedTouches[0].clientY - pageCurrentRect.top;
            }
        } else {
            if ((event.target as HTMLElement).classList.contains('e-pv-text') ||
                (event.target as HTMLElement).classList.contains('e-pv-hyperlink')) {
                offsetX = (e as PointerEvent).offsetX + (e.target as HTMLElement).offsetLeft;
                offsetY = (e as PointerEvent).offsetY + (e.target as HTMLElement).offsetTop;
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
                        if (contains(position, conn.vertexPoints[i], 10)) {
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
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'StickyNotes') {
            isSticky = true;
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Stamp') {
            isStamp = true;
        }
        if (!isSticky) {
            if ((element.actualSize.width >= forty && element.actualSize.height >= forty) || isStamp) {
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
        return null;
    }

    /** @private */
    public diagramMouseMove(evt: MouseEvent | TouchEvent): void {
        this.currentPosition = this.getMousePosition(evt);
        this.activeElements.activePageID = this.pdfViewer.annotation.getEventPageNumber(evt);
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
                let eventTarget: HTMLElement = event.target as HTMLElement;

                this.action = this.findToolToActivate(obj, this.currentPosition);
                this.tool = this.getTool(this.action);
                this.setCursor(eventTarget, evt);
            } else {
                if (this.eventArgs && this.eventArgs.source) {
                    let eventTarget: HTMLElement = event.target as HTMLElement;
                    this.updateDefaultCursor(this.eventArgs.source, eventTarget, evt);
                } else {
                    this.setCursor(event.target as HTMLElement, evt);
                }
                this.diagramMouseActionHelper(evt as MouseEvent);

                if (this.tool) {
                    this.tool.mouseMove(this.eventArgs);
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
        this.activeElements.activePageID = this.pdfViewer.annotation.getEventPageNumber(evt);
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
                    this.pdfViewer.annotationModule.renderAnnotations(this.previousPage, null, null, null);
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
        if (this.tool instanceof ResizeTool) {
            if (this.tool.corner === 'ResizeNorthWest') {
                eventTarget.style.cursor = 'nw-resize';
            } else if (this.tool.corner === 'ResizeNorthEast') {
                eventTarget.style.cursor = 'ne-resize';

            } else if (this.tool.corner === 'ResizeSouthWest') {
                eventTarget.style.cursor = 'sw-resize';

            } else if (this.tool.corner === 'ResizeSouthEast') {
                eventTarget.style.cursor = 'se-resize';

            } else if (this.tool.corner === 'ResizeNorth') {
                eventTarget.style.cursor = 'n-resize';

            } else if (this.tool.corner === 'ResizeWest') {
                eventTarget.style.cursor = 'w-resize';

            } else if (this.tool.corner === 'ResizeEast') {
                eventTarget.style.cursor = 'e-resize';

            } else if (this.tool.corner === 'ResizeSouth') {
                eventTarget.style.cursor = 's-resize';

            }
        } else if (this.tool instanceof MoveTool) {
            eventTarget.style.cursor = 'move';
            // tslint:disable-next-line:max-line-length
        } else if (this.tool instanceof NodeDrawingTool || this.tool instanceof LineTool || this.tool instanceof PolygonDrawingTool) {
            eventTarget.style.cursor = 'crosshair';
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
                    } else {
                        eventTarget.style.cursor = 'grab';
                    }
                }
            } else {
                let obj: IElement = findActiveElement(event as MouseEvent, this, this.pdfViewer);
                if (obj && this.pdfViewer.selectedItems.annotations.length === 0 && event.type === 'mousemove') {
                    eventTarget.style.cursor = 'pointer';
                } else {
                    eventTarget.style.cursor = 'default';
                }
            }
        }
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
                // tslint:disable-next-line:max-line-length
                if ((this.tool instanceof NodeDrawingTool || this.tool instanceof LineTool || this.tool instanceof PolygonDrawingTool) && !this.tool.dragging) {
                    this.inAction = false;
                    this.isMouseDown = false;
                }
                let obj: IElement = findActiveElement(evt, this, this.pdfViewer);
                if (this.isShapeAnnotationModule() || this.isCalibrateAnnotationModule()) {
                    this.pdfViewer.annotation.onShapesMouseup(obj as PdfAnnotationBaseModel, evt);
                }
            }
        }
        if (!touches && evt.cancelable) { evt.preventDefault(); }
        this.eventArgs = {};
    }
    private isMetaKey(evt: MouseEvent | TouchEvent | WheelEvent | KeyboardEvent): boolean {
        return navigator.platform.match('Mac') ? evt.metaKey : evt.ctrlKey;
    }
    public diagramMouseDown(evt: MouseEvent | TouchEvent): void {
        let touches: TouchList;
        touches = (<TouchEvent & PointerEvent>evt).touches;
        this.isMouseDown = true;
        this.currentPosition = this.prevPosition = this.getMousePosition(evt);
        this.eventArgs = {};
        if (this.pdfViewer.tool === 'Stamp') {
            this.pdfViewer.tool = '';
        }
        let target: PdfAnnotationBaseModel;
        let obj: IElement = findActiveElement(evt, this, this.pdfViewer);
        if (this.pdfViewer.enableStampAnnotations) {
            let stampModule: StampAnnotation = this.pdfViewer.annotationModule.stampAnnotationModule;
            if (stampModule && stampModule.isNewStampAnnot) {
                let stampObj: PdfAnnotationBaseModel = obj as PdfAnnotationBaseModel;
                if (stampObj === undefined && this.pdfViewer.selectedItems.annotations[0]) {
                    stampObj = this.pdfViewer.selectedItems.annotations[0];
                }
                if (stampObj) {
                    this.isViewerMouseDown = false;
                    stampObj.opacity = this.pdfViewer.stampSettings.opacity;
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.nodePropertyChange(stampObj, { opacity: this.pdfViewer.stampSettings.opacity });
                    this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = false;
                    stampModule.updateDeleteItems(stampObj.pageIndex, stampObj, stampObj.opacity);
                    stampModule.resetAnnotation();
                    stampModule.isNewStampAnnot = false;
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
            this.action = this.findToolToActivate(obj, this.currentPosition);
            this.tool = this.getTool(this.action);
            if (!this.tool) {
                this.action = this.pdfViewer.tool || 'Select';
                this.tool = this.getTool(this.action);
            }
        }
        this.getMouseEventArgs(this.currentPosition, this.eventArgs, evt);
        this.eventArgs.position = this.currentPosition;
        this.tool.mouseDown(this.eventArgs);
        this.pdfViewer.annotation.onAnnotationMouseDown();
        this.initialEventArgs = { source: this.eventArgs.source, sourceWrapper: this.eventArgs.sourceWrapper };
        this.initialEventArgs.position = this.currentPosition;
        this.initialEventArgs.info = this.eventArgs.info;
    }
}
