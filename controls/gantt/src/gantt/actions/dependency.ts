/**
 * Predecessor calculation goes here
 */
import { IGanttData, ITaskData, IPredecessor, IConnectorLineObject, ITaskSegment } from '../base/interface';
import { TaskFieldsModel } from '../models/models';
import { DateProcessor } from '../base/date-processor';
import { Gantt } from '../base/gantt';
import { isScheduledTask } from '../base/utils';
import { getValue, isNullOrUndefined, extend } from '@syncfusion/ej2-base';

export class Dependency {

    private parent: Gantt;
    private dateValidateModule: DateProcessor;
    constructor(gantt: Gantt) {
        this.parent = gantt;
        this.dateValidateModule = this.parent.dateValidationModule;
    }
    /**
     * Method to populate predecessor collections in records
     *
     * @returns {void} .
     * @private
     */
    public ensurePredecessorCollection(): void {
        const predecessorTasks: IGanttData[] = this.parent.predecessorsCollection;
        const length: number = predecessorTasks.length - 1;
        for (let count: number = length; count >= 0; count--) {
            const ganttData: IGanttData = predecessorTasks[count];
            const ganttProp: ITaskData = ganttData.ganttProperties;
            if (!ganttData.hasChildRecords) {
                this.ensurePredecessorCollectionHelper(ganttData, ganttProp);
            }
        }
    }
    /**
     *
     * @param {IGanttData} ganttData .
     * @param {ITaskData} ganttProp .
     * @returns {void} .
     * @private
     */
    public ensurePredecessorCollectionHelper(ganttData: IGanttData, ganttProp: ITaskData): void {
        const predecessorVal: object[] | string | number = ganttProp.predecessorsName;
        if (predecessorVal && (typeof predecessorVal === 'string' || typeof predecessorVal === 'number')) {
            this.parent.setRecordValue('predecessor', this.calculatePredecessor(predecessorVal, ganttData), ganttProp, true);
        } else if (predecessorVal && typeof predecessorVal === 'object' && predecessorVal.length) {
            const preValues: IPredecessor[] = [];
            for (let c: number = 0; c < predecessorVal.length; c++) {
                const predecessorItem: object = predecessorVal[c];
                const preValue: IPredecessor = {};
                preValue.from = getValue('from', predecessorItem);
                preValue.to = getValue('to', predecessorItem) ? getValue('to', predecessorItem) : ganttProp.rowUniqueID;
                preValue.type = getValue('type', predecessorItem) ? getValue('type', predecessorItem) : 'FS';
                const offsetUnits: Record<string, unknown> = getValue('offset', predecessorItem);
                if (isNullOrUndefined(offsetUnits)) {
                    preValue.offset = 0;
                    preValue.offsetUnit = this.parent.durationUnit.toLocaleLowerCase();
                } else if (typeof offsetUnits === 'string') {
                    const tempOffsetUnits: { duration: number, durationUnit: string } = this.getOffsetDurationUnit(
                        getValue('offset', predecessorItem));
                    preValue.offset = tempOffsetUnits.duration;
                    preValue.offsetUnit = tempOffsetUnits.durationUnit;
                } else {
                    preValue.offset = parseFloat(offsetUnits.toString());
                    preValue.offsetUnit = this.parent.durationUnit.toLocaleLowerCase();
                }
                const isOwnParent: boolean = this.checkIsParent(preValue.from.toString());
                if (!isOwnParent) {
                    preValues.push(preValue);
                }
            }
            this.parent.setRecordValue('predecessor', preValues, ganttProp, true);
        }
        this.parent.setRecordValue('predecessorsName', this.getPredecessorStringValue(ganttData), ganttProp, true);
        this.parent.setRecordValue(
            'taskData.' + this.parent.taskFields.dependency,
            ganttProp.predecessorsName,
            ganttData);
        this.parent.setRecordValue(
            this.parent.taskFields.dependency,
            ganttProp.predecessorsName,
            ganttData);
    }

