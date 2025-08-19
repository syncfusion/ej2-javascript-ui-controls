import { PdfFormFieldBase, PdfViewer } from '../index';
import { PdfViewerBase, PdfAnnotationBaseModel } from '../index';
import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { AjaxHandler } from '../index';
import { DiagramHtmlElement } from '../drawing/html-element';
import { Size } from '@syncfusion/ej2-drawings';
import { TaskPriorityLevel } from '../base/pdfviewer-utlis';
import { FormFieldModel } from '../pdfviewer-model';
import { PdfFormFieldBaseModel } from '../drawing';

/**
 * Print module
 */
export class Print {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private printViewerContainer: HTMLElement;
    private printCanvas: HTMLCanvasElement;
    private printHeight: number = 1056;
    private printWidth: number = 816 ;
    private maximumPixels: number = 16777216;
    /**
     * @private
     */
    public printRequestHandler: AjaxHandler;
    private frameDoc: any;
    private iframe: any;
    private printWindow: Window;
    /**
     * @param {PdfViewer} viewer - It describes about the viewer
     * @param {PdfViewerBase} base - It describes about the base
     * @private
     * @returns {void}
     */
    constructor(viewer: PdfViewer, base: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * Print the PDF document being loaded in the ejPdfViewer control.
     *
     * @returns {void}
     */
    public print(): void {
        let pageIndex: number;
        if (this.pdfViewerBase.pageCount > 0) {
            this.printViewerContainer = createElement('div', {
                id: this.pdfViewer.element.id + '_print_viewer_container',
                className: 'e-pv-print-viewer-container'
            });
            if (this.pdfViewer.printMode === 'Default') {
                this.pdfViewerBase.showPrintLoadingIndicator(true);
                this.iframe = document.createElement('iframe');
                this.iframe.className = 'iframeprint';
                this.iframe.id = 'iframePrint';
                this.iframe.style.position = 'fixed';
                this.iframe.style.top = '-100000000px';
                document.body.appendChild(this.iframe);
                this.frameDoc = this.iframe.contentWindow ? this.iframe.contentWindow : this.iframe.contentDocument;
                this.frameDoc.document.open();
            } else {
                this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
                this.printWindow.moveTo(0, 0);
                this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
                this.createPrintLoadingIndicator(this.printWindow.document.body);
            }
            setTimeout(
                () => {
                    for (pageIndex = 0; pageIndex < this.pdfViewerBase.pageCount; pageIndex++) {
                        const pageWidth: number = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].width;
                        const pageHeight: number = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].height;
                        // Check if the document is A4 by comparing the A4 standard values with the buffer value
                        let a4StdWidth: number = 793;
                        let a4StdHeight: number = 1122;
                        const bufferWidth: number = 10;
                        const bufferHeight: number = 10;
                        //Reduced the A4 standard width and height to prevent blank pages while printing
                        const a4PrintWidth: number = 783;
                        const a4PrintHeight: number = 1110;
                        this.printWidth = 816;
                        this.printHeight = 1056;
                        // Check if the A4 document is protrait or landscape
                        if (pageWidth > pageHeight) {
                            a4StdWidth = 1122;
                            a4StdHeight = 793;
                        }
                        if (!(pageWidth >= (a4StdWidth + bufferWidth) || pageWidth <= (a4StdWidth - bufferWidth)) &&
                        !(pageHeight >= (a4StdHeight + bufferHeight) || pageHeight <= (a4StdHeight - bufferHeight))) {

                            this.printWidth = a4PrintWidth;
                            this.printHeight = a4PrintHeight;
                        }
                        this.pdfViewer.printModule.createRequestForPrint(pageIndex, pageWidth, pageHeight,
                                                                         this.pdfViewerBase.pageCount, this.pdfViewer.printScaleFactor);
                    }
                    this.pdfViewer.firePrintEnd(this.pdfViewer.downloadFileName);
                },
                100);
        }
    }

    private createRequestForPrint(pageIndex: number, pageWidth: number, pageHeight: number, pageCount: number,
                                  printScaleFactor: number): void {
        // eslint-disable-next-line
        const proxy: Print = this;
        const jsonObject: object = {
            pageNumber: pageIndex.toString(),
            documentId: this.pdfViewerBase.documentId,
            hashId: this.pdfViewerBase.hashId, zoomFactor: '1',
            action: 'PrintImages',
            elementId: this.pdfViewer.element.id,
            uniqueId: this.pdfViewerBase.documentId,
            digitalSignaturePresent: this.pdfViewerBase.digitalSignaturePresent(pageIndex),
            printScaleFactor: printScaleFactor >= 0.5 && printScaleFactor <= 5 ? printScaleFactor : printScaleFactor > 5 ? 5 : 1

        };
        if (this.pdfViewerBase.jsonDocumentId) {
            (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
        }
        proxy.pdfViewerBase.createFormfieldsJsonData();
        proxy.printRequestHandler = new AjaxHandler(proxy.pdfViewer);
        proxy.printRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.print;
        proxy.printRequestHandler.responseType = null;
        proxy.printRequestHandler.mode = false;
        if (this.pdfViewerBase.validateForm && this.pdfViewer.enableFormFieldsValidation) {
            this.pdfViewer.fireValidatedFailed(proxy.pdfViewer.serverActionSettings.download);
            this.pdfViewerBase.validateForm = false;
            this.pdfViewerBase.showPrintLoadingIndicator(false);
        } else {
            if (proxy.pdfViewerBase.clientSideRendering) {
                this.pdfViewerBase.pdfViewerRunner.addTask({
                    pageIndex: pageIndex, message: 'printImage', printScaleFactor:
                        printScaleFactor >= 0.5 && printScaleFactor <= 5 ? printScaleFactor : printScaleFactor > 5 ? 5 : 1
                }, TaskPriorityLevel.High);
            } else {
                proxy.printRequestHandler.send(jsonObject);
            }
        }
        proxy.printRequestHandler.onSuccess = function (result: any): void {
            proxy.printSuccess(result, pageWidth, pageHeight, pageIndex);
        };
        this.printRequestHandler.onFailure = function (result: any): void {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.print);
        };
        this.printRequestHandler.onError = function (result: any): void {
            proxy.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.print);
        };
    }

    /**
     * @param {any} event - It describes about the event
     * @private
     * @returns {void}
     */
    public printOnMessage(event: any): void {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const { value, width, height, pageIndex, pageWidth, pageHeight } = event.data;
        canvas.width = width;
        canvas.height = height;
        const canvasContext: CanvasRenderingContext2D = canvas.getContext('2d');
        const imageData: ImageData = canvasContext.createImageData(width, height);
        imageData.data.set(value);
        canvasContext.putImageData(imageData, 0, 0);
        const imageUrl: string = canvas.toDataURL();
        this.pdfViewerBase.releaseCanvas(canvas);
        const data: any = ({ image: imageUrl, pageNumber: pageIndex, uniqueId: this.pdfViewerBase.documentId, pageWidth: width });
        this.printSuccess(data, pageWidth, pageHeight, pageIndex);
    }

    private printSuccess(result: any, pageWidth: number, pageHeight: number, pageIndex: number): void {
        this.pdfViewerBase.isPrint = true;
        let printImage: any = this.pdfViewerBase.clientSideRendering ? result : result.data;
        const redirect: boolean = (this as any).pdfViewerBase.checkRedirection(printImage);
        if (redirect) {
            this.pdfViewerBase.showPrintLoadingIndicator(false);
        }
        else {
            if (printImage) {
                if (typeof printImage !== 'object') {
                    try {
                        printImage = JSON.parse(printImage);
                        if (typeof printImage !== 'object') {
                            this.pdfViewerBase.onControlError(500, printImage, this.pdfViewer.serverActionSettings.print);
                            printImage = null;
                        }
                    } catch (error) {
                        this.pdfViewerBase.onControlError(500, printImage, this.pdfViewer.serverActionSettings.print);
                        printImage = null;
                    }
                }
            }
            if (printImage && printImage.uniqueId === this.pdfViewerBase.documentId) {
                this.pdfViewer.fireAjaxRequestSuccess(this.pdfViewer.serverActionSettings.print, printImage);
                let annotationSource: any;
                if (!this.pdfViewer.annotationSettings.skipPrint) {
                    const annotationCollections: any = this.pdfViewerBase.documentAnnotationCollections;
                    if (annotationCollections && annotationCollections[printImage.pageNumber] &&
                        this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                        const printCollection: any = annotationCollections[printImage.pageNumber];
                        if (this.pdfViewerBase.isImportAction) {
                            const textMarkupAnnotation: number[] = printCollection.textMarkupAnnotation;
                            const shapeAnnotation: number[] = printCollection.shapeAnnotation;
                            const measureShapeAnnotation: number[] = printCollection.measureShapeAnnotation;
                            const stampAnnotation: number[] = printCollection.stampAnnotations;
                            const freeTextAnnotation: number[] = printCollection.freeTextAnnotation;
                            const inkAnnotation: number[] = printCollection.signatureInkAnnotation;
                            const stickyNoteAnnotation: any = printCollection.stickyNotesAnnotation;
                            annotationSource = this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                                printAnnotationsInCanvas(textMarkupAnnotation, printImage.pageNumber, stampAnnotation,
                                                         shapeAnnotation, measureShapeAnnotation, stickyNoteAnnotation,
                                                         freeTextAnnotation, inkAnnotation);
                        } else {
                            annotationSource = this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                                printAnnotationsInCanvas(printCollection.textMarkupAnnotation, printImage.pageNumber,
                                                         printCollection.stampAnnotations, printCollection.shapeAnnotation,
                                                         printCollection.measureShapeAnnotation, printCollection.stickyNotesAnnotation,
                                                         printCollection.freeTextAnnotation, printCollection.signatureInkAnnotation);
                        }
                    }
                    if (this.pdfViewerBase.isAnnotationCollectionRemoved) {
                        annotationSource = this.pdfViewer.annotationModule.textMarkupAnnotationModule.
                            printAnnotationsInCanvas(null, printImage.pageNumber, null, null, null, null, null, null);
                    }
                }
                const currentPageNumber: number = printImage.pageNumber;
                this.printCanvas = createElement('canvas', { id: this.pdfViewer.element.id + '_printCanvas_' + pageIndex, className: 'e-pv-print-canvas' }) as HTMLCanvasElement;
                this.printCanvas.style.width = pageWidth + 'px';
                this.printCanvas.style.height = pageHeight + 'px';
                const printScaleValue: number = this.pdfViewer.printScaleFactor > 1 && this.pdfViewer.printScaleFactor <= 5 ?
                    this.pdfViewer.printScaleFactor : this.pdfViewer.printScaleFactor > 5 ? 5 : 2;
                if (this.pdfViewerBase.clientSideRendering) {
                    //An A0 piece of paper measures 33.1 × 46.8 inches, with 46.8 inches being the greater dimension. The pixel value of 46.8 inches is 4493px. If the document size is too large, we may not be able to display the image. Therefore, we should consider the maximum size of A0 paper if the page size is greater than 4493 pixels.
                    const maxPageSize: number = 4493;
                    const whichIsBigger:  'Width' | 'Height' = (pageWidth > pageHeight) ? 'Width' : 'Height';
                    let maxWidth: number = pageWidth;
                    let maxHeight: number = pageHeight;
                    if (whichIsBigger === 'Width') {
                        maxWidth = (pageWidth > maxPageSize) ? maxPageSize : pageWidth;
                        if (maxWidth === maxPageSize) {
                            maxHeight = pageHeight / (pageWidth / maxPageSize);
                        }
                    } else {
                        maxHeight = (pageHeight > maxPageSize) ? maxPageSize : pageHeight;
                        if (maxHeight === maxPageSize) {
                            maxWidth = pageWidth / (pageHeight / maxPageSize);
                        }
                    }
                    if ((pageHeight < pageWidth) && this.pdfViewer.enablePrintRotation) {
                        this.printCanvas.height = pageWidth * printScaleValue * window.devicePixelRatio;
                        this.printCanvas.width = pageHeight * printScaleValue * window.devicePixelRatio;
                    } else {
                        this.printCanvas.height = maxHeight * printScaleValue * window.devicePixelRatio;
                        this.printCanvas.width = maxWidth * printScaleValue * window.devicePixelRatio;
                    }
                } else {
                    this.printCanvas.height = this.printHeight * printScaleValue * window.devicePixelRatio;
                    this.printCanvas.width = this.printWidth * printScaleValue * window.devicePixelRatio;
                }
                if (this.pdfViewerBase.isDeviceiOS) {
                    const size: Size = new Size(this.printCanvas.width, this.printCanvas.height);
                    const newSize: Size = this.limitSize(size, this.maximumPixels);
                    this.printCanvas.width = newSize.width;
                    this.printCanvas.height = newSize.height;
                }
                const context: CanvasRenderingContext2D = this.printCanvas.getContext('2d');
                const pageImage: HTMLImageElement = new Image();
                const annotationImage: HTMLImageElement = new Image();
                const annotationImage1: HTMLImageElement = new Image();
                pageImage.onload = (): void => {
                    this.pdfViewerBase.isPrint = true;
                    if ((pageHeight > pageWidth) || !this.pdfViewer.enablePrintRotation) {
                        context.drawImage(pageImage, 0, 0, this.printCanvas.width, this.printCanvas.height);
                        if (annotationSource && annotationSource.annotImg) {
                            context.drawImage(annotationImage, 0, 0, this.printCanvas.width, this.printCanvas.height);
                        }
                        if (annotationSource && annotationSource.highlightImg) {
                            context.save();
                            context.globalCompositeOperation = 'multiply';
                            context.drawImage(annotationImage1, 0, 0, this.printCanvas.width, this.printCanvas.height);
                            context.restore();
                        }
                    } else {
                        // translate to center canvas
                        context.translate(this.printCanvas.width * 0.5, this.printCanvas.height * 0.5);
                        // rotate the canvas to - 90 degree
                        context.rotate(-0.5 * Math.PI);
                        // un translate the canvas back to origin
                        context.translate(-this.printCanvas.height * 0.5, -this.printCanvas.width * 0.5);
                        // draw the image
                        context.drawImage(pageImage, 0, 0, this.printCanvas.height, this.printCanvas.width);
                        if (annotationSource && annotationSource.annotImg) {
                            context.drawImage(annotationImage, 0, 0, this.printCanvas.height, this.printCanvas.width);
                        }
                        if (annotationSource && annotationSource.highlightImg) {
                            context.save();
                            context.globalCompositeOperation = 'multiply';
                            context.drawImage(annotationImage1, 0, 0, this.printCanvas.height, this.printCanvas.width);
                            context.restore();
                        }
                    }
                    if (currentPageNumber === (this.pdfViewerBase.pageCount - 1)) {
                        this.printWindowOpen();
                    }
                    this.pdfViewer.renderDrawing(null, pageIndex);
                    this.pdfViewerBase.isPrint = false;
                };
                pageImage.src = printImage.image;
                if (annotationSource && !isNullOrUndefined(annotationSource.annotImg)) {
                    annotationImage.src = annotationSource.annotImg;
                }
                if (annotationSource && !isNullOrUndefined(annotationSource.highlightImg)) {
                    annotationImage1.src = annotationSource.highlightImg;
                }
                this.printViewerContainer.appendChild(this.printCanvas);
            }
        }
        this.pdfViewerBase.isPrint = false;
    }

    private limitSize(size: Size, maximumPixels: number): Size {
        const { width, height } = size;
        const requiredPixels: number = width * height;
        if (requiredPixels <= maximumPixels) {
            return new Size(size.width, size.height);
        }
        const scalar: number = Math.sqrt(maximumPixels) / Math.sqrt(requiredPixels);
        return new Size(Math.floor(width * scalar), Math.floor(height * scalar));
    }

    private renderFieldsForPrint(pageIndex: number, heightRatio: number, widthRatio: number): void {
        let data: any = null;
        let targetField: any;
        if (this.pdfViewer.printMode === 'Default') {
            targetField = this.frameDoc.document.getElementById('fields_' + pageIndex);
        } else {
            targetField = this.printWindow.document.getElementById('fields_' + pageIndex);
        }
        if (this.pdfViewer.formFieldsModule) {
            data = this.pdfViewerBase.getItemFromSessionStorage('_formfields');
        }
        if (!this.pdfViewer.formDesignerModule) {
            if (data) {
                const formFieldsData: any = JSON.parse(data);
                for (let i: number = 0; i < formFieldsData.length; i++) {
                    const currentData: any = formFieldsData[parseInt(i.toString(), 10)];
                    if (parseFloat(currentData['PageIndex']) === pageIndex) {
                        const field: any = this.pdfViewer.formFieldsModule.createFormFields(currentData, pageIndex, i, targetField);
                        const inputField: any = field.currentField;
                        if (inputField) {
                            const bounds: any = currentData['LineBounds'];
                            const font: any = currentData['Font'];
                            this.applyPosition(inputField, bounds, font, heightRatio, widthRatio);
                            inputField.InsertSpaces = currentData.InsertSpaces;
                            if (inputField.InsertSpaces) {
                                const font: number = ((parseInt(inputField.style.width, 10) / inputField.maxLength) -
                                (parseFloat(inputField.style.fontSize) / 2)) - 0.6;
                                inputField.style.letterSpacing = '' + font + 'px';
                                inputField.style.fontFamily = 'monospace';
                            }
                            const pageDetails: any = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
                            if ((pageDetails.width > pageDetails.height) && this.pdfViewer.enablePrintRotation) {
                                /*
                                The below logig have been modified for the bug https://syncfusion.atlassian.net/browse/EJ2-57986
                                This code changes is specific for form field elements.

                                    inputField.style.transform = 'rotate(-90deg)';
                                    let previousLeft: number = parseFloat(inputField.style.left);
                                    let currentWidthPosition: number = parseFloat(inputField.style.width) / 2;
                                    let currentHeightPosition: number = parseFloat(inputField.style.height) / 2;
                                    let currentTop: number = parseFloat(inputField.style.top);
                                    let currentHeight: number = parseFloat(inputField.style.height);
                                    inputField.style.left = (currentHeightPosition - currentWidthPosition + currentTop) + 'px';
                                    inputField.style.top = (pageDetails.width / widthRatio) - (currentHeight / heightRatio) - ((currentWidthPosition / heightRatio) - (currentHeightPosition / heightRatio) + previousLeft) + 'px';
                                */
                                const x: number = this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.X);
                                const y: number = this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.Y);
                                const width: number = this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.Width);
                                const height: number = this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.Height);
                                const pageHeight: any = pageDetails.width;
                                const top: number = pageHeight - x - height;
                                const left: number = (y + height);
                                inputField.style.transform = 'rotate(-90deg)';
                                inputField.style.transformOrigin = 'left bottom';
                                inputField.style.left = left + 'px';
                                inputField.style.top = top + 'px';
                                inputField.style.height = height + 'px';
                                inputField.style.width = width + 'px';

                            }
                            inputField.style.backgroundColor = 'transparent';
                            if (!currentData.IsSignatureField) {
                                inputField.style.borderColor = 'transparent';
                            }
                            targetField.appendChild(inputField);
                        }
                    }
                }
            }
        }
        else {
            let formDesignerData: any = null;
            if (this.pdfViewer.formDesignerModule) {
                formDesignerData = this.pdfViewerBase.getItemFromSessionStorage('_formDesigner');
            }
            if (formDesignerData || this.pdfViewer.formFieldCollections.length > 0) {
                const formFieldsData: any = !isNullOrUndefined(formDesignerData) ? JSON.parse(formDesignerData) : [];
                this.pdfViewer.formDesignerModule.updateMissingFormFields(formFieldsData);
                const formDesignerFieldsData : any = formFieldsData;
                for (let i: number = 0; i < formDesignerFieldsData.length; i++) {
                    const currentData: any = formDesignerFieldsData[parseInt(i.toString(), 10)].FormField;
                    if (currentData.pageNumber - 1 === pageIndex && currentData.isPrint) {
                        let signatureField: PdfAnnotationBaseModel = (this.pdfViewer.nameTable as any)[formDesignerFieldsData[parseInt(i.toString(), 10)].Key.split('_')[0]];
                        let element: DiagramHtmlElement = null;
                        if (!isNullOrUndefined(signatureField)) {
                            element = signatureField.wrapper.children[0] as DiagramHtmlElement;
                        } else {
                            signatureField = this.createSignatureField(currentData);
                            element = signatureField.wrapper.children[0] as DiagramHtmlElement;
                        }
                        let htmlElement: HTMLElement;
                        if (element) {
                            if (currentData.formFieldAnnotationType === 'RadioButton') {
                                for (let j: number = 0; j < currentData.radiobuttonItem.length; j++) {
                                    signatureField = (this.pdfViewer.nameTable as any)[currentData.radiobuttonItem[parseInt(j.toString(), 10)].id.split('_')[0]];
                                    if (isNullOrUndefined(signatureField)) {
                                        signatureField = this.createSignatureField(currentData.radiobuttonItem[parseInt(j.toString(), 10)]);
                                    }
                                    htmlElement = this.createFormDesignerFields(currentData.radiobuttonItem[parseInt(j.toString(), 10)],
                                                                                element, signatureField);
                                    if (htmlElement) {
                                        const bounds: any = currentData.radiobuttonItem[parseInt(j.toString(), 10)].lineBound;
                                        const font: any = currentData.radiobuttonItem[parseInt(j.toString(), 10)].fontFamily;
                                        this.applyPosition(htmlElement, bounds, font, heightRatio, widthRatio, true,
                                                           currentData.radiobuttonItem[parseInt(j.toString(), 10)].zoomValue,
                                                           currentData.pageNumber - 1);
                                        targetField.appendChild(htmlElement);
                                    }
                                }
                            } else {
                                htmlElement = this.createFormDesignerFields(currentData, element, signatureField);
                                if (htmlElement) {
                                    const bounds: any = currentData.lineBound;
                                    const font: any = currentData.fontFamily;
                                    this.applyPosition(htmlElement, bounds, font, heightRatio, widthRatio, true,
                                                       currentData.zoomValue, currentData.pageNumber - 1);
                                    if (!isNullOrUndefined(bounds) && bounds.Width > 0 && bounds.Height > 0) {
                                        targetField.appendChild(htmlElement);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private createSignatureField(data: any): PdfFormFieldBaseModel {
        const cloneCurrentData: any = JSON.parse(JSON.stringify(data));
        if (data.lineBound) {
            const { X: x, Y: y, Width: width, Height: height } = data.lineBound;
            cloneCurrentData.bounds = { x, y, width, height };
            delete cloneCurrentData.lineBound;
        }
        if (data.option && (data.formFieldAnnotationType === 'DropdownList' || data.formFieldAnnotationType === 'ListBox')) {
            cloneCurrentData.options = cloneCurrentData.option;
            delete cloneCurrentData.option;
        }
        const signatureField: PdfFormFieldBase = new PdfFormFieldBase(this.pdfViewer, 'formFields', cloneCurrentData as PdfFormFieldBase, true);
        this.pdfViewer.drawing.initNode(signatureField);
        signatureField.backgroundColor = typeof signatureField.backgroundColor === 'string' ?
            signatureField.backgroundColor :
            this.pdfViewer.formDesignerModule.getRgbToHex(signatureField.backgroundColor);
        signatureField.borderColor = typeof signatureField.borderColor === 'string' ?
            signatureField.borderColor :
            this.pdfViewer.formDesignerModule.getRgbToHex(signatureField.borderColor);
        return signatureField as unknown as PdfFormFieldBaseModel;
    }

    private createFormDesignerFields(currentData: any, element: any, signatureField: any): HTMLElement {
        const parentHtmlElementAttribute: Object = {
            'id': 'form_field_' + element.id + '_html_element',
            'class': 'foreign-object'
        };
        const parentHtmlElement: HTMLElement = this.pdfViewer.formDesignerModule.createHtmlElement('div', parentHtmlElementAttribute);
        const HtmlElementAttribute: Object = {
            'id': element.id + '_html_element',
            'class': 'foreign-object'
        };
        const htmlElement: HTMLElement = this.pdfViewer.formDesignerModule.createHtmlElement('div', HtmlElementAttribute);
        if (currentData.formFieldAnnotationType === 'SignatureField' || currentData.formFieldAnnotationType === 'InitialField') {
            this.pdfViewer.formDesignerModule.disableSignatureClickEvent = true;
            element.template = htmlElement.appendChild(this.pdfViewer.formDesignerModule.
                createSignatureDialog(this.pdfViewer, signatureField, null, true));
            this.pdfViewer.formDesignerModule.disableSignatureClickEvent = false;
        } else if (currentData.formFieldAnnotationType === 'DropdownList') {
            element.template = htmlElement.appendChild(this.pdfViewer.formDesignerModule.createDropDownList(element, signatureField, true));
        } else if (currentData.formFieldAnnotationType === 'ListBox') {
            element.template = htmlElement.appendChild(this.pdfViewer.formDesignerModule.createListBox(element, signatureField, true));
        } else {
            element.template = htmlElement.appendChild(this.pdfViewer.formDesignerModule.
                createInputElement(currentData.formFieldAnnotationType, signatureField, null, true));
        }
        parentHtmlElement.appendChild(htmlElement);
        return htmlElement;
    }

    /**
     * @param {any} inputField - It describes about the input field
     * @param {any} bounds - It describes about the bounds
     * @param {any} font - It describes about the font
     * @param {number} heightRatio - It describes about the height ratio
     * @param {number} widthRatio - It describes about the width ratio
     * @param {boolean} isFormDesignerField - It describes about the isFormDesignerField
     * @param {number} zoomValue - It describes about the zoom value
     * @param {number} pageIndex - It describes about the page index value
     * @private
     * @returns {void}
     */
    public applyPosition(inputField: any, bounds: any, font: any, heightRatio: number, widthRatio: number,
                         isFormDesignerField?: boolean, zoomValue?: number, pageIndex?: number): void {
        if (bounds) {
            let pageHeight: any;
            let left: number;
            let top: number;
            let width: number;
            let height: number;
            // This code changes is specific for form designer elements. https://syncfusion.atlassian.net/browse/EJ2-57986
            // eslint-disable-next-line
            const pageDetails: any = this.pdfViewerBase.pageSize[pageIndex];
            const actualWidth: number = pageDetails ? pageDetails.width : 0;
            const actualHeight: number = pageDetails ? pageDetails.height : 0;
            if (isFormDesignerField && actualHeight < actualWidth && this.pdfViewer.enablePrintRotation) {
                /*
                The below logig have been modified for the bug https://syncfusion.atlassian.net/browse/EJ2-57986
                This code changes is specific for form designer elements.
                pageHeight = actualWidth;
                top=  pageHeight - bounds.X / zoomValue;
                left = bounds.Y / zoomValue;
                width = (bounds.Width / zoomValue);
                height = (bounds.Height / zoomValue);
                inputField.style.transform = "rotate(-90deg)";
                inputField.style.transformOrigin = "top left";
                */
                // need to set inverse page height and width
                pageHeight = actualWidth;
                top = pageHeight - bounds.X / zoomValue - bounds.Height / zoomValue;
                left = (bounds.Y + bounds.Height) / zoomValue;
                width = (bounds.Width / zoomValue);
                height = (bounds.Height / zoomValue);
                inputField.style.transform = 'rotate(-90deg)';
                inputField.style.transformOrigin = 'left bottom';
            }
            else {
                left = isFormDesignerField ? (bounds.X / zoomValue) / widthRatio :
                    (this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.X)) / widthRatio;
                top = isFormDesignerField ? (bounds.Y / zoomValue) / heightRatio :
                    (this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.Y)) / heightRatio;
                width = isFormDesignerField ? (bounds.Width / zoomValue) / widthRatio :
                    (this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.Width)) / widthRatio;
                height = isFormDesignerField ? (bounds.Height / zoomValue) / heightRatio :
                    (this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.Height)) / heightRatio;
            }
            let fontHeight: number = 0;
            if (font !== null && font.Height) {
                inputField.style.fontFamily = font.Name;
                if (font.Italic) {
                    inputField.style.fontStyle = 'italic';
                }
                if (font.Bold) {
                    inputField.style.fontWeight = 'Bold';
                }
                fontHeight = this.pdfViewerBase.ConvertPointToPixel(font.Size);
            }
            if (Browser.isIE) {
                top = top - 1;
            }
            this.pdfViewerBase.setStyleToTextDiv(inputField, left, top, fontHeight, width, height, true);
        }
    }

    /**
     * @param {any} printDocument - It describes printdocument element
     * @param {string} styleContent - It describes styles text content
     * @private
     * @returns {void}
     */
    private createStyleSheet(printDocument: any, styleContent: string): void {
        const blob: any = new Blob([styleContent], { type: 'text/css' });
        const linkElement: any = printDocument.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = URL.createObjectURL(blob);
        printDocument.head.appendChild(linkElement);
    }

    private printWindowOpen(): void {
        const browserUserAgent: string = navigator.userAgent;
        let printDocument: any;
        if (this.pdfViewer.printMode === 'Default') {
            printDocument = this.frameDoc.document;
        } else {
            printDocument = this.printWindow.document;
        }
        for (let i: number = 0; i < this.printViewerContainer.children.length; i++) {
            /*
            Create a new Base64-encoded image with increased quality
            Also help to reduce the file size while save as pdf
            */
            if (i === 0) {
                printDocument.write('<!DOCTYPE html>');
                printDocument.write('<html moznomarginboxes mozdisallowselectionprint><head></head><body>');
            }
            const canvasUrl: string = (this.printViewerContainer.children[parseInt(i.toString(), 10)] as HTMLCanvasElement).toDataURL('image/jpeg');
            printDocument.write('<div id="' + 'imageElementPdf_' + i + '"><img src="' + canvasUrl + '" id="' + 'image_' + i + '" /><div id="' + 'fields_' + i + '"></div></div>');
            const imageElement: any = printDocument.getElementById('imageElementPdf_' + i);
            imageElement.style.cssText = `margin:0mm;width:${this.printWidth}px;height:${this.printHeight}px;position:relative`;
            const fieldElement: any = printDocument.getElementById('fields_' + i);
            fieldElement.style.cssText = `margin:0px;top:0px;left:0px;position:absolute;width:${this.printWidth}px;height:${this.printHeight}px;z-index:2`;
            if (this.pdfViewer.formFieldsModule || this.pdfViewer.formDesignerModule) {
                const pageWidth: number = this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].width;
                const pageHeight: number = this.pdfViewerBase.pageSize[parseInt(i.toString(), 10)].height;
                let heightRatio: number;
                let widthRatio: number;
                if ((pageHeight < pageWidth) && this.pdfViewer.enablePrintRotation) {
                    heightRatio = pageHeight / this.printWidth;
                    widthRatio = pageWidth / this.printHeight;
                } else {
                    heightRatio = pageHeight / this.printHeight;
                    widthRatio = pageWidth / this.printWidth;
                }
                this.renderFieldsForPrint(i, heightRatio, widthRatio);
            }
            if (i === 0) {
                if ((browserUserAgent.indexOf('Chrome') !== -1) || (browserUserAgent.indexOf('Safari') !== -1) ||
                    (browserUserAgent.indexOf('Firefox')) !== -1) {
                    const styleContent: string = `
                        html, body { height: 100%; width: 100%; }
                        img { height: 100%; width: 100%; display: block; }
                        @media print { 
                            body { margin: 0cm; }
                            img { width: 100%; box-sizing: border-box; }
                            br, button { display: none; }
                            div { page-break-inside: avoid; }
                        }
                        @page { margin: 0mm; size: ${this.printWidth.toString()}px ${this.printHeight.toString()}px; }
                    `;
                    this.createStyleSheet(printDocument, styleContent);
                }
                else {
                    const styleContent: string = `
                        html, body { height: 100%; }
                        img { height: 100%; width: 100%; }
                        @media print { 
                            body { margin: 0cm; }
                            img { width: 100%; box-sizing: border-box; }
                            br, button { display: none; }
                            div { page-break-inside: avoid; }
                        }
                        @page { margin: 0mm; size: ${this.printWidth.toString()}px ${this.printHeight.toString()}px; }
                    `;
                    this.createStyleSheet(printDocument, styleContent);
                }
            }
        }
        if (Browser.isIE || Browser.info.name === 'edge') {
            try {
                if (this.pdfViewer.printMode === 'Default') {
                    this.pdfViewerBase.showPrintLoadingIndicator(false);
                    this.iframe.contentWindow.document.execCommand('print', false, null);
                } else {
                    this.printWindow.document.execCommand('print', false, null);
                }
            } catch (e) {
                if (this.pdfViewer.printMode === 'Default') {
                    this.pdfViewerBase.showPrintLoadingIndicator(false);
                    this.iframe.contentWindow.print();
                } else {
                    this.printWindow.print();
                }
            }
        } else {
            setTimeout(() => {
                if (this.pdfViewer.printMode === 'Default') {
                    this.pdfViewerBase.showPrintLoadingIndicator(false);
                    this.iframe.contentWindow.print();
                    this.iframe.contentWindow.focus();
                    if (this.pdfViewerBase.isDeviceiOS || Browser.isDevice){
                        // eslint-disable-next-line
                        const proxy = this;
                        window.onafterprint = function (): void{
                            document.body.removeChild(proxy.iframe);
                        };
                    }
                    else{
                        document.body.removeChild(this.iframe);
                    }
                } else {
                    if (this.printWindow) {
                        this.printWindow.print();
                        this.printWindow.focus();
                        if (!Browser.isDevice || this.pdfViewerBase.isDeviceiOS){
                            this.printWindow.close();
                        }
                    }
                }
            }, 200);
        }
    }

    private createPrintLoadingIndicator(element: any): void {
        const printWindowContainer: any = createElement('div', {
            id: this.pdfViewer.element.id + '_printWindowcontainer'
        });
        printWindowContainer.style.height = '100%';
        printWindowContainer.style.width = '100%';
        printWindowContainer.style.position = 'absolute';
        printWindowContainer.style.zIndex = 2000;
        printWindowContainer.style.left = 0;
        printWindowContainer.style.top = 0;
        printWindowContainer.style.overflow = 'auto';
        printWindowContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        element.appendChild(printWindowContainer);
        const printWaitingPopup: HTMLElement = createElement('div', {
            id: this.pdfViewer.element.id + '_printLoadingContainer'
        });
        printWaitingPopup.style.position = 'absolute';
        printWaitingPopup.style.width = '50px';
        printWaitingPopup.style.height = '50px';
        printWaitingPopup.style.left = '46%';
        printWaitingPopup.style.top = '45%';
        printWindowContainer.style.zIndex = 3000;
        printWindowContainer.appendChild(printWaitingPopup);
        const printImageContainer: HTMLImageElement = new Image();
        printImageContainer.src = 'data:image/gif;base64,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';
        printImageContainer.style.width = '50px';
        printImageContainer.style.height = '50px';
        printWaitingPopup.appendChild(printImageContainer);
        const printLabelContainer: HTMLElement = createElement('div', {
            id: this.pdfViewer.element.id + '_printLabelContainer'
        });
        printLabelContainer.style.position = 'absolute';
        printLabelContainer.textContent = 'Loading ...';
        printLabelContainer.style.fontWeight = 'Bold';
        printLabelContainer.style.left = '46%';
        printLabelContainer.style.top = '54.5%';
        printLabelContainer.style.zIndex = '3000';
        printWindowContainer.appendChild(printLabelContainer);
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.printViewerContainer = undefined;
        this.frameDoc = undefined;
        this.printWindow = undefined;
    }
    /**
     * @private
     * @returns {string} - string
     */
    public getModuleName(): string {
        return 'Print';
    }
}
