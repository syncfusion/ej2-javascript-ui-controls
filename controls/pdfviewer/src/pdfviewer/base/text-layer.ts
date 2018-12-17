import { createElement } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { PdfViewer, PdfViewerBase } from '../index';

/**
 * TextLayer module is used to handle the text content on the control.
 * @hidden
 */
export class TextLayer {

    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private notifyDialog: Dialog;
    // tslint:disable-next-line
    private textBoundsArray: any[] = [];
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
    public addTextLayer(pageNumber: number, pageWidth: number, pageHeight: number, pageDiv: HTMLElement): void {
        let textDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        if (!textDiv) {
            // tslint:disable-next-line:max-line-length
            let textLayer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_textLayer_' + pageNumber, className: 'e-pv-text-layer' });
            textLayer.style.width = pageWidth + 'px';
            textLayer.style.height = pageHeight + 'px';
            pageDiv.appendChild(textLayer);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line
    public renderTextContents(pageNumber: number, textContents: any, textBounds: any): void {
        let textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        let canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageNumber);
        if (canvasElement && textLayer.childNodes.length === 0) {
            for (let i: number = 0; i < textContents.length; i++) {
                // tslint:disable-next-line
                let bounds: any = textBounds[i];
                // tslint:disable-next-line:max-line-length
                let textDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_text_' + pageNumber + '_' + i, className: 'e-pv-text' });
                let textContent: string = textContents[i];
                textContent = textContent.replace(/</g, '&lt;');
                textContent = textContent.replace(/>/g, '&gt;');
                textDiv.innerHTML = textContent.replace(/&nbsp;/g, ' ');
                // tslint:disable-next-line
                let newLine: string = textContents[i].replace(/  +/g, ' ');
                if (newLine !== ' ') {
                    textDiv.style.whiteSpace = 'pre';
                }
                this.setStyleToTextDiv(textDiv, bounds.X, bounds.Y, bounds.Bottom, bounds.Width, bounds.Height, bounds);
                this.setTextElementProperties(textDiv);
                let context: CanvasRenderingContext2D = (canvasElement as HTMLCanvasElement).getContext('2d');
                context.font = textDiv.style.fontSize + ' ' + textDiv.style.fontFamily;
                let contextWidth: number = context.measureText(textContents[i].replace(/(\r\n|\n|\r)/gm, '')).width;
                let scale: number = bounds.Width * this.pdfViewerBase.getZoomFactor() / contextWidth;
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
    public resizeTextContents(pageNumber: number, textContents: any, textBounds: any): void {
        let textLayer: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + pageNumber);
        let canvasElement: HTMLElement = this.pdfViewerBase.getElement('_pageCanvas_' + pageNumber);
        if (canvasElement) {
            for (let i: number = 0; i < textLayer.childNodes.length; i++) {
                // tslint:disable-next-line
                let bounds: any;
                let textDiv: HTMLElement = this.pdfViewerBase.getElement('_text_' + pageNumber + '_' + i);
                if (textBounds) {
                    bounds = textBounds[i];
                    this.setStyleToTextDiv(textDiv, bounds.X, bounds.Y, bounds.Bottom, bounds.Width, bounds.Height, textBounds);
                }
                this.setTextElementProperties(textDiv);
                let context: CanvasRenderingContext2D = (canvasElement as HTMLCanvasElement).getContext('2d');
                context.font = textDiv.style.fontSize + ' ' + textDiv.style.fontFamily;
                let contextWidth: number;
                if (textContents) {
                    contextWidth = context.measureText(textContents[i].replace(/(\r\n|\n|\r)/gm, '')).width;
                } else {
                    contextWidth = context.measureText(textDiv.textContent.replace(/(\r\n|\n|\r)/gm, '')).width;
                }
                let scale: number = bounds.Width * this.pdfViewerBase.getZoomFactor() / contextWidth;
                textDiv.style.transform = 'scaleX(' + scale + ')';
                this.resizeExcessDiv(textLayer, textDiv);
            }
        } else {
            textLayer.parentElement.removeChild(textLayer);
        }
    }

    private setTextElementProperties(textDiv: HTMLElement): void {
        textDiv.style.fontFamily = 'sans-serif';
        textDiv.style.transformOrigin = '0%';
    }
    /**
     * @private
     */
    public resizeTextContentsOnZoom(pageNumber: number): void {
        // tslint:disable-next-line:max-line-length
        let renderObject: string = window.sessionStorage.getItem(this.pdfViewerBase.getDocumentId() + '_' + pageNumber + '_' + this.getPreviousZoomFactor());
        // tslint:disable-next-line
        let textBounds: any[] = [];
        let textContents: string[] = [];
        if (renderObject) {
            // tslint:disable-next-line
            let data: any = JSON.parse(renderObject);
            // tslint:disable-next-line
            textBounds = data['textBounds'];
            // tslint:disable-next-line
            textContents = data['textContent'];
        }
        if (textBounds.length !== 0) {
            this.textBoundsArray.push({ pageNumber: pageNumber, textBounds: textBounds });
            this.resizeTextContents(pageNumber, textContents, textBounds);
        } else {
            // tslint:disable-next-line
            let textElements: any = this.textBoundsArray.filter(obj => {
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

    private resizeExcessDiv(textLayer: HTMLElement, textDiv: HTMLElement): void {
        let textLayerPosition: ClientRect = textLayer.getBoundingClientRect();
        let textDivPosition: ClientRect = textDiv.getBoundingClientRect();
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
    public clearTextLayers(): void {
        let lowerPageValue: number = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        let higherPageValue: number = this.pdfViewerBase.currentPageNumber + 1;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        let textLayers: NodeList = document.querySelectorAll('div[id*="_textLayer_"]');
        for (let i: number = 0; i < textLayers.length; i++) {
            (textLayers[i] as HTMLElement).style.display = 'block';
            if (this.pdfViewerBase.getMagnified() && (this.getTextSelectionStatus() || this.getTextSearchStatus())) {
                // tslint:disable-next-line:radix
                let pageNumber: number = parseInt((textLayers[i] as HTMLElement).id.split('_textLayer_')[1]);
                if (!(((lowerPageValue + 1) <= pageNumber) && (pageNumber <= (higherPageValue - 1)))) {
                    (textLayers[i] as HTMLElement).remove();
                }
            } else if (this.pdfViewerBase.getPinchZoomed()) {
                (textLayers[i] as HTMLElement).remove();
            } else {
                (textLayers[i] as HTMLElement).remove();
            }
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public convertToSpan(pageNumber: number, divId: number, fromOffset: number, toOffset: number, textString: string, className: string): void {
        let textDiv: HTMLElement = this.pdfViewerBase.getElement('_text_' + pageNumber + '_' + divId);
        let textContent: string = textString.substring(fromOffset, toOffset);
        let node: Node = document.createTextNode(textContent);
        if (className) {
            let spanElement: HTMLElement = createElement('span');
            spanElement.className = className + ' e-pv-text';
            spanElement.appendChild(node);
            textDiv.appendChild(spanElement);
        } else {
            textDiv.appendChild(node);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public applySpanForSelection(startPage: number, endPage: number, anchorOffsetDiv: number, focusOffsetDiv: number, anchorOffset: number, focusOffset: number): void {
        if (this.pdfViewer.textSelectionModule) {
            for (let i: number = startPage; i <= endPage; i++) {
                let startId: number;
                let endId: number;
                // tslint:disable-next-line
                let textDivs: any = this.pdfViewerBase.getElement('_textLayer_' + i).childNodes;
                if (i === startPage) {
                    startId = anchorOffsetDiv;
                    endId = textDivs.length - 1;
                } else if (i === endPage) {
                    startId = 0;
                    endId = focusOffsetDiv;
                } else {
                    startId = 0;
                    endId = textDivs.length - 1;
                }
                if (startPage === endPage) {
                    startId = anchorOffsetDiv;
                    endId = focusOffsetDiv;
                }
                for (let j: number = startId; j <= endId; j++) {
                    let textDiv: HTMLElement = this.pdfViewerBase.getElement('_text_' + i + '_' + j);
                    let initId: number;
                    let lastId: number;
                    let length: number;
                    length = textDiv.textContent.length;
                    let textContent: string = textDiv.textContent;
                    textDiv.textContent = '';
                    if (j === startId) {
                        if (i === startPage) {
                            initId = anchorOffset;
                        } else {
                            initId = 0;
                        }
                        lastId = length;
                        this.convertToSpan(i, j, 0, initId, textContent, null);
                    } else if (j === endId && i === endPage) {
                        initId = 0;
                        lastId = focusOffset;
                    } else {
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
    public clearDivSelection(): void {
        let textLayers: NodeList = document.querySelectorAll('div[id*="_textLayer_"]');
        for (let i: number = 0; i < textLayers.length; i++) {
            let childNodes: NodeList = textLayers[i].childNodes;
            for (let j: number = 0; j < childNodes.length; j++) {
                let textDiv: HTMLElement = (childNodes[j] as HTMLElement);
                let textContent: string = textDiv.textContent;
                // tslint:disable-next-line:max-line-length
                if (textDiv.childNodes.length > 1 || textDiv.childNodes.length === 1 && ((textDiv.childNodes[0] as HTMLElement).tagName === 'SPAN')) {
                    textDiv.textContent = '';
                    textDiv.textContent = textContent;
                }
            }
        }
    }

    // tslint:disable-next-line
    private setStyleToTextDiv(textDiv: HTMLElement, left: number, top: number, bottom: number, width: number, height: number, textBounds: any): void {
        textDiv.style.left = left * this.pdfViewerBase.getZoomFactor() + 'px';
        textDiv.style.top = top * this.pdfViewerBase.getZoomFactor() + 'px';
        textDiv.style.bottom = bottom * this.pdfViewerBase.getZoomFactor() + 'px';
        textDiv.style.width = width * this.pdfViewerBase.getZoomFactor() + 'px';
        let textHeight: number = height * this.pdfViewerBase.getZoomFactor();
        textDiv.style.height = textHeight + 'px';
        if (textHeight > 11 && textBounds) {
            textDiv.style.top = (parseFloat(textDiv.style.top) + 2) + 'px';
            // tslint:disable-next-line:radix
            textDiv.style.fontSize = (parseInt(height.toString()) * this.pdfViewerBase.getZoomFactor() - 2.6) + 'px';
        } else {
            textDiv.style.fontSize = height * this.pdfViewerBase.getZoomFactor() + 'px';
        }
    }

    private getTextSelectionStatus(): boolean {
        if (this.pdfViewer.textSelectionModule) {
            return this.pdfViewer.textSelectionModule.isTextSelection;
        } else {
            return false;
        }
    }
    /**
     * @private
     */
    public modifyTextCursor(isAdd: boolean): void {
        let textLayerList: NodeList = document.querySelectorAll('div[id*="_textLayer_"]');
        for (let i: number = 0; i < textLayerList.length; i++) {
            let childNodes: NodeList = textLayerList[i].childNodes;
            for (let j: number = 0; j < childNodes.length; j++) {
                let textElement: HTMLElement = (childNodes[j] as HTMLElement);
                if (isAdd) {
                    textElement.classList.add('e-pv-cursor');
                } else {
                    textElement.classList.remove('e-pv-cursor');
                }
            }
        }
    }

    private getPreviousZoomFactor(): number {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.previousZoomFactor;
        } else {
            return 1;
        }
    }
    /** 
     * @private
     */
    public getTextSearchStatus(): boolean {
        if (this.pdfViewer.textSearchModule) {
            return this.pdfViewer.textSearchModule.isTextSearch;
        } else {
            return false;
        }
    }

    /**
     * @private
     */
    public createNotificationPopup(text: string): void {
        // tslint:disable-next-line:max-line-length
        let popupElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_notify', className: 'e-pv-notification-popup' });
        this.pdfViewerBase.viewerContainer.appendChild(popupElement);
        this.notifyDialog = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true, header: this.pdfViewer.localeObj.getConstant('PdfViewer'),
            buttons: [{
                buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true },
                click: this.closeNotification.bind(this)
            }],
            content: '<div class="e-pv-notification-popup-content">' + text + '</div>', target: this.pdfViewer.element,
            beforeClose: (): void => {
                this.notifyDialog.destroy();
                this.pdfViewer.element.removeChild(popupElement);
                if (this.pdfViewer.textSearchModule) {
                    this.pdfViewer.textSearch.isMessagePopupOpened = false;
                }
            }
        });
        this.notifyDialog.appendTo(popupElement);
    }

    private closeNotification = (): void => {
        this.notifyDialog.hide();
    }
}