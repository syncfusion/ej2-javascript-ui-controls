import { isNullOrUndefined, getValue, isBlazor, extend, setValue } from '@syncfusion/ej2-base';
import { getUid, ReturnType } from '@syncfusion/ej2-grids';
import { IGanttData, ITaskData, IParent, IWorkTimelineRanges, IWorkingTimeRange, ITaskSegment } from './interface';
import { DataManager, Query, Group, ReturnOption } from '@syncfusion/ej2-data';
import { isScheduledTask } from './utils';
import { Gantt } from './gantt';
import { DateProcessor } from './date-processor';
import { TaskFieldsModel, ColumnModel, ResourceFieldsModel } from '../models/models';
import { CObject } from './enum';

/**
 * To calculate and update task related values
 */
export class TaskProcessor extends DateProcessor {

    private recordIndex: number;
    private dataArray: Object[];
    private taskIds: Object[];
    private segmentCollection: Object[];
    private hierarchyData: Object[];

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
     * @private
     */
    public checkDataBinding(isChange?: boolean): void {
        if (isChange) {
            this.parent.flatData = [];
            this.parent.currentViewData = [];
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
            this.dataArray = this.parent.dataSource;
            this.processTimeline();
            this.cloneDataSource();
            this.parent.renderGantt(isChange);
        }
    }
    private processTimeline(): void {
        this.parent.processTimeline();
        if (!this.parent.enableValidation) {
            this.parent.dataOperation.calculateProjectDatesForValidatedTasks();
            this.parent.timelineModule.validateTimelineProp();
        }
    }
    private initDataSource(isChange?: boolean): void {
        let queryManager: Query = this.parent.query instanceof Query ? this.parent.query : new Query();
        queryManager.requiresCount();
        let dataManager: DataManager = this.parent.dataSource as DataManager;
        dataManager.executeQuery(queryManager).then((e: ReturnOption) => {
            this.dataArray = <Object[]>e.result;
            this.processTimeline();
            this.cloneDataSource();
            this.parent.renderGantt(isChange);
        }).catch((e: ReturnType) => {
            // Trigger action failure event
            this.parent.processTimeline();
            this.parent.renderGantt(isChange);
            this.parent.trigger('actionFailure', { error: e });
        });
    }
    private constructDataSource(dataSource: Object[]): void {
        let mappingData: Object[] = new DataManager(dataSource).executeLocal(new Query()
            .group(this.parent.taskFields.parentID));
        let rootData: Object[] = [];
        for (let i: number = 0; i < mappingData.length; i++) {
            let groupData: Group = mappingData[i];
            if (!isNullOrUndefined(groupData.key)) {
                let index: number = this.taskIds.indexOf(groupData.key.toString());
                if (index > -1) {
                    if (!isNullOrUndefined(groupData.key)) {
                        dataSource[index][this.parent.taskFields.child] = groupData.items;
                        continue;
                    }
                }
            }
            rootData.push.apply(rootData, groupData.items);
        }
        this.hierarchyData = this.dataReorder(dataSource, rootData);
    }
    private cloneDataSource(): void {
        let taskIdMapping: string = this.parent.taskFields.id;
        let parentIdMapping: string = this.parent.taskFields.parentID;
        let hierarchicalData: Object[] = [];
        if (!isNullOrUndefined(taskIdMapping) && !isNullOrUndefined(parentIdMapping)) {
            let data: object[] = [];
            for (let i: number = 0; i < this.dataArray.length; i++) {
                let tempData: Object = this.dataArray[i];
                data.push(extend({}, {}, tempData, true));
                if (!isNullOrUndefined(tempData[taskIdMapping])) {
                    this.taskIds.push(tempData[taskIdMapping].toString());
                }
            }
            if (!this.parent.taskFields.child) {
                this.parent.taskFields.child = 'Children';
            }
            this.constructDataSource(data);
            hierarchicalData = this.hierarchyData;
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
            let resources: Object[] = extend([], [], this.parent.resources, true) as Object[];
            let unassignedTasks: Object[] = [];
            this.constructResourceViewDataSource(resources, hierarchicalData, unassignedTasks);
            if (unassignedTasks.length > 0) {
                let record: Object = {};
                record[this.parent.resourceFields.id] = 0;
                record[this.parent.resourceFields.name] = this.parent.localeObj.getConstant('unassignedTask');
                record[this.parent.taskFields.child] = unassignedTasks;
                resources.push(record);
            }
            hierarchicalData = resources;
        }
        this.prepareDataSource(hierarchicalData);
    }
    /**
     * 
     * 
     */
    private constructResourceViewDataSource(resources: Object[], data: Object[], unassignedTasks: Object[]): void {
        for (let i: number = 0; i < data.length; i++) {
            let tempData: Object = data[i];
            let child: string = this.parent.taskFields.child;
            let resourceData: [] = tempData && tempData[this.parent.taskFields.resourceInfo];
            let resourceIdMapping: string = this.parent.resourceFields.id;
            if (!tempData[child] && resourceData && resourceData.length) {
                resourceData.forEach((resource: number | object) => {
                    let id: string = (typeof resource === 'object') ? resource[resourceIdMapping] :
                        resource;
                    for (let j: number = 0; j < resources.length; j++) {
                        if (resources[j][resourceIdMapping].toString() === id.toString()) {
                            if (resources[j][child]) {
                                resources[j][child].push(tempData);
                            } else {
                                resources[j][child] = [tempData];
                            }
                            break;
                        }
                    }
                });
            } else if (!tempData[child]) {
                unassignedTasks.push(tempData);
            }
            if (tempData[this.parent.taskFields.child] && tempData[this.parent.taskFields.child].length) {
                this.constructResourceViewDataSource(resources, tempData[this.parent.taskFields.child], unassignedTasks);
            }
        }
    }
    /**
     * Function to manipulate data-source
     * @hidden
     */
    private prepareDataSource(data: Object[]): void {
        this.prepareRecordCollection(data, 0);
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
            let value: string[] = this.parent.getTaskIds()[i].match(/(\d+|[A-z]+)/g);
            if (value[0] !== 'R') {
                let sharedRecords: IGanttData[] = [];
                let ids: string[] = [];
                this.parent.flatData.filter((data: IGanttData) => {
                    /* tslint:disable-next-line */
                    if (data.ganttProperties.taskId.toString() === value[1] && data.level !== 0) {
                        ids.push(data.ganttProperties.rowUniqueID);
                        sharedRecords.push(data);
                    }
                });
                for (let j: number = 0; j < sharedRecords.length; j++) {
                    sharedRecords[j].ganttProperties.sharedTaskUniqueIds = ids;
                }
            }
        }
    }
    private prepareRecordCollection(data: Object[], level: number, parentItem?: IGanttData): void {
        let length: number = data.length;
        for (let i: number = 0; i < length; i++) {
            let tempData: Object = data[i];
            if (!isNullOrUndefined(this.parent.taskFields.segmentId)) {
                let segmentData: Object[] = this.segmentCollection.
                    filter((x: Group) => x.key === tempData[this.parent.taskFields.id]);
                if (segmentData.length > 0) {
                    tempData[this.parent.taskFields.segments] = (segmentData as Group)[0].items;
                }
            }
            let ganttData: IGanttData = this.createRecord(tempData, level, parentItem, true);
            if (!this.parent.enableValidation) {
                this.updateTaskLeftWidth(ganttData);
            }
            ganttData.index = this.recordIndex++;
            this.parent.ids[ganttData.index] = ganttData.ganttProperties.rowUniqueID;
            this.parent.flatData.push(ganttData);
            this.parent.setTaskIds(ganttData);
            let childData: Object[] = tempData[this.parent.taskFields.child];
            if (this.parent.viewType === 'ResourceView' && isNullOrUndefined(childData)
                && isNullOrUndefined(ganttData.parentItem) && ganttData.level === 0) {
                let ganttProp: ITaskData = ganttData.ganttProperties;
                let parentData: IGanttData = ganttData;
                this.parent.setRecordValue(
                    ganttProp.isAutoSchedule ? 'startDate' : 'autoStartDate',
                    null, parentData.ganttProperties, true);
                this.parent.setRecordValue(
                    ganttProp.isAutoSchedule ? 'endDate' : 'autoEndDate',
                    null, parentData.ganttProperties, true);
                let parentProgress: number = 0;
                let parentProp: ITaskData = parentData.ganttProperties;
                this.parent.setRecordValue('isMilestone', false, parentProp, true);
                if (parentProp.isAutoSchedule) {
                    this.calculateDuration(parentData);
                }
                this.updateWorkWithDuration(parentData);
                let parentWork: number = parentProp.work;
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
                this.resetDependency(parentData);
                this.updateWidthLeft(parentData);
                this.updateTaskData(parentData);
            }
            if (!isNullOrUndefined(childData) && childData.length > 0) {
                this.prepareRecordCollection(childData, ganttData.level + 1, ganttData);
            }
        }
    }
    /**
     * Method to update custom field values in gantt record
     */
    private addCustomFieldValue(data: Object, ganttRecord: IGanttData): void {
        let columns: ColumnModel[] = this.parent.ganttColumns;
        let length: number = columns.length;
        if (length) {
            for (let i: number = 0; i < length; i++) {
                if (ganttRecord[columns[i].field] === undefined) {
                    this.parent.setRecordValue(columns[i].field, data[columns[i].field], ganttRecord);
                }
            }
        }
    }
    /**
     * To populate Gantt record
     * @param data 
     * @param level 
     * @param parentItem 
     * @param isLoad 
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    public createRecord(data: Object, level: number, parentItem?: IGanttData, isLoad?: boolean): IGanttData {
        let taskSettings: TaskFieldsModel = this.parent.taskFields;
        let resourceFields: ResourceFieldsModel = this.parent.resourceFields;
        let child: Object[] = data[taskSettings.child];
        let progress: number = data[taskSettings.progress];
        let id: string = null; let name: string = null;
        progress = progress ? parseFloat(progress.toString()) ? parseFloat(progress.toString()) : 0 : 0;
        let predecessors: string | number | object[] = data[taskSettings.dependency];
        let baselineStartDate: Date = this.getDateFromFormat(data[taskSettings.baselineStartDate], true);
        let baselineEndDate: Date = this.getDateFromFormat(data[taskSettings.baselineEndDate], true);
        let ganttData: IGanttData = {} as IGanttData;
        let ganttProperties: ITaskData = {} as ITaskData;
        let autoSchedule: boolean = (this.parent.taskMode === 'Auto') ? true :
            (this.parent.taskMode === 'Manual') ? false :
                data[taskSettings.manual] === true ? false : true;
        this.parent.setRecordValue('ganttProperties', ganttProperties, ganttData);
        if (!isNullOrUndefined(data[taskSettings.id])) {
            id = data[taskSettings.id];
            name = data[taskSettings.name];
            this.addTaskData(ganttData, data, isLoad);
        } else if (!isNullOrUndefined(data[resourceFields.id])) {
            id = data[resourceFields.id];
            name = data[resourceFields.name];
            this.addTaskData(ganttData, data, false);
        }
        this.parent.setRecordValue('taskId', id, ganttProperties, true);
        this.parent.setRecordValue('taskName', name, ganttProperties, true);
        if (taskSettings.parentID) {
            this.parent.setRecordValue('parentId', data[taskSettings.parentID], ganttProperties, true);
        }
        this.addCustomFieldValue(data, ganttData);
        this.parent.setRecordValue('isAutoSchedule', autoSchedule, ganttProperties, true);
        this.parent.setRecordValue('resourceInfo', this.setResourceInfo(data), ganttProperties, true);
        this.parent.setRecordValue('isMilestone', false, ganttProperties, true);
        this.updateResourceName(ganttData);
        this.calculateScheduledValues(ganttData, data, isLoad);
        this.parent.setRecordValue('baselineStartDate', this.checkBaselineStartDate(baselineStartDate), ganttProperties, true);
        // set default end time, if hour is 0
        if (baselineEndDate && baselineEndDate.getHours() === 0 && this.parent.defaultEndTime !== 86400) {
            this.setTime(this.parent.defaultEndTime, baselineEndDate);
        }
        this.parent.setRecordValue('baselineEndDate', this.checkBaselineEndDate(baselineEndDate), ganttProperties, true);
        this.parent.setRecordValue('progress', progress, ganttProperties, true);
        this.parent.setRecordValue('totalProgress', progress, ganttProperties, true);
        this.parent.setRecordValue('predecessorsName', predecessors, ganttProperties, true);
        this.parent.setRecordValue('indicators', data[taskSettings.indicators], ganttProperties, true);
        this.parent.setRecordValue('notes', data[taskSettings.notes], ganttProperties, true);
        this.parent.setRecordValue('cssClass', data[taskSettings.cssClass], ganttProperties, true);
        this.parent.setRecordValue('parentItem', this.getCloneParent(parentItem), ganttData);
        let parentUniqId: string = ganttData.parentItem ? ganttData.parentItem.uniqueID : null;
        this.parent.setRecordValue('parentUniqueID', parentUniqId, ganttData);
        if (this.parent.viewType === 'ResourceView' && !isNullOrUndefined(taskSettings.parentID)
            && !isNullOrUndefined(ganttData.parentItem)) {
            this.parent.setRecordValue('parentId', ganttData.parentItem.taskId, ganttProperties, true);
        }
        this.parent.setRecordValue('level', level, ganttData);
        this.parent.setRecordValue('uniqueID', getUid(this.parent.element.id + '_data_'), ganttData);
        this.parent.setRecordValue('uniqueID', ganttData.uniqueID, ganttProperties, true);
        this.parent.setRecordValue('childRecords', [], ganttData);
        this.parent.setRecordValue('baselineEndDate', this.checkBaselineEndDate(baselineEndDate), ganttProperties, true);
        if (!isNullOrUndefined(data[taskSettings.child]) && data[taskSettings.child].length > 0) {
            this.parent.setRecordValue('hasChildRecords', true, ganttData);
            this.parent.setRecordValue('isMilestone', false, ganttProperties, true);
            this.resetDependency(ganttData);
        } else {
            this.parent.setRecordValue('hasChildRecords', false, ganttData);
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
        }
        if (this.parent.viewType === 'ProjectView') {
            this.parent.setRecordValue('rowUniqueID', ganttProperties.taskId.toString(), ganttProperties, true);
        } else {
            let uniqueId: string = ganttData.uniqueID.replace(this.parent.element.id + '_data_', '');
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
        return ganttData;
    }

    private sortSegmentsData(segments: ITaskSegment[], onLoad: boolean, ganttProp: ITaskData): ITaskSegment[] {
        if (onLoad) {
            segments.sort((a: ITaskSegment, b: ITaskSegment) => {
                let startDate: string = this.parent.taskFields.startDate;
                return this.getDateFromFormat(a[startDate]).getTime() - this.getDateFromFormat(b[startDate]).getTime();
            });
        } else {
            segments.sort((a: ITaskSegment, b: ITaskSegment) => {
                return a.startDate.getTime() - b.startDate.getTime();
            });
        }
        return segments;
    }
    public setSegmentsInfo(data: IGanttData, onLoad: boolean): ITaskSegment[] {
        let taskSettings: TaskFieldsModel = this.parent.taskFields;
        let ganttSegments: ITaskSegment[] = [];
        let segments: ITaskSegment[];
        let sumOfDuration: number = 0;
        let remainingDuration: number = 0;
        let taskData: object[] = [];
        if (!isNullOrUndefined(this.parent.taskFields.segments)) {
            segments = onLoad ? data.taskData[this.parent.taskFields.segments] : data.ganttProperties.segments;
            if (!isNullOrUndefined(segments) && segments.length > 1) {
                this.sortSegmentsData(segments, onLoad, data.ganttProperties);
                for (let i: number = 0; i < segments.length; i++) {
                    let segment: ITaskSegment = segments[i];
                    let startDate: Date = onLoad ? segment[taskSettings.startDate] : segment.startDate;
                    let endDate: Date = onLoad ? segment[taskSettings.endDate] : segment.endDate;
                    let duration: number = onLoad ? segment[taskSettings.duration] : segment.duration;
                    startDate = this.getDateFromFormat(startDate);
                    startDate = this.checkStartDate(startDate, data.ganttProperties, false);
                    if (!isNullOrUndefined(duration)) {
                        endDate = this.getEndDate(startDate, duration, data.ganttProperties.durationUnit, data.ganttProperties, false);
                    } else {
                        endDate = this.checkEndDate(endDate, data.ganttProperties, false);
                        duration = this.getDuration(
                            startDate, endDate, data.ganttProperties.durationUnit,
                            data.ganttProperties.isAutoSchedule, data.ganttProperties.isMilestone);
                    }
                    if (taskSettings.duration) {
                        remainingDuration = data.ganttProperties.duration - sumOfDuration;
                        if (remainingDuration <= 0) {
                            continue;
                        }
                        duration = i === segments.length - 1 ? remainingDuration : remainingDuration > 0 &&
                                duration > remainingDuration ? remainingDuration : duration;
                        endDate = this.getEndDate(startDate, duration, data.ganttProperties.durationUnit, data.ganttProperties, false);
                    } else if (!taskSettings.duration && taskSettings.endDate) {
                        endDate = (!isNullOrUndefined(data.ganttProperties.endDate)) && endDate.getTime() >
                        data.ganttProperties.endDate.getTime() && i !== segments.length - 1 ? endDate : data.ganttProperties.endDate;
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
                    segment = {};
                    if (!(startDate && endDate) || !(startDate && duration)) {
                        break;
                    }
                    sumOfDuration += duration;
                    segment.startDate = startDate;
                    segment.endDate = endDate;
                    segment.duration = duration;
                    segment.width = 0;
                    segment.left = 0;
                    segment.segmentIndex = i;
                    ganttSegments.push(segment);
                    if (!isNullOrUndefined(ganttSegments[i - 1])) {
                        let offsetDuration: number = this.getDuration(
                            ganttSegments[i - 1].endDate, ganttSegments[i].startDate, data.ganttProperties.durationUnit,
                            data.ganttProperties.isAutoSchedule, data.ganttProperties.isMilestone);
                        segment.offsetDuration = offsetDuration;
                        if (offsetDuration < 1) {
                            segment.startDate = this.getEndDate(
                                ganttSegments[i - 1].endDate, 1, data.ganttProperties.durationUnit, data.ganttProperties, false
                            );
                            segment.startDate = this.checkStartDate(segment.startDate, data.ganttProperties, false);
                            segment.endDate = this.getEndDate(
                                segment.startDate, segment.duration, data.ganttProperties.durationUnit, data.ganttProperties, false
                            );
                            segment.endDate = segment.endDate > data.ganttProperties.endDate ? data.ganttProperties.endDate
                            : segment.endDate;
                            segment.offsetDuration = 1;
                        }

                    } else {
                        segment.offsetDuration = 0;
                    }
                    taskData.push(this.setSegmentTaskData(segment, segments[i]));
                }
                this.parent.setRecordValue('duration', sumOfDuration, data.ganttProperties, true);
                this.parent.setRecordValue('endDate', ganttSegments[ganttSegments.length - 1].endDate, data.ganttProperties, true);
                if (!isNullOrUndefined(taskSettings.endDate)) {
                    this.parent.setRecordValue(this.parent.taskFields.endDate, ganttSegments[ganttSegments.length - 1].endDate, data, true);
                }
                this.parent.setRecordValue('taskData.' + this.parent.taskFields.segments, taskData, data);
            }
        }
        if (ganttSegments.length > 1) {
            this.parent.setRecordValue('segments', ganttSegments, data.ganttProperties, true);
        } else {
            ganttSegments = null;
        }
        return ganttSegments;
    }

    private setSegmentTaskData(segments: ITaskSegment, segmenttaskData: ITaskSegment): ITaskSegment {
        let taskSettings: TaskFieldsModel = this.parent.taskFields;
        let taskData: Object = extend({}, {}, segmenttaskData, true);
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
     * @param ganttData
     */
    public updateWorkWithDuration(ganttData: IGanttData): void {
        let resources: Object[] = ganttData.ganttProperties.resourceInfo;
        let work: number = 0;
        if (!isNullOrUndefined(resources)) {
            let resourcesLength: number = resources.length;
            let index: number;
            let resourceUnit: number;
            let resourceOneDayWork: number;
            let actualOneDayWork: number = (this.parent.secondsPerDay) / 3600;
            let durationInDay: number = this.getDurationInDay(ganttData.ganttProperties.duration, ganttData.ganttProperties.durationUnit);
            for (index = 0; index < resourcesLength; index++) {
                resourceUnit = resources[index][this.parent.resourceFields.unit]; //in percentage 
                resourceOneDayWork = resourceUnit > 0 ? (actualOneDayWork * resourceUnit) / 100 : actualOneDayWork; //in hours
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
        this.parent.setRecordValue('work', work, ganttData.ganttProperties, true);
        if (!isNullOrUndefined(this.parent.taskFields.work)) {
            this.parent.dataOperation.updateMappingData(ganttData, 'work');
        }
    }

    /**
     * 
     * @param record 
     * @param parent 
     * @private
     */
    public getCloneParent(parent: IGanttData): IParent {
        if (!isNullOrUndefined(parent)) {
            let cloneParent: IParent = {};
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
     * @private
     */
    public reUpdateResources(): void {
        if (this.parent.flatData.length > 0) {
            let data: ITaskData;
            let ganttProperties: ITaskData;
            let ganttData: IGanttData;
            for (let index: number = 0; index < this.parent.flatData.length; index++) {
                data = this.parent.flatData[index].taskData;
                ganttProperties = this.parent.flatData[index].ganttProperties;
                ganttData = this.parent.flatData[index];
                this.parent.setRecordValue('resourceInfo', this.setResourceInfo(data), ganttProperties, true);
                this.updateResourceName(ganttData);
            }
        }
    }
    private addTaskData(ganttData: IGanttData, data: Object, isLoad: boolean): void {
        let taskSettings: TaskFieldsModel = this.parent.taskFields;
        let dataManager: Object[] | DataManager = this.parent.dataSource;
        if (isLoad) {
            if (taskSettings.parentID || (dataManager instanceof DataManager &&
                dataManager.dataSource.json && dataManager.dataSource.offline)) {
                if (taskSettings.parentID) {
                    let id: string = data[taskSettings.id];
                    let index: number = this.taskIds.indexOf(id.toString());
                    let tempData: object = (index > -1) ? this.dataArray[index] : {};
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
        let expandStateMapping: string = this.parent.taskFields.expandState;
        let mappingValue: string = data[expandStateMapping];
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
     * 
     */
    private setValidatedDates(ganttData: IGanttData, data: Object): void {
        let ganttProperties: ITaskData = ganttData.ganttProperties;
        let taskSettings: TaskFieldsModel = this.parent.taskFields;
        let duration: string = data[taskSettings.duration];
        let startDate: Date = this.getDateFromFormat(data[taskSettings.startDate], true);
        let endDate: Date = this.getDateFromFormat(data[taskSettings.endDate], true);
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
     * @param ganttData 
     * @param data 
     * @param isLoad 
     * @private
     */
    public calculateScheduledValues(ganttData: IGanttData, data: Object, isLoad: boolean): void {
        let taskSettings: TaskFieldsModel = this.parent.taskFields;
        let ganttProperties: ITaskData = ganttData.ganttProperties;
        let duration: string = data[taskSettings.duration];
        duration = isNullOrUndefined(duration) || duration === '' ? null : duration;
        let startDate: Date = this.getDateFromFormat(data[taskSettings.startDate], true);
        let endDate: Date = this.getDateFromFormat(data[taskSettings.endDate], true);
        let segments: ITaskSegment[] = taskSettings.segments ? (data[taskSettings.segments] ||
            ganttData.taskData[taskSettings.segments]) : null;
        let isMileStone: boolean = taskSettings.milestone ? data[taskSettings.milestone] ? true : false : false;
        let durationMapping: string = data[taskSettings.durationUnit] ? data[taskSettings.durationUnit] : '';
        this.parent.setRecordValue('durationUnit', this.validateDurationUnitMapping(durationMapping), ganttProperties, true);
        let work: number = !isNullOrUndefined(data[taskSettings.work]) ? parseFloat(data[taskSettings.work]) : 0;
        this.parent.setRecordValue('workUnit', this.validateWorkUnitMapping(this.parent.workUnit), ganttProperties, true);
        let taskTypeMapping: string = data[taskSettings.type] ? data[taskSettings.type] : '';
        let tType: string = this.validateTaskTypeMapping(taskTypeMapping);
        this.parent.setRecordValue('taskType', tType, ganttProperties, true);

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
        if (!isNullOrUndefined(segments)) {
            this.parent.setRecordValue('segments', this.setSegmentsInfo(ganttData, true), ganttProperties, true);
        }
        if (ganttProperties.duration === 0) {
            this.parent.setRecordValue('isMilestone', true, ganttProperties, true);
            this.parent.setRecordValue('endDate', ganttProperties.startDate, ganttProperties, true);
        }
        if (!isNullOrUndefined(isMileStone) && isMileStone) {
            this.parent.setRecordValue('duration', 0, ganttProperties, true);
            this.parent.setRecordValue('isMilestone', true, ganttProperties, true);
            this.parent.setRecordValue('endDate', ganttProperties.startDate, ganttProperties, true);
        }
        if (!isNullOrUndefined(taskSettings.work)) {
            this.parent.setRecordValue('durationUnit', this.parent.durationUnit, ganttProperties, true);
            if (isNaN(work) || isNullOrUndefined(work)) {
                this.parent.setRecordValue('work', 0, ganttProperties, true);
                this.parent.setRecordValue('duration', 0, ganttProperties, true);
                this.parent.setRecordValue('isMilestone', true, ganttProperties, true);
                this.parent.setRecordValue('endDate', ganttProperties.startDate, ganttProperties, true);
            } else {
                this.parent.setRecordValue('work', work, ganttProperties, true);
                switch (tType) {
                    case 'FixedDuration':
                        this.updateUnitWithWork(ganttData);
                        break;
                    case 'FixedWork':
                        this.updateUnitWithWork(ganttData);
                        break;
                    case 'FixedUnit':
                        this.updateDurationWithWork(ganttData);
                        break;
                }
                if (!isNullOrUndefined(taskSettings.type)) {
                    this.parent.dataOperation.updateMappingData(ganttData, 'type');
                }
                if (ganttProperties.duration === 0) {
                    this.parent.setRecordValue('isMilestone', true, ganttProperties, true);
                    this.parent.setRecordValue('endDate', ganttProperties.startDate, ganttProperties, true);
                } else if (!isNullOrUndefined(ganttProperties.startDate) && !isNullOrUndefined(ganttProperties.duration)) {
                    this.parent.setRecordValue('isMilestone', false, ganttProperties, true);
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
     * @param ganttData 
     */
    public updateDurationWithWork(ganttData: IGanttData): void {
        let ganttProperties: ITaskData = ganttData.ganttProperties;
        let resources: Object[] = ganttProperties.resourceInfo;
        if (!isNullOrUndefined(resources)) {
            let resourcesLength: number = !isNullOrUndefined(resources) ? resources.length : 0;
            let totalResourceOneDayWork: number = 0;
            let actualOneDayWork: number = (this.parent.secondsPerDay) / 3600;
            let updatedDuration: number = 0;
            let resourceUnit: number;
            let index: number;
            let totalHours: number;
            for (index = 0; index < resourcesLength; index++) {
                resourceUnit = resources[index][this.parent.resourceFields.unit]; //in percentage 
                totalResourceOneDayWork += (resourceUnit > 0 ? (actualOneDayWork * resourceUnit) / 100 : actualOneDayWork); //in hours
            }
            totalHours = this.getWorkInHour(ganttProperties.work, ganttProperties.workUnit);
            if (resourcesLength > 0) {
                updatedDuration += (totalHours / totalResourceOneDayWork);
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
        }
    }
    /**
     * Update units of resources with respect to duration and work of a task.
     * @param ganttData 
     */
    public updateUnitWithWork(ganttData: IGanttData): void {
        let ganttProperties: ITaskData = ganttData.ganttProperties;
        let resources: Object[] = ganttProperties.resourceInfo;
        let resourcesLength: number = !isNullOrUndefined(resources) ? resources.length : 0;
        let actualOneDayWork: number = (this.parent.secondsPerDay) / 3600;
        if (resourcesLength === 0) {
            return;
        }
        let durationInDay: number = this.getDurationInDay(ganttData.ganttProperties.duration, ganttData.ganttProperties.durationUnit);
        let totalHours: number = this.getWorkInHour(ganttProperties.work, ganttProperties.workUnit);
        let totalUnitInPercentage: number = durationInDay > 0 ? (totalHours / (durationInDay * actualOneDayWork)) * 100 : 0;
        let individualUnit: number = totalUnitInPercentage > 0 ? totalUnitInPercentage / resourcesLength : 100;
        //To check the decimal places.
        if (individualUnit % 1 !== 0) {
            individualUnit = parseFloat(individualUnit.toFixed(2));
        }
        for (let index: number = 0; index < resourcesLength; index++) {
            resources[index][this.parent.resourceFields.unit] = individualUnit;
        }
        //To update the unit value in data source
        this.updateResourceName(ganttData);
    }
    private calculateDateFromEndDate(endDate: Date, duration: string, ganttData: IGanttData): void {
        let ganttProperties: ITaskData = ganttData.ganttProperties;

        if (endDate.getHours() === 0 && this.parent.defaultEndTime !== 86400) {
            this.setTime(this.parent.defaultEndTime, endDate);
        }
        let validateAsMilestone: boolean = (parseInt(duration, 10) === 0) ? true : null;
        /* tslint:disable-next-line */
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
        let ganttProperties: ITaskData = ganttData.ganttProperties;
        let validateAsMilestone: boolean = (parseInt(duration, 10) === 0 || ((startDate && endDate) &&
            (new Date(startDate.getTime()) === new Date(endDate.getTime())))) ? true : null;
        /* tslint:disable-next-line */
        this.parent.setRecordValue('startDate', this.checkStartDate(startDate, ganttProperties, validateAsMilestone, isLoad), ganttProperties, true);
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
            if (endDate.getHours() === 0 && this.parent.defaultEndTime !== 86400) {
                this.setTime(this.parent.defaultEndTime, endDate);
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
            this.calculateEndDate(ganttData);
        }
    }
    /**
     * 
     * @param parentWidth 
     * @param percent 
     * @private
     */
    public getProgressWidth(parentWidth: number, percent: number): number {
        return (parentWidth * percent) / 100;
    }
    /**
     * 
     * @param ganttProp 
     * @private
     */
    public calculateWidth(ganttData: IGanttData, isAuto?: boolean): number {
        let ganttProp: ITaskData = ganttData.ganttProperties;
        let sDate: Date = isAuto ? ganttProp.autoStartDate : ganttProp.startDate;
        let eDate: Date = isAuto ? ganttProp.autoEndDate : ganttProp.endDate;
        let unscheduledTaskWidth: number = 3;
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
            return this.getTaskWidth(sDate, eDate);
        }
    }

    private getTaskbarHeight(): number {
        let rowHeight: number = this.parent.rowHeight;
        let taskBarHeight: number = this.parent.taskbarHeight;
        if (taskBarHeight < rowHeight) {
            return taskBarHeight;
        } else {
            return rowHeight;
        }
    }
    /**
     * Method to calculate left 
     * @param ganttProp 
     * @private
     */
    public calculateLeft(ganttProp: ITaskData, isAuto?: boolean): number {
        let sDate: Date = null; let left: number = -300;
        let startDate: Date = isAuto ? ganttProp.autoStartDate : ganttProp.startDate;
        let endDate: Date = isAuto ? ganttProp.autoEndDate : ganttProp.endDate;
        let duration: number = isAuto ? ganttProp.autoDuration : ganttProp.duration;
        let milestone: boolean = ganttProp.isMilestone;
        if (startDate) {
            sDate = new Date(startDate.getTime());
        } else if (endDate) {
            sDate = new Date(endDate.getTime());
            milestone = true;
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
     * @param {ITaskData} ganttProperties - Defines the gantt data. 
     * @private
     */
    public calculateAutoLeft(ganttProperties: ITaskData): number {
        return this.getTaskLeft(ganttProperties.autoStartDate, ganttProperties.isMilestone);
    }
    /**
     * To calculate duration of Gantt record with auto scheduled start date and auto scheduled end date
     * @param {ITaskData} ganttProperties - Defines the gantt data. 
     */
    public calculateAutoDuration(ganttProperties: ITaskData): number {
        return this.getDuration(
            ganttProperties.autoStartDate, ganttProperties.autoEndDate, ganttProperties.durationUnit,
            false, ganttProperties.isMilestone);
    }
    /**
     * calculate the with between auto scheduled start date and auto scheduled end date
     * @param {ITaskData} ganttProperties - Defines the gantt data. 
     * @private
     */
    public calculateAutoWidth(ganttProperties: ITaskData): number {
        return this.getTaskWidth(ganttProperties.autoStartDate, ganttProperties.autoEndDate);
    }
    /**
     * calculate the left margin of the baseline element
     * @param ganttData 
     * @private
     */
    public calculateBaselineLeft(ganttProperties: ITaskData): number {
        let baselineStartDate: Date = this.getDateFromFormat(ganttProperties.baselineStartDate);
        let baselineEndDate: Date = this.getDateFromFormat(ganttProperties.baselineEndDate);
        if (baselineStartDate && baselineEndDate) {
            return (this.getTaskLeft(baselineStartDate, ganttProperties.isMilestone));
        } else {
            return 0;
        }
    }
    /**
     * calculate the width between baseline start date and baseline end date.
     * @private
     */
    public calculateBaselineWidth(ganttProperties: ITaskData): number {
        let baselineStartDate: Date = this.getDateFromFormat(ganttProperties.baselineStartDate);
        let baselineEndDate: Date = this.getDateFromFormat(ganttProperties.baselineEndDate);
        if (baselineStartDate && baselineEndDate) {
            return (this.getTaskWidth(baselineStartDate, baselineEndDate));
        } else {
            return 0;
        }
    }
    /**
     * To get tasks width value
     * @param startDate 
     * @param endDate 
     * @private
     */
    public getTaskWidth(startDate: Date, endDate: Date): number {
        let sDate: Date = new Date(startDate.getTime()); let eDate: Date = new Date(endDate.getTime());
        let tierMode: string = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.bottomTier :
            this.parent.timelineModule.topTier;
        if (tierMode === 'Day') {
            if (this.getSecondsInDecimal(sDate) === this.parent.defaultStartTime) {
                sDate.setHours(0, 0, 0, 0);
            }
            if (this.getSecondsInDecimal(eDate) === this.parent.defaultEndTime) {
                eDate.setHours(24);
            }
            if (this.getSecondsInDecimal(eDate) === this.parent.defaultStartTime) {
                eDate.setHours(0, 0, 0, 0);
            }
        }
        return ((this.getTimeDifference(sDate, eDate) / (1000 * 60 * 60 * 24)) * this.parent.perDayWidth);
    }
    /**
     * Get task left value
     * @param startDate 
     * @param isMilestone 
     * @private
     */
    public getTaskLeft(startDate: Date, isMilestone: boolean): number {
        let date: Date = new Date(startDate.getTime());
        let tierMode: string = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.bottomTier :
            this.parent.timelineModule.topTier;
        if (tierMode === 'Day') {
            if (this.getSecondsInDecimal(date) === this.parent.defaultStartTime) {
                date.setHours(0, 0, 0, 0);
            } else if (isMilestone && this.getSecondsInDecimal(date) === this.parent.defaultEndTime) {
                date.setHours(24);
            }
        }
        let timelineStartDate: Date = this.parent.timelineModule.timelineStartDate;
        if (timelineStartDate) {
            return (date.getTime() - timelineStartDate.getTime()) / (1000 * 60 * 60 * 24) * this.parent.perDayWidth;
        } else {
            return 0;
        }
    }

    public getSplitTaskWidth(sDate: Date, duration: number, data: IGanttData): number {
        let startDate: Date = new Date(sDate.getTime());
        let endDate: Date =
            new Date((this.getEndDate(startDate, duration, data.ganttProperties.durationUnit, data.ganttProperties, false).getTime()));
        let tierViewMode: string = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.bottomTier :
            this.parent.timelineModule.topTier;
        if (tierViewMode === 'Day') {
            if (this.getSecondsInDecimal(startDate) === this.parent.defaultStartTime) {
                startDate.setHours(0, 0, 0, 0);
            }
            if (this.getSecondsInDecimal(endDate) === this.parent.defaultEndTime) {
                endDate.setHours(24);
            }
            if (this.getSecondsInDecimal(endDate) === this.parent.defaultStartTime) {
                endDate.setHours(0, 0, 0, 0);
            }
        }
        return ((this.getTimeDifference(startDate, endDate) / (1000 * 60 * 60 * 24)) * this.parent.perDayWidth);
    }
    public getSplitTaskLeft(sDate: Date, segmentTaskStartDate: Date): number {
        let stDate: Date = new Date(sDate.getTime());
        let tierViewMode: string = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.bottomTier :
            this.parent.timelineModule.topTier;
        if (tierViewMode === 'Day') {
            if (this.getSecondsInDecimal(stDate) === this.parent.defaultStartTime) {
                stDate.setHours(0, 0, 0, 0);
            }
            if (this.getSecondsInDecimal(segmentTaskStartDate) === this.parent.defaultStartTime) {
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
     * @param ganttData 
     * @param fieldName 
     * @private
     */
    public updateMappingData(ganttData: IGanttData, fieldName: string): void {
        let columnMapping: Object = this.parent.columnMapping;
        let ganttProp: ITaskData = ganttData.ganttProperties;
        if (isNullOrUndefined(columnMapping[fieldName]) && fieldName !== 'taskType' && fieldName !== 'segments') {
            return;
        }
        if (fieldName === 'predecessorName') {
            //
        } else if (fieldName === 'resourceInfo') {
            let resourceData: Object[] = ganttProp.resourceInfo;
            let resourceSettings: ResourceFieldsModel = this.parent.resourceFields;
            let resourcesId: number[] = []; let resourcesName: string[] = [];
            for (let i: number = 0; i < resourceData.length; i++) {
                resourcesId.push(resourceData[i][resourceSettings.id]);
                let resName: string = resourceData[i][resourceSettings.name];
                let resourceUnit: number = resourceData[i][resourceSettings.unit];
                if (resourceUnit !== 100) {
                    resName += '[' + resourceUnit + '%' + ']';
                }
                resourcesName.push(resName);
            }
            this.parent.setRecordValue('resourceNames', resourcesName.join(','), ganttProp, true);
            this.updateTaskDataResource(ganttData);
            this.parent.setRecordValue(columnMapping[fieldName], resourcesName.join(','), ganttData);
        } else if (fieldName === 'startDate' || fieldName === 'endDate') {
            this.setRecordDate(ganttData, ganttProp[fieldName], columnMapping[fieldName]);
        } else if (fieldName === 'duration') {
            this.setRecordDuration(ganttData, columnMapping[fieldName]);
        } else if (fieldName === 'work') {
            this.parent.setRecordValue(
                'taskData.' + columnMapping[fieldName],
                this.getWorkString(ganttProp.work, ganttProp.workUnit), ganttData);
            this.parent.setRecordValue(columnMapping[fieldName], ganttProp[fieldName], ganttData);
        } else if (fieldName === 'type') {
            this.parent.setRecordValue('taskData.' + columnMapping[fieldName], ganttProp[fieldName], ganttData);
            this.parent.setRecordValue(columnMapping[fieldName], ganttProp[fieldName], ganttData);
        } else if (fieldName === 'manual') {
            this.parent.setRecordValue('taskData.' + columnMapping[fieldName], !ganttProp.isAutoSchedule, ganttData);
            this.parent.setRecordValue(columnMapping[fieldName], !ganttProp.isAutoSchedule, ganttData);
        } else if (fieldName === 'segments') {
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.segments, this.segmentTaskData(ganttData), ganttData);
        } else {
            this.parent.setRecordValue('taskData.' + columnMapping[fieldName], ganttProp[fieldName], ganttData);
            this.parent.setRecordValue(columnMapping[fieldName], ganttProp[fieldName], ganttData);
        }
    }

    private segmentTaskData(data: IGanttData): object[] {
        let segments: ITaskSegment[] = data.ganttProperties.segments;
        let taskSettings: TaskFieldsModel = this.parent.taskFields;
        if (isNullOrUndefined(segments)) {
            return null;
        }
        let taskData: Object[] = <Object[]>extend([], [], data.taskData[taskSettings.segments], true);
        for (let i: number = 0; i < segments.length; i++) {
            if ((this.parent.editModule && this.parent.editModule.dialogModule &&
                getValue('isEdit', this.parent.editModule.dialogModule)) || (this.parent.contextMenuModule &&
                     getValue('isEdit', this.parent.contextMenuModule))) {
                taskData[i] = {};
            }
            if (!isNullOrUndefined(taskSettings.startDate)) {
                taskData[i][this.parent.taskFields.startDate] = segments[i].startDate;
            }
            if (!isNullOrUndefined(taskSettings.endDate)) {
                taskData[i][this.parent.taskFields.endDate] = segments[i].endDate;
            }
            if (!isNullOrUndefined(taskSettings.duration)) {
                taskData[i][this.parent.taskFields.duration] = Number(segments[i].duration);
            }
        }
        return taskData;
    }
    /**
     * Method to update the task data resource values
     */
    private updateTaskDataResource(ganttData: IGanttData): void {
        let resourceData: Object[] = ganttData.ganttProperties.resourceInfo;
        let preTaskResources: Object[] = ganttData.taskData[this.parent.taskFields.resourceInfo];
        let resourceSettings: ResourceFieldsModel = this.parent.resourceFields;
        if (isNullOrUndefined(preTaskResources)) {
            ganttData.taskData[this.parent.taskFields.resourceInfo] = resourceData;
        } else if (resourceData.length) {
            for (let i: number = 0; i < resourceData.length; i++) {
                let isAdded: boolean = false;
                for (let j: number = 0; j < preTaskResources.length; j++) {
                    if (typeof preTaskResources[j] === 'number' || typeof preTaskResources[j] === 'string') {
                        if (parseInt(preTaskResources[j] as string, 10) === parseInt(resourceData[i][resourceSettings.id], 10)) {
                            preTaskResources[j] = resourceData[i];
                            isAdded = true;
                            break;
                        }
                        /* tslint:disable-next-line */
                    } else if (preTaskResources[j][resourceSettings.id] === resourceData[i][resourceSettings.id] && typeof preTaskResources[j] !== 'number') {
                        preTaskResources[j] = extend({}, preTaskResources[j], resourceData[i], true);
                        isAdded = true;
                        break;
                    }
                }
                if (!isAdded) {
                    preTaskResources.push(resourceData[i]);
                }
            }
            let data: IGanttData[] = [];
            for (let k: number = 0; k < preTaskResources.length; k++) {
                resourceData.filter((resourceInfo: Object) => {
                    /* tslint:disable-next-line */
                    if (resourceInfo[resourceSettings.id] === preTaskResources[k][resourceSettings.id]) {
                        data.push(preTaskResources[k]);
                    }
                });
            }
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.resourceInfo, data, ganttData);
        } else {
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.resourceInfo, [], ganttData);
        }
    }

    private setRecordDate(task: IGanttData, value: Date | string, mapping: string): void {
        let tempDate: Date = typeof value === 'string' ? new Date(value as string) : value;
        if (!isNullOrUndefined(value)) {
            value = new Date(tempDate.getTime());
        }
        this.parent.setRecordValue(mapping, value, task);
        if (!isNullOrUndefined(value)) {
            value = new Date(tempDate.getTime());
        }
        this.parent.setRecordValue('taskData.' + mapping, value, task);
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
        let duration: number = task.ganttProperties.duration;
        let durationUnit: string = task.ganttProperties.durationUnit;
        if (!isNullOrUndefined(duration)) {
            this.parent.setRecordValue(mapping, task.ganttProperties.duration, task);
            /* tslint:disable-next-line:no-any */
            let durationValue: any = (getValue(mapping, task.taskData));
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
     * @param ganttData 
     * @private
     */
    public updateTaskData(ganttData: IGanttData): void {
        let dataMapping: TaskFieldsModel = this.parent.taskFields;
        let ganttProperties: ITaskData = ganttData.ganttProperties;
        if (!isNullOrUndefined(ganttData.taskData)) {
            let data: Object = ganttData.taskData;
            if (dataMapping.id) {
                this.parent.setRecordValue('taskData.' + dataMapping.id, ganttProperties.taskId, ganttData);
                this.parent.setRecordValue(dataMapping.id, ganttProperties.taskId, ganttData);
            }
            if (dataMapping.name) {
                this.parent.setRecordValue('taskData.' + dataMapping.name, ganttProperties.taskName, ganttData);
                this.parent.setRecordValue(dataMapping.name, ganttProperties.taskName, ganttData);
            }
            if (dataMapping.startDate) {
                this.setRecordDate(ganttData, ganttProperties.startDate, dataMapping.startDate);
            }
            if (dataMapping.endDate) {
                this.setRecordDate(ganttData, ganttProperties.endDate, dataMapping.endDate);
            }
            if (dataMapping.duration) {
                this.setRecordDuration(ganttData, dataMapping.duration);
            }
            if (dataMapping.durationUnit) {
                data[dataMapping.durationUnit] = ganttProperties.durationUnit;
            }
            if (dataMapping.progress) {
                this.parent.setRecordValue('taskData.' + dataMapping.progress, ganttProperties.progress, ganttData);
                this.parent.setRecordValue(dataMapping.progress, ganttProperties.progress, ganttData);
            }
            if (dataMapping.baselineStartDate) {
                this.setRecordDate(ganttData, ganttProperties.baselineStartDate, dataMapping.baselineStartDate);
            }
            if (dataMapping.baselineEndDate) {
                this.setRecordDate(ganttData, ganttProperties.baselineEndDate, dataMapping.baselineEndDate);
            }
            if (dataMapping.notes) {
                this.parent.setRecordValue('taskData.' + dataMapping.notes, ganttProperties.notes, ganttData);
                this.parent.setRecordValue(dataMapping.notes, ganttProperties.notes, ganttData);
            }
            if (dataMapping.cssClass) {
                this.parent.setRecordValue('taskData.' + dataMapping.cssClass, ganttProperties.cssClass, ganttData);
                this.parent.setRecordValue(dataMapping.cssClass, ganttProperties.cssClass, ganttData);
            }
            if (dataMapping.indicators) {
                this.parent.setRecordValue('taskData.' + dataMapping.indicators, ganttProperties.indicators, ganttData);
                this.parent.setRecordValue(dataMapping.indicators, ganttProperties.indicators, ganttData);
            }
            if (dataMapping.parentID) {
                this.parent.setRecordValue('taskData.' + dataMapping.parentID, ganttProperties.parentId, ganttData);
                this.parent.setRecordValue(dataMapping.parentID, ganttProperties.parentId, ganttData);
            }
            if (dataMapping.work) {
                this.parent.setRecordValue(
                    'taskData.' + dataMapping.work,
                    this.getWorkString(ganttProperties.work, ganttProperties.workUnit), ganttData);
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
     * @private
     */
    public setResourceInfo(data: Object): Object[] {
        let resourceIdCollection: object[];
        if (isNullOrUndefined(data[this.parent.taskFields.resourceInfo])) {
            return resourceIdCollection;
        }
        resourceIdCollection = data[this.parent.taskFields.resourceInfo];
        let resourceData: Object[];
        if (!isNullOrUndefined(this.parent.editModule) && !isNullOrUndefined(this.parent.editModule.dialogModule)
            && this.parent.editModule.dialogModule.isAddNewResource) {
            resourceData = this.parent.editModule.dialogModule.ganttResources;
        } else {
            resourceData = this.parent.resources;
        }
        let resourceIDMapping: string = this.parent.resourceFields.id;
        let resourceUnitMapping: string = this.parent.resourceFields.unit;
        let resourceGroup: string = this.parent.resourceFields.group;
        let resources: Object[] = [];
        for (let count: number = 0; count < resourceIdCollection.length; count++) {
            let resource: Object[] = resourceData.filter((resourceInfo: Object) => {
                if (typeof (resourceIdCollection[count]) === 'object' &&
                    resourceIdCollection[count][resourceIDMapping] === resourceInfo[resourceIDMapping]) {
                    return true;
                } else {
                    return (resourceIdCollection[count] === resourceInfo[resourceIDMapping]);
                }
            });
            let ganttDataResource: Object = extend({}, resource[0]);
            resources.push(ganttDataResource);
            if (!isNullOrUndefined(resourceUnitMapping) && !isNullOrUndefined(resourceIdCollection[count][resourceUnitMapping])) {
                ganttDataResource[resourceUnitMapping] = resourceIdCollection[count][resourceUnitMapping];
            }
            if (!isNullOrUndefined(resourceGroup) && !isNullOrUndefined(resourceIdCollection[count][resourceGroup])) {
                ganttDataResource[resourceGroup] = resourceIdCollection[count][resourceGroup];
            }
        }
        this.updateResourceUnit(resources);
        return resources;
    }
    /**
     * To set resource unit in Gantt record
     * @private
     */
    public updateResourceUnit(resourceData: Object[]): void {
        let resourceUnit: string = this.parent.resourceFields.unit;
        if (!isNullOrUndefined(resourceUnit)) {
            let length: number = resourceData.length;
            let index: number;
            for (index = 0; index < length; index++) {
                if (isNullOrUndefined(resourceData[index][resourceUnit])) {
                    resourceData[index][resourceUnit] = 100;
                }
            }
        }
    }

    /**
     * @private
     */
    public updateResourceName(data: IGanttData): void {
        let resourceInfo: Object[] = data.ganttProperties.resourceInfo;
        let resourceName: Object[] = [];
        if (resourceInfo) {
            let taskResources: Object = extend([], [], data.taskData[this.parent.taskFields.resourceInfo], true);
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.resourceInfo, [], data);
            for (let i: number = 0; i < resourceInfo.length; i++) {
                let resource: Object = resourceInfo[i];
                let resName: string = resource[this.parent.resourceFields.name];
                let resourceUnit: number = resource[this.parent.resourceFields.unit];
                if (resourceUnit !== 100) {
                    resName += '[' + resourceUnit + '%' + ']';
                }
                resourceName.push(resName);
                if (data.taskData) {
                    let mapping: string = this.parent.taskFields.resourceInfo;
                    if (typeof (taskResources[i] === 'object')) {
                        data.taskData[mapping].push(taskResources[i]);
                    } else {
                        data.taskData[mapping].push(resource[this.parent.resourceFields.id]);
                    }
                }
            }
            this.parent.setRecordValue('resourceNames', resourceName.join(','), data.ganttProperties, true);
            this.parent.setRecordValue(this.parent.taskFields.resourceInfo, resourceName.join(','), data, true);
            this.updateTaskDataResource(data);
        }
    }

    private dataReorder(flatCollection: Object[], rootCollection: Object[]): Object[] {
        let result: Object[] = [];
        while (flatCollection.length > 0 && rootCollection.length > 0) {
            let index: number = rootCollection.indexOf(flatCollection[0]);
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
     * @param duration 
     * @param ganttProperties 
     * @private
     */
    public updateDurationValue(duration: string, ganttProperties: ITaskData): void {
        let tempDuration: Object = this.getDurationValue(duration);
        if (!isNaN(getValue('duration', tempDuration))) {
            this.parent.setRecordValue('duration', getValue('duration', tempDuration), ganttProperties, true);
        }
        if (!isNullOrUndefined(getValue('durationUnit', tempDuration))) {
            this.parent.setRecordValue('durationUnit', getValue('durationUnit', tempDuration), ganttProperties, true);
        }
    }

    /**
     * @private
     */
    public reUpdateGanttData(): void {
        if (this.parent.flatData.length > 0) {
            let data: ITaskData;
            let ganttData: IGanttData;
            this.parent.secondsPerDay = this.getSecondsPerDay();
            for (let index: number = 0; index < this.parent.flatData.length; index++) {
                data = this.parent.flatData[index].taskData;
                ganttData = this.parent.flatData[index];
                if (!isNullOrUndefined(this.parent.taskFields.duration)) {
                    this.setRecordDuration(ganttData, this.parent.taskFields.duration);
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
     * @private
     * Method to find overlapping value of the parent task
     */
    public updateOverlappingValues(resourceTask: IGanttData): void {
        let tasks: IGanttData[] = resourceTask.childRecords;
        let currentTask: IGanttData;
        let ranges: IWorkTimelineRanges[] = [];
        if (tasks.length <= 1) {
            resourceTask.ganttProperties.workTimelineRanges = [];
            return;
        }
        tasks = this.setSortedChildTasks(resourceTask);
        this.updateOverlappingIndex(tasks);
        for (let count: number = 1; count < tasks.length; count++) {
            currentTask = tasks[count];
            let cStartDate: Date = new Date(currentTask.ganttProperties.startDate.getTime());
            let cEndDate: Date = new Date(currentTask.ganttProperties.endDate.getTime()); //task 2
            let range: IWorkTimelineRanges[] = [];
            let rangeObj: IWorkTimelineRanges = {};
            for (let index: number = 0; index < count; index++) {
                let tStartDate: Date = tasks[index].ganttProperties.startDate;
                let tEndDate: Date = tasks[index].ganttProperties.endDate; // task 1
                let rangeObj: IWorkTimelineRanges = {};
                if (this._isInStartDateRange(cStartDate, tStartDate, tEndDate) || this._isInEndDateRange(cEndDate, tStartDate, tEndDate)) {
                    if ((tStartDate.getTime() > cStartDate.getTime() && tStartDate.getTime() < cEndDate.getTime()
                        && tEndDate.getTime() > cStartDate.getTime() && tEndDate.getTime() > cEndDate.getTime())
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
            ranges.push.apply(ranges, this.mergeRangeCollections(range));
        }
        this.parent.setRecordValue('workTimelineRanges', this.mergeRangeCollections(ranges, true), resourceTask.ganttProperties, true);
        this.calculateRangeLeftWidth(resourceTask.ganttProperties.workTimelineRanges);
    }
    /**
     * @private
     */
    public updateOverlappingIndex(tasks: IGanttData[]): void {
        for (let i: number = 0; i < tasks.length; i++) {
            tasks[i].ganttProperties.eOverlapIndex = i;
        }
    }
    /**
     * Method to calculate the left and width value of oarlapping ranges
     * @private
     */
    public calculateRangeLeftWidth(ranges: IWorkTimelineRanges[]): void {
        for (let count: number = 0; count < ranges.length; count++) {
            ranges[count].left = this.getTaskLeft(ranges[count].from, false);
            ranges[count].width = this.getTaskWidth(ranges[count].from, ranges[count].to);
        }
    }
    /**
     * @private
     */
    public mergeRangeCollections(ranges: IWorkTimelineRanges[], isSplit?: boolean): IWorkTimelineRanges[] {
        let finalRange: IWorkTimelineRanges[] = [];
        let currentTopRange: IWorkTimelineRanges = {};
        let cCompareRange: IWorkTimelineRanges = {};
        let sortedRanges: IWorkTimelineRanges[];
        let cStartDate: Date;
        let cEndDate: Date;
        let tStartDate: Date;
        let tEndDate: Date;
        sortedRanges = new DataManager(ranges).executeLocal(new Query()
            .sortBy(this.parent.taskFields.startDate, 'Ascending'));
        for (let i: number = 0; i < sortedRanges.length; i++) {
            if (finalRange.length === 0 && i === 0) {
                finalRange.push(sortedRanges[i]);
                continue;
            }
            currentTopRange = finalRange[finalRange.length - 1];
            cStartDate = currentTopRange.from;
            cEndDate = currentTopRange.to;
            cCompareRange = sortedRanges[i];
            tStartDate = cCompareRange.from;
            tEndDate = cCompareRange.to;
            if ((cStartDate.getTime() === tStartDate.getTime() && cEndDate.getTime() >= tEndDate.getTime())
                || (cStartDate.getTime() < tStartDate.getTime() && cEndDate.getTime() >= tEndDate.getTime())
            ) {
                continue;
            }
            /* tslint:disable-next-line */
            else if ((cStartDate.getTime() <= tStartDate.getTime() && cEndDate.getTime() >= tStartDate.getTime() && cEndDate.getTime() < tEndDate.getTime())
                || (cEndDate.getTime() < tStartDate.getTime() && this.checkStartDate(cEndDate).getTime() === tStartDate.getTime())) {
                currentTopRange.to = tEndDate;
            } else if (cEndDate.getTime() < tStartDate.getTime() && this.checkStartDate(cEndDate).getTime() !== tStartDate.getTime()) {
                finalRange.push(sortedRanges[i]);
            }
        }
        if (isSplit) {
            finalRange = this.splitRangeCollection(finalRange);
        }
        return finalRange;
    }
    /**
     * @private
     * Sort resource child records based on start date
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
        let splitArray: IWorkTimelineRanges[] = [];
        for (let i: number = 0; i < ranges.length; i++) {
            splitArray.push.apply(splitArray, this.splitRangeForDayMode(ranges[i], fromField, toField));
        }
        return splitArray;
    }
    private splitRangeForDayMode(range: IWorkTimelineRanges, fromField: string, toField: string): IWorkTimelineRanges[] {
        let fromString: string = fromField ? fromField : 'from';
        let toString: string = toField ? toField : 'to';
        let start: Date = new Date(range[fromString]);
        let tempStart: Date = new Date(range[fromString]);
        let end: Date = new Date(range[toString]);
        let isInSplit: boolean = false;
        let ranges: IWorkTimelineRanges[] = [];
        let rangeObject: CObject = {};
        if (tempStart.getTime() < end.getTime()) {
            do {
                let nStart: Date = new Date(tempStart.getTime());
                let nEndDate: Date = new Date(tempStart.getTime());
                let nextAvailDuration: number = 0;
                let sHour: number = this.parent.dataOperation.getSecondsInDecimal(tempStart);
                let startRangeIndex: number = -1;
                for (let i: number = 0; i < this.parent.workingTimeRanges.length; i++) {
                    let val: IWorkingTimeRange = this.parent.workingTimeRanges[i];
                    if (sHour >= val.from && sHour <= val.to) {
                        startRangeIndex = i;
                        break;
                    }
                }
                if (startRangeIndex !== -1) {
                    nextAvailDuration = Math.round(this.parent.workingTimeRanges[startRangeIndex].to - sHour);
                    nEndDate.setSeconds(nEndDate.getSeconds() + nextAvailDuration);
                }
                let taskName: string = 'task';
                if (nEndDate.getTime() < end.getTime()) {
                    rangeObject = {};
                    if (range.task) {
                        rangeObject[taskName] = extend([], range.task);
                    }
                    rangeObject[fromString] = nStart;
                    rangeObject[toString] = nEndDate;
                    rangeObject.isSplit = true;
                    ranges.push(rangeObject);
                } else {
                    rangeObject = {};
                    if (range.task) {
                        rangeObject[taskName] = extend([], range.task);
                    }
                    rangeObject[fromString] = nStart;
                    rangeObject[toString] = end;
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
        let splitArray: IWorkTimelineRanges[] = [];
        for (let i: number = 0; i < ranges.length; i++) {
            splitArray.push.apply(splitArray, this.splitRangeForWeekMode(ranges[i], fromField, toField));
        }
        return splitArray;
    }
    private splitRangeForWeekMode(range: IWorkTimelineRanges, fromField: string, toField: string): IWorkTimelineRanges[] {
        let from: string = fromField ? fromField : 'from';
        let to: string = toField ? toField : 'to';
        let start: Date = new Date(range[from]);
        let tempStart: Date = new Date(range[from]);
        let end: Date = new Date(range[to]);
        let isInSplit: boolean = false;
        let ranges: IWorkTimelineRanges[] = [];
        let rangeObj: CObject = {};
        tempStart.setDate(tempStart.getDate() + 1);
        if (tempStart.getTime() < end.getTime()) {
            do {
                if (this.parent.dataOperation.isOnHolidayOrWeekEnd(tempStart, null)) {
                    let tempEndDate: Date = new Date(tempStart.getTime());
                    tempEndDate.setDate(tempStart.getDate() - 1);
                    this.setTime(this.parent.defaultEndTime, tempEndDate);
                    rangeObj = {};
                    rangeObj[from] = start;
                    rangeObj.isSplit = true;
                    rangeObj[to] = tempEndDate;
                    if (range.task) {
                        rangeObj.task = extend([], range.task, true);
                    }
                    if (start.getTime() !== tempEndDate.getTime()) {
                        ranges.push(rangeObj);
                    }
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
                    rangeObj[from] = start;
                    rangeObj[to] = end;
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
     * @private
     */
    public updateGanttData(): void {
        let flatData: IGanttData[] = this.parent.flatData;
        let length: number = flatData.length;

        for (let i: number = 0; i < length; i++) {
            let data: IGanttData = flatData[i];
            this.updateTaskLeftWidth(data);
        }
    }
    /**
     * Update all gantt data collection width, progress width and left value
     * @public
     */
    private updateTaskLeftWidth(data: IGanttData): void {
        let task: ITaskData = data.ganttProperties;
        if (!data.hasChildRecords) {
            this.updateWidthLeft(data);
        }
        this.parent.setRecordValue('baselineLeft', this.calculateBaselineLeft(task), task, true);
        this.parent.setRecordValue('baselineWidth', this.calculateBaselineWidth(task), task, true);
        let childData: IGanttData[] = [];
        let parentItem: IGanttData;
        if (data.parentItem) {
            parentItem = this.parent.getParentTask(data.parentItem) as IGanttData;
            childData = parentItem.childRecords as IGanttData[];
        }
        if (parentItem && childData.indexOf(data) === childData.length - 1 && !data.hasChildRecords && this.parent.enableValidation) {
            this.updateParentItems(parentItem);
        } else if (parentItem && !this.parent.enableValidation) {
            this.updateWidthLeft(parentItem);
        }
    }
    /**
     * @private
     */
    public reUpdateGanttDataPosition(): void {
        let flatData: IGanttData[] = this.parent.flatData;
        let length: number = flatData.length;
        for (let i: number = 0; i < length; i++) {
            let data: IGanttData = flatData[i];
            let task: ITaskData = data.ganttProperties;
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
     * @param data 
     * @private
     */
    public updateWidthLeft(data: IGanttData): void {
        let ganttRecord: ITaskData = data.ganttProperties;
        // task endDate may be changed in segment calculation so this must be calculated first.
        // task width calculating was based on endDate     
        if (!isNullOrUndefined(ganttRecord.segments) && ganttRecord.segments.length > 0) {
            let segments: ITaskSegment[] = ganttRecord.segments;
            let fixedWidth: boolean = true;
            let totalTaskWidth: number = this.splitTasksDuration(segments) * this.parent.perDayWidth;
            let totalProgressWidth: number = this.parent.dataOperation.getProgressWidth(totalTaskWidth, ganttRecord.progress);
            for (let i: number = 0; i < segments.length; i++) {
                let segment: ITaskSegment = segments[i];
                if (i === 0 && !isNullOrUndefined(ganttRecord.startDate) &&
                    segment.startDate.getTime() !== ganttRecord.startDate.getTime()) {
                    segment.startDate = ganttRecord.startDate;
                    let endDate: Date = this.parent.dataOperation.getEndDate(
                        segment.startDate, segment.duration, ganttRecord.durationUnit, ganttRecord, false
                    );
                    segment.endDate = this.parent.dataOperation.checkEndDate(endDate, ganttRecord, false);
                    this.parent.chartRowsModule.incrementSegments(segments, 0, data);
                }
                segment.width = this.getSplitTaskWidth(segment.startDate, segment.duration, data);
                segment.showProgress = false;
                segment.progressWidth = -1;
                if (i !== 0) {
                    let pStartDate: Date = new Date(ganttRecord.startDate.getTime());
                    segment.left = this.getSplitTaskLeft(segment.startDate, pStartDate);
                }
                if (totalProgressWidth > 0 && totalProgressWidth > segment.width) {
                    totalProgressWidth = totalProgressWidth - segment.width;
                    segment.progressWidth = segment.width;
                    segment.showProgress = false;
                } else if (fixedWidth) {
                    segment.progressWidth = totalProgressWidth;
                    segment.showProgress = true;
                    totalProgressWidth = totalProgressWidth - segment.width;
                    fixedWidth = false;
                }
            }
            this.parent.setRecordValue('segments', ganttRecord.segments, ganttRecord, true);
            this.parent.dataOperation.updateMappingData(data, 'segments');
        }
        this.parent.setRecordValue('width', this.parent.dataOperation.calculateWidth(data), ganttRecord, true);
        this.parent.setRecordValue('left', this.parent.dataOperation.calculateLeft(ganttRecord), ganttRecord, true);
        this.parent.setRecordValue(
            'progressWidth',
            this.parent.dataOperation.getProgressWidth(
                (ganttRecord.isAutoSchedule || !data.hasChildRecords ? ganttRecord.width : ganttRecord.autoWidth),
                ganttRecord.progress),
            ganttRecord,
            true
        );
    }
    /**
     * method to update left, width, progress width in record
     * @param data 
     * @private
     */
    public updateAutoWidthLeft(data: IGanttData): void {
        let ganttRecord: ITaskData = data.ganttProperties;
        this.parent.setRecordValue('autoWidth', this.calculateWidth(data, true), ganttRecord, true);
        this.parent.setRecordValue('autoLeft', this.calculateLeft(ganttRecord, true), ganttRecord, true);
    }
    /**
     * To calculate parent progress value
     * @private
     */
    public getParentProgress(childGanttRecord: IGanttData): Object {
        let durationInDay: number = 0;
        let progressValues: Object = {};
        switch (childGanttRecord.ganttProperties.durationUnit) {
            case 'hour':
                durationInDay = (childGanttRecord.ganttProperties.duration / (this.parent.secondsPerDay / 3600));
                break;
            case 'minute':
                durationInDay = (childGanttRecord.ganttProperties.duration / (this.parent.secondsPerDay / 60));
                break;
            default:
                durationInDay = childGanttRecord.ganttProperties.duration;
        }

        if (childGanttRecord.hasChildRecords) {
            setValue('totalProgress', childGanttRecord.ganttProperties.totalProgress, progressValues);
            setValue('totalDuration', childGanttRecord.ganttProperties.totalDuration, progressValues);
        } else {
            setValue('totalProgress', childGanttRecord.ganttProperties.progress * durationInDay, progressValues);
            setValue('totalDuration', durationInDay, progressValues);
        }
        return progressValues;
    }

    private resetDependency(record: IGanttData): void {
        let dependency: string = this.parent.taskFields.dependency;
        if (!isNullOrUndefined(dependency)) {
            let recordProp: ITaskData = record.ganttProperties;
            this.parent.setRecordValue('predecessor', [], recordProp, true);
            this.parent.setRecordValue('predecessorsName', null, recordProp, true);
            this.parent.setRecordValue('taskData.' + dependency, null, record);
            this.parent.setRecordValue(dependency, null, record);
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    public updateParentItems(cloneParent: IParent | IGanttData, isParent?: boolean): void {
        let parentData: IGanttData = isParent ? cloneParent : this.parent.getParentTask(cloneParent);
        let deleteUpdate: boolean = false;
        let ganttProp: ITaskData = parentData.ganttProperties;
        if (parentData.childRecords.length > 0) {
            let previousStartDate: Date = ganttProp.isAutoSchedule ? ganttProp.startDate : ganttProp.autoStartDate;
            let previousEndDate: Date = ganttProp.isAutoSchedule ? ganttProp.endDate :
                ganttProp.autoEndDate;
            let childRecords: Object[] = parentData.childRecords;
            let childLength: number = childRecords.length;
            let totalDuration: number = 0;
            let progressValues: Object = {};
            let minStartDate: Date = null; let maxEndDate: Date = null;
            let milestoneCount: number = 0; let totalProgress: number = 0; let childCompletedWorks: number = 0;
            let childData: IGanttData;
            for (let count: number = 0; count < childLength; count++) {
                childData = childRecords[count] as IGanttData;
                if (this.parent.isOnDelete && childData.isDelete) {
                    if (childLength === 1 && this.parent.viewType === 'ProjectView') {
                        if (isBlazor()) {
                            let id: string = parentData.ganttProperties.rowUniqueID;
                            let task: IGanttData = this.parent.getRecordByID(id);
                            if (task && this.parent.editedRecords.indexOf(task) === -1) {
                                this.parent.editedRecords.push(task);
                            }
                        }
                        deleteUpdate = true;
                    }
                    continue;
                }
                let startDate: Date = this.getValidStartDate(childData.ganttProperties);
                let endDate: Date = this.getValidEndDate(childData.ganttProperties);

                if (isNullOrUndefined(minStartDate)) {
                    minStartDate = this.getDateFromFormat(startDate);
                }
                if (isNullOrUndefined(maxEndDate)) {
                    maxEndDate = this.getDateFromFormat(endDate);
                }
                if (!isNullOrUndefined(endDate) && this.compareDates(endDate, maxEndDate) === 1) {
                    maxEndDate = this.getDateFromFormat(endDate);
                }
                if (!isNullOrUndefined(startDate) && this.compareDates(startDate, minStartDate) === -1) {
                    minStartDate = this.getDateFromFormat(startDate);
                }
                if (!childData.ganttProperties.isMilestone && isScheduledTask(childData.ganttProperties)) {
                    progressValues = this.getParentProgress(childData);
                    totalProgress += getValue('totalProgress', progressValues);
                    totalDuration += getValue('totalDuration', progressValues);
                } else {
                    milestoneCount++;
                }
                childCompletedWorks += childData.ganttProperties.work;
            }
            if (!deleteUpdate) {
                if (this.compareDates(previousStartDate, minStartDate) !== 0) {
                    this.parent.setRecordValue(
                        ganttProp.isAutoSchedule ? 'startDate' : 'autoStartDate',
                        minStartDate, parentData.ganttProperties, true);
                }
                if (this.compareDates(previousEndDate, maxEndDate) !== 0) {
                    this.parent.setRecordValue(
                        ganttProp.isAutoSchedule ? 'endDate' : 'autoEndDate',
                        maxEndDate, parentData.ganttProperties, true);
                }
                let taskCount: number;
                if (this.parent.isOnDelete && childData.isDelete) {
                    taskCount = childLength - milestoneCount - 1;
                } else {
                    taskCount = childLength - milestoneCount;
                }
                let parentProgress: number = (taskCount > 0 && totalDuration > 0) ? (totalProgress / totalDuration) : 0;
                let parentProp: ITaskData = parentData.ganttProperties;
                let milestone: boolean = (taskCount === 0) && minStartDate && maxEndDate &&
                    minStartDate.getTime() === maxEndDate.getTime() ? true : false;
                this.parent.setRecordValue('isMilestone', milestone, parentProp, true);
                if (parentProp.isAutoSchedule) {
                    this.calculateDuration(parentData);
                }
                this.updateWorkWithDuration(parentData);
                let parentWork: number = parentProp.work;
                parentWork += childCompletedWorks;
                this.parent.setRecordValue('work', parentWork, parentProp, true);
                this.parent.setRecordValue('taskType', 'FixedDuration', parentProp, true);
                if (!isNullOrUndefined(this.parent.taskFields.type)) {
                    this.updateMappingData(parentData, 'type');
                }
                this.parent.setRecordValue('progress', Math.floor(parentProgress), parentProp, true);
                this.parent.setRecordValue('totalProgress', totalProgress, parentProp, true);
                this.parent.setRecordValue('totalDuration', totalDuration, parentProp, true);
                if (!parentProp.isAutoSchedule) {
                    this.parent.setRecordValue('autoDuration', this.calculateAutoDuration(parentProp), parentProp, true);
                    this.updateAutoWidthLeft(parentData);
                }
                this.resetDependency(parentData);
                this.updateWidthLeft(parentData);
                this.updateTaskData(parentData);
            }
        }
        if (deleteUpdate && parentData.childRecords.length === 1 && parentData.ganttProperties.duration === 0) {
            this.parent.setRecordValue('isMilestone', true, parentData.ganttProperties, true);
            this.updateWidthLeft(parentData);
            this.updateTaskData(parentData);
        }
        let parentItem: IGanttData = this.parent.getParentTask(parentData.parentItem) as IGanttData;
        if (parentItem) {
            this.updateParentItems(parentItem);
        }
        deleteUpdate = false;
    }
}
