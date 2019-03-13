import { isNullOrUndefined, isUndefined, addClass, removeClass, isObject, getValue } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import * as cls from '../base/css-constants';
import { parentsUntil } from '../base/utils';
import { IGanttData, IPredecessor, IConnectorLineObject, ITaskData, ITaskbarEditedEventArgs } from '../base/interface';
/**
 * File for handling connector line edit operation in Gantt.
 */
export class ConnectorLineEdit {
    private parent: Gantt;
    private connectorLineElement: Element;
    constructor(ganttObj?: Gantt) {
        this.parent = ganttObj;
    }

    /**
     * To update connector line edit element.
     * @return {void}
     * @private
     */
    public updateConnectorLineEditElement(e: PointerEvent): void {
        let element: Element = this.getConnectorLineHoverElement(e.target);
        if (!getValue('editModule.taskbarEditModule.taskBarEditAction', this.parent)) {
            this.highlightConnectorLineElements(element);
        }
    }

    /**
     * To get hovered connector line element.
     * @return {void}
     * @private
     */
    private getConnectorLineHoverElement(target: EventTarget): Element {
        let isOnLine: Element = parentsUntil(target as Element, cls.connectorLine);
        let isOnRightArrow: Element = parentsUntil(target as Element, cls.connectorLineRightArrow);
        let isOnLeftArrow: Element = parentsUntil(target as Element, cls.connectorLineLeftArrow);
        if (isOnLine || isOnRightArrow || isOnLeftArrow) {
            return parentsUntil(target as Element, cls.connectorLineContainer);
        } else {
            return null;
        }
    }

    /**
     * To highlight connector line while hover.
     * @return {void}
     * @private
     */
    private highlightConnectorLineElements(element: Element): void {
        if (element) {
            if (element !== this.connectorLineElement) {
                this.removeHighlight();
                this.addHighlight(element);
            }
        } else {
            this.removeHighlight();
        }
    }

    /**
     * To add connector line highlight class.
     * @return {void}
     * @private
     */
    private addHighlight(element: Element): void {
        this.connectorLineElement = element;
        addClass([element], [cls.connectorLineHoverZIndex]);
        addClass(element.querySelectorAll('.' + cls.connectorLine), [cls.connectorLineHover]);
        addClass(element.querySelectorAll('.' + cls.connectorLineRightArrow), [cls.connectorLineRightArrowHover]);
        addClass(element.querySelectorAll('.' + cls.connectorLineLeftArrow), [cls.connectorLineLeftArrowHover]);
    }

    /**
     * To remove connector line highlight class.
     * @return {void}
     * @private
     */
    private removeHighlight(): void {
        if (!isNullOrUndefined(this.connectorLineElement)) {
            removeClass([this.connectorLineElement], [cls.connectorLineHoverZIndex]);
            removeClass(this.connectorLineElement.querySelectorAll('.' + cls.connectorLine), [cls.connectorLineHover]);
            removeClass(this.connectorLineElement.querySelectorAll('.' + cls.connectorLineRightArrow), [cls.connectorLineRightArrowHover]);
            removeClass(this.connectorLineElement.querySelectorAll('.' + cls.connectorLineLeftArrow), [cls.connectorLineLeftArrowHover]);
            this.connectorLineElement = null;
        }
    }

