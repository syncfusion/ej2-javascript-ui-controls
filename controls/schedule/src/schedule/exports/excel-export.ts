import { Workbook, Worksheet, Worksheets, Column } from '@syncfusion/ej2-excel-export';
import { Schedule } from '../base/schedule';
import { ExcelFormat } from '../base/type';
import { ExportOptions } from '../base/interface';
import { extend } from '@syncfusion/ej2-base';

/**
 * Excel Export Module
 */

export class ExcelExport {
    private parent: Schedule;

    constructor(parent: Schedule) {
        this.parent = parent;
    }

    public initializeExcelExport(excelExportOptions: ExportOptions): void {
        let exportFields: string[] = excelExportOptions.fields || Object.keys(this.parent.eventFields).map((field: string) =>
            (<{ [key: string]: Object }>this.parent.eventFields)[field]) as string[];
        let exportName: string = excelExportOptions.fileName || 'Schedule';
        let exportType: ExcelFormat = excelExportOptions.exportType || 'xlsx';
        let isIncludeOccurrences: boolean = excelExportOptions.includeOccurrences || false;
        let eventCollection: { [key: string]: Object }[];
        if (excelExportOptions.customData) {
            eventCollection = !isIncludeOccurrences ? excelExportOptions.customData :
                this.parent.eventBase.getProcessedEvents(excelExportOptions.customData) as { [key: string]: Object }[];
        } else {
            eventCollection = (!isIncludeOccurrences ? this.parent.eventsData : this.parent.eventsProcessed) as { [key: string]: Object }[];
        }
        this.processWorkbook(exportFields, exportName, exportType, eventCollection);
    }

    private processWorkbook(fields: string[], name: string, type: ExcelFormat, eventCollection: { [key: string]: Object }[]): void {
        let columns: Column[] = [];
        let rows: Object[] = [];
        let columnHeader: Object[] = [];
        fields.forEach((field: string, i: number) => columns.push({ index: i + 1, width: (field === 'Id' ? 20 : 150) }));
        let style: Object = { fontSize: 12, borders: { color: '#E0E0E0' }, bold: true };
        fields.forEach((field: string, i: number) => columnHeader.push({ index: i + 1, value: field, style: style }));
        rows.push({ index: 1, cells: columnHeader });
        let i: number = 2;
        for (let event of eventCollection) {
            let columnData: Object[] = [];
            fields.forEach((field: string, n: number) => {
                let columnRule: Object = { index: n + 1, value: event[field || ''] };
                if (field === this.parent.eventFields.startTime || field === this.parent.eventFields.endTime) {
                    let styleRule: Object = { fontSize: 12, numberFormat: 'm/d/yyyy h:mm AM/PM' };
                    columnRule = extend({}, columnRule, { style: styleRule }, true);
                }
                columnData.push(columnRule);
            });
            rows.push({ index: i, cells: columnData });
            i++;
        }
        let workSheet: Worksheets = [{ columns: columns, rows: rows } as Worksheet];
        let book: Workbook = new Workbook({ worksheets: workSheet }, type, this.parent.locale);
        book.save(name + '.' + type);
    }

    protected getModuleName(): string {
        return 'excelExport';
    }

    public destroy(): void {
        this.parent = null;
    }
}
