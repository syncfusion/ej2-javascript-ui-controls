import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { setStyleAttribute, closest as getClosest, remove, BlazorDragEventArgs, isBlazor } from '@syncfusion/ej2-base';
import { classList } from '@syncfusion/ej2-base';
import { CellType, freezeTable, freezeMode } from '../base/enum';
import { IRenderer, IGrid, ICell } from '../base/interface';
import { RowRenderer } from './row-renderer';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { Row } from '../models/row';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { MouseEventArgs, Draggable, Droppable, DropEventArgs } from '@syncfusion/ej2-base';
import { ColumnWidthService } from '../services/width-controller';
import { parentsUntil, wrap, measureColumnDepth, appendChildren, getFrozenTableName } from '../base/util';
import { AriaService } from '../services/aria-service';

/**
 * Content module is used to render grid content
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
    public freezeReorder: boolean;
    public draggable: Draggable;
    private isFirstCol: boolean = false;
    private isReplaceDragEle: boolean = true;
    private helper: Function = (e: { sender: MouseEvent }) => {
        let gObj: IGrid = this.parent;
        let target: Element = this.draggable.currentStateTarget;
        let parentEle: HTMLElement = parentsUntil(target, 'e-headercell') as HTMLElement;
        if (!(gObj.allowReordering || gObj.allowGrouping) || (!isNullOrUndefined(parentEle)
            && parentEle.querySelectorAll('.e-checkselectall').length > 0)) {
            return false;
        }
        let visualElement: HTMLElement = this.parent.createElement('div', { className: 'e-cloneproperties e-dragclone e-headerclone' });
        let element: HTMLElement = target.classList.contains('e-headercell') ? target as HTMLElement : parentEle;
        if (!element || (!gObj.allowReordering && element.classList.contains('e-stackedheadercell'))) {
            return false;
        }
        let height: number = element.offsetHeight;
        let headercelldiv: Element = element.querySelector('.e-headercelldiv') || element.querySelector('.e-stackedheadercelldiv');
        let col: Column;
        if (headercelldiv) {
            if (element.querySelector('.e-stackedheadercelldiv')) {
                col = gObj.getStackedHeaderColumnByHeaderText((headercelldiv as HTMLElement).innerText.trim(), <Column[]>gObj.columns);
            } else {
                col = gObj.getColumnByUid(headercelldiv.getAttribute('e-mappinguid'));
            }
            this.column = col;
            if (this.column.lockColumn) {
                return false;
            }
            visualElement.setAttribute('e-mappinguid', this.column.uid);
        }
        if (col && !isNullOrUndefined(col.headerTemplate)) {
            if (!isNullOrUndefined(col.headerTemplate)) {
                let result: Element[];
                let colIndex: number = gObj.getColumnIndexByField(col.field);
                result = col.getHeaderTemplate()(extend({ 'index': colIndex }, col), gObj, 'headerTemplate');
                appendChildren(visualElement, result);
            } else {
                visualElement.innerHTML = col.headerTemplate;
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
        let gObj: IGrid = this.parent;
        (gObj.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        gObj.notify(events.columnDragStart, { target: this.draggable.currentStateTarget, column: this.column, event: e.event });
        if (isBlazor()) {
            e.bindEvents(e.dragElement);
        }
    }
    private drag: Function = (e: { target: HTMLElement, event: MouseEventArgs }): void => {
        let gObj: IGrid = this.parent;
        let target: Element = e.target;
        if (target) {
            let closest: Element = getClosest(target, '.e-grid');
            let cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
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
        let gObj: IGrid = this.parent;
        let cancel: boolean;
        (gObj.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        if ((!parentsUntil(e.target, 'e-headercell') && !parentsUntil(e.target, 'e-groupdroparea')) ||
            (!gObj.allowReordering && parentsUntil(e.target, 'e-headercell')) ||
            (!e.helper.getAttribute('e-mappinguid') && parentsUntil(e.target, 'e-groupdroparea'))) {
            remove(e.helper);
            cancel = true;
        }
        gObj.notify(events.columnDragStop, { target: e.target, event: e.event, column: this.column, cancel: cancel });
    }
    private drop: Function = (e: DropEventArgs) => {
        let gObj: IGrid = this.parent;
        let uid: string = e.droppedElement.getAttribute('e-mappinguid');
        let closest: Element = getClosest(e.target, '.e-grid');
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
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.ariaService = this.serviceLocator.getService<AriaService>('ariaService');
        this.widthService = this.serviceLocator.getService<ColumnWidthService>('widthService');
        if (this.parent.isDestroyed) { return; }
        if (!this.parent.enableColumnVirtualization
            && !this.parent.getFrozenLeftColumnsCount() && !this.parent.getFrozenRightColumnsCount()) {
            this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        }
        this.parent.on(events.columnPositionChanged, this.colPosRefresh, this);
    }

    /**
     * The function is used to render grid header div    
     */
    public renderPanel(): void {
        let div: Element = this.parent.element.querySelector('.e-gridheader');
        let isRendered: boolean = (div != null);
        div = isRendered ? div : this.parent.createElement('div', { className: 'e-gridheader' });
        let innerDiv: Element = isRendered ? div.querySelector('.e-headercontent') :
        this.parent.createElement('div', { className: 'e-headercontent' });
        this.toggleStackClass(div);
        div.appendChild(innerDiv);
        this.setPanel(div);
        if (!isRendered) {
            this.parent.element.appendChild(div);
        }
    }

    /**
     * The function is used to render grid header table    
     */
    public renderTable(): void {
        let headerDiv: Element = this.getPanel();
        headerDiv.appendChild(this.createHeaderTable());
        this.setTable(headerDiv.querySelector('.e-table'));
        if (!this.parent.getFrozenColumns() && !this.parent.getFrozenRightColumnsCount() && !this.parent.getFrozenLeftColumnsCount()) {
            this.initializeHeaderDrag();
            this.initializeHeaderDrop();
        }
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: this.parent.isFrozenGrid() } });
    }

    /**
     * Get the header content div element of grid 
     * @return {Element} 
     */
    public getPanel(): Element {
        return this.headerPanel;
    }

    /**
     * Set the header content div element of grid
     * @param  {Element} panel    
     */
    public setPanel(panel: Element): void {
        this.headerPanel = panel;
    }

    /**
     * Get the header table element of grid
     * @return {Element} 
     */
    public getTable(): Element {
        return this.headerTable;
    }

    /**
     * Set the header table element of grid
     * @param  {Element} table  
     */
    public setTable(table: Element): void {
        this.headerTable = table;
    }

    /**
     * Get the header colgroup element
     * @returns {Element}
     */
    public getColGroup(): Element {
        return this.colgroup;
    }

    /**
     * Set the header colgroup element
     * @param {Element} colgroup
     * @returns {Element}
     */
    public setColGroup(colGroup: Element): Element {
        return this.colgroup = colGroup;
    }
    /**
     * Get the header row element collection.
     * @return {Element[]}
     */
    public getRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        let table: HTMLTableElement = <HTMLTableElement>this.getTable();
        return <HTMLCollectionOf<HTMLTableRowElement>>table.tHead.rows;
    }

    /**
     * The function is used to create header table elements
     * @return {Element} 
     * @hidden
     */
    private createHeaderTable(): Element {
        let skipDom: boolean = isBlazor() && this.parent.frozenRows !== 0;
        let table: Element = this.createTable();
        let innerDiv: Element = <Element>this.getPanel().querySelector('.e-headercontent');
        if (!skipDom) {
            innerDiv.appendChild(table);
        }
        return innerDiv;
    }

    /**
     * @hidden
     */
    public createTable(tableEle: Element = null): Element {
        let skipDom: boolean = isBlazor() && this.parent.frozenRows !== 0;
        let gObj: IGrid = this.parent;
        let isFrozen: boolean = gObj.isFrozenGrid();
        if (!(isBlazor() && !gObj.isJsComponent) && this.getTable() && !isFrozen) {
            remove(this.getTable());
        }
        let columns: Column[] = <Column[]>gObj.getColumns();
        let innerDiv: Element = <Element>this.getPanel().querySelector('.e-headercontent');
        let table: Element = skipDom ? tableEle || innerDiv.querySelector('.e-table') :
        this.parent.createElement('table', { className: 'e-table', attrs: { cellspacing: '0.25px', role: 'grid' } });
        let findHeaderRow: { thead: Element, rows: Row<Column>[] } = this.createHeaderContent();
        let thead: Element = findHeaderRow.thead;
        let tbody: Element = this.parent.createElement('tbody', { className: this.parent.frozenRows ? '' : 'e-hide' });
        this.caption = this.parent.createElement('caption', { innerHTML: this.parent.element.id + '_header_table', className: 'e-hide' });
        let colGroup: Element = this.parent.createElement('colgroup');
        let rowBody: Element = this.parent.createElement('tr');
        let bodyCell: Element;
        let rows: Row<Column>[] = this.rows = findHeaderRow.rows;
        let rowRenderer: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, CellType.Header, this.parent);
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            for (let j: number = 0, len: number = rows[i].cells.length; j < len; j++) {
                let cell: Cell<Column> = rows[i].cells[j];
                bodyCell = this.parent.createElement('td');
                rowBody.appendChild(bodyCell);
            }
        }
        if (gObj.allowFiltering || gObj.allowSorting || gObj.allowGrouping) {
            table.classList.add('e-sortfilter');
        }
        this.updateColGroup(colGroup);
        if (!skipDom) {
            tbody.appendChild(rowBody);
        }
        table.appendChild(this.setColGroup(colGroup));
        table.appendChild(thead);
        if (!skipDom) {
            table.appendChild(tbody);
        }
        table.appendChild(this.caption);
        this.ariaService.setOptions(table as HTMLElement, { colcount: gObj.getColumns().length.toString() });
        return table;
    }
    private createHeaderContent(): { thead: Element, rows: Row<Column>[] } {
        let gObj: IGrid = this.parent;
        let frozenMode: freezeMode = gObj.getFrozenMode();
        let columns: Column[] = <Column[]>gObj.getColumns();
        let thead: Element = this.parent.createElement('thead');
        let colHeader: Element = this.parent.createElement('tr', { className: 'e-columnheader' });
        let rowRenderer: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, CellType.Header, gObj);
        rowRenderer.element = colHeader;
        let rows: Row<Column>[] = [];
        let headerRow: Element;
        this.colDepth = measureColumnDepth(gObj.columns as Column[]);
        for (let i: number = 0, len: number = this.colDepth; i < len; i++) {
            rows[i] = this.generateRow(i);
            rows[i].cells = [];
        }
        if (frozenMode !== 'Right') {
            rows = this.ensureColumns(rows);
        }
        rows = this.getHeaderCells(rows);
        if (frozenMode === 'Right') {
            rows = this.ensureColumns(rows);
        }
        let frzCols: number = this.parent.getFrozenColumns();
        if (this.parent.isRowDragable() && this.parent.isFrozenGrid() && rows[0].cells[1]) {
            let colFreezeMode: freezeTable = rows[0].cells[1].column.getFreezeTableName();
            if (colFreezeMode === 'movable' || (frozenMode === 'Left-Right' && colFreezeMode === 'frozen-right')) {
                if (frozenMode === 'Right') {
                    rows[0].cells.pop();
                } else {
                    rows[0].cells.shift();
                }
            } else if (!frzCols && colFreezeMode === 'frozen-left') {
                rows[0].cells[0].column.freeze = colFreezeMode === 'frozen-left' ? 'Left' : 'Right';
            } else if (frozenMode === 'Right' && colFreezeMode === 'frozen-right') {
                rows[0].cells[rows[0].cells.length - 1].column.freeze = 'Right';
            }
        }
        for (let i: number = 0, len: number = this.colDepth; i < len; i++) {
            headerRow = rowRenderer.render(rows[i], columns);
            if (this.parent.rowHeight && headerRow.querySelector('.e-headercell')) {
                (headerRow as HTMLElement).style.height = this.parent.rowHeight + 'px';
            }
            thead.appendChild(headerRow);
        }
        let findHeaderRow: { thead: Element, rows: Row<Column>[] } = {
            thead: thead,
            rows: rows
        };
        return findHeaderRow;
    }

    private updateColGroup(colGroup: Element): Element {
        let cols: Column[] = this.parent.getColumns() as Column[];
        let col: Element; let indexes: number[] = this.parent.getColumnIndexesInView();
        if (this.parent.enableColumnVirtualization && this.parent.getFrozenColumns()
            && (<{ isXaxis?: Function }>this.parent.contentModule).isXaxis()) {
            cols = extend([], this.parent.getColumns()) as Column[];
            cols.splice(0, this.parent.getFrozenColumns());
        }
        colGroup.id = this.parent.element.id + 'colGroup';
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
            if (cols[i].visible === false) {
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
        let gObj: IGrid = this.parent; let indexes: number[] = this.parent.getColumnIndexesInView();
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            if (gObj.allowGrouping) {
                for (let c: number = 0, len: number = gObj.groupSettings.columns.length; c < len; c++) {
                    if (this.parent.enableColumnVirtualization && indexes.indexOf(c) === -1) { continue; }
                    rows[i].cells.push(this.generateCell({} as Column, CellType.HeaderIndent));
                }
            }
            if (gObj.detailTemplate || gObj.childGrid) {
                let args: object = {};
                this.parent.notify(events.detailIndentCellInfo, args);
                rows[i].cells.push(this.generateCell(args as Column, CellType.DetailHeader));
            }
            if (gObj.isRowDragable()) {
                rows[i].cells.push(this.generateCell({} as Column, CellType.RowDragHIcon));
            }

        }
        return rows;
    }

    private getHeaderCells(rows: Row<Column>[]): Row<Column>[] {
        let column: Column[];
        let thead: Element = this.parent.getHeaderTable() && this.parent.getHeaderTable().querySelector('thead');
        let cols: Column[] = this.parent.enableColumnVirtualization ?
            this.parent.getColumns(this.parent.enablePersistence) : this.parent.columns as Column[];
        let tableName: freezeTable;
        if (this.parent.enableColumnVirtualization && this.parent.isFrozenGrid()
            && (<{ isXaxis?: Function }>this.parent.contentModule).isXaxis()) {
                tableName = 'movable';
        } else {
            tableName = getFrozenTableName(this.parent);
        }
        this.frzIdx = 0;
        this.notfrzIdx = 0;
        if (this.parent.lockcolPositionCount) {
            for (let i: number = 0; i < cols.length; i++) {
                this.lockColsRendered = false;
                rows = this.appendCells(cols[i], rows, 0, i === 0, false, i === (cols.length - 1), thead, tableName);
            }
        }
        for (let i: number = 0, len: number = cols.length; i < len; i++) {
            this.notfrzIdx = 0;
            this.lockColsRendered = true;
            rows = this.appendCells(cols[i], rows, 0, i === 0, false, i === (len - 1), thead, tableName);
        }
        return rows;
    }

    private appendCells(
        cols: Column, rows: Row<Column>[], index: number, isFirstObj: boolean,
        isFirstCol: boolean, isLastCol: boolean, isMovable: Element, tableName: freezeTable): Row<Column>[] {
        let lastCol: string = isLastCol ? 'e-lastcell' : '';
        let isFrozen: boolean = this.parent.isFrozenGrid();
        let isLockColumn: boolean = !this.parent.lockcolPositionCount
            || (cols.lockColumn && !this.lockColsRendered) || (!cols.lockColumn && this.lockColsRendered);
        let isFrozenLockColumn: boolean = !this.parent.lockcolPositionCount || (cols.lockColumn && !this.lockColsRendered)
            || (!cols.lockColumn && this.lockColsRendered);
        let scrollbar: HTMLElement = this.parent.getContent().querySelector('.e-movablescrollbar');
        let left: number;
        if (isFrozen && scrollbar && this.parent.enableColumnVirtualization) {
            left = scrollbar.scrollLeft;
        }
        if (!cols.columns) {
            if (left && left > 0 && (<{ isXaxis?: Function }>this.parent.contentModule).isXaxis()
                && (<{ inViewIndexes?: number[] }>this.parent).inViewIndexes[0] !== 0 && cols.getFreezeTableName() === 'movable') {
                rows[index].cells.push(this.generateCell(
                    cols, CellType.Header, this.colDepth - index,
                    (isFirstObj ? '' : (isFirstCol ? 'e-firstcell' : '')) + lastCol, index, this.parent.getColumnIndexByUid(cols.uid)));
            } else {
                if ((!isFrozen && isLockColumn) || (isFrozen && cols.getFreezeTableName() === tableName && isFrozenLockColumn)) {
                    rows[index].cells.push(this.generateCell(
                        cols, CellType.Header, this.colDepth - index,
                        (isFirstObj ? '' : (isFirstCol ? 'e-firstcell' : '')) + lastCol, index, this.parent.getColumnIndexByUid(cols.uid)));
                }
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
            let colSpan: number = this.getCellCnt(cols, 0);
            if (colSpan) {
                let stackedLockColsCount: number = this.getStackedLockColsCount(cols, 0);
                let isStackedLockColumn: boolean = this.parent.lockcolPositionCount === 0
                    || (!this.lockColsRendered && stackedLockColsCount !== 0)
                    || (this.lockColsRendered && (colSpan - stackedLockColsCount) !== 0);
                let isFrozenStack: boolean = isFrozen && this.ensureStackedFrozen(cols.columns as Column[], tableName, false);
                if ((!isFrozen && isStackedLockColumn) || isFrozenStack) {
                    rows[index].cells.push(new Cell<Column>(<{ [x: string]: Object }>{
                        cellType: CellType.StackedHeader, column: cols,
                        colSpan: this.getColSpan(colSpan, stackedLockColsCount, cols.columns as Column[], tableName, isFrozen)
                    }));
                }
            }
            if (this.parent.lockcolPositionCount && !this.lockColsRendered) {
                for (let i: number = 0; i < cols.columns.length; i++) {
                    rows = this.appendCells(
                        (cols.columns as Column[])[i], rows, index + 1, isFirstObj,
                        i === 0, i === (cols.columns.length - 1) && isLastCol, isMovable, tableName);
                }
            }
            if (this.lockColsRendered) {
                for (let i: number = 0, len: number = cols.columns.length; i < len; i++) {
                    let isFirstCol: boolean = this.isFirstCol = (cols.columns[i] as Column).visible && !this.isFirstCol && len !== 1 ;
                    let isLaststackedCol: boolean = i === (len - 1);
                    rows = this.appendCells(
                        (cols.columns as Column[])[i], rows, index + 1, isFirstObj, isFirstCol, isLaststackedCol && isLastCol,
                        isMovable, tableName
                    );
                }
            }
        }
        return rows;
    }

    private ensureStackedFrozen(columns: Column[], tableName: freezeTable, isTrue: boolean): boolean {
        let length: number = columns.length;
        for (let i: number = 0; i < length; i++) {
            if (columns[i].columns) {
                isTrue = this.ensureStackedFrozen(columns[i].columns as Column[], tableName, isTrue);
            } else if (columns[i].getFreezeTableName() === tableName) {
                isTrue = true;
                break;
            }
        }
        return isTrue;
    }

    private getStackedLockColsCount(col: Column, lockColsCount: number): number {
        if (col.columns) {
            for (let i: number = 0; i < col.columns.length; i++) {
                lockColsCount = this.getStackedLockColsCount(col.columns[i] as Column, lockColsCount);
            }
        } else if (col.lockColumn) {
            lockColsCount++;
        }
        return lockColsCount;
    }

    private getColSpan(colSpan: number, stackedLockColsCount: number, columns: Column[], tableName: string, isFrozen: boolean): number {
        if (isFrozen) {
            colSpan = this.getFrozenColSpan(columns, tableName, 0);
        } else if (this.parent.lockcolPositionCount) {
            colSpan = !this.lockColsRendered ? stackedLockColsCount : colSpan - stackedLockColsCount;
        }
        return colSpan;
    }

    private getFrozenColSpan(columns: Column[], tableName: string, count: number): number {
        let length: number = columns.length;
        for (let i: number = 0; i < length; i++) {
            if (columns[i].columns) {
                count = this.getFrozenColSpan(columns[i].columns as Column[], tableName, count);
            } else if (columns[i].getFreezeTableName() === tableName) {
                count++;
            }
        }
        return count;
    }

    private generateRow(index: number): Row<Column> {
        return new Row<Column>({});
    }

    private generateCell(
        column: Column, cellType?: CellType, rowSpan?: number, className?: string,
        rowIndex?: number, colIndex?: number): Cell<Column> {
        let opt: ICell<Column> = {
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
     * @param  {Column[]} columns?
     */
    public setVisible(columns?: Column[]): void {
        let gObj: IGrid = this.parent;
        let rows: HTMLTableRowElement[] = [].slice.call(this.getRows()); //NodeList -> Array        
        let displayVal: string;
        let idx: number;
        let className: Function;
        let element: HTMLTableRowElement;
        let frzCols: number = gObj.getFrozenColumns();

        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            let column: Column = columns[c];

            idx = gObj.getNormalizedColumnIndex(column.uid);

            displayVal = column.visible ? '' : 'none';
            if (frzCols) {
                let normalizedfrzCols: number = this.parent.isRowDragable() ? frzCols + 1 : frzCols;
                if (idx < normalizedfrzCols) {
                    if (isBlazor() && gObj.isServerRendered) {
                        setStyleAttribute(<HTMLElement>this.getTable().querySelector('colgroup').children[idx], { 'display': displayVal });
                        setStyleAttribute(this.getTable().querySelectorAll('th')[idx], { 'display': displayVal });
                    } else {
                        setStyleAttribute(<HTMLElement>this.getColGroup().children[idx], { 'display': displayVal });
                    }
                } else {
                    let mTblColGrp: Element = gObj.getHeaderContent().querySelector('.e-movableheader').querySelector('colgroup');
                    let mTbl: Element = gObj.getHeaderContent().querySelector('.e-movableheader').querySelector('table');
                    setStyleAttribute(<HTMLElement>mTblColGrp.children[idx - normalizedfrzCols], { 'display': displayVal });
                    if (isBlazor() && gObj.isServerRendered) {
                        setStyleAttribute(mTbl.querySelectorAll('th')[idx - frzCols], { 'display': displayVal });
                    }
                }
            } else {
                setStyleAttribute(<HTMLElement>this.getColGroup().children[idx], { 'display': displayVal });
            }
        }
        this.refreshUI();
    }


    private colPosRefresh(): void {
        if (isBlazor() && this.parent.isServerRendered && this.parent.frozenRows && this.parent.getFrozenColumns()) {
            this.freezeReorder = true;
        }
        this.refreshUI();
    }

    /** 
     * Refresh the header of the Grid. 
     * @returns {void} 
     */
    public refreshUI(): void {
        let frzCols: boolean = this.parent.isFrozenGrid();
        let isVFTable: boolean = this.parent.enableColumnVirtualization && frzCols;
        let setFrozenTable: boolean = isBlazor() && this.parent.isServerRendered && this.parent.frozenRows !== 0 && frzCols;
        let headerDiv: Element = this.getPanel();
        this.toggleStackClass(headerDiv);
        let table: Element = this.freezeReorder ? this.headerPanel.querySelector('.e-movableheader').querySelector('.e-table')
            : this.getTable();
        if (isVFTable) {
            table = (<{ getVirtualFreezeHeader?: Function }>this.parent.contentModule).getVirtualFreezeHeader();
        }
        if (setFrozenTable && !isVFTable) {
            table = this.freezeReorder ? this.headerPanel.querySelector('.e-movableheader').querySelector('.e-table') :
                this.headerPanel.querySelector('.e-frozenheader').querySelector('.e-table');
        }
        if (table) {
            if (isBlazor() && this.parent.isServerRendered) {
                table.removeChild(table.querySelector('colgroup'));
                table.removeChild(table.querySelector('thead'));
            } else {
                remove(table);
                table.removeChild(table.firstChild);
                table.removeChild(table.childNodes[0]);
            }
            let colGroup: Element = this.parent.createElement('colgroup');
            let findHeaderRow: { thead: Element, rows: Row<Column>[] } = this.createHeaderContent();
            this.rows = findHeaderRow.rows;
            table.insertBefore(findHeaderRow.thead, table.firstChild);
            this.updateColGroup(colGroup);
            table.insertBefore(this.setColGroup(colGroup), table.firstChild);
            if (!isVFTable && !setFrozenTable) {
                this.setTable(table);
            }
            if (!(isBlazor() && this.parent.isServerRendered)) {
                this.appendContent(table);
            }
            this.parent.notify(events.colGroupRefresh, {});
            this.widthService.setWidthToColumns();
            this.parent.updateDefaultCursor();
            if (!frzCols || (this.parent.enableColumnVirtualization && frzCols)) {
                this.initializeHeaderDrag();
            }
            let rows: Element[] = [].slice.call(headerDiv.querySelectorAll('tr.e-columnheader'));
            for (let row of rows) {
                let gCells: Element[] = [].slice.call(row.querySelectorAll('.e-grouptopleftcell'));
                if (gCells.length) {
                    gCells[gCells.length - 1].classList.add('e-lastgrouptopleftcell');
                }
            }
            if (!frzCols) {
                this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: frzCols } });
            }
            if (this.parent.enableColumnVirtualization && parentsUntil(table, 'e-movableheader')) {
                this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false, isXaxis: true } });
            }
            if (this.parent.allowTextWrap && this.parent.textWrapSettings.wrapMode === 'Header') {
                wrap(rows, true);
            }
        }
    }

    public toggleStackClass(div: Element): void {
        let column: Column[] = this.parent.columns as Column[];
        let stackedHdr: boolean = column.some((column: Column) => !isNullOrUndefined(column.columns));
        if (stackedHdr) {
            div.classList.add('e-stackedheader');
        } else {
            div.classList.remove('e-stackedheader');
        }
    }


    public appendContent(table?: Element): void {
        this.getPanel().querySelector('.e-headercontent').appendChild(table);
    }

    private getCellCnt(col: Column, cnt: number): number {
        if (col.columns) {
            for (let i: number = 0, len: number = col.columns.length; i < len; i++) {
                cnt = this.getCellCnt(col.columns[i] as Column, cnt);
            }
        } else {
            if (col.visible) {
                cnt++;
            }
        }
        return cnt;
    }

    protected initializeHeaderDrag(): void {
        let gObj: IGrid = this.parent;
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
    }

    protected initializeHeaderDrop(): void {
        let gObj: IGrid = this.parent;
        let drop: Droppable = new Droppable(gObj.getHeaderContent() as HTMLElement, {
            accept: '.e-dragclone',
            drop: this.drop as (e: DropEventArgs) => void
        });
    }
}