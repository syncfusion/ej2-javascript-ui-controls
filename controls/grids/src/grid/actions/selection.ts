import { Browser, EventHandler, MouseEventArgs, createElement } from '@syncfusion/ej2-base';
import { isNullOrUndefined, isUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
import { remove, closest, select } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
import {
    IGrid, IAction, IIndex, ISelectedCell, IPosition, IRenderer, NotifyArgs, CellFocusArgs,
    BeforeAutoFillEventArgs, RowDeselectingEventArgs
} from '../base/interface';
import { SelectionSettings } from '../base/grid';
import { setCssInGridPopUp, getPosition, isGroupAdaptive, addRemoveActiveClasses, removeAddCboxClasses, getCellFromRow } from '../base/util';
import { getCellsByTableName, parentsUntil, getScrollBarWidth } from '../base/util';
import * as events from '../base/constant';
import { RenderType, CheckState } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { Data } from '../actions/data';
import { ReturnType } from '../base/type';
import { FocusStrategy } from '../services/focus-strategy';
import { iterateExtend, setChecked, isComplexField , getObject } from '../base/util';
import { ColumnDeselectEventArgs, ColumnSelectEventArgs, ColumnSelectingEventArgs } from '../base/interface';
import { addRemoveEventListener } from '../base/util';
import * as literals from '../base/string-literals';

/**
 * The `Selection` module is used to handle cell and row selection.
 */
export class Selection implements IAction {
    //Internal letiables
    /**
     * @hidden
     */
    public selectedRowIndexes: number[] = [];
    /**
     * @hidden
     */
    public selectedRowCellIndexes: ISelectedCell[] = [];
    /**
     * @hidden
     */
    public selectedRecords: Element[] = [];
    /**
     * @hidden
     */
    public isRowSelected: boolean;
    /**
     * @hidden
     */
    public isCellSelected: boolean;
    /**
     * @hidden
     */
    public preventFocus: boolean = false;
    /**
     * @hidden
     */
    public prevRowIndex: number;
    /**
     *  @hidden
     */
    public selectedColumnsIndexes: number[] = [];
    public isColumnSelected: boolean;
    public gridCurrentRecord: Object[];
    private prevColIndex: number;
    public checkBoxState: boolean = false;
    private selectionSettings: SelectionSettings;
    private prevCIdxs: IIndex;
    private prevECIdxs: IIndex;
    private isMultiShiftRequest: boolean = false;
    private isMultiCtrlRequest: boolean = false;
    private isMultiCtrlRequestCell: boolean = false;
    private enableSelectMultiTouch: boolean = false;
    private clearRowCheck: boolean = false;
    private selectRowCheck: boolean = false;
    private element: HTMLElement;
    private autofill: HTMLElement;
    private isAutoFillSel: boolean;
    private startCell: Element;
    private endCell: Element;
    private startAFCell: Element;
    private endAFCell: Element;
    private startIndex: number;
    private startCellIndex: number;
    private startDIndex: number;
    private startDCellIndex: number;
    private currentIndex: number;
    private isDragged: boolean;
    private isCellDrag: boolean;
    private x: number;
    private y: number;
    private target: Element;
    private actualTarget: Element;
    private factory: RendererFactory;
    private contentRenderer: IRenderer;
    private checkedTarget: HTMLInputElement;
    private primaryKey: string;
    private chkField: string;
    /**
     * @hidden
     */
    public selectedRowState: { [key: number]: boolean } = {};
    private unSelectedRowState: { [key: number]: boolean } = {};
    private totalRecordsCount: number = 0;
    private chkAllCollec: Object[] = [];
    private isCheckedOnAdd: boolean = false;
    private persistSelectedData: Object[] = [];
    private virtualSelectedData: Object[] = [];
    private deSelectedData: Object[] = [];
    private onDataBoundFunction: Function;
    private actionBeginFunction: Function;
    private actionCompleteFunction: Function;
    private actionCompleteFunc: Function;
    private resizeEndFn: Function;
    private mUPTarget: Element;
    private bdrElement: HTMLElement;
    private selectDirection: string;
    private mcBdrElement: HTMLElement;
    private frcBdrElement: HTMLElement;
    private fhBdrElement: HTMLElement;
    private mhBdrElement: HTMLElement;
    private frhBdrElement: HTMLElement;
    private bdrAFLeft: HTMLElement;
    private bdrAFRight: HTMLElement;
    private bdrAFTop: HTMLElement;
    private bdrAFBottom: HTMLElement;
    /** @hidden */
    public isInteracted: boolean;
    private isHeaderCheckboxClicked: boolean;
    private checkSelectAllClicked: boolean;
    private isHdrSelectAllClicked: boolean = false;
    private isRowClicked: boolean;
    private needColumnSelection: boolean = false;
    /**
     * @hidden
     */
    public index: number;
    private toggle: boolean;
    private data: Object;
    private removed: boolean;
    //Module declarations
    private parent: IGrid;
    private focus: FocusStrategy;
    private isCancelDeSelect: boolean = false;
    private isPreventCellSelect: boolean = false;
    private disableUI: boolean = false;
    private isPersisted: boolean = false;
    private cmdKeyPressed: boolean = false;
    private isMacOS: boolean;
    private cellselected: boolean = false;
    private isMultiSelection: boolean = false;
    private isAddRowsToSelection: boolean = false;
    private initialRowSelection: boolean = false;
    private isPrevRowSelection: boolean = false;
    private isKeyAction: boolean = false;
    private isRowDragSelected: boolean = false;
    private evtHandlers: { event: string, handler: Function }[];
    public isPartialSelection: boolean = false;
    private rmtHdrChkbxClicked: boolean = false;
    private isCheckboxReset: boolean = false;
    private isRowDeselect: boolean = false;
    /**
     * @hidden
     */
    public autoFillRLselection: boolean = true;
    private mouseButton: number;
    private timer1: number;
    private timer2: number;
    private isFocusLastCell: boolean = false;

    /**
     * Constructor for the Grid selection module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {SelectionSettings} selectionSettings - specifies the selectionsettings
     * @param {ServiceLocator} locator - specifies the ServiceLocator
     * @hidden
     */
    constructor(parent?: IGrid, selectionSettings?: SelectionSettings, locator?: ServiceLocator) {
        this.parent = parent;
        this.selectionSettings = selectionSettings;
        this.factory = locator.getService<RendererFactory>('rendererFactory');
        this.focus = locator.getService<FocusStrategy>('focus');
        this.addEventListener();
        this.wireEvents();
    }

    private initializeSelection(): void {
        this.parent.log('selection_key_missing');
        this.render();
    }

    /**
     * The function used to trigger onActionBegin
     *
     * @param {Object} args - specifies the args
     * @param {string} type - specifies the type
     * @returns {void}
     * @hidden
     */
    public onActionBegin(args: Object, type: string): void {
        this.parent.trigger(<string>type, this.fDataUpdate(args));
    }

    private fDataUpdate(args: { cellIndex?: IIndex, foreignKeyData?: Object, rowIndex?: number }): Object {
        if (!this.isMultiSelection && (!isNullOrUndefined(args.cellIndex) || !isNullOrUndefined(args.rowIndex))) {
            const rowObj: Row<Column> = this.getRowObj(isNullOrUndefined(args.rowIndex) ? isNullOrUndefined(args.cellIndex) ?
                this.currentIndex : args.cellIndex.rowIndex : args.rowIndex);
            args.foreignKeyData = rowObj.foreignKeyData;
        }
        return args;
    }

    /**
     * The function used to trigger onActionComplete
     *
     * @param {Object} args - specifies the args
     * @param {string} type - specifies the type
     * @returns {void}
     * @hidden
     */
    public onActionComplete(args: Object, type: string): void {
        this.parent.trigger(<string>type, this.fDataUpdate(args));
        this.isMultiSelection = false;
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'selection';
    }

    /**
     * To destroy the selection
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        const gridElement: Element = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.' + literals.gridHeader) && !gridElement.querySelector('.' + literals.gridContent))) { return; }
        this.hidePopUp();
        this.clearSelection();
        this.destroyAutoFillElements();
        this.removeEventListener();
        this.unWireEvents();
        EventHandler.remove(this.parent.getContent(), 'mousedown', this.mouseDownHandler);
        EventHandler.remove(this.parent.getHeaderContent(), 'mousedown', this.mouseDownHandler);
    }

    private isEditing(): boolean {
        return (this.parent.editSettings.mode === 'Normal' || (this.parent.editSettings.mode === 'Batch' && this.parent.editModule &&
            this.parent.editModule.formObj && !this.parent.editModule.formObj.validate())) &&
            (this.parent.isEdit && !this.parent.editSettings.showAddNewRow) && !this.parent.isPersistSelection;
    }

    public getCurrentBatchRecordChanges(): Object[] {
        const gObj: IGrid = this.parent;
        if (gObj.editSettings.mode === 'Batch' && gObj.editModule) {
            let currentRecords: Object[] = iterateExtend(this.parent.getCurrentViewRecords());
            currentRecords = gObj.editSettings.newRowPosition === 'Bottom' ?
                currentRecords.concat(this.parent.editModule.getBatchChanges()[literals.addedRecords]) :
                this.parent.editModule.getBatchChanges()[literals.addedRecords].concat(currentRecords);
            const deletedRecords: Object[] = this.parent.editModule.getBatchChanges()[literals.deletedRecords];
            const primaryKey: string = this.parent.getPrimaryKeyFieldNames()[0];
            for (let i: number = 0; i < (deletedRecords.length); i++) {
                for (let j: number = 0; j < currentRecords.length; j++) {
                    if (deletedRecords[parseInt(i.toString(), 10)][`${primaryKey}`] === currentRecords[parseInt(j.toString(), 10)][`${primaryKey}`]) {
                        currentRecords.splice(j, 1);
                        break;
                    }
                }
            }
            return currentRecords;
        } else if (this.parent.enableVirtualization && this.parent.groupSettings.columns.length && !this.parent.isPersistSelection) {
            const selectedGroupedData: Object[] = gObj.getCurrentViewRecords().filter((col: Column) => col['key'] === undefined);
            return selectedGroupedData;
        } else {
            return gObj.getCurrentViewRecords();
        }
    }

    /**
     * Selects a row by the given index.
     *
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @returns {void}
     */
    public selectRow(index: number, isToggle?: boolean): void {
        if (this.selectedRowIndexes.length && this.selectionSettings.enableSimpleMultiRowSelection) {
            this.addRowsToSelection([index]);
            return;
        }
        const gObj: IGrid = this.parent;
        const selectedRow: Element = gObj.getRowByIndex(index);
        const rowObj: Row<Column> = selectedRow && gObj.getRowObjectFromUID(selectedRow.getAttribute('data-uid'));
        if (this.isPartialSelection && rowObj && rowObj.isDataRow && !rowObj.isSelectable) {
            return;
        }
        let selectData: Object;
        const isRemoved: boolean = false;
        if (gObj.enableVirtualization && index > -1) {
            const e: { selectedIndex: number, isAvailable: boolean } = { selectedIndex: index, isAvailable: true };
            this.parent.notify(events.selectVirtualRow, e);
            if (selectedRow && (gObj.getRowObjectFromUID(selectedRow.getAttribute('data-uid')))) {
                selectData = gObj.getRowObjectFromUID(selectedRow.getAttribute('data-uid')).data;
            } else {
                if (e.isAvailable && !gObj.selectionSettings.persistSelection) {
                    const prevSelectedData: Object[] = this.parent.getSelectedRecords();
                    if (prevSelectedData.length > 0) {
                        this.clearRowSelection();
                    }
                }
                return;
            }
        } else {
            selectData = this.getRowObj(index).data;
        }
        if (!this.isRowType() || !selectedRow || this.isEditing()) {
            // if (this.isEditing()) {
            //     gObj.selectedRowIndex = index;
            // }
            return;
        }
        const isRowSelected: boolean = selectedRow.hasAttribute('aria-selected');
        this.activeTarget();
        if (!isToggle || !this.selectedRowIndexes.length) {
            isToggle = false;
        } else {
            const isCheckboxModeResetOnRowClick: boolean = this.selectionSettings.checkboxMode === 'ResetOnRowClick';
            const isSelectionTypeMultiple: boolean = !this.parent.isCheckBoxSelection && this.selectionSettings.type === 'Multiple';
            if ((!isCheckboxModeResetOnRowClick && !isSelectionTypeMultiple) ||
                (this.selectedRowIndexes.length === 1 && (isCheckboxModeResetOnRowClick || isSelectionTypeMultiple))) {
                isToggle = !(this.isKeyAction && this.parent.isCheckBoxSelection) ? this.selectedRowIndexes.indexOf(index) !== -1 : false;
            } else {
                isToggle = false;
            }
        }
        this.isKeyAction = false;
        let args: Object;
        const can: string = 'cancel';
        if (!isToggle) {
            args = {
                data: selectData, rowIndex: index, isCtrlPressed: this.isMultiCtrlRequest,
                isShiftPressed: this.isMultiShiftRequest, row: selectedRow,
                previousRow: gObj.getRowByIndex(this.prevRowIndex),
                previousRowIndex: this.prevRowIndex, target: this.actualTarget, cancel: false, isInteracted: this.isInteracted,
                isHeaderCheckboxClicked: this.isHeaderCheckboxClicked
            };
            this.parent.trigger(events.rowSelecting, this.fDataUpdate(args),
                                this.rowSelectingCallBack(args, isToggle, index, selectData, isRemoved, isRowSelected, can));
        } else {
            if (this.selectionSettings.checkboxMode !== 'ResetOnRowClick' && this.selectionSettings.persistSelection) {
                this.rowDeselect(events.rowDeselecting, [rowObj.index], [rowObj.data], [selectedRow], [rowObj.foreignKeyData],
                                 this.actualTarget);
                if (this.isCancelDeSelect) {
                    return;
                }
                if (!this.parent.isCheckBoxSelection) {
                    this.selectedRowIndexes = [];
                    this.selectedRecords = [];
                    this.isRowSelected = false;
                    this.selectRowIndex(-1);
                }
                this.rowDeselect(events.rowDeselected, [rowObj.index], [rowObj.data], [selectedRow], [rowObj.foreignKeyData],
                                 this.actualTarget, undefined, undefined, undefined);
            }
            this.rowSelectingCallBack(args, isToggle, index, selectData, isRemoved, isRowSelected, can)(args);
        }
    }

    private rowSelectingCallBack(args: Object, isToggle: boolean, index: number, selectData: object, isRemoved: boolean,
                                 isRowSelected: boolean, can: string): Function {
        return (args: Object) => {
            if (!isNullOrUndefined(args) && args[`${can}`] === true) {
                this.disableInteracted();
                return;
            }
            this.index = index; this.toggle = isToggle; this.data = selectData; this.removed = isRemoved;
            if (isRowSelected && this.selectionSettings.persistSelection && !(this.selectionSettings.checkboxMode === 'ResetOnRowClick')) {
                this.clearSelectedRow(index);
                this.selectRowCallBack();
            } else if (!isRowSelected && this.selectionSettings.persistSelection && this.parent.isCheckBoxSelection &&
                this.selectionSettings.checkboxMode !== 'ResetOnRowClick') {
                this.selectRowCallBack();
            }
            if (this.selectionSettings.checkboxMode === 'ResetOnRowClick') {
                this.isCheckboxReset = true;
                this.clearSelection();
            }
            if (!this.selectionSettings.persistSelection || this.selectionSettings.checkboxMode === 'ResetOnRowClick' ||
                (!this.parent.isCheckBoxSelection && this.selectionSettings.persistSelection)) {
                this.selectRowCheck = true;
                this.clearRow();
            }
        };
    }

    private selectRowCallBack(): void {
        const gObj: IGrid = this.parent;
        let args: Object;
        const index: number = this.index;
        const isToggle: boolean = this.toggle;
        const selectData: Object = this.data;
        const isRemoved: boolean = this.removed;
        const selectedRow: Element = gObj.getRowByIndex(index);
        if (!isToggle && !isRemoved) {
            if (this.selectedRowIndexes.indexOf(index) <= -1) {
                this.updateRowSelection(selectedRow, index);
            }
            this.selectRowIndex(index);
        }
        if (!isToggle) {
            args = {
                data: selectData, rowIndex: index,
                row: selectedRow, previousRow: gObj.getRowByIndex(this.prevRowIndex),
                previousRowIndex: this.prevRowIndex, target: this.actualTarget, isInteracted: this.isInteracted,
                isHeaderCheckBoxClicked: this.isHeaderCheckboxClicked, rowIndexes : index
            };
            this.onActionComplete(args, events.rowSelected);
        }
        this.isInteracted = false;
        this.updateRowProps(index);
    }

    /**
     * Selects a range of rows from start and end row indexes.
     *
     * @param  {number} startIndex - Specifies the start row index.
     * @param  {number} endIndex - Specifies the end row index.
     * @returns {void}
     */
    public selectRowsByRange(startIndex: number, endIndex?: number): void {
        this.selectRows(this.getCollectionFromIndexes(startIndex, endIndex));
        this.selectRowIndex(endIndex);
    }

    private selectedDataUpdate(selectedData?: Object[], foreignKeyData?: Object[], selectedRows?: Element[], rowIndexes?: number[],
                               selectableRowIndex?: number[]): void {
        for (let i: number = 0, len: number = rowIndexes.length; i < len; i++) {
            let currentRow: Element = this.parent.getDataRows()[rowIndexes[parseInt(i.toString(), 10)]];
            if (this.parent.enableVirtualization) {
                currentRow = this.parent.getRowByIndex(rowIndexes[parseInt(i.toString(), 10)]);
            }
            const rowObj: Row<Column> = this.getRowObj(currentRow);
            if (rowObj && rowObj.isDataRow && rowObj.isSelectable) {
                selectedData.push(rowObj.data);
                selectedRows.push(currentRow);
                foreignKeyData.push(rowObj.foreignKeyData);
            } else {
                if (this.isPartialSelection && selectableRowIndex) {
                    selectableRowIndex.splice(selectableRowIndex.indexOf(rowIndexes[parseInt(i.toString(), 10)]), 1);
                }
            }
        }
    }

    /**
     * Selects a collection of rows by index.
     *
     * @param  {number[]} rowIndexes - Specifies an array of row indexes.
     * @returns {void}
     */
    public selectRows(rowIndexes: number[]): void {
        const gObj: IGrid = this.parent;
        const selectableRowIndex: number[] = [...rowIndexes];
        const rowIndex: number = !this.isSingleSel() ? rowIndexes[0] : rowIndexes[rowIndexes.length - 1];
        this.isMultiSelection = true;
        const selectedRows: Element[] = [];
        const foreignKeyData: Object[] = [];
        const can: string = 'cancel';
        const selectedData: Object[] = [];
        if (!this.isRowType() || this.isEditing()) {
            return;
        }
        this.selectedDataUpdate(selectedData, foreignKeyData, selectedRows, rowIndexes, selectableRowIndex);
        this.activeTarget();
        const args: Object = {
            cancel: false,
            rowIndexes: selectableRowIndex, row: selectedRows, rowIndex: rowIndex, target: this.actualTarget,
            prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
            isInteracted: this.isInteracted, isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
            data: selectedData, isHeaderCheckboxClicked: this.isHeaderCheckboxClicked, foreignKeyData: foreignKeyData
        };
        this.parent.trigger(events.rowSelecting, this.fDataUpdate(args), (args: Object) => {
            if (!isNullOrUndefined(args) && args[`${can}`] === true) {
                this.disableInteracted();
                return;
            }
            if (!(this.selectionSettings.persistSelection && gObj.allowRowDragAndDrop && this.isDragged)) {
                this.clearRow();
            }
            this.selectRowIndex(selectableRowIndex.slice(-1)[0]);
            const selectRowFn: Function = (index: number, preventFocus?: boolean) => {
                this.updateRowSelection(gObj.getRowByIndex(index), index, preventFocus);
                this.updateRowProps(rowIndex);
            };
            if (!this.isSingleSel()) {
                for (const rowIdx of selectableRowIndex) {
                    selectRowFn(rowIdx, gObj.enableVirtualization ? true : false);
                }
            } else {
                selectRowFn(rowIndex);
            }
            if (this.checkVirtualCheckBox() && !this.parent.isPersistSelection) {
                if (selectableRowIndex.length === this.totalRecordsCount) {
                    this.virtualSelectedData = this.virtualCheckBoxData().slice();
                    this.selectedRowIndexes = Object.keys(this.virtualSelectedData).map((key: string) => parseInt(key, 10));
                    this.setCheckAllState();
                }
                else {
                    const selectionData: number[] = selectableRowIndex.filter((index: number) =>
                        this.selectedRowIndexes.indexOf(index) === -1);
                    if (selectionData.length > 0) {
                        const allData: Object[] = this.virtualCheckBoxData().slice();
                        for (let i: number = 0; i < selectionData.length; i++){
                            const record: Object = allData[selectionData[i as number]];
                            if (!isNullOrUndefined(record)) {
                                this.virtualSelectedData.push(record);
                                this.selectedRowIndexes.push(selectionData[i as number]);
                            }
                        }
                        this.setCheckAllState();
                    }
                }
            }
            args = {
                rowIndexes: selectableRowIndex, row: selectedRows, rowIndex: rowIndex, target: this.actualTarget,
                prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
                data: this.getSelectedRecords(), isInteracted: this.isInteracted,
                isHeaderCheckboxClicked: this.isHeaderCheckboxClicked, foreignKeyData: foreignKeyData
            };
            if (this.isRowSelected) {
                this.onActionComplete(args, events.rowSelected);
            }
            this.isInteracted = false;
        });
    }

    /**
     * Select rows with existing row selection by passing row indexes.
     *
     * @param {number} rowIndexes - Specifies the row indexes.
     * @returns {void}
     * @hidden
     */
    public addRowsToSelection(rowIndexes: number[]): void {
        const gObj: IGrid = this.parent;
        const can: string = 'cancel';
        const target: Element = this.target;
        this.isMultiSelection = true;
        const selectedRows: Element[] = [];
        const foreignKeyData: Object[] = [];
        const selectedData: Object[] = [];
        const indexes: number[] = gObj.getSelectedRowIndexes().concat(rowIndexes);
        const selectedRow: Element = !this.isSingleSel() ? gObj.getRowByIndex(rowIndexes[0]) :
            gObj.getRowByIndex(rowIndexes[rowIndexes.length - 1]);
        if ((!this.isRowType() || this.isEditing()) && !this.selectionSettings.checkboxOnly) {
            return;
        }
        let args: Object;
        const checkboxColumn: Column[] = this.parent.getColumns().filter((col: Column) => col.type === 'checkbox');
        if (this.isMultiCtrlRequest && !checkboxColumn.length) {
            this.selectedDataUpdate(selectedData, foreignKeyData, selectedRows, indexes);
        }
        for (const rowIndex of rowIndexes) {
            const rowObj: Row<Column> = this.getRowObj(rowIndex);
            const isUnSelected: boolean = this.selectedRowIndexes.indexOf(rowIndex) > -1;
            if (this.isPartialSelection && rowObj && rowObj.isDataRow && !rowObj.isSelectable) {
                continue;
            }
            this.selectRowIndex(rowIndex);
            if (isUnSelected && ((checkboxColumn.length ? true : this.selectionSettings.enableToggle) || this.isMultiCtrlRequest)) {
                this.isAddRowsToSelection = true;
                this.rowDeselect(events.rowDeselecting, [rowIndex], [rowObj.data], [selectedRow], [rowObj.foreignKeyData], target);
                if (this.isCancelDeSelect) {
                    return;
                }
                if (this.checkVirtualCheckBox() && !this.parent.isPersistSelection) {
                    this.virtualSelectedData.splice(this.virtualSelectedData.indexOf(rowObj.data), 1);
                }
                this.selectedRowIndexes.splice(this.selectedRowIndexes.indexOf(rowIndex), 1);
                this.selectedRecords.splice(this.selectedRecords.indexOf(selectedRow), 1);
                this.selectRowIndex(this.selectedRowIndexes.length ? this.selectedRowIndexes[this.selectedRowIndexes.length - 1] : -1);
                selectedRow.removeAttribute('aria-selected');
                this.addRemoveClassesForRow(selectedRow, false, null, 'e-selectionbackground', 'e-active');
                this.rowDeselect(events.rowDeselected, [rowIndex], [rowObj.data], [selectedRow],
                                 [rowObj.foreignKeyData], target, undefined, undefined, undefined);
                this.isInteracted = false;
                this.isMultiSelection = false;
                this.isAddRowsToSelection = false;
                this.isHdrSelectAllClicked = false;
            } else {
                this.activeTarget();
                args = {
                    cancel: false,
                    data: selectedData.length ? selectedData : rowObj.data, rowIndex: rowIndex, row: selectedRows.length ? selectedRows :
                        selectedRow, target: this.actualTarget, prevRow: gObj.getRows()[this.prevRowIndex],
                    previousRowIndex: this.prevRowIndex, isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
                    foreignKeyData: foreignKeyData.length ? foreignKeyData : rowObj.foreignKeyData, isInteracted: this.isInteracted,
                    isHeaderCheckboxClicked: this.isHeaderCheckboxClicked, rowIndexes: indexes
                };
                this.parent.trigger(events.rowSelecting, this.fDataUpdate(args));
                if (!isNullOrUndefined(args) && args[`${can}`] === true) {
                    this.disableInteracted();
                    return;
                }
                if (this.isSingleSel()) {
                    this.clearRow();
                }
                this.updateRowSelection(selectedRow, rowIndex);
            }
            if (!isUnSelected) {
                args = {
                    data: selectedData.length ? selectedData : rowObj.data, rowIndex: rowIndex, row: selectedRows.length ? selectedRows :
                        selectedRow, target: this.actualTarget, prevRow: gObj.getRows()[this.prevRowIndex],
                    previousRowIndex: this.prevRowIndex, foreignKeyData: foreignKeyData.length ? foreignKeyData : rowObj.foreignKeyData,
                    isInteracted: this.isInteracted, isHeaderCheckboxClicked: this.isHeaderCheckboxClicked, rowIndexes: indexes
                };
                this.onActionComplete(args, events.rowSelected);
            }
            this.isInteracted = false;
            this.updateRowProps(rowIndex);
            if (this.isSingleSel()) {
                break;
            }
        }
    }

    private getCollectionFromIndexes(startIndex: number, endIndex: number): number[] {
        const indexes: number[] = [];
        // eslint-disable-next-line prefer-const
        let { i, max }: { i: number, max: number } = (startIndex <= endIndex) ?
            { i: startIndex, max: endIndex } : { i: endIndex, max: startIndex };
        for (; i <= max; i++) {
            indexes.push(i);
        }
        if (startIndex > endIndex) {
            indexes.reverse();
        }
        return indexes;
    }

    private clearRow(): void {
        this.clearRowCheck = true;
        this.clearRowSelection();
    }

    private clearRowCallBack(): void {
        if (this.isCancelDeSelect && this.parent.checkAllRows !== 'Check') {
            return;
        }
        this.selectedRowIndexes = [];
        this.selectedRecords = [];
        this.selectRowIndex(-1);
        if (this.isSingleSel() && this.parent.isPersistSelection) {
            this.selectedRowState = {};
        }
    }

    private clearSelectedRow(index: number): void {
        if (this.toggle) {
            const selectedEle: Element = this.parent.getRowByIndex(index);
            if (!this.disableUI) {
                selectedEle.removeAttribute('aria-selected');
                this.addRemoveClassesForRow(selectedEle, false, true, 'e-selectionbackground', 'e-active');
            }
            this.removed = true;
            this.updatePersistCollection(selectedEle, false);
            this.updateCheckBoxes(selectedEle);
            this.selectedRowIndexes.splice(this.selectedRowIndexes.indexOf(index), 1);
            this.selectedRecords.splice(this.selectedRecords.indexOf(this.parent.getRowByIndex(index)), 1);
        }
    }


    private updateRowProps(startIndex: number): void {
        this.prevRowIndex = startIndex;
        this.isRowSelected = this.selectedRowIndexes.length && true;
    }

    private getPkValue(pkField: string, data: object): string{
        return pkField ? isComplexField(pkField) ? getObject(pkField, data) : data[`${pkField}`] : data[`${pkField}`];
    }

    private updatePersistCollection(selectedRow: Element, chkState: boolean): void {
        if ((this.parent.isPersistSelection || this.parent.selectionSettings.persistSelection &&
            this.parent.getPrimaryKeyFieldNames().length > 0) && !isNullOrUndefined(selectedRow)) {
            if (!this.parent.isPersistSelection) {
                this.ensureCheckboxFieldSelection();
            }
            const rowObj: Row<Column> = this.getRowObj(selectedRow);
            const pKey: string = rowObj.data ? this.getPkValue(this.primaryKey, rowObj.data) : null;
            if (pKey === null) { return; }
            rowObj.isSelected = chkState;
            if ((chkState && !this.isPartialSelection) || (this.isPartialSelection && rowObj.isSelectable && rowObj.isSelected)) {
                this.selectedRowState[`${pKey}`] = chkState;
                delete (this.unSelectedRowState[`${pKey}`]);
                if (!this.persistSelectedData.some((data: Object) => this.getPkValue(this.primaryKey, data) === pKey)) {
                    this.persistSelectedData.push(rowObj.data);
                }
            } else {
                this.updatePersistDelete(pKey);
            }
        }
    }

    private updatePersistDelete(pKey: string, isPartialSelection?: boolean): void {
        delete (this.selectedRowState[`${pKey}`]);
        if (this.rmtHdrChkbxClicked) {
            this.unSelectedRowState[`${pKey}`] = true;
        }
        let index: number;
        const isPresent: boolean = this.persistSelectedData.some((data: Object, i: number) => {
            index = i;
            return this.getPkValue(this.primaryKey, data) === pKey;
        });
        if (isPresent) {
            this.persistSelectedData.splice(index, 1);
            if (isPartialSelection) {
                this.parent.partialSelectedRecords.splice(index, 1);
            }
        }
    }
    private updateCheckBoxes(row: Element, chkState?: boolean, rowIndex?: number): void {
        if (!isNullOrUndefined(row)) {
            const chkBox: HTMLInputElement = row.querySelector('.e-checkselect') as HTMLInputElement;
            if (!isNullOrUndefined(chkBox)) {
                removeAddCboxClasses(chkBox.nextElementSibling as HTMLElement, chkState);
                setChecked(chkBox, chkState);
                if (isNullOrUndefined(this.checkedTarget) || (!isNullOrUndefined(this.checkedTarget)
                    && !this.checkedTarget.classList.contains('e-checkselectall'))) {
                    this.setCheckAllState(rowIndex);
                }
            }
        }
    }

    private updateRowSelection(selectedRow: Element, startIndex: number, preventFocus?: boolean): void {
        if (!selectedRow) {
            return;
        }
        if (this.selectedRowIndexes.indexOf(startIndex) === -1) {
            if (this.checkVirtualCheckBox() && !this.parent.isPersistSelection) {
                this.virtualSelectedData.push(this.parent.getRowObjectFromUID(selectedRow.getAttribute('data-uid')).data);
            }
            this.selectedRowIndexes.push(startIndex);
            this.selectedRecords.push(selectedRow);
        }
        selectedRow.setAttribute('aria-selected', 'true');
        this.updatePersistCollection(selectedRow, true);
        this.updateCheckBoxes(selectedRow, true);
        this.addRemoveClassesForRow(selectedRow, true, null, 'e-selectionbackground', 'e-active');
        if (!this.preventFocus || this.parent.isFocusFirstCell || this.isFocusLastCell) {
            let target: Element = this.focus.getPrevIndexes().cellIndex ?
                (<HTMLTableRowElement>selectedRow).cells[this.focus.getPrevIndexes().cellIndex] :
                selectedRow.querySelector('.e-selectionbackground:not(.e-hide, .e-detailrowcollapse, .e-detailrowexpand, .e-rowdragdrop)');
            if (this.parent.contextMenuModule && this.mouseButton === 2) {
                target = this.parent.contextMenuModule.cell;
            }
            if (this.parent.isFocusFirstCell || this.isFocusLastCell) {
                this.parent.isFocusFirstCell = false;
                const selector: string = this.isFocusLastCell ? 'last-child' : 'first-child';
                target = selectedRow.querySelector('.e-selectionbackground.e-rowcell:not(.e-hide, .e-detailrowcollapse, .e-detailrowexpand, .e-rowdragdrop, .e-gridchkbox):' + selector);
                this.isFocusLastCell = false;
            }
            if (!target || preventFocus) { return; }
            this.focus.onClick({ target }, true, !(this.parent.contextMenuModule && this.mouseButton === 2));
        }
    }

    /**
     * Deselects the currently selected rows and cells.
     *
     * @returns {void}
     */
    public clearSelection(): void {
        this.checkSelectAllClicked = true;
        if (this.selectionSettings.persistSelection && this.persistSelectedData.length) {
            this.deSelectedData = iterateExtend(this.persistSelectedData);
        }
        if (!this.parent.isPersistSelection || (this.parent.isPersistSelection && !this.parent.isEdit) ||
            (!isNullOrUndefined(this.checkedTarget) && this.checkedTarget.classList.contains('e-checkselectall'))) {
            const span: Element = this.parent.element.querySelector('.e-gridpopup').querySelector('span');
            if (span.classList.contains('e-rowselect')) {
                span.classList.remove('e-spanclicked');
            }
            if (this.parent.isPersistSelection) {
                this.persistSelectedData = [];
                this.selectedRowState = {};
                this.parent.partialSelectedRecords = [];
                this.parent.disableSelectedRecords = [];
                const rowObjects: Row<Column>[] = this.parent.getRowsObject();
                for ( let i: number = 0; i < rowObjects.length; i++ ) {
                    if (rowObjects[i as number].isDataRow) {
                        if (rowObjects[i as number].isSelectable) {
                            this.parent.partialSelectedRecords.push(rowObjects[i as number].data);
                        } else {
                            this.parent.disableSelectedRecords.push(rowObjects[i as number].data);
                        }
                    }
                }
            }
            this.clearRowSelection();
            this.clearCellSelection();
            this.clearColumnSelection();
            this.prevRowIndex = undefined;
            this.prevCIdxs = undefined;
            this.prevECIdxs = undefined;
            this.enableSelectMultiTouch = false;
            if (!(this.selectionSettings.checkboxMode === 'ResetOnRowClick' && this.target &&  parentsUntil(this.target, 'e-rowcell'))) {
                this.isInteracted = false;
            }
            this.checkSelectAllClicked = false;
            this.isHdrSelectAllClicked = false;
        }
    }

    /**
     * Deselects the currently selected rows.
     *
     * @returns {void}
     */
    public clearRowSelection(): void {
        if (this.isRowSelected) {
            const rows: Element[] = this.parent.getDataRows();
            const data: Object[] = [];
            const row: Element[] = [];
            const rowIndex: number[] = [];
            const foreignKeyData: Object[] = [];
            const target: Element = this.target;
            this.isRowDeselect = true;

            for (let i: number = 0, len: number = this.selectedRowIndexes.length; i < len; i++) {
                let currentRow: Element;
                if (this.parent.enableVirtualization || (this.parent.enableInfiniteScrolling
                    && this.parent.infiniteScrollSettings.enableCache)) {
                    currentRow = this.parent.getRowByIndex(this.selectedRowIndexes[parseInt(i.toString(), 10)]);
                }
                else {
                    currentRow = this.parent.editSettings.mode === 'Batch' ?
                        this.parent.getRows()[this.selectedRowIndexes[parseInt(i.toString(), 10)]]
                        : this.parent.getDataRows()[this.selectedRowIndexes[parseInt(i.toString(), 10)]];
                }
                const rowObj: Row<Column> = this.getRowObj(currentRow);
                if (rowObj) {
                    data.push(rowObj.data);
                    row.push(currentRow);
                    rowIndex.push(this.selectedRowIndexes[parseInt(i.toString(), 10)]);
                    foreignKeyData.push(rowObj.foreignKeyData);
                }
            }
            if (this.selectionSettings.persistSelection && this.selectionSettings.checkboxMode !== 'ResetOnRowClick') {
                this.isRowClicked = this.checkSelectAllClicked ? true : false;
            }
            this.rowDeselect(events.rowDeselecting, rowIndex, data, row, foreignKeyData, target, null,
                             () => {
                                 if (this.isCancelDeSelect && (this.isRowClicked || this.checkSelectAllClicked || (this.isInteracted &&
                        !this.parent.isPersistSelection))) {
                                     if (this.parent.isPersistSelection) {
                                         if (this.getCheckAllStatus(this.parent.element.querySelector('.e-checkselectall')) === 'Intermediate' || this.parent.isPersistSelection) {
                                             for (let i: number = 0; i < this.selectedRecords.length; i++) {
                                                 this.updatePersistCollection(this.selectedRecords[parseInt(i.toString(), 10)], true);
                                             }
                                         } else {
                                             this.parent.checkAllRows = 'Check';
                                             this.updatePersistSelectedData(true);
                                         }
                                     }
                                     if (this.clearRowCheck) {
                                         this.clearRowCallBack();
                                         this.clearRowCheck = false;
                                         if (this.selectRowCheck) {
                                             this.selectRowCallBack();
                                             this.selectRowCheck = false;
                                         }
                                     }
                                     return;
                                 }
                                 const element: HTMLElement[] = [].slice.call(rows.filter((record: HTMLElement) => record.hasAttribute('aria-selected')));
                                 for (let j: number = 0; j < element.length; j++) {
                                     if (!this.disableUI) {
                                         element[parseInt(j.toString(), 10)].removeAttribute('aria-selected');
                                         this.addRemoveClassesForRow(element[parseInt(j.toString(), 10)], false, true, 'e-selectionbackground', 'e-active');
                                     }
                                     // tslint:disable-next-line:align
                                     if (!this.isPrevRowSelection) {
                                         this.updatePersistCollection(element[parseInt(j.toString(), 10)], false);
                                     }
                                     this.updateCheckBoxes(element[parseInt(j.toString(), 10)]);
                                 }
                                 if ((this.parent.enableVirtualization || (this.parent.enableInfiniteScrolling
                                    && this.parent.infiniteScrollSettings.enableCache)) && this.selectedRecords.length && !element.length
                                    && !this.parent.selectionSettings.persistSelection && !this.disableUI
                                    && !this.parent.isCheckBoxSelection) {
                                     this.addRemoveClassesForRow(null, false, true);
                                 }
                                 this.virtualSelectedData = [];
                                 this.selectedRowIndexes = [];
                                 this.selectedRecords = [];
                                 this.isRowSelected = false;
                                 this.selectRowIndex(-1);
                                 this.isPrevRowSelection = false;
                                 this.rowDeselect(
                                     events.rowDeselected, rowIndex, data, row, foreignKeyData,
                                     target, null, undefined, null
                                 );
                                 if (this.clearRowCheck) {
                                     this.clearRowCallBack();
                                     this.clearRowCheck = false;
                                     if (this.selectRowCheck) {
                                         this.selectRowCallBack();
                                         this.selectRowCheck = false;
                                     }
                                 }
                             },
                             null
            );
            this.isRowDeselect = false;
        } else {
            if (this.clearRowCheck) {
                this.clearRowCallBack();
                this.clearRowCheck = false;
                if (this.selectRowCheck) {
                    this.selectRowCallBack();
                    this.selectRowCheck = false;
                }
            }
        }
    }

    private rowDeselect(
        type: string, rowIndex: number[], data: Object, row: Element[],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        foreignKeyData: Object[], target: Element, mRow?: Element[], rowDeselectCallBack?: Function, frozenRightRow?: Element[]): void {
        if ((this.selectionSettings.persistSelection && (this.isRowClicked || !this.isRowDeselect || this.checkSelectAllClicked || (this.focus['activeKey'] &&
            this.focus.currentInfo.element.classList.contains('e-gridchkbox') && this.focus['activeKey'] === 'space'))) ||
            !this.selectionSettings.persistSelection) {
            const cancl: string = 'cancel';
            const isSingleDeSel: boolean = rowIndex.length === 1 && this.deSelectedData.length === 1;
            const rowDeselectObj: RowDeselectingEventArgs = {
                rowIndex: rowIndex[0], data: this.selectionSettings.persistSelection && (this.parent.checkAllRows === 'Uncheck' &&
                    !isSingleDeSel) && this.selectionSettings.checkboxMode !== 'ResetOnRowClick' ? this.deSelectedData : data,
                foreignKeyData: foreignKeyData, cancel: false, isInteracted: this.isInteracted,
                isHeaderCheckboxClicked: this.isHeaderCheckboxClicked
            };
            if (type === 'rowDeselected') {
                delete rowDeselectObj.cancel;
            }
            const rowInString: string = 'row';
            const target: string = 'target';
            const rowidx: string = 'rowIndex';
            const rowidxex: string = 'rowIndexes';
            const dataTxt: string = 'data';
            const foreignKey: string = 'foreignKeyData';
            rowDeselectObj[`${rowInString}`] = row;
            rowDeselectObj[`${target}`] = this.actualTarget;
            const isHeaderCheckBxClick: boolean = this.actualTarget && !isNullOrUndefined(closest(this.actualTarget, 'thead'));
            if (isHeaderCheckBxClick || rowIndex.length > 1) {
                rowDeselectObj[`${rowidx}`] = rowIndex[0];
                rowDeselectObj[`${rowidxex}`] = rowIndex;
            } else if (rowIndex.length === 1) {
                rowDeselectObj[`${dataTxt}`] = rowDeselectObj[`${dataTxt}`][0];
                rowDeselectObj[`${rowInString}`] = rowDeselectObj[`${rowInString}`][0];
                rowDeselectObj[`${foreignKey}`] = rowDeselectObj[`${foreignKey}`][0];
                if (this.isAddRowsToSelection) {
                    rowDeselectObj[`${rowidxex}`] = rowIndex;
                }
            }
            this.parent.trigger(
                type, rowDeselectObj,
                (args: Object) => {
                    this.isCancelDeSelect = args[`${cancl}`];
                    if (!this.isCancelDeSelect || (!this.isRowClicked && !this.isInteracted && !this.checkSelectAllClicked)) {
                        this.updatePersistCollection(row[0], false);
                        this.updateCheckBoxes(row[0], undefined, rowIndex[0]);
                    }
                    if (rowDeselectCallBack !== undefined) {
                        rowDeselectCallBack();
                    }
                });
        } else if (this.selectionSettings.persistSelection && !this.isInteracted) {
            if (rowDeselectCallBack !== undefined) {
                rowDeselectCallBack();
            }
        }
    }

    private getRowObj(row: Element | number = this.currentIndex): Row<Column> {
        if (isNullOrUndefined(row)) { return {} as Row<Column>; }
        if (typeof row === 'number') {
            row = this.parent.getRowByIndex(row);
        }
        if (row) {
            return this.parent.getRowObjectFromUID(row.getAttribute('data-uid')) || {} as Row<Column>;
        }
        return {} as Row<Column>;
    }

    /**
     * Selects a cell by the given index.
     *
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @returns {void}
     */
    public selectCell(cellIndex: IIndex, isToggle?: boolean): void {
        if (!this.isCellType() || (this.isCellType() && (this.parent.enableVirtualization ||
            (this.parent.enableInfiniteScrolling && this.parent.infiniteScrollSettings.enableCache)))) { return; }
        const gObj: IGrid = this.parent;
        let args: Object;
        const selectedCell: Element = gObj.getCellFromIndex(cellIndex.rowIndex, this.getColIndex(cellIndex.rowIndex, cellIndex.cellIndex));
        this.currentIndex = cellIndex.rowIndex;
        const selectedData: Object = this.getCurrentBatchRecordChanges()[this.currentIndex];
        if (!this.isCellType() || !selectedCell || this.isEditing()) {
            return;
        }
        const isCellSelected: boolean = selectedCell.classList.contains('e-cellselectionbackground');
        isToggle = !isToggle ? isToggle : (!isUndefined(this.prevCIdxs) &&
            cellIndex.rowIndex === this.prevCIdxs.rowIndex && cellIndex.cellIndex === this.prevCIdxs.cellIndex &&
            isCellSelected);

        if (!isToggle) {
            args = {
                data: selectedData, cellIndex: cellIndex,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
                previousRowCell: this.prevECIdxs ?
                    this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined,
                cancel: false
            };
            const currentCell: string = 'currentCell';
            args[`${currentCell}`] = selectedCell;
            const previousRowCellIndex: string = 'previousRowCellIndex';
            args[`${previousRowCellIndex}`] = this.prevECIdxs;
            this.parent.trigger(
                events.cellSelecting, this.fDataUpdate(args),
                this.successCallBack(args, isToggle, cellIndex, selectedCell, selectedData));
            this.cellselected = true;
        } else {
            this.successCallBack(args, isToggle, cellIndex, selectedCell, selectedData)(args);
        }
    }

    private successCallBack(
        cellSelectingArgs: Object, isToggle: boolean, cellIndex: IIndex,
        selectedCell: Element, selectedData: Object): Function {
        return (cellSelectingArgs: Object) => {
            const cncl: string = 'cancel';
            const currentCell: string = 'currentCell';
            if (!isNullOrUndefined(cellSelectingArgs) && cellSelectingArgs[`${cncl}`] === true) {
                return;
            }
            if (!isToggle) {
                cellSelectingArgs[`${currentCell}`] = cellSelectingArgs[`${currentCell}`] ? cellSelectingArgs[`${currentCell}`] : selectedCell;
            }
            this.clearCell();
            if (!isToggle) {
                this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
            }
            if (!isToggle) {
                const args: Object = {
                    data: selectedData, cellIndex: cellIndex, currentCell: selectedCell,
                    selectedRowCellIndex: this.selectedRowCellIndexes,
                    previousRowCell: this.prevECIdxs ?
                        this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
                };
                const previousRowCellIndex: string = 'previousRowCellIndex';
                args[`${previousRowCellIndex}`] = this.prevECIdxs;
                this.updateCellProps(cellIndex, cellIndex);
                this.onActionComplete(args, events.cellSelected);
            }
        };
    }

    private getCellIndex(rIdx: number, cIdx: number): Element {
        return this.parent.getCellFromIndex(rIdx, cIdx);
    }

    /**
     * Selects a range of cells from start and end indexes.
     *
     * @param  {IIndex} startIndex - Specifies the row and column's start index.
     * @param  {IIndex} endIndex - Specifies the row and column's end index.
     * @returns {void}
     */
    public selectCellsByRange(startIndex: IIndex, endIndex?: IIndex): void {
        if (!this.isCellType()) { return; }
        const gObj: IGrid = this.parent;
        let selectedCell: Element = this.parent.isSpan ? getCellFromRow(this.parent, startIndex.rowIndex, startIndex.cellIndex) :
            gObj.getCellFromIndex(startIndex.rowIndex, startIndex.cellIndex);
        let min: number;
        let max: number;
        const stIndex: IIndex = startIndex;
        const edIndex: IIndex = endIndex = endIndex ? endIndex : startIndex;
        let cellIndexes: number[];
        this.currentIndex = startIndex.rowIndex;
        const cncl: string = 'cancel';
        const selectedData: Object = this.getCurrentBatchRecordChanges()[this.currentIndex];
        if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
            return;
        }
        const args: Object = {
            data: selectedData, cellIndex: startIndex, currentCell: selectedCell,
            isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
            previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
        };
        const previousRowCellIndex: string = 'previousRowCellIndex';
        args[`${previousRowCellIndex}`] = this.prevECIdxs;
        this.parent.trigger(events.cellSelecting, this.fDataUpdate(args), (cellSelectingArgs: Object) => {
            if (!isNullOrUndefined(cellSelectingArgs) && cellSelectingArgs[`${cncl}`] === true) {
                return;
            }
            this.clearCell();
            if (startIndex.rowIndex > endIndex.rowIndex) {
                const temp: IIndex = startIndex;
                startIndex = endIndex;
                endIndex = temp;
            }
            for (let i: number = startIndex.rowIndex; i <= endIndex.rowIndex; i++) {
                if (this.selectionSettings.cellSelectionMode.indexOf('Box') < 0) {
                    min = i === startIndex.rowIndex ? (startIndex.cellIndex) : 0;
                    max = i === endIndex.rowIndex ? (endIndex.cellIndex) : this.getLastColIndex(i);
                } else {
                    min = startIndex.cellIndex;
                    max = endIndex.cellIndex;
                }
                cellIndexes = [];
                for (let j: number = min < max ? min : max, len: number = min > max ? min : max; j <= len; j++) {
                    selectedCell = this.parent.isSpan ? getCellFromRow(gObj, i, j) : gObj.getCellFromIndex(i, j);
                    if (!selectedCell) {
                        continue;
                    }
                    cellIndexes.push(j);
                    this.updateCellSelection(selectedCell);
                    this.addAttribute(selectedCell);
                }
                this.selectedRowCellIndexes.push({ rowIndex: i, cellIndexes: cellIndexes });
            }
            const cellSelectedArgs: Object = {
                data: selectedData, cellIndex: edIndex, currentCell: gObj.getCellFromIndex(edIndex.rowIndex, edIndex.cellIndex),
                selectedRowCellIndex: this.selectedRowCellIndexes,
                previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            };
            const previousRowCellIndex: string = 'previousRowCellIndex';
            cellSelectedArgs[`${previousRowCellIndex}`] = this.prevECIdxs;
            if (!this.isDragged) {
                this.onActionComplete(cellSelectedArgs, events.cellSelected);
                this.cellselected = true;
            }
            this.updateCellProps(stIndex, edIndex);
        });
    }

    /**
     * Selects a collection of cells by row and column indexes.
     *
     * @param  {ISelectedCell[]} rowCellIndexes - Specifies the row and column indexes.
     * @returns {void}
     */
    public selectCells(rowCellIndexes: ISelectedCell[]): void {
        if (!this.isCellType()) { return; }
        const gObj: IGrid = this.parent;
        let selectedCell: Element = gObj.getCellFromIndex(rowCellIndexes[0].rowIndex, rowCellIndexes[0].cellIndexes[0]);
        this.currentIndex = rowCellIndexes[0].rowIndex;
        const selectedData: Object = this.getCurrentBatchRecordChanges()[this.currentIndex];
        if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
            return;
        }
        const cellSelectArgs: Object = {
            data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
            currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
            isShiftPressed: this.isMultiShiftRequest,
            previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
        };
        const previousRowCellIndex: string = 'previousRowCellIndex';
        cellSelectArgs[`${previousRowCellIndex}`] = this.prevECIdxs;
        this.onActionBegin(cellSelectArgs, events.cellSelecting);
        for (let i: number = 0, len: number = rowCellIndexes.length; i < len; i++) {
            for (let j: number = 0, cellLen: number = rowCellIndexes[parseInt(i.toString(), 10)].cellIndexes.length; j < cellLen; j++) {
                selectedCell = gObj.getCellFromIndex(
                    rowCellIndexes[parseInt(i.toString(), 10)].rowIndex,
                    rowCellIndexes[parseInt(i.toString(), 10)].cellIndexes[parseInt(j.toString(), 10)]);
                if (!selectedCell) {
                    continue;
                }
                this.updateCellSelection(selectedCell);
                this.addAttribute(selectedCell);
                this.addRowCellIndex(
                    { rowIndex: rowCellIndexes[parseInt(i.toString(), 10)].rowIndex,
                        cellIndex: rowCellIndexes[parseInt(i.toString(), 10)].cellIndexes[parseInt(j.toString(), 10)] });
            }
        }
        this.updateCellProps(
            { rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] },
            { rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] });
        const cellSelectedArgs: Object = {
            data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
            currentCell: selectedCell, selectedRowCellIndex: this.selectedRowCellIndexes,
            previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
        };
        const prvRowCellIndex: string = 'previousRowCellIndex';
        cellSelectedArgs[`${prvRowCellIndex}`] = this.prevECIdxs;
        this.onActionComplete(cellSelectedArgs, events.cellSelected);
    }

    /**
     * Select cells with existing cell selection by passing row and column index.
     *
     * @param {IIndex} cellIndexes - Defines the collection of row and column index.
     * @returns {void}
     * @hidden
     */
    public addCellsToSelection(cellIndexes: IIndex[]): void {
        if (!this.isCellType() || (this.isCellType() && (this.parent.enableVirtualization ||
            (this.parent.enableInfiniteScrolling && this.parent.infiniteScrollSettings.enableCache)))) { return; }
        const gObj: IGrid = this.parent;
        let selectedCell: Element;
        let index: number;
        this.currentIndex = cellIndexes[0].rowIndex;
        const cncl: string = 'cancel';
        const selectedData: Object = this.getCurrentBatchRecordChanges()[this.currentIndex];
        if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
            return;
        }
        this.hideAutoFill();
        let rowObj: Row<Column>;
        rowObj = gObj.getRowsObject()[cellIndexes[0].rowIndex];
        if (gObj.groupSettings.columns.length > 0) {
            rowObj = gObj.getRowObjectFromUID(this.target.parentElement.getAttribute('data-uid'));
        }
        const foreignKeyData: Object[] = [];
        for (const cellIndex of cellIndexes) {
            for (let i: number = 0, len: number = this.selectedRowCellIndexes.length; i < len; i++) {
                if (this.selectedRowCellIndexes[parseInt(i.toString(), 10)].rowIndex === cellIndex.rowIndex) {
                    index = i; break;
                }
            }
            selectedCell = gObj.getCellFromIndex(cellIndex.rowIndex, this.getColIndex(cellIndex.rowIndex, cellIndex.cellIndex));
            const idx: number =  cellIndex.cellIndex;
            if (gObj.groupSettings.columns.length > 0) {
                foreignKeyData.push(rowObj.cells[idx + gObj.groupSettings.columns.length].foreignKeyData);
            }
            else {
                foreignKeyData.push(rowObj.cells[parseInt(idx.toString(), 10)].foreignKeyData);
            }
            const args: Object = {
                cancel: false, data: selectedData, cellIndex: cellIndexes[0],
                isShiftPressed: this.isMultiShiftRequest,
                currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
                previousRowCell: this.prevECIdxs ?
                    gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            };
            const prvRowCellIndex: string = 'previousRowCellIndex';
            args[`${prvRowCellIndex}`] = this.prevECIdxs;
            let isUnSelected: boolean = index > -1;
            if (isUnSelected) {
                const selectedCellIdx: number[] = this.selectedRowCellIndexes[parseInt(index.toString(), 10)].cellIndexes;
                if (selectedCellIdx.indexOf(cellIndex.cellIndex) > -1 || (this.selectionSettings.mode === 'Both' &&
                    selectedCell.classList.contains('e-gridchkbox') && !selectedCell.getAttribute('aria-selected'))) {
                    this.cellDeselect(
                        events.cellDeselecting, [{ rowIndex: cellIndex.rowIndex, cellIndexes: [cellIndex.cellIndex] }],
                        selectedData, [selectedCell], foreignKeyData);
                    selectedCellIdx.splice(selectedCellIdx.indexOf(cellIndex.cellIndex), 1);
                    if (selectedCellIdx.length === 0) {
                        this.selectedRowCellIndexes.splice(index, 1);
                    }
                    selectedCell.classList.remove('e-cellselectionbackground');
                    selectedCell.removeAttribute('aria-selected');
                    this.cellDeselect(
                        events.cellDeselected, [{ rowIndex: cellIndex.rowIndex, cellIndexes: [cellIndex.cellIndex] }],
                        selectedData, [selectedCell], foreignKeyData);
                } else {
                    isUnSelected = false;
                    this.onActionBegin(args, events.cellSelecting);
                    this.addRowCellIndex({ rowIndex: cellIndex.rowIndex, cellIndex: cellIndex.cellIndex });
                    this.updateCellSelection(selectedCell);
                    this.addAttribute(selectedCell);
                }
            } else {
                this.onActionBegin(args, events.cellSelecting);
                if (!isNullOrUndefined(args) && args[`${cncl}`] === true) {
                    return;
                }
                this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
            }
            if (!isUnSelected) {
                const cellSelectedArgs: Object = {
                    data: selectedData, cellIndex: cellIndexes[0], currentCell: selectedCell,
                    previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) :
                        undefined, selectedRowCellIndex: this.selectedRowCellIndexes
                };
                cellSelectedArgs[`${prvRowCellIndex}`] = this.prevECIdxs;
                this.onActionComplete(cellSelectedArgs, events.cellSelected);
                this.cellselected = true;
            }
            this.updateCellProps(cellIndex, cellIndex);
        }
    }

    private getColIndex(rowIndex: number, index: number): number {
        const col: Column = this.parent.getColumnByIndex(index);
        const cells: Element[] = getCellsByTableName(this.parent, col, rowIndex);
        if (cells) {
            for (let m: number = 0; m < cells.length; m++) {
                const colIndex: number = parseInt(cells[parseInt(m.toString(), 10)].getAttribute(literals.ariaColIndex), 10) - 1;
                if (colIndex === index) {
                    return m;
                }
            }
        }
        return -1;
    }

    private getLastColIndex(rowIndex: number): number {
        const cells: NodeListOf<Element> = this.parent.getDataRows()[parseInt(rowIndex.toString(), 10)].querySelectorAll('td.e-rowcell');
        return parseInt(cells[cells.length - 1].getAttribute(literals.ariaColIndex), 10) - 1;
    }

    private clearCell(): void {
        this.clearCellSelection();
    }

    private cellDeselect(type: string, cellIndexes: ISelectedCell[], data: Object, cells: Element[], foreignKeyData: Object[]): void {
        const cancl: string = 'cancel';
        if (cells && cells.length > 0) {
            for (const cell of cells) {
                if (cell && cell.classList.contains(literals.gridChkBox)) {
                    this.updateCheckBoxes(closest(cell, 'tr'));
                }
            }
        }
        const args: Object = {
            cells: cells, data: data, cellIndexes: cellIndexes, foreignKeyData: foreignKeyData, cancel: false
        };
        this.parent.trigger(type, args);
        this.isPreventCellSelect = args[`${cancl}`];
    }

    private updateCellSelection(selectedCell: Element, rowIndex?: number, cellIndex?: number): void {
        if (!isNullOrUndefined(rowIndex)) {
            this.addRowCellIndex({ rowIndex: rowIndex, cellIndex: cellIndex });
        }
        selectedCell.classList.add('e-cellselectionbackground');
        if (selectedCell.classList.contains(literals.gridChkBox)) {
            this.updateCheckBoxes(closest(selectedCell, 'tr'), true);
        }
        this.addAttribute(selectedCell);
    }

    private addAttribute(cell: Element): void {
        this.target = cell;
        if (!isNullOrUndefined(cell)) {
            cell.setAttribute('aria-selected', 'true');
            if (!this.preventFocus) {
                this.focus.onClick({ target: cell }, true, true);
            }
        }
    }

    private updateCellProps(startIndex: IIndex, endIndex: IIndex): void {
        this.prevCIdxs = startIndex;
        this.prevECIdxs = endIndex;
        this.isCellSelected = this.selectedRowCellIndexes.length && true;
    }

    private addRowCellIndex(rowCellIndex: IIndex): void {
        let isRowAvail: boolean;
        let index: number;
        for (let i: number = 0, len: number = this.selectedRowCellIndexes.length; i < len; i++) {
            if (this.selectedRowCellIndexes[parseInt(i.toString(), 10)].rowIndex === rowCellIndex.rowIndex) {
                isRowAvail = true;
                index = i;
                break;
            }
        }
        if (isRowAvail) {
            if (this.selectedRowCellIndexes[parseInt(index.toString(), 10)].cellIndexes.indexOf(rowCellIndex.cellIndex) < 0) {
                this.selectedRowCellIndexes[parseInt(index.toString(), 10)].cellIndexes.push(rowCellIndex.cellIndex);
            }
        } else {
            this.selectedRowCellIndexes.push({ rowIndex: rowCellIndex.rowIndex, cellIndexes: [rowCellIndex.cellIndex] });
        }

    }

    /**
     * Deselects the currently selected cells.
     *
     * @returns {void}
     */
    public clearCellSelection(): void {
        if (this.isCellSelected) {
            const gObj: IGrid = this.parent;
            const selectedCells: Element[] = this.getSelectedCellsElement();
            const rowCell: ISelectedCell[] = this.selectedRowCellIndexes;
            const data: Object[] = [];
            const cells: Element[] = [];
            const foreignKeyData: Object[] = [];
            const currentViewData: Object[] = this.getCurrentBatchRecordChanges();

            this.hideAutoFill();
            for (let i: number = 0, len: number = rowCell.length; i < len; i++) {
                data.push(currentViewData[rowCell[parseInt(i.toString(), 10)].rowIndex]);
                const rowObj: Row<Column> = this.getRowObj(rowCell[parseInt(i.toString(), 10)].rowIndex);
                for (let j: number = 0, cLen: number = rowCell[parseInt(i.toString(), 10)].cellIndexes.length; j < cLen; j++) {
                    if (rowObj.cells) {
                        foreignKeyData.push(rowObj.cells[rowCell[parseInt(i.toString(), 10)]
                            .cellIndexes[parseInt(j.toString(), 10)]].foreignKeyData);
                    }
                    cells.push(
                        gObj.getCellFromIndex(
                            rowCell[parseInt(i.toString(), 10)].rowIndex,
                            rowCell[parseInt(i.toString(), 10)].cellIndexes[parseInt(j.toString(), 10)]));
                }
            }
            this.cellDeselect(events.cellDeselecting, rowCell, data, cells, foreignKeyData);
            if (this.isPreventCellSelect === true) {
                return;
            }

            for (let i: number = 0, len: number = selectedCells.length; i < len; i++) {
                selectedCells[parseInt(i.toString(), 10)].classList.remove('e-cellselectionbackground');
                selectedCells[parseInt(i.toString(), 10)].removeAttribute('aria-selected');
            }
            if (this.bdrElement) {
                this.showHideBorders('none');
            }
            this.selectedRowCellIndexes = [];
            this.isCellSelected = false;
            if (!this.isDragged && this.cellselected) {
                this.cellDeselect(events.cellDeselected, rowCell, data, cells, foreignKeyData);
            }
        }
    }

    private getSelectedCellsElement(): Element[] {
        const gObj: IGrid = this.parent;
        const rows: Element[] = gObj.getDataRows();
        let cells: Element[] = [];
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            cells = cells.concat([].slice.call(rows[parseInt(i.toString(), 10)].getElementsByClassName('e-cellselectionbackground')));
        }
        return cells;
    }

    private mouseMoveHandler(e: MouseEventArgs): void {
        e.preventDefault();
        this.stopTimer();
        const gBRect: ClientRect = this.parent.element.getBoundingClientRect();
        let x1: number = this.x;
        let y1: number = this.y;
        const position: IPosition = getPosition(e);
        let x2: number = position.x - gBRect.left;
        let y2: number = position.y - gBRect.top;
        let tmp: number;
        let target: Element = closest(e.target as Element, 'tr');
        this.isDragged = true;
        if (!this.isCellDrag) {
            if (!target) {
                target = closest(document.elementFromPoint(this.parent.element.offsetLeft + 2, e.clientY), 'tr');
            }
            if (x1 > x2) {
                tmp = x2;
                x2 = x1;
                x1 = tmp;
            }
            if (y1 > y2) {
                tmp = y2;
                y2 = y1;
                y1 = tmp;
            }
            this.element.style.left = x1 + 'px';
            this.element.style.top = y1 + 'px';
            this.element.style.width = x2 - x1 + 'px';
            this.element.style.height = y2 - y1 + 'px';
        }
        if (target && !e.ctrlKey && !e.shiftKey) {
            const rowIndex: number = parseInt(target.getAttribute(literals.ariaRowIndex), 10) - 1;
            if (!this.isCellDrag) {
                this.hideAutoFill();
                this.selectRowsByRange(this.startDIndex, rowIndex);
                this.isRowDragSelected = true;
            } else {
                const td: Element = parentsUntil(e.target as HTMLElement, literals.rowCell);
                if (td) {
                    this.startAFCell = this.startCell;
                    this.endAFCell = parentsUntil(e.target as Element, literals.rowCell);
                    if (rowIndex > -1) {
                        this.selectLikeExcel(e, rowIndex, parseInt(td.getAttribute(literals.ariaColIndex), 10) - 1);
                    }
                }
            }
        }
        if (!e.ctrlKey && !e.shiftKey && !this.parent.enableVirtualization && !this.parent.enableInfiniteScrolling &&
            !this.parent.enableColumnVirtualization && !this.parent.groupSettings.columns.length && this.isCellDrag) {
            this.updateScrollPosition(e, position, this.parent.getContent());
        }
    }

    private updateScrollPosition(mouseEvent: MouseEvent | TouchEvent, position: IPosition, scrollElement: Element): void {
        const clientRect: ClientRect = scrollElement.getBoundingClientRect();
        if (clientRect.left >= position.x - 20 -
            (this.parent.enableRtl && this.parent.height !== 'auto' ? getScrollBarWidth() : 0)) {
            this.timer1 = window.setInterval(
                () => { this.setScrollPosition(scrollElement.firstElementChild, this.parent.enableRtl ? 'right' : 'left', mouseEvent); }, 200);
        } else if (clientRect.left + scrollElement.clientWidth - 20 -
            (!this.parent.enableRtl && this.parent.height !== 'auto' ? getScrollBarWidth() : 0) < position.x) {
            this.timer1 = window.setInterval(
                () => { this.setScrollPosition(scrollElement.firstElementChild, this.parent.enableRtl ? 'left' : 'right', mouseEvent); }, 200);
        }
        if (clientRect.top >= position.y - (this.parent.getRowHeight() * 0.5)) {
            this.timer2 = window.setInterval(
                () => { this.setScrollPosition(scrollElement.firstElementChild, 'up', mouseEvent); }, 200);
        } else if (clientRect.top + scrollElement.clientHeight - (this.parent.getRowHeight() * 0.5) -
            (scrollElement.firstElementChild.scrollWidth > (scrollElement.firstElementChild as HTMLElement).offsetWidth ?
                getScrollBarWidth() : 0) <= position.y) {
            this.timer2 = window.setInterval(
                () => { this.setScrollPosition(scrollElement.firstElementChild, 'down', mouseEvent); }, 200);
        }
    }

    private stopTimer(): void {
        if (this.timer1) {
            window.clearInterval(this.timer1);
            this.timer1 = null;
        }
        if (this.timer2) {
            window.clearInterval(this.timer2);
            this.timer2 = null;
        }
        this.preventFocus = false;
    }

    private setScrollPosition(scrollElement: Element, direction: string, mouseEvent?: MouseEvent | TouchEvent): void {
        let rowIndex: number = -1; let columnIndex: number = -1;
        if (this.endAFCell || this.prevECIdxs) {
            rowIndex = this.endAFCell ? parseInt(this.endAFCell.getAttribute('data-index'), 10) : this.prevECIdxs.rowIndex;
            columnIndex = this.endAFCell ? parseInt(this.endAFCell.getAttribute('aria-colindex'), 10) - 1 : this.prevECIdxs.cellIndex;
        }
        switch (direction) {
        case 'up':
            if (mouseEvent && closest(mouseEvent.target as Element, '.e-headercontent')) {return; }
            if (this.isAutoFillSel && this.startAFCell && this.selectedRowCellIndexes.length &&
                    ((this.selectedRowCellIndexes.length === 1 && this.startAFCell !== this.startCell) ||
                        (this.selectedRowCellIndexes.length > 1 && this.startAFCell.getBoundingClientRect().top > 0))) {
                rowIndex = parseInt(this.startAFCell.getAttribute('data-index'), 10);
            }
            rowIndex -= 1;
            if (this.parent.frozenRows) {rowIndex += this.parent.frozenRows + 1; }
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            rowIndex < 1 ? scrollElement.scrollTop = 0 : scrollElement.scrollTop -= (this.parent.getRowByIndex(rowIndex) as HTMLElement)
                .offsetHeight;
            break;
        case 'down':
            if (this.isAutoFillSel && this.startAFCell && this.startAFCell !== this.startCell) {
                rowIndex = parseInt(this.startAFCell.getAttribute('data-index'), 10);
            }
            if (rowIndex < this.parent.getRows().length - 1) {
                rowIndex += 1;
                if (this.isAutoFillSel && this.startAFCell && this.startAFCell !== this.startCell) {
                    this.startAFCell = this.parent.getCellFromIndex(rowIndex, this.selectedRowCellIndexes[0].cellIndexes[0]);
                }
                scrollElement.scrollTop += (this.parent.getRowByIndex(rowIndex) as HTMLElement).offsetHeight;
            } else {
                scrollElement.scrollTop = scrollElement.scrollHeight;
            }
            break;
        case 'left':
            if (columnIndex > 0 && rowIndex > -1) {
                if (this.isAutoFillSel && this.startAFCell && this.selectedRowCellIndexes.length &&
                        ((this.selectedRowCellIndexes[0].cellIndexes.length > 0 && this.startAFCell !== this.startCell) ||
                            (this.selectedRowCellIndexes[0].cellIndexes.length > 1 &&
                                ((!this.parent.enableRtl && this.startAFCell.getBoundingClientRect().left > 0) || (this.parent.enableRtl &&
                                    this.startAFCell.getBoundingClientRect().left < this.parent.element.offsetWidth))))) {
                    columnIndex = parseInt(this.startAFCell.getAttribute('aria-colindex'), 10) - 1;
                }
                const nextElement: HTMLElement = this.findNextCell(scrollElement, direction, columnIndex, rowIndex);
                columnIndex = nextElement ? parseInt(nextElement.getAttribute('aria-colindex'), 10) - 1 : -1;
                if (this.parent.enableRtl && nextElement) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    columnIndex < 1 ? scrollElement.scrollLeft = scrollElement.scrollWidth :
                        scrollElement.scrollLeft += nextElement.offsetWidth;
                } else if (nextElement) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    columnIndex < 1 ? scrollElement.scrollLeft = 0 : scrollElement.scrollLeft -= nextElement.offsetWidth;
                }
            }
            break;
        case 'right':
            if (this.isAutoFillSel && this.startAFCell && this.startAFCell !== this.startCell) {
                columnIndex = parseInt(this.startAFCell.getAttribute('aria-colindex'), 10) - 1;
            }
            // eslint-disable-next-line no-case-declarations
            const currentElement: HTMLElement = this.parent.getCellFromIndex(rowIndex, columnIndex) as HTMLElement;
            // eslint-disable-next-line no-case-declarations
            const nextElement: HTMLElement = this.findNextCell(scrollElement, direction, columnIndex, rowIndex);
            if (nextElement && this.isAutoFillSel && this.startAFCell && this.startAFCell !== this.startCell) {
                this.startAFCell = this.parent.getCellFromIndex(this.selectedRowCellIndexes[0].rowIndex, parseInt(nextElement.getAttribute('aria-colindex'), 10) - 1);
            }
            columnIndex = nextElement ? parseInt(nextElement.getAttribute('aria-colindex'), 10) - 1 : -1;
            if (this.parent.enableRtl && nextElement) {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                columnIndex < this.parent.columns.length - 1 ? scrollElement.scrollLeft -= currentElement.offsetWidth :
                    scrollElement.scrollLeft = -scrollElement.scrollWidth;
            } else if (nextElement) {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                columnIndex < this.parent.columns.length - 1 ? scrollElement.scrollLeft += currentElement.offsetWidth :
                    scrollElement.scrollLeft = scrollElement.scrollWidth;
            }
            if (this.isAutoFillSel && (columnIndex === this.parent.columns.length - 1 || columnIndex === -1) &&
                    this.startAFCell && this.endAFCell) {
                this.positionAFBorders();
                scrollElement.scrollLeft = this.parent.enableRtl ? -scrollElement.scrollWidth : scrollElement.scrollWidth;
            }
            break;
        }
        if (rowIndex > -1 && rowIndex < this.parent.getRows().length && columnIndex > -1) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mouseEvent: any = { target: this.parent.getCellFromIndex(rowIndex, columnIndex) };
            if (this.isAutoFillSel && mouseEvent.target.classList.contains('e-cellselectionbackground') &&
                ((direction === 'down' && parseInt(mouseEvent.target.getAttribute('data-index'), 10) === this.parent.getRows().length - 1) ||
                    (direction === 'right' && parseInt(mouseEvent.target.getAttribute('aria-colindex'), 10) - 1 === this.parent.columns.length - 1))) {
                return;
            }
            this.endAFCell = mouseEvent.target;
            this.preventFocus = true;
            this.selectLikeExcel(mouseEvent, rowIndex, columnIndex);
        }
    }

    private findNextCell(scrollElement: Element, direction: string, columnIndex: number, rowIndex: number): HTMLElement {
        let nextElement: HTMLElement = this.parent.getCellFromIndex(rowIndex, direction === 'left' ? columnIndex - 1 : columnIndex + 1) as HTMLElement;
        if (nextElement && nextElement.classList.contains('e-hide')) {
            const siblingEles: NodeListOf<Element> = nextElement.closest('tr').querySelectorAll('.e-rowcell:not(.e-hide)');
            const nextEleInd: number = Array.from(siblingEles).indexOf(nextElement.nextElementSibling);
            if (nextEleInd > 0 && nextEleInd < siblingEles.length - 1) {
                nextElement = (siblingEles[nextEleInd + (direction === 'left' ? -1 : 1)] as HTMLElement);
                return nextElement;
            } else {
                scrollElement.scrollLeft = 0;
                return null;
            }
        }
        return nextElement;
    }

    private selectLikeExcel(e: MouseEvent, rowIndex: number, cellIndex: number): void {
        if (!this.isAutoFillSel) {
            this.clearCellSelection();
            this.selectCellsByRange(
                { rowIndex: this.startDIndex, cellIndex: this.startDCellIndex },
                { rowIndex: rowIndex, cellIndex: cellIndex });
            this.drawBorders();
        } else { //Autofill
            this.showAFBorders();
            this.selectLikeAutoFill(e);
        }
    }


    private setFrozenBorders(parentEle: Element, border: HTMLElement, bdrStr: string): void {
        const width: string[] = border.style.borderWidth.toString().split(' ');
        const strCell: string[] = ['', 'e-leftfreeze', 'e-unfreeze', 'e-leftfreeze', 'e-unfreeze', 'e-rightfreeze', 'e-rightfreeze'];
        const cells: HTMLElement[]  = [].slice.call(parentEle.querySelectorAll('.e-cellselectionbackground' + '.' + strCell[`${bdrStr}`])).
            filter((ele: HTMLElement) => ele.style.display === '');
        const fixedCells: HTMLElement[] = [].slice.call(parentEle.querySelectorAll('.e-cellselectionbackground.e-fixedfreeze')).
            filter((ele: HTMLElement) => ele.style.display === '');
        const isRtl: boolean = this.parent.enableRtl;
        if (cells.length) {
            const firstRowIdx: string = cells[0].getAttribute('data-index');
            const firstColIdx: string = cells[0].getAttribute('aria-colindex');
            const lastRowIdx: string = cells[cells.length - 1].getAttribute('data-index');
            const lastColIdx: string = cells[cells.length - 1].getAttribute('aria-colindex');
            for (let i: number = 0; i < cells.length; i++) {
                if (cells[parseInt(i.toString(), 10)].getAttribute('data-index') === firstRowIdx && (width.length === 1 || (width.length === 3
                    && parseInt(width[0], 10) === 2 ) || (width.length === 4 && parseInt(width[0], 10) === 2))) {
                    cells[parseInt(i.toString(), 10)].classList.add('e-xlsel-top-border');
                }
                if (cells[parseInt(i.toString(), 10)].getAttribute('aria-colindex') === firstColIdx && (width.length === 1 ||
                    (width.length === 3 && parseInt(width[1], 10) === 2 ) || (width.length === 4 && (((!isRtl &&
                    parseInt(width[3], 10) === 2)) || (isRtl && parseInt(width[1], 10) === 2))))) {
                    cells[parseInt(i.toString(), 10)].classList.add(isRtl ? 'e-xlsel-right-border' : 'e-xlsel-left-border');
                }
                if (cells[parseInt(i.toString(), 10)].getAttribute('data-index') === lastRowIdx && (width.length === 1 ||
                    (width.length === 3 && parseInt(width[2], 10) === 2 ) || (width.length === 4 && parseInt(width[2], 10) === 2))) {
                    cells[parseInt(i.toString(), 10)].classList.add('e-xlsel-bottom-border');
                }
                if (cells[parseInt(i.toString(), 10)].getAttribute('aria-colindex') === lastColIdx && (width.length === 1 ||
                    (width.length === 3 && parseInt(width[1], 10) === 2 ) || (width.length === 4 && ((!isRtl &&
                    parseInt(width[1], 10) === 2)) || (isRtl && parseInt(width[3], 10) === 2)))) {
                    cells[parseInt(i.toString(), 10)].classList.add(isRtl ? 'e-xlsel-left-border' : 'e-xlsel-right-border');
                }
            }
        }
        if (fixedCells.length) {
            const firstRowIdx: string = fixedCells[0].getAttribute('data-index');
            const firstColIdx: string = (parseInt(fixedCells[0].getAttribute('aria-colindex'), 10) - 1).toString();
            const lastRowIdx: string = fixedCells[fixedCells.length - 1].getAttribute('data-index');
            const lastColIdx: string = (parseInt(fixedCells[fixedCells.length - 1].getAttribute('aria-colindex'), 10) - 1).toString();
            for (let i: number = 0; i < fixedCells.length; i++) {
                const idx: string = fixedCells[parseInt(i.toString(), 10)].getAttribute('data-index');
                const colIdx: string = (parseInt(fixedCells[parseInt(i.toString(), 10)].getAttribute('aria-colindex'), 10) - 1).toString();
                if (idx === firstRowIdx &&
                    ((!this.parent.getHeaderContent().querySelector('.e-cellselectionbackground.e-fixedfreeze')
                    && parentsUntil(parentEle, 'e-content')) || !parentsUntil(parentEle, 'e-content'))) {
                    fixedCells[parseInt(i.toString(), 10)].classList.add('e-xlsel-top-border');
                }
                if (idx === lastRowIdx &&
                    ((!this.parent.getContent().querySelector('.e-cellselectionbackground.e-fixedfreeze')
                    && parentsUntil(parentEle, 'e-headercontent')) || !parentsUntil(parentEle, 'e-headercontent'))) {
                    fixedCells[parseInt(i.toString(), 10)].classList.add('e-xlsel-bottom-border');
                }
                const preCell: Element = fixedCells[parseInt(i.toString(), 10)].parentElement.children[parseInt(colIdx, 10) - 1];
                if (colIdx === firstColIdx && (!preCell || (preCell && !preCell.classList.contains('e-cellselectionbackground')))) {
                    fixedCells[parseInt(i.toString(), 10)].classList.add(isRtl ? 'e-xlsel-right-border' : 'e-xlsel-left-border');
                }
                const nextCell: Element = fixedCells[parseInt(i.toString(), 10)].parentElement.children[parseInt(colIdx, 10) + 1];
                if (colIdx === lastColIdx && (!nextCell || (nextCell && !nextCell.classList.contains('e-cellselectionbackground')))) {
                    fixedCells[parseInt(i.toString(), 10)].classList.add(isRtl ? 'e-xlsel-left-border' : 'e-xlsel-right-border');
                }
            }
        }

    }

    private refreshFrozenBorders(): void {
        if (this.bdrElement) {
            this.setFrozenBorders(this.parent.getContentTable(), this.bdrElement, '1');
            if (this.parent.isFrozenGrid() && this.parent.getFrozenMode() === literals.leftRight) {
                this.setFrozenBorders(this.parent.getContentTable(), this.frcBdrElement, '5');
            }
            if (this.parent.frozenRows) {
                this.setFrozenBorders(this.parent.getHeaderTable(), this.fhBdrElement, '3');
                if (this.parent.isFrozenGrid() && this.parent.getFrozenMode() === literals.leftRight) {
                    this.setFrozenBorders(this.parent.getHeaderTable(), this.frhBdrElement, '6');
                }
            }
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public drawBorders(): void {
        if (this.selectionSettings.cellSelectionMode === 'BoxWithBorder' && this.selectedRowCellIndexes.length && !this.parent.isEdit) {
            this.parent.element.classList.add('e-enabledboxbdr');
            if (!this.bdrElement) {
                this.createBorders();
            }
            this.positionBorders();
            if (this.parent.isFrozenGrid()) {
                this.showHideBorders('none', true);
                this.refreshFrozenBorders();
            }
        } else {
            this.showHideBorders('none');
        }
    }

    private isLastCell(cell: Element): boolean {
        const cells: Element[] = [].slice.call(cell.parentElement.querySelectorAll('.e-rowcell:not(.e-hide)'));
        return cells[cells.length - 1] === cell;
    }

    private isLastRow(cell: Element): boolean {
        const rows: Element[] = [].slice.call(closest(cell, literals.tbody).querySelectorAll('.e-row:not(.e-hiddenrow)'));
        return cell.parentElement === rows[rows.length - 1];
    }

    private isFirstRow(cell: Element): boolean {
        const rows: Element[] = [].slice.call(closest(cell, literals.tbody).querySelectorAll('.e-row:not(.e-hiddenrow)'));
        return cell.parentElement === rows[0];
    }

    private isFirstCell(cell: Element): boolean {
        const cells: Element[] = [].slice.call(cell.parentElement.querySelectorAll('.e-rowcell:not(.e-hide)'));
        return cells[0] === cell;
    }

    private setBorders(parentEle: Element, border: HTMLElement, bdrStr: string): void {
        let cells: HTMLElement[] = [].slice.call(parentEle.getElementsByClassName('e-cellselectionbackground')).
            filter((ele: HTMLElement) => ele.style.display === '');
        if (cells.length && this.parent.isFrozenGrid()) {
            const strCell: string[] = ['', 'e-leftfreeze', 'e-unfreeze', 'e-leftfreeze', 'e-unfreeze', 'e-rightfreeze', 'e-rightfreeze'];
            cells = [].slice.call(parentEle.querySelectorAll('.e-cellselectionbackground' + '.' + strCell[`${bdrStr}`] + ':not(.e-hide)')).
                filter((ele: HTMLElement) => ele.style.display === '');
        }
        if (cells.length) {
            const isFrozen: boolean = this.parent.isFrozenGrid();
            const start: HTMLElement = cells[0];
            const end: HTMLElement = cells[cells.length - 1];
            const stOff: ClientRect = start.getBoundingClientRect();
            const endOff: ClientRect = end.getBoundingClientRect();
            let parentOff: ClientRect = start.offsetParent.getBoundingClientRect();
            if (start.offsetParent.classList.contains('e-content') || start.offsetParent.classList.contains('e-headercontent')) {
                parentOff = start.offsetParent.querySelector('table').getBoundingClientRect();
            }
            const rowHeight: number = !isFrozen && this.isLastRow(end) && (bdrStr === '1' || bdrStr === '2' || bdrStr === '5') ? 2 : 0;
            const topOffSet: number = 0;
            const leftOffset: number = isFrozen && (bdrStr === '2' || bdrStr === '4') && this.isFirstCell(start) ? 1 : 0;
            const rightOffset: number = ((this.parent.getFrozenMode() === 'Right' && (bdrStr === '1' || bdrStr === '3'))
                || (this.parent.getFrozenMode() === literals.leftRight && (bdrStr === '5' || bdrStr === '6')))
                && this.isFirstCell(start) ? 1 : 0;

            if (this.parent.enableRtl) {
                border.style.right = parentOff.right - stOff.right - leftOffset + 'px';
                border.style.width = stOff.right - endOff.left + leftOffset + 1 + 'px';
            } else {
                border.style.left = stOff.left - parentOff.left - leftOffset - rightOffset + 'px';
                border.style.width = endOff.right - stOff.left + leftOffset - rightOffset + 1 + 'px';
            }
            border.style.top = stOff.top - parentOff.top - topOffSet + 'px';
            border.style.height = endOff.top - stOff.top > 0 ?
                (endOff.top - parentOff.top + endOff.height + (isFrozen ? 0 : 1)) - (stOff.top - parentOff.top) - rowHeight + topOffSet + 'px' :
                endOff.height + topOffSet - rowHeight + (isFrozen ? 0 : 1) + 'px';
            this.selectDirection += bdrStr;
        } else {
            border.style.display = 'none';
        }
    }

    private positionBorders(): void {
        this.updateStartEndCells();
        if (!this.startCell || !this.bdrElement || !this.selectedRowCellIndexes.length) {
            return;
        }
        this.selectDirection = '';
        this.showHideBorders('');
        this.setBorders(this.parent.getContentTable(), this.bdrElement, '1');
        if (this.parent.isFrozenGrid()) {
            this.setBorders(this.parent.getContentTable(), this.mcBdrElement, '2');
            if (this.parent.getFrozenMode() === literals.leftRight) {
                this.setBorders(this.parent.getContentTable(), this.frcBdrElement, '5');
            }
        }
        if (this.parent.frozenRows) {
            this.setBorders(this.parent.getHeaderTable(), this.fhBdrElement, '3');
            if (this.parent.isFrozenGrid()) {
                this.setBorders(this.parent.getHeaderTable(), this.mhBdrElement, '4');
                if (this.parent.getFrozenMode() === literals.leftRight) {
                    this.setBorders(this.parent.getHeaderTable(), this.frhBdrElement, '6');
                }
            }
        }
        this.applyBorders(this.selectDirection);
    }

    private bottom: string = '0 0 2px 0';
    private top: string = '2px 0 0 0';
    /* eslint-disable */
    private right_bottom: string = '0 2px 2px 0';
    private bottom_left: string = '0 0 2px 2px';
    private top_right: string = '2px 2px 0 0';
    private top_left: string = '2px 0 0 2px';
    private top_bottom: string = '2px 0 2px 0';
    private top_right_bottom: string = '2px 2px 2px 0';
    private top_bottom_left: string = '2px 0 2px 2px';
    private top_right_left: string = '2px 2px 0 2px';
    private right_bottom_left: string = '0 2px 2px 2px';
    private all_border: string = '2px';
    /* eslint-enable */

    private applyBothFrozenBorders(str: string): void {
        const rtl: boolean = this.parent.enableRtl;
        switch (str.length) {
        case 6: {
            this.bdrElement.style.borderWidth = rtl ? this.right_bottom : this.bottom_left;
            this.mcBdrElement.style.borderWidth = this.bottom;
            this.fhBdrElement.style.borderWidth = rtl ? this.top_right : this.top_left;
            this.mhBdrElement.style.borderWidth = this.top;
            this.frcBdrElement.style.borderWidth = rtl ? this.bottom_left : this.right_bottom;
            this.frhBdrElement.style.borderWidth = rtl ? this.top_left : this.top_right;
        }
            break;
        case 4: {
            if (str.includes('1') && str.includes('2') && str.includes('3') && str.includes('4')) {
                this.fhBdrElement.style.borderWidth = rtl ? this.top_right : this.top_left;
                this.mhBdrElement.style.borderWidth = rtl ? this.top_left : this.top_right;
                this.bdrElement.style.borderWidth = rtl ? this.right_bottom : this.bottom_left;
                this.mcBdrElement.style.borderWidth = rtl ? this.bottom_left : this.right_bottom;
            }
            if (str.includes('2') && str.includes('4') && str.includes('5') && str.includes('6')) {
                this.mcBdrElement.style.borderWidth = rtl ? this.right_bottom : this.bottom_left;
                this.mhBdrElement.style.borderWidth = rtl ? this.top_right : this.top_left;
                this.frcBdrElement.style.borderWidth = rtl ? this.bottom_left : this.right_bottom;
                this.frhBdrElement.style.borderWidth = rtl ? this.top_left : this.top_right;
            }
        }
            break;
        case 3: {
            this.bdrElement.style.borderWidth = rtl ? this.top_right_bottom : this.top_bottom_left;
            this.mcBdrElement.style.borderWidth = this.top_bottom;
            this.frcBdrElement.style.borderWidth = rtl ? this.top_bottom_left : this.top_right_bottom;
            if (this.parent.frozenRows) {
                this.fhBdrElement.style.borderWidth = rtl ? this.top_right_bottom : this.top_bottom_left;
                this.mhBdrElement.style.borderWidth = this.top_bottom;
                this.frcBdrElement.style.borderWidth = rtl ? this.top_bottom_left : this.top_right_bottom;
            }
        }
            break;
        case 2: {
            if (str.includes('1')) {
                this.mcBdrElement.style.borderWidth = rtl ? this.top_bottom_left : this.top_right_bottom;
                if (this.parent.frozenRows) {
                    this.fhBdrElement.style.borderWidth = this.top_right_left;
                }
            }
            if (str.includes('2')) {
                this.bdrElement.style.borderWidth = rtl ? this.top_right_bottom : this.top_bottom_left;
                this.frcBdrElement.style.borderWidth = rtl ? this.top_bottom_left : this.top_right_bottom;
                if (this.parent.frozenRows) {
                    this.mhBdrElement.style.borderWidth = this.top_right_left;
                }
            }
            if (str.includes('3')) {
                this.mhBdrElement.style.borderWidth = rtl ? this.top_bottom_left : this.top_right_bottom;
                this.bdrElement.style.borderWidth = this.right_bottom_left;
            }
            if (str.includes('4')) {
                this.fhBdrElement.style.borderWidth = rtl ? this.top_right_bottom : this.top_bottom_left;
                this.frhBdrElement.style.borderWidth = rtl ? this.top_bottom_left : this.top_right_bottom;
                this.mcBdrElement.style.borderWidth = this.right_bottom_left;
            }
            if (str.includes('5')) {
                this.mcBdrElement.style.borderWidth = rtl ? this.top_right_bottom : this.top_bottom_left;
                if (this.parent.frozenRows) {
                    this.frhBdrElement.style.borderWidth = this.top_right_left;
                }
            }
            if (str.includes('6')) {
                this.mhBdrElement.style.borderWidth = rtl ? this.top_right_bottom : this.top_bottom_left;
                this.frcBdrElement.style.borderWidth = this.right_bottom_left;
            }
        }
            break;
        default:
            this.bdrElement.style.borderWidth = this.all_border;
            this.mcBdrElement.style.borderWidth = this.all_border;
            this.frcBdrElement.style.borderWidth = this.all_border;
            if (this.parent.frozenRows) {
                this.fhBdrElement.style.borderWidth = this.all_border;
                this.mhBdrElement.style.borderWidth = this.all_border;
                this.frhBdrElement.style.borderWidth = this.all_border;
            }
            break;
        }
    }

    private applyBorders(str: string): void {
        const rtl: boolean = this.parent.enableRtl;
        if (this.parent.getFrozenMode() === literals.leftRight) {
            this.applyBothFrozenBorders(str);
        } else {
            switch (str.length) {
            case 4: {
                if (this.parent.getFrozenMode() === 'Right') {
                    this.bdrElement.style.borderWidth = rtl ? this.bottom_left : this.right_bottom;
                    this.mcBdrElement.style.borderWidth = rtl ? this.right_bottom : this.bottom_left;
                    this.fhBdrElement.style.borderWidth = rtl ? this.top_left : this.top_right;
                    this.mhBdrElement.style.borderWidth = rtl ? this.top_right : this.top_left;
                } else {
                    this.bdrElement.style.borderWidth = rtl ? this.right_bottom : this.bottom_left;
                    this.mcBdrElement.style.borderWidth = rtl ? this.bottom_left : this.right_bottom;
                    this.fhBdrElement.style.borderWidth = rtl ? this.top_right : this.top_left;
                    this.mhBdrElement.style.borderWidth = rtl ? this.top_left : this.top_right;
                }
            }
                break;
            case 2: {
                if (this.parent.getFrozenMode() === 'Right') {
                    this.bdrElement.style.borderWidth = str.includes('2') ? rtl ? this.top_bottom_left
                        : this.top_right_bottom : this.right_bottom_left;
                    this.mcBdrElement.style.borderWidth = str.includes('1') ? rtl ? this.top_right_bottom
                        : this.top_bottom_left : this.right_bottom_left;
                    if (this.parent.frozenRows) {
                        this.fhBdrElement.style.borderWidth = str.includes('1') ? this.top_right_left
                            : rtl ? this.top_bottom_left : this.top_right_bottom;
                        this.mhBdrElement.style.borderWidth = str.includes('2') ? this.top_right_left
                            : rtl ? this.top_right_bottom : this.top_bottom_left;
                    }
                } else {
                    this.bdrElement.style.borderWidth = str.includes('2') ? rtl ? this.top_right_bottom
                        : this.top_bottom_left : this.right_bottom_left;
                    if (this.parent.isFrozenGrid()) {
                        this.mcBdrElement.style.borderWidth = str.includes('1') ? rtl ? this.top_bottom_left
                            : this.top_right_bottom : this.right_bottom_left;
                    }
                    if (this.parent.frozenRows) {
                        this.fhBdrElement.style.borderWidth = str.includes('1') ? this.top_right_left
                            : rtl ? this.top_right_bottom : this.top_bottom_left;
                        if (this.parent.isFrozenGrid()) {
                            this.mhBdrElement.style.borderWidth = str.includes('2') ? this.top_right_left
                                : rtl ? this.top_bottom_left : this.top_right_bottom;
                        }
                    }
                }
            }
                break;
            default:
                this.bdrElement.style.borderWidth = this.all_border;
                if (this.parent.isFrozenGrid()) {
                    this.mcBdrElement.style.borderWidth = this.all_border;
                }
                if (this.parent.frozenRows) {
                    this.fhBdrElement.style.borderWidth = this.all_border;
                    if (this.parent.isFrozenGrid()) {
                        this.mhBdrElement.style.borderWidth = this.all_border;
                    }
                }
                break;
            }
        }
    }

    private createBorders(): void {
        if (!this.bdrElement) {
            const selectionBorder: HTMLElement = createElement('div', {
                className: 'e-xlsel', id: this.parent.element.id + '_bdr' });
            selectionBorder.style.cssText = 'width: 2px; border-width: 0;';
            this.bdrElement = this.parent.getContentTable().parentElement.appendChild(selectionBorder);
            if (this.parent.isFrozenGrid()) {
                const middleContentBorder: HTMLElement = createElement('div', {
                    className: 'e-xlsel', id: this.parent.element.id + '_mcbdr' });
                middleContentBorder.style.cssText = 'height: 2px; border-width: 0;';
                this.mcBdrElement = this.parent.getContentTable().parentElement.appendChild(middleContentBorder);
                if (this.parent.getFrozenMode() === literals.leftRight) {
                    const frozenRightContentBorder: HTMLElement = createElement('div', {
                        className: 'e-xlsel', id: this.parent.element.id + '_frcbdr' });
                    frozenRightContentBorder.style.cssText = 'height: 2px; border-width: 0;';
                    this.frcBdrElement = this.parent.getContentTable().parentElement.appendChild(frozenRightContentBorder);
                }
            }
            if (this.parent.frozenRows) {
                const frozenHeaderBorder: HTMLElement = createElement('div', {
                    className: 'e-xlsel', id: this.parent.element.id + '_fhbdr' });
                frozenHeaderBorder.style.height = '2px';
                this.fhBdrElement = this.parent.getHeaderTable().parentElement.appendChild(frozenHeaderBorder);
            }
            if (this.parent.frozenRows && this.parent.isFrozenGrid()) {
                const middleHeaderBorder: HTMLElement = createElement('div', {
                    className: 'e-xlsel', id: this.parent.element.id + '_mhbdr' });
                middleHeaderBorder.style.height = '2px';
                this.mhBdrElement = this.parent.getHeaderTable().parentElement.appendChild(middleHeaderBorder);
                if (this.parent.getFrozenMode() === literals.leftRight) {
                    const frozenRightHeaderBorder: HTMLElement = createElement('div', {
                        className: 'e-xlsel', id: this.parent.element.id + '_frhbdr' });
                    frozenRightHeaderBorder.style.height = '2px';
                    this.frhBdrElement = this.parent.getHeaderTable().parentElement.appendChild(frozenRightHeaderBorder);
                }
            }
        }
    }

    private showHideBorders(display: string, freeze?: boolean): void {
        if (this.bdrElement) {
            this.bdrElement.style.display = display;
            if (this.parent.isFrozenGrid()) {
                const parentEle: Element = this.parent.getContentTable();
                removeClass(parentEle.querySelectorAll('.e-xlsel-top-border'), 'e-xlsel-top-border');
                removeClass(parentEle.querySelectorAll('.e-xlsel-left-border'), 'e-xlsel-left-border');
                removeClass(parentEle.querySelectorAll('.e-xlsel-right-border'), 'e-xlsel-right-border');
                removeClass(parentEle.querySelectorAll('.e-xlsel-bottom-border'), 'e-xlsel-bottom-border');
                if (!freeze) {
                    this.mcBdrElement.style.display = display;
                }
                if (this.parent.getFrozenMode() === literals.leftRight) {
                    this.frcBdrElement.style.display = display;
                }
            }
            if (this.parent.frozenRows) {
                const parentEle: Element = this.parent.getHeaderTable();
                removeClass(parentEle.querySelectorAll('.e-xlsel-top-border'), 'e-xlsel-top-border');
                removeClass(parentEle.querySelectorAll('.e-xlsel-left-border'), 'e-xlsel-left-border');
                removeClass(parentEle.querySelectorAll('.e-xlsel-right-border'), 'e-xlsel-right-border');
                removeClass(parentEle.querySelectorAll('.e-xlsel-bottom-border'), 'e-xlsel-bottom-border');
                this.fhBdrElement.style.display = display;
            }
            if (this.parent.frozenRows && this.parent.isFrozenGrid()) {
                if (!freeze) {
                    this.mhBdrElement.style.display = display;
                }
                if (this.parent.getFrozenMode() === literals.leftRight) {
                    this.frhBdrElement.style.display = display;
                }
            }
        }
    }

    private drawAFBorders(): void {
        if (!this.bdrAFBottom) {
            this.createAFBorders();
        }
        this.positionAFBorders();
    }

    private positionAFBorders(): void {
        if (!this.startCell || !this.bdrAFLeft) {
            return;
        }
        const stOff: ClientRect = this.startAFCell.getBoundingClientRect();
        const endOff: ClientRect = this.endAFCell.getBoundingClientRect();
        const top: number = endOff.top - stOff.top > 0 ? 1 : 0;
        const firstCellTop: number = endOff.top - stOff.top >= 0 && (parentsUntil(this.startAFCell, literals.movableContent) ||
            parentsUntil(this.startAFCell, 'e-frozencontent')) && this.isFirstRow(this.startAFCell) ? 1.5 : 0;
        const firstCellLeft: number = (parentsUntil(this.startAFCell, literals.movableContent) ||
            parentsUntil(this.startAFCell, literals.movableHeader)) && this.isFirstCell(this.startAFCell) ? 1 : 0;
        const rowHeight: number = this.isLastRow(this.endAFCell) && (parentsUntil(this.endAFCell, literals.movableContent) ||
            parentsUntil(this.endAFCell, 'e-frozencontent')) ? 2 : 0;
        const parentOff: ClientRect = (this.startAFCell as HTMLElement).offsetParent.getBoundingClientRect();
        const parentRect: ClientRect = this.parent.element.getBoundingClientRect();
        const sTop: number = (this.startAFCell as HTMLElement).offsetParent.parentElement.scrollTop;
        const sLeft: number = (this.startAFCell as HTMLElement).offsetParent.parentElement.scrollLeft;
        let scrollTop: number = sTop - (this.startAFCell as HTMLElement).offsetTop;
        let scrollLeft: number = sLeft - (this.startAFCell as HTMLElement).offsetLeft;
        let totalHeight: number = this.parent.element.clientHeight - getScrollBarWidth();
        if (this.parent.allowPaging) {
            totalHeight -= (this.parent.element.querySelector('.e-pager') as HTMLElement).offsetHeight;
        }
        if (this.parent.aggregates.length) {
            totalHeight -= (this.parent.getFooterContent() as HTMLElement).offsetHeight;
        }
        const totalWidth: number = this.parent.element.clientWidth - (this.parent.height !== 'auto' ? getScrollBarWidth() : 0);
        scrollTop = scrollTop > 0 ? Math.floor(scrollTop) - 1 : 0;
        scrollLeft = scrollLeft > 0 ? scrollLeft : 0;
        const left: number = stOff.left - parentRect.left;
        if (!this.parent.enableRtl) {
            this.bdrAFLeft.style.left = left - firstCellLeft + scrollLeft - 1 + 'px';

            this.bdrAFRight.style.left = endOff.left - parentRect.left - 2 + endOff.width + 'px';

            this.bdrAFRight.style.width = totalWidth <= parseInt(this.bdrAFRight.style.left, 10) ? '0px' : '2px';
            this.bdrAFTop.style.left = left + scrollLeft - 0.5 + 'px';
            this.bdrAFTop.style.width = parseInt(this.bdrAFRight.style.left, 10) - parseInt(this.bdrAFLeft.style.left, 10)
                - firstCellLeft + 1 + 'px';
            if (totalWidth <= (parseInt(this.bdrAFTop.style.width, 10) + parseInt(this.bdrAFTop.style.left, 10))) {
                const leftRemove: number = (parseInt(this.bdrAFTop.style.width, 10) + parseInt(this.bdrAFTop.style.left, 10)) - totalWidth;
                this.bdrAFTop.style.width = parseInt(this.bdrAFTop.style.width, 10) - leftRemove + 'px';
            }
        } else {
            const scrolloffSet: number = (parentsUntil(this.startAFCell, literals.movableContent) ||
                parentsUntil(this.startAFCell, literals.movableHeader)) ? stOff.right -
                (this.startAFCell as HTMLElement).offsetParent.parentElement.getBoundingClientRect().width -
                parentRect.left : 0;
            this.bdrAFLeft.style.right = parentRect.right - endOff.right - 2 + endOff.width + 'px';

            this.bdrAFLeft.style.width = totalWidth <= parseInt(this.bdrAFLeft.style.right, 10) ? '0px' : '2px';
            const borderAFRightValue: number = parentRect.right - stOff.right - firstCellLeft + scrolloffSet - 1;
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            borderAFRightValue > 0 ? this.bdrAFRight.style.right = borderAFRightValue + 'px' : this.bdrAFRight.style.right = '0px';
            this.bdrAFTop.style.left = endOff.left - parentRect.left - 0.5 + 'px';
            this.bdrAFTop.style.width = parseInt(this.bdrAFLeft.style.right, 10) - parseInt(this.bdrAFRight.style.right, 10)
                - firstCellLeft + 1 + 'px';
            if (parseInt(this.bdrAFTop.style.left, 10) < 0) {
                this.bdrAFTop.style.width = parseInt(this.bdrAFTop.style.width, 10) + parseInt(this.bdrAFTop.style.left, 10) + 'px';
                if (this.parent.height !== 'auto' && getScrollBarWidth()) {
                    this.bdrAFTop.style.left = getScrollBarWidth() + 'px';
                    this.bdrAFTop.style.width = (parseInt(this.bdrAFTop.style.width, 10) - getScrollBarWidth()) + 'px';
                } else {
                    this.bdrAFTop.style.left = '0px';
                }
            }
        }

        this.bdrAFLeft.style.top = stOff.top - parentRect.top - firstCellTop + scrollTop + 'px';
        this.bdrAFLeft.style.height = endOff.top - stOff.top > 0 ?
            (endOff.top - parentOff.top + endOff.height + 1) - (stOff.top - parentOff.top) + firstCellTop - rowHeight - scrollTop + 'px' :
            endOff.height + firstCellTop - rowHeight - scrollTop + 'px';

        this.bdrAFRight.style.top = this.bdrAFLeft.style.top;
        this.bdrAFRight.style.height = parseInt(this.bdrAFLeft.style.height, 10) + 'px';

        this.bdrAFTop.style.top = this.bdrAFRight.style.top;

        this.bdrAFBottom.style.left = this.bdrAFTop.style.left;
        this.bdrAFBottom.style.top = parseFloat(this.bdrAFLeft.style.top) + parseFloat(this.bdrAFLeft.style.height) - top - 1 + 'px';
        this.bdrAFBottom.style.width = totalHeight <= parseFloat(this.bdrAFBottom.style.top) ? '0px' : this.bdrAFTop.style.width;
        if (totalHeight <= (parseInt(this.bdrAFLeft.style.height, 10) + parseInt(this.bdrAFLeft.style.top, 10))) {
            const topRemove: number = parseInt(this.bdrAFLeft.style.height, 10) + parseInt(this.bdrAFLeft.style.top, 10) - totalHeight;
            this.bdrAFLeft.style.height = parseInt(this.bdrAFLeft.style.height, 10) - topRemove + 'px';
            this.bdrAFRight.style.height = parseInt(this.bdrAFLeft.style.height, 10) + 'px';
        }
    }

    private createAFBorders(): void {
        if (!this.bdrAFLeft) {
            const leftSelectionBorder: HTMLElement = createElement('div', {
                className: 'e-xlselaf', id: this.parent.element.id + '_bdrafleft' });
            leftSelectionBorder.style.width = '2px';
            this.bdrAFLeft = this.parent.element.appendChild(leftSelectionBorder);

            const rightSelectionBorder: HTMLElement = createElement('div', {
                className: 'e-xlselaf', id: this.parent.element.id + '_bdrafright' });
            rightSelectionBorder.style.width = '2px';
            this.bdrAFRight = this.parent.element.appendChild(rightSelectionBorder);

            const bottomSelectionBorder: HTMLElement = createElement('div', {
                className: 'e-xlselaf', id: this.parent.element.id + '_bdrafbottom' });
            bottomSelectionBorder.style.height = '2px';
            this.bdrAFBottom = this.parent.element.appendChild(bottomSelectionBorder);

            const topSelectionBorder: HTMLElement = createElement('div', {
                className: 'e-xlselaf', id: this.parent.element.id + '_bdraftop' });
            topSelectionBorder.style.height = '2px';
            this.bdrAFTop = this.parent.element.appendChild(topSelectionBorder);
        }
    }

    public destroyAutoFillElements(): void {
        if (this.bdrAFLeft) {
            this.bdrAFLeft.remove();
            this.bdrAFRight.remove();
            this.bdrAFBottom.remove();
            this.bdrAFTop.remove();
            this.bdrAFLeft = this.bdrAFRight = this.bdrAFBottom = this.bdrAFTop = null;
        }
        if (this.autofill) {
            this.autofill.remove();
            this.autofill = null;
        }
    }

    private showAFBorders(): void {
        if (this.bdrAFLeft) {
            this.bdrAFLeft.style.display = '';
            this.bdrAFRight.style.display = '';
            this.bdrAFBottom.style.display = '';
            this.bdrAFTop.style.display = '';
        }
    }

    private hideAFBorders(): void {
        if (this.bdrAFLeft) {
            this.bdrAFLeft.style.display = 'none';
            this.bdrAFRight.style.display = 'none';
            this.bdrAFBottom.style.display = 'none';
            this.bdrAFTop.style.display = 'none';
        }
    }

    private updateValue(rIdx: number, cIdx: number, cell: HTMLElement): void {
        const args: BeforeAutoFillEventArgs = this.createBeforeAutoFill(rIdx, cIdx, cell);
        if (!args.cancel) {
            const col: Column = this.parent.getColumnByIndex(cIdx);
            if (this.parent.editModule && cell) {
                if (col.type === 'number') {
                    this.parent.editModule.updateCell(rIdx, col.field, parseFloat(args.value));
                } else {
                    this.parent.editModule.updateCell(rIdx, col.field, args.value);
                }
            }
        }
    }

    private createBeforeAutoFill(rowIndex: number, colIndex: number, cell: HTMLElement): BeforeAutoFillEventArgs {
        const col: Column = this.parent.getColumnByIndex(colIndex);
        const args: BeforeAutoFillEventArgs = {
            column: col,
            value: cell.innerText
        };
        this.parent.trigger(events.beforeAutoFill, args);
        return args;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private getAutoFillCells(rowIndex: number, startCellIdx: number): HTMLElement[] {
        const cls: string = '.e-cellselectionbackground';
        const cells: HTMLElement[] = [].slice.call(this.parent.getDataRows()[parseInt(rowIndex.toString(), 10)].querySelectorAll(cls));
        return cells;
    }

    private selectLikeAutoFill(e: MouseEvent, isApply?: boolean): void {
        const startrowIdx: number = parseInt(parentsUntil(this.startAFCell, literals.row).getAttribute(literals.ariaRowIndex), 10) - 1;
        const startCellIdx: number = parseInt(this.startAFCell.getAttribute(literals.ariaColIndex), 10) - 1;
        let endrowIdx: number = parseInt(parentsUntil(this.endAFCell, literals.row).getAttribute(literals.ariaRowIndex), 10) - 1;
        let endCellIdx: number = parseInt(this.endAFCell.getAttribute(literals.ariaColIndex), 10) - 1;
        const rowLen: number = this.selectedRowCellIndexes.length - 1;
        const colLen: number = this.selectedRowCellIndexes[0].cellIndexes.length - 1;
        switch (true) { //direction
        case !isApply && this.endAFCell.classList.contains('e-cellselectionbackground') &&
            !!parentsUntil(e.target as Element, literals.rowCell)
            :
            this.startAFCell = this.parent.getCellFromIndex(startrowIdx, startCellIdx);
            this.endAFCell = this.parent.getCellFromIndex(startrowIdx + rowLen, startCellIdx + colLen);
            this.drawAFBorders();
            break;
        case this.autoFillRLselection && startCellIdx + colLen < endCellIdx && //right
            endCellIdx - startCellIdx - colLen + 1 > endrowIdx - startrowIdx - rowLen // right bottom
            && endCellIdx - startCellIdx - colLen + 1 > startrowIdx - endrowIdx: //right top
            this.endAFCell = this.parent.getCellFromIndex(startrowIdx + rowLen, endCellIdx);
            endrowIdx = parseInt(parentsUntil(this.endAFCell, literals.row).getAttribute(literals.ariaRowIndex), 10) - 1;
            endCellIdx = parseInt(this.endAFCell.getAttribute(literals.ariaColIndex), 10) - 1;
            if (!isApply) {
                this.drawAFBorders();
            } else {
                const cellIdx: number = parseInt(this.endCell.getAttribute(literals.ariaColIndex), 10) - 1;
                for (let i: number = startrowIdx; i <= endrowIdx; i++) {
                    const cells: HTMLElement[] = this.getAutoFillCells(i, startCellIdx);
                    let c: number = 0;
                    for (let j: number = cellIdx + 1; j <= endCellIdx; j++) {
                        if (c > colLen) {
                            c = 0;
                        }
                        this.updateValue(i, j, cells[parseInt(c.toString(), 10)]);
                        c++;
                    }
                }
                this.selectCellsByRange(
                    { rowIndex: startrowIdx, cellIndex: this.startCellIndex },
                    { rowIndex: endrowIdx, cellIndex: endCellIdx });
            }
            break;
        case this.autoFillRLselection && startCellIdx > endCellIdx && // left
            startCellIdx - endCellIdx + 1 > endrowIdx - startrowIdx - rowLen && //left top
            startCellIdx - endCellIdx + 1 > startrowIdx - endrowIdx: // left bottom
            this.startAFCell = this.parent.getCellFromIndex(startrowIdx, endCellIdx);
            this.endAFCell = this.endCell;
            if (!isApply) {
                this.drawAFBorders();
            } else {
                for (let i: number = startrowIdx; i <= startrowIdx + rowLen; i++) {
                    const cells: HTMLElement[] = this.getAutoFillCells(i, startCellIdx);
                    cells.reverse();
                    let c: number = 0;
                    for (let j: number = this.startCellIndex - 1; j >= endCellIdx; j--) {
                        if (c > colLen) {
                            c = 0;
                        }
                        this.updateValue(i, j, cells[parseInt(c.toString(), 10)]);
                        c++;
                    }
                }
                this.selectCellsByRange(
                    { rowIndex: startrowIdx, cellIndex: endCellIdx },
                    { rowIndex: startrowIdx + rowLen, cellIndex: this.startCellIndex + colLen });
            }
            break;
        case startrowIdx > endrowIdx: //up
            this.startAFCell = this.parent.getCellFromIndex(endrowIdx, startCellIdx);
            this.endAFCell = this.endCell;
            if (!isApply) {
                this.drawAFBorders();
            } else {
                const trIdx: number = parseInt(this.endCell.parentElement.getAttribute(literals.ariaRowIndex), 10) - 1;
                let r: number = trIdx;
                for (let i: number = startrowIdx - 1; i >= endrowIdx; i--) {
                    if (r === this.startIndex - 1) {
                        r = trIdx;
                    }
                    const cells: HTMLElement[] = this.getAutoFillCells(r, startCellIdx);
                    let c: number = 0;
                    r--;
                    for (let j: number = this.startCellIndex; j <= this.startCellIndex + colLen; j++) {
                        this.updateValue(i, j, cells[parseInt(c.toString(), 10)]);
                        c++;
                    }
                }
                this.selectCellsByRange(
                    { rowIndex: endrowIdx, cellIndex: startCellIdx + colLen },
                    { rowIndex: startrowIdx + rowLen, cellIndex: startCellIdx });
            }
            break;
        default:                //down
            this.endAFCell = this.parent.getCellFromIndex(endrowIdx, startCellIdx + colLen);
            if (!isApply) {
                this.drawAFBorders();
            } else {
                const trIdx: number = parseInt(this.endCell.parentElement.getAttribute(literals.ariaRowIndex), 10) - 1;
                let r: number = this.startIndex;
                for (let i: number = trIdx + 1; i <= endrowIdx; i++) {
                    if (r === trIdx + 1) {
                        r = this.startIndex;
                    }
                    const cells: HTMLElement[] = this.getAutoFillCells(r, startCellIdx);
                    r++;
                    let c: number = 0;
                    for (let m: number = this.startCellIndex; m <= this.startCellIndex + colLen; m++) {
                        this.updateValue(i, m, cells[parseInt(c.toString(), 10)]);
                        c++;
                    }
                }
                this.selectCellsByRange(
                    { rowIndex: trIdx - rowLen, cellIndex: startCellIdx }, { rowIndex: endrowIdx, cellIndex: startCellIdx + colLen });
            }
            break;
        }
    }

    private mouseUpHandler(e: MouseEventArgs): void {
        this.stopTimer();
        document.body.classList.remove('e-disableuserselect');
        if (this.element && !isNullOrUndefined(this.element.parentElement)) {
            remove(this.element);
        }
        if (this.isDragged && this.selectedRowCellIndexes.length === 1 && this.selectedRowCellIndexes[0].cellIndexes.length === 1) {
            this.mUPTarget = parentsUntil(e.target as Element, literals.rowCell);
        } else {
            this.mUPTarget = null;
        }
        const closeRowCell: Element = closest(e.target as Element, '.e-rowcell');
        if (this.isDragged && !this.isAutoFillSel && this.selectionSettings.mode === 'Cell' &&
            closeRowCell && closeRowCell.classList.contains(literals.rowCell)) {
            const rowIndex: number = parseInt(closeRowCell.parentElement.getAttribute(literals.ariaRowIndex), 10) - 1;
            const cellIndex: number = parseInt(closeRowCell.getAttribute(literals.ariaColIndex), 10) - 1;
            this.isDragged = false;
            this.clearCellSelection();
            this.selectCellsByRange(
                { rowIndex: this.startDIndex, cellIndex: this.startDCellIndex },
                { rowIndex: rowIndex, cellIndex: cellIndex });
        }
        this.isDragged = false;
        this.updateAutoFillPosition();
        if (this.isAutoFillSel) {
            this.preventFocus = true;
            const lastCell: Element = parentsUntil(e.target as Element, literals.rowCell);
            this.endAFCell = lastCell ? lastCell : this.endCell === this.endAFCell ? this.startAFCell : this.endAFCell;
            this.startAFCell = this.startCell;
            if (!isNullOrUndefined(this.endAFCell) && !isNullOrUndefined(this.startAFCell)) {
                this.updateStartCellsIndex();
                this.selectLikeAutoFill(e, true);
                this.updateAutoFillPosition();
                this.hideAFBorders();
                this.positionBorders();
                if (this.parent.isFrozenGrid()) {
                    this.showHideBorders('none', true);
                    this.refreshFrozenBorders();
                }
                if (this.parent.aggregates.length > 0) {
                    this.parent.notify(events.refreshFooterRenderer, {});
                }
            }
            this.isAutoFillSel = false;
            this.preventFocus = false;
        }
        EventHandler.remove(this.parent.getContent(), 'mousemove', this.mouseMoveHandler);
        if (this.parent.frozenRows) {
            EventHandler.remove(this.parent.getHeaderContent(), 'mousemove', this.mouseMoveHandler);
        }
        EventHandler.remove(document, 'mouseup', this.mouseUpHandler);
    }

    private hideAutoFill(): void {
        if (this.autofill) {
            this.autofill.style.display = 'none';
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public updateAutoFillPosition(): void {
        if (this.parent.enableAutoFill && !this.parent.isEdit &&
            this.selectionSettings.cellSelectionMode.indexOf('Box') > -1 && !this.isRowType() && !this.isSingleSel()
            && this.selectedRowCellIndexes.length) {
            const index: number = parseInt(this.target.getAttribute(literals.ariaColIndex), 10) - 1;
            const rindex: number = parseInt(this.target.getAttribute('data-index'), 10);
            const rowIndex: number = this.selectedRowCellIndexes[this.selectedRowCellIndexes.length - 1].rowIndex;
            const cells: Element[] = this.getAutoFillCells(rowIndex, index).filter((ele: HTMLElement) => ele.style.display === '');
            const col: Column = this.parent.getColumnByIndex(index);
            const isFrozenCol: boolean = col.getFreezeTableName() === 'movable';
            const isFrozenRow: boolean = rindex < this.parent.frozenRows;
            const isFrozenRight: boolean = this.parent.getFrozenMode() === literals.leftRight
                && col.getFreezeTableName() === literals.frozenRight;
            if (!select('#' + this.parent.element.id + '_autofill', parentsUntil(this.target, literals.table))) {
                if (select('#' + this.parent.element.id + '_autofill', this.parent.element)) {
                    select('#' + this.parent.element.id + '_autofill', this.parent.element).remove();
                }
                this.autofill = createElement(
                    'div', { className: 'e-autofill', id: this.parent.element.id + '_autofill' });
                this.autofill.style.display = 'none';
                if (this.target.classList.contains('e-leftfreeze') || this.target.classList.contains('e-rightfreeze') ||
                    this.target.classList.contains('e-fixedfreeze')) {
                    this.autofill.classList.add('e-freeze-autofill');
                }
                if (!isFrozenRow) {
                    if (!isFrozenCol) {
                        this.parent.getContentTable().parentElement.appendChild(this.autofill);
                    } else {
                        this.parent.getContentTable().parentElement.appendChild(this.autofill);
                    }
                } else {
                    if (!isFrozenCol) {
                        this.parent.getHeaderTable().parentElement.appendChild(this.autofill);
                    } else {
                        this.parent.getHeaderTable().parentElement.appendChild(this.autofill);
                    }
                }
                if (isFrozenRight) {
                    if (isFrozenRow) {
                        this.parent.getHeaderTable().parentElement.appendChild(this.autofill);
                    } else {
                        this.parent.getContentTable().parentElement.appendChild(this.autofill);
                    }
                }
            }
            const cell: HTMLElement = cells[cells.length - 1] as HTMLElement;
            if (cell && cell.offsetParent) {
                const clientRect: ClientRect = cell.getBoundingClientRect();
                let parentOff: ClientRect = cell.offsetParent.getBoundingClientRect();
                if (cell.offsetParent.classList.contains('e-content') || cell.offsetParent.classList.contains('e-headercontent')) {
                    parentOff =  cell.offsetParent.querySelector('table').getBoundingClientRect();
                }
                const colWidth: number = this.isLastCell(cell) ? 4 : 0;
                const rowHeight: number = this.isLastRow(cell) ? 3 : 0;
                if (!this.parent.enableRtl) {
                    this.autofill.style.left = clientRect.left - parentOff.left + clientRect.width - 4 - colWidth + 'px';
                } else {
                    this.autofill.style.right = parentOff.right - clientRect.right + clientRect.width - 4 - colWidth + 'px';
                }
                this.autofill.style.top = clientRect.top - parentOff.top + clientRect.height - 5 - rowHeight + 'px';
            }
            this.autofill.style.display = '';
        } else {
            this.hideAutoFill();
        }
    }

    private mouseDownHandler(e: MouseEventArgs): void {
        this.mouseButton = e.button;
        const target: Element = e.target as Element;
        const gObj: IGrid = this.parent;
        let isDrag: boolean;
        const gridElement: Element = parentsUntil(target, 'e-grid');
        if (gridElement && gridElement.id !== gObj.element.id || parentsUntil(target, literals.headerContent) && !this.parent.frozenRows ||
            parentsUntil(target, 'e-editedbatchcell') || parentsUntil(target, literals.editedRow)) {
            return;
        }
        if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
        }
        if (parentsUntil(target, literals.rowCell) && !e.shiftKey && !e.ctrlKey) {

            if (gObj.selectionSettings.cellSelectionMode.indexOf('Box') > -1 && !this.isRowType() && !this.isSingleSel()) {
                this.isCellDrag = true;
                isDrag = true;
            } else if (gObj.allowRowDragAndDrop && !gObj.isEdit && !this.parent.selectionSettings.checkboxOnly) {
                this.isRowDragSelected = false;
                if (!this.isRowType() || this.isSingleSel() || closest(target, 'td').classList.contains('e-selectionbackground')) {
                    this.isDragged = false;
                    return;
                }
                isDrag = true;
                this.element = this.parent.createElement('div', { className: 'e-griddragarea' });
                gObj.getContent().appendChild(this.element);
            }
            if (isDrag) {
                this.enableDrag(e, true);
            }
        }
        this.updateStartEndCells();
        if (target.classList.contains('e-autofill') || target.classList.contains('e-xlsel')) {
            this.isCellDrag = true;
            this.isAutoFillSel = true;
            this.enableDrag(e);
        }
    }

    private updateStartEndCells(): void {
        const cells: Element[] = [].slice.call(this.parent.element.getElementsByClassName('e-cellselectionbackground'));
        this.startCell = cells[0];
        this.endCell = cells[cells.length - 1];
        if (this.startCell) {
            this.startIndex = parseInt(this.startCell.parentElement.getAttribute(literals.ariaRowIndex), 10) - 1;
            this.startCellIndex = parseInt(parentsUntil(this.startCell, literals.rowCell).getAttribute(literals.ariaColIndex), 10) - 1;
        }
    }

    private updateStartCellsIndex(): void {
        if (this.startCell) {
            this.startIndex = parseInt(this.startCell.parentElement.getAttribute(literals.ariaRowIndex), 10) - 1;
            this.startCellIndex = parseInt(parentsUntil(this.startCell, literals.rowCell).getAttribute(literals.ariaColIndex), 10) - 1;
        }
    }

    private enableDrag(e: MouseEventArgs, isUpdate?: boolean): void {
        const gObj: IGrid = this.parent;
        if (isUpdate) {
            const tr: Element = closest(e.target as Element, 'tr');
            this.startDIndex = parseInt(tr.getAttribute(literals.ariaRowIndex), 10) - 1;
            this.startDCellIndex = parseInt(parentsUntil(e.target as Element, literals.rowCell)
                .getAttribute(literals.ariaColIndex), 10) - 1;
        }

        document.body.classList.add('e-disableuserselect');
        const gBRect: ClientRect = gObj.element.getBoundingClientRect();
        const postion: IPosition = getPosition(e);
        this.x = postion.x - gBRect.left;
        this.y = postion.y - gBRect.top;

        EventHandler.add(gObj.getContent(), 'mousemove', this.mouseMoveHandler, this);
        if (this.parent.frozenRows) {
            EventHandler.add(gObj.getHeaderContent(), 'mousemove', this.mouseMoveHandler, this);
        }
        EventHandler.add(document, 'mouseup', this.mouseUpHandler, this);
    }

    private clearSelAfterRefresh(e: { requestType: string }): void {
        const isInfiniteScroll: boolean = this.parent.enableInfiniteScrolling && e.requestType === 'infiniteScroll';
        if (e.requestType !== 'virtualscroll' && !this.parent.isPersistSelection && !isInfiniteScroll) {
            this.clearSelection();
        }
        if ((e.requestType === 'virtualscroll' || isInfiniteScroll) && this.parent.isPersistSelection && this.isPartialSelection
            && this.isHdrSelectAllClicked) {
            const rowObj: Row<Column>[] = this.parent.getRowsObject().filter((e: Row<Column>) => e.isSelectable);
            const indexes: number[] = [];
            this.selectedRowState = {};
            this.persistSelectedData = [];
            for (let i: number = 0; i < rowObj.length; i++) {
                indexes.push(rowObj[parseInt(i.toString(), 10)].index);
                const pkValue: string = this.getPkValue(this.primaryKey, rowObj[parseInt(i.toString(), 10)].data);
                this.selectedRowState[`${pkValue}`] = true;
                this.persistSelectedData.push(rowObj[parseInt(i.toString(), 10)].data);
            }
            this.selectedRowIndexes = indexes;
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.evtHandlers = [{ event: events.uiUpdate, handler: this.enableAfterRender },
            { event: events.initialEnd, handler: this.initializeSelection },
            { event: events.rowSelectionComplete, handler: this.onActionComplete },
            { event: events.cellSelectionComplete, handler: this.onActionComplete },
            { event: events.inBoundModelChanged, handler: this.onPropertyChanged },
            { event: events.cellFocused, handler: this.onCellFocused },
            { event: events.beforeFragAppend, handler: this.clearSelAfterRefresh },
            { event: events.columnPositionChanged, handler: this.columnPositionChanged },
            { event: events.contentReady, handler: this.initialEnd },
            { event: events.rowsRemoved, handler: this.rowsRemoved },
            { event: events.headerRefreshed, handler: this.refreshHeader },
            { event: events.destroyAutoFillElements, handler: this.destroyAutoFillElements },
            { event: events.destroy, handler: this.destroy }];
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);
        this.actionBeginFunction = this.actionBegin.bind(this);
        this.actionCompleteFunction = this.actionComplete.bind(this);
        this.parent.addEventListener(events.actionBegin, this.actionBeginFunction);
        this.parent.addEventListener(events.actionComplete, this.actionCompleteFunction);
        this.addEventListener_checkbox();
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        EventHandler.remove(document, 'mouseup', this.mouseUpHandler);
        EventHandler.remove(this.parent.getContent(), 'mousedown', this.mouseDownHandler);
        EventHandler.remove(this.parent.getHeaderContent(), 'mousedown', this.mouseDownHandler);
        addRemoveEventListener(this.parent, this.evtHandlers, false);
        this.parent.removeEventListener(events.actionBegin, this.actionBeginFunction);
        this.parent.removeEventListener(events.actionComplete, this.actionCompleteFunction);
        this.removeEventListener_checkbox();
        this.parent.off(events.destroyAutoFillElements, this.destroyAutoFillElements);
    }

    private wireEvents(): void {
        this.isMacOS = navigator.userAgent.indexOf('Mac OS') !== -1;
        if (this.isMacOS) {
            EventHandler.add(this.parent.element, 'keydown', this.keyDownHandler, this);
            EventHandler.add(this.parent.element, 'keyup', this.keyUpHandler, this);
        } else {
            if (!this.parent.allowKeyboard) {
                EventHandler.add(this.parent.element, 'keydown', this.keyDownHandler, this);
            }
        }
    }

    private unWireEvents(): void {
        if (this.isMacOS) {
            EventHandler.remove(this.parent.element, 'keydown', this.keyDownHandler);
            EventHandler.remove(this.parent.element, 'keyup', this.keyUpHandler);
        } else {
            if (!this.parent.allowKeyboard) {
                EventHandler.remove(this.parent.element, 'keydown', this.keyDownHandler);
            }
        }
    }

    private columnPositionChanged(): void {
        if (!this.parent.isPersistSelection) {
            this.clearSelection();
        }
    }

    private refreshHeader(): void {
        const checkboxColumn: Column[] = this.parent.getColumns().filter((col: Column) => col.type === 'checkbox');
        if (checkboxColumn.length && !this.parent.getDataModule().isRemote()) {
            this.gridCurrentRecord = this.getData();
        }
        this.setCheckAllState();
    }

    private rowsRemoved(e: { records: Object[] }): void {
        for (let i: number = 0; i < e.records.length; i++) {
            const pkValue: string = this.getPkValue(this.primaryKey, e.records[parseInt(i.toString(), 10)]);
            delete (this.selectedRowState[`${pkValue}`]);
            --this.totalRecordsCount;
        }
        this.setCheckAllState();
    }

    public beforeFragAppend(e: { requestType: string }): void {
        if (e.requestType !== 'virtualscroll' && !this.parent.isPersistSelection) {
            this.clearSelection();
        }
    }

    private getCheckAllBox(): HTMLInputElement {
        return this.parent.getHeaderContent().querySelector('.e-checkselectall') as HTMLInputElement;
    }

    private enableAfterRender(e: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            this.render();
            this.initPerisistSelection();
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private render(e?: NotifyArgs): void {
        EventHandler.add(this.parent.getContent(), 'mousedown', this.mouseDownHandler, this);
        EventHandler.add(this.parent.getHeaderContent(), 'mousedown', this.mouseDownHandler, this);
    }

    private onPropertyChanged(e: { module: string, properties: SelectionSettings }): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        const gObj: IGrid = this.parent;
        if (!isNullOrUndefined(e.properties.type)) {
            if (this.selectionSettings.type === 'Single') {
                gObj.element.removeAttribute('aria-multiselectable');
                if (this.selectedRowCellIndexes.length > 1) {
                    this.clearCellSelection();
                    this.prevCIdxs = undefined;
                }
                if (this.selectedRowIndexes.length > 1) {
                    this.clearRowSelection();
                    this.prevRowIndex = undefined;
                }
                if (this.selectedColumnsIndexes.length > 1) {
                    this.clearColumnSelection();
                    this.prevColIndex = undefined;
                }
                this.enableSelectMultiTouch = false;
                this.hidePopUp();
            }
            else if (this.selectionSettings.type === 'Multiple') {
                gObj.element.setAttribute('aria-multiselectable', 'true');
            }
        }

        if (!isNullOrUndefined(e.properties.mode) ||
            !isNullOrUndefined(e.properties.cellSelectionMode)) {
            this.clearSelection();
            this.prevRowIndex = undefined;
            this.prevCIdxs = undefined;
            this.prevColIndex = undefined;
        }
        this.isPersisted = true;
        this.checkBoxSelectionChanged();
        this.isPersisted = false;
        if (!this.parent.isCheckBoxSelection) {
            this.initPerisistSelection();
        }
        const checkboxColumn: Column[] = this.parent.getColumns().filter((col: Column) => col.type === 'checkbox');
        if (checkboxColumn.length) {
            gObj.isCheckBoxSelection = !(this.selectionSettings.checkboxMode === 'ResetOnRowClick');
        }
        this.drawBorders();
    }

    private hidePopUp(): void {
        if (this.parent.element.querySelector('.e-gridpopup').getElementsByClassName('e-rowselect').length) {
            (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        }
    }

    private initialEnd(): void {
        if (!this.selectedRowIndexes.length) {
            this.parent.off(events.contentReady, this.initialEnd);
            this.selectRow(this.parent.selectedRowIndex);
        }
    }

    private checkBoxSelectionChanged(): void {
        const gobj: IGrid = this.parent;
        gobj.off(events.contentReady, this.checkBoxSelectionChanged);
        const columns: Column[] = gobj.enableColumnVirtualization ? (gobj.columns as Column[]) : gobj.getColumns();
        const checkboxColumn: Column[] = columns.filter((col: Column) => col.type === 'checkbox');
        if (checkboxColumn.length > 0) {
            gobj.isCheckBoxSelection = true;
            this.chkField = checkboxColumn[0].field;
            this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
            if (isNullOrUndefined(this.totalRecordsCount)) {
                this.totalRecordsCount = this.getCurrentBatchRecordChanges().length;
            }
            if (this.isSingleSel()) {
                gobj.selectionSettings.type = 'Multiple';
                gobj.dataBind();
            } else {
                this.initPerisistSelection();
            }
        }
        if (!gobj.isCheckBoxSelection && !this.isPersisted) {
            this.chkField = null;
            this.initPerisistSelection();
        }
    }

    private initPerisistSelection(): void {
        const gobj: IGrid = this.parent;
        if (this.parent.selectionSettings.persistSelection && this.parent.getPrimaryKeyFieldNames().length > 0) {
            gobj.isPersistSelection = true;
            this.ensureCheckboxFieldSelection();
        } else if (this.parent.getPrimaryKeyFieldNames().length > 0) {
            gobj.isPersistSelection = false;
            this.ensureCheckboxFieldSelection();
        } else {
            gobj.isPersistSelection = false;
            this.selectedRowState = {};
        }
    }

    private ensureCheckboxFieldSelection(): void {
        const gobj: IGrid = this.parent;
        this.primaryKey = this.parent.getPrimaryKeyFieldNames()[0];
        if (!gobj.enableVirtualization && this.chkField
            && ((gobj.isPersistSelection && Object.keys(this.selectedRowState).length === 0) ||
                !gobj.isPersistSelection)) {
            this.dataSuccess((!isNullOrUndefined(this.parent.dataSource) && (<{result: object[]}>this.parent.dataSource).result) ||
                this.parent.getDataModule().isRemote() ? this.parent.getCurrentViewRecords() :
                this.parent.renderModule.data.dataManager.dataSource.json);
        }
    }

    private dataSuccess(res: Object[]): void {
        for (let i: number = 0; i < res.length; i++) {
            const pkValue: string = this.getPkValue(this.primaryKey, res[parseInt(i.toString(), 10)]);
            const checkedFieldData: boolean = res[parseInt(i.toString(), 10)][this.chkField];
            if (isNullOrUndefined(this.selectedRowState[`${pkValue}`]) && checkedFieldData && typeof checkedFieldData === 'boolean') {
                this.selectedRowState[`${pkValue}`] = checkedFieldData;
                if (this.parent.isPersistSelection) {
                    this.persistSelectedData.push(res[parseInt(i.toString(), 10)]);
                }
            }
        }
    }

    private setRowSelection(state: boolean): void {
        if (!(this.parent.getDataModule().isRemote() || (!isNullOrUndefined(this.parent.dataSource)
         && (<{result: object[]}>this.parent.dataSource).result))) {
            if (state) {
                if (this.isPartialSelection && (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)) {
                    const rowObj: Row<Column>[] = this.parent.getRowsObject().filter((e: Row<Column>) => e.isSelectable);
                    for (const row of rowObj) {
                        this.selectedRowState[this.getPkValue(this.primaryKey, row.data)] = true;
                    }
                } else {
                    const selectedData: Object[] = this.isPartialSelection ? this.parent.partialSelectedRecords : this.getData();
                    if (this.parent.groupSettings.columns.length) {
                        for (const data of this.isPartialSelection ? selectedData : (<{ records?: Object[] }>selectedData).records) {
                            this.selectedRowState[this.getPkValue(this.primaryKey, data)] = true;
                        }
                    } else {
                        for (const data of selectedData) {
                            this.selectedRowState[this.getPkValue(this.primaryKey, data)] = true;
                        }
                    }
                }
            } else {
                this.selectedRowState = {};
            }

            // (this.getData()).forEach(function (data) {
            //     this.selectedRowState[data[this.primaryKey]] = true;
            // })
        }
        else {
            if (state) {
                const selectedStateKeys: string[] = Object.keys(this.selectedRowState);
                const unSelectedRowStateKeys: string[] = Object.keys(this.unSelectedRowState);
                if (!this.isCheckboxReset) {
                    const rowData: Object[] = (this.parent.groupSettings.columns.length && this.parent.isPersistSelection) ?
                        this.parent.currentViewData['records'] : this.parent.currentViewData;
                    for (const data of rowData) {
                        if (!isNullOrUndefined(data[this.primaryKey])) {
                            const key: string = data[this.primaryKey].toString();
                            if (selectedStateKeys.indexOf(key) === -1 && unSelectedRowStateKeys.indexOf(key) === -1) {
                                this.selectedRowState[data[this.primaryKey]] = true;
                            }
                        }
                    }
                }
            }
            else {
                this.selectedRowState = {};
                this.unSelectedRowState = {};
                this.rmtHdrChkbxClicked = false;
            }
        }
    }

    private getData(): object[] {
        return this.parent.getDataModule().dataManager.executeLocal(this.parent.getDataModule().generateQuery(true));
    }

    private getAvailableSelectedData(data: Object[]): Object[] {
        let filteredSearchedSelectedData: Object[] = new DataManager(data).executeLocal(
            this.parent.getDataModule().generateQuery(true));
        if (this.parent.groupSettings.columns.length && filteredSearchedSelectedData &&
            (<{ records?: Object[] }>filteredSearchedSelectedData).records) {
            filteredSearchedSelectedData = (<{ records?: Object[] }>filteredSearchedSelectedData).records.slice();
        }
        return filteredSearchedSelectedData;
    }

    private refreshPersistSelection(): void {
        const rows: Element[] = this.parent.getRows();
        this.totalRecordsCount = this.parent.getCurrentViewRecords().length;
        if (this.parent.allowPaging) {
            this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
        }
        if (!isNullOrUndefined(rows) && rows.length > 0 && (this.parent.isPersistSelection || this.chkField)) {
            const indexes: number[] = [];
            for (let j: number = 0; j < rows.length; j++) {
                const rowObj: Row<Column> = this.getRowObj(rows[parseInt(j.toString(), 10)]);
                const pKey: string = rowObj ? rowObj.data ? this.getPkValue(this.primaryKey, rowObj.data) : null : null;
                if (pKey === null) { return; }
                if (this.isPartialSelection && !rowObj.isSelectable) { continue; }
                let checkState: boolean;
                const chkBox: HTMLInputElement = (rows[parseInt(j.toString(), 10)].querySelector('.e-checkselect') as HTMLInputElement);
                if (this.selectedRowState[`${pKey}`] || (this.parent.checkAllRows === 'Check' && this.selectedRowState[`${pKey}`] &&
                    this.totalRecordsCount === Object.keys(this.selectedRowState).length && this.chkAllCollec.indexOf(pKey) < 0)
                    || (this.parent.checkAllRows === 'Uncheck' && this.chkAllCollec.indexOf(pKey) > 0 && !this.parent.selectedRowIndex)
                    || (this.parent.checkAllRows === 'Intermediate' && !isNullOrUndefined(this.chkField) && rowObj.data[this.chkField])
                ) {
                    indexes.push(parseInt(rows[parseInt(j.toString(), 10)].getAttribute(literals.ariaRowIndex), 10) - 1);
                    checkState = true;
                } else {
                    checkState = false;
                    if (this.checkedTarget !== chkBox && this.parent.isCheckBoxSelection && chkBox) {
                        removeAddCboxClasses(chkBox.nextElementSibling as HTMLElement, checkState);
                    }
                }
                this.updatePersistCollection(rows[parseInt(j.toString(), 10)], checkState);
            }
            if (this.isSingleSel() && indexes.length > 0) {
                this.selectRow(indexes[0], true);
            } else {
                this.selectRows(indexes);
            }
        }
        if ((this.parent.isCheckBoxSelection || this.parent.selectionSettings.checkboxMode === 'ResetOnRowClick') && this.getCurrentBatchRecordChanges().length > 0) {
            this.setCheckAllState();
        }
    }


    private actionBegin(e: { requestType: string }): void {
        if (e.requestType === 'save' && this.parent.isPersistSelection) {
            const editChkBox: HTMLInputElement = this.parent.element.querySelector('.e-edit-checkselect') as HTMLInputElement;
            if (!isNullOrUndefined(editChkBox)) {
                let row: HTMLElement = closest(editChkBox, '.' + literals.editedRow) as HTMLElement;
                if (row) {
                    if (this.parent.editSettings.mode === 'Dialog') {
                        row = this.parent.element.querySelector('.e-dlgeditrow') as HTMLElement;
                    }
                    const rowObj: Row<Column> = this.getRowObj(row);
                    if (!rowObj) { return; }
                    this.selectedRowState[this.getPkValue(this.primaryKey, rowObj.data)] = rowObj.isSelected = editChkBox.checked;
                } else {
                    this.isCheckedOnAdd = editChkBox.checked;
                }
            }
        }
        if (this.parent.isPersistSelection && this.isPartialSelection) {
            if (e.requestType === 'paging' && (this.parent.getDataModule().isRemote()
                || (!isNullOrUndefined(this.parent.dataSource) && (<{result: object[]}>this.parent.dataSource).result))) {
                this.selectedRowIndexes = [];
            }
        }
    }

    private actionComplete(e: { requestType: string, action: string, selectedRow: number, data: Object[] }): void {
        if (e.requestType === 'save' && this.parent.isPersistSelection) {
            if (e.action === 'add') {
                if (this.isCheckedOnAdd) {
                    const rowObj: Row<Column> = this.parent.getRowObjectFromUID(
                        this.parent.getRows()[e.selectedRow].getAttribute('data-uid'));
                    this.selectedRowState[this.getPkValue(this.primaryKey, rowObj.data)] = rowObj.isSelected = this.isCheckedOnAdd;
                }
                this.isHdrSelectAllClicked = false;
                this.setCheckAllState();
            }
            this.refreshPersistSelection();
        }
        if (e.requestType === 'delete' && this.parent.isPersistSelection) {
            const records: object[] = e.data;
            const data: Object[] = records.slice();
            for (let i: number = 0; i < data.length; i++) {
                const pkValue: string = this.getPkValue(this.primaryKey, data[parseInt(i.toString(), 10)]);
                if (!isNullOrUndefined(pkValue)) {
                    this.updatePersistDelete(pkValue, this.isPartialSelection);
                }
            }
            this.isHdrSelectAllClicked = false;
            this.setCheckAllState();
            this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
        }
        if (e.requestType === 'paging') {
            if (this.parent.isPersistSelection && this.isPartialSelection && this.isHdrSelectAllClicked) {
                const rows: Row<Column>[] = this.parent.getRowsObject();
                const indexes: number[] = [];
                for (let i: number = 0; i < rows.length; i++) {
                    if (rows[parseInt(i.toString(), 10)].isSelectable) {
                        indexes.push(rows[parseInt(i.toString(), 10)].index);
                    }
                }
                if (indexes.length) {
                    this.selectRows(indexes);
                }
            }
            this.prevRowIndex = undefined;
            this.prevCIdxs = undefined;
            this.prevECIdxs = undefined;
        }
    }

    private onDataBound(): void {
        const checkboxColumn: Column[] = this.parent.getColumns().filter((col: Column) => col.type === 'checkbox');
        if (checkboxColumn.length && !this.parent.getDataModule().isRemote()) {
            this.gridCurrentRecord = this.getData();
        }
        if (!this.parent.enableVirtualization && this.parent.isPersistSelection) {
            if (this.selectedRecords.length) {
                this.isPrevRowSelection = true;
            }
        }
        if (((this.parent.getDataModule().isRemote() || (!isNullOrUndefined(this.parent.dataSource)
            && (<{ result: object[] }>this.parent.dataSource).result)) && this.rmtHdrChkbxClicked)
            || (this.isPartialSelection && this.parent.isPersistSelection && this.isHdrSelectAllClicked)) {
            if (this.parent.checkAllRows === 'Intermediate') {
                this.setRowSelection(true);
            }
            else if (this.parent.checkAllRows === 'Uncheck') {
                this.setRowSelection(false);
            }
        }
        if (this.parent.enableVirtualization) {
            this.setCheckAllState();
        }
        if (this.parent.isPersistSelection) {
            this.refreshPersistSelection();
        }
        this.initialRowSelection = this.isRowType() && this.parent.element.querySelectorAll('.e-selectionbackground') &&
            this.parent.getSelectedRows().length ? true : false;
        if (this.parent.isCheckBoxSelection && !this.initialRowSelection) {
            const totalRecords: Row<Column>[] = this.parent.getRowsObject();
            const indexes: number[] = [];
            for (let i: number = 0; i < totalRecords.length; i++) {
                if (totalRecords[parseInt(i.toString(), 10)].isSelected) {
                    indexes.push(i);
                }
            }
            if (indexes.length) {
                this.selectRows(indexes);
            }
            this.initialRowSelection = true;
        }
    }

    private updatePersistSelectedData(checkState: boolean): void {
        if (this.parent.isPersistSelection) {
            let nonFilteredSelectedData: object[] = [];
            if (this.parent.checkAllRows === 'Check' && (this.parent.searchSettings.key.length > 0
                || this.parent.filterSettings.columns.length > 0) && this.persistSelectedData.length
                && !(this.parent.getDataModule().isRemote() || (!isNullOrUndefined(this.parent.dataSource)
                && (<{result: object[]}>this.parent.dataSource).result)) && !this.isPartialSelection) {
                const availableFilteredSelectedData: object[] = this.getAvailableSelectedData(this.persistSelectedData);
                const filteredIds: Set<string | number> =
                new Set(availableFilteredSelectedData.map((item: object) => item[this.primaryKey]));
                nonFilteredSelectedData = this.persistSelectedData.filter((item: object) => !filteredIds.has(item[this.primaryKey]));
            }
            const rows: Element[] = this.parent.getRows();
            for (let i: number = 0; i < rows.length; i++) {
                this.updatePersistCollection(rows[parseInt(i.toString(), 10)], checkState);
            }
            if (this.parent.checkAllRows === 'Uncheck') {
                this.setRowSelection(false);
                this.persistSelectedData = (this.parent.getDataModule().isRemote()
                    || (!isNullOrUndefined(this.parent.dataSource) && (<{result: object[]}>this.parent.dataSource).result))
                    ? this.persistSelectedData : [];
            } else if (this.parent.checkAllRows === 'Check') {
                this.setRowSelection(true);
                this.persistSelectedData = !(this.parent.getDataModule().isRemote()
                    || (!isNullOrUndefined(this.parent.dataSource) && (<{result: object[]}>this.parent.dataSource).result))
                     && !this.isPartialSelection ?
                    this.parent.groupSettings.columns.length ? (<{ records?: Object[] }>this.getData()).records.slice() :
                        this.getData().slice() : this.persistSelectedData;
                if (nonFilteredSelectedData.length > 0) {
                    for (let i: number = 0; i < nonFilteredSelectedData.length; i++) {
                        this.persistSelectedData.push(nonFilteredSelectedData[parseInt(i.toString(), 10)]);
                    }
                }
            }
        }
    }

    private checkSelectAllAction(checkState: boolean): void {
        const cRenderer: IRenderer = this.getRenderer();
        const editForm: HTMLFormElement = this.parent.element.querySelector('.e-gridform') as HTMLFormElement;
        this.checkedTarget = this.getCheckAllBox();
        if (checkState && this.getCurrentBatchRecordChanges().length) {
            this.parent.checkAllRows = 'Check';
            this.updatePersistSelectedData(checkState);
            this.selectRowsByRange(
                cRenderer.getVirtualRowIndex(0),
                cRenderer.getVirtualRowIndex(this.getCurrentBatchRecordChanges().length - 1));
            if (this.checkVirtualCheckBox() && !this.parent.isPersistSelection) {
                this.virtualSelectedData = this.virtualCheckBoxData().slice();
                this.selectedRowIndexes = Object.keys(this.virtualSelectedData).map((key: string) => parseInt(key, 10));
            }
        } else {
            this.parent.checkAllRows = 'Uncheck';
            this.updatePersistSelectedData(checkState);
            this.clearSelection();
        }
        this.chkAllCollec = [];
        if (!isNullOrUndefined(editForm)) {
            const editChkBox: HTMLElement = editForm.querySelector('.e-edit-checkselect') as HTMLElement;
            if (!isNullOrUndefined(editChkBox)) {
                removeAddCboxClasses(editChkBox.nextElementSibling as HTMLElement, checkState);
            }
        }
    }

    private checkSelectAll(checkBox: HTMLInputElement): void {
        const stateStr: string = this.getCheckAllStatus(checkBox);
        let state: boolean = stateStr === 'Check';
        this.isHeaderCheckboxClicked = true;
        if ((this.parent.getDataModule().isRemote() || (!isNullOrUndefined(this.parent.dataSource)
            && (<{ result: object[] }>this.parent.dataSource).result)) && ((stateStr === 'Uncheck' || this.isCheckboxReset) ||
                (stateStr === 'Intermediate' && this.parent.isPersistSelection))) {
            this.rmtHdrChkbxClicked = true;
        }
        else {
            this.rmtHdrChkbxClicked = false;
        }
        if (this.rmtHdrChkbxClicked && this.isCheckboxReset) {
            this.unSelectedRowState = {};
        }
        this.isCheckboxReset = false;
        if (stateStr === 'Intermediate') {
            if (!this.chkField && !this.parent.isPersistSelection) {
                state = this.getCurrentBatchRecordChanges().some((data: Object) =>
                    this.getPkValue(this.primaryKey, data) in this.selectedRowState);
            }
            if (this.parent.isPersistSelection) {
                if (this.parent.allowPaging && this.isPartialSelection) {
                    const rowObjects: Row<Column>[] = this.parent.getRowsObject();
                    for (let i: number = 0; i < rowObjects.length; i++) {
                        if (rowObjects[i as number].isDataRow && rowObjects[i as number].isSelectable &&
                            !rowObjects[i as number].isSelected) {
                            state = false;
                            break;
                        } else {
                            state = true;
                        }
                    }

                }
                else if ((this.parent.getDataModule().isRemote() || (!isNullOrUndefined(this.parent.dataSource)
                    && (<{ result: object[] }>this.parent.dataSource).result))) {
                    for (let i: number = 0; i < this.getCurrentBatchRecordChanges().length; i++) {
                        if (!isNullOrUndefined(this.getPkValue(this.primaryKey, this.getCurrentBatchRecordChanges()[`${i}`]))) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            if ((Object.keys(this.selectedRowState) as any).includes((this.getPkValue(this.primaryKey, this.getCurrentBatchRecordChanges()[`${i}`])).toString())) {
                                state = true;
                            } else {
                                state = false;
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (this.parent.isPersistSelection && this.parent.allowPaging) {
            this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
        }
        this.checkSelectAllAction(!state);
        this.target = null;
        if (this.getCurrentBatchRecordChanges().length > 0) {
            this.setCheckAllState();
            this.updateSelectedRowIndexes();
        }
        this.triggerChkChangeEvent(checkBox, !state);
    }

    private getCheckAllStatus(ele?: HTMLElement): CheckState {
        let classes: DOMTokenList | undefined;
        if (!isNullOrUndefined(ele)) {
            classes = ele.nextElementSibling.classList;
        } else {
            if (!isNullOrUndefined(this.getCheckAllBox())) {
                classes = this.getCheckAllBox().nextElementSibling.classList;
            }
        }
        let status: CheckState = 'None';
        if (classes instanceof DOMTokenList) {
            if (classes.contains('e-check')) {
                status = 'Check';
            } else if (classes.contains('e-uncheck')) {
                status = 'Uncheck';
            } else if (classes.contains('e-stop')) {
                status = 'Intermediate';
            }
        }
        return status;
    }

    private checkSelect(checkBox: HTMLInputElement): void {
        const target: HTMLElement = closest(this.checkedTarget, '.' + literals.rowCell) as HTMLElement;
        const gObj: IGrid = this.parent;
        this.isMultiCtrlRequest = true;
        let rIndex: number = 0;
        this.isHeaderCheckboxClicked = false;
        if (isGroupAdaptive(gObj)) {
            const uid: string = target.parentElement.getAttribute('data-uid');
            if (this.parent.enableVirtualization && this.parent.groupSettings.columns.length) {
                rIndex = parseInt(target.parentElement.getAttribute(literals.ariaRowIndex), 10) - 1;
            } else {
                rIndex = gObj.getRows().map((m: HTMLTableRowElement) => m.getAttribute('data-uid')).indexOf(uid);
            }
        } else {
            rIndex = parseInt(target.parentElement.getAttribute(literals.ariaRowIndex), 10) - 1;
        }
        if (this.parent.isPersistSelection  && this.parent.element.getElementsByClassName(literals.addedRow).length > 0 &&
            this.parent.editSettings.newRowPosition === 'Top' && !this.parent.editSettings.showAddNewRow) {
            ++rIndex;
        }
        this.rowCellSelectionHandler(rIndex, parseInt(target.getAttribute(literals.ariaColIndex), 10) - 1);
        this.moveIntoUncheckCollection(closest(target, '.' + literals.row) as HTMLElement);
        this.setCheckAllState();
        this.isMultiCtrlRequest = false;
        this.triggerChkChangeEvent(checkBox, checkBox.nextElementSibling.classList.contains('e-check'));
    }

    private moveIntoUncheckCollection(row: HTMLElement): void {
        if (this.parent.checkAllRows === 'Check' || this.parent.checkAllRows === 'Uncheck') {
            const rowObj: Row<Column> = this.getRowObj(row);
            const pKey: string = rowObj && rowObj.data ? this.getPkValue(this.primaryKey, rowObj.data) : null;
            if (!pKey) { return; }
            if (this.chkAllCollec.indexOf(pKey) < 0) {
                this.chkAllCollec.push(pKey);
            } else {
                this.chkAllCollec.splice(this.chkAllCollec.indexOf(pKey), 1);
            }
        }
    }

    private triggerChkChangeEvent(checkBox: HTMLInputElement, checkState: boolean): void {
        this.parent.trigger(events.checkBoxChange, {
            checked: checkState, selectedRowIndexes: this.parent.getSelectedRowIndexes(),
            target: checkBox
        });
        if (!this.parent.isEdit) {
            this.checkedTarget = null;
        }
    }

    private updateSelectedRowIndexes(): void {
        if (this.parent.isCheckBoxSelection && (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) &&
            this.isPartialSelection && !(this.parent.getDataModule().isRemote() || (!isNullOrUndefined(this.parent.dataSource)
             && (<{result: object[]}>this.parent.dataSource).result))
            && this.parent.selectionSettings.persistSelection) {
            if (this.parent.checkAllRows !== 'Uncheck') {
                const rowObj: Row<Column>[] = this.parent.getRowsObject().filter((e: Row<Column>) => e.isSelectable);
                for (const row of rowObj) {
                    this.selectedRowIndexes.push(row.index);
                }
            }
        }
        if (this.parent.isCheckBoxSelection && this.parent.enableVirtualization && !this.isPartialSelection &&
            (this.parent.getDataModule().isRemote() || (!isNullOrUndefined(this.parent.dataSource)
                && (<{ result: object[] }>this.parent.dataSource).result))
            && !this.parent.isPersistSelection && this.parent.checkAllRows === 'Check') {
            const rowObj: Row<Column>[] = this.parent.getRowsObject().filter((e: Row<Column>) => e.isSelectable);
            if (rowObj.length !== this.selectedRowIndexes.length) {
                for (const row of rowObj) {
                    if (this.selectedRowIndexes.indexOf(row.index) <= -1) {
                        this.selectedRowIndexes.push(row.index);
                    }
                }
            }
        }
    }

    private updateSelectedRowIndex(index?: number): void {
        if (this.parent.isCheckBoxSelection && (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)
            && !(this.parent.getDataModule().isRemote() || (!isNullOrUndefined(this.parent.dataSource)
             && (<{result: object[]}>this.parent.dataSource).result))
            && !this.isPartialSelection) {
            if (this.parent.checkAllRows === 'Check') {
                this.selectedRowIndexes = [];
                const dataLength: number = this.parent.groupSettings.columns.length ? this.getData()['records'].length :
                    this.getData().length;
                for (let data: number = 0; data < dataLength; data++) {
                    this.selectedRowIndexes.push(data);
                }
            } else if (this.parent.checkAllRows === 'Uncheck') {
                this.selectedRowIndexes = [];
            } else {
                const row: Element = this.parent.getRowByIndex(index);
                if (index && row && row.getAttribute('aria-selected') === 'false') {
                    const selectedVal: number = this.selectedRowIndexes.indexOf(index);
                    this.selectedRowIndexes.splice(selectedVal, 1);
                }
            }
        }
    }

    private isAllSelected(count?: number): boolean {
        if (this.parent.getDataModule().isRemote()
        || (!isNullOrUndefined(this.parent.dataSource) && (<{result: object[]}>this.parent.dataSource).result)) {
            return this.getAvailableSelectedData(this.persistSelectedData).length === (this.parent.enableVirtualization
                || this.parent.enableInfiniteScrolling ? this.parent.totalDataRecordsCount : this.totalRecordsCount);
        } else {
            if (this.isPartialSelection) {
                if (this.parent.allowPaging && !this.selectionSettings.persistSelection
                    && this.parent.pageSettings.pageSize < this.parent.pageSettings.totalRecordsCount) {
                    const data: object[] = this.parent.partialSelectedRecords;
                    for (let i: number = 0; i < data.length; i++) {
                        const pKey: string = this.getPkValue(this.primaryKey, data[parseInt(i.toString(), 10)]);
                        if (!this.selectedRowState[`${pKey}`]) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    return this.isSelectAllRowCount(count);
                }
            } else {
                let data: object[] = this.getData();
                if (this.parent.groupSettings.columns.length && data['records']) {
                    data = data['records'];
                }
                for (let i: number = 0; i < data.length; i++) {
                    const pKey: string = this.getPkValue(this.primaryKey, data[parseInt(i.toString(), 10)]);
                    if (!this.selectedRowState[`${pKey}`]) {
                        return false;
                    }
                }
                return true;
            }
        }
    }

    private someDataSelected(): boolean {
        if ((this.parent.getDataModule().isRemote() || (!isNullOrUndefined(this.parent.dataSource)
            && (<{result: object[]}>this.parent.dataSource).result))
            && (this.parent.searchSettings.key.length || this.parent.filterSettings.columns.length)) {
            const filteredSearchedSelectedData: Object[] = this.getAvailableSelectedData(this.persistSelectedData);
            for (let i: number = 0; i < filteredSearchedSelectedData.length; i++) {
                const pKey: string = this.getPkValue(this.primaryKey, filteredSearchedSelectedData[parseInt(i.toString(), 10)]);
                if (this.selectedRowState[`${pKey}`]) {
                    return false;
                }
            }
        }
        const data: object[] = this.isPartialSelection ? this.getAvailableSelectedData(this.parent.partialSelectedRecords)
            : (this.parent.getDataModule().isRemote() || (!isNullOrUndefined(this.parent.dataSource)
          && (<{result: object[]}>this.parent.dataSource).result)) ? [] : this.getData();
        for (let i: number = 0; i < data.length; i++) {
            const pKey: string = this.getPkValue(this.primaryKey, data[parseInt(i.toString(), 10)]);
            if (this.selectedRowState[`${pKey}`]) {
                return false;
            }
        }
        return true;
    }

    private setCheckAllState(index?: number, isInteraction?: boolean): void {
        if (this.parent.isCheckBoxSelection || this.parent.selectionSettings.checkboxMode === 'ResetOnRowClick') {
            let checkToSelectAll: boolean = false;
            let isFiltered: boolean = false;
            let checkedLen: number = Object.keys(this.selectedRowState).length;
            if (this.parent.element.classList.contains('e-treelistgrid') && this.parent.isPersistSelection && !this.parent.enableVirtualization &&
                !this.parent.getDataModule().isRemote() && Array.isArray(this.parent.dataSource) &&
                checkedLen === this.parent.dataSource.length && checkedLen > this.totalRecordsCount) {
                checkedLen = this.totalRecordsCount;
            }
            if (!this.parent.isPersistSelection) {
                checkedLen = this.selectedRowIndexes.length;
                this.totalRecordsCount = this.getCurrentBatchRecordChanges().length;
            }
            if (this.parent.isPersistSelection && !((this.parent.getDataModule().isRemote() ||
                (!isNullOrUndefined(this.parent.dataSource) && (<{result: object[]}>this.parent.dataSource).result)) &&
                this.isPartialSelection)
                && (this.parent.searchSettings.key.length || this.parent.filterSettings.columns.length)) {
                isFiltered = true;
                checkToSelectAll = this.isAllSelected(checkedLen);
            }
            const input: HTMLInputElement = this.getCheckAllBox();
            if (input) {
                const spanEle: HTMLElement = input.nextElementSibling as HTMLElement;
                removeClass([spanEle], ['e-check', 'e-stop', 'e-uncheck']);
                setChecked(input, false);
                input.indeterminate = false;
                let getRecord: object[] = this.parent.getDataModule().isRemote() ? [] : this.gridCurrentRecord;
                if (this.parent.groupSettings.columns.length && getRecord['records']) {
                    getRecord = getRecord['records'];
                }
                this.totalRecordsCount = this.checkVirtualCheckBox() ? getRecord.length : this.totalRecordsCount;
                if ((checkToSelectAll && isFiltered && (this.parent.getDataModule().isRemote() ||
                    (!isNullOrUndefined(this.parent.dataSource) && (<{ result: object[] }>this.parent.dataSource).result) ||
                    getRecord.length)) || (!isFiltered && ((checkedLen === this.totalRecordsCount && this.totalRecordsCount
                        && !this.isPartialSelection && (!(this.parent.getDataModule().isRemote()
                        || (!isNullOrUndefined(this.parent.dataSource) && (<{result: object[]}>this.parent.dataSource).result))
                         || this.parent.allowPaging)) ||
                    (!this.parent.enableVirtualization && !this.parent.enableInfiniteScrolling
                    && this.isPartialSelection && (this.isSelectAllRowCount(checkedLen)
                    || (this.isHdrSelectAllClicked && !this.parent.isPersistSelection)))
                    || ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)
                        && !this.parent.allowPaging && ((!(this.parent.getDataModule().isRemote()
                        || (!isNullOrUndefined(this.parent.dataSource) && (<{result: object[]}>this.parent.dataSource).result)) &&
                        getRecord.length && checkedLen === getRecord.length) || ((this.parent.getDataModule().isRemote()
                        || (!isNullOrUndefined(this.parent.dataSource) && (<{result: object[]}>this.parent.dataSource).result)) &&
                        !this.isPartialSelection && ((checkedLen === this.parent.totalDataRecordsCount) || ((this.
                        isSelectAllRowCount(checkedLen) || checkedLen === this.totalRecordsCount) && !this.parent.isPersistSelection))) ||
                        (this.isPartialSelection && (this.isHdrSelectAllClicked || this.isSelectAllRowCount(checkedLen)))))
                        || (checkedLen === this.totalRecordsCount && this.totalRecordsCount && !this.isPartialSelection &&
                            !this.parent.allowPaging && !this.parent.enableVirtualization && !this.parent.enableInfiniteScrolling)))) {
                    addClass([spanEle], ['e-check']);
                    setChecked(input, true);
                    if (isInteraction) {
                        this.getRenderer().setSelection(null, true, true);
                    }
                    this.parent.checkAllRows = 'Check';
                } else if (((!this.selectedRowIndexes.length && (!this.parent.enableVirtualization ||
                             (!this.persistSelectedData.length && !isFiltered) || (isFiltered && this.someDataSelected())) ||
                             checkedLen === 0 && this.getCurrentBatchRecordChanges().length === 0) && !this.parent.allowPaging) ||
                             (this.parent.allowPaging && (checkedLen === 0 || (checkedLen && isFiltered && this.someDataSelected())))) {
                    addClass([spanEle], ['e-uncheck']);
                    if (isInteraction) {
                        this.getRenderer().setSelection(null, false, true);
                    }
                    this.parent.checkAllRows = 'Uncheck';
                } else {
                    addClass([spanEle], ['e-stop']);
                    this.parent.checkAllRows = 'Intermediate';
                    input.indeterminate = true;
                }
                if (checkedLen === 0 && this.getCurrentBatchRecordChanges().length === 0) {
                    addClass([spanEle.parentElement], ['e-checkbox-disabled']);
                } else {
                    removeClass([spanEle.parentElement], ['e-checkbox-disabled']);
                }
                if (this.isPartialSelection) {
                    const rowCount: number = this.parent.getRowsObject().filter((e: Row<Column>) => e.isSelectable).length;
                    if (rowCount === 0 && spanEle.parentElement.querySelector('.e-frame').classList.contains('e-uncheck')) {
                        addClass([spanEle.parentElement], ['e-checkbox-disabled']);
                    } else {
                        removeClass([spanEle.parentElement], ['e-checkbox-disabled']);
                    }
                }
                if ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)
                    && !this.parent.allowPaging && !(this.parent.getDataModule().isRemote()
                    || (!isNullOrUndefined(this.parent.dataSource) && (<{result: object[]}>this.parent.dataSource).result))) {
                    this.updateSelectedRowIndex(index);
                }
            }
        }
    }

    private checkVirtualCheckBox(): boolean {
        return this.parent.enableVirtualization && !(this.parent.getDataModule().isRemote() || (!isNullOrUndefined(this.parent.dataSource)
            && (<{result: object[]}>this.parent.dataSource).result)) && this.parent.isCheckBoxSelection && !this.isPartialSelection;
    }

    private virtualCheckBoxData(): object[] {
        let data: object[] = this.getData();
        if (this.parent.groupSettings.columns.length && data['records']) {
            data = data['records'];
        }
        return data;
    }

    private isSelectAllRowCount(count?: number): boolean {
        let rowCount: number = 0;
        const rowObj: Row<Column>[] = this.parent.getRowsObject();
        if (this.parent.selectionSettings.persistSelection && (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)) {
            const dataLen: number = (this.parent.getDataModule().isRemote() || (!isNullOrUndefined(this.parent.dataSource)
             && (<{result: object[]}>this.parent.dataSource).result)) ?
                this.parent.totalDataRecordsCount : this.getData() && this.getData().length;
            if (dataLen === rowObj.length) {
                rowCount = rowObj.filter((e: Row<Column>) => e.isSelectable).length;
                return rowCount && count === rowCount;
            } else {
                return false;
            }

        } else {
            if (this.parent.allowPaging && this.parent.selectionSettings.persistSelection) {
                const disableSelectedRecordsCount: number = this.getAvailableSelectedData(this.parent.disableSelectedRecords).length;
                const partialSelectedRecordsCount: number = this.getAvailableSelectedData(this.parent.partialSelectedRecords).length;
                const selectedRowCount: number = this.getAvailableSelectedData(this.persistSelectedData).length;
                rowCount = disableSelectedRecordsCount + partialSelectedRecordsCount;
                return rowCount === this.totalRecordsCount && selectedRowCount !== 0 && selectedRowCount === partialSelectedRecordsCount;
            } else {
                rowCount = rowObj.filter((e: Row<Column>) => e.isSelectable).length;
                return rowCount && count === rowCount;
            }
        }
    }

    private keyDownHandler(e: KeyboardEvent): void {
        // Below are keyCode for command key in MAC OS. Safari/Chrome(91-Left command, 93-Right Command), Opera(17), FireFox(224)
        if ((Browser.info.name === 'opera' && e.keyCode === 17) || (Browser.info.name === 'mozilla' && e.keyCode === 224) ||
            (((Browser.info.name === 'safari') || (Browser.info.name === 'chrome') ) && (e.keyCode === 91 || e.keyCode === 93))) {
            this.cmdKeyPressed = true;
        }
        const targetHeadCell: Element = parentsUntil(e.target as HTMLElement, 'e-headercell');
        const targetRowCell: Element = parentsUntil(e.target as HTMLElement, literals.rowCell);
        const isCheckBox: boolean = targetHeadCell ? targetHeadCell.children[0].classList.contains('e-headerchkcelldiv') :
            targetRowCell ? targetRowCell.classList.contains('e-gridchkbox') : false;
        if (isCheckBox && !this.parent.allowKeyboard && e.keyCode === 32) {
            e.preventDefault();
        }
    }

    private keyUpHandler(e: KeyboardEvent): void {
        if ((Browser.info.name === 'opera' && e.keyCode === 17) || (Browser.info.name === 'mozilla' && e.keyCode === 224) ||
            (((Browser.info.name === 'safari') || (Browser.info.name === 'chrome') ) && (e.keyCode === 91 || e.keyCode === 93))) {
            this.cmdKeyPressed = false;
        }
    }

    private clickHandler(e: MouseEvent): void {
        let target: HTMLElement = e.target as HTMLElement;
        this.actualTarget = target;
        if (!this.isAutoFillSel && !e.ctrlKey && !e.shiftKey) {
            this.startAFCell = this.endAFCell = null;
        }
        if (this.selectionSettings.persistSelection) {
            this.deSelectedData = iterateExtend(this.persistSelectedData);
        }
        if (parentsUntil(target, literals.row) || parentsUntil(target, 'e-headerchkcelldiv') ||
            (this.selectionSettings.allowColumnSelection && target.classList.contains('e-headercell'))) {
            this.isInteracted = true;
        }
        this.cmdKeyPressed = e.metaKey;
        this.isMultiCtrlRequest = e.ctrlKey || this.enableSelectMultiTouch ||
            (this.isMacOS && this.cmdKeyPressed);
        if (!this.parent.allowKeyboard) {
            this.isMultiShiftRequest = false;
            this.isMultiCtrlRequest = false;
        } else {
            this.isMultiShiftRequest = e.shiftKey;
        }
        this.isMultiCtrlRequestCell = this.isMultiCtrlRequest;
        this.popUpClickHandler(e);
        let chkSelect: boolean = false;
        this.preventFocus = true;
        let checkBox: HTMLInputElement;
        const checkWrap: HTMLElement = parentsUntil(target, 'e-checkbox-wrapper') as HTMLElement;
        this.checkSelectAllClicked = checkWrap && checkWrap.getElementsByClassName('e-checkselectall') ||
            (this.selectionSettings.persistSelection && parentsUntil(target, literals.row)) ? true : false;
        if (this.selectionSettings.persistSelection && this.isPartialSelection && parentsUntil(target, 'e-headerchkcelldiv')
            && !target.querySelector('.e-checkbox-disabled')) {
            this.isHdrSelectAllClicked = true;
        }
        if (checkWrap && checkWrap.querySelectorAll('.e-checkselect,.e-checkselectall').length > 0) {
            checkBox = checkWrap.querySelector('input[type="checkbox"]') as HTMLInputElement;
            chkSelect = true;
        }
        this.drawBorders();
        this.updateAutoFillPosition();
        target = parentsUntil(target, literals.rowCell) as HTMLElement;
        if (this.parent.isReact && (target && !target.parentElement && target.classList.contains('e-rowcell'))) {
            target = this.parent.getCellFromIndex(parseInt(target.getAttribute('data-index'), 10), parseInt(target.getAttribute('aria-colindex'), 10) - 1) as HTMLElement;
        }
        if (this.isRowDragSelected && isNullOrUndefined(target) && this.parent.allowRowDragAndDrop &&
            this.selectionSettings.persistSelection && this.checkSelectAllClicked) {
            this.isRowDragSelected = false;
        }
        if (((target && target.parentElement.classList.contains(literals.row) && !this.parent.selectionSettings.checkboxOnly) || chkSelect)
            && !this.isRowDragSelected) {
            if (this.parent.isCheckBoxSelection) {
                this.isMultiCtrlRequest = true;
            }
            this.target = target;
            if (!isNullOrUndefined(checkBox)) {
                this.checkedTarget = checkBox;
                if (checkBox.classList.contains('e-checkselectall')) {
                    this.checkSelectAll(checkBox);
                } else {
                    this.checkSelect(checkBox);
                }
            } else {
                let rIndex: number = 0;
                rIndex = parseInt(target.parentElement.getAttribute(literals.ariaRowIndex), 10) - 1;
                if (this.parent.isPersistSelection && !this.parent.editSettings.showAddNewRow
                    && this.parent.element.getElementsByClassName(literals.addedRow).length > 0) {
                    ++rIndex;
                }
                if (!this.mUPTarget || !this.mUPTarget.isEqualNode(target)) {
                    this.rowCellSelectionHandler(rIndex, parseInt(target.getAttribute(literals.ariaColIndex), 10) - 1);
                }
                if (this.parent.isCheckBoxSelection) {
                    this.moveIntoUncheckCollection(closest(target, '.' + literals.row) as HTMLElement);
                    this.setCheckAllState();
                }
            }
            if (!this.parent.isCheckBoxSelection && Browser.isDevice && !this.isSingleSel()) {
                this.showPopup(e);
            }
        } else if ((e.target as HTMLTableCellElement).classList.contains('e-headercell') &&
            !(e.target as HTMLTableCellElement).classList.contains('e-stackedheadercell')) {
            const uid: string = (e.target as HTMLTableCellElement).querySelector('.e-headercelldiv').getAttribute('data-mappinguid');
            this.headerSelectionHandler(this.parent.getColumnIndexByUid(uid));
        }
        this.isMultiCtrlRequest = false;
        this.isMultiCtrlRequestCell = this.isMultiCtrlRequest;
        this.isMultiShiftRequest = false;
        if (isNullOrUndefined(closest(<HTMLElement>e.target, '.e-unboundcell'))) {
            this.preventFocus = false;
        }
    }

    private popUpClickHandler(e: MouseEvent): void {
        const target: Element = e.target as Element;
        if (closest(target, '.e-headercell') || (e.target as HTMLElement).classList.contains(literals.rowCell) ||
            closest(target, '.e-gridpopup')) {
            if (target.classList.contains('e-rowselect')) {
                if (!target.classList.contains('e-spanclicked')) {
                    target.classList.add('e-spanclicked');
                    this.enableSelectMultiTouch = true;
                } else {
                    target.classList.remove('e-spanclicked');
                    this.enableSelectMultiTouch = false;
                    (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
                }
            }
        } else {
            (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        }
    }

    private showPopup(e: MouseEvent): void {
        if (!this.selectionSettings.enableSimpleMultiRowSelection) {
            setCssInGridPopUp(
                <HTMLElement>this.parent.element.querySelector('.e-gridpopup'), e,
                'e-rowselect e-icons e-icon-rowselect' +
                (!this.isSingleSel() && (this.selectedRecords.length > 1
                    || this.selectedRowCellIndexes.length > 1) ? ' e-spanclicked' : ''));
        }
    }

    private rowCellSelectionHandler(rowIndex: number, cellIndex: number): void {
        if ((!this.isMultiCtrlRequest && !this.isMultiShiftRequest) || this.isSingleSel()) {
            if (!this.isDragged) {
                this.selectRow(rowIndex, this.selectionSettings.enableToggle);
            }
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, this.selectionSettings.enableToggle);
            if (this.selectedRowCellIndexes.length) {
                this.updateAutoFillPosition();
            }
            this.drawBorders();
        } else if (this.isMultiShiftRequest) {
            const isChkBox: boolean = closest(this.target, '.' + literals.rowCell).classList.contains(literals.gridChkBox);
            if (this.parent.isCheckBoxSelection || (!this.parent.isCheckBoxSelection && !isChkBox)
                || (this.parent.getColumns().some((col: Column) => col.type === 'checkbox')
                && this.selectionSettings.checkboxMode === 'ResetOnRowClick' && isChkBox)) {
                this.selectRowsByRange(isUndefined(this.prevRowIndex) ? rowIndex : this.prevRowIndex, rowIndex);
            } else {
                this.addRowsToSelection([rowIndex]);
            }
            this.selectCellsByRange(
                isUndefined(this.prevCIdxs) ? { rowIndex: rowIndex, cellIndex: cellIndex } : this.prevCIdxs,
                { rowIndex: rowIndex, cellIndex: cellIndex });
            this.updateAutoFillPosition();
            this.drawBorders();
        } else {
            this.addRowsToSelection([rowIndex]);
            if (this.selectionSettings.mode === 'Both') {
                const checkboxColumn: Column = this.parent.getColumns().find((col: Column) => col.type === 'checkbox');
                const checkboxColumnIndexCheck: boolean = checkboxColumn && checkboxColumn.index !== cellIndex;
                if (checkboxColumnIndexCheck && !this.isMultiCtrlRequestCell) {
                    this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, this.selectionSettings.enableToggle);
                } else if (!checkboxColumn || checkboxColumnIndexCheck)  {
                    this.addCellsToSelection([{ rowIndex: rowIndex, cellIndex: cellIndex }]);
                }
            } else {
                this.addCellsToSelection([{ rowIndex: rowIndex, cellIndex: cellIndex }]);
            }
            this.showHideBorders('none');
        }
        this.isDragged = false;
    }

    private onCellFocused(e: CellFocusArgs): void {
        if (this.parent.frozenRows && e.container.isHeader && e.byKey) {
            if (e.keyArgs.action === 'upArrow') {
                if (this.parent.allowFiltering) {
                    e.isJump = e.element.tagName === 'INPUT' ? true : false;
                } else {
                    e.isJump = e.element.tagName === 'TH' ? true : false;
                }
            } else {
                if (e.keyArgs.action === 'downArrow') {
                    const rIdx: number = Number(e.element.parentElement.getAttribute(literals.ariaRowIndex)) - 1;
                    e.isJump = rIdx === 0 ? true : false;
                } else {
                    if (e.keyArgs.action === 'ctrlHome') {
                        e.isJump = true;
                    }
                }
            }
        }
        const clear: boolean = ((e.container.isHeader && e.isJump) ||
                (e.container.isContent && !e.container.isSelectable)) && !(e.byKey && e.keyArgs.action === 'space')
                 && !(e.element.classList.contains('e-detailrowexpand') || e.element.classList.contains('e-detailrowcollapse'));
        const headerAction: boolean = (e.container.isHeader && e.element.tagName !== 'TD' && !closest(e.element, '.' + literals.rowCell))
            && !(e.byKey && e.keyArgs.action === 'space');
        if (!e.byKey || clear) {
            if (clear && !(this.parent.isCheckBoxSelection || (this.selectionSettings.persistSelection && (e.parent.classList.contains('e-recordplusexpand') ||
            e.parent.classList.contains('e-recordpluscollapse') || e.parent.classList.contains('e-groupcaption'))))) { this.clearSelection(); }
            return;
        }
        let [rowIndex, cellIndex]: number[] = e.container.isContent ? e.container.indexes : e.indexes;
        const prev: IIndex = this.focus.getPrevIndexes();
        if (e.element.parentElement.querySelector('.e-rowcelldrag') || e.element.parentElement.querySelector('.e-dtdiagonalright')
            || e.element.parentElement.querySelector('.e-dtdiagonaldown') ) {
            prev.cellIndex = prev.cellIndex - 1;
        }
        if (this.parent.frozenRows) {
            if (e.container.isHeader && (e.element.tagName === 'TD' || closest(e.element, '.' + literals.rowCell))) {
                let hdrLength: number = this.parent.getHeaderTable().querySelector('thead').childElementCount;
                if (this.parent.editSettings.showAddNewRow && this.parent.editSettings.newRowPosition === 'Top' &&
                    e.keyArgs.action === 'upArrow') {
                    hdrLength++;
                }
                rowIndex -= hdrLength;
                prev.rowIndex = !isNullOrUndefined(prev.rowIndex) ? prev.rowIndex - hdrLength : null;
            } else {
                rowIndex += this.parent.frozenRows;
                prev.rowIndex = prev.rowIndex === 0 || !isNullOrUndefined(prev.rowIndex) ? prev.rowIndex + this.parent.frozenRows : null;
            }
        }
        if (this.parent.enableInfiniteScrolling && this.parent.infiniteScrollSettings.enableCache) {
            rowIndex = parseInt(e.element.parentElement.getAttribute('aria-rowindex'), 10) - 1;
        }
        if ((headerAction || (['ctrlPlusA', 'escape'].indexOf(e.keyArgs.action) === -1 &&
            e.keyArgs.action !== 'space' && rowIndex === prev.rowIndex && cellIndex === prev.cellIndex)) &&
            !this.selectionSettings.allowColumnSelection) { return; }
        if (this.parent.enableVirtualization) {
            rowIndex = parseInt(e.element.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            if (!this.parent.enableColumnVirtualization && !this.parent.groupSettings.columns.length &&
                this.parent.totalDataRecordsCount >= 1) {
                if (e.keyArgs.action === 'ctrlHome') {
                    rowIndex = 0;
                    this.parent.isFocusFirstCell = true;
                } else if (e.keyArgs.action === 'ctrlEnd') {
                    rowIndex = this.parent.totalDataRecordsCount - 1;
                    this.isFocusLastCell = true;
                }
            }
        }
        if (this.parent.editSettings.showAddNewRow && this.parent.editSettings.newRowPosition === 'Top' &&
            (!this.parent.enableVirtualization && !this.parent.enableInfiniteScrolling) && e.keyArgs.action === 'downArrow') {
            rowIndex--;
        }
        this.preventFocus = true;
        const columnIndex: number = this.getKeyColIndex(e);
        if (this.needColumnSelection) {
            cellIndex = columnIndex;
        }
        if (this.parent.element.classList.contains('e-gridcell-read') && (e.keyArgs.action === 'tab' || e.keyArgs.action === 'shiftTab'
            || e.keyArgs.action === 'rightArrow' || e.keyArgs.action === 'leftArrow')) {
            let targetLabel: string = this.target.getAttribute('aria-label');
            targetLabel = this.target.innerHTML + ' column header ' + this.parent.getColumnByIndex(cellIndex).field;
            this.target.setAttribute('aria-label', targetLabel);
        }
        switch (e.keyArgs.action) {
        case 'downArrow':
        case 'upArrow':
        case 'enter':
        case 'shiftEnter':
            this.target = e.element;
            this.isKeyAction = true;
            this.applyDownUpKey(rowIndex, cellIndex);
            break;
        case 'rightArrow':
        case 'leftArrow':
            this.applyRightLeftKey(rowIndex, cellIndex);
            break;
        case 'shiftDown':
        case 'shiftUp':
            this.shiftDownKey(rowIndex, cellIndex);
            break;
        case 'shiftLeft':
        case 'shiftRight':
            this.applyShiftLeftRightKey(rowIndex, cellIndex);
            break;
        case 'home':
        case 'end':
            cellIndex = e.keyArgs.action === 'end' ? this.getLastColIndex(rowIndex) : 0;
            this.applyHomeEndKey(rowIndex, cellIndex);
            break;
        case 'ctrlHome':
        case 'ctrlEnd':
            this.applyCtrlHomeEndKey(rowIndex, cellIndex);
            break;
        case 'escape':
            this.clearSelection();
            if (this.parent.clipboardModule) {
                window.navigator['clipboard'].writeText('');
            }
            break;
        case 'ctrlPlusA':
            this.ctrlPlusA();
            break;
        case 'space':
            this.applySpaceSelection(e.element as HTMLElement);
            break;
        case 'tab':
            if (this.parent.editSettings.allowNextRowEdit) {
                this.selectRow(rowIndex);
            }
            break;
        }
        this.needColumnSelection = false;
        this.preventFocus = false;
        this.positionBorders();
        if (this.parent.isFrozenGrid()) {
            this.showHideBorders('none', true);
            this.refreshFrozenBorders();
        }
        this.updateAutoFillPosition();
    }

    private getKeyColIndex(e: CellFocusArgs): number {
        let uid: string;
        let index: number = null;
        const stackedHeader: HTMLElement = (e.element as HTMLTableCellElement).querySelector('.e-stackedheadercelldiv');
        if (this.selectionSettings.allowColumnSelection && parentsUntil(e.element, 'e-columnheader')) {
            this.needColumnSelection = e.container.isHeader ? true : false;
            if (stackedHeader) {
                if (e.keyArgs.action === 'rightArrow' || e.keyArgs.action === 'leftArrow') {
                    return index;
                }
                uid = stackedHeader.getAttribute('data-mappinguid');
                const innerColumn: Column[] = this.getstackedColumns(this.parent.getColumnByUid(uid).columns as Column[]);
                const lastIndex: number = this.parent.getColumnIndexByUid(innerColumn[innerColumn.length - 1].uid);
                const firstIndex: number = this.parent.getColumnIndexByUid(innerColumn[0].uid);
                index = this.prevColIndex >= lastIndex ? firstIndex : lastIndex;
            } else {
                if (!isNullOrUndefined(e.element.querySelector('.e-headercelldiv'))) {
                    index = this.parent.getColumnIndexByUid((e.element as HTMLTableCellElement)
                        .querySelector('.e-headercelldiv').getAttribute('data-mappinguid'));
                }
            }
        }
        return index;
    }

    /**
     * Apply ctrl + A key selection
     *
     * @returns {void}
     * @hidden
     */
    public ctrlPlusA(): void {
        if (this.isRowType() && !this.isSingleSel()) {
            const rowObj: Row<Column>[] = this.parent.getRowsObject();
            this.selectRowsByRange(rowObj[0].index, rowObj[rowObj.length - 1].index);
        }
        if (this.isCellType() && !this.isSingleSel()) {
            this.selectCellsByRange(
                { rowIndex: 0, cellIndex: 0 },
                { rowIndex: this.parent.getRows().length - 1, cellIndex: this.parent.getColumns().length - 1 });
        }
    }

    private applySpaceSelection(target: HTMLElement): void {
        if (target.classList.contains('e-checkselectall')) {
            this.checkedTarget = target as HTMLInputElement;
            this.checkSelectAll(this.checkedTarget);
        } else {
            if (target.classList.contains('e-checkselect')) {
                this.checkedTarget = target as HTMLInputElement;
                this.checkSelect(this.checkedTarget);
            }
        }
    }

    private applyDownUpKey(rowIndex?: number, cellIndex?: number): void {
        const gObj: IGrid = this.parent;
        if (this.parent.isCheckBoxSelection && this.parent.checkAllRows === 'Check' && !this.selectionSettings.persistSelection &&
            !this.selectionSettings.checkboxOnly) {
            this.checkSelectAllAction(false);
            this.checkedTarget = null;
        }
        if (this.isRowType() && !this.selectionSettings.checkboxOnly) {
            if (this.parent.frozenRows) {
                this.selectRow(rowIndex, true);
                this.applyUpDown(gObj.selectedRowIndex);
            } else {
                this.selectRow(rowIndex, true);
                this.applyUpDown(gObj.selectedRowIndex);
            }
        }
        if (this.isCellType()) {
            this.selectCell({ rowIndex, cellIndex }, true);
        }
        if (this.selectionSettings.allowColumnSelection && this.needColumnSelection) {
            this.selectColumn(cellIndex);
        }
    }

    private applyUpDown(rowIndex: number): void {
        if (rowIndex < 0) { return; }
        if (!this.target) {
            this.target = this.parent.getRows()[0].children[this.parent.groupSettings.columns.length || 0];
        }
        const cIndex: number = parseInt(this.target.getAttribute(literals.ariaColIndex), 10) - 1;
        const row: Element = this.contentRenderer.getRowByIndex(rowIndex);
        if (row) {
            this.target = row.getElementsByClassName(literals.rowCell)[parseInt(cIndex.toString(), 10)];
        }
        this.addAttribute(this.target);
        if (this.parent.element.classList.contains('e-gridcell-read')){
            let targetLabel: string = this.target.getAttribute('aria-label');
            targetLabel = this.target.innerHTML;
            this.target.setAttribute('aria-label', targetLabel);
        }
    }

    private applyRightLeftKey(rowIndex?: number, cellIndex?: number): void {
        if (this.selectionSettings.allowColumnSelection && this.needColumnSelection) {
            this.selectColumn(cellIndex);
        } else if (this.isCellType()) {
            this.selectCell({ rowIndex, cellIndex }, true);
            this.addAttribute(this.target);
        }
    }

    private applyHomeEndKey(rowIndex?: number, cellIndex?: number): void {
        if (this.isCellType()) {
            this.selectCell({ rowIndex, cellIndex }, true);
        } else {
            this.addAttribute(this.parent.getCellFromIndex(rowIndex, cellIndex));
        }
    }

    /**
     * Apply shift+down key selection
     *
     * @param {number} rowIndex - specfies the rowIndex
     * @param {number} cellIndex - specifies the CellIndex
     * @returns {void}
     * @hidden
     */
    public shiftDownKey(rowIndex?: number, cellIndex?: number): void {
        this.isMultiShiftRequest = true;
        if (this.isRowType() && !this.isSingleSel()) {
            if (!isUndefined(this.prevRowIndex)) {
                this.selectRowsByRange(this.prevRowIndex, rowIndex);
                this.applyUpDown(rowIndex);
            } else if (this.isPartialSelection) {
                this.selectRow(rowIndex, true);
            } else {
                this.selectRow(0, true);
            }
        }
        if (this.isCellType() && !this.isSingleSel()) {
            this.selectCellsByRange(this.prevCIdxs || { rowIndex: 0, cellIndex: 0 }, { rowIndex, cellIndex });
        }
        this.isMultiShiftRequest = false;
    }

    private applyShiftLeftRightKey(rowIndex?: number, cellIndex?: number): void {
        this.isMultiShiftRequest = true;
        if (this.selectionSettings.allowColumnSelection && this.needColumnSelection) {
            this.selectColumnsByRange(this.prevColIndex, cellIndex);
        } else {
            this.selectCellsByRange(this.prevCIdxs, { rowIndex, cellIndex });
        }
        this.isMultiShiftRequest = false;
    }

    private getstackedColumns(column: Column[]): Column[] {
        const innerColumnIndexes: Column[] = [];
        for (let i: number = 0, len: number = column.length; i < len; i++) {
            if (column[parseInt(i.toString(), 10)].columns) {
                this.getstackedColumns(column[parseInt(i.toString(), 10)].columns as Column[]);
            } else {
                innerColumnIndexes.push(column[parseInt(i.toString(), 10)]);
            }
        }
        return innerColumnIndexes;
    }

    private applyCtrlHomeEndKey(rowIndex: number, cellIndex: number): void {
        if (this.isRowType()) {
            this.selectRow(rowIndex, true);
            if (!(this.parent.enableVirtualization || this.parent.enableColumnVirtualization)) {
                this.addAttribute(this.parent.getCellFromIndex(rowIndex, cellIndex));
            }
        }
        if (this.isCellType()) {
            this.selectCell({ rowIndex, cellIndex }, true);
        }
    }

    private addRemoveClassesForRow(row: Element, isAdd: boolean, clearAll: boolean, ...args: string[]): void {
        if (row) {
            const cells: Element[] = [].slice.call(row.getElementsByClassName(literals.rowCell));
            const detailIndentCell: Element = row.querySelector('.e-detailrowcollapse') || row.querySelector('.e-detailrowexpand');
            const dragdropIndentCell: Element = row.querySelector('.e-rowdragdrop');
            if (detailIndentCell) { cells.push(detailIndentCell); }
            if (dragdropIndentCell) { cells.push(dragdropIndentCell); }
            addRemoveActiveClasses(cells, isAdd, ...args);
        }
        this.getRenderer().setSelection(row ? row.getAttribute('data-uid') : null, isAdd, clearAll);
    }

    private isRowType(): boolean {
        return this.selectionSettings.mode === 'Row' || this.selectionSettings.mode === 'Both';
    }

    private isCellType(): boolean {
        return this.selectionSettings.mode === 'Cell' || this.selectionSettings.mode === 'Both';
    }

    private isSingleSel(): boolean {
        return this.selectionSettings.type === 'Single';
    }

    private getRenderer(): IRenderer {
        if (isNullOrUndefined(this.contentRenderer)) {
            this.contentRenderer = this.factory.getRenderer(RenderType.Content);
        }
        return this.contentRenderer;
    }

    /**
     * Gets the collection of selected records.
     *
     * @returns {Object[]} returns the Object
     */
    public getSelectedRecords(): Object[] {
        let selectedData: Object[] = [];
        if (!this.selectionSettings.persistSelection && this.selectedRecords.length) {
            selectedData = (<Row<Column>[]>this.parent.getRowsObject()).filter((row: Row<Column>) => row.isSelected)
                .map((m: Row<Column>) => m.data);
        } else {
            selectedData = this.persistSelectedData;
        }
        if (this.checkVirtualCheckBox() && !this.parent.isPersistSelection) {
            selectedData = this.virtualSelectedData;
        }
        return selectedData;
    }

    /**
     * Select the column by passing start column index
     *
     * @param {number} index - specifies the index
     * @returns {void}
     */
    public selectColumn(index: number): void {
        const gObj: IGrid = this.parent;
        if (isNullOrUndefined(gObj.getColumns()[parseInt(index.toString(), 10)])) {
            return;
        }
        const column: Column = gObj.getColumnByIndex(index);
        const selectedCol: Element = gObj.getColumnHeaderByUid(column.uid);
        const isColSelected: boolean = selectedCol.classList.contains('e-columnselection');
        if ((!gObj.selectionSettings.allowColumnSelection)) {
            return;
        }
        const isMultiColumns: boolean = this.selectedColumnsIndexes.length > 1 &&
            this.selectedColumnsIndexes.indexOf(index) > -1;
        this.clearColDependency();
        if (!this.selectionSettings.enableToggle || isMultiColumns || !isColSelected) {
            const args: ColumnSelectingEventArgs = {
                columnIndex: index, headerCell: selectedCol,
                column: column,
                cancel: false, target: this.actualTarget,
                isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
            };
            this.onActionBegin(args, events.columnSelecting);
            if (args.cancel) {
                this.disableInteracted();
                return;
            }
            if (isMultiColumns || !(isColSelected && gObj.selectionSettings.enableToggle && index === this.prevColIndex)) {
                this.updateColSelection(selectedCol, index);
            }
            const selectedArgs: ColumnSelectEventArgs = {
                columnIndex: index, headerCell: selectedCol,
                column: column,
                target: this.actualTarget,
                isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex
            };
            this.onActionComplete(selectedArgs, events.columnSelected);
        }
        this.updateColProps(index);
    }

    /**
     * Select the columns by passing start and end column index
     *
     * @param  {number} startIndex - specifies the start index
     * @param  {number} endIndex - specifies the end index
     * @returns {void}
     */
    public selectColumnsByRange(startIndex: number, endIndex?: number): void {
        const gObj: IGrid = this.parent;
        if (isNullOrUndefined(gObj.getColumns()[parseInt(startIndex.toString(), 10)])) {
            return;
        }
        const indexes: number[] = [];
        if (gObj.selectionSettings.type === 'Single' || isNullOrUndefined(endIndex)) {
            indexes[0] = startIndex;
        } else {
            const min: boolean = startIndex < endIndex;
            for (let i: number = startIndex; min ? i <= endIndex : i >= endIndex; min ? i++ : i--) {
                indexes.push(i);
            }
        }
        this.selectColumns(indexes);
    }

    /**
     * Select the columns by passing column indexes
     *
     * @param  {number[]} columnIndexes - specifies the columnIndexes
     * @returns {void}
     */
    public selectColumns(columnIndexes: number[]): void {
        const gObj: IGrid = this.parent;
        let selectedCol: Element[] | Element = this.getselectedCols();
        if (gObj.selectionSettings.type === 'Single') {
            columnIndexes = [columnIndexes[0]];
        }
        if (!gObj.selectionSettings.allowColumnSelection) {
            return;
        }
        this.clearColDependency();
        const selectingArgs: ColumnSelectingEventArgs = {
            columnIndex: columnIndexes[0], headerCell: selectedCol,
            columnIndexes: columnIndexes,
            column: gObj.getColumnByIndex(columnIndexes[0]),
            cancel: false, target: this.actualTarget,
            isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex,
            isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
        };
        this.onActionBegin(selectingArgs, events.columnSelecting);
        if (selectingArgs.cancel) {
            this.disableInteracted();
            return;
        }
        for (let i: number = 0, len: number = columnIndexes.length; i < len; i++) {
            this.updateColSelection(
                gObj.getColumnHeaderByUid(
                    gObj.getColumnByIndex(
                        columnIndexes[parseInt(i.toString(), 10)]).uid),
                columnIndexes[parseInt(i.toString(), 10)]);
        }
        selectedCol = this.getselectedCols();
        const selectedArgs: ColumnSelectEventArgs = {
            columnIndex: columnIndexes[0], headerCell: selectedCol,
            columnIndexes: columnIndexes,
            column: gObj.getColumnByIndex(columnIndexes[0]),
            target: this.actualTarget,
            isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex
        };
        this.onActionComplete(selectedArgs, events.columnSelected);
        this.updateColProps(columnIndexes[0]);
    }

    /**
     * Select the column with existing column by passing column index
     *
     * @param  {number} startIndex - specifies the start index
     * @returns {void}
     */
    public selectColumnWithExisting(startIndex: number): void {
        const gObj: IGrid = this.parent;
        if (isNullOrUndefined(gObj.getColumns()[parseInt(startIndex.toString(), 10)])) {
            return;
        }
        const newCol: Element = gObj.getColumnHeaderByUid(gObj.getColumnByIndex(startIndex).uid);
        let selectedCol: Element[] | Element = this.getselectedCols();
        if (gObj.selectionSettings.type === 'Single') {
            this.clearColDependency();
        }
        if (!gObj.selectionSettings.allowColumnSelection) {
            return;
        }
        if (this.selectedColumnsIndexes.indexOf(startIndex) > -1) {
            this.clearColumnSelection(startIndex);
        } else {
            const selectingArgs: ColumnSelectingEventArgs = {
                columnIndex: startIndex, headerCell: selectedCol,
                columnIndexes: this.selectedColumnsIndexes,
                column: gObj.getColumnByIndex(startIndex),
                cancel: false, target: this.actualTarget,
                isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
            };
            this.onActionBegin(selectingArgs, events.columnSelecting);
            if (selectingArgs.cancel) {
                this.disableInteracted();
                return;
            }
            this.updateColSelection(newCol, startIndex);
            selectedCol = this.getselectedCols();
            const selectedArgs: ColumnSelectEventArgs = {
                columnIndex: startIndex, headerCell: selectedCol,
                column: gObj.getColumnByIndex(startIndex),
                columnIndexes: this.selectedColumnsIndexes,
                target: this.actualTarget,
                isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex
            };
            this.onActionComplete(selectedArgs, events.columnSelected);
        }
        this.updateColProps(startIndex);
    }

    /**
     * Clear the column selection
     *
     * @param {number} clearIndex - specifies the clearIndex
     * @returns {void}
     */
    public clearColumnSelection(clearIndex?: number): void {
        if (this.isColumnSelected) {
            const gObj: IGrid = this.parent;
            if (!isNullOrUndefined(clearIndex) && this.selectedColumnsIndexes.indexOf(clearIndex) === -1) {
                return;
            }
            const index: number = !isNullOrUndefined(clearIndex) ? clearIndex :
                this.selectedColumnsIndexes[this.selectedColumnsIndexes.length - 1];
            const column: Column = gObj.getColumnByIndex(index);
            const selectedCol: Element = gObj.getColumnHeaderByUid(column.uid);
            const deselectedArgs: ColumnDeselectEventArgs = {
                columnIndex: index, headerCell: selectedCol,
                columnIndexes: this.selectedColumnsIndexes,
                column: column,
                cancel: false, target: this.actualTarget,
                isInteracted: this.isInteracted
            };
            const isCanceled: boolean = this.columnDeselect(deselectedArgs, events.columnDeselecting);
            if (isCanceled) {
                this.disableInteracted();
                return;
            }
            const selectedHeader: Element[] = !isNullOrUndefined(clearIndex) ? [selectedCol] :
                [].slice.call(gObj.getHeaderContent().getElementsByClassName('e-columnselection'));
            const selectedCells: Element[] = this.getSelectedColumnCells(clearIndex);
            for (let i: number = 0, len: number = selectedHeader.length; i < len; i++) {
                addRemoveActiveClasses([selectedHeader[parseInt(i.toString(), 10)]], false, 'e-columnselection');
            }
            for (let i: number = 0, len: number = selectedCells.length; i < len; i++) {
                addRemoveActiveClasses([selectedCells[parseInt(i.toString(), 10)]], false, 'e-columnselection');
            }
            if (!isNullOrUndefined(clearIndex)) {
                this.selectedColumnsIndexes.splice(this.selectedColumnsIndexes.indexOf(clearIndex), 1);
                this.parent.getColumns()[parseInt(clearIndex.toString(), 10)].isSelected = false;
            } else {
                this.columnDeselect(deselectedArgs, events.columnDeselected);
                this.selectedColumnsIndexes = [];
                this.isColumnSelected = false;
                this.parent.getColumns().filter((col: Column) => col.isSelected = false);
            }
        }
    }

    private getselectedCols(): Element[] {
        const gObj: IGrid = this.parent;
        let selectedCol: Element | Element[];
        if (this.selectedColumnsIndexes.length > 1) {
            selectedCol = [];
            for (let i: number = 0; i < this.selectedColumnsIndexes.length; i++) {
                (selectedCol).push(
                    gObj.getColumnHeaderByUid(
                        gObj.getColumnByIndex(this.selectedColumnsIndexes[parseInt(i.toString(), 10)]).uid));
            }
        } else {
            selectedCol = gObj.getColumnHeaderByUid(gObj.getColumnByIndex(this.selectedColumnsIndexes[0]).uid);
        }
        return selectedCol as Element[];
    }

    private getSelectedColumnCells(clearIndex?: number): Element[] {
        const gObj: IGrid = this.parent;
        const isRowTemplate: boolean = !isNullOrUndefined(this.parent.rowTemplate);
        const rows: Element[] = isRowTemplate ? gObj.getRows() : gObj.getDataRows();
        let seletedcells: Element[] = [];
        const selectionString: string = !isNullOrUndefined(clearIndex) ? '[aria-colindex="' + (clearIndex + 1) + '"]' : '.e-columnselection';
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            seletedcells = seletedcells.concat([].slice.call(rows[parseInt(i.toString(), 10)].querySelectorAll(selectionString)));
        }
        return seletedcells;
    }

    private columnDeselect(args: ColumnDeselectEventArgs, event: string): boolean {
        if (event === 'columnDeselected') {
            delete args.cancel;
        }
        this.onActionComplete(args, event);
        return args.cancel;
    }

    private updateColProps(startIndex: number): void {
        this.prevColIndex = startIndex;
        this.isColumnSelected = this.selectedColumnsIndexes.length && true;
    }

    private clearColDependency(): void {
        this.clearColumnSelection();
        this.selectedColumnsIndexes = [];
    }

    private updateColSelection(selectedCol: Element, startIndex: number): void {
        if (isNullOrUndefined(this.parent.getColumns()[parseInt(startIndex.toString(), 10)])) {
            return;
        }
        const isRowTemplate: boolean = !isNullOrUndefined(this.parent.rowTemplate);
        const rows: Element[] = isRowTemplate ? this.parent.getRows() : this.parent.getDataRows();
        this.selectedColumnsIndexes.push(startIndex);
        this.parent.getColumns()[parseInt(startIndex.toString(), 10)].isSelected = true;
        startIndex = startIndex + this.parent.getIndentCount();
        addRemoveActiveClasses([selectedCol], true, 'e-columnselection');
        for (let j: number = 0, len: number = rows.length; j < len; j++) {
            if (rows[parseInt(j.toString(), 10)].classList.contains(literals.row)) {
                if ((rows[parseInt(j.toString(), 10)].classList.contains(literals.editedRow)
                    || rows[parseInt(j.toString(), 10)].classList.contains(literals.addedRow))
                    && this.parent.editSettings.mode === 'Normal'
                    && !isNullOrUndefined(rows[parseInt(j.toString(), 10)].querySelector('tr').childNodes[parseInt(startIndex.toString(), 10)])) {
                    addRemoveActiveClasses([rows[parseInt(j.toString(), 10)].querySelector('tr').childNodes[parseInt(startIndex.toString(), 10)] as Element], true, 'e-columnselection');
                } else {
                    if (this.parent.isSpan && this.parent.isFrozenGrid()) {
                        const cells: NodeListOf<Element> = rows[parseInt(j.toString(), 10)].querySelectorAll('.e-rowcell');
                        for (let i: number = 0; i < cells.length; i++) {
                            if (cells[parseInt(i.toString(), 10)].getAttribute('aria-colindex') === selectedCol.getAttribute('aria-colindex')) {
                                addRemoveActiveClasses([cells[parseInt(i.toString(), 10)]], true, 'e-columnselection');
                            }
                        }
                    } else if (!isNullOrUndefined(rows[parseInt(j.toString(), 10)].childNodes[parseInt(startIndex.toString(), 10)])) {
                        addRemoveActiveClasses([rows[parseInt(j.toString(), 10)].childNodes[parseInt(startIndex.toString(), 10)] as Element], true, 'e-columnselection');
                    }
                }
            }
        }
    }

    private headerSelectionHandler(colIndex: number): void {
        if ((!this.isMultiCtrlRequest && !this.isMultiShiftRequest) || this.isSingleSel()) {
            this.selectColumn(colIndex);
        } else if (this.isMultiShiftRequest) {
            this.selectColumnsByRange(isUndefined(this.prevColIndex) ? colIndex : this.prevColIndex, colIndex);
        } else {
            this.selectColumnWithExisting(colIndex);
        }
    }

    // eslint-disable-next-line camelcase
    private addEventListener_checkbox(): void {
        this.parent.on(events.dataReady, this.dataReady, this);
        this.onDataBoundFunction = this.onDataBound.bind(this);
        this.parent.addEventListener(events.dataBound, this.onDataBoundFunction);
        this.parent.on(events.refreshInfinitePersistSelection, this.onDataBoundFunction);
        this.parent.on(events.contentReady, this.checkBoxSelectionChanged, this);
        this.parent.on(events.beforeRefreshOnDataChange, this.initPerisistSelection, this);
        this.parent.on(events.onEmpty, this.setCheckAllForEmptyGrid, this);
        this.actionCompleteFunc = this.actionCompleteHandler.bind(this);
        this.parent.addEventListener(events.actionComplete, this.actionCompleteFunc);
        this.parent.on(events.click, this.clickHandler, this);
        this.resizeEndFn = () => {
            this.updateAutoFillPosition();
            this.drawBorders();
        };
        this.resizeEndFn.bind(this);
        this.parent.addEventListener(events.resizeStop, this.resizeEndFn);
    }

    // eslint-disable-next-line camelcase
    public removeEventListener_checkbox(): void {
        this.parent.off(events.dataReady, this.dataReady);
        this.parent.removeEventListener(events.dataBound, this.onDataBoundFunction);
        this.parent.removeEventListener(events.actionComplete, this.actionCompleteFunc);
        this.parent.off(events.refreshInfinitePersistSelection, this.onDataBoundFunction);
        this.parent.off(events.onEmpty, this.setCheckAllForEmptyGrid);
        this.parent.off(events.click, this.clickHandler);
        this.parent.removeEventListener(events.resizeStop, this.resizeEndFn);
        this.parent.off(events.beforeRefreshOnDataChange, this.initPerisistSelection);
    }

    private setCheckAllForEmptyGrid(): void {
        const checkAllBox: HTMLElement = this.getCheckAllBox();
        if (checkAllBox) {
            this.parent.isCheckBoxSelection = true;
            const spanEle: HTMLElement = checkAllBox.nextElementSibling as HTMLElement;
            removeClass([spanEle], ['e-check', 'e-stop', 'e-uncheck']);
            addClass([spanEle.parentElement], ['e-checkbox-disabled']);
        }
    }

    public dataReady(e: { requestType: string }): void {
        this.isHeaderCheckboxClicked = false;
        const isInfinitecroll: boolean = this.parent.enableInfiniteScrolling && e.requestType === 'infiniteScroll';
        if (e.requestType !== 'virtualscroll' && !this.parent.isPersistSelection && !isInfinitecroll) {
            this.disableUI = !this.parent.enableImmutableMode && !(e.requestType === 'save' && e['action'] === 'add');
            this.clearSelection();
            this.setCheckAllState();
            this.disableUI = false;
        }
    }

    private actionCompleteHandler(e: { requestType: string, action: string, selectedRow: number }): void {
        if (e.requestType === 'save' && this.parent.isPersistSelection) {
            this.refreshPersistSelection();
        }
    }

    private selectRowIndex(index: number): void {
        this.parent.isSelectedRowIndexUpdating = true;
        if ((isNullOrUndefined(this.parent.selectedRowIndex) || this.parent.selectedRowIndex === -1) || !this.parent.enablePersistence) {
            this.parent.selectedRowIndex = index;
        }
        else {
            this.parent.selectedRowIndex = -1;
        }
    }

    private disableInteracted(): void {
        this.isInteracted = false;
    }

    private activeTarget(): void {
        this.actualTarget = this.isInteracted ? this.actualTarget : null;
    }
}