    /**
     * To render unscheduled empty task with 1 day duration during predecessor map
     *
     * @param {IGanttData} data .
     * @returns {void} .
     * @private
     */
    public updateUnscheduledDependency(data: IGanttData): void {
        const task: TaskFieldsModel = this.parent.taskFields;
        const prdList: string[] = !isNullOrUndefined(data[task.dependency]) ?
            data[task.dependency].toString().split(',') : [];
        for (let i: number = 0; i < prdList.length; i++) {
            const predId: number = parseInt(prdList[i], 10);
            if (!isNaN(predId)) {
                const predData: IGanttData = this.parent.getRecordByID(predId.toString());
                const record: ITaskData = !isNullOrUndefined(predData) ?
                    extend({}, {}, predData.taskData, true) : null;
                if (!isNullOrUndefined(record) && isNullOrUndefined(record[task.startDate])
                    && isNullOrUndefined(record[task.duration]) && isNullOrUndefined(record[task.endDate])) {
                    record[task.duration] = 1;
                    record[task.startDate] = this.parent.projectStartDate;
                    this.parent.updateRecordByID(record);
                }
            }
        }
    }
    /**
     *
     * @param {string} fromId .
     * @returns {boolean} .
     */
    private checkIsParent(fromId: string): boolean {
        let boolValue: boolean = false;
        const task: IGanttData = this.parent.connectorLineModule.getRecordByID(fromId);
        if (task.hasChildRecords) {
            boolValue = true;
        }
        return boolValue;
    }

    /**
     * Get predecessor collection object from predecessor string value
     *
     * @param {string | number} predecessorValue .
     * @param {IGanttData} ganttRecord .
     * @returns {IPredecessor[]} .
     * @private
     */
    public calculatePredecessor(predecessorValue: string | number, ganttRecord?: IGanttData): IPredecessor[] {
        const predecessor: string = predecessorValue.toString();
        const collection: IPredecessor[] = [];
        let match: string[];
        let values: string[];
        let offsetValue: string;
        let predecessorText: string;

        predecessor.split(',').forEach((el: string): void => {
            values = el.split('+');
            offsetValue = '+';
            if (el.indexOf('-') >= 0) {
                values = el.split('-');
                offsetValue = '-';
            }
            match = values[0].match(/(\d+|[A-z]+)/g);
            const ids: string[] = this.parent.viewType === 'ResourceView' ? this.parent.getTaskIds() : this.parent.ids;
            const isExist: number = this.parent.viewType === 'ResourceView' ? ids.indexOf('T' + match[0]) : ids.indexOf(match[0]);
            /*Validate for appropriate predecessor*/
            if (match[0] && isExist !== -1) {
                if (match.length > 1) {
                    const type: string = match[1].toUpperCase();
                    if (type === 'FS' || type === 'FF' || type === 'SF' || type === 'SS') {
                        predecessorText = type;
                    } else {
                        predecessorText = 'FS';
                    }
                } else {
                    predecessorText = 'FS';
                }
            } else {
                return; // exit current loop for invalid id (match[0])
            }
            const tempOffset: string = values.length > 1 ? offsetValue + '' + values[1] : '0';
            const offsetUnits: { duration: number, durationUnit: string } = this.getOffsetDurationUnit(tempOffset);

            const obj: IPredecessor = {
                from: match[0],
                type: predecessorText,
                isDrawn: false,
                to: this.parent.viewType === 'ResourceView' ? ganttRecord.ganttProperties.taskId.toString()
                    : ganttRecord.ganttProperties.rowUniqueID.toString(),
                offsetUnit: offsetUnits.durationUnit,
                offset: offsetUnits.duration
            };
            const isOwnParent: boolean = this.checkIsParent(match[0]);
            if (!isOwnParent) {
                collection.push(obj);
            }
        });
        return collection;
    }

