import { isNullOrUndefined, getValue, extend, setValue } from '@syncfusion/ej2-base';
import { getUid, ReturnType } from '@syncfusion/ej2-grids';
import { IGanttData, ITaskData, IParent, IWorkTimelineRanges, IWorkingTimeRange, ITaskSegment } from './interface';
import { DataManager, Query, Group, ReturnOption } from '@syncfusion/ej2-data';
import { isCountRequired, isScheduledTask } from './utils';
import { Gantt } from './gantt';
import { DateProcessor } from './date-processor';
import { TaskFieldsModel, ColumnModel, ResourceFieldsModel } from '../models/models';
import { CObject } from './enum';
import { WeekWorkingTimeModel } from '../models/week-working-time-model';

/**
 * To calculate and update task related values
 */
export class TaskProcessor extends DateProcessor {

    public recordIndex: number;
    public dataArray: Object[];
    public taskIds: Object[];
    private segmentCollection: Object[];
    private hierarchyData: Object[];
    public isResourceString: boolean;
    private customSegmentProperties: Object[] = [];
    private systemTimeZone: string;
    private isBaseline : boolean = false;

    constructor(parent: Gantt) {
        super(parent);
        this.recordIndex = 0;
        this.taskIds = [];
        this.hierarchyData = [];
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.on('beforeDataManipulate', this.checkDataBinding.bind(this));
    }
    /**
     * @param {boolean} isChange .
     * @returns {void} .
     * @private
     */
    public checkDataBinding(isChange?: boolean): void {
        if (isChange) {
            this.parent.flatData = [];
            this.parent.currentViewData = [];
            this.parent.updatedRecords = [];
            this.dataArray = [];
            this.taskIds = [];
            this.parent.ids = [];
            this.recordIndex = 0;
            this.hierarchyData = [];
            this.parent.predecessorsCollection = [];
            this.parent.treeGrid.parentData = [];
            this.parent.taskIds = [];
        }
        if (isNullOrUndefined(this.parent.dataSource)) {
            this.parent.dataSource = [];
            this.parent.processTimeline();
            this.parent.renderGantt(isChange);
        } else if (this.parent.dataSource instanceof DataManager) {
            this.initDataSource(isChange);
        } else {
            if (this.parent.dataSource instanceof Object && isCountRequired(this.parent)) {
                const ganttdata: Object[] = getValue('result', this.parent.dataSource);
                this.dataArray = ganttdata;
            } else {
                this.dataArray = this.parent.dataSource as object[];
            }
            this.processTimeline();
            this.cloneDataSource();
            this.parent.renderGantt(isChange);
            this.parent.flatData.map((data: IGanttData) => {
                this.parent.chartRowsModule.updateSegment(data.ganttProperties.segments, data.ganttProperties.taskId);
            });
        }
        this.parent.flatData.map((data: IGanttData) => {
            this.parent.chartRowsModule.updateSegment(data.ganttProperties.segments, data.ganttProperties.taskId);
        });
    }
    private processTimeline(): void {
        this.parent.processTimeline();
        if (!this.parent.enableValidation) {
            this.parent.dataOperation.calculateProjectDatesForValidatedTasks();
            this.parent.timelineModule.validateTimelineProp();
        }
    }
    private initDataSource(isChange?: boolean): void {
        const queryManager: Query = this.parent.query instanceof Query ? this.parent.query : new Query();
        queryManager.requiresCount();
        const dataManager: DataManager = this.parent.dataSource as DataManager;
        if (this.parent.loadChildOnDemand && this.parent.taskFields.hasChildMapping) {
            this.processTimeline();
            this.parent.renderGantt(isChange);
        } else {
            dataManager.executeQuery(queryManager).then((e: ReturnOption) => {
                this.dataArray = <Object[]>e.result;
                this.processTimeline();
                if (!this.parent.loadChildOnDemand || (this.parent.loadChildOnDemand && !(this.parent.taskFields.hasChildMapping))) {
                    this.cloneDataSource();
                }
                this.parent.renderGantt(isChange);
            }).catch((e: ReturnType) => {
                // Trigger action failure event
                this.parent.processTimeline();
                this.parent.renderGantt(isChange);
                this.parent.trigger('actionFailure', { error: e });
            });
        }
    }
    private constructDataSource(dataSource: Object[]): void {
        const mappingData: Object[] = new DataManager(dataSource).executeLocal(new Query()
            .group(this.parent.taskFields.parentID));
        const rootData: Object[] = [];
        let index: number;
        for (let i: number = 0; i < mappingData.length; i++) {
            const groupData: Group = mappingData[i as number];
            if (!isNullOrUndefined(groupData.key)) {
                index = this.taskIds.indexOf(groupData.key.toString());
                if (index > -1) {
                    if (!isNullOrUndefined(groupData.key)) {
                        dataSource[index as number][this.parent.taskFields.child] = groupData.items;
                        continue;
                    }
                }
            }
            if (index !== -1) {
                rootData.push.apply(rootData, groupData.items);    // eslint-disable-line
            }
        }
        this.hierarchyData = this.dataReorder(dataSource, rootData);
    }
    public cloneDataSource(): void {
        const taskIdMapping: string = this.parent.taskFields.id;
        const parentIdMapping: string = this.parent.taskFields.parentID;
        let hierarchicalData: Object[] = [];
        if (!isNullOrUndefined(taskIdMapping) && !isNullOrUndefined(parentIdMapping)) {
            const data: object[] = [];
            for (let i: number = 0; i < this.dataArray.length; i++) {
                const tempData: Object = this.dataArray[i as number];
                if (tempData['parentItem']) {
                    delete tempData['parentItem'];
                }
                data.push(extend({}, {}, tempData, true));
                if (!isNullOrUndefined(tempData[taskIdMapping as string])) {
                    this.taskIds.push(tempData[taskIdMapping as string].toString());
                }
            }
            if (!this.parent.taskFields.child) {
                this.parent.setProperties({ taskFields: { child: 'Children' } }, true);
            }
            this.constructDataSource(data);
            if (this.parent.loadChildOnDemand && this.parent.taskFields.hasChildMapping) {
                hierarchicalData = this.dataArray;
            }
            else {
                hierarchicalData = this.hierarchyData;
            }
        } else {
            hierarchicalData = this.dataArray;
        }
        if (this.parent.taskFields.segmentId) {
            this.segmentCollection = new DataManager(this.parent.segmentData).executeLocal(new Query()
                .group(this.parent.taskFields.segmentId));
            if (!this.parent.taskFields.segments) {
                this.parent.taskFields.segments = 'Segments';
            }
        }
        if (this.parent.viewType !== 'ProjectView') {
            const resources: Object[] = extend([], [], this.parent.resources, true) as Object[];
            const unassignedTasks: Object[] = [];
            this.constructResourceViewDataSource(resources, hierarchicalData, unassignedTasks);
            if (unassignedTasks.length > 0) {
                const record: Object = {};
                const resourceName: string = this.parent.resourceFields.name || 'resourceName';
                record[this.parent.resourceFields.id] = 0;
                record[resourceName as string] = this.parent.localeObj.getConstant('unassignedTask');
                record[this.parent.taskFields.child] = unassignedTasks;
                resources.push(record);
            }
            hierarchicalData = resources;
        }
        this.prepareDataSource(hierarchicalData);
    }
    /**
     * @param {object[]} resources .
     * @param {object[]} data .
     * @param {object[]} unassignedTasks .
     * @returns {void} .
     *
     */
    private constructResourceViewDataSource(resources: Object[], data: Object[], unassignedTasks: Object[]): void {
        for (let i: number = 0; i < data.length; i++) {
            const tempData: Object = data[i as number];
            const child: string = this.parent.taskFields.child !== null ? this.parent.taskFields.child : this.parent.taskFields.child = 'Children';
            const resourceData: [] = tempData && tempData[this.parent.taskFields.resourceInfo];
            const resourceIdMapping: string = this.parent.resourceFields.id;
            if ((!tempData[child as string]  || tempData[child as string].length === 0) && resourceData && resourceData.length) {
                if (typeof(resourceData) === 'string') {
                    this.isResourceString = true;
                    const id: string = resourceData;
                    for (let j: number = 0; j < resources.length; j++) {
                        if (resources[j as number][this.parent.resourceFields.name as string].toString() === id.toString()) {
                            if (resources[j as number][child as string]) {
                                resources[j as number][child as string].push(tempData);
                            } else {
                                resources[j as number][child as string] = [tempData];
                            }
                            break;
                        }
                    }
                } else {
                    resourceData.forEach((resource: number | object) => {
                        const id: string = (typeof resource === 'object') ? resource[resourceIdMapping as string] :
                            resource;
                        for (let j: number = 0; j < resources.length; j++) {
                            if (resources[j as number][resourceIdMapping as string].toString() === id.toString()) {
                                if (resources[j as number][child as string]) {
                                    resources[j as number][child as string].push(tempData);
                                } else {
                                    resources[j as number][child as string] = [tempData];
                                }
                                break;
                            }
                        }
                    });
                }
            } else if (!tempData[child as string] || (tempData[child as string] && tempData[child as string].length === 0)) {
                unassignedTasks.push(tempData);
            }
            if (tempData[this.parent.taskFields.child] && tempData[this.parent.taskFields.child].length) {
                this.constructResourceViewDataSource(resources, tempData[this.parent.taskFields.child], unassignedTasks);
            }
        }
    }
    /**
     * Function to manipulate data-source
     *
     * @param {object[]} data .
     * @returns {void} .
     * @hidden
     */
    private prepareDataSource(data: Object[]): void {
        this.prepareRecordCollection(data, 0);
        this.parent.initialLoadData = extend({}, {}, this.parent.flatData, true);
        if (!this.parent.autoCalculateDateScheduling || (this.parent.isLoad && this.parent.treeGrid.loadChildOnDemand &&
            this.parent.taskFields.hasChildMapping)) {
            this.parent.dataMap = this.parent.flatData.reduce(
                (map: Map<string, IGanttData>, val: IGanttData): Map<string, IGanttData> => {
                    map.set(val.uniqueID, val);
                    return map;
                },
                new Map<string, IGanttData>()
            );
        }
        // Method to maintain the shared task uniqueIds
        if (this.parent.viewType === 'ResourceView') {
            this.calculateSharedTaskUniqueIds();
        }
        if (this.parent.taskFields.dependency && this.parent.predecessorModule) {
            this.parent.predecessorModule.ensurePredecessorCollection();
        }
    }

    private calculateSharedTaskUniqueIds(): void {
        for (let i: number = 0; i < this.parent.getTaskIds().length; i++) {
            const value: string[] = [];
            value[0] = this.parent.getTaskIds()[i as number][0];
            value[1] = this.parent.getTaskIds()[i as number].slice(1);
            if (value[0] !== 'R') {
                const sharedRecords: IGanttData[] = [];
                const ids: string[] = [];
                this.parent.flatData.filter((data: IGanttData) => {
                    if (data.ganttProperties.taskId.toString() === value[1] && data.level !== 0) {
                        ids.push(data.ganttProperties.rowUniqueID);
                        sharedRecords.push(data);
                    }
                });
                for (let j: number = 0; j < sharedRecords.length; j++) {
                    sharedRecords[j as number].ganttProperties.sharedTaskUniqueIds = ids;
                }
            }
        }
    }
    private prepareRecordCollection(data: Object[], level: number, parentItem?: IGanttData): void {
        const length: number = data.length;
        for (let i: number = 0; i < length; i++) {
            const tempData: Object = data[i as number];
            if (!isNullOrUndefined(this.parent.taskFields.segmentId)) {
                const segmentData: Object[] = this.segmentCollection.
                    filter((x: Group) => x.key === tempData[this.parent.taskFields.id]);
                if (segmentData.length > 0) {
                    tempData[this.parent.taskFields.segments] = (segmentData as Group)[0].items;
                }
            }
            if (this.parent.taskFields.hasChildMapping && tempData['parentUniqueID']) {
                parentItem = this.parent.getTaskByUniqueID(tempData['parentUniqueID']);
            }
            const ganttData: IGanttData = this.createRecord(tempData, level, parentItem, true);
            if (!this.parent.enableValidation || (!this.parent.autoCalculateDateScheduling || (this.parent.isLoad &&
                this.parent.treeGrid.loadChildOnDemand && this.parent.taskFields.hasChildMapping))) {
                this.updateTaskLeftWidth(ganttData);
            }
            ganttData.index = this.recordIndex++;
            this.parent.ids[ganttData.index] = ganttData.ganttProperties.rowUniqueID;
            this.parent.flatData.push(ganttData);
            this.parent.setTaskIds(ganttData);
            const childData: Object[] = tempData[this.parent.taskFields.child] || (tempData['taskData'] && tempData['taskData'][this.parent.taskFields.child]);
            if (this.parent.viewType === 'ResourceView' && isNullOrUndefined(childData)
                && isNullOrUndefined(ganttData.parentItem) && ganttData.level === 0) {
                const ganttProp: ITaskData = ganttData.ganttProperties;
                const parentData: IGanttData = ganttData;
                this.parent.setRecordValue(
                    ganttProp.isAutoSchedule ? 'startDate' : 'autoStartDate',
                    null, parentData.ganttProperties, true);
                this.parent.setRecordValue(
                    ganttProp.isAutoSchedule ? 'endDate' : 'autoEndDate',
                    null, parentData.ganttProperties, true);
                const parentProgress: number = 0;
                const parentProp: ITaskData = parentData.ganttProperties;
                this.parent.setRecordValue('isMilestone', false, parentProp, true);
                if (parentProp.isAutoSchedule) {
                    this.calculateDuration(parentData);
                }
                this.updateWorkWithDuration(parentData);
                const parentWork: number = parentProp.work;
                this.parent.setRecordValue('work', parentWork, parentProp, true);
                this.parent.setRecordValue('taskType', 'FixedDuration', parentProp, true);
                if (!isNullOrUndefined(this.parent.taskFields.type)) {
                    this.updateMappingData(parentData, 'type');
                }
                this.parent.setRecordValue('progress', Math.floor(parentProgress), parentProp, true);
                this.parent.setRecordValue('totalProgress', 0, parentProp, true);
                this.parent.setRecordValue('totalDuration', 0, parentProp, true);
                if (!parentProp.isAutoSchedule) {
                    this.parent.setRecordValue('autoDuration', this.calculateAutoDuration(parentProp), parentProp, true);
                    this.updateAutoWidthLeft(parentData);
                }
                if (!this.parent.allowParentDependency) {
                    this.resetDependency(parentData);
                }
                this.updateWidthLeft(parentData);
                this.updateTaskData(parentData);
            }
            if (this.parent.taskFields.hasChildMapping) {
                parentItem = null;
            }
            if (!isNullOrUndefined(childData) && childData.length > 0) {
                this.prepareRecordCollection(childData, ganttData.level + 1, ganttData);
            }
        }
    }
    /**
     * Method to update custom field values in gantt record
     *
     * @param {object} data .
     * @param {IGanttData} ganttRecord .
     * @returns {void} .
     */
    private addCustomFieldValue(data: Object, ganttRecord: IGanttData): void {
        const columns: ColumnModel[] = this.parent.ganttColumns;
        const length: number = columns.length;
        if (length) {
            for (let i: number = 0; i < length; i++) {
                const fieldName: string  = ganttRecord[columns[i as number].field];
                if (fieldName === undefined) {
                    this.parent.setRecordValue(columns[i as number].field, data[columns[i as number].field], ganttRecord);
                }
            }
        }
    }
    /**
     * To populate Gantt record
     *
     * @param {object} data .
     * @param {number} level .
     * @param {IGanttData} parentItem .
     * @param {boolean} isLoad .
     * @returns {IGanttData} .
     * @private
     */
    public createRecord(data: Object, level: number, parentItem?: IGanttData, isLoad?: boolean): IGanttData {
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        const resourceFields: ResourceFieldsModel = this.parent.resourceFields;
        let progress: number = data[taskSettings.progress];
        let id: string = null; let name: string = null;
        const notes: string = data[taskSettings.notes];
        progress = progress ? parseFloat(progress.toString()) ? parseFloat(progress.toString()) : 0 : 0;
        progress = (100 < progress) ? 100 : progress;
        const predecessors: string | number | object[] = data[taskSettings.dependency];
        const baselineStartDate: Date = this.getDateFromFormat(data[taskSettings.baselineStartDate], true);
        let baselineEndDate: Date = this.getDateFromFormat(data[taskSettings.baselineEndDate], true);
        const ganttData: IGanttData = {} as IGanttData;
        const ganttProperties: ITaskData = {} as ITaskData;
        const autoSchedule: boolean = (this.parent.taskMode === 'Auto') ? true :
            (this.parent.taskMode === 'Manual') ? false :
                data[taskSettings.manual] === true ? false : true;
        this.parent.setRecordValue('ganttProperties', ganttProperties, ganttData);
        if (data['ganttProperties'] && data['ganttProperties'].predecessor && data['ganttProperties'].predecessor.length > 0 && this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed']) {
            this.parent.setRecordValue('predecessor', data['ganttProperties'].predecessor, ganttProperties, true);
        }
        if (!isNullOrUndefined(data[taskSettings.id])) {
            id = data[taskSettings.id];
            name = data[taskSettings.name];
            const shouldLoadChild: boolean = (this.parent.loadChildOnDemand &&
                taskSettings.hasChildMapping && data['taskData']) ? true : false;
            if (shouldLoadChild) {
                ganttData['taskData'] = data['taskData'];
            }
            else {
                if (data['taskData'] && data['ganttProperties']) {
                    this.addTaskData(ganttData, data['taskData'], isLoad);
                }
                else {
                    this.addTaskData(ganttData, data, isLoad);
                }
            }
        } else if (!isNullOrUndefined(data[resourceFields.id])) {
            id = data[resourceFields.id];
            if (isNullOrUndefined(data[resourceFields.name]) && data['resourceName'] === 'Unassigned Task'){
                name = data['resourceName'];
            }
            else{
                name = data[resourceFields.name];
            }
            this.addTaskData(ganttData, data, false);
        }
        this.parent.setRecordValue('taskId', id, ganttProperties, true);
        this.parent.setRecordValue('taskName', name, ganttProperties, true);
        // eslint-disable-next-line
        this.parent && taskSettings.parentID && this.parent.setRecordValue(
            'parentId',
            data[taskSettings.parentID],
            ganttProperties,
            true
        );
        this.addCustomFieldValue(data, ganttData);
        this.parent.setRecordValue('isAutoSchedule', autoSchedule, ganttProperties, true);
        if (!this.parent.undoRedoModule || (this.parent.undoRedoModule && !this.parent.undoRedoModule['isUndoRedoPerformed'])) {
            this.parent.setRecordValue('resourceInfo', this.setResourceInfo(data), ganttProperties, true);
        }
        else if (data['ganttProperties']){
            this.parent.setRecordValue('resourceInfo', data['ganttProperties'].resourceInfo, ganttProperties, true);
        }
        this.parent.setRecordValue('isMilestone', false, ganttProperties, true);
        this.parent.setRecordValue('indicators', data[taskSettings.indicators], ganttProperties, true);
        this.updateResourceName(ganttData);
        if ((!isNullOrUndefined(data[taskSettings.child]) && data[taskSettings.child].length > 0) ||
        (data['taskData'] && data['taskData'][taskSettings.child] && data['taskData'][taskSettings.child].length > 0)) {
            this.parent.setRecordValue('hasChildRecords', true, ganttData);
            this.parent.setRecordValue('isMilestone', false, ganttProperties, true);
            if (!this.parent.allowParentDependency) {
                this.resetDependency(ganttData);
            }
        } else {
            if (this.parent.loadChildOnDemand && taskSettings.hasChildMapping && ganttData.taskData[taskSettings.hasChildMapping]) {
                this.parent.setRecordValue('hasChildRecords', true, ganttData);
            } else {
                this.parent.setRecordValue('hasChildRecords', false, ganttData);
            }
        }
        this.calculateScheduledValues(ganttData, data, isLoad);
        this.parent.setRecordValue('baselineStartDate', this.checkBaselineStartDate(baselineStartDate, ganttProperties), ganttProperties, true);
        // set default end time, if hour is 0
        let dayEndTime: number;
        if (this.parent.weekWorkingTime.length > 0 && baselineEndDate) {
            dayEndTime = this.parent['getEndTime'](baselineEndDate);
        }
        else {
            dayEndTime = this.parent.defaultEndTime;
        }
        if (baselineEndDate && baselineEndDate.getHours() === 0 && dayEndTime !== 86400) {
            this.setTime(dayEndTime, baselineEndDate);
        }
        if ((ganttProperties.baselineStartDate && baselineEndDate &&
            (ganttProperties.baselineStartDate.getTime() > baselineEndDate.getTime())) ||
            ((!isNullOrUndefined(ganttProperties.baselineStartDate) && !isNullOrUndefined(ganttProperties.startDate)
            && (ganttProperties.baselineStartDate.getTime() === ganttProperties.startDate.getTime()))
            && (!isNullOrUndefined(baselineEndDate) && !isNullOrUndefined(ganttProperties.endDate)
            && (baselineEndDate.toLocaleDateString() === ganttProperties.endDate.toLocaleDateString())) &&
                ganttProperties.isMilestone)) {
            baselineEndDate = ganttProperties.baselineStartDate;
        }
        this.parent.setRecordValue('baselineEndDate', this.checkBaselineEndDate(baselineEndDate, ganttProperties), ganttProperties, true);
        this.parent.setRecordValue('progress', progress, ganttProperties, true);
        this.parent.setRecordValue('totalProgress', progress, ganttProperties, true);
        if (data['ganttProperties'] && data['ganttProperties'].predecessorsName && this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed']) {
            this.parent.setRecordValue('predecessorsName', data['ganttProperties'].predecessorsName, ganttProperties, true);
        }
        else {
            this.parent.setRecordValue('predecessorsName', predecessors, ganttProperties, true);
        }
        this.parent.setRecordValue('notes', notes, ganttProperties, true);
        this.parent.setRecordValue('cssClass', data[taskSettings.cssClass], ganttProperties, true);
        this.parent.setRecordValue('parentItem', this.getCloneParent(parentItem), ganttData);
        if (this.parent.loadChildOnDemand && taskSettings.hasChildMapping && this.parent.currentViewData.length > 0) {
            this.parent.setRecordValue('parentItem', ganttData.parentItem, this.parent.currentViewData[this.taskIds.indexOf(data[taskSettings.id].toString())]);
        }
        const parentUniqId: string = ganttData.parentItem ? ganttData.parentItem.uniqueID : null;
        this.parent.setRecordValue('parentUniqueID', parentUniqId, ganttData);
        if (this.parent.viewType === 'ResourceView' && !isNullOrUndefined(taskSettings.parentID)
            && !isNullOrUndefined(ganttData.parentItem)) {
            this.parent.setRecordValue('parentId', ganttData.parentItem.taskId, ganttProperties, true);
        }
        this.parent.setRecordValue('level', data['level'] ? data['level'] : level , ganttData);
        if (data['ganttProperties'] && this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed']) {
            this.parent.setRecordValue('uniqueID', data['uniqueID'], ganttData);
        }
        else {
            if (this.parent.loadChildOnDemand && taskSettings.hasChildMapping && data['uniqueID']) {
                this.parent.setRecordValue('uniqueID', data['uniqueID'], ganttData);
            }
            else {
                this.parent.setRecordValue('uniqueID', getUid(this.parent.element.id + '_data_'), ganttData);
            }
        }
        this.parent.setRecordValue('uniqueID', ganttData.uniqueID, ganttProperties, true);
        this.parent.setRecordValue('childRecords', [], ganttData);
        if (this.parent.dataSource instanceof Object && isCountRequired(this.parent) &&
         !isNullOrUndefined(taskSettings.child)) {
            this.parent.setRecordValue(taskSettings.child, [], ganttData);
        }
        if (ganttData.hasChildRecords) {
            this.parent.setRecordValue('autoStartDate', ganttData.ganttProperties.startDate, ganttProperties);
            this.parent.setRecordValue('autoEndDate', ganttData.ganttProperties.endDate, ganttProperties);
            this.parent.setRecordValue('autoDuration', ganttData.ganttProperties.duration, ganttProperties);
        }
        this.parent.setRecordValue('expanded', (ganttData.hasChildRecords && this.parent.collapseAllParentTasks) ? false : true, ganttData);
        this.updateExpandStateMappingValue(ganttData, data);
        if (!isLoad) {
            this.parent.setRecordValue('width', this.calculateWidth(ganttData), ganttProperties, true);
            this.parent.setRecordValue('left', this.calculateLeft(ganttProperties), ganttProperties, true);
            this.parent.setRecordValue(
                'progressWidth',
                this.getProgressWidth(ganttProperties.width, progress),
                ganttProperties,
                true);
            if (ganttProperties.baselineEndDate && ganttProperties.baselineStartDate) {
                this.parent.setRecordValue('baselineLeft', this.calculateBaselineLeft(ganttProperties), ganttProperties, true);
                this.parent.setRecordValue('baselineWidth', this.calculateBaselineWidth(ganttProperties), ganttProperties, true);
            }
        }
        if (isNullOrUndefined(taskSettings.work)) {
            this.updateWorkWithDuration(ganttData);
        }
        if (!isNullOrUndefined(taskSettings.manual)) {
            this.parent.dataOperation.updateMappingData(ganttData, 'manual');
        }
        this.updateTaskData(ganttData);
        if (predecessors) {
            this.parent.predecessorsCollection.push(ganttData);
        }
        if (!isNullOrUndefined(parentItem)) {
            parentItem.childRecords.push(ganttData);
            if (this.parent.dataSource instanceof Object && isCountRequired(this.parent) &&
             !isNullOrUndefined(this.parent.taskFields.child)) {
                parentItem[this.parent.taskFields.child].push(ganttData.taskData);
            }
        }
        if (this.parent.viewType === 'ProjectView') {
            this.parent.setRecordValue('rowUniqueID', ganttProperties.taskId.toString(), ganttProperties, true);
        } else {
            const uniqueId: string = ganttData.uniqueID.replace(this.parent.element.id + '_data_', '');
            // if (this.parent.viewType === 'ResourceView' && typeof(ganttData.ganttProperties.taskId) === 'string') {
            //     uniqueId = ganttProperties.taskId.toString();
            // }
            this.parent.setRecordValue('rowUniqueID', uniqueId, ganttData);
            this.parent.setRecordValue('rowUniqueID', uniqueId, ganttProperties, true);
            this.parent.setRecordValue('sharedTaskUniqueIds', [], ganttProperties, true);
        }
        if (this.parent.allowUnscheduledTasks && ganttData.ganttProperties.startDate
            && (ganttData.ganttProperties.endDate || ganttData.ganttProperties.duration)) {
            this.parent.setRecordValue('segments', this.setSegmentsInfo(ganttData, true), ganttProperties, true);
            this.parent.dataOperation.updateMappingData(ganttData, 'segments');
            if (!isLoad) {
                this.updateWidthLeft(ganttData);
            }
        }
        this.parent.chartRowsModule.updateSegment(ganttData.ganttProperties.segments, ganttData.ganttProperties.taskId);
        return ganttData;
    }

