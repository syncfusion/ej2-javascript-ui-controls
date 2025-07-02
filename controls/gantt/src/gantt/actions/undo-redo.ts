import { RowPosition } from '../base/enum';
import { Gantt } from '../base/gantt';
import { IGanttData, IPredecessor } from '../base/interface';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';

export class UndoRedo {
    private parent: Gantt;
    constructor(parent: Gantt) {
        this.parent = parent;
    }

    private isUndoRedoPerformed: boolean = false;
    private changedRecords: IGanttData[] = [];
    public previousZoomingLevel: Object;
    private getRedoCollection: Object[] = [];
    private getUndoCollection: Object[] = [];
    private currentAction: Object;
    private redoEnabled: boolean = false;
    private previousSortedColumns: Object[] = [];
    private searchString: string = '';
    private isFromUndoRedo: boolean = false;
    private undoActionDetails: Object = {};
    private canUpdateIndex: boolean = true;
    private sortedColumnsLength: number = 0;
    private isZoomingUndoRedoProgress: boolean = false;
    // Initialize a collection to store only unique top-level deleted records
    private uniqueDeletedRecords: Object[] = [];

    // Check if a record is a descendant (child or sub-child) of a potential parent record. This avoids re-adding nested tasks if the parent is already handled.
    private isInHierarchyOf(record: IGanttData, potentialParent: IGanttData): boolean {
        let parent: any = record.parentItem;
        while (parent) {
            if (parent.taskId === (potentialParent.ganttProperties.taskId).toString()) {
                return true;
            }
            parent = parent.parentItem;
        }
        return false;
    }
    // Determines if a record is already covered by any of the records in uniqueRecords. This includes direct children and deep descendants.
    private isPartOfExistingHierarchy(record: any): boolean {
        /* eslint-disable-next-line */
        return this.uniqueDeletedRecords.some(function (uniRecord: any) {
            // Case 1: Record is a descendant of a parent already added
            if (this.isInHierarchyOf(record.data, uniRecord.data)) {
                return true;
            }
            // Case 2: Record is directly present as a child of a parent already added
            if (uniRecord.data && uniRecord.data.childRecords && uniRecord.data.childRecords.some((subtask: any) =>
                subtask.ganttProperties.taskId === record.data.ganttProperties.taskId)) {
                return true;
            }
            return false;
        }.bind(this));
    }
    private preparePreviousUndoActions(updateAction: Object, previousActions: Object): void {
        if (!updateAction['modifiedRecords']) {
            return;
        }
        previousActions['action'] = updateAction['action'];
        previousActions['modifiedRecords'] = [];
        for (let i: number = 0; i < updateAction['modifiedRecords'].length; i++) {
            let index: number;
            if (this.parent.viewType === 'ProjectView') {
                index = this.findTaskRowIndex(updateAction['modifiedRecords'][i as number].ganttProperties.taskId.toString());
            }
            else {
                index = this.parent.undoRedoModule['getResourceViewRowIndex'](updateAction['modifiedRecords'][i as number]);
            }
            previousActions['modifiedRecords'].push(extend([], [this.parent.flatData[index as number]], [], true)[0]);
        }
    }
    private preparePreviousRedoActions(updateAction: Object, previousActions: Object): void {
        if (!updateAction['modifiedRecords']) {
            return;
        }
        previousActions['action'] = updateAction['action'];
        previousActions['modifiedRecords'] = [];
        for (let i: number = 0; i < updateAction['modifiedRecords'].length; i++) {
            const index: number = this.findTaskRowIndex(updateAction['modifiedRecords'][i as number].ganttProperties.taskId.toString());
            previousActions['modifiedRecords'].push(extend([], [this.parent.flatData[index as number]], [], true)[0]);
        }
    }

    private updateModifiedAndConnectedRecords(updateAction: Object): void {
        if (!updateAction['modifiedRecords']) {
            return;
        }
        this.parent.updateRecordByID(this.getUndoCollection[this.getUndoCollection.length - 1]['modifiedRecords'][0]);
        if (updateAction['connectedRecords'] && this.parent.viewType === 'ProjectView') {
            for (let i: number = 0; i < updateAction['connectedRecords'].length; i++) {
                this.parent.updateRecordByID(updateAction['connectedRecords'][i as number]);
            }
        }
    }

