import { Grid, Column, ColumnModel, ExcelExport as GridExcelExport, PdfExport as GridPdfExport,
    ExcelExportProperties as GridExcelExportProperties, PdfExportProperties, ExcelQueryCellInfoEventArgs,
    ExcelHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs, PdfHeaderQueryCellInfoEventArgs,
    PrintEventArgs, ExcelRow, ExcelCell } from '@syncfusion/ej2-grids';
import { Workbook } from '@syncfusion/ej2-excel-export';
import { PdfDocument } from '@syncfusion/ej2-pdf-export';
import { getValue, remove, getUniqueID, Internationalization } from '@syncfusion/ej2-base';
import { PivotView } from '../base/pivotview';
import { ExcelExportProperties, BeforeExportEventArgs, FlatRecord, FlatValue, PivotActionBeginEventArgs } from '../../common/base/interface';
import { FlatSettingsModel } from '../model/flatsettings-model';
import { cloneFlat } from '../../common/base/flat-util';
import * as events from '../../common/base/constant';
import { FlatLayout } from '../actions/flat-layout';

/** Complete committed snapshots use existing Grid writers without expanding the live viewport. @hidden */
export class FlatOutput {
    private parent: PivotView;
    private jobs: Set<() => void> = new Set<() => void>();

    constructor(parent: PivotView) { this.parent = parent; }

    /**
     * Prints a detached complete result through Grid's native print workflow.
     *
     * @returns {void}
     * @hidden
     */
    public print(): void {
        const parent: PivotView = this.parent;
        let grid: Grid;
        let element: HTMLElement;
        let printElement: HTMLElement;
        let closed: boolean = false;
        const dispose: () => void = () => {
            if (closed) { return; }
            closed = true; this.jobs.delete(dispose);
            // Grid finishes its own print callback before its clone can be destroyed.
            Promise.resolve().then(() => {
                const clone: Grid = printElement && getValue('ej2_instances.0', printElement);
                if (clone) {
                    const printWindow: Window & { printGridObj?: Grid } = printElement.ownerDocument.defaultView;
                    if (printWindow && printWindow.printGridObj === clone) { delete printWindow.printGridObj; }
                }
                if (clone && !clone.isDestroyed) { clone.destroy(); }
                if (printElement && printElement.parentElement) { remove(printElement); }
                if (grid && !grid.isDestroyed) { grid.destroy(); }
                if (element && element.parentElement) { remove(element); }
            });
        };
        try {
            if (parent.isDestroyed || !parent.flatLayoutModule || !parent.flatLayoutModule.active) {
                throw new Error('Flat output requires an active record view.');
            }
            const snapshot: ReturnType<FlatLayout['outputSnapshot']> = parent.flatLayoutModule.outputSnapshot();
            if (!snapshot.columns.length) { throw new Error('Select fields before printing.'); }
            const records: FlatRecord[] = snapshot.records;
            if (snapshot.settings.totalsPosition !== 'None' && Object.keys(snapshot.values).length) {
                if (snapshot.settings.totalsPosition === 'Top') { records.unshift(snapshot.values); }
                else { records.push(snapshot.values); }
            }
            this.jobs.add(dispose);
            element = parent.createElement('div', { id: getUniqueID('flat-print'), attrs: { hidden: '', 'aria-hidden': 'true' } });
            parent.element.ownerDocument.body.appendChild(element);
            grid = new Grid({
                dataSource: records.map((record: FlatRecord) => {
                    const row: object = {};
                    snapshot.columns.forEach((column: ColumnModel, index: number) => {
                        Object.defineProperty(row, 'flat' + index, { value: record[column.field], enumerable: true });
                    });
                    return row;
                }), columns: snapshot.columns.map((column: ColumnModel, index: number) => Object.assign({}, column,
                                                                                                        { field: 'flat' + index, headerText: column.headerText || column.field,
                                                                                                            freeze: 'None', isFrozen: false, disableHtmlEncode: true })),
                locale: parent.locale, enableRtl: parent.enableRtl, enableHtmlSanitizer: parent.enableHtmlSanitizer,
                printMode: 'AllPages',
                beforePrint: (args: PrintEventArgs) => {
                    printElement = args.element as HTMLElement;
                    try {
                        if (closed || parent.isDestroyed) { args.cancel = true; }
                        else if (parent.gridSettings.beforePrint) { parent.gridSettings.beforePrint.call(parent, args); }
                        if (closed || parent.isDestroyed) { args.cancel = true; }
                        if (args.cancel) { dispose(); }
                    } catch (error) {
                        args.cancel = true; dispose(); parent.actionFailureMethod(error);
                    }
                },
                printComplete: (args: PrintEventArgs) => {
                    try {
                        if (!closed && !parent.isDestroyed && parent.gridSettings.printComplete) {
                            parent.gridSettings.printComplete.call(parent, args);
                        }
                    } finally { dispose(); }
                },
                dataBound: () => { if (!closed) { grid.print(); } }
            });
            grid.appendTo(element);
        } catch (error) {
            dispose(); if (!parent.isDestroyed) { parent.actionFailureMethod(error); }
        }
    }

