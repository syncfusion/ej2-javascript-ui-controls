import { createElement, isNullOrUndefined} from '@syncfusion/ej2-base';
import { Maps } from '../../index';
import { ExportType } from '../utils/enum';
import { PdfPageOrientation, PdfDocument, PdfBitmap } from '@syncfusion/ej2-pdf-export';


/**
 * This module enables the export to PDF functionality in maps.
 *
 * @hidden
 */
export class PdfExport {

    /**
     * Constructor for Maps
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }

    /**
     * To export the file as image/svg format
     *
     * @param {Maps} maps - Specifies the Maps instance.
     * @param {ExportType} type - Specifies the type of the document.
     * @param {string} fileName - Specifies the name of the PDF document.
     * @param {boolean} allowDownload - Specifies whether to download the document or not.
     * @param {PdfPageOrientation} orientation - Specifies the orientation of the PDF document to export the maps.
     * @returns {Promise<string>} - Returns "null" value when the allowDownload is set to false.
     * @private
     */
    public export(maps: Maps, type: ExportType, fileName: string, allowDownload?: boolean,
                  orientation?: PdfPageOrientation): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promise: Promise<string> = new Promise((resolve: any) => {
            if (maps.isTileMap) {
                maps.isExportInitialTileMap = true;
            }
            const canvasElement: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': maps.availableSize.width.toString(),
                    'height': maps.availableSize.height.toString()
                }
            });
            orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
            const svgParent: HTMLElement = document.getElementById(maps.element.id + '_Tile_SVG_Parent');
            let svgData: string;
            const exportElement: HTMLElement = maps.svgObject.cloneNode(true) as HTMLElement;
            const backgroundElement: HTMLElement = exportElement.childNodes[0] as HTMLElement;
            const backgroundColor: string = backgroundElement.getAttribute('fill');
            if ((maps.theme === 'Tailwind' || maps.theme === 'Tailwind3' || maps.theme === 'Bootstrap5' || maps.theme === 'Fluent' || maps.theme === 'Material3' ||
                maps.theme === 'Fluent2')
                && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                (exportElement.childNodes[0] as HTMLElement).setAttribute('fill', 'rgba(255,255,255, 1)');
            } else if ((maps.theme === 'TailwindDark' || maps.theme === 'Tailwind3Dark' || maps.theme === 'Bootstrap5Dark' || maps.theme === 'FluentDark' || maps.theme === 'Material3Dark' ||
                maps.theme === 'Fluent2Dark' || maps.theme === 'Fluent2HighContrast')
                && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                (exportElement.childNodes[0] as HTMLElement).setAttribute('fill', 'rgba(0, 0, 0, 1)');
            }
            const url: string = window.URL.createObjectURL(
                new Blob(
                    type === 'SVG' ? [svgData] :
                        [(new XMLSerializer()).serializeToString(exportElement)],
                    { type: 'image/svg+xml' }
                )
            );
            const pdfDocument: PdfDocument = new PdfDocument();
            const image: HTMLImageElement = new Image();
            const ctx: CanvasRenderingContext2D = canvasElement.getContext('2d');
            if (!maps.isTileMap) {
                image.onload = (() => {
                    ctx.drawImage(image, 0, 0);
                    window.URL.revokeObjectURL(url);
                    if (type === 'PDF') {
                        let imageString: string = canvasElement.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                        pdfDocument.pageSettings.orientation = orientation;
                        imageString = imageString.slice(imageString.indexOf(',') + 1);
                        pdfDocument.pages.add().graphics.drawImage(
                            new PdfBitmap(imageString), 0, 0, (maps.availableSize.width - 60), maps.availableSize.height
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
                const svgParentElement: HTMLElement = document.getElementById(maps.element.id + '_MapAreaBorder');
                const top: number = parseFloat(svgParentElement.getAttribute('y'));
                const left: number = parseFloat(svgParentElement.getAttribute('x'));
                const xHttp: XMLHttpRequest = new XMLHttpRequest();
                const tileLength: number = maps.mapLayerPanel.tiles.length;
                for (let i: number = 0; i <= tileLength + 1; i++) {
                    const tile: HTMLElement = document.getElementById(maps.element.id + '_tile_' + (i - 1));
                    const tileImg: HTMLImageElement = new Image();
                    tileImg.crossOrigin = 'Anonymous';
                    const background: string = maps.background ? maps.background : ((maps.theme === 'Tailwind' || maps.theme === 'Tailwind3' || maps.theme === 'Bootstrap5' || maps.theme === 'Fluent' || maps.theme === 'Material3') && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) ? '#ffffff' :
                        (maps.theme === 'TailwindDark' || maps.theme === 'Tailwind3Dark' || maps.theme === 'Bootstrap5Dark' || maps.theme === 'FluentDark' || maps.theme === 'Material3Dark') && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent') ? '#000000' : '#ffffff';
                    ctx.fillStyle = background;
                    ctx.fillRect(0, 0, maps.availableSize.width, maps.availableSize.height);
                    ctx.font = maps.titleSettings.textStyle.size + ' Arial';
                    const titleElement: HTMLElement = document.getElementById(maps.element.id + '_Map_title');
                    if (!isNullOrUndefined(titleElement)) {
                        ctx.fillStyle = titleElement.getAttribute('fill');
                        ctx.fillText(
                            maps.titleSettings.text, parseFloat(titleElement.getAttribute('x')),
                            parseFloat(titleElement.getAttribute('y')));
                    }
                    tileImg.onload = (() => {
                        if (i === 0 || i === tileLength + 1) {
                            if (i === 0) {
                                ctx.setTransform(1, 0, 0, 1, 0, 0);
                                ctx.rect(0, top, parseFloat(svgParent.style.width), parseFloat(svgParent.style.height));
                                ctx.clip();
                            } else {
                                ctx.setTransform(1, 0, 0, 1, left, top);
                            }
                        } else {
                            ctx.setTransform(1, 0, 0, 1, parseFloat(tile.style.left) + left, parseFloat(tile.style.top) + top);
                        }
                        ctx.drawImage(tileImg, 0, 0);
                        if (i === tileLength + 1) {
                            if (type === 'PDF') {
                                localStorage.setItem('saved-image-example', canvasElement.toDataURL('image/jpeg'));
                                let x: string = localStorage.getItem('saved-image-example');
                                pdfDocument.pageSettings.orientation = orientation;
                                x = x.slice(x.indexOf(',') + 1);
                                pdfDocument.pages.add().graphics.drawImage(
                                    new PdfBitmap(x), 0, 0, (maps.availableSize.width - 60), maps.availableSize.height
                                );
                                maps.isExportInitialTileMap = false;
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
                                const tileSvg: Element = document.getElementById(maps.element.id + '_Tile_SVG');
                                tileImg.src = window.URL.createObjectURL(new Blob(
                                    [(new XMLSerializer()).serializeToString(tileSvg)],
                                    { type: 'image/svg+xml' }));
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
     *
     * @returns {string} - Returns the module name
     */
    protected getModuleName(): string {
        return 'PdfExport';
    }

    /**
     * To destroy the PdfExport.
     *
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public destroy(): void { }
}
