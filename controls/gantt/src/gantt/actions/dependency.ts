/**
 * Predecessor calculation goes here
 */
import { IGanttData, ITaskData, IPredecessor, IValidateArgs } from '../base/interface';
import { DateProcessor } from '../base/date-processor';
import { Gantt } from '../base/gantt';
import { DurationUnits } from '../base/enum';
import { isScheduledTask, formatString, getIndex } from '../base/utils';
import { getValue, isNullOrUndefined, createElement, extend } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';

export class Dependency {

    private parent: Gantt;
    private dateValidateModule: DateProcessor;
    public validationPredecessor: IPredecessor[] = null;
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
            this.ensurePredecessorCollectionHelper(ganttData, ganttProp);

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
                preValue.to = getValue('to', predecessorItem) ? getValue('to', predecessorItem) : ganttProp.taskId;
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
                to: ganttRecord.ganttProperties.taskId.toString(),
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
                if (currentValue.from !== data.ganttProperties.taskId.toString()) {
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
                    durationUnit = DurationUnits.Minute;
                } else if (getValue('hour', durationUnitLabels).indexOf(durationUnit) !== -1) {
                    durationUnit = DurationUnits.Hour;
                } else if (getValue('day', durationUnitLabels).indexOf(durationUnit) !== -1) {
                    durationUnit = DurationUnits.Day;
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
            this.updatePredecessorHelper(ganttRecord, predecessorsCollection);
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
            if (connector.from !== ganttRecord.ganttProperties.taskId.toString()) {
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
            let currentTaskId: string = ganttRecord.ganttProperties.taskId.toString();
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
                if (record.ganttProperties.isAutoSchedule) {
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
        if (this.parent.enablePredecessorValidation && (childGanttRecord.ganttProperties.isAutoSchedule)) {
            let childRecordProperty: ITaskData = childGanttRecord.ganttProperties;
            let currentTaskId: string = childRecordProperty.taskId.toString();
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
                this.parent.dataOperation.calculateWidth(childRecordProperty),
                childRecordProperty,
                true);
            this.parent.setRecordValue(
                'progressWidth',
                this.parent.dataOperation.getProgressWidth(childRecordProperty.width, childRecordProperty.progress),
                childRecordProperty,
                true);
            if (childGanttRecord.parentItem && this.parent.getParentTask(childGanttRecord.parentItem).ganttProperties.isAutoSchedule
                && this.parent.enablePredecessorValidation) {
                this.parent.dataOperation.updateParentItems(childGanttRecord.parentItem);
            }
        }
    }
    /**
     * 
     * @param ganttRecord 
     * @param predecessorsCollection 
     */
    private getPredecessorDate(ganttRecord: IGanttData, predecessorsCollection: IPredecessor[]): Date {
        let maxStartDate: Date;
        let tempStartDate: Date;
        let parentGanttRecord: IGanttData;
        let childGanttRecord: IGanttData;
        let validatedPredecessor: IPredecessor[] = predecessorsCollection.filter((data: IPredecessor): IPredecessor => {
            if (data.to === ganttRecord.ganttProperties.taskId.toString()) {
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
                    this.parent.connectorLineEditModule.updateConnectorLineObject(parentGanttRecord, childGanttRecord, predecessor);
                }
            }
        }
    }


    /**
     * 
     * @param childGanttRecord 
     * @param previousValue 
     * @param validationOn 
     * @private
     */
    public validatePredecessor(childGanttRecord: IGanttData, previousValue: IPredecessor[], validationOn: string): void {
        if (!this.parent.enablePredecessorValidation) {
            return;
        }
        if (childGanttRecord.ganttProperties.predecessor) {
            let predecessorsCollection: IPredecessor[] = childGanttRecord.ganttProperties.predecessor;
            let parentGanttRecord: IGanttData; let record: IGanttData = null;
            let predecessor: IPredecessor;
            let currentTaskId: string = childGanttRecord.ganttProperties.taskId.toString();
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
                if (this.parent.enablePredecessorValidation && record.ganttProperties.isAutoSchedule) {
                    this.parent.isValidationEnabled = true;
                } else {
                    this.parent.isValidationEnabled = false;
                }
                if ((childGanttRecord.ganttProperties.taskId.toString() === predecessor.to
                    || childGanttRecord.ganttProperties.taskId.toString() === predecessor.from)
                    && (!validationOn || validationOn === 'predecessor')) {
                    this.validateChildGanttRecord(parentGanttRecord, record);
                }
            }

            for (let count: number = 0; count < successors.length; count++) {
                predecessor = successors[count];
                parentGanttRecord = this.parent.getRecordByID(predecessor.from);
                record = this.parent.getRecordByID(predecessor.to);
                if (this.parent.enablePredecessorValidation && record.ganttProperties.isAutoSchedule) {
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
     * Predecessor link validation dialog template
     * @param args
     * @private
     */
    public validationDialogTemplate(args: object): HTMLElement {
        let ganttId: string = this.parent.element.id;
        let contentdiv: HTMLElement = createElement('div', {
            className: 'e-ValidationContent'
        });
        let taskData: IGanttData = getValue('task', args);
        let parenttaskData: IGanttData = getValue('parentTask', args);
        let violationType: string = getValue('violationType', args);
        let recordName: string = taskData.ganttProperties.taskName;
        let recordNewStartDate: string = this.parent.getFormatedDate(taskData.ganttProperties.startDate, 'MM/dd/yyyy');
        let parentName: string = parenttaskData.ganttProperties.taskName;
        let recordArgs: string[] = [recordName, parentName];
        let topContent: string; let topContentText: string;
        if (violationType === 'taskBeforePredecessor_FS') {
            topContentText = this.parent.localeObj.getConstant('taskBeforePredecessor_FS');
        } else if (violationType === 'taskAfterPredecessor_FS') {
            topContentText = this.parent.localeObj.getConstant('taskAfterPredecessor_FS');
        } else if (violationType === 'taskBeforePredecessor_SS') {
            topContentText = this.parent.localeObj.getConstant('taskBeforePredecessor_SS');
        } else if (violationType === 'taskAfterPredecessor_SS') {
            topContentText = this.parent.localeObj.getConstant('taskAfterPredecessor_SS');
        } else if (violationType === 'taskBeforePredecessor_FF') {
            topContentText = this.parent.localeObj.getConstant('taskBeforePredecessor_FF');
        } else if (violationType === 'taskAfterPredecessor_FF') {
            topContentText = this.parent.localeObj.getConstant('taskAfterPredecessor_FF');
        } else if (violationType === 'taskBeforePredecessor_SF') {
            topContentText = this.parent.localeObj.getConstant('taskBeforePredecessor_SF');
        } else if (violationType === 'taskAfterPredecessor_SF') {
            topContentText = this.parent.localeObj.getConstant('taskAfterPredecessor_SF');
        }
        topContentText = formatString(topContentText, recordArgs);
        topContent = '<div id="' + ganttId + '_ValidationText">' + topContentText + '<div>';
        let innerTable: string = '<table>' +
            '<tr><td><input type="radio" id="' + ganttId + '_ValidationCancel" name="ValidationRule" checked/><label for="'
            + ganttId + '_ValidationCancel" id= "' + ganttId + '_cancelLink">Cancel, keep the existing link</label></td></tr>' +
            '<tr><td><input type="radio" id="' + ganttId + '_ValidationRemoveline" name="ValidationRule"/><label for="'
            + ganttId + '_ValidationRemoveline" id="' + ganttId + '_removeLink">Remove the link and move <b>'
            + recordName + '</b> to start on <b>' + recordNewStartDate + '</b>.</label></td></tr>' +
            '<tr><td><input type="radio" id="' + ganttId + '_ValidationAddlineOffset" name="ValidationRule"/><label for="'
            + ganttId + '_ValidationAddlineOffset" id="' + ganttId + '_preserveLink">Move the <b>'
            + recordName + '</b> to start on <b>' + recordNewStartDate + '</b> and keep the link.</label></td></tr></table>';
        contentdiv.innerHTML = topContent + innerTable;
        return contentdiv;
    }

    /**
     * To render validation dialog
     * @return {void}
     * @private
     */
    public renderValidationDialog(): void {
        let validationDialog: Dialog = new Dialog({
            header: 'Validate Editing',
            isModal: true,
            visible: false,
            width: '50%',
            showCloseIcon: true,
            close: this.validationDialogClose.bind(this),
            content: '',
            buttons: [
                {
                    click: this.validationDialogOkButton.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('okText'), isPrimary: true }
                },
                {
                    click: this.validationDialogCancelButton.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('cancel') }
                }],
            target: this.parent.element,
            animationSettings: { effect: 'None' },
        });
        document.getElementById(this.parent.element.id + '_dialogValidationRule').innerHTML = '';
        validationDialog.appendTo('#' + this.parent.element.id + '_dialogValidationRule');
        this.parent.validationDialogElement = validationDialog;
    }

    private validationDialogOkButton(): void {
        let currentArgs: IValidateArgs = this.parent.currentEditedArgs;
        currentArgs.validateMode.preserveLinkWithEditing =
            (document.getElementById(this.parent.element.id + '_ValidationAddlineOffset') as HTMLInputElement).checked;
        currentArgs.validateMode.removeLink =
            (document.getElementById(this.parent.element.id + '_ValidationRemoveline') as HTMLInputElement).checked;
        currentArgs.validateMode.respectLink =
            (document.getElementById(this.parent.element.id + '_ValidationCancel') as HTMLInputElement).checked;
        this.applyPredecessorOption();
        this.parent.validationDialogElement.hide();
    }

    private validationDialogCancelButton(): void {
        this.parent.currentEditedArgs.validateMode.respectLink = true;
        this.applyPredecessorOption();
        this.parent.validationDialogElement.hide();
    }

    private validationDialogClose(e: object): void {
        if (getValue('isInteraction', e)) {
            this.parent.currentEditedArgs.validateMode.respectLink = true;
            this.applyPredecessorOption();
        }
    }

    /**
     * Validate and apply the predecessor option from validation dialog
     * @param buttonType
     * @return {void}
     * @private
     */
    public applyPredecessorOption(): void {
        let args: IValidateArgs = this.parent.currentEditedArgs;
        let ganttRecord: IGanttData = args.data;
        if (args.validateMode.respectLink) {
            this.parent.editModule.reUpdatePreviousRecords();
            this.parent.chartRowsModule.refreshRecords([args.data]);
        } else if (args.validateMode.removeLink) {
            this.removePredecessors(ganttRecord, this.validationPredecessor);
            this.parent.editModule.updateEditedTask(args.editEventArgs);
        } else if (args.validateMode.preserveLinkWithEditing) {
            this.calculateOffset(ganttRecord);
            this.parent.editModule.updateEditedTask(args.editEventArgs);
        }
    }

    private calculateOffset(record: IGanttData): void {
        let prevPredecessor: IPredecessor[] = extend([], record.ganttProperties.predecessor, [], true) as IPredecessor[];
        let validPredecessor: IPredecessor[] = this.getValidPredecessor(record);
        for (let i: number = 0; i < validPredecessor.length; i++) {
            let predecessor: IPredecessor = validPredecessor[i];
            let parentTask: IGanttData = this.parent.getRecordByID(predecessor.from);
            let offset: number;
            if (isScheduledTask(parentTask)) {
                let tempStartDate: Date;
                let tempEndDate: Date;
                let tempDuration: number;
                let isNegativeOffset: boolean;
                switch (predecessor.type) {
                    case 'FS':
                        tempStartDate = new Date(parentTask.ganttProperties.endDate.getTime());
                        tempEndDate = new Date(record.ganttProperties.startDate.getTime());
                        break;
                    case 'SS':
                        tempStartDate = new Date(parentTask.ganttProperties.startDate.getTime());
                        tempEndDate = new Date(record.ganttProperties.startDate.getTime());
                        break;
                    case 'SF':
                        tempStartDate = new Date(parentTask.ganttProperties.startDate.getTime());
                        tempEndDate = new Date(record.ganttProperties.endDate.getTime());
                        break;
                    case 'FF':
                        tempStartDate = new Date(parentTask.ganttProperties.endDate.getTime());
                        tempEndDate = new Date(record.ganttProperties.endDate.getTime());
                        break;
                }

                if (tempStartDate.getTime() < tempEndDate.getTime()) {
                    tempStartDate = this.dateValidateModule.checkStartDate(tempStartDate);
                    tempEndDate = this.dateValidateModule.checkEndDate(tempEndDate, null);
                    isNegativeOffset = false;
                } else {
                    let tempDate: Date = new Date(tempStartDate.getTime());
                    tempStartDate = this.dateValidateModule.checkStartDate(tempEndDate);
                    tempEndDate = this.dateValidateModule.checkEndDate(tempDate, null);
                    isNegativeOffset = true;
                }
                if (tempStartDate.getTime() < tempEndDate.getTime()) {
                    tempDuration = this.dateValidateModule.getDuration(tempStartDate, tempEndDate, predecessor.offsetUnit, true, true);
                    offset = isNegativeOffset ? (tempDuration * -1) : tempDuration;
                } else {
                    offset = 0;
                }
            } else {
                offset = 0;
            }
            let preIndex: number = getIndex(predecessor, 'from', prevPredecessor, 'to');
            prevPredecessor[preIndex].offset = offset;
            // Update predecessor in predecessor task
            let parentPredecessors: IPredecessor = extend([], parentTask.ganttProperties.predecessor, [], true);
            let parentPreIndex: number = getIndex(predecessor, 'from', parentPredecessors, 'to');
            parentPredecessors[parentPreIndex].offset = offset;
            this.parent.setRecordValue('predecessor', parentPredecessors, parentTask.ganttProperties, true);
        }
        this.parent.setRecordValue('predecessor', prevPredecessor, record.ganttProperties, true);
        let predecessorString: string = this.getPredecessorStringValue(record);
        this.parent.setRecordValue('predecessorsName', predecessorString, record.ganttProperties, true);
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, record);
        this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, record);
    }
    /**
     * Update predecessor value with user selection option in predecessor validation dialog
     * @param args
     * @return {void}
     */
    private removePredecessors(ganttRecord: IGanttData, predecessor: IPredecessor[]): void {
        let prevPredecessor: IPredecessor[] =
            extend([], [], ganttRecord.ganttProperties.predecessor, true) as IPredecessor[];
        let preLength: number = predecessor.length;
        for (let i: number = 0; i < preLength; i++) {
            let parentGanttRecord: IGanttData = this.parent.getRecordByID(predecessor[i].from);
            let parentPredecessor: IPredecessor[] =
                extend([], [], parentGanttRecord.ganttProperties.predecessor, true) as IPredecessor[];
            let index: number = getIndex(predecessor[i], 'from', prevPredecessor, 'to');
            prevPredecessor.splice(index, 1);
            let parentIndex: number = getIndex(predecessor[i], 'from', parentPredecessor, 'to');
            parentPredecessor.splice(parentIndex, 1);
            this.parent.setRecordValue('predecessor', parentPredecessor, parentGanttRecord.ganttProperties, true);
        }
        if (prevPredecessor.length !== ganttRecord.ganttProperties.predecessor.length) {
            this.parent.setRecordValue('predecessor', prevPredecessor, ganttRecord.ganttProperties, true);
            let predecessorString: string = this.getPredecessorStringValue(ganttRecord);
            this.parent.setRecordValue('predecessorsName', predecessorString, ganttRecord.ganttProperties, true);
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, ganttRecord);
            this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, ganttRecord);
        }
    }

    /**
     * To open predecessor validation dialog
     * @param args
     * @return {void}
     * @private
     */
    public openValidationDialog(args: object): void {
        let contentTemplate: HTMLElement = this.validationDialogTemplate(args);
        this.parent.validationDialogElement.setProperties({ content: contentTemplate });
        this.parent.validationDialogElement.show();
    }
    /**
     * Method to get validate able predecessor alone from record
     * @param record 
     * @private
     */
    public getValidPredecessor(record: IGanttData): IPredecessor[] {
        let validPredecessor: IPredecessor[] = [];
        let recPredecessor: IPredecessor[] = record.ganttProperties.predecessor;
        if (recPredecessor && recPredecessor.length > 0) {
            validPredecessor = recPredecessor.filter((value: IPredecessor) => {
                return value.from !== record.ganttProperties.taskId.toString();
            });
        }
        return validPredecessor;
    }

    /**
     * To validate the types while editing the taskbar 
     * @param args
     * @return {boolean}
     * @private
     */
    public validateTypes(ganttRecord: IGanttData): object {
        let predecessor: IPredecessor[] = this.getValidPredecessor(ganttRecord);
        let parentGanttRecord: IGanttData;
        this.validationPredecessor = [];
        let violatedParent: IGanttData;
        let violateType: string;
        let startDate: Date = this.getPredecessorDate(ganttRecord, predecessor);
        let ganttTaskData: ITaskData = ganttRecord.ganttProperties;
        let endDate: Date =
            this.dateValidateModule.getEndDate(startDate, ganttTaskData.duration, ganttTaskData.durationUnit, ganttTaskData, false);
        for (let i: number = 0; i < predecessor.length; i++) {
            parentGanttRecord = this.parent.getRecordByID(predecessor[i].from);
            let violationType: string = null;
            if (predecessor[i].type === 'FS') {
                if (ganttTaskData.startDate < startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskBeforePredecessor_FS';
                } else if (ganttTaskData.startDate > startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskAfterPredecessor_FS';
                }
            } else if (predecessor[i].type === 'SS') {
                if (ganttTaskData.startDate < startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskBeforePredecessor_SS';
                } else if (ganttTaskData.startDate > startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskAfterPredecessor_SS';
                }
            } else if (predecessor[i].type === 'FF') {
                if (endDate < parentGanttRecord.ganttProperties.endDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskBeforePredecessor_FF';
                } else if (endDate > parentGanttRecord.ganttProperties.endDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskAfterPredecessor_FF';
                }
            } else if (predecessor[i].type === 'SF') {
                if (endDate < parentGanttRecord.ganttProperties.startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskBeforePredecessor_SF';
                } else if (endDate > parentGanttRecord.ganttProperties.startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskAfterPredecessor_SF';
                }
            }
            if (!isNullOrUndefined(violationType) && isNullOrUndefined(violateType)) {
                violatedParent = parentGanttRecord;
                violateType = violationType;
            }
        }

        let validateArgs: object = {
            parentTask: violatedParent,
            task: ganttRecord,
            violationType: violateType
        };
        return validateArgs;
    }

    /**
     * Method to remove and update new predecessor collection in successor record
     * @param data 
     * @private
     */
    public addRemovePredecessor(data: IGanttData): void {
        let prevData: IGanttData = this.parent.previousRecords[data.uniqueID];
        let newPredecessor: IPredecessor[] = data.ganttProperties.predecessor.slice();
        if (prevData && prevData.ganttProperties && prevData.ganttProperties.hasOwnProperty('predecessor')) {
            let prevPredecessor: IPredecessor[] = prevData.ganttProperties.predecessor;
            if (!isNullOrUndefined(prevPredecessor)) {
                for (let p: number = 0; p < prevPredecessor.length; p++) {
                    let parentGanttRecord: IGanttData = this.parent.getRecordByID(prevPredecessor[p].from);
                    if (parentGanttRecord === data) {
                        data.ganttProperties.predecessor.push(prevPredecessor[p]);
                    } else {
                        let parentPredecessor: IPredecessor[] =
                            extend([], [], parentGanttRecord.ganttProperties.predecessor, true) as IPredecessor[];
                        let parentIndex: number = getIndex(prevPredecessor[p], 'from', parentPredecessor, 'to');
                        if (parentIndex !== -1) {
                            parentPredecessor.splice(parentIndex, 1);
                            this.parent.setRecordValue('predecessor', parentPredecessor, parentGanttRecord.ganttProperties, true);
                        }
                    }
                }
            }
            if (!isNullOrUndefined(newPredecessor)) {
                for (let n: number = 0; n < newPredecessor.length; n++) {
                    let parentGanttRecord: IGanttData = this.parent.getRecordByID(newPredecessor[n].from);
                    let parentPredecessor: IPredecessor[] =
                        extend([], [], parentGanttRecord.ganttProperties.predecessor, true) as IPredecessor[];
                    parentPredecessor.push(newPredecessor[n]);
                    this.parent.setRecordValue('predecessor', parentPredecessor, parentGanttRecord.ganttProperties, true);
                }
            }
        }
    }
}