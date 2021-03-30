import { PdfGanttTheme } from './../export/pdf-base/pdf-style/gantt-theme';
import { IGanttStyle, PdfExportProperties, IGanttData } from './../base/interface';
import { PdfTreeGridLayoutFormat, PdfTreeGridLayoutResult } from './../export/pdf-base/index';
import { isNullOrUndefined, getValue, extend } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { ExportHelper } from '../export/export-helper';
import {
    PdfDocument, PdfSection, PdfPage, PdfPageSettings, PdfPageOrientation, SizeF,
    PdfLayoutBreakType
} from '@syncfusion/ej2-pdf-export';
import { PdfPageSize } from '../base/enum';
import { PdfGantt } from '../export/pdf-gantt';

/**
 *
 * @hidden
 */
export class PdfExport {
    private parent: Gantt;
    private helper: ExportHelper;
    private pdfDocument: PdfDocument;
    public gantt: PdfGantt;
    public isPdfExport: boolean = false;
    /**
     * @param {Gantt} parent .
     * @hidden
     */
    constructor(parent?: Gantt) {
        this.parent = parent;
        this.helper = new ExportHelper(this.parent);
        this.pdfDocument = undefined;
    }
    /**
     * @returns {string} .
     */
    private getModuleName(): string {
        return 'pdfExport';
    }
    /**
     * To destroy Pdf export module.
     *
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        // Destroy Method
    }

    private initGantt(): void {
        this.pdfDocument = undefined;
        this.gantt = new PdfGantt(this.parent);
        // this.gantt.exportValueFormatter = new ExportValueFormatter(this.parent.locale);
    }
    /**
     * @param {PdfExportProperties} pdfExportProperties .
     * @param {boolean} isMultipleExport .
     * @param {object} pdfDoc .
     * @returns {Promise<Object>} .
     */
    // eslint-disable-next-line
    public export(pdfExportProperties?: PdfExportProperties, isMultipleExport?: boolean, pdfDoc?: Object): Promise<Object> {
        // eslint-disable-next-line
        const args: Object = {
            requestType: 'beforePdfExport',
            ganttObject: this.parent,
            cancel: false
        };
        this.parent.trigger('beforePdfExport', args);
        if (getValue('cancel', args)) {
            /* eslint-disable-next-line */
            return new Promise((resolve: Function, reject: Function) => {
                return resolve();
            });
        }
        /* eslint-disable-next-line */
        return new Promise((resolve: Function, reject: Function) => {
            this.exportWithData(pdfDoc, resolve, pdfExportProperties, isMultipleExport);
        });
    }

    // eslint-disable-next-line
    private exportWithData(pdfDoc: Object, resolve: Function, pdfExportProperties: PdfExportProperties, isMultipleExport: boolean): void {
        let data: IGanttData[] = [];
        if (isNullOrUndefined(pdfExportProperties)) {
            pdfExportProperties = {};
        }
        if (pdfExportProperties.exportType === 'CurrentViewData') {
            data = this.parent.currentViewData;
        } else {
            data = this.parent.flatData;
        }
        this.initGantt();
        if (!isNullOrUndefined(pdfDoc)) {
            this.pdfDocument = <PdfDocument>pdfDoc;
        } else {
            this.pdfDocument = new PdfDocument();
        }
        this.processExport(data, pdfExportProperties, isMultipleExport).then(() => {
            this.parent.trigger('pdfExportComplete', {});
            resolve(this.pdfDocument);
        });
    }
    // eslint-disable-next-line
    private processExport(data: IGanttData[], pdfExportProperties: PdfExportProperties, isMultipleExport: boolean): Promise<Object> {
        const section: PdfSection = this.pdfDocument.sections.add() as PdfSection;
        this.processSectionExportProperties(section, pdfExportProperties);
        const pdfPage: PdfPage = section.pages.add();
        /* eslint-disable-next-line */
        return new Promise((resolve: Function, reject: Function) => {
            this.helper.processGridExport(data, this.gantt, pdfExportProperties);
            this.helper.initializePdf(this.pdfDocument);
            resolve();
        }).then(() => {
            const format: PdfTreeGridLayoutFormat = new PdfTreeGridLayoutFormat();
            format.break = PdfLayoutBreakType.FitElement;
            const layouter: PdfTreeGridLayoutResult = this.gantt.drawGrid(pdfPage, 0, 0, format);
            this.gantt.drawChart(layouter);
            if (!isMultipleExport) {
                // save the PDF
                if (!isNullOrUndefined(pdfExportProperties) && pdfExportProperties.fileName) {
                    this.pdfDocument.save(pdfExportProperties.fileName);
                } else {
                    this.pdfDocument.save('Export.pdf');
                }
                this.pdfDocument.destroy();
            }
            return this.pdfDocument;
        });
    }

