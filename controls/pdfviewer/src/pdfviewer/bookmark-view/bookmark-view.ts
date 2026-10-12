import { PdfViewerBase, PdfViewer } from '../index';
import { createElement, Browser, isBlazor, initializeCSPTemplate, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TreeView, DrawNodeEventArgs, NodeClickEventArgs, EventArgs } from '@syncfusion/ej2-navigations';
import { ListView } from '@syncfusion/ej2-lists';
import { AjaxHandler } from '../index';

/**
 * The `BookmarkView` module is used to handle bookmark view navigation of PDF viewer.
 *
 * @param {EventArgs} args - args
 * @returns {void}
 */
export class BookmarkView {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private bookmarkView: HTMLElement;
    private isBookmarkViewDiv: boolean;
    private treeObj: TreeView;
    private bookmarkRequestHandler: AjaxHandler;
    private isKeyboardNavigation: boolean = false;
    public bookmarks: any;
    private bookmarkStyles: any;
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
     * @param {PdfViewer} pdfViewer - It describes about the pdfViewer
     * @param {PdfViewerBase} pdfViewerBase - It describes about the pdfViewerBase
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * Open the bookmark pane of the PDF Viewer.
     *
     * @returns {void}
     */
    public openBookmarkPane(): void {
        if (this.pdfViewerBase.navigationPane && this.bookmarks) {
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.pdfViewerBase.navigationPane.showBookmarksPaneMobile();
            }
            else {
                this.pdfViewerBase.navigationPane.openBookmarkcontentInitially();
            }
        }
    }

    /**
     * Close the bookmark pane of the PDF Viewer.
     *
     * @returns {void}
     */
    public closeBookmarkPane(): void {
        if (this.pdfViewerBase.navigationPane) {
            this.pdfViewerBase.navigationPane.closeBookmarkPane(true);
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public createRequestForBookmarks(): void {
        // eslint-disable-next-line
        const proxy: BookmarkView = this;
        const jsonObject: object = { hashId: this.pdfViewerBase.hashId, action: 'Bookmarks', elementId: this.pdfViewer.element.id, uniqueId: this.pdfViewerBase.documentId };
        if (this.pdfViewerBase.jsonDocumentId) {
            (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
        }
        (jsonObject as any).bookmarkStyles = true;
        this.bookmarkRequestHandler = new AjaxHandler(this.pdfViewer);
        this.bookmarkRequestHandler.url = proxy.pdfViewer.serviceUrl + '/Bookmarks';
        this.bookmarkRequestHandler.responseType = 'json';
        if (this.pdfViewerBase.clientSideRendering){
            const data : any = this.pdfViewer.pdfRendererModule.getBookmarks(jsonObject);
            this.renderBookmarksOnSuccess(data, proxy);
        }
        else{
            this.pdfViewerBase.requestCollection.push(this.bookmarkRequestHandler);
            this.bookmarkRequestHandler.send(jsonObject);
            this.bookmarkRequestHandler.onSuccess = function (result: any): void {
                if (proxy.pdfViewerBase.navigationPane) {
                    proxy.pdfViewerBase.navigationPane.disableBookmarkButton();
                }
                const data: any = result.data;
                const redirect: boolean = (proxy as any).pdfViewerBase.checkRedirection(data);
                if (!redirect) {
                    proxy.renderBookmarksOnSuccess(data, proxy);
                }
            };
            this.bookmarkRequestHandler.onFailure = function (result: any): void {
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, 'Bookmarks');
            };
            this.bookmarkRequestHandler.onError = function (result: any): void {
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
                    const bookmarkCollection: any = { bookmarks: proxy.bookmarks, bookmarksDestination: proxy.bookmarksDestination };
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
                    if (Browser.isDevice && !proxy.pdfViewer.enableDesktopMode) {
                        proxy.pdfViewerBase.navigationPane.showBookmarksPaneMobile();
                    }
                    else {
                        proxy.pdfViewerBase.navigationPane.openBookmarkcontentInitially();
                    }
                }
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public renderBookmarkcontent(): void {
        if (!this.isBookmarkViewDiv) {
            const isblazor: boolean = isBlazor();
            this.bookmarkView = isblazor ? this.pdfViewer.element.querySelector('.e-pv-bookmark-view') : createElement('div', { id: this.pdfViewer.element.id + '_bookmark_view', className: 'e-pv-bookmark-view' });
            this.pdfViewerBase.navigationPane.sideBarContent.appendChild(this.bookmarkView);
            const bookmarkIconView: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_iconview', className: 'e-pv-bookmark-icon-view' });
            if (!this.pdfViewer.enableRtl) {
                const bookmarkIcon: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_bookmark_icon', className: 'e-pv-bookmark-icon e-pv-icon' });
                bookmarkIconView.appendChild(bookmarkIcon);
            } else {
                const bookmarkIcon: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_bookmark_icon', className: 'e-pv-bookmark-icon e-pv-icon e-right' });
                bookmarkIconView.appendChild(bookmarkIcon);
            }
            const bookmarkTitle: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_Title', className: 'e-pv-bookmark-title' });
            if (this.pdfViewer.enableRtl) {
                bookmarkTitle.style.paddingRight = 26 + 'px';
            }
            bookmarkTitle.innerText = '${Title}';
            bookmarkIconView.appendChild(bookmarkTitle);
            if (!isblazor) {
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
                    nodeClicked: this.nodeClick.bind(this),
                    keyPress: this.bookmarkKeypress.bind(this),
                    drawNode: this.bookmarkPanelBeforeOpen.bind(this)
                });
                this.treeObj.isStringTemplate = true;
                if (this.pdfViewer.enableRtl) {
                    this.treeObj.enableRtl = true;
                }
                this.treeObj.appendTo(this.bookmarkView);
            }
            const event: string[] = ['mouseover', 'keydown'];
            for (let m: number = 0; m < event.length; m++) {
                this.bookmarkView.addEventListener(event[parseInt(m.toString(), 10)], (event: Event) => {
                    this.setHeight(event.target);
                });
            }
            this.isBookmarkViewDiv = true;
        }
        this.bookmarkView.style.display = 'block';
    }

    /**
     * @private
     * @returns {void}
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

    private bookmarkClick = (args: any): boolean => {
        if (!((args.event as any).target as HTMLElement).classList.contains('e-icons')) {
            const bookid: number = args.data.Id;
            this.childNavigateCount = 0;
            this.pdfViewerBase.navigationPane.goBackToToolbar();
            const selectedItem: any = this.bookmarkList.getSelectedItems();
            this.navigateToBookmark(bookid, args.text, selectedItem.data.FileName);
        } else {
            this.childNavigateCount++;
        }
        return false;
    };

    private nodeClick = (args: NodeClickEventArgs): boolean => {
        this.setHeight(args.node);
        const data: any[] = this.treeObj.getTreeData(args.node);
        const bookid: number = Number(data[0].Id);
        this.navigateToBookmark(bookid, args.node.textContent, data[0].FileName);
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            const currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber, 10);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
        return false;
    };
    private bookmarkKeypress = (args: any): void => {
        if (args.event && args.event.pointerType !== 'mouse' && args.event.pointerType !== 'touch' && (args.event.key === 'Enter' || args.event.key === ' ')) {
            this.isKeyboardNavigation = true;
            this.nodeClick(args);
            this.isKeyboardNavigation = false;
        }
    }
    private bookmarkPanelBeforeOpen = (args: DrawNodeEventArgs): void => {
        if (this.pdfViewer.enableBookmarkStyles) {
            for (let k: number = 0; k < this.bookmarkStyles.length; k++) {
                if ((args.text.trim()) === (this.bookmarkStyles[parseInt(k.toString(), 10)].Text.trim())) {
                    const element: any = args.node.querySelector(':scope > div.e-text-content');
                    if (element) {
                        const fontStyle: any = this.bookmarkStyles[parseInt(k.toString(), 10)].FontStyle.split(',');
                        for (let n: number = 0; n < fontStyle.length; n++) {
                            switch (fontStyle[parseInt(n.toString(), 10)].trim()) {
                            case 'Italic':
                                element.style.fontStyle = 'italic';
                                break;
                            case 'Bold':
                                element.style.fontWeight = 'Bold';
                            }
                        }
                        const currentElement: any = element.getElementsByClassName('e-pv-bookmark-title')[0];
                        if (currentElement) {
                            currentElement.style.color = this.bookmarkStyles[parseInt(k.toString(), 10)].Color;
                        } else {
                            element.children[0].style.color = this.bookmarkStyles[parseInt(k.toString(), 10)].Color;
                        }
                    }
                    break;
                }
            }
        }
        else {
            const element: HTMLElement = args.node.querySelector(':scope > div.e-text-content') as HTMLElement;
            if (element) {
                if (element.style.fontStyle) {
                    element.style.removeProperty('font-style');
                }
                if (element.style.fontWeight) {
                    element.style.removeProperty('font-weight');
                }
                const currentElement: HTMLElement = element.getElementsByClassName('e-pv-bookmark-title')[0] as HTMLElement;
                if (currentElement && currentElement.style.color) {
                    currentElement.style.removeProperty('color');
                }
                else {
                    if (element.children.length > 0 && (element.children[0] as HTMLElement).style.color) {
                        (element.children[0] as HTMLElement).style.removeProperty('color');
                    }
                }
            }
        }
    };

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
     * @returns {void}
     */
    public setBookmarkContentHeight(): void {
        if (this.treeObj) {
            let element: any = this.treeObj.element;
            if (this.treeObj.fullRowSelect) {
                if (element && element.classList.contains('e-treeview') && element.classList.contains('.e-active')) {
                    element = element.querySelector('.e-active').querySelector('.e-fullrow');
                }
                else if (element && element.classList.contains('e-treeview')) {
                    element = element.querySelector('.e-fullrow');
                }
                if (element && element.nextElementSibling) {
                    element.style.height = element.nextElementSibling.offsetHeight + 'px';
                }
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public handleBookmarkStyles(): void {
        const bookmarkNodes: HTMLLIElement[] = Array.from(this.treeObj.getRootElement().querySelectorAll('li.e-list-item')) as HTMLLIElement[];
        for (const node of bookmarkNodes) {
            const nodeId: string = node.dataset['uid'];
            const nodeData: any = this.findBookmarkNodeData(this.bookmarks.bookMark as any[], nodeId);
            this.bookmarkPanelBeforeOpen(
                {node: node, nodeData: {[nodeId]: nodeData as Object}, text: nodeData.Title as string} as DrawNodeEventArgs);
        }
    }

    private findBookmarkNodeData(nodes: any[] | null, targetId: string): any {
        if (isNullOrUndefined(nodes)) {
            return null;
        }
        for (const node of nodes) {
            if (String(node.Id) === targetId) {
                return node;
            }
            const foundInChild: any = this.findBookmarkNodeData(node.Child, targetId);
            if (foundInChild) {
                return foundInChild;
            }
        }
        return null;
    }

    private navigateToBookmark(bookid: number, text: string, fileName: string) : void {
        const pageIndex: number = this.bookmarksDestination.bookMarkDestination[parseInt(bookid.toString(), 10)].PageIndex;
        const Y: number = this.bookmarksDestination.bookMarkDestination[parseInt(bookid.toString(), 10)].Y;
        if (pageIndex !== -1) {
            this.goToBookmark(pageIndex, Y);
        }
        this.pdfViewer.fireBookmarkClick(pageIndex !== -1 ? pageIndex + 1 : pageIndex, Y, text, fileName);
    }

    /**
     * Get the Bookmarks of a PDF document being loaded in the ejPdfViewer control.
     *
     * @returns {any} - any
     */
    public getBookmarks(): any {
        if (this.bookmarks && this.bookmarksDestination) {
            return { bookmarks: this.bookmarks, bookmarksDestination: this.bookmarksDestination };
        }
    }

    /**
     * Navigate To current Bookmark location of the PDF document being loaded in the ejPdfViewer control.
     *
     * @param  {number} pageIndex - Specifies the pageIndex for Navigate
     * @param  {number} y - Specifies the Y coordinates value of the Page
     * @returns {void}
     */
    public goToBookmark(pageIndex: number, y: number): boolean {
        // eslint-disable-next-line
        const proxy: BookmarkView = this;
        const destPage: number = (this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].height);
        let scrollValue: number;
        if (y === 0) {
            scrollValue = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].top * this.pdfViewerBase.getZoomFactor();
        } else {
            scrollValue = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].top *
             this.pdfViewerBase.getZoomFactor() + ((destPage - y) * this.pdfViewerBase.getZoomFactor());
        }
        const scroll: string = scrollValue.toString();
        proxy.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll, 10);
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.pdfViewerBase.mobileScrollerContainer.style.display = '';
            this.pdfViewerBase.updateMobileScrollerPosition();
        }
        if (pageIndex > 0 && pageIndex <= this.pdfViewerBase.pageCount && this.pdfViewerBase.currentPageNumber !== pageIndex + 1) {
            this.pdfViewerBase.updateScrollTop(pageIndex, false);
        }
        return false;
    }

    /**
     * @private
     * @returns {void}
     */
    public clear(): void {
        this.closeBookmarkPane();
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (this.pdfViewer.thumbnailView) {
                this.pdfViewer.thumbnailView.closeThumbnailPane();
            }
        }
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
        return 'BookmarkView';
    }
}
