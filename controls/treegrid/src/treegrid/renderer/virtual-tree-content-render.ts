import { Cell, CellType, Column, ICell, NotifyArgs, Row, SentinelType } from '@syncfusion/ej2-grids';
import { Offsets, VirtualInfo, ServiceLocator, IGrid, IModelGenerator } from '@syncfusion/ej2-grids';
import { VirtualContentRenderer } from '@syncfusion/ej2-grids';
import { RowPosition } from '../enum';
import * as literals from '../base/constant';
import { InterSectionObserver, RowSelectEventArgs  } from '@syncfusion/ej2-grids';
import { TreeVirtualRowModelGenerator } from '../renderer/virtual-row-model-generator';
import * as events from '../base/constant';
import { isNullOrUndefined, EventHandler, getValue, setValue, Browser, KeyboardEventArgs, debounce } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { isCountRequired } from '../utils';

export class VirtualTreeContentRenderer extends VirtualContentRenderer {
    public getModelGenerator(): IModelGenerator<Column> {
        return new TreeVirtualRowModelGenerator(this.parent);
    }
    constructor(parent: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.addEventListener();
    }

    private isExpandCollapse: boolean = false;
    private observers: TreeInterSectionObserver;
    private translateY: number = 0;
    private maxiPage: number = 0;
    private rowPosition: RowPosition;
    private addRowIndex: number;
    private dataRowIndex: number;
    private recordAdded: boolean = false;
    /** @hidden */
    public startIndex: number = -1;
    private endIndex: number = -1;
    private totalRecords: number;
    private contents: HTMLElement;
    private fn: Function;
    private preTranslate: number = 0;
    private isRemoteExpand: boolean = false;
    private previousInfo: VirtualInfo;
    /** @hidden */
    public isDataSourceChanged: boolean = false;
    public getRowByIndex(index: number) : Element {
        if (this.parent.enableVirtualization && this.parent.isFrozenGrid()){
            return this.getRowCollection(index, true) as Element;
        }
        else{
            return this.parent.getDataRows().filter((e: HTMLElement) => parseInt(e.getAttribute('data-rowindex'), 10) === index)[0];
        }
    }

