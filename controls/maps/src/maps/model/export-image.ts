/* eslint-disable @typescript-eslint/no-unused-vars */
import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Maps } from '../../index';
import { triggerDownload, getElementByID } from '../utils/helper';
import { ExportType } from '../utils/enum';

/**
 * This module enables the export to Image functionality in Maps control.
 *
 * @hidden
 */
export class ImageExport {
    private control: Maps;

    /**
     * Constructor for Maps
     *
     * @param {Maps} control - Specifies the instance of the map
     */
    constructor(control: Maps) {
        this.control = control;
    }
    /**
     * To export the file as image/svg format
     *
     * @param {ExportType} type - Specifies the type of the image file
     * @param {string} fileName - Specifies the file name of the image file
     * @param {boolean} allowDownload - Specifies whether to download image as a file or not.
     * @returns {Promise<string>} - Returns the promise string.
     * @private
     */
    public export(type: ExportType, fileName: string, allowDownload?: boolean): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promise: Promise<string> = new Promise((resolve: any, reject: any) => {
            const imageCanvasElement: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': this.control.availableSize.width.toString(),
                    'height': this.control.availableSize.height.toString()
                }
            });
            const isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            const toolbarEle: HTMLElement = document.getElementById(this.control.element.id + '_ToolBar');
            const svgParent: HTMLElement = document.getElementById(this.control.element.id + '_Tile_SVG_Parent');
            let svgDataElement: string;
            let tileSvg: Element;
            let svgObject: Element = getElementByID(this.control.element.id + '_svg').cloneNode(true) as Element;
            if (!this.control.isTileMap) {
                svgDataElement = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                    this.control.svgObject.outerHTML + '</svg>';
            } else {
                tileSvg = getElementByID(this.control.element.id + '_Tile_SVG').cloneNode(true) as Element;
                svgDataElement = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                svgObject.outerHTML + tileSvg.outerHTML + '</svg>';
            }
            const url: string = window.URL.createObjectURL(
                new Blob(
                    type === 'SVG' ? [svgDataElement] :
                        [(new XMLSerializer()).serializeToString(svgObject)],
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
                const image: HTMLImageElement = new Image();
                const ctxt: CanvasRenderingContext2D = imageCanvasElement.getContext('2d');
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
                    const imgxHttp: XMLHttpRequest = new XMLHttpRequest();
                    const imgTileLength: number = this.control.mapLayerPanel.tiles.length;
                    for (let i: number = 0; i <= imgTileLength + 1; i++) {
                        const tile: HTMLElement = document.getElementById(this.control.element.id + '_tile_' + (i - 1));
                        const exportTileImg: HTMLImageElement = new Image();
                        exportTileImg.crossOrigin = 'Anonymous';
                        ctxt.fillStyle = this.control.background ? this.control.background : '#FFFFFF';
                        ctxt.fillRect(0, 0, this.control.availableSize.width, this.control.availableSize.height);
                        ctxt.font = this.control.titleSettings.textStyle.size + ' Arial';
                        let titleElement: HTMLElement = document.getElementById(this.control.element.id + '_Map_title');
                        if (!isNullOrUndefined(titleElement)) {
                            ctxt.fillStyle = titleElement.getAttribute('fill');
                            ctxt.fillText(
                                this.control.titleSettings.text, parseFloat(titleElement.getAttribute('x')),
                                parseFloat(titleElement.getAttribute('y'))
                            );
                        }
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
                                const tileParent: HTMLElement = document.getElementById(this.control.element.id + '_tile_parent');
                                ctxt.setTransform(1, 0, 0, 1, parseFloat(tile.style.left) + 10, parseFloat(tile.style.top) +
                                    (parseFloat(tileParent.style.top)));
                            }
                            ctxt.drawImage(exportTileImg, 0, 0);
                            if (i === imgTileLength + 1) {
                                localStorage.setItem('local-canvasImage', imageCanvasElement.toDataURL('image/png'));
                                const localBase64: string = localStorage.getItem('local-canvasImage');
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
                                        [(new XMLSerializer()).serializeToString(tileSvg)],
                                        { type: 'image/svg+xml' }));
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
     *
     * @returns {string} - Returns the module name
     */
    protected getModuleName(): string {
        return 'ImageExport';
    }

    /**
     * To destroy the ImageExport.
     *
     * @param {Maps} maps - Specifies the instance of the maps.
     * @returns {void}
     * @private
     */
    public destroy(maps: Maps): void {
        /**
         * Destroy method performed here
         */
    }
}
