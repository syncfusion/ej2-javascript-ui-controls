import { Column } from './../models/column';
import { Row } from './../models/row';
import { IGrid, ICell, ExportHelperArgs, ForeignKeyFormat } from '../base/interface';
import { CellType } from '../base/enum';
import { isNullOrUndefined, DateFormatOptions, Internationalization, getValue, createElement, NumberFormatOptions } from '@syncfusion/ej2-base';
import { Cell } from '../models/cell';
import { ValueFormatter } from './../services/value-formatter';
import { Query, DataManager, DataResult } from '@syncfusion/ej2-data';
import { Data } from '../actions/data';
import { getForeignData, measureColumnDepth, getUid } from '../base/util';
import { ReturnType } from '../base/type';
import { Grid } from '../base/grid';

/**
 * @hidden
 * `ExportHelper` for `PdfExport` & `ExcelExport`
 */
export class ExportHelper {
    public parent: IGrid;
    private colDepth: number;
    private hideColumnInclude: boolean = false;
    private foreignKeyData: { [key: string]: Object[] } = {};
    public constructor(parent: IGrid, foreignKeyData?: { [key: string]: Object[] }) {
        this.parent = parent;
        if (!parent.parentDetails && foreignKeyData) {
            this.foreignKeyData = foreignKeyData;
        }
    }
    public static getQuery(parent: IGrid, data: Data): Query {
        const query: Query = data.generateQuery(true).requiresCount();
        if (data.isRemote()) {
            if (parent.groupSettings.enableLazyLoading && parent.groupSettings.columns.length) {
                query.lazyLoad = [];
            } else {
                query.take(parent.pageSettings.totalRecordsCount);
            }
        }
        return query;
    }

    public getFData(value: string, column: Column): Object {
        const foreignKeyData: Object = getForeignData(column, {}, value, this.foreignKeyData[column.field])[0];
        return foreignKeyData;
    }

    public getGridRowModel(columns: Column[], dataSource: Object[], gObj: IGrid, startIndex: number = 0): Row<Column>[] {
        const rows: Row<Column>[] = [];
        const length: number = dataSource.length;
        if (length) {
            for (let i: number = 0; i < length; i++, startIndex++) {
                const options: { [x: string]: Object } = {isExpand: false};
                options.data = dataSource[parseInt(i.toString(), 10)];
                options.index = startIndex;
                if (gObj.childGrid || gObj.detailTemplate) {
                    if (gObj.hierarchyPrintMode === 'All') {
                        options.isExpand = true;
                    } else if (gObj.hierarchyPrintMode === 'Expanded' &&
                    this.parent.expandedRows && this.parent.expandedRows[parseInt(startIndex.toString(), 10)]) {
                        options.isExpand = gObj.expandedRows[parseInt(startIndex.toString(), 10)].isExpand;
                    }
                }
                const row: Row<Column> = new Row(<{ [x: string]: Object }>options);
                row.cells = this.generateCells(columns, gObj);
                rows.push(row);
            }
            this.processColumns(rows);
        }
        return rows;
    }

    private generateCells(columns: Column[], gObj: IGrid): Cell<Column>[] {
        const cells: Cell<Column>[] = [];
        if ((<{childGridLevel?: number}>gObj).childGridLevel) {
            const len: number = (<{childGridLevel?: number}>gObj).childGridLevel;
            for (let i: number = 0; len > i; i++) {
                cells.push(this.generateCell({} as Column, CellType.Indent));
            }
        }
        for (const col of columns) {
            cells.push(this.generateCell(col, CellType.Data));
        }
        return cells;
    }

