import { createElement, isNullOrUndefined, Browser, isBlazor } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { PdfViewer, PdfViewerBase } from '../index';

/**
 * TextLayer module is used to handle the text content on the control.
 *
 * @hidden
 */
export class TextLayer {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private textBoundsArray: any[] = [];
    /**
     * @private
     */
    public characterBound: any[] = [];
    /**
     * @param {PdfViewer} pdfViewer - The PdfViewer.
     * @param {PdfViewerBase} pdfViewerBase - The PdfViewerBase.
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @param {number} pageNumber - The pageNumber.
     * @param {number} pageWidth - The pageWidth.
     * @param {number} pageHeight - The pageHeight.
     * @param {HTMLElement} pageDiv - The pageDiv.
     * @returns {HTMLElement} - The HTMLElement.
     * @private
     */
    public addTextLayer(pageNumber: number, pageWidth: number, pageHeight: number, pageDiv: HTMLElement): HTMLElement {
        const textDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        let textLayer: HTMLElement;
        if (!textDiv) {
            textLayer = createElement('div', { id: this.pdfViewer.element.id + '_textLayer_' + pageNumber, className: 'e-pv-text-layer' });
            textLayer.style.width = pageWidth + 'px';
            textLayer.style.height = pageHeight + 'px';
            if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
                textLayer.classList.add('e-pv-text-selection-none');
            }
            if (pageDiv){
                pageDiv.appendChild(textLayer);
            }
        }
        this.pdfViewerBase.applyElementStyles(textLayer, pageNumber);
        return textLayer;
    }
    /**
     * @param {number} pageNumber - The pageNumber.
     * @param {any} textContents - The textContents.
     * @param {any} textBounds - The textBounds.
     * @param {any} rotation - The rotation.
     * @param {any} rtldoc - The rtldoc
     * @returns {void}
     * @private
     */
    public renderTextContents(pageNumber: number, textContents: any, textBounds: any, rotation: any, rtldoc: any): void {
        const textLayer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        const canvasElement: HTMLElement = createElement('canvas');
        let isRTLText: boolean;
        if (this.pdfViewerBase.clientSideRendering){
            isRTLText = false;
        }
        let linebounds: any[] = [];
        let lineContent: any[] = [];
        let yValue: any;
        let heightValue: any;
        if (textBounds.length > 1) {
            if (textBounds[0].Width === 0 && textBounds.length > 2) {
                yValue = textBounds[1].Y;
                heightValue = textBounds[1].Height;
            } else {
                yValue = textBounds[0].Y;
                heightValue = textBounds[0].Height;
            }
        }
        let idNumber: number = 0;
        if (canvasElement && textLayer && textLayer.childNodes.length === 0) {
            for (let i: number = 0; i < textContents.length; i++) {
                if ((!(textContents[parseInt(i.toString(), 10)].includes('\r\n')) && !(textContents[parseInt(i.toString(), 10)].includes('\u0002'))) && i !== textBounds.length - 1 && rotation === 0 && !rtldoc) {
                    linebounds.push(textBounds[parseInt(i.toString(), 10)]);
                    lineContent.push(textContents[parseInt(i.toString(), 10)]);
                    if (yValue > textBounds[parseInt(i.toString(), 10)].Y && textBounds[parseInt(i.toString(), 10)].Width !== 0) {
                        yValue = textBounds[parseInt(i.toString(), 10)].Y;
                    }
                    if (heightValue < textBounds[parseInt(i.toString(), 10)].Height && textBounds[parseInt(i.toString(), 10)].Width !== 0) {
                        heightValue = textBounds[parseInt(i.toString(), 10)].Height;
                    }
                } else {
                    linebounds.push(textBounds[parseInt(i.toString(), 10)]);
                    lineContent.push(textContents[parseInt(i.toString(), 10)]);
                    if (yValue > textBounds[parseInt(i.toString(), 10)].Y && textBounds[parseInt(i.toString(), 10)].Width !== 0) {
                        yValue = textBounds[parseInt(i.toString(), 10)].Y;
                    }
                    if (heightValue < textBounds[parseInt(i.toString(), 10)].Height && textBounds[parseInt(i.toString(), 10)].Width !== 0) {
                        heightValue = textBounds[parseInt(i.toString(), 10)].Height;
                    }
                    for (let j: number = 0; j < linebounds.length; j++) {
                        const bounds: any = linebounds[parseInt(j.toString(), 10)];
                        const textDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_text_' + pageNumber + '_' + idNumber, className: 'e-pv-text', attrs: { 'tabindex': '-1' } });
                        const textContent: string = lineContent[parseInt(j.toString(), 10)];
                        if (textContent === ' ' && j !== linebounds.length - 1 && j !== 0) {
                            bounds.Height = linebounds[j - 1].Height;
                            bounds.Y = linebounds[j - 1].Y;
                        }
                        textDiv.textContent = textContent.replace(/&nbsp;/g, ' ');

                        const newLine: string = lineContent[parseInt(j.toString(), 10)].replace(/  +/g, ' ');
                        if (newLine !== ' ') {
                            textDiv.style.whiteSpace = 'pre';
                        }
                        if (this.pdfViewerBase.clientSideRendering){
                            if (textContent === ' ') {
                                textDiv.style.whiteSpace = 'pre';
                            }
                            if (!isNullOrUndefined(textDiv.textContent) && textContent !== ' ') {
                                isRTLText = this.pdfViewerBase.checkIsRtlText(textDiv.textContent);
                                textDiv.style.direction = isRTLText ? 'rtl' : 'ltr';
                            } else {
                                textDiv.style.direction = isRTLText ? 'rtl' : 'ltr';
                            }
                        }
                        if (bounds.Width === 0 && j !== linebounds.length - 1 && j !== 0) {
                            if (linebounds[j + 1].X - (linebounds[j - 1].X + linebounds[j - 1].Width) < 30 && (!lineContent[j - 1].includes('\r\n') && !(textContents[parseInt(j.toString(), 10)].includes('\u0002')))) {
                                bounds.Width = linebounds[j + 1].X - (linebounds[j - 1].X + linebounds[j - 1].Width);
                                bounds.X = linebounds[j - 1].X + linebounds[j - 1].Width;
                                if (bounds.Width < 0) {
                                    bounds.Width = 0;
                                } else {
                                    textDiv.style.whiteSpace = 'pre';
                                }
                            }
                        }
                        if ((j !== 0 || linebounds.length - 1 === 0 || (bounds.Y - yValue) > 20 && bounds.Width !== 0) && idNumber !== 0 && ((textBounds[idNumber - 1].Y - textBounds[parseInt(idNumber.toString(), 10)].Y) > 11 || ((textBounds[parseInt(idNumber.toString(), 10)].Y - textBounds[idNumber - 1].Y) > 11)) && lineContent[parseInt(j.toString(), 10)] !== ' ') {
                            yValue = linebounds[parseInt(j.toString(), 10)].Y;
                            heightValue = linebounds[parseInt(j.toString(), 10)].Height;
                        }
                        if (bounds) {
                            if (bounds.Rotation !== 270) {
                                bounds.Y = yValue;
                                bounds.Height = heightValue;
                            }
                            this.setStyleToTextDiv(textDiv, bounds.X, bounds.Y, bounds.Bottom, bounds.Width, bounds.Height,
                                                   bounds.Rotation);
                        }
                        this.setTextElementProperties(textDiv);
                        const context: CanvasRenderingContext2D = (canvasElement as HTMLCanvasElement).getContext('2d');
                        context.font = textDiv.style.fontSize + ' ' + textDiv.style.fontFamily;
                        const contextWidth: number = context.measureText(lineContent[parseInt(j.toString(), 10)].replace(/(\r\n|\n|\r)/gm, '')).width;
                        if (bounds) {
                            let scale: number;
                            if (bounds.Rotation === 90 || (this.pdfViewerBase.clientSideRendering && bounds.Rotation === 270)) {
                                scale = bounds.Height * this.pdfViewerBase.getZoomFactor() / contextWidth;
                            } else {
                                scale = bounds.Width * this.pdfViewerBase.getZoomFactor() / contextWidth;
                            }
                            this.applyTextRotation(scale, textDiv, rotation, bounds.Rotation, bounds);
                        }
                        textLayer.appendChild(textDiv);
                        // EJ2-855106- Optimize performance by eliminating unnecessary getBoundingClientRect usage in this method.
                        this.resizeExcessDiv(textLayer, textDiv);
                        if (this.pdfViewer.textSelectionModule && this.pdfViewer.enableTextSelection && !this.pdfViewerBase.isTextSelectionDisabled && textDiv.className !== 'e-pdfviewer-formFields'
                            && textDiv.className !== 'e-pdfviewer-signatureformfields' && textDiv.className !== 'e-pdfviewer-signatureformfields-signature') {
                            textDiv.classList.add('e-pv-cursor');
                        }
                        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                            textDiv.classList.add('e-enable-text-selection');
                        }
                        idNumber++;
                    }
                    linebounds = [];
                    lineContent = [];
                    if (i < textBounds.length - 1) {
                        if (textBounds[i + 1].Width === 0 && !isNullOrUndefined(textBounds[i + 2])) {
                            yValue = textBounds[i + 2].Y;
                            heightValue = textBounds[i + 2].Height;
                        } else {
                            yValue = textBounds[i + 1].Y;
                            heightValue = textBounds[i + 1].Height;
                        }
                    }
                }
            }
            this.pdfViewerBase.releaseCanvas(canvasElement as HTMLCanvasElement);
        }
    }
    /**
     * @param {number} pageNumber -This is pageNumber
     * @param {any} textContents - This is textContents
     * @param {any} textBounds - This is textBounds
     * @param {any} rotation - This is rotation
     * @param {boolean} isTextSearch - This is isTextSearch
     * @private
     * @returns {void}
     */
    public resizeTextContents(pageNumber: number, textContents: any, textBounds: any, rotation: any, isTextSearch?: boolean): void {
        const textLayer: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + pageNumber);
        const canvasElement: HTMLElement = createElement('canvas');
        if (canvasElement) {
            for (let i: number = 0; i < textLayer.childNodes.length; i++) {
                let bounds: any;
                const textDiv: HTMLElement = this.pdfViewerBase.getElement('_text_' + pageNumber + '_' + i);
                if (isNullOrUndefined(textDiv)) {
                    break;
                }
                if (textBounds) {
                    bounds = textBounds[parseInt(i.toString(), 10)];
                    if (bounds) {
                        this.setStyleToTextDiv(textDiv, bounds.X, bounds.Y, bounds.Bottom, bounds.Width, bounds.Height, bounds.Rotation);
                    }
                }
                this.setTextElementProperties(textDiv);
                const context: CanvasRenderingContext2D = (canvasElement as HTMLCanvasElement).getContext('2d');
                context.font = textDiv.style.fontSize + ' ' + textDiv.style.fontFamily;
                let contextWidth: number;
                if (textContents) {
                    const textContent: string = textContents[parseInt(i.toString(), 10)];
                    if (textContent) {
                        contextWidth = context.measureText(textContent.replace(/(\r\n|\n|\r)/gm, '')).width;
                    }
                } else {
                    contextWidth = context.measureText(textDiv.textContent.replace(/(\r\n|\n|\r)/gm, '')).width;
                }
                if (bounds) {
                    let scale: number;
                    if (bounds.Rotation === 90 || (this.pdfViewerBase.clientSideRendering && bounds.Rotation === 270)) {
                        scale = bounds.Height * this.pdfViewerBase.getZoomFactor() / contextWidth;
                    } else {
                        scale = bounds.Width * this.pdfViewerBase.getZoomFactor() / contextWidth;
                    }
                    this.applyTextRotation(scale, textDiv, rotation, bounds.Rotation, bounds);
                }
                // EJ2-855106- Optimize performance by eliminating unnecessary getBoundingClientRect usage in this method.
                this.resizeExcessDiv(textLayer, textDiv);
            }
            this.pdfViewerBase.releaseCanvas(canvasElement as HTMLCanvasElement);
        } else {
            textLayer.parentElement.removeChild(textLayer);
        }
        if (this.pdfViewer.textSearch) {
            if (!isTextSearch) {
                this.pdfViewer.textSearch.resizeSearchElements(pageNumber);
            }
        }
    }

    private applyTextRotation(scale: number, textDiv: HTMLElement, rotation: number, textRotation: number, bounds: any): void {
        const scaleString: string = 'scaleX(' + scale + ')';
        if (this.pdfViewerBase.clientSideRendering) {
            if (rotation === 0) {
                if (textRotation === 0) {
                    textDiv.style.transform = scaleString;
                } else if (textRotation === 90) {
                    textDiv.style.left = (bounds.X + bounds.Width) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.top = bounds.Y * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
                } else if (textRotation === 180) {
                    textDiv.style.left = (bounds.X + bounds.Width) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.top = (bounds.Y + bounds.Height) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
                } else if (textRotation === 270) {
                    textDiv.style.left = bounds.X * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.top = (bounds.Y + bounds.Height) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
                } else {
                    textDiv.style.transform = scaleString;
                }
            } else if (rotation === 1) {
                let textRotationAngle: number = textRotation + 90;
                if (textRotationAngle >= 360) {
                    textRotationAngle -= 360;
                }
                if (textRotation === 0) {
                    textDiv.style.transform = 'rotate(90deg) ' + scaleString;
                } else if (textRotation === 90) {
                    textDiv.style.left = bounds.X * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.top = (bounds.Y + bounds.Width) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.transform = 'rotate(' + textRotationAngle + 'deg) ' + scaleString;
                } else if (textRotation === 180) {
                    textDiv.style.left = (bounds.X - bounds.Height) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.top = (bounds.Y + bounds.Width) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.transform = 'rotate(' + textRotationAngle + 'deg) ' + scaleString;
                } else if (textRotation === 270) {
                    textDiv.style.left = (bounds.X - bounds.Height) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.top = (bounds.Y) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.transform = 'rotate(' + textRotationAngle + 'deg) ' + scaleString;
                } else {
                    textDiv.style.transform = 'rotate(90deg) ' + scaleString;
                }
            } else if (rotation === 2) {
                let textRotationAngle: number = textRotation + 180;
                if (textRotationAngle >= 360) {
                    textRotationAngle -= 360;
                }
                if (textRotation === 0) {
                    textDiv.style.transform = 'rotate(180deg) ' + scaleString;
                } else if (textRotation === 90) {
                    textDiv.style.left = (bounds.X - bounds.Width) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.top = bounds.Y * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.transform = 'rotate(' + (textRotationAngle) + 'deg) ' + scaleString;
                } else if (textRotation === 180) {
                    textDiv.style.left = (bounds.X - bounds.Width) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.top = (bounds.Y - bounds.Height) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.transform = 'rotate(' + (textRotationAngle) + 'deg) ' + scaleString;
                } else if (textRotation === 270) {
                    textDiv.style.left = bounds.X * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.top = (bounds.Y - bounds.Height) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.transform = 'rotate(' + (textRotationAngle) + 'deg) ' + scaleString;
                } else {
                    textDiv.style.transform = 'rotate(180deg) ' + scaleString;
                }
            } else if (rotation === 3) {
                let textRotationAngle: number = textRotation + 270;
                if (textRotationAngle >= 360) {
                    textRotationAngle -= 360;
                }
                if (textRotation === 0) {
                    textDiv.style.transform = 'rotate(270deg) ' + scaleString;
                } else if (textRotation === 90) {
                    textDiv.style.left = bounds.X * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.top = (bounds.Y - bounds.Width) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.transform = 'rotate(' + (textRotationAngle) + 'deg) ' + scaleString;
                } else if (textRotation === 180) {
                    textDiv.style.left = (bounds.X + bounds.Height) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.top = (bounds.Y - bounds.Width) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.transform = 'rotate(' + (textRotationAngle) + 'deg) ' + scaleString;
                } else if (textRotation === 270) {
                    textDiv.style.left = (bounds.X + bounds.Height) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.top = (bounds.Y) * this.pdfViewerBase.getZoomFactor() + 'px';
                    textDiv.style.transform = 'rotate(' + (textRotationAngle) + 'deg) ' + scaleString;
                } else {
                    textDiv.style.transform = 'rotate(270deg) ' + scaleString;
                }
            }
        } else {
            if (rotation === 0) {
                if ((textRotation >= 0 && textRotation < 90)) {
                    textDiv.style.transform = scaleString;
                } else if ((textRotation === 90) || (textRotation === 270)) {
                    if ((textRotation === 270)) {
                        textDiv.style.left = (bounds.X * this.pdfViewerBase.getZoomFactor()) + 'px';
                        textDiv.style.top = ((bounds.Y + bounds.Width) * this.pdfViewerBase.getZoomFactor()) + 'px';
                        textDiv.style.height = (bounds.Height * this.pdfViewerBase.getZoomFactor()) + 'px';
                        textDiv.style.fontSize = (bounds.Height * this.pdfViewerBase.getZoomFactor()) + 'px';
                    }
                    else {
                        textDiv.style.left = ((bounds.X + bounds.Width) * this.pdfViewerBase.getZoomFactor()) + 'px';
                        textDiv.style.top = (bounds.Y * this.pdfViewerBase.getZoomFactor()) + 'px';
                        textDiv.style.height = (bounds.Width * this.pdfViewerBase.getZoomFactor()) + 'px';
                        textDiv.style.fontSize = (bounds.Width * this.pdfViewerBase.getZoomFactor()) + 'px';
                        textDiv.style.transformOrigin = '0% 0%';
                    }
                    textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
                } else {
                    textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
                }
            } else if (rotation === 1) {
                if (textRotation === 0) {
                    textDiv.style.transform = 'rotate(90deg) ' + scaleString;
                } else if (textRotation === -90) {
                    textDiv.style.transform = scaleString;
                } else {
                    textRotation = textRotation + 90;
                    textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
                }
            } else if (rotation === 2) {
                if (textRotation === 0) {
                    textDiv.style.transform = 'rotate(180deg) ' + scaleString;
                } else if (textRotation === 180) {
                    textDiv.style.transform = scaleString;
                } else {
                    textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
                }
            } else if (rotation === 3) {
                if (textRotation === 0) {
                    textDiv.style.transform = 'rotate(-90deg) ' + scaleString;
                } else if (textRotation === 90) {
                    textDiv.style.transform = scaleString;
                } else {
                    textDiv.style.transform = 'rotate(' + textRotation + 'deg) ' + scaleString;
                }
            }
        }
    }

    private setTextElementProperties(textDiv: HTMLElement): void {
        textDiv.style.fontFamily = 'serif';
        textDiv.style.transformOrigin = this.pdfViewerBase.clientSideRendering ? '0% 0%' : '0%';
    }
    /**
     * @param {number} pageNumber - The pageNumber.
     * @returns {void}
     * @private
     */
    public resizeTextContentsOnZoom(pageNumber: number): void {
        const renderObject: string = PdfViewerBase.sessionStorageManager.getItem(this.pdfViewerBase.getDocumentId() + '_' + pageNumber + '_' + this.getPreviousZoomFactor());
        let textBounds: any[] = [];
        let textContents: string[] = [];
        let rotation: any;
        if (renderObject) {
            const data: any = JSON.parse(renderObject);
            textBounds = data['textBounds'];
            textContents = data['textContent'];
            rotation = data['rotation'];
        }
        if (textBounds.length !== 0) {
            this.textBoundsArray.push({ pageNumber: pageNumber, textBounds: textBounds });
            this.resizeTextContents(pageNumber, textContents, textBounds, rotation);
        } else {
            const textElements: any = this.textBoundsArray.filter((obj: any) => {
                return obj.pageNumber === pageNumber;
            });
            if (textElements) {
                if (textElements.length !== 0) {
                    textBounds = textElements[0]['textBounds'];
                    this.resizeTextContents(pageNumber, null, textBounds, rotation);
                }
            }
        }
    }

    /**
     * EJ2-855106- Optimize performance by eliminating unnecessary getBoundingClientRect usage in this method.
     *
     * @param {HTMLElement} textLayer - This is textLayer
     * @param {HTMLElement} textDiv - This is textDiv
     * @returns {void}
     */
    private resizeExcessDiv(textLayer: HTMLElement, textDiv: HTMLElement): void {
        // EJ2-855106- Optimize performance by eliminating unnecessary getBoundingClientRect usage in this method.
        // const textLayerPosition: ClientRect = textLayer.getBoundingClientRect();
        // const textDivPosition: ClientRect = textDiv.getBoundingClientRect();
        //
        // if ((textDivPosition.width + textDivPosition.left) >= (textLayerPosition.width + textLayerPosition.left) || (textDivPosition.width > textLayerPosition.width)) {
        //     // 'auto' width is set to reset the size of the div to its contents.
        //     textDiv.style.width = 'auto';
        //     // Client width gets reset by 'auto' width property which has the width of the content.
        //     textDiv.style.width = textDiv.clientWidth + 'px';
        // }
    }
    /**
     * @private
     * @param {boolean} isPinchZoomed - The isPinchZoomed.
     * @returns {void}
     */
    public clearTextLayers(isPinchZoomed?: boolean): void {
        let lowerPageValue: number = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        let higherPageValue: number = this.pdfViewerBase.currentPageNumber + 1;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        const textLayers: NodeList = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_textLayer_"]');
        for (let i: number = 0; i < textLayers.length; i++) {
            (textLayers[parseInt(i.toString(), 10)] as HTMLElement).style.display = 'block';
            if (this.pdfViewerBase.getMagnified() && (this.getTextSelectionStatus() || this.getTextSearchStatus())) {
                const pageNumber: number = parseInt((textLayers[parseInt(i.toString(), 10)] as HTMLElement).id.split('_textLayer_')[1], 10);
                if (!(((lowerPageValue + 1) <= pageNumber) && (pageNumber <= (higherPageValue - 1)))) {
                    this.removeElement(textLayers[parseInt(i.toString(), 10)] as HTMLElement, isPinchZoomed);
                }
            } else if (this.pdfViewerBase.getPinchZoomed()) {
                this.removeElement(textLayers[parseInt(i.toString(), 10)] as HTMLElement, isPinchZoomed);
            } else {
                this.removeElement(textLayers[parseInt(i.toString(), 10)] as HTMLElement, isPinchZoomed);
            }
        }
    }
    private removeElement(element: HTMLElement, isPinchZoomed?: boolean): void {
        if (isPinchZoomed) {
            this.removeForeignObjects(element);
        }
        else {
            if (Browser.isIE) {
                if (element.parentElement) {
                    element.parentElement.removeChild(element);
                } else if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            } else {
                element.remove();
            }
        }
    }
    private removeForeignObjects(element: HTMLElement): void {
        const childElements: HTMLCollectionOf<Element> = element.getElementsByClassName('foreign-object');
        if (childElements) {
            for (let i: number = 0; i < childElements.length; i++) {
                const child: HTMLElement = childElements[parseInt(i.toString(), 10)] as HTMLElement;
                const parent: HTMLElement = child.parentElement;
                if (Browser.isDevice) {
                    if (parent.classList.contains('e-pv-text-layer') && parent.className !== 'e-pv-checkbox-outer-div') {
                        element.removeChild(child);
                        i--;
                    } else if (parent.className === 'e-pv-checkbox-outer-div') {
                        const outerDivParent: HTMLElement = document.getElementById(child.id);
                        if (outerDivParent) {
                            outerDivParent.remove();
                            i--;
                        }
                    }
                } else if (parent.className === 'e-pv-text-layer') {
                    element.removeChild(child);
                    i--;
                }
            }
        }
    }
    /**
     * @param {number} pageNumber - This is pageNumber
     * @param {number} divId - This is divId
     * @param {number} fromOffset - This is fromoffset
     * @param {number} toOffset - This is toOffset
     * @param {string} textString - This is textString
     * @param {string} className - This is className
     * @param {boolean} isRTLText - This is isRTLText
     * @private
     * @returns {void}
     */
    public convertToSpan(pageNumber: number, divId: number, fromOffset: number, toOffset: number,
                         textString: string, className: string, isRTLText?: boolean): void {
        const textDiv: HTMLElement = this.pdfViewerBase.getElement('_text_' + pageNumber + '_' + divId);
        const textContent: string = textString.substring(fromOffset, toOffset);
        const node: Node = document.createTextNode(textContent);
        if (className) {
            const spanElement: HTMLElement = createElement('span');
            spanElement.className = className + ' e-pv-text';
            if (this.pdfViewerBase.clientSideRendering && isRTLText) {
                if (toOffset === textString.length) {
                    spanElement.style.left = 0 + 'px';
                    spanElement.style.top = 0 + 'px';
                } else {
                    if (textDiv.style.direction === 'rtl') {
                        const currentText: string = textDiv.textContent;
                        textDiv.textContent = textString.substring(toOffset, textString.length);
                        const textBounds: any = textDiv.getBoundingClientRect();
                        spanElement.style.left = textBounds.width + 'px';
                        spanElement.style.top = 0 + 'px';
                        textDiv.textContent = currentText;
                    }
                }
            }
            spanElement.style.height = textDiv.style.height;
            spanElement.appendChild(node);
            textDiv.appendChild(spanElement);
        } else {
            textDiv.appendChild(node);
        }
    }
    /**
     * @param {number} startPage - This is startPage
     * @param {number} endPage - This is endPage
     * @param {number} anchorOffsetDiv - This is anchorOffsetDiv
     * @param {number} focusOffsetDiv - This is focusOffsetDiv
     * @param {number} anchorOffset - This is anchorOffset
     * @param {number} focusOffset - This is focusOffset
     * @private
     * @returns {void}
     */
    public applySpanForSelection(startPage: number, endPage: number, anchorOffsetDiv: number, focusOffsetDiv: number,
                                 anchorOffset: number, focusOffset: number): void {
        if (this.pdfViewer.textSelectionModule) {
            for (let i: number = startPage; i <= endPage; i++) {
                let isRTLText: boolean;
                if (this.pdfViewerBase.clientSideRendering){
                    const storedData: any = JSON.parse(this.pdfViewerBase.pageTextDetails[this.pdfViewerBase.documentId + '_' + i + '_textDetails']);
                    const pageText: string = storedData['pageText'];
                    isRTLText = this.pdfViewerBase.checkIsRtlText(pageText);
                }
                let startId: number;
                let endId: number;
                const textDivs: any = this.pdfViewerBase.getElement('_textLayer_' + i).childNodes;
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
                    const textDiv: HTMLElement = this.pdfViewerBase.getElement('_text_' + i + '_' + j);
                    let initId: number;
                    let lastId: number;
                    let length: number;
                    if (textDiv && textDiv.textContent) {
                        length = textDiv.textContent.length;
                        const textContent: string = textDiv.textContent;
                        textDiv.textContent = '';
                        if (j === startId) {
                            if (i === startPage) {
                                initId = anchorOffset;
                            } else {
                                initId = 0;
                            }
                            lastId = length;
                            this.convertToSpan(i, j, 0, initId, textContent, null, isRTLText);
                        } else if (j === endId && i === endPage) {
                            initId = 0;
                            lastId = focusOffset;
                        } else {
                            initId = 0;
                            lastId = length;
                        }
                        if (startId === endId && startPage === endPage) {
                            initId = anchorOffset;
                            lastId = focusOffset;
                        }
                        this.convertToSpan(i, j, initId, lastId, textContent, 'e-pv-maintaincontent', isRTLText);
                        if (j === endId && i === endPage) {
                            this.convertToSpan(i, j, lastId, textContent.length, textContent, null, isRTLText);
                        }
                    }
                }
            }
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public clearDivSelection(): void {
        const textLayers: NodeList = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_textLayer_"]');
        for (let i: number = 0; i < textLayers.length; i++) {
            const childNodes: NodeList = textLayers[parseInt(i.toString(), 10)].childNodes;
            for (let j: number = 0; j < childNodes.length; j++) {
                const textDiv: HTMLElement = (childNodes[parseInt(j.toString(), 10)] as HTMLElement);
                if (textDiv.className !== 'e-pdfviewer-formFields' && textDiv.className !== 'e-pdfviewer-signatureformfields' && textDiv.className !== 'e-pdfviewer-signatureformfields-signature') {
                    const textContent: string = textDiv.textContent;
                    if (textDiv.childNodes.length > 1 || textDiv.childNodes.length === 1 && ((textDiv.childNodes[0] as HTMLElement).tagName === 'SPAN')) {
                        textDiv.textContent = '';
                        textDiv.textContent = textContent;
                    }
                }
            }
        }
    }

    private setStyleToTextDiv(textDiv: HTMLElement, left: number, top: number, bottom: number, width: number,
                              height: number, rotation: number): void {
        textDiv.style.left = left * this.pdfViewerBase.getZoomFactor() + 'px';
        textDiv.style.top = top * this.pdfViewerBase.getZoomFactor() + 'px';
        let textHeight: number;
        if (rotation === 90 || (this.pdfViewerBase.clientSideRendering && rotation === 270)) {
            textHeight = width * this.pdfViewerBase.getZoomFactor();
        } else {
            textHeight = height * this.pdfViewerBase.getZoomFactor();
        }
        textDiv.style.height = textHeight + 'px';
        textDiv.style.fontSize = textHeight + 'px';
    }

    private getTextSelectionStatus(): boolean {
        if (this.pdfViewer.textSelectionModule) {
            return this.pdfViewer.textSelectionModule.isTextSelection;
        } else {
            return false;
        }
    }

    /**
     * @param {boolean} isAdd - The isAdd.
     * @returns {void}
     * @private
     */
    public modifyTextCursor(isAdd: boolean): void {
        const textLayerList: NodeList = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_textLayer_"]');
        for (let i: number = 0; i < textLayerList.length; i++) {
            const childNodes: NodeList = textLayerList[parseInt(i.toString(), 10)].childNodes;
            for (let j: number = 0; j < childNodes.length; j++) {
                const textElement: HTMLElement = (childNodes[parseInt(j.toString(), 10)] as HTMLElement);
                if (isAdd && textElement.className !== 'e-pdfviewer-formFields' && textElement.className !== 'e-pdfviewer-signatureformfields' && textElement.className !== 'e-pdfviewer-signatureformfields-signature') {
                    textElement.classList.add('e-pv-cursor');
                } else {
                    textElement.classList.remove('e-pv-cursor');
                }
            }
        }
    }

    /**
     * @param {Selection} selection - The Selection.
     * @returns {boolean} - Returns true or false.
     * @private
     */
    public isBackWardSelection(selection: Selection): boolean {
        const position: number = selection.anchorNode.compareDocumentPosition(selection.focusNode);
        let backward: boolean = false;
        if (!position && selection.anchorOffset > selection.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
            backward = true;
        }
        return backward;
    }

    /**
     * @param {Node} element - The element.
     * @returns {number} - Returns number.
     * @private
     */
    public getPageIndex(element: Node): number {
        let pageId: number;

        let parentElement: any = element.parentElement;
        if (!parentElement) {
            parentElement = element.parentNode;
        }
        if (parentElement.className === 'e-pv-text-layer') {
            pageId = parseInt((element as HTMLElement).id.split('_text_')[1], 10);
        } else {
            pageId = parseInt(parentElement.id.split('_text_')[1], 10);
        }
        return pageId;
    }

    /**
     * @param {Node} element - The element.
     * @param {number} pageIndex - The pageIndex.
     * @returns {number} - Returns number.
     * @private
     */
    public getTextIndex(element: Node, pageIndex: number): number {
        let textIndex: number;
        let parentElement: any = element.parentElement;
        if (!parentElement) {
            parentElement = element.parentNode;
        }
        if (parentElement.className === 'e-pv-text-layer') {
            textIndex = parseInt((element as HTMLElement).id.split('_text_' + pageIndex + '_')[1], 10);
        } else {
            textIndex = parseInt(parentElement.id.split('_text_' + pageIndex + '_')[1], 10);
        }
        return textIndex;
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
     * @returns {boolean} - Returns true or false.
     */
    public getTextSearchStatus(): boolean {
        if (this.pdfViewer.textSearchModule) {
            return this.pdfViewer.textSearchModule.isTextSearch;
        } else {
            return false;
        }
    }
}