    private sortSegmentsData(segments: ITaskSegment[], onLoad: boolean, ganttProp: ITaskData): ITaskSegment[] {   // eslint-disable-line
        if (onLoad) {
            segments.sort((a: ITaskSegment, b: ITaskSegment) => {
                const startDate: string = this.parent.taskFields.startDate;
                return this.getDateFromFormat(a[startDate as string]).getTime() - this.getDateFromFormat(b[startDate as string]).getTime();
            });
        } else {
            segments.sort((a: ITaskSegment, b: ITaskSegment) => {
                return a.startDate.getTime() - b.startDate.getTime();
            });
        }
        return segments;
    }
    public setSegmentsInfo(data: IGanttData, onLoad: boolean): ITaskSegment[] {
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        let ganttSegments: ITaskSegment[] = [];
        let segments: ITaskSegment[];
        let sumOfDuration: number = 0;
        let remainingDuration: number = 0;
        const predefinedProperties: string[] = [this.parent.taskFields.duration, this.parent.taskFields.endDate,
            this.parent.taskFields.startDate, this.parent.taskFields.id];
        const taskData: object[] = [];
        if (!isNullOrUndefined(this.parent.taskFields.segments)) {
            segments = onLoad ? data.taskData[this.parent.taskFields.segments] : data.ganttProperties.segments;
            if (!onLoad) {
                if (data.taskData[this.parent.taskFields.segments] && data.taskData[this.parent.taskFields.segments].length > 0) {
                    data.taskData[this.parent.taskFields.segments].forEach((segment: Object) => {
                        const cleanedObject: Object = {};
                        const extraProperties: Object = {};
                        for (const key in segment) {
                            if (predefinedProperties.indexOf(key) !== -1) {
                                cleanedObject[key as string] = segment[key as string];
                            } else {
                                extraProperties[key as string] = segment[key as string];
                            }
                        }
                        this.customSegmentProperties.push(extraProperties);
                    });
                }
            }
            if (!isNullOrUndefined(segments) && segments.length > 1) {
                this.sortSegmentsData(segments, onLoad, data.ganttProperties);
                for (let i: number = 0; i < segments.length; i++) {
                    let segment: ITaskSegment = segments[i as number];
                    let startDate: Date = onLoad ? segment[taskSettings.startDate] : segment.startDate;
                    let endDate: Date = onLoad ? segment[taskSettings.endDate] : segment.endDate;
                    let duration: number = onLoad ? segment[taskSettings.duration] : segment.duration;
                    startDate = this.getDateFromFormat(startDate);
                    startDate = this.checkStartDate(startDate, data.ganttProperties, false);
                    if (!isNullOrUndefined(duration)) {
                        endDate = this.getEndDate(startDate, duration, data.ganttProperties.durationUnit, data.ganttProperties, false);
                        if (taskSettings.duration) {
                            remainingDuration = data.ganttProperties.duration - sumOfDuration;
                            if (remainingDuration <= 0) {
                                continue;
                            }
                            duration = i === segments.length - 1 ? remainingDuration : remainingDuration > 0 &&
                                    duration > remainingDuration ? remainingDuration : duration;
                            endDate = this.getEndDate(startDate, duration, data.ganttProperties.durationUnit, data.ganttProperties, false);
                        } else if (!taskSettings.duration && taskSettings.endDate && endDate) {
                            endDate = (!isNullOrUndefined(data.ganttProperties.endDate)) && endDate.getTime() >=
                            data.ganttProperties.endDate.getTime() && i === segments.length - 1 ? data.ganttProperties.endDate : endDate;
                            duration = this.getDuration(
                                startDate, endDate, data.ganttProperties.durationUnit, data.ganttProperties.isAutoSchedule,
                                data.ganttProperties.isMilestone
                            );
                            if (ganttSegments.length > 0 && endDate.getTime() < startDate.getTime()
                                && endDate.getTime() <= data.ganttProperties.endDate.getTime()) {
                                ganttSegments[i - 1].duration = this.getDuration(
                                    ganttSegments[i - 1].startDate, data.ganttProperties.endDate, data.ganttProperties.durationUnit,
                                    data.ganttProperties.isAutoSchedule, data.ganttProperties.isMilestone);
                                continue;
                            }
                        }
                    }
                    else {
                        endDate = this.getDateFromFormat(endDate);
                        if (endDate && (isNullOrUndefined(duration) || String(duration) === '')) {
                            let dayEndTime: number;
                            if (this.parent.weekWorkingTime.length > 0) {
                                dayEndTime = this.parent['getEndTime'](endDate);
                            }
                            else {
                                dayEndTime = this.parent.defaultEndTime;
                            }
                            if (endDate.getHours() === 0 && dayEndTime !== 86400) {
                                this.setTime(dayEndTime, endDate);
                            }
                        }
                        endDate = this.checkEndDate(endDate, data.ganttProperties, false);
                        duration = this.getDuration(startDate, endDate, data.ganttProperties.durationUnit,
                                                    data.ganttProperties.isAutoSchedule, data.ganttProperties.isMilestone);
                        if (taskSettings.duration) {
                            remainingDuration = data.ganttProperties.duration - sumOfDuration - 1 ;
                            if (remainingDuration <= 0) {
                                continue;
                            }
                            duration = i === segments.length - 1 ? remainingDuration : remainingDuration > 0 &&
                                    duration > remainingDuration ? remainingDuration : duration;
                            endDate = this.getEndDate(startDate, duration, data.ganttProperties.durationUnit, data.ganttProperties, false);
                        } else if (!taskSettings.duration && taskSettings.endDate && endDate) {
                            endDate = (!isNullOrUndefined(data.ganttProperties.endDate)) && endDate.getTime() >=
                            data.ganttProperties.endDate.getTime() && i === segments.length - 1 ? data.ganttProperties.endDate : endDate;
                            duration = this.getDuration(
                                startDate, endDate, data.ganttProperties.durationUnit, data.ganttProperties.isAutoSchedule,
                                data.ganttProperties.isMilestone
                            );
                            if (ganttSegments.length > 0 && endDate.getTime() < startDate.getTime()
                                && endDate.getTime() <= data.ganttProperties.endDate.getTime()) {
                                ganttSegments[i - 1].duration = this.getDuration(
                                    ganttSegments[i - 1].startDate, data.ganttProperties.endDate, data.ganttProperties.durationUnit,
                                    data.ganttProperties.isAutoSchedule, data.ganttProperties.isMilestone);
                                continue;
                            }
                        }
                    }
                    segment = {};
                    if (!(startDate && endDate) || !(startDate && duration)) {
                        break;
                    }
                    sumOfDuration += Number(duration);
                    segment.startDate = startDate;
                    segment.endDate = endDate;
                    segment.duration = Number(duration);
                    segment.width = 0;
                    segment.left = 0;
                    segment.segmentIndex = i;
                    ganttSegments.push(segment);
                    if (!isNullOrUndefined(ganttSegments[i - 1])) {
                        let unit: string;
                        if (!isNullOrUndefined(this.parent.timelineSettings.bottomTier)) {
                            if (this.parent.timelineSettings.bottomTier.unit === 'Minutes') {
                                unit = 'minute';
                            }
                            else if (this.parent.timelineSettings.bottomTier.unit === 'Hour') {
                                unit = 'hour';
                            }
                            else {
                                unit = data.ganttProperties.durationUnit;
                            }
                        }
                        else {
                            unit = data.ganttProperties.durationUnit;
                        }
                        const offsetDuration: number = this.getDuration(
                            ganttSegments[i - 1].endDate, ganttSegments[i as number].startDate, unit,
                            data.ganttProperties.isAutoSchedule, data.ganttProperties.isMilestone);
                        segment.offsetDuration = offsetDuration;
                        if (offsetDuration < 1) {
                            if (this.parent.weekWorkingTime.length === 0) {
                                segment.startDate = this.getEndDate(
                                    ganttSegments[i - 1].endDate, 1, data.ganttProperties.durationUnit, data.ganttProperties, false
                                );
                            }
                            else {
                                const prevSegmentDate: Date = new Date(ganttSegments[i - 1].endDate.getTime());
                                segment.startDate = new Date(prevSegmentDate.setHours(prevSegmentDate.getHours() + 24));
                                if (this.isOnHolidayOrWeekEnd(segment.startDate, true)) {
                                    do {
                                        segment.startDate.setDate(segment.startDate.getDate() + 1);
                                    }
                                    while (this.isOnHolidayOrWeekEnd(segment.startDate, true));
                                }
                                if (!this.parent.includeWeekend) {
                                    segment.startDate = this.getNextWorkingDay(segment.startDate);
                                }
                                const dayEndTime: number = this.parent['getEndTime'](ganttSegments[i - 1].endDate);
                                if (this.getSecondsInDecimal(ganttSegments[i - 1].endDate) === dayEndTime) {
                                    this.setTime(this.parent['getEndTime'](segment.startDate), segment.startDate);
                                }
                            }
                            segment.startDate = this.checkStartDate(segment.startDate, data.ganttProperties, false);
                            segment.endDate = this.getEndDate(
                                segment.startDate, segment.duration, data.ganttProperties.durationUnit, data.ganttProperties, false
                            );
                            segment.endDate = !taskSettings.duration && taskSettings.endDate
                                && segment.endDate > data.ganttProperties.endDate ? data.ganttProperties.endDate : segment.endDate;
                            segment.offsetDuration = 1;
                        }

                    } else {
                        segment.offsetDuration = 0;
                    }
                    taskData.push(this.setSegmentTaskData(segment, segments[i as number]));
                }
                this.parent.setRecordValue('duration', sumOfDuration, data.ganttProperties, true);
                if (!isNullOrUndefined(ganttSegments[ganttSegments.length - 1])) {
                    this.parent.setRecordValue('endDate', ganttSegments[ganttSegments.length - 1].endDate, data.ganttProperties, true);
                }
                if (!isNullOrUndefined(taskSettings.endDate) && !isNullOrUndefined(ganttSegments[ganttSegments.length - 1])) {
                    this.parent.setRecordValue(this.parent.taskFields.endDate, ganttSegments[ganttSegments.length - 1].endDate, data, true);
                }
                if (!onLoad && taskData && taskData.length > 0) {
                    taskData.forEach((task: Object, index: number) => {
                        const mergedObject: Object = Object.assign({}, task, this.customSegmentProperties[index as number]);
                        taskData[index as number] = mergedObject;
                    });
                }
                this.parent.setRecordValue('taskData.' + this.parent.taskFields.segments, taskData, data);
            }
        }
        if (ganttSegments.length > 1) {
            this.parent.setRecordValue('segments', ganttSegments, data.ganttProperties, true);
            this.parent.setRecordValue(this.parent.taskFields.segments, data.taskData[this.parent.taskFields.segments], data, true);
        } else {
            ganttSegments = null;
        }
        return ganttSegments;
    }

    private setSegmentTaskData(segments: ITaskSegment, segmenttaskData: ITaskSegment): ITaskSegment {
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        const taskData: Object = extend({}, {}, segmenttaskData, true);
        if (!isNullOrUndefined(taskSettings.startDate)) {
            taskData[this.parent.taskFields.startDate] = segments.startDate;
        }
        if (!isNullOrUndefined(taskSettings.endDate)) {
            taskData[this.parent.taskFields.endDate] = segments.endDate;
        }
        if (!isNullOrUndefined(taskSettings.duration)) {
            taskData[this.parent.taskFields.duration] = Number(segments.duration);
        }
        return taskData;
    }

