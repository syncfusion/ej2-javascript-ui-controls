import { Gantt } from '../base/gantt';
import { RowSelectEventArgs, RowSelectingEventArgs, RowDeselectEventArgs, parentsUntil, getActualProperties } from '@syncfusion/ej2-grids';
import { CellDeselectEventArgs, ISelectedCell, setCssInGridPopUp, Grid } from '@syncfusion/ej2-grids';
import { CellSelectingEventArgs, CellSelectEventArgs, IIndex } from '@syncfusion/ej2-grids';
import { isNullOrUndefined, removeClass, getValue, addClass, closest, setValue, Browser } from '@syncfusion/ej2-base';
import { IGanttData } from '../base/interface';

/** 
 * Column reorder action related code goes here
 */
export class Selection {
    public parent: Gantt;
    public selectedRowIndex: number;
    public isMultiCtrlRequest: boolean;
    public isMultiShiftRequest: boolean;
    public isSelectionFromChart: Boolean = false;
    private actualTarget: EventTarget;
    private prevRowIndex: number;
    public selectedRowIndexes: number[] = [];
    public enableSelectMultiTouch: boolean = false;
    public startIndex: number;
    public endIndex: number;
    constructor(gantt: Gantt) {
        this.parent = gantt;
        this.bindEvents();
        this.parent.treeGrid.selectedRowIndex = this.parent.selectedRowIndex;
        this.parent.treeGrid.allowSelection = this.parent.allowSelection;
        this.parent.treeGrid.selectionSettings = getActualProperties(this.parent.selectionSettings);
        this.wireEvents();
    }

    /**
     * Get module name
     */
    private getModuleName(): string {
        return 'selection';
    }

    private wireEvents(): void {
        this.parent.on('selectRowByIndex', this.selectRowByIndex, this);
        this.parent.on('chartMouseUp', this.mouseUpHandler, this);
    }

