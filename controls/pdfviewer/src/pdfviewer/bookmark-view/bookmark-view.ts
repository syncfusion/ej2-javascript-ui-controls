import { PdfViewerBase, PdfViewer } from '../index';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { TreeView, NodeSelectEventArgs } from '@syncfusion/ej2-navigations';
import { ListView } from '@syncfusion/ej2-lists';
import { AjaxHandler } from '../index';

/**
 * BookmarkView module
 */
export class BookmarkView {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private bookmarkView: HTMLElement;
    private isBookmarkViewDiv: Boolean;
    private treeObj: TreeView;
    private bookmarkRequestHandler: AjaxHandler;
    // tslint:disable-next-line
    public bookmarks: any;
    // tslint:disable-next-line
    public bookmarksDestination: any;
    /**
     * @private
     */
    public childNavigateCount: number = 0;
    /**
     * @private
     */
    public bookmarkList: ListView;

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
        // tslint:disable-next-line:max-line-length
        let jsonObject: object = { hashId: this.pdfViewerBase.hashId, action: 'Bookmarks' };
        if (this.pdfViewerBase.jsonDocumentId) {
            // tslint:disable-next-line
            (jsonObject as any).document = this.pdfViewerBase.jsonDocumentId;
        }
        this.bookmarkRequestHandler = new AjaxHandler(this.pdfViewer);
        this.bookmarkRequestHandler.url = proxy.pdfViewer.serviceUrl + '/Bookmarks';
        this.bookmarkRequestHandler.responseType = 'json';
        this.bookmarkRequestHandler.send(jsonObject);
        // tslint:disable-next-line
        this.bookmarkRequestHandler.onSuccess = function (result: any) {
            if (proxy.pdfViewerBase.navigationPane) {
                proxy.pdfViewerBase.navigationPane.disableBookmarkButton();
            }
            // tslint:disable-next-line
            let data: any = result.data;
            if (data) {
                if (typeof data !== 'object') {
                    data = JSON.parse(data);
                }
                proxy.bookmarks = { bookMark: data.Bookmarks };
                proxy.bookmarksDestination = { bookMarkDestination: data.BookmarksDestination };
            }
            if (proxy.pdfViewerBase.navigationPane) {
                if (proxy.bookmarks == null) {
                    proxy.pdfViewerBase.navigationPane.disableBookmarkButton();
                } else {
                    proxy.pdfViewerBase.navigationPane.enableBookmarkButton();
                    proxy.isBookmarkViewDiv = false;
                }
            }
        };
        // tslint:disable-next-line
        this.bookmarkRequestHandler.onFailure = function (result: any) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
        };
        // tslint:disable-next-line
        this.bookmarkRequestHandler.onError = function (result: any) {
            proxy.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
        };
    }
    /**
     * @private
     */
    public renderBookmarkcontent(): void {
        if (!this.isBookmarkViewDiv) {
            this.bookmarkView = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_view', className: 'e-pv-bookmark-view' });
            this.pdfViewerBase.navigationPane.sideBarContent.appendChild(this.bookmarkView);
            // tslint:disable-next-line:max-line-length
            let bookmarkIconView: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_iconview', className: 'e-pv-bookmark-icon-view' });
            // tslint:disable-next-line:max-line-length
            if (!this.pdfViewer.enableRtl) {
                // tslint:disable-next-line:max-line-length
                let bookmarkIcon: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_bookmark_icon', className: 'e-pv-bookmark-icon e-pv-icon' });
                bookmarkIconView.appendChild(bookmarkIcon);
            } else {
                // tslint:disable-next-line:max-line-length
                let bookmarkIcon: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_bookmark_icon', className: 'e-pv-bookmark-icon e-pv-icon e-right' });
                bookmarkIconView.appendChild(bookmarkIcon);
            }
            // tslint:disable-next-line:max-line-length
            let bookmarkTitle: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_Title', className: 'e-pv-bookmark-Title' });
            if (this.pdfViewer.enableRtl) {
                bookmarkTitle.style.paddingRight = 26 + 'px';
            } else {
                bookmarkTitle.style.paddingLeft = 40 + 'px';
            }
            bookmarkTitle.innerText = '${Title}';
            bookmarkIconView.appendChild(bookmarkTitle);
            // tslint:disable-next-line:max-line-length
            this.treeObj = new TreeView({
                fields:
                {
                    dataSource: this.bookmarks.bookMark,
                    id: 'Id',
                    text: 'Title',
                    child: 'Child',
                    hasChildren: 'HasChild',
                },
                nodeTemplate: bookmarkIconView.outerHTML,
                nodeSelected: this.nodeClick.bind(this),
            });
            this.treeObj.isStringTemplate = true;
            if (this.pdfViewer.enableRtl) {
                this.treeObj.enableRtl = true;
            }
            this.treeObj.appendTo(this.bookmarkView);
            ['mouseover', 'keydown'].forEach((evt: string) => this.bookmarkView.addEventListener(evt, (event: Event) => {
                this.setHeight(event.target);
            }));
            this.isBookmarkViewDiv = true;
        }
        this.bookmarkView.style.display = 'block';
    }

    /**
     * @private
     */
    public renderBookmarkContentMobile(): void {
        if (this.bookmarkView != null) {
            this.bookmarkView.remove();
        }
        this.bookmarkView = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_view', className: 'e-pv-bookmark-view' });
        this.pdfViewerBase.getElement('_bookmarks_container').appendChild(this.bookmarkView);
        this.bookmarkList = new ListView({
            dataSource: this.bookmarks.bookMark,
            fields:
            {
                id: 'Id',
                text: 'Title',
                child: 'Child'
            },
            showHeader: false,
            select: this.bookmarkClick.bind(this)
        });
        this.bookmarkList.isStringTemplate = true;
        if (this.pdfViewer.enableRtl) {
            this.bookmarkList.enableRtl = true;
        }
        this.bookmarkList.appendTo(this.bookmarkView);
    }

    // tslint:disable-next-line
    private bookmarkClick = (args: any): boolean => {
        // tslint:disable-next-line
        if (!((args.event as any).target as HTMLElement).classList.contains('e-icons')) {
            let bookid: number = args.data.Id;
            this.childNavigateCount = 0;
            this.pdfViewerBase.navigationPane.goBackToToolbar();
            this.navigateToBookmark(bookid);
        } else {
            this.childNavigateCount++;
        }
        return false;
    }

    private nodeClick = (args: NodeSelectEventArgs): boolean => {
        this.setHeight(args.node);
        let bookid: number = Number(args.nodeData.id);
        this.navigateToBookmark(bookid);
        return false;
    }

    // tslint:disable-next-line
    private setHeight(element: any): void {
        if (this.treeObj.fullRowSelect) {
            if (element.classList.contains('e-treeview')) {
                element = element.querySelector('.e-node-focus').querySelector('.e-fullrow');
            } else if (element.classList.contains('e-list-parent')) {
                element = element.querySelector('.e-fullrow');
            } else if (element.classList.value !== ('e-fullrow') && element.closest('.e-list-item')) {
                element = element.closest('.e-list-item').querySelector('.e-fullrow');
            }
            if (element.nextElementSibling) {
                element.style.height = element.nextElementSibling.offsetHeight + 'px';
            }
        }
    }

    /**
     * @private
     */
    public setBookmarkContentHeight(): void {
        // tslint:disable-next-line
        let element: any = this.treeObj.element;
        if (this.treeObj.fullRowSelect) {
            if (element.classList.contains('e-treeview')) {
                element = element.querySelector('.e-node-focus').querySelector('.e-fullrow');
            }
            if (element.nextElementSibling) {
                element.style.height = element.nextElementSibling.offsetHeight + 'px';
            }
        }
    }

    private navigateToBookmark(bookid: number): void {
        let pageIndex: number = this.bookmarksDestination.bookMarkDestination[bookid].PageIndex;
        let Y: number = this.bookmarksDestination.bookMarkDestination[bookid].Y;
        this.goToBookmark(pageIndex, Y);
    }

    /**
     * Get Bookmarks of the PDF document being loaded in the ejPdfViewer control
     * @returns any
     */
    // tslint:disable-next-line
    public getBookmarks(): any {
        if (this.bookmarks && this.bookmarksDestination) {
            // tslint:disable-next-line:max-line-length
            return { bookmarks: this.bookmarks, bookmarksDestination: this.bookmarksDestination };
        }
    }

    /**
     * Navigate To current Bookmark location of the PDF document being loaded in the ejPdfViewer control.
     * @param  {number} pageIndex - Specifies the pageIndex for Navigate
     * @param  {number} y - Specifies the Y coordinates value of the Page
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
        if (Browser.isDevice) {
            this.pdfViewerBase.mobileScrollerContainer.style.display = '';
            this.pdfViewerBase.updateMobileScrollerPosition();
        }
        proxy.pdfViewerBase.focusViewerContainer();
        return false;
    }

    /**
     * @private
     */
    public clear(): void {
        if (this.pdfViewerBase.navigationPane) {
            this.pdfViewerBase.navigationPane.disableBookmarkButton();
            this.pdfViewerBase.navigationPane.updateViewerContainerOnClose();
        }
        if (this.bookmarks) {
            this.bookmarks.bookMark = [];
            this.bookmarks = null;
        }
        if (this.bookmarksDestination) {
            this.bookmarksDestination.bookMarkDestination = [];
        }
        if (this.bookmarkView != null) {
            if (this.bookmarkView.parentElement !== null) {
                this.bookmarkView.parentElement.removeChild(this.bookmarkView);
            }
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
