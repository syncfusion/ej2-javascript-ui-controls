import { createElement } from '@syncfusion/ej2-base';
import { Dialog, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { PdfViewer, TextLayer, ContextMenu } from '../index';
import { NavigationPane } from './navigation-pane';
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
    public textLayer: TextLayer;
    private pdfViewer: PdfViewer;
    private isDocumentLoaded: boolean = false;
    /**
     * @private
     */
    public documentId: string;
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
    private toolbarHeight: number = 56;
    private pageLimit: number = 0;
    private previousPage: number = 0;
    private isViewerMouseDown: boolean = false;
    private isViewerMouseWheel: boolean = false;
    private scrollPosition: number = 0;
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
    private isPasswordAvailable: boolean = false;
    private document: string;
    private waitingPopup: HTMLElement;
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
    private printWaitingPopup: HTMLElement;
    private touchClientX: number = 0;
    private touchClientY: number = 0;
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
    private isPanMode: boolean = false;
    private dragX: number = 0;
    private dragY: number = 0;
    private isScrollbarMouseDown: boolean = false;

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
            let controlWidth: string = '100%';
            let toolbarDiv: HTMLElement;
            // tslint:disable-next-line:max-line-length
            this.viewerMainContainer = createElement('div', { id: this.pdfViewer.element.id + '_viewerMainContainer', className: 'e-pv-viewer-main-container' });
            // tslint:disable-next-line:max-line-length
            this.viewerContainer = createElement('div', { id: this.pdfViewer.element.id + '_viewerContainer', className: 'e-pv-viewer-container' });
            this.viewerContainer.tabIndex = 0;
            element.style.touchAction = 'pan-x pan-y';
            element.style.minHeight = '500px';
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
            let viewerWidth: number = (this.pdfViewer.element.clientWidth - (this.navigationPane.sideBarToolbar ? this.navigationPane.getViewerContainerLeft() : 0));
            this.viewerContainer.style.width = viewerWidth + 'px';
            this.viewerMainContainer.appendChild(this.viewerContainer);
            // tslint:disable-next-line:max-line-length
            this.pageContainer = createElement('div', { id: this.pdfViewer.element.id + '_pageViewContainer', className: 'e-pv-page-container' });
            this.viewerContainer.appendChild(this.pageContainer);
            this.pageContainer.style.width = this.viewerContainer.clientWidth + 'px';
            if (toolbarDiv && this.pdfViewer.thumbnailViewModule) {
                this.pdfViewer.thumbnailViewModule.createThumbnailContainer();
            }
           // this.createPasswordPopup();
            this.createPrintPopup();
            this.waitingPopup = createElement('div', { id: this.pdfViewer.element.id + '_loadingIndicator' });
            this.viewerContainer.appendChild(this.waitingPopup);
            createSpinner({ target: this.waitingPopup, cssClass: 'e-spin-center' });
            this.setLoaderProperties(this.waitingPopup);
            this.contextMenuModule = new ContextMenu(this.pdfViewer, this);
            this.contextMenuModule.createContextMenu();
            this.wireEvents();
            if (this.pdfViewer.textSearchModule) {
                this.pdfViewer.textSearchModule.createTextSearchBox();
            }
            if (this.pdfViewer.documentPath) {
            this.pdfViewer.load(this.pdfViewer.documentPath, null);
            }
        }
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
        documentData = this.checkDocumentData(documentData);
        this.setFileName();
        let jsonObject: object = this.constructJsonObject(documentData, password);
        this.createAjaxRequest(jsonObject, documentData, password);
    }

    private createAjaxRequest(jsonObject: object, documentData: string, password: string): void {
        let request: XMLHttpRequest = new XMLHttpRequest();
        request.open('POST', this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.load);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); // jshint ignore:line
        request.responseType = 'json';
        request.send(JSON.stringify(jsonObject)); // jshint ignore:line
        // tslint:disable-next-line
        request.onreadystatechange = (event: any): void => {
            if (request.readyState === 4 && request.status === 200) {
                // tslint:disable-next-line
                let data: any = event.currentTarget.response; // jshint ignore:line
                // tslint:disable-next-line:max-line-length
                if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Trident') !== -1 || typeof data !== 'object') {
                    data = JSON.parse(data);
                }
                this.requestSuccess(data, documentData, password);
            } else if (request.readyState === 4 && request.status === 400) { // jshint ignore:line
                // error
                this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
            }
        };
        // tslint:disable-next-line
        request.onerror = (event: any): void => {
            this.openNotificationPopup();
            this.showLoadingIndicator(false);
            this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText); // jshint ignore:line
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
        } else {
            this.pageCount = 0;
            this.currentPageNumber = 0;
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
        if (this.pdfViewer.thumbnailViewModule) {
            this.pdfViewer.thumbnailViewModule.createRequestForThumbnails();
        }
        if (this.pdfViewer.bookmarkViewModule) {
            this.pdfViewer.bookmarkViewModule.createRequestForBookmarks();
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
            if (this.pageSize[pageNumber]) {
                let pageTop: number = this.getPageTop(pageNumber);
                let viewerHeight: number = this.viewerContainer.clientHeight;
                while (viewerHeight > pageTop) {
                    if (this.pageSize[pageNumber]) {
                        this.renderPageElement(pageNumber);
                        this.createRequestForRender(pageNumber);
                        pageTop = this.getPageTop(pageNumber);
                        pageNumber = pageNumber + 1;
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
            if (this.pdfViewer.fileName === null) {
                // tslint:disable-next-line:max-line-length
                let documentStringArray: string[] = (documentData.indexOf('\\') !== -1) ? documentData.split('\\') : documentData.split('/');
                this.pdfViewer.fileName = documentStringArray[documentStringArray.length - 1];
                base64String = documentData;
            }
        }
        return base64String;
    }

    private setFileName(): void {
        if (this.pdfViewer.fileName === null) {
            if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.uploadedDocumentName !== null) {
                this.pdfViewer.fileName = this.pdfViewer.toolbarModule.uploadedDocumentName;
            } else {
                this.pdfViewer.fileName = 'undefined.pdf';
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
        this.waitingPopup = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageNumber);
        if (this.waitingPopup) {
        createSpinner({ target: this.waitingPopup });
        this.setLoaderProperties(this.waitingPopup);
        }
    }

    private showLoadingIndicator(isShow: boolean): void {
        this.waitingPopup = this.getElement('_loadingIndicator');
        if (this.waitingPopup != null) {
            if (isShow) {
                showSpinner(this.waitingPopup);
            } else {
                hideSpinner(this.waitingPopup);
            }
        }
    }

    private showPageLoadingIndicator(pageIndex: number, isShow: boolean): void {
        this.waitingPopup = this.getElement('_pageDiv_' + pageIndex);
        if (this.waitingPopup != null) {
            if (isShow) {
                showSpinner(this.waitingPopup);
            } else {
                hideSpinner(this.waitingPopup);
            }
            this.updateWaitingPopup(pageIndex);
        }
    }
    /**
     * @private
     */
    public showPrintLoadingIndicator(isShow: boolean): void {
        this.printWaitingPopup = this.getElement('_printLoadingIndicator');
        if (this.printWaitingPopup != null) {
            if (isShow) {
                this.printMainContainer.style.display = 'block';
                showSpinner(this.printWaitingPopup);
            } else {
                this.printMainContainer.style.display = 'none';
                hideSpinner(this.printWaitingPopup);
            }
        }
    }

    private setLoaderProperties(element: HTMLElement): void {
        let spinnerElement: HTMLElement = (element.firstChild.firstChild.firstChild as HTMLElement);
        spinnerElement.style.height = '48px';
        spinnerElement.style.width = '48px';
        spinnerElement.style.transformOrigin = '24px 24px 24px';
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
        this.initiateTextSelectMode();
        if (this.navigationPane.sideBarToolbar) {
        this.navigationPane.clear();
        }
        if (this.pdfViewer.enableToolbar && this.pdfViewer.thumbnailViewModule) {
            this.pdfViewer.thumbnailViewModule.clear();
        }
        if (this.pdfViewer.enableToolbar && this.pdfViewer.bookmarkViewModule) {
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
            this.unloadDocument(null);
        }
        window.sessionStorage.clear();
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
        this.unWireEvents();
        this.clear(false);
        this.pageContainer.parentNode.removeChild(this.pageContainer);
        this.viewerContainer.parentNode.removeChild(this.viewerContainer);
        if (this.pdfViewer.thumbnailViewModule) {
            this.pdfViewer.thumbnailViewModule.clear();
        }
        if (this.pdfViewer.bookmarkViewModule) {
            this.pdfViewer.bookmarkViewModule.clear();
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public unloadDocument(e: any): void {
        let documentId: string = window.sessionStorage.getItem('hashId');
        let documentLiveCount: string = window.sessionStorage.getItem('documentLiveCount');
        if (documentId !== null) {
            let jsonObject: object = { hashId: documentId, documentLiveCount: documentLiveCount };
            let request: XMLHttpRequest = new XMLHttpRequest();
            request.open('POST', window.sessionStorage.getItem('serviceURL') + '/' + window.sessionStorage.getItem('unload'), false);
            request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            request.send(JSON.stringify(jsonObject));
            // tslint:disable-next-line
            request.onreadystatechange = (event: any): void => {
                if (request.readyState === 4 && request.status === 400) {
                    // error message
                    this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
                }
            };
            // tslint:disable-next-line
            request.onerror = (event: any): void => {
                this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
            };
        }
        window.sessionStorage.removeItem('hashId');
        window.sessionStorage.removeItem('documentLiveCount');
    }
    /**
     * @private
     */
    public focusViewerContainer(): void {
        let scrollX: number = window.scrollX;
        let scrollY: number = window.scrollY;
        this.viewerContainer.focus();
        window.scrollTo(scrollX, scrollY);
    }

    private createCorruptedPopup(): void {
        // tslint:disable-next-line:max-line-length
        let popupElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_corrupted_popup', className: 'e-pv-corrupted-popup' });
        this.pageContainer.appendChild(popupElement);
        this.corruptPopup = new Dialog({
            showCloseIcon: true, closeOnEscape: true, isModal: true,
            // tslint:disable-next-line:max-line-length
            header: '<div class="e-pv-corrupted-popup-header"> ' + this.pdfViewer.localeObj.getConstant('File Corrupted') + '</div>', content: '<div id="template" class="e-pv-notification-icon"> <div class="e-pv-corrupted-popup-content">' + this.pdfViewer.localeObj.getConstant('File Corrupted Content') + '</div></div>', visible: false,
            // tslint:disable-next-line:max-line-length
            buttons: [{ buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.closeCorruptPopup.bind(this) }],
            target: this.pdfViewer.element, beforeClose: (): void => {
                this.corruptPopup.destroy();
                this.getElement('_corrupted_popup').remove();
                this.corruptPopup = null;
                this.waitingPopup = this.getElement('_loadingIndicator');
                if (this.waitingPopup != null) {
                    hideSpinner(this.waitingPopup);
                }
            }
        });
        this.corruptPopup.appendTo(popupElement);
    }

    private closeCorruptPopup(): void {
        this.corruptPopup.hide();
        this.waitingPopup = this.getElement('_loadingIndicator');
        if (this.waitingPopup !== null) {
            hideSpinner(this.waitingPopup);
        }
    }

    private createPrintPopup(): void {
        let element: HTMLElement = document.getElementById(this.pdfViewer.element.id);
        this.printMainContainer = createElement('div', { id: this.pdfViewer.element.id + '_printcontainer',
        className: 'e-pv-print-popup-container'});
        element.appendChild(this.printMainContainer);
        this.printMainContainer.style.display = 'none';
        this.printWaitingPopup = createElement('div', { id: this.pdfViewer.element.id + '_printLoadingIndicator',
        className: 'e-pv-print-loading-container'});
        this.printMainContainer.appendChild(this.printWaitingPopup);
        createSpinner({ target: this.printWaitingPopup, cssClass: 'e-spin-center' });
        this.setLoaderProperties(this.printWaitingPopup);
    }

    private createPasswordPopup(): void {
        // tslint:disable-next-line:max-line-length
        let popupElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_password_popup', className: 'e-pv-password-popup' });
        this.promptElement = createElement('span', { id: this.pdfViewer.element.id + '_prompt' });
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
            header: this.pdfViewer.localeObj.getConstant('Password Protected'), visible: false, buttons: [
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true },
                    click: this.applyPassword.bind(this)
                },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.passwordCancelClick.bind(this) }
            ], close: this.passwordCancel.bind(this), target: this.pdfViewer.element, beforeClose: (): void => {
                this.passwordPopup.destroy();
                this.getElement('_password_popup').remove();
                this.passwordPopup = null;
                this.waitingPopup = this.getElement('_loadingIndicator');
                if (this.waitingPopup != null) {
                    hideSpinner(this.waitingPopup);
                }
            }
        });
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
        this.waitingPopup = this.getElement('_loadingIndicator');
        if (this.waitingPopup !== null) {
            hideSpinner(this.waitingPopup);
        }
    }

    private passwordCancelClick(): void {
        this.clear(false);
        this.passwordDialogReset();
        this.passwordPopup.hide();
        this.waitingPopup = this.getElement('_loadingIndicator');
        if (this.waitingPopup !== null) {
            hideSpinner(this.waitingPopup);
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
        window.addEventListener('unload', this.unloadDocument);
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
        window.removeEventListener('unload', this.unloadDocument);
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
        // tslint:disable-next-line:max-line-length
        proxy.viewerContainer.style.left = (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) + 'px';
        // tslint:disable-next-line:max-line-length
        let viewerWidth: number = (proxy.pdfViewer.element.clientWidth - (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0));
        proxy.viewerContainer.style.width = viewerWidth + 'px';
        if (proxy.pdfViewer.toolbarModule) {
            // tslint:disable-next-line:max-line-length
            proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 56);
        } else {
            proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 0);
        }
        proxy.pageContainer.style.width = proxy.viewerContainer.clientWidth + 'px';
        if (proxy.pdfViewer.toolbarModule) {
            // tslint:disable-next-line:max-line-length
            proxy.pdfViewer.toolbarModule.onToolbarResize((proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerMainContainerWidth() : proxy.pdfViewer.element.clientWidth));
        }
        if (this.pdfViewer.enableToolbar && this.pdfViewer.thumbnailViewModule) {
            proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.currentPageNumber - 1);
        }
        if (proxy.pdfViewer.textSearchModule) {
            proxy.pdfViewer.textSearchModule.textSearchBoxOnResize();
        }
        proxy.updateZoomValue();
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
        if (event.button === 0) {
            this.isViewerMouseDown = true;
            if (event.detail === 1) {
                this.focusViewerContainer();
            }
            this.scrollPosition = this.viewerContainer.scrollTop / this.getZoomFactor();
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
            if (this.pdfViewer.textSelectionModule && !this.isClickedOnScrollBar(event) && !this.isTextSelectionDisabled) {
                event.preventDefault();
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
    }

    private viewerContainerOnMouseup = (event: MouseEvent): void => {
        if (this.isViewerMouseDown) {
            if (this.scrollHoldTimer) {
                clearTimeout(this.scrollHoldTimer);
                this.scrollHoldTimer = null;
            }
            if ((this.scrollPosition * this.getZoomFactor()) !== this.viewerContainer.scrollTop) {
                this.pageViewScrollChanged(this.currentPageNumber);
            }
        }
        if (event.button === 0) {
            // 0 is for left button.
            let eventTarget: HTMLElement = event.target as HTMLElement;
            if (eventTarget.classList.contains('e-pv-page-canvas')) {
                let idStringArray: string[] = eventTarget.id.split('_');
                // tslint:disable-next-line
                this.pdfViewer.firePageClick(event.offsetX, event.offsetY, parseInt(idStringArray[idStringArray.length - 1]) + 1);
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
                    break;
                case 70: // f key
                    if (this.pdfViewer.textSearchModule && this.pdfViewer.enableTextSearch) {
                        event.preventDefault();
                        this.pdfViewer.toolbarModule.textSearchButtonHandler();
                    }
                    break;
                default:
                    break;
            }
        }
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.magnifyBehaviorKeyDown(event);
        }
    }

    private viewerContainerOnMousemove = (event: MouseEvent): void => {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        if (this.isViewerMouseDown) {
            event.preventDefault();
            // tslint:disable-next-line:max-line-length
            if (this.pdfViewer.textSelectionModule && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled) {
                // text selection won't perform if we start the selection from hyperlink content by commenting this line.
                // this region block the toc/hyperlink navigation on sometimes.
                // if ((event.target as HTMLElement).classList.contains('e-pv-hyperlink') && this.pdfViewer.linkAnnotationModule) {
                // this.pdfViewer.linkAnnotationModule.modifyZindexForHyperlink((event.target as HTMLElement), true);
                // }
                this.pdfViewer.textSelectionModule.textSelectionOnMouseMove(event.target, this.mouseX, this.mouseY);
            }
        }
        if (this.isPanMode) {
            this.panOnMouseMove(event);
        }
    }

    private panOnMouseMove = (event: MouseEvent): void => {
        // tslint:disable-next-line:max-line-length
        if (this.viewerContainer.contains(event.target as HTMLElement) && ((event.target as HTMLElement) !== this.viewerContainer) && ((event.target as HTMLElement) !== this.pageContainer)) {
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
        if (this.isViewerMouseDown) {
            event.preventDefault();
        }
    }

    private viewerContainerOnClick = (event: MouseEvent): void => {
        if (event.type === 'dblclick') {
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                if ((event.target as HTMLElement).classList.contains('e-pv-text')) {
                    this.isViewerContainerDoubleClick = true;
                    this.pdfViewer.textSelectionModule.selectAWord(event.target, event.clientX, event.clientY, false);
                    this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(true, false);
                    this.dblClickTimer = setTimeout(
                        () => { this.applySelection(); }, 100);
                }
            }
        } else {
            if (event.detail === 3) {
                if (this.isViewerContainerDoubleClick) {
                    clearTimeout(this.dblClickTimer);
                    this.isViewerContainerDoubleClick = false;
                }
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
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
        event.preventDefault();
    }

    // tslint:disable-next-line
    private viewerContainerOnContextMenuClick = (event: any): void => {
        this.isViewerMouseDown = false;
    }

    private onWindowMouseUp = (event: MouseEvent): boolean => {
        if (event.button === 0) {
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                // tslint:disable-next-line:max-line-length
                if (event.detail === 1 && !this.viewerContainer.contains(event.target as HTMLElement) && !this.contextMenuModule.contextMenuElement.contains(event.target as HTMLElement)) {
                    if (window.getSelection().anchorNode !== null) {
                        this.pdfViewer.textSelectionModule.textSelectionOnMouseup();
                    }
                }
                if (this.viewerContainer.contains(event.target as HTMLElement)) {
                    if (!this.isClickedOnScrollBar(event) && !this.isScrollbarMouseDown) {
                        this.pdfViewer.textSelectionModule.textSelectionOnMouseup();
                    } else {
                        if (window.getSelection().anchorNode !== null) {
                            this.pdfViewer.textSelectionModule.applySpanForSelection();
                        }
                    }
                }
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
            event.preventDefault();
            event.stopPropagation();
            return false;
        } else {
            return true;
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
        if (touchPoints.length === 1) {
            this.preventTouchEvent(event);
        }
        this.touchClientX = touchPoints[0].clientX;
        this.touchClientY = touchPoints[0].clientY;
        // tslint:disable-next-line:max-line-length
        if (touchPoints.length === 1 && !((event.target as HTMLElement).classList.contains('e-pv-touch-select-drop') || (event.target as HTMLElement).classList.contains('e-pv-touch-ellipse'))) {
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
    }

    private viewerContainerOnLongTouch = (event: TouchEvent): void => {
        this.touchClientX = event.touches[0].clientX;
        this.touchClientY = event.touches[0].clientY;
        event.preventDefault();
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.initiateTouchSelection(event, this.touchClientX, this.touchClientY);
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
            if (!this.isPanMode && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }

    private viewerContainerOnTouchMove = (event: TouchEvent): void => {
        this.preventTouchEvent(event);
        let touchPoints: TouchList = event.touches;
        if (this.pdfViewer.magnificationModule) {
            if (touchPoints.length > 1 && this.pageCount > 0) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.magnificationModule.initiatePinchMove(touchPoints[0].clientX, touchPoints[0].clientY, touchPoints[1].clientX, touchPoints[1].clientY);
            } else if (touchPoints.length === 1 && this.getPagesPinchZoomed()) {
                this.pdfViewer.magnificationModule.pinchMoveScroll();
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
                if (this.pdfViewer.magnificationModule) {
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
        let jsonObject: object = { hashId: proxy.hashId, isCompletePageSizeNotReceived: true };
        let request: XMLHttpRequest = new XMLHttpRequest();
        request.open('POST', proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.load);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.responseType = 'json';
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        request.onreadystatechange = (event: any): void => { // jshint ignore:line
            if (request.readyState === 4 && request.status === 200) {
                // tslint:disable-next-line
                let data: any = event.currentTarget.response;
                if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Trident') !== -1 || typeof data !== 'object') {
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
                            topValue = this.pageGap + parseFloat(previousPageHeight) + topValue;
                        }
                        let size: ISize = { width: parseFloat(pageSize[0]), height: parseFloat(pageSize[1]), top: topValue };
                        this.pageSize.push(size);
                    }
                    // tslint:disable-next-line:max-line-length
                    this.pageContainer.style.height = this.getPageTop(this.pageSize.length - 1) + this.getPageHeight(this.pageSize.length - 1) + 'px';
                }
            } else if (request.readyState === 4 && request.status === 400) {
                // error
                this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText); // jshint ignore:line
            }
        };
        // tslint:disable-next-line
        request.onerror = (event: any): void => {
            this.openNotificationPopup();
            this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
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
                pageDiv.style.left = this.updateLeftPosition(pageIndex) + 'px';
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
                                canvas.height = pageHeight * 2;
                                canvas.width = pageWidth * 2;
                            }
                            // tslint:disable-next-line
                            context.setTransform(matrix.Elements[0], matrix.Elements[1], matrix.Elements[2], matrix.Elements[3], matrix.Elements[4], matrix.Elements[5]);
                            context.drawImage(image, 0, 0, canvas.width, canvas.height);
                            this.showPageLoadingIndicator(pageIndex, false);
                            if (pageIndex === 0 && this.getZoomFactor() === 1 && this.isDocumentLoaded) {
                                this.pdfViewer.fireDocumentLoad();
                                this.isDocumentLoaded = false;
                            }
                            if (this.pdfViewer.magnificationModule) {
                                this.pdfViewer.magnificationModule.rerenderCountIncrement();
                            }
                        }
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
                if (this.pdfViewer.enableHyperlink && this.pdfViewer.linkAnnotationModule) {
                    this.pdfViewer.linkAnnotationModule.renderHyperlinkContent(data, pageIndex);
                }
                this.renderTextContent(data, pageIndex);
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                    this.pdfViewer.textSelectionModule.applySelectionRangeOnScroll(pageIndex);
                }
                if (this.pdfViewer.textSearchModule) {
                    if (this.pdfViewer.textSearchModule.isTextSearch) {
                        this.pdfViewer.textSearchModule.highlightOtherOccurrences(pageIndex);
                    }
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
        let textLayer: HTMLElement = this.getElement('_textLayer_' + pageIndex);
        if (textLayer) {
            if (textLayer.childNodes.length === 0) {
                this.textLayer.renderTextContents(pageIndex, texts, bounds);
            } else {
                this.textLayer.resizeTextContents(pageIndex, texts, bounds);
            }
        }
    }

    private renderPageContainer(pageNumber: number, pageWidth: number, pageHeight: number, topValue: number): void {
        // tslint:disable-next-line:max-line-length
        let pageDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_pageDiv_' + pageNumber, className: 'e-pv-page-div' });
        pageDiv.style.width = pageWidth + 'px';
        pageDiv.style.height = pageHeight + 'px';
        pageDiv.style.left = this.updateLeftPosition(pageNumber) + 'px';
        pageDiv.style.top = topValue + 'px';
        this.pageContainer.appendChild(pageDiv);
        this.pageContainer.style.width = this.viewerContainer.clientWidth + 'px';
        this.createWaitingPopup(pageNumber);
        this.orderPageDivElements(pageDiv, pageNumber);
        this.renderPageCanvas(pageDiv, pageWidth, pageHeight, pageNumber);
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
    public renderPageCanvas(pageDiv: HTMLElement, pageWidth: number, pageHeight: number, pageNumber: number): HTMLElement {
        // tslint:disable-next-line:max-line-length
        let pageCanvas: HTMLCanvasElement = createElement('canvas', { id: this.pdfViewer.element.id + '_pageCanvas_' + pageNumber, className: 'e-pv-page-canvas' }) as HTMLCanvasElement;
        pageCanvas.width = pageWidth;
        pageCanvas.height = pageHeight;
        pageDiv.appendChild(pageCanvas);
        this.textLayer.addTextLayer(pageNumber, pageWidth, pageHeight, pageDiv);
        return pageCanvas;
    }
    /**
     * @private
     */
    public updateLeftPosition(pageIndex: number): number {
        let leftPosition: number;
        // tslint:disable-next-line:max-line-length
        leftPosition = (this.viewerContainer.getBoundingClientRect().width - this.getPageWidth(pageIndex)) / 2;
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
                pageDiv.style.left = leftPosition + 'px';
            }
        }
    }

    private updatePageHeight(viewerHeight: number, toolbarHeight: number): string {
        return ((viewerHeight - toolbarHeight) / viewerHeight) * 100 + '%';
    }

    private viewerContainerOnScroll = (): void => {
        let proxy: PdfViewerBase = this;
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
            this.pdfViewer.toolbarModule.updateNavigationButtons();
        }
        if (pageIndex !== this.currentPageNumber) {
            if (proxy.pdfViewer.thumbnailViewModule) {
                if (!proxy.pdfViewer.thumbnailViewModule.isThumbnailClicked) {
                    proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.currentPageNumber - 1);
                }
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
            this.scrollHoldTimer = setTimeout(
                () => { this.initiatePageViewScrollChanged(); }, 100);
        }
    }

    private initiatePageViewScrollChanged(): void {
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
                    while (this.viewerContainer.clientHeight > pageHeight ) {
                        next = next + 1;
                        if (next < this.pageCount) {
                            this.renderPageElement(next);
                            this.createRequestForRender(next);
                            pageHeight += this.getPageHeight(next);
                            this.renderCountIncrement();
                        }
                    }
                }
            }
        }
    }

    private downloadDocument(blobUrl: string): void {
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
        let jsonObject: object;
        jsonObject = { hashId: this.hashId };
        let request: XMLHttpRequest = new XMLHttpRequest();
        request.open('POST', this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.download);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); // jshint ignore:line
        request.responseType = 'text';
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        request.onreadystatechange = (event: any): void => {
            if (request.readyState === 4 && request.status === 200) { // jshint ignore:line
                // tslint:disable-next-line
                let data: any = event.currentTarget.response;
                // tslint:disable-next-line:max-line-length
                if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Trident') !== -1) {
                    data = JSON.parse(data);
                }
                if (data) {
                    let blobUrl: string = this.createBlobUrl(data.split('base64,')[1], 'application/pdf');
                    this.downloadDocument(blobUrl);
                }
            } else if (request.readyState === 4 && request.status === 400) {
                // error
                this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
            }
        };
        // tslint:disable-next-line
        request.onerror = (event: any): void => { // jshint ignore:line
            this.openNotificationPopup();
            this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
        };
    }

    private createRequestForRender(pageIndex: number): void {
        let canvas: HTMLElement = this.getElement('_pageCanvas_' + pageIndex);
        let oldCanvas: HTMLElement = this.getElement('_oldCanvas_' + pageIndex);
        if (!this.getPagesZoomed()) {
            this.showPageLoadingIndicator(pageIndex, true);
        } else {
            this.showPageLoadingIndicator(pageIndex, false);
        }
        if (canvas) {
            if (!isNaN(parseFloat(canvas.style.width)) || oldCanvas) {
                this.showPageLoadingIndicator(pageIndex, false);
            }
            // tslint:disable-next-line
            let data: any = this.getStoredData(pageIndex);
            if (data) {
                this.renderPage(data, pageIndex);
            } else {
                let noTileX: number = 1;
                let noTileY: number = 1;
                for (let x: number = 0; x < noTileX; x++) {
                    for (let y: number = 0; y < noTileY; y++) {
                        let jsonObject: object;
                        // tslint:disable-next-line:max-line-length
                        jsonObject = { xCoordinate: x, yCoordinate: y, pageNumber: pageIndex, documentId: this.documentId, hashId: this.hashId, zoomFactor: this.getZoomFactor() };
                        let request: XMLHttpRequest = new XMLHttpRequest();
                        request.open('POST', this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderPages);
                        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                        request.responseType = 'json';
                        request.send(JSON.stringify(jsonObject));
                        // tslint:disable-next-line
                        request.onreadystatechange = (event: any): void => { // jshint ignore:line
                            let proxy: PdfViewerBase = this;
                            if (request.readyState === 4 && request.status === 200) {
                                // tslint:disable-next-line
                                let data: any = event.currentTarget.response;
                                // tslint:disable-next-line:max-line-length
                                if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Trident') !== -1 || typeof data !== 'object') {
                                    data = JSON.parse(data);
                                }
                                if (data) {
                                    if (data.image) {
                                        proxy.storeWinData(data, pageIndex);
                                        proxy.renderPage(data, pageIndex);
                                    }
                                }
                            } else if (request.readyState === 4 && request.status === 400) {
                                // error
                                this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
                            }
                        };
                        // tslint:disable-next-line
                        request.onerror = (event: any): void => {
                            this.openNotificationPopup();
                            this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
                        };
                    }
                }
            }
            this.renderedPagesList.push(pageIndex);
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
        let blobUrl: string = this.createBlobUrl(data['image'].split('base64,')[1], 'image/png');
        // tslint:disable-next-line
        let storeObject: any = {
            // tslint:disable-next-line
            image: blobUrl, transformationMatrix: data['transformationMatrix'], hyperlinks: data['hyperlinks'], hyperlinkBounds: data['hyperlinkBounds'], linkAnnotation: data['linkAnnotation'], linkPage: data['linkPage'], annotationLocation: data['annotationLocation'],
            // tslint:disable-next-line
            textContent: data['textContent'], textBounds: data['textBounds'], pageText: data['pageText']
        };
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.magnificationModule ? this.pdfViewer.magnificationModule.checkZoomFactor() : true) {
            this.manageSessionStorage(pageIndex, storeObject);
        } else {
            this.pinchZoomStorage.push({ index: pageIndex, pinchZoomStorage: storeObject });
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
        let blob: Blob = new Blob(byteArrays, { type: contentType });
        return URL.createObjectURL(blob);
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

    private isClickedOnScrollBar(event: MouseEvent): boolean {
        let isScrollBar: boolean = false;
        this.setScrollDownValue(event.type, false);
        // tslint:disable-next-line:max-line-length
        if ((this.viewerContainer.clientWidth + this.viewerContainer.offsetLeft) < event.clientX && event.clientX < (this.viewerContainer.offsetWidth + this.viewerContainer.offsetLeft)) {
            isScrollBar = true;
            this.setScrollDownValue(event.type, true);
        }
        // tslint:disable-next-line:max-line-length
        if ((this.viewerContainer.clientHeight + this.viewerContainer.offsetTop) < event.clientY && event.clientY < (this.viewerContainer.offsetHeight + this.viewerContainer.offsetTop)) {
            isScrollBar = true;
            this.setScrollDownValue(event.type, true);
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
}