    private processSectionExportProperties(section: PdfSection, pdfExportProperties: PdfExportProperties): void {
        //To set section page size and page orientation.
        if (!isNullOrUndefined(pdfExportProperties)) {
            const pdfPageSettings: PdfPageSettings = new PdfPageSettings();
            if (!isNullOrUndefined(pdfExportProperties.pageOrientation && pdfExportProperties.pageOrientation === 'Portrait')) {
                pdfPageSettings.orientation = PdfPageOrientation.Portrait;
            } else {
                pdfPageSettings.orientation = PdfPageOrientation.Landscape;
            }
            if (!isNullOrUndefined(pdfExportProperties.pageSize)) {
                pdfPageSettings.size = this.getPageSize(pdfExportProperties.pageSize);
            }
            section.setPageSettings(pdfPageSettings);

            if (!isNullOrUndefined(pdfExportProperties.ganttStyle)) {
                const defaultGanttTheme: IGanttStyle = new PdfGanttTheme(pdfExportProperties.theme).style;
                this.gantt.ganttStyle = extend({}, defaultGanttTheme, pdfExportProperties.ganttStyle, true);
            } else {
                this.gantt.ganttStyle = new PdfGanttTheme(pdfExportProperties.theme).style;
            }
        } else {
            this.gantt.ganttStyle = new PdfGanttTheme(pdfExportProperties.theme).style;
        }
    }

    private getPageSize(pageSize: PdfPageSize): SizeF {
        switch (pageSize) {
        case 'Letter':
            return new SizeF(612, 792);
        case 'Note':
            return new SizeF(540, 720);
        case 'Legal':
            return new SizeF(612, 1008);
        case 'A0':
            return new SizeF(2380, 3368);
        case 'A1':
            return new SizeF(1684, 2380);
        case 'A2':
            return new SizeF(1190, 1684);
        case 'A3':
            return new SizeF(842, 1190);
        case 'A5':
            return new SizeF(421, 595);
        case 'A6':
            return new SizeF(297, 421);
        case 'A7':
            return new SizeF(210, 297);
        case 'A8':
            return new SizeF(148, 210);
        case 'A9':
            return new SizeF(105, 148);
            // case 'A10':
            //     return new SizeF(74, 105);
        case 'B0':
            return new SizeF(2836, 4008);
        case 'B1':
            return new SizeF(2004, 2836);
        case 'B2':
            return new SizeF(1418, 2004);
        case 'B3':
            return new SizeF(1002, 1418);
        case 'B4':
            return new SizeF(709, 1002);
        case 'B5':
            return new SizeF(501, 709);
        case 'Archa':
            return new SizeF(648, 864);
        case 'Archb':
            return new SizeF(864, 1296);
        case 'Archc':
            return new SizeF(1296, 1728);
        case 'Archd':
            return new SizeF(1728, 2592);
        case 'Arche':
            return new SizeF(2592, 3456);
        case 'Flsa':
            return new SizeF(612, 936);
        case 'HalfLetter':
            return new SizeF(396, 612);
        case 'Letter11x17':
            return new SizeF(792, 1224);
        case 'Ledger':
            return new SizeF(1224, 792);
        default:
            return new SizeF(595, 842);
        }
    }
}
