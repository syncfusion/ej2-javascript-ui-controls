import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { setStyleAttribute, closest as getClosest, remove, BlazorDragEventArgs } from '@syncfusion/ej2-base';
import { classList } from '@syncfusion/ej2-base';
import { CellType, freezeTable } from '../base/enum';
import { IRenderer, IGrid, ICell } from '../base/interface';
import { RowRenderer } from './row-renderer';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { Row } from '../models/row';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { MouseEventArgs, Draggable, Droppable, DropEventArgs } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { ColumnWidthService } from '../services/width-controller';
import { parentsUntil, wrap, measureColumnDepth, appendChildren, addFixedColumnBorder, clearReactVueTemplates } from '../base/util';
import { AriaService } from '../services/aria-service';
import * as literals from '../base/string-literals';

// eslint-disable-next-line valid-jsdoc, jsdoc/require-param
/**
 * Content module is used to render grid content
 *
 * @hidden
 */
export class HeaderRender implements IRenderer {
    //Internal variables
    private headerTable: Element;
    private headerPanel: Element;
    private colgroup: Element;
    private caption: Element;
    protected colDepth: number;
    private column: Column;
    protected rows: Row<Column>[];
    private frzIdx: number = 0;
    private notfrzIdx: number = 0;
    private lockColsRendered: boolean;
    public draggable: Draggable;
    private droppable: Droppable;
    private isFirstCol: boolean = false;
    private isReplaceDragEle: boolean = true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private helper: Function = (e: { sender: MouseEvent }) => {
        const gObj: IGrid = this.parent;
        const target: Element = this.draggable.currentStateTarget;
        const parentEle: HTMLElement = parentsUntil(target, 'e-headercell') as HTMLElement;
        if (!(gObj.allowReordering || gObj.allowGrouping) || (!isNullOrUndefined(parentEle)
            && parentEle.getElementsByClassName('e-checkselectall').length > 0)) {
            return false;
        }
        const visualElement: HTMLElement = this.parent.createElement('div', { className: 'e-cloneproperties e-dragclone e-headerclone' });
        const element: HTMLElement = target.classList.contains('e-headercell') ? target as HTMLElement : parentEle;
        if (!element || (!gObj.allowReordering && element.classList.contains('e-stackedheadercell'))) {
            return false;
        }
        const height: number = element.offsetHeight;
        const headercelldiv: Element = element.querySelector('.e-headercelldiv') || element.querySelector('.e-stackedheadercelldiv');
        let col: Column;
        if (headercelldiv) {
            if (element.querySelector('.e-stackedheadercelldiv')) {
                col = gObj.getStackedHeaderColumnByHeaderText((headercelldiv as HTMLElement).innerText.trim(), <Column[]>gObj.columns);
            } else {
                col = gObj.getColumnByUid(headercelldiv.getAttribute('data-mappinguid'));
            }
            this.column = col;
            if (this.column.lockColumn) {
                return false;
            }
            visualElement.setAttribute('data-mappinguid', this.column.uid);
        }
        if (col && !isNullOrUndefined(col.headerTemplate)) {
            if (!isNullOrUndefined(col.headerTemplate)) {
                const colIndex: number = gObj.getColumnIndexByField(col.field);
                const result: Element[] = col.getHeaderTemplate()(
                    extend({ 'index': colIndex }, col), gObj, 'headerTemplate', null, null, null, null, gObj.root);
                const isReactCompiler: boolean = gObj.isReact && typeof (col.headerTemplate) !== 'string';
                const isReactChild: boolean = gObj.parentDetails && gObj.parentDetails.parentInstObj &&
                 gObj.parentDetails.parentInstObj.isReact;
                if (isReactCompiler || isReactChild) {
                    gObj.renderTemplates();
                }
                appendChildren(visualElement, result);
            } else {
                visualElement.innerHTML = col.headerTemplate as string;
            }
            if (!isNullOrUndefined(visualElement.firstChild) && visualElement.firstChild.nodeType === 1) {
                (visualElement.firstChild as HTMLElement).style.pointerEvents = 'none';
            }
        } else {
            visualElement.innerHTML = headercelldiv ?
                col.headerText : element.firstElementChild.innerHTML;
        }
        visualElement.style.width = element.offsetWidth + 'px';
        visualElement.style.height = element.offsetHeight + 'px';
        visualElement.style.lineHeight = (height - 6).toString() + 'px';
        gObj.element.appendChild(visualElement);
        return visualElement;
    }
    private dragStart: Function = (e: { target: HTMLElement, event: MouseEventArgs } & BlazorDragEventArgs) => {
        const gObj: IGrid = this.parent;
        (gObj.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        gObj.notify(events.columnDragStart, { target: this.draggable.currentStateTarget, column: this.column, event: e.event });
    }
    private drag: Function = (e: { target: HTMLElement, event: MouseEventArgs }): void => {
        const gObj: IGrid = this.parent;
        const target: Element = e.target;
        if (target) {
            const closest: Element = getClosest(target, '.e-grid');
            const cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
            if (!closest || closest.getAttribute('id') !== gObj.element.getAttribute('id')) {
                classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                if (gObj.allowReordering) {
                    (gObj.element.querySelector('.e-reorderuparrow') as HTMLElement).style.display = 'none';
                    (gObj.element.querySelector('.e-reorderdownarrow') as HTMLElement).style.display = 'none';
                }
                if (!gObj.groupSettings.allowReordering) {
                    return;
                }
            }
            gObj.notify(events.columnDrag, { target: e.target, column: this.column, event: e.event });
        }
    }
    private dragStop: Function = (e: { target: HTMLElement, event: MouseEventArgs, helper: Element }) => {
        const gObj: IGrid = this.parent;
        let cancel: boolean;
        (gObj.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        if ((!parentsUntil(e.target, 'e-headercell') && !parentsUntil(e.target, 'e-groupdroparea')) ||
            (!gObj.allowReordering && parentsUntil(e.target, 'e-headercell')) ||
            (!e.helper.getAttribute('data-mappinguid') && parentsUntil(e.target, 'e-groupdroparea'))) {
            remove(e.helper);
            cancel = true;
        }
        gObj.notify(events.columnDragStop, { target: e.target, event: e.event, column: this.column, cancel: cancel });
    }
    private drop: Function = (e: DropEventArgs) => {
        const gObj: IGrid = this.parent;
        const uid: string = e.droppedElement.getAttribute('data-mappinguid');
        const closest: Element = getClosest(e.target, '.e-grid');
        remove(e.droppedElement);
        if (closest && closest.getAttribute('id') !== gObj.element.getAttribute('id') ||
            !(gObj.allowReordering || gObj.allowGrouping)) {
            return;
        }
        gObj.notify(events.headerDrop, { target: e.target, uid: uid, droppedElement: e.droppedElement });

    }

    //Module declarations
    protected parent: IGrid;
    protected serviceLocator: ServiceLocator;
    protected widthService: ColumnWidthService;
    protected ariaService: AriaService;
    /**
     * Constructor for header renderer module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {ServiceLocator} serviceLocator - specifies the serviceLocator
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.ariaService = this.serviceLocator.getService<AriaService>('ariaService');
        this.widthService = this.serviceLocator.getService<ColumnWidthService>('widthService');
        if (this.parent.isDestroyed) { return; }
        if (!this.parent.enableColumnVirtualization) {
            this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        }
        this.parent.on(events.columnPositionChanged, this.colPosRefresh, this);
        this.parent.on(events.initialEnd, this.renderCustomToolbar, this);
        if (this.parent.rowRenderingMode === 'Vertical') {
            this.parent.on(events.uiUpdate, this.updateCustomResponsiveToolbar, this);
        }
    }

    /**
     * The function is used to render grid header div
     *
     * @returns {void}
     */
    public renderPanel(): void {
        let div: Element = this.parent.element.querySelector('.' + literals.gridHeader);
        const isRendered: boolean = (div != null);
        div = isRendered ? div : this.parent.createElement('div', { className: 'e-gridheader' });
        const innerDiv: Element = isRendered ? div.querySelector('.' + literals.headerContent) :
            this.parent.createElement('div', { className: literals.headerContent });
        this.toggleStackClass(div);
        div.appendChild(innerDiv);
        this.setPanel(div);
        if (!isRendered) {
            this.parent.element.appendChild(div);
        }
    }

    /**
     * The function is used to render grid header div
     *
     * @returns {void}
     */
    public renderTable(): void {
        const headerDiv: Element = this.getPanel();
        headerDiv.appendChild(this.createHeaderTable());
        this.setTable(headerDiv.querySelector('.' + literals.table));
        this.initializeHeaderDrag();
        this.initializeHeaderDrop();
        this.parent.notify(events.headerRefreshed, { rows: this.rows });
    }

    /**
     * Get the header content div element of grid
     *
     * @returns {Element} returns the element
     */
    public getPanel(): Element {
        return this.headerPanel;
    }

    /**
     * Set the header content div element of grid
     *
     * @param  {Element} panel - specifies the panel element
     * @returns {void}
     */
    public setPanel(panel: Element): void {
        this.headerPanel = panel;
    }

    /**
     * Get the header table element of grid
     *
     * @returns {Element} returns the element
     */
    public getTable(): Element {
        return this.headerTable;
    }

    /**
     * Set the header table element of grid
     *
     * @param  {Element} table - specifies the table element
     * @returns {void}
     */
    public setTable(table: Element): void {
        this.headerTable = table;
    }

    /**
     * Get the header colgroup element
     *
     * @returns {Element} returns the element
     */
    public getColGroup(): Element {
        return this.colgroup;
    }

    /**
     * Set the header colgroup element
     *
     * @param {Element} colGroup - specifies the colgroup
     * @returns {Element} returns the element
     */
    public setColGroup(colGroup: Element): Element {
        return this.colgroup = colGroup;
    }
    /**
     * Get the header row element collection.
     *
     * @returns {Element[]} returns the element
     */
    public getRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        const table: HTMLTableElement = <HTMLTableElement>this.getTable();
        return <HTMLCollectionOf<HTMLTableRowElement>>table.tHead.rows;
    }

    /**
     * The function is used to create header table elements
     *
     * @returns {Element} returns the element
     * @hidden
     */
    private createHeaderTable(): Element {
        const table: Element = this.createTable();
        const innerDiv: Element = <Element>this.getPanel().querySelector('.' + literals.headerContent);
        innerDiv.appendChild(table);
        return innerDiv;
    }

    /**
     * The function is used to create header table elements
     *
     * @param {Element} tableEle - specifies the table Element
     * @param {freezeTable} tableName - specifies the table name
     * @returns {Element} returns the element
     * @hidden
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public createHeader(tableEle: Element = null, tableName?: freezeTable): Element {
        const gObj: IGrid = this.parent;
        if (this.getTable()) {
            remove(this.getTable());
        }
        const table: Element = this.parent.createElement('table', { className: literals.table, attrs: { role: 'presentation' } });
        (table as HTMLElement).style.cssText = 'border-collapse: separate; border-spacing: .25px;';
        const findHeaderRow: { thead: Element, rows: Row<Column>[] } = this.createHeaderContent(tableName);
        const thead: Element = findHeaderRow.thead;
        const tbody: Element = this.parent.createElement( literals.tbody, { className: this.parent.frozenRows || this.parent.isRowPinned ||
            ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) && this.parent.editSettings.showAddNewRow) ? '' :
            'e-hide', attrs: { role: 'rowgroup' } });
        this.caption = this.parent.createElement('caption', { innerHTML: this.parent.element.id + '_header_table', className: 'e-hide' });
        const colGroup: Element = this.parent.createElement(literals.colGroup);
        const rowBody: Element = this.parent.createElement('tr', { attrs: { role: 'row' }, className: (this.parent.enableVirtualization ||
            this.parent.enableInfiniteScrolling) && this.parent.editSettings.showAddNewRow ? 'e-hide' : '' });
        let bodyCell: Element;
        const rows: Row<Column>[] = this.rows = findHeaderRow.rows;
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            for (let j: number = 0, len: number = rows[parseInt(i.toString(), 10)].cells.length; j < len; j++) {
                bodyCell = this.parent.createElement('td');
                rowBody.appendChild(bodyCell);
            }
        }
        if (gObj.allowFiltering || gObj.allowSorting || gObj.allowGrouping) {
            table.classList.add('e-sortfilter');
        }
        this.updateColGroup(colGroup);
        tbody.appendChild(rowBody);
        table.appendChild(this.caption);
        table.appendChild(this.setColGroup(colGroup));
        table.appendChild(thead);
        table.appendChild(tbody);
        return table;
    }

    /**
     * @param {Element} tableEle - specifies the column
     * @returns {Element} returns the element
     * @hidden
     */
    public createTable(tableEle: Element = null): Element {
        return this.createHeader(tableEle);
    }

    private createHeaderContent(tableName?: freezeTable): { thead: Element, rows: Row<Column>[] } {
        const gObj: IGrid = this.parent;
        const columns: Column[] = <Column[]>gObj.getColumns();
        const thead: Element = this.parent.createElement('thead', { attrs: { 'role': 'rowgroup' } });
        const colHeader: Element = this.parent.createElement('tr', { className: 'e-columnheader', attrs: { role: 'row' } });
        const rowRenderer: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, CellType.Header, gObj);
        rowRenderer.element = colHeader;
        let rows: Row<Column>[] = [];
        let headerRow: Element;
        this.colDepth = measureColumnDepth(gObj.columns as Column[]);
        for (let i: number = 0, len: number = this.colDepth; i < len; i++) {
            rows[parseInt(i.toString(), 10)] = this.generateRow(i);
            rows[parseInt(i.toString(), 10)].cells = [];
        }
        rows = this.ensureColumns(rows);
        rows = this.getHeaderCells(rows, tableName);
        if (gObj.isRowDragable() && this.parent.getFrozenMode() === 'Right') {
            for (let i: number = 0, len: number = rows.length; i < len; i++) {
                rows[parseInt(i.toString(), 10)].cells.push(this.generateCell({} as Column, CellType.RowDragHIcon));
            }
        }
        const headerTemplateColumn: Column[] = columns.filter((a: Column) => { return a.headerTemplate; });
        if (headerTemplateColumn.length && (this.parent.isReact || this.parent.isVue)) {
            clearReactVueTemplates(this.parent, ['headerTemplate']);
        }
        if (columns && columns.length && !columns[0].visible) {
            if (this.parent && this.parent.renderModule) {
                this.parent.renderModule.isFirstColumnHidden = true;
            }
        } else {
            if (this.parent && this.parent.renderModule) {
                this.parent.renderModule.isFirstColumnHidden = false;
            }
        }
        for (let i: number = 0, len: number = this.colDepth; i < len; i++) {
            headerRow = rowRenderer.render(rows[parseInt(i.toString(), 10)], columns);
            if (this.parent.rowHeight && headerRow.querySelector('.e-headercell')) {
                (headerRow as HTMLElement).style.height = this.parent.rowHeight + 'px';
            }
            addFixedColumnBorder(headerRow);
            thead.appendChild(headerRow);
        }
        const findHeaderRow: { thead: Element, rows: Row<Column>[] } = {
            thead: thead,
            rows: rows
        };
        return findHeaderRow;
    }