    /**
     *Initiates an undo action to revert the most recent change performed.
     *
     * @returns {void}
     * @public
     */
    private undoAction(): void {
        if (this.getUndoCollection.length > 0) {
            const updateAction: Object = this.getUndoCollection[this.getUndoCollection.length - 1];
            const previousActions: Object = {};
            if (updateAction['action'] === 'ZoomIn' || updateAction['action'] === 'ZoomOut' || updateAction['action'] === 'ZoomToFit') {
                previousActions['action'] = updateAction['action'];
                previousActions['previousZoomingLevel'] = extend({}, {}, this.parent.currentZoomingLevel, true);
            }
            else if (updateAction['action'] === 'NextTimeSpan' || updateAction['action'] === 'PreviousTimeSpan') {
                previousActions['action'] = updateAction['action'];
                previousActions['previousTimelineStartDate'] = extend([], [this.parent.timelineModule.timelineStartDate], [], true)[0];
                previousActions['previousTimelineEndDate'] = extend([], [this.parent.timelineModule.timelineEndDate], [], true)[0];
            }
            else if (updateAction['action'] === 'Sorting') {
                previousActions['action'] = 'Sorting';
                previousActions['sortColumns'] = this.previousSortedColumns;
            }
            else if (updateAction['action'] === 'Filtering') {
                previousActions['action'] = 'Filtering';
                previousActions['filteredColumns'] = updateAction['filteredColumns'];
            }
            else if (updateAction['action'] === 'ColumnReorder') {
                previousActions['action'] = updateAction['action'];
                previousActions['toColumn'] = updateAction['fromColumn'];
                previousActions['fromColumn'] = updateAction['toColumn'];
                previousActions['fromIndex'] = updateAction['toIndex'];
                previousActions['toIndex'] = updateAction['fromIndex'];
            }
            else if (updateAction['action'] === 'Search') {
                previousActions['action'] = updateAction['action'];
                previousActions['searchString'] = this.searchString;
            }
            else if (updateAction['action'] === 'ColumnState') {
                previousActions['action'] = updateAction['action'];
                previousActions['showhideColumns'] = updateAction['showhideColumns'];
            }
            else if (updateAction['action'] === 'ColumnResize') {
                previousActions['action'] = updateAction['action'];
                previousActions['resizedColumn'] = { ...this.parent.treeGrid.columns[updateAction['resizedColumn'].index] as Object };
            }
            else if (updateAction['action'] === 'RowDragAndDrop' || updateAction['action'] === 'TaskbarDragAndDrop') {
                const rowItems: IGanttData[] = [];
                for (let i: number = 0; i < updateAction['beforeDrop'].length; i++) {
                    if (this.parent.viewType === 'ProjectView') {
                        rowItems.push(this.parent.getRecordByID(updateAction['beforeDrop'][i as number]['data'].ganttProperties.taskId));
                    }
                    else {
                        rowItems.push(this.parent.flatData[this.getResourceViewRowIndex(updateAction['beforeDrop'][i as number]['data'])]);
                    }
                }
                previousActions['action'] = updateAction['action'];
                previousActions['beforeDrop'] = [];
                const previousDetails: Object = {};
                const dropRecord: IGanttData = extend([], [], [this.parent.getRecordByID(updateAction['afterDrop'].dropRecord.ganttProperties.taskId)], true)[0];
                previousDetails['data'] = [];
                for (let i: number = 0; i < updateAction['afterDrop'].data.length; i++) {
                    if (this.parent.viewType === 'ProjectView') {
                        previousDetails['data'].push(extend([], [], [this.parent.getRecordByID(updateAction['afterDrop'].data[i as number].ganttProperties.taskId)], true)[0]);
                    }
                    else {
                        previousDetails['data'].push(extend([], [], [this.parent.flatData[this.getResourceViewRowIndex(updateAction['afterDrop'].data[i as number])]], true)[0]);
                    }
                }
                previousDetails['dropRecord'] = extend([], [], [dropRecord], true)[0];
                previousDetails['dropPosition'] = updateAction['afterDrop'].dropPosition;
                previousActions['afterDrop'] = previousDetails;
                this['findPosition'](rowItems, previousActions, 'beforeDrop');
                this.preparePreviousUndoActions(updateAction, previousActions);
            }
            else if (updateAction['action'] === 'Indent' || updateAction['action'] === 'Outdent') {
                previousActions['selectedRowIndexes'] = updateAction['selectedRowIndexes'];
                previousActions['droppedRecord'] = extend([], [], [this.parent.flatData[this.parent.ids.indexOf(updateAction['droppedRecord'].ganttProperties.taskId.toString())]], true)[0];
                previousActions['modifiedRecord'] = [];
                this.findPosition(extend([], [], [this.parent.flatData[this.parent.ids.indexOf(updateAction['modifiedRecord'][0].data.ganttProperties.taskId.toString())]], true) as IGanttData[], previousActions, 'modifiedRecord');
                previousActions['action'] = updateAction['action'];
            }
            else if (updateAction['action'] === 'Delete') {
                previousActions['action'] = 'Delete';
                previousActions['deleteRecords'] = [];
                for (let i: number = 0; i < updateAction['deletedRecordsDetails'].length; i++) {
                    const currentDeletedItem: Object = updateAction['deletedRecordsDetails'][i as number];
                    // Check if the current record is already part of an existing hierarchy in the uniqueRecords array
                    const isRecordAlreadyPresent: boolean = this.isPartOfExistingHierarchy(currentDeletedItem);
                    // Add the record to the uniqueRecords array only if it hasn't already been added or doesn't belong to the same hierarchy
                    if (!isRecordAlreadyPresent) {
                        this.uniqueDeletedRecords.push(currentDeletedItem);
                    }
                }
                // Update the deletedRecordsDetails with the cleaned-up unique records list
                updateAction['deletedRecordsDetails'] = this.uniqueDeletedRecords;
                // Map the records data and store it in previousActions for future reference
                previousActions['deleteRecords'] = this.uniqueDeletedRecords.map((record: any) => record.data);
                // Clear the uniqueRecords array for future iterations
                this.uniqueDeletedRecords = [];
            }
            else if (updateAction['action'] === 'Add') {
                previousActions['action'] = 'Add';
                previousActions['deletedRecordsDetails'] = [];
                const rowItems: IGanttData[] = updateAction['addedRecords'];
                this.findPosition(rowItems, previousActions, 'deletedRecordsDetails');
            }
            else {
                this.preparePreviousUndoActions(updateAction, previousActions);
            }
            this.getRedoCollection.push(previousActions);
            this.isUndoRedoPerformed = true;
            this.changedRecords = [];
            this.currentAction = updateAction;
            if (updateAction['action'] === 'ZoomIn' || updateAction['action'] === 'ZoomOut' || updateAction['action'] === 'ZoomToFit') {
                this.parent.timelineSettings.timelineViewMode = updateAction['previousZoomingLevel'].timelineViewMode;
                this.parent.timelineSettings.timelineUnitSize = updateAction['previousZoomingLevel'].timelineUnitSize;
                this.parent.timelineSettings.updateTimescaleView = updateAction['previousZoomingLevel'].updateTimescaleView;
                this.parent.timelineSettings.topTier.unit = updateAction['previousZoomingLevel'].topTier.unit;
                this.parent.timelineSettings.topTier.count = updateAction['previousZoomingLevel'].topTier.count;
                this.parent.timelineSettings.topTier.format = updateAction['previousZoomingLevel'].topTier.format;
                this.parent.timelineSettings.bottomTier.unit = updateAction['previousZoomingLevel'].bottomTier.unit;
                this.parent.timelineSettings.bottomTier.count = updateAction['previousZoomingLevel'].bottomTier.count;
                this.parent.timelineSettings.bottomTier.format = updateAction['previousZoomingLevel'].bottomTier.format;
                this.parent.timelineSettings.weekStartDay = updateAction['previousZoomingLevel'].weekStartDay;
                this.parent.timelineSettings.weekendBackground = updateAction['previousZoomingLevel'].weekendBackground;
                this.isZoomingUndoRedoProgress = true;
                if (updateAction['action'] === 'ZoomToFit') {
                    this.parent.timelineModule.refreshTimeline();
                }
            }
            else if (updateAction['action'] === 'NextTimeSpan' || updateAction['action'] === 'PreviousTimeSpan') {
                this.parent.updateProjectDates(updateAction['previousTimelineStartDate'], updateAction['previousTimelineEndDate'], false);
            }
            else if (updateAction['action'] === 'Sorting') {
                this.isFromUndoRedo = true;
                this.sortedColumnsLength = 0;
                if (updateAction['sortColumns'].length > 0) {
                    for (let i: number = 0; i < updateAction['sortColumns'].length; i++) {
                        this.parent.treeGrid.sortByColumn(updateAction['sortColumns'][i as number]['field'], updateAction['sortColumns'][i as number]['direction'], i > 0 ? true : false);
                    }
                }
                else {
                    this.parent.clearSorting();
                }
            }
            else if (updateAction['action'] === 'Filtering') {
                this.isFromUndoRedo = true;
                for (let i: number = this.getUndoCollection.length - 1; i >= 0; i--) {
                    if (this.getUndoCollection[i as number]['filteredColumns']) {
                        const columnsArray: string[] = [];
                        for (let j: number = 0; j < this.getUndoCollection[i as number]['filteredColumns'].length; j++) {
                            columnsArray.push(this.getUndoCollection[i as number]['filteredColumns'][j as number].field);
                        }
                        this.parent.clearFiltering(columnsArray);
                    }
                }
            }
            else if (updateAction['action'] === 'ColumnReorder') {
                this.isFromUndoRedo = true;
                const fromColumn: string | string[] = this.parent.treeGrid.columns[updateAction['fromIndex']]['field'];
                const toColumn: string = this.parent.treeGrid.columns[updateAction['toIndex']]['field'];
                this.parent.reorderColumns(fromColumn, toColumn);
            }
            else if (updateAction['action'] === 'Search') {
                this.isFromUndoRedo = true;
                this.parent.search(updateAction['searchString']);
            }
            else if (updateAction['action'] === 'ColumnState') {
                this.isFromUndoRedo = true;
                for (let i: number = 0; i < updateAction['showhideColumns'].length; i++) {
                    if (updateAction['showhideColumns'][i as number].visible) {
                        this.parent.hideColumn(updateAction['showhideColumns'][i as number].field, 'field');
                    }
                    else {
                        this.parent.showColumn(updateAction['showhideColumns'][i as number].field, 'field');
                    }
                }
            }
            else if (updateAction['action'] === 'ColumnResize') {
                this.parent.treeGrid.columns[updateAction['resizedColumn'].index]['width'] = updateAction['resizedColumn'].width;
                this.parent.treeGrid.refreshColumns();
            }
            else if (updateAction['action'] === 'RowDragAndDrop' || updateAction['action'] === 'TaskbarDragAndDrop') {
                for (let i: number = 0; i < updateAction['beforeDrop'].length; i++) {
                    const fromIndex: number = this.findTaskRowIndex(updateAction['beforeDrop'][i as number].data.ganttProperties.taskId.toString());
                    const toIndex: number = this.findTaskRowIndex(updateAction['beforeDrop'][i as number]['id'].toString());
                    this.parent.reorderRows([fromIndex], toIndex, updateAction['beforeDrop'][i as number].position);
                }
                this.updateModifiedAndConnectedRecords(updateAction);
            }
            else if (updateAction['action'] === 'Indent' || updateAction['action'] === 'Outdent') {
                this.parent.selectRow(this.findTaskRowIndex(updateAction['modifiedRecord'][0].data.ganttProperties.taskId.toString()));
                if (updateAction['action'] === 'Indent') {
                    this.parent.outdent();
                }
                else {
                    this.parent.indent();
                }
            }
            else if (updateAction['action'] === 'Delete') {
                for (let i: number = 0; i < updateAction['deletedRecordsDetails'].length; i++) {
                    const rowIndex: number = this.findTaskRowIndex(updateAction['deletedRecordsDetails'][i as number].id.toString());
                    let position: string;
                    if (updateAction['deletedRecordsDetails'][i as number].position === 'above') {
                        position = 'Above';
                    }
                    if (updateAction['deletedRecordsDetails'][i as number].position === 'below') {
                        position = 'Below';
                    }
                    if (updateAction['deletedRecordsDetails'][i as number].position === 'child') {
                        position = 'Child';
                    }
                    if (isNullOrUndefined(position)) {
                        const deletePosition: string = updateAction['deletedRecordsDetails'][i as number].position;
                        position = deletePosition.charAt(0).toUpperCase() + deletePosition.slice(1);
                    }
                    if (updateAction['deletedRecordsDetails'][i as number].data.ganttProperties.predecessor &&
                        updateAction['deletedRecordsDetails'][i as number].data.ganttProperties.predecessor.length > 0) {
                        updateAction['deletedRecordsDetails'][i as number].data.ganttProperties.predecessor.forEach((predecessor: IPredecessor) => {
                            const restoredToRecord: IGanttData = this.parent.connectorLineModule.getRecordByID(predecessor.to);
                            if (restoredToRecord) {
                                restoredToRecord.ganttProperties.predecessor.push(predecessor);
                                const predecessorStringValue: string =
                                this.parent.predecessorModule.getPredecessorStringValue(restoredToRecord);
                                restoredToRecord.ganttProperties.predecessorsName = predecessorStringValue;
                            }
                        });
                    }
                    this.parent.addRecord(updateAction['deletedRecordsDetails'][i as number].data, position as RowPosition, rowIndex);
                }
            }
            else if (updateAction['action'] === 'Add') {
                const isShowDeleteConfirmDialog: boolean = extend([], [this.parent.editSettings.showDeleteConfirmDialog], [], true)[0];
                this.parent.editSettings.showDeleteConfirmDialog = false;
                let deleteRec: IGanttData = updateAction['addedRecords'];
                if (this.parent.viewType === 'ResourceView' && updateAction['addedRecords'].length === 1 && (updateAction['addedRecords'][0] as IGanttData).parentItem) {
                    const parentRec: IGanttData = this.parent.getTaskByUniqueID((updateAction['addedRecords'][0] as IGanttData).parentItem.uniqueID);
                    if (parentRec.childRecords.length === 1 && parentRec.ganttProperties.taskName === 'Unassigned Task') {
                        deleteRec = parentRec;
                    }
                }
                this.parent.deleteRecord(deleteRec);
                if (this.parent.enableVirtualization && this.parent.treeGrid['virtualScrollModule'] &&
                    !isNullOrUndefined(this.parent.treeGrid['virtualScrollModule'].ganttEndIndex)) {
                    this.parent.treeGrid['virtualScrollModule'].ganttEndIndex = this.parent.flatData.length;
                }
                this.parent.editSettings.showDeleteConfirmDialog = isShowDeleteConfirmDialog;
            }
            else {
                this.updateModifiedAndConnectedRecords(updateAction);
            }
            let args: Object = {};
            args = extend([], [], [this.getUndoCollection[this.getUndoCollection.length - 1]], true)[0];
            args['requestType'] = 'afterUndoAction';
            this.parent.trigger('onAfterUndo', args);
            this.isUndoRedoPerformed = false;
            if ((updateAction['action'] === 'RowDragAndDrop' || updateAction['action'] === 'TaskbarDragAndDrop') ||
                (updateAction['action'] === 'Indent' || updateAction['action'] === 'Outdent')) {
                this.undoActionDetails = this.getUndoCollection[this.getUndoCollection.length - 1];
            }
            if (this.getRedoCollection.length > 0) {
                if (this.parent.toolbarModule) {
                    this.parent.toolbarModule.enableItems([this.parent.controlId + '_redo'], true);
                }
                this.redoEnabled = true;
            }
            this.getUndoCollection.splice(this.getUndoCollection.length - 1, 1);
            if (this.getUndoCollection.length === 0 && this.parent.toolbarModule) {
                this.parent.toolbarModule.enableItems([this.parent.controlId + '_undo'], false);
            }
        }
        else {
            this.getUndoCollection.splice(this.getUndoCollection.length - 1, 1);
            if (this.getUndoCollection.length === 0 && this.parent.toolbarModule) {
                this.parent.toolbarModule.enableItems([this.parent.controlId + '_undo'], false);
            }
        }
    }