    /**
     * To remove connector line highlight class.
     * @return {void}
     * @private
     */
    public getEditedConnectorLineString(records: IGanttData[]): string {
        let ganttRecord: IGanttData;
        let predecessorsCollection: IPredecessor[];
        let predecessor: IPredecessor;
        let parentGanttRecord: IGanttData;
        let childGanttRecord: IGanttData;
        let connectorObj: IConnectorLineObject;
        let idArray: string[] = [];
        let lineArray: string[] = [];
        let editedConnectorLineString: string = '';
        for (let count: number = 0; count < records.length; count++) {
            ganttRecord = records[count];
            predecessorsCollection = ganttRecord.ganttProperties.predecessor;
            if (predecessorsCollection) {
                for (let predecessorCount: number = 0; predecessorCount < predecessorsCollection.length; predecessorCount++) {
                    predecessor = predecessorsCollection[predecessorCount];
                    let from: string = 'from'; let to: string = 'to';
                    this.removeConnectorLineById('parent' + predecessor[from] + 'child' + predecessor[to]);
                    parentGanttRecord = this.parent.getRecordByID(predecessor[from]);
                    childGanttRecord = this.parent.getRecordByID(predecessor[to]);
                    if ((parentGanttRecord && parentGanttRecord.expanded === true) ||
                        (childGanttRecord && childGanttRecord.expanded === true)) {
                        connectorObj = this.updateConnectorLineObject(parentGanttRecord, childGanttRecord, predecessor);
                        if (!isNullOrUndefined(connectorObj)) {
                            let lineIndex: number = idArray.indexOf(connectorObj.connectorLineId);
                            let lineString: string = this.parent.connectorLineModule.getConnectorLineTemplate(connectorObj);
                            if (lineIndex !== -1) {
                                lineArray[lineIndex] = lineString;
                            } else {
                                idArray.push(connectorObj.connectorLineId);
                                lineArray.push(lineString);
                            }
                        }
                    }
                }
                editedConnectorLineString = lineArray.join('');
            }
        }
        return editedConnectorLineString;
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
     * Tp refresh connector lines of edited records
     * @param editedRecord 
     * @private
     */
    public refreshEditedRecordConnectorLine(editedRecord: IGanttData[]): void {
        this.removePreviousConnectorLines(this.parent.previousRecords);
        let editedConnectorLineString: string;
        editedConnectorLineString = this.getEditedConnectorLineString(editedRecord);
        this.parent.connectorLineModule.dependencyViewContainer.innerHTML =
            this.parent.connectorLineModule.dependencyViewContainer.innerHTML + editedConnectorLineString;
    }
    /**
     * Method to remove connector line from DOM
     * @param records 
     * @private
     */
    public removePreviousConnectorLines(records: IGanttData[] | object): void {
        let isObjectType: boolean;
        if (isObject(records) === true) {
            isObjectType = true;
        } else {
            isObjectType = false;
        }
        let length: number = isObjectType ? Object.keys(records).length : (records as IGanttData[]).length;
        let keys: string[] = Object.keys(records);
        for (let i: number = 0; i < length; i++) {
            let data: IGanttData;
            let predecessors: IPredecessor[];
            if (isObjectType) {
                let uniqueId: string = keys[i];
                data = records[uniqueId] as IGanttData;
            } else {
                data = records[i];
            }

            predecessors = data.ganttProperties && data.ganttProperties.predecessor;
            if (predecessors && predecessors.length > 0) {
                for (let pre: number = 0; pre < predecessors.length; pre++) {
                    let lineId: string = 'parent' + predecessors[pre].from + 'child' + predecessors[pre].to;
                    this.removeConnectorLineById(lineId);
                }
            }
        }
    }
    private removeConnectorLineById(id: string): void {
        let element: Element = this.parent.connectorLineModule.dependencyViewContainer.querySelector('#ConnectorLine' + id);
        if (!isNullOrUndefined(element)) {
            element.remove();
        }
    }

    private idFromPredecessor(pre: string): string[] {
        let preArray: string[] = pre.split(',');
        let preIdArray: string[] = [];
        for (let j: number = 0; j < preArray.length; j++) {
            let strArray: string[] = [];
            for (let i: number = 0; i < preArray[j].length; i++) {
                if (!isNullOrUndefined(preArray[j].charAt(i)) && parseInt(preArray[j].charAt(i), 10).toString() !== 'NaN') {
                    strArray.push(preArray[j].charAt(i));
                } else {
                    break;
                }
            }
            preIdArray.push((strArray.join('')));
        }
        return preIdArray;
    }

    private predecessorValidation(predecessor: string[], record: ITaskData): boolean {

        let recordId: string = record.taskId;
        let currentId: string;
        let currentRecord: ITaskData;
        for (let count: number = 0; count < predecessor.length; count++) {
            currentId = predecessor[count];
            let visitedIdArray: string[] = [];
            let predecessorCollection: string[] = predecessor.slice(0);
            predecessorCollection.splice(count, 1);

            while (currentId !== null) {
                let currentIdArray: string[] = [];
                if (visitedIdArray.indexOf(currentId) === -1) {
                    //Predecessor id not in records collection
                    if (isNullOrUndefined(this.parent.getRecordByID(currentId))) {
                        return false;
                    }
                    currentRecord = this.parent.getRecordByID(currentId).ganttProperties;

                    if (!isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                        currentRecord.predecessor.forEach((value: IPredecessor) => {
                            if (currentRecord.taskId.toString() !== value.from) {
                                currentIdArray.push(value.from.toString());
                            }
                        });
                    }
                    if (recordId.toString() === currentRecord.taskId.toString() || currentIdArray.indexOf(recordId.toString()) !== -1) {
                        return false;
                    }
                    visitedIdArray.push(currentId);
                    if (!isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                        currentId = currentRecord.predecessor[0].from;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        return true;

    }
    /**
     * To validate predecessor relations
     * @param ganttRecord 
     * @param predecessorString 
     * @private
     */
    public validatePredecessorRelation(ganttRecord: IGanttData, predecessorString: string): boolean {
        let flag: boolean = true;
        let recordId: string = ganttRecord.ganttProperties.taskId;
        let predecessorIdArray: string[];
        let currentId: string;
        if (!isNullOrUndefined(predecessorString) && predecessorString.length > 0) {
            predecessorIdArray = this.idFromPredecessor(predecessorString);
            for (let count: number = 0; count < predecessorIdArray.length; count++) {
                //Check edited item has parent item in predecessor collection
                let checkParent: boolean = this.checkParentRelation(ganttRecord, predecessorIdArray);
                if (!checkParent) {
                    return false;
                }
                // Check if predecessor exist more then one 
                let tempIdArray: string[] = predecessorIdArray.slice(0);
                let checkArray: string[] = [];
                let countFlag: boolean = true;
                tempIdArray.forEach((value: string) => {
                    if (checkArray.indexOf(value) === -1) {
                        checkArray.push(value);
                    } else {
                        countFlag = false;
                    }
                });
                if (!countFlag) {
                    return false;
                }
                //Cyclick check  
                currentId = predecessorIdArray[count];
                let visitedIdArray: string[] = [];
                let predecessorCollection: string[] = predecessorIdArray.slice(0);
                predecessorCollection.splice(count, 1);

                while (currentId !== null) {
                    let currentIdArray: string[] = [];
                    let currentIdIndex: number;
                    let currentRecord: ITaskData;
                    if (visitedIdArray.indexOf(currentId) === -1) {
                        //Predecessor id not in records collection
                        if (isNullOrUndefined(this.parent.getRecordByID(currentId.toString()))) {
                            return false;
                        }
                        currentRecord = this.parent.getRecordByID(currentId.toString()).ganttProperties;
                        //  let currentPredecessor='';
                        if (!isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                            currentRecord.predecessor.forEach((value: IPredecessor, index: number) => {
                                if (currentRecord.taskId.toString() !== value.from) {
                                    currentIdArray.push(value.from.toString());
                                    currentIdIndex = index;
                                }
                            });
                            //    currentPredecessor=currentRecord.predecessor[0].from
                        }
                        if (recordId.toString() === currentRecord.taskId.toString() ||
                            currentIdArray.indexOf(recordId.toString()) !== -1) {
                            //cycylic occurs//break;
                            return false;
                        }
                        visitedIdArray.push(currentId);
                        if (!isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                            let result: boolean;
                            if (currentIdArray.length > 1) {
                                result = this.predecessorValidation(currentIdArray, ganttRecord.ganttProperties);
                            } else if (currentIdArray.length === 1) {
                                currentId = currentRecord.predecessor[currentIdIndex].from;
                            }
                            if (result === false) {
                                return false;
                            }
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
        }
        return flag;
    }
    /**
     * To add dependency for Task
     * @param ganttRecord 
     * @param predecessorString 
     * @private
     */
    public addPredecessor(ganttRecord: IGanttData, predecessorString: string): void {
        let tempPredecessorString: string = isNullOrUndefined(ganttRecord.ganttProperties.predecessorsName) ||
            ganttRecord.ganttProperties.predecessorsName === '' ?
            predecessorString : (ganttRecord.ganttProperties.predecessorsName + ',' + predecessorString);
        this.updatePredecessorHelper(ganttRecord, tempPredecessorString);
    }
    /**
     * To remove dependency from task
     * @param ganttRecord 
     * @private
     */
    public removePredecessor(ganttRecord: IGanttData): void {
        this.updatePredecessorHelper(ganttRecord, null);
    }
    /**
     * To modify current dependency values of Task
     * @param ganttRecord 
     * @param predecessorString 
     * @private
     */
    public updatePredecessor(ganttRecord: IGanttData, predecessorString: string): boolean {
        return this.updatePredecessorHelper(ganttRecord, predecessorString);
    }

    private updatePredecessorHelper(ganttRecord: IGanttData, predecessorString: string): boolean {
        if (isUndefined(predecessorString) || this.validatePredecessorRelation(ganttRecord, predecessorString)) {
            this.parent.isOnEdit = true;
            let predecessorCollection: IPredecessor[] = [];
            if (!isNullOrUndefined(predecessorString) && predecessorString !== '') {
                predecessorCollection = this.parent.predecessorModule.calculatePredecessor(predecessorString, ganttRecord);
            }
            this.parent.setRecordValue(
                'predecessor',
                predecessorCollection,
                ganttRecord.ganttProperties,
                true);
            let stringValue: string = this.parent.predecessorModule.getPredecessorStringValue(ganttRecord);
            this.parent.setRecordValue(
                'predecessorsName',
                stringValue,
                ganttRecord.ganttProperties,
                true);
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, stringValue, ganttRecord);
            this.parent.setRecordValue(this.parent.taskFields.dependency, stringValue, ganttRecord);
            let args: ITaskbarEditedEventArgs = {} as ITaskbarEditedEventArgs;
            args.data = ganttRecord;
            this.parent.editModule.initiateUpdateAction(args);
            return true;
        } else {
            return false;
        }
    }

    private checkParentRelation(ganttRecord: IGanttData, predecessorIdArray: string[]): boolean {
        let editingData: IGanttData = ganttRecord;
        let checkParent: boolean = true;
        if (editingData && editingData.parentItem) {
            if (predecessorIdArray.indexOf(editingData.parentItem.taskId.toString()) !== -1) {
                return false;
            }
        }
        for (let p: number = 0; p < predecessorIdArray.length; p++) {
            let record: IGanttData[] = this.parent.currentViewData.filter((item: IGanttData) => {
                return item && item.ganttProperties.taskId.toString() === predecessorIdArray[p].toString();
            });
            if (record[0] && record[0].hasChildRecords) {
                return false;
            }
        }
        return checkParent;
    }
}