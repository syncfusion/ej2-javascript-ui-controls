import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Annotation, PdfViewer, PdfViewerBase } from '../index';

/**
 * The `IRectangle` module is used to handle rectangle property of PDF viewer.
 *
 * @hidden
 */
export interface IRectangle {
    bottom: number
    height: number
    left: number
    top: number
    right: number
    width: number
    rotation?: number
}

/**
 * The `ISelection` module is used to handle selection property of PDF viewer.
 *
 * @hidden
 */
export interface ISelection {
    isBackward: boolean
    startNode: string
    startOffset: number
    endNode: string
    endOffset: number
    textContent: string
    pageNumber: number
    bound: IRectangle
    rectangleBounds: IRectangle[]
}
/**
 * The `TextSelection` module is used to handle the text selection of PDF viewer.
 *
 * @param {Event} event - event
 * @returns {void}
 */
export class TextSelection {
    /**
     * @private
     */
    public isTextSelection: boolean = false;
    /**
     * @private
     */
    public selectionStartPage: number = null;
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private isBackwardPropagatedSelection: boolean = false;
    private dropDivElementLeft: HTMLElement;
    private dropDivElementRight: HTMLElement;
    private dropElementLeft: HTMLElement;
    private dropElementRight: HTMLElement;
    private contextMenuHeight: number = 144;
    private backwardStart: number = 0;
    /**
     * @private
     */
    public selectionRangeArray: ISelection[] = [];
    private selectionAnchorTouch: { [key: string]: Object } = null;
    private selectionFocusTouch: { [key: string]: Object } = null;
    private scrollMoveTimer: number = 0;
    private isMouseLeaveSelection: boolean = false;
    /**
     * @private
     */
    public isTouchSelection: boolean = false;
    private previousScrollDifference: number = 0;
    private topStoreLeft: { [key: string]: Object } = null;
    private topStoreRight: { [key: string]: Object } = null;
    private isTextSearched: boolean = false;
    private isSelectionStartTriggered: boolean = false;
    private allTextContent : any = '';

