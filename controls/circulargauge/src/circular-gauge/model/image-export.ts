import { createElement, Browser } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../index';
import { ExportType } from '../utils/enum';
import { triggerDownload } from '../utils/helper';

/**
 * Represent the Image Export for gauge 
 * @hidden
 */
export class ImageExport {
    private control: CircularGauge;

    /**
     * Constructor for gauge
     * @param control 
     */
    constructor(control: CircularGauge) {
        this.control = control;
    }

    /**
     * To export the file as image/svg format
     * @param type
     * @param fileName
     * @param allowDownload
     * @private
     */
    public export(type: ExportType, fileName: string, allowDownload?: boolean): Promise<string> {
        let promise: Promise<string> = new Promise((resolve: Function, reject: Function) => {
            let isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            let element: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': this.control.availableSize.width.toString(),
                    'height': this.control.availableSize.height.toString()
                }
            });
            let svgData: string = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                this.control.svgObject.outerHTML +
                '</svg>';
            let url: string = window.URL.createObjectURL(
                new Blob(
                    type === 'SVG' ? [svgData] :
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
                let context: CanvasRenderingContext2D = element.getContext('2d');
                image.onload = (() => {
                    context.drawImage(image, 0, 0);
                    window.URL.revokeObjectURL(url);
                    if (allowDownload) {
                        triggerDownload(
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
     * @return {void}
     * @private
     */
    public destroy(gauge: CircularGauge): void {
        // Destroy method performed here
    }
}