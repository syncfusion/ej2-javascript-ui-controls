import { Gantt } from '../base/gantt';
import { RowSelectEventArgs, RowSelectingEventArgs, RowDeselectEventArgs, parentsUntil, getActualProperties } from '@syncfusion/ej2-grids';
import { CellDeselectEventArgs, ISelectedCell, setCssInGridPopUp, Grid } from '@syncfusion/ej2-grids';
import { CellSelectingEventArgs, CellSelectEventArgs, IIndex } from '@syncfusion/ej2-grids';
import { isNullOrUndefined, removeClass, getValue, addClass, closest, setValue, extend, isBlazor } from '@syncfusion/ej2-base';
import { IGanttData } from '../base/interface';
import { Deferred } from '@syncfusion/ej2-data';
import { TaskbarEdit } from './taskbar-edit';

/** 
 * The Selection module is used to handle cell and row selection.
 */
export class Selection {
    public parent: Gantt;
    public selectedRowIndex: number;
    public isMultiCtrlRequest: boolean;
    public isMultiShiftRequest: boolean;
    public isSelectionFromChart: Boolean = false;
    private actualTarget: EventTarget;
    private isInteracted: boolean;
    private prevRowIndex: number;
    private selectedClass: HTMLElement;
    private multipleIndexes: number[] = [];
    public selectedRowIndexes: number[] = [];
    public enableSelectMultiTouch: boolean = false;
    public startIndex: number;
    public endIndex: number;
    private openPopup: boolean = false;
    constructor(gantt: Gantt) {
        this.parent = gantt;
        this.bindEvents();
        this.parent.treeGrid.selectedRowIndex = this.parent.selectedRowIndex;
        this.parent.treeGrid.allowSelection = this.parent.allowSelection;
        this.parent.treeGrid.grid.selectionSettings.enableToggle = this.parent.selectionSettings.enableToggle;
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
        if (this.parent.isAdaptive) {
            this.parent.on('chartMouseClick', this.mouseUpHandler, this);
            this.parent.on('treeGridClick', this.popUpClickHandler, this);
        } else {
            this.parent.on('chartMouseUp', this.mouseUpHandler, this);
        }
    }
    /**
     * To update selected index.
     * @return {void}
     * @private
     */
    public selectRowByIndex(): void {
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
        if (!this.parent.isGanttChartRendered) {
            args.cancel = true;
            return;
        }
        args.isCtrlPressed = this.isMultiCtrlRequest;
        args.isShiftPressed = this.isMultiShiftRequest;
        args.target = this.actualTarget as Element;
        if (!isNullOrUndefined(args.foreignKeyData) && Object.keys(args.foreignKeyData).length === 0) {
            delete args.foreignKeyData;
        }
        this.parent.trigger('rowSelecting', args);
    }
    private rowSelected(args: RowSelectEventArgs): void {
        let rowIndexes: string = 'rowIndexes';
        let index: number[] = (this.parent.selectionSettings.type === 'Multiple' && !isNullOrUndefined(args[rowIndexes])) ?
            args[rowIndexes] : [args.rowIndex];
        this.addClass(index);
        this.selectedRowIndexes = extend([], this.getSelectedRowIndexes(), [], true) as number[];
        this.parent.setProperties({ selectedRowIndex: this.parent.treeGrid.grid.selectedRowIndex }, true);
        if (this.isMultiShiftRequest) {
            this.selectedRowIndexes = index;
        }
        if (this.parent.autoFocusTasks) {
            this.parent.ganttChartModule.updateScrollLeft(getValue('data.ganttProperties.left', args));
        }
        args.target = this.actualTarget as Element;
        if (!isNullOrUndefined(args.foreignKeyData) && Object.keys(args.foreignKeyData).length === 0) {
            delete args.foreignKeyData;
        }
        this.prevRowIndex = args.rowIndex;
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems(args);
        }
        this.parent.trigger('rowSelected', args);
    }
    private rowDeselecting(args: RowDeselectEventArgs): void {
        args.target = this.actualTarget as Element;
        args.isInteracted = this.isInteracted;
        if (isBlazor() && this.parent.selectionSettings.type === 'Multiple') {
            this.multipleIndexes = extend([], args.rowIndex, [], true) as number[];
        }
        this.parent.trigger('rowDeselecting', args);
    }
    private rowDeselected(args: RowDeselectEventArgs): void {
        let rowIndexes: string = 'rowIndexes';
        let index: number[] | number;
        let isContains: boolean;
        if (this.multipleIndexes.length !== 0) {
            index = this.multipleIndexes;
        } else {
            if (!isNullOrUndefined(args.rowIndexes)) {
                for (let i: number = 0; i < args.rowIndexes.length; i++) {
                    if (args.rowIndexes[i] === args.rowIndex) {
                        isContains = true;
                    }
                }
                if (isContains) {
                    index = args.rowIndexes;
                } else {
                    index = args.rowIndex;
                }
             } else {
                 index = args.rowIndex;
             }
        }
        this.removeClass(index);
        this.selectedRowIndexes = extend([], this.getSelectedRowIndexes(), [], true) as number[];
        this.parent.setProperties({ selectedRowIndex: -1 }, true);
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
        if (this.parent.selectionSettings.type === 'Multiple' && this.parent.isAdaptive
            && this.selectedRowIndexes.length === 0) {
            this.hidePopUp();
        }
        args.target = this.actualTarget as Element;
        args.isInteracted = this.isInteracted;
        this.parent.trigger('rowDeselected', args);
        this.isInteracted = false;
        this.multipleIndexes = [];
    }
    private cellSelecting(args: CellSelectingEventArgs): void | Deferred {
        let callBackPromise: Deferred = new Deferred();
        this.parent.trigger('cellSelecting', args, (cellselectingArgs: CellSelectingEventArgs) => {
            callBackPromise.resolve(cellselectingArgs);
        });
        return callBackPromise;
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
     * Selects a cell by given index.
     * @param  {IIndex} cellIndex - Defines the row and column indexes. 
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    public selectCell(cellIndex: IIndex, isToggle?: boolean): void {
        this.parent.treeGrid.selectCell(cellIndex, isToggle);
    }

    /**
     * Selects a collection of cells by row and column indexes. 
     * @param  {ISelectedCell[]} rowCellIndexes - Specifies the row and column indexes.
     * @return {void}
     */
    public selectCells(rowCellIndexes: ISelectedCell[]): void {
        this.parent.treeGrid.grid.selectCells(rowCellIndexes);
    }

    /**
     * Selects a row by given index. 
     * @param  {number} index - Defines the row index. 
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    public selectRow(index: number, isToggle?: boolean, isPreventFocus?: boolean): void {
        let selectedRow: HTMLElement = this.parent.getRowByIndex(index);
        let condition: boolean;
        if (index === -1 || isNullOrUndefined(selectedRow) || this.parent.selectionSettings.mode === 'Cell') {
            return;
        }
        if (this.parent.showActiveElement && !isPreventFocus) {
            this.parent.treeGrid.grid.selectionModule.preventFocus = true;
        } else {
            this.parent.treeGrid.grid.selectionModule.preventFocus = false;
        }
        if ((!isNullOrUndefined(this.selectedClass) && (this.selectedClass === selectedRow) && (!isToggle))) {
            condition = true;
        }
        if (condition !== true) {
            this.parent.treeGrid.selectRow(index, isToggle);
        }
        this.parent.treeGrid.grid.selectionModule.preventFocus = this.parent.treeGrid.grid.selectionModule.preventFocus === true ?
            false : this.parent.treeGrid.grid.selectionModule.preventFocus;
        this.prevRowIndex = index;
        this.selectedClass = selectedRow;
    }

    /**
     * Selects a collection of rows by indexes. 
     * @param  {number[]} records - Defines the collection of row indexes.
     * @return {void}
     */
    public selectRows(records: number[]): void {
        if (!isNullOrUndefined(records) && records.length > 0) {
            this.parent.treeGrid.selectRows(records);
        }
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
        if (isBlazor()) {
            return this.parent.getRecordFromFlatdata(this.parent.treeGrid.getSelectedRecords());
        } else {
            return this.parent.treeGrid.getSelectedRecords();
        }
    }

    /**
     * Get the selected records for cell selection.
     * @return {IGanttData[]}
     */
    public getCellSelectedRecords(): IGanttData[] {
        let cellDetails: ISelectedCell[] = this.parent.selectionModule.getSelectedRowCellIndexes();
        let cellSelectedRecords: IGanttData[] = [];
        for (let i: number = 0; i < cellDetails.length; i++) {
            cellSelectedRecords.push(this.parent.currentViewData[cellDetails[i].rowIndex]);
        }
        if (isBlazor()) {
            return this.parent.getRecordFromFlatdata(cellSelectedRecords);
        } else {
            return cellSelectedRecords;
        }
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
        this.isInteracted = false;
    }

    private highlightSelectedRows(e: PointerEvent, fromChart: boolean): void {
        let rows: HTMLCollection = closest((e.target as Element), 'tbody').children;
        let selectedRow: Element = closest((e.target as Element), 'tr.e-chart-row');
        let rIndex: number = [].slice.call(rows).indexOf(selectedRow);
        this.isMultiCtrlRequest = e.ctrlKey || this.enableSelectMultiTouch;
        this.isMultiShiftRequest = e.shiftKey;
        this.actualTarget = e.target;
        this.isInteracted = true;
        this.isSelectionFromChart = fromChart;
        let isToggle: boolean = this.parent.selectionSettings.enableToggle;
        if (fromChart) {
            if (this.parent.selectionSettings.type === 'Single' || (!this.isMultiCtrlRequest && !this.isMultiShiftRequest)) {
                this.selectRow(rIndex, isToggle);
            } else {
                if (this.isMultiShiftRequest) {
                    this.selectRowsByRange(isNullOrUndefined(this.prevRowIndex) ? rIndex : this.prevRowIndex, rIndex);
                } else {
                    setValue('isMultiCtrlRequest', true, this.parent.treeGrid.grid.selectionModule);
                    this.parent.treeGrid.grid.selectionModule.addRowsToSelection([rIndex]);
                }
            }
        }
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
     * @param  {number} startIndex - Defines the start row index. 
     * @param  {number} endIndex - Defines the end row index. 
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
            if (!isNullOrUndefined(ganttRow[records[i]])) {
                addClass([ganttRow[records[i]]], 'e-active');
                ganttRow[records[i]].setAttribute('aria-selected', 'true');
            }
        }
    }

    private removeClass(records: number | number[]): void {
        if (!this.parent.selectionSettings.persistSelection) {
            let ganttRow: HTMLCollection = document.getElementById(this.parent.element.id + 'GanttTaskTableBody').children;
            /* tslint:disable-next-line:no-any */
            let rowIndex: any | number | number[] = isNullOrUndefined((records as number[]).length) ? [records] : records;
            for (let i: number = 0; i < (rowIndex as number[]).length; i++) {
                removeClass([ganttRow[rowIndex[i]]], 'e-active');
                ganttRow[rowIndex[i]].removeAttribute('aria-selected');
            }
        }
    }

    private showPopup(e: MouseEvent): void {
        if (this.isSelectionFromChart) {
            setCssInGridPopUp(
                <HTMLElement>this.parent.element.querySelector('.e-ganttpopup'), e,
                'e-rowselect e-icons e-icon-rowselect' +
                ((this.enableSelectMultiTouch &&
                    (this.getSelectedRecords().length > 1 || this.getSelectedRowCellIndexes().length > 1)) ? ' e-spanclicked' : ''));
            (<HTMLElement>document.getElementsByClassName('e-gridpopup')[0]).style.display = 'none';
            this.openPopup = true;
        } else if (this.selectedRowIndexes.length === 0) {
            this.hidePopUp();
        }
    }
    /** @private */
    public hidePopUp(): void {
        if (this.openPopup) {
            (<HTMLElement>document.getElementsByClassName('e-ganttpopup')[0]).style.display = 'none';
            this.openPopup = false;
        } else {
            (<HTMLElement>document.getElementsByClassName('e-gridpopup')[0]).style.display = 'none';
        }
    }

    private popUpClickHandler(e: MouseEvent): void {
        let target: Element = e.target as Element;
        let grid: Grid = this.parent.treeGrid.grid;
        let $popUpElemet: Element = closest(target, '.e-ganttpopup') ?
            closest(target, '.e-ganttpopup') : closest(target, '.e-gridpopup');
        if ($popUpElemet) {
            let spanElement: Element = $popUpElemet.querySelector('.' + 'e-rowselect');
            if (closest(target, '.e-ganttpopup') &&
                !spanElement.classList.contains('e-spanclicked')) {
                this.enableSelectMultiTouch = true;
                spanElement.classList.add('e-spanclicked');
            } else if (closest(target, '.e-gridpopup') &&
                spanElement.classList.contains('e-spanclicked')) {
                this.openPopup = true;
                this.enableSelectMultiTouch = true;
            } else {
                this.hidePopUp();
                this.enableSelectMultiTouch = false;
                if (closest(target, '.e-ganttpopup')) {
                    spanElement.classList.remove('e-spanclicked');
                }
            }
        } else if (this.parent.selectionSettings.type === 'Multiple' && this.parent.isAdaptive) {
            let $tr: Element = closest(target, '.e-rowcell');
            if ($tr && this.selectedRowIndexes.length === 0) {
                this.hidePopUp();
            }
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
        let targetElement: Element = null;
        if ((e.target as Element).closest('.e-rowcell')) {
            targetElement = e.target as HTMLElement;
        } else if ((e.target as Element).closest('.e-chart-row')) {
            targetElement = (e.target as Element).closest('.e-left-label-container') ||
                (e.target as Element).closest('.e-taskbar-main-container') || (e.target as Element).closest('.e-right-label-container');
        }
        if (this.parent.focusModule) {
            this.parent.focusModule.setActiveElement(targetElement as HTMLElement);
        }
        if (this.parent.editModule && this.parent.editSettings.allowTaskbarEditing && this.parent.editModule.taskbarEditModule) {
            let taskbarEdit: TaskbarEdit = this.parent.editModule.taskbarEditModule;
            if (taskbarEdit.isMouseDragged || taskbarEdit.tapPointOnFocus) {
                isTaskbarEdited = true;
            }
        }
        if (!isTaskbarEdited && this.parent.element.contains(e.target as Node)) {
            let parent: Element = parentsUntil(e.target as Element, 'e-chart-row');
            let isSelected: boolean = (e.target as HTMLElement).classList.contains('e-rowcell') ||
                (e.target as HTMLElement).classList.contains('e-row') ||
                (e.target as HTMLElement).classList.contains('e-treegridexpand') ||
                (e.target as HTMLElement).classList.contains('e-treegridcollapse') || !isNullOrUndefined(parent);
            this.popUpClickHandler(e);
            if (this.parent.selectionSettings.mode !== 'Cell' && isSelected) {
                if (closest((e.target as Element), 'tr.e-chart-row')) {
                    this.highlightSelectedRows(e, true);
                } else {
                    this.highlightSelectedRows(e, false);
                }
                if (this.parent.selectionSettings.type === 'Multiple' && this.parent.isAdaptive) {
                    if (this.selectedRowIndexes.length > 0) {
                        this.showPopup(e);
                    } else {
                        this.hidePopUp();
                    }
                }
            } else {
                this.isSelectionFromChart = false;
            }
        }
    }

    /**
     * To destroy the selection module.
     * @return {void}
     * @private
     */
    public destroy(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('selectRowByIndex', this.selectRowByIndex);
        if (this.parent.isAdaptive) {
            this.parent.off('chartMouseClick', this.mouseUpHandler);
            this.parent.off('treeGridClick', this.popUpClickHandler);
        } else {
            this.parent.off('chartMouseUp', this.mouseUpHandler);
        }
    }
}