    /**
     * Get predecessor value as string with offset values
     *
     * @param {IGanttData} data .
     * @returns {string} .
     * @private
     */
    public getPredecessorStringValue(data: IGanttData): string {
        const predecessors: IPredecessor[] = data.ganttProperties.predecessor;
        const durationUnitTexts: Object = this.parent.durationUnitTexts;
        let resultString: string = '';
        if (predecessors) {
            const length: number = predecessors.length;
            for (let i: number = 0; i < length; i++) {
                const currentValue: IPredecessor = predecessors[i];
                let temp: string = '';
                const id: string = this.parent.viewType === 'ResourceView' ? data.ganttProperties.taskId
                    : data.ganttProperties.rowUniqueID;
                if (currentValue.from !== id.toString()) {
                    temp = currentValue.from + currentValue.type;
                    if (currentValue.offset !== 0) {
                        temp += currentValue.offset > 0 ? ('+' + currentValue.offset + ' ') : (currentValue.offset + ' ');
                        const multiple: boolean = currentValue.offset !== 1;
                        if (currentValue.offsetUnit === 'day') {
                            temp += multiple ? getValue('days', durationUnitTexts) : getValue('day', durationUnitTexts);
                        } else if (currentValue.offsetUnit === 'hour') {
                            temp += multiple ? getValue('hours', durationUnitTexts) : getValue('hour', durationUnitTexts);
                        } else {
                            temp += multiple ? getValue('minutes', durationUnitTexts) : getValue('minute', durationUnitTexts);
                        }
                    }
                    if (resultString.length > 0) {
                        resultString = resultString + ',' + temp;
                    } else {
                        resultString = temp;
                    }
                }
            }
        }
        return resultString;
    }

    /*Get duration and duration unit value from tasks*/
    private getOffsetDurationUnit(val: string | number): { duration: number, durationUnit: string } {
        let duration: number = 0;
        let durationUnit: string = this.parent.durationUnit.toLocaleLowerCase();
        const durationUnitLabels: Object = this.parent.durationUnitEditText;
        if (typeof val === 'string') {
            const values: string[] = val.match(/[^0-9]+|[0-9]+/g);
            for (let x: number = 0; x < values.length; x++) {
                values[x] = (values[x]).trim();
            }
            if (values[0] === '-' && values[1]) {
                values[1] = values[0] + values[1];
                values.shift();
            } else if (values[0] === '+') {
                values.shift();
            }
            if (values[1] === '.' && !isNaN(parseInt(values[2], 10))) {
                values[0] += values[1] + values[2];
                values.splice(1, 2);
            }
            if (values && values.length <= 2) {
                duration = parseFloat(values[0]);
                durationUnit = values[1] ? (values[1].toLowerCase()).trim() : '';
                if (getValue('minute', durationUnitLabels).indexOf(durationUnit) !== -1) {
                    durationUnit = 'minute';
                } else if (getValue('hour', durationUnitLabels).indexOf(durationUnit) !== -1) {
                    durationUnit = 'hour';
                } else if (getValue('day', durationUnitLabels).indexOf(durationUnit) !== -1) {
                    durationUnit = 'day';
                } else {
                    durationUnit = this.parent.durationUnit.toLocaleLowerCase();
                }
            }
        } else {
            duration = val;
            durationUnit = this.parent.durationUnit.toLocaleLowerCase();
        }
        if (isNaN(duration)) {
            duration = 0;
            durationUnit = this.parent.durationUnit.toLocaleLowerCase();
        }
        return {
            duration: duration,
            durationUnit: durationUnit
        };
    }
    /**
     * Update predecessor object in both from and to tasks collection
     *
     * @returns {void} .
     * @private
     */
    public updatePredecessors(): void {
        const predecessorsCollection: IGanttData[] = this.parent.predecessorsCollection;
        let ganttRecord: IGanttData;
        const length: number = predecessorsCollection.length;
        for (let count: number = 0; count < length; count++) {
            ganttRecord = predecessorsCollection[count];
            if (!ganttRecord.hasChildRecords) {
                this.updatePredecessorHelper(ganttRecord, predecessorsCollection);
            }
        }
    }
    /**
     * To update predecessor collection to successor tasks
     *
     * @param {IGanttData} ganttRecord .
     * @param {IGanttData[]} predecessorsCollection .
     * @returns {void} .
     * @private
     */
    public updatePredecessorHelper(ganttRecord: IGanttData, predecessorsCollection?: IGanttData[]): void {
        const connectorsCollection: IPredecessor[] = ganttRecord.ganttProperties.predecessor;
        let successorGanttRecord: IGanttData;
        const connectorCount: number = connectorsCollection.length;
        predecessorsCollection = isNullOrUndefined(predecessorsCollection) ? [] : predecessorsCollection;
        for (let i: number = 0; i < connectorCount; i++) {
            const connector: IPredecessor = connectorsCollection[i];
            successorGanttRecord = this.parent.connectorLineModule.getRecordByID(connector.from);
            const id: string = this.parent.viewType === 'ResourceView' ? ganttRecord.ganttProperties.taskId
                : ganttRecord.ganttProperties.rowUniqueID;
            if (connector.from !== id.toString()) {
                if (successorGanttRecord) {
                    let predecessorCollection: IPredecessor[];
                    if (successorGanttRecord.ganttProperties.predecessor) {
                        predecessorCollection = (extend([], successorGanttRecord.ganttProperties.predecessor, [], true)) as IPredecessor[];
                        predecessorCollection.push(connector);
                        this.parent.setRecordValue('predecessor', predecessorCollection, successorGanttRecord.ganttProperties, true);
                        //  successorGanttRecord.ganttProperties.predecessor.push(connector);
                    } else {
                        predecessorCollection = [];
                        predecessorCollection.push(connector);
                        this.parent.setRecordValue('predecessor', predecessorCollection, successorGanttRecord.ganttProperties, true);
                        // this.parent.setRecordValue('predecessor', [], successorGanttRecord.ganttProperties, true);
                        // successorGanttRecord.ganttProperties.predecessor.push(connector);
                        predecessorsCollection.push(successorGanttRecord);
                    }
                }
            }
        }
    }