    /**
     * Method to calculate work based on resource unit and duration.
     *
     * @param {IGanttData} ganttData .
     * @returns {void} .
     */
    public updateWorkWithDuration(ganttData: IGanttData): void {
        if (this.parent['triggeredColumnName'] === this.parent.taskFields.work && ganttData.ganttProperties.duration !== 0 &&
            (isNullOrUndefined(ganttData.ganttProperties.resourceInfo) || ganttData.ganttProperties.resourceInfo.length !== 0)) {
            return;
        }
        const resources: Object[] = (this.parent.editModule && this.parent.editModule.dialogModule &&
            this.parent.editModule.dialogModule['currentResources']) ? this.parent.editModule.dialogModule['currentResources']
            : ganttData.ganttProperties.resourceInfo;
        let work: number = 0;
        let resourceOneDayWork: number;
        if ((!isNullOrUndefined(resources) && resources.length > 0) && !ganttData.hasChildRecords) {
            const resourcesLength: number = resources.length;
            let index: number;
            let resourceUnit: number;
            let totSeconds: number;
            if (this.parent.weekWorkingTime.length > 0) {
                totSeconds = this.parent['getSecondsPerDay'](ganttData.ganttProperties.startDate ? ganttData.ganttProperties.startDate : ganttData.ganttProperties.endDate);
            }
            else {
                totSeconds = this.parent.secondsPerDay;
            }
            const actualOneDayWork: number = (totSeconds) / 3600;
            const durationInDay: number = this.getDurationInDay(ganttData.ganttProperties.duration, ganttData.ganttProperties.durationUnit);
            for (index = 0; index < resourcesLength; index++) {
                // const resource: any = ganttData.ganttProperties.resourceInfo ? ganttData.ganttProperties.resourceInfo : resources;
                resourceUnit = resources[index as number][this.parent.resourceFields.unit]; //in percentage
                resourceOneDayWork = (resourceUnit > 0 ? (actualOneDayWork * resourceUnit) / 100 : 0);
                work += (resourceOneDayWork * durationInDay);
            }
            //Update work as per defined unit.
            if (ganttData.ganttProperties.workUnit === 'minute') {
                work = work * 60;
            }
            if (ganttData.ganttProperties.workUnit === 'day') {
                work = work / actualOneDayWork;
            }
            //To check the decimal places.
            if (work % 1 !== 0) {
                work = parseFloat(work.toFixed(2));
            }
        }
        else if (!ganttData.hasChildRecords && !isNullOrUndefined(ganttData.ganttProperties.work) &&
                 (!isNullOrUndefined(ganttData.ganttProperties.duration) && ganttData.ganttProperties.duration > 0)) {
            work = ganttData.ganttProperties.work;
        }
        if (ganttData.childRecords) {
            if (ganttData.childRecords.length > 0 && this.parent.isOnEdit) {
                let childCompletedWorks: number = 0;
                for (let i: number = 0; i < ganttData.childRecords.length; i++) {
                    childCompletedWorks += ganttData.childRecords[i as number].ganttProperties.work;
                }
                work += childCompletedWorks;
            }
        }
        if (ganttData.ganttProperties.taskType === 'FixedUnit' && resourceOneDayWork === 0) {
            work = 0;
            this.parent.setRecordValue('duration', 0, ganttData.ganttProperties, true);
            if (!isNullOrUndefined(this.parent.taskFields.duration)) {
                this.parent.setRecordValue(this.parent.taskFields.duration, 0, ganttData, true);
            }
        }
        this.parent.setRecordValue('work', work, ganttData.ganttProperties, true);
        if (!isNullOrUndefined(this.parent.taskFields.work) && !this.parent.isLoad) {
            this.parent.dataOperation.updateMappingData(ganttData, 'work');
        }
    }

    /**
     *
     * @param {IGanttData} parent .
     * @returns {IParent} .
     * @private
     */
    public getCloneParent(parent: IGanttData): IParent {
        if (!isNullOrUndefined(parent)) {
            const cloneParent: IParent = {};
            cloneParent.uniqueID = parent.uniqueID;
            cloneParent.expanded = parent.expanded;
            cloneParent.level = parent.level;
            cloneParent.index = parent.index;
            cloneParent.taskId = parent.ganttProperties.rowUniqueID;
            return cloneParent;
        } else {
            return null;
        }
    }

    /**
     * @returns {void} .
     * @private
     */
    public reUpdateResources(): void {
        if (this.parent.flatData.length > 0) {
            let data: ITaskData;
            let ganttProperties: ITaskData;
            let ganttData: IGanttData;
            for (let index: number = 0; index < this.parent.flatData.length; index++) {
                data = this.parent.flatData[index as number].taskData;
                ganttProperties = this.parent.flatData[index as number].ganttProperties;
                ganttData = this.parent.flatData[index as number];
                this.parent.setRecordValue('resourceInfo', this.setResourceInfo(data), ganttProperties, true);
                this.updateResourceName(ganttData);
            }
        }
    }
    private addTaskData(ganttData: IGanttData, data: Object, isLoad: boolean): void {
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        const dataManager: Object[] | DataManager | Object = this.parent.dataSource;
        if (isLoad) {
            if (taskSettings.parentID || (dataManager instanceof DataManager &&
                dataManager.dataSource.json && dataManager.dataSource.offline)) {
                if (taskSettings.parentID) {
                    const id: string = data[taskSettings.id];
                    const index: number = this.taskIds.indexOf(id.toString());
                    const tempData: object = (index > -1) ? this.dataArray[index as number] : {};
                    if (!isNullOrUndefined(this.parent.taskFields.segmentId)) {
                        const segmentDataCollection: Object[] = this.segmentCollection.
                            filter((x: Group) => x.key === tempData[this.parent.taskFields.id]);
                        if (segmentDataCollection.length > 0) {
                            tempData[this.parent.taskFields.segments] = (segmentDataCollection as Group)[0].items;
                        }
                    }
                    this.parent.setRecordValue('taskData', tempData, ganttData);
                } else {
                    this.parent.setRecordValue('taskData', data, ganttData);
                }
            } else {
                this.parent.setRecordValue('taskData', data, ganttData);
            }
        } else {
            this.parent.setRecordValue('taskData', data, ganttData);
        }
    }

    private updateExpandStateMappingValue(ganttData: IGanttData, data: Object): void {
        const expandStateMapping: string = this.parent.taskFields.expandState;
        const mappingValue: string = data[expandStateMapping as string];
        let updatableValue: boolean;
        if (expandStateMapping && ganttData.hasChildRecords) {
            if (!isNullOrUndefined(mappingValue)) {
                updatableValue = mappingValue.toString() === 'true' ? true : false;
            } else if (isNullOrUndefined(mappingValue) && !this.parent.collapseAllParentTasks) {
                updatableValue = true;
            } else if (isNullOrUndefined(mappingValue) && this.parent.collapseAllParentTasks) {
                updatableValue = false;
            }
            this.parent.setRecordValue('taskData.' + expandStateMapping, updatableValue, ganttData);
            this.parent.setRecordValue(expandStateMapping, updatableValue, ganttData);
            this.parent.setRecordValue('expanded', updatableValue, ganttData);
        }
    }
    /**
     * @param {IGanttData} ganttData .
     * @param {object} data .
     * @returns {void} .
     */
    private setValidatedDates(ganttData: IGanttData, data: Object): void {
        const ganttProperties: ITaskData = ganttData.ganttProperties;
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        let duration: string = data[taskSettings.duration];
        const startDate: Date = this.getDateFromFormat(data[taskSettings.startDate], true);
        const endDate: Date = this.getDateFromFormat(data[taskSettings.endDate], true);
        duration = isNullOrUndefined(duration) || duration === '' ? null : duration;
        this.parent.setRecordValue('startDate', new Date(startDate.getTime()), ganttProperties, true);
        if (!isNullOrUndefined(duration) && duration !== '') {
            this.updateDurationValue(duration, ganttProperties);
        } else {
            this.calculateDuration(ganttData);
        }
        this.parent.setRecordValue('endDate', new Date((endDate.getTime())), ganttProperties, true);
    }
    /**
     *
     * @param {IGanttData} ganttData .
     * @param {object} data .
     * @param {boolean} isLoad .
     * @returns {void} .
     * @private
     */
    public calculateScheduledValues(ganttData: IGanttData, data: Object, isLoad: boolean): void {
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        const ganttProperties: ITaskData = ganttData.ganttProperties;
        let duration: string = data[taskSettings.duration];
        duration = isNullOrUndefined(duration) || duration === '' ? null : duration;
        let startDate: Date;
        let endDate: Date;
        if (ganttProperties.startDate && ganttProperties.endDate) {
            startDate = this.getDateFromFormat(ganttProperties.startDate, true);
            endDate = this.getDateFromFormat(ganttProperties.endDate, true);
        } else {
            startDate = this.getDateFromFormat(data[taskSettings.startDate], true);
            endDate = this.getDateFromFormat(data[taskSettings.endDate], true);
        }
        const segments: ITaskSegment[] = taskSettings.segments ? (data[taskSettings.segments] ||
            ganttData.taskData[taskSettings.segments]) : null;
        const isMileStone: boolean = taskSettings.milestone ? data[taskSettings.milestone] ? true : false : false;
        const durationMapping: string = data[taskSettings.durationUnit] ? data[taskSettings.durationUnit] : '';
        this.parent.setRecordValue('durationUnit', this.validateDurationUnitMapping(durationMapping), ganttProperties, true);
        const work: number = !isNullOrUndefined(data[taskSettings.work]) ? parseFloat(data[taskSettings.work]) : 0;
        this.parent.setRecordValue('workUnit', this.validateWorkUnitMapping(this.parent.workUnit), ganttProperties, true);
        const taskTypeMapping: string = data[taskSettings.type] ? data[taskSettings.type] : '';
        const tType: string = this.validateTaskTypeMapping(taskTypeMapping);
        this.parent.setRecordValue('taskType', tType, ganttProperties, true);
        const isUnassignedTask: boolean = data[this.parent.resourceFields.name] === this.parent.localeObj.getConstant('unassignedTask');
        if (isUnassignedTask) {
            this.parent.setRecordValue('taskType', 'FixedDuration', ganttProperties, true);
        }
        if (isLoad && !this.parent.enableValidation && startDate && endDate) {
            this.setValidatedDates(ganttData, data);
        } else {
            if (!endDate && !startDate && (isNullOrUndefined(duration) || duration === '')) {
                if (this.parent.allowUnscheduledTasks) {
                    return;
                } else {
                    this.parent.setRecordValue('duration', 1, ganttProperties, true);
                    this.parent.setRecordValue('startDate', this.getProjectStartDate(ganttProperties, isLoad), ganttProperties, true);
                    this.calculateEndDate(ganttData);
                }
            } else if (startDate) {
                this.calculateDateFromStartDate(startDate, endDate, duration, ganttData, isLoad);

            } else if (endDate) {
                this.calculateDateFromEndDate(endDate, duration, ganttData);

            } else if (!isNullOrUndefined(duration) && duration !== '') {
                this.updateDurationValue(duration, ganttProperties);
                if (this.parent.allowUnscheduledTasks) {
                    this.parent.setRecordValue('startDate', null, ganttProperties, true);
                    this.parent.setRecordValue('endDate', null, ganttProperties, true);
                } else {
                    this.parent.setRecordValue('startDate', this.getProjectStartDate(ganttProperties, isLoad), ganttProperties, true);
                    this.calculateEndDate(ganttData);
                }
            }
        }
        if (!this.parent.autoCalculateDateScheduling || (this.parent.isLoad && this.parent.treeGrid.loadChildOnDemand &&
            this.parent.taskFields.hasChildMapping)) {
            if (!isNullOrUndefined(ganttData.ganttProperties.startDate)) {
                ganttData[this.parent.taskFields.startDate] = ganttData.ganttProperties.startDate;
                ganttData.taskData[this.parent.taskFields.startDate] = ganttData.ganttProperties.startDate;
            }
            if (!isNullOrUndefined(ganttData.ganttProperties.endDate)) {
                ganttData[this.parent.taskFields.endDate] = ganttData.ganttProperties.endDate;
                ganttData.taskData[this.parent.taskFields.endDate] = ganttData.ganttProperties.endDate;
            }
        }
        if (!isNullOrUndefined(segments)) {
            this.parent.setRecordValue('segments', this.setSegmentsInfo(ganttData, true), ganttProperties, true);
        }
        if (ganttProperties.duration === 0) {
            this.parent.setRecordValue('isMilestone', true, ganttProperties, true);
            if (!isNullOrUndefined(this.parent.taskFields) && !isNullOrUndefined(this.parent.taskFields.milestone)) {
                this.parent.setRecordValue(this.parent.taskFields.milestone, true, ganttData, true);
            }
            this.parent.setRecordValue('endDate', ganttProperties.startDate, ganttProperties, true);
        }
        if (!isNullOrUndefined(isMileStone) && isMileStone) {
            this.parent.setRecordValue('duration', 0, ganttProperties, true);
            this.parent.setRecordValue('isMilestone', true, ganttProperties, true);
            if (!isNullOrUndefined(this.parent.taskFields) && !isNullOrUndefined(this.parent.taskFields.milestone)) {
                this.parent.setRecordValue(this.parent.taskFields.milestone, true, ganttData, true);
            }
            this.parent.setRecordValue('endDate', ganttProperties.startDate, ganttProperties, true);
        }
        if (!isNullOrUndefined(taskSettings.work)) {
            this.parent.setRecordValue('durationUnit', this.parent.durationUnit, ganttProperties, true);
            if (isNaN(work) || isNullOrUndefined(work)) {
                this.parent.setRecordValue('work', 0, ganttProperties, true);
                this.parent.setRecordValue('duration', 0, ganttProperties, true);
                this.parent.setRecordValue('isMilestone', true, ganttProperties, true);
                if (!isNullOrUndefined(this.parent.taskFields) && !isNullOrUndefined(this.parent.taskFields.milestone)) {
                    this.parent.setRecordValue(this.parent.taskFields.milestone, true, ganttData, true);
                }
                this.parent.setRecordValue('endDate', ganttProperties.startDate, ganttProperties, true);
            } else {
                this.parent.setRecordValue('work', work, ganttProperties, true);
                switch (tType) {
                case 'FixedDuration':
                    // To validate the work column as well,when initial dataset have 0 duration
                    if ((!isNullOrUndefined(ganttData[this.parent.taskFields.resourceInfo]) &&
                                            !isNullOrUndefined(ganttData.ganttProperties.resourceInfo) &&
                                                               ganttData.ganttProperties.resourceInfo.length !== 0) ||
                                                                    ganttProperties.duration === 0) {
                        this.updateWorkWithDuration(ganttData);
                    }
                    break;
                case 'FixedWork':
                    if ((!isNullOrUndefined(ganttData[this.parent.taskFields.resourceInfo]) &&
                                            !isNullOrUndefined(ganttData.ganttProperties.resourceInfo) &&
                                                               ganttData.ganttProperties.resourceInfo.length !== 0) ||
                                                                    ganttProperties.work === 0) {
                        this.updateDurationWithWork(ganttData);
                    }
                    break;
                case 'FixedUnit':
                    if (!ganttData.hasChildRecords) {
                        this.updateDurationWithWork(ganttData);
                    }
                    break;
                }
                if (!isNullOrUndefined(taskSettings.type)) {
                    this.parent.dataOperation.updateMappingData(ganttData, 'type');
                }
                if (ganttProperties.duration === 0) {
                    this.parent.setRecordValue('isMilestone', true, ganttProperties, true);
                    if (!isNullOrUndefined(this.parent.taskFields) && !isNullOrUndefined(this.parent.taskFields.milestone)) {
                        this.parent.setRecordValue(this.parent.taskFields.milestone, true, ganttData, true);
                    }
                    this.parent.setRecordValue('endDate', ganttProperties.startDate, ganttProperties, true);
                } else if (!isNullOrUndefined(ganttProperties.startDate) && !isNullOrUndefined(ganttProperties.duration)) {
                    this.parent.setRecordValue('isMilestone', false, ganttProperties, true);
                    if (!isNullOrUndefined(this.parent.taskFields) && !isNullOrUndefined(this.parent.taskFields.milestone)) {
                        this.parent.setRecordValue(this.parent.taskFields.milestone, false, ganttData, true);
                    }
                    this.calculateEndDate(ganttData);
                }
            }
            this.parent.dataOperation.updateMappingData(ganttData, 'work');
        } else if (taskSettings.type && ganttProperties.taskType) {
            this.parent.dataOperation.updateMappingData(ganttData, 'type');
        }
    }
    /**
     * Method to update duration with work value.
     *
     * @param {IGanttData} ganttData .
     * @returns {void} .
     */
    public updateDurationWithWork(ganttData: IGanttData): void {
        const ganttProperties: ITaskData = ganttData.ganttProperties;
        const resources: Object[] = (this.parent.editModule && this.parent.editModule.dialogModule &&
            this.parent.editModule.dialogModule['currentResources']) ? this.parent.editModule.dialogModule['currentResources']
            : ganttProperties.resourceInfo;
        if (!isNullOrUndefined(resources) && resources.length > 0) {
            const resourcesLength: number = !isNullOrUndefined(resources) ? resources.length : 0;
            let totalResourceOneDayWork: number = 0;
            let totSeconds: number;
            if (this.parent.weekWorkingTime.length > 0) {
                totSeconds = this.parent['getSecondsPerDay'](ganttData.ganttProperties.startDate ? ganttData.ganttProperties.startDate : ganttData.ganttProperties.endDate);
            }
            else {
                totSeconds = this.parent.secondsPerDay;
            }
            const actualOneDayWork: number = (totSeconds) / 3600;
            let updatedDuration: number = 0;
            let resourceUnit: number;
            let index: number;
            for (index = 0; index < resourcesLength; index++) {
                resourceUnit = resources[index as number][this.parent.resourceFields.unit]; //in percentage
                totalResourceOneDayWork += (resourceUnit > 0 ? (actualOneDayWork * resourceUnit) / 100 : (ganttData.ganttProperties.taskType !== 'FixedUnit' ? ((ganttProperties.taskType !== 'FixedWork' && ganttProperties.duration !== 0) ? actualOneDayWork : 0) : 0)); //in hours
            }
            const totalHours: number = this.getWorkInHour(ganttProperties.work, ganttProperties.workUnit);
            if (resourcesLength > 0 && totalResourceOneDayWork > 0) {
                updatedDuration += (totalHours / totalResourceOneDayWork);
            }
            if (ganttProperties.taskType === 'FixedUnit' && totalResourceOneDayWork === 0) {
                this.parent.setRecordValue('work', 0, ganttProperties, true);
                this.parent.setRecordValue(this.parent.taskFields.work, 0, ganttData, true);
            }
            //Update duration as per defined unit.
            if (ganttProperties.durationUnit === 'minute') {
                updatedDuration = updatedDuration * actualOneDayWork * 60;
            }
            if (ganttProperties.durationUnit === 'hour') {
                updatedDuration = updatedDuration * actualOneDayWork;
            }
            //To check the decimal places.
            if (updatedDuration % 1 !== 0) {
                updatedDuration = parseFloat(updatedDuration.toFixed(2));
            }
            if (!isNullOrUndefined(ganttProperties.duration)) {
                this.parent.setRecordValue('duration', updatedDuration, ganttProperties, true);
            }
            this.parent.dataOperation.updateMappingData(ganttData, 'duration');
        }
    }
    /**
     * Update units of resources with respect to duration and work of a task.
     *
     * @param {IGanttData} ganttData .
     * @returns {void} .
     */
    public updateUnitWithWork(ganttData: IGanttData): void {
        const ganttProperties: ITaskData = ganttData.ganttProperties;
        let resources: Object[] = (!this.parent.isLoad && !isNullOrUndefined(this.parent.editModule) && !isNullOrUndefined(this.parent.editModule.dialogModule) && !this.parent.editModule.dialogModule['isEdit'] &&
            (!isNullOrUndefined(this.parent.editModule.cellEditModule) && !this.parent.editModule.cellEditModule.isCellEdit))
            ? this.parent.editModule.dialogModule.ganttResources : ganttProperties.resourceInfo;
        if (this.parent.editModule && this.parent.editModule.taskbarEditModule &&
            (this.parent.editModule.taskbarEditModule.taskBarEditAction === 'LeftResizing' || this.parent.editModule.taskbarEditModule.taskBarEditAction === 'RightResizing')) {
            resources = ganttData.ganttProperties.resourceInfo;
        }
        const resourcesLength: number = !isNullOrUndefined(resources) ? resources.length : 0;
        let totSeconds: number;
        if (this.parent.weekWorkingTime.length > 0) {
            totSeconds = this.parent['getSecondsPerDay'](ganttData.ganttProperties.startDate ? ganttData.ganttProperties.startDate : ganttData.ganttProperties.endDate);
        }
        else {
            totSeconds = this.parent.secondsPerDay;
        }
        const actualOneDayWork: number = (totSeconds) / 3600;
        if (resourcesLength === 0) {
            return;
        }
        const durationInDay: number = this.getDurationInDay(ganttData.ganttProperties.duration, ganttData.ganttProperties.durationUnit);
        const totalHours: number = this.getWorkInHour(ganttProperties.work, ganttProperties.workUnit);
        const totalUnitInPercentage: number = durationInDay > 0 ? (totalHours / (durationInDay * actualOneDayWork)) * 100 : 0;
        let individualUnit: number = totalUnitInPercentage === 0 ? 0 : totalUnitInPercentage > 0 ?
            totalUnitInPercentage / resourcesLength : 100;
        //To check the decimal places.
        if (individualUnit % 1 !== 0) {
            individualUnit = parseFloat(individualUnit.toFixed(2));
        }
        for (let index: number = 0; index < resourcesLength; index++) {
            resources[index as number][this.parent.resourceFields.unit] = individualUnit;
            if (!this.parent.isLoad && !isNullOrUndefined(this.parent.editModule) &&
                !isNullOrUndefined(this.parent.editModule.dialogModule) &&
                !this.parent.editModule.dialogModule['isEdit'] &&
                (!isNullOrUndefined(this.parent.editModule.cellEditModule) && !this.parent.editModule.cellEditModule.isCellEdit)) {
                if (ganttProperties.resourceInfo) {
                    ganttProperties.resourceInfo[index as number][this.parent.resourceFields.unit] = individualUnit;
                }
            }
            if (this.parent.editModule && this.parent.editModule.dialogModule &&
                !isNullOrUndefined(this.parent.editModule.dialogModule.ganttResources[index as number])) {
                this.parent.editModule.dialogModule.ganttResources[index as number][this.parent.resourceFields.unit] = individualUnit;
            }
        }
        //To update the unit value in data source
        this.updateResourceName(ganttData);
    }
    private calculateDateFromEndDate(endDate: Date, duration: string, ganttData: IGanttData): void {
        const ganttProperties: ITaskData = ganttData.ganttProperties;
        let dayEndTime: number;
        if (this.parent.weekWorkingTime.length > 0) {
            dayEndTime = this.parent['getEndTime'](endDate);
        }
        else {
            dayEndTime = this.parent.defaultEndTime;
        }
        if (endDate.getHours() === 0 && dayEndTime !== 86400) {
            this.setTime(dayEndTime, endDate);
        }
        const validateAsMilestone: boolean = (parseInt(duration, 10) === 0) ? true : null;
        this.parent.setRecordValue('endDate', this.checkEndDate(endDate, ganttData.ganttProperties, validateAsMilestone), ganttProperties, true);
        if (isNullOrUndefined(duration) || duration === '') {
            if (this.parent.allowUnscheduledTasks) {
                this.parent.setRecordValue('startDate', null, ganttProperties, true);
                this.parent.setRecordValue('duration', null, ganttProperties, true);
            } else {
                this.parent.setRecordValue('duration', 1, ganttProperties, true);
                this.parent.setRecordValue(
                    'startDate',
                    this.getStartDate(ganttProperties.endDate, ganttProperties.duration, ganttProperties.durationUnit, ganttProperties),
                    ganttProperties,
                    true);
            }
        } else if (!isNullOrUndefined(duration) && duration !== '') {
            this.updateDurationValue(duration, ganttProperties);
            this.parent.setRecordValue(
                'startDate',
                this.getStartDate(ganttProperties.endDate, ganttProperties.duration, ganttProperties.durationUnit, ganttProperties),
                ganttProperties,
                true);
        }
    }
    private calculateDateFromStartDate(startDate: Date, endDate: Date, duration: string, ganttData: IGanttData, isLoad: boolean): void {
        const ganttProperties: ITaskData = ganttData.ganttProperties;
        const validateAsMilestone: boolean = (parseInt(duration, 10) === 0 || ((startDate && endDate) &&
            (new Date(startDate.getTime()) === new Date(endDate.getTime())))) ? true : null;
        this.parent.setRecordValue('startDate', this.checkStartDate(startDate, ganttProperties, validateAsMilestone, isLoad), ganttProperties, true);
        if (this.parent.isTreeGridRendered && ganttData) {
            this.updateTaskData(ganttData);
        }
        if (!endDate && (isNullOrUndefined(duration) || duration === '')) {
            if (this.parent.allowUnscheduledTasks) {
                this.parent.setRecordValue('endDate', null, ganttProperties, true);
                this.parent.setRecordValue('duration', null, ganttProperties, true);
            } else {
                this.parent.setRecordValue('duration', 1, ganttProperties, true);
                this.calculateEndDate(ganttData);
            }
        } else if (!isNullOrUndefined(duration) && !endDate) {
            this.updateDurationValue(duration, ganttProperties);
            this.calculateEndDate(ganttData);
        } else if (endDate && (isNullOrUndefined(duration) || duration === '')) {
            let dayEndTime: number;
            if (this.parent.weekWorkingTime.length > 0) {
                dayEndTime = this.parent['getEndTime'](endDate);
            }
            else {
                dayEndTime = this.parent.defaultEndTime;
            }
            if (endDate.getHours() === 0 && dayEndTime !== 86400) {
                this.setTime(dayEndTime, endDate);
            }
            this.parent.setRecordValue('endDate', this.checkEndDate(endDate, ganttData.ganttProperties), ganttProperties, true);
            if (this.compareDates(ganttProperties.startDate, ganttProperties.endDate) === 1) {
                this.parent.setRecordValue('endDate', ganttProperties.startDate, ganttProperties, true);
                this.parent.setRecordValue('isMilestone', true, ganttProperties, true);
                this.parent.setRecordValue('duration', 0, ganttProperties, true);
            } else {
                this.calculateDuration(ganttData);
            }
        } else {
            this.updateDurationValue(duration, ganttProperties);
            if (this.parent.autoCalculateDateScheduling && !(this.parent.isLoad && this.parent.treeGrid.loadChildOnDemand &&
                this.parent.taskFields.hasChildMapping)) {
                this.calculateEndDate(ganttData);
            }
            else {
                this.parent.setRecordValue('endDate', endDate, ganttProperties, true);
            }
        }
    }
    /**
     *
     * @param {number} parentWidth .
     * @param {number} percent .
     * @returns {number} .
     * @private
     */
    public getProgressWidth(parentWidth: number, percent: number): number {
        return (parentWidth * percent) / 100;
    }
    /**
     *
     * @param {IGanttData} ganttData .
     * @param {boolean} isAuto .
     * @returns {number} .
     * @private
     */
    public calculateWidth(ganttData: IGanttData, isAuto?: boolean): number {
        const ganttProp: ITaskData = ganttData.ganttProperties;
        let sDate: Date = isAuto ? ganttProp.autoStartDate : ganttProp.startDate;
        let eDate: Date = isAuto ? ganttProp.autoEndDate : ganttProp.endDate;
        const unscheduledTaskWidth: number = 3;
        if (isNullOrUndefined(sDate) && isNullOrUndefined(eDate)) {
            sDate = this.getValidStartDate(ganttProp, isAuto);
            eDate = this.getValidEndDate(ganttProp, isAuto);
        }
        if (isNullOrUndefined(sDate) || isNullOrUndefined(eDate)) {
            return unscheduledTaskWidth;
        } else if (ganttProp.isMilestone && (!ganttData.hasChildRecords || ganttProp.isAutoSchedule)) {
            //let taskBarHeight: number = this.getTaskbarHeight();
            return 0;
        } else {
            return this.getTaskWidth(sDate, eDate, ganttProp);
        }
    }

