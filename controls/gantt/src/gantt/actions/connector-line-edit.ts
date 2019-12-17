import { isNullOrUndefined, isUndefined, remove, addClass} from '@syncfusion/ej2-base';
import { removeClass, isObject, getValue, createElement, extend } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import * as cls from '../base/css-constants';
import { parentsUntil, formatString, isScheduledTask, getIndex } from '../base/utils';
import { IGanttData, IPredecessor, IConnectorLineObject, ITaskData, ITaskbarEditedEventArgs, IValidateArgs } from '../base/interface';
import { Dialog } from '@syncfusion/ej2-popups';
import { DateProcessor } from '../base/date-processor';
/**
 * File for handling connector line edit operation in Gantt.
 */
export class ConnectorLineEdit {
    private parent: Gantt;
    private connectorLineElement: Element;
    /**
     * @private
     */
    public validationPredecessor: IPredecessor[] = null;
    /** @private */
    public confirmPredecessorDialog: Dialog = null;
     /** @private */
     public predecessorIndex: number = null;
     /** @private */
     public childRecord: IGanttData = null;
    private dateValidateModule: DateProcessor;
    constructor(ganttObj?: Gantt) {
        this.parent = ganttObj;
        this.dateValidateModule = this.parent.dateValidationModule;
        this.parent.on('initPredessorDialog', this.initPredecessorValidationDialog, this);
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
                        connectorObj =
                            this.parent.predecessorModule.updateConnectorLineObject(parentGanttRecord, childGanttRecord, predecessor);
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
            remove(element);
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
    public updatePredecessor(ganttRecord: IGanttData, predecessorString: string, editedArgs?: ITaskbarEditedEventArgs): boolean {
        return this.updatePredecessorHelper(ganttRecord, predecessorString, editedArgs);
    }

    private updatePredecessorHelper(ganttRecord: IGanttData, predecessorString: string, editedArgs?: ITaskbarEditedEventArgs): boolean {
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
            args.action = editedArgs && editedArgs.action && editedArgs.action === 'CellEditing' ? editedArgs.action : 'DrawConnectorLine';
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

    private initPredecessorValidationDialog(): void {
        if (this.parent.taskFields.dependency && this.parent.isInPredecessorValidation) {
            let dialogElement: HTMLElement = createElement('div', {
                id: this.parent.element.id + '_dialogValidationRule',
            });
            this.parent.element.appendChild(dialogElement);
            this.renderValidationDialog();
        }
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
        validationDialog.isStringTemplate = true;
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
        let validPredecessor: IPredecessor[] = this.parent.predecessorModule.getValidPredecessor(record);
        for (let i: number = 0; i < validPredecessor.length; i++) {
            let predecessor: IPredecessor = validPredecessor[i];
            let parentTask: IGanttData = this.parent.getRecordByID(predecessor.from);
            let offset: number;
            if (isScheduledTask(parentTask.ganttProperties) && isScheduledTask(record.ganttProperties)) {
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
                    tempDuration = this.dateValidateModule.getDuration(tempStartDate, tempEndDate, predecessor.offsetUnit, true, false);
                    offset = isNegativeOffset ? (tempDuration * -1) : tempDuration;
                } else {
                    offset = 0;
                }
            } else {
                offset = 0;
            }
            let preIndex: number = getIndex (predecessor, 'from', prevPredecessor, 'to');
            prevPredecessor[preIndex].offset = offset;
            // Update predecessor in predecessor task
            let parentPredecessors: IPredecessor = extend([], parentTask.ganttProperties.predecessor, [], true);
            let parentPreIndex: number = getIndex(predecessor, 'from', parentPredecessors, 'to');
            parentPredecessors[parentPreIndex].offset = offset;
            this.parent.setRecordValue('predecessor', parentPredecessors, parentTask.ganttProperties, true);
        }
        this.parent.setRecordValue('predecessor', prevPredecessor, record.ganttProperties, true);
        let predecessorString: string = this.parent.predecessorModule.getPredecessorStringValue(record);
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, record);
        this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, record);
        this.parent.setRecordValue('predecessorsName', predecessorString, record.ganttProperties, true);
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
            let predecessorString: string = this.parent.predecessorModule.getPredecessorStringValue(ganttRecord);
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
        topContentText =  formatString(topContentText, recordArgs);
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
     * To validate the types while editing the taskbar 
     * @param args
     * @return {boolean}
     * @private
     */
    public validateTypes(ganttRecord: IGanttData): object {
        let predecessor: IPredecessor[] = this.parent.predecessorModule.getValidPredecessor(ganttRecord);
        let parentGanttRecord: IGanttData;
        this.validationPredecessor = [];
        let violatedParent: IGanttData;
        let violateType: string;
        let startDate: Date = this.parent.predecessorModule.getPredecessorDate(ganttRecord, predecessor);
        let ganttTaskData: ITaskData = ganttRecord.ganttProperties;
        let endDate: Date = this.parent.allowUnscheduledTasks && isNullOrUndefined(startDate) ?
            ganttTaskData.endDate :
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

    /**
     * Method to remove a predecessor from a record.
     * @param childRecord
     * @param index  
     * @private
     */
    public removePredecessorByIndex(childRecord: IGanttData, index: number): void {
        let childPredecessor: IPredecessor[] = childRecord.ganttProperties.predecessor;
        let predecessor: IPredecessor = childPredecessor.splice(index, 1) as IPredecessor;
        let parentRecord: IGanttData = this.parent.getRecordByID(predecessor[0].from);
        let parentPredecessor: IPredecessor[] = parentRecord.ganttProperties.predecessor;
        let parentIndex: number = getIndex(predecessor[0], 'from', parentPredecessor, 'to');
        parentPredecessor.splice(parentIndex, 1);
        let predecessorString: string = this.parent.predecessorModule.getPredecessorStringValue(childRecord);
        childPredecessor.push(predecessor[0]);
        this.parent.connectorLineEditModule.updatePredecessor(childRecord, predecessorString);
    }

    /**
     * To render predecessor delete confirmation dialog
     * @return {void}
     * @private
     */
    public renderPredecessorDeleteConfirmDialog(): void {
        this.confirmPredecessorDialog = new Dialog({
            width: '320px',
            isModal: true,
            content: this.parent.localeObj.getConstant('confirmPredecessorDelete'),
            buttons: [
                {
                    click: this.confirmOkDeleteButton.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('okText'), isPrimary: true }
                },
                {
                    click: this.confirmCloseDialog.bind(this),
                    buttonModel: { content: this.parent.localeObj.getConstant('cancel') }
                }],
            target: this.parent.element,
            animationSettings: { effect: 'None' },
        });
        let confirmDialog: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_deletePredecessorConfirmDialog',
        });
        this.parent.element.appendChild(confirmDialog);
        this.confirmPredecessorDialog.isStringTemplate = true;
        this.confirmPredecessorDialog.appendTo(confirmDialog);
    }

    private confirmCloseDialog(): void {
        this.confirmPredecessorDialog.destroy();
    }

    private confirmOkDeleteButton(): void {
        this.removePredecessorByIndex(this.childRecord, this.predecessorIndex);
        this.confirmPredecessorDialog.destroy();
    }
}