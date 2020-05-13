import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { LinearGauge} from '../../index';
import { ExportType } from '../utils/enum';
import { PdfPageOrientation, PdfDocument, PdfBitmap } from '@syncfusion/ej2-pdf-export';

/**
 * Represent the print and export for gauge.
 * @hidden
 */
export class PdfExport {
    private control: LinearGauge;

    /**
     * Constructor for gauge
     * @param control 
     */
    constructor(control: LinearGauge) {
        this.control = control;
    }

    /**
     * To export the file as pdf format
     * @param type 
     * @param fileName 
     * @private
     */
    public export(type: ExportType, fileName: string,  orientation?: PdfPageOrientation, allowDownload?: boolean): Promise<string> {
        let promise: Promise<string> = new Promise((resolve: Function, reject: Function) => {
        let canvasElement: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
            id: 'ej2-canvas',
            attrs: {
                'width': this.control.availableSize.width.toString(),
                'height': this.control.availableSize.height.toString()
            }
        });
        orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
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
        let image: HTMLImageElement = new Image();
        let context: CanvasRenderingContext2D = canvasElement.getContext('2d');
        image.onload = (() => {
            context.drawImage(image, 0, 0);
            window.URL.revokeObjectURL(url);
            let document: PdfDocument = new PdfDocument();
            let imageString: string = canvasElement.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
            document.pageSettings.orientation = orientation;
            imageString = imageString.slice(imageString.indexOf(',') + 1);
            document.pages.add().graphics.drawImage(
                new PdfBitmap(imageString), 0, 0, (this.control.availableSize.width - 60), this.control.availableSize.height
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
      * @return {void}
      * @private
      */
    public destroy(control: LinearGauge): void {
        /**
         * Destroy method performed here
         */
    }
}


