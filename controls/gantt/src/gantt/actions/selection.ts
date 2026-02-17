import { Gantt } from '../base/gantt';
import { RowSelectEventArgs, RowSelectingEventArgs, RowDeselectEventArgs, parentsUntil, getActualProperties } from '@syncfusion/ej2-grids';
import { CellDeselectEventArgs, ISelectedCell, setCssInGridPopUp, Grid } from '@syncfusion/ej2-grids';
import { CellSelectingEventArgs, CellSelectEventArgs, IIndex } from '@syncfusion/ej2-grids';
import { isNullOrUndefined, removeClass, getValue, addClass, closest, setValue, extend } from '@syncfusion/ej2-base';
import { IGanttData } from '../base/interface';
import { Deferred } from '@syncfusion/ej2-data';
import { TaskbarEdit } from './taskbar-edit';
import { UndoRedo } from './undo-redo';

/**
 * The Selection module is used to handle cell and row selection.
 */
export class Selection {
    public parent: Gantt;
    public selectedRowIndex: number;
    public isMultiCtrlRequest: boolean;
    public isMultiShiftRequest: boolean;
    public isSelectionFromChart: boolean = false;
    private actualTarget: EventTarget;
    private isInteracted: boolean;
    private prevRowIndex: number;
    private selectedClass: HTMLElement;
    private isFromChart: boolean = false;
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
     * Get module
     *
     * @returns {string} .
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
     *
     * @returns {void} .
     * @private
     */
    public selectRowByIndex(): void {
        if ((this.parent.selectedRowIndex !== -1 || this.parent.staticSelectedRowIndex !== -1)) {
            this.selectRow(
                this.parent.staticSelectedRowIndex !== -1 ? this.parent.staticSelectedRowIndex : this.parent.selectedRowIndex);
            this.parent.staticSelectedRowIndex = -1;
        }
    }
    /**
     * To bind selection events.
     *
     * @returns {void} .
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
        args.isCtrlPressed = this.isMultiCtrlRequest || args.isCtrlPressed;
        args.isShiftPressed = this.isMultiShiftRequest || args.isShiftPressed;
        args.target = this.actualTarget as Element;
        if (!isNullOrUndefined(args.foreignKeyData) && Object.keys(args.foreignKeyData).length === 0) {
            delete args.foreignKeyData;
        }
        if (this.parent.selectionSettings && this.parent.selectionSettings.persistSelection) {
            this.parent.treeGrid.grid.selectionModule['checkSelectAllClicked'] = true;
        }
        this.parent.trigger('rowSelecting', args);
        if (this.isMultiShiftRequest || this.isMultiCtrlRequest) {
            this.isMultiShiftRequest = this.isMultiCtrlRequest = false;
        }
    }
    private rowSelected(args: RowSelectEventArgs): void {
        const rowIndexes: string = 'rowIndexes';
        const index: number[] = (this.parent.selectionSettings.type === 'Multiple' && !isNullOrUndefined(args[rowIndexes as string])) ?
            args[rowIndexes as string] : [args.rowIndex];
        this.addRemoveClass(index, args['name']);
        this.selectedRowIndexes = extend([], this.getSelectedRowIndexes(), [], true) as number[];
        this.parent.setProperties({ selectedRowIndex: this.parent.treeGrid.grid.selectedRowIndex }, true);
        if (this.isMultiShiftRequest) {
            this.selectedRowIndexes = index;
        }
        if (this.parent.autoFocusTasks) {
            if (this.parent.enableTimelineVirtualization) {
                this.parent['isRowSelected'] = true;
            }
            if (args.data && !isNullOrUndefined(args.data['length'])) {
                for (let i: number = 0; i < args.data['length']; i++){
                    this.parent.ganttChartModule.updateScrollLeft(args.data[i as number].ganttProperties.left);
                }
            }
            else{
                if (this.parent.loadChildOnDemand && this.parent.taskFields.hasChildMapping &&
                    isNullOrUndefined(getValue('data.ganttProperties.left', args))) {
                    args.data = this.parent.getRecordByID((args.data as any).taskId);
                }
                if (!this.parent.ganttChartModule['isTouchMoved']) {
                    this.parent.ganttChartModule.updateScrollLeft(getValue('data.ganttProperties.left', args));
                }
            }
        }
        args.target = this.actualTarget as Element;
        if (!isNullOrUndefined(args.foreignKeyData) && Object.keys(args.foreignKeyData).length === 0) {
            delete args.foreignKeyData;
        }
        this.prevRowIndex = args.rowIndex;
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems(args);
        }
        if (!isNullOrUndefined(this.parent.focusModule['previousActiveElement'])) {
            const previousSelection: HTMLElement = this.parent.focusModule['previousActiveElement'];
            removeClass([previousSelection], 'e-focused');
            removeClass([previousSelection], 'e-focus');
        }
        this.parent.trigger('rowSelected', args);
        // To reset the target element after trigger action complete-T1009443
        this.actualTarget = undefined;
    }
    private rowDeselecting(args: RowDeselectEventArgs): void {
        if (this.parent.chartRowsModule['isGridRowRefreshed']) {
            args['cancel'] = true;
        }
        args.target = this.actualTarget as Element;
        args.isInteracted = this.isInteracted;
        const undoRedo: UndoRedo = this.parent.undoRedoModule;
        if (undoRedo && undoRedo['isPreventRowDeselectOnUndoRedo']) {
            (args as any).cancel = true;
        }
        this.parent.trigger('rowDeselecting', args);
    }
    private rowDeselected(args: RowDeselectEventArgs): void {
        let index: number[];
        let isContains: boolean;
        if (this.multipleIndexes.length !== 0) {
            index = this.multipleIndexes;
            this.addRemoveClass(index);
        } else if (args.isHeaderCheckboxClicked === true) {
            this.clearSelection();
        } else {
            if (!isNullOrUndefined(args.rowIndexes)) {
                for (let i: number = 0; i < args.rowIndexes.length; i++) {
                    if (args.rowIndexes[i as number] === args.rowIndex) {
                        isContains = true;
                    }
                }
                if (isContains) {
                    index = args.rowIndexes;
                } else {
                    index = [args.rowIndex];
                }
            } else {
                index = [args.rowIndex];
            }
            this.addRemoveClass(index);
        }
        this.selectedRowIndexes = extend([], this.getSelectedRowIndexes(), [], true) as number[];
        this.parent.setProperties({ selectedRowIndex: -1 }, true);
        if (this.selectedRowIndexes.length === 1) {
            this.parent.setProperties({ selectedRowIndex: this.selectedRowIndexes[0] }, true);
        }
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
        const callBackPromise: Deferred = new Deferred();
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
     *
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @returns {void} .
     */
    public selectCell(cellIndex: IIndex, isToggle?: boolean): void {
        this.parent.treeGrid.selectCell(cellIndex, isToggle);
    }

