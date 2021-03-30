import { isNullOrUndefined, isUndefined, addClass} from '@syncfusion/ej2-base';
import { removeClass, getValue, createElement, extend } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import * as cls from '../base/css-constants';
import { parentsUntil, formatString, isScheduledTask, getIndex } from '../base/utils';
import { IGanttData, IPredecessor, IConnectorLineObject, ITaskData, ITaskbarEditedEventArgs, IValidateArgs } from '../base/interface';
import { Dialog } from '@syncfusion/ej2-popups';
import { DateProcessor } from '../base/date-processor';
/**
 * File for handling connector line edit operation in Gantt.
 *
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
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     * @private
     */
    public updateConnectorLineEditElement(e: PointerEvent): void {
        const element: Element = this.getConnectorLineHoverElement(e.target);
        if (!getValue('editModule.taskbarEditModule.taskBarEditAction', this.parent)) {
            this.highlightConnectorLineElements(element);
        }
    }

    /**
     * To get hovered connector line element.
     *
     * @param {EventTarget} target .
     * @returns {void} .
     * @private
     */
    private getConnectorLineHoverElement(target: EventTarget): Element {
        const isOnLine: Element = parentsUntil(target as Element, cls.connectorLine);
        const isOnRightArrow: Element = parentsUntil(target as Element, cls.connectorLineRightArrow);
        const isOnLeftArrow: Element = parentsUntil(target as Element, cls.connectorLineLeftArrow);
        if (isOnLine || isOnRightArrow || isOnLeftArrow) {
            return parentsUntil(target as Element, cls.connectorLineContainer);
        } else {
            return null;
        }
    }

    /**
     * To highlight connector line while hover.
     *
     * @param {Element} element .
     * @returns {void} .
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
     *
     * @param {Element} element .
     * @returns {void} .
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
     *
     * @returns {void} .
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
     *
     * @param {IGanttData[]} records .
     * @returns {string} .
     * @private
     */
    public getEditedConnectorLineString(records: IGanttData[]): string {
        let ganttRecord: IGanttData;
        let predecessorsCollection: IPredecessor[];
        let predecessor: IPredecessor;
        let parentGanttRecord: IGanttData;
        let childGanttRecord: IGanttData;
        let connectorObj: IConnectorLineObject;
        const idArray: string[] = [];
        const lineArray: string[] = [];
        let editedConnectorLineString: string = '';
        for (let count: number = 0; count < records.length; count++) {
            ganttRecord = records[count];
            predecessorsCollection = ganttRecord.ganttProperties.predecessor;
            if (predecessorsCollection) {
                for (let predecessorCount: number = 0; predecessorCount < predecessorsCollection.length; predecessorCount++) {
                    predecessor = predecessorsCollection[predecessorCount];
                    const from: string = 'from'; const to: string = 'to';
                    this.parent.connectorLineModule.removeConnectorLineById('parent' + predecessor[from] + 'child' + predecessor[to]);
                    parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[from]);
                    childGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[to]);
                    if ((parentGanttRecord && parentGanttRecord.expanded === true) ||
                        (childGanttRecord && childGanttRecord.expanded === true)) {
                        connectorObj =
                            this.parent.predecessorModule.updateConnectorLineObject(parentGanttRecord, childGanttRecord, predecessor);
                        if (!isNullOrUndefined(connectorObj)) {
                            const lineIndex: number = idArray.indexOf(connectorObj.connectorLineId);
                            const lineString: string = this.parent.connectorLineModule.getConnectorLineTemplate(connectorObj);
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
     *
     * @param {IGanttData[]} editedRecord .
     * @returns {void} .
     * @private
     */
    public refreshEditedRecordConnectorLine(editedRecord: IGanttData[]): void {
        this.parent.connectorLineModule.removePreviousConnectorLines(this.parent.previousRecords);
        this.parent.connectorLineModule.expandedRecords = this.parent.virtualScrollModule && this.parent.enableVirtualization ?
            this.parent.updatedRecords : this.parent.getExpandedRecords(this.parent.updatedRecords);
        const editedConnectorLineString: string = this.getEditedConnectorLineString(editedRecord);
        this.parent.connectorLineModule.dependencyViewContainer.innerHTML =
            this.parent.connectorLineModule.dependencyViewContainer.innerHTML + editedConnectorLineString;
    }

    private idFromPredecessor(pre: string): string[] {
        const preArray: string[] = pre.split(',');
        const preIdArray: string[] = [];
        for (let j: number = 0; j < preArray.length; j++) {
            const strArray: string[] = [];
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

        const recordId: string = record.rowUniqueID;
        let currentId: string;
        let currentRecord: ITaskData;
        for (let count: number = 0; count < predecessor.length; count++) {
            currentId = predecessor[count];
            const visitedIdArray: string[] = [];
            const predecessorCollection: string[] = predecessor.slice(0);
            predecessorCollection.splice(count, 1);

            while (currentId !== null) {
                const currentIdArray: string[] = [];
                if (visitedIdArray.indexOf(currentId) === -1) {
                    //Predecessor id not in records collection
                    if (isNullOrUndefined(this.parent.connectorLineModule.getRecordByID(currentId))) {
                        return false;
                    }
                    currentRecord = this.parent.connectorLineModule.getRecordByID(currentId).ganttProperties;

                    if (!isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                        currentRecord.predecessor.forEach((value: IPredecessor) => {
                            if (currentRecord.rowUniqueID.toString() !== value.from) {
                                currentIdArray.push(value.from.toString());
                            }
                        });
                    }
                    /* eslint-disable-next-line */
                    if (recordId.toString() === currentRecord.rowUniqueID.toString() || currentIdArray.indexOf(recordId.toString()) !== -1) {
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
     *
     * @param {IGanttData} ganttRecord .
     * @param {string} predecessorString .
     * @returns {boolean} .
     * @private
     */
    public validatePredecessorRelation(ganttRecord: IGanttData, predecessorString: string): boolean {
        const flag: boolean = true;
        const recordId: string = this.parent.viewType === 'ResourceView' ? ganttRecord.ganttProperties.taskId
            : ganttRecord.ganttProperties.rowUniqueID;
        let predecessorIdArray: string[];
        let currentId: string;
        if (!isNullOrUndefined(predecessorString) && predecessorString.length > 0) {
            predecessorIdArray = this.idFromPredecessor(predecessorString);
            for (let count: number = 0; count < predecessorIdArray.length; count++) {
                //Check edited item has parent item in predecessor collection
                const checkParent: boolean = this.checkParentRelation(ganttRecord, predecessorIdArray);
                if (!checkParent) {
                    return false;
                }
                // Check if predecessor exist more then one
                const tempIdArray: string[] = predecessorIdArray.slice(0);
                const checkArray: string[] = [];
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
                const visitedIdArray: string[] = [];
                const predecessorCollection: string[] = predecessorIdArray.slice(0);
                predecessorCollection.splice(count, 1);

                while (currentId !== null) {
                    const currentIdArray: string[] = [];
                    let currentIdIndex: number;
                    let currentRecord: ITaskData;
                    if (visitedIdArray.indexOf(currentId) === -1) {
                        //Predecessor id not in records collection
                        if (isNullOrUndefined(this.parent.connectorLineModule.getRecordByID(currentId.toString()))) {
                            return false;
                        }
                        currentRecord = this.parent.connectorLineModule.getRecordByID(currentId.toString()).ganttProperties;
                        //  let currentPredecessor='';
                        if (!isNullOrUndefined(currentRecord.predecessor) && currentRecord.predecessor.length > 0) {
                            currentRecord.predecessor.forEach((value: IPredecessor, index: number) => {
                                if (currentRecord.rowUniqueID.toString() !== value.from) {
                                    currentIdArray.push(value.from.toString());
                                    currentIdIndex = index;
                                }
                            });
                            //    currentPredecessor=currentRecord.predecessor[0].from
                        }
                        if (recordId.toString() === currentRecord.rowUniqueID.toString() ||
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
     *
     * @param {IGanttData} ganttRecord .
     * @param {string} predecessorString .
     * @returns {void} .
     * @private
     */
    public addPredecessor(ganttRecord: IGanttData, predecessorString: string): void {
        const tempPredecessorString: string = isNullOrUndefined(ganttRecord.ganttProperties.predecessorsName) ||
            ganttRecord.ganttProperties.predecessorsName === '' ?
            predecessorString : (ganttRecord.ganttProperties.predecessorsName + ',' + predecessorString);
        this.updatePredecessorHelper(ganttRecord, tempPredecessorString);
    }
    /**
     * To remove dependency from task
     *
     * @param {IGanttData} ganttRecord .
     * @returns {void} .
     * @private
     */
    public removePredecessor(ganttRecord: IGanttData): void {
        this.updatePredecessorHelper(ganttRecord, null);
    }
    /**
     * To modify current dependency values of Task
     *
     * @param {IGanttData} ganttRecord .
     * @param {string} predecessorString .
     * @param {ITaskbarEditedEventArgs} editedArgs .
     * @returns {boolean} .
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
            const stringValue: string = this.parent.predecessorModule.getPredecessorStringValue(ganttRecord);
            this.parent.setRecordValue(
                'predecessorsName',
                stringValue,
                ganttRecord.ganttProperties,
                true);
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, stringValue, ganttRecord);
            this.parent.setRecordValue(this.parent.taskFields.dependency, stringValue, ganttRecord);
            const args: ITaskbarEditedEventArgs = {} as ITaskbarEditedEventArgs;
            args.action = editedArgs && editedArgs.action && editedArgs.action === 'CellEditing' ? editedArgs.action : 'DrawConnectorLine';
            args.data = ganttRecord;
            this.parent.editModule.initiateUpdateAction(args);
            return true;
        } else {
            return false;
        }
    }

    private checkParentRelation(ganttRecord: IGanttData, predecessorIdArray: string[]): boolean {
        const editingData: IGanttData = ganttRecord;
        const checkParent: boolean = true;
        if (editingData && editingData.parentItem) {
            if (predecessorIdArray.indexOf(editingData.parentItem.taskId.toString()) !== -1) {
                return false;
            }
        }
        for (let p: number = 0; p < predecessorIdArray.length; p++) {
            const record: IGanttData[] = this.parent.currentViewData.filter((item: IGanttData) => {
                return item && item.ganttProperties.rowUniqueID.toString() === predecessorIdArray[p].toString();
            });
            if (record[0] && record[0].hasChildRecords) {
                return false;
            }
        }
        return checkParent;
    }

    private initPredecessorValidationDialog(): void {
        if (this.parent.taskFields.dependency && this.parent.isInPredecessorValidation) {
            const dialogElement: HTMLElement = createElement('div', {
                id: this.parent.element.id + '_dialogValidationRule'
            });
            this.parent.element.appendChild(dialogElement);
            this.renderValidationDialog();
        }
    }

    /**
     * To render validation dialog
     *
     * @returns {void} .
     * @private
     */
    public renderValidationDialog(): void {
        const validationDialog: Dialog = new Dialog({
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
            animationSettings: { effect: 'None' }
        });
        document.getElementById(this.parent.element.id + '_dialogValidationRule').innerHTML = '';
        validationDialog.isStringTemplate = true;
        validationDialog.appendTo('#' + this.parent.element.id + '_dialogValidationRule');
        this.parent.validationDialogElement = validationDialog;
    }

    private validationDialogOkButton(): void {
        const currentArgs: IValidateArgs = this.parent.currentEditedArgs;
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

    // eslint-disable-next-line
    private validationDialogClose(e: object): void {
        if (getValue('isInteraction', e)) {
            this.parent.currentEditedArgs.validateMode.respectLink = true;
            this.applyPredecessorOption();
        }
    }
    /**
     * Validate and apply the predecessor option from validation dialog
     *
     * @returns {void} .
     * @private
     */
    public applyPredecessorOption(): void {
        const args: IValidateArgs = this.parent.currentEditedArgs;
        const ganttRecord: IGanttData = args.data;
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
        const prevPredecessor: IPredecessor[] = extend([], record.ganttProperties.predecessor, [], true) as IPredecessor[];
        const validPredecessor: IPredecessor[] = this.parent.predecessorModule.getValidPredecessor(record);
        for (let i: number = 0; i < validPredecessor.length; i++) {
            const predecessor: IPredecessor = validPredecessor[i];
            const parentTask: IGanttData = this.parent.connectorLineModule.getRecordByID(predecessor.from);
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
                    const tempDate: Date = new Date(tempStartDate.getTime());
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
            const preIndex: number = getIndex (predecessor, 'from', prevPredecessor, 'to');
            prevPredecessor[preIndex].offset = offset;
            // Update predecessor in predecessor task
            const parentPredecessors: IPredecessor = extend([], parentTask.ganttProperties.predecessor, [], true);
            const parentPreIndex: number = getIndex(predecessor, 'from', parentPredecessors, 'to');
            parentPredecessors[parentPreIndex].offset = offset;
            this.parent.setRecordValue('predecessor', parentPredecessors, parentTask.ganttProperties, true);
        }
        this.parent.setRecordValue('predecessor', prevPredecessor, record.ganttProperties, true);
        const predecessorString: string = this.parent.predecessorModule.getPredecessorStringValue(record);
        this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, record);
        this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, record);
        this.parent.setRecordValue('predecessorsName', predecessorString, record.ganttProperties, true);
    }
    /**
     * Update predecessor value with user selection option in predecessor validation dialog
     *
     * @param {IGanttData} ganttRecord .
     * @param {IPredecessor[]} predecessor .
     * @returns {void} .
     */
    private removePredecessors(ganttRecord: IGanttData, predecessor: IPredecessor[]): void {
        const prevPredecessor: IPredecessor[] =
            extend([], [], ganttRecord.ganttProperties.predecessor, true) as IPredecessor[];
        const preLength: number = predecessor.length;
        for (let i: number = 0; i < preLength; i++) {
            const parentGanttRecord: IGanttData = this.parent.connectorLineModule.getRecordByID(predecessor[i].from);
            const parentPredecessor: IPredecessor[] =
                extend([], [], parentGanttRecord.ganttProperties.predecessor, true) as IPredecessor[];
            const index: number = getIndex(predecessor[i], 'from', prevPredecessor, 'to');
            prevPredecessor.splice(index, 1);
            const parentIndex: number = getIndex(predecessor[i], 'from', parentPredecessor, 'to');
            parentPredecessor.splice(parentIndex, 1);
            this.parent.setRecordValue('predecessor', parentPredecessor, parentGanttRecord.ganttProperties, true);
        }
        if (prevPredecessor.length !== ganttRecord.ganttProperties.predecessor.length) {
            this.parent.setRecordValue('predecessor', prevPredecessor, ganttRecord.ganttProperties, true);
            const predecessorString: string = this.parent.predecessorModule.getPredecessorStringValue(ganttRecord);
            this.parent.setRecordValue('predecessorsName', predecessorString, ganttRecord.ganttProperties, true);
            this.parent.setRecordValue('taskData.' + this.parent.taskFields.dependency, predecessorString, ganttRecord);
            this.parent.setRecordValue(this.parent.taskFields.dependency, predecessorString, ganttRecord);
        }
    }

    /**
     * To open predecessor validation dialog
     *
     * @param {object} args .
     * @returns {void} .
     * @private
     */
    // eslint-disable-next-line
    public openValidationDialog(args: object): void {
        const contentTemplate: HTMLElement = this.validationDialogTemplate(args);
        this.parent.validationDialogElement.setProperties({ content: contentTemplate });
        this.parent.validationDialogElement.show();
    }

    /**
     * Predecessor link validation dialog template
     *
     * @param {object} args .
     * @returns {HTMLElement} .
     * @private
     */
    // eslint-disable-next-line
    public validationDialogTemplate(args: object): HTMLElement {
        const ganttId: string = this.parent.element.id;
        const contentdiv: HTMLElement = createElement('div', {
            className: 'e-ValidationContent'
        });
        const taskData: IGanttData = getValue('task', args);
        const parenttaskData: IGanttData = getValue('parentTask', args);
        const violationType: string = getValue('violationType', args);
        const recordName: string = taskData.ganttProperties.taskName;
        const recordNewStartDate: string = this.parent.getFormatedDate(taskData.ganttProperties.startDate, 'MM/dd/yyyy');
        const parentName: string = parenttaskData.ganttProperties.taskName;
        const recordArgs: string[] = [recordName, parentName];
        let topContentText: string;
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
        const topContent: string = '<div id="' + ganttId + '_ValidationText">' + topContentText + '<div>';
        const innerTable: string = '<table>' +
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
     *
     * @param {IGanttData} ganttRecord .
     * @returns {boolean} .
     * @private
     */
    // eslint-disable-next-line
    public validateTypes(ganttRecord: IGanttData): object {
        const predecessor: IPredecessor[] = this.parent.predecessorModule.getValidPredecessor(ganttRecord);
        let parentGanttRecord: IGanttData;
        this.validationPredecessor = [];
        let violatedParent: IGanttData;
        let violateType: string;
        const startDate: Date = this.parent.predecessorModule.getPredecessorDate(ganttRecord, predecessor);
        const ganttTaskData: ITaskData = ganttRecord.ganttProperties;
        const endDate: Date = this.parent.allowUnscheduledTasks && isNullOrUndefined(startDate) ?
            ganttTaskData.endDate :
            this.dateValidateModule.getEndDate(startDate, ganttTaskData.duration, ganttTaskData.durationUnit, ganttTaskData, false);
        for (let i: number = 0; i < predecessor.length; i++) {
            parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[i].from);
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
                if (endDate <= parentGanttRecord.ganttProperties.endDate) {
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
                } else if (endDate >= parentGanttRecord.ganttProperties.startDate) {
                    this.validationPredecessor.push(predecessor[i]);
                    violationType = 'taskAfterPredecessor_SF';
                }
            }
            if (!isNullOrUndefined(violationType) && isNullOrUndefined(violateType)) {
                violatedParent = parentGanttRecord;
                violateType = violationType;
            }
        }
        // eslint-disable-next-line
        const validateArgs: object = {
            parentTask: violatedParent,
            task: ganttRecord,
            violationType: violateType
        };
        return validateArgs;
    }

    /**
     * Method to remove and update new predecessor collection in successor record
     *
     * @param {IGanttData} data .
     * @returns {void} .
     * @private
     */
    public addRemovePredecessor(data: IGanttData): void {
        const prevData: IGanttData = this.parent.previousRecords[data.uniqueID];
        const newPredecessor: IPredecessor[] = data.ganttProperties.predecessor.slice();
        // eslint-disable-next-line
        if (prevData && prevData.ganttProperties && prevData.ganttProperties.hasOwnProperty('predecessor')) {
            const prevPredecessor: IPredecessor[] = prevData.ganttProperties.predecessor;
            if (!isNullOrUndefined(prevPredecessor)) {
                for (let p: number = 0; p < prevPredecessor.length; p++) {
                    const parentGanttRecord: IGanttData = this.parent.connectorLineModule.getRecordByID(prevPredecessor[p].from);
                    if (parentGanttRecord === data) {
                        data.ganttProperties.predecessor.push(prevPredecessor[p]);
                    } else {
                        const parentPredecessor: IPredecessor[] =
                            extend([], [], parentGanttRecord.ganttProperties.predecessor, true) as IPredecessor[];
                        const parentIndex: number = getIndex(prevPredecessor[p], 'from', parentPredecessor, 'to');
                        if (parentIndex !== -1) {
                            parentPredecessor.splice(parentIndex, 1);
                            this.parent.setRecordValue('predecessor', parentPredecessor, parentGanttRecord.ganttProperties, true);
                        }
                    }
                }
            }
            if (!isNullOrUndefined(newPredecessor)) {
                for (let n: number = 0; n < newPredecessor.length; n++) {
                    const parentGanttRecord: IGanttData = this.parent.connectorLineModule.getRecordByID(newPredecessor[n].from);
                    const parentPredecessor: IPredecessor[] =
                        extend([], [], parentGanttRecord.ganttProperties.predecessor, true) as IPredecessor[];
                    parentPredecessor.push(newPredecessor[n]);
                    this.parent.setRecordValue('predecessor', parentPredecessor, parentGanttRecord.ganttProperties, true);
                }
            }
        }
    }

    /**
     * Method to remove a predecessor from a record.
     *
     * @param {IGanttData} childRecord .
     * @param {number} index .
     * @returns {void} .
     * @private
     */
    public removePredecessorByIndex(childRecord: IGanttData, index: number): void {
        const childPredecessor: IPredecessor[] = childRecord.ganttProperties.predecessor;
        const predecessor: IPredecessor = childPredecessor.splice(index, 1) as IPredecessor;
        const parentRecord: IGanttData = this.parent.connectorLineModule.getRecordByID(predecessor[0].from);
        const parentPredecessor: IPredecessor[] = parentRecord.ganttProperties.predecessor;
        const parentIndex: number = getIndex(predecessor[0], 'from', parentPredecessor, 'to');
        parentPredecessor.splice(parentIndex, 1);
        const predecessorString: string = this.parent.predecessorModule.getPredecessorStringValue(childRecord);
        childPredecessor.push(predecessor[0]);
        this.parent.connectorLineEditModule.updatePredecessor(childRecord, predecessorString);
    }

    /**
     * To render predecessor delete confirmation dialog
     *
     * @returns {void} .
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
            animationSettings: { effect: 'None' }
        });
        const confirmDialog: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_deletePredecessorConfirmDialog'
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
