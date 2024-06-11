import { isNullOrUndefined, isUndefined} from '@syncfusion/ej2-base';
import { getValue, createElement, extend } from '@syncfusion/ej2-base';
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
    private validatedId: { id: string | number, value: IPredecessor }[] = [];
    private dateValidateModule: DateProcessor;
    private validatedOffsetIds: string[] = [];
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
        const isOnLine: Element = parentsUntil(target as Element, cls.connectorLineSVG);
        const isArrow: Element = parentsUntil(target as Element, cls.connectorLineArrow);
        const isCriticalLine: Element = parentsUntil(target as Element, cls.criticalConnectorLineSVG);
        const isCriticalArrow: Element = parentsUntil(target as Element, cls.criticalConnectorArrowSVG);
        if (isOnLine || isArrow || isCriticalLine || isCriticalArrow) {
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
        const pathElement: Element = element.querySelector('.' + cls.connectorLineSVG);
        if (pathElement) {
            pathElement.setAttribute('stroke-width', '2');
        }
    }

    /**
     * To remove connector line highlight class.
     *
     * @returns {void} .
     * @private
     */
    private removeHighlight(): void {
        if (this.connectorLineElement) {
            const pathElement: Element = this.connectorLineElement.querySelector('.' + cls.connectorLineSVG);
            if (pathElement) {
                pathElement.setAttribute('stroke-width', '1');
            }
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
            ganttRecord = records[count as number];
            predecessorsCollection = ganttRecord.ganttProperties.predecessor;
            if (predecessorsCollection) {
                for (let predecessorCount: number = 0; predecessorCount < predecessorsCollection.length; predecessorCount++) {
                    predecessor = predecessorsCollection[predecessorCount as number];
                    const from: string = 'from'; const to: string = 'to';
                    this.parent.connectorLineModule.removeConnectorLineById('parent' + predecessor[from as string] + 'child' + predecessor[to as string]);
                    parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[`${from}`]);
                    childGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[`${to}`]);
                    if ((!this.parent.allowParentDependency && (parentGanttRecord && parentGanttRecord.expanded === true) ||
                    (childGanttRecord && childGanttRecord.expanded === true)) || (this.parent.allowParentDependency &&
                        (parentGanttRecord || childGanttRecord))) {
                        connectorObj =
                            this.parent.predecessorModule.updateConnectorLineObject(parentGanttRecord, childGanttRecord, predecessor);
                        if (!isNullOrUndefined(connectorObj)) {
                            const lineIndex: number = idArray.indexOf(connectorObj.connectorLineId);
                            const lineString: string = this.parent.connectorLineModule.getConnectorLineTemplate(connectorObj);
                            if (lineIndex !== -1) {
                                lineArray[lineIndex as number] = lineString;
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
        this.parent.connectorLineModule.svgObject.innerHTML =
            this.parent.connectorLineModule.svgObject.innerHTML + editedConnectorLineString;
    }

    private idFromPredecessor(pre: string): string[] {
        const preArray: string[] = pre.split(',');
        const preIdArray: string[] = [];
        let values: string[] = [];
        let match: string[] = [];
        for (let j: number = 0; j < preArray.length; j++) {
            const strArray: string[] = [];
            let firstPart: string;
            let isAlpha: boolean = false;
            let predecessorName: string;
            let isGUId: boolean = false;
            const regex: RegExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
            const elSplit: string[] = preArray[j as number].split('-');
            let id: string;
            if (elSplit.length === 6) {
                elSplit[4] = elSplit[4] + '-' + elSplit[5];
                elSplit.pop();
            }
            if (elSplit.length === 5 && elSplit[4].length >= 12) {
                id = preArray[j as number].substring(0, 36);
                if (regex.test(id)) {
                    isGUId = true;
                }
            }
            if (preArray[j as number].includes('-')) {
                if (preArray[j as number].includes('-') && preArray[j as number].includes('days')) {
                    predecessorName = preArray[j as number].slice(-9).toString();
                }
                if (preArray[j as number].includes('-') && preArray[j as number].includes('day')) {
                    predecessorName = preArray[j as number].slice(-8).toString();
                }
                else {
                    predecessorName = preArray[j as number].slice(-2).toString();
                }
                if (preArray[j as number].includes('-') && /[A-Za-z]/.test(predecessorName)) {
                    const indexFS: number = preArray[j as number].indexOf(predecessorName);
                    if (indexFS !== -1) {
                        firstPart = preArray[j as number].substring(0, indexFS);
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
                    values[0] = preArray[j as number];
                }
                else {
                    spliceLength = split[1].length;
                    values[0] = preArray[j as number].slice(0, -(spliceLength + 1));
                    values[1] = split[1];
                }
                if (elSplit[4].indexOf('-') >= 0) {
                    split = elSplit[4].split('-');
                    if (split.length === 1) {
                        values[0] = preArray[j as number];
                    }
                    else {
                        spliceLength = split[1].length;
                        values[0] = preArray[j as number].slice(0, -(spliceLength + 1));
                        values[1] = split[1];
                    }
                }
            }
            else {
                if (isAlpha && firstPart.includes('-')) {
                    values[0] = firstPart;
                }
                else{
                    values = preArray[j as number].split('+');
                    if (preArray[j as number].indexOf('-') >= 0) {
                        values = preArray[j as number].split('-');
                    }
                }
            }
            if (!isNullOrUndefined(values[0])) {
                const ids: string[] = this.parent.viewType === 'ResourceView' ? this.parent.getTaskIds() : this.parent.ids;
                if (ids.indexOf(values[0]) === -1) {
                    if (values[0].indexOf(' ') !== -1) {
                        match = values[0].split(' ');
                        if (match.length === 1) {
                            match = values[0].match(/(\d+|[A-z]+)/g);
                        }
                        strArray.push(match[0]);
                    } else {
                        if (values[0].length === 1 || values[0].length === 2) {
                            strArray.push(values[0]);
                        }
                        else {
                            strArray.push(values[0].slice(0, -2));
                        }
                    }
                } else {
                    strArray.push(values[0]);
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
            currentId = predecessor[count as number];
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
                        const fromRootParent: IGanttData = this.parent.connectorLineEditModule.getRootParent(fromRecord);
                        if (fromRootParent.uniqueID === toRecord.uniqueID) {
                            return false;
                        }
                    }
                    else if (toRecord.parentItem && !fromRecord.parentItem) {
                        const toRootParent: IGanttData = this.parent.connectorLineEditModule.getRootParent(toRecord);
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
     * To validate predecessor relations
     *
     * @param {IGanttData} ganttRecord .
     * @param {string} predecessorString .
     * @returns {boolean} .
     * @private
     */
    public validatePredecessorRelation(ganttRecord: IGanttData, predecessorString: string): boolean {
        let flag: boolean = true;
        const recordId: string = this.parent.viewType === 'ResourceView' ? ganttRecord.ganttProperties.taskId
            : ganttRecord.ganttProperties.rowUniqueID;
        let predecessorIdArray: string[];
        let currentId: string;
        if (!isNullOrUndefined(predecessorString) && predecessorString.length > 0) {
            predecessorIdArray = this.idFromPredecessor(predecessorString);
            for (let count: number = 0; count < predecessorIdArray.length; count++) {
                //Check edited item has parent item in predecessor collection
                if (!this.parent.allowParentDependency) {
                    const checkParent: boolean = this.checkParentRelation(ganttRecord, predecessorIdArray);
                    if (!checkParent) {
                        return false;
                    }
                }
                else {
                    if (parseInt(predecessorIdArray[predecessorIdArray.length - 1], 10) !== ganttRecord[this.parent.taskFields.id]) {
                        const num: number = this.parent.ids.indexOf(predecessorIdArray[predecessorIdArray.length - 1]);
                        const fromRecord: IGanttData = this.parent.currentViewData[num as number];
                        if (fromRecord && ganttRecord) {
                            flag = this.validateParentPredecessor(fromRecord, ganttRecord);
                        }
                    }
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
                currentId = predecessorIdArray[count as number];
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
                                currentId = currentRecord.predecessor[currentIdIndex as number].from;
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
            if (ganttRecord.taskData[this.parent.taskFields.dependency]) {
                ganttRecord.taskData[this.parent.taskFields.dependency] = null;
            }
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
                return item && item.ganttProperties.rowUniqueID.toString() === predecessorIdArray[p as number].toString();
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
            enableRtl: this.parent.enableRtl,
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
            this.checkChildRecords(ganttRecord);
            this.parent.editModule.updateEditedTask(args.editEventArgs);
        } else if (args.validateMode.preserveLinkWithEditing) {
            let connectedTaskId: string;
            if (this.parent.updateOffsetOnTaskbarEdit) {
                const taskId: string = ganttRecord.ganttProperties.taskId;
                if (ganttRecord.ganttProperties.predecessor) {
                    ganttRecord.ganttProperties.predecessor.forEach((predecessor: IPredecessor) => {
                        if (taskId === predecessor.from) {
                            connectedTaskId = predecessor.to;
                            return;
                        }
                    });
                }
            }
            this.parent.editModule.updateEditedTask(args.editEventArgs);
            this.processPredecessors(connectedTaskId);
        }
    }
    private compareArrays(arr1: IPredecessor[], arr2: IPredecessor[]): boolean {
        if (arr1.length !== arr2.length) {
            return false;
        }
        const str1: string = JSON.stringify(arr1);
        const str2: string = JSON.stringify(arr2);
        return str1 === str2;
    }
    private processPredecessors(parentId: string): void {
        if (parentId) {
            const record: IGanttData = this.parent.getRecordByID(parentId);
            if (record && record.ganttProperties && record.ganttProperties.predecessor) {
                this.parent.connectorLineEditModule['validatedOffsetIds'] = [];
                this.calculateOffset(record);
                let isIdInclude: boolean = true;
                /* eslint-disable-next-line */
                const matchedObject: { id: any, value: any } = this.validatedId.find((item: any) =>
                    item.id === record.ganttProperties.taskId);
                if (matchedObject) {
                    const predecessorArray: IPredecessor[] = matchedObject.value;
                    const areArraysEqual: boolean = this.compareArrays(predecessorArray, record.ganttProperties.predecessor);
                    if (areArraysEqual) {
                        isIdInclude = false;
                    }
                }
                const predecessors: IPredecessor[] = record.ganttProperties.predecessor;
                predecessors.forEach((predecessor: IPredecessor) => {
                    if (record.ganttProperties.taskId === predecessor.from && isIdInclude) {
                        this.processPredecessors(predecessor.to);
                    }
                });
            }
        }
    }
    private checkChildRecords(ganttRecord: IGanttData): void {
        this.validationPredecessor = ganttRecord.ganttProperties.predecessor;
        if (!isNullOrUndefined(this.validationPredecessor)) {
            this.removePredecessors(ganttRecord, this.validationPredecessor);
        }
        if (ganttRecord.childRecords.length > 0) {
            for (let i: number = 0; i < ganttRecord.childRecords.length; i++) {
                const childRecord: IGanttData = ganttRecord.childRecords[i as number];
                this.validationPredecessor = childRecord.ganttProperties.predecessor;
                if (!isNullOrUndefined(this.validationPredecessor)) {
                    this.removePredecessors(childRecord, this.validationPredecessor);
                }
                if (childRecord.childRecords.length > 0) {
                    this.checkChildRecords(childRecord);
                }
            }
        } else if (!isNullOrUndefined(ganttRecord.parentItem)) {
            const parentRecord: IGanttData = this.parent.getRecordByID(ganttRecord.parentItem.taskId);
            this.validationPredecessor = parentRecord.ganttProperties.predecessor;
            this.removePredecessors(parentRecord, this.validationPredecessor);
        }
    }

    private calculateOffset(record: IGanttData): void {
        if (record) {
            const prevPredecessor: IPredecessor[] = extend([], record.ganttProperties.predecessor, [], true) as IPredecessor[];
            const validPredecessor: IPredecessor[] = this.parent.predecessorModule.getValidPredecessor(record);
            if (validPredecessor.length > 0) {
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
                            tempDuration = this.dateValidateModule.getDuration(
                                tempStartDate, tempEndDate, predecessor.offsetUnit, true, false);
                            offset = isNegativeOffset ? (tempDuration * -1) : tempDuration;
                        } else {
                            offset = 0;
                        }
                    } else {
                        offset = 0;
                    }
                    const preIndex: number = getIndex(predecessor, 'from', prevPredecessor, 'to');
                    if (preIndex !== -1) {
                        prevPredecessor[preIndex as number].offset = offset;
                    }
                    // Update predecessor in predecessor task
                    const parentPredecessors: IPredecessor = extend([], parentTask.ganttProperties.predecessor, [], true);
                    const parentPreIndex: number = getIndex(predecessor, 'from', parentPredecessors, 'to');
                    if (parentPreIndex !== -1) {
                        parentPredecessors[parentPreIndex as number].offset = offset;
                    }
                    this.parent.setRecordValue('predecessor', parentPredecessors, parentTask.ganttProperties, true);
                }
            } else {
                const validPredecessor: IPredecessor[] = record.ganttProperties.predecessor;
                if (validPredecessor) {
                    if (validPredecessor.length > 0) {
                        validPredecessor.forEach((element: IPredecessor) => {
                            if (this.validatedOffsetIds.indexOf(element.to) === -1) {
                                this.calculateOffset(this.parent.getRecordByID(element.to));
                            }
                        });
                    }
                }
            }
            this.parent.setRecordValue('predecessor', prevPredecessor, record.ganttProperties, true);
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
            else if (record.parentItem) {
                const parentItem: IGanttData = this.parent.getRecordByID(record.parentItem.taskId);
                if (this.validatedOffsetIds.indexOf(parentItem.ganttProperties.taskId.toString()) === -1 &&
                parentItem.ganttProperties.predecessor && parentItem.ganttProperties.predecessor.length > 0) {
                    this.calculateOffset(parentItem);
                }
            }
        }
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
        if (isNullOrUndefined(predecessor)) {
            return;
        }
        const preLength: number = predecessor.length;
        for (let i: number = 0; i < preLength; i++) {
            const parentGanttRecord: IGanttData = this.parent.connectorLineModule.getRecordByID(predecessor[i as number].from as string);
            const parentPredecessor: IPredecessor[] =
                extend([], [], parentGanttRecord.ganttProperties.predecessor, true) as IPredecessor[];
            const index: number = getIndex(predecessor[i as number], 'from', prevPredecessor, 'to');
            prevPredecessor.splice(index, 1);
            const parentIndex: number = getIndex(predecessor[parseInt(i.toString(), 10)], 'from', parentPredecessor, 'to');
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
     * @param {any} data .
     * @returns {boolean} .
     * @private
     */
    public validateTypes(ganttRecord: IGanttData, data?: IGanttData): object {
        const predecessor: IPredecessor[] = this.parent.predecessorModule.getValidPredecessor(ganttRecord);
        let parentGanttRecord: IGanttData;
        this.validationPredecessor = [];
        let violatedParent: IGanttData;
        let ganttTaskData: ITaskData;
        let violateType: string;
        const startDate: Date = this.parent.predecessorModule.getPredecessorDate(ganttRecord, predecessor);
        if (data) {
            ganttTaskData  = data.ganttProperties;
        } else {
            ganttTaskData  = ganttRecord.ganttProperties;
        }
        const endDate: Date = this.parent.allowUnscheduledTasks && isNullOrUndefined(startDate) ?
            ganttTaskData.endDate :
            this.dateValidateModule.getEndDate(startDate, ganttTaskData.duration, ganttTaskData.durationUnit, ganttTaskData, false);
        for (let i: number = 0; i < predecessor.length; i++) {
            parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[i as number].from as string);
            let violationType: string = null;
            if (predecessor[i as number].type === 'FS') {
                if (ganttTaskData.startDate < startDate) {
                    this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                    violationType = 'taskBeforePredecessor_FS';
                } else if (ganttTaskData.startDate > startDate) {
                    this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                    violationType = 'taskAfterPredecessor_FS';
                }
            } else if (predecessor[i as number].type === 'SS') {
                if (ganttTaskData.startDate < startDate) {
                    this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                    violationType = 'taskBeforePredecessor_SS';
                } else if (ganttTaskData.startDate > startDate) {
                    this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                    violationType = 'taskAfterPredecessor_SS';
                }
            } else if (predecessor[i as number].type === 'FF') {
                if (endDate <= parentGanttRecord.ganttProperties.endDate) {
                    this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                    violationType = 'taskBeforePredecessor_FF';
                } else if (endDate > parentGanttRecord.ganttProperties.endDate) {
                    this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                    violationType = 'taskAfterPredecessor_FF';
                }
            } else if (predecessor[i as number].type === 'SF') {
                if (endDate < parentGanttRecord.ganttProperties.startDate) {
                    this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                    violationType = 'taskBeforePredecessor_SF';
                } else if (endDate >= parentGanttRecord.ganttProperties.startDate) {
                    this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                    violationType = 'taskAfterPredecessor_SF';
                }
            }
            if (!isNullOrUndefined(violationType) && isNullOrUndefined(violateType)) {
                violatedParent = parentGanttRecord;
                violateType = violationType;
            }
        }
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
                    const parentGanttRecord: IGanttData = this.parent.connectorLineModule.getRecordByID(
                        prevPredecessor[parseInt(p.toString(), 10)].from as string);
                    if (parentGanttRecord === data) {
                        const isValid: IPredecessor[] = data.ganttProperties.predecessor.filter((pred: IPredecessor) => {
                            return prevPredecessor[p as number].from === pred.from && prevPredecessor[p as number].to === pred.to;
                        });
                        if (isValid.length === 0) {
                            if (data.parentItem && this.parent.taskFields.dependency && data.ganttProperties.predecessor &&
                                this.parent.allowParentDependency) {
                                if (prevPredecessor[p as number].from !== data.parentItem.taskId &&
                                    prevPredecessor[p as number].to !== data.parentItem.taskId) {
                                    data.ganttProperties.predecessor.push(prevPredecessor[parseInt(p.toString(), 10)]);
                                }
                            }
                            else {
                                data.ganttProperties.predecessor.push(prevPredecessor[parseInt(p.toString(), 10)]);
                            }
                        }
                    } else {
                        const parentPredecessor: IPredecessor[] =
                            extend([], [], parentGanttRecord.ganttProperties.predecessor, true) as IPredecessor[];
                        const parentIndex: number = getIndex(prevPredecessor[parseInt(p.toString(), 10)], 'from', parentPredecessor, 'to');
                        if (parentIndex !== -1) {
                            parentPredecessor.splice(parentIndex, 1);
                            this.parent.setRecordValue('predecessor', parentPredecessor, parentGanttRecord.ganttProperties, true);
                        }
                    }
                }
            }
            if (!isNullOrUndefined(newPredecessor)) {
                for (let n: number = 0; n < newPredecessor.length; n++) {
                    const parentGanttRecord: IGanttData = this.parent.connectorLineModule.getRecordByID(
                        newPredecessor[parseInt(n.toString(), 10)].from as string);
                    const parentPredecessor: IPredecessor[] =
                        extend([], [], parentGanttRecord.ganttProperties.predecessor, true) as IPredecessor[];
                    const isValid: IPredecessor[] = parentPredecessor.filter((pred: IPredecessor) => {
                        return newPredecessor[n as number].from === pred.from && newPredecessor[n as number].to === pred.to;
                    });
                    if (isValid.length === 0) {
                        parentPredecessor.push(newPredecessor[parseInt(n.toString(), 10)]);
                        this.parent.setRecordValue('predecessor', parentPredecessor, parentGanttRecord.ganttProperties, true);
                    }
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
        if (this.parent.undoRedoModule && !this.parent.undoRedoModule['isUndoRedoPerformed']) {
            if (this.parent.undoRedoModule['redoEnabled']) {
                this.parent.undoRedoModule['disableRedo']();
            }
            this.parent.undoRedoModule['createUndoCollection']();
            const details: Object = {};
            details['action'] = 'DeleteDependency';
            details['modifiedRecords'] = extend([], [childRecord], [], true);
            (this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] as object) = details;
        }
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
            enableRtl: this.parent.enableRtl,
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
