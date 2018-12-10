import { PdfViewer } from '../index';
import { PdfViewerBase } from '../index';
import { createElement } from '@syncfusion/ej2-base';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';

/**
 * The `NavigationPane` module is used to handle navigation pane for thumbnail and bookmark navigation of PDF viewer.
 * @hidden
 */
export class NavigationPane {

    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private sideBarResizer: HTMLElement;
    private sideBarContentSplitter: HTMLElement;
    private sideBarTitleContainer: HTMLElement;
    private thumbnailWidthMin: number = 200;
    private thumbnailButton: HTMLElement;
    private bookmarkButton: HTMLElement;
    private mainContainerWidth: number;
    private closeDiv: HTMLElement;
    private isDown: boolean;
    private offset: number[];
    private sideBarTitle: HTMLElement;
    private contentContainerScrollWidth: number = 33;
    private closeButtonLeft: number = 170;
    private isBookmarkOpen: boolean = false;
    private isThumbnailOpen: boolean = false;

    /**
     * @private
     */
    public isNavigationPaneResized: boolean = false;

    /**
     * @private
     */
    public sideBarToolbar: HTMLElement;
    /**
     * @private
     */
    public sideBarContent: HTMLElement;
    /**
     * @private
     */
    public sideBarContentContainer: HTMLElement;