    private getTaskbarHeight(): number {
        const rowHeight: number = this.parent.rowHeight;
        const taskBarHeight: number = this.parent.taskbarHeight;
        if (taskBarHeight < rowHeight) {
            return taskBarHeight;
        } else {
            return rowHeight;
        }
    }
    /**
     * Method to calculate left
     *
     * @param {ITaskData} ganttProp .
     * @param {boolean} isAuto .
     * @returns {number} .
     * @private
     */
    public calculateLeft(ganttProp: ITaskData, isAuto?: boolean): number {
        let sDate: Date = null; let left: number = -300;
        let startDate: Date = isAuto ? ganttProp.autoStartDate : ganttProp.startDate;
        const endDate: Date = isAuto ? ganttProp.autoEndDate : ganttProp.endDate;
        const duration: number = isAuto ? ganttProp.autoDuration : ganttProp.duration;   // eslint-disable-line
        let milestone: boolean = ganttProp.isMilestone;
        const ganttRecord: IGanttData = this.parent.getTaskByUniqueID(ganttProp.uniqueID);
        if (ganttRecord && this.parent.allowUnscheduledTasks && isNullOrUndefined(startDate) && isNullOrUndefined(endDate)
            && !isNullOrUndefined(duration) && !ganttRecord.hasChildRecords && ganttRecord.parentItem &&
            (this.parent.taskMode === 'Manual' || (this.parent.taskMode === 'Custom' && ganttRecord[this.parent.taskFields.manual]))) {
            const parentRec: IGanttData = this.parent.getParentTask(ganttRecord.parentItem);
            if (parentRec.ganttProperties.startDate) {
                startDate = parentRec.ganttProperties.startDate;
            }
        }
        if (startDate) {
            sDate = new Date(startDate.getTime());
        } else if (endDate) {
            sDate = new Date(endDate.getTime());
            milestone = isNullOrUndefined(startDate) && this.parent.allowUnscheduledTasks ? false : true;
        } else {
            sDate = this.getValidStartDate(ganttProp);
        }
        if (!isNullOrUndefined(sDate)) {
            left = this.getTaskLeft(sDate, milestone);
        }
        return left;
    }
    /**
     * calculate the left position of the auto scheduled taskbar
     *
     * @param {ITaskData} ganttProperties - Defines the gantt data.
     * @returns {number} .
     * @private
     */
    public calculateAutoLeft(ganttProperties: ITaskData): number {
        return this.getTaskLeft(ganttProperties.autoStartDate, ganttProperties.isMilestone);
    }
    /**
     * To calculate duration of Gantt record with auto scheduled start date and auto scheduled end date
     *
     * @param {ITaskData} ganttProperties - Defines the gantt data.
     * @returns {number} .
     */
    public calculateAutoDuration(ganttProperties: ITaskData): number {
        return this.getDuration(
            ganttProperties.autoStartDate, ganttProperties.autoEndDate, ganttProperties.durationUnit,
            false, ganttProperties.isMilestone);
    }
    /**
     * calculate the with between auto scheduled start date and auto scheduled end date
     *
     * @param {ITaskData} ganttProperties - Defines the gantt data.
     * @returns {number} .
     * @private
     */
    public calculateAutoWidth(ganttProperties: ITaskData): number {
        return this.getTaskWidth(ganttProperties.autoStartDate, ganttProperties.autoEndDate);
    }
    /**
     * calculate the left margin of the baseline element
     *
     * @param {ITaskData} ganttProperties .
     * @returns {number} .
     * @private
     */
    public calculateBaselineLeft(ganttProperties: ITaskData): number {
        const baselineStartDate: Date = this.getDateFromFormat(ganttProperties.baselineStartDate);
        const baselineEndDate: Date = this.getDateFromFormat(ganttProperties.baselineEndDate);
        if (baselineStartDate && baselineEndDate) {
            return (this.getTaskLeft(baselineStartDate, ganttProperties.isMilestone));
        } else {
            return 0;
        }
    }
    /**
     * calculate the width between baseline start date and baseline end date.
     *
     * @param {ITaskData} ganttProperties .
     * @returns {number} .
     * @private
     */
    public calculateBaselineWidth(ganttProperties: ITaskData): number {
        const baselineStartDate: Date = this.getDateFromFormat(ganttProperties.baselineStartDate);
        const baselineEndDate: Date = this.getDateFromFormat(ganttProperties.baselineEndDate);
        if (baselineStartDate && baselineEndDate && (baselineStartDate.getTime() !== baselineEndDate.getTime())) {
            this.isBaseline = true;
            return (this.getTaskWidth(baselineStartDate, baselineEndDate));
        } else {
            return 0;
        }
    }
    /**
     * To get tasks width value
     *
     * @param {Date} startDate .
     * @param {Date} endDate .
     * @param {ITaskData} [ganttData] .
     * @returns {number} .
     * @private
     */
    public getTaskWidth(startDate: Date, endDate: Date, ganttData?: ITaskData): number {
        const sDate: Date = new Date(startDate.getTime()); const eDate: Date = new Date(endDate.getTime());
        let tierMode: string = this.parent.timelineModule.customTimelineSettings.bottomTier.unit !== 'None' ? this.parent.timelineModule.customTimelineSettings.bottomTier.unit :
            this.parent.timelineModule.customTimelineSettings.topTier.unit;
        const zoomOrTimeline: Object = this.parent.timelineModule.customTimelineSettings;
        let countValue: number = zoomOrTimeline['bottomTier'] !== null ? zoomOrTimeline['bottomTier'].count :
            zoomOrTimeline['topTier'].count;
        let isValid: boolean = false;
        let modifiedsDate: Date = new Date(startDate.getTime());
        let hour: number = 0;
        if (!isNullOrUndefined(ganttData) && ganttData.durationUnit === 'hour') {
            modifiedsDate = new Date(modifiedsDate.getTime() + ganttData.duration * 60 * 60 * 1000);
        }
        if (!isNullOrUndefined(ganttData) && (ganttData.durationUnit === 'minute') || !isNullOrUndefined(ganttData) && ganttData.durationUnit === 'day' && ganttData.duration < 1) {
            modifiedsDate = new Date(modifiedsDate.getTime() + ganttData.duration * 60 * 1000);
        }
        if (this.isBaseline && tierMode === 'Day') {
            const duration: number = this.getDuration(sDate, eDate, 'day', true, false);
            this.isBaseline = false;
            if (duration > 0 && duration < 1) {
                return (duration * this.parent.perDayWidth);
            }
        }
        if (this.parent.weekWorkingTime.length > 0) {
            let date: Date = new Date(startDate.getTime());
            for (let count: number = startDate.getDate(); count <= endDate.getDate(); count++) {
                const day: number = date.getDay();
                let currentDay: string;
                const weekWorkingTime: WeekWorkingTimeModel[] = this.parent.weekWorkingTime;
                switch (day) {
                case 0:
                    currentDay = 'Sunday';
                    break;
                case 1:
                    currentDay = 'Monday';
                    break;
                case 2:
                    currentDay = 'Tuesday';
                    break;
                case 3:
                    currentDay = 'Wednesday';
                    break;
                case 4:
                    currentDay = 'Thursday';
                    break;
                case 5:
                    currentDay = 'Friday';
                    break;
                case 6:
                    currentDay = 'Saturday';
                    break;
                default:
                    currentDay = '';
                }
                let isValid: boolean = true;
                for (let i: number = 0; i < weekWorkingTime.length; i++) {
                    if (weekWorkingTime[i as number][currentDay as string]
                        && weekWorkingTime[i as number][currentDay as string].length > 0) {
                        isValid = false;
                        for (let j: number = 0; j < weekWorkingTime[i as number][currentDay as string].length; j++) {
                            hour = hour + weekWorkingTime[i as number][currentDay as string][j as number].to
                            - weekWorkingTime[i as number][currentDay as string][j as number].from;
                        }
                    }
                }
                if (isValid) {
                    for (let k: number = 0; k < this.parent.dayWorkingTime.length; k++) {
                        hour = hour + this.parent.dayWorkingTime[k as number].to - this.parent.dayWorkingTime[k as number].from;
                    }
                }
                date = new Date(date.setDate(date.getDate() + 1));
                if (!this.parent.includeWeekend) {
                    date = this.parent.dataOperation.getNextWorkingDay(date);
                }
            }
        }
        else {
            for (let i: number = 0; i < this.parent.dayWorkingTime.length; i++) {
                hour = hour + this.parent.dayWorkingTime[i as number].to - this.parent.dayWorkingTime[i as number].from;
            }
        }
        const dateDiff: number = modifiedsDate.getTime() - sDate.getTime();
        let dayStartTime: number;
        let dayEndTime: number;
        if (!isNullOrUndefined(ganttData) && (ganttData.durationUnit === 'minute' && ganttData.duration < (hour * 60)) || !isNullOrUndefined(ganttData) && ganttData.durationUnit === 'day' &&
        !isNullOrUndefined(ganttData.duration) && /^\d+\.\d+$/.test(ganttData.duration.toString())) {
            if (tierMode === 'Day') {
                if (this.parent.weekWorkingTime.length > 0) {
                    dayStartTime = this.parent['getStartTime'](sDate);
                    dayEndTime = this.parent['getEndTime'](eDate);
                }
                else {
                    dayStartTime = this.parent.defaultStartTime;
                    dayEndTime = this.parent.defaultEndTime;
                }
                if ((Math.floor((dateDiff / (1000 * 60 * 60)) % 24) >= hour || dateDiff === 0)) {
                    isValid = true;
                }
                if (this.getSecondsInDecimal(sDate) === dayStartTime && isValid) {
                    sDate.setHours(0, 0, 0, 0);
                }
                if (this.getSecondsInDecimal(eDate) === dayEndTime && isValid) {
                    eDate.setHours(24);
                }
                if (this.getSecondsInDecimal(eDate) === dayStartTime) {
                    eDate.setHours(0, 0, 0, 0);
                }
            }
            else {
                isValid = true;
            }
            if ((sDate).getTime() === (eDate).getTime()) {
                return (this.parent.perDayWidth);
            }
            else {
                if (isValid) {
                    if (this.parent.taskFields.duration && ganttData.durationUnit === 'day' && /^\d+\.\d+$/.test(ganttData.duration.toString()) && this.parent.timelineModule.bottomTier === 'Day'
                        && isNullOrUndefined(ganttData.segments)) {
                        const holidaysCount: number = this.parent.holidays && this.parent.holidays.length > 0
                            ? this.getHolidaysCount(sDate, eDate)
                            : 0;
                        const weekendCount: number = !this.parent.includeWeekend ? this.getWeekendCount(sDate, eDate) : 0;
                        return ((holidaysCount + weekendCount + ganttData.duration) * this.parent.perDayWidth);
                    }
                    else {
                        return ((this.getTimeDifference(sDate, eDate, true) / (1000 * 60 * 60 * 24)) * this.parent.perDayWidth);
                    }
                }
                else {
                    if (ganttData.durationUnit === 'day' && ganttData.duration < 1) {
                        return (ganttData.duration * this.parent.perDayWidth);
                    }
                    else {
                        return ((this.getTimeDifference(sDate, eDate) / (1000 * 60 * 60 * hour)) * this.parent.perDayWidth);
                    }
                }
            }
        }
        else{
            if (tierMode === 'Day') {
                if (this.parent.weekWorkingTime.length > 0) {
                    dayStartTime = this.parent['getStartTime'](sDate);
                    dayEndTime = this.parent['getEndTime'](eDate);
                }
                else {
                    dayStartTime = this.parent.defaultStartTime;
                    dayEndTime = this.parent.defaultEndTime;
                }
                if (this.getSecondsInDecimal(sDate) === dayStartTime) {
                    sDate.setHours(0, 0, 0, 0);
                }
                if (this.getSecondsInDecimal(eDate) === dayEndTime) {
                    eDate.setHours(24);
                    eDate.setHours(0, 0, 0, 0);
                }
                if (this.getSecondsInDecimal(eDate) === dayStartTime) {
                    eDate.setHours(0, 0, 0, 0);
                }
            }
            if ((sDate).getTime() === (eDate).getTime()) {
                return (this.parent.perDayWidth);
            }
            else {
                if (this.parent.isInDst(sDate) || this.parent.isInDst(eDate)) {
                    const timeDifference: number = this.getTimeDifference(sDate, eDate, true);
                    let totalWidth: number = (timeDifference / (1000 * 60 * 60 * 24)) * this.parent.perDayWidth;
                    const sOffset: number = sDate.getTimezoneOffset();
                    const eOffset: number = eDate.getTimezoneOffset();
                    const topTier: Object = this.parent.timelineModule.customTimelineSettings.topTier;
                    if (topTier && topTier['unit'] === 'Hour' && topTier['count'] === 1) {
                        tierMode = topTier['unit'];
                        countValue = topTier['count'];
                    }
                    const unitHour: boolean = ((tierMode === 'Hour' && countValue === 1) || (tierMode === 'Minutes' && countValue === 60));
                    if (unitHour && sOffset !== eOffset && sOffset > eOffset) {
                        totalWidth = totalWidth - (this.parent.perDayWidth / 24);
                    }
                    return totalWidth;
                }
                else {
                    return ((this.getTimeDifference(sDate, eDate)  / (1000 * 60 * 60 * 24)) * this.parent.perDayWidth);
                }
            }
        }
    }
    public getDSTTransitions(year: number, timeZone: string): { dstStart: Date, dstEnd: Date } {
        function findLastSunday(year: number, month: number): Date {
            const lastDayOfMonth: Date = new Date(Date.UTC(year, month + 1, 0)); // Last day of the month
            const lastSunday: Date = new Date(Date.UTC(year, month, lastDayOfMonth.getUTCDate() - lastDayOfMonth.getUTCDay()));
            return lastSunday;
        }
        function convertToTimezone(date: Date, timeZone: string): Date {
            const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('en-US', {
                timeZone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            const formattedDate: string = formatter.format(date);
            const [month, day, year, hour, minute, second] = formattedDate.match(/\d+/g)!.map(Number);
            return new Date(year, month - 1, day, hour, minute, second);
        }
        const dstStartDate: Date = findLastSunday(year, 2);
        const dstEndDate: Date = findLastSunday(year, 9);
        return {
            dstStart: convertToTimezone(dstStartDate, timeZone),
            dstEnd: convertToTimezone(dstEndDate, timeZone)
        };
    }
    public hasDSTTransition(year: number): boolean {
        const january: Date = new Date(year, 0, 1);
        const july: Date = new Date(year, 6, 1);

        const janOffset: number = january.getTimezoneOffset();
        const julOffset: number = july.getTimezoneOffset();

        // If the offsets are different, it means there is a DST transition
        return janOffset !== julOffset;
    }
    /**
     * Get task left value
     *
     * @param {Date} startDate .
     * @param {boolean} isMilestone .
     * @param {boolean} isFromTimelineVirtulization .
     * @returns {number} .
     * @private
     */
    public getTaskLeft(startDate: Date, isMilestone: boolean, isFromTimelineVirtulization?: boolean): number {
        let isTimeSet: boolean = false;
        const date: Date = new Date(startDate.getTime());
        let tierMode: string = this.parent.timelineModule.customTimelineSettings.bottomTier.unit !== 'None' ? this.parent.timelineModule.customTimelineSettings.bottomTier.unit :
            this.parent.timelineModule.customTimelineSettings.topTier.unit;
        const zoomOrTimeline: Object = this.parent.timelineModule.customTimelineSettings;
        let countValue: number = zoomOrTimeline['bottomTier'] !== null ? zoomOrTimeline['bottomTier'].count :
            zoomOrTimeline['topTier'].count;
        if (tierMode === 'Day') {
            let dayStartTime: number;
            let dayEndTime: number;
            if (this.parent.weekWorkingTime.length > 0) {
                dayStartTime = this.parent['getStartTime'](date);
                dayEndTime = this.parent['getEndTime'](date);
            }
            else {
                dayStartTime = this.parent.defaultStartTime;
                dayEndTime = this.parent.defaultEndTime;
            }
            if (this.getSecondsInDecimal(date) === dayStartTime) {
                date.setHours(0, 0, 0, 0);
            } else if (isMilestone && this.getSecondsInDecimal(date) === dayEndTime) {
                date.setHours(24);
                isTimeSet = true;
            } else if (this.getSecondsInDecimal(date) === dayEndTime && this.parent.allowUnscheduledTasks) {
                date.setHours(22);
                isTimeSet = true;
            }
        }
        let leftValueForStartDate: number;
        let isValid: boolean = true;
        if ((this.parent.editModule && ((this.parent.editModule.taskbarEditModule && this.parent.editModule.taskbarEditModule.taskBarEditAction) || (this.parent.editModule.dialogModule && this.parent.editModule.dialogModule['isEdit']) ||
            (this.parent.editModule.cellEditModule && this.parent.editModule.cellEditModule.isCellEdit) ||
            this.parent.ganttChartModule.scrollObject['isSetScrollLeft'])) && !isFromTimelineVirtulization) {
            isValid = false;
        }
        if (this.parent.enableTimelineVirtualization && isValid && !this.parent.timelineModule['performedTimeSpanAction']) {
            leftValueForStartDate = (this.parent.enableTimelineVirtualization
                && this.parent.ganttChartModule.scrollObject.element.scrollLeft !== 0)
                ? this.parent.ganttChartModule.scrollObject.getTimelineLeft() : null;
        }
        const timelineStartDate: Date = (this.parent.enableTimelineVirtualization && !isNullOrUndefined(leftValueForStartDate))
            ? new Date((this.parent.timelineModule['dateByLeftValue'](leftValueForStartDate)).toString()) : new Date(this.parent.timelineModule.timelineStartDate);
        if (timelineStartDate) {
            let leftValue: number;
            const hasDST: boolean = this.hasDSTTransition(startDate.getFullYear());
            let transitions: Object;
            if (hasDST) {
                transitions = this.getDSTTransitions(startDate.getFullYear(), this.systemTimeZone);
            }
            if (this.parent.isInDst(startDate) && !this.parent.isInDst(timelineStartDate)) {
                let newTimelineStartDate: Date;
                if (this.parent.isInDst(date)) {
                    newTimelineStartDate = new Date(timelineStartDate.getTime() - (60 * 60 * 1000));
                } else {
                    newTimelineStartDate = new Date(timelineStartDate.getTime());
                }
                leftValue = (date.getTime() - newTimelineStartDate.getTime()) / (1000 * 60 * 60 * 24) * this.parent.perDayWidth;
            }
            else {
                let width: number;
                if (this.parent.timelineModule.bottomTier === 'Day' && this.getSecondsInDecimal(date) !== this.parent.defaultStartTime && this.getSecondsInDecimal(date) !== 0 &&
                    !isTimeSet && !this.parent['isFromEventMarker']) {
                    const newDate: Date = new Date(startDate.getTime());
                    const setStartDate: Date = new Date(newDate.setHours(0, 0, 0, 0));
                    const duration: number = this.getDuration(setStartDate, startDate, 'day', true, false);
                    width = duration * this.parent.perDayWidth;
                    date.setHours(0, 0, 0, 0);
                    leftValue = (date.getTime() - timelineStartDate.getTime()) / (1000 * 60 * 60 * 24) * this.parent.perDayWidth;
                    if (this.getSecondsInDecimal(date) !== this.parent.defaultStartTime && this.parent.timelineModule.bottomTier === 'Day') {
                        leftValue += width;
                    }
                }
                else {
                    let newTimelineStartDate: Date;
                    if (date.getTimezoneOffset() < timelineStartDate.getTimezoneOffset()) {
                        newTimelineStartDate = new Date(timelineStartDate.getTime() - (60 * 60 * 1000));
                    } else {
                        newTimelineStartDate = new Date(timelineStartDate.getTime());
                    }
                    leftValue = (date.getTime() - timelineStartDate.getTime()) / (1000 * 60 * 60 * 24) * this.parent.perDayWidth;
                }
            }
            const timelineStartTime: number = timelineStartDate.getTime();
            let dstStartTime: number | undefined;
            if (transitions && transitions['dstStart']) {
                dstStartTime = transitions['dstStart'].getTime();
            }
            const isBeforeOrAtDSTStart: boolean = timelineStartTime <= dstStartTime;
            if (hasDST && this.parent.dayWorkingTime[0]['properties'].from > transitions['dstStart'].getHours() && isBeforeOrAtDSTStart && tierMode === 'Day' && this.getSecondsInDecimal(date) === this.parent.defaultStartTime) {
                if ((leftValue % this.parent.perDayWidth) !== 0) {
                    const leftDifference: number = this.parent.perDayWidth - (leftValue % this.parent.perDayWidth);
                    leftValue = leftValue + leftDifference;
                }
            }
            const topTier: Object = this.parent.timelineModule.customTimelineSettings.topTier;
            if (topTier && topTier['unit'] === 'Hour' && topTier['count'] === 1) {
                tierMode = topTier['unit'];
                countValue = topTier['count'];
            }
            const unitHour: boolean = ((tierMode === 'Hour' && countValue === 1) || (tierMode === 'Minutes' && countValue === 60));
            const pervYear: number = startDate.getFullYear() - 1;
            let isprevYearTransitions : boolean = false;
            if (timelineStartDate.getFullYear() <= pervYear) {
                if (timelineStartDate.getFullYear() < pervYear) {
                    isprevYearTransitions = true;
                }
                else {
                    const pervDSTTransitions: Object = this.getDSTTransitions(timelineStartDate.getFullYear(), this.systemTimeZone);
                    if (startDate >= pervDSTTransitions['dstStart']) {
                        isprevYearTransitions = true;
                    }
                }
            }
            const isHourly: boolean = this.parent.timelineModule.topTier === 'Hour' || this.parent.timelineModule.bottomTier === 'Hour';
            const isDaily: boolean = this.parent.timelineModule.topTier === 'Day' || this.parent.timelineModule.bottomTier === 'Day';
            const isStartDateInDst: boolean = this.parent.isInDst(startDate);
            const isTimelineStartDateInDst: boolean = this.parent.isInDst(timelineStartDate);
            const perHourWidth: number = this.parent.perDayWidth / 24;

            if (!isStartDateInDst && isTimelineStartDateInDst) {
                if ((countValue !== 1 && isHourly) || (countValue === 1 && isDaily)) {
                    leftValue -= perHourWidth;
                }
            }
            if (hasDST && unitHour && ((startDate >= transitions['dstStart']) || isprevYearTransitions) && !this.parent.enableTimelineVirtualization) {
                if (countValue === 1) {
                    const projectStartDate: Date = new Date(this.parent.projectStartDate);
                    const projectEndDate: Date = new Date(this.parent.projectEndDate);
                    const yearsCount: number[] = [];
                    for (let year: number = projectStartDate.getFullYear(); year <= projectEndDate.getFullYear(); year++) {
                        yearsCount.push(year);
                    }
                    const findYearIndex: (year: number) => number = (year: number): number => {
                        return yearsCount.indexOf(year);
                    };
                    let index: number = findYearIndex(startDate.getFullYear());
                    if (index !== -1) {
                        if ((startDate > transitions['dstEnd']) || index === 0) {
                            index += 1;
                        }
                        leftValue -= index * (this.parent.perDayWidth / 24);
                    }
                }
            }
            return leftValue;
        } else {
            return 0;
        }
    }

    public getSplitTaskWidth(sDate: Date, duration: number, data: IGanttData): number {
        const startDate: Date = new Date(sDate.getTime());
        const endDate: Date =
            new Date((this.getEndDate(startDate, duration, data.ganttProperties.durationUnit, data.ganttProperties, false).getTime()));
        const tierViewMode: string = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.bottomTier :
            this.parent.timelineModule.topTier;
        if (tierViewMode === 'Day') {
            let dayStartTime: number;
            let dayEndTime: number;
            if (this.parent.weekWorkingTime.length > 0) {
                dayStartTime = this.parent['getStartTime'](startDate);
                dayEndTime = this.parent['getEndTime'](endDate);
            }
            else {
                dayStartTime = this.parent.defaultStartTime;
                dayEndTime = this.parent.defaultEndTime;
            }
            if (this.getSecondsInDecimal(startDate) === dayStartTime) {
                startDate.setHours(0, 0, 0, 0);
            }
            if (this.getSecondsInDecimal(endDate) === dayEndTime) {
                endDate.setHours(24);
            }
            if (this.getSecondsInDecimal(endDate) === dayStartTime) {
                endDate.setHours(0, 0, 0, 0);
            }
        }
        return ((this.getTimeDifference(startDate, endDate) / (1000 * 60 * 60 * 24)) * this.parent.perDayWidth);
    }
    public getSplitTaskLeft(sDate: Date, segmentTaskStartDate: Date): number {
        const stDate: Date = new Date(sDate.getTime());
        const tierViewMode: string = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.bottomTier :
            this.parent.timelineModule.topTier;
        if (tierViewMode === 'Day') {
            let dayStartTime: number;
            let segmentStartTime: number;
            if (this.parent.weekWorkingTime.length > 0) {
                dayStartTime = this.parent['getStartTime'](stDate);
                segmentStartTime = this.parent['getStartTime'](segmentTaskStartDate);
            }
            else {
                segmentStartTime = dayStartTime = this.parent.defaultStartTime;
            }
            if (this.getSecondsInDecimal(stDate) === dayStartTime) {
                stDate.setHours(0, 0, 0, 0);
            }
            if (this.getSecondsInDecimal(segmentTaskStartDate) === segmentStartTime) {
                segmentTaskStartDate.setHours(0, 0, 0, 0);
            }
        }
        if (segmentTaskStartDate) {
            return (stDate.getTime() - segmentTaskStartDate.getTime()) / (1000 * 60 * 60 * 24) * this.parent.perDayWidth;
        } else {
            return 0;
        }
    }
    /**
     *
     * @param {IGanttData} ganttData .
     * @param {string} fieldName .
     * @returns {void} .
     * @private
     */
    public updateMappingData(ganttData: IGanttData, fieldName: string): void {
        const columnMapping: Object = this.parent.columnMapping;
        const ganttProp: ITaskData = ganttData.ganttProperties;
        if (isNullOrUndefined(columnMapping[fieldName as string]) && fieldName !== 'taskType' && fieldName !== 'segments') {
            return;
        }
        if (fieldName === 'predecessorName') {
            //
        } else if (fieldName === 'resourceInfo') {
            const resourceData: Object[] = ganttProp.resourceInfo;
            const resourceSettings: ResourceFieldsModel = this.parent.resourceFields;
            // eslint-disable-next-line
            const resourcesId: number[] = []; let resourcesName: string[] = [];
            if (!isNullOrUndefined(resourceData)) {
                for (let i: number = 0; i < resourceData.length; i++) {
                    resourcesId.push(resourceData[i as number][resourceSettings.id]);
                    let resName: string = resourceData[i as number][resourceSettings.name];
                    const resourceUnit: number = resourceData[i as number][resourceSettings.unit];
                    if (resourceUnit !== 100) {
                        resName += '[' + resourceUnit + '%' + ']';
                    }
                    if (resName) {
                        resourcesName.push(resName);
                    }
                }
            }
            this.parent.setRecordValue('resourceNames', resourcesName.join(','), ganttProp, true);
            if (this.isResourceString) {
                if (
                    ganttData.taskData[this.parent.taskFields.resourceInfo] &&
                    ganttData.taskData[this.parent.taskFields.resourceInfo][0]
                ) {
                    ganttData.taskData[this.parent.taskFields.resourceInfo] =
                        ganttData.taskData[this.parent.taskFields.resourceInfo][0][resourceSettings.name];
                }
                this.updateTaskDataResource(ganttData);
            } else {
                this.updateTaskDataResource(ganttData);
            }
            this.parent.setRecordValue(columnMapping[fieldName as string], resourcesName.join(','), ganttData);
        } else if (fieldName === 'startDate' || fieldName === 'endDate') {
            this.setRecordDate(ganttData, ganttProp[fieldName as string], columnMapping[fieldName as string]);
        } else if (fieldName === 'duration') {
            this.setRecordDuration(ganttData, columnMapping[fieldName as string]);
        } else if (fieldName === 'work') {
            this.parent.setRecordValue(
                'taskData.' + columnMapping[fieldName as string],
                ganttProp.work, ganttData);
            this.parent.setRecordValue(columnMapping[fieldName as string], ganttProp[fieldName as string], ganttData);
        } else if (fieldName === 'type') {
            this.parent.setRecordValue('taskData.' + columnMapping[fieldName as string], ganttProp.taskType, ganttData);
            this.parent.setRecordValue(columnMapping[fieldName as string], ganttProp.taskType, ganttData);
        } else if (fieldName === 'manual') {
            this.parent.setRecordValue('taskData.' + columnMapping[fieldName as string], !ganttProp.isAutoSchedule, ganttData);
            this.parent.setRecordValue(columnMapping[fieldName as string], !ganttProp.isAutoSchedule, ganttData);
        } else if (fieldName === 'segments') {
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.segments, this.segmentTaskData(ganttData), ganttData);
        } else {
            this.parent.setRecordValue('taskData.' + columnMapping[fieldName as string], ganttProp[fieldName as string], ganttData);
            this.parent.setRecordValue(columnMapping[fieldName as string], ganttProp[fieldName as string], ganttData);
        }
    }

    private segmentTaskData(data: IGanttData): object[] {
        const segments: ITaskSegment[] = data.ganttProperties.segments;
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        if (isNullOrUndefined(segments)) {
            return null;
        }
        const taskData: Object[] = <Object[]>extend([], [], data.taskData[taskSettings.segments], true);
        for (let i: number = 0; i < segments.length; i++) {
            if (this.parent.isEdit || (this.parent.editModule && this.parent.editModule.dialogModule &&
                getValue('isEdit', this.parent.editModule.dialogModule)) || (this.parent.contextMenuModule && getValue('isEdit', this.parent.contextMenuModule))) {
                taskData[i as number] = {};
            }
            if (!isNullOrUndefined(taskSettings.startDate)) {
                taskData[i as number][this.parent.taskFields.startDate] = segments[i as number].startDate;
            }
            if (!isNullOrUndefined(taskSettings.endDate)) {
                taskData[i as number][this.parent.taskFields.endDate] = segments[i as number].endDate;
            }
            if (!isNullOrUndefined(taskSettings.duration)) {
                taskData[i as number][this.parent.taskFields.duration] = Number(segments[i as number].duration);
            }
        }
        if (this.customSegmentProperties.length > 0 && taskData && taskData.length > 0) {
            taskData.forEach((task: Object, index: number) => {
                const mergedObject: Object = Object.assign({}, task, this.customSegmentProperties[index as number]);
                taskData[index as number] = mergedObject;
            });
        }
        return taskData;
    }
    /**
     * Method to update the task data resource values
     *
     * @param {IGanttData} ganttData .
     * @returns {void} .
     */
    private updateTaskDataResource(ganttData: IGanttData): void {
        const resourceData: Object[] = ganttData.ganttProperties.resourceInfo;
        let preTaskResources: Object[] = ganttData.taskData[this.parent.taskFields.resourceInfo];
        const resourceSettings: ResourceFieldsModel = this.parent.resourceFields;
        if (isNullOrUndefined(preTaskResources)) {
            ganttData.taskData[this.parent.taskFields.resourceInfo] = resourceData;
        } else if (resourceData && resourceData.length) {
            for (let i: number = 0; i < resourceData.length; i++) {
                let isAdded: boolean = false;
                if (typeof(preTaskResources) === 'string') {
                    if (typeof preTaskResources === 'string') {
                        if ((preTaskResources) === (resourceData[i as number][resourceSettings.name])) {
                            preTaskResources = resourceData[i as number][resourceSettings.name];
                            isAdded = true;
                            break;
                        }
                    }
                } else {
                    for (let j: number = 0; j < preTaskResources.length; j++) {
                        if (typeof preTaskResources[j as number] === 'number' || typeof preTaskResources[j as number] === 'string') {
                            if (parseInt(preTaskResources[j as number] as string, 10) ===
                                parseInt(resourceData[i as number][resourceSettings.id], 10)) {
                                preTaskResources[j as number] = resourceData[i as number];
                                isAdded = true;
                                break;
                            }
                        } else if (preTaskResources[j as number][resourceSettings.id] === resourceData[i as number][resourceSettings.id] && typeof preTaskResources[j as number] !== 'number') {
                            preTaskResources[j as number] = extend({}, preTaskResources[j as number], resourceData[i as number], true);
                            isAdded = true;
                            break;
                        }
                    }
                }
                if (!isAdded) {
                    if (typeof (preTaskResources) === 'string') {
                        preTaskResources = resourceData[i as number][resourceSettings.name];
                    } else {
                        preTaskResources.push(resourceData[i as number]);
                    }

                }
            }
            const data: IGanttData[] = [];
            if (!isNullOrUndefined(preTaskResources)) {
                if (typeof(preTaskResources) !== 'string') {
                    for (let k: number = 0; k < preTaskResources.length; k++) {
                        resourceData.filter((resourceInfo: Object) => {
                            if (resourceInfo[resourceSettings.id] === preTaskResources[k as number][resourceSettings.id]
                                && data.indexOf(preTaskResources[k as number]) === -1) {
                                data.push(preTaskResources[k as number]);
                            }
                        });
                    }
                    this.parent.setRecordValue('taskData.' + this.parent.taskFields.resourceInfo, data, ganttData);
                } else {
                    this.parent.setRecordValue('taskData.' + this.parent.taskFields.resourceInfo, preTaskResources, ganttData);
                }
            }
        } else {
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.resourceInfo, [], ganttData);
        }
    }

