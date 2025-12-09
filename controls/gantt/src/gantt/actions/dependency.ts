/**
 * Predecessor calculation goes here
 */
import { IGanttData, ITaskData, IPredecessor, IConnectorLineObject, ITaskSegment, IParent, PdfExportProperties, FitToWidthSettings } from '../base/interface';
import { TaskFieldsModel } from '../models/models';
import { DateProcessor } from '../base/date-processor';
import { Gantt } from '../base/gantt';
import { getIndex, isScheduledTask } from '../base/utils';
import { getValue, isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { TaskbarEdit } from './taskbar-edit';
import { PdfExport } from './pdf-export';
import { ConstraintType, ExportType, ViolationType } from '../base/enum';
import { Edit } from './edit';

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
    private cumulativePredecessorChanges: IPredecessor[];
    private validatedOffsetIds: string[] = [];
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
        const flatData: IGanttData[] = this.parent.flatData;
        const flatDataMap: Map<string, IGanttData> = new Map();
        if (flatData != null)
        {
            for (const record of flatData) {
                flatDataMap.set(record.ganttProperties.rowUniqueID.toString(), record);
            }
        }
        for (const ganttData of predecessorTasks) {
            if ((!ganttData.hasChildRecords && !this.parent.allowParentDependency) || this.parent.allowParentDependency) {
                this.ensurePredecessorCollectionHelper(ganttData, ganttData.ganttProperties, flatDataMap);
            }
        }
    }
    /**
     *
     * @param {IGanttData} ganttData .
     * @param {ITaskData} ganttProp .
     * @param {Map<string, IGanttData>} flatDataMap .
     * @returns {void} .
     * @private
     */
    public ensurePredecessorCollectionHelper(ganttData: IGanttData, ganttProp: ITaskData,
                                             flatDataMap: Map<string, IGanttData> = null): void {
        const predecessorVal: object[] | string | number = ganttProp.predecessorsName;
        if (predecessorVal && (typeof predecessorVal === 'string' || typeof predecessorVal === 'number')) {
            this.parent.setRecordValue('predecessor', this.calculatePredecessor(predecessorVal, ganttData, flatDataMap), ganttProp, true);
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
                    if (!isNullOrUndefined(this.parent.durationUnit)) {
                        preValue.offsetUnit = this.parent.durationUnit.toLocaleLowerCase();
                    }
                } else if (typeof offsetUnits === 'string') {
                    const tempOffsetUnits: { duration: number, durationUnit: string } = this.getOffsetDurationUnit(
                        getValue('offset', predecessorItem));
                    preValue.offset = tempOffsetUnits.duration;
                    preValue.offsetUnit = tempOffsetUnits.durationUnit;
                } else {
                    preValue.offset = parseFloat(offsetUnits.toString());
                    if (!isNullOrUndefined(this.parent.durationUnit)) {
                        preValue.offsetUnit = this.parent.durationUnit.toLocaleLowerCase();
                    }
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
                const predData: IGanttData = this.parent.connectorLineModule.getRecordByID(predId.toString());
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

    // Get the root parent of the record
    public getRootParent(rec: IGanttData): IGanttData {
        let parentRec: IGanttData = rec;
        if (rec.parentItem) {
            parentRec = this.parent.flatData.filter((item: IGanttData) => {
                return item.uniqueID === rec.parentUniqueID;
            })[0];
            if (parentRec.parentItem) {
                parentRec = this.getRootParent(parentRec);
            }
            return parentRec;
        }
        return parentRec;
    }
    // To check whether the predecessor drawn is valid for parent task
    public validateParentPredecessor(fromRecord: IGanttData, toRecord: IGanttData): boolean {
        if (fromRecord && toRecord) {
            if (toRecord.hasChildRecords && !fromRecord.hasChildRecords) {
                if (fromRecord.parentUniqueID === toRecord.uniqueID) {
                    return false;
                }
                else {
                    do {
                        if (fromRecord.parentItem) {
                            fromRecord = this.parent.flatData[this.parent.ids.indexOf(fromRecord.parentItem.taskId)];
                            if (fromRecord.uniqueID === toRecord.uniqueID) {
                                return false;
                            }
                        }
                    }
                    while (fromRecord.parentItem);
                }
            }
            else if (!toRecord.hasChildRecords && fromRecord.hasChildRecords) {
                if (toRecord.parentUniqueID === fromRecord.uniqueID) {
                    return false;
                }
                else {
                    do {
                        if (toRecord.parentItem) {
                            toRecord = this.parent.flatData[this.parent.ids.indexOf(toRecord.parentItem.taskId)];
                            if (toRecord.uniqueID === fromRecord.uniqueID) {
                                return false;
                            }
                        }
                    }
                    while (toRecord.parentItem);
                }
            }
            else if (toRecord.hasChildRecords && fromRecord.hasChildRecords) {
                if (toRecord.parentItem && fromRecord.parentItem) {
                    if (fromRecord.parentUniqueID === toRecord.uniqueID || fromRecord.uniqueID === toRecord.parentUniqueID) {
                        return false;
                    }

                }
                else {
                    if (!toRecord.parentItem && fromRecord.parentItem) {
                        const fromRootParent: IGanttData = this.getRootParent(fromRecord);
                        if (fromRootParent.uniqueID === toRecord.uniqueID) {
                            return false;
                        }
                    }
                    else if (toRecord.parentItem && !fromRecord.parentItem) {
                        const toRootParent: IGanttData = this.getRootParent(toRecord);
                        if (toRootParent.uniqueID === fromRecord.uniqueID) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    /**
     * Get predecessor collection object from predecessor string value
     *
     * @param {string | number} predecessorValue .
     * @param {IGanttData} ganttRecord .
     * @param {Map<string, IGanttData>} flatDataMap .
     * @returns {IPredecessor[]} .
     * @private
     */
    public calculatePredecessor(predecessorValue: string | number, ganttRecord?: IGanttData,
                                flatDataMap: Map<string, IGanttData> = null): IPredecessor[] {
        const predecessor: string = predecessorValue.toString();
        const collection: IPredecessor[] = [];
        const parentRecords: IGanttData[] = [];
        const isResourceView: boolean = this.parent.viewType === 'ResourceView';
        const isProjectView: boolean = this.parent.viewType === 'ProjectView';
        const allowParentDependency: boolean = this.parent.allowParentDependency;
        const ids: string[] = isResourceView ? this.parent.getTaskIds() : this.parent.ids;
        const targetId: string = isResourceView
            ? ganttRecord.ganttProperties.taskId.toString()
            : ganttRecord.ganttProperties.rowUniqueID.toString();
        const guidRegex: RegExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        const alphaRegex: RegExp = /[A-Za-z]/;
        const validTypes: Set<string> = new Set(['FS', 'FF', 'SF', 'SS']);
        const predecessorParts: string[] = predecessor.replace(/\s+/g, '').split(',');
        for (const el of predecessorParts) {
            const result: {
                match: string[];
                predecessorText: string;
                offsetValue: string;
                values: string[];
            } = this.processPredecessorElement(
                el, ids, isResourceView, guidRegex, alphaRegex, validTypes
            );
            if (!result) {
                continue;
            }
            const { match, predecessorText, offsetValue, values } = result;
            const tempOffset: string = values.length > 1 ? offsetValue + values[1] : '0';
            const offsetUnits: {
                duration: number;
                durationUnit: string;
            } = this.getOffsetDurationUnit(tempOffset);
            const obj: IPredecessor = {
                from: match[0],
                type: predecessorText,
                isDrawn: false,
                to: targetId,
                offsetUnit: offsetUnits.durationUnit,
                offset: offsetUnits.duration
            };
            if (!allowParentDependency) {
                if (!this.checkIsParent(match[0])) {
                    collection.push(obj);
                }
            } else {
                this.handleParentDependency(obj, collection, parentRecords, flatDataMap, isProjectView);
            }
        }
        this.handleUndoRedoParentRecords(parentRecords);
        return this.removeDuplicatePredecessors(collection);
    }

    private processPredecessorElement(
        el: string, ids: string[], isResourceView: boolean,
        guidRegex: RegExp, alphaRegex: RegExp, validTypes: Set<string>
    ): { match: string[], predecessorText: string, offsetValue: string, values: string[] } | null {
        let values: string[] = [];
        let offsetValue: string = '+';
        let predecessorText: string = 'FS';
        const { isGuid, processedValues, processedOffset } = this.processElementFormat(el, guidRegex, ids, isResourceView, validTypes);
        values = processedValues;
        offsetValue = processedOffset;
        const match: string[] = this.extractAndValidateMatch(values[0], ids, isResourceView);
        if (!match) {
            return null;
        }
        predecessorText = this.determinePredecessorType(
            el, match, alphaRegex, validTypes
        );
        return { match, predecessorText, offsetValue, values };
    }
    private processElementFormat(
        el: string,
        guidRegex: RegExp,
        ids?: string[],
        isResourceView?: boolean,
        validTypes?: Set<string>
    ): {
            isGuid: boolean;
            processedValues: string[];
            processedOffset: string;
        } {
        const elSplit: string[] = el.split('-');
        let values: string[] = [];
        let offsetValue: '+' | '-' | null = '+';
        let isGuid: boolean = false;
        if (elSplit.length >= 5) {
            const id: string = el.substring(0, 36);
            if (guidRegex.test(id)) {
                isGuid = true;
                const lastPart: string = elSplit[4] + (elSplit[5] ? '-' + elSplit[5] : '');
                if (lastPart.includes('+')) {
                    const split: string[] = lastPart.split('+');
                    values = [el.slice(0, -(split[1].length + 1)).trim(), split[1].trim()];
                    offsetValue = '+';
                } else if (lastPart.includes('-')) {
                    const split: string[] = lastPart.split('-');
                    if (split.length > 1) {
                        values = [el.slice(0, -(split[1].length + 1)).trim(), split[1].trim()];
                        offsetValue = '-';
                    } else {
                        values = [el];
                    }
                } else {
                    values = [el];
                }
                return { isGuid, processedValues: values, processedOffset: offsetValue };
            }
        }
        const operator: '+' | '-' | null = el.includes('+') ? '+' : (el.includes('-') ? '-' : null);
        if (operator !== null) {
            const lastOperatorIndex: number = el.lastIndexOf(operator);
            const base: string = el.substring(0, lastOperatorIndex);
            const suffix: string = el.substring(lastOperatorIndex + 1);
            const lastTwo: string = base.slice(-2).toUpperCase();
            let finalBase: string = base;
            if (!validTypes.has(lastTwo)) {
                finalBase = base + 'FS';
            }
            const prefix: string = finalBase.slice(0, -2).trim();
            const finalTestId: string = isResourceView ? 'T' + prefix : prefix;
            if (ids.indexOf(finalTestId) === -1 || suffix === '') {
                values = [el];
                offsetValue = '+';
            } else {
                values = [finalBase, suffix];
                offsetValue = operator;
            }
        } else {
            const lastTwo: string = el.slice(-2).toUpperCase();
            if (validTypes.has(lastTwo)) {
                const prefix: string = el.slice(0, -2);
                const finalTestId: string = isResourceView ? 'T' + prefix : prefix;
                if (ids.indexOf(finalTestId) === -1) {
                    values = [el];
                } else {
                    values = [el];
                }
            } else {
                values = [el];
            }
        }
        return { isGuid, processedValues: values, processedOffset: offsetValue };
    }
    private extractAndValidateMatch(value: string, ids: string[], isResourceView: boolean): string[] | null {
        const testId: string = isResourceView ? 'T' + value : value;
        if (ids.indexOf(testId) !== -1) {
            return [value];
        }
        if (ids.indexOf(value) !== -1) {
            return [value];
        }
        let match: string[] = value.split(' ');
        if (match.length === 1) {
            if (value.indexOf(' ') !== -1) {
                match = value.match(/(\d+|[A-z]+)/g) || [];
            } else if (value.length > 2) {
                match = [value.slice(0, -2), value.slice(-2)];
            }
        }
        const finalTestId: string = isResourceView ? 'T' + match[0] : match[0];
        return ids.indexOf(finalTestId) !== -1 ? match : null;
    }
    private determinePredecessorType(
        el: string, match: string[], alphaRegex: RegExp, validTypes: Set<string>
    ): string {
        if (match.length > 1) {
            const type: string = match[1].toUpperCase();
            if (validTypes.has(type)) {
                return type;
            } else {
                const error: string = `The provided dependency type, ${type}, is invalid. Please ensure that the Dependency Type is FS or FF or SS or SF`;
                this.parent.trigger('actionFailure', { error });
                return 'FS';
            }
        }
        if (el.indexOf('-') !== -1 && alphaRegex.test(el)) {
            const type: string = el.slice(-2).toUpperCase();
            return validTypes.has(type) ? type : 'FS';
        }
        return 'FS';
    }
    private handleParentDependency(
        obj: IPredecessor, collection: IPredecessor[], parentRecords: IGanttData[],
        flatDataMap: Map<string, IGanttData>, isProjectView: boolean
    ): void {
        let fromData: IGanttData = null;
        let toData: IGanttData = null;
        if (isProjectView && flatDataMap && flatDataMap.size > 0) {
            fromData = flatDataMap.get(obj.from);
            toData = flatDataMap.get(obj.to);
        } else {
            fromData = this.parent.connectorLineModule.getRecordByID(obj.from);
            toData = this.parent.connectorLineModule.getRecordByID(obj.to);
        }
        if (toData && fromData) {
            const isValid: boolean = this.validateParentPredecessor(fromData, toData);
            if (isValid) {
                collection.push(obj);
                if (fromData.hasChildRecords &&
                    parentRecords.indexOf(fromData) === -1 &&
                    this.parent.editModule && this.parent.editModule.cellEditModule && this.parent.editModule.cellEditModule.isCellEdit) {
                    parentRecords.push(extend([], [], [fromData], true)[0]);
                }
            }
        } else {
            collection.push(obj);
        }
    }
    private handleUndoRedoParentRecords(parentRecords: IGanttData[]): void {
        if (parentRecords.length > 0 &&
            this.parent.undoRedoModule &&
            this.parent.editModule && this.parent.editModule.cellEditModule &&
            this.parent.editModule.cellEditModule.isCellEdit) {
            const undoCollection: Object[] = this.parent.undoRedoModule['getUndoCollection'];
            const lastUndo: Object = undoCollection[undoCollection.length - 1];
            if (lastUndo) {
                lastUndo['connectedRecords'] = parentRecords;
            }
        }
    }
    private removeDuplicatePredecessors(collection: IPredecessor[]): IPredecessor[] {
        const seen: Map<string, IPredecessor> = new Map<string, IPredecessor>();
        for (const data of collection) {
            const key: string = `${data.from}-${data.to}`;
            seen.set(key, data);
        }
        return Array.from(seen.values());
    }

    private generatePredecessorValue(currentValue: IPredecessor, temp: string): string {
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
        return temp;
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
                    temp = this.generatePredecessorValue(currentValue, temp);
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
        let durationUnit: string;
        if (!isNullOrUndefined(this.parent.durationUnit)) {
            durationUnit = this.parent.durationUnit.toLocaleLowerCase();
        }
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
                    if (!isNullOrUndefined(this.parent.durationUnit)) {
                        durationUnit = this.parent.durationUnit.toLocaleLowerCase();
                    }
                }
            }
        } else {
            duration = val;
            if (!isNullOrUndefined(this.parent.durationUnit)) {
                durationUnit = this.parent.durationUnit.toLocaleLowerCase();
            }
        }
        if (isNaN(duration)) {
            const err: string = 'The provided value for the offset field is invalid.Please ensure the offset field contains only valid numeric values';
            this.parent.trigger('actionFailure', { error: err });
            duration = 0;
            if (!isNullOrUndefined(this.parent.durationUnit)) {
                durationUnit = this.parent.durationUnit.toLocaleLowerCase();
            }
        }
        return {
            duration: duration,
            durationUnit: durationUnit
        };
    }
    /**
     * Update predecessor object in both from and to tasks collection
     *
     * @param {Map<string, IGanttData>} flatDataCollection .
     * @returns {void} .
     * @private
     */
    public updatePredecessors(flatDataCollection: Map<string, IGanttData> = null): void {
        const predecessorsCollection: IGanttData[] = this.parent.predecessorsCollection;
        let ganttRecord: IGanttData;
        const length: number = predecessorsCollection.length;
        for (let count: number = 0; count < length; count++) {
            ganttRecord = predecessorsCollection[count as number];
            if ((!ganttRecord.hasChildRecords && !this.parent.allowParentDependency) || this.parent.allowParentDependency) {
                this.updatePredecessorHelper(ganttRecord, predecessorsCollection, flatDataCollection);
                if (!ganttRecord.ganttProperties.isAutoSchedule && this.parent.editSettings.allowEditing) {
                    this.validatedOffsetIds = [];
                    this.calculateOffset(ganttRecord);
                }
            }
        }
    }
    /**
     * To update predecessor collection to successor tasks
     *
     * @param {IGanttData} ganttRecord .
     * @param {IGanttData[]} predecessorsCollection .
     * @param {Map<string, IGanttData>} flatDataCollection .
     * @returns {void} .
     * @private
     */
    public updatePredecessorHelper(ganttRecord: IGanttData, predecessorsCollection?: IGanttData[],
                                   flatDataCollection: Map<string, IGanttData> = null): void {
        const connectorsCollection: IPredecessor[] = ganttRecord.ganttProperties.predecessor;
        let successorGanttRecord: IGanttData;
        const connectorCount: number = connectorsCollection.length;
        predecessorsCollection = isNullOrUndefined(predecessorsCollection) ? [] : predecessorsCollection;
        for (let i: number = 0; i < connectorCount; i++) {
            const connector: IPredecessor = connectorsCollection[i as number];
            if (this.parent.viewType === 'ProjectView' && !isNullOrUndefined(flatDataCollection))
            {
                successorGanttRecord = flatDataCollection.get(connector.from);
            }
            else
            {
                successorGanttRecord = this.parent.connectorLineModule.getRecordByID(connector.from);
            }
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

    private traverseParents(record: IGanttData, isParent: boolean): void {
        this.parent.dataOperation.updateParentItems(record, isParent);
    }

    /**
     * Method to validate date of tasks with predecessor values for all records
     *
     * @param {Map<string, IGanttData>} flatDataCollection .
     * @returns {void} .
     * @private
     */
    public updatedRecordsDateByPredecessor(flatDataCollection: Map<string, IGanttData> = null): void {
        if (!this.parent.autoCalculateDateScheduling ||
            (this.parent.isLoad && this.parent.treeGrid.loadChildOnDemand && this.parent.taskFields.hasChildMapping)) {
            return;
        }
        const flatData: IGanttData[] = this.parent.flatData;
        const totLength: number = flatData.length;
        if (totLength === 0) {
            return;
        }
        if (isNullOrUndefined(flatDataCollection)) {
            flatDataCollection = new Map<string, IGanttData>();
            for (const record of flatData) {
                flatDataCollection.set(record.ganttProperties.rowUniqueID.toString(), record);
            }
        }
        const parentsToUpdate: Set<string> = new Set<string>();
        const isProjectView: boolean = this.parent.viewType === 'ProjectView';
        const allowParentDependency: boolean = this.parent.allowParentDependency;
        const validatedRecords: Set<string> = new Set<string>();
        for (let count: number = 0; count < totLength; count++) {
            const currentTask: IGanttData = flatData[count as number];
            const properties: ITaskData = currentTask.ganttProperties;
            if (!properties.predecessorsName) {
                continue;
            }
            const currentTaskKey: string = currentTask.ganttProperties.taskId.toString();
            if (!validatedRecords.has(currentTaskKey)) {
                this.validatePredecessorDates(currentTask, flatDataCollection);
            }
            if (currentTask.hasChildRecords && properties.startDate && allowParentDependency) {
                this.updateChildItems(currentTask);
            }
            const predecessorCollection: IPredecessor[] = properties.predecessor;
            if (predecessorCollection && predecessorCollection.length > 1) {
                const currentTaskId: string = currentTask.ganttProperties.taskId.toString();
                for (const predecessor of predecessorCollection) {
                    const validateRecord: IGanttData = isProjectView
                        ? flatDataCollection.get(predecessor.to)
                        : this.parent.connectorLineModule.getRecordByID(predecessor.to);
                    if (validateRecord && validateRecord.ganttProperties.taskId.toString() !== currentTaskId) {
                        this.validatePredecessorDates(validateRecord, flatDataCollection);
                        validatedRecords.add(validateRecord.ganttProperties.taskId.toString());
                    }
                }
            }
            if (currentTask.parentItem || currentTask.hasChildRecords) {
                const parentId: string = currentTask.parentItem ? currentTask.parentItem.taskId : currentTask.ganttProperties.taskId;
                parentsToUpdate.add(parentId);
            }
        }
        if (!this.parent.isLoad) {
            parentsToUpdate.forEach((parentId: string) => {
                if (!parentsToUpdate.has(parentId)) {
                    return;
                }
                const parentRecord: IGanttData = isProjectView
                    ? flatDataCollection.get(parentId)
                    : this.parent.getRecordByID(parentId);
                if (parentRecord) {
                    this.traverseParents(parentRecord, true);
                }
            });
        }
        this.parent.dataOperation['processedParentItems'].clear();
    }
    public updateParentPredecessor (flatDataCollection: Map<string, IGanttData> = null): void  {
        if (this.parent.enablePredecessorValidation)
        {
            const parentPredecessorLength: number = this.parentPredecessors.length;
            for (let i: number = parentPredecessorLength - 1; i >= 0; i--)
            {
                const item: IGanttData = this.parentPredecessors[i as number];
                this.validatePredecessorDates(item, flatDataCollection);
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
     * @param {Map<string, IGanttData>} flatDataCollection .
     * @returns {void} .
     * @private
     */
    public validatePredecessorDates(ganttRecord: IGanttData, flatDataCollection: Map<string, IGanttData> = null): void {
        const predecessorsCollection: IPredecessor[] = ganttRecord.ganttProperties.predecessor;
        if (!predecessorsCollection || predecessorsCollection.length === 0) {
            return;
        }
        const isResourceView: boolean = this.parent.viewType === 'ResourceView';
        const isProjectView: boolean = this.parent.viewType === 'ProjectView';
        const allowParentDependency: boolean = this.parent.allowParentDependency;
        const allowTaskbarDragAndDrop: boolean = this.parent.allowTaskbarDragAndDrop;
        const validateManualTasks: boolean = this.parent.validateManualTasksOnLinking;
        const isLoad: boolean = this.parent.isLoad;
        const hasValidFlatData: boolean = isProjectView && !isNullOrUndefined(flatDataCollection);
        const currentTaskId: string = isResourceView
            ? ganttRecord.ganttProperties.taskId.toString()
            : ganttRecord.ganttProperties.rowUniqueID.toString();
        const predecessors: IPredecessor[] = predecessorsCollection.filter((data: IPredecessor) =>
            data.to === currentTaskId
        );
        if (predecessors.length === 0) {
            return;
        }
        const predecessor: IPredecessor = predecessors[0];
        let parentGanttRecord: IGanttData;
        let record: IGanttData;
        if (hasValidFlatData) {
            parentGanttRecord = flatDataCollection.get(predecessor.from);
            record = flatDataCollection.get(predecessor.to);
        } else {
            parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor.from);
            record = this.parent.connectorLineModule.getRecordByID(predecessor.to);
        }
        if (allowParentDependency && parentGanttRecord && parentGanttRecord.hasChildRecords) {
            this.parent.dataOperation.updateParentItems(parentGanttRecord);
        }
        if (isProjectView && allowTaskbarDragAndDrop) {
            if (isNullOrUndefined(record)) {
                const index: number = this.parent.editModule.taskbarEditModule.previousIds.indexOf(predecessor.to);
                if (index !== -1) {
                    record = this.parent.editModule.taskbarEditModule.previousFlatData[index as number];
                }
            } else if (isNullOrUndefined(parentGanttRecord)) {
                const index: number = this.parent.editModule.taskbarEditModule.previousIds.indexOf(predecessor.from);
                if (index !== -1) {
                    parentGanttRecord = this.parent.editModule.taskbarEditModule.previousFlatData[index as number];
                }
            }
        }
        if (allowParentDependency && isLoad &&
            this.parentPredecessors.indexOf(ganttRecord) === -1 &&
            (ganttRecord.hasChildRecords || (record && record.hasChildRecords))) {
            this.parentPredecessors.push(ganttRecord);
        }
        if (record && (record.ganttProperties.isAutoSchedule || validateManualTasks)) {
            this.validateChildGanttRecord(parentGanttRecord, record, flatDataCollection, predecessors);
        }
    }
    private getConstraintDate(
        constraintType: number,
        startDate: Date,
        endDate: Date,
        constraintDate: Date
    ): Date | null {
        let sourceDate: Date | null = null;
        switch (constraintType) {
        case ConstraintType.AsSoonAsPossible:
        case ConstraintType.AsLateAsPossible:
            return null;
        case ConstraintType.MustStartOn:
        case ConstraintType.StartNoEarlierThan:
            if (!constraintDate) {
                return startDate;
            }
            sourceDate = startDate;
            break;
        case ConstraintType.MustFinishOn:
        case ConstraintType.FinishNoEarlierThan:
        case ConstraintType.StartNoLaterThan:
        case ConstraintType.FinishNoLaterThan:
            if (!constraintDate) {
                return endDate;
            }
            sourceDate = endDate;
            break;
        default:
            return null;
        }
        if (sourceDate) {
            if (typeof constraintDate === 'string') {
                constraintDate = new Date(constraintDate);
            }
            if (constraintDate instanceof Date) {
                constraintDate.setHours(
                    sourceDate.getHours(),
                    sourceDate.getMinutes(),
                    sourceDate.getSeconds(),
                    sourceDate.getMilliseconds()
                );
            }
        }
        return constraintDate;
    }
    /**
     * Method to validate task with predecessor
     *
     * @param {IGanttData} parentGanttRecord .
     * @param {IGanttData} childGanttRecord .
     * @param {Map<string, IGanttData>} flatDataCollection .
     * @param {IPredecessor[]} childPredecessorCollection .
     * @returns {void} .
     */
    private validateChildGanttRecord(parentGanttRecord: IGanttData, childGanttRecord: IGanttData,
                                     flatDataCollection: Map<string, IGanttData> = null,
                                     childPredecessorCollection?: IPredecessor[]): void {
        if (this.parent.editedPredecessorRecords.indexOf(childGanttRecord) !== -1) {
            return;
        }
        if (parentGanttRecord && isNullOrUndefined(isScheduledTask(parentGanttRecord.ganttProperties))) {
            return;
        }
        if (childGanttRecord && isNullOrUndefined(isScheduledTask(childGanttRecord.ganttProperties))) {
            return;
        }
        const isInPredecessorValidation: boolean = this.parent.isInPredecessorValidation;
        const validateManualTasks: boolean = this.parent.validateManualTasksOnLinking;
        const childRecordProperty: ITaskData = childGanttRecord.ganttProperties;
        if (!isInPredecessorValidation || !(childRecordProperty.isAutoSchedule || validateManualTasks)) {
            return;
        }
        const isResourceView: boolean = this.parent.viewType === 'ResourceView';
        const taskFields: TaskFieldsModel = this.parent.taskFields;
        const hasConstraintFields: string = taskFields.constraintDate && taskFields.constraintType;
        const isLoad: boolean = this.parent.isLoad;
        const isFromOnPropertyChange: boolean = this.parent.isFromOnPropertyChange;
        const updateOffsetOnTaskbarEdit: boolean = this.parent.updateOffsetOnTaskbarEdit;
        const currentTaskId: string = isResourceView
            ? childRecordProperty.taskId.toString()
            : childRecordProperty.rowUniqueID.toString();
        let childPredecessor: IPredecessor[];
        if (!isNullOrUndefined(childPredecessorCollection)) {
            childPredecessor = childPredecessorCollection;
        } else {
            const predecessorsCollection: IPredecessor[] = childRecordProperty.predecessor;
            childPredecessor = predecessorsCollection.filter((data: IPredecessor) =>
                data.to === currentTaskId
            );
        }
        const startDate: Date = this.getPredecessorDate(childGanttRecord, childPredecessor, flatDataCollection);
        this.parent.setRecordValue('startDate', startDate, childRecordProperty, true);
        this.parent.dataOperation.updateMappingData(childGanttRecord, 'startDate');
        if (hasConstraintFields && updateOffsetOnTaskbarEdit) {
            this.calculateOffset(childGanttRecord);
        }
        const segments: ITaskSegment[] = childRecordProperty.segments;
        if (isNullOrUndefined(segments) || segments.length === 0) {
            this.dateValidateModule.calculateEndDate(childGanttRecord);
        }
        this.parent.dataOperation.updateWidthLeft(childGanttRecord);
        if (!isLoad && !isFromOnPropertyChange && childGanttRecord.parentItem &&
            isInPredecessorValidation &&
            this.parent.getParentTask(childGanttRecord.parentItem).ganttProperties.isAutoSchedule) {
            const parentUniqueID: string = childGanttRecord.parentItem.uniqueID;
            if (this.parentIds.indexOf(parentUniqueID) === -1) {
                this.parentIds.push(parentUniqueID);
                this.parentRecord.push(childGanttRecord.parentItem);
            }
        }
        if (hasConstraintFields) {
            const constraintType: ConstraintType = childRecordProperty.constraintType;
            const startDate: Date = childRecordProperty.startDate;
            const endDate: Date = childRecordProperty.endDate;
            const constraintDate: Date = this.getConstraintDate(constraintType, startDate, endDate, childRecordProperty.constraintDate);
            this.parent.setRecordValue('constraintDate', constraintDate, childRecordProperty, true);
            this.parent.dataOperation.updateMappingData(childGanttRecord, 'constraintDate');
        }
    }
    private filterPredecessorsByTarget(
        predecessorsCollection: IPredecessor[],
        ganttRecord: IGanttData,
        viewType: string
    ): IPredecessor[] {
        if (
            !predecessorsCollection ||
            !Array.isArray(predecessorsCollection) ||
            !ganttRecord ||
            !ganttRecord.ganttProperties ||
            !viewType
        ) {
            return [];
        }
        const targetId: string = viewType === 'ResourceView'
            ? ganttRecord.ganttProperties.taskId
            : ganttRecord.ganttProperties.rowUniqueID;

        return predecessorsCollection.filter((data: IPredecessor): boolean => {
            return data.to === targetId.toString();
        });
    }
    /**
     *
     * @param {IGanttData} ganttRecord .
     * @param {IPredecessor[]} predecessorsCollection .
     * @param {Map<string, IGanttData>} flatDataCollection .
     * @returns {Date} .
     * @private
     */
    public getPredecessorDate(ganttRecord: IGanttData, predecessorsCollection: IPredecessor[],
                              flatDataCollection: Map<string, IGanttData> = null): Date {
        const validatedPredecessor: IPredecessor[] = this.filterPredecessorsByTarget(
            predecessorsCollection,
            ganttRecord,
            this.parent.viewType
        );
        if (!validatedPredecessor || validatedPredecessor.length === 0) {
            return null;
        }
        const isProjectView: boolean = this.parent.viewType === 'ProjectView';
        const hasValidFlatData: boolean = isProjectView && !isNullOrUndefined(flatDataCollection);
        const allowTaskbarDragAndDrop: boolean = this.parent.allowTaskbarDragAndDrop;
        const isConstraintMapped: boolean = !isNullOrUndefined(this.parent.taskFields.constraintDate) &&
            !isNullOrUndefined(this.parent.taskFields.constraintType);
        const editModule: Edit = this.parent.editModule;
        const shouldCheckOffset: boolean = !isConstraintMapped && editModule && editModule.cellEditModule &&
            !editModule.cellEditModule.isCellEdit &&
            !editModule.dialogModule['isFromEditDialog'] &&
            !this.parent.updateOffsetOnTaskbarEdit &&
            !this.parent.isLoad;
        let maxStartDate: Date = null;
        const length: number = validatedPredecessor.length;
        for (let i: number = 0; i < length; i++) {
            const predecessor: IPredecessor = validatedPredecessor[i as number];
            let parentGanttRecord: IGanttData;
            let childGanttRecord: IGanttData;
            if (hasValidFlatData) {
                parentGanttRecord = flatDataCollection.get(predecessor.from);
                childGanttRecord = flatDataCollection.get(predecessor.to);
            } else {
                parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor.from);
                childGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor.to);
            }
            if (isProjectView && allowTaskbarDragAndDrop &&
                !(isNullOrUndefined(childGanttRecord) && isNullOrUndefined(parentGanttRecord))) {

                if (isNullOrUndefined(childGanttRecord)) {
                    childGanttRecord = this.getRecord(parentGanttRecord, childGanttRecord, predecessor);
                }
                if (isNullOrUndefined(parentGanttRecord)) {
                    parentGanttRecord = this.getRecord(parentGanttRecord, childGanttRecord, predecessor);
                }
            }
            if (shouldCheckOffset) {
                const offset: number = this.getOffsetForPredecessor(
                    predecessor,
                    this.parent.connectorLineModule.getRecordByID(predecessor.from),
                    childGanttRecord
                );
                if (predecessor.offset !== offset && offset >= 0) {
                    return childGanttRecord.ganttProperties.startDate;
                }
            }
            if (childGanttRecord && parentGanttRecord) {
                const tempStartDate: Date = this.getValidatedStartDate(
                    childGanttRecord.ganttProperties,
                    parentGanttRecord.ganttProperties,
                    predecessor
                );

                if (maxStartDate === null || this.dateValidateModule.compareDates(tempStartDate, maxStartDate) === 1) {
                    maxStartDate = tempStartDate;
                }
            }
        }
        if (isConstraintMapped) {
            maxStartDate = this.dateValidateModule.getDateByConstraint(
                ganttRecord.ganttProperties,
                maxStartDate,
                length > 0
            );
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
                if (this.parent.allowUnscheduledTasks && isNullOrUndefined(ganttProperty.endDate) &&
                                                            isNullOrUndefined(ganttProperty.duration)) {
                    tempDate = this.dateValidateModule.checkStartDate(tempDate, ganttProperty);
                } else {
                    tempDate = this.dateValidateModule.checkEndDate(tempDate, ganttProperty);
                }
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
        const pdfExportModule: PdfExport = this.parent.pdfExportModule;
        const isPdfExport: boolean = pdfExportModule && pdfExportModule.isPdfExport;
        if (isPdfExport) {
            const exportProps: PdfExportProperties  = pdfExportModule.helper && pdfExportModule.helper.exportProps;
            const fitToWidthSettings: FitToWidthSettings = exportProps && exportProps.fitToWidthSettings;
            if (exportProps && fitToWidthSettings && fitToWidthSettings.isFitToWidth) {
                const exportType: ExportType = exportProps.exportType;
                const beforeSinglePageExport: Object = pdfExportModule.helper.beforeSinglePageExport;
                ganttRecords = (exportType === 'CurrentViewData') ?
                    beforeSinglePageExport['cloneCurrentViewData'] :
                    beforeSinglePageExport['cloneFlatData'];
            }
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
                this.parent.updatedRecords : this.parent.expandedRecords;
        }
        const flatData: IGanttData[] = this.parent.flatData;
        const flatDataCollection: Map<string, IGanttData> = isPdfExport ? null : new Map();
        if (!isPdfExport && !isNullOrUndefined(flatData))
        {
            for (const record of flatData) {
                flatDataCollection.set(record.ganttProperties.rowUniqueID.toString(), record);
            }
        }
        const chartRows: NodeListOf<Element> = this.parent.ganttChartModule.getChartRows();
        const rowHeight: number = !isNullOrUndefined(chartRows) && chartRows[0] && (chartRows[0] as HTMLElement).offsetHeight;
        for (count = 0; count < recordLength; count++) {
            if (this.parent.editModule && this.parent.editModule.deletedTaskDetails.length > 0) {
                const parentRecord: IParent = ganttRecords[count as number].parentItem;
                if (parentRecord) {
                    const parentItem: IGanttData = !isNullOrUndefined(flatDataCollection) ?
                        flatDataCollection.get(parentRecord.taskId.toString()) : this.parent.getRecordByID(parentRecord.taskId.toString());
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
                this.addPredecessorsCollection(predecessorsCollection, flatDataCollection, rowHeight);
            }
        }
    }
    /**
     *
     * @param {object[]} predecessorsCollection .
     * @param {Map<string, IGanttData>} flatDataCollection .
     * @param {number} rowHeight .
     * @returns {void} .
     */
    private addPredecessorsCollection(predecessorsCollection: object[],
                                      flatDataCollection: Map<string, IGanttData> = null, rowHeight: number = 0): void {
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
                if (predecessor[from as string] === predecessor[to as string]) {
                    break;
                }
                if (this.parent.viewType === 'ProjectView' && !isNullOrUndefined(flatDataCollection))
                {
                    parentGanttRecord = flatDataCollection.get(predecessor[from as string]);
                    childGanttRecord = flatDataCollection.get(predecessor[to as string]);
                }
                else
                {
                    parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[from as string]);
                    childGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[to as string]);
                }
                let isValid: boolean = true;
                if (((parentGanttRecord && parentGanttRecord.hasChildRecords && !parentGanttRecord.expanded) ||
                (childGanttRecord && childGanttRecord.hasChildRecords && !childGanttRecord.expanded)) &&
                   !this.parent.allowTaskbarOverlap && this.parent.viewType === 'ProjectView') {
                    isValid = false;
                }
                if (isValid && this.parent.connectorLineModule.expandedRecords &&
                     this.parent.connectorLineModule.expandedRecords.indexOf(parentGanttRecord) !== -1 &&
                    this.parent.connectorLineModule.expandedRecords.indexOf(childGanttRecord) !== -1) {
                    this.updateConnectorLineObject(parentGanttRecord, childGanttRecord, predecessor, rowHeight);
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
     * @param {number} rowHeight .
     * @returns {void} .
     * @private
     */
    public updateConnectorLineObject(
        parentGanttRecord: IGanttData,
        childGanttRecord: IGanttData,
        predecessor: IPredecessor, rowHeight: number = 0): IConnectorLineObject {
        const connectorObj: IConnectorLineObject = this.parent.connectorLineModule.createConnectorLineObject(
            parentGanttRecord, childGanttRecord, predecessor, rowHeight);
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
     * Determines whether the dependent task should be updated based on its predecessor relationship,
     * considering the dependency type (FS, SS, SF, FF), predecessor offsets, and previous dates.
     *
     * @param {IGanttData} parentGanttRecord - The predecessor task.
     * @param {IGanttData} record - The dependent task to evaluate.
     * @param {Date} parentPreviousStart - The previous start date of the predecessor task.
     * @param {Date} parentPreviousEnd - The previous end date of the predecessor task.
     * @param {boolean} predecessorConnected - Optional flag indicating if the predecessor link is already established.
     * @returns {boolean} - Returns true if the dependent task requires an update; otherwise, false.
     */
    private shouldUpdatePredecessor(
        parentGanttRecord: IGanttData,
        record: IGanttData,
        parentPreviousStart: Date,
        parentPreviousEnd: Date,
        predecessorConnected?: boolean
    ): boolean {
        if (
            isNullOrUndefined(record) ||
            isNullOrUndefined(record.ganttProperties) ||
            isNullOrUndefined(record.ganttProperties.taskId) ||
            isNullOrUndefined(parentGanttRecord) ||
            isNullOrUndefined(parentGanttRecord.ganttProperties)
        ) {
            return false;
        }
        if (!predecessorConnected && isNullOrUndefined(parentPreviousStart) && isNullOrUndefined(parentPreviousEnd)) {
            return true;
        }
        const predecessors: IPredecessor[] = parentGanttRecord.ganttProperties.predecessor;
        if (isNullOrUndefined(predecessors) || !Array.isArray(predecessors)) {
            return false;
        }
        const matchingPredecessor: IPredecessor = predecessors
            .find((item: IPredecessor) => item.to === record.ganttProperties.taskId.toString());
        if (isNullOrUndefined(matchingPredecessor)) {
            return false;
        }
        const type: string = matchingPredecessor.type;
        const parentProps: ITaskData = parentGanttRecord.ganttProperties;
        const recordProps: ITaskData = record.ganttProperties;
        if (isNullOrUndefined(parentProps) || isNullOrUndefined(recordProps)) {
            return false;
        }
        let parentStart: Date = parentProps.startDate;
        let parentEnd: Date = parentProps.endDate;
        let recordStart: Date = recordProps.startDate;
        let recordEnd: Date = recordProps.endDate;
        const offset: number = matchingPredecessor.offset;
        const offsetUnit: string = matchingPredecessor.offsetUnit;
        if (offset !== 0) {
            if (offset > 0) {
                if (parentStart) {
                    parentStart = this.parent.dataOperation.getEndDate(parentStart, Math.abs(offset), offsetUnit, parentProps, false);
                }
                if (parentEnd) {
                    parentEnd = this.parent.dataOperation.getEndDate(parentEnd, Math.abs(offset), offsetUnit, parentProps, false);
                }
            } else {
                if (recordStart) {
                    recordStart = this.parent.dataOperation.getEndDate(recordStart, Math.abs(offset), offsetUnit, parentProps, false);
                }
                if (recordEnd) {
                    recordEnd = this.parent.dataOperation.getEndDate(recordEnd, Math.abs(offset), offsetUnit, parentProps, false);
                }
            }
        }
        switch (type) {
        case 'FS':
            return (recordStart != null ? recordStart : recordEnd) < (parentEnd != null ? parentEnd : parentStart);
        case 'SS':
            return (recordStart != null ? recordStart : recordEnd) < (parentStart != null ? parentStart : parentEnd);
        case 'SF':
            return (recordEnd != null ? recordEnd : recordStart) < (parentStart != null ? parentStart : parentEnd);
        case 'FF':
            return (recordEnd != null ? recordEnd : recordStart) < (parentEnd != null ? parentEnd : parentStart);
        default:
            return false;
        }
    }

    /**
     * Handles the update logic for a task's dependency and validates whether child tasks should be updated.
     * It retrieves the previous start and end dates from the stored records to determine if dependency validation is required.
     * If predecessor updates are needed or offset updates are enabled, it triggers child task validation.
     *
     * @param {IGanttData} parentGanttRecord - The parent task whose dependencies are being evaluated.
     * @param {IGanttData} record - The current task being updated.
     * @returns {void}
     */
    private handleTaskUpdate(parentGanttRecord: IGanttData, record: IGanttData): void {
        let previousStartDate: Date;
        let previousEndDate: Date;
        const previousRecord: IGanttData = this.parent.previousRecords[parentGanttRecord.uniqueID];
        let previousGanttProps: ITaskData;
        if (previousRecord && previousRecord['ganttProperties']) {
            previousGanttProps = previousRecord['ganttProperties'];
            if (this.parent.editModule.isDialogEditing) {
                previousStartDate = null;
                previousEndDate = null;
                this.parent.editModule.isDialogEditing = false;
            } else {
                previousStartDate = previousGanttProps['startDate'];
                previousEndDate = previousGanttProps['endDate'];
            }
        }
        const isPredecessorDrawn: boolean = previousGanttProps && 'predecessor' in previousGanttProps;
        const isUpdateSucessorTask: boolean = this.shouldUpdatePredecessor(
            parentGanttRecord,
            record,
            previousStartDate,
            previousEndDate,
            isPredecessorDrawn
        );
        if (this.parent.updateOffsetOnTaskbarEdit || isUpdateSucessorTask) {
            this.validateChildGanttRecord(parentGanttRecord, record);
            if (record.hasChildRecords && record.ganttProperties.isAutoSchedule) {
                this.updateChildItems(record);
            }
        }
    }

    private validateAllChildPredecessorsWithUpdate(record: IGanttData): void {
        const stack: IGanttData[] = [];
        // Start from all direct children
        for (let i: number = record.childRecords.length - 1; i >= 0; i--) {
            stack.push(record.childRecords[i as number]);
        }
        while (stack.length > 0) {
            const currentChild: IGanttData = stack.pop()!;
            const ganttProp: ITaskData = currentChild.ganttProperties;
            // === YOUR ORIGINAL CHECK — PRESERVED 100% ===
            if (this.isChildRecordValidated.indexOf(ganttProp.taskId) !== -1) {
                continue; // skip, already processed
            }
            this.isChildRecordValidated.push(ganttProp.taskId);
            // === YOUR ORIGINAL PREDECESSOR LOGIC — PRESERVED ===
            if (ganttProp.predecessor && ganttProp.predecessor.length > 0) {
                for (let j: number = 0; j < ganttProp.predecessor.length; j++) {
                    const pred: IPredecessor = ganttProp.predecessor[j as number];
                    let linkedTaskId: string;
                    if (pred.to !== record.ganttProperties.taskId.toString()) {
                        linkedTaskId = pred.to;
                    } else {
                        linkedTaskId = pred.from;
                    }
                    const childRec: IGanttData = this.parent.flatData[this.parent.ids.indexOf(linkedTaskId)];
                    if (childRec) {
                        {
                            this.validatePredecessor(childRec, [], '');
                            // === YOUR ORIGINAL updateChildItems CALL — PRESERVED ===
                            if (childRec.hasChildRecords && this.parent.editModule['editedRecord'].hasChildRecords) {
                                this.updateChildItems(childRec);
                            }
                            // === YOUR ORIGINAL assignment — PRESERVED ===
                            this.isValidatedParentTaskID = childRec.ganttProperties.taskId;
                        }
                    }
                }
            }
            // === PUSH NEXT LEVEL CHILDREN — THIS MAKES IT WORK FOR ALL LEVELS ===
            if (currentChild.hasChildRecords) {
                for (let i: number = currentChild.childRecords.length - 1; i >= 0; i--) {
                    stack.push(currentChild.childRecords[i as number]);
                }
            }
        }
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
                    this.handleTaskUpdate(parentGanttRecord, record);
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
                    this.handleTaskUpdate(parentGanttRecord, record);
                    if (this.parent.editModule['editedRecord'] && record) {
                        const rootParent: IGanttData = parentGanttRecord.parentItem ?
                            this.getRootParent(parentGanttRecord) : null;
                        if (record.hasChildRecords && (!this.parent.editModule['editedRecord'].hasChildRecords || (!record.parentItem &&
                            (!rootParent || (rootParent && rootParent.ganttProperties.taskId === this.parent.editModule['editedRecord'].ganttProperties.taskId)))) &&
                            this.isValidatedParentTaskID !== record.ganttProperties.taskId) {
                            this.updateChildItems(record);
                            this.validateAllChildPredecessorsWithUpdate(record);
                            this.isValidatedParentTaskID = record.ganttProperties.taskId;
                        }
                        if (this.parent.editModule['editedRecord'].hasChildRecords && !this.parent.editModule['editedRecord'].parentItem) {
                            this.isValidatedParentTaskID = record.ganttProperties.taskId;
                        }
                    }
                }
                else if (!record.ganttProperties.isAutoSchedule && this.parent.updateOffsetOnTaskbarEdit) {
                    this.validatedOffsetIds = [];
                    this.calculateOffset(record);
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
        if (ganttRecord.childRecords.length > 0 && this.validatedChildItems && this.validatedChildItems.length > 0) {
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
            durationDiff = this.parent.dateValidationModule.getDuration(validStartDate, validEndDate,
                                                                        ganttRecord.ganttProperties.durationUnit, true, false);
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
                            childRecords[i as number].ganttProperties.durationUnit,
                            childRecords[i as number].ganttProperties,
                            false
                        );
                    } else {
                        calcEndDate = this.parent.dateValidationModule.getStartDate(
                            this.parent.dateValidationModule.checkEndDate(startDate, childRecords[i as number].ganttProperties),
                            durationDiff,
                            childRecords[i as number].ganttProperties.durationUnit,
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
        for (const childRecord of childRecords) {
            if (childRecord.ganttProperties.isAutoSchedule) {
                childLists.push(childRecord);
                if (childRecord.hasChildRecords) {
                    this.getUpdatableChildRecords(childRecord, childLists);
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
    private compareObjects(obj1: Object, obj2: Object): boolean {
        const keys1: string[] = Object.keys(obj1).filter((key: string) => key !== 'offset');
        const keys2: string[] = Object.keys(obj2).filter((key: string) => key !== 'offset');
        if (keys1.length !== keys2.length) {
            return false;
        }
        return keys1.every((key: string) => obj1[key as string] === obj2[key as string]);
    }
    private getOffsetForPredecessor(
        predecessor: IPredecessor,
        parentTask: IGanttData,
        record: IGanttData
    ): number {
        let offset: number = 0;
        if ((parentTask.ganttProperties.startDate || parentTask.ganttProperties.endDate) &&
            (record.ganttProperties.startDate || record.ganttProperties.endDate)) {
            let tempStartDate: Date;
            let tempEndDate: Date;
            let tempDuration: number;
            let isNegativeOffset: boolean;
            switch (predecessor.type) {
            case 'FS':
                tempStartDate = new Date((parentTask.ganttProperties.endDate || parentTask.ganttProperties.startDate).getTime());
                tempEndDate = new Date((record.ganttProperties.startDate || record.ganttProperties.endDate).getTime());
                break;
            case 'SS':
                tempStartDate = new Date((parentTask.ganttProperties.startDate || parentTask.ganttProperties.endDate).getTime());
                tempEndDate = new Date((record.ganttProperties.startDate || record.ganttProperties.endDate).getTime());
                break;
            case 'SF':
                tempStartDate = new Date((parentTask.ganttProperties.startDate || parentTask.ganttProperties.endDate).getTime());
                tempEndDate = new Date((record.ganttProperties.endDate || record.ganttProperties.startDate).getTime());
                break;
            case 'FF':
                tempStartDate = new Date((parentTask.ganttProperties.endDate || parentTask.ganttProperties.startDate).getTime());
                tempEndDate = new Date((record.ganttProperties.endDate || record.ganttProperties.startDate).getTime());
                break;
            }

            if (tempStartDate.getTime() < tempEndDate.getTime()) {
                tempStartDate = this.dateValidateModule.checkStartDate(tempStartDate);
                tempEndDate = this.dateValidateModule.checkEndDate(tempEndDate, null);
                isNegativeOffset = false;
            } else {
                const tempDate: Date = new Date(tempStartDate.getTime());
                tempStartDate = this.dateValidateModule.checkStartDate(tempEndDate);
                tempEndDate = this.dateValidateModule.checkEndDate(tempDate, null);
                isNegativeOffset = true;
            }

            if (tempStartDate.getTime() < tempEndDate.getTime()) {
                tempDuration = this.dateValidateModule.getDuration(
                    tempStartDate, tempEndDate, predecessor.offsetUnit, true, false);

                if (this.parent.durationUnit === predecessor.offsetUnit &&
                    ((parentTask.ganttProperties.startDate && isNullOrUndefined(parentTask.ganttProperties.endDate)) ||
                        (isNullOrUndefined(parentTask.ganttProperties.startDate) && parentTask.ganttProperties.endDate))) {
                    tempDuration -= 1;
                }
                offset = isNegativeOffset ? -tempDuration : tempDuration;
            }
        }
        return offset;
    }
    private calculateOffset(record: IGanttData, isRecursive?: boolean): void {
        if (!this.parent.autoCalculateDateScheduling || (this.parent.isLoad && this.parent.treeGrid.loadChildOnDemand
            && this.parent.taskFields.hasChildMapping)) {
            return;
        }
        if (record && isScheduledTask(record.ganttProperties) !== null) {
            const prevPredecessor: IPredecessor[] = extend([], record.ganttProperties.predecessor, [], true) as IPredecessor[];
            const validPredecessor: IPredecessor[] = this.parent.predecessorModule.getValidPredecessor(record);
            if (validPredecessor.length > 0) {
                this.cumulativePredecessorChanges = prevPredecessor;
                for (let i: number = 0; i < validPredecessor.length; i++) {
                    const predecessor: IPredecessor = validPredecessor[parseInt(i.toString(), 10)];
                    const parentTask: IGanttData = this.parent.connectorLineModule.getRecordByID(predecessor.from);
                    if (this.parent.undoRedoModule && this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent.viewType === 'ProjectView') {
                        const isPresent: IPredecessor[] = parentTask.ganttProperties.predecessor.filter((pred: IPredecessor) => {
                            return pred.from === validPredecessor[i as number].from && pred.to === validPredecessor[i as number].to;
                        });
                        if (isPresent.length === 0) {
                            parentTask.ganttProperties.predecessor.push(validPredecessor[i as number]);
                        }
                    }
                    const offset: number = this.getOffsetForPredecessor(predecessor, parentTask, record);
                    const preIndex: number = getIndex(predecessor, 'from', prevPredecessor, 'to');
                    if (preIndex !== -1) {
                        prevPredecessor[preIndex as number].offset = offset;
                    }
                    // Update predecessor in predecessor task
                    const parentTaskPredecessors: IPredecessor = extend([], parentTask.ganttProperties.predecessor, [], true);
                    const parentPreIndex: number = getIndex(predecessor, 'from', parentTaskPredecessors, 'to');
                    if (parentPreIndex !== -1) {
                        parentTaskPredecessors[parentPreIndex as number].offset = offset;
                    }
                    parentTask.ganttProperties.predecessor = parentTaskPredecessors as IPredecessor[];
                }
            } else {
                const validPredecessor: IPredecessor[] = record.ganttProperties.predecessor;
                if (validPredecessor) {
                    if (validPredecessor.length > 0) {
                        validPredecessor.forEach((element: IPredecessor) => {
                            if (this.validatedOffsetIds.indexOf(element.to) === -1) {
                                if (this.parent.viewType === 'ResourceView') {
                                    this.validatedOffsetIds.push(element.to);
                                    this.calculateOffset(this.parent.getRecordByID((this.parent.taskIds.indexOf('T' + element.to)).toString()), true);
                                }
                                else {
                                    this.calculateOffset(this.parent.getRecordByID(element.to), true);
                                }
                            }
                        });
                    }
                }
            }
            if (!isRecursive) {
                if (validPredecessor.length === 0) {
                    this.cumulativePredecessorChanges = [];
                }
                if (prevPredecessor && prevPredecessor.length > 0 && this.cumulativePredecessorChanges &&
                    this.cumulativePredecessorChanges.length > 0) {
                    const matchingObjects: IPredecessor[] = prevPredecessor.map((objectToCompare: IPredecessor) => {
                        const matchedObject: IPredecessor = this.cumulativePredecessorChanges.find(
                            (obj: IPredecessor) => this.compareObjects(obj, objectToCompare));
                        return matchedObject ? { ...matchedObject } : null;
                    }).filter((matchedObject: IPredecessor) => matchedObject !== null);
                    this.parent.setRecordValue('predecessor', matchingObjects, record.ganttProperties, true);
                }
            } else {
                this.parent.setRecordValue('predecessor', prevPredecessor, record.ganttProperties, true);
            }
            const predecessorString: string = this.parent.predecessorModule.getPredecessorStringValue(record);
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, record);
            this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, record);
            this.parent.setRecordValue('predecessorsName', predecessorString, record.ganttProperties, true);
            if (this.validatedOffsetIds.indexOf(record.ganttProperties.taskId.toString()) === -1) {
                this.validatedOffsetIds.push(record.ganttProperties.taskId.toString());
            }
            if (record.hasChildRecords) {
                for (let i: number = 0; i < record.childRecords.length; i++) {
                    if (this.validatedOffsetIds.indexOf(record.childRecords[i as number].ganttProperties.taskId.toString()) === -1 &&
                    record.childRecords[i as number].ganttProperties.predecessor &&
                    record.childRecords[i as number].ganttProperties.predecessor.length > 0) {
                        this.calculateOffset(record.childRecords[i as number]);
                    }
                }
            }
            if (record.parentItem) {
                let currentParent: IParent = record.parentItem;
                while (currentParent) {
                    const parentItem: IGanttData = this.parent.getRecordByID(currentParent.taskId);
                    const parentIdStr: string = parentItem.ganttProperties.taskId.toString();
                    if (
                        this.validatedOffsetIds.indexOf(parentIdStr) === -1 &&
                        parentItem.ganttProperties.predecessor &&
                        parentItem.ganttProperties.predecessor.length > 0
                    ) {
                        this.calculateOffset(parentItem);
                        break;
                    }
                    currentParent = parentItem.parentItem;
                }
            }
        }
    }
}
