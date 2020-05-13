import { createElement, Browser } from '@syncfusion/ej2-base';
import { TreeMap} from '../../index';
import { ExportType } from '../utils/enum';
import { triggerDownload } from '../utils/helper';

/**
 * ImageExport module handles the export to image functionality for treemap.
 * @hidden
 */
export class ImageExport {
    private control: TreeMap ;
    /**
     * Constructor for Maps
     * @param control 
     */
    constructor(control: TreeMap) {
        this.control = control;
    }
    /**
     * This method is used to perform the export functionality for the rendered treemap.
     * @param type 
     * @param fileName 
     * @private
     */
    public export(type: ExportType, fileName: string, allowDownload ?: boolean): Promise<string> {
        let promise: Promise<string> = new Promise((resolve: Function, reject: Function) => {
        let element: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
            id: 'ej2-canvas',

            attrs: {
                 'height': this.control.availableSize.height.toString(),
                 'width': this.control.availableSize.width.toString(),
            } });

        let isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
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
        if (type === 'SVG' ) {
            if (allowDownload) {
            triggerDownload(
                fileName, type,
                url, isDownload
            );
        }else {
            resolve(null);
        }

        } else {
            let image: HTMLImageElement = new Image();
            let context: CanvasRenderingContext2D = element.getContext('2d');
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
     * @return {void}
     * @private
     */
    public destroy(treemap: TreeMap): void {
        // Destroy method performed here
    }


}