    public getColumnData(gridObj: Grid): Promise<Object> {
        const columnPromise: Promise<Object>[] = [];
        let promise: Promise<Object>;
        const fColumns: Column[] = gridObj.getForeignKeyColumns();
        if (fColumns.length) {
            for (let i: number = 0; i < fColumns.length; i++) {
                const colData: DataManager = ('result' in fColumns[parseInt(i.toString(), 10)].dataSource) ?
                    new DataManager((fColumns[parseInt(i.toString(), 10)].dataSource as DataResult).result) :
                    fColumns[parseInt(i.toString(), 10)].dataSource as DataManager;
                columnPromise.push(colData.executeQuery(new Query()));
            }
            promise = Promise.all(columnPromise).then((e: ReturnType[]) => {
                for (let j: number = 0; j < fColumns.length; j++) {
                    this.foreignKeyData[fColumns[parseInt(j.toString(), 10)].field] = e[parseInt(j.toString(), 10)].result;
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any;
        }
        return promise;
    }

    public getHeaders(columns: Column[], isHideColumnInclude?: boolean): { rows: Row<Column>[], columns: Column[] } {
        if (isHideColumnInclude) {
            this.hideColumnInclude = true;
        } else {
            this.hideColumnInclude = false;
        }
        this.colDepth = measureColumnDepth(columns);
        let rows: Row<Column>[] = [];
        for (let i: number = 0; i < this.colDepth; i++) {
            rows[parseInt(i.toString(), 10)] = new Row<Column>({});
            rows[parseInt(i.toString(), 10)].cells = [];
        }
        rows = this.processColumns(rows);
        rows = this.processHeaderCells(rows, columns);
        return { rows, columns: this.generateActualColumns(columns) };
    }
    public getConvertedWidth(input: string): number {
        const value: number = parseFloat(input);
        return (input.indexOf('%') !== -1) ? (this.parent.element.getBoundingClientRect().width * value / 100) : value;
    }

    private generateActualColumns(columns: Column[], actualColumns: Column[] = []): Column[] {
        for (const column of columns) {
            if (column.commands) {
                continue;
            }
            if (!column.columns) {
                if (column.visible || this.hideColumnInclude) {
                    actualColumns.push(column);
                }
            } else {
                if (column.visible || this.hideColumnInclude) {
                    const colSpan: number = this.getCellCount(column, 0);
                    if (colSpan !== 0) {
                        this.generateActualColumns(<Column[]>column.columns, actualColumns);
                    }
                }
            }
        }
        return actualColumns;
    }

    private processHeaderCells(rows: Row<Column>[], cols: Column[]): Row<Column>[] {
        const columns: Column[] = cols;
        for (let i: number = 0; i < columns.length; i++) {
            if (!columns[parseInt(i.toString(), 10)].commands) {
                rows = this.appendGridCells(columns[parseInt(i.toString(), 10)], rows, 0);
            }
        }
        return rows;
    }

    private appendGridCells(cols: Column, gridRows: Row<Column>[], index: number): Row<Column>[] {
        if (!cols.columns && (cols.visible !== false || this.hideColumnInclude) && !cols.commands) {
            gridRows[parseInt(index.toString(), 10)].cells.push(this.generateCell(
                cols, CellType.Header, this.colDepth - index, index));
        } else if (cols.columns) {
            const colSpan: number = this.getCellCount(cols, 0);
            if (colSpan) {
                gridRows[parseInt(index.toString(), 10)].cells.push(new Cell<Column>(<{ [x: string]: Object }>{
                    cellType: CellType.StackedHeader, column: cols, colSpan: colSpan
                }));
            }
            let isIgnoreFirstCell: boolean;
            for (let i: number = 0, len: number = cols.columns.length; i < len; i++) {
                if ((cols.columns as Column[])[parseInt(i.toString(), 10)].visible && !isIgnoreFirstCell) {
                    isIgnoreFirstCell = true;
                }
                gridRows = this.appendGridCells((cols.columns as Column[])[parseInt(i.toString(), 10)], gridRows, index + 1);
            }
        }
        return gridRows;
    }

    private generateCell(
        gridColumn: Column, cellType?: CellType, rowSpan?: number,
        rowIndex?: number): Cell<Column> {
        const option: ICell<Column> = {
            'visible': gridColumn.visible,
            'isDataCell':  cellType === CellType.Data,
            'column': gridColumn,
            'cellType': cellType,
            'rowSpan': rowSpan,
            'index': rowIndex
        };
        if (!option.rowSpan || option.rowSpan < 2) {
            delete option.rowSpan;
        }
        return new Cell<Column>(<{ [x: string]: Object }>option);
    }
    private processColumns(rows: Row<Column>[]): Row<Column>[] {
        //TODO: generate dummy column for group, detail, stacked row here; ensureColumns here
        const gridObj: IGrid = this.parent;
        let columnIndexes: number[] = [];
        if (gridObj.enableColumnVirtualization) {
            columnIndexes = gridObj.getColumnIndexesInView();
        }
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            if (gridObj.allowGrouping) {
                for (let j: number = 0, len: number = gridObj.groupSettings.columns.length - 1; j < len; j++) {
                    if (gridObj.enableColumnVirtualization && columnIndexes.indexOf(j) === -1) { continue; }
                    rows[parseInt(i.toString(), 10)].cells.splice(0, 0, this.generateCell({} as Column, CellType.HeaderIndent));
                }
            }
        }
        return rows;
    }

    private getCellCount(column: Column, count: number): number {
        if (column.columns) {
            for (let i: number = 0; i < column.columns.length; i++) {
                count = this.getCellCount((<Column>column.columns[parseInt(i.toString(), 10)]), count);
            }
        } else {
            if (column.visible || this.hideColumnInclude) {
                count++;
            }
        }
        return count;
    }

    public checkAndExport(gridPool: Object, globalResolve: Function): void {
        const bool: boolean = Object.keys(gridPool).some((key: string) => {
            return !gridPool[`${key}`];
        });
        if (!bool) {
            globalResolve();
        }
    }

    public failureHandler(gridPool: Object, childGridObj: IGrid, resolve: Function): Function {
        return () => {
            gridPool[childGridObj.id] = true;
            this.checkAndExport(gridPool, resolve);
        };
    }

    public createChildGrid(gObj: IGrid, row: Row<Column>, exportType: string, gridPool: Object): {childGrid: IGrid, element: HTMLElement} {
        const childGridObj: IGrid = new Grid(this.parent.detailRowModule.getGridModel(gObj, row, exportType));
        gObj.isPrinting = false;
        const parent: string = 'parentDetails';
        childGridObj[`${parent}`] = {
            parentID: gObj.element.id,
            parentPrimaryKeys: gObj.getPrimaryKeyFieldNames(),
            parentKeyField: gObj.childGrid.queryString,
            parentKeyFieldValue: getValue(childGridObj.queryString, row.data),
            parentRowData: row.data
        };
        const exportId: string = getUid('child-grid');
        const element: HTMLElement = createElement('div', { id: exportId });
        element.style.display = 'none';
        document.body.appendChild(element);
        childGridObj.id = exportId;
        gridPool[`${exportId}`] = false;
        (<Grid>childGridObj).isExportGrid = true;
        return {childGrid: childGridObj, element};
    }

    public getGridExportColumns(columns: Column[]): Column[] {
        const actualGridColumns: Column[] = [];
        for (let i: number = 0, gridColumns: Column[] = columns; i < gridColumns.length; i++) {
            if (gridColumns[parseInt(i.toString(), 10)].type !== 'checkbox') {
                actualGridColumns.push(gridColumns[parseInt(i.toString(), 10)]);
            }
        }
        return actualGridColumns;
    }

    /**
     * Gets the foreignkey data.
     *
     * @returns {ForeignKeyFormat} returns the foreignkey data
     * @hidden
     */
    public getForeignKeyData(): ForeignKeyFormat {
        return this.foreignKeyData;
    }
}

/**
 * @hidden
 * `ExportValueFormatter` for `PdfExport` & `ExcelExport`
 */
export class ExportValueFormatter {

    private internationalization: Internationalization;
    private valueFormatter: ValueFormatter;

    public constructor(culture: string) {

        this.valueFormatter = new ValueFormatter(culture);
        this.internationalization = new Internationalization(culture);
    }

    private returnFormattedValue(args: ExportHelperArgs, customFormat: DateFormatOptions): string {
        if (!isNullOrUndefined(args.value) && args.value) {
            return this.valueFormatter.getFormatFunction(customFormat)(args.value);
        } else {
            return '';
        }
    }

    /**
     * Used to format the exporting cell value
     *
     * @param  {ExportHelperArgs} args - Specifies cell details.
     * @returns {string} returns formated value
     * @hidden
     */
    public formatCellValue(args: ExportHelperArgs): string {
        if (args.isForeignKey) {
            args.value = getValue(args.column.foreignKeyValue, getForeignData(args.column, {}, args.value as string | number)[0]);
        }
        if (args.column.type === 'number' && args.column.format !== undefined && args.column.format !== '') {
            if (typeof args.column.format === 'string') {
                args.column.format = {format: args.column.format as string};
            }
            return args.value || args.value === 0  ?
                this.internationalization.getNumberFormat(args.column.format as NumberFormatOptions)(args.value) : '';
        } else if (args.column.type === 'boolean' && args.value !== '') {
            return args.value ? 'true' : 'false';
            /* tslint:disable-next-line:max-line-length */
        } else if ((args.column.type === 'date' || args.column.type === 'dateonly' || args.column.type === 'datetime' || args.column.type === 'time') && args.column.format !== undefined) {
            if (typeof args.value === 'string') {
                args.value = new Date(args.value);
            }
            if (typeof args.column.format === 'string') {
                let format: DateFormatOptions;
                const cFormat: string = args.column.format;
                if (args.column.type === 'date' || args.column.type === 'dateonly') {
                    format = { type: 'date', skeleton: cFormat };
                } else if (args.column.type === 'time') {
                    format = { type: 'time', skeleton: cFormat };
                } else {
                    format = { type: 'dateTime', skeleton: cFormat };
                }
                return this.returnFormattedValue(args, format);
            } else {
                if (args.column.format instanceof Object && (args.column.format as DateFormatOptions).type === undefined) {
                    return (args.value.toString());
                } else {
                    let customFormat: DateFormatOptions;
                    if (args.column.type === 'date' || args.column.type === 'dateonly') {
                        customFormat = {
                            type: (args.column.format as DateFormatOptions).type,
                            format: args.column.format.format, skeleton: args.column.format.skeleton
                        };
                    } else if (args.column.type === 'time') {
                        customFormat = { type: 'time', format: args.column.format.format, skeleton: args.column.format.skeleton };
                    } else {
                        customFormat = { type: 'dateTime', format: args.column.format.format, skeleton: args.column.format.skeleton };
                    }
                    return this.returnFormattedValue(args, customFormat);
                }
            }
        } else {
            if ((!isNullOrUndefined(args.column.type) && !isNullOrUndefined(args.value)) || !isNullOrUndefined(args.value)) {
                return (args.value).toString();
            } else {
                return '';
            }
        }
    }
}
