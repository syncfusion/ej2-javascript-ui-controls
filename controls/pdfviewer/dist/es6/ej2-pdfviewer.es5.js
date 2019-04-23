import { Browser, ChildProperty, Component, Event, L10n, NotifyPropertyChanges, Property, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ColorPicker, NumericTextBox, Slider } from '@syncfusion/ej2-inputs';
import { ContextMenu, Toolbar, TreeView } from '@syncfusion/ej2-navigations';
import { Dialog, Tooltip, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { Toast } from '@syncfusion/ej2-notifications';
import { ComboBox } from '@syncfusion/ej2-dropdowns';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { ListView } from '@syncfusion/ej2-lists';
import { CheckBox } from '@syncfusion/ej2-buttons';

/**
 * The `Annotation` module is used to handle annotation actions of PDF viewer.
 */
var Annotation = /** @__PURE__ @class */ (function () {
    /**
     * @private
     */
    function Annotation(pdfViewer, viewerBase) {
        /**
         * @private
         */
        this.actionCollection = [];
        /**
         * @private
         */
        this.redoCollection = [];
        /**
         * @private
         */
        this.isPopupNoteVisible = false;
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
        if (this.pdfViewer.enableTextMarkupAnnotation) {
            this.textMarkupAnnotationModule = new TextMarkupAnnotation(this.pdfViewer, this.pdfViewerBase);
        }
    }
    /**
     * Set annotation type to be added in next user interaction in PDF Document.
     * @param type
     * @returns void
     */
    Annotation.prototype.setAnnotationMode = function (type) {
        if (type === 'None') {
            this.clearAnnotationMode();
        }
        else if (type === 'Highlight' || type === 'Strikethrough' || type === 'Underline') {
            if (this.textMarkupAnnotationModule) {
                this.textMarkupAnnotationModule.drawTextMarkupAnnotations(type.toString());
            }
        }
    };
    Annotation.prototype.clearAnnotationMode = function () {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
        }
    };
    /**
     * @private
     */
    Annotation.prototype.deleteAnnotation = function () {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.deleteTextMarkupAnnotation();
            if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(false);
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableAnnotationPropertiesTools(false);
            }
        }
    };
    /**
     * @private
     */
    Annotation.prototype.initializeCollection = function () {
        this.actionCollection = [];
        this.redoCollection = [];
        if (!this.popupNote) {
            this.createNote();
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Annotation.prototype.addAction = function (pageNumber, index, annotation, actionString, property) {
        var action = { pageIndex: pageNumber, index: index, annotation: annotation, action: actionString, modifiedProperty: property };
        this.actionCollection.push(action);
        this.updateToolbar();
    };
    /**
     * @private
     */
    Annotation.prototype.undo = function () {
        var actionObject = this.actionCollection.pop();
        if (actionObject) {
            switch (actionObject.action) {
                case 'Text Markup Added':
                case 'Text Markup Deleted':
                    if (this.textMarkupAnnotationModule) {
                        // tslint:disable-next-line:max-line-length
                        this.textMarkupAnnotationModule.undoTextMarkupAction(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.action);
                    }
                    break;
                case 'Text Markup Property modified':
                    if (this.textMarkupAnnotationModule) {
                        // tslint:disable-next-line:max-line-length
                        actionObject.annotation = this.textMarkupAnnotationModule.undoRedoPropertyChange(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.modifiedProperty);
                    }
                    break;
            }
            this.redoCollection.push(actionObject);
            this.updateToolbar();
        }
    };
    /**
     * @private
     */
    Annotation.prototype.redo = function () {
        var actionObject = this.redoCollection.pop();
        if (actionObject) {
            switch (actionObject.action) {
                case 'Text Markup Added':
                case 'Text Markup Deleted':
                    if (this.textMarkupAnnotationModule) {
                        // tslint:disable-next-line:max-line-length
                        this.textMarkupAnnotationModule.redoTextMarkupAction(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.action);
                    }
                    break;
                case 'Text Markup Property modified':
                    if (this.textMarkupAnnotationModule) {
                        // tslint:disable-next-line:max-line-length
                        actionObject.annotation = this.textMarkupAnnotationModule.undoRedoPropertyChange(actionObject.annotation, actionObject.pageIndex, actionObject.index, actionObject.modifiedProperty);
                    }
                    break;
            }
            this.actionCollection.push(actionObject);
            this.updateToolbar();
        }
    };
    Annotation.prototype.updateToolbar = function () {
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateUndoRedoButtons();
        }
    };
    Annotation.prototype.createNote = function () {
        // tslint:disable-next-line:max-line-length
        this.popupNote = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note', className: 'e-pv-annotation-note', styles: 'display:none' });
        this.popupNoteAuthor = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note_author', className: 'e-pv-annotation-note-author' });
        this.popupNote.appendChild(this.popupNoteAuthor);
        // tslint:disable-next-line:max-line-length
        this.popupNoteContent = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note_content', className: 'e-pv-annotation-note-content' });
        this.popupNote.appendChild(this.popupNoteContent);
        this.pdfViewerBase.mainContainer.appendChild(this.popupNote);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Annotation.prototype.showPopupNote = function (event, color, author, note, type) {
        var mainContainerPosition = this.pdfViewerBase.mainContainer.getBoundingClientRect();
        var popupNoteClientRect = this.popupNote.getBoundingClientRect();
        if (author) {
            this.popupNoteAuthor.textContent = author;
        }
        this.popupNoteContent.textContent = note;
        if (type === 'Highlight') {
            this.popupNote.style.backgroundColor = 'rgb(237, 232, 177)';
        }
        else if (type === 'Underline') {
            this.popupNote.style.backgroundColor = 'rgb(187, 241, 191)';
        }
        else if (type === 'Strikethrough') {
            this.popupNote.style.backgroundColor = 'rgb(242, 188, 207)';
        }
        this.popupNote.style.display = 'block';
        var topPosition = (event.pageY - mainContainerPosition.top + 5);
        var leftPosition = (event.pageX - mainContainerPosition.left + 5);
        if (leftPosition + popupNoteClientRect.width > mainContainerPosition.width) {
            leftPosition = leftPosition - popupNoteClientRect.width;
        }
        if (topPosition + popupNoteClientRect.height > mainContainerPosition.height) {
            topPosition = topPosition - popupNoteClientRect.height;
        }
        this.popupNote.style.top = topPosition + 'px';
        this.popupNote.style.left = leftPosition + 'px';
    };
    /**
     * @private
     */
    Annotation.prototype.hidePopupNote = function () {
        this.popupNote.style.display = 'none';
    };
    Annotation.prototype.createTextMarkupPopup = function () {
        var _this = this;
        var elementId = this.pdfViewer.element.id;
        // tslint:disable-next-line:max-line-length
        this.popupElement = createElement('div', { id: elementId + '_popup_annotation_note', className: 'e-pv-annotation-popup-menu', styles: 'display:none' });
        var headerElement = createElement('div', { id: elementId + '_popup_header', className: 'e-pv-annotation-popup-header' });
        // tslint:disable-next-line:max-line-length
        this.authorPopupElement = createElement('div', { id: elementId + '_popup_author', className: 'e-pv-annotation-popup-author' });
        headerElement.appendChild(this.authorPopupElement);
        // tslint:disable-next-line:max-line-length
        var closeBtn = createElement('span', { id: elementId + '_popup_close', className: 'e-pv-annotation-popup-close e-pv-icon' });
        headerElement.appendChild(closeBtn);
        this.popupElement.appendChild(headerElement);
        // tslint:disable-next-line:max-line-length
        this.modifiedDateElement = createElement('div', { id: elementId + '_popup_modified_time', className: 'e-pv-annotation-modified-time' });
        this.popupElement.appendChild(this.modifiedDateElement);
        // tslint:disable-next-line:max-line-length
        var contentContainer = createElement('div', { id: elementId + '_popup_content_container', className: 'e-pv-annotation-popup-note-container' });
        this.noteContentElement = createElement('div', { id: elementId + '_popup_content', className: 'e-pv-annotation-popup-content' });
        this.noteContentElement.contentEditable = 'true';
        contentContainer.appendChild(this.noteContentElement);
        this.popupElement.appendChild(contentContainer);
        this.pdfViewerBase.viewerContainer.appendChild(this.popupElement);
        closeBtn.addEventListener('click', this.saveClosePopupMenu.bind(this));
        closeBtn.addEventListener('touchend', this.saveClosePopupMenu.bind(this));
        this.popupElement.addEventListener('mousedown', this.onPopupElementMoveStart.bind(this));
        this.popupElement.addEventListener('mousemove', this.onPopupElementMove.bind(this));
        window.addEventListener('mouseup', this.onPopupElementMoveEnd.bind(this));
        this.popupElement.addEventListener('touchstart', this.onPopupElementMoveStart.bind(this));
        this.popupElement.addEventListener('touchmove', this.onPopupElementMove.bind(this));
        window.addEventListener('touchend', this.onPopupElementMoveEnd.bind(this));
        this.noteContentElement.addEventListener('mousedown', function () { _this.noteContentElement.focus(); });
    };
    // tslint:disable-next-line
    Annotation.prototype.onPopupElementMoveStart = function (event) {
        if (event.type === 'touchstart') {
            event = event.changedTouches[0];
        }
        if ((event.target.id !== (this.noteContentElement.id) || !(event.target.contains(this.noteContentElement.childNodes[0])))) {
            this.isPopupMenuMoved = true;
            var popupElementClientRect = this.popupElement.getBoundingClientRect();
            this.clientX = event.clientX - popupElementClientRect.left;
            // tslint:disable-next-line:max-line-length
            this.clientY = (event.clientY - popupElementClientRect.top) + (this.pdfViewerBase.pageSize[this.currentAnnotPageNumber].top * this.pdfViewerBase.getZoomFactor());
        }
    };
    // tslint:disable-next-line
    Annotation.prototype.onPopupElementMove = function (event) {
        if (event.type === 'touchmove') {
            event = event.changedTouches[0];
        }
        // tslint:disable-next-line:max-line-length
        if (this.isPopupMenuMoved && (event.target.id !== (this.noteContentElement.id) || !(event.target.contains(this.noteContentElement.childNodes[0])))) {
            var left = (event.clientX - this.clientX) + parseFloat(this.popupElement.style.left);
            var top_1 = ((event.clientY - this.clientY) + parseFloat(this.popupElement.style.top));
            this.clientX = event.clientX;
            this.clientY = event.clientY;
            var clientPosition = this.popupElement.getBoundingClientRect();
            var pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + this.currentAnnotPageNumber);
            // tslint:disable-next-line:max-line-length
            if (left > parseFloat(pageDiv.style.left) && (left + clientPosition.width) < (parseFloat(pageDiv.style.left) + parseFloat(pageDiv.style.width))) {
                this.popupElement.style.left = (left) + 'px';
            }
            else {
                this.popupElement.style.left = parseFloat(this.popupElement.style.left) + 'px';
            }
            // tslint:disable-next-line:max-line-length
            if (top_1 > parseFloat(pageDiv.style.top) && (top_1 + clientPosition.height) < (parseFloat(pageDiv.style.top) + parseFloat(pageDiv.style.height))) {
                this.popupElement.style.top = (top_1) + 'px';
            }
            else {
                this.popupElement.style.top = parseFloat(this.popupElement.style.top) + 'px';
            }
        }
    };
    Annotation.prototype.onPopupElementMoveEnd = function () {
        this.isPopupMenuMoved = false;
    };
    Annotation.prototype.saveClosePopupMenu = function () {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.saveNoteContent(this.currentAnnotPageNumber, this.noteContentElement.innerText);
        }
        this.closePopupMenu();
    };
    /**
     * @private
     */
    Annotation.prototype.closePopupMenu = function () {
        if (this.popupElement) {
            this.popupElement.parentElement.removeChild(this.popupElement);
            this.popupElement = null;
            this.isPopupNoteVisible = false;
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Annotation.prototype.showAnnotationPopup = function (event) {
        if (this.textMarkupAnnotationModule) {
            this.currentAnnotPageNumber = this.getEventPageNumber(event);
            // tslint:disable-next-line:max-line-length
            if (this.textMarkupAnnotationModule && (event.target !== (this.noteContentElement) || (event.target.contains(this.noteContentElement.childNodes[0])))) {
                this.hidePopupNote();
                if (!this.popupElement) {
                    this.createTextMarkupPopup();
                    this.popupElement.style.display = 'block';
                    this.authorPopupElement.textContent = this.textMarkupAnnotationModule.currentTextMarkupAnnotation.author;
                    // tslint:disable-next-line:max-line-length
                    this.modifiedDateElement.textContent = this.getProperDate(this.textMarkupAnnotationModule.currentTextMarkupAnnotation.modifiedDate);
                    this.noteContentElement.textContent = this.textMarkupAnnotationModule.currentTextMarkupAnnotation.note;
                    var clientPosition = this.popupElement.getBoundingClientRect();
                    // tslint:disable-next-line:max-line-length
                    var pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + this.currentAnnotPageNumber);
                    var canvasPosition = pageDiv.getBoundingClientRect();
                    var topPosition = ((event.clientY) - canvasPosition.top) + parseFloat(pageDiv.style.top);
                    var leftPosition = (event.clientX);
                    if ((leftPosition + clientPosition.width) > (parseFloat(pageDiv.style.left) + parseFloat(pageDiv.style.width))) {
                        this.popupElement.style.left = (leftPosition - clientPosition.width) + 'px';
                    }
                    else {
                        this.popupElement.style.left = leftPosition + 'px';
                    }
                    if ((topPosition + clientPosition.height) > (parseFloat(pageDiv.style.top) + parseFloat(pageDiv.style.height))) {
                        this.popupElement.style.top = (topPosition - clientPosition.height) + 'px';
                    }
                    else {
                        this.popupElement.style.top = topPosition + 'px';
                    }
                    this.isPopupNoteVisible = true;
                }
            }
        }
    };
    Annotation.prototype.getProperDate = function (date) {
        var dateObject = new Date(date.toString());
        if (isNaN(dateObject.getFullYear())) {
            var dateString = date.slice(2, 16);
            // tslint:disable-next-line:max-line-length
            dateString = dateString.slice(0, 4) + '/' + dateString.slice(4, 6) + '/' + dateString.slice(6, 8) + ' ' + dateString.slice(8, 10) + ':' + dateString.slice(10, 12) + ':' + dateString.slice(12, 14);
            dateObject = new Date(dateString);
        }
        // tslint:disable-next-line:max-line-length
        return (dateObject.getMonth() + 1) + '/' + dateObject.getDate() + '/' + dateObject.getFullYear() + ' ' + dateObject.getHours() + ':' + dateObject.getMinutes() + ':' + dateObject.getSeconds();
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Annotation.prototype.getEventPageNumber = function (event) {
        var eventTarget = event.target;
        // tslint:disable-next-line:max-line-length
        var pageString = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1];
        // tslint:disable-next-line
        return parseInt(pageString);
    };
    /**
     * private
     */
    Annotation.prototype.clear = function () {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.clear();
        }
    };
    /**
     * @private
     */
    Annotation.prototype.destroy = function () {
        this.textMarkupAnnotationModule.clear();
    };
    /**
     * @private
     */
    Annotation.prototype.getModuleName = function () {
        return 'Annotation';
    };
    return Annotation;
}());

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
                var pageDiv = document.getElementById(this_2.pdfViewer.element.id + '_pageDiv_' + pageIndex);
                pageDiv.appendChild(aTag);
            }
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
            var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + pageNumber);
            if (pageDiv) {
                var pageChildNodes = pageDiv.childNodes;
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
 * The `TextMarkupAnnotation` module is used to handle text markup annotation actions of PDF viewer.
 * @hidden
 */
var TextMarkupAnnotation = /** @__PURE__ @class */ (function () {
    /**
     * @private
     */
    function TextMarkupAnnotation(pdfViewer, viewerBase) {
        /**
         * @private
         */
        this.currentTextMarkupAddMode = '';
        /**
         * @private
         */
        this.selectTextMarkupCurrentPage = null;
        /**
         * @private
         */
        this.currentTextMarkupAnnotation = null;
        this.currentAnnotationIndex = null;
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
        this.highlightColor = pdfViewer.highlightSettings.color;
        this.underlineColor = pdfViewer.underlineSettings.color;
        this.strikethroughColor = pdfViewer.strikethroughSettings.color;
        this.highlightOpacity = pdfViewer.highlightSettings.opacity;
        this.underlineOpacity = pdfViewer.underlineSettings.opacity;
        this.strikethroughOpacity = pdfViewer.strikethroughSettings.opacity;
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    TextMarkupAnnotation.prototype.createAnnotationLayer = function (pageDiv, pageWidth, pageHeight, pageNumber, displayMode) {
        // tslint:disable-next-line:max-line-length
        var annotationCanvas = createElement('canvas', { id: this.pdfViewer.element.id + '_annotationCanvas_' + pageNumber, className: 'e-pv-annotation-canvas' });
        annotationCanvas.width = pageWidth;
        annotationCanvas.height = pageHeight;
        annotationCanvas.style.display = displayMode;
        pageDiv.appendChild(annotationCanvas);
        return annotationCanvas;
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    TextMarkupAnnotation.prototype.renderTextMarkupAnnotationsInPage = function (textMarkupAnnotations, pageNumber) {
        var canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        this.renderTextMarkupAnnotations(textMarkupAnnotations, pageNumber, canvas, this.pdfViewerBase.getZoomFactor());
    };
    // tslint:disable-next-line
    TextMarkupAnnotation.prototype.renderTextMarkupAnnotations = function (textMarkupAnnotations, pageNumber, canvas, factor) {
        if (canvas) {
            canvas.width = this.getMagnifiedValue(this.pdfViewerBase.pageSize[pageNumber].width, factor);
            canvas.height = this.getMagnifiedValue(this.pdfViewerBase.pageSize[pageNumber].height, factor);
            var context = canvas.getContext('2d');
            context.setLineDash([]);
            // tslint:disable-next-line
            var annotations = this.getAnnotations(pageNumber, textMarkupAnnotations);
            if (annotations) {
                for (var i = 0; i < annotations.length; i++) {
                    // tslint:disable-next-line
                    var annotation = annotations[i];
                    var annotationObject = null;
                    if (annotation.TextMarkupAnnotationType) {
                        // tslint:disable-next-line:max-line-length
                        annotationObject = { textMarkupAnnotationType: annotation.TextMarkupAnnotationType, color: annotation.Color, opacity: annotation.Opacity, bounds: annotation.Bounds, author: annotation.Author, subject: annotation.Subject, modifiedDate: annotation.ModifiedDate, note: annotation.Note, rect: annotation.Rect };
                        this.storeAnnotations(pageNumber, annotationObject);
                    }
                    // tslint:disable-next-line:max-line-length
                    var type = annotation.TextMarkupAnnotationType ? annotation.TextMarkupAnnotationType : annotation.textMarkupAnnotationType;
                    // tslint:disable-next-line
                    var annotBounds = annotation.Bounds ? annotation.Bounds : annotation.bounds;
                    var opacity = annotation.Opacity ? annotation.Opacity : annotation.opacity;
                    var color = annotation.Color ? annotation.Color : annotation.color;
                    switch (type) {
                        case 'Highlight':
                            this.renderHighlightAnnotation(annotBounds, opacity, color, context, factor);
                            break;
                        case 'Strikethrough':
                            this.renderStrikeoutAnnotation(annotBounds, opacity, color, context, factor);
                            break;
                        case 'Underline':
                            this.renderUnderlineAnnotation(annotBounds, opacity, color, context, factor);
                            break;
                    }
                }
            }
            if (pageNumber === this.selectTextMarkupCurrentPage) {
                this.maintainAnnotationSelection();
            }
        }
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.drawTextMarkupAnnotations = function (type) {
        this.isTextMarkupAnnotationMode = true;
        this.currentTextMarkupAddMode = type;
        var selectionObject = this.pdfViewer.textSelectionModule.selectionRangeArray;
        if (selectionObject.length > 0) {
            this.convertSelectionToTextMarkup(type, selectionObject, this.pdfViewerBase.getZoomFactor());
        }
        if (window.getSelection().toString()) {
            var pageBounds = this.getDrawnBounds();
            if (pageBounds.length > 0) {
                for (var i = 0; i < pageBounds.length; i++) {
                    // tslint:disable-next-line:max-line-length
                    this.drawTextMarkups(type, pageBounds[i].bounds, pageBounds[i].pageIndex, pageBounds[i].rect, this.pdfViewerBase.getZoomFactor());
                }
            }
        }
        // this.pdfViewerBase.annotationHelper.redoCollection = [];
        this.pdfViewer.textSelectionModule.clearTextSelection();
    };
    TextMarkupAnnotation.prototype.convertSelectionToTextMarkup = function (type, selectionObject, factor) {
        for (var i = 0; i < selectionObject.length; i++) {
            this.drawTextMarkups(type, selectionObject[i].rectangleBounds, selectionObject[i].pageNumber, selectionObject[i].bound, factor);
        }
    };
    // tslint:disable-next-line
    TextMarkupAnnotation.prototype.drawTextMarkups = function (type, bounds, pageNumber, rect, factor) {
        var annotation = null;
        var context = this.getPageContext(pageNumber);
        if (context) {
            context.setLineDash([]);
            switch (type) {
                case 'Highlight':
                    // tslint:disable-next-line:max-line-length
                    annotation = this.getAddedAnnotation(type, this.highlightColor, this.highlightOpacity, bounds, this.pdfViewer.highlightSettings.author, this.pdfViewer.highlightSettings.subject, this.pdfViewer.highlightSettings.modifiedDate, '', rect, pageNumber);
                    this.renderHighlightAnnotation(annotation.bounds, annotation.opacity, annotation.color, context, factor);
                    break;
                case 'Strikethrough':
                    // tslint:disable-next-line:max-line-length
                    annotation = this.getAddedAnnotation(type, this.strikethroughColor, this.strikethroughOpacity, bounds, this.pdfViewer.strikethroughSettings.author, this.pdfViewer.strikethroughSettings.subject, this.pdfViewer.strikethroughSettings.modifiedDate, '', rect, pageNumber);
                    this.renderStrikeoutAnnotation(annotation.bounds, annotation.opacity, annotation.color, context, factor);
                    break;
                case 'Underline':
                    // tslint:disable-next-line:max-line-length
                    annotation = this.getAddedAnnotation(type, this.underlineColor, this.underlineOpacity, bounds, this.pdfViewer.underlineSettings.author, this.pdfViewer.underlineSettings.subject, this.pdfViewer.underlineSettings.modifiedDate, '', rect, pageNumber);
                    this.renderUnderlineAnnotation(annotation.bounds, annotation.opacity, annotation.color, context, factor);
                    break;
            }
            this.pdfViewerBase.isDocumentEdited = true;
            // tslint:disable-next-line
            var settings = { opacity: annotation.opacity, color: annotation.color, author: annotation.author, subject: annotation.subject, modifiedDate: annotation.modifiedDate };
            var index = this.pdfViewer.annotationModule.actionCollection[this.pdfViewer.annotationModule.actionCollection.length - 1].index;
            this.pdfViewer.fireAnnotationAdd(pageNumber, index, type, annotation.rect, settings);
        }
    };
    // tslint:disable-next-line
    TextMarkupAnnotation.prototype.renderHighlightAnnotation = function (bounds, opacity, color, context, factor) {
        for (var i = 0; i < bounds.length; i++) {
            // tslint:disable-next-line
            var bound = bounds[i];
            context.beginPath();
            var x = bound.X ? bound.X : bound.left;
            var y = bound.Y ? bound.Y : bound.top;
            var width = bound.Width ? bound.Width : bound.width;
            var height = bound.Height ? bound.Height : bound.height;
            // tslint:disable-next-line:max-line-length
            context.rect((x * factor), (y * factor), (width * factor), (height * factor));
            context.globalAlpha = opacity * 0.5;
            context.closePath();
            context.fillStyle = color;
            context.msFillRule = 'nonzero';
            context.fill();
        }
        context.save();
    };
    // tslint:disable-next-line
    TextMarkupAnnotation.prototype.renderStrikeoutAnnotation = function (bounds, opacity, color, context, factor) {
        for (var i = 0; i < bounds.length; i++) {
            // tslint:disable-next-line
            var bound = this.getProperBounds(bounds[i]);
            this.drawLine(opacity, bound.x, bound.y, bound.width, (bound.height / 2), color, factor, context);
        }
    };
    // tslint:disable-next-line
    TextMarkupAnnotation.prototype.renderUnderlineAnnotation = function (bounds, opacity, color, context, factor) {
        for (var i = 0; i < bounds.length; i++) {
            // tslint:disable-next-line
            var boundValues = this.getProperBounds(bounds[i]);
            this.drawLine(opacity, boundValues.x, boundValues.y, boundValues.width, boundValues.height, color, factor, context);
        }
    };
    // tslint:disable-next-line
    TextMarkupAnnotation.prototype.getProperBounds = function (bound) {
        var x = bound.X ? bound.X : bound.left;
        var y = bound.Y ? bound.Y : bound.top;
        var width = bound.Width ? bound.Width : bound.width;
        var height = bound.Height ? bound.Height : bound.height;
        return { x: x, y: y, width: width, height: height };
    };
    // tslint:disable-next-line:max-line-length
    TextMarkupAnnotation.prototype.drawLine = function (opacity, x, y, width, height, color, factor, context) {
        context.globalAlpha = opacity;
        context.beginPath();
        context.moveTo((x * factor), (y + height) * factor);
        context.lineTo((width + x) * factor, (y + height) * factor);
        context.lineWidth = 1;
        context.strokeStyle = color;
        context.closePath();
        context.msFillRule = 'nonzero';
        context.stroke();
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    TextMarkupAnnotation.prototype.printTextMarkupAnnotations = function (textMarkupAnnotations, pageIndex) {
        var canvas = createElement('canvas', { id: this.pdfViewer.element.id + '_print_annotation_layer_' + pageIndex });
        // tslint:disable-next-line
        var annotations = this.getAnnotations(pageIndex, null);
        if (annotations) {
            this.renderTextMarkupAnnotations(null, pageIndex, canvas, 1);
        }
        else {
            this.renderTextMarkupAnnotations(textMarkupAnnotations, pageIndex, canvas, 1);
        }
        var imageSource = canvas.toDataURL();
        return imageSource;
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.saveTextMarkupAnnotations = function () {
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        // tslint:disable-next-line
        var annotations = new Array();
        var colorpick = new ColorPicker();
        for (var j = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject) {
            var annotationCollection = JSON.parse(storeObject);
            for (var i = 0; i < annotationCollection.length; i++) {
                var newArray = [];
                var pageAnnotationObject = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (var z = 0; pageAnnotationObject.annotations.length > z; z++) {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(this.getBoundsForSave(pageAnnotationObject.annotations[z].bounds));
                        var colorString = colorpick.getValue(pageAnnotationObject.annotations[z].color, 'rgba');
                        pageAnnotationObject.annotations[z].color = JSON.stringify(this.getRgbCode(colorString));
                        pageAnnotationObject.annotations[z].rect = JSON.stringify(pageAnnotationObject.annotations[z].rect);
                    }
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
        }
        return JSON.stringify(annotations);
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.deleteTextMarkupAnnotation = function () {
        if (this.currentTextMarkupAnnotation) {
            var pageAnnotations = this.getAnnotations(this.selectTextMarkupCurrentPage, null);
            var deletedAnnotation = null;
            for (var i = 0; i < pageAnnotations.length; i++) {
                if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[i])) {
                    deletedAnnotation = pageAnnotations.splice(i, 1)[0];
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.addAction(this.selectTextMarkupCurrentPage, i, deletedAnnotation, 'Text Markup Deleted', null);
                    this.currentAnnotationIndex = i;
                }
            }
            this.manageAnnotations(pageAnnotations, this.selectTextMarkupCurrentPage);
            this.currentTextMarkupAnnotation = null;
            this.renderTextMarkupAnnotationsInPage(null, this.selectTextMarkupCurrentPage);
            this.pdfViewerBase.isDocumentEdited = true;
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.fireAnnotationRemove(this.selectTextMarkupCurrentPage, this.currentAnnotationIndex, deletedAnnotation.textMarkupAnnotationType);
            this.currentAnnotationIndex = null;
            this.selectTextMarkupCurrentPage = null;
            if (Browser.isDevice) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.toolbarModule.annotationToolbarModule.hideMobileAnnotationToolbar();
                this.pdfViewer.toolbarModule.showToolbar(true);
            }
        }
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.modifyColorProperty = function (color) {
        if (this.currentTextMarkupAnnotation) {
            var pageAnnotations = this.modifyAnnotationProperty('Color', color, null);
            this.manageAnnotations(pageAnnotations, this.selectTextMarkupCurrentPage);
            this.renderTextMarkupAnnotationsInPage(null, this.selectTextMarkupCurrentPage);
            this.pdfViewerBase.isDocumentEdited = true;
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.fireAnnotationPropertiesChange(this.selectTextMarkupCurrentPage, this.currentAnnotationIndex, this.currentTextMarkupAnnotation.textMarkupAnnotationType, true, false);
            this.currentAnnotationIndex = null;
        }
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.modifyOpacityProperty = function (args) {
        if (this.currentTextMarkupAnnotation) {
            var pageAnnotations = this.modifyAnnotationProperty('Opacity', args.value / 100, args.name);
            this.manageAnnotations(pageAnnotations, this.selectTextMarkupCurrentPage);
            this.renderTextMarkupAnnotationsInPage(null, this.selectTextMarkupCurrentPage);
            if (args.name === 'changed') {
                this.pdfViewerBase.isDocumentEdited = true;
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.fireAnnotationPropertiesChange(this.selectTextMarkupCurrentPage, this.currentAnnotationIndex, this.currentTextMarkupAnnotation.textMarkupAnnotationType, false, true);
                this.currentAnnotationIndex = null;
            }
        }
    };
    // tslint:disable-next-line
    TextMarkupAnnotation.prototype.modifyAnnotationProperty = function (property, value, status) {
        var pageAnnotations = this.getAnnotations(this.selectTextMarkupCurrentPage, null);
        for (var i = 0; i < pageAnnotations.length; i++) {
            if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[i])) {
                if (property === 'Color') {
                    pageAnnotations[i].color = value;
                }
                else if (property === 'Opacity') {
                    pageAnnotations[i].opacity = value;
                }
                var date = new Date();
                pageAnnotations[i].modifiedDate = date.toLocaleString();
                this.currentAnnotationIndex = i;
                if (status === null || status === 'changed') {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.addAction(this.selectTextMarkupCurrentPage, i, this.currentTextMarkupAnnotation, 'Text Markup Property modified', property);
                }
                this.currentTextMarkupAnnotation = pageAnnotations[i];
            }
        }
        return pageAnnotations;
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.undoTextMarkupAction = function (annotation, pageNumber, index, action) {
        var pageAnnotations = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            if (action === 'Text Markup Added') {
                pageAnnotations.splice(index, 1);
            }
            else if (action === 'Text Markup Deleted') {
                pageAnnotations.splice(index, 0, annotation);
            }
        }
        this.clearCurrentAnnotation();
        this.pdfViewerBase.isDocumentEdited = true;
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.renderTextMarkupAnnotationsInPage(null, pageNumber);
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    TextMarkupAnnotation.prototype.undoRedoPropertyChange = function (annotation, pageNumber, index, property) {
        var pageAnnotations = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            if (property === 'Color') {
                var tempColor = pageAnnotations[index].color;
                pageAnnotations[index].color = annotation.color;
                annotation.color = tempColor;
            }
            else {
                var tempOpacity = pageAnnotations[index].opacity;
                pageAnnotations[index].opacity = annotation.opacity;
                annotation.opacity = tempOpacity;
            }
        }
        this.clearCurrentAnnotation();
        this.pdfViewerBase.isDocumentEdited = true;
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.renderTextMarkupAnnotationsInPage(null, pageNumber);
        return annotation;
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.redoTextMarkupAction = function (annotation, pageNumber, index, action) {
        var pageAnnotations = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            if (action === 'Text Markup Added') {
                pageAnnotations.push(annotation);
            }
            else if (action === 'Text Markup Deleted') {
                pageAnnotations.splice(index, 1);
            }
        }
        this.clearCurrentAnnotation();
        this.pdfViewerBase.isDocumentEdited = true;
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.renderTextMarkupAnnotationsInPage(null, pageNumber);
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.saveNoteContent = function (pageNumber, note) {
        var pageAnnotations = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            for (var i = 0; i < pageAnnotations.length; i++) {
                if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[i])) {
                    pageAnnotations[i].note = note;
                }
            }
        }
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.pdfViewerBase.isDocumentEdited = true;
    };
    TextMarkupAnnotation.prototype.clearCurrentAnnotation = function () {
        this.selectTextMarkupCurrentPage = null;
        this.currentTextMarkupAnnotation = null;
        this.enableAnnotationPropertiesTool(false);
    };
    TextMarkupAnnotation.prototype.clearCurrentAnnotationSelection = function (pageNumber) {
        var lowerPageIndex = (pageNumber - 2) >= 0 ? (pageNumber - 2) : 0;
        // tslint:disable-next-line:max-line-length
        var higherPageIndex = (pageNumber + 2) < this.pdfViewerBase.pageCount ? (pageNumber + 2) : this.pdfViewerBase.pageCount - 1;
        for (var k = lowerPageIndex; k <= higherPageIndex; k++) {
            this.clearAnnotationSelection(k);
        }
    };
    // tslint:disable-next-line
    TextMarkupAnnotation.prototype.getBoundsForSave = function (bounds) {
        // tslint:disable-next-line
        var newArray = [];
        for (var i = 0; i < bounds.length; i++) {
            var left = bounds[i].left ? bounds[i].left : bounds[i].Left;
            var top_1 = bounds[i].top ? bounds[i].top : bounds[i].Top;
            var height = bounds[i].height ? bounds[i].height : bounds[i].Height;
            var width = bounds[i].width ? bounds[i].width : bounds[i].Width;
            newArray.push({ left: left, top: top_1, width: width, height: height });
        }
        return newArray;
    };
    // tslint:disable-next-line
    TextMarkupAnnotation.prototype.getRgbCode = function (colorString) {
        var stringArray = colorString.split(',');
        // tslint:disable-next-line:radix
        var r = parseInt(stringArray[0].split('(')[1]);
        // tslint:disable-next-line:radix
        var g = parseInt(stringArray[1]);
        // tslint:disable-next-line:radix
        var b = parseInt(stringArray[2]);
        return { r: r, g: g, b: b };
    };
    TextMarkupAnnotation.prototype.getDrawnBounds = function () {
        var pageBounds = [];
        var selection = window.getSelection();
        if (selection.anchorNode !== null) {
            var range = document.createRange();
            var isBackWardSelection = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            if (selection.anchorNode === selection.focusNode) {
                var pageId = this.pdfViewerBase.textLayer.getPageIndex(selection.anchorNode);
                if (!isNaN(pageId)) {
                    var pageRect = this.pdfViewerBase.getElement('_pageDiv_' + pageId).getBoundingClientRect();
                    if (isBackWardSelection) {
                        range.setStart(selection.focusNode, selection.focusOffset);
                        range.setEnd(selection.anchorNode, selection.anchorOffset);
                    }
                    else {
                        if (selection.anchorOffset < selection.focusOffset) {
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                            range.setEnd(selection.focusNode, selection.focusOffset);
                        }
                        else {
                            range.setStart(selection.focusNode, selection.focusOffset);
                            range.setEnd(selection.anchorNode, selection.anchorOffset);
                        }
                    }
                    var boundingRect = range.getBoundingClientRect();
                    // tslint:disable-next-line:max-line-length
                    var rectangle = { left: this.getDefaultValue(boundingRect.left - pageRect.left), top: this.getDefaultValue(boundingRect.top - pageRect.top), width: this.getDefaultValue(boundingRect.width), height: this.getDefaultValue(boundingRect.height), right: this.getDefaultValue(boundingRect.right - pageRect.left), bottom: this.getDefaultValue(boundingRect.bottom - pageRect.top) };
                    var rectangleArray = [];
                    rectangleArray.push(rectangle);
                    // tslint:disable-next-line
                    var rect = { left: rectangle.left, top: rectangle.top, right: rectangle.right, bottom: rectangle.bottom };
                    pageBounds.push({ pageIndex: pageId, bounds: rectangleArray, rect: rect });
                }
            }
            else {
                var startNode = void 0;
                var endNode = void 0;
                var selectionStartOffset = void 0;
                var selectionEndOffset = void 0;
                if (isBackWardSelection) {
                    startNode = selection.focusNode;
                    selectionStartOffset = selection.focusOffset;
                    endNode = selection.anchorNode;
                    selectionEndOffset = selection.anchorOffset;
                }
                else {
                    startNode = selection.anchorNode;
                    selectionStartOffset = selection.anchorOffset;
                    endNode = selection.focusNode;
                    selectionEndOffset = selection.focusOffset;
                }
                var anchorPageId = this.pdfViewerBase.textLayer.getPageIndex(startNode);
                var anchorTextId = this.pdfViewerBase.textLayer.getTextIndex(startNode, anchorPageId);
                var focusPageId = this.pdfViewerBase.textLayer.getPageIndex(endNode);
                var focusTextId = this.pdfViewerBase.textLayer.getTextIndex(endNode, focusPageId);
                var startOffset = 0;
                var endOffset = 0;
                var currentId = 0;
                for (var i = anchorPageId; i <= focusPageId; i++) {
                    var selectionRects = [];
                    var pageStartId = void 0;
                    var pageEndId = void 0;
                    var pageStartOffset = void 0;
                    var pageEndOffset = void 0;
                    var textDivs = this.pdfViewerBase.getElement('_textLayer_' + i).childNodes;
                    var pageRect = this.pdfViewerBase.getElement('_pageDiv_' + i).getBoundingClientRect();
                    if (i === anchorPageId) {
                        currentId = anchorTextId;
                    }
                    else {
                        currentId = 0;
                    }
                    for (var j = currentId; j < textDivs.length; j++) {
                        var textElement = textDivs[j];
                        if (j === currentId) {
                            pageStartId = currentId;
                            pageStartOffset = (i === anchorPageId) ? selectionStartOffset : 0;
                        }
                        else {
                            pageEndId = j;
                            pageEndOffset = (i === focusPageId) ? selectionEndOffset : textElement.textContent.length;
                        }
                        if (j === anchorTextId && i === anchorPageId) {
                            startOffset = selectionStartOffset;
                        }
                        else {
                            startOffset = 0;
                        }
                        if (j === focusTextId && i === focusPageId) {
                            endOffset = selectionEndOffset;
                        }
                        else {
                            endOffset = textElement.textContent.length;
                        }
                        for (var k = 0; k < textElement.childNodes.length; k++) {
                            var node = textElement.childNodes[k];
                            range.setStart(node, startOffset);
                            range.setEnd(node, endOffset);
                        }
                        var boundingRect = range.getBoundingClientRect();
                        // tslint:disable-next-line:max-line-length
                        var rectangle = { left: this.getDefaultValue(boundingRect.left - pageRect.left), top: this.getDefaultValue(boundingRect.top - pageRect.top), width: this.getDefaultValue(boundingRect.width), height: this.getDefaultValue(boundingRect.height), right: this.getDefaultValue(boundingRect.right - pageRect.left), bottom: this.getDefaultValue(boundingRect.bottom - pageRect.top) };
                        selectionRects.push(rectangle);
                        range.detach();
                        if (i === focusPageId && j === focusTextId) {
                            break;
                        }
                    }
                    var startElementNode = this.pdfViewerBase.getElement('_text_' + i + '_' + pageStartId).childNodes[0];
                    var endElementNode = this.pdfViewerBase.getElement('_text_' + i + '_' + pageEndId).childNodes[0];
                    var pageRange = document.createRange();
                    pageRange.setStart(startElementNode, pageStartOffset);
                    pageRange.setEnd(endElementNode, pageEndOffset);
                    var pageRectBounds = pageRange.getBoundingClientRect();
                    // tslint:disable-next-line:max-line-length
                    var pageRectangle = { left: this.getDefaultValue(pageRectBounds.left - pageRect.left), top: this.getDefaultValue(pageRectBounds.top - pageRect.top), width: this.getDefaultValue(pageRectBounds.width), height: this.getDefaultValue(pageRectBounds.height), right: this.getDefaultValue(pageRectBounds.right - pageRect.left), bottom: this.getDefaultValue(pageRectBounds.bottom - pageRect.top) };
                    // tslint:disable-next-line
                    var rect = { left: pageRectangle.left, top: pageRectangle.top, right: pageRectangle.right, bottom: pageRectangle.bottom };
                    pageBounds.push({ pageIndex: i, bounds: selectionRects, rect: rect });
                }
            }
        }
        selection.removeAllRanges();
        return pageBounds;
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.rerenderAnnotationsPinch = function (pageNumber) {
        var annotCanvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (annotCanvas) {
            var oldAnnotCanvas = this.pdfViewerBase.getElement('_old_annotationCanvas_' + pageNumber);
            if (oldAnnotCanvas) {
                if (annotCanvas) {
                    oldAnnotCanvas.id = annotCanvas.id;
                    annotCanvas.parentElement.removeChild(annotCanvas);
                }
                else {
                    oldAnnotCanvas.id = this.pdfViewer.element.id + '_annotationCanvas_' + pageNumber;
                }
                annotCanvas = oldAnnotCanvas;
            }
            annotCanvas.style.width = '';
            annotCanvas.style.height = '';
            annotCanvas.width = this.pdfViewerBase.pageSize[pageNumber].width * this.pdfViewerBase.getZoomFactor();
            annotCanvas.height = this.pdfViewerBase.pageSize[pageNumber].height * this.pdfViewerBase.getZoomFactor();
            this.renderTextMarkupAnnotations(null, pageNumber, annotCanvas, this.pdfViewerBase.getZoomFactor());
        }
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.rerenderAnnotations = function (pageNumber) {
        var oldCanvas = this.pdfViewerBase.getElement('_old_annotationCanvas_' + pageNumber);
        if (oldCanvas) {
            oldCanvas.parentElement.removeChild(oldCanvas);
        }
        var newCanvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (newCanvas) {
            newCanvas.style.display = 'block';
        }
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.resizeAnnotations = function (width, height, pageNumber) {
        var canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (canvas) {
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
        }
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.onTextMarkupAnnotationMouseUp = function (event) {
        var pageNumber = this.pdfViewer.annotationModule.getEventPageNumber(event);
        if (!isNullOrUndefined(pageNumber) && !isNaN(pageNumber)) {
            var canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
            var currentAnnot = this.getCurrentMarkupAnnotation(event.clientX, event.clientY, pageNumber, canvas);
            if (currentAnnot) {
                this.selectAnnotation(currentAnnot, canvas);
                this.currentTextMarkupAnnotation = currentAnnot;
                this.selectTextMarkupCurrentPage = pageNumber;
                this.enableAnnotationPropertiesTool(true);
                if (this.pdfViewer.toolbarModule) {
                    this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden = true;
                    this.pdfViewer.toolbarModule.annotationToolbarModule.showAnnotationToolbar(this.pdfViewer.toolbarModule.annotationItem);
                }
            }
            else {
                this.clearCurrentAnnotation();
            }
            this.clearCurrentAnnotationSelection(pageNumber);
        }
        else {
            if (!this.pdfViewerBase.isClickedOnScrollBar(event)) {
                this.clearCurrentAnnotation();
                this.clearCurrentAnnotationSelection(pageNumber);
            }
        }
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.onTextMarkupAnnotationTouchEnd = function (event) {
        var pageNumber = this.pdfViewer.annotationModule.getEventPageNumber(event);
        if (!isNullOrUndefined(pageNumber) && !isNaN(pageNumber)) {
            this.clearCurrentAnnotationSelection(pageNumber);
            var touchCanvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
            // tslint:disable-next-line:max-line-length
            var currentAnnot = this.getCurrentMarkupAnnotation(event.touches[0].clientX, event.touches[0].clientY, pageNumber, touchCanvas);
            if (currentAnnot) {
                this.selectAnnotation(currentAnnot, touchCanvas);
                this.currentTextMarkupAnnotation = currentAnnot;
                this.selectTextMarkupCurrentPage = pageNumber;
                this.enableAnnotationPropertiesTool(true);
            }
            else {
                this.clearCurrentAnnotation();
            }
            this.clearCurrentAnnotationSelection(pageNumber);
        }
        else if (this.selectTextMarkupCurrentPage != null && Browser.isDevice) {
            var number = this.selectTextMarkupCurrentPage;
            this.selectTextMarkupCurrentPage = null;
            this.clearAnnotationSelection(number);
        }
        else {
            this.clearCurrentAnnotation();
            this.clearCurrentAnnotationSelection(pageNumber);
        }
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.onTextMarkupAnnotationMouseMove = function (event) {
        var eventTarget = event.target;
        // tslint:disable-next-line
        var pageIndex = parseInt(eventTarget.id.split('_text_')[1]) || parseInt(eventTarget.id.split('_textLayer_')[1]) || parseInt(eventTarget.id.split('_annotationCanvas_')[1]);
        if (pageIndex) {
            var canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageIndex);
            var currentAnnot = this.getCurrentMarkupAnnotation(event.clientX, event.clientY, pageIndex, canvas);
            if (currentAnnot) {
                eventTarget.style.cursor = 'pointer';
                // this.showPopupNote(event, currentAnnot);
            }
            else {
                this.pdfViewer.annotationModule.hidePopupNote();
                if (this.pdfViewerBase.isPanMode && !this.pdfViewerBase.getAnnotationToolStatus()) {
                    eventTarget.style.cursor = 'grab';
                }
                else {
                    eventTarget.style.cursor = 'auto';
                }
            }
        }
    };
    // tslint:disable-next-line
    TextMarkupAnnotation.prototype.showPopupNote = function (event, annotation) {
        if (annotation.note) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotationModule.showPopupNote(event, annotation.color, annotation.author, annotation.note, annotation.textMarkupAnnotationType);
        }
    };
    TextMarkupAnnotation.prototype.getCurrentMarkupAnnotation = function (clientX, clientY, pageNumber, canvas) {
        var currentTextMarkupAnnotations = [];
        var canvasParentPosition = canvas.parentElement.getBoundingClientRect();
        var leftClickPosition = clientX - canvasParentPosition.left;
        var topClickPosition = clientY - canvasParentPosition.top;
        var annotationList = this.getAnnotations(pageNumber, null);
        var isAnnotationGot = false;
        if (annotationList) {
            for (var i = 0; i < annotationList.length; i++) {
                var annotation = annotationList[i];
                for (var j = 0; j < annotation.bounds.length; j++) {
                    // tslint:disable-next-line
                    var bound = annotation.bounds[j];
                    var left = bound.left ? bound.left : bound.Left;
                    var top_2 = bound.top ? bound.top : bound.Top;
                    var width = bound.width ? bound.width : bound.Width;
                    var height = bound.height ? bound.height : bound.Height;
                    // tslint:disable-next-line:max-line-length
                    if (leftClickPosition >= this.getMagnifiedValue(left, this.pdfViewerBase.getZoomFactor()) && leftClickPosition <= this.getMagnifiedValue(left + width, this.pdfViewerBase.getZoomFactor()) && topClickPosition >= this.getMagnifiedValue(top_2, this.pdfViewerBase.getZoomFactor()) && topClickPosition <= this.getMagnifiedValue(top_2 + height, this.pdfViewerBase.getZoomFactor())) {
                        currentTextMarkupAnnotations.push(annotation);
                        isAnnotationGot = true;
                    }
                    else {
                        if (isAnnotationGot) {
                            isAnnotationGot = false;
                            break;
                        }
                    }
                }
            }
        }
        var currentAnnot = null;
        if (currentTextMarkupAnnotations.length > 1) {
            currentAnnot = this.compareCurrentAnnotations(currentTextMarkupAnnotations);
        }
        else if (currentTextMarkupAnnotations.length === 1) {
            currentAnnot = currentTextMarkupAnnotations[0];
        }
        return currentAnnot;
    };
    TextMarkupAnnotation.prototype.compareCurrentAnnotations = function (annotations) {
        var previousX;
        var currentAnnotation = null;
        for (var i = 0; i < annotations.length; i++) {
            if (i === annotations.length - 1) {
                break;
            }
            // tslint:disable-next-line
            var firstAnnotBounds = annotations[i].bounds;
            var firstXposition = firstAnnotBounds[0].left ? firstAnnotBounds[0].left : firstAnnotBounds[0].Left;
            var firstYposition = firstAnnotBounds[0].top ? firstAnnotBounds[0].top : firstAnnotBounds[0].Top;
            // tslint:disable-next-line
            var secondAnnotBounds = annotations[i + 1].bounds;
            var secondXposition = secondAnnotBounds[0].left ? secondAnnotBounds[0].left : secondAnnotBounds[0].Left;
            var secondYposition = secondAnnotBounds[0].top ? secondAnnotBounds[0].top : secondAnnotBounds[0].Top;
            if ((firstXposition < secondXposition) || (firstYposition < secondYposition)) {
                previousX = secondXposition;
                currentAnnotation = annotations[i + 1];
            }
            else {
                previousX = firstXposition;
                currentAnnotation = annotations[i];
            }
            if (previousX && (i === (annotations.length - 2))) {
                if ((previousX === firstXposition) && (previousX === secondXposition)) {
                    previousX = secondXposition;
                    currentAnnotation = annotations[i + 1];
                }
            }
        }
        return currentAnnotation;
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.clearAnnotationSelection = function (pageNumber) {
        var canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (canvas) {
            var context = canvas.getContext('2d');
            context.setLineDash([]);
            this.renderTextMarkupAnnotationsInPage(null, pageNumber);
        }
    };
    TextMarkupAnnotation.prototype.selectAnnotation = function (annotation, canvas) {
        for (var i = 0; i < annotation.bounds.length; i++) {
            // tslint:disable-next-line
            var bound = annotation.bounds[i];
            var x = bound.left ? bound.left : bound.Left;
            var y = bound.top ? bound.top : bound.Top;
            var width = bound.width ? bound.width : bound.Width;
            var height = bound.height ? bound.height : bound.Height;
            // tslint:disable-next-line:max-line-length
            this.drawAnnotationSelectRect(canvas, this.getMagnifiedValue(x - 0.5, this.pdfViewerBase.getZoomFactor()), this.getMagnifiedValue(y - 0.5, this.pdfViewerBase.getZoomFactor()), this.getMagnifiedValue(width + 0.5, this.pdfViewerBase.getZoomFactor()), this.getMagnifiedValue(height + 0.5, this.pdfViewerBase.getZoomFactor()));
        }
    };
    TextMarkupAnnotation.prototype.drawAnnotationSelectRect = function (canvas, x, y, width, height) {
        var context = canvas.getContext('2d');
        context.beginPath();
        context.setLineDash([4 * this.pdfViewerBase.getZoomFactor()]);
        context.globalAlpha = 1;
        context.rect(x, y, width, height);
        context.closePath();
        context.strokeStyle = '#0000ff';
        context.stroke();
        context.save();
    };
    TextMarkupAnnotation.prototype.enableAnnotationPropertiesTool = function (isEnable) {
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
            this.pdfViewer.toolbarModule.annotationToolbarModule.createMobileAnnotationToolbar(isEnable);
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule.isMobileAnnotEnabled) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(isEnable);
                var enable = isEnable;
                if (this.isTextMarkupAnnotationMode) {
                    enable = true;
                }
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableAnnotationPropertiesTools(enable);
                if (this.currentTextMarkupAnnotation) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.toolbarModule.annotationToolbarModule.updateColorInIcon(this.pdfViewer.toolbarModule.annotationToolbarModule.colorDropDownElement, this.currentTextMarkupAnnotation.color);
                }
                else {
                    if (!this.isTextMarkupAnnotationMode) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.toolbarModule.annotationToolbarModule.updateColorInIcon(this.pdfViewer.toolbarModule.annotationToolbarModule.colorDropDownElement, '#000000');
                    }
                    else {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.setCurrentColorInPicker();
                    }
                }
            }
        }
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.maintainAnnotationSelection = function () {
        if (this.currentTextMarkupAnnotation) {
            var canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + this.selectTextMarkupCurrentPage);
            if (canvas) {
                this.selectAnnotation(this.currentTextMarkupAnnotation, canvas);
            }
        }
    };
    TextMarkupAnnotation.prototype.storeAnnotations = function (pageNumber, annotation) {
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        var index = 0;
        if (!storeObject) {
            var markupAnnotation = { pageIndex: pageNumber, annotations: [] };
            markupAnnotation.annotations.push(annotation);
            index = markupAnnotation.annotations.indexOf(annotation);
            var annotationCollection = [];
            annotationCollection.push(markupAnnotation);
            var annotationStringified = JSON.stringify(annotationCollection);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_textMarkup', annotationStringified);
        }
        else {
            var annotObject = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
            var pageIndex = this.getPageCollection(annotObject, pageNumber);
            if (annotObject[pageIndex]) {
                annotObject[pageIndex].annotations.push(annotation);
                index = annotObject[pageIndex].annotations.indexOf(annotation);
            }
            else {
                var markupAnnotation = { pageIndex: pageNumber, annotations: [] };
                markupAnnotation.annotations.push(annotation);
                index = markupAnnotation.annotations.indexOf(annotation);
                annotObject.push(markupAnnotation);
            }
            var annotationStringified = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_textMarkup', annotationStringified);
        }
        return index;
    };
    TextMarkupAnnotation.prototype.manageAnnotations = function (pageAnnotations, pageNumber) {
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        if (storeObject) {
            var annotObject = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
            var index = this.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            var annotationStringified = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_textMarkup', annotationStringified);
        }
    };
    // tslint:disable-next-line
    TextMarkupAnnotation.prototype.getAnnotations = function (pageIndex, textMarkupAnnotations) {
        // tslint:disable-next-line
        var annotationCollection;
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        if (storeObject) {
            var annotObject = JSON.parse(storeObject);
            var index = this.getPageCollection(annotObject, pageIndex);
            if (annotObject[index]) {
                annotationCollection = annotObject[index].annotations;
            }
            else {
                annotationCollection = textMarkupAnnotations;
            }
        }
        else {
            annotationCollection = textMarkupAnnotations;
        }
        return annotationCollection;
    };
    TextMarkupAnnotation.prototype.getPageCollection = function (pageAnnotations, pageNumber) {
        var index = null;
        for (var i = 0; i < pageAnnotations.length; i++) {
            if (pageAnnotations[i].pageIndex === pageNumber) {
                index = i;
                break;
            }
        }
        return index;
    };
    // tslint:disable-next-line
    TextMarkupAnnotation.prototype.getAddedAnnotation = function (type, color, opacity, bounds, author, subject, predefinedDate, note, rect, pageNumber) {
        var date = new Date();
        // tslint:disable-next-line:max-line-length
        var modifiedDate = predefinedDate ? predefinedDate : date.toLocaleString();
        // tslint:disable-next-line
        var annotation = { textMarkupAnnotationType: type, color: color, opacity: opacity, bounds: bounds, author: author, subject: subject, modifiedDate: modifiedDate, note: note, rect: rect };
        var storedIndex = this.storeAnnotations(pageNumber, annotation);
        this.pdfViewer.annotationModule.addAction(pageNumber, storedIndex, annotation, 'Text Markup Added', null);
        return annotation;
    };
    TextMarkupAnnotation.prototype.getPageContext = function (pageNumber) {
        var canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        var context = null;
        if (canvas) {
            context = canvas.getContext('2d');
        }
        return context;
    };
    TextMarkupAnnotation.prototype.getDefaultValue = function (value) {
        return value / this.pdfViewerBase.getZoomFactor();
    };
    TextMarkupAnnotation.prototype.getMagnifiedValue = function (value, factor) {
        return value * factor;
    };
    /**
     * @private
     */
    TextMarkupAnnotation.prototype.clear = function () {
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
    };
    return TextMarkupAnnotation;
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
        this.isTooltipCreated = false;
        /**
         * @private
         */
        this.isNavigationToolbarVisible = false;
        /**
         * @private
         */
        this.isBookmarkListOpen = false;
        /**
         * @private
         */
        this.isNavigationPaneResized = false;
        /**
         * @private
         */
        this.isBookmarkOpen = false;
        /**
         * @private
         */
        this.isThumbnailOpen = false;
        this.resizeIconMouseOver = function (event) {
            event.srcElement.style.cursor = 'default';
        };
        this.resizePanelMouseDown = function (event) {
            var proxy = _this;
            proxy.offset = [
                proxy.sideBarResizer.offsetLeft - event.clientX,
                proxy.sideBarResizer.offsetTop - event.clientY,
                proxy.sideBarResizer.offsetParent.clientWidth
            ];
            _this.previousX = event.clientX;
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
            if (!_this.pdfViewerBase.getPopupNoteVisibleStatus()) {
                event.preventDefault();
                if (proxy.isDown && _this.sideBarContentContainer) {
                    // prevent the sidebar from becoming too narrow, or from occupying more
                    // than half of the available viewer width.
                    if (_this.pdfViewer.enableRtl) {
                        var currentWidth = _this.previousX - event.clientX;
                        var width = currentWidth + proxy.offset[2];
                        var maxWidth = Math.floor(_this.outerContainerWidth / 2);
                        if (width > maxWidth) {
                            width = maxWidth;
                        }
                        if (width < _this.thumbnailWidthMin) {
                            width = _this.thumbnailWidthMin;
                        }
                        proxy.sideBarResizer.style.right = width + 'px';
                        proxy.sideBarContentContainer.style.width = width + 'px';
                        proxy.sideBarContent.style.width = width + 'px';
                        proxy.sideBarContentSplitter.style.width = width + 'px';
                        proxy.sideBarTitleContainer.style.width = width + 'px';
                        // tslint:disable-next-line:max-line-length
                        proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerLeft() + 'px';
                    }
                    else {
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
                    }
                    // tslint:disable-next-line:max-line-length
                    var viewerWidth = (proxy.pdfViewer.element.clientWidth - proxy.getViewerContainerLeft());
                    proxy.pdfViewerBase.viewerContainer.style.width = viewerWidth + 'px';
                    proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
                    proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.pdfViewerBase.currentPageNumber - 1);
                    proxy.pdfViewerBase.updateZoomValue();
                    if (!proxy.bookmarkButton.children[0].classList.contains('e-pv-bookmark-disable-icon')) {
                        proxy.pdfViewer.bookmarkViewModule.setBookmarkContentHeight();
                    }
                }
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
            _this.sideBarContent.setAttribute('aria-label', 'Thumbnail View Panel');
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
                    _this.sideBarContent.focus();
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
            _this.sideBarContent.setAttribute('aria-label', 'Bookmark View Panel');
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
                    _this.sideBarContent.focus();
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
        if (!Browser.isDevice) {
            this.createNavigationPane();
        }
    };
    NavigationPane.prototype.createNavigationPane = function () {
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
        }
        else {
            this.sideBarToolbarSplitter.classList.add('e-left');
        }
        // tslint:disable-next-line:max-line-length
        this.sideBarContentContainer = createElement('div', { id: this.pdfViewer.element.id + '_sideBarContentContainer', className: 'e-pv-sidebar-content-container' });
        if (this.pdfViewer.enableRtl) {
            this.sideBarContentContainer.classList.add('e-right');
        }
        else {
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
        }
        else {
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
        }
        else {
            this.sideBarResizer.classList.add('e-left');
        }
        this.sideBarContentContainer.appendChild(this.sideBarResizer);
        // tslint:disable-next-line:max-line-length
        var controlLeft = this.getViewerContainerLeft();
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
    };
    /**
     * @private
     */
    NavigationPane.prototype.adjustPane = function () {
        var splitterElement = this.pdfViewerBase.getElement('_sideBarToolbarSplitter');
        var toolbarContainer = this.pdfViewerBase.getElement('_toolbarContainer');
        var toolbarHeight = toolbarContainer.getBoundingClientRect().height;
        if (toolbarHeight === 0) {
            // tslint:disable-next-line
            toolbarHeight = parseFloat(window.getComputedStyle(toolbarContainer)['height']) + 1;
        }
        // tslint:disable-next-line:max-line-length
        this.sideBarToolbar.style.top = toolbarHeight + 'px';
        this.sideBarContentContainer.style.top = toolbarHeight + 'px';
        splitterElement.style.top = toolbarHeight + 'px';
    };
    /**
     * @private
     */
    NavigationPane.prototype.createNavigationPaneMobile = function (option) {
        var _this = this;
        this.isNavigationToolbarVisible = true;
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_navigationToolbar', className: 'e-pv-nav-toolbar' });
        this.pdfViewerBase.viewerMainContainer.insertBefore(this.toolbarElement, this.pdfViewerBase.viewerContainer);
        var items;
        if (option === 'search') {
            var searchTemplate = '<div class="e-input-group e-pv-search-input-mobile" id="' + this.pdfViewer.element.id +
                '_search_input_container"><input class="e-input" type="text" placeholder="' +
                this.pdfViewer.localeObj.getConstant('Find in document') + '" id="' +
                this.pdfViewer.element.id + '_search_input"></input></div>';
            items = [
                // tslint:disable-next-line:max-line-length
                { prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) },
                { template: searchTemplate },
                {
                    prefixIcon: 'e-pv-search-icon e-pv-icon', id: this.pdfViewer.element.id + '_search_box-icon',
                    click: function () {
                        var iconElement = _this.pdfViewerBase.getElement('_search_box-icon').firstElementChild;
                        if (iconElement.classList.contains('e-pv-search-close')) {
                            _this.enableSearchItems(false);
                        }
                        _this.pdfViewer.textSearchModule.searchButtonClick(iconElement, _this.searchInput);
                    }
                },
                {
                    prefixIcon: 'e-pv-prev-search-icon e-pv-icon', id: this.pdfViewer.element.id + '_prev_occurrence',
                    click: function (args) {
                        _this.pdfViewer.textSearchModule.searchPrevious();
                    }
                },
                {
                    prefixIcon: 'e-pv-next-search-icon e-pv-icon', id: this.pdfViewer.element.id + '_next_occurrence',
                    click: function (args) {
                        _this.pdfViewer.textSearchModule.searchNext();
                    }
                }
            ];
        }
        else {
            items = [
                // tslint:disable-next-line:max-line-length
                { prefixIcon: 'e-pv-backward-icon e-pv-icon', id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) },
                { text: this.pdfViewer.localeObj.getConstant('Bookmarks') }
            ];
        }
        this.toolbar = new Toolbar({ items: items, width: '', height: '', overflowMode: 'Popup' });
        if (this.pdfViewer.enableRtl) {
            this.toolbar.enableRtl = true;
        }
        this.toolbar.appendTo(this.toolbarElement);
        if (option === 'search') {
            this.initiateSearchBox();
        }
        else {
            this.initiateBookmarks();
        }
    };
    NavigationPane.prototype.initiateSearchBox = function () {
        var _this = this;
        this.searchInput = this.pdfViewerBase.getElement('_search_input');
        this.pdfViewer.textSearchModule.searchBtn = this.pdfViewerBase.getElement('_search_box-icon').firstElementChild;
        this.searchInput.addEventListener('keyup', function (event) {
            _this.enableSearchItems(true);
            var searchString = _this.searchInput.value;
            if (event.which === 13) {
                _this.initiateTextSearch();
            }
            else {
                _this.pdfViewer.textSearchModule.resetVariables();
            }
        });
        this.pdfViewer.textSearchModule.searchInput = this.searchInput;
        this.setSearchInputWidth();
        this.enableSearchItems(false);
        this.searchInput.focus();
    };
    NavigationPane.prototype.enableSearchItems = function (isEnable) {
        this.toolbar.enableItems(this.pdfViewerBase.getElement('_prev_occurrence').parentElement, isEnable);
        this.toolbar.enableItems(this.pdfViewerBase.getElement('_next_occurrence').parentElement, isEnable);
    };
    NavigationPane.prototype.initiateBookmarks = function () {
        if (Browser.isDevice) {
            this.pdfViewerBase.mobileScrollerContainer.style.display = 'none';
        }
        // tslint:disable-next-line:max-line-length
        var bookmarkContainer = createElement('div', { id: this.pdfViewer.element.id + '_bookmarks_container', className: 'e-pv-bookmark-container' });
        bookmarkContainer.style.width = '100%';
        bookmarkContainer.style.height = this.pdfViewerBase.viewerContainer.style.height;
        this.pdfViewerBase.getElement('_viewerMainContainer').appendChild(bookmarkContainer);
        this.pdfViewerBase.viewerContainer.style.display = 'none';
        this.isBookmarkListOpen = true;
        this.pdfViewer.bookmarkViewModule.renderBookmarkContentMobile();
    };
    NavigationPane.prototype.initiateTextSearch = function () {
        var inputString = this.searchInput.value;
        this.pdfViewer.textSearchModule.initiateSearch(inputString);
    };
    /**
     * @private
     */
    NavigationPane.prototype.goBackToToolbar = function () {
        this.isNavigationToolbarVisible = false;
        this.pdfViewer.textSearchModule.cancelTextSearch();
        this.searchInput = null;
        if (this.pdfViewer.bookmarkViewModule.childNavigateCount !== 0) {
            this.pdfViewer.bookmarkViewModule.bookmarkList.back();
            this.pdfViewer.bookmarkViewModule.childNavigateCount--;
        }
        else {
            if (this.toolbar != null) {
                this.toolbar.destroy();
                this.toolbar = null;
            }
            var bookmarkContainer = this.pdfViewerBase.getElement('_bookmarks_container');
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
    };
    NavigationPane.prototype.setSearchInputWidth = function () {
        var searchInputParent = this.searchInput.parentElement;
        var padding = window.getComputedStyle(searchInputParent.parentElement, null).getPropertyValue('padding-left');
        // tslint:disable-next-line:max-line-length
        var width = this.toolbarElement.clientWidth - this.getParentElementSearchBox('_backward').clientWidth
            - this.getParentElementSearchBox('_search_box-icon').clientWidth - this.getParentElementSearchBox('_prev_occurrence').clientWidth
            - this.getParentElementSearchBox('_next_occurrence').clientWidth - 6;
        if (padding !== '') {
            width = width - (parseFloat(padding) * 2);
        }
        searchInputParent.style.width = width + 'px';
    };
    NavigationPane.prototype.getParentElementSearchBox = function (idString) {
        return this.pdfViewerBase.getElement(idString).parentElement;
    };
    /**
     * @private
     */
    NavigationPane.prototype.createTooltipMobile = function (text) {
        if (!this.isTooltipCreated) { //boolean to prevent again toast creation.
            // tslint:disable-next-line:max-line-length
            var tooltipDiv = createElement('div', { className: 'e-pv-container-tooltip', id: this.pdfViewer.element.id + '_container_tooltip' });
            this.pdfViewer.element.appendChild(tooltipDiv);
            // tslint:disable-next-line:max-line-length
            this.toastObject = new Toast({ title: text, target: this.pdfViewer.element, close: this.onTooltipClose.bind(this), position: { X: 0, Y: 0 }, animation: { hide: { duration: 200, effect: 'FadeOut' } } });
            this.toastObject.appendTo(tooltipDiv);
            var y = this.pdfViewer.element.clientHeight * 0.65;
            var x = (this.pdfViewer.element.clientWidth - tooltipDiv.clientWidth) / 2;
            this.isTooltipCreated = true;
            this.toastObject.show({ position: { X: x, Y: y } });
            var tooltipChild = tooltipDiv.firstElementChild;
            if (tooltipChild) {
                tooltipChild.style.width = 'auto';
            }
        }
        else {
            if (this.toastObject) {
                this.toastObject.title = text;
                var tooltipElement = this.pdfViewerBase.getElement('_container_tooltip');
                var tooltipChild = tooltipElement.firstElementChild;
                if (tooltipChild) {
                    tooltipChild.style.width = 'auto';
                    tooltipChild.firstElementChild.firstElementChild.textContent = text;
                }
            }
        }
    };
    NavigationPane.prototype.onTooltipClose = function (args) {
        this.isTooltipCreated = false;
        var tooltipElement = this.pdfViewerBase.getElement('_container_tooltip');
        this.pdfViewer.textSearchModule.isMessagePopupOpened = false;
        this.toastObject.destroy();
        tooltipElement.parentElement.removeChild(tooltipElement);
        this.toastObject = null;
    };
    /**
     * @private
     */
    NavigationPane.prototype.toolbarResize = function () {
        if (this.searchInput) {
            this.searchInput.style.width = 'auto';
            this.setSearchInputWidth();
        }
    };
    NavigationPane.prototype.createSidebarToolBar = function () {
        // tslint:disable-next-line:max-line-length
        this.thumbnailButton = createElement('button', { id: this.pdfViewer.element.id + '_thumbnail-view', attrs: { 'disabled': 'disabled', 'aria-label': 'Page Thumbnails', 'tabindex': '-1' } });
        this.thumbnailButton.className = 'e-pv-tbar-btn e-pv-thumbnail-view-button e-btn';
        // tslint:disable-next-line:max-line-length
        var thumbnailButtonSpan = createElement('span', { id: this.pdfViewer.element.id + '_thumbnail-view' + '_icon', className: 'e-pv-thumbnail-view-disable-icon e-pv-icon' });
        this.thumbnailButton.appendChild(thumbnailButtonSpan);
        // tslint:disable-next-line:max-line-length
        var thumbnailTooltip = new Tooltip({ content: this.pdfViewer.localeObj.getConstant('Page Thumbnails'), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
        thumbnailTooltip.appendTo(this.thumbnailButton);
        // tslint:disable-next-line:max-line-length
        this.bookmarkButton = createElement('button', { id: this.pdfViewer.element.id + '_bookmark', attrs: { 'disabled': 'disabled', 'aria-label': 'Bookmarks', 'tabindex': '-1' } });
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
        if (this.pdfViewer.enableRtl) {
            this.closeDiv.style.left = 8 + 'px';
        }
        else {
            this.closeDiv.style.left = this.closeButtonLeft + 'px';
        }
        // tslint:disable-next-line:max-line-length
        var buttonSpan = createElement('span', { id: this.pdfViewer.element.id + '_close' + '_icon', className: 'e-pv-title-close-icon e-pv-icon' });
        this.closeDiv.appendChild(buttonSpan);
        this.sideBarTitleContainer.appendChild(this.closeDiv);
        this.closeDiv.addEventListener('click', this.sideToolbarOnClose);
    };
    NavigationPane.prototype.createResizeIcon = function () {
        // tslint:disable-next-line:max-line-length
        this.resizeIcon = createElement('div', { id: this.pdfViewer.element.id + '_resize', className: 'e-pv-resize-icon e-pv-icon' });
        this.setResizeIconTop();
        this.resizeIcon.style.position = 'absolute';
        this.resizeIcon.addEventListener('click', this.sideToolbarOnClose);
        this.resizeIcon.addEventListener('mouseover', this.resizeIconMouseOver);
        this.sideBarResizer.appendChild(this.resizeIcon);
    };
    /**
     * @private
     */
    NavigationPane.prototype.setResizeIconTop = function () {
        // tslint:disable-next-line:max-line-length
        if (this.sideBarToolbar && this.sideBarToolbar.clientHeight && this.resizeIcon.style.top === '') {
            this.resizeIcon.style.top = (this.sideBarToolbar.clientHeight) / 2 + 'px';
        }
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
            if (this.pdfViewer.enableRtl) {
                proxy.pdfViewerBase.viewerContainer.style.right = (proxy.sideToolbarWidth) + 'px';
            }
            else {
                proxy.pdfViewerBase.viewerContainer.style.left = (proxy.sideToolbarWidth) + 'px';
            }
            proxy.pdfViewerBase.viewerContainer.style.width = (proxy.pdfViewer.element.clientWidth - proxy.sideToolbarWidth) + 'px';
            proxy.pdfViewerBase.pageContainer.style.width = proxy.pdfViewerBase.viewerContainer.clientWidth + 'px';
            proxy.pdfViewerBase.updateZoomValue();
        }
    };
    NavigationPane.prototype.updateViewerContainerOnExpand = function () {
        var proxy = this;
        if (proxy.sideBarContentContainer) {
            proxy.sideBarContentContainer.style.display = 'block';
            if (this.pdfViewer.enableRtl) {
                // tslint:disable-next-line:max-line-length
                proxy.pdfViewerBase.viewerContainer.style.right = proxy.getViewerContainerLeft() + 'px';
            }
            else {
                // tslint:disable-next-line:max-line-length
                proxy.pdfViewerBase.viewerContainer.style.left = proxy.getViewerContainerLeft() + 'px';
            }
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
            if (this.pdfViewer.enableRtl) {
                this.pdfViewerBase.viewerContainer.style.left = 1 + 'px';
            }
            else {
                this.pdfViewerBase.viewerContainer.style.left = (this.sideToolbarWidth) + 'px';
            }
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
        this.isDocumentEdited = false;
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
        /**
         * @private
         */
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
        this.previousTime = 0;
        this.currentTime = 0;
        this.isTouchScrolled = false;
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
        /**
         * @private
         */
        this.isPanMode = false;
        this.dragX = 0;
        this.dragY = 0;
        this.isScrollbarMouseDown = false;
        this.scrollX = 0;
        this.scrollY = 0;
        this.ispageMoved = false;
        this.isThumb = false;
        this.isTapHidden = false;
        // tslint:disable-next-line
        this.singleTapTimer = null;
        this.tapCount = 0;
        /**
         * @private
         */
        this.onWindowResize = function () {
            var proxy = _this;
            if (_this.pdfViewer.enableRtl) {
                // tslint:disable-next-line:max-line-length
                proxy.viewerContainer.style.right = (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) + 'px';
            }
            else {
                // tslint:disable-next-line:max-line-length
                proxy.viewerContainer.style.left = (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) + 'px';
            }
            // tslint:disable-next-line:max-line-length
            var viewerWidth = (proxy.pdfViewer.element.clientWidth - (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0));
            proxy.viewerContainer.style.width = viewerWidth + 'px';
            if (proxy.pdfViewer.toolbarModule) {
                var toolbarHeight = proxy.getElement('_toolbarContainer').getBoundingClientRect().height;
                if (proxy.isAnnotationToolbarHidden() || Browser.isDevice) {
                    // tslint:disable-next-line:max-line-length
                    proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, toolbarHeight);
                }
                else {
                    var annotationToolbarHeight = proxy.getElement('_annotation_toolbar').getBoundingClientRect().height;
                    // tslint:disable-next-line:max-line-length
                    proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, toolbarHeight + annotationToolbarHeight);
                }
            }
            else {
                proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 0);
            }
            if (proxy.pdfViewer.bookmarkViewModule && Browser.isDevice) {
                var bookmarkContainer = proxy.getElement('_bookmarks_container');
                if (bookmarkContainer) {
                    bookmarkContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 0);
                }
            }
            proxy.pageContainer.style.width = proxy.viewerContainer.clientWidth + 'px';
            if (proxy.pdfViewer.toolbarModule) {
                // tslint:disable-next-line:max-line-length
                proxy.pdfViewer.toolbarModule.onToolbarResize((proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerMainContainerWidth() : proxy.pdfViewer.element.clientWidth));
            }
            if (_this.pdfViewer.enableToolbar && _this.pdfViewer.thumbnailViewModule) {
                proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.currentPageNumber - 1);
            }
            if (proxy.pdfViewer.textSearchModule && !Browser.isDevice) {
                proxy.pdfViewer.textSearchModule.textSearchBoxOnResize();
            }
            if (!proxy.navigationPane.isBookmarkListOpen) {
                proxy.updateZoomValue();
            }
            if (Browser.isDevice) {
                proxy.mobileScrollerContainer.style.left = (viewerWidth - parseFloat(proxy.mobileScrollerContainer.style.width)) + 'px';
                proxy.mobilePageNoContainer.style.left = (viewerWidth / 2) - (parseFloat(proxy.mobilePageNoContainer.style.width) / 2) + 'px';
                proxy.mobilePageNoContainer.style.top = (proxy.pdfViewer.element.clientHeight / 2) + 'px';
                proxy.updateMobileScrollerPosition();
            }
            else {
                proxy.navigationPane.setResizeIconTop();
            }
        };
        this.viewerContainerOnMousedown = function (event) {
            if (event.button === 0 && !_this.getPopupNoteVisibleStatus()) {
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
            if (!_this.getPopupNoteVisibleStatus()) {
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
                    if (_this.isTextMarkupAnnotationModule()) {
                        _this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationMouseUp(event);
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
            }
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
                    case 90: //z key
                        if (_this.pdfViewer.annotationModule) {
                            _this.pdfViewer.annotationModule.undo();
                        }
                        break;
                    case 89: //y key
                        if (_this.pdfViewer.annotationModule) {
                            _this.pdfViewer.annotationModule.redo();
                        }
                        break;
                    default:
                        break;
                }
            }
            else {
                switch (event.keyCode) {
                    case 46:
                        if (_this.isTextMarkupAnnotationModule() && !_this.getPopupNoteVisibleStatus()) {
                            _this.pdfViewer.annotationModule.deleteAnnotation();
                        }
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
                if (_this.pdfViewer.textSelectionModule && _this.pdfViewer.enableTextSelection && !_this.isTextSelectionDisabled && !_this.getPopupNoteVisibleStatus()) {
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
            if (_this.isTextMarkupAnnotationModule() && !_this.getPopupNoteVisibleStatus()) {
                _this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationMouseMove(event);
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
                if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled && !_this.getTextMarkupAnnotationMode()) {
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
                if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled && !_this.getCurrentTextMarkupAnnotation()) {
                    if (event.target.classList.contains('e-pv-text')) {
                        _this.isViewerContainerDoubleClick = true;
                        _this.pdfViewer.textSelectionModule.selectAWord(event.target, event.clientX, event.clientY, false);
                        if (!_this.getTextMarkupAnnotationMode()) {
                            _this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(true, false);
                            _this.dblClickTimer = setTimeout(function () { _this.applySelection(); }, 100);
                        }
                        else if (_this.isTextMarkupAnnotationModule() && _this.getTextMarkupAnnotationMode()) {
                            // tslint:disable-next-line:max-line-length
                            _this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(_this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
                        }
                    }
                }
                else if (_this.getCurrentTextMarkupAnnotation()) {
                    // this.pdfViewer.annotationModule.showAnnotationPopup(event);
                }
            }
            else {
                if (event.detail === 3) {
                    if (_this.isViewerContainerDoubleClick) {
                        clearTimeout(_this.dblClickTimer);
                        _this.isViewerContainerDoubleClick = false;
                    }
                    if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled && !_this.getTextMarkupAnnotationMode()) {
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
        // tslint:disable-next-line
        this.onWindowMouseUp = function (event) {
            if (!_this.getPopupNoteVisibleStatus()) {
                if (event.button === 0) {
                    if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled && !_this.getTextMarkupAnnotationMode()) {
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
                    else if (_this.getTextMarkupAnnotationMode()) {
                        // tslint:disable-next-line:max-line-length
                        _this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(_this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
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
            if (touchPoints.length === 1 && !(event.target.classList.contains('e-pv-hyperlink'))) {
                _this.preventTouchEvent(event);
            }
            if (event.touches.length === 1 && _this.isTextMarkupAnnotationModule() && !_this.getPopupNoteVisibleStatus()) {
                _this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationTouchEnd(event);
            }
            _this.touchClientX = touchPoints[0].clientX;
            _this.touchClientY = touchPoints[0].clientY;
            _this.scrollY = touchPoints[0].clientY;
            _this.previousTime = new Date().getTime();
            // tslint:disable-next-line:max-line-length
            if (touchPoints.length === 1 && !(event.target.classList.contains('e-pv-touch-select-drop') || event.target.classList.contains('e-pv-touch-ellipse'))) {
                if (Browser.isDevice && _this.pageCount > 0 && !_this.isThumb && !(event.target.classList.contains('e-pv-hyperlink'))) {
                    _this.handleTaps(touchPoints);
                }
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
                if (Browser.isDevice) {
                    clearTimeout(_this.singleTapTimer);
                    _this.tapCount = 0;
                }
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
            if (Browser.isDevice) {
                clearTimeout(_this.singleTapTimer);
                _this.tapCount = 0;
            }
            _this.preventTouchEvent(event);
            var touchPoints = event.touches;
            if (_this.pdfViewer.magnificationModule) {
                _this.isTouchScrolled = true;
                if (touchPoints.length > 1 && _this.pageCount > 0) {
                    if (Browser.isDevice) {
                        _this.isTouchScrolled = false;
                        _this.mobileScrollerContainer.style.display = 'none';
                    }
                    // tslint:disable-next-line:max-line-length
                    _this.pdfViewer.magnificationModule.initiatePinchMove(touchPoints[0].clientX, touchPoints[0].clientY, touchPoints[1].clientX, touchPoints[1].clientY);
                }
                else if (touchPoints.length === 1 && _this.getPagesPinchZoomed()) {
                    if (Browser.isDevice) {
                        _this.isTouchScrolled = false;
                        _this.mobileScrollerContainer.style.display = 'none';
                    }
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
            if (Browser.isDevice && _this.isTouchScrolled) {
                _this.currentTime = new Date().getTime();
                var duration = _this.currentTime - _this.previousTime;
                // tslint:disable-next-line
                var difference = _this.scrollY - event.changedTouches[0].pageY;
                // tslint:disable-next-line
                var speed = (difference) / (duration);
                if (Math.abs(speed) > 1.5) {
                    // tslint:disable-next-line
                    var scrollTop = (difference) + ((duration) * speed);
                    _this.viewerContainer.scrollTop += scrollTop;
                    _this.updateMobileScrollerPosition();
                }
            }
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
        // tslint:disable-next-line
        this.viewerContainerOnScroll = function (event) {
            var proxy = _this;
            var scrollposX = 0;
            var scrollposY = 0;
            if (event.touches && Browser.isDevice) {
                // tslint:disable-next-line
                var ratio = (_this.viewerContainer.scrollHeight - _this.viewerContainer.clientHeight) / (_this.viewerContainer.clientHeight - _this.toolbarHeight);
                if (_this.isThumb) {
                    _this.ispageMoved = true;
                    _this.mobilePageNoContainer.style.display = 'block';
                    scrollposX = event.touches[0].pageX - _this.scrollX;
                    scrollposY = event.touches[0].pageY - _this.viewerContainer.offsetTop;
                    _this.viewerContainer.scrollTop = scrollposY * ratio;
                    // tslint:disable-next-line
                    var containerValue = event.touches[0].pageY;
                    if (_this.viewerContainer.scrollTop !== 0 && ((containerValue) <= _this.viewerContainer.clientHeight)) {
                        _this.mobileScrollerContainer.style.top = containerValue + 'px';
                    }
                }
                else if (event.touches[0].target.className !== 'e-pv-touch-ellipse') {
                    _this.mobilePageNoContainer.style.display = 'none';
                    scrollposY = _this.touchClientY - event.touches[0].pageY;
                    scrollposX = _this.touchClientX - event.touches[0].pageX;
                    _this.viewerContainer.scrollTop = _this.viewerContainer.scrollTop + (scrollposY);
                    _this.viewerContainer.scrollLeft = _this.viewerContainer.scrollLeft + (scrollposX);
                    // tslint:disable-next-line
                    _this.updateMobileScrollerPosition();
                    _this.touchClientY = event.touches[0].pageY;
                    _this.touchClientX = event.touches[0].pageX;
                }
            }
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
            // tslint:disable-next-line:max-line-length
            if (_this.pdfViewer.magnificationModule && _this.pdfViewer.magnificationModule.fitType === 'fitToPage' && _this.currentPageNumber > 0) {
                _this.viewerContainer.scrollTop = _this.pageSize[_this.currentPageNumber - 1].top * _this.getZoomFactor();
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
                _this.viewerContainer.setAttribute('aria-labelledby', _this.pdfViewer.element.id + '_pageDiv_' + (_this.currentPageNumber - 1));
                if (!Browser.isDevice) {
                    _this.pdfViewer.toolbarModule.updateNavigationButtons();
                }
            }
            if (pageIndex !== _this.currentPageNumber) {
                if (proxy.pdfViewer.thumbnailViewModule && !Browser.isDevice) {
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
            if (Browser.isDevice) {
                this.pdfViewer.element.classList.add('e-pv-mobile-view');
            }
            var controlWidth = '100%';
            var toolbarDiv = void 0;
            // tslint:disable-next-line:max-line-length
            this.viewerMainContainer = createElement('div', { id: this.pdfViewer.element.id + '_viewerMainContainer', className: 'e-pv-viewer-main-container' });
            // tslint:disable-next-line:max-line-length
            this.viewerContainer = createElement('div', { id: this.pdfViewer.element.id + '_viewerContainer', className: 'e-pv-viewer-container', attrs: { 'aria-label': 'pdfviewer scroll view' } });
            if (Browser.isDevice) {
                this.createMobilePageNumberContainer();
            }
            this.viewerContainer.tabIndex = 0;
            if (this.pdfViewer.enableRtl) {
                this.viewerContainer.style.direction = 'rtl';
            }
            element.style.touchAction = 'pan-x pan-y';
            this.setMaximumHeight(element);
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
            var viewerWidth = this.pdfViewer.element.clientWidth;
            if (!Browser.isDevice) {
                viewerWidth = viewerWidth - (this.navigationPane.sideBarToolbar ? this.navigationPane.getViewerContainerLeft() : 0);
            }
            this.viewerContainer.style.width = viewerWidth + 'px';
            this.viewerMainContainer.appendChild(this.viewerContainer);
            if (Browser.isDevice) {
                this.mobileScrollerContainer.style.left = (viewerWidth - parseFloat(this.mobileScrollerContainer.style.width)) + 'px';
                this.mobilePageNoContainer.style.left = (viewerWidth / 2) - (parseFloat(this.mobilePageNoContainer.style.width) / 2) + 'px';
                this.mobilePageNoContainer.style.top = (this.pdfViewer.element.clientHeight / 2) + 'px';
                this.mobilePageNoContainer.style.display = 'none';
                this.mobilePageNoContainer.appendChild(this.mobilecurrentPageContainer);
                this.mobilePageNoContainer.appendChild(this.mobilenumberContainer);
                this.mobilePageNoContainer.appendChild(this.mobiletotalPageContainer);
                this.viewerContainer.appendChild(this.mobilePageNoContainer);
                this.viewerMainContainer.appendChild(this.mobileScrollerContainer);
                this.mobileScrollerContainer.appendChild(this.mobileSpanContainer);
            }
            // tslint:disable-next-line:max-line-length
            this.pageContainer = createElement('div', { id: this.pdfViewer.element.id + '_pageViewContainer', className: 'e-pv-page-container', attrs: { 'tabindex': '0', 'aria-label': 'pdfviewer Page View' } });
            if (this.pdfViewer.enableRtl) {
                this.pageContainer.style.direction = 'ltr';
            }
            this.viewerContainer.appendChild(this.pageContainer);
            this.pageContainer.style.width = this.viewerContainer.clientWidth + 'px';
            if (toolbarDiv && this.pdfViewer.thumbnailViewModule && !Browser.isDevice) {
                this.pdfViewer.thumbnailViewModule.createThumbnailContainer();
            }
            this.createPrintPopup();
            if (Browser.isDevice) {
                this.createGoToPagePopup();
            }
            this.waitingPopup = createElement('div', { id: this.pdfViewer.element.id + '_loadingIndicator' });
            this.viewerContainer.appendChild(this.waitingPopup);
            createSpinner({ target: this.waitingPopup, cssClass: 'e-spin-center' });
            this.setLoaderProperties(this.waitingPopup);
            this.contextMenuModule = new ContextMenu$1(this.pdfViewer, this);
            this.contextMenuModule.createContextMenu();
            this.wireEvents();
            if (this.pdfViewer.textSearchModule && !Browser.isDevice) {
                this.pdfViewer.textSearchModule.createTextSearchBox();
            }
            if (this.pdfViewer.documentPath) {
                this.pdfViewer.load(this.pdfViewer.documentPath, null);
            }
            if (this.pdfViewer.annotationModule) {
                this.pdfViewer.annotationModule.initializeCollection();
            }
        }
    };
    PdfViewerBase.prototype.createMobilePageNumberContainer = function () {
        // tslint:disable-next-line:max-line-length
        this.mobilePageNoContainer = createElement('div', { id: this.pdfViewer.element.id + '_mobilepagenoContainer', className: 'e-pv-mobilepagenoscroll-container' });
        // tslint:disable-next-line:max-line-length
        this.mobilecurrentPageContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobilecurrentpageContainer', className: 'e-pv-mobilecurrentpage-container' });
        // tslint:disable-next-line:max-line-length
        this.mobilenumberContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobiledashedlineContainer', className: 'e-pv-mobiledashedline-container' });
        // tslint:disable-next-line:max-line-length
        this.mobiletotalPageContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobiletotalpageContainer', className: 'e-pv-mobiletotalpage-container' });
        this.mobileScrollerContainer = createElement('div', { id: this.pdfViewer.element.id + '_mobilescrollContainer', className: 'e-pv-mobilescroll-container' });
        // tslint:disable-next-line:max-line-length
        this.mobileSpanContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobilespanContainer', className: 'e-pv-mobilespanscroll-container' });
        this.mobileSpanContainer.innerHTML = '1';
        this.mobilecurrentPageContainer.innerHTML = '1';
        this.mobilenumberContainer.innerHTML = '&#x2015;&#x2015;&#x2015;&#x2015;&#x2015;';
        this.mobileScrollerContainer.style.cssFloat = 'right';
        this.mobileScrollerContainer.style.width = '40px';
        this.mobileScrollerContainer.style.height = '32px';
        this.mobileScrollerContainer.style.zIndex = '100';
        this.mobilePageNoContainer.style.width = '120px';
        this.mobilePageNoContainer.style.height = '100px';
        this.mobilePageNoContainer.style.zIndex = '100';
        this.mobilePageNoContainer.style.position = 'fixed';
        this.mobileScrollerContainer.addEventListener('touchstart', this.mobileScrollContainerDown.bind(this));
        this.mobileScrollerContainer.addEventListener('touchend', this.mobileScrollContainerEnd.bind(this));
        this.mobileScrollerContainer.style.display = 'none';
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
    // tslint:disable-next-line
    PdfViewerBase.prototype.mobileScrollContainerDown = function (event) {
        this.ispageMoved = false;
        this.isThumb = true;
        if (this.isTextMarkupAnnotationModule()) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage != null && Browser.isDevice) {
                var pageNumber = this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearAnnotationSelection(pageNumber);
                this.pdfViewer.toolbar.showToolbar(true);
            }
        }
        this.mobileScrollerContainer.addEventListener('touchmove', this.viewerContainerOnScroll.bind(this), true);
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.setMaximumHeight = function (element) {
        if (!Browser.isDevice) {
            element.style.minHeight = '500px';
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.mobileScrollContainerEnd = function (event) {
        if (!this.ispageMoved) {
            this.goToPagePopup.show();
        }
        this.isThumb = false;
        this.ispageMoved = false;
        this.mobileScrollerContainer.removeEventListener('touchmove', this.viewerContainerOnScroll.bind(this), true);
        this.mobilePageNoContainer.style.display = 'none';
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
            if (Browser.isDevice) {
                this.mobileScrollerContainer.style.display = '';
                this.mobileScrollerContainer.style.top = (this.toolbarHeight) + 'px';
            }
        }
        else {
            this.pageCount = 0;
            this.currentPageNumber = 0;
            if (Browser.isDevice) {
                this.mobileScrollerContainer.style.display = 'none';
            }
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
        if (this.pdfViewer.thumbnailViewModule && !Browser.isDevice) {
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
            this.viewerContainer.setAttribute('aria-labelledby', this.pdfViewer.element.id + '_pageDiv_' + (this.currentPageNumber - 1));
        }
        if (Browser.isDevice) {
            this.mobileSpanContainer.innerHTML = this.currentPageNumber.toString();
            this.mobilecurrentPageContainer.innerHTML = this.currentPageNumber.toString();
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
            this.promptElement.focus();
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
        if (spinnerElement) {
            spinnerElement.style.height = '48px';
            spinnerElement.style.width = '48px';
            spinnerElement.style.transformOrigin = '24px 24px 24px';
        }
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
        if (!Browser.isDevice) {
            if (this.navigationPane.sideBarToolbar) {
                this.navigationPane.clear();
            }
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
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.clear();
        }
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.initializeCollection();
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
        if (Browser.isDevice) {
            this.pdfViewer.element.classList.remove('e-pv-mobile-view');
        }
        this.unWireEvents();
        this.clear(false);
        this.pageContainer.parentNode.removeChild(this.pageContainer);
        this.viewerContainer.parentNode.removeChild(this.viewerContainer);
        this.contextMenuModule.destroy();
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
        if (this.currentPageNumber > 0) {
            this.viewerContainer.setAttribute('aria-labelledby', this.pdfViewer.element.id + '_pageDiv_' + (this.currentPageNumber - 1));
        }
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
            header: '<div class="e-pv-corrupted-popup-header"> ' + this.pdfViewer.localeObj.getConstant('File Corrupted') + '</div>', visible: false,
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
        if (this.pdfViewer.enableRtl) {
            // tslint:disable-next-line:max-line-length
            this.corruptPopup.content = '<div id="templatertl" class="e-pv-notification-icon-rtl"> <div class="e-pv-corrupted-popup-content-rtl" tabindex="0">' + this.pdfViewer.localeObj.getConstant('File Corrupted Content') + '</div></div>';
            this.corruptPopup.enableRtl = true;
        }
        else {
            // tslint:disable-next-line:max-line-length
            this.corruptPopup.content = '<div id="template" class="e-pv-notification-icon"> <div class="e-pv-corrupted-popup-content" tabindex="0">' + this.pdfViewer.localeObj.getConstant('File Corrupted Content') + '</div></div>';
        }
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
        this.printMainContainer = createElement('div', {
            id: this.pdfViewer.element.id + '_printcontainer',
            className: 'e-pv-print-popup-container'
        });
        element.appendChild(this.printMainContainer);
        this.printMainContainer.style.display = 'none';
        this.printWaitingPopup = createElement('div', {
            id: this.pdfViewer.element.id + '_printLoadingIndicator',
            className: 'e-pv-print-loading-container'
        });
        this.printMainContainer.appendChild(this.printWaitingPopup);
        createSpinner({ target: this.printWaitingPopup, cssClass: 'e-spin-center' });
        this.setLoaderProperties(this.printWaitingPopup);
    };
    PdfViewerBase.prototype.createGoToPagePopup = function () {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        var popupElement = createElement('div', { id: this.pdfViewer.element.id + '_goTopage_popup', className: 'e-pv-gotopage-popup' });
        this.goToPageElement = createElement('span', { id: this.pdfViewer.element.id + '_prompt' });
        this.goToPageElement.textContent = this.pdfViewer.localeObj.getConstant('Enter pagenumber');
        popupElement.appendChild(this.goToPageElement);
        var inputContainer = createElement('span', { className: 'e-pv-text-input' });
        // tslint:disable-next-line:max-line-length
        this.goToPageInput = createElement('input', { id: this.pdfViewer.element.id + '_page_input', className: 'e-input' });
        this.goToPageInput.type = 'text';
        this.goToPageInput.style.maxWidth = '80%';
        this.pageNoContainer = createElement('span', { className: '.e-pv-number-ofpages' });
        inputContainer.appendChild(this.goToPageInput);
        inputContainer.appendChild(this.pageNoContainer);
        popupElement.appendChild(inputContainer);
        this.pageContainer.appendChild(popupElement);
        this.goToPagePopup = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true,
            header: this.pdfViewer.localeObj.getConstant('GoToPage'), visible: false, buttons: [
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') },
                    click: this.GoToPageCancelClick.bind(this),
                },
                // tslint:disable-next-line:max-line-length
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('Apply'), disabled: true, cssClass: 'e-pv-gotopage-apply-btn', isPrimary: true },
                    click: this.GoToPageApplyClick.bind(this),
                },
            ], close: this.closeGoToPagePopUp.bind(this),
        });
        if (this.pdfViewer.enableRtl) {
            this.goToPagePopup.enableRtl = true;
        }
        this.goToPagePopup.appendTo(popupElement);
        var goToPageTextBox = new NumericTextBox({ format: '##', showSpinButton: false });
        goToPageTextBox.appendTo(this.goToPageInput);
        this.goToPageInput.addEventListener('keyup', function () {
            // tslint:disable-next-line
            var inputValue = _this.goToPageInput.value;
            if (inputValue !== '' && parseFloat(inputValue) > 0 && (_this.pdfViewer.pageCount + 1) > parseFloat(inputValue)) {
                _this.EnableApplyButton();
            }
            else {
                _this.DisableApplyButton();
            }
        });
    };
    PdfViewerBase.prototype.closeGoToPagePopUp = function () {
        this.goToPageInput.value = '';
        this.DisableApplyButton();
    };
    PdfViewerBase.prototype.EnableApplyButton = function () {
        // tslint:disable-next-line
        var popupElements = document.getElementsByClassName('e-pv-gotopage-apply-btn')[0];
        popupElements.removeAttribute('disabled');
    };
    PdfViewerBase.prototype.DisableApplyButton = function () {
        // tslint:disable-next-line
        var popupElements = document.getElementsByClassName('e-pv-gotopage-apply-btn')[0];
        popupElements.setAttribute('disabled', true);
    };
    PdfViewerBase.prototype.GoToPageCancelClick = function () {
        this.goToPagePopup.hide();
    };
    PdfViewerBase.prototype.GoToPageApplyClick = function () {
        this.goToPagePopup.hide();
        // tslint:disable-next-line
        var pageNumber = this.goToPageInput.value;
        this.pdfViewer.navigation.goToPage(pageNumber);
        this.updateMobileScrollerPosition();
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.updateMobileScrollerPosition = function () {
        if (Browser.isDevice) {
            // tslint:disable-next-line
            var ratio = (this.viewerContainer.scrollHeight - this.viewerContainer.clientHeight) / (this.viewerContainer.clientHeight - 56);
            // tslint:disable-next-line
            var differenceRatio = (this.viewerContainer.scrollTop) / ratio;
            this.mobileScrollerContainer.style.top = (this.toolbarHeight + differenceRatio) + 'px';
        }
    };
    PdfViewerBase.prototype.createPasswordPopup = function () {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        var popupElement = createElement('div', { id: this.pdfViewer.element.id + '_password_popup', className: 'e-pv-password-popup', attrs: { 'tabindex': '-1' } });
        this.promptElement = createElement('span', { id: this.pdfViewer.element.id + '_prompt', attrs: { 'tabindex': '-1' } });
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
            header: this.pdfViewer.localeObj.getConstant('Password Protected'), visible: false,
            close: this.passwordCancel.bind(this), target: this.pdfViewer.element, beforeClose: function () {
                _this.passwordPopup.destroy();
                _this.getElement('_password_popup').remove();
                _this.passwordPopup = null;
                _this.waitingPopup = _this.getElement('_loadingIndicator');
                if (_this.waitingPopup != null) {
                    hideSpinner(_this.waitingPopup);
                }
            }
        });
        if (!Browser.isDevice) {
            this.passwordPopup.buttons = [
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true },
                    click: this.applyPassword.bind(this)
                },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.passwordCancelClick.bind(this) }
            ];
        }
        else {
            this.passwordPopup.buttons = [
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.passwordCancelClick.bind(this) },
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true },
                    click: this.applyPassword.bind(this)
                }
            ];
        }
        if (this.pdfViewer.enableRtl) {
            this.passwordPopup.enableRtl = true;
        }
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
        if (Browser.isDevice) {
            this.viewerContainer.addEventListener('touchmove', this.viewerContainerOnScroll, true);
        }
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
        if (Browser.isDevice) {
            this.viewerContainer.removeEventListener('touchmove', this.viewerContainerOnScroll, true);
        }
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
        this.enableAnnotationAddTools(false);
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
        if (!Browser.isDevice) {
            this.enableAnnotationAddTools(true);
        }
    };
    PdfViewerBase.prototype.enableAnnotationAddTools = function (isEnable) {
        if (this.pdfViewer.toolbarModule) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableAnnotationAddTools(isEnable);
            }
        }
    };
    PdfViewerBase.prototype.applySelection = function () {
        if (window.getSelection().anchorNode !== null) {
            this.pdfViewer.textSelectionModule.applySpanForSelection();
        }
        this.isViewerContainerDoubleClick = false;
    };
    PdfViewerBase.prototype.handleTaps = function (touchPoints) {
        var _this = this;
        this.singleTapTimer = setTimeout(function () { _this.onSingleTap(touchPoints); }, 300);
        this.tapCount++;
        // tslint:disable-next-line
        var timer = setTimeout(function () { _this.onDoubleTap(touchPoints); }, 200);
        if (this.tapCount > 2) {
            this.tapCount = 0;
        }
    };
    PdfViewerBase.prototype.onSingleTap = function (touches) {
        if (!this.isLongTouchPropagated && !this.navigationPane.isNavigationToolbarVisible) {
            if (this.pdfViewer.toolbarModule) {
                if ((this.touchClientX >= touches[0].clientX - 10) && (this.touchClientX <= touches[0].clientX + 10) &&
                    (this.touchClientY >= touches[0].clientY - 10) && (this.touchClientY <= touches[0].clientY + 10)) {
                    if (!this.isTapHidden) {
                        this.viewerContainer.scrollTop -= this.getElement('_toolbarContainer').clientHeight * this.getZoomFactor();
                        this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 0);
                        if (this.pdfViewer.toolbar.moreDropDown) {
                            var dropDown = this.getElement('_more_option-popup');
                            if (dropDown.firstElementChild) {
                                dropDown.classList.remove('e-popup-open');
                                dropDown.classList.add('e-popup-close');
                                dropDown.removeChild(dropDown.firstElementChild);
                            }
                        }
                    }
                    else {
                        this.viewerContainer.scrollTop += this.getElement('_toolbarContainer').clientHeight * this.getZoomFactor();
                        // tslint:disable-next-line:max-line-length
                        this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 56);
                    }
                    if (this.isTapHidden && Browser.isDevice) {
                        this.mobileScrollerContainer.style.display = '';
                        this.updateMobileScrollerPosition();
                    }
                    else if (Browser.isDevice && this.getSelectTextMarkupCurrentPage() == null) {
                        this.mobileScrollerContainer.style.display = 'none';
                    }
                    if (this.getSelectTextMarkupCurrentPage() == null) {
                        this.pdfViewer.toolbarModule.showToolbar(this.isTapHidden);
                        this.isTapHidden = !this.isTapHidden;
                    }
                }
                this.tapCount = 0;
            }
        }
    };
    PdfViewerBase.prototype.onDoubleTap = function (touches) {
        if (this.tapCount === 2) {
            if (Browser.isDevice) {
                this.mobileScrollerContainer.style.display = 'none';
            }
            this.tapCount = 0;
            if ((this.touchClientX >= touches[0].clientX - 10) && (this.touchClientX <= touches[0].clientX + 10) &&
                (this.touchClientY >= touches[0].clientY - 10) && (this.touchClientY <= touches[0].clientY + 10)) {
                if (this.pdfViewer.magnification) {
                    this.pdfViewer.magnification.onDoubleTapMagnification();
                }
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 0);
                this.isTapHidden = false;
                clearTimeout(this.singleTapTimer);
            }
        }
    };
    PdfViewerBase.prototype.preventTouchEvent = function (event) {
        if (this.pdfViewer.textSelectionModule) {
            // tslint:disable-next-line:max-line-length
            if (!this.isPanMode && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled && this.getSelectTextMarkupCurrentPage() == null) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.initPageDiv = function (pageValues) {
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateTotalPage();
            if (Browser.isDevice && this.mobiletotalPageContainer) {
                this.mobiletotalPageContainer.innerHTML = this.pageCount.toString();
                this.pageNoContainer.innerHTML = '(1-' + this.pageCount.toString() + ')';
            }
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
                if (this.pdfViewer.enableRtl) {
                    pageDiv.style.right = this.updateLeftPosition(pageIndex) + 'px';
                }
                else {
                    pageDiv.style.left = this.updateLeftPosition(pageIndex) + 'px';
                }
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
                                canvas_1.height = pageHeight_1 * window.devicePixelRatio;
                                canvas_1.width = pageWidth_1 * window.devicePixelRatio;
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
                this.renderTextContent(data, pageIndex);
                if (this.pdfViewer.enableHyperlink && this.pdfViewer.linkAnnotationModule) {
                    this.pdfViewer.linkAnnotationModule.renderHyperlinkContent(data, pageIndex);
                }
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                    this.pdfViewer.textSelectionModule.applySelectionRangeOnScroll(pageIndex);
                }
                if (this.isTextMarkupAnnotationModule()) {
                    // tslint:disable-next-line
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.renderTextMarkupAnnotationsInPage(data['textMarkupAnnotation'], pageIndex);
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
        // tslint:disable-next-line
        var rotation = data['rotation'];
        var textLayer = this.getElement('_textLayer_' + pageIndex);
        if (!textLayer) {
            // tslint:disable-next-line:max-line-length
            textLayer = this.textLayer.addTextLayer(pageIndex, this.getPageWidth(pageIndex), this.getPageHeight(pageIndex), this.getElement('_pageDiv_' + pageIndex));
        }
        if (textLayer) {
            if (textLayer.childNodes.length === 0) {
                this.textLayer.renderTextContents(pageIndex, texts, bounds, rotation);
            }
            else {
                this.textLayer.resizeTextContents(pageIndex, texts, bounds, rotation);
            }
        }
    };
    PdfViewerBase.prototype.renderPageContainer = function (pageNumber, pageWidth, pageHeight, topValue) {
        // tslint:disable-next-line:max-line-length
        var pageDiv = createElement('div', { id: this.pdfViewer.element.id + '_pageDiv_' + pageNumber, className: 'e-pv-page-div', attrs: { 'tabindex': '0' } });
        pageDiv.style.width = pageWidth + 'px';
        pageDiv.style.height = pageHeight + 'px';
        if (this.pdfViewer.enableRtl) {
            pageDiv.style.right = this.updateLeftPosition(pageNumber) + 'px';
        }
        else {
            pageDiv.style.left = this.updateLeftPosition(pageNumber) + 'px';
        }
        pageDiv.style.top = topValue + 'px';
        this.pageContainer.appendChild(pageDiv);
        this.pageContainer.style.width = this.viewerContainer.clientWidth + 'px';
        this.createWaitingPopup(pageNumber);
        this.orderPageDivElements(pageDiv, pageNumber);
        this.renderPageCanvas(pageDiv, pageWidth, pageHeight, pageNumber, 'block');
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
    // tslint:disable-next-line:max-line-length
    PdfViewerBase.prototype.renderPageCanvas = function (pageDiv, pageWidth, pageHeight, pageNumber, displayMode) {
        var pageCanvas = createElement('canvas', { id: this.pdfViewer.element.id + '_pageCanvas_' + pageNumber, className: 'e-pv-page-canvas' });
        pageCanvas.width = pageWidth;
        pageCanvas.height = pageHeight;
        pageCanvas.style.display = displayMode;
        pageDiv.appendChild(pageCanvas);
        this.textLayer.addTextLayer(pageNumber, pageWidth, pageHeight, pageDiv);
        if (this.isTextMarkupAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.createAnnotationLayer(pageDiv, pageWidth, pageHeight, pageNumber, displayMode);
        }
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
                if (!this.pdfViewer.enableRtl) {
                    pageDiv.style.left = leftPosition + 'px';
                }
                else {
                    pageDiv.style.right = leftPosition + 'px';
                }
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
        blobUrl = URL.createObjectURL(blobUrl);
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
        if (this.isTextMarkupAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            var textMarkupAnnotationCollection = this.pdfViewer.annotationModule.textMarkupAnnotationModule.saveTextMarkupAnnotations();
            jsonObject = { hashId: this.hashId, textMarkupAnnotations: textMarkupAnnotationCollection };
        }
        else {
            jsonObject = { hashId: this.hashId };
        }
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
                    if (Browser.isIE || Browser.info.name === 'edge') {
                        window.navigator.msSaveOrOpenBlob(blobUrl, _this.pdfViewer.fileName);
                    }
                    else {
                        _this.downloadDocument(blobUrl);
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
        var blobObj = this.createBlobUrl(data['image'].split('base64,')[1], 'image/png');
        var blobUrl = URL.createObjectURL(blobObj);
        // tslint:disable-next-line
        var storeObject = {
            // tslint:disable-next-line
            image: blobUrl, transformationMatrix: data['transformationMatrix'], hyperlinks: data['hyperlinks'], hyperlinkBounds: data['hyperlinkBounds'], linkAnnotation: data['linkAnnotation'], linkPage: data['linkPage'], annotationLocation: data['annotationLocation'],
            // tslint:disable-next-line
            textContent: data['textContent'], textBounds: data['textBounds'], pageText: data['pageText'], rotation: data['rotation']
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
        // tslint:disable-next-line
        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
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
    /**
     * @private
     */
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
    PdfViewerBase.prototype.isAnnotationToolbarHidden = function () {
        if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
            return this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden;
        }
        else {
            return true;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getTextMarkupAnnotationMode = function () {
        if (this.isTextMarkupAnnotationModule()) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode;
        }
        else {
            return false;
        }
    };
    PdfViewerBase.prototype.getCurrentTextMarkupAnnotation = function () {
        if (this.isTextMarkupAnnotationModule()) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getSelectTextMarkupCurrentPage = function () {
        if (this.isTextMarkupAnnotationModule()) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
        }
        else {
            return null;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getAnnotationToolStatus = function () {
        if (this.pdfViewer.toolbarModule) {
            return this.pdfViewer.toolbarModule.annotationToolbarModule.isAnnotationButtonsEnabled();
        }
        else {
            return false;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getPopupNoteVisibleStatus = function () {
        if (this.pdfViewer.annotationModule) {
            return this.pdfViewer.annotationModule.isPopupNoteVisible;
        }
        else {
            return false;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.isTextMarkupAnnotationModule = function () {
        if (this.pdfViewer.annotationModule) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule;
        }
        else {
            return null;
        }
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
        var textLayer;
        if (!textDiv) {
            textLayer = createElement('div', { id: this.pdfViewer.element.id + '_textLayer_' + pageNumber, className: 'e-pv-text-layer' });
            textLayer.style.width = pageWidth + 'px';
            textLayer.style.height = pageHeight + 'px';
            pageDiv.appendChild(textLayer);
        }
        return textLayer;
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    TextLayer.prototype.renderTextContents = function (pageNumber, textContents, textBounds, rotation) {
        var textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        var canvasElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageNumber);
        if (canvasElement && textLayer.childNodes.length === 0) {
            for (var i = 0; i < textContents.length; i++) {
                // tslint:disable-next-line
                var bounds = textBounds[i];
                // tslint:disable-next-line:max-line-length
                var textDiv = createElement('div', { id: this.pdfViewer.element.id + '_text_' + pageNumber + '_' + i, className: 'e-pv-text', attrs: { 'tabindex': '0' } });
                var textContent = textContents[i];
                textContent = textContent.replace(/</g, '&lt;');
                textContent = textContent.replace(/>/g, '&gt;');
                textDiv.innerHTML = textContent.replace(/&nbsp;/g, ' ');
                // tslint:disable-next-line
                var newLine = textContents[i].replace(/  +/g, ' ');
                if (newLine !== ' ') {
                    textDiv.style.whiteSpace = 'pre';
                }
                this.setStyleToTextDiv(textDiv, bounds.X, bounds.Y, bounds.Bottom, bounds.Width, bounds.Height);
                this.setTextElementProperties(textDiv);
                var context = canvasElement.getContext('2d');
                context.font = textDiv.style.fontSize + ' ' + textDiv.style.fontFamily;
                var contextWidth = context.measureText(textContents[i].replace(/(\r\n|\n|\r)/gm, '')).width;
                var scale = bounds.Width * this.pdfViewerBase.getZoomFactor() / contextWidth;
                this.applyTextRotation(scale, textDiv, rotation, bounds.Rotation);
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
    TextLayer.prototype.resizeTextContents = function (pageNumber, textContents, textBounds, rotation) {
        var textLayer = this.pdfViewerBase.getElement('_textLayer_' + pageNumber);
        var canvasElement = this.pdfViewerBase.getElement('_pageCanvas_' + pageNumber);
        if (canvasElement) {
            for (var i = 0; i < textLayer.childNodes.length; i++) {
                // tslint:disable-next-line
                var bounds = void 0;
                var textDiv = this.pdfViewerBase.getElement('_text_' + pageNumber + '_' + i);
                if (textBounds) {
                    bounds = textBounds[i];
                    this.setStyleToTextDiv(textDiv, bounds.X, bounds.Y, bounds.Bottom, bounds.Width, bounds.Height);
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
                this.applyTextRotation(scale, textDiv, rotation, bounds.Rotation);
                this.resizeExcessDiv(textLayer, textDiv);
            }
        }
        else {
            textLayer.parentElement.removeChild(textLayer);
        }
    };
    TextLayer.prototype.applyTextRotation = function (scale, textDiv, rotation, textRotation) {
        var scaleString = 'scale(' + scale + ')';
        if (rotation === 0) {
            if (textRotation === 0) {
                textDiv.style.transform = scaleString;
            }
            else {
                textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
            }
        }
        else if (rotation === 1) {
            if (textRotation === 0) {
                textDiv.style.transform = 'rotate(90deg) ' + scaleString;
            }
            else if (textRotation === -90) {
                textDiv.style.transform = scaleString;
            }
            else {
                textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
            }
        }
        else if (rotation === 2) {
            if (textRotation === 0) {
                textDiv.style.transform = 'rotate(180deg) ' + scaleString;
            }
            else if (textRotation === 180) {
                textDiv.style.transform = scaleString;
            }
            else {
                textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
            }
        }
        else if (rotation === 3) {
            if (textRotation === 0) {
                textDiv.style.transform = 'rotate(-90deg) ' + scaleString;
            }
            else if (textRotation === 90) {
                textDiv.style.transform = scaleString;
            }
            else {
                textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
            }
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
        // tslint:disable-next-line
        var rotation;
        if (renderObject) {
            // tslint:disable-next-line
            var data = JSON.parse(renderObject);
            // tslint:disable-next-line
            textBounds = data['textBounds'];
            // tslint:disable-next-line
            textContents = data['textContent'];
            // tslint:disable-next-line
            rotation = data['rotation'];
        }
        if (textBounds.length !== 0) {
            this.textBoundsArray.push({ pageNumber: pageNumber, textBounds: textBounds });
            this.resizeTextContents(pageNumber, textContents, textBounds, rotation);
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
                    this.resizeTextContents(pageNumber, null, textBounds, rotation);
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
    TextLayer.prototype.setStyleToTextDiv = function (textDiv, left, top, bottom, width, height) {
        textDiv.style.left = left * this.pdfViewerBase.getZoomFactor() + 'px';
        textDiv.style.top = top * this.pdfViewerBase.getZoomFactor() + 'px';
        var textHeight = height * this.pdfViewerBase.getZoomFactor();
        textDiv.style.height = textHeight + 'px';
        textDiv.style.fontSize = height * this.pdfViewerBase.getZoomFactor() + 'px';
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
    /**
     * @private
     */
    TextLayer.prototype.isBackWardSelection = function (selection) {
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
    TextLayer.prototype.getPageIndex = function (element) {
        var pageId;
        // tslint:disable-next-line
        var parentElement = element.parentElement;
        if (!parentElement) {
            parentElement = element.parentNode;
        }
        if (parentElement.className === 'e-pv-text-layer') {
            // tslint:disable-next-line:radix
            pageId = parseInt(element.id.split('_text_')[1]);
        }
        else {
            // tslint:disable-next-line:radix
            pageId = parseInt(parentElement.id.split('_text_')[1]);
        }
        return pageId;
    };
    /**
     * @private
     */
    TextLayer.prototype.getTextIndex = function (element, pageIndex) {
        var textIndex;
        // tslint:disable-next-line
        var parentElement = element.parentElement;
        if (!parentElement) {
            parentElement = element.parentNode;
        }
        if (parentElement.className === 'e-pv-text-layer') {
            // tslint:disable-next-line:radix
            textIndex = parseInt(element.id.split('_text_' + pageIndex + '_')[1]);
        }
        else {
            // tslint:disable-next-line:radix
            textIndex = parseInt(parentElement.id.split('_text_' + pageIndex + '_')[1]);
        }
        return textIndex;
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
            content: '<div class="e-pv-notification-popup-content" tabindex = "0">' + text + '</div>', target: this.pdfViewer.element,
            beforeClose: function () {
                _this.notifyDialog.destroy();
                _this.pdfViewer.element.removeChild(popupElement);
                if (_this.pdfViewer.textSearchModule) {
                    _this.pdfViewer.textSearch.isMessagePopupOpened = false;
                }
            }
        });
        if (this.pdfViewer.enableRtl) {
            this.notifyDialog.enableRtl = true;
        }
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
        this.copyContextMenu = [{ text: this.pdfViewer.localeObj.getConstant('Copy'), iconCss: 'e-pv-copy-icon' },
            { text: this.pdfViewer.localeObj.getConstant('Highlight context'), iconCss: 'e-pv-highlight-icon' },
            { text: this.pdfViewer.localeObj.getConstant('Underline context'), iconCss: 'e-pv-underline-icon' },
            { text: this.pdfViewer.localeObj.getConstant('Strikethrough context'), iconCss: 'e-pv-strikethrough-icon' }];
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
            created: this.contextMenuOnCreated.bind(this)
        });
        if (this.pdfViewer.enableRtl) {
            this.contextMenuObj.enableRtl = true;
        }
        this.contextMenuObj.appendTo(this.contextMenuElement);
        if (Browser.isDevice) {
            this.contextMenuObj.animationSettings.effect = 'ZoomIn';
        }
        else {
            this.contextMenuObj.animationSettings.effect = 'SlideDown';
        }
    };
    ContextMenu$$1.prototype.contextMenuOnCreated = function (args) {
        // tslint:disable-next-line:max-line-length
        var items = [this.pdfViewer.localeObj.getConstant('Highlight context'), this.pdfViewer.localeObj.getConstant('Underline context'),
            this.pdfViewer.localeObj.getConstant('Strikethrough context')];
        if (this.pdfViewer.annotationModule) {
            if (!this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
                this.contextMenuObj.enableItems(items, false);
            }
        }
        else {
            this.contextMenuObj.enableItems(items, false);
        }
    };
    ContextMenu$$1.prototype.contextMenuOnBeforeOpen = function (args) {
        if (this.pdfViewer.textSelectionModule) {
            if (args.event) {
                var isClickWithinSelectionBounds = this.isClickWithinSelectionBounds(args.event);
                // tslint:disable-next-line:max-line-length
                if (isClickWithinSelectionBounds) {
                    // tslint:disable-next-line:max-line-length
                    if ((!args.event.target.classList.contains('e-pv-maintaincontent') && args.event.target.classList.contains('e-pv-text') || args.event.target.classList.contains('e-pv-text-layer'))) {
                        args.cancel = true;
                        // tslint:disable-next-line:max-line-length
                    }
                    else if ((Browser.isIE || Browser.info.name === 'edge') && args.event.target.classList.contains('e-pv-page-container')) {
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
            var currentBound = bounds;
            if (this.getHorizontalValue(currentBound.left) < event.clientX && this.getHorizontalValue(currentBound.right) >
                event.clientX && this.getVerticalValue(currentBound.top) < event.clientY &&
                this.getVerticalValue(currentBound.bottom) > event.clientY) {
                isWithin = true;
            }
        }
        if ((Browser.isIE || Browser.info.name === 'edge') && bounds) {
            isWithin = true;
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
            case this.pdfViewer.localeObj.getConstant('Copy'):
                if (this.pdfViewer.textSelectionModule) {
                    this.pdfViewer.textSelectionModule.copyText();
                    this.contextMenuObj.close();
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Highlight context'):
                if (this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations('Highlight');
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Underline context'):
                if (this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations('Underline');
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Strikethrough context'):
                if (this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations('Strikethrough');
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                }
                break;
            default:
                break;
        }
    };
    /**
     * @private
     */
    ContextMenu$$1.prototype.destroy = function () {
        this.contextMenuObj.destroy();
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
        this.isTapToFitZoom = false;
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
     * @param  {number} zoomValue - Specifies the Zoom Value for magnify the PDF document
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
     * @param  {number} zoomValue - Defines the Zoom Value for fit the page in the Container
     * @returns void
     */
    Magnification.prototype.fitToPage = function () {
        var zoomValue = this.calculateFitZoomFactor('fitToPage');
        this.isAutoZoom = false;
        this.onZoomChanged(zoomValue);
        if (Browser.isDevice) {
            this.pdfViewerBase.viewerContainer.style.overflowY = 'hidden';
        }
        else {
            this.pdfViewerBase.viewerContainer.style.overflowY = 'auto';
        }
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
            // tslint:disable-next-line:radix
            return parseInt((scaleX * 100).toString());
        }
        else {
            var pageHeight = 0;
            for (var i = 0; i < this.pdfViewerBase.pageSize.length; i++) {
                pageHeight = this.pdfViewerBase.pageSize[i].height;
                if (pageHeight > highestHeight) {
                    highestHeight = pageHeight;
                }
            }
            // tslint:disable-next-line:radix
            return parseInt(((viewerHeight / highestHeight) * 100).toString());
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
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.closePopupMenu();
        }
        this.previousZoomFactor = this.zoomFactor;
        this.zoomLevel = this.getZoomLevel(zoomValue);
        this.zoomFactor = this.getZoomFactor(zoomValue);
        if (Browser.isDevice) {
            this.pdfViewerBase.viewerContainer.style.overflowY = 'hidden';
        }
        else {
            this.pdfViewerBase.viewerContainer.style.overflowY = 'auto';
        }
        if (this.pdfViewerBase.pageCount > 0) {
            if (this.previousZoomFactor !== this.zoomFactor) {
                if (!this.isPinchZoomed) {
                    this.magnifyPages();
                }
                else {
                    if (Browser.isDevice) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewerBase.mobilePageNoContainer.style.left = (this.pdfViewer.element.clientWidth / 2) - (parseFloat(this.pdfViewerBase.mobilePageNoContainer.style.width) / 2) + 'px';
                    }
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
        if (Browser.isDevice && this.isPinchZoomed) {
            // tslint:disable-next-line:radix
            var zoomPercentage = parseInt((this.zoomFactor * 100).toString()) + '%';
            this.pdfViewerBase.navigationPane.createTooltipMobile(zoomPercentage);
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
            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotationsPinch(i);
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
            this.calculateScrollValues(scrollValue);
        }
        this.pdfViewerBase.renderedPagesList = [];
        this.pdfViewerBase.pinchZoomStorage = [];
    };
    Magnification.prototype.calculateScrollValues = function (scrollValue) {
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
            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                var annotationLayers = document.querySelectorAll('canvas[id*="_annotationCanvas_"]');
                for (var j = 0; j < annotationLayers.length; j++) {
                    var pageNumber = annotationLayers[j].id.split('_annotationCanvas_')[1];
                    // tslint:disable-next-line:radix
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotationsPinch(parseInt(pageNumber));
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
            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotations(i);
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
                if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                    var annotationCanvas = this.pdfViewerBase.getElement('_annotationCanvas_' + i);
                    annotationCanvas.id = this.pdfViewer.element.id + '_old_annotationCanvas_' + i;
                }
                // tslint:disable-next-line:max-line-length
                this.pdfViewerBase.renderPageCanvas(this.pdfViewerBase.getElement('_pageDiv_' + i), this.pdfViewerBase.pageSize[i].width * this.zoomFactor, this.pdfViewerBase.pageSize[i].height * this.zoomFactor, i, 'none');
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
                        if (this.pdfViewer.enableRtl) {
                            pageDiv.style.right = this.pdfViewerBase.updateLeftPosition(i) + 'px';
                        }
                        else {
                            pageDiv.style.left = this.pdfViewerBase.updateLeftPosition(i) + 'px';
                        }
                        var canvas = this.pdfViewerBase.getElement('_pageCanvas_' + i);
                        if (canvas) {
                            canvas.style.width = width + 'px';
                            canvas.style.height = height + 'px';
                            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                                this.pdfViewer.annotationModule.textMarkupAnnotationModule.resizeAnnotations(width, height, i);
                            }
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
            this.isMagnified = false;
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
    /**
     * @private
     */
    Magnification.prototype.onDoubleTapMagnification = function () {
        this.pdfViewer.toolbarModule.showToolbar(false);
        var scrollValue = this.pdfViewerBase.viewerContainer.scrollTop;
        if (!this.isTapToFitZoom) {
            if (this.zoomFactor < 2) {
                this.zoomTo(200);
            }
            else {
                this.fitToWidth();
            }
        }
        else {
            this.zoomTo(this.previousZoomFactor * 100);
        }
        this.calculateScrollValues(scrollValue);
        this.isTapToFitZoom = !this.isTapToFitZoom;
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
     * @param  {number} pageNumber - Defines the page number to navigate
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
                // tslint:disable-next-line:max-line-length
                var pageLink = createElement('a', { id: 'page_' + i, attrs: { 'aria-label': 'Thumbnail of Page' + (i + 1), 'tabindex': '-1', 'role': 'link' } });
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
        if (this.pdfViewerBase.navigationPane) {
            if (this.pdfViewerBase.navigationPane.sideBarContentContainer) {
                this.pdfViewerBase.navigationPane.sideBarContentContainer.style.display = 'block';
                this.pdfViewerBase.navigationPane.sideBarContent.scrollTop = 0;
                this.pdfViewerBase.navigationPane.sideBarContentContainer.style.display = 'none';
            }
        }
        if (this.thumbnailView) {
            while (this.thumbnailView.hasChildNodes()) {
                this.thumbnailView.removeChild(this.thumbnailView.lastChild);
            }
        }
        if (this.pdfViewerBase.navigationPane) {
            this.pdfViewerBase.navigationPane.resetThumbnailView();
        }
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
        this.isUndoRedoBtnsVisible = true;
        this.isAnnotationEditBtnVisible = true;
        this.onToolbarKeydown = function (event) {
            var targetId = event.target.id;
            if (!(targetId === _this.pdfViewer.element.id + '_currentPageInput' || targetId === _this.pdfViewer.element.id + '_zoomDropDown')) {
                event.preventDefault();
                event.stopPropagation();
            }
        };
        this.toolbarClickHandler = function (args) {
            // tslint:disable-next-line:max-line-length
            if (!Browser.isDevice) {
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
            }
            _this.handleToolbarButtonClick(args);
            // tslint:disable-next-line:max-line-length
            if (!Browser.isDevice) {
                if (!(args.originalEvent.target === _this.zoomDropdownItem.parentElement.childNodes[1] || args.originalEvent.target === _this.zoomDropdownItem.parentElement.childNodes[2] || args.originalEvent.target === _this.currentPageBoxElement || args.originalEvent.target === _this.textSearchItem.childNodes[0])) {
                    args.originalEvent.target.blur();
                    _this.pdfViewerBase.focusViewerContainer();
                }
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
        if (!Browser.isDevice) {
            this.applyToolbarSettings();
            this.initialEnableItems();
            this.pdfViewerBase.navigationPane.adjustPane();
        }
        if (this.pdfViewer.annotationModule) {
            this.annotationToolbarModule = new AnnotationToolbar(this.pdfViewer, this.pdfViewerBase, this);
            if (!Browser.isDevice) {
                this.annotationToolbarModule.initializeAnnotationToolbar();
            }
        }
        return toolbarDiv;
    };
    /**
     * Shows /hides the toolbar in the PdfViewer
     * @param  {boolean} enableToolbar - If set true , its show the Toolbar
     * @returns void
     */
    Toolbar$$1.prototype.showToolbar = function (enableToolbar) {
        var toolbar = this.toolbarElement;
        if (enableToolbar) {
            toolbar.style.display = 'block';
            if (Browser.isDevice) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.hideMobileAnnotationToolbar();
            }
        }
        else {
            toolbar.style.display = 'none';
            if (!Browser.isDevice) {
                this.pdfViewerBase.navigationPane.sideBarToolbar.style.display = 'none';
            }
        }
    };
    /**
     * Shows/hides the Navigation toolbar in the PdfViewer
     * @param  {boolean} enableNavigationToolbar - If set true , its show the Navigation Toolbar
     * @returns void
     */
    Toolbar$$1.prototype.showNavigationToolbar = function (enableNavigationToolbar) {
        if (!Browser.isDevice) {
            var navigationToolbar = this.pdfViewerBase.navigationPane.sideBarToolbar;
            var navigationToolbarSplitter = this.pdfViewerBase.navigationPane.sideBarToolbarSplitter;
            if (enableNavigationToolbar) {
                navigationToolbar.style.display = 'block';
                navigationToolbarSplitter.style.display = 'block';
                if (this.pdfViewerBase.navigationPane.isBookmarkOpen || this.pdfViewerBase.navigationPane.isThumbnailOpen) {
                    this.pdfViewerBase.navigationPane.clear();
                }
            }
            else {
                navigationToolbar.style.display = 'none';
                navigationToolbarSplitter.style.display = 'none';
                if (this.pdfViewerBase.navigationPane.isBookmarkOpen || this.pdfViewerBase.navigationPane.isThumbnailOpen) {
                    this.pdfViewerBase.navigationPane.updateViewerContainerOnClose();
                }
            }
        }
    };
    /**
     * Shows /hides the the toolbar items in the PdfViewer
     * @param  {string[]} items - Defines the toolbar items in the toolbar
     * @param  {boolean} isVisible - If set true, then its show the toolbar Items
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
                case 'UndoRedoTool':
                    this.showUndoRedoTool(isVisible);
                    break;
                case 'AnnotationEditTool':
                    this.showAnnotationEditTool(isVisible);
                    break;
            }
        }
        this.applyHideToToolbar(true, 1, 1);
        this.applyHideToToolbar(true, 8, 8);
        this.applyHideToToolbar(true, 12, 12);
        this.applyHideToToolbar(true, 15, 15);
        this.showSeparator(items);
    };
    /**
     * Enables /disables the the toolbar items in the PdfViewer
     * @param  {string[]} items - Defines the toolbar items in the toolbar
     * @param  {boolean} isEnable - If set true, then its Enable the toolbar Items
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
                case 'UndoRedoTool':
                    this.enableUndoRedoTool(isEnable);
                    break;
                case 'AnnotationEditTool':
                    this.enableAnnotationEditTool(isEnable);
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
        this.applyHideToToolbar(enableDownloadOption, 21, 21);
    };
    Toolbar$$1.prototype.showPrintOption = function (enablePrintOption) {
        this.isPrintBtnVisible = enablePrintOption;
        this.applyHideToToolbar(enablePrintOption, 20, 20);
    };
    Toolbar$$1.prototype.showSearchOption = function (enableSearchOption) {
        this.isSearchBtnVisible = enableSearchOption;
        this.applyHideToToolbar(enableSearchOption, 18, 18);
    };
    Toolbar$$1.prototype.showUndoRedoTool = function (isEnable) {
        this.isUndoRedoBtnsVisible = isEnable;
        this.applyHideToToolbar(isEnable, 16, 17);
    };
    Toolbar$$1.prototype.showAnnotationEditTool = function (isEnable) {
        this.isAnnotationEditBtnVisible = isEnable;
        this.applyHideToToolbar(isEnable, 19, 19);
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
    Toolbar$$1.prototype.enableUndoRedoTool = function (isEnable) {
        this.toolbar.enableItems(this.undoItem.parentElement, isEnable);
        this.toolbar.enableItems(this.redoItem.parentElement, isEnable);
    };
    Toolbar$$1.prototype.enableAnnotationEditTool = function (isEnable) {
        this.toolbar.enableItems(this.annotationItem.parentElement, isEnable);
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.resetToolbar = function () {
        if (!Browser.isDevice) {
            this.currentPageBox.min = 0;
            this.currentPageBox.value = 0;
            this.updateTotalPage();
            this.updateToolbarItems();
            if (this.annotationToolbarModule) {
                this.annotationToolbarModule.clear();
            }
        }
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.updateToolbarItems = function () {
        if (!Browser.isDevice) {
            if (this.pdfViewerBase.pageCount === 0) {
                this.toolbar.enableItems(this.downloadItem.parentElement, false);
                this.toolbar.enableItems(this.printItem.parentElement, false);
                this.updateUndoRedoButtons();
                this.updateNavigationButtons();
                this.toolbar.enableItems(this.zoomInItem.parentElement, false);
                this.toolbar.enableItems(this.zoomOutItem.parentElement, false);
                if (this.pdfViewer.magnificationModule) {
                    this.zoomDropDown.readonly = true;
                }
                this.toolbar.enableItems(this.pdfViewerBase.getElement('_currentPageInputContainer'), false);
                this.toolbar.enableItems(this.pdfViewerBase.getElement('_zoomDropDownContainer'), false);
                this.toolbar.enableItems(this.textSelectItem.parentElement, false);
                this.toolbar.enableItems(this.annotationItem.parentElement, false);
                this.toolbar.enableItems(this.panItem.parentElement, false);
                this.toolbar.enableItems(this.textSearchItem.parentElement, false);
                this.deSelectItem(this.annotationItem);
                if (this.annotationToolbarModule) {
                    this.annotationToolbarModule.resetToolbar();
                }
            }
            else if (this.pdfViewerBase.pageCount > 0) {
                this.toolbar.enableItems(this.downloadItem.parentElement, true);
                this.toolbar.enableItems(this.printItem.parentElement, true);
                this.toolbar.enableItems(this.pdfViewerBase.getElement('_currentPageInputContainer'), true);
                this.toolbar.enableItems(this.pdfViewerBase.getElement('_zoomDropDownContainer'), true);
                this.updateUndoRedoButtons();
                this.updateNavigationButtons();
                this.updateZoomButtons();
                if (this.pdfViewer.magnificationModule) {
                    this.zoomDropDown.readonly = false;
                }
                this.updateInteractionItems();
                // modify this condition if new annotation types are added.
                if (this.pdfViewer.annotationModule && this.pdfViewer.enableAnnotation) {
                    this.toolbar.enableItems(this.annotationItem.parentElement, true);
                }
                if (this.pdfViewer.textSearchModule && this.pdfViewer.enableTextSearch) {
                    this.toolbar.enableItems(this.textSearchItem.parentElement, true);
                }
            }
            if (this.pdfViewer.annotationToolbarSettings.annotationToolbarItem.length === 0 || !this.pdfViewer.annotationModule) {
                this.enableToolbarItem(['AnnotationEditTool'], false);
            }
        }
        else {
            if (this.pdfViewerBase.pageCount === 0) {
                this.toolbar.enableItems(this.textSearchItem.parentElement, false);
                this.toolbar.enableItems(this.moreOptionItem.parentElement, false);
            }
            else if (this.pdfViewerBase.pageCount > 0) {
                this.toolbar.enableItems(this.textSearchItem.parentElement, true);
                this.toolbar.enableItems(this.moreOptionItem.parentElement, true);
                this.updateUndoRedoButtons();
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
        if (this.pdfViewer.magnificationModule && !this.isMagnificationToolDisabled && !Browser.isDevice) {
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
    Toolbar$$1.prototype.updateUndoRedoButtons = function () {
        if (this.pdfViewer.annotationModule) {
            if (this.pdfViewerBase.pageCount > 0) {
                this.enableCollectionAvailable(this.pdfViewer.annotationModule.actionCollection, this.undoItem.parentElement);
                this.enableCollectionAvailable(this.pdfViewer.annotationModule.redoCollection, this.redoItem.parentElement);
            }
            else {
                this.disableUndoRedoButtons();
            }
        }
        else {
            this.disableUndoRedoButtons();
        }
    };
    // tslint:disable-next-line
    Toolbar$$1.prototype.enableCollectionAvailable = function (collection, item) {
        if (collection.length > 0) {
            this.toolbar.enableItems(item, true);
        }
        else {
            this.toolbar.enableItems(item, false);
        }
    };
    Toolbar$$1.prototype.disableUndoRedoButtons = function () {
        this.toolbar.enableItems(this.undoItem.parentElement, false);
        this.toolbar.enableItems(this.redoItem.parentElement, false);
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.destroy = function () {
        this.unWireEvent();
        if (this.moreDropDown) {
            this.moreDropDown.destroy();
        }
        if (this.annotationToolbarModule) {
            this.annotationToolbarModule.destroy();
        }
        this.toolbar.destroy();
        this.toolbarElement.remove();
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.updateCurrentPage = function (pageIndex) {
        if (!Browser.isDevice) {
            if (this.currentPageBox.value === pageIndex) {
                this.currentPageBoxElement.value = pageIndex.toString();
            }
            this.currentPageBox.value = pageIndex;
        }
        else {
            this.pdfViewerBase.mobileSpanContainer.innerHTML = pageIndex.toString();
            this.pdfViewerBase.mobilecurrentPageContainer.innerHTML = pageIndex.toString();
        }
        this.pdfViewerBase.currentPageNumber = pageIndex;
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.updateTotalPage = function () {
        if (!Browser.isDevice) {
            if (this.pdfViewerBase.pageCount > 0) {
                this.currentPageBox.min = 1;
            }
            this.totalPageItem.textContent = 'of ' + this.pdfViewerBase.pageCount.toString();
        }
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.openFileDialogBox = function (event) {
        event.preventDefault();
        this.fileInputElement.click();
    };
    Toolbar$$1.prototype.createToolbar = function (controlWidth) {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_toolbarContainer', className: 'e-pv-toolbar' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
        if (!Browser.isDevice) {
            this.toolbar = new Toolbar({
                clicked: this.toolbarClickHandler, width: '', height: '', overflowMode: 'Popup',
                items: this.createToolbarItems(), created: function () {
                    _this.createZoomDropdown();
                    _this.createNumericTextBox();
                    _this.toolbar.refreshOverflow();
                }
            });
            if (this.pdfViewer.enableRtl) {
                this.toolbar.enableRtl = true;
            }
            this.toolbar.appendTo(this.toolbarElement);
            this.afterToolbarCreation();
            this.updateTotalPage();
            this.toolbarElement.addEventListener('keydown', this.onToolbarKeydown);
        }
        else {
            this.createToolbarItemsForMobile();
            if (this.pdfViewer.enableRtl) {
                this.toolbar.enableRtl = true;
            }
            this.disableUndoRedoButtons();
        }
        return this.toolbarElement;
    };
    // tslint:disable-next-line
    Toolbar$$1.prototype.createToolbarItems = function () {
        var currentPageInputTemplate = this.createCurrentPageInputTemplate();
        var totalPageTemplate = this.createTotalPageTemplate();
        var zoomDropDownTemplateString = this.createZoomDropdownElement();
        // tslint:disable-next-line
        var items = [];
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-open-document-icon e-pv-icon', cssClass: 'e-pv-open-document-container', id: this.pdfViewer.element.id + '_open', text: this.pdfViewer.localeObj.getConstant('Open text'), align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        if (!this.pdfViewer.enableRtl) {
            // tslint:disable-next-line:max-line-length
            items.push({ prefixIcon: 'e-pv-first-page-navigation-icon e-pv-icon', cssClass: 'e-pv-first-page-navigation-container', id: this.pdfViewer.element.id + '_firstPage', text: this.pdfViewer.localeObj.getConstant('First text'), align: 'Left' });
            items.push({ prefixIcon: 'e-pv-previous-page-navigation-icon e-pv-icon', cssClass: 'e-pv-previous-page-navigation-container', id: this.pdfViewer.element.id + '_previousPage', text: this.pdfViewer.localeObj.getConstant('Previous text'), align: 'Left' });
            // tslint:disable-next-line:max-line-length
            items.push({ prefixIcon: 'e-pv-next-page-navigation-icon e-pv-icon', cssClass: 'e-pv-next-page-navigation-container', id: this.pdfViewer.element.id + '_nextPage', text: this.pdfViewer.localeObj.getConstant('Next text'), align: 'Left' });
            items.push({ prefixIcon: 'e-pv-last-page-navigation-icon e-pv-icon', cssClass: 'e-pv-last-page-navigation-container', id: this.pdfViewer.element.id + '_lastPage', text: this.pdfViewer.localeObj.getConstant('Last text'), align: 'Left' });
            items.push({ template: currentPageInputTemplate, align: 'Left' });
            items.push({ template: totalPageTemplate, align: 'Left' });
        }
        else {
            // tslint:disable-next-line:max-line-length
            items.push({ prefixIcon: 'e-pv-last-page-navigation-icon e-pv-icon', cssClass: 'e-pv-last-page-navigation-container', id: this.pdfViewer.element.id + '_firstPage', text: this.pdfViewer.localeObj.getConstant('First text'), align: 'Left' });
            items.push({ prefixIcon: 'e-pv-next-page-navigation-icon e-pv-icon', cssClass: 'e-pv-next-page-navigation-container', id: this.pdfViewer.element.id + '_previousPage', text: this.pdfViewer.localeObj.getConstant('Previous text'), align: 'Left' });
            // tslint:disable-next-line:max-line-length
            items.push({ prefixIcon: 'e-pv-previous-page-navigation-icon e-pv-icon', cssClass: 'e-pv-previous-page-navigation-container', id: this.pdfViewer.element.id + '_nextPage', text: this.pdfViewer.localeObj.getConstant('Next text'), align: 'Left' });
            items.push({ prefixIcon: 'e-pv-first-page-navigation-icon e-pv-icon', cssClass: 'e-pv-first-page-navigation-container', id: this.pdfViewer.element.id + '_lastPage', text: this.pdfViewer.localeObj.getConstant('Last text'), align: 'Left' });
            items.push({ template: totalPageTemplate, align: 'Left' });
            items.push({ template: currentPageInputTemplate, align: 'Left' });
        }
        items.push({ type: 'Separator', align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-zoom-out-icon e-pv-icon', cssClass: 'e-pv-zoom-out-container', id: this.pdfViewer.element.id + '_zoomOut', text: this.pdfViewer.localeObj.getConstant('Zoom out text'), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-zoom-in-icon e-pv-icon', cssClass: 'e-pv-zoom-in-container', id: this.pdfViewer.element.id + '_zoomIn', text: this.pdfViewer.localeObj.getConstant('Zoom in text'), align: 'Left' });
        items.push({ template: zoomDropDownTemplateString, cssClass: 'e-pv-zoom-drop-down-container', align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-text-select-tool-icon e-pv-icon', cssClass: 'e-pv-text-select-tool-container', id: this.pdfViewer.element.id + '_selectTool', text: this.pdfViewer.localeObj.getConstant('Selection text') });
        items.push({ prefixIcon: 'e-pv-pan-tool-icon e-pv-icon', cssClass: 'e-pv-pan-tool-container', id: this.pdfViewer.element.id + '_handTool', text: this.pdfViewer.localeObj.getConstant('Pan text') });
        items.push({ type: 'Separator', align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-undo-icon e-pv-icon', cssClass: 'e-pv-undo-container', id: this.pdfViewer.element.id + '_undo', text: this.pdfViewer.localeObj.getConstant('Undo'), align: 'Left' });
        items.push({ prefixIcon: 'e-pv-redo-icon e-pv-icon', cssClass: 'e-pv-redo-container', id: this.pdfViewer.element.id + '_redo', text: this.pdfViewer.localeObj.getConstant('Redo'), align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-text-search-icon e-pv-icon', cssClass: 'e-pv-text-search-container', id: this.pdfViewer.element.id + '_search', text: this.pdfViewer.localeObj.getConstant('Search text'), align: 'Right' });
        items.push({ prefixIcon: 'e-pv-annotation-icon e-pv-icon', cssClass: 'e-pv-annotation-container', id: this.pdfViewer.element.id + '_annotation', text: this.pdfViewer.localeObj.getConstant('Annotation Edit text'), align: 'Right' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-print-document-icon e-pv-icon', cssClass: 'e-pv-print-document-container', id: this.pdfViewer.element.id + '_print', text: this.pdfViewer.localeObj.getConstant('Print text'), align: 'Right' });
        items.push({ prefixIcon: 'e-pv-download-document-icon e-pv-icon', cssClass: 'e-pv-download-document-container', id: this.pdfViewer.element.id + '_download', text: this.pdfViewer.localeObj.getConstant('Download'), align: 'Right' });
        return items;
    };
    Toolbar$$1.prototype.afterToolbarCreation = function () {
        this.itemsContainer = this.toolbar.element.childNodes[0];
        this.itemsContainer.id = this.pdfViewer.element.id + '_toolbarItemsContainer';
        this.openDocumentItem = this.addClassToolbarItem('_open', 'e-pv-open-document', this.pdfViewer.localeObj.getConstant('Open'));
        this.undoItem = this.addClassToolbarItem('_undo', 'e-pv-undo', this.pdfViewer.localeObj.getConstant('Undo'));
        this.redoItem = this.addClassToolbarItem('_redo', 'e-pv-redo', this.pdfViewer.localeObj.getConstant('Redo'));
        if (!this.pdfViewer.enableRtl) {
            // tslint:disable-next-line:max-line-length
            this.firstPageItem = this.addClassToolbarItem('_firstPage', 'e-pv-first-page-navigation', this.pdfViewer.localeObj.getConstant('Go To First Page'));
            this.previousPageItem = this.addClassToolbarItem('_previousPage', 'e-pv-previous-page-navigation', this.pdfViewer.localeObj.getConstant('Previous Page'));
            // tslint:disable-next-line:max-line-length
            this.nextPageItem = this.addClassToolbarItem('_nextPage', 'e-pv-next-page-navigation', this.pdfViewer.localeObj.getConstant('Next Page'));
            this.lastPageItem = this.addClassToolbarItem('_lastPage', 'e-pv-last-page-navigation', this.pdfViewer.localeObj.getConstant('Go To Last Page'));
        }
        else {
            // tslint:disable-next-line:max-line-length
            this.firstPageItem = this.addClassToolbarItem('_firstPage', 'e-pv-last-page-navigation', this.pdfViewer.localeObj.getConstant('Go To First Page'));
            this.previousPageItem = this.addClassToolbarItem('_previousPage', 'e-pv-next-page-navigation', this.pdfViewer.localeObj.getConstant('Previous Page'));
            // tslint:disable-next-line:max-line-length
            this.nextPageItem = this.addClassToolbarItem('_nextPage', 'e-pv-previous-page-navigation', this.pdfViewer.localeObj.getConstant('Next Page'));
            this.lastPageItem = this.addClassToolbarItem('_lastPage', 'e-pv-first-page-navigation', this.pdfViewer.localeObj.getConstant('Go To Last Page'));
        }
        this.zoomOutItem = this.addClassToolbarItem('_zoomOut', 'e-pv-zoom-out', this.pdfViewer.localeObj.getConstant('Zoom Out'));
        this.zoomInItem = this.addClassToolbarItem('_zoomIn', 'e-pv-zoom-in', this.pdfViewer.localeObj.getConstant('Zoom In'));
        // tslint:disable-next-line:max-line-length
        this.textSelectItem = this.addClassToolbarItem('_selectTool', 'e-pv-text-select-tool', this.pdfViewer.localeObj.getConstant('Text Selection'));
        this.panItem = this.addClassToolbarItem('_handTool', 'e-pv-pan-tool', this.pdfViewer.localeObj.getConstant('Panning'));
        // tslint:disable-next-line:max-line-length
        this.textSearchItem = this.addClassToolbarItem('_search', 'e-pv-text-search', this.pdfViewer.localeObj.getConstant('Text Search'));
        this.annotationItem = this.addClassToolbarItem('_annotation', 'e-pv-annotation', this.pdfViewer.localeObj.getConstant('Annotation'));
        // tslint:disable-next-line:max-line-length
        this.printItem = this.addClassToolbarItem('_print', 'e-pv-print-document', this.pdfViewer.localeObj.getConstant('Print'));
        this.downloadItem = this.addClassToolbarItem('_download', 'e-pv-download-document', this.pdfViewer.localeObj.getConstant('Download file'));
        this.zoomDropdownItem = this.pdfViewerBase.getElement('_zoomDropDown');
        this.createTooltip(this.zoomDropdownItem, this.pdfViewer.localeObj.getConstant('Zoom'));
        this.zoomDropdownItem.setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('Zoom'));
        // tslint:disable-next-line:max-line-length
        this.addPropertiesToolItemContainer(this.zoomDropdownItem.parentElement.parentElement, null, '_zoomDropDownContainer');
        this.pdfViewerBase.getElement('_zoomDropDownContainer').style.minWidth = '';
        this.createTooltip(this.currentPageBoxElement, this.pdfViewer.localeObj.getConstant('Page Number'));
        this.currentPageBoxElement.setAttribute('aria-label', this.pdfViewer.localeObj.getConstant('Page Number'));
        // tslint:disable-next-line:max-line-length
        this.addPropertiesToolItemContainer(this.currentPageBoxElement.parentElement.parentElement, 'e-pv-current-page-container', '_currentPageInputContainer');
        this.pdfViewerBase.getElement('_currentPageInputContainer').style.minWidth = '20px';
        this.totalPageItem = this.pdfViewerBase.getElement('_totalPage');
        this.addPropertiesToolItemContainer(this.totalPageItem.parentElement, 'e-pv-total-page-container', '_totalPageContainer');
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.addClassToolbarItem = function (idString, className, tooltipText) {
        var element = this.pdfViewerBase.getElement(idString);
        element.classList.add(className);
        element.classList.add('e-pv-tbar-btn');
        element.setAttribute('aria-label', tooltipText);
        element.parentElement.classList.add(className + '-container');
        element.parentElement.classList.add('e-popup-text');
        element.parentElement.id = this.pdfViewer.element.id + idString + 'Container';
        if (element.childNodes.length > 0) {
            var spanElement = element.childNodes[0];
            spanElement.id = this.pdfViewer.element.id + idString + 'Icon';
            spanElement.classList.remove('e-icons');
            spanElement.classList.remove('e-btn-icon');
            if (this.pdfViewer.enableRtl) {
                spanElement.classList.add('e-right');
            }
            var textElement = element.childNodes[1];
            if (textElement) {
                if (textElement.classList.contains('e-tbar-btn-text')) {
                    textElement.id = this.pdfViewer.element.id + idString + 'Text';
                }
            }
        }
        element.style.width = '';
        this.createTooltip(element, tooltipText);
        return element;
    };
    Toolbar$$1.prototype.addPropertiesToolItemContainer = function (element, className, idString) {
        if (className !== null) {
            element.classList.add(className);
        }
        element.classList.add('e-popup-text');
        element.id = this.pdfViewer.element.id + idString;
    };
    Toolbar$$1.prototype.createZoomDropdownElement = function () {
        // tslint:disable-next-line:max-line-length
        var zoomDropdownElement = this.createToolbarItem('input', this.pdfViewer.element.id + '_zoomDropDown', null);
        return zoomDropdownElement.outerHTML;
    };
    Toolbar$$1.prototype.createZoomDropdown = function () {
        // tslint:disable-next-line:max-line-length
        var items = [{ percent: '50%', id: '0' }, { percent: '75%', id: '1' }, { percent: '100%', id: '2' }, { percent: '125%', id: '3' },
            // tslint:disable-next-line:max-line-length
            { percent: '150%', id: '4' }, { percent: '200%', id: '5' }, { percent: '400%', id: '6' }, { percent: this.pdfViewer.localeObj.getConstant('Fit Page'), id: '7' }, { percent: this.pdfViewer.localeObj.getConstant('Fit Width'), id: '8' }, { percent: this.pdfViewer.localeObj.getConstant('Automatic'), id: '9' }
        ];
        // tslint:disable-next-line:max-line-length
        this.zoomDropDown = new ComboBox({ dataSource: items, text: '100%', fields: { text: 'percent', value: 'id' }, readonly: true, cssClass: 'e-pv-zoom-drop-down', popupHeight: '402px', showClearButton: false });
        this.zoomDropDown.appendTo(this.pdfViewerBase.getElement('_zoomDropDown'));
    };
    Toolbar$$1.prototype.createCurrentPageInputTemplate = function () {
        // tslint:disable-next-line:max-line-length
        var goToPageElement = this.createToolbarItem('input', this.pdfViewer.element.id + '_currentPageInput', null);
        return goToPageElement.outerHTML;
    };
    Toolbar$$1.prototype.createTotalPageTemplate = function () {
        // tslint:disable-next-line:max-line-length
        var totalPageElement = this.createToolbarItem('span', this.pdfViewer.element.id + '_totalPage', 'e-pv-total-page');
        return totalPageElement.outerHTML;
    };
    Toolbar$$1.prototype.createNumericTextBox = function () {
        this.currentPageBox = new NumericTextBox({ value: 0, format: '##', cssClass: 'e-pv-current-page-box', showSpinButton: false });
        this.currentPageBoxElement = this.pdfViewerBase.getElement('_currentPageInput');
        this.currentPageBox.appendTo(this.currentPageBoxElement);
    };
    Toolbar$$1.prototype.createToolbarItemsForMobile = function () {
        this.toolbarElement.classList.add('e-pv-mobile-toolbar');
        var template = '<button id="' + this.pdfViewer.element.id + '_more_option" class="e-tbar-btn"></button>';
        this.toolbar = new Toolbar({
            // tslint:disable-next-line:max-line-length
            items: [{ prefixIcon: 'e-pv-open-document-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Open'), id: this.pdfViewer.element.id + '_open' },
                { type: 'Separator', align: 'Left' },
                // tslint:disable-next-line:max-line-length
                { prefixIcon: 'e-pv-undo-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Undo'), id: this.pdfViewer.element.id + '_undo', },
                // tslint:disable-next-line:max-line-length
                { prefixIcon: 'e-pv-redo-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Redo'), id: this.pdfViewer.element.id + '_redo', },
                // tslint:disable-next-line:max-line-length
                { prefixIcon: 'e-pv-text-search-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Text Search'), id: this.pdfViewer.element.id + '_search', align: 'Right' },
                { template: template, align: 'Right' }
            ], clicked: this.toolbarClickHandler, width: '', height: '', overflowMode: 'Popup'
        });
        this.toolbar.appendTo(this.toolbarElement);
        this.openDocumentItem = this.pdfViewerBase.getElement('_open');
        this.openDocumentItem.classList.add('e-pv-open-document');
        this.openDocumentItem.firstElementChild.id = this.pdfViewer.element.id + '_openIcon';
        this.textSearchItem = this.pdfViewerBase.getElement('_search');
        this.textSearchItem.classList.add('e-pv-text-search');
        this.textSearchItem.firstElementChild.id = this.pdfViewer.element.id + '_searchIcon';
        this.undoItem = this.pdfViewerBase.getElement('_undo');
        this.undoItem.classList.add('e-pv-undo');
        this.redoItem = this.pdfViewerBase.getElement('_redo');
        this.redoItem.classList.add('e-pv-redo');
        this.redoItem.firstElementChild.id = this.pdfViewer.element.id + '_redoIcon';
        this.undoItem.firstElementChild.id = this.pdfViewer.element.id + '_undoIcon';
        this.createMoreOption(this.pdfViewer.element.id + '_more_option');
    };
    Toolbar$$1.prototype.createMoreOption = function (idString) {
        var _this = this;
        this.moreOptionItem = document.getElementById(idString);
        var items = [
            {
                text: this.pdfViewer.localeObj.getConstant('Download'), id: this.pdfViewer.element.id + '_menu_download',
                iconCss: 'e-icons e-pv-download-document-icon e-pv-icon'
            },
            {
                text: this.pdfViewer.localeObj.getConstant('Bookmarks'), id: this.pdfViewer.element.id + '_menu_bookmarks',
                iconCss: 'e-icons e-pv-bookmark-icon e-pv-icon'
            }
        ];
        this.moreDropDown = new DropDownButton({
            items: items, iconCss: 'e-pv-more-icon e-pv-icon', cssClass: 'e-caret-hide',
            open: function (args) {
                var dropdownButtonPosition = _this.moreDropDown.element.getBoundingClientRect();
                // tslint:disable-next-line:max-line-length
                if (!_this.pdfViewer.enableRtl) {
                    args.element.parentElement.style.left = dropdownButtonPosition.left + dropdownButtonPosition.width - args.element.parentElement.offsetWidth + 'px';
                }
            }, select: function (args) {
                switch (args.item.id) {
                    case _this.pdfViewer.element.id + '_menu_download':
                        _this.pdfViewerBase.download();
                        break;
                    case _this.pdfViewer.element.id + '_menu_bookmarks':
                        _this.showToolbar(false);
                        _this.pdfViewerBase.navigationPane.createNavigationPaneMobile('bookmarks');
                        break;
                    default:
                        break;
                }
            }, beforeItemRender: function (args) {
                if (args.item.id === _this.pdfViewer.element.id + '_menu_bookmarks') {
                    if (!_this.pdfViewer.bookmarkViewModule || !_this.pdfViewer.bookmarkViewModule.bookmarks) {
                        args.element.classList.add('e-disabled');
                    }
                    else {
                        args.element.classList.remove('e-disabled');
                    }
                }
            }, close: function (args) {
                _this.moreOptionItem.blur();
                _this.pdfViewerBase.focusViewerContainer();
            }
        });
        this.moreDropDown.appendTo('#' + idString);
    };
    Toolbar$$1.prototype.createToolbarItem = function (elementName, id, className) {
        var toolbarItem = createElement(elementName, { id: id });
        if (className !== null) {
            toolbarItem.className = className;
        }
        if (elementName === 'input' && id !== this.pdfViewer.element.id + '_zoomDropDown') {
            toolbarItem.type = 'text';
        }
        return toolbarItem;
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.createTooltip = function (toolbarItem, tooltipText) {
        if (tooltipText !== null) {
            // tslint:disable-next-line
            var tooltip = new Tooltip({ content: tooltipText, opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
            tooltip.appendTo(toolbarItem);
        }
    };
    Toolbar$$1.prototype.onTooltipBeforeOpen = function (args) {
        if (!this.pdfViewer.toolbarSettings.showTooltip && this.toolbarElement.contains(args.target)) {
            args.cancel = true;
        }
        if (this.annotationToolbarModule) {
            // tslint:disable-next-line:max-line-length
            if (!this.pdfViewer.annotationToolbarSettings.showTooltip && this.annotationToolbarModule.toolbarElement.contains(args.target)) {
                args.cancel = true;
            }
        }
    };
    Toolbar$$1.prototype.createFileElement = function (toolbarElement) {
        // tslint:disable-next-line:max-line-length
        this.fileInputElement = createElement('input', { id: this.pdfViewer.element.id + '_fileUploadElement', styles: 'position:fixed; left:-100em', attrs: { 'type': 'file' } });
        this.fileInputElement.setAttribute('accept', '.pdf');
        toolbarElement.appendChild(this.fileInputElement);
    };
    Toolbar$$1.prototype.wireEvent = function () {
        this.fileInputElement.addEventListener('change', this.loadDocument);
        if (!Browser.isDevice) {
            this.toolbarElement.addEventListener('mouseup', this.toolbarOnMouseup.bind(this));
            this.currentPageBoxElement.addEventListener('focusout', this.textBoxFocusOut);
            this.currentPageBoxElement.addEventListener('keypress', this.navigateToPage);
            this.zoomDropDown.change = this.zoomPercentSelect.bind(this);
            this.zoomDropDown.element.addEventListener('keypress', this.onZoomDropDownInput.bind(this));
            this.zoomDropDown.element.addEventListener('click', this.onZoomDropDownInputClick.bind(this));
        }
    };
    Toolbar$$1.prototype.unWireEvent = function () {
        this.fileInputElement.removeEventListener('change', this.loadDocument);
        if (!Browser.isDevice) {
            this.toolbarElement.removeEventListener('mouseup', this.toolbarOnMouseup.bind(this));
            this.currentPageBoxElement.removeEventListener('focusout', this.textBoxFocusOut);
            this.currentPageBoxElement.removeEventListener('keypress', this.navigateToPage);
            this.zoomDropDown.removeEventListener('change', this.zoomPercentSelect);
            this.zoomDropDown.element.removeEventListener('keypress', this.onZoomDropDownInput);
            this.zoomDropDown.element.removeEventListener('click', this.onZoomDropDownInputClick);
        }
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.onToolbarResize = function (viewerWidth) {
        if (Browser.isDevice) {
            this.pdfViewerBase.navigationPane.toolbarResize();
        }
        else {
            this.toolbar.refreshOverflow();
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
    Toolbar$$1.prototype.handleToolbarButtonClick = function (args) {
        switch (args.originalEvent.target.id) {
            case this.pdfViewer.element.id + '_open':
            case this.pdfViewer.element.id + '_openIcon':
            case this.pdfViewer.element.id + '_openText':
                this.fileInputElement.click();
                if (Browser.isDevice) {
                    args.originalEvent.target.blur();
                    this.pdfViewerBase.focusViewerContainer();
                }
                break;
            case this.pdfViewer.element.id + '_download':
            case this.pdfViewer.element.id + '_downloadIcon':
            case this.pdfViewer.element.id + '_downloadText':
                this.pdfViewerBase.download();
                break;
            case this.pdfViewer.element.id + '_print':
            case this.pdfViewer.element.id + '_printIcon':
            case this.pdfViewer.element.id + '_printText':
                if (this.pdfViewer.printModule) {
                    this.pdfViewer.printModule.print();
                }
                break;
            case this.pdfViewer.element.id + '_undo':
            case this.pdfViewer.element.id + '_undoIcon':
            case this.pdfViewer.element.id + '_undoText':
                if (this.pdfViewer.annotationModule) {
                    this.pdfViewer.annotationModule.undo();
                }
                break;
            case this.pdfViewer.element.id + '_redo':
            case this.pdfViewer.element.id + '_redoIcon':
            case this.pdfViewer.element.id + '_redoText':
                if (this.pdfViewer.annotationModule) {
                    this.pdfViewer.annotationModule.redo();
                }
                break;
            case this.pdfViewer.element.id + '_firstPage':
            case this.pdfViewer.element.id + '_firstPageIcon':
            case this.pdfViewer.element.id + '_firstPageText':
                if (this.pdfViewer.navigationModule) {
                    this.pdfViewer.navigationModule.goToFirstPage();
                }
                break;
            case this.pdfViewer.element.id + '_previousPage':
            case this.pdfViewer.element.id + '_previousPageIcon':
            case this.pdfViewer.element.id + '_previousPageText':
                if (this.pdfViewer.navigationModule) {
                    this.pdfViewer.navigationModule.goToPreviousPage();
                }
                break;
            case this.pdfViewer.element.id + '_nextPage':
            case this.pdfViewer.element.id + '_nextPageIcon':
            case this.pdfViewer.element.id + '_nextPageText':
                if (this.pdfViewer.navigationModule) {
                    this.pdfViewer.navigationModule.goToNextPage();
                }
                break;
            case this.pdfViewer.element.id + '_lastPage':
            case this.pdfViewer.element.id + '_lastPageIcon':
            case this.pdfViewer.element.id + '_lastPageText':
                if (this.pdfViewer.navigationModule) {
                    this.pdfViewer.navigationModule.goToLastPage();
                }
                break;
            case this.pdfViewer.element.id + '_zoomIn':
            case this.pdfViewer.element.id + '_zoomInIcon':
            case this.pdfViewer.element.id + '_zoomInText':
                this.pdfViewer.magnificationModule.zoomIn();
                break;
            case this.pdfViewer.element.id + '_zoomOut':
            case this.pdfViewer.element.id + '_zoomOutIcon':
            case this.pdfViewer.element.id + '_zoomOutText':
                this.pdfViewer.magnificationModule.zoomOut();
                break;
            case this.pdfViewer.element.id + '_selectTool':
            case this.pdfViewer.element.id + '_selectToolIcon':
            case this.pdfViewer.element.id + '_selectToolText':
                if (!this.isSelectionToolDisabled) {
                    this.pdfViewerBase.initiateTextSelectMode();
                    this.updateInteractionTools(true);
                }
                break;
            case this.pdfViewer.element.id + '_handTool':
            case this.pdfViewer.element.id + '_handToolIcon':
            case this.pdfViewer.element.id + '_handToolText':
                if (!this.isScrollingToolDisabled) {
                    this.pdfViewerBase.initiatePanning();
                    this.updateInteractionTools(false);
                }
                break;
            case this.pdfViewer.element.id + '_search':
            case this.pdfViewer.element.id + '_searchIcon':
            case this.pdfViewer.element.id + '_searchText':
                this.textSearchButtonHandler();
                break;
            case this.pdfViewer.element.id + '_annotation':
            case this.pdfViewer.element.id + '_annotationIcon':
            case this.pdfViewer.element.id + '_annotationText':
                this.initiateAnnotationMode();
                break;
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
        if (!Browser.isDevice) {
            // tslint:disable-next-line:radix
            var currentPercent = parseInt((zoomFactor * 100).toString()) + '%';
            if (this.zoomDropDown.text === currentPercent) {
                this.zoomDropDown.element.value = currentPercent;
            }
            if (this.zoomDropDown.index === 9) {
                this.zoomDropDown.value = 2;
            }
            // tslint:disable-next-line
            this.zoomDropDown.text = currentPercent;
        }
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
        if (!Browser.isDevice) {
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
        }
        else {
            this.showToolbar(false);
            this.pdfViewerBase.navigationPane.createNavigationPaneMobile('search');
        }
    };
    Toolbar$$1.prototype.initiateAnnotationMode = function () {
        if (this.annotationToolbarModule) {
            if (this.pdfViewerBase.isPanMode && this.annotationToolbarModule.isToolbarHidden) {
                this.pdfViewerBase.initiateTextSelectMode();
            }
            this.DisableInteractionTools();
            this.annotationToolbarModule.showAnnotationToolbar(this.annotationItem);
        }
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.DisableInteractionTools = function () {
        this.deSelectItem(this.textSelectItem);
        this.deSelectItem(this.panItem);
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.selectItem = function (element) {
        element.classList.add('e-pv-select');
    };
    /**
     * @private
     */
    Toolbar$$1.prototype.deSelectItem = function (element) {
        element.classList.remove('e-pv-select');
    };
    /**
     * @private
     */
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
        if (this.pdfViewer.enableNavigationToolbar) {
            this.showNavigationToolbar(true);
        }
        else {
            this.showNavigationToolbar(false);
        }
        if (this.isPrintBtnVisible) {
            this.showPrintOption(true);
        }
        else {
            this.showPrintOption(false);
        }
        if (this.isDownloadBtnVisible) {
            this.showDownloadOption(true);
        }
        else {
            this.showDownloadOption(false);
        }
        if (this.isSearchBtnVisible) {
            this.showSearchOption(true);
        }
        else {
            this.showSearchOption(false);
        }
    };
    Toolbar$$1.prototype.showSeparator = function (toolbarItems) {
        if (!this.isOpenBtnVisible || (this.isOpenBtnVisible && toolbarItems.length === 1) ||
            // tslint:disable-next-line:max-line-length
            (!this.isNavigationToolVisible && !this.isMagnificationToolVisible && !this.isSelectionBtnVisible && !this.isScrollingBtnVisible && !this.isUndoRedoBtnsVisible)) {
            this.applyHideToToolbar(false, 1, 1);
        }
        if (((!this.isNavigationToolVisible && !this.isMagnificationToolVisible) && !this.isOpenBtnVisible) ||
            (this.isOpenBtnVisible && !this.isNavigationToolVisible) ||
            // tslint:disable-next-line:max-line-length
            ((!this.isOpenBtnVisible && !this.isNavigationToolVisible) || (!this.isMagnificationToolVisible && !this.isScrollingBtnVisible && !this.isSelectionBtnVisible))) {
            this.applyHideToToolbar(false, 8, 8);
        }
        if ((!this.isMagnificationToolVisible && !this.isSelectionBtnVisible && !this.isScrollingBtnVisible) ||
            (this.isMagnificationToolVisible && (!this.isSelectionBtnVisible && !this.isScrollingBtnVisible)) ||
            (!this.isMagnificationToolVisible && (this.isSelectionBtnVisible || this.isScrollingBtnVisible))) {
            this.applyHideToToolbar(false, 12, 12);
        }
        if (((!this.isMagnificationToolVisible && !this.isNavigationToolVisible && !this.isScrollingBtnVisible
            && !this.isSelectionBtnVisible) && this.isUndoRedoBtnsVisible || !this.isUndoRedoBtnsVisible)) {
            this.applyHideToToolbar(false, 15, 15);
        }
    };
    Toolbar$$1.prototype.applyToolbarSettings = function () {
        var toolbarSettingsItems = this.pdfViewer.toolbarSettings.toolbarItem;
        if (toolbarSettingsItems) {
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
            if (toolbarSettingsItems.indexOf('UndoRedoTool') !== -1) {
                this.showUndoRedoTool(true);
            }
            else {
                this.showUndoRedoTool(false);
            }
            if (toolbarSettingsItems.indexOf('AnnotationEditTool') !== -1) {
                this.showAnnotationEditTool(true);
            }
            else {
                this.showAnnotationEditTool(false);
            }
            this.showSeparator(toolbarSettingsItems);
        }
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
 * @hidden
 */
var AnnotationToolbar = /** @__PURE__ @class */ (function () {
    function AnnotationToolbar(viewer, viewerBase, toolbar) {
        this.toolbarBorderHeight = 1;
        /**
         * @private
         */
        this.isToolbarHidden = false;
        /**
         * @private
         */
        this.isMobileAnnotEnabled = false;
        this.isHighlightEnabled = false;
        this.isUnderlineEnabled = false;
        this.isStrikethroughEnabled = false;
        this.isHighlightBtnVisible = true;
        this.isUnderlineBtnVisible = true;
        this.isStrikethroughBtnVisible = true;
        this.isColorToolVisible = true;
        this.isOpacityToolVisible = true;
        this.isDeleteAnnotationToolVisible = true;
        this.isCurrentAnnotationOpacitySet = false;
        this.pdfViewer = viewer;
        this.pdfViewerBase = viewerBase;
        this.primaryToolbar = toolbar;
    }
    /**
     * @private
     */
    AnnotationToolbar.prototype.initializeAnnotationToolbar = function () {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_annotation_toolbar', className: 'e-pv-annotation-toolbar' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
        this.toolbar = new Toolbar({
            width: '', height: '', overflowMode: 'Popup',
            items: this.createToolbarItems(), clicked: this.onToolbarClicked.bind(this),
            created: function () {
                _this.createDropDowns();
            }
        });
        if (this.pdfViewer.enableRtl) {
            this.toolbar.enableRtl = true;
        }
        this.toolbar.appendTo(this.toolbarElement);
        this.afterToolbarCreation();
        this.showAnnotationToolbar(null);
        this.applyAnnotationToolbarSettings();
        this.updateToolbarItems();
    };
    AnnotationToolbar.prototype.createMobileAnnotationToolbar = function (isEnable) {
        var _this = this;
        if (Browser.isDevice) {
            if (this.toolbarElement == null && isEnable) {
                this.isMobileAnnotEnabled = true;
                // tslint:disable-next-line:max-line-length
                this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_annotation_toolbar', className: 'e-pv-annotation-toolbar' });
                this.pdfViewerBase.viewerMainContainer.insertBefore(this.toolbarElement, this.pdfViewerBase.viewerContainer);
                this.toolbar = new Toolbar({
                    width: '', height: '', overflowMode: 'Popup',
                    items: this.createMobileToolbarItems(), clicked: this.onToolbarClicked.bind(this),
                    created: function () {
                        _this.createDropDowns();
                    }
                });
                if (this.pdfViewer.enableRtl) {
                    this.toolbar.enableRtl = true;
                }
                this.pdfViewerBase.navigationPane.goBackToToolbar();
                this.pdfViewer.toolbarModule.showToolbar(false);
                this.toolbar.appendTo(this.toolbarElement);
                this.deleteItem = this.pdfViewerBase.getElement('_annotation_delete');
                this.deleteItem.firstElementChild.id = this.pdfViewer.element.id + '_annotation_delete';
            }
            else if (this.toolbarElement != null) {
                if (isEnable) {
                    this.isMobileAnnotEnabled = true;
                    this.pdfViewerBase.navigationPane.goBackToToolbar();
                    this.pdfViewer.toolbarModule.showToolbar(false);
                    this.toolbarElement.style.display = 'block';
                }
                else if (!isEnable) {
                    this.isMobileAnnotEnabled = false;
                    this.pdfViewer.toolbarModule.showToolbar(true);
                    this.hideMobileAnnotationToolbar();
                }
            }
        }
        else {
            this.isMobileAnnotEnabled = true;
        }
    };
    AnnotationToolbar.prototype.hideMobileAnnotationToolbar = function () {
        if (this.toolbarElement != null) {
            this.toolbarElement.style.display = 'none';
        }
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.createMobileToolbarItems = function () {
        var colorTemplate = this.getTemplate('span', '_annotation_color', 'e-pv-annotation-color-container');
        var opacityTemplate = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        // tslint:disable-next-line
        var items = [];
        items.push({ prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) });
        // tslint:disable-next-line:max-line-length
        items.push({ template: colorTemplate, align: 'right' });
        items.push({ template: opacityTemplate, align: 'right' });
        items.push({ type: 'Separator', align: 'right' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-annotation-delete-icon e-pv-icon', className: 'e-pv-annotation-delete-container', id: this.pdfViewer.element.id + '_annotation_delete', align: 'right' });
        return items;
    };
    AnnotationToolbar.prototype.goBackToToolbar = function () {
        this.isMobileAnnotEnabled = false;
        this.hideMobileAnnotationToolbar();
        this.pdfViewer.toolbarModule.showToolbar(true);
        var page = this.pdfViewerBase.getSelectTextMarkupCurrentPage();
        if (page) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearAnnotationSelection(page);
        }
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.createToolbarItems = function () {
        var colorTemplate = this.getTemplate('span', '_annotation_color', 'e-pv-annotation-color-container');
        var opacityTemplate = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        // tslint:disable-next-line
        var items = [];
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-highlight-icon e-pv-icon', className: 'e-pv-highlight-container', id: this.pdfViewer.element.id + '_highlight', align: 'Left' });
        items.push({ prefixIcon: 'e-pv-underline-icon e-pv-icon', className: 'e-pv-underline-container', id: this.pdfViewer.element.id + '_underline', align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-strikethrough-icon e-pv-icon', className: 'e-pv-strikethrough-container', id: this.pdfViewer.element.id + '_strikethrough', align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        items.push({ template: colorTemplate, align: 'Left' });
        items.push({ template: opacityTemplate, align: 'Left' });
        items.push({ type: 'Separator', align: 'Left' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-annotation-delete-icon e-pv-icon', className: 'e-pv-annotation-delete-container', id: this.pdfViewer.element.id + '_annotation_delete', align: 'Left' });
        items.push({ prefixIcon: 'e-pv-annotation-tools-close-icon e-pv-icon', className: 'e-pv-annotation-tools-close-container', id: this.pdfViewer.element.id + '_annotation_close', align: 'Right' });
        return items;
    };
    AnnotationToolbar.prototype.getTemplate = function (elementName, id, className) {
        var element = createElement(elementName, { id: this.pdfViewer.element.id + id });
        if (className) {
            element.className = className;
        }
        return element.outerHTML;
    };
    AnnotationToolbar.prototype.createDropDowns = function () {
        this.colorDropDownElement = this.pdfViewerBase.getElement('_annotation_color');
        this.colorPalette = this.createColorPicker(this.colorDropDownElement.id);
        // tslint:disable-next-line:max-line-length
        this.colorDropDown = this.createDropDownButton(this.colorDropDownElement, 'e-pv-annotation-color-icon', this.colorPalette.element.parentElement, this.pdfViewer.localeObj.getConstant('Color edit'));
        this.colorDropDown.beforeOpen = this.colorDropDownBeforeOpen.bind(this);
        this.colorDropDown.open = this.colorDropDownOpen.bind(this);
        this.pdfViewerBase.getElement('_annotation_color-popup').addEventListener('click', this.onColorPickerCancelClick.bind(this));
        this.opacityDropDownElement = this.pdfViewerBase.getElement('_annotation_opacity');
        var sliderContainer = this.createSlider(this.opacityDropDownElement.id);
        // tslint:disable-next-line:max-line-length
        this.opacityDropDown = this.createDropDownButton(this.opacityDropDownElement, 'e-pv-annotation-opacity-icon', sliderContainer, this.pdfViewer.localeObj.getConstant('Opacity edit'));
        this.opacityDropDown.beforeOpen = this.opacityDropDownBeforeOpen.bind(this);
        this.opacitySlider.change = this.opacityChange.bind(this);
        this.opacitySlider.changed = this.opacityChange.bind(this);
        this.opacityDropDown.open = this.opacityDropDownOpen.bind(this);
    };
    AnnotationToolbar.prototype.opacityDropDownOpen = function () {
        if (Browser.isDevice) {
            // tslint:disable-next-line:max-line-length
            var opacityElement = this.pdfViewerBase.getElement('_annotation_opacity-popup');
            opacityElement.style.left = '0px';
        }
    };
    AnnotationToolbar.prototype.onColorPickerCancelClick = function (event) {
        if (event.target.classList.contains('e-cancel')) {
            this.colorDropDown.toggle();
        }
    };
    AnnotationToolbar.prototype.colorDropDownBeforeOpen = function (args) {
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.colorPalette.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation.color;
            }
            else {
                this.setCurrentColorInPicker();
            }
        }
        this.colorPalette.refresh();
        this.updateColorInIcon(this.colorDropDownElement, this.colorPalette.value);
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.setCurrentColorInPicker = function () {
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            switch (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode) {
                case 'Highlight':
                    // tslint:disable-next-line:max-line-length
                    this.colorPalette.setProperties({ 'value': this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightColor }, true);
                    break;
                case 'Underline':
                    // tslint:disable-next-line:max-line-length
                    this.colorPalette.setProperties({ 'value': this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineColor }, true);
                    break;
                case 'Strikethrough':
                    // tslint:disable-next-line:max-line-length
                    this.colorPalette.setProperties({ 'value': this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughColor }, true);
                    break;
            }
        }
        this.updateColorInIcon(this.colorDropDownElement, this.colorPalette.value);
    };
    AnnotationToolbar.prototype.colorDropDownOpen = function () {
        if (Browser.isDevice) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.getElement('_annotation_color-popup').style.left = '0px';
        }
        this.colorPalette.refresh();
    };
    AnnotationToolbar.prototype.opacityChange = function (args) {
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                if (this.isCurrentAnnotationOpacitySet && args.name === 'changed') {
                    this.isCurrentAnnotationOpacitySet = false;
                }
                else {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyOpacityProperty(args);
                }
            }
            else {
                switch (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode) {
                    case 'Highlight':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightOpacity = args.value / 100;
                        break;
                    case 'Underline':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineOpacity = args.value / 100;
                        break;
                    case 'Strikethrough':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughOpacity = args.value / 100;
                        break;
                }
            }
        }
        this.updateOpacityIndicator();
    };
    AnnotationToolbar.prototype.opacityDropDownBeforeOpen = function (args) {
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.isCurrentAnnotationOpacitySet = true;
                // tslint:disable-next-line:max-line-length
                this.opacitySlider.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation.opacity * 100;
            }
            else {
                switch (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode) {
                    case 'Highlight':
                        this.opacitySlider.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightOpacity * 100;
                        break;
                    case 'Underline':
                        this.opacitySlider.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineOpacity * 100;
                        break;
                    case 'Strikethrough':
                        this.opacitySlider.value = this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughOpacity * 100;
                        break;
                }
            }
        }
        this.updateOpacityIndicator();
    };
    AnnotationToolbar.prototype.createDropDownButton = function (element, iconClass, target, tooltipText) {
        // tslint:disable-next-line:max-line-length
        var dropDownButton = new DropDownButton({ iconCss: iconClass + ' e-pv-icon', target: target });
        if (this.pdfViewer.enableRtl) {
            dropDownButton.enableRtl = true;
        }
        dropDownButton.appendTo(element);
        this.primaryToolbar.createTooltip(element, tooltipText);
        return dropDownButton;
    };
    AnnotationToolbar.prototype.createColorPicker = function (idString) {
        var inputElement = createElement('input', { id: idString + '_target' });
        document.body.appendChild(inputElement);
        var colorPicker = new ColorPicker({
            inline: true, mode: 'Palette', cssClass: 'e-show-value', enableOpacity: false,
            change: this.onColorPickerChange.bind(this), value: '#000000', showButtons: false,
        });
        if (this.pdfViewer.enableRtl) {
            colorPicker.enableRtl = true;
        }
        colorPicker.appendTo(inputElement);
        return colorPicker;
    };
    AnnotationToolbar.prototype.onColorPickerChange = function (args) {
        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.modifyColorProperty(args.currentValue.hex);
            }
            else {
                switch (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode) {
                    case 'Highlight':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightColor = args.currentValue.hex;
                        break;
                    case 'Underline':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineColor = args.currentValue.hex;
                        break;
                    case 'Strikethrough':
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughColor = args.currentValue.hex;
                        break;
                }
            }
        }
        this.updateColorInIcon(this.colorDropDownElement, args.currentValue.hex);
        this.colorDropDown.toggle();
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.updateColorInIcon = function (element, color) {
        element.childNodes[0].style.borderBottomColor = color;
    };
    AnnotationToolbar.prototype.updateOpacityIndicator = function () {
        this.opacityIndicator.textContent = this.opacitySlider.value + '%';
    };
    AnnotationToolbar.prototype.createSlider = function (idString) {
        var outerContainer = createElement('div', { className: 'e-pv-annotation-opacity-popup-container' });
        document.body.appendChild(outerContainer);
        var label = createElement('span', { id: idString + '_label', className: 'e-pv-annotation-opacity-label' });
        label.textContent = this.pdfViewer.localeObj.getConstant('Opacity');
        var sliderElement = createElement('div', { id: idString + '_slider' });
        this.opacitySlider = new Slider({ type: 'MinRange', cssClass: 'e-pv-annotation-opacity-slider', max: 100, min: 0 });
        // tslint:disable-next-line:max-line-length
        this.opacityIndicator = createElement('div', { id: idString + '_opacity_indicator', className: 'e-pv-annotation-opacity-indicator' });
        this.opacityIndicator.textContent = '100%';
        if (!this.pdfViewer.enableRtl) {
            outerContainer.appendChild(label);
            outerContainer.appendChild(sliderElement);
            this.opacitySlider.appendTo(sliderElement);
            this.opacitySlider.element.parentElement.classList.add('e-pv-annotation-opacity-slider-container');
            outerContainer.appendChild(this.opacityIndicator);
        }
        else {
            outerContainer.appendChild(this.opacityIndicator);
            outerContainer.appendChild(sliderElement);
            this.opacitySlider.enableRtl = true;
            this.opacitySlider.appendTo(sliderElement);
            this.opacitySlider.element.parentElement.classList.add('e-pv-annotation-opacity-slider-container');
            outerContainer.appendChild(label);
        }
        return outerContainer;
    };
    AnnotationToolbar.prototype.afterToolbarCreation = function () {
        // tslint:disable-next-line:max-line-length
        this.highlightItem = this.primaryToolbar.addClassToolbarItem('_highlight', 'e-pv-highlight', this.pdfViewer.localeObj.getConstant('Highlight'));
        this.underlineItem = this.primaryToolbar.addClassToolbarItem('_underline', 'e-pv-underline', this.pdfViewer.localeObj.getConstant('Underline'));
        // tslint:disable-next-line:max-line-length
        this.strikethroughItem = this.primaryToolbar.addClassToolbarItem('_strikethrough', 'e-pv-strikethrough', this.pdfViewer.localeObj.getConstant('Strikethrough'));
        this.deleteItem = this.primaryToolbar.addClassToolbarItem('_annotation_delete', 'e-pv-annotation-delete', this.pdfViewer.localeObj.getConstant('Delete'));
        this.closeItem = this.primaryToolbar.addClassToolbarItem('_annotation_close', 'e-pv-annotation-tools-close', null);
        this.selectAnnotationDeleteItem(false);
        this.enableAnnotationPropertiesTools(false);
    };
    AnnotationToolbar.prototype.onToolbarClicked = function (args) {
        switch (args.originalEvent.target.id) {
            case this.pdfViewer.element.id + '_highlight':
            case this.pdfViewer.element.id + '_highlightIcon':
                this.handleHighlight();
                break;
            case this.pdfViewer.element.id + '_underline':
            case this.pdfViewer.element.id + '_underlineIcon':
                this.handleUnderline();
                break;
            case this.pdfViewer.element.id + '_strikethrough':
            case this.pdfViewer.element.id + '_strikethroughIcon':
                this.handleStrikethrough();
                break;
            case this.pdfViewer.element.id + '_annotation_delete':
            case this.pdfViewer.element.id + '_annotation_deleteIcon':
                this.pdfViewer.annotationModule.deleteAnnotation();
                break;
            case this.pdfViewer.element.id + '_annotation_close':
            case this.pdfViewer.element.id + '_annotation_closeIcon':
                this.showAnnotationToolbar(this.primaryToolbar.annotationItem);
                break;
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.showAnnotationToolbar = function (element) {
        if (!this.isToolbarHidden) {
            // tslint:disable-next-line
            var annotationModule = this.pdfViewer.annotationModule;
            if (element) {
                this.adjustViewer(false);
                this.primaryToolbar.deSelectItem(element);
            }
            // tslint:disable-next-line:max-line-length           
            if (annotationModule && annotationModule.textMarkupAnnotationModule && annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                this.enablePropertiesTool(annotationModule);
            }
            else {
                this.deselectAllItems();
            }
            this.toolbarElement.style.display = 'none';
            this.primaryToolbar.updateInteractionTools(true);
        }
        else {
            var toolBarInitialStatus = this.toolbarElement.style.display;
            this.toolbarElement.style.display = 'block';
            if (element) {
                this.primaryToolbar.selectItem(element);
                if (toolBarInitialStatus === 'none') {
                    this.primaryToolbar.DisableInteractionTools();
                    this.adjustViewer(true);
                }
            }
        }
        // tslint:disable-next-line:max-line-length           
        if (this.pdfViewer.magnification && this.pdfViewer.magnification.fitType === 'fitToPage') {
            this.pdfViewer.magnification.fitToPage();
        }
        if (this.pdfViewerBase.isPanMode) {
            this.enableAnnotationAddTools(false);
        }
        else {
            this.enableAnnotationAddTools(true);
        }
        this.isToolbarHidden = !this.isToolbarHidden;
    };
    // tslint:disable-next-line
    AnnotationToolbar.prototype.enablePropertiesTool = function (annotationModule) {
        this.isHighlightEnabled = false;
        this.isUnderlineEnabled = false;
        this.isStrikethroughEnabled = false;
        if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
            annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
        }
        this.primaryToolbar.deSelectItem(this.highlightItem);
        this.primaryToolbar.deSelectItem(this.underlineItem);
        this.primaryToolbar.deSelectItem(this.strikethroughItem);
        this.enableAnnotationPropertiesTools(true);
        // tslint:disable-next-line:max-line-length  
        this.updateColorInIcon(this.colorDropDownElement, annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation.color);
        this.selectAnnotationDeleteItem(true);
    };
    AnnotationToolbar.prototype.applyAnnotationToolbarSettings = function () {
        if (this.pdfViewer.annotationToolbarSettings.annotationToolbarItem.indexOf('HighlightTool') !== -1) {
            this.showHighlightTool(true);
        }
        else {
            this.showHighlightTool(false);
        }
        if (this.pdfViewer.annotationToolbarSettings.annotationToolbarItem.indexOf('UnderlineTool') !== -1) {
            this.showUnderlineTool(true);
        }
        else {
            this.showUnderlineTool(false);
        }
        if (this.pdfViewer.annotationToolbarSettings.annotationToolbarItem.indexOf('StrikethroughTool') !== -1) {
            this.showStrikethroughTool(true);
        }
        else {
            this.showStrikethroughTool(false);
        }
        if (this.pdfViewer.annotationToolbarSettings.annotationToolbarItem.indexOf('ColorEditTool') !== -1) {
            this.showColorEditTool(true);
        }
        else {
            this.showColorEditTool(false);
        }
        if (this.pdfViewer.annotationToolbarSettings.annotationToolbarItem.indexOf('OpacityEditTool') !== -1) {
            this.showOpacityEditTool(true);
        }
        else {
            this.showOpacityEditTool(false);
        }
        if (this.pdfViewer.annotationToolbarSettings.annotationToolbarItem.indexOf('AnnotationDeleteTool') !== -1) {
            this.showAnnotationDeleteTool(true);
        }
        else {
            this.showAnnotationDeleteTool(false);
        }
        this.showSeparator();
    };
    AnnotationToolbar.prototype.showSeparator = function () {
        if ((!this.isHighlightBtnVisible && !this.isUnderlineBtnVisible && !this.isStrikethroughBtnVisible)
            || (!this.isColorToolVisible && !this.isOpacityToolVisible)) {
            this.applyHideToToolbar(false, 3, 3);
        }
        if ((!this.isColorToolVisible && !this.isOpacityToolVisible) && (!this.isHighlightBtnVisible &&
            !this.isUnderlineBtnVisible && !this.isStrikethroughBtnVisible) || !this.isDeleteAnnotationToolVisible) {
            this.applyHideToToolbar(false, 6, 6);
        }
    };
    AnnotationToolbar.prototype.showHighlightTool = function (isShow) {
        this.isHighlightBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 0, 0);
    };
    AnnotationToolbar.prototype.showUnderlineTool = function (isShow) {
        this.isUnderlineBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 1, 1);
    };
    AnnotationToolbar.prototype.showStrikethroughTool = function (isShow) {
        this.isStrikethroughBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 2, 2);
    };
    AnnotationToolbar.prototype.showColorEditTool = function (isShow) {
        this.isColorToolVisible = isShow;
        this.applyHideToToolbar(isShow, 4, 4);
    };
    AnnotationToolbar.prototype.showOpacityEditTool = function (isShow) {
        this.isOpacityToolVisible = isShow;
        this.applyHideToToolbar(isShow, 5, 5);
    };
    AnnotationToolbar.prototype.showAnnotationDeleteTool = function (isShow) {
        this.isDeleteAnnotationToolVisible = isShow;
        this.applyHideToToolbar(isShow, 7, 7);
    };
    AnnotationToolbar.prototype.applyHideToToolbar = function (show, startIndex, endIndex) {
        var isHide = !show;
        for (var index = startIndex; index <= endIndex; index++) {
            this.toolbar.hideItem(index, isHide);
        }
    };
    AnnotationToolbar.prototype.adjustViewer = function (isAdjust) {
        var splitterElement = this.pdfViewerBase.getElement('_sideBarToolbarSplitter');
        var toolbarContainer = this.pdfViewerBase.getElement('_toolbarContainer');
        var toolbarHeight = this.getToolbarHeight(toolbarContainer);
        var annotationToolbarHeight = this.getToolbarHeight(this.toolbarElement);
        var sideBarToolbar = this.pdfViewerBase.navigationPane.sideBarToolbar;
        var sideBarContentContainer = this.pdfViewerBase.navigationPane.sideBarContentContainer;
        if (isAdjust) {
            // tslint:disable-next-line:max-line-length
            sideBarToolbar.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
            sideBarContentContainer.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
            splitterElement.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.viewerContainer.style.height = this.updateViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), (annotationToolbarHeight)) + 'px';
            sideBarToolbar.style.height = sideBarToolbar.getBoundingClientRect().height - annotationToolbarHeight + 'px';
            splitterElement.style.height = splitterElement.getBoundingClientRect().height - annotationToolbarHeight + 'px';
        }
        else {
            // tslint:disable-next-line:max-line-length
            sideBarToolbar.style.top = toolbarHeight + 'px';
            sideBarContentContainer.style.top = toolbarHeight + 'px';
            splitterElement.style.top = toolbarHeight + 'px';
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.viewerContainer.style.height = this.resetViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), annotationToolbarHeight) + 'px';
            sideBarToolbar.style.height = this.getHeight(sideBarToolbar, annotationToolbarHeight);
            splitterElement.style.height = this.getHeight(splitterElement, annotationToolbarHeight);
        }
        this.updateContentContainerHeight(isAdjust);
    };
    AnnotationToolbar.prototype.updateContentContainerHeight = function (isAdjust) {
        var annotationToolbarHeight = this.getToolbarHeight(this.toolbarElement);
        var sideBarClientRect = this.pdfViewerBase.navigationPane.sideBarContentContainer.getBoundingClientRect();
        if (sideBarClientRect.height !== 0) {
            if (isAdjust) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewerBase.navigationPane.sideBarContentContainer.style.height = sideBarClientRect.height - annotationToolbarHeight + 'px';
            }
            else {
                // tslint:disable-next-line:max-line-length
                this.pdfViewerBase.navigationPane.sideBarContentContainer.style.height = sideBarClientRect.height + annotationToolbarHeight + 'px';
            }
        }
    };
    AnnotationToolbar.prototype.getToolbarHeight = function (element) {
        var toolbarHeight = element.getBoundingClientRect().height;
        if (toolbarHeight === 0 && element === this.pdfViewerBase.getElement('_toolbarContainer')) {
            // getComputedStyle gets the value from style and toolbar border height is added to it.
            // tslint:disable-next-line
            toolbarHeight = parseFloat(window.getComputedStyle(element)['height']) + this.toolbarBorderHeight;
        }
        return toolbarHeight;
    };
    AnnotationToolbar.prototype.getHeight = function (element, toolbarHeight) {
        var height = element.getBoundingClientRect().height;
        return (height !== 0) ? height + toolbarHeight + 'px' : '';
    };
    AnnotationToolbar.prototype.handleHighlight = function () {
        if (!this.isHighlightEnabled) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations('Highlight');
            this.primaryToolbar.selectItem(this.highlightItem);
            this.primaryToolbar.deSelectItem(this.underlineItem);
            this.primaryToolbar.deSelectItem(this.strikethroughItem);
            this.enableAnnotationPropertiesTools(true);
            this.updateColorInIcon(this.colorDropDownElement, this.pdfViewer.annotationModule.textMarkupAnnotationModule.highlightColor);
            this.isHighlightEnabled = true;
            this.isUnderlineEnabled = false;
            this.isStrikethroughEnabled = false;
        }
        else {
            this.deselectAllItems();
        }
    };
    AnnotationToolbar.prototype.handleUnderline = function () {
        if (!this.isUnderlineEnabled) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations('Underline');
            this.primaryToolbar.selectItem(this.underlineItem);
            this.primaryToolbar.deSelectItem(this.highlightItem);
            this.primaryToolbar.deSelectItem(this.strikethroughItem);
            this.enableAnnotationPropertiesTools(true);
            this.updateColorInIcon(this.colorDropDownElement, this.pdfViewer.annotationModule.textMarkupAnnotationModule.underlineColor);
            this.isUnderlineEnabled = true;
            this.isHighlightEnabled = false;
            this.isStrikethroughEnabled = false;
        }
        else {
            this.deselectAllItems();
        }
    };
    AnnotationToolbar.prototype.handleStrikethrough = function () {
        if (!this.isStrikethroughEnabled) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations('Strikethrough');
            this.primaryToolbar.selectItem(this.strikethroughItem);
            this.primaryToolbar.deSelectItem(this.highlightItem);
            this.primaryToolbar.deSelectItem(this.underlineItem);
            this.enableAnnotationPropertiesTools(true);
            // tslint:disable-next-line:max-line-length
            this.updateColorInIcon(this.colorDropDownElement, this.pdfViewer.annotationModule.textMarkupAnnotationModule.strikethroughColor);
            this.isStrikethroughEnabled = true;
            this.isHighlightEnabled = false;
            this.isUnderlineEnabled = false;
        }
        else {
            this.deselectAllItems();
        }
    };
    AnnotationToolbar.prototype.deselectAllItems = function () {
        this.isHighlightEnabled = false;
        this.isUnderlineEnabled = false;
        this.isStrikethroughEnabled = false;
        if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
        }
        this.primaryToolbar.deSelectItem(this.highlightItem);
        this.primaryToolbar.deSelectItem(this.underlineItem);
        this.primaryToolbar.deSelectItem(this.strikethroughItem);
        this.enableAnnotationPropertiesTools(false);
        this.updateColorInIcon(this.colorDropDownElement, '#000000');
        this.selectAnnotationDeleteItem(false);
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.selectAnnotationDeleteItem = function (isEnable) {
        this.toolbar.enableItems(this.deleteItem.parentElement, isEnable);
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.enableAnnotationPropertiesTools = function (isEnable) {
        this.toolbar.enableItems(this.colorDropDownElement.parentElement, isEnable);
        this.toolbar.enableItems(this.opacityDropDownElement.parentElement, isEnable);
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.enableAnnotationAddTools = function (isEnable) {
        this.toolbar.enableItems(this.highlightItem.parentElement, isEnable);
        this.toolbar.enableItems(this.underlineItem.parentElement, isEnable);
        this.toolbar.enableItems(this.strikethroughItem.parentElement, isEnable);
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.isAnnotationButtonsEnabled = function () {
        var isButtonsEnabled = false;
        if (this.isHighlightEnabled || this.isUnderlineEnabled || this.isStrikethroughEnabled) {
            isButtonsEnabled = true;
        }
        return isButtonsEnabled;
    };
    AnnotationToolbar.prototype.updateToolbarItems = function () {
        if (this.pdfViewer.enableTextMarkupAnnotation) {
            this.enableAnnotationAddTools(true);
        }
        else {
            this.enableAnnotationAddTools(false);
        }
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.resetToolbar = function () {
        this.adjustViewer(false);
        this.updateToolbarItems();
        this.toolbarElement.style.display = 'none';
        this.isToolbarHidden = true;
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.clear = function () {
        this.deselectAllItems();
    };
    /**
     * @private
     */
    AnnotationToolbar.prototype.destroy = function () {
        this.colorDropDown.destroy();
        this.opacityDropDown.destroy();
        this.toolbar.destroy();
    };
    AnnotationToolbar.prototype.getElementHeight = function (element) {
        return element.getBoundingClientRect().height;
    };
    AnnotationToolbar.prototype.updateViewerHeight = function (viewerHeight, toolbarHeight) {
        return viewerHeight - toolbarHeight;
    };
    AnnotationToolbar.prototype.resetViewerHeight = function (viewerHeight, toolbarHeight) {
        return viewerHeight + toolbarHeight;
    };
    return AnnotationToolbar;
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
 * The `AnnotationToolbarSettings` module is used to provide the annotation toolbar settings of the PDF viewer.
 */
var AnnotationToolbarSettings = /** @__PURE__ @class */ (function (_super) {
    __extends(AnnotationToolbarSettings, _super);
    function AnnotationToolbarSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(true)
    ], AnnotationToolbarSettings.prototype, "showTooltip", void 0);
    __decorate([
        Property()
    ], AnnotationToolbarSettings.prototype, "annotationToolbarItem", void 0);
    return AnnotationToolbarSettings;
}(ChildProperty));
/**
 * The `ServerActionSettings` module is used to provide the server action methods of PDF viewer.
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
 * The `StrikethroughSettings` module is used to provide the properties to Strikethrough annotation.
 */
var StrikethroughSettings = /** @__PURE__ @class */ (function (_super) {
    __extends(StrikethroughSettings, _super);
    function StrikethroughSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], StrikethroughSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ff0000')
    ], StrikethroughSettings.prototype, "color", void 0);
    __decorate([
        Property('Guest')
    ], StrikethroughSettings.prototype, "author", void 0);
    __decorate([
        Property('strikethrough')
    ], StrikethroughSettings.prototype, "subject", void 0);
    __decorate([
        Property('')
    ], StrikethroughSettings.prototype, "modifiedDate", void 0);
    return StrikethroughSettings;
}(ChildProperty));
/**
 * The `UnderlineSettings` module is used to provide the properties to Underline annotation.
 */
var UnderlineSettings = /** @__PURE__ @class */ (function (_super) {
    __extends(UnderlineSettings, _super);
    function UnderlineSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], UnderlineSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#00ff00')
    ], UnderlineSettings.prototype, "color", void 0);
    __decorate([
        Property('Guest')
    ], UnderlineSettings.prototype, "author", void 0);
    __decorate([
        Property('underline')
    ], UnderlineSettings.prototype, "subject", void 0);
    __decorate([
        Property('')
    ], UnderlineSettings.prototype, "modifiedDate", void 0);
    return UnderlineSettings;
}(ChildProperty));
/**
 * The `HighlightSettings` module is used to provide the properties to Highlight annotation.
 */
var HighlightSettings = /** @__PURE__ @class */ (function (_super) {
    __extends(HighlightSettings, _super);
    function HighlightSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(1)
    ], HighlightSettings.prototype, "opacity", void 0);
    __decorate([
        Property('#ffff00')
    ], HighlightSettings.prototype, "color", void 0);
    __decorate([
        Property('Guest')
    ], HighlightSettings.prototype, "author", void 0);
    __decorate([
        Property('highlight')
    ], HighlightSettings.prototype, "subject", void 0);
    __decorate([
        Property('')
    ], HighlightSettings.prototype, "modifiedDate", void 0);
    return HighlightSettings;
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
            'Download file': 'Download file',
            'Download': 'Download',
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
            'Apply': 'Apply',
            'GoToPage': 'Go to Page',
            // tslint:disable-next-line:max-line-length
            'No matches': 'Viewer has finished searching the document. No more matches were found',
            'No Text Found': 'No Text Found',
            'Undo': 'Undo',
            'Redo': 'Redo',
            'Annotation': 'Add or Edit annotations',
            'Highlight': 'Highlight Text',
            'Underline': 'Underline Text',
            'Strikethrough': 'Strikethrough Text',
            'Delete': 'Delete annotation',
            'Opacity': 'Opacity',
            'Color edit': 'Change Color',
            'Opacity edit': 'Change Opacity',
            'Highlight context': 'Highlight',
            'Underline context': 'Underline',
            'Strikethrough context': 'Strike through',
            // tslint:disable-next-line:max-line-length
            'Server error': 'Web-service is not listening. PDF Viewer depends on web-service for all it\'s features. Please start the web service to continue.',
            'Open text': 'Open',
            'First text': 'First Page',
            'Previous text': 'Previous Page',
            'Next text': 'Next Page',
            'Last text': 'Last Page',
            'Zoom in text': 'Zoom In',
            'Zoom out text': 'Zoom Out',
            'Selection text': 'Selection',
            'Pan text': 'Pan',
            'Print text': 'Print',
            'Search text': 'Search',
            'Annotation Edit text': 'Edit Annotation'
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
    Object.defineProperty(PdfViewer.prototype, "isDocumentEdited", {
        /**
         * Checks whether the PDF document is edited.
         */
        get: function () {
            return this.viewerBase.isDocumentEdited;
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
    Object.defineProperty(PdfViewer.prototype, "annotation", {
        /**
         * Gets the annotation object of the pdf viewer.
         * @returns { Annotation }
         */
        get: function () {
            return this.annotationModule;
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
        if (this.enableAnnotation) {
            modules.push({
                member: 'Annotation', args: [this, this.viewerBase]
            });
        }
        return modules;
    };
    /**
     * Loads the given PDF document in the PDF viewer control
     * @param  {string} document - Specifies the document name for load
     * @param  {string} password - Specifies the Given document password
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
    /**
     * Downloads the PDF document being loaded in the ejPdfViewer control.
     * @returns void
     */
    PdfViewer.prototype.download = function () {
        if (this.enableDownload) {
            this.viewerBase.download();
        }
    };
    /**
     * Perform undo action for the edited annotations
     * @returns void
     */
    PdfViewer.prototype.undo = function () {
        if (this.annotationModule) {
            this.annotationModule.undo();
        }
    };
    /**
     * Perform redo action for the edited annotations
     * @returns void
     */
    PdfViewer.prototype.redo = function () {
        if (this.annotationModule) {
            this.annotationModule.redo();
        }
    };
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
        if (this.toolbarModule) {
            this.toolbarModule.destroy();
        }
        if (!isNullOrUndefined(this.element)) {
            this.element.classList.remove('e-pdfviewer');
            this.element.innerHTML = '';
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
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewer.prototype.fireAnnotationAdd = function (pageNumber, index, type, bounds, settings) {
        var eventArgs = { name: 'annotationAdd', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBound: bounds, annotationSettings: settings };
        this.trigger('annotationAdd', eventArgs);
    };
    /**
     * @private
     */
    PdfViewer.prototype.fireAnnotationRemove = function (pageNumber, index, type) {
        // tslint:disable-next-line:max-line-length
        var eventArgs = { name: 'annotationRemove', pageIndex: pageNumber, annotationId: index, annotationType: type };
        this.trigger('annotationRemove', eventArgs);
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    PdfViewer.prototype.fireAnnotationPropertiesChange = function (pageNumber, index, type, isColorChanged, isOpacityChanged) {
        var eventArgs = { name: 'annotationPropertiesChange', pageIndex: pageNumber, annotationId: index, annotationType: type, isColorChanged: isColorChanged, isOpacityChanged: isOpacityChanged };
        this.trigger('annotationPropertiesChange', eventArgs);
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
    ], PdfViewer.prototype, "enableNavigationToolbar", void 0);
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
        Property(true)
    ], PdfViewer.prototype, "enableAnnotation", void 0);
    __decorate([
        Property(true)
    ], PdfViewer.prototype, "enableTextMarkupAnnotation", void 0);
    __decorate([
        Property('TextSelection')
    ], PdfViewer.prototype, "interactionMode", void 0);
    __decorate([
        Property({ showTooltip: true, toolbarItem: ['OpenOption', 'UndoRedoTool', 'PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'CommentOption', 'AnnotationEditTool', 'FreeTextAnnotationOption', 'InkAnnotationOption', 'ShapeAnnotationOption', 'StampAnnotation', 'SignatureOption', 'SearchOption', 'PrintOption', 'DownloadOption'] })
    ], PdfViewer.prototype, "toolbarSettings", void 0);
    __decorate([
        Property({ showTooltip: true, annotationToolbarItem: ['HighlightTool', 'UnderlineTool', 'StrikethroughTool', 'ColorEditTool', 'OpacityEditTool', 'AnnotationDeleteTool'] })
    ], PdfViewer.prototype, "annotationToolbarSettings", void 0);
    __decorate([
        Property({ load: 'Load', renderPages: 'RenderPdfPages', unload: 'Unload', download: 'Download', renderThumbnail: 'RenderThumbnailImages' })
    ], PdfViewer.prototype, "serverActionSettings", void 0);
    __decorate([
        Property({ opacity: 1, color: '#FFDF56', author: 'Guest', subject: 'Highlight', modifiedDate: '' })
    ], PdfViewer.prototype, "highlightSettings", void 0);
    __decorate([
        Property({ opacity: 1, color: '#ff0000', author: 'Guest', subject: 'Strikethrough', modifiedDate: '' })
    ], PdfViewer.prototype, "strikethroughSettings", void 0);
    __decorate([
        Property({ opacity: 1, color: '#00ff00', author: 'Guest', subject: 'Underline', modifiedDate: '' })
    ], PdfViewer.prototype, "underlineSettings", void 0);
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
    __decorate([
        Event()
    ], PdfViewer.prototype, "annotationAdd", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "annotationRemove", void 0);
    __decorate([
        Event()
    ], PdfViewer.prototype, "annotationPropertiesChange", void 0);
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
        /**
         * @private
         */
        this.childNavigateCount = 0;
        // tslint:disable-next-line
        this.bookmarkClick = function (args) {
            // tslint:disable-next-line
            if (!args.event.target.classList.contains('e-icons')) {
                var bookid = args.data.Id;
                _this.childNavigateCount = 0;
                _this.pdfViewerBase.navigationPane.goBackToToolbar();
                _this.navigateToBookmark(bookid);
            }
            else {
                _this.childNavigateCount++;
            }
            return false;
        };
        this.nodeClick = function (args) {
            _this.setHeight(args.node);
            var bookid = Number(args.nodeData.id);
            _this.navigateToBookmark(bookid);
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
                if (_this.pdfViewerBase.navigationPane) {
                    _this.pdfViewerBase.navigationPane.disableBookmarkButton();
                }
                // tslint:disable-next-line
                var data = event.currentTarget.response;
                if (data) {
                    if (typeof data !== 'object') {
                        data = JSON.parse(data);
                    }
                    _this.bookmarks = { bookMark: data.Bookmarks };
                    _this.bookmarksDestination = { bookMarkDestination: data.BookmarksDestination };
                }
                if (_this.pdfViewerBase.navigationPane) {
                    if (_this.bookmarks == null) {
                        _this.pdfViewerBase.navigationPane.disableBookmarkButton();
                    }
                    else {
                        _this.pdfViewerBase.navigationPane.enableBookmarkButton();
                        _this.isBookmarkViewDiv = false;
                    }
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
        var _this = this;
        if (!this.isBookmarkViewDiv) {
            this.bookmarkView = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_view', className: 'e-pv-bookmark-view' });
            this.pdfViewerBase.navigationPane.sideBarContent.appendChild(this.bookmarkView);
            // tslint:disable-next-line:max-line-length
            var bookmarkIconView = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_iconview', className: 'e-pv-bookmark-icon-view' });
            // tslint:disable-next-line:max-line-length
            if (!this.pdfViewer.enableRtl) {
                // tslint:disable-next-line:max-line-length
                var bookmarkIcon = createElement('span', { id: this.pdfViewer.element.id + '_bookmark_icon', className: 'e-pv-bookmark-icon e-pv-icon' });
                bookmarkIconView.appendChild(bookmarkIcon);
            }
            else {
                // tslint:disable-next-line:max-line-length
                var bookmarkIcon = createElement('span', { id: this.pdfViewer.element.id + '_bookmark_icon', className: 'e-pv-bookmark-icon e-pv-icon e-right' });
                bookmarkIconView.appendChild(bookmarkIcon);
            }
            // tslint:disable-next-line:max-line-length
            var bookmarkTitle = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_Title', className: 'e-pv-bookmark-Title' });
            if (this.pdfViewer.enableRtl) {
                bookmarkTitle.style.paddingRight = 26 + 'px';
            }
            else {
                bookmarkTitle.style.paddingLeft = 40 + 'px';
            }
            bookmarkTitle.innerText = '${Title}';
            bookmarkIconView.appendChild(bookmarkTitle);
            // tslint:disable-next-line:max-line-length
            this.treeObj = new TreeView({
                fields: {
                    dataSource: this.bookmarks.bookMark,
                    id: 'Id',
                    text: 'Title',
                    child: 'Child',
                    hasChildren: 'HasChild',
                },
                nodeTemplate: bookmarkIconView.outerHTML,
                nodeSelected: this.nodeClick.bind(this),
            });
            if (this.pdfViewer.enableRtl) {
                this.treeObj.enableRtl = true;
            }
            this.treeObj.appendTo(this.bookmarkView);
            ['mouseover', 'keydown'].forEach(function (evt) { return _this.bookmarkView.addEventListener(evt, function (event) {
                _this.setHeight(event.target);
            }); });
            this.isBookmarkViewDiv = true;
        }
        this.bookmarkView.style.display = 'block';
    };
    /**
     * @private
     */
    BookmarkView.prototype.renderBookmarkContentMobile = function () {
        if (this.bookmarkView != null) {
            this.bookmarkView.remove();
        }
        this.bookmarkView = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_view', className: 'e-pv-bookmark-view' });
        this.pdfViewerBase.getElement('_bookmarks_container').appendChild(this.bookmarkView);
        this.bookmarkList = new ListView({
            dataSource: this.bookmarks.bookMark,
            fields: {
                id: 'Id',
                text: 'Title',
                child: 'Child'
            },
            showHeader: false,
            select: this.bookmarkClick.bind(this)
        });
        if (this.pdfViewer.enableRtl) {
            this.bookmarkList.enableRtl = true;
        }
        this.bookmarkList.appendTo(this.bookmarkView);
    };
    // tslint:disable-next-line
    BookmarkView.prototype.setHeight = function (element) {
        if (this.treeObj.fullRowSelect) {
            if (element.classList.contains('e-treeview')) {
                element = element.querySelector('.e-node-focus').querySelector('.e-fullrow');
            }
            else if (element.classList.contains('e-list-parent')) {
                element = element.querySelector('.e-fullrow');
            }
            else if (element.classList.value !== ('e-fullrow') && element.closest('.e-list-item')) {
                element = element.closest('.e-list-item').querySelector('.e-fullrow');
            }
            if (element.nextElementSibling) {
                element.style.height = element.nextElementSibling.offsetHeight + 'px';
            }
        }
    };
    /**
     * @private
     */
    BookmarkView.prototype.setBookmarkContentHeight = function () {
        // tslint:disable-next-line
        var element = this.treeObj.element;
        if (this.treeObj.fullRowSelect) {
            if (element.classList.contains('e-treeview')) {
                element = element.querySelector('.e-node-focus').querySelector('.e-fullrow');
            }
            if (element.nextElementSibling) {
                element.style.height = element.nextElementSibling.offsetHeight + 'px';
            }
        }
    };
    BookmarkView.prototype.navigateToBookmark = function (bookid) {
        var pageIndex = this.bookmarksDestination.bookMarkDestination[bookid].PageIndex;
        var Y = this.bookmarksDestination.bookMarkDestination[bookid].Y;
        this.goToBookmark(pageIndex, Y);
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
     * @param  {number} pageIndex - Specifies the pageIndex for Navigate
     * @param  {number} y - Specifies the Y coordinates value of the Page
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
        if (Browser.isDevice) {
            this.pdfViewerBase.mobileScrollerContainer.style.display = '';
            this.pdfViewerBase.updateMobileScrollerPosition();
        }
        proxy.pdfViewerBase.focusViewerContainer();
        return false;
    };
    /**
     * @private
     */
    BookmarkView.prototype.clear = function () {
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
        this.contextMenuHeight = 144;
        /**
         * @private
         */
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
            var isBackward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
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
                        var isBackward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
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
                var backward_1 = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
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
            var backward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            if (this.isTouchSelection && pageNumber > focusPageId && pageNumber > anchorPageId) {
                return;
            }
            if (anchorPageId === focusPageId) {
                var selectionObject = null;
                var selectionBounds = this.getSelectionBounds(selection.getRangeAt(0), pageNumber);
                var selectionRectBounds = this.getSelectionRectangleBounds(selection.getRangeAt(0), pageNumber);
                // tslint:disable-next-line:max-line-length
                var anchorOffsetValue = (this.getNodeElementFromNode(selection.anchorNode).childNodes.length === 1) ? selection.anchorOffset : this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                var focusOffsetValue = (this.getNodeElementFromNode(selection.focusNode).childNodes.length === 1) ? selection.focusOffset : this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                selectionObject = {
                    isBackward: backward, startNode: this.getNodeElementFromNode(selection.anchorNode).id,
                    startOffset: anchorOffsetValue, endNode: this.getNodeElementFromNode(selection.focusNode).id,
                    // tslint:disable-next-line:max-line-length
                    endOffset: focusOffsetValue, textContent: selection.toString(), pageNumber: pageNumber, bound: selectionBounds, rectangleBounds: selectionRectBounds
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
                var backward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
                if (!backward) {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (currentPageNumber - 1));
                    if (nextPageElement) {
                        var lastElement = nextPageElement.lastChild;
                        if (lastElement) {
                            if (lastElement.childNodes[0]) {
                                this.extendSelectionStich(lastElement.childNodes[0], this.getTextLastLength(lastElement), selection);
                            }
                            else {
                                this.extendSelectionStich(lastElement, this.getTextLastLength(lastElement), selection);
                            }
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
            var backward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
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
                    var selectionBound = this.getSelectionBounds(selectionRangeObject, pageNumber);
                    var selectionRectBounds = this.getSelectionRectangleBounds(selectionRangeObject, pageNumber);
                    // tslint:disable-next-line:max-line-length
                    return selectionObject = { isBackward: backward, startNode: firstElement.id, startOffset: startOffset, endNode: lastElement.id, endOffset: endOffset, textContent: selectionString, pageNumber: pageNumber, bound: selectionBound, rectangleBounds: selectionRectBounds };
                }
                else {
                    return null;
                }
            }
        }
        return null;
    };
    TextSelection.prototype.getSelectionRangeObject = function (startNode, startOffset, endNode, endOffset, pageNumber) {
        var startElement = document.getElementById(startNode);
        var endElement = document.getElementById(endNode);
        if (startElement.childNodes[0]) {
            startElement = startElement.childNodes[0];
        }
        if (endElement.childNodes[0]) {
            endElement = endElement.childNodes[0];
        }
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
        var bounds = null;
        if (startElement !== endElement) {
            var newStartRange = document.createRange();
            // tslint:disable-next-line:max-line-length
            var startRange = this.createRangeForSelection(range.startContainer, range.endContainer, range.startOffset, range.endOffset, newStartRange);
            bounds = this.normalizeBounds(startRange.getBoundingClientRect(), pageNumber);
        }
        else {
            bounds = this.normalizeBounds(range.getBoundingClientRect(), pageNumber);
        }
        return bounds;
    };
    TextSelection.prototype.getSelectionRectangleBounds = function (range, pageNumber) {
        var selectionBounds = [];
        var startElement = this.getNodeElementFromNode(range.startContainer);
        var endElement = this.getNodeElementFromNode(range.endContainer);
        var bounds = null;
        if (startElement !== endElement) {
            var startOffset = 0;
            var endOffset = 0;
            var currentId = 0;
            var anchorPageId = this.pdfViewerBase.textLayer.getPageIndex(range.startContainer);
            var anchorTextId = this.pdfViewerBase.textLayer.getTextIndex(range.startContainer, anchorPageId);
            var focusPageId = this.pdfViewerBase.textLayer.getPageIndex(range.endContainer);
            var focusTextId = this.pdfViewerBase.textLayer.getTextIndex(range.endContainer, focusPageId);
            var textDivs = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).childNodes;
            if (pageNumber === anchorPageId) {
                currentId = anchorTextId;
            }
            else {
                currentId = 0;
            }
            for (var j = currentId; j < textDivs.length; j++) {
                var textElement = textDivs[j];
                if (j === anchorTextId) {
                    startOffset = range.startOffset;
                }
                else {
                    startOffset = 0;
                }
                if (j === focusTextId) {
                    endOffset = range.endOffset;
                }
                else {
                    endOffset = textElement.textContent.length;
                }
                var newRange = document.createRange();
                for (var k = 0; k < textElement.childNodes.length; k++) {
                    var node = textElement.childNodes[k];
                    newRange.setStart(node, startOffset);
                    newRange.setEnd(node, endOffset);
                }
                var boundingRect = this.normalizeBounds(newRange.getBoundingClientRect(), pageNumber);
                selectionBounds.push(boundingRect);
                newRange.detach();
                if (j === focusTextId) {
                    break;
                }
            }
        }
        else {
            bounds = this.normalizeBounds(range.getBoundingClientRect(), pageNumber);
            selectionBounds.push(bounds);
        }
        return selectionBounds;
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
            right: this.getMagnifiedValue(bound.right - currentPageRect.left), width: this.getMagnifiedValue(bound.width)
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
        var bound = null;
        var ranges = this.selectionRangeArray;
        for (var i = 0; i < ranges.length; i++) {
            if (ranges[i] !== null) {
                if (pageNumber === ranges[i].pageNumber) {
                    bound = ranges[i].bound;
                }
            }
        }
        return bound;
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
            var isBackward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
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
    /**
     * @private
     */
    TextSelection.prototype.applySpanForSelection = function () {
        var selection = window.getSelection();
        // tslint:disable-next-line:max-line-length
        if (selection.anchorNode !== null && this.pdfViewerBase.viewerContainer.contains(this.getNodeElementFromNode(selection.anchorNode))) {
            var isBackWardSelection = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
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
            this.calculateContextMenuPosition(event.touches[0].clientY, event.touches[0].clientX);
        }
    };
    // tslint:disable-next-line
    TextSelection.prototype.calculateContextMenuPosition = function (top, left) {
        top = top - this.pdfViewerBase.toolbarHeight;
        if (Browser.isDevice) {
            // tslint:disable-next-line
            var contextTop = top - this.contextMenuHeight;
            if (contextTop < this.pdfViewerBase.toolbarHeight) {
                top = top + this.contextMenuHeight;
            }
            else {
                top = contextTop;
            }
        }
        // tslint:disable-next-line:max-line-length
        this.pdfViewerBase.contextMenuModule.contextMenuObj.open(top, left - this.pdfViewerBase.viewerContainer.clientLeft, this.pdfViewerBase.viewerContainer);
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
        if (this.pdfViewerBase.getTextMarkupAnnotationMode()) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
        }
        else {
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.contextMenuModule.contextMenuObj.open(event.changedTouches[0].clientY - this.pdfViewerBase.viewerContainer.offsetTop + this.pdfViewerBase.contextMenuModule.contextMenuElement.clientHeight, event.changedTouches[0].clientX - this.pdfViewerBase.viewerContainer.offsetLeft, this.pdfViewerBase.viewerContainer);
        }
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
                _this.initiateTextSearch(_this.searchInput);
                _this.updateSearchInputIcon(false);
            }
            else {
                _this.resetVariables();
            }
        };
        this.searchClickHandler = function (event) {
            _this.searchButtonClick(_this.searchBtn, _this.searchInput);
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
        if (this.pdfViewer.enableRtl) {
            this.prevSearchBtn = this.createSearchBoxButtons('prev_occurrence', 'e-pv-next-search');
        }
        else {
            this.prevSearchBtn = this.createSearchBoxButtons('prev_occurrence', 'e-pv-prev-search');
        }
        this.prevSearchBtn.setAttribute('aria-label', 'Previous Search text');
        searchElementsContainer.appendChild(this.prevSearchBtn);
        if (this.pdfViewer.enableRtl) {
            this.nextSearchBtn = this.createSearchBoxButtons('next_occurrence', 'e-pv-prev-search');
        }
        else {
            this.nextSearchBtn = this.createSearchBoxButtons('next_occurrence', 'e-pv-next-search');
        }
        this.nextSearchBtn.setAttribute('aria-label', 'Next Search text');
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
        if (this.pdfViewer.enableRtl) {
            this.searchBox.classList.add('e-rtl');
            this.searchBox.style.left = '88.3px';
        }
        else {
            this.searchBox.classList.remove('e-rtl');
            this.searchBox.style.right = '88.3px';
        }
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
        if (this.pdfViewer.toolbarModule && this.pdfViewer.enableToolbar) {
            var secondaryToolbar = this.pdfViewerBase.getElement('_toolbarContainer_popup');
            if (secondaryToolbar) {
                if (secondaryToolbar.contains(this.pdfViewerBase.getElement('_search').parentElement)) {
                    this.searchBox.style.right = '0px';
                }
            }
        }
        else {
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
    TextSearch.prototype.initiateTextSearch = function (searchElement) {
        var inputString = searchElement.value;
        this.initiateSearch(inputString);
    };
    /**
     * @private
     */
    TextSearch.prototype.initiateSearch = function (inputString) {
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
                this.initiateTextSearch(this.searchInput);
            }
        }
        else {
            this.initiateTextSearch(this.searchInput);
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
                        }
                        // tslint:disable-next-line:max-line-length
                    }
                    else if (this.searchCollection.length > 0 && (this.searchIndex === 0 || this.searchIndex === -1) && (searchPageIndex) === this.currentSearchIndex) {
                        if (this.isPrevSearch) {
                            // tslint:disable-next-line:max-line-length
                            if (!this.isMessagePopupOpened) {
                                this.onMessageBoxOpen();
                            }
                            this.searchPageIndex = this.getSearchPage(this.pdfViewerBase.currentPageNumber - 1);
                            this.searchedPages = [];
                            this.searchIndex = -1;
                        }
                        else {
                            if (!this.isMessagePopupOpened) {
                                this.onMessageBoxOpen();
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
        var scrollPoint = { y: -100, x: -100 };
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
                var targetScrollElement = this.getScrollElement(element);
                this.scrollToSearchStr(targetScrollElement, scrollPoint);
            }
            else {
                this.pdfViewerBase.updateScrollTop(pageIndex);
                var element_1 = this.pdfViewerBase.getElement('_text_' + pageIndex + '_' + startId);
                var targetScrollElement = this.getScrollElement(element_1);
                this.scrollToSearchStr(targetScrollElement, scrollPoint);
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
    TextSearch.prototype.getScrollElement = function (element) {
        var targetElement = element;
        if (element.childNodes.length > 0) {
            for (var i = 0; i < element.childNodes.length; i++) {
                if (element.childNodes[i].classList) {
                    if (element.childNodes[i].classList.contains('e-pv-search-text-highlight')) {
                        targetElement = element.childNodes[i];
                    }
                }
            }
        }
        return targetElement;
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
            if (Browser.isDevice) {
                parent.scrollLeft = offsetX;
            }
            else {
                if (this.pdfViewerBase.getZoomFactor() > 1.5) {
                    parent.scrollLeft = offsetX;
                }
            }
        }
        parent.scrollTop = offsetY;
        this.pdfViewerBase.updateMobileScrollerPosition();
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
        if (!Browser.isDevice) {
            if (isEnable) {
                this.prevSearchBtn.removeAttribute('disabled');
            }
            else {
                this.prevSearchBtn.disabled = true;
            }
        }
    };
    TextSearch.prototype.enableNextButton = function (isEnable) {
        if (!Browser.isDevice) {
            if (isEnable) {
                this.nextSearchBtn.removeAttribute('disabled');
            }
            else {
                this.nextSearchBtn.disabled = true;
            }
        }
    };
    /**
     * @private
     */
    TextSearch.prototype.resetVariables = function () {
        this.searchedPages = [];
        // tslint:disable-next-line
        this.searchMatches = new Array();
        // tslint:disable-next-line
        this.searchCollection = new Array();
    };
    /**
     * @private
     */
    TextSearch.prototype.searchButtonClick = function (element, inputElement) {
        if (element.classList.contains('e-pv-search-icon')) {
            this.initiateTextSearch(inputElement);
        }
        else if (element.classList.contains('e-pv-search-close')) {
            inputElement.value = '';
            this.resetTextSearch();
            inputElement.focus();
        }
    };
    TextSearch.prototype.updateSearchInputIcon = function (isEnable) {
        if (this.searchBtn) {
            if (isEnable) {
                this.searchBtn.classList.remove('e-pv-search-close');
                this.searchBtn.classList.add('e-pv-search-icon');
            }
            else {
                this.searchBtn.classList.remove('e-pv-search-icon');
                this.searchBtn.classList.add('e-pv-search-close');
            }
        }
    };
    TextSearch.prototype.onMessageBoxOpen = function () {
        this.pdfViewerBase.getElement('_search_input').blur();
        this.isMessagePopupOpened = true;
        if (!Browser.isDevice) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('No matches'));
        }
        else {
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.navigationPane.createTooltipMobile(this.pdfViewer.localeObj.getConstant('No Text Found'));
        }
    };
    /**
     * Searches the target text in the PDF document and highlights the occurrences in the pages
     * @param  {string} searchText - Specifies the searchText content
     * @param  {boolean} isMatchCase - If set true , its highlights the MatchCase content
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
            this.printViewerContainer = createElement('div', {
                id: this.pdfViewer.element.id + '_print_viewer_container',
                className: 'e-pv-print-viewer-container'
            });
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
                for (pageIndex = 0; pageIndex < _this.pdfViewerBase.pageCount; pageIndex++) {
                    var pageWidth = _this.pdfViewerBase.pageSize[pageIndex].width;
                    var pageHeight = _this.pdfViewerBase.pageSize[pageIndex].height;
                    _this.pdfViewer.printModule.createRequestForPrint(pageIndex, pageWidth, pageHeight, _this.pdfViewerBase.pageCount);
                }
            }, 100);
        }
    };
    Print.prototype.createRequestForPrint = function (pageIndex, pageWidth, pageHeight, pageCount) {
        var proxy = this;
        var request = new XMLHttpRequest();
        // tslint: disable-next-line:max-line-length
        // set default zoomFactor value.  
        var jsonObject = {
            pageNumber: pageIndex, documentId: this.pdfViewerBase.documentId,
            hashId: this.pdfViewerBase.hashId, zoomFactor: 1
        };
        request.open('POST', proxy.pdfViewer.serviceUrl + '/PrintImages', false);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        var printImage = request.responseText;
        if (typeof printImage !== 'object') {
            printImage = JSON.parse(printImage);
        }
        var annotationSource = '';
        if (printImage.textMarkupAnnotation && this.pdfViewerBase.isTextMarkupAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            annotationSource = this.pdfViewer.annotationModule.textMarkupAnnotationModule.printTextMarkupAnnotations(printImage.textMarkupAnnotation, pageIndex);
        }
        // tslint:disable-next-line:max-line-length
        this.printCanvas = createElement('canvas', { id: this.pdfViewer.element.id + '_printCanvas_' + pageIndex, className: 'e-pv-print-canvas' });
        this.printCanvas.style.width = pageWidth + 'px';
        this.printCanvas.style.height = pageHeight + 'px';
        this.printCanvas.height = 1056 * window.devicePixelRatio;
        this.printCanvas.width = 816 * window.devicePixelRatio;
        var context = this.printCanvas.getContext('2d');
        var pageImage = new Image();
        var annotationImage = new Image();
        pageImage.onload = function () {
            if (pageHeight > pageWidth) {
                context.drawImage(pageImage, 0, 0, proxy.printCanvas.width, proxy.printCanvas.height);
                if (annotationSource) {
                    context.drawImage(annotationImage, 0, 0, proxy.printCanvas.width, proxy.printCanvas.height);
                }
            }
            else {
                // translate to center canvas
                context.translate(proxy.printCanvas.width * 0.5, proxy.printCanvas.height * 0.5);
                // rotate the canvas to - 90 degree 
                context.rotate(-0.5 * Math.PI);
                // un translate the canvas back to origin
                context.translate(-proxy.printCanvas.height * 0.5, -proxy.printCanvas.width * 0.5);
                // draw the image
                context.drawImage(pageImage, 0, 0, proxy.printCanvas.height, proxy.printCanvas.width);
                if (annotationSource) {
                    context.drawImage(annotationImage, 0, 0, proxy.printCanvas.height, proxy.printCanvas.width);
                }
            }
            if (pageIndex === (proxy.pdfViewerBase.pageCount - 1)) {
                proxy.printWindowOpen();
            }
        };
        pageImage.src = printImage.image;
        annotationImage.src = annotationSource;
        this.printViewerContainer.appendChild(this.printCanvas);
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
                + ' img { width:100%; max-width: 1048px; box-sizing: border-box; }br, button { display: none; }'
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
        for (var i = 0; i < this.printViewerContainer.children.length; i++) {
            // tslint:disable-next-line:max-line-length
            var canvasUrl = this.printViewerContainer.children[i].toDataURL();
            this.frameDoc.document.write('<div style="margin:0mm;width:816px;height:1056px;position:relative"><img src="' + canvasUrl + '" id="' + 'image_' + i + '" /></div>');
        }
        this.pdfViewerBase.showPrintLoadingIndicator(false);
        if (Browser.isIE || Browser.info.name === 'edge') {
            try {
                this.iframe.contentWindow.document.execCommand('print', false, null);
            }
            catch (e) {
                this.iframe.contentWindow.print();
            }
        }
        else {
            setTimeout(function () {
                _this.iframe.contentWindow.print();
                _this.iframe.contentWindow.focus();
                document.body.removeChild(_this.iframe);
            }, 200);
        }
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

export { Annotation, LinkAnnotation, TextMarkupAnnotation, NavigationPane, PdfViewerBase, TextLayer, ContextMenu$1 as ContextMenu, Magnification, Navigation, ThumbnailView, Toolbar$1 as Toolbar, AnnotationToolbar, ToolbarSettings, AnnotationToolbarSettings, ServerActionSettings, StrikethroughSettings, UnderlineSettings, HighlightSettings, PdfViewer, BookmarkView, TextSelection, TextSearch, Print };
//# sourceMappingURL=ej2-pdfviewer.es5.js.map
