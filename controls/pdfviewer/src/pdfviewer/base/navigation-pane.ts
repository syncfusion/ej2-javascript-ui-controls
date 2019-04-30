import { PdfViewer } from '../index';
import { PdfViewerBase } from '../index';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { Toolbar as Tool, ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { Toast, ToastCloseArgs } from '@syncfusion/ej2-notifications';

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
    private resizeIcon: HTMLElement;
    private isDown: boolean;
    private offset: number[];
    private sideBarTitle: HTMLElement;
    private contentContainerScrollWidth: number = 33;
    private closeButtonLeft: number = 170;
    private previousX: number;
    private toolbarElement: HTMLElement;
    private toolbar: Tool;
    private searchInput: HTMLElement;
    private toastObject: Toast;
    private isTooltipCreated: boolean = false;
    private isThumbnail: boolean = false;
    /**
     * @private
     */
    public isNavigationToolbarVisible: boolean = false;
    /**
     * @private
     */
    public isBookmarkListOpen: boolean = false;
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
    /**
     * @private
     */
    public sideBarToolbarSplitter: HTMLElement;
    /**
     * @private
     */
    public isBookmarkOpen: boolean = false;
    /**
     * @private
     */
    public isThumbnailOpen: boolean = false;


    constructor(viewer: PdfViewer, base: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * @private
     */
    public initializeNavigationPane(): void {
        if (!Browser.isDevice) {
            this.createNavigationPane();
        }
    }

    private createNavigationPane(): void {
        // tslint:disable-next-line:max-line-length
        this.sideBarToolbar = createElement('div', { id: this.pdfViewer.element.id + '_sideBarToolbar', className: 'e-pv-sidebar-toolbar', attrs: { 'role': 'toolbar', 'aria-orientation': 'vertical', 'tabindex': '-1' } });
        this.pdfViewerBase.mainContainer.appendChild(this.sideBarToolbar);
        if (this.pdfViewer.enableRtl) {
            this.sideBarToolbar.style.cssFloat = 'right';
            this.sideBarToolbar.style.right = 1 + 'px';
            this.sideBarToolbar.style.position = 'relative';
        }
        // tslint:disable-next-line:max-line-length
        this.sideBarToolbarSplitter = createElement('div', { id: this.pdfViewer.element.id + '_sideBarToolbarSplitter', className: 'e-pv-sidebar-toolbar-splitter' });
        this.pdfViewerBase.mainContainer.appendChild(this.sideBarToolbarSplitter);
        if (this.pdfViewer.enableRtl) {
            this.sideBarToolbarSplitter.classList.add('e-right');
        } else {
            this.sideBarToolbarSplitter.classList.add('e-left');
        }
        // tslint:disable-next-line:max-line-length
        this.sideBarContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContentContainer', className: 'e-pv-sidebar-content-container' });
        if (this.pdfViewer.enableRtl) {
            this.sideBarContentContainer.classList.add('e-right');
        } else {
            this.sideBarContentContainer.classList.add('e-left');
        }
        this.pdfViewerBase.mainContainer.appendChild(this.sideBarContentContainer);
        // tslint:disable-next-line:max-line-length
        this.sideBarContentSplitter = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContentSplitter', className: 'e-pv-sidebar-content-splitter' });
        if (this.pdfViewer.enableRtl) {
            this.sideBarContentSplitter.style.right = 0 + 'px';
        }
        this.sideBarContentContainer.appendChild(this.sideBarContentSplitter);
        // tslint:disable-next-line:max-line-length
        this.sideBarContent = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContent', className: 'e-pv-sidebar-content', attrs: { 'tabindex': '0' } });
        if (this.pdfViewer.enableRtl) {
            this.sideBarContent.style.right = 0 + 'px';
            this.sideBarContent.style.direction = 'rtl';
        }
        this.sideBarContentContainer.appendChild(this.sideBarContent);
        // tslint:disable-next-line:max-line-length
        this.sideBarTitleContainer = createElement('div', { id: this.pdfViewer.element.id + '_sideBarTitleContainer', className: 'e-pv-sidebar-title-container' });
        if (this.pdfViewer.enableRtl) {
            this.sideBarTitleContainer.style.right = 0 + 'px';
        }
        // tslint:disable-next-line:max-line-length
        this.sideBarTitle = createElement('div', { id: this.pdfViewer.element.id + '_sideBarTitle', className: 'e-pv-sidebar-title', attrs: { 'tabindex': '-1' } });
        if (this.pdfViewer.enableRtl) {
            this.sideBarTitle.classList.add('e-right');
        } else {
            this.sideBarTitle.classList.add('e-left');
        }
        this.sideBarTitleContainer.appendChild(this.sideBarTitle);
        this.sideBarContentContainer.appendChild(this.sideBarTitleContainer);
        // tslint:disable-next-line:max-line-length
        this.sideBarResizer = createElement('div', { id: this.pdfViewer.element.id + '_sideBarResizer', className: 'e-pv-sidebar-resizer' });
        this.sideBarResizer.addEventListener('mousedown', this.resizePanelMouseDown);
        this.pdfViewerBase.mainContainer.addEventListener('mousemove', this.resizePanelMouseMove);
        this.pdfViewerBase.mainContainer.addEventListener('mouseup', this.resizeViewerMouseLeave);
        if (this.pdfViewer.enableRtl) {
            this.sideBarResizer.classList.add('e-right');
        } else {
            this.sideBarResizer.classList.add('e-left');
        }
        this.sideBarContentContainer.appendChild(this.sideBarResizer);
        // tslint:disable-next-line:max-line-length
        let controlLeft: number = this.getViewerContainerLeft();
        if (!this.pdfViewer.enableRtl) {
            this.pdfViewerBase.viewerContainer.style.left = controlLeft + 'px';
        }
        this.pdfViewerBase.viewerContainer.style.width = (this.pdfViewer.element.clientWidth - controlLeft) + 'px';
        this.sideBarContentContainer.style.display = 'none';
        this.createSidebarToolBar();
        this.createSidebarTitleCloseButton();
        this.createResizeIcon();
        this.sideBarToolbar.addEventListener('mouseup', this.sideToolbarOnMouseup.bind(this));
        this.sideBarContentContainer.addEventListener('mouseup', this.sideBarTitleOnMouseup.bind(this));
    }

    /**
     * @private
     */
    public adjustPane(): void {
        let splitterElement: HTMLElement = this.pdfViewerBase.getElement('_sideBarToolbarSplitter');
        let toolbarContainer: HTMLElement = this.pdfViewerBase.getElement('_toolbarContainer');
        let toolbarHeight: number = toolbarContainer.getBoundingClientRect().height;
        if (toolbarHeight === 0) {
            // tslint:disable-next-line
            toolbarHeight = parseFloat(window.getComputedStyle(toolbarContainer)['height']) + 1;
        }
        // tslint:disable-next-line:max-line-length
        this.sideBarToolbar.style.top = toolbarHeight + 'px';
        this.sideBarContentContainer.style.top = toolbarHeight + 'px';
        splitterElement.style.top = toolbarHeight + 'px';
    }

    /**
     * @private
     */
    public createNavigationPaneMobile(option: string): void {
        this.isNavigationToolbarVisible = true;
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_navigationToolbar', className: 'e-pv-nav-toolbar' });
        this.pdfViewerBase.viewerMainContainer.insertBefore(this.toolbarElement, this.pdfViewerBase.viewerContainer);
        let items: ItemModel[];
        if (option === 'search') {
            let searchTemplate: string = '<div class="e-input-group e-pv-search-input-mobile" id="' + this.pdfViewer.element.id +
                '_search_input_container"><input class="e-input" type="text" placeholder="' +
                this.pdfViewer.localeObj.getConstant('Find in document') + '" id="' +
                this.pdfViewer.element.id + '_search_input"></input></div>';
            items = [
                // tslint:disable-next-line:max-line-length
                { prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) },
                { template: searchTemplate },
                {
                    prefixIcon: 'e-pv-search-icon e-pv-icon', id: this.pdfViewer.element.id + '_search_box-icon',
                    click: () => {
                        let iconElement: HTMLElement = this.pdfViewerBase.getElement('_search_box-icon').firstElementChild as HTMLElement;
                        if (iconElement.classList.contains('e-pv-search-close')) {
                            this.enableSearchItems(false);
                        }
                        this.pdfViewer.textSearchModule.searchButtonClick(iconElement, this.searchInput);
                    }
                },
                {
                    prefixIcon: 'e-pv-prev-search-icon e-pv-icon', id: this.pdfViewer.element.id + '_prev_occurrence',
                    click: (args: ClickEventArgs) => {
                        this.pdfViewer.textSearchModule.searchPrevious();
                    }
                },
                {
                    prefixIcon: 'e-pv-next-search-icon e-pv-icon', id: this.pdfViewer.element.id + '_next_occurrence',
                    click: (args: ClickEventArgs) => {
                        this.pdfViewer.textSearchModule.searchNext();
                    }
                }
            ];
        } else {
            items = [
                // tslint:disable-next-line:max-line-length
                { prefixIcon: 'e-pv-backward-icon e-pv-icon', id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) },
                { text: this.pdfViewer.localeObj.getConstant('Bookmarks') }
            ];
        }
        this.toolbar = new Tool({ items: items, width: '', height: '', overflowMode: 'Popup' });
        if (this.pdfViewer.enableRtl) {
            this.toolbar.enableRtl = true;
        }
        this.toolbar.appendTo(this.toolbarElement);
        if (option === 'search') {
            this.initiateSearchBox();
        } else {
            this.initiateBookmarks();
        }
    }

    private initiateSearchBox(): void {
        this.searchInput = this.pdfViewerBase.getElement('_search_input');
        this.pdfViewer.textSearchModule.searchBtn = this.pdfViewerBase.getElement('_search_box-icon').firstElementChild as HTMLElement;
        this.searchInput.addEventListener('keyup', (event: KeyboardEvent) => {
            this.enableSearchItems(true);
            let searchString: string = (this.searchInput as HTMLInputElement).value;
            if (event.which === 13) {
                this.initiateTextSearch();
            } else {
                this.pdfViewer.textSearchModule.resetVariables();
            }
        });
        this.pdfViewer.textSearchModule.searchInput = this.searchInput;
        this.setSearchInputWidth();
        this.enableSearchItems(false);
        this.searchInput.focus();
    }

    private enableSearchItems(isEnable: boolean): void {
        this.toolbar.enableItems(this.pdfViewerBase.getElement('_prev_occurrence').parentElement, isEnable);
        this.toolbar.enableItems(this.pdfViewerBase.getElement('_next_occurrence').parentElement, isEnable);
    }

    private initiateBookmarks(): void {
        if (Browser.isDevice) {
            this.pdfViewerBase.mobileScrollerContainer.style.display = 'none';
        }
        // tslint:disable-next-line:max-line-length
        let bookmarkContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_bookmarks_container', className: 'e-pv-bookmark-container' });
        bookmarkContainer.style.width = '100%';
        bookmarkContainer.style.height = this.pdfViewerBase.viewerContainer.style.height;
        this.pdfViewerBase.getElement('_viewerMainContainer').appendChild(bookmarkContainer);
        this.pdfViewerBase.viewerContainer.style.display = 'none';
        this.isBookmarkListOpen = true;
        this.pdfViewer.bookmarkViewModule.renderBookmarkContentMobile();
    }

    private initiateTextSearch(): void {
        let inputString: string = (this.searchInput as HTMLInputElement).value;
        this.pdfViewer.textSearchModule.initiateSearch(inputString);
    }

    /**
     * @private
     */
    public goBackToToolbar(): void {
        this.isNavigationToolbarVisible = false;
        this.pdfViewer.textSearchModule.cancelTextSearch();
        this.searchInput = null;
        if (this.pdfViewer.bookmarkViewModule.childNavigateCount !== 0) {
            this.pdfViewer.bookmarkViewModule.bookmarkList.back();
            this.pdfViewer.bookmarkViewModule.childNavigateCount--;
        } else {
            if (this.toolbar != null) {
                this.toolbar.destroy();
                this.toolbar = null;
            }
            let bookmarkContainer: HTMLElement = this.pdfViewerBase.getElement('_bookmarks_container');
            if (bookmarkContainer) {
                bookmarkContainer.parentElement.removeChild(bookmarkContainer);
                if (Browser.isDevice) {
                    this.pdfViewerBase.mobileScrollerContainer.style.display = '';
                }
            }
            if (this.toolbarElement && this.toolbarElement.parentElement != null) {
                this.toolbarElement.parentElement.removeChild(this.toolbarElement);
            }
            this.pdfViewerBase.viewerContainer.style.display = 'block';
            this.isBookmarkListOpen = false;
            if (!this.pdfViewer.toolbar.annotationToolbarModule.isMobileAnnotEnabled) {
                this.pdfViewer.toolbarModule.showToolbar(true);
                this.pdfViewerBase.onWindowResize();
            }
        }
    }

    private setSearchInputWidth(): void {
        let searchInputParent: HTMLElement = this.searchInput.parentElement;
        let padding: string = window.getComputedStyle(searchInputParent.parentElement, null).getPropertyValue('padding-left');
        // tslint:disable-next-line:max-line-length
        let width: number = this.toolbarElement.clientWidth - this.getParentElementSearchBox('_backward').clientWidth
            - this.getParentElementSearchBox('_search_box-icon').clientWidth - this.getParentElementSearchBox('_prev_occurrence').clientWidth
            - this.getParentElementSearchBox('_next_occurrence').clientWidth - 6;
        if (padding !== '') {
            width = width - (parseFloat(padding) * 2);
        }
        searchInputParent.style.width = width + 'px';
    }

    private getParentElementSearchBox(idString: string): HTMLElement {
        return this.pdfViewerBase.getElement(idString).parentElement;
    }

    /**
     * @private
     */
    public createTooltipMobile(text: string): void {
        if (!this.isTooltipCreated) { //boolean to prevent again toast creation.
            // tslint:disable-next-line:max-line-length
            let tooltipDiv: HTMLElement = createElement('div', { className: 'e-pv-container-tooltip', id: this.pdfViewer.element.id + '_container_tooltip' });
            this.pdfViewer.element.appendChild(tooltipDiv);
            // tslint:disable-next-line:max-line-length
            this.toastObject = new Toast({ title: text, target: this.pdfViewer.element, close: this.onTooltipClose.bind(this), position: { X: 0, Y: 0 }, animation: { hide: { duration: 200, effect: 'FadeOut' } } });
            this.toastObject.appendTo(tooltipDiv);
            let y: number = this.pdfViewer.element.clientHeight * 0.65;
            let x: number = (this.pdfViewer.element.clientWidth - tooltipDiv.clientWidth) / 2;
            this.isTooltipCreated = true;
            this.toastObject.show({ position: { X: x, Y: y } });
            let tooltipChild: HTMLElement = tooltipDiv.firstElementChild as HTMLElement;
            if (tooltipChild) {
                tooltipChild.style.width = 'auto';
            }
        } else {
            if (this.toastObject) {
                this.toastObject.title = text;
                let tooltipElement: HTMLElement = this.pdfViewerBase.getElement('_container_tooltip');
                let tooltipChild: HTMLElement = tooltipElement.firstElementChild as HTMLElement;
                if (tooltipChild) {
                    tooltipChild.style.width = 'auto';
                    tooltipChild.firstElementChild.firstElementChild.textContent = text;
                }
            }
        }
    }

    private onTooltipClose(args: ToastCloseArgs): void {
        this.isTooltipCreated = false;
        let tooltipElement: HTMLElement = this.pdfViewerBase.getElement('_container_tooltip');
        this.pdfViewer.textSearchModule.isMessagePopupOpened = false;
        this.toastObject.destroy();
        tooltipElement.parentElement.removeChild(tooltipElement);
        this.toastObject = null;
    }

    /**
     * @private
     */
    public toolbarResize(): void {
        if (this.searchInput) {
            this.searchInput.style.width = 'auto';
            this.setSearchInputWidth();
        }
    }

    private createSidebarToolBar(): void {
        // tslint:disable-next-line:max-line-length
        this.thumbnailButton = createElement('button', { id: this.pdfViewer.element.id + '_thumbnail-view', attrs: { 'disabled': 'disabled', 'aria-label': 'Page Thumbnails', 'tabindex': '-1' } });
        this.thumbnailButton.className = 'e-pv-tbar-btn e-pv-thumbnail-view-button e-btn';
        // tslint:disable-next-line:max-line-length
        let thumbnailButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_thumbnail-view' + '_icon', className: 'e-pv-thumbnail-view-disable-icon e-pv-icon' });
        this.thumbnailButton.appendChild(thumbnailButtonSpan);
        // tslint:disable-next-line:max-line-length
        let thumbnailTooltip: Tooltip = new Tooltip({ content: this.pdfViewer.localeObj.getConstant('Page Thumbnails'), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
        thumbnailTooltip.appendTo(this.thumbnailButton);
        // tslint:disable-next-line:max-line-length
        this.bookmarkButton = createElement('button', { id: this.pdfViewer.element.id + '_bookmark', attrs: { 'disabled': 'disabled', 'aria-label': 'Bookmarks', 'tabindex': '-1' } });
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
        if (this.pdfViewer.enableRtl) {
            this.closeDiv.style.left = 8 + 'px';
        } else {
            this.closeDiv.style.left = this.closeButtonLeft + 'px';
        }
        // tslint:disable-next-line:max-line-length
        let buttonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_close' + '_icon', className: 'e-pv-title-close-icon e-pv-icon' });
        this.closeDiv.appendChild(buttonSpan);
        this.sideBarTitleContainer.appendChild(this.closeDiv);
        this.closeDiv.addEventListener('click', this.sideToolbarOnClose);
    }

    private createResizeIcon(): void {
        // tslint:disable-next-line:max-line-length
        this.resizeIcon = createElement('div', { id: this.pdfViewer.element.id + '_resize', className: 'e-pv-resize-icon e-pv-icon' });
        this.setResizeIconTop();
        this.resizeIcon.style.position = 'absolute';
        this.resizeIcon.addEventListener('click', this.sideToolbarOnClose);
        this.resizeIcon.addEventListener('mouseover', this.resizeIconMouseOver);
        this.sideBarResizer.appendChild(this.resizeIcon);
    }

    /**
     * @private
     */
    public setResizeIconTop(): void {
        // tslint:disable-next-line:max-line-length
        if (this.sideBarToolbar && this.sideBarToolbar.clientHeight && this.resizeIcon.style.top === '') {
            this.resizeIcon.style.top = (this.sideBarToolbar.clientHeight) / 2 + 'px';
        }
    }

    private resizeIconMouseOver = (event: MouseEvent): void => {
        (event.srcElement as HTMLElement).style.cursor = 'default';
    }

    private resizePanelMouseDown = (event: MouseEvent): void => {
        let proxy: NavigationPane = this;
        proxy.offset = [
            proxy.sideBarResizer.offsetLeft - event.clientX,
            proxy.sideBarResizer.offsetTop - event.clientY,
            proxy.sideBarResizer.offsetParent.clientWidth
        ];
        this.previousX = event.clientX;
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
        if (!this.pdfViewerBase.getPopupNoteVisibleStatus()) {
        event.preventDefault();
        if (proxy.isDown && this.sideBarContentContainer) {
            // prevent the sidebar from becoming too narrow, or from occupying more
            // than half of the available viewer width.
            if (this.pdfViewer.enableRtl) {
                let currentWidth: number = this.previousX - event.clientX;
                let width: number = currentWidth + proxy.offset[2];
                const maxWidth: number = Math.floor(this.outerContainerWidth / 2);
                if (width > maxWidth) {
                    width = maxWidth;
                }
                if (width < this.thumbnailWidthMin) {
                    width = this.thumbnailWidthMin;
                }
                proxy.sideBarResizer.style.right = width + 'px';
                proxy.sideBarContentContainer.style.width = width + 'px';
                proxy.sideBarContent.style.width = width + 'px';
                proxy.sideBarContentSplitter.style.width = width + 'px';
                proxy.sideBarTitleContainer.style.width = width + 'px';
                // tslint:disable-next-line:max-line-length
                proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerLeft() + 'px';

            } else {
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
            }
            // tslint:disable-next-line:max-line-length
            let viewerWidth: number = (proxy.pdfViewer.element.clientWidth - proxy.getViewerContainerLeft());
            proxy.pdfViewerBase.viewerContainer.style.width = viewerWidth + 'px';
            proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
            proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
            proxy.pdfViewerBase.updateZoomValue();
            if (!proxy.bookmarkButton.children[0].classList.contains('e-pv-bookmark-disable-icon')) {
                proxy.pdfViewer.bookmarkViewModule.setBookmarkContentHeight();
            }
        }
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
            if (this.pdfViewer.enableRtl) {
                proxy.pdfViewerBase.viewerContainer.style.right = (proxy.sideToolbarWidth) + 'px';
            } else {
                proxy.pdfViewerBase.viewerContainer.style.left = (proxy.sideToolbarWidth) + 'px';
            }
            proxy.pdfViewerBase.viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth - proxy.sideToolbarWidth) + 'px';
            proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
            proxy.pdfViewerBase.updateZoomValue();
        }
    }
    private updateViewerContainerOnExpand(): void {
        let proxy: NavigationPane = this;
        if (proxy.sideBarContentContainer) {
            proxy.sideBarContentContainer.style.display = 'block';
            if (this.pdfViewer.enableRtl) {
                // tslint:disable-next-line:max-line-length
                proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerLeft() + 'px';
            } else {
                // tslint:disable-next-line:max-line-length
                proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerLeft() + 'px';
            }
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
        return (this.sideToolbarWidth + this.sideBarContentContainerWidth);
    }

    /**
     * @private
     */
    public getViewerMainContainerWidth(): number {
        return this.pdfViewer.element.clientWidth - this.sideToolbarWidth;
    }
    private sideToolbarOnClick = (event: MouseEvent): void => {
        this.sideBarTitle.textContent = this.pdfViewer.localeObj.getConstant('Page Thumbnails');
        this.sideBarContent.setAttribute('aria-label', 'Thumbnail View Panel');
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
                this.sideBarContent.focus();
                proxy.isThumbnailOpen = true;
                proxy.setThumbnailSelectionIconTheme();
                this.updateViewerContainerOnExpand();
            }
        }
        proxy.isBookmarkOpen = false;
    }

    /**
     * @private
     */
    public openThumbnailPane = (): void => {
        let proxy: NavigationPane = this;
        let sideBarContent: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_sideBarContent');
        let sideBarContentContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_sideBarContentContainer');
        let viewerContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_viewerContainer');
        let pageContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageViewContainer');
        document.getElementById(this.pdfViewer.element.id + '_thumbnail_view').style.display = 'block';
        document.getElementById(this.pdfViewer.element.id + '_sideBarResizer').style.display = 'none';
        document.getElementById(this.pdfViewer.element.id + '_sideBarTitleContainer').style.display = 'none';
        document.getElementById(this.pdfViewer.element.id + '_sideBarContentSplitter').style.display = 'none';
        sideBarContent.classList.add('e-thumbnail');
        sideBarContentContainer.classList.add('e-thumbnail');
        if (sideBarContentContainer) {
            if (proxy.isThumbnail) {
                sideBarContentContainer.style.display = 'none';
                viewerContainer.style.width = proxy.pdfViewer.element.clientWidth + 'px';
                pageContainer.style.width = viewerContainer.clientWidth + 'px';
                viewerContainer.style.left = sideBarContentContainer.clientWidth + 'px';
                proxy.pdfViewerBase.updateZoomValue();
                proxy.isThumbnail = false;
            } else {
                sideBarContent.focus();
                sideBarContentContainer.style.display = 'block';
                // tslint:disable-next-line:max-line-length
                viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth - sideBarContentContainer.clientWidth) + 'px';
                pageContainer.style.width = viewerContainer.clientWidth + 'px';
                viewerContainer.style.left = (sideBarContentContainer.clientWidth) + 'px';
                proxy.pdfViewerBase.updateZoomValue();
                proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
                proxy.isThumbnail = true;
            }
        }
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
            if (this.pdfViewer.enableRtl) {
                this.pdfViewerBase.viewerContainer.style.left = 1 + 'px';
            } else {
                this.pdfViewerBase.viewerContainer.style.left = (this.sideToolbarWidth) + 'px';
            }
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
        this.sideBarContent.setAttribute('aria-label', 'Bookmark View Panel');
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
                this.sideBarContent.focus();
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
