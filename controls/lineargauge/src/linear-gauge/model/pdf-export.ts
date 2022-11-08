/* eslint-disable valid-jsdoc */
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { LinearGauge} from '../../index';
import { ExportType } from '../utils/enum';
import { PdfPageOrientation, PdfDocument, PdfBitmap } from '@syncfusion/ej2-pdf-export';

/**
 * Represent the print and export for gauge.
 *
 * @hidden
 */
export class PdfExport {

    /**
     * Constructor for gauge
     *
     * @param control
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(control: LinearGauge) {
    }

    /**
     * To export the file as pdf format
     *
     * @param type
     * @param fileName
     * @private
     */
    public export(gauge: LinearGauge, type: ExportType, fileName: string,  orientation?: PdfPageOrientation, allowDownload?: boolean): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promise: Promise<string> = new Promise((resolve: any, reject: any) => {
            const canvasElement: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': gauge.availableSize.width.toString(),
                    'height': gauge.availableSize.height.toString()
                }
            });
            orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
            const svgData: string = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
            gauge.svgObject.outerHTML +
            '</svg>';
            const exportElement: HTMLElement = gauge.svgObject.cloneNode(true) as HTMLElement;
            const backgroundElement: HTMLElement = exportElement.childNodes[0] as HTMLElement;
            const backgroundColor: string = backgroundElement.getAttribute('fill');
            if ((gauge.theme === 'Tailwind' || gauge.theme === 'TailwindDark' || gauge.theme === 'Bootstrap5' || gauge.theme === 'Bootstrap5Dark'
                || gauge.theme === 'Fluent' || gauge.theme === 'FluentDark') && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                (exportElement.childNodes[0] as HTMLElement).setAttribute('fill', 'rgba(255,255,255, 1)');
            }
            const url: string = window.URL.createObjectURL(
                new Blob(
                    type === 'SVG' ? [svgData] :
                        [(new XMLSerializer()).serializeToString(exportElement)],
                    { type: 'image/svg+xml' }
                )
            );
            const image: HTMLImageElement = new Image();
            const context: CanvasRenderingContext2D = canvasElement.getContext('2d');
            image.onload = (() => {
                context.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                const document: PdfDocument = new PdfDocument();
                let imageString: string = canvasElement.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                document.pageSettings.orientation = orientation;
                imageString = imageString.slice(imageString.indexOf(',') + 1);
                document.pages.add().graphics.drawImage(
                    new PdfBitmap(imageString), 0, 0, (gauge.availableSize.width - 60), gauge.availableSize.height
                );
                if (allowDownload) {
                    document.save(fileName + '.pdf');
                    document.destroy();
                } else {
                    resolve (null);
                }
            });
            image.src = url;
        });
        return promise;
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'PdfExport';
    }

    /**
     * To destroy the PdfExport.
     *
     * @return {void}
     * @private
     */
    public destroy(): void {
    }
}


