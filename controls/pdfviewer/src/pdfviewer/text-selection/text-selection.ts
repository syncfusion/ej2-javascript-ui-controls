/* eslint-disable */
import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfViewer, PdfViewerBase } from '../index';

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
    /**
     * @private
     */
    public selectionRangeArray: ISelection[] = [];
    private selectionAnchorTouch: { [key: string]: Object } = null;
    private selectionFocusTouch: { [key: string]: Object } = null;
    // eslint-disable-next-line
    private scrollMoveTimer: any = 0;
    private isMouseLeaveSelection: boolean = false;
    private isTouchSelection: boolean = false;
    private previousScrollDifference: number = 0;
    private topStoreLeft: { [key: string]: Object } = null;
    private topStoreRight: { [key: string]: Object } = null;
    private isTextSearched: boolean = false;
    private isSelectionStartTriggered: boolean = false;
    /**
     * @param pdfViewer
     * @param pdfViewerBase
     * @param pdfViewer
     * @param pdfViewerBase
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * @param target
     * @param x
     * @param y
     * @param isExtended
     * @private
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
                    // eslint-disable-next-line
                    rightBounds = parseInt(rangeBounds.right.toString());
                }
                // eslint-disable-next-line max-len
                // eslint-disable-next-line
                if (rangeBounds.left <= x && rightBounds >= x && parseInt(rangeBounds.top.toString()) <= y && rangeBounds.bottom >= y) {
                    if (selection.anchorNode !== null && (selection.anchorNode.parentNode as HTMLElement).classList.contains('e-pv-text')) {
                        range.setStart(selection.anchorNode, selection.anchorOffset);
                    }
                    selection.removeAllRanges();
                    selection.addRange(range);
                    if (!this.isTextSelection) {
                        this.selectionStartPage = this.pdfViewerBase.currentPageNumber - 1;
                    }
                    this.isTextSelection = true;
                    // eslint-disable-next-line
                    let isIE: boolean = !!(document as any).documentMode;
                    if (!isIE) {
                        if (this.isBackwardPropagatedSelection) {
                            selection.extend(targetElement, currentPosition);
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
            // eslint-disable-next-line
            let annotationModule: any = this.pdfViewer.annotationModule;
            // eslint-disable-next-line max-len
            if (annotationModule && annotationModule.textMarkupAnnotationModule && annotationModule.textMarkupAnnotationModule.isEnableTextMarkupResizer(annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode)) {
                // eslint-disable-next-line
                let leftDivElement: any = document.getElementById(this.pdfViewer.element.id + '_droplet_left');
                if (this.pdfViewerBase.isSelection && selection && selection.rangeCount > 0) {
                    // eslint-disable-next-line
                    let currentrange: any = selection.getRangeAt(0);
                    // eslint-disable-next-line
                    let rect: any = currentrange.getBoundingClientRect();
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
                if (targetElement.childNodes[i].nodeType === targetElement.TEXT_NODE) {
                    const range: Range = this.getSelectionRange(i, targetElement);
                    const rangeBounds: ClientRect = range.getBoundingClientRect();
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line
                    if (rangeBounds.left <= x && rangeBounds.right >= parseInt(x.toString()) && parseInt(rangeBounds.top.toString()) <= y && rangeBounds.bottom >= y) {
                        range.detach();
                        this.textSelectionOnMouseMove(targetElement.childNodes[i], x, y, isExtended);
                    } else {
                        range.detach();
                    }
                }
            }
        }
    }
    /**
     * @param target
     * @param x
     * @param y
     * @param isforward
     * @param target
     * @param x
     * @param y
     * @param isforward
     * @param target
     * @param x
     * @param y
     * @param isforward
     * @private
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
                // eslint-disable-next-line max-len
                // eslint-disable-next-line
                if (rangeBounds.left <= x && rangeBounds.right >= x && parseInt(rangeBounds.top.toString()) <= y && rangeBounds.bottom >= y) {
                    if (isforward) {
                        // eslint-disable-next-line max-len
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
                // eslint-disable-next-line
                let currentrange: any = selection.getRangeAt(0);
                // eslint-disable-next-line
                let rect: any = currentrange.getBoundingClientRect();
                const left: number = rect.left;
                const top: number = rect.top;
                this.pdfViewer.annotation.textMarkupAnnotationModule.updateLeftposition(left, top);
                this.pdfViewerBase.isSelection = false;
            }
            this.pdfViewer.annotation.textMarkupAnnotationModule.updatePosition(x, y);
        } else {
            for (let i: number = 0; i < targetElement.childNodes.length; i++) {
                if (targetElement.childNodes[i].nodeType === targetElement.TEXT_NODE) {
                    const range: Range = this.getSelectionRange(i, targetElement);
                    const rangeBounds: ClientRect = range.getBoundingClientRect();
                    // eslint-disable-next-line max-len
                    // eslint-disable-next-line
                    if (rangeBounds.left <= x && rangeBounds.right >= x && parseInt(rangeBounds.top.toString()) <= y && rangeBounds.bottom >= y) {
                        range.detach();
                        this.textSelectionOnDrag(targetElement.childNodes[i], x, y, isforward);
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
     * @returns void
     */
    public selectTextRegion(pageNumbers: number, bounds: IRectangle[]): void {
        // eslint-disable-next-line
        let element: any = null;
        const pageNumber: number = (pageNumbers - 1);
        for (let k: number = 0; k < bounds.length; k++) {
            // eslint-disable-next-line
            let bound: any = bounds[k];
            const x: number = (bound.left ? bound.left : bound.Left) * this.pdfViewerBase.getZoomFactor();
            const y: number = (bound.top ? bound.top : bound.Top) * this.pdfViewerBase.getZoomFactor();
            const width: number = (bound.width ? bound.width : bound.Width) * this.pdfViewerBase.getZoomFactor();
            const height: number = bound.height ? bound.height : bound.Height;
            // eslint-disable-next-line
            let textLayer: any = this.pdfViewerBase.getElement('_textLayer_' + pageNumber);
            if (textLayer) {
                // eslint-disable-next-line
                let textDivs: any = textLayer.childNodes;
                for (let n: number = 0; n < textDivs.length; n++) {
                    if (textDivs[n]) {
                        // eslint-disable-next-line
                        let rangebounds: any = textDivs[n].getBoundingClientRect();
                        const top: number = this.getClientValueTop(rangebounds.top, pageNumber);
                        // eslint-disable-next-line max-len
                        const currentLeft: number = rangebounds.left - this.pdfViewerBase.getElement('_pageDiv_' + pageNumber).getBoundingClientRect().left;
                        const totalLeft: number = currentLeft + rangebounds.width;
                        // eslint-disable-next-line
                        let textDiVLeft: number = parseInt(textDivs[n].style.left);
                        // eslint-disable-next-line
                        let currentTop: number = parseInt(textDivs[n].style.top);
                        const isLeftBounds: boolean = this.checkLeftBounds(currentLeft, textDiVLeft, totalLeft, x);
                        const isTopBounds: boolean = this.checkTopBounds(top, currentTop, y);
                        if (isLeftBounds && isTopBounds) {
                            element = textDivs[n];
                            break;
                        }
                    }
                }
                if (element != null) {
                    // eslint-disable-next-line
                    let boundingRect: any = this.pdfViewerBase.getElement('_textLayer_' + pageNumber).getBoundingClientRect();
                    this.textSelectionOnMouseMove(element, x + boundingRect.left, y + boundingRect.top, false);
                    if ((bounds.length - 1) === k) {
                        // eslint-disable-next-line max-len
                        this.textSelectionOnMouseMove(element, x + boundingRect.left + width, y + boundingRect.top, false);
                    }
                }
            }
        }
    }
    /**
     * @param left
     * @param textDiVLeft
     * @param totalLeft
     * @param x
     * @private
     */
    public checkLeftBounds(left: number, textDiVLeft: number, totalLeft: number, x: number): boolean {
        let isExists: boolean = false;
        // eslint-disable-next-line max-len
        // eslint-disable-next-line
        if (left === parseInt(x.toString()) || parseInt(left.toString()) === parseInt(x.toString()) || (left + 1) === parseInt(x.toString()) || (left - 1) === parseInt(x.toString())
            // eslint-disable-next-line
            || textDiVLeft === parseInt(x.toString()) || textDiVLeft === x || (totalLeft >= x && left <= x)) {
            isExists = true;
        }
        return isExists;
    }
    /**
     * @param top
     * @param currentTop
     * @param y
     * @param top
     * @param currentTop
     * @param y
     * @private
     */
    public checkTopBounds(top: number, currentTop: number, y: number): boolean {
        let isExists: boolean = false;
        // eslint-disable-next-line max-len
        // eslint-disable-next-line
        if ((top === parseInt(y.toString()) || parseInt(top.toString()) === parseInt(y.toString()) || parseInt((top + 1).toString()) === parseInt(y.toString()) || parseInt((top - 1).toString()) === parseInt(y.toString())
            // eslint-disable-next-line
            || currentTop === parseInt(y.toString()) || currentTop === y)) {
            isExists = true;
        }
        return isExists;
    }

    /**
     * @param event
     * @private
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
        this.isMouseLeaveSelection = true;
        this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.viewerContainer.scrollTop + 200;
        this.stichSelectionOnScroll(this.pdfViewerBase.currentPageNumber - 1);
    }

    private scrollBackwardOnSelection(): void {
        this.isMouseLeaveSelection = true;
        this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.viewerContainer.scrollTop - 200;
        this.stichSelectionOnScroll(this.pdfViewerBase.currentPageNumber - 1);
    }

    /**
     * @private
     */
    public clear(): void {
        if (this.scrollMoveTimer) {
            this.isMouseLeaveSelection = false;
            clearInterval(this.scrollMoveTimer);
        }
    }

    /**
     * @param element
     * @param x
     * @param y
     * @param isStoreSelection
     * @param element
     * @param x
     * @param y
     * @param isStoreSelection
     * @param element
     * @param x
     * @param y
     * @param isStoreSelection
     * @private
     */
    // eslint-disable-next-line
    public selectAWord(element: any, x: number, y: number, isStoreSelection: boolean): void {
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
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    const textContent: string = element.textContent;
                    const indices: number[] = [];
                    let startPosition: number;
                    let endPos: number;
                    for (let i: number = 0; i < textContent.length; i++) {
                        if (textContent[i] === ' ') {
                            indices.push(i);
                        }
                    }
                    for (let j: number = 0; j < indices.length; j++) {
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
                        } else if (currentPosition > indices[j]) {
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
                    } else {
                        range.setStart(element, startPosition + 1);
                    }
                    range.setEnd(element, endPos);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    this.isTextSelection = true;
                    // eslint-disable-next-line max-len
                    const startParent: HTMLElement = isNullOrUndefined(range.startContainer.parentElement) ? (range.startContainer.parentNode as HTMLElement) : range.startContainer.parentElement;
                    // eslint-disable-next-line radix
                    this.selectionStartPage = parseInt(startParent.id.split('_text_')[1]);
                    if (isStoreSelection) {
                        // eslint-disable-next-line max-len
                        this.selectionAnchorTouch = { anchorNode: selection.anchorNode.parentElement.id, anchorOffset: selection.anchorOffset };
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
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    range.detach();
                    this.selectAWord(element.childNodes[i], x, y, isStoreSelection);
                } else {
                    range.detach();
                }
            }
        }
    }

    private getSelectionRange(index: number, element: HTMLElement): Range {
        const range: Range = element.childNodes[index].ownerDocument.createRange();
        range.selectNodeContents(element.childNodes[index]);
        return range;
    }

    /**
     * @param event
     * @private
     */
    public selectEntireLine(event: MouseEvent): void {
        const textIds: string[] = [];
        const targetElement: HTMLElement = event.target as HTMLElement;
        const targetRect: ClientRect = targetElement.getBoundingClientRect();
        // eslint-disable-next-line
        let targetcentre: number = parseInt((targetRect.top + (targetRect.height / 2)).toString());
        // eslint-disable-next-line radix
        const pageNumber: number = parseInt((event.target as HTMLElement).id.split('_text_')[1]);
        const textDivs: NodeList = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_text_' + pageNumber + '"]');
        if (targetElement.classList.contains('e-pv-text')) {
            this.pdfViewer.fireTextSelectionStart(pageNumber + 1);
            for (let i: number = 0; i < textDivs.length; i++) {
                const rect: ClientRect = (textDivs[i] as HTMLElement).getBoundingClientRect();
                // eslint-disable-next-line radix
                const topValue: number = parseInt(rect.top.toString());
                // eslint-disable-next-line radix
                const bottomValue: number = parseInt(rect.bottom.toString());
                if ((topValue <= targetcentre && bottomValue > targetcentre) && (targetRect.bottom + 10 > bottomValue)) {
                    const textId: string = (textDivs[i] as HTMLElement).id;
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
            const d2: HTMLElement = document.getElementById(textIds[lengths]);
            const childNodes: number = d2.childNodes.length;
            if (childNodes > 0) {
                range.setStart(d1.childNodes[0], 0);
                range.setEnd(d2.childNodes[0], d2.textContent.length);
            } else {
                range.setStart(d1.childNodes[0], 0);
                range.setEnd(d2, 1);
            }
            // eslint-disable-next-line radix
            this.selectionStartPage = parseInt(range.startContainer.parentElement.id.split('_text_')[1]);
            selection.addRange(range);
            this.isTextSelection = true;
            if (selection != null && this.pdfViewer.contextMenuSettings.contextMenuAction === 'MouseUp') {
                this.calculateContextMenuPosition(event.clientY, event.clientY);
            }
        }
    }

    /**
     * @private
     */
    public enableTextSelectionMode(): void {
        this.pdfViewerBase.isTextSelectionDisabled = false;
        this.pdfViewerBase.viewerContainer.classList.remove('e-disable-text-selection');
        this.pdfViewerBase.viewerContainer.classList.add('e-enable-text-selection');
        this.pdfViewerBase.viewerContainer.addEventListener('selectstart', () => {
            return true;
        });
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
                // eslint-disable-next-line max-len
                higherPageIndex = (higherPageIndex < (this.pdfViewerBase.pageCount - 1)) ? higherPageIndex : (this.pdfViewerBase.pageCount - 1);
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
     */
    public resizeTouchElements(): void {
        const viewerContainerLeft: number = this.pdfViewerBase.viewerContainer.getBoundingClientRect().left;
        if (this.dropDivElementLeft) {
            const elementClientRect: ClientRect = this.dropDivElementLeft.getBoundingClientRect();
            let dropElementHeight: number = 0;
            // eslint-disable-next-line max-len
            const leftCurrentPagePosition: ClientRect = this.pdfViewerBase.getElement('_pageDiv_' + this.topStoreLeft.pageNumber).getBoundingClientRect();
            this.dropDivElementLeft.style.left = parseFloat(this.topStoreLeft.left.toString()) * this.pdfViewerBase.getZoomFactor() + leftCurrentPagePosition.left - viewerContainerLeft - (elementClientRect.width / 2) + 'px';
            if (this.topStoreLeft.isHeightNeeded) {
                dropElementHeight = (elementClientRect.height / 2) * this.pdfViewerBase.getZoomFactor();
            }
            // eslint-disable-next-line max-len
            this.dropDivElementLeft.style.top = parseFloat(this.topStoreLeft.pageTop.toString()) * this.pdfViewerBase.getZoomFactor() + parseFloat(this.topStoreLeft.topClientValue.toString()) * this.pdfViewerBase.getZoomFactor() + dropElementHeight + 'px';
        }
        if (this.dropDivElementRight) {
            const elementClientRect: ClientRect = this.dropDivElementRight.getBoundingClientRect();
            let dropElementHeight: number = 0;
            // eslint-disable-next-line max-len
            const rightCurrentPagePosition: ClientRect = this.pdfViewerBase.getElement('_pageDiv_' + this.topStoreRight.pageNumber).getBoundingClientRect();
            this.dropDivElementRight.style.left = parseFloat(this.topStoreRight.left.toString()) * this.pdfViewerBase.getZoomFactor() + rightCurrentPagePosition.left - viewerContainerLeft - (elementClientRect.width / 2) + 'px';
            if (this.topStoreRight.isHeightNeeded) {
                dropElementHeight = (elementClientRect.height / 2) * this.pdfViewerBase.getZoomFactor();
            }
            // eslint-disable-next-line max-len
            this.dropDivElementRight.style.top = parseFloat(this.topStoreRight.pageTop.toString()) * this.pdfViewerBase.getZoomFactor() + parseFloat(this.topStoreRight.topClientValue.toString()) * this.pdfViewerBase.getZoomFactor() + dropElementHeight + 'px';
        }
    }

    /**
     * @param event
     * @private
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
                // eslint-disable-next-line
                let indexes: any = this.pdfViewer.textSearchModule.getIndexes();
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
     */
    public fireTextSelectEnd(): void {
        if (this.selectionRangeArray.length !== 0) {
            let selectEndPageIndex: number = 0;
            let selectedText: string = '';
            // eslint-disable-next-line
            let selectedBounds: any[] = [];
            for (let k: number = 0; k < this.selectionRangeArray.length; k++) {
                selectedText += this.selectionRangeArray[k].textContent;
                for (let j: number = 0; j < this.selectionRangeArray[k].rectangleBounds.length; j++) {
                    const currentBound: IRectangle = this.selectionRangeArray[k].rectangleBounds[j];
                    // eslint-disable-next-line max-len
                    selectedBounds.push({ left: currentBound.left, right: currentBound.right, top: currentBound.top, bottom: currentBound.bottom, width: currentBound.width, height: currentBound.height, pageIndex: this.selectionRangeArray[k].pageNumber + 1 });
                }
                if (this.selectionRangeArray[k].isBackward && k === 0) {
                    selectEndPageIndex = this.selectionRangeArray[k].pageNumber + 1;
                } else if (!this.selectionRangeArray[k].isBackward && k === this.selectionRangeArray.length - 1) {
                    selectEndPageIndex = this.selectionRangeArray[k].pageNumber + 1;
                }
            }
            this.pdfViewer.fireTextSelectionEnd(selectEndPageIndex, selectedText, selectedBounds);
        }
    }

    /**
     * @param isMaintainSelection
     * @param isStich
     * @param isMaintainSelection
     * @param isStich
     * @private
     */
    public maintainSelectionOnZoom(isMaintainSelection: boolean, isStich: boolean): void {
        const selection: Selection = window.getSelection();
        if (selection.type === 'Range' || (!selection.type && !selection.isCollapsed)) {
            const isBackward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            if (selection.anchorNode !== null) {
                // eslint-disable-next-line radix
                const anchorPageId: number = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
                // eslint-disable-next-line radix
                let focusPageId: number = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
                if (this.isTouchSelection && isNaN(focusPageId)) {
                    const focusElement: HTMLElement = selection.focusNode as HTMLElement;
                    if (focusElement === this.pdfViewerBase.pageContainer) {
                        const lastChildNode: HTMLElement = this.pdfViewerBase.pageContainer.lastChild as HTMLElement;
                        if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                            // eslint-disable-next-line radix
                            focusPageId = parseInt((lastChildNode.previousSibling.previousSibling as HTMLElement).id.split('_pageDiv_')[1]);
                        } else if (lastChildNode.classList.contains('e-pv-page-div')) {
                            // eslint-disable-next-line radix
                            focusPageId = parseInt((lastChildNode as HTMLElement).id.split('_pageDiv_')[1]);
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
     * @param pageNumber
     * @private
     */
    public isSelectionAvailableOnScroll(pageNumber: number): boolean {
        let isSelectionAvailable: boolean = false;
        const ranges: ISelection[] = this.selectionRangeArray;
        for (let i: number = 0; i < ranges.length; i++) {
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
     * @param pageNumber
     * @private
     */
    public applySelectionRangeOnScroll(pageNumber: number): void {
        if (this.isMouseLeaveSelection) {
            this.applySelectionMouseScroll(pageNumber);
        } else {
            this.applySelectionRange(pageNumber);
        }
    }

    // eslint-disable-next-line
    private getSelectionRangeFromArray(pageNumber: number): any {
        let isSelectionAvailable: boolean = false;
        let selectionRange: ISelection = null;
        const ranges: ISelection[] = this.selectionRangeArray;
        for (let i: number = 0; i < ranges.length; i++) {
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

    private applySelectionRange(pageNumber: number): void {
        const selectionObject: { isSelectionAvailable: boolean; selectionRange: ISelection } = this.getSelectionRangeFromArray(pageNumber);
        const isSelectionAvailable: boolean = selectionObject.isSelectionAvailable;
        const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        if (textLayer) {
            if (isSelectionAvailable && textLayer.childNodes.length !== 0) {
                const selectionRange: ISelection = selectionObject.selectionRange;
                let anchorOffsetDiv: number; let focusOffsetDiv: number; let anchorOffset: number; let focusOffset: number;
                if (selectionRange.isBackward) {
                    // eslint-disable-next-line radix
                    const startId: number = parseInt(selectionRange.endNode.split('_text_')[1].split('_')[1]);
                    // eslint-disable-next-line radix
                    const endId: number = parseInt(selectionRange.startNode.split('_text_')[1].split('_')[1]);
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
                    // eslint-disable-next-line radix
                    anchorOffsetDiv = parseInt(selectionRange.startNode.split('text_')[1].split('_')[1]);
                    // eslint-disable-next-line radix
                    focusOffsetDiv = parseInt(selectionRange.endNode.split('text_')[1].split('_')[1]);
                    anchorOffset = selectionRange.startOffset;
                    focusOffset = selectionRange.endOffset;
                }
                window.getSelection().removeAllRanges();
                // eslint-disable-next-line max-len
                this.pdfViewerBase.textLayer.applySpanForSelection(pageNumber, pageNumber, anchorOffsetDiv, focusOffsetDiv, anchorOffset, focusOffset);
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
                // eslint-disable-next-line
                let anchorPageIndex: number = isNaN(parseInt(selection.anchorNode.parentElement.id.split('_text_')[1])) ? parseInt((selection.anchorNode as HTMLElement).id.split('_pageDiv_')[1]) : parseInt(selection.anchorNode.parentElement.id.split('_text_')[1]);
                if (isNaN(anchorPageIndex)) {
                    // eslint-disable-next-line radix
                    anchorPageIndex = parseInt((selection.anchorNode as HTMLElement).id.split('_text_')[1]);
                }
                // eslint-disable-next-line
                let focusPageIndex: number = isNaN(parseInt(selection.focusNode.parentElement.id.split('_text_')[1])) ? parseInt((selection.focusNode as HTMLElement).id.split('_pageDiv_')[1]) : parseInt(selection.focusNode.parentElement.id.split('_text_')[1]);
                // eslint-disable-next-line radix
                const currentAnchorIndex: number = parseInt(selectionRange.startNode.split('_text_')[1]);
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
                        // eslint-disable-next-line max-len
                        if (anchorPageIndex < currentAnchorIndex && currentAnchorIndex < focusPageIndex && anchorPageIndex !== focusPageIndex) {
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
                        // eslint-disable-next-line max-len
                        if (anchorPageIndex > currentAnchorIndex && currentAnchorIndex > focusPageIndex && anchorPageIndex !== focusPageIndex) {
                            if (!isBackward) {
                                range.setStart(selection.anchorNode, selection.anchorOffset);
                                range.setEnd(selection.focusNode, selection.focusOffset);
                            } else {
                                selection.extend(selection.focusNode, selection.focusOffset);
                            }
                            // eslint-disable-next-line max-len
                        } else if (anchorPageIndex < currentAnchorIndex && currentAnchorIndex < focusPageIndex && anchorPageIndex !== focusPageIndex) {
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
                            // eslint-disable-next-line radix
                            const currentAnchorOffset: number = parseInt(selectionRange.startNode.split('_' + currentAnchorIndex + '_')[1]);
                            // eslint-disable-next-line radix
                            const currentFocusOffset: number = parseInt(selectionRange.endNode.split('_' + currentAnchorIndex + '_')[1]);
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
     * @param pageNumber
     * @param isStich
     * @param pageNumber
     * @param isStich
     * @private
     */
    public maintainSelectionOnScroll(pageNumber: number, isStich: boolean): void {
        const isSelectionAvailable: boolean = this.isSelectionAvailableOnScroll(pageNumber);
        if (this.isTextSelection && !isSelectionAvailable) {
            this.maintainSelection(pageNumber, isStich);
        }
    }

    /**
     * @param pageNumber
     * @param isStich
     * @private
     */
    public maintainSelection(pageNumber: number, isStich: boolean): void {
        const selection: Selection = window.getSelection();
        if (this.isTextSelection && (selection.type === 'Range' || (!selection.type && !selection.isCollapsed))) {
            // eslint-disable-next-line
            let anchorPageId: number = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
            // eslint-disable-next-line
            let focusPageId: number = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
            if (isNaN(focusPageId) && selection.anchorNode !== null) {
                const backward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
                if (!backward) {
                    // eslint-disable-next-line radix
                    const lastChildNode: HTMLElement = this.pdfViewerBase.pageContainer.lastChild as HTMLElement;
                    if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                        // eslint-disable-next-line radix
                        focusPageId = parseInt((lastChildNode.previousSibling.previousSibling as HTMLElement).id.split('_pageDiv_')[1]);
                    } else {
                        // eslint-disable-next-line radix
                        focusPageId = parseInt(lastChildNode.id.split('_pageDiv_')[1]);
                    }
                } else {
                    // eslint-disable-next-line radix
                    focusPageId = parseInt((this.pdfViewerBase.pageContainer.firstChild as HTMLElement).id.split('_pageDiv_')[1]);
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
                // eslint-disable-next-line max-len
                const anchorOffsetValue: number = (this.getNodeElementFromNode(selection.anchorNode).childNodes.length === 1) ? selection.anchorOffset : this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                const focusOffsetValue: number = (this.getNodeElementFromNode(selection.focusNode).childNodes.length === 1) ? selection.focusOffset : this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                selectionObject = {
                    isBackward: backward, startNode: this.getNodeElementFromNode(selection.anchorNode).id,
                    startOffset: anchorOffsetValue, endNode: this.getNodeElementFromNode(selection.focusNode).id,
                    // eslint-disable-next-line max-len
                    endOffset: focusOffsetValue, textContent: selection.toString(), pageNumber: pageNumber, bound: selectionBounds, rectangleBounds: selectionRectBounds
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
            if (parentElement.childNodes[i] === node) {
                offsetValue = offsetValue + offset;
                break;
            } else {
                offsetValue = offsetValue + parentElement.childNodes[i].textContent.length;
            }
        }
        return offsetValue;
    }

    private pushSelectionRangeObject(selectionObject: ISelection, pageNumber: number): void {
        if (this.isTouchSelection) {
            const currentObject: ISelection[] = this.selectionRangeArray.filter(
                // eslint-disable-next-line
                obj => {
                    return (obj.pageNumber === pageNumber);
                });
            if (currentObject.length > 0) {
                const currentObjectIndex: number = this.selectionRangeArray.indexOf(currentObject[0]);
                this.selectionRangeArray.splice(currentObjectIndex, 1, selectionObject);
                return;
            }
        }
        const nextPageObject: ISelection[] = this.selectionRangeArray.filter(
            // eslint-disable-next-line
            obj => {
                return (obj.pageNumber === (pageNumber + 1));
            });
        if (nextPageObject.length === 0) {
            if (this.isTouchSelection && this.selectionRangeArray.length !== 0) {
                const prevPageObject: ISelection[] = this.selectionRangeArray.filter(
                    // eslint-disable-next-line
                    obj => {
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
        // eslint-disable-next-line
        let focusPageId: number = isNaN(parseInt(currentFocusElement.split('_text_')[1])) ? parseInt((selection.focusNode as HTMLElement).id.split('_pageDiv_')[1]) : parseInt(currentFocusElement.split('_text_')[1]);
        // eslint-disable-next-line radix
        if (isNaN(parseInt(currentFocusElement.split('_text_')[1]))) {
            // eslint-disable-next-line
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
     * @param currentPageNumber
     * @private
     */
    public textSelectionOnMouseWheel(currentPageNumber: number): void {
        this.isMouseLeaveSelection = true;
        this.stichSelectionOnScroll(currentPageNumber);
    }

    /**
     * @param currentPageNumber
     * @private
     */
    public stichSelectionOnScroll(currentPageNumber: number): void {
        const selection: Selection = window.getSelection();
        if (this.isTextSelection) {
            // eslint-disable-next-line radix
            const anchorPageId: number = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
            // eslint-disable-next-line radix
            const focusPageId: number = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
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
     * @param pageNumber
     * @param anchorPageId
     * @param focusPageId
     * @param pageNumber
     * @param anchorPageId
     * @param focusPageId
     * @private
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
                        // eslint-disable-next-line max-len
                        lastElement = (element.lastChild as HTMLElement);
                        startOffset = this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                        endOffset = this.getTextLastLength(lastElement);
                    } else if (pageNumber > anchorPageId && pageNumber < focusPageId) {
                        // eslint-disable-next-line max-len
                        firstElement = (element.firstChild as HTMLElement);
                        // eslint-disable-next-line max-len
                        lastElement = (element.lastChild as HTMLElement);
                        startOffset = 0;
                        endOffset = this.getTextLastLength(lastElement);
                    } else if (pageNumber === focusPageId) {
                        // eslint-disable-next-line max-len
                        firstElement = (element.firstChild as HTMLElement);
                        const pageNumberIndex: number = this.getNodeElementFromNode(selection.focusNode).id.indexOf(focusPageId.toString());
                        if (pageNumberIndex !== -1) {
                            lastElement = this.getNodeElementFromNode(selection.focusNode);
                            endOffset = this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                        } else {
                            // eslint-disable-next-line max-len
                            lastElement = (document.getElementById(this.pdfViewer.element.id + '_textLayer_' + focusPageId).lastChild as HTMLElement);
                            endOffset = this.getTextLastLength(lastElement);
                        }
                        startOffset = 0;
                    }
                } else {
                    if (pageNumber === anchorPageId) {
                        firstElement = this.getNodeElementFromNode(selection.anchorNode);
                        // eslint-disable-next-line max-len
                        lastElement = (element.firstChild as HTMLElement);
                        startOffset = this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                        endOffset = 0;
                    } else if (pageNumber < anchorPageId && pageNumber > focusPageId) {
                        // eslint-disable-next-line max-len
                        firstElement = (element.firstChild as HTMLElement);
                        // eslint-disable-next-line max-len
                        lastElement = (element.lastChild as HTMLElement);
                        startOffset = 0;
                        endOffset = this.getTextLastLength(lastElement);
                    } else if (pageNumber === focusPageId) {
                        firstElement = this.getNodeElementFromNode(selection.focusNode);
                        // eslint-disable-next-line max-len
                        lastElement = (element.lastChild as HTMLElement);
                        startOffset = this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                        endOffset = this.getTextLastLength(lastElement);
                    }
                }
                if (firstElement && lastElement) {
                    // eslint-disable-next-line max-len
                    const selectionRangeObject: Range = this.getSelectionRangeObject(firstElement.id, startOffset, lastElement.id, endOffset, pageNumber);
                    const selectionString: string = selectionRangeObject.toString();
                    const selectionBound: IRectangle = this.getSelectionBounds(selectionRangeObject, pageNumber);
                    const selectionRectBounds: IRectangle[] = this.getSelectionRectangleBounds(selectionRangeObject, pageNumber);
                    // eslint-disable-next-line max-len
                    return selectionObject = { isBackward: backward, startNode: firstElement.id, startOffset: startOffset, endNode: lastElement.id, endOffset: endOffset, textContent: selectionString, pageNumber: pageNumber, bound: selectionBound, rectangleBounds: selectionRectBounds };
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
        // eslint-disable-next-line radix
        const currentAnchorOffset: number = parseInt(startNode.split('_' + pageNumber + '_')[1]);
        // eslint-disable-next-line radix
        const currentFocusOffset: number = parseInt(endNode.split('_' + pageNumber + '_')[1]);
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
            // eslint-disable-next-line max-len
            const startRange: Range = this.createRangeForSelection(range.startContainer, range.endContainer, range.startOffset, range.endOffset, newStartRange);
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
                const textElement: HTMLElement = textDivs[j] as HTMLElement;
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
                const newRange: Range = document.createRange();
                for (let k: number = 0; k < textElement.childNodes.length; k++) {
                    const node: Node = textElement.childNodes[k];
                    newRange.setStart(node, startOffset);
                    newRange.setEnd(node, endOffset);
                }
                const boundingRect: IRectangle = this.normalizeBounds(newRange.getBoundingClientRect(), pageNumber);
                selectionBounds.push(boundingRect);
                newRange.detach();
                if (j === focusTextId) {
                    break;
                }
            }
        } else {
            bounds = this.normalizeBounds(range.getBoundingClientRect(), pageNumber);
            selectionBounds.push(bounds);
        }
        return selectionBounds;
    }

    private getTextId(elementId: string): number {
        const index: number = elementId.lastIndexOf('_');
        const divId: string = elementId.substring(index + 1, elementId.length);
        // eslint-disable-next-line radix
        return parseInt(divId);
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
     * @param pageNumber
     * @private
     */
    public getCurrentSelectionBounds(pageNumber: number): IRectangle {
        let bound: IRectangle = null;
        const ranges: ISelection[] = this.selectionRangeArray;
        for (let i: number = 0; i < ranges.length; i++) {
            if (ranges[i] !== null) {
                if (pageNumber === ranges[i].pageNumber) {
                    bound = ranges[i].bound;
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
            // eslint-disable-next-line
            let anchorPage: number = isNaN(parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1])) ? parseInt((selection.anchorNode as HTMLElement).id.split('_pageDiv_')[1]) : parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
            if (isNaN(anchorPage)) {
                // eslint-disable-next-line radix
                anchorPage = parseInt((selection.anchorNode as HTMLElement).id.split('_text_')[1]);
            }
            // eslint-disable-next-line
            let focusPage: number = isNaN(parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1])) ? parseInt((selection.focusNode as HTMLElement).id.split('_pageDiv_')[1]) : parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
            if (isNaN(focusPage)) {
                // eslint-disable-next-line
                focusPage = isNaN(parseInt((selection.focusNode as HTMLElement).id.split('_text_')[1])) ? parseInt((selection.focusNode as HTMLElement).id.split('_textLayer_')[1]) : parseInt((selection.focusNode as HTMLElement).id.split('_text_')[1]);
            }
            let arrayObject: ISelection[] = [];
            if (!isBackward) {
                arrayObject = this.selectionRangeArray.filter(
                    // eslint-disable-next-line
                    obj => {
                        return (!((this.selectionStartPage <= obj.pageNumber) && (obj.pageNumber < focusPage)));
                    });
            } else {
                arrayObject = this.selectionRangeArray.filter(
                    // eslint-disable-next-line
                    obj => {
                        return (!((focusPage < obj.pageNumber) && (obj.pageNumber <= this.selectionStartPage)));
                    });
            }
            if (arrayObject.length > 0) {
                for (let i: number = 0; i < arrayObject.length; i++) {
                    const indexInArray: number = this.selectionRangeArray.indexOf(arrayObject[i]);
                    if (indexInArray !== -1) {
                        this.selectionRangeArray.splice(indexInArray, 1);
                    }
                }
                if (this.selectionRangeArray.length === 1) {
                    // eslint-disable-next-line max-len
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
    public applySpanForSelection(): void {
        const selection: Selection = window.getSelection();
        // eslint-disable-next-line max-len
        if (selection.anchorNode === selection.focusNode && selection.anchorOffset === selection.focusOffset && !selection.isCollapsed) {
            selection.removeAllRanges();
        }
        // eslint-disable-next-line max-len
        if (selection.anchorNode !== null && this.pdfViewerBase.viewerContainer.contains(this.getNodeElementFromNode(selection.anchorNode))) {
            const isBackWardSelection: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            let anchorPageId: number; let focusPageId: number; let anchorOffsetDiv: number; let focusOffsetDiv: number;
            let anchorOffset: number; let focusOffset: number;
            if (isBackWardSelection) {
                // eslint-disable-next-line radix
                anchorPageId = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
                // eslint-disable-next-line radix
                focusPageId = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
                // eslint-disable-next-line radix
                anchorOffsetDiv = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1].split('_')[1]);
                // eslint-disable-next-line radix
                focusOffsetDiv = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1].split('_')[1]);
                anchorOffset = selection.focusOffset;
                focusOffset = selection.anchorOffset;
            } else {
                let anchorElement: HTMLElement = this.getNodeElementFromNode(selection.anchorNode);
                let focusElement: HTMLElement = this.getNodeElementFromNode(selection.focusNode);
                // eslint-disable-next-line
                anchorPageId = (anchorElement.id.indexOf('text_') !== -1) ? parseInt(anchorElement.id.split('text_')[1]) : parseInt(anchorElement.id.split('_textLayer_')[1]);
                // eslint-disable-next-line
                focusPageId = (focusElement.id.indexOf('text_') !== -1) ? parseInt(focusElement.id.split('text_')[1]) : parseInt(focusElement.id.split('_textLayer_')[1]);
                let isFocusChanged: boolean = false;
                if (this.isTouchSelection) {
                    if ((selection.focusNode as HTMLElement) === this.pdfViewerBase.pageContainer) {
                        const lastChildNode: HTMLElement = this.pdfViewerBase.pageContainer.lastChild as HTMLElement;
                        if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                            const lastPageDiv: HTMLElement = lastChildNode.previousSibling.previousSibling as HTMLElement;
                            // eslint-disable-next-line radix
                            focusPageId = parseInt(lastPageDiv.id.split('_pageDiv_')[1]);
                            focusElement = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).lastChild as HTMLElement;
                            isFocusChanged = true;
                        } else if (lastChildNode.classList.contains('e-pv-page-div')) {
                            const lastPageDiv: HTMLElement = lastChildNode as HTMLElement;
                            // eslint-disable-next-line radix
                            focusPageId = parseInt(lastPageDiv.id.split('_pageDiv_')[1]);
                            focusElement = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).lastChild as HTMLElement;
                            isFocusChanged = true;
                        }
                    }
                }
                if (anchorElement.classList.contains('e-pv-maintaincontent')) {
                    anchorElement = this.getNodeElementFromNode(anchorElement);
                    // eslint-disable-next-line radix
                    anchorPageId = parseInt(anchorElement.id.split('text_')[1]);
                }
                if (focusElement.classList.contains('e-pv-maintaincontent')) {
                    focusElement = this.getNodeElementFromNode(focusElement);
                    // eslint-disable-next-line radix
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
                // eslint-disable-next-line radix
                anchorOffsetDiv = (anchorElement.id.split('text_')[1]) ? parseInt(anchorElement.id.split('text_')[1].split('_')[1]) : null;
                // eslint-disable-next-line radix
                focusOffsetDiv = (focusElement.id.split('text_')[1]) ? parseInt(focusElement.id.split('text_')[1].split('_')[1]) : null;
                anchorOffsetDiv = isNaN(anchorOffsetDiv) ? focusOffsetDiv : anchorOffsetDiv;
                focusOffsetDiv = isNaN(focusOffsetDiv) ? anchorOffsetDiv : focusOffsetDiv;
                anchorOffset = selection.anchorOffset;
                focusOffset = !isFocusChanged ? selection.focusOffset : focusElement.textContent.length;
            }
            if (this.pdfViewerBase.checkIsNormalText()) {
                selection.removeAllRanges();
                this.pdfViewerBase.textLayer.clearDivSelection();
                // eslint-disable-next-line max-len
                this.pdfViewerBase.textLayer.applySpanForSelection(anchorPageId, focusPageId, anchorOffsetDiv, focusOffsetDiv, anchorOffset, focusOffset);
            }
            if (this.pdfViewer.textSearchModule) {
                this.pdfViewer.textSearchModule.searchAfterSelection();
            }
        }
    }

    /**
     * @param event
     * @param x
     * @param y
     * @private
     */
    public initiateTouchSelection(event: TouchEvent, x: number, y: number): void {
        if (this.pdfViewerBase.isShapeBasedAnnotationsEnabled()) {
            if (this.pdfViewer.selectedItems.annotations.length > 0) {
                this.pdfViewer.clearSelection(this.pdfViewer.selectedItems.annotations[0].pageIndex);
            }
        }
        // eslint-disable-next-line
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

    // eslint-disable-next-line
    private selectTextByTouch(element: any, x: number, y: number, isForwardSelection: boolean, target: string, isCloserMovement: boolean): boolean {
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
                    if (selection.anchorNode != null) {
                        if (isForwardSelection) {
                            rangeObject.setStart(selection.anchorNode, selection.anchorOffset);
                        }
                        // eslint-disable-next-line max-len
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
        } else {
            for (let i: number = 0; i < element.childNodes.length; i++) {
                const range: Range = element.childNodes[i].ownerDocument.createRange();
                range.selectNodeContents(element.childNodes[i]);
                const rangeBounds: ClientRect = range.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    range.detach();
                    return (this.selectTextByTouch(element.childNodes[i], x, y, isForwardSelection, target, isCloserMovement));
                } else {
                    range.detach();
                }
            }
        }
        return isTextSelected;
    }

    // eslint-disable-next-line
    private setTouchSelectionStartPosition(selection: Selection, range: Range, isForwardSelection: boolean, target: string, element: any, currentPosition: number, isCloserMovement: boolean): Range {
        if (isForwardSelection) {
            if (target === 'left') {
                // eslint-disable-next-line
                let startNode: any = this.getTouchFocusElement(selection, true);
                range.setStart(startNode.focusNode, startNode.focusOffset);
                range.setEnd(element, currentPosition);
                this.selectionAnchorTouch = { anchorNode: range.endContainer.parentElement.id, anchorOffset: range.endOffset };
            } else if (target === 'right') {
                // eslint-disable-next-line
                let startNode: any = this.getTouchAnchorElement(selection, false);
                range.setStart(startNode.anchorNode, startNode.anchorOffset);
                range.setEnd(element, currentPosition);
                this.selectionFocusTouch = { focusNode: range.endContainer.parentElement.id, focusOffset: range.endOffset };
            }
        } else {
            if (target === 'left') {
                if (!isCloserMovement) {
                    // eslint-disable-next-line
                    let startNode: any = this.getTouchFocusElement(selection, false);
                    range.setStart(element, currentPosition);
                    // eslint-disable-next-line radix
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
                // eslint-disable-next-line
                let startNode: any = this.getTouchAnchorElement(selection, true);
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
            // eslint-disable-next-line radix
            offset = parseInt(this.selectionAnchorTouch.anchorOffset.toString());
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
            // eslint-disable-next-line radix
            offset = parseInt(this.selectionFocusTouch.focusOffset.toString());
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
        this.isTouchSelection = true;
        const selection: Selection = window.getSelection();
        if (selection.type === 'Range') {
            // eslint-disable-next-line max-len
            this.dropDivElementLeft = createElement('div', { id: this.pdfViewer.element.id + '_touchSelect_droplet_left', className: 'e-pv-touch-select-drop' });
            // eslint-disable-next-line max-len
            this.dropDivElementRight = createElement('div', { id: this.pdfViewer.element.id + '_touchSelect_droplet_right', className: 'e-pv-touch-select-drop' });
            this.dropElementLeft = createElement('div', { className: 'e-pv-touch-ellipse' });
            this.dropElementLeft.style.transform = 'rotate(0deg)';
            this.dropDivElementLeft.appendChild(this.dropElementLeft);
            this.dropElementRight = createElement('div', { className: 'e-pv-touch-ellipse' });
            this.dropElementRight.style.transform = 'rotate(-90deg)';
            this.dropDivElementRight.appendChild(this.dropElementRight);
            this.pdfViewerBase.pageContainer.appendChild(this.dropDivElementLeft);
            this.pdfViewerBase.pageContainer.appendChild(this.dropDivElementRight);
            const range: Range = selection.getRangeAt(0);
            const rangePosition: ClientRect = range.getBoundingClientRect();
            const dropElementRect: ClientRect = this.dropDivElementLeft.getBoundingClientRect();
            // eslint-disable-next-line max-len
            const pageTopValue: number = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
            const viewerLeftPosition: number = this.pdfViewerBase.viewerContainer.getBoundingClientRect().left;
            const topClientValue: number = this.getClientValueTop(rangePosition.top, this.pdfViewerBase.currentPageNumber - 1);
            // eslint-disable-next-line max-len
            const topPositionValue: string = topClientValue + pageTopValue * this.pdfViewerBase.getZoomFactor() + (dropElementRect.height / 2) * this.pdfViewerBase.getZoomFactor() + 'px';
            this.dropDivElementLeft.style.top = topPositionValue;
            this.dropDivElementLeft.style.left = rangePosition.left - (viewerLeftPosition + (dropElementRect.width)) + 'px';
            this.dropDivElementRight.style.top = topPositionValue;
            // eslint-disable-next-line max-len
            this.dropDivElementRight.style.left = rangePosition.left + rangePosition.width - viewerLeftPosition + 'px';
            const currentPageLeft: number = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
            const currentRangeLeft: number = rangePosition.left - currentPageLeft;
            // eslint-disable-next-line max-len
            this.topStoreLeft = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue), pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft), isHeightNeeded: true };
            // eslint-disable-next-line max-len
            this.topStoreRight = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue), pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft + rangePosition.width), isHeightNeeded: true };
            this.dropDivElementLeft.addEventListener('touchstart', this.onLeftTouchSelectElementTouchStart);
            this.dropDivElementLeft.addEventListener('touchmove', this.onLeftTouchSelectElementTouchMove);
            this.dropDivElementLeft.addEventListener('touchend', this.onLeftTouchSelectElementTouchEnd);
            this.dropDivElementRight.addEventListener('touchstart', this.onRightTouchSelectElementTouchStart);
            this.dropDivElementRight.addEventListener('touchmove', this.onRightTouchSelectElementTouchMove);
            this.dropDivElementRight.addEventListener('touchend', this.onRightTouchSelectElementTouchEnd);
            // eslint-disable-next-line max-len
            this.calculateContextMenuPosition(event.touches[0].clientY, event.touches[0].clientX);
        }
    }
    /**
     * @param top
     * @param left
     * @private
     */
    // eslint-disable-next-line
    public calculateContextMenuPosition(top: any, left: any): any {
        top = top - this.pdfViewerBase.toolbarHeight;
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            // eslint-disable-next-line
            let contextTop: any = top - this.contextMenuHeight;
            if (contextTop < this.pdfViewerBase.toolbarHeight) {
                top = top + this.contextMenuHeight;
            } else {
                top = contextTop;
            }
        }
        if (this.pdfViewer.contextMenuSettings.contextMenuAction === 'MouseUp') {
            left = left - 50;
        }
        // eslint-disable-next-line max-len
        this.pdfViewerBase.contextMenuModule.open(top, left - this.pdfViewerBase.viewerContainer.clientLeft, this.pdfViewerBase.viewerContainer);
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
     */
    public initiateSelectionByTouch(): void {
        this.pdfViewerBase.textLayer.clearDivSelection();
        this.pdfViewerBase.contextMenuModule.close();
        let lowerPageIndex: number = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageIndex = (lowerPageIndex < 0) ? 0 : lowerPageIndex;
        let higherPageIndex: number = this.pdfViewer.currentPageNumber + 1;
        // eslint-disable-next-line max-len
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

    // eslint-disable-next-line
    private terminateSelectionByTouch(event: any): void {
        this.maintainSelectionOnZoom(true, false);
        this.applySpanForSelection();
        if (this.pdfViewerBase.getTextMarkupAnnotationMode()) {
            // eslint-disable-next-line max-len
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
        } else {
            this.fireTextSelectEnd();
            // eslint-disable-next-line max-len
            this.pdfViewerBase.contextMenuModule.open(event.changedTouches[0].clientY - this.pdfViewerBase.viewerContainer.offsetTop + this.pdfViewerBase.contextMenuModule.contextMenuElement.clientHeight, event.changedTouches[0].clientX - this.pdfViewerBase.viewerContainer.offsetLeft, this.pdfViewerBase.viewerContainer);
        }
    }

    private onLeftTouchSelectElementTouchMove = (event: TouchEvent): void => {
        let range: Range;
        let nodeElement: Node;
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
                // eslint-disable-next-line max-len
                const currentDifference: number = Math.sqrt((yTouch - dropBounds.top) * (yTouch - dropBounds.top) + (xTouch - dropBounds.left) * (xTouch - dropBounds.left));
                const isCloserMovement: boolean = this.isCloserTouchScroll(currentDifference);
                let isTextSelected: boolean = false;
                if (yTouch <= dropBounds.top) {
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
                    // eslint-disable-next-line max-len
                    const currentPageLeft: number = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
                    const currentRangeLeft: number = xTouch - currentPageLeft;
                    // eslint-disable-next-line max-len
                    this.dropDivElementLeft.style.top = pageTopValue * this.pdfViewerBase.getZoomFactor() + topClientValue + 'px';
                    this.topStoreLeft = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue), pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft), isHeightNeeded: false };
                    // eslint-disable-next-line max-len
                    this.dropDivElementLeft.style.left = xTouch - this.pdfViewerBase.viewerContainer.getBoundingClientRect().left - (elementClientRect.width / 2) + 'px';
                    this.previousScrollDifference = currentDifference;
                }
            }
        }
    };

    // eslint-disable-next-line
    private onRightTouchSelectElementTouchMove = (event: TouchEvent): void => {
        let range: Range;
        let nodeElement: Node;
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
                // eslint-disable-next-line max-len
                const currentDifference: number = Math.sqrt((touchY - dropPosition.top) * (touchY - dropPosition.top) + (touchX - dropPosition.left) * (touchX - dropPosition.left));
                const isCloserMovement: boolean = this.isCloserTouchScroll(currentDifference);
                let isTextSelected: boolean = false;
                if (touchY >= dropPosition.top) {
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
                    // eslint-disable-next-line max-len
                    const currentPageLeft: number = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
                    const currentRangeLeft: number = touchX - currentPageLeft;
                    // eslint-disable-next-line max-len
                    this.topStoreRight = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue), pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft), isHeightNeeded: false };
                    // eslint-disable-next-line max-len
                    this.dropDivElementRight.style.left = touchX - this.pdfViewerBase.viewerContainer.getBoundingClientRect().left - (elementClientRect.width / 2) + 'px';
                    this.previousScrollDifference = currentDifference;
                }
            }
        }
    };

    private getNodeElement(range: Range, touchX: number, touchY: number, event: TouchEvent, nodeElement: Node): Node {
        if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(touchX, touchY);
            nodeElement = this.onTouchElementScroll(range, nodeElement, touchY, event);
            // eslint-disable-next-line
        } else if ((document as any).caretPositionFromPoint) {
            // eslint-disable-next-line
            let start: any = (document as any).caretPositionFromPoint(touchX, touchY);
            // eslint-disable-next-line
            let end: any = (document as any).caretPositionFromPoint(touchX, touchY);
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
            // eslint-disable-next-line max-len
            return clientValue - this.pdfViewerBase.getElement('_pageDiv_' + pageNumber).getBoundingClientRect().top;
        } else {
            return clientValue;
        }
    }

    private isScrolledOnScrollBar(event: TouchEvent): boolean {
        let isScrollBar: boolean = false;
        // eslint-disable-next-line max-len
        if (event.touches && (this.pdfViewerBase.viewerContainer.clientHeight + this.pdfViewerBase.viewerContainer.offsetTop) < event.touches[0].clientY && event.touches[0].clientY < (this.pdfViewerBase.viewerContainer.offsetHeight + this.pdfViewerBase.viewerContainer.offsetTop)) {
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
     * @returns void
     */
    public copyText(): void {
        let selectionText: string = '';
        this.maintainSelectionOnZoom(true, false);
        if (this.selectionRangeArray.length > 0) {
            for (let i: number = 0; i < this.selectionRangeArray.length; i++) {
                selectionText += this.selectionRangeArray[i].textContent;
            }
        }
        if (selectionText.length > 0) {
            if (this.pdfViewer.annotation) {
                this.pdfViewer.annotation.isShapeCopied = false;
            }
            const textArea: HTMLElement = document.createElement('textarea');
            textArea.contentEditable = 'true';
            textArea.textContent = selectionText;
            // eslint-disable-next-line max-len
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
     */
    public destroy(): void {
        this.clear();
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'TextSelection';
    }
}
