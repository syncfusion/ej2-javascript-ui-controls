import { isNullOrUndefined, extend, addClass, removeClass } from '@syncfusion/ej2-base';
import { attributes as addAttributes } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { rowDataBound, queryCellInfo } from '../base/constant';
import { setStyleAndAttributes, getObject, extendObjWithFn, applyStickyLeftRightPosition, groupCaptionRowLeftRightPos, resetColspanGroupCaption, resetColandRowSpanStickyPosition } from '../base/util';
import { ICellRenderer, IRowRenderer, IRow, QueryCellInfoEventArgs, RowDataBoundEventArgs, IGrid } from '../base/interface';
import { CellType } from '../base/enum';
import { CellRendererFactory } from '../services/cell-render-factory';
import { ServiceLocator } from '../services/service-locator';
import { CellMergeRender } from './cell-merge-renderer';
import * as literals from '../base/string-literals';
/**
 * RowRenderer class which responsible for building row content.
 *
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

    /* eslint-disable */
    /**
     * Function to render the row content based on Column[] and data.
     *
     * @param {Row<T>} row - specifies the row
     * @param {Column[]} columns - specifies the columns
     * @param {Object} attributes - specifies the attributes
     * @param {string} rowTemplate - specifies the rowTemplate
     * @param {Element} cloneNode - specifies the cloneNode
     * @returns {Element} returns the element
     */
    /* eslint-enable */
    public render(row: Row<T>, columns: Column[], attributes?: { [x: string]: Object }, rowTemplate?: string, cloneNode?: Element):
    Element {
        return this.refreshRow(row, columns, attributes, rowTemplate, cloneNode);
    }

    /* eslint-disable */
    /**
     * Function to refresh the row content based on Column[] and data.
     *
     * @param {Row<T>} row - specifies the row
     * @param {Column[]} columns - specifies the column
     * @param {boolean} isChanged - specifies isChanged
     * @param {Object} attributes - specifies the attributes
     * @param {string} rowTemplate - specifies the rowTemplate
     * @returns {void}
     */
    /* eslint-enable */
    public refresh(row: Row<T>, columns: Column[], isChanged: boolean, attributes?: { [x: string]: Object }, rowTemplate?: string): void {
        if (isChanged) {
            row.data = extendObjWithFn({}, row.changes);
            this.refreshMergeCells(row);
        }
        const node: Element = this.parent.element.querySelector('[data-uid=' + row.uid + ']');
        const tr: Element = this.refreshRow(row, columns, attributes, rowTemplate, null, isChanged);
        const cells: HTMLTableDataCellElement[] = [].slice.call((tr as HTMLTableRowElement).cells);
        const tempCells: HTMLTableDataCellElement[] =  [].slice.call(node.querySelectorAll('.e-templatecell'));
        if (this.parent.isReact && tempCells.length) {
            for (const col of columns) {
                if (col.template) {
                    setTimeout(
                        () => {
                            this.parent.refreshReactColumnTemplateByUid(col.uid, true);
                        },
                        0);
                    break;
                }
            }
        }
        const attr : [] = [].slice.call(tr.attributes);
        attr.map((item: {name: string, value: string}) => {
            node.setAttribute(item['name'], item['value']);
        });
        node.innerHTML = '';
        for (const cell of cells) {
            node.appendChild(cell);
        }
    }

    // tslint:disable-next-line:max-func-body-length
    private refreshRow(
        row: Row<T>, columns: Column[], attributes?: { [x: string]: Object }, rowTemplate?: string, cloneNode?: Element, isEdit?: boolean):
        Element {
        const tr: Element = !isNullOrUndefined(cloneNode) ? cloneNode : this.element.cloneNode() as Element;
        const rowArgs: RowDataBoundEventArgs = { data: row.data };
        const cellArgs: QueryCellInfoEventArgs = { data: row.data };
        const chekBoxEnable: Column = this.parent.getColumns().filter((col: Column) => col.type === 'checkbox' && col.field)[0];
        let value: boolean = false;
        const isFrozen: boolean = this.parent.isFrozenGrid();
        let isFirstVisibleCell: boolean = true;
        if (chekBoxEnable) {
            value = getObject(chekBoxEnable.field, rowArgs.data);
        }
        const selIndex: number[] = this.parent.getSelectedRowIndexes();
        if (row.isDataRow) {
            row.isSelected = selIndex.indexOf(row.index) > -1 || value;
        }
        let currentViewData: Object[] = this.parent.currentViewData;
        if (row.isDataRow && this.parent.isCheckBoxSelection
            && this.parent.checkAllRows === 'Check' && (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)) {
            row.isSelected = true;
            if (selIndex.indexOf(row.index) === -1) {
                selIndex.push(row.index);
            }

        }
        this.buildAttributeFromRow(tr, row);

        addAttributes(tr, extend({}, attributes, {}) as { [x: string]: string });
        setStyleAndAttributes(tr, row.attributes);

        const cellRendererFact: CellRendererFactory = this.serviceLocator.getService<CellRendererFactory>('cellRendererFactory');
        for (let i: number = 0, len: number = row.cells.length; i < len; i++) {
            const cell: Cell<T> = row.cells[parseInt(i.toString(), 10)]; cell.isSelected = row.isSelected;
            cell.isColumnSelected = (<{ isSelected?: boolean }>cell.column).isSelected;
            const cellRenderer: ICellRenderer<T> = cellRendererFact.getCellRenderer(row.cells[parseInt(i.toString(), 10)].cellType
                || CellType.Data);
            const attrs: {} = { 'data-index': !isNullOrUndefined(row.index) ? row.index.toString() : '' };
            if (row.isExpand && row.cells[parseInt(i.toString(), 10)].cellType === CellType.DetailExpand) {
                attrs['class'] = this.parent.isPrinting ? 'e-detailrowcollapse' : 'e-detailrowexpand';
            }
            const isGroupFirstCell: boolean = !this.parent.enableRtl && this.parent.groupSettings && isFirstVisibleCell &&
                this.parent.groupSettings.columns.length && (this.parent.gridLines === 'Vertical' || this.parent.gridLines === 'Both');
            let td: Element = cellRenderer.render(row.cells[parseInt(i.toString(), 10)], row.data, attrs, row.isExpand, isEdit);
            if (row.cells[parseInt(i.toString(), 10)].cellType !== CellType.Filter) {
                if (row.cells[parseInt(i.toString(), 10)].cellType === CellType.Data
                    || row.cells[parseInt(i.toString(), 10)].cellType === CellType.CommandColumn) {
                    if (cell.visible && isGroupFirstCell) {
                        td.classList.add('e-grid-group-first-cell');
                        isFirstVisibleCell = false;
                    }
                    const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
                        this.parent.parentDetails.parentInstObj.isReact;
                    const isReactPrintGrid: boolean = this.parent.printGridParent && this.parent.printGridParent.isReact;
                    if (((this.parent.isReact && this.parent.requireTemplateRef) || (isReactChild &&
                        this.parent.parentDetails.parentInstObj.requireTemplateRef) || (isReactPrintGrid
                        && this.parent.printGridParent.requireTemplateRef)) && cell.isTemplate) {
                        // eslint-disable-next-line @typescript-eslint/no-this-alias
                        const thisRef: RowRenderer<T> = this;
                        thisRef.parent.renderTemplates(function(): void {
                            if (typeof ((<{ template?: string | Function }>cell.column).template) !== 'string') {
                                const ariaAttr: string = td.getAttribute('aria-label');
                                td.setAttribute('aria-label', (td as HTMLElement).innerText + ariaAttr);
                            }
                            thisRef.parent.trigger(queryCellInfo, extend(
                                cellArgs, <QueryCellInfoEventArgs>{
                                    cell: td, column: <{}>cell.column, colSpan: 1,
                                    rowSpan: 1, foreignKeyData: row.cells[parseInt(i.toString(), 10)].foreignKeyData,
                                    requestType: thisRef.parent.requestTypeAction
                                }));
                        });
                    }
                    else {
                        this.parent.trigger(queryCellInfo, extend(
                            cellArgs, <QueryCellInfoEventArgs>{
                                cell: td, column: <{}>cell.column, colSpan: 1,
                                rowSpan: 1, foreignKeyData: row.cells[parseInt(i.toString(), 10)].foreignKeyData,
                                requestType: this.parent.requestTypeAction
                            }));
                    }
                    const isNotSpanable: boolean = this.parent.enableVirtualization || this.parent.enableColumnVirtualization
                    || this.parent.enableInfiniteScrolling || (this.parent.allowGrouping
                    && this.parent.groupSettings.columns.length && this.parent.groupSettings.enableLazyLoading);
                    if (!isNotSpanable) {
                        const field: string = 'field';
                        const dateTypes: string[] = ['date', 'datetime', 'dateonly'];
                        if (row.isDataRow && this.parent.enableColumnSpan && (<{ enableColumnSpan?: boolean }>cell.column).enableColumnSpan
                            && !cell.isSpanned && cell.visible && !cell.isTemplate && row.data[cell.column[`${field}`]] !== '' && !cell.isForeignKey) {
                            let colspan: number = 1;
                            let cellValue: Date | number | string | null | undefined =
                            (<{ getValue?: Function }>cellRenderer).getValue(cell.column[`${field}`], row.data, cell.column);
                            if (dateTypes.indexOf((<{ type?: string }>cell.column).type) !== -1 && !isNullOrUndefined(cellValue)
                                && cellValue instanceof Date) {
                                cellValue = cellValue.getTime();
                            }
                            for (let j: number = i; j < row.cells.length - 1; j++) {
                                const nextCell: Cell<T> = row.cells[parseInt(j.toString(), 10) + 1];
                                let nextCellValue: Date | number | string | null | undefined =
                                (<{ getValue?: Function }>cellRenderer).getValue(nextCell.column[`${field}`], row.data, nextCell.column);
                                if (dateTypes.indexOf((<{ type?: string }>nextCell.column).type) !== -1 && !isNullOrUndefined(nextCellValue)
                                    && nextCellValue instanceof Date) {
                                    nextCellValue = nextCellValue.getTime();
                                }
                                if (cellValue === nextCellValue && nextCell.visible
                                    && (<{ enableColumnSpan?: boolean }>nextCell.column).enableColumnSpan && !nextCell.isForeignKey) {
                                    colspan++;
                                } else {
                                    break;
                                }
                            }
                            cellArgs.colSpan = colspan;
                        }
                        if (row.isDataRow && this.parent.enableRowSpan && (<{ enableRowSpan?: boolean }>cell.column).enableRowSpan
                        && !cell.isSpanned && !cell.isTemplate && cell.visible && row.data[cell.column[`${field}`]] !== '' && !cell.isForeignKey) {
                            const nxtRowIndex: number = this.parent.groupSettings.columns.length ? row.groupDataIndex : row.index;
                            if (row.isDataRow && this.parent.groupSettings.columns.length && !isNullOrUndefined(row.parentUid)) {
                                currentViewData = (<{ items?: Object[] }>this.parent.getRowObjectFromUID(row.parentUid).data).items;
                            }
                            let rowspan: number = 1;
                            let cellValue: Date | number | string | null | undefined =
                            (<{ getValue?: Function }>cellRenderer).getValue(cell.column[`${field}`], row.data, cell.column);
                            if (dateTypes.indexOf((<{ type?: string }>cell.column).type) !== -1 && !isNullOrUndefined(cellValue)
                                && cellValue instanceof Date) {
                                cellValue = cellValue.getTime();
                            }
                            for (let j: number = nxtRowIndex + 1; j < currentViewData.length; j++) {
                                let nextRowCellValue: Date | number | string | null | undefined =
                                (<{ getValue?: Function }>cellRenderer).getValue(cell.column[`${field}`], currentViewData[parseInt(j.toString(), 10)], cell.column);
                                if (dateTypes.indexOf((<{ type?: string }>cell.column).type) !== -1 && !isNullOrUndefined(nextRowCellValue)
                                    && nextRowCellValue instanceof Date) {
                                    nextRowCellValue = nextRowCellValue.getTime();
                                }
                                if (cellValue === nextRowCellValue) {
                                    rowspan++;
                                } else {
                                    break;
                                }
                            }
                            cellArgs.rowSpan = rowspan;
                        }
                    }
                    let isRowSpanned: boolean = false;
                    if (row.index > 0 && (this.isSpan || (this.parent.isSpan && isEdit))) {
                        const rowsObject: Row<Column>[] = this.parent.getRowsObject().filter((row: Row<Column>) => row.isDataRow);
                        const prevRowCells: Cell<Column>[] = this.parent.groupSettings.columns.length > 0 &&
                            !rowsObject[row.index - 1].isDataRow ? rowsObject[row.index].cells : rowsObject[row.index - 1].cells;
                        const uid: string = 'uid';
                        const prevRowCell: Cell<Column> = prevRowCells.filter((cell: Cell<Column>) =>
                            cell.column.uid === row.cells[parseInt(i.toString(), 10)].column[`${uid}`])[0];
                        isRowSpanned = prevRowCell.isRowSpanned ? prevRowCell.isRowSpanned : prevRowCell.rowSpanRange > 1;
                    }
                    if ((cellArgs.rowSpan > 1 || cellArgs.colSpan > 1)) {
                        this.resetrowSpanvalue(this.parent.frozenRows > row.index ? this.parent.frozenRows :
                            currentViewData.length, cellArgs, row.index);
                        if (cellArgs.column.visible === false) {
                            cellArgs.colSpan = 1;
                        } else {
                            if (isFrozen) {
                                const columns: Column[] = this.parent.getColumns();
                                const right: number = this.parent.getFrozenRightColumnsCount();
                                const left: number = this.parent.getFrozenLeftCount();
                                const movableCount: number = columns.length - right;
                                const cellIdx: number = cellArgs.column.index;
                                if (left > cellIdx && left < (cellIdx + cellArgs.colSpan)) {
                                    const colSpan: number = (cellIdx + cellArgs.colSpan) - left;
                                    cellArgs.colSpan = cellArgs.colSpan - colSpan;
                                } else if (movableCount <= cellIdx && columns.length < (cellIdx + cellArgs.colSpan)) {
                                    const colSpan: number = (cellIdx + cellArgs.colSpan) - columns.length;
                                    cellArgs.colSpan = cellArgs.colSpan - colSpan;
                                } else if (cellArgs.column.freeze === 'Fixed') {
                                    let colSpan: number = 1;
                                    const index: number = cellIdx;
                                    for (let j: number = index + 1; j < index + cellArgs.colSpan; j++) {
                                        if (columns[parseInt(j.toString(), 10)].freeze === 'Fixed') {
                                            colSpan++;
                                        } else {
                                            break;
                                        }
                                    }
                                    cellArgs.colSpan = colSpan;
                                } else if (movableCount > cellIdx && movableCount < (cellIdx + cellArgs.colSpan)) {
                                    const colSpan: number = (cellIdx + cellArgs.colSpan) - movableCount;
                                    cellArgs.colSpan = cellArgs.colSpan - colSpan;
                                }
                            }
                        }
                    }
                    if (cellArgs.colSpan > 1 || row.cells[parseInt(i.toString(), 10)].cellSpan > 1 || cellArgs.rowSpan > 1
                        || isRowSpanned) {
                        this.parent.isSpan = true;
                        this.isSpan = true;
                        const cellMerge: CellMergeRender<T> = new CellMergeRender(this.serviceLocator, this.parent);
                        td = cellMerge.render(cellArgs, row, i, td);
                        if (isFrozen) {
                            resetColandRowSpanStickyPosition(this.parent, cellArgs.column, td, cellArgs.colSpan);
                        }
                    }
                }
                if ((cell.cellType === CellType.Header || cell.cellType === CellType.StackedHeader) &&
                    isGroupFirstCell && (cell.visible || cell.cellType === CellType.StackedHeader)) {
                    const visibleColumns: Column[] = this.parent.getVisibleColumns();
                    const field: string = 'field';
                    const type: string = 'type';
                    if ((cell.column[`${type}`] && cell.column[`${type}`] === 'checkbox') ||
                        (cell.cellType === CellType.Header && cell.column[`${field}`] && visibleColumns.length &&
                            visibleColumns[0].field === cell.column[`${field}`]) || cell.cellType === CellType.StackedHeader) {
                        td.classList.add('e-grid-group-first-cell');
                        isFirstVisibleCell = false;
                    }
                }
                if (cell.cellType === CellType.Header && (row.cells[parseInt(i.toString(), 10)].colSpan > 1 ||
                    row.cells[parseInt(i.toString(), 10)].rowSpan > 1)) {
                    const cellMerge: CellMergeRender<T> = new CellMergeRender(this.serviceLocator, this.parent);
                    td = cellMerge.render(<Object>row.cells[parseInt(i.toString(), 10)], row, i, td);
                }
                if (this.isSpan) {
                    const rowsObject: Row<Column>[] = this.parent.getRowsObject();
                    const isRtl: boolean = this.parent.enableRtl;
                    if (rowsObject[row.index - 1] && rowsObject[row.index - 1].isDataRow) {
                        const prevRowCells: Cell<Column>[] = rowsObject[row.index - 1].cells;
                        const prevRowCell: Cell<Column> = prevRowCells[i - 1];
                        const currentRowCell: Cell<Column> = prevRowCells[parseInt(i.toString(), 10)];
                        const nextRowCell: Cell<Column> = prevRowCells[i + 1];
                        const direction: string = prevRowCells[parseInt(i.toString(), 10)].column.freeze;
                        if (prevRowCell && (prevRowCell.isRowSpanned || prevRowCell.rowSpanRange > 1) && prevRowCell.visible) {
                            if (!isRtl && (!currentRowCell.isRowSpanned || prevRowCell.rowSpanRange > currentRowCell.rowSpanRange)){
                                td.classList.add('e-rowcell-firstchild');
                            }
                            if (isFrozen) {
                                if (prevRowCell.column.freeze === 'Fixed' && direction === 'Fixed') {
                                    td.classList.add(isRtl ? 'e-removefreezerightborder' : 'e-removefreezeleftborder');
                                } else if (!isRtl && i === 1 && direction === 'Left') {
                                    td.classList.add('e-addfreezefirstchildborder');
                                }
                            }
                        }
                        if (nextRowCell && (nextRowCell.isRowSpanned || nextRowCell.rowSpanRange > 1) && nextRowCell.visible ) {
                            if (isRtl && (!currentRowCell.isRowSpanned || nextRowCell.rowSpanRange > currentRowCell.rowSpanRange)) {
                                td.classList.add('e-rowcell-lastchild');
                            }
                            if (isFrozen && nextRowCell.column.freeze === 'Fixed' && direction === 'Fixed' && cellArgs.colSpan < 2) {
                                td.classList.add(isRtl ? 'e-removefreezeleftborder' : 'e-removefreezerightborder');
                            }
                        }
                    }
                }
                if (cellArgs.rowSpan > 1 && currentViewData.length - row.index === cellArgs.rowSpan) {
                    td.classList.add('e-row-span-lastrowcell');
                }
                if (!row.cells[parseInt(i.toString(), 10)].isSpanned) {
                    tr.appendChild(td);
                }
            }
        }
        let emptyColspan: number = 0;
        if (this.parent.groupSettings.columns.length && this.parent.getFrozenLeftColumnsCount()) {
            if (tr.classList.contains('e-groupcaptionrow')) {
                const freezeCells: HTMLElement[] = [].slice.call(tr.querySelectorAll(
                    '.e-leftfreeze,.e-unfreeze,.e-rightfreeze,.e-fixedfreeze,.e-freezerightborder,.e-freezeleftborder'));
                if (freezeCells.length) {
                    removeClass(freezeCells, ['e-leftfreeze', 'e-unfreeze', 'e-rightfreeze', 'e-fixedfreeze', 'e-freezerightborder', 'e-freezeleftborder']);
                }
                if (tr.querySelector('.e-summarycell')) {
                    groupCaptionRowLeftRightPos(tr, this.parent);
                } else {
                    for (let j: number = 0; j < tr.childNodes.length; j++) {
                        const td: HTMLElement = tr.childNodes[parseInt(j.toString(), 10)] as HTMLElement;
                        td.classList.add('e-leftfreeze');
                        applyStickyLeftRightPosition(td, j * 30, this.parent.enableRtl, 'Left');
                        if (td.classList.contains('e-groupcaption')) {
                            const oldColspan: number = parseInt(td.getAttribute('colspan'), 10);
                            const colspan: number = resetColspanGroupCaption(this.parent, j);
                            td.setAttribute('colspan', colspan.toString());
                            emptyColspan = oldColspan - colspan;
                        }
                    }
                    if (emptyColspan) {
                        const td: HTMLElement = this.parent.createElement('TD', {
                            className: 'e-groupcaption',
                            attrs: { colspan: emptyColspan.toString(), id: this.parent.element.id + 'captioncell', tabindex: '-1' }
                        });
                        tr.appendChild(td);
                    }
                }
            }
            if ((tr.querySelectorAll('.e-leftfreeze').length || tr.classList.contains('e-columnheader')) &&
                (tr.querySelectorAll('.e-indentcell').length || tr.querySelectorAll('.e-grouptopleftcell').length)) {
                const td: NodeListOf<Element> = tr.querySelectorAll('.e-indentcell, .e-grouptopleftcell');
                for (let i: number = 0; i < td.length; i++) {
                    td[parseInt(i.toString(), 10)].classList.add('e-leftfreeze');
                    applyStickyLeftRightPosition(td[parseInt(i.toString(), 10)] as HTMLElement, i * 30, this.parent.enableRtl, 'Left');
                }
            }
        }
        const args: RowDataBoundEventArgs = { row: tr, rowHeight: this.parent.rowHeight };
        if (row.isDataRow) {
            const eventArg: RowDataBoundEventArgs = extend(rowArgs, args); eventArg.isSelectable = true;
            const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
                this.parent.parentDetails.parentInstObj.isReact;
            const cellTemplate: NodeListOf<Element> = eventArg.row.querySelectorAll('.e-templatecell');
            if (((this.parent.isReact && this.parent.requireTemplateRef) || (isReactChild &&
                this.parent.parentDetails.parentInstObj.requireTemplateRef)) && cellTemplate.length) {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const thisRef: RowRenderer<T> = this;
                thisRef.parent.renderTemplates(function(): void {
                    thisRef.parent.trigger(rowDataBound, eventArg);
                    if (!eventArg.isSelectable) {
                        row.isSelectable = eventArg.isSelectable;
                        thisRef.disableRowSelection(thisRef, row, args, eventArg);
                    }
                });
            }
            else {
                this.parent.trigger(rowDataBound, eventArg);
            }
            row.isSelectable = eventArg.isSelectable;
            const isDraggable: boolean = this.parent.isRowDragable();
            if (this.parent.allowPaging && this.parent.selectionSettings.persistSelection) {
                const primaryKey: string = this.parent.getPrimaryKeyFieldNames()[0];
                const pKey: string = row.data ? row.data[`${primaryKey}`] : null;
                const SelectedRecords: Object[] = eventArg.isSelectable ? this.parent.partialSelectedRecords :
                    this.parent.disableSelectedRecords;
                if (!SelectedRecords.some((data: Object) => data[`${primaryKey}`] === pKey)) {
                    SelectedRecords.push(row.data);
                }
            }
            if (!eventArg.isSelectable) {
                this.disableRowSelection(this, row, args, eventArg);
            }
            if (this.parent.childGrid || isDraggable || this.parent.detailTemplate) {
                const td: Element = tr.querySelectorAll('.e-rowcell:not(.e-hide)')[0];
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
        if (this.parent.rowRenderingMode === 'Vertical' && this.parent.allowTextWrap && (this.parent.textWrapSettings.wrapMode === 'Header'
            || this.parent.textWrapSettings.wrapMode === 'Both')) {
            tr.classList.add('e-verticalwrap');
        }
        const vFTable: boolean = this.parent.enableColumnVirtualization;
        if (!vFTable && this.parent.aggregates.length && this.parent.element.scrollHeight > this.parent.height) {
            for (let i: number = 0; i < this.parent.aggregates.length; i++) {
                const property: string = 'properties';
                const column: string = 'columns';
                if (this.parent.aggregates[parseInt(i.toString(), 10)][`${property}`][`${column}`][0].footerTemplate) {
                    const summarycell: NodeList = [].slice.call(tr.getElementsByClassName('e-summarycell'));
                    if (summarycell.length) {
                        const lastSummaryCell: Element = (summarycell[summarycell.length - 1]) as Element;
                        addClass([lastSummaryCell], ['e-lastsummarycell']);
                        const firstSummaryCell: Element = (summarycell[0]) as Element;
                        addClass([firstSummaryCell], ['e-firstsummarycell']);
                    }
                }
            }
        }
        return tr;
    }
    private resetrowSpanvalue(rowCount: number, cellArgs: QueryCellInfoEventArgs, rowIndex: number): void {
        if (rowCount > rowIndex && rowCount < rowIndex + cellArgs.rowSpan) {
            const rowSpan: number = (rowIndex + cellArgs.rowSpan) - rowCount;
            cellArgs.rowSpan = cellArgs.rowSpan - rowSpan;
        }
    }
    private disableRowSelection (thisRef: RowRenderer<T>, row: Row<T>, args: RowDataBoundEventArgs, eventArg: RowDataBoundEventArgs): void {
        const selIndex: number[] = this.parent.getSelectedRowIndexes();
        this.parent.selectionModule.isPartialSelection = true; row.isSelected = false;
        const selRowIndex: number = selIndex.indexOf(row.index);
        if (selRowIndex > -1) {
            selIndex.splice(selRowIndex, 1);
        }
        const chkBox: NodeList = args.row.querySelectorAll('.e-rowcell.e-gridchkbox');
        const isDrag: Element = eventArg.row.querySelector('.e-rowdragdrop');
        const cellIdx: number = thisRef.parent.groupSettings.columns.length + (isDrag || thisRef.parent.isDetail() ? 1 : 0);
        for (let i: number = 0; i < chkBox.length; i++) {
            (chkBox[parseInt(i.toString(), 10)] as HTMLElement).firstElementChild.classList.add('e-checkbox-disabled');
            (chkBox[parseInt(i.toString(), 10)] as HTMLElement).querySelector('.e-frame').classList.remove('e-check');
        }
        if (row.cells.length) {
            for (let i: number = cellIdx; i < row.cells.length; i++) {
                const cell: Element = eventArg.row.querySelector('.e-rowcell[aria-colindex="' + (row.cells[parseInt(i.toString(), 10)].index + 1) + '"]');
                if (cell) {
                    removeClass([cell], ['e-selectionbackground', 'e-active']);
                }
            }
        }
        if (isDrag) {
            removeClass([isDrag], ['e-selectionbackground', 'e-active']);
        }
    }
    private refreshMergeCells(row: Row<T>): Row<T> {
        for (const cell of row.cells) {
            cell.isSpanned = false;
        }
        return row;
    }
    /* eslint-disable */
    /**
     * Function to check and add alternative row css class.
     *
     * @param {Element} tr - specifies the tr element
     * @param {Row<T>} row - specifies the row
     * @returns {void}
     */
    /* eslint-enable */
    public buildAttributeFromRow(tr: Element, row: Row<T>): void {
        const attr: IRow<T> & { 'class'?: string[] } = {};
        const prop: { 'dataUID'?: string, 'ariaSelected'?: string }
            = { 'dataUID': 'data-uid', 'ariaSelected': 'aria-selected' };
        const classes: string[] = [];

        if (row.isDataRow) {
            classes.push(literals.row);
        }

        if (row.isAltRow) {
            classes.push('e-altrow');
        }

        if (row.isCaptionRow) {
            classes.push('e-groupcaptionrow');
        }

        if (row.isAggregateRow && row.parentUid) {
            classes.push('e-groupfooterrow');
        }

        if (!isNullOrUndefined(row.index)) {
            attr[literals.ariaRowIndex] = row.index + 1;
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