    private selectRowByIndex(): void {
        if (this.parent.selectedRowIndex !== -1 || this.parent.staticSelectedRowIndex !== -1) {
            this.selectRow(
                this.parent.staticSelectedRowIndex !== -1 ? this.parent.staticSelectedRowIndex : this.parent.selectedRowIndex);
            this.parent.staticSelectedRowIndex = -1;
        }
    }
    /**
     * To bind selection events.
     * @return {void}
     * @private
     */
    private bindEvents(): void {
        this.parent.treeGrid.rowSelecting = this.rowSelecting.bind(this);
        this.parent.treeGrid.rowSelected = this.rowSelected.bind(this);
        this.parent.treeGrid.rowDeselecting = this.rowDeselecting.bind(this);
        this.parent.treeGrid.rowDeselected = this.rowDeselected.bind(this);
        this.parent.treeGrid.cellSelecting = this.cellSelecting.bind(this);
        this.parent.treeGrid.cellSelected = this.cellSelected.bind(this);
        this.parent.treeGrid.cellDeselecting = this.cellDeselecting.bind(this);
        this.parent.treeGrid.cellDeselected = this.cellDeselected.bind(this);
    }
    private rowSelecting(args: RowSelectingEventArgs): void {
        this.parent.trigger('rowSelecting', args);
        this.isMultiCtrlRequest = args.isCtrlPressed;
        this.isMultiShiftRequest = args.isShiftPressed;
        if (!this.isSelectionFromChart) {
            this.selectedRowIndexes.push(args.rowIndex);
        }
    }
    private rowSelected(args: RowSelectEventArgs): void {
        let rowIndexes: string = 'rowIndexes';
        let index: number[] = args[rowIndexes] || [args.rowIndex];
        this.addClass(index);
        this.parent.selectedRowIndex = this.parent.treeGrid.selectedRowIndex;
        if (this.isMultiShiftRequest) {
            this.selectedRowIndexes = index;
        }
        if (this.parent.autoFocusTasks) {
            this.parent.ganttChartModule.updateScrollLeft(getValue('data.ganttProperties.left', args));
        }
        this.parent.trigger('rowSelected', args);
        this.prevRowIndex = args.rowIndex;
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }
    private rowDeselecting(args: RowDeselectEventArgs): void {
        this.parent.trigger('rowDeselecting', args);
        if (!args.cancel) {
            this.removeClass(args.rowIndex);
        }
    }
    private rowDeselected(args: RowDeselectEventArgs): void {
        this.parent.trigger('rowDeselected', args);
        if (!this.isSelectionFromChart) {
            this.selectedRowIndexes.splice(this.selectedRowIndexes.indexOf(args.rowIndex[0]), 1);
        }
        let rowIndexes: string = 'rowIndexes';
        let index: number[] = args[rowIndexes] || args.rowIndex;
        this.removeClass(index);
        this.parent.selectedRowIndex = -1;
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }
    private cellSelecting(args: CellSelectingEventArgs): void {
        this.parent.trigger('cellSelecting', args);
    }
    private cellSelected(args: CellSelectEventArgs): void {
        this.parent.trigger('cellSelected', args);
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }
    private cellDeselecting(args: CellDeselectEventArgs): void {
        this.parent.trigger('cellDeselecting', args);
    }
    private cellDeselected(args: CellDeselectEventArgs): void {
        this.parent.trigger('cellDeselected', args);
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }
    /**
     * Selects a cell by the given index.
     * @param  {IIndex} cellIndex - Defines the row and column indexes. 
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    public selectCell(cellIndex: IIndex, isToggle?: boolean): void {
        this.parent.treeGrid.selectCell(cellIndex, isToggle);
    }

    /**
     * Selects a row by given index. 
     * @param  {number} index - Defines the row index. 
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    public selectRow(index: number, isToggle?: boolean): void {
        let selectedRow: HTMLElement = this.parent.getRowByIndex(index);
        if (index === -1 || isNullOrUndefined(selectedRow)) {
            return;
        }
        let isRowSelected: boolean = selectedRow.hasAttribute('aria-selected');
        let can: string = 'cancel';
        if (isRowSelected && isToggle) {
            let rowDeselectObj: object = {
                rowIndex: index, data: this.parent.ganttChartModule.getRecordByTaskBar(selectedRow),
                row: selectedRow, cancel: false, target: this.actualTarget
            };
            this.parent.trigger('rowDeSelecting', rowDeselectObj);
            this.clearSelection();
        } else {
            let args: object = {
                data: this.parent.ganttChartModule.getRecordByTaskBar(selectedRow),
                rowIndex: index, isCtrlPressed: this.isMultiCtrlRequest,
                isShiftPressed: this.isMultiShiftRequest, row: selectedRow,
                previousRow: this.parent.getRowByIndex(this.prevRowIndex),
                previousRowIndex: this.prevRowIndex, target: this.actualTarget, cancel: false
            };
            this.parent.trigger('rowSelecting', args);
            if (!args[can]) {
                this.addClass([index]);
                this.parent.treeGrid.selectRow(index, isToggle);
            }
        }
        this.prevRowIndex = index;
    }

    /**
     * Selects a collection of rows by indexes. 
     * @param  {number[]} rowIndexes - Specifies the row indexes.
     * @return {void}
     */
    public selectRows(records: number[]): void {
        let rowIndex: number = records[records.length - 1];
        records = this.parent.selectionSettings.type === 'Single' ? [rowIndex] : records;
        let can: string = 'cancel';
        let selectedRow: HTMLElement = this.parent.getRowByIndex(rowIndex);
        let args: object = {
            data: this.parent.ganttChartModule.getRecordByTaskBar(selectedRow),
            rowIndexes: records, rowIndex: rowIndex, row: selectedRow,
            isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
            previousRow: this.parent.getRowByIndex(this.prevRowIndex),
            previousRowIndex: this.prevRowIndex, target: this.actualTarget, cancel: false
        };
        this.parent.trigger('rowSelecting', args);
        if (!args[can]) {
            for (let i: number = 0; i < records.length; i++) {
                this.addClass([records[i]]);
            }
        }
        this.parent.treeGrid.selectRows(records);
    }

    /**
     * Gets the collection of selected row indexes.
     * @return {number[]}
     */
    public getSelectedRowIndexes(): number[] {
        return this.parent.treeGrid.getSelectedRowIndexes();
    }

    /**
     * Gets the collection of selected row and cell indexes.
     * @return {number[]}
     */
    public getSelectedRowCellIndexes(): ISelectedCell[] {
        return this.parent.treeGrid.getSelectedRowCellIndexes();
    }

