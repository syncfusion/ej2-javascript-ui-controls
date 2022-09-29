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

    /**
     * Constructor for Maps
     *
     * @param {TreeMap} control - Specifies the treemap instance
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(control: TreeMap) {
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
    public export(treeMap: TreeMap, type: ExportType, fileName: string, orientation?: PdfPageOrientation, allowDownload ?: boolean): Promise<string> {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promise: Promise<string> = new Promise((resolve: any, reject: any) => {
            const element: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': treeMap.availableSize.width.toString(),
                    'height': treeMap.availableSize.height.toString()
                }
            });
            const isDownload: boolean = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
            const exportElement: HTMLElement = treeMap.svgObject.cloneNode(true) as HTMLElement;
            const backgroundElement: HTMLElement = exportElement.childNodes[0] as HTMLElement;
            if (!isNullOrUndefined(backgroundElement)) {
                const backgroundColor: string = backgroundElement.getAttribute('fill');
                if ((treeMap.theme === 'Tailwind' || treeMap.theme === 'TailwindDark' || treeMap.theme === 'Bootstrap5' || treeMap.theme === 'Bootstrap5Dark'
                    || treeMap.theme === 'Fluent' || treeMap.theme === 'FluentDark') && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
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
                    new PdfBitmap(imageString), 0, 0, (treeMap.availableSize.width - 60), treeMap.availableSize.height
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
     * To destroy the PdfExport.
     * 
     * @returns {void}
     * @private
     */
    public destroy(): void { }
}
