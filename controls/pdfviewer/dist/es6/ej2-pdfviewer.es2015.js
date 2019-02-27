import { Browser, ChildProperty, Component, Event, L10n, NotifyPropertyChanges, Property, createElement } from '@syncfusion/ej2-base';
import { Dialog, Tooltip, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { ContextMenu, Toolbar, TreeView } from '@syncfusion/ej2-navigations';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { ComboBox } from '@syncfusion/ej2-dropdowns';
import { CheckBox } from '@syncfusion/ej2-buttons';

/**
 * The `LinkAnnotation` module is used to handle link annotation actions of PDF viewer.
 * @hidden
 */
class LinkAnnotation {
    /**
     * @private
     */
    constructor(pdfViewer, viewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
    }
    /**
     * @private
     */
    // tslint:disable-next-line    
    renderHyperlinkContent(data, pageIndex) {
        if (this.pdfViewer.enableHyperlink) {
            let hyperlinks = data.hyperlinks;
            let hyperlinksBounds = data.hyperlinkBounds;
            let linkAnnotation = data.linkAnnotation;
            let linkPage = data.linkPage;
            let annotationY = data.annotationLocation;
            if (hyperlinks.length > 0 && hyperlinksBounds.length > 0) {
                this.renderWebLink(hyperlinks, hyperlinksBounds, pageIndex);
            }
            if (linkAnnotation.length > 0 && linkPage.length > 0) {
                this.renderDocumentLink(linkAnnotation, linkPage, annotationY, pageIndex);
            }
        }
    }
    renderWebLink(hyperlinks, hyperlinksBounds, pageIndex) {
        let proxy = this;
        for (let i = 0; i < hyperlinks.length; i++) {
            let aTag = createElement('a', { id: 'weblinkdiv_' + i });
            // tslint:disable-next-line
            let rect = hyperlinksBounds[i];
            aTag = this.setHyperlinkProperties(aTag, rect);
            aTag.title = hyperlinks[i];
            aTag.setAttribute('href', hyperlinks[i]);
            if (this.pdfViewer.hyperlinkOpenState === 'CurrentTab') {
                aTag.target = '_self';
                aTag.onclick = () => {
                    proxy.pdfViewer.fireHyperlinkClick(hyperlinks[i]);
                };
            }
            else if (this.pdfViewer.hyperlinkOpenState === 'NewTab') {
                aTag.target = '_blank';
                aTag.onclick = () => {
                    proxy.pdfViewer.fireHyperlinkClick(hyperlinks[i]);
                };
            }
            else if (this.pdfViewer.hyperlinkOpenState === 'NewWindow') {
                aTag.onclick = () => {
                    proxy.pdfViewer.fireHyperlinkClick(hyperlinks[i]);
                    window.open(hyperlinks[i], '_blank', 'scrollbars=yes,resizable=yes');
                    return false;
                };
            }
            let pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            pageDiv.appendChild(aTag);
        }
    }
    renderDocumentLink(linkAnnotation, linkPage, annotationY, pageIndex) {
        let proxy = this;
        for (let i = 0; i < linkAnnotation.length; i++) {
            let aTag = createElement('a', { id: 'linkdiv_' + i });
            // tslint:disable-next-line
            let rect = linkAnnotation[i];
            aTag = this.setHyperlinkProperties(aTag, rect);
            aTag.setAttribute('href', '');
            if (linkPage[i] !== undefined && linkPage[i] > 0) {
                let destPageHeight = (this.pdfViewerBase.pageSize[pageIndex].height);
                let destLocation;
                let scrollValue;
                if (annotationY.length !== 0) {
                    destLocation = (annotationY[i]);
                    // tslint:disable-next-line:max-line-length
                    scrollValue = this.pdfViewerBase.pageSize[linkPage[i]].top * this.pdfViewerBase.getZoomFactor() + ((destPageHeight - destLocation) * this.pdfViewerBase.getZoomFactor());
                }
                else {
                    // tslint:disable-next-line:max-line-length
                    scrollValue = this.pdfViewerBase.pageSize[linkPage[i]].top * this.pdfViewerBase.getZoomFactor();
                }
                if (scrollValue !== undefined) {
                    aTag.name = scrollValue.toString();
                    aTag.onclick = () => {
                        // tslint:disable-next-line:radix
                        proxy.pdfViewerBase.viewerContainer.scrollTop = parseInt(aTag.name);
                        return false;
                    };
                }
            }
            let pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            pageDiv.appendChild(aTag);
        }
    }
    // tslint:disable-next-line
    setHyperlinkProperties(aTag, rect) {
        aTag.className = 'e-pv-hyperlink';
        aTag.style.background = 'transparent';
        aTag.style.position = 'absolute';
        aTag.style.left = (rect.Left * this.pdfViewerBase.getZoomFactor()) + 'px';
        aTag.style.top = (rect.Top * this.pdfViewerBase.getZoomFactor()) + 'px';
        aTag.style.width = (rect.Width * this.pdfViewerBase.getZoomFactor()) + 'px';
        if (rect.Height < 0) {
            aTag.style.height = (-rect.Height * this.pdfViewerBase.getZoomFactor()) + 'px';
            aTag.style.top = ((rect.Top + rect.Height) * this.pdfViewerBase.getZoomFactor()) + 'px';
        }
        else {
            aTag.style.height = ((rect.Height < 0 ? -rect.Height : rect.Height) * this.pdfViewerBase.getZoomFactor()) + 'px';
        }
        aTag.style.color = 'transparent';
        return aTag;
    }
    /**
     * @private
     */
    modifyZindexForTextSelection(pageNumber, isAdd) {
        if (this.pdfViewerBase.pageCount > 0) {
            let pageChildNodes = this.pdfViewerBase.getElement('_pageDiv_' + pageNumber).childNodes;
            for (let i = 0; i < pageChildNodes.length; i++) {
                let childElement = pageChildNodes[i];
                if (childElement.tagName === 'A') {
                    if (isAdd) {
                        childElement.classList.add('e-pv-onselection');
                    }
                    else {
                        childElement.classList.remove('e-pv-onselection');
                    }
                }
            }
        }
    }
    /**
     * @private
     */
    modifyZindexForHyperlink(element, isAdd) {
        if (isAdd) {
            element.classList.add('e-pv-onselection');
        }
        else {
            element.classList.remove('e-pv-onselection');
        }
    }
    /**
     * @private
     */
    destroy() {
        for (let i = 0; i < this.pdfViewerBase.pageCount - 1; i++) {
            let pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + i);
            if (pageDiv) {
                let aElement = pageDiv.getElementsByTagName('a');
                if (aElement.length !== 0) {
                    for (let index = aElement.length - 1; index >= 0; index--) {
                        aElement[index].parentNode.removeChild(aElement[index]);
                    }
                }
            }
        }
    }
    /**
     * @private
     */
    getModuleName() {
        return 'LinkAnnotation';
    }
}

/**
 * export types
 */

/**
 * The `NavigationPane` module is used to handle navigation pane for thumbnail and bookmark navigation of PDF viewer.
 * @hidden
 */
class NavigationPane {
    constructor(viewer, base) {
        this.thumbnailWidthMin = 200;
        this.contentContainerScrollWidth = 33;
        this.closeButtonLeft = 170;
        this.isBookmarkOpen = false;
        this.isThumbnailOpen = false;
        /**
         * @private
         */
        this.isNavigationPaneResized = false;
        this.resizeIconMouseOver = (event) => {
            event.srcElement.style.cursor = 'default';
        };
        this.resizePanelMouseDown = (event) => {
            let proxy = this;
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
        };
        this.resizeViewerMouseLeave = (event) => {
            let proxy = this;
            proxy.isDown = false;
            if (proxy.isNavigationPaneResized && proxy.sideBarContentContainer) {
                proxy.pdfViewerBase.viewerContainer.style.cursor = 'default';
                proxy.sideBarContentContainer.style.cursor = 'default';
                proxy.isNavigationPaneResized = false;
            }
        };
        this.resizePanelMouseMove = (event) => {
            let proxy = this;
            event.preventDefault();
            if (proxy.isDown && this.sideBarContentContainer) {
                // prevent the sidebar from becoming too narrow, or from occupying more
                // than half of the available viewer width.
                let width = event.clientX + proxy.offset[0];
                const maxWidth = Math.floor(this.outerContainerWidth / 2);
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
                let viewerWidth = (proxy.pdfViewer.element.clientWidth - proxy.getViewerContainerLeft());
                proxy.pdfViewerBase.viewerContainer.style.width = viewerWidth + 'px';
                proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
                proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
                proxy.pdfViewerBase.updateZoomValue();
            }
        };
        this.sideToolbarOnClose = (event) => {
            let proxy = this;
            proxy.removeThumbnailSelectionIconTheme();
            proxy.removeBookmarkSelectionIconTheme();
            proxy.updateViewerContainerOnClose();
        };
        this.sideToolbarOnClick = (event) => {
            this.sideBarTitle.textContent = this.pdfViewer.localeObj.getConstant('Page Thumbnails');
            let proxy = this;
            let bookmarkPane = document.getElementById(this.pdfViewer.element.id + '_bookmark_view');
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
                    }
                    else {
                        proxy.isThumbnailOpen = false;
                        proxy.removeThumbnailSelectionIconTheme();
                        this.updateViewerContainerOnClose();
                    }
                }
                else {
                    proxy.isThumbnailOpen = true;
                    proxy.setThumbnailSelectionIconTheme();
                    this.updateViewerContainerOnExpand();
                }
            }
            proxy.isBookmarkOpen = false;
        };
        this.bookmarkButtonOnClick = (event) => {
            let proxy = this;
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
                    }
                    else {
                        this.removeBookmarkSelectionIconTheme();
                        this.isBookmarkOpen = false;
                        this.updateViewerContainerOnClose();
                    }
                }
                else {
                    this.setBookmarkSelectionIconTheme();
                    this.isBookmarkOpen = true;
                    this.updateViewerContainerOnExpand();
                }
            }
            this.isThumbnailOpen = false;
        };
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * @private
     */
    initializeNavigationPane() {
        // tslint:disable-next-line:max-line-length
        this.sideBarToolbar = createElement('div', { id: this.pdfViewer.element.id + '_sideBarToolbar', className: 'e-pv-sidebar-toolbar' });
        this.pdfViewerBase.mainContainer.appendChild(this.sideBarToolbar);
        // tslint:disable-next-line:max-line-length
        let sideBarToolbarSplitter = createElement('div', { id: this.pdfViewer.element.id + '_sideBarToolbarSplitter', className: 'e-pv-sidebar-toolbar-splitter' });
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
        let controlLeft = this.getViewerContainerLeft();
        this.pdfViewerBase.viewerContainer.style.left = controlLeft + 'px';
        this.pdfViewerBase.viewerContainer.style.width = (this.pdfViewer.element.clientWidth - controlLeft) + 'px';
        this.sideBarContentContainer.style.display = 'none';
        this.createSidebarToolBar();
        this.createSidebarTitleCloseButton();
        this.createResizeIcon();
        this.sideBarToolbar.addEventListener('mouseup', this.sideToolbarOnMouseup.bind(this));
        this.sideBarContentContainer.addEventListener('mouseup', this.sideBarTitleOnMouseup.bind(this));
    }
    createSidebarToolBar() {
        // tslint:disable-next-line:max-line-length
        this.thumbnailButton = createElement('button', { id: this.pdfViewer.element.id + '_thumbnail-view', attrs: { 'disabled': 'disabled' } });
        this.thumbnailButton.className = 'e-pv-tbar-btn e-pv-thumbnail-view-button e-btn';
        // tslint:disable-next-line:max-line-length
        let thumbnailButtonSpan = createElement('span', { id: this.pdfViewer.element.id + '_thumbnail-view' + '_icon', className: 'e-pv-thumbnail-view-disable-icon e-pv-icon' });
        this.thumbnailButton.appendChild(thumbnailButtonSpan);
        // tslint:disable-next-line:max-line-length
        let thumbnailTooltip = new Tooltip({ content: this.pdfViewer.localeObj.getConstant('Page Thumbnails'), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
        thumbnailTooltip.appendTo(this.thumbnailButton);
        // tslint:disable-next-line:max-line-length
        this.bookmarkButton = createElement('button', { id: this.pdfViewer.element.id + '_bookmark', attrs: { 'disabled': 'disabled' } });
        this.bookmarkButton.className = 'e-pv-tbar-btn e-pv-bookmark-button e-btn';
        // tslint:disable-next-line:max-line-length
        let buttonSpan = createElement('span', { id: this.pdfViewer.element.id + '_bookmark' + '_icon', className: 'e-pv-bookmark-disable-icon e-pv-icon' });
        this.bookmarkButton.appendChild(buttonSpan);
        // tslint:disable-next-line:max-line-length
        let bookMarkTooltip = new Tooltip({ content: this.pdfViewer.localeObj.getConstant('Bookmarks'), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
        bookMarkTooltip.appendTo(this.bookmarkButton);
        this.sideBarToolbar.appendChild(this.thumbnailButton);
        this.sideBarToolbar.appendChild(this.bookmarkButton);
        this.thumbnailButton.addEventListener('click', this.sideToolbarOnClick);
        this.bookmarkButton.addEventListener('click', this.bookmarkButtonOnClick);
    }
    onTooltipBeforeOpen(args) {
        if (!this.pdfViewer.toolbarSettings.showTooltip) {
            args.cancel = true;
        }
    }
    /**
     * @private
     */
    enableThumbnailButton() {
        if (this.thumbnailButton) {
            this.thumbnailButton.removeAttribute('disabled');
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-disable-icon');
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-icon');
        }
    }
    /**
     * @private
     */
    enableBookmarkButton() {
        if (this.bookmarkButton) {
            this.bookmarkButton.removeAttribute('disabled');
            this.bookmarkButton.children[0].classList.remove('e-pv-bookmark-disable-icon');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-icon');
        }
    }
    createSidebarTitleCloseButton() {
        this.closeDiv = createElement('button', { id: this.pdfViewer.element.id + '_close_btn' });
        this.closeDiv.className = 'e-btn e-pv-tbar-btn e-pv-title-close-div e-btn';
        this.closeDiv.style.left = this.closeButtonLeft + 'px';
        // tslint:disable-next-line:max-line-length
        let buttonSpan = createElement('span', { id: this.pdfViewer.element.id + '_close' + '_icon', className: 'e-pv-title-close-icon e-pv-icon' });
        this.closeDiv.appendChild(buttonSpan);
        this.sideBarTitleContainer.appendChild(this.closeDiv);
        this.closeDiv.addEventListener('click', this.sideToolbarOnClose);
    }
    createResizeIcon() {
        // tslint:disable-next-line:max-line-length
        let resizeIcon = createElement('div', { id: this.pdfViewer.element.id + '_resize', className: 'e-pv-resize-icon e-pv-icon' });
        resizeIcon.style.top = (this.sideBarToolbar.clientHeight) / 2 + 'px';
        resizeIcon.style.position = 'absolute';
        resizeIcon.addEventListener('click', this.sideToolbarOnClose);
        resizeIcon.addEventListener('mouseover', this.resizeIconMouseOver);
        this.sideBarResizer.appendChild(resizeIcon);
    }
    /**
     * @private
     */
    get outerContainerWidth() {
        if (!this.mainContainerWidth) {
            this.mainContainerWidth = this.pdfViewerBase.mainContainer.clientWidth;
        }
        return this.mainContainerWidth;
    }
    /**
     *  @private
     */
    get sideToolbarWidth() {
        if (this.sideBarToolbar) {
            return this.sideBarToolbar.clientWidth;
        }
        else {
            return 0;
        }
    }
    /**
     * @private
     */
    get sideBarContentContainerWidth() {
        if (this.sideBarContentContainer) {
            return this.sideBarContentContainer.clientWidth;
        }
        else {
            return 0;
        }
    }
    /**
     * @private
     */
    updateViewerContainerOnClose() {
        let proxy = this;
        if (proxy.sideBarContentContainer) {
            proxy.sideBarContentContainer.style.display = 'none';
            proxy.pdfViewerBase.viewerContainer.style.left = (proxy.sideToolbarWidth) + 'px';
            proxy.pdfViewerBase.viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth - proxy.sideToolbarWidth) + 'px';
            proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
            proxy.pdfViewerBase.updateZoomValue();
        }
    }
    updateViewerContainerOnExpand() {
        let proxy = this;
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
    getViewerContainerLeft() {
        return (this.sideToolbarWidth + this.sideBarContentContainerWidth);
    }
    /**
     * @private
     */
    getViewerMainContainerWidth() {
        return this.pdfViewer.element.clientWidth - this.sideToolbarWidth;
    }
    setThumbnailSelectionIconTheme() {
        if (this.thumbnailButton) {
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-icon');
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-selection-icon');
            this.thumbnailButton.classList.add('e-pv-thumbnail-view-button-selection');
        }
    }
    removeThumbnailSelectionIconTheme() {
        if (this.thumbnailButton) {
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-icon');
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-selection-icon');
            this.thumbnailButton.classList.remove('e-pv-thumbnail-view-button-selection');
        }
    }
    resetThumbnailIcon() {
        if (this.thumbnailButton) {
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-icon');
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-disable-icon');
        }
    }
    /**
     * @private
     */
    resetThumbnailView() {
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
    setBookmarkSelectionIconTheme() {
        if (this.bookmarkButton) {
            this.bookmarkButton.children[0].classList.remove('e-pv-bookmark-icon');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-selection-icon');
            this.bookmarkButton.classList.add('e-pv-bookmark-button-selection');
        }
    }
    removeBookmarkSelectionIconTheme() {
        if (this.bookmarkButton) {
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-icon');
            this.bookmarkButton.children[0].classList.remove('e-pv-bookmark-selection-icon');
            this.bookmarkButton.classList.remove('e-pv-bookmark-button-selection');
        }
    }
    sideToolbarOnMouseup(event) {
        if (event.target === this.sideBarToolbar) {
            this.pdfViewerBase.focusViewerContainer();
        }
    }
    sideBarTitleOnMouseup(event) {
        this.pdfViewerBase.focusViewerContainer();
    }
    /**
     * @private
     */
    disableBookmarkButton() {
        if (this.sideBarContentContainer) {
            this.sideBarContentContainer.style.display = 'none';
            this.bookmarkButton.setAttribute('disabled', 'disabled');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-disable-icon');
        }
    }
    /**
     * @private
     */
    clear() {
        this.removeBookmarkSelectionIconTheme();
        this.removeThumbnailSelectionIconTheme();
    }
    getModuleName() {
        return 'NavigationPane';
    }
}

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * The `PdfViewerBase` module is used to handle base methods of PDF viewer.
 * @hidden
 */
class PdfViewerBase {
    constructor(viewer) {
        /**
         * @private
         */
        this.pageSize = [];
        /**
         * @private
         */
        this.pageCount = 0;
        /**
         * @private
         */
        this.currentPageNumber = 0;
        this.isDocumentLoaded = false;
        /**
         * @private
         */
        this.renderedPagesList = [];
        /**
         * @private
         */
        this.pageGap = 8;
        this.pageLeft = 5;
        this.sessionLimit = 1000;
        this.pageStopValue = 300;
        this.toolbarHeight = 56;
        this.pageLimit = 0;
        this.previousPage = 0;
        this.isViewerMouseDown = false;
        this.isViewerMouseWheel = false;
        this.scrollPosition = 0;
        this.sessionStorage = [];
        this.pointerCount = 0;
        this.pointersForTouch = [];
        this.isPasswordAvailable = false;
        /**
         * @private
         */
        this.reRenderedCount = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.touchClientX = 0;
        this.touchClientY = 0;
        this.isLongTouchPropagated = false;
        // tslint:disable-next-line
        this.longTouchTimer = null;
        this.isViewerContainerDoubleClick = false;
        // tslint:disable-next-line
        this.dblClickTimer = null;
        /**
         * @private
         */
        this.pinchZoomStorage = [];
        /**
         * @private
         */
        this.isTextSelectionDisabled = false;
        this.isPanMode = false;
        this.dragX = 0;
        this.dragY = 0;
        this.isScrollbarMouseDown = false;
        /**
         * @private
         */
        this.onWindowResize = () => {
            let proxy = this;
            // tslint:disable-next-line:max-line-length
            proxy.viewerContainer.style.left = (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) + 'px';
            // tslint:disable-next-line:max-line-length
            let viewerWidth = (proxy.pdfViewer.element.clientWidth - (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0));
            proxy.viewerContainer.style.width = viewerWidth + 'px';
            if (proxy.pdfViewer.toolbarModule) {
                // tslint:disable-next-line:max-line-length
                proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 56);
            }
            else {
                proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 0);
            }
            proxy.pageContainer.style.width = proxy.viewerContainer.clientWidth + 'px';
            if (proxy.pdfViewer.toolbarModule) {
                // tslint:disable-next-line:max-line-length
                proxy.pdfViewer.toolbarModule.onToolbarResize((proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerMainContainerWidth() : proxy.pdfViewer.element.clientWidth));
            }
            if (this.pdfViewer.enableToolbar && this.pdfViewer.thumbnailViewModule) {
                proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.currentPageNumber - 1);
            }
            if (proxy.pdfViewer.textSearchModule) {
                proxy.pdfViewer.textSearchModule.textSearchBoxOnResize();
            }
            proxy.updateZoomValue();
        };
        this.viewerContainerOnMousedown = (event) => {
            if (event.button === 0) {
                this.isViewerMouseDown = true;
                if (event.detail === 1) {
                    this.focusViewerContainer();
                }
                this.scrollPosition = this.viewerContainer.scrollTop / this.getZoomFactor();
                this.mouseX = event.clientX;
                this.mouseY = event.clientY;
                // tslint:disable-next-line
                let isIE = !!document.documentMode;
                if (this.pdfViewer.textSelectionModule && !this.isClickedOnScrollBar(event) && !this.isTextSelectionDisabled) {
                    if (!isIE) {
                        event.preventDefault();
                    }
                    this.pdfViewer.textSelectionModule.clearTextSelection();
                }
            }
            if (this.isPanMode) {
                this.dragX = event.pageX;
                this.dragY = event.pageY;
                // tslint:disable-next-line:max-line-length
                if (this.viewerContainer.contains(event.target) && (event.target !== this.viewerContainer) && (event.target !== this.pageContainer) && this.isPanMode) {
                    this.viewerContainer.style.cursor = 'grabbing';
                }
            }
        };
        this.viewerContainerOnMouseup = (event) => {
            if (this.isViewerMouseDown) {
                if (this.scrollHoldTimer) {
                    clearTimeout(this.scrollHoldTimer);
                    this.scrollHoldTimer = null;
                }
                if ((this.scrollPosition * this.getZoomFactor()) !== this.viewerContainer.scrollTop) {
                    this.pageViewScrollChanged(this.currentPageNumber);
                }
            }
            if (event.button === 0) {
                // 0 is for left button.
                let eventTarget = event.target;
                if (eventTarget.classList.contains('e-pv-page-canvas')) {
                    let idStringArray = eventTarget.id.split('_');
                    // tslint:disable-next-line
                    this.pdfViewer.firePageClick(event.offsetX, event.offsetY, parseInt(idStringArray[idStringArray.length - 1]) + 1);
                }
                // tslint:disable-next-line:max-line-length
                if (this.viewerContainer.contains(event.target) && (event.target !== this.viewerContainer) && (event.target !== this.pageContainer) && this.isPanMode) {
                    this.viewerContainer.style.cursor = 'move';
                    this.viewerContainer.style.cursor = '-webkit-grab';
                    this.viewerContainer.style.cursor = '-moz-grab';
                    this.viewerContainer.style.cursor = 'grab';
                }
            }
            this.isViewerMouseDown = false;
        };
        this.viewerContainerOnMouseWheel = (event) => {
            this.isViewerMouseWheel = true;
            if (this.getRerenderCanvasCreated()) {
                event.preventDefault();
            }
            if (this.pdfViewer.magnificationModule) {
                this.pdfViewer.magnificationModule.pageRerenderOnMouseWheel();
                if (event.ctrlKey) {
                    event.preventDefault();
                }
                this.pdfViewer.magnificationModule.fitPageScrollMouseWheel(event);
            }
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                if (this.isViewerMouseDown) {
                    if (!event.target.classList.contains('e-pv-text')) {
                        this.pdfViewer.textSelectionModule.textSelectionOnMouseWheel(this.currentPageNumber - 1);
                    }
                }
            }
        };
        this.viewerContainerOnKeyDown = (event) => {
            let isMac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
            let isCommandKey = isMac ? event.metaKey : false;
            if (event.ctrlKey || isCommandKey) {
                // add keycodes if shift key is used.
                if ((event.shiftKey && !isMac) || (isMac && !event.shiftKey)) {
                    switch (event.keyCode) {
                        case 38: // up arrow
                        case 33: // page up
                            event.preventDefault();
                            if (this.currentPageNumber !== 1) {
                                this.updateScrollTop(0);
                            }
                            break;
                        case 40: // down arrow
                        case 34: // page down
                            event.preventDefault();
                            if (this.currentPageNumber !== this.pageCount) {
                                this.updateScrollTop(this.pageCount - 1);
                            }
                            break;
                        default:
                            break;
                    }
                }
                switch (event.keyCode) {
                    case 79: // o key
                        if (this.pdfViewer.toolbarModule && this.pdfViewer.enableToolbar) {
                            this.pdfViewer.toolbarModule.openFileDialogBox(event);
                        }
                        break;
                    case 67: // c key
                        if (this.pdfViewer.textSelectionModule && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled) {
                            event.preventDefault();
                            this.pdfViewer.textSelectionModule.copyText();
                        }
                        break;
                    case 70: // f key
                        if (this.pdfViewer.textSearchModule && this.pdfViewer.enableTextSearch) {
                            event.preventDefault();
                            this.pdfViewer.toolbarModule.textSearchButtonHandler();
                        }
                        break;
                    default:
                        break;
                }
            }
            if (this.pdfViewer.magnificationModule) {
                this.pdfViewer.magnificationModule.magnifyBehaviorKeyDown(event);
            }
        };
        this.viewerContainerOnMousemove = (event) => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
            // tslint:disable-next-line
            let isIE = !!document.documentMode;
            if (this.isViewerMouseDown) {
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewer.textSelectionModule && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled) {
                    // text selection won't perform if we start the selection from hyperlink content by commenting this line.
                    // this region block the toc/hyperlink navigation on sometimes.
                    // if ((event.target as HTMLElement).classList.contains('e-pv-hyperlink') && this.pdfViewer.linkAnnotationModule) {
                    // this.pdfViewer.linkAnnotationModule.modifyZindexForHyperlink((event.target as HTMLElement), true);
                    // }
                    if (!isIE) {
                        event.preventDefault();
                        this.pdfViewer.textSelectionModule.textSelectionOnMouseMove(event.target, this.mouseX, this.mouseY);
                    }
                    else {
                        let selection = window.getSelection();
                        if (!selection.type && !selection.isCollapsed && selection.anchorNode !== null) {
                            this.pdfViewer.textSelectionModule.isTextSelection = true;
                        }
                    }
                }
                else {
                    event.preventDefault();
                }
            }
            if (this.isPanMode) {
                this.panOnMouseMove(event);
            }
        };
        this.panOnMouseMove = (event) => {
            // tslint:disable-next-line:max-line-length
            if (this.viewerContainer.contains(event.target) && (event.target !== this.viewerContainer) && (event.target !== this.pageContainer)) {
                if (this.isViewerMouseDown) {
                    let deltaX = this.dragX - event.pageX;
                    let deltaY = this.dragY - event.pageY;
                    this.viewerContainer.scrollTop = this.viewerContainer.scrollTop + deltaY;
                    this.viewerContainer.scrollLeft = this.viewerContainer.scrollLeft + deltaX;
                    this.viewerContainer.style.cursor = 'move';
                    this.viewerContainer.style.cursor = '-webkit-grabbing';
                    this.viewerContainer.style.cursor = '-moz-grabbing';
                    this.viewerContainer.style.cursor = 'grabbing';
                    this.dragX = event.pageX;
                    this.dragY = event.pageY;
                }
                else {
                    if (!this.navigationPane.isNavigationPaneResized) {
                        this.viewerContainer.style.cursor = 'move';
                        this.viewerContainer.style.cursor = '-webkit-grab';
                        this.viewerContainer.style.cursor = '-moz-grab';
                        this.viewerContainer.style.cursor = 'grab';
                    }
                }
            }
            else {
                if (!this.navigationPane.isNavigationPaneResized) {
                    this.viewerContainer.style.cursor = 'auto';
                }
            }
        };
        this.viewerContainerOnMouseLeave = (event) => {
            if (this.isViewerMouseDown) {
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                    this.pdfViewer.textSelectionModule.textSelectionOnMouseLeave(event);
                }
            }
        };
        this.viewerContainerOnMouseEnter = (event) => {
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                this.pdfViewer.textSelectionModule.clear();
            }
        };
        this.viewerContainerOnMouseOver = (event) => {
            // tslint:disable-next-line
            let isIE = !!document.documentMode;
            if (this.isViewerMouseDown) {
                if (!isIE) {
                    event.preventDefault();
                }
            }
        };
        this.viewerContainerOnClick = (event) => {
            if (event.type === 'dblclick') {
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                    if (event.target.classList.contains('e-pv-text')) {
                        this.isViewerContainerDoubleClick = true;
                        this.pdfViewer.textSelectionModule.selectAWord(event.target, event.clientX, event.clientY, false);
                        this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(true, false);
                        this.dblClickTimer = setTimeout(() => { this.applySelection(); }, 100);
                    }
                }
            }
            else {
                if (event.detail === 3) {
                    if (this.isViewerContainerDoubleClick) {
                        clearTimeout(this.dblClickTimer);
                        this.isViewerContainerDoubleClick = false;
                    }
                    if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                        this.pdfViewer.textSelectionModule.selectEntireLine(event);
                        this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(true, false);
                        this.applySelection();
                    }
                }
            }
        };
        this.viewerContainerOnDragStart = (event) => {
            // tslint:disable-next-line
            let isIE = !!document.documentMode;
            if (!isIE) {
                event.preventDefault();
            }
        };
        // tslint:disable-next-line
        this.viewerContainerOnContextMenuClick = (event) => {
            this.isViewerMouseDown = false;
        };
        this.onWindowMouseUp = (event) => {
            if (event.button === 0) {
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                    // tslint:disable-next-line:max-line-length
                    if (event.detail === 1 && !this.viewerContainer.contains(event.target) && !this.contextMenuModule.contextMenuElement.contains(event.target)) {
                        if (window.getSelection().anchorNode !== null) {
                            this.pdfViewer.textSelectionModule.textSelectionOnMouseup();
                        }
                    }
                    if (this.viewerContainer.contains(event.target)) {
                        if (!this.isClickedOnScrollBar(event) && !this.isScrollbarMouseDown) {
                            this.pdfViewer.textSelectionModule.textSelectionOnMouseup();
                        }
                        else {
                            if (window.getSelection().anchorNode !== null) {
                                this.pdfViewer.textSelectionModule.applySpanForSelection();
                            }
                        }
                    }
                }
            }
            else if (event.button === 2) {
                if (this.viewerContainer.contains(event.target)) {
                    window.getSelection().removeAllRanges();
                }
            }
            if (this.isViewerMouseDown) {
                this.isViewerMouseDown = false;
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                    this.pdfViewer.textSelectionModule.clear();
                    this.pdfViewer.textSelectionModule.selectionStartPage = null;
                }
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
            else {
                return true;
            }
        };
        this.onWindowTouchEnd = (event) => {
            // tslint:disable-next-line:max-line-length
            if (!this.pdfViewer.element.contains(event.target) && !this.contextMenuModule.contextMenuElement.contains(event.target)) {
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                    this.pdfViewer.textSelectionModule.clearTextSelection();
                }
            }
        };
        this.viewerContainerOnTouchStart = (event) => {
            let touchPoints = event.touches;
            if (this.pdfViewer.magnificationModule) {
                this.pdfViewer.magnificationModule.setTouchPoints(touchPoints[0].clientX, touchPoints[0].clientY);
            }
            if (touchPoints.length === 1) {
                this.preventTouchEvent(event);
            }
            this.touchClientX = touchPoints[0].clientX;
            this.touchClientY = touchPoints[0].clientY;
            // tslint:disable-next-line:max-line-length
            if (touchPoints.length === 1 && !(event.target.classList.contains('e-pv-touch-select-drop') || event.target.classList.contains('e-pv-touch-ellipse'))) {
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                    this.pdfViewer.textSelectionModule.clearTextSelection();
                    this.contextMenuModule.contextMenuObj.close();
                    // event.preventDefault();
                    if (!this.isLongTouchPropagated) {
                        this.longTouchTimer = setTimeout(() => { this.viewerContainerOnLongTouch(event); }, 1000);
                    }
                    this.isLongTouchPropagated = true;
                }
            }
        };
        this.viewerContainerOnLongTouch = (event) => {
            this.touchClientX = event.touches[0].clientX;
            this.touchClientY = event.touches[0].clientY;
            event.preventDefault();
            if (this.pdfViewer.textSelectionModule) {
                this.pdfViewer.textSelectionModule.initiateTouchSelection(event, this.touchClientX, this.touchClientY);
            }
        };
        this.viewerContainerOnPointerDown = (event) => {
            if (event.pointerType === 'touch') {
                this.pointerCount++;
                if (this.pointerCount <= 2) {
                    event.preventDefault();
                    this.pointersForTouch.push(event);
                    if (this.pointerCount === 2) {
                        this.pointerCount = 0;
                    }
                    if (this.pdfViewer.magnificationModule) {
                        this.pdfViewer.magnificationModule.setTouchPoints(event.clientX, event.clientY);
                    }
                }
            }
        };
        this.viewerContainerOnTouchMove = (event) => {
            this.preventTouchEvent(event);
            let touchPoints = event.touches;
            if (this.pdfViewer.magnificationModule) {
                if (touchPoints.length > 1 && this.pageCount > 0) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.magnificationModule.initiatePinchMove(touchPoints[0].clientX, touchPoints[0].clientY, touchPoints[1].clientX, touchPoints[1].clientY);
                }
                else if (touchPoints.length === 1 && this.getPagesPinchZoomed()) {
                    this.pdfViewer.magnificationModule.pinchMoveScroll();
                }
            }
            touchPoints = null;
        };
        this.viewerContainerOnPointerMove = (event) => {
            if (event.pointerType === 'touch' && this.pageCount > 0) {
                event.preventDefault();
                if (this.pointersForTouch.length === 2) {
                    for (let i = 0; i < this.pointersForTouch.length; i++) {
                        if (event.pointerId === this.pointersForTouch[i].pointerId) {
                            this.pointersForTouch[i] = event;
                            break;
                        }
                    }
                    if (this.pdfViewer.magnificationModule) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.magnificationModule.initiatePinchMove(this.pointersForTouch[0].clientX, this.pointersForTouch[0].clientY, this.pointersForTouch[1].clientX, this.pointersForTouch[1].clientY);
                    }
                }
            }
        };
        this.viewerContainerOnTouchEnd = (event) => {
            if (this.pdfViewer.magnificationModule) {
                this.pdfViewer.magnificationModule.pinchMoveEnd();
            }
            this.isLongTouchPropagated = false;
            clearInterval(this.longTouchTimer);
            this.longTouchTimer = null;
        };
        this.viewerContainerOnPointerEnd = (event) => {
            if (event.pointerType === 'touch') {
                event.preventDefault();
                if (this.pdfViewer.magnificationModule) {
                    this.pdfViewer.magnificationModule.pinchMoveEnd();
                }
                this.pointersForTouch = [];
                this.pointerCount = 0;
            }
        };
        this.viewerContainerOnScroll = () => {
            let proxy = this;
            if (this.scrollHoldTimer) {
                clearTimeout(this.scrollHoldTimer);
            }
            let pageIndex = this.currentPageNumber;
            this.scrollHoldTimer = null;
            this.contextMenuModule.contextMenuObj.close();
            let verticalScrollValue = this.viewerContainer.scrollTop;
            // tslint:disable-next-line:max-line-length
            for (let i = 0; i < this.pageCount; i++) {
                if (this.pageSize[i] != null) {
                    let pageHeight = this.getPageHeight(i);
                    // tslint:disable-next-line:max-line-length
                    if ((verticalScrollValue + this.pageStopValue) <= (this.getPageTop(i) + pageHeight)) {
                        this.currentPageNumber = i + 1;
                        break;
                    }
                }
            }
            this.renderElementsVirtualScroll(this.currentPageNumber);
            // tslint:disable-next-line:max-line-length
            if (!this.isViewerMouseDown && !this.getPinchZoomed() && !this.getPinchScrolled() && !this.getPagesPinchZoomed() || this.isViewerMouseWheel) {
                this.pageViewScrollChanged(this.currentPageNumber);
                this.isViewerMouseWheel = false;
            }
            else {
                this.showPageLoadingIndicator(this.currentPageNumber - 1, false);
            }
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.toolbarModule.updateCurrentPage(this.currentPageNumber);
                this.pdfViewer.toolbarModule.updateNavigationButtons();
            }
            if (pageIndex !== this.currentPageNumber) {
                if (proxy.pdfViewer.thumbnailViewModule) {
                    proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.currentPageNumber - 1);
                    proxy.pdfViewer.thumbnailViewModule.isThumbnailClicked = false;
                }
                this.pdfViewer.firePageChange(pageIndex);
            }
            if (this.pdfViewer.magnificationModule) {
                this.pdfViewer.magnificationModule.updatePagesForFitPage(this.currentPageNumber - 1);
            }
            let currentPage = this.getElement('_pageDiv_' + (this.currentPageNumber - 1));
            if (currentPage) {
                currentPage.style.visibility = 'visible';
            }
            if (this.isViewerMouseDown) {
                if (this.getRerenderCanvasCreated()) {
                    this.pdfViewer.magnificationModule.clearIntervalTimer();
                }
                this.scrollHoldTimer = setTimeout(() => { this.initiatePageViewScrollChanged(); }, 100);
            }
        };
        this.pdfViewer = viewer;
        this.navigationPane = new NavigationPane(this.pdfViewer, this);
        this.textLayer = new TextLayer(this.pdfViewer, this);
    }
    /**
     * @private
     */
    initializeComponent() {
        let element = document.getElementById(this.pdfViewer.element.id);
        if (element) {
            let controlWidth = '100%';
            let toolbarDiv;
            // tslint:disable-next-line:max-line-length
            this.viewerMainContainer = createElement('div', { id: this.pdfViewer.element.id + '_viewerMainContainer', className: 'e-pv-viewer-main-container' });
            // tslint:disable-next-line:max-line-length
            this.viewerContainer = createElement('div', { id: this.pdfViewer.element.id + '_viewerContainer', className: 'e-pv-viewer-container' });
            this.viewerContainer.tabIndex = 0;
            element.style.touchAction = 'pan-x pan-y';
            element.style.minHeight = '500px';
            // tslint:disable-next-line:max-line-length
            this.mainContainer = createElement('div', { id: this.pdfViewer.element.id + '_mainContainer', className: 'e-pv-main-container' });
            this.mainContainer.appendChild(this.viewerMainContainer);
            element.appendChild(this.mainContainer);
            if (this.pdfViewer.toolbarModule) {
                this.navigationPane.initializeNavigationPane();
                toolbarDiv = this.pdfViewer.toolbarModule.intializeToolbar(controlWidth);
            }
            if (toolbarDiv) {
                // tslint:disable-next-line:max-line-length
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 56);
            }
            else {
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 0);
            }
            // tslint:disable-next-line:max-line-length
            let viewerWidth = (this.pdfViewer.element.clientWidth - (this.navigationPane.sideBarToolbar ? this.navigationPane.getViewerContainerLeft() : 0));
            this.viewerContainer.style.width = viewerWidth + 'px';
            this.viewerMainContainer.appendChild(this.viewerContainer);
            // tslint:disable-next-line:max-line-length
            this.pageContainer = createElement('div', { id: this.pdfViewer.element.id + '_pageViewContainer', className: 'e-pv-page-container' });
            this.viewerContainer.appendChild(this.pageContainer);
            this.pageContainer.style.width = this.viewerContainer.clientWidth + 'px';
            if (toolbarDiv && this.pdfViewer.thumbnailViewModule) {
                this.pdfViewer.thumbnailViewModule.createThumbnailContainer();
            }
            // this.createPasswordPopup();
            this.createPrintPopup();
            this.waitingPopup = createElement('div', { id: this.pdfViewer.element.id + '_loadingIndicator' });
            this.viewerContainer.appendChild(this.waitingPopup);
            createSpinner({ target: this.waitingPopup, cssClass: 'e-spin-center' });
            this.setLoaderProperties(this.waitingPopup);
            this.contextMenuModule = new ContextMenu$1(this.pdfViewer, this);
            this.contextMenuModule.createContextMenu();
            this.wireEvents();
            if (this.pdfViewer.textSearchModule) {
                this.pdfViewer.textSearchModule.createTextSearchBox();
            }
            if (this.pdfViewer.documentPath) {
                this.pdfViewer.load(this.pdfViewer.documentPath, null);
            }
        }
    }
    /**
     * @private
     */
    initiatePageRender(documentData, password) {
        this.documentId = this.createGUID();
        this.viewerContainer.scrollTop = 0;
        this.showLoadingIndicator(true);
        this.hashId = ' ';
        this.isFileName = false;
        this.saveDocumentInfo();
        documentData = this.checkDocumentData(documentData);
        this.setFileName();
        let jsonObject = this.constructJsonObject(documentData, password);
        this.createAjaxRequest(jsonObject, documentData, password);
    }
    createAjaxRequest(jsonObject, documentData, password) {
        let request = new XMLHttpRequest();
        request.open('POST', this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.load);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); // jshint ignore:line
        request.responseType = 'json';
        request.send(JSON.stringify(jsonObject)); // jshint ignore:line
        // tslint:disable-next-line
        request.onreadystatechange = (event) => {
            if (request.readyState === 4 && request.status === 200) {
                // tslint:disable-next-line
                let data = event.currentTarget.response; // jshint ignore:line
                // tslint:disable-next-line:max-line-length
                if (typeof data !== 'object') {
                    data = JSON.parse(data);
                }
                this.requestSuccess(data, documentData, password);
            }
            else if (request.readyState === 4 && request.status === 400) { // jshint ignore:line
                // error
                this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
            }
        };
        // tslint:disable-next-line
        request.onerror = (event) => {
            this.openNotificationPopup();
            this.showLoadingIndicator(false);
            this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText); // jshint ignore:line
        };
    }
    /**
     * @private
     */
    openNotificationPopup() {
        this.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('Server error'));
        this.getElement('_notify').classList.add('e-pv-notification-large-content');
    }
    // tslint:disable-next-line
    requestSuccess(data, documentData, password) {
        if (data && data.pageCount !== undefined) {
            this.pageCount = data.pageCount;
            this.hashId = data.hashId;
            this.documentLiveCount = data.documentLiveCount;
            this.saveDocumentHashData();
            this.pageRender(data);
        }
        else {
            this.pageCount = 0;
            this.currentPageNumber = 0;
            if (data === 4) {
                // 4 is error code for encrypted document.
                this.renderPasswordPopup(documentData, password);
            }
            else if (data === 3) {
                // 3 is error code for corrupted document.
                this.renderCorruptPopup();
            }
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.toolbarModule.updateToolbarItems();
            }
        }
        if (this.pdfViewer.thumbnailViewModule) {
            this.pdfViewer.thumbnailViewModule.createRequestForThumbnails();
        }
        if (this.pdfViewer.bookmarkViewModule) {
            this.pdfViewer.bookmarkViewModule.createRequestForBookmarks();
        }
    }
    // tslint:disable-next-line
    pageRender(data) {
        this.document = null;
        this.passwordDialogReset();
        if (this.passwordPopup) {
            this.passwordPopup.hide();
        }
        let pageIndex = 0;
        this.initPageDiv(data);
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.isAutoZoom = true;
            this.pdfViewer.magnificationModule.isInitialLoading = true;
            this.onWindowResize();
            this.pdfViewer.magnificationModule.isInitialLoading = false;
        }
        this.isDocumentLoaded = true;
        if (this.renderedPagesList.indexOf(pageIndex) === -1) {
            this.createRequestForRender(pageIndex);
            let pageNumber = pageIndex + 1;
            if (this.pageSize[pageNumber]) {
                let pageTop = this.getPageTop(pageNumber);
                let viewerHeight = this.viewerContainer.clientHeight;
                while (viewerHeight > pageTop) {
                    if (this.pageSize[pageNumber]) {
                        this.renderPageElement(pageNumber);
                        this.createRequestForRender(pageNumber);
                        pageTop = this.getPageTop(pageNumber);
                        pageNumber = pageNumber + 1;
                    }
                    else {
                        break;
                    }
                }
            }
        }
        this.showLoadingIndicator(false);
        this.currentPageNumber = pageIndex + 1;
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.uploadedDocumentName = null;
            this.pdfViewer.toolbarModule.updateCurrentPage(this.currentPageNumber);
            this.pdfViewer.toolbarModule.updateToolbarItems();
        }
    }
    renderPasswordPopup(documentData, password) {
        if (!this.isPasswordAvailable) {
            if (this.isFileName) {
                this.document = documentData;
            }
            else {
                this.document = 'data:application/pdf;base64,' + documentData;
            }
            this.createPasswordPopup();
            this.pdfViewer.fireDocumentLoadFailed(true, null);
            this.passwordPopup.show();
        }
        else {
            this.pdfViewer.fireDocumentLoadFailed(true, password);
            this.promptElement.classList.add('e-pv-password-error');
            this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Invalid Password');
            if (this.isFileName) {
                this.document = documentData;
            }
            else {
                this.document = 'data:application/pdf;base64,' + documentData;
            }
            this.passwordPopup.show();
        }
    }
    renderCorruptPopup() {
        this.pdfViewer.fireDocumentLoadFailed(false, null);
        this.createCorruptedPopup();
        this.documentId = null;
        this.corruptPopup.show();
    }
    constructJsonObject(documentData, password) {
        let jsonObject;
        if (password) {
            this.isPasswordAvailable = true;
            // tslint:disable-next-line:max-line-length
            jsonObject = { document: documentData, password: password, zoomFactor: 1, isFileName: this.isFileName };
        }
        else {
            this.isPasswordAvailable = false;
            jsonObject = { document: documentData, zoomFactor: 1, isFileName: this.isFileName };
        }
        return jsonObject;
    }
    checkDocumentData(documentData) {
        let base64String = documentData.split('base64,')[1];
        if (base64String === undefined) {
            this.isFileName = true;
            if (this.pdfViewer.fileName === null) {
                // tslint:disable-next-line:max-line-length
                let documentStringArray = (documentData.indexOf('\\') !== -1) ? documentData.split('\\') : documentData.split('/');
                this.pdfViewer.fileName = documentStringArray[documentStringArray.length - 1];
                base64String = documentData;
            }
        }
        return base64String;
    }
    setFileName() {
        if (this.pdfViewer.fileName === null) {
            if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.uploadedDocumentName !== null) {
                this.pdfViewer.fileName = this.pdfViewer.toolbarModule.uploadedDocumentName;
            }
            else {
                this.pdfViewer.fileName = 'undefined.pdf';
            }
        }
    }
    saveDocumentInfo() {
        window.sessionStorage.setItem('currentDocument', this.documentId);
        window.sessionStorage.setItem('serviceURL', this.pdfViewer.serviceUrl);
        window.sessionStorage.setItem('unload', this.pdfViewer.serverActionSettings.unload);
    }
    saveDocumentHashData() {
        window.sessionStorage.setItem('hashId', this.hashId);
        window.sessionStorage.setItem('documentLiveCount', this.documentLiveCount.toString());
    }
    updateWaitingPopup(pageNumber) {
        if (this.pageSize[pageNumber].top != null) {
            // tslint:disable-next-line:max-line-length
            let pageCurrentRect = this.getElement('_pageDiv_' + pageNumber).getBoundingClientRect();
            let waitingPopup = this.getElement('_pageDiv_' + pageNumber).firstChild.firstChild;
            if (pageCurrentRect.top < 0) {
                if (this.toolbarHeight + (this.viewerContainer.clientHeight / 2) - pageCurrentRect.top < pageCurrentRect.height) {
                    waitingPopup.style.top = ((this.viewerContainer.clientHeight / 2) - pageCurrentRect.top) - this.toolbarHeight + 'px';
                }
                else {
                    if (this.toolbarHeight + (pageCurrentRect.bottom / 2) - pageCurrentRect.top < pageCurrentRect.height) {
                        waitingPopup.style.top = ((pageCurrentRect.bottom / 2) - pageCurrentRect.top) - this.toolbarHeight + 'px';
                    }
                }
            }
            else {
                waitingPopup.style.top = this.viewerContainer.clientHeight / 2 + 'px';
            }
            if (this.getZoomFactor() > 1.25 && pageCurrentRect.width > this.viewerContainer.clientWidth) {
                waitingPopup.style.left = this.viewerContainer.clientWidth / 2 + 'px';
            }
            else {
                waitingPopup.style.left = pageCurrentRect.width / 2 + 'px';
            }
        }
    }
    createWaitingPopup(pageNumber) {
        // tslint:disable-next-line:max-line-length
        this.waitingPopup = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageNumber);
        if (this.waitingPopup) {
            createSpinner({ target: this.waitingPopup });
            this.setLoaderProperties(this.waitingPopup);
        }
    }
    showLoadingIndicator(isShow) {
        this.waitingPopup = this.getElement('_loadingIndicator');
        if (this.waitingPopup != null) {
            if (isShow) {
                showSpinner(this.waitingPopup);
            }
            else {
                hideSpinner(this.waitingPopup);
            }
        }
    }
    showPageLoadingIndicator(pageIndex, isShow) {
        this.waitingPopup = this.getElement('_pageDiv_' + pageIndex);
        if (this.waitingPopup != null) {
            if (isShow) {
                showSpinner(this.waitingPopup);
            }
            else {
                hideSpinner(this.waitingPopup);
            }
            this.updateWaitingPopup(pageIndex);
        }
    }
    /**
     * @private
     */
    showPrintLoadingIndicator(isShow) {
        this.printWaitingPopup = this.getElement('_printLoadingIndicator');
        if (this.printWaitingPopup != null) {
            if (isShow) {
                this.printMainContainer.style.display = 'block';
                showSpinner(this.printWaitingPopup);
            }
            else {
                this.printMainContainer.style.display = 'none';
                hideSpinner(this.printWaitingPopup);
            }
        }
    }
    setLoaderProperties(element) {
        let spinnerElement = element.firstChild.firstChild.firstChild;
        spinnerElement.style.height = '48px';
        spinnerElement.style.width = '48px';
        spinnerElement.style.transformOrigin = '24px 24px 24px';
    }
    /**
     * @private
     */
    updateScrollTop(pageNumber) {
        // tslint:disable-next-line
        if (this.pageSize[pageNumber] != null) {
            this.viewerContainer.scrollTop = this.getPageTop(pageNumber);
            this.renderElementsVirtualScroll(pageNumber);
            if (this.renderedPagesList.indexOf(pageNumber) === -1) {
                this.createRequestForRender(pageNumber);
            }
        }
    }
    /**
     * @private
     */
    getZoomFactor() {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.zoomFactor;
        }
        else {
            // default value
            return 1;
        }
    }
    /**
     * @private
     */
    getPinchZoomed() {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPinchZoomed;
        }
        else {
            // default value
            return false;
        }
    }
    /**
     * @private
     */
    getMagnified() {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isMagnified;
        }
        else {
            // default value
            return false;
        }
    }
    getPinchScrolled() {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPinchScrolled;
        }
        else {
            // default value
            return false;
        }
    }
    getPagesPinchZoomed() {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPagePinchZoomed;
        }
        else {
            // default value
            return false;
        }
    }
    getPagesZoomed() {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPagesZoomed;
        }
        else {
            // default value
            return false;
        }
    }
    getRerenderCanvasCreated() {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isRerenderCanvasCreated;
        }
        else {
            // default value
            return false;
        }
    }
    /**
     * @private
     */
    getDocumentId() {
        return this.documentId;
    }
    /**
     * @private
     */
    download() {
        if (this.pageCount > 0) {
            this.createRequestForDownload();
        }
    }
    /**
     * @private
     */
    clear(isTriggerEvent) {
        this.isPasswordAvailable = false;
        this.isDocumentLoaded = false;
        this.initiateTextSelectMode();
        if (this.navigationPane.sideBarToolbar) {
            this.navigationPane.clear();
        }
        if (this.pdfViewer.thumbnailViewModule) {
            this.pdfViewer.thumbnailViewModule.clear();
        }
        if (this.pdfViewer.bookmarkViewModule) {
            this.pdfViewer.bookmarkViewModule.clear();
        }
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.clearIntervalTimer();
        }
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        if (this.pdfViewer.textSearchModule) {
            this.pdfViewer.textSearchModule.resetTextSearch();
        }
        if (this.pageSize) {
            this.pageSize = [];
        }
        if (this.renderedPagesList) {
            this.renderedPagesList = [];
        }
        while (this.pageContainer.hasChildNodes()) {
            this.pageContainer.removeChild(this.pageContainer.lastChild);
        }
        if (this.pageCount > 0) {
            this.unloadDocument(null);
        }
        this.windowSessionStorageClear();
        if (this.pinchZoomStorage) {
            this.pinchZoomStorage = [];
        }
        if (isTriggerEvent && this.pageCount > 0) {
            this.pdfViewer.fireDocumentUnload(this.pdfViewer.fileName);
        }
        this.pdfViewer.fileName = null;
    }
    /**
     * @private
     */
    destroy() {
        this.unWireEvents();
        this.clear(false);
        this.pageContainer.parentNode.removeChild(this.pageContainer);
        this.viewerContainer.parentNode.removeChild(this.viewerContainer);
        if (this.pdfViewer.thumbnailViewModule) {
            this.pdfViewer.thumbnailViewModule.clear();
        }
        if (this.pdfViewer.bookmarkViewModule) {
            this.pdfViewer.bookmarkViewModule.clear();
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    unloadDocument(e) {
        let documentId = window.sessionStorage.getItem('hashId');
        let documentLiveCount = window.sessionStorage.getItem('documentLiveCount');
        if (documentId !== null) {
            let jsonObject = { hashId: documentId, documentLiveCount: documentLiveCount };
            let request = new XMLHttpRequest();
            request.open('POST', window.sessionStorage.getItem('serviceURL') + '/' + window.sessionStorage.getItem('unload'), false);
            request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            request.send(JSON.stringify(jsonObject));
            // tslint:disable-next-line
            request.onreadystatechange = (event) => {
                if (request.readyState === 4 && request.status === 400) {
                    // error message
                    this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
                }
            };
            // tslint:disable-next-line
            request.onerror = (event) => {
                this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
            };
        }
        window.sessionStorage.removeItem('hashId');
        window.sessionStorage.removeItem('documentLiveCount');
    }
    /**
     * @private
     */
    windowSessionStorageClear() {
        window.sessionStorage.removeItem('currentDocument');
        window.sessionStorage.removeItem('serviceURL');
        window.sessionStorage.removeItem('unload');
        this.sessionStorage.forEach((element) => {
            window.sessionStorage.removeItem(element);
        });
    }
    /**
     * @private
     */
    focusViewerContainer() {
        let scrollX = window.scrollX;
        let scrollY = window.scrollY;
        // tslint:disable-next-line
        let parentNode = this.getScrollParent(this.viewerContainer);
        let scrollNodeX = 0;
        let scrollNodeY = 0;
        if (parentNode !== null) {
            scrollNodeX = parentNode.scrollLeft;
            scrollNodeY = parentNode.scrollTop;
        }
        this.viewerContainer.focus();
        // tslint:disable-next-line:max-line-length
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1 || navigator.userAgent.indexOf('Edge') !== -1 && parentNode != null) {
            parentNode.scrollLeft = scrollNodeX;
            parentNode.scrollTop = scrollNodeY;
        }
        else if (parentNode !== null) {
            parentNode.scrollTo(scrollNodeX, scrollNodeY);
        }
        window.scrollTo(scrollX, scrollY);
    }
    // tslint:disable-next-line
    getScrollParent(node) {
        if (node === null || node.nodeName === 'HTML') {
            return null;
        }
        let style = getComputedStyle(node);
        if (this.viewerContainer.id !== node.id && (style.overflowY === 'scroll' || style.overflowY === 'auto')) {
            return node;
        }
        else {
            return this.getScrollParent(node.parentNode);
        }
    }
    createCorruptedPopup() {
        // tslint:disable-next-line:max-line-length
        let popupElement = createElement('div', { id: this.pdfViewer.element.id + '_corrupted_popup', className: 'e-pv-corrupted-popup' });
        this.pageContainer.appendChild(popupElement);
        this.corruptPopup = new Dialog({
            showCloseIcon: true, closeOnEscape: true, isModal: true,
            // tslint:disable-next-line:max-line-length
            header: '<div class="e-pv-corrupted-popup-header"> ' + this.pdfViewer.localeObj.getConstant('File Corrupted') + '</div>', content: '<div id="template" class="e-pv-notification-icon"> <div class="e-pv-corrupted-popup-content">' + this.pdfViewer.localeObj.getConstant('File Corrupted Content') + '</div></div>', visible: false,
            // tslint:disable-next-line:max-line-length
            buttons: [{ buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.closeCorruptPopup.bind(this) }],
            target: this.pdfViewer.element, beforeClose: () => {
                this.corruptPopup.destroy();
                this.getElement('_corrupted_popup').remove();
                this.corruptPopup = null;
                this.waitingPopup = this.getElement('_loadingIndicator');
                if (this.waitingPopup != null) {
                    hideSpinner(this.waitingPopup);
                }
            }
        });
        this.corruptPopup.appendTo(popupElement);
    }
    closeCorruptPopup() {
        this.corruptPopup.hide();
        this.waitingPopup = this.getElement('_loadingIndicator');
        if (this.waitingPopup !== null) {
            hideSpinner(this.waitingPopup);
        }
    }
    createPrintPopup() {
        let element = document.getElementById(this.pdfViewer.element.id);
        this.printMainContainer = createElement('div', { id: this.pdfViewer.element.id + '_printcontainer',
            className: 'e-pv-print-popup-container' });
        element.appendChild(this.printMainContainer);
        this.printMainContainer.style.display = 'none';
        this.printWaitingPopup = createElement('div', { id: this.pdfViewer.element.id + '_printLoadingIndicator',
            className: 'e-pv-print-loading-container' });
        this.printMainContainer.appendChild(this.printWaitingPopup);
        createSpinner({ target: this.printWaitingPopup, cssClass: 'e-spin-center' });
        this.setLoaderProperties(this.printWaitingPopup);
    }
    createPasswordPopup() {
        // tslint:disable-next-line:max-line-length
        let popupElement = createElement('div', { id: this.pdfViewer.element.id + '_password_popup', className: 'e-pv-password-popup' });
        this.promptElement = createElement('span', { id: this.pdfViewer.element.id + '_prompt' });
        this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Enter Password');
        popupElement.appendChild(this.promptElement);
        let inputContainer = createElement('span', { className: 'e-input-group e-pv-password-input' });
        // tslint:disable-next-line:max-line-length
        this.passwordInput = createElement('input', { id: this.pdfViewer.element.id + '_password_input', className: 'e-input' });
        this.passwordInput.type = 'password';
        this.passwordInput.name = 'Required';
        inputContainer.appendChild(this.passwordInput);
        popupElement.appendChild(inputContainer);
        this.pageContainer.appendChild(popupElement);
        this.passwordPopup = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true,
            header: this.pdfViewer.localeObj.getConstant('Password Protected'), visible: false, buttons: [
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true },
                    click: this.applyPassword.bind(this)
                },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.passwordCancelClick.bind(this) }
            ], close: this.passwordCancel.bind(this), target: this.pdfViewer.element, beforeClose: () => {
                this.passwordPopup.destroy();
                this.getElement('_password_popup').remove();
                this.passwordPopup = null;
                this.waitingPopup = this.getElement('_loadingIndicator');
                if (this.waitingPopup != null) {
                    hideSpinner(this.waitingPopup);
                }
            }
        });
        this.passwordPopup.appendTo(popupElement);
        this.passwordInput.addEventListener('keyup', () => {
            if (this.passwordInput.value === '') {
                this.passwordDialogReset();
            }
        });
        this.passwordInput.addEventListener('focus', () => {
            this.passwordInput.parentElement.classList.add('e-input-focus');
        });
        this.passwordInput.addEventListener('blur', () => {
            this.passwordInput.parentElement.classList.remove('e-input-focus');
        });
    }
    // tslint:disable-next-line
    passwordCancel(args) {
        if (args.isInteraction) {
            this.clear(false);
            this.passwordDialogReset();
            this.passwordInput.value = '';
        }
        this.waitingPopup = this.getElement('_loadingIndicator');
        if (this.waitingPopup !== null) {
            hideSpinner(this.waitingPopup);
        }
    }
    passwordCancelClick() {
        this.clear(false);
        this.passwordDialogReset();
        this.passwordPopup.hide();
        this.waitingPopup = this.getElement('_loadingIndicator');
        if (this.waitingPopup !== null) {
            hideSpinner(this.waitingPopup);
        }
    }
    passwordDialogReset() {
        if (this.promptElement) {
            this.promptElement.classList.remove('e-pv-password-error');
            this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Enter Password');
            this.passwordInput.value = '';
        }
    }
    applyPassword() {
        let password = this.passwordInput.value;
        if (password !== '') {
            this.pdfViewer.load(this.document, password);
        }
        this.focusViewerContainer();
    }
    wireEvents() {
        this.viewerContainer.addEventListener('scroll', this.viewerContainerOnScroll, true);
        this.viewerContainer.addEventListener('mousedown', this.viewerContainerOnMousedown);
        this.viewerContainer.addEventListener('mouseup', this.viewerContainerOnMouseup);
        this.viewerContainer.addEventListener('wheel', this.viewerContainerOnMouseWheel);
        this.viewerContainer.addEventListener('mousemove', this.viewerContainerOnMousemove);
        this.viewerContainer.addEventListener('mouseleave', this.viewerContainerOnMouseLeave);
        this.viewerContainer.addEventListener('mouseenter', this.viewerContainerOnMouseEnter);
        this.viewerContainer.addEventListener('mouseover', this.viewerContainerOnMouseOver);
        this.viewerContainer.addEventListener('click', this.viewerContainerOnClick);
        this.viewerContainer.addEventListener('dblclick', this.viewerContainerOnClick);
        this.viewerContainer.addEventListener('dragstart', this.viewerContainerOnDragStart);
        this.pdfViewer.element.addEventListener('keydown', this.viewerContainerOnKeyDown);
        window.addEventListener('mouseup', this.onWindowMouseUp);
        window.addEventListener('touchend', this.onWindowTouchEnd);
        window.addEventListener('unload', this.unloadDocument);
        window.addEventListener('resize', this.onWindowResize);
        // tslint:disable-next-line:max-line-length
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Trident') !== -1) {
            this.viewerContainer.addEventListener('pointerdown', this.viewerContainerOnPointerDown);
            this.viewerContainer.addEventListener('pointermove', this.viewerContainerOnPointerMove);
            this.viewerContainer.addEventListener('pointerup', this.viewerContainerOnPointerEnd);
            this.viewerContainer.addEventListener('pointerleave', this.viewerContainerOnPointerEnd);
        }
        else {
            this.viewerContainer.addEventListener('touchstart', this.viewerContainerOnTouchStart);
            this.viewerContainer.addEventListener('touchmove', this.viewerContainerOnTouchMove);
            this.viewerContainer.addEventListener('touchend', this.viewerContainerOnTouchEnd);
            this.viewerContainer.addEventListener('touchleave', this.viewerContainerOnTouchEnd);
            this.viewerContainer.addEventListener('touchcancel', this.viewerContainerOnTouchEnd);
        }
    }
    unWireEvents() {
        this.viewerContainer.removeEventListener('scroll', this.viewerContainerOnScroll, true);
        this.viewerContainer.removeEventListener('mousedown', this.viewerContainerOnMousedown);
        this.viewerContainer.removeEventListener('mouseup', this.viewerContainerOnMouseup);
        this.viewerContainer.removeEventListener('wheel', this.viewerContainerOnMouseWheel);
        this.viewerContainer.removeEventListener('mousemove', this.viewerContainerOnMousemove);
        this.viewerContainer.removeEventListener('mouseleave', this.viewerContainerOnMouseLeave);
        this.viewerContainer.removeEventListener('mouseenter', this.viewerContainerOnMouseEnter);
        this.viewerContainer.removeEventListener('mouseover', this.viewerContainerOnMouseOver);
        this.viewerContainer.removeEventListener('click', this.viewerContainerOnClick);
        this.viewerContainer.removeEventListener('dragstart', this.viewerContainerOnDragStart);
        this.viewerContainer.removeEventListener('contextmenu', this.viewerContainerOnContextMenuClick);
        this.pdfViewer.element.removeEventListener('keydown', this.viewerContainerOnKeyDown);
        window.removeEventListener('mouseup', this.onWindowMouseUp);
        window.removeEventListener('unload', this.unloadDocument);
        window.removeEventListener('resize', this.onWindowResize);
        // tslint:disable-next-line:max-line-length
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Trident') !== -1) {
            this.viewerContainer.removeEventListener('pointerdown', this.viewerContainerOnPointerDown);
            this.viewerContainer.removeEventListener('pointermove', this.viewerContainerOnPointerMove);
            this.viewerContainer.removeEventListener('pointerup', this.viewerContainerOnPointerEnd);
            this.viewerContainer.removeEventListener('pointerleave', this.viewerContainerOnPointerEnd);
        }
        else {
            this.viewerContainer.removeEventListener('touchstart', this.viewerContainerOnTouchStart);
            this.viewerContainer.removeEventListener('touchmove', this.viewerContainerOnTouchMove);
            this.viewerContainer.removeEventListener('touchend', this.viewerContainerOnTouchEnd);
            this.viewerContainer.removeEventListener('touchleave', this.viewerContainerOnTouchEnd);
            this.viewerContainer.removeEventListener('touchcancel', this.viewerContainerOnTouchEnd);
        }
    }
    /**
     * @private
     */
    updateZoomValue() {
        if (this.pdfViewer.magnificationModule) {
            if (this.pdfViewer.magnificationModule.isAutoZoom) {
                this.pdfViewer.magnificationModule.fitToAuto();
            }
            else if (this.pdfViewer.magnificationModule.fitType === 'fitToWidth') {
                this.pdfViewer.magnificationModule.fitToWidth();
            }
        }
        for (let i = 0; i < this.pageCount; i++) {
            this.applyLeftPosition(i);
        }
    }
    /**
     * @private
     */
    initiatePanning() {
        this.isPanMode = true;
        this.textLayer.modifyTextCursor(false);
        this.disableTextSelectionMode();
    }
    /**
     * @private
     */
    initiateTextSelectMode() {
        this.isPanMode = false;
        this.viewerContainer.style.cursor = 'auto';
        if (this.pdfViewer.textSelectionModule) {
            this.textLayer.modifyTextCursor(true);
            this.pdfViewer.textSelectionModule.enableTextSelectionMode();
        }
    }
    applySelection() {
        if (window.getSelection().anchorNode !== null) {
            this.pdfViewer.textSelectionModule.applySpanForSelection();
        }
        this.isViewerContainerDoubleClick = false;
    }
    preventTouchEvent(event) {
        if (this.pdfViewer.textSelectionModule) {
            if (!this.isPanMode && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }
    // tslint:disable-next-line
    initPageDiv(pageValues) {
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateTotalPage();
        }
        if (this.pageCount > 0) {
            let topValue = 0;
            let pageLimit = 0;
            if (this.pageCount > 100) {
                // to render 100 pages intially.
                pageLimit = 100;
                this.pageLimit = pageLimit;
            }
            else {
                pageLimit = this.pageCount;
            }
            for (let i = 0; i < pageLimit; i++) {
                let pageSize = pageValues.pageSizes[i].split(',');
                if (pageValues.pageSizes[i - 1] !== null && i !== 0) {
                    let previousPageHeight = pageValues.pageSizes[i - 1].split(',');
                    topValue = this.pageGap + parseFloat(previousPageHeight[1]) + topValue;
                }
                else {
                    topValue = this.pageGap;
                }
                let size = { width: parseFloat(pageSize[0]), height: parseFloat(pageSize[1]), top: topValue };
                this.pageSize.push(size);
            }
            let limit = this.pageCount < 10 ? this.pageCount : 10;
            for (let i = 0; i < limit; i++) {
                this.renderPageContainer(i, this.getPageWidth(i), this.getPageHeight(i), this.getPageTop(i));
            }
            // tslint:disable-next-line:max-line-length
            this.pageContainer.style.height = this.getPageTop(this.pageSize.length - 1) + this.getPageHeight(this.pageSize.length - 1) + 'px';
            this.pageContainer.style.position = 'relative';
            if (this.pageLimit === 100) {
                let pageDiv = this.getElement('_pageDiv_' + this.pageLimit);
                if (pageDiv === null && this.pageLimit < this.pageCount) {
                    Promise.all([this.renderPagesVirtually()]);
                }
            }
        }
    }
    renderElementsVirtualScroll(pageNumber) {
        let pageValue = pageNumber + 1;
        if (pageValue > this.pageCount) {
            pageValue = this.pageCount;
        }
        for (let i = pageNumber - 1; i <= pageValue; i++) {
            if (i !== -1) {
                this.renderPageElement(i);
            }
        }
        let lowerPageValue = pageNumber - 3;
        if (lowerPageValue < 0) {
            lowerPageValue = 0;
        }
        for (let i = pageNumber - 1; i >= lowerPageValue; i--) {
            if (i !== -1) {
                this.renderPageElement(i);
            }
        }
        for (let j = 0; j < this.pageCount; j++) {
            if (!((lowerPageValue <= j) && (j <= pageValue))) {
                let pageDiv = this.getElement('_pageDiv_' + j);
                let pageCanvas = this.getElement('_pageCanvas_' + j);
                let textLayer = this.getElement('_textLayer_' + j);
                if (pageCanvas) {
                    pageCanvas.parentNode.removeChild(pageCanvas);
                    if (textLayer) {
                        if (this.pdfViewer.textSelectionModule && textLayer.childNodes.length !== 0 && !this.isTextSelectionDisabled) {
                            this.pdfViewer.textSelectionModule.maintainSelectionOnScroll(j, true);
                        }
                        textLayer.parentNode.removeChild(textLayer);
                    }
                    let indexInArray = this.renderedPagesList.indexOf(j);
                    if (indexInArray !== -1) {
                        this.renderedPagesList.splice(indexInArray, 1);
                    }
                }
                if (pageDiv) {
                    pageDiv.parentNode.removeChild(pageDiv);
                    let indexInArray = this.renderedPagesList.indexOf(j);
                    if (indexInArray !== -1) {
                        this.renderedPagesList.splice(indexInArray, 1);
                    }
                }
            }
        }
    }
    renderPageElement(i) {
        let pageDiv = this.getElement('_pageDiv_' + i);
        let canvas = this.getElement('_pageCanvas_' + i);
        if (canvas == null && pageDiv == null && i < this.pageSize.length) {
            // tslint:disable-next-line
            this.renderPageContainer(i, this.getPageWidth(i), this.getPageHeight(i), this.getPageTop(i));
        }
    }
    renderPagesVirtually() {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line
            let proxy = this;
            setTimeout(() => { this.initiateRenderPagesVirtually(proxy); }, 500);
        });
    }
    // tslint:disable-next-line
    initiateRenderPagesVirtually(proxy) {
        let jsonObject = { hashId: proxy.hashId, isCompletePageSizeNotReceived: true };
        let request = new XMLHttpRequest();
        request.open('POST', proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.load);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.responseType = 'json';
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        request.onreadystatechange = (event) => {
            if (request.readyState === 4 && request.status === 200) {
                // tslint:disable-next-line
                let data = event.currentTarget.response;
                if (typeof data !== 'object') {
                    data = JSON.parse(data);
                }
                if (data) {
                    // tslint:disable-next-line
                    let pageValues = data;
                    let topValue = proxy.pageSize[proxy.pageLimit - 1].top;
                    for (let i = proxy.pageLimit; i < proxy.pageCount; i++) {
                        let pageSize = pageValues.pageSizes[i].split(',');
                        if (proxy.pageSize[i - 1] !== null && i !== 0) {
                            let previousPageHeight = proxy.pageSize[i - 1].height;
                            topValue = this.pageGap + parseFloat(previousPageHeight) + topValue;
                        }
                        let size = { width: parseFloat(pageSize[0]), height: parseFloat(pageSize[1]), top: topValue };
                        this.pageSize.push(size);
                    }
                    // tslint:disable-next-line:max-line-length
                    this.pageContainer.style.height = this.getPageTop(this.pageSize.length - 1) + this.getPageHeight(this.pageSize.length - 1) + 'px';
                }
            }
            else if (request.readyState === 4 && request.status === 400) {
                // error
                this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText); // jshint ignore:line
            }
        };
        // tslint:disable-next-line
        request.onerror = (event) => {
            this.openNotificationPopup();
            this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
        };
    }
    // tslint:disable-next-line
    renderPage(data, pageIndex) {
        if (data) {
            let pageWidth = this.getPageWidth(pageIndex);
            let pageHeight = this.getPageHeight(pageIndex);
            // tslint:disable-next-line:max-line-length
            let canvas = this.getElement('_pageCanvas_' + pageIndex);
            let pageDiv = this.getElement('_pageDiv_' + pageIndex);
            if (pageDiv) {
                pageDiv.style.width = pageWidth + 'px';
                pageDiv.style.height = pageHeight + 'px';
                pageDiv.style.top = this.getPageTop(pageIndex) + 'px';
                pageDiv.style.left = this.updateLeftPosition(pageIndex) + 'px';
            }
            if (canvas) {
                canvas.style.width = pageWidth + 'px';
                canvas.style.height = pageHeight + 'px';
                let context = canvas.getContext('2d');
                // tslint:disable-next-line
                let imageData = data['image'];
                // tslint:disable-next-line
                let matrix = data['transformationMatrix'];
                if (imageData) {
                    let image = new Image();
                    image.onload = () => {
                        // tslint:disable-next-line
                        if (parseInt((pageWidth * 1.5).toString()) === image.width) {
                            if (!isNaN(parseFloat(canvas.style.width))) {
                                canvas.style.width = pageWidth + 'px';
                                canvas.style.height = pageHeight + 'px';
                                canvas.height = pageHeight * 2;
                                canvas.width = pageWidth * 2;
                            }
                            // tslint:disable-next-line
                            context.setTransform(matrix.Elements[0], matrix.Elements[1], matrix.Elements[2], matrix.Elements[3], matrix.Elements[4], matrix.Elements[5]);
                            context.drawImage(image, 0, 0, canvas.width, canvas.height);
                            this.showPageLoadingIndicator(pageIndex, false);
                            if (pageIndex === 0 && this.isDocumentLoaded) {
                                this.pdfViewer.fireDocumentLoad();
                                this.isDocumentLoaded = false;
                            }
                            if (this.pdfViewer.magnificationModule) {
                                this.pdfViewer.magnificationModule.rerenderCountIncrement();
                            }
                        }
                    };
                    image.src = imageData;
                    if (this.pdfViewer.magnificationModule) {
                        this.pdfViewer.magnificationModule.pushImageObjects(image);
                    }
                }
                let aElement = pageDiv.getElementsByTagName('a');
                if (aElement.length !== 0) {
                    for (let index = aElement.length - 1; index >= 0; index--) {
                        aElement[index].parentNode.removeChild(aElement[index]);
                    }
                }
                if (this.pdfViewer.enableHyperlink && this.pdfViewer.linkAnnotationModule) {
                    this.pdfViewer.linkAnnotationModule.renderHyperlinkContent(data, pageIndex);
                }
                this.renderTextContent(data, pageIndex);
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                    this.pdfViewer.textSelectionModule.applySelectionRangeOnScroll(pageIndex);
                }
                if (this.pdfViewer.textSearchModule) {
                    if (this.pdfViewer.textSearchModule.isTextSearch) {
                        this.pdfViewer.textSearchModule.highlightOtherOccurrences(pageIndex);
                    }
                }
            }
        }
    }
    // tslint:disable-next-line
    renderTextContent(data, pageIndex) {
        // tslint:disable-next-line
        let texts = data['textContent'];
        // tslint:disable-next-line
        let bounds = data['textBounds'];
        let textLayer = this.getElement('_textLayer_' + pageIndex);
        if (textLayer) {
            if (textLayer.childNodes.length === 0) {
                this.textLayer.renderTextContents(pageIndex, texts, bounds);
            }
            else {
                this.textLayer.resizeTextContents(pageIndex, texts, bounds);
            }
        }
    }
    renderPageContainer(pageNumber, pageWidth, pageHeight, topValue) {
        // tslint:disable-next-line:max-line-length
        let pageDiv = createElement('div', { id: this.pdfViewer.element.id + '_pageDiv_' + pageNumber, className: 'e-pv-page-div' });
        pageDiv.style.width = pageWidth + 'px';
        pageDiv.style.height = pageHeight + 'px';
        pageDiv.style.left = this.updateLeftPosition(pageNumber) + 'px';
        pageDiv.style.top = topValue + 'px';
        this.pageContainer.appendChild(pageDiv);
        this.pageContainer.style.width = this.viewerContainer.clientWidth + 'px';
        this.createWaitingPopup(pageNumber);
        this.orderPageDivElements(pageDiv, pageNumber);
        this.renderPageCanvas(pageDiv, pageWidth, pageHeight, pageNumber);
    }
    orderPageDivElements(pageDiv, pageIndex) {
        let nextElement = this.getElement('_pageDiv_' + (pageIndex + 1));
        if (nextElement) {
            this.pageContainer.insertBefore(pageDiv, nextElement);
        }
        else {
            this.pageContainer.appendChild(pageDiv);
        }
    }
    /**
     * @private
     */
    renderPageCanvas(pageDiv, pageWidth, pageHeight, pageNumber) {
        // tslint:disable-next-line:max-line-length
        let pageCanvas = createElement('canvas', { id: this.pdfViewer.element.id + '_pageCanvas_' + pageNumber, className: 'e-pv-page-canvas' });
        pageCanvas.width = pageWidth;
        pageCanvas.height = pageHeight;
        pageDiv.appendChild(pageCanvas);
        this.textLayer.addTextLayer(pageNumber, pageWidth, pageHeight, pageDiv);
        return pageCanvas;
    }
    /**
     * @private
     */
    updateLeftPosition(pageIndex) {
        let leftPosition;
        // tslint:disable-next-line:max-line-length
        leftPosition = (this.viewerContainer.getBoundingClientRect().width - this.getPageWidth(pageIndex)) / 2;
        // tslint:disable-next-line:max-line-length
        if (leftPosition < 0 || (this.pdfViewer.magnificationModule ? ((this.pdfViewer.magnificationModule.isAutoZoom && this.getZoomFactor() < 1) || this.pdfViewer.magnificationModule.fitType === 'fitToWidth') : false)) {
            leftPosition = this.pageLeft;
        }
        return leftPosition;
    }
    /**
     * @private
     */
    applyLeftPosition(pageIndex) {
        let leftPosition;
        if (this.pageSize[pageIndex]) {
            // tslint:disable-next-line:max-line-length
            leftPosition = (this.viewerContainer.getBoundingClientRect().width - this.pageSize[pageIndex].width * this.getZoomFactor()) / 2;
            // tslint:disable-next-line:max-line-length
            if (leftPosition < 0 || (this.pdfViewer.magnificationModule ? ((this.pdfViewer.magnificationModule.isAutoZoom && this.getZoomFactor() < 1) || this.pdfViewer.magnificationModule.fitType === 'fitToWidth') : false)) {
                leftPosition = this.pageLeft;
            }
            // tslint:disable-next-line:max-line-length
            let pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            if (pageDiv) {
                pageDiv.style.left = leftPosition + 'px';
            }
        }
    }
    updatePageHeight(viewerHeight, toolbarHeight) {
        return ((viewerHeight - toolbarHeight) / viewerHeight) * 100 + '%';
    }
    initiatePageViewScrollChanged() {
        if ((this.scrollPosition * this.getZoomFactor()) !== this.viewerContainer.scrollTop) {
            this.scrollPosition = this.viewerContainer.scrollTop;
            this.pageViewScrollChanged(this.currentPageNumber);
        }
    }
    renderCountIncrement() {
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.renderCountIncrement();
        }
    }
    /**
     * @private
     */
    pageViewScrollChanged(currentPageNumber) {
        this.reRenderedCount = 0;
        let currentPageIndex = currentPageNumber - 1;
        if (currentPageNumber !== this.previousPage && currentPageNumber <= this.pageCount) {
            if (this.renderedPagesList.indexOf(currentPageIndex) === -1 && !this.getMagnified()) {
                this.createRequestForRender(currentPageIndex);
                this.renderCountIncrement();
            }
        }
        if (!(this.getMagnified() || this.getPagesPinchZoomed())) {
            let previous = currentPageIndex - 1;
            let canvas = this.getElement('_pageCanvas_' + previous);
            if (canvas !== null) {
                if (this.renderedPagesList.indexOf(previous) === -1 && !this.getMagnified()) {
                    this.createRequestForRender(previous);
                    this.renderCountIncrement();
                }
            }
            let next = currentPageIndex + 1;
            if (next < this.pageCount) {
                if (this.renderedPagesList.indexOf(next) === -1 && !this.getMagnified()) {
                    this.createRequestForRender(next);
                    let pageHeight = this.getPageHeight(next);
                    this.renderCountIncrement();
                    while (this.viewerContainer.clientHeight > pageHeight) {
                        next = next + 1;
                        if (next < this.pageCount) {
                            this.renderPageElement(next);
                            this.createRequestForRender(next);
                            pageHeight += this.getPageHeight(next);
                            this.renderCountIncrement();
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }
    }
    downloadDocument(blobUrl) {
        let anchorElement = createElement('a');
        if (anchorElement.click) {
            anchorElement.href = blobUrl;
            anchorElement.target = '_parent';
            if ('download' in anchorElement) {
                anchorElement.download = this.pdfViewer.fileName;
            }
            (document.body || document.documentElement).appendChild(anchorElement);
            anchorElement.click();
            anchorElement.parentNode.removeChild(anchorElement);
        }
        else {
            if (window.top === window &&
                blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
                let padCharacter = blobUrl.indexOf('?') === -1 ? '?' : '&';
                blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
            }
            window.open(blobUrl, '_parent');
        }
    }
    createRequestForDownload() {
        let jsonObject;
        jsonObject = { hashId: this.hashId };
        let request = new XMLHttpRequest();
        request.open('POST', this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.download);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); // jshint ignore:line
        request.responseType = 'text';
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        request.onreadystatechange = (event) => {
            if (request.readyState === 4 && request.status === 200) { // jshint ignore:line
                // tslint:disable-next-line
                let data = event.currentTarget.response;
                // tslint:disable-next-line:max-line-length
                if (typeof data === 'object') {
                    data = JSON.parse(data);
                }
                if (data) {
                    let blobUrl = this.createBlobUrl(data.split('base64,')[1], 'application/pdf');
                    this.downloadDocument(blobUrl);
                }
            }
            else if (request.readyState === 4 && request.status === 400) {
                // error
                this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
            }
        };
        // tslint:disable-next-line
        request.onerror = (event) => {
            this.openNotificationPopup();
            this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
        };
    }
    createRequestForRender(pageIndex) {
        let canvas = this.getElement('_pageCanvas_' + pageIndex);
        let oldCanvas = this.getElement('_oldCanvas_' + pageIndex);
        if (!this.getPagesZoomed()) {
            this.showPageLoadingIndicator(pageIndex, true);
        }
        else {
            this.showPageLoadingIndicator(pageIndex, false);
        }
        if (canvas) {
            if (!isNaN(parseFloat(canvas.style.width)) || oldCanvas) {
                this.showPageLoadingIndicator(pageIndex, false);
            }
            // tslint:disable-next-line
            let data = this.getStoredData(pageIndex);
            if (data) {
                this.renderPage(data, pageIndex);
            }
            else {
                let noTileX = 1;
                let noTileY = 1;
                for (let x = 0; x < noTileX; x++) {
                    for (let y = 0; y < noTileY; y++) {
                        let jsonObject;
                        // tslint:disable-next-line:max-line-length
                        jsonObject = { xCoordinate: x, yCoordinate: y, pageNumber: pageIndex, documentId: this.documentId, hashId: this.hashId, zoomFactor: this.getZoomFactor() };
                        let request = new XMLHttpRequest();
                        request.open('POST', this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderPages);
                        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                        request.responseType = 'json';
                        request.send(JSON.stringify(jsonObject));
                        // tslint:disable-next-line
                        request.onreadystatechange = (event) => {
                            let proxy = this;
                            if (request.readyState === 4 && request.status === 200) {
                                // tslint:disable-next-line
                                let data = event.currentTarget.response;
                                // tslint:disable-next-line:max-line-length
                                if (typeof data !== 'object') {
                                    data = JSON.parse(data);
                                }
                                if (data) {
                                    if (data.image) {
                                        proxy.storeWinData(data, pageIndex);
                                        proxy.renderPage(data, pageIndex);
                                    }
                                }
                            }
                            else if (request.readyState === 4 && request.status === 400) {
                                // error
                                this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
                            }
                        };
                        // tslint:disable-next-line
                        request.onerror = (event) => {
                            this.openNotificationPopup();
                            this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
                        };
                    }
                }
            }
            this.renderedPagesList.push(pageIndex);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    getStoredData(pageIndex) {
        // tslint:disable-next-line
        let storedData = this.getWindowSessionStorage(pageIndex) ? this.getWindowSessionStorage(pageIndex) : this.getPinchZoomPage(pageIndex);
        // tslint:disable-next-line
        let data = null;
        if (storedData) {
            // tslint:disable-next-line
            data = storedData;
            if (!this.isPinchZoomStorage) {
                data = JSON.parse(storedData);
            }
            this.isPinchZoomStorage = false;
        }
        return data;
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    storeWinData(data, pageIndex) {
        // tslint:disable-next-line
        let blobUrl = this.createBlobUrl(data['image'].split('base64,')[1], 'image/png');
        // tslint:disable-next-line
        let storeObject = {
            // tslint:disable-next-line
            image: blobUrl, transformationMatrix: data['transformationMatrix'], hyperlinks: data['hyperlinks'], hyperlinkBounds: data['hyperlinkBounds'], linkAnnotation: data['linkAnnotation'], linkPage: data['linkPage'], annotationLocation: data['annotationLocation'],
            // tslint:disable-next-line
            textContent: data['textContent'], textBounds: data['textBounds'], pageText: data['pageText']
        };
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.magnificationModule ? this.pdfViewer.magnificationModule.checkZoomFactor() : true) {
            this.manageSessionStorage(pageIndex, storeObject);
        }
        else {
            this.pinchZoomStorage.push({ index: pageIndex, pinchZoomStorage: storeObject });
        }
    }
    getPinchZoomPage(pageIndex) {
        // tslint:disable-next-line
        for (let key in this.pinchZoomStorage) {
            if (this.pinchZoomStorage.hasOwnProperty(key)) {
                if (this.pinchZoomStorage[key].index === pageIndex) {
                    this.isPinchZoomStorage = true;
                    return this.pinchZoomStorage[key].pinchZoomStorage;
                }
            }
        }
        return null;
    }
    getWindowSessionStorage(pageIndex) {
        return window.sessionStorage.getItem(this.documentId + '_' + pageIndex + '_' + this.getZoomFactor());
    }
    // tslint:disable-next-line
    manageSessionStorage(pageIndex, storeObject) {
        if (this.pageCount > this.sessionLimit && window.sessionStorage.length > this.sessionLimit) {
            let lowerPageValue = this.currentPageNumber - this.sessionLimit;
            if (lowerPageValue < 0) {
                lowerPageValue = 0;
            }
            let higherPageValue = this.currentPageNumber + this.sessionLimit;
            if (higherPageValue > this.pageCount) {
                higherPageValue = this.pageCount;
            }
            for (let i = 0; i <= this.pageCount; i++) {
                if (!((lowerPageValue <= i) && (i < higherPageValue))) {
                    window.sessionStorage.removeItem(this.documentId + '_' + i + '_' + this.getZoomFactor());
                }
            }
        }
        window.sessionStorage.setItem(this.documentId + '_' + pageIndex + '_' + this.getZoomFactor(), JSON.stringify(storeObject));
        this.sessionStorage.push(this.documentId + '_' + pageIndex + '_' + this.getZoomFactor());
    }
    createBlobUrl(base64String, contentType) {
        let sliceSize = 512;
        let byteCharacters = atob(base64String);
        // tslint:disable-next-line
        let byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);
            // tslint:disable-next-line
            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            // tslint:disable-next-line
            let byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        let blob = new Blob(byteArrays, { type: contentType });
        return URL.createObjectURL(blob);
    }
    getRandomNumber() {
        // tslint:disable-next-line
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line
            let random = Math.random() * 16 | 0;
            return random.toString(16);
        });
    }
    createGUID() {
        // tslint:disable-next-line:max-line-length
        return 'Sync_PdfViewer_' + this.getRandomNumber();
    }
    isClickedOnScrollBar(event) {
        let isScrollBar = false;
        this.setScrollDownValue(event.type, false);
        // tslint:disable-next-line:max-line-length
        if ((this.viewerContainer.clientWidth + this.viewerContainer.offsetLeft) < event.clientX && event.clientX < (this.viewerContainer.offsetWidth + this.viewerContainer.offsetLeft)) {
            isScrollBar = true;
            this.setScrollDownValue(event.type, true);
        }
        // tslint:disable-next-line:max-line-length
        if ((this.viewerContainer.clientHeight + this.viewerContainer.offsetTop) < event.clientY && event.clientY < (this.viewerContainer.offsetHeight + this.viewerContainer.offsetTop)) {
            isScrollBar = true;
            this.setScrollDownValue(event.type, true);
        }
        return isScrollBar;
    }
    setScrollDownValue(eventType, boolValue) {
        if (eventType === 'mousedown') {
            this.isScrollbarMouseDown = boolValue;
        }
    }
    /**
     * @private
     */
    disableTextSelectionMode() {
        this.isTextSelectionDisabled = true;
        this.viewerContainer.classList.remove('e-enable-text-selection');
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        this.viewerContainer.classList.add('e-disable-text-selection');
        this.viewerContainer.addEventListener('selectstart', () => { return false; });
    }
    /**
     * @private
     */
    getElement(idString) {
        return document.getElementById(this.pdfViewer.element.id + idString);
    }
    /**
     * @private
     */
    getPageWidth(pageIndex) {
        return this.pageSize[pageIndex].width * this.getZoomFactor();
    }
    /**
     * @private
     */
    getPageHeight(pageIndex) {
        return this.pageSize[pageIndex].height * this.getZoomFactor();
    }
    /**
     * @private
     */
    getPageTop(pageIndex) {
        return this.pageSize[pageIndex].top * this.getZoomFactor();
    }
}

/**
 * TextLayer module is used to handle the text content on the control.
 * @hidden
 */
class TextLayer {
    /**
     * @private
     */
    constructor(pdfViewer, pdfViewerBase) {
        // tslint:disable-next-line
        this.textBoundsArray = [];
        this.closeNotification = () => {
            this.notifyDialog.hide();
        };
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    addTextLayer(pageNumber, pageWidth, pageHeight, pageDiv) {
        let textDiv = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        if (!textDiv) {
            // tslint:disable-next-line:max-line-length
            let textLayer = createElement('div', { id: this.pdfViewer.element.id + '_textLayer_' + pageNumber, className: 'e-pv-text-layer' });
            textLayer.style.width = pageWidth + 'px';
            textLayer.style.height = pageHeight + 'px';
            pageDiv.appendChild(textLayer);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    renderTextContents(pageNumber, textContents, textBounds) {
        let textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        let canvasElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageNumber);
        if (canvasElement && textLayer.childNodes.length === 0) {
            for (let i = 0; i < textContents.length; i++) {
                // tslint:disable-next-line
                let bounds = textBounds[i];
                // tslint:disable-next-line:max-line-length
                let textDiv = createElement('div', { id: this.pdfViewer.element.id + '_text_' + pageNumber + '_' + i, className: 'e-pv-text' });
                let textContent = textContents[i];
                textContent = textContent.replace(/</g, '&lt;');
                textContent = textContent.replace(/>/g, '&gt;');
                textDiv.innerHTML = textContent.replace(/&nbsp;/g, ' ');
                // tslint:disable-next-line
                let newLine = textContents[i].replace(/  +/g, ' ');
                if (newLine !== ' ') {
                    textDiv.style.whiteSpace = 'pre';
                }
                this.setStyleToTextDiv(textDiv, bounds.X, bounds.Y, bounds.Bottom, bounds.Width, bounds.Height, bounds);
                this.setTextElementProperties(textDiv);
                let context = canvasElement.getContext('2d');
                context.font = textDiv.style.fontSize + ' ' + textDiv.style.fontFamily;
                let contextWidth = context.measureText(textContents[i].replace(/(\r\n|\n|\r)/gm, '')).width;
                let scale = bounds.Width * this.pdfViewerBase.getZoomFactor() / contextWidth;
                textDiv.style.transform = 'scaleX(' + scale + ')';
                textLayer.appendChild(textDiv);
                this.resizeExcessDiv(textLayer, textDiv);
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewer.textSelectionModule && this.pdfViewer.enableTextSelection && !this.pdfViewerBase.isTextSelectionDisabled) {
                    textDiv.classList.add('e-pv-cursor');
                }
            }
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    resizeTextContents(pageNumber, textContents, textBounds) {
        let textLayer = this.pdfViewerBase.getElement('_textLayer_' + pageNumber);
        let canvasElement = this.pdfViewerBase.getElement('_pageCanvas_' + pageNumber);
        if (canvasElement) {
            for (let i = 0; i < textLayer.childNodes.length; i++) {
                // tslint:disable-next-line
                let bounds;
                let textDiv = this.pdfViewerBase.getElement('_text_' + pageNumber + '_' + i);
                if (textBounds) {
                    bounds = textBounds[i];
                    this.setStyleToTextDiv(textDiv, bounds.X, bounds.Y, bounds.Bottom, bounds.Width, bounds.Height, textBounds);
                }
                this.setTextElementProperties(textDiv);
                let context = canvasElement.getContext('2d');
                context.font = textDiv.style.fontSize + ' ' + textDiv.style.fontFamily;
                let contextWidth;
                if (textContents) {
                    contextWidth = context.measureText(textContents[i].replace(/(\r\n|\n|\r)/gm, '')).width;
                }
                else {
                    contextWidth = context.measureText(textDiv.textContent.replace(/(\r\n|\n|\r)/gm, '')).width;
                }
                let scale = bounds.Width * this.pdfViewerBase.getZoomFactor() / contextWidth;
                textDiv.style.transform = 'scaleX(' + scale + ')';
                this.resizeExcessDiv(textLayer, textDiv);
            }
        }
        else {
            textLayer.parentElement.removeChild(textLayer);
        }
    }
    setTextElementProperties(textDiv) {
        textDiv.style.fontFamily = 'sans-serif';
        textDiv.style.transformOrigin = '0%';
    }
    /**
     * @private
     */
    resizeTextContentsOnZoom(pageNumber) {
        // tslint:disable-next-line:max-line-length
        let renderObject = window.sessionStorage.getItem(this.pdfViewerBase.getDocumentId() + '_' + pageNumber + '_' + this.getPreviousZoomFactor());
        // tslint:disable-next-line
        let textBounds = [];
        let textContents = [];
        if (renderObject) {
            // tslint:disable-next-line
            let data = JSON.parse(renderObject);
            // tslint:disable-next-line
            textBounds = data['textBounds'];
            // tslint:disable-next-line
            textContents = data['textContent'];
        }
        if (textBounds.length !== 0) {
            this.textBoundsArray.push({ pageNumber: pageNumber, textBounds: textBounds });
            this.resizeTextContents(pageNumber, textContents, textBounds);
        }
        else {
            // tslint:disable-next-line
            let textElements = this.textBoundsArray.filter(obj => {
                return obj.pageNumber === pageNumber;
            });
            if (textElements) {
                if (textElements.length !== 0) {
                    // tslint:disable-next-line
                    textBounds = textElements[0]['textBounds'];
                    this.resizeTextContents(pageNumber, null, textBounds);
                }
            }
        }
    }
    resizeExcessDiv(textLayer, textDiv) {
        let textLayerPosition = textLayer.getBoundingClientRect();
        let textDivPosition = textDiv.getBoundingClientRect();
        // tslint:disable-next-line:max-line-length
        if ((textDivPosition.width + textDivPosition.left) >= (textLayerPosition.width + textLayerPosition.left) || (textDivPosition.width > textLayerPosition.width)) {
            // 'auto' width is set to reset the size of the div to its contents.
            textDiv.style.width = 'auto';
            // Client width gets reset by 'auto' width property which has the width of the content.
            textDiv.style.width = textDiv.clientWidth + 'px';
        }
    }
    /**
     * @private
     */
    clearTextLayers() {
        let lowerPageValue = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        let higherPageValue = this.pdfViewerBase.currentPageNumber + 1;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        let textLayers = document.querySelectorAll('div[id*="_textLayer_"]');
        for (let i = 0; i < textLayers.length; i++) {
            textLayers[i].style.display = 'block';
            if (this.pdfViewerBase.getMagnified() && (this.getTextSelectionStatus() || this.getTextSearchStatus())) {
                // tslint:disable-next-line:radix
                let pageNumber = parseInt(textLayers[i].id.split('_textLayer_')[1]);
                if (!(((lowerPageValue + 1) <= pageNumber) && (pageNumber <= (higherPageValue - 1)))) {
                    textLayers[i].remove();
                }
            }
            else if (this.pdfViewerBase.getPinchZoomed()) {
                textLayers[i].remove();
            }
            else {
                textLayers[i].remove();
            }
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    convertToSpan(pageNumber, divId, fromOffset, toOffset, textString, className) {
        let textDiv = this.pdfViewerBase.getElement('_text_' + pageNumber + '_' + divId);
        let textContent = textString.substring(fromOffset, toOffset);
        let node = document.createTextNode(textContent);
        if (className) {
            let spanElement = createElement('span');
            spanElement.className = className + ' e-pv-text';
            spanElement.appendChild(node);
            textDiv.appendChild(spanElement);
        }
        else {
            textDiv.appendChild(node);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    applySpanForSelection(startPage, endPage, anchorOffsetDiv, focusOffsetDiv, anchorOffset, focusOffset) {
        if (this.pdfViewer.textSelectionModule) {
            for (let i = startPage; i <= endPage; i++) {
                let startId;
                let endId;
                // tslint:disable-next-line
                let textDivs = this.pdfViewerBase.getElement('_textLayer_' + i).childNodes;
                if (i === startPage) {
                    startId = anchorOffsetDiv;
                    endId = textDivs.length - 1;
                }
                else if (i === endPage) {
                    startId = 0;
                    endId = focusOffsetDiv;
                }
                else {
                    startId = 0;
                    endId = textDivs.length - 1;
                }
                if (startPage === endPage) {
                    startId = anchorOffsetDiv;
                    endId = focusOffsetDiv;
                }
                for (let j = startId; j <= endId; j++) {
                    let textDiv = this.pdfViewerBase.getElement('_text_' + i + '_' + j);
                    let initId;
                    let lastId;
                    let length;
                    length = textDiv.textContent.length;
                    let textContent = textDiv.textContent;
                    textDiv.textContent = '';
                    if (j === startId) {
                        if (i === startPage) {
                            initId = anchorOffset;
                        }
                        else {
                            initId = 0;
                        }
                        lastId = length;
                        this.convertToSpan(i, j, 0, initId, textContent, null);
                    }
                    else if (j === endId && i === endPage) {
                        initId = 0;
                        lastId = focusOffset;
                    }
                    else {
                        initId = 0;
                        lastId = length;
                    }
                    if (startId === endId) {
                        initId = anchorOffset;
                        lastId = focusOffset;
                    }
                    this.convertToSpan(i, j, initId, lastId, textContent, 'e-pv-maintaincontent');
                    if (j === endId && i === endPage) {
                        this.convertToSpan(i, j, lastId, textContent.length, textContent, null);
                    }
                }
            }
        }
    }
    /**
     * @private
     */
    clearDivSelection() {
        let textLayers = document.querySelectorAll('div[id*="_textLayer_"]');
        for (let i = 0; i < textLayers.length; i++) {
            let childNodes = textLayers[i].childNodes;
            for (let j = 0; j < childNodes.length; j++) {
                let textDiv = childNodes[j];
                let textContent = textDiv.textContent;
                // tslint:disable-next-line:max-line-length
                if (textDiv.childNodes.length > 1 || textDiv.childNodes.length === 1 && (textDiv.childNodes[0].tagName === 'SPAN')) {
                    textDiv.textContent = '';
                    textDiv.textContent = textContent;
                }
            }
        }
    }
    // tslint:disable-next-line
    setStyleToTextDiv(textDiv, left, top, bottom, width, height, textBounds) {
        textDiv.style.left = left * this.pdfViewerBase.getZoomFactor() + 'px';
        textDiv.style.top = top * this.pdfViewerBase.getZoomFactor() + 'px';
        textDiv.style.bottom = bottom * this.pdfViewerBase.getZoomFactor() + 'px';
        textDiv.style.width = width * this.pdfViewerBase.getZoomFactor() + 'px';
        let textHeight = height * this.pdfViewerBase.getZoomFactor();
        textDiv.style.height = textHeight + 'px';
        if (textHeight > 11 && textBounds) {
            textDiv.style.top = (parseFloat(textDiv.style.top) + 2) + 'px';
            // tslint:disable-next-line:radix
            textDiv.style.fontSize = (parseInt(height.toString()) * this.pdfViewerBase.getZoomFactor() - 2.6) + 'px';
        }
        else {
            textDiv.style.fontSize = height * this.pdfViewerBase.getZoomFactor() + 'px';
        }
    }
    getTextSelectionStatus() {
        if (this.pdfViewer.textSelectionModule) {
            return this.pdfViewer.textSelectionModule.isTextSelection;
        }
        else {
            return false;
        }
    }
    /**
     * @private
     */
    modifyTextCursor(isAdd) {
        let textLayerList = document.querySelectorAll('div[id*="_textLayer_"]');
        for (let i = 0; i < textLayerList.length; i++) {
            let childNodes = textLayerList[i].childNodes;
            for (let j = 0; j < childNodes.length; j++) {
                let textElement = childNodes[j];
                if (isAdd) {
                    textElement.classList.add('e-pv-cursor');
                }
                else {
                    textElement.classList.remove('e-pv-cursor');
                }
            }
        }
    }
    getPreviousZoomFactor() {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.previousZoomFactor;
        }
        else {
            return 1;
        }
    }
    /**
     * @private
     */
    getTextSearchStatus() {
        if (this.pdfViewer.textSearchModule) {
            return this.pdfViewer.textSearchModule.isTextSearch;
        }
        else {
            return false;
        }
    }
    /**
     * @private
     */
    createNotificationPopup(text) {
        // tslint:disable-next-line:max-line-length
        let popupElement = createElement('div', { id: this.pdfViewer.element.id + '_notify', className: 'e-pv-notification-popup' });
        this.pdfViewerBase.viewerContainer.appendChild(popupElement);
        this.notifyDialog = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true, header: this.pdfViewer.localeObj.getConstant('PdfViewer'),
            buttons: [{
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true },
                    click: this.closeNotification.bind(this)
                }],
            content: '<div class="e-pv-notification-popup-content">' + text + '</div>', target: this.pdfViewer.element,
            beforeClose: () => {
                this.notifyDialog.destroy();
                this.pdfViewer.element.removeChild(popupElement);
                if (this.pdfViewer.textSearchModule) {
                    this.pdfViewer.textSearch.isMessagePopupOpened = false;
                }
            }
        });
        this.notifyDialog.appendTo(popupElement);
    }
}

/**
 * ContextMenu module is used to handle the context menus used in the control.
 * @hidden
 */
class ContextMenu$1 {
    /**
     * @private
     */
    constructor(pdfViewer, pdfViewerBase) {
        this.copyContextMenu = [];
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
        this.copyContextMenu = [{ text: this.pdfViewer.localeObj.getConstant('Copy') }];
    }
    /**
     * @private
     */
    createContextMenu() {
        this.contextMenuElement = createElement('ul', { id: this.pdfViewer.element.id + '_context_menu' });
        this.pdfViewer.element.appendChild(this.contextMenuElement);
        this.contextMenuObj = new ContextMenu({
            target: '#' + this.pdfViewerBase.viewerContainer.id, items: this.copyContextMenu,
            beforeOpen: this.contextMenuOnBeforeOpen.bind(this), select: this.onMenuItemSelect.bind(this),
            cssClass: 'e-pv-context-menu'
        });
        this.contextMenuObj.appendTo(this.contextMenuElement);
        if (Browser.isDevice) {
            this.contextMenuObj.animationSettings.effect = 'ZoomIn';
        }
        else {
            this.contextMenuObj.animationSettings.effect = 'SlideDown';
        }
    }
    contextMenuOnBeforeOpen(args) {
        if (this.pdfViewer.textSelectionModule) {
            if (args.event) {
                let isClickWithinSelectionBounds = this.isClickWithinSelectionBounds(args.event);
                // tslint:disable-next-line:max-line-length
                if (isClickWithinSelectionBounds) {
                    if ((!args.event.target.classList.contains('e-pv-maintaincontent') && args.event.target.classList.contains('e-pv-text') || args.event.target.classList.contains('e-pv-text-layer'))) {
                        args.cancel = true;
                    }
                }
                else {
                    args.cancel = true;
                }
            }
        }
        else {
            args.cancel = true;
        }
    }
    // tslint:disable-next-line
    isClickWithinSelectionBounds(event) {
        let isWithin = false;
        let bounds = this.pdfViewer.textSelectionModule.getCurrentSelectionBounds(this.pdfViewerBase.currentPageNumber - 1);
        if (bounds) {
            for (let i = 0; i < bounds.length; i++) {
                let currentBound = bounds[i];
                if (this.getHorizontalValue(currentBound.left) < event.clientX && this.getHorizontalValue(currentBound.right) >
                    event.clientX && this.getVerticalValue(currentBound.top) < event.clientY &&
                    this.getVerticalValue(currentBound.bottom) > event.clientY) {
                    isWithin = true;
                    break;
                }
            }
        }
        return isWithin;
    }
    getHorizontalClientValue(value) {
        let pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        let pageBounds = pageDiv.getBoundingClientRect();
        return (value - pageBounds.left);
    }
    getVerticalClientValue(value) {
        let pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        let pageBounds = pageDiv.getBoundingClientRect();
        return (value - pageBounds.top);
    }
    getHorizontalValue(value) {
        let pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        let pageBounds = pageDiv.getBoundingClientRect();
        return (value * this.pdfViewerBase.getZoomFactor()) + pageBounds.left;
    }
    getVerticalValue(value) {
        let pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        let pageBounds = pageDiv.getBoundingClientRect();
        return (value * this.pdfViewerBase.getZoomFactor()) + pageBounds.top;
    }
    onMenuItemSelect(args) {
        switch (args.item.text) {
            case 'Copy':
                if (this.pdfViewer.textSelectionModule) {
                    this.pdfViewer.textSelectionModule.copyText();
                    this.contextMenuObj.close();
                }
                break;
            default:
                break;
        }
    }
}

/**
 * Magnification module
 */
class Magnification {
    /**
     * @private
     */
    constructor(pdfViewer, viewerBase) {
        /**
         * @private
         */
        this.zoomFactor = 1;
        /**
         * @private
         */
        this.previousZoomFactor = 1;
        this.scrollWidth = 25;
        this.zoomPercentages = [50, 75, 100, 125, 150, 200, 400];
        this.isNotPredefinedZoom = false;
        this.pinchStep = 0.02;
        this.reRenderPageNumber = 0;
        // tslint:disable-next-line
        this.magnifyPageRerenderTimer = null;
        // tslint:disable-next-line
        this.rerenderOnScrollTimer = null;
        // tslint:disable-next-line
        this.rerenderInterval = null;
        this.touchCenterX = 0;
        this.touchCenterY = 0;
        this.pageRerenderCount = 0;
        this.imageObjects = [];
        this.topValue = 0;
        /**
         * @private
         */
        this.fitType = null;
        /**
         * @private
         */
        this.isPinchZoomed = false;
        /**
         * @private
         */
        this.isPagePinchZoomed = false;
        /**
         * @private
         */
        this.isRerenderCanvasCreated = false;
        /**
         * @private
         */
        this.isMagnified = false;
        /**
         * @private
         */
        this.isPagesZoomed = false;
        /**
         * @private
         */
        this.isPinchScrolled = false;
        /**
         * @private
         */
        this.isAutoZoom = false;
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
        this.zoomLevel = 2;
    }
    /**
     * Zoom the PDF document to the given zoom value
     * @param  {number} zoomValue
     * @returns void
     */
    zoomTo(zoomValue) {
        if (zoomValue < 50) {
            zoomValue = 50;
        }
        else if (zoomValue > 400) {
            zoomValue = 400;
        }
        this.fitType = null;
        this.isNotPredefinedZoom = false;
        if (this.isAutoZoom && this.isInitialLoading) {
            this.pdfViewerBase.onWindowResize();
        }
        else {
            this.isAutoZoom = false;
            this.onZoomChanged(zoomValue);
        }
        this.isInitialLoading = false;
    }
    /**
     * Magnifies the page to the next value in the zoom drop down list.
     * @returns void
     */
    zoomIn() {
        if (this.fitType || this.isNotPredefinedZoom) {
            this.zoomLevel = this.lowerZoomLevel;
            this.fitType = null;
        }
        this.isNotPredefinedZoom = false;
        if (this.zoomLevel >= 6) {
            this.zoomLevel = 6;
        }
        else {
            this.zoomLevel++;
        }
        this.isAutoZoom = false;
        this.onZoomChanged(this.zoomPercentages[this.zoomLevel]);
    }
    /**
     * Magnifies the page to the previous value in the zoom drop down list.
     * @returns void
     */
    zoomOut() {
        if (this.fitType || this.isNotPredefinedZoom) {
            this.zoomLevel = this.higherZoomLevel;
            this.fitType = null;
        }
        this.isNotPredefinedZoom = false;
        if (this.zoomLevel <= 0) {
            this.zoomLevel = 0;
        }
        else {
            this.zoomLevel--;
        }
        this.isAutoZoom = false;
        this.onZoomChanged(this.zoomPercentages[this.zoomLevel]);
    }
    /**
     * Scales the page to fit the page width to the width of the container in the control.
     * @returns void
     */
    fitToWidth() {
        this.isAutoZoom = false;
        let zoomValue = this.calculateFitZoomFactor('fitToWidth');
        this.onZoomChanged(zoomValue);
    }
    /**
     * @private
     */
    fitToAuto() {
        this.isAutoZoom = true;
        let zoomValue = this.calculateFitZoomFactor('fitToWidth');
        this.onZoomChanged(zoomValue);
    }
    /**
     * Scales the page to fit the page in the container in the control.
     * @param  {number} zoomValue
     * @returns void
     */
    fitToPage() {
        let zoomValue = this.calculateFitZoomFactor('fitToPage');
        this.isAutoZoom = false;
        this.onZoomChanged(zoomValue);
        this.pdfViewerBase.viewerContainer.style.overflowY = 'hidden';
        // tslint:disable-next-line:max-line-length
        this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top * this.zoomFactor;
    }
    /**
     * Returns zoom factor for the fit zooms.
     */
    calculateFitZoomFactor(type) {
        let viewerWidth = this.pdfViewerBase.viewerContainer.getBoundingClientRect().width;
        let viewerHeight = this.pdfViewerBase.viewerContainer.getBoundingClientRect().height;
        let highestWidth = 0;
        let highestHeight = 0;
        this.fitType = type;
        if (this.fitType === 'fitToWidth') {
            let pageWidth = 0;
            for (let i = 0; i < this.pdfViewerBase.pageSize.length; i++) {
                pageWidth = this.pdfViewerBase.pageSize[i].width;
                if (pageWidth > highestWidth) {
                    highestWidth = pageWidth;
                }
            }
            let scaleX = ((viewerWidth - this.scrollWidth) / highestWidth);
            if (this.isAutoZoom) {
                this.fitType = null;
                scaleX = Math.min(1, scaleX);
                if (scaleX === 1) {
                    this.zoomLevel = 2;
                }
            }
            return scaleX * 100;
        }
        else {
            let pageHeight = 0;
            for (let i = 0; i < this.pdfViewerBase.pageSize.length; i++) {
                pageHeight = this.pdfViewerBase.pageSize[i].height;
                if (pageHeight > highestHeight) {
                    highestHeight = pageHeight;
                }
            }
            if (this.pdfViewerBase.pageCount === 1) {
                return ((viewerHeight - this.pdfViewerBase.pageSize[0].top) / highestHeight) * 100;
            }
            else {
                return (viewerHeight / highestHeight) * 100;
            }
        }
    }
    /**
     * Performs pinch in operation
     */
    pinchIn() {
        this.fitType = null;
        let temporaryZoomFactor = this.zoomFactor - this.pinchStep;
        if (temporaryZoomFactor < 4 && temporaryZoomFactor > 2) {
            temporaryZoomFactor = this.zoomFactor - this.pinchStep;
        }
        if (temporaryZoomFactor < 0.5) {
            temporaryZoomFactor = 0.5;
        }
        this.isPinchZoomed = true;
        this.onZoomChanged(temporaryZoomFactor * 100);
    }
    /**
     * Performs pinch out operation
     */
    pinchOut() {
        this.fitType = null;
        let temporaryZoomFactor = this.zoomFactor + this.pinchStep;
        if (temporaryZoomFactor > 2) {
            temporaryZoomFactor = temporaryZoomFactor + this.pinchStep;
        }
        if (temporaryZoomFactor > 4) {
            temporaryZoomFactor = 4;
        }
        this.isPinchZoomed = true;
        this.onZoomChanged(temporaryZoomFactor * 100);
    }
    /**
     * returns zoom level for the zoom factor.
     */
    getZoomLevel(zoomFactor) {
        let min = 0;
        let max = this.zoomPercentages.length - 1;
        while ((min <= max) && !(min === 0 && max === 0)) {
            let mid = Math.round((min + max) / 2);
            if (this.zoomPercentages[mid] <= zoomFactor) {
                min = mid + 1;
            }
            else if (this.zoomPercentages[mid] >= zoomFactor) {
                max = mid - 1;
            }
        }
        this.higherZoomLevel = min;
        this.lowerZoomLevel = max;
        return max;
    }
    /**
     * @private
     */
    checkZoomFactor() {
        return this.zoomPercentages.indexOf(this.zoomFactor * 100) > -1;
    }
    /**
     * Executes when the zoom or pinch operation is performed
     */
    onZoomChanged(zoomValue) {
        this.previousZoomFactor = this.zoomFactor;
        this.zoomLevel = this.getZoomLevel(zoomValue);
        this.zoomFactor = this.getZoomFactor(zoomValue);
        this.pdfViewerBase.viewerContainer.style.overflowY = 'auto';
        if (this.pdfViewerBase.pageCount > 0) {
            if (this.previousZoomFactor !== this.zoomFactor) {
                if (!this.isPinchZoomed) {
                    this.magnifyPages();
                }
                else {
                    this.responsivePages();
                }
            }
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.toolbarModule.updateZoomButtons();
            }
            this.pdfViewer.fireZoomChange();
        }
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateZoomPercentage(this.zoomFactor);
        }
    }
    /**
     * @private
     */
    setTouchPoints(clientX, clientY) {
        this.touchCenterX = clientX;
        this.touchCenterY = clientY;
    }
    /**
     * @private
     */
    initiatePinchMove(pointX1, pointY1, pointX2, pointY2) {
        this.isPinchScrolled = false;
        this.isMagnified = false;
        this.reRenderPageNumber = this.pdfViewerBase.currentPageNumber;
        this.touchCenterX = (pointX1 + pointX2) / 2;
        this.touchCenterY = (pointY1 + pointY2) / 2;
        this.zoomOverPages(pointX1, pointY1, pointX2, pointY2);
    }
    magnifyPages() {
        this.clearRerenderTimer();
        if (!this.isPagesZoomed) {
            this.reRenderPageNumber = this.pdfViewerBase.currentPageNumber;
        }
        this.isPagesZoomed = true;
        let scrollValue = this.getMagnifiedValue(this.pdfViewerBase.viewerContainer.scrollTop);
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(false, true);
        }
        this.isMagnified = true;
        this.updatePageLocation();
        this.resizeCanvas(this.reRenderPageNumber);
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.resizeTouchElements();
        }
        if (this.pdfViewerBase.pageSize.length > 0) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.pageContainer.style.height = this.topValue + this.pdfViewerBase.getPageHeight(this.pdfViewerBase.pageSize.length - 1) + 'px';
            // tslint:disable-next-line 
            let proxy = this;
            this.pdfViewerBase.renderedPagesList = [];
            this.pdfViewerBase.pinchZoomStorage = [];
            this.pdfViewerBase.viewerContainer.scrollTop = scrollValue;
            this.magnifyPageRerenderTimer = setTimeout(() => { proxy.rerenderMagnifiedPages(); }, 800);
        }
    }
    updatePageLocation() {
        this.topValue = 0;
        for (let i = 1; i < this.pdfViewerBase.pageSize.length; i++) {
            this.topValue += (this.pdfViewerBase.pageSize[i].height + this.pdfViewerBase.pageGap) * this.zoomFactor;
        }
    }
    clearRerenderTimer() {
        clearTimeout(this.rerenderOnScrollTimer);
        clearTimeout(this.magnifyPageRerenderTimer);
        this.clearIntervalTimer();
        this.isPinchScrolled = false;
    }
    /**
     * @private
     */
    clearIntervalTimer() {
        clearInterval(this.rerenderInterval);
        this.rerenderInterval = null;
        this.clearRendering();
        let oldCanvases = document.querySelectorAll('canvas[id*="oldCanvas"]');
        for (let i = 0; i < oldCanvases.length; i++) {
            // tslint:disable-next-line
            let pageNumber = parseInt(oldCanvases[i].id.split('_oldCanvas_')[1]);
            let pageCanvas = this.pdfViewerBase.getElement('_pageCanvas_' + pageNumber);
            if (pageCanvas) {
                oldCanvases[i].id = pageCanvas.id;
                pageCanvas.parentElement.removeChild(pageCanvas);
            }
            else {
                oldCanvases[i].id = this.pdfViewer.element.id + '_pageCanvas_' + pageNumber;
            }
        }
        this.isRerenderCanvasCreated = false;
    }
    /**
     * @private
     */
    pushImageObjects(image) {
        this.imageObjects.push(image);
    }
    clearRendering() {
        if (this.imageObjects) {
            for (let j = 0; j < this.imageObjects.length; j++) {
                if (this.imageObjects[j]) {
                    this.imageObjects[j].onload = null;
                }
            }
            this.imageObjects = [];
        }
    }
    rerenderMagnifiedPages() {
        this.renderInSeparateThread(this.reRenderPageNumber);
        this.isPagesZoomed = false;
    }
    renderInSeparateThread(pageNumber) {
        this.designNewCanvas(pageNumber);
        this.pageRerenderCount = 0;
        this.pdfViewerBase.renderedPagesList = [];
        this.pdfViewerBase.pinchZoomStorage = [];
        this.isMagnified = false;
        this.pdfViewerBase.pageViewScrollChanged(this.reRenderPageNumber);
        // tslint:disable-next-line
        let proxy = this;
        this.rerenderInterval = setInterval(() => { this.initiateRerender(proxy); }, 1);
    }
    responsivePages() {
        this.isPagesZoomed = true;
        this.clearRerenderTimer();
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        let scrollValue = this.pdfViewerBase.viewerContainer.scrollTop;
        this.isAutoZoom = false;
        this.updatePageLocation();
        // tslint:disable-next-line:max-line-length
        this.pdfViewerBase.pageContainer.style.height = this.topValue + this.pdfViewerBase.pageSize[this.pdfViewerBase.pageSize.length - 1].height * this.zoomFactor + 'px';
        this.resizeCanvas(this.pdfViewerBase.currentPageNumber);
        if (this.isPinchZoomed) {
            let pageIndex = this.pdfViewerBase.currentPageNumber - 1;
            let currentPageCanvas = this.pdfViewerBase.getElement('_pageDiv_' + pageIndex);
            if (currentPageCanvas) {
                let currentPageBounds = currentPageCanvas.getBoundingClientRect();
                // update scroll top for the viewer container based on pinch zoom factor
                let previousPageTop = (currentPageBounds.top) * this.previousZoomFactor;
                let previousY = scrollValue + this.touchCenterY;
                // tslint:disable-next-line:max-line-length
                let currentY = (currentPageBounds.top) * this.zoomFactor + ((previousY - previousPageTop) < 0 ? previousY - previousPageTop : (previousY -
                    // tslint:disable-next-line:max-line-length
                    previousPageTop) * (this.zoomFactor / this.previousZoomFactor));
                this.pdfViewerBase.viewerContainer.scrollTop = currentY - this.touchCenterY;
                // update scroll left for the viewer container based on pinch zoom factor
                let prevValue = (currentPageBounds.width * this.previousZoomFactor) / currentPageBounds.width;
                let scaleCorrectionFactor = this.zoomFactor / prevValue - 1;
                let scrollX = this.touchCenterX - currentPageBounds.left;
                this.pdfViewerBase.viewerContainer.scrollLeft += scrollX * scaleCorrectionFactor;
            }
        }
        this.pdfViewerBase.renderedPagesList = [];
        this.pdfViewerBase.pinchZoomStorage = [];
    }
    rerenderOnScroll() {
        this.isPinchZoomed = false;
        if (this.isPinchScrolled) {
            this.rerenderOnScrollTimer = null;
            this.isPinchScrolled = false;
            this.reRenderPageNumber = this.pdfViewerBase.currentPageNumber;
            this.pdfViewerBase.renderedPagesList = [];
            this.pdfViewerBase.pinchZoomStorage = [];
            if (this.pdfViewerBase.textLayer) {
                let textLayers = document.querySelectorAll('div[id*="_textLayer_"]');
                for (let i = 0; i < textLayers.length; i++) {
                    textLayers[i].style.display = 'block';
                }
            }
            this.pdfViewerBase.pageViewScrollChanged(this.reRenderPageNumber);
            this.isPagePinchZoomed = false;
            this.rerenderOnScrollTimer = setTimeout(() => { this.pdfViewerBase.pageViewScrollChanged(this.reRenderPageNumber); }, 300);
        }
    }
    /**
     * @private
     */
    pinchMoveScroll() {
        if (this.isRerenderCanvasCreated) {
            this.clearIntervalTimer();
        }
        if (this.isPagesZoomed || (!this.isRerenderCanvasCreated && this.isPagePinchZoomed)) {
            this.clearRendering();
            this.isPagesZoomed = false;
            clearTimeout(this.magnifyPageRerenderTimer);
            this.isPinchScrolled = true;
            this.rerenderOnScrollTimer = setTimeout(() => { this.rerenderOnScroll(); }, 100);
        }
    }
    // tslint:disable-next-line
    initiateRerender(proxy) {
        if (proxy.pageRerenderCount === proxy.pdfViewerBase.reRenderedCount && proxy.pageRerenderCount !== 0 && proxy.pdfViewerBase.reRenderedCount !== 0) {
            proxy.reRenderAfterPinch(this.reRenderPageNumber);
        }
    }
    reRenderAfterPinch(currentPageIndex) {
        this.pageRerenderCount = 0;
        let lowerPageValue = currentPageIndex - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        let higherPageValue = currentPageIndex + 1;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        for (let i = lowerPageValue; i <= higherPageValue; i++) {
            let pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + i);
            let pageCanvas = this.pdfViewerBase.getElement('_pageCanvas_' + i);
            if (pageCanvas) {
                pageCanvas.style.display = 'block';
            }
            let oldCanvas = this.pdfViewerBase.getElement('_oldCanvas_' + i);
            if (oldCanvas) {
                oldCanvas.parentNode.removeChild(oldCanvas);
            }
            if (pageDiv) {
                pageDiv.style.visibility = 'visible';
            }
        }
        this.isRerenderCanvasCreated = false;
        this.isPagePinchZoomed = false;
        if (this.pdfViewerBase.reRenderedCount !== 0) {
            this.pdfViewerBase.reRenderedCount = 0;
            this.pageRerenderCount = 0;
            clearInterval(this.rerenderInterval);
            this.rerenderInterval = null;
        }
        this.imageObjects = [];
    }
    designNewCanvas(currentPageIndex) {
        if (this.pdfViewerBase.textLayer) {
            this.pdfViewerBase.textLayer.clearTextLayers();
        }
        let lowerPageValue = currentPageIndex - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        let higherPageValue = currentPageIndex + 1; // jshint ignore:line
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        for (let i = lowerPageValue; i <= higherPageValue; i++) {
            let canvas = this.pdfViewerBase.getElement('_pageCanvas_' + i);
            if (canvas) {
                canvas.id = this.pdfViewer.element.id + '_oldCanvas_' + i;
                // tslint:disable-next-line:max-line-length
                let newCanvas = this.pdfViewerBase.renderPageCanvas(this.pdfViewerBase.getElement('_pageDiv_' + i), this.pdfViewerBase.pageSize[i].width * this.zoomFactor, this.pdfViewerBase.pageSize[i].height * this.zoomFactor, i);
                newCanvas.style.display = 'none';
            }
        }
        this.isRerenderCanvasCreated = true;
    }
    /**
     * @private
     */
    pageRerenderOnMouseWheel() {
        if (this.isRerenderCanvasCreated) {
            this.clearIntervalTimer();
            clearTimeout(this.magnifyPageRerenderTimer);
            if (!this.isPinchScrolled) {
                this.isPinchScrolled = true;
                this.rerenderOnScrollTimer = setTimeout(() => { this.rerenderOnScroll(); }, 100);
            }
        }
    }
    /**
     * @private
     */
    renderCountIncrement() {
        if (this.isRerenderCanvasCreated) {
            this.pageRerenderCount++;
        }
    }
    /**
     * @private
     */
    rerenderCountIncrement() {
        if (this.pageRerenderCount > 0) {
            this.pdfViewerBase.reRenderedCount++;
        }
    }
    resizeCanvas(pageNumber) {
        let lowerPageValue = pageNumber - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        let higherPageValue = pageNumber + 3;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        for (let i = lowerPageValue; i <= higherPageValue; i++) {
            let pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + i);
            let textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + i);
            if (pageDiv) {
                if ((lowerPageValue <= i) && (i <= higherPageValue)) {
                    let isSelectionAvailable = false;
                    if (this.pdfViewer.textSelectionModule) {
                        isSelectionAvailable = this.pdfViewer.textSelectionModule.isSelectionAvailableOnScroll(i);
                    }
                    if (this.pdfViewerBase.pageSize[i] != null) {
                        let width = this.pdfViewerBase.pageSize[i].width * this.zoomFactor;
                        let height = this.pdfViewerBase.pageSize[i].height * this.zoomFactor;
                        pageDiv.style.width = width + 'px';
                        pageDiv.style.height = height + 'px';
                        // tslint:disable-next-line:max-line-length
                        pageDiv.style.top = ((this.pdfViewerBase.pageSize[i].top) * this.zoomFactor) + 'px';
                        pageDiv.style.left = this.pdfViewerBase.updateLeftPosition(i) + 'px';
                        let canvas = this.pdfViewerBase.getElement('_pageCanvas_' + i);
                        if (canvas) {
                            canvas.style.width = width + 'px';
                            canvas.style.height = height + 'px';
                        }
                        if (textLayer) {
                            textLayer.style.width = width + 'px';
                            textLayer.style.height = height + 'px';
                            if (this.pdfViewer.textSelectionModule) {
                                if (this.isPinchZoomed) {
                                    textLayer.style.display = 'none';
                                }
                                else if (this.isMagnified) {
                                    let lowerValue = ((pageNumber - 2) === 0) ? 0 : (pageNumber - 2);
                                    // tslint:disable-next-line:max-line-length
                                    let higherValue = ((pageNumber) === (this.pdfViewerBase.pageCount)) ? (this.pdfViewerBase.pageCount - 1) : pageNumber;
                                    if ((lowerValue <= i) && (i <= higherValue) && ((this.pdfViewer.textSelectionModule.isTextSelection && isSelectionAvailable) || this.pdfViewerBase.textLayer.getTextSearchStatus())) {
                                        this.pdfViewerBase.textLayer.resizeTextContentsOnZoom(i);
                                        if (this.pdfViewer.textSelectionModule.isTextSelection && isSelectionAvailable) {
                                            this.pdfViewer.textSelectionModule.applySelectionRangeOnScroll(i);
                                        }
                                    }
                                    else {
                                        textLayer.style.display = 'none';
                                    }
                                }
                                else {
                                    textLayer.style.display = 'none';
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    zoomOverPages(pointX1, pointY1, pointX2, pointY2) {
        // tslint:disable-next-line
        let currentDifference = Math.sqrt(Math.pow((pointX1 - pointX2), 2) + Math.pow((pointY1 - pointY2), 2));
        if (this.previousTouchDifference > -1) {
            if (currentDifference > this.previousTouchDifference) {
                this.pinchOut();
            }
            else if (currentDifference < this.previousTouchDifference) {
                this.pinchIn();
            }
        }
        this.previousTouchDifference = currentDifference;
    }
    /**
     * @private
     */
    pinchMoveEnd() {
        this.touchCenterX = 0;
        this.touchCenterY = 0;
        this.previousTouchDifference = -1;
        if (this.isPinchZoomed) {
            this.isPinchScrolled = false;
            this.isPagePinchZoomed = true;
            this.pinchMoveScroll();
        }
    }
    /**
     * @private
     */
    fitPageScrollMouseWheel(event) {
        if (this.fitType === 'fitToPage') {
            event.preventDefault();
            if (event.wheelDelta > 0) {
                this.upwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
            }
            else {
                this.downwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
            }
        }
    }
    /**
     * @private
     */
    magnifyBehaviorKeyDown(event) {
        let isMac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
        let isCommandKey = isMac ? event.metaKey : false;
        switch (event.keyCode) {
            case 38: // up arrow
            case 37: // left arrow
            case 33: // page up
                if (this.fitType === 'fitToPage' && !((event.ctrlKey || isCommandKey) && event.shiftKey)) {
                    event.preventDefault();
                    this.upwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
                }
                break;
            case 40: // down arrow
            case 39: // right arrow
            case 34: // page down
                if (this.fitType === 'fitToPage' && !((event.ctrlKey || isCommandKey) && event.shiftKey)) {
                    event.preventDefault();
                    this.downwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
                }
                break;
            case 187: // equal key
                if (event.ctrlKey || isCommandKey) {
                    event.preventDefault();
                    this.zoomIn();
                }
                break;
            case 189: // minus key
                if (event.ctrlKey || isCommandKey) {
                    event.preventDefault();
                    this.zoomOut();
                }
                break;
            case 48: // zero key
                if ((event.ctrlKey || isCommandKey) && !event.shiftKey) {
                    event.preventDefault();
                    this.fitToPage();
                }
                break;
            case 49: // one key
                if ((event.ctrlKey || isCommandKey) && !event.shiftKey) {
                    event.preventDefault();
                    this.zoomTo(100);
                }
                break;
            default:
                break;
        }
    }
    upwardScrollFitPage(currentPageIndex) {
        if (currentPageIndex > 0) {
            this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex - 1)).style.visibility = 'visible';
            this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.pageSize[currentPageIndex - 1].top * this.zoomFactor;
            this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex)).style.visibility = 'hidden';
        }
    }
    /**
     * @private
     */
    updatePagesForFitPage(currentPageIndex) {
        if (this.fitType === 'fitToPage') {
            if (currentPageIndex > 0) {
                this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex - 1)).style.visibility = 'hidden';
            }
            if (currentPageIndex < (this.pdfViewerBase.pageCount - 1)) {
                this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex + 1)).style.visibility = 'hidden';
            }
        }
    }
    downwardScrollFitPage(currentPageIndex) {
        if (currentPageIndex !== (this.pdfViewerBase.pageCount - 1)) {
            this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex + 1)).style.visibility = 'visible';
            this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.pageSize[currentPageIndex + 1].top * this.zoomFactor;
            if (currentPageIndex + 1 === (this.pdfViewerBase.pageCount - 1)) {
                this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex)).style.visibility = 'hidden';
            }
            else {
                this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex + 2)).style.visibility = 'hidden';
            }
        }
    }
    getMagnifiedValue(value) {
        return (value / this.previousZoomFactor) * this.zoomFactor;
    }
    /**
     * @private
     */
    destroy() {
        this.imageObjects = undefined;
    }
    /**
     * returns zoom factor when the zoom percent is passed.
     */
    getZoomFactor(zoomValue) {
        return zoomValue / 100;
    }
    /**
     * @private
     */
    getModuleName() {
        return 'Magnification';
    }
}

/**
 * export types
 */

/**
 * Navigation module
 */
class Navigation {
    /**
     * @private
     */
    constructor(viewer, viewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
    }
    /**
     * Navigate to Next page of the PDF document
     * @returns void
     */
    goToNextPage() {
        this.pageNumber = this.pdfViewerBase.currentPageNumber;
        this.pageNumber++;
        if (this.pageNumber <= this.pdfViewerBase.pageCount) {
            this.pdfViewerBase.updateScrollTop(this.pageNumber - 1);
        }
    }
    /**
     * Navigate to Previous page of the PDF document
     * @returns void
     */
    goToPreviousPage() {
        this.pageNumber = this.pdfViewerBase.currentPageNumber;
        this.pageNumber--;
        if (this.pageNumber > 0) {
            this.pdfViewerBase.updateScrollTop(this.pageNumber - 1);
        }
    }
    /**
     * Navigate to given Page number
     * Note : In case if we have provided incorrect page number as argument it will retain the existing page
     * @param  {number} pageNumber
     * @returns void
     */
    goToPage(pageNumber) {
        if (pageNumber > 0 && pageNumber <= this.pdfViewerBase.pageCount && this.pdfViewerBase.currentPageNumber !== pageNumber) {
            this.pdfViewerBase.updateScrollTop(pageNumber - 1);
        }
    }
    /**
     * Navigate to First page of the PDF document
     * @returns void
     */
    goToFirstPage() {
        this.pageNumber = 0;
        this.pdfViewerBase.updateScrollTop(this.pageNumber);
    }
    /**
     * Navigate to Last page of the PDF document
     * @returns void
     */
    goToLastPage() {
        this.pageNumber = this.pdfViewerBase.pageCount - 1;
        this.pdfViewerBase.updateScrollTop(this.pageNumber);
    }
    /**
     * @private
     */
    destroy() {
        this.pageNumber = 0;
    }
    /**
     * @private
     */
    getModuleName() {
        return 'Navigation';
    }
}

/**
 * export types
 */

/**
 * The `ThumbnailView` module is used to handle thumbnail view navigation of PDF viewer.
 * @hidden
 */
class ThumbnailView {
    /**
     * @private
     */
    constructor(pdfViewer, pdfViewerBase) {
        this.thumbnailLimit = 30;
        this.thumbnailThreshold = 50;
        this.thumbnailTopMargin = 10;
        /**
         * @private
         */
        this.isThumbnailClicked = false;
        /**
         * @private
         */
        this.thumbnailClick = (event) => {
            let proxy = this;
            let pageNumber = proxy.getPageNumberFromID(event.srcElement.id);
            if (proxy.previousElement) {
                proxy.previousElement.classList.remove('e-pv-thumbnail-selection');
                proxy.previousElement.classList.remove('e-pv-thumbnail-focus');
                proxy.previousElement.classList.add('e-pv-thumbnail-selection-ring');
            }
            if (event.srcElement.parentElement.id === proxy.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageNumber) {
                proxy.setSelectionStyle(event.srcElement.parentElement);
                proxy.previousElement = event.srcElement.parentElement;
            }
            else if (event.srcElement.id === proxy.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageNumber) {
                proxy.setSelectionStyle(event.srcElement);
                proxy.previousElement = event.srcElement;
            }
            proxy.isThumbnailClicked = true;
            proxy.goToThumbnailPage(pageNumber + 1);
            proxy.pdfViewerBase.focusViewerContainer();
        };
        /**
         * @private
         */
        this.thumbnailMouseOver = (event) => {
            let proxy = this;
            let pageNumber = proxy.getPageNumberFromID(event.srcElement.id);
            if (event.srcElement.id === proxy.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageNumber) {
                proxy.setMouseOverStyle(event.srcElement);
            }
            else if (event.srcElement.id === proxy.pdfViewer.element.id + '_thumbnail_image_' + pageNumber) {
                proxy.setMouseOverStyle(event.srcElement.parentElement);
            }
        };
        /**
         * @private
         */
        this.thumbnailMouseLeave = (event) => {
            let proxy = this;
            let pageNumber = proxy.getPageNumberFromID(event.srcElement.id);
            if (event.srcElement.parentElement.id === proxy.pdfViewer.element.id + '_thumbnail_view') {
                proxy.setMouseLeaveStyle(event.srcElement.children[0].children[0]);
            }
            else if (event.srcElement.parentElement.id === proxy.pdfViewer.element.id + '_thumbnail_' + pageNumber) {
                proxy.setMouseLeaveStyle(event.srcElement.parentElement.children[0]);
            }
        };
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    createThumbnailContainer() {
        // tslint:disable-next-line:max-line-length
        this.thumbnailView = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_view', className: 'e-pv-thumbnail-view e-pv-thumbnail-row' });
        this.pdfViewerBase.navigationPane.sideBarContent.appendChild(this.thumbnailView);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    createRequestForThumbnails() {
        let proxy = this;
        // tslint:disable-next-line
        let isIE = !!document.documentMode;
        if (!isIE) {
            // tslint:disable-next-line
            return new Promise(
            // tslint:disable-next-line
            function (renderThumbnailImage, reject) {
                proxy.requestCreation(proxy);
            });
        }
        else {
            this.requestCreation(proxy);
            return null;
        }
    }
    requestCreation(proxy) {
        if (!proxy.isThumbnailCompleted) {
            // tslint:disable-next-line:max-line-length
            proxy.thumbnailLimit = proxy.thumbnailLimit < proxy.pdfViewer.pageCount ? proxy.thumbnailLimit : proxy.pdfViewer.pageCount;
            if (proxy.thumbnailLimit !== proxy.pdfViewer.pageCount) {
                proxy.isThumbnailCompleted = false;
                proxy.startIndex = 0;
            }
        }
        else {
            proxy.startIndex = proxy.thumbnailLimit;
            // tslint:disable-next-line:max-line-length
            proxy.thumbnailLimit = proxy.startIndex + proxy.thumbnailThreshold < proxy.pdfViewer.pageCount ? proxy.startIndex + proxy.thumbnailThreshold : proxy.pdfViewer.pageCount;
        }
        let request = new XMLHttpRequest();
        // tslint:disable-next-line:max-line-length
        let jsonObject = { startPage: proxy.startIndex, endPage: proxy.thumbnailLimit, sizeX: 99.7, sizeY: 141, hashId: proxy.pdfViewerBase.hashId };
        request.open('POST', proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.renderThumbnail);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.responseType = 'json';
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        request.onreadystatechange = (event) => {
            if (request.readyState === 4 && request.status === 200) {
                // tslint:disable-next-line
                let data = event.currentTarget.response;
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
        request.onerror = (event) => {
            this.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
        };
    }
    /**
     * @private
     */
    gotoThumbnailImage(pageNumber) {
        let shouldScroll = this.checkThumbnailScroll(pageNumber);
        if (this.thumbnailView) {
            let thumbnailChild = this.thumbnailView.children[pageNumber];
            if (thumbnailChild) {
                let thumbnailDiv = thumbnailChild.children[0];
                if (shouldScroll) {
                    let offsetTop = thumbnailDiv.offsetTop + thumbnailDiv.clientTop - this.thumbnailTopMargin;
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
                this.previousElement = thumbnailDiv.children[0];
            }
        }
    }
    checkThumbnailScroll(pageNumber) {
        let shouldScroll = false;
        if (this.thumbnailView) {
            let visibleThumbs = this.getVisibleThumbs();
            let numVisibleThumbs = visibleThumbs.views.length;
            // if the thumbnail isn't currently visible, scroll it into view.
            if (numVisibleThumbs > 0) {
                let visibleFirstPageID = this.getPageNumberFromID(visibleThumbs.first.id);
                // account for only one thumbnail being visible.
                // tslint:disable-next-line:max-line-length
                let visibleLastPageID = (numVisibleThumbs > 1 ? this.getPageNumberFromID(visibleThumbs.last.id) : visibleFirstPageID);
                if (pageNumber <= visibleFirstPageID || pageNumber >= visibleLastPageID) {
                    shouldScroll = true;
                }
                else {
                    // tslint:disable-next-line
                    visibleThumbs.views.some(view => {
                        let pageID = view.id.split('_');
                        let thumbPageNumber = pageID[pageID.length - 1];
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
    getPageNumberFromID(pageId) {
        let pageID = pageId.split('_');
        let pageNumber = pageID[pageID.length - 1];
        // tslint:disable-next-line:radix
        return parseInt(pageNumber);
    }
    setFocusStyle(thumbnail, pageNumber) {
        if (thumbnail.children[0].id === this.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageNumber) {
            this.setMouseFocusStyle(thumbnail.children[0]);
        }
    }
    // tslint:disable-next-line
    renderThumbnailImage(data) {
        if (this.thumbnailView) {
            for (let i = this.startIndex; i < this.thumbnailLimit; i++) {
                let pageLink = createElement('a', { id: 'page_' + i });
                // tslint:disable-next-line:max-line-length
                let thumbnail = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_' + i, className: 'e-pv-thumbnail e-pv-thumbnail-column' });
                // tslint:disable-next-line:max-line-length
                this.thumbnailSelectionRing = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + i, className: 'e-pv-thumbnail-selection-ring' });
                thumbnail.appendChild(this.thumbnailSelectionRing);
                // tslint:disable-next-line:max-line-length
                let thumbnailPageNumber = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_pagenumber_' + i, className: 'e-pv-thumbnail-number' });
                thumbnailPageNumber.textContent = (i + 1).toString();
                thumbnail.appendChild(thumbnailPageNumber);
                // tslint:disable-next-line:max-line-length
                this.thumbnailImage = createElement('img', { id: this.pdfViewer.element.id + '_thumbnail_image_' + i, className: 'e-pv-thumbnail-image' });
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
            let isIE = !!document.documentMode;
            if (!isIE) {
                Promise.all([this.createRequestForThumbnails()]);
            }
            else {
                this.createRequestForThumbnails();
            }
        }
    }
    wireUpEvents() {
        if (this.thumbnailSelectionRing) {
            this.thumbnailSelectionRing.addEventListener('click', this.thumbnailClick);
            this.thumbnailSelectionRing.addEventListener('mouseover', this.thumbnailMouseOver);
            this.thumbnailSelectionRing.addEventListener('mouseleave', this.thumbnailMouseLeave);
        }
    }
    unwireUpEvents() {
        if (this.thumbnailSelectionRing && this.thumbnailImage) {
            this.thumbnailSelectionRing.removeEventListener('click', this.thumbnailClick);
            this.thumbnailSelectionRing.removeEventListener('mouseover', this.thumbnailMouseOver);
            this.thumbnailSelectionRing.removeEventListener('mouseleave', this.thumbnailMouseLeave);
        }
    }
    goToThumbnailPage(pageNumber) {
        if (pageNumber > 0 && pageNumber <= this.pdfViewerBase.pageCount && this.pdfViewerBase.currentPageNumber !== pageNumber) {
            this.pdfViewerBase.updateScrollTop(pageNumber - 1);
        }
        else {
            this.isThumbnailClicked = false;
        }
    }
    setSelectionStyle(thumbnailElement) {
        thumbnailElement.classList.remove('e-pv-thumbnail-selection-ring');
        thumbnailElement.classList.remove('e-pv-thumbnail-hover');
        thumbnailElement.classList.remove('e-pv-thumbnail-focus');
        thumbnailElement.classList.add('e-pv-thumbnail-selection');
    }
    setMouseOverStyle(thumbnailElement) {
        // tslint:disable-next-line:max-line-length
        if (!thumbnailElement.classList.contains('e-pv-thumbnail-selection')) {
            thumbnailElement.classList.remove('e-pv-thumbnail-selection-ring');
            if (!thumbnailElement.classList.contains('e-pv-thumbnail-focus')) {
                thumbnailElement.classList.add('e-pv-thumbnail-hover');
            }
        }
    }
    setMouseLeaveStyle(thumbnailElement) {
        if (!thumbnailElement.classList.contains('e-pv-thumbnail-selection')) {
            if (!thumbnailElement.classList.contains('e-pv-thumbnail-focus')) {
                thumbnailElement.classList.add('e-pv-thumbnail-selection-ring');
            }
            thumbnailElement.classList.remove('e-pv-thumbnail-hover');
        }
        else {
            if (!thumbnailElement.classList.contains('e-pv-thumbnail-selection')) {
                thumbnailElement.classList.remove('e-pv-thumbnail-selection');
                thumbnailElement.classList.add('e-pv-thumbnail-focus');
            }
        }
    }
    setMouseFocusStyle(thumbnailElement) {
        thumbnailElement.classList.remove('e-pv-thumbnail-selection');
        thumbnailElement.classList.remove('e-pv-thumbnail-hover');
        thumbnailElement.classList.add('e-pv-thumbnail-focus');
    }
    setMouseFocusToFirstPage() {
        let thumbnailChild = this.thumbnailView.children[0];
        if (thumbnailChild) {
            let thumbnailDiv = thumbnailChild.children[0].children[0];
            this.setMouseFocusStyle(thumbnailDiv);
            this.previousElement = thumbnailDiv;
        }
    }
    /**
     * @private
     */
    clear() {
        this.startIndex = 0;
        this.thumbnailLimit = 0;
        this.isThumbnailCompleted = false;
        if (this.pdfViewerBase.navigationPane.sideBarContentContainer) {
            this.pdfViewerBase.navigationPane.sideBarContentContainer.style.display = 'block';
            this.pdfViewerBase.navigationPane.sideBarContent.scrollTop = 0;
            this.pdfViewerBase.navigationPane.sideBarContentContainer.style.display = 'none';
        }
        if (this.thumbnailView) {
            while (this.thumbnailView.hasChildNodes()) {
                this.thumbnailView.removeChild(this.thumbnailView.lastChild);
            }
        }
        this.pdfViewerBase.navigationPane.resetThumbnailView();
        this.unwireUpEvents();
    }
    getVisibleThumbs() {
        return this.getVisibleElements(this.pdfViewerBase.navigationPane.sideBarContent, this.thumbnailView.children);
    }
    getVisibleElements(scrollElement, thumbnailViewChildren) {
        let top = scrollElement.scrollTop;
        let bottom = top + scrollElement.clientHeight;
        let left = scrollElement.scrollLeft;
        let right = left + scrollElement.clientWidth;
        function isThumbnailElementBottomAfterViewTop(thumbnailViewChildrenElement) {
            let elementBottom = thumbnailViewChildrenElement.offsetTop + thumbnailViewChildrenElement.clientTop + thumbnailViewChildrenElement.clientHeight;
            return elementBottom > top;
        }
        // tslint:disable-next-line
        let visible = [];
        let thumbnailView;
        let element;
        let currentHeight;
        let viewHeight;
        let viewBottom;
        let hiddenHeight;
        let currentWidth;
        let viewWidth;
        let viewRight;
        let hiddenWidth;
        let percentVisible;
        let firstVisibleElementInd = thumbnailViewChildren.length === 0 ? 0 :
            this.binarySearchFirstItem(thumbnailViewChildren, isThumbnailElementBottomAfterViewTop);
        if (thumbnailViewChildren.length > 0) {
            firstVisibleElementInd =
                this.backtrackBeforeAllVisibleElements(firstVisibleElementInd, thumbnailViewChildren, top);
        }
        let lastEdge = -1;
        for (let i = firstVisibleElementInd, ii = thumbnailViewChildren.length; i < ii; i++) {
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
            }
            else if (currentHeight > lastEdge) {
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
        let first = visible[0];
        let last = visible[visible.length - 1];
        return { first: first, last: last, views: visible, };
    }
    // tslint:disable-next-line
    binarySearchFirstItem(items, condition) {
        let minIndex = 0;
        let maxIndex = items.length - 1;
        if (items.length === 0 || !condition(this.getThumbnailElement(maxIndex))) {
            return items.length - 1;
        }
        if (condition(this.getThumbnailElement(minIndex))) {
            return minIndex;
        }
        while (minIndex < maxIndex) {
            // tslint:disable-next-line:no-bitwise
            let currentIndex = (minIndex + maxIndex) >> 1;
            if (condition(this.getThumbnailElement(currentIndex))) {
                maxIndex = currentIndex;
            }
            else {
                minIndex = currentIndex + 1;
            }
        }
        return minIndex; /* === maxIndex */
    }
    backtrackBeforeAllVisibleElements(index, views, top) {
        if (index < 2) {
            return index;
        }
        let thumbnailElement = this.getThumbnailElement(index);
        let pageTop = thumbnailElement.offsetTop + thumbnailElement.clientTop;
        if (pageTop >= top) {
            thumbnailElement = this.getThumbnailElement(index - 1);
            pageTop = thumbnailElement.offsetTop + thumbnailElement.clientTop;
        }
        for (let i = index - 2; i >= 0; --i) {
            thumbnailElement = this.getThumbnailElement(i);
            if (thumbnailElement.offsetTop + thumbnailElement.clientTop + thumbnailElement.clientHeight <= pageTop) {
                break;
            }
            index = i;
        }
        return index;
    }
    getThumbnailElement(index) {
        let thumbnailChild = this.thumbnailView.children[index];
        return thumbnailChild.children[0];
    }
    /**
     * @private
     */
    destroy() {
        this.clear();
    }
    /**
     * @private
     */
    getModuleName() {
        return 'ThumbnailView';
    }
}

/**
 * export types
 */

/**
 * Toolbar module
 */
class Toolbar$1 {
    /**
     * @private
     */
    constructor(viewer, viewerBase) {
        this.isPageNavigationToolDisabled = false;
        this.isMagnificationToolDisabled = false;
        this.isSelectionToolDisabled = false;
        this.isScrollingToolDisabled = false;
        this.isOpenBtnVisible = true;
        this.isNavigationToolVisible = true;
        this.isMagnificationToolVisible = true;
        this.isSelectionBtnVisible = true;
        this.isScrollingBtnVisible = true;
        this.isDownloadBtnVisible = true;
        this.isPrintBtnVisible = true;
        this.isSearchBtnVisible = true;
        this.isTextSearchBoxDisplayed = false;
        this.onToolbarKeydown = (event) => {
            let targetId = event.target.id;
            if (!(targetId === this.pdfViewer.element.id + '_currentPageInput' || targetId === this.pdfViewer.element.id + '_zoomDropDown')) {
                event.preventDefault();
                event.stopPropagation();
            }
        };
        this.toolbarClickHandler = (args) => {
            // tslint:disable-next-line:max-line-length
            if (args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[1] || args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[2]) {
                args.cancel = true;
            }
            else if (args.originalEvent.target.id === this.pdfViewer.element.id + '_openIcon') {
                let tooltipData = args.originalEvent.target.parentElement.dataset;
                if (tooltipData && tooltipData.tooltipId) {
                    let tooltipElement = document.getElementById(tooltipData.tooltipId);
                    if (tooltipElement) {
                        tooltipElement.style.display = 'none';
                    }
                }
            }
            switch (args.originalEvent.target.id) {
                case this.pdfViewer.element.id + '_open':
                case this.pdfViewer.element.id + '_openIcon':
                    this.fileInputElement.click();
                    break;
                case this.pdfViewer.element.id + '_download':
                case this.pdfViewer.element.id + '_downloadIcon':
                    this.pdfViewerBase.download();
                    break;
                case this.pdfViewer.element.id + '_print':
                case this.pdfViewer.element.id + '_printIcon':
                    if (this.pdfViewer.printModule) {
                        this.pdfViewer.printModule.print();
                    }
                    break;
                case this.pdfViewer.element.id + '_firstPage':
                case this.pdfViewer.element.id + '_firstPageIcon':
                    if (this.pdfViewer.navigationModule) {
                        this.pdfViewer.navigationModule.goToFirstPage();
                    }
                    break;
                case this.pdfViewer.element.id + '_previousPage':
                case this.pdfViewer.element.id + '_previousPageIcon':
                    if (this.pdfViewer.navigationModule) {
                        this.pdfViewer.navigationModule.goToPreviousPage();
                    }
                    break;
                case this.pdfViewer.element.id + '_nextPage':
                case this.pdfViewer.element.id + '_nextPageIcon':
                    if (this.pdfViewer.navigationModule) {
                        this.pdfViewer.navigationModule.goToNextPage();
                    }
                    break;
                case this.pdfViewer.element.id + '_lastPage':
                case this.pdfViewer.element.id + '_lastPageIcon':
                    if (this.pdfViewer.navigationModule) {
                        this.pdfViewer.navigationModule.goToLastPage();
                    }
                    break;
                case this.pdfViewer.element.id + '_zoomIn':
                case this.pdfViewer.element.id + '_zoomInIcon':
                    this.pdfViewer.magnificationModule.zoomIn();
                    break;
                case this.pdfViewer.element.id + '_zoomOut':
                case this.pdfViewer.element.id + '_zoomOutIcon':
                    this.pdfViewer.magnificationModule.zoomOut();
                    break;
                case this.pdfViewer.element.id + '_selectTool':
                case this.pdfViewer.element.id + '_selectToolIcon':
                    if (!this.isSelectionToolDisabled) {
                        this.pdfViewerBase.initiateTextSelectMode();
                        this.updateInteractionTools(true);
                    }
                    break;
                case this.pdfViewer.element.id + '_handTool':
                case this.pdfViewer.element.id + '_handToolIcon':
                    if (!this.isScrollingToolDisabled) {
                        this.pdfViewerBase.initiatePanning();
                        this.updateInteractionTools(false);
                    }
                    break;
                case this.pdfViewer.element.id + '_search':
                case this.pdfViewer.element.id + '_searchIcon':
                    this.textSearchButtonHandler();
                    break;
            }
            // tslint:disable-next-line:max-line-length
            if (!(args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[1] || args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[2] || args.originalEvent.target === this.currentPageBoxElement || args.originalEvent.target === this.textSearchItem.childNodes[0])) {
                args.originalEvent.target.blur();
                this.pdfViewerBase.focusViewerContainer();
            }
        };
        // tslint:disable-next-line
        this.loadDocument = (args) => {
            // tslint:disable-next-line
            let upoadedFiles = args.target.files;
            if (args.target.files[0] !== null) {
                let uploadedFile = upoadedFiles[0];
                if (uploadedFile) {
                    this.uploadedDocumentName = uploadedFile.name;
                    let reader = new FileReader();
                    reader.readAsDataURL(uploadedFile);
                    // tslint:disable-next-line
                    reader.onload = (e) => {
                        let uploadedFileUrl = e.currentTarget.result;
                        this.pdfViewer.load(uploadedFileUrl, null);
                    };
                }
            }
        };
        this.navigateToPage = (args) => {
            if (args.which === 13) {
                // tslint:disable-next-line
                let enteredValue = parseInt(this.currentPageBoxElement.value);
                if (enteredValue !== null) {
                    if (enteredValue > 0 && enteredValue <= this.pdfViewerBase.pageCount) {
                        if (this.pdfViewer.navigationModule) {
                            this.pdfViewer.navigationModule.goToPage(enteredValue);
                        }
                    }
                    else {
                        this.updateCurrentPage(this.pdfViewerBase.currentPageNumber);
                    }
                }
                else {
                    this.updateCurrentPage(this.pdfViewerBase.currentPageNumber);
                }
                this.currentPageBoxElement.blur();
                this.pdfViewerBase.focusViewerContainer();
            }
        };
        this.textBoxFocusOut = () => {
            // tslint:disable-next-line
            if (this.currentPageBox.value === null || this.currentPageBox.value >= this.pdfViewerBase.pageCount || this.currentPageBox.value !== this.pdfViewerBase.currentPageNumber) {
                this.updateCurrentPage(this.pdfViewerBase.currentPageNumber);
            }
        };
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
    }
    /**
     * @private
     */
    intializeToolbar(width) {
        let toolbarDiv = this.createToolbar(width);
        // tslint:disable-next-line
        let isIE = !!document.documentMode;
        if (isIE) {
            this.totalPageItem.classList.add('e-pv-total-page-ms');
        }
        this.createFileElement(toolbarDiv);
        this.wireEvent();
        this.updateToolbarItems();
        this.applyToolbarSettings();
        this.initialEnableItems();
        return toolbarDiv;
    }
    /**
     * Shows /hides the toolbar in the PdfViewer
     * @param  {boolean} enableToolbar
     * @returns void
     */
    showToolbar(enableToolbar) {
        let toolbar = this.toolbarElement;
        if (enableToolbar) {
            toolbar.style.display = 'block';
        }
        else {
            toolbar.style.display = 'none';
            this.pdfViewerBase.navigationPane.sideBarToolbar.style.display = 'none';
        }
    }
    /**
     * Shows /hides the the toolbar items in the PdfViewer
     * @param  {string[]} items
     * @param  {boolean} isVisible
     * @returns void
     */
    showToolbarItem(items, isVisible) {
        for (let i = 0; i < items.length; i++) {
            switch (items[i]) {
                case 'OpenOption':
                    this.showOpenOption(isVisible);
                    break;
                case 'PageNavigationTool':
                    this.showPageNavigationTool(isVisible);
                    break;
                case 'MagnificationTool':
                    this.showMagnificationTool(isVisible);
                    break;
                case 'SelectionTool':
                    this.showSelectionTool(isVisible);
                    break;
                case 'PanTool':
                    this.showScrollingTool(isVisible);
                    break;
                case 'DownloadOption':
                    this.showDownloadOption(isVisible);
                    break;
                case 'PrintOption':
                    this.showPrintOption(isVisible);
                    break;
                case 'SearchOption':
                    this.showSearchOption(isVisible);
                    break;
            }
        }
        this.applyHideToToolbar(true, 1, 1);
        this.applyHideToToolbar(true, 8, 8);
        this.applyHideToToolbar(true, 12, 12);
        this.showSeparator(items);
    }
    /**
     * Enables /disables the the toolbar items in the PdfViewer
     * @param  {string[]} items
     * @param  {boolean} isEnable
     * @returns void
     */
    enableToolbarItem(items, isEnable) {
        for (let i = 0; i < items.length; i++) {
            switch (items[i]) {
                case 'OpenOption':
                    this.enableOpenOption(isEnable);
                    break;
                case 'PageNavigationTool':
                    this.isPageNavigationToolDisabled = isEnable;
                    this.enablePageNavigationTool(isEnable);
                    break;
                case 'MagnificationTool':
                    this.isMagnificationToolDisabled = isEnable;
                    this.enableMagnificationTool(isEnable);
                    break;
                case 'SelectionTool':
                    this.isSelectionToolDisabled = isEnable;
                    this.enableSelectionTool(isEnable);
                    break;
                case 'PanTool':
                    this.isScrollingToolDisabled = isEnable;
                    this.enableScrollingTool(isEnable);
                    break;
                case 'DownloadOption':
                    this.enableDownloadOption(isEnable);
                    break;
                case 'PrintOption':
                    this.enablePrintOption(isEnable);
                    break;
                case 'SearchOption':
                    this.enableSearchOption(isEnable);
                    break;
            }
        }
    }
    showOpenOption(enableOpenOption) {
        this.isOpenBtnVisible = enableOpenOption;
        this.applyHideToToolbar(enableOpenOption, 0, 0);
    }
    showPageNavigationTool(enablePageNavigationTool) {
        this.isNavigationToolVisible = enablePageNavigationTool;
        this.applyHideToToolbar(enablePageNavigationTool, 2, 7);
    }
    showMagnificationTool(enableMagnificationTool) {
        this.isMagnificationToolVisible = enableMagnificationTool;
        this.applyHideToToolbar(enableMagnificationTool, 9, 11);
    }
    showSelectionTool(enableSelectionTool) {
        this.isSelectionBtnVisible = enableSelectionTool;
        this.applyHideToToolbar(enableSelectionTool, 13, 13);
    }
    showScrollingTool(enableScrollingTool) {
        this.isScrollingBtnVisible = enableScrollingTool;
        this.applyHideToToolbar(enableScrollingTool, 14, 14);
    }
    showDownloadOption(enableDownloadOption) {
        this.isDownloadBtnVisible = enableDownloadOption;
        this.applyHideToToolbar(enableDownloadOption, 16, 16);
    }
    showPrintOption(enablePrintOption) {
        this.isPrintBtnVisible = enablePrintOption;
        this.applyHideToToolbar(enablePrintOption, 17, 17);
    }
    showSearchOption(enableSearchOption) {
        this.isSearchBtnVisible = enableSearchOption;
        this.applyHideToToolbar(enableSearchOption, 15, 15);
    }
    enableOpenOption(enableOpenOption) {
        this.toolbar.enableItems(this.openDocumentItem.parentElement, enableOpenOption);
    }
    enablePageNavigationTool(enablePageNavigationTool) {
        this.toolbar.enableItems(this.firstPageItem.parentElement, enablePageNavigationTool);
        this.toolbar.enableItems(this.previousPageItem.parentElement, enablePageNavigationTool);
        this.toolbar.enableItems(this.nextPageItem.parentElement, enablePageNavigationTool);
        this.toolbar.enableItems(this.lastPageItem.parentElement, enablePageNavigationTool);
        this.currentPageBox.readonly = !enablePageNavigationTool;
    }
    enableMagnificationTool(enableMagnificationTool) {
        this.toolbar.enableItems(this.zoomInItem.parentElement, enableMagnificationTool);
        this.toolbar.enableItems(this.zoomOutItem.parentElement, enableMagnificationTool);
        this.zoomDropDown.readonly = !enableMagnificationTool;
    }
    enableSelectionTool(enableSelectionTool) {
        this.toolbar.enableItems(this.textSelectItem.parentElement, enableSelectionTool);
    }
    enableScrollingTool(enableScrollingTool) {
        this.toolbar.enableItems(this.panItem.parentElement, enableScrollingTool);
    }
    enableDownloadOption(enableDownloadOption) {
        this.toolbar.enableItems(this.downloadItem.parentElement, enableDownloadOption);
    }
    enablePrintOption(enablePrintOption) {
        this.toolbar.enableItems(this.printItem.parentElement, enablePrintOption);
    }
    enableSearchOption(enableSearchOption) {
        this.toolbar.enableItems(this.textSearchItem.parentElement, enableSearchOption);
    }
    /**
     * @private
     */
    resetToolbar() {
        this.currentPageBox.min = 0;
        this.currentPageBox.value = 0;
        this.updateTotalPage();
        this.updateToolbarItems();
    }
    /**
     * @private
     */
    updateToolbarItems() {
        if (this.pdfViewerBase.pageCount === 0) {
            this.toolbar.enableItems(this.downloadItem.parentElement, false);
            this.toolbar.enableItems(this.printItem.parentElement, false);
            this.updateNavigationButtons();
            this.toolbar.enableItems(this.zoomInItem.parentElement, false);
            this.toolbar.enableItems(this.zoomOutItem.parentElement, false);
            if (this.pdfViewer.magnificationModule) {
                this.zoomDropDown.readonly = true;
            }
            this.toolbar.enableItems(this.pdfViewerBase.getElement('_currentPageInputContainer'), false);
            this.toolbar.enableItems(this.pdfViewerBase.getElement('_zoomDropDownContainer'), false);
            this.toolbar.enableItems(this.textSelectItem.parentElement, false);
            this.toolbar.enableItems(this.panItem.parentElement, false);
            this.toolbar.enableItems(this.textSearchItem.parentElement, false);
        }
        else if (this.pdfViewerBase.pageCount > 0) {
            this.toolbar.enableItems(this.downloadItem.parentElement, true);
            this.toolbar.enableItems(this.printItem.parentElement, true);
            this.toolbar.enableItems(this.pdfViewerBase.getElement('_currentPageInputContainer'), true);
            this.toolbar.enableItems(this.pdfViewerBase.getElement('_zoomDropDownContainer'), true);
            this.updateNavigationButtons();
            this.updateZoomButtons();
            if (this.pdfViewer.magnificationModule) {
                this.zoomDropDown.readonly = false;
            }
            this.updateInteractionItems();
            if (this.pdfViewer.textSearchModule && this.pdfViewer.enableTextSearch) {
                this.toolbar.enableItems(this.textSearchItem.parentElement, true);
            }
        }
    }
    /**
     * @private
     */
    updateNavigationButtons() {
        if (this.pdfViewer.navigationModule && !this.isPageNavigationToolDisabled) {
            if (this.pdfViewerBase.pageCount === 0 || (this.pdfViewerBase.currentPageNumber === 1 && this.pdfViewerBase.pageCount === 1)) {
                this.toolbar.enableItems(this.firstPageItem.parentElement, false);
                this.toolbar.enableItems(this.previousPageItem.parentElement, false);
                this.toolbar.enableItems(this.nextPageItem.parentElement, false);
                this.toolbar.enableItems(this.lastPageItem.parentElement, false);
            }
            else if (this.pdfViewerBase.currentPageNumber === 1 && this.pdfViewerBase.pageCount > 0) {
                this.toolbar.enableItems(this.firstPageItem.parentElement, false);
                this.toolbar.enableItems(this.previousPageItem.parentElement, false);
                this.toolbar.enableItems(this.nextPageItem.parentElement, true);
                this.toolbar.enableItems(this.lastPageItem.parentElement, true);
            }
            else if (this.pdfViewerBase.currentPageNumber === this.pdfViewerBase.pageCount && this.pdfViewerBase.pageCount > 0) {
                this.toolbar.enableItems(this.firstPageItem.parentElement, true);
                this.toolbar.enableItems(this.previousPageItem.parentElement, true);
                this.toolbar.enableItems(this.nextPageItem.parentElement, false);
                this.toolbar.enableItems(this.lastPageItem.parentElement, false);
            }
            else if (this.pdfViewerBase.currentPageNumber > 1 && this.pdfViewerBase.currentPageNumber < this.pdfViewerBase.pageCount) {
                this.toolbar.enableItems(this.firstPageItem.parentElement, true);
                this.toolbar.enableItems(this.previousPageItem.parentElement, true);
                this.toolbar.enableItems(this.nextPageItem.parentElement, true);
                this.toolbar.enableItems(this.lastPageItem.parentElement, true);
            }
        }
        else {
            this.toolbar.enableItems(this.firstPageItem.parentElement, false);
            this.toolbar.enableItems(this.previousPageItem.parentElement, false);
            this.toolbar.enableItems(this.nextPageItem.parentElement, false);
            this.toolbar.enableItems(this.lastPageItem.parentElement, false);
            this.currentPageBox.readonly = true;
        }
    }
    /**
     * @private
     */
    updateZoomButtons() {
        if (this.pdfViewer.magnificationModule && !this.isMagnificationToolDisabled) {
            if (this.pdfViewer.magnificationModule.zoomFactor <= 0.5) {
                this.toolbar.enableItems(this.zoomInItem.parentElement, true);
                this.toolbar.enableItems(this.zoomOutItem.parentElement, false);
            }
            else if (this.pdfViewer.magnificationModule.zoomFactor >= 4) {
                this.toolbar.enableItems(this.zoomInItem.parentElement, false);
                this.toolbar.enableItems(this.zoomOutItem.parentElement, true);
            }
            else {
                this.toolbar.enableItems(this.zoomInItem.parentElement, true);
                this.toolbar.enableItems(this.zoomOutItem.parentElement, true);
            }
        }
    }
    /**
     * @private
     */
    destroy() {
        this.unWireEvent();
        this.toolbar.destroy();
        this.toolbarElement.remove();
    }
    /**
     * @private
     */
    updateCurrentPage(pageIndex) {
        if (this.currentPageBox.value === pageIndex) {
            this.currentPageBoxElement.value = pageIndex.toString();
        }
        this.currentPageBox.value = pageIndex;
        this.pdfViewerBase.currentPageNumber = pageIndex;
    }
    /**
     * @private
     */
    updateTotalPage() {
        if (this.pdfViewerBase.pageCount > 0) {
            this.currentPageBox.min = 1;
        }
        this.totalPageItem.textContent = 'of ' + this.pdfViewerBase.pageCount.toString();
    }
    /**
     * @private
     */
    openFileDialogBox(event) {
        event.preventDefault();
        this.fileInputElement.click();
    }
    createToolbar(controlWidth) {
        // tslint:disable-next-line:max-line-length
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_toolbarContainer', className: 'e-pv-toolbar' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
        this.itemsContainer = createElement('div', { id: this.pdfViewer.element.id + '_toolbarItemsContainer' });
        // tslint:disable-next-line:max-line-length
        let openButtonContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_open', this.pdfViewer.localeObj.getConstant('Open'), 'e-pv-open-document');
        this.openDocumentItem = openButtonContainer.firstChild;
        this.itemsContainer.appendChild(openButtonContainer);
        this.toolbarElement.appendChild(this.itemsContainer);
        let seperatorDiv1 = createElement('div', { className: 'e-separator' });
        this.itemsContainer.appendChild(seperatorDiv1);
        // tslint:disable-next-line:max-line-length
        let firstPageContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_firstPage', this.pdfViewer.localeObj.getConstant('Go To First Page'), 'e-pv-first-page-navigation');
        this.firstPageItem = firstPageContainer.firstChild;
        this.itemsContainer.appendChild(firstPageContainer);
        // tslint:disable-next-line:max-line-length
        let previousContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_previousPage', this.pdfViewer.localeObj.getConstant('Previous Page'), 'e-pv-previous-page-navigation');
        this.previousPageItem = previousContainer.firstChild;
        this.itemsContainer.appendChild(previousContainer);
        // tslint:disable-next-line:max-line-length
        let nextContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_nextPage', this.pdfViewer.localeObj.getConstant('Next Page'), 'e-pv-next-page-navigation');
        this.nextPageItem = nextContainer.firstChild;
        this.itemsContainer.appendChild(nextContainer);
        // tslint:disable-next-line:max-line-length
        let lastPageContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_lastPage', this.pdfViewer.localeObj.getConstant('Go To Last Page'), 'e-pv-last-page-navigation');
        this.lastPageItem = lastPageContainer.firstChild;
        this.itemsContainer.appendChild(lastPageContainer);
        // tslint:disable-next-line:max-line-length
        let goToPageContainer = this.createToolbarItem('input', this.pdfViewer.element.id + '_currentPageInput', this.pdfViewer.localeObj.getConstant('Page Number'), null);
        this.itemsContainer.appendChild(goToPageContainer);
        this.currentPageBox = new NumericTextBox({ value: 0, format: '##', cssClass: 'e-pv-current-page-box', showSpinButton: false });
        this.currentPageBoxElement = goToPageContainer.firstChild;
        this.currentPageBox.appendTo(this.currentPageBoxElement);
        // tslint:disable-next-line:max-line-length
        let totalPageContainer = this.createToolbarItem('span', this.pdfViewer.element.id + '_totalPage', null, 'e-pv-total-page');
        this.totalPageItem = totalPageContainer.firstChild;
        this.itemsContainer.appendChild(totalPageContainer);
        this.updateTotalPage();
        let seperatorDiv2 = createElement('div', { className: 'e-separator' });
        this.itemsContainer.appendChild(seperatorDiv2);
        // tslint:disable-next-line:max-line-length
        let zoomOutContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_zoomOut', this.pdfViewer.localeObj.getConstant('Zoom Out'), 'e-pv-zoom-out');
        this.zoomOutItem = zoomOutContainer.firstChild;
        this.itemsContainer.appendChild(zoomOutContainer);
        // tslint:disable-next-line:max-line-length
        let zoomInContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_zoomIn', this.pdfViewer.localeObj.getConstant('Zoom In'), 'e-pv-zoom-in');
        this.zoomInItem = zoomInContainer.firstChild;
        this.itemsContainer.appendChild(zoomInContainer);
        // tslint:disable-next-line:max-line-length
        let zoomDropdownContainer = this.createToolbarItem('input', this.pdfViewer.element.id + '_zoomDropDown', this.pdfViewer.localeObj.getConstant('Zoom'), null);
        zoomDropdownContainer.className = zoomDropdownContainer.className + ' e-pv-zoom-drop-down-container';
        this.zoomDropdownItem = zoomDropdownContainer.firstChild;
        this.itemsContainer.appendChild(zoomDropdownContainer);
        let seperatorDiv3 = createElement('div', { className: 'e-separator' });
        this.itemsContainer.appendChild(seperatorDiv3);
        // tslint:disable-next-line:max-line-length
        let selectToolContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_selectTool', this.pdfViewer.localeObj.getConstant('Text Selection'), 'e-pv-text-select-tool');
        this.textSelectItem = selectToolContainer.firstChild;
        this.itemsContainer.appendChild(selectToolContainer);
        // tslint:disable-next-line:max-line-length
        let handToolContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_handTool', this.pdfViewer.localeObj.getConstant('Panning'), 'e-pv-pan-tool');
        this.panItem = handToolContainer.firstChild;
        this.itemsContainer.appendChild(handToolContainer);
        // tslint:disable-next-line:max-line-length
        let searchButtonContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_search', this.pdfViewer.localeObj.getConstant('Text Search'), 'e-pv-text-search');
        this.textSearchItem = searchButtonContainer.firstChild;
        this.itemsContainer.appendChild(searchButtonContainer);
        searchButtonContainer.style.position = 'absolute';
        // tslint:disable-next-line:max-line-length
        let downloadButtonContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_download', this.pdfViewer.localeObj.getConstant('Download'), 'e-pv-download-document');
        this.downloadItem = downloadButtonContainer.firstChild;
        downloadButtonContainer.style.position = 'absolute';
        // tslint:disable-next-line:max-line-length
        downloadButtonContainer.style.left = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft()) + 'px';
        this.itemsContainer.appendChild(downloadButtonContainer);
        // tslint:disable-next-line:max-line-length
        let printButtonContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_print', this.pdfViewer.localeObj.getConstant('Print'), 'e-pv-print-document');
        this.printItem = printButtonContainer.firstChild;
        printButtonContainer.style.position = 'absolute';
        if (downloadButtonContainer !== undefined) { // tslint:disable-next-line:max-line-length
            printButtonContainer.style.left = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft() - 43) + 'px';
        }
        else { // tslint:disable-next-line:max-line-length
            printButtonContainer.style.left = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft()) + 'px';
        } // tslint:disable-next-line:max-line-length
        searchButtonContainer.style.left = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft() - downloadButtonContainer.clientWidth - printButtonContainer.clientWidth - 54) + 'px';
        this.itemsContainer.appendChild(printButtonContainer);
        // tslint:disable-next-line:max-line-length
        let items = [{ percent: '50%', id: '0' }, { percent: '75%', id: '1' }, { percent: '100%', id: '2' }, { percent: '125%', id: '3' },
            // tslint:disable-next-line:max-line-length
            { percent: '150%', id: '4' }, { percent: '200%', id: '5' }, { percent: '400%', id: '6' }, { percent: this.pdfViewer.localeObj.getConstant('Fit Page'), id: '7' }, { percent: this.pdfViewer.localeObj.getConstant('Fit Width'), id: '8' }, { percent: this.pdfViewer.localeObj.getConstant('Automatic'), id: '9' }
        ];
        // tslint:disable-next-line:max-line-length
        this.zoomDropDown = new ComboBox({ dataSource: items, text: '100%', fields: { text: 'percent', value: 'id' }, readonly: true, cssClass: 'e-pv-zoom-drop-down', popupHeight: '402px', showClearButton: false });
        this.zoomDropDown.appendTo(this.zoomDropdownItem);
        this.toolbar = new Toolbar({ clicked: this.toolbarClickHandler, width: '', height: '', overflowMode: 'Popup' });
        this.toolbar.appendTo(this.toolbarElement);
        this.toolbarElement.addEventListener('keydown', this.onToolbarKeydown);
        return this.toolbarElement;
    }
    createToolbarItem(elementName, id, tooltipText, className) {
        let containerElement = createElement('div', { id: id + 'Container' });
        let toolbarItem = createElement(elementName, { id: id });
        if (className !== null) {
            containerElement.className = className + '-container e-overflow-show e-popup-text';
            toolbarItem.className = className;
        }
        if (elementName === 'button' && id !== this.pdfViewer.element.id + '_zoomDropDown') {
            toolbarItem.className = 'e-btn e-tbar-btn e-icon-btn e-pv-tbar-btn ' + className;
            let buttonSpan = createElement('span', { id: id + 'Icon', className: className + '-icon e-pv-icon' });
            toolbarItem.appendChild(buttonSpan);
        }
        else if (elementName === 'input' && id !== this.pdfViewer.element.id + '_zoomDropDown') {
            toolbarItem.type = 'text';
        }
        containerElement.appendChild(toolbarItem);
        if (tooltipText !== null) {
            // tslint:disable-next-line
            let tooltip = new Tooltip({ content: tooltipText, opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
            tooltip.appendTo(toolbarItem);
        }
        return containerElement;
    }
    onTooltipBeforeOpen(args) {
        if (!this.pdfViewer.toolbarSettings.showTooltip) {
            args.cancel = true;
        }
    }
    createFileElement(toolbarElement) {
        // tslint:disable-next-line:max-line-length
        this.fileInputElement = createElement('input', { id: this.pdfViewer.element.id + '_fileUploadElement', styles: 'position:fixed; left:-100em', attrs: { 'type': 'file' } });
        this.fileInputElement.setAttribute('accept', '.pdf');
        toolbarElement.appendChild(this.fileInputElement);
    }
    wireEvent() {
        this.toolbarElement.addEventListener('mouseup', this.toolbarOnMouseup.bind(this));
        this.fileInputElement.addEventListener('change', this.loadDocument);
        this.currentPageBoxElement.addEventListener('focusout', this.textBoxFocusOut);
        this.currentPageBoxElement.addEventListener('keypress', this.navigateToPage);
        this.zoomDropDown.change = this.zoomPercentSelect.bind(this);
        this.zoomDropDown.element.addEventListener('keypress', this.onZoomDropDownInput.bind(this));
        this.zoomDropDown.element.addEventListener('click', this.onZoomDropDownInputClick.bind(this));
    }
    unWireEvent() {
        this.toolbarElement.removeEventListener('mouseup', this.toolbarOnMouseup.bind(this));
        this.fileInputElement.removeEventListener('change', this.loadDocument);
        this.currentPageBoxElement.removeEventListener('focusout', this.textBoxFocusOut);
        this.currentPageBoxElement.removeEventListener('keypress', this.navigateToPage);
        this.zoomDropDown.removeEventListener('change', this.zoomPercentSelect);
        this.zoomDropDown.element.removeEventListener('keypress', this.onZoomDropDownInput);
        this.zoomDropDown.element.removeEventListener('click', this.onZoomDropDownInputClick);
    }
    /**
     * @private
     */
    onToolbarResize(viewerWidth) {
        let navigationToolbar = document.getElementById(this.pdfViewer.element.id + '_toolbarContainer_nav');
        let downloadButtonElement = document.getElementById(this.pdfViewer.element.id + '_downloadContainer');
        let printButtonElement = document.getElementById(this.pdfViewer.element.id + '_printContainer');
        let searchButtonElement = document.getElementById(this.pdfViewer.element.id + '_searchContainer');
        if (!navigationToolbar) {
            if (downloadButtonElement) {
                downloadButtonElement.style.left = viewerWidth + 'px';
                downloadButtonElement.style.position = 'absolute';
            }
            if (printButtonElement) {
                if (downloadButtonElement !== null) {
                    // calculate the print Icon left Position value
                    printButtonElement.style.left = (viewerWidth - downloadButtonElement.clientWidth) + 'px';
                    printButtonElement.style.position = 'absolute';
                }
                else {
                    printButtonElement.style.left = viewerWidth + 'px';
                    printButtonElement.style.position = 'absolute';
                }
            }
            if (searchButtonElement) {
                searchButtonElement.style.position = 'absolute';
                if (printButtonElement !== null) {
                    // calculate the search Icon left Position value
                    searchButtonElement.style.left = (parseFloat(printButtonElement.style.left) - printButtonElement.clientWidth) + 'px';
                }
                else if (downloadButtonElement !== null) {
                    // tslint:disable-next-line:max-line-length
                    searchButtonElement.style.left = (parseFloat(downloadButtonElement.style.left) - downloadButtonElement.clientWidth) + 'px';
                }
                else {
                    searchButtonElement.style.left = viewerWidth + 'px';
                }
            }
        }
    }
    toolbarOnMouseup(event) {
        if (event.target === this.itemsContainer || event.target === this.toolbarElement) {
            this.pdfViewerBase.focusViewerContainer();
        }
    }
    applyHideToToolbar(show, startIndex, endIndex) {
        let isHide = !show;
        for (let index = startIndex; index <= endIndex; index++) {
            this.toolbar.hideItem(index, isHide);
        }
    }
    onZoomDropDownInput(event) {
        if ((event.which < 48 || event.which > 57) && event.which !== 8 && event.which !== 13) {
            event.preventDefault();
            return false;
        }
        else {
            if (event.which === 13) {
                event.preventDefault();
                let value = this.zoomDropDown.element.value;
                this.zoomDropDownChange(value);
            }
            return true;
        }
    }
    onZoomDropDownInputClick() {
        this.zoomDropDown.element.select();
    }
    zoomPercentSelect(args) {
        if (this.pdfViewerBase.pageCount > 0) {
            if (args.isInteracted) {
                if (args.itemData) {
                    // tslint:disable-next-line:no-any
                    let zoomText = args.itemData.percent;
                    this.zoomDropDownChange(zoomText);
                }
            }
            else {
                this.updateZoomPercentage(this.pdfViewer.magnificationModule.zoomFactor);
            }
        }
    }
    zoomDropDownChange(zoomText) {
        // tslint:disable-next-line:max-line-length
        if (zoomText !== this.pdfViewer.localeObj.getConstant('Fit Width') && zoomText !== this.pdfViewer.localeObj.getConstant('Fit Page') && zoomText !== this.pdfViewer.localeObj.getConstant('Automatic')) {
            this.pdfViewer.magnificationModule.isAutoZoom = false;
            this.pdfViewer.magnificationModule.zoomTo(parseFloat(zoomText));
            this.zoomDropDown.focusOut();
        }
        else if (zoomText === this.pdfViewer.localeObj.getConstant('Fit Width')) {
            this.pdfViewer.magnificationModule.isAutoZoom = false;
            this.pdfViewer.magnificationModule.fitToWidth();
            this.zoomDropDown.focusOut();
        }
        else if (zoomText === this.pdfViewer.localeObj.getConstant('Fit Page')) {
            this.pdfViewer.magnificationModule.fitToPage();
            this.zoomDropDown.focusOut();
        }
        else if (zoomText === this.pdfViewer.localeObj.getConstant('Automatic')) {
            this.pdfViewer.magnificationModule.isAutoZoom = true;
            this.pdfViewer.magnificationModule.fitToAuto();
            this.zoomDropDown.focusOut();
        }
    }
    /**
     * @private
     */
    updateZoomPercentage(zoomFactor) {
        // tslint:disable-next-line
        let currentPercent = parseInt((zoomFactor * 100).toString()) + '%';
        if (this.zoomDropDown.text === currentPercent) {
            this.zoomDropDown.element.value = currentPercent;
        }
        if (this.zoomDropDown.index === 9) {
            this.zoomDropDown.value = 2;
        }
        // tslint:disable-next-line
        this.zoomDropDown.text = currentPercent;
    }
    updateInteractionItems() {
        if (this.pdfViewer.textSelectionModule) {
            if (this.pdfViewer.enableTextSelection) {
                this.toolbar.enableItems(this.textSelectItem.parentElement, true);
            }
            else {
                this.toolbar.enableItems(this.textSelectItem.parentElement, false);
            }
        }
        else {
            this.toolbar.enableItems(this.textSelectItem.parentElement, false);
        }
        this.toolbar.enableItems(this.panItem.parentElement, true);
        if (this.pdfViewer.interactionMode === 'TextSelection') {
            this.selectItem(this.textSelectItem);
            this.deSelectItem(this.panItem);
        }
        else {
            this.selectItem(this.panItem);
            this.deSelectItem(this.textSelectItem);
            this.pdfViewerBase.initiatePanning();
        }
    }
    /**
     * @private
     */
    textSearchButtonHandler() {
        if (this.pdfViewer.textSearchModule && this.pdfViewerBase.pageCount > 0) {
            this.isTextSearchBoxDisplayed = !this.isTextSearchBoxDisplayed;
            this.pdfViewer.textSearchModule.showSearchBox(this.isTextSearchBoxDisplayed);
            if (this.isTextSearchBoxDisplayed) {
                this.selectItem(this.textSearchItem);
                // tslint:disable-next-line:max-line-length
                let searchInputElement = document.getElementById(this.pdfViewer.element.id + '_search_input');
                searchInputElement.select();
                searchInputElement.focus();
            }
            else {
                this.deSelectItem(this.textSearchItem);
            }
        }
    }
    selectItem(element) {
        element.classList.add('e-pv-select');
    }
    deSelectItem(element) {
        element.classList.remove('e-pv-select');
    }
    updateInteractionTools(isTextSelect) {
        if (isTextSelect) {
            this.selectItem(this.textSelectItem);
            this.deSelectItem(this.panItem);
        }
        else {
            this.selectItem(this.panItem);
            this.deSelectItem(this.textSelectItem);
        }
    }
    initialEnableItems() {
        if (this.pdfViewer.enableToolbar) {
            this.showToolbar(true);
        }
        else {
            this.showToolbar(false);
        }
        if (this.pdfViewer.enablePrint) {
            this.showPrintOption(true);
        }
        else {
            this.showPrintOption(false);
        }
        if (this.pdfViewer.enableDownload) {
            this.showDownloadOption(true);
        }
        else {
            this.showDownloadOption(false);
        }
        if (this.pdfViewer.enableTextSearch) {
            this.showSearchOption(true);
        }
        else {
            this.showSearchOption(false);
        }
    }
    showSeparator(toolbarItems) {
        if (!this.isOpenBtnVisible || (!this.isNavigationToolVisible && this.isOpenBtnVisible && this.isDownloadBtnVisible
            && this.isPrintBtnVisible) || (this.isOpenBtnVisible && toolbarItems.length === 1)) {
            this.applyHideToToolbar(false, 1, 1);
        }
        if ((!this.isNavigationToolVisible || !this.isMagnificationToolVisible) && !this.isOpenBtnVisible) {
            this.applyHideToToolbar(false, 8, 8);
        }
        if ((!this.isMagnificationToolVisible && !this.isSelectionBtnVisible && !this.isScrollingBtnVisible) ||
            (this.isMagnificationToolVisible && (!this.isSelectionBtnVisible && !this.isScrollingBtnVisible)) ||
            (!this.isMagnificationToolVisible && (this.isSelectionBtnVisible && this.isScrollingBtnVisible))) {
            this.applyHideToToolbar(false, 12, 12);
        }
    }
    applyToolbarSettings() {
        let toolbarSettingsItems = this.pdfViewer.toolbarSettings.toolbarItem;
        if (toolbarSettingsItems.indexOf('OpenOption') !== -1) {
            this.showOpenOption(true);
        }
        else {
            this.showOpenOption(false);
        }
        if (toolbarSettingsItems.indexOf('PageNavigationTool') !== -1) {
            this.showPageNavigationTool(true);
        }
        else {
            this.showPageNavigationTool(false);
        }
        if (toolbarSettingsItems.indexOf('MagnificationTool') !== -1) {
            this.showMagnificationTool(true);
        }
        else {
            this.showMagnificationTool(false);
        }
        if (toolbarSettingsItems.indexOf('SelectionTool') !== -1) {
            this.showSelectionTool(true);
        }
        else {
            this.showSelectionTool(false);
        }
        if (toolbarSettingsItems.indexOf('PanTool') !== -1) {
            this.showScrollingTool(true);
        }
        else {
            this.showScrollingTool(false);
        }
        if (toolbarSettingsItems.indexOf('PrintOption') !== -1) {
            this.showPrintOption(true);
        }
        else {
            this.showPrintOption(false);
        }
        if (toolbarSettingsItems.indexOf('DownloadOption') !== -1) {
            this.showDownloadOption(true);
        }
        else {
            this.showDownloadOption(false);
        }
        if (toolbarSettingsItems.indexOf('SearchOption') !== -1) {
            this.showSearchOption(true);
        }
        else {
            this.showSearchOption(false);
        }
        this.showSeparator(toolbarSettingsItems);
    }
    /**
     * @private
     */
    getModuleName() {
        return 'Toolbar';
    }
}

/**
 * export types
 */

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * The `ToolbarSettings` module is used to provide the toolbar settings of PDF viewer.
 * @hidden
 */
class ToolbarSettings extends ChildProperty {
}
__decorate([
    Property(true)
], ToolbarSettings.prototype, "showTooltip", void 0);
__decorate([
    Property()
], ToolbarSettings.prototype, "toolbarItem", void 0);
/**
 * The `ServerActionSettings` module is used to provide the server action methods of PDF viewer.
 * @hidden
 */
class ServerActionSettings extends ChildProperty {
}
__decorate([
    Property('Load')
], ServerActionSettings.prototype, "load", void 0);
__decorate([
    Property('Unload')
], ServerActionSettings.prototype, "unload", void 0);
__decorate([
    Property('RenderPdfPages')
], ServerActionSettings.prototype, "renderPages", void 0);
__decorate([
    Property('RenderPdfPages')
], ServerActionSettings.prototype, "print", void 0);
__decorate([
    Property('Download')
], ServerActionSettings.prototype, "download", void 0);
__decorate([
    Property('RenderThumbnailImages')
], ServerActionSettings.prototype, "renderThumbnail", void 0);
/**
 * Represents the PDF viewer component.
 * ```html
 * <div id="pdfViewer"></div>
 * <script>
 *  var pdfViewerObj = new PdfViewer();
 *  pdfViewerObj.appendTo("#pdfViewer");
 * </script>
 * ```
 */
let PdfViewer = class PdfViewer extends Component {
    constructor(options, element) {
        super(options, element);
        /**
         * Gets or sets the document name loaded in the PdfViewer control.
         */
        this.fileName = null;
        /** @hidden */
        this.defaultLocale = {
            'PdfViewer': 'PDF Viewer',
            'Cancel': 'Cancel',
            'Download': 'Download file',
            'Enter Password': 'This document is password protected. Please enter a password.',
            'File Corrupted': 'File Corrupted',
            'File Corrupted Content': 'The file is corrupted and cannot be opened.',
            'Fit Page': 'Fit Page',
            'Fit Width': 'Fit Width',
            'Automatic': 'Automatic',
            'Go To First Page': 'Show first page',
            'Invalid Password': 'Incorrect Password. Please try again.',
            'Next Page': 'Show next page',
            'OK': 'OK',
            'Open': 'Open file',
            'Page Number': 'Current page number',
            'Previous Page': 'Show previous page',
            'Go To Last Page': 'Show last page',
            'Zoom': 'Zoom',
            'Zoom In': 'Zoom in',
            'Zoom Out': 'Zoom out',
            'Page Thumbnails': 'Page thumbnails',
            'Bookmarks': 'Bookmarks',
            'Print': 'Print file',
            'Password Protected': 'Password Required',
            'Copy': 'Copy',
            'Text Selection': 'Text selection tool',
            'Panning': 'Pan mode',
            'Text Search': 'Find text',
            'Find in document': 'Find in document',
            'Match case': 'Match case',
            // tslint:disable-next-line:max-line-length
            'No matches': 'Viewer has finished searching the document. No more matches were found',
            // tslint:disable-next-line:max-line-length
            'Server error': 'Web-service is not listening. PDF Viewer depends on web-service for all it\'s features. Please start the web service to continue.'
        };
        this.viewerBase = new PdfViewerBase(this);
    }
    /**
     * Returns the page count of the document loaded in the PdfViewer control.
     */
    get pageCount() {
        return this.viewerBase.pageCount;
    }
    /**
     * Returns the current page number of the document displayed in the PdfViewer control.
     */
    get currentPageNumber() {
        return this.viewerBase.currentPageNumber;
    }
    /**
     * Returns the current zoom percentage of the PdfViewer control.
     */
    get zoomPercentage() {
        return this.magnificationModule.zoomFactor * 100;
    }
    /**
     * Gets the bookmark view object of the pdf viewer.
     * @returns { BookmarkView }
     */
    get bookmark() {
        return this.bookmarkViewModule;
    }
    /**
     * Gets the print object of the pdf viewer.
     * @returns { Print }
     */
    get print() {
        return this.printModule;
    }
    /**
     * Gets the magnification object of the pdf viewer.
     * @returns { Magnification }
     */
    get magnification() {
        return this.magnificationModule;
    }
    /**
     * Gets the navigation object of the pdf viewer.
     * @returns { Navigation }
     */
    get navigation() {
        return this.navigationModule;
    }
    /**
     * Gets the text search object of the pdf viewer.
     * @returns { TextSearch }
     */
    get textSearch() {
        return this.textSearchModule;
    }
    /**
     * Gets the toolbar object of the pdf viewer.
     * @returns { Toolbar }
     */
    get toolbar() {
        return this.toolbarModule;
    }
    preRender() {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    }
    render() {
        this.viewerBase.initializeComponent();
        if (this.enableTextSelection && this.textSelectionModule) {
            this.textSelectionModule.enableTextSelectionMode();
        }
        else {
            this.viewerBase.disableTextSelectionMode();
        }
    }
    getModuleName() {
        return 'PdfViewer';
    }
    /**
     * @private
     */
    getLocaleConstants() {
        return this.defaultLocale;
    }
    onPropertyChanged(newProp, oldProp) {
        if (this.isDestroyed) {
            return;
        }
        let properties = Object.keys(newProp);
        for (let prop of properties) {
            switch (prop) {
                case 'enableToolbar':
                    this.notify('', { module: 'toolbar', enable: this.enableToolbar });
                    
                    break;
            }
        }
    }
    getPersistData() {
        return 'PdfViewer';
    }
    requiredModules() {
        let modules = [];
        if (this.enableMagnification) {
            modules.push({
                member: 'Magnification', args: [this, this.viewerBase]
            });
        }
        if (this.enableNavigation) {
            modules.push({
                member: 'Navigation', args: [this, this.viewerBase]
            });
        }
        if (this.enableToolbar) {
            modules.push({
                member: 'Toolbar', args: [this, this.viewerBase]
            });
        }
        if (this.enableHyperlink) {
            modules.push({
                member: 'LinkAnnotation', args: [this, this.viewerBase]
            });
        }
        if (this.enableThumbnail) {
            modules.push({
                member: 'ThumbnailView', args: [this, this.viewerBase]
            });
        }
        if (this.enableBookmark) {
            modules.push({
                member: 'BookmarkView', args: [this, this.viewerBase]
            });
        }
        if (this.enableTextSelection) {
            modules.push({
                member: 'TextSelection', args: [this, this.viewerBase]
            });
        }
        if (this.enableTextSearch) {
            modules.push({
                member: 'TextSearch', args: [this, this.viewerBase]
            });
        }
        if (this.enablePrint) {
            modules.push({
                member: 'Print', args: [this, this.viewerBase]
            });
        }
        return modules;
    }
    // /**
    //  * Shows /hides the toolbar in the PdfViewer
    //  * @param  {boolean} enableToolbar
    //  * @returns void
    //  */
    // public showToolbar(enableToolbar: boolean): void {
    //     this.toolbarModule.showToolbar(enableToolbar);
    // }
    // /**
    //  * Shows /hides the the toolbar items in the PdfViewer
    //  * @param  {string[]} items
    //  * @param  {boolean} isVisible
    //  * @returns void
    //  */
    // public showToolbarItem(items: ToolbarItem[], isVisible: boolean): void {
    //     if (this.toolbarModule) {
    //         this.toolbarModule.showToolbarItem(items, isVisible);
    //     }
    // }
    // /**
    //  * Enables /disables the the toolbar items in the PdfViewer
    //  * @param  {string[]} items
    //  * @param  {boolean} isEnable
    //  * @returns void
    //  */
    // public enableToolbarItem(items: ToolbarItem[], isEnable: boolean): void {
    //     if (this.toolbarModule) {
    //         this.toolbarModule.enableToolbarItem(items, isEnable);
    //     }
    // }
    // /**
    //  * Navigate to given Page number
    //  * Note : In case if we have provided incorrect page number as argument it will retain the existing page
    //  * @param  {number} pageNumber
    //  * @returns void
    //  */
    // public goToPage(pageNumber: number): void {
    //     this.navigationModule.goToPage(pageNumber);
    // }
    // /**
    //  * Navigate to First page of the PDF document
    //  * @returns void
    //  */
    // public goToFirstPage(): void {
    //     this.navigationModule.goToFirstPage();
    // }
    // /**
    //  * Navigate to Previous page of the PDF document
    //  * @returns void
    //  */
    // public goToPreviousPage(): void {
    //     this.navigationModule.goToPreviousPage();
    // }
    // /**
    //  * Navigate to Next page of the PDF document
    //  * @returns void
    //  */
    // public goToNextPage(): void {
    //     this.navigationModule.goToNextPage();
    // }
    // /**
    //  * Navigate to Last page of the PDF document
    //  * @returns void
    //  */
    // public goToLastPage(): void {
    //     this.navigationModule.goToLastPage();
    // }
    // /**
    //  * Zoom the PDF document to the given zoom value
    //  * @param  {number} zoomValue
    //  * @returns void
    //  */
    // public zoomTo(zoomValue: number): void {
    //     if (this.viewerBase.pageCount !== 0) {
    //         this.magnificationModule.zoomTo(zoomValue);
    //     }
    // }
    // /**
    //  * Magnifies the page to the next value in the zoom drop down list.
    //  * @returns void
    //  */
    // public zoomIn(): void {
    //     this.magnificationModule.zoomIn();
    // }
    // /**
    //  * Magnifies the page to the previous value in the zoom drop down list.
    //  * @returns void
    //  */
    // public zoomOut(): void {
    //     this.magnificationModule.zoomOut();
    // }
    // /**
    //  * Scales the page to fit the page in the container in the control.
    //  * @param  {number} zoomValue
    //  * @returns void
    //  */
    // public fitToPage(): void {
    //     this.magnificationModule.fitToPage();
    // }
    // /**
    //  * Scales the page to fit the page width to the width of the container in the control.
    //  * @returns void
    //  */
    // public fitToWidth(): void {
    //     this.magnificationModule.fitToWidth();
    // }
    /**
     * Loads the given PDF document in the PDF viewer control
     * @param  {string} document
     * @param  {string} password
     * @returns void
     */
    load(document, password) {
        if (this.viewerBase.pageCount !== 0) {
            this.viewerBase.clear(true);
        }
        else {
            this.viewerBase.clear(false);
        }
        this.viewerBase.pageCount = 0;
        this.viewerBase.currentPageNumber = 0;
        if (this.toolbarModule) {
            this.toolbarModule.resetToolbar();
        }
        this.viewerBase.initiatePageRender(document, password);
    }
    // /**
    //  * Display Bookmarks the PDF Document being loaded in the ejPdfViewer control
    //  * @returns any
    //  */
    // // tslint:disable-next-line
    // public getBookmarks(): any {
    //     if (this.enableBookmark) {
    //         // tslint:disable-next-line:max-line-length
    //         return { bookmarks: this.bookmarkViewModule.bookmarks , bookmarksDestination: this.bookmarkViewModule.bookmarksDestination };
    //     }
    // }
    // /**
    //  * Navigate To current Bookmark Location the PDF document being loaded in the ejPdfViewer control.
    //  * @returns void
    //  */
    // public navigateBookmark(pageIndex: number, Y: number): void {
    //     this.bookmarkViewModule.navigateTo(pageIndex, Y);
    // }
    /**
     * Downloads the PDF document being loaded in the ejPdfViewer control.
     * @returns void
     */
    download() {
        if (this.enableDownload) {
            this.viewerBase.download();
        }
    }
    // /**
    //  * Print the PDF document being loaded in the ejPdfViewer control.
    //  * @returns void
    //  */
    // public print(): void {
    //     if (this.enablePrint) {
    //         this.printModule.print();
    //     }
    // }
    // /**
    //  * Searches the target text in the PDF document and highlights the occurrences in the pages
    //  * @param  {string} searchText
    //  * @param  {boolean} isMatchCase
    //  * @returns void
    //  */
    // public searchText(searchText: string, isMatchCase: boolean): void {
    //     if (this.textSearchModule) {
    //         this.textSearchModule.searchText(searchText, isMatchCase);
    //     }
    // }
    // /**
    //  * Searches the next occurrence of the searched text from the current occurrence of the PdfViewer. 
    //  * @returns void
    //  */
    // public searchNext(): void {
    //     if (this.textSearchModule) {
    //         this.textSearchModule.searchNext();
    //     }
    // }
    // /**
    //  * Searches the previous occurrence of the searched text from the current occurrence of the PdfViewer. 
    //  * @returns void
    //  */
    // public searchPrevious(): void {
    //     if (this.textSearchModule) {
    //         this.textSearchModule.searchPrevious();
    //     }
    // }
    // /**
    //  * Cancels the text search of the PdfViewer. 
    //  * @returns void
    //  */
    // public cancelTextSearch(): void {
    //     if (this.textSearchModule) {
    //         this.textSearchModule.cancelTextSearch();
    //     }
    // }
    /**
     * Unloads the PDF document being displayed in the PDF viewer.
     * @returns void
     */
    unload() {
        this.viewerBase.clear(true);
        this.viewerBase.pageCount = 0;
        this.toolbarModule.resetToolbar();
        this.magnificationModule.zoomTo(100);
    }
    /**
     * Destroys all managed resources used by this object.
     */
    destroy() {
        super.destroy();
        this.element.classList.remove('e-pdfviewer');
        if (this.toolbarModule) {
            this.toolbarModule.destroy();
        }
        while (this.element.hasChildNodes()) {
            this.element.removeChild(this.element.lastChild);
        }
        this.viewerBase.destroy();
    }
    /**
     * @private
     */
    fireDocumentLoad() {
        let eventArgs = { name: 'documentLoad', documentName: this.fileName };
        this.trigger('documentLoad', eventArgs);
    }
    /**
     * @private
     */
    fireDocumentUnload(fileName) {
        let eventArgs = { name: 'documentUnload', documentName: fileName };
        this.trigger('documentUnload', eventArgs);
    }
    /**
     * @private
     */
    fireDocumentLoadFailed(isPasswordRequired, password) {
        // tslint:disable-next-line:max-line-length
        let eventArgs = { name: 'documentLoadFailed', documentName: this.fileName, isPasswordRequired: isPasswordRequired, password: password };
        this.trigger('documentLoadFailed', eventArgs);
    }
    /**
     * @private
     */
    fireAjaxRequestFailed(errorStatusCode, errorMessage) {
        // tslint:disable-next-line:max-line-length
        let eventArgs = { name: 'ajaxRequestFailed', documentName: this.fileName, errorStatusCode: errorStatusCode, errorMessage: errorMessage };
        this.trigger('ajaxRequestFailed', eventArgs);
    }
    /**
     * @private
     */
    firePageClick(x, y, pageNumber) {
        let eventArgs = { name: 'pageClick', documentName: this.fileName, x: x, y: y, pageNumber: pageNumber };
        this.trigger('pageClick', eventArgs);
    }
    /**
     * @private
     */
    firePageChange(previousPageNumber) {
        // tslint:disable-next-line:max-line-length
        let eventArgs = { name: 'pageChange', documentName: this.fileName, currentPageNumber: this.viewerBase.currentPageNumber, previousPageNumber: previousPageNumber };
        this.trigger('pageChange', eventArgs);
    }
    /**
     * @private
     */
    fireZoomChange() {
        // tslint:disable-next-line:max-line-length
        let eventArgs = { name: 'zoomChange', zoomValue: this.magnificationModule.zoomFactor * 100, previousZoomValue: this.magnificationModule.previousZoomFactor * 100 };
        this.trigger('zoomChange', eventArgs);
    }
    /**
     * @private
     */
    fireHyperlinkClick(hyperlink) {
        // tslint:disable-next-line:max-line-length
        let eventArgs = { name: 'hyperlinkClick', hyperlink: hyperlink };
        this.trigger('hyperlinkClick', eventArgs);
    }
};
__decorate([
    Property()
], PdfViewer.prototype, "serviceUrl", void 0);
__decorate([
    Property()
], PdfViewer.prototype, "documentPath", void 0);
__decorate([
    Property('auto')
], PdfViewer.prototype, "height", void 0);
__decorate([
    Property('auto')
], PdfViewer.prototype, "width", void 0);
__decorate([
    Property(true)
], PdfViewer.prototype, "enableToolbar", void 0);
__decorate([
    Property(true)
], PdfViewer.prototype, "enableDownload", void 0);
__decorate([
    Property(true)
], PdfViewer.prototype, "enablePrint", void 0);
__decorate([
    Property(true)
], PdfViewer.prototype, "enableThumbnail", void 0);
__decorate([
    Property(true)
], PdfViewer.prototype, "enableBookmark", void 0);
__decorate([
    Property(true)
], PdfViewer.prototype, "enableHyperlink", void 0);
__decorate([
    Property('CurrentTab')
], PdfViewer.prototype, "hyperlinkOpenState", void 0);
__decorate([
    Property(true)
], PdfViewer.prototype, "enableNavigation", void 0);
__decorate([
    Property(true)
], PdfViewer.prototype, "enableMagnification", void 0);
__decorate([
    Property(true)
], PdfViewer.prototype, "enableTextSelection", void 0);
__decorate([
    Property(true)
], PdfViewer.prototype, "enableTextSearch", void 0);
__decorate([
    Property('TextSelection')
], PdfViewer.prototype, "interactionMode", void 0);
__decorate([
    Property({ showTooltip: true, toolbarItem: ['OpenOption', 'UndoRedoTool', 'PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'CommentOption', 'TextMarkupAnnotationOption', 'FreeTextAnnotationOption', 'InkAnnotationOption', 'ShapeAnnotationOption', 'StampAnnotation', 'SignatureOption', 'SearchOption', 'PrintOption', 'DownloadOption'] })
], PdfViewer.prototype, "toolbarSettings", void 0);
__decorate([
    Property({ load: 'Load', renderPages: 'RenderPdfPages', unload: 'Unload', download: 'Download', renderThumbnail: 'RenderThumbnailImages' })
], PdfViewer.prototype, "serverActionSettings", void 0);
__decorate([
    Event()
], PdfViewer.prototype, "documentLoad", void 0);
__decorate([
    Event()
], PdfViewer.prototype, "documentUnload", void 0);
__decorate([
    Event()
], PdfViewer.prototype, "documentLoadFailed", void 0);
__decorate([
    Event()
], PdfViewer.prototype, "ajaxRequestFailed", void 0);
__decorate([
    Event()
], PdfViewer.prototype, "pageClick", void 0);
__decorate([
    Event()
], PdfViewer.prototype, "pageChange", void 0);
__decorate([
    Event()
], PdfViewer.prototype, "hyperlinkClick", void 0);
__decorate([
    Event()
], PdfViewer.prototype, "zoomChange", void 0);
PdfViewer = __decorate([
    NotifyPropertyChanges
], PdfViewer);

/**
 * BookmarkView module
 */
class BookmarkView {
    /**
     * @private
     */
    constructor(pdfViewer, pdfViewerBase) {
        this.nodeClick = (args) => {
            let bookid = Number(args.nodeData.id);
            let pageIndex = this.bookmarksDestination.bookMarkDestination[bookid].PageIndex;
            let Y = this.bookmarksDestination.bookMarkDestination[bookid].Y;
            this.goToBookmark(pageIndex, Y);
            return false;
        };
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    createRequestForBookmarks() {
        let proxy = this;
        let request = new XMLHttpRequest();
        // tslint:disable-next-line:max-line-length
        let jsonObject = { hashId: this.pdfViewerBase.hashId };
        request.open('POST', proxy.pdfViewer.serviceUrl + '/Bookmarks');
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.responseType = 'json';
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        request.onreadystatechange = (event) => {
            if (request.readyState === 4 && request.status === 200) {
                this.pdfViewerBase.navigationPane.disableBookmarkButton();
                // tslint:disable-next-line
                let data = event.currentTarget.response;
                if (data) {
                    if (typeof data !== 'object') {
                        data = JSON.parse(data);
                    }
                    this.bookmarks = { bookMark: data.Bookmarks };
                    this.bookmarksDestination = { bookMarkDestination: data.BookmarksDestination };
                }
                if (this.bookmarks == null) {
                    this.pdfViewerBase.navigationPane.disableBookmarkButton();
                }
                else {
                    this.pdfViewerBase.navigationPane.enableBookmarkButton();
                }
            }
        };
        // tslint:disable-next-line
        request.onerror = (event) => {
            this.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
        };
    }
    /**
     * @private
     */
    renderBookmarkcontent() {
        if (this.bookmarkView != null) {
            this.bookmarkView.parentElement.removeChild(this.bookmarkView);
        }
        this.bookmarkView = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_view', className: 'e-pv-bookmark-view' });
        this.pdfViewerBase.navigationPane.sideBarContent.appendChild(this.bookmarkView);
        // tslint:disable-next-line:max-line-length
        let bookmarkIconView = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_iconview', className: 'e-pv-bookmark-icon-view' });
        // tslint:disable-next-line:max-line-length
        let bookmarkIcon = createElement('span', { id: this.pdfViewer.element.id + '_bookmark_icon', className: 'e-pv-bookmark-icon e-pv-icon' });
        let bookmarkTitle = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_Title', className: 'e-pv-bookmark-Title' });
        bookmarkTitle.innerText = '${Title}';
        bookmarkIconView.appendChild(bookmarkIcon);
        bookmarkIconView.appendChild(bookmarkTitle);
        // tslint:disable-next-line:max-line-length
        let treeObj = new TreeView({
            fields: {
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
    /**
     * Get Bookmarks of the PDF document being loaded in the ejPdfViewer control
     * @returns any
     */
    // tslint:disable-next-line
    getBookmarks() {
        if (this.bookmarks && this.bookmarksDestination) {
            // tslint:disable-next-line:max-line-length
            return { bookmarks: this.bookmarks, bookmarksDestination: this.bookmarksDestination };
        }
    }
    /**
     * Navigate To current Bookmark location of the PDF document being loaded in the ejPdfViewer control.
     * @returns void
     */
    goToBookmark(pageIndex, y) {
        let proxy = this;
        let destPage = (this.pdfViewerBase.pageSize[pageIndex - 1].height);
        // tslint:disable-next-line:max-line-length
        let scrollValue = this.pdfViewerBase.pageSize[pageIndex].top * this.pdfViewerBase.getZoomFactor() + ((destPage - y) * this.pdfViewerBase.getZoomFactor());
        let scroll = scrollValue.toString();
        // tslint:disable-next-line:radix
        proxy.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll);
        proxy.pdfViewerBase.focusViewerContainer();
        return false;
    }
    /**
     * @private
     */
    clear() {
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
    destroy() {
        this.clear();
    }
    /**
     * @private
     */
    getModuleName() {
        return 'BookmarkView';
    }
}

/**
 * export types
 */

/**
 * The `TextSelection` module is used to handle the text selection of PDF viewer.
 * @hidden
 */
class TextSelection {
    /**
     * @private
     */
    constructor(pdfViewer, pdfViewerBase) {
        /**
         * @private
         */
        this.isTextSelection = false;
        /**
         * @private
         */
        this.selectionStartPage = null;
        this.isBackwardPropagatedSelection = false;
        this.selectionRangeArray = [];
        this.selectionAnchorTouch = null;
        this.selectionFocusTouch = null;
        // tslint:disable-next-line
        this.scrollMoveTimer = 0;
        this.isMouseLeaveSelection = false;
        this.isTouchSelection = false;
        this.previousScrollDifference = 0;
        this.topStoreLeft = null;
        this.topStoreRight = null;
        this.onLeftTouchSelectElementTouchStart = (event) => {
            this.initiateSelectionByTouch();
        };
        this.onRightTouchSelectElementTouchStart = (event) => {
            this.initiateSelectionByTouch();
        };
        this.onLeftTouchSelectElementTouchEnd = (event) => {
            this.terminateSelectionByTouch(event);
        };
        this.onRightTouchSelectElementTouchEnd = (event) => {
            this.terminateSelectionByTouch(event);
        };
        this.onLeftTouchSelectElementTouchMove = (event) => {
            let range;
            let nodeElement;
            event.preventDefault();
            event.target.style.zIndex = '0';
            let rightElement = this.dropDivElementRight;
            let isTouchedWithinViewerContainer = this.isTouchedWithinContainer(event);
            if (rightElement && isTouchedWithinViewerContainer) {
                let dropBounds = rightElement.getBoundingClientRect();
                let xTouch = event.changedTouches[0].clientX;
                let yTouch = event.changedTouches[0].clientY;
                event.target.style.zIndex = '1000';
                nodeElement = this.getNodeElement(range, xTouch, yTouch, event, nodeElement);
                if (nodeElement) {
                    // tslint:disable-next-line:max-line-length
                    let currentDifference = Math.sqrt((yTouch - dropBounds.top) * (yTouch - dropBounds.top) + (xTouch - dropBounds.left) * (xTouch - dropBounds.left));
                    let isCloserMovement = this.isCloserTouchScroll(currentDifference);
                    let isTextSelected = false;
                    if (yTouch <= dropBounds.top) {
                        this.dropElementLeft.style.transform = 'rotate(0deg)';
                        this.dropElementRight.style.transform = 'rotate(-90deg)';
                        isTextSelected = this.selectTextByTouch(nodeElement.parentElement, xTouch, yTouch, false, 'left', isCloserMovement);
                    }
                    else {
                        this.dropElementLeft.style.transform = 'rotate(-90deg)';
                        this.dropElementRight.style.transform = 'rotate(0deg)';
                        isTextSelected = this.selectTextByTouch(nodeElement.parentElement, xTouch, yTouch, true, 'left', isCloserMovement);
                    }
                    if (isTextSelected) {
                        let elementClientRect = this.dropDivElementLeft.getBoundingClientRect();
                        let pageTopValue = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
                        let topClientValue = this.getClientValueTop(yTouch, this.pdfViewerBase.currentPageNumber - 1);
                        // tslint:disable-next-line:max-line-length
                        let currentPageLeft = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
                        let currentRangeLeft = xTouch - currentPageLeft;
                        // tslint:disable-next-line:max-line-length
                        this.dropDivElementLeft.style.top = pageTopValue * this.pdfViewerBase.getZoomFactor() + topClientValue + 'px';
                        this.topStoreLeft = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue), pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft), isHeightNeeded: false };
                        // tslint:disable-next-line:max-line-length
                        this.dropDivElementLeft.style.left = xTouch - this.pdfViewerBase.viewerContainer.getBoundingClientRect().left - (elementClientRect.width / 2) + 'px';
                        this.previousScrollDifference = currentDifference;
                    }
                }
            }
        };
        // tslint:disable-next-line
        this.onRightTouchSelectElementTouchMove = (event) => {
            let range;
            let nodeElement;
            event.preventDefault();
            event.target.style.zIndex = '0';
            let leftElement = this.dropDivElementLeft;
            let isTouchedWithinViewerContainer = this.isTouchedWithinContainer(event);
            if (leftElement && isTouchedWithinViewerContainer) {
                let dropPosition = leftElement.getBoundingClientRect();
                let touchX = event.changedTouches[0].clientX;
                let touchY = event.changedTouches[0].clientY;
                event.target.style.zIndex = '1000';
                nodeElement = this.getNodeElement(range, touchX, touchY, event, nodeElement);
                if (nodeElement) {
                    // tslint:disable-next-line:max-line-length
                    let currentDifference = Math.sqrt((touchY - dropPosition.top) * (touchY - dropPosition.top) + (touchX - dropPosition.left) * (touchX - dropPosition.left));
                    let isCloserMovement = this.isCloserTouchScroll(currentDifference);
                    let isTextSelected = false;
                    if (touchY >= dropPosition.top) {
                        this.dropElementRight.style.transform = 'rotate(-90deg)';
                        this.dropElementLeft.style.transform = 'rotate(0deg)';
                        isTextSelected = this.selectTextByTouch(nodeElement.parentElement, touchX, touchY, true, 'right', isCloserMovement);
                    }
                    else {
                        this.dropElementRight.style.transform = 'rotate(0deg)';
                        this.dropElementLeft.style.transform = 'rotate(-90deg)';
                        isTextSelected = this.selectTextByTouch(nodeElement.parentElement, touchX, touchY, false, 'right', isCloserMovement);
                    }
                    if (isTextSelected) {
                        let pageTopValue = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
                        let topClientValue = this.getClientValueTop(touchY, this.pdfViewerBase.currentPageNumber - 1);
                        let elementClientRect = this.dropDivElementRight.getBoundingClientRect();
                        this.dropDivElementRight.style.top = pageTopValue * this.pdfViewerBase.getZoomFactor() + topClientValue + 'px';
                        // tslint:disable-next-line:max-line-length
                        let currentPageLeft = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
                        let currentRangeLeft = touchX - currentPageLeft;
                        // tslint:disable-next-line:max-line-length
                        this.topStoreRight = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue), pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft), isHeightNeeded: false };
                        // tslint:disable-next-line:max-line-length
                        this.dropDivElementRight.style.left = touchX - this.pdfViewerBase.viewerContainer.getBoundingClientRect().left - (elementClientRect.width / 2) + 'px';
                        this.previousScrollDifference = currentDifference;
                    }
                }
            }
        };
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    textSelectionOnMouseMove(target, x, y) {
        let targetElement = target;
        if (targetElement.nodeType === targetElement.TEXT_NODE) {
            this.isBackwardPropagatedSelection = false;
            let range = targetElement.ownerDocument.createRange();
            let selection = window.getSelection();
            if (selection.anchorNode !== null) {
                let position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
                if (!position && selection.anchorOffset > selection.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
                    this.isBackwardPropagatedSelection = true;
                }
            }
            range.selectNodeContents(targetElement);
            let currentPosition = 0;
            let endPosition = range.endOffset;
            while (currentPosition < endPosition) {
                range.setStart(targetElement, currentPosition);
                range.setEnd(targetElement, currentPosition + 1);
                let rangeBounds = range.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    if (selection.anchorNode !== null && selection.anchorNode.parentNode.classList.contains('e-pv-text')) {
                        range.setStart(selection.anchorNode, selection.anchorOffset);
                    }
                    selection.removeAllRanges();
                    selection.addRange(range);
                    if (!this.isTextSelection) {
                        this.selectionStartPage = this.pdfViewerBase.currentPageNumber - 1;
                    }
                    this.isTextSelection = true;
                    if (this.isBackwardPropagatedSelection) {
                        selection.extend(targetElement, currentPosition);
                    }
                    else {
                        selection.extend(targetElement, currentPosition + 1);
                    }
                    range.detach();
                }
                currentPosition += 1;
            }
        }
        else {
            for (let i = 0; i < targetElement.childNodes.length; i++) {
                if (targetElement.childNodes[i].nodeType === targetElement.TEXT_NODE) {
                    let range = this.getSelectionRange(i, targetElement);
                    let rangeBounds = range.getBoundingClientRect();
                    if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                        range.detach();
                        this.textSelectionOnMouseMove(targetElement.childNodes[i], x, y);
                    }
                    else {
                        range.detach();
                    }
                }
            }
        }
    }
    /**
     * @private
     */
    textSelectionOnMouseLeave(event) {
        event.preventDefault();
        let viewerTop = this.pdfViewerBase.viewerContainer.offsetTop;
        if (this.pdfViewer.magnificationModule) {
            if (this.pdfViewer.magnificationModule.fitType === 'fitToPage') {
                return;
            }
        }
        if (event.clientY > viewerTop) {
            this.scrollMoveTimer = setInterval(() => { this.scrollForwardOnSelection(); }, 500);
        }
        else {
            this.scrollMoveTimer = setInterval(() => { this.scrollBackwardOnSelection(); }, 500);
        }
    }
    scrollForwardOnSelection() {
        this.isMouseLeaveSelection = true;
        this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.viewerContainer.scrollTop + 200;
        this.stichSelectionOnScroll(this.pdfViewerBase.currentPageNumber - 1);
    }
    scrollBackwardOnSelection() {
        this.isMouseLeaveSelection = true;
        this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.viewerContainer.scrollTop - 200;
        this.stichSelectionOnScroll(this.pdfViewerBase.currentPageNumber - 1);
    }
    /**
     * @private
     */
    clear() {
        if (this.scrollMoveTimer) {
            this.isMouseLeaveSelection = false;
            clearInterval(this.scrollMoveTimer);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    selectAWord(element, x, y, isStoreSelection) {
        if (element.nodeType === element.TEXT_NODE) {
            let selection = window.getSelection();
            let range = element.ownerDocument.createRange();
            range.selectNodeContents(element);
            let currentPosition = 0;
            let endPosition = range.endOffset;
            while (currentPosition < endPosition) {
                range.setStart(element, currentPosition);
                range.setEnd(element, currentPosition + 1);
                let rangeBounds = range.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    let textContent = element.textContent;
                    let indices = [];
                    let startPosition;
                    let endPos;
                    for (let i = 0; i < textContent.length; i++) {
                        if (textContent[i] === ' ') {
                            indices.push(i);
                        }
                    }
                    for (let j = 0; j < indices.length; j++) {
                        if (currentPosition === indices[j]) {
                            startPosition = indices[j];
                            endPos = indices[j];
                        }
                        if (indices[0] > currentPosition) {
                            startPosition = 0;
                            endPos = indices[j];
                            break;
                        }
                        if (currentPosition > indices[j] && currentPosition < indices[j + 1]) {
                            startPosition = indices[j];
                            endPos = indices[j + 1];
                        }
                        else if (currentPosition > indices[j]) {
                            if (!indices[j + 1]) {
                                startPosition = indices[j];
                            }
                        }
                    }
                    if (!endPos) {
                        endPos = textContent.length;
                    }
                    if (startPosition === 0) {
                        range.setStart(element, startPosition);
                    }
                    else {
                        range.setStart(element, startPosition + 1);
                    }
                    range.setEnd(element, endPos);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    this.isTextSelection = true;
                    // tslint:disable-next-line:radix
                    this.selectionStartPage = parseInt(range.startContainer.parentElement.id.split('_text_')[1]);
                    if (isStoreSelection) {
                        // tslint:disable-next-line:max-line-length
                        this.selectionAnchorTouch = { anchorNode: selection.anchorNode.parentElement.id, anchorOffset: selection.anchorOffset };
                        this.selectionFocusTouch = { focusNode: selection.focusNode.parentElement.id, focusOffset: selection.focusOffset };
                    }
                    range.detach();
                    break;
                }
                currentPosition += 1;
            }
        }
        else {
            for (let i = 0; i < element.childNodes.length; i++) {
                let range = this.getSelectionRange(i, element);
                let rangeBounds = range.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    range.detach();
                    this.selectAWord(element.childNodes[i], x, y, isStoreSelection);
                }
                else {
                    range.detach();
                }
            }
        }
    }
    getSelectionRange(index, element) {
        let range = element.childNodes[index].ownerDocument.createRange();
        range.selectNodeContents(element.childNodes[index]);
        return range;
    }
    /**
     * @private
     */
    selectEntireLine(event) {
        let textIds = [];
        let targetElement = event.target;
        let targetRect = targetElement.getBoundingClientRect();
        // tslint:disable-next-line
        let targetcentre = parseInt((targetRect.top + (targetRect.height / 2)).toString());
        // tslint:disable-next-line:radix
        let pageNumber = parseInt(event.target.id.split('_text_')[1]);
        let textDivs = document.querySelectorAll('div[id*="_text_' + pageNumber + '"]');
        if (targetElement.classList.contains('e-pv-text')) {
            for (let i = 0; i < textDivs.length; i++) {
                let rect = textDivs[i].getBoundingClientRect();
                // tslint:disable-next-line:radix
                let topValue = parseInt(rect.top.toString());
                // tslint:disable-next-line:radix
                let bottomValue = parseInt(rect.bottom.toString());
                if ((topValue <= targetcentre && bottomValue > targetcentre) && (targetRect.bottom + 10 > bottomValue)) {
                    let textId = textDivs[i].id;
                    if (textId !== '') {
                        textIds.push(textId);
                    }
                }
            }
            let selection = window.getSelection();
            selection.removeAllRanges();
            let range = document.createRange();
            let lengths = (textIds.length - 1);
            let d1 = document.getElementById(textIds[0]);
            let d2 = document.getElementById(textIds[lengths]);
            let childNodes = d2.childNodes.length;
            if (childNodes > 0) {
                range.setStart(d1.childNodes[0], 0);
                range.setEnd(d2.childNodes[0], d2.textContent.length);
            }
            else {
                range.setStart(d1.childNodes[0], 0);
                range.setEnd(d2, 1);
            }
            // tslint:disable-next-line:radix
            this.selectionStartPage = parseInt(range.startContainer.parentElement.id.split('_text_')[1]);
            selection.addRange(range);
            this.isTextSelection = true;
        }
    }
    /**
     * @private
     */
    enableTextSelectionMode() {
        this.pdfViewerBase.isTextSelectionDisabled = false;
        this.pdfViewerBase.viewerContainer.classList.remove('e-disable-text-selection');
        this.pdfViewerBase.viewerContainer.classList.add('e-enable-text-selection');
        this.pdfViewerBase.viewerContainer.addEventListener('selectstart', () => { return true; });
    }
    /**
     * @private
     */
    clearTextSelection() {
        if (this.isTextSelection) {
            this.pdfViewerBase.textLayer.clearDivSelection();
            if (window.getSelection) {
                if (window.getSelection().removeAllRanges) {
                    window.getSelection().removeAllRanges();
                }
            }
            if (this.pdfViewer.linkAnnotationModule) {
                let lowerPageIndex = this.pdfViewerBase.currentPageNumber - 3;
                lowerPageIndex = (lowerPageIndex < 0) ? 0 : lowerPageIndex;
                let higherPageIndex = this.pdfViewer.currentPageNumber + 1;
                // tslint:disable-next-line:max-line-length
                higherPageIndex = (higherPageIndex < (this.pdfViewerBase.pageCount - 1)) ? higherPageIndex : (this.pdfViewerBase.pageCount - 1);
                for (let i = lowerPageIndex; i <= higherPageIndex; i++) {
                    this.pdfViewer.linkAnnotationModule.modifyZindexForTextSelection(i, false);
                }
            }
            this.selectionRangeArray = [];
            this.isTextSelection = false;
            this.isTouchSelection = false;
            if (this.pdfViewer.textSearchModule) {
                this.pdfViewer.textSearchModule.searchAfterSelection();
            }
            this.pdfViewerBase.contextMenuModule.contextMenuObj.close();
            this.removeTouchElements();
        }
    }
    /**
     * @private
     */
    removeTouchElements() {
        if (this.dropDivElementLeft) {
            this.dropDivElementLeft.parentElement.removeChild(this.dropDivElementLeft);
            this.dropDivElementLeft = null;
            this.dropElementLeft.style.transform = 'rotate(0deg)';
        }
        if (this.dropDivElementRight) {
            this.dropDivElementRight.parentElement.removeChild(this.dropDivElementRight);
            this.dropDivElementRight = null;
            this.dropElementRight.style.transform = 'rotate(-90deg)';
        }
    }
    /**
     * @private
     */
    resizeTouchElements() {
        let viewerContainerLeft = this.pdfViewerBase.viewerContainer.getBoundingClientRect().left;
        if (this.dropDivElementLeft) {
            let elementClientRect = this.dropDivElementLeft.getBoundingClientRect();
            let dropElementHeight = 0;
            // tslint:disable-next-line:max-line-length
            let leftCurrentPagePosition = this.pdfViewerBase.getElement('_pageDiv_' + this.topStoreLeft.pageNumber).getBoundingClientRect();
            this.dropDivElementLeft.style.left = parseFloat(this.topStoreLeft.left.toString()) * this.pdfViewerBase.getZoomFactor() + leftCurrentPagePosition.left - viewerContainerLeft - (elementClientRect.width / 2) + 'px';
            if (this.topStoreLeft.isHeightNeeded) {
                dropElementHeight = (elementClientRect.height / 2) * this.pdfViewerBase.getZoomFactor();
            }
            // tslint:disable-next-line:max-line-length
            this.dropDivElementLeft.style.top = parseFloat(this.topStoreLeft.pageTop.toString()) * this.pdfViewerBase.getZoomFactor() + parseFloat(this.topStoreLeft.topClientValue.toString()) * this.pdfViewerBase.getZoomFactor() + dropElementHeight + 'px';
        }
        if (this.dropDivElementRight) {
            let elementClientRect = this.dropDivElementRight.getBoundingClientRect();
            let dropElementHeight = 0;
            // tslint:disable-next-line:max-line-length
            let rightCurrentPagePosition = this.pdfViewerBase.getElement('_pageDiv_' + this.topStoreRight.pageNumber).getBoundingClientRect();
            this.dropDivElementRight.style.left = parseFloat(this.topStoreRight.left.toString()) * this.pdfViewerBase.getZoomFactor() + rightCurrentPagePosition.left - viewerContainerLeft - (elementClientRect.width / 2) + 'px';
            if (this.topStoreRight.isHeightNeeded) {
                dropElementHeight = (elementClientRect.height / 2) * this.pdfViewerBase.getZoomFactor();
            }
            // tslint:disable-next-line:max-line-length
            this.dropDivElementRight.style.top = parseFloat(this.topStoreRight.pageTop.toString()) * this.pdfViewerBase.getZoomFactor() + parseFloat(this.topStoreRight.topClientValue.toString()) * this.pdfViewerBase.getZoomFactor() + dropElementHeight + 'px';
        }
    }
    /**
     * @private
     */
    textSelectionOnMouseup() {
        this.clear();
        if (window.getSelection().anchorNode !== null) {
            this.isMouseLeaveSelection = false;
            this.maintainSelectionOnZoom(true, false);
            let isTextSearch = this.pdfViewerBase.textLayer.getTextSearchStatus();
            if (isTextSearch) {
                this.pdfViewerBase.textLayer.clearDivSelection();
                // tslint:disable-next-line
                let indexes = this.pdfViewer.textSearchModule.getIndexes();
                let lowerPageValue = parseFloat(indexes.lowerPageValue.toString());
                let higherPageValue = parseFloat(indexes.higherPageValue.toString());
                for (let i = lowerPageValue; i < higherPageValue; i++) {
                    this.applySelectionRangeOnScroll(i);
                }
                this.pdfViewer.textSearchModule.searchAfterSelection();
            }
            else {
                this.applySpanForSelection();
            }
            if (this.pdfViewer.linkAnnotationModule) {
                this.pdfViewer.linkAnnotationModule.modifyZindexForTextSelection(this.pdfViewerBase.currentPageNumber - 1, false);
            }
        }
        else {
            this.pdfViewerBase.textLayer.clearDivSelection();
            if (this.pdfViewer.textSearchModule) {
                this.pdfViewer.textSearchModule.searchAfterSelection();
            }
            this.removeTouchElements();
        }
    }
    /**
     * @private
     */
    maintainSelectionOnZoom(isMaintainSelection, isStich) {
        let selection = window.getSelection();
        if (selection.type === 'Range' || (!selection.type && !selection.isCollapsed)) {
            let isBackward = this.isBackWardSelection(selection);
            if (selection.anchorNode !== null) {
                // tslint:disable-next-line:radix
                let anchorPageId = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
                // tslint:disable-next-line:radix
                let focusPageId = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
                if (this.isTouchSelection && isNaN(focusPageId)) {
                    let focusElement = selection.focusNode;
                    if (focusElement === this.pdfViewerBase.pageContainer) {
                        let lastChildNode = this.pdfViewerBase.pageContainer.lastChild;
                        if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                            // tslint:disable-next-line:radix
                            focusPageId = parseInt(lastChildNode.previousSibling.previousSibling.id.split('_pageDiv_')[1]);
                        }
                        else if (lastChildNode.classList.contains('e-pv-page-div')) {
                            // tslint:disable-next-line:radix
                            focusPageId = parseInt(lastChildNode.id.split('_pageDiv_')[1]);
                        }
                    }
                }
                if (!isBackward) {
                    for (let i = anchorPageId; i <= focusPageId; i++) {
                        this.maintainSelectionOnScroll(i, isStich);
                    }
                }
                else {
                    for (let i = anchorPageId; i >= focusPageId; i--) {
                        this.maintainSelectionOnScroll(i, isStich);
                    }
                }
            }
            if (!isMaintainSelection) {
                selection.removeAllRanges();
            }
        }
    }
    /**
     * @private
     */
    isSelectionAvailableOnScroll(pageNumber) {
        let isSelectionAvailable = false;
        let ranges = this.selectionRangeArray;
        for (let i = 0; i < ranges.length; i++) {
            if (ranges[i] !== null) {
                if (pageNumber === ranges[i].pageNumber) {
                    isSelectionAvailable = true;
                    if (this.isTouchSelection && !this.pdfViewerBase.getMagnified()) {
                        isSelectionAvailable = false;
                    }
                    break;
                }
            }
        }
        return isSelectionAvailable;
    }
    /**
     * @private
     */
    applySelectionRangeOnScroll(pageNumber) {
        if (this.isMouseLeaveSelection) {
            this.applySelectionMouseScroll(pageNumber);
        }
        else {
            this.applySelectionRange(pageNumber);
        }
    }
    // tslint:disable-next-line
    getSelectionRangeFromArray(pageNumber) {
        let isSelectionAvailable = false;
        let selectionRange = null;
        let ranges = this.selectionRangeArray;
        for (let i = 0; i < ranges.length; i++) {
            if (ranges[i] !== null) {
                if (pageNumber === ranges[i].pageNumber) {
                    selectionRange = ranges[i];
                    isSelectionAvailable = true;
                    break;
                }
            }
        }
        return { isSelectionAvailable: isSelectionAvailable, selectionRange: selectionRange };
    }
    applySelectionRange(pageNumber) {
        let selectionObject = this.getSelectionRangeFromArray(pageNumber);
        let isSelectionAvailable = selectionObject.isSelectionAvailable;
        let textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        if (textLayer) {
            if (isSelectionAvailable && textLayer.childNodes.length !== 0) {
                let selectionRange = selectionObject.selectionRange;
                let anchorOffsetDiv;
                let focusOffsetDiv;
                let anchorOffset;
                let focusOffset;
                if (selectionRange.isBackward) {
                    // tslint:disable-next-line:radix
                    let startId = parseInt(selectionRange.endNode.split('_text_')[1].split('_')[1]);
                    // tslint:disable-next-line:radix
                    let endId = parseInt(selectionRange.startNode.split('_text_')[1].split('_')[1]);
                    if (startId < endId) {
                        anchorOffsetDiv = startId;
                        anchorOffset = selectionRange.endOffset;
                        focusOffset = selectionRange.startOffset;
                        focusOffsetDiv = endId;
                    }
                    else {
                        anchorOffsetDiv = endId;
                        anchorOffset = selectionRange.startOffset;
                        focusOffsetDiv = startId;
                        focusOffset = selectionRange.endOffset;
                    }
                }
                else {
                    // tslint:disable-next-line:radix
                    anchorOffsetDiv = parseInt(selectionRange.startNode.split('text_')[1].split('_')[1]);
                    // tslint:disable-next-line:radix
                    focusOffsetDiv = parseInt(selectionRange.endNode.split('text_')[1].split('_')[1]);
                    anchorOffset = selectionRange.startOffset;
                    focusOffset = selectionRange.endOffset;
                }
                window.getSelection().removeAllRanges();
                // tslint:disable-next-line:max-line-length
                this.pdfViewerBase.textLayer.applySpanForSelection(pageNumber, pageNumber, anchorOffsetDiv, focusOffsetDiv, anchorOffset, focusOffset);
                if (this.pdfViewer.textSearchModule) {
                    this.pdfViewer.textSearchModule.searchAfterSelection();
                }
            }
        }
    }
    applySelectionMouseScroll(pageNumber) {
        let selectionObject = this.getSelectionRangeFromArray(pageNumber);
        let isSelectionAvailable = selectionObject.isSelectionAvailable;
        if (isSelectionAvailable) {
            let selectionRange = selectionObject.selectionRange;
            let selection = window.getSelection();
            let anchorNode = document.getElementById(selectionRange.startNode).childNodes[0];
            let focusNode = document.getElementById(selectionRange.endNode).childNodes[0];
            let range = document.createRange();
            if (selection.anchorNode === null) {
                if (!selectionRange.isBackward) {
                    range.setStart(anchorNode, selectionRange.startOffset);
                    range.setEnd(focusNode, selectionRange.endOffset);
                }
                else {
                    range.setStart(focusNode, selectionRange.endOffset);
                    range.setEnd(anchorNode, selectionRange.startOffset);
                }
            }
            else {
                // tslint:disable-next-line
                let anchorPageIndex = isNaN(parseInt(selection.anchorNode.parentElement.id.split('_text_')[1])) ? parseInt(selection.anchorNode.id.split('_pageDiv_')[1]) : parseInt(selection.anchorNode.parentElement.id.split('_text_')[1]);
                if (isNaN(anchorPageIndex)) {
                    // tslint:disable-next-line:radix
                    anchorPageIndex = parseInt(selection.anchorNode.id.split('_text_')[1]);
                }
                // tslint:disable-next-line
                let focusPageIndex = isNaN(parseInt(selection.focusNode.parentElement.id.split('_text_')[1])) ? parseInt(selection.focusNode.id.split('_pageDiv_')[1]) : parseInt(selection.focusNode.parentElement.id.split('_text_')[1]);
                // tslint:disable-next-line:radix
                let currentAnchorIndex = parseInt(selectionRange.startNode.split('_text_')[1]);
                if ((anchorPageIndex === focusPageIndex) && (anchorPageIndex === currentAnchorIndex)) {
                    if (!selectionRange.isBackward) {
                        range.setStart(anchorNode, selectionRange.startOffset);
                        range.setEnd(focusNode, selectionRange.endOffset);
                    }
                    else {
                        range.setStart(focusNode, selectionRange.endOffset);
                        range.setEnd(anchorNode, selectionRange.startOffset);
                    }
                }
                else {
                    if (!selectionRange.isBackward) {
                        // tslint:disable-next-line:max-line-length
                        if (anchorPageIndex < currentAnchorIndex && currentAnchorIndex < focusPageIndex && anchorPageIndex !== focusPageIndex) {
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                            range.setEnd(selection.focusNode, selection.focusOffset);
                        }
                        else if (anchorPageIndex < currentAnchorIndex) {
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                            range.setEnd(focusNode, selectionRange.endOffset);
                        }
                        else {
                            range.setStart(anchorNode, selectionRange.startOffset);
                            range.setEnd(selection.focusNode, selection.focusOffset);
                        }
                    }
                    else {
                        let isBackward = this.isBackWardSelection(selection);
                        // tslint:disable-next-line:max-line-length
                        if (anchorPageIndex > currentAnchorIndex && currentAnchorIndex > focusPageIndex && anchorPageIndex !== focusPageIndex) {
                            if (!isBackward) {
                                range.setStart(selection.anchorNode, selection.anchorOffset);
                                range.setEnd(selection.focusNode, selection.focusOffset);
                            }
                            else {
                                selection.extend(selection.focusNode, selection.focusOffset);
                            }
                            // tslint:disable-next-line:max-line-length
                        }
                        else if (anchorPageIndex < currentAnchorIndex && currentAnchorIndex < focusPageIndex && anchorPageIndex !== focusPageIndex) {
                            if (!isBackward) {
                                range.setStart(selection.anchorNode, selection.anchorOffset);
                                range.setEnd(selection.focusNode, selection.focusOffset);
                            }
                            else {
                                selection.extend(selection.focusNode, selection.focusOffset);
                            }
                        }
                        else if (anchorPageIndex < currentAnchorIndex) {
                            if (!isBackward) {
                                if (currentAnchorIndex !== this.selectionRangeArray[0].pageNumber) {
                                    range.setStart(selection.anchorNode, selection.anchorOffset);
                                    range.setEnd(focusNode, selectionRange.endOffset);
                                }
                                else {
                                    range.setStart(selection.anchorNode, selection.anchorOffset);
                                    range.setEnd(anchorNode, selectionRange.startOffset);
                                }
                            }
                            else {
                                if (currentAnchorIndex !== this.selectionRangeArray[0].pageNumber) {
                                    this.extendCurrentSelection(focusNode.parentElement, selectionRange.endOffset, selection, range);
                                }
                                else {
                                    this.extendCurrentSelection(anchorNode.parentElement, selectionRange.startOffset, selection, range);
                                }
                            }
                        }
                        else if (anchorPageIndex === currentAnchorIndex) {
                            if (currentAnchorIndex === focusPageIndex) {
                                range.setStart(anchorNode, selectionRange.startOffset);
                                range.setEnd(anchorNode, selectionRange.startOffset);
                                selection.removeAllRanges();
                                selection.addRange(range);
                                range = document.createRange();
                                selection.extend(focusNode, selectionRange.endOffset);
                            }
                            else {
                                if (isBackward) {
                                    this.extendCurrentSelection(focusNode.parentElement, selectionRange.endOffset, selection, range);
                                }
                                else {
                                    range.setStart(focusNode, selectionRange.endOffset);
                                    range.setEnd(selection.focusNode, selection.focusOffset);
                                }
                            }
                        }
                        else if (focusPageIndex === currentAnchorIndex) {
                            if (isBackward) {
                                selection.extend(selection.focusNode, selection.focusOffset);
                            }
                            else {
                                range.setStart(selection.anchorNode, selection.anchorOffset);
                                range.setEnd(selection.focusNode, selection.focusOffset);
                            }
                        }
                        else if (anchorPageIndex > currentAnchorIndex) {
                            // tslint:disable-next-line:radix
                            let currentAnchorOffset = parseInt(selectionRange.startNode.split('_' + currentAnchorIndex + '_')[1]);
                            // tslint:disable-next-line:radix
                            let currentFocusOffset = parseInt(selectionRange.endNode.split('_' + currentAnchorIndex + '_')[1]);
                            if (isBackward) {
                                if (currentAnchorIndex !== this.selectionRangeArray[0].pageNumber) {
                                    if (currentAnchorOffset < currentFocusOffset) {
                                        this.extendCurrentSelection(anchorNode.parentElement, selectionRange.startOffset, selection, range);
                                    }
                                    else {
                                        range.setStart(focusNode.parentElement, selectionRange.endOffset);
                                        range.setEnd(selection.anchorNode, selection.anchorOffset);
                                    }
                                }
                                else {
                                    this.extendCurrentSelection(focusNode.parentElement, selectionRange.endOffset, selection, range);
                                }
                            }
                            else {
                                if (currentAnchorOffset < currentFocusOffset) {
                                    range.setStart(anchorNode, selectionRange.startOffset);
                                    range.setEnd(selection.focusNode, selection.focusOffset);
                                }
                                else {
                                    range.setStart(focusNode, selectionRange.endOffset);
                                    range.setEnd(selection.focusNode, selection.focusOffset);
                                }
                            }
                        }
                    }
                }
            }
            if (range.toString() !== '') {
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
    /**
     * @private
     */
    maintainSelectionOnScroll(pageNumber, isStich) {
        let isSelectionAvailable = this.isSelectionAvailableOnScroll(pageNumber);
        if (this.isTextSelection && !isSelectionAvailable) {
            this.maintainSelection(pageNumber, isStich);
        }
    }
    maintainSelection(pageNumber, isStich) {
        let selection = window.getSelection();
        if (this.isTextSelection && (selection.type === 'Range' || (!selection.type && !selection.isCollapsed))) {
            // tslint:disable-next-line
            let anchorPageId = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
            // tslint:disable-next-line
            let focusPageId = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
            if (isNaN(focusPageId) && selection.anchorNode !== null) {
                let backward = this.isBackWardSelection(selection);
                if (!backward) {
                    // tslint:disable-next-line:radix
                    let lastChildNode = this.pdfViewerBase.pageContainer.lastChild;
                    if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                        // tslint:disable-next-line:radix
                        focusPageId = parseInt(lastChildNode.previousSibling.previousSibling.id.split('_pageDiv_')[1]);
                    }
                    else {
                        // tslint:disable-next-line:radix
                        focusPageId = parseInt(lastChildNode.id.split('_pageDiv_')[1]);
                    }
                }
                else {
                    // tslint:disable-next-line:radix
                    focusPageId = parseInt(this.pdfViewerBase.pageContainer.firstChild.id.split('_pageDiv_')[1]);
                }
            }
            let backward = this.isBackWardSelection(selection);
            if (this.isTouchSelection && pageNumber > focusPageId && pageNumber > anchorPageId) {
                return;
            }
            if (anchorPageId === focusPageId) {
                let selectionObject = null;
                let selectionBounds = this.getSelectionBounds(selection.getRangeAt(0), pageNumber);
                // tslint:disable-next-line:max-line-length
                let anchorOffsetValue = (this.getNodeElementFromNode(selection.anchorNode).childNodes.length === 1) ? selection.anchorOffset : this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                let focusOffsetValue = (this.getNodeElementFromNode(selection.focusNode).childNodes.length === 1) ? selection.focusOffset : this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                selectionObject = {
                    isBackward: backward, startNode: this.getNodeElementFromNode(selection.anchorNode).id,
                    startOffset: anchorOffsetValue, endNode: this.getNodeElementFromNode(selection.focusNode).id,
                    endOffset: focusOffsetValue, textContent: selection.toString(), pageNumber: pageNumber, bounds: selectionBounds
                };
                this.pushSelectionRangeObject(selectionObject, pageNumber);
            }
            else {
                let selectionObject = this.createRangeObjectOnScroll(pageNumber, anchorPageId, focusPageId);
                if (selectionObject) {
                    this.pushSelectionRangeObject(selectionObject, pageNumber);
                    if (isStich) {
                        this.stichSelection(backward, selection, pageNumber);
                    }
                }
            }
        }
    }
    getCorrectOffset(node, offset) {
        let offsetValue = 0;
        let parentElement = this.getNodeElementFromNode(node);
        for (let i = 0; i < parentElement.childNodes.length; i++) {
            if (parentElement.childNodes[i] === node) {
                offsetValue = offsetValue + offset;
                break;
            }
            else {
                offsetValue = offsetValue + parentElement.childNodes[i].textContent.length;
            }
        }
        return offsetValue;
    }
    pushSelectionRangeObject(selectionObject, pageNumber) {
        if (this.isTouchSelection) {
            let currentObject = this.selectionRangeArray.filter(
            // tslint:disable-next-line
            obj => {
                return (obj.pageNumber === pageNumber);
            });
            if (currentObject.length > 0) {
                let currentObjectIndex = this.selectionRangeArray.indexOf(currentObject[0]);
                this.selectionRangeArray.splice(currentObjectIndex, 1, selectionObject);
                return;
            }
        }
        let nextPageObject = this.selectionRangeArray.filter(
        // tslint:disable-next-line
        obj => {
            return (obj.pageNumber === (pageNumber + 1));
        });
        if (nextPageObject.length === 0) {
            if (this.isTouchSelection && this.selectionRangeArray.length !== 0) {
                let prevPageObject = this.selectionRangeArray.filter(
                // tslint:disable-next-line
                obj => {
                    return (obj.pageNumber === (pageNumber - 1));
                });
                if (prevPageObject.length !== 0) {
                    let prevIndex = this.selectionRangeArray.indexOf(prevPageObject[0]);
                    this.selectionRangeArray.splice(prevIndex + 1, 0, selectionObject);
                }
                else {
                    let firstObject = this.selectionRangeArray[0];
                    if (pageNumber < firstObject.pageNumber) {
                        this.selectionRangeArray.splice(0, 0, selectionObject);
                    }
                    else {
                        this.selectionRangeArray.push(selectionObject);
                    }
                }
            }
            else {
                this.selectionRangeArray.push(selectionObject);
            }
        }
        else {
            let index = this.selectionRangeArray.indexOf(nextPageObject[0]);
            this.selectionRangeArray.splice(index, 0, selectionObject);
        }
    }
    extendCurrentSelection(element, offset, selection, range) {
        let currentFocusOffset = selection.focusOffset;
        let currentFocusElement = selection.focusNode.parentElement.id;
        // tslint:disable-next-line
        let focusPageId = isNaN(parseInt(currentFocusElement.split('_text_')[1])) ? parseInt(selection.focusNode.id.split('_pageDiv_')[1]) : parseInt(currentFocusElement.split('_text_')[1]);
        // tslint:disable-next-line:radix
        if (isNaN(parseInt(currentFocusElement.split('_text_')[1]))) {
            // tslint:disable-next-line
            currentFocusElement = this.pdfViewerBase.getElement('_textLayer_' + (focusPageId + 1)).firstChild.id;
        }
        range.setStart(element.childNodes[0], offset);
        range.setEnd(element.childNodes[0], offset);
        selection.removeAllRanges();
        selection.addRange(range);
        selection.extend(document.getElementById(currentFocusElement).childNodes[0], currentFocusOffset);
    }
    stichSelection(backward, selection, pageNumber) {
        let range = document.createRange();
        let nextPageElement;
        if (backward) {
            nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber - 1));
            if (nextPageElement) {
                let lastElement = nextPageElement.lastChild;
                if (lastElement) {
                    this.extendCurrentSelection(lastElement, this.getTextLastLength(lastElement), selection, range);
                }
                else {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber - 2));
                    lastElement = nextPageElement.lastChild;
                    this.extendCurrentSelection(lastElement, this.getTextLastLength(lastElement), selection, range);
                }
            }
            else {
                nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber + 1));
                let lastElement = nextPageElement.firstChild;
                this.extendCurrentSelection(lastElement, 0, selection, range);
            }
        }
        else {
            nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber + 1));
            if (nextPageElement) {
                let firstElement = nextPageElement.firstChild;
                if (!firstElement) {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber + 2));
                    firstElement = nextPageElement.firstChild;
                    range.setStart(firstElement.childNodes[0], 0);
                }
                else {
                    range.setStart(firstElement.childNodes[0], 0);
                }
                range.setEnd(selection.focusNode, selection.focusOffset);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
    /**
     * @private
     */
    textSelectionOnMouseWheel(currentPageNumber) {
        this.isMouseLeaveSelection = true;
        this.stichSelectionOnScroll(currentPageNumber);
    }
    /**
     * @private
     */
    stichSelectionOnScroll(currentPageNumber) {
        let selection = window.getSelection();
        if (this.isTextSelection) {
            // tslint:disable-next-line:radix
            let anchorPageId = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
            // tslint:disable-next-line:radix
            let focusPageId = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
            let nextPageElement;
            if (anchorPageId !== currentPageNumber && focusPageId !== currentPageNumber) {
                let backward = this.isBackWardSelection(selection);
                if (!backward) {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (currentPageNumber - 1));
                    if (nextPageElement) {
                        let lastElement = nextPageElement.lastChild;
                        if (lastElement) {
                            this.extendSelectionStich(lastElement.childNodes[0], this.getTextLastLength(lastElement), selection);
                        }
                        else {
                            nextPageElement = this.pdfViewerBase.getElement('_textLayer_' + currentPageNumber);
                            let lastElement = nextPageElement.firstChild;
                            this.extendSelectionStich(lastElement.childNodes[0], 0, selection);
                        }
                    }
                }
                else {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (currentPageNumber - 1));
                    if (nextPageElement) {
                        let lastElement = nextPageElement.firstChild;
                        if (lastElement) {
                            this.extendSelectionStich(lastElement.childNodes[0], 0, selection);
                        }
                    }
                }
            }
            this.maintainSelectionArray();
        }
    }
    extendSelectionStich(node, offset, selection) {
        if (selection.extend) {
            selection.extend(node, offset);
        }
    }
    /**
     * @private
     */
    createRangeObjectOnScroll(pageNumber, anchorPageId, focusPageId) {
        let selectionObject = null;
        let selection = window.getSelection();
        if (selection.anchorNode !== null) {
            let backward = this.isBackWardSelection(selection);
            let firstElement;
            let lastElement;
            let startOffset;
            let endOffset;
            let element = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
            if (element.childNodes) {
                if (!backward) {
                    if (pageNumber === anchorPageId) {
                        firstElement = this.getNodeElementFromNode(selection.anchorNode);
                        // tslint:disable-next-line:max-line-length
                        lastElement = element.lastChild;
                        startOffset = this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                        endOffset = this.getTextLastLength(lastElement);
                    }
                    else if (pageNumber > anchorPageId && pageNumber < focusPageId) {
                        // tslint:disable-next-line:max-line-length
                        firstElement = element.firstChild;
                        // tslint:disable-next-line:max-line-length
                        lastElement = element.lastChild;
                        startOffset = 0;
                        endOffset = this.getTextLastLength(lastElement);
                    }
                    else if (pageNumber === focusPageId) {
                        // tslint:disable-next-line:max-line-length
                        firstElement = element.firstChild;
                        let pageNumberIndex = this.getNodeElementFromNode(selection.focusNode).id.indexOf(focusPageId.toString());
                        if (pageNumberIndex !== -1) {
                            lastElement = this.getNodeElementFromNode(selection.focusNode);
                            endOffset = this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                        }
                        else {
                            // tslint:disable-next-line:max-line-length
                            lastElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + focusPageId).lastChild;
                            endOffset = this.getTextLastLength(lastElement);
                        }
                        startOffset = 0;
                    }
                }
                else {
                    if (pageNumber === anchorPageId) {
                        firstElement = this.getNodeElementFromNode(selection.anchorNode);
                        // tslint:disable-next-line:max-line-length
                        lastElement = element.firstChild;
                        startOffset = this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                        endOffset = 0;
                    }
                    else if (pageNumber < anchorPageId && pageNumber > focusPageId) {
                        // tslint:disable-next-line:max-line-length
                        firstElement = element.firstChild;
                        // tslint:disable-next-line:max-line-length
                        lastElement = element.lastChild;
                        startOffset = 0;
                        endOffset = this.getTextLastLength(lastElement);
                    }
                    else if (pageNumber === focusPageId) {
                        firstElement = this.getNodeElementFromNode(selection.focusNode);
                        // tslint:disable-next-line:max-line-length
                        lastElement = element.lastChild;
                        startOffset = this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                        endOffset = this.getTextLastLength(lastElement);
                    }
                }
                if (firstElement && lastElement) {
                    // tslint:disable-next-line:max-line-length
                    let selectionRangeObject = this.getSelectionRangeObject(firstElement.id, startOffset, lastElement.id, endOffset, pageNumber);
                    let selectionString = selectionRangeObject.toString();
                    let selectionBounds = this.getSelectionBounds(selectionRangeObject, pageNumber);
                    // tslint:disable-next-line:max-line-length
                    return selectionObject = { isBackward: backward, startNode: firstElement.id, startOffset: startOffset, endNode: lastElement.id, endOffset: endOffset, textContent: selectionString, pageNumber: pageNumber, bounds: selectionBounds };
                }
                else {
                    return null;
                }
            }
        }
        return null;
    }
    getSelectionRangeObject(startNode, startOffset, endNode, endOffset, pageNumber) {
        let startElement = document.getElementById(startNode).childNodes[0];
        let endElement = document.getElementById(endNode).childNodes[0];
        // tslint:disable-next-line:radix
        let currentAnchorOffset = parseInt(startNode.split('_' + pageNumber + '_')[1]);
        // tslint:disable-next-line:radix
        let currentFocusOffset = parseInt(endNode.split('_' + pageNumber + '_')[1]);
        let range = document.createRange();
        if (currentAnchorOffset < currentFocusOffset) {
            range.setStart(startElement, startOffset);
            range.setEnd(endElement, endOffset);
        }
        else {
            range.setStart(endElement, endOffset);
            range.setEnd(startElement, startOffset);
        }
        return range;
    }
    getSelectionBounds(range, pageNumber) {
        let startElement = this.getNodeElementFromNode(range.startContainer);
        let endElement = this.getNodeElementFromNode(range.endContainer);
        let bounds = [];
        if (startElement !== endElement) {
            let newStartRange = document.createRange();
            // tslint:disable-next-line:max-line-length
            let startRange = this.createRangeForSelection(range.startContainer, range.endContainer, range.startOffset, range.endOffset, newStartRange);
            bounds.push(this.normalizeBounds(startRange.getBoundingClientRect(), pageNumber));
        }
        else {
            bounds.push(this.normalizeBounds(range.getBoundingClientRect(), pageNumber));
        }
        return bounds;
    }
    getTextId(elementId) {
        let index = elementId.lastIndexOf('_');
        let divId = elementId.substring(index + 1, elementId.length);
        // tslint:disable-next-line:radix
        return parseInt(divId);
    }
    normalizeBounds(bound, pageNumber) {
        let newBounds = null;
        let currentPageElement = this.pdfViewerBase.getElement('_pageDiv_' + pageNumber);
        let currentPageRect = currentPageElement.getBoundingClientRect();
        newBounds = {
            bottom: this.getMagnifiedValue(bound.bottom - currentPageRect.top), height: this.getMagnifiedValue(bound.height),
            left: this.getMagnifiedValue(bound.left - currentPageRect.left), top: this.getMagnifiedValue(bound.top - currentPageRect.top),
            right: this.getMagnifiedValue(bound.right - currentPageRect.left), width: this.getMagnifiedValue(bound.height)
        };
        return newBounds;
    }
    getMagnifiedValue(value) {
        return value / this.pdfViewerBase.getZoomFactor();
    }
    /**
     * @private
     */
    getCurrentSelectionBounds(pageNumber) {
        let bounds = null;
        let ranges = this.selectionRangeArray;
        for (let i = 0; i < ranges.length; i++) {
            if (ranges[i] !== null) {
                if (pageNumber === ranges[i].pageNumber) {
                    bounds = ranges[i].bounds;
                }
            }
        }
        return bounds;
    }
    createRangeForSelection(start, end, startOffset, endOffset, range) {
        range.setStart(start, startOffset);
        range.setEnd(end, endOffset);
        return range;
    }
    maintainSelectionArray() {
        if (this.selectionRangeArray.length !== 0) {
            let selection = window.getSelection();
            let isBackward = this.isBackWardSelection(selection);
            // tslint:disable-next-line
            let anchorPage = isNaN(parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1])) ? parseInt(selection.anchorNode.id.split('_pageDiv_')[1]) : parseInt(selection.anchorNode.parentElement.id.split('_text_')[1]);
            if (isNaN(anchorPage)) {
                // tslint:disable-next-line:radix
                anchorPage = parseInt(selection.anchorNode.id.split('_text_')[1]);
            }
            // tslint:disable-next-line
            let focusPage = isNaN(parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1])) ? parseInt(selection.focusNode.id.split('_pageDiv_')[1]) : parseInt(selection.focusNode.parentElement.id.split('_text_')[1]);
            if (isNaN(focusPage)) {
                // tslint:disable-next-line
                focusPage = isNaN(parseInt(selection.focusNode.id.split('_text_')[1])) ? parseInt(selection.focusNode.id.split('_textLayer_')[1]) : parseInt(selection.focusNode.id.split('_text_')[1]);
            }
            let arrayObject = [];
            if (!isBackward) {
                arrayObject = this.selectionRangeArray.filter(
                // tslint:disable-next-line
                obj => {
                    return (!((this.selectionStartPage <= obj.pageNumber) && (obj.pageNumber < focusPage)));
                });
            }
            else {
                arrayObject = this.selectionRangeArray.filter(
                // tslint:disable-next-line
                obj => {
                    return (!((focusPage < obj.pageNumber) && (obj.pageNumber <= this.selectionStartPage)));
                });
            }
            if (arrayObject.length > 0) {
                for (let i = 0; i < arrayObject.length; i++) {
                    let indexInArray = this.selectionRangeArray.indexOf(arrayObject[i]);
                    if (indexInArray !== -1) {
                        this.selectionRangeArray.splice(indexInArray, 1);
                    }
                }
                if (this.selectionRangeArray.length === 1) {
                    // tslint:disable-next-line:max-line-length
                    if (this.selectionRangeArray[0].pageNumber === anchorPage || this.selectionRangeArray[0].pageNumber === focusPage) {
                        arrayObject = [];
                    }
                }
            }
        }
    }
    isBackWardSelection(selection) {
        let position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
        let backward = false;
        if (!position && selection.anchorOffset > selection.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
            backward = true;
        }
        return backward;
    }
    /**
     * @private
     */
    applySpanForSelection() {
        let selection = window.getSelection();
        // tslint:disable-next-line:max-line-length
        if (selection.anchorNode !== null && this.pdfViewerBase.viewerContainer.contains(this.getNodeElementFromNode(selection.anchorNode))) {
            let isBackWardSelection = this.isBackWardSelection(selection);
            let anchorPageId;
            let focusPageId;
            let anchorOffsetDiv;
            let focusOffsetDiv;
            let anchorOffset;
            let focusOffset;
            if (isBackWardSelection) {
                // tslint:disable-next-line:radix
                anchorPageId = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
                // tslint:disable-next-line:radix
                focusPageId = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
                // tslint:disable-next-line:radix
                anchorOffsetDiv = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1].split('_')[1]);
                // tslint:disable-next-line:radix
                focusOffsetDiv = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1].split('_')[1]);
                anchorOffset = selection.focusOffset;
                focusOffset = selection.anchorOffset;
            }
            else {
                let anchorElement = this.getNodeElementFromNode(selection.anchorNode);
                let focusElement = this.getNodeElementFromNode(selection.focusNode);
                // tslint:disable-next-line
                anchorPageId = (anchorElement.id.indexOf('text_') !== -1) ? parseInt(anchorElement.id.split('text_')[1]) : parseInt(anchorElement.id.split('_textLayer_')[1]);
                // tslint:disable-next-line
                focusPageId = (focusElement.id.indexOf('text_') !== -1) ? parseInt(focusElement.id.split('text_')[1]) : parseInt(focusElement.id.split('_textLayer_')[1]);
                let isFocusChanged = false;
                if (this.isTouchSelection) {
                    if (selection.focusNode === this.pdfViewerBase.pageContainer) {
                        let lastChildNode = this.pdfViewerBase.pageContainer.lastChild;
                        if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                            let lastPageDiv = lastChildNode.previousSibling.previousSibling;
                            // tslint:disable-next-line:radix
                            focusPageId = parseInt(lastPageDiv.id.split('_pageDiv_')[1]);
                            focusElement = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).lastChild;
                            isFocusChanged = true;
                        }
                        else if (lastChildNode.classList.contains('e-pv-page-div')) {
                            let lastPageDiv = lastChildNode;
                            // tslint:disable-next-line:radix
                            focusPageId = parseInt(lastPageDiv.id.split('_pageDiv_')[1]);
                            focusElement = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).lastChild;
                            isFocusChanged = true;
                        }
                    }
                }
                if (anchorElement.classList.contains('e-pv-maintaincontent')) {
                    anchorElement = this.getNodeElementFromNode(anchorElement);
                    // tslint:disable-next-line:radix
                    anchorPageId = parseInt(anchorElement.id.split('text_')[1]);
                }
                if (focusElement.classList.contains('e-pv-maintaincontent')) {
                    focusElement = this.getNodeElementFromNode(focusElement);
                    // tslint:disable-next-line:radix
                    focusPageId = parseInt(focusElement.id.split('text_')[1]);
                }
                if (anchorPageId === focusPageId) {
                    if (anchorElement.contains(focusElement)) {
                        anchorElement = focusElement;
                    }
                    if (focusElement.contains(anchorElement)) {
                        focusElement = anchorElement;
                    }
                }
                // tslint:disable-next-line:radix
                anchorOffsetDiv = (anchorElement.id.split('text_')[1]) ? parseInt(anchorElement.id.split('text_')[1].split('_')[1]) : null;
                // tslint:disable-next-line:radix
                focusOffsetDiv = (focusElement.id.split('text_')[1]) ? parseInt(focusElement.id.split('text_')[1].split('_')[1]) : null;
                anchorOffsetDiv = isNaN(anchorOffsetDiv) ? focusOffsetDiv : anchorOffsetDiv;
                focusOffsetDiv = isNaN(focusOffsetDiv) ? anchorOffsetDiv : focusOffsetDiv;
                anchorOffset = selection.anchorOffset;
                focusOffset = !isFocusChanged ? selection.focusOffset : focusElement.textContent.length;
            }
            selection.removeAllRanges();
            this.pdfViewerBase.textLayer.clearDivSelection();
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.textLayer.applySpanForSelection(anchorPageId, focusPageId, anchorOffsetDiv, focusOffsetDiv, anchorOffset, focusOffset);
            if (this.pdfViewer.textSearchModule) {
                this.pdfViewer.textSearchModule.searchAfterSelection();
            }
        }
    }
    /**
     * @private
     */
    initiateTouchSelection(event, x, y) {
        // tslint:disable-next-line
        let element = event.target;
        let belowElements = document.elementsFromPoint(event.touches[0].clientX, event.touches[0].clientY);
        if (belowElements.length !== 0) {
            if (belowElements[0].classList.contains('e-pv-hyperlink') && belowElements[1].classList.contains('e-pv-text')) {
                element = belowElements[1];
            }
        }
        this.selectAWord(element, x, y, true);
        this.createTouchSelectElement(event);
        this.maintainSelectionOnZoom(true, false);
        this.applySpanForSelection();
    }
    // tslint:disable-next-line
    selectTextByTouch(element, x, y, isForwardSelection, target, isCloserMovement) {
        let isTextSelected = false;
        if (element.nodeType === element.TEXT_NODE) {
            let rangeObject = element.ownerDocument.createRange();
            let selection = window.getSelection();
            rangeObject.selectNodeContents(element);
            let currentPosition = 0;
            let endPosition = rangeObject.endOffset;
            while (currentPosition < endPosition) {
                rangeObject.setStart(element, currentPosition);
                rangeObject.setEnd(element, currentPosition + 1);
                let rangeBounds = rangeObject.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    if (selection.anchorNode != null) {
                        if (isForwardSelection) {
                            rangeObject.setStart(selection.anchorNode, selection.anchorOffset);
                        }
                        // tslint:disable-next-line:max-line-length
                        rangeObject = this.setTouchSelectionStartPosition(selection, rangeObject, isForwardSelection, target, element, currentPosition, isCloserMovement);
                        if (isForwardSelection) {
                            selection.extend(element, currentPosition);
                        }
                        isTextSelected = true;
                    }
                    rangeObject.detach();
                    return isTextSelected;
                }
                currentPosition += 1;
            }
        }
        else {
            for (let i = 0; i < element.childNodes.length; i++) {
                let range = element.childNodes[i].ownerDocument.createRange();
                range.selectNodeContents(element.childNodes[i]);
                let rangeBounds = range.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    range.detach();
                    return (this.selectTextByTouch(element.childNodes[i], x, y, isForwardSelection, target, isCloserMovement));
                }
                else {
                    range.detach();
                }
            }
        }
        return isTextSelected;
    }
    // tslint:disable-next-line
    setTouchSelectionStartPosition(selection, range, isForwardSelection, target, element, currentPosition, isCloserMovement) {
        if (isForwardSelection) {
            if (target === 'left') {
                // tslint:disable-next-line
                let startNode = this.getTouchFocusElement(selection, true);
                range.setStart(startNode.focusNode, startNode.focusOffset);
                range.setEnd(element, currentPosition);
                this.selectionAnchorTouch = { anchorNode: range.endContainer.parentElement.id, anchorOffset: range.endOffset };
            }
            else if (target === 'right') {
                // tslint:disable-next-line
                let startNode = this.getTouchAnchorElement(selection, false);
                range.setStart(startNode.anchorNode, startNode.anchorOffset);
                range.setEnd(element, currentPosition);
                this.selectionFocusTouch = { focusNode: range.endContainer.parentElement.id, focusOffset: range.endOffset };
            }
        }
        else {
            if (target === 'left') {
                if (!isCloserMovement) {
                    // tslint:disable-next-line
                    let startNode = this.getTouchFocusElement(selection, false);
                    range.setStart(element, currentPosition);
                    // tslint:disable-next-line:radix
                    range.setEnd(startNode.focusNode, startNode.focusOffset);
                    if (range.toString() === '') {
                        range.setStart(element, currentPosition);
                        range.setEnd(selection.focusNode, selection.focusOffset);
                    }
                    this.selectionAnchorTouch = { anchorNode: range.startContainer.parentElement.id, anchorOffset: range.startOffset };
                }
                else {
                    range.setStart(element, currentPosition);
                    range.setEnd(selection.focusNode, selection.focusOffset);
                    this.selectionAnchorTouch = { anchorNode: range.startContainer.parentElement.id, anchorOffset: range.startOffset };
                }
            }
            else if (target === 'right') {
                // tslint:disable-next-line
                let startNode = this.getTouchAnchorElement(selection, true);
                range.setStart(element, currentPosition);
                range.setEnd(startNode.anchorNode, startNode.anchorOffset);
                if (range.toString() === '') {
                    range.setStart(startNode.anchorNode, startNode.anchorOffset);
                    range.setEnd(element, currentPosition);
                }
                this.selectionFocusTouch = { focusNode: range.startContainer.parentElement.id, focusOffset: range.startOffset };
            }
        }
        selection.removeAllRanges();
        selection.addRange(range);
        return range;
    }
    getTouchAnchorElement(selection, isCurrentFocus) {
        let element = document.getElementById(this.selectionAnchorTouch.anchorNode.toString());
        let startNode = null;
        let offset = 0;
        if (element) {
            startNode = element.childNodes[0];
            // tslint:disable-next-line:radix
            offset = parseInt(this.selectionAnchorTouch.anchorOffset.toString());
        }
        else {
            if (isCurrentFocus) {
                startNode = selection.focusNode;
                offset = selection.focusOffset;
            }
            else {
                startNode = selection.anchorNode;
                offset = selection.anchorOffset;
            }
        }
        return { anchorNode: startNode, anchorOffset: offset };
    }
    getTouchFocusElement(selection, isCurrentAnchor) {
        let element = document.getElementById(this.selectionFocusTouch.focusNode.toString());
        let startNode = null;
        let offset = 0;
        if (element) {
            startNode = element.childNodes[0];
            // tslint:disable-next-line:radix
            offset = parseInt(this.selectionFocusTouch.focusOffset.toString());
        }
        else {
            if (isCurrentAnchor) {
                startNode = selection.anchorNode;
                offset = selection.anchorOffset;
            }
            else {
                startNode = selection.focusNode;
                offset = selection.focusOffset;
            }
        }
        return { focusNode: startNode, focusOffset: offset };
    }
    createTouchSelectElement(event) {
        this.isTouchSelection = true;
        let selection = window.getSelection();
        if (selection.type === 'Range') {
            // tslint:disable-next-line:max-line-length
            this.dropDivElementLeft = createElement('div', { id: this.pdfViewer.element.id + '_touchSelect_droplet_left', className: 'e-pv-touch-select-drop' });
            // tslint:disable-next-line:max-line-length
            this.dropDivElementRight = createElement('div', { id: this.pdfViewer.element.id + '_touchSelect_droplet_right', className: 'e-pv-touch-select-drop' });
            this.dropElementLeft = createElement('div', { className: 'e-pv-touch-ellipse' });
            this.dropElementLeft.style.transform = 'rotate(0deg)';
            this.dropDivElementLeft.appendChild(this.dropElementLeft);
            this.dropElementRight = createElement('div', { className: 'e-pv-touch-ellipse' });
            this.dropElementRight.style.transform = 'rotate(-90deg)';
            this.dropDivElementRight.appendChild(this.dropElementRight);
            this.pdfViewerBase.pageContainer.appendChild(this.dropDivElementLeft);
            this.pdfViewerBase.pageContainer.appendChild(this.dropDivElementRight);
            let range = selection.getRangeAt(0);
            let rangePosition = range.getBoundingClientRect();
            let dropElementRect = this.dropDivElementLeft.getBoundingClientRect();
            // tslint:disable-next-line:max-line-length
            let pageTopValue = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
            let viewerLeftPosition = this.pdfViewerBase.viewerContainer.getBoundingClientRect().left;
            let topClientValue = this.getClientValueTop(rangePosition.top, this.pdfViewerBase.currentPageNumber - 1);
            // tslint:disable-next-line:max-line-length
            let topPositionValue = topClientValue + pageTopValue * this.pdfViewerBase.getZoomFactor() + (dropElementRect.height / 2) * this.pdfViewerBase.getZoomFactor() + 'px';
            this.dropDivElementLeft.style.top = topPositionValue;
            this.dropDivElementLeft.style.left = rangePosition.left - (viewerLeftPosition + (dropElementRect.width)) + 'px';
            this.dropDivElementRight.style.top = topPositionValue;
            // tslint:disable-next-line:max-line-length
            this.dropDivElementRight.style.left = rangePosition.left + rangePosition.width - viewerLeftPosition + 'px';
            let currentPageLeft = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
            let currentRangeLeft = rangePosition.left - currentPageLeft;
            // tslint:disable-next-line:max-line-length
            this.topStoreLeft = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue), pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft), isHeightNeeded: true };
            // tslint:disable-next-line:max-line-length
            this.topStoreRight = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue), pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft + rangePosition.width), isHeightNeeded: true };
            this.dropDivElementLeft.addEventListener('touchstart', this.onLeftTouchSelectElementTouchStart);
            this.dropDivElementLeft.addEventListener('touchmove', this.onLeftTouchSelectElementTouchMove);
            this.dropDivElementLeft.addEventListener('touchend', this.onLeftTouchSelectElementTouchEnd);
            this.dropDivElementRight.addEventListener('touchstart', this.onRightTouchSelectElementTouchStart);
            this.dropDivElementRight.addEventListener('touchmove', this.onRightTouchSelectElementTouchMove);
            this.dropDivElementRight.addEventListener('touchend', this.onRightTouchSelectElementTouchEnd);
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.contextMenuModule.contextMenuObj.open(event.touches[0].clientY - this.pdfViewerBase.viewerContainer.offsetTop, event.touches[0].clientX - this.pdfViewerBase.viewerContainer.clientLeft, this.pdfViewerBase.viewerContainer);
        }
    }
    initiateSelectionByTouch() {
        this.pdfViewerBase.textLayer.clearDivSelection();
        this.pdfViewerBase.contextMenuModule.contextMenuObj.close();
        let lowerPageIndex = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageIndex = (lowerPageIndex < 0) ? 0 : lowerPageIndex;
        let higherPageIndex = this.pdfViewer.currentPageNumber + 1;
        // tslint:disable-next-line:max-line-length
        higherPageIndex = (higherPageIndex < (this.pdfViewerBase.pageCount - 1)) ? higherPageIndex : (this.pdfViewerBase.pageCount - 1);
        for (let i = lowerPageIndex; i <= higherPageIndex; i++) {
            let textLayer = this.pdfViewerBase.getElement('_textLayer_' + i);
            if (textLayer) {
                if (textLayer.childNodes !== null) {
                    this.applySelectionMouseScroll(i);
                }
            }
        }
    }
    // tslint:disable-next-line
    terminateSelectionByTouch(event) {
        this.maintainSelectionOnZoom(true, false);
        this.applySpanForSelection();
        // tslint:disable-next-line:max-line-length
        this.pdfViewerBase.contextMenuModule.contextMenuObj.open(event.changedTouches[0].clientY - this.pdfViewerBase.viewerContainer.offsetTop + this.pdfViewerBase.contextMenuModule.contextMenuElement.clientHeight, event.changedTouches[0].clientX - this.pdfViewerBase.viewerContainer.offsetLeft, this.pdfViewerBase.viewerContainer);
    }
    getNodeElement(range, touchX, touchY, event, nodeElement) {
        if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(touchX, touchY);
            nodeElement = this.onTouchElementScroll(range, nodeElement, touchY, event);
            // tslint:disable-next-line
        }
        else if (document.caretPositionFromPoint) {
            // tslint:disable-next-line
            let start = document.caretPositionFromPoint(touchX, touchY);
            // tslint:disable-next-line
            let end = document.caretPositionFromPoint(touchX, touchY);
            range = document.createRange();
            range.setStart(start.offsetNode, start.offset);
            range.setEnd(end.offsetNode, end.offset);
            nodeElement = this.onTouchElementScroll(range, nodeElement, touchY, event);
        }
        return nodeElement;
    }
    isTouchedWithinContainer(event) {
        let elements = document.elementsFromPoint(event.touches[0].clientX, event.touches[0].clientY);
        let isTouchedWithinContainer = false;
        if (elements.length !== 0) {
            isTouchedWithinContainer = true;
        }
        return isTouchedWithinContainer;
    }
    onTouchElementScroll(range, nodeElement, touchY, event) {
        let viewerScrollTop = this.pdfViewerBase.viewerContainer.scrollTop;
        if (range != null) {
            nodeElement = range.startContainer;
            let isScrollBar = this.isScrolledOnScrollBar(event);
            if (!this.pdfViewerBase.viewerContainer.contains(nodeElement.parentElement) || isScrollBar) {
                if (touchY < this.pdfViewerBase.viewerContainer.clientHeight) {
                    this.pdfViewerBase.viewerContainer.scrollTop = viewerScrollTop - 30;
                }
                else {
                    this.pdfViewerBase.viewerContainer.scrollTop = viewerScrollTop + 30;
                }
            }
        }
        else {
            if (touchY < this.pdfViewerBase.viewerContainer.clientHeight) {
                this.pdfViewerBase.viewerContainer.scrollTop = viewerScrollTop - 30;
            }
            else {
                this.pdfViewerBase.viewerContainer.scrollTop = viewerScrollTop + 30;
            }
        }
        return nodeElement;
    }
    isCloserTouchScroll(currentDifference) {
        let isForwardMovement = false;
        if (this.previousScrollDifference > currentDifference) {
            isForwardMovement = true;
        }
        return isForwardMovement;
    }
    getClientValueTop(clientValue, pageNumber) {
        // tslint:disable-next-line:max-line-length
        return clientValue - this.pdfViewerBase.getElement('_pageDiv_' + pageNumber).getBoundingClientRect().top;
    }
    isScrolledOnScrollBar(event) {
        let isScrollBar = false;
        // tslint:disable-next-line:max-line-length
        if ((this.pdfViewerBase.viewerContainer.clientHeight + this.pdfViewerBase.viewerContainer.offsetTop) < event.touches[0].clientY && event.touches[0].clientY < (this.pdfViewerBase.viewerContainer.offsetHeight + this.pdfViewerBase.viewerContainer.offsetTop)) {
            isScrollBar = true;
        }
        return isScrollBar;
    }
    getTextLastLength(element) {
        if (element) {
            return element.textContent.length;
        }
        else {
            return 0;
        }
    }
    getNodeElementFromNode(node) {
        if (node.parentElement) {
            return node.parentElement;
        }
        else {
            return node.parentNode;
        }
    }
    /**
     * @private
     */
    copyText() {
        let selectionText = '';
        this.maintainSelectionOnZoom(true, false);
        if (this.selectionRangeArray.length > 0) {
            for (let i = 0; i < this.selectionRangeArray.length; i++) {
                selectionText += this.selectionRangeArray[i].textContent;
            }
        }
        if (selectionText.length > 0) {
            let textArea = document.createElement('textarea');
            textArea.contentEditable = 'true';
            textArea.textContent = selectionText;
            textArea.style.position = 'fixed';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
            }
            catch (ex) {
                console.warn('Copy to clipboard failed.', ex);
            }
            finally {
                if (textArea) {
                    document.body.removeChild(textArea);
                }
            }
        }
    }
    /**
     * @private
     */
    destroy() {
        this.clear();
    }
    /**
     * @private
     */
    getModuleName() {
        return 'TextSelection';
    }
}

/**
 * export types
 */

/**
 * TextSearch module
 */
class TextSearch {
    /**
     * @private
     */
    constructor(pdfViewer, pdfViewerBase) {
        /**
         * @private
         */
        this.isTextSearch = false;
        this.searchIndex = 0;
        this.currentSearchIndex = 0;
        this.searchPageIndex = null;
        this.searchString = null;
        this.isMatchCase = false;
        // tslint:disable-next-line
        this.textContents = new Array();
        // tslint:disable-next-line
        this.searchMatches = new Array();
        // tslint:disable-next-line
        this.searchCollection = new Array();
        this.searchedPages = [];
        this.isPrevSearch = false;
        // tslint:disable-next-line
        this.tempElementStorage = new Array();
        /**
         * @private
         */
        this.isMessagePopupOpened = false;
        this.checkBoxOnChange = (event) => {
            if (event.checked) {
                this.isMatchCase = true;
            }
            else {
                this.isMatchCase = false;
            }
            if (this.isTextSearch) {
                this.resetVariables();
                this.clearAllOccurrences();
                let inputString = this.searchInput.value;
                this.searchIndex = 0;
                this.textSearch(inputString);
            }
        };
        this.searchKeypressHandler = (event) => {
            this.enableNextButton(true);
            this.enablePrevButton(true);
            if (event.which === 13) {
                this.initiateTextSearch();
                this.updateSearchInputIcon(false);
            }
            else {
                this.resetVariables();
            }
        };
        this.searchClickHandler = (event) => {
            if (this.searchBtn.classList.contains('e-pv-search-icon')) {
                this.initiateTextSearch();
            }
            else if (this.searchBtn.classList.contains('e-pv-search-close')) {
                this.searchInput.value = '';
                this.resetTextSearch();
                this.searchInput.focus();
            }
        };
        this.nextButtonOnClick = (event) => {
            this.nextSearch();
        };
        this.prevButtonOnClick = (event) => {
            this.prevSearch();
        };
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    createTextSearchBox() {
        // tslint:disable-next-line:max-line-length
        this.searchBox = createElement('div', { id: this.pdfViewer.element.id + '_search_box', className: 'e-pv-search-bar' });
        let searchElementsContainer = createElement('div', { id: this.pdfViewer.element.id + '_search_box_elements', className: 'e-pv-search-bar-elements' });
        // tslint:disable-next-line:max-line-length
        let searchInputContainer = createElement('div', { id: this.pdfViewer.element.id + '_search_input_container', className: 'e-input-group e-pv-search-input' });
        this.searchInput = createElement('input', { id: this.pdfViewer.element.id + '_search_input', className: 'e-input' });
        this.searchInput.type = 'text';
        this.searchInput.placeholder = this.pdfViewer.localeObj.getConstant('Find in document');
        // tslint:disable-next-line:max-line-length
        this.searchBtn = createElement('span', { id: this.pdfViewer.element.id + '_search_box-icon', className: 'e-input-group-icon e-input-search-group-icon e-pv-search-icon' });
        searchInputContainer.appendChild(this.searchInput);
        searchInputContainer.appendChild(this.searchBtn);
        searchElementsContainer.appendChild(searchInputContainer);
        this.prevSearchBtn = this.createSearchBoxButtons('prev_occurrence', 'e-pv-prev-search');
        searchElementsContainer.appendChild(this.prevSearchBtn);
        this.nextSearchBtn = this.createSearchBoxButtons('next_occurrence', 'e-pv-next-search');
        searchElementsContainer.appendChild(this.nextSearchBtn);
        // tslint:disable-next-line:max-line-length
        let matchCaseContainer = createElement('div', { id: this.pdfViewer.element.id + '_match_case_container', className: 'e-pv-match-case-container' });
        let matchCaseInput = createElement('input', { id: this.pdfViewer.element.id + '_match_case' });
        matchCaseInput.type = 'checkbox';
        matchCaseContainer.appendChild(matchCaseInput);
        this.searchBox.appendChild(searchElementsContainer);
        this.searchBox.appendChild(matchCaseContainer);
        this.pdfViewerBase.mainContainer.appendChild(this.searchBox);
        // tslint:disable-next-line:max-line-length
        this.checkBox = new CheckBox({ cssClass: 'e-pv-match-case', label: this.pdfViewer.localeObj.getConstant('Match case'), change: this.checkBoxOnChange.bind(this) });
        this.checkBox.appendTo(matchCaseInput);
        this.showSearchBox(false);
        this.searchBox.style.right = '88.3px';
        this.searchInput.addEventListener('focus', () => {
            this.searchInput.parentElement.classList.add('e-input-focus');
        });
        this.searchInput.addEventListener('blur', () => {
            this.searchInput.parentElement.classList.remove('e-input-focus');
        });
        this.searchInput.addEventListener('keypress', this.searchKeypressHandler.bind(this));
        this.searchBtn.addEventListener('click', this.searchClickHandler.bind(this));
        this.nextSearchBtn.addEventListener('click', this.nextButtonOnClick.bind(this));
        this.prevSearchBtn.addEventListener('click', this.prevButtonOnClick.bind(this));
    }
    /**
     * @private
     */
    textSearchBoxOnResize() {
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewerBase.viewerContainer.clientWidth + this.pdfViewerBase.viewerContainer.offsetLeft < this.searchBox.offsetLeft + this.searchBox.clientWidth) {
            this.searchBox.style.right = '0px';
            // tslint:disable-next-line
            this.searchBox.style.width = parseInt(this.searchBox.style.width) - ((this.searchBox.offsetLeft + this.searchBox.clientWidth) - (this.pdfViewerBase.viewerContainer.clientWidth)) + 'px';
            // tslint:disable-next-line
            this.searchInput.style.width = parseInt(this.searchInput.style.width) - ((this.searchBox.offsetLeft + this.searchBox.clientWidth) - (this.pdfViewerBase.viewerContainer.clientWidth)) + 'px';
        }
        else {
            this.searchBox.style.right = '88.3px';
            this.searchBox.style.width = '';
            this.searchInput.style.width = '';
        }
    }
    /**
     * @private
     */
    showSearchBox(isShow) {
        if (isShow) {
            this.searchBox.style.display = 'block';
        }
        else {
            this.searchBox.style.display = 'none';
        }
        this.onTextSearchClose();
    }
    /**
     * @private
     */
    searchAfterSelection() {
        if (this.isTextSearch) {
            this.initSearch(this.searchPageIndex, true);
            this.highlightOthers();
        }
    }
    initiateTextSearch() {
        let inputString = this.searchInput.value;
        if (inputString !== this.searchString) {
            this.isTextSearch = false;
            this.searchPageIndex = this.pdfViewerBase.currentPageNumber - 1;
        }
        this.clearAllOccurrences();
        if (inputString !== '') {
            if (this.searchCollection[this.searchPageIndex] && inputString === this.searchString) {
                if (this.searchCollection[this.searchPageIndex].length === 0) {
                    this.initSearch(this.searchPageIndex, false);
                }
                else {
                    this.nextSearch();
                }
            }
            else {
                this.resetVariables();
                this.searchIndex = 0;
                this.textSearch(inputString);
            }
        }
    }
    textSearch(inputString) {
        if (inputString !== '' || inputString) {
            this.searchString = inputString;
            this.isTextSearch = true;
            this.searchPageIndex = this.pdfViewerBase.currentPageNumber - 1;
            this.initSearch(this.searchPageIndex, false);
            this.highlightOthers();
        }
    }
    nextSearch() {
        this.isPrevSearch = false;
        this.isTextSearch = true;
        if (this.searchString) {
            this.clearAllOccurrences();
            this.searchIndex = this.searchIndex + 1;
            if (this.searchCollection[this.searchPageIndex]) {
                // tslint:disable-next-line:max-line-length
                if (this.searchIndex >= this.searchCollection[this.searchPageIndex].length || this.searchPageIndex !== this.pdfViewerBase.currentPageNumber - 1) {
                    this.searchIndex = 0;
                    this.searchPageIndex = ((this.searchPageIndex + 1) < this.pdfViewerBase.pageCount) ? (this.searchPageIndex + 1) : 0;
                    this.initSearch(this.searchPageIndex, false);
                }
                else {
                    this.highlightSearchedTexts(this.searchPageIndex, false);
                }
                this.highlightOthers();
            }
            else {
                this.initiateTextSearch();
            }
        }
        else {
            this.initiateTextSearch();
        }
    }
    prevSearch() {
        this.isPrevSearch = true;
        this.isTextSearch = true;
        if (this.searchString) {
            this.clearAllOccurrences();
            this.searchIndex = this.searchIndex - 1;
            if (this.searchIndex < 0) {
                this.searchPageIndex = ((this.searchPageIndex - 1) < 0) ? (this.pdfViewerBase.pageCount - 1) : this.searchPageIndex - 1;
                this.initSearch(this.searchPageIndex, false);
            }
            else {
                this.highlightSearchedTexts(this.searchPageIndex, false);
            }
            this.highlightOthers();
        }
        else {
            this.searchIndex = this.searchIndex - 1;
            this.searchPageIndex = ((this.searchPageIndex - 1) < 0) ? (this.pdfViewerBase.pageCount - 1) : this.searchPageIndex - 1;
            let inputString = this.searchInput.value;
            this.textSearch(inputString);
        }
    }
    initSearch(pageIndex, isSinglePageSearch) {
        // tslint:disable-next-line
        let storedData = this.pdfViewerBase.getStoredData(pageIndex);
        let pageText = null;
        let textContents = null;
        if (storedData) {
            // tslint:disable-next-line
            pageText = storedData['pageText'];
            // tslint:disable-next-line
            textContents = storedData['textContent'];
            this.textContents[pageIndex] = textContents;
            this.getPossibleMatches(pageIndex, this.searchString, pageText, textContents, isSinglePageSearch);
        }
        else {
            if (!isSinglePageSearch) {
                this.createRequestForSearch(pageIndex);
            }
        }
    }
    // tslint:disable-next-line:max-line-length
    getPossibleMatches(pageIndex, searchString, pageString, textContents, isSinglePageSearch) {
        let pageText = pageString;
        let searchText = searchString;
        let queryLength = searchString.length;
        if (!this.isMatchCase) {
            searchText = searchString.toLowerCase();
            pageText = pageString.toLowerCase();
        }
        let matches = [];
        let matchIndex = -queryLength;
        while (matchIndex !== 0) {
            if (searchText === '' || searchText === ' ' || !searchText) {
                break;
            }
            matchIndex = pageText.indexOf(searchText, matchIndex + queryLength);
            if (matchIndex === -1) {
                break;
            }
            matches.push(matchIndex);
        }
        this.searchMatches[pageIndex] = matches;
        if (!isSinglePageSearch) {
            if (this.searchedPages.indexOf(pageIndex) === -1) {
                this.searchedPages.push(pageIndex);
            }
            this.updateSearchInputIcon(false);
        }
        if (this.searchMatches[pageIndex].length !== 0) {
            if (!isSinglePageSearch) {
                if (this.isPrevSearch) {
                    this.searchIndex = this.searchMatches[pageIndex].length - 1;
                }
                if ((this.pdfViewerBase.currentPageNumber - 1) !== this.searchPageIndex) {
                    // tslint:disable-next-line:max-line-length
                    if (this.searchCollection.length > 0 && (this.searchIndex === 0 || this.searchIndex === -1) && (this.searchPageIndex) === this.currentSearchIndex) {
                        if (!this.isMessagePopupOpened) {
                            this.onMessageBoxOpen();
                            this.pdfViewerBase.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('No matches'));
                        }
                        this.searchPageIndex = this.getSearchPage(this.pdfViewerBase.currentPageNumber - 1);
                        this.searchedPages = [];
                    }
                    this.pdfViewerBase.updateScrollTop(this.searchPageIndex);
                }
            }
            this.convertMatches(pageIndex, queryLength, textContents, isSinglePageSearch);
        }
        else {
            if (!isSinglePageSearch) {
                if (this.isPrevSearch) {
                    this.searchPageIndex = ((this.searchPageIndex - 1) < 0) ? (this.pdfViewerBase.pageCount - 1) : this.searchPageIndex - 1;
                }
                else {
                    this.searchPageIndex = ((this.searchPageIndex + 1) < this.pdfViewerBase.pageCount) ? (this.searchPageIndex + 1) : 0;
                }
                if (this.searchedPages.indexOf(this.searchPageIndex) === -1 && this.searchedPages.length !== this.pdfViewerBase.pageCount) {
                    this.initSearch(this.searchPageIndex, false);
                }
                else {
                    let searchPageIndex = this.getSearchPage(pageIndex);
                    // tslint:disable-next-line:max-line-length
                    if (!this.searchCollection[this.searchPageIndex] && this.searchCollection.length === 0 && this.searchedPages.length === this.pdfViewerBase.pageCount) {
                        // tslint:disable-next-line:max-line-length
                        if (!this.isMessagePopupOpened) {
                            this.onMessageBoxOpen();
                            this.pdfViewerBase.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('No matches'));
                        }
                        // tslint:disable-next-line:max-line-length
                    }
                    else if (this.searchCollection.length > 0 && (this.searchIndex === 0 || this.searchIndex === -1) && (searchPageIndex) === this.currentSearchIndex) {
                        if (this.isPrevSearch) {
                            // tslint:disable-next-line:max-line-length
                            if (!this.isMessagePopupOpened) {
                                this.onMessageBoxOpen();
                                this.pdfViewerBase.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('No matches'));
                            }
                            this.searchPageIndex = this.getSearchPage(this.pdfViewerBase.currentPageNumber - 1);
                            this.searchedPages = [];
                            this.searchIndex = -1;
                        }
                        else {
                            if (!this.isMessagePopupOpened) {
                                this.onMessageBoxOpen();
                                this.pdfViewerBase.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('No matches'));
                            }
                            this.searchPageIndex = this.getSearchPage(this.pdfViewerBase.currentPageNumber - 1);
                            this.searchedPages = [];
                            this.searchIndex = 0;
                        }
                        this.highlightSearchedTexts(this.searchPageIndex, isSinglePageSearch);
                    }
                }
            }
        }
    }
    getSearchPage(pageIndex) {
        let pageNumber = null;
        if (this.isPrevSearch) {
            for (let i = pageIndex; i >= 0; i--) {
                if (i !== pageIndex && this.searchCollection[i]) {
                    pageNumber = i;
                    break;
                }
            }
            if (!pageNumber) {
                for (let j = this.pdfViewerBase.pageCount - 1; j > pageIndex; j--) {
                    if (this.searchCollection[j]) {
                        pageNumber = j;
                        break;
                    }
                }
            }
        }
        else {
            for (let i = pageIndex; i < this.pdfViewerBase.pageCount; i++) {
                if (i !== pageIndex && this.searchCollection[i]) {
                    pageNumber = i;
                    break;
                }
            }
            if (!pageNumber) {
                for (let j = 0; j < pageIndex; j++) {
                    if (this.searchCollection[j]) {
                        pageNumber = j;
                        break;
                    }
                }
            }
        }
        return pageNumber;
    }
    convertMatches(pageIndex, queryLength, textContents, isSinglePageSearch) {
        let m = 0;
        let matches = this.searchMatches[pageIndex];
        let divIndex = 0;
        let end = textContents.length - 1;
        let matchCollection = [];
        for (let i = 0; i < matches.length; i++) {
            let matchIndex = matches[i];
            while (m !== end && matchIndex >= (divIndex + textContents[m].split('\r\n')[0].length)) {
                divIndex += textContents[m].split('\r\n')[0].length;
                m++;
            }
            let match = {
                begin: {
                    divId: m,
                    offsetValue: matchIndex - divIndex,
                }
            };
            matchIndex += queryLength;
            while (m !== end && matchIndex > (divIndex + textContents[m].length)) {
                divIndex += textContents[m].length;
                m++;
            }
            match.end = {
                divId: m,
                offsetValue: matchIndex - divIndex,
            };
            matchCollection.push(match);
        }
        if (this.searchCollection.length === 0) {
            this.currentSearchIndex = pageIndex;
        }
        this.searchCollection[pageIndex] = matchCollection;
        this.highlightSearchedTexts(pageIndex, isSinglePageSearch);
    }
    highlightSearchedTexts(pageIndex, isSinglePageSearch) {
        let matches = this.searchCollection[pageIndex];
        let prevEnd = null;
        // tslint:disable-next-line
        let scrollPoint = { y: -100, x: -400 };
        let startId;
        let className;
        for (let i = 0; i < matches.length; i++) {
            let match = matches[i];
            // tslint:disable-next-line
            let start = match.begin;
            // tslint:disable-next-line
            let end = match.end;
            if (i === this.searchIndex && pageIndex === this.searchPageIndex) {
                className = 'e-pv-search-text-highlight';
                startId = start.divId;
            }
            else {
                className = 'e-pv-search-text-highlightother';
            }
            if (!prevEnd || start.divId !== prevEnd.divId) {
                if (prevEnd !== null) {
                    // tslint:disable-next-line:max-line-length
                    this.addSpanForSearch(pageIndex, parseFloat(prevEnd.divId.toString()), parseFloat(prevEnd.offsetValue.toString()), undefined, null);
                }
                this.beginText(start, pageIndex, null);
            }
            else {
                // tslint:disable-next-line:max-line-length
                this.addSpanForSearch(pageIndex, parseFloat(prevEnd.divId.toString()), parseFloat(prevEnd.offsetValue.toString()), parseFloat(start.offsetValue.toString()), null);
            }
            if (start.divId === end.divId) {
                this.addSpanForSearch(pageIndex, start.divId, start.offsetValue, end.offsetValue, className);
            }
            else {
                this.addSpanForSearch(pageIndex, start.divId, start.offsetValue, undefined, className);
                for (let k = start.divId + 1; k < end.divId; k++) {
                    this.addSpanForSearch(pageIndex, k, 0, undefined, className + ' middle');
                }
                this.beginText(end, pageIndex, className);
            }
            prevEnd = end;
        }
        if (prevEnd) {
            // tslint:disable-next-line:max-line-length
            this.addSpanForSearch(pageIndex, parseFloat(prevEnd.divId.toString()), parseFloat(prevEnd.offsetValue.toString()), undefined, null);
        }
        if (pageIndex === this.searchPageIndex && !isSinglePageSearch) {
            let element = this.pdfViewerBase.getElement('_text_' + pageIndex + '_' + startId);
            if (element) {
                this.scrollToSearchStr(element, scrollPoint);
            }
            else {
                this.pdfViewerBase.updateScrollTop(pageIndex);
                let element = this.pdfViewerBase.getElement('_text_' + pageIndex + '_' + startId);
                this.scrollToSearchStr(element, scrollPoint);
            }
        }
    }
    // tslint:disable-next-line
    beginText(start, pageIndex, className) {
        let divIndex = parseFloat(start.divId);
        let textDiv = this.pdfViewerBase.getElement('_text_' + pageIndex + '_' + divIndex);
        if (textDiv) {
            // tslint:disable-next-line
            this.tempElementStorage = new Array();
            for (let i = 0; i < textDiv.childNodes.length; i++) {
                // tslint:disable-next-line:max-line-length
                let ele = { text: textDiv.childNodes[i].textContent, classString: textDiv.childNodes[i].className };
                this.tempElementStorage.push(ele);
            }
            textDiv.textContent = '';
            this.addSpanForSearch(pageIndex, divIndex, 0, start.offsetValue, className);
        }
    }
    // tslint:disable-next-line:max-line-length
    addSpanForSearch(pageIndex, divIndex, fromOffset, toOffset, className) {
        let divTextContent;
        let textDiv = this.pdfViewerBase.getElement('_text_' + pageIndex + '_' + divIndex);
        if (textDiv) {
            let textContent = this.textContents[pageIndex];
            divTextContent = textContent[divIndex].substring(fromOffset, toOffset);
            let node = document.createTextNode(divTextContent);
            if (className) {
                let spanElement = document.createElement('span');
                spanElement.className = className;
                if (spanElement.classList.contains('middle')) {
                    textDiv.textContent = '';
                }
                spanElement.appendChild(node);
                textDiv.appendChild(spanElement);
            }
            else {
                if (this.pdfViewer.textSelectionModule.isTextSelection) {
                    this.searchOnSelection(textDiv, node, divTextContent);
                }
                else {
                    textDiv.appendChild(node);
                }
            }
        }
    }
    isClassAvailable() {
        let isClass = false;
        for (let j = 0; j < this.tempElementStorage.length; j++) {
            if (this.tempElementStorage[j].classString) {
                // tslint:disable-next-line:max-line-length
                if (this.tempElementStorage[j].classString === 'e-pv-search-text-highlight' || this.tempElementStorage[j].classString === 'e-pv-search-text-highlightother') {
                    isClass = true;
                    break;
                }
            }
        }
        return isClass;
    }
    addSpan(text, textDiv) {
        let newNode = document.createTextNode(text);
        let spanElement = document.createElement('span');
        spanElement.className = 'e-pv-maintaincontent';
        spanElement.appendChild(newNode);
        textDiv.appendChild(spanElement);
    }
    searchOnSelection(textDiv, node, divTextContent) {
        if (this.tempElementStorage.length === 1) {
            if (this.tempElementStorage[0].classString) {
                if (this.tempElementStorage[0].classString.indexOf('e-pv-maintaincontent') !== -1) {
                    this.addSpan(node.textContent, textDiv);
                }
            }
            else {
                textDiv.appendChild(node);
            }
        }
        else {
            if (this.tempElementStorage.length > 1) {
                for (let i = 0; i < this.tempElementStorage.length; i++) {
                    if (this.tempElementStorage[i].classString) {
                        if (this.tempElementStorage[i].classString.indexOf('e-pv-maintaincontent') !== -1) {
                            if (this.tempElementStorage[i].text === node.textContent) {
                                this.addSpan(node.textContent, textDiv);
                                break;
                            }
                            else {
                                if (this.tempElementStorage[i].text !== node.textContent) {
                                    let currentString = node.textContent;
                                    let isClassAvailable = this.isClassAvailable();
                                    let subString;
                                    if (isClassAvailable) {
                                        subString = divTextContent.substring(0, this.tempElementStorage[i].text.length);
                                    }
                                    else {
                                        subString = divTextContent.substring(0, this.tempElementStorage[i].text.length);
                                    } // tslint:disable-next-line
                                    if (this.tempElementStorage[i].text.indexOf(currentString) !== -1 && !this.tempElementStorage[i].classString) {
                                        this.addSpan(currentString, textDiv);
                                        break; // tslint:disable-next-line
                                    }
                                    else if (this.tempElementStorage[i].text.indexOf(subString) !== -1 && this.tempElementStorage[i].classString && subString !== '') {
                                        if (this.tempElementStorage[i].classString.indexOf('e-pv-maintaincontent') !== -1) {
                                            this.addSpan(subString, textDiv); // tslint:disable-next-line
                                            let nextSubString = divTextContent.substring(this.tempElementStorage[i].text.length, divTextContent.length);
                                            if (this.tempElementStorage[i + 1]) { // tslint:disable-next-line
                                                if (this.tempElementStorage[i + 1].text.indexOf(nextSubString) !== -1 && !this.tempElementStorage[i + 1].classString && nextSubString !== "") {
                                                    node.textContent = nextSubString;
                                                    textDiv.appendChild(node);
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    else if (this.tempElementStorage[i + 1]) {
                                        if (divTextContent === (this.tempElementStorage[i].text + this.tempElementStorage[i + 1].text)) {
                                            this.addSpan(this.tempElementStorage[i].text, textDiv);
                                            node.textContent = this.tempElementStorage[i + 1].text;
                                            textDiv.appendChild(node);
                                            break;
                                        }
                                        else if (this.tempElementStorage[i].text.indexOf(divTextContent) !== -1) {
                                            this.addSpan(divTextContent, textDiv);
                                            break;
                                        }
                                        else { // tslint:disable-next-line
                                            let subString = this.tempElementStorage[i].text.substring(textDiv.textContent.length, currentString.length);
                                            if (this.tempElementStorage[i].text.indexOf(subString) !== -1 && this.tempElementStorage[i].classString && // tslint:disable-next-line
                                                subString !== '' && !this.tempElementStorage[i + 1].classString && divTextContent.indexOf(subString) !== -1) {
                                                this.addSpan(subString, textDiv);
                                                continue;
                                            }
                                        }
                                    }
                                    else {
                                        if (this.tempElementStorage[i].text.indexOf(divTextContent) !== -1) {
                                            this.addSpan(node.textContent, textDiv);
                                            break;
                                        }
                                        else if (this.tempElementStorage[i].text.indexOf(divTextContent.replace('\r\n', '')) !== -1) {
                                            this.addSpan(divTextContent, textDiv);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (this.tempElementStorage[i].text !== node.textContent) {
                            let currentString = node.textContent;
                            if (currentString !== '') {
                                let isClassAvailable = this.isClassAvailable();
                                let subString;
                                if (isClassAvailable) {
                                    subString = divTextContent.substring(0, this.tempElementStorage[i].text.length);
                                }
                                else { // tslint:disable-next-line
                                    subString = divTextContent.substring(0, this.tempElementStorage[i].text.length - textDiv.textContent.length);
                                } // tslint:disable-next-line
                                if (subString === currentString && !this.tempElementStorage[i].classString && this.tempElementStorage[i].text.indexOf(subString) !== -1) {
                                    node.textContent = subString;
                                    textDiv.appendChild(node);
                                    break;
                                }
                                else { // tslint:disable-next-line
                                    if (this.tempElementStorage[i].text.indexOf(subString) !== -1 && this.tempElementStorage[i].classString) {
                                        if (this.tempElementStorage[i].classString.indexOf('e-pv-maintaincontent') !== -1) {
                                            this.addSpan(subString, textDiv);
                                            break;
                                        }
                                    }
                                    else if (this.tempElementStorage[i + 1]) { // tslint:disable-next-line
                                        let balanceString = currentString.substring(this.tempElementStorage[i].text.length, currentString.length);
                                        let nextString = this.tempElementStorage[i + 1].text.substring(0, balanceString.length);
                                        if (currentString === (subString + this.tempElementStorage[i + 1].text)) {
                                            node.textContent = subString;
                                            textDiv.appendChild(node);
                                            this.addSpan(this.tempElementStorage[i + 1].text, textDiv);
                                            break;
                                        }
                                        else if (currentString === (subString + nextString) && nextString !== '') {
                                            node.textContent = subString;
                                            textDiv.appendChild(node);
                                            this.addSpan(balanceString, textDiv);
                                            break;
                                        }
                                        else { // tslint:disable-next-line
                                            if (this.tempElementStorage[i].text.indexOf(subString) !== -1 && !this.tempElementStorage[i].classString && subString !== '') {
                                                let newSubString = divTextContent.substring(0, subString.length);
                                                node.textContent = newSubString;
                                                textDiv.appendChild(node); // tslint:disable-next-line
                                                let nextNewSubString = divTextContent.substring(subString.length, divTextContent.length);
                                                if (nextNewSubString !== '' && this.tempElementStorage[i + 1].text.indexOf(nextNewSubString) !== -1 && this.tempElementStorage[i + 1].classString) {
                                                    this.addSpan(nextNewSubString, textDiv);
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    else { // tslint:disable-next-line
                                        if (this.tempElementStorage[i].text.indexOf(currentString) !== -1 && !this.tempElementStorage[i].classString) {
                                            node.textContent = currentString;
                                            textDiv.appendChild(node);
                                            break; // tslint:disable-next-line
                                        }
                                        else if (this.tempElementStorage[i].text.indexOf(currentString.replace('\r\n', '')) !== -1 && !this.tempElementStorage[i].classString) {
                                            node.textContent = currentString;
                                            textDiv.appendChild(node);
                                            break;
                                        }
                                        else {
                                            if (divTextContent.indexOf(this.tempElementStorage[i].text) !== -1) {
                                                node.textContent = this.tempElementStorage[i].text;
                                                textDiv.appendChild(node);
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            textDiv.appendChild(node);
                        }
                    }
                }
            }
            else {
                textDiv.appendChild(node);
            }
        }
    }
    // tslint:disable-next-line
    scrollToSearchStr(element, scrollPoint) {
        let parent = element.offsetParent;
        let offsetY = element.offsetTop + element.clientTop;
        let offsetX = element.offsetLeft + element.clientLeft;
        while (parent.id !== this.pdfViewerBase.viewerContainer.id) {
            offsetY += parent.offsetTop;
            offsetX += parent.offsetLeft;
            parent = parent.offsetParent;
        }
        if (scrollPoint) {
            offsetY += scrollPoint.y;
            offsetX += scrollPoint.x;
            if (this.pdfViewerBase.getZoomFactor() > 1.5) {
                parent.scrollLeft = offsetX;
            }
        }
        parent.scrollTop = offsetY;
    }
    /**
     * @private
     */
    highlightOtherOccurrences(pageNumber) {
        this.initSearch(pageNumber, true);
    }
    highlightOthers() {
        let indexes = this.getIndexes();
        let lowerPageValue = parseFloat(indexes.lowerPageValue.toString());
        let higherPageValue = parseFloat(indexes.higherPageValue.toString());
        for (let i = lowerPageValue; i <= higherPageValue; i++) {
            this.highlightOtherOccurrences(i);
        }
    }
    clearAllOccurrences() {
        this.pdfViewerBase.textLayer.clearDivSelection();
        this.applyTextSelection();
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    getIndexes() {
        let lowerPageValue = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        let higherPageValue = this.pdfViewerBase.currentPageNumber + 1;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        return { lowerPageValue: lowerPageValue, higherPageValue: higherPageValue };
    }
    applyTextSelection() {
        if (this.pdfViewer.textSelectionModule && !this.pdfViewerBase.isTextSelectionDisabled) {
            let indexes = this.getIndexes();
            let lowerPageValue = parseFloat(indexes.lowerPageValue.toString());
            let higherPageValue = parseFloat(indexes.higherPageValue.toString());
            for (let i = lowerPageValue; i <= higherPageValue; i++) {
                this.pdfViewer.textSelectionModule.applySelectionRangeOnScroll(i);
            }
        }
    }
    /**
     * @private
     */
    resetTextSearch() {
        this.resetVariables();
        this.onTextSearchClose();
        this.searchPageIndex = null;
        this.searchIndex = 0;
        this.updateSearchInputIcon(true);
        this.enableNextButton(false);
        this.enablePrevButton(false);
    }
    onTextSearchClose() {
        this.isPrevSearch = false;
        this.isTextSearch = false;
        if (this.pdfViewerBase.pageCount > 0) {
            this.clearAllOccurrences();
        }
    }
    createRequestForSearch(pageIndex) {
        let jsonObject;
        // tslint:disable-next-line:max-line-length
        jsonObject = { xCoordinate: 0, yCoordinate: 0, pageNumber: pageIndex, documentId: this.pdfViewerBase.getDocumentId(), hashId: this.pdfViewerBase.hashId, zoomFactor: this.pdfViewerBase.getZoomFactor() };
        let request = new XMLHttpRequest();
        request.open('POST', this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderPages);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.responseType = 'json';
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        request.onreadystatechange = (event) => {
            let proxy = this.pdfViewerBase;
            if (request.readyState === 4 && request.status === 200) {
                // tslint:disable-next-line
                let data = event.currentTarget.response;
                // tslint:disable-next-line:max-line-length
                if (typeof data !== 'object') {
                    data = JSON.parse(data);
                }
                if (data) {
                    if (data.pageText) {
                        proxy.storeWinData(data, pageIndex);
                        this.initSearch(pageIndex, false);
                    }
                }
            }
            else if (request.readyState === 4 && request.status === 400) {
                // error
                this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
            }
        };
        // tslint:disable-next-line
        request.onerror = (event) => {
            this.pdfViewerBase.openNotificationPopup();
            this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
        };
    }
    createSearchBoxButtons(id, className) {
        // tslint:disable-next-line:max-line-length
        let button = createElement('button', { id: this.pdfViewer.element.id + '_' + id, className: 'e-btn e-icon-btn e-pv-search-btn ' + className });
        let iconSpan = createElement('span', { id: this.pdfViewer.element.id + '_' + id + 'Icon', className: 'e-pv-icon-search ' + className + '-icon' });
        button.disabled = true;
        button.appendChild(iconSpan);
        return button;
    }
    enablePrevButton(isEnable) {
        if (isEnable) {
            this.prevSearchBtn.removeAttribute('disabled');
        }
        else {
            this.prevSearchBtn.disabled = true;
        }
    }
    enableNextButton(isEnable) {
        if (isEnable) {
            this.nextSearchBtn.removeAttribute('disabled');
        }
        else {
            this.nextSearchBtn.disabled = true;
        }
    }
    resetVariables() {
        this.searchedPages = [];
        // tslint:disable-next-line
        this.searchMatches = new Array();
        // tslint:disable-next-line
        this.searchCollection = new Array();
    }
    updateSearchInputIcon(isEnable) {
        if (isEnable) {
            this.searchBtn.classList.remove('e-pv-search-close');
            this.searchBtn.classList.add('e-pv-search-icon');
        }
        else {
            this.searchBtn.classList.remove('e-pv-search-icon');
            this.searchBtn.classList.add('e-pv-search-close');
        }
    }
    onMessageBoxOpen() {
        this.pdfViewerBase.getElement('_search_input').blur();
        this.isMessagePopupOpened = true;
    }
    /**
     * Searches the target text in the PDF document and highlights the occurrences in the pages
     * @param  {string} searchText
     * @param  {boolean} isMatchCase
     * @returns void
     */
    searchText(searchText, isMatchCase) {
        this.searchString = searchText;
        this.isMatchCase = isMatchCase;
        this.searchIndex = 0;
        this.textSearch(searchText);
    }
    /**
     * Searches the next occurrence of the searched text from the current occurrence of the PdfViewer.
     * @returns void
     */
    searchNext() {
        this.nextSearch();
    }
    /**
     * Searches the previous occurrence of the searched text from the current occurrence of the PdfViewer.
     * @returns void
     */
    searchPrevious() {
        this.prevSearch();
    }
    /**
     * Cancels the text search of the PdfViewer.
     * @returns void
     */
    cancelTextSearch() {
        this.resetTextSearch();
    }
    /**
     * @private
     */
    destroy() {
        this.searchCollection = undefined;
    }
    /**
     * @private
     */
    getModuleName() {
        return 'TextSearch';
    }
}

/**
 * export types
 */

/**
 * Print module
 */
class Print {
    /**
     * @private
     */
    constructor(viewer, base) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * Print the PDF document being loaded in the ejPdfViewer control.
     * @returns void
     */
    print() {
        let pageIndex;
        if (this.pdfViewerBase.pageCount > 0) {
            // tslint:disable-next-line:max-line-length
            this.printViewerContainer = createElement('div', { id: this.pdfViewer.element.id + '_print_viewer_container',
                className: 'e-pv-print-viewer-container' });
            this.pdfViewerBase.showPrintLoadingIndicator(true);
            this.iframe = document.createElement('iframe');
            this.iframe.className = 'iframeprint';
            this.iframe.id = 'iframePrint';
            this.iframe.style.position = 'absolute';
            this.iframe.style.top = '-100000000px';
            document.body.appendChild(this.iframe);
            this.frameDoc = this.iframe.contentWindow ? this.iframe.contentWindow : this.iframe.contentDocument;
            this.frameDoc.document.open();
            setTimeout(() => {
                for (pageIndex = 0; pageIndex <= this.pdfViewerBase.pageCount; pageIndex++) {
                    if (pageIndex < this.pdfViewerBase.pageCount) {
                        let pageWidth = this.pdfViewerBase.pageSize[pageIndex].width;
                        let pageHeight = this.pdfViewerBase.pageSize[pageIndex].height;
                        this.pdfViewer.printModule.createRequestForPrint(pageIndex, pageWidth, pageHeight, this.pdfViewerBase.pageCount);
                    }
                    else {
                        this.printWindowOpen();
                    }
                }
            }, 100);
        }
    }
    createRequestForPrint(pageIndex, pageWidth, pageHeight, pageCount) {
        let proxy = this;
        let request = new XMLHttpRequest();
        // tslint: disable-next-line:max-line-length
        // set default zoomFactor value.  
        let jsonObject = { pageNumber: pageIndex, documentId: this.pdfViewerBase.documentId,
            hashId: this.pdfViewerBase.hashId, zoomFactor: 1 };
        request.open('POST', proxy.pdfViewer.serviceUrl + '/PrintImages', false);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.send(JSON.stringify(jsonObject));
        let printImage = request.responseText;
        // tslint:disable-next-line
        let pageImage = new Image();
        pageImage.src = printImage;
        pageImage.height = pageHeight;
        pageImage.width = pageWidth;
        this.printImageContainer = createElement('div', { id: this.pdfViewer.element.id + '_print_image_container' + pageIndex });
        if (pageHeight < pageWidth) {
            this.printImageContainer.style.height = pageWidth + 'px';
            pageImage.height = pageWidth;
            this.printImageContainer.style.width = pageHeight + 'px';
            pageImage.width = pageHeight;
        }
        this.printImageContainer.appendChild(pageImage);
        this.printViewerContainer.appendChild(this.printImageContainer);
    }
    printWindowOpen() {
        let browserUserAgent = navigator.userAgent;
        // tslint: disable-next-line:max-line-length
        if ((browserUserAgent.indexOf('Chrome') !== -1) || (browserUserAgent.indexOf('Safari') !== -1) ||
            (browserUserAgent.indexOf('Firefox')) !== -1) {
            //chrome and firefox
            this.frameDoc.document.write('<!DOCTYPE html>');
            // tslint: disable-next-line:max-line-length
            this.frameDoc.document.write('<html moznomarginboxes mozdisallowselectionprint><head><style>html, body { height: 100%; }'
                + ' img { height: 100%; width: 100%; display: block; }@media print { body { margin: 0cm; }'
                + ' img { width:98%; max-width: 1048px; box-sizing: border-box; }br, button { display: none; }'
                // set default page Height and page Width for A4 size.
                + ' div{ page-break-inside: avoid; }} @page{margin:0mm; size: 816px 1056px;}</style></head><body><center class="loader">');
        }
        else {
            //ie
            this.frameDoc.document.write('<!DOCTYPE html>');
            // tslint: disable-next-line:max-line-length
            this.frameDoc.document.write('<html><head>'
                + '<style>html, body { height: 99%; } img { height: 99%; width: 100%; }@media print { body { margin: 0cm; }'
                + 'img { width:98%; max-width: 1048px; box-sizing: border-box; }br, button { display: none; } '
                // set default page Height and page Width for A4 size.
                + 'div{ page-break-inside: avoid; }} @page{margin:0mm; size: 816px 1056px;}</style></head><body><center>');
        }
        this.frameDoc.document.write(this.printViewerContainer.outerHTML);
        this.pdfViewerBase.showPrintLoadingIndicator(false);
        setTimeout(() => {
            this.iframe.contentWindow.print();
            this.iframe.contentWindow.focus();
            document.body.removeChild(this.iframe);
        }, 200);
    }
    /**
     * @private
     */
    destroy() {
        this.printViewerContainer = undefined;
        this.frameDoc = undefined;
    }
    /**
     * @private
     */
    getModuleName() {
        return 'Print';
    }
}

/**
 * export types
 */

/**
 * PdfViewer component exported items
 */

/**
 * export PDF viewer modules
 */

export { LinkAnnotation, NavigationPane, PdfViewerBase, TextLayer, ContextMenu$1 as ContextMenu, Magnification, Navigation, ThumbnailView, Toolbar$1 as Toolbar, ToolbarSettings, ServerActionSettings, PdfViewer, BookmarkView, TextSelection, TextSearch, Print };
//# sourceMappingURL=ej2-pdfviewer.es2015.js.map
