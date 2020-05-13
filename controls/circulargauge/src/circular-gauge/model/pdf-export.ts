import {createElement, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { CircularGauge} from '../../index';
import { ExportType } from '../utils/enum';
import { PdfPageOrientation, PdfDocument, PdfBitmap } from '@syncfusion/ej2-pdf-export';

/**
 * Represent the Pdf export for gauge 
 * @hidden
 */
export class PdfExport {

    private control: CircularGauge ;

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
      * @param orientation
      * @param allowDownload
      * @private
      */
    public export(type: ExportType, fileName: string, orientation?: PdfPageOrientation, allowDownload?: boolean): Promise<string> {

        let promise: Promise<string> = new Promise((resolve: Function, reject: Function) => {
        let element: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
            id: 'ej2-canvas',
            attrs: {
                'width': this.control.availableSize.width.toString(),
                'height': this.control.availableSize.height.toString()
            }
        });
        let isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
        orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
        let url: string = window.URL.createObjectURL(
            new Blob(
                    [(new XMLSerializer()).serializeToString(this.control.svgObject)],
                    { type: 'image/svg+xml' }
            )
        );
        let image: HTMLImageElement = new Image();
        let context: CanvasRenderingContext2D = element.getContext('2d');
        image.onload = (() => {
                context.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                let document: PdfDocument = new PdfDocument();
                let imageString: string = element.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                document.pageSettings.orientation = orientation;
                imageString = imageString.slice(imageString.indexOf(',') + 1);
                document.pages.add().graphics.
                drawImage(new PdfBitmap(imageString), 0, 0, this.control.availableSize.width, this.control.availableSize.height);
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
     * @return {void}
     * @private
     */
    public destroy(gauge: CircularGauge): void {
        // Destroy method performed here
    }
}