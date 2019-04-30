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
class Annotation {
    /**
     * @private
     */
    constructor(pdfViewer, viewerBase) {
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
    setAnnotationMode(type) {
        if (type === 'None') {
            this.clearAnnotationMode();
        }
        else if (type === 'Highlight' || type === 'Strikethrough' || type === 'Underline') {
            if (this.textMarkupAnnotationModule) {
                this.textMarkupAnnotationModule.drawTextMarkupAnnotations(type.toString());
            }
        }
    }
    clearAnnotationMode() {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
        }
    }
    /**
     * @private
     */
    deleteAnnotation() {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.deleteTextMarkupAnnotation();
            if (this.pdfViewer.toolbarModule) {
                if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                    this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(false);
                    this.pdfViewer.toolbarModule.annotationToolbarModule.enableAnnotationPropertiesTools(false);
                }
            }
        }
    }
    /**
     * @private
     */
    initializeCollection() {
        this.actionCollection = [];
        this.redoCollection = [];
        if (!this.popupNote) {
            this.createNote();
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    addAction(pageNumber, index, annotation, actionString, property) {
        let action = { pageIndex: pageNumber, index: index, annotation: annotation, action: actionString, modifiedProperty: property };
        this.actionCollection.push(action);
        this.updateToolbar();
    }
    /**
     * @private
     */
    undo() {
        let actionObject = this.actionCollection.pop();
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
    }
    /**
     * @private
     */
    redo() {
        let actionObject = this.redoCollection.pop();
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
    }
    updateToolbar() {
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateUndoRedoButtons();
        }
    }
    createNote() {
        // tslint:disable-next-line:max-line-length
        this.popupNote = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note', className: 'e-pv-annotation-note', styles: 'display:none' });
        this.popupNoteAuthor = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note_author', className: 'e-pv-annotation-note-author' });
        this.popupNote.appendChild(this.popupNoteAuthor);
        // tslint:disable-next-line:max-line-length
        this.popupNoteContent = createElement('div', { id: this.pdfViewer.element.id + '_annotation_note_content', className: 'e-pv-annotation-note-content' });
        this.popupNote.appendChild(this.popupNoteContent);
        this.pdfViewerBase.mainContainer.appendChild(this.popupNote);
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    showPopupNote(event, color, author, note, type) {
        let mainContainerPosition = this.pdfViewerBase.mainContainer.getBoundingClientRect();
        let popupNoteClientRect = this.popupNote.getBoundingClientRect();
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
        let topPosition = (event.pageY - mainContainerPosition.top + 5);
        let leftPosition = (event.pageX - mainContainerPosition.left + 5);
        if (leftPosition + popupNoteClientRect.width > mainContainerPosition.width) {
            leftPosition = leftPosition - popupNoteClientRect.width;
        }
        if (topPosition + popupNoteClientRect.height > mainContainerPosition.height) {
            topPosition = topPosition - popupNoteClientRect.height;
        }
        this.popupNote.style.top = topPosition + 'px';
        this.popupNote.style.left = leftPosition + 'px';
    }
    /**
     * @private
     */
    hidePopupNote() {
        this.popupNote.style.display = 'none';
    }
    createTextMarkupPopup() {
        let elementId = this.pdfViewer.element.id;
        // tslint:disable-next-line:max-line-length
        this.popupElement = createElement('div', { id: elementId + '_popup_annotation_note', className: 'e-pv-annotation-popup-menu', styles: 'display:none' });
        let headerElement = createElement('div', { id: elementId + '_popup_header', className: 'e-pv-annotation-popup-header' });
        // tslint:disable-next-line:max-line-length
        this.authorPopupElement = createElement('div', { id: elementId + '_popup_author', className: 'e-pv-annotation-popup-author' });
        headerElement.appendChild(this.authorPopupElement);
        // tslint:disable-next-line:max-line-length
        let closeBtn = createElement('span', { id: elementId + '_popup_close', className: 'e-pv-annotation-popup-close e-pv-icon' });
        headerElement.appendChild(closeBtn);
        this.popupElement.appendChild(headerElement);
        // tslint:disable-next-line:max-line-length
        this.modifiedDateElement = createElement('div', { id: elementId + '_popup_modified_time', className: 'e-pv-annotation-modified-time' });
        this.popupElement.appendChild(this.modifiedDateElement);
        // tslint:disable-next-line:max-line-length
        let contentContainer = createElement('div', { id: elementId + '_popup_content_container', className: 'e-pv-annotation-popup-note-container' });
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
        this.noteContentElement.addEventListener('mousedown', () => { this.noteContentElement.focus(); });
    }
    // tslint:disable-next-line
    onPopupElementMoveStart(event) {
        if (event.type === 'touchstart') {
            event = event.changedTouches[0];
        }
        if ((event.target.id !== (this.noteContentElement.id) || !(event.target.contains(this.noteContentElement.childNodes[0])))) {
            this.isPopupMenuMoved = true;
            let popupElementClientRect = this.popupElement.getBoundingClientRect();
            this.clientX = event.clientX - popupElementClientRect.left;
            // tslint:disable-next-line:max-line-length
            this.clientY = (event.clientY - popupElementClientRect.top) + (this.pdfViewerBase.pageSize[this.currentAnnotPageNumber].top * this.pdfViewerBase.getZoomFactor());
        }
    }
    // tslint:disable-next-line
    onPopupElementMove(event) {
        if (event.type === 'touchmove') {
            event = event.changedTouches[0];
        }
        // tslint:disable-next-line:max-line-length
        if (this.isPopupMenuMoved && (event.target.id !== (this.noteContentElement.id) || !(event.target.contains(this.noteContentElement.childNodes[0])))) {
            let left = (event.clientX - this.clientX) + parseFloat(this.popupElement.style.left);
            let top = ((event.clientY - this.clientY) + parseFloat(this.popupElement.style.top));
            this.clientX = event.clientX;
            this.clientY = event.clientY;
            let clientPosition = this.popupElement.getBoundingClientRect();
            let pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + this.currentAnnotPageNumber);
            // tslint:disable-next-line:max-line-length
            if (left > parseFloat(pageDiv.style.left) && (left + clientPosition.width) < (parseFloat(pageDiv.style.left) + parseFloat(pageDiv.style.width))) {
                this.popupElement.style.left = (left) + 'px';
            }
            else {
                this.popupElement.style.left = parseFloat(this.popupElement.style.left) + 'px';
            }
            // tslint:disable-next-line:max-line-length
            if (top > parseFloat(pageDiv.style.top) && (top + clientPosition.height) < (parseFloat(pageDiv.style.top) + parseFloat(pageDiv.style.height))) {
                this.popupElement.style.top = (top) + 'px';
            }
            else {
                this.popupElement.style.top = parseFloat(this.popupElement.style.top) + 'px';
            }
        }
    }
    onPopupElementMoveEnd() {
        this.isPopupMenuMoved = false;
    }
    saveClosePopupMenu() {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.saveNoteContent(this.currentAnnotPageNumber, this.noteContentElement.innerText);
        }
        this.closePopupMenu();
    }
    /**
     * @private
     */
    closePopupMenu() {
        if (this.popupElement) {
            this.popupElement.parentElement.removeChild(this.popupElement);
            this.popupElement = null;
            this.isPopupNoteVisible = false;
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    showAnnotationPopup(event) {
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
                    let clientPosition = this.popupElement.getBoundingClientRect();
                    // tslint:disable-next-line:max-line-length
                    let pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + this.currentAnnotPageNumber);
                    let canvasPosition = pageDiv.getBoundingClientRect();
                    let topPosition = ((event.clientY) - canvasPosition.top) + parseFloat(pageDiv.style.top);
                    let leftPosition = (event.clientX);
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
    }
    getProperDate(date) {
        let dateObject = new Date(date.toString());
        if (isNaN(dateObject.getFullYear())) {
            let dateString = date.slice(2, 16);
            // tslint:disable-next-line:max-line-length
            dateString = dateString.slice(0, 4) + '/' + dateString.slice(4, 6) + '/' + dateString.slice(6, 8) + ' ' + dateString.slice(8, 10) + ':' + dateString.slice(10, 12) + ':' + dateString.slice(12, 14);
            dateObject = new Date(dateString);
        }
        // tslint:disable-next-line:max-line-length
        return (dateObject.getMonth() + 1) + '/' + dateObject.getDate() + '/' + dateObject.getFullYear() + ' ' + dateObject.getHours() + ':' + dateObject.getMinutes() + ':' + dateObject.getSeconds();
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    getEventPageNumber(event) {
        let eventTarget = event.target;
        // tslint:disable-next-line:max-line-length
        let pageString = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1];
        // tslint:disable-next-line
        return parseInt(pageString);
    }
    /**
     * private
     */
    clear() {
        if (this.textMarkupAnnotationModule) {
            this.textMarkupAnnotationModule.clear();
        }
    }
    /**
     * @private
     */
    destroy() {
        this.textMarkupAnnotationModule.clear();
    }
    /**
     * @private
     */
    getModuleName() {
        return 'Annotation';
    }
}

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
                let pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
                pageDiv.appendChild(aTag);
            }
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
            let pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + pageNumber);
            if (pageDiv) {
                let pageChildNodes = pageDiv.childNodes;
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
 * The `TextMarkupAnnotation` module is used to handle text markup annotation actions of PDF viewer.
 * @hidden
 */
class TextMarkupAnnotation {
    /**
     * @private
     */
    constructor(pdfViewer, viewerBase) {
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
    createAnnotationLayer(pageDiv, pageWidth, pageHeight, pageNumber, displayMode) {
        // tslint:disable-next-line:max-line-length
        let annotationCanvas = createElement('canvas', { id: this.pdfViewer.element.id + '_annotationCanvas_' + pageNumber, className: 'e-pv-annotation-canvas' });
        annotationCanvas.width = pageWidth;
        annotationCanvas.height = pageHeight;
        annotationCanvas.style.display = displayMode;
        pageDiv.appendChild(annotationCanvas);
        return annotationCanvas;
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    renderTextMarkupAnnotationsInPage(textMarkupAnnotations, pageNumber) {
        let canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        this.renderTextMarkupAnnotations(textMarkupAnnotations, pageNumber, canvas, this.pdfViewerBase.getZoomFactor());
    }
    // tslint:disable-next-line
    renderTextMarkupAnnotations(textMarkupAnnotations, pageNumber, canvas, factor) {
        if (canvas) {
            canvas.width = this.getMagnifiedValue(this.pdfViewerBase.pageSize[pageNumber].width, factor);
            canvas.height = this.getMagnifiedValue(this.pdfViewerBase.pageSize[pageNumber].height, factor);
            let context = canvas.getContext('2d');
            context.setLineDash([]);
            // tslint:disable-next-line
            let annotations = this.getAnnotations(pageNumber, textMarkupAnnotations);
            if (annotations) {
                for (let i = 0; i < annotations.length; i++) {
                    // tslint:disable-next-line
                    let annotation = annotations[i];
                    let annotationObject = null;
                    if (annotation.TextMarkupAnnotationType) {
                        // tslint:disable-next-line:max-line-length
                        annotationObject = { textMarkupAnnotationType: annotation.TextMarkupAnnotationType, color: annotation.Color, opacity: annotation.Opacity, bounds: annotation.Bounds, author: annotation.Author, subject: annotation.Subject, modifiedDate: annotation.ModifiedDate, note: annotation.Note, rect: annotation.Rect };
                        this.storeAnnotations(pageNumber, annotationObject);
                    }
                    // tslint:disable-next-line:max-line-length
                    let type = annotation.TextMarkupAnnotationType ? annotation.TextMarkupAnnotationType : annotation.textMarkupAnnotationType;
                    // tslint:disable-next-line
                    let annotBounds = annotation.Bounds ? annotation.Bounds : annotation.bounds;
                    let opacity = annotation.Opacity ? annotation.Opacity : annotation.opacity;
                    let color = annotation.Color ? annotation.Color : annotation.color;
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
    }
    /**
     * @private
     */
    drawTextMarkupAnnotations(type) {
        this.isTextMarkupAnnotationMode = true;
        this.currentTextMarkupAddMode = type;
        let selectionObject = this.pdfViewer.textSelectionModule.selectionRangeArray;
        if (selectionObject.length > 0) {
            this.convertSelectionToTextMarkup(type, selectionObject, this.pdfViewerBase.getZoomFactor());
        }
        if (window.getSelection().toString()) {
            let pageBounds = this.getDrawnBounds();
            if (pageBounds.length > 0) {
                for (let i = 0; i < pageBounds.length; i++) {
                    // tslint:disable-next-line:max-line-length
                    this.drawTextMarkups(type, pageBounds[i].bounds, pageBounds[i].pageIndex, pageBounds[i].rect, this.pdfViewerBase.getZoomFactor());
                }
            }
        }
        // this.pdfViewerBase.annotationHelper.redoCollection = [];
        this.pdfViewer.textSelectionModule.clearTextSelection();
    }
    convertSelectionToTextMarkup(type, selectionObject, factor) {
        for (let i = 0; i < selectionObject.length; i++) {
            this.drawTextMarkups(type, selectionObject[i].rectangleBounds, selectionObject[i].pageNumber, selectionObject[i].bound, factor);
        }
    }
    // tslint:disable-next-line
    drawTextMarkups(type, bounds, pageNumber, rect, factor) {
        let annotation = null;
        let context = this.getPageContext(pageNumber);
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
            let settings = { opacity: annotation.opacity, color: annotation.color, author: annotation.author, subject: annotation.subject, modifiedDate: annotation.modifiedDate };
            let index = this.pdfViewer.annotationModule.actionCollection[this.pdfViewer.annotationModule.actionCollection.length - 1].index;
            this.pdfViewer.fireAnnotationAdd(pageNumber, index, type, annotation.rect, settings);
        }
    }
    // tslint:disable-next-line
    renderHighlightAnnotation(bounds, opacity, color, context, factor) {
        for (let i = 0; i < bounds.length; i++) {
            // tslint:disable-next-line
            let bound = bounds[i];
            context.beginPath();
            let x = bound.X ? bound.X : bound.left;
            let y = bound.Y ? bound.Y : bound.top;
            let width = bound.Width ? bound.Width : bound.width;
            let height = bound.Height ? bound.Height : bound.height;
            // tslint:disable-next-line:max-line-length
            context.rect((x * factor), (y * factor), (width * factor), (height * factor));
            context.globalAlpha = opacity * 0.5;
            context.closePath();
            context.fillStyle = color;
            context.msFillRule = 'nonzero';
            context.fill();
        }
        context.save();
    }
    // tslint:disable-next-line
    renderStrikeoutAnnotation(bounds, opacity, color, context, factor) {
        for (let i = 0; i < bounds.length; i++) {
            // tslint:disable-next-line
            let bound = this.getProperBounds(bounds[i]);
            this.drawLine(opacity, bound.x, bound.y, bound.width, (bound.height / 2), color, factor, context);
        }
    }
    // tslint:disable-next-line
    renderUnderlineAnnotation(bounds, opacity, color, context, factor) {
        for (let i = 0; i < bounds.length; i++) {
            // tslint:disable-next-line
            let boundValues = this.getProperBounds(bounds[i]);
            this.drawLine(opacity, boundValues.x, boundValues.y, boundValues.width, boundValues.height, color, factor, context);
        }
    }
    // tslint:disable-next-line
    getProperBounds(bound) {
        let x = bound.X ? bound.X : bound.left;
        let y = bound.Y ? bound.Y : bound.top;
        let width = bound.Width ? bound.Width : bound.width;
        let height = bound.Height ? bound.Height : bound.height;
        return { x: x, y: y, width: width, height: height };
    }
    // tslint:disable-next-line:max-line-length
    drawLine(opacity, x, y, width, height, color, factor, context) {
        context.globalAlpha = opacity;
        context.beginPath();
        context.moveTo((x * factor), (y + height) * factor);
        context.lineTo((width + x) * factor, (y + height) * factor);
        context.lineWidth = 1;
        context.strokeStyle = color;
        context.closePath();
        context.msFillRule = 'nonzero';
        context.stroke();
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    printTextMarkupAnnotations(textMarkupAnnotations, pageIndex) {
        let canvas = createElement('canvas', { id: this.pdfViewer.element.id + '_print_annotation_layer_' + pageIndex });
        // tslint:disable-next-line
        let annotations = this.getAnnotations(pageIndex, null);
        if (annotations) {
            this.renderTextMarkupAnnotations(null, pageIndex, canvas, 1);
        }
        else {
            this.renderTextMarkupAnnotations(textMarkupAnnotations, pageIndex, canvas, 1);
        }
        let imageSource = canvas.toDataURL();
        return imageSource;
    }
    /**
     * @private
     */
    saveTextMarkupAnnotations() {
        // tslint:disable-next-line
        let storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        // tslint:disable-next-line
        let annotations = new Array();
        let colorpick = new ColorPicker();
        for (let j = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject) {
            let annotationCollection = JSON.parse(storeObject);
            for (let i = 0; i < annotationCollection.length; i++) {
                let newArray = [];
                let pageAnnotationObject = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (let z = 0; pageAnnotationObject.annotations.length > z; z++) {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(this.getBoundsForSave(pageAnnotationObject.annotations[z].bounds));
                        let colorString = colorpick.getValue(pageAnnotationObject.annotations[z].color, 'rgba');
                        pageAnnotationObject.annotations[z].color = JSON.stringify(this.getRgbCode(colorString));
                        pageAnnotationObject.annotations[z].rect = JSON.stringify(pageAnnotationObject.annotations[z].rect);
                    }
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
        }
        return JSON.stringify(annotations);
    }
    /**
     * @private
     */
    deleteTextMarkupAnnotation() {
        if (this.currentTextMarkupAnnotation) {
            let pageAnnotations = this.getAnnotations(this.selectTextMarkupCurrentPage, null);
            let deletedAnnotation = null;
            for (let i = 0; i < pageAnnotations.length; i++) {
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
    }
    /**
     * @private
     */
    modifyColorProperty(color) {
        if (this.currentTextMarkupAnnotation) {
            let pageAnnotations = this.modifyAnnotationProperty('Color', color, null);
            this.manageAnnotations(pageAnnotations, this.selectTextMarkupCurrentPage);
            this.renderTextMarkupAnnotationsInPage(null, this.selectTextMarkupCurrentPage);
            this.pdfViewerBase.isDocumentEdited = true;
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.fireAnnotationPropertiesChange(this.selectTextMarkupCurrentPage, this.currentAnnotationIndex, this.currentTextMarkupAnnotation.textMarkupAnnotationType, true, false);
            this.currentAnnotationIndex = null;
        }
    }
    /**
     * @private
     */
    modifyOpacityProperty(args) {
        if (this.currentTextMarkupAnnotation) {
            let pageAnnotations = this.modifyAnnotationProperty('Opacity', args.value / 100, args.name);
            this.manageAnnotations(pageAnnotations, this.selectTextMarkupCurrentPage);
            this.renderTextMarkupAnnotationsInPage(null, this.selectTextMarkupCurrentPage);
            if (args.name === 'changed') {
                this.pdfViewerBase.isDocumentEdited = true;
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.fireAnnotationPropertiesChange(this.selectTextMarkupCurrentPage, this.currentAnnotationIndex, this.currentTextMarkupAnnotation.textMarkupAnnotationType, false, true);
                this.currentAnnotationIndex = null;
            }
        }
    }
    // tslint:disable-next-line
    modifyAnnotationProperty(property, value, status) {
        let pageAnnotations = this.getAnnotations(this.selectTextMarkupCurrentPage, null);
        for (let i = 0; i < pageAnnotations.length; i++) {
            if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[i])) {
                if (property === 'Color') {
                    pageAnnotations[i].color = value;
                }
                else if (property === 'Opacity') {
                    pageAnnotations[i].opacity = value;
                }
                let date = new Date();
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
    }
    /**
     * @private
     */
    undoTextMarkupAction(annotation, pageNumber, index, action) {
        let pageAnnotations = this.getAnnotations(pageNumber, null);
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
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    undoRedoPropertyChange(annotation, pageNumber, index, property) {
        let pageAnnotations = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            if (property === 'Color') {
                let tempColor = pageAnnotations[index].color;
                pageAnnotations[index].color = annotation.color;
                annotation.color = tempColor;
            }
            else {
                let tempOpacity = pageAnnotations[index].opacity;
                pageAnnotations[index].opacity = annotation.opacity;
                annotation.opacity = tempOpacity;
            }
        }
        this.clearCurrentAnnotation();
        this.pdfViewerBase.isDocumentEdited = true;
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.renderTextMarkupAnnotationsInPage(null, pageNumber);
        return annotation;
    }
    /**
     * @private
     */
    redoTextMarkupAction(annotation, pageNumber, index, action) {
        let pageAnnotations = this.getAnnotations(pageNumber, null);
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
    }
    /**
     * @private
     */
    saveNoteContent(pageNumber, note) {
        let pageAnnotations = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            for (let i = 0; i < pageAnnotations.length; i++) {
                if (JSON.stringify(this.currentTextMarkupAnnotation) === JSON.stringify(pageAnnotations[i])) {
                    pageAnnotations[i].note = note;
                }
            }
        }
        this.manageAnnotations(pageAnnotations, pageNumber);
        this.pdfViewerBase.isDocumentEdited = true;
    }
    clearCurrentAnnotation() {
        this.selectTextMarkupCurrentPage = null;
        this.currentTextMarkupAnnotation = null;
        this.enableAnnotationPropertiesTool(false);
    }
    clearCurrentAnnotationSelection(pageNumber) {
        let lowerPageIndex = (pageNumber - 2) >= 0 ? (pageNumber - 2) : 0;
        // tslint:disable-next-line:max-line-length
        let higherPageIndex = (pageNumber + 2) < this.pdfViewerBase.pageCount ? (pageNumber + 2) : this.pdfViewerBase.pageCount - 1;
        for (let k = lowerPageIndex; k <= higherPageIndex; k++) {
            this.clearAnnotationSelection(k);
        }
    }
    // tslint:disable-next-line
    getBoundsForSave(bounds) {
        // tslint:disable-next-line
        let newArray = [];
        for (let i = 0; i < bounds.length; i++) {
            let left = bounds[i].left ? bounds[i].left : bounds[i].Left;
            let top = bounds[i].top ? bounds[i].top : bounds[i].Top;
            let height = bounds[i].height ? bounds[i].height : bounds[i].Height;
            let width = bounds[i].width ? bounds[i].width : bounds[i].Width;
            newArray.push({ left: left, top: top, width: width, height: height });
        }
        return newArray;
    }
    // tslint:disable-next-line
    getRgbCode(colorString) {
        let stringArray = colorString.split(',');
        // tslint:disable-next-line:radix
        let r = parseInt(stringArray[0].split('(')[1]);
        // tslint:disable-next-line:radix
        let g = parseInt(stringArray[1]);
        // tslint:disable-next-line:radix
        let b = parseInt(stringArray[2]);
        return { r: r, g: g, b: b };
    }
    getDrawnBounds() {
        let pageBounds = [];
        let selection = window.getSelection();
        if (selection.anchorNode !== null) {
            let range = document.createRange();
            let isBackWardSelection = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            if (selection.anchorNode === selection.focusNode) {
                let pageId = this.pdfViewerBase.textLayer.getPageIndex(selection.anchorNode);
                if (!isNaN(pageId)) {
                    let pageRect = this.pdfViewerBase.getElement('_pageDiv_' + pageId).getBoundingClientRect();
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
                    let boundingRect = range.getBoundingClientRect();
                    // tslint:disable-next-line:max-line-length
                    let rectangle = { left: this.getDefaultValue(boundingRect.left - pageRect.left), top: this.getDefaultValue(boundingRect.top - pageRect.top), width: this.getDefaultValue(boundingRect.width), height: this.getDefaultValue(boundingRect.height), right: this.getDefaultValue(boundingRect.right - pageRect.left), bottom: this.getDefaultValue(boundingRect.bottom - pageRect.top) };
                    let rectangleArray = [];
                    rectangleArray.push(rectangle);
                    // tslint:disable-next-line
                    let rect = { left: rectangle.left, top: rectangle.top, right: rectangle.right, bottom: rectangle.bottom };
                    pageBounds.push({ pageIndex: pageId, bounds: rectangleArray, rect: rect });
                }
            }
            else {
                let startNode;
                let endNode;
                let selectionStartOffset;
                let selectionEndOffset;
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
                let anchorPageId = this.pdfViewerBase.textLayer.getPageIndex(startNode);
                let anchorTextId = this.pdfViewerBase.textLayer.getTextIndex(startNode, anchorPageId);
                let focusPageId = this.pdfViewerBase.textLayer.getPageIndex(endNode);
                let focusTextId = this.pdfViewerBase.textLayer.getTextIndex(endNode, focusPageId);
                let startOffset = 0;
                let endOffset = 0;
                let currentId = 0;
                for (let i = anchorPageId; i <= focusPageId; i++) {
                    let selectionRects = [];
                    let pageStartId;
                    let pageEndId;
                    let pageStartOffset;
                    let pageEndOffset;
                    let textDivs = this.pdfViewerBase.getElement('_textLayer_' + i).childNodes;
                    let pageRect = this.pdfViewerBase.getElement('_pageDiv_' + i).getBoundingClientRect();
                    if (i === anchorPageId) {
                        currentId = anchorTextId;
                    }
                    else {
                        currentId = 0;
                    }
                    for (let j = currentId; j < textDivs.length; j++) {
                        let textElement = textDivs[j];
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
                        for (let k = 0; k < textElement.childNodes.length; k++) {
                            let node = textElement.childNodes[k];
                            range.setStart(node, startOffset);
                            range.setEnd(node, endOffset);
                        }
                        let boundingRect = range.getBoundingClientRect();
                        // tslint:disable-next-line:max-line-length
                        let rectangle = { left: this.getDefaultValue(boundingRect.left - pageRect.left), top: this.getDefaultValue(boundingRect.top - pageRect.top), width: this.getDefaultValue(boundingRect.width), height: this.getDefaultValue(boundingRect.height), right: this.getDefaultValue(boundingRect.right - pageRect.left), bottom: this.getDefaultValue(boundingRect.bottom - pageRect.top) };
                        selectionRects.push(rectangle);
                        range.detach();
                        if (i === focusPageId && j === focusTextId) {
                            break;
                        }
                    }
                    let startElementNode = this.pdfViewerBase.getElement('_text_' + i + '_' + pageStartId).childNodes[0];
                    let endElementNode = this.pdfViewerBase.getElement('_text_' + i + '_' + pageEndId).childNodes[0];
                    let pageRange = document.createRange();
                    pageRange.setStart(startElementNode, pageStartOffset);
                    pageRange.setEnd(endElementNode, pageEndOffset);
                    let pageRectBounds = pageRange.getBoundingClientRect();
                    // tslint:disable-next-line:max-line-length
                    let pageRectangle = { left: this.getDefaultValue(pageRectBounds.left - pageRect.left), top: this.getDefaultValue(pageRectBounds.top - pageRect.top), width: this.getDefaultValue(pageRectBounds.width), height: this.getDefaultValue(pageRectBounds.height), right: this.getDefaultValue(pageRectBounds.right - pageRect.left), bottom: this.getDefaultValue(pageRectBounds.bottom - pageRect.top) };
                    // tslint:disable-next-line
                    let rect = { left: pageRectangle.left, top: pageRectangle.top, right: pageRectangle.right, bottom: pageRectangle.bottom };
                    pageBounds.push({ pageIndex: i, bounds: selectionRects, rect: rect });
                }
            }
        }
        selection.removeAllRanges();
        return pageBounds;
    }
    /**
     * @private
     */
    rerenderAnnotationsPinch(pageNumber) {
        let annotCanvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (annotCanvas) {
            let oldAnnotCanvas = this.pdfViewerBase.getElement('_old_annotationCanvas_' + pageNumber);
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
    }
    /**
     * @private
     */
    rerenderAnnotations(pageNumber) {
        let oldCanvas = this.pdfViewerBase.getElement('_old_annotationCanvas_' + pageNumber);
        if (oldCanvas) {
            oldCanvas.parentElement.removeChild(oldCanvas);
        }
        let newCanvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (newCanvas) {
            newCanvas.style.display = 'block';
        }
    }
    /**
     * @private
     */
    resizeAnnotations(width, height, pageNumber) {
        let canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (canvas) {
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
        }
    }
    /**
     * @private
     */
    onTextMarkupAnnotationMouseUp(event) {
        let pageNumber = this.pdfViewer.annotationModule.getEventPageNumber(event);
        if (!isNullOrUndefined(pageNumber) && !isNaN(pageNumber)) {
            let canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
            let currentAnnot = this.getCurrentMarkupAnnotation(event.clientX, event.clientY, pageNumber, canvas);
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
    }
    /**
     * @private
     */
    onTextMarkupAnnotationTouchEnd(event) {
        let pageNumber = this.pdfViewer.annotationModule.getEventPageNumber(event);
        if (!isNullOrUndefined(pageNumber) && !isNaN(pageNumber)) {
            this.clearCurrentAnnotationSelection(pageNumber);
            let touchCanvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
            // tslint:disable-next-line:max-line-length
            let currentAnnot = this.getCurrentMarkupAnnotation(event.touches[0].clientX, event.touches[0].clientY, pageNumber, touchCanvas);
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
            let number = this.selectTextMarkupCurrentPage;
            this.selectTextMarkupCurrentPage = null;
            this.clearAnnotationSelection(number);
        }
        else {
            this.clearCurrentAnnotation();
            this.clearCurrentAnnotationSelection(pageNumber);
        }
    }
    /**
     * @private
     */
    onTextMarkupAnnotationMouseMove(event) {
        let eventTarget = event.target;
        // tslint:disable-next-line
        let pageIndex = parseInt(eventTarget.id.split('_text_')[1]) || parseInt(eventTarget.id.split('_textLayer_')[1]) || parseInt(eventTarget.id.split('_annotationCanvas_')[1]);
        if (pageIndex) {
            let canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageIndex);
            let currentAnnot = this.getCurrentMarkupAnnotation(event.clientX, event.clientY, pageIndex, canvas);
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
    }
    // tslint:disable-next-line
    showPopupNote(event, annotation) {
        if (annotation.note) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotationModule.showPopupNote(event, annotation.color, annotation.author, annotation.note, annotation.textMarkupAnnotationType);
        }
    }
    getCurrentMarkupAnnotation(clientX, clientY, pageNumber, canvas) {
        let currentTextMarkupAnnotations = [];
        let canvasParentPosition = canvas.parentElement.getBoundingClientRect();
        let leftClickPosition = clientX - canvasParentPosition.left;
        let topClickPosition = clientY - canvasParentPosition.top;
        let annotationList = this.getAnnotations(pageNumber, null);
        let isAnnotationGot = false;
        if (annotationList) {
            for (let i = 0; i < annotationList.length; i++) {
                let annotation = annotationList[i];
                for (let j = 0; j < annotation.bounds.length; j++) {
                    // tslint:disable-next-line
                    let bound = annotation.bounds[j];
                    let left = bound.left ? bound.left : bound.Left;
                    let top = bound.top ? bound.top : bound.Top;
                    let width = bound.width ? bound.width : bound.Width;
                    let height = bound.height ? bound.height : bound.Height;
                    // tslint:disable-next-line:max-line-length
                    if (leftClickPosition >= this.getMagnifiedValue(left, this.pdfViewerBase.getZoomFactor()) && leftClickPosition <= this.getMagnifiedValue(left + width, this.pdfViewerBase.getZoomFactor()) && topClickPosition >= this.getMagnifiedValue(top, this.pdfViewerBase.getZoomFactor()) && topClickPosition <= this.getMagnifiedValue(top + height, this.pdfViewerBase.getZoomFactor())) {
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
        let currentAnnot = null;
        if (currentTextMarkupAnnotations.length > 1) {
            currentAnnot = this.compareCurrentAnnotations(currentTextMarkupAnnotations);
        }
        else if (currentTextMarkupAnnotations.length === 1) {
            currentAnnot = currentTextMarkupAnnotations[0];
        }
        return currentAnnot;
    }
    compareCurrentAnnotations(annotations) {
        let previousX;
        let currentAnnotation = null;
        for (let i = 0; i < annotations.length; i++) {
            if (i === annotations.length - 1) {
                break;
            }
            // tslint:disable-next-line
            let firstAnnotBounds = annotations[i].bounds;
            let firstXposition = firstAnnotBounds[0].left ? firstAnnotBounds[0].left : firstAnnotBounds[0].Left;
            let firstYposition = firstAnnotBounds[0].top ? firstAnnotBounds[0].top : firstAnnotBounds[0].Top;
            // tslint:disable-next-line
            let secondAnnotBounds = annotations[i + 1].bounds;
            let secondXposition = secondAnnotBounds[0].left ? secondAnnotBounds[0].left : secondAnnotBounds[0].Left;
            let secondYposition = secondAnnotBounds[0].top ? secondAnnotBounds[0].top : secondAnnotBounds[0].Top;
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
    }
    /**
     * @private
     */
    clearAnnotationSelection(pageNumber) {
        let canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        if (canvas) {
            let context = canvas.getContext('2d');
            context.setLineDash([]);
            this.renderTextMarkupAnnotationsInPage(null, pageNumber);
        }
    }
    selectAnnotation(annotation, canvas) {
        for (let i = 0; i < annotation.bounds.length; i++) {
            // tslint:disable-next-line
            let bound = annotation.bounds[i];
            let x = bound.left ? bound.left : bound.Left;
            let y = bound.top ? bound.top : bound.Top;
            let width = bound.width ? bound.width : bound.Width;
            let height = bound.height ? bound.height : bound.Height;
            // tslint:disable-next-line:max-line-length
            this.drawAnnotationSelectRect(canvas, this.getMagnifiedValue(x - 0.5, this.pdfViewerBase.getZoomFactor()), this.getMagnifiedValue(y - 0.5, this.pdfViewerBase.getZoomFactor()), this.getMagnifiedValue(width + 0.5, this.pdfViewerBase.getZoomFactor()), this.getMagnifiedValue(height + 0.5, this.pdfViewerBase.getZoomFactor()));
        }
    }
    drawAnnotationSelectRect(canvas, x, y, width, height) {
        let context = canvas.getContext('2d');
        context.beginPath();
        context.setLineDash([4 * this.pdfViewerBase.getZoomFactor()]);
        context.globalAlpha = 1;
        context.rect(x, y, width, height);
        context.closePath();
        context.strokeStyle = '#0000ff';
        context.stroke();
        context.save();
    }
    enableAnnotationPropertiesTool(isEnable) {
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
            this.pdfViewer.toolbarModule.annotationToolbarModule.createMobileAnnotationToolbar(isEnable);
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule.isMobileAnnotEnabled) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.selectAnnotationDeleteItem(isEnable);
                let enable = isEnable;
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
    }
    /**
     * @private
     */
    maintainAnnotationSelection() {
        if (this.currentTextMarkupAnnotation) {
            let canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + this.selectTextMarkupCurrentPage);
            if (canvas) {
                this.selectAnnotation(this.currentTextMarkupAnnotation, canvas);
            }
        }
    }
    storeAnnotations(pageNumber, annotation) {
        // tslint:disable-next-line
        let storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        let index = 0;
        if (!storeObject) {
            let markupAnnotation = { pageIndex: pageNumber, annotations: [] };
            markupAnnotation.annotations.push(annotation);
            index = markupAnnotation.annotations.indexOf(annotation);
            let annotationCollection = [];
            annotationCollection.push(markupAnnotation);
            let annotationStringified = JSON.stringify(annotationCollection);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_textMarkup', annotationStringified);
        }
        else {
            let annotObject = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
            let pageIndex = this.getPageCollection(annotObject, pageNumber);
            if (annotObject[pageIndex]) {
                annotObject[pageIndex].annotations.push(annotation);
                index = annotObject[pageIndex].annotations.indexOf(annotation);
            }
            else {
                let markupAnnotation = { pageIndex: pageNumber, annotations: [] };
                markupAnnotation.annotations.push(annotation);
                index = markupAnnotation.annotations.indexOf(annotation);
                annotObject.push(markupAnnotation);
            }
            let annotationStringified = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_textMarkup', annotationStringified);
        }
        return index;
    }
    manageAnnotations(pageAnnotations, pageNumber) {
        // tslint:disable-next-line
        let storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        if (storeObject) {
            let annotObject = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
            let index = this.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            let annotationStringified = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_textMarkup', annotationStringified);
        }
    }
    // tslint:disable-next-line
    getAnnotations(pageIndex, textMarkupAnnotations) {
        // tslint:disable-next-line
        let annotationCollection;
        // tslint:disable-next-line
        let storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
        if (storeObject) {
            let annotObject = JSON.parse(storeObject);
            let index = this.getPageCollection(annotObject, pageIndex);
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
    }
    getPageCollection(pageAnnotations, pageNumber) {
        let index = null;
        for (let i = 0; i < pageAnnotations.length; i++) {
            if (pageAnnotations[i].pageIndex === pageNumber) {
                index = i;
                break;
            }
        }
        return index;
    }
    // tslint:disable-next-line
    getAddedAnnotation(type, color, opacity, bounds, author, subject, predefinedDate, note, rect, pageNumber) {
        let date = new Date();
        // tslint:disable-next-line:max-line-length
        let modifiedDate = predefinedDate ? predefinedDate : date.toLocaleString();
        // tslint:disable-next-line
        let annotation = { textMarkupAnnotationType: type, color: color, opacity: opacity, bounds: bounds, author: author, subject: subject, modifiedDate: modifiedDate, note: note, rect: rect };
        let storedIndex = this.storeAnnotations(pageNumber, annotation);
        this.pdfViewer.annotationModule.addAction(pageNumber, storedIndex, annotation, 'Text Markup Added', null);
        return annotation;
    }
    getPageContext(pageNumber) {
        let canvas = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
        let context = null;
        if (canvas) {
            context = canvas.getContext('2d');
        }
        return context;
    }
    getDefaultValue(value) {
        return value / this.pdfViewerBase.getZoomFactor();
    }
    getMagnifiedValue(value, factor) {
        return value * factor;
    }
    /**
     * @private
     */
    clear() {
        window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_textMarkup');
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
        this.isTooltipCreated = false;
        this.isThumbnail = false;
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
        this.resizeIconMouseOver = (event) => {
            event.srcElement.style.cursor = 'default';
        };
        this.resizePanelMouseDown = (event) => {
            let proxy = this;
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
            if (!this.pdfViewerBase.getPopupNoteVisibleStatus()) {
                event.preventDefault();
                if (proxy.isDown && this.sideBarContentContainer) {
                    // prevent the sidebar from becoming too narrow, or from occupying more
                    // than half of the available viewer width.
                    if (this.pdfViewer.enableRtl) {
                        let currentWidth = this.previousX - event.clientX;
                        let width = currentWidth + proxy.offset[2];
                        const maxWidth = Math.floor(this.outerContainerWidth / 2);
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
                    }
                    else {
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
                    }
                    // tslint:disable-next-line:max-line-length
                    let viewerWidth = (proxy.pdfViewer.element.clientWidth - proxy.getViewerContainerLeft());
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
        this.sideToolbarOnClose = (event) => {
            let proxy = this;
            proxy.removeThumbnailSelectionIconTheme();
            proxy.removeBookmarkSelectionIconTheme();
            proxy.updateViewerContainerOnClose();
        };
        this.sideToolbarOnClick = (event) => {
            this.sideBarTitle.textContent = this.pdfViewer.localeObj.getConstant('Page Thumbnails');
            this.sideBarContent.setAttribute('aria-label', 'Thumbnail View Panel');
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
                    this.sideBarContent.focus();
                    proxy.isThumbnailOpen = true;
                    proxy.setThumbnailSelectionIconTheme();
                    this.updateViewerContainerOnExpand();
                }
            }
            proxy.isBookmarkOpen = false;
        };
        /**
         * @private
         */
        this.openThumbnailPane = () => {
            let proxy = this;
            let sideBarContent = document.getElementById(this.pdfViewer.element.id + '_sideBarContent');
            let sideBarContentContainer = document.getElementById(this.pdfViewer.element.id + '_sideBarContentContainer');
            let viewerContainer = document.getElementById(this.pdfViewer.element.id + '_viewerContainer');
            let pageContainer = document.getElementById(this.pdfViewer.element.id + '_pageViewContainer');
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
                }
                else {
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
        };
        this.bookmarkButtonOnClick = (event) => {
            let proxy = this;
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
                    }
                    else {
                        this.removeBookmarkSelectionIconTheme();
                        this.isBookmarkOpen = false;
                        this.updateViewerContainerOnClose();
                    }
                }
                else {
                    this.sideBarContent.focus();
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
        if (!Browser.isDevice) {
            this.createNavigationPane();
        }
    }
    createNavigationPane() {
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
        let controlLeft = this.getViewerContainerLeft();
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
    adjustPane() {
        let splitterElement = this.pdfViewerBase.getElement('_sideBarToolbarSplitter');
        let toolbarContainer = this.pdfViewerBase.getElement('_toolbarContainer');
        let toolbarHeight = toolbarContainer.getBoundingClientRect().height;
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
    createNavigationPaneMobile(option) {
        this.isNavigationToolbarVisible = true;
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_navigationToolbar', className: 'e-pv-nav-toolbar' });
        this.pdfViewerBase.viewerMainContainer.insertBefore(this.toolbarElement, this.pdfViewerBase.viewerContainer);
        let items;
        if (option === 'search') {
            let searchTemplate = '<div class="e-input-group e-pv-search-input-mobile" id="' + this.pdfViewer.element.id +
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
                        let iconElement = this.pdfViewerBase.getElement('_search_box-icon').firstElementChild;
                        if (iconElement.classList.contains('e-pv-search-close')) {
                            this.enableSearchItems(false);
                        }
                        this.pdfViewer.textSearchModule.searchButtonClick(iconElement, this.searchInput);
                    }
                },
                {
                    prefixIcon: 'e-pv-prev-search-icon e-pv-icon', id: this.pdfViewer.element.id + '_prev_occurrence',
                    click: (args) => {
                        this.pdfViewer.textSearchModule.searchPrevious();
                    }
                },
                {
                    prefixIcon: 'e-pv-next-search-icon e-pv-icon', id: this.pdfViewer.element.id + '_next_occurrence',
                    click: (args) => {
                        this.pdfViewer.textSearchModule.searchNext();
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
    }
    initiateSearchBox() {
        this.searchInput = this.pdfViewerBase.getElement('_search_input');
        this.pdfViewer.textSearchModule.searchBtn = this.pdfViewerBase.getElement('_search_box-icon').firstElementChild;
        this.searchInput.addEventListener('keyup', (event) => {
            this.enableSearchItems(true);
            let searchString = this.searchInput.value;
            if (event.which === 13) {
                this.initiateTextSearch();
            }
            else {
                this.pdfViewer.textSearchModule.resetVariables();
            }
        });
        this.pdfViewer.textSearchModule.searchInput = this.searchInput;
        this.setSearchInputWidth();
        this.enableSearchItems(false);
        this.searchInput.focus();
    }
    enableSearchItems(isEnable) {
        this.toolbar.enableItems(this.pdfViewerBase.getElement('_prev_occurrence').parentElement, isEnable);
        this.toolbar.enableItems(this.pdfViewerBase.getElement('_next_occurrence').parentElement, isEnable);
    }
    initiateBookmarks() {
        if (Browser.isDevice) {
            this.pdfViewerBase.mobileScrollerContainer.style.display = 'none';
        }
        // tslint:disable-next-line:max-line-length
        let bookmarkContainer = createElement('div', { id: this.pdfViewer.element.id + '_bookmarks_container', className: 'e-pv-bookmark-container' });
        bookmarkContainer.style.width = '100%';
        bookmarkContainer.style.height = this.pdfViewerBase.viewerContainer.style.height;
        this.pdfViewerBase.getElement('_viewerMainContainer').appendChild(bookmarkContainer);
        this.pdfViewerBase.viewerContainer.style.display = 'none';
        this.isBookmarkListOpen = true;
        this.pdfViewer.bookmarkViewModule.renderBookmarkContentMobile();
    }
    initiateTextSearch() {
        let inputString = this.searchInput.value;
        this.pdfViewer.textSearchModule.initiateSearch(inputString);
    }
    /**
     * @private
     */
    goBackToToolbar() {
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
            let bookmarkContainer = this.pdfViewerBase.getElement('_bookmarks_container');
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
    setSearchInputWidth() {
        let searchInputParent = this.searchInput.parentElement;
        let padding = window.getComputedStyle(searchInputParent.parentElement, null).getPropertyValue('padding-left');
        // tslint:disable-next-line:max-line-length
        let width = this.toolbarElement.clientWidth - this.getParentElementSearchBox('_backward').clientWidth
            - this.getParentElementSearchBox('_search_box-icon').clientWidth - this.getParentElementSearchBox('_prev_occurrence').clientWidth
            - this.getParentElementSearchBox('_next_occurrence').clientWidth - 6;
        if (padding !== '') {
            width = width - (parseFloat(padding) * 2);
        }
        searchInputParent.style.width = width + 'px';
    }
    getParentElementSearchBox(idString) {
        return this.pdfViewerBase.getElement(idString).parentElement;
    }
    /**
     * @private
     */
    createTooltipMobile(text) {
        if (!this.isTooltipCreated) { //boolean to prevent again toast creation.
            // tslint:disable-next-line:max-line-length
            let tooltipDiv = createElement('div', { className: 'e-pv-container-tooltip', id: this.pdfViewer.element.id + '_container_tooltip' });
            this.pdfViewer.element.appendChild(tooltipDiv);
            // tslint:disable-next-line:max-line-length
            this.toastObject = new Toast({ title: text, target: this.pdfViewer.element, close: this.onTooltipClose.bind(this), position: { X: 0, Y: 0 }, animation: { hide: { duration: 200, effect: 'FadeOut' } } });
            this.toastObject.appendTo(tooltipDiv);
            let y = this.pdfViewer.element.clientHeight * 0.65;
            let x = (this.pdfViewer.element.clientWidth - tooltipDiv.clientWidth) / 2;
            this.isTooltipCreated = true;
            this.toastObject.show({ position: { X: x, Y: y } });
            let tooltipChild = tooltipDiv.firstElementChild;
            if (tooltipChild) {
                tooltipChild.style.width = 'auto';
            }
        }
        else {
            if (this.toastObject) {
                this.toastObject.title = text;
                let tooltipElement = this.pdfViewerBase.getElement('_container_tooltip');
                let tooltipChild = tooltipElement.firstElementChild;
                if (tooltipChild) {
                    tooltipChild.style.width = 'auto';
                    tooltipChild.firstElementChild.firstElementChild.textContent = text;
                }
            }
        }
    }
    onTooltipClose(args) {
        this.isTooltipCreated = false;
        let tooltipElement = this.pdfViewerBase.getElement('_container_tooltip');
        this.pdfViewer.textSearchModule.isMessagePopupOpened = false;
        this.toastObject.destroy();
        tooltipElement.parentElement.removeChild(tooltipElement);
        this.toastObject = null;
    }
    /**
     * @private
     */
    toolbarResize() {
        if (this.searchInput) {
            this.searchInput.style.width = 'auto';
            this.setSearchInputWidth();
        }
    }
    createSidebarToolBar() {
        // tslint:disable-next-line:max-line-length
        this.thumbnailButton = createElement('button', { id: this.pdfViewer.element.id + '_thumbnail-view', attrs: { 'disabled': 'disabled', 'aria-label': 'Page Thumbnails', 'tabindex': '-1' } });
        this.thumbnailButton.className = 'e-pv-tbar-btn e-pv-thumbnail-view-button e-btn';
        // tslint:disable-next-line:max-line-length
        let thumbnailButtonSpan = createElement('span', { id: this.pdfViewer.element.id + '_thumbnail-view' + '_icon', className: 'e-pv-thumbnail-view-disable-icon e-pv-icon' });
        this.thumbnailButton.appendChild(thumbnailButtonSpan);
        // tslint:disable-next-line:max-line-length
        let thumbnailTooltip = new Tooltip({ content: this.pdfViewer.localeObj.getConstant('Page Thumbnails'), opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
        thumbnailTooltip.appendTo(this.thumbnailButton);
        // tslint:disable-next-line:max-line-length
        this.bookmarkButton = createElement('button', { id: this.pdfViewer.element.id + '_bookmark', attrs: { 'disabled': 'disabled', 'aria-label': 'Bookmarks', 'tabindex': '-1' } });
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
        if (this.pdfViewer.enableRtl) {
            this.closeDiv.style.left = 8 + 'px';
        }
        else {
            this.closeDiv.style.left = this.closeButtonLeft + 'px';
        }
        // tslint:disable-next-line:max-line-length
        let buttonSpan = createElement('span', { id: this.pdfViewer.element.id + '_close' + '_icon', className: 'e-pv-title-close-icon e-pv-icon' });
        this.closeDiv.appendChild(buttonSpan);
        this.sideBarTitleContainer.appendChild(this.closeDiv);
        this.closeDiv.addEventListener('click', this.sideToolbarOnClose);
    }
    createResizeIcon() {
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
    setResizeIconTop() {
        // tslint:disable-next-line:max-line-length
        if (this.sideBarToolbar && this.sideBarToolbar.clientHeight && this.resizeIcon.style.top === '') {
            this.resizeIcon.style.top = (this.sideBarToolbar.clientHeight) / 2 + 'px';
        }
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
    }
    updateViewerContainerOnExpand() {
        let proxy = this;
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
        this.isInitialLoaded = false;
        /**
         * @private
         */
        this.onWindowResize = () => {
            let proxy = this;
            if (this.pdfViewer.enableRtl) {
                // tslint:disable-next-line:max-line-length
                proxy.viewerContainer.style.right = (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) + 'px';
            }
            else {
                // tslint:disable-next-line:max-line-length
                proxy.viewerContainer.style.left = (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) + 'px';
            }
            // tslint:disable-next-line:max-line-length
            let viewerWidth = (proxy.pdfViewer.element.clientWidth - (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0));
            proxy.viewerContainer.style.width = viewerWidth + 'px';
            if (proxy.pdfViewer.toolbarModule) {
                let toolbarHeight = proxy.getElement('_toolbarContainer').getBoundingClientRect().height;
                if (proxy.isAnnotationToolbarHidden() || Browser.isDevice) {
                    // tslint:disable-next-line:max-line-length
                    proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, toolbarHeight);
                }
                else {
                    let annotationToolbarHeight = proxy.getElement('_annotation_toolbar').getBoundingClientRect().height;
                    // tslint:disable-next-line:max-line-length
                    proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, toolbarHeight + annotationToolbarHeight);
                }
            }
            else {
                proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 0);
            }
            if (proxy.pdfViewer.bookmarkViewModule && Browser.isDevice) {
                let bookmarkContainer = proxy.getElement('_bookmarks_container');
                if (bookmarkContainer) {
                    bookmarkContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 0);
                }
            }
            proxy.pageContainer.style.width = proxy.viewerContainer.clientWidth + 'px';
            if (proxy.pdfViewer.toolbarModule) {
                // tslint:disable-next-line:max-line-length
                proxy.pdfViewer.toolbarModule.onToolbarResize((proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerMainContainerWidth() : proxy.pdfViewer.element.clientWidth));
            }
            if (this.pdfViewer.enableToolbar && this.pdfViewer.thumbnailViewModule) {
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
        this.viewerContainerOnMousedown = (event) => {
            if (event.button === 0 && !this.getPopupNoteVisibleStatus()) {
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
            if (!this.getPopupNoteVisibleStatus()) {
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
                    if (this.isTextMarkupAnnotationModule()) {
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationMouseUp(event);
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
            }
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
                    case 90: //z key
                        if (this.pdfViewer.annotationModule) {
                            this.pdfViewer.annotationModule.undo();
                        }
                        break;
                    case 89: //y key
                        if (this.pdfViewer.annotationModule) {
                            this.pdfViewer.annotationModule.redo();
                        }
                        break;
                    default:
                        break;
                }
            }
            else {
                switch (event.keyCode) {
                    case 46:
                        if (this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
                            this.pdfViewer.annotationModule.deleteAnnotation();
                        }
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
                if (this.pdfViewer.textSelectionModule && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled && !this.getPopupNoteVisibleStatus()) {
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
            if (this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationMouseMove(event);
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
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled && !this.getTextMarkupAnnotationMode()) {
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
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled && !this.getCurrentTextMarkupAnnotation()) {
                    if (event.target.classList.contains('e-pv-text')) {
                        this.isViewerContainerDoubleClick = true;
                        this.pdfViewer.textSelectionModule.selectAWord(event.target, event.clientX, event.clientY, false);
                        if (!this.getTextMarkupAnnotationMode()) {
                            this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(true, false);
                            this.dblClickTimer = setTimeout(() => { this.applySelection(); }, 100);
                        }
                        else if (this.isTextMarkupAnnotationModule() && this.getTextMarkupAnnotationMode()) {
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
                        }
                    }
                }
                else if (this.getCurrentTextMarkupAnnotation()) {
                    // this.pdfViewer.annotationModule.showAnnotationPopup(event);
                }
            }
            else {
                if (event.detail === 3) {
                    if (this.isViewerContainerDoubleClick) {
                        clearTimeout(this.dblClickTimer);
                        this.isViewerContainerDoubleClick = false;
                    }
                    if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled && !this.getTextMarkupAnnotationMode()) {
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
        // tslint:disable-next-line
        this.onWindowMouseUp = (event) => {
            if (!this.getPopupNoteVisibleStatus()) {
                if (event.button === 0) {
                    if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled && !this.getTextMarkupAnnotationMode()) {
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
                    else if (this.getTextMarkupAnnotationMode()) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
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
            if (touchPoints.length === 1 && !(event.target.classList.contains('e-pv-hyperlink'))) {
                this.preventTouchEvent(event);
            }
            if (event.touches.length === 1 && this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationTouchEnd(event);
            }
            this.touchClientX = touchPoints[0].clientX;
            this.touchClientY = touchPoints[0].clientY;
            this.scrollY = touchPoints[0].clientY;
            this.previousTime = new Date().getTime();
            // tslint:disable-next-line:max-line-length
            if (touchPoints.length === 1 && !(event.target.classList.contains('e-pv-touch-select-drop') || event.target.classList.contains('e-pv-touch-ellipse'))) {
                if (Browser.isDevice && this.pageCount > 0 && !this.isThumb && !(event.target.classList.contains('e-pv-hyperlink'))) {
                    this.handleTaps(touchPoints);
                }
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
                if (Browser.isDevice) {
                    clearTimeout(this.singleTapTimer);
                    this.tapCount = 0;
                }
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
            if (Browser.isDevice) {
                clearTimeout(this.singleTapTimer);
                this.tapCount = 0;
            }
            this.preventTouchEvent(event);
            let touchPoints = event.touches;
            if (this.pdfViewer.magnificationModule) {
                this.isTouchScrolled = true;
                if (touchPoints.length > 1 && this.pageCount > 0) {
                    if (Browser.isDevice) {
                        this.isTouchScrolled = false;
                        this.mobileScrollerContainer.style.display = 'none';
                    }
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.magnificationModule.initiatePinchMove(touchPoints[0].clientX, touchPoints[0].clientY, touchPoints[1].clientX, touchPoints[1].clientY);
                }
                else if (touchPoints.length === 1 && this.getPagesPinchZoomed()) {
                    if (Browser.isDevice) {
                        this.isTouchScrolled = false;
                        this.mobileScrollerContainer.style.display = 'none';
                    }
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
            if (Browser.isDevice && this.isTouchScrolled) {
                this.currentTime = new Date().getTime();
                let duration = this.currentTime - this.previousTime;
                // tslint:disable-next-line
                let difference = this.scrollY - event.changedTouches[0].pageY;
                // tslint:disable-next-line
                let speed = (difference) / (duration);
                if (Math.abs(speed) > 1.5) {
                    // tslint:disable-next-line
                    let scrollTop = (difference) + ((duration) * speed);
                    this.viewerContainer.scrollTop += scrollTop;
                    this.updateMobileScrollerPosition();
                }
            }
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
        // tslint:disable-next-line
        this.viewerContainerOnScroll = (event) => {
            let proxy = this;
            let scrollposX = 0;
            let scrollposY = 0;
            if (event.touches && Browser.isDevice) {
                // tslint:disable-next-line
                let ratio = (this.viewerContainer.scrollHeight - this.viewerContainer.clientHeight) / (this.viewerContainer.clientHeight - this.toolbarHeight);
                if (this.isThumb) {
                    this.ispageMoved = true;
                    this.mobilePageNoContainer.style.display = 'block';
                    scrollposX = event.touches[0].pageX - this.scrollX;
                    scrollposY = event.touches[0].pageY - this.viewerContainer.offsetTop;
                    this.viewerContainer.scrollTop = scrollposY * ratio;
                    // tslint:disable-next-line
                    let containerValue = event.touches[0].pageY;
                    if (this.viewerContainer.scrollTop !== 0 && ((containerValue) <= this.viewerContainer.clientHeight)) {
                        this.mobileScrollerContainer.style.top = containerValue + 'px';
                    }
                }
                else if (event.touches[0].target.className !== 'e-pv-touch-ellipse') {
                    this.mobilePageNoContainer.style.display = 'none';
                    scrollposY = this.touchClientY - event.touches[0].pageY;
                    scrollposX = this.touchClientX - event.touches[0].pageX;
                    this.viewerContainer.scrollTop = this.viewerContainer.scrollTop + (scrollposY);
                    this.viewerContainer.scrollLeft = this.viewerContainer.scrollLeft + (scrollposX);
                    // tslint:disable-next-line
                    this.updateMobileScrollerPosition();
                    this.touchClientY = event.touches[0].pageY;
                    this.touchClientX = event.touches[0].pageX;
                }
            }
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
            // tslint:disable-next-line:max-line-length
            if (this.pdfViewer.magnificationModule && this.pdfViewer.magnificationModule.fitType === 'fitToPage' && this.currentPageNumber > 0) {
                this.viewerContainer.scrollTop = this.pageSize[this.currentPageNumber - 1].top * this.getZoomFactor();
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
                this.viewerContainer.setAttribute('aria-labelledby', this.pdfViewer.element.id + '_pageDiv_' + (this.currentPageNumber - 1));
                if (!Browser.isDevice) {
                    this.pdfViewer.toolbarModule.updateNavigationButtons();
                }
            }
            if (pageIndex !== this.currentPageNumber) {
                if (proxy.pdfViewer.thumbnailViewModule && !Browser.isDevice) {
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
            if (Browser.isDevice) {
                this.pdfViewer.element.classList.add('e-pv-mobile-view');
            }
            let controlWidth = '100%';
            let toolbarDiv;
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
            let viewerWidth = this.pdfViewer.element.clientWidth;
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
    }
    createMobilePageNumberContainer() {
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
        if (this.pdfViewer.interactionMode === 'Pan') {
            this.initiatePanning();
        }
        documentData = this.checkDocumentData(documentData);
        this.setFileName();
        let jsonObject = this.constructJsonObject(documentData, password);
        this.createAjaxRequest(jsonObject, documentData, password);
    }
    // tslint:disable-next-line
    mobileScrollContainerDown(event) {
        this.ispageMoved = false;
        this.isThumb = true;
        if (this.isTextMarkupAnnotationModule()) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage != null && Browser.isDevice) {
                let pageNumber = this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearAnnotationSelection(pageNumber);
                this.pdfViewer.toolbar.showToolbar(true);
            }
        }
        this.mobileScrollerContainer.addEventListener('touchmove', this.viewerContainerOnScroll.bind(this), true);
    }
    // tslint:disable-next-line
    setMaximumHeight(element) {
        if (!Browser.isDevice) {
            element.style.minHeight = '500px';
        }
    }
    // tslint:disable-next-line
    mobileScrollContainerEnd(event) {
        if (!this.ispageMoved) {
            this.goToPagePopup.show();
        }
        this.isThumb = false;
        this.ispageMoved = false;
        this.mobileScrollerContainer.removeEventListener('touchmove', this.viewerContainerOnScroll.bind(this), true);
        this.mobilePageNoContainer.style.display = 'none';
    }
    createAjaxRequest(jsonObject, documentData, password) {
        let request = new XMLHttpRequest();
        request.open('POST', this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.load);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); // jshint ignore:line
        if (this.pdfViewer.ajaxRequestSettings.ajaxHeaders) {
            this.setCustomAjaxHeaders(request);
        }
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
            this.viewerContainer.setAttribute('aria-labelledby', this.pdfViewer.element.id + '_pageDiv_' + (this.currentPageNumber - 1));
        }
        if (Browser.isDevice) {
            this.mobileSpanContainer.innerHTML = this.currentPageNumber.toString();
            this.mobilecurrentPageContainer.innerHTML = this.currentPageNumber.toString();
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
            this.promptElement.focus();
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
        if (spinnerElement) {
            spinnerElement.style.height = '48px';
            spinnerElement.style.width = '48px';
            spinnerElement.style.transformOrigin = '24px 24px 24px';
        }
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
        this.isInitialLoaded = false;
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
    }
    /**
     * @private
     */
    destroy() {
        if (Browser.isDevice) {
            this.pdfViewer.element.classList.remove('e-pv-mobile-view');
        }
        this.unWireEvents();
        this.clear(false);
        this.pageContainer.parentNode.removeChild(this.pageContainer);
        this.viewerContainer.parentNode.removeChild(this.viewerContainer);
        this.contextMenuModule.destroy();
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
            if (this.pdfViewer.ajaxRequestSettings) {
                if (this.pdfViewer.ajaxRequestSettings.ajaxHeaders) {
                    this.setCustomAjaxHeaders(request);
                }
            }
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
            header: '<div class="e-pv-corrupted-popup-header"> ' + this.pdfViewer.localeObj.getConstant('File Corrupted') + '</div>', visible: false,
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
    }
    createGoToPagePopup() {
        // tslint:disable-next-line:max-line-length
        let popupElement = createElement('div', { id: this.pdfViewer.element.id + '_goTopage_popup', className: 'e-pv-gotopage-popup' });
        this.goToPageElement = createElement('span', { id: this.pdfViewer.element.id + '_prompt' });
        this.goToPageElement.textContent = this.pdfViewer.localeObj.getConstant('Enter pagenumber');
        popupElement.appendChild(this.goToPageElement);
        let inputContainer = createElement('span', { className: 'e-pv-text-input' });
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
        let goToPageTextBox = new NumericTextBox({ format: '##', showSpinButton: false });
        goToPageTextBox.appendTo(this.goToPageInput);
        this.goToPageInput.addEventListener('keyup', () => {
            // tslint:disable-next-line
            let inputValue = this.goToPageInput.value;
            if (inputValue !== '' && parseFloat(inputValue) > 0 && (this.pdfViewer.pageCount + 1) > parseFloat(inputValue)) {
                this.EnableApplyButton();
            }
            else {
                this.DisableApplyButton();
            }
        });
    }
    closeGoToPagePopUp() {
        this.goToPageInput.value = '';
        this.DisableApplyButton();
    }
    EnableApplyButton() {
        // tslint:disable-next-line
        let popupElements = document.getElementsByClassName('e-pv-gotopage-apply-btn')[0];
        popupElements.removeAttribute('disabled');
    }
    DisableApplyButton() {
        // tslint:disable-next-line
        let popupElements = document.getElementsByClassName('e-pv-gotopage-apply-btn')[0];
        popupElements.setAttribute('disabled', true);
    }
    GoToPageCancelClick() {
        this.goToPagePopup.hide();
    }
    GoToPageApplyClick() {
        this.goToPagePopup.hide();
        // tslint:disable-next-line
        let pageNumber = this.goToPageInput.value;
        this.pdfViewer.navigation.goToPage(pageNumber);
        this.updateMobileScrollerPosition();
    }
    /**
     * @private
     */
    updateMobileScrollerPosition() {
        if (Browser.isDevice) {
            // tslint:disable-next-line
            let ratio = (this.viewerContainer.scrollHeight - this.viewerContainer.clientHeight) / (this.viewerContainer.clientHeight - 56);
            // tslint:disable-next-line
            let differenceRatio = (this.viewerContainer.scrollTop) / ratio;
            this.mobileScrollerContainer.style.top = (this.toolbarHeight + differenceRatio) + 'px';
        }
    }
    createPasswordPopup() {
        // tslint:disable-next-line:max-line-length
        let popupElement = createElement('div', { id: this.pdfViewer.element.id + '_password_popup', className: 'e-pv-password-popup', attrs: { 'tabindex': '-1' } });
        this.promptElement = createElement('span', { id: this.pdfViewer.element.id + '_prompt', attrs: { 'tabindex': '-1' } });
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
            header: this.pdfViewer.localeObj.getConstant('Password Protected'), visible: false,
            close: this.passwordCancel.bind(this), target: this.pdfViewer.element, beforeClose: () => {
                this.passwordPopup.destroy();
                this.getElement('_password_popup').remove();
                this.passwordPopup = null;
                this.waitingPopup = this.getElement('_loadingIndicator');
                if (this.waitingPopup != null) {
                    hideSpinner(this.waitingPopup);
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
    }
    unWireEvents() {
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
        this.enableAnnotationAddTools(false);
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
        if (!Browser.isDevice) {
            this.enableAnnotationAddTools(true);
        }
    }
    enableAnnotationAddTools(isEnable) {
        if (this.pdfViewer.toolbarModule) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableAnnotationAddTools(isEnable);
            }
        }
    }
    applySelection() {
        if (window.getSelection().anchorNode !== null) {
            this.pdfViewer.textSelectionModule.applySpanForSelection();
        }
        this.isViewerContainerDoubleClick = false;
    }
    handleTaps(touchPoints) {
        this.singleTapTimer = setTimeout(() => { this.onSingleTap(touchPoints); }, 300);
        this.tapCount++;
        // tslint:disable-next-line
        let timer = setTimeout(() => { this.onDoubleTap(touchPoints); }, 200);
        if (this.tapCount > 2) {
            this.tapCount = 0;
        }
    }
    onSingleTap(touches) {
        if (!this.isLongTouchPropagated && !this.navigationPane.isNavigationToolbarVisible) {
            if (this.pdfViewer.toolbarModule) {
                if ((this.touchClientX >= touches[0].clientX - 10) && (this.touchClientX <= touches[0].clientX + 10) &&
                    (this.touchClientY >= touches[0].clientY - 10) && (this.touchClientY <= touches[0].clientY + 10)) {
                    if (!this.isTapHidden) {
                        this.viewerContainer.scrollTop -= this.getElement('_toolbarContainer').clientHeight * this.getZoomFactor();
                        this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 0);
                        if (this.pdfViewer.toolbar.moreDropDown) {
                            let dropDown = this.getElement('_more_option-popup');
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
    }
    onDoubleTap(touches) {
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
    }
    preventTouchEvent(event) {
        if (this.pdfViewer.textSelectionModule) {
            // tslint:disable-next-line:max-line-length
            if (!this.isPanMode && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled && this.getSelectTextMarkupCurrentPage() == null) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }
    // tslint:disable-next-line
    initPageDiv(pageValues) {
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateTotalPage();
            if (Browser.isDevice && this.mobiletotalPageContainer) {
                this.mobiletotalPageContainer.innerHTML = this.pageCount.toString();
                this.pageNoContainer.innerHTML = '(1-' + this.pageCount.toString() + ')';
            }
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
        if (this.pdfViewer.ajaxRequestSettings.ajaxHeaders) {
            this.setCustomAjaxHeaders(request);
        }
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
                if (this.pdfViewer.enableRtl) {
                    pageDiv.style.right = this.updateLeftPosition(pageIndex) + 'px';
                }
                else {
                    pageDiv.style.left = this.updateLeftPosition(pageIndex) + 'px';
                }
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
                                canvas.height = pageHeight * window.devicePixelRatio;
                                canvas.width = pageWidth * window.devicePixelRatio;
                            }
                            // tslint:disable-next-line
                            context.setTransform(matrix.Elements[0], matrix.Elements[1], matrix.Elements[2], matrix.Elements[3], matrix.Elements[4], matrix.Elements[5]);
                            context.drawImage(image, 0, 0, canvas.width, canvas.height);
                            this.showPageLoadingIndicator(pageIndex, false);
                            if (pageIndex === 0 && this.isDocumentLoaded) {
                                this.isInitialLoaded = true;
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
    }
    // tslint:disable-next-line
    renderTextContent(data, pageIndex) {
        // tslint:disable-next-line
        let texts = data['textContent'];
        // tslint:disable-next-line
        let bounds = data['textBounds'];
        // tslint:disable-next-line
        let rotation = data['rotation'];
        let textLayer = this.getElement('_textLayer_' + pageIndex);
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
    }
    renderPageContainer(pageNumber, pageWidth, pageHeight, topValue) {
        // tslint:disable-next-line:max-line-length
        let pageDiv = createElement('div', { id: this.pdfViewer.element.id + '_pageDiv_' + pageNumber, className: 'e-pv-page-div', attrs: { 'tabindex': '0' } });
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
    // tslint:disable-next-line:max-line-length
    renderPageCanvas(pageDiv, pageWidth, pageHeight, pageNumber, displayMode) {
        let pageCanvas = createElement('canvas', { id: this.pdfViewer.element.id + '_pageCanvas_' + pageNumber, className: 'e-pv-page-canvas' });
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
                if (!this.pdfViewer.enableRtl) {
                    pageDiv.style.left = leftPosition + 'px';
                }
                else {
                    pageDiv.style.right = leftPosition + 'px';
                }
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
        blobUrl = URL.createObjectURL(blobUrl);
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
        if (this.isTextMarkupAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            let textMarkupAnnotationCollection = this.pdfViewer.annotationModule.textMarkupAnnotationModule.saveTextMarkupAnnotations();
            jsonObject = { hashId: this.hashId, textMarkupAnnotations: textMarkupAnnotationCollection };
        }
        else {
            jsonObject = { hashId: this.hashId };
        }
        let request = new XMLHttpRequest();
        request.open('POST', this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.download);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); // jshint ignore:line
        if (this.pdfViewer.ajaxRequestSettings.ajaxHeaders) {
            this.setCustomAjaxHeaders(request);
        }
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
                    if (Browser.isIE || Browser.info.name === 'edge') {
                        window.navigator.msSaveOrOpenBlob(blobUrl, this.pdfViewer.fileName);
                    }
                    else {
                        this.downloadDocument(blobUrl);
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
    createRequestForRender(pageIndex) {
        let canvas = this.getElement('_pageCanvas_' + pageIndex);
        let oldCanvas = this.getElement('_oldCanvas_' + pageIndex);
        this.showPageLoadingIndicator(pageIndex, true);
        if (this.getPagesZoomed()) {
            if (this.isInitialLoaded) {
                this.showPageLoadingIndicator(pageIndex, false);
            }
        }
        if (canvas) {
            if (!isNaN(parseFloat(canvas.style.width)) || oldCanvas) {
                if (this.isInitialLoaded) {
                    this.showPageLoadingIndicator(pageIndex, false);
                }
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
                        if (this.pdfViewer.ajaxRequestSettings.ajaxHeaders) {
                            this.setCustomAjaxHeaders(request);
                        }
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
        let blobObj = this.createBlobUrl(data['image'].split('base64,')[1], 'image/png');
        let blobUrl = URL.createObjectURL(blobObj);
        // tslint:disable-next-line
        let storeObject = {
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
    }
    /**
     * @private
     */
    setCustomAjaxHeaders(request) {
        for (let i = 0; i < this.pdfViewer.ajaxRequestSettings.ajaxHeaders.length; i++) {
            // tslint:disable-next-line:max-line-length
            request.setRequestHeader(this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerName, this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerValue);
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
        // tslint:disable-next-line
        let blob = new Blob(byteArrays, { type: contentType });
        return blob;
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
    /**
     * @private
     */
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
    isAnnotationToolbarHidden() {
        if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
            return this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden;
        }
        else {
            return true;
        }
    }
    /**
     * @private
     */
    getTextMarkupAnnotationMode() {
        if (this.isTextMarkupAnnotationModule()) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode;
        }
        else {
            return false;
        }
    }
    getCurrentTextMarkupAnnotation() {
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
    }
    /**
     * @private
     */
    getSelectTextMarkupCurrentPage() {
        if (this.isTextMarkupAnnotationModule()) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
        }
        else {
            return null;
        }
    }
    /**
     * @private
     */
    getAnnotationToolStatus() {
        if (this.pdfViewer.toolbarModule) {
            return this.pdfViewer.toolbarModule.annotationToolbarModule.isAnnotationButtonsEnabled();
        }
        else {
            return false;
        }
    }
    /**
     * @private
     */
    getPopupNoteVisibleStatus() {
        if (this.pdfViewer.annotationModule) {
            return this.pdfViewer.annotationModule.isPopupNoteVisible;
        }
        else {
            return false;
        }
    }
    /**
     * @private
     */
    isTextMarkupAnnotationModule() {
        if (this.pdfViewer.annotationModule) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule;
        }
        else {
            return null;
        }
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
        let textLayer;
        if (!textDiv) {
            textLayer = createElement('div', { id: this.pdfViewer.element.id + '_textLayer_' + pageNumber, className: 'e-pv-text-layer' });
            textLayer.style.width = pageWidth + 'px';
            textLayer.style.height = pageHeight + 'px';
            pageDiv.appendChild(textLayer);
        }
        return textLayer;
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    renderTextContents(pageNumber, textContents, textBounds, rotation) {
        let textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        let canvasElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageNumber);
        if (canvasElement && textLayer.childNodes.length === 0) {
            for (let i = 0; i < textContents.length; i++) {
                // tslint:disable-next-line
                let bounds = textBounds[i];
                // tslint:disable-next-line:max-line-length
                let textDiv = createElement('div', { id: this.pdfViewer.element.id + '_text_' + pageNumber + '_' + i, className: 'e-pv-text', attrs: { 'tabindex': '0' } });
                let textContent = textContents[i];
                textContent = textContent.replace(/</g, '&lt;');
                textContent = textContent.replace(/>/g, '&gt;');
                textDiv.innerHTML = textContent.replace(/&nbsp;/g, ' ');
                // tslint:disable-next-line
                let newLine = textContents[i].replace(/  +/g, ' ');
                if (newLine !== ' ') {
                    textDiv.style.whiteSpace = 'pre';
                }
                this.setStyleToTextDiv(textDiv, bounds.X, bounds.Y, bounds.Bottom, bounds.Width, bounds.Height);
                this.setTextElementProperties(textDiv);
                let context = canvasElement.getContext('2d');
                context.font = textDiv.style.fontSize + ' ' + textDiv.style.fontFamily;
                let contextWidth = context.measureText(textContents[i].replace(/(\r\n|\n|\r)/gm, '')).width;
                let scale = bounds.Width * this.pdfViewerBase.getZoomFactor() / contextWidth;
                this.applyTextRotation(scale, textDiv, rotation, bounds.Rotation);
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
    resizeTextContents(pageNumber, textContents, textBounds, rotation) {
        let textLayer = this.pdfViewerBase.getElement('_textLayer_' + pageNumber);
        let canvasElement = this.pdfViewerBase.getElement('_pageCanvas_' + pageNumber);
        if (canvasElement) {
            for (let i = 0; i < textLayer.childNodes.length; i++) {
                // tslint:disable-next-line
                let bounds;
                let textDiv = this.pdfViewerBase.getElement('_text_' + pageNumber + '_' + i);
                if (textBounds) {
                    bounds = textBounds[i];
                    this.setStyleToTextDiv(textDiv, bounds.X, bounds.Y, bounds.Bottom, bounds.Width, bounds.Height);
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
                this.applyTextRotation(scale, textDiv, rotation, bounds.Rotation);
                this.resizeExcessDiv(textLayer, textDiv);
            }
        }
        else {
            textLayer.parentElement.removeChild(textLayer);
        }
    }
    applyTextRotation(scale, textDiv, rotation, textRotation) {
        let scaleString = 'scale(' + scale + ')';
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
        // tslint:disable-next-line
        let rotation;
        if (renderObject) {
            // tslint:disable-next-line
            let data = JSON.parse(renderObject);
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
            let textElements = this.textBoundsArray.filter(obj => {
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
    setStyleToTextDiv(textDiv, left, top, bottom, width, height) {
        textDiv.style.left = left * this.pdfViewerBase.getZoomFactor() + 'px';
        textDiv.style.top = top * this.pdfViewerBase.getZoomFactor() + 'px';
        let textHeight = height * this.pdfViewerBase.getZoomFactor();
        textDiv.style.height = textHeight + 'px';
        textDiv.style.fontSize = height * this.pdfViewerBase.getZoomFactor() + 'px';
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
    /**
     * @private
     */
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
    getPageIndex(element) {
        let pageId;
        // tslint:disable-next-line
        let parentElement = element.parentElement;
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
    }
    /**
     * @private
     */
    getTextIndex(element, pageIndex) {
        let textIndex;
        // tslint:disable-next-line
        let parentElement = element.parentElement;
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
            content: '<div class="e-pv-notification-popup-content" tabindex = "0">' + text + '</div>', target: this.pdfViewer.element,
            beforeClose: () => {
                this.notifyDialog.destroy();
                this.pdfViewer.element.removeChild(popupElement);
                if (this.pdfViewer.textSearchModule) {
                    this.pdfViewer.textSearch.isMessagePopupOpened = false;
                }
            }
        });
        if (this.pdfViewer.enableRtl) {
            this.notifyDialog.enableRtl = true;
        }
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
        this.copyContextMenu = [{ text: this.pdfViewer.localeObj.getConstant('Copy'), iconCss: 'e-pv-copy-icon' },
            { text: this.pdfViewer.localeObj.getConstant('Highlight context'), iconCss: 'e-pv-highlight-icon' },
            { text: this.pdfViewer.localeObj.getConstant('Underline context'), iconCss: 'e-pv-underline-icon' },
            { text: this.pdfViewer.localeObj.getConstant('Strikethrough context'), iconCss: 'e-pv-strikethrough-icon' }];
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
    }
    contextMenuOnCreated(args) {
        // tslint:disable-next-line:max-line-length
        let items = [this.pdfViewer.localeObj.getConstant('Highlight context'), this.pdfViewer.localeObj.getConstant('Underline context'),
            this.pdfViewer.localeObj.getConstant('Strikethrough context')];
        if (this.pdfViewer.annotationModule) {
            if (!this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
                this.contextMenuObj.enableItems(items, false);
            }
        }
        else {
            this.contextMenuObj.enableItems(items, false);
        }
    }
    contextMenuOnBeforeOpen(args) {
        if (this.pdfViewer.textSelectionModule) {
            if (args.event) {
                let isClickWithinSelectionBounds = this.isClickWithinSelectionBounds(args.event);
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
    }
    // tslint:disable-next-line
    isClickWithinSelectionBounds(event) {
        let isWithin = false;
        let bounds = this.pdfViewer.textSelectionModule.getCurrentSelectionBounds(this.pdfViewerBase.currentPageNumber - 1);
        if (bounds) {
            let currentBound = bounds;
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
    }
    /**
     * @private
     */
    destroy() {
        this.contextMenuObj.destroy();
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
     * @param  {number} zoomValue - Defines the Zoom Value for fit the page in the Container
     * @returns void
     */
    fitToPage() {
        let zoomValue = this.calculateFitZoomFactor('fitToPage');
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
            // tslint:disable-next-line:radix
            return parseInt((scaleX * 100).toString());
        }
        else {
            let pageHeight = 0;
            for (let i = 0; i < this.pdfViewerBase.pageSize.length; i++) {
                pageHeight = this.pdfViewerBase.pageSize[i].height;
                if (pageHeight > highestHeight) {
                    highestHeight = pageHeight;
                }
            }
            // tslint:disable-next-line:radix
            return parseInt(((viewerHeight / highestHeight) * 100).toString());
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
            let zoomPercentage = parseInt((this.zoomFactor * 100).toString()) + '%';
            this.pdfViewerBase.navigationPane.createTooltipMobile(zoomPercentage);
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
            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotationsPinch(i);
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
        if (this.pdfViewerBase.isInitialLoaded) {
            this.renderInSeparateThread(this.reRenderPageNumber);
            this.isPagesZoomed = false;
        }
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
            this.calculateScrollValues(scrollValue);
        }
        this.pdfViewerBase.renderedPagesList = [];
        this.pdfViewerBase.pinchZoomStorage = [];
    }
    calculateScrollValues(scrollValue) {
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
            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                let annotationLayers = document.querySelectorAll('canvas[id*="_annotationCanvas_"]');
                for (let j = 0; j < annotationLayers.length; j++) {
                    let pageNumber = annotationLayers[j].id.split('_annotationCanvas_')[1];
                    // tslint:disable-next-line:radix
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotationsPinch(parseInt(pageNumber));
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
                if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                    let annotationCanvas = this.pdfViewerBase.getElement('_annotationCanvas_' + i);
                    annotationCanvas.id = this.pdfViewer.element.id + '_old_annotationCanvas_' + i;
                }
                // tslint:disable-next-line:max-line-length
                this.pdfViewerBase.renderPageCanvas(this.pdfViewerBase.getElement('_pageDiv_' + i), this.pdfViewerBase.pageSize[i].width * this.zoomFactor, this.pdfViewerBase.pageSize[i].height * this.zoomFactor, i, 'none');
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
                        if (this.pdfViewer.enableRtl) {
                            pageDiv.style.right = this.pdfViewerBase.updateLeftPosition(i) + 'px';
                        }
                        else {
                            pageDiv.style.left = this.pdfViewerBase.updateLeftPosition(i) + 'px';
                        }
                        let canvas = this.pdfViewerBase.getElement('_pageCanvas_' + i);
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
            this.isMagnified = false;
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
    /**
     * @private
     */
    onDoubleTapMagnification() {
        this.pdfViewer.toolbarModule.showToolbar(false);
        let scrollValue = this.pdfViewerBase.viewerContainer.scrollTop;
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
     * @param  {number} pageNumber - Defines the page number to navigate
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
     * @public
     */
    openThumbnailPane() {
        this.pdfViewerBase.navigationPane.openThumbnailPane();
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
        if (this.pdfViewer.ajaxRequestSettings.ajaxHeaders) {
            this.pdfViewerBase.setCustomAjaxHeaders(request);
        }
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
                // tslint:disable-next-line:max-line-length
                let pageLink = createElement('a', { id: 'page_' + i, attrs: { 'aria-label': 'Thumbnail of Page' + (i + 1), 'tabindex': '-1', 'role': 'link' } });
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
        this.isUndoRedoBtnsVisible = true;
        this.isAnnotationEditBtnVisible = true;
        this.onToolbarKeydown = (event) => {
            let targetId = event.target.id;
            if (!(targetId === this.pdfViewer.element.id + '_currentPageInput' || targetId === this.pdfViewer.element.id + '_zoomDropDown')) {
                event.preventDefault();
                event.stopPropagation();
            }
        };
        this.toolbarClickHandler = (args) => {
            // tslint:disable-next-line:max-line-length
            if (!Browser.isDevice) {
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
            }
            this.handleToolbarButtonClick(args);
            // tslint:disable-next-line:max-line-length
            if (!Browser.isDevice) {
                if (!(args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[1] || args.originalEvent.target === this.zoomDropdownItem.parentElement.childNodes[2] || args.originalEvent.target === this.currentPageBoxElement || args.originalEvent.target === this.textSearchItem.childNodes[0])) {
                    args.originalEvent.target.blur();
                    this.pdfViewerBase.focusViewerContainer();
                }
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
    }
    /**
     * Shows /hides the toolbar in the PdfViewer
     * @param  {boolean} enableToolbar - If set true , its show the Toolbar
     * @returns void
     */
    showToolbar(enableToolbar) {
        let toolbar = this.toolbarElement;
        if (enableToolbar) {
            toolbar.style.display = 'block';
            if (Browser.isDevice) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.hideMobileAnnotationToolbar();
            }
        }
        else {
            toolbar.style.display = 'none';
        }
    }
    /**
     * Shows/hides the Navigation toolbar in the PdfViewer
     * @param  {boolean} enableNavigationToolbar - If set true , its show the Navigation Toolbar
     * @returns void
     */
    showNavigationToolbar(enableNavigationToolbar) {
        if (!Browser.isDevice) {
            let navigationToolbar = this.pdfViewerBase.navigationPane.sideBarToolbar;
            let navigationToolbarSplitter = this.pdfViewerBase.navigationPane.sideBarToolbarSplitter;
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
    }
    /**
     * Shows /hides the the toolbar items in the PdfViewer
     * @param  {string[]} items - Defines the toolbar items in the toolbar
     * @param  {boolean} isVisible - If set true, then its show the toolbar Items
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
    }
    /**
     * Enables /disables the the toolbar items in the PdfViewer
     * @param  {string[]} items - Defines the toolbar items in the toolbar
     * @param  {boolean} isEnable - If set true, then its Enable the toolbar Items
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
                case 'UndoRedoTool':
                    this.enableUndoRedoTool(isEnable);
                    break;
                case 'AnnotationEditTool':
                    this.enableAnnotationEditTool(isEnable);
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
        this.applyHideToToolbar(enableDownloadOption, 21, 21);
    }
    showPrintOption(enablePrintOption) {
        this.isPrintBtnVisible = enablePrintOption;
        this.applyHideToToolbar(enablePrintOption, 20, 20);
    }
    showSearchOption(enableSearchOption) {
        this.isSearchBtnVisible = enableSearchOption;
        this.applyHideToToolbar(enableSearchOption, 18, 18);
    }
    showUndoRedoTool(isEnable) {
        this.isUndoRedoBtnsVisible = isEnable;
        this.applyHideToToolbar(isEnable, 16, 17);
    }
    showAnnotationEditTool(isEnable) {
        this.isAnnotationEditBtnVisible = isEnable;
        this.applyHideToToolbar(isEnable, 19, 19);
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
    enableUndoRedoTool(isEnable) {
        this.toolbar.enableItems(this.undoItem.parentElement, isEnable);
        this.toolbar.enableItems(this.redoItem.parentElement, isEnable);
    }
    enableAnnotationEditTool(isEnable) {
        this.toolbar.enableItems(this.annotationItem.parentElement, isEnable);
    }
    /**
     * @private
     */
    resetToolbar() {
        if (!Browser.isDevice) {
            this.currentPageBox.min = 0;
            this.currentPageBox.value = 0;
            this.updateTotalPage();
            this.updateToolbarItems();
            if (this.annotationToolbarModule) {
                this.annotationToolbarModule.clear();
            }
        }
    }
    /**
     * @private
     */
    updateToolbarItems() {
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
    }
    /**
     * @private
     */
    updateUndoRedoButtons() {
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
    }
    // tslint:disable-next-line
    enableCollectionAvailable(collection, item) {
        if (collection.length > 0) {
            this.toolbar.enableItems(item, true);
        }
        else {
            this.toolbar.enableItems(item, false);
        }
    }
    disableUndoRedoButtons() {
        this.toolbar.enableItems(this.undoItem.parentElement, false);
        this.toolbar.enableItems(this.redoItem.parentElement, false);
    }
    /**
     * @private
     */
    destroy() {
        this.unWireEvent();
        if (this.moreDropDown) {
            this.moreDropDown.destroy();
        }
        if (this.annotationToolbarModule) {
            this.annotationToolbarModule.destroy();
        }
        this.toolbar.destroy();
        this.toolbarElement.remove();
    }
    /**
     * @private
     */
    updateCurrentPage(pageIndex) {
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
    }
    /**
     * @private
     */
    updateTotalPage() {
        if (!Browser.isDevice) {
            if (this.pdfViewerBase.pageCount > 0) {
                this.currentPageBox.min = 1;
            }
            this.totalPageItem.textContent = 'of ' + this.pdfViewerBase.pageCount.toString();
        }
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
        if (!Browser.isDevice) {
            this.toolbar = new Toolbar({
                clicked: this.toolbarClickHandler, width: '', height: '', overflowMode: 'Popup',
                items: this.createToolbarItems(), created: () => {
                    this.createZoomDropdown();
                    this.createNumericTextBox();
                    this.toolbar.refreshOverflow();
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
    }
    // tslint:disable-next-line
    createToolbarItems() {
        let currentPageInputTemplate = this.createCurrentPageInputTemplate();
        let totalPageTemplate = this.createTotalPageTemplate();
        let zoomDropDownTemplateString = this.createZoomDropdownElement();
        // tslint:disable-next-line
        let items = [];
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
    }
    afterToolbarCreation() {
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
    }
    /**
     * @private
     */
    addClassToolbarItem(idString, className, tooltipText) {
        let element = this.pdfViewerBase.getElement(idString);
        element.classList.add(className);
        element.classList.add('e-pv-tbar-btn');
        element.setAttribute('aria-label', tooltipText);
        element.parentElement.classList.add(className + '-container');
        element.parentElement.classList.add('e-popup-text');
        element.parentElement.id = this.pdfViewer.element.id + idString + 'Container';
        if (element.childNodes.length > 0) {
            let spanElement = element.childNodes[0];
            spanElement.id = this.pdfViewer.element.id + idString + 'Icon';
            spanElement.classList.remove('e-icons');
            spanElement.classList.remove('e-btn-icon');
            if (this.pdfViewer.enableRtl) {
                spanElement.classList.add('e-right');
            }
            let textElement = element.childNodes[1];
            if (textElement) {
                if (textElement.classList.contains('e-tbar-btn-text')) {
                    textElement.id = this.pdfViewer.element.id + idString + 'Text';
                }
            }
        }
        element.style.width = '';
        this.createTooltip(element, tooltipText);
        return element;
    }
    addPropertiesToolItemContainer(element, className, idString) {
        if (className !== null) {
            element.classList.add(className);
        }
        element.classList.add('e-popup-text');
        element.id = this.pdfViewer.element.id + idString;
    }
    createZoomDropdownElement() {
        // tslint:disable-next-line:max-line-length
        let zoomDropdownElement = this.createToolbarItem('input', this.pdfViewer.element.id + '_zoomDropDown', null);
        return zoomDropdownElement.outerHTML;
    }
    createZoomDropdown() {
        // tslint:disable-next-line:max-line-length
        let items = [{ percent: '50%', id: '0' }, { percent: '75%', id: '1' }, { percent: '100%', id: '2' }, { percent: '125%', id: '3' },
            // tslint:disable-next-line:max-line-length
            { percent: '150%', id: '4' }, { percent: '200%', id: '5' }, { percent: '400%', id: '6' }, { percent: this.pdfViewer.localeObj.getConstant('Fit Page'), id: '7' }, { percent: this.pdfViewer.localeObj.getConstant('Fit Width'), id: '8' }, { percent: this.pdfViewer.localeObj.getConstant('Automatic'), id: '9' }
        ];
        // tslint:disable-next-line:max-line-length
        this.zoomDropDown = new ComboBox({ dataSource: items, text: '100%', fields: { text: 'percent', value: 'id' }, readonly: true, cssClass: 'e-pv-zoom-drop-down', popupHeight: '402px', showClearButton: false });
        this.zoomDropDown.appendTo(this.pdfViewerBase.getElement('_zoomDropDown'));
    }
    createCurrentPageInputTemplate() {
        // tslint:disable-next-line:max-line-length
        let goToPageElement = this.createToolbarItem('input', this.pdfViewer.element.id + '_currentPageInput', null);
        return goToPageElement.outerHTML;
    }
    createTotalPageTemplate() {
        // tslint:disable-next-line:max-line-length
        let totalPageElement = this.createToolbarItem('span', this.pdfViewer.element.id + '_totalPage', 'e-pv-total-page');
        return totalPageElement.outerHTML;
    }
    createNumericTextBox() {
        this.currentPageBox = new NumericTextBox({ value: 0, format: '##', cssClass: 'e-pv-current-page-box', showSpinButton: false });
        this.currentPageBoxElement = this.pdfViewerBase.getElement('_currentPageInput');
        this.currentPageBox.appendTo(this.currentPageBoxElement);
    }
    createToolbarItemsForMobile() {
        this.toolbarElement.classList.add('e-pv-mobile-toolbar');
        let template = '<button id="' + this.pdfViewer.element.id + '_more_option" class="e-tbar-btn"></button>';
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
    }
    createMoreOption(idString) {
        this.moreOptionItem = document.getElementById(idString);
        let items = [
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
            open: (args) => {
                let dropdownButtonPosition = this.moreDropDown.element.getBoundingClientRect();
                // tslint:disable-next-line:max-line-length
                if (!this.pdfViewer.enableRtl) {
                    args.element.parentElement.style.left = dropdownButtonPosition.left + dropdownButtonPosition.width - args.element.parentElement.offsetWidth + 'px';
                }
            }, select: (args) => {
                switch (args.item.id) {
                    case this.pdfViewer.element.id + '_menu_download':
                        this.pdfViewerBase.download();
                        break;
                    case this.pdfViewer.element.id + '_menu_bookmarks':
                        this.showToolbar(false);
                        this.pdfViewerBase.navigationPane.createNavigationPaneMobile('bookmarks');
                        break;
                    default:
                        break;
                }
            }, beforeItemRender: (args) => {
                if (args.item.id === this.pdfViewer.element.id + '_menu_bookmarks') {
                    if (!this.pdfViewer.bookmarkViewModule || !this.pdfViewer.bookmarkViewModule.bookmarks) {
                        args.element.classList.add('e-disabled');
                    }
                    else {
                        args.element.classList.remove('e-disabled');
                    }
                }
            }, close: (args) => {
                this.moreOptionItem.blur();
                this.pdfViewerBase.focusViewerContainer();
            }
        });
        this.moreDropDown.appendTo('#' + idString);
    }
    createToolbarItem(elementName, id, className) {
        let toolbarItem = createElement(elementName, { id: id });
        if (className !== null) {
            toolbarItem.className = className;
        }
        if (elementName === 'input' && id !== this.pdfViewer.element.id + '_zoomDropDown') {
            toolbarItem.type = 'text';
        }
        return toolbarItem;
    }
    /**
     * @private
     */
    createTooltip(toolbarItem, tooltipText) {
        if (tooltipText !== null) {
            // tslint:disable-next-line
            let tooltip = new Tooltip({ content: tooltipText, opensOn: 'Hover', beforeOpen: this.onTooltipBeforeOpen.bind(this) });
            tooltip.appendTo(toolbarItem);
        }
    }
    onTooltipBeforeOpen(args) {
        if (!this.pdfViewer.toolbarSettings.showTooltip && this.toolbarElement.contains(args.target)) {
            args.cancel = true;
        }
        if (this.annotationToolbarModule) {
            // tslint:disable-next-line:max-line-length
            if (!this.pdfViewer.annotationToolbarSettings.showTooltip && this.annotationToolbarModule.toolbarElement.contains(args.target)) {
                args.cancel = true;
            }
        }
    }
    createFileElement(toolbarElement) {
        // tslint:disable-next-line:max-line-length
        this.fileInputElement = createElement('input', { id: this.pdfViewer.element.id + '_fileUploadElement', styles: 'position:fixed; left:-100em', attrs: { 'type': 'file' } });
        this.fileInputElement.setAttribute('accept', '.pdf');
        toolbarElement.appendChild(this.fileInputElement);
    }
    wireEvent() {
        this.fileInputElement.addEventListener('change', this.loadDocument);
        if (!Browser.isDevice) {
            this.toolbarElement.addEventListener('mouseup', this.toolbarOnMouseup.bind(this));
            this.currentPageBoxElement.addEventListener('focusout', this.textBoxFocusOut);
            this.currentPageBoxElement.addEventListener('keypress', this.navigateToPage);
            this.zoomDropDown.change = this.zoomPercentSelect.bind(this);
            this.zoomDropDown.element.addEventListener('keypress', this.onZoomDropDownInput.bind(this));
            this.zoomDropDown.element.addEventListener('click', this.onZoomDropDownInputClick.bind(this));
        }
    }
    unWireEvent() {
        this.fileInputElement.removeEventListener('change', this.loadDocument);
        if (!Browser.isDevice) {
            this.toolbarElement.removeEventListener('mouseup', this.toolbarOnMouseup.bind(this));
            this.currentPageBoxElement.removeEventListener('focusout', this.textBoxFocusOut);
            this.currentPageBoxElement.removeEventListener('keypress', this.navigateToPage);
            this.zoomDropDown.removeEventListener('change', this.zoomPercentSelect);
            this.zoomDropDown.element.removeEventListener('keypress', this.onZoomDropDownInput);
            this.zoomDropDown.element.removeEventListener('click', this.onZoomDropDownInputClick);
        }
    }
    /**
     * @private
     */
    onToolbarResize(viewerWidth) {
        if (Browser.isDevice) {
            this.pdfViewerBase.navigationPane.toolbarResize();
        }
        else {
            this.toolbar.refreshOverflow();
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
    handleToolbarButtonClick(args) {
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
        if (!Browser.isDevice) {
            // tslint:disable-next-line:radix
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
        if (!Browser.isDevice) {
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
        else {
            this.showToolbar(false);
            this.pdfViewerBase.navigationPane.createNavigationPaneMobile('search');
        }
    }
    initiateAnnotationMode() {
        if (this.annotationToolbarModule) {
            if (this.pdfViewerBase.isPanMode && this.annotationToolbarModule.isToolbarHidden) {
                this.pdfViewerBase.initiateTextSelectMode();
            }
            this.DisableInteractionTools();
            this.annotationToolbarModule.showAnnotationToolbar(this.annotationItem);
        }
    }
    /**
     * @private
     */
    DisableInteractionTools() {
        this.deSelectItem(this.textSelectItem);
        this.deSelectItem(this.panItem);
    }
    /**
     * @private
     */
    selectItem(element) {
        element.classList.add('e-pv-select');
    }
    /**
     * @private
     */
    deSelectItem(element) {
        element.classList.remove('e-pv-select');
    }
    /**
     * @private
     */
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
    }
    showSeparator(toolbarItems) {
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
    }
    applyToolbarSettings() {
        let toolbarSettingsItems = this.pdfViewer.toolbarSettings.toolbarItem;
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
    }
    /**
     * @private
     */
    getModuleName() {
        return 'Toolbar';
    }
}

/**
 * @hidden
 */
class AnnotationToolbar {
    constructor(viewer, viewerBase, toolbar) {
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
    initializeAnnotationToolbar() {
        // tslint:disable-next-line:max-line-length
        this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_annotation_toolbar', className: 'e-pv-annotation-toolbar' });
        this.pdfViewerBase.viewerMainContainer.appendChild(this.toolbarElement);
        this.toolbar = new Toolbar({
            width: '', height: '', overflowMode: 'Popup',
            items: this.createToolbarItems(), clicked: this.onToolbarClicked.bind(this),
            created: () => {
                this.createDropDowns();
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
    }
    createMobileAnnotationToolbar(isEnable) {
        if (Browser.isDevice) {
            if (this.toolbarElement == null && isEnable) {
                this.isMobileAnnotEnabled = true;
                // tslint:disable-next-line:max-line-length
                this.toolbarElement = createElement('div', { id: this.pdfViewer.element.id + '_annotation_toolbar', className: 'e-pv-annotation-toolbar' });
                this.pdfViewerBase.viewerMainContainer.insertBefore(this.toolbarElement, this.pdfViewerBase.viewerContainer);
                this.toolbar = new Toolbar({
                    width: '', height: '', overflowMode: 'Popup',
                    items: this.createMobileToolbarItems(), clicked: this.onToolbarClicked.bind(this),
                    created: () => {
                        this.createDropDowns();
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
    }
    hideMobileAnnotationToolbar() {
        if (this.toolbarElement != null) {
            this.toolbarElement.style.display = 'none';
        }
    }
    // tslint:disable-next-line
    createMobileToolbarItems() {
        let colorTemplate = this.getTemplate('span', '_annotation_color', 'e-pv-annotation-color-container');
        let opacityTemplate = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        // tslint:disable-next-line
        let items = [];
        items.push({ prefixIcon: 'e-pv-backward-icon e-pv-icon', tooltipText: this.pdfViewer.localeObj.getConstant('Go Back'), id: this.pdfViewer.element.id + '_backward', click: this.goBackToToolbar.bind(this) });
        // tslint:disable-next-line:max-line-length
        items.push({ template: colorTemplate, align: 'right' });
        items.push({ template: opacityTemplate, align: 'right' });
        items.push({ type: 'Separator', align: 'right' });
        // tslint:disable-next-line:max-line-length
        items.push({ prefixIcon: 'e-pv-annotation-delete-icon e-pv-icon', className: 'e-pv-annotation-delete-container', id: this.pdfViewer.element.id + '_annotation_delete', align: 'right' });
        return items;
    }
    goBackToToolbar() {
        this.isMobileAnnotEnabled = false;
        this.hideMobileAnnotationToolbar();
        this.pdfViewer.toolbarModule.showToolbar(true);
        let page = this.pdfViewerBase.getSelectTextMarkupCurrentPage();
        if (page) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearAnnotationSelection(page);
        }
    }
    // tslint:disable-next-line
    createToolbarItems() {
        let colorTemplate = this.getTemplate('span', '_annotation_color', 'e-pv-annotation-color-container');
        let opacityTemplate = this.getTemplate('span', '_annotation_opacity', 'e-pv-annotation-opacity-container');
        // tslint:disable-next-line
        let items = [];
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
    }
    getTemplate(elementName, id, className) {
        let element = createElement(elementName, { id: this.pdfViewer.element.id + id });
        if (className) {
            element.className = className;
        }
        return element.outerHTML;
    }
    createDropDowns() {
        this.colorDropDownElement = this.pdfViewerBase.getElement('_annotation_color');
        this.colorPalette = this.createColorPicker(this.colorDropDownElement.id);
        // tslint:disable-next-line:max-line-length
        this.colorDropDown = this.createDropDownButton(this.colorDropDownElement, 'e-pv-annotation-color-icon', this.colorPalette.element.parentElement, this.pdfViewer.localeObj.getConstant('Color edit'));
        this.colorDropDown.beforeOpen = this.colorDropDownBeforeOpen.bind(this);
        this.colorDropDown.open = this.colorDropDownOpen.bind(this);
        this.pdfViewerBase.getElement('_annotation_color-popup').addEventListener('click', this.onColorPickerCancelClick.bind(this));
        this.opacityDropDownElement = this.pdfViewerBase.getElement('_annotation_opacity');
        let sliderContainer = this.createSlider(this.opacityDropDownElement.id);
        // tslint:disable-next-line:max-line-length
        this.opacityDropDown = this.createDropDownButton(this.opacityDropDownElement, 'e-pv-annotation-opacity-icon', sliderContainer, this.pdfViewer.localeObj.getConstant('Opacity edit'));
        this.opacityDropDown.beforeOpen = this.opacityDropDownBeforeOpen.bind(this);
        this.opacitySlider.change = this.opacityChange.bind(this);
        this.opacitySlider.changed = this.opacityChange.bind(this);
        this.opacityDropDown.open = this.opacityDropDownOpen.bind(this);
    }
    opacityDropDownOpen() {
        if (Browser.isDevice) {
            // tslint:disable-next-line:max-line-length
            let opacityElement = this.pdfViewerBase.getElement('_annotation_opacity-popup');
            opacityElement.style.left = '0px';
        }
    }
    onColorPickerCancelClick(event) {
        if (event.target.classList.contains('e-cancel')) {
            this.colorDropDown.toggle();
        }
    }
    colorDropDownBeforeOpen(args) {
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
    }
    /**
     * @private
     */
    setCurrentColorInPicker() {
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
    }
    colorDropDownOpen() {
        if (Browser.isDevice) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.getElement('_annotation_color-popup').style.left = '0px';
        }
        this.colorPalette.refresh();
    }
    opacityChange(args) {
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
    }
    opacityDropDownBeforeOpen(args) {
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
    }
    createDropDownButton(element, iconClass, target, tooltipText) {
        // tslint:disable-next-line:max-line-length
        let dropDownButton = new DropDownButton({ iconCss: iconClass + ' e-pv-icon', target: target });
        if (this.pdfViewer.enableRtl) {
            dropDownButton.enableRtl = true;
        }
        dropDownButton.appendTo(element);
        this.primaryToolbar.createTooltip(element, tooltipText);
        return dropDownButton;
    }
    createColorPicker(idString) {
        let inputElement = createElement('input', { id: idString + '_target' });
        document.body.appendChild(inputElement);
        let colorPicker = new ColorPicker({
            inline: true, mode: 'Palette', cssClass: 'e-show-value', enableOpacity: false,
            change: this.onColorPickerChange.bind(this), value: '#000000', showButtons: false,
        });
        if (this.pdfViewer.enableRtl) {
            colorPicker.enableRtl = true;
        }
        colorPicker.appendTo(inputElement);
        return colorPicker;
    }
    onColorPickerChange(args) {
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
    }
    /**
     * @private
     */
    updateColorInIcon(element, color) {
        element.childNodes[0].style.borderBottomColor = color;
    }
    updateOpacityIndicator() {
        this.opacityIndicator.textContent = this.opacitySlider.value + '%';
    }
    createSlider(idString) {
        let outerContainer = createElement('div', { className: 'e-pv-annotation-opacity-popup-container' });
        document.body.appendChild(outerContainer);
        let label = createElement('span', { id: idString + '_label', className: 'e-pv-annotation-opacity-label' });
        label.textContent = this.pdfViewer.localeObj.getConstant('Opacity');
        let sliderElement = createElement('div', { id: idString + '_slider' });
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
    }
    afterToolbarCreation() {
        // tslint:disable-next-line:max-line-length
        this.highlightItem = this.primaryToolbar.addClassToolbarItem('_highlight', 'e-pv-highlight', this.pdfViewer.localeObj.getConstant('Highlight'));
        this.underlineItem = this.primaryToolbar.addClassToolbarItem('_underline', 'e-pv-underline', this.pdfViewer.localeObj.getConstant('Underline'));
        // tslint:disable-next-line:max-line-length
        this.strikethroughItem = this.primaryToolbar.addClassToolbarItem('_strikethrough', 'e-pv-strikethrough', this.pdfViewer.localeObj.getConstant('Strikethrough'));
        this.deleteItem = this.primaryToolbar.addClassToolbarItem('_annotation_delete', 'e-pv-annotation-delete', this.pdfViewer.localeObj.getConstant('Delete'));
        this.closeItem = this.primaryToolbar.addClassToolbarItem('_annotation_close', 'e-pv-annotation-tools-close', null);
        this.selectAnnotationDeleteItem(false);
        this.enableAnnotationPropertiesTools(false);
    }
    onToolbarClicked(args) {
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
    }
    /**
     * @private
     */
    showAnnotationToolbar(element) {
        if (!this.isToolbarHidden) {
            // tslint:disable-next-line
            let annotationModule = this.pdfViewer.annotationModule;
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
            let toolBarInitialStatus = this.toolbarElement.style.display;
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
    }
    // tslint:disable-next-line
    enablePropertiesTool(annotationModule) {
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
    }
    applyAnnotationToolbarSettings() {
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
    }
    showSeparator() {
        if ((!this.isHighlightBtnVisible && !this.isUnderlineBtnVisible && !this.isStrikethroughBtnVisible)
            || (!this.isColorToolVisible && !this.isOpacityToolVisible)) {
            this.applyHideToToolbar(false, 3, 3);
        }
        if ((!this.isColorToolVisible && !this.isOpacityToolVisible) && (!this.isHighlightBtnVisible &&
            !this.isUnderlineBtnVisible && !this.isStrikethroughBtnVisible) || !this.isDeleteAnnotationToolVisible) {
            this.applyHideToToolbar(false, 6, 6);
        }
    }
    showHighlightTool(isShow) {
        this.isHighlightBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 0, 0);
    }
    showUnderlineTool(isShow) {
        this.isUnderlineBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 1, 1);
    }
    showStrikethroughTool(isShow) {
        this.isStrikethroughBtnVisible = isShow;
        this.applyHideToToolbar(isShow, 2, 2);
    }
    showColorEditTool(isShow) {
        this.isColorToolVisible = isShow;
        this.applyHideToToolbar(isShow, 4, 4);
    }
    showOpacityEditTool(isShow) {
        this.isOpacityToolVisible = isShow;
        this.applyHideToToolbar(isShow, 5, 5);
    }
    showAnnotationDeleteTool(isShow) {
        this.isDeleteAnnotationToolVisible = isShow;
        this.applyHideToToolbar(isShow, 7, 7);
    }
    applyHideToToolbar(show, startIndex, endIndex) {
        let isHide = !show;
        for (let index = startIndex; index <= endIndex; index++) {
            this.toolbar.hideItem(index, isHide);
        }
    }
    adjustViewer(isAdjust) {
        let splitterElement = this.pdfViewerBase.getElement('_sideBarToolbarSplitter');
        let toolbarContainer = this.pdfViewerBase.getElement('_toolbarContainer');
        let toolbarHeight = this.getToolbarHeight(toolbarContainer);
        let annotationToolbarHeight = this.getToolbarHeight(this.toolbarElement);
        let sideBarToolbar = this.pdfViewerBase.navigationPane.sideBarToolbar;
        let sideBarContentContainer = this.pdfViewerBase.navigationPane.sideBarContentContainer;
        if (isAdjust) {
            if (this.pdfViewer.enableToolbar) {
                sideBarToolbar.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                sideBarContentContainer.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
                splitterElement.style.top = (toolbarHeight + annotationToolbarHeight) + 'px';
            }
            else {
                sideBarToolbar.style.top = (annotationToolbarHeight) + 'px';
                sideBarContentContainer.style.top = (annotationToolbarHeight) + 'px';
                splitterElement.style.top = (annotationToolbarHeight) + 'px';
            }
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.viewerContainer.style.height = this.updateViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), (annotationToolbarHeight)) + 'px';
            sideBarToolbar.style.height = sideBarToolbar.getBoundingClientRect().height - annotationToolbarHeight + 'px';
            splitterElement.style.height = splitterElement.getBoundingClientRect().height - annotationToolbarHeight + 'px';
        }
        else {
            if (this.pdfViewer.enableToolbar) {
                // tslint:disable-next-line:max-line-length
                sideBarToolbar.style.top = toolbarHeight + 'px';
                sideBarContentContainer.style.top = toolbarHeight + 'px';
                splitterElement.style.top = toolbarHeight + 'px';
            }
            else {
                sideBarToolbar.style.top = 1 + 'px';
                sideBarToolbar.style.height = '100%';
                sideBarContentContainer.style.top = 1 + 'px';
                sideBarContentContainer.style.height = '100%';
                splitterElement.style.top = 1 + 'px';
                splitterElement.style.height = '100%';
            }
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.viewerContainer.style.height = this.resetViewerHeight(this.getElementHeight(this.pdfViewerBase.viewerContainer), annotationToolbarHeight) + 'px';
            sideBarToolbar.style.height = this.getHeight(sideBarToolbar, annotationToolbarHeight);
            splitterElement.style.height = this.getHeight(splitterElement, annotationToolbarHeight);
        }
        this.updateContentContainerHeight(isAdjust);
    }
    updateContentContainerHeight(isAdjust) {
        let annotationToolbarHeight = this.getToolbarHeight(this.toolbarElement);
        let sideBarClientRect = this.pdfViewerBase.navigationPane.sideBarContentContainer.getBoundingClientRect();
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
    }
    getToolbarHeight(element) {
        let toolbarHeight = element.getBoundingClientRect().height;
        if (toolbarHeight === 0 && element === this.pdfViewerBase.getElement('_toolbarContainer')) {
            // getComputedStyle gets the value from style and toolbar border height is added to it.
            // tslint:disable-next-line
            toolbarHeight = parseFloat(window.getComputedStyle(element)['height']) + this.toolbarBorderHeight;
        }
        return toolbarHeight;
    }
    getHeight(element, toolbarHeight) {
        let height = element.getBoundingClientRect().height;
        return (height !== 0) ? height + toolbarHeight + 'px' : '';
    }
    handleHighlight() {
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
    }
    handleUnderline() {
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
    }
    handleStrikethrough() {
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
    }
    deselectAllItems() {
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
    }
    /**
     * @private
     */
    selectAnnotationDeleteItem(isEnable) {
        this.toolbar.enableItems(this.deleteItem.parentElement, isEnable);
    }
    /**
     * @private
     */
    enableAnnotationPropertiesTools(isEnable) {
        this.toolbar.enableItems(this.colorDropDownElement.parentElement, isEnable);
        this.toolbar.enableItems(this.opacityDropDownElement.parentElement, isEnable);
    }
    /**
     * @private
     */
    enableAnnotationAddTools(isEnable) {
        this.toolbar.enableItems(this.highlightItem.parentElement, isEnable);
        this.toolbar.enableItems(this.underlineItem.parentElement, isEnable);
        this.toolbar.enableItems(this.strikethroughItem.parentElement, isEnable);
    }
    /**
     * @private
     */
    isAnnotationButtonsEnabled() {
        let isButtonsEnabled = false;
        if (this.isHighlightEnabled || this.isUnderlineEnabled || this.isStrikethroughEnabled) {
            isButtonsEnabled = true;
        }
        return isButtonsEnabled;
    }
    updateToolbarItems() {
        if (this.pdfViewer.enableTextMarkupAnnotation) {
            this.enableAnnotationAddTools(true);
        }
        else {
            this.enableAnnotationAddTools(false);
        }
    }
    /**
     * @private
     */
    resetToolbar() {
        this.adjustViewer(false);
        this.updateToolbarItems();
        this.toolbarElement.style.display = 'none';
        this.isToolbarHidden = true;
    }
    /**
     * @private
     */
    clear() {
        this.deselectAllItems();
    }
    /**
     * @private
     */
    destroy() {
        this.colorDropDown.destroy();
        this.opacityDropDown.destroy();
        this.toolbar.destroy();
    }
    getElementHeight(element) {
        return element.getBoundingClientRect().height;
    }
    updateViewerHeight(viewerHeight, toolbarHeight) {
        return viewerHeight - toolbarHeight;
    }
    resetViewerHeight(viewerHeight, toolbarHeight) {
        return viewerHeight + toolbarHeight;
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
 * The `AjaxRequestSettings` module is used to set the ajax Request Headers of PDF viewer.
 */
class AjaxRequestSettings extends ChildProperty {
}
__decorate([
    Property()
], AjaxRequestSettings.prototype, "ajaxHeaders", void 0);
/**
 * The `AnnotationToolbarSettings` module is used to provide the annotation toolbar settings of the PDF viewer.
 */
class AnnotationToolbarSettings extends ChildProperty {
}
__decorate([
    Property(true)
], AnnotationToolbarSettings.prototype, "showTooltip", void 0);
__decorate([
    Property()
], AnnotationToolbarSettings.prototype, "annotationToolbarItem", void 0);
/**
 * The `ServerActionSettings` module is used to provide the server action methods of PDF viewer.
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
 * The `StrikethroughSettings` module is used to provide the properties to Strikethrough annotation.
 */
class StrikethroughSettings extends ChildProperty {
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
/**
 * The `UnderlineSettings` module is used to provide the properties to Underline annotation.
 */
class UnderlineSettings extends ChildProperty {
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
/**
 * The `HighlightSettings` module is used to provide the properties to Highlight annotation.
 */
class HighlightSettings extends ChildProperty {
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
        this.viewerBase = new PdfViewerBase(this);
    }
    /**
     * Returns the page count of the document loaded in the PdfViewer control.
     */
    get pageCount() {
        return this.viewerBase.pageCount;
    }
    /**
     * Checks whether the PDF document is edited.
     */
    get isDocumentEdited() {
        return this.viewerBase.isDocumentEdited;
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
    /**
     * Gets the thumbnail-view object of the pdf viewer.
     * @returns { ThumbnailView }
     */
    get thumbnailView() {
        return this.thumbnailViewModule;
    }
    /**
     * Gets the annotation object of the pdf viewer.
     * @returns { Annotation }
     */
    get annotation() {
        return this.annotationModule;
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
        if (this.enableToolbar || this.enableNavigationToolbar) {
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
    }
    /**
     * Loads the given PDF document in the PDF viewer control
     * @param  {string} document - Specifies the document name for load
     * @param  {string} password - Specifies the Given document password
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
    /**
     * Downloads the PDF document being loaded in the ejPdfViewer control.
     * @returns void
     */
    download() {
        if (this.enableDownload) {
            this.viewerBase.download();
        }
    }
    /**
     * Perform undo action for the edited annotations
     * @returns void
     */
    undo() {
        if (this.annotationModule) {
            this.annotationModule.undo();
        }
    }
    /**
     * Perform redo action for the edited annotations
     * @returns void
     */
    redo() {
        if (this.annotationModule) {
            this.annotationModule.redo();
        }
    }
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
        if (this.toolbarModule) {
            this.toolbarModule.destroy();
        }
        if (!isNullOrUndefined(this.element)) {
            this.element.classList.remove('e-pdfviewer');
            this.element.innerHTML = '';
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
    /**
     * @private
     */
    // tslint:disable-next-line
    fireAnnotationAdd(pageNumber, index, type, bounds, settings) {
        let eventArgs = { name: 'annotationAdd', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBound: bounds, annotationSettings: settings };
        this.trigger('annotationAdd', eventArgs);
    }
    /**
     * @private
     */
    fireAnnotationRemove(pageNumber, index, type) {
        // tslint:disable-next-line:max-line-length
        let eventArgs = { name: 'annotationRemove', pageIndex: pageNumber, annotationId: index, annotationType: type };
        this.trigger('annotationRemove', eventArgs);
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    fireAnnotationPropertiesChange(pageNumber, index, type, isColorChanged, isOpacityChanged) {
        let eventArgs = { name: 'annotationPropertiesChange', pageIndex: pageNumber, annotationId: index, annotationType: type, isColorChanged: isColorChanged, isOpacityChanged: isOpacityChanged };
        this.trigger('annotationPropertiesChange', eventArgs);
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
    Property({ ajaxHeaders: [] })
], PdfViewer.prototype, "ajaxRequestSettings", void 0);
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

/**
 * BookmarkView module
 */
class BookmarkView {
    /**
     * @private
     */
    constructor(pdfViewer, pdfViewerBase) {
        /**
         * @private
         */
        this.childNavigateCount = 0;
        // tslint:disable-next-line
        this.bookmarkClick = (args) => {
            // tslint:disable-next-line
            if (!args.event.target.classList.contains('e-icons')) {
                let bookid = args.data.Id;
                this.childNavigateCount = 0;
                this.pdfViewerBase.navigationPane.goBackToToolbar();
                this.navigateToBookmark(bookid);
            }
            else {
                this.childNavigateCount++;
            }
            return false;
        };
        this.nodeClick = (args) => {
            this.setHeight(args.node);
            let bookid = Number(args.nodeData.id);
            this.navigateToBookmark(bookid);
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
        let bookmarkRequest = new XMLHttpRequest();
        // tslint:disable-next-line:max-line-length
        let jsonObject = { hashId: this.pdfViewerBase.hashId };
        bookmarkRequest.open('POST', proxy.pdfViewer.serviceUrl + '/Bookmarks');
        bookmarkRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        if (this.pdfViewer.ajaxRequestSettings.ajaxHeaders) {
            this.pdfViewerBase.setCustomAjaxHeaders(bookmarkRequest);
        }
        bookmarkRequest.responseType = 'json';
        bookmarkRequest.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        bookmarkRequest.onreadystatechange = (event) => {
            if (bookmarkRequest.readyState === 4 && bookmarkRequest.status === 200) {
                if (this.pdfViewerBase.navigationPane) {
                    this.pdfViewerBase.navigationPane.disableBookmarkButton();
                }
                // tslint:disable-next-line
                let data = event.currentTarget.response;
                if (data) {
                    if (typeof data !== 'object') {
                        data = JSON.parse(data);
                    }
                    this.bookmarks = { bookMark: data.Bookmarks };
                    this.bookmarksDestination = { bookMarkDestination: data.BookmarksDestination };
                }
                if (this.pdfViewerBase.navigationPane) {
                    if (this.bookmarks == null) {
                        this.pdfViewerBase.navigationPane.disableBookmarkButton();
                    }
                    else {
                        this.pdfViewerBase.navigationPane.enableBookmarkButton();
                        this.isBookmarkViewDiv = false;
                    }
                }
            }
        };
        // tslint:disable-next-line
        bookmarkRequest.onerror = (event) => {
            this.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(bookmarkRequest.status, bookmarkRequest.statusText);
        };
    }
    /**
     * @private
     */
    renderBookmarkcontent() {
        if (!this.isBookmarkViewDiv) {
            this.bookmarkView = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_view', className: 'e-pv-bookmark-view' });
            this.pdfViewerBase.navigationPane.sideBarContent.appendChild(this.bookmarkView);
            // tslint:disable-next-line:max-line-length
            let bookmarkIconView = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_iconview', className: 'e-pv-bookmark-icon-view' });
            // tslint:disable-next-line:max-line-length
            if (!this.pdfViewer.enableRtl) {
                // tslint:disable-next-line:max-line-length
                let bookmarkIcon = createElement('span', { id: this.pdfViewer.element.id + '_bookmark_icon', className: 'e-pv-bookmark-icon e-pv-icon' });
                bookmarkIconView.appendChild(bookmarkIcon);
            }
            else {
                // tslint:disable-next-line:max-line-length
                let bookmarkIcon = createElement('span', { id: this.pdfViewer.element.id + '_bookmark_icon', className: 'e-pv-bookmark-icon e-pv-icon e-right' });
                bookmarkIconView.appendChild(bookmarkIcon);
            }
            // tslint:disable-next-line:max-line-length
            let bookmarkTitle = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_Title', className: 'e-pv-bookmark-Title' });
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
            ['mouseover', 'keydown'].forEach((evt) => this.bookmarkView.addEventListener(evt, (event) => {
                this.setHeight(event.target);
            }));
            this.isBookmarkViewDiv = true;
        }
        this.bookmarkView.style.display = 'block';
    }
    /**
     * @private
     */
    renderBookmarkContentMobile() {
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
    }
    // tslint:disable-next-line
    setHeight(element) {
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
    }
    /**
     * @private
     */
    setBookmarkContentHeight() {
        // tslint:disable-next-line
        let element = this.treeObj.element;
        if (this.treeObj.fullRowSelect) {
            if (element.classList.contains('e-treeview')) {
                element = element.querySelector('.e-node-focus').querySelector('.e-fullrow');
            }
            if (element.nextElementSibling) {
                element.style.height = element.nextElementSibling.offsetHeight + 'px';
            }
        }
    }
    navigateToBookmark(bookid) {
        let pageIndex = this.bookmarksDestination.bookMarkDestination[bookid].PageIndex;
        let Y = this.bookmarksDestination.bookMarkDestination[bookid].Y;
        this.goToBookmark(pageIndex, Y);
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
     * @param  {number} pageIndex - Specifies the pageIndex for Navigate
     * @param  {number} y - Specifies the Y coordinates value of the Page
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
    clear() {
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
            let isBackward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
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
                        let isBackward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
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
                let backward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
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
            let backward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            if (this.isTouchSelection && pageNumber > focusPageId && pageNumber > anchorPageId) {
                return;
            }
            if (anchorPageId === focusPageId) {
                let selectionObject = null;
                let selectionBounds = this.getSelectionBounds(selection.getRangeAt(0), pageNumber);
                let selectionRectBounds = this.getSelectionRectangleBounds(selection.getRangeAt(0), pageNumber);
                // tslint:disable-next-line:max-line-length
                let anchorOffsetValue = (this.getNodeElementFromNode(selection.anchorNode).childNodes.length === 1) ? selection.anchorOffset : this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                let focusOffsetValue = (this.getNodeElementFromNode(selection.focusNode).childNodes.length === 1) ? selection.focusOffset : this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                selectionObject = {
                    isBackward: backward, startNode: this.getNodeElementFromNode(selection.anchorNode).id,
                    startOffset: anchorOffsetValue, endNode: this.getNodeElementFromNode(selection.focusNode).id,
                    // tslint:disable-next-line:max-line-length
                    endOffset: focusOffsetValue, textContent: selection.toString(), pageNumber: pageNumber, bound: selectionBounds, rectangleBounds: selectionRectBounds
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
                let backward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
                if (!backward) {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (currentPageNumber - 1));
                    if (nextPageElement) {
                        let lastElement = nextPageElement.lastChild;
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
            let backward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
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
                    let selectionBound = this.getSelectionBounds(selectionRangeObject, pageNumber);
                    let selectionRectBounds = this.getSelectionRectangleBounds(selectionRangeObject, pageNumber);
                    // tslint:disable-next-line:max-line-length
                    return selectionObject = { isBackward: backward, startNode: firstElement.id, startOffset: startOffset, endNode: lastElement.id, endOffset: endOffset, textContent: selectionString, pageNumber: pageNumber, bound: selectionBound, rectangleBounds: selectionRectBounds };
                }
                else {
                    return null;
                }
            }
        }
        return null;
    }
    getSelectionRangeObject(startNode, startOffset, endNode, endOffset, pageNumber) {
        let startElement = document.getElementById(startNode);
        let endElement = document.getElementById(endNode);
        if (startElement.childNodes[0]) {
            startElement = startElement.childNodes[0];
        }
        if (endElement.childNodes[0]) {
            endElement = endElement.childNodes[0];
        }
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
        let bounds = null;
        if (startElement !== endElement) {
            let newStartRange = document.createRange();
            // tslint:disable-next-line:max-line-length
            let startRange = this.createRangeForSelection(range.startContainer, range.endContainer, range.startOffset, range.endOffset, newStartRange);
            bounds = this.normalizeBounds(startRange.getBoundingClientRect(), pageNumber);
        }
        else {
            bounds = this.normalizeBounds(range.getBoundingClientRect(), pageNumber);
        }
        return bounds;
    }
    getSelectionRectangleBounds(range, pageNumber) {
        let selectionBounds = [];
        let startElement = this.getNodeElementFromNode(range.startContainer);
        let endElement = this.getNodeElementFromNode(range.endContainer);
        let bounds = null;
        if (startElement !== endElement) {
            let startOffset = 0;
            let endOffset = 0;
            let currentId = 0;
            let anchorPageId = this.pdfViewerBase.textLayer.getPageIndex(range.startContainer);
            let anchorTextId = this.pdfViewerBase.textLayer.getTextIndex(range.startContainer, anchorPageId);
            let focusPageId = this.pdfViewerBase.textLayer.getPageIndex(range.endContainer);
            let focusTextId = this.pdfViewerBase.textLayer.getTextIndex(range.endContainer, focusPageId);
            let textDivs = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).childNodes;
            if (pageNumber === anchorPageId) {
                currentId = anchorTextId;
            }
            else {
                currentId = 0;
            }
            for (let j = currentId; j < textDivs.length; j++) {
                let textElement = textDivs[j];
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
                let newRange = document.createRange();
                for (let k = 0; k < textElement.childNodes.length; k++) {
                    let node = textElement.childNodes[k];
                    newRange.setStart(node, startOffset);
                    newRange.setEnd(node, endOffset);
                }
                let boundingRect = this.normalizeBounds(newRange.getBoundingClientRect(), pageNumber);
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
            right: this.getMagnifiedValue(bound.right - currentPageRect.left), width: this.getMagnifiedValue(bound.width)
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
        let bound = null;
        let ranges = this.selectionRangeArray;
        for (let i = 0; i < ranges.length; i++) {
            if (ranges[i] !== null) {
                if (pageNumber === ranges[i].pageNumber) {
                    bound = ranges[i].bound;
                }
            }
        }
        return bound;
    }
    createRangeForSelection(start, end, startOffset, endOffset, range) {
        range.setStart(start, startOffset);
        range.setEnd(end, endOffset);
        return range;
    }
    maintainSelectionArray() {
        if (this.selectionRangeArray.length !== 0) {
            let selection = window.getSelection();
            let isBackward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
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
    /**
     * @private
     */
    applySpanForSelection() {
        let selection = window.getSelection();
        // tslint:disable-next-line:max-line-length
        if (selection.anchorNode !== null && this.pdfViewerBase.viewerContainer.contains(this.getNodeElementFromNode(selection.anchorNode))) {
            let isBackWardSelection = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
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
            this.calculateContextMenuPosition(event.touches[0].clientY, event.touches[0].clientX);
        }
    }
    // tslint:disable-next-line
    calculateContextMenuPosition(top, left) {
        top = top - this.pdfViewerBase.toolbarHeight;
        if (Browser.isDevice) {
            // tslint:disable-next-line
            let contextTop = top - this.contextMenuHeight;
            if (contextTop < this.pdfViewerBase.toolbarHeight) {
                top = top + this.contextMenuHeight;
            }
            else {
                top = contextTop;
            }
        }
        // tslint:disable-next-line:max-line-length
        this.pdfViewerBase.contextMenuModule.contextMenuObj.open(top, left - this.pdfViewerBase.viewerContainer.clientLeft, this.pdfViewerBase.viewerContainer);
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
        if (this.pdfViewerBase.getTextMarkupAnnotationMode()) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
        }
        else {
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.contextMenuModule.contextMenuObj.open(event.changedTouches[0].clientY - this.pdfViewerBase.viewerContainer.offsetTop + this.pdfViewerBase.contextMenuModule.contextMenuElement.clientHeight, event.changedTouches[0].clientX - this.pdfViewerBase.viewerContainer.offsetLeft, this.pdfViewerBase.viewerContainer);
        }
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
                this.initiateTextSearch(this.searchInput);
                this.updateSearchInputIcon(false);
            }
            else {
                this.resetVariables();
            }
        };
        this.searchClickHandler = (event) => {
            this.searchButtonClick(this.searchBtn, this.searchInput);
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
        if (this.pdfViewer.enableRtl) {
            this.searchBox.classList.add('e-rtl');
            this.searchBox.style.left = '88.3px';
        }
        else {
            this.searchBox.classList.remove('e-rtl');
            this.searchBox.style.right = '88.3px';
        }
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
        if (this.pdfViewer.toolbarModule && this.pdfViewer.enableToolbar) {
            let secondaryToolbar = this.pdfViewerBase.getElement('_toolbarContainer_popup');
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
    initiateTextSearch(searchElement) {
        let inputString = searchElement.value;
        this.initiateSearch(inputString);
    }
    /**
     * @private
     */
    initiateSearch(inputString) {
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
                this.initiateTextSearch(this.searchInput);
            }
        }
        else {
            this.initiateTextSearch(this.searchInput);
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
        let scrollPoint = { y: -100, x: -100 };
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
                let targetScrollElement = this.getScrollElement(element);
                this.scrollToSearchStr(targetScrollElement, scrollPoint);
            }
            else {
                this.pdfViewerBase.updateScrollTop(pageIndex);
                let element = this.pdfViewerBase.getElement('_text_' + pageIndex + '_' + startId);
                let targetScrollElement = this.getScrollElement(element);
                this.scrollToSearchStr(targetScrollElement, scrollPoint);
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
    getScrollElement(element) {
        let targetElement = element;
        if (element.childNodes.length > 0) {
            for (let i = 0; i < element.childNodes.length; i++) {
                if (element.childNodes[i].classList) {
                    if (element.childNodes[i].classList.contains('e-pv-search-text-highlight')) {
                        targetElement = element.childNodes[i];
                    }
                }
            }
        }
        return targetElement;
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
        if (this.pdfViewer.ajaxRequestSettings.ajaxHeaders) {
            this.pdfViewerBase.setCustomAjaxHeaders(request);
        }
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
        if (!Browser.isDevice) {
            if (isEnable) {
                this.prevSearchBtn.removeAttribute('disabled');
            }
            else {
                this.prevSearchBtn.disabled = true;
            }
        }
    }
    enableNextButton(isEnable) {
        if (!Browser.isDevice) {
            if (isEnable) {
                this.nextSearchBtn.removeAttribute('disabled');
            }
            else {
                this.nextSearchBtn.disabled = true;
            }
        }
    }
    /**
     * @private
     */
    resetVariables() {
        this.searchedPages = [];
        // tslint:disable-next-line
        this.searchMatches = new Array();
        // tslint:disable-next-line
        this.searchCollection = new Array();
    }
    /**
     * @private
     */
    searchButtonClick(element, inputElement) {
        if (element.classList.contains('e-pv-search-icon')) {
            this.initiateTextSearch(inputElement);
        }
        else if (element.classList.contains('e-pv-search-close')) {
            inputElement.value = '';
            this.resetTextSearch();
            inputElement.focus();
        }
    }
    updateSearchInputIcon(isEnable) {
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
    }
    onMessageBoxOpen() {
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
    }
    /**
     * Searches the target text in the PDF document and highlights the occurrences in the pages
     * @param  {string} searchText - Specifies the searchText content
     * @param  {boolean} isMatchCase - If set true , its highlights the MatchCase content
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
            setTimeout(() => {
                for (pageIndex = 0; pageIndex < this.pdfViewerBase.pageCount; pageIndex++) {
                    let pageWidth = this.pdfViewerBase.pageSize[pageIndex].width;
                    let pageHeight = this.pdfViewerBase.pageSize[pageIndex].height;
                    this.pdfViewer.printModule.createRequestForPrint(pageIndex, pageWidth, pageHeight, this.pdfViewerBase.pageCount);
                }
            }, 100);
        }
    }
    createRequestForPrint(pageIndex, pageWidth, pageHeight, pageCount) {
        let proxy = this;
        let request = new XMLHttpRequest();
        // tslint: disable-next-line:max-line-length
        // set default zoomFactor value.  
        let jsonObject = {
            pageNumber: pageIndex, documentId: this.pdfViewerBase.documentId,
            hashId: this.pdfViewerBase.hashId, zoomFactor: 1
        };
        request.open('POST', proxy.pdfViewer.serviceUrl + '/PrintImages', false);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        if (this.pdfViewer.ajaxRequestSettings.ajaxHeaders) {
            this.pdfViewerBase.setCustomAjaxHeaders(request);
        }
        request.send(JSON.stringify(jsonObject));
        // tslint:disable-next-line
        let printImage = request.responseText;
        if (typeof printImage !== 'object') {
            printImage = JSON.parse(printImage);
        }
        let annotationSource = '';
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
        let context = this.printCanvas.getContext('2d');
        let pageImage = new Image();
        let annotationImage = new Image();
        pageImage.onload = () => {
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
        for (let i = 0; i < this.printViewerContainer.children.length; i++) {
            // tslint:disable-next-line:max-line-length
            let canvasUrl = this.printViewerContainer.children[i].toDataURL();
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
            setTimeout(() => {
                this.iframe.contentWindow.print();
                this.iframe.contentWindow.focus();
                document.body.removeChild(this.iframe);
            }, 200);
        }
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

export { Annotation, LinkAnnotation, TextMarkupAnnotation, NavigationPane, PdfViewerBase, TextLayer, ContextMenu$1 as ContextMenu, Magnification, Navigation, ThumbnailView, Toolbar$1 as Toolbar, AnnotationToolbar, ToolbarSettings, AjaxRequestSettings, AnnotationToolbarSettings, ServerActionSettings, StrikethroughSettings, UnderlineSettings, HighlightSettings, PdfViewer, BookmarkView, TextSelection, TextSearch, Print };
//# sourceMappingURL=ej2-pdfviewer.es2015.js.map
