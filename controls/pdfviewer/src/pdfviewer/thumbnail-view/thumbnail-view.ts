import { PdfViewer, PdfViewerBase } from '../index';
import { createElement } from '@syncfusion/ej2-base';

/**
 * The `ThumbnailView` module is used to handle thumbnail view navigation of PDF viewer.
 * @hidden
 */
export class ThumbnailView {

    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private previousElement: HTMLElement;
    private thumbnailSelectionRing: HTMLElement;
    private thumbnailImage: HTMLImageElement;
    private isThumbnailCompleted: boolean;
    private startIndex: number;
    private thumbnailLimit: number = 30;
    private thumbnailThreshold: number = 50;
    private thumbnailTopMargin: number = 10;
    /**
     * @private
     */
    public isThumbnailClicked: boolean = false;
    /**
     * @private
     */
    public thumbnailView: HTMLElement;

    /**
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
        // tslint:disable-next-line:max-line-length
        this.thumbnailView = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_view', className: 'e-pv-thumbnail-view e-pv-thumbnail-row' });
        this.pdfViewerBase.navigationPane.sideBarContent.appendChild(this.thumbnailView);
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public createRequestForThumbnails(): Promise<any> {
        let proxy: ThumbnailView = this;
        // tslint:disable-next-line
        let isIE: boolean = !!(document as any).documentMode;
        if (!isIE) {
        // tslint:disable-next-line
        return new Promise<any>(
            // tslint:disable-next-line
            function (renderThumbnailImage: any, reject: any): any {
                proxy.requestCreation(proxy);
            });
        } else {
            this.requestCreation(proxy);
            return null;
        }
    }

    private requestCreation(proxy: ThumbnailView): void {
        if (!proxy.isThumbnailCompleted) {
            // tslint:disable-next-line:max-line-length
            proxy.thumbnailLimit = proxy.thumbnailLimit < proxy.pdfViewer.pageCount ? proxy.thumbnailLimit : proxy.pdfViewer.pageCount;
            if (proxy.thumbnailLimit !== proxy.pdfViewer.pageCount) {
                proxy.isThumbnailCompleted = false;
                proxy.startIndex = 0;
            }
        } else {
            proxy.startIndex = proxy.thumbnailLimit;
            // tslint:disable-next-line:max-line-length
            proxy.thumbnailLimit = proxy.startIndex + proxy.thumbnailThreshold < proxy.pdfViewer.pageCount ? proxy.startIndex + proxy.thumbnailThreshold : proxy.pdfViewer.pageCount;
        }
        let request: XMLHttpRequest = new XMLHttpRequest();
        // tslint:disable-next-line:max-line-length
        let jsonObject: object = { startPage: proxy.startIndex, endPage: proxy.thumbnailLimit, sizeX: 99.7, sizeY: 141, hashId: proxy.pdfViewerBase.hashId };
        request.open('POST', proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.renderThumbnail);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.responseType = 'json';
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        request.onreadystatechange = (event: any): void => {
            if (request.readyState === 4 && request.status === 200) {
                // tslint:disable-next-line
                let data: any = event.currentTarget.response;
                if (typeof data !== 'object') {
                    data = JSON.parse(data);
                }
                proxy.renderThumbnailImage(data);
                if (!proxy.isThumbnailCompleted) {
                    proxy.startIndex = proxy.thumbnailLimit;
                    proxy.isThumbnailCompleted = true;
                }
            }
        };
        // tslint:disable-next-line
        request.onerror = (event: any): void => {
            this.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
        };
    }

    /**
     * @private
     */
    public gotoThumbnailImage(pageNumber: number): void {
        let shouldScroll: boolean = this.checkThumbnailScroll(pageNumber);
        if (this.thumbnailView) {
            let thumbnailChild: HTMLAnchorElement = this.thumbnailView.children[pageNumber] as HTMLAnchorElement;
            if (thumbnailChild) {
                let thumbnailDiv: HTMLElement = thumbnailChild.children[0] as HTMLElement;
                if (shouldScroll) {
                    let offsetTop: number = thumbnailDiv.offsetTop + thumbnailDiv.clientTop - this.thumbnailTopMargin;
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

    private checkThumbnailScroll(pageNumber: number): boolean {
        let shouldScroll: boolean = false;
        if (this.thumbnailView) {
            let visibleThumbs: IVisibleThumbnail = this.getVisibleThumbs();
            let numVisibleThumbs: number = visibleThumbs.views.length;
            // if the thumbnail isn't currently visible, scroll it into view.
            if (numVisibleThumbs > 0) {
                let visibleFirstPageID: number = this.getPageNumberFromID(visibleThumbs.first.id);
                // account for only one thumbnail being visible.
                // tslint:disable-next-line:max-line-length
                let visibleLastPageID: number = (numVisibleThumbs > 1 ? this.getPageNumberFromID(visibleThumbs.last.id) : visibleFirstPageID);
                if (pageNumber <= visibleFirstPageID || pageNumber >= visibleLastPageID) {
                    shouldScroll = true;
                } else {
                    // tslint:disable-next-line
                    visibleThumbs.views.some(view => {
                        let pageID: string[] = view.id.split('_');
                        let thumbPageNumber: string = pageID[pageID.length - 1];
                        // tslint:disable-next-line:radix
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
        let pageID: string[] = pageId.split('_');
        let pageNumber: string = pageID[pageID.length - 1];
        // tslint:disable-next-line:radix
        return parseInt(pageNumber);
    }
    private setFocusStyle(thumbnail: HTMLElement, pageNumber: number): void {
        if (thumbnail.children[0].id === this.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageNumber) {
            this.setMouseFocusStyle(thumbnail.children[0] as HTMLElement);
        }
    }

    // tslint:disable-next-line
    private renderThumbnailImage(data: any): void {
        if (this.thumbnailView) {
            for (let i: number = this.startIndex; i < this.thumbnailLimit; i++) {
                let pageLink: HTMLAnchorElement = createElement('a', { id: 'page_' + i }) as HTMLAnchorElement;
                // tslint:disable-next-line:max-line-length
                let thumbnail: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_' + i, className: 'e-pv-thumbnail e-pv-thumbnail-column' });
                // tslint:disable-next-line:max-line-length
                this.thumbnailSelectionRing = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + i, className: 'e-pv-thumbnail-selection-ring' });
                thumbnail.appendChild(this.thumbnailSelectionRing);
                // tslint:disable-next-line:max-line-length
                let thumbnailPageNumber: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_pagenumber_' + i, className: 'e-pv-thumbnail-number' });
                thumbnailPageNumber.textContent = (i + 1).toString();
                thumbnail.appendChild(thumbnailPageNumber);
                // tslint:disable-next-line:max-line-length
                this.thumbnailImage = createElement('img', { id: this.pdfViewer.element.id + '_thumbnail_image_' + i, className: 'e-pv-thumbnail-image' }) as HTMLImageElement;
                this.thumbnailImage.src = data.thumbnailImage[i];
                this.thumbnailSelectionRing.appendChild(this.thumbnailImage);
                pageLink.appendChild(thumbnail);
                this.thumbnailView.appendChild(pageLink);
                this.wireUpEvents();
                if (i === 0) {
                    this.setMouseFocusToFirstPage();
                }
            }
        }
        this.pdfViewerBase.navigationPane.enableThumbnailButton();
        if (this.thumbnailLimit !== this.pdfViewerBase.pageCount && this.thumbnailView) {
            // tslint:disable-next-line
            let isIE: boolean = !!(document as any).documentMode;
            if (!isIE) {
                Promise.all([this.createRequestForThumbnails()]);
            } else {
                this.createRequestForThumbnails();
            }
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
     * @private
     */
    public thumbnailClick = (event: MouseEvent): void => {
        let proxy: ThumbnailView = this;
        let pageNumber: number = proxy.getPageNumberFromID(event.srcElement.id);
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
        proxy.isThumbnailClicked = true;
        proxy.goToThumbnailPage(pageNumber + 1);
        proxy.pdfViewerBase.focusViewerContainer();
    }

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
     * @private
     */
    public thumbnailMouseOver = (event: MouseEvent): void => {
        let proxy: ThumbnailView = this;
        let pageNumber: number = proxy.getPageNumberFromID(event.srcElement.id);
        if (event.srcElement.id === proxy.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageNumber) {
            proxy.setMouseOverStyle(event.srcElement as HTMLElement);
        } else if (event.srcElement.id === proxy.pdfViewer.element.id + '_thumbnail_image_' + pageNumber) {
            proxy.setMouseOverStyle(event.srcElement.parentElement);
        }
    }

    private setMouseOverStyle(thumbnailElement: HTMLElement): void {
        // tslint:disable-next-line:max-line-length
        if (!thumbnailElement.classList.contains('e-pv-thumbnail-selection')) {
            thumbnailElement.classList.remove('e-pv-thumbnail-selection-ring');
            if (!thumbnailElement.classList.contains('e-pv-thumbnail-focus')) {
                thumbnailElement.classList.add('e-pv-thumbnail-hover');
            }
        }
    }

    /**
     * @private
     */
    public thumbnailMouseLeave = (event: MouseEvent): void => {
        let proxy: ThumbnailView = this;
        let pageNumber: number = proxy.getPageNumberFromID(event.srcElement.id);
        if (event.srcElement.parentElement.id === proxy.pdfViewer.element.id + '_thumbnail_view') {
            proxy.setMouseLeaveStyle(event.srcElement.children[0].children[0] as HTMLElement);
        } else if (event.srcElement.parentElement.id === proxy.pdfViewer.element.id + '_thumbnail_' + pageNumber) {
            proxy.setMouseLeaveStyle(event.srcElement.parentElement.children[0] as HTMLElement);
        }
    }

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
        let thumbnailChild: HTMLAnchorElement = this.thumbnailView.children[0] as HTMLAnchorElement;
        if (thumbnailChild) {
            let thumbnailDiv: HTMLElement = thumbnailChild.children[0].children[0] as HTMLElement;
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
        this.isThumbnailCompleted = false;
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
        this.unwireUpEvents();
    }


    private getVisibleThumbs(): IVisibleThumbnail {
        return this.getVisibleElements(this.pdfViewerBase.navigationPane.sideBarContent, this.thumbnailView.children);
    }

    private getVisibleElements(scrollElement: HTMLElement, thumbnailViewChildren: HTMLCollection): IVisibleThumbnail {
        let top: number = scrollElement.scrollTop;
        let bottom: number = top + scrollElement.clientHeight;
        let left: number = scrollElement.scrollLeft;
        let right: number = left + scrollElement.clientWidth;
        function isThumbnailElementBottomAfterViewTop(thumbnailViewChildrenElement: HTMLElement): boolean {
            let elementBottom: number =
                thumbnailViewChildrenElement.offsetTop + thumbnailViewChildrenElement.clientTop + thumbnailViewChildrenElement.clientHeight;
            return elementBottom > top;
        }
        // tslint:disable-next-line
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
            // tslint:disable-next-line:no-bitwise
            percentVisible = ((viewHeight - hiddenHeight) * (viewWidth - hiddenWidth) * 100 / viewHeight / viewWidth) | 0;
            visible.push({
                id: thumbnailView.id,
                x: currentWidth,
                y: currentHeight,
                view: thumbnailView,
                percent: percentVisible,
            });
        }

        let first: IVisibleThumbnailElement = visible[0];
        let last: IVisibleThumbnailElement = visible[visible.length - 1];
        return { first: first, last: last, views: visible, };
    }

    // tslint:disable-next-line
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
            // tslint:disable-next-line:no-bitwise
            let currentIndex: number = (minIndex + maxIndex) >> 1;
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
        let thumbnailChild: HTMLAnchorElement = this.thumbnailView.children[index] as HTMLAnchorElement;
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
 * @hidden
 */
export interface IVisibleThumbnailElement {
    id: string;
    x: number;
    y: number;
    view: HTMLElement;
    percent: number;
}
/**
 * The `IVisibleThumbnail` module is used to handle visible thumbnail collection of PDF viewer.
 * @hidden
 */
export interface IVisibleThumbnail {
    first: IVisibleThumbnailElement;
    last: IVisibleThumbnailElement;
    // tslint:disable-next-line
    views: Array<IVisibleThumbnailElement>;
}