import { createElement, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { TreeMap} from '../../index';
import { ExportType } from '../utils/enum';
import { PdfPageOrientation, PdfDocument, PdfBitmap } from '@syncfusion/ej2-pdf-export';

/**
 * PdfExport module handles the export to pdf functionality for treemap.
 *
 * @hidden
 */
export class PdfExport {
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
     * @param {ExportType} type - Specifies the type of the document.
     * @param {string} fileName - Specifies the name of the document.
     * @param {PdfPageOrientation} orientation - Specifies the orientation of the PDF document to export the component.
     * @param {boolean} allowDownload - Specifies whether to download the document or not.
     * @returns {Promise} - Returns the string.
     * @private
     */
    public export(type: ExportType, fileName: string, orientation?: PdfPageOrientation, allowDownload ?: boolean): Promise<string> {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promise: Promise<string> = new Promise((resolve: any, reject: any) => {
            const element: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': this.control.availableSize.width.toString(),
                    'height': this.control.availableSize.height.toString()
                }
            });
            const isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
            const exportElement: HTMLElement = this.control.svgObject.cloneNode(true) as HTMLElement;
            const backgroundElement: HTMLElement = exportElement.childNodes[0] as HTMLElement;
            if (!isNullOrUndefined(backgroundElement)) {
                const backgroundColor: string = backgroundElement.getAttribute('fill');
                if ((this.control.theme === 'Tailwind' || this.control.theme === 'TailwindDark' || this.control.theme === 'Bootstrap5' || this.control.theme === 'Bootstrap5Dark')
                    && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                    (exportElement.childNodes[0] as HTMLElement).setAttribute('fill', 'rgba(255,255,255, 1)');
                }
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
                document.pages.add().graphics.drawImage(
                    new PdfBitmap(imageString), 0, 0, (this.control.availableSize.width - 60), this.control.availableSize.height
                );
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
     * To destroy the ImageExport.
     *
     * @param {TreeMap} treemap - Specifies the treemap instance.
     * @returns {void}
     * @private
     */
    public destroy(treemap: TreeMap): void {
        // Destroy method performed here
    }
}