    constructor(viewer: PdfViewer, base: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * @private
     */
    public initializeNavigationPane(): void {
                // tslint:disable-next-line:max-line-length
                this.sideBarToolbar = createElement('div', { id: this.pdfViewer.element.id + '_sideBarToolbar', className: 'e-pv-sidebar-toolbar' });
                this.pdfViewerBase.mainContainer.appendChild(this.sideBarToolbar);
                // tslint:disable-next-line:max-line-length
                let sideBarToolbarSplitter: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_sideBarToolbarSplitter', className: 'e-pv-sidebar-toolbar-splitter' });
                this.pdfViewerBase.mainContainer.appendChild(sideBarToolbarSplitter);
                // tslint:disable-next-line:max-line-length
                this.sideBarContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContentContainer', className: 'e-pv-sidebar-content-container' });
                this.pdfViewerBase.mainContainer.appendChild(this.sideBarContentContainer);
                // tslint:disable-next-line:max-line-length
                this.sideBarContentSplitter = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContentSplitter', className: 'e-pv-sidebar-content-splitter' });
                this.sideBarContentContainer.appendChild(this.sideBarContentSplitter);
                // tslint:disable-next-line:max-line-length
                this.sideBarContent = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContent', className: 'e-pv-sidebar-content' });
                this.sideBarContentContainer.appendChild(this.sideBarContent);
                // tslint:disable-next-line:max-line-length
                this.sideBarTitleContainer = createElement('div', { id: this.pdfViewer.element.id + '_sideBarTitleContainer', className: 'e-pv-sidebar-title-container' });
                this.sideBarTitle = createElement('div', { id: this.pdfViewer.element.id + '_sideBarTitle', className: 'e-pv-sidebar-title' });
                this.sideBarTitleContainer.appendChild(this.sideBarTitle);
                this.sideBarContentContainer.appendChild(this.sideBarTitleContainer);
                // tslint:disable-next-line:max-line-length
                this.sideBarResizer = createElement('div', { id: this.pdfViewer.element.id + '_sideBarResizer', className: 'e-pv-sidebar-resizer' });
                this.sideBarResizer.addEventListener('mousedown', this.resizePanelMouseDown);
                this.pdfViewerBase.mainContainer.addEventListener('mousemove', this.resizePanelMouseMove);
                this.pdfViewerBase.mainContainer.addEventListener('mouseup', this.resizeViewerMouseLeave);
                this.sideBarContentContainer.appendChild(this.sideBarResizer);
                // tslint:disable-next-line:max-line-length
                let controlLeft: number = this.getViewerContainerLeft();
                this.pdfViewerBase.viewerContainer.style.left = controlLeft + 'px';
                this.pdfViewerBase.viewerContainer.style.width = (this.pdfViewer.element.clientWidth - controlLeft) + 'px';
                this.sideBarContentContainer.style.display = 'none';
                this.createSidebarToolBar();
                this.createSidebarTitleCloseButton();
                this.createResizeIcon();
                this.sideBarToolbar.addEventListener('mouseup', this.sideToolbarOnMouseup.bind(this));
                this.sideBarContentContainer.addEventListener('mouseup', this.sideBarTitleOnMouseup.bind(this));
    }

    private createSidebarToolBar(): void {
        // tslint:disable-next-line:max-line-length
        this.thumbnailButton = createElement('button', { id: this.pdfViewer.element.id + '_thumbnail-view', attrs: { 'disabled': 'disabled'} });
        this.thumbnailButton.className = 'e-pv-tbar-btn e-pv-thumbnail-view-button e-btn';
        // tslint:disable-next-line:max-line-length
        let thumbnailButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_thumbnail-view' + '_icon', className: 'e-pv-thumbnail-view-disable-icon e-pv-icon' });
        this.thumbnailButton.appendChild(thumbnailButtonSpan);
        // tslint:disable-next-line:max-line-length
        let thumbnailTooltip: Tooltip = new Tooltip({ content: this.pdfViewer.localeObj.getConstant('Page Thumbnails'), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
        thumbnailTooltip.appendTo(this.thumbnailButton);
        // tslint:disable-next-line:max-line-length
        this.bookmarkButton = createElement('button', { id: this.pdfViewer.element.id + '_bookmark', attrs: { 'disabled': 'disabled'} });
        this.bookmarkButton.className = 'e-pv-tbar-btn e-pv-bookmark-button e-btn';
        // tslint:disable-next-line:max-line-length
        let buttonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_bookmark' + '_icon', className: 'e-pv-bookmark-disable-icon e-pv-icon' });
        this.bookmarkButton.appendChild(buttonSpan);
        // tslint:disable-next-line:max-line-length
        let bookMarkTooltip: Tooltip = new Tooltip({ content: this.pdfViewer.localeObj.getConstant('Bookmarks'), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
        bookMarkTooltip.appendTo(this.bookmarkButton);
        this.sideBarToolbar.appendChild(this.thumbnailButton);
        this.sideBarToolbar.appendChild(this.bookmarkButton);
        this.thumbnailButton.addEventListener('click', this.sideToolbarOnClick);
        this.bookmarkButton.addEventListener('click', this.bookmarkButtonOnClick);
    }

    private onTooltipBeforeOpen(args: TooltipEventArgs): void {
        if (!this.pdfViewer.toolbarSettings.showTooltip) {
            args.cancel = true;
        }
    }

    /**
     * @private
     */
    public enableThumbnailButton(): void {
        if (this.thumbnailButton) {
            this.thumbnailButton.removeAttribute('disabled');
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-disable-icon');
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-icon');
        }
    }

    /**
     * @private
     */
    public enableBookmarkButton(): void {
        if (this.bookmarkButton) {
            this.bookmarkButton.removeAttribute('disabled');
            this.bookmarkButton.children[0].classList.remove('e-pv-bookmark-disable-icon');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-icon');
        }
    }

    private createSidebarTitleCloseButton(): void {
        this.closeDiv = createElement('button', { id: this.pdfViewer.element.id + '_close_btn' });
        this.closeDiv.className = 'e-btn e-pv-tbar-btn e-pv-title-close-div e-btn';
        this.closeDiv.style.left = this.closeButtonLeft + 'px';
        // tslint:disable-next-line:max-line-length
        let buttonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_close' + '_icon', className: 'e-pv-title-close-icon e-pv-icon' });
        this.closeDiv.appendChild(buttonSpan);
        this.sideBarTitleContainer.appendChild(this.closeDiv);
        this.closeDiv.addEventListener('click', this.sideToolbarOnClose);
    }

    private createResizeIcon(): void {
        // tslint:disable-next-line:max-line-length
        let resizeIcon: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_resize' , className: 'e-pv-resize-icon e-pv-icon'});
        resizeIcon.style.top = (this.sideBarToolbar.clientHeight) / 2 + 'px';
        resizeIcon.style.position = 'absolute';
        resizeIcon.addEventListener('click', this.sideToolbarOnClose);
        resizeIcon.addEventListener('mouseover', this.resizeIconMouseOver);
        this.sideBarResizer.appendChild(resizeIcon);
    }

    private resizeIconMouseOver = (event: MouseEvent): void => {
        (event.srcElement as HTMLElement).style.cursor = 'default';
    }

    private resizePanelMouseDown = (event: MouseEvent): void => {
        let proxy: NavigationPane = this;
        proxy.offset = [
            proxy.sideBarResizer.offsetLeft - event.clientX,
            proxy.sideBarResizer.offsetTop - event.clientY
        ];
        proxy.isDown = true;
        proxy.isNavigationPaneResized = true;
        proxy.pdfViewerBase.viewerContainer.style.cursor = 'e-resize';
        if (proxy.sideBarContentContainer) {
        proxy.sideBarContentContainer.style.cursor = 'e-resize';
        }
    }

    private resizeViewerMouseLeave = (event: MouseEvent): void => {
        let proxy: NavigationPane = this;
        proxy.isDown = false;
        if (proxy.isNavigationPaneResized && proxy.sideBarContentContainer) {
            proxy.pdfViewerBase.viewerContainer.style.cursor = 'default';
            proxy.sideBarContentContainer.style.cursor = 'default';
            proxy.isNavigationPaneResized = false;
        }
    }
    /**
     * @private
     */
    get outerContainerWidth(): number {
        if (!this.mainContainerWidth) {
            this.mainContainerWidth = this.pdfViewerBase.mainContainer.clientWidth;
        }
        return this.mainContainerWidth;
    }

    /**
     *  @private
     */
    get sideToolbarWidth(): number {
        if (this.sideBarToolbar) {
            return this.sideBarToolbar.clientWidth;
        } else {
            return 0;
        }
    }
    /**
     * @private
     */
    get sideBarContentContainerWidth(): number {
        if (this.sideBarContentContainer) {
            return this.sideBarContentContainer.clientWidth;
        } else {
            return 0;
        }
    }
    private resizePanelMouseMove = (event: MouseEvent): void => {
        let proxy: NavigationPane = this;
        event.preventDefault();
        if (proxy.isDown && this.sideBarContentContainer) {
            // prevent the sidebar from becoming too narrow, or from occupying more
            // than half of the available viewer width.
            let width: number = event.clientX + proxy.offset[0];
            const maxWidth: number = Math.floor(this.outerContainerWidth / 2);
            if (width > maxWidth) {
                width = maxWidth;
                }
            if (width < this.thumbnailWidthMin) {
                width = this.thumbnailWidthMin;
                }
            proxy.sideBarResizer.style.left = width + 'px';
            proxy.closeDiv.style.left = width - proxy.contentContainerScrollWidth + 'px';
            proxy.sideBarContentContainer.style.width = width + 'px';
            proxy.sideBarContent.style.width = width + 'px';
            proxy.sideBarContentSplitter.style.width = width + 'px';
            proxy.sideBarTitleContainer.style.width = width + 'px';
            // tslint:disable-next-line:max-line-length
            proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerLeft() + 'px';
            // tslint:disable-next-line:max-line-length
            let viewerWidth: number = (proxy.pdfViewer.element.clientWidth - proxy.getViewerContainerLeft());
            proxy.pdfViewerBase.viewerContainer.style.width = viewerWidth + 'px';
            proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
            proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
            proxy.pdfViewerBase.updateZoomValue();
        }
    }
    private sideToolbarOnClose = (event: MouseEvent): void => {
        let proxy: NavigationPane = this;
        proxy.removeThumbnailSelectionIconTheme();
        proxy.removeBookmarkSelectionIconTheme();
        proxy.updateViewerContainerOnClose();
    }
    /**
     * @private
     */
    public updateViewerContainerOnClose(): void {
        let proxy: NavigationPane = this;
        if (proxy.sideBarContentContainer) {
        proxy.sideBarContentContainer.style.display = 'none';
        proxy.pdfViewerBase.viewerContainer.style.left = (proxy.sideToolbarWidth) + 'px';
        proxy.pdfViewerBase.viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth - proxy.sideToolbarWidth) + 'px';
        proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
        proxy.pdfViewerBase.updateZoomValue();
        }
    }
    private updateViewerContainerOnExpand(): void {
        let proxy: NavigationPane = this;
        if (proxy.sideBarContentContainer) {
            proxy.sideBarContentContainer.style.display = 'block';
            // tslint:disable-next-line:max-line-length
            proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerLeft() + 'px';
            // tslint:disable-next-line:max-line-length
            proxy.pdfViewerBase.viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth - this.getViewerContainerLeft()) + 'px';
            proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
            proxy.pdfViewerBase.updateZoomValue();
            proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
        }
    }
    /**
     * @private
     */
    public getViewerContainerLeft(): number {
        return  (this.sideToolbarWidth + this.sideBarContentContainerWidth);
    }

    /**
     * @private
     */
    public getViewerMainContainerWidth(): number {
        return this.pdfViewer.element.clientWidth - this.sideToolbarWidth;
    }
    private sideToolbarOnClick = (event: MouseEvent): void => {
        this.sideBarTitle.textContent = this.pdfViewer.localeObj.getConstant('Page Thumbnails');
        let proxy: NavigationPane = this;
        let bookmarkPane: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_bookmark_view');
        if (bookmarkPane) {
            proxy.removeBookmarkSelectionIconTheme();
            bookmarkPane.style.display = 'none';
        }
        document.getElementById(this.pdfViewer.element.id + '_thumbnail_view').style.display = 'flex';
        if (proxy.sideBarContentContainer) {
            if (proxy.sideBarContentContainer.style.display !== 'none') {
                if (proxy.isBookmarkOpen) {
                    proxy.isThumbnailOpen = true;
                    proxy.setThumbnailSelectionIconTheme();
                    this.updateViewerContainerOnExpand();
                } else {
                    proxy.isThumbnailOpen = false;
                    proxy.removeThumbnailSelectionIconTheme();
                    this.updateViewerContainerOnClose();
                }
            } else {
                proxy.isThumbnailOpen = true;
                proxy.setThumbnailSelectionIconTheme();
                this.updateViewerContainerOnExpand();
            }
        }
        proxy.isBookmarkOpen = false;
    }

    private setThumbnailSelectionIconTheme(): void {
        if (this.thumbnailButton) {
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-icon');
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-selection-icon');
            this.thumbnailButton.classList.add('e-pv-thumbnail-view-button-selection');
        }
    }

    private removeThumbnailSelectionIconTheme(): void {
        if (this.thumbnailButton) {
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-icon');
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-selection-icon');
            this.thumbnailButton.classList.remove('e-pv-thumbnail-view-button-selection');
        }
    }

    private resetThumbnailIcon(): void {
        if (this.thumbnailButton) {
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-icon');
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-disable-icon');
        }
    }

    /**
     * @private
     */
    public resetThumbnailView(): void {
        if (this.sideBarContentContainer) {
            this.sideBarContentContainer.style.display = 'none';
            this.pdfViewerBase.viewerContainer.style.left = (this.sideToolbarWidth) + 'px';
            this.pdfViewerBase.viewerContainer.style.width = (this.pdfViewer.element.clientWidth - this.sideToolbarWidth) + 'px';
            this.pdfViewerBase.pageContainer.style.width = this.pdfViewerBase.viewerContainer.clientWidth + 'px';
            this.thumbnailButton.setAttribute('disabled', 'disabled');
            this.removeThumbnailSelectionIconTheme();
            this.resetThumbnailIcon();
        }
    }

    private bookmarkButtonOnClick = (event: MouseEvent): void => {
        let proxy: NavigationPane = this;
        document.getElementById(this.pdfViewer.element.id + '_thumbnail_view').style.display = 'none';
        this.removeThumbnailSelectionIconTheme();
        this.sideBarTitle.textContent = this.pdfViewer.localeObj.getConstant('Bookmarks');
        this.pdfViewer.bookmarkViewModule.renderBookmarkcontent();
        if (this.sideBarContentContainer) {
        if (proxy.sideBarContentContainer.style.display !== 'none') {
            if (this.isThumbnailOpen) {
                this.setBookmarkSelectionIconTheme();
                this.isBookmarkOpen = true;
                this.updateViewerContainerOnExpand();
            } else {
                this.removeBookmarkSelectionIconTheme();
                this.isBookmarkOpen = false;
                this.updateViewerContainerOnClose();
            }
        } else {
            this.setBookmarkSelectionIconTheme();
            this.isBookmarkOpen = true;
            this.updateViewerContainerOnExpand();
        }
        }
        this.isThumbnailOpen = false;
    }

    private setBookmarkSelectionIconTheme(): void {
        if (this.bookmarkButton) {
            this.bookmarkButton.children[0].classList.remove('e-pv-bookmark-icon');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-selection-icon');
            this.bookmarkButton.classList.add('e-pv-bookmark-button-selection');
        }
    }

    private removeBookmarkSelectionIconTheme(): void {
        if (this.bookmarkButton) {
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-icon');
            this.bookmarkButton.children[0].classList.remove('e-pv-bookmark-selection-icon');
            this.bookmarkButton.classList.remove('e-pv-bookmark-button-selection');
        }
    }

    private sideToolbarOnMouseup(event: MouseEvent): void {
        if (event.target === this.sideBarToolbar) {
            this.pdfViewerBase.focusViewerContainer();
        }
    }

    private sideBarTitleOnMouseup(event: MouseEvent): void {
        this.pdfViewerBase.focusViewerContainer();
    }

    /**
     * @private
     */
    public disableBookmarkButton(): void {
        if (this.sideBarContentContainer) {
            this.sideBarContentContainer.style.display = 'none';
            this.bookmarkButton.setAttribute('disabled', 'disabled');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-disable-icon');
        }
    }

    /**
     * @private
     */
    public clear(): void {
        this.removeBookmarkSelectionIconTheme();
        this.removeThumbnailSelectionIconTheme();
    }

    public getModuleName(): string {
        return 'NavigationPane';
    }
}
