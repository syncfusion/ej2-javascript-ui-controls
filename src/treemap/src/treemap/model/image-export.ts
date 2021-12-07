import { createElement, Browser } from '@syncfusion/ej2-base';
import { TreeMap} from '../../index';
import { ExportType } from '../utils/enum';
import { triggerDownload } from '../utils/helper';

/**
 * ImageExport module handles the export to image functionality for treemap.
 *
 * @hidden
 */
export class ImageExport {
    private control: TreeMap ;
    /**
     * Constructor for Maps
     *
     * @param {TreeMap} control - Specifies the treemap instance
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(control: TreeMap) {
        this.control = control;
    }
    /**
     * This method is used to perform the export functionality for the rendered treemap.
     *
     * @param {ExportType} type - Specifies the type of the image file.
     * @param {string} fileName - Specifies the file name of the image file.
     * @param {boolean} allowDownload - Specifies whether to download the file or not.
     * @returns {Promise} - Returns the promise string.
     * @private
     */
    public export(type: ExportType, fileName: string, allowDownload ?: boolean): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promise: Promise<string> = new Promise((resolve: any, reject: any) => {
            const element: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',

                attrs: {
                    'height': this.control.availableSize.height.toString(),
                    'width': this.control.availableSize.width.toString()
                } });

            const isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            const svgData: string = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
            this.control.svgObject.outerHTML +
            '</svg>';
            const url: string = window.URL.createObjectURL(
                new Blob(
                    type === 'SVG' ? [svgData] :
                        [(new XMLSerializer()).serializeToString(this.control.svgObject)],
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
     * @param {TreeMap} treemap - Specifies the instance of the treemap.
     * @returns {void}
     * @private
     */
    public destroy(treemap: TreeMap): void {
        // Destroy method performed here
    }


}
