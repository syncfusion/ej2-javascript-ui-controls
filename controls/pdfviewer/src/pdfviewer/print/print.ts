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
            this.pdfViewerBase.showPrintLoadingIndicator(true);
            this.iframe = document.createElement('iframe');
            this.iframe.className = 'iframeprint';
            this.iframe.id = 'iframePrint';
            this.iframe.style.position = 'absolute';
            this.iframe.style.top = '-100000000px';
            document.body.appendChild(this.iframe);
            this.frameDoc = this.iframe.contentWindow ? this.iframe.contentWindow : this.iframe.contentDocument;
            this.frameDoc.document.open();
            setTimeout(
                () => {
                    for (pageIndex = 0; pageIndex < this.pdfViewerBase.pageCount; pageIndex++) {
                        let pageWidth: number = this.pdfViewerBase.pageSize[pageIndex].width;
                        let pageHeight: number = this.pdfViewerBase.pageSize[pageIndex].height;
                        this.pdfViewer.printModule.createRequestForPrint(pageIndex, pageWidth, pageHeight, this.pdfViewerBase.pageCount);
                    }
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
        proxy.printRequestHandler = new AjaxHandler(proxy.pdfViewer);
        proxy.printRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.print;
        proxy.printRequestHandler.responseType = null;
        proxy.printRequestHandler.mode = false;
        proxy.printRequestHandler.send(jsonObject);
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
                if (proxy.pdfViewer.annotationSettings.isPrint) {
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
                            annotationSource = proxy.pdfViewer.annotationModule.textMarkupAnnotationModule.printTextMarkupAnnotations(textMarkupAnnotation, pageIndex, stampAnnotation, shapeAnnotation, measureShapeAnnotation, stickyNoteAnnotation);
                        } else {
                            // tslint:disable-next-line:max-line-length
                            annotationSource = proxy.pdfViewer.annotationModule.textMarkupAnnotationModule.printTextMarkupAnnotations(printCollection.textMarkupAnnotation, pageIndex, printCollection.stampAnnotations, printCollection.shapeAnnotation, printCollection.measureShapeAnnotation, printCollection.stickyNoteAnnotation);
                        }
                    }
                    if (proxy.pdfViewerBase.isAnnotationCollectionRemoved) {
                        // tslint:disable-next-line:max-line-length
                        annotationSource = proxy.pdfViewer.annotationModule.textMarkupAnnotationModule.printTextMarkupAnnotations(null, pageIndex, null, null, null, null);
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
        for (let i: number = 0; i < formFieldsData.length; i++) {
            // tslint:disable-next-line
            let currentData: any = formFieldsData[i];
            // tslint:disable-next-line
            if (parseFloat(currentData['PageIndex']) === pageIndex) {
                // tslint:disable-next-line
                let targetField: any = this.frameDoc.document.getElementById('fields_' + pageIndex);
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
        } else {
            //ie
            this.frameDoc.document.write('<!DOCTYPE html>');
            // tslint: disable-next-line:max-line-length
            this.frameDoc.document.write('<html><head>'
                + '<style>html, body { height: 100%; } img { height: 100%; width: 100%; }@media print { body { margin: 0cm; }'
                + 'img { width:100%; max-width: 1048px; box-sizing: border-box; }br, button { display: none; } '
                // set default page Height and page Width for A4 size.
                + 'div{ page-break-inside: avoid; }} @page{margin:0mm; size: 816px 1056px;}</style></head><body><center>');
        }
        for (let i: number = 0; i < this.printViewerContainer.children.length; i++) {
            // tslint:disable-next-line:max-line-length
            let canvasUrl: string = (this.printViewerContainer.children[i] as HTMLCanvasElement).toDataURL();
            this.frameDoc.document.write('<div style="margin:0mm;width:816px;height:1056px;position:relative"><img src="' + canvasUrl + '" id="' + 'image_' + i + '" /><div id="' + 'fields_' + i + '" style="margin:0px;top:0px;left:0px;position:absolute;width:816px;height:1056px;z-index:2"></div></div>');
            if (this.pdfViewer.formFieldsModule) {
                let pageWidth: number = this.pdfViewerBase.pageSize[i].width;
                let pageHeight: number = this.pdfViewerBase.pageSize[i].height;
                let heightRatio: number = pageHeight / 1056;
                let widthRatio: number = pageWidth / 816;
                this.renderFieldsForPrint(i, heightRatio, widthRatio);
            }
        }
        this.pdfViewerBase.showPrintLoadingIndicator(false);
        if (Browser.isIE || Browser.info.name === 'edge') {
            try {
                this.iframe.contentWindow.document.execCommand('print', false, null);
            } catch (e) {
                this.iframe.contentWindow.print();
            }
        } else {
            setTimeout(
                () => {
                    this.iframe.contentWindow.print();
                    this.iframe.contentWindow.focus();
                    document.body.removeChild(this.iframe);
                },
                200);
        }
    }
    /**
     * @private
     */
    public destroy(): void {
        this.printViewerContainer = undefined;
        this.frameDoc = undefined;
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'Print';
    }

}
