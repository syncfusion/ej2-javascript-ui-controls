import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfViewer, PdfViewerBase } from '../index';

/**
 * The `IRectangle` module is used to handle rectangle property of PDF viewer.
 * @hidden
 */
export interface IRectangle {
    bottom: number;
    height: number;
    left: number;
    top: number;
    right: number;
    width: number;
}

/**
 * The `ISelection` module is used to handle selection property of PDF viewer.
 * @hidden
 */
export interface ISelection {
    isBackward: boolean;
    startNode: string;
    startOffset: number;
    endNode: string;
    endOffset: number;
    textContent: string;
    pageNumber: number;
    bound: IRectangle;
    rectangleBounds: IRectangle[];
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
    // tslint:disable-next-line
    private scrollMoveTimer: any = 0;
    private isMouseLeaveSelection: boolean = false;
    private isTouchSelection: boolean = false;
    private previousScrollDifference: number = 0;
    private topStoreLeft: { [key: string]: Object } = null;
    private topStoreRight: { [key: string]: Object } = null;
    private isTextSearched: boolean = false;
    private isSelectionStartTriggered: boolean = false;
    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * @private
     */
    public textSelectionOnMouseMove(target: EventTarget, x: number, y: number, isExtended?: boolean): void {
        let targetElement: HTMLElement = target as HTMLElement;
        this.isTextSearched = true;
        if (targetElement.nodeType === targetElement.TEXT_NODE) {
            if (!this.isSelectionStartTriggered && !this.pdfViewerBase.getTextMarkupAnnotationMode()) {
                this.pdfViewer.fireTextSelectionStart(this.pdfViewerBase.currentPageNumber);
                this.isSelectionStartTriggered = true;
            }
            this.isBackwardPropagatedSelection = false;
            let range: Range = targetElement.ownerDocument.createRange();
            let selection: Selection = window.getSelection();
            if (selection.anchorNode !== null) {
                let position: number = selection.anchorNode.compareDocumentPosition(selection.focusNode);
                if (!position && selection.anchorOffset > selection.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
                    this.isBackwardPropagatedSelection = true;
                }
            }
            range.selectNodeContents(targetElement);
            let currentPosition: number = 0;
            let endPosition: number = range.endOffset;
            while (currentPosition < endPosition) {
                range.setStart(targetElement, currentPosition);
                range.setEnd(targetElement, currentPosition + 1);
                let rangeBounds: ClientRect = range.getBoundingClientRect();
                let rightBounds: number = rangeBounds.right;
                if (isExtended) {
                    // tslint:disable-next-line
                    rightBounds = parseInt(rangeBounds.right.toString());
                }
                // tslint:disable-next-line:max-line-length
                // tslint:disable-next-line
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
                    // tslint:disable-next-line
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
            // tslint:disable-next-line:max-line-length
            if (this.pdfViewer.enableTextMarkupResizer && this.pdfViewer.annotationModule && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                // tslint:disable-next-line
                let leftDivElement: any = document.getElementById(this.pdfViewer.element.id + '_droplet_left');
                if (this.pdfViewerBase.isSelection) {
                    // tslint:disable-next-line
                    let currentrange: any = selection.getRangeAt(0);
                    // tslint:disable-next-line
                    let rect: any = currentrange.getBoundingClientRect();
                    let left: number = rect.left;
                    let top: number = rect.top;
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
                    let range: Range = this.getSelectionRange(i, targetElement);
                    let rangeBounds: ClientRect = range.getBoundingClientRect();
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line
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
     * @private
     */
    public textSelectionOnDrag(target: EventTarget, x: number, y: number, isforward: boolean): boolean {
        let targetElement: HTMLElement = target as HTMLElement;
        this.isTextSearched = true;
        if (targetElement.nodeType === targetElement.TEXT_NODE) {
            this.isBackwardPropagatedSelection = false;
            let range: Range = targetElement.ownerDocument.createRange();
            let selection: Selection = window.getSelection();
            if (selection.anchorNode !== null) {
                let position: number = selection.anchorNode.compareDocumentPosition(selection.focusNode);
                if (!position && selection.anchorOffset > selection.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
                    this.isBackwardPropagatedSelection = true;
                }
            }
            range.selectNodeContents(targetElement);
            let currentPosition: number = 0;
            let endPosition: number = range.endOffset;
            while (currentPosition < endPosition) {
                range.setStart(targetElement, currentPosition);
                range.setEnd(targetElement, currentPosition + 1);
                let rangeBounds: ClientRect = range.getBoundingClientRect();
                // tslint:disable-next-line:max-line-length
                // tslint:disable-next-line
                if (rangeBounds.left <= x && rangeBounds.right >= x && parseInt(rangeBounds.top.toString()) <= y && rangeBounds.bottom >= y) {
                    if (isforward) {
                        // tslint:disable-next-line:max-line-length
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
                // tslint:disable-next-line
                let currentrange: any = selection.getRangeAt(0);
                // tslint:disable-next-line
                let rect: any = currentrange.getBoundingClientRect();
                let left: number = rect.left;
                let top: number = rect.top;
                this.pdfViewer.annotation.textMarkupAnnotationModule.updateLeftposition(left, top);
                this.pdfViewerBase.isSelection = false;
            }
            this.pdfViewer.annotation.textMarkupAnnotationModule.updatePosition(x, y);
        } else {
            for (let i: number = 0; i < targetElement.childNodes.length; i++) {
                if (targetElement.childNodes[i].nodeType === targetElement.TEXT_NODE) {
                    let range: Range = this.getSelectionRange(i, targetElement);
                    let rangeBounds: ClientRect = range.getBoundingClientRect();
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line
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

    public selectTextRegion(pageNumbers: number, bounds: IRectangle[]): void {
        // tslint:disable-next-line
        let element: any = null;
        let pageNumber: number = (pageNumbers - 1);
        for (let k: number = 0; k < bounds.length; k++) {
            // tslint:disable-next-line
            let bound: any = bounds[k];
            let x: number = (bound.left ? bound.left : bound.Left) * this.pdfViewerBase.getZoomFactor();
            let y: number = (bound.top ? bound.top : bound.Top) * this.pdfViewerBase.getZoomFactor();
            let width: number = (bound.width ? bound.width : bound.Width) * this.pdfViewerBase.getZoomFactor();
            let height: number = bound.height ? bound.height : bound.Height;
            // tslint:disable-next-line
            let textLayer: any = this.pdfViewerBase.getElement('_textLayer_' + pageNumber);
            if (textLayer) {
                // tslint:disable-next-line
                let textDivs: any = textLayer.childNodes;
                for (let n: number = 0; n < textDivs.length; n++) {
                    if (textDivs[n]) {
                        // tslint:disable-next-line
                        let rangebounds: any = textDivs[n].getBoundingClientRect();
                        let top: number = this.getClientValueTop(rangebounds.top, pageNumber);
                        // tslint:disable-next-line:max-line-length
                        let currentLeft: number = rangebounds.left - this.pdfViewerBase.getElement('_pageDiv_' + pageNumber).getBoundingClientRect().left;
                        let totalLeft: number = currentLeft + rangebounds.width;
                        // tslint:disable-next-line
                        let textDiVLeft: number = parseInt(textDivs[n].style.left);
                        // tslint:disable-next-line
                        let currentTop: number = parseInt(textDivs[n].style.top);
                        let isLeftBounds: boolean = this.checkLeftBounds(currentLeft, textDiVLeft, totalLeft, x);
                        let isTopBounds: boolean = this.checkTopBounds(top, currentTop, y);
                        if (isLeftBounds && isTopBounds) {
                            element = textDivs[n];
                            break;
                        }
                    }
                }
                if (element != null) {
                    // tslint:disable-next-line
                    let boundingRect: any = this.pdfViewerBase.getElement('_textLayer_' + pageNumber).getBoundingClientRect();
                    this.textSelectionOnMouseMove(element, x + boundingRect.left, y + boundingRect.top, false);
                    if ((bounds.length - 1) === k) {
                        // tslint:disable-next-line:max-line-length
                        this.textSelectionOnMouseMove(element, x + boundingRect.left + width, y + boundingRect.top, false);
                    }
                }
            }
        }
    }
    /**
     * @private
     */
    public checkLeftBounds(left: number, textDiVLeft: number, totalLeft: number, x: number): boolean {
        let isExists: boolean = false;
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line
        if (left === parseInt(x.toString()) || parseInt(left.toString()) === parseInt(x.toString()) || (left + 1) === parseInt(x.toString()) || (left - 1) === parseInt(x.toString())
            // tslint:disable-next-line
            || textDiVLeft === parseInt(x.toString()) || textDiVLeft === x || (totalLeft >= x && left <= x)) {
            isExists = true;
        }
        return isExists;
    }
    /**
     * @private
     */
    public checkTopBounds(top: number, currentTop: number, y: number): boolean {
        let isExists: boolean = false;
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line
        if ((top === parseInt(y.toString()) || parseInt(top.toString()) === parseInt(y.toString()) || parseInt((top + 1).toString()) === parseInt(y.toString()) || parseInt((top - 1).toString()) === parseInt(y.toString())
            // tslint:disable-next-line
            || currentTop === parseInt(y.toString()) || currentTop === y)) {
            isExists = true;
        }
        return isExists;
    }

    /**
     * @private
     */
    public textSelectionOnMouseLeave(event: MouseEvent): void {
        event.preventDefault();
        let viewerTop: number = this.pdfViewerBase.viewerContainer.offsetTop;
        if (this.pdfViewer.magnificationModule) {
            if (this.pdfViewer.magnificationModule.fitType === 'fitToPage') {
                return;
            }
        }
        if (event.clientY > viewerTop) {
            this.scrollMoveTimer = setInterval(() => { this.scrollForwardOnSelection(); }, 500);
        } else {
            this.scrollMoveTimer = setInterval(() => { this.scrollBackwardOnSelection(); }, 500);
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
     * @private
     */
    // tslint:disable-next-line
    public selectAWord(element: any, x: number, y: number, isStoreSelection: boolean): void {
        if (element.nodeType === element.TEXT_NODE) {
            let selection: Selection = window.getSelection();
            let range: Range = element.ownerDocument.createRange();
            range.selectNodeContents(element);
            let currentPosition: number = 0;
            let endPosition: number = range.endOffset;
            while (currentPosition < endPosition) {
                range.setStart(element, currentPosition);
                range.setEnd(element, currentPosition + 1);
                let rangeBounds: ClientRect = range.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    let textContent: string = element.textContent;
                    let indices: number[] = [];
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
                    // tslint:disable-next-line:max-line-length
                    let startParent: HTMLElement = isNullOrUndefined(range.startContainer.parentElement) ? (range.startContainer.parentNode as HTMLElement) : range.startContainer.parentElement;
                    // tslint:disable-next-line:radix
                    this.selectionStartPage = parseInt(startParent.id.split('_text_')[1]);
                    if (isStoreSelection) {
                        // tslint:disable-next-line:max-line-length
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
                let range: Range = this.getSelectionRange(i, element);
                let rangeBounds: ClientRect = range.getBoundingClientRect();
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
        let range: Range = element.childNodes[index].ownerDocument.createRange();
        range.selectNodeContents(element.childNodes[index]);
        return range;
    }

    /**
     * @private
     */
    public selectEntireLine(event: MouseEvent): void {
        let textIds: string[] = [];
        let targetElement: HTMLElement = event.target as HTMLElement;
        let targetRect: ClientRect = targetElement.getBoundingClientRect();
        // tslint:disable-next-line
        let targetcentre: number = parseInt((targetRect.top + (targetRect.height / 2)).toString());
        // tslint:disable-next-line:radix
        let pageNumber: number = parseInt((event.target as HTMLElement).id.split('_text_')[1]);
        let textDivs: NodeList = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_text_' + pageNumber + '"]');
        if (targetElement.classList.contains('e-pv-text')) {
            this.pdfViewer.fireTextSelectionStart(pageNumber + 1);
            for (let i: number = 0; i < textDivs.length; i++) {
                let rect: ClientRect = (textDivs[i] as HTMLElement).getBoundingClientRect();
                // tslint:disable-next-line:radix
                let topValue: number = parseInt(rect.top.toString());
                // tslint:disable-next-line:radix
                let bottomValue: number = parseInt(rect.bottom.toString());
                if ((topValue <= targetcentre && bottomValue > targetcentre) && (targetRect.bottom + 10 > bottomValue)) {
                    let textId: string = (textDivs[i] as HTMLElement).id;
                    if (textId !== '') {
                        textIds.push(textId);
                    }
                }
            }
            let selection: Selection = window.getSelection();
            selection.removeAllRanges();
            let range: Range = document.createRange();
            let lengths: number = (textIds.length - 1);
            let d1: HTMLElement = document.getElementById(textIds[0]);
            let d2: HTMLElement = document.getElementById(textIds[lengths]);
            let childNodes: number = d2.childNodes.length;
            if (childNodes > 0) {
                range.setStart(d1.childNodes[0], 0);
                range.setEnd(d2.childNodes[0], d2.textContent.length);
            } else {
                range.setStart(d1.childNodes[0], 0);
                range.setEnd(d2, 1);
            }
            // tslint:disable-next-line:radix
            this.selectionStartPage = parseInt(range.startContainer.parentElement.id.split('_text_')[1]);
            selection.addRange(range);
            this.isTextSelection = true;
            if (selection != null && this.pdfViewer.contextMenuOption === 'MouseUp') {
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
        this.pdfViewerBase.viewerContainer.addEventListener('selectstart', () => { return true; });
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
                // tslint:disable-next-line:max-line-length
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
            this.pdfViewerBase.contextMenuModule.contextMenuObj.close();
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
        let viewerContainerLeft: number = this.pdfViewerBase.viewerContainer.getBoundingClientRect().left;
        if (this.dropDivElementLeft) {
            let elementClientRect: ClientRect = this.dropDivElementLeft.getBoundingClientRect();
            let dropElementHeight: number = 0;
            // tslint:disable-next-line:max-line-length
            let leftCurrentPagePosition: ClientRect = this.pdfViewerBase.getElement('_pageDiv_' + this.topStoreLeft.pageNumber).getBoundingClientRect();
            this.dropDivElementLeft.style.left = parseFloat(this.topStoreLeft.left.toString()) * this.pdfViewerBase.getZoomFactor() + leftCurrentPagePosition.left - viewerContainerLeft - (elementClientRect.width / 2) + 'px';
            if (this.topStoreLeft.isHeightNeeded) {
                dropElementHeight = (elementClientRect.height / 2) * this.pdfViewerBase.getZoomFactor();
            }
            // tslint:disable-next-line:max-line-length
            this.dropDivElementLeft.style.top = parseFloat(this.topStoreLeft.pageTop.toString()) * this.pdfViewerBase.getZoomFactor() + parseFloat(this.topStoreLeft.topClientValue.toString()) * this.pdfViewerBase.getZoomFactor() + dropElementHeight + 'px';
        }
        if (this.dropDivElementRight) {
            let elementClientRect: ClientRect = this.dropDivElementRight.getBoundingClientRect();
            let dropElementHeight: number = 0;
            // tslint:disable-next-line:max-line-length
            let rightCurrentPagePosition: ClientRect = this.pdfViewerBase.getElement('_pageDiv_' + this.topStoreRight.pageNumber).getBoundingClientRect();
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
    public textSelectionOnMouseup(event: MouseEvent): void {
        this.clear();
        if (window.getSelection().anchorNode !== null) {
            this.isMouseLeaveSelection = false;
            this.isSelectionStartTriggered = false;
            this.maintainSelectionOnZoom(true, false);
            this.fireTextSelectEnd();
            let isTextSearch: boolean = this.pdfViewerBase.textLayer.getTextSearchStatus();
            if (isTextSearch) {
                this.pdfViewerBase.textLayer.clearDivSelection();
                // tslint:disable-next-line
                let indexes: any = this.pdfViewer.textSearchModule.getIndexes();
                let lowerPageValue: number = parseFloat(indexes.lowerPageValue.toString());
                let higherPageValue: number = parseFloat(indexes.higherPageValue.toString());
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
            if (this.isTextSearched && this.pdfViewer.contextMenuOption === 'MouseUp') {
                this.calculateContextMenuPosition(event.clientY, event.clientX);
                this.isTextSearched = false;
            }
        } else {
            this.pdfViewerBase.textLayer.clearDivSelection();
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
    public fireTextSelectEnd(): void {
        if (this.selectionRangeArray.length !== 0) {
            let selectEndPageIndex: number = 0;
            let selectedText: string = '';
            // tslint:disable-next-line
            let selectedBounds: any[] = [];
            for (let k: number = 0; k < this.selectionRangeArray.length; k++) {
                selectedText += this.selectionRangeArray[k].textContent;
                for (let j: number = 0; j < this.selectionRangeArray[k].rectangleBounds.length; j++) {
                    let currentBound: IRectangle = this.selectionRangeArray[k].rectangleBounds[j];
                    // tslint:disable-next-line:max-line-length
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
     * @private
     */
    public maintainSelectionOnZoom(isMaintainSelection: boolean, isStich: boolean): void {
        let selection: Selection = window.getSelection();
        if (selection.type === 'Range' || (!selection.type && !selection.isCollapsed)) {
            let isBackward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            if (selection.anchorNode !== null) {
                // tslint:disable-next-line:radix
                let anchorPageId: number = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
                // tslint:disable-next-line:radix
                let focusPageId: number = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
                if (this.isTouchSelection && isNaN(focusPageId)) {
                    let focusElement: HTMLElement = selection.focusNode as HTMLElement;
                    if (focusElement === this.pdfViewerBase.pageContainer) {
                        let lastChildNode: HTMLElement = this.pdfViewerBase.pageContainer.lastChild as HTMLElement;
                        if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                            // tslint:disable-next-line:radix
                            focusPageId = parseInt((lastChildNode.previousSibling.previousSibling as HTMLElement).id.split('_pageDiv_')[1]);
                        } else if (lastChildNode.classList.contains('e-pv-page-div')) {
                            // tslint:disable-next-line:radix
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
     * @private
     */
    public isSelectionAvailableOnScroll(pageNumber: number): boolean {
        let isSelectionAvailable: boolean = false;
        let ranges: ISelection[] = this.selectionRangeArray;
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
     * @private
     */
    public applySelectionRangeOnScroll(pageNumber: number): void {
        if (this.isMouseLeaveSelection) {
            this.applySelectionMouseScroll(pageNumber);
        } else {
            this.applySelectionRange(pageNumber);
        }
    }

    // tslint:disable-next-line
    private getSelectionRangeFromArray(pageNumber: number): any {
        let isSelectionAvailable: boolean = false;
        let selectionRange: ISelection = null;
        let ranges: ISelection[] = this.selectionRangeArray;
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
        let selectionObject: { isSelectionAvailable: boolean, selectionRange: ISelection } = this.getSelectionRangeFromArray(pageNumber);
        let isSelectionAvailable: boolean = selectionObject.isSelectionAvailable;
        let textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        if (textLayer) {
            if (isSelectionAvailable && textLayer.childNodes.length !== 0) {
                let selectionRange: ISelection = selectionObject.selectionRange;
                let anchorOffsetDiv: number; let focusOffsetDiv: number; let anchorOffset: number; let focusOffset: number;
                if (selectionRange.isBackward) {
                    // tslint:disable-next-line:radix
                    let startId: number = parseInt(selectionRange.endNode.split('_text_')[1].split('_')[1]);
                    // tslint:disable-next-line:radix
                    let endId: number = parseInt(selectionRange.startNode.split('_text_')[1].split('_')[1]);
                    if (startId < endId) {
                        anchorOffsetDiv = startId;
                        anchorOffset = selectionRange.endOffset;
                        focusOffset = selectionRange.startOffset;
                        focusOffsetDiv = endId;
                    } else {
                        anchorOffsetDiv = endId;
                        anchorOffset = selectionRange.startOffset;
                        focusOffsetDiv = startId;
                        focusOffset = selectionRange.endOffset;
                    }
                } else {
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

    private applySelectionMouseScroll(pageNumber: number): void {
        let selectionObject: { isSelectionAvailable: boolean, selectionRange: ISelection } = this.getSelectionRangeFromArray(pageNumber);
        let isSelectionAvailable: boolean = selectionObject.isSelectionAvailable;
        if (isSelectionAvailable) {
            let selectionRange: ISelection = selectionObject.selectionRange;
            let selection: Selection = window.getSelection();
            let anchorNode: Node = document.getElementById(selectionRange.startNode).childNodes[0];
            let focusNode: Node = document.getElementById(selectionRange.endNode).childNodes[0];
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
                // tslint:disable-next-line
                let anchorPageIndex: number = isNaN(parseInt(selection.anchorNode.parentElement.id.split('_text_')[1])) ? parseInt((selection.anchorNode as HTMLElement).id.split('_pageDiv_')[1]) : parseInt(selection.anchorNode.parentElement.id.split('_text_')[1]);
                if (isNaN(anchorPageIndex)) {
                    // tslint:disable-next-line:radix
                    anchorPageIndex = parseInt((selection.anchorNode as HTMLElement).id.split('_text_')[1]);
                }
                // tslint:disable-next-line
                let focusPageIndex: number = isNaN(parseInt(selection.focusNode.parentElement.id.split('_text_')[1])) ? parseInt((selection.focusNode as HTMLElement).id.split('_pageDiv_')[1]) : parseInt(selection.focusNode.parentElement.id.split('_text_')[1]);
                // tslint:disable-next-line:radix
                let currentAnchorIndex: number = parseInt(selectionRange.startNode.split('_text_')[1]);
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
                        // tslint:disable-next-line:max-line-length
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
                        let isBackward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
                        // tslint:disable-next-line:max-line-length
                        if (anchorPageIndex > currentAnchorIndex && currentAnchorIndex > focusPageIndex && anchorPageIndex !== focusPageIndex) {
                            if (!isBackward) {
                                range.setStart(selection.anchorNode, selection.anchorOffset);
                                range.setEnd(selection.focusNode, selection.focusOffset);
                            } else {
                                selection.extend(selection.focusNode, selection.focusOffset);
                            }
                            // tslint:disable-next-line:max-line-length
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
                            // tslint:disable-next-line:radix
                            let currentAnchorOffset: number = parseInt(selectionRange.startNode.split('_' + currentAnchorIndex + '_')[1]);
                            // tslint:disable-next-line:radix
                            let currentFocusOffset: number = parseInt(selectionRange.endNode.split('_' + currentAnchorIndex + '_')[1]);
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
     * @private
     */
    public maintainSelectionOnScroll(pageNumber: number, isStich: boolean): void {
        let isSelectionAvailable: boolean = this.isSelectionAvailableOnScroll(pageNumber);
        if (this.isTextSelection && !isSelectionAvailable) {
            this.maintainSelection(pageNumber, isStich);
        }
    }

    /**
     * @private
     */
    public maintainSelection(pageNumber: number, isStich: boolean): void {
        let selection: Selection = window.getSelection();
        if (this.isTextSelection && (selection.type === 'Range' || (!selection.type && !selection.isCollapsed))) {
            // tslint:disable-next-line
            let anchorPageId: number = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
            // tslint:disable-next-line
            let focusPageId: number = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
            if (isNaN(focusPageId) && selection.anchorNode !== null) {
                let backward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
                if (!backward) {
                    // tslint:disable-next-line:radix
                    let lastChildNode: HTMLElement = this.pdfViewerBase.pageContainer.lastChild as HTMLElement;
                    if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                        // tslint:disable-next-line:radix
                        focusPageId = parseInt((lastChildNode.previousSibling.previousSibling as HTMLElement).id.split('_pageDiv_')[1]);
                    } else {
                        // tslint:disable-next-line:radix
                        focusPageId = parseInt(lastChildNode.id.split('_pageDiv_')[1]);
                    }
                } else {
                    // tslint:disable-next-line:radix
                    focusPageId = parseInt((this.pdfViewerBase.pageContainer.firstChild as HTMLElement).id.split('_pageDiv_')[1]);
                }
            }
            let backward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            if (this.isTouchSelection && pageNumber > focusPageId && pageNumber > anchorPageId) {
                return;
            }
            if (anchorPageId === focusPageId) {
                let selectionObject: ISelection = null;
                let selectionBounds: IRectangle = this.getSelectionBounds(selection.getRangeAt(0), pageNumber);
                let selectionRectBounds: IRectangle[] = this.getSelectionRectangleBounds(selection.getRangeAt(0), pageNumber);
                // tslint:disable-next-line:max-line-length
                let anchorOffsetValue: number = (this.getNodeElementFromNode(selection.anchorNode).childNodes.length === 1) ? selection.anchorOffset : this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                let focusOffsetValue: number = (this.getNodeElementFromNode(selection.focusNode).childNodes.length === 1) ? selection.focusOffset : this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                selectionObject = {
                    isBackward: backward, startNode: this.getNodeElementFromNode(selection.anchorNode).id,
                    startOffset: anchorOffsetValue, endNode: this.getNodeElementFromNode(selection.focusNode).id,
                    // tslint:disable-next-line:max-line-length
                    endOffset: focusOffsetValue, textContent: selection.toString(), pageNumber: pageNumber, bound: selectionBounds, rectangleBounds: selectionRectBounds
                };
                this.pushSelectionRangeObject(selectionObject, pageNumber);
            } else {
                let selectionObject: ISelection = this.createRangeObjectOnScroll(pageNumber, anchorPageId, focusPageId);
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
        let parentElement: HTMLElement = this.getNodeElementFromNode(node);
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
            let currentObject: ISelection[] = this.selectionRangeArray.filter(
                // tslint:disable-next-line
                obj => {
                    return (obj.pageNumber === pageNumber);
                });
            if (currentObject.length > 0) {
                let currentObjectIndex: number = this.selectionRangeArray.indexOf(currentObject[0]);
                this.selectionRangeArray.splice(currentObjectIndex, 1, selectionObject);
                return;
            }
        }
        let nextPageObject: ISelection[] = this.selectionRangeArray.filter(
            // tslint:disable-next-line
            obj => {
                return (obj.pageNumber === (pageNumber + 1));
            });
        if (nextPageObject.length === 0) {
            if (this.isTouchSelection && this.selectionRangeArray.length !== 0) {
                let prevPageObject: ISelection[] = this.selectionRangeArray.filter(
                    // tslint:disable-next-line
                    obj => {
                        return (obj.pageNumber === (pageNumber - 1));
                    });
                if (prevPageObject.length !== 0) {
                    let prevIndex: number = this.selectionRangeArray.indexOf(prevPageObject[0]);
                    this.selectionRangeArray.splice(prevIndex + 1, 0, selectionObject);
                } else {
                    let firstObject: ISelection = this.selectionRangeArray[0];
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
            let index: number = this.selectionRangeArray.indexOf(nextPageObject[0]);
            this.selectionRangeArray.splice(index, 0, selectionObject);
        }
    }

    private extendCurrentSelection(element: HTMLElement, offset: number, selection: Selection, range: Range): void {
        let currentFocusOffset: number = selection.focusOffset;
        let currentFocusElement: string = selection.focusNode.parentElement.id;
        // tslint:disable-next-line
        let focusPageId: number = isNaN(parseInt(currentFocusElement.split('_text_')[1])) ? parseInt((selection.focusNode as HTMLElement).id.split('_pageDiv_')[1]) : parseInt(currentFocusElement.split('_text_')[1]);
        // tslint:disable-next-line:radix
        if (isNaN(parseInt(currentFocusElement.split('_text_')[1]))) {
            // tslint:disable-next-line
            currentFocusElement = (this.pdfViewerBase.getElement('_textLayer_' + (focusPageId + 1)).firstChild as HTMLElement).id;
        }
        range.setStart(element.childNodes[0], offset);
        range.setEnd(element.childNodes[0], offset);
        selection.removeAllRanges();
        selection.addRange(range);
        selection.extend(document.getElementById(currentFocusElement).childNodes[0], currentFocusOffset);
    }

    private stichSelection(backward: boolean, selection: Selection, pageNumber: number): void {
        let range: Range = document.createRange();
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
                let lastElement: HTMLElement = nextPageElement.firstChild as HTMLElement;
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
     * @private
     */
    public textSelectionOnMouseWheel(currentPageNumber: number): void {
        this.isMouseLeaveSelection = true;
        this.stichSelectionOnScroll(currentPageNumber);
    }

    /**
     * @private
     */
    public stichSelectionOnScroll(currentPageNumber: number): void {
        let selection: Selection = window.getSelection();
        if (this.isTextSelection) {
            // tslint:disable-next-line:radix
            let anchorPageId: number = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
            // tslint:disable-next-line:radix
            let focusPageId: number = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
            let nextPageElement: HTMLElement;
            if (anchorPageId !== currentPageNumber && focusPageId !== currentPageNumber) {
                let backward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
                if (!backward) {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (currentPageNumber - 1));
                    if (nextPageElement) {
                        let lastElement: HTMLElement = nextPageElement.lastChild as HTMLElement;
                        if (lastElement) {
                            if (lastElement.childNodes[0]) {
                                this.extendSelectionStich(lastElement.childNodes[0], this.getTextLastLength(lastElement), selection);
                            } else {
                                this.extendSelectionStich(lastElement, this.getTextLastLength(lastElement), selection);
                            }
                        } else {
                            nextPageElement = this.pdfViewerBase.getElement('_textLayer_' + currentPageNumber);
                            let lastElement: HTMLElement = nextPageElement.firstChild as HTMLElement;
                            this.extendSelectionStich(lastElement.childNodes[0], 0, selection);
                        }
                    }
                } else {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (currentPageNumber - 1));
                    if (nextPageElement) {
                        let lastElement: HTMLElement = nextPageElement.firstChild as HTMLElement;
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
     * @private
     */
    public createRangeObjectOnScroll(pageNumber: number, anchorPageId: number, focusPageId: number): ISelection {
        let selectionObject: ISelection = null;
        let selection: Selection = window.getSelection();
        if (selection.anchorNode !== null) {
            let backward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            let firstElement: HTMLElement;
            let lastElement: HTMLElement;
            let startOffset: number;
            let endOffset: number;
            let element: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
            if (element.childNodes) {
                if (!backward) {
                    if (pageNumber === anchorPageId) {
                        firstElement = this.getNodeElementFromNode(selection.anchorNode);
                        // tslint:disable-next-line:max-line-length
                        lastElement = (element.lastChild as HTMLElement);
                        startOffset = this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                        endOffset = this.getTextLastLength(lastElement);
                    } else if (pageNumber > anchorPageId && pageNumber < focusPageId) {
                        // tslint:disable-next-line:max-line-length
                        firstElement = (element.firstChild as HTMLElement);
                        // tslint:disable-next-line:max-line-length
                        lastElement = (element.lastChild as HTMLElement);
                        startOffset = 0;
                        endOffset = this.getTextLastLength(lastElement);
                    } else if (pageNumber === focusPageId) {
                        // tslint:disable-next-line:max-line-length
                        firstElement = (element.firstChild as HTMLElement);
                        let pageNumberIndex: number = this.getNodeElementFromNode(selection.focusNode).id.indexOf(focusPageId.toString());
                        if (pageNumberIndex !== -1) {
                            lastElement = this.getNodeElementFromNode(selection.focusNode);
                            endOffset = this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                        } else {
                            // tslint:disable-next-line:max-line-length
                            lastElement = (document.getElementById(this.pdfViewer.element.id + '_textLayer_' + focusPageId).lastChild as HTMLElement);
                            endOffset = this.getTextLastLength(lastElement);
                        }
                        startOffset = 0;
                    }
                } else {
                    if (pageNumber === anchorPageId) {
                        firstElement = this.getNodeElementFromNode(selection.anchorNode);
                        // tslint:disable-next-line:max-line-length
                        lastElement = (element.firstChild as HTMLElement);
                        startOffset = this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                        endOffset = 0;
                    } else if (pageNumber < anchorPageId && pageNumber > focusPageId) {
                        // tslint:disable-next-line:max-line-length
                        firstElement = (element.firstChild as HTMLElement);
                        // tslint:disable-next-line:max-line-length
                        lastElement = (element.lastChild as HTMLElement);
                        startOffset = 0;
                        endOffset = this.getTextLastLength(lastElement);
                    } else if (pageNumber === focusPageId) {
                        firstElement = this.getNodeElementFromNode(selection.focusNode);
                        // tslint:disable-next-line:max-line-length
                        lastElement = (element.lastChild as HTMLElement);
                        startOffset = this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                        endOffset = this.getTextLastLength(lastElement);
                    }
                }
                if (firstElement && lastElement) {
                    // tslint:disable-next-line:max-line-length
                    let selectionRangeObject: Range = this.getSelectionRangeObject(firstElement.id, startOffset, lastElement.id, endOffset, pageNumber);
                    let selectionString: string = selectionRangeObject.toString();
                    let selectionBound: IRectangle = this.getSelectionBounds(selectionRangeObject, pageNumber);
                    let selectionRectBounds: IRectangle[] = this.getSelectionRectangleBounds(selectionRangeObject, pageNumber);
                    // tslint:disable-next-line:max-line-length
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
        // tslint:disable-next-line:radix
        let currentAnchorOffset: number = parseInt(startNode.split('_' + pageNumber + '_')[1]);
        // tslint:disable-next-line:radix
        let currentFocusOffset: number = parseInt(endNode.split('_' + pageNumber + '_')[1]);
        let range: Range = document.createRange();
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
        let startElement: HTMLElement = this.getNodeElementFromNode(range.startContainer);
        let endElement: HTMLElement = this.getNodeElementFromNode(range.endContainer);
        let bounds: IRectangle = null;
        if (startElement !== endElement) {
            let newStartRange: Range = document.createRange();
            // tslint:disable-next-line:max-line-length
            let startRange: Range = this.createRangeForSelection(range.startContainer, range.endContainer, range.startOffset, range.endOffset, newStartRange);
            bounds = this.normalizeBounds(startRange.getBoundingClientRect(), pageNumber);
        } else {
            bounds = this.normalizeBounds(range.getBoundingClientRect(), pageNumber);
        }
        return bounds;
    }

    private getSelectionRectangleBounds(range: Range, pageNumber: number): IRectangle[] {
        let selectionBounds: IRectangle[] = [];
        let startElement: HTMLElement = this.getNodeElementFromNode(range.startContainer);
        let endElement: HTMLElement = this.getNodeElementFromNode(range.endContainer);
        let bounds: IRectangle = null;
        if (startElement !== endElement) {
            let startOffset: number = 0; let endOffset: number = 0; let currentId: number = 0;
            let anchorPageId: number = this.pdfViewerBase.textLayer.getPageIndex(range.startContainer);
            let anchorTextId: number = this.pdfViewerBase.textLayer.getTextIndex(range.startContainer, anchorPageId);
            let focusPageId: number = this.pdfViewerBase.textLayer.getPageIndex(range.endContainer);
            let focusTextId: number = this.pdfViewerBase.textLayer.getTextIndex(range.endContainer, focusPageId);
            let textDivs: NodeList = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).childNodes;
            if (pageNumber === anchorPageId) {
                currentId = anchorTextId;
            } else {
                currentId = 0;
            }
            for (let j: number = currentId; j < textDivs.length; j++) {
                let textElement: HTMLElement = textDivs[j] as HTMLElement;
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
                let newRange: Range = document.createRange();
                for (let k: number = 0; k < textElement.childNodes.length; k++) {
                    let node: Node = textElement.childNodes[k];
                    newRange.setStart(node, startOffset);
                    newRange.setEnd(node, endOffset);
                }
                let boundingRect: IRectangle = this.normalizeBounds(newRange.getBoundingClientRect(), pageNumber);
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
        let index: number = elementId.lastIndexOf('_');
        let divId: string = elementId.substring(index + 1, elementId.length);
        // tslint:disable-next-line:radix
        return parseInt(divId);
    }

    private normalizeBounds(bound: ClientRect, pageNumber: number): IRectangle {
        let newBounds: IRectangle = null;
        let currentPageElement: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + pageNumber);
        let currentPageRect: ClientRect = currentPageElement.getBoundingClientRect();
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
     * @private
     */
    public getCurrentSelectionBounds(pageNumber: number): IRectangle {
        let bound: IRectangle = null;
        let ranges: ISelection[] = this.selectionRangeArray;
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
            let selection: Selection = window.getSelection();
            let isBackward: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            // tslint:disable-next-line
            let anchorPage: number = isNaN(parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1])) ? parseInt((selection.anchorNode as HTMLElement).id.split('_pageDiv_')[1]) : parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
            if (isNaN(anchorPage)) {
                // tslint:disable-next-line:radix
                anchorPage = parseInt((selection.anchorNode as HTMLElement).id.split('_text_')[1]);
            }
            // tslint:disable-next-line
            let focusPage: number = isNaN(parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1])) ? parseInt((selection.focusNode as HTMLElement).id.split('_pageDiv_')[1]) : parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
            if (isNaN(focusPage)) {
                // tslint:disable-next-line
                focusPage = isNaN(parseInt((selection.focusNode as HTMLElement).id.split('_text_')[1])) ? parseInt((selection.focusNode as HTMLElement).id.split('_textLayer_')[1]) : parseInt((selection.focusNode as HTMLElement).id.split('_text_')[1]);
            }
            let arrayObject: ISelection[] = [];
            if (!isBackward) {
                arrayObject = this.selectionRangeArray.filter(
                    // tslint:disable-next-line
                    obj => {
                        return (!((this.selectionStartPage <= obj.pageNumber) && (obj.pageNumber < focusPage)));
                    });
            } else {
                arrayObject = this.selectionRangeArray.filter(
                    // tslint:disable-next-line
                    obj => {
                        return (!((focusPage < obj.pageNumber) && (obj.pageNumber <= this.selectionStartPage)));
                    });
            }
            if (arrayObject.length > 0) {
                for (let i: number = 0; i < arrayObject.length; i++) {
                    let indexInArray: number = this.selectionRangeArray.indexOf(arrayObject[i]);
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
    public applySpanForSelection(): void {
        let selection: Selection = window.getSelection();
        // tslint:disable-next-line:max-line-length
        if (selection.anchorNode === selection.focusNode && selection.anchorOffset === selection.focusOffset && !selection.isCollapsed) {
            selection.removeAllRanges();
        }
        // tslint:disable-next-line:max-line-length
        if (selection.anchorNode !== null && this.pdfViewerBase.viewerContainer.contains(this.getNodeElementFromNode(selection.anchorNode))) {
            let isBackWardSelection: boolean = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            let anchorPageId: number; let focusPageId: number; let anchorOffsetDiv: number; let focusOffsetDiv: number;
            let anchorOffset: number; let focusOffset: number;
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
            } else {
                let anchorElement: HTMLElement = this.getNodeElementFromNode(selection.anchorNode);
                let focusElement: HTMLElement = this.getNodeElementFromNode(selection.focusNode);
                // tslint:disable-next-line
                anchorPageId = (anchorElement.id.indexOf('text_') !== -1) ? parseInt(anchorElement.id.split('text_')[1]) : parseInt(anchorElement.id.split('_textLayer_')[1]);
                // tslint:disable-next-line
                focusPageId = (focusElement.id.indexOf('text_') !== -1) ? parseInt(focusElement.id.split('text_')[1]) : parseInt(focusElement.id.split('_textLayer_')[1]);
                let isFocusChanged: boolean = false;
                if (this.isTouchSelection) {
                    if ((selection.focusNode as HTMLElement) === this.pdfViewerBase.pageContainer) {
                        let lastChildNode: HTMLElement = this.pdfViewerBase.pageContainer.lastChild as HTMLElement;
                        if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                            let lastPageDiv: HTMLElement = lastChildNode.previousSibling.previousSibling as HTMLElement;
                            // tslint:disable-next-line:radix
                            focusPageId = parseInt(lastPageDiv.id.split('_pageDiv_')[1]);
                            focusElement = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).lastChild as HTMLElement;
                            isFocusChanged = true;
                        } else if (lastChildNode.classList.contains('e-pv-page-div')) {
                            let lastPageDiv: HTMLElement = lastChildNode as HTMLElement;
                            // tslint:disable-next-line:radix
                            focusPageId = parseInt(lastPageDiv.id.split('_pageDiv_')[1]);
                            focusElement = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).lastChild as HTMLElement;
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
            if (this.pdfViewerBase.checkIsNormalText()) {
                selection.removeAllRanges();
                this.pdfViewerBase.textLayer.clearDivSelection();
                // tslint:disable-next-line:max-line-length
                this.pdfViewerBase.textLayer.applySpanForSelection(anchorPageId, focusPageId, anchorOffsetDiv, focusOffsetDiv, anchorOffset, focusOffset);
            }
            if (this.pdfViewer.textSearchModule) {
                this.pdfViewer.textSearchModule.searchAfterSelection();
            }
        }
    }

    /**
     * @private
     */
    public initiateTouchSelection(event: TouchEvent, x: number, y: number): void {
        if (this.pdfViewerBase.isShapeBasedAnnotationsEnabled()) {
            if (this.pdfViewer.selectedItems.annotations.length > 0) {
                this.pdfViewer.clearSelection(this.pdfViewer.selectedItems.annotations[0].pageIndex);
            }
        }
        // tslint:disable-next-line
        let element: any = event.target;
        let belowElements: Element[] = document.elementsFromPoint(event.touches[0].clientX, event.touches[0].clientY);
        if (belowElements.length !== 0) {
            if (belowElements[0].classList.contains('e-pv-hyperlink') && belowElements[1].classList.contains('e-pv-text')) {
                element = belowElements[1];
            }
        }
        let pageNumber: number = parseFloat(element.id.split('_')[2]);
        this.pdfViewer.fireTextSelectionStart(pageNumber + 1);
        this.selectAWord(element, x, y, true);
        this.createTouchSelectElement(event);
        this.maintainSelectionOnZoom(true, false);
        this.fireTextSelectEnd();
        this.applySpanForSelection();
    }

    // tslint:disable-next-line
    private selectTextByTouch(element: any, x: number, y: number, isForwardSelection: boolean, target: string, isCloserMovement: boolean): boolean {
        let isTextSelected: boolean = false;
        if (element.nodeType === element.TEXT_NODE) {
            let rangeObject: Range = element.ownerDocument.createRange();
            let selection: Selection = window.getSelection();
            rangeObject.selectNodeContents(element);
            let currentPosition: number = 0;
            let endPosition: number = rangeObject.endOffset;
            while (currentPosition < endPosition) {
                rangeObject.setStart(element, currentPosition);
                rangeObject.setEnd(element, currentPosition + 1);
                let rangeBounds: ClientRect = rangeObject.getBoundingClientRect();
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
        } else {
            for (let i: number = 0; i < element.childNodes.length; i++) {
                let range: Range = element.childNodes[i].ownerDocument.createRange();
                range.selectNodeContents(element.childNodes[i]);
                let rangeBounds: ClientRect = range.getBoundingClientRect();
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

    // tslint:disable-next-line
    private setTouchSelectionStartPosition(selection: Selection, range: Range, isForwardSelection: boolean, target: string, element: any, currentPosition: number, isCloserMovement: boolean): Range {
        if (isForwardSelection) {
            if (target === 'left') {
                // tslint:disable-next-line
                let startNode: any = this.getTouchFocusElement(selection, true);
                range.setStart(startNode.focusNode, startNode.focusOffset);
                range.setEnd(element, currentPosition);
                this.selectionAnchorTouch = { anchorNode: range.endContainer.parentElement.id, anchorOffset: range.endOffset };
            } else if (target === 'right') {
                // tslint:disable-next-line
                let startNode: any = this.getTouchAnchorElement(selection, false);
                range.setStart(startNode.anchorNode, startNode.anchorOffset);
                range.setEnd(element, currentPosition);
                this.selectionFocusTouch = { focusNode: range.endContainer.parentElement.id, focusOffset: range.endOffset };
            }
        } else {
            if (target === 'left') {
                if (!isCloserMovement) {
                    // tslint:disable-next-line
                    let startNode: any = this.getTouchFocusElement(selection, false);
                    range.setStart(element, currentPosition);
                    // tslint:disable-next-line:radix
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
                // tslint:disable-next-line
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
        let element: HTMLElement = document.getElementById(this.selectionAnchorTouch.anchorNode.toString());
        let startNode: Node = null;
        let offset: number = 0;
        if (element) {
            startNode = element.childNodes[0];
            // tslint:disable-next-line:radix
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
        let element: HTMLElement = document.getElementById(this.selectionFocusTouch.focusNode.toString());
        let startNode: Node = null;
        let offset: number = 0;
        if (element) {
            startNode = element.childNodes[0];
            // tslint:disable-next-line:radix
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
        let selection: Selection = window.getSelection();
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
            let range: Range = selection.getRangeAt(0);
            let rangePosition: ClientRect = range.getBoundingClientRect();
            let dropElementRect: ClientRect = this.dropDivElementLeft.getBoundingClientRect();
            // tslint:disable-next-line:max-line-length
            let pageTopValue: number = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
            let viewerLeftPosition: number = this.pdfViewerBase.viewerContainer.getBoundingClientRect().left;
            let topClientValue: number = this.getClientValueTop(rangePosition.top, this.pdfViewerBase.currentPageNumber - 1);
            // tslint:disable-next-line:max-line-length
            let topPositionValue: string = topClientValue + pageTopValue * this.pdfViewerBase.getZoomFactor() + (dropElementRect.height / 2) * this.pdfViewerBase.getZoomFactor() + 'px';
            this.dropDivElementLeft.style.top = topPositionValue;
            this.dropDivElementLeft.style.left = rangePosition.left - (viewerLeftPosition + (dropElementRect.width)) + 'px';
            this.dropDivElementRight.style.top = topPositionValue;
            // tslint:disable-next-line:max-line-length
            this.dropDivElementRight.style.left = rangePosition.left + rangePosition.width - viewerLeftPosition + 'px';
            let currentPageLeft: number = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
            let currentRangeLeft: number = rangePosition.left - currentPageLeft;
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
    /**
     * @private
     */
    // tslint:disable-next-line
    public calculateContextMenuPosition(top: any, left: any): any {
        top = top - this.pdfViewerBase.toolbarHeight;
        if (Browser.isDevice) {
            // tslint:disable-next-line
            let contextTop: any = top - this.contextMenuHeight;
            if (contextTop < this.pdfViewerBase.toolbarHeight) {
                top = top + this.contextMenuHeight;
            } else {
                top = contextTop;
            }
        }
        if (this.pdfViewer.contextMenuOption === 'MouseUp') {
            left = left - 50;
        }
        // tslint:disable-next-line:max-line-length
        this.pdfViewerBase.contextMenuModule.contextMenuObj.open(top, left - this.pdfViewerBase.viewerContainer.clientLeft, this.pdfViewerBase.viewerContainer);
    }
    private onLeftTouchSelectElementTouchStart = (event: TouchEvent): void => {
        this.initiateSelectionByTouch();
    }

    private onRightTouchSelectElementTouchStart = (event: TouchEvent): void => {
        this.initiateSelectionByTouch();
    }

    private onLeftTouchSelectElementTouchEnd = (event: TouchEvent): void => {
        this.terminateSelectionByTouch(event);
    }

    private onRightTouchSelectElementTouchEnd = (event: TouchEvent): void => {
        this.terminateSelectionByTouch(event);
    }
    /**
     * @private
     */
    public initiateSelectionByTouch(): void {
        this.pdfViewerBase.textLayer.clearDivSelection();
        this.pdfViewerBase.contextMenuModule.contextMenuObj.close();
        let lowerPageIndex: number = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageIndex = (lowerPageIndex < 0) ? 0 : lowerPageIndex;
        let higherPageIndex: number = this.pdfViewer.currentPageNumber + 1;
        // tslint:disable-next-line:max-line-length
        higherPageIndex = (higherPageIndex < (this.pdfViewerBase.pageCount - 1)) ? higherPageIndex : (this.pdfViewerBase.pageCount - 1);
        for (let i: number = lowerPageIndex; i <= higherPageIndex; i++) {
            let textLayer: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + i);
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

    // tslint:disable-next-line
    private terminateSelectionByTouch(event: any): void {
        this.maintainSelectionOnZoom(true, false);
        this.applySpanForSelection();
        if (this.pdfViewerBase.getTextMarkupAnnotationMode()) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
        } else {
            this.fireTextSelectEnd();
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.contextMenuModule.contextMenuObj.open(event.changedTouches[0].clientY - this.pdfViewerBase.viewerContainer.offsetTop + this.pdfViewerBase.contextMenuModule.contextMenuElement.clientHeight, event.changedTouches[0].clientX - this.pdfViewerBase.viewerContainer.offsetLeft, this.pdfViewerBase.viewerContainer);
        }
    }

    private onLeftTouchSelectElementTouchMove = (event: TouchEvent): void => {
        let range: Range;
        let nodeElement: Node;
        event.preventDefault();
        (event.target as HTMLElement).style.zIndex = '0';
        let rightElement: HTMLElement = this.dropDivElementRight;
        let isTouchedWithinViewerContainer: boolean = this.isTouchedWithinContainer(event);
        if (rightElement && isTouchedWithinViewerContainer) {
            let dropBounds: ClientRect = rightElement.getBoundingClientRect();
            let xTouch: number = event.changedTouches[0].clientX;
            let yTouch: number = event.changedTouches[0].clientY;
            (event.target as HTMLElement).style.zIndex = '1000';
            nodeElement = this.getNodeElement(range, xTouch, yTouch, event, nodeElement);
            if (nodeElement) {
                // tslint:disable-next-line:max-line-length
                let currentDifference: number = Math.sqrt((yTouch - dropBounds.top) * (yTouch - dropBounds.top) + (xTouch - dropBounds.left) * (xTouch - dropBounds.left));
                let isCloserMovement: boolean = this.isCloserTouchScroll(currentDifference);
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
                    let elementClientRect: ClientRect = this.dropDivElementLeft.getBoundingClientRect();
                    let pageTopValue: number = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
                    let topClientValue: number = this.getClientValueTop(yTouch, this.pdfViewerBase.currentPageNumber - 1);
                    // tslint:disable-next-line:max-line-length
                    let currentPageLeft: number = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
                    let currentRangeLeft: number = xTouch - currentPageLeft;
                    // tslint:disable-next-line:max-line-length
                    this.dropDivElementLeft.style.top = pageTopValue * this.pdfViewerBase.getZoomFactor() + topClientValue + 'px';
                    this.topStoreLeft = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue), pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft), isHeightNeeded: false };
                    // tslint:disable-next-line:max-line-length
                    this.dropDivElementLeft.style.left = xTouch - this.pdfViewerBase.viewerContainer.getBoundingClientRect().left - (elementClientRect.width / 2) + 'px';
                    this.previousScrollDifference = currentDifference;
                }
            }
        }
    }

    // tslint:disable-next-line
    private onRightTouchSelectElementTouchMove = (event: TouchEvent): void => {
        let range: Range;
        let nodeElement: Node;
        event.preventDefault();
        (event.target as HTMLElement).style.zIndex = '0';
        let leftElement: HTMLElement = this.dropDivElementLeft;
        let isTouchedWithinViewerContainer: boolean = this.isTouchedWithinContainer(event);
        if (leftElement && isTouchedWithinViewerContainer) {
            let dropPosition: ClientRect = leftElement.getBoundingClientRect();
            let touchX: number = event.changedTouches[0].clientX;
            let touchY: number = event.changedTouches[0].clientY;
            (event.target as HTMLElement).style.zIndex = '1000';
            nodeElement = this.getNodeElement(range, touchX, touchY, event, nodeElement);
            if (nodeElement) {
                // tslint:disable-next-line:max-line-length
                let currentDifference: number = Math.sqrt((touchY - dropPosition.top) * (touchY - dropPosition.top) + (touchX - dropPosition.left) * (touchX - dropPosition.left));
                let isCloserMovement: boolean = this.isCloserTouchScroll(currentDifference);
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
                    let pageTopValue: number = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
                    let topClientValue: number = this.getClientValueTop(touchY, this.pdfViewerBase.currentPageNumber - 1);
                    let elementClientRect: ClientRect = this.dropDivElementRight.getBoundingClientRect();
                    this.dropDivElementRight.style.top = pageTopValue * this.pdfViewerBase.getZoomFactor() + topClientValue + 'px';
                    // tslint:disable-next-line:max-line-length
                    let currentPageLeft: number = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
                    let currentRangeLeft: number = touchX - currentPageLeft;
                    // tslint:disable-next-line:max-line-length
                    this.topStoreRight = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue), pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft), isHeightNeeded: false };
                    // tslint:disable-next-line:max-line-length
                    this.dropDivElementRight.style.left = touchX - this.pdfViewerBase.viewerContainer.getBoundingClientRect().left - (elementClientRect.width / 2) + 'px';
                    this.previousScrollDifference = currentDifference;
                }
            }
        }
    }

    private getNodeElement(range: Range, touchX: number, touchY: number, event: TouchEvent, nodeElement: Node): Node {
        if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(touchX, touchY);
            nodeElement = this.onTouchElementScroll(range, nodeElement, touchY, event);
            // tslint:disable-next-line
        } else if ((document as any).caretPositionFromPoint) {
            // tslint:disable-next-line
            let start: any = (document as any).caretPositionFromPoint(touchX, touchY);
            // tslint:disable-next-line
            let end: any = (document as any).caretPositionFromPoint(touchX, touchY);
            range = document.createRange();
            range.setStart(start.offsetNode, start.offset);
            range.setEnd(end.offsetNode, end.offset);
            nodeElement = this.onTouchElementScroll(range, nodeElement, touchY, event);
        }
        return nodeElement;
    }

    private isTouchedWithinContainer(event: TouchEvent): boolean {
        let elements: Element[] = document.elementsFromPoint(event.touches[0].clientX, event.touches[0].clientY);
        let isTouchedWithinContainer: boolean = false;
        if (elements.length !== 0) {
            isTouchedWithinContainer = true;
        }
        return isTouchedWithinContainer;
    }

    private onTouchElementScroll(range: Range, nodeElement: Node, touchY: number, event: TouchEvent): Node {
        let viewerScrollTop: number = this.pdfViewerBase.viewerContainer.scrollTop;
        if (range != null) {
            nodeElement = range.startContainer;
            let isScrollBar: boolean = this.isScrolledOnScrollBar(event);
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
            // tslint:disable-next-line:max-line-length
            return clientValue - this.pdfViewerBase.getElement('_pageDiv_' + pageNumber).getBoundingClientRect().top;
        } else {
            return clientValue;
        }
    }

    private isScrolledOnScrollBar(event: TouchEvent): boolean {
        let isScrollBar: boolean = false;
        // tslint:disable-next-line:max-line-length
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
     * @private
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
            let textArea: HTMLElement = document.createElement('textarea');
            textArea.contentEditable = 'true';
            textArea.textContent = selectionText;
            // tslint:disable-next-line:max-line-length
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