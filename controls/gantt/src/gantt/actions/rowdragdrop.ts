import { TreeGrid, RowDD as TreeGridRowDD } from '@syncfusion/ej2-treegrid';
import { RowDragEventArgs } from '@syncfusion/ej2-grids';
import { Gantt } from '../base/gantt';
import { isNullOrUndefined, extend, classList, addClass, getValue } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { IGanttData, RowPosition } from '../base/common';
import { RowDropEventArgs, IParent } from '../base/interface';


/**
 * Gantt Excel Export module
 */
export class RowDD {
    private parent: Gantt;
    public isTest: boolean = false;
    /** @hidden */
    private ganttData: IGanttData[];
    /** @hidden */
    private draggedRecord: IGanttData;
    /** @hidden */
    private updateParentRecords: IGanttData[] = [];
    /** @hidden */
    private droppedRecord: IGanttData;
    /** @hidden */
    public isaddtoBottom: boolean = false;
    /** @hidden */
    private dropPosition: string;
    /** @hidden */
    private canDrop: boolean = true;
    /**
     * Constructor for Excel Export module
     */
    constructor(gantt: Gantt) {
        this.parent = gantt;
        TreeGrid.Inject(TreeGridRowDD);
        this.parent.treeGrid.allowRowDragAndDrop = this.parent.allowRowDragAndDrop;
        this.bindEvents();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'rowDragAndDrop';
    }
    /**
     * To destroy excel export module.
     * @private
     */
    public destroy(): void {
         // Destroy Method
    }
    /**
     * To bind excel exporting events.
     * @return {void}
     * @private
     */
    private bindEvents(): void {
        this.parent.treeGrid.rowDragStart = this.rowDragStart.bind(this);
        this.parent.treeGrid.rowDragStartHelper = this.rowDragStartHelper.bind(this);
        this.parent.treeGrid.rowDrag = this.rowDrag.bind(this);
        this.parent.treeGrid.rowDrop = this.rowDrop.bind(this);
    }

    private rowDragStart(args: RowDragEventArgs): void {
        this.parent.trigger('rowDragStart', args);
        this.parent.element.style.position = 'relative'; // for positioning the drag element properly
    }
    private  addErrorElem(): void {
        let dragelem: Element = document.getElementsByClassName('e-ganttdrag')[0];
        let errorelem: number = dragelem.querySelectorAll('.e-errorelem').length;
        if (!errorelem) {
            let ele: Element = document.createElement('div');
            classList(ele, ['e-errorcontainer'], []);
            classList(ele, ['e-icons', 'e-errorelem'], []);
            let errorVal: Element = dragelem.querySelector('.errorValue');
            let content: string = dragelem.querySelector('.e-rowcell').innerHTML;
            if (errorVal) {
                content = errorVal.innerHTML;
                errorVal.parentNode.removeChild(errorVal);
            }
            dragelem.querySelector('.e-rowcell').innerHTML = '';
            let spanContent: HTMLElement = document.createElement('span');
            spanContent.className = 'errorValue';
            spanContent.style.paddingLeft = '16px';
            spanContent.innerHTML = content;
            dragelem.querySelector('.e-rowcell').appendChild(ele);
            dragelem.querySelector('.e-rowcell').appendChild(spanContent);
        }
    }
    private removeErrorElem(): void {
        let errorelem: Element = document.querySelector('.e-errorelem');
        if (errorelem) {
            errorelem.remove();
        }
    }

