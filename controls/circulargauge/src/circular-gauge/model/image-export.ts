import { createElement, Browser } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../index';
import { ExportType } from '../utils/enum';

/**
 * Represent the Image Export for gauge
 *
 * @hidden
 */
export class ImageExport {

    /**
     * Constructor for gauge
     *
     *  @param {CircularGauge} control - Specfies the instance of the gauge
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(control: CircularGauge) {
    }

    /**
     * To export the file as image/svg format
     *
     * @param {CircularGauge} gauge - Specifies the instance of Circular Gauge.
     * @param {ExportType} type - Specifies the type of the image file.
     * @param {string} fileName - Specifies the file name of the image file.
     * @param {boolean} allowDownload - Specifies whether to download the image file or not.
     * @returns {Promise<string>} - Returns promise string.
     * @private
     */
    public export(gauge: CircularGauge, type: ExportType, fileName: string, allowDownload?: boolean): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promise: Promise<string> = new Promise((resolve: any, reject: any) => {
            const isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            const element: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': gauge.availableSize.width.toString(),
                    'height': gauge.availableSize.height.toString()
                }
            });
            const svgData: string = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
            gauge.svgObject.outerHTML +
                '</svg>';
            const url: string = window.URL.createObjectURL(
                new Blob(
                    type === 'SVG' ? [svgData] :
                        [(new XMLSerializer()).serializeToString(gauge.svgObject)],
                    { type: 'image/svg+xml' }
                )
            );
            if (type === 'SVG') {
                if (allowDownload) {
                    this.triggerDownload(
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
                        this.triggerDownload(
                            fileName, type,
                            element.toDataURL('image/png').replace('image/png', 'image/octet-stream'),
                            isDownload);
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
    public destroy(): void {}

    /**
    * To trigger the download element
    *
    * @param {string} fileName - Specifies the file name.
    * @param {ExportType} type - Specifies the export type.
    * @param {string} url - Specifies the url.
    * @param {boolean} isDownload - Specifies the boolean value.
    * @returns {void}
    */
    private triggerDownload(fileName: string, type: ExportType, url: string, isDownload: boolean): void {
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
