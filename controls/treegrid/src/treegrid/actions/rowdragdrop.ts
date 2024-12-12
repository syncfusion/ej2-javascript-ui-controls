import { TreeGrid } from '../base/treegrid';
import { Grid, RowDD as GridDragDrop, RowDropEventArgs, parentsUntil } from '@syncfusion/ej2-grids';
import { EJ2Intance, getObject, Scroll } from '@syncfusion/ej2-grids';
import { closest, isNullOrUndefined, setValue, extend, getValue, removeClass, addClass, setStyleAttribute } from '@syncfusion/ej2-base';
import { ITreeData } from '../base';
import { DataManager } from '@syncfusion/ej2-data';
import * as events from '../base/constant';
import { editAction } from './crud-actions';
import { getParentData, findChildrenRecords, isRemoteData, isOffline, isCountRequired } from '../utils';
import { TreeActionEventArgs } from '../models';
import { RowDragEventArgs } from '../base';

/**
 * TreeGrid RowDragAndDrop module
 *
 * @hidden
 */
export class RowDD {
    private parent: TreeGrid;
    /** @hidden
     * Represents the position where a row can be dropped within the TreeGrid.
     */
    private dropPosition: string;
    /** @hidden
     * Represents the record that is currently being dragged in the TreeGrid.
     */
    private draggedRecord: ITreeData;
    /** @hidden
     * Represents the record that the currently dragged item is being dropped onto in the TreeGrid.
     */
    private droppedRecord: ITreeData;
    /** @hidden
     * Stores the data representation of the TreeGrid, including hierarchical structures.
     */
    public treeGridData: ITreeData[];
    /** @hidden
     * Represents the underlying hierarchical data of the TreeGrid.
     */
    private treeData: ITreeData[];
    /** @hidden
     * Indicates whether a row can be dropped into the current target position during a drag-and-drop operation.
     */
    private canDrop: boolean = true;
    /** @hidden
     * Indicates whether the current drag operation includes child records of the dragged item.
     */
    private isDraggedWithChild: boolean = false;
    /** @hidden
     *
     */
    public isMultipleGrid: string;
    /** @hidden
     * Indicates whether multiple TreeGrid instances are being managed or displayed.
     */
    private modifiedRecords: string = 'modifiedRecords';
    /** @hidden
     * Represents the currently selected item in the TreeGrid.
     */
    private selectedItem: ITreeData;
    /** @hidden
     * Represents the currently selected item in the TreeGrid.
     */
    private selectedRecords: string = 'selectedRecords';
    /** @hidden
     * Holds an array of currently selected records in the TreeGrid.
     */
    private selectedRows: string = 'selectedRows';
    /** @hidden
     * Indicates whether there is a droppable item in the TreeGrid.
     */
    private hasDropItem: boolean = true;
    /** @hidden
     * Indicates whether the item is being added to the bottom of the TreeGrid.
     */
    public isaddtoBottom: boolean = false;
    private selectedRecord: ITreeData;
    private selectedRow: HTMLTableRowElement;

    /**
     * Constructor for render module
     *
     * @param {TreeGrid} parent - Tree Grid instance
     */
    constructor(parent?: TreeGrid) {
        Grid.Inject(GridDragDrop);
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * Retrieves child records for a specified parent ID in the TreeGrid.
     *
     * @param {string} id - The unique ID of the parent record for which to retrieve child records.
     * @returns {ITreeData[]} An array of child records corresponding to the specified parent ID.
     */
    private getChildrecordsByParentID(id: string): ITreeData[] {
        let treeGridDataSource: Object;
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            treeGridDataSource = (<DataManager>this.parent.grid.dataSource).dataSource.json;
        } else {
            treeGridDataSource = this.parent.grid.dataSource;
        }
        const record: Object[] = (treeGridDataSource as ITreeData[]).filter((e: ITreeData) => {
            return e.uniqueID === id;
        });
        return record;
    }

    /**
     * @hidden
     * @returns {void}
     */
    private addEventListener(): void {
        this.parent.on(events.rowdraging, this.Rowdraging, this);
        this.parent.on(events.rowDropped, this.rowDropped, this);
        this.parent.on(events.rowsAdd, this.rowsAdded, this);
        this.parent.on(events.rowsRemove, this.rowsRemoved, this);
    }

    /**
     * Reorder the rows based on given indexes and position
     *
     * @returns {void}
     * @param {number[]} fromIndexes - source indexes of rows to be re-ordered
     * @param {number} toIndex - Destination row index
     * @param {string} position - Drop position as above or below or child
     */
    public reorderRows(fromIndexes: number[], toIndex: number, position: string): void {
        const tObj: TreeGrid = this.parent;
        if (fromIndexes[0] === toIndex || ['above', 'below', 'child'].indexOf(position) === -1) {
            return;
        }
        const action: string = 'action'; const dropPosition: string = 'dropPosition';
        const updateRowAndCellElements: string = 'updateRowAndCellElements';
        if (fromIndexes[0] !== toIndex && ['above', 'below', 'child'].indexOf(position) !== -1) {
            if (position === 'above') {
                this.dropPosition = 'topSegment';
            }
            if (position === 'below') {
                this.dropPosition = 'bottomSegment';
            }
            if (position === 'child') {
                this.dropPosition = 'middleSegment';
            }
            this.parent[`${dropPosition}`] = this.dropPosition;
            const data: ITreeData[] = [];
            for (let i: number = 0; i < fromIndexes.length; i++) {
                const index: number = (this.parent.getRowByIndex(fromIndexes[parseInt(i.toString(), 10)]) as HTMLTableRowElement).rowIndex;
                data[parseInt(i.toString(), 10)] = this.parent.getCurrentViewRecords()[parseInt(index.toString(), 10)];
            }
            const isByMethod: boolean = true;
            const args: RowDropEventArgs = {
                data: data,
                dropIndex: toIndex
            };
            if (!isCountRequired(this.parent)) {
                this.dropRows(args, isByMethod);
            }
            //this.refreshGridDataSource();
            if (tObj.isLocalData) {
                tObj.flatData = this.orderToIndex(tObj.flatData);
            }
            if (this.parent[`${action}`] === 'outdenting') {
                if (!isNullOrUndefined(data[0].parentItem)) {
                    data[0].level = data[0].parentItem.level + 1;
                }
            }
            this.parent.grid.refresh();
            if (this.parent.enableImmutableMode && this.dropPosition === 'middleSegment') {
                const index: number = this.parent.allowRowDragAndDrop
                    ? this.parent.treeColumnIndex + 1
                    : (this.parent[`${action}`] === 'indenting' ? this.parent.treeColumnIndex : undefined);
                const row: HTMLTableRowElement = this.parent.getRows()[fromIndexes[0]];
                const dropData: Object = args.data[0];
                const totalRecord: Object[] = []; const rows: HTMLTableRowElement[] = [];
                totalRecord.push(dropData); rows.push(row);
                const parentUniqueID: string = 'parentUniqueID';
                const parentData: Object = getParentData(this.parent, args.data[0][`${parentUniqueID}`]);
                const parentrow: HTMLTableRowElement = this.parent.getRows()[parseInt(toIndex.toString(), 10)];
                totalRecord.push(parentData); rows.push(parentrow);
                this.parent[`${updateRowAndCellElements}`](totalRecord, rows, index);
            }
            if (this.parent.enableImmutableMode && this.parent[`${action}`] === 'outdenting') {
                const index: number = this.parent.allowRowDragAndDrop
                    ? this.parent.treeColumnIndex + 1
                    : (this.parent[`${action}`] === 'outdenting' ? this.parent.treeColumnIndex : undefined);
                const record: Object = args.data[0];
                const row: HTMLTableRowElement = this.parent.getRows()[fromIndexes[0]];
                const totalRecord: Object[] = []; const rows: HTMLTableRowElement[] = [];
                totalRecord.push(record); rows.push(row);
                this.parent[`${updateRowAndCellElements}`](totalRecord, rows, index);
            }
        }
    }

