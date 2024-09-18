import { PdfViewer, PdfViewerBase, AjaxHandler } from '../index';
import { createElement, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';

/**
 * The `ThumbnailView` module is used to handle thumbnail view navigation of PDF viewer.
 *
 * @param {Event} event - args
 * @returns {void}
 */
export class ThumbnailView {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private previousElement: HTMLElement;
    private thumbnailSelectionRing: HTMLElement;
    private thumbnailImage: HTMLImageElement;
    private startIndex: number;
    private thumbnailLimit: number = 30;
    private thumbnailThreshold: number = 5;
    private thumbnailRequestsBatch: number = 5;
    private thumbnailTopMargin: number = 10;
    private thumbnailTop: number = 8;
    private isRendered: boolean = false;
    private list: any[] = [];
    /**
     * @private
     */
    public thumbnailPageSize: any[] = [];
    private thumbnailRequestHandler: AjaxHandler;
    /**
     * @private
     */
    public isThubmnailOpen: boolean = false;
    /**
     * @private
     */
    public isThumbnailClicked: boolean = false;
    /**
     * @private
     */
    public thumbnailView: HTMLElement;

    /**
     * @param {PdfViewer} pdfViewer - It describes about the pdfviewer
     * @param {PdfViewerBase} pdfViewerBase - It describes about the pdfviewer base
     * @private
     * @returns {void}
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * @private
     * @returns {void}
     */
    public createThumbnailContainer(): void {
        this.thumbnailView = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_view', className: 'e-pv-thumbnail-view e-pv-thumbnail-row' });
        this.pdfViewerBase.navigationPane.sideBarContent.appendChild(this.thumbnailView);
        this.pdfViewerBase.navigationPane.sideBarContent.addEventListener('scrollend', this.thumbnailOnScroll);
    }

    private thumbnailOnScroll = (event: any): void => {
        for (let i: number = 0; i < this.thumbnailPageSize.length; i++){
            const scrollPosition: number = this.pdfViewerBase.navigationPane.sideBarContent.scrollTop;
            const index: number = this.thumbnailPageSize.findIndex((page: any) => page.top >= scrollPosition);
            if (index !== -1) {
                const number: number = Math.floor((index) / this.thumbnailRequestsBatch) * this.thumbnailRequestsBatch;
                this.updateScrollTopForThumbnail(number);
                break;
            }
        }
    };

    /**
     * Open the thumbnail pane of the PdfViewer.
     *
     * @returns {void}
     */
    public openThumbnailPane(): void {
        if (this.pdfViewerBase.navigationPane) {
            this.pdfViewerBase.navigationPane.openThumbnailPane();
        }
    }

    /**
     * Close the thumbnail pane of the PdfViewer.
     *
     * @returns {void}
     */
    public closeThumbnailPane(): void {
        if (this.pdfViewerBase.navigationPane) {
            this.pdfViewerBase.navigationPane.closeThumbnailPane();
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public createRequestForThumbnails(): void {
        // eslint-disable-next-line
        const proxy: ThumbnailView = this;
        proxy.thumbnailLimit = 0;
        for (let i: number = 0; i < proxy.pdfViewer.pageCount; i++) {
            proxy.renderThumbnailEmptyPage(i);
        }
        if (proxy.pdfViewer.isThumbnailViewOpen) {
            this.isThubmnailOpen = true;
            proxy.pdfViewerBase.navigationPane.sideBarTitle.textContent = proxy.pdfViewer.localeObj.getConstant('Page Thumbnails');
            document.getElementById(proxy.pdfViewer.element.id + '_thumbnail_view').style.display = 'flex';
            const bookmarkContent: any = proxy.pdfViewer.element.querySelector('.e-pv-bookmark-view');
            if (bookmarkContent) {
                bookmarkContent.style.display = 'none';
            }
            proxy.pdfViewerBase.navigationPane.updateViewerContainerOnExpand();
            this.isThubmnailOpen = false;
            proxy.pdfViewerBase.navigationPane.isBookmarkOpen = false;
        }
        this.createRequestForThumbnailImages();
    }

    private isThumbnailViewOpen(): void {
        // eslint-disable-next-line
        const proxy: ThumbnailView = this;
        if (proxy.pdfViewer.isThumbnailViewOpen) {
            proxy.pdfViewerBase.navigationPane.setThumbnailSelectionIconTheme();
            proxy.pdfViewerBase.navigationPane.isThumbnailOpen = true;
            this.pdfViewerBase.navigationPane.sideBarContentContainer.style.display = 'block';
            if (this.pdfViewer.enableRtl) {
                proxy.pdfViewerBase.viewerContainer.style.right = this.pdfViewerBase.navigationPane.getViewerContainerLeft() + 'px';
            }
            else {
                proxy.pdfViewerBase.viewerContainer.style.left = this.pdfViewerBase.navigationPane.getViewerContainerLeft() + 'px';
            }
            proxy.pdfViewerBase.viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft() - this.pdfViewerBase.navigationPane.getViewerContainerRight()) + 'px';
            proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
            proxy.pdfViewerBase.updateZoomValue();
        }
    }

    /**
     * Checks if thumbnails have been requested for the given page number.
     *
     * @param {number} pageNumber The page number to check.
     * @returns {boolean} True if thumbnails have been requested, otherwise false.
     */
    private thumbnailsRequestedForPage(pageNumber: number): boolean {
        for (const requestedPage of this.list) {
            if (pageNumber === requestedPage) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param {number} pageNumber - Specify the pageNumber.
     * @returns {void}
     * @private
     */
    public updateScrollTopForThumbnail(pageNumber: number): void {
        const step: number = this.thumbnailRequestsBatch;
        const number: number = Math.floor((pageNumber + 1) / step) * step;
        const lastNum: number = this.pdfViewer.thumbnailViewModule.thumbnailLimit;
        const numbers: any = [number, number - step, number + step, lastNum];
        numbers.forEach((num: number) => {
            if (num < 0) {
                return;
            }
            if (!this.thumbnailsRequestedForPage(num)) {
                this.renderThumbnailImage(null, num);
            }
        });
    }

    /**
     * @param {number} pageIndex - It describes about the page index
     * @private
     * @returns {void}
     */
    private renderThumbnailEmptyPage(pageIndex: number): void {
        if (this.thumbnailView) {
            const pageLink: HTMLAnchorElement = createElement('a', { id: 'page_' + pageIndex, attrs: { 'aria-label': 'Thumbnail of Page' + (pageIndex + 1), 'tabindex': '-1', 'role': 'link' }, className: 'e-pv-thumbnail-anchor-node' }) as HTMLAnchorElement;
            const thumbnail: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_' + pageIndex, className: 'e-pv-thumbnail e-pv-thumbnail-column' });
            this.thumbnailSelectionRing = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageIndex, className: 'e-pv-thumbnail-selection-ring' });
            thumbnail.appendChild(this.thumbnailSelectionRing);
            const thumbnailPageNumber: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_pagenumber_' + pageIndex, className: 'e-pv-thumbnail-number' });
            thumbnailPageNumber.textContent = (pageIndex + 1).toString();
            thumbnail.appendChild(thumbnailPageNumber);
            let height: number = 180;
            this.thumbnailImage = createElement('img', { id: this.pdfViewer.element.id + '_thumbnail_image_' + pageIndex, className: 'e-pv-thumbnail-image' }) as HTMLImageElement;
            if (this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)] &&
            (this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].height <
            this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].width)) {
                this.thumbnailImage.style.height = '86px';
                this.thumbnailImage.style.width = '126px';
                thumbnail.style.height = '100px';
                thumbnail.style.width = '140px';
                thumbnailPageNumber.style.left = '18px';
                pageLink.style.marginRight = '41px';
                thumbnail.style.marginLeft = '-5px';
                thumbnail.style.marginRight = '0px';
                height = 140;
            }
            if (pageIndex !== 0) {
                this.thumbnailTop = this.thumbnailPageSize[pageIndex - 1].top + this.thumbnailPageSize[pageIndex - 1].height;
                const thumbnailSize: any = {height: height, top:  this.thumbnailTop};
                this.thumbnailPageSize[parseInt(pageIndex.toString(), 10)] =  thumbnailSize;
            }
            else {
                const thumbnailSize: any = {height: height, top:  this.thumbnailTop};
                this.thumbnailPageSize[parseInt(pageIndex.toString(), 10)] =  thumbnailSize;
            }
            this.thumbnailSelectionRing.appendChild(this.thumbnailImage);
            pageLink.appendChild(thumbnail);
            this.thumbnailView.appendChild(pageLink);
            this.wireUpEvents();
            if (pageIndex === 0) {
                this.setMouseFocusToFirstPage();
            }
            this.pdfViewerBase.navigationPane.enableThumbnailButton();
        }
    }

    /**
     * @param {ThumbnailView} prox - It describes about the prox
     * @private
     * @returns {void}
     */
    public renderViewPortThumbnailImage(prox?: ThumbnailView): void {
        const proxy: ThumbnailView = prox ? prox : this;
        // Removed the condition to skip multiple request for thumbnail image.
        proxy.startIndex = proxy.thumbnailLimit;
        this.list.push(proxy.startIndex);
        if (this.pdfViewerBase.pageSize.length === this.pdfViewerBase.pageCount && !this.isRendered) {
            this.renderDiv();
        }
        proxy.thumbnailLimit = proxy.startIndex + proxy.thumbnailThreshold < proxy.pdfViewer.pageCount ?
            proxy.startIndex + proxy.thumbnailThreshold : proxy.pdfViewer.pageCount;
        if (!this.pdfViewerBase.clientSideRendering) {
            let digitalSignaturePresent: boolean = false;
            for (let i: number = proxy.startIndex; i < proxy.thumbnailLimit; i++) {
                if (proxy.pdfViewerBase.digitalSignaturePresent(i)) {
                    digitalSignaturePresent = true;
                }
            }
            let digitalSignatureList: string = '';
            if (digitalSignaturePresent) {
                digitalSignatureList = proxy.pdfViewerBase.digitalSignaturePages.toString();
            }
            const jsonObject: object = { startPage: proxy.startIndex.toString(), endPage: proxy.thumbnailLimit.toString(), sizeX: '99.7', sizeY: '141', hashId: proxy.pdfViewerBase.hashId, action: 'RenderThumbnailImages', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId, digitalSignaturePresent: digitalSignaturePresent, digitalSignaturePageList: digitalSignatureList };
            if (this.pdfViewerBase.jsonDocumentId) {
                (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
            }
            this.thumbnailRequestHandler = new AjaxHandler(this.pdfViewer);
            this.thumbnailRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.renderThumbnail;
            this.thumbnailRequestHandler.responseType = 'json';
            if ((proxy.startIndex.toString() !== proxy.thumbnailLimit.toString()) && proxy.thumbnailLimit > 0 &&
            !isNullOrUndefined(proxy.pdfViewerBase.hashId)) {
                this.pdfViewerBase.requestCollection.push(this.thumbnailRequestHandler);
                this.thumbnailRequestHandler.send(jsonObject);
            }
            this.thumbnailRequestHandler.onSuccess = function (result: any): void {
                const data: any = result.data;
                const redirect: boolean = (proxy as any).pdfViewerBase.checkRedirection(data);
                if (!redirect) {
                    proxy.updateThumbnailCollection(data);
                }
            };
            this.thumbnailRequestHandler.onFailure = function (result: any): void {
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText,
                                                      proxy.pdfViewer.serverActionSettings.renderThumbnail);
            };
            this.thumbnailRequestHandler.onError = function (result: any): void {
                proxy.pdfViewerBase.openNotificationPopup();
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText,
                                                      proxy.pdfViewer.serverActionSettings.renderThumbnail);
            };
        } else {
            for (let count: number = proxy.startIndex; count < proxy.thumbnailLimit; count++) {
                const currentPageImage: HTMLImageElement = this.getThumbnailImageElement(count);
                if ((currentPageImage && currentPageImage.src === '') || (isNullOrUndefined(currentPageImage) && !isNullOrUndefined(this.pdfViewer.pageOrganizer))) {
                    this.pdfViewerBase.pdfViewerRunner.postMessage({
                        pageIndex: count,
                        message: 'renderThumbnail'
                    });
                }
            }
            this.isThumbnailViewOpen();
        }
    }

    /**
     * @param {any} event - It describes about the event
     * @private
     * @returns {void}
     */
    public thumbnailOnMessage(event: any): void {
        if (event.data.message === 'renderThumbnail') {
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            const { value, width, height, pageIndex } = event.data;
            canvas.width = width;
            canvas.height = height;
            const canvasContext: CanvasRenderingContext2D = canvas.getContext('2d');
            const imageData: ImageData = canvasContext.createImageData(width, height);
            imageData.data.set(value);
            canvasContext.putImageData(imageData, 0, 0);
            const imageUrl: string = canvas.toDataURL();
            this.pdfViewerBase.releaseCanvas(canvas);
            const currentPageImage: HTMLImageElement = this.getThumbnailImageElement(pageIndex);
            if (currentPageImage){
                currentPageImage.src = imageUrl;
            }
            if (this.pdfViewer.pageOrganizerModule) {
                const data: any = ({
                    thumbnailImage: imageUrl,
                    startPage: this.startIndex,
                    endPage: this.thumbnailLimit,
                    uniqueId: this.pdfViewerBase.documentId,
                    pageIndex: pageIndex
                });
                if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                    this.updateThumbnailCollection(data);
                }
                else {
                    if (!isNullOrUndefined(this.pdfViewer.pageOrganizer)) {
                        this.pdfViewer.pageOrganizer.updatePreviewCollection(data);
                    }
                }
            }
        }
    }

    /**
     * @param {any} data - It describes about the data
     * @private
     * @returns {void}
     */
    public updateThumbnailCollection(data: any): void {
        if (data) {
            // eslint-disable-next-line
            const proxy: ThumbnailView = this;
            if (typeof data !== 'object') {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    proxy.pdfViewerBase.onControlError(500, data, proxy.pdfViewer.serverActionSettings.renderThumbnail);
                    data = null;
                }
            }
            if (data && data.uniqueId === proxy.pdfViewerBase.documentId) {
                proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.renderThumbnail, data);
                proxy.renderThumbnailImage(data);
            }
        }
    }

    private renderDiv(data?: any): void {
        if ((this.pdfViewerBase.pageSize.length === this.pdfViewerBase.pageCount || !isNullOrUndefined(data)) && !this.isRendered) {
            for (let i: number = 100; i < this.pdfViewer.pageCount; i++) {
                const thumbnail: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_thumbnail_' + i);
                const pageLink: HTMLAnchorElement = document.getElementById('page_' + i) as HTMLAnchorElement;
                const thumbnailPageNumber: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_thumbnail_pagenumber_' + i);
                const currentPageImage: HTMLImageElement = this.getThumbnailImageElement(i);
                let height: number = 180;
                if ((this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)] &&
                (this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].height <
                this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].width)) ||
                (data && (data.pageRotation[parseInt(i.toString(), 10)] === 1 ||
                data.pageRotation[parseInt(i.toString(), 10)] === 3))) {
                    currentPageImage.style.height = '86px';
                    currentPageImage.style.width = '126px';
                    thumbnail.style.height = '100px';
                    thumbnail.style.width = '140px';
                    thumbnailPageNumber.style.left = '18px';
                    pageLink.style.marginRight = '41px';
                    thumbnail.style.marginLeft = '-5px';
                    thumbnail.style.marginRight = '0px';
                    height = 140;
                }
                if (this.thumbnailPageSize.length > 0) {
                    this.thumbnailTop = this.thumbnailPageSize[i - 1].top + this.thumbnailPageSize[i - 1].height;
                    const thumbnailSize: any = { height: height, top: this.thumbnailTop };
                    this.thumbnailPageSize[parseInt(i.toString(), 10)] = thumbnailSize;
                }
            }
            this.isRendered = true;
        }
    }

    /**
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {void}
     */
    public gotoThumbnailImage(pageNumber: number): void {
        const shouldScroll: boolean = this.checkThumbnailScroll(pageNumber);
        if (this.thumbnailView) {
            const thumbnailChild: HTMLAnchorElement = this.thumbnailView.children[parseInt(pageNumber.toString(), 10)] as HTMLAnchorElement;
            if (thumbnailChild) {
                const thumbnailDiv: HTMLElement = thumbnailChild.children[0] as HTMLElement;
                let offsetTop: number;
                if (shouldScroll) {
                    if (this.pdfViewerBase.pageSize.length === this.pdfViewerBase.pageCount && !this.isRendered) {
                        this.renderDiv();
                    }
                    if (thumbnailDiv.offsetTop <= 0) {
                        offsetTop = thumbnailDiv.parentElement.offsetTop + thumbnailDiv.clientTop - this.thumbnailTopMargin;
                    }
                    else{
                        offsetTop = thumbnailDiv.offsetTop + thumbnailDiv.clientTop - this.thumbnailTopMargin;
                    }
                    this.pdfViewerBase.navigationPane.sideBarContent.scrollTop = offsetTop;
                }
                if (!this.isThumbnailClicked) {
                    if (this.previousElement) {
                        this.previousElement.classList.remove('e-pv-thumbnail-selection');
                        this.previousElement.classList.remove('e-pv-thumbnail-focus');
                        this.previousElement.classList.remove('e-pv-thumbnail-hover');
                        this.previousElement.classList.add('e-pv-thumbnail-selection-ring');
                    }
                    this.setFocusStyle(thumbnailDiv, pageNumber);
                }
                this.previousElement = thumbnailDiv.children[0] as HTMLElement;
            }
        }
    }

    /**
     * Determines if there is a need to request thumbnails based on the current page number.
     *
     * @param {number} currentPageNumber The current page number.
     * @returns {number} The page number to request thumbnails for.
     */
    private determineThumbnailsRequest(currentPageNumber: number): number {
        const pageCount: number = this.pdfViewer.pageCount;
        const batchSize: number = this.thumbnailRequestsBatch; // Assuming thumbnails are requested in batches of 50
        const numberOfBatches: number = Math.ceil(pageCount / batchSize);
        if (this.list.length === numberOfBatches) {
            return pageCount;
        }
        for (let i: number = 0; i < this.list.length; i++) {
            if (currentPageNumber === this.list[parseInt(i.toString(), 10)]) {
                currentPageNumber += batchSize;
                i = -1; // Resetting i to -1 to start from the beginning of the list again
            }
        }
        return currentPageNumber !== undefined && currentPageNumber < pageCount ? currentPageNumber : pageCount;
    }

    private checkThumbnailScroll(pageNumber: number): boolean {
        let shouldScroll: boolean = false;
        if (this.thumbnailView) {
            const visibleThumbs: IVisibleThumbnail = this.getVisibleThumbs();
            const numVisibleThumbs: number = visibleThumbs.views.length;
            // if the thumbnail isn't currently visible, scroll it into view.
            if (numVisibleThumbs > 0) {
                const visibleFirstPageID: number = this.getPageNumberFromID(visibleThumbs.first.id);
                // account for only one thumbnail being visible.
                const visibleLastPageID: number = (numVisibleThumbs > 1 ?
                    this.getPageNumberFromID(visibleThumbs.last.id) : visibleFirstPageID);
                if (pageNumber <= visibleFirstPageID || pageNumber >= visibleLastPageID) {
                    shouldScroll = true;
                } else {
                    visibleThumbs.views.some((view: any) => {
                        const pageID: string[] = view.id.split('_');
                        const thumbPageNumber: string = pageID[pageID.length - 1];
                        if (parseInt(thumbPageNumber, 10) !== pageNumber) {
                            return false;
                        }
                        shouldScroll = view.percent < 100 && (view.view.offsetWidth > view.view.offsetHeight && view.percent < 97);
                        return true;
                    });
                }
            }
        }
        return shouldScroll;
    }

    private getPageNumberFromID(pageId: string): number {
        const pageID: string[] = pageId.split('_');
        const pageNumber: string = pageID[pageID.length - 1];
        return parseInt(pageNumber, 10);
    }

    private setFocusStyle(thumbnail: HTMLElement, pageNumber: number): void {
        if (thumbnail.children[0].id === this.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageNumber) {
            this.setMouseFocusStyle(thumbnail.children[0] as HTMLElement);
        }
    }

    private renderThumbnailImage(data: any, pageNumber?: number): void {
        if (this.thumbnailView && data) {
            if (this.pdfViewerBase.clientSideRendering) {
                this.renderClientThumbnailImage(data);
            } else {
                this.renderServerThumbnailImage(data);
            }
        }
        if (!isNullOrUndefined(data) && !isNullOrUndefined(this.pdfViewer.pageOrganizer)){
            this.pdfViewer.pageOrganizer.getData(data, this.pdfViewerBase.clientSideRendering);
        }
        this.thumbnailLimit = this.determineThumbnailsRequest(!isNullOrUndefined(pageNumber) ? pageNumber : this.thumbnailLimit);
        if (this.thumbnailLimit !== this.pdfViewerBase.pageCount && (this.thumbnailView ||
             !isNullOrUndefined(this.pdfViewer.pageOrganizer))) {
            const isIE: boolean = !!(document as any).documentMode;
            if (!isIE) {
                Promise.all([this.createRequestForThumbnailImages()]);
            } else {
                this.createRequestForThumbnailImages();
            }
        }
    }

    private createRequestForThumbnailImages(): Promise<any> {
        // eslint-disable-next-line
        const proxy: ThumbnailView = this;
        const isIE: boolean = !!(document as any).documentMode;
        if (!isIE) {
            return new Promise<any>(
                function (renderThumbnailImage: any, reject: any): any {
                    proxy.renderViewPortThumbnailImage(proxy);
                });
        } else {
            this.renderViewPortThumbnailImage(proxy);
            return null;
        }
    }

    private renderServerThumbnailImage(data: any): void {
        const startPage: number = !isNullOrUndefined(data && (data.startPage)) ? data.startPage : this.startIndex;
        const endPage: number = !isNullOrUndefined(data && (data.endPage)) ? data.endPage : this.thumbnailLimit;
        for (let i: number = startPage; i < endPage; i++) {
            this.thumbnailImageRender(i, data);
        }
        this.isThumbnailViewOpen();
    }

    private renderClientThumbnailImage(data: any): void {
        const pageIndex: number = data.pageIndex;
        this.thumbnailImageRender(pageIndex, data);
    }

    private thumbnailImageRender(pageIndex: number, data: any): void {
        if (!isNullOrUndefined(data.pageRotation) && Object.keys(data.pageRotation).length > 0 && !this.isRendered) {
            this.renderDiv(data);
        }
        const thumbnail: HTMLElement =  document.getElementById(this.pdfViewer.element.id + '_thumbnail_' + pageIndex);
        const pageLink: HTMLAnchorElement = document.getElementById('page_'  + pageIndex) as HTMLAnchorElement;
        const thumbnailPageNumber: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_thumbnail_pagenumber_' + pageIndex);
        const currentPageImage: HTMLImageElement = this.getThumbnailImageElement(pageIndex);
        if (!isNullOrUndefined(thumbnail) && !isNullOrUndefined(currentPageImage)) {
            currentPageImage.src = this.pdfViewerBase.clientSideRendering || typeof data.thumbnailImage === 'string' || data.thumbnailImage instanceof String ? data.thumbnailImage : data.thumbnailImage[parseInt(pageIndex.toString(), 10)];
            currentPageImage.alt = this.pdfViewer.element.id + '_thumbnail_page_' + pageIndex;
            pageLink.setAttribute('aria-label', `Thumbnail of Page ${pageIndex + 1}`);
            if (this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)] &&
            (this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].height <
            this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].width)) {
                currentPageImage.style.height = '86px';
                currentPageImage.style.width = '126px';
                thumbnail.style.height = '100px';
                thumbnail.style.width = '140px';
                // pageLink.style.left = '-25px';
                thumbnailPageNumber.style.left = '18px';
                pageLink.style.marginRight = '41px';
                thumbnail.style.marginLeft = '-5px';
                thumbnail.style.marginRight = '0px';
            }
            if (pageIndex === 0) {
                this.pdfViewerBase.navigationPane.enableThumbnailButton();
                this.isThumbnailViewOpen();
            }
        }
    }

    private wireUpEvents(): void {
        if (this.thumbnailSelectionRing) {
            this.thumbnailSelectionRing.addEventListener('click', this.thumbnailClick);
            this.thumbnailImage.addEventListener('keydown', this.thumbnailKeydown);
            this.thumbnailSelectionRing.addEventListener('mouseover', this.thumbnailMouseOver);
            this.thumbnailSelectionRing.addEventListener('mouseleave', this.thumbnailMouseLeave);
        }
    }

    private unwireUpEvents(): void {
        if (this.thumbnailSelectionRing && this.thumbnailImage) {
            this.thumbnailSelectionRing.removeEventListener('click', this.thumbnailClick);
            this.thumbnailImage.removeEventListener('keydown', this.thumbnailKeydown);
            this.thumbnailSelectionRing.removeEventListener('mouseover', this.thumbnailMouseOver);
            this.thumbnailSelectionRing.removeEventListener('mouseleave', this.thumbnailMouseLeave);
        }
    }

    /**
     * @param {MouseEvent} event - It describes about the event
     * @param {boolean} isKeyboard - It describes about the isKeyboard value
     * @private
     * @returns {void}
     */
    public thumbnailClick = (event: MouseEvent, isKeyboard?: boolean): void => {
        // eslint-disable-next-line
        const proxy: ThumbnailView = this;
        const target: HTMLElement = event.target as HTMLElement;
        const pageNumber: number = proxy.getPageNumberFromID(target.id);
        if (proxy.previousElement) {
            proxy.previousElement.classList.remove('e-pv-thumbnail-selection');
            proxy.previousElement.classList.remove('e-pv-thumbnail-focus');
            proxy.previousElement.classList.add('e-pv-thumbnail-selection-ring');
        }
        if (target.parentElement.id === proxy.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageNumber) {
            proxy.setSelectionStyle(target.parentElement);
            proxy.previousElement = target.parentElement;
        } else if (target.id === proxy.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageNumber) {
            proxy.setSelectionStyle(target as HTMLElement);
            proxy.previousElement = target as HTMLElement;
        }
        proxy.pdfViewer.fireThumbnailClick(pageNumber + 1);
        proxy.isThumbnailClicked = true;
        proxy.goToThumbnailPage(pageNumber + 1);
        if (!isKeyboard){
            proxy.pdfViewerBase.focusViewerContainer();
        }
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            const currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber, 10);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
    };

    /**
     * @param {KeyboardEvent} event - It describes about the event
     * @private
     * @returns {void}
     */
    private thumbnailKeydown = (event: KeyboardEvent): void => {
        if (event && event.key === 'Enter' || event.key === ' ') {
            this.thumbnailClick(event as any, true);
            event.preventDefault();
            event.stopPropagation();
        }
    };

    private goToThumbnailPage(pageNumber: number): void {
        if (pageNumber > 0 && pageNumber <= this.pdfViewerBase.pageCount && this.pdfViewerBase.currentPageNumber !== pageNumber) {
            this.pdfViewerBase.updateScrollTop(pageNumber - 1);
        } else {
            this.isThumbnailClicked = false;
        }
    }

    private setSelectionStyle(thumbnailElement: HTMLElement): void {
        thumbnailElement.classList.remove('e-pv-thumbnail-selection-ring');
        thumbnailElement.classList.remove('e-pv-thumbnail-hover');
        thumbnailElement.classList.remove('e-pv-thumbnail-focus');
        thumbnailElement.classList.add('e-pv-thumbnail-selection');
    }

    /**
     * @param {MouseEvent} event - It describes about the event
     * @private
     * @returns {void}
     */
    public thumbnailMouseOver = (event: MouseEvent): void => {
        // eslint-disable-next-line
        const proxy: ThumbnailView = this;
        const target: HTMLElement = event.target as HTMLElement;
        const pageNumber: number = proxy.getPageNumberFromID(target.id);
        if (target.id === proxy.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageNumber) {
            proxy.setMouseOverStyle(target as HTMLElement);
        } else if (target.id === proxy.pdfViewer.element.id + '_thumbnail_image_' + pageNumber) {
            proxy.setMouseOverStyle(target.parentElement);
        }
    };

    private setMouseOverStyle(thumbnailElement: HTMLElement): void {
        if (!thumbnailElement.classList.contains('e-pv-thumbnail-selection')) {
            thumbnailElement.classList.remove('e-pv-thumbnail-selection-ring');
            if (!thumbnailElement.classList.contains('e-pv-thumbnail-focus')) {
                thumbnailElement.classList.add('e-pv-thumbnail-hover');
            }
        }
    }

    /**
     * @param {MouseEvent} event - It describes about the event
     * @private
     * @returns {void}
     */
    public thumbnailMouseLeave = (event: MouseEvent): void => {
        // eslint-disable-next-line
        const proxy: ThumbnailView = this;
        const target: HTMLElement = event.target as HTMLElement;
        const pageNumber: number = proxy.getPageNumberFromID(target.id);
        if (target.parentElement.id === proxy.pdfViewer.element.id + '_thumbnail_view') {
            proxy.setMouseLeaveStyle(target.children[0].children[0] as HTMLElement);
        } else if (target.parentElement.id === proxy.pdfViewer.element.id + '_thumbnail_' + pageNumber) {
            proxy.setMouseLeaveStyle(target.parentElement.children[0] as HTMLElement);
        }
    };

    private setMouseLeaveStyle(thumbnailElement: HTMLElement): void {
        if (!thumbnailElement.classList.contains('e-pv-thumbnail-selection')) {
            if (!thumbnailElement.classList.contains('e-pv-thumbnail-focus')) {
                thumbnailElement.classList.add('e-pv-thumbnail-selection-ring');
            }
            thumbnailElement.classList.remove('e-pv-thumbnail-hover');
        } else {
            if (!thumbnailElement.classList.contains('e-pv-thumbnail-selection')) {
                thumbnailElement.classList.remove('e-pv-thumbnail-selection');
                thumbnailElement.classList.add('e-pv-thumbnail-focus');
            }
        }
    }

    private setMouseFocusStyle(thumbnailElement: HTMLElement): void {
        thumbnailElement.classList.remove('e-pv-thumbnail-selection');
        thumbnailElement.classList.remove('e-pv-thumbnail-hover');
        thumbnailElement.classList.add('e-pv-thumbnail-focus');
    }

    private setMouseFocusToFirstPage(): void {
        const thumbnailChild: HTMLAnchorElement = this.thumbnailView.children[0] as HTMLAnchorElement;
        if (thumbnailChild) {
            const thumbnailDiv: HTMLElement = thumbnailChild.children[0].children[0] as HTMLElement;
            this.setMouseFocusStyle(thumbnailDiv);
            this.previousElement = thumbnailDiv;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public clear(): void {
        this.startIndex = 0;
        this.thumbnailLimit = 0;
        this.list = [];
        this.thumbnailPageSize = [];
        this.thumbnailTop = 0;
        this.isRendered = false;
        if (this.pdfViewerBase.navigationPane) {
            if (this.pdfViewerBase.navigationPane.sideBarContentContainer) {
                this.pdfViewerBase.navigationPane.sideBarContentContainer.style.display = 'block';
                this.pdfViewerBase.navigationPane.sideBarContent.scrollTop = 0;
                this.pdfViewerBase.navigationPane.sideBarContentContainer.style.display = 'none';
            }
        }
        if (this.thumbnailView) {
            while (this.thumbnailView.hasChildNodes()) {
                this.thumbnailView.removeChild(this.thumbnailView.lastChild);
            }
        }
        if (this.pdfViewerBase.navigationPane) {
            this.pdfViewerBase.navigationPane.resetThumbnailView();
        }
        if (this.thumbnailRequestHandler) {
            this.thumbnailRequestHandler.clear();
        }
        this.unwireUpEvents();
    }

    private getVisibleThumbs(): IVisibleThumbnail {
        return this.getVisibleElements(this.pdfViewerBase.navigationPane.sideBarContent, this.thumbnailView.children);
    }

    private getVisibleElements(scrollElement: HTMLElement, thumbnailViewChildren: HTMLCollection): IVisibleThumbnail {
        const top: number = scrollElement.scrollTop;
        const bottom: number = top + scrollElement.clientHeight;
        const left: number = scrollElement.scrollLeft;
        const right: number = left + scrollElement.clientWidth;
        /**
         * @param {HTMLElement} thumbnailViewChildrenElement - It describes about the thumbnail view children element
         * @returns {boolean} - boolean
         */
        function isThumbnailElementBottomAfterViewTop(thumbnailViewChildrenElement: HTMLElement): boolean {
            const elementBottom: number =
                thumbnailViewChildrenElement.offsetTop + thumbnailViewChildrenElement.clientTop + thumbnailViewChildrenElement.clientHeight;
            return elementBottom > top;
        }
        const visible: Array<IVisibleThumbnailElement> = [];
        let thumbnailView: HTMLElement;
        let element: HTMLElement;
        let currentHeight: number;
        let viewHeight: number;
        let viewBottom: number;
        let hiddenHeight: number;
        let currentWidth: number;
        let viewWidth: number;
        let viewRight: number;
        let hiddenWidth: number;
        let percentVisible: number;
        let firstVisibleElementInd: number = thumbnailViewChildren.length === 0 ? 0 :
            this.binarySearchFirstItem(thumbnailViewChildren, isThumbnailElementBottomAfterViewTop);
        if (thumbnailViewChildren.length > 0) {
            firstVisibleElementInd =
                this.backtrackBeforeAllVisibleElements(firstVisibleElementInd, thumbnailViewChildren, top);
        }
        let lastEdge: number = -1;
        for (let i: number = firstVisibleElementInd, ii: number = thumbnailViewChildren.length; i < ii; i++) {
            thumbnailView = this.getThumbnailElement(i);
            element = thumbnailView;
            currentWidth = element.offsetLeft + element.clientLeft;
            currentHeight = element.offsetTop + element.clientTop;
            viewWidth = element.clientWidth;
            viewHeight = element.clientHeight;
            viewRight = currentWidth + viewWidth;
            viewBottom = currentHeight + viewHeight;
            if (lastEdge === -1) {
                if (viewBottom >= bottom) {
                    lastEdge = viewBottom;
                }
            } else if (currentHeight > lastEdge) {
                break;
            }
            if (viewBottom <= top || currentHeight >= bottom ||
                viewRight <= left || currentWidth >= right) {
                continue;
            }
            hiddenHeight = Math.max(0, top - currentHeight) +
                Math.max(0, viewBottom - bottom);
            hiddenWidth = Math.max(0, left - currentWidth) +
                Math.max(0, viewRight - right);
            percentVisible = ((viewHeight - hiddenHeight) * (viewWidth - hiddenWidth) * 100 / viewHeight / viewWidth) | 0;
            visible.push({
                id: thumbnailView.id,
                x: currentWidth,
                y: currentHeight,
                view: thumbnailView,
                percent: percentVisible
            });
        }
        const first: IVisibleThumbnailElement = visible[0];
        const last: IVisibleThumbnailElement = visible[visible.length - 1];
        return { first: first, last: last, views: visible };
    }

    private binarySearchFirstItem(items: HTMLCollection, condition: any): number {
        let minIndex: number = 0;
        let maxIndex: number = items.length - 1;
        if (items.length === 0 || !condition(this.getThumbnailElement(maxIndex))) {
            return items.length - 1;
        }
        if (condition(this.getThumbnailElement(minIndex))) {
            return minIndex;
        }
        while (minIndex < maxIndex) {
            const currentIndex: number = (minIndex + maxIndex) >> 1;
            if (condition(this.getThumbnailElement(currentIndex))) {
                maxIndex = currentIndex;
            } else {
                minIndex = currentIndex + 1;
            }
        }
        return minIndex; /* === maxIndex */
    }

    private backtrackBeforeAllVisibleElements(index: number, views: HTMLCollection, top: number): number {
        if (index < 2) {
            return index;
        }
        let thumbnailElement: HTMLElement = this.getThumbnailElement(index);
        let pageTop: number = thumbnailElement.offsetTop + thumbnailElement.clientTop;
        if (pageTop >= top) {
            thumbnailElement = this.getThumbnailElement(index - 1);
            pageTop = thumbnailElement.offsetTop + thumbnailElement.clientTop;
        }
        for (let i: number = index - 2; i >= 0; --i) {
            thumbnailElement = this.getThumbnailElement(i);
            if (thumbnailElement.offsetTop + thumbnailElement.clientTop + thumbnailElement.clientHeight <= pageTop) {
                break;
            }
            index = i;
        }
        return index;
    }

    /**
     * @param {number} index - It describes about the index value
     * @private
     * @returns {HTMLElement} - html element
     */
    private getThumbnailElement(index: number): HTMLElement {
        const thumbnailChild: HTMLAnchorElement = this.thumbnailView.children[parseInt(index.toString(), 10)] as HTMLAnchorElement;
        return thumbnailChild.children[0] as HTMLElement;
    }

    /**
     * @param {number} index - It describes about the index value
     * @private
     * @returns {HTMLElement} - html element
     */
    private getThumbnailLinkElement(index: number): HTMLElement {
        const thumbnailChild: HTMLAnchorElement = this.thumbnailView.children[parseInt(index.toString(), 10)] as HTMLAnchorElement;
        return thumbnailChild;
    }

    /**
     * @param {number} index - It describes about the index value
     * @private
     * @returns {HTMLImageElement} - html image element
     */
    private getThumbnailImageElement(index: number): HTMLImageElement {
        if (isNullOrUndefined(this.thumbnailView)){
            return null;
        }
        const thumbnailChild: HTMLAnchorElement = this.thumbnailView.children[parseInt(index.toString(), 10)] as HTMLAnchorElement;
        if (thumbnailChild)
        {return thumbnailChild.children[0].children[0].children[0] as HTMLImageElement; }
        else
        {return null; }
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.clear();
    }

    /**
     * @private
     * @returns {string} - string
     */
    public getModuleName(): string {
        return 'ThumbnailView';
    }
}

/**
 * The `IVisibleThumbnailElement` module is used to handle visible thumbnail element collection of PDF viewer.
 *
 * @hidden
 */
export interface IVisibleThumbnailElement {
    id: string
    x: number
    y: number
    view: HTMLElement
    percent: number
}

/**
 * The `IVisibleThumbnail` module is used to handle visible thumbnail collection of PDF viewer.
 *
 * @hidden
 */
export interface IVisibleThumbnail {
    first: IVisibleThumbnailElement
    last: IVisibleThumbnailElement

    views: Array<IVisibleThumbnailElement>;
}
