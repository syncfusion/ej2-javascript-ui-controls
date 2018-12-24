import { PdfViewerBase, PdfViewer } from '../index';
import { createElement } from '@syncfusion/ej2-base';
import { TreeView, NodeSelectEventArgs } from '@syncfusion/ej2-navigations';

/**
 * BookmarkView module
 */
export class BookmarkView {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private bookmarkView: HTMLElement;
    // tslint:disable-next-line
    public bookmarks: any;
    // tslint:disable-next-line
    public bookmarksDestination: any;

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
    public createRequestForBookmarks(): void {
        let proxy: BookmarkView = this;
        let request: XMLHttpRequest = new XMLHttpRequest();
        // tslint:disable-next-line:max-line-length
        let jsonObject: object = { hashId: this.pdfViewerBase.hashId };
        request.open('POST', proxy.pdfViewer.serviceUrl + '/Bookmarks');
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.responseType = 'json';
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        request.onreadystatechange = (event: any): void => {
            if (request.readyState === 4 && request.status === 200) {
                this.pdfViewerBase.navigationPane.disableBookmarkButton();
                // tslint:disable-next-line
                let data: any = event.currentTarget.response;
                if (data) {
                    if (typeof data !== 'object') {
                        data = JSON.parse(data);
                    }
                    this.bookmarks = { bookMark: data.Bookmarks };
                    this.bookmarksDestination = { bookMarkDestination: data.BookmarksDestination };
                }
                if (this.bookmarks == null) {
                    this.pdfViewerBase.navigationPane.disableBookmarkButton();
                } else {
                    this.pdfViewerBase.navigationPane.enableBookmarkButton();
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
    public renderBookmarkcontent(): void {
        if (this.bookmarkView != null) {
            this.bookmarkView.parentElement.removeChild(this.bookmarkView);
        }
        this.bookmarkView = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_view', className: 'e-pv-bookmark-view' });
        this.pdfViewerBase.navigationPane.sideBarContent.appendChild(this.bookmarkView);
        // tslint:disable-next-line:max-line-length
        let bookmarkIconView: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_iconview', className: 'e-pv-bookmark-icon-view' });
        // tslint:disable-next-line:max-line-length
        let bookmarkIcon: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_bookmark_icon', className: 'e-pv-bookmark-icon e-pv-icon' });
        let bookmarkTitle: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_Title', className: 'e-pv-bookmark-Title' });
        bookmarkTitle.innerText = '${Title}';
        bookmarkIconView.appendChild(bookmarkIcon);
        bookmarkIconView.appendChild(bookmarkTitle);
        // tslint:disable-next-line:max-line-length
        let treeObj: TreeView = new TreeView({
            fields:
            {
                dataSource: this.bookmarks.bookMark,
                id: 'Id',
                text: 'Title',
                child: 'Child',
                hasChildren: 'HasChild',
            },
            nodeTemplate: bookmarkIconView.outerHTML,
            nodeSelected: this.nodeClick.bind(this)
        });
        treeObj.appendTo(this.bookmarkView);
    }

    private nodeClick = (args: NodeSelectEventArgs): boolean => {
        let bookid: number = Number(args.nodeData.id);
        let proxy: BookmarkView = this;
        let pageIndex: number = this.bookmarksDestination.bookMarkDestination[bookid].PageIndex;
        let Y: number = this.bookmarksDestination.bookMarkDestination[bookid].Y;
        this.goToBookmark(pageIndex, Y);
        return false;
    }

    /**
     * Get Bookmarks of the PDF document being loaded in the ejPdfViewer control
     * @returns any
     */
    // tslint:disable-next-line
    public getBookmarks():any {
        if (this.bookmarks && this.bookmarksDestination) {
            // tslint:disable-next-line:max-line-length
            return { bookmarks: this.bookmarks , bookmarksDestination: this.bookmarksDestination };
        }
    }

    /**
     * Navigate To current Bookmark location of the PDF document being loaded in the ejPdfViewer control.
     * @returns void
     */
    public goToBookmark(pageIndex: number, y: number): boolean {
        let proxy: BookmarkView = this;
        let destPage: number = (this.pdfViewerBase.pageSize[pageIndex - 1].height);
        // tslint:disable-next-line:max-line-length
        let scrollValue: number = this.pdfViewerBase.pageSize[pageIndex].top * this.pdfViewerBase.getZoomFactor() + ((destPage - y) * this.pdfViewerBase.getZoomFactor());
        let scroll: string = scrollValue.toString();
        // tslint:disable-next-line:radix
        proxy.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll);
        proxy.pdfViewerBase.focusViewerContainer();
        return false;
    }

    /**
     * @private
     */
    public clear(): void {
        this.pdfViewerBase.navigationPane.disableBookmarkButton();
        this.pdfViewerBase.navigationPane.updateViewerContainerOnClose();
        if (this.bookmarks) {
            this.bookmarks.bookMark = [];
            this.bookmarks = null;
        }
        if (this.bookmarksDestination) {
            this.bookmarksDestination.bookMarkDestination = [];
        }
        if (this.bookmarkView != null) {
            while (this.bookmarkView.hasChildNodes()) {
                this.bookmarkView.removeChild(this.bookmarkView.lastChild);
            }
        }
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
        return 'BookmarkView';
    }
}
