import { isNullOrUndefined, isUndefined} from '@syncfusion/ej2-base';
import { getValue, createElement, extend } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import * as cls from '../base/css-constants';
import { parentsUntil, formatString, isScheduledTask, getIndex } from '../base/utils';
import { IGanttData, IPredecessor, IConnectorLineObject, ITaskData, ITaskbarEditedEventArgs, IValidateArgs, IActionBeginEventArgs, IParent } from '../base/interface';
import { Dialog } from '@syncfusion/ej2-popups';
import { DateProcessor } from '../base/date-processor';
import { ViolationType } from '../base/enum';
import { TaskFieldsModel } from '../models/task-fields-model';
import { RadioButton } from '@syncfusion/ej2-buttons';
import { CalendarContext } from '../base/calendar-context';
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
    private isPublicDependencyDelete: boolean = false;
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
            pathElement.setAttribute('stroke-width', (this.parent.connectorLineModule['lineStroke'] + 1).toString());
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
                pathElement.setAttribute('stroke-width', (this.parent.connectorLineModule['lineStroke']).toString());
            }
            this.connectorLineElement = null;
        }
    }

    /**
     * To remove connector line highlight class.
     *
     * @param {IGanttData[]} records .
     * @returns {DocumentFragment} .
     * @private
     */
    public getEditedConnectorLineString(records: IGanttData[]): DocumentFragment {
        let ganttRecord: IGanttData;
        let predecessorsCollection: IPredecessor[];
        let parentGanttRecord: IGanttData;
        let childGanttRecord: IGanttData;
        let connectorObj: IConnectorLineObject;
        const idSet: Set<string> = new Set();
        const lineFragment: DocumentFragment = document.createDocumentFragment();
        for (let count: number = 0; count < records.length; count++) {
            ganttRecord = records[count as number];
            predecessorsCollection = ganttRecord.ganttProperties.predecessor;
            if (!predecessorsCollection) {
                continue;
            }
            for (let predecessorCount: number = 0; predecessorCount < predecessorsCollection.length; predecessorCount++) {
                const predecessor: IPredecessor = predecessorsCollection[predecessorCount as number];
                const from: string = 'from';
                const to: string = 'to';
                const connectorLineId: string = 'parent' + predecessor[from as string] + 'child' + predecessor[to as string];
                this.parent.connectorLineModule.removeConnectorLineById(connectorLineId);
                parentGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[from as string]);
                childGanttRecord = this.parent.connectorLineModule.getRecordByID(predecessor[to as string]);
                if ((!this.parent.allowParentDependency && ((parentGanttRecord && parentGanttRecord.expanded) ||
                    (childGanttRecord && childGanttRecord.expanded))) ||
                    (this.parent.allowParentDependency && (parentGanttRecord || childGanttRecord))) {
                    connectorObj = this.parent.predecessorModule.updateConnectorLineObject(parentGanttRecord,
                                                                                           childGanttRecord, predecessor);
                    if (!isNullOrUndefined(connectorObj) && !idSet.has(connectorObj.connectorLineId)) {
                        const lineElement: Element = this.parent.connectorLineModule.getConnectorLineTemplate(connectorObj);
                        idSet.add(connectorObj.connectorLineId);
                        lineFragment.appendChild(lineElement);
                    }
                }
            }
        }
        return lineFragment;
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
            this.parent.updatedRecords : this.parent.expandedRecords;
        const editedConnectorElement: DocumentFragment = this.getEditedConnectorLineString(editedRecord);
        if (editedConnectorElement) {
            this.parent.connectorLineModule.svgObject.appendChild(editedConnectorElement);
        }
    }

    private idFromPredecessor(pre: string): string[] {
        const preArray: string[] = pre.split(',');
        const preIdArray: string[] = [];
        const guidRegex: RegExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        /* eslint-disable */
        const suffixRegex: RegExp = /\s*([A-Z]{1,2})([+-]\d*\.?\d+\s*(?:days|day|hours|hour|minutes|minute|[DHM])?)?$/i;
        const lagRegex: RegExp = /([+-]\d*\.?\d+\s*(?:days|day|hours|hour|minutes|minute|[DHM])?)$/i;
        const ids: string[] = this.parent.ids;
        for (let j: number = 0; j < preArray.length; j++) {
            const predecessor: string = preArray[j as number].trim();
            let id: string = predecessor;
            if (guidRegex.test(predecessor.substring(0, 36))) {
                id = predecessor.substring(0, 36);
            } else {
                if (ids.indexOf(predecessor) !== -1) {
                    id = predecessor;
                } else {
                    const match: RegExpMatchArray | null = predecessor.match(suffixRegex);
                    if (match) {
                        const prefix: string = predecessor.substring(0, predecessor.length - match[0].length);
                        if (ids.indexOf(prefix) !== -1) {
                            id = prefix;
                        }
                    }
                    if (id === predecessor) {
                        const lagMatch: RegExpMatchArray | null = predecessor.match(lagRegex);
                        if (lagMatch) {
                            const prefix: string = predecessor.substring(0, predecessor.length - lagMatch[0].length);
                            if (ids.indexOf(prefix) !== -1) {
                                id = prefix;
                            }
                        }
                    }
                    if (id === predecessor) {
                        const splitChar: '+' | '-' = predecessor.includes('+') ? '+' : '-';
                        const parts: string[] = predecessor.split(splitChar);
                        if (parts[0] && ids.indexOf(parts[0]) !== -1) {
                            id = parts[0];
                        }
                    }
                }
            }
            preIdArray.push(id);
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
                            flag = this.parent.predecessorModule.validateParentPredecessor(fromRecord, ganttRecord);
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
        this.isPublicDependencyDelete = true;
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
            args.action = editedArgs && editedArgs.action && editedArgs.action === 'CellEditing' ? editedArgs.action : ((this.parent.contextMenuModule && this.parent.contextMenuModule['isCntxtMenuDependencyDelete']) ||
                this.isPublicDependencyDelete) ? 'DeleteConnectorLine' : 'DrawConnectorLine';
            args.data = ganttRecord;
            this.parent.editModule.initiateUpdateAction(args);
            return true;
        } else {
            if (ganttRecord.taskData[this.parent.taskFields.dependency]) {
                ganttRecord.taskData[this.parent.taskFields.dependency] = null;
            }
            const err: string = `${predecessorString} is an invalid relation for task ${this.parent.taskFields.id}. Kindly ensure the ${this.parent.taskFields.dependency} field contains only valid predecessor relations.`;
            this.parent.trigger('actionFailure', { error: err });
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
        const taskFields: TaskFieldsModel = this.parent.taskFields;
        const validationHeader: string = (
            taskFields.constraintType && taskFields.constraintDate
        )
            ? this.parent.localeObj.getConstant('schedulingConflicts')
            : this.parent.localeObj.getConstant('validateEditing');
        const containerId: string = this.parent.element.id + '_dialogValidationRule';
        let container: HTMLElement = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            container.style.zIndex = '2000';
        } else {
            container = document.createElement('div');
            container.id = containerId;
            container.style.zIndex = '2000'; // Set z-index here
            document.body.appendChild(container);
        }
        const validationDialog: Dialog = new Dialog({
            header: validationHeader,
            isModal: true,
            enableRtl: this.parent.enableRtl,
            visible: false,
            width: '50%',
            showCloseIcon: true,
            zIndex: 2000,
            close: this.validationDialogClose.bind(this),
            content: '',
            buttons: [
                {
                    click: this.validationDialogOkButton.bind(this),
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('okText'),
                        isPrimary: true
                    }
                },
                {
                    click: this.validationDialogCancelButton.bind(this),
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('cancel')
                    }
                }
            ],
            target: document.body,
            animationSettings: { effect: 'None' }
        });
        validationDialog.isStringTemplate = true;
        validationDialog.appendTo('#' + containerId);
        this.parent.validationDialogElement = validationDialog;
    }

    private validationDialogOkButton(): void {
        const currentArgs: IValidateArgs = this.parent.currentEditedArgs;
        const addOffsetCheckbox: HTMLInputElement = document.getElementById(this.parent.element.id + '_ValidationAddlineOffset') as HTMLInputElement | null;
        const removeLineCheckbox: HTMLInputElement = document.getElementById(this.parent.element.id + '_ValidationRemoveline') as HTMLInputElement | null;
        const cancelCheckbox: HTMLInputElement = document.getElementById(this.parent.element.id + '_ValidationCancel') as HTMLInputElement | null;
        const removeConstraintCheckbox: HTMLInputElement = document.getElementById(this.parent.element.id + '_RemoveConstraint') as HTMLInputElement | null;
        const removeDependencyCheckbox: HTMLInputElement = document.getElementById(this.parent.element.id + '_RemoveDependency') as HTMLInputElement | null;
        const cancelChangeCheckbox: HTMLInputElement = document.getElementById(this.parent.element.id + '_CancelChange') as HTMLInputElement | null;
        const violationArgs: object = this.parent.editModule['violationArgs'];
        const modifiedTask: IGanttData = violationArgs['matchedModifiedTask'];
        const validationArgs: any = violationArgs['args'];
        const pairedTask: IGanttData | null = violationArgs['matchedParedRecord'] || null;
        if (removeConstraintCheckbox !== null && removeConstraintCheckbox.checked) {
            modifiedTask.ganttProperties.constraintType = 4;
            this.parent.constraintViolationType = '';
            this.parent.editModule.initiateSaveAction(validationArgs);
        } else if (removeDependencyCheckbox !== null && removeDependencyCheckbox.checked) {
            let matchedPredecessors: IPredecessor[] = [];
            const currentTaskId: number | string = pairedTask
                ? pairedTask.ganttProperties.taskId
                : validationArgs.data.ganttProperties.taskId;
            if (modifiedTask && Array.isArray(modifiedTask.ganttProperties.predecessor)) {
                for (const predecessor of modifiedTask.ganttProperties.predecessor) {
                    if (predecessor.from.toString() === currentTaskId.toString()) {
                        matchedPredecessors = [predecessor];
                        break;
                    }
                }
            }
            this.parent.editModule.reUpdatePreviousRecords(undefined, undefined, modifiedTask.uniqueID);
            if (modifiedTask.parentItem && modifiedTask.parentItem.taskId) {
                const parentItem: IGanttData = this.parent.getRecordByID(modifiedTask.parentItem.taskId);
                this.parent.dataOperation.updateParentItems(parentItem, true);
            }
            this.removePredecessors(modifiedTask, matchedPredecessors);
            this.parent.editModule.initiateSaveAction(validationArgs);
        } else if (cancelChangeCheckbox !== null && cancelChangeCheckbox.checked) {
            currentArgs.validateMode.respectLink = true;
            this.applyPredecessorOption();
        }
        const noPrimaryActionTaken: boolean =
            !(removeConstraintCheckbox !== null && removeConstraintCheckbox.checked) &&
            !(removeDependencyCheckbox !== null && removeDependencyCheckbox.checked) &&
            !(cancelChangeCheckbox !== null && cancelChangeCheckbox.checked);
        if (noPrimaryActionTaken) {
            currentArgs.validateMode.preserveLinkWithEditing =
                addOffsetCheckbox !== null && addOffsetCheckbox.checked;
            currentArgs.validateMode.removeLink =
                removeLineCheckbox !== null && removeLineCheckbox.checked;
            currentArgs.validateMode.respectLink =
                cancelCheckbox !== null && cancelCheckbox.checked;
            this.applyPredecessorOption();
        }
        this.parent.hideSpinner();
        this.parent.validationDialogElement.hide();
    }

    private validationDialogCancelButton(): void {
        this.parent.constraintViolationType = '';
        this.parent.currentEditedArgs.validateMode.respectLink = true;
        this.applyPredecessorOption();
        this.parent.hideSpinner();
        this.parent.validationDialogElement.hide();
    }

    private validationDialogClose(e: object): void {
        this.parent.constraintViolationType = '';
        if (getValue('isInteracted', e)) {
            this.parent.currentEditedArgs.validateMode.respectLink = true;
            this.applyPredecessorOption();
            this.parent.hideSpinner();
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
                const taskId: string = ganttRecord.ganttProperties.taskId.toString();
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
            let processedPredecessor: string[] = [];
            this.processPredecessor(connectedTaskId, processedPredecessor);
            processedPredecessor = [];
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
    private processPredecessor(parentId: string, processedPredecessor?: string[]): void {
        if (parentId) {
            const record: IGanttData = this.parent.getRecordByID(parentId);
            if (record && record.ganttProperties && record.ganttProperties.predecessor) {
                this.parent.predecessorModule['validatedOffsetIds'] = [];
                this.parent.predecessorModule['calculateOffset'](record);
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
                        if (processedPredecessor && processedPredecessor.indexOf(predecessor.to) === -1) {
                            this.processPredecessor(predecessor.to, processedPredecessor);
                            processedPredecessor.push(predecessor.to);
                        }
                    }
                });
            }
        }
    }
    private checkChildRecords(ganttRecord: IGanttData): void {
        const matchingPredecessors: IPredecessor[] = [];
        const currentTaskId: string = ganttRecord.ganttProperties.taskId;
        const allPredecessors: IPredecessor[] = ganttRecord.ganttProperties.predecessor;
        if (isNullOrUndefined(allPredecessors)) {
            this.validationPredecessor = allPredecessors;
        } else {
            for (let i: number = 0; i < allPredecessors.length; i++) {
                const predecessorLink: IPredecessor = allPredecessors[i as number];
                if (predecessorLink.to.toString() === currentTaskId.toString()) {
                    matchingPredecessors.push(predecessorLink);
                }
            }
            this.validationPredecessor = matchingPredecessors;
        }
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
    private formatViolationType(violationType: string): string {
        return violationType.replace(/([a-z])([A-Z])/g, '$1 $2');
    }
    private updateZIndex(ganttObj: Gantt): void {
        if (
            ganttObj &&
            ganttObj.editModule &&
            ganttObj.editModule.dialogModule &&
            ganttObj.editModule.dialogModule.dialog &&
            ganttObj.editModule.dialogModule.dialog.style &&
            ganttObj.editModule.dialogModule.dialog.style.zIndex !== ''
        ) {
            const zIndex: number = parseInt(ganttObj.editModule.dialogModule.dialog.style.zIndex, 10);
            const validationElement: HTMLElement =
                ganttObj.validationDialogElement &&
                ganttObj.validationDialogElement.element;

            if (!isNaN(zIndex) && validationElement) {
                const newZIndex: string = (zIndex + 1).toString();
                validationElement.style.zIndex = newZIndex;
                if (validationElement.parentElement) {
                    validationElement.parentElement.style.zIndex = newZIndex;
                }
            }
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
        const ganttObj: Gantt = this.parent;
        const contentTemplate: HTMLElement = this.validationDialogTemplate(args);
        ganttObj.validationDialogElement.setProperties({ content: contentTemplate });
        const contentId: string = ganttObj.element.id + '_dialogValidationRule_dialog-content';
        const contentElement: HTMLElement = ganttObj.validationDialogElement.element.querySelector<HTMLElement>('#' + contentId);
        contentElement.style.paddingTop = '10px';
        const headerId: string = ganttObj.element.id + '_dialogValidationRule_dialog-header';
        const headerElement: HTMLElement = ganttObj.validationDialogElement.element.querySelector<HTMLElement>('#' + headerId);
        headerElement.style.padding = '8px 16px';
        this.updateZIndex(ganttObj);
        ganttObj.validationDialogElement.show();
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
        let violationType: string = getValue('violationType', args);
        const recordName: string = taskData.ganttProperties.taskName;
        const dateFormat: string = !isNullOrUndefined(this.parent.dateFormat) ? this.parent.dateFormat : 'M/d/yyyy h:mm a';
        const recordNewStartDate: string = this.parent.getFormatedDate(taskData.ganttProperties.startDate, dateFormat);
        const parentName: string = parenttaskData.ganttProperties.taskName;
        const recordArgs: string[] = [recordName, parentName];
        let topContentText: string = '';
        if (
            violationType !== 'MustStartOn' &&
            violationType !== 'MustFinishOn' &&
            violationType !== 'StartNoLaterThan' &&
            violationType !== 'FinishNoLaterThan'
        ) {
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
        }
        const topContent: string = '<div id="' + ganttId + '_ValidationText">' + topContentText + '</div>';
        const cancelText: string = this.parent.localeObj.getConstant('cancelLink');
        const removeLinkTextTemplate: string = this.parent.localeObj.getConstant('removeLink');
        const removeLinkText: string = formatString(removeLinkTextTemplate, [recordName, recordNewStartDate]);
        const removeConstraintTextTemplate: string = this.parent.localeObj.getConstant('removeConstraint');
        violationType = this.formatViolationType(violationType);
        const removeConstraintText: string = formatString(removeConstraintTextTemplate, [violationType, recordName]);
        const preserveLinkTextTemplate: string = this.parent.localeObj.getConstant('preserveLink');
        const preserveLinkText: string = formatString(preserveLinkTextTemplate, [recordName, recordNewStartDate]);
        const innerTable: string = `
        <table>
            <tr><td><input type="radio" id="${ganttId}_ValidationCancel" name="ValidationRule" checked/></td></tr>
            <tr><td><input type="radio" id="${ganttId}_ValidationRemoveline" name="ValidationRule"/></td></tr>
            <tr><td><input type="radio" id="${ganttId}_RemoveConstraint" name="ValidationRule"/></td></tr>
            <tr><td><input type="radio" id="${ganttId}_ValidationAddlineOffset" name="ValidationRule"/></td></tr>
        </table>`;
        contentdiv.innerHTML = topContent + innerTable;
        const cancelInput: HTMLInputElement = contentdiv.querySelector(`#${ganttId}_ValidationCancel`) as HTMLInputElement;
        const removeLinkInput: HTMLInputElement = contentdiv.querySelector(`#${ganttId}_ValidationRemoveline`) as HTMLInputElement;
        const removeConstraintInput: HTMLInputElement = contentdiv.querySelector(`#${ganttId}_RemoveConstraint`) as HTMLInputElement;
        const preserveLinkInput: HTMLInputElement = contentdiv.querySelector(`#${ganttId}_ValidationAddlineOffset`) as HTMLInputElement;
        if (cancelInput) {
            new RadioButton({
                label: cancelText,
                name: 'ValidationRule',
                value: 'cancel',
                checked: true,
                cssClass: cls.constraintLabel
            }).appendTo(cancelInput);
        }
        if (removeLinkInput) {
            new RadioButton({
                label: removeLinkText,
                name: 'ValidationRule',
                value: 'removeLink',
                cssClass: cls.constraintLabel
            }).appendTo(removeLinkInput);
        }
        if (removeConstraintInput) {
            new RadioButton({
                label: removeConstraintText,
                name: 'ValidationRule',
                value: 'removeConstraint',
                cssClass: cls.constraintLabel
            }).appendTo(removeConstraintInput);
        }
        if (preserveLinkInput) {
            new RadioButton({
                label: preserveLinkText,
                name: 'ValidationRule',
                value: 'preserveLink',
                cssClass: cls.constraintLabel
            }).appendTo(preserveLinkInput);
        }
        const radioWrapper: NodeListOf<Element> = contentdiv.querySelectorAll('.e-radio-wrapper');
        radioWrapper.forEach((wrapperElement: Element) => {
            (wrapperElement as HTMLElement).style.padding = '6px';
            (wrapperElement.querySelector('span') as HTMLElement).style.fontWeight = 'normal';
        });
        return contentdiv;
    }
    /**
     * To open constraint validation dialog
     *
     * @param {object} args - { violationType: string, parentRecord: IGanttData, record: IGanttData }
     * @returns {void}
     * @private
     */
    public openConstraintValidationDialog(
        args: {
            violationType: ViolationType,
            parentRecord: IGanttData,
            record: IGanttData,
            predecessorLink: any
        }
    ): void {
        const ganttObj: Gantt = this.parent;
        const contentTemplate: HTMLElement = this.constraintValidationDialogTemplate(args);
        const constraintConflictHeader: string = ganttObj.localeObj.getConstant('schedulingConflicts');
        ganttObj.validationDialogElement.setProperties({
            content: contentTemplate,
            header: constraintConflictHeader
        });
        const contentId: string = ganttObj.element.id + '_dialogValidationRule_dialog-content';
        const contentElement: HTMLElement = ganttObj.validationDialogElement.element.querySelector<HTMLElement>('#' + contentId);
        contentElement.style.paddingTop = '10px';
        const headerId: string = ganttObj.element.id + '_dialogValidationRule_dialog-header';
        const headerElement: HTMLElement = ganttObj.validationDialogElement.element.querySelector<HTMLElement>('#' + headerId);
        headerElement.style.padding = '8px 16px';
        this.updateZIndex(ganttObj);
        ganttObj.validationDialogElement.show();
    }
    /**
     * Constraint validation dialog template
     *
     * @param {object} args - { violationType: string, parentRecord: IGanttData, record: IGanttData }
     * @returns {HTMLElement} The HTML element representing the constraint validation dialog
     * @private
     */
    public constraintValidationDialogTemplate(args: {
        violationType: string,
        parentRecord: IGanttData,
        record: IGanttData,
        predecessorLink: any
    }): HTMLElement {
        const ganttId: string = this.parent.element.id;
        const { parentRecord, record, predecessorLink } = args;
        let { violationType } = args;
        const contentDiv: HTMLElement = createElement('div', { className: 'e-ValidationContent' });
        const recordName: string = record.ganttProperties.taskName;
        let parentName: string = '';
        if (parentRecord && parentRecord.ganttProperties && parentRecord.ganttProperties.taskName) {
            parentName = parentRecord.ganttProperties.taskName;
        }
        const removeConstraintTemplate: string = this.parent.localeObj.getConstant('removeConstraint');
        const removeDependencyTemplate: string = this.parent.localeObj.getConstant('removeDependency');
        const cancelChangeText: string = this.parent.localeObj.getConstant('cancelChange');
        violationType = this.formatViolationType(violationType);
        const removeConstraintText: string = formatString(removeConstraintTemplate, [violationType, recordName]);
        const removeDependencyText: string = formatString(removeDependencyTemplate, [parentName, recordName]);
        let innerHtml: string = '<table>';
        innerHtml += `
        <tr>
            <td>
                <input type="radio" id="${ganttId}_RemoveConstraint" name="ValidationRule" />
            </td>
        </tr>`;
        if (predecessorLink !== undefined) {
            innerHtml += `
        <tr>
            <td>
                <input type="radio" id="${ganttId}_RemoveDependency" name="ValidationRule"/>
            </td>
        </tr>`;
        }
        innerHtml += `
        <tr>
            <td>
                <input type="radio" id="${ganttId}_CancelChange" name="ValidationRule"/>
            </td>
        </tr>`;
        innerHtml += '</table>';
        contentDiv.innerHTML = innerHtml;
        const removeConstraintElem: HTMLElement = contentDiv.querySelector(`#${ganttId}_RemoveConstraint`) as HTMLElement;
        if (removeConstraintElem) {
            new RadioButton({
                label: removeConstraintText,
                name: 'ValidationRule',
                value: 'removeConstraint',
                checked: true,
                cssClass: cls.constraintLabel
            }).appendTo(removeConstraintElem);
        }
        if (predecessorLink !== undefined) {
            const removeDependencyElem: HTMLElement = contentDiv.querySelector(`#${ganttId}_RemoveDependency`) as HTMLElement;
            if (removeDependencyElem) {
                new RadioButton({
                    label: removeDependencyText,
                    name: 'ValidationRule',
                    value: 'removeDependency',
                    cssClass: cls.constraintLabel
                }).appendTo(removeDependencyElem);
            }
        }
        const cancelChangeElem: HTMLElement = contentDiv.querySelector(`#${ganttId}_CancelChange`) as HTMLElement;
        if (cancelChangeElem) {
            new RadioButton({
                label: cancelChangeText,
                name: 'ValidationRule',
                value: 'cancelChange',
                cssClass: cls.constraintLabel
            }).appendTo(cancelChangeElem);
        }
        const radioWrapper: NodeListOf<Element> = contentDiv.querySelectorAll('.e-radio-wrapper');
        radioWrapper.forEach((wrapperElement: Element) => {
            (wrapperElement as HTMLElement).style.padding = '6px';
            (wrapperElement.querySelector('span') as HTMLElement).style.fontWeight = 'normal';
        });
        return contentDiv;
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
        const calendarContext: CalendarContext = ganttRecord && ganttRecord.ganttProperties && ganttRecord.ganttProperties.calendarContext
                            ? ganttRecord.ganttProperties.calendarContext
                            : this.parent.defaultCalendarContext;
        const startDate: Date = this.parent.predecessorModule.getPredecessorDate(ganttRecord, predecessor, null);
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
                const duration: number = this.parent.dateValidationModule.getDuration(
                    startDate,
                    ganttTaskData.startDate,
                    this.parent.durationUnit,
                    ganttTaskData.isAutoSchedule,
                    ganttTaskData.isMilestone,
                    true,
                    calendarContext
                );
                if (duration !== 0 || (duration === 0 && this.parent.updateOffsetOnTaskbarEdit === false)) {
                    if (ganttTaskData.startDate < startDate) {
                        this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                        violationType = 'taskBeforePredecessor_FS';
                    } else if (ganttTaskData.startDate > startDate) {
                        this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                        violationType = 'taskAfterPredecessor_FS';
                    }
                }
            } else if (predecessor[i as number].type === 'SS') {
                const endDateOlny: Date = new Date(ganttTaskData.endDate);
                const startDateOlny: Date = new Date(startDate);
                if (ganttTaskData.startDate < startDate) {
                    this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                    violationType = 'taskBeforePredecessor_SS';
                } else if (ganttTaskData.startDate > startDate) {
                    this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                    violationType = 'taskAfterPredecessor_SS';
                }
                else if (
                    this.parent.allowUnscheduledTasks &&
                    isNullOrUndefined(ganttTaskData.startDate) &&
                    isNullOrUndefined(ganttTaskData.duration) &&
                    endDateOlny.setHours(0, 0, 0, 0) < startDateOlny.setHours(0, 0, 0, 0)
                ) {
                    this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                    violationType = 'taskBeforePredecessor_SS';
                }
                else if (
                    this.parent.allowUnscheduledTasks &&
                    isNullOrUndefined(ganttTaskData.startDate) &&
                    isNullOrUndefined(ganttTaskData.duration) &&
                    endDateOlny.setHours(0, 0, 0, 0) > startDateOlny.setHours(0, 0, 0, 0)
                ) {
                    this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                    violationType = 'taskAfterPredecessor_SS';
                }
            } else if (predecessor[i as number].type === 'FF') {
                const duration: number = this.parent.dateValidationModule.getDuration(
                    startDate,
                    parentGanttRecord.ganttProperties.endDate,
                    this.parent.durationUnit,
                    parentGanttRecord.ganttProperties.isAutoSchedule,
                    parentGanttRecord.ganttProperties.isMilestone,
                    true,
                    calendarContext
                );
                if (
                    duration !== 0 || (duration === 0 && this.parent.updateOffsetOnTaskbarEdit === false)
                ) {
                    if (endDate <= parentGanttRecord.ganttProperties.endDate) {
                        this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                        violationType = 'taskBeforePredecessor_FF';
                    } else if (endDate > parentGanttRecord.ganttProperties.endDate) {
                        this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                        violationType = 'taskAfterPredecessor_FF';
                    }
                }
            } else if (predecessor[i as number].type === 'SF') {
                const duration: number = this.parent.dateValidationModule.getDuration(
                    parentGanttRecord.ganttProperties.startDate,
                    endDate,
                    this.parent.durationUnit,
                    parentGanttRecord.ganttProperties.isAutoSchedule,
                    parentGanttRecord.ganttProperties.isMilestone,
                    true,
                    calendarContext
                );
                if (duration !== 0 || (duration === 0 && this.parent.updateOffsetOnTaskbarEdit === false)) {
                    if (endDate < parentGanttRecord.ganttProperties.startDate) {
                        this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                        violationType = 'taskBeforePredecessor_SF';
                    } else if (endDate >= parentGanttRecord.ganttProperties.startDate) {
                        this.validationPredecessor.push(predecessor[parseInt(i.toString(), 10)]);
                        violationType = 'taskAfterPredecessor_SF';
                    }
                }
            }
            if (!isNullOrUndefined(violationType) && isNullOrUndefined(violateType)) {
                violatedParent = parentGanttRecord;
                violateType = violationType;
            }
        }
        if (!violateType && this.parent.constraintViolationType) {
            violateType = this.parent.constraintViolationType;
            const predecessorsCollection: IPredecessor[] = ganttRecord.ganttProperties.predecessor;
            const currentTaskId: string = this.parent.viewType === 'ResourceView' ? ganttRecord.ganttProperties.taskId.toString()
                : ganttRecord.ganttProperties.rowUniqueID.toString();
            const predecessors: IPredecessor[] = predecessorsCollection.filter((data: IPredecessor): IPredecessor => {
                if (data.to === currentTaskId) { return data; } else { return null; }
            });
            let maxViolation: number = -Infinity;
            if (predecessors.length > 0) {
                for (let i: number = 0; i < predecessors.length; i++) {
                    const fromId: string = predecessors[i as number].from;
                    const predecessorRecord: IGanttData = this.parent.getRecordByID(fromId);
                    if (predecessorRecord && predecessorRecord.ganttProperties.endDate && ganttRecord.ganttProperties.startDate) {
                        const violation: number = predecessorRecord.ganttProperties.endDate.getTime() - ganttRecord.ganttProperties.startDate.getTime();
                        if (violation > maxViolation) {
                            maxViolation = violation;
                            violatedParent = predecessorRecord;
                        }
                    }
                }
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
        const newPredecessor: IPredecessor[] = !isNullOrUndefined(data.ganttProperties.predecessor) ?
            data.ganttProperties.predecessor.slice() : data.ganttProperties.predecessor;
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