    private rowDrag(args: RowDragEventArgs): void {
        let cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        cloneElement.style.display = 'none';
        let ganttDragElement: HTMLElement = cloneElement.cloneNode(true) as HTMLElement;
        ganttDragElement.classList.add('e-ganttdrag');
        ganttDragElement.style.display = '';
        if (this.parent.element.querySelectorAll('.e-cloneproperties').length <= 1 ) {
            this.parent.element.appendChild(ganttDragElement);
        } else {
        if (document.getElementsByClassName('e-cloneproperties')[0].querySelectorAll('.e-errorelem').length) {
            this.addErrorElem();
        } else {
            this.removeErrorElem();
        }
    }
        if (this.parent.gridLines === 'Both') {
            addClass(this.parent.element.querySelectorAll('.e-ganttdrag .e-rowcell'), ['e-bothganttlines']);
        }
        let dragElement: HTMLElement = this.parent.element.querySelector('.e-ganttdrag') as HTMLElement;
        let ganttTop: number = this.parent.element.getClientRects()[0].top;
        let ganttLeft: number = this.parent.element.getClientRects()[0].left;
        let left: number = getValue('event', args.originalEvent).clientX - ganttLeft;
        let top: number = getValue('event', args.originalEvent).clientY - ganttTop;
        dragElement.style.left = left + 20 + 'px';
        dragElement.style.top = top + 20 + 'px';
        this.parent.trigger('rowDrag', args);
    }
    private rowDragStartHelper(args: RowDragEventArgs): void {
        this.parent.trigger('rowDragStartHelper', args);
        if (this.parent.filterSettings.columns.length > 0 || this.parent.sortSettings.columns.length > 0) {
            args.cancel = true;
        }
    }
    private rowDrop(args: RowDropEventArgs): void {
        let ganttDragelem: Element = document.querySelector('.e-ganttdrag');
        if (ganttDragelem) {
            ganttDragelem.remove();
        }
        args.dropRecord = this.parent.currentViewData[args.dropIndex];
        this.parent.trigger('rowDrop', args);
        if (!args.cancel) {
            args.cancel = true;
            args.requestType = 'beforeDrop';
            this.parent.trigger('actionBegin', args);
            this.dropRows(args, true); // method to update the data collections based on drop action
        }
    }
    private dropRows(args: RowDropEventArgs, isByMethod?: boolean): void {
        this.dropPosition = args.dropPosition;
        if (args.dropPosition !== 'Invalid') {
            let gObj: Gantt = this.parent;
            let draggedRecord: IGanttData; let droppedRecord: IGanttData;
            this.droppedRecord = gObj.currentViewData[args.dropIndex];
            let dragRecords: IGanttData[] = [];
            droppedRecord = this.droppedRecord;
            if (!args.data[0]) {
                dragRecords.push(args.data as IGanttData);
            } else {
                dragRecords = args.data;
            }
            let count: number = 0;
            let dragLength: number = dragRecords.length;
            for (let i: number = 0; i < dragLength; i++) {
                this.parent.isOnEdit = true;
                draggedRecord = dragRecords[i];
                this.draggedRecord = draggedRecord;
                if (this.dropPosition !== 'Invalid') {
                    if (isByMethod) {
                        this.deleteDragRow();
                    }
                    let recordIndex1: number = this.ganttData.indexOf(droppedRecord);
                    if (this.dropPosition === 'topSegment') {
                        this.dropAtTop(recordIndex1);
                    }
                    if (this.dropPosition === 'bottomSegment') {
                        if (!droppedRecord.hasChildRecords) {
                            if (this.parent.taskFields.parentID && (this.parent.dataSource as IGanttData[]).length > 0) {
                               (this.parent.dataSource as IGanttData[]).splice(recordIndex1 + 1, 0, this.draggedRecord.taskData);
                            }
                            this.ganttData.splice(recordIndex1 + 1, 0, this.draggedRecord);
                            this.parent.flatData.splice(recordIndex1 + 1, 0, this.draggedRecord);
                            this.parent.ids.splice(recordIndex1 + 1, 0, this.draggedRecord.ganttProperties.taskId.toString());

                        } else {
                            count = this.parent.editModule.getChildCount(droppedRecord, 0);
                            if (this.parent.taskFields.parentID && (this.parent.dataSource as IGanttData[]).length > 0) {
                               (this.parent.dataSource as IGanttData[]).splice(recordIndex1 + count + 1, 0, this.draggedRecord.taskData);
                            }
                            this.ganttData.splice(recordIndex1 + count + 1, 0, this.draggedRecord);
                            this.parent.flatData.splice(recordIndex1 + count + 1, 0, this.draggedRecord);
                            this.parent.ids.splice(recordIndex1 + count + 1, 0, this.draggedRecord.ganttProperties.taskId.toString());
                        }
                        draggedRecord.parentItem = this.ganttData[recordIndex1].parentItem;
                        draggedRecord.parentUniqueID = this.ganttData[recordIndex1].parentUniqueID;
                        draggedRecord.level = this.ganttData[recordIndex1].level;
                        if (draggedRecord.hasChildRecords) {
                            let level: number = 1;
                            this.updateChildRecord(draggedRecord, recordIndex1 + count + 1);
                            this.updateChildRecordLevel(draggedRecord, level);
                        }
                        if (droppedRecord.parentItem) {
                            let rec: IGanttData[] = this.parent.getParentTask(droppedRecord.parentItem).childRecords;
                            let childRecords: IGanttData[] = rec;
                            let droppedRecordIndex: number = childRecords.indexOf(droppedRecord) + 1;
                            childRecords.splice(droppedRecordIndex, 0, draggedRecord);
                        }
                    }
                    if (this.dropPosition === 'middleSegment') {
                        this.dropMiddle(recordIndex1);
                    }
                    if (!isNullOrUndefined(draggedRecord.parentItem && this.updateParentRecords.indexOf(draggedRecord.parentItem) !== -1)) {
                        this.updateParentRecords.push(draggedRecord.parentItem);
                    }
                }
                gObj.rowDragAndDropModule.refreshDataSource();
            }
            if (this.dropPosition === 'middleSegment') {
                if (droppedRecord.ganttProperties.predecessor) {
                this.parent.editModule.removePredecessorOnDelete(droppedRecord);
                droppedRecord.ganttProperties.predecessor = null;
                droppedRecord.ganttProperties.predecessorsName = null;
                droppedRecord[this.parent.taskFields.dependency] = null;
                droppedRecord.taskData[this.parent.taskFields.dependency] = null;
            }
                if (droppedRecord.ganttProperties.isMilestone) {
                    this.parent.setRecordValue('isMilestone', false, droppedRecord.ganttProperties, true);
                    if (!isNullOrUndefined(droppedRecord.taskData[this.parent.taskFields.milestone])) {
                        if (droppedRecord.taskData[this.parent.taskFields.milestone] === true) {
                            droppedRecord.taskData[this.parent.taskFields.milestone] = false;
                        }
                    }
                }
        }
        // method to update the edited parent records
            for (let j: number = 0; j < this.updateParentRecords.length; j++) {
                this.parent.dataOperation.updateParentItems(this.updateParentRecords[j]);
            }
            this.updateParentRecords = [];
            this.parent.isOnEdit = false;
        }
        this.parent.treeGrid.refresh();
        args.requestType = 'rowDropped';
        args.modifiedRecords = this.parent.editedRecords;
        this.parent.trigger('actionComplete', args);
        this.parent.editedRecords = [];
    }

