import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TreeMap} from '../../index';
import { ExportType } from '../utils/enum';
import { triggerDownload } from '../utils/helper';

/**
 * ImageExport module handles the export to image functionality for treemap.
 *
 * @hidden
 */
export class ImageExport {
    /**
     * Constructor for Maps
     *
     * @param {TreeMap} control - Specifies the treemap instance
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    constructor(control: TreeMap) {
    }
    /**
     * This method is used to perform the export functionality for the rendered treemap.
     *
     * @param {TreeMap} treeMap - Specifies the treemap instance.
     * @param {ExportType} type - Specifies the type of the image file.
     * @param {string} fileName - Specifies the file name of the image file.
     * @param {boolean} allowDownload - Specifies whether to download the file or not.
     * @returns {Promise} - Returns the promise string.
     * @private
     */
    public export(treeMap: TreeMap, type: ExportType, fileName: string, allowDownload ?: boolean): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        const promise: Promise<string> = new Promise((resolve: any, reject: any) => {
            const element: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',

                attrs: {
                    'height': treeMap.availableSize.height.toString(),
                    'width': treeMap.availableSize.width.toString()
                } });
            const exportElement: HTMLElement = treeMap.svgObject.cloneNode(true) as HTMLElement;
            const backgroundElement: HTMLElement = exportElement.childNodes[0] as HTMLElement;
            if (!isNullOrUndefined(backgroundElement)) {
                const backgroundColor: string = backgroundElement.getAttribute('fill');
                if ((treeMap.theme === 'Tailwind' || treeMap.theme === 'Bootstrap5' || treeMap.theme === 'Fluent' || treeMap.theme === 'Material3' ||
                    treeMap.theme === 'Fluent2')
                    && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                    (exportElement.childNodes[0] as HTMLElement).setAttribute('fill', 'rgba(255,255,255, 1)');
                } else if ((treeMap.theme === 'TailwindDark' || treeMap.theme === 'Bootstrap5Dark' || treeMap.theme === 'FluentDark' || treeMap.theme === 'Material3Dark' ||
                    treeMap.theme === 'Fluent2Dark' || treeMap.theme === 'Fluent2HighContrast')
                    && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                    (exportElement.childNodes[0] as HTMLElement).setAttribute('fill', 'rgba(0, 0, 0, 1)');
                }
            }
            const isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            const svgData: string = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
            exportElement.outerHTML +
            '</svg>';
            const url: string = window.URL.createObjectURL(
                new Blob(
                    type === 'SVG' ? [svgData] :
                        [(new XMLSerializer()).serializeToString(exportElement)],
                    { type: 'image/svg+xml' }
                )
            );
            if (type === 'SVG' ) {
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
                const context: CanvasRenderingContext2D = element.getContext('2d');
                image.onload = (() => {
                    context.drawImage(image, 0, 0);
                    window.URL.revokeObjectURL(url);

                    if (allowDownload) {
                        triggerDownload(fileName, type,
                                        element.toDataURL('image/png').replace('image/png', 'image/octet-stream'),
                                        isDownload );
                    } else {

                        if (type === 'JPEG') {
                            resolve(element.toDataURL('image/jpeg'));
                        } else if (type === 'PNG') {
                            resolve(element.toDataURL('image/png'));
                        }

                    }

                });
                image.src = url;

            }
        });
        return promise;
    }

    protected getModuleName(): string {
        // Returns te module name
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
