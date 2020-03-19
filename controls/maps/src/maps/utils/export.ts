import { print as printWindow, createElement, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { Maps } from '../../index';
import { getElement } from '../utils/helper';
import { ExportType } from '../utils/enum';
import { IPrintEventArgs } from '../model/interface';
import { beforePrint } from '../model/constants';
import { PdfPageOrientation, PdfDocument, PdfBitmap } from '@syncfusion/ej2-pdf-export';

/**
 * Annotation Module handles the Annotation for Maps 
 */
export class ExportUtils {
    private control: Maps;
    private printWindow: Window;

    /**
     * Constructor for Maps
     * @param control 
     */
    constructor(control: Maps) {
        this.control = control;
    }

    /**
     * To print the Maps
     * @param elements 
     */
    public print(elements?: string[] | string | Element): void {
        this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.printWindow.moveTo(0, 0);
        this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
        let argsData: IPrintEventArgs = {
            cancel: false, htmlContent: this.getHTMLContent(elements), name: beforePrint
        };
        this.control.trigger('beforePrint', argsData, (beforePrintArgs: IPrintEventArgs) => {
            if (!argsData.cancel) {
                printWindow(argsData.htmlContent, this.printWindow);
            }
        });
    }

    /**
     * To get the html string of the Maps 
     * @param elements 
     * @private
     */
    public getHTMLContent(elements?: string[] | string | Element): Element {
        let div: Element = createElement('div');
        if (elements) {
            if (elements instanceof Array) {
                Array.prototype.forEach.call(elements, (value: string) => {
                    div.appendChild(getElement(value).cloneNode(true) as Element);
                });
            } else if (elements instanceof Element) {
                div.appendChild(elements.cloneNode(true) as Element);
            } else {
                div.appendChild(getElement(elements).cloneNode(true) as Element);
            }
        } else {
            div.appendChild(this.control.element.cloneNode(true) as Element);
        }
        return div;
    }
    /**
     * To export the file as image/svg format
     * @param type 
     * @param fileName 
     */
    public export(type: ExportType, fileName: string, exportDownload?: boolean, orientation?: PdfPageOrientation): Promise<string> {
        // tslint:disable-next-line:max-func-body-length
        let promise: Promise<string> = new Promise((resolve: Function, reject: Function) => {
            let canvasElement: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': this.control.availableSize.width.toString(),
                    'height': this.control.availableSize.height.toString()
                }
            });
            let isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
            let toolbarEle: HTMLElement = document.getElementById(this.control.element.id + '_ToolBar');
            let svgParent: HTMLElement = document.getElementById(this.control.element.id + '_Tile_SVG_Parent');
            let svgData: string;
            if (!this.control.isTileMap) {
                svgData = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                    this.control.svgObject.outerHTML + '</svg>';
            } else {
                let tileSvg: Element = document.getElementById(this.control.element.id + '_Tile_SVG');
                svgData = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                    this.control.svgObject.outerHTML + tileSvg.outerHTML + '</svg>';
            }
            let url: string = window.URL.createObjectURL(
                new Blob(
                    type === 'SVG' ? [svgData] :
                        [(new XMLSerializer()).serializeToString(this.control.svgObject)],
                    { type: 'image/svg+xml' }
                )
            );
            if (type === 'SVG') {
                if (exportDownload) {
                    this.triggerDownload(
                        fileName, type,
                        url, isDownload
                    );
                } else {
                    resolve(null);
                }
            } else {
                let pdfDocument: PdfDocument = new PdfDocument();
                let image: HTMLImageElement = new Image();
                let ctx: CanvasRenderingContext2D = canvasElement.getContext('2d');
                if (!this.control.isTileMap) {
                    image.onload = (() => {
                        ctx.drawImage(image, 0, 0);
                        window.URL.revokeObjectURL(url);
                        if (type === 'PDF') {
                            let imageString: string = canvasElement.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                            pdfDocument.pageSettings.orientation = orientation;
                            imageString = imageString.slice(imageString.indexOf(',') + 1);
                            pdfDocument.pages.add().graphics.drawImage(
                                new PdfBitmap(imageString), 0, 0, (this.control.availableSize.width - 60), this.control.availableSize.height
                            );
                            if (exportDownload) {
                                pdfDocument.save(fileName + '.pdf');
                                pdfDocument.destroy();
                            } else {
                                resolve(null);
                            }
                        } else {
                            if (exportDownload) {
                                this.triggerDownload(
                                    fileName, type, canvasElement.toDataURL('image/png').replace('image/png', 'image/octet-stream'),
                                    isDownload
                                );
                            } else {
                                resolve(canvasElement.toDataURL('image/png'));
                            }
                        }
                    });
                    image.src = url;
                } else {
                    let xHttp: XMLHttpRequest = new XMLHttpRequest();
                    let tileLength: number = this.control.mapLayerPanel.tiles.length;
                    for (let i: number = 0; i <= tileLength + 1; i++) {
                        let tile: HTMLElement = document.getElementById('tile_' + (i - 1));
                        let tileImg: HTMLImageElement = new Image();
                        tileImg.crossOrigin = 'Anonymous';
                        ctx.fillStyle = this.control.background ? this.control.background : '#FFFFFF';
                        ctx.fillRect(0, 0, this.control.availableSize.width, this.control.availableSize.height);
                        ctx.font = this.control.titleSettings.textStyle.size + ' Arial';
                        ctx.fillStyle = document.getElementById(this.control.element.id + '_Map_title').getAttribute('fill');
                        ctx.fillText(
                            this.control.titleSettings.text,
                            parseFloat(document.getElementById(this.control.element.id + '_Map_title').getAttribute('x')),
                            parseFloat(document.getElementById(this.control.element.id + '_Map_title').getAttribute('y')));
                        tileImg.onload = (() => {
                            if (i === 0 || i === tileLength + 1) {
                                if (i === 0) {
                                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                                    ctx.rect(
                                        0, parseFloat(svgParent.style.top),
                                        parseFloat(svgParent.style.width), parseFloat(svgParent.style.height));
                                    ctx.clip();
                                } else {
                                    ctx.setTransform(1, 0, 0, 1, parseFloat(svgParent.style.left), parseFloat(svgParent.style.top));
                                }
                            } else {
                                ctx.setTransform(1, 0, 0, 1, parseFloat(tile.style.left) + 10, parseFloat(tile.style.top) +
                                    (parseFloat(document.getElementById(this.control.element.id + '_tile_parent').style.top)));
                            }
                            ctx.drawImage(tileImg, 0, 0);
                            if (i === tileLength + 1) {
                                if (type === 'PDF') {
                                    localStorage.setItem('saved-image-example', canvasElement.toDataURL('image/jpeg'));
                                    let x: string = localStorage.getItem('saved-image-example');
                                    pdfDocument.pageSettings.orientation = orientation;
                                    x = x.slice(x.indexOf(',') + 1);
                                    pdfDocument.pages.add().graphics.drawImage(
                                        new PdfBitmap(x), 0, 0, (this.control.availableSize.width - 60), this.control.availableSize.height
                                    );
                                    if (exportDownload) {
                                        pdfDocument.save(fileName + '.pdf');
                                        pdfDocument.destroy();
                                    } else {
                                        resolve(null);
                                    }
                                } else {
                                    localStorage.setItem('local-canvasImage', canvasElement.toDataURL('image/png'));
                                    let localBase64: string = localStorage.getItem('local-canvasImage');
                                    if (exportDownload) {
                                        this.triggerDownload(fileName, type, localBase64, isDownload);
                                        localStorage.removeItem('local-canvasImage');
                                    } else {
                                        resolve(localBase64);
                                    }
                                }
                            }
                        });
                        if (i === 0 || i === tileLength + 1) {
                            if (i === 0) {
                                tileImg.src = url;
                            } else {
                                setTimeout(() => {
                                    tileImg.src = window.URL.createObjectURL(new Blob(
                                        [(new XMLSerializer()).serializeToString(document.getElementById(
                                            this.control.element.id + '_Tile_SVG'))],
                                        { type: 'image/svg+xml' }));
                                // tslint:disable-next-line:align
                                }, 300);
                            }
                        } else {
                            xHttp.open('GET', tile.children[0].getAttribute('src'), true);
                            xHttp.send();
                            tileImg.src = tile.children[0].getAttribute('src');
                        }
                    }
                }
            }
        });
        return promise;
    }
    /**
     * To trigger the download element
     * @param fileName 
     * @param type 
     * @param url 
     */
    public triggerDownload(fileName: string, type: ExportType, url: string, isDownload: boolean): void {
        createElement('a', {
            attrs: {
                'download': fileName + '.' + (type as string).toLocaleLowerCase(),
                'href': url
            }
        }).dispatchEvent(new MouseEvent(isDownload ? 'click' : 'move', {
            view: window,
            bubbles: false,
            cancelable: true
        }));
    }
}