    private refreshDataSource(): void {
        let draggedRecord: IGanttData = this.draggedRecord;
        let droppedRecord: IGanttData = this.droppedRecord;
        let proxy: Gantt = this.parent;
        let tempDataSource: Object; let idx: number;
        if (this.parent.dataSource instanceof DataManager && this.parent.dataSource.dataSource.json.length > 0) {
            tempDataSource = (<DataManager>proxy.dataSource).dataSource.json;
        } else {
            tempDataSource = proxy.dataSource;
        }
        if ((tempDataSource as IGanttData[]).length > 0 && (!isNullOrUndefined(droppedRecord) && !droppedRecord.parentItem)) {
            for (let i: number = 0; i < Object.keys(tempDataSource).length; i++) {
                if (tempDataSource[i][this.parent.taskFields.child] === droppedRecord.taskData[this.parent.taskFields.child]) {
                    idx = i;
                }
            }
            if (this.dropPosition === 'topSegment') {
                if (!this.parent.taskFields.parentID) {
                    (tempDataSource as IGanttData[]).splice(idx, 0, draggedRecord.taskData);
                }
           } else if (this.dropPosition === 'bottomSegment') {
                if (!this.parent.taskFields.parentID) {
                    (tempDataSource as IGanttData[]).splice(idx + 1, 0, draggedRecord.taskData);
                }
           }
        } else if (!this.parent.taskFields.parentID && (!isNullOrUndefined(droppedRecord) && droppedRecord.parentItem)) {
            if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                let rowPosition: RowPosition = this.dropPosition === 'topSegment' ? 'Above' : 'Below';
                this.parent.editModule.addRowSelectedItem = droppedRecord;
                this.parent.editModule.updateRealDataSource(draggedRecord, rowPosition);
                delete this.parent.editModule.addRowSelectedItem;
            }
        }
        if (this.parent.taskFields.parentID) {
           if (draggedRecord.parentItem) {
              if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                draggedRecord[this.parent.taskFields.parentID] = droppedRecord[this.parent.taskFields.parentID];
                draggedRecord.taskData[this.parent.taskFields.parentID] = droppedRecord[this.parent.taskFields.parentID];
              } else {
                draggedRecord[this.parent.taskFields.parentID] = droppedRecord[this.parent.taskFields.id];
                draggedRecord.taskData[this.parent.taskFields.parentID] = droppedRecord[this.parent.taskFields.id];
              }
           } else {
            draggedRecord[this.parent.taskFields.parentID] = null;
            draggedRecord.taskData[this.parent.taskFields.parentID] = null;
           }
        }
    }
    private dropMiddle(recordIndex1: number): void {
        let gObj: Gantt = this.parent;
        let childRecords: number = this.parent.editModule.getChildCount(this.droppedRecord, 0);
        let childRecordsLength: number = (isNullOrUndefined(childRecords) ||
            childRecords === 0) ? recordIndex1 + 1 :
            childRecords + recordIndex1 + 1;
        if (this.dropPosition === 'middleSegment') {
            if (gObj.taskFields.parentID &&  (this.parent.dataSource as IGanttData[]).length > 0) {
                (this.parent.dataSource as IGanttData[]).splice(childRecordsLength, 0, this.draggedRecord.taskData);
            }
            this.ganttData.splice(childRecordsLength, 0, this.draggedRecord);
            this.parent.flatData.splice(childRecordsLength, 0, this.draggedRecord);
            this.parent.ids.splice(childRecordsLength, 0, this.draggedRecord.ganttProperties.taskId.toString());
            if (this.draggedRecord.hasChildRecords) {
                this.updateChildRecord(this.draggedRecord, childRecordsLength, this.droppedRecord.expanded);
            }
            this.recordLevel();
            if (isNullOrUndefined(this.draggedRecord.parentItem &&
                this.updateParentRecords.indexOf(this.draggedRecord.parentItem) !== -1)) {
                this.updateParentRecords.push(this.draggedRecord.parentItem);
            }
        }
    }
    private recordLevel(): void {
        let gObj: Gantt = this.parent;
        let draggedRecord: IGanttData = this.draggedRecord;
        let droppedRecord: IGanttData = this.droppedRecord;
        let childItem: string = gObj.taskFields.child;
        if (!droppedRecord.hasChildRecords) {
            droppedRecord.hasChildRecords = true;
            if (!droppedRecord.childRecords.length) {
                droppedRecord.childRecords = [];
                if (!gObj.taskFields.parentID && isNullOrUndefined(droppedRecord.taskData[childItem])) {
                    droppedRecord.taskData[childItem] = [];
                }
            }
        }
        if (this.dropPosition === 'middleSegment') {
            let parentItem: IGanttData = extend({}, droppedRecord);
            delete parentItem.childRecords;
            let createParentItem: IParent = {
                uniqueID : parentItem.uniqueID,
                expanded : parentItem.expanded,
                level : parentItem.level,
                index : parentItem.index,
                taskId : parentItem.ganttProperties.taskId
            };
            draggedRecord.parentItem = createParentItem;
            draggedRecord.parentUniqueID = droppedRecord.uniqueID;
            droppedRecord.childRecords.splice(droppedRecord.childRecords.length, 0, draggedRecord);
            if (!isNullOrUndefined(draggedRecord) && !gObj.taskFields.parentID && !isNullOrUndefined(droppedRecord.taskData[childItem])) {
                droppedRecord.taskData[gObj.taskFields.child].splice(droppedRecord.childRecords.length, 0, draggedRecord.taskData);
            }
            if (!draggedRecord.hasChildRecords) {
                draggedRecord.level = droppedRecord.level + 1;
            } else {
                let level: number = 1;
                draggedRecord.level = droppedRecord.level + 1;
                this.updateChildRecordLevel(draggedRecord, level);
            }
            droppedRecord.expanded = true;
        }
    }
    private deleteDragRow(): void {
        if (this.parent.dataSource instanceof DataManager && this.parent.dataSource.dataSource.json.length > 0) {
            this.ganttData = this.parent.dataSource.dataSource.json;
        } else {
            this.ganttData = this.parent.currentViewData as IGanttData[];
        }
        let deletedRow: IGanttData;
        deletedRow = this.parent.getTaskByUniqueID(this.draggedRecord.uniqueID);
        this.removeRecords(deletedRow);
    }

    private dropAtTop(recordIndex1: number): void {
        let gObj: Gantt = this.parent;
        if (gObj.taskFields.parentID && (this.parent.dataSource as IGanttData[]).length > 0) {
            (this.parent.dataSource as IGanttData[]).splice(recordIndex1, 0, this.draggedRecord.taskData);
        }
        this.draggedRecord.parentItem = this.ganttData[recordIndex1].parentItem;
        this.draggedRecord.parentUniqueID = this.ganttData[recordIndex1].parentUniqueID;
        this.draggedRecord.level = this.ganttData[recordIndex1].level;
        this.ganttData.splice(recordIndex1, 0, this.draggedRecord);
        this.parent.flatData.splice(recordIndex1, 0, this.draggedRecord);
        this.parent.ids.splice(recordIndex1, 0, this.draggedRecord.ganttProperties.taskId.toString());
        if (this.draggedRecord.hasChildRecords) {
            let level: number = 1;
            this.updateChildRecord(this.draggedRecord, recordIndex1);
            this.updateChildRecordLevel(this.draggedRecord, level);
        }
        if (this.droppedRecord.parentItem) {
            let rec: IGanttData[] = this.parent.getParentTask(this.droppedRecord.parentItem).childRecords;
            let childRecords: IGanttData[] = rec;
            let droppedRecordIndex: number = childRecords.indexOf(this.droppedRecord);
            childRecords.splice(droppedRecordIndex, 0, this.draggedRecord);
        }
        if (!isNullOrUndefined(this.draggedRecord.parentItem && this.updateParentRecords.indexOf(this.draggedRecord.parentItem) !== -1)) {
            this.updateParentRecords.push(this.draggedRecord.parentItem);
        }
    }
    private updateChildRecordLevel(record: IGanttData, level: number): number {
        let length: number = 0;
        let currentRecord: IGanttData;
        level++;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let i: number = 0; i < length; i++) {
            currentRecord = record.childRecords[i];
            let parentData: IGanttData;
            if (record.parentItem) {
                parentData = this.parent.getParentTask(record.parentItem);
            }
            currentRecord.level = record.parentItem ? parentData.level + level : record.level + 1;
            if (currentRecord.hasChildRecords) {
                level--;
                level = this.updateChildRecordLevel(currentRecord, level);
            }
        }
        return level;
    }
    private updateChildRecord(record: IGanttData, count: number, expanded?: boolean): number {
        let currentRecord: IGanttData;
        let gObj: Gantt = this.parent;
        let length: number = 0;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let i: number = 0; i < length; i++) {
            currentRecord = record.childRecords[i];
            count++;
            gObj.currentViewData.splice(count, 0, currentRecord);
            gObj.flatData.splice(count, 0, currentRecord);
            this.parent.ids.splice(count, 0, currentRecord.ganttProperties.taskId.toString());
            if (gObj.taskFields.parentID && (gObj.dataSource as IGanttData[]).length > 0) {
                (gObj.dataSource as IGanttData[]).splice(count, 0, currentRecord.taskData);
            }
            if (currentRecord.hasChildRecords) {
                count = this.updateChildRecord(currentRecord, count);
            }
        }
        return count;
    }
    private removeRecords(record: IGanttData): void {
        let gObj: Gantt = this.parent;
        let dataSource: Object;
        dataSource = this.parent.dataSource;
        let deletedRow: IGanttData = record;
        let flatParentData: IGanttData = this.parent.getParentTask(deletedRow.parentItem);
        if (deletedRow) {
            if (deletedRow.parentItem) {
                let childRecords: IGanttData[] = flatParentData ? flatParentData.childRecords : [];
                let childIndex: number = 0;
                if (childRecords && childRecords.length > 0) {
                    childIndex = childRecords.indexOf(deletedRow);
                    flatParentData.childRecords.splice(childIndex, 1);
                    // collection for updating parent record
                    this.updateParentRecords.push(flatParentData);
                }
            }
             //method to delete the record from datasource collection
            if (deletedRow && !this.parent.taskFields.parentID) {
                let deleteRecordIDs: string[] = [];
                deleteRecordIDs.push(deletedRow.ganttProperties.taskId.toString());
                this.parent.editModule.removeFromDataSource(deleteRecordIDs);
            }
            if (gObj.taskFields.parentID) {
                if (deletedRow.hasChildRecords && deletedRow.childRecords.length > 0) {
                    this.removeChildItem(deletedRow);
                }
                let idx: number;
                let ganttData: IGanttData[] = (dataSource as IGanttData[]).length > 0 ?
                    dataSource as IGanttData[] : this.parent.currentViewData;
                for (let i: number = 0; i < ganttData.length; i++) {
                    if (ganttData[i][this.parent.taskFields.id] === deletedRow.taskData[this.parent.taskFields.id]) {
                        idx = i;
                    }
                }
                if (idx !== -1) {
                    if ((dataSource as IGanttData[]).length > 0) {
                        (dataSource as IGanttData[]).splice(idx, 1);
                    }
                    this.ganttData.splice(idx, 1);
                    this.parent.flatData.splice(idx, 1);
                    this.parent.ids.splice(idx, 1);
                }
            }
            let recordIndex: number = this.ganttData.indexOf(deletedRow);
            if (!gObj.taskFields.parentID) {
                let deletedRecordCount: number = this.parent.editModule.getChildCount(deletedRow, 0);
                this.ganttData.splice(recordIndex, deletedRecordCount + 1);
                this.parent.flatData.splice(recordIndex, deletedRecordCount + 1);
                this.parent.ids.splice(recordIndex, deletedRecordCount + 1);
            }
            if (deletedRow.parentItem && flatParentData && flatParentData.childRecords && !flatParentData.childRecords.length) {
                flatParentData.expanded = false;
                flatParentData.hasChildRecords = false;
            }
        }
    }
    private removeChildItem(record: IGanttData): void {
        let gObj: Gantt = this.parent;
        let currentRecord: IGanttData;
        let idx: number;
        for (let i: number = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[i];
            let ganttData: Object;
            ganttData = (this.parent.dataSource as IGanttData[]).length > 0 ?
               this.parent.dataSource as IGanttData[] : this.parent.currentViewData;
            for (let i: number = 0; i < (< IGanttData[]>ganttData).length; i++) {
                if (ganttData[i][this.parent.taskFields.id] === currentRecord.taskData[this.parent.taskFields.id]) {
                    idx = i;
                }
            }
            if (idx !== -1) {
                if ((gObj.dataSource as IGanttData[]).length > 0) {
                    (gObj.dataSource as IGanttData[]).splice(idx, 1);
                }
                this.ganttData.splice(idx, 1);
                this.parent.flatData.splice(idx, 1);
                this.parent.ids.splice(idx, 1);
            }
            if (currentRecord.hasChildRecords) {
                this.removeChildItem(currentRecord);
            }
        }
    }
    /**
     * Reorder the rows based on given indexes and position
     */
    public reorderRows(fromIndexes: number[], toIndex: number, position: string): void {
        if (fromIndexes[0] !== toIndex && position === 'above' || 'below' || 'child') {
            if (position === 'above') {
                this.dropPosition = 'topSegment';
            }
            if (position === 'below') {
                this.dropPosition = 'bottomSegment';
            }
            if (position === 'child') {
                this.dropPosition = 'middleSegment';
            }
            let data: IGanttData[] = [];
            for (let i: number = 0; i < fromIndexes.length; i++) {
                data[i] = this.parent.currentViewData[fromIndexes[i]];
            }
            let isByMethod: boolean = true;
            let args: RowDropEventArgs = {
                data: data,
                dropIndex: toIndex,
                dropPosition: this.dropPosition
            };
            this.dropRows(args, isByMethod);
        } else {
            return;
        }
    }
}
