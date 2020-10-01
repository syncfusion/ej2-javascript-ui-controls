import { isNullOrUndefined, extend, addClass } from '@syncfusion/ej2-base';
import { attributes as addAttributes } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { rowDataBound, queryCellInfo } from '../base/constant';
import { setStyleAndAttributes, getObject, extendObjWithFn } from '../base/util';
import { ICellRenderer, IRowRenderer, IRow, QueryCellInfoEventArgs, RowDataBoundEventArgs, IGrid } from '../base/interface';
import { CellType } from '../base/enum';
import { CellRendererFactory } from '../services/cell-render-factory';
import { ServiceLocator } from '../services/service-locator';
import { CellMergeRender } from './cell-merge-renderer';
/**
 * RowRenderer class which responsible for building row content. 
 * @hidden
 */
export class RowRenderer<T> implements IRowRenderer<T> {

    public element: Element;

    private cellRenderer: ICellRenderer<T>;

    private serviceLocator: ServiceLocator;

    private cellType: CellType;

    private isSpan: boolean = false;

    protected parent: IGrid;

    constructor(serviceLocator?: ServiceLocator, cellType?: CellType, parent?: IGrid) {
        this.cellType = cellType;
        this.serviceLocator = serviceLocator;
        this.parent = parent;
        this.element = this.parent.createElement('tr', { attrs: { role: 'row' } });
    }

    /**
     * Function to render the row content based on Column[] and data.
     * @param  {Column[]} columns
     * @param  {Object} data?
     * @param  {{[x:string]:Object}} attributes?
     * @param  {string} rowTemplate?
     */
    public render(row: Row<T>, columns: Column[], attributes?: { [x: string]: Object }, rowTemplate?: string, cloneNode?: Element):
        Element {
        return this.refreshRow(row, columns, attributes, rowTemplate, cloneNode);
    }

    /**
     * Function to refresh the row content based on Column[] and data.
     * @param  {Column[]} columns
     * @param  {Object} data?
     * @param  {{[x:string]:Object}} attributes?
     * @param  {string} rowTemplate?
     */
    public refresh(row: Row<T>, columns: Column[], isChanged: boolean, attributes?: { [x: string]: Object }, rowTemplate?: string): void {
        if (isChanged) {
            row.data = extendObjWithFn({}, row.changes);
            this.refreshMergeCells(row);
        }
        let node: Element = this.parent.element.querySelector('[data-uid=' + row.uid + ']');
        let tr: Element = this.refreshRow(row, columns, attributes, rowTemplate, null, isChanged);
        let cells: HTMLTableDataCellElement[] = [].slice.call((tr as HTMLTableRowElement).cells);
        node.innerHTML = '';
        for (let cell of cells) {
            node.appendChild(cell);
        }
    }