    private setRecordDate(task: IGanttData, value: Date | string, mapping: string): void {
        const tempDate: Date = typeof value === 'string' ? new Date(value as string) : value;
        if (!isNullOrUndefined(value)) {
            value = new Date(tempDate.getTime());
        }
        this.parent.setRecordValue(mapping, value, task);
        if (!isNullOrUndefined(value)) {
            value = new Date(tempDate.getTime());
        }
        if (!this.parent.isLoad && !this.parent.isDynamicData) {
            this.parent.setRecordValue('taskData.' + mapping, value, task);
        }
        this.parent.isDynamicData = false;
    }

    private getDurationInDay(duration: number, durationUnit: string): number {
        if (durationUnit === 'day') {
            return duration;
        } else if (durationUnit === 'hour') {
            return duration / (this.parent.secondsPerDay / 3600);
        } else {
            return duration / (this.parent.secondsPerDay / 60);
        }
    }

    private setRecordDuration(task: IGanttData, mapping: string): void {
        const duration: number = task.ganttProperties.duration;
        const durationUnit: string = task.ganttProperties.durationUnit;
        if (!isNullOrUndefined(duration)) {
            this.parent.setRecordValue(mapping, task.ganttProperties.duration, task);
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const durationValue: any = (getValue(mapping, task.taskData));
            if (isNaN(durationValue) && isNullOrUndefined(this.parent.taskFields.durationUnit) && !isNullOrUndefined(durationValue)) {
                this.parent.setRecordValue('taskData.' + mapping, this.getDurationString(duration, durationUnit), task);
            } else {
                if (typeof durationValue === 'string') {
                    this.parent.setRecordValue('taskData.' + mapping, duration.toString(), task);
                } else {
                    this.parent.setRecordValue('taskData.' + mapping, duration, task);
                }
            }
        } else {
            this.parent.setRecordValue(mapping, duration, task);
            this.parent.setRecordValue('taskData.' + mapping, duration, task);
        }
        if (this.parent.taskFields.durationUnit) {
            task.taskData[this.parent.taskFields.durationUnit] = task.ganttProperties.durationUnit;
        }
    }
    public setDataSource(data: Object | Object[] | DataManager): Object[] {
        let dataArray: Object[];
        const createData: Object[] = [];
        if (Array.isArray(data)) {
            dataArray = data;
        }
        const length: number = dataArray.length;
        for (let i: number = 0; i < length; i++) {
            const record: Object = data[i as number];
            createData.push(record);
            if (!(isNullOrUndefined(data[i as number][this.parent.taskFields.child as string]))) {
                this.setDataSource(data[i as number][this.parent.taskFields.child as string]);

            }
        }
        return createData;
    }
    private setStartDate(task: IGanttData): void {
        let hierarchicalData: Object[] = [];
        if (!isNullOrUndefined(this.parent.taskFields.parentID) && !isNullOrUndefined(this.parent.taskFields.id)) {
            hierarchicalData = this.setDataSource(this.parent.dataSource);
        } else {
            hierarchicalData = this.parent.dataSource as Object[];
        }
        hierarchicalData.map((record: Object) => {
            if (task.ganttProperties.taskId === record[this.parent.taskFields.id as string]) {
                if (!isNullOrUndefined(this.parent.taskFields.startDate)) {
                    task[this.parent.taskFields.startDate as string] = record[this.parent.taskFields.startDate as string];
                }
                if (!isNullOrUndefined(this.parent.taskFields.endDate)) {
                    task[this.parent.taskFields.endDate as string] = record[this.parent.taskFields.endDate as string];
                }
            }
        });
    }
    private getWorkInHour(work: number, workUnit: string): number {
        if (workUnit === 'day') {
            return work * (this.parent.secondsPerDay / 3600);
        } else if (workUnit === 'minute') {
            return work / 60;
        } else {
            return work;
        }
    }
    /**
     *
     * @param {IGanttData} ganttData .
     * @returns {void} .
     * @private
     */
    public updateTaskData(ganttData: IGanttData): void {
        const dataMapping: TaskFieldsModel = this.parent.taskFields;
        const ganttProperties: ITaskData = ganttData.ganttProperties;
        if (!isNullOrUndefined(ganttData.taskData)) {
            const data: Object = ganttData.taskData;
            if (dataMapping.id) {
                this.parent.setRecordValue('taskData.' + dataMapping.id, ganttProperties.taskId, ganttData);
                this.parent.setRecordValue(dataMapping.id, ganttProperties.taskId, ganttData);
            }
            if (dataMapping.name) {
                if (!this.parent.isLoad) {
                    this.parent.setRecordValue('taskData.' + dataMapping.name, ganttProperties.taskName, ganttData);
                }
                this.parent.setRecordValue(dataMapping.name, ganttProperties.taskName, ganttData);
            }
            if (dataMapping.startDate) {
                this.setRecordDate(ganttData, ganttProperties.startDate, dataMapping.startDate);
            }
            if (dataMapping.endDate) {
                this.setRecordDate(ganttData, ganttProperties.endDate, dataMapping.endDate);
            }
            if (dataMapping.duration) {
                if (isNullOrUndefined(dataMapping.milestone) || (!isNullOrUndefined(dataMapping.milestone) &&
                    !ganttData.taskData[dataMapping.milestone])) {
                    this.setRecordDuration(ganttData, dataMapping.duration);
                }
            }
            if (dataMapping.durationUnit) {
                data[dataMapping.durationUnit] = ganttProperties.durationUnit;
            }
            if (dataMapping.progress) {
                if (!this.parent.isLoad) {
                    this.parent.setRecordValue('taskData.' + dataMapping.progress, ganttProperties.progress, ganttData);
                }
                this.parent.setRecordValue(dataMapping.progress, ganttProperties.progress, ganttData);
            }
            if (dataMapping.baselineStartDate) {
                this.setRecordDate(ganttData, ganttProperties.baselineStartDate, dataMapping.baselineStartDate);
            }
            if (dataMapping.baselineEndDate) {
                this.setRecordDate(ganttData, ganttProperties.baselineEndDate, dataMapping.baselineEndDate);
            }
            if (dataMapping.notes) {
                if (!this.parent.isLoad) {
                    this.parent.setRecordValue('taskData.' + dataMapping.notes, ganttProperties.notes, ganttData);
                }
                this.parent.setRecordValue(dataMapping.notes, ganttProperties.notes, ganttData);
            }
            if (dataMapping.cssClass) {
                if (!this.parent.isLoad) {
                    this.parent.setRecordValue('taskData.' + dataMapping.cssClass, ganttProperties.cssClass, ganttData);
                }
                this.parent.setRecordValue(dataMapping.cssClass, ganttProperties.cssClass, ganttData);
            }
            if (dataMapping.indicators) {
                if (!this.parent.isLoad) {
                    this.parent.setRecordValue('taskData.' + dataMapping.indicators, ganttProperties.indicators, ganttData);
                }
                this.parent.setRecordValue(dataMapping.indicators, ganttProperties.indicators, ganttData);
            }
            if (dataMapping.parentID) {
                const parentID: string = this.parent.viewType === 'ProjectView' ? ganttProperties.parentId : data[dataMapping.parentID];
                this.parent.setRecordValue('taskData.' + dataMapping.parentID, parentID, ganttData);
                this.parent.setRecordValue(dataMapping.parentID, ganttProperties.parentId, ganttData);
            }
            if (dataMapping.work) {
                if (!this.parent.isLoad) {
                    this.parent.setRecordValue(
                        'taskData.' + dataMapping.work,
                        ganttProperties.work, ganttData);
                }
                this.parent.setRecordValue(dataMapping.work, ganttProperties.work, ganttData);
            }
            if (dataMapping.type) {
                this.parent.setRecordValue('taskData.' + dataMapping.type, ganttProperties.taskType, ganttData);
                this.parent.setRecordValue(dataMapping.type, ganttProperties.taskType, ganttData);
            }
        }
    }
    /**
     * To set resource value in Gantt record
     *
     * @param {object} data .
     * @returns {object[]} .
     * @private
     */
    public setResourceInfo(data: Object): Object[] {
        // eslint-disable-next-line
        let resourceIdCollection: object[];
        if (isNullOrUndefined(data[this.parent.taskFields.resourceInfo])) {
            return resourceIdCollection;
        }
        if (this.parent.isLoad) {
            resourceIdCollection = data[this.parent.taskFields.resourceInfo];
        } else {
            resourceIdCollection = data['taskData'] && this.parent.taskFields.resourceInfo in data['taskData']
                ? data['taskData'][this.parent.taskFields.resourceInfo]
                : data[this.parent.taskFields.resourceInfo];
        }
        let resourceData: Object[];
        if (!isNullOrUndefined(this.parent.editModule) && !isNullOrUndefined(this.parent.editModule.dialogModule)
            && this.parent.editModule.dialogModule.isAddNewResource) {
            resourceData = this.parent.editModule.dialogModule.ganttResources;
        } else {
            resourceData = this.parent.resources;
        }
        const resourceIDMapping: string = this.parent.resourceFields.id;
        const resourceUnitMapping: string = this.parent.resourceFields.unit;
        const resourceGroup: string = this.parent.resourceFields.group;
        const resources: Object[] = [];
        if (typeof (resourceIdCollection) === 'string' && resourceIdCollection !== '') {
            const resource: Object[] = [];
            const resourceIds: string = data[this.parent.taskFields.resourceInfo].split(',');
            if (resourceIds) {
                resourceData.forEach((resourceInfo: Object) => {
                    if (resourceIds.includes(resourceInfo[this.parent.resourceFields.name as string])) {
                        resource.push(resourceInfo);
                    }
                });
                const ganttDataResource: Object = extend({}, resource[0]);
                resources.push(ganttDataResource);
                if (!isNullOrUndefined(resourceUnitMapping) && !isNullOrUndefined(resourceIdCollection[resourceUnitMapping as string])) {
                    ganttDataResource[resourceUnitMapping as string] = resourceIdCollection[resourceUnitMapping as string];
                }
                if (!isNullOrUndefined(resourceGroup) && !isNullOrUndefined(resourceIdCollection[resourceGroup as string])) {
                    ganttDataResource[resourceGroup as string] = resourceIdCollection[resourceGroup as string];
                }
            }
        } else {
            for (let count: number = 0; count < resourceIdCollection.length; count++) {
                const resource: Object[] = resourceData.filter((resourceInfo: Object) => {
                    if (typeof (resourceIdCollection[count as  number]) === 'object' &&
                        resourceIdCollection[count as number][resourceIDMapping as string] === resourceInfo[resourceIDMapping as string]) {
                        return true;
                    } else {
                        return (resourceIdCollection[count as number] === resourceInfo[resourceIDMapping as string]);
                    }
                });
                const ganttDataResource: Object = extend({}, resource[0]);
                resources.push(ganttDataResource);
                if (!isNullOrUndefined(resourceUnitMapping)
                    && !isNullOrUndefined(resourceIdCollection[count as number][resourceUnitMapping as string])) {
                    ganttDataResource[resourceUnitMapping as string] = resourceIdCollection[count as number][resourceUnitMapping as string];
                }
                if (!isNullOrUndefined(resourceGroup)
                    && !isNullOrUndefined(resourceIdCollection[count as number][resourceGroup as string])) {
                    ganttDataResource[resourceGroup as string] = resourceIdCollection[count as number][resourceGroup as string];
                }
            }
        }
        this.updateResourceUnit(resources);
        return resources;
    }
    /**
     * To set resource unit in Gantt record
     *
     * @param {object[]} resourceData .
     * @returns {void} .
     * @private
     */
    public updateResourceUnit(resourceData: Object[]): void {
        const resourceUnit: string = this.parent.resourceFields.unit;
        if (!isNullOrUndefined(resourceUnit)) {
            const length: number = resourceData.length;
            let index: number;
            for (index = 0; index < length; index++) {
                if (isNullOrUndefined(resourceData[index as number][resourceUnit as string])) {
                    resourceData[index as number][resourceUnit as string] = 100;
                }
            }
        }
    }