    /**
     * Performs indent or outdent actions on selected records in the TreeGrid.
     *
     * @param {ITreeData} [record] - The record to be indented or outdented. If undefined, the method operates on the currently selected record.
     * @param {string} [request] - The action to perform, either 'indent' or 'outdent'.
     * @returns {void}
     */
    private indentOutdentAction(record?: ITreeData, request?: string): void {
        const tObj: TreeGrid = this.parent; const action: string = 'action';
        const droppedIndex: string = 'dropIndex'; let selectedItemIndex: number = -1;
        if (isNullOrUndefined(record) && this.parent.selectedRowIndex === -1) {
            return;
        } else {
            if (this.parent.enableVirtualization && this.parent.selectedRowIndex !== -1) {
                selectedItemIndex = (this.parent.getSelectedRows()[0] as HTMLTableRowElement).rowIndex;
            } else if (this.parent.selectedRowIndex !== -1) {
                selectedItemIndex = this.parent.selectedRowIndex;
            }
            this.selectedItem = isNullOrUndefined(record) ?
                tObj.getCurrentViewRecords()[parseInt(selectedItemIndex.toString(), 10)] as ITreeData : record as ITreeData;
            const primaryKeyField: string = this.parent.getPrimaryKeyFieldNames()[0];
            const rowIndex: number = this.parent.grid.getRowIndexByPrimaryKey(this.selectedItem[`${primaryKeyField}`]);
            this.selectedRow = this.parent[this.selectedRows] = selectedItemIndex !== -1 ?
                this.parent.getSelectedRows()[0] as HTMLTableRowElement
                : this.parent.grid.getRowByIndex(rowIndex) as HTMLTableRowElement;
            this.selectedRecord = this.parent[this.selectedRecords] = selectedItemIndex !== -1 ?
                tObj.getCurrentViewRecords()[parseInt(selectedItemIndex.toString(), 10)] as ITreeData
                : this.selectedItem as ITreeData;
            if (request === 'indent') {
                const record: ITreeData = tObj.getCurrentViewRecords()[this.selectedRow.rowIndex - 1];
                let dropIndex: number;
                if (this.selectedRow.rowIndex === 0 || this.selectedRow.rowIndex === -1 ||
                    (tObj.getCurrentViewRecords()[this.selectedRow.rowIndex] as ITreeData).level - record.level === 1) {
                    return;
                }
                if (record.level > this.selectedRecord.level) {
                    for (let i: number = 0; i < tObj.getCurrentViewRecords().length; i++) {
                        if ((tObj.getCurrentViewRecords()[parseInt(i.toString(), 10)] as ITreeData).taskData ===
                            record.parentItem.taskData) {
                            dropIndex = i;
                            if (tObj.enableVirtualization) {
                                dropIndex = parseInt(tObj.getRows()[parseInt(i.toString(), 10)].getAttribute('data-rowindex'), 10);
                            }
                        }
                    }
                }
                else {
                    dropIndex = this.selectedRow.rowIndex - 1;
                }
                if (this.parent.enableVirtualization && this.selectedRecord && !(record.level > this.selectedRecord.level)) {
                    dropIndex = parseInt(this.selectedRow.getAttribute('data-rowindex'), 10) - 1;
                }
                tObj[`${action}`] = 'indenting'; tObj[`${droppedIndex}`] = dropIndex;
                this.eventTrigger('indenting', dropIndex);
            } else if (request === 'outdent') {
                if (this.selectedRow.rowIndex === -1 || this.selectedRow.rowIndex === 0 ||
                    (tObj.getCurrentViewRecords()[this.selectedRow.rowIndex] as ITreeData).level === 0) {
                    return;
                }
                let dropIndex: number; const parentItem: ITreeData = this.selectedRecord.parentItem;
                for (let i: number = 0; i < tObj.getCurrentViewRecords().length; i++) {
                    if ((tObj.getCurrentViewRecords()[parseInt(i.toString(), 10)] as ITreeData).uniqueID === parentItem.uniqueID) {
                        dropIndex = i;
                    }
                }
                if (this.parent.enableVirtualization && this.selectedRecord) {
                    dropIndex = parseInt(this.parent.getRows()[parseInt(dropIndex.toString(), 10)].getAttribute('data-rowindex'), 10);
                }
                tObj[`${action}`] = 'outdenting'; tObj[`${droppedIndex}`] = dropIndex;
                this.eventTrigger('outdenting', dropIndex);
            }
        }
    }

    /**
     * Triggers a specified event for the TreeGrid, notifying subscribers about the event occurrence.
     *
     * @param {string} action - The action to be triggered, either 'indenting' or 'outdenting'.
     * @param {number} dropIndex - The index at which the row should be dropped.
     * @returns {void}
     */
    private eventTrigger(action: string, dropIndex: number): void {
        const actionArgs: TreeActionEventArgs = {
            action: action,
            cancel: false,
            data: [this.parent[this.selectedRecords]],
            row: this.parent[this.selectedRows]
        };
        this.parent.trigger(events.actionBegin, actionArgs, (actionArgs: TreeActionEventArgs) => {
            if (!actionArgs.cancel) {
                if (actionArgs.action === 'indenting') {
                    if (this.parent.enableVirtualization) {
                        this.reorderRows([parseInt(this.selectedRow.getAttribute('data-rowindex'), 10)], dropIndex, 'child');
                    }
                    else {
                        this.reorderRows([this.selectedRow.rowIndex], dropIndex, 'child');
                    }
                } else if (actionArgs.action === 'outdenting') {
                    if (this.parent.enableVirtualization) {
                        this.reorderRows([parseInt(this.selectedRow.getAttribute('data-rowindex'), 10)], dropIndex, 'below');
                    }
                    else {
                        this.reorderRows([this.selectedRow.rowIndex], dropIndex, 'below');
                    }
                }
            }
        });
    }

    /**
     * Reorders the flat data array of the TreeGrid and updates the index of each record.
     *
     * @param {ITreeData[]} currentData - The array of tree data records to reorder.
     * @returns {ITreeData[]} The updated array of tree data records with indices set.
     */
    private orderToIndex(currentData: ITreeData[]): ITreeData[] {
        for (let i: number = 0; i < currentData.length; i++) {
            currentData[parseInt(i.toString(), 10)].index = i;
            if (!isNullOrUndefined(currentData[parseInt(i.toString(), 10)].parentItem)) {
                const updatedParent: ITreeData = getValue('uniqueIDCollection.' + currentData[parseInt(i.toString(), 10)].parentUniqueID, this.parent);
                currentData[parseInt(i.toString(), 10)].parentItem.index = updatedParent.index;
            }
        }
        return currentData;
    }

    /**
     * Handles the addition of new rows to the TreeGrid.
     *
     * @param {Object} e - The event object containing information about the rows being added.
     * @param {number} e.toIndex - The index at which the new rows should be added in the TreeGrid.
     * @param {Object[]} e.records - An array of the records to be added to the TreeGrid.
     *
     * @returns {void} This function does not return any value.
     */
    private rowsAdded(e: { toIndex: number, records: Object[] }): void {
        let draggedRecord: ITreeData;
        const dragRecords: ITreeData[] = e.records;
        for (let i: number = e.records.length - 1; i > -1; i--) {
            draggedRecord = dragRecords[parseInt(i.toString(), 10)];
            if (draggedRecord.parentUniqueID) {
                const record: ITreeData[] = dragRecords.filter((data: ITreeData) => {
                    return data.uniqueID === draggedRecord.parentUniqueID;
                });
                if (record.length) {
                    const index: number = record[0].childRecords.indexOf(draggedRecord);
                    const parentRecord: ITreeData = record[0];
                    if (index !== -1) {
                        if (isNullOrUndefined(this.parent.idMapping)) {
                            parentRecord.childRecords.splice(index, 1);
                            if (!parentRecord.childRecords.length) {
                                parentRecord.hasChildRecords = false;
                                parentRecord.hasFilteredChildRecords = false;
                            }
                        }
                        this.isDraggedWithChild = true;
                    }
                }
            }
        }
        if (isNullOrUndefined(this.parent.dataSource as ITreeData[]) || !(this.parent.dataSource as ITreeData[]).length) {
            const tObj: TreeGrid = this.parent;
            let draggedRecord: ITreeData;
            const dragRecords: ITreeData[] = e.records;
            const dragLength: number = e.records.length;
            for (let i: number = dragLength - 1; i > -1; i--) {
                draggedRecord = dragRecords[parseInt(i.toString(), 10)];
                if (!i && draggedRecord.hasChildRecords) {
                    draggedRecord.taskData[this.parent.parentIdMapping] = null;
                }
                const recordIndex1: number = 0;
                if (!isNullOrUndefined(tObj.parentIdMapping)) {
                    tObj.childMapping = null;
                }
                if (!isNullOrUndefined(draggedRecord.taskData) && !isNullOrUndefined(tObj.childMapping) &&
                    !Object.prototype.hasOwnProperty.call(draggedRecord.taskData, tObj.childMapping)) {
                    draggedRecord.taskData[tObj.childMapping] = [];
                }
                if (!isNullOrUndefined(draggedRecord[tObj.childMapping])) {
                    if (Object.prototype.hasOwnProperty.call(draggedRecord, tObj.childMapping) &&
                        ((draggedRecord[tObj.childMapping]) as ITreeData[]).length && !this.isDraggedWithChild &&
                        !isNullOrUndefined(tObj.parentIdMapping)) {
                        const childData: ITreeData[] = (draggedRecord[tObj.childMapping]) as ITreeData[];
                        for (let j: number = 0; j < childData.length; j++) {
                            if (dragRecords.indexOf(childData[parseInt(j.toString(), 10)]) === -1) {
                                dragRecords.splice(j, 0, childData[parseInt(j.toString(), 10)]);
                                childData[parseInt(j.toString(), 10)].taskData = extend({}, childData[parseInt(j.toString(), 10)]);
                                i += 1;
                            }
                        }
                    }
                }
                if (Object.prototype.hasOwnProperty.call(draggedRecord, tObj.parentIdMapping)
                    && draggedRecord[tObj.parentIdMapping] !== null
                    && !this.isDraggedWithChild) {
                    draggedRecord.taskData[tObj.parentIdMapping] = null;
                    delete draggedRecord.parentItem;
                    delete draggedRecord.parentUniqueID;
                }
                if (isNullOrUndefined(tObj.dataSource as ITreeData[])) {
                    tObj.dataSource = [];
                }
                (tObj.dataSource as ITreeData[]).splice(recordIndex1, 0, draggedRecord.taskData);
            }
            tObj.setProperties({ dataSource: tObj.dataSource }, false);
        } else {
            for (let i: number = 0; i < dragRecords.length; i++) {
                setValue('uniqueIDCollection.' + dragRecords[parseInt(i.toString(), 10)].uniqueID, dragRecords[parseInt(i.toString(), 10)], this.parent);
            }
            const args: RowDropEventArgs = { data: e.records, dropIndex: e.toIndex };
            if (this.parent.dataSource instanceof DataManager) {
                this.treeGridData = this.parent.dataSource.dataSource.json;
                this.treeData = this.parent.dataSource.dataSource.json;
            } else {
                this.treeGridData = this.parent.grid.dataSource as ITreeData[];
                this.treeData = this.parent.dataSource as ITreeData[];
            }
            if (isNullOrUndefined(this.dropPosition)) {
                this.dropPosition = 'bottomSegment';
                args.dropIndex = this.parent.getCurrentViewRecords().length > 1 ? this.parent.getCurrentViewRecords().length - 1 :
                    args.dropIndex;
                args.data = args.data.map((i: ITreeData) => {
                    if (i.hasChildRecords && isNullOrUndefined(i.parentItem)) {
                        i.level = 0;
                        return i;
                    }
                    else {
                        delete i.parentItem;
                        delete i.parentUniqueID;
                        i.level = 0;
                        return i;
                    }
                });
            }
            this.dropRows(args);
        }
    }

