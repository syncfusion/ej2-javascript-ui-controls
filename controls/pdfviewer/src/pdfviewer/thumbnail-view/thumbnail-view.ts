/* eslint-disable */
import { PdfViewer, PdfViewerBase, AjaxHandler } from '../index';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * The `ThumbnailView` module is used to handle thumbnail view navigation of PDF viewer.
 */
export class ThumbnailView {

    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private previousElement: HTMLElement;
    private thumbnailSelectionRing: HTMLElement;
    private thumbnailImage: HTMLImageElement;
    private startIndex: number;
    private thumbnailLimit: number = 30;
    private thumbnailThreshold: number = 50;
    private thumbnailTopMargin: number = 10;
    private thumbnailRequestHandler: AjaxHandler;
    /**
     * @private
     */
    public isThumbnailClicked: boolean = false;
    /**
     * @private
     */
    public thumbnailView: HTMLElement;

    /**
     * @param pdfViewer
     * @param pdfViewerBase
     * @param pdfViewer
     * @param pdfViewerBase
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * @private
     */
    public createThumbnailContainer(): void {
        // eslint-disable-next-line max-len
        this.thumbnailView = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_view', className: 'e-pv-thumbnail-view e-pv-thumbnail-row' });
        this.pdfViewerBase.navigationPane.sideBarContent.appendChild(this.thumbnailView);
    }

    /**
     * Open the thumbnail pane of the PdfViewer.
     *
     * @returns void
     */
    public openThumbnailPane(): void {
        if (this.pdfViewerBase.navigationPane) {
            this.pdfViewerBase.navigationPane.openThumbnailPane();
        }
    }

    /**
     * @private
     */
    // eslint-disable-next-line
    public createRequestForThumbnails(): Promise<any> {
        const proxy: ThumbnailView = this;
        // eslint-disable-next-line
        let isIE: boolean = !!(document as any).documentMode;
        if (!isIE) {
        // eslint-disable-next-line
        return new Promise<any>(
            // eslint-disable-next-line
            function (renderThumbnailImage: any, reject: any): any {
                    proxy.requestCreation(proxy);
                });
        } else {
            this.requestCreation(proxy);
            return null;
        }
    }

