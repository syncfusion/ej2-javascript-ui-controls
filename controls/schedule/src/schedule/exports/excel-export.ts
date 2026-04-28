/* eslint-disable @typescript-eslint/no-explicit-any */
import { Workbook, Worksheet, Worksheets, Column } from '@syncfusion/ej2-excel-export';
import { Schedule } from '../base/schedule';
import { ExcelFormat } from '../base/type';
import { ExcelExportEventArgs, ExportFieldInfo, ExportOptions } from '../base/interface';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as events from '../base/constant';

/**
 * Excel Export Module
 */

export class ExcelExport {
    private parent: Schedule;

    constructor(parent: Schedule) {
        this.parent = parent;
    }

    public initializeExcelExport(excelExportOptions: ExportOptions = {}): void {
        const exportColumns: ExportFieldInfo[] = this.getExportColumns(excelExportOptions);
        const exportName: string = excelExportOptions.fileName || 'Schedule';
        const exportType: ExcelFormat = excelExportOptions.exportType || 'xlsx';
        const isIncludeOccurrences: boolean = excelExportOptions.includeOccurrences || false;
        let separator: string;
        if (!isNullOrUndefined(excelExportOptions.separator) && excelExportOptions.separator !== ',') {
            separator = excelExportOptions.separator;
        }
        let eventCollection: Record<string, any>[];
        if (excelExportOptions.customData) {
            eventCollection = !isIncludeOccurrences ? excelExportOptions.customData :
                this.parent.eventBase.getProcessedEvents(excelExportOptions.customData);
        } else {
            eventCollection = !isIncludeOccurrences ? this.parent.eventsData : this.parent.eventsProcessed;
        }
        this.processWorkbook(exportColumns, exportName, exportType, eventCollection, separator);
    }

    private processWorkbook(fields: ExportFieldInfo[], name: string, type: ExcelFormat, eventCollection: Record<string, any>[],
                            separator: string): void {
        const columns: Column[] = [];
        const rows: Record<string, any>[] = [];
        const columnHeader: Record<string, any>[] = [];
        fields.forEach((field: ExportFieldInfo, i: number) => { columns.push({ index: i + 1, width: (field.name === 'Id' ? 50 : 150) }); });
        const style: Record<string, any> = { fontSize: 12, borders: { color: '#E0E0E0' }, bold: true };
        fields.forEach((field: ExportFieldInfo, i: number) => { columnHeader.push({ index: i + 1, value: field.text, style: style }); });
        rows.push({ index: 1, cells: columnHeader });
        eventCollection.forEach((event: Record<string, any>, i: number) => {
            const columnData: Record<string, any>[] = [];
            fields.forEach((field: ExportFieldInfo, n: number) => {
                let columnRule: Record<string, any> = { index: n + 1, value: event[field.name] || '' };
                if (field.name === this.parent.eventFields.startTime || field.name === this.parent.eventFields.endTime) {
                    const styleRule: Record<string, any> = { fontSize: 12, numberFormat: 'm/d/yyyy h:mm a' };
                    columnRule = extend({}, columnRule, { style: styleRule }, true) as Record<string, any>;
                }
                columnData.push(columnRule);
            });
            rows.push({ index: i + 2, cells: columnData });
        });
        const workSheet: Worksheets = [{ columns: columns, rows: rows } as Worksheet];
        const args: ExcelExportEventArgs = { cancel: false, worksheets: workSheet };
        this.parent.trigger(events.excelExport, args, (args: ExcelExportEventArgs) => {
            if (args.cancel) {
                return;
            }
            const book: Workbook = new Workbook({ worksheets: args.worksheets }, type, this.parent.locale, undefined, separator);
            book.save(name + '.' + type);
        });
    }

    private getExportColumns(exportOptions: ExportOptions): ExportFieldInfo[] {
        const exportColumns: ExportFieldInfo[] = exportOptions.fieldsInfo || [];
        if (exportColumns.length === 0) {
            const fields: string[] = exportOptions.fields || Object.keys(this.parent.eventFields).map((field: string) =>
                (<Record<string, any>>this.parent.eventFields)[`${field}`]) as string[];
            fields.forEach((field: string) => { exportColumns.push({ name: field, text: field }); });
        }
        return exportColumns;
    }

    protected getModuleName(): string {
        return 'excelExport';
    }

    public destroy(): void {
        this.parent = null;
    }

}