    /**
     * Gets the collection of selected records.
     * @return {Object[]}
     */
    public getSelectedRecords(): Object[] {
        return this.parent.treeGrid.getSelectedRecords();
    }

    /**
     * To get the selected records for cell selection
     * @return {IGanttData[]}
     */
    public getCellSelectedRecords(): IGanttData[] {
        let cellDetails: ISelectedCell[] = this.parent.selectionModule.getSelectedRowCellIndexes();
        let cellSelectedRecords: IGanttData[] = [];
        for (let i: number = 0; i < cellDetails.length; i++) {
            cellSelectedRecords.push(this.parent.currentViewData[cellDetails[i].rowIndex]);
        }
        return cellSelectedRecords;
    }

    /**
     * Gets the collection of selected rows.
     * @return {Element[]}
     */
    public getSelectedRows(): Element[] {
        return this.parent.treeGrid.getSelectedRows();
    }

    /**
     * Deselects the current selected rows and cells.
     * @return {void}
     */
    public clearSelection(): void {
        this.removeClass(this.selectedRowIndexes);
        this.parent.treeGrid.clearSelection();
        this.parent.selectedRowIndex = -1;
        this.selectedRowIndexes = [];
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
    }

    private highlightSelectedRows(e: PointerEvent, fromChart: boolean): void {
        let rows: HTMLCollection = (e.target as Element).closest('tbody').children;
        let selectedRow: Element = (e.target as Element).closest('tr.e-chart-row');
        let rIndex: number = [].slice.call(rows).indexOf(selectedRow);
        this.isMultiCtrlRequest = e.ctrlKey || this.enableSelectMultiTouch;
        this.isMultiShiftRequest = e.shiftKey;
        this.actualTarget = e.target;
        this.isSelectionFromChart = fromChart;
        if (fromChart) {
            if (this.parent.selectionSettings.type === 'Single' || (!this.isMultiCtrlRequest && !this.isMultiShiftRequest)) {
                this.selectedRowIndexes = [];
                this.selectedRowIndexes.push(rIndex);
                this.selectRow(rIndex, true);
            } else {
                if (this.isMultiShiftRequest) {
                    this.selectRowsByRange(isNullOrUndefined(this.prevRowIndex) ? rIndex : this.prevRowIndex, rIndex);
                } else {
                    this.addRowsToSelection(rIndex);
                }
            }
        }
    }
    /** 
     * Select rows with existing row selection by passing row indexes. 
     * @return {void} 
     * @hidden
     */
    public addRowsToSelection(index: number): void {
        let rowIndex: number = this.selectedRowIndexes.indexOf(index);
        let selectedRow: HTMLElement = this.parent.getRowByIndex(index);
        let can: string = 'cancel';
        if (rowIndex > -1) {
            this.selectedRowIndexes.splice(rowIndex, 1);
            let rowDeselectObj: object = {
                rowIndex: index, data: this.parent.ganttChartModule.getRecordByTaskBar(selectedRow),
                row: selectedRow, cancel: false, target: this.actualTarget
            };
            this.parent.trigger('rowDeSelecting', rowDeselectObj);
        } else {
            this.selectedRowIndexes.push(index);
            let args: object = {
                data: this.parent.ganttChartModule.getRecordByTaskBar(selectedRow),
                rowIndexes: this.selectedRowIndexes, rowIndex: rowIndex, row: selectedRow,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
                previousRow: this.parent.getRowByIndex(this.prevRowIndex),
                previousRowIndex: this.prevRowIndex, target: this.actualTarget, cancel: false
            };
            this.parent.trigger('rowSelecting', args);
            if (!args[can]) {
                this.addClass([index]);
            }
        }
        this.parent.treeGrid.grid.selectionModule.addRowsToSelection([index]);
    }

    private getselectedrowsIndex(startIndex: number, endIndex?: number): void {
        let indexes: number[] = [];
        let { i, max }: { i: number, max: number } = (startIndex < endIndex) ?
            { i: startIndex, max: endIndex } : { i: endIndex, max: startIndex };
        for (; i <= max; i++) {
            indexes.push(i);
        }
        if (startIndex > endIndex) {
            indexes.reverse();
        }
        this.selectedRowIndexes = indexes;
    }