    // tslint:disable-next-line:max-func-body-length
    private refreshRow(
        row: Row<T>, columns: Column[], attributes?: { [x: string]: Object }, rowTemplate?: string, cloneNode?: Element, isEdit?: boolean):
        Element {
        let tr: Element = !isNullOrUndefined(cloneNode) ? cloneNode : this.element.cloneNode() as Element;
        let rowArgs: RowDataBoundEventArgs = { data: row.data };
        let cellArgs: QueryCellInfoEventArgs = { data: row.data };
        let attrCopy: Object = extend({}, attributes, {});
        let chekBoxEnable: Column = this.parent.getColumns().filter((col: Column) => col.type === 'checkbox' && col.field)[0];
        let value: boolean = false;
        if (chekBoxEnable) {
            value = getObject(chekBoxEnable.field, rowArgs.data);
        }
        if (row.isDataRow) {
            row.isSelected = this.parent.getSelectedRowIndexes().indexOf(row.index) > -1 || value;
        }
        if (row.isDataRow && this.parent.isCheckBoxSelection
            && this.parent.checkAllRows === 'Check' && this.parent.enableVirtualization) {
            row.isSelected = true;
            if (this.parent.getSelectedRowIndexes().indexOf(row.index) === -1) {
                this.parent.getSelectedRowIndexes().push(row.index);
            }

        }
        this.buildAttributeFromRow(tr, row);

        addAttributes(tr, attrCopy as { [x: string]: string });
        setStyleAndAttributes(tr, row.attributes);

        let cellRendererFact: CellRendererFactory = this.serviceLocator.getService<CellRendererFactory>('cellRendererFactory');
        for (let i: number = 0, len: number = row.cells.length; i < len; i++) {
            let cell: Cell<T> = row.cells[i]; cell.isSelected = row.isSelected;
            let cellRenderer: ICellRenderer<T> = cellRendererFact.getCellRenderer(row.cells[i].cellType || CellType.Data);
            let attrs: {} = { 'index': !isNullOrUndefined(row.index) ? row.index.toString() : '' };
            if (row.isExpand && row.cells[i].cellType === CellType.DetailExpand) {
                attrs['class'] = this.parent.isPrinting ? 'e-detailrowcollapse' : 'e-detailrowexpand';
            }
            let td: Element = cellRenderer.render(row.cells[i], row.data, attrs, row.isExpand, isEdit);
            if (row.cells[i].cellType !== CellType.Filter) {
                if (row.cells[i].cellType === CellType.Data || row.cells[i].cellType === CellType.CommandColumn) {
                    this.parent.trigger(queryCellInfo, extend(
                        cellArgs, <QueryCellInfoEventArgs>{
                            cell: td, column: <{}>cell.column, colSpan: 1,
                            rowSpan: 1, foreignKeyData: row.cells[i].foreignKeyData,
                            requestType: this.parent.requestTypeAction
                        }));
                    let isRowSpanned: boolean = false;
                    if (row.index > 0 && this.isSpan) {
                        let prevRowCells: Cell<Column>[] = this.parent.groupSettings.columns.length > 0 &&
                            !this.parent.getRowsObject()[row.index - 1].isDataRow ?
                            this.parent.getRowsObject()[row.index].cells : this.parent.getRowsObject()[row.index - 1].cells;
                        let uid: string = 'uid';
                        let prevRowCell: Cell<Column> = prevRowCells.filter((cell: Cell<Column>) =>
                            cell.column.uid === row.cells[i].column[uid])[0];
                        isRowSpanned = prevRowCell.isRowSpanned ? prevRowCell.isRowSpanned : prevRowCell.rowSpanRange > 1;
                    }
                    if (cellArgs.colSpan > 1 || row.cells[i].cellSpan > 1 || cellArgs.rowSpan > 1 || isRowSpanned) {
                        this.isSpan = true;
                        let cellMerge: CellMergeRender<T> = new CellMergeRender(this.serviceLocator, this.parent);
                        td = cellMerge.render(cellArgs, row, i, td);
                    }
                }
                if (!row.cells[i].isSpanned) {
                    tr.appendChild(td);
                }
            }
        }
        let args: RowDataBoundEventArgs = { row: tr, rowHeight: this.parent.rowHeight };
        if (row.isDataRow) {
            this.parent.trigger(rowDataBound, extend(rowArgs, args));
            if (this.parent.childGrid || this.parent.isRowDragable() || this.parent.detailTemplate) {
                let td: Element = tr.querySelectorAll('.e-rowcell:not(.e-hide)')[0];
                if (td) {
                    td.classList.add('e-detailrowvisible');
                }
            }
        }
        if (this.parent.enableVirtualization) {
            rowArgs.rowHeight = this.parent.rowHeight;
        }
        if (rowArgs.rowHeight) {
            (tr as HTMLElement).style.height = rowArgs.rowHeight + 'px';
        } else if (this.parent.rowHeight && (tr.querySelector('.e-headercell') || tr.querySelector('.e-groupcaption'))) {
            (tr as HTMLElement).style.height = this.parent.rowHeight + 'px';
        }
        if (row.cssClass) {
            tr.classList.add(row.cssClass);
        }
        if (row.lazyLoadCssClass) {
            tr.classList.add(row.lazyLoadCssClass);
        }
        let vFTable: boolean = this.parent.enableColumnVirtualization && this.parent.frozenColumns !== 0;
        if (!vFTable && this.parent.element.scrollHeight > this.parent.height && this.parent.aggregates.length) {
            for (let i: number = 0; i < this.parent.aggregates.length; i++) {
                let property: string = 'properties';
                let column: string = 'columns';
                if (this.parent.aggregates[i][property][column][0].footerTemplate) {
                    let summarycell: NodeList = tr.querySelectorAll('.e-summarycell');
                    if (summarycell.length) {
                        let lastSummaryCell: Element = (summarycell[summarycell.length - 1]) as Element;
                        addClass([lastSummaryCell], ['e-lastsummarycell']);
                    }
                }
            }
        }
        return tr;
    }
    private refreshMergeCells(row: Row<T>): Row<T> {
        for (let cell of row.cells) {
            cell.isSpanned = false;
        }
        return row;
    }
    /**
     * Function to check and add alternative row css class.
     * @param  {Element} tr
     * @param  {{[x:string]:Object}} attr
     */
    public buildAttributeFromRow(tr: Element, row: Row<T>): void {
        let attr: IRow<T> & { 'class'?: string[] } = {};
        let prop: { 'rowindex'?: string; 'dataUID'?: string, 'ariaSelected'?: string }
            = { 'rowindex': 'aria-rowindex', 'dataUID': 'data-uid', 'ariaSelected': 'aria-selected' };
        let classes: string[] = [];

        if (row.isDataRow) {
            classes.push('e-row');
        }

        if (row.isAltRow) {
            classes.push('e-altrow');
        }

        if (!isNullOrUndefined(row.index)) {
            attr[prop.rowindex] = row.index;
        }

        if (row.rowSpan) {
            attr.rowSpan = row.rowSpan;
        }

        if (row.uid) {
            attr[prop.dataUID] = row.uid;
        }

        if (row.isSelected) {
            attr[prop.ariaSelected] = true;
        }

        if (row.visible === false) {
            classes.push('e-hide');
        }

        attr.class = classes;

        setStyleAndAttributes(tr, attr);
    }

}