import { TreeGrid, RowDD as TreeGridRowDD } from '@syncfusion/ej2-treegrid';
import { RowDragEventArgs } from '@syncfusion/ej2-grids';
import { Gantt } from '../base/gantt';
import { isNullOrUndefined, extend, classList, addClass, getValue, closest } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { IGanttData, RowPosition, isCountRequired } from '../base/common';
import { RowDropEventArgs, IParent } from '../base/interface';
import { ITreeData } from '@syncfusion/ej2-treegrid';
import { TaskFieldsModel } from '../models/models';

/**
 * Gantt Excel Export module
 */
export class RowDD {
    private parent: Gantt;
    public isTest: boolean = false;
    /** @hidden */
    private ganttData: IGanttData[];
    /** @hidden */
    private treeGridData: ITreeData[];
    /** @hidden */
    private draggedRecord: IGanttData;
    /** @hidden */
    private updateParentRecords: IGanttData[] = [];
    /** @hidden */
    private droppedRecord: IGanttData;
    /** @hidden */
    public isaddtoBottom: boolean = false;
    /** @hidden */
    private previousParent: string;
    private updateCollection: Object = {};
    private dropPosition: string;
    /** @hidden */
    private isSharedTask: boolean = false;
    /** @hidden */
    private canDrop: boolean = true;
    /**
     * Constructor for Excel Export module
     *
     * @param {Gantt} gantt .
     */
    constructor(gantt: Gantt) {
        this.parent = gantt;
        TreeGrid.Inject(TreeGridRowDD);
        this.parent.treeGrid.allowRowDragAndDrop = this.parent.allowRowDragAndDrop;
        this.bindEvents();
    }
    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} .
     * @private
     */
    protected getModuleName(): string {
        return 'rowDragAndDrop';
    }
    /**
     * To destroy excel export module.
     *
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        // Destroy Method
    }
    /**
     * To bind excel exporting events.
     *
     * @returns {void} .
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
    private addErrorElem(): void {
        const dragElem: Element = document.querySelector('.e-ganttdrag');
        if (!dragElem) {
            return;
        }
        const errorElemExists: boolean = !!dragElem.querySelector('.e-errorelem');
        if (errorElemExists) {
            return;
        }
        const errorContainer: Element = document.createElement('div');
        errorContainer.classList.add('e-errorcontainer', 'e-icons', 'e-errorelem');
        const rowCell: Element = dragElem.querySelector('.e-rowcell');
        if (!rowCell) {
            return;
        }
        let content: NodeList = rowCell.childNodes;
        const errorVal: Element = rowCell.querySelector('.errorValue');
        if (errorVal) {
            content = errorVal.childNodes;
            errorVal.remove(); // Use `remove()` for cleaner DOM manipulation.
        }
        rowCell.innerHTML = ''; // Sanitization: Uses innerHTML carefully, ensuring safe content is inserted.
        const spanContent: HTMLElement = document.createElement('span');
        spanContent.className = 'errorValue';
        spanContent.style.paddingLeft = '16px';
        content.forEach((node: Node) => {
            spanContent.appendChild(node.cloneNode(true)); // Clone cautiously to maintain structure integrity
        });
        rowCell.appendChild(errorContainer);
        rowCell.appendChild(spanContent);
    }
    private removeErrorElem(): void {
        const errorelem: Element = document.querySelector('.e-errorelem');
        if (errorelem) {
            errorelem.remove();
        }
    }

    private rowDrag(args: RowDragEventArgs): void {
        const cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties');
        cloneElement.style.display = 'none';
        const ganttDragElement: HTMLElement = cloneElement.cloneNode(true) as HTMLElement;
        ganttDragElement.classList.add('e-ganttdrag');
        ganttDragElement.style.display = '';
        if (this.parent.element.querySelectorAll('.e-cloneproperties').length <= 1) {
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
        const dragElement: HTMLElement = this.parent.element.querySelector('.e-ganttdrag');
        const ganttTop: number = this.parent.element.getClientRects()[0].top;
        const ganttLeft: number = this.parent.element.getClientRects()[0].left;
        let left: number;
        let top: number;
        if (this.parent.isAdaptive) {
            /* eslint-disable-next-line */
            left = (args.originalEvent as any).event.touches[0].clientX - ganttLeft;
            /* eslint-disable-next-line */
            top = (args.originalEvent as any).event.touches[0].clientY - ganttTop;
        }
        else{
            left = getValue('event', args.originalEvent).clientX - ganttLeft;
            top = getValue('event', args.originalEvent).clientY - ganttTop;
        }
        dragElement.style.left = left + 20 + 'px';
        dragElement.style.top = top + 20 + 'px';
        this.parent.trigger('rowDrag', args);
    }
    private rowDragStartHelper(args: RowDragEventArgs): void {
        this.parent.trigger('rowDragStartHelper', args);
        if (this.parent.readOnly ) {
            args.cancel = true;
        }
    }
    private rowDrop(args: RowDropEventArgs): void {
        if (this.parent.isAdaptive) {
            const ganttDragelem: Element = document.querySelector('.e-ganttdrag');
            if (ganttDragelem) {
                ganttDragelem.remove();
            }
        }
        const gridRow: Element = closest(args.target, '.e-row');
        this.parent['oldRecords'] = extend([], [], args.data, true) as IGanttData[];
        const dropIndex: number = gridRow ? parseInt(gridRow.getAttribute('aria-rowindex'), 10) - 1 : args.dropIndex;
        args.dropIndex = dropIndex;
        args.dropRecord = this.parent.updatedRecords[args.dropIndex];
        this.parent.trigger('rowDrop', args);
        if (this.parent.viewType === 'ResourceView' && !this.validPosition(args, args.dropRecord)) {
            args.cancel = true;
        }
        if (!args.cancel) {
            args.requestType = 'beforeDrop';
            this.parent.trigger('actionBegin', args);
            if (!args.cancel) {
                this.parent['showLoadingIndicator']();
                this.dropRows(args, true); // method to update the data collections based on drop action
                args.cancel = true;
            }
            else {
                this.parent['hideLoadingIndicator']();
            }
        }
    }
    private validPosition(args: RowDropEventArgs, dropRecord: IGanttData): boolean {
        const dropLevel: number = dropRecord.level;
        const dragLevel: number = getValue('level', args.data[0]);
        let data: IGanttData = args.data[0];
        if (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed']) {
            data = this.parent.currentViewData[this.parent.undoRedoModule['getResourceViewRowIndex'](data)];
        }
        if ((args.dropPosition === 'middleSegment' && (dropLevel === 1 || dragLevel === 0)) ||
            (args.dropPosition !== 'middleSegment' && ((dragLevel === 0 && dropLevel === 1) || (dragLevel === 1 && dropLevel === 0))) ||
            (getValue('parentItem', data) && dropRecord.uniqueID === getValue('parentItem', data).uniqueID)) {
            return false;
        }
        return true;
    }
    private dropRows(args: RowDropEventArgs, isByMethod?: boolean): void {
        if (!this.parent.readOnly) {
            this.dropPosition = args.dropPosition;
            if (args.dropPosition !== 'Invalid' && this.parent.editModule) {
                const gObj: Gantt = this.parent;
                this.droppedRecord = gObj.updatedRecords[args.dropIndex];
                if (this.parent.viewType === 'ResourceView' && !this.validPosition(args, this.droppedRecord)) {
                    this.droppedRecord = null;
                    return;
                }
                if (this.parent.undoRedoModule && (this.parent['isUndoRedoItemPresent']('RowDragAndDrop'))) {
                    if (!this.parent.undoRedoModule['isUndoRedoPerformed']) {
                        if (this.parent.undoRedoModule['redoEnabled']) {
                            this.parent.undoRedoModule['disableRedo']();
                            this.parent.undoRedoModule['createUndoCollection']();
                        }
                        if (!args.target && this.parent.editModule && this.parent.editModule.taskbarEditModule &&
                            this.parent.editModule.taskbarEditModule.taskBarEditAction) {
                            this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] = [];
                        }
                        else {
                            this.parent.undoRedoModule['createUndoCollection']();
                        }
                        const datas: IGanttData[] = [];
                        for (let i: number = 0; i < args.data.length; i++) {
                            datas.push(this.parent.flatData.filter((data: IGanttData) => {
                                return args.data[i as number]['ganttProperties'].taskId === data.ganttProperties.taskId;
                            })[0]);
                        }
                        const rowItems: IGanttData[] = extend([], [], datas, true) as IGanttData[];
                        const records: Object = {};
                        if (args['name']) {
                            records['action'] = 'RowDragAndDrop';
                        }
                        else {
                            records['action'] = 'TaskbarDragAndDrop';
                        }
                        records['beforeDrop'] = [];
                        const previousDetails: Object = {};
                        previousDetails['dropRecord'] = extend([], [], [args.dropRecord ? args.dropRecord : this.droppedRecord], true)[0];
                        previousDetails['data'] = extend([], [], args.data, true);
                        if (args.dropPosition === 'middleSegment') {
                            previousDetails['dropPosition'] = 'child';
                        }
                        else if (args.dropPosition === 'topSegment') {
                            previousDetails['dropPosition'] = 'above';
                        }
                        else if (args.dropPosition === 'bottomSegment') {
                            previousDetails['dropPosition'] = 'below';
                        }
                        records['afterDrop'] = previousDetails;
                        this.parent.undoRedoModule['findPosition'](rowItems, records, 'beforeDrop');
                        (this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] as object) = records;
                    }
                    if (this.parent.toolbarModule) {
                        this.parent.toolbarModule.enableItems([this.parent.controlId + '_undo'], true);
                    }
                }
                let draggedRecord: IGanttData;
                let dragRecords: IGanttData[] = [];
                const droppedRecord: IGanttData = this.droppedRecord;
                if (!args.data[0]) {
                    dragRecords.push(args.data as IGanttData);
                } else {
                    dragRecords = args.data;
                }
                let count: number = 0;
                const dragLength: number = dragRecords.length;
                for (let i: number = 0; i < dragLength; i++) {
                    this.parent.isOnEdit = true;
                    draggedRecord = dragRecords[i as number];
                    this.draggedRecord = draggedRecord;
                    if (this.dropPosition !== 'Invalid') {
                        if (this.parent.viewType === 'ResourceView') {
                            this.checkisSharedTask();
                            if (this.draggedRecord.level !== 0) {
                                this.previousParent = this.draggedRecord.parentItem.uniqueID;
                            }
                        }
                        if (this.isSharedTask) {
                            return;
                        }
                        if (isByMethod) {
                            this.deleteDragRow();
                        }
                        const recordIndex1: number = this.treeGridData.indexOf(droppedRecord);
                        if (this.dropPosition === 'topSegment') {
                            this.dropAtTop(recordIndex1);
                        }
                        if (this.dropPosition === 'bottomSegment') {
                            if (!this.isSharedTask) {
                                if (!droppedRecord.hasChildRecords) {
                                    if (this.parent.taskFields.parentID && this.ganttData.length > 0) {
                                        this.ganttData.splice(recordIndex1 + 1, 0, this.draggedRecord.taskData);
                                    }
                                    this.treeGridData.splice(recordIndex1 + 1, 0, this.draggedRecord);
                                    this.parent.ids.splice(recordIndex1 + 1, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());
                                    if (this.parent.viewType === 'ResourceView') {
                                        const taskId: string = this.draggedRecord.level === 0 ? 'R' + this.draggedRecord.ganttProperties.taskId : 'T' + this.draggedRecord.ganttProperties.taskId;
                                        this.parent.getTaskIds().splice(recordIndex1 + 1, 0, taskId);
                                    }

                                } else {
                                    count = this.parent.editModule.getChildCount(droppedRecord, 0);
                                    if (this.parent.taskFields.parentID && this.ganttData.length > 0) {
                                        this.ganttData.splice(recordIndex1 + count + 1, 0, this.draggedRecord.taskData);
                                    }
                                    this.treeGridData.splice(recordIndex1 + count + 1, 0, this.draggedRecord);
                                    /* eslint-disable-next-line */
                                    this.parent.ids.splice(recordIndex1 + count + 1, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());
                                    if (this.parent.viewType === 'ResourceView') {
                                        const spliceId: string = this.draggedRecord.level === 0 ? 'R' + this.draggedRecord.ganttProperties.taskId : 'T' + this.draggedRecord.ganttProperties.taskId;
                                        this.parent.getTaskIds().splice(recordIndex1 + count + 1, 0, spliceId);
                                    }
                                }
                                this.parent.setRecordValue('parentItem', this.treeGridData[recordIndex1 as number].parentItem, draggedRecord);
                                this.parent.setRecordValue('parentUniqueID', this.treeGridData[recordIndex1 as number].parentUniqueID, draggedRecord);
                                this.parent.setRecordValue('level', this.treeGridData[recordIndex1 as number].level, draggedRecord);
                                if (draggedRecord.hasChildRecords) {
                                    const level: number = 1;
                                    this.updateChildRecordLevel(draggedRecord, level);
                                    this.updateChildRecord(draggedRecord, recordIndex1 + count + 1);
                                }
                                if (droppedRecord.parentItem) {
                                    const rec: IGanttData[] = this.parent.getParentTask(droppedRecord.parentItem).childRecords;
                                    const childRecords: IGanttData[] = rec;
                                    const droppedRecordIndex: number = childRecords.indexOf(droppedRecord) + 1;
                                    childRecords.splice(droppedRecordIndex, 0, draggedRecord);
                                }
                            }
                        }
                        if (this.dropPosition === 'middleSegment') {
                            this.dropMiddle(recordIndex1);
                            if (droppedRecord.childRecords.length > 0) {
                                delete droppedRecord.ganttProperties.segments;
                                delete droppedRecord.taskData[this.parent.taskFields.segments];
                            }
                        }
                        if (this.treeGridData.length !== 0) {
                            for (let i: number = 0; i < this.treeGridData.length; i++) {
                                this.treeGridData[parseInt(i.toString(), 10)].index = i;
                                if (!isNullOrUndefined(this.treeGridData[parseInt(i.toString(), 10)].parentItem)) {
                                    const updatedParent: ITreeData = getValue('uniqueIDCollection.' + this.treeGridData[parseInt(i.toString(), 10)].parentUniqueID, this.parent.treeGrid);
                                    this.treeGridData[parseInt(i.toString(), 10)].parentItem.index = updatedParent.index;
                                }
                            }
                            if (this.parent.undoRedoModule) {
                                this.parent.undoRedoModule['canUpdateIndex'] = false;
                            }
                        }
                        // eslint-disable-next-line
                        if (!isNullOrUndefined(draggedRecord.parentItem && this.updateParentRecords.indexOf(draggedRecord.parentItem) !== -1)) {
                            this.updateParentRecords.push(draggedRecord.parentItem);
                        }
                    }
                    if (!this.parent.enableVirtualization) {
                        const data: IGanttData[] = gObj.flatData;
                        let startIndex: number;
                        let endIndex: number;
                        const ganttData: Object[] = this.parent.dataSource as Object[];
                        const uniqueTaskID: string = this.parent.taskFields.id;
                        if (draggedRecord.index < droppedRecord.index) {
                            startIndex = draggedRecord.index;
                            for (let i: number = 0; i < ganttData.length; i++) {
                                const currentData: IGanttData = this.parent.currentViewData.filter(function (e: IGanttData): boolean {
                                    return e[uniqueTaskID as string] === ganttData[i as number][uniqueTaskID as string];
                                })[0];
                                if (currentData && currentData.index > droppedRecord.index) {
                                    endIndex = currentData.index;
                                    break;
                                }
                            }
                        } else {
                            startIndex = droppedRecord.index;
                            for (let i: number = 0; i < ganttData.length; i++) {
                                const currentData: IGanttData = this.parent.currentViewData.filter(function (e: IGanttData): boolean {
                                    return e[uniqueTaskID as string] === ganttData[i as number][uniqueTaskID as string];
                                })[0];
                                if (currentData && currentData.index > draggedRecord.index) {
                                    endIndex = currentData.index;
                                    break;
                                }
                            }
                        }
                        for (let i: number = startIndex; i <= endIndex; i++) {
                            if (!isNullOrUndefined(data[i as number])) {
                                data[i as number].index = i;
                                if (!isNullOrUndefined(data[i as number].parentItem)) {
                                    const updatedParent: ITreeData = data.filter((e: ITreeData) => {
                                        return e.uniqueID === data[i as number].parentUniqueID;
                                    })[0];
                                    data[i as number].parentItem.index = updatedParent.index;
                                }
                            }
                        }
                    }
                    gObj.rowDragAndDropModule.refreshDataSource();
                }
                if (this.dropPosition === 'middleSegment') {
                    if (droppedRecord.ganttProperties.predecessor) {
                        const len: number = droppedRecord.ganttProperties.predecessor.length;
                        for (let count: number = 0; count < len; count++) {
                            if (droppedRecord.ganttProperties.predecessor && droppedRecord.ganttProperties.predecessor[count as number]) {
                                const fromRecord: IGanttData = this.parent.getRecordByID(
                                    droppedRecord.ganttProperties.predecessor[count as number].from);
                                const toRecord: IGanttData = this.parent.getRecordByID(
                                    droppedRecord.ganttProperties.predecessor[count as number].to);
                                const validPredecessor: boolean = this.parent.predecessorModule.validateParentPredecessor(
                                    fromRecord, toRecord);
                                if (droppedRecord.ganttProperties.predecessor && (!validPredecessor ||
                                    !this.parent.allowParentDependency)) {
                                    this.parent.editModule.removePredecessorOnDelete(droppedRecord);
                                    droppedRecord.ganttProperties.predecessor.splice(0, 1);
                                    if (droppedRecord.ganttProperties.predecessorsName) {
                                        const splittedName: string[] = (droppedRecord.ganttProperties.predecessorsName as string).split(',');
                                        for (let i: number = 0; i < splittedName.length; i++) {
                                            if (splittedName[i as number].indexOf(draggedRecord.ganttProperties.taskId + '') !== -1) {
                                                splittedName.splice(i, 1);
                                            }
                                        }
                                        const validatedPredecessorNames: string = splittedName.join();
                                        droppedRecord.ganttProperties.predecessorsName = validatedPredecessorNames;
                                        droppedRecord[this.parent.taskFields.dependency] = validatedPredecessorNames;
                                        droppedRecord.taskData[this.parent.taskFields.dependency] = validatedPredecessorNames;
                                    }
                                }
                            }
                        }
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
                if (this.parent.viewType === 'ResourceView' && !this.isSharedTask) {
                    let parentUniqueID: string;
                    if (this.dropPosition === 'middleSegment') {
                        parentUniqueID = this.droppedRecord.uniqueID;
                    } else {
                        parentUniqueID = this.droppedRecord.parentItem ?
                            this.droppedRecord.parentItem.uniqueID : this.droppedRecord.uniqueID;
                    }
                    const droppedParentItem: IGanttData = this.parent.getTaskByUniqueID(parentUniqueID);
                    const editedObj: Object = {};
                    editedObj[this.parent.taskFields.resourceInfo] = [];
                    editedObj[this.parent.taskFields.resourceInfo].push(droppedParentItem.ganttProperties.taskId);
                    this.removeExistingResources();
                    const tempResourceInfo: Object[] = this.parent.dataOperation.setResourceInfo(editedObj);
                    const currentTask: IGanttData = this.draggedRecord;
                    if (isNullOrUndefined(currentTask.ganttProperties.resourceInfo)) {
                        currentTask.ganttProperties.resourceInfo = [];
                    }
                    if (droppedParentItem.ganttProperties.taskName === 'Unassigned Task') {
                        currentTask.ganttProperties.resourceInfo = [];
                        currentTask.ganttProperties.sharedTaskUniqueIds = [currentTask.ganttProperties.rowUniqueID];
                    } else {
                        currentTask.ganttProperties.resourceInfo.push(tempResourceInfo[0]);
                    }
                    this.updateCurrentTask(currentTask);
                    if (droppedParentItem.ganttProperties.taskName === 'Unassigned Task') {
                        this.deleteSharedResourceTask();
                    } else {
                        this.updateSharedResourceTask();
                    }
                }
                if (this.parent.taskFields.dependency && this.parent.allowParentDependency) {
                    let isValidPredecessor: boolean = true;
                    let draggedParent: IGanttData;
                    let toParent: IGanttData;
                    if (draggedRecord.parentItem) {
                        draggedParent = this.parent.flatData[this.parent.ids.indexOf(draggedRecord.parentItem.taskId)];
                    }
                    else {
                        draggedParent = draggedRecord;
                    }
                    if (droppedRecord.parentItem) {
                        toParent = this.parent.flatData[this.parent.ids.indexOf(droppedRecord.parentItem.taskId)];
                    }
                    else {
                        toParent = droppedRecord;
                    }
                    let validateRecords: IGanttData[];
                    if (toParent.uniqueID === draggedParent.uniqueID || (draggedParent.parentItem &&
                        toParent.uniqueID === this.parent.flatData[this.parent.ids.indexOf(draggedParent.parentItem.taskId)].uniqueID)) {
                        validateRecords = this.parent.currentViewData.filter((data: IGanttData) => {
                            if ((data.ganttProperties.predecessor && data.ganttProperties.predecessor.length > 0)) {
                                for (let i: number = 0; i < data.ganttProperties.predecessor.length; i++) {
                                    return (parseInt(data.ganttProperties.predecessor[i as number].to, 10) ===
                                    parseInt(toParent.ganttProperties.taskId, 10) ||
                                        parseInt(data.ganttProperties.predecessor[i as number].from, 10) ===
                                        parseInt(toParent.ganttProperties.taskId, 10));
                                }
                            }
                            return null;
                        });
                        let predName: string[] = [];
                        for (let i: number = 0; i < validateRecords.length; i++) {
                            predName = [];
                            if (validateRecords[i as number].ganttProperties.predecessor) {
                                for (let k: number = 0; k < validateRecords[i as number].ganttProperties.predecessor.length; k++) {
                                    if (parseInt(validateRecords[i as number].ganttProperties.taskId, 10) !==
                                        parseInt(validateRecords[i as number].ganttProperties.predecessor[k as number].from, 10)) {
                                        predName.push(validateRecords[i as number].ganttProperties.predecessor[k as number].from);
                                    }
                                    else {
                                        predName.push(validateRecords[i as number].ganttProperties.predecessor[k as number].to);
                                    }
                                }
                            }
                            for (let j: number = 0; j < predName.length; j++) {
                                const name: string = predName[j as number].replace(/\D/g, '');
                                const toRec: IGanttData[] = this.parent.currentViewData.filter((data: IGanttData) => {
                                    return parseInt(data.ganttProperties.taskId, 10) === parseInt(name, 10);
                                });
                                isValidPredecessor = this.parent.predecessorModule.validateParentPredecessor(
                                    validateRecords[i as number], toRec[0]);
                                if (!isValidPredecessor) {
                                    this.parent.dataOperation['resetDependency'](validateRecords[i as number]);
                                    this.parent.dataOperation['resetDependency'](toRec[0]);
                                }
                            }
                        }
                    }
                }
                // method to update the edited parent records
                for (let j: number = 0; j < this.updateParentRecords.length; j++) {
                    this.parent.dataOperation.updateParentItems(this.updateParentRecords[j as number]);
                }
                if (this.parent.viewType === 'ProjectView' && this.parent.editModule &&
                this.parent.editModule.taskbarEditModule && this.parent.undoRedoModule &&
                this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent.predecessorModule &&
                this.parent.undoRedoModule['currentAction']['action'] === 'TaskbarDragAndDrop' &&
                this.parent.undoRedoModule['currentAction']['beforeDrop'][0].position !== 'child') {
                    const dropRec: IGanttData = this.parent.flatData[this.parent.ids.indexOf(
                        this.parent.undoRedoModule['currentAction']['afterDrop'].dropRecord.ganttProperties.taskId.toString())];
                    this.parent.editModule.taskbarEditModule.taskBarEditRecord = dropRec;
                    this.parent.editModule.taskbarEditModule.taskBarEditAction = 'ChildDrag';
                    this.parent.predecessorModule.validatePredecessor(dropRec, [], '');
                    this.parent.editModule.taskbarEditModule.taskBarEditAction = null;
                }
                this.updateParentRecords = [];
                this.parent.isOnEdit = false;
            }
            if (!isNullOrUndefined(this.parent.editModule)) {
                this.parent.editModule.refreshRecord(args, true);
            }
            if (!this.parent.undoRedoModule || (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed'])) {
                this.parent.previousFlatData = extend([], [], this.parent.flatData, true) as IGanttData[];
            }
        }
        this.parent['oldRecords'] = [];
    }
    private updateCurrentTask(currentTask: IGanttData): void {
        this.parent.dataOperation.updateMappingData(currentTask, 'resourceInfo');
        this.parent.editModule.updateResourceRelatedFields(currentTask, 'resource');
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (this.parent.editModule.dialogModule as any).dialogEditValidationFlag = false;
        this.parent.editModule.dialogModule.validateDuration(currentTask);
        this.parent.dataOperation.updateWidthLeft(currentTask);
        this.parent.dataOperation.updateTaskData(currentTask);
    }
    private deleteSharedResourceTask(): void {
        for (let i: number = 0; i < this.parent.getTaskIds().length; i++) {
            if (this.parent.getTaskIds()[i as number] === 'T' + this.draggedRecord.ganttProperties.taskId) {
                if (this.parent.getTaskByUniqueID(this.parent.flatData[i as number].parentItem.uniqueID).ganttProperties.taskName !== 'Unassigned Task') {
                    this.removeRecords(this.parent.flatData[i as number]);
                }
                if (!isNullOrUndefined(this.parent.flatData[parseInt(i.toString(), 10)].parentItem &&
                this.updateParentRecords.indexOf(this.parent.flatData[parseInt(i.toString(), 10)].parentItem) !== -1)) {
                    this.updateParentRecords.push(this.parent.flatData[i as number].parentItem);
                }
            }
        }
    }
    private removeExistingResources(): void {
        const preParentRecord: IGanttData = this.parent.getTaskByUniqueID(this.previousParent);
        if (this.draggedRecord.ganttProperties.resourceInfo && preParentRecord) {
            for (let count: number = 0; count < this.draggedRecord.ganttProperties.resourceInfo.length; count++) {
                if (this.draggedRecord.ganttProperties.resourceInfo[parseInt(count.toString(), 10)][this.parent.resourceFields.id] ===
                preParentRecord.ganttProperties.taskId) {
                    this.draggedRecord.ganttProperties.resourceInfo.splice(count, 1);
                    break;
                }
            }
        }
    }
    /*update the record for the same task which are shared with other tasks*/
    private updateSharedResourceTask(): void {
        for (let i: number = 0; i < this.parent.getTaskIds().length; i++) {
            if (this.parent.getTaskIds()[i as number] === 'T' + this.draggedRecord.ganttProperties.taskId) {
                this.parent.editModule.updateGanttProperties(this.draggedRecord, this.parent.flatData[i as number]);
                this.parent.dataOperation.updateTaskData(this.parent.flatData[i as number]);
                if (!isNullOrUndefined(this.parent.flatData[parseInt(i.toString(), 10)].parentItem &&
                this.updateParentRecords.indexOf(this.parent.flatData[parseInt(i.toString(), 10)].parentItem) !== -1)) {
                    this.updateParentRecords.push(this.parent.flatData[i as number].parentItem);
                }
            }
        }
    }
    private _getExistingTaskWithID(record: IGanttData): IGanttData[] {
        const existingTasks: IGanttData[] = [];
        for (let i: number = 0; i < this.parent.getTaskIds().length; i++) {
            if (this.parent.getTaskIds()[i as number] === 'T' + record.ganttProperties.taskId) {
                existingTasks.push(this.parent.flatData[i as number]);
            }
        }
        return existingTasks;
    }

    /*Method to remove resource from resource Info collection and update reosurce related fields*/
    private removeResourceInfo(record: IGanttData): void {
        const droppedParentItem: IGanttData = this.parent.getTaskByUniqueID(this.draggedRecord.parentItem.uniqueID);
        if (record.ganttProperties.resourceInfo && record.ganttProperties.resourceInfo.length > 1) {
            const sameIdTasks: IGanttData[] = this._getExistingTaskWithID(record);
            let currentTask: IGanttData;
            if (sameIdTasks === null) {
                return;
            }
            for (let i: number = 0; i < sameIdTasks.length; i++) {
                currentTask = sameIdTasks[i as number];
                const resources: object[] = currentTask.ganttProperties.resourceInfo;
                for (let count: number = 0; count < resources.length; count++) {
                    if (resources[count as number][this.parent.resourceFields.id] === droppedParentItem.ganttProperties.taskId) {
                        resources.splice(count, 1);
                        this.parent.setRecordValue('resourceInfo', resources, currentTask.ganttProperties, true);
                        this.updateCurrentTask(currentTask);
                        if (!isNullOrUndefined(currentTask.parentItem && this.updateParentRecords.indexOf(currentTask.parentItem) !== -1)) {
                            this.updateParentRecords.push(currentTask.parentItem);
                        }
                        break;
                    }
                }
            }
        }
    }
    private refreshDataSource(): void {
        const draggedRecord: IGanttData = this.draggedRecord;
        const droppedRecord: IGanttData = this.droppedRecord;
        const proxy: Gantt = this.parent;
        let tempDataSource: Object; let idx: number;
        const ganttFields: TaskFieldsModel = this.parent.taskFields;
        if (this.parent.dataSource instanceof DataManager) {
            tempDataSource = getValue('dataOperation.dataArray', this.parent);
        } else {
            tempDataSource = proxy.dataSource;
        }
        if ((tempDataSource as IGanttData[]).length > 0 && (!isNullOrUndefined(droppedRecord) && !droppedRecord.parentItem)) {
            for (let i: number = 0; i < Object.keys(tempDataSource).length; i++) {
                if (!isNullOrUndefined(droppedRecord.taskData[ganttFields.child]) &&
                    tempDataSource[i as number][ganttFields.child] === droppedRecord.taskData[ganttFields.child]) {
                    idx = i;
                }
                else if (isNullOrUndefined(droppedRecord.taskData[ganttFields.child]) &&
                        droppedRecord.taskData[ganttFields.id] === tempDataSource[i as number][ganttFields.id]) {
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
                const rowPosition: RowPosition = this.dropPosition === 'topSegment' ? 'Above' : 'Below';
                this.parent.editModule.addRowSelectedItem = droppedRecord;
                this.parent.editModule.updateRealDataSource([draggedRecord], rowPosition);
                delete this.parent.editModule.addRowSelectedItem;
            }
        }
        if (this.parent.taskFields.parentID) {
            if (draggedRecord.parentItem) {
                const droppedId: string = this.dropPosition === 'middleSegment' ? this.parent.taskFields.id :
                    this.parent.taskFields.parentID;
                draggedRecord[this.parent.taskFields.parentID] = droppedRecord[droppedId as string];
                draggedRecord.ganttProperties.parentId = droppedRecord[droppedId as string];
                if ((this.parent.viewType === 'ResourceView' && !(this.dropPosition === 'middleSegment')) ||
                    this.parent.viewType === 'ProjectView') {
                    draggedRecord.taskData[this.parent.taskFields.parentID] = droppedRecord.taskData[droppedId as string];
                }
            } else {
                draggedRecord[this.parent.taskFields.parentID] = null;
                draggedRecord.taskData[this.parent.taskFields.parentID] = null;
                draggedRecord.ganttProperties.parentId = null;
            }

        }
        if (this.parent.editModule && this.parent.editModule.taskbarEditModule &&
        this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent.predecessorModule &&
        this.parent.undoRedoModule['currentAction']['action'] === 'TaskbarDragAndDrop') {
            let dragRec: IGanttData;
            if (this.parent.viewType === 'ProjectView') {
                dragRec = this.parent.flatData[this.parent.ids.indexOf(this.parent.undoRedoModule['currentAction']['afterDrop'].data[0].ganttProperties.taskId.toString())];
            }
            else {
                dragRec = this.parent.flatData[this.parent.undoRedoModule['getResourceViewRowIndex'](this.parent.undoRedoModule['currentAction']['afterDrop'].data[0])];
            }
            this.parent.editModule.taskbarEditModule.taskBarEditRecord = dragRec;
            this.parent.editModule.taskbarEditModule.taskBarEditAction = 'ChildDrag';
            this.parent.predecessorModule.validatePredecessor(dragRec, [], '');
            this.parent.editModule.taskbarEditModule.taskBarEditAction = null;
        }
    }
    private dropMiddle(recordIndex1: number): void {
        const gObj: Gantt = this.parent;
        const childRecords: number = this.parent.editModule.getChildCount(this.droppedRecord, 0);
        const childRecordsLength: number = (isNullOrUndefined(childRecords) ||
            childRecords === 0) ? recordIndex1 + 1 :
            childRecords + recordIndex1 + 1;
        if (this.dropPosition === 'middleSegment' && !this.isSharedTask) {
            if (gObj.taskFields.parentID && this.ganttData.length > 0) {
                this.ganttData.splice(childRecordsLength, 0, this.draggedRecord.taskData);
            }
            this.treeGridData.splice(childRecordsLength, 0, this.draggedRecord);
            this.parent.ids.splice(childRecordsLength, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());
            if (this.parent.viewType === 'ResourceView') {
                const recordId: string = this.draggedRecord.level === 0 ? 'R' + this.draggedRecord.ganttProperties.taskId : 'T' + this.draggedRecord.ganttProperties.taskId;
                this.parent.getTaskIds().splice(childRecordsLength, 0, recordId);
            }
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
        const gObj: Gantt = this.parent;
        const draggedRecord: IGanttData = this.draggedRecord;
        const droppedRecord: IGanttData = this.droppedRecord;
        const childItem: string = gObj.taskFields.child;
        if (!droppedRecord.hasChildRecords) {
            droppedRecord.hasChildRecords = true;
            if (!droppedRecord.childRecords.length) {
                droppedRecord.childRecords = [];
                if (!gObj.taskFields.parentID && isNullOrUndefined(droppedRecord.taskData[childItem as string])) {
                    droppedRecord.taskData[childItem as string] = [];
                }
            }
        }
        if (this.dropPosition === 'middleSegment') {
            const parentItem: IGanttData = extend({}, droppedRecord);
            delete parentItem.childRecords;
            const createParentItem: IParent = {
                uniqueID: parentItem.uniqueID,
                expanded: parentItem.expanded,
                level: parentItem.level,
                index: parentItem.index,
                taskId: parentItem.ganttProperties.rowUniqueID
            };
            this.parent.setRecordValue('parentItem', createParentItem, draggedRecord);
            this.parent.setRecordValue('parentUniqueID', droppedRecord.uniqueID, draggedRecord);
            droppedRecord.childRecords.splice(droppedRecord.childRecords.length, 0, draggedRecord);
            if (!isNullOrUndefined(draggedRecord) && !gObj.taskFields.parentID &&
            !isNullOrUndefined(droppedRecord.taskData[childItem as string])) {
                droppedRecord.taskData[gObj.taskFields.child].splice(droppedRecord.childRecords.length, 0, draggedRecord.taskData);
            }
            if (!draggedRecord.hasChildRecords) {
                draggedRecord.level = droppedRecord.level + 1;
            } else {
                const level: number = 1;
                draggedRecord.level = droppedRecord.level + 1;
                this.parent.setRecordValue('level' , this.draggedRecord.level , this.draggedRecord);
                this.updateChildRecordLevel(draggedRecord, level);
            }
            if (!this.parent.enableMultiTaskbar) {
                droppedRecord.expanded = true;
            }
        }
    }
    private deleteDragRow(): void {
        this.treeGridData = isCountRequired(this.parent) ? getValue('result', this.parent.treeGrid.dataSource) :
            this.parent.treeGrid.dataSource;
        if (this.parent.dataSource instanceof DataManager) {
            this.ganttData = getValue('dataOperation.dataArray', this.parent);
        } else {
            this.ganttData = isCountRequired(this.parent) ? getValue('result', this.parent.dataSource) :
                this.parent.dataSource as Object[];
        }
        let deletedRow: IGanttData;
        if (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed']) {
            if (this.parent.viewType === 'ProjectView') {
                deletedRow = this.parent.flatData[this.parent.ids.indexOf(this.draggedRecord.ganttProperties.taskId.toString())];
            }
            else {
                const prefix: string = this.draggedRecord.hasChildRecords ? 'R' : 'T';
                deletedRow = this.parent.flatData[this.parent.taskIds.indexOf(prefix + this.draggedRecord.ganttProperties.taskId)];
            }
        }
        else {
            deletedRow = this.parent.getTaskByUniqueID(this.draggedRecord.uniqueID);
        }
        this.removeRecords(deletedRow);
    }
    //method to check the dropped record has already present in the child collection
    private checkisSharedTask(): void {
        this.isSharedTask = false;
        let sharedTask: IGanttData = null;
        // eslint-disable-next-line
        const parentUniqueID: string = this.droppedRecord.level === 0 ? this.droppedRecord.uniqueID : this.droppedRecord.parentItem.uniqueID;
        const droppedParentItem: IGanttData = this.parent.getTaskByUniqueID(parentUniqueID);
        const childTasks: IGanttData[] = droppedParentItem.childRecords;
        for (let i: number = 0; i < childTasks.length; i++) {
            if (!this.draggedRecord.hasChildRecords && 'T' + this.draggedRecord.ganttProperties.taskId === 'T' + childTasks[i as number].ganttProperties.taskId) {
                this.isSharedTask = true;
                sharedTask = childTasks[i as number];
            }
        }
        if (this.isSharedTask) {
            this.removeResourceInfo(sharedTask);
        }
    }
    private dropAtTop(recordIndex1: number): void {
        const gObj: Gantt = this.parent;
        if (!this.isSharedTask) {
            if (gObj.taskFields.parentID && this.ganttData.length > 0) {
                this.ganttData.splice(recordIndex1, 0, this.draggedRecord.taskData);
            }
            this.treeGridData.splice(recordIndex1, 0, this.draggedRecord);
            this.parent.ids.splice(recordIndex1, 0, this.draggedRecord.ganttProperties.rowUniqueID.toString());
            this.parent.setRecordValue('parentItem', this.droppedRecord.parentItem, this.draggedRecord);
            this.parent.setRecordValue('parentUniqueID', this.droppedRecord.parentUniqueID, this.draggedRecord);
            this.parent.setRecordValue('level', this.droppedRecord.level, this.draggedRecord);
            if (this.parent.viewType === 'ResourceView') {
                const id: string = this.draggedRecord.level === 0 ? 'R' + this.draggedRecord.ganttProperties.taskId : 'T' + this.draggedRecord.ganttProperties.taskId;
                this.parent.getTaskIds().splice(recordIndex1, 0, id);
            }
            if (this.draggedRecord.hasChildRecords) {
                const level: number = 1;
                this.updateChildRecord(this.draggedRecord, recordIndex1);
                this.updateChildRecordLevel(this.draggedRecord, level);
            }
            if (this.droppedRecord.parentItem) {
                const rec: IGanttData[] = this.parent.getParentTask(this.droppedRecord.parentItem).childRecords;
                const childRecords: IGanttData[] = rec;
                const droppedRecordIndex: number = childRecords.indexOf(this.droppedRecord);
                childRecords.splice(droppedRecordIndex, 0, this.draggedRecord);
            }
            /* eslint-disable-next-line */
            if (!isNullOrUndefined(this.draggedRecord.parentItem && this.updateParentRecords.indexOf(this.draggedRecord.parentItem) !== -1)) {
                this.updateParentRecords.push(this.draggedRecord.parentItem);
            }
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
            currentRecord = record.childRecords[i as number];
            let parentData: IGanttData;
            if (record.parentItem) {
                const id: string = 'uniqueIDCollection';
                parentData = this.parent.treeGrid[id as string][record.parentItem.uniqueID];
            }
            currentRecord.level = record.parentItem ? parentData.level + level : record.level + 1;
            this.parent.setRecordValue('level' , currentRecord.level , currentRecord);
            if (currentRecord.hasChildRecords) {
                level--;
                level = this.updateChildRecordLevel(currentRecord, level);
            }
        }
        return level;
    }
    // eslint-disable-next-line
    private updateChildRecord(record: IGanttData, count: number, expanded?: boolean): number {
        let currentRecord: IGanttData;
        const gObj: Gantt = this.parent;
        let length: number = 0;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let i: number = 0; i < length; i++) {
            currentRecord = record.childRecords[i as number];
            count++;
            this.parent.insertRecord(currentRecord, count);
            this.parent.ids.splice(count, 0, currentRecord.ganttProperties.rowUniqueID.toString());
            if (this.parent.viewType === 'ResourceView') {
                const taskId: string  = (currentRecord.level === 0 ? 'R' : 'T') + currentRecord.ganttProperties.taskId;
                this.parent.getTaskIds().splice(count, 0, taskId);
            }
            if (gObj.taskFields.parentID && (gObj.dataSource as IGanttData[]).length > 0) {
                (this.ganttData as IGanttData[]).splice(count, 0, currentRecord.taskData);
            }
            if (currentRecord.hasChildRecords) {
                count = this.updateChildRecord(currentRecord, count);
            }
        }
        return count;
    }
    private removeRecords(record: IGanttData): void {
        const gObj: Gantt = this.parent;
        let dataSource: Object;
        if (this.parent.dataSource instanceof DataManager) {
            dataSource = getValue('dataOperation.dataArray', this.parent);
        } else {
            dataSource = this.parent.dataSource;
        }
        const deletedRow: IGanttData = record;
        const flatParentData: IGanttData = deletedRow && deletedRow.parentItem ? this.parent.getParentTask(deletedRow.parentItem) : null;
        if (deletedRow) {
            if (deletedRow.parentItem) {
                let childRecords: IGanttData[] = [];
                if (flatParentData) {
                    childRecords = flatParentData.childRecords;
                }
                let childIndex: number = 0;
                if (childRecords && childRecords.length > 0) {
                    if (this.parent.viewType === 'ResourceView' && childRecords.length === 1) {
                        //For updating the parent record which has zero parent reords.
                        this.parent.isOnDelete = true;
                        childRecords[0].isDelete = true;
                        this.parent.dataOperation.updateParentItems(flatParentData);
                        this.parent.isOnDelete = false;
                        childRecords[0].isDelete = false;
                    }
                    childIndex = childRecords.indexOf(deletedRow);
                    flatParentData.childRecords.splice(childIndex, 1);
                    if (!this.parent.taskFields.parentID && flatParentData.taskData[this.parent.taskFields.child]) {
                        flatParentData.taskData[this.parent.taskFields.child].splice(childIndex, 1);
                    }
                    // collection for updating parent record
                    this.updateParentRecords.push(flatParentData);
                }
            }
            //method to delete the record from datasource collection
            if (!this.parent.taskFields.parentID) {
                const deleteRecordIDs: string[] = [];
                deleteRecordIDs.push(deletedRow.ganttProperties.taskId.toString());
                if (this.parent.viewType === 'ProjectView' || (this.parent.viewType === 'ResourceView' && this.dropPosition !== 'middleSegment')) {
                    this.parent.editModule.removeFromDataSource(deleteRecordIDs);
                }
            }
            if (gObj.taskFields.parentID) {
                if (deletedRow.hasChildRecords && deletedRow.childRecords.length > 0) {
                    this.removeChildItem(deletedRow);
                }
                let idx: number;
                const ganttData: IGanttData[] = (dataSource as IGanttData[]).length > 0 && this.parent.viewType !== 'ResourceView' ?
                    dataSource as IGanttData[] : this.parent.updatedRecords;
                for (let i: number = 0; i < ganttData.length; i++) {
                    if (this.parent.viewType === 'ResourceView') {
                        if (ganttData[i as number].ganttProperties.rowUniqueID === deletedRow.ganttProperties.rowUniqueID) {
                            idx = i;
                        }
                    } else {
                        if (ganttData[i as number][this.parent.taskFields.id] === deletedRow.taskData[this.parent.taskFields.id]) {
                            idx = i;
                        }
                    }
                }
                if (idx !== -1) {
                    if ((dataSource as IGanttData[]).length > 0) {
                        (dataSource as IGanttData[]).splice(idx, 1);
                    }
                    const tempIndex: number = this.treeGridData.indexOf(deletedRow);
                    this.treeGridData.splice(tempIndex, 1);
                    this.parent.ids.splice(tempIndex, 1);
                    if (this.parent.treeGrid.parentData.indexOf(deletedRow) !== -1) {
                        this.parent.treeGrid.parentData.splice(this.parent.treeGrid.parentData.indexOf(deletedRow), 1);
                    }
                    if (this.parent.viewType === 'ResourceView') {
                        this.parent.getTaskIds().splice(idx, 1);
                    }
                }
            }
            const recordIndex: number = this.treeGridData.indexOf(deletedRow);
            if (!gObj.taskFields.parentID) {
                const deletedRecordCount: number = this.parent.editModule.getChildCount(deletedRow, 0);
                this.treeGridData.splice(recordIndex, deletedRecordCount + 1);
                this.parent.ids.splice(recordIndex, deletedRecordCount + 1);
                const parentIndex: number = this.ganttData.indexOf(deletedRow.taskData);
                if (parentIndex !== -1) {
                    this.ganttData.splice(parentIndex, 1);
                    this.parent.treeGrid.parentData.splice(parentIndex, 1);
                }
                if (this.parent.viewType === 'ResourceView') {
                    this.parent.getTaskIds().splice(recordIndex, deletedRecordCount + 1);
                }
            }
            if (deletedRow.parentItem && flatParentData && flatParentData.childRecords && !flatParentData.childRecords.length) {
                flatParentData.expanded = false;
                flatParentData.hasChildRecords = false;
            }
        }
    }
    private removeChildItem(record: IGanttData): void {
        let currentRecord: IGanttData;
        let idx: number;
        for (let i: number = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[i as number];
            let ganttData: Object;
            if (this.parent.dataSource instanceof DataManager) {
                ganttData = getValue('dataOperation.dataArray', this.parent);
            } else {
                ganttData = this.parent.dataSource;
            }
            for (let j: number = 0; j < (<IGanttData[]>ganttData).length; j++) {
                if (ganttData[j as number][this.parent.taskFields.id] === currentRecord.taskData[this.parent.taskFields.id]) {
                    idx = j;
                }
            }
            if (idx !== -1) {
                if ((ganttData as IGanttData[]).length > 0) {
                    (ganttData as IGanttData[]).splice(idx, 1);
                }
                const tempIndex: number = this.treeGridData.indexOf(currentRecord);
                this.treeGridData.splice(tempIndex, 1);
                this.parent.ids.splice(tempIndex, 1);
                if (this.parent.viewType === 'ResourceView') {
                    this.parent.getTaskIds().splice(idx, 1);
                }
            }
            if (currentRecord.hasChildRecords) {
                this.removeChildItem(currentRecord);
            }
        }
    }
    /**
     * Reorder the rows based on given indexes and position
     *
     * @param {number[]} fromIndexes .
     * @param {number} toIndex .
     * @param {string} position .
     * @returns {void} .
     */
    public reorderRows(fromIndexes: number[], toIndex: number, position: string): void {
        if (!this.parent.readOnly) {
            if (fromIndexes[0] !== toIndex && (position === 'above' || position === 'below' || position === 'child')) {
                if (position === 'above') {
                    this.dropPosition = 'topSegment';
                }
                if (position === 'below') {
                    this.dropPosition = 'bottomSegment';
                }
                if (position === 'child') {
                    this.dropPosition = 'middleSegment';
                }
                let prevData: Object;
                if (this.parent.undoRedoModule) {
                    prevData = extend([], [], [this.parent.undoRedoModule['currentAction']], true)[0];
                }
                const data: IGanttData[] = [];
                for (let i: number = 0; i < fromIndexes.length; i++) {
                    if (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed'] && (prevData['action'] === 'RowDragAndDrop' || prevData['action'] === 'TaskbarDragAndDrop')) {
                        data[i as number] = prevData['beforeDrop'][i as number].data;
                    }
                    else {
                        data[i as number] = this.parent.flatData[fromIndexes[i as number]];
                    }
                }
                const isByMethod: boolean = true;
                const args: RowDropEventArgs = {
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
}