    /** 
     * Selects a range of rows from start and end row indexes. 
     * @param  {number} startIndex - Specifies the start row index. 
     * @param  {number} endIndex - Specifies the end row index. 
     * @return {void} 
     */
    public selectRowsByRange(startIndex: number, endIndex?: number): void {
        this.isSelectionFromChart = true;
        this.getselectedrowsIndex(startIndex, endIndex);
        this.selectRows(this.selectedRowIndexes);
    }

    private addClass(records: number[]): void {
        let ganttRow: HTMLCollection = document.getElementById(this.parent.element.id + 'GanttTaskTableBody').children;
        for (let i: number = 0; i < records.length; i++) {
            addClass([ganttRow[records[i]]], 'e-active');
            ganttRow[records[i]].setAttribute('aria-selected', 'true');

        }
    }

    private removeClass(records: number | number[]): void {
        if (!this.parent.selectionSettings.persistSelection) {
            let ganttRow: HTMLCollection = document.getElementById(this.parent.element.id + 'GanttTaskTableBody').children;
            for (let i: number = 0; i < (records as number[]).length; i++) {
                removeClass([ganttRow[records[i]]], 'e-active');
                ganttRow[records[i]].removeAttribute('aria-selected');
            }
        }
    }

    private showPopup(e: MouseEvent): void {
        if (this.isSelectionFromChart) {
            setCssInGridPopUp(
                <HTMLElement>this.parent.element.querySelector('.e-ganttpopup'), e,
                'e-rowselect e-icons e-icon-rowselect' +
                ((this.getSelectedRecords().length > 1 || this.getSelectedRowCellIndexes().length > 1) ? ' e-spanclicked' : ''));
            (<HTMLElement>document.getElementsByClassName('e-gridpopup')[0]).style.display = 'none';
        } else {
            this.hidePopUp();
        }
    }

    private hidePopUp(): void {
        (<HTMLElement>document.getElementsByClassName('e-ganttpopup')[0]).style.display = 'none';
    }

    private popUpClickHandler(e: MouseEvent): void {
        let target: Element = e.target as Element;
        let grid: Grid = this.parent.treeGrid.grid;
        if (closest(target, '.e-ganttpopup') || closest(target, '.e-gridpopup')) {
            if (!target.classList.contains('e-spanclicked')) {
                this.enableSelectMultiTouch = true;
                if (closest(target, '.e-ganttpopup')) {
                    target.classList.add('e-spanclicked');
                }
            } else {
                this.hidePopUp();
                this.enableSelectMultiTouch = false;
                if (closest(target, '.e-ganttpopup')) {
                    target.classList.remove('e-spanclicked');
                }
            }
        } else {
            this.hidePopUp();
        }
        if (grid) {
            setValue('enableSelectMultiTouch', this.enableSelectMultiTouch, grid.selectionModule);
        }
    }

    /**
     * @return {void}
     * @private
     */
    private mouseUpHandler(e: PointerEvent): void {
        let isTaskbarEdited: boolean = false;
        if (this.parent.editSettings.allowTaskbarEditing &&
            getValue('editModule.taskbarEditModule.isMouseDragged', this.parent)) {
            isTaskbarEdited = true;
        }
        if (!isTaskbarEdited && this.parent.element.contains(e.target as Node)) {
            let parent: Element = parentsUntil(e.target as Element, 'e-chart-row');
            let isSelected: boolean = (e.target as HTMLElement).classList.contains('e-rowcell') ||
                (e.target as HTMLElement).classList.contains('e-row') ||
                (e.target as HTMLElement).classList.contains('e-treegridexpand') ||
                (e.target as HTMLElement).classList.contains('e-treegridcollapse') || !isNullOrUndefined(parent);
            this.popUpClickHandler(e);
            if (this.parent.selectionSettings.mode !== 'Cell' && isSelected) {
                if ((e.target as Element).closest('tr.e-chart-row')) {
                    this.highlightSelectedRows(e, true);
                } else {
                    this.highlightSelectedRows(e, false);
                }
                if (this.parent.selectionSettings.type === 'Multiple' && Browser.isDevice) {
                    this.showPopup(e);
                }
            } else {
                this.isSelectionFromChart = false;
            }
        }
    }

    /**
     * To destroy the column-resizer.
     * @return {void}
     * @private
     */
    public destroy(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('selectRowByIndex', this.selectRowByIndex);
        this.parent.off('chartMouseUp', this.mouseUpHandler);
    }
}