    /**
     *Initiates an redo action to reapply the most recent undone change performed.
     *
     * @returns {void}
     * @public
     */
    private redoAction(): void {
        if (this.getRedoCollection.length > 0) {
            const updateAction: Object = this.getRedoCollection[this.getRedoCollection.length - 1];
            const previousActions: Object = {};
            if (updateAction['action'] === 'ZoomIn' || updateAction['action'] === 'ZoomOut' || updateAction['action'] === 'ZoomToFit') {
                previousActions['action'] = updateAction['action'];
                previousActions['previousZoomingLevel'] = extend({}, {}, this.parent.currentZoomingLevel, true);
                previousActions['previousZoomingLevel'].bottomTier.format = this.parent.timelineModule.customTimelineSettings.bottomTier.format;
                previousActions['previousZoomingLevel'].topTier.format = this.parent.timelineModule.customTimelineSettings.topTier.format;
            }
            else if (updateAction['action'] === 'NextTimeSpan' || updateAction['action'] === 'PreviousTimeSpan') {
                previousActions['action'] = updateAction['action'];
                previousActions['previousTimelineStartDate'] = extend([], [this.parent.timelineModule.timelineStartDate], [], true)[0];
                previousActions['previousTimelineEndDate'] = extend([], [this.parent.timelineModule.timelineEndDate], [], true)[0];
            }
            else if (updateAction['action'] === 'Sorting') {
                previousActions['action'] = 'Sorting';
                previousActions['sortColumns'] = extend([], this.parent.sortSettings.columns, [], true);
            }
            else if (updateAction['action'] === 'Filtering') {
                previousActions['action'] = 'Filtering';
                previousActions['filteredColumns'] = updateAction['filteredColumns'];
            }
            else if (updateAction['action'] === 'ColumnReorder') {
                previousActions['action'] = updateAction['action'];
                previousActions['toColumn'] = updateAction['fromColumn'];
                previousActions['fromColumn'] = updateAction['toColumn'];
                previousActions['fromIndex'] = updateAction['toIndex'];
                previousActions['toIndex'] = updateAction['fromIndex'];
            }
            else if (updateAction['action'] === 'Search') {
                previousActions['action'] = updateAction['action'];
                previousActions['searchString'] = extend([], [this.parent.searchSettings.key], [], true)[0];
            }
            else if (updateAction['action'] === 'ColumnState') {
                previousActions['action'] = updateAction['action'];
                previousActions['showhideColumns'] = updateAction['showhideColumns'];
            }
            else if (updateAction['action'] === 'ColumnResize') {
                previousActions['action'] = updateAction['action'];
                previousActions['resizedColumn'] = { ...this.parent.treeGrid.columns[updateAction['resizedColumn'].index] as Object };
            }
            else if (updateAction['action'] === 'RowDragAndDrop' || updateAction['action'] === 'TaskbarDragAndDrop') {
                const rowItems: IGanttData[] = [];
                for (let i: number = 0; i < updateAction['beforeDrop'].length; i++) {
                    if (this.parent.viewType === 'ProjectView') {
                        rowItems.push(this.parent.getRecordByID(updateAction['beforeDrop'][i as number]['data'].ganttProperties.taskId));
                    }
                    else {
                        rowItems.push(this.parent.flatData[this.getResourceViewRowIndex(updateAction['beforeDrop'][i as number]['data'])]);
                    }
                }
                previousActions['action'] = updateAction['action'];
                previousActions['beforeDrop'] = [];
                const previousDetails: Object = {};
                let dropRecord: IGanttData;
                if (updateAction['afterDrop'].dropRecord) {
                    dropRecord = extend([], [], [this.parent.getRecordByID(updateAction['afterDrop'].dropRecord.ganttProperties.taskId)], true)[0];
                }
                previousDetails['data'] = [];
                for (let i: number = 0; i < updateAction['afterDrop'].data.length; i++) {
                    if (this.parent.viewType === 'ProjectView') {
                        previousDetails['data'].push(extend([], [], [this.parent.getRecordByID(updateAction['afterDrop'].data[i as number].ganttProperties.taskId)], true)[0]);
                    }
                    else {
                        if (updateAction['afterDrop'].data[i as number] !== undefined) {
                            previousDetails['data'].push(extend([], [], [this.parent.flatData[this.getResourceViewRowIndex(updateAction['afterDrop'].data[i as number])]], true)[0]);
                        }
                    }
                }
                previousDetails['dropRecord'] = extend([], [], [dropRecord], true)[0];
                previousDetails['dropPosition'] = updateAction['afterDrop'].dropPosition;
                previousActions['afterDrop'] = previousDetails;
                this['findPosition'](rowItems, previousActions, 'beforeDrop');
                this.preparePreviousRedoActions(updateAction, previousActions);
            }
            else if (updateAction['action'] === 'Indent' || updateAction['action'] === 'Outdent') {
                previousActions['selectedRowIndexes'] = updateAction['selectedRowIndexes'];
                previousActions['droppedRecord'] = extend([], [], [this.parent.flatData[this.parent.ids.indexOf(updateAction['droppedRecord'].ganttProperties.taskId.toString())]], true)[0];
                previousActions['modifiedRecord'] = [];
                this.findPosition(extend([], [], [this.parent.flatData[this.parent.ids.indexOf(updateAction['modifiedRecord'][0].data.ganttProperties.taskId.toString())]], true) as IGanttData[], previousActions, 'modifiedRecord');
                previousActions['action'] = updateAction['action'];
            }
            else if (updateAction['action'] === 'Delete') {
                previousActions['action'] = 'Delete';
                previousActions['deletedRecordsDetails'] = [];
                this['findPosition'](extend([], [], updateAction['deleteRecords'], true) as IGanttData[], previousActions, 'deletedRecordsDetails');
            }
            else if (updateAction['action'] === 'Add') {
                previousActions['action'] = 'Add';
                previousActions['addedRecords'] = [updateAction['deletedRecordsDetails'][0].data];
            }
            else {
                this.preparePreviousRedoActions(updateAction, previousActions);
            }
            this.getUndoCollection.push(previousActions);
            this.isUndoRedoPerformed = true;
            this.currentAction = updateAction;
            if (updateAction['action'] === 'ZoomIn' || updateAction['action'] === 'ZoomOut' || updateAction['action'] === 'ZoomToFit') {
                if (updateAction['action'] === 'ZoomToFit') {
                    this.parent.fitToProject();
                }
                else {
                    this.parent.timelineSettings.timelineViewMode = updateAction['previousZoomingLevel'].timelineViewMode;
                    this.parent.timelineSettings.timelineUnitSize = updateAction['previousZoomingLevel'].timelineUnitSize;
                    this.parent.timelineSettings.updateTimescaleView = updateAction['previousZoomingLevel'].updateTimescaleView;
                    this.parent.timelineSettings.topTier.unit = updateAction['previousZoomingLevel'].topTier.unit;
                    this.parent.timelineSettings.topTier.count = updateAction['previousZoomingLevel'].topTier.count;
                    this.parent.timelineSettings.topTier.format = updateAction['previousZoomingLevel'].topTier.format;
                    this.parent.timelineSettings.bottomTier.unit = updateAction['previousZoomingLevel'].bottomTier.unit;
                    this.parent.timelineSettings.bottomTier.count = updateAction['previousZoomingLevel'].bottomTier.count;
                    this.parent.timelineSettings.bottomTier.format = updateAction['previousZoomingLevel'].bottomTier.format;
                    this.parent.timelineSettings.weekStartDay = updateAction['previousZoomingLevel'].weekStartDay;
                    this.parent.timelineSettings.weekendBackground = updateAction['previousZoomingLevel'].weekendBackground;
                    this.isZoomingUndoRedoProgress = true;
                }
            }
            else if (updateAction['action'] === 'NextTimeSpan' || updateAction['action'] === 'PreviousTimeSpan') {
                this.parent.updateProjectDates(updateAction['previousTimelineStartDate'], updateAction['previousTimelineEndDate'], false);
            }
            else if (updateAction['action'] === 'Sorting') {
                this.isFromUndoRedo = true;
                this.sortedColumnsLength = 0;
                if (updateAction['sortColumns'].length === 0) {
                    this.parent.clearSorting();
                }
                else {
                    for (let i: number = 0; i < updateAction['sortColumns'].length; i++) {
                        this.parent.treeGrid.sortByColumn(updateAction['sortColumns'][i as number]['field'], updateAction['sortColumns'][i as number]['direction'], (updateAction['sortColumns'].length > 1 ? true : false));
                    }
                }
            }
            else if (updateAction['action'] === 'ColumnState') {
                this.isFromUndoRedo = true;
                for (let i: number = 0; i < updateAction['showhideColumns'].length; i++) {
                    if (updateAction['showhideColumns'][i as number].visible) {
                        this.parent.hideColumn(updateAction['showhideColumns'][i as number].field, 'field');
                    }
                    else {
                        this.parent.showColumn(updateAction['showhideColumns'][i as number].field, 'field');
                    }
                }
            }
            else if (updateAction['action'] === 'Filtering') {
                for (let j: number = 0; j < updateAction['filteredColumns'].length; j++) {
                    this.isFromUndoRedo = true;
                    this.parent.filterByColumn(updateAction['filteredColumns'][j as number].field, updateAction['filteredColumns'][j as number].operator, updateAction['filteredColumns'][j as number].value, updateAction['filteredColumns'][j as number].predicate, updateAction['filteredColumns'][j as number].matchCase, updateAction['filteredColumns'][j as number].ignoreAccent);
                }
            }
            else if (updateAction['action'] === 'ColumnReorder') {
                this.isFromUndoRedo = true;
                const fromColumn: string | string[] = this.parent.treeGrid.columns[updateAction['fromIndex']]['field'];
                const toColumn: string = this.parent.treeGrid.columns[updateAction['toIndex']]['field'];
                this.parent.reorderColumns(fromColumn, toColumn);
            }
            else if (updateAction['action'] === 'Search') {
                this.isFromUndoRedo = true;
                this.parent.search(updateAction['searchString']);
            }
            else if (updateAction['action'] === 'ColumnResize') {
                this.parent.treeGrid.columns[updateAction['resizedColumn'].index]['width'] = updateAction['resizedColumn'].width;
                this.parent.treeGrid.refreshColumns();
            }
            else if (updateAction['action'] === 'RowDragAndDrop' || updateAction['action'] === 'TaskbarDragAndDrop') {
                for (let i: number = 0; i < updateAction['beforeDrop'].length; i++) {
                    const fromIndex: number = this.findTaskRowIndex(updateAction['beforeDrop'][i as number].data.ganttProperties.taskId.toString());
                    const toIndex: number = this.findTaskRowIndex(updateAction['beforeDrop'][i as number]['id'].toString());
                    this.parent.reorderRows([fromIndex], toIndex, updateAction['beforeDrop'][i as number].position);
                }
                if (updateAction['modifiedRecords']) {
                    this.parent.updateRecordByID(updateAction['modifiedRecords'][0]);
                }
            }
            else if (updateAction['action'] === 'Indent' || updateAction['action'] === 'Outdent') {
                this.parent.selectRow(updateAction['selectedRowIndexes'][0]);
                if (updateAction['action'] === 'Indent') {
                    this.parent.indent();
                }
                if (updateAction['action'] === 'Outdent') {
                    this.parent.outdent();
                }
            }
            else if (updateAction['action'] === 'Delete') {
                const isShowDeleteConfirmDialog: boolean = extend([], [this.parent.editSettings.showDeleteConfirmDialog], [], true)[0];
                this.parent.editSettings.showDeleteConfirmDialog = false;
                this.parent.deleteRecord(updateAction['deleteRecords']);
                this.parent.editSettings.showDeleteConfirmDialog = isShowDeleteConfirmDialog;
            }
            else if (updateAction['action'] === 'Add') {
                if (this.parent.viewType === 'ResourceView' && updateAction['deletedRecordsDetails'].length > 1) {
                    this.parent.editModule.addRecord(extend([], [], updateAction['deletedRecordsDetails'], true));
                }
                else {
                    for (let i: number = 0; i < updateAction['deletedRecordsDetails'].length; i++) {
                        const rowIndex: number = this.findTaskRowIndex(updateAction['deletedRecordsDetails'][i as number].id.toString());
                        let position: string;
                        if (updateAction['deletedRecordsDetails'][i as number].position === 'above') {
                            position = 'Above';
                        }
                        if (updateAction['deletedRecordsDetails'][i as number].position === 'below') {
                            position = 'Below';
                        }
                        if (updateAction['deletedRecordsDetails'][i as number].position === 'child') {
                            position = 'Child';
                        }
                        if (updateAction['deletedRecordsDetails'][i as number].position === 'bottom') {
                            position = 'Bottom';
                        }
                        this.parent.editModule.addRecord(updateAction['deletedRecordsDetails'][i as number].data, position as RowPosition, rowIndex);
                    }
                }
            }
            else {
                this.parent.updateRecordByID(updateAction['modifiedRecords'][0]);
            }
            this.isUndoRedoPerformed = false;
            if (this.getUndoCollection.length > 0 && this.parent.toolbarModule) {
                this.parent.toolbarModule.enableItems([this.parent.controlId + '_undo'], true);
            }
            this.getRedoCollection.splice(this.getRedoCollection.length - 1, 1);
            if (this.getRedoCollection.length === 0 && this.parent.toolbarModule) {
                this.redoEnabled = false;
                this.parent.toolbarModule.enableItems([this.parent.controlId + '_redo'], false);
            }
        }
    }
    private findTaskRowIndex (taskId: string): number {
        return this.parent.updatedRecords.findIndex((data: IGanttData) => {
            const dataTaskId: string = data.ganttProperties.taskId.toString();
            if (this.parent.viewType === 'ProjectView') {
                return dataTaskId === taskId;
            } else {
                const prefixedId: string = ((data.level === 0 || data.ganttProperties.taskName === 'Unassigned Task') ? 'R' : 'T') + dataTaskId;
                // Support both prefixed and raw taskId for ResourceView
                return dataTaskId === taskId || prefixedId === taskId;
            }
        });
    }
    private getResourceViewRowIndex(data: IGanttData): number {
        if (data) {
            const prefix: string = data.level === 0 ? 'R' : 'T';
            return this.parent.taskIds.indexOf(prefix + data.ganttProperties.taskId.toString());
        }
        return -1;
    }