    /**
     * Selects a collection of cells by row and column indexes.
     *
     * @param  {ISelectedCell[]} rowCellIndexes - Specifies the row and column indexes.
     * @returns {void} .
     */
    public selectCells(rowCellIndexes: ISelectedCell[]): void {
        this.parent.treeGrid.grid.selectCells(rowCellIndexes);
    }

    /**
     * Selects a row by given index.
     *
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @param {boolean} isPreventFocus .
     * @returns {void} .
     */
    public selectRow(index: number, isToggle?: boolean, isPreventFocus?: boolean): void {
        const ganttRow: HTMLElement[] = [].slice.call(this.parent.ganttChartModule.chartBodyContent.querySelector('tbody').children);
        if (this.parent.enableVirtualization && (this.parent.treeGridModule.addedRecord ||
            (this.parent.editModule && this.parent.editModule.isAdded))) {
            index = this.parent.getExpandedRecords(this.parent.flatData).indexOf(this.parent.flatData[index as number]);
            this.parent.treeGridModule.addedRecord = false;
            if (this.parent.editModule) {
                this.parent.editModule.isAdded = false;
            }
        }
        const selectedRow: HTMLElement = ganttRow.filter((e: HTMLElement) => parseInt(e.getAttribute('aria-rowindex'), 10) - 1 === index)[0];
        let condition: boolean;
        if (index === -1 || (isNullOrUndefined(selectedRow) && !this.parent.enableVirtualization) || this.parent.selectionSettings.mode === 'Cell') {
            return;
        }
        if (this.parent.showActiveElement && !isNullOrUndefined(isPreventFocus) && !isPreventFocus || this.isFromChart) {
            if (this.isFromChart) {
                this.isFromChart = false;
            }
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
     *
     * @param  {number[]} records - Defines the collection of row indexes.
     * @returns {void} .
     */
    public selectRows(records: number[]): void {
        if (!isNullOrUndefined(records) && records.length > 0) {
            this.parent.treeGrid.selectRows(records);
        }
    }

    /**
     * Gets the collection of selected row indexes.
     *
     * @returns {number[]} .
     */
    public getSelectedRowIndexes(): number[] {
        return this.parent.treeGrid.getSelectedRowIndexes();
    }

    /**
     * Gets the collection of selected row and cell indexes.
     *
     * @returns {number[]} .
     */
    public getSelectedRowCellIndexes(): ISelectedCell[] {
        return this.parent.treeGrid.getSelectedRowCellIndexes();
    }

    /**
     * Gets the collection of selected records.
     *
     * @returns {Object[]} .
     */
    public getSelectedRecords(): Object[] {
        if (this.parent.loadChildOnDemand && this.parent.taskFields.hasChildMapping) {
            const selectedRows: IGanttData[] = [];
            const selectedIndexes: number[] = this.parent.selectionModule.getSelectedRowIndexes();
            for (let i: number = 0; i < selectedIndexes.length; i++) {
                const rec: IGanttData = this.parent.currentViewData.filter((data: IGanttData) => {
                    return data.index === selectedIndexes[i as number];
                })[0];
                selectedRows.push(rec);
            }
            return selectedRows;
        }
        else {
            return this.parent.treeGrid.getSelectedRecords();
        }
    }

    /**
     * Get the selected records for cell selection.
     *
     * @returns {IGanttData[]} .
     */
    public getCellSelectedRecords(): IGanttData[] {
        const cellDetails: ISelectedCell[] = this.parent.selectionModule.getSelectedRowCellIndexes();
        const cellSelectedRecords: IGanttData[] = [];
        for (let i: number = 0; i < cellDetails.length; i++) {
            cellSelectedRecords.push(this.parent.currentViewData[cellDetails[i as number].rowIndex]);
        }
        return cellSelectedRecords;
    }

    /**
     * Gets the collection of selected rows.
     *
     * @returns {Element[]} .
     */
    public getSelectedRows(): Element[] {
        return this.parent.treeGrid.getSelectedRows();
    }

    /**
     * Deselects the current selected rows and cells.
     *
     * @returns {void} .
     */
    public clearSelection(): void {
        this.addRemoveClass(this.selectedRowIndexes);
        this.parent.treeGrid.clearSelection();
        this.parent.selectedRowIndex = -1;
        this.selectedRowIndexes = [];
        this.selectedClass = null;
        if (!isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
        this.isInteracted = false;
    }

    private highlightSelectedRows(e: PointerEvent, fromChart: boolean): void {
        this.isMultiCtrlRequest = e.ctrlKey || this.enableSelectMultiTouch;
        this.isMultiShiftRequest = e.shiftKey;
        this.actualTarget = e.target;
        this.isInteracted = true;
        this.isSelectionFromChart = fromChart;
        if (fromChart) {
            const selectedRow: Element = closest((e.target as Element), 'tr.e-chart-row');
            const rIndex: number = parseInt(selectedRow.getAttribute('aria-rowindex'), 10) - 1;
            const isToggle: boolean = this.parent.selectionSettings.enableToggle;
            if (this.parent.selectionSettings.type === 'Single' || (!this.isMultiCtrlRequest && !this.isMultiShiftRequest && !this.parent.treeGrid.grid['isCheckBoxSelection'])) {
                if (this.parent.selectionSettings.persistSelection) {
                    this.addRemoveClass(this.selectedRowIndexes, e['name']);
                }
                if (!this.parent.allowTaskbarDragAndDrop || (this.parent.allowTaskbarDragAndDrop && (this.parent.rowDragAndDropModule &&
                    !this.parent.rowDragAndDropModule['draggedRecord']))) {
                    this.isFromChart = true;
                    this.selectRow(rIndex, isToggle);
                }
            } else {
                if (this.isMultiShiftRequest) {
                    this.selectRowsByRange(isNullOrUndefined(this.prevRowIndex) ? rIndex : this.prevRowIndex, rIndex);
                } else {
                    setValue('isMultiCtrlRequest', true, this.parent.treeGrid.grid.selectionModule);
                    this.parent.treeGrid.grid.selectionModule.addRowsToSelection([rIndex]);
                    const isUnSelected: boolean = this.selectedRowIndexes.indexOf(rIndex) > -1;
                    if (isUnSelected && !this.parent.treeGrid.grid['isCheckBoxSelection']) {
                        this.addRemoveClass([rIndex], e['name']);
                    }
                }
            }
        }
    }

    private getselectedrowsIndex(startIndex: number, endIndex?: number): void {
        const indexes: number[] = [];
        // eslint-disable-next-line
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
     *
     * @param  {number} startIndex - Defines the start row index.
     * @param  {number} endIndex - Defines the end row index.
     * @returns {void} .
     */
    public selectRowsByRange(startIndex: number, endIndex?: number): void {
        this.isSelectionFromChart = true;
        this.getselectedrowsIndex(startIndex, endIndex);
        this.selectRows(this.selectedRowIndexes);
    }

    private addRemoveClass(records: number[], request? : string): void {
        if (typeof(records) == 'number') {
            records = [records];
        }
        if (this.parent.ganttChartModule.chartBodyContent) {
            const ganttRow: HTMLElement[] = [].slice.call(this.parent.ganttChartModule.chartBodyContent.querySelector('tbody').children);
            for (let i: number = 0; i < records.length; i++) {
                const selectedRow: HTMLElement = ganttRow.filter((e: HTMLElement) =>
                    parseInt(e.getAttribute('aria-rowindex'), 10) - 1 === records[parseInt(i.toString(), 10)])[0];
                if (!isNullOrUndefined(selectedRow)) {
                    let persist: boolean = false;
                    const index: number = this.getSelectedRowIndexes().indexOf(records[parseInt(i.toString(), 10)]);
                    const selectedRecordLen: number = this.getSelectedRecords().length;
                    if (this.parent.selectionSettings.persistSelection && this.parent.selectionSettings.enableToggle &&
                        !isNullOrUndefined(request) && this.parent.selectionSettings.type !== 'Multiple' &&
                        selectedRecordLen > 0) {
                        persist = true;
                    }
                    if (this.parent.selectionSettings.enableToggle && this.parent.selectionSettings.persistSelection &&
                        (index > -1 && this.parent.selectionSettings.type === 'Single' && persist) ||
                        (index > -1 && ((!isNullOrUndefined(request) && this.parent.selectionSettings.type === 'Multiple')))) {
                        this.addClass(selectedRow);
                    }
                    else if (isNullOrUndefined(request)) {
                        this.removeClass(selectedRow);
                    }
                    else if (index > -1) {
                        this.addClass(selectedRow);
                    }
                    if (this.parent.selectionSettings.enableToggle &&  index > -1 && (this.parent.selectionSettings.type === 'Single' ||
                        (!this.isMultiCtrlRequest && !this.isMultiShiftRequest)) && this.parent.selectionSettings.persistSelection &&
                        request === 'chartMouseUp' && this.isSelectionFromChart) {
                        this.removeClass(selectedRow);
                    }
                }
            }
        }
    }
    private addClass(selectedRow: HTMLElement): void {
        addClass([selectedRow], 'e-active');
        selectedRow.setAttribute('aria-selected', 'true');
    }

    private removeClass(selectedRow: HTMLElement): void {
        removeClass([selectedRow], 'e-active');
        selectedRow.removeAttribute('aria-selected');
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
    /**
     * @returns {void} .
     * @private
     */
    public hidePopUp(): void {
        if (this.openPopup) {
            (<HTMLElement>document.getElementsByClassName('e-ganttpopup')[0]).style.display = 'none';
            this.openPopup = false;
        } else {
            (<HTMLElement>document.getElementsByClassName('e-gridpopup')[0]).style.display = 'none';
        }
    }

    private popUpClickHandler(e: MouseEvent): void {
        const target: Element = e.target as Element;
        const grid: Grid = this.parent.treeGrid.grid;
        const $popUpElemet: Element = closest(target, '.e-ganttpopup') ?
            closest(target, '.e-ganttpopup') : closest(target, '.e-gridpopup');
        if ($popUpElemet) {
            const spanElement: Element = $popUpElemet.querySelector('.' + 'e-rowselect');
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
            const $tr: Element = closest(target, '.e-rowcell');
            if ($tr && ((this.selectedRowIndexes.length === 0 && this.parent.selectionSettings.mode === 'Row') ||
                        (this.getCellSelectedRecords().length === 0 && this.parent.selectionSettings.mode === 'Cell'))) {
                this.hidePopUp();
            }
        }
        if (grid) {
            setValue('enableSelectMultiTouch', this.enableSelectMultiTouch, grid.selectionModule);
        }
    }

    /**
     * Handles the mouse up event on taskbar or row elements in the Gantt chart.
     * @param {PointerEvent} e - The pointer event from the mouseup action.
     * @returns {void}
     * @private
     */
    private mouseUpHandler(e: PointerEvent): void {
        let isTaskbarEdited: boolean = false;
        const elements: NodeListOf<Element> = document.querySelectorAll('.e-drag-item');
        let targetElement: Element = null;
        if ((e.target as Element).closest('.e-rowcell')) {
            targetElement = e.target as HTMLElement;
        } else if ((e.target as Element).closest('.e-chart-row')) {
            targetElement = (e.target as Element).closest('.e-left-label-container') ||
                (e.target as Element).closest('.e-taskbar-main-container') || (e.target as Element).closest('.e-right-label-container');
        }
        // Set focus to the target element if focus module is available
        if (this.parent.focusModule) {
            this.parent.focusModule.setActiveElement(targetElement as HTMLElement);
        }
        // Check if taskbar editing is allowed and if it has been dragged or tapped
        if (this.parent.editModule && this.parent.editSettings.allowTaskbarEditing && this.parent.editModule.taskbarEditModule) {
            const taskbarEdit: TaskbarEdit = this.parent.editModule.taskbarEditModule;
            if (taskbarEdit.isMouseDragged || taskbarEdit.tapPointOnFocus) {
                isTaskbarEdited = true;
            }
        }
        // Proceed with selection or popup logic only if the taskbar is not edited
        if (!isTaskbarEdited && this.parent.element.contains(e.target as Node) && !(elements.length === 1)) {
            const parent: Element = parentsUntil(e.target as Element, 'e-chart-row');
            const targetEl: HTMLElement = e.target as HTMLElement;
            const isSelected: boolean =
                targetEl.classList.contains('e-rowcell') ||
                (targetEl.closest('td.e-rowcell') &&
                targetEl.closest('td.e-rowcell').classList.contains('e-rowcell')) ||
                targetEl.classList.contains('e-row') ||
                (targetEl.parentElement &&
                targetEl.parentElement.classList.contains('e-checkbox-wrapper')) ||  // Checkbox class
                targetEl.classList.contains('e-treegridexpand') ||
                targetEl.classList.contains('e-treegridcollapse') || !isNullOrUndefined(parent);
            this.popUpClickHandler(e);
            if (this.parent.selectionSettings.mode !== 'Cell' && isSelected) {
                if (closest((e.target as Element), 'tr.e-chart-row')) {
                    if (this.parent.enableVirtualization) {
                        this.parent.treeGrid.grid.selectionModule.isInteracted = true;
                    }
                    this.parent.treeGrid['isFromChartSide'] = true;
                    this.highlightSelectedRows(e, true);
                } else {
                    this.parent.treeGrid['isFromChartSide'] = false;
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
     * To add class for selected records in virtualization mode.
     *
     * @param {number} i .
     * @returns {void} .
     * @hidden
     */
    public maintainSelectedRecords(i: number): void {
        const index: number =  this.parent.selectionModule.getSelectedRowIndexes().indexOf(i);
        if (index > -1) {
            this.addRemoveClass([i]);
        }
    }
    /**
     * To destroy the selection module.
     *
     * @returns {void} .
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