    /**
     * @param {IGanttData} data .
     * @returns {void} .
     * @private
     */
    public updateResourceName(data: IGanttData): void {
        const resourceInfo: Object[] = data.ganttProperties.resourceInfo;
        const resourceName: Object[] = [];
        const taskMapping: TaskFieldsModel = this.parent.taskFields;
        if (resourceInfo && resourceInfo.length > 0) {
            const resourceLength: number = resourceInfo.length;
            if (typeof data.taskData[this.parent.taskFields.resourceInfo] === 'string') {
                const taskResources: string = data.taskData[this.parent.taskFields.resourceInfo];
                const stringResourceName: string = taskResources;
                this.parent.setRecordValue('resourceNames', stringResourceName, data.ganttProperties, true);
                this.parent.setRecordValue(this.parent.taskFields.resourceInfo, stringResourceName, data, true);
                this.updateTaskDataResource(data);
            } else {
                const taskResources: Object = extend([], [], data.taskData[this.parent.taskFields.resourceInfo], true);
                this.parent.setRecordValue('taskData.' + this.parent.taskFields.resourceInfo, [], data);
                for (let i: number = 0; i < resourceLength; i++) {
                    const resource: Object = resourceInfo[i as number];
                    let resName: string = resource[this.parent.resourceFields.name];
                    const resourceUnit: number = resource[this.parent.resourceFields.unit];
                    if (resourceUnit !== 100) {
                        resName += '[' + resourceUnit + '%' + ']';
                    }
                    if (!isNullOrUndefined(resName)) {
                        resourceName.push(resName);
                    }
                    if (data.taskData) {
                        const mapping: string = taskMapping.resourceInfo;
                        if (taskResources[i as number] && typeof (taskResources[parseInt(i.toString(), 10)] === 'object')) {
                            data.taskData[mapping as string].push(taskResources[i as number]);
                        } else {
                            data.taskData[mapping as string].push(resource[this.parent.resourceFields.id]);
                        }
                    }
                }
                this.parent.setRecordValue('resourceNames', resourceName.join(','), data.ganttProperties, true);
                this.parent.setRecordValue(this.parent.taskFields.resourceInfo, resourceName.join(','), data, true);
                this.updateTaskDataResource(data);
            }
        }
    }

    private dataReorder(flatCollection: Object[], rootCollection: Object[]): Object[] {
        const result: Object[] = [];
        while (flatCollection.length > 0 && rootCollection.length > 0) {
            const index: number = rootCollection.indexOf(flatCollection[0]);
            if (index === -1) {
                flatCollection.shift();
            } else {
                result.push(flatCollection.shift());
                rootCollection.splice(index, 1);
            }
        }
        return result;
    }

    private validateDurationUnitMapping(durationUnit: string): string {
        let unit: string = durationUnit;
        if ((unit === 'minute') || (unit === 'minutes') || (unit === 'm') || (unit === 'min')) {
            unit = 'minute';
        } else if ((unit === 'hour') || (unit === 'hours') || (unit === 'h') || (unit === 'hr')) {
            unit = 'hour';
        } else if ((unit === 'day') || (unit === 'days') || (unit === 'd')) {
            unit = 'day';
        } else {
            unit = this.parent.durationUnit.toLocaleLowerCase();
        }
        return unit;
    }

