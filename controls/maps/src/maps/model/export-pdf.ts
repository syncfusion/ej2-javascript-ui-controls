import { createElement, isNullOrUndefined} from '@syncfusion/ej2-base';
import { Maps } from '../../index';
import { ExportType } from '../utils/enum';
import { PdfPageOrientation, PdfDocument, PdfBitmap } from '@syncfusion/ej2-pdf-export';



/**
 * This module enables the export to PDF functionality in Maps control.
 * @hidden
 */
export class PdfExport {
    private control: Maps;

   /**
    * Constructor for Maps
    * @param control 
    */
    constructor(control: Maps) {
        this.control = control;
    }

    /**
     * To export the file as image/svg format
     * @param type 
     * @param fileName 
     * @private
     */
    public export(type: ExportType, fileName: string, allowDownload?: boolean, orientation?: PdfPageOrientation): Promise<string> {
        // tslint:disable-next-line:max-func-body-length
        let promise: Promise<string> = new Promise((resolve: Function, reject: Function) => {
            let canvasElement: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': this.control.availableSize.width.toString(),
                    'height': this.control.availableSize.height.toString()
                }
            });
            orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
            let svgParent: HTMLElement = document.getElementById(this.control.element.id + '_Tile_SVG_Parent');
            let svgData: string;
            let url: string = window.URL.createObjectURL(
                new Blob(
                    type === 'SVG' ? [svgData] :
                        [(new XMLSerializer()).serializeToString(this.control.svgObject)],
                    { type: 'image/svg+xml' }
                )
                );
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
                        if (allowDownload) {
                            pdfDocument.save(fileName + '.pdf');
                            pdfDocument.destroy();
                        } else {
                            resolve(null);
                    }
                    }
                });
                image.src = url;
            } else {
                let xHttp: XMLHttpRequest = new XMLHttpRequest();
                let tileLength: number = this.control.mapLayerPanel.tiles.length;
                for (let i: number = 0; i <= tileLength + 1; i++) {
                    let tile: HTMLElement = document.getElementById(this.control.element.id + '_tile_' + (i - 1));
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
                                if (allowDownload) {
                                    pdfDocument.save(fileName + '.pdf');
                                    pdfDocument.destroy();
                                } else {
                                    resolve(null);
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
        });
        return promise;
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'PdfExport';
    }

    /**
     * To destroy the PdfExports.
     * @return {void}
     * @private
     */
    public destroy(maps: Maps): void {
        /**
         * Destroy method performed here
         */
    }
}