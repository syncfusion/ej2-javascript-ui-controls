import { createElement, Browser } from '@syncfusion/ej2-base';
import { LinearGauge} from '../../index';
import { triggerDownload } from '../utils/helper';
import { ExportType } from '../utils/enum';

/**
 * Represent the print and export for gauge.
 *
 * @hidden
 */
export class ImageExport {

    /**
     * Constructor for gauge
     *
     * @param {LinearGauge} control - Specifies the Linear Gauge instance.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    constructor(control: LinearGauge) {
    }

    /**
     * To export the file as image/svg format
     *
     * @param type
     * @param fileName
     * @private
     */

    public export(gauge: LinearGauge, type: ExportType, fileName: string, allowDownload?: boolean): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promise: Promise<string> = new Promise((resolve: any) => {
            const element: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': gauge.availableSize.width.toString(),
                    'height': gauge.availableSize.height.toString()
                }
            });
            const exportElement: HTMLElement = gauge.svgObject.cloneNode(true) as HTMLElement;
            const backgroundElement: HTMLElement = exportElement.childNodes[0] as HTMLElement;
            const backgroundColor: string = backgroundElement.getAttribute('fill');
            if ((gauge.theme === 'Tailwind' || gauge.theme === 'Bootstrap5' || gauge.theme === 'Fluent' || gauge.theme === 'Material3') && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                (exportElement.childNodes[0] as HTMLElement).setAttribute('fill', 'rgba(255,255,255, 1)');
            } else if ((gauge.theme === 'TailwindDark' || gauge.theme === 'Bootstrap5Dark' ||  gauge.theme === 'FluentDark' || gauge.theme === 'Material3Dark') && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                (exportElement.childNodes[0] as HTMLElement).setAttribute('fill', 'rgba(0, 0, 0, 1)');
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
                const context: CanvasRenderingContext2D = element.getContext('2d');
                image.onload = (() => {
                    context.drawImage(image, 0, 0);
                    window.URL.revokeObjectURL(url);
                    if (allowDownload) {
                        triggerDownload(
                            fileName, type,
                            element.toDataURL('image/png').replace('image/png', 'image/octet-stream'),
                            isDownload
                        );
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

    /**
     * Get module name.
     */

    protected getModuleName(): string {
        return 'ImageExport';
    }

    /**
     * To destroy the ImageExport.
     *
     * @return {void}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public destroy(): void {
    }
}
