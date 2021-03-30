/* eslint-disable @typescript-eslint/no-explicit-any */
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
        const exportFields: string[] = excelExportOptions.fields || Object.keys(this.parent.eventFields).map((field: string) =>
            (<Record<string, any>>this.parent.eventFields)[field]) as string[];
        const exportName: string = excelExportOptions.fileName || 'Schedule';
        const exportType: ExcelFormat = excelExportOptions.exportType || 'xlsx';
        const isIncludeOccurrences: boolean = excelExportOptions.includeOccurrences || false;
        let eventCollection: Record<string, any>[];
        if (excelExportOptions.customData) {
            eventCollection = !isIncludeOccurrences ? excelExportOptions.customData :
                this.parent.eventBase.getProcessedEvents(excelExportOptions.customData);
        } else {
            eventCollection = !isIncludeOccurrences ? this.parent.eventsData : this.parent.eventsProcessed;
        }
        this.processWorkbook(exportFields, exportName, exportType, eventCollection);
    }

    private processWorkbook(fields: string[], name: string, type: ExcelFormat, eventCollection: Record<string, any>[]): void {
        const columns: Column[] = [];
        const rows: Record<string, any>[] = [];
        const columnHeader: Record<string, any>[] = [];
        fields.forEach((field: string, i: number) => columns.push({ index: i + 1, width: (field === 'Id' ? 20 : 150) }));
        const style: Record<string, any> = { fontSize: 12, borders: { color: '#E0E0E0' }, bold: true };
        fields.forEach((field: string, i: number) => columnHeader.push({ index: i + 1, value: field, style: style }));
        rows.push({ index: 1, cells: columnHeader });
        let i: number = 2;
        for (const event of eventCollection) {
            const columnData: Record<string, any>[] = [];
            fields.forEach((field: string, n: number) => {
                let columnRule: Record<string, any> = { index: n + 1, value: event[field] || '' };
                if (field === this.parent.eventFields.startTime || field === this.parent.eventFields.endTime) {
                    const styleRule: Record<string, any> = { fontSize: 12, numberFormat: 'm/d/yyyy h:mm AM/PM' };
                    columnRule = extend({}, columnRule, { style: styleRule }, true) as Record<string, any>;
                }
                columnData.push(columnRule);
            });
            rows.push({ index: i, cells: columnData });
            i++;
        }
        const workSheet: Worksheets = [{ columns: columns, rows: rows } as Worksheet];
        const book: Workbook = new Workbook({ worksheets: workSheet }, type, this.parent.locale);
        book.save(name + '.' + type);
    }

    protected getModuleName(): string {
        return 'excelExport';
    }

    public destroy(): void {
        this.parent = null;
    }

}