    private updateColGroup(colGroup: Element): Element {
        const cols: Column[] = this.parent.getColumns() as Column[];
        let col: Element; const indexes: number[] = this.parent.getColumnIndexesInView();
        colGroup.id = this.parent.element.id + literals.colGroup;
        if (this.parent.allowGrouping) {
            for (let i: number = 0, len: number = this.parent.groupSettings.columns.length; i < len; i++) {
                if (this.parent.enableColumnVirtualization && indexes.indexOf(i) === -1) { continue; }
                col = this.parent.createElement('col', { className: 'e-group-intent' });
                colGroup.appendChild(col);
            }
        }
        if (this.parent.detailTemplate || this.parent.childGrid) {
            col = this.parent.createElement('col', { className: 'e-detail-intent' });
            colGroup.appendChild(col);
        }
        if (this.parent.isRowDragable() && this.parent.getFrozenMode() !== 'Right') {
            col = this.parent.createElement('col', { className: 'e-drag-intent' });
            colGroup.appendChild(col);
        }
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            col = this.parent.createElement('col');
            if (cols[parseInt(i.toString(), 10)].visible === false) {
                setStyleAttribute(<HTMLElement>col, { 'display': 'none' });
            }
            colGroup.appendChild(col);

        }
        if (this.parent.isRowDragable() && this.parent.getFrozenMode() === 'Right') {
            col = this.parent.createElement('col', { className: 'e-drag-intent' });
            colGroup.appendChild(col);
        }
        return colGroup;
    }

    private ensureColumns(rows: Row<Column>[]): Row<Column>[] {
        //TODO: generate dummy column for group, detail, stacked row here; ensureColumns here
        const gObj: IGrid = this.parent; const indexes: number[] = this.parent.getColumnIndexesInView();
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            const rowSpan: number = i === 0 ? this.colDepth : 0;
            if (gObj.allowGrouping) {
                for (let c: number = 0, len: number = gObj.groupSettings.columns.length; c < len; c++) {
                    if (this.parent.enableColumnVirtualization && indexes.indexOf(c) === -1) { continue; }
                    const indentCell: Cell<Column> = this.generateCell({} as Column, CellType.HeaderIndent);
                    if (this.colDepth > 1) {
                        indentCell.rowSpan = rowSpan;
                    }
                    rows[parseInt(i.toString(), 10)].cells.push(indentCell);
                }
            }
            if (gObj.detailTemplate || gObj.childGrid) {
                const args: object = {};
                this.parent.notify(events.detailIndentCellInfo, args);
                const indentCell: Cell<Column> = this.generateCell(args as Column, CellType.DetailHeader);
                if (this.colDepth > 1) {
                    indentCell.rowSpan = rowSpan;
                }
                rows[parseInt(i.toString(), 10)].cells.push(indentCell);
            }
            if (gObj.isRowDragable() && this.parent.getFrozenMode() !== 'Right') {
                const indentCell: Cell<Column> = this.generateCell({} as Column, CellType.RowDragHIcon);
                if (this.colDepth > 1) {
                    indentCell.rowSpan = rowSpan;
                }
                rows[parseInt(i.toString(), 10)].cells.push(indentCell);
            }
        }
        return rows;
    }

    private getHeaderCells(rows: Row<Column>[], tableName?: freezeTable): Row<Column>[] {
        const thead: Element = this.parent.getHeaderTable() && this.parent.getHeaderTable().querySelector('thead');
        const cols: Column[] = this.parent.enableColumnVirtualization ?
            this.parent.getColumns(this.parent.enablePersistence) : this.parent.columns as Column[];
        this.frzIdx = 0;
        this.notfrzIdx = 0;
        if (this.parent.lockcolPositionCount) {
            for (let i: number = 0; i < (!isNullOrUndefined(cols) ? cols.length : 0); i++) {
                this.lockColsRendered = false;
                rows = this.appendCells(
                    cols[parseInt(i.toString(), 10)], rows, 0, i === 0, false, i === (cols.length - 1), thead, tableName, false);
            }
        }
        for (let i: number = 0, len: number = (!isNullOrUndefined(cols) ? cols.length : 0); i < len; i++) {
            this.notfrzIdx = 0;
            this.lockColsRendered = true;
            rows = this.appendCells(cols[parseInt(i.toString(), 10)], rows, 0, i === 0, false, i === (len - 1), thead, tableName, false);
        }
        return rows;
    }

    private appendCells(
        cols: Column, rows: Row<Column>[], index: number, isFirstObj: boolean,
        isFirstCol: boolean, isLastCol: boolean, isMovable: Element, tableName: freezeTable, isStackLastCol: boolean): Row<Column>[] {
        const lastCol: string = isLastCol ? isStackLastCol ? 'e-laststackcell' : 'e-lastcell' : '';
        const isLockColumn: boolean = !this.parent.lockcolPositionCount
            || (cols.lockColumn && !this.lockColsRendered) || (!cols.lockColumn && this.lockColsRendered);
        if (!cols.columns) {
            if (isLockColumn) {
                rows[parseInt(index.toString(), 10)].cells.push(this.generateCell(
                    cols, CellType.Header, this.colDepth - index,
                    (isFirstObj ? '' : (isFirstCol ? 'e-firstcell' : '')) + lastCol, index, this.parent.getColumnIndexByUid(cols.uid)));
            }
            if (this.parent.lockcolPositionCount) {
                if ((this.frzIdx + this.notfrzIdx < this.parent.frozenColumns) &&
                    ((cols.lockColumn && !this.lockColsRendered) || (!cols.lockColumn && this.lockColsRendered))) {
                    this.frzIdx++;
                } else {
                    this.notfrzIdx++;
                }
            } else {
                this.frzIdx++;
            }
        } else {
            this.isFirstCol = false;
            const colSpan: number = this.getCellCnt(cols, 0);
            if (colSpan) {
                const stackedLockColsCount: number = this.getStackedLockColsCount(cols, 0);
                const isStackedLockColumn: boolean = this.parent.lockcolPositionCount === 0
                || (!this.lockColsRendered && stackedLockColsCount !== 0)
                    || (this.lockColsRendered && (colSpan - stackedLockColsCount) !== 0);
                if (isStackedLockColumn) {
                    rows[parseInt(index.toString(), 10)].cells.push(new Cell<Column>(<{ [x: string]: Object }>{
                        cellType: CellType.StackedHeader, column: cols,
                        colSpan: this.getColSpan(colSpan, stackedLockColsCount),
                        className: isFirstObj ? '' : (isFirstCol ? 'e-firstcell' : '')
                    }));
                }
            }
            if (this.parent.lockcolPositionCount && !this.lockColsRendered) {
                for (let i: number = 0; i < cols.columns.length; i++) {
                    rows = this.appendCells(
                        (cols.columns as Column[])[parseInt(i.toString(), 10)], rows, index + 1, isFirstObj,
                        i === 0, i === (cols.columns.length - 1) && isLastCol, isMovable, tableName, false);
                }
            }
            if (this.lockColsRendered) {
                for (let i: number = 0, len: number = cols.columns.length; i < len; i++) {
                    isFirstObj = isFirstObj && i === 0;
                    const isFirstCol: boolean = this.isFirstCol = (cols.columns[parseInt(i.toString(), 10)] as Column).visible
                        && !isFirstObj;
                    const isLaststackedCol: boolean = i === (len - 1) && isLastCol;
                    rows = this.appendCells(
                        (cols.columns as Column[])[parseInt(i.toString(), 10)], rows, index + 1, isFirstObj,
                        isFirstCol && !isLaststackedCol, isLaststackedCol,
                        isMovable, tableName, true
                    );
                }
            }
        }
        return rows;
    }

    private getStackedLockColsCount(col: Column, lockColsCount: number): number {
        if (col.columns) {
            for (let i: number = 0; i < col.columns.length; i++) {
                lockColsCount = this.getStackedLockColsCount(col.columns[parseInt(i.toString(), 10)] as Column, lockColsCount);
            }
        } else if (col.lockColumn) {
            lockColsCount++;
        }
        return lockColsCount;
    }

    private getColSpan(colSpan: number, stackedLockColsCount: number): number {
        colSpan = !this.lockColsRendered ? stackedLockColsCount : colSpan - stackedLockColsCount;
        return colSpan;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private generateRow(index: number): Row<Column> {
        return new Row<Column>({});
    }

    private generateCell(
        column: Column, cellType?: CellType, rowSpan?: number, className?: string,
        rowIndex?: number, colIndex?: number): Cell<Column> {
        const opt: ICell<Column> = {
            'visible': column.visible,
            'isDataCell': false,
            'isTemplate': !isNullOrUndefined(column.headerTemplate),
            'rowID': '',
            'column': column,
            'cellType': cellType,
            'rowSpan': rowSpan,
            'className': className,
            'index': rowIndex,
            'colIndex': colIndex
        };

        if (!opt.rowSpan || opt.rowSpan < 2) {
            delete opt.rowSpan;
        }

        return new Cell<Column>(<{ [x: string]: Object }>opt);
    }

    /**
     * Function to hide header table column based on visible property
     *
     * @param {Column[]} columns - specifies the column
     * @returns {void}
     */
    public setVisible(columns?: Column[]): void {
        const gObj: IGrid = this.parent;
        let displayVal: string;
        let idx: number;
        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            const column: Column = columns[parseInt(c.toString(), 10)];
            idx = gObj.getNormalizedColumnIndex(column.uid);
            displayVal = column.visible ? '' : 'none';
            setStyleAttribute(<HTMLElement>this.getColGroup().children[parseInt(idx.toString(), 10)], { 'display': displayVal });
            if (gObj.editSettings.showAddNewRow && gObj.element.querySelector('.e-addedrow')) {
                setStyleAttribute(<HTMLElement>gObj.element.querySelector('.e-addedrow').querySelector('colgroup').childNodes[
                    parseInt(idx.toString(), 10)], { 'display': displayVal });
            }
        }
        this.refreshUI();
        if (this.parent.editSettings.showAddNewRow) {
            this.parent.isAddNewRow = true;
        }
    }


    private colPosRefresh(): void {
        this.refreshUI();
    }

    /**
     * Refresh the header of the Grid.
     *
     * @returns {void}
     */
    public refreshUI(): void {
        const headerDiv: Element = this.getPanel();
        this.toggleStackClass(headerDiv);
        const table: Element = this.getTable();
        const tableName: freezeTable = undefined;
        if (table) {
            this.droppableDestroy();
            if (this.parent.reorderModule) {
                this.parent.reorderModule.element = null;
                this.parent.reorderModule.destElement = null;
            }
            remove(table);
            if (this.parent.editSettings.showAddNewRow && !this.parent.isAddNewRow && table.querySelector('.e-addedrow') &&
                (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)) {
                (table.querySelector('.e-addedrow')).classList.add('e-addrow-removed');
                this.parent.isAddNewRow = true;
            }
            table.removeChild(table.childNodes[1]);
            table.removeChild(table.childNodes[1]);
            const colGroup: Element = this.parent.createElement(literals.colGroup);
            const findHeaderRow: { thead: Element, rows: Row<Column>[] } = this.createHeaderContent(tableName);
            this.rows = findHeaderRow.rows;
            table.insertBefore(findHeaderRow.thead, table.childNodes[1]);
            this.updateColGroup(colGroup);
            table.insertBefore(this.setColGroup(colGroup), table.childNodes[1]);
            this.appendContent(table);
            this.parent.notify(events.colGroupRefresh, {});
            this.widthService.setWidthToColumns();
            this.parent.updateDefaultCursor();
            this.initializeHeaderDrag();
            this.initializeHeaderDrop();
            const rows: Element[] = [].slice.call(headerDiv.querySelectorAll('tr.e-columnheader'));
            for (const row of rows) {
                const gCells: Element[] = [].slice.call(row.getElementsByClassName('e-grouptopleftcell'));
                if (gCells.length) {
                    gCells[gCells.length - 1].classList.add('e-lastgrouptopleftcell');
                }
            }
            this.parent.notify(events.headerRefreshed, { rows: this.rows });
            if (this.parent.enableColumnVirtualization && parentsUntil(table, literals.movableHeader)) {
                this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false, isXaxis: true } });
            }
            if (this.parent.allowTextWrap && this.parent.textWrapSettings.wrapMode === 'Header') {
                wrap(rows, true);
            }
        }
        const firstHeaderCell: HTMLElement = this.parent.getHeaderContent().querySelector('.e-headercell:not(.e-hide)');
        if (!isNullOrUndefined(firstHeaderCell)) {
            firstHeaderCell.tabIndex = 0;
        }
    }

    public toggleStackClass(div: Element): void {
        const column: Column[] = this.parent.columns as Column[];
        const stackedHdr: boolean = (!isNullOrUndefined(column) ? column.some((column: Column) => !isNullOrUndefined(column.columns))
            : false);
        if (stackedHdr) {
            div.classList.add('e-stackedheader');
        } else {
            div.classList.remove('e-stackedheader');
        }
    }


    public appendContent(table?: Element): void {
        this.getPanel().querySelector('.' + literals.headerContent).appendChild(table);
    }

    private getCellCnt(col: Column, cnt: number): number {
        if (col.columns) {
            for (let i: number = 0, len: number = col.columns.length; i < len; i++) {
                cnt = this.getCellCnt(col.columns[parseInt(i.toString(), 10)] as Column, cnt);
            }
        } else {
            if (col.visible) {
                cnt++;
            }
        }
        return cnt;
    }

    protected initializeHeaderDrag(): void {
        const gObj: IGrid = this.parent;
        if (!(this.parent.allowReordering || (this.parent.allowGrouping && this.parent.groupSettings.showDropArea))) {
            return;
        }
        this.draggable = new Draggable(gObj.getHeaderContent() as HTMLElement, {
            dragTarget: '.e-headercell',
            distance: 5,
            helper: this.helper,
            dragStart: this.dragStart,
            drag: this.drag,
            dragStop: this.dragStop,
            abort: '.e-rhandler',
            isReplaceDragEle: this.isReplaceDragEle
        });
        this.parent.on(events.destroy, this.droppableDestroy, this);
    }

    protected initializeHeaderDrop(): void {
        const gObj: IGrid = this.parent;
        this.droppable = new Droppable(gObj.getHeaderContent() as HTMLElement, {
            accept: '.e-dragclone',
            drop: this.drop as (e: DropEventArgs) => void
        });
        this.parent.on(events.destroy, this.droppableDestroy, this);
    }

    private droppableDestroy(): void {
        if (this.droppable && !this.droppable.isDestroyed) {
            this.droppable.destroy();
        }
        if (this.draggable && !this.draggable.isDestroyed) {
            this.draggable.destroy();
        }
    }

    private renderCustomToolbar(): void {
        const gObj: IGrid = this.parent;
        if (gObj.rowRenderingMode === 'Vertical' && !gObj.toolbar
            && (gObj.allowSorting || (gObj.allowFiltering && gObj.filterSettings.type !== 'FilterBar'))) {
            const div: HTMLElement = gObj.createElement('div', { className: 'e-res-toolbar e-toolbar' });
            const toolbarItems: HTMLElement = gObj.createElement('div', { className: 'e-toolbar-items' });
            const toolbarLeft: HTMLElement = gObj.createElement('div', { className: 'e-toolbar-left' });
            const count: number = this.parent.allowFiltering && this.parent.allowSorting ? 2 : 1;
            for (let i: number = 0; i < count; i++) {
                const toolbarItem: HTMLElement = gObj.createElement(
                    'div',
                    { className: 'e-toolbar-item e-gridresponsiveicons e-icons e-tbtn-align' }
                );
                const cls: string = count === 1 ? this.parent.allowSorting ? 'sort'
                    : 'filter' : i === 1 ? 'sort' : 'filter';
                const button: HTMLElement = gObj.createElement('button', { className: 'e-tbar-btn e-control e-btn e-lib e-icon-btn' });
                const span: HTMLElement = gObj.createElement('span', { className: 'e-btn-icon e-res' + cls + '-icon e-icons' });
                button.appendChild(span);
                const btnObj: Button = new Button({
                    cssClass: this.parent.cssClass ? this.parent.cssClass : ''
                });
                btnObj.appendTo(button);
                button.onclick = (e: MouseEvent) => {
                    if ((e.target as HTMLElement).classList.contains('e-ressort-btn')
                        || (e.target as HTMLElement).classList.contains('e-ressort-icon') ||
                        (e.target as HTMLElement).querySelector('.e-ressort-icon')) {
                        this.parent.showResponsiveCustomSort();
                    } else {
                        this.parent.showResponsiveCustomFilter();
                    }
                };
                toolbarItem.appendChild(button);
                toolbarLeft.appendChild(toolbarItem);
            }
            toolbarItems.appendChild(toolbarLeft);
            div.appendChild(toolbarItems);
            gObj.element.insertBefore(div, this.parent.element.querySelector('.' + literals.gridHeader));
        } else {
            if (gObj.enableAdaptiveUI && !gObj.toolbar) {
                gObj.getContent().classList.add('e-responsive-header');
            }
        }
    }

    private updateCustomResponsiveToolbar(args: { module: string }): void {
        const resToolbar: HTMLElement = this.parent.element.querySelector('.e-responsive-toolbar');
        if (args.module === 'toolbar') {
            if (resToolbar) {
                remove(resToolbar);
            } else {
                this.renderCustomToolbar();
            }
        }
    }
}