    private requestCreation(proxy: ThumbnailView): void {
        // Removed the condition to skip multiple request for thumbnail image.
        proxy.startIndex = proxy.thumbnailLimit;
        // eslint-disable-next-line max-len
        proxy.thumbnailLimit = proxy.startIndex + proxy.thumbnailThreshold < proxy.pdfViewer.pageCount ? proxy.startIndex + proxy.thumbnailThreshold : proxy.pdfViewer.pageCount;
        let digitalSignaturePresent: boolean = false;
        for (var i= proxy.startIndex; i < proxy.thumbnailLimit; i++)
        {
           if (proxy.pdfViewerBase.digitalSignaturePresent(i))
           {
              digitalSignaturePresent = true;
           }
        }
        let digitalSignatureList: string = "";
        if (digitalSignaturePresent)
        {
            digitalSignatureList = proxy.pdfViewerBase.digitalSignaturePages.toString();
        }
        // eslint-disable-next-line max-len
        const jsonObject: object = { startPage: proxy.startIndex.toString(), endPage: proxy.thumbnailLimit.toString(), sizeX: "99.7", sizeY: "141", hashId: proxy.pdfViewerBase.hashId, action: 'RenderThumbnailImages', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId, digitalSignaturePresent: digitalSignaturePresent, digitalSignaturePageList: digitalSignatureList };
        if (this.pdfViewerBase.jsonDocumentId) {
            // eslint-disable-next-line
            (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
        }
        if (!this.pdfViewerBase.clientSideRendering) {
            this.thumbnailRequestHandler = new AjaxHandler(this.pdfViewer);
            this.thumbnailRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.renderThumbnail;
            this.thumbnailRequestHandler.responseType = 'json';
            if(proxy.thumbnailLimit > 0 && !isNullOrUndefined(proxy.pdfViewerBase.hashId)){
                this.thumbnailRequestHandler.send(jsonObject);
            }
            // eslint-disable-next-line
            this.thumbnailRequestHandler.onSuccess = function (result: any) {
                // eslint-disable-next-line
                let data: any = result.data;
                let redirect: boolean = (proxy as any).pdfViewerBase.checkRedirection(data);
                if (!redirect) {
                    proxy.updateThumbnailCollection(data)
                }
            };
            // eslint-disable-next-line
            this.thumbnailRequestHandler.onFailure = function (result: any) {
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.renderThumbnail);
            };
            // eslint-disable-next-line
            this.thumbnailRequestHandler.onError = function (result: any) {
                proxy.pdfViewerBase.openNotificationPopup();
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.renderThumbnail);
            };
        } else {
            for (let pageIndex = proxy.startIndex; pageIndex < proxy.thumbnailLimit; pageIndex++) {
                this.pdfViewerBase.pdfViewerRunner.postMessage({
                    pageIndex: pageIndex,
                    message: 'renderThumbnail'
                });
            }
        }
    }

    /**
     * @private
     */
    public thumbnailOnMessage(event: any): void {
        if (event.data.message === 'renderThumbnail') {
            let canvas: HTMLCanvasElement = document.createElement('canvas');
            let { value, width, height, pageIndex } = event.data;
            canvas.width = width;
            canvas.height = height;
            const canvasContext = canvas.getContext('2d');
            const imageData = canvasContext.createImageData(width, height);
            imageData.data.set(value);
            canvasContext.putImageData(imageData, 0, 0);
            let imageUrl: string = canvas.toDataURL();
            let data = ({
                thumbnailImage: imageUrl,
                startPage: this.startIndex,
                endPage: this.thumbnailLimit,
                uniqueId: this.pdfViewerBase.documentId,
                pageIndex: pageIndex
            });
            this.updateThumbnailCollection(data)
        }
    }

    /**
   * @param jsonData
   * @private
   */
    // eslint-disable-next-line
    public updateThumbnailCollection(data: any): void {
        if (data) {
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
                if (proxy.pdfViewer.isThumbnailViewOpen) {
                    proxy.pdfViewerBase.navigationPane.isThumbnailOpen = true;
                    // eslint-disable-next-line max-len
                    proxy.pdfViewerBase.navigationPane.sideBarTitle.textContent = proxy.pdfViewer.localeObj.getConstant('Page Thumbnails');
                    document.getElementById(proxy.pdfViewer.element.id + '_thumbnail_view').style.display = 'flex';
                    let bookmarkContent: HTMLElement = proxy.pdfViewer.element.querySelector('.e-pv-bookmark-view');
                    if (bookmarkContent) {
                        bookmarkContent.style.display = 'none';
                    }
                    proxy.pdfViewerBase.navigationPane.setThumbnailSelectionIconTheme();
                    proxy.pdfViewerBase.navigationPane.updateViewerContainerOnExpand();
                    proxy.pdfViewerBase.navigationPane.isBookmarkOpen = false;
                }
            }
        }
    }

    /**
     * @param pageNumber
     * @private
     */
    public gotoThumbnailImage(pageNumber: number): void {
        const shouldScroll: boolean = this.checkThumbnailScroll(pageNumber);
        if (this.thumbnailView) {
            const thumbnailChild: HTMLAnchorElement = this.thumbnailView.children[pageNumber] as HTMLAnchorElement;
            if (thumbnailChild) {
                const thumbnailDiv: HTMLElement = thumbnailChild.children[0] as HTMLElement;
                var offsetTop: number;
                if(thumbnailDiv.offsetTop <= 0){
                    offsetTop = thumbnailDiv.parentElement.offsetTop + thumbnailDiv.clientTop - this.thumbnailTopMargin;
                }
                else{
                    offsetTop = thumbnailDiv.offsetTop + thumbnailDiv.clientTop - this.thumbnailTopMargin;
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

    private checkThumbnailScroll(pageNumber: number): boolean {
        let shouldScroll: boolean = false;
        if (this.thumbnailView) {
            const visibleThumbs: IVisibleThumbnail = this.getVisibleThumbs();
            const numVisibleThumbs: number = visibleThumbs.views.length;
            // if the thumbnail isn't currently visible, scroll it into view.
            if (numVisibleThumbs > 0) {
                const visibleFirstPageID: number = this.getPageNumberFromID(visibleThumbs.first.id);
                // account for only one thumbnail being visible.
                // eslint-disable-next-line max-len
                const visibleLastPageID: number = (numVisibleThumbs > 1 ? this.getPageNumberFromID(visibleThumbs.last.id) : visibleFirstPageID);
                if (pageNumber <= visibleFirstPageID || pageNumber >= visibleLastPageID) {
                    shouldScroll = true;
                } else {
                    // eslint-disable-next-line
                    visibleThumbs.views.some(view => {
                        const pageID: string[] = view.id.split('_');
                        const thumbPageNumber: string = pageID[pageID.length - 1];
                        // eslint-disable-next-line radix
                        if (parseInt(thumbPageNumber) !== pageNumber) {
                            return false;
                        }
                        shouldScroll = view.percent < 100;
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
        // eslint-disable-next-line radix
        return parseInt(pageNumber);
    }
    private setFocusStyle(thumbnail: HTMLElement, pageNumber: number): void {
        if (thumbnail.children[0].id === this.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageNumber) {
            this.setMouseFocusStyle(thumbnail.children[0] as HTMLElement);
        }
    }

    // eslint-disable-next-line
    private renderThumbnailImage(data: any): void {
        if (this.thumbnailView) {
            this.pdfViewerBase.clientSideRendering ? this.renderClientThumbnailImage(data) : this.renderServerThumbnailImage(data);
        }
        this.pdfViewerBase.navigationPane.enableThumbnailButton();
        if (this.thumbnailLimit !== this.pdfViewerBase.pageCount && this.thumbnailView) {
            // eslint-disable-next-line
            let isIE: boolean = !!(document as any).documentMode;
            if (!isIE) {
                Promise.all([this.createRequestForThumbnails()]);
            } else {
                this.createRequestForThumbnails();
            }
        }
    }

    // eslint-disable-next-line
    private renderServerThumbnailImage(data: any) {
        const startPage: number = (data && isNaN(data.startPage)) ? data.startPage : this.startIndex;
        const endPage: number = (data && isNaN(data.endPage)) ? data.endPage : this.thumbnailLimit;
        for (let i: number = startPage; i < endPage; i++) {
            this.thumbnailImageRender(i, data);
        }
    }

    // eslint-disable-next-line
    private renderClientThumbnailImage(data: any) {
        const pageIndex: number = data.pageIndex;
        this.thumbnailImageRender(pageIndex, data);
    }

    // eslint-disable-next-line
    private thumbnailImageRender(pageIndex: number, data: any) {
        // eslint-disable-next-line max-len
        const pageLink: HTMLAnchorElement = createElement('a', { id: 'page_' + pageIndex, attrs: { 'aria-label': 'Thumbnail of Page' + (pageIndex + 1), 'tabindex': '-1', 'role': 'link' }, className: 'e-pv-thumbnail-anchor-node' }) as HTMLAnchorElement;
        // eslint-disable-next-line max-len
        const thumbnail: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_' + pageIndex, className: 'e-pv-thumbnail e-pv-thumbnail-column' });
        // eslint-disable-next-line max-len
        this.thumbnailSelectionRing = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageIndex, className: 'e-pv-thumbnail-selection-ring' });
        thumbnail.appendChild(this.thumbnailSelectionRing);
        // eslint-disable-next-line max-len
        const thumbnailPageNumber: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_pagenumber_' + pageIndex, className: 'e-pv-thumbnail-number' });
        thumbnailPageNumber.textContent = (pageIndex + 1).toString();
        thumbnail.appendChild(thumbnailPageNumber);
        // eslint-disable-next-line max-len
        this.thumbnailImage = createElement('img', { id: this.pdfViewer.element.id + '_thumbnail_image_' + pageIndex, className: 'e-pv-thumbnail-image' }) as HTMLImageElement;
        // eslint-disable-next-line max-len
        this.thumbnailImage.src = this.pdfViewerBase.clientSideRendering || typeof data.thumbnailImage === 'string' || data.thumbnailImage instanceof String ? data.thumbnailImage : data.thumbnailImage[pageIndex];
        this.thumbnailImage.alt = this.pdfViewer.element.id + '_thumbnail_page_' + pageIndex;
        if (this.pdfViewerBase.pageSize[pageIndex] && (this.pdfViewerBase.pageSize[pageIndex].height < this.pdfViewerBase.pageSize[pageIndex].width)) {
            this.thumbnailImage.style.height = '86px';
            this.thumbnailImage.style.width = '126px';
            thumbnail.style.height = '100px';
            thumbnail.style.width = '140px';
            pageLink.style.left = '-25px';
            pageLink.style.position = 'relative';
            thumbnailPageNumber.style.left = '18px';
            thumbnailPageNumber.style.position = 'relative';
        }
        this.thumbnailSelectionRing.appendChild(this.thumbnailImage);
        pageLink.appendChild(thumbnail);
        this.thumbnailView.appendChild(pageLink);
        this.wireUpEvents();
        if (pageIndex === 0) {
            this.setMouseFocusToFirstPage();
        }
    }

    private wireUpEvents(): void {
        if (this.thumbnailSelectionRing) {
            this.thumbnailSelectionRing.addEventListener('click', this.thumbnailClick);
            this.thumbnailSelectionRing.addEventListener('mouseover', this.thumbnailMouseOver);
            this.thumbnailSelectionRing.addEventListener('mouseleave', this.thumbnailMouseLeave);
        }
    }
    private unwireUpEvents(): void {
        if (this.thumbnailSelectionRing && this.thumbnailImage) {
            this.thumbnailSelectionRing.removeEventListener('click', this.thumbnailClick);
            this.thumbnailSelectionRing.removeEventListener('mouseover', this.thumbnailMouseOver);
            this.thumbnailSelectionRing.removeEventListener('mouseleave', this.thumbnailMouseLeave);
        }
    }

    /**
     * @param event
     * @private
     */
    public thumbnailClick = (event: MouseEvent): void => {
        const proxy: ThumbnailView = this;
        const pageNumber: number = proxy.getPageNumberFromID(event.srcElement.id);
        if (proxy.previousElement) {
            proxy.previousElement.classList.remove('e-pv-thumbnail-selection');
            proxy.previousElement.classList.remove('e-pv-thumbnail-focus');
            proxy.previousElement.classList.add('e-pv-thumbnail-selection-ring');
        }
        if (event.srcElement.parentElement.id === proxy.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageNumber) {
            proxy.setSelectionStyle(event.srcElement.parentElement);
            proxy.previousElement = event.srcElement.parentElement;
        } else if (event.srcElement.id === proxy.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageNumber) {
            proxy.setSelectionStyle(event.srcElement as HTMLElement);
            proxy.previousElement = event.srcElement as HTMLElement;
        }
        proxy.pdfViewer.fireThumbnailClick(pageNumber + 1);
        proxy.isThumbnailClicked = true;
        proxy.goToThumbnailPage(pageNumber + 1);
        proxy.pdfViewerBase.focusViewerContainer();
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            // eslint-disable-next-line
            let currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
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
     * @param event
     * @private
     */
    public thumbnailMouseOver = (event: MouseEvent): void => {
        const proxy: ThumbnailView = this;
        const pageNumber: number = proxy.getPageNumberFromID(event.srcElement.id);
        if (event.srcElement.id === proxy.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageNumber) {
            proxy.setMouseOverStyle(event.srcElement as HTMLElement);
        } else if (event.srcElement.id === proxy.pdfViewer.element.id + '_thumbnail_image_' + pageNumber) {
            proxy.setMouseOverStyle(event.srcElement.parentElement);
        }
    };

    private setMouseOverStyle(thumbnailElement: HTMLElement): void {
        // eslint-disable-next-line max-len
        if (!thumbnailElement.classList.contains('e-pv-thumbnail-selection')) {
            thumbnailElement.classList.remove('e-pv-thumbnail-selection-ring');
            if (!thumbnailElement.classList.contains('e-pv-thumbnail-focus')) {
                thumbnailElement.classList.add('e-pv-thumbnail-hover');
            }
        }
    }

    /**
     * @param event
     * @private
     */
    public thumbnailMouseLeave = (event: MouseEvent): void => {
        const proxy: ThumbnailView = this;
        const pageNumber: number = proxy.getPageNumberFromID(event.srcElement.id);
        if (event.srcElement.parentElement.id === proxy.pdfViewer.element.id + '_thumbnail_view') {
            proxy.setMouseLeaveStyle(event.srcElement.children[0].children[0] as HTMLElement);
        } else if (event.srcElement.parentElement.id === proxy.pdfViewer.element.id + '_thumbnail_' + pageNumber) {
            proxy.setMouseLeaveStyle(event.srcElement.parentElement.children[0] as HTMLElement);
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
     */
    public clear(): void {
        this.startIndex = 0;
        this.thumbnailLimit = 0;
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
         * @param thumbnailViewChildrenElement
         */
        function isThumbnailElementBottomAfterViewTop(thumbnailViewChildrenElement: HTMLElement): boolean {
            const elementBottom: number =
                thumbnailViewChildrenElement.offsetTop + thumbnailViewChildrenElement.clientTop + thumbnailViewChildrenElement.clientHeight;
            return elementBottom > top;
        }
        // eslint-disable-next-line
        let visible: Array<IVisibleThumbnailElement> = [];
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
            // eslint-disable-next-line no-bitwise
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

    // eslint-disable-next-line
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
            // eslint-disable-next-line no-bitwise
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

    private getThumbnailElement(index: number): HTMLElement {
        const thumbnailChild: HTMLAnchorElement = this.thumbnailView.children[index] as HTMLAnchorElement;
        return thumbnailChild.children[0] as HTMLElement;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.clear();
    }
    /**
     * @private
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
    // eslint-disable-next-line
    views: Array<IVisibleThumbnailElement>;
}