    /**
     * Exports a detached snapshot through native Excel/CSV/PDF writers.
     *
     * @param {string} type - Output format.
     * @param {object} properties - Existing writer options.
     * @param {boolean} multiple - Append without downloading.
     * @param {object} document - Existing Workbook/PDF model.
     * @param {boolean} blob - Return blob through exportComplete.
     * @returns {Promise} Native writer completion.
     * @hidden
     */
    public export(type: 'Excel' | 'CSV' | 'PDF', properties: ExcelExportProperties | PdfExportProperties = {},
                  multiple?: boolean, document?: Workbook | Object, blob?: boolean): Promise<Object> {
        const parent: PivotView = this.parent;
        let canceled: boolean = false;
        return new Promise<Object>((resolve: (value: Object) => void, reject: (reason: Error) => void) => {
            let grid: Grid;
            let element: HTMLElement;
            let settled: boolean = false;
            const dispose: () => void = () => {
                this.jobs.delete(abort);
                if (grid && !grid.isDestroyed) { grid.destroy(); }
                if (element && element.parentElement) { remove(element); }
            };
            const fail: (error: Error) => void = (error: Error): void => {
                if (settled) { return; }
                settled = true; dispose();
                try {
                    if (!canceled && !parent.isDestroyed) { parent.actionFailureMethod(error); }
                } finally { reject(error); }
            };
            const abort: () => void = () => { canceled = true; fail(new Error('Flat output canceled.')); };
            try {
                if (parent.isDestroyed || !parent.flatLayoutModule || !parent.flatLayoutModule.active) {
                    throw new Error('Flat output requires an active record view.');
                }
                const snapshot: ReturnType<FlatLayout['outputSnapshot']> = parent.flatLayoutModule.outputSnapshot();
                const settings: FlatSettingsModel = snapshot.settings;
                const pdf: boolean = type === 'PDF';
                if (!(pdf ? settings.allowPdfExport : settings.allowExcelExport)) { throw new Error('Flat output is disabled.'); }
                if (!(pdf ? parent.pdfExportModule : parent.excelExportModule)) { throw new Error('Flat output requires its export module.'); }
                if (!snapshot.columns.length) { throw new Error('Select fields before exporting.'); }
                if (properties.dataSource || properties.query || properties.columns || properties.includeHiddenColumn ||
                    type !== 'PDF' && (properties as ExcelExportProperties).pivotTableIds) {
                    throw new Error('Flat output uses the committed selected record snapshot.');
                }
                const action: string = pdf ? events.pdfExport : type === 'CSV' ? events.csvExport : events.excelExport;
                const begin: PivotActionBeginEventArgs = {
                    actionName: action, cancel: false, dataSourceSettings: parent.dataSourceSettings };
                parent.trigger(events.actionBegin, begin);
                if (begin.cancel || parent.isDestroyed) { abort(); return; }
                const before: BeforeExportEventArgs = { isMultipleExport: multiple, isBlob: blob, currentExportView: 'Table' };
                if (pdf) { before.pdfExportProperties = cloneFlat(properties as PdfExportProperties); before.pdfDoc = document; }
                else {
                    before.excelExportProperties = cloneFlat(properties as ExcelExportProperties); before.workbook = document as Workbook;
                }
                parent.trigger(events.beforeExport, before);
                if (parent.isDestroyed) { abort(); return; }
                const configured: ExcelExportProperties | PdfExportProperties =
                    pdf ? before.pdfExportProperties : before.excelExportProperties;
                if (configured.dataSource || configured.query || configured.columns || configured.includeHiddenColumn) {
                    throw new Error('Flat output uses the committed selected record snapshot.');
                }
                const output: FlatRecord[] = snapshot.records;
                let total: FlatRecord;
                if (settings.totalsPosition !== 'None' && Object.keys(snapshot.values).length) {
                    total = snapshot.values;
                    if (settings.totalsPosition === 'Top') { output.unshift(total); } else { output.push(total); }
                }
                const records: object[] = output.map((record: FlatRecord, ordinal: number) => {
                    const row: object = { flatOrdinal: ordinal };
                    snapshot.columns.forEach((column: ColumnModel, index: number) => {
                        Object.defineProperty(row, 'flat' + index, { value: record[column.field], enumerable: true });
                    });
                    return row;
                });
                const physical: (column: Column) => Column = (column: Column): Column =>
                    new Column(cloneFlat(snapshot.columns[Number(column.field.slice(4))]));
                const safe: (value: string | number | boolean | Date) => string | number | boolean | Date =
                    (value: string | number | boolean | Date) => typeof value === 'string' && /^\s*[=+@-]/.test(value) ? '\'' + value : value;
                const display: (value: FlatValue, column: ColumnModel) => string = (value: FlatValue, column: ColumnModel): string => {
                    if (value === null || value === undefined) { return ''; }
                    const intl: Internationalization = new Internationalization(parent.locale);
                    if (column.format && (typeof value === 'number' || value instanceof Date)) {
                        const format: Object = typeof column.format === 'string' ? { format: column.format } : column.format;
                        return value instanceof Date ? intl.formatDate(value, format) : intl.formatNumber(value, format);
                    }
                    return value instanceof Date ? value.toISOString() : String(value);
                };
                let hookError: Error;
                const excelCell: (args: ExcelQueryCellInfoEventArgs) => void = (args: ExcelQueryCellInfoEventArgs): void => {
                    try {
                        const column: Column = physical(args.column);
                        const record: FlatRecord = output[getValue('flatOrdinal', args.data)];
                        const forwarded: ExcelQueryCellInfoEventArgs = Object.assign({}, args, { column: column, data: cloneFlat(record) });
                        if (type === 'CSV') { forwarded.value = display(forwarded.value, column); }
                        parent.trigger(events.excelQueryCellInfo, forwarded);
                        args.value = safe(forwarded.value); args.style = forwarded.style;
                        args.cell = forwarded.cell; args.image = forwarded.image;
                        args.hyperLink = forwarded.hyperLink ? Object.assign(
                            {}, forwarded.hyperLink,
                            { displayText: safe(forwarded.hyperLink.displayText || String(args.value)) }) : undefined;
                        if (forwarded.colSpan > 1) { throw new Error('Flat output does not support spanning cells.'); }
                    } catch (error) { hookError = error instanceof Error ? error : new Error('Flat output cell customization failed.'); }
                };
                Grid.Inject(GridExcelExport, GridPdfExport);
                this.jobs.add(abort);
                element = parent.createElement('div', { id: getUniqueID('flat-output'), attrs: { hidden: '', 'aria-hidden': 'true' } });
                parent.element.ownerDocument.body.appendChild(element);
                grid = new Grid({
                    dataSource: [], allowExcelExport: !pdf, allowPdfExport: pdf, locale: parent.locale, enableRtl: parent.enableRtl,
                    columns: snapshot.columns.map((column: ColumnModel, index: number) => Object.assign({}, cloneFlat(column), {
                        field: 'flat' + index, headerText: column.headerText || column.field, visible: true, freeze: 'None', isFrozen: false
                    })),
                    excelQueryCellInfo: excelCell,
                    excelHeaderQueryCellInfo: (args: ExcelHeaderQueryCellInfoEventArgs) => {
                        try {
                            const forwarded: ExcelHeaderQueryCellInfoEventArgs = Object.assign({}, args, {
                                gridCell: Object.assign({}, args.gridCell, { column: physical(getValue('column', args.gridCell)) })
                            });
                            parent.trigger(events.excelHeaderQueryCellInfo, forwarded);
                            const cell: { value: string } = args.cell as { value: string };
                            cell.value = String(safe(cell.value)); args.style = forwarded.style;
                        } catch (error) { hookError = error instanceof Error ? error : new Error('Flat header customization failed.'); }
                    },
                    pdfQueryCellInfo: (args: PdfQueryCellInfoEventArgs) => {
                        try {
                            const column: Column = physical(args.column);
                            const forwarded: PdfQueryCellInfoEventArgs = Object.assign({}, args, { column: column,
                                data: cloneFlat(output[getValue('flatOrdinal', args.data)]), value: display(args.value as FlatValue, column) });
                            parent.trigger(events.pdfQueryCellInfo, forwarded);
                            args.value = forwarded.value; args.style = forwarded.style; args.image = forwarded.image;
                            args.hyperLink = forwarded.hyperLink;
                        } catch (error) { hookError = error instanceof Error ? error : new Error('Flat PDF customization failed.'); }
                    },
                    pdfHeaderQueryCellInfo: (args: PdfHeaderQueryCellInfoEventArgs) => {
                        try {
                            const forwarded: PdfHeaderQueryCellInfoEventArgs = Object.assign({}, args, {
                                gridCell: Object.assign({}, args.gridCell, { column: physical(getValue('column', args.gridCell)) })
                            });
                            parent.trigger(events.pdfHeaderQueryCellInfo, forwarded);
                            args.style = forwarded.style;
                        } catch (error) { hookError = error instanceof Error ? error : new Error('Flat PDF header customization failed.'); }
                    },
                    dataBound: () => {
                        if (settled) { return; }
                        // Generate without saving first, so hook failures cannot download a partial file.
                        const options: GridExcelExportProperties | PdfExportProperties =
                            Object.assign({}, pdf ? before.pdfExportProperties : before.excelExportProperties,
                                          { dataSource: records, includeHiddenColumn: false, exportType: 'AllPages' });
                        const excelOptions: GridExcelExportProperties = options as GridExcelExportProperties;
                        if (!pdf && !before.workbook && !excelOptions.multipleExport) {
                            excelOptions.multipleExport = { type: 'NewSheet' };
                        }
                        // Native AppendToSheet emits its footer only on the last export.
                        // Blob generation prevents a download before validation in that case.
                        const nativeMultiple: boolean = before.isMultipleExport || !before.workbook || !excelOptions.footer;
                        const request: Promise<Object> = Promise.resolve().then(() => pdf ?
                            grid.pdfExport(options as PdfExportProperties, true, before.pdfDoc, true) : type === 'CSV' ?
                                grid.csvExport(excelOptions, nativeMultiple, before.workbook, true) :
                                grid.excelExport(excelOptions, nativeMultiple, before.workbook, true));
                        request.then((result: Object) => {
                            if (settled) { return; }
                            if (hookError) { fail(hookError); return; }
                            if (parent.isDestroyed) { abort(); return; }
                            if (!pdf) {
                                // Native header/footer and hyperlink processing runs after cell hooks.
                                // Protect the final model too, including host-supplied header/footer text.
                                const sheets: { rows: ExcelRow[] }[] =
                                    getValue('worksheets', result) || [];
                                sheets.forEach((sheet: { rows: ExcelRow[] }) => (sheet.rows || []).forEach((row: ExcelRow) =>
                                    (row.cells || []).forEach((cell: ExcelCell) => {
                                        if (getValue('formula', cell)) { throw new Error('Flat output does not support formulas.'); }
                                        cell.value = safe(cell.value);
                                    })));
                            }
                            let promise: Promise<{ blobData: Blob }>;
                            if (pdf && !before.isMultipleExport) {
                                const writer: PdfDocument = result as PdfDocument;
                                if (before.isBlob) { promise = writer.save(); }
                                else { writer.save((options as PdfExportProperties).fileName || 'Export.pdf'); }
                            }
                            if (!pdf && !before.isMultipleExport) {
                                const writer: Workbook = new Workbook(result, type === 'CSV' ? 'csv' : 'xlsx', parent.locale,
                                                                      parent.currencyCode, (options as ExcelExportProperties).separator);
                                if (before.isBlob) { promise = writer.saveAsBlob(type === 'CSV' ? 'text/csv' :
                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
                                else { writer.save((options as ExcelExportProperties).fileName || (type === 'CSV' ? 'Export.csv' : 'Export.xlsx')); }
                            }
                            const finish: () => void = () => {
                                if (settled) { return; }
                                // Keep failure settlement available while host completion callbacks execute.
                                parent.trigger(events.exportComplete, { type: type, promise: promise });
                                if (settled || parent.isDestroyed) { abort(); return; }
                                parent.trigger(events.actionComplete, { actionName: pdf ? events.pdfExported :
                                    type === 'CSV' ? events.csvExported : events.excelExported,
                                actionInfo: { exportInfo: { type: type, info: properties } } });
                                if (settled || parent.isDestroyed) { abort(); return; }
                                settled = true; dispose(); resolve(result);
                            };
                            if (promise) { promise.then(finish).catch(fail); } else { finish(); }
                        }).catch(fail);
                    }
                });
                grid.appendTo(element);
            } catch (error) { fail(error instanceof Error ? error : new Error('Flat output failed.')); }
        });
    }

    /**
     * Settles outstanding exports and releases their detached renderers.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void { Array.from(this.jobs).forEach((abort: () => void) => abort()); }
}