    /**
     * Method to validate date of tasks with predecessor values for all records
     *
     * @returns {void} .
     * @private
     */
    public updatedRecordsDateByPredecessor(): void {
        const flatData: IGanttData[] = this.parent.flatData;
        for (let count: number = 0; count < flatData.length; count++) {
            if (flatData[count].ganttProperties.predecessor) {
                this.validatePredecessorDates(flatData[count]);
            }
        }
    }
    /**
     * To validate task date values with dependency
     *
     * @param {IGanttData} ganttRecord .
     * @returns {void} .
     * @private
     */
    public validatePredecessorDates(ganttRecord: IGanttData): void {
        if (ganttRecord.ganttProperties.predecessor) {
            const predecessorsCollection: IPredecessor[] = ganttRecord.ganttProperties.predecessor;
            let count: number;
            let parentGanttRecord: IGanttData;
            let record: IGanttData = null;
            const currentTaskId: string = this.parent.viewType === 'ResourceView' ? ganttRecord.ganttProperties.taskId.toString()
                : ganttRecord.ganttProperties.rowUniqueID.toString();
            const predecessors: IPredecessor[] = predecessorsCollection.filter((data: IPredecessor): IPredecessor => {
                if (data.to === currentTaskId) {
                    return data;
                } else {
                    return null;
                }
            });
            for (count = 0; count < predecessors.length; count++) {
                const predecessor: IPredecessor = predecessors[count];
                parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor.from);
                record = this.parent.connectorLineModule.getRecordByID(predecessor.to);
                if (record.ganttProperties.isAutoSchedule || this.parent.validateManualTasksOnLinking) {
                    this.validateChildGanttRecord(parentGanttRecord, record);
                }
            }
        }
    }
    /**
     * Method to validate task with predecessor
     *
     * @param {IGanttData} parentGanttRecord .
     * @param {IGanttData} childGanttRecord .
     * @returns {void} .
     */
    private validateChildGanttRecord(parentGanttRecord: IGanttData, childGanttRecord: IGanttData): void {
        if (this.parent.editedTaskBarItem === childGanttRecord || isNullOrUndefined(isScheduledTask(parentGanttRecord.ganttProperties))
            || isNullOrUndefined(isScheduledTask(childGanttRecord.ganttProperties))) {
            return;
        }
        if (this.parent.isInPredecessorValidation && (childGanttRecord.ganttProperties.isAutoSchedule ||
            this.parent.validateManualTasksOnLinking)) {
            const childRecordProperty: ITaskData = childGanttRecord.ganttProperties;
            const currentTaskId: string = this.parent.viewType === 'ResourceView' ? childRecordProperty.taskId.toString()
                : childRecordProperty.rowUniqueID.toString();
            const predecessorsCollection: IPredecessor[] = childRecordProperty.predecessor;
            const childPredecessor: IPredecessor[] = predecessorsCollection.filter((data: IPredecessor): IPredecessor => {
                if (data.to === currentTaskId) { return data; } else { return null; }
            });
            const startDate: Date = this.getPredecessorDate(childGanttRecord, childPredecessor);
            this.parent.setRecordValue('startDate', startDate, childRecordProperty, true);
            this.parent.dataOperation.updateMappingData(childGanttRecord, 'startDate');
            const segments: ITaskSegment[] = childGanttRecord.ganttProperties.segments;
            if (isNullOrUndefined(segments)) {
                this.dateValidateModule.calculateEndDate(childGanttRecord);
            }
            this.parent.dataOperation.updateWidthLeft(childGanttRecord);

            if (childGanttRecord.parentItem && this.parent.getParentTask(childGanttRecord.parentItem).ganttProperties.isAutoSchedule
                && this.parent.isInPredecessorValidation) {
                this.parent.dataOperation.updateParentItems(childGanttRecord.parentItem);
            }
        }
    }
    /**
     *
     * @param {IGanttData} ganttRecord .
     * @param {IPredecessor[]} predecessorsCollection .
     * @returns {Date} .
     * @private
     */
    public getPredecessorDate(ganttRecord: IGanttData, predecessorsCollection: IPredecessor[]): Date {
        let maxStartDate: Date;
        let tempStartDate: Date;
        let parentGanttRecord: IGanttData;
        let childGanttRecord: IGanttData;
        const validatedPredecessor: IPredecessor[] = predecessorsCollection.filter((data: IPredecessor): IPredecessor => {
            const id: string = this.parent.viewType === 'ResourceView' ? ganttRecord.ganttProperties.taskId
                : ganttRecord.ganttProperties.rowUniqueID;
            if (data.to === id.toString()) {
                return data;
            } else {
                return null;
            }
        });
        if (validatedPredecessor) {
            const length: number = validatedPredecessor.length;
            for (let i: number = 0; i < length; i++) {
                const predecessor: IPredecessor = validatedPredecessor[i];
                parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor.from);
                childGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor.to);
                tempStartDate =
                    this.getValidatedStartDate(childGanttRecord.ganttProperties, parentGanttRecord.ganttProperties, predecessor);
                if (maxStartDate == null || this.dateValidateModule.compareDates(tempStartDate, maxStartDate) === 1) {
                    maxStartDate = tempStartDate;
                }
            }
        }
        return maxStartDate;
    }
    /**
     * Get validated start date as per predecessor type
     *
     * @param {ITaskData} ganttProperty .
     * @param {ITaskData} parentRecordProperty .
     * @param {IPredecessor} predecessor .
     * @returns {Date} .
     */
    private getValidatedStartDate(ganttProperty: ITaskData, parentRecordProperty: ITaskData, predecessor: IPredecessor): Date {
        const type: string = predecessor.type;
        const offset: number = predecessor.offset;
        let tempDate: Date;
        let returnStartDate: Date;
        switch (type) {
        case 'FS':
            tempDate = this.dateValidateModule.getValidEndDate(parentRecordProperty);
            if (!ganttProperty.isMilestone || offset !== 0) {
                tempDate = this.dateValidateModule.checkStartDate(tempDate, ganttProperty);
            }
            if (offset !== 0) {
                tempDate = this.updateDateByOffset(tempDate, predecessor, ganttProperty);
            }
            if (!ganttProperty.isMilestone) {
                returnStartDate = this.dateValidateModule.checkStartDate(tempDate, ganttProperty);
            } else {
                returnStartDate = tempDate;
            }
            break;
        case 'FF':
        case 'SF':
            tempDate = type === 'FF' ? this.dateValidateModule.getValidEndDate(parentRecordProperty) :
                this.dateValidateModule.getValidStartDate(parentRecordProperty);
            if (offset !== 0) {
                tempDate = this.updateDateByOffset(tempDate, predecessor, ganttProperty);
            }
            if (!ganttProperty.isMilestone) {
                tempDate = this.dateValidateModule.checkEndDate(tempDate, ganttProperty);
            }
            returnStartDate = this.dateValidateModule.getStartDate(
                tempDate, ganttProperty.duration, ganttProperty.durationUnit, ganttProperty);
            break;
        case 'SS':
            tempDate = this.dateValidateModule.getValidStartDate(parentRecordProperty);
            if (offset !== 0) {
                tempDate = this.updateDateByOffset(tempDate, predecessor, ganttProperty);
            }
            if (!ganttProperty.isMilestone) {
                returnStartDate = this.dateValidateModule.checkStartDate(tempDate, ganttProperty);
            } else {
                returnStartDate = tempDate;
            }
            break;
        }
        return returnStartDate;
    }
    /**
     *
     * @param {Date} date .
     * @param {IPredecessor} predecessor .
     * @param {ITaskData} record .
     * @returns {void} .
     */
    private updateDateByOffset(date: Date, predecessor: IPredecessor, record: ITaskData): Date {
        let resultDate: Date;
        const offsetValue: number = predecessor.offset;
        const durationUnit: string = predecessor.offsetUnit;
        if (offsetValue < 0) {
            resultDate = this.dateValidateModule.getStartDate(
                this.dateValidateModule.checkEndDate(date, record), (offsetValue * -1), durationUnit, record);
        } else {
            resultDate = this.dateValidateModule.getEndDate(date, offsetValue, durationUnit, record, false);
            if (!record.isMilestone) {
                resultDate = this.dateValidateModule.checkStartDate(resultDate, record);
            }
        }
        return resultDate;
    }
    /**
     *
     * @param {IGanttData} records .
     * @returns {void} .
     * @private
     */
    public createConnectorLinesCollection(records?: IGanttData[]): void {
        const ganttRecords: IGanttData [] = records ? records : this.parent.currentViewData;
        const recordLength: number = ganttRecords.length;
        let count: number; let ganttRecord: IGanttData;
        let predecessorsCollection: object[];
        this.parent.connectorLineModule.expandedRecords = this.parent.virtualScrollModule && this.parent.enableVirtualization ?
            this.parent.updatedRecords : this.parent.getExpandedRecords(this.parent.updatedRecords);
        for (count = 0; count < recordLength; count++) {
            ganttRecord = ganttRecords[count];
            predecessorsCollection = ganttRecord.ganttProperties.predecessor;
            if (predecessorsCollection) {
                this.addPredecessorsCollection(predecessorsCollection);
            }
        }
    }
    /**
     *
     * @param {object[]} predecessorsCollection .
     * @returns {void} .
     */
    private addPredecessorsCollection(predecessorsCollection: object[]): void {
        let predecessorsLength: number;
        let predecessorCount: number;
        let predecessor: IPredecessor;
        let parentGanttRecord: IGanttData;
        let childGanttRecord: IGanttData;
        if (predecessorsCollection) {
            predecessorsLength = predecessorsCollection.length;
            for (predecessorCount = 0; predecessorCount < predecessorsLength; predecessorCount++) {
                predecessor = predecessorsCollection[predecessorCount];
                const from: string = 'from'; const to: string = 'to';
                parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[from]);
                childGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[to]);
                if (this.parent.connectorLineModule.expandedRecords &&
                     this.parent.connectorLineModule.expandedRecords.indexOf(parentGanttRecord) !== -1 &&
                    this.parent.connectorLineModule.expandedRecords.indexOf(childGanttRecord) !== -1) {
                    this.updateConnectorLineObject(parentGanttRecord, childGanttRecord, predecessor);
                }
            }
        }
    }

    /**
     * To refresh connector line object collections
     *
     * @param {IGanttData} parentGanttRecord .
     * @param {IGanttData} childGanttRecord .
     * @param {IPredecessor} predecessor .
     * @returns {void} .
     * @private
     */
    public updateConnectorLineObject(
        parentGanttRecord: IGanttData,
        childGanttRecord: IGanttData,
        predecessor: IPredecessor): IConnectorLineObject {
        const connectorObj: IConnectorLineObject = this.parent.connectorLineModule.createConnectorLineObject(
            parentGanttRecord, childGanttRecord, predecessor);
        if (connectorObj) {
            if ((this.parent.connectorLineIds.length > 0 && this.parent.connectorLineIds.indexOf(connectorObj.connectorLineId) === -1) ||
            this.parent.connectorLineIds.length === 0) {
                this.parent.updatedConnectorLineCollection.push(connectorObj);
                this.parent.connectorLineIds.push(connectorObj.connectorLineId);
            } else if (this.parent.connectorLineIds.indexOf(connectorObj.connectorLineId) !== -1) {
                const index: number = this.parent.connectorLineIds.indexOf(connectorObj.connectorLineId);
                this.parent.updatedConnectorLineCollection[index] = connectorObj;
            }
            predecessor.isDrawn = true;
        }
        return connectorObj;
    }
    /**
     *
     * @param {IGanttData} childGanttRecord .
     * @param {IPredecessor[]} previousValue .
     * @param {string} validationOn .
     * @returns {void} .
     * @private
     */
    public validatePredecessor(childGanttRecord: IGanttData, previousValue: IPredecessor[], validationOn: string): void {
        if (!this.parent.isInPredecessorValidation) {
            return;
        }
        if (childGanttRecord.ganttProperties.predecessor) {
            const predecessorsCollection: IPredecessor[] = childGanttRecord.ganttProperties.predecessor;
            let parentGanttRecord: IGanttData; let record: IGanttData = null;
            let predecessor: IPredecessor;
            let successor: IPredecessor;
            const currentTaskId: string = this.parent.viewType === 'ResourceView' ? childGanttRecord.ganttProperties.taskId.toString()
                : childGanttRecord.ganttProperties.rowUniqueID.toString();
            const predecessors: IPredecessor[] = predecessorsCollection.filter((data: IPredecessor): IPredecessor => {
                if (data.to === currentTaskId) { return data; } else { return null; }
            });
            const successors: IPredecessor[] = predecessorsCollection.filter((data: IPredecessor): IPredecessor => {
                if (data.from === currentTaskId) { return data; } else { return null; }
            });
            for (let count: number = 0; count < predecessors.length; count++) {
                predecessor = predecessors[count];
                parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor.from);
                record = this.parent.connectorLineModule.getRecordByID(predecessor.to);
                if (this.parent.isInPredecessorValidation && record.ganttProperties.isAutoSchedule) {
                    this.parent.isValidationEnabled = true;
                } else {
                    this.parent.isValidationEnabled = false;
                }
                const id: string = this.parent.viewType === 'ResourceView' ? childGanttRecord.ganttProperties.taskId
                    : childGanttRecord.ganttProperties.rowUniqueID;
                if ((id.toString() === predecessor.to
                    || id.toString() === predecessor.from)
                    && (!validationOn || validationOn === 'predecessor')) {
                    this.validateChildGanttRecord(parentGanttRecord, record);
                }
            }

            for (let count: number = 0; count < successors.length; count++) {
                successor = successors[count];
                parentGanttRecord = this.parent.connectorLineModule.getRecordByID(successor.from);
                record = this.parent.connectorLineModule.getRecordByID(successor.to);
                if (this.parent.isInPredecessorValidation && record.ganttProperties.isAutoSchedule) {
                    this.parent.isValidationEnabled = true;
                } else {
                    this.parent.isValidationEnabled = false;
                }
                if (validationOn !== 'predecessor' && this.parent.isValidationEnabled) {
                    this.validateChildGanttRecord(parentGanttRecord, record);
                }
                if (parentGanttRecord.expanded === false || record.expanded === false) {
                    if (record) { this.validatePredecessor(record, undefined, 'successor'); }
                    continue;
                }
                if (record) { this.validatePredecessor(record, undefined, 'successor'); }
            }
        }
    }

    /**
     * Method to get validate able predecessor alone from record
     *
     * @param {IGanttData} record .
     * @returns {IPredecessor[]} .
     * @private
     */
    public getValidPredecessor(record: IGanttData): IPredecessor[] {
        let validPredecessor: IPredecessor[] = [];
        if (!isNullOrUndefined(record)) {
            const recPredecessor: IPredecessor[] = record.ganttProperties.predecessor;
            if (recPredecessor && recPredecessor.length > 0) {
                validPredecessor = recPredecessor.filter((value: IPredecessor) => {
                    const id: string = this.parent.viewType === 'ResourceView' ? record.ganttProperties.taskId
                        : record.ganttProperties.rowUniqueID;
                    return value.from !== id.toString();
                });
            }
        }
        return validPredecessor;
    }
}
