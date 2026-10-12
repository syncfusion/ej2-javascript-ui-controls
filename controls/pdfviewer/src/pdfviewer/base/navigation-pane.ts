import { AnnotationDataFormat, CommentFilterSettings, PdfViewer } from '../index';
import { PdfViewerBase } from '../index';
import { createElement, Browser, isBlazor, initializeCSPTemplate, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Toolbar as Tool, ItemModel, ClickEventArgs, MenuItemModel, ContextMenu as Context } from '@syncfusion/ej2-navigations';
import { Tooltip, TooltipEventArgs, Dialog } from '@syncfusion/ej2-popups';
import { Toast, ToastCloseArgs } from '@syncfusion/ej2-notifications';
import { MultiSelect, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
import { _decode } from '@syncfusion/ej2-pdf';
MultiSelect.Inject(CheckBoxSelection);

/**
 * The `NavigationPane` module is used to handle navigation pane for thumbnail and bookmark navigation of PDF viewer.
 *
 * @param {args} args - args
 * @returns {void}
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
    private contentContainerScrollWidth: number = 33;
    private closeButtonLeft: number = 170;
    private previousX: number;
    private toolbarElement: HTMLElement;
    private toolbar: Tool;
    private searchInput: HTMLElement;
    private toastObject: Toast;
    private isTooltipCreated: boolean = false;
    private annotationInputElement: HTMLElement;
    private annotationXFdfInputElement: HTMLElement;
    private annotationContextMenu: MenuItemModel[] = [];
    private isCommentPanelShow: boolean = false;
    private commentPanelWidthMin: number = 300;
    private commentPanelResizeIcon: HTMLElement;
    private filterMultiSelectInstances: { [key: string]: MultiSelect } = {};
    private includeRepliesCheckbox: HTMLElement;
    private filterDocumentCheckbox: HTMLElement;
    private commentFilterPanel: HTMLElement;
    /**
     * @private
     */
    public isThumbnail: boolean = false;
    /**
     * @private
     */
    public isThumbnailAddedProgrammatically: boolean = false;
    /**
     * @private
     */
    public isBookmarkOpenProgrammatically : boolean = false;
    /**
     * @private
     */
    public sideBarTitle: HTMLElement;
    /**
     * @private
     */
    public annotationMenuObj: Context;
    /**
     * @private
     */
    public commentFilterDialog: Dialog;
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
    /**
     * @private
     */
    public commentPanelContainer: HTMLElement;
    /**
     * @private
     */
    public commentsContentContainer: HTMLElement;
    /**
     * @private
     */
    public accordionContentContainer: HTMLElement;
    /**
     * @private
     */
    public commentPanelResizer: HTMLElement;
    /**
     * @private
     */
    public restrictUpdateZoomValue: boolean = true;
    /**
     * @private
     */
    public organizePageButton: HTMLElement;

    /**
     * Initialize the constructor of navigationPane.
     *
     * @param { PdfViewer } viewer - Specified PdfViewer class.
     * @param { PdfViewerBase } base - The pdfViewerBase.
     */
    constructor(viewer: PdfViewer, base: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * @private
     * @returns {void}
     */
    public initializeNavigationPane(): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.createNavigationPane();
        } else {
            this.commentPanelContainer = createElement('div', { id: this.pdfViewer.element.id + '_commantPanel', className: 'e-pv-mobile-comments-container' });
            this.pdfViewerBase.mainContainer.appendChild(this.commentPanelContainer);
            if (this.pdfViewer.enableRtl) {
                this.commentPanelContainer.style.left = 0 + 'px';
            } else {
                this.commentPanelContainer.style.right = 0 + 'px';
            }
            this.commentPanelContainer.style.bottom = 0 + 'px';
            this.createCommentPanelTitleContainer();
            this.commentPanelContainer.style.display = 'none';
            this.commentsContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_commentscontentcontainer', className: 'e-pv-comments-content-container' });
            this.commentPanelContainer.appendChild(this.commentsContentContainer);
            this.createFileElement(this.commentPanelContainer);
            this.createXFdfFileElement(this.commentPanelContainer);
        }
    }

    /**
     * @private
     * Update navigation pane layout for RTL dynamically.
     * @param {boolean} enable - true to enable RTL, false to disable
     * @returns {void}
     */
    public updateRtl(enable: boolean): void {
        if (this.sideBarToolbar) {
            this.sideBarToolbar.style.cssFloat = enable ? 'right' : '';
            if (enable) {
                this.sideBarToolbar.style.right = '1px';
                this.sideBarToolbar.style.position = 'relative';
            } else {
                this.sideBarToolbar.style.right = '';
                this.sideBarToolbar.style.position = '';
            }
            const bookmarkView: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_bookmark_view');
            if (bookmarkView) {
                bookmarkView.classList.remove('e-rtl');
                bookmarkView.classList.remove('e-ltr');
                bookmarkView.classList.add(enable ? 'e-rtl' : 'e-ltr');
            }
        }
        if (this.sideBarToolbarSplitter) {
            this.sideBarToolbarSplitter.classList.remove(enable ? 'e-left' : 'e-right');
            this.sideBarToolbarSplitter.classList.add(enable ? 'e-right' : 'e-left');
        }
        if (this.sideBarContentContainer) {
            this.sideBarContentContainer.classList.remove(enable ? 'e-left' : 'e-right');
            this.sideBarContentContainer.classList.add(enable ? 'e-right' : 'e-left');
            if (this.sideBarContentSplitter) {
                this.sideBarContentSplitter.style.right = enable ? '0px' : '';
            }
        }
        if (this.sideBarContent) {
            this.sideBarContent.style.right = enable ? '0px' : '';
            this.sideBarContent.style.direction = enable ? 'rtl' : 'ltr';
        }
        if (this.sideBarTitleContainer) {
            this.sideBarTitleContainer.style.right = enable ? '0px' : '';
        }
        if (this.sideBarTitle) {
            this.sideBarTitle.classList.remove(enable ? 'e-left' : 'e-right');
            this.sideBarTitle.classList.add(enable ? 'e-right' : 'e-left');
        }
        if (this.sideBarResizer) {
            this.sideBarResizer.classList.remove(enable ? 'e-left' : 'e-right');
            this.sideBarResizer.classList.add(enable ? 'e-right' : 'e-left');
            if (enable) {
                this.sideBarResizer.style.left = '';
                this.sideBarResizer.style.right = this.sideBarTitleContainer.style.width;
            }
            else {
                this.sideBarResizer.style.right = '';
                this.sideBarResizer.style.left = this.sideBarTitleContainer.style.width;
            }
        }
        // Comment panel positioning
        if (this.commentPanelContainer) {
            if (enable) {
                this.commentPanelContainer.style.left = '0px';
                this.commentPanelContainer.style.right = '';
            } else {
                this.commentPanelContainer.style.right = '0px';
                this.commentPanelContainer.style.left = '';
            }
        }
        if (this.commentPanelResizer) {
            this.commentPanelResizer.classList.remove(enable ? 'e-right' : 'e-left');
            this.commentPanelResizer.classList.add(enable ? 'e-left' : 'e-right');
            if (enable) {
                this.commentPanelResizer.style.left = this.commentPanelContainer.style.width;
                this.commentPanelResizer.style.right = '';
            } else {
                this.commentPanelResizer.style.right = this.commentPanelContainer.style.width;
                this.commentPanelResizer.style.left = '';
            }
        }
        // Close button position
        if (this.closeDiv) {
            if (enable) {
                this.closeDiv.style.left = '8px';
                this.closeDiv.style.right = '';
            } else {
                // Position close button similar to initial creation: consider current sidebar width
                if (this.sideBarContentContainer && this.sideBarContentContainer.clientWidth) {
                    const leftPos: number = this.sideBarContentContainer.clientWidth - this.contentContainerScrollWidth;
                    this.closeDiv.style.left = leftPos + 'px';
                } else {
                    this.closeDiv.style.left = this.closeButtonLeft + 'px';
                }
                this.closeDiv.style.right = '';
            }
        }
        // Update EJ2 components
        if (this.annotationMenuObj) {
            this.annotationMenuObj.enableRtl = enable;
        }
        if (this.toolbar) {
            this.toolbar.enableRtl = enable;
        }
        // Update viewer container positions
        if (this.pdfViewerBase && this.pdfViewerBase.viewerContainer) {
            if (enable) {
                this.pdfViewerBase.viewerContainer.style.right = this.getViewerContainerLeft() + 'px';
                this.pdfViewerBase.viewerContainer.style.left = this.getViewerContainerRight() + 'px';
            } else {
                this.pdfViewerBase.viewerContainer.style.left = this.getViewerContainerLeft() + 'px';
                this.pdfViewerBase.viewerContainer.style.right = this.getViewerContainerRight() + 'px';
            }
            this.pdfViewerBase.viewerContainer.style.width = ((this.pdfViewer.element.clientWidth > 0 ? this.pdfViewer.element.clientWidth : this.pdfViewer.element.offsetWidth) - this.getViewerContainerLeft() - this.getViewerContainerRight()) + 'px';
            if (this.pdfViewerBase.pageContainer) {
                this.pdfViewerBase.pageContainer.style.width = this.pdfViewerBase.viewerContainer.clientWidth + 'px';
            }
        }
        if (this.pdfViewer.toolbarModule &&
            this.pdfViewer.toolbarModule.annotationToolbarModule && this.pdfViewer.isAnnotationToolbarVisible) {
            this.pdfViewer.toolbarModule.annotationToolbarModule.adjustViewer(true);
        }
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.formDesignerToolbarModule &&
            this.pdfViewer.isFormDesignerToolbarVisible) {
            this.pdfViewer.toolbarModule.formDesignerToolbarModule.adjustViewer(true);
        }
    }

    private createNavigationPane(): void {
        const isblazor: boolean = isBlazor();
        if (!isblazor) {
            this.sideBarToolbar = createElement('div', { id: this.pdfViewer.element.id + '_sideBarToolbar', className: 'e-pv-sidebar-toolbar', attrs: { 'role': 'toolbar', 'aria-orientation': 'vertical', 'tabindex': '-1', 'aria-label': 'Sidebar Toolbar'} });
            this.sideBarToolbarSplitter = createElement('div', { id: this.pdfViewer.element.id + '_sideBarToolbarSplitter', className: 'e-pv-sidebar-toolbar-splitter' });
            this.sideBarContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContentContainer', className: 'e-pv-sidebar-content-container' });
            this.sideBarContentSplitter = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContentSplitter', className: 'e-pv-sidebar-content-splitter' });
            this.sideBarContent = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContent', className: 'e-pv-sidebar-content'});
            this.sideBarTitleContainer = createElement('div', { id: this.pdfViewer.element.id + '_sideBarTitleContainer', className: 'e-pv-sidebar-title-container' });
            this.sideBarTitle = createElement('div', { id: this.pdfViewer.element.id + '_sideBarTitle', className: 'e-pv-sidebar-title', attrs: { 'tabindex': '-1' } });
            this.sideBarResizer = createElement('div', { id: this.pdfViewer.element.id + '_sideBarResizer', className: 'e-pv-sidebar-resizer' });
        } else {
            this.sideBarToolbar = this.pdfViewer.element.querySelector('.e-pv-sidebar-toolbar');
            this.sideBarToolbarSplitter = this.pdfViewer.element.querySelector('.e-pv-sidebar-toolbar-splitter');
            this.sideBarContentContainer = this.pdfViewer.element.querySelector('.e-pv-sidebar-content-container');
            this.sideBarContentSplitter = this.pdfViewer.element.querySelector('.e-pv-sidebar-content-splitter');
            this.sideBarContent = this.pdfViewer.element.querySelector('.e-pv-sidebar-content');
            this.sideBarTitleContainer = this.pdfViewer.element.querySelector('.e-pv-sidebar-title-container');
            this.sideBarTitle = this.pdfViewer.element.querySelector('.e-pv-sidebar-title');
            this.sideBarResizer = this.pdfViewer.element.querySelector('.e-pv-sidebar-resizer');
        }
        if (this.sideBarContent) {
            (this.sideBarContent as HTMLElement).tabIndex = 0;
        }
        this.pdfViewerBase.mainContainer.appendChild(this.sideBarToolbar);
        if (this.pdfViewer.enableRtl) {
            this.sideBarToolbar.style.cssFloat = 'right';
            this.sideBarToolbar.style.right = 1 + 'px';
            this.sideBarToolbar.style.position = 'relative';
        }
        this.pdfViewerBase.mainContainer.appendChild(this.sideBarToolbarSplitter);
        if (this.pdfViewer.enableRtl) {
            this.sideBarToolbarSplitter.classList.add('e-right');
        } else {
            this.sideBarToolbarSplitter.classList.add('e-left');
        }
        if (this.pdfViewer.enableRtl) {
            this.sideBarContentContainer.classList.add('e-right');
        } else {
            this.sideBarContentContainer.classList.add('e-left');
        }
        this.pdfViewerBase.mainContainer.appendChild(this.sideBarContentContainer);
        if (this.pdfViewer.enableRtl) {
            this.sideBarContentSplitter.style.right = 0 + 'px';
        }
        this.sideBarContentContainer.appendChild(this.sideBarContentSplitter);
        if (this.pdfViewer.enableRtl) {
            this.sideBarContent.style.right = 0 + 'px';
            this.sideBarContent.style.direction = 'rtl';
        }
        this.sideBarContentContainer.appendChild(this.sideBarContent);
        if (this.pdfViewer.enableRtl) {
            this.sideBarTitleContainer.style.right = 0 + 'px';
        }
        if (this.pdfViewer.enableRtl) {
            this.sideBarTitle.classList.add('e-right');
        } else {
            this.sideBarTitle.classList.add('e-left');
        }
        this.sideBarTitleContainer.appendChild(this.sideBarTitle);
        this.sideBarContentContainer.appendChild(this.sideBarTitleContainer);

        this.sideBarResizer.addEventListener('mousedown', this.resizePanelMouseDown);
        this.pdfViewerBase.mainContainer.addEventListener('mousemove', this.resizePanelMouseMove);
        this.pdfViewerBase.mainContainer.addEventListener('mouseup', this.resizeViewerMouseLeave);
        if (this.pdfViewer.enableRtl) {
            this.sideBarResizer.classList.add('e-right');
        } else {
            this.sideBarResizer.classList.add('e-left');
        }
        this.sideBarContentContainer.appendChild(this.sideBarResizer);
        this.createCommentPanel();
        const controlLeft: number = this.getViewerContainerLeft();
        const controlRight: number = this.getViewerContainerRight();
        if (!this.pdfViewer.enableRtl) {
            this.pdfViewerBase.viewerContainer.style.left = controlLeft + 'px';
            this.pdfViewerBase.viewerContainer.style.right = controlRight + 'px';
        }
        this.pdfViewerBase.viewerContainer.style.width = ((this.pdfViewer.element.clientWidth > 0 ? this.pdfViewer.element.clientWidth : this.pdfViewer.element.offsetWidth) - controlLeft - this.commentPanelContainer.clientWidth) + 'px';
        this.sideBarContentContainer.style.display = 'none';
        if (!this.pdfViewer.enableNavigationToolbar) {
            if (!this.pdfViewer.enableRtl) {
                this.sideBarContentContainer.style.left = '0px';
            }
            else {
                this.sideBarContentContainer.style.right = '0px';
            }
        }
        this.createSidebarToolBar();
        this.createSidebarTitleCloseButton();
        this.createResizeIcon();
        this.sideBarToolbar.addEventListener('mouseup', this.sideToolbarOnMouseup.bind(this));
        this.sideBarContentContainer.addEventListener('mouseup', this.sideBarTitleOnMouseup.bind(this));
    }

    /**
     * @private
     * @returns {void}
     */
    public showBookmarksPaneMobile(): void {
        if (this.isBookmarkOpenProgrammatically || this.isBookmarkOpen || this.isBookmarkListOpen) {
            return;
        }
        if (this.pdfViewer.toolbar) {
            this.pdfViewer.toolbar.showToolbar(false);
        }
        this.createNavigationPaneMobile('bookmarks');
        this.isBookmarkOpen = true;
        this.isBookmarkOpenProgrammatically = true;
        this.pdfViewer.isBookmarkPanelOpen = true;
    }

    /**
     * @private
     * @returns {void}
     */
    public adjustPane(): void {
        if (isBlazor()) {
            const splitterElement: HTMLElement = this.pdfViewer.element.querySelector('.e-pv-sidebar-toolbar-splitter');
            const sideToolbarElement: HTMLElement = this.pdfViewer.element.querySelector('.e-pv-sidebar-toolbar');
            const sideToolbarContent: HTMLElement = this.pdfViewer.element.querySelector('.e-pv-sidebar-content-container');
            const toolbarContainer: HTMLElement = this.pdfViewer.element.querySelector('.e-pv-toolbar');
            let toolbarHeight: number = toolbarContainer.getBoundingClientRect().height;
            if (toolbarHeight === 0) {
                toolbarHeight = parseFloat(window.getComputedStyle(toolbarContainer)['height']) + 1;
            }
            if (!this.pdfViewer.enableToolbar) {
                toolbarHeight = 0;
            }
            sideToolbarElement.style.top = toolbarHeight + 'px';
            sideToolbarContent.style.top = toolbarHeight + 'px';
            splitterElement.style.top = toolbarHeight + 'px';
            sideToolbarElement.style.height = this.getSideToolbarHeight(toolbarHeight);
            sideToolbarContent.style.height = this.getSideToolbarHeight(toolbarHeight);
            splitterElement.style.height = this.getSideToolbarHeight(toolbarHeight);
            this.pdfViewerBase.viewerContainer.style.height = this.getSideToolbarHeight(toolbarHeight);
        } else {
            const splitterElement: HTMLElement = this.pdfViewerBase.getElement('_sideBarToolbarSplitter');
            const toolbarContainer: HTMLElement = this.pdfViewerBase.getElement('_toolbarContainer');
            let toolbarHeight: number = toolbarContainer.clientHeight;
            if (toolbarHeight === 0) {
                toolbarHeight = parseFloat(window.getComputedStyle(toolbarContainer)['height']) + 1;
            }
            this.sideBarToolbar.style.top = toolbarHeight + 'px';
            this.sideBarContentContainer.style.top = toolbarHeight + 'px';
            splitterElement.style.top = toolbarHeight + 'px';
        }
    }

    private getSideToolbarHeight(toolbarHeight: number): string {
        const height: number = this.pdfViewer.element.getBoundingClientRect().height;
        return (height !== 0) ? height - toolbarHeight + 'px' : '';
    }

    private createCommentPanel(): void {
        this.commentPanelContainer = createElement('div', { id: this.pdfViewer.element.id + '_commantPanel', className: 'e-pv-comment-panel' });
        this.pdfViewerBase.mainContainer.appendChild(this.commentPanelContainer);
        if (this.pdfViewer.enableRtl) {
            this.commentPanelContainer.style.left = 0 + 'px';
        } else {
            this.commentPanelContainer.style.right = 0 + 'px';
        }
        this.commentPanelContainer.style.bottom = 0 + 'px';
        this.createCommentPanelTitleContainer();
        this.commentPanelContainer.style.display = 'none';
        this.commentsContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_commentscontentcontainer', className: 'e-pv-comments-content-container' });
        this.commentPanelContainer.appendChild(this.commentsContentContainer);
        this.commentPanelResizer = createElement('div', { id: this.pdfViewer.element.id + '_commentPanelResizer', className: 'e-pv-comment-panel-resizer' });
        if (this.pdfViewer.enableRtl) {
            this.commentPanelResizer.classList.add('e-left');
        } else {
            this.commentPanelResizer.classList.add('e-right');
        }
        this.commentPanelResizer.style.display = 'none';
        this.commentPanelResizer.addEventListener('mousedown', this.commentPanelMouseDown);
        this.pdfViewerBase.mainContainer.appendChild(this.commentPanelResizer);
        this.createCommentPanelResizeIcon();
        this.createFileElement(this.commentPanelContainer);
        this.createXFdfFileElement(this.commentPanelContainer);
    }

    private createCommentPanelTitleContainer(): void {
        const commentPanelTitleContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentPanelTitleContainer', className: 'e-pv-comment-panel-title-container' });
        const commentpanelTilte: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentPanelTitle', className: 'e-pv-comment-panel-title', attrs: { 'tabindex': '-1' } });
        if (isBlazor()) {
            const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_Comments');
            promise.then((value: string) => {
                commentpanelTilte.innerText = value;
            });
        } else {
            commentpanelTilte.innerText = this.pdfViewer.localeObj.getConstant('Comments');
        }
        // Create filter icon button
        const filterButton: HTMLElement = createElement('button', { id: this.pdfViewer.element.id + '_annotation_filter_btn' });
        filterButton.setAttribute('aria-label', 'filter button');
        filterButton.setAttribute('type', 'button');
        filterButton.className = 'e-btn e-pv-tbar-btn e-pv-comment-panel-filter-btn e-btn';
        const filterIconSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_annotation_filter_icon', className: 'e-pv-filter-icon e-pv-icon' });
        filterButton.appendChild(filterIconSpan);

        const annotationButton: HTMLElement = createElement('button', { id: this.pdfViewer.element.id + '_annotations_btn' });
        annotationButton.setAttribute('aria-label', 'annotation button');
        annotationButton.setAttribute('type', 'button');
        annotationButton.className = 'e-btn e-pv-tbar-btn e-pv-comment-panel-title-close-div e-btn';
        const moreOptionButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_annotation_more_icon', className: 'e-pv-more-icon e-pv-icon' });
        annotationButton.appendChild(moreOptionButtonSpan);
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode && !isBlazor()) {
            const commentCloseIconDiv: HTMLElement = createElement('button');
            commentCloseIconDiv.setAttribute('aria-label', 'annotation button');
            commentCloseIconDiv.setAttribute('type', 'button');
            commentCloseIconDiv.style.borderColor = 'transparent';
            commentCloseIconDiv.style.paddingTop = '11px';
            commentCloseIconDiv.style.paddingBottom = '11px';
            commentCloseIconDiv.style.backgroundColor = 'transparent';
            commentCloseIconDiv.addEventListener('click', this.closeCommentPanelContainer.bind(this));
            commentpanelTilte.style.left = '37px';
            const commentCloseIcon: HTMLElement = createElement('span', { className: 'e-pv-annotation-tools-close-icon e-pv-icon' });
            commentCloseIconDiv.appendChild(commentCloseIcon);
            commentPanelTitleContainer.appendChild(commentCloseIconDiv);
        }
        commentPanelTitleContainer.appendChild(commentpanelTilte);
        commentPanelTitleContainer.appendChild(filterButton);
        commentPanelTitleContainer.appendChild(annotationButton);
        this.commentPanelContainer.appendChild(commentPanelTitleContainer);
        this.createAnnotationContextMenu();
        filterButton.addEventListener('click', this.openCommentFilterPopup.bind(this));
        annotationButton.addEventListener('click', this.openAnnotationContextMenu.bind(this));
    }

    private createCommentPanelResizeIcon(): void {
        this.commentPanelResizeIcon = createElement('div', { id: this.pdfViewer.element.id + '_commentPanel_resize', className: 'e-pv-resize-icon e-pv-icon' });
        this.setCommentPanelResizeIconTop();
        this.commentPanelResizeIcon.style.position = 'absolute';
        this.commentPanelResizer.appendChild(this.commentPanelResizeIcon);
    }

    private openAnnotationContextMenu(event: any): void {
        this.annotationMenuObj.open(event.clientY, event.clientX, event.currentTarget);
    }

    /**
     * Opens the comment filter dialog popup
     * @private
     * @returns {void}
     */
    private openCommentFilterPopup(): void {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.createCommentFilterDialogMobile();
        } else {
            this.createCommentFilterDialog();
        }
    }

    /**
     * Creates and displays the comment filter dialog
     * @private
     * @returns {void}
     */
    private createCommentFilterDialog(): void {
        if (!this.commentFilterDialog) {
            const dialogDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_comment_filter_dialog', className: 'e-pv-comment-filter-dialog' });
            this.pdfViewerBase.pageContainer.appendChild(dialogDiv);

            // Create filter dialog content
            const filterContent: HTMLElement = this.createFilterDialogContent();
            this.commentFilterDialog = new Dialog({
                header: this.pdfViewer.localeObj.getConstant('Comment filter'),
                showCloseIcon: true,
                closeOnEscape: true,
                isModal: true,
                target: this.pdfViewer.element,
                content: filterContent,
                width: 448,
                height: 'auto',
                open: (): void => {
                    // Placeholder for future implementation
                },
                close: (): void => {
                    // Destroy dialog and cleanup when closed
                    this.destroyCommentFilterDialog();
                }
            });
            if (this.pdfViewer.enableRtl) {
                this.commentFilterDialog.enableRtl = true;
            }
            this.commentFilterDialog.appendTo(dialogDiv);
        } else {
            // If dialog already exists, just show it
            if (!this.commentFilterDialog.visible) {
                this.commentFilterDialog.show();
            }
        }
    }

    /**
     * Creates and displays the mobile comment filter panel (full-page panel instead of dialog)
     * @private
     * @returns {void}
     */
    private createCommentFilterDialogMobile(): void {
        // Create the mobile filter panel container (full-page panel)
        const mobileFilterPanel: HTMLElement = createElement('div', {
            id: this.pdfViewer.element.id + '_comment_filter_panel',
            className: 'e-pv-comment-filter-panel-mobile e-pv-block'
        });

        // Append to the main container
        this.pdfViewerBase.mainContainer.appendChild(mobileFilterPanel);

        // Set panel positioning and styling
        mobileFilterPanel.style.position = 'absolute';
        mobileFilterPanel.style.top = '0px';
        mobileFilterPanel.style.left = '0px';
        mobileFilterPanel.style.right = '0px';
        mobileFilterPanel.style.bottom = '0px';
        mobileFilterPanel.style.zIndex = '1001';
        if (this.pdfViewer.enableRtl) {
            mobileFilterPanel.style.direction = 'rtl';
        }

        // Create mobile filter dialog content and append to panel
        const mobileFilterContent: HTMLElement = this.createFilterDialogContentMobile();
        mobileFilterPanel.appendChild(mobileFilterContent);

        // Insert before the toolbar to maintain proper z-index ordering
        const viewer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_viewerMainContainer');
        if (viewer) {
            viewer.insertBefore(mobileFilterPanel, this.toolbarElement);
        }

        // Store reference for closing later
        this.commentFilterPanel = mobileFilterPanel;
    }

    /**
     * Closes the mobile filter panel
     * @private
     * @returns {void}
     */
    private closeCommentFilterPanelMobile(): void {
        const filterPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_comment_filter_panel');
        if (filterPanel) {
            filterPanel.style.display = 'none';
            filterPanel.remove();
            this.commentFilterPanel = null;
            if (this.pdfViewerBase) {
                this.pdfViewerBase.updateZoomValue();
            }
        }
    }

    /**
     * Destroys the comment filter dialog/panel and cleans up resources
     * Follows the pattern used in form-designer.ts destroyPropertiesWindow()
     * @private
     * @returns {void}
     */
    private destroyCommentFilterDialog(): void {
        // Destroy all MultiSelect instances
        if (this.filterMultiSelectInstances) {
            for (const key in this.filterMultiSelectInstances) {
                if (this.filterMultiSelectInstances.hasOwnProperty(key)) {
                    const instance: MultiSelect | null = this.filterMultiSelectInstances[(key as any)];
                    if (instance) {
                        instance.destroy();
                        this.filterMultiSelectInstances[key as any] = null;
                    }
                }
            }
            this.filterMultiSelectInstances = {};
        }

        // Clear checkbox references
        this.includeRepliesCheckbox = null;
        this.filterDocumentCheckbox = null;

        // Destroy the dialog instance if it exists (for desktop mode)
        if (this.commentFilterDialog) {
            this.commentFilterDialog.destroy();
            this.commentFilterDialog = null;
        }

        // Remove the dialog element from DOM (for desktop mode)
        const dialogElement: HTMLElement = this.pdfViewerBase.getElement('_comment_filter_dialog');
        if (dialogElement && dialogElement.parentElement) {
            dialogElement.parentElement.removeChild(dialogElement);
        }

        // Close and cleanup mobile panel if it exists
        this.closeCommentFilterPanelMobile();
    }

    /**
     * Extracts unique filter values from annotationCollection in a single pass.
     * Includes author names from both annotations and reply comments.
     * Normalizes colors to hex format and extracts annotation types with measurement type mapping.
     * @private
     * @returns {Object} Object containing uniqueAuthors, uniqueAnnotationTypes, uniqueStatuses, uniqueColors, uniqueDates
     */
    private extractFilterValuesFromAnnotations(): {
        uniqueAuthors: string[]; uniqueAnnotationTypes: string[];
        uniqueStatuses: string[]; uniqueColors: string[]; uniqueDates: string[]
    } {
        const uniqueAuthors: Set<string> = new Set();
        const uniqueAnnotationTypes: Set<string> = new Set();
        const uniqueStatuses: Set<string> = new Set();
        const uniqueColors: Set<string> = new Set();
        const uniqueDates: Set<string> = new Set();
        const annotationCollection: any[] = this.pdfViewer.annotationCollection || [];

        // Helper: Reverse map measurement types to user-friendly names
        const mapMeasurementTypeReverse: (indent: any) => string = (indent: any): string => {
            // Handle case when object is received instead of string
            if (typeof indent === 'object' && indent !== null) {
                return 'Radius';
            }

            // Handle string cases
            if (typeof indent === 'string') {
                switch (indent) {
                case 'LineDimension': return 'Distance';
                case 'PolyLineDimension': return 'Perimeter';
                case 'PolygonDimension': return 'Area';
                case 'PolygonRadius': return 'Radius';
                case 'PolygonVolume': return 'Volume';
                case 'Square': return 'Rectangle';
                default: return indent;
                }
            }
            return String(indent);
        };

        // Helper: Normalize color to hex format
        const normalizeColorToHex: (colorValue: any) => string = (colorValue: any): string => {
            if (typeof colorValue !== 'string' || !colorValue || colorValue === '') {
                return '';
            }
            const colorStr : any = String(colorValue).trim();
            if (colorStr.indexOf('#') === 0) {
                if (colorStr.length === 9) {
                    return colorStr.substring(0, 7).toLowerCase();
                }
                return colorStr.toLowerCase();
            }
            // eslint-disable-next-line security/detect-unsafe-regex
            const rgbaMatch: RegExpMatchArray | null = colorStr.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/i);
            if (rgbaMatch) {
                const padWithZeros: (str: string, len: number) => string = (str: string, len: number): string => {
                    while (str.length < len) {
                        str = '0' + str;
                    }
                    return str;
                };
                const r: string = padWithZeros(parseInt(rgbaMatch[1], 10).toString(16), 2);
                const g: string = padWithZeros(parseInt(rgbaMatch[2], 10).toString(16), 2);
                const b: string = padWithZeros(parseInt(rgbaMatch[3], 10).toString(16), 2);
                return ('#' + r + g + b).toLowerCase();
            }
            return colorStr.toLowerCase();
        };

        // Helper: Get annotation type
        const getAnnotationType: (annotation: any) => string = (annotation: any): string => {
            const indent: string | undefined = annotation.indent || annotation.Indent;
            if (indent) {
                return indent;
            }
            const textMarkupType: string | undefined = annotation.textMarkupAnnotationType || annotation.TextMarkupAnnotationType;
            if (textMarkupType) {
                return textMarkupType;
            }
            const freeTextType: string | undefined = annotation.freeTextAnnotationType || annotation.FreeTextAnnotationType;
            if (freeTextType) {
                return freeTextType;
            }
            const shapeType: string = annotation.shapeAnnotationType || annotation.ShapeAnnotationType || '';

            // Special handling for Arrow annotation: distinguish arrows from lines
            // Arrows have shapeAnnotationType === 'line' but with lineHeadStart/lineHeadEnd !== "none"
            if (shapeType === 'Line' && annotation.lineHeadStart !== 'None' && annotation.lineHeadEnd !== 'None') {
                return 'Arrow';
            }
            return shapeType;
        };

        // Single pass through annotationCollection
        for (const annotation of annotationCollection) {
            // Extract author (from annotation)
            const author: string | undefined = annotation.author || annotation.Author;
            if (author) {
                uniqueAuthors.add(author);
            }

            // Extract authors from comments/replies
            const comments: any[] = annotation.comments || annotation.Comments;
            if (Array.isArray(comments)) {
                for (const comment of comments) {
                    const commentAuthor: string | undefined = comment.author || comment.Author;
                    if (commentAuthor) {
                        uniqueAuthors.add(commentAuthor);
                    }
                    // Extract status from replies
                    const commentStatus: string | undefined = comment.state || comment.State || comment.stateModel ||
                        comment.StateModel || (comment.review && comment.review.state);
                    if (
                        commentStatus &&
                        commentStatus.toString().trim().toLowerCase() !== 'unmarked'
                    ) {
                        uniqueStatuses.add(commentStatus);
                    }

                    // Extract date from replies (date only, no time)
                    const commentModifiedDate: string | undefined = comment.modifiedDate || comment.ModifiedDate;
                    if (commentModifiedDate) {
                        const dateOnly: string = new Date(commentModifiedDate).toLocaleDateString(
                            'en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
                        uniqueDates.add(dateOnly);
                    }
                }
            }

            // Extract annotation type (with measurement type mapping)
            const annotType: string = getAnnotationType(annotation);
            if (annotType) {
                const userFriendlyType: string = mapMeasurementTypeReverse(annotType);
                uniqueAnnotationTypes.add(userFriendlyType);
            }

            // Extract status
            const status: string | undefined = annotation.state || annotation.State || annotation.stateModel ||
                annotation.StateModel || annotation.review.state;
            if (
                status &&
                status.toString().trim().toLowerCase() !== 'unmarked'
            ) {
                uniqueStatuses.add(status);
            }

            // Extract color (try multiple fields)
            const colorValue: string | undefined = annotation.color || annotation.Color ||
                annotation.strokeColor || annotation.StrokeColor ||
                annotation.fillColor || annotation.FillColor ||
                annotation.fontColor || annotation.FontColor;
            if (colorValue) {
                const normalizedColor: string = normalizeColorToHex(colorValue);
                if (normalizedColor) {
                    uniqueColors.add(normalizedColor);
                }
            }

            // Extract date (date only, no time)
            const modifiedDate: string | undefined = annotation.modifiedDate || annotation.ModifiedDate;
            if (modifiedDate) {
                const dateOnly: string = new Date(modifiedDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
                uniqueDates.add(dateOnly);
            }
        }

        // Convert sets to sorted arrays
        return {
            uniqueAuthors: Array.from(uniqueAuthors).sort(),
            uniqueAnnotationTypes: Array.from(uniqueAnnotationTypes).sort(),
            uniqueStatuses: Array.from(uniqueStatuses).sort(),
            uniqueColors: Array.from(uniqueColors).sort(),
            uniqueDates: Array.from(uniqueDates).sort()
        };
    }

    /**
     * Helper method to create mobile MultiSelect dropdown with optimized layout
     * @private
     * @param {string} label - Label text for the dropdown
     * @param {string} placeholder - Placeholder text
     * @param {string[]} options - Array of option strings
     * @param {string} uniqueId - Unique identifier for the MultiSelect instance
     * @param {string} filterKey - Filter key identifier (e.g., 'author', 'type', 'status', 'modifiedDate', 'color')
     * @param {any} state - Filter state to maintain previously selected values (optional)
     * @returns {HTMLElement} - The dropdown group container optimized for mobile
     */
    private createFilterDropdownMobile(label: string, placeholder: string, options: string[],
                                       uniqueId: string, filterKey: string, state?: CommentFilterSettings): HTMLElement {
        const groupContainer: HTMLElement = createElement('div', { className: 'e-pv-filter-group-mobile' });
        const labelElement: HTMLElement = createElement('label', { className: 'e-pv-filter-label-mobile' });
        labelElement.innerText = label;
        groupContainer.appendChild(labelElement);
        const multiSelectContainer: HTMLElement = createElement('input', { id: uniqueId, className: 'e-pv-filter-multiselect-mobile' });
        groupContainer.appendChild(multiSelectContainer);

        // Create data source for MultiSelect
        const dataSource: Array<{ text: string; value: string }> = options.map((option: string) => ({ text: option, value: option }));

        // Determine selected values based on state and filterKey
        let selectedValues: any[] = null;
        if (state != null) {
            switch (filterKey) {
            case 'author':
                selectedValues = state.author || null;
                break;
            case 'type':
                selectedValues = state.type ? (Array.isArray(state.type) ? state.type : [state.type]) : null;
                break;
            case 'status':
                selectedValues = state.status ? (Array.isArray(state.status) ? state.status : [state.status]) : null;
                break;
            case 'modifiedDate':
                selectedValues = state.modifiedDate || null;
                break;
            case 'color':
                selectedValues = state.color || null;
                break;
            }
        }

        // Initialize MultiSelect component configuration
        const multiSelectConfig: any = {
            dataSource: dataSource,
            fields: { text: 'text', value: 'value' },
            placeholder: placeholder,
            mode: 'CheckBox',
            showDropDownIcon: true,
            showSelectAll: true,
            popupHeight: '200px',
            popupWidth: '100%',
            maximumSelectionCharacters: 1,
            enableRtl: this.pdfViewer.enableRtl
        };

        // Add custom templates for Color dropdown - show only circular color swatch
        if (label === this.pdfViewer.localeObj.getConstant('Color')) {
            multiSelectConfig.itemTemplate = '<div style="width:16px;height:16px;border-radius:50%;background-color:${value};border:1px solid #999;display:inline-block;vertical-align:middle;"></div>';
            multiSelectConfig.valueTemplate = '<div style="width:14px;height:14px;border-radius:50%;background-color:${value};border:1px solid #999;display:inline-block;vertical-align:middle;"></div>';
        }

        // Initialize MultiSelect component optimized for mobile
        const multiSelectInstance: MultiSelect = new MultiSelect(multiSelectConfig);
        multiSelectInstance.appendTo(multiSelectContainer);

        // Set selected values AFTER appending to ensure proper display format (count mode)
        if (selectedValues && selectedValues.length > 0) {
            multiSelectInstance.value = selectedValues;
        }

        // Store instance for later reference
        this.filterMultiSelectInstances[uniqueId as any] = multiSelectInstance;
        return groupContainer;
    }

    /**
     * Creates the content for the mobile filter panel (full-page panel instead of dialog)
     * @private
     * @returns {HTMLElement} - The mobile filter panel content
     */
    private createFilterDialogContentMobile(): HTMLElement {
        const content: HTMLElement = createElement('div', { className: 'e-pv-filter-dialog-content-mobile' });

        // Extract dynamic filter values from annotationCollection (single pass)
        const filterValues: {
            uniqueAuthors: string[]; uniqueAnnotationTypes: string[]; uniqueStatuses: string[];
            uniqueColors: string[]; uniqueDates: string[]
        } = this.extractFilterValuesFromAnnotations();

        // Get current filter state
        const filterState: CommentFilterSettings = this.pdfViewer.annotation ? this.pdfViewer.annotation.getCurrentFilterState() : null;

        // ===== HEADER SECTION =====
        const header: HTMLElement = createElement('div', { className: 'e-pv-filter-header-mobile' });

        // Back button with close icon
        const backButton: HTMLElement = createElement('button', { className: 'e-pv-filter-back-btn' });
        backButton.setAttribute('type', 'button');
        backButton.setAttribute('aria-label', 'Back');
        const backIcon: HTMLElement = createElement('span', { className: 'e-pv-backward-icon e-pv-icon' });
        backButton.appendChild(backIcon);
        backButton.addEventListener('click', () => {
            this.closeCommentFilterPanelMobile();
            this.destroyCommentFilterDialog();
        });
        header.appendChild(backButton);

        // Title
        const headerTitle: HTMLElement = createElement('div', { className: 'e-pv-filter-header-title-mobile' });
        headerTitle.innerText = this.pdfViewer.localeObj.getConstant('Comment filter');
        header.appendChild(headerTitle);
        content.appendChild(header);

        // ===== BODY SECTION =====
        const body: HTMLElement = createElement('div', { className: 'e-pv-filter-body-mobile' });

        // ===== AUTHOR DROPDOWN (MULTI-SELECT) =====
        const authorDropdown: HTMLElement = this.createFilterDropdownMobile(this.pdfViewer.localeObj.getConstant('Author'), this.pdfViewer.localeObj.getConstant('Select author'), filterValues.uniqueAuthors, 'filter_author_multiselect', 'author', filterState);
        body.appendChild(authorDropdown);

        // ===== INCLUDE REPLIES CHECKBOX =====
        const includeRepliesContainer: HTMLElement = createElement('div', { className: 'e-pv-filter-group-mobile e-pv-filter-checkbox-container-mobile' });
        this.includeRepliesCheckbox = createElement('input', { className: 'e-pv-filter-checkbox-mobile', attrs: { 'type': 'checkbox' } });
        // Maintain state for includeReplies (default true if no state or true in state)
        (this.includeRepliesCheckbox as any).checked = filterState == null || filterState.includeReplies !== false;
        const includeRepliesLabel: HTMLElement = createElement('label', { className: 'e-pv-filter-option-label-mobile' });
        includeRepliesLabel.innerText = this.pdfViewer.localeObj.getConstant('Include Replies');
        includeRepliesContainer.appendChild(this.includeRepliesCheckbox as any);
        includeRepliesContainer.appendChild(includeRepliesLabel);
        body.appendChild(includeRepliesContainer);

        // ===== ANNOTATION TYPE DROPDOWN =====
        const annotationTypeDropdown: HTMLElement = this.createFilterDropdownMobile(this.pdfViewer.localeObj.getConstant('Annotation type'), this.pdfViewer.localeObj.getConstant('Select annotation type'), filterValues.uniqueAnnotationTypes, 'filter_annotation_type_multiselect', 'type', filterState);
        body.appendChild(annotationTypeDropdown);

        // ===== STATUS DROPDOWN =====
        const statusDropdown: HTMLElement = this.createFilterDropdownMobile(this.pdfViewer.localeObj.getConstant('Status'), this.pdfViewer.localeObj.getConstant('Select status'), filterValues.uniqueStatuses, 'filter_status_multiselect', 'status', filterState);
        body.appendChild(statusDropdown);

        // ===== DATE DROPDOWN =====
        const dateDropdown: HTMLElement = this.createFilterDropdownMobile(this.pdfViewer.localeObj.getConstant('Date'), this.pdfViewer.localeObj.getConstant('Select a date'), filterValues.uniqueDates, 'filter_date_multiselect', 'modifiedDate', filterState);
        body.appendChild(dateDropdown);

        // ===== COLOR DROPDOWN =====
        const colorDropdown: HTMLElement = this.createFilterDropdownMobile(this.pdfViewer.localeObj.getConstant('Color'), this.pdfViewer.localeObj.getConstant('Select color'), filterValues.uniqueColors, 'filter_color_multiselect', 'color', filterState);
        body.appendChild(colorDropdown);

        // ===== DIVIDER =====
        const divider: HTMLElement = createElement('div', { className: 'e-pv-filter-divider-mobile' });
        body.appendChild(divider);

        // ===== FILTER SETTINGS SECTION =====
        const filterSettingsSection: HTMLElement = createElement('div', { className: 'e-pv-filter-settings-section-mobile' });
        const filterSettingsHeading: HTMLElement = createElement('div', { className: 'e-pv-filter-settings-heading-mobile' });
        filterSettingsHeading.innerText = this.pdfViewer.localeObj.getConstant('Filter settings');
        filterSettingsSection.appendChild(filterSettingsHeading);
        const filterDocumentCheckboxContainer: HTMLElement = createElement('div', { className: 'e-pv-filter-checkbox-container-mobile' });
        this.filterDocumentCheckbox = createElement('input', { className: 'e-pv-filter-checkbox-mobile', attrs: { 'type': 'checkbox' } });
        // Maintain state for applyToDocument (default false if no state or false in state)
        (this.filterDocumentCheckbox as any).checked = filterState != null && filterState.applyToDocument === true;
        const filterDocumentLabel: HTMLElement = createElement('label', { className: 'e-pv-filter-option-label-mobile' });
        filterDocumentLabel.innerText = this.pdfViewer.localeObj.getConstant('Filter document and comments panel');
        filterDocumentCheckboxContainer.appendChild(this.filterDocumentCheckbox as any);
        filterDocumentCheckboxContainer.appendChild(filterDocumentLabel);
        filterSettingsSection.appendChild(filterDocumentCheckboxContainer);
        body.appendChild(filterSettingsSection);
        content.appendChild(body);

        // ===== FOOTER SECTION =====
        const footer: HTMLElement = createElement('div', { className: 'e-pv-filter-footer-mobile' });
        const clearButton: HTMLElement = createElement('button', { className: 'e-pv-filter-clear-btn-mobile' });
        clearButton.setAttribute('type', 'button');
        clearButton.innerText = this.pdfViewer.localeObj.getConstant('Clear');
        clearButton.addEventListener('click', () => {
            // Call applyCommentFilter with null to clear filters
            if (this.pdfViewer.annotation) {
                this.pdfViewer.annotation.applyCommentFilter(null);
            }

            // Clear all MultiSelect instances
            if (this.filterMultiSelectInstances) {
                for (const key in this.filterMultiSelectInstances) {
                    if (this.filterMultiSelectInstances.hasOwnProperty(key)) {
                        const instance : any = this.filterMultiSelectInstances[key as any];
                        if (instance) {
                            instance.value = null;
                        }
                    }
                }
            }

            // Clear checkboxes
            if (this.includeRepliesCheckbox) {
                (this.includeRepliesCheckbox as any).checked = false;
            }
            if (this.filterDocumentCheckbox) {
                (this.filterDocumentCheckbox as any).checked = false;
            }

            // Close and destroy panel
            this.closeCommentFilterPanelMobile();
            this.destroyCommentFilterDialog();
        });
        footer.appendChild(clearButton);
        const applyButton: HTMLElement = createElement('button', { className: 'e-pv-filter-apply-btn-mobile' });
        applyButton.setAttribute('type', 'button');
        applyButton.innerText = this.pdfViewer.localeObj.getConstant('Apply');
        applyButton.addEventListener('click', () => {
            // Collect selected filter values from MultiSelect instances
            const typeValues: any | undefined = this.filterMultiSelectInstances['filter_annotation_type_multiselect'].value as any | undefined;
            const authorValues: string[] | undefined = this.filterMultiSelectInstances['filter_author_multiselect'].value as string[] | undefined;
            const colorValues: string[] | undefined = this.filterMultiSelectInstances['filter_color_multiselect'].value as string[] | undefined;
            const statusValues: any = this.filterMultiSelectInstances['filter_status_multiselect'].value as any;
            const dateValues: string[] | undefined = this.filterMultiSelectInstances['filter_date_multiselect'].value as string[] | undefined;

            // Collect checkbox values
            const includeReplies : boolean = (this.includeRepliesCheckbox as any).checked;
            const applyToDocument : boolean = (this.filterDocumentCheckbox as any).checked;

            // Call applyCommentFilter with collected values
            if (this.pdfViewer.annotation) {
                this.pdfViewer.annotation.applyCommentFilter({
                    type: typeValues,
                    author: authorValues,
                    color: colorValues,
                    status: statusValues,
                    modifiedDate: dateValues,
                    includeReplies: includeReplies,
                    applyToDocument: applyToDocument
                } as CommentFilterSettings);
            }

            // Close and destroy panel
            this.closeCommentFilterPanelMobile();
            this.destroyCommentFilterDialog();
        });
        footer.appendChild(applyButton);
        content.appendChild(footer);
        return content;
    }

    /**
     * Helper method to create and setup a MultiSelect dropdown with multi-select functionality
     * @private
     * @param {string} label - Label text for the dropdown
     * @param {string} placeholder - Placeholder text
     * @param {string[]} options - Array of option strings
     * @param {string} uniqueId - Unique identifier for the MultiSelect instance
     * @param {string} filterKey - Filter key identifier (e.g., 'author', 'type', 'status', 'modifiedDate', 'color')
     * @param {any} state - Filter state to maintain previously selected values
     * @returns {HTMLElement} - The dropdown group container
     */
    private createFilterDropdown(label: string, placeholder: string, options: string[], uniqueId: string,
                                 filterKey: string, state: CommentFilterSettings): HTMLElement {
        const groupContainer: HTMLElement = createElement('div', { className: 'e-pv-filter-group' });
        const labelElement: HTMLElement = createElement('label', { className: 'e-pv-filter-label' });
        labelElement.innerText = label;
        groupContainer.appendChild(labelElement);
        const multiSelectContainer: HTMLElement = createElement('input', { id: uniqueId, className: 'e-pv-filter-multiselect' });
        groupContainer.appendChild(multiSelectContainer);

        // Create data source for MultiSelect
        const dataSource: Array<{ text: string; value: string }> = options.map((option: string) => ({ text: option, value: option }));

        // Determine selected values based on state and filterKey
        let selectedValues: any[] = null;
        if (state != null) {
            switch (filterKey) {
            case 'author':
                selectedValues = state.author || null;
                break;
            case 'type':
                selectedValues = state.type ? (Array.isArray(state.type) ? state.type : [state.type]) : null;
                break;
            case 'status':
                selectedValues = state.status ? (Array.isArray(state.status) ? state.status : [state.status]) : null;
                break;
            case 'modifiedDate':
                selectedValues = state.modifiedDate || null;
                break;
            case 'color':
                selectedValues = state.color || null;
                break;
            }
        }

        // Initialize MultiSelect component configuration
        const multiSelectConfig: any = {
            dataSource: dataSource,
            fields: { text: 'text', value: 'value' },
            placeholder: placeholder,
            mode: 'CheckBox',
            showDropDownIcon: true,
            showSelectAll: true,
            popupHeight: '200px',
            popupWidth: '100%',
            maximumSelectionCharacters: 1,
            enableRtl: this.pdfViewer.enableRtl
        };

        // Add custom templates for Color dropdown - show only circular color swatch
        // Note: ${value} is Syncfusion's own template engine syntax, not JS eval
        if (label === this.pdfViewer.localeObj.getConstant('Color')) {
            multiSelectConfig.itemTemplate = '<div style="width:16px;height:16px;border-radius:50%;background-color:${value};border:1px solid #999;display:inline-block;vertical-align:middle;"></div>';
            multiSelectConfig.valueTemplate = '<div style="width:14px;height:14px;border-radius:50%;background-color:${value};border:1px solid #999;display:inline-block;vertical-align:middle;"></div>';
        }
        const multiSelectInstance: MultiSelect = new MultiSelect(multiSelectConfig);
        multiSelectInstance.appendTo(multiSelectContainer);

        // Set selected values AFTER appending to ensure proper display format (count mode)
        if (selectedValues && selectedValues.length > 0) {
            multiSelectInstance.value = selectedValues;
        }

        // Store instance for later reference
        this.filterMultiSelectInstances[uniqueId as any] = multiSelectInstance;
        return groupContainer;
    }

    /**
     * Creates the content for the filter dialog
     * @private
     * @returns {HTMLElement} - The filter dialog content
     */
    private createFilterDialogContent(): HTMLElement {
        const content: HTMLElement = createElement('div', { className: 'e-pv-filter-dialog-content' });

        // Extract dynamic filter values from annotationCollection (single pass)
        const filterValues: {
            uniqueAuthors: string[]; uniqueAnnotationTypes: string[]; uniqueStatuses: string[];
            uniqueColors: string[]; uniqueDates: string[]
        } = this.extractFilterValuesFromAnnotations();
        const filterState: CommentFilterSettings = this.pdfViewer.annotation.getCurrentFilterState();
        // ===== BODY SECTION =====
        const body: HTMLElement = createElement('div', { className: 'e-pv-filter-body' });

        // ===== AUTHOR DROPDOWN (MULTI-SELECT) =====
        const authorDropdown: HTMLElement = this.createFilterDropdown(this.pdfViewer.localeObj.getConstant('Author'), this.pdfViewer.localeObj.getConstant('Select author'), filterValues.uniqueAuthors, 'filter_author_multiselect', 'author', filterState);
        body.appendChild(authorDropdown);

        // ===== INCLUDE REPLIES CHECKBOX =====
        const includeRepliesContainer: HTMLElement = createElement('div', { className: 'e-pv-filter-group e-pv-filter-checkbox-container' });

        this.includeRepliesCheckbox = createElement('input', { className: 'e-pv-filter-checkbox', attrs: { 'type': 'checkbox' } });
        // Maintain state for includeReplies (default true if no state or true in state)
        (this.includeRepliesCheckbox as any).checked = filterState == null || filterState.includeReplies !== false;
        const includeRepliesLabel: HTMLElement = createElement('label', { className: 'e-pv-filter-option-label' });
        includeRepliesLabel.innerText = this.pdfViewer.localeObj.getConstant('Include Replies');
        includeRepliesContainer.appendChild(this.includeRepliesCheckbox as any);
        includeRepliesContainer.appendChild(includeRepliesLabel);
        body.appendChild(includeRepliesContainer);

        // ===== ROW 1: ANNOTATION TYPE + STATUS =====
        const row1Container: HTMLElement = createElement('div', { className: 'e-pv-filter-row' });
        const annotationTypeDropdown: HTMLElement = this.createFilterDropdown(this.pdfViewer.localeObj.getConstant('Annotation type'), this.pdfViewer.localeObj.getConstant('Select annotation type'), filterValues.uniqueAnnotationTypes, 'filter_annotation_type_multiselect', 'type', filterState);
        row1Container.appendChild(annotationTypeDropdown);
        const statusDropdown: HTMLElement = this.createFilterDropdown(this.pdfViewer.localeObj.getConstant('Status'), this.pdfViewer.localeObj.getConstant('Select status'), filterValues.uniqueStatuses, 'filter_status_multiselect', 'status', filterState);
        row1Container.appendChild(statusDropdown);
        body.appendChild(row1Container);

        // ===== ROW 2: DATE + COLOR =====
        const row2Container: HTMLElement = createElement('div', { className: 'e-pv-filter-row' });
        const dateDropdown: HTMLElement = this.createFilterDropdown(this.pdfViewer.localeObj.getConstant('Date'), this.pdfViewer.localeObj.getConstant('Select a date'), filterValues.uniqueDates, 'filter_date_multiselect', 'modifiedDate', filterState);
        row2Container.appendChild(dateDropdown);
        const colorDropdown: HTMLElement = this.createFilterDropdown(this.pdfViewer.localeObj.getConstant('Color'), this.pdfViewer.localeObj.getConstant('Select color'), filterValues.uniqueColors, 'filter_color_multiselect', 'color', filterState);
        row2Container.appendChild(colorDropdown);
        body.appendChild(row2Container);

        // ===== DIVIDER =====
        const divider: HTMLElement = createElement('div', { className: 'e-pv-filter-divider' });

        // ===== FILTER SETTINGS SECTION =====
        const filterSettingsSection: HTMLElement = createElement('div', { className: 'e-pv-filter-settings-section' });
        const filterSettingsHeading: HTMLElement = createElement('div', { className: 'e-pv-filter-settings-heading' });
        filterSettingsHeading.innerText = this.pdfViewer.localeObj.getConstant('Filter settings');
        filterSettingsSection.appendChild(filterSettingsHeading);
        const filterDocumentCheckboxContainer: HTMLElement = createElement('div', { className: 'e-pv-filter-checkbox-container' });
        this.filterDocumentCheckbox = createElement('input', { className: 'e-pv-filter-checkbox', attrs: { 'type': 'checkbox' } });
        // Maintain state for applyToDocument (default false if no state or false in state)
        (this.filterDocumentCheckbox as any).checked = filterState != null && filterState.applyToDocument === true;
        const filterDocumentLabel: HTMLElement = createElement('label', { className: 'e-pv-filter-option-label' });
        filterDocumentLabel.innerText = this.pdfViewer.localeObj.getConstant('Filter document and comments panel');
        filterDocumentCheckboxContainer.appendChild(this.filterDocumentCheckbox as any);
        filterDocumentCheckboxContainer.appendChild(filterDocumentLabel);
        filterSettingsSection.appendChild(filterDocumentCheckboxContainer);
        content.appendChild(body);
        content.appendChild(divider);
        content.appendChild(filterSettingsSection);

        // ===== FOOTER SECTION =====
        const footer: HTMLElement = createElement('div', { className: 'e-pv-filter-footer' });
        const clearButton: HTMLElement = createElement('button', { className: 'e-pv-filter-clear-btn e-btn' });
        clearButton.setAttribute('type', 'button');
        clearButton.innerText = this.pdfViewer.localeObj.getConstant('Clear');
        clearButton.addEventListener('click', () => {
            // Call applyCommentFilter with null to clear filters
            if (this.pdfViewer.annotation) {
                this.pdfViewer.annotation.applyCommentFilter(null);
            }

            // Clear all MultiSelect instances
            if (this.filterMultiSelectInstances) {
                for (const key in this.filterMultiSelectInstances) {
                    if (this.filterMultiSelectInstances.hasOwnProperty(key)) {
                        const instance : any = this.filterMultiSelectInstances[key as any];
                        if (instance) {
                            instance.value = null;
                        }
                    }
                }
            }

            // Clear checkboxes
            if (this.includeRepliesCheckbox) {
                (this.includeRepliesCheckbox as any).checked = false;
            }
            if (this.filterDocumentCheckbox) {
                (this.filterDocumentCheckbox as any).checked = false;
            }

            // Close and destroy dialog
            if (this.commentFilterDialog) {
                this.commentFilterDialog.hide();
                this.destroyCommentFilterDialog();
            }
        });
        footer.appendChild(clearButton);
        const applyButton: HTMLElement = createElement('button', { className: 'e-pv-filter-apply-btn e-btn' });
        applyButton.setAttribute('type', 'button');
        applyButton.innerText = this.pdfViewer.localeObj.getConstant('Apply');
        applyButton.addEventListener('click', () => {
            // Collect selected filter values from MultiSelect instances
            const typeValues : any = this.filterMultiSelectInstances['filter_annotation_type_multiselect'].value as string[] | undefined;
            const authorValues : any = this.filterMultiSelectInstances['filter_author_multiselect'].value as string[] | undefined;
            const colorValues : any = this.filterMultiSelectInstances['filter_color_multiselect'].value as string[] | undefined;
            const statusValues : any = this.filterMultiSelectInstances['filter_status_multiselect'].value as any;
            const dateValues : any = this.filterMultiSelectInstances['filter_date_multiselect'].value as string[] | undefined;

            // Collect checkbox values
            const includeReplies : boolean = (this.includeRepliesCheckbox as any).checked;
            const applyToDocument : boolean = (this.filterDocumentCheckbox as any).checked;

            // Call applyCommentFilter with collected values
            if (this.pdfViewer.annotation) {
                this.pdfViewer.annotation.applyCommentFilter({
                    type: typeValues,
                    author: authorValues,
                    color: colorValues,
                    status: statusValues,
                    modifiedDate: dateValues,
                    includeReplies: includeReplies,
                    applyToDocument: applyToDocument
                } as CommentFilterSettings);
            }

            // Close and destroy dialog
            if (this.commentFilterDialog) {
                this.commentFilterDialog.hide();
                this.destroyCommentFilterDialog();
            }
        });
        footer.appendChild(applyButton);
        content.appendChild(footer);
        return content;
    }

    /**
     * @private
     * @returns {void}
     */

    public createAnnotationContextMenu(): void {
        this.annotationContextMenu = [
            { text: this.pdfViewer.localeObj.getConstant('Export Annotations') },
            { text: this.pdfViewer.localeObj.getConstant('Import Annotations') },
            { text: this.pdfViewer.localeObj.getConstant('Export XFDF')},
            { text: this.pdfViewer.localeObj.getConstant('Import XFDF')}];
        const annotationMenuElement: HTMLElement = createElement('ul', { id: this.pdfViewer.element.id + '_annotation_context_menu' });
        this.pdfViewer.element.appendChild(annotationMenuElement);
        this.annotationMenuObj = new Context({
            target: '#' + this.pdfViewer.element.id + '_annotations_btn', items: this.annotationContextMenu,
            select: this.annotationMenuItemSelect.bind(this)
        });
        if (this.pdfViewer.enableRtl) {
            this.annotationMenuObj.enableRtl = true;
        }
        this.annotationMenuObj.appendTo(annotationMenuElement);
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.annotationMenuObj.animationSettings.effect = 'ZoomIn';
        } else {
            this.annotationMenuObj.animationSettings.effect = 'SlideDown';
        }
    }

    private annotationMenuItemSelect(args: any): void {
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            const currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber, 10);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
        if (args.item) {
            switch (args.item.text) {
            case this.pdfViewer.localeObj.getConstant('Export Annotations'):
                this.pdfViewerBase.exportAnnotations(AnnotationDataFormat.Json);
                break;
            case this.pdfViewer.localeObj.getConstant('Import Annotations'):
                this.importAnnotationIconClick(args);
                break;
            case this.pdfViewer.localeObj.getConstant('Export XFDF'):
                this.pdfViewerBase.exportAnnotations(AnnotationDataFormat.Xfdf);
                break;
            case this.pdfViewer.localeObj.getConstant('Import XFDF'):
                this.importXFdfAnnotationIconClick(args);
                break;

            default:
                break;
            }
        }
    }

    private createFileElement(toolbarElement: HTMLElement): void {
        this.annotationInputElement = createElement('input', { id: this.pdfViewer.element.id + '_annotationUploadElement', styles: 'position:fixed; left:-100em', attrs: { 'type': 'file', 'aria-label': 'upload elements' } });
        this.annotationInputElement.setAttribute('accept', '.json');
        toolbarElement.appendChild(this.annotationInputElement);
        this.annotationInputElement.addEventListener('change', this.loadImportAnnotation);
    }

    private createXFdfFileElement(toolbarElement: HTMLElement): void {
        this.annotationXFdfInputElement = createElement('input', { id: this.pdfViewer.element.id + '_annotationXFdfUploadElement', styles: 'position:fixed; left:-100em', attrs: { 'type': 'file', 'aria-label': 'upload elements' } });
        this.annotationXFdfInputElement.setAttribute('accept', '.xfdf');
        toolbarElement.appendChild(this.annotationXFdfInputElement);
        this.annotationXFdfInputElement.addEventListener('change', this.loadImportAnnotation);
    }

    private importAnnotationIconClick(args: ClickEventArgs): void {
        this.annotationInputElement.click();
    }

    private importXFdfAnnotationIconClick(args: ClickEventArgs): void {
        this.annotationXFdfInputElement.click();
    }


    private loadImportAnnotation = (args: any): void => {
        const upoadedFiles: any = args.target.files;
        if (args.target.files[0] !== null) {
            const uploadedFile: File = upoadedFiles[0];
            if (uploadedFile) {
                this.pdfViewer.fireImportStart(uploadedFile);
                const uploadedFileType: string = uploadedFile.type;
                if (uploadedFile.name.split('.json').length > 1 && uploadedFileType.includes('json')) {
                    const reader: FileReader = new FileReader();
                    reader.readAsDataURL(uploadedFile);
                    reader.onload = (e: any): void => {
                        if (e.currentTarget.result) {
                            const importFile: string =  e.currentTarget.result.split(',')[1];
                            const annotationData: string =  atob(importFile);
                            if (annotationData) {
                                // Encountering a script error while attempting to import annotations from the older version JSON document. As a result, the below line has been commented: Task ID: 842694
                                // annotationData = this.pdfViewerBase.getSanitizedString(annotationData);
                                const jsonData: any = JSON.parse(annotationData);
                                const firstAnnotation: any = jsonData.pdfAnnotation[Object.keys(jsonData.pdfAnnotation)[0]];
                                if ((Object.keys(jsonData.pdfAnnotation).length >= 1) && (firstAnnotation.textMarkupAnnotation ||
                                     firstAnnotation.measureShapeAnnotation || firstAnnotation.freeTextAnnotation ||
                                      firstAnnotation.stampAnnotations || firstAnnotation.signatureInkAnnotation ||
                                      firstAnnotation.stickyNotesAnnotation ||
                                       (firstAnnotation.shapeAnnotation && firstAnnotation.shapeAnnotation[0].Bounds))) {
                                    this.pdfViewerBase.isPDFViewerJson = true;
                                    this.pdfViewerBase.importAnnotations(jsonData, AnnotationDataFormat.Json);
                                } else {
                                    this.pdfViewerBase.isPDFViewerJson = false;
                                    if (!this.pdfViewerBase.clientSideRendering) {
                                        this.pdfViewerBase.importAnnotations(importFile, AnnotationDataFormat.Json);
                                    } else {
                                        this.pdfViewerBase.importAnnotations(_decode(importFile), AnnotationDataFormat.Json);
                                    }
                                }
                            }
                        }
                    };
                } else if (uploadedFile.name.split('.xfdf').length > 1 && (uploadedFileType.includes('xfdf') || args.target.accept.includes('xfdf'))) {
                    const reader: FileReader = new FileReader();
                    if (!this.pdfViewerBase.clientSideRendering) {
                        reader.readAsDataURL(uploadedFile);
                    } else {
                        reader.readAsArrayBuffer(uploadedFile);
                    }
                    reader.onload = (e: any): void => {
                        if (e.currentTarget.result) {
                            if (!this.pdfViewerBase.clientSideRendering) {
                                const importFile: string = e.currentTarget.result.split(',')[1];
                                const annotationData: string = atob(importFile);
                                if (annotationData) {
                                    this.pdfViewerBase.importAnnotations(importFile, AnnotationDataFormat.Xfdf, true);
                                }
                            } else {
                                const importFileByteArray: Uint8Array = new Uint8Array(e.currentTarget.result);
                                if (importFileByteArray) {
                                    this.pdfViewerBase.importAnnotations(importFileByteArray, AnnotationDataFormat.Xfdf, true);
                                }
                            }
                        }
                    };
                } else {
                    this.pdfViewer.fireImportFailed(uploadedFile, this.pdfViewer.localeObj.getConstant('Import Failed'));
                    if (isBlazor()) {
                        const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_ImportFailed');
                        promise.then((value: string) => {
                            this.pdfViewerBase.openImportExportNotificationPopup(value);
                        });
                    } else {
                        this.pdfViewerBase.openImportExportNotificationPopup(this.pdfViewer.localeObj.getConstant('Import Failed'));
                    }
                }
            }
            args.target.value = '';
        }
    };
    /**
     * @private
     * @returns {void}
     */
    public closeCommentPanelContainer(): void {
        let proxy: NavigationPane = null;
        // eslint-disable-next-line
        proxy = this;
        const viewerContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_viewerContainer');
        const pageContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageViewContainer');
        const commentPanel: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
        if (commentPanel) {
            commentPanel.style.display = 'none';
            if (proxy.commentPanelResizer) {
                proxy.commentPanelResizer.style.display = 'none';
            }
            if (viewerContainer) {
                if (this.pdfViewer.enableRtl) {
                    viewerContainer.style.left = proxy.getViewerContainerRight() + 'px';
                } else {
                    viewerContainer.style.right = proxy.getViewerContainerRight() + 'px';
                }
                viewerContainer.style.width = ((proxy.pdfViewer.element.clientWidth > 0 ? proxy.pdfViewer.element.clientWidth : proxy.pdfViewer.element.offsetWidth) - proxy.getViewerContainerLeft() - proxy.getViewerContainerRight()) + 'px';
                pageContainer.style.width = (proxy.pdfViewerBase.viewerContainer.offsetWidth - proxy.getViewerContainerScrollbarWidth()) + 'px';
            }
            if (proxy.pdfViewerBase) {
                proxy.pdfViewerBase.updateZoomValue();
            }
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                this.pdfViewer.annotation.textMarkupAnnotationModule.showHideDropletDiv(true);
            }
            if (Browser.isDevice && !isBlazor() && !this.pdfViewer.enableDesktopMode) {
                if (this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar) {
                    this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar.element.style.display = 'block';
                    if (this.pdfViewer.toolbarModule.annotationToolbarModule.propertyToolbar) {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.propertyToolbar.element.style.display = 'block';
                    }
                }
                if (this.pdfViewer.toolbarModule.redactionToolbarModule && this.pdfViewer.toolbarModule.redactionToolbarModule.toolbar) {
                    this.pdfViewer.toolbarModule.redactionToolbarModule.toolbar.element.style.display = 'block';
                }
            }
        }
    }

    /**
     * @private
     * @param {string} option - The option.
     * @returns {void}
     */
    public createNavigationPaneMobile(option: string): void {
        this.isNavigationToolbarVisible = true;
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_navigationToolbar', className: 'e-pv-nav-toolbar' });
        this.pdfViewerBase.viewerMainContainer.insertBefore(this.toolbarElement, this.pdfViewerBase.viewerContainer);
        let items: ItemModel[];
        if (option === 'search') {
            const searchTemplate: string = '<div class="e-input-group e-pv-text-search-input-mobile" id="' + this.pdfViewer.element.id +
                '_search_input_container"><input class="e-input" type="text" placeholder="' +
                this.pdfViewer.localeObj.getConstant('Find in document') + '" id="' +
                this.pdfViewer.element.id + '_search_input"></input></div>';
            const searchCountTemplate: string = `
                <span class="e-pv-search-count" id="${this.pdfViewer.element.id}_search_count"></span>
            `;
            items = [
                { prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this, null) },
                { template: searchTemplate },
                {
                    prefixIcon: 'e-pv-search-icon e-pv-icon', id: this.pdfViewer.element.id + '_search_box-icon',
                    click: () => {
                        const iconElement: HTMLElement = this.pdfViewerBase.getElement('_search_box-icon').firstElementChild as HTMLElement;
                        if (iconElement.classList.contains('e-pv-search-close')) {
                            this.enableSearchItems(false);
                        }
                        this.pdfViewer.textSearchModule.searchButtonClick(iconElement, this.searchInput, true);
                        this.setSearchInputWidth();
                    }
                },
                { template: searchCountTemplate },
                {
                    prefixIcon: this.pdfViewer.enableRtl ? 'e-pv-next-search-icon e-pv-icon' : 'e-pv-prev-search-icon e-pv-icon', id: this.pdfViewer.element.id + '_prev_occurrence',
                    click: (args: ClickEventArgs) => {
                        this.pdfViewer.textSearchModule.searchPrevious();
                        this.setSearchInputWidth();
                    }
                },
                {
                    prefixIcon: this.pdfViewer.enableRtl ? 'e-pv-prev-search-icon e-pv-icon' : 'e-pv-next-search-icon e-pv-icon', id: this.pdfViewer.element.id + '_next_occurrence',
                    click: (args: ClickEventArgs) => {
                        this.pdfViewer.textSearchModule.searchNext();
                        this.setSearchInputWidth();
                    }
                }
            ];
        } else {
            items = [
                { prefixIcon: 'e-pv-backward-icon e-pv-icon', id: this.pdfViewer.element.id + '_backward', click: this.closeBookmarkPane.bind(this, null) },
                { text: this.pdfViewer.localeObj.getConstant('Bookmarks') }
            ];
        }
        this.toolbar = new Tool({ items: items, width: '', height: '', overflowMode: 'Popup' });
        if (this.pdfViewer.enableRtl) {
            this.toolbar.enableRtl = true;
        }
        this.toolbar.isStringTemplate = true;
        this.toolbar.appendTo(this.toolbarElement);
        if (option === 'search') {
            const toolbarContainer: HTMLElement = this.pdfViewerBase.getElement('_toolbarContainer');
            if (toolbarContainer) {
                let toolbarHeight: number = toolbarContainer.clientHeight;
                if (toolbarHeight === 0) {
                    toolbarHeight = parseFloat(window.getComputedStyle(toolbarContainer)['height']) + 1;
                }
                this.pdfViewerBase.toolbarHeight = toolbarHeight;
            }
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
            const searchString: string = (this.searchInput as HTMLInputElement).value;
            const isEnter: boolean = event.key === 'Enter' || event.code === 'Enter';
            if (isEnter) {
                this.initiateTextSearch();
                this.setSearchInputWidth();
            } else {
                this.pdfViewer.textSearchModule.resetVariables();
            }
        });
        const searchElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_search_count');
        const parentContainer: HTMLElement = searchElement.parentElement;
        if (parentContainer) {
            parentContainer.style.display = 'none';
        }
        this.pdfViewer.textSearchModule.searchInput = this.searchInput;
        this.setSearchInputWidth();
        this.enableSearchItems(false);
        this.searchInput.focus();
    }

    private enableSearchItems(isEnable: boolean): void {
        if (!isBlazor()) {
            this.toolbar.enableItems(this.pdfViewerBase.getElement('_prev_occurrence').parentElement, isEnable);
            this.toolbar.enableItems(this.pdfViewerBase.getElement('_next_occurrence').parentElement, isEnable);
        } else {
            this.pdfViewer._dotnetInstance.invokeMethodAsync('EnableSearchItems', isEnable);
        }
    }

    private initiateBookmarks(): void {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.pdfViewerBase.mobileScrollerContainer.style.display = 'none';
            const mobileTool: any = document.querySelectorAll('.e-pv-mobile-annotation-toolbar');
            for (let i: number = 0; i < mobileTool.length; i++) {
                mobileTool[parseInt(i.toString(), 10)].style.display = 'none';
            }
        }
        const bookmarkContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_bookmarks_container', className: 'e-pv-bookmark-container' });
        bookmarkContainer.style.width = '100%';
        bookmarkContainer.style.height = this.pdfViewerBase.viewerContainer.style.height;
        this.pdfViewerBase.getElement('_viewerMainContainer').appendChild(bookmarkContainer);
        this.pdfViewerBase.viewerContainer.style.display = 'none';
        this.isBookmarkListOpen = true;
        this.pdfViewer.bookmarkViewModule.renderBookmarkContentMobile();
    }

    private initiateTextSearch(): void {
        const inputString: string = (this.searchInput as HTMLInputElement).value;
        this.pdfViewer.textSearchModule.initiateSearch(inputString, true);
    }

    /**
     * @private
     * @param {boolean} closeBookmarkView - tells whether to close the entire bookmark view
     * @returns {void}
     */
    public goBackToToolbar(closeBookmarkView?: boolean): void {
        this.isNavigationToolbarVisible = false;
        if (isBlazor() && (!Browser.isDevice || this.pdfViewer.enableDesktopMode) || !isBlazor()) {
            if (this.pdfViewer.textSearchModule) {
                this.pdfViewer.textSearchModule.cancelTextSearch();
            }
        }
        this.searchInput = null;
        if (this.pdfViewer.bookmarkViewModule.childNavigateCount !== 0 && !closeBookmarkView) {
            this.pdfViewer.bookmarkViewModule.bookmarkList.back();
            this.pdfViewer.bookmarkViewModule.childNavigateCount--;
        } else {
            if (closeBookmarkView) {
                this.pdfViewer.bookmark.childNavigateCount = 0;
            }
            if (this.toolbar != null) {
                this.toolbar.destroy();
                this.toolbar = null;
            }
            const bookmarkContainer: HTMLElement = this.pdfViewerBase.getElement('_bookmarks_container');
            if (bookmarkContainer) {
                bookmarkContainer.parentElement.removeChild(bookmarkContainer);
                if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                    this.pdfViewerBase.mobileScrollerContainer.style.display = '';
                }
            }
            if (this.toolbarElement && this.toolbarElement.parentElement != null) {
                this.toolbarElement.parentElement.removeChild(this.toolbarElement);
            }
            this.pdfViewerBase.viewerContainer.style.display = 'block';
            this.isBookmarkListOpen = false;
            this.isBookmarkOpenProgrammatically = false;
            this.isBookmarkOpen = false;
            if (!isBlazor()) {
                if (!this.pdfViewer.toolbar.annotationToolbarModule.isMobileAnnotEnabled) {
                    this.pdfViewer.toolbarModule.showToolbar(true);
                }
            } else {
                this.pdfViewerBase.onWindowResize();
            }
            this.pdfViewer.isBookmarkPanelOpen = false;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public setSearchInputWidth(): void {
        const searchInputParent: HTMLElement = this.searchInput.parentElement;
        const padding: string = window.getComputedStyle(searchInputParent.parentElement, null).getPropertyValue('padding-left');
        if (isBlazor() && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
            this.toolbarElement = this.pdfViewerBase.getElement('_navigationToolbar');
        }
        let width: number = this.toolbarElement.clientWidth - this.getParentElementSearchBox('_backward').clientWidth
            - this.getParentElementSearchBox('_search_box-icon').clientWidth - this.getParentElementSearchBox('_prev_occurrence').clientWidth
            - this.getParentElementSearchBox('_next_occurrence').clientWidth - this.getParentElementSearchBox('_search_count').clientWidth - 6;
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
     * @param {string} text - The text.
     * @returns {void}
     */
    public createTooltipMobile(text: string): void {
        if (!this.isTooltipCreated) {
            //boolean to prevent again toast creation.
            this.createMobileTooltip(text);
        } else {
            if (this.toastObject) {
                this.toastObject.title = text;
                const tooltipElement: HTMLElement = this.pdfViewerBase.getElement('_container_tooltip');
                const tooltipChild: HTMLElement = tooltipElement.firstElementChild as HTMLElement;
                if (tooltipChild) {
                    tooltipChild.style.width = 'auto';
                    tooltipChild.firstElementChild.firstElementChild.textContent = text;
                } else {
                    this.isTooltipCreated = false;
                    const tooltipElement: HTMLElement = this.pdfViewerBase.getElement('_container_tooltip');
                    if (this.toastObject) {
                        this.toastObject.destroy();
                    }
                    tooltipElement.parentElement.removeChild(tooltipElement);
                    this.toastObject = null;
                    this.createMobileTooltip(text);
                }
            }
        }
    }

    private createMobileTooltip(text: string): void {
        const tooltipDiv: HTMLElement = createElement('div', { className: 'e-pv-container-tooltip', id: this.pdfViewer.element.id + '_container_tooltip' });
        this.pdfViewer.element.appendChild(tooltipDiv);
        this.toastObject = new Toast({ title: text, target: this.pdfViewer.element, close: this.onTooltipClose.bind(this), position: { X: 0, Y: 0 }, animation: { hide: { duration: 200, effect: 'FadeOut' } } });
        this.toastObject.appendTo(tooltipDiv);
        const y: number = this.pdfViewer.element.clientHeight * 0.65;
        const x: number = (this.pdfViewer.element.clientWidth - tooltipDiv.clientWidth) / 2;
        this.isTooltipCreated = true;
        this.toastObject.show({ position: { X: x, Y: y } });
        const tooltipChild: HTMLElement = tooltipDiv.firstElementChild as HTMLElement;
        if (tooltipChild) {
            tooltipChild.style.width = 'auto';
        }
    }

    private onTooltipClose(args: ToastCloseArgs): void {
        if (this.pdfViewer.textSearchModule) {
            this.isTooltipCreated = false;
            const tooltipElement: HTMLElement = this.pdfViewerBase.getElement('_container_tooltip');
            this.pdfViewer.textSearchModule.isMessagePopupOpened = false;
            if (this.toastObject) {
                this.toastObject.destroy();
            }
            tooltipElement.parentElement.removeChild(tooltipElement);
            this.toastObject = null;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public toolbarResize(): void {
        if (this.searchInput) {
            this.searchInput.style.width = 'auto';
            this.setSearchInputWidth();
        }
    }

    private createSidebarToolBar(): void {
        if (!isBlazor()) {
            const isMac: boolean = /ipad|iphone|ipod|mac/.test(navigator.userAgent.toLowerCase()) ? true : false;
            this.thumbnailButton = createElement('button', { id: this.pdfViewer.element.id + '_thumbnail-view', attrs: { 'disabled': 'disabled', 'aria-label': 'Page Thumbnails', 'tabindex': '-1' } });
            this.thumbnailButton.className = 'e-pv-tbar-btn e-pv-thumbnail-view-button e-btn';
            this.thumbnailButton.setAttribute('type', 'button');
            const thumbnailButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_thumbnail-view' + '_icon', className: 'e-pv-thumbnail-view-disable-icon e-pv-icon' });
            this.thumbnailButton.appendChild(thumbnailButtonSpan);
            const thumbnailTooltip: Tooltip = new Tooltip({ content:  initializeCSPTemplate(
                function (): string { return this.pdfViewer.localeObj.getConstant('Page Thumbnails') + (isMac ? ' (⌘+⌥+1)' : ' (Ctrl+Alt+1)'); }, this
            ), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
            thumbnailTooltip.appendTo(this.thumbnailButton);
            this.bookmarkButton = createElement('button', { id: this.pdfViewer.element.id + '_bookmark', attrs: { 'disabled': 'disabled', 'aria-label': 'Bookmarks', 'tabindex': '-1' } });
            this.bookmarkButton.setAttribute('type', 'button');
            this.bookmarkButton.className = 'e-pv-tbar-btn e-pv-bookmark-button e-btn';
            const buttonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_bookmark' + '_icon', className: 'e-pv-bookmark-disable-icon e-pv-icon' });
            this.bookmarkButton.appendChild(buttonSpan);
            const bookMarkTooltip: Tooltip = new Tooltip({ content:  initializeCSPTemplate(
                function (): string { return this.pdfViewer.localeObj.getConstant('Bookmarks') + (isMac ? ' (⌘+⌥+2)' : ' (Ctrl+Alt+2)'); }, this
            ), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
            bookMarkTooltip.appendTo(this.bookmarkButton);
            this.sideBarToolbar.appendChild(this.thumbnailButton);
            this.sideBarToolbar.appendChild(this.bookmarkButton);
            this.addOrganizePageButton(this.pdfViewer.enablePageOrganizer);
        } else {
            this.thumbnailButton = this.pdfViewer.element.querySelector('.e-pv-thumbnail-view-button');
            this.bookmarkButton = this.pdfViewer.element.querySelector('.e-pv-bookmark-button');
        }
        this.thumbnailButton.addEventListener('click', this.sideToolbarOnClick);
        this.bookmarkButton.addEventListener('click', this.bookmarkButtonOnClick);
        if (this.organizePageButton) {
            this.organizePageButton.addEventListener('click', this.organizeButtonOnClick);
        }
    }
    /**
     * @private
     * @param {boolean} enablePageOrganizer - indicates whether page organizer is enabled
     * @returns {void}
     */
    public addOrganizePageButton(enablePageOrganizer: boolean): void {
        if (!isNullOrUndefined(this.organizePageButton)) {
            this.organizePageButton.remove();
        }
        if (enablePageOrganizer) {
            const isMac: boolean = /ipad|iphone|ipod|mac/.test(navigator.userAgent.toLowerCase()) ? true : false;
            this.organizePageButton = createElement('button', { id: this.pdfViewer.element.id + '_organize-view', attrs: { 'disabled': 'disabled', 'aria-label': 'Organize Pages', 'tabindex': '-1' } });
            this.organizePageButton.className = 'e-pv-tbar-btn e-pv-organize-view-button e-btn';
            this.organizePageButton.setAttribute('type', 'button');
            const organizeButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_organize-view' + '_icon', className: 'e-pv-organize-view-disable-icon e-pv-icon' });
            this.organizePageButton.appendChild(organizeButtonSpan);
            const organizeButtonTooltip: Tooltip = new Tooltip({
                content: initializeCSPTemplate(
                    function (): string { return this.pdfViewer.localeObj.getConstant('Organize Pages') + (isMac ? ' (⌘+⌥+3)' : ' (Ctrl+Alt+3)'); }, this
                ), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this)
            });
            organizeButtonTooltip.appendTo(this.organizePageButton);
            this.sideBarToolbar.appendChild(this.organizePageButton);
            this.organizePageButton.addEventListener('click', this.organizeButtonOnClick);
        }
        else {
            this.organizePageButton = null;
        }
    }

    private onTooltipBeforeOpen(args: TooltipEventArgs): void {
        if (!this.pdfViewer.toolbarSettings.showTooltip || (args.target as any).disabled) {
            args.cancel = true;
        }
    }

    /**
     * @param {boolean} isEnable - This is isEnable
     * @private
     * @returns {void}
     */
    public enableOrganizeButton(isEnable: boolean): void {
        if (this.organizePageButton) {
            if (isEnable) {
                this.organizePageButton.removeAttribute('disabled');
                this.organizePageButton.children[0].classList.remove('e-pv-organize-view-disable-icon');
                this.organizePageButton.children[0].classList.add('e-pv-organize-view-icon');
                this.organizePageButton.setAttribute('tabindex', '0');
            }
            else {
                this.organizePageButton.setAttribute('disabled', 'disabled');
                this.organizePageButton.children[0].classList.remove('e-pv-organize-view-icon');
                this.organizePageButton.children[0].classList.add('e-pv-organize-view-disable-icon');
                this.organizePageButton.setAttribute('tabindex', '-1');
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public enableThumbnailButton(): void {
        if (this.thumbnailButton) {
            this.thumbnailButton.removeAttribute('disabled');
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-disable-icon');
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-icon');
            this.thumbnailButton.setAttribute('tabindex', '0');
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public enableBookmarkButton(): void {
        if (this.bookmarkButton) {
            this.bookmarkButton.removeAttribute('disabled');
            this.bookmarkButton.children[0].classList.remove('e-pv-bookmark-disable-icon');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-icon');
            this.bookmarkButton.setAttribute('tabindex', '0');
        }
    }

    private createSidebarTitleCloseButton(): void {
        this.closeDiv = createElement('button', { id: this.pdfViewer.element.id + '_close_btn' });
        this.closeDiv.setAttribute('aria-label', 'close button');
        this.closeDiv.setAttribute('type', 'button');
        this.closeDiv.className = 'e-btn e-pv-tbar-btn e-pv-title-close-div e-btn';
        if (this.pdfViewer.enableRtl) {
            this.closeDiv.style.left = 8 + 'px';
        } else {
            this.closeDiv.style.left = this.closeButtonLeft + 'px';
        }
        const buttonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_close' + '_icon', className: 'e-pv-title-close-icon e-pv-icon' });
        this.closeDiv.appendChild(buttonSpan);
        this.sideBarTitleContainer.appendChild(this.closeDiv);
        this.closeDiv.addEventListener('click', this.sideToolbarOnClose);
    }

    private createResizeIcon(): void {
        this.resizeIcon = createElement('div', { id: this.pdfViewer.element.id + '_resize', className: 'e-pv-resize-icon e-pv-icon' });
        this.setResizeIconTop();
        this.resizeIcon.style.position = 'absolute';
        this.resizeIcon.addEventListener('click', this.sideToolbarOnClose);
        this.resizeIcon.addEventListener('mouseover', this.resizeIconMouseOver);
        this.sideBarResizer.appendChild(this.resizeIcon);
    }

    /**
     * @private
     * @returns {void}
     */
    public setResizeIconTop(): void {
        if (this.sideBarToolbar && this.sideBarToolbar.clientHeight && this.resizeIcon.style.top === '') {
            this.resizeIcon.style.top = (this.sideBarToolbar.clientHeight) / 2 + 'px';
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public setCommentPanelResizeIconTop(): void {
        if (this.commentPanelContainer && this.commentPanelContainer.clientHeight && this.commentPanelResizeIcon && this.commentPanelResizeIcon.style.top === '') {
            this.commentPanelResizeIcon.style.top = (this.commentPanelContainer.clientHeight) / 2 + 'px';
        }
    }
    /**
     * @param {MouseEvent} event - The event.
     * @returns {void}
     */
    private resizeIconMouseOver = (event: MouseEvent): void => {
        (event.target as HTMLElement).style.cursor = 'e-resize';
    };
    /**
     * @param {MouseEvent} event - The event.
     * @returns {void}
     */
    private resizePanelMouseDown = (event: MouseEvent): void => {
        let proxy: NavigationPane = null;
        // eslint-disable-next-line
        proxy = this;
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
    };
    /**
     * @param {MouseEvent} event - The event.
     * @returns {void}
     */
    private resizeViewerMouseLeave = (event: MouseEvent): void => {
        let proxy: NavigationPane = null;
        // eslint-disable-next-line
        proxy = this;
        if (proxy.isDown) {
            setTimeout(() => {
                proxy.pdfViewerBase.onWindowResize();
            }, 200);
        }
        proxy.isDown = false;
        if (proxy.isNavigationPaneResized && proxy.sideBarContentContainer) {
            proxy.pdfViewerBase.viewerContainer.style.cursor = 'default';
            proxy.sideBarContentContainer.style.cursor = 'default';
            proxy.isNavigationPaneResized = false;
        }
        if (proxy.commentPanelContainer &&  proxy.isCommentPanelShow) {
            this.commentPanelMouseLeave(event);
            proxy.isCommentPanelShow = false;
        }
    };
    /**
     * @private
     * @returns {number} - Returns the number.
     */
    get outerContainerWidth(): number {
        if (!this.mainContainerWidth) {
            this.mainContainerWidth = this.pdfViewerBase.mainContainer.clientWidth;
        }
        return this.mainContainerWidth;
    }

    /**
     * @private
     * @returns {number} - Returns the number.
     */
    public getViewerContainerScrollbarWidth(): number {
        return (this.pdfViewerBase.viewerContainer.offsetWidth + this.pdfViewerBase.viewerContainer.offsetLeft) -
         (this.pdfViewerBase.viewerContainer.clientWidth + this.pdfViewerBase.viewerContainer.offsetLeft);
    }

    /**
     * @private
     * @returns {number} - Returns the number.
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
     * @returns {number} - Returns the number.
     */
    get sideBarContentContainerWidth(): number {
        if (this.sideBarContentContainer) {
            return this.sideBarContentContainer.clientWidth;
        } else {
            return 0;
        }
    }

    /**
     * @private
     * @returns {number} - Returns the number.
     */
    get commentPanelContainerWidth(): number {
        if (this.commentPanelContainer) {
            return this.commentPanelContainer.offsetWidth;
        } else {
            return 0;
        }
    }
    /**
     * @param {MouseEvent} event - The event.
     * @returns {void}
     */
    private resizePanelMouseMove = (event: MouseEvent): void => {
        let proxy: NavigationPane = null;
        // eslint-disable-next-line
        proxy = this;
        if (!this.pdfViewerBase.getPopupNoteVisibleStatus()) {
            const target: HTMLElement = event.target as HTMLElement;
            if (this.pdfViewerBase.skipPreventDefault(target)) {
                event.preventDefault();
            }
            if (proxy.isDown && this.sideBarContentContainer) {
                // prevent the sidebar from becoming too narrow, or from occupying more
                // than half of the available viewer width.
                if (this.pdfViewer.enableRtl) {
                    const currentWidth: number = this.previousX - event.clientX;
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
                    proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerLeft() + 'px';
                    proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerRight() + 'px';

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
                    proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerLeft() + 'px';
                    proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerRight() + 'px';
                }
                const viewerWidth: number = ((proxy.pdfViewer.element.clientWidth > 0 ? proxy.pdfViewer.element.clientWidth :
                    proxy.pdfViewer.element.offsetWidth) - proxy.getViewerContainerLeft() - proxy.getViewerContainerRight());
                proxy.pdfViewerBase.viewerContainer.style.width = viewerWidth + 'px';
                proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
                proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
                proxy.pdfViewer.thumbnailViewModule.renderViewPortThumbnailImage();
                proxy.pdfViewerBase.updateZoomValue();
                if (!proxy.bookmarkButton.children[0].classList.contains('e-pv-bookmark-disable-icon')) {
                    proxy.pdfViewer.bookmarkViewModule.setBookmarkContentHeight();
                }
            } else if (proxy.isCommentPanelShow && this.commentPanelContainer) {
                this.updateCommentPanelContainer(event);
            }
        }
    };
    /**
     * @param {MouseEvent} event - The event.
     * @returns {void}
     */
    private sideToolbarOnClose = (event: MouseEvent): void => {
        let proxy: NavigationPane = null;
        // eslint-disable-next-line
        proxy = this;
        proxy.removeThumbnailSelectionIconTheme();
        proxy.removeBookmarkSelectionIconTheme();
        proxy.updateViewerContainerOnClose();
        proxy.pdfViewerBase.focusViewerContainer();
        proxy.isThumbnailAddedProgrammatically = false;
        proxy.isBookmarkOpenProgrammatically = false;
        proxy.isThumbnail = false;
        proxy.isBookmarkOpen = false;
        proxy.isThumbnailOpen = false;
        proxy.pdfViewer.isBookmarkPanelOpen = false;
        proxy.pdfViewer.isThumbnailViewOpen = false;
    };
    /**
     * @private
     * @returns {void}
     */
    public updateViewerContainerOnClose(): void {
        let proxy: NavigationPane = null;
        // eslint-disable-next-line
        proxy = this;
        if (proxy.sideBarContentContainer) {
            proxy.sideBarContentContainer.style.display = 'none';
            if (this.pdfViewer.enableRtl) {
                proxy.pdfViewerBase.viewerContainer.style.right = (proxy.sideToolbarWidth) + 'px';
            } else {
                proxy.pdfViewerBase.viewerContainer.style.left = (proxy.sideToolbarWidth) + 'px';
            }
            proxy.pdfViewerBase.viewerContainer.style.width = ((proxy.pdfViewer.element.clientWidth > 0 ? proxy.pdfViewer.element.clientWidth : proxy.pdfViewer.element.offsetWidth) - proxy.sideToolbarWidth - proxy.getViewerContainerRight()) + 'px';
            proxy.pdfViewerBase.pageContainer.style.width = (proxy.pdfViewerBase.viewerContainer.offsetWidth - proxy.getViewerContainerScrollbarWidth()) + 'px';
            if (this.restrictUpdateZoomValue){
                proxy.pdfViewerBase.updateZoomValue();
            }
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public updateViewerContainerOnExpand(): void {
        let proxy: NavigationPane = null;
        // eslint-disable-next-line
        proxy = this;
        if (proxy.sideBarContentContainer) {
            if (!isNullOrUndefined(this.pdfViewer.thumbnailViewModule) && !this.pdfViewer.thumbnailViewModule.isThubmnailOpen) {
                proxy.sideBarContentContainer.style.display = 'block';
            }
            if (proxy.pdfViewer.isBookmarkPanelOpen || this.isBookmarkOpen) {
                proxy.sideBarContentContainer.style.display = 'block';
            }
            if (this.pdfViewer.enableRtl) {
                proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerLeft() + 'px';
            } else {
                proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerLeft() + 'px';
            }
            proxy.pdfViewerBase.viewerContainer.style.width = ((proxy.pdfViewer.element.clientWidth > 0 ? proxy.pdfViewer.element.clientWidth : proxy.pdfViewer.element.offsetWidth) - this.getViewerContainerLeft() - this.getViewerContainerRight()) + 'px';
            proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
            proxy.pdfViewerBase.updateZoomValue();
            if (proxy.pdfViewer.enableThumbnail) {
                proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
                proxy.pdfViewer.thumbnailViewModule.renderViewPortThumbnailImage();
            }
        }
    }
    /**
     * @private
     * @returns {number} - Returns the number.
     */
    public getViewerContainerLeft(): number {
        if (this.sideToolbarWidth) {
            return (this.sideToolbarWidth + this.sideBarContentContainerWidth);
        } else if (this.sideToolbarWidth === 0 && !this.pdfViewer.enableNavigationToolbar) {
            return (this.sideBarContentContainerWidth);
        }
        else {
            return 0;
        }
    }
    /**
     * @private
     * @returns {number} - Returns the number.
     */
    public getViewerContainerRight(): number {
        if (this.commentPanelResizer) {
            return (this.commentPanelContainerWidth + this.commentPanelResizer.clientWidth);
        } else if (this.sideToolbarWidth === 0 && !this.pdfViewer.enableNavigationToolbar) {
            return (this.sideBarContentContainerWidth);
        }
        else {
            return 0;
        }
    }
    /**
     * @private
     * @returns {number} - Returns the number.
     */
    public getViewerMainContainerWidth(): number {
        return (this.pdfViewer.element.clientWidth > 0 ? this.pdfViewer.element.clientWidth : this.pdfViewer.element.offsetWidth) -
        this.sideToolbarWidth;
    }

    /**
     * Private method to handle the click event of the "organize" button.
     *
     * @param {MouseEvent} event - The MouseEvent object representing the click event.
     * @returns {void}
     */
    private organizeButtonOnClick = (event: MouseEvent): void => {
        if (!isNullOrUndefined(this.pdfViewer.pageOrganizer)) {
            this.pdfViewer.pageOrganizer.createOrganizeWindow();
        }
    }

    /**
     * @param {MouseEvent} event - The event.
     * @private
     * @returns {void}
     */
    public sideToolbarOnClick = (event: MouseEvent | KeyboardEvent): void => {
        this.sideBarTitle.textContent = this.pdfViewer.localeObj.getConstant('Page Thumbnails');
        this.sideBarContent.setAttribute('aria-label', 'Thumbnail View Panel');
        let proxy: NavigationPane = null;
        // eslint-disable-next-line
        proxy = this;
        const bookmarkPane: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_bookmark_view');
        if (bookmarkPane) {
            proxy.removeBookmarkSelectionIconTheme();
            bookmarkPane.style.display = 'none';
        }
        document.getElementById(this.pdfViewer.element.id + '_thumbnail_view').style.display = 'flex';
        if (proxy.sideBarContentContainer) {
            if (proxy.sideBarContentContainer.style.display !== 'none') {
                if (proxy.isBookmarkOpen) {
                    proxy.isThumbnailOpen = true;
                    proxy.isThumbnail = true;
                    proxy.setThumbnailSelectionIconTheme();
                    proxy.updateViewerContainerOnExpand();
                    (document.getElementById(proxy.pdfViewer.element.id + '_thumbnail_image_' + (proxy.pdfViewerBase.currentPageNumber - 1)) as any).focus();
                    proxy.isThumbnailAddedProgrammatically = true;
                    proxy.pdfViewer.isThumbnailViewOpen = true;
                } else {
                    proxy.isThumbnailOpen = false;
                    proxy.removeThumbnailSelectionIconTheme();
                    proxy.updateViewerContainerOnClose();
                    proxy.isThumbnailAddedProgrammatically = false;
                    proxy.isThumbnail = false;
                    proxy.pdfViewer.isThumbnailViewOpen = false;
                }
            } else {
                proxy.sideBarContent.focus();
                proxy.isThumbnailOpen = true;
                proxy.setThumbnailSelectionIconTheme();
                proxy.updateViewerContainerOnExpand();
                proxy.isThumbnail = true;
                if (!isNullOrUndefined((document.getElementById(proxy.pdfViewer.element.id + '_thumbnail_image_' + (proxy.pdfViewerBase.currentPageNumber - 1)) as any))) {
                    (document.getElementById(proxy.pdfViewer.element.id + '_thumbnail_image_' + (proxy.pdfViewerBase.currentPageNumber - 1)) as any).focus();
                }
                proxy.isThumbnailAddedProgrammatically = true;
                proxy.pdfViewer.isThumbnailViewOpen = true;
            }
        }
        proxy.isBookmarkOpen = false;
        proxy.isBookmarkOpenProgrammatically = false;
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            const currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber, 10);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
        proxy.pdfViewer.isBookmarkPanelOpen = false;
    };

    /**
     * @private
     * @returns {void}
     */
    public openThumbnailPane = (): void => {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            return;
        }
        if (this.isThumbnailOpen || this.isThumbnail || this.isThumbnailAddedProgrammatically) {
            return;
        }
        let proxy: NavigationPane = null;
        // eslint-disable-next-line
        proxy = this;
        const sideBarContent: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_sideBarContent');
        const sideBarContentContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_sideBarContentContainer');
        const viewerContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_viewerContainer');
        const pageContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageViewContainer');
        document.getElementById(this.pdfViewer.element.id + '_thumbnail_view').style.display = 'block';
        proxy.sideBarTitle.textContent = this.pdfViewer.localeObj.getConstant('Page Thumbnails');
        proxy.sideBarContent.setAttribute('aria-label', 'Thumbnail View Panel');
        proxy.sideBarContent.setAttribute('tabindex', '0');
        const bookmarkPane: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_bookmark_view');
        if (bookmarkPane) {
            proxy.removeBookmarkSelectionIconTheme();
            bookmarkPane.style.display = 'none';
        }
        if (sideBarContentContainer  && !this.isThumbnailAddedProgrammatically) {
            if (proxy.isThumbnail) {
                sideBarContentContainer.style.display = 'none';
                viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth > 0 ? proxy.pdfViewer.element.clientWidth : proxy.pdfViewer.element.offsetWidth) + 'px';
                pageContainer.style.width = viewerContainer.clientWidth + 'px';
                viewerContainer.style.left = sideBarContentContainer.clientWidth + 'px';
                proxy.pdfViewerBase.updateZoomValue();
                proxy.removeThumbnailSelectionIconTheme();
                proxy.isThumbnail = false;
                proxy.pdfViewer.isThumbnailViewOpen = false;
            } else {
                sideBarContent.focus();
                proxy.setThumbnailSelectionIconTheme();
                proxy.updateViewerContainerOnExpand();
                proxy.isThumbnail = true;
                proxy.pdfViewerBase.updateZoomValue();
                if (!isNullOrUndefined(proxy.pdfViewer.thumbnailViewModule)) {
                    proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
                }
                proxy.isThumbnailAddedProgrammatically = true;
                proxy.isThumbnailOpen = true;
                proxy.isBookmarkOpen = false;
                proxy.isBookmarkOpenProgrammatically = false;
                proxy.pdfViewer.isBookmarkPanelOpen = false;
                proxy.pdfViewer.isThumbnailViewOpen = true;
            }
        }
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            const currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber, 10);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
    };

    /**
     * @private
     * @returns {void}
     */
    public closeThumbnailPane  = (): void => {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            return;
        }
        let proxy : NavigationPane = null;
        // eslint-disable-next-line
        proxy = this;
        if (proxy.isThumbnail || proxy.isThumbnailAddedProgrammatically || proxy.isThumbnailOpen) {
            proxy.sideBarContent.removeAttribute('tabindex');
            proxy.removeThumbnailSelectionIconTheme();
            proxy.isThumbnailOpen = false;
            proxy.updateViewerContainerOnClose();
            proxy.isThumbnailAddedProgrammatically = false;
            proxy.isThumbnail = false;
            proxy.pdfViewer.isThumbnailViewOpen = false;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public setThumbnailSelectionIconTheme(): void {
        if (this.thumbnailButton) {
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-icon');
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-selection-icon');
            this.thumbnailButton.classList.add('e-pv-thumbnail-view-button-selection');
        }
    }

    private removeThumbnailSelectionIconTheme(): void {
        if (this.thumbnailButton && this.thumbnailButton.children[0]) {
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-icon');
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-selection-icon');
            this.thumbnailButton.classList.remove('e-pv-thumbnail-view-button-selection');
        }
    }

    private resetThumbnailIcon(): void {
        if (this.thumbnailButton && this.thumbnailButton.children[0]){
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-icon');
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-disable-icon');
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public resetThumbnailView(): void {
        if (this.sideBarContentContainer) {
            this.sideBarContentContainer.style.display = 'none';
            if (this.pdfViewer.enableRtl) {
                this.pdfViewerBase.viewerContainer.style.left = 1 + 'px';
            } else {
                this.pdfViewerBase.viewerContainer.style.left = (this.sideToolbarWidth) + 'px';
            }
            this.pdfViewerBase.viewerContainer.style.width = ((this.pdfViewer.element.clientWidth > 0 ? this.pdfViewer.element.clientWidth : this.pdfViewer.element.offsetWidth) - this.sideToolbarWidth - this.getViewerContainerRight()) + 'px';
            if (this.pdfViewerBase.pageContainer) {
                this.pdfViewerBase.pageContainer.style.width = this.pdfViewerBase.viewerContainer.clientWidth + 'px';
            }
            this.thumbnailButton.setAttribute('disabled', 'disabled');
            this.removeThumbnailSelectionIconTheme();
            this.resetThumbnailIcon();
        }
    }
    /**
     * @param {MouseEvent} event - The event.
     * @private
     * @returns {void}
     */
    public bookmarkButtonOnClick = (event: MouseEvent | KeyboardEvent): void => {
        this.openBookmarkcontentInitially(true);
    };

    private setBookmarkSelectionIconTheme(): void {
        if (this.bookmarkButton) {
            this.bookmarkButton.children[0].classList.remove('e-pv-bookmark-icon');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-selection-icon');
            this.bookmarkButton.classList.add('e-pv-bookmark-button-selection');
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public removeBookmarkSelectionIconTheme(): void {
        if (this.bookmarkButton && this.bookmarkButton.children[0]) {
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
        if (event.target === this.sideBarToolbar) {
            this.pdfViewerBase.focusViewerContainer();
        }
    }

    /**
     * @param {boolean} isSideToolbarOnClick - This is isSideToolbarOnClick
     * @private
     * @returns {void}
     */
    public openBookmarkcontentInitially(isSideToolbarOnClick?: boolean): void {
        // eslint-disable-next-line
        const proxy: NavigationPane = this;
        if (!(proxy.pdfViewer.bookmark && proxy.pdfViewer.bookmark.bookmarks)) {
            return;
        }
        if (!isSideToolbarOnClick && this.isBookmarkOpen) {
            return;
        }
        if (document.getElementById(proxy.pdfViewer.element.id + '_thumbnail_view')) {
            document.getElementById(proxy.pdfViewer.element.id + '_thumbnail_view').style.display = 'none';
        }
        proxy.removeThumbnailSelectionIconTheme();
        proxy.sideBarTitle.textContent = proxy.pdfViewer.localeObj.getConstant('Bookmarks');
        proxy.sideBarContent.setAttribute('aria-label', 'Bookmark View Panel');
        proxy.sideBarContent.setAttribute('role', 'navigation');
        proxy.pdfViewer.bookmarkViewModule.renderBookmarkcontent();
        if (proxy.sideBarContentContainer && (isSideToolbarOnClick || !proxy.isBookmarkOpenProgrammatically)) {
            if (proxy.sideBarContentContainer.style.display !== 'none') {
                if (proxy.isThumbnailOpen) {
                    proxy.pdfViewer.isThumbnailViewOpen = false;
                    proxy.setBookmarkSelectionIconTheme();
                    proxy.isBookmarkOpen = true;
                    proxy.updateViewerContainerOnExpand();
                    proxy.isThumbnail = false;
                    proxy.isThumbnailAddedProgrammatically = false;
                    proxy.isBookmarkOpenProgrammatically = true;
                    proxy.pdfViewer.isBookmarkPanelOpen = true;
                } else {
                    proxy.removeBookmarkSelectionIconTheme();
                    proxy.isBookmarkOpen = false;
                    proxy.updateViewerContainerOnClose();
                    proxy.isBookmarkOpenProgrammatically = false;
                    proxy.pdfViewer.isBookmarkPanelOpen = false;
                }
            } else {
                proxy.sideBarContent.focus();
                proxy.setBookmarkSelectionIconTheme();
                proxy.isBookmarkOpen = true;
                proxy.updateViewerContainerOnExpand();
                proxy.isBookmarkOpenProgrammatically = true;
                proxy.pdfViewer.isThumbnailViewOpen = false;
                proxy.pdfViewer.isBookmarkPanelOpen = true;
            }
        }
        proxy.isThumbnailOpen = false;
        if (proxy.pdfViewer.annotationModule && proxy.pdfViewer.annotationModule.inkAnnotationModule) {
            const currentPageNumber: number = parseInt(proxy.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber, 10);
            proxy.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
        if (proxy.isBookmarkOpen) {
            document.getElementById(proxy.pdfViewer.element.id + '_bookmark_view').focus();
        }
    }

    /**
     * @private
     * @param {boolean} isAPI - indicates whether the method is called from closeBookmarkPane API
     * @returns {void}
     */

    public closeBookmarkPane  = (isAPI?: boolean): void => {
        // eslint-disable-next-line
        const proxy : NavigationPane = this;
        if (proxy.isBookmarkOpen || proxy.isBookmarkOpenProgrammatically || proxy.isBookmarkListOpen) {
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                proxy.goBackToToolbar(isAPI);
            }
            else {
                proxy.removeBookmarkSelectionIconTheme();
                proxy.updateViewerContainerOnClose();
                proxy.isBookmarkOpen = false;
                proxy.isBookmarkListOpen = false;
                proxy.isBookmarkOpenProgrammatically = false;
                proxy.pdfViewer.isBookmarkPanelOpen = false;
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public disableBookmarkButton(): void {
        if (this.sideBarContentContainer && this.bookmarkButton && this.bookmarkButton.children[0]) {
            const bookmarkContent: any = this.pdfViewer.element.querySelector('.e-pv-bookmark-view');
            if (bookmarkContent) {
                bookmarkContent.style.display = 'none';
            }
            this.bookmarkButton.setAttribute('disabled', 'disabled');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-disable-icon');
        }
    }
    /**
     * @param {MouseEvent} event - The event.
     * @returns {void}
     */
    private commentPanelMouseDown = (event: MouseEvent): void => {
        let proxy: NavigationPane = null;
        // eslint-disable-next-line
        proxy = this;
        proxy.offset = [
            proxy.commentPanelResizer.offsetLeft - event.clientX,
            proxy.commentPanelResizer.offsetTop - event.clientY,
            proxy.getViewerContainerRight()
        ];
        this.isCommentPanelShow = true;
        this.previousX = event.clientX;
        proxy.pdfViewerBase.viewerContainer.style.cursor = 'e-resize';
        proxy.commentPanelResizer.style.cursor = 'e-resize';
    };
    /**
     * @param {MouseEvent} event - The event.
     * @returns {void}
     */
    private updateCommentPanelContainer = (event: MouseEvent): void => {
        let proxy: NavigationPane = null;
        // eslint-disable-next-line
        proxy = this;
        // prevent the commentPanel from becoming too narrow, or from occupying more
        // than half of the available viewer width.
        if (this.pdfViewer.enableRtl) {
            let width: number = event.clientX + proxy.offset[0];
            const maxWidth: number = Math.floor(this.outerContainerWidth / 2);
            if (width > maxWidth) {
                width = maxWidth;
            }
            if (width < this.commentPanelWidthMin) {
                width = this.commentPanelWidthMin;
            }
            proxy.commentPanelResizer.style.left = width + 'px';
            proxy.commentPanelContainer.style.width = width + 'px';
            proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerRight() + 'px';
            proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerLeft() + 'px';
        } else {
            const currentWidth: number = this.previousX - event.clientX;
            let width: number = currentWidth + proxy.offset[2];
            const maxWidth: number = Math.floor(this.outerContainerWidth / 2);
            if (width > maxWidth) {
                width = maxWidth;
            }
            if (width < this.commentPanelWidthMin) {
                width = this.commentPanelWidthMin;
            }
            proxy.commentPanelResizer.style.right = width + 'px';
            proxy.commentPanelContainer.style.width = width + 'px';
            proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerRight() + 'px';
            proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerLeft() + 'px';
        }
        this.pdfViewer.annotation.stickyNotesAnnotationModule.updateCommentPanelTextTop();

        const viewerWidth: number = ((proxy.pdfViewer.element.clientWidth > 0 ? proxy.pdfViewer.element.clientWidth :
            proxy.pdfViewer.element.offsetWidth) - proxy.getViewerContainerLeft() - proxy.getViewerContainerRight());
        proxy.pdfViewerBase.viewerContainer.style.width = viewerWidth + 'px';
        proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
        proxy.calculateCommentPanelWidth();
        proxy.pdfViewerBase.updateZoomValue();
    };
    /**
     * @private
     * @returns {void}
     */
    public calculateCommentPanelWidth(): void {
        const commentTitleCollections: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('e-pv-comment-title') as HTMLCollectionOf<HTMLElement>;
        const commentTitleMoreIconCollections: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('e-pv-more-options-button e-btn') as HTMLCollectionOf<HTMLElement>;
        for (let i: number = 0; i < commentTitleCollections.length; i++) {
            const commentTitleElement: HTMLElement = commentTitleCollections[parseInt(i.toString(), 10)];
            const moreIconElement: HTMLElement = commentTitleMoreIconCollections[parseInt(i.toString(), 10)];
            if (commentTitleElement.parentElement.clientWidth > 0 && moreIconElement.clientWidth > 0) {
                commentTitleElement.style.maxWidth = (commentTitleElement.parentElement.clientWidth - moreIconElement.clientWidth) + 'px';
            }
        }
        const replyTitleCollections: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('e-pv-reply-title') as HTMLCollectionOf<HTMLElement>;
        const replyTitleMoreIconCollections: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('e-pv-more-options-button e-btn') as HTMLCollectionOf<HTMLElement>;
        for (let j: number = 0; j < replyTitleCollections.length; j++) {
            const replyTitleElement: HTMLElement = replyTitleCollections[parseInt(j.toString(), 10)];
            const elementOfMoreIcon: HTMLElement = replyTitleMoreIconCollections[parseInt(j.toString(), 10)];
            replyTitleElement.style.maxWidth = (replyTitleElement.parentElement.clientWidth - elementOfMoreIcon.clientWidth) + 'px';
        }
    }
    /**
     * @param {MouseEvent} event - The event.
     * @returns {void}
     */
    private commentPanelMouseLeave = (event: MouseEvent): void => {
        let proxy: NavigationPane = null;
        // eslint-disable-next-line
        proxy = this;
        if (proxy.commentPanelContainer) {
            proxy.pdfViewerBase.viewerContainer.style.cursor = 'default';
            proxy.commentPanelContainer.style.cursor = 'default';
        }
    };

    /**
     * @private
     * @returns {void}
     */
    public clear(): void {
        if (!Browser.isDevice) {
            this.removeBookmarkSelectionIconTheme();
            this.removeThumbnailSelectionIconTheme();
            this.closeCommentPanelContainer();
        }
        if (this.commentsContentContainer) {
            this.commentsContentContainer.innerHTML = '';
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.sideBarResizer) {
            this.sideBarResizer.removeEventListener('mousedown', this.resizePanelMouseDown);
        }
        if (this.pdfViewerBase.mainContainer) {
            this.pdfViewerBase.mainContainer.removeEventListener('mousemove', this.resizePanelMouseMove);
            this.pdfViewerBase.mainContainer.removeEventListener('mouseup', this.resizeViewerMouseLeave);
        }
        if (this.sideBarToolbar) {
            this.sideBarToolbar.removeEventListener('mouseup', this.sideToolbarOnMouseup.bind(this));
        }
        if (this.sideBarContentContainer) {
            this.sideBarContentContainer.removeEventListener('mouseup', this.sideBarTitleOnMouseup.bind(this));
        }
        if (this.commentPanelResizer) {
            this.commentPanelResizer.removeEventListener('mousedown', this.commentPanelMouseDown);
        }
        if (this.annotationInputElement) {
            this.annotationInputElement.removeEventListener('change', this.loadImportAnnotation);
        }
        if (this.annotationXFdfInputElement) {
            this.annotationXFdfInputElement.removeEventListener('change', this.loadImportAnnotation);
        }
        if (this.searchInput) {
            this.searchInput.removeEventListener('keyup', (event: KeyboardEvent) => {
                this.enableSearchItems(true);
                const searchString: string = (this.searchInput as HTMLInputElement).value;
                const isEnter: boolean = event.key === 'Enter' || event.code === 'Enter';
                if (isEnter) {
                    this.initiateTextSearch();
                    this.setSearchInputWidth();
                } else {
                    this.pdfViewer.textSearchModule.resetVariables();
                }
            });
        }
        if (this.resizeIcon) {
            this.resizeIcon.removeEventListener('click', this.sideToolbarOnClose);
            this.resizeIcon.removeEventListener('mouseover', this.resizeIconMouseOver);
        }
        if (this.closeDiv) {
            this.closeDiv.removeEventListener('click', this.sideToolbarOnClose);
        }
        let bookmarkButtonInstance: any = this.bookmarkButton;
        let thumbnailButtonInstance: any = this.thumbnailButton;
        let organizeButtonInstance: any = this.organizePageButton;
        if (bookmarkButtonInstance && bookmarkButtonInstance.ej2_instances && bookmarkButtonInstance.ej2_instances.length > 0) {
            bookmarkButtonInstance.removeEventListener('click', this.bookmarkButtonOnClick);
            bookmarkButtonInstance.ej2_instances[0].destroy();
            bookmarkButtonInstance = null;
        }
        if (thumbnailButtonInstance && thumbnailButtonInstance.ej2_instances && thumbnailButtonInstance.ej2_instances.length > 0) {
            thumbnailButtonInstance.removeEventListener('click', this.sideToolbarOnClick);
            thumbnailButtonInstance.ej2_instances[0].destroy();
            thumbnailButtonInstance = null;
        }
        if (organizeButtonInstance && organizeButtonInstance.ej2_instances && organizeButtonInstance.ej2_instances.length > 0) {
            organizeButtonInstance.removeEventListener('click', this.organizeButtonOnClick);
            organizeButtonInstance.ej2_instances[0].destroy();
            organizeButtonInstance = null;
        }
        if (this.annotationMenuObj) {
            const annotationMenuElement : any = this.annotationMenuObj.element;
            if (annotationMenuElement && annotationMenuElement.ej2_instances && annotationMenuElement.ej2_instances.length > 0) {
                this.annotationMenuObj.destroy();
                this.annotationMenuObj = null;
            }
        }
        this.sideBarResizer = null;
        this.sideBarContentSplitter = null;
        this.sideBarTitleContainer = null;
        this.thumbnailWidthMin = null;
        this.mainContainerWidth = null;
        this.closeDiv = null;
        this.resizeIcon = null;
        this.isDown = null;
        this.offset = null;
        this.contentContainerScrollWidth = null;
        this.closeButtonLeft = null;
        this.previousX = null;
        this.toolbarElement = null;
        this.toolbar = null;
        this.searchInput = null;
        this.toastObject = null;
        this.isTooltipCreated = null;
        this.annotationInputElement = null;
        this.annotationXFdfInputElement = null;
        this.annotationContextMenu = null;
        this.isCommentPanelShow = null;
        this.commentPanelWidthMin = null;
        this.commentPanelResizeIcon = null;
        this.isThumbnail = null;
        this.isThumbnailAddedProgrammatically = null;
        this.isBookmarkOpenProgrammatically = null;
        this.sideBarTitle = null;
        this.isNavigationToolbarVisible = null;
        this.isBookmarkListOpen = null;
        this.isNavigationPaneResized = null;
        this.sideBarToolbar = null;
        this.sideBarContent = null;
        this.sideBarContentContainer = null;
        this.sideBarToolbarSplitter = null;
        this.isBookmarkOpen = null;
        this.isThumbnailOpen = null;
        this.commentPanelContainer = null;
        this.commentsContentContainer = null;
        this.accordionContentContainer = null;
        this.commentPanelResizer = null;
        this.restrictUpdateZoomValue = null;
    }

    /**
     * @returns {string} - Returns the string.
     */
    public getModuleName(): string {
        return 'NavigationPane';
    }
}
