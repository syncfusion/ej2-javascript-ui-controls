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
var LinkAnnotation = /** @__PURE__ @class */ (function () {
    /**
     * @private
     */
    function LinkAnnotation(pdfViewer, viewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
    }
    /**
     * @private
     */
    // tslint:disable-next-line    
    LinkAnnotation.prototype.renderHyperlinkContent = function (data, pageIndex) {
        if (this.pdfViewer.enableHyperlink) {
            var hyperlinks = data.hyperlinks;
            var hyperlinksBounds = data.hyperlinkBounds;
            var linkAnnotation = data.linkAnnotation;
            var linkPage = data.linkPage;
            var annotationY = data.annotationLocation;
            if (hyperlinks.length > 0 && hyperlinksBounds.length > 0) {
                this.renderWebLink(hyperlinks, hyperlinksBounds, pageIndex);
            }
            if (linkAnnotation.length > 0 && linkPage.length > 0) {
                this.renderDocumentLink(linkAnnotation, linkPage, annotationY, pageIndex);
            }
        }
    };
    LinkAnnotation.prototype.renderWebLink = function (hyperlinks, hyperlinksBounds, pageIndex) {
        var proxy = this;
        var _loop_1 = function (i) {
            var aTag = createElement('a', { id: 'weblinkdiv_' + i });
            // tslint:disable-next-line
            var rect = hyperlinksBounds[i];
            aTag = this_1.setHyperlinkProperties(aTag, rect);
            aTag.title = hyperlinks[i];
            aTag.setAttribute('href', hyperlinks[i]);
            if (this_1.pdfViewer.hyperlinkOpenState === 'CurrentTab') {
                aTag.target = '_self';
                aTag.onclick = function () {
                    proxy.pdfViewer.fireHyperlinkClick(hyperlinks[i]);
                };
            }
            else if (this_1.pdfViewer.hyperlinkOpenState === 'NewTab') {
                aTag.target = '_blank';
                aTag.onclick = function () {
                    proxy.pdfViewer.fireHyperlinkClick(hyperlinks[i]);
                };
            }
            else if (this_1.pdfViewer.hyperlinkOpenState === 'NewWindow') {
                aTag.onclick = function () {
                    proxy.pdfViewer.fireHyperlinkClick(hyperlinks[i]);
                    window.open(hyperlinks[i], '_blank', 'scrollbars=yes,resizable=yes');
                    return false;
                };
            }
            var pageDiv = document.getElementById(this_1.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            pageDiv.appendChild(aTag);
        };
        var this_1 = this;
        for (var i = 0; i < hyperlinks.length; i++) {
            _loop_1(i);
        }
    };
    LinkAnnotation.prototype.renderDocumentLink = function (linkAnnotation, linkPage, annotationY, pageIndex) {
        var proxy = this;
        var _loop_2 = function (i) {
            var aTag = createElement('a', { id: 'linkdiv_' + i });
            // tslint:disable-next-line
            var rect = linkAnnotation[i];
            aTag = this_2.setHyperlinkProperties(aTag, rect);
            aTag.setAttribute('href', '');
            if (linkPage[i] !== undefined && linkPage[i] > 0) {
                var destPageHeight = (this_2.pdfViewerBase.pageSize[pageIndex].height);
                var destLocation = void 0;
                var scrollValue = void 0;
                if (annotationY.length !== 0) {
                    destLocation = (annotationY[i]);
                    // tslint:disable-next-line:max-line-length
                    scrollValue = this_2.pdfViewerBase.pageSize[linkPage[i]].top * this_2.pdfViewerBase.getZoomFactor() + ((destPageHeight - destLocation) * this_2.pdfViewerBase.getZoomFactor());
                }
                else {
                    // tslint:disable-next-line:max-line-length
                    scrollValue = this_2.pdfViewerBase.pageSize[linkPage[i]].top * this_2.pdfViewerBase.getZoomFactor();
                }
                if (scrollValue !== undefined) {
                    aTag.name = scrollValue.toString();
                    aTag.onclick = function () {
                        // tslint:disable-next-line:radix
                        proxy.pdfViewerBase.viewerContainer.scrollTop = parseInt(aTag.name);
                        return false;
                    };
                }
            }
            var pageDiv = document.getElementById(this_2.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            pageDiv.appendChild(aTag);
        };
        var this_2 = this;
        for (var i = 0; i < linkAnnotation.length; i++) {
            _loop_2(i);
        }
    };
    // tslint:disable-next-line
    LinkAnnotation.prototype.setHyperlinkProperties = function (aTag, rect) {
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
    };
    /**
     * @private
     */
    LinkAnnotation.prototype.modifyZindexForTextSelection = function (pageNumber, isAdd) {
        if (this.pdfViewerBase.pageCount > 0) {
            var pageChildNodes = this.pdfViewerBase.getElement('_pageDiv_' + pageNumber).childNodes;
            for (var i = 0; i < pageChildNodes.length; i++) {
                var childElement = pageChildNodes[i];
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
    };
    /**
     * @private
     */
    LinkAnnotation.prototype.modifyZindexForHyperlink = function (element, isAdd) {
        if (isAdd) {
            element.classList.add('e-pv-onselection');
        }
        else {
            element.classList.remove('e-pv-onselection');
        }
    };
    /**
     * @private
     */
    LinkAnnotation.prototype.destroy = function () {
        for (var i = 0; i < this.pdfViewerBase.pageCount - 1; i++) {
            var pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + i);
            if (pageDiv) {
                var aElement = pageDiv.getElementsByTagName('a');
                if (aElement.length !== 0) {
                    for (var index = aElement.length - 1; index >= 0; index--) {
                        aElement[index].parentNode.removeChild(aElement[index]);
                    }
                }
            }
        }
    };
    /**
     * @private
     */
    LinkAnnotation.prototype.getModuleName = function () {
        return 'LinkAnnotation';
    };
    return LinkAnnotation;
}());

/**
 * export types
 */

/**
 * The `NavigationPane` module is used to handle navigation pane for thumbnail and bookmark navigation of PDF viewer.
 * @hidden
 */
var NavigationPane = /** @__PURE__ @class */ (function () {
    function NavigationPane(viewer, base) {
        var _this = this;
        this.thumbnailWidthMin = 200;
        this.contentContainerScrollWidth = 33;
        this.closeButtonLeft = 170;
        this.isBookmarkOpen = false;
        this.isThumbnailOpen = false;
        /**
         * @private
         */
        this.isNavigationPaneResized = false;
        this.resizeIconMouseOver = function (event) {
            event.srcElement.style.cursor = 'default';
        };
        this.resizePanelMouseDown = function (event) {
            var proxy = _this;
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
        this.resizeViewerMouseLeave = function (event) {
            var proxy = _this;
            proxy.isDown = false;
            if (proxy.isNavigationPaneResized && proxy.sideBarContentContainer) {
                proxy.pdfViewerBase.viewerContainer.style.cursor = 'default';
                proxy.sideBarContentContainer.style.cursor = 'default';
                proxy.isNavigationPaneResized = false;
            }
        };
        this.resizePanelMouseMove = function (event) {
            var proxy = _this;
            event.preventDefault();
            if (proxy.isDown && _this.sideBarContentContainer) {
                // prevent the sidebar from becoming too narrow, or from occupying more
                // than half of the available viewer width.
                var width = event.clientX + proxy.offset[0];
                var maxWidth = Math.floor(_this.outerContainerWidth / 2);
                if (width > maxWidth) {
                    width = maxWidth;
                }
                if (width < _this.thumbnailWidthMin) {
                    width = _this.thumbnailWidthMin;
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
                var viewerWidth = (proxy.pdfViewer.element.clientWidth - proxy.getViewerContainerLeft());
                proxy.pdfViewerBase.viewerContainer.style.width = viewerWidth + 'px';
                proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
                proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
                proxy.pdfViewerBase.updateZoomValue();
            }
        };
        this.sideToolbarOnClose = function (event) {
            var proxy = _this;
            proxy.removeThumbnailSelectionIconTheme();
            proxy.removeBookmarkSelectionIconTheme();
            proxy.updateViewerContainerOnClose();
        };
        this.sideToolbarOnClick = function (event) {
            _this.sideBarTitle.textContent = _this.pdfViewer.localeObj.getConstant('Page Thumbnails');
            var proxy = _this;
            var bookmarkPane = document.getElementById(_this.pdfViewer.element.id + '_bookmark_view');
            if (bookmarkPane) {
                proxy.removeBookmarkSelectionIconTheme();
                bookmarkPane.style.display = 'none';
            }
            document.getElementById(_this.pdfViewer.element.id + '_thumbnail_view').style.display = 'flex';
            if (proxy.sideBarContentContainer) {
                if (proxy.sideBarContentContainer.style.display !== 'none') {
                    if (proxy.isBookmarkOpen) {
                        proxy.isThumbnailOpen = true;
                        proxy.setThumbnailSelectionIconTheme();
                        _this.updateViewerContainerOnExpand();
                    }
                    else {
                        proxy.isThumbnailOpen = false;
                        proxy.removeThumbnailSelectionIconTheme();
                        _this.updateViewerContainerOnClose();
                    }
                }
                else {
                    proxy.isThumbnailOpen = true;
                    proxy.setThumbnailSelectionIconTheme();
                    _this.updateViewerContainerOnExpand();
                }
            }
            proxy.isBookmarkOpen = false;
        };
        this.bookmarkButtonOnClick = function (event) {
            var proxy = _this;
            document.getElementById(_this.pdfViewer.element.id + '_thumbnail_view').style.display = 'none';
            _this.removeThumbnailSelectionIconTheme();
            _this.sideBarTitle.textContent = _this.pdfViewer.localeObj.getConstant('Bookmarks');
            _this.pdfViewer.bookmarkViewModule.renderBookmarkcontent();
            if (_this.sideBarContentContainer) {
                if (proxy.sideBarContentContainer.style.display !== 'none') {
                    if (_this.isThumbnailOpen) {
                        _this.setBookmarkSelectionIconTheme();
                        _this.isBookmarkOpen = true;
                        _this.updateViewerContainerOnExpand();
                    }
                    else {
                        _this.removeBookmarkSelectionIconTheme();
                        _this.isBookmarkOpen = false;
                        _this.updateViewerContainerOnClose();
                    }
                }
                else {
                    _this.setBookmarkSelectionIconTheme();
                    _this.isBookmarkOpen = true;
                    _this.updateViewerContainerOnExpand();
                }
            }
            _this.isThumbnailOpen = false;
        };
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * @private
     */
    NavigationPane.prototype.initializeNavigationPane = function () {
        // tslint:disable-next-line:max-line-length
        this.sideBarToolbar = createElement('div', { id: this.pdfViewer.element.id + '_sideBarToolbar', className: 'e-pv-sidebar-toolbar' });
        this.pdfViewerBase.mainContainer.appendChild(this.sideBarToolbar);
        // tslint:disable-next-line:max-line-length
        var sideBarToolbarSplitter = createElement('div', { id: this.pdfViewer.element.id + '_sideBarToolbarSplitter', className: 'e-pv-sidebar-toolbar-splitter' });
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
        var controlLeft = this.getViewerContainerLeft();
        this.pdfViewerBase.viewerContainer.style.left = controlLeft + 'px';
        this.pdfViewerBase.viewerContainer.style.width = (this.pdfViewer.element.clientWidth - controlLeft) + 'px';
        this.sideBarContentContainer.style.display = 'none';
        this.createSidebarToolBar();
        this.createSidebarTitleCloseButton();
        this.createResizeIcon();
        this.sideBarToolbar.addEventListener('mouseup', this.sideToolbarOnMouseup.bind(this));
        this.sideBarContentContainer.addEventListener('mouseup', this.sideBarTitleOnMouseup.bind(this));
    };
    NavigationPane.prototype.createSidebarToolBar = function () {
        // tslint:disable-next-line:max-line-length
        this.thumbnailButton = createElement('button', { id: this.pdfViewer.element.id + '_thumbnail-view', attrs: { 'disabled': 'disabled' } });
        this.thumbnailButton.className = 'e-pv-tbar-btn e-pv-thumbnail-view-button e-btn';
        // tslint:disable-next-line:max-line-length
        var thumbnailButtonSpan = createElement('span', { id: this.pdfViewer.element.id + '_thumbnail-view' + '_icon', className: 'e-pv-thumbnail-view-disable-icon e-pv-icon' });
        this.thumbnailButton.appendChild(thumbnailButtonSpan);
        // tslint:disable-next-line:max-line-length
        var thumbnailTooltip = new Tooltip({ content: this.pdfViewer.localeObj.getConstant('Page Thumbnails'), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
        thumbnailTooltip.appendTo(this.thumbnailButton);
        // tslint:disable-next-line:max-line-length
        this.bookmarkButton = createElement('button', { id: this.pdfViewer.element.id + '_bookmark', attrs: { 'disabled': 'disabled' } });
        this.bookmarkButton.className = 'e-pv-tbar-btn e-pv-bookmark-button e-btn';
        // tslint:disable-next-line:max-line-length
        var buttonSpan = createElement('span', { id: this.pdfViewer.element.id + '_bookmark' + '_icon', className: 'e-pv-bookmark-disable-icon e-pv-icon' });
        this.bookmarkButton.appendChild(buttonSpan);
        // tslint:disable-next-line:max-line-length
        var bookMarkTooltip = new Tooltip({ content: this.pdfViewer.localeObj.getConstant('Bookmarks'), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
        bookMarkTooltip.appendTo(this.bookmarkButton);
        this.sideBarToolbar.appendChild(this.thumbnailButton);
        this.sideBarToolbar.appendChild(this.bookmarkButton);
        this.thumbnailButton.addEventListener('click', this.sideToolbarOnClick);
        this.bookmarkButton.addEventListener('click', this.bookmarkButtonOnClick);
    };
    NavigationPane.prototype.onTooltipBeforeOpen = function (args) {
        if (!this.pdfViewer.toolbarSettings.showTooltip) {
            args.cancel = true;
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.enableThumbnailButton = function () {
        if (this.thumbnailButton) {
            this.thumbnailButton.removeAttribute('disabled');
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-disable-icon');
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-icon');
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.enableBookmarkButton = function () {
        if (this.bookmarkButton) {
            this.bookmarkButton.removeAttribute('disabled');
            this.bookmarkButton.children[0].classList.remove('e-pv-bookmark-disable-icon');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-icon');
        }
    };
    NavigationPane.prototype.createSidebarTitleCloseButton = function () {
        this.closeDiv = createElement('button', { id: this.pdfViewer.element.id + '_close_btn' });
        this.closeDiv.className = 'e-btn e-pv-tbar-btn e-pv-title-close-div e-btn';
        this.closeDiv.style.left = this.closeButtonLeft + 'px';
        // tslint:disable-next-line:max-line-length
        var buttonSpan = createElement('span', { id: this.pdfViewer.element.id + '_close' + '_icon', className: 'e-pv-title-close-icon e-pv-icon' });
        this.closeDiv.appendChild(buttonSpan);
        this.sideBarTitleContainer.appendChild(this.closeDiv);
        this.closeDiv.addEventListener('click', this.sideToolbarOnClose);
    };
    NavigationPane.prototype.createResizeIcon = function () {
        // tslint:disable-next-line:max-line-length
        var resizeIcon = createElement('div', { id: this.pdfViewer.element.id + '_resize', className: 'e-pv-resize-icon e-pv-icon' });
        resizeIcon.style.top = (this.sideBarToolbar.clientHeight) / 2 + 'px';
        resizeIcon.style.position = 'absolute';
        resizeIcon.addEventListener('click', this.sideToolbarOnClose);
        resizeIcon.addEventListener('mouseover', this.resizeIconMouseOver);
        this.sideBarResizer.appendChild(resizeIcon);
    };
    Object.defineProperty(NavigationPane.prototype, "outerContainerWidth", {
        /**
         * @private
         */
        get: function () {
            if (!this.mainContainerWidth) {
                this.mainContainerWidth = this.pdfViewerBase.mainContainer.clientWidth;
            }
            return this.mainContainerWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationPane.prototype, "sideToolbarWidth", {
        /**
         *  @private
         */
        get: function () {
            if (this.sideBarToolbar) {
                return this.sideBarToolbar.clientWidth;
            }
            else {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationPane.prototype, "sideBarContentContainerWidth", {
        /**
         * @private
         */
        get: function () {
            if (this.sideBarContentContainer) {
                return this.sideBarContentContainer.clientWidth;
            }
            else {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    NavigationPane.prototype.updateViewerContainerOnClose = function () {
        var proxy = this;
        if (proxy.sideBarContentContainer) {
            proxy.sideBarContentContainer.style.display = 'none';
            proxy.pdfViewerBase.viewerContainer.style.left = (proxy.sideToolbarWidth) + 'px';
            proxy.pdfViewerBase.viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth - proxy.sideToolbarWidth) + 'px';
            proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
            proxy.pdfViewerBase.updateZoomValue();
        }
    };
    NavigationPane.prototype.updateViewerContainerOnExpand = function () {
        var proxy = this;
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
    };
    /**
     * @private
     */
    NavigationPane.prototype.getViewerContainerLeft = function () {
        return (this.sideToolbarWidth + this.sideBarContentContainerWidth);
    };
    /**
     * @private
     */
    NavigationPane.prototype.getViewerMainContainerWidth = function () {
        return this.pdfViewer.element.clientWidth - this.sideToolbarWidth;
    };
    NavigationPane.prototype.setThumbnailSelectionIconTheme = function () {
        if (this.thumbnailButton) {
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-icon');
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-selection-icon');
            this.thumbnailButton.classList.add('e-pv-thumbnail-view-button-selection');
        }
    };
    NavigationPane.prototype.removeThumbnailSelectionIconTheme = function () {
        if (this.thumbnailButton) {
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-icon');
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-selection-icon');
            this.thumbnailButton.classList.remove('e-pv-thumbnail-view-button-selection');
        }
    };
    NavigationPane.prototype.resetThumbnailIcon = function () {
        if (this.thumbnailButton) {
            this.thumbnailButton.children[0].classList.remove('e-pv-thumbnail-view-icon');
            this.thumbnailButton.children[0].classList.add('e-pv-thumbnail-view-disable-icon');
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.resetThumbnailView = function () {
        if (this.sideBarContentContainer) {
            this.sideBarContentContainer.style.display = 'none';
            this.pdfViewerBase.viewerContainer.style.left = (this.sideToolbarWidth) + 'px';
            this.pdfViewerBase.viewerContainer.style.width = (this.pdfViewer.element.clientWidth - this.sideToolbarWidth) + 'px';
            this.pdfViewerBase.pageContainer.style.width = this.pdfViewerBase.viewerContainer.clientWidth + 'px';
            this.thumbnailButton.setAttribute('disabled', 'disabled');
            this.removeThumbnailSelectionIconTheme();
            this.resetThumbnailIcon();
        }
    };
    NavigationPane.prototype.setBookmarkSelectionIconTheme = function () {
        if (this.bookmarkButton) {
            this.bookmarkButton.children[0].classList.remove('e-pv-bookmark-icon');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-selection-icon');
            this.bookmarkButton.classList.add('e-pv-bookmark-button-selection');
        }
    };
    NavigationPane.prototype.removeBookmarkSelectionIconTheme = function () {
        if (this.bookmarkButton) {
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-icon');
            this.bookmarkButton.children[0].classList.remove('e-pv-bookmark-selection-icon');
            this.bookmarkButton.classList.remove('e-pv-bookmark-button-selection');
        }
    };
    NavigationPane.prototype.sideToolbarOnMouseup = function (event) {
        if (event.target === this.sideBarToolbar) {
            this.pdfViewerBase.focusViewerContainer();
        }
    };
    NavigationPane.prototype.sideBarTitleOnMouseup = function (event) {
        this.pdfViewerBase.focusViewerContainer();
    };
    /**
     * @private
     */
    NavigationPane.prototype.disableBookmarkButton = function () {
        if (this.sideBarContentContainer) {
            this.sideBarContentContainer.style.display = 'none';
            this.bookmarkButton.setAttribute('disabled', 'disabled');
            this.bookmarkButton.children[0].classList.add('e-pv-bookmark-disable-icon');
        }
    };
    /**
     * @private
     */
    NavigationPane.prototype.clear = function () {
        this.removeBookmarkSelectionIconTheme();
        this.removeThumbnailSelectionIconTheme();
    };
    NavigationPane.prototype.getModuleName = function () {
        return 'NavigationPane';
    };
    return NavigationPane;
}());

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * The `PdfViewerBase` module is used to handle base methods of PDF viewer.
 * @hidden
 */
var PdfViewerBase = /** @__PURE__ @class */ (function () {
    function PdfViewerBase(viewer) {
        var _this = this;
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
        this.onWindowResize = function () {
            var proxy = _this;
            // tslint:disable-next-line:max-line-length
            proxy.viewerContainer.style.left = (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) + 'px';
            // tslint:disable-next-line:max-line-length
            var viewerWidth = (proxy.pdfViewer.element.clientWidth - (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0));
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
            if (_this.pdfViewer.enableToolbar && _this.pdfViewer.thumbnailViewModule) {
                proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.currentPageNumber - 1);
            }
            if (proxy.pdfViewer.textSearchModule) {
                proxy.pdfViewer.textSearchModule.textSearchBoxOnResize();
            }
            proxy.updateZoomValue();
        };
        this.viewerContainerOnMousedown = function (event) {
            if (event.button === 0) {
                _this.isViewerMouseDown = true;
                if (event.detail === 1) {
                    _this.focusViewerContainer();
                }
                _this.scrollPosition = _this.viewerContainer.scrollTop / _this.getZoomFactor();
                _this.mouseX = event.clientX;
                _this.mouseY = event.clientY;
                // tslint:disable-next-line
                var isIE = !!document.documentMode;
                if (_this.pdfViewer.textSelectionModule && !_this.isClickedOnScrollBar(event) && !_this.isTextSelectionDisabled) {
                    if (!isIE) {
                        event.preventDefault();
                    }
                    _this.pdfViewer.textSelectionModule.clearTextSelection();
                }
            }
            if (_this.isPanMode) {
                _this.dragX = event.pageX;
                _this.dragY = event.pageY;
                // tslint:disable-next-line:max-line-length
                if (_this.viewerContainer.contains(event.target) && (event.target !== _this.viewerContainer) && (event.target !== _this.pageContainer) && _this.isPanMode) {
                    _this.viewerContainer.style.cursor = 'grabbing';
                }
            }
        };
        this.viewerContainerOnMouseup = function (event) {
            if (_this.isViewerMouseDown) {
                if (_this.scrollHoldTimer) {
                    clearTimeout(_this.scrollHoldTimer);
                    _this.scrollHoldTimer = null;
                }
                if ((_this.scrollPosition * _this.getZoomFactor()) !== _this.viewerContainer.scrollTop) {
                    _this.pageViewScrollChanged(_this.currentPageNumber);
                }
            }
            if (event.button === 0) {
                // 0 is for left button.
                var eventTarget = event.target;
                if (eventTarget.classList.contains('e-pv-page-canvas')) {
                    var idStringArray = eventTarget.id.split('_');
                    // tslint:disable-next-line
                    _this.pdfViewer.firePageClick(event.offsetX, event.offsetY, parseInt(idStringArray[idStringArray.length - 1]) + 1);
                }
                // tslint:disable-next-line:max-line-length
                if (_this.viewerContainer.contains(event.target) && (event.target !== _this.viewerContainer) && (event.target !== _this.pageContainer) && _this.isPanMode) {
                    _this.viewerContainer.style.cursor = 'move';
                    _this.viewerContainer.style.cursor = '-webkit-grab';
                    _this.viewerContainer.style.cursor = '-moz-grab';
                    _this.viewerContainer.style.cursor = 'grab';
                }
            }
            _this.isViewerMouseDown = false;
        };
        this.viewerContainerOnMouseWheel = function (event) {
            _this.isViewerMouseWheel = true;
            if (_this.getRerenderCanvasCreated()) {
                event.preventDefault();
            }
            if (_this.pdfViewer.magnificationModule) {
                _this.pdfViewer.magnificationModule.pageRerenderOnMouseWheel();
                if (event.ctrlKey) {
                    event.preventDefault();
                }
                _this.pdfViewer.magnificationModule.fitPageScrollMouseWheel(event);
            }
            if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled) {
                if (_this.isViewerMouseDown) {
                    if (!event.target.classList.contains('e-pv-text')) {
                        _this.pdfViewer.textSelectionModule.textSelectionOnMouseWheel(_this.currentPageNumber - 1);
                    }
                }
            }
        };
        this.viewerContainerOnKeyDown = function (event) {
            var isMac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
            var isCommandKey = isMac ? event.metaKey : false;
            if (event.ctrlKey || isCommandKey) {
                // add keycodes if shift key is used.
                if ((event.shiftKey && !isMac) || (isMac && !event.shiftKey)) {
                    switch (event.keyCode) {
                        case 38: // up arrow
                        case 33: // page up
                            event.preventDefault();
                            if (_this.currentPageNumber !== 1) {
                                _this.updateScrollTop(0);
                            }
                            break;
                        case 40: // down arrow
                        case 34: // page down
                            event.preventDefault();
                            if (_this.currentPageNumber !== _this.pageCount) {
                                _this.updateScrollTop(_this.pageCount - 1);
                            }
                            break;
                        default:
                            break;
                    }
                }
                switch (event.keyCode) {
                    case 79: // o key
                        if (_this.pdfViewer.toolbarModule && _this.pdfViewer.enableToolbar) {
                            _this.pdfViewer.toolbarModule.openFileDialogBox(event);
                        }
                        break;
                    case 67: // c key
                        if (_this.pdfViewer.textSelectionModule && _this.pdfViewer.enableTextSelection && !_this.isTextSelectionDisabled) {
                            event.preventDefault();
                            _this.pdfViewer.textSelectionModule.copyText();
                        }
                        break;
                    case 70: // f key
                        if (_this.pdfViewer.textSearchModule && _this.pdfViewer.enableTextSearch) {
                            event.preventDefault();
                            _this.pdfViewer.toolbarModule.textSearchButtonHandler();
                        }
                        break;
                    default:
                        break;
                }
            }
            if (_this.pdfViewer.magnificationModule) {
                _this.pdfViewer.magnificationModule.magnifyBehaviorKeyDown(event);
            }
        };
        this.viewerContainerOnMousemove = function (event) {
            _this.mouseX = event.clientX;
            _this.mouseY = event.clientY;
            // tslint:disable-next-line
            var isIE = !!document.documentMode;
            if (_this.isViewerMouseDown) {
                // tslint:disable-next-line:max-line-length
                if (_this.pdfViewer.textSelectionModule && _this.pdfViewer.enableTextSelection && !_this.isTextSelectionDisabled) {
                    // text selection won't perform if we start the selection from hyperlink content by commenting this line.
                    // this region block the toc/hyperlink navigation on sometimes.
                    // if ((event.target as HTMLElement).classList.contains('e-pv-hyperlink') && this.pdfViewer.linkAnnotationModule) {
                    // this.pdfViewer.linkAnnotationModule.modifyZindexForHyperlink((event.target as HTMLElement), true);
                    // }
                    if (!isIE) {
                        event.preventDefault();
                        _this.pdfViewer.textSelectionModule.textSelectionOnMouseMove(event.target, _this.mouseX, _this.mouseY);
                    }
                    else {
                        var selection = window.getSelection();
                        if (!selection.type && !selection.isCollapsed && selection.anchorNode !== null) {
                            _this.pdfViewer.textSelectionModule.isTextSelection = true;
                        }
                    }
                }
                else {
                    event.preventDefault();
                }
            }
            if (_this.isPanMode) {
                _this.panOnMouseMove(event);
            }
        };
        this.panOnMouseMove = function (event) {
            // tslint:disable-next-line:max-line-length
            if (_this.viewerContainer.contains(event.target) && (event.target !== _this.viewerContainer) && (event.target !== _this.pageContainer)) {
                if (_this.isViewerMouseDown) {
                    var deltaX = _this.dragX - event.pageX;
                    var deltaY = _this.dragY - event.pageY;
                    _this.viewerContainer.scrollTop = _this.viewerContainer.scrollTop + deltaY;
                    _this.viewerContainer.scrollLeft = _this.viewerContainer.scrollLeft + deltaX;
                    _this.viewerContainer.style.cursor = 'move';
                    _this.viewerContainer.style.cursor = '-webkit-grabbing';
                    _this.viewerContainer.style.cursor = '-moz-grabbing';
                    _this.viewerContainer.style.cursor = 'grabbing';
                    _this.dragX = event.pageX;
                    _this.dragY = event.pageY;
                }
                else {
                    if (!_this.navigationPane.isNavigationPaneResized) {
                        _this.viewerContainer.style.cursor = 'move';
                        _this.viewerContainer.style.cursor = '-webkit-grab';
                        _this.viewerContainer.style.cursor = '-moz-grab';
                        _this.viewerContainer.style.cursor = 'grab';
                    }
                }
            }
            else {
                if (!_this.navigationPane.isNavigationPaneResized) {
                    _this.viewerContainer.style.cursor = 'auto';
                }
            }
        };
        this.viewerContainerOnMouseLeave = function (event) {
            if (_this.isViewerMouseDown) {
                if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled) {
                    _this.pdfViewer.textSelectionModule.textSelectionOnMouseLeave(event);
                }
            }
        };
        this.viewerContainerOnMouseEnter = function (event) {
            if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled) {
                _this.pdfViewer.textSelectionModule.clear();
            }
        };
        this.viewerContainerOnMouseOver = function (event) {
            // tslint:disable-next-line
            var isIE = !!document.documentMode;
            if (_this.isViewerMouseDown) {
                if (!isIE) {
                    event.preventDefault();
                }
            }
        };
        this.viewerContainerOnClick = function (event) {
            if (event.type === 'dblclick') {
                if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled) {
                    if (event.target.classList.contains('e-pv-text')) {
                        _this.isViewerContainerDoubleClick = true;
                        _this.pdfViewer.textSelectionModule.selectAWord(event.target, event.clientX, event.clientY, false);
                        _this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(true, false);
                        _this.dblClickTimer = setTimeout(function () { _this.applySelection(); }, 100);
                    }
                }
            }
            else {
                if (event.detail === 3) {
                    if (_this.isViewerContainerDoubleClick) {
                        clearTimeout(_this.dblClickTimer);
                        _this.isViewerContainerDoubleClick = false;
                    }
                    if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled) {
                        _this.pdfViewer.textSelectionModule.selectEntireLine(event);
                        _this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(true, false);
                        _this.applySelection();
                    }
                }
            }
        };
        this.viewerContainerOnDragStart = function (event) {
            // tslint:disable-next-line
            var isIE = !!document.documentMode;
            if (!isIE) {
                event.preventDefault();
            }
        };
        // tslint:disable-next-line
        this.viewerContainerOnContextMenuClick = function (event) {
            _this.isViewerMouseDown = false;
        };
        this.onWindowMouseUp = function (event) {
            if (event.button === 0) {
                if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled) {
                    // tslint:disable-next-line:max-line-length
                    if (event.detail === 1 && !_this.viewerContainer.contains(event.target) && !_this.contextMenuModule.contextMenuElement.contains(event.target)) {
                        if (window.getSelection().anchorNode !== null) {
                            _this.pdfViewer.textSelectionModule.textSelectionOnMouseup();
                        }
                    }
                    if (_this.viewerContainer.contains(event.target)) {
                        if (!_this.isClickedOnScrollBar(event) && !_this.isScrollbarMouseDown) {
                            _this.pdfViewer.textSelectionModule.textSelectionOnMouseup();
                        }
                        else {
                            if (window.getSelection().anchorNode !== null) {
                                _this.pdfViewer.textSelectionModule.applySpanForSelection();
                            }
                        }
                    }
                }
            }
            else if (event.button === 2) {
                if (_this.viewerContainer.contains(event.target)) {
                    window.getSelection().removeAllRanges();
                }
            }
            if (_this.isViewerMouseDown) {
                _this.isViewerMouseDown = false;
                if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled) {
                    _this.pdfViewer.textSelectionModule.clear();
                    _this.pdfViewer.textSelectionModule.selectionStartPage = null;
                }
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
            else {
                return true;
            }
        };
        this.onWindowTouchEnd = function (event) {
            // tslint:disable-next-line:max-line-length
            if (!_this.pdfViewer.element.contains(event.target) && !_this.contextMenuModule.contextMenuElement.contains(event.target)) {
                if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled) {
                    _this.pdfViewer.textSelectionModule.clearTextSelection();
                }
            }
        };
        this.viewerContainerOnTouchStart = function (event) {
            var touchPoints = event.touches;
            if (_this.pdfViewer.magnificationModule) {
                _this.pdfViewer.magnificationModule.setTouchPoints(touchPoints[0].clientX, touchPoints[0].clientY);
            }
            if (touchPoints.length === 1) {
                _this.preventTouchEvent(event);
            }
            _this.touchClientX = touchPoints[0].clientX;
            _this.touchClientY = touchPoints[0].clientY;
            // tslint:disable-next-line:max-line-length
            if (touchPoints.length === 1 && !(event.target.classList.contains('e-pv-touch-select-drop') || event.target.classList.contains('e-pv-touch-ellipse'))) {
                if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled) {
                    _this.pdfViewer.textSelectionModule.clearTextSelection();
                    _this.contextMenuModule.contextMenuObj.close();
                    // event.preventDefault();
                    if (!_this.isLongTouchPropagated) {
                        _this.longTouchTimer = setTimeout(function () { _this.viewerContainerOnLongTouch(event); }, 1000);
                    }
                    _this.isLongTouchPropagated = true;
                }
            }
        };
        this.viewerContainerOnLongTouch = function (event) {
            _this.touchClientX = event.touches[0].clientX;
            _this.touchClientY = event.touches[0].clientY;
            event.preventDefault();
            if (_this.pdfViewer.textSelectionModule) {
                _this.pdfViewer.textSelectionModule.initiateTouchSelection(event, _this.touchClientX, _this.touchClientY);
            }
        };
        this.viewerContainerOnPointerDown = function (event) {
            if (event.pointerType === 'touch') {
                _this.pointerCount++;
                if (_this.pointerCount <= 2) {
                    event.preventDefault();
                    _this.pointersForTouch.push(event);
                    if (_this.pointerCount === 2) {
                        _this.pointerCount = 0;
                    }
                    if (_this.pdfViewer.magnificationModule) {
                        _this.pdfViewer.magnificationModule.setTouchPoints(event.clientX, event.clientY);
                    }
                }
            }
        };
        this.viewerContainerOnTouchMove = function (event) {
            _this.preventTouchEvent(event);
            var touchPoints = event.touches;
            if (_this.pdfViewer.magnificationModule) {
                if (touchPoints.length > 1 && _this.pageCount > 0) {
                    // tslint:disable-next-line:max-line-length
                    _this.pdfViewer.magnificationModule.initiatePinchMove(touchPoints[0].clientX, touchPoints[0].clientY, touchPoints[1].clientX, touchPoints[1].clientY);
                }
                else if (touchPoints.length === 1 && _this.getPagesPinchZoomed()) {
                    _this.pdfViewer.magnificationModule.pinchMoveScroll();
                }
            }
            touchPoints = null;
        };
        this.viewerContainerOnPointerMove = function (event) {
            if (event.pointerType === 'touch' && _this.pageCount > 0) {
                event.preventDefault();
                if (_this.pointersForTouch.length === 2) {
                    for (var i = 0; i < _this.pointersForTouch.length; i++) {
                        if (event.pointerId === _this.pointersForTouch[i].pointerId) {
                            _this.pointersForTouch[i] = event;
                            break;
                        }
                    }
                    if (_this.pdfViewer.magnificationModule) {
                        // tslint:disable-next-line:max-line-length
                        _this.pdfViewer.magnificationModule.initiatePinchMove(_this.pointersForTouch[0].clientX, _this.pointersForTouch[0].clientY, _this.pointersForTouch[1].clientX, _this.pointersForTouch[1].clientY);
                    }
                }
            }
        };
        this.viewerContainerOnTouchEnd = function (event) {
            if (_this.pdfViewer.magnificationModule) {
                _this.pdfViewer.magnificationModule.pinchMoveEnd();
            }
            _this.isLongTouchPropagated = false;
            clearInterval(_this.longTouchTimer);
            _this.longTouchTimer = null;
        };
        this.viewerContainerOnPointerEnd = function (event) {
            if (event.pointerType === 'touch') {
                event.preventDefault();
                if (_this.pdfViewer.magnificationModule) {
                    _this.pdfViewer.magnificationModule.pinchMoveEnd();
                }
                _this.pointersForTouch = [];
                _this.pointerCount = 0;
            }
        };
        this.viewerContainerOnScroll = function () {
            var proxy = _this;
            if (_this.scrollHoldTimer) {
                clearTimeout(_this.scrollHoldTimer);
            }
            var pageIndex = _this.currentPageNumber;
            _this.scrollHoldTimer = null;
            _this.contextMenuModule.contextMenuObj.close();
            var verticalScrollValue = _this.viewerContainer.scrollTop;
            // tslint:disable-next-line:max-line-length
            for (var i = 0; i < _this.pageCount; i++) {
                if (_this.pageSize[i] != null) {
                    var pageHeight = _this.getPageHeight(i);
                    // tslint:disable-next-line:max-line-length
                    if ((verticalScrollValue + _this.pageStopValue) <= (_this.getPageTop(i) + pageHeight)) {
                        _this.currentPageNumber = i + 1;
                        break;
                    }
                }
            }
            _this.renderElementsVirtualScroll(_this.currentPageNumber);
            // tslint:disable-next-line:max-line-length
            if (!_this.isViewerMouseDown && !_this.getPinchZoomed() && !_this.getPinchScrolled() && !_this.getPagesPinchZoomed() || _this.isViewerMouseWheel) {
                _this.pageViewScrollChanged(_this.currentPageNumber);
                _this.isViewerMouseWheel = false;
            }
            else {
                _this.showPageLoadingIndicator(_this.currentPageNumber - 1, false);
            }
            if (_this.pdfViewer.toolbarModule) {
                _this.pdfViewer.toolbarModule.updateCurrentPage(_this.currentPageNumber);
                _this.pdfViewer.toolbarModule.updateNavigationButtons();
            }
            if (pageIndex !== _this.currentPageNumber) {
                if (proxy.pdfViewer.thumbnailViewModule) {
                    proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.currentPageNumber - 1);
                    proxy.pdfViewer.thumbnailViewModule.isThumbnailClicked = false;
                }
                _this.pdfViewer.firePageChange(pageIndex);
            }
            if (_this.pdfViewer.magnificationModule) {
                _this.pdfViewer.magnificationModule.updatePagesForFitPage(_this.currentPageNumber - 1);
            }
            var currentPage = _this.getElement('_pageDiv_' + (_this.currentPageNumber - 1));
            if (currentPage) {
                currentPage.style.visibility = 'visible';
            }
            if (_this.isViewerMouseDown) {
                if (_this.getRerenderCanvasCreated()) {
                    _this.pdfViewer.magnificationModule.clearIntervalTimer();
                }
                _this.scrollHoldTimer = setTimeout(function () { _this.initiatePageViewScrollChanged(); }, 100);
            }
        };
        this.pdfViewer = viewer;
        this.navigationPane = new NavigationPane(this.pdfViewer, this);
        this.textLayer = new TextLayer(this.pdfViewer, this);
    }
    /**
     * @private
     */
    PdfViewerBase.prototype.initializeComponent = function () {
        var element = document.getElementById(this.pdfViewer.element.id);
        if (element) {
            var controlWidth = '100%';
            var toolbarDiv = void 0;
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
            var viewerWidth = (this.pdfViewer.element.clientWidth - (this.navigationPane.sideBarToolbar ? this.navigationPane.getViewerContainerLeft() : 0));
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
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.initiatePageRender = function (documentData, password) {
        this.documentId = this.createGUID();
        this.viewerContainer.scrollTop = 0;
        this.showLoadingIndicator(true);
        this.hashId = ' ';
        this.isFileName = false;
        this.saveDocumentInfo();
        documentData = this.checkDocumentData(documentData);
        this.setFileName();
        var jsonObject = this.constructJsonObject(documentData, password);
        this.createAjaxRequest(jsonObject, documentData, password);
    };
    PdfViewerBase.prototype.createAjaxRequest = function (jsonObject, documentData, password) {
        var _this = this;
        var request = new XMLHttpRequest();
        request.open('POST', this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.load);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); // jshint ignore:line
        request.responseType = 'json';
        request.send(JSON.stringify(jsonObject)); // jshint ignore:line
        // tslint:disable-next-line
        request.onreadystatechange = function (event) {
            if (request.readyState === 4 && request.status === 200) {
                // tslint:disable-next-line
                var data = event.currentTarget.response; // jshint ignore:line
                // tslint:disable-next-line:max-line-length
                if (typeof data !== 'object') {
                    data = JSON.parse(data);
                }
                _this.requestSuccess(data, documentData, password);
            }
            else if (request.readyState === 4 && request.status === 400) { // jshint ignore:line
                // error
                _this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
            }
        };
        // tslint:disable-next-line
        request.onerror = function (event) {
            _this.openNotificationPopup();
            _this.showLoadingIndicator(false);
            _this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText); // jshint ignore:line
        };
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.openNotificationPopup = function () {
        this.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('Server error'));
        this.getElement('_notify').classList.add('e-pv-notification-large-content');
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.requestSuccess = function (data, documentData, password) {
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
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.pageRender = function (data) {
        this.document = null;
        this.passwordDialogReset();
        if (this.passwordPopup) {
            this.passwordPopup.hide();
        }
        var pageIndex = 0;
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
            var pageNumber = pageIndex + 1;
            if (this.pageSize[pageNumber]) {
                var pageTop = this.getPageTop(pageNumber);
                var viewerHeight = this.viewerContainer.clientHeight;
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
    };
    PdfViewerBase.prototype.renderPasswordPopup = function (documentData, password) {
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
    };
    PdfViewerBase.prototype.renderCorruptPopup = function () {
        this.pdfViewer.fireDocumentLoadFailed(false, null);
        this.createCorruptedPopup();
        this.documentId = null;
        this.corruptPopup.show();
    };
    PdfViewerBase.prototype.constructJsonObject = function (documentData, password) {
        var jsonObject;
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
    };
    PdfViewerBase.prototype.checkDocumentData = function (documentData) {
        var base64String = documentData.split('base64,')[1];
        if (base64String === undefined) {
            this.isFileName = true;
            if (this.pdfViewer.fileName === null) {
                // tslint:disable-next-line:max-line-length
                var documentStringArray = (documentData.indexOf('\\') !== -1) ? documentData.split('\\') : documentData.split('/');
                this.pdfViewer.fileName = documentStringArray[documentStringArray.length - 1];
                base64String = documentData;
            }
        }
        return base64String;
    };
    PdfViewerBase.prototype.setFileName = function () {
        if (this.pdfViewer.fileName === null) {
            if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.uploadedDocumentName !== null) {
                this.pdfViewer.fileName = this.pdfViewer.toolbarModule.uploadedDocumentName;
            }
            else {
                this.pdfViewer.fileName = 'undefined.pdf';
            }
        }
    };
    PdfViewerBase.prototype.saveDocumentInfo = function () {
        window.sessionStorage.setItem('currentDocument', this.documentId);
        window.sessionStorage.setItem('serviceURL', this.pdfViewer.serviceUrl);
        window.sessionStorage.setItem('unload', this.pdfViewer.serverActionSettings.unload);
    };
    PdfViewerBase.prototype.saveDocumentHashData = function () {
        window.sessionStorage.setItem('hashId', this.hashId);
        window.sessionStorage.setItem('documentLiveCount', this.documentLiveCount.toString());
    };
    PdfViewerBase.prototype.updateWaitingPopup = function (pageNumber) {
        if (this.pageSize[pageNumber].top != null) {
            // tslint:disable-next-line:max-line-length
            var pageCurrentRect = this.getElement('_pageDiv_' + pageNumber).getBoundingClientRect();
            var waitingPopup = this.getElement('_pageDiv_' + pageNumber).firstChild.firstChild;
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
    };
    PdfViewerBase.prototype.createWaitingPopup = function (pageNumber) {
        // tslint:disable-next-line:max-line-length
        this.waitingPopup = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageNumber);
        if (this.waitingPopup) {
            createSpinner({ target: this.waitingPopup });
            this.setLoaderProperties(this.waitingPopup);
        }
    };
    PdfViewerBase.prototype.showLoadingIndicator = function (isShow) {
        this.waitingPopup = this.getElement('_loadingIndicator');
        if (this.waitingPopup != null) {
            if (isShow) {
                showSpinner(this.waitingPopup);
            }
            else {
                hideSpinner(this.waitingPopup);
            }
        }
    };
    PdfViewerBase.prototype.showPageLoadingIndicator = function (pageIndex, isShow) {
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
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.showPrintLoadingIndicator = function (isShow) {
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
    };
    PdfViewerBase.prototype.setLoaderProperties = function (element) {
        var spinnerElement = element.firstChild.firstChild.firstChild;
        spinnerElement.style.height = '48px';
        spinnerElement.style.width = '48px';
        spinnerElement.style.transformOrigin = '24px 24px 24px';
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.updateScrollTop = function (pageNumber) {
        // tslint:disable-next-line
        if (this.pageSize[pageNumber] != null) {
            this.viewerContainer.scrollTop = this.getPageTop(pageNumber);
            this.renderElementsVirtualScroll(pageNumber);
            if (this.renderedPagesList.indexOf(pageNumber) === -1) {
                this.createRequestForRender(pageNumber);
            }
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getZoomFactor = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.zoomFactor;
        }
        else {
            // default value
            return 1;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getPinchZoomed = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPinchZoomed;
        }
        else {
            // default value
            return false;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getMagnified = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isMagnified;
        }
        else {
            // default value
            return false;
        }
    };
    PdfViewerBase.prototype.getPinchScrolled = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPinchScrolled;
        }
        else {
            // default value
            return false;
        }
    };
    PdfViewerBase.prototype.getPagesPinchZoomed = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPagePinchZoomed;
        }
        else {
            // default value
            return false;
        }
    };
    PdfViewerBase.prototype.getPagesZoomed = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPagesZoomed;
        }
        else {
            // default value
            return false;
        }
    };
    PdfViewerBase.prototype.getRerenderCanvasCreated = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isRerenderCanvasCreated;
        }
        else {
            // default value
            return false;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getDocumentId = function () {
        return this.documentId;
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.download = function () {
        if (this.pageCount > 0) {
            this.createRequestForDownload();
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.clear = function (isTriggerEvent) {
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
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.destroy = function () {
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
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.unloadDocument = function (e) {
        var _this = this;
        var documentId = window.sessionStorage.getItem('hashId');
        var documentLiveCount = window.sessionStorage.getItem('documentLiveCount');
        if (documentId !== null) {
            var jsonObject = { hashId: documentId, documentLiveCount: documentLiveCount };
            var request_1 = new XMLHttpRequest();
            request_1.open('POST', window.sessionStorage.getItem('serviceURL') + '/' + window.sessionStorage.getItem('unload'), false);
            request_1.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            request_1.send(JSON.stringify(jsonObject));
            // tslint:disable-next-line
            request_1.onreadystatechange = function (event) {
                if (request_1.readyState === 4 && request_1.status === 400) {
                    // error message
                    _this.pdfViewer.fireAjaxRequestFailed(request_1.status, request_1.statusText);
                }
            };
            // tslint:disable-next-line
            request_1.onerror = function (event) {
                _this.pdfViewer.fireAjaxRequestFailed(request_1.status, request_1.statusText);
            };
        }
        window.sessionStorage.removeItem('hashId');
        window.sessionStorage.removeItem('documentLiveCount');
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.windowSessionStorageClear = function () {
        window.sessionStorage.removeItem('currentDocument');
        window.sessionStorage.removeItem('serviceURL');
        window.sessionStorage.removeItem('unload');
        this.sessionStorage.forEach(function (element) {
            window.sessionStorage.removeItem(element);
        });
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.focusViewerContainer = function () {
        var scrollX = window.scrollX;
        var scrollY = window.scrollY;
        // tslint:disable-next-line
        var parentNode = this.getScrollParent(this.viewerContainer);
        var scrollNodeX = 0;
        var scrollNodeY = 0;
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
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.getScrollParent = function (node) {
        if (node === null || node.nodeName === 'HTML') {
            return null;
        }
        var style = getComputedStyle(node);
        if (this.viewerContainer.id !== node.id && (style.overflowY === 'scroll' || style.overflowY === 'auto')) {
            return node;
        }
        else {
            return this.getScrollParent(node.parentNode);
        }
    };
    PdfViewerBase.prototype.createCorruptedPopup = function () {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        var popupElement = createElement('div', { id: this.pdfViewer.element.id + '_corrupted_popup', className: 'e-pv-corrupted-popup' });
        this.pageContainer.appendChild(popupElement);
        this.corruptPopup = new Dialog({
            showCloseIcon: true, closeOnEscape: true, isModal: true,
            // tslint:disable-next-line:max-line-length
            header: '<div class="e-pv-corrupted-popup-header"> ' + this.pdfViewer.localeObj.getConstant('File Corrupted') + '</div>', content: '<div id="template" class="e-pv-notification-icon"> <div class="e-pv-corrupted-popup-content">' + this.pdfViewer.localeObj.getConstant('File Corrupted Content') + '</div></div>', visible: false,
            // tslint:disable-next-line:max-line-length
            buttons: [{ buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.closeCorruptPopup.bind(this) }],
            target: this.pdfViewer.element, beforeClose: function () {
                _this.corruptPopup.destroy();
                _this.getElement('_corrupted_popup').remove();
                _this.corruptPopup = null;
                _this.waitingPopup = _this.getElement('_loadingIndicator');
                if (_this.waitingPopup != null) {
                    hideSpinner(_this.waitingPopup);
                }
            }
        });
        this.corruptPopup.appendTo(popupElement);
    };
    PdfViewerBase.prototype.closeCorruptPopup = function () {
        this.corruptPopup.hide();
        this.waitingPopup = this.getElement('_loadingIndicator');
        if (this.waitingPopup !== null) {
            hideSpinner(this.waitingPopup);
        }
    };
    PdfViewerBase.prototype.createPrintPopup = function () {
        var element = document.getElementById(this.pdfViewer.element.id);
        this.printMainContainer = createElement('div', { id: this.pdfViewer.element.id + '_printcontainer',
            className: 'e-pv-print-popup-container' });
        element.appendChild(this.printMainContainer);
        this.printMainContainer.style.display = 'none';
        this.printWaitingPopup = createElement('div', { id: this.pdfViewer.element.id + '_printLoadingIndicator',
            className: 'e-pv-print-loading-container' });
        this.printMainContainer.appendChild(this.printWaitingPopup);
        createSpinner({ target: this.printWaitingPopup, cssClass: 'e-spin-center' });
        this.setLoaderProperties(this.printWaitingPopup);
    };
    PdfViewerBase.prototype.createPasswordPopup = function () {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        var popupElement = createElement('div', { id: this.pdfViewer.element.id + '_password_popup', className: 'e-pv-password-popup' });
        this.promptElement = createElement('span', { id: this.pdfViewer.element.id + '_prompt' });
        this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Enter Password');
        popupElement.appendChild(this.promptElement);
        var inputContainer = createElement('span', { className: 'e-input-group e-pv-password-input' });
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
            ], close: this.passwordCancel.bind(this), target: this.pdfViewer.element, beforeClose: function () {
                _this.passwordPopup.destroy();
                _this.getElement('_password_popup').remove();
                _this.passwordPopup = null;
                _this.waitingPopup = _this.getElement('_loadingIndicator');
                if (_this.waitingPopup != null) {
                    hideSpinner(_this.waitingPopup);
                }
            }
        });
        this.passwordPopup.appendTo(popupElement);
        this.passwordInput.addEventListener('keyup', function () {
            if (_this.passwordInput.value === '') {
                _this.passwordDialogReset();
            }
        });
        this.passwordInput.addEventListener('focus', function () {
            _this.passwordInput.parentElement.classList.add('e-input-focus');
        });
        this.passwordInput.addEventListener('blur', function () {
            _this.passwordInput.parentElement.classList.remove('e-input-focus');
        });
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.passwordCancel = function (args) {
        if (args.isInteraction) {
            this.clear(false);
            this.passwordDialogReset();
            this.passwordInput.value = '';
        }
        this.waitingPopup = this.getElement('_loadingIndicator');
        if (this.waitingPopup !== null) {
            hideSpinner(this.waitingPopup);
        }
    };
    PdfViewerBase.prototype.passwordCancelClick = function () {
        this.clear(false);
        this.passwordDialogReset();
        this.passwordPopup.hide();
        this.waitingPopup = this.getElement('_loadingIndicator');
        if (this.waitingPopup !== null) {
            hideSpinner(this.waitingPopup);
        }
    };
    PdfViewerBase.prototype.passwordDialogReset = function () {
        if (this.promptElement) {
            this.promptElement.classList.remove('e-pv-password-error');
            this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Enter Password');
            this.passwordInput.value = '';
        }
    };
    PdfViewerBase.prototype.applyPassword = function () {
        var password = this.passwordInput.value;
        if (password !== '') {
            this.pdfViewer.load(this.document, password);
        }
        this.focusViewerContainer();
    };
    PdfViewerBase.prototype.wireEvents = function () {
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
    };
    PdfViewerBase.prototype.unWireEvents = function () {
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
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.updateZoomValue = function () {
        if (this.pdfViewer.magnificationModule) {
            if (this.pdfViewer.magnificationModule.isAutoZoom) {
                this.pdfViewer.magnificationModule.fitToAuto();
            }
            else if (this.pdfViewer.magnificationModule.fitType === 'fitToWidth') {
                this.pdfViewer.magnificationModule.fitToWidth();
            }
        }
        for (var i = 0; i < this.pageCount; i++) {
            this.applyLeftPosition(i);
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.initiatePanning = function () {
        this.isPanMode = true;
        this.textLayer.modifyTextCursor(false);
        this.disableTextSelectionMode();
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.initiateTextSelectMode = function () {
        this.isPanMode = false;
        this.viewerContainer.style.cursor = 'auto';
        if (this.pdfViewer.textSelectionModule) {
            this.textLayer.modifyTextCursor(true);
            this.pdfViewer.textSelectionModule.enableTextSelectionMode();
        }
    };
    PdfViewerBase.prototype.applySelection = function () {
        if (window.getSelection().anchorNode !== null) {
            this.pdfViewer.textSelectionModule.applySpanForSelection();
        }
        this.isViewerContainerDoubleClick = false;
    };
    PdfViewerBase.prototype.preventTouchEvent = function (event) {
        if (this.pdfViewer.textSelectionModule) {
            if (!this.isPanMode && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.initPageDiv = function (pageValues) {
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateTotalPage();
        }
        if (this.pageCount > 0) {
            var topValue = 0;
            var pageLimit = 0;
            if (this.pageCount > 100) {
                // to render 100 pages intially.
                pageLimit = 100;
                this.pageLimit = pageLimit;
            }
            else {
                pageLimit = this.pageCount;
            }
            for (var i = 0; i < pageLimit; i++) {
                var pageSize = pageValues.pageSizes[i].split(',');
                if (pageValues.pageSizes[i - 1] !== null && i !== 0) {
                    var previousPageHeight = pageValues.pageSizes[i - 1].split(',');
                    topValue = this.pageGap + parseFloat(previousPageHeight[1]) + topValue;
                }
                else {
                    topValue = this.pageGap;
                }
                var size = { width: parseFloat(pageSize[0]), height: parseFloat(pageSize[1]), top: topValue };
                this.pageSize.push(size);
            }
            var limit = this.pageCount < 10 ? this.pageCount : 10;
            for (var i = 0; i < limit; i++) {
                this.renderPageContainer(i, this.getPageWidth(i), this.getPageHeight(i), this.getPageTop(i));
            }
            // tslint:disable-next-line:max-line-length
            this.pageContainer.style.height = this.getPageTop(this.pageSize.length - 1) + this.getPageHeight(this.pageSize.length - 1) + 'px';
            this.pageContainer.style.position = 'relative';
            if (this.pageLimit === 100) {
                var pageDiv = this.getElement('_pageDiv_' + this.pageLimit);
                if (pageDiv === null && this.pageLimit < this.pageCount) {
                    Promise.all([this.renderPagesVirtually()]);
                }
            }
        }
    };
    PdfViewerBase.prototype.renderElementsVirtualScroll = function (pageNumber) {
        var pageValue = pageNumber + 1;
        if (pageValue > this.pageCount) {
            pageValue = this.pageCount;
        }
        for (var i = pageNumber - 1; i <= pageValue; i++) {
            if (i !== -1) {
                this.renderPageElement(i);
            }
        }
        var lowerPageValue = pageNumber - 3;
        if (lowerPageValue < 0) {
            lowerPageValue = 0;
        }
        for (var i = pageNumber - 1; i >= lowerPageValue; i--) {
            if (i !== -1) {
                this.renderPageElement(i);
            }
        }
        for (var j = 0; j < this.pageCount; j++) {
            if (!((lowerPageValue <= j) && (j <= pageValue))) {
                var pageDiv = this.getElement('_pageDiv_' + j);
                var pageCanvas = this.getElement('_pageCanvas_' + j);
                var textLayer = this.getElement('_textLayer_' + j);
                if (pageCanvas) {
                    pageCanvas.parentNode.removeChild(pageCanvas);
                    if (textLayer) {
                        if (this.pdfViewer.textSelectionModule && textLayer.childNodes.length !== 0 && !this.isTextSelectionDisabled) {
                            this.pdfViewer.textSelectionModule.maintainSelectionOnScroll(j, true);
                        }
                        textLayer.parentNode.removeChild(textLayer);
                    }
                    var indexInArray = this.renderedPagesList.indexOf(j);
                    if (indexInArray !== -1) {
                        this.renderedPagesList.splice(indexInArray, 1);
                    }
                }
                if (pageDiv) {
                    pageDiv.parentNode.removeChild(pageDiv);
                    var indexInArray = this.renderedPagesList.indexOf(j);
                    if (indexInArray !== -1) {
                        this.renderedPagesList.splice(indexInArray, 1);
                    }
                }
            }
        }
    };
    PdfViewerBase.prototype.renderPageElement = function (i) {
        var pageDiv = this.getElement('_pageDiv_' + i);
        var canvas = this.getElement('_pageCanvas_' + i);
        if (canvas == null && pageDiv == null && i < this.pageSize.length) {
            // tslint:disable-next-line
            this.renderPageContainer(i, this.getPageWidth(i), this.getPageHeight(i), this.getPageTop(i));
        }
    };
    PdfViewerBase.prototype.renderPagesVirtually = function () {
        return __awaiter(this, void 0, void 0, function () {
            var proxy;
            var _this = this;
            return __generator(this, function (_a) {
                proxy = this;
                setTimeout(function () { _this.initiateRenderPagesVirtually(proxy); }, 500);
                return [2 /*return*/];
            });
        });
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.initiateRenderPagesVirtually = function (proxy) {
        var _this = this;
        var jsonObject = { hashId: proxy.hashId, isCompletePageSizeNotReceived: true };
        var request = new XMLHttpRequest();
        request.open('POST', proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.load);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.responseType = 'json';
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        request.onreadystatechange = function (event) {
            if (request.readyState === 4 && request.status === 200) {
                // tslint:disable-next-line
                var data = event.currentTarget.response;
                if (typeof data !== 'object') {
                    data = JSON.parse(data);
                }
                if (data) {
                    // tslint:disable-next-line
                    var pageValues = data;
                    var topValue = proxy.pageSize[proxy.pageLimit - 1].top;
                    for (var i = proxy.pageLimit; i < proxy.pageCount; i++) {
                        var pageSize = pageValues.pageSizes[i].split(',');
                        if (proxy.pageSize[i - 1] !== null && i !== 0) {
                            var previousPageHeight = proxy.pageSize[i - 1].height;
                            topValue = _this.pageGap + parseFloat(previousPageHeight) + topValue;
                        }
                        var size = { width: parseFloat(pageSize[0]), height: parseFloat(pageSize[1]), top: topValue };
                        _this.pageSize.push(size);
                    }
                    // tslint:disable-next-line:max-line-length
                    _this.pageContainer.style.height = _this.getPageTop(_this.pageSize.length - 1) + _this.getPageHeight(_this.pageSize.length - 1) + 'px';
                }
            }
            else if (request.readyState === 4 && request.status === 400) {
                // error
                _this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText); // jshint ignore:line
            }
        };
        // tslint:disable-next-line
        request.onerror = function (event) {
            _this.openNotificationPopup();
            _this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
        };
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.renderPage = function (data, pageIndex) {
        var _this = this;
        if (data) {
            var pageWidth_1 = this.getPageWidth(pageIndex);
            var pageHeight_1 = this.getPageHeight(pageIndex);
            // tslint:disable-next-line:max-line-length
            var canvas_1 = this.getElement('_pageCanvas_' + pageIndex);
            var pageDiv = this.getElement('_pageDiv_' + pageIndex);
            if (pageDiv) {
                pageDiv.style.width = pageWidth_1 + 'px';
                pageDiv.style.height = pageHeight_1 + 'px';
                pageDiv.style.top = this.getPageTop(pageIndex) + 'px';
                pageDiv.style.left = this.updateLeftPosition(pageIndex) + 'px';
            }
            if (canvas_1) {
                canvas_1.style.width = pageWidth_1 + 'px';
                canvas_1.style.height = pageHeight_1 + 'px';
                var context_1 = canvas_1.getContext('2d');
                // tslint:disable-next-line
                var imageData = data['image'];
                // tslint:disable-next-line
                var matrix_1 = data['transformationMatrix'];
                if (imageData) {
                    var image_1 = new Image();
                    image_1.onload = function () {
                        // tslint:disable-next-line
                        if (parseInt((pageWidth_1 * 1.5).toString()) === image_1.width) {
                            if (!isNaN(parseFloat(canvas_1.style.width))) {
                                canvas_1.style.width = pageWidth_1 + 'px';
                                canvas_1.style.height = pageHeight_1 + 'px';
                                canvas_1.height = pageHeight_1 * 2;
                                canvas_1.width = pageWidth_1 * 2;
                            }
                            // tslint:disable-next-line
                            context_1.setTransform(matrix_1.Elements[0], matrix_1.Elements[1], matrix_1.Elements[2], matrix_1.Elements[3], matrix_1.Elements[4], matrix_1.Elements[5]);
                            context_1.drawImage(image_1, 0, 0, canvas_1.width, canvas_1.height);
                            _this.showPageLoadingIndicator(pageIndex, false);
                            if (pageIndex === 0 && _this.isDocumentLoaded) {
                                _this.pdfViewer.fireDocumentLoad();
                                _this.isDocumentLoaded = false;
                            }
                            if (_this.pdfViewer.magnificationModule) {
                                _this.pdfViewer.magnificationModule.rerenderCountIncrement();
                            }
                        }
                    };
                    image_1.src = imageData;
                    if (this.pdfViewer.magnificationModule) {
                        this.pdfViewer.magnificationModule.pushImageObjects(image_1);
                    }
                }
                var aElement = pageDiv.getElementsByTagName('a');
                if (aElement.length !== 0) {
                    for (var index = aElement.length - 1; index >= 0; index--) {
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
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.renderTextContent = function (data, pageIndex) {
        // tslint:disable-next-line
        var texts = data['textContent'];
        // tslint:disable-next-line
        var bounds = data['textBounds'];
        var textLayer = this.getElement('_textLayer_' + pageIndex);
        if (textLayer) {
            if (textLayer.childNodes.length === 0) {
                this.textLayer.renderTextContents(pageIndex, texts, bounds);
            }
            else {
                this.textLayer.resizeTextContents(pageIndex, texts, bounds);
            }
        }
    };
    PdfViewerBase.prototype.renderPageContainer = function (pageNumber, pageWidth, pageHeight, topValue) {
        // tslint:disable-next-line:max-line-length
        var pageDiv = createElement('div', { id: this.pdfViewer.element.id + '_pageDiv_' + pageNumber, className: 'e-pv-page-div' });
        pageDiv.style.width = pageWidth + 'px';
        pageDiv.style.height = pageHeight + 'px';
        pageDiv.style.left = this.updateLeftPosition(pageNumber) + 'px';
        pageDiv.style.top = topValue + 'px';
        this.pageContainer.appendChild(pageDiv);
        this.pageContainer.style.width = this.viewerContainer.clientWidth + 'px';
        this.createWaitingPopup(pageNumber);
        this.orderPageDivElements(pageDiv, pageNumber);
        this.renderPageCanvas(pageDiv, pageWidth, pageHeight, pageNumber);
    };
    PdfViewerBase.prototype.orderPageDivElements = function (pageDiv, pageIndex) {
        var nextElement = this.getElement('_pageDiv_' + (pageIndex + 1));
        if (nextElement) {
            this.pageContainer.insertBefore(pageDiv, nextElement);
        }
        else {
            this.pageContainer.appendChild(pageDiv);
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.renderPageCanvas = function (pageDiv, pageWidth, pageHeight, pageNumber) {
        // tslint:disable-next-line:max-line-length
        var pageCanvas = createElement('canvas', { id: this.pdfViewer.element.id + '_pageCanvas_' + pageNumber, className: 'e-pv-page-canvas' });
        pageCanvas.width = pageWidth;
        pageCanvas.height = pageHeight;
        pageDiv.appendChild(pageCanvas);
        this.textLayer.addTextLayer(pageNumber, pageWidth, pageHeight, pageDiv);
        return pageCanvas;
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.updateLeftPosition = function (pageIndex) {
        var leftPosition;
        // tslint:disable-next-line:max-line-length
        leftPosition = (this.viewerContainer.getBoundingClientRect().width - this.getPageWidth(pageIndex)) / 2;
        // tslint:disable-next-line:max-line-length
        if (leftPosition < 0 || (this.pdfViewer.magnificationModule ? ((this.pdfViewer.magnificationModule.isAutoZoom && this.getZoomFactor() < 1) || this.pdfViewer.magnificationModule.fitType === 'fitToWidth') : false)) {
            leftPosition = this.pageLeft;
        }
        return leftPosition;
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.applyLeftPosition = function (pageIndex) {
        var leftPosition;
        if (this.pageSize[pageIndex]) {
            // tslint:disable-next-line:max-line-length
            leftPosition = (this.viewerContainer.getBoundingClientRect().width - this.pageSize[pageIndex].width * this.getZoomFactor()) / 2;
            // tslint:disable-next-line:max-line-length
            if (leftPosition < 0 || (this.pdfViewer.magnificationModule ? ((this.pdfViewer.magnificationModule.isAutoZoom && this.getZoomFactor() < 1) || this.pdfViewer.magnificationModule.fitType === 'fitToWidth') : false)) {
                leftPosition = this.pageLeft;
            }
            // tslint:disable-next-line:max-line-length
            var pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            if (pageDiv) {
                pageDiv.style.left = leftPosition + 'px';
            }
        }
    };
    PdfViewerBase.prototype.updatePageHeight = function (viewerHeight, toolbarHeight) {
        return ((viewerHeight - toolbarHeight) / viewerHeight) * 100 + '%';
    };
    PdfViewerBase.prototype.initiatePageViewScrollChanged = function () {
        if ((this.scrollPosition * this.getZoomFactor()) !== this.viewerContainer.scrollTop) {
            this.scrollPosition = this.viewerContainer.scrollTop;
            this.pageViewScrollChanged(this.currentPageNumber);
        }
    };
    PdfViewerBase.prototype.renderCountIncrement = function () {
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.renderCountIncrement();
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.pageViewScrollChanged = function (currentPageNumber) {
        this.reRenderedCount = 0;
        var currentPageIndex = currentPageNumber - 1;
        if (currentPageNumber !== this.previousPage && currentPageNumber <= this.pageCount) {
            if (this.renderedPagesList.indexOf(currentPageIndex) === -1 && !this.getMagnified()) {
                this.createRequestForRender(currentPageIndex);
                this.renderCountIncrement();
            }
        }
        if (!(this.getMagnified() || this.getPagesPinchZoomed())) {
            var previous = currentPageIndex - 1;
            var canvas = this.getElement('_pageCanvas_' + previous);
            if (canvas !== null) {
                if (this.renderedPagesList.indexOf(previous) === -1 && !this.getMagnified()) {
                    this.createRequestForRender(previous);
                    this.renderCountIncrement();
                }
            }
            var next = currentPageIndex + 1;
            if (next < this.pageCount) {
                if (this.renderedPagesList.indexOf(next) === -1 && !this.getMagnified()) {
                    this.createRequestForRender(next);
                    var pageHeight = this.getPageHeight(next);
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
    };
    PdfViewerBase.prototype.downloadDocument = function (blobUrl) {
        var anchorElement = createElement('a');
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
                var padCharacter = blobUrl.indexOf('?') === -1 ? '?' : '&';
                blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
            }
            window.open(blobUrl, '_parent');
        }
    };
    PdfViewerBase.prototype.createRequestForDownload = function () {
        var _this = this;
        var jsonObject;
        jsonObject = { hashId: this.hashId };
        var request = new XMLHttpRequest();
        request.open('POST', this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.download);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); // jshint ignore:line
        request.responseType = 'text';
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        request.onreadystatechange = function (event) {
            if (request.readyState === 4 && request.status === 200) { // jshint ignore:line
                // tslint:disable-next-line
                var data = event.currentTarget.response;
                // tslint:disable-next-line:max-line-length
                if (typeof data === 'object') {
                    data = JSON.parse(data);
                }
                if (data) {
                    var blobUrl = _this.createBlobUrl(data.split('base64,')[1], 'application/pdf');
                    _this.downloadDocument(blobUrl);
                }
            }
            else if (request.readyState === 4 && request.status === 400) {
                // error
                _this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
            }
        };
        // tslint:disable-next-line
        request.onerror = function (event) {
            _this.openNotificationPopup();
            _this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
        };
    };
    PdfViewerBase.prototype.createRequestForRender = function (pageIndex) {
        var _this = this;
        var canvas = this.getElement('_pageCanvas_' + pageIndex);
        var oldCanvas = this.getElement('_oldCanvas_' + pageIndex);
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
            var data = this.getStoredData(pageIndex);
            if (data) {
                this.renderPage(data, pageIndex);
            }
            else {
                var noTileX = 1;
                var noTileY = 1;
                for (var x = 0; x < noTileX; x++) {
                    var _loop_1 = function (y) {
                        var jsonObject = void 0;
                        // tslint:disable-next-line:max-line-length
                        jsonObject = { xCoordinate: x, yCoordinate: y, pageNumber: pageIndex, documentId: this_1.documentId, hashId: this_1.hashId, zoomFactor: this_1.getZoomFactor() };
                        var request = new XMLHttpRequest();
                        request.open('POST', this_1.pdfViewer.serviceUrl + '/' + this_1.pdfViewer.serverActionSettings.renderPages);
                        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                        request.responseType = 'json';
                        request.send(JSON.stringify(jsonObject));
                        // tslint:disable-next-line
                        request.onreadystatechange = function (event) {
                            var proxy = _this;
                            if (request.readyState === 4 && request.status === 200) {
                                // tslint:disable-next-line
                                var data_1 = event.currentTarget.response;
                                // tslint:disable-next-line:max-line-length
                                if (typeof data_1 !== 'object') {
                                    data_1 = JSON.parse(data_1);
                                }
                                if (data_1) {
                                    if (data_1.image) {
                                        proxy.storeWinData(data_1, pageIndex);
                                        proxy.renderPage(data_1, pageIndex);
                                    }
                                }
                            }
                            else if (request.readyState === 4 && request.status === 400) {
                                // error
                                _this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
                            }
                        };
                        // tslint:disable-next-line
                        request.onerror = function (event) {
                            _this.openNotificationPopup();
                            _this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
                        };
                    };
                    var this_1 = this;
                    for (var y = 0; y < noTileY; y++) {
                        _loop_1(y);
                    }
                }
            }
            this.renderedPagesList.push(pageIndex);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.getStoredData = function (pageIndex) {
        // tslint:disable-next-line
        var storedData = this.getWindowSessionStorage(pageIndex) ? this.getWindowSessionStorage(pageIndex) : this.getPinchZoomPage(pageIndex);
        // tslint:disable-next-line
        var data = null;
        if (storedData) {
            // tslint:disable-next-line
            data = storedData;
            if (!this.isPinchZoomStorage) {
                data = JSON.parse(storedData);
            }
            this.isPinchZoomStorage = false;
        }
        return data;
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.storeWinData = function (data, pageIndex) {
        // tslint:disable-next-line
        var blobUrl = this.createBlobUrl(data['image'].split('base64,')[1], 'image/png');
        // tslint:disable-next-line
        var storeObject = {
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
    };
    PdfViewerBase.prototype.getPinchZoomPage = function (pageIndex) {
        // tslint:disable-next-line
        for (var key in this.pinchZoomStorage) {
            if (this.pinchZoomStorage.hasOwnProperty(key)) {
                if (this.pinchZoomStorage[key].index === pageIndex) {
                    this.isPinchZoomStorage = true;
                    return this.pinchZoomStorage[key].pinchZoomStorage;
                }
            }
        }
        return null;
    };
    PdfViewerBase.prototype.getWindowSessionStorage = function (pageIndex) {
        return window.sessionStorage.getItem(this.documentId + '_' + pageIndex + '_' + this.getZoomFactor());
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.manageSessionStorage = function (pageIndex, storeObject) {
        if (this.pageCount > this.sessionLimit && window.sessionStorage.length > this.sessionLimit) {
            var lowerPageValue = this.currentPageNumber - this.sessionLimit;
            if (lowerPageValue < 0) {
                lowerPageValue = 0;
            }
            var higherPageValue = this.currentPageNumber + this.sessionLimit;
            if (higherPageValue > this.pageCount) {
                higherPageValue = this.pageCount;
            }
            for (var i = 0; i <= this.pageCount; i++) {
                if (!((lowerPageValue <= i) && (i < higherPageValue))) {
                    window.sessionStorage.removeItem(this.documentId + '_' + i + '_' + this.getZoomFactor());
                }
            }
        }
        window.sessionStorage.setItem(this.documentId + '_' + pageIndex + '_' + this.getZoomFactor(), JSON.stringify(storeObject));
        this.sessionStorage.push(this.documentId + '_' + pageIndex + '_' + this.getZoomFactor());
    };
    PdfViewerBase.prototype.createBlobUrl = function (base64String, contentType) {
        var sliceSize = 512;
        var byteCharacters = atob(base64String);
        // tslint:disable-next-line
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            // tslint:disable-next-line
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            // tslint:disable-next-line
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, { type: contentType });
        return URL.createObjectURL(blob);
    };
    PdfViewerBase.prototype.getRandomNumber = function () {
        // tslint:disable-next-line
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line
            var random = Math.random() * 16 | 0;
            return random.toString(16);
        });
    };
    PdfViewerBase.prototype.createGUID = function () {
        // tslint:disable-next-line:max-line-length
        return 'Sync_PdfViewer_' + this.getRandomNumber();
    };
    PdfViewerBase.prototype.isClickedOnScrollBar = function (event) {
        var isScrollBar = false;
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
    };
    PdfViewerBase.prototype.setScrollDownValue = function (eventType, boolValue) {
        if (eventType === 'mousedown') {
            this.isScrollbarMouseDown = boolValue;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.disableTextSelectionMode = function () {
        this.isTextSelectionDisabled = true;
        this.viewerContainer.classList.remove('e-enable-text-selection');
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        this.viewerContainer.classList.add('e-disable-text-selection');
        this.viewerContainer.addEventListener('selectstart', function () { return false; });
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getElement = function (idString) {
        return document.getElementById(this.pdfViewer.element.id + idString);
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getPageWidth = function (pageIndex) {
        return this.pageSize[pageIndex].width * this.getZoomFactor();
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getPageHeight = function (pageIndex) {
        return this.pageSize[pageIndex].height * this.getZoomFactor();
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getPageTop = function (pageIndex) {
        return this.pageSize[pageIndex].top * this.getZoomFactor();
    };
    return PdfViewerBase;
}());

/**
 * TextLayer module is used to handle the text content on the control.
 * @hidden
 */
var TextLayer = /** @__PURE__ @class */ (function () {
    /**
     * @private
     */
    function TextLayer(pdfViewer, pdfViewerBase) {
        var _this = this;
        // tslint:disable-next-line
        this.textBoundsArray = [];
        this.closeNotification = function () {
            _this.notifyDialog.hide();
        };
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    TextLayer.prototype.addTextLayer = function (pageNumber, pageWidth, pageHeight, pageDiv) {
        var textDiv = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        if (!textDiv) {
            // tslint:disable-next-line:max-line-length
            var textLayer = createElement('div', { id: this.pdfViewer.element.id + '_textLayer_' + pageNumber, className: 'e-pv-text-layer' });
            textLayer.style.width = pageWidth + 'px';
            textLayer.style.height = pageHeight + 'px';
            pageDiv.appendChild(textLayer);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    TextLayer.prototype.renderTextContents = function (pageNumber, textContents, textBounds) {
        var textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        var canvasElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageNumber);
        if (canvasElement && textLayer.childNodes.length === 0) {
            for (var i = 0; i < textContents.length; i++) {
                // tslint:disable-next-line
                var bounds = textBounds[i];
                // tslint:disable-next-line:max-line-length
                var textDiv = createElement('div', { id: this.pdfViewer.element.id + '_text_' + pageNumber + '_' + i, className: 'e-pv-text' });
                var textContent = textContents[i];
                textContent = textContent.replace(/</g, '&lt;');
                textContent = textContent.replace(/>/g, '&gt;');
                textDiv.innerHTML = textContent.replace(/&nbsp;/g, ' ');
                // tslint:disable-next-line
                var newLine = textContents[i].replace(/  +/g, ' ');
                if (newLine !== ' ') {
                    textDiv.style.whiteSpace = 'pre';
                }
                this.setStyleToTextDiv(textDiv, bounds.X, bounds.Y, bounds.Bottom, bounds.Width, bounds.Height, bounds);
                this.setTextElementProperties(textDiv);
                var context = canvasElement.getContext('2d');
                context.font = textDiv.style.fontSize + ' ' + textDiv.style.fontFamily;
                var contextWidth = context.measureText(textContents[i].replace(/(\r\n|\n|\r)/gm, '')).width;
                var scale = bounds.Width * this.pdfViewerBase.getZoomFactor() / contextWidth;
                textDiv.style.transform = 'scaleX(' + scale + ')';
                textLayer.appendChild(textDiv);
                this.resizeExcessDiv(textLayer, textDiv);
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewer.textSelectionModule && this.pdfViewer.enableTextSelection && !this.pdfViewerBase.isTextSelectionDisabled) {
                    textDiv.classList.add('e-pv-cursor');
                }
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    TextLayer.prototype.resizeTextContents = function (pageNumber, textContents, textBounds) {
        var textLayer = this.pdfViewerBase.getElement('_textLayer_' + pageNumber);
        var canvasElement = this.pdfViewerBase.getElement('_pageCanvas_' + pageNumber);
        if (canvasElement) {
            for (var i = 0; i < textLayer.childNodes.length; i++) {
                // tslint:disable-next-line
                var bounds = void 0;
                var textDiv = this.pdfViewerBase.getElement('_text_' + pageNumber + '_' + i);
                if (textBounds) {
                    bounds = textBounds[i];
                    this.setStyleToTextDiv(textDiv, bounds.X, bounds.Y, bounds.Bottom, bounds.Width, bounds.Height, textBounds);
                }
                this.setTextElementProperties(textDiv);
                var context = canvasElement.getContext('2d');
                context.font = textDiv.style.fontSize + ' ' + textDiv.style.fontFamily;
                var contextWidth = void 0;
                if (textContents) {
                    contextWidth = context.measureText(textContents[i].replace(/(\r\n|\n|\r)/gm, '')).width;
                }
                else {
                    contextWidth = context.measureText(textDiv.textContent.replace(/(\r\n|\n|\r)/gm, '')).width;
                }
                var scale = bounds.Width * this.pdfViewerBase.getZoomFactor() / contextWidth;
                textDiv.style.transform = 'scaleX(' + scale + ')';
                this.resizeExcessDiv(textLayer, textDiv);
            }
        }
        else {
            textLayer.parentElement.removeChild(textLayer);
        }
    };
    TextLayer.prototype.setTextElementProperties = function (textDiv) {
        textDiv.style.fontFamily = 'sans-serif';
        textDiv.style.transformOrigin = '0%';
    };
    /**
     * @private
     */
    TextLayer.prototype.resizeTextContentsOnZoom = function (pageNumber) {
        // tslint:disable-next-line:max-line-length
        var renderObject = window.sessionStorage.getItem(this.pdfViewerBase.getDocumentId() + '_' + pageNumber + '_' + this.getPreviousZoomFactor());
        // tslint:disable-next-line
        var textBounds = [];
        var textContents = [];
        if (renderObject) {
            // tslint:disable-next-line
            var data = JSON.parse(renderObject);
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
            var textElements = this.textBoundsArray.filter(function (obj) {
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
    };
    TextLayer.prototype.resizeExcessDiv = function (textLayer, textDiv) {
        var textLayerPosition = textLayer.getBoundingClientRect();
        var textDivPosition = textDiv.getBoundingClientRect();
        // tslint:disable-next-line:max-line-length
        if ((textDivPosition.width + textDivPosition.left) >= (textLayerPosition.width + textLayerPosition.left) || (textDivPosition.width > textLayerPosition.width)) {
            // 'auto' width is set to reset the size of the div to its contents.
            textDiv.style.width = 'auto';
            // Client width gets reset by 'auto' width property which has the width of the content.
            textDiv.style.width = textDiv.clientWidth + 'px';
        }
    };
    /**
     * @private
     */
    TextLayer.prototype.clearTextLayers = function () {
        var lowerPageValue = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        var higherPageValue = this.pdfViewerBase.currentPageNumber + 1;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        var textLayers = document.querySelectorAll('div[id*="_textLayer_"]');
        for (var i = 0; i < textLayers.length; i++) {
            textLayers[i].style.display = 'block';
            if (this.pdfViewerBase.getMagnified() && (this.getTextSelectionStatus() || this.getTextSearchStatus())) {
                // tslint:disable-next-line:radix
                var pageNumber = parseInt(textLayers[i].id.split('_textLayer_')[1]);
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
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    TextLayer.prototype.convertToSpan = function (pageNumber, divId, fromOffset, toOffset, textString, className) {
        var textDiv = this.pdfViewerBase.getElement('_text_' + pageNumber + '_' + divId);
        var textContent = textString.substring(fromOffset, toOffset);
        var node = document.createTextNode(textContent);
        if (className) {
            var spanElement = createElement('span');
            spanElement.className = className + ' e-pv-text';
            spanElement.appendChild(node);
            textDiv.appendChild(spanElement);
        }
        else {
            textDiv.appendChild(node);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    TextLayer.prototype.applySpanForSelection = function (startPage, endPage, anchorOffsetDiv, focusOffsetDiv, anchorOffset, focusOffset) {
        if (this.pdfViewer.textSelectionModule) {
            for (var i = startPage; i <= endPage; i++) {
                var startId = void 0;
                var endId = void 0;
                // tslint:disable-next-line
                var textDivs = this.pdfViewerBase.getElement('_textLayer_' + i).childNodes;
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
                for (var j = startId; j <= endId; j++) {
                    var textDiv = this.pdfViewerBase.getElement('_text_' + i + '_' + j);
                    var initId = void 0;
                    var lastId = void 0;
                    var length_1 = void 0;
                    length_1 = textDiv.textContent.length;
                    var textContent = textDiv.textContent;
                    textDiv.textContent = '';
                    if (j === startId) {
                        if (i === startPage) {
                            initId = anchorOffset;
                        }
                        else {
                            initId = 0;
                        }
                        lastId = length_1;
                        this.convertToSpan(i, j, 0, initId, textContent, null);
                    }
                    else if (j === endId && i === endPage) {
                        initId = 0;
                        lastId = focusOffset;
                    }
                    else {
                        initId = 0;
                        lastId = length_1;
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
    };
    /**
     * @private
     */
    TextLayer.prototype.clearDivSelection = function () {
        var textLayers = document.querySelectorAll('div[id*="_textLayer_"]');
        for (var i = 0; i < textLayers.length; i++) {
            var childNodes = textLayers[i].childNodes;
            for (var j = 0; j < childNodes.length; j++) {
                var textDiv = childNodes[j];
                var textContent = textDiv.textContent;
                // tslint:disable-next-line:max-line-length
                if (textDiv.childNodes.length > 1 || textDiv.childNodes.length === 1 && (textDiv.childNodes[0].tagName === 'SPAN')) {
                    textDiv.textContent = '';
                    textDiv.textContent = textContent;
                }
            }
        }
    };
    // tslint:disable-next-line
    TextLayer.prototype.setStyleToTextDiv = function (textDiv, left, top, bottom, width, height, textBounds) {
        textDiv.style.left = left * this.pdfViewerBase.getZoomFactor() + 'px';
        textDiv.style.top = top * this.pdfViewerBase.getZoomFactor() + 'px';
        textDiv.style.bottom = bottom * this.pdfViewerBase.getZoomFactor() + 'px';
        textDiv.style.width = width * this.pdfViewerBase.getZoomFactor() + 'px';
        var textHeight = height * this.pdfViewerBase.getZoomFactor();
        textDiv.style.height = textHeight + 'px';
        if (textHeight > 11 && textBounds) {
            textDiv.style.top = (parseFloat(textDiv.style.top) + 2) + 'px';
            // tslint:disable-next-line:radix
            textDiv.style.fontSize = (parseInt(height.toString()) * this.pdfViewerBase.getZoomFactor() - 2.6) + 'px';
        }
        else {
            textDiv.style.fontSize = height * this.pdfViewerBase.getZoomFactor() + 'px';
        }
    };
    TextLayer.prototype.getTextSelectionStatus = function () {
        if (this.pdfViewer.textSelectionModule) {
            return this.pdfViewer.textSelectionModule.isTextSelection;
        }
        else {
            return false;
        }
    };
    /**
     * @private
     */
    TextLayer.prototype.modifyTextCursor = function (isAdd) {
        var textLayerList = document.querySelectorAll('div[id*="_textLayer_"]');
        for (var i = 0; i < textLayerList.length; i++) {
            var childNodes = textLayerList[i].childNodes;
            for (var j = 0; j < childNodes.length; j++) {
                var textElement = childNodes[j];
                if (isAdd) {
                    textElement.classList.add('e-pv-cursor');
                }
                else {
                    textElement.classList.remove('e-pv-cursor');
                }
            }
        }
    };
    TextLayer.prototype.getPreviousZoomFactor = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.previousZoomFactor;
        }
        else {
            return 1;
        }
    };
    /**
     * @private
     */
    TextLayer.prototype.getTextSearchStatus = function () {
        if (this.pdfViewer.textSearchModule) {
            return this.pdfViewer.textSearchModule.isTextSearch;
        }
        else {
            return false;
        }
    };
    /**
     * @private
     */
    TextLayer.prototype.createNotificationPopup = function (text) {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        var popupElement = createElement('div', { id: this.pdfViewer.element.id + '_notify', className: 'e-pv-notification-popup' });
        this.pdfViewerBase.viewerContainer.appendChild(popupElement);
        this.notifyDialog = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true, header: this.pdfViewer.localeObj.getConstant('PdfViewer'),
            buttons: [{
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true },
                    click: this.closeNotification.bind(this)
                }],
            content: '<div class="e-pv-notification-popup-content">' + text + '</div>', target: this.pdfViewer.element,
            beforeClose: function () {
                _this.notifyDialog.destroy();
                _this.pdfViewer.element.removeChild(popupElement);
                if (_this.pdfViewer.textSearchModule) {
                    _this.pdfViewer.textSearch.isMessagePopupOpened = false;
                }
            }
        });
        this.notifyDialog.appendTo(popupElement);
    };
    return TextLayer;
}());

/**
 * ContextMenu module is used to handle the context menus used in the control.
 * @hidden
 */
var ContextMenu$1 = /** @__PURE__ @class */ (function () {
    /**
     * @private
     */
    function ContextMenu$$1(pdfViewer, pdfViewerBase) {
        this.copyContextMenu = [];
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
        this.copyContextMenu = [{ text: this.pdfViewer.localeObj.getConstant('Copy') }];
    }
    /**
     * @private
     */
    ContextMenu$$1.prototype.createContextMenu = function () {
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
    };
    ContextMenu$$1.prototype.contextMenuOnBeforeOpen = function (args) {
        if (this.pdfViewer.textSelectionModule) {
            if (args.event) {
                var isClickWithinSelectionBounds = this.isClickWithinSelectionBounds(args.event);
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
    };
    // tslint:disable-next-line
    ContextMenu$$1.prototype.isClickWithinSelectionBounds = function (event) {
        var isWithin = false;
        var bounds = this.pdfViewer.textSelectionModule.getCurrentSelectionBounds(this.pdfViewerBase.currentPageNumber - 1);
        if (bounds) {
            for (var i = 0; i < bounds.length; i++) {
                var currentBound = bounds[i];
                if (this.getHorizontalValue(currentBound.left) < event.clientX && this.getHorizontalValue(currentBound.right) >
                    event.clientX && this.getVerticalValue(currentBound.top) < event.clientY &&
                    this.getVerticalValue(currentBound.bottom) > event.clientY) {
                    isWithin = true;
                    break;
                }
            }
        }
        return isWithin;
    };
    ContextMenu$$1.prototype.getHorizontalClientValue = function (value) {
        var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        var pageBounds = pageDiv.getBoundingClientRect();
        return (value - pageBounds.left);
    };
    ContextMenu$$1.prototype.getVerticalClientValue = function (value) {
        var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        var pageBounds = pageDiv.getBoundingClientRect();
        return (value - pageBounds.top);
    };
    ContextMenu$$1.prototype.getHorizontalValue = function (value) {
        var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        var pageBounds = pageDiv.getBoundingClientRect();
        return (value * this.pdfViewerBase.getZoomFactor()) + pageBounds.left;
    };
    ContextMenu$$1.prototype.getVerticalValue = function (value) {
        var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        var pageBounds = pageDiv.getBoundingClientRect();
        return (value * this.pdfViewerBase.getZoomFactor()) + pageBounds.top;
    };
    ContextMenu$$1.prototype.onMenuItemSelect = function (args) {
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
    };
    return ContextMenu$$1;
}());

/**
 * Magnification module
 */
var Magnification = /** @__PURE__ @class */ (function () {
    /**
     * @private
     */
    function Magnification(pdfViewer, viewerBase) {
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
    Magnification.prototype.zoomTo = function (zoomValue) {
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
    };
    /**
     * Magnifies the page to the next value in the zoom drop down list.
     * @returns void
     */
    Magnification.prototype.zoomIn = function () {
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
    };
    /**
     * Magnifies the page to the previous value in the zoom drop down list.
     * @returns void
     */
    Magnification.prototype.zoomOut = function () {
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
    };
    /**
     * Scales the page to fit the page width to the width of the container in the control.
     * @returns void
     */
    Magnification.prototype.fitToWidth = function () {
        this.isAutoZoom = false;
        var zoomValue = this.calculateFitZoomFactor('fitToWidth');
        this.onZoomChanged(zoomValue);
    };
    /**
     * @private
     */
    Magnification.prototype.fitToAuto = function () {
        this.isAutoZoom = true;
        var zoomValue = this.calculateFitZoomFactor('fitToWidth');
        this.onZoomChanged(zoomValue);
    };
    /**
     * Scales the page to fit the page in the container in the control.
     * @param  {number} zoomValue
     * @returns void
     */
    Magnification.prototype.fitToPage = function () {
        var zoomValue = this.calculateFitZoomFactor('fitToPage');
        this.isAutoZoom = false;
        this.onZoomChanged(zoomValue);
        this.pdfViewerBase.viewerContainer.style.overflowY = 'hidden';
        // tslint:disable-next-line:max-line-length
        this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top * this.zoomFactor;
    };
    /**
     * Returns zoom factor for the fit zooms.
     */
    Magnification.prototype.calculateFitZoomFactor = function (type) {
        var viewerWidth = this.pdfViewerBase.viewerContainer.getBoundingClientRect().width;
        var viewerHeight = this.pdfViewerBase.viewerContainer.getBoundingClientRect().height;
        var highestWidth = 0;
        var highestHeight = 0;
        this.fitType = type;
        if (this.fitType === 'fitToWidth') {
            var pageWidth = 0;
            for (var i = 0; i < this.pdfViewerBase.pageSize.length; i++) {
                pageWidth = this.pdfViewerBase.pageSize[i].width;
                if (pageWidth > highestWidth) {
                    highestWidth = pageWidth;
                }
            }
            var scaleX = ((viewerWidth - this.scrollWidth) / highestWidth);
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
            var pageHeight = 0;
            for (var i = 0; i < this.pdfViewerBase.pageSize.length; i++) {
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
    };
    /**
     * Performs pinch in operation
     */
    Magnification.prototype.pinchIn = function () {
        this.fitType = null;
        var temporaryZoomFactor = this.zoomFactor - this.pinchStep;
        if (temporaryZoomFactor < 4 && temporaryZoomFactor > 2) {
            temporaryZoomFactor = this.zoomFactor - this.pinchStep;
        }
        if (temporaryZoomFactor < 0.5) {
            temporaryZoomFactor = 0.5;
        }
        this.isPinchZoomed = true;
        this.onZoomChanged(temporaryZoomFactor * 100);
    };
    /**
     * Performs pinch out operation
     */
    Magnification.prototype.pinchOut = function () {
        this.fitType = null;
        var temporaryZoomFactor = this.zoomFactor + this.pinchStep;
        if (temporaryZoomFactor > 2) {
            temporaryZoomFactor = temporaryZoomFactor + this.pinchStep;
        }
        if (temporaryZoomFactor > 4) {
            temporaryZoomFactor = 4;
        }
        this.isPinchZoomed = true;
        this.onZoomChanged(temporaryZoomFactor * 100);
    };
    /**
     * returns zoom level for the zoom factor.
     */
    Magnification.prototype.getZoomLevel = function (zoomFactor) {
        var min = 0;
        var max = this.zoomPercentages.length - 1;
        while ((min <= max) && !(min === 0 && max === 0)) {
            var mid = Math.round((min + max) / 2);
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
    };
    /**
     * @private
     */
    Magnification.prototype.checkZoomFactor = function () {
        return this.zoomPercentages.indexOf(this.zoomFactor * 100) > -1;
    };
    /**
     * Executes when the zoom or pinch operation is performed
     */
    Magnification.prototype.onZoomChanged = function (zoomValue) {
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
    };
    /**
     * @private
     */
    Magnification.prototype.setTouchPoints = function (clientX, clientY) {
        this.touchCenterX = clientX;
        this.touchCenterY = clientY;
    };
    /**
     * @private
     */
    Magnification.prototype.initiatePinchMove = function (pointX1, pointY1, pointX2, pointY2) {
        this.isPinchScrolled = false;
        this.isMagnified = false;
        this.reRenderPageNumber = this.pdfViewerBase.currentPageNumber;
        this.touchCenterX = (pointX1 + pointX2) / 2;
        this.touchCenterY = (pointY1 + pointY2) / 2;
        this.zoomOverPages(pointX1, pointY1, pointX2, pointY2);
    };
    Magnification.prototype.magnifyPages = function () {
        this.clearRerenderTimer();
        if (!this.isPagesZoomed) {
            this.reRenderPageNumber = this.pdfViewerBase.currentPageNumber;
        }
        this.isPagesZoomed = true;
        var scrollValue = this.getMagnifiedValue(this.pdfViewerBase.viewerContainer.scrollTop);
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
            var proxy_1 = this;
            this.pdfViewerBase.renderedPagesList = [];
            this.pdfViewerBase.pinchZoomStorage = [];
            this.pdfViewerBase.viewerContainer.scrollTop = scrollValue;
            this.magnifyPageRerenderTimer = setTimeout(function () { proxy_1.rerenderMagnifiedPages(); }, 800);
        }
    };
    Magnification.prototype.updatePageLocation = function () {
        this.topValue = 0;
        for (var i = 1; i < this.pdfViewerBase.pageSize.length; i++) {
            this.topValue += (this.pdfViewerBase.pageSize[i].height + this.pdfViewerBase.pageGap) * this.zoomFactor;
        }
    };
    Magnification.prototype.clearRerenderTimer = function () {
        clearTimeout(this.rerenderOnScrollTimer);
        clearTimeout(this.magnifyPageRerenderTimer);
        this.clearIntervalTimer();
        this.isPinchScrolled = false;
    };
    /**
     * @private
     */
    Magnification.prototype.clearIntervalTimer = function () {
        clearInterval(this.rerenderInterval);
        this.rerenderInterval = null;
        this.clearRendering();
        var oldCanvases = document.querySelectorAll('canvas[id*="oldCanvas"]');
        for (var i = 0; i < oldCanvases.length; i++) {
            // tslint:disable-next-line
            var pageNumber = parseInt(oldCanvases[i].id.split('_oldCanvas_')[1]);
            var pageCanvas = this.pdfViewerBase.getElement('_pageCanvas_' + pageNumber);
            if (pageCanvas) {
                oldCanvases[i].id = pageCanvas.id;
                pageCanvas.parentElement.removeChild(pageCanvas);
            }
            else {
                oldCanvases[i].id = this.pdfViewer.element.id + '_pageCanvas_' + pageNumber;
            }
        }
        this.isRerenderCanvasCreated = false;
    };
    /**
     * @private
     */
    Magnification.prototype.pushImageObjects = function (image) {
        this.imageObjects.push(image);
    };
    Magnification.prototype.clearRendering = function () {
        if (this.imageObjects) {
            for (var j = 0; j < this.imageObjects.length; j++) {
                if (this.imageObjects[j]) {
                    this.imageObjects[j].onload = null;
                }
            }
            this.imageObjects = [];
        }
    };
    Magnification.prototype.rerenderMagnifiedPages = function () {
        this.renderInSeparateThread(this.reRenderPageNumber);
        this.isPagesZoomed = false;
    };
    Magnification.prototype.renderInSeparateThread = function (pageNumber) {
        var _this = this;
        this.designNewCanvas(pageNumber);
        this.pageRerenderCount = 0;
        this.pdfViewerBase.renderedPagesList = [];
        this.pdfViewerBase.pinchZoomStorage = [];
        this.isMagnified = false;
        this.pdfViewerBase.pageViewScrollChanged(this.reRenderPageNumber);
        // tslint:disable-next-line
        var proxy = this;
        this.rerenderInterval = setInterval(function () { _this.initiateRerender(proxy); }, 1);
    };
    Magnification.prototype.responsivePages = function () {
        this.isPagesZoomed = true;
        this.clearRerenderTimer();
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        var scrollValue = this.pdfViewerBase.viewerContainer.scrollTop;
        this.isAutoZoom = false;
        this.updatePageLocation();
        // tslint:disable-next-line:max-line-length
        this.pdfViewerBase.pageContainer.style.height = this.topValue + this.pdfViewerBase.pageSize[this.pdfViewerBase.pageSize.length - 1].height * this.zoomFactor + 'px';
        this.resizeCanvas(this.pdfViewerBase.currentPageNumber);
        if (this.isPinchZoomed) {
            var pageIndex = this.pdfViewerBase.currentPageNumber - 1;
            var currentPageCanvas = this.pdfViewerBase.getElement('_pageDiv_' + pageIndex);
            if (currentPageCanvas) {
                var currentPageBounds = currentPageCanvas.getBoundingClientRect();
                // update scroll top for the viewer container based on pinch zoom factor
                var previousPageTop = (currentPageBounds.top) * this.previousZoomFactor;
                var previousY = scrollValue + this.touchCenterY;
                // tslint:disable-next-line:max-line-length
                var currentY = (currentPageBounds.top) * this.zoomFactor + ((previousY - previousPageTop) < 0 ? previousY - previousPageTop : (previousY -
                    // tslint:disable-next-line:max-line-length
                    previousPageTop) * (this.zoomFactor / this.previousZoomFactor));
                this.pdfViewerBase.viewerContainer.scrollTop = currentY - this.touchCenterY;
                // update scroll left for the viewer container based on pinch zoom factor
                var prevValue = (currentPageBounds.width * this.previousZoomFactor) / currentPageBounds.width;
                var scaleCorrectionFactor = this.zoomFactor / prevValue - 1;
                var scrollX_1 = this.touchCenterX - currentPageBounds.left;
                this.pdfViewerBase.viewerContainer.scrollLeft += scrollX_1 * scaleCorrectionFactor;
            }
        }
        this.pdfViewerBase.renderedPagesList = [];
        this.pdfViewerBase.pinchZoomStorage = [];
    };
    Magnification.prototype.rerenderOnScroll = function () {
        var _this = this;
        this.isPinchZoomed = false;
        if (this.isPinchScrolled) {
            this.rerenderOnScrollTimer = null;
            this.isPinchScrolled = false;
            this.reRenderPageNumber = this.pdfViewerBase.currentPageNumber;
            this.pdfViewerBase.renderedPagesList = [];
            this.pdfViewerBase.pinchZoomStorage = [];
            if (this.pdfViewerBase.textLayer) {
                var textLayers = document.querySelectorAll('div[id*="_textLayer_"]');
                for (var i = 0; i < textLayers.length; i++) {
                    textLayers[i].style.display = 'block';
                }
            }
            this.pdfViewerBase.pageViewScrollChanged(this.reRenderPageNumber);
            this.isPagePinchZoomed = false;
            this.rerenderOnScrollTimer = setTimeout(function () { _this.pdfViewerBase.pageViewScrollChanged(_this.reRenderPageNumber); }, 300);
        }
    };
    /**
     * @private
     */
    Magnification.prototype.pinchMoveScroll = function () {
        var _this = this;
        if (this.isRerenderCanvasCreated) {
            this.clearIntervalTimer();
        }
        if (this.isPagesZoomed || (!this.isRerenderCanvasCreated && this.isPagePinchZoomed)) {
            this.clearRendering();
            this.isPagesZoomed = false;
            clearTimeout(this.magnifyPageRerenderTimer);
            this.isPinchScrolled = true;
            this.rerenderOnScrollTimer = setTimeout(function () { _this.rerenderOnScroll(); }, 100);
        }
    };
    // tslint:disable-next-line
    Magnification.prototype.initiateRerender = function (proxy) {
        if (proxy.pageRerenderCount === proxy.pdfViewerBase.reRenderedCount && proxy.pageRerenderCount !== 0 && proxy.pdfViewerBase.reRenderedCount !== 0) {
            proxy.reRenderAfterPinch(this.reRenderPageNumber);
        }
    };
    Magnification.prototype.reRenderAfterPinch = function (currentPageIndex) {
        this.pageRerenderCount = 0;
        var lowerPageValue = currentPageIndex - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        var higherPageValue = currentPageIndex + 1;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        for (var i = lowerPageValue; i <= higherPageValue; i++) {
            var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + i);
            var pageCanvas = this.pdfViewerBase.getElement('_pageCanvas_' + i);
            if (pageCanvas) {
                pageCanvas.style.display = 'block';
            }
            var oldCanvas = this.pdfViewerBase.getElement('_oldCanvas_' + i);
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
    };
    Magnification.prototype.designNewCanvas = function (currentPageIndex) {
        if (this.pdfViewerBase.textLayer) {
            this.pdfViewerBase.textLayer.clearTextLayers();
        }
        var lowerPageValue = currentPageIndex - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        var higherPageValue = currentPageIndex + 1; // jshint ignore:line
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        for (var i = lowerPageValue; i <= higherPageValue; i++) {
            var canvas = this.pdfViewerBase.getElement('_pageCanvas_' + i);
            if (canvas) {
                canvas.id = this.pdfViewer.element.id + '_oldCanvas_' + i;
                // tslint:disable-next-line:max-line-length
                var newCanvas = this.pdfViewerBase.renderPageCanvas(this.pdfViewerBase.getElement('_pageDiv_' + i), this.pdfViewerBase.pageSize[i].width * this.zoomFactor, this.pdfViewerBase.pageSize[i].height * this.zoomFactor, i);
                newCanvas.style.display = 'none';
            }
        }
        this.isRerenderCanvasCreated = true;
    };
    /**
     * @private
     */
    Magnification.prototype.pageRerenderOnMouseWheel = function () {
        var _this = this;
        if (this.isRerenderCanvasCreated) {
            this.clearIntervalTimer();
            clearTimeout(this.magnifyPageRerenderTimer);
            if (!this.isPinchScrolled) {
                this.isPinchScrolled = true;
                this.rerenderOnScrollTimer = setTimeout(function () { _this.rerenderOnScroll(); }, 100);
            }
        }
    };
    /**
     * @private
     */
    Magnification.prototype.renderCountIncrement = function () {
        if (this.isRerenderCanvasCreated) {
            this.pageRerenderCount++;
        }
    };
    /**
     * @private
     */
    Magnification.prototype.rerenderCountIncrement = function () {
        if (this.pageRerenderCount > 0) {
            this.pdfViewerBase.reRenderedCount++;
        }
    };
    Magnification.prototype.resizeCanvas = function (pageNumber) {
        var lowerPageValue = pageNumber - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        var higherPageValue = pageNumber + 3;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        for (var i = lowerPageValue; i <= higherPageValue; i++) {
            var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + i);
            var textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + i);
            if (pageDiv) {
                if ((lowerPageValue <= i) && (i <= higherPageValue)) {
                    var isSelectionAvailable = false;
                    if (this.pdfViewer.textSelectionModule) {
                        isSelectionAvailable = this.pdfViewer.textSelectionModule.isSelectionAvailableOnScroll(i);
                    }
                    if (this.pdfViewerBase.pageSize[i] != null) {
                        var width = this.pdfViewerBase.pageSize[i].width * this.zoomFactor;
                        var height = this.pdfViewerBase.pageSize[i].height * this.zoomFactor;
                        pageDiv.style.width = width + 'px';
                        pageDiv.style.height = height + 'px';
                        // tslint:disable-next-line:max-line-length
                        pageDiv.style.top = ((this.pdfViewerBase.pageSize[i].top) * this.zoomFactor) + 'px';
                        pageDiv.style.left = this.pdfViewerBase.updateLeftPosition(i) + 'px';
                        var canvas = this.pdfViewerBase.getElement('_pageCanvas_' + i);
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
                                    var lowerValue = ((pageNumber - 2) === 0) ? 0 : (pageNumber - 2);
                                    // tslint:disable-next-line:max-line-length
                                    var higherValue = ((pageNumber) === (this.pdfViewerBase.pageCount)) ? (this.pdfViewerBase.pageCount - 1) : pageNumber;
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
    };
    Magnification.prototype.zoomOverPages = function (pointX1, pointY1, pointX2, pointY2) {
        // tslint:disable-next-line
        var currentDifference = Math.sqrt(Math.pow((pointX1 - pointX2), 2) + Math.pow((pointY1 - pointY2), 2));
        if (this.previousTouchDifference > -1) {
            if (currentDifference > this.previousTouchDifference) {
                this.pinchOut();
            }
            else if (currentDifference < this.previousTouchDifference) {
                this.pinchIn();
            }
        }
        this.previousTouchDifference = currentDifference;
    };
    /**
     * @private
     */
    Magnification.prototype.pinchMoveEnd = function () {
        this.touchCenterX = 0;
        this.touchCenterY = 0;
        this.previousTouchDifference = -1;
        if (this.isPinchZoomed) {
            this.isPinchScrolled = false;
            this.isPagePinchZoomed = true;
            this.pinchMoveScroll();
        }
    };
    /**
     * @private
     */
    Magnification.prototype.fitPageScrollMouseWheel = function (event) {
        if (this.fitType === 'fitToPage') {
            event.preventDefault();
            if (event.wheelDelta > 0) {
                this.upwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
            }
            else {
                this.downwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
            }
        }
    };
    /**
     * @private
     */
    Magnification.prototype.magnifyBehaviorKeyDown = function (event) {
        var isMac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
        var isCommandKey = isMac ? event.metaKey : false;
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
    };
    Magnification.prototype.upwardScrollFitPage = function (currentPageIndex) {
        if (currentPageIndex > 0) {
            this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex - 1)).style.visibility = 'visible';
            this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.pageSize[currentPageIndex - 1].top * this.zoomFactor;
            this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex)).style.visibility = 'hidden';
        }
    };
    /**
     * @private
     */
    Magnification.prototype.updatePagesForFitPage = function (currentPageIndex) {
        if (this.fitType === 'fitToPage') {
            if (currentPageIndex > 0) {
                this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex - 1)).style.visibility = 'hidden';
            }
            if (currentPageIndex < (this.pdfViewerBase.pageCount - 1)) {
                this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex + 1)).style.visibility = 'hidden';
            }
        }
    };
    Magnification.prototype.downwardScrollFitPage = function (currentPageIndex) {
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
    };
    Magnification.prototype.getMagnifiedValue = function (value) {
        return (value / this.previousZoomFactor) * this.zoomFactor;
    };
    /**
     * @private
     */
    Magnification.prototype.destroy = function () {
        this.imageObjects = undefined;
    };
    /**
     * returns zoom factor when the zoom percent is passed.
     */
    Magnification.prototype.getZoomFactor = function (zoomValue) {
        return zoomValue / 100;
    };
    /**
     * @private
     */
    Magnification.prototype.getModuleName = function () {
        return 'Magnification';
    };
    return Magnification;
}());

/**
 * export types
 */

/**
 * Navigation module
 */
var Navigation = /** @__PURE__ @class */ (function () {
    /**
     * @private
     */
    function Navigation(viewer, viewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
    }
    /**
     * Navigate to Next page of the PDF document
     * @returns void
     */
    Navigation.prototype.goToNextPage = function () {
        this.pageNumber = this.pdfViewerBase.currentPageNumber;
        this.pageNumber++;
        if (this.pageNumber <= this.pdfViewerBase.pageCount) {
            this.pdfViewerBase.updateScrollTop(this.pageNumber - 1);
        }
    };
    /**
     * Navigate to Previous page of the PDF document
     * @returns void
     */
    Navigation.prototype.goToPreviousPage = function () {
        this.pageNumber = this.pdfViewerBase.currentPageNumber;
        this.pageNumber--;
        if (this.pageNumber > 0) {
            this.pdfViewerBase.updateScrollTop(this.pageNumber - 1);
        }
    };
    /**
     * Navigate to given Page number
     * Note : In case if we have provided incorrect page number as argument it will retain the existing page
     * @param  {number} pageNumber
     * @returns void
     */
    Navigation.prototype.goToPage = function (pageNumber) {
        if (pageNumber > 0 && pageNumber <= this.pdfViewerBase.pageCount && this.pdfViewerBase.currentPageNumber !== pageNumber) {
            this.pdfViewerBase.updateScrollTop(pageNumber - 1);
        }
    };
    /**
     * Navigate to First page of the PDF document
     * @returns void
     */
    Navigation.prototype.goToFirstPage = function () {
        this.pageNumber = 0;
        this.pdfViewerBase.updateScrollTop(this.pageNumber);
    };
    /**
     * Navigate to Last page of the PDF document
     * @returns void
     */
    Navigation.prototype.goToLastPage = function () {
        this.pageNumber = this.pdfViewerBase.pageCount - 1;
        this.pdfViewerBase.updateScrollTop(this.pageNumber);
    };
    /**
     * @private
     */
    Navigation.prototype.destroy = function () {
        this.pageNumber = 0;
    };
    /**
     * @private
     */
    Navigation.prototype.getModuleName = function () {
        return 'Navigation';
    };
    return Navigation;
}());

/**
 * export types
 */

/**
 * The `ThumbnailView` module is used to handle thumbnail view navigation of PDF viewer.
 * @hidden
 */
var ThumbnailView = /** @__PURE__ @class */ (function () {
    /**
     * @private
     */
    function ThumbnailView(pdfViewer, pdfViewerBase) {
        var _this = this;
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
        this.thumbnailClick = function (event) {
            var proxy = _this;
            var pageNumber = proxy.getPageNumberFromID(event.srcElement.id);
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
        this.thumbnailMouseOver = function (event) {
            var proxy = _this;
            var pageNumber = proxy.getPageNumberFromID(event.srcElement.id);
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
        this.thumbnailMouseLeave = function (event) {
            var proxy = _this;
            var pageNumber = proxy.getPageNumberFromID(event.srcElement.id);
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
    ThumbnailView.prototype.createThumbnailContainer = function () {
        // tslint:disable-next-line:max-line-length
        this.thumbnailView = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_view', className: 'e-pv-thumbnail-view e-pv-thumbnail-row' });
        this.pdfViewerBase.navigationPane.sideBarContent.appendChild(this.thumbnailView);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    ThumbnailView.prototype.createRequestForThumbnails = function () {
        var proxy = this;
        // tslint:disable-next-line
        var isIE = !!document.documentMode;
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
    };
    ThumbnailView.prototype.requestCreation = function (proxy) {
        var _this = this;
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
        var request = new XMLHttpRequest();
        // tslint:disable-next-line:max-line-length
        var jsonObject = { startPage: proxy.startIndex, endPage: proxy.thumbnailLimit, sizeX: 99.7, sizeY: 141, hashId: proxy.pdfViewerBase.hashId };
        request.open('POST', proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.renderThumbnail);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.responseType = 'json';
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        request.onreadystatechange = function (event) {
            if (request.readyState === 4 && request.status === 200) {
                // tslint:disable-next-line
                var data = event.currentTarget.response;
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
        request.onerror = function (event) {
            _this.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
        };
    };
    /**
     * @private
     */
    ThumbnailView.prototype.gotoThumbnailImage = function (pageNumber) {
        var shouldScroll = this.checkThumbnailScroll(pageNumber);
        if (this.thumbnailView) {
            var thumbnailChild = this.thumbnailView.children[pageNumber];
            if (thumbnailChild) {
                var thumbnailDiv = thumbnailChild.children[0];
                if (shouldScroll) {
                    var offsetTop = thumbnailDiv.offsetTop + thumbnailDiv.clientTop - this.thumbnailTopMargin;
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
    };
    ThumbnailView.prototype.checkThumbnailScroll = function (pageNumber) {
        var shouldScroll = false;
        if (this.thumbnailView) {
            var visibleThumbs = this.getVisibleThumbs();
            var numVisibleThumbs = visibleThumbs.views.length;
            // if the thumbnail isn't currently visible, scroll it into view.
            if (numVisibleThumbs > 0) {
                var visibleFirstPageID = this.getPageNumberFromID(visibleThumbs.first.id);
                // account for only one thumbnail being visible.
                // tslint:disable-next-line:max-line-length
                var visibleLastPageID = (numVisibleThumbs > 1 ? this.getPageNumberFromID(visibleThumbs.last.id) : visibleFirstPageID);
                if (pageNumber <= visibleFirstPageID || pageNumber >= visibleLastPageID) {
                    shouldScroll = true;
                }
                else {
                    // tslint:disable-next-line
                    visibleThumbs.views.some(function (view) {
                        var pageID = view.id.split('_');
                        var thumbPageNumber = pageID[pageID.length - 1];
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
    };
    ThumbnailView.prototype.getPageNumberFromID = function (pageId) {
        var pageID = pageId.split('_');
        var pageNumber = pageID[pageID.length - 1];
        // tslint:disable-next-line:radix
        return parseInt(pageNumber);
    };
    ThumbnailView.prototype.setFocusStyle = function (thumbnail, pageNumber) {
        if (thumbnail.children[0].id === this.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + pageNumber) {
            this.setMouseFocusStyle(thumbnail.children[0]);
        }
    };
    // tslint:disable-next-line
    ThumbnailView.prototype.renderThumbnailImage = function (data) {
        if (this.thumbnailView) {
            for (var i = this.startIndex; i < this.thumbnailLimit; i++) {
                var pageLink = createElement('a', { id: 'page_' + i });
                // tslint:disable-next-line:max-line-length
                var thumbnail = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_' + i, className: 'e-pv-thumbnail e-pv-thumbnail-column' });
                // tslint:disable-next-line:max-line-length
                this.thumbnailSelectionRing = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_Selection_Ring_' + i, className: 'e-pv-thumbnail-selection-ring' });
                thumbnail.appendChild(this.thumbnailSelectionRing);
                // tslint:disable-next-line:max-line-length
                var thumbnailPageNumber = createElement('div', { id: this.pdfViewer.element.id + '_thumbnail_pagenumber_' + i, className: 'e-pv-thumbnail-number' });
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
            var isIE = !!document.documentMode;
            if (!isIE) {
                Promise.all([this.createRequestForThumbnails()]);
            }
            else {
                this.createRequestForThumbnails();
            }
        }
    };
    ThumbnailView.prototype.wireUpEvents = function () {
        if (this.thumbnailSelectionRing) {
            this.thumbnailSelectionRing.addEventListener('click', this.thumbnailClick);
            this.thumbnailSelectionRing.addEventListener('mouseover', this.thumbnailMouseOver);
            this.thumbnailSelectionRing.addEventListener('mouseleave', this.thumbnailMouseLeave);
        }
    };
    ThumbnailView.prototype.unwireUpEvents = function () {
        if (this.thumbnailSelectionRing && this.thumbnailImage) {
            this.thumbnailSelectionRing.removeEventListener('click', this.thumbnailClick);
            this.thumbnailSelectionRing.removeEventListener('mouseover', this.thumbnailMouseOver);
            this.thumbnailSelectionRing.removeEventListener('mouseleave', this.thumbnailMouseLeave);
        }
    };
    ThumbnailView.prototype.goToThumbnailPage = function (pageNumber) {
        if (pageNumber > 0 && pageNumber <= this.pdfViewerBase.pageCount && this.pdfViewerBase.currentPageNumber !== pageNumber) {
            this.pdfViewerBase.updateScrollTop(pageNumber - 1);
        }
        else {
            this.isThumbnailClicked = false;
        }
    };
    ThumbnailView.prototype.setSelectionStyle = function (thumbnailElement) {
        thumbnailElement.classList.remove('e-pv-thumbnail-selection-ring');
        thumbnailElement.classList.remove('e-pv-thumbnail-hover');
        thumbnailElement.classList.remove('e-pv-thumbnail-focus');
        thumbnailElement.classList.add('e-pv-thumbnail-selection');
    };
    ThumbnailView.prototype.setMouseOverStyle = function (thumbnailElement) {
        // tslint:disable-next-line:max-line-length
        if (!thumbnailElement.classList.contains('e-pv-thumbnail-selection')) {
            thumbnailElement.classList.remove('e-pv-thumbnail-selection-ring');
            if (!thumbnailElement.classList.contains('e-pv-thumbnail-focus')) {
                thumbnailElement.classList.add('e-pv-thumbnail-hover');
            }
        }
    };
    ThumbnailView.prototype.setMouseLeaveStyle = function (thumbnailElement) {
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
    };
    ThumbnailView.prototype.setMouseFocusStyle = function (thumbnailElement) {
        thumbnailElement.classList.remove('e-pv-thumbnail-selection');
        thumbnailElement.classList.remove('e-pv-thumbnail-hover');
        thumbnailElement.classList.add('e-pv-thumbnail-focus');
    };
    ThumbnailView.prototype.setMouseFocusToFirstPage = function () {
        var thumbnailChild = this.thumbnailView.children[0];
        if (thumbnailChild) {
            var thumbnailDiv = thumbnailChild.children[0].children[0];
            this.setMouseFocusStyle(thumbnailDiv);
            this.previousElement = thumbnailDiv;
        }
    };
    /**
     * @private
     */
    ThumbnailView.prototype.clear = function () {
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
    };
    ThumbnailView.prototype.getVisibleThumbs = function () {
        return this.getVisibleElements(this.pdfViewerBase.navigationPane.sideBarContent, this.thumbnailView.children);
    };
    ThumbnailView.prototype.getVisibleElements = function (scrollElement, thumbnailViewChildren) {
        var top = scrollElement.scrollTop;
        var bottom = top + scrollElement.clientHeight;
        var left = scrollElement.scrollLeft;
        var right = left + scrollElement.clientWidth;
        function isThumbnailElementBottomAfterViewTop(thumbnailViewChildrenElement) {
            var elementBottom = thumbnailViewChildrenElement.offsetTop + thumbnailViewChildrenElement.clientTop + thumbnailViewChildrenElement.clientHeight;
            return elementBottom > top;
        }
        // tslint:disable-next-line
        var visible = [];
        var thumbnailView;
        var element;
        var currentHeight;
        var viewHeight;
        var viewBottom;
        var hiddenHeight;
        var currentWidth;
        var viewWidth;
        var viewRight;
        var hiddenWidth;
        var percentVisible;
        var firstVisibleElementInd = thumbnailViewChildren.length === 0 ? 0 :
            this.binarySearchFirstItem(thumbnailViewChildren, isThumbnailElementBottomAfterViewTop);
        if (thumbnailViewChildren.length > 0) {
            firstVisibleElementInd =
                this.backtrackBeforeAllVisibleElements(firstVisibleElementInd, thumbnailViewChildren, top);
        }
        var lastEdge = -1;
        for (var i = firstVisibleElementInd, ii = thumbnailViewChildren.length; i < ii; i++) {
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
        var first = visible[0];
        var last = visible[visible.length - 1];
        return { first: first, last: last, views: visible, };
    };
    // tslint:disable-next-line
    ThumbnailView.prototype.binarySearchFirstItem = function (items, condition) {
        var minIndex = 0;
        var maxIndex = items.length - 1;
        if (items.length === 0 || !condition(this.getThumbnailElement(maxIndex))) {
            return items.length - 1;
        }
        if (condition(this.getThumbnailElement(minIndex))) {
            return minIndex;
        }
        while (minIndex < maxIndex) {
            // tslint:disable-next-line:no-bitwise
            var currentIndex = (minIndex + maxIndex) >> 1;
            if (condition(this.getThumbnailElement(currentIndex))) {
                maxIndex = currentIndex;
            }
            else {
                minIndex = currentIndex + 1;
            }
        }
        return minIndex; /* === maxIndex */
    };
    ThumbnailView.prototype.backtrackBeforeAllVisibleElements = function (index, views, top) {
        if (index < 2) {
            return index;
        }
        var thumbnailElement = this.getThumbnailElement(index);
        var pageTop = thumbnailElement.offsetTop + thumbnailElement.clientTop;
        if (pageTop >= top) {
            thumbnailElement = this.getThumbnailElement(index - 1);
            pageTop = thumbnailElement.offsetTop + thumbnailElement.clientTop;
        }
        for (var i = index - 2; i >= 0; --i) {
            thumbnailElement = this.getThumbnailElement(i);
            if (thumbnailElement.offsetTop + thumbnailElement.clientTop + thumbnailElement.clientHeight <= pageTop) {
                break;
            }
            index = i;
        }
        return index;
    };
    ThumbnailView.prototype.getThumbnailElement = function (index) {
        var thumbnailChild = this.thumbnailView.children[index];
        return thumbnailChild.children[0];
    };
    /**
     * @private
     */
    ThumbnailView.prototype.destroy = function () {
        this.clear();
    };
    /**
     * @private
     */
    ThumbnailView.prototype.getModuleName = function () {
        return 'ThumbnailView';
    };
    return ThumbnailView;
}());

/**
 * export types
 */

/**
 * Toolbar module
 */
var Toolbar$1 = /** @__PURE__ @class */ (function () {
    /**
     * @private
     */
    function Toolbar$$1(viewer, viewerBase) {
        var _this = this;
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
        this.onToolbarKeydown = function (event) {
            var targetId = event.target.id;
            if (!(targetId === _this.pdfViewer.element.id + '_currentPageInput' || targetId === _this.pdfViewer.element.id + '_zoomDropDown')) {
                event.preventDefault();
                event.stopPropagation();
            }
        };
        this.toolbarClickHandler = function (args) {
            // tslint:disable-next-line:max-line-length
            if (args.originalEvent.target === _this.zoomDropdownItem.parentElement.childNodes[1] || args.originalEvent.target === _this.zoomDropdownItem.parentElement.childNodes[2]) {
                args.cancel = true;
            }
            else if (args.originalEvent.target.id === _this.pdfViewer.element.id + '_openIcon') {
                var tooltipData = args.originalEvent.target.parentElement.dataset;
                if (tooltipData && tooltipData.tooltipId) {
                    var tooltipElement = document.getElementById(tooltipData.tooltipId);
                    if (tooltipElement) {
                        tooltipElement.style.display = 'none';
                    }
                }
            }
            switch (args.originalEvent.target.id) {
                case _this.pdfViewer.element.id + '_open':
                case _this.pdfViewer.element.id + '_openIcon':
                    _this.fileInputElement.click();
                    break;
                case _this.pdfViewer.element.id + '_download':
                case _this.pdfViewer.element.id + '_downloadIcon':
                    _this.pdfViewerBase.download();
                    break;
                case _this.pdfViewer.element.id + '_print':
                case _this.pdfViewer.element.id + '_printIcon':
                    if (_this.pdfViewer.printModule) {
                        _this.pdfViewer.printModule.print();
                    }
                    break;
                case _this.pdfViewer.element.id + '_firstPage':
                case _this.pdfViewer.element.id + '_firstPageIcon':
                    if (_this.pdfViewer.navigationModule) {
                        _this.pdfViewer.navigationModule.goToFirstPage();
                    }
                    break;
                case _this.pdfViewer.element.id + '_previousPage':
                case _this.pdfViewer.element.id + '_previousPageIcon':
                    if (_this.pdfViewer.navigationModule) {
                        _this.pdfViewer.navigationModule.goToPreviousPage();
                    }
                    break;
                case _this.pdfViewer.element.id + '_nextPage':
                case _this.pdfViewer.element.id + '_nextPageIcon':
                    if (_this.pdfViewer.navigationModule) {
                        _this.pdfViewer.navigationModule.goToNextPage();
                    }
                    break;
                case _this.pdfViewer.element.id + '_lastPage':
                case _this.pdfViewer.element.id + '_lastPageIcon':
                    if (_this.pdfViewer.navigationModule) {
                        _this.pdfViewer.navigationModule.goToLastPage();
                    }
                    break;
                case _this.pdfViewer.element.id + '_zoomIn':
                case _this.pdfViewer.element.id + '_zoomInIcon':
                    _this.pdfViewer.magnificationModule.zoomIn();
                    break;
                case _this.pdfViewer.element.id + '_zoomOut':
                case _this.pdfViewer.element.id + '_zoomOutIcon':
                    _this.pdfViewer.magnificationModule.zoomOut();
                    break;
                case _this.pdfViewer.element.id + '_selectTool':
                case _this.pdfViewer.element.id + '_selectToolIcon':
                    if (!_this.isSelectionToolDisabled) {
                        _this.pdfViewerBase.initiateTextSelectMode();
                        _this.updateInteractionTools(true);
                    }
                    break;
                case _this.pdfViewer.element.id + '_handTool':
                case _this.pdfViewer.element.id + '_handToolIcon':
                    if (!_this.isScrollingToolDisabled) {
                        _this.pdfViewerBase.initiatePanning();
                        _this.updateInteractionTools(false);
                    }
                    break;
                case _this.pdfViewer.element.id + '_search':
                case _this.pdfViewer.element.id + '_searchIcon':
                    _this.textSearchButtonHandler();
                    break;
            }
            // tslint:disable-next-line:max-line-length
            if (!(args.originalEvent.target === _this.zoomDropdownItem.parentElement.childNodes[1] || args.originalEvent.target === _this.zoomDropdownItem.parentElement.childNodes[2] || args.originalEvent.target === _this.currentPageBoxElement || args.originalEvent.target === _this.textSearchItem.childNodes[0])) {
                args.originalEvent.target.blur();
                _this.pdfViewerBase.focusViewerContainer();
            }
        };
        // tslint:disable-next-line
        this.loadDocument = function (args) {
            // tslint:disable-next-line
            var upoadedFiles = args.target.files;
            if (args.target.files[0] !== null) {
                var uploadedFile = upoadedFiles[0];
                if (uploadedFile) {
                    _this.uploadedDocumentName = uploadedFile.name;
                    var reader = new FileReader();
                    reader.readAsDataURL(uploadedFile);
                    // tslint:disable-next-line
                    reader.onload = function (e) {
                        var uploadedFileUrl = e.currentTarget.result;
                        _this.pdfViewer.load(uploadedFileUrl, null);
                    };
                }
            }
        };
        this.navigateToPage = function (args) {
            if (args.which === 13) {
                // tslint:disable-next-line
                var enteredValue = parseInt(_this.currentPageBoxElement.value);
                if (enteredValue !== null) {
                    if (enteredValue > 0 && enteredValue <= _this.pdfViewerBase.pageCount) {
                        if (_this.pdfViewer.navigationModule) {
                            _this.pdfViewer.navigationModule.goToPage(enteredValue);
                        }
                    }
                    else {
                        _this.updateCurrentPage(_this.pdfViewerBase.currentPageNumber);
                    }
                }
                else {
                    _this.updateCurrentPage(_this.pdfViewerBase.currentPageNumber);
                }
                _this.currentPageBoxElement.blur();
                _this.pdfViewerBase.focusViewerContainer();
            }
        };
        this.textBoxFocusOut = function () {
            // tslint:disable-next-line
            if (_this.currentPageBox.value === null || _this.currentPageBox.value >= _this.pdfViewerBase.pageCount || _this.currentPageBox.value !== _this.pdfViewerBase.currentPageNumber) {
                _this.updateCurrentPage(_this.pdfViewerBase.currentPageNumber);
            }
        };
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
    }
    /**
     * @private
     */
    Toolbar$$1.prototype.intializeToolbar = function (width) {
        var toolbarDiv = this.createToolbar(width);
        // tslint:disable-next-line
        var isIE = !!document.documentMode;
        if (isIE) {
            this.totalPageItem.classList.add('e-pv-total-page-ms');
        }
        this.createFileElement(toolbarDiv);
        this.wireEvent();
        this.updateToolbarItems();
        this.applyToolbarSettings();
        this.initialEnableItems();
        return toolbarDiv;
    };
    /**
     * Shows /hides the toolbar in the PdfViewer
     * @param  {boolean} enableToolbar
     * @returns void
     */
    Toolbar$$1.prototype.showToolbar = function (enableToolbar) {
        var toolbar = this.toolbarElement;
        if (enableToolbar) {
            toolbar.style.display = 'block';
        }
        else {
            toolbar.style.display = 'none';
            this.pdfViewerBase.navigationPane.sideBarToolbar.style.display = 'none';
        }
    };
    /**
     * Shows /hides the the toolbar items in the PdfViewer
     * @param  {string[]} items
     * @param  {boolean} isVisible
     * @returns void
     */
    Toolbar$$1.prototype.showToolbarItem = function (items, isVisible) {
        for (var i = 0; i < items.length; i++) {
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
    };
    /**
     * Enables /disables the the toolbar items in the PdfViewer
     * @param  {string[]} items
     * @param  {boolean} isEnable
     * @returns void
     */
    Toolbar$$1.prototype.enableToolbarItem = function (items, isEnable) {
        for (var i = 0; i < items.length; i++) {
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
    };
    Toolbar$$1.prototype.showOpenOption = function (enableOpenOption) {
        this.isOpenBtnVisible = enableOpenOption;
        this.applyHideToToolbar(enableOpenOption, 0, 0);
    };
    Toolbar$$1.prototype.showPageNavigationTool = function (enablePageNavigationTool) {
        this.isNavigationToolVisible = enablePageNavigationTool;
        this.applyHideToToolbar(enablePageNavigationTool, 2, 7);
    };
    Toolbar$$1.prototype.showMagnificationTool = function (enableMagnificationTool) {
        this.isMagnificationToolVisible = enableMagnificationTool;
        this.applyHideToToolbar(enableMagnificationTool, 9, 11);
    };
    Toolbar$$1.prototype.showSelectionTool = function (enableSelectionTool) {
        this.isSelectionBtnVisible = enableSelectionTool;
        this.applyHideToToolbar(enableSelectionTool, 13, 13);
    };
    Toolbar$$1.prototype.showScrollingTool = function (enableScrollingTool) {
        this.isScrollingBtnVisible = enableScrollingTool;
        this.applyHideToToolbar(enableScrollingTool, 14, 14);
    };
    Toolbar$$1.prototype.showDownloadOption = function (enableDownloadOption) {
        this.isDownloadBtnVisible = enableDownloadOption;
        this.applyHideToToolbar(enableDownloadOption, 16, 16);
    };
    Toolbar$$1.prototype.showPrintOption = function (enablePrintOption) {
        this.isPrintBtnVisible = enablePrintOption;
        this.applyHideToToolbar(enablePrintOption, 17, 17);
    };
    Toolbar$$1.prototype.showSearchOption = function (enableSearchOption) {
        this.isSearchBtnVisible = enableSearchOption;
        this.applyHideToToolbar(enableSearchOption, 15, 15);
    };
    Toolbar$$1.prototype.enableOpenOption = function (enableOpenOption) {
        this.toolbar.enableItems(this.openDocumentItem.parentElement, enableOpenOption);
    };
    Toolbar$$1.prototype.enablePageNavigationTool = function (enablePageNavigationTool) {
        this.toolbar.enableItems(this.firstPageItem.parentElement, enablePageNavigationTool);
        this.toolbar.enableItems(this.previousPageItem.parentElement, enablePageNavigationTool);
        this.toolbar.enableItems(this.nextPageItem.parentElement, enablePageNavigationTool);
        this.toolbar.enableItems(this.lastPageItem.parentElement, enablePageNavigationTool);
        this.currentPageBox.readonly = !enablePageNavigationTool;
    };
    Toolbar$$1.prototype.enableMagnificationTool = function (enableMagnificationTool) {
        this.toolbar.enableItems(this.zoomInItem.parentElement, enableMagnificationTool);
        this.toolbar.enableItems(this.zoomOutItem.parentElement, enableMagnificationTool);
        this.zoomDropDown.readonly = !enableMagnificationTool;
    };
    Toolbar$$1.prototype.enableSelectionTool = function (enableSelectionTool) {
        this.toolbar.enableItems(this.textSelectItem.parentElement, enableSelectionTool);
    };
    Toolbar$$1.prototype.enableScrollingTool = function (enableScrollingTool) {
        this.toolbar.enableItems(this.panItem.parentElement, enableScrollingTool);
    };
    Toolbar$$1.prototype.enableDownloadOption = function (enableDownloadOption) {
        this.toolbar.enableItems(this.downloadItem.parentElement, enableDownloadOption);
    };
    Toolbar$$1.prototype.enablePrintOption = function (enablePrintOption) {
        this.toolbar.enableItems(this.printItem.parentElement, enablePrintOption);
    };
    Toolbar$$1.prototype.enableSearchOption = function (enableSearchOption) {
        this.toolbar.enableItems(this.textSearchItem.parentElement, enableSearchOption);
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.resetToolbar = function () {
        this.currentPageBox.min = 0;
        this.currentPageBox.value = 0;
        this.updateTotalPage();
        this.updateToolbarItems();
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.updateToolbarItems = function () {
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
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.updateNavigationButtons = function () {
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
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.updateZoomButtons = function () {
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
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.destroy = function () {
        this.unWireEvent();
        this.toolbar.destroy();
        this.toolbarElement.remove();
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.updateCurrentPage = function (pageIndex) {
        if (this.currentPageBox.value === pageIndex) {
            this.currentPageBoxElement.value = pageIndex.toString();
        }
        this.currentPageBox.value = pageIndex;
        this.pdfViewerBase.currentPageNumber = pageIndex;
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.updateTotalPage = function () {
        if (this.pdfViewerBase.pageCount > 0) {
            this.currentPageBox.min = 1;
        }
        this.totalPageItem.textContent = 'of ' + this.pdfViewerBase.pageCount.toString();
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.openFileDialogBox = function (event) {
        event.preventDefault();
        this.fileInputElement.click();
    };
    Toolbar$$1.prototype.createToolbar = function (controlWidth) {
        // tslint:disable-next-line:max-line-length
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_toolbarContainer', className: 'e-pv-toolbar' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
        this.itemsContainer = createElement('div', { id: this.pdfViewer.element.id + '_toolbarItemsContainer' });
        // tslint:disable-next-line:max-line-length
        var openButtonContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_open', this.pdfViewer.localeObj.getConstant('Open'), 'e-pv-open-document');
        this.openDocumentItem = openButtonContainer.firstChild;
        this.itemsContainer.appendChild(openButtonContainer);
        this.toolbarElement.appendChild(this.itemsContainer);
        var seperatorDiv1 = createElement('div', { className: 'e-separator' });
        this.itemsContainer.appendChild(seperatorDiv1);
        // tslint:disable-next-line:max-line-length
        var firstPageContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_firstPage', this.pdfViewer.localeObj.getConstant('Go To First Page'), 'e-pv-first-page-navigation');
        this.firstPageItem = firstPageContainer.firstChild;
        this.itemsContainer.appendChild(firstPageContainer);
        // tslint:disable-next-line:max-line-length
        var previousContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_previousPage', this.pdfViewer.localeObj.getConstant('Previous Page'), 'e-pv-previous-page-navigation');
        this.previousPageItem = previousContainer.firstChild;
        this.itemsContainer.appendChild(previousContainer);
        // tslint:disable-next-line:max-line-length
        var nextContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_nextPage', this.pdfViewer.localeObj.getConstant('Next Page'), 'e-pv-next-page-navigation');
        this.nextPageItem = nextContainer.firstChild;
        this.itemsContainer.appendChild(nextContainer);
        // tslint:disable-next-line:max-line-length
        var lastPageContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_lastPage', this.pdfViewer.localeObj.getConstant('Go To Last Page'), 'e-pv-last-page-navigation');
        this.lastPageItem = lastPageContainer.firstChild;
        this.itemsContainer.appendChild(lastPageContainer);
        // tslint:disable-next-line:max-line-length
        var goToPageContainer = this.createToolbarItem('input', this.pdfViewer.element.id + '_currentPageInput', this.pdfViewer.localeObj.getConstant('Page Number'), null);
        this.itemsContainer.appendChild(goToPageContainer);
        this.currentPageBox = new NumericTextBox({ value: 0, format: '##', cssClass: 'e-pv-current-page-box', showSpinButton: false });
        this.currentPageBoxElement = goToPageContainer.firstChild;
        this.currentPageBox.appendTo(this.currentPageBoxElement);
        // tslint:disable-next-line:max-line-length
        var totalPageContainer = this.createToolbarItem('span', this.pdfViewer.element.id + '_totalPage', null, 'e-pv-total-page');
        this.totalPageItem = totalPageContainer.firstChild;
        this.itemsContainer.appendChild(totalPageContainer);
        this.updateTotalPage();
        var seperatorDiv2 = createElement('div', { className: 'e-separator' });
        this.itemsContainer.appendChild(seperatorDiv2);
        // tslint:disable-next-line:max-line-length
        var zoomOutContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_zoomOut', this.pdfViewer.localeObj.getConstant('Zoom Out'), 'e-pv-zoom-out');
        this.zoomOutItem = zoomOutContainer.firstChild;
        this.itemsContainer.appendChild(zoomOutContainer);
        // tslint:disable-next-line:max-line-length
        var zoomInContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_zoomIn', this.pdfViewer.localeObj.getConstant('Zoom In'), 'e-pv-zoom-in');
        this.zoomInItem = zoomInContainer.firstChild;
        this.itemsContainer.appendChild(zoomInContainer);
        // tslint:disable-next-line:max-line-length
        var zoomDropdownContainer = this.createToolbarItem('input', this.pdfViewer.element.id + '_zoomDropDown', this.pdfViewer.localeObj.getConstant('Zoom'), null);
        zoomDropdownContainer.className = zoomDropdownContainer.className + ' e-pv-zoom-drop-down-container';
        this.zoomDropdownItem = zoomDropdownContainer.firstChild;
        this.itemsContainer.appendChild(zoomDropdownContainer);
        var seperatorDiv3 = createElement('div', { className: 'e-separator' });
        this.itemsContainer.appendChild(seperatorDiv3);
        // tslint:disable-next-line:max-line-length
        var selectToolContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_selectTool', this.pdfViewer.localeObj.getConstant('Text Selection'), 'e-pv-text-select-tool');
        this.textSelectItem = selectToolContainer.firstChild;
        this.itemsContainer.appendChild(selectToolContainer);
        // tslint:disable-next-line:max-line-length
        var handToolContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_handTool', this.pdfViewer.localeObj.getConstant('Panning'), 'e-pv-pan-tool');
        this.panItem = handToolContainer.firstChild;
        this.itemsContainer.appendChild(handToolContainer);
        // tslint:disable-next-line:max-line-length
        var searchButtonContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_search', this.pdfViewer.localeObj.getConstant('Text Search'), 'e-pv-text-search');
        this.textSearchItem = searchButtonContainer.firstChild;
        this.itemsContainer.appendChild(searchButtonContainer);
        searchButtonContainer.style.position = 'absolute';
        // tslint:disable-next-line:max-line-length
        var downloadButtonContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_download', this.pdfViewer.localeObj.getConstant('Download'), 'e-pv-download-document');
        this.downloadItem = downloadButtonContainer.firstChild;
        downloadButtonContainer.style.position = 'absolute';
        // tslint:disable-next-line:max-line-length
        downloadButtonContainer.style.left = (this.pdfViewer.element.clientWidth - this.pdfViewerBase.navigationPane.getViewerContainerLeft()) + 'px';
        this.itemsContainer.appendChild(downloadButtonContainer);
        // tslint:disable-next-line:max-line-length
        var printButtonContainer = this.createToolbarItem('button', this.pdfViewer.element.id + '_print', this.pdfViewer.localeObj.getConstant('Print'), 'e-pv-print-document');
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
        var items = [{ percent: '50%', id: '0' }, { percent: '75%', id: '1' }, { percent: '100%', id: '2' }, { percent: '125%', id: '3' },
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
    };
    Toolbar$$1.prototype.createToolbarItem = function (elementName, id, tooltipText, className) {
        var containerElement = createElement('div', { id: id + 'Container' });
        var toolbarItem = createElement(elementName, { id: id });
        if (className !== null) {
            containerElement.className = className + '-container e-overflow-show e-popup-text';
            toolbarItem.className = className;
        }
        if (elementName === 'button' && id !== this.pdfViewer.element.id + '_zoomDropDown') {
            toolbarItem.className = 'e-btn e-tbar-btn e-icon-btn e-pv-tbar-btn ' + className;
            var buttonSpan = createElement('span', { id: id + 'Icon', className: className + '-icon e-pv-icon' });
            toolbarItem.appendChild(buttonSpan);
        }
        else if (elementName === 'input' && id !== this.pdfViewer.element.id + '_zoomDropDown') {
            toolbarItem.type = 'text';
        }
        containerElement.appendChild(toolbarItem);
        if (tooltipText !== null) {
            // tslint:disable-next-line
            var tooltip = new Tooltip({ content: tooltipText, opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
            tooltip.appendTo(toolbarItem);
        }
        return containerElement;
    };
    Toolbar$$1.prototype.onTooltipBeforeOpen = function (args) {
        if (!this.pdfViewer.toolbarSettings.showTooltip) {
            args.cancel = true;
        }
    };
    Toolbar$$1.prototype.createFileElement = function (toolbarElement) {
        // tslint:disable-next-line:max-line-length
        this.fileInputElement = createElement('input', { id: this.pdfViewer.element.id + '_fileUploadElement', styles: 'position:fixed; left:-100em', attrs: { 'type': 'file' } });
        this.fileInputElement.setAttribute('accept', '.pdf');
        toolbarElement.appendChild(this.fileInputElement);
    };
    Toolbar$$1.prototype.wireEvent = function () {
        this.toolbarElement.addEventListener('mouseup', this.toolbarOnMouseup.bind(this));
        this.fileInputElement.addEventListener('change', this.loadDocument);
        this.currentPageBoxElement.addEventListener('focusout', this.textBoxFocusOut);
        this.currentPageBoxElement.addEventListener('keypress', this.navigateToPage);
        this.zoomDropDown.change = this.zoomPercentSelect.bind(this);
        this.zoomDropDown.element.addEventListener('keypress', this.onZoomDropDownInput.bind(this));
        this.zoomDropDown.element.addEventListener('click', this.onZoomDropDownInputClick.bind(this));
    };
    Toolbar$$1.prototype.unWireEvent = function () {
        this.toolbarElement.removeEventListener('mouseup', this.toolbarOnMouseup.bind(this));
        this.fileInputElement.removeEventListener('change', this.loadDocument);
        this.currentPageBoxElement.removeEventListener('focusout', this.textBoxFocusOut);
        this.currentPageBoxElement.removeEventListener('keypress', this.navigateToPage);
        this.zoomDropDown.removeEventListener('change', this.zoomPercentSelect);
        this.zoomDropDown.element.removeEventListener('keypress', this.onZoomDropDownInput);
        this.zoomDropDown.element.removeEventListener('click', this.onZoomDropDownInputClick);
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.onToolbarResize = function (viewerWidth) {
        var navigationToolbar = document.getElementById(this.pdfViewer.element.id + '_toolbarContainer_nav');
        var downloadButtonElement = document.getElementById(this.pdfViewer.element.id + '_downloadContainer');
        var printButtonElement = document.getElementById(this.pdfViewer.element.id + '_printContainer');
        var searchButtonElement = document.getElementById(this.pdfViewer.element.id + '_searchContainer');
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
    };
    Toolbar$$1.prototype.toolbarOnMouseup = function (event) {
        if (event.target === this.itemsContainer || event.target === this.toolbarElement) {
            this.pdfViewerBase.focusViewerContainer();
        }
    };
    Toolbar$$1.prototype.applyHideToToolbar = function (show, startIndex, endIndex) {
        var isHide = !show;
        for (var index = startIndex; index <= endIndex; index++) {
            this.toolbar.hideItem(index, isHide);
        }
    };
    Toolbar$$1.prototype.onZoomDropDownInput = function (event) {
        if ((event.which < 48 || event.which > 57) && event.which !== 8 && event.which !== 13) {
            event.preventDefault();
            return false;
        }
        else {
            if (event.which === 13) {
                event.preventDefault();
                var value = this.zoomDropDown.element.value;
                this.zoomDropDownChange(value);
            }
            return true;
        }
    };
    Toolbar$$1.prototype.onZoomDropDownInputClick = function () {
        this.zoomDropDown.element.select();
    };
    Toolbar$$1.prototype.zoomPercentSelect = function (args) {
        if (this.pdfViewerBase.pageCount > 0) {
            if (args.isInteracted) {
                if (args.itemData) {
                    // tslint:disable-next-line:no-any
                    var zoomText = args.itemData.percent;
                    this.zoomDropDownChange(zoomText);
                }
            }
            else {
                this.updateZoomPercentage(this.pdfViewer.magnificationModule.zoomFactor);
            }
        }
    };
    Toolbar$$1.prototype.zoomDropDownChange = function (zoomText) {
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
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.updateZoomPercentage = function (zoomFactor) {
        // tslint:disable-next-line
        var currentPercent = parseInt((zoomFactor * 100).toString()) + '%';
        if (this.zoomDropDown.text === currentPercent) {
            this.zoomDropDown.element.value = currentPercent;
        }
        if (this.zoomDropDown.index === 9) {
            this.zoomDropDown.value = 2;
        }
        // tslint:disable-next-line
        this.zoomDropDown.text = currentPercent;
    };
    Toolbar$$1.prototype.updateInteractionItems = function () {
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
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.textSearchButtonHandler = function () {
        if (this.pdfViewer.textSearchModule && this.pdfViewerBase.pageCount > 0) {
            this.isTextSearchBoxDisplayed = !this.isTextSearchBoxDisplayed;
            this.pdfViewer.textSearchModule.showSearchBox(this.isTextSearchBoxDisplayed);
            if (this.isTextSearchBoxDisplayed) {
                this.selectItem(this.textSearchItem);
                // tslint:disable-next-line:max-line-length
                var searchInputElement = document.getElementById(this.pdfViewer.element.id + '_search_input');
                searchInputElement.select();
                searchInputElement.focus();
            }
            else {
                this.deSelectItem(this.textSearchItem);
            }
        }
    };
    Toolbar$$1.prototype.selectItem = function (element) {
        element.classList.add('e-pv-select');
    };
    Toolbar$$1.prototype.deSelectItem = function (element) {
        element.classList.remove('e-pv-select');
    };
    Toolbar$$1.prototype.updateInteractionTools = function (isTextSelect) {
        if (isTextSelect) {
            this.selectItem(this.textSelectItem);
            this.deSelectItem(this.panItem);
        }
        else {
            this.selectItem(this.panItem);
            this.deSelectItem(this.textSelectItem);
        }
    };
    Toolbar$$1.prototype.initialEnableItems = function () {
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
    };
    Toolbar$$1.prototype.showSeparator = function (toolbarItems) {
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
    };
    Toolbar$$1.prototype.applyToolbarSettings = function () {
        var toolbarSettingsItems = this.pdfViewer.toolbarSettings.toolbarItem;
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
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.getModuleName = function () {
        return 'Toolbar';
    };
    return Toolbar$$1;
}());

/**
 * export types
 */

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var ToolbarSettings = /** @__PURE__ @class */ (function (_super) {
    __extends(ToolbarSettings, _super);
    function ToolbarSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(true)
    ], ToolbarSettings.prototype, "showTooltip", void 0);
    __decorate([
        Property()
    ], ToolbarSettings.prototype, "toolbarItem", void 0);
    return ToolbarSettings;
}(ChildProperty));
/**
 * The `ServerActionSettings` module is used to provide the server action methods of PDF viewer.
 * @hidden
 */
var ServerActionSettings = /** @__PURE__ @class */ (function (_super) {
    __extends(ServerActionSettings, _super);
    function ServerActionSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return ServerActionSettings;
}(ChildProperty));
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
var PdfViewer = /** @__PURE__ @class */ (function (_super) {
    __extends(PdfViewer, _super);
    function PdfViewer(options, element) {
        var _this = _super.call(this, options, element) || this;
        /**
         * Gets or sets the document name loaded in the PdfViewer control.
         */
        _this.fileName = null;
        /** @hidden */
        _this.defaultLocale = {
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
        _this.viewerBase = new PdfViewerBase(_this);
        return _this;
    }
    Object.defineProperty(PdfViewer.prototype, "pageCount", {
        /**
         * Returns the page count of the document loaded in the PdfViewer control.
         */
        get: function () {
            return this.viewerBase.pageCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "currentPageNumber", {
        /**
         * Returns the current page number of the document displayed in the PdfViewer control.
         */
        get: function () {
            return this.viewerBase.currentPageNumber;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "zoomPercentage", {
        /**
         * Returns the current zoom percentage of the PdfViewer control.
         */
        get: function () {
            return this.magnificationModule.zoomFactor * 100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "bookmark", {
        /**
         * Gets the bookmark view object of the pdf viewer.
         * @returns { BookmarkView }
         */
        get: function () {
            return this.bookmarkViewModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "print", {
        /**
         * Gets the print object of the pdf viewer.
         * @returns { Print }
         */
        get: function () {
            return this.printModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "magnification", {
        /**
         * Gets the magnification object of the pdf viewer.
         * @returns { Magnification }
         */
        get: function () {
            return this.magnificationModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "navigation", {
        /**
         * Gets the navigation object of the pdf viewer.
         * @returns { Navigation }
         */
        get: function () {
            return this.navigationModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "textSearch", {
        /**
         * Gets the text search object of the pdf viewer.
         * @returns { TextSearch }
         */
        get: function () {
            return this.textSearchModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewer.prototype, "toolbar", {
        /**
         * Gets the toolbar object of the pdf viewer.
         * @returns { Toolbar }
         */
        get: function () {
            return this.toolbarModule;
        },
        enumerable: true,
        configurable: true
    });
    PdfViewer.prototype.preRender = function () {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    };
    PdfViewer.prototype.render = function () {
        this.viewerBase.initializeComponent();
        if (this.enableTextSelection && this.textSelectionModule) {
            this.textSelectionModule.enableTextSelectionMode();
        }
        else {
            this.viewerBase.disableTextSelectionMode();
        }
    };
    PdfViewer.prototype.getModuleName = function () {
        return 'PdfViewer';
    };
    /**
     * @private
     */
    PdfViewer.prototype.getLocaleConstants = function () {
        return this.defaultLocale;
    };
    PdfViewer.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (this.isDestroyed) {
            return;
        }
        var properties = Object.keys(newProp);
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var prop = properties_1[_i];
            switch (prop) {
                case 'enableToolbar':
                    this.notify('', { module: 'toolbar', enable: this.enableToolbar });
                    
                    break;
            }
        }
    };
    PdfViewer.prototype.getPersistData = function () {
        return 'PdfViewer';
    };
    PdfViewer.prototype.requiredModules = function () {
        var modules = [];
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
    };
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
    PdfViewer.prototype.load = function (document, password) {
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
    };
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
    PdfViewer.prototype.download = function () {
        if (this.enableDownload) {
            this.viewerBase.download();
        }
    };
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
    PdfViewer.prototype.unload = function () {
        this.viewerBase.clear(true);
        this.viewerBase.pageCount = 0;
        this.toolbarModule.resetToolbar();
        this.magnificationModule.zoomTo(100);
    };
    /**
     * Destroys all managed resources used by this object.
     */
    PdfViewer.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.element.classList.remove('e-pdfviewer');
        if (this.toolbarModule) {
            this.toolbarModule.destroy();
        }
        while (this.element.hasChildNodes()) {
            this.element.removeChild(this.element.lastChild);
        }
        this.viewerBase.destroy();
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireDocumentLoad = function () {
        var eventArgs = { name: 'documentLoad', documentName: this.fileName };
        this.trigger('documentLoad', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireDocumentUnload = function (fileName) {
        var eventArgs = { name: 'documentUnload', documentName: fileName };
        this.trigger('documentUnload', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireDocumentLoadFailed = function (isPasswordRequired, password) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'documentLoadFailed', documentName: this.fileName, isPasswordRequired: isPasswordRequired, password: password };
        this.trigger('documentLoadFailed', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireAjaxRequestFailed = function (errorStatusCode, errorMessage) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'ajaxRequestFailed', documentName: this.fileName, errorStatusCode: errorStatusCode, errorMessage: errorMessage };
        this.trigger('ajaxRequestFailed', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.firePageClick = function (x, y, pageNumber) {
        var eventArgs = { name: 'pageClick', documentName: this.fileName, x: x, y: y, pageNumber: pageNumber };
        this.trigger('pageClick', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.firePageChange = function (previousPageNumber) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'pageChange', documentName: this.fileName, currentPageNumber: this.viewerBase.currentPageNumber, previousPageNumber: previousPageNumber };
        this.trigger('pageChange', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireZoomChange = function () {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'zoomChange', zoomValue: this.magnificationModule.zoomFactor * 100, previousZoomValue: this.magnificationModule.previousZoomFactor * 100 };
        this.trigger('zoomChange', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireHyperlinkClick = function (hyperlink) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'hyperlinkClick', hyperlink: hyperlink };
        this.trigger('hyperlinkClick', eventArgs);
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
    return PdfViewer;
}(Component));

/**
 * BookmarkView module
 */
var BookmarkView = /** @__PURE__ @class */ (function () {
    /**
     * @private
     */
    function BookmarkView(pdfViewer, pdfViewerBase) {
        var _this = this;
        this.nodeClick = function (args) {
            var bookid = Number(args.nodeData.id);
            var pageIndex = _this.bookmarksDestination.bookMarkDestination[bookid].PageIndex;
            var Y = _this.bookmarksDestination.bookMarkDestination[bookid].Y;
            _this.goToBookmark(pageIndex, Y);
            return false;
        };
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    BookmarkView.prototype.createRequestForBookmarks = function () {
        var _this = this;
        var proxy = this;
        var request = new XMLHttpRequest();
        // tslint:disable-next-line:max-line-length
        var jsonObject = { hashId: this.pdfViewerBase.hashId };
        request.open('POST', proxy.pdfViewer.serviceUrl + '/Bookmarks');
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.responseType = 'json';
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        request.onreadystatechange = function (event) {
            if (request.readyState === 4 && request.status === 200) {
                _this.pdfViewerBase.navigationPane.disableBookmarkButton();
                // tslint:disable-next-line
                var data = event.currentTarget.response;
                if (data) {
                    if (typeof data !== 'object') {
                        data = JSON.parse(data);
                    }
                    _this.bookmarks = { bookMark: data.Bookmarks };
                    _this.bookmarksDestination = { bookMarkDestination: data.BookmarksDestination };
                }
                if (_this.bookmarks == null) {
                    _this.pdfViewerBase.navigationPane.disableBookmarkButton();
                }
                else {
                    _this.pdfViewerBase.navigationPane.enableBookmarkButton();
                }
            }
        };
        // tslint:disable-next-line
        request.onerror = function (event) {
            _this.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
        };
    };
    /**
     * @private
     */
    BookmarkView.prototype.renderBookmarkcontent = function () {
        if (this.bookmarkView != null) {
            this.bookmarkView.parentElement.removeChild(this.bookmarkView);
        }
        this.bookmarkView = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_view', className: 'e-pv-bookmark-view' });
        this.pdfViewerBase.navigationPane.sideBarContent.appendChild(this.bookmarkView);
        // tslint:disable-next-line:max-line-length
        var bookmarkIconView = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_iconview', className: 'e-pv-bookmark-icon-view' });
        // tslint:disable-next-line:max-line-length
        var bookmarkIcon = createElement('span', { id: this.pdfViewer.element.id + '_bookmark_icon', className: 'e-pv-bookmark-icon e-pv-icon' });
        var bookmarkTitle = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_Title', className: 'e-pv-bookmark-Title' });
        bookmarkTitle.innerText = '${Title}';
        bookmarkIconView.appendChild(bookmarkIcon);
        bookmarkIconView.appendChild(bookmarkTitle);
        // tslint:disable-next-line:max-line-length
        var treeObj = new TreeView({
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
    };
    /**
     * Get Bookmarks of the PDF document being loaded in the ejPdfViewer control
     * @returns any
     */
    // tslint:disable-next-line
    BookmarkView.prototype.getBookmarks = function () {
        if (this.bookmarks && this.bookmarksDestination) {
            // tslint:disable-next-line:max-line-length
            return { bookmarks: this.bookmarks, bookmarksDestination: this.bookmarksDestination };
        }
    };
    /**
     * Navigate To current Bookmark location of the PDF document being loaded in the ejPdfViewer control.
     * @returns void
     */
    BookmarkView.prototype.goToBookmark = function (pageIndex, y) {
        var proxy = this;
        var destPage = (this.pdfViewerBase.pageSize[pageIndex - 1].height);
        // tslint:disable-next-line:max-line-length
        var scrollValue = this.pdfViewerBase.pageSize[pageIndex].top * this.pdfViewerBase.getZoomFactor() + ((destPage - y) * this.pdfViewerBase.getZoomFactor());
        var scroll = scrollValue.toString();
        // tslint:disable-next-line:radix
        proxy.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll);
        proxy.pdfViewerBase.focusViewerContainer();
        return false;
    };
    /**
     * @private
     */
    BookmarkView.prototype.clear = function () {
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
    };
    /**
     * @private
     */
    BookmarkView.prototype.destroy = function () {
        this.clear();
    };
    /**
     * @private
     */
    BookmarkView.prototype.getModuleName = function () {
        return 'BookmarkView';
    };
    return BookmarkView;
}());

/**
 * export types
 */

/**
 * The `TextSelection` module is used to handle the text selection of PDF viewer.
 * @hidden
 */
var TextSelection = /** @__PURE__ @class */ (function () {
    /**
     * @private
     */
    function TextSelection(pdfViewer, pdfViewerBase) {
        var _this = this;
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
        this.onLeftTouchSelectElementTouchStart = function (event) {
            _this.initiateSelectionByTouch();
        };
        this.onRightTouchSelectElementTouchStart = function (event) {
            _this.initiateSelectionByTouch();
        };
        this.onLeftTouchSelectElementTouchEnd = function (event) {
            _this.terminateSelectionByTouch(event);
        };
        this.onRightTouchSelectElementTouchEnd = function (event) {
            _this.terminateSelectionByTouch(event);
        };
        this.onLeftTouchSelectElementTouchMove = function (event) {
            var range;
            var nodeElement;
            event.preventDefault();
            event.target.style.zIndex = '0';
            var rightElement = _this.dropDivElementRight;
            var isTouchedWithinViewerContainer = _this.isTouchedWithinContainer(event);
            if (rightElement && isTouchedWithinViewerContainer) {
                var dropBounds = rightElement.getBoundingClientRect();
                var xTouch = event.changedTouches[0].clientX;
                var yTouch = event.changedTouches[0].clientY;
                event.target.style.zIndex = '1000';
                nodeElement = _this.getNodeElement(range, xTouch, yTouch, event, nodeElement);
                if (nodeElement) {
                    // tslint:disable-next-line:max-line-length
                    var currentDifference = Math.sqrt((yTouch - dropBounds.top) * (yTouch - dropBounds.top) + (xTouch - dropBounds.left) * (xTouch - dropBounds.left));
                    var isCloserMovement = _this.isCloserTouchScroll(currentDifference);
                    var isTextSelected = false;
                    if (yTouch <= dropBounds.top) {
                        _this.dropElementLeft.style.transform = 'rotate(0deg)';
                        _this.dropElementRight.style.transform = 'rotate(-90deg)';
                        isTextSelected = _this.selectTextByTouch(nodeElement.parentElement, xTouch, yTouch, false, 'left', isCloserMovement);
                    }
                    else {
                        _this.dropElementLeft.style.transform = 'rotate(-90deg)';
                        _this.dropElementRight.style.transform = 'rotate(0deg)';
                        isTextSelected = _this.selectTextByTouch(nodeElement.parentElement, xTouch, yTouch, true, 'left', isCloserMovement);
                    }
                    if (isTextSelected) {
                        var elementClientRect = _this.dropDivElementLeft.getBoundingClientRect();
                        var pageTopValue = _this.pdfViewerBase.pageSize[_this.pdfViewerBase.currentPageNumber - 1].top;
                        var topClientValue = _this.getClientValueTop(yTouch, _this.pdfViewerBase.currentPageNumber - 1);
                        // tslint:disable-next-line:max-line-length
                        var currentPageLeft = _this.pdfViewerBase.getElement('_pageDiv_' + (_this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
                        var currentRangeLeft = xTouch - currentPageLeft;
                        // tslint:disable-next-line:max-line-length
                        _this.dropDivElementLeft.style.top = pageTopValue * _this.pdfViewerBase.getZoomFactor() + topClientValue + 'px';
                        _this.topStoreLeft = { pageTop: pageTopValue, topClientValue: _this.getMagnifiedValue(topClientValue), pageNumber: _this.pdfViewerBase.currentPageNumber - 1, left: _this.getMagnifiedValue(currentRangeLeft), isHeightNeeded: false };
                        // tslint:disable-next-line:max-line-length
                        _this.dropDivElementLeft.style.left = xTouch - _this.pdfViewerBase.viewerContainer.getBoundingClientRect().left - (elementClientRect.width / 2) + 'px';
                        _this.previousScrollDifference = currentDifference;
                    }
                }
            }
        };
        // tslint:disable-next-line
        this.onRightTouchSelectElementTouchMove = function (event) {
            var range;
            var nodeElement;
            event.preventDefault();
            event.target.style.zIndex = '0';
            var leftElement = _this.dropDivElementLeft;
            var isTouchedWithinViewerContainer = _this.isTouchedWithinContainer(event);
            if (leftElement && isTouchedWithinViewerContainer) {
                var dropPosition = leftElement.getBoundingClientRect();
                var touchX = event.changedTouches[0].clientX;
                var touchY = event.changedTouches[0].clientY;
                event.target.style.zIndex = '1000';
                nodeElement = _this.getNodeElement(range, touchX, touchY, event, nodeElement);
                if (nodeElement) {
                    // tslint:disable-next-line:max-line-length
                    var currentDifference = Math.sqrt((touchY - dropPosition.top) * (touchY - dropPosition.top) + (touchX - dropPosition.left) * (touchX - dropPosition.left));
                    var isCloserMovement = _this.isCloserTouchScroll(currentDifference);
                    var isTextSelected = false;
                    if (touchY >= dropPosition.top) {
                        _this.dropElementRight.style.transform = 'rotate(-90deg)';
                        _this.dropElementLeft.style.transform = 'rotate(0deg)';
                        isTextSelected = _this.selectTextByTouch(nodeElement.parentElement, touchX, touchY, true, 'right', isCloserMovement);
                    }
                    else {
                        _this.dropElementRight.style.transform = 'rotate(0deg)';
                        _this.dropElementLeft.style.transform = 'rotate(-90deg)';
                        isTextSelected = _this.selectTextByTouch(nodeElement.parentElement, touchX, touchY, false, 'right', isCloserMovement);
                    }
                    if (isTextSelected) {
                        var pageTopValue = _this.pdfViewerBase.pageSize[_this.pdfViewerBase.currentPageNumber - 1].top;
                        var topClientValue = _this.getClientValueTop(touchY, _this.pdfViewerBase.currentPageNumber - 1);
                        var elementClientRect = _this.dropDivElementRight.getBoundingClientRect();
                        _this.dropDivElementRight.style.top = pageTopValue * _this.pdfViewerBase.getZoomFactor() + topClientValue + 'px';
                        // tslint:disable-next-line:max-line-length
                        var currentPageLeft = _this.pdfViewerBase.getElement('_pageDiv_' + (_this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
                        var currentRangeLeft = touchX - currentPageLeft;
                        // tslint:disable-next-line:max-line-length
                        _this.topStoreRight = { pageTop: pageTopValue, topClientValue: _this.getMagnifiedValue(topClientValue), pageNumber: _this.pdfViewerBase.currentPageNumber - 1, left: _this.getMagnifiedValue(currentRangeLeft), isHeightNeeded: false };
                        // tslint:disable-next-line:max-line-length
                        _this.dropDivElementRight.style.left = touchX - _this.pdfViewerBase.viewerContainer.getBoundingClientRect().left - (elementClientRect.width / 2) + 'px';
                        _this.previousScrollDifference = currentDifference;
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
    TextSelection.prototype.textSelectionOnMouseMove = function (target, x, y) {
        var targetElement = target;
        if (targetElement.nodeType === targetElement.TEXT_NODE) {
            this.isBackwardPropagatedSelection = false;
            var range = targetElement.ownerDocument.createRange();
            var selection = window.getSelection();
            if (selection.anchorNode !== null) {
                var position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
                if (!position && selection.anchorOffset > selection.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
                    this.isBackwardPropagatedSelection = true;
                }
            }
            range.selectNodeContents(targetElement);
            var currentPosition = 0;
            var endPosition = range.endOffset;
            while (currentPosition < endPosition) {
                range.setStart(targetElement, currentPosition);
                range.setEnd(targetElement, currentPosition + 1);
                var rangeBounds = range.getBoundingClientRect();
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
            for (var i = 0; i < targetElement.childNodes.length; i++) {
                if (targetElement.childNodes[i].nodeType === targetElement.TEXT_NODE) {
                    var range = this.getSelectionRange(i, targetElement);
                    var rangeBounds = range.getBoundingClientRect();
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
    };
    /**
     * @private
     */
    TextSelection.prototype.textSelectionOnMouseLeave = function (event) {
        var _this = this;
        event.preventDefault();
        var viewerTop = this.pdfViewerBase.viewerContainer.offsetTop;
        if (this.pdfViewer.magnificationModule) {
            if (this.pdfViewer.magnificationModule.fitType === 'fitToPage') {
                return;
            }
        }
        if (event.clientY > viewerTop) {
            this.scrollMoveTimer = setInterval(function () { _this.scrollForwardOnSelection(); }, 500);
        }
        else {
            this.scrollMoveTimer = setInterval(function () { _this.scrollBackwardOnSelection(); }, 500);
        }
    };
    TextSelection.prototype.scrollForwardOnSelection = function () {
        this.isMouseLeaveSelection = true;
        this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.viewerContainer.scrollTop + 200;
        this.stichSelectionOnScroll(this.pdfViewerBase.currentPageNumber - 1);
    };
    TextSelection.prototype.scrollBackwardOnSelection = function () {
        this.isMouseLeaveSelection = true;
        this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.viewerContainer.scrollTop - 200;
        this.stichSelectionOnScroll(this.pdfViewerBase.currentPageNumber - 1);
    };
    /**
     * @private
     */
    TextSelection.prototype.clear = function () {
        if (this.scrollMoveTimer) {
            this.isMouseLeaveSelection = false;
            clearInterval(this.scrollMoveTimer);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    TextSelection.prototype.selectAWord = function (element, x, y, isStoreSelection) {
        if (element.nodeType === element.TEXT_NODE) {
            var selection = window.getSelection();
            var range = element.ownerDocument.createRange();
            range.selectNodeContents(element);
            var currentPosition = 0;
            var endPosition = range.endOffset;
            while (currentPosition < endPosition) {
                range.setStart(element, currentPosition);
                range.setEnd(element, currentPosition + 1);
                var rangeBounds = range.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    var textContent = element.textContent;
                    var indices = [];
                    var startPosition = void 0;
                    var endPos = void 0;
                    for (var i = 0; i < textContent.length; i++) {
                        if (textContent[i] === ' ') {
                            indices.push(i);
                        }
                    }
                    for (var j = 0; j < indices.length; j++) {
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
            for (var i = 0; i < element.childNodes.length; i++) {
                var range = this.getSelectionRange(i, element);
                var rangeBounds = range.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    range.detach();
                    this.selectAWord(element.childNodes[i], x, y, isStoreSelection);
                }
                else {
                    range.detach();
                }
            }
        }
    };
    TextSelection.prototype.getSelectionRange = function (index, element) {
        var range = element.childNodes[index].ownerDocument.createRange();
        range.selectNodeContents(element.childNodes[index]);
        return range;
    };
    /**
     * @private
     */
    TextSelection.prototype.selectEntireLine = function (event) {
        var textIds = [];
        var targetElement = event.target;
        var targetRect = targetElement.getBoundingClientRect();
        // tslint:disable-next-line
        var targetcentre = parseInt((targetRect.top + (targetRect.height / 2)).toString());
        // tslint:disable-next-line:radix
        var pageNumber = parseInt(event.target.id.split('_text_')[1]);
        var textDivs = document.querySelectorAll('div[id*="_text_' + pageNumber + '"]');
        if (targetElement.classList.contains('e-pv-text')) {
            for (var i = 0; i < textDivs.length; i++) {
                var rect = textDivs[i].getBoundingClientRect();
                // tslint:disable-next-line:radix
                var topValue = parseInt(rect.top.toString());
                // tslint:disable-next-line:radix
                var bottomValue = parseInt(rect.bottom.toString());
                if ((topValue <= targetcentre && bottomValue > targetcentre) && (targetRect.bottom + 10 > bottomValue)) {
                    var textId = textDivs[i].id;
                    if (textId !== '') {
                        textIds.push(textId);
                    }
                }
            }
            var selection = window.getSelection();
            selection.removeAllRanges();
            var range = document.createRange();
            var lengths = (textIds.length - 1);
            var d1 = document.getElementById(textIds[0]);
            var d2 = document.getElementById(textIds[lengths]);
            var childNodes = d2.childNodes.length;
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
    };
    /**
     * @private
     */
    TextSelection.prototype.enableTextSelectionMode = function () {
        this.pdfViewerBase.isTextSelectionDisabled = false;
        this.pdfViewerBase.viewerContainer.classList.remove('e-disable-text-selection');
        this.pdfViewerBase.viewerContainer.classList.add('e-enable-text-selection');
        this.pdfViewerBase.viewerContainer.addEventListener('selectstart', function () { return true; });
    };
    /**
     * @private
     */
    TextSelection.prototype.clearTextSelection = function () {
        if (this.isTextSelection) {
            this.pdfViewerBase.textLayer.clearDivSelection();
            if (window.getSelection) {
                if (window.getSelection().removeAllRanges) {
                    window.getSelection().removeAllRanges();
                }
            }
            if (this.pdfViewer.linkAnnotationModule) {
                var lowerPageIndex = this.pdfViewerBase.currentPageNumber - 3;
                lowerPageIndex = (lowerPageIndex < 0) ? 0 : lowerPageIndex;
                var higherPageIndex = this.pdfViewer.currentPageNumber + 1;
                // tslint:disable-next-line:max-line-length
                higherPageIndex = (higherPageIndex < (this.pdfViewerBase.pageCount - 1)) ? higherPageIndex : (this.pdfViewerBase.pageCount - 1);
                for (var i = lowerPageIndex; i <= higherPageIndex; i++) {
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
    };
    /**
     * @private
     */
    TextSelection.prototype.removeTouchElements = function () {
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
    };
    /**
     * @private
     */
    TextSelection.prototype.resizeTouchElements = function () {
        var viewerContainerLeft = this.pdfViewerBase.viewerContainer.getBoundingClientRect().left;
        if (this.dropDivElementLeft) {
            var elementClientRect = this.dropDivElementLeft.getBoundingClientRect();
            var dropElementHeight = 0;
            // tslint:disable-next-line:max-line-length
            var leftCurrentPagePosition = this.pdfViewerBase.getElement('_pageDiv_' + this.topStoreLeft.pageNumber).getBoundingClientRect();
            this.dropDivElementLeft.style.left = parseFloat(this.topStoreLeft.left.toString()) * this.pdfViewerBase.getZoomFactor() + leftCurrentPagePosition.left - viewerContainerLeft - (elementClientRect.width / 2) + 'px';
            if (this.topStoreLeft.isHeightNeeded) {
                dropElementHeight = (elementClientRect.height / 2) * this.pdfViewerBase.getZoomFactor();
            }
            // tslint:disable-next-line:max-line-length
            this.dropDivElementLeft.style.top = parseFloat(this.topStoreLeft.pageTop.toString()) * this.pdfViewerBase.getZoomFactor() + parseFloat(this.topStoreLeft.topClientValue.toString()) * this.pdfViewerBase.getZoomFactor() + dropElementHeight + 'px';
        }
        if (this.dropDivElementRight) {
            var elementClientRect = this.dropDivElementRight.getBoundingClientRect();
            var dropElementHeight = 0;
            // tslint:disable-next-line:max-line-length
            var rightCurrentPagePosition = this.pdfViewerBase.getElement('_pageDiv_' + this.topStoreRight.pageNumber).getBoundingClientRect();
            this.dropDivElementRight.style.left = parseFloat(this.topStoreRight.left.toString()) * this.pdfViewerBase.getZoomFactor() + rightCurrentPagePosition.left - viewerContainerLeft - (elementClientRect.width / 2) + 'px';
            if (this.topStoreRight.isHeightNeeded) {
                dropElementHeight = (elementClientRect.height / 2) * this.pdfViewerBase.getZoomFactor();
            }
            // tslint:disable-next-line:max-line-length
            this.dropDivElementRight.style.top = parseFloat(this.topStoreRight.pageTop.toString()) * this.pdfViewerBase.getZoomFactor() + parseFloat(this.topStoreRight.topClientValue.toString()) * this.pdfViewerBase.getZoomFactor() + dropElementHeight + 'px';
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.textSelectionOnMouseup = function () {
        this.clear();
        if (window.getSelection().anchorNode !== null) {
            this.isMouseLeaveSelection = false;
            this.maintainSelectionOnZoom(true, false);
            var isTextSearch = this.pdfViewerBase.textLayer.getTextSearchStatus();
            if (isTextSearch) {
                this.pdfViewerBase.textLayer.clearDivSelection();
                // tslint:disable-next-line
                var indexes = this.pdfViewer.textSearchModule.getIndexes();
                var lowerPageValue = parseFloat(indexes.lowerPageValue.toString());
                var higherPageValue = parseFloat(indexes.higherPageValue.toString());
                for (var i = lowerPageValue; i < higherPageValue; i++) {
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
    };
    /**
     * @private
     */
    TextSelection.prototype.maintainSelectionOnZoom = function (isMaintainSelection, isStich) {
        var selection = window.getSelection();
        if (selection.type === 'Range' || (!selection.type && !selection.isCollapsed)) {
            var isBackward = this.isBackWardSelection(selection);
            if (selection.anchorNode !== null) {
                // tslint:disable-next-line:radix
                var anchorPageId = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
                // tslint:disable-next-line:radix
                var focusPageId = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
                if (this.isTouchSelection && isNaN(focusPageId)) {
                    var focusElement = selection.focusNode;
                    if (focusElement === this.pdfViewerBase.pageContainer) {
                        var lastChildNode = this.pdfViewerBase.pageContainer.lastChild;
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
                    for (var i = anchorPageId; i <= focusPageId; i++) {
                        this.maintainSelectionOnScroll(i, isStich);
                    }
                }
                else {
                    for (var i = anchorPageId; i >= focusPageId; i--) {
                        this.maintainSelectionOnScroll(i, isStich);
                    }
                }
            }
            if (!isMaintainSelection) {
                selection.removeAllRanges();
            }
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.isSelectionAvailableOnScroll = function (pageNumber) {
        var isSelectionAvailable = false;
        var ranges = this.selectionRangeArray;
        for (var i = 0; i < ranges.length; i++) {
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
    };
    /**
     * @private
     */
    TextSelection.prototype.applySelectionRangeOnScroll = function (pageNumber) {
        if (this.isMouseLeaveSelection) {
            this.applySelectionMouseScroll(pageNumber);
        }
        else {
            this.applySelectionRange(pageNumber);
        }
    };
    // tslint:disable-next-line
    TextSelection.prototype.getSelectionRangeFromArray = function (pageNumber) {
        var isSelectionAvailable = false;
        var selectionRange = null;
        var ranges = this.selectionRangeArray;
        for (var i = 0; i < ranges.length; i++) {
            if (ranges[i] !== null) {
                if (pageNumber === ranges[i].pageNumber) {
                    selectionRange = ranges[i];
                    isSelectionAvailable = true;
                    break;
                }
            }
        }
        return { isSelectionAvailable: isSelectionAvailable, selectionRange: selectionRange };
    };
    TextSelection.prototype.applySelectionRange = function (pageNumber) {
        var selectionObject = this.getSelectionRangeFromArray(pageNumber);
        var isSelectionAvailable = selectionObject.isSelectionAvailable;
        var textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        if (textLayer) {
            if (isSelectionAvailable && textLayer.childNodes.length !== 0) {
                var selectionRange = selectionObject.selectionRange;
                var anchorOffsetDiv = void 0;
                var focusOffsetDiv = void 0;
                var anchorOffset = void 0;
                var focusOffset = void 0;
                if (selectionRange.isBackward) {
                    // tslint:disable-next-line:radix
                    var startId = parseInt(selectionRange.endNode.split('_text_')[1].split('_')[1]);
                    // tslint:disable-next-line:radix
                    var endId = parseInt(selectionRange.startNode.split('_text_')[1].split('_')[1]);
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
    };
    TextSelection.prototype.applySelectionMouseScroll = function (pageNumber) {
        var selectionObject = this.getSelectionRangeFromArray(pageNumber);
        var isSelectionAvailable = selectionObject.isSelectionAvailable;
        if (isSelectionAvailable) {
            var selectionRange = selectionObject.selectionRange;
            var selection = window.getSelection();
            var anchorNode = document.getElementById(selectionRange.startNode).childNodes[0];
            var focusNode = document.getElementById(selectionRange.endNode).childNodes[0];
            var range = document.createRange();
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
                var anchorPageIndex = isNaN(parseInt(selection.anchorNode.parentElement.id.split('_text_')[1])) ? parseInt(selection.anchorNode.id.split('_pageDiv_')[1]) : parseInt(selection.anchorNode.parentElement.id.split('_text_')[1]);
                if (isNaN(anchorPageIndex)) {
                    // tslint:disable-next-line:radix
                    anchorPageIndex = parseInt(selection.anchorNode.id.split('_text_')[1]);
                }
                // tslint:disable-next-line
                var focusPageIndex = isNaN(parseInt(selection.focusNode.parentElement.id.split('_text_')[1])) ? parseInt(selection.focusNode.id.split('_pageDiv_')[1]) : parseInt(selection.focusNode.parentElement.id.split('_text_')[1]);
                // tslint:disable-next-line:radix
                var currentAnchorIndex = parseInt(selectionRange.startNode.split('_text_')[1]);
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
                        var isBackward = this.isBackWardSelection(selection);
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
                            var currentAnchorOffset = parseInt(selectionRange.startNode.split('_' + currentAnchorIndex + '_')[1]);
                            // tslint:disable-next-line:radix
                            var currentFocusOffset = parseInt(selectionRange.endNode.split('_' + currentAnchorIndex + '_')[1]);
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
    };
    /**
     * @private
     */
    TextSelection.prototype.maintainSelectionOnScroll = function (pageNumber, isStich) {
        var isSelectionAvailable = this.isSelectionAvailableOnScroll(pageNumber);
        if (this.isTextSelection && !isSelectionAvailable) {
            this.maintainSelection(pageNumber, isStich);
        }
    };
    TextSelection.prototype.maintainSelection = function (pageNumber, isStich) {
        var selection = window.getSelection();
        if (this.isTextSelection && (selection.type === 'Range' || (!selection.type && !selection.isCollapsed))) {
            // tslint:disable-next-line
            var anchorPageId = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
            // tslint:disable-next-line
            var focusPageId = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
            if (isNaN(focusPageId) && selection.anchorNode !== null) {
                var backward_1 = this.isBackWardSelection(selection);
                if (!backward_1) {
                    // tslint:disable-next-line:radix
                    var lastChildNode = this.pdfViewerBase.pageContainer.lastChild;
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
            var backward = this.isBackWardSelection(selection);
            if (this.isTouchSelection && pageNumber > focusPageId && pageNumber > anchorPageId) {
                return;
            }
            if (anchorPageId === focusPageId) {
                var selectionObject = null;
                var selectionBounds = this.getSelectionBounds(selection.getRangeAt(0), pageNumber);
                // tslint:disable-next-line:max-line-length
                var anchorOffsetValue = (this.getNodeElementFromNode(selection.anchorNode).childNodes.length === 1) ? selection.anchorOffset : this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                var focusOffsetValue = (this.getNodeElementFromNode(selection.focusNode).childNodes.length === 1) ? selection.focusOffset : this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                selectionObject = {
                    isBackward: backward, startNode: this.getNodeElementFromNode(selection.anchorNode).id,
                    startOffset: anchorOffsetValue, endNode: this.getNodeElementFromNode(selection.focusNode).id,
                    endOffset: focusOffsetValue, textContent: selection.toString(), pageNumber: pageNumber, bounds: selectionBounds
                };
                this.pushSelectionRangeObject(selectionObject, pageNumber);
            }
            else {
                var selectionObject = this.createRangeObjectOnScroll(pageNumber, anchorPageId, focusPageId);
                if (selectionObject) {
                    this.pushSelectionRangeObject(selectionObject, pageNumber);
                    if (isStich) {
                        this.stichSelection(backward, selection, pageNumber);
                    }
                }
            }
        }
    };
    TextSelection.prototype.getCorrectOffset = function (node, offset) {
        var offsetValue = 0;
        var parentElement = this.getNodeElementFromNode(node);
        for (var i = 0; i < parentElement.childNodes.length; i++) {
            if (parentElement.childNodes[i] === node) {
                offsetValue = offsetValue + offset;
                break;
            }
            else {
                offsetValue = offsetValue + parentElement.childNodes[i].textContent.length;
            }
        }
        return offsetValue;
    };
    TextSelection.prototype.pushSelectionRangeObject = function (selectionObject, pageNumber) {
        if (this.isTouchSelection) {
            var currentObject = this.selectionRangeArray.filter(
            // tslint:disable-next-line
            function (obj) {
                return (obj.pageNumber === pageNumber);
            });
            if (currentObject.length > 0) {
                var currentObjectIndex = this.selectionRangeArray.indexOf(currentObject[0]);
                this.selectionRangeArray.splice(currentObjectIndex, 1, selectionObject);
                return;
            }
        }
        var nextPageObject = this.selectionRangeArray.filter(
        // tslint:disable-next-line
        function (obj) {
            return (obj.pageNumber === (pageNumber + 1));
        });
        if (nextPageObject.length === 0) {
            if (this.isTouchSelection && this.selectionRangeArray.length !== 0) {
                var prevPageObject = this.selectionRangeArray.filter(
                // tslint:disable-next-line
                function (obj) {
                    return (obj.pageNumber === (pageNumber - 1));
                });
                if (prevPageObject.length !== 0) {
                    var prevIndex = this.selectionRangeArray.indexOf(prevPageObject[0]);
                    this.selectionRangeArray.splice(prevIndex + 1, 0, selectionObject);
                }
                else {
                    var firstObject = this.selectionRangeArray[0];
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
            var index = this.selectionRangeArray.indexOf(nextPageObject[0]);
            this.selectionRangeArray.splice(index, 0, selectionObject);
        }
    };
    TextSelection.prototype.extendCurrentSelection = function (element, offset, selection, range) {
        var currentFocusOffset = selection.focusOffset;
        var currentFocusElement = selection.focusNode.parentElement.id;
        // tslint:disable-next-line
        var focusPageId = isNaN(parseInt(currentFocusElement.split('_text_')[1])) ? parseInt(selection.focusNode.id.split('_pageDiv_')[1]) : parseInt(currentFocusElement.split('_text_')[1]);
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
    };
    TextSelection.prototype.stichSelection = function (backward, selection, pageNumber) {
        var range = document.createRange();
        var nextPageElement;
        if (backward) {
            nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber - 1));
            if (nextPageElement) {
                var lastElement = nextPageElement.lastChild;
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
                var lastElement = nextPageElement.firstChild;
                this.extendCurrentSelection(lastElement, 0, selection, range);
            }
        }
        else {
            nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber + 1));
            if (nextPageElement) {
                var firstElement = nextPageElement.firstChild;
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
    };
    /**
     * @private
     */
    TextSelection.prototype.textSelectionOnMouseWheel = function (currentPageNumber) {
        this.isMouseLeaveSelection = true;
        this.stichSelectionOnScroll(currentPageNumber);
    };
    /**
     * @private
     */
    TextSelection.prototype.stichSelectionOnScroll = function (currentPageNumber) {
        var selection = window.getSelection();
        if (this.isTextSelection) {
            // tslint:disable-next-line:radix
            var anchorPageId = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
            // tslint:disable-next-line:radix
            var focusPageId = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
            var nextPageElement = void 0;
            if (anchorPageId !== currentPageNumber && focusPageId !== currentPageNumber) {
                var backward = this.isBackWardSelection(selection);
                if (!backward) {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (currentPageNumber - 1));
                    if (nextPageElement) {
                        var lastElement = nextPageElement.lastChild;
                        if (lastElement) {
                            this.extendSelectionStich(lastElement.childNodes[0], this.getTextLastLength(lastElement), selection);
                        }
                        else {
                            nextPageElement = this.pdfViewerBase.getElement('_textLayer_' + currentPageNumber);
                            var lastElement_1 = nextPageElement.firstChild;
                            this.extendSelectionStich(lastElement_1.childNodes[0], 0, selection);
                        }
                    }
                }
                else {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (currentPageNumber - 1));
                    if (nextPageElement) {
                        var lastElement = nextPageElement.firstChild;
                        if (lastElement) {
                            this.extendSelectionStich(lastElement.childNodes[0], 0, selection);
                        }
                    }
                }
            }
            this.maintainSelectionArray();
        }
    };
    TextSelection.prototype.extendSelectionStich = function (node, offset, selection) {
        if (selection.extend) {
            selection.extend(node, offset);
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.createRangeObjectOnScroll = function (pageNumber, anchorPageId, focusPageId) {
        var selectionObject = null;
        var selection = window.getSelection();
        if (selection.anchorNode !== null) {
            var backward = this.isBackWardSelection(selection);
            var firstElement = void 0;
            var lastElement = void 0;
            var startOffset = void 0;
            var endOffset = void 0;
            var element = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
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
                        var pageNumberIndex = this.getNodeElementFromNode(selection.focusNode).id.indexOf(focusPageId.toString());
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
                    var selectionRangeObject = this.getSelectionRangeObject(firstElement.id, startOffset, lastElement.id, endOffset, pageNumber);
                    var selectionString = selectionRangeObject.toString();
                    var selectionBounds = this.getSelectionBounds(selectionRangeObject, pageNumber);
                    // tslint:disable-next-line:max-line-length
                    return selectionObject = { isBackward: backward, startNode: firstElement.id, startOffset: startOffset, endNode: lastElement.id, endOffset: endOffset, textContent: selectionString, pageNumber: pageNumber, bounds: selectionBounds };
                }
                else {
                    return null;
                }
            }
        }
        return null;
    };
    TextSelection.prototype.getSelectionRangeObject = function (startNode, startOffset, endNode, endOffset, pageNumber) {
        var startElement = document.getElementById(startNode).childNodes[0];
        var endElement = document.getElementById(endNode).childNodes[0];
        // tslint:disable-next-line:radix
        var currentAnchorOffset = parseInt(startNode.split('_' + pageNumber + '_')[1]);
        // tslint:disable-next-line:radix
        var currentFocusOffset = parseInt(endNode.split('_' + pageNumber + '_')[1]);
        var range = document.createRange();
        if (currentAnchorOffset < currentFocusOffset) {
            range.setStart(startElement, startOffset);
            range.setEnd(endElement, endOffset);
        }
        else {
            range.setStart(endElement, endOffset);
            range.setEnd(startElement, startOffset);
        }
        return range;
    };
    TextSelection.prototype.getSelectionBounds = function (range, pageNumber) {
        var startElement = this.getNodeElementFromNode(range.startContainer);
        var endElement = this.getNodeElementFromNode(range.endContainer);
        var bounds = [];
        if (startElement !== endElement) {
            var newStartRange = document.createRange();
            // tslint:disable-next-line:max-line-length
            var startRange = this.createRangeForSelection(range.startContainer, range.endContainer, range.startOffset, range.endOffset, newStartRange);
            bounds.push(this.normalizeBounds(startRange.getBoundingClientRect(), pageNumber));
        }
        else {
            bounds.push(this.normalizeBounds(range.getBoundingClientRect(), pageNumber));
        }
        return bounds;
    };
    TextSelection.prototype.getTextId = function (elementId) {
        var index = elementId.lastIndexOf('_');
        var divId = elementId.substring(index + 1, elementId.length);
        // tslint:disable-next-line:radix
        return parseInt(divId);
    };
    TextSelection.prototype.normalizeBounds = function (bound, pageNumber) {
        var newBounds = null;
        var currentPageElement = this.pdfViewerBase.getElement('_pageDiv_' + pageNumber);
        var currentPageRect = currentPageElement.getBoundingClientRect();
        newBounds = {
            bottom: this.getMagnifiedValue(bound.bottom - currentPageRect.top), height: this.getMagnifiedValue(bound.height),
            left: this.getMagnifiedValue(bound.left - currentPageRect.left), top: this.getMagnifiedValue(bound.top - currentPageRect.top),
            right: this.getMagnifiedValue(bound.right - currentPageRect.left), width: this.getMagnifiedValue(bound.height)
        };
        return newBounds;
    };
    TextSelection.prototype.getMagnifiedValue = function (value) {
        return value / this.pdfViewerBase.getZoomFactor();
    };
    /**
     * @private
     */
    TextSelection.prototype.getCurrentSelectionBounds = function (pageNumber) {
        var bounds = null;
        var ranges = this.selectionRangeArray;
        for (var i = 0; i < ranges.length; i++) {
            if (ranges[i] !== null) {
                if (pageNumber === ranges[i].pageNumber) {
                    bounds = ranges[i].bounds;
                }
            }
        }
        return bounds;
    };
    TextSelection.prototype.createRangeForSelection = function (start, end, startOffset, endOffset, range) {
        range.setStart(start, startOffset);
        range.setEnd(end, endOffset);
        return range;
    };
    TextSelection.prototype.maintainSelectionArray = function () {
        var _this = this;
        if (this.selectionRangeArray.length !== 0) {
            var selection = window.getSelection();
            var isBackward = this.isBackWardSelection(selection);
            // tslint:disable-next-line
            var anchorPage = isNaN(parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1])) ? parseInt(selection.anchorNode.id.split('_pageDiv_')[1]) : parseInt(selection.anchorNode.parentElement.id.split('_text_')[1]);
            if (isNaN(anchorPage)) {
                // tslint:disable-next-line:radix
                anchorPage = parseInt(selection.anchorNode.id.split('_text_')[1]);
            }
            // tslint:disable-next-line
            var focusPage_1 = isNaN(parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1])) ? parseInt(selection.focusNode.id.split('_pageDiv_')[1]) : parseInt(selection.focusNode.parentElement.id.split('_text_')[1]);
            if (isNaN(focusPage_1)) {
                // tslint:disable-next-line
                focusPage_1 = isNaN(parseInt(selection.focusNode.id.split('_text_')[1])) ? parseInt(selection.focusNode.id.split('_textLayer_')[1]) : parseInt(selection.focusNode.id.split('_text_')[1]);
            }
            var arrayObject = [];
            if (!isBackward) {
                arrayObject = this.selectionRangeArray.filter(
                // tslint:disable-next-line
                function (obj) {
                    return (!((_this.selectionStartPage <= obj.pageNumber) && (obj.pageNumber < focusPage_1)));
                });
            }
            else {
                arrayObject = this.selectionRangeArray.filter(
                // tslint:disable-next-line
                function (obj) {
                    return (!((focusPage_1 < obj.pageNumber) && (obj.pageNumber <= _this.selectionStartPage)));
                });
            }
            if (arrayObject.length > 0) {
                for (var i = 0; i < arrayObject.length; i++) {
                    var indexInArray = this.selectionRangeArray.indexOf(arrayObject[i]);
                    if (indexInArray !== -1) {
                        this.selectionRangeArray.splice(indexInArray, 1);
                    }
                }
                if (this.selectionRangeArray.length === 1) {
                    // tslint:disable-next-line:max-line-length
                    if (this.selectionRangeArray[0].pageNumber === anchorPage || this.selectionRangeArray[0].pageNumber === focusPage_1) {
                        arrayObject = [];
                    }
                }
            }
        }
    };
    TextSelection.prototype.isBackWardSelection = function (selection) {
        var position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
        var backward = false;
        if (!position && selection.anchorOffset > selection.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
            backward = true;
        }
        return backward;
    };
    /**
     * @private
     */
    TextSelection.prototype.applySpanForSelection = function () {
        var selection = window.getSelection();
        // tslint:disable-next-line:max-line-length
        if (selection.anchorNode !== null && this.pdfViewerBase.viewerContainer.contains(this.getNodeElementFromNode(selection.anchorNode))) {
            var isBackWardSelection = this.isBackWardSelection(selection);
            var anchorPageId = void 0;
            var focusPageId = void 0;
            var anchorOffsetDiv = void 0;
            var focusOffsetDiv = void 0;
            var anchorOffset = void 0;
            var focusOffset = void 0;
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
                var anchorElement = this.getNodeElementFromNode(selection.anchorNode);
                var focusElement = this.getNodeElementFromNode(selection.focusNode);
                // tslint:disable-next-line
                anchorPageId = (anchorElement.id.indexOf('text_') !== -1) ? parseInt(anchorElement.id.split('text_')[1]) : parseInt(anchorElement.id.split('_textLayer_')[1]);
                // tslint:disable-next-line
                focusPageId = (focusElement.id.indexOf('text_') !== -1) ? parseInt(focusElement.id.split('text_')[1]) : parseInt(focusElement.id.split('_textLayer_')[1]);
                var isFocusChanged = false;
                if (this.isTouchSelection) {
                    if (selection.focusNode === this.pdfViewerBase.pageContainer) {
                        var lastChildNode = this.pdfViewerBase.pageContainer.lastChild;
                        if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                            var lastPageDiv = lastChildNode.previousSibling.previousSibling;
                            // tslint:disable-next-line:radix
                            focusPageId = parseInt(lastPageDiv.id.split('_pageDiv_')[1]);
                            focusElement = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).lastChild;
                            isFocusChanged = true;
                        }
                        else if (lastChildNode.classList.contains('e-pv-page-div')) {
                            var lastPageDiv = lastChildNode;
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
    };
    /**
     * @private
     */
    TextSelection.prototype.initiateTouchSelection = function (event, x, y) {
        // tslint:disable-next-line
        var element = event.target;
        var belowElements = document.elementsFromPoint(event.touches[0].clientX, event.touches[0].clientY);
        if (belowElements.length !== 0) {
            if (belowElements[0].classList.contains('e-pv-hyperlink') && belowElements[1].classList.contains('e-pv-text')) {
                element = belowElements[1];
            }
        }
        this.selectAWord(element, x, y, true);
        this.createTouchSelectElement(event);
        this.maintainSelectionOnZoom(true, false);
        this.applySpanForSelection();
    };
    // tslint:disable-next-line
    TextSelection.prototype.selectTextByTouch = function (element, x, y, isForwardSelection, target, isCloserMovement) {
        var isTextSelected = false;
        if (element.nodeType === element.TEXT_NODE) {
            var rangeObject = element.ownerDocument.createRange();
            var selection = window.getSelection();
            rangeObject.selectNodeContents(element);
            var currentPosition = 0;
            var endPosition = rangeObject.endOffset;
            while (currentPosition < endPosition) {
                rangeObject.setStart(element, currentPosition);
                rangeObject.setEnd(element, currentPosition + 1);
                var rangeBounds = rangeObject.getBoundingClientRect();
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
            for (var i = 0; i < element.childNodes.length; i++) {
                var range = element.childNodes[i].ownerDocument.createRange();
                range.selectNodeContents(element.childNodes[i]);
                var rangeBounds = range.getBoundingClientRect();
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
    };
    // tslint:disable-next-line
    TextSelection.prototype.setTouchSelectionStartPosition = function (selection, range, isForwardSelection, target, element, currentPosition, isCloserMovement) {
        if (isForwardSelection) {
            if (target === 'left') {
                // tslint:disable-next-line
                var startNode = this.getTouchFocusElement(selection, true);
                range.setStart(startNode.focusNode, startNode.focusOffset);
                range.setEnd(element, currentPosition);
                this.selectionAnchorTouch = { anchorNode: range.endContainer.parentElement.id, anchorOffset: range.endOffset };
            }
            else if (target === 'right') {
                // tslint:disable-next-line
                var startNode = this.getTouchAnchorElement(selection, false);
                range.setStart(startNode.anchorNode, startNode.anchorOffset);
                range.setEnd(element, currentPosition);
                this.selectionFocusTouch = { focusNode: range.endContainer.parentElement.id, focusOffset: range.endOffset };
            }
        }
        else {
            if (target === 'left') {
                if (!isCloserMovement) {
                    // tslint:disable-next-line
                    var startNode = this.getTouchFocusElement(selection, false);
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
                var startNode = this.getTouchAnchorElement(selection, true);
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
    };
    TextSelection.prototype.getTouchAnchorElement = function (selection, isCurrentFocus) {
        var element = document.getElementById(this.selectionAnchorTouch.anchorNode.toString());
        var startNode = null;
        var offset = 0;
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
    };
    TextSelection.prototype.getTouchFocusElement = function (selection, isCurrentAnchor) {
        var element = document.getElementById(this.selectionFocusTouch.focusNode.toString());
        var startNode = null;
        var offset = 0;
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
    };
    TextSelection.prototype.createTouchSelectElement = function (event) {
        this.isTouchSelection = true;
        var selection = window.getSelection();
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
            var range = selection.getRangeAt(0);
            var rangePosition = range.getBoundingClientRect();
            var dropElementRect = this.dropDivElementLeft.getBoundingClientRect();
            // tslint:disable-next-line:max-line-length
            var pageTopValue = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
            var viewerLeftPosition = this.pdfViewerBase.viewerContainer.getBoundingClientRect().left;
            var topClientValue = this.getClientValueTop(rangePosition.top, this.pdfViewerBase.currentPageNumber - 1);
            // tslint:disable-next-line:max-line-length
            var topPositionValue = topClientValue + pageTopValue * this.pdfViewerBase.getZoomFactor() + (dropElementRect.height / 2) * this.pdfViewerBase.getZoomFactor() + 'px';
            this.dropDivElementLeft.style.top = topPositionValue;
            this.dropDivElementLeft.style.left = rangePosition.left - (viewerLeftPosition + (dropElementRect.width)) + 'px';
            this.dropDivElementRight.style.top = topPositionValue;
            // tslint:disable-next-line:max-line-length
            this.dropDivElementRight.style.left = rangePosition.left + rangePosition.width - viewerLeftPosition + 'px';
            var currentPageLeft = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
            var currentRangeLeft = rangePosition.left - currentPageLeft;
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
    };
    TextSelection.prototype.initiateSelectionByTouch = function () {
        this.pdfViewerBase.textLayer.clearDivSelection();
        this.pdfViewerBase.contextMenuModule.contextMenuObj.close();
        var lowerPageIndex = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageIndex = (lowerPageIndex < 0) ? 0 : lowerPageIndex;
        var higherPageIndex = this.pdfViewer.currentPageNumber + 1;
        // tslint:disable-next-line:max-line-length
        higherPageIndex = (higherPageIndex < (this.pdfViewerBase.pageCount - 1)) ? higherPageIndex : (this.pdfViewerBase.pageCount - 1);
        for (var i = lowerPageIndex; i <= higherPageIndex; i++) {
            var textLayer = this.pdfViewerBase.getElement('_textLayer_' + i);
            if (textLayer) {
                if (textLayer.childNodes !== null) {
                    this.applySelectionMouseScroll(i);
                }
            }
        }
    };
    // tslint:disable-next-line
    TextSelection.prototype.terminateSelectionByTouch = function (event) {
        this.maintainSelectionOnZoom(true, false);
        this.applySpanForSelection();
        // tslint:disable-next-line:max-line-length
        this.pdfViewerBase.contextMenuModule.contextMenuObj.open(event.changedTouches[0].clientY - this.pdfViewerBase.viewerContainer.offsetTop + this.pdfViewerBase.contextMenuModule.contextMenuElement.clientHeight, event.changedTouches[0].clientX - this.pdfViewerBase.viewerContainer.offsetLeft, this.pdfViewerBase.viewerContainer);
    };
    TextSelection.prototype.getNodeElement = function (range, touchX, touchY, event, nodeElement) {
        if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(touchX, touchY);
            nodeElement = this.onTouchElementScroll(range, nodeElement, touchY, event);
            // tslint:disable-next-line
        }
        else if (document.caretPositionFromPoint) {
            // tslint:disable-next-line
            var start = document.caretPositionFromPoint(touchX, touchY);
            // tslint:disable-next-line
            var end = document.caretPositionFromPoint(touchX, touchY);
            range = document.createRange();
            range.setStart(start.offsetNode, start.offset);
            range.setEnd(end.offsetNode, end.offset);
            nodeElement = this.onTouchElementScroll(range, nodeElement, touchY, event);
        }
        return nodeElement;
    };
    TextSelection.prototype.isTouchedWithinContainer = function (event) {
        var elements = document.elementsFromPoint(event.touches[0].clientX, event.touches[0].clientY);
        var isTouchedWithinContainer = false;
        if (elements.length !== 0) {
            isTouchedWithinContainer = true;
        }
        return isTouchedWithinContainer;
    };
    TextSelection.prototype.onTouchElementScroll = function (range, nodeElement, touchY, event) {
        var viewerScrollTop = this.pdfViewerBase.viewerContainer.scrollTop;
        if (range != null) {
            nodeElement = range.startContainer;
            var isScrollBar = this.isScrolledOnScrollBar(event);
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
    };
    TextSelection.prototype.isCloserTouchScroll = function (currentDifference) {
        var isForwardMovement = false;
        if (this.previousScrollDifference > currentDifference) {
            isForwardMovement = true;
        }
        return isForwardMovement;
    };
    TextSelection.prototype.getClientValueTop = function (clientValue, pageNumber) {
        // tslint:disable-next-line:max-line-length
        return clientValue - this.pdfViewerBase.getElement('_pageDiv_' + pageNumber).getBoundingClientRect().top;
    };
    TextSelection.prototype.isScrolledOnScrollBar = function (event) {
        var isScrollBar = false;
        // tslint:disable-next-line:max-line-length
        if ((this.pdfViewerBase.viewerContainer.clientHeight + this.pdfViewerBase.viewerContainer.offsetTop) < event.touches[0].clientY && event.touches[0].clientY < (this.pdfViewerBase.viewerContainer.offsetHeight + this.pdfViewerBase.viewerContainer.offsetTop)) {
            isScrollBar = true;
        }
        return isScrollBar;
    };
    TextSelection.prototype.getTextLastLength = function (element) {
        if (element) {
            return element.textContent.length;
        }
        else {
            return 0;
        }
    };
    TextSelection.prototype.getNodeElementFromNode = function (node) {
        if (node.parentElement) {
            return node.parentElement;
        }
        else {
            return node.parentNode;
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.copyText = function () {
        var selectionText = '';
        this.maintainSelectionOnZoom(true, false);
        if (this.selectionRangeArray.length > 0) {
            for (var i = 0; i < this.selectionRangeArray.length; i++) {
                selectionText += this.selectionRangeArray[i].textContent;
            }
        }
        if (selectionText.length > 0) {
            var textArea = document.createElement('textarea');
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
    };
    /**
     * @private
     */
    TextSelection.prototype.destroy = function () {
        this.clear();
    };
    /**
     * @private
     */
    TextSelection.prototype.getModuleName = function () {
        return 'TextSelection';
    };
    return TextSelection;
}());

/**
 * export types
 */

/**
 * TextSearch module
 */
var TextSearch = /** @__PURE__ @class */ (function () {
    /**
     * @private
     */
    function TextSearch(pdfViewer, pdfViewerBase) {
        var _this = this;
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
        this.checkBoxOnChange = function (event) {
            if (event.checked) {
                _this.isMatchCase = true;
            }
            else {
                _this.isMatchCase = false;
            }
            if (_this.isTextSearch) {
                _this.resetVariables();
                _this.clearAllOccurrences();
                var inputString = _this.searchInput.value;
                _this.searchIndex = 0;
                _this.textSearch(inputString);
            }
        };
        this.searchKeypressHandler = function (event) {
            _this.enableNextButton(true);
            _this.enablePrevButton(true);
            if (event.which === 13) {
                _this.initiateTextSearch();
                _this.updateSearchInputIcon(false);
            }
            else {
                _this.resetVariables();
            }
        };
        this.searchClickHandler = function (event) {
            if (_this.searchBtn.classList.contains('e-pv-search-icon')) {
                _this.initiateTextSearch();
            }
            else if (_this.searchBtn.classList.contains('e-pv-search-close')) {
                _this.searchInput.value = '';
                _this.resetTextSearch();
                _this.searchInput.focus();
            }
        };
        this.nextButtonOnClick = function (event) {
            _this.nextSearch();
        };
        this.prevButtonOnClick = function (event) {
            _this.prevSearch();
        };
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    TextSearch.prototype.createTextSearchBox = function () {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        this.searchBox = createElement('div', { id: this.pdfViewer.element.id + '_search_box', className: 'e-pv-search-bar' });
        var searchElementsContainer = createElement('div', { id: this.pdfViewer.element.id + '_search_box_elements', className: 'e-pv-search-bar-elements' });
        // tslint:disable-next-line:max-line-length
        var searchInputContainer = createElement('div', { id: this.pdfViewer.element.id + '_search_input_container', className: 'e-input-group e-pv-search-input' });
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
        var matchCaseContainer = createElement('div', { id: this.pdfViewer.element.id + '_match_case_container', className: 'e-pv-match-case-container' });
        var matchCaseInput = createElement('input', { id: this.pdfViewer.element.id + '_match_case' });
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
        this.searchInput.addEventListener('focus', function () {
            _this.searchInput.parentElement.classList.add('e-input-focus');
        });
        this.searchInput.addEventListener('blur', function () {
            _this.searchInput.parentElement.classList.remove('e-input-focus');
        });
        this.searchInput.addEventListener('keypress', this.searchKeypressHandler.bind(this));
        this.searchBtn.addEventListener('click', this.searchClickHandler.bind(this));
        this.nextSearchBtn.addEventListener('click', this.nextButtonOnClick.bind(this));
        this.prevSearchBtn.addEventListener('click', this.prevButtonOnClick.bind(this));
    };
    /**
     * @private
     */
    TextSearch.prototype.textSearchBoxOnResize = function () {
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
    };
    /**
     * @private
     */
    TextSearch.prototype.showSearchBox = function (isShow) {
        if (isShow) {
            this.searchBox.style.display = 'block';
        }
        else {
            this.searchBox.style.display = 'none';
        }
        this.onTextSearchClose();
    };
    /**
     * @private
     */
    TextSearch.prototype.searchAfterSelection = function () {
        if (this.isTextSearch) {
            this.initSearch(this.searchPageIndex, true);
            this.highlightOthers();
        }
    };
    TextSearch.prototype.initiateTextSearch = function () {
        var inputString = this.searchInput.value;
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
    };
    TextSearch.prototype.textSearch = function (inputString) {
        if (inputString !== '' || inputString) {
            this.searchString = inputString;
            this.isTextSearch = true;
            this.searchPageIndex = this.pdfViewerBase.currentPageNumber - 1;
            this.initSearch(this.searchPageIndex, false);
            this.highlightOthers();
        }
    };
    TextSearch.prototype.nextSearch = function () {
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
    };
    TextSearch.prototype.prevSearch = function () {
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
            var inputString = this.searchInput.value;
            this.textSearch(inputString);
        }
    };
    TextSearch.prototype.initSearch = function (pageIndex, isSinglePageSearch) {
        // tslint:disable-next-line
        var storedData = this.pdfViewerBase.getStoredData(pageIndex);
        var pageText = null;
        var textContents = null;
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
    };
    // tslint:disable-next-line:max-line-length
    TextSearch.prototype.getPossibleMatches = function (pageIndex, searchString, pageString, textContents, isSinglePageSearch) {
        var pageText = pageString;
        var searchText = searchString;
        var queryLength = searchString.length;
        if (!this.isMatchCase) {
            searchText = searchString.toLowerCase();
            pageText = pageString.toLowerCase();
        }
        var matches = [];
        var matchIndex = -queryLength;
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
                    var searchPageIndex = this.getSearchPage(pageIndex);
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
    };
    TextSearch.prototype.getSearchPage = function (pageIndex) {
        var pageNumber = null;
        if (this.isPrevSearch) {
            for (var i = pageIndex; i >= 0; i--) {
                if (i !== pageIndex && this.searchCollection[i]) {
                    pageNumber = i;
                    break;
                }
            }
            if (!pageNumber) {
                for (var j = this.pdfViewerBase.pageCount - 1; j > pageIndex; j--) {
                    if (this.searchCollection[j]) {
                        pageNumber = j;
                        break;
                    }
                }
            }
        }
        else {
            for (var i = pageIndex; i < this.pdfViewerBase.pageCount; i++) {
                if (i !== pageIndex && this.searchCollection[i]) {
                    pageNumber = i;
                    break;
                }
            }
            if (!pageNumber) {
                for (var j = 0; j < pageIndex; j++) {
                    if (this.searchCollection[j]) {
                        pageNumber = j;
                        break;
                    }
                }
            }
        }
        return pageNumber;
    };
    TextSearch.prototype.convertMatches = function (pageIndex, queryLength, textContents, isSinglePageSearch) {
        var m = 0;
        var matches = this.searchMatches[pageIndex];
        var divIndex = 0;
        var end = textContents.length - 1;
        var matchCollection = [];
        for (var i = 0; i < matches.length; i++) {
            var matchIndex = matches[i];
            while (m !== end && matchIndex >= (divIndex + textContents[m].split('\r\n')[0].length)) {
                divIndex += textContents[m].split('\r\n')[0].length;
                m++;
            }
            var match = {
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
    };
    TextSearch.prototype.highlightSearchedTexts = function (pageIndex, isSinglePageSearch) {
        var matches = this.searchCollection[pageIndex];
        var prevEnd = null;
        // tslint:disable-next-line
        var scrollPoint = { y: -100, x: -400 };
        var startId;
        var className;
        for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            // tslint:disable-next-line
            var start = match.begin;
            // tslint:disable-next-line
            var end = match.end;
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
                for (var k = start.divId + 1; k < end.divId; k++) {
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
            var element = this.pdfViewerBase.getElement('_text_' + pageIndex + '_' + startId);
            if (element) {
                this.scrollToSearchStr(element, scrollPoint);
            }
            else {
                this.pdfViewerBase.updateScrollTop(pageIndex);
                var element_1 = this.pdfViewerBase.getElement('_text_' + pageIndex + '_' + startId);
                this.scrollToSearchStr(element_1, scrollPoint);
            }
        }
    };
    // tslint:disable-next-line
    TextSearch.prototype.beginText = function (start, pageIndex, className) {
        var divIndex = parseFloat(start.divId);
        var textDiv = this.pdfViewerBase.getElement('_text_' + pageIndex + '_' + divIndex);
        if (textDiv) {
            // tslint:disable-next-line
            this.tempElementStorage = new Array();
            for (var i = 0; i < textDiv.childNodes.length; i++) {
                // tslint:disable-next-line:max-line-length
                var ele = { text: textDiv.childNodes[i].textContent, classString: textDiv.childNodes[i].className };
                this.tempElementStorage.push(ele);
            }
            textDiv.textContent = '';
            this.addSpanForSearch(pageIndex, divIndex, 0, start.offsetValue, className);
        }
    };
    // tslint:disable-next-line:max-line-length
    TextSearch.prototype.addSpanForSearch = function (pageIndex, divIndex, fromOffset, toOffset, className) {
        var divTextContent;
        var textDiv = this.pdfViewerBase.getElement('_text_' + pageIndex + '_' + divIndex);
        if (textDiv) {
            var textContent = this.textContents[pageIndex];
            divTextContent = textContent[divIndex].substring(fromOffset, toOffset);
            var node = document.createTextNode(divTextContent);
            if (className) {
                var spanElement = document.createElement('span');
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
    };
    TextSearch.prototype.isClassAvailable = function () {
        var isClass = false;
        for (var j = 0; j < this.tempElementStorage.length; j++) {
            if (this.tempElementStorage[j].classString) {
                // tslint:disable-next-line:max-line-length
                if (this.tempElementStorage[j].classString === 'e-pv-search-text-highlight' || this.tempElementStorage[j].classString === 'e-pv-search-text-highlightother') {
                    isClass = true;
                    break;
                }
            }
        }
        return isClass;
    };
    TextSearch.prototype.addSpan = function (text, textDiv) {
        var newNode = document.createTextNode(text);
        var spanElement = document.createElement('span');
        spanElement.className = 'e-pv-maintaincontent';
        spanElement.appendChild(newNode);
        textDiv.appendChild(spanElement);
    };
    TextSearch.prototype.searchOnSelection = function (textDiv, node, divTextContent) {
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
                for (var i = 0; i < this.tempElementStorage.length; i++) {
                    if (this.tempElementStorage[i].classString) {
                        if (this.tempElementStorage[i].classString.indexOf('e-pv-maintaincontent') !== -1) {
                            if (this.tempElementStorage[i].text === node.textContent) {
                                this.addSpan(node.textContent, textDiv);
                                break;
                            }
                            else {
                                if (this.tempElementStorage[i].text !== node.textContent) {
                                    var currentString = node.textContent;
                                    var isClassAvailable = this.isClassAvailable();
                                    var subString = void 0;
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
                                            var nextSubString = divTextContent.substring(this.tempElementStorage[i].text.length, divTextContent.length);
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
                                            var subString_1 = this.tempElementStorage[i].text.substring(textDiv.textContent.length, currentString.length);
                                            if (this.tempElementStorage[i].text.indexOf(subString_1) !== -1 && this.tempElementStorage[i].classString && // tslint:disable-next-line
                                                subString_1 !== '' && !this.tempElementStorage[i + 1].classString && divTextContent.indexOf(subString_1) !== -1) {
                                                this.addSpan(subString_1, textDiv);
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
                            var currentString = node.textContent;
                            if (currentString !== '') {
                                var isClassAvailable = this.isClassAvailable();
                                var subString = void 0;
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
                                        var balanceString = currentString.substring(this.tempElementStorage[i].text.length, currentString.length);
                                        var nextString = this.tempElementStorage[i + 1].text.substring(0, balanceString.length);
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
                                                var newSubString = divTextContent.substring(0, subString.length);
                                                node.textContent = newSubString;
                                                textDiv.appendChild(node); // tslint:disable-next-line
                                                var nextNewSubString = divTextContent.substring(subString.length, divTextContent.length);
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
    };
    // tslint:disable-next-line
    TextSearch.prototype.scrollToSearchStr = function (element, scrollPoint) {
        var parent = element.offsetParent;
        var offsetY = element.offsetTop + element.clientTop;
        var offsetX = element.offsetLeft + element.clientLeft;
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
    };
    /**
     * @private
     */
    TextSearch.prototype.highlightOtherOccurrences = function (pageNumber) {
        this.initSearch(pageNumber, true);
    };
    TextSearch.prototype.highlightOthers = function () {
        var indexes = this.getIndexes();
        var lowerPageValue = parseFloat(indexes.lowerPageValue.toString());
        var higherPageValue = parseFloat(indexes.higherPageValue.toString());
        for (var i = lowerPageValue; i <= higherPageValue; i++) {
            this.highlightOtherOccurrences(i);
        }
    };
    TextSearch.prototype.clearAllOccurrences = function () {
        this.pdfViewerBase.textLayer.clearDivSelection();
        this.applyTextSelection();
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    TextSearch.prototype.getIndexes = function () {
        var lowerPageValue = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        var higherPageValue = this.pdfViewerBase.currentPageNumber + 1;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        return { lowerPageValue: lowerPageValue, higherPageValue: higherPageValue };
    };
    TextSearch.prototype.applyTextSelection = function () {
        if (this.pdfViewer.textSelectionModule && !this.pdfViewerBase.isTextSelectionDisabled) {
            var indexes = this.getIndexes();
            var lowerPageValue = parseFloat(indexes.lowerPageValue.toString());
            var higherPageValue = parseFloat(indexes.higherPageValue.toString());
            for (var i = lowerPageValue; i <= higherPageValue; i++) {
                this.pdfViewer.textSelectionModule.applySelectionRangeOnScroll(i);
            }
        }
    };
    /**
     * @private
     */
    TextSearch.prototype.resetTextSearch = function () {
        this.resetVariables();
        this.onTextSearchClose();
        this.searchPageIndex = null;
        this.searchIndex = 0;
        this.updateSearchInputIcon(true);
        this.enableNextButton(false);
        this.enablePrevButton(false);
    };
    TextSearch.prototype.onTextSearchClose = function () {
        this.isPrevSearch = false;
        this.isTextSearch = false;
        if (this.pdfViewerBase.pageCount > 0) {
            this.clearAllOccurrences();
        }
    };
    TextSearch.prototype.createRequestForSearch = function (pageIndex) {
        var _this = this;
        var jsonObject;
        // tslint:disable-next-line:max-line-length
        jsonObject = { xCoordinate: 0, yCoordinate: 0, pageNumber: pageIndex, documentId: this.pdfViewerBase.getDocumentId(), hashId: this.pdfViewerBase.hashId, zoomFactor: this.pdfViewerBase.getZoomFactor() };
        var request = new XMLHttpRequest();
        request.open('POST', this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderPages);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.responseType = 'json';
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        request.onreadystatechange = function (event) {
            var proxy = _this.pdfViewerBase;
            if (request.readyState === 4 && request.status === 200) {
                // tslint:disable-next-line
                var data = event.currentTarget.response;
                // tslint:disable-next-line:max-line-length
                if (typeof data !== 'object') {
                    data = JSON.parse(data);
                }
                if (data) {
                    if (data.pageText) {
                        proxy.storeWinData(data, pageIndex);
                        _this.initSearch(pageIndex, false);
                    }
                }
            }
            else if (request.readyState === 4 && request.status === 400) {
                // error
                _this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
            }
        };
        // tslint:disable-next-line
        request.onerror = function (event) {
            _this.pdfViewerBase.openNotificationPopup();
            _this.pdfViewer.fireAjaxRequestFailed(request.status, request.statusText);
        };
    };
    TextSearch.prototype.createSearchBoxButtons = function (id, className) {
        // tslint:disable-next-line:max-line-length
        var button = createElement('button', { id: this.pdfViewer.element.id + '_' + id, className: 'e-btn e-icon-btn e-pv-search-btn ' + className });
        var iconSpan = createElement('span', { id: this.pdfViewer.element.id + '_' + id + 'Icon', className: 'e-pv-icon-search ' + className + '-icon' });
        button.disabled = true;
        button.appendChild(iconSpan);
        return button;
    };
    TextSearch.prototype.enablePrevButton = function (isEnable) {
        if (isEnable) {
            this.prevSearchBtn.removeAttribute('disabled');
        }
        else {
            this.prevSearchBtn.disabled = true;
        }
    };
    TextSearch.prototype.enableNextButton = function (isEnable) {
        if (isEnable) {
            this.nextSearchBtn.removeAttribute('disabled');
        }
        else {
            this.nextSearchBtn.disabled = true;
        }
    };
    TextSearch.prototype.resetVariables = function () {
        this.searchedPages = [];
        // tslint:disable-next-line
        this.searchMatches = new Array();
        // tslint:disable-next-line
        this.searchCollection = new Array();
    };
    TextSearch.prototype.updateSearchInputIcon = function (isEnable) {
        if (isEnable) {
            this.searchBtn.classList.remove('e-pv-search-close');
            this.searchBtn.classList.add('e-pv-search-icon');
        }
        else {
            this.searchBtn.classList.remove('e-pv-search-icon');
            this.searchBtn.classList.add('e-pv-search-close');
        }
    };
    TextSearch.prototype.onMessageBoxOpen = function () {
        this.pdfViewerBase.getElement('_search_input').blur();
        this.isMessagePopupOpened = true;
    };
    /**
     * Searches the target text in the PDF document and highlights the occurrences in the pages
     * @param  {string} searchText
     * @param  {boolean} isMatchCase
     * @returns void
     */
    TextSearch.prototype.searchText = function (searchText, isMatchCase) {
        this.searchString = searchText;
        this.isMatchCase = isMatchCase;
        this.searchIndex = 0;
        this.textSearch(searchText);
    };
    /**
     * Searches the next occurrence of the searched text from the current occurrence of the PdfViewer.
     * @returns void
     */
    TextSearch.prototype.searchNext = function () {
        this.nextSearch();
    };
    /**
     * Searches the previous occurrence of the searched text from the current occurrence of the PdfViewer.
     * @returns void
     */
    TextSearch.prototype.searchPrevious = function () {
        this.prevSearch();
    };
    /**
     * Cancels the text search of the PdfViewer.
     * @returns void
     */
    TextSearch.prototype.cancelTextSearch = function () {
        this.resetTextSearch();
    };
    /**
     * @private
     */
    TextSearch.prototype.destroy = function () {
        this.searchCollection = undefined;
    };
    /**
     * @private
     */
    TextSearch.prototype.getModuleName = function () {
        return 'TextSearch';
    };
    return TextSearch;
}());

/**
 * export types
 */

/**
 * Print module
 */
var Print = /** @__PURE__ @class */ (function () {
    /**
     * @private
     */
    function Print(viewer, base) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * Print the PDF document being loaded in the ejPdfViewer control.
     * @returns void
     */
    Print.prototype.print = function () {
        var _this = this;
        var pageIndex;
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
            setTimeout(function () {
                for (pageIndex = 0; pageIndex <= _this.pdfViewerBase.pageCount; pageIndex++) {
                    if (pageIndex < _this.pdfViewerBase.pageCount) {
                        var pageWidth = _this.pdfViewerBase.pageSize[pageIndex].width;
                        var pageHeight = _this.pdfViewerBase.pageSize[pageIndex].height;
                        _this.pdfViewer.printModule.createRequestForPrint(pageIndex, pageWidth, pageHeight, _this.pdfViewerBase.pageCount);
                    }
                    else {
                        _this.printWindowOpen();
                    }
                }
            }, 100);
        }
    };
    Print.prototype.createRequestForPrint = function (pageIndex, pageWidth, pageHeight, pageCount) {
        var proxy = this;
        var request = new XMLHttpRequest();
        // tslint: disable-next-line:max-line-length
        // set default zoomFactor value.  
        var jsonObject = { pageNumber: pageIndex, documentId: this.pdfViewerBase.documentId,
            hashId: this.pdfViewerBase.hashId, zoomFactor: 1 };
        request.open('POST', proxy.pdfViewer.serviceUrl + '/PrintImages', false);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.send(JSON.stringify(jsonObject));
        var printImage = request.responseText;
        // tslint:disable-next-line
        var pageImage = new Image();
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
    };
    Print.prototype.printWindowOpen = function () {
        var _this = this;
        var browserUserAgent = navigator.userAgent;
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
        setTimeout(function () {
            _this.iframe.contentWindow.print();
            _this.iframe.contentWindow.focus();
            document.body.removeChild(_this.iframe);
        }, 200);
    };
    /**
     * @private
     */
    Print.prototype.destroy = function () {
        this.printViewerContainer = undefined;
        this.frameDoc = undefined;
    };
    /**
     * @private
     */
    Print.prototype.getModuleName = function () {
        return 'Print';
    };
    return Print;
}());

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
//# sourceMappingURL=ej2-pdfviewer.es5.js.map
