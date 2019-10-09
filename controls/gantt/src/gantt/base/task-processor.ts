import { isNullOrUndefined, getValue, extend, setValue } from '@syncfusion/ej2-base';
import { getUid, ReturnType } from '@syncfusion/ej2-grids';
import { IGanttData, ITaskData, IParent } from './interface';
import { DataManager, Query, Group, ReturnOption } from '@syncfusion/ej2-data';
import { isScheduledTask } from './utils';
import { Gantt } from './gantt';
import { DateProcessor } from './date-processor';
import { TaskFieldsModel, ColumnModel } from '../models/models';

/**
 * To calculate and update task related values
 */
export class TaskProcessor extends DateProcessor {

    private recordIndex: number;
    private dataArray: Object[];
    private taskIds: Object[];
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
            this.taskIds = [];
            this.hierarchyData = [];
            this.parent.predecessorsCollection = [];
            this.parent.treeGrid.parentData = [];
        }
        if (isNullOrUndefined(this.parent.dataSource)) {
            this.parent.dataSource = [];
            this.parent.renderGantt(isChange);
        } else if (this.parent.dataSource instanceof DataManager) {
            this.initDataSource(isChange);
        } else if (this.parent.dataSource.length > 0) {
            this.dataArray = this.parent.dataSource;
            this.cloneDataSource();
            this.parent.renderGantt(isChange);
        } else {
            this.parent.renderGantt(isChange);
        }
    }
    private initDataSource(isChange?: boolean): void {
        let queryManager: Query = this.parent.query instanceof Query ? this.parent.query : new Query();
        queryManager.requiresCount();
        let dataManager: DataManager = this.parent.dataSource as DataManager;
        dataManager.executeQuery(queryManager).then((e: ReturnOption) => {
            this.dataArray = <Object[]>e.result;
            this.cloneDataSource();
            this.parent.renderGantt(isChange);
        }).catch((e: ReturnType) => {
            // Trigger action failure event
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
            this.prepareDataSource(this.hierarchyData);
        } else {
            this.prepareDataSource(this.dataArray);
        }
    }
    /**
     * Function to manipulate data-source
     * @hidden
     */
    private prepareDataSource(data: Object[]): void {
        this.prepareRecordCollection(data, 0);
        if (this.parent.taskFields.dependency) {
            this.parent.predecessorModule.ensurePredecessorCollection();
        }
    }
    private prepareRecordCollection(data: Object[], level: number, parentItem?: IGanttData): void {
        let length: number = data.length;
        for (let i: number = 0; i < length; i++) {
            let tempData: Object = data[i];
            let ganttData: IGanttData = this.createRecord(tempData, level, parentItem, true);
            ganttData.index = this.recordIndex++;
            this.parent.ids[ganttData.index] = ganttData.ganttProperties.taskId.toString();
            this.parent.flatData.push(ganttData);
            let childData: Object[] = tempData[this.parent.taskFields.child];
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
    public createRecord(data: Object, level: number, parentItem?: IGanttData, isLoad?: boolean): IGanttData {
        let taskSettings: TaskFieldsModel = this.parent.taskFields;
        let child: Object[] = data[taskSettings.child];
        let progress: number = data[taskSettings.progress];
        progress = progress ? parseFloat(progress.toString()) ? parseFloat(progress.toString()) : 0 : 0;
        let predecessors: string | number | object[] = data[taskSettings.dependency];
        let baselineStartDate: Date = this.getDateFromFormat(data[taskSettings.baselineStartDate]);
        let baselineEndDate: Date = this.getDateFromFormat(data[taskSettings.baselineEndDate]);
        let ganttData: IGanttData = {} as IGanttData;
        let ganttProperties: ITaskData = {} as ITaskData;
        this.parent.setRecordValue('ganttProperties', ganttProperties, ganttData);
        this.parent.setRecordValue('taskId', data[taskSettings.id], ganttProperties, true);
        this.parent.setRecordValue('taskName', data[taskSettings.name], ganttProperties, true);
        this.addTaskData(ganttData, data, isLoad);
        this.addCustomFieldValue(data, ganttData);
        this.parent.setRecordValue('isAutoSchedule', true, ganttProperties, true);
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
        this.parent.setRecordValue('level', level, ganttData);
        this.parent.setRecordValue('uniqueID', getUid(this.parent.element.id + '_data_'), ganttData);
        this.parent.setRecordValue('uniqueID', ganttData.uniqueID, ganttProperties, true);
        this.parent.setRecordValue('childRecords', [], ganttData);
        this.parent.setRecordValue('baselineEndDate', this.checkBaselineEndDate(baselineEndDate), ganttProperties, true);
        if (!isNullOrUndefined(data[taskSettings.child]) && data[taskSettings.child].length > 0) {
            this.parent.setRecordValue('hasChildRecords', true, ganttData);
            this.parent.setRecordValue('isMilestone', false, ganttProperties, true);
        } else {
            this.parent.setRecordValue('hasChildRecords', false, ganttData);
        }
        this.parent.setRecordValue('expanded', (ganttData.hasChildRecords && this.parent.collapseAllParentTasks) ? false : true, ganttData);
        this.updateExpandStateMappingValue(ganttData, data);
        if (!isLoad) {
            this.parent.setRecordValue('width', this.calculateWidth(ganttProperties), ganttProperties, true);
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
        this.updateTaskData(ganttData);
        if (!isNullOrUndefined(parentItem)) {
            parentItem.childRecords.push(ganttData);
        }
        if (predecessors) {
            this.parent.predecessorsCollection.push(ganttData);
        }
        return ganttData;
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
            cloneParent.taskId = parent.ganttProperties.taskId;
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
                    let index: number = this.taskIds.indexOf(id);
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
            this.parent.setRecordValue('expandStateMapping', updatableValue, ganttData);
            this.parent.setRecordValue('expanded', updatableValue, ganttData);
        }
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
        let startDate: Date = this.getDateFromFormat(data[taskSettings.startDate]);
        let endDate: Date = this.getDateFromFormat(data[taskSettings.endDate]);
        let isMileStone: boolean = taskSettings.milestone ? data[taskSettings.milestone] ? true : false : false;
        let durationMapping: string = data[taskSettings.durationUnit] ? data[taskSettings.durationUnit] : '';
        this.parent.setRecordValue('durationUnit', this.validateDurationUnitMapping(durationMapping), ganttProperties, true);

        if (!endDate && !startDate && (isNullOrUndefined(duration) || duration === '')) {
            if (this.parent.allowUnscheduledTasks) {
                return;
            } else {
                this.parent.setRecordValue('duration', 1, ganttProperties, true);
                this.parent.setRecordValue('startDate', this.getProjectStartDate(ganttProperties, isLoad), ganttProperties, true);
                this.calculateEndDate(ganttData);
            }
        } else if (startDate) {
            this.calculateDateFromStartDate(startDate, endDate, duration, ganttData);

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
        if (ganttProperties.duration === 0) {
            this.parent.setRecordValue('isMilestone', true, ganttProperties, true);
            this.parent.setRecordValue('endDate', ganttProperties.startDate, ganttProperties, true);
        }
        if (!isNullOrUndefined(isMileStone) && isMileStone) {
            this.parent.setRecordValue('duration', 0, ganttProperties, true);
            this.parent.setRecordValue('isMilestone', true, ganttProperties, true);
            this.parent.setRecordValue('endDate', ganttProperties.startDate, ganttProperties, true);
        }
    }
    private calculateDateFromEndDate(endDate: Date, duration: string, ganttData: IGanttData): void {
        let ganttProperties: ITaskData = ganttData.ganttProperties;

        if (endDate.getHours() === 0 && this.parent.defaultEndTime !== 86400) {
            this.setTime(this.parent.defaultEndTime, endDate);
        }
        this.parent.setRecordValue('endDate', this.checkEndDate(endDate, ganttData.ganttProperties), ganttProperties, true);
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
    private calculateDateFromStartDate(startDate: Date, endDate: Date, duration: string, ganttData: IGanttData): void {
        let ganttProperties: ITaskData = ganttData.ganttProperties;
        this.parent.setRecordValue('startDate', this.checkStartDate(startDate, ganttProperties), ganttProperties, true);
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
    public calculateWidth(ganttProp: ITaskData): number {
        let sDate: Date = ganttProp.startDate; let eDate: Date = ganttProp.endDate;
        let unscheduledTaskWidth: number = 3;
        if (isNullOrUndefined(sDate) && isNullOrUndefined(eDate)) {
            sDate = this.getValidStartDate(ganttProp);
            eDate = this.getValidEndDate(ganttProp);
        }
        if (isNullOrUndefined(sDate) || isNullOrUndefined(eDate)) {
            return unscheduledTaskWidth;
        } else if (ganttProp.isMilestone) {
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
    public calculateLeft(ganttProp: ITaskData): number {
        let sDate: Date = null; let left: number = -300;
        let milestone: boolean = ganttProp.isMilestone;
        if (ganttProp.startDate) {
            sDate = new Date(ganttProp.startDate.getTime());
        } else if (ganttProp.endDate) {
            sDate = new Date(ganttProp.endDate.getTime());
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
    /**
     * 
     * @param ganttData 
     * @param fieldName 
     * @private
     */
    public updateMappingData(ganttData: IGanttData, fieldName: string): void {
        let columnMapping: Object = this.parent.columnMapping;
        let ganttProp: ITaskData = ganttData.ganttProperties;
        if (isNullOrUndefined(columnMapping[fieldName])) {
            return;
        }
        if (fieldName === 'predecessorName') {
            //
        } else if (fieldName === 'resourceInfo') {
            let resourceData: Object[] = ganttProp.resourceInfo;
            let resourcesId: number[] = []; let resourcesName: string[] = [];
            for (let i: number = 0; i < resourceData.length; i++) {
                resourcesId.push(resourceData[i][this.parent.resourceIDMapping]);
                resourcesName.push(resourceData[i][this.parent.resourceNameMapping]);
            }
            this.parent.setRecordValue('resourceNames', resourcesName.join(','), ganttProp, true);
            this.parent.setRecordValue('taskData.' + columnMapping[fieldName], resourcesId, ganttData);
            this.parent.setRecordValue(columnMapping[fieldName], resourcesName.join(','), ganttData);
        } else if (fieldName === 'startDate' || fieldName === 'endDate') {
            this.setRecordDate(ganttData, ganttProp[fieldName], columnMapping[fieldName]);
        } else if (fieldName === 'duration') {
            this.setRecordDuration(ganttData, columnMapping[fieldName]);
        } else {
            this.parent.setRecordValue('taskData.' + columnMapping[fieldName], ganttProp[fieldName], ganttData);
            this.parent.setRecordValue(columnMapping[fieldName], ganttProp[fieldName], ganttData);
        }
    }

    private setRecordDate(task: IGanttData, value: Date, mapping: string): void {
        if (!isNullOrUndefined(value)) {
            value = new Date(value.getTime());
        }
        this.parent.setRecordValue(mapping, value, task);
        if (!isNullOrUndefined(value)) {
            value = new Date(value.getTime());
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
            this.parent.setRecordValue(mapping, this.getDurationInDay(duration, durationUnit), task);
            this.parent.setRecordValue('taskData.' + mapping, this.getDurationString(duration, durationUnit), task);
        } else {
            this.parent.setRecordValue(mapping, duration, task);
            this.parent.setRecordValue('taskData.' + mapping, duration, task);
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
        let resourceData: Object[] = this.parent.resources;
        let resourceIDMapping: string = this.parent.resourceIDMapping;
        let resources: Object[] = [];
        for (let count: number = 0; count < resourceIdCollection.length; count++) {
            let resource: Object[] = resourceData.filter((resourceInfo: Object) => {
                return (resourceIdCollection[count] === resourceInfo[resourceIDMapping]);
            });
            let ganttDataResource: Object = extend({}, resource[0]);
            resources.push(ganttDataResource);
        }
        return resources;
    }

    private updateResourceName(data: IGanttData): void {
        let resourceInfo: Object[] = data.ganttProperties.resourceInfo;
        let resourceName: Object[] = [];
        if (resourceInfo) {
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.resourceInfo, [], data);
            for (let i: number = 0; i < resourceInfo.length; i++) {
                let resource: Object = resourceInfo[i];
                resourceName.push(resource[this.parent.resourceNameMapping]);
                if (data.taskData) {
                    let mapping: string = this.parent.taskFields.resourceInfo;
                    data.taskData[mapping].push(resource[this.parent.resourceIDMapping]);
                }
            }
            this.parent.setRecordValue('resourceNames', resourceName.join(','), data.ganttProperties, true);
            this.parent.setRecordValue(this.parent.taskFields.resourceInfo, resourceName.join(','), data, true);
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
        if (unit === 'minute') {
            unit = 'minute';
        } else if (unit === 'hour') {
            unit = 'hour';
        } else if (unit === 'day') {
            unit = 'day';
        } else {
            unit = this.parent.durationUnit.toLocaleLowerCase();
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
        this.parent.setRecordValue('duration', getValue('duration', tempDuration), ganttProperties, true);
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

    /**
     * Update all gantt data collection width, progress width and left value
     * @private
     */
    public updateGanttData(): void {
        let flatData: IGanttData[] = this.parent.flatData;
        let length: number = flatData.length;

        for (let i: number = 0; i < length; i++) {
            let data: IGanttData = flatData[i];
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
            if (parentItem && childData.indexOf(data) === childData.length - 1 && !data.hasChildRecords) {
                if (parentItem.ganttProperties.isAutoSchedule) {
                    this.updateParentItems(parentItem);
                }
            }
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
        this.parent.setRecordValue('width', this.parent.dataOperation.calculateWidth(ganttRecord), ganttRecord, true);
        this.parent.setRecordValue('left', this.parent.dataOperation.calculateLeft(ganttRecord), ganttRecord, true);
        this.parent.setRecordValue(
            'progressWidth',
            this.parent.dataOperation.getProgressWidth(ganttRecord.width, ganttRecord.progress),
            ganttRecord,
            true
        );
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
    /**
     * @private
     */
    public updateParentItems(cloneParent: IParent): void {
        let parentData: IGanttData = this.parent.getParentTask(cloneParent);
        if (parentData.childRecords.length > 0) {
            let previousStartDate: Date = parentData.ganttProperties.startDate;
            let previousEndDate: Date = parentData.ganttProperties.endDate;
            let childRecords: Object[] = parentData.childRecords;
            let childLength: number = childRecords.length;
            let totalDuration: number = 0;
            let progressValues: Object = {};
            let minStartDate: Date = null; let maxEndDate: Date = null;
            let milestoneCount: number = 0; let totalProgress: number = 0; let childCompletedWorks: number = 0;

            for (let count: number = 0; count < childLength; count++) {
                let childData: IGanttData = childRecords[count] as IGanttData;
                if (this.parent.isOnDelete && childData.isDelete) {
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
            }
            if (this.compareDates(previousStartDate, minStartDate) !== 0) {
                this.parent.setRecordValue('startDate', minStartDate, parentData.ganttProperties, true);
            }
            if (this.compareDates(previousEndDate, maxEndDate) !== 0) {
                this.parent.setRecordValue('endDate', maxEndDate, parentData.ganttProperties, true);
            }
            let taskCount: number;
            if (this.parent.isOnDelete) {
                taskCount = childLength - milestoneCount - 1;
            } else {
                taskCount = childLength - milestoneCount;
            }
            let parentProgress: number = (taskCount > 0 && totalDuration > 0) ? (totalProgress / totalDuration) : 0;
            this.calculateDuration(parentData);
            let parentProp: ITaskData = parentData.ganttProperties;
            this.parent.setRecordValue('progress', Math.floor(parentProgress), parentProp, true);
            this.parent.setRecordValue('totalProgress', totalProgress, parentProp, true);
            this.parent.setRecordValue('totalDuration', totalDuration, parentProp, true);
            this.updateWidthLeft(parentData);
            this.updateTaskData(parentData);
        }
        if (parentData.childRecords.length === 1 && parentData.ganttProperties.duration === 0) {
            this.parent.setRecordValue('isMilestone', false, parentData.ganttProperties, true);
            this.updateWidthLeft(parentData);
            this.updateTaskData(parentData);
        }
        let parentItem: IGanttData = this.parent.getParentTask(parentData.parentItem) as IGanttData;
        if (parentItem && parentItem.ganttProperties.isAutoSchedule) {
            this.updateParentItems(parentItem);
        }
    }
}