    /**
     * Handles the removal of specified rows from the TreeGrid.
     *
     * @param {Object} e - The event object containing information about the removed rows.
     * @param {number[]} e.indexes - An array of indexes of the rows that were removed.
     * @param {Object[]} e.records - An array of the records corresponding to the removed rows.
     *
     * @returns {void} This function does not return any value.
     */
    private rowsRemoved(e: { indexes: number[], records: Object[] }): void {
        for (let i: number = 0; i < e.records.length; i++) {
            this.draggedRecord = e.records[parseInt(i.toString(), 10)];
            if (this.draggedRecord.hasChildRecords || this.draggedRecord.parentItem &&
                (this.parent.grid.dataSource as ITreeData[]).
                    indexOf(this.getChildrecordsByParentID(this.draggedRecord.parentUniqueID)[0]) !== -1 ||
                this.draggedRecord.level === 0) {
                this.deleteDragRow();
            }
        }
    }

    /**
     * Refreshes the data source of the TreeGrid.
     *
     * @returns {void} This function does not return any value.
     */
    private refreshGridDataSource(): void {
        const draggedRecord: ITreeData = this.draggedRecord;
        const droppedRecord: ITreeData = this.droppedRecord;
        const proxy: TreeGrid = this.parent;
        let temporaryDataSource: Object; let indexOfDroppedRecord: number;
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            temporaryDataSource = (<DataManager>proxy.dataSource).dataSource.json;
        } else {
            temporaryDataSource = proxy.dataSource;
        }
        if (temporaryDataSource && (!isNullOrUndefined(droppedRecord) && !droppedRecord.parentItem)
            && !isNullOrUndefined(droppedRecord.taskData)) {
            const keys: string[] = Object.keys(temporaryDataSource);
            for (let i: number = 0; i < keys.length; i++) {
                if (temporaryDataSource[parseInt(i.toString(), 10)][this.parent.childMapping] ===
                    droppedRecord.taskData[this.parent.childMapping]) {
                    indexOfDroppedRecord = i;
                }
            }
            if (!this.parent.idMapping) {
                const positionAdjustment: number = this.dropPosition === 'topSegment' ? 0 : 1;
                if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                    (temporaryDataSource as ITreeData[]).splice(indexOfDroppedRecord + positionAdjustment, 0, draggedRecord.taskData);
                }
            }
        } else if (!this.parent.parentIdMapping && (!isNullOrUndefined(droppedRecord) && droppedRecord.parentItem)) {
            if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                const record: ITreeData = (this.getChildrecordsByParentID(droppedRecord.parentUniqueID) as ITreeData)[0];
                const childRecords: ITreeData[] = record.childRecords;
                for (let i: number = 0; i < childRecords.length; i++) {
                    droppedRecord.parentItem.taskData[this.parent.childMapping][parseInt(i.toString(), 10)]
                        = childRecords[parseInt(i.toString(), 10)].taskData;
                }
            }
        }

        if (this.parent.parentIdMapping) {
            if (draggedRecord.parentItem) {
                if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                    draggedRecord[this.parent.parentIdMapping] = droppedRecord[this.parent.parentIdMapping];
                    draggedRecord.taskData[this.parent.parentIdMapping] = droppedRecord[this.parent.parentIdMapping];
                } else {
                    draggedRecord[this.parent.parentIdMapping] = droppedRecord[this.parent.idMapping];
                    draggedRecord.taskData[this.parent.parentIdMapping] = droppedRecord[this.parent.idMapping];
                }
            } else {
                draggedRecord.taskData[this.parent.parentIdMapping] = null;
                draggedRecord[this.parent.parentIdMapping] = null;
            }
        }
    }

    /**
     * Removes the border from the first row of the TreeGrid.
     *
     * @param {HTMLTableRowElement} element - The table row element from which to remove the border.
     * @returns {void} This function does not return any value.
     */
    private removeFirstrowBorder(element: HTMLTableRowElement): void {
        const canremove: boolean = this.dropPosition === 'bottomSegment';
        if (this.parent.element.getElementsByClassName('e-firstrow-border').length > 0 && element &&
            ((element as HTMLTableRowElement).rowIndex !== 0 || canremove)) {
            this.parent.element.getElementsByClassName('e-firstrow-border')[0].remove();
        }
    }

    /**
     * Removes the border from the last row of the TreeGrid.
     *
     * @param {HTMLTableRowElement} element - The row element from which to remove the last row border.
     * @returns {void}
     */
    private removeLastrowBorder(element: HTMLTableRowElement): void {
        if (!element) { return; }
        const isEmptyRow: boolean = element.classList.contains('e-emptyrow') ||
            element.classList.contains('e-columnheader') ||
            element.classList.contains('e-detailrow');
        if (isEmptyRow) { return; }
        const lastRow: HTMLTableRowElement = this.parent.enableVirtualization ?
            this.parent.getRows()[this.parent.getCurrentViewRecords().length - 1] as HTMLTableRowElement :
            this.parent.getRowByIndex(this.parent.getCurrentViewRecords().length - 1) as HTMLTableRowElement;
        const isNotLastRow: boolean = lastRow.getAttribute('data-uid') !== element.getAttribute('data-uid');
        const canRemove: boolean = isNotLastRow || this.dropPosition === 'topSegment';
        const lastRowBorderElement: HTMLElement = this.parent.element.getElementsByClassName('e-lastrow-border')[0] as HTMLElement;
        if (lastRowBorderElement && canRemove) {
            lastRowBorderElement.remove();
        }
    }

    /**
     * Updates the icons associated with the specified rows in the TreeGrid.
     *
     * @param {Element[]} row - The array of row elements to update the icons for.
     * @param {number} index - The index of the row being updated.
     * @param {RowDragEventArgs} args - The event arguments associated with the row drag operation.
     * @returns {string} The drop position ('topSegment', 'middleSegment', 'bottomSegment', or 'Invalid').
     */
    private updateIcon(row: Element[], index: number, args: RowDragEventArgs): string {
        const rowEle: Element = args.target ? closest(args.target, 'tr') : null;
        this.dropPosition = undefined;
        let rowPositionHeight: number = 0;
        this.removeFirstrowBorder(rowEle as HTMLTableRowElement);
        this.removeLastrowBorder(rowEle as HTMLTableRowElement);
        for (let i: number = 0; i < args.rows.length; i++) {
            if (!isNullOrUndefined(rowEle) && rowEle.getAttribute('data-uid') === args.rows[parseInt(i.toString(), 10)].getAttribute('data-uid')
                || !parentsUntil(args.target, 'e-gridcontent')) {
                this.dropPosition = 'Invalid';
                this.addErrorElem();
                if (isNullOrUndefined(this.parent.rowDropSettings.targetID)) {
                    this.removetopOrBottomBorder();
                    this.removeChildBorder();
                }
            }
        }
        // To get the corresponding drop position related to mouse position
        const tObj: TreeGrid = this.parent;
        let rowTop: number = 0;
        const roundOff: number = 0;
        const toolHeight: number = tObj.toolbar && tObj.toolbar.length ?
            document.getElementById(tObj.element.id + '_gridcontrol_toolbarItems').offsetHeight : 0;
        // tObj.lastRow = tObj.getRowByIndex(tObj.getCurrentViewRecords().length - 1);
        const positionOffSet: PositionOffSet = this.getOffset(tObj.element);
        // let contentHeight1: number = (tObj.element.offsetHeight  - (tObj.getContent() as HTMLElement).offsetHeight) + positionOffSet.top;
        const contentHeight: number = (tObj.getHeaderContent() as HTMLElement).offsetHeight + positionOffSet.top + toolHeight;
        const scrollTop: number = (tObj.getContent() as HTMLElement).firstElementChild.scrollTop;
        if (!isNullOrUndefined(rowEle)) {
            rowPositionHeight = (rowEle as HTMLElement).offsetTop - scrollTop;
        }
        // let scrollTop = (tObj.grid.scrollModule as any).content.scrollTop;
        if (this.parent.enableVirtualization) {
            rowTop = rowEle.getBoundingClientRect().top;
        }
        else {
            rowTop = rowPositionHeight + contentHeight + roundOff;
        }
        const rowBottom: number = rowTop + (row[0] as HTMLElement).offsetHeight;
        const difference: number = rowBottom - rowTop;
        const divide: number = difference / 3;
        const topRowSegment: number = rowTop + divide;
        const middleRowSegment: number = topRowSegment + divide;
        const bottomRowSegment: number = middleRowSegment + divide;
        const mouseEvent: MouseEvent = getObject('originalEvent.event', args);
        const touchEvent: TouchEvent = getObject('originalEvent.event', args);
        let posy: number = (mouseEvent.type === 'mousemove') ? mouseEvent.pageY : ((!isNullOrUndefined(touchEvent) &&
            !isNullOrUndefined(touchEvent.changedTouches)) ? touchEvent.changedTouches[0].pageY : null);
        if (this.parent.enableVirtualization) {
            posy = (mouseEvent.type === 'mousemove') ? mouseEvent.clientY : ((!isNullOrUndefined(touchEvent) &&
                !isNullOrUndefined(touchEvent.changedTouches)) ? touchEvent.changedTouches[0].clientY : null);
        }
        const isTopSegment: boolean = posy <= topRowSegment;
        const isMiddleRowSegment: boolean = (posy > topRowSegment && posy <= middleRowSegment);
        const isBottomRowSegment: boolean = (posy > middleRowSegment && posy <= bottomRowSegment);
        if (isTopSegment || isMiddleRowSegment || isBottomRowSegment) {
            if (isTopSegment && this.dropPosition !== 'Invalid') {
                this.removeChildBorder();
                this.dropPosition = 'topSegment';
                this.removetopOrBottomBorder();
                this.addFirstrowBorder(rowEle as HTMLTableRowElement);
                this.removeErrorElem();
                this.removeLastrowBorder(rowEle as HTMLTableRowElement);
                this.topOrBottomBorder(args.target);
            }
            if (isMiddleRowSegment && this.dropPosition !== 'Invalid') {
                this.removetopOrBottomBorder();
                let rowElement: HTMLElement[] = [];
                const element: Element = closest(args.target, 'tr');
                rowElement = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'));
                if (rowElement.length > 0) {
                    this.addRemoveClasses(rowElement, true, 'e-childborder');
                }
                this.addLastRowborder(rowEle as HTMLTableRowElement);
                this.addFirstrowBorder(rowEle as HTMLTableRowElement);
                this.dropPosition = 'middleSegment';
            }
            if (isBottomRowSegment && this.dropPosition !== 'Invalid') {
                this.removeErrorElem();
                this.removetopOrBottomBorder();
                this.removeChildBorder();
                this.dropPosition = 'bottomSegment';
                this.addLastRowborder(rowEle as HTMLTableRowElement);
                this.removeFirstrowBorder(rowEle as HTMLTableRowElement);
                this.topOrBottomBorder(args.target);
            }
        }
        return this.dropPosition;
    }

    /**
     * Removes the visual border from all child rows within the TreeGrid.
     *
     * @returns {void} No return value.
     */
    private removeChildBorder(): void {
        let borderElem: HTMLElement[] = [];
        borderElem = [].slice.call(this.parent.element.querySelectorAll('.e-childborder'));
        if (borderElem.length > 0) {
            this.addRemoveClasses(borderElem, false, 'e-childborder');
        }
    }

    /**
     * Adds a visual border to the first row of the TreeGrid.
     *
     * @param {HTMLTableRowElement} targetRow - The target row element to which the border will be added, if it is the first row.
     * @returns {void} No return value.
     */
    private addFirstrowBorder(targetRow: HTMLTableRowElement): void {
        const node: Element = this.parent.element;
        const tObj: TreeGrid = this.parent;
        if (targetRow && targetRow.rowIndex === 0 && !targetRow.classList.contains('e-emptyrow')) {
            const div: HTMLElement = this.parent.createElement('div', { className: 'e-firstrow-border' });
            const gridheaderEle: Element = this.parent.getHeaderContent();
            let toolbarHeight: number = 0;
            if (tObj.toolbar) {
                toolbarHeight = (tObj.toolbarModule.getToolbar() as HTMLElement).offsetHeight;
            }
            const multiplegrid: boolean = !isNullOrUndefined(this.parent.rowDropSettings.targetID);
            if (multiplegrid) {
                div.style.top = (this.parent.grid.element.getElementsByClassName('e-gridheader')[0] as HTMLElement).offsetHeight
                    + toolbarHeight + 'px';
            }
            div.style.width = multiplegrid ? (node as HTMLElement).offsetWidth + 'px' :
                (node as HTMLElement).offsetWidth - this.getScrollWidth() + 'px';
            if (!gridheaderEle.querySelectorAll('.e-firstrow-border').length) {
                gridheaderEle.appendChild(div);
            }
        }
    }

    /**
     * Adds a visual border to the last row of the TreeGrid.
     *
     * @param {HTMLTableRowElement} trElement - The table row element to which the border will be added, if it is the last row.
     * @returns {void} No return value.
     */
    private addLastRowborder(trElement: HTMLTableRowElement): void {
        if (!trElement) { return; }
        const isEmptyRow: boolean = trElement && (trElement.classList.contains('e-emptyrow') ||
            trElement.classList.contains('e-columnheader') || trElement.classList.contains('e-detailrow'));
        if (isEmptyRow) { return; }
        if (trElement && !isEmptyRow && this.parent.getRows()[this.parent.getCurrentViewRecords().length - 1].getAttribute('data-uid') ===
            trElement.getAttribute('data-uid')) {
            const bottomborder: HTMLElement = this.parent.createElement('div', { className: 'e-lastrow-border' });
            const gridcontentEle: Element = this.parent.getContent();
            bottomborder.style.width = (this.parent.element as HTMLElement).offsetWidth - this.getScrollWidth() + 'px';
            if (!gridcontentEle.querySelectorAll('.e-lastrow-border').length) {
                gridcontentEle.classList.add('e-treegrid-relative');
                gridcontentEle.appendChild(bottomborder);
                bottomborder.style.bottom = this.getScrollWidth() + 'px';
            }
        }
    }

    /**
     * Retrieves the total scroll width of the TreeGrid content area.
     *
     * @returns {number} The width of the scrollbar if content overflows, otherwise 0.
     */
    private getScrollWidth(): number {
        const scrollElem: HTMLElement = this.parent.getContent().firstElementChild as HTMLElement;
        return scrollElem.scrollWidth > scrollElem.offsetWidth ? Scroll.getScrollBarWidth() : 0;
    }

    /**
     * Adds an error element to the dragged row element during a row drag-and-drop operation.
     *
     * @returns {void} No return value.
     */
    private addErrorElem(): void {
        const dragelem: Element = document.getElementsByClassName('e-cloneproperties')[0];
        const errorelemCount: number = dragelem.querySelectorAll('.e-errorelem').length;
        const sanitize: string = 'sanitize';
        if (!errorelemCount && !this.parent.rowDropSettings.targetID) {
            const errorContainer: HTMLElement = document.createElement('div');
            errorContainer.classList.add('e-errorcontainer', 'e-icons', 'e-errorelem');
            const rowCell: HTMLElement = dragelem.querySelector('.e-rowcell') as HTMLElement;
            const errorVal: Element = dragelem.querySelector('.errorValue');
            let content: string = rowCell.innerHTML;
            if (errorVal) {
                content = this.parent[`${sanitize}`](errorVal.innerHTML);
                errorVal.parentNode.removeChild(errorVal);
            }
            rowCell.innerHTML = '';
            const spanContent: HTMLElement = document.createElement('span');
            spanContent.className = 'errorValue';
            spanContent.style.paddingLeft = '16px';
            spanContent.innerHTML = this.parent[`${sanitize}`](content);
            rowCell.appendChild(errorContainer);
            rowCell.appendChild(spanContent);
            const dropItemSpan: HTMLElement = document.querySelector('.e-dropitemscount');
            if (this.hasDropItem && dropItemSpan) {
                const dropItemLeft: number = parseInt(dropItemSpan.style.left, 10) + errorContainer.offsetWidth + 16;
                const spanLeft: number = !this.parent.enableRtl ? dropItemLeft : 0;
                dropItemSpan.style.left = `${spanLeft}px`;
                this.hasDropItem = false;
            }
        }
    }

    /**
     * Removes the error element from the DOM and adjusts the position of the drop item count if necessary.
     *
     * @returns {void} No return value.
     */
    private removeErrorElem(): void {
        const errorelem: HTMLElement = document.querySelector('.e-errorelem');
        const errorValue: HTMLElement = document.querySelector('.errorValue');
        const dropItemSpan: HTMLElement = document.querySelector('.e-dropitemscount');
        if (errorelem) {
            if (dropItemSpan) {
                const dropItemLeft: number = parseInt(dropItemSpan.style.left, 10) - errorelem.offsetWidth - 16;
                setStyleAttribute(errorValue, {
                    paddingLeft: '0px'
                });
                if (!this.parent.enableRtl) {
                    setStyleAttribute(dropItemSpan, {
                        left: `${dropItemLeft}px`
                    });
                }
            }
            errorelem.remove();
        }
        this.hasDropItem = true;
    }

    /**
     * Applies drop border styles to row elements based on the current drop position ('topSegment' or 'bottomSegment').
     *
     * @param {Element} target - The target element where the drop action is taking place.
     * @returns {void} No return value.
     */
    private topOrBottomBorder(target: Element): void {
        let rowElement: HTMLElement[] = [];
        const element: Element = closest(target, 'tr');
        rowElement = element ? [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse')) : [];
        if (rowElement.length) {
            if (this.dropPosition === 'topSegment') {
                this.addRemoveClasses(rowElement, true, 'e-droptop');
                if (this.parent.element.getElementsByClassName('e-lastrow-dragborder').length > 0) {
                    this.parent.element.getElementsByClassName('e-lastrow-dragborder')[0].remove();
                }
            }
            if (this.dropPosition === 'bottomSegment') {
                this.addRemoveClasses(rowElement, true, 'e-dropbottom');
            }
        }
    }

    /**
     * Removes the drop border classes ('e-dropbottom' and 'e-droptop') from the parent element if present.
     *
     * @returns {void} No return value.
     */
    private removetopOrBottomBorder(): void {
        let border: HTMLElement[] = [];
        border = [].slice.call(this.parent.element.querySelectorAll('.e-dropbottom, .e-droptop'));
        if (border.length) {
            this.addRemoveClasses(border, false, 'e-dropbottom');
            this.addRemoveClasses(border, false, 'e-droptop');
        }
    }

    /**
     * Adds or removes a specified class from a list of HTML elements.
     *
     * @param {Element[]} cells - The list of HTML elements to which the class will be added or removed.
     * @param {boolean} add - A flag indicating whether to add (`true`) or remove (`false`) the class.
     * @param {string} className - The class name to be added or removed from each element in `cells`.
     * @returns {void} No return value.
     */
    private addRemoveClasses(cells: Element[], add: boolean, className: string): void {
        for (let i: number = 0, len: number = cells.length; i < len; i++) {
            if (add) {
                cells[parseInt(i.toString(), 10)].classList.add(className);
            } else {
                cells[parseInt(i.toString(), 10)].classList.remove(className);
            }
        }
    }

    /**
     * Calculates the offset position of the specified HTML element relative to the document.
     *
     * @param {Element} element - The HTML element for which the offset position is calculated.
     * @returns {PositionOffSet} The offset position containing `top` and `left` values.
     */
    private getOffset(element: Element): PositionOffSet {
        const box: DOMRect | ClientRect = element.getBoundingClientRect();
        const body: HTMLElement = document.body;
        const docElem: HTMLElement = document.documentElement;
        const scrollTop: number = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        const scrollLeft: number = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        const clientTop: number = docElem.clientTop || body.clientTop || 0;
        const clientLeft: number = docElem.clientLeft || body.clientLeft || 0;
        const top: number = box.top + scrollTop - clientTop;
        const left: number = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left) };
    }

    /**
     * Handles the dragging of rows in the TreeGrid.
     *
     * @param {RowDragEventArgs} args - The event arguments for the row drag action.
     * @returns {void} This function does not return a value.
     */
    private Rowdraging(args: RowDragEventArgs): void {
        const tObj: TreeGrid = this.parent;
        const cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        if (!cloneElement) { return; }
        cloneElement.style.cursor = '';
        const rowEle: Element = args.target ? closest(args.target, 'tr') : null;
        const rowIdx: number = rowEle ? (rowEle as HTMLTableRowElement).rowIndex : -1;
        if (rowIdx === -1) {
            this.canDrop = false;
            this.addErrorElem();
            if (isNullOrUndefined(tObj.rowDropSettings.targetID)) {
                this.removetopOrBottomBorder();
                this.removeChildBorder();
            }
            return;
        }
        const dragRecords: ITreeData[] = Array.isArray(args.data) ? args.data : [args.data as ITreeData];
        const droppedRecord: ITreeData = tObj.getCurrentViewRecords()[parseInt(rowIdx.toString(), 10)];
        this.removeErrorElem();
        this.canDrop = true;
        this.ensuredropPosition(dragRecords, droppedRecord);
        if (!tObj.rowDropSettings.targetID && this.canDrop && !isNullOrUndefined(args.rows[0])) {
            tObj.rowDragAndDropModule.updateIcon(args.rows, rowIdx, args);
        }
        if (tObj.rowDropSettings.targetID) {
            const dropElement: Element = parentsUntil(args.target, 'e-treegrid');
            if (dropElement && dropElement.id === this.parent.rowDropSettings.targetID) {
                const srcControl: TreeGrid = (<EJ2Intance>dropElement).ej2_instances[0];
                srcControl.rowDragAndDropModule.updateIcon(args.rows, rowIdx, args);
            }
        }
        if (args.target && closest(args.target, '#' + tObj.rowDropSettings.targetID)) {
            const dropElement: Element = parentsUntil(args.target, 'e-treegrid');
            if (!dropElement) {
                cloneElement.style.cursor = 'default';
            }
        }
    }

    /**
     * Handles the row drop event for the TreeGrid.
     *
     * @param {RowDropEventArgs} args - The event arguments for the row drop action.
     * @returns {void} This function does not return a value.
     */
    private rowDropped(args: RowDropEventArgs): void {
        const tObj: TreeGrid = this.parent;
        const parentItem: string = 'parentItem';
        if (!tObj.rowDropSettings.targetID) {
            if (parentsUntil(args.target, 'e-content') || (this.dropPosition === 'Invalid' || !this.canDrop)) {
                if (this.parent.element.querySelector('.e-errorelem')) {
                    this.dropPosition = 'Invalid';
                }
                setValue('dropPosition', this.dropPosition, args);
                tObj.trigger(events.rowDrop, args);
                if (!args.cancel) {
                    if (!isCountRequired(this.parent) && this.dropPosition === 'Invalid') {
                        return;
                    }
                    if (!isCountRequired(this.parent)) {
                        this.dropRows(args);
                    }
                    if (tObj.isLocalData) {
                        tObj.flatData = this.orderToIndex(tObj.flatData);
                    }
                    tObj.grid.refresh();
                    this.removeRowBorders();
                }
            }
        } else {
            if (args.target && closest(args.target, '#' + tObj.rowDropSettings.targetID) || parentsUntil(args.target, 'e-treegrid') &&
                parentsUntil(args.target, 'e-treegrid').id === tObj.rowDropSettings.targetID || args.target && document.getElementById(tObj.rowDropSettings.targetID)) {
                setValue('dropPosition', this.dropPosition, args);
                tObj.trigger(events.rowDrop, args);
                if (!args.cancel && tObj.rowDropSettings.targetID) {
                    this.dragDropGrid(args);
                    if (tObj.isLocalData) {
                        tObj.flatData = this.orderToIndex(tObj.flatData);
                    }
                }
            }
        }
        this.removetopOrBottomBorder();
        this.removeChildBorder();
        this.removeRowBorders();
        if (this.parent.enableImmutableMode && !this.parent.allowPaging && !isNullOrUndefined(args.data[0][`${parentItem}`])) {
            let index: number = this.parent.treeColumnIndex;
            index = index + 1;
            const primaryKeyField: string = this.parent.getPrimaryKeyFieldNames()[0];
            let rowIndex: number = this.parent.grid.getRowIndexByPrimaryKey(args.data[0][`${primaryKeyField}`]);
            const row: HTMLTableRowElement = this.parent.getRows()[parseInt(rowIndex.toString(), 10)];
            let data: Object = args.data[0];
            if (this.dropPosition === 'middleSegment') {
                const record: Object[] = []; const rows: HTMLTableRowElement[] = [];
                record.push(data); rows.push(row);
                const parentUniqueID: string = 'parentUniqueID';
                data = getParentData(this.parent, args.data[0][`${parentUniqueID}`]);
                rowIndex = this.parent.grid.getRowIndexByPrimaryKey(data[`${primaryKeyField}`]);
                const parentrow: HTMLTableRowElement = this.parent.getRows()[parseInt(rowIndex.toString(), 10)];
                record.push(data); rows.push(parentrow);
                for (let i: number = 0; i < record.length; i++) {
                    this.parent.renderModule.cellRender({
                        data: record[parseInt(i.toString(), 10)],
                        cell: rows[parseInt(i.toString(), 10)].cells[parseInt(index.toString(), 10)],
                        column: this.parent.grid.getColumns()[this.parent.treeColumnIndex],
                        requestType: 'rowDragAndDrop'
                    });
                }
                const targetEle: Element = parentrow.getElementsByClassName('e-treegridcollapse')[0];
                if (!isNullOrUndefined(targetEle)) {
                    removeClass([targetEle], 'e-treegridcollapse');
                    addClass([targetEle], 'e-treegridexpand');
                }
            } else {
                this.parent.renderModule.cellRender({
                    data: data, cell: row.cells[parseInt(index.toString(), 10)],
                    column: this.parent.grid.getColumns()[this.parent.treeColumnIndex],
                    requestType: 'rowDragAndDrop'
                });
            }
        }
    }

    /**
     * Removes the border elements for the first and last rows of the TreeGrid.
     *
     * @returns {void} This function does not return a value.
     */
    private removeRowBorders(): void {
        ['e-firstrow-border', 'e-lastrow-border'].forEach((className: string): void => {
            const element: HTMLElement = this.parent.element.getElementsByClassName(className)[0] as HTMLElement;
            if (element) {
                element.remove();
            }
        });
    }

    /**
     * Handles the drag-and-drop operation between TreeGrids, updating the source and target grids.
     *
     * @param {RowDropEventArgs} args - The arguments related to the row drop event, including target information and data being dropped.
     * @returns {void} - This function does not return any value.
     */
    private dragDropGrid(args: RowDropEventArgs): void {
        const tObj: TreeGrid = this.parent;
        const targetRow: HTMLTableRowElement = closest(args.target, 'tr') as HTMLTableRowElement;
        const targetIndex: number = isNaN(this.getTargetIdx(targetRow)) ? 0 : this.getTargetIdx(targetRow);
        const dropElement: Element = parentsUntil(args.target, 'e-treegrid');
        let srcControl: TreeGrid;
        if (dropElement && dropElement.id === this.parent.rowDropSettings.targetID && !isRemoteData(this.parent)
            && !isCountRequired(this.parent)) {
            srcControl = (<EJ2Intance>dropElement).ej2_instances[0];
            let records: ITreeData[] = tObj.getSelectedRecords();
            const indexes: number[] = [];
            for (let i: number = 0; i < records.length; i++) {
                indexes[parseInt(i.toString(), 10)] = records[parseInt(i.toString(), 10)].index;
            }
            const data: ITreeData[] = srcControl.dataSource as ITreeData[];
            if (this.parent.idMapping !== null && (isNullOrUndefined(this.dropPosition) || this.dropPosition === 'bottomSegment' || this.dropPosition === 'Invalid') && !(data.length)) {
                const actualData: ITreeData[] = [];
                for (let i: number = 0; i < records.length; i++) {
                    if (records[parseInt(i.toString(), 10)].hasChildRecords) {
                        actualData.push(records[parseInt(i.toString(), 10)]);
                        const child: ITreeData[] = findChildrenRecords(records[parseInt(i.toString(), 10)]);
                        for (let i: number = 0; i < child.length; i++) {
                            actualData.push(child[parseInt(i.toString(), 10)]); // push child records to drop the parent record along with its child records
                        }
                    }
                }
                if (actualData.length) {
                    records = actualData;
                }
            }
            tObj.notify(events.rowsRemove, { indexes: indexes, records: records });
            srcControl.notify(events.rowsAdd, { toIndex: targetIndex, records: records });
            const srcControlFlatData: ITreeData[] = srcControl.rowDragAndDropModule.treeGridData;
            if (!isNullOrUndefined(srcControlFlatData)) {
                for (let i: number = 0; i < srcControlFlatData.length; i++) {
                    srcControlFlatData[parseInt(i.toString(), 10)].index = i;
                    if (!isNullOrUndefined(srcControlFlatData[parseInt(i.toString(), 10)].parentItem)) {
                        const actualIndex: number =
                            <number>getValue('uniqueIDCollection.' + srcControlFlatData[parseInt(i.toString(), 10)].parentUniqueID + '.index', srcControl);
                        srcControlFlatData[parseInt(i.toString(), 10)].parentItem.index = actualIndex;
                    }
                }
            }
            tObj.grid.refresh();
            srcControl.grid.refresh();
            if ((<ITreeData[]>srcControl.grid.dataSource).length > 1) {
                srcControl.grid.refresh();
                if (!isNullOrUndefined(srcControl.getHeaderContent().querySelector('.e-firstrow-border'))) {
                    srcControl.getHeaderContent().querySelector('.e-firstrow-border').remove();
                }
                if (!isNullOrUndefined(srcControl.getContent().querySelector('.e-lastrow-border'))) {
                    srcControl.getContent().querySelector('.e-lastrow-border').remove();
                }
            }
        }
        if (isCountRequired(this.parent)) {
            srcControl = (<EJ2Intance>dropElement).ej2_instances[0];
            tObj.grid.refresh();
            srcControl.grid.refresh();
        }
    }

    /**
     * Retrieves the index of the target row based on its 'data-rowindex' attribute.
     *
     * @param {Element} targetRow - The target row element from which to retrieve the index.
     * @returns {number} - The index of the target row, or 0 if the targetRow is null or undefined.
     */
    private getTargetIdx(targetRow: Element): number {
        return targetRow ? parseInt(targetRow.getAttribute('data-rowindex'), 10) : 0;
    }

    /**
     * Retrieves the parent data of a given record during a row drag-and-drop operation.
     *
     * @param {ITreeData} record - The record for which to retrieve the parent data.
     * @param {Object[]} [data] - Optional data array containing additional information related to the drop operation.
     * @returns {void} - This function does not return any value.
     */
    private getParentData(record: ITreeData, data?: Object[]): void {
        const parentItem: ITreeData = record.parentItem; let selectedItemIndex: number = -1;
        if (this.parent.enableVirtualization && this.parent.selectedRowIndex !== -1) {
            selectedItemIndex = (this.parent.getSelectedRows()[0] as HTMLTableRowElement).rowIndex;
        } else if (this.parent.selectedRowIndex !== -1) {
            selectedItemIndex = this.parent.selectedRowIndex;
        }
        if (this.dropPosition === 'bottomSegment') {
            const primaryKeyField: string = this.parent.getPrimaryKeyFieldNames()[0];
            const rowIndex: number = selectedItemIndex === -1 ?
                (this.parent.grid.getRowIndexByPrimaryKey(data[0][`${primaryKeyField}`]))
                : this.parent.getSelectedRowIndexes()[0];
            const selectedRecord: ITreeData = this.parent.getCurrentViewRecords()[parseInt(rowIndex.toString(), 10)];
            this.droppedRecord = getParentData(this.parent, selectedRecord.parentItem.uniqueID);
        }
        if (this.dropPosition === 'middleSegment') {
            const level: number = (this.parent.getCurrentViewRecords()[parseInt(selectedItemIndex.toString(), 10)] as ITreeData).level;
            if (level === parentItem.level) {
                this.droppedRecord = getParentData(this.parent, parentItem.uniqueID);
            } else {
                this.getParentData(parentItem);
            }
        }
    }

    /**
     * Handles the row drop operation for the tree grid.
     *
     * @param {RowDropEventArgs} args - The event arguments containing details about the drop operation, including the target index and data.
     * @param {boolean} [isByMethod=false] - Optional flag indicating if the drop operation is triggered by a method.
     * @returns {void} - This function does not return any value.
     */
    private dropRows(args: RowDropEventArgs, isByMethod?: boolean): void {
        if (this.dropPosition !== 'Invalid' && !isRemoteData(this.parent)) {
            const tObj: TreeGrid = this.parent;
            let draggedRecord: ITreeData; let droppedRecord: ITreeData;
            if (isNullOrUndefined(args.dropIndex)) {
                const primaryKeyField: string = this.parent.getPrimaryKeyFieldNames()[0];
                const rowIndex: number = tObj.selectedRowIndex === -1 ?
                    (this.parent.grid.getRowIndexByPrimaryKey(args.data[0][`${primaryKeyField}`])) - 1
                    : tObj.getSelectedRowIndexes()[0] - 1;
                const record: ITreeData = (tObj.getCurrentViewRecords()[parseInt(rowIndex.toString(), 10)] as ITreeData);
                this.getParentData(record, args.data);
            } else {
                args.dropIndex = args.dropIndex === args.fromIndex ? this.getTargetIdx(args.target.parentElement) : args.dropIndex;
                if (this.parent.enableVirtualization) {
                    const index: number = (this.parent.getRowByIndex(args.dropIndex) as HTMLTableRowElement).rowIndex;
                    this.droppedRecord = tObj.getCurrentViewRecords()[parseInt(index.toString(), 10)];
                }
                else {
                    this.droppedRecord = tObj.getCurrentViewRecords()[args.dropIndex];
                }
            }
            let dragRecords: ITreeData[] = [];
            droppedRecord = this.droppedRecord;
            if (!args.data[0]) {
                dragRecords.push(args.data as ITreeData);
            } else {
                dragRecords = args.data;
            }
            this.parent[this.modifiedRecords].push(args.data[0], droppedRecord);
            let count: number = 0;
            const multiplegrid: string = this.parent.rowDropSettings.targetID;
            this.isMultipleGrid = multiplegrid;
            if (!multiplegrid) {
                this.ensuredropPosition(dragRecords, droppedRecord);
            } else {
                this.isaddtoBottom = multiplegrid && this.isDraggedWithChild;
            }
            const dragLength: number = dragRecords.length;
            if (!isNullOrUndefined(this.parent.idMapping)) {
                dragRecords.reverse();
            }
            for (let i: number = 0; i < dragLength; i++) {
                draggedRecord = dragRecords[parseInt(i.toString(), 10)];
                this.draggedRecord = draggedRecord;
                if (!this.draggedRecord.hasChildRecords) {
                    for (const dragRecord of dragRecords) {
                        if (!isNullOrUndefined(dragRecord.childRecords) &&
                            dragRecord.childRecords.indexOf(this.draggedRecord) !== -1) {
                            this.draggedRecord = undefined;
                        }
                    }
                }
                if (!isNullOrUndefined(this.draggedRecord)) {
                    if (this.dropPosition !== 'Invalid' && !isNullOrUndefined(this.droppedRecord)) {
                        if (!tObj.rowDropSettings.targetID || isByMethod) {
                            this.deleteDragRow();
                        }
                        if (this.draggedRecord === this.droppedRecord) {
                            let correctIndex: number = this.getTargetIdx((<HTMLElement>args.target).offsetParent.parentElement);
                            if (isNaN(correctIndex)) {
                                correctIndex = this.getTargetIdx(args.target.parentElement);
                            }
                            args.dropIndex = correctIndex;
                            droppedRecord = this.droppedRecord = this.parent.getCurrentViewRecords()[args.dropIndex];
                        }
                        if (droppedRecord.parentItem || this.dropPosition === 'middleSegment') {
                            const parentRecords: ITreeData[] = tObj.parentData;
                            const newParentIndex: number = parentRecords.indexOf(this.draggedRecord);
                            if (newParentIndex !== -1) {
                                parentRecords.splice(newParentIndex, 1);
                            }
                        }
                        const recordIndex1: number = this.treeGridData.indexOf(droppedRecord);
                        this.dropAtTop(recordIndex1);
                        if (this.dropPosition === 'bottomSegment') {
                            if (!droppedRecord.hasChildRecords) {
                                if (this.parent.parentIdMapping) {
                                    this.treeData.splice(recordIndex1 + 1, 0, this.draggedRecord.taskData);
                                }
                                this.treeGridData.splice(recordIndex1 + 1, 0, this.draggedRecord);
                            } else {
                                count = this.getChildCount(droppedRecord, 0);
                                if (this.parent.parentIdMapping) {
                                    this.treeData.splice(recordIndex1 + count + 1, 0, this.draggedRecord.taskData);
                                }
                                this.treeGridData.splice(recordIndex1 + count + 1, 0, this.draggedRecord);
                            }
                            if (isNullOrUndefined(droppedRecord.parentItem)) {
                                delete draggedRecord.parentItem;
                                delete draggedRecord.parentUniqueID;
                                draggedRecord.level = 0;
                                if (this.parent.parentIdMapping) {
                                    draggedRecord[this.parent.parentIdMapping] = null;
                                }
                            }
                            if (droppedRecord.parentItem) {
                                const rec: ITreeData[] = this.getChildrecordsByParentID(droppedRecord.parentUniqueID);
                                const childRecords: ITreeData[] = rec[0].childRecords;
                                const droppedRecordIndex: number = childRecords.indexOf(droppedRecord) + 1;
                                childRecords.splice(droppedRecordIndex, 0, draggedRecord);
                                draggedRecord.parentItem = droppedRecord.parentItem;
                                draggedRecord.parentUniqueID = droppedRecord.parentUniqueID;
                                draggedRecord.level = droppedRecord.level;
                                if (this.parent.parentIdMapping) {
                                    draggedRecord[this.parent.parentIdMapping] = droppedRecord[this.parent.parentIdMapping];
                                    draggedRecord.parentItem = droppedRecord.parentItem;
                                    draggedRecord.level = droppedRecord.level;
                                }
                            }
                            if (draggedRecord.hasChildRecords) {
                                const level: number = 1;
                                this.updateChildRecordLevel(draggedRecord, level);
                                this.updateChildRecord(draggedRecord, recordIndex1 + count + 1);
                            }
                        }
                        this.dropMiddle(recordIndex1);
                    }
                    if (isNullOrUndefined(draggedRecord.parentItem)) {
                        const parentRecords: ITreeData[] = tObj.parentData;
                        const newParentIndex: number = parentRecords.indexOf(this.droppedRecord);
                        let nonRepeat: number = 0;
                        parentRecords.filter((e: ITreeData) => {
                            if (draggedRecord.uniqueID === e.uniqueID) {
                                nonRepeat++;
                            }
                        });
                        if (this.dropPosition === 'bottomSegment' && nonRepeat === 0) {
                            parentRecords.splice(newParentIndex + 1, 0, draggedRecord);
                        } else if (this.dropPosition === 'topSegment' && nonRepeat === 0) {
                            parentRecords.splice(newParentIndex, 0, draggedRecord);
                        }
                    }
                    tObj.rowDragAndDropModule.refreshGridDataSource();
                }
            }
        }
    }

    /**
     * Handles the logic for inserting a dragged record into the middle of a parent record's child records.
     *
     * @param {number} recordIndex - The index at which to insert the dragged record relative to the parent record's child records.
     * @returns {void} - This function does not return any value.
     */
    private dropMiddle(recordIndex: number): void {
        const tObj: TreeGrid = this.parent;
        const childRecords: ITreeData[] = findChildrenRecords(this.droppedRecord);
        const childRecordsLength: number = (isNullOrUndefined(childRecords) ||
            childRecords.length === 0) ? recordIndex + 1 :
            childRecords.length + recordIndex + 1;
        if (this.dropPosition === 'middleSegment') {
            if (tObj.parentIdMapping) {
                this.treeData.splice(childRecordsLength, 0, this.draggedRecord.taskData);
                this.treeGridData.splice(childRecordsLength, 0, this.draggedRecord);
            } else {
                this.treeGridData.splice(childRecordsLength, 0, this.draggedRecord);
            }
            this.recordLevel();
            if (this.draggedRecord.hasChildRecords) {
                this.updateChildRecord(this.draggedRecord, childRecordsLength);
            }
        }
    }

    /**
     * Handles the logic for inserting a dragged record at the top of a parent record's child records.
     *
     * @param {number} recordIndex1 - The index at which to insert the dragged record in the tree grid data.
     * @returns {void} - This function does not return any value.
     */
    private dropAtTop(recordIndex1: number): void {
        const tObj: TreeGrid = this.parent;
        if (this.dropPosition === 'topSegment') {
            if (tObj.parentIdMapping) {
                this.treeData.splice(recordIndex1, 0, this.draggedRecord.taskData);
            }
            const targetRecord: ITreeData = this.treeGridData[parseInt(recordIndex1.toString(), 10)];
            this.draggedRecord.parentItem = targetRecord.parentItem;
            this.draggedRecord.parentUniqueID = targetRecord.parentUniqueID;
            this.draggedRecord.level = targetRecord.level;
            // Insert dragged record into the grid data
            this.treeGridData.splice(parseInt(recordIndex1.toString(), 10), 0, this.draggedRecord);
            if (this.draggedRecord.hasChildRecords) {
                const level: number = 1;
                this.updateChildRecord(this.draggedRecord, recordIndex1);
                this.updateChildRecordLevel(this.draggedRecord, level);
            }
            if (this.droppedRecord.parentItem) {
                const rec: ITreeData[] = this.getChildrecordsByParentID(this.droppedRecord.parentUniqueID);
                const childRecords: ITreeData[] = rec[0].childRecords;
                const droppedRecordIndex: number = childRecords.indexOf(this.droppedRecord);
                // Insert the dragged record into the child records at the appropriate position
                childRecords.splice(droppedRecordIndex, 0, this.draggedRecord);
            }
        }
    }

    /**
     * Updates the level and hierarchy of the dragged record based on the drop position.
     *
     * @returns {void} - This function does not return any value.
     */
    private recordLevel(): void {
        const tObj: TreeGrid = this.parent;
        const draggedRecord: ITreeData = this.draggedRecord;
        const droppedRecord: ITreeData = this.droppedRecord;
        const childItem: string = tObj.childMapping;
        if (!droppedRecord.hasChildRecords) {
            droppedRecord.hasChildRecords = true;
            droppedRecord.hasFilteredChildRecords = true;
            if (isNullOrUndefined(droppedRecord.childRecords) || droppedRecord.childRecords.length === 0) {
                droppedRecord.childRecords = [];
                if (!tObj.parentIdMapping && isNullOrUndefined(droppedRecord.taskData[`${childItem}`])) {
                    droppedRecord.taskData[`${childItem}`] = [];
                }
            }
        }
        if (this.dropPosition === 'middleSegment') {
            const parentItem: ITreeData = extend({}, droppedRecord);
            delete parentItem.childRecords;
            draggedRecord.parentItem = parentItem;
            draggedRecord.parentUniqueID = droppedRecord.uniqueID;
            droppedRecord.childRecords.splice(droppedRecord.childRecords.length, 0, draggedRecord);
            setValue('uniqueIDCollection.' + draggedRecord.uniqueID, draggedRecord, tObj);
            const isSelfReference: string = 'isSelfReference';
            if (tObj[`${isSelfReference}`]) {
                droppedRecord[tObj.childMapping] = [];
                droppedRecord[tObj.childMapping].splice(droppedRecord[tObj.childMapping].length, 0, draggedRecord);
            }
            if (!isNullOrUndefined(draggedRecord) && !tObj.parentIdMapping && !isNullOrUndefined(droppedRecord.taskData[`${childItem}`])) {
                droppedRecord.taskData[tObj.childMapping].splice(droppedRecord.childRecords.length, 0, draggedRecord.taskData);
            }
            if (!draggedRecord.hasChildRecords) {
                draggedRecord.level = droppedRecord.level + 1;
            } else {
                const level: number = 1;
                draggedRecord.level = droppedRecord.level + 1;
                this.updateChildRecordLevel(draggedRecord, level);
            }
            droppedRecord.expanded = true;
        }
    }

    /**
     * Deletes the currently dragged row from the TreeGrid.
     *
     * @returns {void} - This function does not return any value.
     */
    private deleteDragRow(): void {
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            this.treeGridData = (<DataManager>this.parent.grid.dataSource).dataSource.json;
            this.treeData = (<DataManager>this.parent.dataSource).dataSource.json;
        } else {
            this.treeGridData = this.parent.grid.dataSource as ITreeData[];
            this.treeData = this.parent.dataSource as ITreeData[];
        }
        const deletedRow: ITreeData = getParentData(this.parent, this.draggedRecord.uniqueID);
        if (!isNullOrUndefined(deletedRow.childRecords) && deletedRow.childRecords.length) {
            deletedRow.hasChildRecords = true;
        }
        this.removeRecords(deletedRow);
    }

    /**
     * Updates the child records of a specified parent record in the TreeGrid.
     *
     * @param {ITreeData} record - The parent record whose child records will be updated.
     * @param {number} count - The initial count to keep track of record positioning.
     * @returns {number} - The updated count after processing all child records.
     */
    private updateChildRecord(record: ITreeData, count: number): number {
        let currentRecord: ITreeData;
        const tObj: TreeGrid = this.parent;
        let length: number = 0;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let i: number = 0; i < length; i++) {
            if (!this.isMultipleGrid) {
                currentRecord = getValue('uniqueIDCollection.' + record.childRecords[parseInt(i.toString(), 10)].uniqueID, tObj);
            } else {
                currentRecord = record.childRecords[parseInt(i.toString(), 10)];
            }
            count++;
            tObj.flatData.splice(count, 0, currentRecord);
            setValue('uniqueIDCollection.' + currentRecord.uniqueID, currentRecord, this.parent);
            if (tObj.parentIdMapping) {
                this.treeData.splice(count, 0, currentRecord.taskData);
            }
            if (currentRecord.hasChildRecords) {
                count = this.updateChildRecord(currentRecord, count);
            }
        }
        return count;
    }

    /**
     * Updates the level of child records for a specified parent record in the TreeGrid.
     *
     * @param {ITreeData} record - The parent record whose child records' levels will be updated.
     * @param {number} level - The current level of the parent record.
     * @returns {number} - The updated level after processing all child records.
     */
    private updateChildRecordLevel(record: ITreeData, level: number): number {
        let length: number = 0;
        let currentRecord: ITreeData;
        level++;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let i: number = 0; i < length; i++) {
            if (!this.isMultipleGrid) {
                currentRecord = getValue('uniqueIDCollection.' + record.childRecords[parseInt(i.toString(), 10)].uniqueID, this.parent);
            } else {
                currentRecord = record.childRecords[parseInt(i.toString(), 10)];
            }
            let parentData: ITreeData;
            if (record.parentItem) {
                parentData = getParentData(this.parent, record.parentItem.uniqueID);
            }
            if (isNullOrUndefined(parentData) && !isNullOrUndefined(record.parentItem)) { parentData = record.parentItem; }
            currentRecord.level = record.parentItem ? parentData.level + level : record.level + 1;
            if (currentRecord.hasChildRecords) {
                level--;
                level = this.updateChildRecordLevel(currentRecord, level);
            }
        }
        return level;
    }

    /**
     * Removes specified records from the TreeGrid data source.
     *
     * @param {ITreeData} record - The record to be removed, including any child records if applicable.
     * @returns {void} - This method does not return a value.
     */
    private removeRecords(record: ITreeData): void {
        const tObj: TreeGrid = this.parent;
        let dataSource: Object;
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            dataSource = (<DataManager>this.parent.dataSource).dataSource.json;
        } else {
            dataSource = this.parent.dataSource;
        }
        const deletedRow: ITreeData = record;
        const isSelfReference: boolean = !isNullOrUndefined(tObj.parentIdMapping);
        const flatParentData: ITreeData = (this.getChildrecordsByParentID(deletedRow.parentUniqueID) as ITreeData)[0];
        if (deletedRow) {
            if (deletedRow.parentItem) {
                const childRecords: ITreeData[] = flatParentData ? flatParentData.childRecords : [];
                let childIndex: number = 0;
                if (childRecords && childRecords.length > 0) {
                    childIndex = childRecords.indexOf(deletedRow);
                    flatParentData.childRecords.splice(childIndex, 1);
                    if (!this.parent.parentIdMapping || tObj.enableImmutableMode) {
                        editAction({ value: deletedRow, action: 'delete' }, this.parent,
                                   isSelfReference, deletedRow.index, deletedRow.index);
                    }
                }
            }
            if (tObj.parentIdMapping) {
                if (deletedRow.hasChildRecords && deletedRow.childRecords.length > 0) {
                    this.removeChildItem(deletedRow);
                }
                let idx: number; let idz: number;
                const treeGridData: ITreeData[] = dataSource as ITreeData[];
                for (let i: number = 0; i < treeGridData.length; i++) {
                    if (treeGridData[parseInt(i.toString(), 10)][this.parent.idMapping] === deletedRow.taskData[this.parent.idMapping]) {
                        idx = i;
                    }
                }
                for (let i: number = 0; i < this.treeGridData.length; i++) {
                    if (this.treeGridData[parseInt(i.toString(), 10)][this.parent.idMapping]
                        === deletedRow.taskData[this.parent.idMapping]) {
                        idz = i;
                    }
                }
                if (idx !== -1 && !isNullOrUndefined(idx)) {
                    (dataSource as ITreeData[]).splice(idx, 1);
                }
                if (idz !== -1 && !isNullOrUndefined(idz)) {
                    this.treeGridData.splice(idz, 1);
                }
            }
            let recordIndex: number = this.treeGridData.indexOf(deletedRow);
            if (!tObj.parentIdMapping) {
                const parentIndex: number = this.parent.parentData.indexOf(deletedRow);
                if (parentIndex !== -1) {
                    tObj.parentData.splice(parentIndex, 1);
                    (dataSource as ITreeData[]).splice(parentIndex, 1);
                }
            }
            if (recordIndex === -1 && !tObj.parentIdMapping) {
                const primaryKeyField: string = tObj.getPrimaryKeyFieldNames()[0];
                for (let j: number = 0; j < this.treeGridData.length; j++) {
                    if (this.treeGridData[parseInt(j.toString(), 10)][`${primaryKeyField}`] === deletedRow[`${primaryKeyField}`]) {
                        recordIndex = j;
                    }
                }
            }
            if (!tObj.parentIdMapping) {
                const deletedRecordCount: number = this.getChildCount(deletedRow, 0);
                this.treeGridData.splice(recordIndex, deletedRecordCount + 1);
            }
            if (deletedRow.parentItem && flatParentData && flatParentData.childRecords && !flatParentData.childRecords.length) {
                flatParentData.expanded = false;
                flatParentData.hasChildRecords = false;
                flatParentData.hasFilteredChildRecords = false;
            }
            if (this.parent[this.modifiedRecords].indexOf(flatParentData) === -1 && !isNullOrUndefined(flatParentData)) {
                this.parent[this.modifiedRecords].push(flatParentData);
            }
            if (!isNullOrUndefined(flatParentData)) {
                this.updateModifiedRecords(flatParentData);
            }
        }
    }

    /**
     * Updates the records in the TreeGrid data source that have been modified.
     *
     * @param {ITreeData} record - The record to update, along with its parent records if applicable.
     * @returns {void} - This method does not return a value.
     */
    private updateModifiedRecords(record: ITreeData): void {
        const parentData: Object = getParentData(this.parent, record.parentUniqueID);
        if (!isNullOrUndefined(parentData)) {
            this.parent[this.modifiedRecords].push(parentData);
            this.updateModifiedRecords(parentData);
        }
    }

    /**
     * Recursively removes child records from the specified record and updates the data source.
     *
     * @param {ITreeData} record - The parent record whose child records are to be removed.
     * @returns {void} - This method does not return a value.
     */
    private removeChildItem(record: ITreeData): void {
        let currentRecord: ITreeData;
        let idx: number;
        let idz: number;
        let dataSource: Object;
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            dataSource = (<DataManager>this.parent.dataSource).dataSource.json;
        } else {
            dataSource = this.parent.dataSource;
        }
        for (let i: number = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[parseInt(i.toString(), 10)];
            if (!isNullOrUndefined(currentRecord.childRecords) && currentRecord.childRecords.length) {
                currentRecord.hasChildRecords = true;
            }
            let treeGridData: Object;
            if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
                treeGridData = (<DataManager>this.parent.dataSource).dataSource.json;
            } else {
                treeGridData = this.parent.dataSource;
            }
            for (let i: number = 0; i < (<ITreeData[]>treeGridData).length; i++) {
                if (treeGridData[parseInt(i.toString(), 10)][this.parent.idMapping] === currentRecord.taskData[this.parent.idMapping]) {
                    idx = i;
                }
            }
            for (let i: number = 0; i < this.treeGridData.length; i++) {
                if (this.treeGridData[parseInt(i.toString(), 10)][this.parent.idMapping]
                    === currentRecord.taskData[this.parent.idMapping]) {
                    idz = i;
                    break;
                }
            }
            if (idx !== -1 && !isNullOrUndefined(idx)) {
                (dataSource as ITreeData[]).splice(idx, 1);
            }
            if (idz !== -1 && !isNullOrUndefined(idz)) {
                this.treeGridData.splice(idz, 1);
            }
            if (currentRecord.hasChildRecords) {
                this.removeChildItem(currentRecord);
            }
        }
    }

    /**
     * Retrieves the count of child records associated with the specified parent record.
     *
     * @param {ITreeData} record - The parent record for which child count is to be calculated.
     * @param {number} count - The initial count to start with, usually passed as 0.
     * @returns {number} - The total count of child records.
     */
    private getChildCount(record: ITreeData, count: number): number {
        let currentRecord: ITreeData;
        if (!record.hasChildRecords) {
            return 0;
        }
        for (let i: number = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[parseInt(i.toString(), 10)];
            count++;
            if (currentRecord.hasChildRecords) {
                count = this.getChildCount(currentRecord, count);
            }
        }
        return count;
    }

    /**
     * Ensures the validity of the drop position for the dragged records by verifying the hierarchy and position constraints.
     * If the current record is found in the dragged records' children, sets the drop position to 'Invalid'.
     *
     * @param {ITreeData[]} draggedRecords - The array of dragged records being verified.
     * @param {ITreeData} currentRecord - The current record to check against dragged records.
     * @returns {void} - This function does not return a value.
     */
    private ensuredropPosition(draggedRecords: ITreeData[], currentRecord: ITreeData): void {
        draggedRecords.filter((e: ITreeData) => {
            if (e.hasChildRecords && !isNullOrUndefined(e.childRecords)) {
                const valid: number = e.childRecords.indexOf(currentRecord);
                if (valid === -1) {
                    this.ensuredropPosition(e.childRecords, currentRecord);
                } else {
                    this.dropPosition = 'Invalid';
                    this.addErrorElem();
                    this.canDrop = false;
                    if (isNullOrUndefined(this.parent.rowDropSettings.targetID)) {
                        this.removetopOrBottomBorder();
                        this.removeChildBorder();
                    }
                    return;
                }
            }
        });
    }

    private isDuplicateData(currentData: any): boolean {
        const primaryKeys: string[] = this.parent.getPrimaryKeyFieldNames();
        if (primaryKeys.length === 0) {
            return false;
        }
        return this.parent.flatData.some((data: any) =>
            // eslint-disable-next-line
            primaryKeys.every((key: string) => data[key] === currentData[key])
        );
    }

    /**
     * Cleans up resources, event listeners, and DOM elements when the TreeGrid component is destroyed.
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
    }

    /**
     * @hidden
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.rowdraging, this.Rowdraging);
        this.parent.off(events.rowDropped, this.rowDropped);
        this.parent.off(events.rowsAdd, this.rowsAdded);
        this.parent.off(events.rowsRemove, this.rowsRemoved);
    }
    /**
     * hidden
     */
    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns RowDragAndDrop module name
     */
    private getModuleName(): string {
        return 'rowDragAndDrop';
    }
}


interface PositionOffSet {
    left: number;
    top: number;
}