    private validateTaskTypeMapping(taskType: string): string {
        let type: string = taskType;
        if (type === 'FixedDuration') {
            type = 'FixedDuration';
        } else if (type === 'FixedUnit') {
            type = 'FixedUnit';
        } else if (type === 'FixedWork') {
            type = 'FixedWork';
        } else {
            type = this.parent.taskType;
        }
        return type;
    }

    private validateWorkUnitMapping(workUnit: string): string {
        let unit: string = workUnit;
        if (unit === 'minute') {
            unit = 'minute';
        } else if (unit === 'hour') {
            unit = 'hour';
        } else if (unit === 'day') {
            unit = 'day';
        } else {
            unit = this.parent.workUnit.toLocaleLowerCase();
        }
        return unit;
    }
    /**
     * To update duration value in Task
     *
     * @param {string} duration .
     * @param {ITaskData} ganttProperties .
     * @returns {void} .
     * @private
     */
    public updateDurationValue(duration: string, ganttProperties: ITaskData): void {
        const tempDuration: Object = this.getDurationValue(duration);
        if (!isNaN(getValue('duration', tempDuration))) {
            this.parent.setRecordValue('duration', getValue('duration', tempDuration), ganttProperties, true);
        }
        if (!isNullOrUndefined(getValue('durationUnit', tempDuration))) {
            this.parent.setRecordValue('durationUnit', getValue('durationUnit', tempDuration), ganttProperties, true);
        }
    }

    /**
     * @returns {void} .
     * @private
     */
    public reUpdateGanttData(): void {
        if (this.parent.flatData.length > 0) {
            let data: ITaskData;
            let ganttData: IGanttData;
            this.parent.secondsPerDay = this.getSecondsPerDay();
            for (let index: number = 0; index < this.parent.flatData.length; index++) {
                data = this.parent.flatData[index as number].taskData;
                ganttData = this.parent.flatData[index as number];
                if (!isNullOrUndefined(this.parent.taskFields.duration)) {
                    this.setRecordDuration(ganttData, this.parent.taskFields.duration);
                }
                if (this.parent.isLoad) {
                    this.setStartDate(ganttData);
                }
                this.calculateScheduledValues(ganttData, data, false);
            }
            this.updateGanttData();
        }
    }
    //check day is fall between from and to date range
    private _isInStartDateRange(day: Date, from: Date, to: Date): boolean {
        let isInRange: boolean = false;
        if (day.getTime() >= from.getTime() && day.getTime() < to.getTime()) {
            isInRange = true;
        }
        return isInRange;
    }
    //check day is fall between from and to date range
    private _isInEndDateRange(day: Date, from: Date, to: Date): boolean {
        let isInRange: boolean = false;
        if (day.getTime() > from.getTime() && day.getTime() <= to.getTime()) {
            isInRange = true;
        }
        return isInRange;
    }
    /**
     * Method to find overlapping value of the parent task
     *
     * @param {IGanttData} resourceTask .
     * @returns {void} .
     * @private
     */
    public updateOverlappingValues(resourceTask: IGanttData): void {
        let tasks: IGanttData[] = resourceTask.childRecords;
        let currentTask: IGanttData;
        const ranges: IWorkTimelineRanges[] = [];
        if (tasks.length <= 1) {
            resourceTask.ganttProperties.workTimelineRanges = [];
            return;
        }
        tasks = this.setSortedChildTasks(resourceTask);
        this.updateOverlappingIndex(tasks);
        for (let count: number = 1; count < tasks.length; count++) {
            currentTask = tasks[count as number];
            let cStartDate: Date;
            let cEndDate: Date;
            if (currentTask.ganttProperties.startDate) {
                cStartDate = new Date(currentTask.ganttProperties.startDate.getTime());
            }
            if (currentTask.ganttProperties.endDate) {
                cEndDate = new Date(currentTask.ganttProperties.endDate.getTime()); //task 2
            }
            const range: IWorkTimelineRanges[] = [];
            // eslint-disable-next-line
            const rangeObj: IWorkTimelineRanges = {};
            for (let index: number = 0; index < count; index++) {
                const tStartDate: Date = tasks[index as number].ganttProperties.startDate;
                const tEndDate: Date = tasks[index as number].ganttProperties.endDate; // task 1
                const rangeObj: IWorkTimelineRanges = {};
                if (cStartDate && cEndDate && tEndDate
                    && (this._isInStartDateRange(cStartDate, tStartDate, tEndDate)
                    || this._isInEndDateRange(cEndDate, tStartDate, tEndDate))) {
                    if ((tStartDate.getTime() > cStartDate.getTime() && tStartDate.getTime() < cEndDate.getTime()
                        && tEndDate.getTime() > cStartDate.getTime() && tEndDate.getTime() >= cEndDate.getTime())
                        || (cStartDate.getTime() === tStartDate.getTime() && cEndDate.getTime() <= tEndDate.getTime())) {
                        rangeObj.from = tStartDate;
                        rangeObj.to = cEndDate;
                    } else if (cStartDate.getTime() === tStartDate.getTime() && cEndDate.getTime() > tEndDate.getTime()) {
                        rangeObj.from = tStartDate;
                        rangeObj.to = tEndDate;
                    } else if (cStartDate.getTime() > tStartDate.getTime() && cEndDate.getTime() >= tEndDate.getTime()) {
                        rangeObj.from = cStartDate;
                        rangeObj.to = tEndDate;
                    } else if (cStartDate.getTime() > tStartDate.getTime() && cEndDate.getTime() < tEndDate.getTime()) {
                        rangeObj.from = cStartDate;
                        rangeObj.to = cEndDate;
                    }
                    range.push(rangeObj);
                }
            }
            // eslint-disable-next-line
            ranges.push.apply(ranges, this.mergeRangeCollections(range));
        }
        this.parent.setRecordValue('workTimelineRanges', this.mergeRangeCollections(ranges, true), resourceTask.ganttProperties, true);
        this.calculateRangeLeftWidth(resourceTask.ganttProperties.workTimelineRanges);
    }
    /**
     * @param {IGanttData[]} tasks .
     * @returns {void} .
     * @private
     */
    public updateOverlappingIndex(tasks: IGanttData[]): void {
        for (let i: number = 0; i < tasks.length; i++) {
            tasks[i as number].ganttProperties.eOverlapIndex = i;
        }
    }
    /**
     * Method to calculate the left and width value of oarlapping ranges
     *
     * @param {IWorkTimelineRanges[]} ranges .
     * @returns {void} .
     * @private
     */
    public calculateRangeLeftWidth(ranges: IWorkTimelineRanges[]): void {
        for (let count: number = 0; count < ranges.length; count++) {
            ranges[count as number].left = this.getTaskLeft(ranges[count as number].from, false);
            ranges[count as number].width = this.getTaskWidth(ranges[count as number].from, ranges[count as number].to);
        }
    }
    /**
     * @param {IWorkTimelineRanges[]} ranges .
     * @param {boolean} isSplit .
     * @returns {IWorkTimelineRanges[]} .
     * @private
     */
    public mergeRangeCollections(ranges: IWorkTimelineRanges[], isSplit?: boolean): IWorkTimelineRanges[] {
        let finalRange: IWorkTimelineRanges[] = [];
        let currentTopRange: IWorkTimelineRanges = {};
        let cCompareRange: IWorkTimelineRanges = {};
        let cStartDate: Date;
        let cEndDate: Date;
        let tStartDate: Date;
        let tEndDate: Date;
        const sortedRanges: IWorkTimelineRanges[] = new DataManager(ranges).executeLocal(new Query()
            .sortBy(this.parent.taskFields.startDate, 'Ascending'));
        for (let i: number = 0; i < sortedRanges.length; i++) {
            if (finalRange.length === 0 && i === 0) {
                finalRange.push(sortedRanges[i as number]);
                continue;
            }
            currentTopRange = finalRange[finalRange.length - 1];
            cStartDate = currentTopRange.from;
            cEndDate = currentTopRange.to;
            cCompareRange = sortedRanges[i as number];
            tStartDate = cCompareRange.from;
            tEndDate = cCompareRange.to;
            if ((cStartDate.getTime() === tStartDate.getTime() && cEndDate.getTime() >= tEndDate.getTime())
                || (cStartDate.getTime() < tStartDate.getTime() && cEndDate.getTime() >= tEndDate.getTime())
            ) {
                continue;
            }
            /* eslint-disable-next-line */
            else if ((cStartDate.getTime() <= tStartDate.getTime() && cEndDate.getTime() >= tStartDate.getTime() && cEndDate.getTime() < tEndDate.getTime())
                || (cEndDate.getTime() < tStartDate.getTime() && this.checkStartDate(cEndDate).getTime() === tStartDate.getTime())) {
                currentTopRange.to = tEndDate;
            } else if (cEndDate.getTime() < tStartDate.getTime() && this.checkStartDate(cEndDate).getTime() !== tStartDate.getTime()) {
                finalRange.push(sortedRanges[i as number]);
            }
        }
        if (isSplit) {
            finalRange = this.splitRangeCollection(finalRange);
        }
        return finalRange;
    }
    /**
     * Sort resource child records based on start date
     *
     * @param {IGanttData} resourceTask .
     * @returns {IGanttData} .
     * @private
     */
    public setSortedChildTasks(resourceTask: IGanttData): IGanttData[] {
        let sortedRecords: IGanttData[] = [];
        sortedRecords = new DataManager(resourceTask.childRecords).executeLocal(new Query()
            .sortBy(this.parent.taskFields.startDate, 'Ascending'));
        return sortedRecords;
    }

    private splitRangeCollection(rangeCollection: IWorkTimelineRanges[], fromField?: string, toField?: string): IWorkTimelineRanges[] {
        let splitArray: IWorkTimelineRanges[] = [];
        let unit: string;
        if (this.parent.timelineModule.isSingleTier) {
            unit = this.parent.timelineModule.bottomTier !== 'None' ?
                this.parent.timelineModule.bottomTier : this.parent.timelineModule.topTier;
        } else {
            unit = this.parent.timelineModule.bottomTier;
        }
        if (unit === 'Week' || unit === 'Month' || unit === 'Year') {
            splitArray = rangeCollection;
        } else if (unit === 'Day') {
            splitArray = this.getRangeWithWeek(rangeCollection, fromField, toField);
        } else {
            if (this.parent.workingTimeRanges[0].from === 0 && this.parent.workingTimeRanges[0].to === 86400) {
                splitArray = this.getRangeWithWeek(rangeCollection, fromField, toField);
            } else {
                splitArray = this.getRangeWithDay(rangeCollection, fromField, toField);
            }
        }
        return splitArray;
    }
    private getRangeWithDay(ranges: IWorkTimelineRanges[], fromField: string, toField: string): IWorkTimelineRanges[] {
        const splitArray: IWorkTimelineRanges[] = [];
        for (let i: number = 0; i < ranges.length; i++) {
            splitArray.push(...this.splitRangeForDayMode(ranges[parseInt(i.toString(), 10)], fromField, toField));
        }
        return splitArray;
    }
    private splitRangeForDayMode(range: IWorkTimelineRanges, fromField: string, toField: string): IWorkTimelineRanges[] {
        const fromString: string = fromField ? fromField : 'from';
        const toString: string = toField ? toField : 'to';
        let tempStart: Date = new Date(range[fromString as string]);
        const end: Date = new Date(range[toString as string]);
        const ranges: IWorkTimelineRanges[] = [];
        let rangeObject: CObject = {};
        if (tempStart.getTime() < end.getTime()) {
            do {
                const nStart: Date = new Date(tempStart.getTime());
                const nEndDate: Date = new Date(tempStart.getTime());
                let nextAvailDuration: number = 0;
                const sHour: number = this.parent.dataOperation.getSecondsInDecimal(tempStart);
                let startRangeIndex: number = -1;
                for (let i: number = 0; i < this.parent.workingTimeRanges.length; i++) {
                    const val: IWorkingTimeRange = this.parent.workingTimeRanges[i as number];
                    if (sHour >= val.from && sHour <= val.to) {
                        startRangeIndex = i;
                        break;
                    }
                }
                if (startRangeIndex !== -1) {
                    nextAvailDuration = Math.round(this.parent.workingTimeRanges[startRangeIndex as number].to - sHour);
                    nEndDate.setSeconds(nEndDate.getSeconds() + nextAvailDuration);
                }
                const taskName: string = 'task';
                if (nEndDate.getTime() < end.getTime()) {
                    rangeObject = {};
                    if (range.task) {
                        rangeObject[taskName as string] = extend([], range.task);
                    }
                    rangeObject[fromString as string] = nStart;
                    rangeObject[toString as string] = nEndDate;
                    rangeObject.isSplit = true;
                    ranges.push(rangeObject);
                } else {
                    rangeObject = {};
                    if (range.task) {
                        rangeObject[taskName as string] = extend([], range.task);
                    }
                    rangeObject[fromString as string] = nStart;
                    rangeObject[toString as string] = end;
                    rangeObject.isSplit = true;
                    ranges.push(rangeObject);
                }
                tempStart = this.checkStartDate(nEndDate);
            } while (tempStart.getTime() < end.getTime());
        } else {
            ranges.push(range);
        }
        return ranges;
    }
    private getRangeWithWeek(ranges: IWorkTimelineRanges[], fromField: string, toField: string): IWorkTimelineRanges[] {
        const splitArray: IWorkTimelineRanges[] = [];
        for (let i: number = 0; i < ranges.length; i++) {
            // eslint-disable-next-line
            splitArray.push.apply(splitArray, this.splitRangeForWeekMode(ranges[i as number], fromField, toField));
        }
        return splitArray;
    }
    private splitRangeForWeekMode(range: IWorkTimelineRanges, fromField: string, toField: string): IWorkTimelineRanges[] {
        const from: string = fromField ? fromField : 'from';
        const to: string = toField ? toField : 'to';
        let start: Date = new Date(range[from as string]);
        let tempStart: Date = new Date(range[from as string]);
        const end: Date = new Date(range[to as string]);
        let isInSplit: boolean = false;
        const ranges: IWorkTimelineRanges[] = [];
        let rangeObj: CObject = {};
        tempStart.setDate(tempStart.getDate() + 1);
        if (tempStart.getTime() < end.getTime()) {
            do {
                if (this.parent.dataOperation.isOnHolidayOrWeekEnd(tempStart, null)) {
                    const tempEndDate: Date = new Date(tempStart.getTime());
                    tempEndDate.setDate(tempStart.getDate() - 1);
                    let dayEndTime: number;
                    if (this.parent.weekWorkingTime.length > 0) {
                        dayEndTime = this.parent['getEndTime'](tempEndDate);
                    }
                    else {
                        dayEndTime = this.parent.defaultEndTime;
                    }
                    this.setTime(dayEndTime, tempEndDate);
                    rangeObj = {};
                    rangeObj[from as string] = start;
                    rangeObj.isSplit = true;
                    rangeObj[to as string] = new Date(tempEndDate);
                    if (range.task) {
                        rangeObj.task = extend([], range.task, true);
                    }
                    const isStartNotHolidayOrWeekend: boolean = !this.parent.dataOperation.isOnHolidayOrWeekEnd(start, null);
                    const isTempEndDateNotHolidayOrWeekend: boolean = !this.parent.dataOperation.isOnHolidayOrWeekEnd(tempEndDate, null);
                    const isDifferentDates: boolean = start.getTime() !== tempEndDate.getTime();
                    if (isStartNotHolidayOrWeekend && isTempEndDateNotHolidayOrWeekend && isDifferentDates) {
                        ranges.push(rangeObj);
                    }
                    tempEndDate.setDate(tempEndDate.getDate() + 1);
                    start = this.checkStartDate(tempEndDate);
                    tempStart = new Date(start.getTime());
                    isInSplit = true;
                } else {
                    tempStart.setDate(tempStart.getDate() + 1);
                }
            } while (tempStart.getTime() < end.getTime());
            if (isInSplit) {
                if (start.getTime() !== end.getTime()) {
                    rangeObj = {};
                    if (range.task) {
                        rangeObj.task = extend([], range.task, true);
                    }
                    rangeObj[from as string] = start;
                    rangeObj[to as string] = end;
                    rangeObj.isSplit = true;
                    ranges.push(rangeObj);
                }
            } else {
                ranges.push(range);
            }
        } else {
            ranges.push(range);
        }
        return ranges;
    }
    /**
     * Update all gantt data collection width, progress width and left value
     *
     * @returns {void} .
     * @private
     */
    public updateGanttData(): void {
        const flatData: IGanttData[] = this.parent.flatData;
        const length: number = flatData.length;
        this.systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        for (let i: number = 0; i < length; i++) {
            const data: IGanttData = flatData[i as number];
            this.updateTaskLeftWidth(data);
        }
    }

    private shouldProcessUpdateWidth(): boolean {
        return (!this.parent.autoCalculateDateScheduling ||
               (this.parent.isLoad && this.parent.treeGrid.loadChildOnDemand &&
                Boolean(this.parent.taskFields.hasChildMapping)));
    }

    /**
     * Update all gantt data collection width, progress width and left value
     *
     * @param {IGanttData} data .
     * @returns {void} .
     * @public
     */
    private updateTaskLeftWidth(data: IGanttData): void {
        const task: ITaskData = data.ganttProperties;
        if (!data.hasChildRecords || this.shouldProcessUpdateWidth()) {
            this.updateWidthLeft(data);
        }
        this.parent.setRecordValue('baselineLeft', this.calculateBaselineLeft(task), task, true);
        this.parent.setRecordValue('baselineWidth', this.calculateBaselineWidth(task), task, true);
        const parentItem: IGanttData = data.parentItem ? this.parent.getParentTask(data.parentItem) as IGanttData : null;
        const isLastChild: boolean = parentItem && parentItem.childRecords.slice(-1)[0] === data;
        if (parentItem) {
            if (isLastChild && !data.hasChildRecords && this.parent.enableValidation) {
                if ((this.parent.autoCalculateDateScheduling && !(this.parent.isLoad && this.parent.treeGrid.loadChildOnDemand &&
                    this.parent.taskFields.hasChildMapping)) || this.parent.viewType === 'ResourceView') {
                    this.updateParentItems(parentItem);
                }
                if (this.shouldProcessUpdateWidth()) {
                    this.updateWidthLeft(parentItem);
                }
            } else if (parentItem && !this.parent.enableValidation) {
                this.updateWidthLeft(parentItem);
            }
        }
    }

    /**
     * @returns {void} .
     * @private
     */
    public reUpdateGanttDataPosition(): void {
        let flatData: IGanttData[];
        if (this.parent.pdfExportModule && this.parent.pdfExportModule.isPdfExport && this.parent.pdfExportModule.helper.exportProps &&
            this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings
            && this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings.isFitToWidth) {
            flatData = this.parent.pdfExportModule.helper.beforeSinglePageExport['cloneFlatData'];
        }
        else {
            flatData = this.parent.flatData;
        }
        const length: number = flatData.length;
        for (let i: number = 0; i < length; i++) {
            const data: IGanttData = flatData[i as number];
            const task: ITaskData = data.ganttProperties;
            this.updateWidthLeft(data);
            if (this.parent.taskMode !== 'Auto' && data.hasChildRecords) {
                this.updateAutoWidthLeft(data);
            }
            this.parent.setRecordValue('baselineLeft', this.calculateBaselineLeft(task), task, true);
            this.parent.setRecordValue('baselineWidth', this.calculateBaselineWidth(task), task, true);
            this.parent.dataOperation.updateTaskData(data);
        }
    }

