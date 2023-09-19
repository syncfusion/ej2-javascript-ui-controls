/* eslint-disable */
import { PdfViewerBase, PdfViewer } from '../index';
import { createElement, Browser, isBlazor, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { TreeView, NodeSelectEventArgs, DrawNodeEventArgs } from '@syncfusion/ej2-navigations';
import { ListView } from '@syncfusion/ej2-lists';
import { AjaxHandler } from '../index';

/**
 * BookmarkView module
 */
export class BookmarkView {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private bookmarkView: HTMLElement;
    private isBookmarkViewDiv: boolean;
    private treeObj: TreeView;
    private bookmarkRequestHandler: AjaxHandler;
    // eslint-disable-next-line
    public bookmarks: any;
    // eslint-disable-next-line
    private bookmarkStyles: any;
    // eslint-disable-next-line
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
    public createRequestForBookmarks(): void {
        const proxy: BookmarkView = this;
        // eslint-disable-next-line max-len
        const jsonObject: object = { hashId: this.pdfViewerBase.hashId, action: 'Bookmarks', elementId: this.pdfViewer.element.id, uniqueId: this.pdfViewerBase.documentId };
        if (this.pdfViewerBase.jsonDocumentId) {
            // eslint-disable-next-line
            (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
        }
        if (this.pdfViewer.enableBookmarkStyles) {
            // eslint-disable-next-line
            (jsonObject as any).bookmarkStyles = this.pdfViewer.enableBookmarkStyles;
        }
        this.bookmarkRequestHandler = new AjaxHandler(this.pdfViewer);
        this.bookmarkRequestHandler.url = proxy.pdfViewer.serviceUrl + '/Bookmarks';
        this.bookmarkRequestHandler.responseType = 'json';
        if(this.pdfViewerBase.clientSideRendering){
            let data :any = this.pdfViewer.pdfRendererModule.getBookmarks(jsonObject);
            this.renderBookmarksOnSuccess(data, proxy);
        }
        else{
            this.bookmarkRequestHandler.send(jsonObject);
            // eslint-disable-next-line
            this.bookmarkRequestHandler.onSuccess = function (result: any) {
                if (proxy.pdfViewerBase.navigationPane) {
                    proxy.pdfViewerBase.navigationPane.disableBookmarkButton();
                }
                // eslint-disable-next-line
                let data: any = result.data;
                let redirect: boolean = (proxy as any).pdfViewerBase.checkRedirection(data);
                if (!redirect) {
                    proxy.renderBookmarksOnSuccess(data, proxy);
                }
            };
            // eslint-disable-next-line
            this.bookmarkRequestHandler.onFailure = function (result: any) {
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, 'Bookmarks');
            };
            // eslint-disable-next-line
            this.bookmarkRequestHandler.onError = function (result: any) {
                proxy.pdfViewerBase.openNotificationPopup();
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, 'Bookmarks');
            };
        }
    }

    private renderBookmarksOnSuccess(data: any, proxy: BookmarkView): void {
        if (data) {
            if (typeof data !== 'object') {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    proxy.pdfViewerBase.onControlError(500, data, 'Bookmarks');
                    data = null;
                }
            }
            if (data && data.uniqueId === proxy.pdfViewerBase.documentId) {
                proxy.pdfViewer.fireAjaxRequestSuccess('Bookmarks', data);
                proxy.bookmarks = { bookMark: data.Bookmarks };
                proxy.bookmarkStyles = data.Bookmarkstyles;
                proxy.bookmarksDestination = { bookMarkDestination: data.BookmarksDestination };
                if (isBlazor()) {
                    // eslint-disable-next-line
                    let bookmarkCollection: any = { bookmarks: proxy.bookmarks, bookmarksDestination: proxy.bookmarksDestination };
                    if (proxy.pdfViewer && proxy.pdfViewer._dotnetInstance) {
                        proxy.pdfViewer._dotnetInstance.invokeMethodAsync('UpdateBookmarkCollection', bookmarkCollection);
                    }
                }
            }
        }
        if (proxy.pdfViewerBase.navigationPane) {
            if (proxy.bookmarks == null) {
                proxy.pdfViewerBase.navigationPane.disableBookmarkButton();
                if (isBlazor() && proxy.pdfViewer._dotnetInstance) {
                    proxy.pdfViewer._dotnetInstance.invokeMethodAsync('UpdateBookmarkCollection', null);
                }
            } else {
                proxy.pdfViewerBase.navigationPane.enableBookmarkButton();
                proxy.isBookmarkViewDiv = false;
                if (proxy.pdfViewer.isBookmarkPanelOpen) {
                    proxy.pdfViewerBase.navigationPane.openBookmarkcontentInitially();
                }
            }
        }
    }

    /**
     * @private
     */
    public renderBookmarkcontent(): void {
        if (!this.isBookmarkViewDiv) {
            const isblazor: boolean = isBlazor();
            // eslint-disable-next-line max-len
            this.bookmarkView = isblazor ? this.pdfViewer.element.querySelector('.e-pv-bookmark-view') : createElement('div', { id: this.pdfViewer.element.id + '_bookmark_view', className: 'e-pv-bookmark-view' });
            this.pdfViewerBase.navigationPane.sideBarContent.appendChild(this.bookmarkView);
            // eslint-disable-next-line max-len
            const bookmarkIconView: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_iconview', className: 'e-pv-bookmark-icon-view' });
            // eslint-disable-next-line max-len
            if (!this.pdfViewer.enableRtl) {
                // eslint-disable-next-line max-len
                const bookmarkIcon: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_bookmark_icon', className: 'e-pv-bookmark-icon e-pv-icon' });
                bookmarkIconView.appendChild(bookmarkIcon);
            } else {
                // eslint-disable-next-line max-len
                const bookmarkIcon: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_bookmark_icon', className: 'e-pv-bookmark-icon e-pv-icon e-right' });
                bookmarkIconView.appendChild(bookmarkIcon);
            }
            // eslint-disable-next-line max-len
            const bookmarkTitle: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_Title', className: 'e-pv-bookmark-title' });
            if (this.pdfViewer.enableRtl) {
                bookmarkTitle.style.paddingRight = 26 + 'px';
            }
            bookmarkTitle.innerText = '${Title}';
            bookmarkIconView.appendChild(bookmarkTitle);
            if (!isblazor) {
                // eslint-disable-next-line max-len
                this.treeObj = new TreeView({
                    fields:
                    {
                        dataSource: this.bookmarks.bookMark,
                        id: 'Id',
                        text: 'Title',
                        child: 'Child',
                        hasChildren: 'HasChild'
                    },
                    nodeTemplate:  initializeCSPTemplate(
                        function (data: any): string { return bookmarkIconView.outerHTML.replace('${Title}', data.Title); }
                    ),
                    nodeSelected: this.nodeClick.bind(this),
                    drawNode: this.bookmarkPanelBeforeOpen.bind(this)
                });
                this.treeObj.isStringTemplate = true;
                if (this.pdfViewer.enableRtl) {
                    this.treeObj.enableRtl = true;
                }
                this.treeObj.appendTo(this.bookmarkView);
            }
            // eslint-disable-next-line
            let event: any = ['mouseover', 'keydown'];
            for (let m: number = 0; m < event.length; m++) {
                this.bookmarkView.addEventListener(event[m], (event: Event) => {
                    this.setHeight(event.target);
                });
            }
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

    // eslint-disable-next-line
    private bookmarkClick = (args: any): boolean => {
        // eslint-disable-next-line
        if (!((args.event as any).target as HTMLElement).classList.contains('e-icons')) {
            const bookid: number = args.data.Id;
            this.childNavigateCount = 0;
            this.pdfViewerBase.navigationPane.goBackToToolbar();
            // eslint-disable-next-line
            let selectedItem: any = this.bookmarkList.getSelectedItems();
            this.navigateToBookmark(bookid, args.text, selectedItem.data.FileName);
        } else {
            this.childNavigateCount++;
        }
        return false;
    };

    private nodeClick = (args: NodeSelectEventArgs): boolean => {
        this.setHeight(args.node);
        const bookid: number = Number(args.nodeData.id);
        // eslint-disable-next-line
        let data: any[] = this.treeObj.getTreeData(args.node);
        this.navigateToBookmark(bookid, args.node.textContent, data[0].FileName);
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            // eslint-disable-next-line
            let currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
        return false;
    };
    private bookmarkPanelBeforeOpen = (args: DrawNodeEventArgs): void => {
        if (this.pdfViewer.enableBookmarkStyles) {
            for (let k: number = 0; k < this.bookmarkStyles.length; k++) {
                if ((args.text.trim()) === (this.bookmarkStyles[k].Text.trim())) {
                    // eslint-disable-next-line
                    let element: any = args.node.lastElementChild;
                    if (element) {
                        // eslint-disable-next-line
                        let fontStyle: any = this.bookmarkStyles[k].FontStyle.split(',');
                        for (let n: number = 0; n < fontStyle.length; n++) {
                            switch (fontStyle[n].trim()) {
                            case 'Italic':
                                element.style.fontStyle = 'italic';
                                break;
                            case 'Bold':
                                element.style.fontWeight = 'Bold';
                            }
                        }
                        // eslint-disable-next-line
                        let currentElement: any = element.getElementsByClassName('e-pv-bookmark-title')[0];
                        if (currentElement) {
                            currentElement.style.color = this.bookmarkStyles[k].Color;
                        } else {
                            element.children[0].style.color = this.bookmarkStyles[k].Color;
                        }
                    }
                    break;
                }
            }
        }
    };

    // eslint-disable-next-line
    private setHeight(element: any): void {
        if (this.treeObj) {
            if (this.treeObj.fullRowSelect && element.classList) {
                if (element.classList.contains('e-treeview') && element.classList.contains('.e-active')) {
                    element = element.querySelector('.e-active').querySelector('.e-fullrow');
                }
                else if (element.classList.contains('e-treeview')) {
                    element = element.querySelector('.e-fullrow');
                }else if (element.classList.contains('e-list-parent')) {
                    element = element.querySelector('.e-fullrow');
                } else if (element.classList.value !== ('e-fullrow')) {
                    if (element.closest && element.closest('.e-list-item')) {
                        element = element.closest('.e-list-item').querySelector('.e-fullrow');
                    } else {
                        if (element.classList.contains('e-list-item')) {
                            element = element.querySelector('.e-fullrow');
                        } else if (element.classList.contains('e-icons') && element.classList.contains('interaction')
                            && element.parentElement.parentElement.classList.contains('e-list-item')) {
                            element = element.parentElement.parentElement.querySelector('.e-fullrow');
                        }
                    }
                }
                if (element.nextElementSibling) {
                    element.style.height = element.nextElementSibling.offsetHeight + 'px';
                }
            }
        }
    }

    /**
     * @private
     */
    public setBookmarkContentHeight(): void {
        if (this.treeObj) {
            // eslint-disable-next-line
            let element: any = this.treeObj.element;
            if (this.treeObj.fullRowSelect) {
                if (element.classList.contains('e-treeview') && element.classList.contains('.e-active')) {
                    element = element.querySelector('.e-active').querySelector('.e-fullrow');
                }
                else if (element.classList.contains('e-treeview')) {
                    element = element.querySelector('.e-fullrow');
                }
                if (element.nextElementSibling) {
                    element.style.height = element.nextElementSibling.offsetHeight + 'px';
                }
            }
        }
    }

    private navigateToBookmark(bookid: number, text: string, fileName: string) : void {
        const pageIndex: number = this.bookmarksDestination.bookMarkDestination[bookid].PageIndex;
        const Y: number = this.bookmarksDestination.bookMarkDestination[bookid].Y;
        if (pageIndex !== -1) {
            this.goToBookmark(pageIndex, Y);
        }
        this.pdfViewer.fireBookmarkClick(pageIndex !== -1 ? pageIndex + 1 : pageIndex, Y, text, fileName);
    }

    /**
     * Get Bookmarks of the PDF document being loaded in the ejPdfViewer control
     *
     * @returns any
     */
    // eslint-disable-next-line
    public getBookmarks(): any {
        if (this.bookmarks && this.bookmarksDestination) {
            // eslint-disable-next-line max-len
            return { bookmarks: this.bookmarks, bookmarksDestination: this.bookmarksDestination };
        }
    }

    /**
     * Navigate To current Bookmark location of the PDF document being loaded in the ejPdfViewer control.
     *
     * @param  {number} pageIndex - Specifies the pageIndex for Navigate
     * @param  {number} y - Specifies the Y coordinates value of the Page
     * @returns void
     */
    public goToBookmark(pageIndex: number, y: number): boolean {
        const proxy: BookmarkView = this;
        const destPage: number = (this.pdfViewerBase.pageSize[pageIndex].height);
        let scrollValue: number;
        if (y === 0) {
            scrollValue = this.pdfViewerBase.pageSize[pageIndex].top * this.pdfViewerBase.getZoomFactor();
        } else {
            // eslint-disable-next-line max-len
            scrollValue = this.pdfViewerBase.pageSize[pageIndex].top * this.pdfViewerBase.getZoomFactor() + ((destPage - y) * this.pdfViewerBase.getZoomFactor());
        }
        const scroll: string = scrollValue.toString();
        // eslint-disable-next-line radix
        proxy.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll);
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
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
        if (this.bookmarkView != null && !isBlazor()) {
            if (this.bookmarkView.parentElement !== null) {
                this.bookmarkView.parentElement.removeChild(this.bookmarkView);
            }
            while (this.bookmarkView.hasChildNodes()) {
                this.bookmarkView.removeChild(this.bookmarkView.lastChild);
            }
        }
        if (this.bookmarkRequestHandler) {
            this.bookmarkRequestHandler.clear();
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
