import { createElement, Browser } from '@syncfusion/ej2-base';
import { Maps } from '../../index';
import { triggerDownload } from '../utils/helper';
import { ExportType } from '../utils/enum';

/**
 * This module enables the export to Image functionality in Maps control.
 * @hidden
 */
export class ImageExport {
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
    public export(type: ExportType, fileName: string, allowDownload?: boolean): Promise<string> {
        // tslint:disable-next-line:max-func-body-length
        let promise: Promise<string> = new Promise((resolve: Function, reject: Function) => {
            let imageCanvasElement: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': this.control.availableSize.width.toString(),
                    'height': this.control.availableSize.height.toString()
                }
            });
            let isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            let toolbarEle: HTMLElement = document.getElementById(this.control.element.id + '_ToolBar');
            let svgParent: HTMLElement = document.getElementById(this.control.element.id + '_Tile_SVG_Parent');
            let svgDataElement: string;
            if (!this.control.isTileMap) {
                svgDataElement = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                    this.control.svgObject.outerHTML + '</svg>';
            } else {
                let tileSvg: Element = document.getElementById(this.control.element.id + '_Tile_SVG');
                svgDataElement = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                    this.control.svgObject.outerHTML + tileSvg.outerHTML + '</svg>';
            }
            let url: string = window.URL.createObjectURL(
                new Blob(
                    type === 'SVG' ? [svgDataElement] :
                        [(new XMLSerializer()).serializeToString(this.control.svgObject)],
                    { type: 'image/svg+xml' }
                )
            );
            if (type === 'SVG') {
                if (allowDownload) {
                    triggerDownload(
                        fileName, type,
                        url, isDownload
                    );
                } else {
                    resolve(null);
                }
            } else {
                let image: HTMLImageElement = new Image();
                let ctxt: CanvasRenderingContext2D = imageCanvasElement.getContext('2d');
                if (!this.control.isTileMap) {
                    image.onload = (() => {
                        ctxt.drawImage(image, 0, 0);
                        window.URL.revokeObjectURL(url);
                        if (allowDownload) {
                            triggerDownload(
                                fileName, type, imageCanvasElement.toDataURL('image/png').replace('image/png', 'image/octet-stream'),
                                isDownload
                            );
                        } else {
                            if (type === 'PNG') {
                                resolve(imageCanvasElement.toDataURL('image/png'));
                            } else if (type === 'JPEG') {
                                resolve(imageCanvasElement.toDataURL('image/jpeg'));
                            }
                        }
                    });
                    image.src = url;
                } else {
                    let imgxHttp: XMLHttpRequest = new XMLHttpRequest();
                    let imgTileLength: number = this.control.mapLayerPanel.tiles.length;
                    for (let i: number = 0; i <= imgTileLength + 1; i++) {
                        let tile: HTMLElement = document.getElementById(this.control.element.id + '_tile_' + (i - 1));
                        let exportTileImg: HTMLImageElement = new Image();
                        exportTileImg.crossOrigin = 'Anonymous';
                        ctxt.fillStyle = this.control.background ? this.control.background : '#FFFFFF';
                        ctxt.fillRect(0, 0, this.control.availableSize.width, this.control.availableSize.height);
                        ctxt.font = this.control.titleSettings.textStyle.size + ' Arial';
                        ctxt.fillStyle = document.getElementById(this.control.element.id + '_Map_title').getAttribute('fill');
                        ctxt.fillText(
                            this.control.titleSettings.text,
                            parseFloat(document.getElementById(this.control.element.id + '_Map_title').getAttribute('x')),
                            parseFloat(document.getElementById(this.control.element.id + '_Map_title').getAttribute('y')));
                        exportTileImg.onload = (() => {
                            if (i === 0 || i === imgTileLength + 1) {
                                if (i === 0) {
                                    ctxt.setTransform(1, 0, 0, 1, 0, 0);
                                    ctxt.rect(
                                        0, parseFloat(svgParent.style.top),
                                        parseFloat(svgParent.style.width), parseFloat(svgParent.style.height));
                                    ctxt.clip();
                                } else {
                                    ctxt.setTransform(1, 0, 0, 1, parseFloat(svgParent.style.left), parseFloat(svgParent.style.top));
                                }
                            } else {
                                ctxt.setTransform(1, 0, 0, 1, parseFloat(tile.style.left) + 10, parseFloat(tile.style.top) +
                                    (parseFloat(document.getElementById(this.control.element.id + '_tile_parent').style.top)));
                            }
                            ctxt.drawImage(exportTileImg, 0, 0);
                            if (i === imgTileLength + 1) {
                                localStorage.setItem('local-canvasImage', imageCanvasElement.toDataURL('image/png'));
                                let localBase64: string = localStorage.getItem('local-canvasImage');
                                if (allowDownload) {
                                    triggerDownload(fileName, type, localBase64, isDownload);
                                    localStorage.removeItem('local-canvasImage');
                                } else {
                                    if (type === 'PNG') {
                                        resolve(localBase64);
                                    } else if (type === 'JPEG') {
                                        resolve(imageCanvasElement.toDataURL('image/jpeg'));
                                    }
                                }
                            }
                        });
                        if (i === 0 || i === imgTileLength + 1) {
                            if (i === 0) {
                                exportTileImg.src = url;
                            } else {
                                setTimeout(() => {
                                    exportTileImg.src = window.URL.createObjectURL(new Blob(
                                        [(new XMLSerializer()).serializeToString(document.getElementById(
                                            this.control.element.id + '_Tile_SVG'))],
                                        { type: 'image/svg+xml' }));
                                    // tslint:disable-next-line:align
                                }, 300);
                            }
                        } else {
                            imgxHttp.open('GET', tile.children[0].getAttribute('src'), true);
                            imgxHttp.send();
                            exportTileImg.src = tile.children[0].getAttribute('src');
                        }
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
        return 'ImageExport';
    }

    /**
     * To destroy the ImageExport.
     * @return {void}
     * @private
     */
    public destroy(maps: Maps): void {
        /**
         * Destroy method performed here
         */
    }
}