    /**
     * @param {PdfViewer} pdfViewer - It describes about the pdfviewer
     * @param {PdfViewerBase} pdfViewerBase - It describes about the pdfviewer base
     * @private
     * @returns {void}
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * @param {EventTarget} target - It describes about the target
     * @param {number} x - It describes about the X value
     * @param {number} y - It describes about the Y value
     * @param {boolean} isExtended - It describes about the isExtended boolean value
     * @private
     * @returns {void}
     */
    public textSelectionOnMouseMove(target: EventTarget, x: number, y: number, isExtended?: boolean): void {
        const targetElement: HTMLElement = target as HTMLElement;
        this.isTextSearched = true;
        if (targetElement.nodeType === targetElement.TEXT_NODE) {
            if (!this.isSelectionStartTriggered && !this.pdfViewerBase.getTextMarkupAnnotationMode()) {
                this.pdfViewer.fireTextSelectionStart(this.pdfViewerBase.currentPageNumber);
                this.isSelectionStartTriggered = true;
            }
            this.isBackwardPropagatedSelection = false;
            const range: Range = targetElement.ownerDocument.createRange();
            const selection: Selection = window.getSelection();
            if (selection.anchorNode !== null) {
                const position: number = selection.anchorNode.compareDocumentPosition(selection.focusNode);
                if (!position && selection.anchorOffset > selection.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
                    this.isBackwardPropagatedSelection = true;
                }
            }
            range.selectNodeContents(targetElement);
            let currentPosition: number = 0;
            const endPosition: number = range.endOffset;
            while (currentPosition < endPosition) {
                range.setStart(targetElement, currentPosition);
                range.setEnd(targetElement, currentPosition + 1);
                const rangeBounds: ClientRect = range.getBoundingClientRect();
                let rightBounds: number = rangeBounds.right;
                if (isExtended) {
                    rightBounds = parseInt(rangeBounds.right.toString(), 10);
                }
                if (rangeBounds.left <= x && rightBounds >= x && parseInt(rangeBounds.top.toString(), 10) <= y && rangeBounds.bottom >= y) {
                    if (selection.anchorNode !== null && (selection.anchorNode.parentNode as HTMLElement).classList.contains('e-pv-text')) {
                        if (selection.anchorOffset > currentPosition) {
                            if (this.backwardStart !== 0) {
                                range.setStart(selection.anchorNode, this.backwardStart);
                            } else {
                                range.setStart(selection.anchorNode, selection.anchorOffset + 1);
                            }
                        } else {
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                        }
                    }
                    selection.removeAllRanges();
                    selection.addRange(range);
                    if (!this.isTextSelection) {
                        this.selectionStartPage = this.pdfViewerBase.currentPageNumber - 1;
                    }
                    this.isTextSelection = true;
                    const isIE: boolean = !!(document as any).documentMode;
                    if (!isIE) {
                        if (this.isBackwardPropagatedSelection || range.endOffset > currentPosition) {
                            if (this.backwardStart !== range.startOffset && range.startOffset >= currentPosition) {
                                this.backwardStart = range.endOffset;
                            }
                            if (currentPosition === 0 && range.endOffset !== 1) {
                                selection.extend(targetElement, currentPosition);
                            } else {
                                selection.extend(targetElement, currentPosition + 1);
                            }
                        } else if (isExtended) {
                            selection.extend(targetElement, currentPosition);
                        } else {
                            selection.extend(targetElement, currentPosition + 1);
                        }
                    }
                    range.detach();
                }
                currentPosition += 1;
            }
            const annotationModule: Annotation = this.pdfViewer.annotationModule;
            if (annotationModule && annotationModule.textMarkupAnnotationModule &&
                annotationModule.textMarkupAnnotationModule.
                    isEnableTextMarkupResizer(annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode)) {
                const leftDivElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_droplet_left');
                if (this.pdfViewerBase.isSelection && selection && selection.rangeCount > 0) {
                    const currentrange: Range = selection.getRangeAt(0);
                    const rect: any = currentrange.getBoundingClientRect();
                    const left: number = rect.left;
                    const top: number = rect.top;
                    this.pdfViewer.annotation.textMarkupAnnotationModule.updateLeftposition(left, top);
                    this.pdfViewerBase.isSelection = false;
                } else if ((leftDivElement && leftDivElement.style.display === 'none')) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.updateLeftposition(x, y);
                }
                this.pdfViewer.annotation.textMarkupAnnotationModule.updatePosition(x, y);
            }
        } else {
            for (let i: number = 0; i < targetElement.childNodes.length; i++) {
                if (targetElement.childNodes[parseInt(i.toString(), 10)].nodeType === targetElement.TEXT_NODE) {
                    const range: Range = this.getSelectionRange(i, targetElement);
                    const rangeBounds: ClientRect = range.getBoundingClientRect();
                    if (rangeBounds.left <= x && rangeBounds.right >= parseInt(x.toString(), 10) &&
                    parseInt(rangeBounds.top.toString(), 10) <= y && rangeBounds.bottom >= y) {
                        range.detach();
                        this.textSelectionOnMouseMove(targetElement.childNodes[parseInt(i.toString(), 10)], x, y, isExtended);
                    } else {
                        range.detach();
                    }
                }
            }
        }
    }

    /**
     * @param {EventTarget} target - It describes about the target
     * @param {number} x - It describes about the X value
     * @param {number} y - It describes about the Y value
     * @param {boolean} isforward - It describes about the isforward boolean value
     * @private
     * @returns {boolean} - boolean
     */
    public textSelectionOnDrag(target: EventTarget, x: number, y: number, isforward: boolean): boolean {
        const targetElement: HTMLElement = target as HTMLElement;
        this.isTextSearched = true;
        if (targetElement.nodeType === targetElement.TEXT_NODE) {
            this.isBackwardPropagatedSelection = false;
            const range: Range = targetElement.ownerDocument.createRange();
            const selection: Selection = window.getSelection();
            if (selection.anchorNode !== null) {
                const position: number = selection.anchorNode.compareDocumentPosition(selection.focusNode);
                if (!position && selection.anchorOffset > selection.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
                    this.isBackwardPropagatedSelection = true;
                }
            }
            range.selectNodeContents(targetElement);
            let currentPosition: number = 0;
            const endPosition: number = range.endOffset;
            while (currentPosition < endPosition) {
                range.setStart(targetElement, currentPosition);
                range.setEnd(targetElement, currentPosition + 1);
                const rangeBounds: ClientRect = range.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && parseInt(rangeBounds.top.toString(), 10) <= y &&
                rangeBounds.bottom >= y) {
                    if (isforward) {
                        if (selection.anchorNode !== null && (selection.anchorNode.parentNode as HTMLElement).classList.contains('e-pv-text')) {
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                        }
                        selection.removeAllRanges();
                        selection.addRange(range);
                        selection.extend(targetElement, currentPosition);
                    } else if (selection.focusNode) {
                        range.setEnd(selection.focusNode, selection.focusOffset);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                    if (!this.isTextSelection) {
                        this.selectionStartPage = this.pdfViewerBase.currentPageNumber - 1;
                    }
                    this.isTextSelection = true;
                    range.detach();
                    return true;
                }
                currentPosition += 1;
            }
            if (this.pdfViewerBase.isSelection) {
                const currentrange: Range = selection.getRangeAt(0);
                const rect: any = currentrange.getBoundingClientRect();
                const left: number = rect.left;
                const top: number = rect.top;
                this.pdfViewer.annotation.textMarkupAnnotationModule.updateLeftposition(left, top);
                this.pdfViewerBase.isSelection = false;
            }
            this.pdfViewer.annotation.textMarkupAnnotationModule.updatePosition(x, y);
        } else {
            for (let i: number = 0; i < targetElement.childNodes.length; i++) {
                if (targetElement.childNodes[parseInt(i.toString(), 10)].nodeType === targetElement.TEXT_NODE) {
                    const range: Range = this.getSelectionRange(i, targetElement);
                    const rangeBounds: ClientRect = range.getBoundingClientRect();
                    if (rangeBounds.left <= x && rangeBounds.right >= x && parseInt(rangeBounds.top.toString(), 10) <= y &&
                    rangeBounds.bottom >= y) {
                        range.detach();
                        this.textSelectionOnDrag(targetElement.childNodes[parseInt(i.toString(), 10)], x, y, isforward);
                    } else {
                        range.detach();
                    }
                }
            }
        }
        return null;
    }

    /**
     * Select the target text region in the PDF document of the given bounds.
     *
     * @param  {number} pageNumbers - Specifies the page number
     * @param  {IRectangle[]} bounds -  Specifies the bounds of the texts.
     * @returns {void}
     */
    public selectTextRegion(pageNumbers: number, bounds: IRectangle[]): void {
        let element: any = null;
        const pageNumber: number = (pageNumbers - 1);
        for (let k: number = 0; k < bounds.length; k++) {
            const bound: any = bounds[parseInt(k.toString(), 10)];
            const x: number = (bound.left ? bound.left : bound.Left) * this.pdfViewerBase.getZoomFactor();
            const y: number = (bound.top ? bound.top : bound.Top) * this.pdfViewerBase.getZoomFactor();
            const width: number = (bound.width ? bound.width : bound.Width) * this.pdfViewerBase.getZoomFactor();
            const textLayer: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + pageNumber);
            if (textLayer) {
                const textDivs: any = textLayer.childNodes;
                for (let n: number = 0; n < textDivs.length; n++) {
                    if (textDivs[parseInt(n.toString(), 10)]) {
                        const rangebounds: any = textDivs[parseInt(n.toString(), 10)].getBoundingClientRect();
                        const top: number = this.getClientValueTop(rangebounds.top, pageNumber);
                        const currentLeft: number = rangebounds.left - this.pdfViewerBase.getElement('_pageDiv_' + pageNumber).getBoundingClientRect().left;
                        const totalLeft: number = currentLeft + rangebounds.width;
                        const textDiVLeft: number = parseInt(textDivs[parseInt(n.toString(), 10)].style.left, 10);
                        const currentTop: number = parseInt(textDivs[parseInt(n.toString(), 10)].style.top, 10);
                        const isLeftBounds: boolean = this.checkLeftBounds(currentLeft, textDiVLeft, totalLeft, x);
                        const isTopBounds: boolean = this.checkTopBounds(top, currentTop, y);
                        if (isLeftBounds && isTopBounds) {
                            element = textDivs[parseInt(n.toString(), 10)];
                            break;
                        }
                    }
                }
                if (element != null) {
                    const boundingRect: any = this.pdfViewerBase.getElement('_textLayer_' + pageNumber).getBoundingClientRect();
                    this.textSelectionOnMouseMove(element, x + boundingRect.left, y + boundingRect.top, false);
                    if ((bounds.length - 1) === k) {
                        this.textSelectionOnMouseMove(element, x + boundingRect.left + width, y + boundingRect.top, false);
                    }
                }
            }
        }
    }

    /**
     * @param {number} left - It describes about the left value
     * @param {number} textDiVLeft - It describes about the text div left value
     * @param {number} totalLeft - It describes about the total left value
     * @param {number} x - It describes about the x value
     * @private
     * @returns {boolean} - boolean
     */
    public checkLeftBounds(left: number, textDiVLeft: number, totalLeft: number, x: number): boolean {
        let isExists: boolean = false;
        if (left === parseInt(x.toString(), 10) || parseInt(left.toString(), 10) === parseInt(x.toString(), 10) ||
        (left + 1) === parseInt(x.toString(), 10) || (left - 1) === parseInt(x.toString(), 10)
            || textDiVLeft === parseInt(x.toString(), 10) || textDiVLeft === x || (totalLeft >= x && left <= x)) {
            isExists = true;
        }
        return isExists;
    }

    /**
     * @param {number} top - It describes about the top value
     * @param {number} currentTop - It describes about the current top value
     * @param {number} y - It describes about the Y value
     * @private
     * @returns {boolean} - boolean
     */
    public checkTopBounds(top: number, currentTop: number, y: number): boolean {
        let isExists: boolean = false;
        if ((top === parseInt(y.toString(), 10) || parseInt(top.toString(), 10) === parseInt(y.toString(), 10) ||
        parseInt((top + 1).toString(), 10) === parseInt(y.toString(), 10) ||
        parseInt((top - 1).toString(), 10) === parseInt(y.toString(), 10)
            || currentTop === parseInt(y.toString(), 10) || currentTop === y)) {
            isExists = true;
        }
        return isExists;
    }

    /**
     * @param {MouseEvent} event - It describes about the event
     * @private
     * @returns {void}
     */
    public textSelectionOnMouseLeave(event: MouseEvent): void {
        event.preventDefault();
        const viewerTop: number = this.pdfViewerBase.viewerContainer.offsetTop;
        if (this.pdfViewer.magnificationModule) {
            if (this.pdfViewer.magnificationModule.fitType === 'fitToPage') {
                return;
            }
        }
        if (event.clientY > viewerTop) {
            this.scrollMoveTimer = setInterval(() => {
                this.scrollForwardOnSelection();
            }, 500);
        } else {
            this.scrollMoveTimer = setInterval(() => {
                this.scrollBackwardOnSelection();
            }, 500);
        }
    }

    private scrollForwardOnSelection(): void {
        if (!this.pdfViewerBase.isSignInitialClick) {
            this.isMouseLeaveSelection = true;
            this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.viewerContainer.scrollTop + 200;
            this.stichSelectionOnScroll(this.pdfViewerBase.currentPageNumber - 1);
        }
    }

    private scrollBackwardOnSelection(): void {
        this.isMouseLeaveSelection = true;
        this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.viewerContainer.scrollTop - 200;
        this.stichSelectionOnScroll(this.pdfViewerBase.currentPageNumber - 1);
    }

    /**
     * @private
     * @returns {void}
     */
    public clear(): void {
        if (this.scrollMoveTimer) {
            this.isMouseLeaveSelection = false;
            clearInterval(this.scrollMoveTimer);
        }
    }

    /**
     * @param {any} element - It describes about the element
     * @param {number} x - It describes about the X value
     * @param {number} y - It describes about the Y value
     * @param {boolean} isStoreSelection - It describes about the isStoreSelection value
     * @private
     * @returns {void}
     */
    public selectAWord(element: any, x: number, y: number, isStoreSelection: boolean): void {
        let padding: number = 0;
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            padding = 3;
        }
        if (element.nodeType === element.TEXT_NODE) {
            const selection: Selection = window.getSelection();
            const range: Range = element.ownerDocument.createRange();
            range.selectNodeContents(element);
            let currentPosition: number = 0;
            const endPosition: number = range.endOffset;
            while (currentPosition < endPosition) {
                range.setStart(element, currentPosition);
                range.setEnd(element, currentPosition + 1);
                const rangeBounds: ClientRect = range.getBoundingClientRect();
                if (rangeBounds.left <= x + padding && rangeBounds.right >= x - padding &&
                    rangeBounds.top <= y + padding && rangeBounds.bottom >= y - padding) {
                    const textContent: string = element.textContent;
                    const indices: number[] = [];
                    let startPosition: number;
                    let endPos: number;
                    for (let i: number = 0; i < textContent.length; i++) {
                        if (textContent[parseInt(i.toString(), 10)] === ' ') {
                            indices.push(i);
                        }
                    }
                    for (let j: number = 0; j < indices.length; j++) {
                        if (currentPosition === indices[parseInt(j.toString(), 10)]) {
                            startPosition = indices[parseInt(j.toString(), 10)];
                            endPos = indices[parseInt(j.toString(), 10)];
                        }
                        if (indices[0] > currentPosition) {
                            startPosition = 0;
                            endPos = indices[parseInt(j.toString(), 10)];
                            break;
                        }
                        if (currentPosition > indices[parseInt(j.toString(), 10)] && currentPosition < indices[j + 1]) {
                            startPosition = indices[parseInt(j.toString(), 10)];
                            endPos = indices[j + 1];
                        } else if (currentPosition > indices[parseInt(j.toString(), 10)]) {
                            if (!indices[j + 1]) {
                                startPosition = indices[parseInt(j.toString(), 10)];
                            }
                        }
                    }
                    if (!endPos) {
                        endPos = textContent.length;
                    }
                    if (startPosition === 0) {
                        range.setStart(element, startPosition);
                    } else {
                        range.setStart(element, startPosition + 1);
                    }
                    range.setEnd(element, endPos);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    this.isTextSelection = true;
                    const startParent: HTMLElement = isNullOrUndefined(range.startContainer.parentElement) ?
                        (range.startContainer.parentNode as HTMLElement) : range.startContainer.parentElement;
                    this.selectionStartPage = parseInt(startParent.id.split('_text_')[1], 10);
                    if (isStoreSelection) {
                        this.selectionAnchorTouch = { anchorNode: selection.anchorNode.parentElement.id,
                            anchorOffset: selection.anchorOffset };
                        this.selectionFocusTouch = { focusNode: selection.focusNode.parentElement.id, focusOffset: selection.focusOffset };
                    }
                    if (!Browser.isIE) {
                        range.detach();
                    }
                    break;
                }
                currentPosition += 1;
            }
        } else {
            for (let i: number = 0; i < element.childNodes.length; i++) {
                const range: Range = this.getSelectionRange(i, element);
                const rangeBounds: ClientRect = range.getBoundingClientRect();
                if (rangeBounds.left <= x + padding && rangeBounds.right >= x - padding &&
                    rangeBounds.top <= y + padding && rangeBounds.bottom >= y - padding) {
                    range.detach();
                    this.selectAWord(element.childNodes[parseInt(i.toString(), 10)], x, y, isStoreSelection);
                } else {
                    range.detach();
                }
            }
        }
    }

    private getSelectionRange(index: number, element: HTMLElement): Range {
        const range: Range = element.childNodes[parseInt(index.toString(), 10)].ownerDocument.createRange();
        range.selectNodeContents(element.childNodes[parseInt(index.toString(), 10)]);
        return range;
    }

    /**
     * @param {MouseEvent} event - It describes about the event
     * @private
     * @returns {void}
     */
    public selectEntireLine(event: MouseEvent): void {
        const textIds: string[] = [];
        const targetElement: HTMLElement = event.target as HTMLElement;
        const targetRect: ClientRect = targetElement.getBoundingClientRect();
        const targetcentre: number = parseInt((targetRect.top + (targetRect.height / 2)).toString(), 10);
        const pageNumber: number = parseInt((event.target as HTMLElement).id.split('_text_')[1], 10);
        const textDivs: NodeList = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_text_' + pageNumber + '"]');
        if (targetElement.classList.contains('e-pv-text')) {
            this.pdfViewer.fireTextSelectionStart(pageNumber + 1);
            for (let i: number = 0; i < textDivs.length; i++) {
                const rect: ClientRect = (textDivs[parseInt(i.toString(), 10)] as HTMLElement).getBoundingClientRect();
                const topValue: number = parseInt(rect.top.toString(), 10);
                const bottomValue: number = parseInt(rect.bottom.toString(), 10);
                if ((topValue <= targetcentre && bottomValue > targetcentre) && (targetRect.bottom + 10 > bottomValue)) {
                    const textId: string = (textDivs[parseInt(i.toString(), 10)] as HTMLElement).id;
                    if (textId !== '') {
                        textIds.push(textId);
                    }
                }
            }
            const selection: Selection = window.getSelection();
            selection.removeAllRanges();
            const range: Range = document.createRange();
            const lengths: number = (textIds.length - 1);
            const d1: HTMLElement = document.getElementById(textIds[0]);
            const d2: HTMLElement = document.getElementById(textIds[parseInt(lengths.toString(), 10)]);
            const childNodes: number = d2.childNodes.length;
            if (childNodes > 0) {
                range.setStart(d1.childNodes[0], 0);
                range.setEnd(d2.childNodes[0], d2.textContent.length);
            } else {
                range.setStart(d1.childNodes[0], 0);
                range.setEnd(d2, 1);
            }
            this.selectionStartPage = parseInt(range.startContainer.parentElement.id.split('_text_')[1], 10);
            selection.addRange(range);
            this.isTextSelection = true;
            if (selection != null && this.pdfViewer.contextMenuSettings.contextMenuAction === 'MouseUp') {
                this.calculateContextMenuPosition(event.clientY, event.clientY);
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public enableTextSelectionMode(): void {
        this.pdfViewerBase.isTextSelectionDisabled = false;
        if (!isNullOrUndefined(this.pdfViewerBase.viewerContainer)){
            this.pdfViewerBase.viewerContainer.classList.remove('e-disable-text-selection');
            this.pdfViewerBase.viewerContainer.classList.add('e-enable-text-selection');
            this.pdfViewerBase.viewerContainer.addEventListener('selectstart', (e: any) => {
                e.preventDefault();
                return true;
            });
        }

    }

    public clearTextSelection(): void {
        if (this.isTextSelection) {
            this.pdfViewerBase.textLayer.clearDivSelection();
            if (window.getSelection) {
                if (window.getSelection().removeAllRanges) {
                    window.getSelection().removeAllRanges();
                }
            }
            if (this.pdfViewer.linkAnnotationModule) {
                let lowerPageIndex: number = this.pdfViewerBase.currentPageNumber - 3;
                lowerPageIndex = (lowerPageIndex < 0) ? 0 : lowerPageIndex;
                let higherPageIndex: number = this.pdfViewer.currentPageNumber + 1;
                higherPageIndex = (higherPageIndex < (this.pdfViewerBase.pageCount - 1)) ? higherPageIndex :
                    (this.pdfViewerBase.pageCount - 1);
                for (let i: number = lowerPageIndex; i <= higherPageIndex; i++) {
                    this.pdfViewer.linkAnnotationModule.modifyZindexForTextSelection(i, false);
                }
            }
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                this.pdfViewer.annotation.textMarkupAnnotationModule.showHideDropletDiv(true);
            }
            this.selectionRangeArray = [];
            this.isTextSelection = false;
            this.isTouchSelection = false;
            if (this.pdfViewer.textSearchModule) {
                this.pdfViewer.textSearchModule.searchAfterSelection();
            }
            this.pdfViewerBase.contextMenuModule.close();
            this.removeTouchElements();
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public removeTouchElements(): void {
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
     * @returns {void}
     */
    public resizeTouchElements(): void {
        const viewerContainerLeft: number = this.pdfViewerBase.viewerContainer.getBoundingClientRect().left;
        if (this.dropDivElementLeft) {
            const elementClientRect: ClientRect = this.dropDivElementLeft.getBoundingClientRect();
            let dropElementHeight: number = 0;
            const leftCurrentPagePosition: ClientRect = this.pdfViewerBase.getElement('_pageDiv_' + this.topStoreLeft.pageNumber).getBoundingClientRect();
            this.dropDivElementLeft.style.left = parseFloat(this.topStoreLeft.left.toString()) * this.pdfViewerBase.getZoomFactor() + leftCurrentPagePosition.left - viewerContainerLeft - (elementClientRect.width / 2) + 'px';
            if (this.topStoreLeft.isHeightNeeded) {
                dropElementHeight = (elementClientRect.height / 2) * this.pdfViewerBase.getZoomFactor();
            }
            this.dropDivElementLeft.style.top = parseFloat(this.topStoreLeft.pageTop.toString()) * this.pdfViewerBase.getZoomFactor() + parseFloat(this.topStoreLeft.topClientValue.toString()) * this.pdfViewerBase.getZoomFactor() + dropElementHeight + 'px';
        }
        if (this.dropDivElementRight) {
            const elementClientRect: ClientRect = this.dropDivElementRight.getBoundingClientRect();
            let dropElementHeight: number = 0;
            const rightCurrentPagePosition: ClientRect = this.pdfViewerBase.getElement('_pageDiv_' + this.topStoreRight.pageNumber).getBoundingClientRect();
            this.dropDivElementRight.style.left = parseFloat(this.topStoreRight.left.toString()) * this.pdfViewerBase.getZoomFactor() + rightCurrentPagePosition.left - viewerContainerLeft - (elementClientRect.width / 2) + 'px';
            if (this.topStoreRight.isHeightNeeded) {
                dropElementHeight = (elementClientRect.height / 2) * this.pdfViewerBase.getZoomFactor();
            }
            this.dropDivElementRight.style.top = parseFloat(this.topStoreRight.pageTop.toString()) * this.pdfViewerBase.getZoomFactor() + parseFloat(this.topStoreRight.topClientValue.toString()) * this.pdfViewerBase.getZoomFactor() + dropElementHeight + 'px';
        }
    }

    /**
     * @param {MouseEvent} event - It describes about the event
     * @private
     * @returns {void}
     */
    public textSelectionOnMouseup(event: MouseEvent): void {
        this.clear();
        if (window.getSelection().anchorNode !== null) {
            this.isMouseLeaveSelection = false;
            this.isSelectionStartTriggered = false;
            this.maintainSelectionOnZoom(true, false);
            this.fireTextSelectEnd();
            const isTextSearch: boolean = this.pdfViewerBase.textLayer.getTextSearchStatus();
            if (isTextSearch) {
                this.pdfViewerBase.textLayer.clearDivSelection();
                const indexes: any = this.pdfViewer.textSearchModule.getIndexes();
                const lowerPageValue: number = parseFloat(indexes.lowerPageValue.toString());
                const higherPageValue: number = parseFloat(indexes.higherPageValue.toString());
                for (let i: number = lowerPageValue; i < higherPageValue; i++) {
                    this.applySelectionRangeOnScroll(i);
                }
                this.pdfViewer.textSearchModule.searchAfterSelection();
            } else {
                this.applySpanForSelection();
            }
            if (this.pdfViewer.linkAnnotationModule) {
                this.pdfViewer.linkAnnotationModule.modifyZindexForTextSelection(this.pdfViewerBase.currentPageNumber - 1, false);
            }
            if (this.isTextSearched && this.pdfViewer.contextMenuSettings.contextMenuAction === 'MouseUp') {
                this.calculateContextMenuPosition(event.clientY, event.clientX);
                this.isTextSearched = false;
            }
        } else {
            this.pdfViewerBase.textLayer.clearDivSelection();
            if (this.pdfViewer.textSearchModule) {
                this.pdfViewer.textSearchModule.searchAfterSelection();
            }
            this.pdfViewerBase.contextMenuModule.close();
            this.removeTouchElements();
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public fireTextSelectEnd(): void {
        if (this.selectionRangeArray.length !== 0) {
            let selectEndPageIndex: number = 0;
            let selectedText: string = '';
            const selectedBounds: any[] = [];
            for (let k: number = 0; k < this.selectionRangeArray.length; k++) {
                selectedText += this.selectionRangeArray[parseInt(k.toString(), 10)].textContent;
                for (let j: number = 0; j < this.selectionRangeArray[parseInt(k.toString(), 10)].rectangleBounds.length; j++) {
                    const currentBound: IRectangle =
                    this.selectionRangeArray[parseInt(k.toString(), 10)].rectangleBounds[parseInt(j.toString(), 10)];
                    selectedBounds.push({ left: currentBound.left, right: currentBound.right, top: currentBound.top,
                        bottom: currentBound.bottom, width: currentBound.width, height: currentBound.height,
                        pageIndex: this.selectionRangeArray[parseInt(k.toString(), 10)].pageNumber + 1 });
                }
                if (this.selectionRangeArray[parseInt(k.toString(), 10)].isBackward && k === 0) {
                    selectEndPageIndex = this.selectionRangeArray[parseInt(k.toString(), 10)].pageNumber + 1;
                } else if (!this.selectionRangeArray[parseInt(k.toString(), 10)].isBackward && k === this.selectionRangeArray.length - 1) {
                    selectEndPageIndex = this.selectionRangeArray[parseInt(k.toString(), 10)].pageNumber + 1;
                }
            }
            this.pdfViewer.fireTextSelectionEnd(selectEndPageIndex, selectedText, selectedBounds);
        }
    }

    /**
     * @param {boolean}  isMaintainSelection - It describes about the isMaintainSelection value
     * @param {boolean} isStich - It describes about the isStich value
     * @private
     * @returns {void}
     */
    public maintainSelectionOnZoom(isMaintainSelection: boolean, isStich: boolean): void {
        const selection: Selection = window.getSelection();
        if (selection.type === 'Range' || (!selection.type && !selection.isCollapsed)) {
            const isBackward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            if (selection.anchorNode != null) {
                const anchorPageId: number = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1], 10);
                let focusPageId: number = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1], 10);
                if (this.isTouchSelection && isNaN(focusPageId)) {
                    const focusElement: HTMLElement = selection.focusNode as HTMLElement;
                    if (focusElement === this.pdfViewerBase.pageContainer) {
                        const lastChildNode: HTMLElement = this.pdfViewerBase.pageContainer.lastChild as HTMLElement;
                        if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                            focusPageId = parseInt((lastChildNode.previousSibling.previousSibling as HTMLElement).id.split('_pageDiv_')[1], 10);
                        } else if (lastChildNode.classList.contains('e-pv-page-div')) {
                            focusPageId = parseInt((lastChildNode as HTMLElement).id.split('_pageDiv_')[1], 10);
                        }
                    }
                }
                if (!isBackward) {
                    for (let i: number = anchorPageId; i <= focusPageId; i++) {
                        this.maintainSelectionOnScroll(i, isStich);
                    }
                } else {
                    for (let i: number = anchorPageId; i >= focusPageId; i--) {
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
     * @param {number} pageNumber - It describes about the page number value
     * @private
     * @returns {boolean} - boolean
     */
    public isSelectionAvailableOnScroll(pageNumber: number): boolean {
        let isSelectionAvailable: boolean = false;
        const ranges: ISelection[] = this.selectionRangeArray;
        for (let i: number = 0; i < ranges.length; i++) {
            if (ranges[parseInt(i.toString(), 10)] !== null) {
                if (pageNumber === ranges[parseInt(i.toString(), 10)].pageNumber) {
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
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {void}
     */
    public applySelectionRangeOnScroll(pageNumber: number): void {
        if (this.isMouseLeaveSelection) {
            this.applySelectionMouseScroll(pageNumber);
        } else {
            this.applySelectionRange(pageNumber);
        }
    }

    private getSelectionRangeFromArray(pageNumber: number): any {
        let isSelectionAvailable: boolean = false;
        let selectionRange: ISelection = null;
        const ranges: ISelection[] = this.selectionRangeArray;
        for (let i: number = 0; i < ranges.length; i++) {
            if (ranges[parseInt(i.toString(), 10)] !== null) {
                if (pageNumber === ranges[parseInt(i.toString(), 10)].pageNumber) {
                    selectionRange = ranges[parseInt(i.toString(), 10)];
                    isSelectionAvailable = true;
                    break;
                }
            }
        }
        return { isSelectionAvailable: isSelectionAvailable, selectionRange: selectionRange };
    }

    private applySelectionRange(pageNumber: number): void {
        const selectionObject: { isSelectionAvailable: boolean; selectionRange: ISelection } = this.getSelectionRangeFromArray(pageNumber);
        const isSelectionAvailable: boolean = selectionObject.isSelectionAvailable;
        const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        if (textLayer) {
            if (isSelectionAvailable && textLayer.childNodes.length !== 0) {
                const selectionRange: ISelection = selectionObject.selectionRange;
                let anchorOffsetDiv: number; let focusOffsetDiv: number; let anchorOffset: number; let focusOffset: number;
                if (selectionRange.isBackward) {
                    const startId: number = parseInt(selectionRange.endNode.split('_text_')[1].split('_')[1], 10);
                    const endId: number = parseInt(selectionRange.startNode.split('_text_')[1].split('_')[1], 10);
                    if (startId < endId) {
                        anchorOffsetDiv = startId;
                        anchorOffset = selectionRange.endOffset;
                        focusOffset = selectionRange.startOffset;
                        focusOffsetDiv = endId;
                    } else {
                        anchorOffsetDiv = endId;
                        anchorOffset = selectionRange.endOffset;
                        focusOffsetDiv = startId;
                        focusOffset = selectionRange.startOffset;
                    }
                } else {
                    anchorOffsetDiv = parseInt(selectionRange.startNode.split('text_')[1].split('_')[1], 10);
                    focusOffsetDiv = parseInt(selectionRange.endNode.split('text_')[1].split('_')[1], 10);
                    anchorOffset = selectionRange.startOffset;
                    focusOffset = selectionRange.endOffset;
                }
                window.getSelection().removeAllRanges();
                this.pdfViewerBase.textLayer.applySpanForSelection(pageNumber, pageNumber, anchorOffsetDiv, focusOffsetDiv,
                                                                   anchorOffset, focusOffset);
                if (this.pdfViewer.textSearchModule) {
                    this.pdfViewer.textSearchModule.searchAfterSelection();
                }
            }
        }
    }

    private applySelectionMouseScroll(pageNumber: number): void {
        const selectionObject: { isSelectionAvailable: boolean; selectionRange: ISelection } = this.getSelectionRangeFromArray(pageNumber);
        const isSelectionAvailable: boolean = selectionObject.isSelectionAvailable;
        if (isSelectionAvailable) {
            const selectionRange: ISelection = selectionObject.selectionRange;
            const selection: Selection = window.getSelection();
            const anchorNode: Node = document.getElementById(selectionRange.startNode).childNodes[0];
            const focusNode: Node = document.getElementById(selectionRange.endNode).childNodes[0];
            let range: Range = document.createRange();
            if (selection.anchorNode === null) {
                if (!selectionRange.isBackward) {
                    range.setStart(anchorNode, selectionRange.startOffset);
                    range.setEnd(focusNode, selectionRange.endOffset);
                } else {
                    range.setStart(focusNode, selectionRange.endOffset);
                    range.setEnd(anchorNode, selectionRange.startOffset);
                }
            } else {
                let anchorPageIndex: number = isNaN(parseInt(selection.anchorNode.parentElement.id.split('_text_')[1], 10)) ? parseInt((selection.anchorNode as HTMLElement).id.split('_pageDiv_')[1], 10) : parseInt(selection.anchorNode.parentElement.id.split('_text_')[1], 10);
                if (isNaN(anchorPageIndex)) {
                    anchorPageIndex = parseInt((selection.anchorNode as HTMLElement).id.split('_text_')[1], 10);
                }
                const focusPageIndex: number = isNaN(parseInt(selection.focusNode.parentElement.id.split('_text_')[1], 10)) ? parseInt((selection.focusNode as HTMLElement).id.split('_pageDiv_')[1], 10) : parseInt(selection.focusNode.parentElement.id.split('_text_')[1], 10);
                const currentAnchorIndex: number = parseInt(selectionRange.startNode.split('_text_')[1], 10);
                if ((anchorPageIndex === focusPageIndex) && (anchorPageIndex === currentAnchorIndex)) {
                    if (!selectionRange.isBackward) {
                        range.setStart(anchorNode, selectionRange.startOffset);
                        range.setEnd(focusNode, selectionRange.endOffset);
                    } else {
                        range.setStart(focusNode, selectionRange.endOffset);
                        range.setEnd(anchorNode, selectionRange.startOffset);
                    }
                } else if (!isNaN(anchorPageIndex)) {
                    if (!isNaN(anchorPageIndex) && !selectionRange.isBackward) {
                        if (anchorPageIndex < currentAnchorIndex && currentAnchorIndex < focusPageIndex &&
                            anchorPageIndex !== focusPageIndex) {
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                            range.setEnd(selection.focusNode, selection.focusOffset);
                        } else if (anchorPageIndex < currentAnchorIndex) {
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                            range.setEnd(focusNode, selectionRange.endOffset);
                        } else {
                            range.setStart(anchorNode, selectionRange.startOffset);
                            range.setEnd(selection.focusNode, selection.focusOffset);
                        }
                    } else {
                        const isBackward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
                        if (anchorPageIndex > currentAnchorIndex && currentAnchorIndex > focusPageIndex &&
                            anchorPageIndex !== focusPageIndex) {
                            if (!isBackward) {
                                range.setStart(selection.anchorNode, selection.anchorOffset);
                                range.setEnd(selection.focusNode, selection.focusOffset);
                            } else {
                                selection.extend(selection.focusNode, selection.focusOffset);
                            }
                        } else if (anchorPageIndex < currentAnchorIndex && currentAnchorIndex < focusPageIndex &&
                            anchorPageIndex !== focusPageIndex) {
                            if (!isBackward) {
                                range.setStart(selection.anchorNode, selection.anchorOffset);
                                range.setEnd(selection.focusNode, selection.focusOffset);
                            } else {
                                selection.extend(selection.focusNode, selection.focusOffset);
                            }
                        } else if (anchorPageIndex < currentAnchorIndex) {
                            if (!isBackward) {
                                if (currentAnchorIndex !== this.selectionRangeArray[0].pageNumber) {
                                    range.setStart(selection.anchorNode, selection.anchorOffset);
                                    range.setEnd(focusNode, selectionRange.endOffset);
                                } else {
                                    range.setStart(selection.anchorNode, selection.anchorOffset);
                                    range.setEnd(anchorNode, selectionRange.startOffset);
                                }
                            } else {
                                if (currentAnchorIndex !== this.selectionRangeArray[0].pageNumber) {
                                    this.extendCurrentSelection(focusNode.parentElement, selectionRange.endOffset, selection, range);
                                } else {
                                    this.extendCurrentSelection(anchorNode.parentElement, selectionRange.startOffset, selection, range);
                                }
                            }
                        } else if (anchorPageIndex === currentAnchorIndex) {
                            if (currentAnchorIndex === focusPageIndex) {
                                range.setStart(anchorNode, selectionRange.startOffset);
                                range.setEnd(anchorNode, selectionRange.startOffset);
                                selection.removeAllRanges();
                                selection.addRange(range);
                                range = document.createRange();
                                selection.extend(focusNode, selectionRange.endOffset);
                            } else {
                                if (isBackward) {
                                    this.extendCurrentSelection(focusNode.parentElement, selectionRange.endOffset, selection, range);
                                } else {
                                    range.setStart(focusNode, selectionRange.endOffset);
                                    range.setEnd(selection.focusNode, selection.focusOffset);
                                }
                            }
                        } else if (focusPageIndex === currentAnchorIndex) {
                            if (isBackward) {
                                selection.extend(selection.focusNode, selection.focusOffset);
                            } else {
                                range.setStart(selection.anchorNode, selection.anchorOffset);
                                range.setEnd(selection.focusNode, selection.focusOffset);
                            }
                        } else if (anchorPageIndex > currentAnchorIndex) {
                            const currentAnchorOffset: number = parseInt(selectionRange.startNode.split('_' + currentAnchorIndex + '_')[1], 10);
                            const currentFocusOffset: number = parseInt(selectionRange.endNode.split('_' + currentAnchorIndex + '_')[1], 10);
                            if (isBackward) {
                                if (currentAnchorIndex !== this.selectionRangeArray[0].pageNumber) {
                                    if (currentAnchorOffset < currentFocusOffset) {
                                        this.extendCurrentSelection(anchorNode.parentElement, selectionRange.startOffset, selection, range);
                                    } else {
                                        range.setStart(focusNode.parentElement, selectionRange.endOffset);
                                        range.setEnd(selection.anchorNode, selection.anchorOffset);
                                    }
                                } else {
                                    this.extendCurrentSelection(focusNode.parentElement, selectionRange.endOffset, selection, range);
                                }
                            } else {
                                if (currentAnchorOffset < currentFocusOffset) {
                                    range.setStart(anchorNode, selectionRange.startOffset);
                                    range.setEnd(selection.focusNode, selection.focusOffset);
                                } else {
                                    range.setStart(focusNode, selectionRange.endOffset);
                                    range.setEnd(selection.focusNode, selection.focusOffset);
                                }
                            }
                        }
                    }
                } else if (isNaN(anchorPageIndex)) {
                    if (!selectionRange.isBackward) {
                        range.setStart(anchorNode, selectionRange.startOffset);
                        range.setEnd(focusNode, selectionRange.endOffset);
                    } else {
                        range.setStart(focusNode, selectionRange.endOffset);
                        range.setEnd(anchorNode, selectionRange.startOffset);
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
     * @param {number} pageNumber - It describes about the page number
     * @param {boolean} isStich - It describes about the isStich value
     * @private
     * @returns {void}
     */
    public maintainSelectionOnScroll(pageNumber: number, isStich: boolean): void {
        const isSelectionAvailable: boolean = this.isSelectionAvailableOnScroll(pageNumber);
        if (this.isTextSelection && !isSelectionAvailable) {
            this.maintainSelection(pageNumber, isStich);
        }
    }

    /**
     * @param {number} pageNumber - It describes about the page number
     * @param {boolean} isStich - It describes about the isStich value
     * @private
     * @returns {void}
     */
    public maintainSelection(pageNumber: number, isStich: boolean): void {
        const selection: Selection = window.getSelection();
        if (this.isTextSelection && (selection.type === 'Range' || (!selection.type && !selection.isCollapsed))) {
            const anchorPageId: number = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1], 10);
            let focusPageId: number = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1], 10);
            if (isNaN(focusPageId) && selection.anchorNode !== null) {
                const backward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
                if (!backward) {
                    const lastChildNode: HTMLElement = this.pdfViewerBase.pageContainer.lastChild as HTMLElement;
                    if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                        focusPageId = parseInt((lastChildNode.previousSibling.previousSibling as HTMLElement).id.split('_pageDiv_')[1], 10);
                    } else {
                        focusPageId = parseInt(lastChildNode.id.split('_pageDiv_')[1], 10);
                    }
                } else {
                    focusPageId = parseInt((this.pdfViewerBase.pageContainer.firstChild as HTMLElement).id.split('_pageDiv_')[1], 10);
                }
            }
            const backward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            if (this.isTouchSelection && pageNumber > focusPageId && pageNumber > anchorPageId) {
                return;
            }
            if (anchorPageId === focusPageId) {
                let selectionObject: ISelection = null;
                const selectionBounds: IRectangle = this.getSelectionBounds(selection.getRangeAt(0), pageNumber);
                const selectionRectBounds: IRectangle[] = this.getSelectionRectangleBounds(selection.getRangeAt(0), pageNumber);
                const anchorOffsetValue: number = (this.getNodeElementFromNode(selection.anchorNode).childNodes.length === 1) ?
                    selection.anchorOffset : this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                const focusOffsetValue: number = (this.getNodeElementFromNode(selection.focusNode).childNodes.length === 1) ?
                    selection.focusOffset : this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                selectionObject = {
                    isBackward: backward, startNode: this.getNodeElementFromNode(selection.anchorNode).id,
                    startOffset: anchorOffsetValue, endNode: this.getNodeElementFromNode(selection.focusNode).id,
                    endOffset: focusOffsetValue, textContent: this.allTextContent, pageNumber: pageNumber, bound: selectionBounds,
                    rectangleBounds: selectionRectBounds
                };
                this.pushSelectionRangeObject(selectionObject, pageNumber);
            } else {
                const selectionObject: ISelection = this.createRangeObjectOnScroll(pageNumber, anchorPageId, focusPageId);
                if (selectionObject) {
                    this.pushSelectionRangeObject(selectionObject, pageNumber);
                    if (isStich) {
                        this.stichSelection(backward, selection, pageNumber);
                    }
                }
            }
        }
    }

    private getCorrectOffset(node: Node, offset: number): number {
        let offsetValue: number = 0;
        const parentElement: HTMLElement = this.getNodeElementFromNode(node);
        for (let i: number = 0; i < parentElement.childNodes.length; i++) {
            if (parentElement.childNodes[parseInt(i.toString(), 10)] === node) {
                offsetValue = offsetValue + offset;
                break;
            } else {
                offsetValue = offsetValue + parentElement.childNodes[parseInt(i.toString(), 10)].textContent.length;
            }
        }
        return offsetValue;
    }

    private pushSelectionRangeObject(selectionObject: ISelection, pageNumber: number): void {
        if (this.isTouchSelection) {
            const currentObject: ISelection[] = this.selectionRangeArray.filter(
                (obj: any) => {
                    return (obj.pageNumber === pageNumber);
                });
            if (currentObject.length > 0) {
                const currentObjectIndex: number = this.selectionRangeArray.indexOf(currentObject[0]);
                this.selectionRangeArray.splice(currentObjectIndex, 1, selectionObject);
                return;
            }
        }
        const nextPageObject: ISelection[] = this.selectionRangeArray.filter(
            (obj: any) => {
                return (obj.pageNumber === (pageNumber + 1));
            });
        if (nextPageObject.length === 0) {
            if (this.isTouchSelection && this.selectionRangeArray.length !== 0) {
                const prevPageObject: ISelection[] = this.selectionRangeArray.filter(
                    (obj: any) => {
                        return (obj.pageNumber === (pageNumber - 1));
                    });
                if (prevPageObject.length !== 0) {
                    const prevIndex: number = this.selectionRangeArray.indexOf(prevPageObject[0]);
                    this.selectionRangeArray.splice(prevIndex + 1, 0, selectionObject);
                } else {
                    const firstObject: ISelection = this.selectionRangeArray[0];
                    if (pageNumber < firstObject.pageNumber) {
                        this.selectionRangeArray.splice(0, 0, selectionObject);
                    } else {
                        this.selectionRangeArray.push(selectionObject);
                    }
                }
            } else {
                this.selectionRangeArray.push(selectionObject);
            }
        } else {
            const index: number = this.selectionRangeArray.indexOf(nextPageObject[0]);
            this.selectionRangeArray.splice(index, 0, selectionObject);
        }
    }

    private extendCurrentSelection(element: HTMLElement, offset: number, selection: Selection, range: Range): void {
        const currentFocusOffset: number = selection.focusOffset;
        let currentFocusElement: string = selection.focusNode.parentElement.id;
        const focusPageId: number = isNaN(parseInt(currentFocusElement.split('_text_')[1], 10)) ? parseInt((selection.focusNode as HTMLElement).id.split('_pageDiv_')[1], 10) : parseInt(currentFocusElement.split('_text_')[1], 10);
        if (isNaN(parseInt(currentFocusElement.split('_text_')[1], 10))) {
            currentFocusElement = (this.pdfViewerBase.getElement('_textLayer_' + (focusPageId + 1)).firstChild as HTMLElement).id;
        }
        range.setStart(element.childNodes[0], offset);
        range.setEnd(element.childNodes[0], offset);
        selection.removeAllRanges();
        selection.addRange(range);
        selection.extend(document.getElementById(currentFocusElement).childNodes[0], currentFocusOffset);
    }

    private stichSelection(backward: boolean, selection: Selection, pageNumber: number): void {
        const range: Range = document.createRange();
        let nextPageElement: HTMLElement;
        if (backward) {
            nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber - 1));
            if (nextPageElement) {
                let lastElement: HTMLElement = nextPageElement.lastChild as HTMLElement;
                if (lastElement) {
                    this.extendCurrentSelection(lastElement, this.getTextLastLength(lastElement), selection, range);
                } else {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber - 2));
                    lastElement = nextPageElement.lastChild as HTMLElement;
                    this.extendCurrentSelection(lastElement, this.getTextLastLength(lastElement), selection, range);
                }
            } else {
                nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber + 1));
                const lastElement: HTMLElement = nextPageElement.firstChild as HTMLElement;
                this.extendCurrentSelection(lastElement, 0, selection, range);
            }
        } else {
            nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber + 1));
            if (nextPageElement) {
                let firstElement: HTMLElement = nextPageElement.firstChild as HTMLElement;
                if (!firstElement) {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber + 2));
                    firstElement = nextPageElement.firstChild as HTMLElement;
                    range.setStart(firstElement.childNodes[0], 0);
                } else {
                    range.setStart(firstElement.childNodes[0], 0);
                }
                range.setEnd(selection.focusNode, selection.focusOffset);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }

    /**
     * @param {number} currentPageNumber - It describes about the current page number
     * @private
     * @returns {void}
     */
    public textSelectionOnMouseWheel(currentPageNumber: number): void {
        this.isMouseLeaveSelection = true;
        this.stichSelectionOnScroll(currentPageNumber);
    }

    /**
     * @param {number} currentPageNumber - It describes about the current page number
     * @private
     * @returns {void}
     */
    public stichSelectionOnScroll(currentPageNumber: number): void {
        const selection: Selection = window.getSelection();
        if (this.isTextSelection) {
            const anchorPageId: number = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1], 10);
            const focusPageId: number = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1], 10);
            let nextPageElement: HTMLElement;
            if (anchorPageId !== currentPageNumber && focusPageId !== currentPageNumber) {
                const backward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
                if (!backward) {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (currentPageNumber - 1));
                    if (nextPageElement) {
                        const lastElement: HTMLElement = nextPageElement.lastChild as HTMLElement;
                        if (lastElement) {
                            if (lastElement.childNodes[0]) {
                                this.extendSelectionStich(lastElement.childNodes[0], this.getTextLastLength(lastElement), selection);
                            } else {
                                this.extendSelectionStich(lastElement, this.getTextLastLength(lastElement), selection);
                            }
                        } else {
                            nextPageElement = this.pdfViewerBase.getElement('_textLayer_' + currentPageNumber);
                            const lastElement: HTMLElement = nextPageElement.firstChild as HTMLElement;
                            this.extendSelectionStich(lastElement.childNodes[0], 0, selection);
                        }
                    }
                } else {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (currentPageNumber - 1));
                    if (nextPageElement) {
                        const lastElement: HTMLElement = nextPageElement.firstChild as HTMLElement;
                        if (lastElement) {
                            this.extendSelectionStich(lastElement.childNodes[0], 0, selection);
                        }
                    }
                }
            }
            this.maintainSelectionArray();
        }
    }

    private extendSelectionStich(node: Node, offset: number, selection: Selection): void {
        if (selection.extend) {
            selection.extend(node, offset);
        }
    }

    /**
     * @param {number} pageNumber - It describes about the page number
     * @param {number} anchorPageId - It describes about the anchor page id
     * @param {number} focusPageId - It describes about the focus page id
     * @private
     * @returns {ISelection} - ISelection
     */
    public createRangeObjectOnScroll(pageNumber: number, anchorPageId: number, focusPageId: number): ISelection {
        let selectionObject: ISelection = null;
        const selection: Selection = window.getSelection();
        if (selection.anchorNode !== null) {
            const backward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            let firstElement: HTMLElement;
            let lastElement: HTMLElement;
            let startOffset: number;
            let endOffset: number;
            const element: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
            if (element.childNodes) {
                if (!backward) {
                    if (pageNumber === anchorPageId) {
                        firstElement = this.getNodeElementFromNode(selection.anchorNode);
                        lastElement = (element.lastChild as HTMLElement);
                        startOffset = this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                        endOffset = this.getTextLastLength(lastElement);
                    } else if (pageNumber > anchorPageId && pageNumber < focusPageId) {
                        firstElement = (element.firstChild as HTMLElement);
                        lastElement = (element.lastChild as HTMLElement);
                        startOffset = 0;
                        endOffset = this.getTextLastLength(lastElement);
                    } else if (pageNumber === focusPageId) {
                        firstElement = (element.firstChild as HTMLElement);
                        const pageNumberIndex: number = this.getNodeElementFromNode(selection.focusNode).id.indexOf(focusPageId.toString());
                        if (pageNumberIndex !== -1) {
                            lastElement = this.getNodeElementFromNode(selection.focusNode);
                            endOffset = this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                        } else {
                            lastElement = (document.getElementById(this.pdfViewer.element.id + '_textLayer_' + focusPageId).lastChild as HTMLElement);
                            endOffset = this.getTextLastLength(lastElement);
                        }
                        startOffset = 0;
                    }
                } else {
                    if (pageNumber === anchorPageId) {
                        firstElement = this.getNodeElementFromNode(selection.anchorNode);
                        lastElement = (element.firstChild as HTMLElement);
                        startOffset = this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                        endOffset = 0;
                    } else if (pageNumber < anchorPageId && pageNumber > focusPageId) {
                        firstElement = (element.firstChild as HTMLElement);
                        lastElement = (element.lastChild as HTMLElement);
                        startOffset = 0;
                        endOffset = this.getTextLastLength(lastElement);
                    } else if (pageNumber === focusPageId) {
                        firstElement = this.getNodeElementFromNode(selection.focusNode);
                        lastElement = (element.lastChild as HTMLElement);
                        startOffset = this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                        endOffset = this.getTextLastLength(lastElement);
                    }
                }
                if (firstElement && lastElement) {
                    const selectionRangeObject: Range = this.getSelectionRangeObject(firstElement.id, startOffset,
                                                                                     lastElement.id, endOffset, pageNumber);
                    const selectionBound: IRectangle = this.getSelectionBounds(selectionRangeObject, pageNumber);
                    const selectionRectBounds: IRectangle[] = this.getSelectionRectangleBounds(selectionRangeObject, pageNumber);
                    return selectionObject = { isBackward: backward, startNode: firstElement.id, startOffset: startOffset,
                        endNode: lastElement.id, endOffset: endOffset, textContent: this.allTextContent, pageNumber: pageNumber,
                        bound: selectionBound, rectangleBounds: selectionRectBounds };
                } else {
                    return null;
                }
            }
        }
        return null;
    }

    private getSelectionRangeObject(startNode: string, startOffset: number, endNode: string, endOffset: number, pageNumber: number): Range {
        let startElement: Node = document.getElementById(startNode);
        let endElement: Node = document.getElementById(endNode);
        if (startElement.childNodes[0]) {
            startElement = startElement.childNodes[0];
        }
        if (endElement.childNodes[0]) {
            endElement = endElement.childNodes[0];
        }
        const currentAnchorOffset: number = parseInt(startNode.split('_' + pageNumber + '_')[1], 10);
        const currentFocusOffset: number = parseInt(endNode.split('_' + pageNumber + '_')[1], 10);
        const range: Range = document.createRange();
        if (currentAnchorOffset <= currentFocusOffset) {
            range.setStart(startElement, startOffset);
            range.setEnd(endElement, endOffset);
        } else {
            range.setStart(endElement, endOffset);
            range.setEnd(startElement, startOffset);
        }
        return range;
    }

    private getSelectionBounds(range: Range, pageNumber: number): IRectangle {
        const startElement: HTMLElement = this.getNodeElementFromNode(range.startContainer);
        const endElement: HTMLElement = this.getNodeElementFromNode(range.endContainer);
        let bounds: IRectangle = null;
        if (startElement !== endElement) {
            const newStartRange: Range = document.createRange();
            const startRange: Range = this.createRangeForSelection(range.startContainer, range.endContainer,
                                                                   range.startOffset, range.endOffset, newStartRange);
            bounds = this.normalizeBounds(startRange.getBoundingClientRect(), pageNumber);
        } else {
            bounds = this.normalizeBounds(range.getBoundingClientRect(), pageNumber);
        }
        return bounds;
    }

    private getSelectionRectangleBounds(range: Range, pageNumber: number): IRectangle[] {
        const selectionBounds: IRectangle[] = [];
        const startElement: HTMLElement = this.getNodeElementFromNode(range.startContainer);
        const endElement: HTMLElement = this.getNodeElementFromNode(range.endContainer);
        let bounds: IRectangle = null;
        const selectionTexts: any[] = [];
        this.allTextContent = '';
        if (startElement !== endElement) {
            let startOffset: number = 0; let endOffset: number = 0; let currentId: number = 0;
            const anchorPageId: number = this.pdfViewerBase.textLayer.getPageIndex(range.startContainer);
            const anchorTextId: number = this.pdfViewerBase.textLayer.getTextIndex(range.startContainer, anchorPageId);
            const focusPageId: number = this.pdfViewerBase.textLayer.getPageIndex(range.endContainer);
            const focusTextId: number = this.pdfViewerBase.textLayer.getTextIndex(range.endContainer, focusPageId);
            const textDivs: NodeList = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).childNodes;
            if (pageNumber === anchorPageId) {
                currentId = anchorTextId;
            } else {
                currentId = 0;
            }
            for (let j: number = currentId; j < textDivs.length; j++) {
                const textElement: HTMLElement = textDivs[parseInt(j.toString(), 10)] as HTMLElement;
                if (j > focusTextId) {
                    break;
                }
                if (j === anchorTextId) {
                    startOffset = range.startOffset;
                } else {
                    startOffset = 0;
                }
                if (j === focusTextId) {
                    endOffset = range.endOffset;
                } else {
                    endOffset = textElement.textContent.length;
                }
                if (startOffset !== 0 || endOffset !== 0) {
                    const newRange: Range = document.createRange();
                    for (let k: number = 0; k < textElement.childNodes.length; k++) {
                        const node: Node = textElement.childNodes[parseInt(k.toString(), 10)];
                        newRange.setStart(node, startOffset);
                        newRange.setEnd(node, endOffset);
                    }
                    let boundingRect: IRectangle;
                    if (this.pdfViewerBase.clientSideRendering) {
                        boundingRect = this.normalizeBounds(newRange.getBoundingClientRect(), pageNumber);
                        let textRotate: number = 0;
                        if (textElement && textElement.style.transform !== '') {
                            if (textElement.style.transform.startsWith('rotate(90deg)')) {
                                textRotate = 90;
                            } else if (textElement.style.transform.startsWith('rotate(180deg)')) {
                                textRotate = 180;
                            } else if (textElement.style.transform.startsWith('rotate(-90deg)') || textElement.style.transform.startsWith('rotate(270deg)')) {
                                textRotate = 270;
                            } else {
                                textRotate = 0;
                            }
                        }
                        boundingRect.rotation = textRotate;
                    } else {
                        boundingRect = this.normalizeBounds(newRange.getBoundingClientRect(), pageNumber);
                    }
                    selectionBounds.push(boundingRect);
                    const textselection: string = newRange.toString();
                    selectionTexts.push(textselection);
                    newRange.detach();
                    if (textselection === '\r\n' || textselection === ' ') {
                        if (j === focusTextId + 1) {
                            break;
                        }
                    }
                    else if (j === focusTextId) {
                        break;
                    }
                }
            }
            for (let i: number = 0; i < selectionTexts.length; i++) {
                let text: string = selectionTexts[parseInt(i.toString(), 10)];
                // While copy and paste for space construct new line
                if ((i !== 0 && text === ' ' && selectionTexts[i - 1].includes('\r\n')) || (i !== selectionTexts.length - 1 && selectionTexts[parseInt(i.toString(), 10)] === ' ' && selectionTexts[i + 1] === '\r\n')) {
                    text = '';
                }
                if (text.slice(text.length - 2) !== '\r\n' || i === selectionTexts.length - 1) {
                    this.allTextContent += text;
                }
                else {
                    this.allTextContent += text;
                }
            }
        }
        else {
            bounds = this.normalizeBounds(range.getBoundingClientRect(), pageNumber);
            if (this.pdfViewerBase.clientSideRendering) {
                let textRotate: number = 0;
                if (startElement && startElement.style.transform !== '') {
                    if (startElement.style.transform.startsWith('rotate(90deg)')) {
                        textRotate = 90;
                    } else if (startElement.style.transform.startsWith('rotate(180deg)')) {
                        textRotate = 180;
                    } else if (startElement.style.transform.startsWith('rotate(-90deg)') || startElement.style.transform.startsWith('rotate(270deg)')) {
                        textRotate = 270;
                    } else {
                        textRotate = 0;
                    }
                }
                bounds.rotation = textRotate;
            }
            this.allTextContent = range.toString();
            selectionBounds.push(bounds);
        }
        return selectionBounds;
    }

    private getAngle(rotation: number): number {
        let angle: number = 0;
        if (rotation) {
            switch (rotation) {
            case 0:
                angle = 0;
                break;
            case 1:
                angle = 90;
                break;
            case 2:
                angle = 180;
                break;
            case 3:
                angle = 270;
                break;
            }
        }
        return angle;
    }

    private getTextId(elementId: string): number {
        const index: number = elementId.lastIndexOf('_');
        const divId: string = elementId.substring(index + 1, elementId.length);
        return parseInt(divId, 10);
    }

    private normalizeBounds(bound: ClientRect, pageNumber: number): IRectangle {
        let newBounds: IRectangle = null;
        let currentPageElement: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + pageNumber);
        if (this.pdfViewerBase.isMixedSizeDocument) {
            const currentTextElement: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + pageNumber);
            if (currentTextElement) {
                currentPageElement = currentTextElement;
            }
        }
        const currentPageRect: ClientRect = currentPageElement.getBoundingClientRect();
        newBounds = {
            bottom: this.getMagnifiedValue(bound.bottom - currentPageRect.top), height: this.getMagnifiedValue(bound.height),
            left: this.getMagnifiedValue(bound.left - currentPageRect.left), top: this.getMagnifiedValue(bound.top - currentPageRect.top),
            right: this.getMagnifiedValue(bound.right - currentPageRect.left), width: this.getMagnifiedValue(bound.width)
        };
        return newBounds;
    }

    private getMagnifiedValue(value: number): number {
        return value / this.pdfViewerBase.getZoomFactor();
    }

    /**
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {IRectangle} - IRectangle
     */
    public getCurrentSelectionBounds(pageNumber: number): IRectangle {
        let bound: IRectangle = null;
        const ranges: ISelection[] = this.selectionRangeArray;
        for (let i: number = 0; i < ranges.length; i++) {
            if (ranges[parseInt(i.toString(), 10)] !== null) {
                if (pageNumber === ranges[parseInt(i.toString(), 10)].pageNumber) {
                    bound = ranges[parseInt(i.toString(), 10)].bound;
                }
            }
        }
        return bound;
    }

    private createRangeForSelection(start: Node, end: Node, startOffset: number, endOffset: number, range: Range): Range {
        range.setStart(start, startOffset);
        range.setEnd(end, endOffset);
        return range;
    }

    private maintainSelectionArray(): void {
        if (this.selectionRangeArray.length !== 0) {
            const selection: Selection = window.getSelection();
            const isBackward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            let anchorPage: number = isNaN(parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1], 10)) ? parseInt((selection.anchorNode as HTMLElement).id.split('_pageDiv_')[1], 10) : parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1], 10);
            if (isNaN(anchorPage)) {
                anchorPage = parseInt((selection.anchorNode as HTMLElement).id.split('_text_')[1], 10);
            }
            let focusPage: number = isNaN(parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1], 10)) ? parseInt((selection.focusNode as HTMLElement).id.split('_pageDiv_')[1], 10) : parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1], 10);
            if (isNaN(focusPage)) {
                focusPage = isNaN(parseInt((selection.focusNode as HTMLElement).id.split('_text_')[1], 10)) ? parseInt((selection.focusNode as HTMLElement).id.split('_textLayer_')[1], 10) : parseInt((selection.focusNode as HTMLElement).id.split('_text_')[1], 10);
            }
            let arrayObject: ISelection[] = [];
            if (!isBackward) {
                arrayObject = this.selectionRangeArray.filter(
                    (obj: any) => {
                        return (!((this.selectionStartPage <= obj.pageNumber) && (obj.pageNumber < focusPage)));
                    });
            } else {
                arrayObject = this.selectionRangeArray.filter(
                    (obj: any) => {
                        return (!((focusPage < obj.pageNumber) && (obj.pageNumber <= this.selectionStartPage)));
                    });
            }
            if (arrayObject.length > 0) {
                for (let i: number = 0; i < arrayObject.length; i++) {
                    const indexInArray: number = this.selectionRangeArray.indexOf(arrayObject[parseInt(i.toString(), 10)]);
                    if (indexInArray !== -1) {
                        this.selectionRangeArray.splice(indexInArray, 1);
                    }
                }
                if (this.selectionRangeArray.length === 1) {
                    if (this.selectionRangeArray[0].pageNumber === anchorPage || this.selectionRangeArray[0].pageNumber === focusPage) {
                        arrayObject = [];
                    }
                }
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public applySpanForSelection(): void {
        const selection: Selection = window.getSelection();
        if (selection.anchorNode === selection.focusNode && selection.anchorOffset === selection.focusOffset && !selection.isCollapsed) {
            selection.removeAllRanges();
        }
        if (selection.anchorNode !== null &&
            this.pdfViewerBase.viewerContainer.contains(this.getNodeElementFromNode(selection.anchorNode))) {
            const isBackWardSelection: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            let anchorPageId: number; let focusPageId: number; let anchorOffsetDiv: number; let focusOffsetDiv: number;
            let anchorOffset: number; let focusOffset: number;
            if (isBackWardSelection) {
                anchorPageId = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1], 10);
                focusPageId = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1], 10);
                anchorOffsetDiv = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1].split('_')[1], 10);
                focusOffsetDiv = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1].split('_')[1], 10);
                anchorOffset = selection.focusOffset;
                focusOffset = selection.anchorOffset;
            } else {
                let anchorElement: HTMLElement = this.getNodeElementFromNode(selection.anchorNode);
                let focusElement: HTMLElement = this.getNodeElementFromNode(selection.focusNode);
                anchorPageId = (anchorElement.id.indexOf('text_') !== -1) ? parseInt(anchorElement.id.split('text_')[1], 10) : parseInt(anchorElement.id.split('_textLayer_')[1], 10);
                focusPageId = (focusElement.id.indexOf('text_') !== -1) ? parseInt(focusElement.id.split('text_')[1], 10) : parseInt(focusElement.id.split('_textLayer_')[1], 10);
                let isFocusChanged: boolean = false;
                if (this.isTouchSelection) {
                    if ((selection.focusNode as HTMLElement) === this.pdfViewerBase.pageContainer) {
                        const lastChildNode: HTMLElement = this.pdfViewerBase.pageContainer.lastChild as HTMLElement;
                        if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                            const lastPageDiv: HTMLElement = lastChildNode.previousSibling.previousSibling as HTMLElement;
                            focusPageId = parseInt(lastPageDiv.id.split('_pageDiv_')[1], 10);
                            focusElement = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).lastChild as HTMLElement;
                            isFocusChanged = true;
                        } else if (lastChildNode.classList.contains('e-pv-page-div')) {
                            const lastPageDiv: HTMLElement = lastChildNode as HTMLElement;
                            focusPageId = parseInt(lastPageDiv.id.split('_pageDiv_')[1], 10);
                            focusElement = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).lastChild as HTMLElement;
                            isFocusChanged = true;
                        }
                    }
                }
                if (anchorElement.classList.contains('e-pv-maintaincontent')) {
                    anchorElement = this.getNodeElementFromNode(anchorElement);
                    anchorPageId = parseInt(anchorElement.id.split('text_')[1], 10);
                }
                if (focusElement.classList.contains('e-pv-maintaincontent')) {
                    focusElement = this.getNodeElementFromNode(focusElement);
                    focusPageId = parseInt(focusElement.id.split('text_')[1], 10);
                }
                if (anchorPageId === focusPageId) {
                    if (anchorElement.contains(focusElement)) {
                        anchorElement = focusElement;
                    }
                    if (focusElement.contains(anchorElement)) {
                        focusElement = anchorElement;
                    }
                }
                anchorOffsetDiv = (anchorElement.id.split('text_')[1]) ? parseInt(anchorElement.id.split('text_')[1].split('_')[1], 10) : null;
                focusOffsetDiv = (focusElement.id.split('text_')[1]) ? parseInt(focusElement.id.split('text_')[1].split('_')[1], 10) : null;
                anchorOffsetDiv = isNaN(anchorOffsetDiv) ? focusOffsetDiv : anchorOffsetDiv;
                focusOffsetDiv = isNaN(focusOffsetDiv) ? anchorOffsetDiv : focusOffsetDiv;
                anchorOffset = selection.anchorOffset;
                focusOffset = !isFocusChanged ? selection.focusOffset : focusElement.textContent.length;
            }
            if (this.pdfViewerBase.checkIsNormalText()) {
                selection.removeAllRanges();
                this.pdfViewerBase.textLayer.clearDivSelection();
                this.pdfViewerBase.textLayer.applySpanForSelection(anchorPageId, focusPageId, anchorOffsetDiv, focusOffsetDiv,
                                                                   anchorOffset, focusOffset);
            }
            if (this.pdfViewer.textSearchModule) {
                this.pdfViewer.textSearchModule.searchAfterSelection();
            }
        }
    }

    /**
     * @param {TouchEvent} event - It describes about the event
     * @param {number} x - It describes about the X value
     * @param {number} y - It describes about the Y value
     * @private
     * @returns {void}
     */
    public initiateTouchSelection(event: TouchEvent, x: number, y: number): void {
        if (this.pdfViewerBase.isShapeBasedAnnotationsEnabled()) {
            if (this.pdfViewer.selectedItems.annotations.length > 0) {
                this.pdfViewer.clearSelection(this.pdfViewer.selectedItems.annotations[0].pageIndex);
            }
        }
        let element: any = event.target;
        const belowElements: Element[] = document.elementsFromPoint(event.touches[0].clientX, event.touches[0].clientY);
        if (belowElements.length !== 0) {
            if (belowElements[0].classList.contains('e-pv-hyperlink') && belowElements[1].classList.contains('e-pv-text')) {
                element = belowElements[1];
            }
        }
        const pageNumber: number = parseFloat(element.id.split('_')[2]);
        this.pdfViewer.fireTextSelectionStart(pageNumber + 1);
        this.selectAWord(element, x, y, true);
        this.createTouchSelectElement(event);
        this.maintainSelectionOnZoom(true, false);
        this.fireTextSelectEnd();
        this.applySpanForSelection();
    }

    private selectTextByTouch(element: any, x: number, y: number, isForwardSelection: boolean, target: string,
                              isCloserMovement: boolean): boolean {
        let isTextSelected: boolean = false;
        if (element.nodeType === element.TEXT_NODE) {
            let rangeObject: Range = element.ownerDocument.createRange();
            const selection: Selection = window.getSelection();
            rangeObject.selectNodeContents(element);
            let currentPosition: number = 0;
            const endPosition: number = rangeObject.endOffset;
            while (currentPosition < endPosition) {
                rangeObject.setStart(element, currentPosition);
                rangeObject.setEnd(element, currentPosition + 1);
                const rangeBounds: ClientRect = rangeObject.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    if (selection.anchorNode !== null) {
                        if (isForwardSelection) {
                            rangeObject.setStart(selection.anchorNode, selection.anchorOffset);
                        }
                        rangeObject = this.setTouchSelectionStartPosition(selection, rangeObject, isForwardSelection, target,
                                                                          element, currentPosition, isCloserMovement);
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
        } else {
            for (let i: number = 0; i < element.childNodes.length; i++) {
                const range: Range = element.childNodes[parseInt(i.toString(), 10)].ownerDocument.createRange();
                range.selectNodeContents(element.childNodes[parseInt(i.toString(), 10)]);
                const rangeBounds: ClientRect = range.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    range.detach();
                    return (this.selectTextByTouch(element.childNodes[parseInt(i.toString(), 10)], x, y, isForwardSelection,
                                                   target, isCloserMovement));
                } else {
                    range.detach();
                }
            }
        }
        return isTextSelected;
    }

    private setTouchSelectionStartPosition(selection: Selection, range: Range, isForwardSelection: boolean, target: string,
                                           element: any, currentPosition: number, isCloserMovement: boolean): Range {
        if (isForwardSelection) {
            if (target === 'left') {
                const startNode: any = this.getTouchFocusElement(selection, true);
                range.setStart(startNode.focusNode, startNode.focusOffset);
                range.setEnd(element, currentPosition);
                this.selectionAnchorTouch = { anchorNode: range.endContainer.parentElement.id, anchorOffset: range.endOffset };
            } else if (target === 'right') {
                const startNode: any = this.getTouchAnchorElement(selection, false);
                range.setStart(startNode.anchorNode, startNode.anchorOffset);
                range.setEnd(element, currentPosition);
                this.selectionFocusTouch = { focusNode: range.endContainer.parentElement.id, focusOffset: range.endOffset };
            }
        } else {
            if (target === 'left') {
                if (!isCloserMovement) {
                    const startNode: any = this.getTouchFocusElement(selection, false);
                    range.setStart(element, currentPosition);
                    range.setEnd(startNode.focusNode, startNode.focusOffset);
                    if (range.toString() === '') {
                        range.setStart(element, currentPosition);
                        range.setEnd(selection.focusNode, selection.focusOffset);
                    }
                    this.selectionAnchorTouch = { anchorNode: range.startContainer.parentElement.id, anchorOffset: range.startOffset };
                } else {
                    range.setStart(element, currentPosition);
                    range.setEnd(selection.focusNode, selection.focusOffset);
                    this.selectionAnchorTouch = { anchorNode: range.startContainer.parentElement.id, anchorOffset: range.startOffset };
                }
            } else if (target === 'right') {
                const startNode: any = this.getTouchAnchorElement(selection, true);
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

    private getTouchAnchorElement(selection: Selection, isCurrentFocus: boolean): { [key: string]: Object } {
        const element: HTMLElement = document.getElementById(this.selectionAnchorTouch.anchorNode.toString());
        let startNode: Node = null;
        let offset: number = 0;
        if (element) {
            startNode = element.childNodes[0];
            offset = parseInt(this.selectionAnchorTouch.anchorOffset.toString(), 10);
        } else {
            if (isCurrentFocus) {
                startNode = selection.focusNode;
                offset = selection.focusOffset;
            } else {
                startNode = selection.anchorNode;
                offset = selection.anchorOffset;
            }
        }
        return { anchorNode: startNode, anchorOffset: offset };
    }

    private getTouchFocusElement(selection: Selection, isCurrentAnchor: boolean): { [key: string]: Object } {
        const element: HTMLElement = document.getElementById(this.selectionFocusTouch.focusNode.toString());
        let startNode: Node = null;
        let offset: number = 0;
        if (element) {
            startNode = element.childNodes[0];
            offset = parseInt(this.selectionFocusTouch.focusOffset.toString(), 10);
        } else {
            if (isCurrentAnchor) {
                startNode = selection.anchorNode;
                offset = selection.anchorOffset;
            } else {
                startNode = selection.focusNode;
                offset = selection.focusOffset;
            }
        }
        return { focusNode: startNode, focusOffset: offset };
    }

    private createTouchSelectElement(event: TouchEvent): void {
        const topMargin: number = 10;
        const dropTopAboveTwoHundred: number = 8;
        const dropTopAboveHundard: number = 4;
        this.isTouchSelection = true;
        const selection: Selection = window.getSelection();
        if (selection.type === 'Range') {
            this.dropDivElementLeft = createElement('div', { id: this.pdfViewer.element.id + '_touchSelect_droplet_left', className: 'e-pv-touch-select-drop' });
            this.dropDivElementRight = createElement('div', { id: this.pdfViewer.element.id + '_touchSelect_droplet_right', className: 'e-pv-touch-select-drop' });
            this.dropElementLeft = createElement('div', { className: 'e-pv-touch-ellipse' });
            this.dropElementLeft.style.transform = 'rotate(0deg)';
            this.dropDivElementLeft.appendChild(this.dropElementLeft);
            this.dropElementRight = createElement('div', { className: 'e-pv-touch-ellipse' });
            this.dropElementRight.style.transform = 'rotate(-90deg)';
            this.dropElementRight.style.margin = '0 9px 0 0';
            this.dropDivElementRight.appendChild(this.dropElementRight);
            this.pdfViewerBase.pageContainer.appendChild(this.dropDivElementLeft);
            this.pdfViewerBase.pageContainer.appendChild(this.dropDivElementRight);
            const range: Range = selection.getRangeAt(0);
            const rangePosition: ClientRect = range.getBoundingClientRect();
            const dropElementRect: ClientRect = this.dropDivElementLeft.getBoundingClientRect();
            const pageTopValue: number = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
            const viewerLeftPosition: number = this.pdfViewerBase.viewerContainer.getBoundingClientRect().left;
            const topClientValue: number = this.getClientValueTop(rangePosition.top, this.pdfViewerBase.currentPageNumber - 1);
            const dropElementTop: number = this.pdfViewerBase.getZoomFactor() > 2 ?
                dropTopAboveTwoHundred : this.pdfViewerBase.getZoomFactor() > 1 ? dropTopAboveHundard : 0;
            const topPositionValue: string = (topClientValue - dropElementTop) + pageTopValue * this.pdfViewerBase.getZoomFactor() + (dropElementRect.height / 2) * this.pdfViewerBase.getZoomFactor() + 'px';
            this.dropDivElementLeft.style.top = topPositionValue;
            this.dropDivElementLeft.style.left = rangePosition.left - (viewerLeftPosition + (dropElementRect.width)) + this.pdfViewerBase.viewerContainer.scrollLeft + 'px';
            this.dropDivElementRight.style.top = topPositionValue;
            this.dropDivElementRight.style.left = rangePosition.left + rangePosition.width - viewerLeftPosition + this.pdfViewerBase.viewerContainer.scrollLeft + 'px';
            const currentPageLeft: number = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
            const currentRangeLeft: number = rangePosition.left - currentPageLeft;
            this.topStoreLeft = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue),
                pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft),
                isHeightNeeded: true };
            this.topStoreRight = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue),
                pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft +
                    rangePosition.width), isHeightNeeded: true };
            this.dropDivElementLeft.addEventListener('touchstart', this.onLeftTouchSelectElementTouchStart);
            this.dropDivElementLeft.addEventListener('touchmove', this.onLeftTouchSelectElementTouchMove);
            this.dropDivElementLeft.addEventListener('touchend', this.onLeftTouchSelectElementTouchEnd);
            this.dropDivElementRight.addEventListener('touchstart', this.onRightTouchSelectElementTouchStart);
            this.dropDivElementRight.addEventListener('touchmove', this.onRightTouchSelectElementTouchMove);
            this.dropDivElementRight.addEventListener('touchend', this.onRightTouchSelectElementTouchEnd);
            this.calculateContextMenuPosition((event.touches[0].clientY + this.dropDivElementLeft.clientHeight + topMargin),
                                              (parseInt(this.dropDivElementLeft.style.left, 10) - topMargin));
        }
    }

    /**
     * @param {any} top - It describes about the top value
     * @param {any} left - It describes about the left value
     * @private
     * @returns {void}
     */
    public calculateContextMenuPosition(top: any, left: any): void {
        const topMargin: number = 10;
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            const contextTop: number = top - this.contextMenuHeight;
            if (contextTop < this.pdfViewerBase.toolbarHeight) {
                top = top + this.contextMenuHeight;
            } else {
                top = contextTop;
            }
            if ((top + this.contextMenuHeight) > window.innerHeight) {
                top = top - this.contextMenuHeight;
            }
        }
        if (this.pdfViewer.contextMenuSettings.contextMenuAction === 'MouseUp') {
            left = left - 50;
        }
        // eslint-disable-next-line
        const proxy: any = this;
        setTimeout(
            () => {
                const length: number = document.getElementsByClassName('e-pv-maintaincontent').length;
                const selectedContent: any = document.getElementsByClassName('e-pv-maintaincontent')[length - 1] ? document.getElementsByClassName('e-pv-maintaincontent')[length - 1].getBoundingClientRect() : null;
                if (selectedContent) {
                    if ((selectedContent.bottom + proxy.contextMenuHeight + proxy.pdfViewerBase.toolbarHeight) > window.innerHeight) {
                        top = selectedContent.top - (proxy.contextMenuHeight + proxy.pdfViewerBase.toolbarHeight - topMargin);
                    } else {
                        top = proxy.dropDivElementRight ? (selectedContent.bottom + proxy.dropDivElementRight.clientHeight) :
                            selectedContent.bottom;
                    }
                    left =  selectedContent.right;
                    const toolbarModule: any = this.pdfViewer.toolbarModule ? this.pdfViewer.toolbarModule.annotationToolbarModule : 'null';
                    if (!toolbarModule || !toolbarModule.textMarkupToolbarElement ||
                        toolbarModule.textMarkupToolbarElement.children.length === 0) {
                        proxy.pdfViewerBase.contextMenuModule.open(top, left, proxy.pdfViewerBase.viewerContainer);
                    }
                }
            });
    }

    private onLeftTouchSelectElementTouchStart = (event: TouchEvent): void => {
        this.initiateSelectionByTouch();
    };

    private onRightTouchSelectElementTouchStart = (event: TouchEvent): void => {
        this.initiateSelectionByTouch();
    };

    private onLeftTouchSelectElementTouchEnd = (event: TouchEvent): void => {
        this.terminateSelectionByTouch(event);
    };

    private onRightTouchSelectElementTouchEnd = (event: TouchEvent): void => {
        this.terminateSelectionByTouch(event);
    };

    /**
     * @private
     * @returns {void}
     */
    public initiateSelectionByTouch(): void {
        this.pdfViewerBase.textLayer.clearDivSelection();
        this.pdfViewerBase.contextMenuModule.close();
        let lowerPageIndex: number = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageIndex = (lowerPageIndex < 0) ? 0 : lowerPageIndex;
        let higherPageIndex: number = this.pdfViewer.currentPageNumber + 1;
        higherPageIndex = (higherPageIndex < (this.pdfViewerBase.pageCount - 1)) ? higherPageIndex : (this.pdfViewerBase.pageCount - 1);
        for (let i: number = lowerPageIndex; i <= higherPageIndex; i++) {
            const textLayer: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + i);
            if (textLayer) {
                if (textLayer.childNodes !== null) {
                    this.applySelectionMouseScroll(i);
                }
            }
        }
        if (this.selectionRangeArray.length > 0) {
            this.pdfViewer.fireTextSelectionStart(this.selectionRangeArray[0].pageNumber + 1);
        }
    }

    private terminateSelectionByTouch(event: any): void {
        const topMargin: number = 10;
        this.maintainSelectionOnZoom(true, false);
        this.applySpanForSelection();
        if (this.pdfViewerBase.getTextMarkupAnnotationMode()) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                drawTextMarkupAnnotations(this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
        } else {
            this.fireTextSelectEnd();
            let top: any = event.changedTouches[0].clientY;
            const spanBounds: any = this.getSpanBounds();
            if (spanBounds) {
                if ((spanBounds.bottom + this.contextMenuHeight + this.pdfViewerBase.toolbarHeight) > window.innerHeight) {
                    top = spanBounds.top - (this.contextMenuHeight + this.pdfViewerBase.toolbarHeight);
                }
                this.pdfViewerBase.contextMenuModule.open(top, event.changedTouches[0].clientX,
                                                          this.pdfViewerBase.viewerContainer);
            }
        }
    }

    private getSpanBounds(): any {
        const spanWidth: Array<number> = [];
        const spanRight: Array<number> = [];
        const spanLeft: Array<number> = [];
        let spanHeight: number = 0;
        const selectedContent: HTMLCollectionOf<Element> = document.getElementsByClassName('e-pv-maintaincontent');
        if (selectedContent.length > 0) {
            for (let i: number = 0; i < selectedContent.length; i++) {
                const spanElement: any = selectedContent[parseInt(i.toString(), 10)].getBoundingClientRect();
                spanHeight = spanHeight + spanElement.height;
                spanWidth.push(spanElement.width);
                spanRight.push(spanElement.right);
                spanLeft.push(spanElement.left);
            }
            return {top: selectedContent[0].getBoundingClientRect().top,
                bottom: selectedContent[selectedContent.length - 1].getBoundingClientRect().bottom,
                left: Math.min.apply(null, spanLeft) , right: Math.max.apply(null, spanRight),
                width: Math.max.apply(null, spanWidth), height: spanHeight} ;
        }
    }

    private onLeftTouchSelectElementTouchMove = (event: TouchEvent): void => {
        let range: Range;
        let nodeElement: Node;
        const zoomFactorabovehundard: number = 15;
        const zoomFactorAboveSeventy: number = 10;
        const zoomFactoraboveFifty: number = 8;
        const zoomFactorbelowFifty: number = 4;
        event.preventDefault();
        (event.target as HTMLElement).style.zIndex = '0';
        const rightElement: HTMLElement = this.dropDivElementRight;
        const isTouchedWithinViewerContainer: boolean = this.isTouchedWithinContainer(event);
        if (rightElement && isTouchedWithinViewerContainer) {
            const dropBounds: ClientRect = rightElement.getBoundingClientRect();
            const xTouch: number = event.changedTouches[0].clientX;
            const yTouch: number = event.changedTouches[0].clientY;
            (event.target as HTMLElement).style.zIndex = '1000';
            nodeElement = this.getNodeElement(range, xTouch, yTouch, event, nodeElement);
            if (nodeElement) {
                const currentDifference: number = Math.sqrt((yTouch - dropBounds.top) * (yTouch - dropBounds.top) +
                (xTouch - dropBounds.left) * (xTouch - dropBounds.left));
                const isCloserMovement: boolean = this.isCloserTouchScroll(currentDifference);
                let isTextSelected: boolean = false;
                const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
                const topDifference: number = Math.abs(yTouch - dropBounds.top);
                const textHeight: number = zoomFactor > 1 ? zoomFactorabovehundard : zoomFactor > 0.7 ?
                    zoomFactorAboveSeventy : zoomFactor > 0.5 ? zoomFactoraboveFifty : zoomFactorbelowFifty;
                if (parseInt(yTouch.toString(), 10) <= parseInt(dropBounds.top.toString(), 10) &&
                (parseInt(topDifference.toString(), 10) >= textHeight) ||
                parseInt(xTouch.toString(), 10) <= parseInt(dropBounds.left.toString(), 10) &&
                (parseInt(topDifference.toString(), 10) <= textHeight)) {
                    this.dropElementLeft.style.transform = 'rotate(0deg)';
                    this.dropElementRight.style.transform = 'rotate(-90deg)';
                    isTextSelected = this.selectTextByTouch(nodeElement.parentElement, xTouch, yTouch, false, 'left', isCloserMovement);
                } else {
                    this.dropElementLeft.style.transform = 'rotate(-90deg)';
                    this.dropElementRight.style.transform = 'rotate(0deg)';
                    isTextSelected = this.selectTextByTouch(nodeElement.parentElement, xTouch, yTouch, true, 'left', isCloserMovement);
                }
                if (isTextSelected) {
                    const elementClientRect: ClientRect = this.dropDivElementLeft.getBoundingClientRect();
                    const pageTopValue: number = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
                    const topClientValue: number = this.getClientValueTop(yTouch, this.pdfViewerBase.currentPageNumber - 1);
                    const currentPageLeft: number = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
                    const currentRangeLeft: number = xTouch - currentPageLeft;
                    this.dropDivElementLeft.style.top = pageTopValue * this.pdfViewerBase.getZoomFactor() + topClientValue + 'px';
                    this.topStoreLeft = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue),
                        pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft),
                        isHeightNeeded: false };
                    this.dropDivElementLeft.style.left = xTouch - this.pdfViewerBase.viewerContainer.getBoundingClientRect().left - (elementClientRect.width / 2) + this.pdfViewerBase.viewerContainer.scrollLeft + 'px';
                    this.previousScrollDifference = currentDifference;
                }
            }
        }
    };

    private onRightTouchSelectElementTouchMove = (event: TouchEvent): void => {
        let range: Range;
        let nodeElement: Node;
        const zoomFactorabovehundard: number = 25;
        const zoomFactorAboveSeventy: number = 15;
        const zoomFactoraboveFifty: number = 8;
        const zoomFactorbelowFifty: number = 7;
        event.preventDefault();
        (event.target as HTMLElement).style.zIndex = '0';
        const leftElement: HTMLElement = this.dropDivElementLeft;
        const isTouchedWithinViewerContainer: boolean = this.isTouchedWithinContainer(event);
        if (leftElement && isTouchedWithinViewerContainer) {
            const dropPosition: ClientRect = leftElement.getBoundingClientRect();
            const touchX: number = event.changedTouches[0].clientX;
            const touchY: number = event.changedTouches[0].clientY;
            (event.target as HTMLElement).style.zIndex = '1000';
            nodeElement = this.getNodeElement(range, touchX, touchY, event, nodeElement);
            if (nodeElement) {
                const currentDifference: number = Math.sqrt((touchY - dropPosition.top) * (touchY - dropPosition.top) +
                (touchX - dropPosition.left) * (touchX - dropPosition.left));
                const isCloserMovement: boolean = this.isCloserTouchScroll(currentDifference);
                let isTextSelected: boolean = false;
                const zoomFactor: number = this.pdfViewerBase.getZoomFactor();
                const topDifference: number = Math.abs(touchY - dropPosition.top);
                const textHeight: number = zoomFactor > 1 ? (zoomFactor * zoomFactorabovehundard) :
                    (zoomFactor > 0.7 ?  zoomFactorAboveSeventy : (zoomFactor > 0.5 ? zoomFactoraboveFifty : zoomFactorbelowFifty));
                if ((parseInt(touchY.toString(), 10) >= parseInt(dropPosition.top.toString(), 10) &&
                parseInt(topDifference.toString(), 10) >=  textHeight) || (parseInt(topDifference.toString(), 10) <=  textHeight &&
                parseInt(touchX.toString(), 10) >= parseInt(dropPosition.left.toString(), 10))) {
                    this.dropElementRight.style.transform = 'rotate(-90deg)';
                    this.dropElementLeft.style.transform = 'rotate(0deg)';
                    isTextSelected = this.selectTextByTouch(nodeElement.parentElement, touchX, touchY, true, 'right', isCloserMovement);
                } else {
                    this.dropElementRight.style.transform = 'rotate(0deg)';
                    this.dropElementLeft.style.transform = 'rotate(-90deg)';
                    isTextSelected = this.selectTextByTouch(nodeElement.parentElement, touchX, touchY, false, 'right', isCloserMovement);
                }
                if (isTextSelected) {
                    const pageTopValue: number = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
                    const topClientValue: number = this.getClientValueTop(touchY, this.pdfViewerBase.currentPageNumber - 1);
                    const elementClientRect: ClientRect = this.dropDivElementRight.getBoundingClientRect();
                    this.dropDivElementRight.style.top = pageTopValue * this.pdfViewerBase.getZoomFactor() + topClientValue + 'px';
                    const currentPageLeft: number = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
                    const currentRangeLeft: number = touchX - currentPageLeft;
                    this.topStoreRight = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue),
                        pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft),
                        isHeightNeeded: false };
                    this.dropDivElementRight.style.left = touchX - this.pdfViewerBase.viewerContainer.getBoundingClientRect().left - (elementClientRect.width / 2) + this.pdfViewerBase.viewerContainer.scrollLeft + 'px';
                    this.previousScrollDifference = currentDifference;
                }
            }
        }
    };

    private getNodeElement(range: Range, touchX: number, touchY: number, event: TouchEvent, nodeElement: Node): Node {
        if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(touchX, touchY);
            nodeElement = this.onTouchElementScroll(range, nodeElement, touchY, event);
        } else if ((document as any).caretPositionFromPoint) {
            const start: any = (document as any).caretPositionFromPoint(touchX, touchY);
            const end: any = (document as any).caretPositionFromPoint(touchX, touchY);
            range = document.createRange();
            range.setStart(start.offsetNode, start.offset);
            range.setEnd(end.offsetNode, end.offset);
            nodeElement = this.onTouchElementScroll(range, nodeElement, touchY, event);
        }
        return nodeElement;
    }

    private isTouchedWithinContainer(event: TouchEvent): boolean {
        const elements: Element[] = document.elementsFromPoint(event.touches[0].clientX, event.touches[0].clientY);
        let isTouchedWithinContainer: boolean = false;
        if (elements.length !== 0) {
            isTouchedWithinContainer = true;
        }
        return isTouchedWithinContainer;
    }

    private onTouchElementScroll(range: Range, nodeElement: Node, touchY: number, event: TouchEvent): Node {
        const viewerScrollTop: number = this.pdfViewerBase.viewerContainer.scrollTop;
        if (range != null) {
            nodeElement = range.startContainer;
            const isScrollBar: boolean = this.isScrolledOnScrollBar(event);
            if (!this.pdfViewerBase.viewerContainer.contains(nodeElement.parentElement) || isScrollBar) {
                if (touchY < this.pdfViewerBase.viewerContainer.clientHeight) {
                    this.pdfViewerBase.viewerContainer.scrollTop = viewerScrollTop - 30;
                } else {
                    this.pdfViewerBase.viewerContainer.scrollTop = viewerScrollTop + 30;
                }
            }
        } else {
            if (touchY < this.pdfViewerBase.viewerContainer.clientHeight) {
                this.pdfViewerBase.viewerContainer.scrollTop = viewerScrollTop - 30;
            } else {
                this.pdfViewerBase.viewerContainer.scrollTop = viewerScrollTop + 30;
            }
        }
        return nodeElement;
    }

    private isCloserTouchScroll(currentDifference: number): boolean {
        let isForwardMovement: boolean = false;
        if (this.previousScrollDifference > currentDifference) {
            isForwardMovement = true;
        }
        return isForwardMovement;
    }

    private getClientValueTop(clientValue: number, pageNumber: number): number {
        if (this.pdfViewerBase.getElement('_pageDiv_' + pageNumber)) {
            return clientValue - this.pdfViewerBase.getElement('_pageDiv_' + pageNumber).getBoundingClientRect().top;
        } else {
            return clientValue;
        }
    }

    private isScrolledOnScrollBar(event: TouchEvent): boolean {
        let isScrollBar: boolean = false;
        if (event.touches && (this.pdfViewerBase.viewerContainer.clientHeight + this.pdfViewerBase.viewerContainer.offsetTop) <
        event.touches[0].clientY && event.touches[0].clientY < (this.pdfViewerBase.viewerContainer.offsetHeight +
            this.pdfViewerBase.viewerContainer.offsetTop)) {
            isScrollBar = true;
        }
        return isScrollBar;
    }

    private getTextLastLength(element: HTMLElement): number {
        if (element) {
            return element.textContent.length;
        } else {
            return 0;
        }
    }

    private getNodeElementFromNode(node: Node): HTMLElement {
        if (node.parentElement) {
            return node.parentElement;
        } else {
            return (node.parentNode as HTMLElement);
        }
    }

    /**
     * Copy the selected text in the PDF Document.
     *
     * @returns {void}
     */
    public copyText(): void {
        let selectionText: string = '';
        this.maintainSelectionOnZoom(true, false);
        if (this.selectionRangeArray.length > 0) {
            for (let i: number = 0; i < this.selectionRangeArray.length; i++) {
                selectionText += this.selectionRangeArray[parseInt(i.toString(), 10)].textContent;
            }
        }
        if (selectionText.length > 0) {
            if (this.pdfViewer.annotation) {
                this.pdfViewer.annotation.isShapeCopied = false;
            }
            const textArea: HTMLElement = document.createElement('textarea');
            textArea.contentEditable = 'true';
            textArea.textContent = selectionText;
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.freeTextAnnotationModule) {
                this.pdfViewer.annotation.freeTextAnnotationModule.selectedText = selectionText;
            }
            textArea.style.position = 'fixed';
            document.body.appendChild(textArea);
            (textArea as HTMLInputElement).select();
            try {
                document.execCommand('copy');
            } catch (ex) {
                console.warn('Copy to clipboard failed.', ex);
            } finally {
                if (textArea) {
                    document.body.removeChild(textArea);
                }
            }
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
        return 'TextSelection';
    }
}