    private createUndoCollection(): void {
        if (this.parent['totalUndoAction'] + 1 > this.parent.undoRedoStepsCount && this.getUndoCollection.length === this.parent['totalUndoAction']) {
            this.getUndoCollection.splice(0, 1);
            this.disableRedo();
        }
        if (this.parent.toolbarModule) {
            this.parent.toolbarModule.enableItems([this.parent.controlId + '_undo'], true);
        }
        if (this.getUndoCollection.length === 0) {
            this.getUndoCollection[0] = [];
            if (this.parent['totalUndoAction'] + 1 <= this.parent.undoRedoStepsCount) {
                this.parent['totalUndoAction']++;
            }
        }
        else if (Object.keys(this['getUndoCollection'][this['getUndoCollection'].length - 1])['length'] > 0) {
            this.getUndoCollection[this.getUndoCollection.length] = [];
            if (this.parent['totalUndoAction'] + 1 <= this.parent.undoRedoStepsCount) {
                this.parent['totalUndoAction']++;
            }
        }
    }

    private disableRedo(): void {
        this.redoEnabled = false;
        this.getRedoCollection = [];
        if (this.parent.toolbarModule) {
            this.parent.toolbarModule.enableItems([this.parent.controlId + '_redo'], false);
        }
    }

    private findPosition(rowItems: IGanttData[], records: Object, detail: string): void {
        for (let i: number = 0; i < rowItems.length; i++) {
            const record: Object = {};
            record['data'] = rowItems[i as number];
            if (this.parent.viewType === 'ProjectView') {
                if (!rowItems[i as number].hasChildRecords && rowItems[i as number].parentItem) {
                    const parentItem: IGanttData = this.parent.getRecordByID(rowItems[i as number].parentItem.taskId);
                    if (parentItem.childRecords.length > 1) {
                        const recIndex: number = this.parent.ids.indexOf(rowItems[i as number].ganttProperties.taskId.toString());
                        const previousRecord: IGanttData = this.parent.flatData[recIndex - 1];
                        if (previousRecord.parentItem &&
                            previousRecord.parentItem.taskId.toString() === parentItem.ganttProperties.taskId.toString()) {
                            record['position'] = 'below';
                            record['id'] = extend([], [this.parent.flatData[this.parent.ids.indexOf(rowItems[i as number].ganttProperties.taskId.toString()) - 1].ganttProperties.taskId], [], true)[0];
                        }
                        else {
                            record['position'] = 'above';
                            let currentData: IGanttData = this.parent.flatData[this.parent.ids.indexOf(
                                rowItems[i as number].ganttProperties.taskId.toString()) + 1];
                            let index: number = this.parent.ids.indexOf(rowItems[i as number].ganttProperties.taskId.toString()) + 1;
                            let rowIndex: number = i;
                            do {
                                const rowData: IGanttData = rowItems[rowIndex + 1];
                                if (!rowData ||
                                    (rowData && currentData.ganttProperties.taskId.toString() !==
                                     rowData.ganttProperties.taskId.toString())) {
                                    if (currentData && currentData.parentItem) {
                                        record['id'] = extend([], [currentData.ganttProperties.taskId], [], true)[0];
                                    }
                                    else {
                                        record['id'] = extend([], [rowItems[i as number].parentItem.taskId], [], true)[0];
                                        record['position'] = 'child';
                                    }
                                }
                                else {
                                    rowIndex++;
                                    index++;
                                    currentData = this.parent.flatData[index as number];
                                }
                            }
                            while (!record['id']);
                        }
                    }
                    else {
                        record['position'] = 'child';
                        record['id'] = extend([], [parentItem.ganttProperties.taskId], [], true)[0];
                    }
                }
                else if (!rowItems[i as number].hasChildRecords && !rowItems[i as number].parentItem) {
                    if (this.parent.ids.indexOf(rowItems[i as number].ganttProperties.taskId.toString()) === this.parent.ids.length - 1) {
                        record['position'] = 'below';
                    }
                    else {
                        record['position'] = 'above';
                    }
                    let parentIndex: number;
                    let currentData: IGanttData;
                    let prevInd: number;
                    for (let k: number = 0; k < this.parent.treeGrid.parentData.length; k++) {
                        if (this.parent.treeGrid.parentData[k as number]['ganttProperties'].taskId.toString() === rowItems[i as number].ganttProperties.taskId.toString()) {
                            parentIndex = k;
                            currentData = this.parent.treeGrid.parentData[k + 1];
                            prevInd = k + 1;
                            break;
                        }
                    }
                    let rowIndex: number = i;
                    do {
                        const rowData: IGanttData = rowItems[rowIndex + 1];
                        if (!rowData || (rowData && currentData['ganttProperties'].taskId.toString() !== rowData.ganttProperties.taskId.toString())) {
                            if (currentData) {
                                record['id'] = extend([], [currentData['ganttProperties'].taskId], [], true)[0];
                            }
                            else {
                                currentData = this.parent.treeGrid.parentData[parentIndex - 1];
                                if (!currentData) {
                                    currentData = this.parent.treeGrid.parentData[parentIndex as number];
                                }
                                record['id'] = extend([], [currentData['ganttProperties'].taskId], [], true)[0];
                            }
                        }
                        else {
                            rowIndex++;
                            prevInd++;
                            currentData = this.parent.treeGrid.parentData[prevInd as number];
                        }
                    } while (!record['id']);
                }
                else if (rowItems[i as number].hasChildRecords && !rowItems[i as number].parentItem) {
                    let parentIndex: number;
                    let currentData: IGanttData;
                    let prevInd: number;
                    for (let k: number = 0; k < this.parent.treeGrid.parentData.length; k++) {
                        if (this.parent.treeGrid.parentData[k as number]['ganttProperties'].taskId.toString() === rowItems[i as number].ganttProperties.taskId.toString()) {
                            parentIndex = k;
                            currentData = this.parent.treeGrid.parentData[k + 1];
                            prevInd = k + 1;
                            break;
                        }
                    }
                    if (parentIndex !== -1) {
                        if (parentIndex === 0) {
                            record['position'] = 'above';
                            let rowIndex: number = i;
                            do {
                                const rowData: IGanttData = rowItems[rowIndex + 1];
                                if (!rowData || (rowData && currentData['ganttProperties'].taskId.toString() !== rowData.ganttProperties.taskId.toString())) {
                                    if (!currentData) {
                                        currentData = this.parent.treeGrid.parentData[parentIndex as number];
                                    }
                                    record['id'] = extend([], [currentData['ganttProperties'].taskId], [], true)[0];
                                }
                                else {
                                    rowIndex++;
                                    prevInd++;
                                    currentData = this.parent.treeGrid.parentData[prevInd as number];
                                }
                            } while (!record['id']);
                        }
                        else {
                            record['position'] = 'below';
                            record['id'] = extend([], [(this.parent.treeGrid.parentData[parentIndex - 1] as IGanttData).ganttProperties.taskId], [], true)[0];
                        }
                    }
                }
                else if (rowItems[i as number].hasChildRecords && rowItems[i as number].parentItem) {
                    const parentItem: IGanttData = this.parent.getRecordByID(rowItems[i as number].parentItem.taskId);
                    const childRecords: IGanttData[] = parentItem.childRecords;
                    const childCount: number = childRecords.length;
                    const currentTaskId: string = rowItems[i as number].ganttProperties.taskId.toString();
                    if (childCount === 1) {
                        record['position'] = 'child';
                        record['id'] =  extend([], [parentItem.ganttProperties.taskId], [], true)[0];
                    } else {
                        const childIndex: number = childRecords.findIndex((child : IGanttData) =>
                            child.ganttProperties.taskId.toString() === currentTaskId
                        );
                        if (childIndex !== -1) {
                            if (childIndex === 0) {
                                record['position'] = 'above';
                                record['id'] = childRecords[1].ganttProperties.taskId;
                            } else {
                                record['position'] = 'below';
                                record['id'] = childRecords[childIndex - 1].ganttProperties.taskId;
                            }
                        }
                    }
                }
            }
            else {
                if (rowItems[i as number].parentItem) {
                    let parentRecord: IGanttData;
                    if (rowItems[i as number].parentItem.index) {
                        parentRecord = this.parent.flatData[rowItems[i as number].parentItem.index];
                    }
                    else {
                        parentRecord = this.parent.flatData[this.parent.ids.indexOf(rowItems[i as number].parentItem.taskId)];
                    }
                    if (parentRecord.childRecords.length === 1) {
                        record['position'] = 'child';
                        record['id'] = 'R' + parentRecord.ganttProperties.taskId;
                        if (detail === 'deletedIndexes') {
                            record['position'] = 'child';
                            record['index'] = parentRecord.index;
                        }
                    }
                    else {
                        let currentIndex: number;
                        for (let j: number = 0; j < parentRecord.childRecords.length; j++) {
                            if (parentRecord.childRecords[j as number].ganttProperties.taskId.toString() ===
                                rowItems[i as number].ganttProperties.taskId.toString()) {
                                currentIndex = j;
                                break;
                            }
                        }
                        const previousRecord: IGanttData = parentRecord.childRecords[currentIndex - 1];
                        if (previousRecord && previousRecord.parentItem && previousRecord.parentUniqueID === parentRecord.uniqueID) {
                            record['position'] = 'below';
                            record['id'] = extend([], ['T' + this.parent.flatData[this.parent.taskIds.indexOf('T' + rowItems[i as number].ganttProperties.taskId.toString()) - 1].ganttProperties.taskId], [], true)[0];
                            if (detail === 'deletedIndexes') {
                                record['index'] = this.parent.taskIds.indexOf('T' + rowItems[i as number].ganttProperties.taskId.toString()) - 1;
                            }
                        }
                        else {
                            let index: number;
                            if (currentIndex !== parentRecord.childRecords.length - 1) {
                                record['position'] = 'above';
                                if (currentIndex === 0 && parentRecord.childRecords[1]) {
                                    index = parentRecord.childRecords[1].index;
                                }
                                else if (parentRecord.childRecords[currentIndex - 1]) {
                                    index = parentRecord.childRecords[currentIndex - 1].index;
                                }
                                let currentData: IGanttData = this.parent.flatData[index as number];
                                let recIndex: number = index;
                                let rowIndex: number = i;
                                do {
                                    const rowData: IGanttData = rowItems[rowIndex + 1];
                                    if (!rowData ||
                                        (rowData && currentData.ganttProperties.taskId.toString() !==
                                         rowData.ganttProperties.taskId.toString())) {
                                        if (currentData && currentData.parentItem) {
                                            record['id'] = extend([], ['T' + currentData.ganttProperties.taskId], [], true)[0];
                                            if (detail === 'deletedIndexes') {
                                                record['index'] = extend([], [currentData.index], [], true)[0];
                                                if (currentIndex === 0 && parentRecord.childRecords[1].ganttProperties.taskId ===
                                                    currentData.ganttProperties.taskId) {
                                                    record['index'] = record['index'] - 1;
                                                }
                                            }
                                        }
                                        else {
                                            record['id'] = extend([], ['R' + rowItems[i as number].parentItem.taskId], [], true)[0];
                                            record['position'] = 'child';
                                            if (detail === 'deletedIndexes') {
                                                record['index'] = rowItems[i as number].parentItem.index;
                                            }
                                        }
                                    }
                                    else {
                                        rowIndex++;
                                        recIndex++;
                                        currentData = this.parent.flatData[recIndex as number];
                                    }
                                }
                                while (!record['id']);
                            }
                            else {
                                if (currentIndex === parentRecord.childRecords.length - 1) {
                                    record['position'] = 'below';
                                }
                                else {
                                    record['position'] = 'above';
                                }
                                record['id'] = 'T' + parentRecord.childRecords[currentIndex - 1].ganttProperties.taskId;
                                if (detail === 'deletedIndexes') {
                                    record['index'] = parentRecord.childRecords[currentIndex - 1].index;
                                }
                            }
                        }
                    }
                }
                else {
                    const parentData: IGanttData = this.parent.treeGrid.parentData.filter((parentData: IGanttData) => {
                        return parentData.ganttProperties.taskId === rowItems[i as number].ganttProperties.taskId;
                    })[0];
                    const parentDataIndex: number = this.parent.treeGrid.parentData.indexOf(parentData);
                    if (parentDataIndex === 0) {
                        record['position'] = 'above';
                        let currentData: IGanttData;
                        let prevInd: number;
                        for (let k: number = 0; k < this.parent.treeGrid.parentData.length; k++) {
                            if (this.parent.treeGrid.parentData[k as number]['ganttProperties'].taskId === rowItems[i as number].ganttProperties.taskId) {
                                currentData = this.parent.treeGrid.parentData[k + 1];
                                prevInd = k + 1;
                                break;
                            }
                        }
                        let rowIndex: number = i;
                        do {
                            const rowData: IGanttData = rowItems[rowIndex + 1];
                            if (!rowData || (rowData && currentData['ganttProperties'].taskId !== rowData.ganttProperties.taskId)) {
                                record['id'] = 'R' + currentData['ganttProperties'].taskId;
                                if (detail === 'deletedIndexes') {
                                    record['index'] = currentData['index'];
                                }
                            }
                            else {
                                rowIndex++;
                                prevInd++;
                                currentData = this.parent.treeGrid.parentData[prevInd as number];
                            }
                        } while (!record['id']);
                    }
                    else {
                        record['position'] = 'below';
                        record['id'] = 'R' + this.parent.treeGrid.parentData[parentDataIndex - 1]['ganttProperties']['taskId'];
                        if (detail === 'deletedIndexes') {
                            record['index'] = this.parent.treeGrid.parentData[parentDataIndex - 1]['index'];
                        }
                    }
                }
            }
            if (detail === 'deletedIndexes') {
                const parent: IGanttData = this.parent.getTaskByUniqueID(record['data'].parentUniqueID);
                if (this.parent.editModule.dialogModule.ganttResources.length === 0 && records[detail as string].indexOf(record) === -1) {
                    records[detail as string].push(record);
                }
                else {
                    for (let j: number = 0; j < this.parent.editModule.dialogModule.ganttResources.length; j++) {
                        if (this.parent.editModule.dialogModule.ganttResources[j as number][this.parent.resourceFields.id] !==
                            parent.ganttProperties.taskId && records[detail as string].indexOf(record) === -1) {
                            records[detail as string].push(record);
                        }
                    }
                }
            }
            else {
                if (!records[detail as string].some((existingRecord: any) => existingRecord.data.ganttProperties.taskId === (record as any)['data'].ganttProperties.taskId)) {
                    records[detail as string].push(record);
                }
            }
        }
    }


    public getModuleName(): string {
        return 'undoRedo';
    }

    /**
     * Destroys the UndoRedo of Gantt.
     *
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        if (!this.parent.enableUndoRedo && this.parent.undoRedoModule) {
            this.parent.undoRedoModule = undefined;
        }
    }
}
