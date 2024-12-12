/**
 * Predecessor calculation goes here
 */
import { IGanttData, ITaskData, IPredecessor, IConnectorLineObject, ITaskSegment, IParent } from '../base/interface';
import { TaskFieldsModel } from '../models/models';
import { DateProcessor } from '../base/date-processor';
import { Gantt } from '../base/gantt';
import { isScheduledTask } from '../base/utils';
import { getValue, isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { TaskbarEdit } from './taskbar-edit';

export class Dependency {

    private parent: Gantt;
    public validatedChildItems: IGanttData[];
    private dateValidateModule: DateProcessor;
    private parentRecord: IParent[] = [];
    private parentIds: string[] = [];
    private parentPredecessors: IGanttData[] = [];
    private validatedParentIds: string[] = [];
    public isValidatedParentTaskID: string;
    private storeId: string = null;
    public isChildRecordValidated: (number | string)[] = [];
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
            const ganttData: IGanttData = predecessorTasks[count as number];
            const ganttProp: ITaskData = ganttData.ganttProperties;
            if ((!ganttData.hasChildRecords && !this.parent.allowParentDependency) || this.parent.allowParentDependency) {
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
                const predecessorItem: object = predecessorVal[c as number];
                const preValue: IPredecessor = {};
                preValue.from = getValue('from', predecessorItem) ? getValue('from', predecessorItem) : predecessorVal[c as number];
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
            const predId: number = parseInt(prdList[i as number], 10);
            if (!isNaN(predId)) {
                const predData: IGanttData = this.parent.getRecordByID(predId.toString());
                const record: ITaskData = !isNullOrUndefined(predData) ?
                    extend({}, {}, predData.taskData, true) : null;
                if (!isNullOrUndefined(record) && isNullOrUndefined(record[task.startDate])
                    && isNullOrUndefined(record[task.duration]) && isNullOrUndefined(record[task.endDate])) {
                    record[task.duration] = 1;
                    let startDate: Date;
                    const parentItem: IParent = predData.parentItem;
                    if (parentItem) {
                        let parentTask: IGanttData = this.parent.getParentTask(predData.parentItem);
                        while (parentTask && !parentTask.ganttProperties.startDate) {
                            parentTask = this.parent.getParentTask(parentTask.parentItem);
                        }
                        startDate = parentTask ? parentTask.ganttProperties.startDate : this.parent.cloneProjectStartDate;
                    } else {
                        startDate = this.parent.cloneProjectStartDate;
                    }
                    record[task.startDate] = startDate;
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
        let values: string[] = [];
        let offsetValue: string;
        let predecessorText: string;
        const parentRecords: IGanttData[] = [];
        predecessor.split(',').forEach((el: string): void => {
            let isGUId: boolean = false;
            let firstPart: string;
            let predecessorName: string;
            let isAlpha: boolean = false;
            const regex: RegExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
            const elSplit: string[] = el.split('-');
            let id: string;
            if (elSplit.length === 6) {
                elSplit[4] = elSplit[4] + '-' + elSplit[5];
                elSplit.pop();
            }
            if (elSplit.length === 5 && elSplit[4].length >= 12) {
                id = el.substring(0, 36);
                if (regex.test(id)) {
                    isGUId = true;
                }
            }
            if (el.includes('-')) {
                const lastIndex: number = el.lastIndexOf('-');
                const lastPart: string = el.substring(lastIndex + 1);
                const baseString: string = el.replace(lastPart, '').trim();
                const match: RegExpMatchArray | null = baseString.match(/(FS|SS|SF|FF)-$/);
                let processedResult: string = (match ? match[0] : '') + lastPart;
                if (!/^(FS|SS|SF|FF)/.test(processedResult)) {
                    const prefixMatch: RegExpMatchArray | null = processedResult.match(/(FS|SS|SF|FF)/);
                    processedResult = prefixMatch
                        ? prefixMatch[0] + processedResult.slice(processedResult.indexOf(prefixMatch[0]) + prefixMatch[0].length)
                        : el;
                }
                predecessorName = processedResult;
                if (el.includes('-') && /[A-Za-z]/.test(predecessorName)) {
                    const indexFS: number = el.indexOf(predecessorName);
                    if (indexFS !== -1) {
                        firstPart = el.substring(0, indexFS);
                        if (firstPart.includes('-')) {
                            isAlpha = true;
                        }
                    }
                }
            }
            if (isGUId) {
                let split: string[];
                split = elSplit[4].split('+');
                let spliceLength: number;
                if (split.length === 1) {
                    values[0] = el;
                }
                else {
                    spliceLength = split[1].length;
                    values[0] = el.slice(0, -(spliceLength + 1));
                    values[1] = split[1];
                }
                offsetValue = '+';
                if (elSplit[4].indexOf('-') >= 0) {
                    split = elSplit[4].split('-');
                    if (split.length === 1) {
                        values[0] = el;
                    }
                    else {
                        spliceLength = split[1].length;
                        values[0] = el.slice(0, -(spliceLength + 1));
                        values[1] = split[1];
                    }
                    offsetValue = '-';
                }
            }
            else {
                if (isAlpha && firstPart.includes('-')) {
                    values[0] = firstPart;
                }
                else {
                    values = el.split('+');
                    offsetValue = '+';
                    if (el.indexOf('-') >= 0) {
                        values = el.split('-');
                        offsetValue = '-';
                    }
                }
            }
            match = [];
            const ids: string[] = this.parent.viewType === 'ResourceView' ? this.parent.getTaskIds() : this.parent.ids;
            const isExist1: number = this.parent.viewType === 'ResourceView' ? ids.indexOf('T' + values[0]) : ids.indexOf(values[0]);
            if (isExist1 !== -1) {
                match[0] = values[0];
            }
            else {
                if (ids.indexOf(values[0]) === -1) {
                    match = values[0].split(' ');
                    if (match.length === 1) {
                        if (match[0].indexOf(' ') !== -1) {
                            match = values[0].match(/(\d+|[A-z]+)/g);
                        }
                        else {
                            match[0] = values[0].slice(0, -2);
                            match[1] = values[0].slice(-2);
                        }
                    }
                } else {
                    match[0] = values[0];
                }
            }
            const isExist: number = this.parent.viewType === 'ResourceView' ? ids.indexOf('T' + match[0]) : ids.indexOf(match[0]);
            /*Validate for appropriate predecessor*/
            if (match[0] && isExist !== -1) {
                if (match.length > 1) {
                    const type: string = match[1].toUpperCase();
                    if (type === 'FS' || type === 'FF' || type === 'SF' || type === 'SS') {
                        predecessorText = type;
                    } else {
                        const e: string = `The provided dependency type, ${type}, is invalid. Please ensure that the Dependency Type is FS or FF or SS or SF`;
                        this.parent.trigger('actionFailure', { error: e });
                        predecessorText = 'FS';
                    }
                }
                else if (el.includes('-') && /[A-Za-z]/.test(predecessorName) && firstPart.includes('-')) {
                    const type: string = el.slice(-2).toString();
                    type.toUpperCase();
                    if (type === 'FS' || type === 'FF' || type === 'SF' || type === 'SS') {
                        predecessorText = type;
                    }
                    else {
                        predecessorText = 'FS';
                    }
                }
                else {
                    predecessorText = 'FS';
                }
            }
            else {
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
            if (!this.parent.allowParentDependency) {
                if (!isOwnParent) {
                    collection.push(obj);
                }
            }
            else {
                const fromData: IGanttData = this.parent.connectorLineModule.getRecordByID(obj.to);
                const toData: IGanttData = this.parent.connectorLineModule.getRecordByID(obj.from);
                let isValid: boolean;
                if (this.parent.connectorLineEditModule && toData && fromData) {
                    isValid = this.parent.connectorLineEditModule.validateParentPredecessor(toData, fromData);
                    if (isValid) {
                        collection.push(obj);
                        if (parentRecords.indexOf(toData) === -1 && toData.hasChildRecords && this.parent.editModule.cellEditModule &&
                        this.parent.editModule.cellEditModule.isCellEdit) {
                            parentRecords.push(extend([], [], [toData], true)[0]);
                        }
                    }
                }
                else {
                    collection.push(obj);
                }
                match.splice(0);
            }
        });
        if (parentRecords.length > 0 && this.parent.undoRedoModule && this.parent.editModule && this.parent.editModule.cellEditModule &&
            this.parent.editModule.cellEditModule.isCellEdit) {
            this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1]['connectedRecords'] = parentRecords;
        }
        const creatCollection: IPredecessor[] = [];
        collection.map((data: IPredecessor) => {
            const from: string = data.from;
            const to: string = data.to;
            let checkColloction: IPredecessor[] = [];
            checkColloction = collection.filter((fdata: IPredecessor) => fdata.from === from && fdata.to === to);
            if (creatCollection.indexOf(checkColloction[checkColloction.length - 1]) === -1) {
                creatCollection.push(checkColloction[checkColloction.length - 1]);
            }

        });
        return creatCollection;
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
        let resultString: string = '';
        let temp1: string;
        const match: string[] = [];
        if (predecessors) {
            const length: number = predecessors.length;
            for (let i: number = 0; i < length; i++) {
                const currentValue: IPredecessor = predecessors[i as number];
                let temp: string = '';
                const id: string = this.parent.viewType === 'ResourceView' ? data.ganttProperties.taskId
                    : data.ganttProperties.rowUniqueID;
                if (currentValue.from !== id.toString()) {
                    temp = currentValue.from + currentValue.type;
                    if (typeof(data.ganttProperties.taskId) === 'string') {
                        match[0] = temp.slice(0, -2);
                        match[1] = temp.slice(-2);
                        temp1 = match[0] + ' ' + match[1];
                    } else {
                        temp1 = temp;
                    }
                    temp = temp1;
                    if (currentValue.offset !== 0) {
                        temp += currentValue.offset > 0 ? ('+' + currentValue.offset + ' ') : (currentValue.offset + ' ');
                        const multiple: boolean = currentValue.offset !== 1;
                        if (currentValue.offsetUnit === 'day') {
                            temp += multiple ? this.parent.localeObj.getConstant('days') : this.parent.localeObj.getConstant('day');
                        } else if (currentValue.offsetUnit === 'hour') {
                            temp += multiple ? this.parent.localeObj.getConstant('hours') : this.parent.localeObj.getConstant('hour');
                        } else {
                            temp += multiple ? this.parent.localeObj.getConstant('minutes') : this.parent.localeObj.getConstant('minute');
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
                values[x as number] = (values[x as number]).trim();
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
            const err: string = 'The provided value for the offset field is invalid.Please ensure the offset field contains only valid numeric values';
            this.parent.trigger('actionFailure', { error: err });
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
            ganttRecord = predecessorsCollection[count as number];
            if ((!ganttRecord.hasChildRecords && !this.parent.allowParentDependency) || this.parent.allowParentDependency) {
                this.updatePredecessorHelper(ganttRecord, predecessorsCollection);
                if (!ganttRecord.ganttProperties.isAutoSchedule && this.parent.editSettings.allowEditing) {
                    this.parent.connectorLineEditModule['validatedOffsetIds'] = [];
                    this.parent.connectorLineEditModule['calculateOffset'](ganttRecord);
                }
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
            const connector: IPredecessor = connectorsCollection[i as number];
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

    private traverseParents(record: IGanttData): void {
        this.parent.dataOperation.updateParentItems(record);
    }

    /**
     * Method to validate date of tasks with predecessor values for all records
     *
     * @returns {void} .
     * @private
     */
    public updatedRecordsDateByPredecessor(): void {
        if (!this.parent.autoCalculateDateScheduling || (this.parent.isLoad && this.parent.treeGrid.loadChildOnDemand
            && this.parent.taskFields.hasChildMapping)) {
            return;
        }
        const flatData: IGanttData[] = this.parent.flatData;
        const totLength: number = this.parent.flatData.length;
        for (let count: number = 0; count < totLength; count++) {
            if (flatData[count as number].ganttProperties.predecessorsName) {
                this.validatePredecessorDates(flatData[count as number]);
                const predecessorCollection: IPredecessor[] = flatData[count as number].ganttProperties.predecessor;
                if (predecessorCollection && predecessorCollection.length > 1) {
                    for (let i: number = 0; i < predecessorCollection.length; i++) {
                        const validateRecord: IGanttData = this.parent.getRecordByID(predecessorCollection[i as number].to);
                        if (validateRecord) {
                            this.validatePredecessorDates(validateRecord);
                        }
                    }
                }
                if (flatData[count as number].hasChildRecords && this.parent.editModule &&
                    flatData[count as number].ganttProperties.startDate
                    && this.parent.allowParentDependency) {
                    this.updateChildItems(flatData[count as number]);
                }
                if (flatData[count as number].parentItem) {
                    const recordId: string = flatData[count as number].parentItem.taskId;
                    this.traverseParents(this.parent.getRecordByID(recordId));
                }
            }
        }
    }
    public updateParentPredecessor (): void  {
        if (this.parent.enablePredecessorValidation)
        {
            const parentPredecessorLength: number = this.parentPredecessors.length;
            for (let i: number = parentPredecessorLength - 1; i >= 0; i--)
            {
                const item: IGanttData = this.parentPredecessors[i as number];
                this.validatePredecessorDates(item);
                if (item.ganttProperties.startDate) {
                    this.updateChildItems(item);
                }
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
                const predecessor: IPredecessor = predecessors[count as number];
                parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor.from);
                if (this.parent.allowParentDependency && parentGanttRecord.hasChildRecords) {
                    this.parent.dataOperation.updateParentItems(parentGanttRecord);
                }
                record = this.parent.connectorLineModule.getRecordByID(predecessor.to);
                if (this.parent.viewType === 'ProjectView' && this.parent.allowTaskbarDragAndDrop) {
                    let index: number;
                    if (isNullOrUndefined(record)) {
                        index = this.parent.editModule.taskbarEditModule.previousIds.indexOf(predecessor.to);
                        record = this.parent.editModule.taskbarEditModule.previousFlatData[index as number];
                    } else if (isNullOrUndefined(parentGanttRecord)) {
                        index = this.parent.editModule.taskbarEditModule.previousIds.indexOf(predecessor.from);
                        parentGanttRecord = this.parent.editModule.taskbarEditModule.previousFlatData[index as number];
                    }
                }
                if (this.parent.allowParentDependency && this.parent.isLoad && this.parentPredecessors.indexOf(ganttRecord) === -1
                    && (ganttRecord.hasChildRecords || record.hasChildRecords)) {
                    this.parentPredecessors.push(ganttRecord);
                }
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
        if (this.parent.editedTaskBarItem === childGanttRecord || (parentGanttRecord &&
            isNullOrUndefined(isScheduledTask(parentGanttRecord.ganttProperties)))
            || (childGanttRecord && isNullOrUndefined(isScheduledTask(childGanttRecord.ganttProperties)))) {
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
            if (isNullOrUndefined(segments) || ! isNullOrUndefined(segments) && segments.length === 0) {
                this.dateValidateModule.calculateEndDate(childGanttRecord);
            }
            this.parent.dataOperation.updateWidthLeft(childGanttRecord);

            if (!this.parent.isLoad && !this.parent.isFromOnPropertyChange && childGanttRecord.parentItem &&
                this.parent.isInPredecessorValidation &&
                this.parent.getParentTask(childGanttRecord.parentItem).ganttProperties.isAutoSchedule) {
                if (this.parentIds.indexOf(childGanttRecord.parentItem.uniqueID) === -1) {
                    this.parentIds.push(childGanttRecord.parentItem.uniqueID);
                    this.parentRecord.push(childGanttRecord.parentItem);
                }
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
                const predecessor: IPredecessor = validatedPredecessor[i as number];
                parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor.from);
                childGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor.to);
                if (this.parent.viewType === 'ProjectView' && this.parent.allowTaskbarDragAndDrop && !(isNullOrUndefined(childGanttRecord) &&
                isNullOrUndefined(parentGanttRecord))) {
                    childGanttRecord = isNullOrUndefined(childGanttRecord) ?
                        this.getRecord(parentGanttRecord, childGanttRecord, predecessor) : childGanttRecord;
                    parentGanttRecord = isNullOrUndefined(parentGanttRecord) ?
                        this.getRecord(parentGanttRecord, childGanttRecord, predecessor) : parentGanttRecord;
                }
                if (childGanttRecord && parentGanttRecord) {
                    tempStartDate =
                        this.getValidatedStartDate(childGanttRecord.ganttProperties, parentGanttRecord.ganttProperties, predecessor);
                }
                if (maxStartDate === null || this.dateValidateModule.compareDates(tempStartDate, maxStartDate) === 1) {
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
                const date: Date = new Date(tempDate);
                date.setDate(date.getDate() - 1);
                tempDate = this.dateValidateModule.checkEndDate(tempDate, ganttProperty);
            }
            if (ganttProperty.segments && ganttProperty.segments.length !== 0) {
                const duration: number = this.dateValidateModule.getDuration(ganttProperty.startDate, ganttProperty.endDate,
                                                                             ganttProperty.durationUnit, ganttProperty.isAutoSchedule,
                                                                             ganttProperty.isMilestone);
                returnStartDate = this.dateValidateModule.getStartDate(
                    tempDate, duration, ganttProperty.durationUnit, ganttProperty);
            } else {
                returnStartDate = this.dateValidateModule.getStartDate(
                    tempDate, ganttProperty.duration, ganttProperty.durationUnit, ganttProperty);
            }
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
        if (offsetValue < 0  && !isNullOrUndefined(date)) {
            resultDate = this.dateValidateModule.getStartDate(
                this.dateValidateModule.checkEndDate(date, record), (offsetValue * -1), durationUnit, record, true);
        } else {
            if (!isNullOrUndefined(date)) {
                resultDate = this.dateValidateModule.getEndDate(date, offsetValue, durationUnit, record, false);
            }
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
        let ganttRecords: IGanttData [] = records ? records : this.parent.currentViewData;
        if (this.parent.pdfExportModule && this.parent.pdfExportModule.isPdfExport && this.parent.pdfExportModule.helper.exportProps &&
            this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings &&
             this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings.isFitToWidth && this.parent.pdfExportModule.isPdfExport) {
            ganttRecords = this.parent.pdfExportModule.helper.beforeSinglePageExport['cloneCurrentViewData'];
        }
        const recordLength: number = ganttRecords.length;
        let count: number; let ganttRecord: IGanttData;
        let predecessorsCollection: object[];
        if (this.parent.pdfExportModule && this.parent.pdfExportModule.isPdfExport && this.parent.pdfExportModule.helper.exportProps &&
            this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings &&
            this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings.isFitToWidth && this.parent.pdfExportModule.isPdfExport) {
            this.parent.connectorLineModule.expandedRecords = this.parent.virtualScrollModule && this.parent.enableVirtualization ?
                this.parent.pdfExportModule.helper.beforeSinglePageExport['cloneFlatData'] : this.parent.getExpandedRecords(this.parent.pdfExportModule.helper.beforeSinglePageExport['cloneFlatData']);
        }
        else {
            this.parent.connectorLineModule.expandedRecords = this.parent.virtualScrollModule && this.parent.enableVirtualization ?
                this.parent.updatedRecords : this.parent.getExpandedRecords(this.parent.updatedRecords);
        }
        for (count = 0; count < recordLength; count++) {
            if (this.parent.editModule && this.parent.editModule.deletedTaskDetails.length > 0) {
                if (ganttRecords[count as number].parentItem) {
                    const parentItem: IGanttData = this.parent.getRecordByID(ganttRecords[count as number].parentItem.taskId.toString());
                    this.parent.setRecordValue('parentItem', this.parent.dataOperation.getCloneParent(parentItem), ganttRecords[count as number]);
                }
            }
            if (this.parent.undoRedoModule && this.parent.undoRedoModule['canUpdateIndex']) {
                ganttRecords[count as number].index = count;
                if (ganttRecords[count as number].parentItem && this.parent.getParentTask(ganttRecords[count as number].parentItem)) {
                    ganttRecords[count as number].parentItem.index = this.parent.getParentTask(
                        ganttRecords[count as number].parentItem).index;
                }
            }
            ganttRecord = ganttRecords[count as number];
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
                predecessor = predecessorsCollection[predecessorCount as number];
                const from: string = 'from'; const to: string = 'to';
                parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[from as string]);
                childGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[to as string]);
                let isValid: boolean = true;
                if (((parentGanttRecord && parentGanttRecord.hasChildRecords && !parentGanttRecord.expanded) ||
                (childGanttRecord && childGanttRecord.hasChildRecords && !childGanttRecord.expanded)) &&
                   !this.parent.allowTaskbarOverlap && this.parent.viewType === 'ProjectView') {
                    isValid = false;
                }
                if (isValid && this.parent.connectorLineModule.expandedRecords &&
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
            if (childGanttRecord.isCritical && parentGanttRecord.isCritical) {
                connectorObj.isCritical = true;
            }
            if ((this.parent.connectorLineIds.length > 0 && this.parent.connectorLineIds.indexOf(connectorObj.connectorLineId) === -1) ||
            this.parent.connectorLineIds.length === 0) {
                this.parent.updatedConnectorLineCollection.push(connectorObj);
                this.parent.connectorLineIds.push(connectorObj.connectorLineId);
            } else if (this.parent.connectorLineIds.indexOf(connectorObj.connectorLineId) !== -1) {
                const index: number = this.parent.connectorLineIds.indexOf(connectorObj.connectorLineId);
                this.parent.updatedConnectorLineCollection[index as number] = connectorObj;
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
            const taskBarModule: TaskbarEdit = this.parent.editModule.taskbarEditModule;
            let ganttProp: IGanttData;
            if (taskBarModule) {
                ganttProp = taskBarModule.taskBarEditRecord;
            }
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
            let parentRec: IGanttData;
            for (let count: number = 0; count < predecessors.length; count++) {
                predecessor = predecessors[count as number];
                parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor.from);
                record = this.parent.connectorLineModule.getRecordByID(predecessor.to);
                if (record.parentItem) {
                    parentRec = this.parent.getTaskByUniqueID(record.parentItem.uniqueID);
                    if (this.parent.editModule['updateParentRecords'].indexOf(parentRec) === -1) {
                        this.parent.editModule['updateParentRecords'].push(parentRec);
                    }
                }
                if (parentGanttRecord.parentItem) {
                    parentRec = this.parent.getTaskByUniqueID(parentGanttRecord.parentItem.uniqueID);
                    if (this.parent.editModule['updateParentRecords'].indexOf(parentRec) === -1) {
                        this.parent.editModule['updateParentRecords'].push(parentRec);
                    }
                }
                if (this.parent.viewType === 'ProjectView' && this.parent.allowTaskbarDragAndDrop && !(isNullOrUndefined(record) && isNullOrUndefined(parentGanttRecord))) {
                    record = isNullOrUndefined(record) ? this.getRecord(parentGanttRecord, record, predecessor) : record;
                    parentGanttRecord = isNullOrUndefined(parentGanttRecord) ?
                        this.getRecord(parentGanttRecord, record, predecessor) : parentGanttRecord;
                }
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
                    if (this.parent.editModule['editedRecord'] && this.parent.editModule['editedRecord'].hasChildRecords && !this.parent.editModule['editedRecord'].parentItem) {
                        this.isValidatedParentTaskID = record.ganttProperties.taskId;
                    }
                }
            }

            for (let count: number = 0; count < successors.length; count++) {
                successor = successors[count as number];
                parentGanttRecord = this.parent.connectorLineModule.getRecordByID(successor.from);
                record = this.parent.connectorLineModule.getRecordByID(successor.to);
                if (record.parentItem) {
                    parentRec = this.parent.getTaskByUniqueID(record.parentItem.uniqueID);
                    if (this.parent.editModule['updateParentRecords'].indexOf(parentRec) === -1) {
                        this.parent.editModule['updateParentRecords'].push(parentRec);
                    }
                }
                if (parentGanttRecord.parentItem) {
                    parentRec = this.parent.getTaskByUniqueID(parentGanttRecord.parentItem.uniqueID);
                    if (this.parent.editModule['updateParentRecords'].indexOf(parentRec) === -1) {
                        this.parent.editModule['updateParentRecords'].push(parentRec);
                    }
                }
                if (this.parent.viewType === 'ProjectView' && this.parent.allowTaskbarDragAndDrop && !(isNullOrUndefined(record) && isNullOrUndefined(parentGanttRecord))) {
                    record = isNullOrUndefined(record) ? this.getRecord(parentGanttRecord, record, successor) : record;
                    parentGanttRecord = isNullOrUndefined(parentGanttRecord) ?
                        this.getRecord(parentGanttRecord, record, successor) : parentGanttRecord;
                }
                if (this.parent.isInPredecessorValidation && record.ganttProperties.isAutoSchedule) {
                    this.parent.isValidationEnabled = true;
                } else {
                    this.parent.isValidationEnabled = false;
                }
                if (validationOn !== 'predecessor' && this.parent.isValidationEnabled) {
                    this.validateChildGanttRecord(parentGanttRecord, record);
                    if (this.parent.editModule['editedRecord'] && record) {
                        const rootParent: IGanttData = parentGanttRecord.parentItem ?
                            this.parent.connectorLineEditModule.getRootParent(parentGanttRecord) : null;
                        if (record.hasChildRecords && (!this.parent.editModule['editedRecord'].hasChildRecords || (!record.parentItem &&
                            (!rootParent || (rootParent && rootParent.ganttProperties.taskId === this.parent.editModule['editedRecord'].ganttProperties.taskId)))) &&
                            this.isValidatedParentTaskID !== record.ganttProperties.taskId) {
                            this.updateChildItems(record);
                            for (let i: number = 0; i < record.childRecords.length; i++) {
                                const ganttProp: ITaskData = record.childRecords[i as number].ganttProperties;
                                if (this.isChildRecordValidated.indexOf(ganttProp.taskId) !== -1) {
                                    return;
                                }
                                this.isChildRecordValidated.push(ganttProp.taskId);
                                if (ganttProp.predecessor && ganttProp.predecessor.length > 0) {
                                    for (let j: number = 0; j < ganttProp.predecessor.length; j++) {
                                        let childRec: IGanttData;
                                        if (ganttProp.predecessor[j as number].to !== record.ganttProperties.taskId.toString()) {
                                            childRec = this.parent.flatData[this.parent.ids.indexOf(ganttProp.predecessor[j as number].to)];
                                        }
                                        else {
                                            childRec = this.parent.flatData[this.parent.ids.indexOf(
                                                ganttProp.predecessor[j as number].from)];
                                        }
                                        if (childRec) {
                                            this.validatePredecessor(childRec, [], '');
                                            if (childRec.hasChildRecords && this.parent.editModule['editedRecord'].hasChildRecords) {
                                                this.updateChildItems(childRec);
                                            }
                                            this.isValidatedParentTaskID = childRec.ganttProperties.taskId;
                                        }
                                    }
                                }
                            }
                            this.isValidatedParentTaskID = record.ganttProperties.taskId;
                        }
                        if (this.parent.editModule['editedRecord'].hasChildRecords && !this.parent.editModule['editedRecord'].parentItem) {
                            this.isValidatedParentTaskID = record.ganttProperties.taskId;
                        }
                    }
                }
                else if (!record.ganttProperties.isAutoSchedule && this.parent.updateOffsetOnTaskbarEdit) {
                    this.parent.connectorLineEditModule['validatedOffsetIds'] = [];
                    this.parent.connectorLineEditModule['calculateOffset'](record);
                }
                if (parentGanttRecord.expanded === false || record.expanded === false) {
                    if (record) { this.validatePredecessor(record, undefined, 'successor'); }
                    continue;
                }
                if (record) {
                    if (this.parent.editModule.isFirstCall) {
                        const taskIdsForView: string[] = this.parent.viewType === 'ResourceView' ? this.parent.getTaskIds() : this.parent.ids;
                        this.storeId = JSON.parse(JSON.stringify(taskIdsForView));
                        this.parent.editModule.isFirstCall = false;
                    }
                    if (this.storeId) {
                        let index: number;
                        const idAsString: string = (record as any)[this.parent.taskFields.id].toString();
                        if (this.parent.viewType === 'ResourceView') {
                            const taskId: string = `T${idAsString}`;
                            index = this.storeId.includes(taskId) ? this.storeId.indexOf(taskId) : -1;
                        } else {
                            index = this.storeId.indexOf(idAsString);
                        }
                        if (index !== -1) {
                            this.storeId = this.storeId.slice(0, index).concat(this.storeId.slice(index + 1));
                            this.validatePredecessor(record, undefined, 'successor');
                        }
                    }
                    else {
                        this.validatePredecessor(record, undefined, 'successor');
                    }
                }
            }
            if (record && !record.hasChildRecords && record.parentItem &&
                this.validatedParentIds.indexOf(record.parentItem.taskId) === -1) {
                this.validatedParentIds.push(record.parentItem.taskId);
            }
            let validUpdate: boolean = true;
            if (record && record.hasChildRecords && this.validatedParentIds.indexOf(record.ganttProperties.taskId.toString()) !== -1) {
                validUpdate = false;
            }
            if (validUpdate) {
                if (record && record.ganttProperties.taskId !== this.isValidatedParentTaskID && ganttProp) {
                    if ((taskBarModule.taskBarEditAction !== 'ParentDrag' && taskBarModule.taskBarEditAction !== 'ChildDrag')) {
                        if (!ganttProp.hasChildRecords && record.hasChildRecords) {
                            this.updateChildItems(record);
                            this.isValidatedParentTaskID = record.ganttProperties.taskId;
                        }
                    }
                    if (record.parentItem) {
                        this.parent.dataOperation.updateParentItems(record, true);
                        const parentData: IGanttData = this.parent.getParentTask(record.parentItem);
                        const index: number = (this.storeId && this.storeId.indexOf(
                            parentData[this.parent.taskFields.id].toString()) !== -1) ?
                            this.storeId.indexOf(parentData[this.parent.taskFields.id].toString()) : -1;
                        if (parentData.ganttProperties.predecessor && parentData.ganttProperties.predecessor.length > 0 && index !== -1) {
                            for (let i: number = 0; i < parentData.ganttProperties.predecessor.length; i++) {
                                if (parentData.ganttProperties.predecessor[i as number].to !==
                                    parentData.ganttProperties.taskId.toString()) {
                                    const childRec: IGanttData = this.parent.flatData[this.parent.ids.indexOf(
                                        parentData.ganttProperties.predecessor[i as number].to)];
                                    if (childRec && childRec.parentItem) {
                                        this.validateChildGanttRecord(record, childRec);
                                    }
                                }
                            }
                        }
                    }
                }
                else if (record && record.hasChildRecords && this.isValidatedParentTaskID !== record.ganttProperties.taskId && !ganttProp) {
                    this.updateChildItems(record);
                    this.isValidatedParentTaskID = record.ganttProperties.taskId;
                }
            }
        }
    }

    /**
     *
     * @param {IGanttData} ganttRecord .
     * @returns {void} .
     */
    private updateChildItems(ganttRecord: IGanttData): void {
        if (ganttRecord.childRecords.length > 0 && this.validatedChildItems.length > 0) {
            let isPresent: boolean = true;
            isPresent = !ganttRecord.childRecords.some((record: IGanttData) => {
                return this.validatedChildItems['includes'](record as Object);
            });
            if (!isPresent) {
                return;
            }
        }
        const previousData: IGanttData = this.parent.previousRecords[ganttRecord.uniqueID];
        let previousStartDate: Date;
        if (isNullOrUndefined(previousData) ||
            (isNullOrUndefined(previousData) && !isNullOrUndefined(previousData.ganttProperties))) {
            previousStartDate = new Date(ganttRecord.ganttProperties.startDate.getTime());
        } else {
            if (!isNullOrUndefined(previousData.ganttProperties.startDate)) {
                previousStartDate = new Date(previousData.ganttProperties.startDate.getTime());
            }
        }
        const currentStartDate: Date = ganttRecord.ganttProperties.startDate;
        const childRecords: IGanttData[] = [];
        let validStartDate: Date;
        let validEndDate: Date;
        let calcEndDate: Date;
        let isRightMove: boolean;
        let durationDiff: number;
        this.getUpdatableChildRecords(ganttRecord, childRecords);
        if (childRecords.length === 0) {
            return;
        }
        if (!isNullOrUndefined(previousStartDate) && !isNullOrUndefined(currentStartDate) &&
        previousStartDate.getTime() > currentStartDate.getTime()) {
            validStartDate = this.parent.dateValidationModule.checkStartDate(currentStartDate);
            validEndDate = this.parent.dateValidationModule.checkEndDate(previousStartDate, ganttRecord.ganttProperties);
            isRightMove = false;
        } else {
            validStartDate = this.parent.dateValidationModule.checkStartDate(previousStartDate);
            validEndDate = this.parent.dateValidationModule.checkEndDate(currentStartDate, ganttRecord.ganttProperties);
            isRightMove = true;
        }
        //Get Duration
        if (!isNullOrUndefined(validStartDate) && !isNullOrUndefined(validEndDate) && validStartDate.getTime() >= validEndDate.getTime()) {
            durationDiff = 0;
        } else {
            durationDiff = this.parent.dateValidationModule.getDuration(validStartDate, validEndDate, 'minute', true, false);
        }
        for (let i: number = 0; i < childRecords.length; i++) {
            if (childRecords[i as number].ganttProperties.isAutoSchedule) {
                if (durationDiff > 0) {
                    const startDate: Date = isScheduledTask(childRecords[i as number].ganttProperties) ?
                        childRecords[i as number].ganttProperties.startDate : childRecords[i as number].ganttProperties.startDate ?
                            childRecords[i as number].ganttProperties.startDate : childRecords[i as number].ganttProperties.endDate ?
                                childRecords[i as number].ganttProperties.endDate : new Date(previousStartDate.toString());
                    if (isRightMove) {
                        calcEndDate = this.parent.dateValidationModule.getEndDate(
                            this.parent.dateValidationModule.checkStartDate(
                                startDate,
                                childRecords[i as number].ganttProperties,
                                childRecords[i as number].ganttProperties.isMilestone),
                            durationDiff,
                            'minute',
                            childRecords[i as number].ganttProperties,
                            false
                        );
                    } else {
                        calcEndDate = this.parent.dateValidationModule.getStartDate(
                            this.parent.dateValidationModule.checkEndDate(startDate, childRecords[i as number].ganttProperties),
                            durationDiff,
                            'minute',
                            childRecords[i as number].ganttProperties);
                    }
                    this.calculateDateByRoundOffDuration(childRecords[i as number], calcEndDate);
                    if (this.parent.isOnEdit && this.validatedChildItems.indexOf(childRecords[i as number]) === -1) {
                        this.validatedChildItems.push(childRecords[i as number]);
                    }
                } else if (isNullOrUndefined(previousData)) {
                    calcEndDate = previousStartDate;
                    if (childRecords[i as number].ganttProperties.startDate.getTime() <= calcEndDate.getTime()) {
                        this.calculateDateByRoundOffDuration(childRecords[i as number], calcEndDate);
                    }
                    if (this.parent.isOnEdit && this.validatedChildItems.indexOf(childRecords[i as number]) === -1) {
                        this.validatedChildItems.push(childRecords[i as number]);
                    }
                }
            }
        }
        if (childRecords.length) {
            this.parent.dataOperation.updateParentItems(ganttRecord, true);
        }
    }
    /**
     * To get updated child records.
     *
     * @param {IGanttData} parentRecord .
     * @param {IGanttData} childLists .
     * @returns {void} .
     */
    private getUpdatableChildRecords(parentRecord: IGanttData, childLists: IGanttData[]): void {
        const childRecords: IGanttData[] = parentRecord.childRecords;
        for (let i: number = 0; i < childRecords.length; i++) {
            if (childRecords[i as number].ganttProperties.isAutoSchedule) {
                childLists.push(childRecords[i as number]);
                if (childRecords[i as number].hasChildRecords) {
                    this.getUpdatableChildRecords(childRecords[i as number], childLists);
                }
            }
        }
    }
    /**
     *
     * @param {IGanttData} data .
     * @param {Date} newStartDate .
     * @returns {void} .
     */
    private calculateDateByRoundOffDuration(data: IGanttData, newStartDate: Date): void {
        const ganttRecord: IGanttData = data;
        const taskData: ITaskData = ganttRecord.ganttProperties;
        const projectStartDate: Date = new Date(newStartDate.getTime());
        if (!isNullOrUndefined(taskData.endDate) && isNullOrUndefined(taskData.startDate)) {
            const endDate: Date = this.parent.dateValidationModule.checkStartDate(projectStartDate, taskData, null);
            this.parent.setRecordValue(
                'endDate',
                this.parent.dateValidationModule.checkEndDate(endDate, ganttRecord.ganttProperties),
                taskData,
                true);
        } else {
            this.parent.setRecordValue(
                'startDate',
                this.parent.dateValidationModule.checkStartDate(projectStartDate, taskData, false),
                taskData,
                true);
            if (!isNullOrUndefined(taskData.duration)) {
                this.parent.dateValidationModule.calculateEndDate(ganttRecord);
            }
        }
        this.parent.dataOperation.updateWidthLeft(data);
        this.parent.dataOperation.updateTaskData(ganttRecord);
    }

    private getRecord(parentGanttRecord: IGanttData, record: IGanttData, predecessor: IPredecessor): IGanttData{
        let index: number;
        let data: IGanttData;
        if (isNullOrUndefined(record)) {
            index = this.parent.editModule.taskbarEditModule.previousIds.indexOf(predecessor.to);
            data = this.parent.editModule.taskbarEditModule.previousFlatData[index as number];
        } else if (isNullOrUndefined(parentGanttRecord)) {
            index = this.parent.editModule.taskbarEditModule.previousIds.indexOf(predecessor.from);
            data = this.parent.editModule.taskbarEditModule.previousFlatData[index as number];
        }
        return data;
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
