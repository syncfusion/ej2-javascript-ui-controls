import { PdfViewer } from '../index';
import { PdfViewerBase } from '../index';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { AjaxHandler } from '../index';
/**
 * Print module
 */
export class Print {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private printViewerContainer: HTMLElement;
    private printCanvas: HTMLCanvasElement;
    private printRequestHandler: AjaxHandler;
    // tslint:disable-next-line
    private frameDoc: any;
    // tslint:disable-next-line
    private iframe: any;
    private printWindow: Window;

    /**
     * @private
     */
    constructor(viewer: PdfViewer, base: PdfViewerBase) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * Print the PDF document being loaded in the ejPdfViewer control.
     * @returns void
     */
    public print(): void {
        let pageIndex: number;
        if (this.pdfViewerBase.pageCount > 0) {
            // tslint:disable-next-line:max-line-length
            this.printViewerContainer = createElement('div', {
                id: this.pdfViewer.element.id + '_print_viewer_container',
                className: 'e-pv-print-viewer-container'
            });
            if (this.pdfViewer.printMode === 'Default') {
                this.pdfViewerBase.showPrintLoadingIndicator(true);
                this.iframe = document.createElement('iframe');
                this.iframe.className = 'iframeprint';
                this.iframe.id = 'iframePrint';
                this.iframe.style.position = 'absolute';
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
                        let pageWidth: number = this.pdfViewerBase.pageSize[pageIndex].width;
                        let pageHeight: number = this.pdfViewerBase.pageSize[pageIndex].height;
                        this.pdfViewer.printModule.createRequestForPrint(pageIndex, pageWidth, pageHeight, this.pdfViewerBase.pageCount);
                    }
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.firePrintEnd(this.pdfViewer.downloadFileName ? this.pdfViewer.downloadFileName : this.pdfViewer.fileName);
                },
                100);
        }
    }

    private createRequestForPrint(pageIndex: number, pageWidth: number, pageHeight: number, pageCount: number): void {
        let proxy: Print = this;
        // tslint: disable-next-line:max-line-length
        // set default zoomFactor value.  
        let jsonObject: object = {
            pageNumber: pageIndex, documentId: this.pdfViewerBase.documentId,
            hashId: this.pdfViewerBase.hashId, zoomFactor: 1,
            action: 'PrintImages',
            elementId: this.pdfViewer.element.id,
            uniqueId: this.pdfViewerBase.documentId
        };
        if (this.pdfViewerBase.jsonDocumentId) {
            // tslint:disable-next-line
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
            proxy.printRequestHandler.send(jsonObject);
        }
        // tslint:disable-next-line
        proxy.printRequestHandler.onSuccess = function (result: any) {
            // tslint:disable-next-line
            let printImage: any = result.data;
            if (printImage) {
                if (typeof printImage !== 'object') {
                    try {
                        printImage = JSON.parse(printImage);
                        if (typeof printImage !== 'object') {
                            proxy.pdfViewerBase.onControlError(500, printImage, proxy.pdfViewer.serverActionSettings.print);
                            printImage = null;
                        }
                    } catch (error) {
                        proxy.pdfViewerBase.onControlError(500, printImage, proxy.pdfViewer.serverActionSettings.print);
                        printImage = null;
                    }
                }
            }
            if (printImage && printImage.uniqueId === proxy.pdfViewerBase.documentId) {
                let annotationSource: string = '';
                if (!proxy.pdfViewer.annotationSettings.skipPrint) {
                    // tslint:disable-next-line
                    let annotationCollections: any = proxy.pdfViewerBase.documentAnnotationCollections;
                    if (annotationCollections && annotationCollections[printImage.pageNumber] && proxy.pdfViewerBase.isTextMarkupAnnotationModule()) {
                        // tslint:disable-next-line
                        let printCollection: any = annotationCollections[printImage.pageNumber];
                        if (proxy.pdfViewerBase.isImportAction) {
                            let textMarkupAnnotation: number[] = printCollection.textMarkupAnnotation;
                            let shapeAnnotation: number[] = printCollection.shapeAnnotation;
                            let measureShapeAnnotation: number[] = printCollection.measureShapeAnnotation;
                            let stampAnnotation: number[] = printCollection.stampAnnotations;
                            // tslint:disable-next-line
                            let stickyNoteAnnotation: any = printCollection.stickyNotesAnnotation;
                            // tslint:disable-next-line:max-line-length
                            annotationSource = proxy.pdfViewer.annotationModule.textMarkupAnnotationModule.printTextMarkupAnnotations(textMarkupAnnotation, printImage.pageNumber, stampAnnotation, shapeAnnotation, measureShapeAnnotation, stickyNoteAnnotation);
                        } else {
                            // tslint:disable-next-line:max-line-length
                            annotationSource = proxy.pdfViewer.annotationModule.textMarkupAnnotationModule.printTextMarkupAnnotations(printCollection.textMarkupAnnotation, printImage.pageNumber, printCollection.stampAnnotations, printCollection.shapeAnnotation, printCollection.measureShapeAnnotation, printCollection.stickyNoteAnnotation);
                        }
                    }
                    if (proxy.pdfViewerBase.isAnnotationCollectionRemoved) {
                        // tslint:disable-next-line:max-line-length
                        annotationSource = proxy.pdfViewer.annotationModule.textMarkupAnnotationModule.printTextMarkupAnnotations(null, printImage.pageNumber, null, null, null, null);
                    }
                }
                let currentPageNumber: number = printImage.pageNumber;
                // tslint:disable-next-line:max-line-length
                proxy.printCanvas = createElement('canvas', { id: proxy.pdfViewer.element.id + '_printCanvas_' + pageIndex, className: 'e-pv-print-canvas' }) as HTMLCanvasElement;
                proxy.printCanvas.style.width = pageWidth + 'px';
                proxy.printCanvas.style.height = pageHeight + 'px';
                let printScaleValue: number = 1.5;
                proxy.printCanvas.height = 1056 * printScaleValue * window.devicePixelRatio;
                proxy.printCanvas.width = 816 * printScaleValue * window.devicePixelRatio;
                let context: CanvasRenderingContext2D = proxy.printCanvas.getContext('2d');
                let pageImage: HTMLImageElement = new Image();
                let annotationImage: HTMLImageElement = new Image();
                pageImage.onload = (): void => {
                    if (pageHeight > pageWidth) {
                        context.drawImage(pageImage, 0, 0, proxy.printCanvas.width, proxy.printCanvas.height);
                        if (annotationSource) {
                            context.drawImage(annotationImage, 0, 0, proxy.printCanvas.width, proxy.printCanvas.height);
                        }
                    } else {
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
                    if (currentPageNumber === (proxy.pdfViewerBase.pageCount - 1)) {
                        proxy.printWindowOpen();
                    }
                    proxy.pdfViewer.renderDrawing(null, pageIndex);
                };
                pageImage.src = printImage.image;
                annotationImage.src = annotationSource;
                proxy.printViewerContainer.appendChild(proxy.printCanvas);
            }
        };
        // tslint:disable-next-line
        this.printRequestHandler.onFailure = function (result: any) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.print);
        };
        // tslint:disable-next-line
        this.printRequestHandler.onError = function (result: any) {
            proxy.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.print);
        };
    }
    // tslint:disable-next-line
    private renderFieldsForPrint(pageIndex: number, heightRatio: number, widthRatio: number): any {
        // tslint:disable-next-line
        let data: any = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        // tslint:disable-next-line
        let formFieldsData: any = JSON.parse(data);
        if (formFieldsData) {
            for (let i: number = 0; i < formFieldsData.length; i++) {
                // tslint:disable-next-line
                let currentData: any = formFieldsData[i];
                // tslint:disable-next-line
                if (parseFloat(currentData['PageIndex']) === pageIndex) {
                    // tslint:disable-next-line
                    let targetField: any;
                    if (this.pdfViewer.printMode === 'Default') {
                        targetField = this.frameDoc.document.getElementById('fields_' + pageIndex);
                    } else {
                        targetField = this.printWindow.document.getElementById('fields_' + pageIndex);
                    }
                    // tslint:disable-next-line
                    let inputField: any = this.pdfViewer.formFieldsModule.createFormFields(currentData, pageIndex, i, targetField);
                    if (inputField) {
                        // tslint:disable-next-line
                        let bounds: any = currentData['LineBounds'];
                        // tslint:disable-next-line
                        let font: any = currentData['Font'];
                        this.applyPosition(inputField, bounds, font, heightRatio, widthRatio);
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
    /**
     * @private
     */
    // tslint:disable-next-line
    public applyPosition(inputField: any, bounds: any, font: any, heightRatio: number, widthRatio: number): any {
        if (bounds) {
            let left: number = (this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.X)) / widthRatio;
            let top: number = (this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.Y)) / heightRatio;
            let width: number = (this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.Width)) / widthRatio;
            let height: number = (this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.Height)) / heightRatio;
            let fontHeight: number = 0;
            if (font !== null && font.Height) {
                inputField.style.fontfamily = font.Name;
                if (font.Italic) {
                    inputField.style.fontStyle = 'italic';
                }
                if (font.Bold) {
                    inputField.style.fontWeight = 'Bold';
                }
                fontHeight = this.pdfViewer.formFieldsModule.ConvertPointToPixel(font.Size);
            }
            if (Browser.isIE) {
                top = top - 1;
            }
            this.pdfViewer.formFieldsModule.setStyleToTextDiv(inputField, left, top, fontHeight, width, height, true);
        }
    }
    private printWindowOpen(): void {
        let browserUserAgent: string = navigator.userAgent;
        // tslint:disable-next-line
        let printDocument: any;
        if (this.pdfViewer.printMode === 'Default') {
            printDocument = this.frameDoc.document;
        } else {
            printDocument = this.printWindow.document;
        }
        // tslint: disable-next-line:max-line-length
        if ((browserUserAgent.indexOf('Chrome') !== -1) || (browserUserAgent.indexOf('Safari') !== -1) ||
            (browserUserAgent.indexOf('Firefox')) !== -1) {
            //chrome and firefox
            printDocument.write('<!DOCTYPE html>');
            // tslint: disable-next-line:max-line-length
            printDocument.write('<html moznomarginboxes mozdisallowselectionprint><head><style>html, body { height: 100%; }'
                + ' img { height: 100%; width: 100%; display: block; }@media print { body { margin: 0cm; }'
                + ' img { width:100%; max-width: 1048px; box-sizing: border-box; }br, button { display: none; }'
                // set default page Height and page Width for A4 size.
                + ' div{ page-break-inside: avoid; }} @page{margin:0mm; size: 816px 1056px;}</style></head><body><center class="loader">');
        } else {
            //ie
            printDocument.write('<!DOCTYPE html>');
            // tslint: disable-next-line:max-line-length
            printDocument.write('<html><head>'
                + '<style>html, body { height: 100%; } img { height: 100%; width: 100%; }@media print { body { margin: 0cm; }'
                + 'img { width:100%; max-width: 1048px; box-sizing: border-box; }br, button { display: none; } '
                // set default page Height and page Width for A4 size.
                + 'div{ page-break-inside: avoid; }} @page{margin:0mm; size: 816px 1056px;}</style></head><body><center>');
        }
        for (let i: number = 0; i < this.printViewerContainer.children.length; i++) {
            // tslint:disable-next-line:max-line-length
            let canvasUrl: string = (this.printViewerContainer.children[i] as HTMLCanvasElement).toDataURL();
            printDocument.write('<div style="margin:0mm;width:816px;height:1056px;position:relative"><img src="' + canvasUrl + '" id="' + 'image_' + i + '" /><div id="' + 'fields_' + i + '" style="margin:0px;top:0px;left:0px;position:absolute;width:816px;height:1056px;z-index:2"></div></div>');
            if (this.pdfViewer.formFieldsModule) {
                let pageWidth: number = this.pdfViewerBase.pageSize[i].width;
                let pageHeight: number = this.pdfViewerBase.pageSize[i].height;
                let heightRatio: number = pageHeight / 1056;
                let widthRatio: number = pageWidth / 816;
                this.renderFieldsForPrint(i, heightRatio, widthRatio);
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
            setTimeout(
                () => {
                    if (this.pdfViewer.printMode === 'Default') {
                        this.pdfViewerBase.showPrintLoadingIndicator(false);
                        this.iframe.contentWindow.print();
                        this.iframe.contentWindow.focus();
                        document.body.removeChild(this.iframe);
                    } else {
                        if (this.printWindow) {
                            this.printWindow.print();
                            this.printWindow.focus();
                            this.printWindow.close();
                        }
                    }
                },
                200);
        }
    }

    // tslint:disable-next-line
    private createPrintLoadingIndicator(element: any): void {
        // tslint:disable-next-line
        let printWindowContainer: any = createElement('div', {
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
        let printWaitingPopup: HTMLElement = createElement('div', {
            id: this.pdfViewer.element.id + '_printLoadingContainer'
        });
        printWaitingPopup.style.position = 'absolute';
        printWaitingPopup.style.width = '50px';
        printWaitingPopup.style.height = '50px';
        printWaitingPopup.style.left = '46%';
        printWaitingPopup.style.top =  '45%';
        printWindowContainer.style.zIndex = 3000;
        printWindowContainer.appendChild(printWaitingPopup);
        // tslint:disable-next-line
        let printImageContainer: any = new Image();
        // tslint:disable-next-line
        printImageContainer.src = 'data:image/gif;base64,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';
        printImageContainer.style.width = '50px';
        printImageContainer.style.height = '50px';
        printWaitingPopup.appendChild(printImageContainer);
        let printLabelContainer: HTMLElement = createElement('div', {
            id: this.pdfViewer.element.id + '_printLabelContainer'
        });
        printLabelContainer.style.position = 'absolute';
        printLabelContainer.textContent = 'Loading ...';
        printLabelContainer.style.fontWeight = 'Bold';
        printLabelContainer.style.left = '46%';
        printLabelContainer.style.top =  '54.5%';
        printLabelContainer.style.zIndex = '3000';
        printWindowContainer.appendChild(printLabelContainer);
    }

    /**
     * @private
     */
    public destroy(): void {
        this.printViewerContainer = undefined;
        this.frameDoc = undefined;
        this.printWindow = undefined;
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'Print';
    }

}
