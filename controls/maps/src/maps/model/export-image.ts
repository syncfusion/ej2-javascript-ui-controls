import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Maps } from '../../index';
import { triggerDownload, getElementByID } from '../utils/helper';
import { ExportType } from '../utils/enum';

/**
 * This module enables the export to Image functionality in maps.
 *
 * @hidden
 */
export class ImageExport {

    /**
     * Constructor for Maps
     *
     * @param {Maps} control - Specifies the instance of the map
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    constructor(control: Maps) {
    }
    /**
     * To export the file as image/svg format
     *
     * @param {Maps} maps - Specifies the Maps instance.
     * @param {ExportType} type - Specifies the type of the image file for exporting.
     * @param {string} fileName - Specifies the file name of the image file for exporting.
     * @param {boolean} allowDownload - Specifies whether to download image as a file or not.
     * @returns {Promise<string>} - Specifies the base64 string of the exported image which is returned when the allowDownload is set to false.
     * @private
     */
    public export(maps: Maps, type: ExportType, fileName: string, allowDownload?: boolean): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        const promise: Promise<string> = new Promise((resolve: any, reject: any) => {
            const imageCanvasElement: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': maps.availableSize.width.toString(),
                    'height': maps.availableSize.height.toString()
                }
            });
            const isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            const svgParent: HTMLElement = document.getElementById(maps.element.id + '_Tile_SVG_Parent');
            let svgDataElement: string;
            let tileSvg: Element;
            const svgObject: Element = getElementByID(maps.element.id + '_svg').cloneNode(true) as Element;
            const backgroundElement: HTMLElement = svgObject.childNodes[0] as HTMLElement;
            const backgroundColor: string = backgroundElement.getAttribute('fill');
            if ((maps.theme === 'Tailwind' || maps.theme === 'Bootstrap5' || maps.theme === 'Fluent' || maps.theme === 'Material3') && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                (svgObject.childNodes[0] as HTMLElement).setAttribute('fill', 'rgba(255,255,255, 1)');
            } else if ((maps.theme === 'TailwindDark' || maps.theme === 'Bootstrap5Dark' || maps.theme === 'FluentDark' || maps.theme === 'Material3Dark') && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                (svgObject.childNodes[0] as HTMLElement).setAttribute('fill', 'rgba(0, 0, 0, 1)');
            }
            if (!maps.isTileMap) {
                svgDataElement = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                svgObject.outerHTML + '</svg>';
            } else {
                tileSvg = getElementByID(maps.element.id + '_Tile_SVG').cloneNode(true) as Element;
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
                if (!maps.isTileMap) {
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
                    maps.isExportInitialTileMap = true;
                    const svgParentElement: HTMLElement = document.getElementById(maps.element.id + '_MapAreaBorder');
                    const top: number = parseFloat(svgParentElement.getAttribute('y'));
                    const left: number = parseFloat(svgParentElement.getAttribute('x'));
                    const imgxHttp: XMLHttpRequest = new XMLHttpRequest();
                    const imgTileLength: number = maps.mapLayerPanel.tiles.length;
                    for (let i: number = 0; i <= imgTileLength + 1; i++) {
                        const tile: HTMLElement = document.getElementById(maps.element.id + '_tile_' + (i - 1));
                        const exportTileImg: HTMLImageElement = new Image();
                        exportTileImg.crossOrigin = 'Anonymous';
                        const background: string = maps.background ? maps.background : ((maps.theme === 'Tailwind' || maps.theme === 'Bootstrap5' || maps.theme === 'Fluent' || maps.theme === 'Material3') && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) ? '#ffffff' :
                            (maps.theme === 'TailwindDark' || maps.theme === 'Bootstrap5Dark' || maps.theme === 'FluentDark' || maps.theme === 'Material3Dark') && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent') ? '#000000' : '#ffffff';
                        ctxt.fillStyle = background;
                        ctxt.fillRect(0, 0, maps.availableSize.width, maps.availableSize.height);
                        ctxt.font = maps.titleSettings.textStyle.size + ' Arial';
                        const titleElement: HTMLElement = document.getElementById(maps.element.id + '_Map_title');
                        if (!isNullOrUndefined(titleElement)) {
                            ctxt.fillStyle = titleElement.getAttribute('fill');
                            ctxt.fillText(
                                maps.titleSettings.text, parseFloat(titleElement.getAttribute('x')),
                                parseFloat(titleElement.getAttribute('y'))
                            );
                        }
                        exportTileImg.onload = (() => {
                            if (i === 0 || i === imgTileLength + 1) {
                                if (i === 0) {
                                    ctxt.setTransform(1, 0, 0, 1, 0, 0);
                                    ctxt.rect(0, top, parseFloat(svgParent.style.width), parseFloat(svgParent.style.height));
                                    ctxt.clip();
                                } else {
                                    ctxt.setTransform(1, 0, 0, 1, left, top);
                                }
                            } else {
                                ctxt.setTransform(1, 0, 0, 1, parseFloat(tile.style.left) + left, parseFloat(tile.style.top) +
                                    top);
                            }
                            ctxt.drawImage(exportTileImg, 0, 0);
                            if (i === imgTileLength + 1) {
                                localStorage.setItem('local-canvasImage', imageCanvasElement.toDataURL('image/png'));
                                const localBase64: string = localStorage.getItem('local-canvasImage');
                                if (allowDownload) {
                                    triggerDownload(fileName, type, localBase64, isDownload);
                                    localStorage.removeItem('local-canvasImage');
                                    maps.isExportInitialTileMap = false;
                                } else {
                                    maps.isExportInitialTileMap = false;
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
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public destroy(): void { }
}