    /**
     * method to update left, width, progress width in record
     *
     * @param {IGanttData} data .
     * @returns {void} .
     * @private
     */
    public updateWidthLeft(data: IGanttData): void {
        const ganttRecord: ITaskData = data.ganttProperties;
        let totalSegmentsProgressWidth: number = 0;
        // task endDate may be changed in segment calculation so this must be calculated first.
        // task width calculating was based on endDate
        let progressResizer: number = 0;
        if (!isNullOrUndefined(ganttRecord.segments) && ganttRecord.segments.length > 0) {
            const segments: ITaskSegment[] = ganttRecord.segments;
            for (let i: number = 0; i < segments.length; i++) {
                const segment: ITaskSegment = segments[i as number];
                if (i === 0 && !isNullOrUndefined(ganttRecord.startDate)
                    && !isNullOrUndefined(segment.startDate) && !isNullOrUndefined(segment.startDate.getTime()) &&
                    segment.startDate.getTime() !== ganttRecord.startDate.getTime()) {
                    segment.startDate = ganttRecord.startDate;
                    const endDate: Date = this.parent.dataOperation.getEndDate(
                        segment.startDate, segment.duration, ganttRecord.durationUnit, ganttRecord, false
                    );
                    segment.endDate = this.parent.dataOperation.checkEndDate(endDate, ganttRecord, false);
                    this.parent.chartRowsModule.incrementSegments(segments, 0, data);
                }
                segment.width = this.getSplitTaskWidth(segment.startDate, segment.duration, data);
                totalSegmentsProgressWidth = totalSegmentsProgressWidth + segment.width;
                segment.showProgress = false;
                segment.progressWidth = -1;
                if (i !== 0) {
                    const pStartDate: Date = new Date(ganttRecord.startDate.getTime());
                    segment.left = this.getSplitTaskLeft(segment.startDate, pStartDate);
                }
            }
            let setProgress: number = this.parent.dataOperation.getProgressWidth(totalSegmentsProgressWidth, ganttRecord.progress);
            let isValid: boolean = true;
            for (let i: number = 0; i < segments.length; i++) {
                if (isValid) {
                    if (setProgress <= segments[i as number].width) {
                        segments[i as number].progressWidth = setProgress;
                        segments[i as number].showProgress = true;
                        isValid = false;
                    }
                    else {
                        segments[i as number].progressWidth = segments[i as number].width;
                        setProgress = setProgress - segments[i as number].progressWidth;
                    }
                    if (segments[i as number].showProgress) {
                        progressResizer = progressResizer + segments[i as number].left + segments[i as number].progressWidth;
                    }
                }
            }
            this.parent.setRecordValue('segments', ganttRecord.segments, ganttRecord, true);
            this.parent.dataOperation.updateMappingData(data, 'segments');
        }
        this.parent.setRecordValue('width', this.parent.dataOperation.calculateWidth(data), ganttRecord, true);
        this.parent.setRecordValue('left', this.parent.dataOperation.calculateLeft(ganttRecord), ganttRecord, true);
        if (!isNullOrUndefined(ganttRecord.segments) && ganttRecord.segments.length > 0) {
            this.parent.setRecordValue('progressWidth', progressResizer, ganttRecord, true);
        }
        else {
            this.parent.setRecordValue('progressWidth', this.parent.dataOperation.getProgressWidth((ganttRecord.isAutoSchedule || !data.hasChildRecords ? ganttRecord.width : ganttRecord.autoWidth), ganttRecord.progress), ganttRecord, true);
        }
    }
    /**
     * method to update left, width, progress width in record
     *
     * @param {IGanttData} data .
     * @returns {void} .
     * @private
     */
    public updateAutoWidthLeft(data: IGanttData): void {
        const ganttRecord: ITaskData = data.ganttProperties;
        this.parent.setRecordValue('autoWidth', this.calculateWidth(data, true), ganttRecord, true);
        this.parent.setRecordValue('autoLeft', this.calculateLeft(ganttRecord, true), ganttRecord, true);
        this.parent.setRecordValue('progressWidth', this.parent.dataOperation.getProgressWidth((ganttRecord.isAutoSchedule ||
                                   !data.hasChildRecords ? ganttRecord.width : ganttRecord.autoWidth), ganttRecord.progress),
                                   ganttRecord, true);
    }
    /**
     * To calculate parent progress value
     *
     * @param {IGanttData} childGanttRecord .
     * @returns {object} .
     * @private
     */
    public getParentProgress(childGanttRecord: IGanttData): Object {
        let durationInDay: number = 0;
        const progressValues: Object = {};
        let totSeconds: number;
        if (this.parent.weekWorkingTime.length > 0) {
            totSeconds = this.parent['getSecondsPerDay'](childGanttRecord.ganttProperties.startDate ? childGanttRecord.ganttProperties.startDate : childGanttRecord.ganttProperties.endDate);
        }
        else {
            totSeconds = this.parent.secondsPerDay;
        }
        switch (childGanttRecord.ganttProperties.durationUnit) {
        case 'hour':
            durationInDay = (childGanttRecord.ganttProperties.duration / (totSeconds / 3600));
            break;
        case 'minute':
            durationInDay = (childGanttRecord.ganttProperties.duration / (totSeconds / 60));
            break;
        default:
            durationInDay = childGanttRecord.ganttProperties.duration;
        }

        if (childGanttRecord.hasChildRecords) {
            setValue('totalProgress', childGanttRecord.ganttProperties.totalProgress, progressValues);
            setValue('totalDuration', childGanttRecord.ganttProperties.totalDuration ? childGanttRecord.ganttProperties.totalDuration : 0, progressValues);
        } else {
            setValue('totalProgress', childGanttRecord.ganttProperties.progress * durationInDay, progressValues);
            setValue('totalDuration', durationInDay, progressValues);
        }
        return progressValues;
    }

    private resetDependency(record: IGanttData): void {
        const dependency: string = this.parent.taskFields.dependency;
        if (!isNullOrUndefined(dependency)) {
            const recordProp: ITaskData = record.ganttProperties;
            this.parent.setRecordValue('predecessor', [], recordProp, true);
            this.parent.setRecordValue('predecessorsName', null, recordProp, true);
            this.parent.setRecordValue('taskData.' + dependency, null, record);
            this.parent.setRecordValue(dependency, null, record);
        }
    }

    private isUnscheduledTask(ganttProperties: ITaskData, parantData?: IGanttData): [boolean, string | null] {
        const properties: string[] = ['startDate', 'endDate', 'duration'];
        let count: number = 0;
        let filledProperty: string | null = null;
        for (const prop of properties) {
            if (ganttProperties && ganttProperties[prop as string]) {
                count++;
                filledProperty = prop;
            }
        }
        if (count === 1 || (count === 0 && !isNullOrUndefined(parantData) && parantData.hasChildRecords)) {
            return [true, filledProperty];
        } else {
            return [false, null];
        }
    }

    private isFromManual(childData: IGanttData): boolean {
        if (this.parent.allowUnscheduledTasks && this.parent.editModule && this.parent['oldRecords'] && this.parent['oldRecords'].length > 0 &&
            isNullOrUndefined(childData.ganttProperties.startDate) && isNullOrUndefined(childData.ganttProperties.endDate)
            && !isNullOrUndefined(childData.ganttProperties.duration) && !childData.hasChildRecords && childData.parentItem &&
            (this.parent.taskMode === 'Manual' || (this.parent.taskMode === 'Custom' && childData[this.parent.taskFields.manual]))) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * @param {IParent | IGanttData} cloneParent .
     * @param {boolean} isParent .
     * @returns {void} .
     * @private
     */
    public updateParentItems(cloneParent: IParent | IGanttData, isParent?: boolean): void {
        let parentData: IGanttData = isParent ? cloneParent : this.parent.getParentTask(cloneParent);
        parentData = parentData ? parentData : cloneParent;
        let deleteUpdate: boolean = false;
        const ganttProp: ITaskData = !isNullOrUndefined(parentData) ? parentData.ganttProperties : null;
        /* eslint-disable-next-line */
        const [isParentUnschecule, propertyWithValue] : [boolean, string] = this.isUnscheduledTask(ganttProp, parentData);
        if ((this.parent.autoCalculateDateScheduling && !(this.parent.isLoad && this.parent.treeGrid.loadChildOnDemand &&
            this.parent.taskFields.hasChildMapping)) || this.parent.viewType === 'ResourceView') {
            if (parentData && parentData.childRecords && parentData.childRecords.length > 0) {
                const previousStartDate: Date = ganttProp.isAutoSchedule ? ganttProp.startDate : ganttProp.autoStartDate;
                const previousEndDate: Date = ganttProp.isAutoSchedule ? ganttProp.endDate :
                    ganttProp.autoEndDate;
                const childRecords: Object[] = parentData.childRecords;
                const childLength: number = childRecords.length;
                let totalDuration: number = 0;
                let progressValues: Object = {};
                let minStartDate: Date = null; let maxEndDate: Date = null;
                let milestoneCount: number = 0; let totalProgress: number = 0; let childCompletedWorks: number = 0;
                let childData: IGanttData;
                let countOfScheduled: number = 0;
                let countOfUnScheduled: number = 0;
                childRecords.some((childRecord: IGanttData) => {
                    const [isUnscheduled, propertyWithValue]: [boolean, string] = this.isUnscheduledTask(childRecord['ganttProperties']);
                    if (isUnscheduled && propertyWithValue === 'duration') {
                        ++countOfUnScheduled;
                    } else if (!isUnscheduled) {
                        ++countOfScheduled;
                    }
                    if (countOfScheduled > 0 && countOfUnScheduled > 0) {
                        return true;
                    }
                    return false;
                });
                const isChildBoth: boolean = (countOfScheduled > 0 && countOfUnScheduled > 0) ? true : undefined;
                for (let count: number = 0; count < childLength; count++) {
                    childData = (this.parent.loadChildOnDemand && this.parent.taskFields.hasChildMapping) ?
                        this.parent.currentViewData.filter((item: IGanttData) =>
                            item.ganttProperties.taskId === childRecords[count as number][this.parent.taskFields.id])[0] :
                        childRecords[count as number] as IGanttData;
                    if (this.parent.isOnDelete && childData.isDelete) {
                        if (childLength === 1 && this.parent.viewType === 'ProjectView') {
                            deleteUpdate = true;
                        }
                        continue;
                    }
                    let startDate: Date;
                    let endDate: Date;
                    const [isUnscheduled, propertyWithValue]: [boolean, string] = this.isUnscheduledTask(childData.ganttProperties);
                    let parentRec: IGanttData;
                    if (this.isFromManual(childData)) {
                        const ganttRec: IGanttData = this.parent['oldRecords'].filter((record: IGanttData) => record.ganttProperties.uniqueID === childData.ganttProperties.uniqueID)[0];
                        if (ganttRec) {
                            parentRec = this.parent.getParentTask(ganttRec.parentItem);
                        }
                    }
                    const rec: IGanttData = parentRec ? parentRec : childData;
                    const prop: ITaskData = parentRec ? parentRec.ganttProperties : ganttProp;
                    startDate = ((isUnscheduled && (propertyWithValue !== 'startDate' && propertyWithValue !== 'endDate')) && !isParentUnschecule) ?
                        ganttProp.startDate : this.getValidStartDate(rec.ganttProperties);
                    if (parentData.hasChildRecords && !prop.isAutoSchedule
                        && !isNullOrUndefined(rec.ganttProperties.autoStartDate)) {
                        startDate = rec.ganttProperties.autoStartDate;
                    }
                    endDate = ((isUnscheduled && (propertyWithValue !== 'startDate' && propertyWithValue !== 'endDate')) && !isParentUnschecule) ?
                        ganttProp.endDate : this.getValidEndDate(rec.ganttProperties);
                    if (parentData.hasChildRecords && !prop.isAutoSchedule
                        && !isNullOrUndefined(rec.ganttProperties.autoEndDate)) {
                        endDate = rec.ganttProperties.autoEndDate;
                    }

                    if (isNullOrUndefined(minStartDate) &&
                        ((isChildBoth && !isUnscheduled) || (isNullOrUndefined(isChildBoth)))) {
                        minStartDate = this.getDateFromFormat(startDate);
                    }
                    if (isNullOrUndefined(maxEndDate) &&
                        ((isChildBoth && !isUnscheduled) || (isNullOrUndefined(isChildBoth)))) {
                        maxEndDate = this.getDateFromFormat(endDate);
                    }
                    if (!isNullOrUndefined(endDate) && maxEndDate && this.compareDates(endDate, maxEndDate) === 1) {
                        maxEndDate = this.getDateFromFormat(endDate);
                    }
                    if (!isNullOrUndefined(startDate) && minStartDate && this.compareDates(startDate, minStartDate) === -1) {
                        minStartDate = this.getDateFromFormat(startDate);
                    }
                    const condition: boolean = (!childData.ganttProperties.isMilestone &&
                       isScheduledTask(childData.ganttProperties)) ? true : false;
                    if (condition) {
                        progressValues = this.getParentProgress(childData);
                        totalProgress += getValue('totalProgress', progressValues);
                        if (childData[this.parent.taskFields.duration] < 1) {
                            totalDuration += getValue('totalDuration', progressValues);
                            totalDuration = Number(totalDuration.toFixed(4));
                        } else {
                            totalDuration += getValue('totalDuration', progressValues);
                        }

                    } else {
                        milestoneCount++;
                    }
                    const work: number = childData.ganttProperties.work;
                    if (typeof work === 'string') {
                    // If it's a string, convert it to a number
                        const numericValue: number = parseFloat(work);
                        if (!isNaN(numericValue)) {
                            childCompletedWorks += numericValue;
                        }
                    } else if (typeof work === 'number') {
                    // If it's already a number, simply add it to childCompletedWorks
                        childCompletedWorks += work;
                    }
                }
                if (!deleteUpdate) {
                    let taskCount: number;
                    if (this.parent.isOnDelete && childData.isDelete) {
                        taskCount = childLength - milestoneCount - 1;
                    } else {
                        taskCount = childLength - milestoneCount;
                    }
                    const parentProgress: number = (taskCount > 0 && totalDuration > 0) ?
                        Number((totalProgress / totalDuration).toFixed(2)) : 0;
                    const parentProp: ITaskData = parentData.ganttProperties;
                    const milestone: boolean = (taskCount === 0) && minStartDate && maxEndDate &&
                        minStartDate.getTime() === maxEndDate.getTime() ? true : false;
                    if (this.compareDates(previousStartDate, minStartDate) !== 0) {
                        this.parent.setRecordValue(
                            ganttProp.isAutoSchedule ? 'startDate' : 'autoStartDate',
                            minStartDate, parentData.ganttProperties, true);
                        if ((((!isNullOrUndefined(ganttProp.autoDuration)) ? ganttProp.autoDuration === 0 : ganttProp.duration === 0)) && parentData[this.parent.taskFields.manual] && milestone && (parentData.hasChildRecords && parentData.ganttProperties.isAutoSchedule && this.parent.editModule.taskbarEditModule.taskbarEditedArgs.action !== 'TaskbarEditing')) {
                            this.parent.setRecordValue('startDate', minStartDate, parentData.ganttProperties, true);
                        }
                    }
                    if (this.compareDates(previousEndDate, maxEndDate) !== 0) {
                        this.parent.setRecordValue(
                            ganttProp.isAutoSchedule ? 'endDate' : 'autoEndDate',
                            maxEndDate, parentData.ganttProperties, true);
                        if ((((!isNullOrUndefined(ganttProp.autoDuration)) ? ganttProp.autoDuration === 0 : ganttProp.duration === 0)) && parentData[this.parent.taskFields.manual] && milestone && (parentData.hasChildRecords && parentData.ganttProperties.isAutoSchedule && this.parent.editModule.taskbarEditModule.taskbarEditedArgs.action !== 'TaskbarEditing')) {
                            this.parent.setRecordValue('endDate', maxEndDate, parentData.ganttProperties, true);
                        }
                    }
                    this.parent.setRecordValue('isMilestone', milestone, parentProp, true);
                    if (!isNullOrUndefined(this.parent.taskFields.milestone)) {
                        this.updateMappingData(parentData, 'milestone');
                        this.parent.setRecordValue(this.parent.taskFields.milestone, milestone, parentData, true);
                        this.parent.setRecordValue('taskData.' + this.parent.taskFields.milestone, milestone, parentData, true);
                    }
                    if (parentProp.isAutoSchedule) {
                        if (this.isFromManual(childData)) {
                            if (parentData.childRecords.length === 1) {
                                parentData.ganttProperties.duration = childData.ganttProperties.duration;
                            }
                            this.calculateEndDate(parentData);
                        }
                        else {
                            this.calculateDuration(parentData);
                        }
                    }
                    this.updateWorkWithDuration(parentData);
                    let parentWork: number = parentProp.work;
                    parentWork = this.parent.isOnEdit ? parentWork : (parentWork + childCompletedWorks);
                    this.parent.setRecordValue('work', parentWork, parentProp, true);
                    this.parent.setRecordValue('taskType', 'FixedDuration', parentProp, true);
                    if (!isNullOrUndefined(this.parent.taskFields.type)) {
                        this.updateMappingData(parentData, 'type');
                    }
                    this.parent.setRecordValue('progress', Math.floor(parentProgress), parentProp, true);
                    this.parent.setRecordValue('totalProgress', totalProgress, parentProp, true);
                    this.parent.setRecordValue('totalDuration', totalDuration, parentProp, true);
                    this.parent.setRecordValue('autoDuration', parentProp.duration,  parentProp, true);
                    if (!parentProp.isAutoSchedule) {
                        this.parent.setRecordValue('autoDuration', this.calculateAutoDuration(parentProp), parentProp, true);
                        this.updateAutoWidthLeft(parentData);
                    }
                    if (!this.parent.allowParentDependency) {
                        this.resetDependency(parentData);
                    }
                    this.updateWidthLeft(parentData);
                    this.updateTaskData(parentData);
                }
            }
        } else {
            this.parent.setRecordValue('endDate', parentData.taskData[this.parent.taskFields.endDate], parentData.ganttProperties, true);
        }
        if (deleteUpdate && parentData.childRecords.length === 1 && parentData.ganttProperties.duration === 0) {
            this.parent.setRecordValue('isMilestone', true, parentData.ganttProperties, true);
            this.updateWidthLeft(parentData);
            this.updateTaskData(parentData);
        }
        const parentItem: IGanttData = !isNullOrUndefined(parentData) ?
            this.parent.getParentTask(parentData.parentItem) as IGanttData : null;
        if (parentItem) {
            if ((this.parent.autoCalculateDateScheduling && !(this.parent.isLoad && this.parent.treeGrid.loadChildOnDemand &&
                this.parent.taskFields.hasChildMapping)) || this.parent.viewType === 'ResourceView') {
                this.updateParentItems(parentItem);
            }
        }
        deleteUpdate = false;
    }
}
