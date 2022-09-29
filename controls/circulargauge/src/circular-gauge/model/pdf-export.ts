import { createElement, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../index';
import { ExportType } from '../utils/enum';
import { PdfPageOrientation, PdfDocument, PdfBitmap } from '@syncfusion/ej2-pdf-export';

/**
 * Represent the Pdf export for gauge
 *
 * @hidden
 */
export class PdfExport {

    /**
     * Constructor for gauge
     *
     * @param {CircularGauge} control - Specfies the instance of the gauge.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(control: CircularGauge) {
    }

    /**
     * To export the file as image/svg format
     *
     * @param {CircularGauge} gauge - Specifies the instance of Circular Gauge.
     * @param {ExportType} type - Specifies the type of the document.
     * @param {string} fileName Specfies the file name of the document.
     * @param {PdfPageOrientation} orientation - Specfies the orientation of the PDF document to export the component.
     * @param {boolean} allowDownload - Specfies whether to download the document or not.
     * @returns {Promise<string>} - Returns the promise string
     * @private
     */
    public export(gauge: CircularGauge, type: ExportType, fileName: string, orientation?: PdfPageOrientation, allowDownload?: boolean): Promise<string> {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promise: Promise<string> = new Promise((resolve: any, reject: any) => {
            const element: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': gauge.availableSize.width.toString(),
                    'height': gauge.availableSize.height.toString()
                }
            });
            const isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
            const exportElement: HTMLElement = gauge.svgObject.cloneNode(true) as HTMLElement;
            const backgroundElement: HTMLElement = exportElement.childNodes[0] as HTMLElement;
            const backgroundColor: string = backgroundElement.getAttribute('fill');
            if ((gauge.theme === 'Tailwind' || gauge.theme === 'TailwindDark' || gauge.theme === 'Bootstrap5' || gauge.theme === 'Bootstrap5Dark'
                || gauge.theme === 'Fluent' || gauge.theme === 'FluentDark') && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                (exportElement.childNodes[0] as HTMLElement).setAttribute('fill', 'rgba(255,255,255, 1)');
            }
            const url: string = window.URL.createObjectURL(
                new Blob(
                    [(new XMLSerializer()).serializeToString(exportElement)],
                    { type: 'image/svg+xml' }
                )
            );
            const image: HTMLImageElement = new Image();
            const context: CanvasRenderingContext2D = element.getContext('2d');
            image.onload = (() => {
                context.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                const document: PdfDocument = new PdfDocument();
                let imageString: string = element.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                document.pageSettings.orientation = orientation;
                imageString = imageString.slice(imageString.indexOf(',') + 1);
                document.pages.add().graphics.
                    drawImage(new PdfBitmap(imageString), 0, 0, gauge.availableSize.width, gauge.availableSize.height);
                if (allowDownload) {
                    document.save(fileName + '.pdf');
                    document.destroy();
                } else {
                    resolve(null);
                }
            });
            image.src = url;
        });
        return promise;
    }

    protected getModuleName(): string {
        // Returns te module name
        return 'PdfExport';
    }

    /**
     * To destroy the PdfExport.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void { }
}
