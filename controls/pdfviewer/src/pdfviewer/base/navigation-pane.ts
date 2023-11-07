import { AnnotationDataFormat, PdfViewer } from '../index';
import { PdfViewerBase } from '../index';
import { createElement, Browser, isBlazor, initializeCSPTemplate, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Toolbar as Tool, ItemModel, ClickEventArgs, MenuItemModel, ContextMenu as Context } from '@syncfusion/ej2-navigations';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { Toast, ToastCloseArgs } from '@syncfusion/ej2-notifications';

/**
 * The `NavigationPane` module is used to handle navigation pane for thumbnail and bookmark navigation of PDF viewer.
 *
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
    private isThumbnail: boolean = false;
    private isThumbnailAddedProgrammatically: boolean = false;
    private annotationInputElement: HTMLElement;
    private annotationXFdfInputElement: HTMLElement;
    private annotationContextMenu: MenuItemModel[] = [];
    private isCommentPanelShow: boolean = false;
    private commentPanelWidthMin: number = 300;
    private commentPanelResizeIcon: HTMLElement;
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
            // eslint-disable-next-line max-len
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
            // eslint-disable-next-line max-len
            this.commentsContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_commentscontentcontainer', className: 'e-pv-comments-content-container' });
            this.commentPanelContainer.appendChild(this.commentsContentContainer);
            this.createFileElement(this.commentPanelContainer);
            this.createXFdfFileElement(this.commentPanelContainer);
        }
    }

    private createNavigationPane(): void {
        const isblazor: boolean = isBlazor();
        if (!isblazor) {
            // eslint-disable-next-line max-len
            this.sideBarToolbar = createElement('div', { id: this.pdfViewer.element.id + '_sideBarToolbar', className: 'e-pv-sidebar-toolbar', attrs: { 'role': 'toolbar', 'aria-orientation': 'vertical', 'tabindex': '-1', 'aria-label': 'Sidebar Toolbar'} });
            // eslint-disable-next-line max-len
            this.sideBarToolbarSplitter = createElement('div', { id: this.pdfViewer.element.id + '_sideBarToolbarSplitter', className: 'e-pv-sidebar-toolbar-splitter' });
            // eslint-disable-next-line max-len
            this.sideBarContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContentContainer', className: 'e-pv-sidebar-content-container' });
            // eslint-disable-next-line max-len
            this.sideBarContentSplitter = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContentSplitter', className: 'e-pv-sidebar-content-splitter' });
            // eslint-disable-next-line max-len
            this.sideBarContent = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContent', className: 'e-pv-sidebar-content', attrs: { 'tabindex': '0' } });
            // eslint-disable-next-line max-len
            this.sideBarTitleContainer = createElement('div', { id: this.pdfViewer.element.id + '_sideBarTitleContainer', className: 'e-pv-sidebar-title-container' });
            // eslint-disable-next-line max-len
            this.sideBarTitle = createElement('div', { id: this.pdfViewer.element.id + '_sideBarTitle', className: 'e-pv-sidebar-title', attrs: { 'tabindex': '-1' } });
            // eslint-disable-next-line max-len
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
        // eslint-disable-next-line max-len
        this.pdfViewerBase.viewerContainer.style.width = (this.pdfViewer.element.clientWidth - controlLeft - this.commentPanelContainer.clientWidth) + 'px';
        this.sideBarContentContainer.style.display = 'none';
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
    public adjustPane(): void {
        if (isBlazor()) {
            const splitterElement: HTMLElement = this.pdfViewer.element.querySelector('.e-pv-sidebar-toolbar-splitter');
            const sideToolbarElement: HTMLElement = this.pdfViewer.element.querySelector('.e-pv-sidebar-toolbar');
            const sideToolbarContent: HTMLElement = this.pdfViewer.element.querySelector('.e-pv-sidebar-content-container');
            const toolbarContainer: HTMLElement = this.pdfViewer.element.querySelector('.e-pv-toolbar');
            let toolbarHeight: number = toolbarContainer.getBoundingClientRect().height;
            if (toolbarHeight === 0) {
                // eslint-disable-next-line
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
            let toolbarHeight: number = toolbarContainer.getBoundingClientRect().height;
            if (toolbarHeight === 0) {
                // eslint-disable-next-line
                toolbarHeight = parseFloat(window.getComputedStyle(toolbarContainer)['height']) + 1;
            }
            // eslint-disable-next-line max-len
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
        // eslint-disable-next-line max-len
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
        // eslint-disable-next-line max-len
        this.commentsContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_commentscontentcontainer', className: 'e-pv-comments-content-container' });
        this.commentPanelContainer.appendChild(this.commentsContentContainer);
        // eslint-disable-next-line max-len
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
        // eslint-disable-next-line max-len
        const commentPanelTitleContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentPanelTitleContainer', className: 'e-pv-comment-panel-title-container' });
        // eslint-disable-next-line max-len
        const commentpanelTilte: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_commentPanelTitle', className: 'e-pv-comment-panel-title', attrs: { 'tabindex': '-1' } });
        if (isBlazor()) {
            const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_Comments');
            promise.then((value: string) => {
                commentpanelTilte.innerText = value;
            });
        } else {
            commentpanelTilte.innerText = this.pdfViewer.localeObj.getConstant('Comments');
        }
        const annotationButton: HTMLElement = createElement('button', { id: this.pdfViewer.element.id + '_annotations_btn' });
        annotationButton.setAttribute('aria-label', 'annotation button');
        annotationButton.setAttribute('type', 'button');
        annotationButton.className = 'e-btn e-pv-tbar-btn e-pv-comment-panel-title-close-div e-btn';
        // eslint-disable-next-line max-len
        const moreOptionButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_annotation_more_icon', className: 'e-pv-more-icon e-pv-icon' });
        annotationButton.appendChild(moreOptionButtonSpan);
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode &&  !isBlazor()) {
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
        commentPanelTitleContainer.appendChild(annotationButton);
        this.commentPanelContainer.appendChild(commentPanelTitleContainer);
        this.createAnnotationContextMenu();
        annotationButton.addEventListener('click', this.openAnnotationContextMenu.bind(this));
    }

    private createCommentPanelResizeIcon(): void {
        // eslint-disable-next-line max-len
        this.commentPanelResizeIcon = createElement('div', { id: this.pdfViewer.element.id + '_commentPanel_resize', className: 'e-pv-resize-icon e-pv-icon' });
        this.setCommentPanelResizeIconTop();
        this.commentPanelResizeIcon.style.position = 'absolute';
        this.commentPanelResizer.appendChild(this.commentPanelResizeIcon);
    }

    // eslint-disable-next-line
    private openAnnotationContextMenu(event: any): void {
        /* eslint-disable */
        this.annotationMenuObj.open(event.clientY, event.clientX, event.currentTarget);
        /* eslint-enable */
    }

    /**
     * @private
     * @returns {void}
     */
    public createAnnotationContextMenu(): void {
        // eslint-disable-next-line max-len
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

    // eslint-disable-next-line
    private annotationMenuItemSelect(args: any): void {
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            // eslint-disable-next-line
            let currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
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
        // eslint-disable-next-line max-len
        this.annotationInputElement = createElement('input', { id: this.pdfViewer.element.id + '_annotationUploadElement', styles: 'position:fixed; left:-100em', attrs: { 'type': 'file', 'aria-label': 'upload elements' } });
        this.annotationInputElement.setAttribute('accept', '.json');
        toolbarElement.appendChild(this.annotationInputElement);
        this.annotationInputElement.addEventListener('change', this.loadImportAnnotation);
    }

    private createXFdfFileElement(toolbarElement: HTMLElement): void {
        // eslint-disable-next-line max-len
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

    // eslint-disable-next-line
    private loadImportAnnotation = (args: any): void => {
        // eslint-disable-next-line
        let upoadedFiles: any = args.target.files;
        if (args.target.files[0] !== null) {
            const uploadedFile: File = upoadedFiles[0];
            if (uploadedFile) {
                this.pdfViewer.fireImportStart(uploadedFile);
                // eslint-disable-next-line
                let uploadedFileType: any = uploadedFile.type;
                if (uploadedFile.name.split('.json').length > 1 && uploadedFileType.includes('json')) {
                    const reader: FileReader = new FileReader();
                    reader.readAsDataURL(uploadedFile);
                    // eslint-disable-next-line
                    reader.onload = (e: any): void => {
                        if (e.currentTarget.result) {
                            const importFile: string =  e.currentTarget.result.split(',')[1];
                            // eslint-disable-next-line
                            let annotationData: any =  atob(importFile);
                            if (annotationData) {
                                // eslint-disable-next-line
                                 // Encountering a script error while attempting to import annotations from the older version JSON document. As a result, the below line has been commented: Task ID: 842694
                                // annotationData = this.pdfViewerBase.getSanitizedString(annotationData);
                                let jsonData = JSON.parse(annotationData);
                                let firstAnnotation: any = jsonData.pdfAnnotation[Object.keys(jsonData.pdfAnnotation)[0]];
                                if ((Object.keys(jsonData.pdfAnnotation).length >= 1) && (firstAnnotation.textMarkupAnnotation || firstAnnotation.measureShapeAnnotation || firstAnnotation.freeTextAnnotation || firstAnnotation.stampAnnotations || firstAnnotation.signatureInkAnnotation || (firstAnnotation.shapeAnnotation && firstAnnotation.shapeAnnotation[0].Bounds))) {
                                    this.pdfViewerBase.isPDFViewerJson = true;
                                    this.pdfViewerBase.importAnnotations(jsonData, AnnotationDataFormat.Json);
                                } else {
                                    this.pdfViewerBase.isPDFViewerJson = false;
                                    this.pdfViewerBase.importAnnotations(importFile, AnnotationDataFormat.Json);
                                }
                            }
                        }
                    };
                } else if (uploadedFile.name.split('.xfdf').length > 1 && (uploadedFileType.includes('xfdf') || args.target.accept.includes('xfdf'))) {
                    const reader: FileReader = new FileReader();
                    reader.readAsDataURL(uploadedFile);
                    // eslint-disable-next-line
                    reader.onload = (e: any): void => {
                        if (e.currentTarget.result) {
                            const importFile: string =  e.currentTarget.result.split(',')[1];
                            // eslint-disable-next-line
                            let annotationData: any =  atob(importFile);
                            if (annotationData) {
                                // eslint-disable-next-line max-len
                                this.pdfViewerBase.importAnnotations(importFile, AnnotationDataFormat.Xfdf, true);
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
            args.target.value = "";
        }
    };
    /**
     * @private
     * @returns {void}
     */
    public closeCommentPanelContainer(): void {
        let proxy: NavigationPane = null;
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
                // eslint-disable-next-line max-len
                viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth - proxy.getViewerContainerLeft() - proxy.getViewerContainerRight()) + 'px';
                pageContainer.style.width = (proxy.pdfViewerBase.viewerContainer.offsetWidth - proxy.getViewerContainerScrollbarWidth()) + 'px';
            }
            if (proxy.pdfViewerBase) {
                proxy.pdfViewerBase.updateZoomValue();
            }
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                this.pdfViewer.annotation.textMarkupAnnotationModule.showHideDropletDiv(true);
            }
            if (Browser.isDevice && !isBlazor()) {
                if (this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar) {
                    this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar.element.style.display = 'block';
                    if (this.pdfViewer.toolbarModule.annotationToolbarModule.propertyToolbar) {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.propertyToolbar.element.style.display = 'block';
                    }
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
            const searchTemplate: string = '<div class="e-input-group e-pv-search-input-mobile" id="' + this.pdfViewer.element.id +
                '_search_input_container"><input class="e-input" type="text" placeholder="' +
                this.pdfViewer.localeObj.getConstant('Find in document') + '" id="' +
                this.pdfViewer.element.id + '_search_input"></input></div>';
            items = [
                // eslint-disable-next-line max-len
                { prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) },
                { template: searchTemplate },
                {
                    prefixIcon: 'e-pv-search-icon e-pv-icon', id: this.pdfViewer.element.id + '_search_box-icon',
                    click: () => {
                        const iconElement: HTMLElement = this.pdfViewerBase.getElement('_search_box-icon').firstElementChild as HTMLElement;
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
                // eslint-disable-next-line max-len
                { prefixIcon: 'e-pv-backward-icon e-pv-icon', id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) },
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
            // eslint-disable-next-line
            const mobileTool: any = document.querySelectorAll('.e-pv-mobile-annotation-toolbar');
            for (let i: number = 0; i < mobileTool.length; i++) {
                mobileTool[parseInt(i.toString(), 10)].style.display = 'none';
            }
        }
        // eslint-disable-next-line max-len
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
        this.pdfViewer.textSearchModule.initiateSearch(inputString);
    }

    /**
     * @private
     * @returns {void}
     */
    public goBackToToolbar(): void {
        this.isNavigationToolbarVisible = false;
        if (isBlazor() && (!Browser.isDevice || this.pdfViewer.enableDesktopMode) || !isBlazor()) {
            this.pdfViewer.textSearchModule.cancelTextSearch();
        }
        this.searchInput = null;
        if (this.pdfViewer.bookmarkViewModule.childNavigateCount !== 0) {
            this.pdfViewer.bookmarkViewModule.bookmarkList.back();
            this.pdfViewer.bookmarkViewModule.childNavigateCount--;
        } else {
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
            if (!isBlazor()) {
                if (!this.pdfViewer.toolbar.annotationToolbarModule.isMobileAnnotEnabled) {
                    this.pdfViewer.toolbarModule.showToolbar(true);
                }
            } else {
                this.pdfViewerBase.onWindowResize();
            }
        }
    }

    private setSearchInputWidth(): void {
        const searchInputParent: HTMLElement = this.searchInput.parentElement;
        const padding: string = window.getComputedStyle(searchInputParent.parentElement, null).getPropertyValue('padding-left');
        if (isBlazor() && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
            this.toolbarElement = this.pdfViewerBase.getElement('_navigationToolbar');
        }
        // eslint-disable-next-line max-len
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
        // eslint-disable-next-line max-len
        const tooltipDiv: HTMLElement = createElement('div', { className: 'e-pv-container-tooltip', id: this.pdfViewer.element.id + '_container_tooltip' });
        this.pdfViewer.element.appendChild(tooltipDiv);
        // eslint-disable-next-line max-len
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
            // eslint-disable-next-line max-len
            this.thumbnailButton = createElement('button', { id: this.pdfViewer.element.id + '_thumbnail-view', attrs: { 'disabled': 'disabled', 'aria-label': 'Page Thumbnails', 'tabindex': '-1' } });
            this.thumbnailButton.className = 'e-pv-tbar-btn e-pv-thumbnail-view-button e-btn';
            this.thumbnailButton.setAttribute('type', 'button');
            // eslint-disable-next-line max-len
            const thumbnailButtonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_thumbnail-view' + '_icon', className: 'e-pv-thumbnail-view-disable-icon e-pv-icon' });
            this.thumbnailButton.appendChild(thumbnailButtonSpan);
            // eslint-disable-next-line max-len
            const thumbnailTooltip: Tooltip = new Tooltip({ content:  initializeCSPTemplate(
                function (): string { return this.pdfViewer.localeObj.getConstant('Page Thumbnails'); }, this
            ), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
            thumbnailTooltip.appendTo(this.thumbnailButton);
            // eslint-disable-next-line max-len
            this.bookmarkButton = createElement('button', { id: this.pdfViewer.element.id + '_bookmark', attrs: { 'disabled': 'disabled', 'aria-label': 'Bookmarks', 'tabindex': '-1' } });
            this.bookmarkButton.setAttribute('type', 'button');
            this.bookmarkButton.className = 'e-pv-tbar-btn e-pv-bookmark-button e-btn';
            // eslint-disable-next-line max-len
            const buttonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_bookmark' + '_icon', className: 'e-pv-bookmark-disable-icon e-pv-icon' });
            this.bookmarkButton.appendChild(buttonSpan);
            // eslint-disable-next-line max-len
            const bookMarkTooltip: Tooltip = new Tooltip({ content:  initializeCSPTemplate(
                function (): string { return this.pdfViewer.localeObj.getConstant('Bookmarks'); }, this
            ), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
            bookMarkTooltip.appendTo(this.bookmarkButton);
            this.sideBarToolbar.appendChild(this.thumbnailButton);
            this.sideBarToolbar.appendChild(this.bookmarkButton);
        } else {
            this.thumbnailButton = this.pdfViewer.element.querySelector('.e-pv-thumbnail-view-button');
            this.bookmarkButton = this.pdfViewer.element.querySelector('.e-pv-bookmark-button');
        }
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
     * @returns {void}
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
     * @returns {void}
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
        this.closeDiv.setAttribute('aria-label', 'close button');
        this.closeDiv.setAttribute('type', 'button');
        this.closeDiv.className = 'e-btn e-pv-tbar-btn e-pv-title-close-div e-btn';
        if (this.pdfViewer.enableRtl) {
            this.closeDiv.style.left = 8 + 'px';
        } else {
            this.closeDiv.style.left = this.closeButtonLeft + 'px';
        }
        // eslint-disable-next-line max-len
        const buttonSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_close' + '_icon', className: 'e-pv-title-close-icon e-pv-icon' });
        this.closeDiv.appendChild(buttonSpan);
        this.sideBarTitleContainer.appendChild(this.closeDiv);
        this.closeDiv.addEventListener('click', this.sideToolbarOnClose);
    }

    private createResizeIcon(): void {
        // eslint-disable-next-line max-len
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
        // eslint-disable-next-line max-len
        if (this.sideBarToolbar && this.sideBarToolbar.clientHeight && this.resizeIcon.style.top === '') {
            this.resizeIcon.style.top = (this.sideBarToolbar.clientHeight) / 2 + 'px';
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public setCommentPanelResizeIconTop(): void {
        // eslint-disable-next-line max-len
        if (this.commentPanelContainer && this.commentPanelContainer.clientHeight && this.commentPanelResizeIcon && this.commentPanelResizeIcon.style.top === '') {
            this.commentPanelResizeIcon.style.top = (this.commentPanelContainer.clientHeight) / 2 + 'px';
        }
    }
    /**
     * @param {MouseEvent} event - The event.
     * @returns {void}
     */
    private resizeIconMouseOver = (event: MouseEvent): void => {
        (event.srcElement as HTMLElement).style.cursor = 'e-resize';
    };
    /**
     * @param {MouseEvent} event - The event.
     * @returns {void}
     */
    private resizePanelMouseDown = (event: MouseEvent): void => {
        let proxy: NavigationPane = null;
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
        proxy = this;
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
        // eslint-disable-next-line max-len
        return (this.pdfViewerBase.viewerContainer.offsetWidth + this.pdfViewerBase.viewerContainer.offsetLeft) - (this.pdfViewerBase.viewerContainer.clientWidth + this.pdfViewerBase.viewerContainer.offsetLeft);
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
        proxy = this;
        if (!this.pdfViewerBase.getPopupNoteVisibleStatus()) {
            const target: HTMLElement = event.target as HTMLElement;
            // eslint-disable-next-line max-len
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
                    // eslint-disable-next-line max-len
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
                    // eslint-disable-next-line max-len
                    proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerLeft() + 'px';
                    proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerRight() + 'px';
                }
                // eslint-disable-next-line max-len
                const viewerWidth: number = (proxy.pdfViewer.element.clientWidth - proxy.getViewerContainerLeft() - proxy.getViewerContainerRight());
                proxy.pdfViewerBase.viewerContainer.style.width = viewerWidth + 'px';
                proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
                proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
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
        proxy = this;
        proxy.removeThumbnailSelectionIconTheme();
        proxy.removeBookmarkSelectionIconTheme();
        proxy.updateViewerContainerOnClose();
        proxy.isThumbnailAddedProgrammatically = false;
        proxy.isThumbnail = false;
    };
    /**
     * @private
     * @returns {void}
     */
    public updateViewerContainerOnClose(): void {
        let proxy: NavigationPane = null;
        proxy = this;
        if (proxy.sideBarContentContainer) {
            proxy.sideBarContentContainer.style.display = 'none';
            if (this.pdfViewer.enableRtl) {
                proxy.pdfViewerBase.viewerContainer.style.right = (proxy.sideToolbarWidth) + 'px';
            } else {
                proxy.pdfViewerBase.viewerContainer.style.left = (proxy.sideToolbarWidth) + 'px';
            }
            // eslint-disable-next-line max-len
            proxy.pdfViewerBase.viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth - proxy.sideToolbarWidth - proxy.getViewerContainerRight()) + 'px';
            // eslint-disable-next-line max-len
            proxy.pdfViewerBase.pageContainer.style.width = (proxy.pdfViewerBase.viewerContainer.offsetWidth - proxy.getViewerContainerScrollbarWidth()) + 'px';
            if(this.restrictUpdateZoomValue){
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
        proxy = this;
        if (proxy.sideBarContentContainer) {
            proxy.sideBarContentContainer.style.display = 'block';
            if (this.pdfViewer.enableRtl) {
                // eslint-disable-next-line max-len
                proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerLeft() + 'px';
            } else {
                // eslint-disable-next-line max-len
                proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerLeft() + 'px';
            }
            // eslint-disable-next-line max-len
            proxy.pdfViewerBase.viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth - this.getViewerContainerLeft() - this.getViewerContainerRight()) + 'px';
            proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
            proxy.pdfViewerBase.updateZoomValue();
            if (proxy.pdfViewer.enableThumbnail) {
                proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
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
        } else {
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
        } else {
            return 0;
        }
    }
    /**
     * @private
     * @returns {number} - Returns the number.
     */
    public getViewerMainContainerWidth(): number {
        return this.pdfViewer.element.clientWidth - this.sideToolbarWidth;
    }
    /**
     * @param {MouseEvent} event - The event.
     * @returns {void}
     */
    private sideToolbarOnClick = (event: MouseEvent): void => {
        this.sideBarTitle.textContent = this.pdfViewer.localeObj.getConstant('Page Thumbnails');
        this.sideBarContent.setAttribute('aria-label', 'Thumbnail View Panel');
        let proxy: NavigationPane = null;
        proxy = this;
        const isblazor: boolean = isBlazor();
        // eslint-disable-next-line max-len
        const bookmarkPane: HTMLElement = isblazor ? this.pdfViewer.element.querySelector('.e-pv-bookmark-view') : document.getElementById(this.pdfViewer.element.id + '_bookmark_view');
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
                    proxy.updateViewerContainerOnExpand();
                } else {
                    proxy.isThumbnailOpen = false;
                    proxy.removeThumbnailSelectionIconTheme();
                    proxy.updateViewerContainerOnClose();
                    proxy.isThumbnailAddedProgrammatically = false;
                    proxy.isThumbnail = false;
                }
            } else {
                proxy.sideBarContent.focus();
                proxy.isThumbnailOpen = true;
                proxy.setThumbnailSelectionIconTheme();
                proxy.updateViewerContainerOnExpand();
                proxy.isThumbnail = true;
            }
        }
        proxy.isBookmarkOpen = false;
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            // eslint-disable-next-line
            let currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
    };

    /**
     * @private
     * @returns {void}
     */
    public openThumbnailPane = (): void => {
        let proxy: NavigationPane = null;
        proxy = this;
        const sideBarContent: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_sideBarContent');
        const sideBarContentContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_sideBarContentContainer');
        const viewerContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_viewerContainer');
        const pageContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageViewContainer');
        document.getElementById(this.pdfViewer.element.id + '_thumbnail_view').style.display = 'block';
        document.getElementById(this.pdfViewer.element.id + '_sideBarResizer').style.display = 'none';
        proxy.sideBarTitle.textContent = this.pdfViewer.localeObj.getConstant('Page Thumbnails');
        proxy.sideBarContent.setAttribute('aria-label', 'Thumbnail View Panel');
        if (sideBarContentContainer  && !this.isThumbnailAddedProgrammatically) {
            if (proxy.isThumbnail) {
                sideBarContentContainer.style.display = 'none';
                viewerContainer.style.width = proxy.pdfViewer.element.clientWidth + 'px';
                pageContainer.style.width = viewerContainer.clientWidth + 'px';
                viewerContainer.style.left = sideBarContentContainer.clientWidth + 'px';
                proxy.pdfViewerBase.updateZoomValue();
                proxy.removeThumbnailSelectionIconTheme();
                proxy.isThumbnail = false;
            } else {
                sideBarContent.focus();
                proxy.setThumbnailSelectionIconTheme();
                proxy.updateViewerContainerOnExpand();
                // eslint-disable-next-line max-len
                proxy.isThumbnail = true;
                proxy.pdfViewerBase.updateZoomValue();
                if (!isNullOrUndefined(proxy.pdfViewer.thumbnailViewModule)) {
                    proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
                }
                proxy.isThumbnailAddedProgrammatically = true;
            }
        }
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            // eslint-disable-next-line
            let currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
    };

     /**
     * @private
     * @returns {void}
     */
     public closeThumbnailPane  = (): void => {
        let proxy : NavigationPane = null;
        proxy = this;
        if(proxy.isThumbnail || !proxy.isThumbnailAddedProgrammatically) {
            proxy.removeThumbnailSelectionIconTheme();
            proxy.isThumbnailOpen = false;
            proxy.updateViewerContainerOnClose();
            proxy.isThumbnailAddedProgrammatically = false;
            proxy.isThumbnail = false;
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
            // eslint-disable-next-line max-len
            this.pdfViewerBase.viewerContainer.style.width = (this.pdfViewer.element.clientWidth - this.sideToolbarWidth - this.getViewerContainerRight()) + 'px';
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
     * @returns {void}
     */
    private bookmarkButtonOnClick = (event: MouseEvent): void => {
        this.openBookmarkcontentInitially();
    };

    private setBookmarkSelectionIconTheme(): void {
        if (this.bookmarkButton) {
            this.bookmarkButton.children[0].classList.remove('e-pv-bookmark-icon');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-selection-icon');
            this.bookmarkButton.classList.add('e-pv-bookmark-button-selection');
        }
    }

    private removeBookmarkSelectionIconTheme(): void {
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
        this.pdfViewerBase.focusViewerContainer();
    }

    /**
     * @private
     * @returns {void}
     */
    public openBookmarkcontentInitially(): void {
        let proxy: NavigationPane = null;
        proxy = this;
        if (document.getElementById(this.pdfViewer.element.id + '_thumbnail_view')) {
            document.getElementById(this.pdfViewer.element.id + '_thumbnail_view').style.display = 'none';
        }
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
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            // eslint-disable-next-line
            let currentPageNumber: number = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public disableBookmarkButton(): void {
        if (this.sideBarContentContainer && this.bookmarkButton && this.bookmarkButton.children[0]) {
            this.sideBarContentContainer.style.display = 'none';
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
            // eslint-disable-next-line max-len
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
            // eslint-disable-next-line max-len
            proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerRight() + 'px';
            proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerLeft() + 'px';
        }
        this.pdfViewer.annotation.stickyNotesAnnotationModule.updateCommentPanelTextTop();
        // eslint-disable-next-line max-len
        const viewerWidth: number = (proxy.pdfViewer.element.clientWidth - proxy.getViewerContainerLeft() - proxy.getViewerContainerRight());
        proxy.pdfViewerBase.viewerContainer.style.width = viewerWidth + 'px';
        proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
        proxy.pdfViewerBase.updateZoomValue();
    };
    /**
     * @param {MouseEvent} event - The event.
     * @returns {void}
     */
    private commentPanelMouseLeave = (event: MouseEvent): void => {
        let proxy: NavigationPane = null;
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
        let bookmarkButtonInstance: any = this.bookmarkButton;
        let thumbnailButtonInstance: any = this.thumbnailButton;
        if (bookmarkButtonInstance && bookmarkButtonInstance.ej2_instances && bookmarkButtonInstance.ej2_instances.length > 0) {
            bookmarkButtonInstance.ej2_instances[0].destroy();
        }
        if (thumbnailButtonInstance && thumbnailButtonInstance.ej2_instances && thumbnailButtonInstance.ej2_instances.length > 0) {
            thumbnailButtonInstance.ej2_instances[0].destroy();
        } 
        if (this.annotationMenuObj) {
            let annotationMenuElement : any = this.annotationMenuObj.element;
            annotationMenuElement && annotationMenuElement.ej2_instances && annotationMenuElement.ej2_instances.length > 0 ? this.annotationMenuObj.destroy() : null;
        }
    }
    /**
     * @returns {string} - Returns the string.
     */
    public getModuleName(): string {
        return 'NavigationPane';
    }
}