    public getFrozenRightVirtualRowByIndex(index: number): Element {
        return this.getRowCollection(index, false, false, true) as Element;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getRowCollection(index: number, isMovable: boolean, isRowObject?: boolean, isFrozenRight?: boolean): Element | Object {
        const startIdx: number = parseInt(this.parent.getRows()[0].getAttribute(literals.dataRowIndex), 10);
        const rowCollection: Element[] = this.parent.getDataRows();
        const collection: Element[] | Object[] = isRowObject ? this.parent.getCurrentViewRecords() : rowCollection;
        let selectedRow: Element | Object = collection[index - startIdx];
        if (this.parent.frozenRows && this.parent.pageSettings.currentPage > 1) {
            if (!isRowObject) {
                selectedRow = index <= this.parent.frozenRows ? rowCollection[parseInt(index.toString(), 10)]
                    : rowCollection[(index - startIdx) + this.parent.frozenRows];
            } else {
                selectedRow = index <= this.parent.frozenRows ?
                    this.parent.getRowsObject()[parseInt(index.toString(), 10)].data : selectedRow;
            }
        }
        return selectedRow;
    }

    public addEventListener(): void {
        this.parent.on(events.virtualActionArgs, this.virtualOtherAction, this);
        this.parent.on(events.indexModifier, this.indexModifier, this);
    }
    private virtualOtherAction(args: {setTop: boolean, isExpandCollapse: boolean}): void {
        if (args.setTop) {
            this.translateY = 0;
            this.startIndex = 0;
            this.endIndex = this.parent.pageSettings.pageSize - 1;
        } else if (args.isExpandCollapse) {
            this.isExpandCollapse = true;
        }
    }
    private indexModifier(args: {startIndex: number, endIndex: number, count: number, requestType: string}) : void {
        const content: HTMLElement = this.parent.getContent().querySelector('.e-content');
        if ((this.recordAdded || args.requestType === 'delete' && this.endIndex > args.count - this.parent.pageSettings.pageSize) && this.startIndex > -1 && this.endIndex > -1) {
            if (this.endIndex > args.count - this.parent.pageSettings.pageSize) {
                const nextSetResIndex: number = ~~(content.scrollTop / this.parent.getRowHeight());
                let lastIndex: number = nextSetResIndex + this.parent.getRows().length;
                if (lastIndex > args.count) {
                    lastIndex = nextSetResIndex +
            (args.count - nextSetResIndex);
                }
                this.startIndex = lastIndex - this.parent.getRows().length;
                this.endIndex = lastIndex;
            }
            else if (this.parent.root.editSettings.newRowPosition !== 'Top' && this.parent.root.editModule.selectedIndex !== -1 || this.parent.root.editModule.selectedIndex !== -1) {
                this.startIndex += 1;
                this.endIndex += 1;
            }
            this.recordAdded = false;
        }
        if (this.isDataSourceChanged) {
            this.startIndex = 0;
            this.endIndex = this.parent.pageSettings.pageSize - 1;
        }
        if ((this.endIndex - this.startIndex !== this.parent.pageSettings.pageSize) &&
            (this.totalRecords > this.parent.pageSettings.pageSize)
            && (this.endIndex === this.totalRecords)){
            args.startIndex = this.endIndex - this.parent.pageSettings.pageSize;
            args.endIndex = this.endIndex;
        }
        else{
            args.startIndex = this.startIndex;
            args.endIndex = this.endIndex;
        }
    }
    public eventListener(action: string): void {
        if (!(this.parent.dataSource instanceof DataManager && (this.parent.dataSource as DataManager).dataSource.url !== undefined
        && (this.parent.dataSource as DataManager).dataSource.offline && (this.parent.dataSource as DataManager).dataSource.url !== '') || !isCountRequired(this.parent)) {
            this.parent[`${action}`]('data-ready', this.onDataReady, this);
            this.parent[`${action}`]('refresh-virtual-block', this.refreshContentRows, this);
            this.fn = () => {
                this.observers.observes((scrollArgs: ScrollArg) => this.scrollListeners(scrollArgs), this.onEnteredAction(), this.parent);
                this.parent.off('content-ready', this.fn);
            };
            this.parent.addEventListener('dataBound', this.dataBoundEvent.bind(this));
            this.parent.addEventListener('rowSelected', this.rowSelectedEvent.bind(this));
            this.parent[`${action}`]('select-virtual-Row', this.toSelectVirtualRow, this);
            this.parent.on('content-ready', this.fn, this);
            this.parent.addEventListener(events.actionComplete, this.onActionComplete.bind(this));
            this.parent[`${action}`]('virtual-scroll-edit-action-begin', this.beginEdit, this);
            this.parent[`${action}`]('virtual-scroll-add-action-begin', this.beginAdd, this);
            this.parent[`${action}`]('virtual-scroll-edit-success', this.virtualEditSuccess, this);
            this.parent[`${action}`]('edit-reset', this.resetIseditValue, this);
            this.parent[`${action}`]('get-virtual-data', this.getData, this);
            this.parent[`${action}`]('virtual-scroll-edit-cancel', this.cancelEdit, this);
            this.parent[`${action}`]('select-row-on-context-open', this.toSelectRowOnContextOpen, this);
            this.parent[`${action}`]('refresh-virtual-editform-cells', this.refreshCell, this);
            this.parent[`${action}`]('virtaul-cell-focus', this.cellFocus, this);
        } else {
            super.eventListener('on');
        }
    }

    private cellFocus(e: KeyboardEventArgs): void {
        const virtualCellFocus: string = 'virtualCellFocus';
        super[`${virtualCellFocus}`](e);
    }

    protected onDataReady (e?: NotifyArgs) : void {
        super.onDataReady(e);
        if (!(this.parent.dataSource instanceof DataManager && (this.parent.dataSource as DataManager).dataSource.url !== undefined
        && (this.parent.dataSource as DataManager).dataSource.offline && (this.parent.dataSource as DataManager).dataSource.url !== '') || !isCountRequired(this.parent)) {
            if (!isNullOrUndefined(e.count)) {
                this.totalRecords = e.count;
                // To overcome the white space issue in last page when records collapsed
                if (this.parent.isFrozenGrid() && e.count < Object.keys(this.parent.dataSource).length) {
                    const width: string = this.parent.enableColumnVirtualization ?
                        this.getColumnOffset(this.parent.columns.length - 1) + 'px' : '100%';
                    const height: number = (this.parent.getRowHeight() * e.count) -
                        (this.parent.getRowHeight() * this.parent.pageSettings.pageSize);
                    getValue('virtualEle', this).setVirtualHeight(height, width);
                }
                if (!this.parent.enableColumnVirtualization && !this.parent.isFrozenGrid()) {
                    getValue('virtualEle', this).setVirtualHeight(this.parent.getRowHeight() * e.count, '100%');
                }
            }
            if ((!isNullOrUndefined(e.requestType) && e.requestType.toString() === 'collapseAll') || (this.isDataSourceChanged && (this.startIndex === -1 || this.startIndex === 0 && this['preStartIndex'] === 0) )) {
                this.contents.scrollTop = 0;
                this.isDataSourceChanged = false;
            }
        }
    }
    public renderTable() : void {
        super.renderTable();
        if (!(this.parent.dataSource instanceof DataManager && (this.parent.dataSource as DataManager).dataSource.url !== undefined
        && (this.parent.dataSource as DataManager).dataSource.offline && (this.parent.dataSource as DataManager).dataSource.url !== '') || !isCountRequired(this.parent)) {
            getValue('observer', this).options.debounceEvent = false;
            this.observers = new TreeInterSectionObserver(getValue('observer', this).element,
                                                          getValue('observer', this).options);
            this.contents = this.getPanel().firstChild as HTMLElement;
        }
    }
    protected getTranslateY(sTop: number, cHeight: number, info?: VirtualInfo, isOnenter?: boolean): number {
        if ((this.parent.dataSource instanceof DataManager && (this.parent.dataSource as DataManager).dataSource.url !== undefined
        && !(this.parent.dataSource as DataManager).dataSource.offline && (this.parent.dataSource as DataManager).dataSource.url !== '') || isCountRequired(this.parent)) {
            if (this.isRemoteExpand) {
                this.isRemoteExpand = false;
                return this.preTranslate;
            } else {
                this.preTranslate = super.getTranslateY(sTop, cHeight, info, isOnenter);
                return super.getTranslateY(sTop, cHeight, info, isOnenter);
            }
        } else {
            return super.getTranslateY(sTop, cHeight, info, isOnenter);
        }
    }

    private dataBoundEvent(): void {
        const dataBoundEve: string = 'dataBound'; const initialRowTop: string = 'initialRowTop';
        if (this.parent.getRows().length && !isNullOrUndefined(this.parent.getRowByIndex(0)) && !this[`${initialRowTop}`]) {
            const rowTop: number = this.parent.getRowByIndex(0).getBoundingClientRect().top;
            const gridTop: number = this.parent.element.getBoundingClientRect().top;
            if (rowTop > 0){
                this[`${initialRowTop}`] = this.parent.getRowByIndex(0).getBoundingClientRect().top - gridTop;
            } else {
                this[`${initialRowTop}`] = this.content.getBoundingClientRect().top -
                this.parent.getRowByIndex(0).getBoundingClientRect().height;
            }
        }
        super[`${dataBoundEve}`]();
    }

    private rowSelectedEvent(args: RowSelectEventArgs): void {
        const rowSelected: string = 'rowSelected';
        super[`${rowSelected}`](args);
        this.parent.notify('virtualTransform', { requestType: 'transformChange'});
    }

    private toSelectVirtualRow(args: { selectedIndex: number }): void {
        if (this.parent.isEdit) { return; }
        const selectVirtualRow: string = 'selectVirtualRow';
        const containerRect: string = 'containerRect';
        if (isNullOrUndefined(this.observer[`${containerRect}`])) {
            this.observer[`${containerRect}`] = this.observers[`${containerRect}`];
        }
        if (isNullOrUndefined (this.parent.clipboardModule['treeGridParent'].editModule) || args.selectedIndex !== 0 ||
        isNullOrUndefined(this.parent.clipboardModule['treeGridParent'].editModule['addRowIndex'])) {
            super[`${selectVirtualRow}`](args);
        }
    }

    private refreshCell(rowObj: Row<Column>): void {
        rowObj.cells = this.generateCells();
    }

    public generateCells(): Cell<Column>[] {
        const cells: Cell<Column>[] = [];
        for (let i: number = 0; i < this.parent.columns.length; i++) {
            cells.push(this.generateCell(this.parent.columns[parseInt(i.toString(), 10)] as Column));
        }
        return cells;
    }

    public generateCell(
        col: Column, rowId?: string, cellType?: CellType, colSpan?: number,
        oIndex?: number, foreignKeyData?: Object): Cell<Column> {
        const opt: ICell<Column> = {
            'visible': col.visible,
            'isDataCell': !isNullOrUndefined(col.field || col.template),
            'isTemplate': !isNullOrUndefined(col.template),
            'rowID': rowId,
            'column': col,
            'cellType': !isNullOrUndefined(cellType) ? cellType : CellType.Data,
            'colSpan': colSpan,
            'commands': col.commands,
            'isForeignKey': col.isForeignColumn && col.isForeignColumn(),
            'foreignKeyData': col.isForeignColumn && col.isForeignColumn() && getValue(col.field, foreignKeyData)
        };

        if (opt.isDataCell || opt.column.type === 'checkbox' || opt.commands) {
            opt.index = oIndex;
        }

        return new Cell<Column>(<{ [x: string]: Object }>opt);
    }

    private beginEdit(e: { data: Object, index: number }): void {
        this['editedRowIndex'] = e.index;
        const selector: string = '.e-row[data-rowindex="' + e.index + '"]';
        const index: number = (this.parent.getContent().querySelector(selector) as HTMLTableRowElement).rowIndex;
        const rowData: Object = this.parent.getCurrentViewRecords()[parseInt(index.toString(), 10)];
        e.data = rowData;
    }

    private beginAdd(args: { startEdit: boolean }): void {
        const addAction: string = 'addActionBegin'; const isAdd: string = 'isAdd';
        const addArgs: { newRowPosition: RowPosition, addRowIndex: number, dataRowIndex: number }
      = { newRowPosition: this.rowPosition, addRowIndex: this.addRowIndex, dataRowIndex: this.dataRowIndex };
        this.parent.notify('get-row-position', addArgs);
        this.rowPosition = addArgs.newRowPosition;
        this.addRowIndex = addArgs.addRowIndex;
        this.dataRowIndex = addArgs.dataRowIndex;
        const rows: HTMLTableRowElement[] = <HTMLTableRowElement[]>this.parent.getRows();
        const firstAriaIndex: number = rows.length ? +rows[0].getAttribute('data-rowindex') : 0;
        const lastAriaIndex: number = rows.length ? +rows[rows.length - 1].getAttribute('data-rowindex') : 0;
        const withInRange: boolean = this.parent.selectedRowIndex >= firstAriaIndex && this.parent.selectedRowIndex <= lastAriaIndex;
        if (!(this.rowPosition === 'Top' || this.rowPosition === 'Bottom')) {
            this[`${isAdd}`] = true;
        }
        if (this.rowPosition === 'Top' || this.rowPosition === 'Bottom' ||
          ((!this.addRowIndex || this.addRowIndex === -1) && (this.parent.selectedRowIndex === -1 || !withInRange))) {
            super[`${addAction}`](args);
        }
    }

    private restoreEditState(): void {
        const restoreEdit: string = 'restoreEdit';
        super[`${restoreEdit}`]();
    }

    private resetIseditValue(): void {
        const resetIsEdit: string = 'resetIsedit'; const isAdd: string = 'isAdd';
        this.parent.notify('reset-edit-props', {});
        if ((this.rowPosition === 'Top' || this.rowPosition === 'Bottom') && this[`${isAdd}`]) {
            super[`${resetIsEdit}`]();
        }
    }

    private virtualEditSuccess(): void {
        const isAdd: string = 'isAdd';
        const content: HTMLElement = this.parent.getContent().querySelector('.e-content');
        if (this[`${isAdd}`] && content.querySelector('.e-addedrow')) {
            this.recordAdded = true;
        }
    }

    private cancelEdit(args: { data: Object }): void {
        const editCancel: string = 'editCancel';
        super[`${editCancel}`](args);
    }

    private toSelectRowOnContextOpen(args: { isOpen: boolean }): void {
        const selectRowOnContextOpen: string = 'selectRowOnContextOpen';
        super[`${selectRowOnContextOpen}`](args);
    }

    private restoreNewRow(): void {
        const isAdd: string = 'isAdd';
        const content: HTMLElement = this.parent.getContent().querySelector('.e-content');
        if (this[`${isAdd}`] && !content.querySelector('.e-addedrow')) {
            this.parent.isEdit = false;
            this.parent.editModule.addRecord(null, this.parent.root.editModule.selectedIndex);
        }
    }

    private getData(data: { virtualData: Object, isAdd: boolean, isCancel: boolean }): void {
        const getVirtualData: string = 'getVirtualData';
        super[`${getVirtualData}`](data);
    }

    private onActionComplete(args: NotifyArgs): void {
        if (args.requestType === 'add') {
            const addArgs: { newRowPosition: RowPosition, addRowIndex: number, dataRowIndex: number }
        = { newRowPosition: this.rowPosition, addRowIndex: this.addRowIndex, dataRowIndex: this.dataRowIndex };
            this.parent.notify('get-row-position', addArgs);
            this.rowPosition = addArgs.newRowPosition;
            this.addRowIndex = addArgs.addRowIndex;
            this.dataRowIndex = this.parent.root.editModule.selectedIndex;
        }
        const actionComplete: string = 'actionComplete';
        super[`${actionComplete}`](args);
    }

    private onEnteredAction(): Function {
        return (element: HTMLElement, current: SentinelType, direction: string, e: Offsets, isWheel: boolean, check: boolean) => {
            const directVirtualRender: string = 'directVirtualRender';
            if (!this.parent[`${directVirtualRender}`]) { // with this property, columns are rendered without debouncing on horizontal scroll.
                const preventEvent: string = 'preventEvent';
                if (Browser.isIE && !isWheel && check && !this[`${preventEvent}`] && !this.parent.enableVirtualMaskRow) {
                    this.parent.showSpinner();
                }
                if (this.parent.enableVirtualMaskRow && !this[`${preventEvent}`]) {
                    setTimeout(() => {
                        this.parent.showMaskRow(current.axis);
                        this.parent.notify('showGanttShimmer', { requestType: 'showShimmer'});
                    }, 0);
                }
                const height: number = this.content.getBoundingClientRect().height;
                const top: number = this.prevInfo.offsets ? this.prevInfo.offsets.top : null;
                const xAxis: boolean = current.axis === 'X';
                let x: number = this.getColumnOffset(xAxis ? this.vgenerator.getColumnIndexes()[0] - 1 : this.prevInfo.columnIndexes[0]
                                - 1);
                if (xAxis) {
                    const idx: number = Object.keys(this.vgenerator.cOffsets).length - this.prevInfo.columnIndexes.length;
                    const maxLeft: number = this.vgenerator.cOffsets[idx - 1];
                    x = x > maxLeft ? maxLeft : x; //TODO: This fix horizontal scrollbar jumping issue in column virtualization.
                }
                let y: number = this.getTranslateY(e.top, height, xAxis && top === e.top ? this.prevInfo : undefined, true);
                if (!this.parent.isFrozenGrid() || this.parent.enableVirtualMaskRow) {
                    if (this.parent.enableVirtualMaskRow) {
                        const upScroll: boolean = (e.top - this.translateY) < 0;
                        y = (Math.round(this.translateY) > y && !upScroll) ? Math.round(this.translateY) : y;
                        this.virtualEle.adjustTable(x, y);
                    } else {
                        this.virtualEle.adjustTable(x, this.translateY);
                    }
                    if (this.parent.enableColumnVirtualization) {
                        this.header.virtualEle.adjustTable(x, 0);
                    }
                }
            }
        };
    }

    public scrollListeners(scrollArgs: ScrollArg) : void {
        this['scrollAfterEdit']();
        const info: SentinelType = scrollArgs.sentinel;
        const rowHeight: number = this.parent.getRowHeight();
        const outBuffer: number = this.parent.pageSettings.pageSize - Math.ceil(this.parent.pageSettings.pageSize / 2);
        const content: HTMLElement = this.parent.getContent().querySelector('.e-content');
        const scrollHeight: number = outBuffer * rowHeight;
        const upScroll: boolean = (scrollArgs.offset.top - this.translateY) <= 0;
        const downScroll: boolean = Math.ceil(scrollArgs.offset.top - this.translateY) + rowHeight >= scrollHeight;
        const selectedRowIndex: string = 'selectedRowIndex';
        const currentViewData: Object[] = this.parent.currentViewData; const indexValue: string = 'index';
        if (upScroll && (scrollArgs.direction !== 'right' && scrollArgs.direction !== 'left')) {
            const vHeight: number = +(this.parent.height.toString().indexOf('%') < 0 ? parseInt(this.parent.height.toString(), 10) :
                this.parent.element.getBoundingClientRect().height);
            let index: number = (~~(content.scrollTop / rowHeight)
          + Math.ceil(vHeight / rowHeight))
            - this.parent.pageSettings.pageSize;
            index = (index > 0) ? index : 0;
            if (!isNullOrUndefined(this[`${selectedRowIndex}`]) && this[`${selectedRowIndex}`] !== -1 && index !== this[`${selectedRowIndex}`] &&
                ((this.parent.rowHeight * this.parent.pageSettings.pageSize) < content.scrollTop)) {
                index = this[`${selectedRowIndex}`];
            }
            this.startIndex = index;
            this.endIndex = index + this.parent.pageSettings.pageSize;
            if (this.endIndex > this.totalRecords) {
                const lastInx: number = this.totalRecords - 1;
                const remains: number = this.endIndex % lastInx;
                this.endIndex = lastInx;
                this.startIndex = (this.startIndex - remains) < 0 ? 0 : (this.startIndex - remains);
            }
            if (currentViewData.length && (currentViewData[0][`${indexValue}`] >= this.parent.pageSettings.pageSize / 2) &&
                ((currentViewData[0][`${indexValue}`] - this.startIndex) < (this.parent.pageSettings.pageSize / 2)) && this.parent.selectionModule.isRowSelected) {
                this.startIndex = currentViewData[0][`${indexValue}`] - (this.parent.pageSettings.pageSize / 2);
                this.endIndex = this.startIndex + this.parent.pageSettings.pageSize;
            }
            //var firsttdinx = parseInt(this.parent.getContent().querySelector('.e-content td').getAttribute('index'), 0);
            let rowPt: number = Math.ceil(scrollArgs.offset.top / rowHeight);
            rowPt = rowPt % this.parent.pageSettings.pageSize;
            let firsttdinx: number = 0;
            if (!isNullOrUndefined(this.parent.getRows()[parseInt(rowPt.toString(), 10)]) &&
             !isNullOrUndefined(this.parent.getContent().querySelectorAll('.e-content tr')[parseInt(rowPt.toString(), 10)])) {
                const attr: string = this.parent.getContent().querySelectorAll('.e-content tr')[parseInt(rowPt.toString(), 10)]
                    .querySelector('td').getAttribute('index');
                firsttdinx = +attr; // this.parent.getContent().querySelector('.e-content tr').getAttribute('data-rowindex');
            }
            if (firsttdinx === 0) {
                this.translateY = (scrollArgs.offset.top - (outBuffer * rowHeight) > 0) ?
                    scrollArgs.offset.top - (outBuffer * this.parent.getRowHeight()) + rowHeight : 0;
            }
            else if (this.parent.getFrozenColumns() > 0) {
                scrollArgs.offset.top = scrollArgs.offset.top + 80;
                this.translateY = (scrollArgs.offset.top - (outBuffer * rowHeight) > 0) ?
                    scrollArgs.offset.top - (outBuffer * rowHeight) + 10 : 0;
            }
            else {
                this.translateY = (scrollArgs.offset.top - (outBuffer * rowHeight) > 0) ?
                    scrollArgs.offset.top - (outBuffer * rowHeight) + 10 : 0;
            }
        } else if (downScroll && (scrollArgs.direction !== 'right' && scrollArgs.direction !== 'left')) {
            let nextSetResIndex: number = ~~(content.scrollTop / rowHeight);
            const isLastBlock: boolean = (this[`${selectedRowIndex}`] + this.parent.pageSettings.pageSize) < this.totalRecords ? false : true;
            if (!isNullOrUndefined(this[`${selectedRowIndex}`]) && this[`${selectedRowIndex}`] !== -1 &&
             nextSetResIndex !== this[`${selectedRowIndex}`] && !isLastBlock) {
                nextSetResIndex = this[`${selectedRowIndex}`];
            }
            let lastIndex: number = nextSetResIndex + this.parent.pageSettings.pageSize;
            if (lastIndex > this.totalRecords) {
                lastIndex = nextSetResIndex +
          (this.totalRecords - nextSetResIndex);
            }
            this.startIndex =  !isLastBlock || isNullOrUndefined(this['' + selectedRowIndex]) ? lastIndex - this.parent.pageSettings.pageSize : nextSetResIndex;
            this.endIndex = lastIndex;
            if ((nextSetResIndex + this.parent.pageSettings.pageSize) > this.totalRecords && (this.endIndex - this.startIndex) <
            (this.parent.pageSettings.pageSize / 2) && (this.endIndex - nextSetResIndex) < (this.parent.pageSettings.pageSize / 2)) {
                this.startIndex = lastIndex - (this.parent.pageSettings.pageSize / 2);
            }
            if (currentViewData.length && this.startIndex > currentViewData[0][`${indexValue}`] &&
                ((this.startIndex - currentViewData[0][`${indexValue}`]) < (this.parent.pageSettings.pageSize / 2)) && this.parent.selectionModule.isRowSelected) {
                this.startIndex = currentViewData[0][`${indexValue}`] + (this.parent.pageSettings.pageSize / 2);
            }
            if (scrollArgs.offset.top > (rowHeight * this.totalRecords)) {
                this.translateY = this.getTranslateY(scrollArgs.offset.top, content.getBoundingClientRect().height);
            } else {
                if (this.totalRecords === this.endIndex)
                {
                    this.translateY = (this.totalRecords * rowHeight) - ((this.endIndex - this.startIndex) * rowHeight);
                }
                else
                {
                    if (this.parent.allowRowDragAndDrop) {
                        this.translateY = scrollArgs.offset.top -  rowHeight * 2;
                    }
                    else if (this.parent.getFrozenColumns() > 0) {
                        this.translateY = scrollArgs.offset.top - ((rowHeight * 2) + this.parent.pageSettings.pageSize);
                    }
                    else {
                        this.translateY = scrollArgs.offset.top;
                    }
                }
            }
        }
        if (((downScroll && (scrollArgs.offset.top < (rowHeight * this.totalRecords)))
            || (upScroll)) || (scrollArgs.direction === 'right' || scrollArgs.direction === 'left') ||
            ((this.parent.dataSource instanceof DataManager && (this.parent.dataSource as DataManager).dataSource.url !== undefined
        && !(this.parent.dataSource as DataManager).dataSource.offline && (this.parent.dataSource as DataManager).dataSource.url !== '') && (downScroll || upScroll) || isCountRequired(this.parent))
        ) {
            const viewInfo: VirtualInfo = this.currentInfo = getValue('getInfoFromView', this).apply(this, [scrollArgs.direction, info, scrollArgs.offset]);
            this.previousInfo = viewInfo;
            this.parent.setColumnIndexesInView(this.parent.enableColumnVirtualization ? viewInfo.columnIndexes : []);
            const page: number = viewInfo.loadNext && !viewInfo.loadSelf ? viewInfo.nextInfo.page : viewInfo.page;
            this.parent.setProperties({ pageSettings: { currentPage: page } }, true);
            if (downScroll && this.endIndex === this.totalRecords && viewInfo.loadNext) {
                viewInfo.loadNext = false;
            }
            this.requestType = 'virtualscroll';
            if (scrollArgs.direction !== 'right' && scrollArgs.direction !== 'left') {
                viewInfo.event = viewInfo.event === 'refresh-virtual-block' ? 'model-changed' : viewInfo.event;
            }
            if (this.parent.enableVirtualMaskRow) {
                this.parent.showMaskRow(info.axis);
                this.parent.addShimmerEffect();
                this.parent.notify('showGanttShimmer', { requestType: 'showShimmer'});
            }
            this.parent.notify(viewInfo.event, { requestType: 'virtualscroll', virtualInfo: viewInfo, focusElement: scrollArgs.focusElement });
        } else {
            if (this.parent.enableVirtualMaskRow) {
                this.parent.removeMaskRow();
                this.parent.notify('removeGanttShimmer', { requestType: 'hideShimmer'});
            }
        }
    }
    public appendContent(target: HTMLElement, newChild: DocumentFragment, e: NotifyArgs) : void {
        if ((this.parent.dataSource instanceof DataManager && (this.parent.dataSource as DataManager).dataSource.url !== undefined
        && !(this.parent.dataSource as DataManager).dataSource.offline && (this.parent.dataSource as DataManager).dataSource.url !== '') || isCountRequired(this.parent) || this.parent.isFrozenGrid()) {
            if (getValue('isExpandCollapse', e)) {
                this.isRemoteExpand = true;
            }
            super.appendContent(target, newChild, e);
            if (getValue('requestTypes', this).indexOf('isFrozen') !== -1){
                getValue('requestTypes', this).splice(getValue('requestTypes', this).indexOf('isFrozen'), 1);
                this.requestType = this.requestType === 'isFrozen' ? undefined : this.requestType;
            }
        } else {
            const info: VirtualInfo = e.virtualInfo.sentinelInfo && e.virtualInfo.sentinelInfo.axis === 'Y' &&
          getValue('currentInfo', this).page && getValue('currentInfo', this).page !== e.virtualInfo.page ?
                getValue('currentInfo', this) : e.virtualInfo;
            const cBlock: number = (info.columnIndexes[0]) - 1;
            const cOffset: number = this.getColumnOffset(cBlock); let width: string;
            if (this.parent.enableColumnVirtualization) {
                this.header.virtualEle.adjustTable(cOffset, 0);
                const cIndex: number[] = info.columnIndexes;
                width = this.getColumnOffset(cIndex[cIndex.length - 1]) - this.getColumnOffset(cIndex[0] - 1) + '';
                this.header.virtualEle.setWrapperWidth(width);
            }
            this.virtualEle.setWrapperWidth(width, ( Browser.isIE || Browser.info.name === 'edge') as boolean);
            target = this.parent.createElement('tbody');
            target.appendChild(newChild);
            const replace: string = 'replaceWith';
            (this.getTable().querySelector('tbody') as HTMLElement)[`${replace}`](target);
            if (!this.isExpandCollapse || this.translateY === 0) {
                this.translateY = this.translateY < 0 ? 0 : this.translateY;
                getValue('virtualEle', this).adjustTable(cOffset, this.translateY);
            } else {
                this.isExpandCollapse = false;
            }
            setValue('prevInfo', this.previousInfo ? this.previousInfo : info, this);
            if (e.requestType === 'virtualscroll' && e.virtualInfo.sentinelInfo.axis === 'X') {
                this.parent.notify(events.autoCol, {});
            }
            const focusCell: string = 'focusCell'; const restoreAdd: string = 'restoreAdd';
            const ensureSelectedRowPosition: string = 'ensureSelectedRowPosition';
            super[`${focusCell}`](e);
            const isAdd: string = 'isAdd';
            if (this[`${isAdd}`] && !this.parent.getContent().querySelector('.e-content').querySelector('.e-addedrow')) {
                if (!(this.rowPosition === 'Top' || this.rowPosition === 'Bottom')) {
                    if (this.dataRowIndex >= this.startIndex) {
                        this.restoreNewRow();
                    } else if (this.addRowIndex && this.addRowIndex > -1) {
                        this[`${isAdd}`] = false;
                        this.parent.isEdit = false;
                    }
                }
            }
            this.restoreEditState();
            super[`${restoreAdd}`]();
            super[`${ensureSelectedRowPosition}`]();
        }
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off('data-ready', this.onDataReady);
        this.parent.off('content-ready', this.fn);
        this.parent.off('select-virtual-Row', this.toSelectVirtualRow);
        this.parent.off('dataBound', this.dataBoundEvent);
        this.parent.off('rowSelected', this.rowSelectedEvent);
        this.parent.off(events.virtualActionArgs, this.virtualOtherAction);
        this.parent.off(events.indexModifier, this.indexModifier);
        this.parent.off('virtual-scroll-edit-action-begin', this.beginEdit);
        this.parent.off('virtual-scroll-add-action-begin', this.beginAdd);
        this.parent.off('virtual-scroll-edit-success', this.virtualEditSuccess);
        this.parent.off('edit-reset', this.resetIseditValue);
        this.parent.off('get-virtual-data', this.getData);
        this.parent.off('virtual-scroll-edit-cancel', this.cancelEdit);
        this.parent.off('select-row-on-context-open', this.toSelectRowOnContextOpen);
        this.parent.off('refresh-virtual-editform-cells', this.refreshCell);
        this.parent.off('virtaul-cell-focus', this.cellFocus);
    }

}

export class TreeInterSectionObserver extends InterSectionObserver {
    private isWheeling: boolean = false;
    private newPos: number = 0;
    private lastPos: number = 0;
    private timer: number = 0;
    public observes(callback: Function, onEnterCallback: Function, instance: IGrid): void {
        const containerRect: string = 'containerRect';
        super[`${containerRect}`] = getValue('options', this).container.getBoundingClientRect();
        EventHandler.add(getValue('options', this).container, 'scroll', this.virtualScrollHandlers(callback, onEnterCallback, instance), this);
        if (getValue('options', this).movableContainer) {
            const movableContainerRect: string = 'movableContainerRect';
            super[`${movableContainerRect}`] = getValue('options', this).movableContainer.getBoundingClientRect();
            EventHandler.add(getValue('options', this).movableContainer, 'scroll', this.virtualScrollHandlers(callback, onEnterCallback, instance), this);
        }
    }
    private clear(): void {
        this.lastPos = null;
    }
    private virtualScrollHandlers(callback: Function, onEnterCallback: Function, instance: IGrid) : Function {
        const delay: number = Browser.info.name === 'chrome' ? 200 : 100;
        const options: string = 'options'; const movableEle: string = 'movableEle';
        const element: string = 'element'; const fromWheel: string = 'fromWheel';
        const debounced100: Function = debounce(callback, delay);
        const debounced50: Function = debounce(callback, 50);
        this[`${options}`].prevTop = this[`${options}`].prevLeft = 0;
        return (e: Event) => {
            const top: number = this[`${options}`].movableContainer ? this[`${options}`].container.scrollTop : (<HTMLElement>e.target).scrollTop;
            const left: number = this[`${options}`].movableContainer ? this[`${options}`].scrollbar.scrollLeft : (<HTMLElement>e.target).scrollLeft;
            let direction: ScrollDirection = this[`${options}`].prevTop < top ? 'down' : 'up';
            direction = this[`${options}`].prevLeft === left ? direction : this[`${options}`].prevLeft < left ? 'right' : 'left';
            this[`${options}`].prevTop = top; this[`${options}`].prevLeft = left;

            const current: SentinelType = this.sentinelInfo[`${direction}`];

            let delta: number = 0;
            this.newPos = top;
            if ( this.lastPos != null ) { // && newPos < maxScroll
                delta = this.newPos -  this.lastPos;
            }
            this.lastPos = this.newPos;
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(this.clear, 0);
            if ((delta > 100 || delta < -100) && (e && e.preventDefault)) {
                e.returnValue = false;
                e.preventDefault();
            }


            if (this[`${options}`].axes.indexOf(current.axis) === -1) {
                return;
            }

            const containerRect: string = 'containerRect';
            this[`${containerRect}`] = this[`${options}`].container.getBoundingClientRect();
            const check: boolean = this.check(direction);
            if (current.entered && (current.axis === 'X' || instance.enableVirtualMaskRow)) {
                if (this[`${movableEle}`] && (direction === 'right' || direction === 'left')) {
                    onEnterCallback(this[`${movableEle}`], current, direction, { top: top, left: left }, this[`${fromWheel}`], check);
                } else {
                    onEnterCallback(this[`${element}`], current, direction, { top: top, left: left }, this[`${fromWheel}`], check);
                }
            }
            if (check) {
                let fn: Function = debounced50;
                if (current.axis === 'X') {
                    fn({ direction: direction, sentinel: current, offset: { top: top, left: left },
                        focusElement: document.activeElement});
                }
                else {
                    if ((instance.dataSource instanceof DataManager && (instance.dataSource as DataManager).dataSource.url !== undefined
                    && !(instance.dataSource as DataManager).dataSource.offline && (instance.dataSource as DataManager).dataSource.url !== '') || isCountRequired(instance)
                    || instance.enableVirtualMaskRow) {
                        fn = instance.enableVirtualMaskRow ? debounced100 : fn;
                        fn({ direction: direction, sentinel: current, offset: { top: top, left: left },
                            focusElement: document.activeElement});
                    }
                    else {
                        callback({ direction: direction, sentinel: current, offset: { top: top, left: left },
                            focusElement: document.activeElement});
                    }
                }
            }
            this[`${fromWheel}`] = false;
        };
    }
}
type ScrollArg = { direction: string, isWheel: boolean,  sentinel: SentinelType, offset: Offsets, focusElement: HTMLElement };
type ScrollDirection = 'up' | 'down' | 'right' | 'left';
