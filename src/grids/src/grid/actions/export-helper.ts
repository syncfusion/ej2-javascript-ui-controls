import { Column } from './../models/column';
import { Row } from './../models/row';
import { IGrid, ICell } from '../base/interface';
import { CellType } from '../base/enum';
import { isNullOrUndefined, DateFormatOptions, Internationalization, getValue } from '@syncfusion/ej2-base';
import { Cell } from '../models/cell';
import { ValueFormatter } from './../services/value-formatter';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Data } from '../actions/data';
import { getForeignData } from '../base/util';
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
    public constructor(parent: IGrid) {
        this.parent = parent;
    }
    public static getQuery(parent: IGrid, data: Data): Query {
        return data.isRemote() ?
            data.generateQuery(true).requiresCount().take(parent.pageSettings.totalRecordsCount) :
            data.generateQuery(true).requiresCount();
    }

    public getFData(value: string, column: Column): Object {
        let foreignKeyData: Object = getForeignData(column, {}, value, this.foreignKeyData[column.field])[0];
        return foreignKeyData;
    }

    public getColumnData(gridObj: Grid): Promise<Object>  {
        let columnPromise: Promise<Object>[] = [];
        let promise: Promise<Object>;
        let fColumns: Column[] = gridObj.getForeignKeyColumns();
        if (fColumns.length) {
            fColumns.forEach((col: Column) => {
                columnPromise.push((<DataManager>col.dataSource).executeQuery(new Query()));
            });
            promise = Promise.all(columnPromise).then((e: ReturnType[]) => {
                fColumns.forEach((col: Column, index: number) => {
                    this.foreignKeyData[col.field] = e[index].result;
                });
                // tslint:disable-next-line:no-any
            }) as any;
        }
        return promise;
    }

    /* tslint:disable:no-any */
    public getHeaders(column: any[], isHideColumnInclude?: boolean): { rows: any[], columns: Column[] } {
        if (isHideColumnInclude) {
            this.hideColumnInclude = true;
        } else {
            this.hideColumnInclude = false;
        }
        let cols: any[] = column;
        this.colDepth = this.measureColumnDepth(cols);
        let rows: Row<Column>[] = [];
        let actualColumns: Column[] = [];
        for (let i: number = 0; i < this.colDepth; i++) {
            rows[i] = new Row<Column>({});
            rows[i].cells = [];
        }
        rows = this.processColumns(rows);
        rows = this.processHeaderCells(rows);
        for (let row of rows) {
            for (let i: number = 0; i < row.cells.length; i++) {
                let cell: any = row.cells[i];
                if (cell.visible === undefined && cell.cellType !== CellType.StackedHeader) {
                    row.cells = this.removeCellFromRow(row.cells, i);
                    i = i - 1;
                }
                if ((!isHideColumnInclude) && cell.visible !== undefined && (!cell.visible)) {
                    row.cells = this.removeCellFromRow(row.cells, i);
                    i = i - 1;
                }
            }
        }
        for (let i: number = 0; i < cols.length; i++) {
            this.generateActualColumns(cols[i], actualColumns);
        }
        return { rows: rows, columns: actualColumns };
    }
    public getConvertedWidth(input: string): number {
        let value: number = parseFloat(input);
        /* tslint:disable-next-line:max-line-length */
        return (input.indexOf('%') !== -1) ? (this.parent.element.getBoundingClientRect().width * value / 100) : value;
    }
    private generateActualColumns(column: any, actualColumns: Column[]): void {/* tslint:enable:no-any */
        if (column.commands) {
            return;
        }
        if (!column.columns) {
            if (column.visible || this.hideColumnInclude) {
                actualColumns.push(column);
            }
        } else {
            if (column.visible || this.hideColumnInclude) {
                let colSpan: number = this.getCellCount(column, 0);
                if (colSpan !== 0) {
                    for (let i: number = 0; i < column.columns.length; i++) {
                        /* tslint:disable-next-line:max-line-length */
                        this.generateActualColumns(column.columns[i], actualColumns);
                    }
                }
            }
        }
    }
    private removeCellFromRow(cells: Cell<Column>[], cellIndex: number): Cell<Column>[] {
        let resultCells: Cell<Column>[] = [];
        for (let i: number = 0; i < cellIndex; i++) {
            resultCells.push(cells[i]);
        }
        for (let i: number = (cellIndex + 1); i < cells.length; i++) {
            resultCells.push(cells[i]);
        }
        return resultCells;
    }
    private processHeaderCells(rows: Row<Column>[]): Row<Column>[] {
        let columns: Column[] = this.parent.enableColumnVirtualization ? this.parent.getColumns() : this.parent.columns as Column[];
        for (let i: number = 0; i < columns.length; i++) {
            if (!columns[i].commands) {
                rows = this.appendGridCells(columns[i], rows, 0, i === 0, false, i === (columns.length - 1));
            }
        }
        return rows;
    }
    /* tslint:disable */
    private appendGridCells(
        cols: Column, gridRows: Row<Column>[], index: number, isFirstObj: boolean, isFirstColumn: boolean, isLastColumn: boolean): Row<Column>[] {
        /* tslint:enable */
        let lastCol: string = isLastColumn ? 'e-lastcell' : '';
        if (!cols.columns) {
            gridRows[index].cells.push(this.generateCell(
                cols, CellType.Header, this.colDepth - index,
                (isFirstObj ? '' : (isFirstColumn ? 'e-firstcell' : '')) + lastCol, index, this.parent.getColumnIndexByUid(cols.uid)));
        } else {
            let colSpan: number = this.getCellCount(cols, 0);
            if (colSpan) {
                gridRows[index].cells.push(new Cell<Column>(<{ [x: string]: Object }>{
                    cellType: CellType.StackedHeader, column: cols, colSpan: colSpan
                }));
            }
            let isFirstCell: boolean;
            let isIgnoreFirstCell: boolean;
            for (let i: number = 0, len: number = cols.columns.length; i < len; i++) {
                isFirstCell = false;
                if ((cols.columns as Column[])[i].visible && !isIgnoreFirstCell) {
                    isFirstCell = true;
                    isIgnoreFirstCell = true;
                }
                /* tslint:disable-next-line:max-line-length */
                gridRows = this.appendGridCells((cols.columns as Column[])[i], gridRows, index + 1, isFirstObj, i === 0, i === (len - 1) && isLastColumn);
            }
        }
        return gridRows;
    }
    private generateCell(
        gridColumn: Column, cellType?: CellType, rowSpan?: number, className?: string,
        rowIndex?: number, columnIndex?: number): Cell<Column> {
        let option: ICell<Column> = {
            'visible': gridColumn.visible,
            'isDataCell': false,
            'isTemplate': !isNullOrUndefined(gridColumn.headerTemplate),
            'rowID': '',
            'column': gridColumn,
            'cellType': cellType,
            'rowSpan': rowSpan,
            'className': className,
            'index': rowIndex,
            'colIndex': columnIndex
        };
        if (!option.rowSpan || option.rowSpan < 2) {
            delete option.rowSpan;
        }
        return new Cell<Column>(<{ [x: string]: Object }>option);
    }
    private processColumns(rows: Row<Column>[]): Row<Column>[] {
        //TODO: generate dummy column for group, detail, stacked row here; ensureColumns here
        let gridObj: IGrid = this.parent;
        let columnIndexes: number[] = this.parent.getColumnIndexesInView();
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            if (gridObj.allowGrouping) {
                for (let j: number = 0, len: number = gridObj.groupSettings.columns.length; j < len; j++) {
                    if (this.parent.enableColumnVirtualization && columnIndexes.indexOf(j) === -1) { continue; }
                    rows[i].cells.push(this.generateCell({} as Column, CellType.HeaderIndent));
                }
            }
            if (gridObj.detailTemplate || gridObj.childGrid) {
                rows[i].cells.push(this.generateCell({} as Column, CellType.DetailHeader));
            }
        }
        return rows;
    }
    /* tslint:disable:no-any */
    private getCellCount(column: any, count: number): number {/* tslint:enable:no-any */
        if (column.columns) {
            for (let i: number = 0; i < column.columns.length; i++) {
                count = this.getCellCount(column.columns[i], count);
            }
        } else {
            if (column.visible || this.hideColumnInclude) {
                count++;
            }
        }
        return count;
    }
    /* tslint:disable:no-any */
    private measureColumnDepth(column: any[]): number {/* tslint:enable:no-any */
        let max: number = 0;
        for (let i: number = 0; i < column.length; i++) {
            let depth: number = this.checkDepth(column[i], 0);
            if (max < depth) {
                max = depth;
            }
        }
        return max + 1;
    }
    /* tslint:disable:no-any */
    private checkDepth(col: any, index: number): number {/* tslint:enable:no-any */
        let max: number = index;
        let indices: number[] = [];
        if (col.columns) {
            index++;
            for (let i: number = 0; i < col.columns.length; i++) {
                indices[i] = this.checkDepth(col.columns[i], index);
            }
            for (let j: number = 0; j < indices.length; j++) {
                if (max < indices[j]) {
                    max = indices[j];
                }
            }
            index = max;
        }
        return index;
    };
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

    /* tslint:disable-next-line:no-any */
    private returnFormattedValue(args: any, customFormat: DateFormatOptions): string {
        if (!isNullOrUndefined(args.value) && args.value) {
            return this.valueFormatter.getFormatFunction(customFormat)(args.value);
        } else {
            return '';
        }
    }


    /* tslint:disable-next-line:no-any */
    public formatCellValue(args: any): string {
        if (args.isForeignKey) {
            args.value = getValue(args.column.foreignKeyValue, getForeignData(args.column, {}, args.value)[0]);
        }
        if (args.column.type === 'number' && args.column.format !== undefined && args.column.format !== '') {
            return args.value ? this.internationalization.getNumberFormat({ format: args.column.format })(args.value) : '';
        } else if (args.column.type === 'boolean') {
            return args.value ? 'true' : 'false';
            /* tslint:disable-next-line:max-line-length */
        } else if ((args.column.type === 'date' || args.column.type === 'datetime' || args.column.type === 'time') && args.column.format !== undefined) {
            if (typeof args.column.format === 'string') {
                let format: DateFormatOptions;
                if (args.column.type === 'date') {
                    format = { type: 'date', skeleton: args.column.format };
                } else if (args.column.type === 'time') {
                    format = { type: 'time', skeleton: args.column.format };
                } else {
                    format = { type: 'dateTime', skeleton: args.column.format };
                }
                return this.returnFormattedValue(args, format);
            } else {
                if (args.column.format instanceof Object && args.column.format.type === undefined) {
                    return (args.value.toString());
                } else {
                    /* tslint:disable-next-line:max-line-length */
                    let customFormat: DateFormatOptions;
                    if (args.column.type === 'date') {
                        /* tslint:disable-next-line:max-line-length */
                        customFormat = { type: args.column.format.type, format: args.column.format.format, skeleton: args.column.format.skeleton };
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