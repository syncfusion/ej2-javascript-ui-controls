/**
 * Predecessor calculation goes here
 */
import { IGanttData, ITaskData, IPredecessor, IConnectorLineObject } from '../base/interface';
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
     * @private
     */
    public ensurePredecessorCollection(): void {
        let predecessorTasks: IGanttData[] = this.parent.predecessorsCollection;
        let length: number = predecessorTasks.length - 1;
        for (let count: number = length; count >= 0; count--) {
            let ganttData: IGanttData = predecessorTasks[count];
            let ganttProp: ITaskData = ganttData.ganttProperties;
            if (!ganttData.hasChildRecords) {
                this.ensurePredecessorCollectionHelper(ganttData, ganttProp);
            }
        }
    }
    /**
     * 
     * @param ganttData 
     * @param ganttProp 
     * @private
     */
    public ensurePredecessorCollectionHelper(ganttData: IGanttData, ganttProp: ITaskData): void {
        let predecessorVal: object[] | string | number = ganttProp.predecessorsName;
        if (predecessorVal && (typeof predecessorVal === 'string' || typeof predecessorVal === 'number')) {
            this.parent.setRecordValue('predecessor', this.calculatePredecessor(predecessorVal, ganttData), ganttProp, true);
        } else if (predecessorVal && typeof predecessorVal === 'object' && predecessorVal.length) {
            let preValues: IPredecessor[] = [];
            for (let c: number = 0; c < predecessorVal.length; c++) {
                let predecessorItem: object = predecessorVal[c];
                let preValue: IPredecessor = {};
                preValue.from = getValue('from', predecessorItem);
                preValue.to = getValue('to', predecessorItem) ? getValue('to', predecessorItem) : ganttProp.rowUniqueID;
                preValue.type = getValue('type', predecessorItem) ? getValue('type', predecessorItem) : 'FS';
                let offsetUnits: object = getValue('offset', predecessorItem);
                if (isNullOrUndefined(offsetUnits)) {
                    preValue.offset = 0;
                    preValue.offsetUnit = this.parent.durationUnit.toLocaleLowerCase();
                } else if (typeof offsetUnits === 'string') {
                    let tempOffsetUnits: { duration: number, durationUnit: string } = this.getOffsetDurationUnit(
                        getValue('offset', predecessorItem));
                    preValue.offset = tempOffsetUnits.duration;
                    preValue.offsetUnit = tempOffsetUnits.durationUnit;
                } else {
                    preValue.offset = parseFloat(offsetUnits.toString());
                    preValue.offsetUnit = this.parent.durationUnit.toLocaleLowerCase();
                }
                let isOwnParent: boolean = this.checkIsParent(preValue.from.toString());
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
     * @private
     */
    public updateUnscheduledDependency(data: IGanttData): void {
        let task: TaskFieldsModel = this.parent.taskFields;
        let prdList: string[] = !isNullOrUndefined(data[task.dependency]) ?
            data[task.dependency].toString().split(',') : [];
        for (let i: number = 0; i < prdList.length; i++) {
            let predId: number = parseInt(prdList[i], 10);
            if (!isNaN(predId)) {
                let predData: IGanttData = this.parent.getRecordByID(predId.toString());
                let record: ITaskData = !isNullOrUndefined(predData) ?
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
     * @param ganttData Method to check parent dependency in predecessor
     * @param fromId 
     */
    private checkIsParent(fromId: string): boolean {
        let boolValue: boolean = false;
        let task: IGanttData = this.parent.getRecordByID(fromId);
        if (task.hasChildRecords) {
            boolValue = true;
        }
        return boolValue;
    }

    /**
     * Get predecessor collection object from predecessor string value
     * @param predecessorValue 
     * @param ganttRecord 
     * @private
     */
    public calculatePredecessor(predecessorValue: string | number, ganttRecord?: IGanttData): IPredecessor[] {
        let predecessor: string = predecessorValue.toString();
        let collection: IPredecessor[] = [];
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
            /*Validate for appropriate predecessor*/
            if (match[0] && this.parent.ids.indexOf(match[0]) !== -1) {
                if (match.length > 1) {
                    let type: string = match[1].toUpperCase();
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
            let offsetUnits: { duration: number, durationUnit: string } = this.getOffsetDurationUnit(tempOffset);

            let obj: IPredecessor = {
                from: match[0],
                type: predecessorText,
                isDrawn: false,
                to: ganttRecord.ganttProperties.rowUniqueID.toString(),
                offsetUnit: offsetUnits.durationUnit,
                offset: offsetUnits.duration
            };
            let isOwnParent: boolean = this.checkIsParent(match[0]);
            if (!isOwnParent) {
                collection.push(obj);
            }
        });
        return collection;
    }

    /**
     * Get predecessor value as string with offset values
     * @param data 
     * @private
     */
    public getPredecessorStringValue(data: IGanttData): string {
        let predecessors: IPredecessor[] = data.ganttProperties.predecessor;
        let durationUnitTexts: object = this.parent.durationUnitTexts;
        let resultString: string = '';
        if (predecessors) {
            let length: number = predecessors.length;
            for (let i: number = 0; i < length; i++) {
                let currentValue: IPredecessor = predecessors[i];
                let temp: string = '';
                if (currentValue.from !== data.ganttProperties.rowUniqueID.toString()) {
                    temp = currentValue.from + currentValue.type;
                    if (currentValue.offset !== 0) {
                        temp += currentValue.offset > 0 ? ('+' + currentValue.offset + ' ') : (currentValue.offset + ' ');
                        let multiple: boolean = currentValue.offset !== 1;
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
        let durationUnitLabels: object = this.parent.durationUnitEditText;
        if (typeof val === 'string') {
            let values: string[] = val.match(/[^0-9]+|[0-9]+/g);
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
     * @private
     */
    public updatePredecessors(): void {
        let predecessorsCollection: IGanttData[] = this.parent.predecessorsCollection;
        let ganttRecord: IGanttData;
        let length: number = predecessorsCollection.length;
        for (let count: number = 0; count < length; count++) {
            ganttRecord = predecessorsCollection[count];
            if (!ganttRecord.hasChildRecords) {
                this.updatePredecessorHelper(ganttRecord, predecessorsCollection);
            }
        }
    }
    /**
     * To update predecessor collection to successor tasks
     * @param ganttRecord 
     * @param predecessorsCollection 
     * @private
     */
    public updatePredecessorHelper(ganttRecord: IGanttData, predecessorsCollection?: IGanttData[]): void {
        let connectorsCollection: IPredecessor[];
        let successorGanttRecord: IGanttData;
        let connectorCount: number;
        predecessorsCollection = isNullOrUndefined(predecessorsCollection) ? [] : predecessorsCollection;
        connectorsCollection = ganttRecord.ganttProperties.predecessor;
        connectorCount = connectorsCollection.length;
        for (let i: number = 0; i < connectorCount; i++) {
            let connector: IPredecessor = connectorsCollection[i];
            successorGanttRecord = this.parent.getRecordByID(connector.from);
            if (connector.from !== ganttRecord.ganttProperties.rowUniqueID.toString()) {
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
     * @private
     */
    public updatedRecordsDateByPredecessor(): void {
        let flatData: IGanttData[] = this.parent.flatData;
        for (let count: number = 0; count < flatData.length; count++) {
            if (flatData[count].ganttProperties.predecessor && flatData[count].taskData[this.parent.taskFields.dependency]) {
                this.validatePredecessorDates(flatData[count]);
            }
        }
    }
    /**
     * To validate task date values with dependency
     * @param ganttRecord 
     * @private
     */
    public validatePredecessorDates(ganttRecord: IGanttData): void {
        if (ganttRecord.ganttProperties.predecessor) {
            let predecessorsCollection: IPredecessor[] = ganttRecord.ganttProperties.predecessor;
            let count: number;
            let parentGanttRecord: IGanttData;
            let record: IGanttData = null;
            let currentTaskId: string = ganttRecord.ganttProperties.rowUniqueID.toString();
            let predecessors: IPredecessor[] = predecessorsCollection.filter((data: IPredecessor): IPredecessor => {
                if (data.to === currentTaskId) {
                    return data;
                } else {
                    return null;
                }
            });
            for (count = 0; count < predecessors.length; count++) {
                let predecessor: IPredecessor;
                predecessor = predecessors[count];
                parentGanttRecord = this.parent.getRecordByID(predecessor.from);
                record = this.parent.getRecordByID(predecessor.to);
                if (record.ganttProperties.isAutoSchedule || this.parent.validateManualTasksOnLinking) {
                    this.validateChildGanttRecord(parentGanttRecord, record);
                }
            }
        }
    }
    /**
     * Method to validate task with predecessor
     * @param parentGanttRecord 
     * @param childGanttRecord 
     */
    private validateChildGanttRecord(parentGanttRecord: IGanttData, childGanttRecord: IGanttData): void {
        if (this.parent.editedTaskBarItem === childGanttRecord || isNullOrUndefined(isScheduledTask(parentGanttRecord.ganttProperties))
            || isNullOrUndefined(isScheduledTask(childGanttRecord.ganttProperties))) {
            return;
        }
        if (this.parent.isInPredecessorValidation && (childGanttRecord.ganttProperties.isAutoSchedule ||
             this.parent.validateManualTasksOnLinking)) {
            let childRecordProperty: ITaskData = childGanttRecord.ganttProperties;
            let currentTaskId: string = childRecordProperty.rowUniqueID.toString();
            let predecessorsCollection: IPredecessor[] = childRecordProperty.predecessor;
            let childPredecessor: IPredecessor[] = predecessorsCollection.filter((data: IPredecessor): IPredecessor => {
                if (data.to === currentTaskId) { return data; } else { return null; }
            });
            let startDate: Date = this.getPredecessorDate(childGanttRecord, childPredecessor);
            this.parent.setRecordValue('startDate', startDate, childRecordProperty, true);
            this.parent.dataOperation.updateMappingData(childGanttRecord, 'startDate');
            this.dateValidateModule.calculateEndDate(childGanttRecord);
            this.parent.setRecordValue(
                'left',
                this.parent.dataOperation.calculateLeft(childRecordProperty),
                childRecordProperty,
                true);
            this.parent.setRecordValue(
                'width',
                this.parent.dataOperation.calculateWidth(childGanttRecord),
                childRecordProperty,
                true);
            this.parent.setRecordValue(
                'progressWidth',
                this.parent.dataOperation.getProgressWidth(childRecordProperty.width, childRecordProperty.progress),
                childRecordProperty,
                true);
            if (childGanttRecord.parentItem && this.parent.getParentTask(childGanttRecord.parentItem).ganttProperties.isAutoSchedule
                && this.parent.isInPredecessorValidation) {
                this.parent.dataOperation.updateParentItems(childGanttRecord.parentItem);
            }
        }
    }
    /**
     * 
     * @param ganttRecord 
     * @param predecessorsCollection 
     * @private
     */
    public getPredecessorDate(ganttRecord: IGanttData, predecessorsCollection: IPredecessor[]): Date {
        let maxStartDate: Date;
        let tempStartDate: Date;
        let parentGanttRecord: IGanttData;
        let childGanttRecord: IGanttData;
        let validatedPredecessor: IPredecessor[] = predecessorsCollection.filter((data: IPredecessor): IPredecessor => {
            if (data.to === ganttRecord.ganttProperties.rowUniqueID.toString()) {
                return data;
            } else {
                return null;
            }
        });
        if (validatedPredecessor) {
            let length: number = validatedPredecessor.length;
            for (let i: number = 0; i < length; i++) {
                let predecessor: IPredecessor = validatedPredecessor[i];
                parentGanttRecord = this.parent.getRecordByID(predecessor.from);
                childGanttRecord = this.parent.getRecordByID(predecessor.to);
                tempStartDate =
                    this.getValidatedStartDate(childGanttRecord.ganttProperties, parentGanttRecord.ganttProperties, predecessor);
                if (maxStartDate == null) {
                    maxStartDate = tempStartDate;
                } else if (this.dateValidateModule.compareDates(tempStartDate, maxStartDate) === 1) {
                    maxStartDate = tempStartDate;
                }
            }
        }
        return maxStartDate;
    }
    /**
     * Get validated start date as per predecessor type
     * @param ganttRecord 
     * @param parentGanttRecord 
     * @param predecessor 
     */
    private getValidatedStartDate(ganttProperty: ITaskData, parentRecordProperty: ITaskData, predecessor: IPredecessor): Date {
        let type: string = predecessor.type;
        let offset: number = predecessor.offset;
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
     * @param date 
     * @param predecessor 
     * @param isMilestone 
     * @param record 
     */
    private updateDateByOffset(date: Date, predecessor: IPredecessor, record: ITaskData): Date {
        let resultDate: Date;
        let offsetValue: number = predecessor.offset;
        let durationUnit: string = predecessor.offsetUnit;
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
     * @param records 
     * @private
     */
    public createConnectorLinesCollection(records: IGanttData[]): void {
        let recordLength: number = records.length;
        let count: number; let ganttRecord: IGanttData;
        let predecessorsCollection: object[];
        for (count = 0; count < recordLength; count++) {
            ganttRecord = records[count];
            predecessorsCollection = ganttRecord.ganttProperties.predecessor;
            if (predecessorsCollection) {
                this.addPredecessorsCollection(predecessorsCollection);
            }
        }
    }
    /**
     * 
     * @param predecessorsCollection 
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
                let from: string = 'from'; let to: string = 'to';
                parentGanttRecord = this.parent.getRecordByID(predecessor[from]);
                childGanttRecord = this.parent.getRecordByID(predecessor[to]);
                if (this.parent.currentViewData && this.parent.currentViewData.indexOf(parentGanttRecord) !== -1 &&
                    this.parent.currentViewData.indexOf(childGanttRecord) !== -1) {
                    this.updateConnectorLineObject(parentGanttRecord, childGanttRecord, predecessor);
                }
            }
        }
    }

    /**
     * To refresh connector line object collections
     * @param parentGanttRecord 
     * @param childGanttRecord 
     * @param predecessor 
     * @private
     */
    public updateConnectorLineObject(
        parentGanttRecord: IGanttData,
        childGanttRecord: IGanttData,
        predecessor: IPredecessor): IConnectorLineObject {
        let connectorObj: IConnectorLineObject;
        connectorObj = this.parent.connectorLineModule.createConnectorLineObject(
            parentGanttRecord, childGanttRecord, predecessor);
        if (connectorObj) {
            if (this.parent.connectorLineIds.length > 0 && this.parent.connectorLineIds.indexOf(connectorObj.connectorLineId) === -1) {
                this.parent.updatedConnectorLineCollection.push(connectorObj);
                this.parent.connectorLineIds.push(connectorObj.connectorLineId);
            } else if (this.parent.connectorLineIds.length === 0) {
                this.parent.updatedConnectorLineCollection.push(connectorObj);
                this.parent.connectorLineIds.push(connectorObj.connectorLineId);
            } else if (this.parent.connectorLineIds.indexOf(connectorObj.connectorLineId) !== -1) {
                let index: number = this.parent.connectorLineIds.indexOf(connectorObj.connectorLineId);
                this.parent.updatedConnectorLineCollection[index] = connectorObj;
            }
            predecessor.isDrawn = true;
        }
        return connectorObj;
    }
    /**
     * 
     * @param childGanttRecord 
     * @param previousValue 
     * @param validationOn 
     * @private
     */
    public validatePredecessor(childGanttRecord: IGanttData, previousValue: IPredecessor[], validationOn: string): void {
        if (!this.parent.isInPredecessorValidation) {
            return;
        }
        if (childGanttRecord.ganttProperties.predecessor) {
            let predecessorsCollection: IPredecessor[] = childGanttRecord.ganttProperties.predecessor;
            let parentGanttRecord: IGanttData; let record: IGanttData = null;
            let predecessor: IPredecessor;
            let currentTaskId: string = childGanttRecord.ganttProperties.rowUniqueID.toString();
            let predecessors: IPredecessor[] = predecessorsCollection.filter((data: IPredecessor): IPredecessor => {
                if (data.to === currentTaskId) { return data; } else { return null; }
            });
            let successors: IPredecessor[] = predecessorsCollection.filter((data: IPredecessor): IPredecessor => {
                if (data.from === currentTaskId) { return data; } else { return null; }
            });
            for (let count: number = 0; count < predecessors.length; count++) {
                predecessor = predecessors[count];
                parentGanttRecord = this.parent.getRecordByID(predecessor.from);
                record = this.parent.getRecordByID(predecessor.to);
                if (this.parent.isInPredecessorValidation && record.ganttProperties.isAutoSchedule) {
                    this.parent.isValidationEnabled = true;
                } else {
                    this.parent.isValidationEnabled = false;
                }
                if ((childGanttRecord.ganttProperties.rowUniqueID.toString() === predecessor.to
                    || childGanttRecord.ganttProperties.rowUniqueID.toString() === predecessor.from)
                    && (!validationOn || validationOn === 'predecessor')) {
                    this.validateChildGanttRecord(parentGanttRecord, record);
                }
            }

            for (let count: number = 0; count < successors.length; count++) {
                predecessor = successors[count];
                parentGanttRecord = this.parent.getRecordByID(predecessor.from);
                record = this.parent.getRecordByID(predecessor.to);
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
     * @param record 
     * @private
     */
    public getValidPredecessor(record: IGanttData): IPredecessor[] {
        let validPredecessor: IPredecessor[] = [];
        if (!isNullOrUndefined(record)) {
            let recPredecessor: IPredecessor[] = record.ganttProperties.predecessor;
            if (recPredecessor && recPredecessor.length > 0) {
                validPredecessor = recPredecessor.filter((value: IPredecessor) => {
                    return value.from !== record.ganttProperties.rowUniqueID.toString();
                });
            }
        }
        return validPredecessor;
    }
}