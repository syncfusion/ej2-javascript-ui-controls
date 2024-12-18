import { DocumentEditor } from '../../document-editor';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BaseHistoryInfo, MarkerInfo, Operation } from './base-history-info';
import { CommentCharacterElementBox, EditRangeStartElementBox, ElementBox } from '../viewer/page';
import { DocumentHelper } from '../viewer';
import { Action, CONTROL_CHARACTERS } from '../../base/types';
/**
 * EditorHistory preservation class
 */
/**
 * @private
 */
export class HistoryInfo extends BaseHistoryInfo {
    public documentHelper: DocumentHelper;
    /**
     * @private
     */
    public modifiedActions: BaseHistoryInfo[];

    private isChildHistoryInfo: boolean = false;
    public editRangeStart: EditRangeStartElementBox = undefined;

    public get hasAction(): boolean {
        return !isNullOrUndefined(this.modifiedActions);
    }
    public constructor(node: DocumentEditor, isChild: boolean) {
        super(node);
        this.documentHelper = node.documentHelper;
        this.isChildHistoryInfo = isChild;
    }
    public addModifiedAction(baseHistoryInfo: BaseHistoryInfo): void {
        // For complex actions such as Replace text, Insert/Remove Hyperlink etc.
        if (!(this.editorHistory.isUndoing || this.editorHistory.isRedoing)) {
            if (isNullOrUndefined(this.modifiedActions)) {
                this.modifiedActions = [];
            }
            this.modifiedActions.push(baseHistoryInfo);
        }
    }
    /**
     * @returns {Operation[]} returns an array of type Operations
     * @param {boolean} isInvertOperation accepts a boolean value
     * @private
     */
    public getActionInfo(isInvertOperation?: boolean): Operation[] {
        const action: Action = this.action;
        let operations: Operation[] = [];
        switch (action) {
        case 'InsertContentControl':
            for (let i: number = 0; i < this.modifiedActions.length; i++) {
                const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                operations.push(currentHistory.getInsertOperation(currentHistory.action));
            }
            break;
        case 'InsertBookmark':
        case 'RestrictEditing':
            if (this.editorHistory.isUndoing) {
                for (let i: number = 0; i < this.modifiedActions.length; i++) {
                    if (action === 'RestrictEditing') {
                        this.modifiedActions[parseInt(i.toString(), 10)].markerData.push(
                            this.owner.editorModule.getMarkerData(this.modifiedActions[
                                parseInt(i.toString(), 10)].removedNodes[0] as ElementBox));
                    }
                    operations.push(this.modifiedActions[parseInt(i.toString(), 10)].getDeleteOperation('DeleteBookmark', i === 0 ? true : undefined));
                    this.modifiedActions[parseInt(i.toString(), 10)].markerData.shift();
                }
            } else {
                for (let i: number = 0; i < this.modifiedActions.length; i++) {
                    const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                    if (currentHistory.action === 'DeleteBookmark') {
                        operations.push(currentHistory.getDeleteOperation('DeleteBookmark'));
                        operations.push(currentHistory.getDeleteOperation('DeleteBookmark', true));
                        continue;
                    }
                    operations.push(currentHistory.getInsertOperation(action));
                }
            }
            break;
        case 'BackSpace':
        case 'Delete':
        case 'RemoveEditRange':
            if (this.editorHistory.isUndoing) {
                for (let i: number = 0; i < this.modifiedActions.length; i++) {
                    const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                    if (currentHistory.action === 'InsertInline') {
                        const operation: Operation = currentHistory.getDeleteOperation('DeleteBookmark', true);
                        operations.push(operation);
                    } else {
                        const operationCollection: Operation[] = currentHistory.getActionInfo();
                        operations = [...operations, ...operationCollection];
                        if (currentHistory.action === 'RemoveEditRange') {
                            operations.push(currentHistory.getDeleteOperation(action, true));
                        }
                    }
                }
                operations.reverse();
            } else {
                for (let i: number = 0; i < this.modifiedActions.length; i++) {
                    const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                    if (currentHistory.action === 'InsertInline') {
                        const operation: Operation = currentHistory.getInsertOperation('InsertBookmark');
                        operations.push(operation);
                    } else {
                        operations.push(currentHistory.getDeleteOperation(action));
                        if (currentHistory.action === 'RemoveEditRange') {
                            operations.push(currentHistory.getDeleteOperation(action, true));
                        }
                    }
                }
            }
            break;
        case 'PageBreak':
        case 'ColumnBreak':
            if (this.owner.enableTrackChanges) {
                for (let i: number = 0; i < this.modifiedActions.length; i++) {
                    const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                    if (currentHistory.removedNodes.length > 0) {
                        operations = operations.concat(currentHistory.getDeleteOperationsForTrackChanges());
                    }
                    const markerData: MarkerInfo = currentHistory.markerData[currentHistory.markerData.length - 1];
                    const operation: Operation = currentHistory.getInsertOperation('Enter');
                    const breakOperation: Operation = this.getInsertOperation(action);
                    operation.markerData = markerData;
                    breakOperation.markerData =
                        this.owner.editorModule.getMarkerData(undefined, undefined,
                                                              this.owner.editorModule.getRevision(markerData.revisionId));
                    operations.push(operation);
                    operations.push(breakOperation);
                    operations.push(operation);
                    operation.markerData.skipOperation = true;
                }
            } else {
                if (this.editorHistory.isUndoing) {
                    for (let i: number = 0; i < this.modifiedActions.length; i++) {
                        const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                        currentHistory.endIndex = currentHistory.startIndex;
                        //Basically for pagebreak and column break there will three paragraph difference. So for transformation we sended three backspace operation.
                        operations.push(currentHistory.getDeleteOperation('Delete'));
                        operations.push(currentHistory.getDeleteOperation('Delete'));
                        operations.push(currentHistory.getDeleteOperation('Delete'));
                        if (currentHistory.isRemovedNodes) {
                            const operationCollection: Operation[] = currentHistory.getDeleteContent('BackSpace');
                            operations = [...operations, ...operationCollection];
                        }
                    }
                } else {
                    for (let i: number = 0; i < this.modifiedActions.length; i++) {
                        const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                        if (currentHistory.removedNodes.length > 0) {
                            operations.push(currentHistory.getDeleteOperation(action));
                        }
                    }
                    const operation: Operation = this.getInsertOperation('Enter');
                    operation.markerData = { skipOperation: true };
                    //Basically for pagebreak and column break there will three paragraph difference. So for transformation we sended three insert operation.
                    operations.push(operation);
                    operations.push(operation);
                    operations.push(this.getInsertOperation(action));
                    operations.push(operation);
                }
            }
            break;
        case 'InsertHyperlink':
        case 'AutoFormatHyperlink':
        case 'RemoveHyperlink':
            if (this.editorHistory.isUndoing && action === 'RemoveHyperlink') {
                let length: number = 0;
                for (let i: number = 0; i < this.modifiedActions.length; i++) {
                    const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                    if (currentHistory.action === 'FontColor' || currentHistory.action === 'Underline') {
                        length = currentHistory.endIndex - currentHistory.startIndex;
                    }
                }
                if (!isNullOrUndefined(this.modifiedActions[parseInt((this.modifiedActions.length - 1).toString(), 10)].fieldBegin)) {
                    this.modifiedActions[parseInt((this.modifiedActions.length - 1).toString(), 10)].endIndex =
                        this.modifiedActions[parseInt((this.modifiedActions.length - 1).toString(), 10)].startIndex + length;
                    const operation: Operation = this.modifiedActions[
                        parseInt((this.modifiedActions.length - 1).toString(), 10)].getDeleteOperation('Delete');
                    operation.markerData = undefined;
                    operations.push(operation);
                    const operationCollection: Operation[] = this.modifiedActions[
                        parseInt((this.modifiedActions.length - 1).toString(), 10)].getFieldOperation();
                    operations = [...operations, ...operationCollection];
                }
            } else {
                for (let i: number = 0; i < this.modifiedActions.length; i++) {
                    const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                    if (currentHistory.action === 'InsertHyperlink') {
                        operations.push(...currentHistory.getActionInfo());
                    } else if (currentHistory.action === 'InsertInline') {
                        if (currentHistory.insertedText === CONTROL_CHARACTERS.Marker_Start ||
                            currentHistory.insertedText === CONTROL_CHARACTERS.Marker_End) {
                            if (this.editorHistory.isUndoing) {
                                operations.push(currentHistory.getDeleteOperation(currentHistory.action));
                            } else {
                                operations.push(currentHistory.getInsertOperation('InsertHyperlink'));
                            }
                        } else {
                            if (this.editorHistory.isUndoing) {
                                operations.push(currentHistory.getDeleteOperation(currentHistory.action));
                            } else {
                                operations.push(currentHistory.getInsertOperation('Insert'));
                            }
                        }
                    }
                    else if (currentHistory.action === 'Delete') {
                        operations.push(currentHistory.getDeleteOperation(currentHistory.action));
                    }
                    else if (currentHistory.action === 'Underline') {
                        operations = operations.concat(currentHistory.getActionInfo());
                    }
                    else if (currentHistory.action === 'FontColor') {
                        operations = operations.concat(currentHistory.getActionInfo());
                    }
                }
                if (this.editorHistory.isUndoing) {
                    operations.reverse();
                }
            }
            break;
        case 'InsertComment':
            if (this.editorHistory.isUndoing) {
                this.getDeleteCommentOperation(this.modifiedActions, operations);
            } else {
                for (let i: number = 0; i < this.modifiedActions.length; i++) {
                    const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                    let operation: Operation = currentHistory.getInsertOperation(currentHistory.action);
                    if ((currentHistory.insertedElement instanceof CommentCharacterElementBox && currentHistory.action === 'InsertInline')) {
                        operations.push(currentHistory.getCommentOperation(operation, currentHistory.action));
                    } else if (currentHistory.action === 'InsertCommentWidget') {
                        operation = this.getUpdateOperation();
                        operations.push(currentHistory.getCommentOperation(operation, currentHistory.action));
                    }
                }
            }
            break;
        case 'RemoveComment':
            if (this.editorHistory.isUndoing) {
                for (let i: number = this.modifiedActions.length - 1; i >= 0; i--) {
                    const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                    let operation: Operation = undefined;
                    let operationCollection: Operation[] = [];
                    if (currentHistory.action === 'InsertInline' && currentHistory.insertedElement instanceof CommentCharacterElementBox) {
                        operation = currentHistory.getDeleteOperation(currentHistory.action);
                        operationCollection.push(currentHistory.getCommentOperation(operation, 'InsertInline'));
                    } else if (currentHistory.action === 'RemoveInline') {
                        operation = currentHistory.getDeleteOperation(currentHistory.action);
                        operationCollection.push(currentHistory.getCommentOperation(operation, 'InsertInline'));
                        operation = currentHistory.getInsertOperation(currentHistory.action);
                        operationCollection.push(currentHistory.getCommentOperation(operation, 'InsertInline'));
                    } else if (currentHistory.action === 'DeleteComment') {
                        operationCollection = (currentHistory as HistoryInfo).getActionInfo();
                    } else {
                        this.owner.sfdtExportModule.iscontentInsert = false;
                        operationCollection = currentHistory.getActionInfo();
                        this.owner.sfdtExportModule.iscontentInsert = true;
                    }
                    operations = [...operations, ...operationCollection];
                }
            } else {
                for (let i: number = 0; i < this.modifiedActions.length; i++) {
                    const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                    let operation: Operation = undefined;
                    let operationCollection: Operation[] = [];
                    if (currentHistory.action === 'RemoveInline' && currentHistory.removedNodes[0] instanceof CommentCharacterElementBox) {
                        operation = currentHistory.getDeleteOperation(currentHistory.action);
                        operationCollection.push(currentHistory.getCommentOperation(operation, currentHistory.action));
                    } else if (currentHistory.action === 'InsertInline' && currentHistory.insertedElement instanceof CommentCharacterElementBox) {
                        operation = currentHistory.getInsertOperation(currentHistory.action);
                        operationCollection.push(currentHistory.getCommentOperation(operation, currentHistory.action));
                    } else {
                        operationCollection = currentHistory.getActionInfo();
                    }
                    operations = [...operations, ...operationCollection];
                }
            }
            break;
        case 'DeleteComment':
            if (this.editorHistory.isUndoing) {
                for (let j: number = this.modifiedActions.length - 1; j >= 0; j--) {
                    const history: BaseHistoryInfo = this.modifiedActions[parseInt(j.toString(), 10)];
                    let operation: Operation = history.getInsertOperation(history.action);
                    if ((history.insertedElement instanceof CommentCharacterElementBox && history.action === 'RemoveInline')) {
                        operations.push(history.getCommentOperation(operation, 'InsertInline'));
                    } else if (history.action === 'DeleteCommentWidget') {
                        operation = this.getUpdateOperation();
                        operations.push(history.getCommentOperation(operation, 'InsertCommentWidget'));
                    } else if (history.action === 'DeleteComment') {
                        (history as HistoryInfo).getActionInfo();
                    }
                }
            } else {
                this.getDeleteCommentOperation(this.modifiedActions, operations);
            }
            break;
        case 'FormField': {
            const currentHistory: BaseHistoryInfo = this.modifiedActions.pop();
            operations = currentHistory.getFieldOperation();
            break;
        }
        case 'IMEInput':
            if (isInvertOperation && (!(this.editorHistory.isUndoing || this.editorHistory.isRedoing))) {
                if (this.modifiedActions[0].removedNodes.length > 0) {
                    const removeOperation: Operation = this.modifiedActions[0].getDeleteOperation('Delete');
                    removeOperation.length = removeOperation.text.length;
                    operations.push(removeOperation);
                }
                const insertOperation: Operation = this.modifiedActions[this.modifiedActions.length - 1].getInsertOperation('Insert');
                insertOperation.length = insertOperation.text.length;
                operations.push(insertOperation);
                operations.reverse();
                for (let i: number = 0; i < operations.length; i++) {
                    const operation: Operation = operations[parseInt(i.toString(), 10)];
                    if (operation.action === 'Insert') {
                        operation.action = 'Delete';
                    } else if (operation.action === 'Delete') {
                        operation.action = 'Insert';
                    }
                }
            } else {
                let currentHistory: BaseHistoryInfo = this.modifiedActions[this.modifiedActions.length - 1];
                if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
                    for (let i: number = 0; i < this.modifiedActions.length; i++) {
                        currentHistory = this.modifiedActions[parseInt(i.toString(), 10)];
                        if (currentHistory.removedNodes.length > 0) {
                            operations.push(currentHistory.getDeleteOperation(action));
                        }
                        if (currentHistory.isRemovedNodes) {
                            const operationCollection: Operation[] = currentHistory.getDeleteContent('BackSpace');
                            operations = [...operations, ...operationCollection];
                        }
                        currentHistory.isRemovedNodes = false;
                    }
                } else {
                    if (currentHistory.removedNodes.length > 0) {
                        operations.push(currentHistory.getDeleteOperation(action));
                    }
                    operations.push(currentHistory.getInsertOperation(this.action));
                }
                currentHistory.isRemovedNodes = false;
            }
            break;
        case 'Accept All':
        case 'ReplaceAll':
        case 'Reject All': {
            let isSkip: boolean = false;
            if (this.editorHistory.isUndoing) {
                for (let i: number = this.modifiedActions.length - 1; i >= 0; i--) {
                    const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                    if (!isNullOrUndefined(currentHistory.cellOperation) && currentHistory.cellOperation.length > 0) {
                        operations.push(currentHistory.cellOperation[0]);
                        isSkip = true;
                        currentHistory.cellOperation = [];
                    } else {
                        const operationsCollection: Operation[] = currentHistory.getActionInfo();
                        operations.push(...operationsCollection);
                    }
                }
            } else {
                for (let i: number = 0; i < this.modifiedActions.length; i++) {
                    const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                    if (!isNullOrUndefined(currentHistory.cellOperation) && currentHistory.cellOperation.length > 0) {
                        operations.push(currentHistory.cellOperation[0]);
                        isSkip = true;
                        currentHistory.cellOperation = [];
                    } else {
                        const operationsCollection: Operation[] = currentHistory.getActionInfo();
                        operations.push(...operationsCollection);
                    }
                }
            }
            // if (!isSkip && (action === 'Accept All' || action === 'Reject All')) {
            //     operations.reverse();
            // }
            break;
        }
        case 'Paste':
            for (let i: number = 0; i < this.modifiedActions.length; i++) {
                const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                currentHistory.type = this.type === 'PasteToc' ? this.type : 'Paste';
                const pasteOperations: Operation[] = currentHistory.getActionInfo();
                operations.push(...pasteOperations);
            }
            break;
        case 'TOC':
            if (this.modifiedActions) {
                if (this.editorHistory.isUndoing) {
                    for (let i: number = this.modifiedActions.length - 1; i >= 0; i--) {
                        const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                        currentHistory.type = currentHistory.action === 'Paste' ? 'PasteToc' : undefined;
                        const tocOperations: Operation[] = currentHistory.getActionInfo();
                        operations.push(...tocOperations);
                    }

                } else {
                    for (let i: number = 0; i < this.modifiedActions.length; i++) {
                        const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                        currentHistory.type = currentHistory.action === 'Paste' ? 'PasteToc' : undefined;
                        const tocOperations: Operation[] = currentHistory.getActionInfo();
                        operations.push(...tocOperations);
                    }
                }
            }
            break;
        case 'DragAndDropContent':
            for (let i: number = 0; i < this.modifiedActions.length; i++) {
                const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                currentHistory.type = currentHistory.action === 'Paste' ? 'Paste' : undefined;
                const ddcOperations: Operation[] = currentHistory.getActionInfo();
                operations.push(...ddcOperations);
            }
            break;
        case 'ClearFormat':
            if (this.editorHistory.isUndoing) {
                for (let i: number = 0; i < this.modifiedActions.length; i++) {
                    operations.push(...this.modifiedActions[parseInt(i.toString(), 10)].modifiedFormatOperation);
                    this.modifiedActions[parseInt(i.toString(), 10)].modifiedFormatOperation = [];
                }
            } else {
                const clearHistory: BaseHistoryInfo = this.modifiedActions[this.modifiedActions.length - 1];
                const formatOperation: Operation[] = clearHistory.buildFormatOperation('ClearFormat', true);
                operations = formatOperation.slice();
            }
            break;
        case 'ApplyStyle': {
            let styleHistory: BaseHistoryInfo;
            let formatstyleOperation: Operation[] = [];
            if (this.modifiedActions[0] instanceof HistoryInfo) {
                const historyInfo: HistoryInfo = this.modifiedActions[0] as HistoryInfo;
                styleHistory = historyInfo.modifiedActions[0];
                formatstyleOperation = styleHistory.buildFormatOperation('ClearFormat', true);
                operations = formatstyleOperation.slice();
            }
            if (!(this.modifiedActions[this.modifiedActions.length - 1] instanceof HistoryInfo)) {
                formatstyleOperation = (this.modifiedActions[
                    this.modifiedActions.length - 1] as BaseHistoryInfo).buildFormatOperation(action, true);
                for (let i: number = 0; i < formatstyleOperation.length; i++) {
                    operations.push(formatstyleOperation[parseInt(i.toString(), 10)]);
                }
            }
            break;
        }

        case 'TableMarginsSelection':
            this.modifiedActions[this.modifiedActions.length - 1].createTableFormat(
                this.modifiedActions[this.modifiedActions.length - 1].action);
            this.modifiedActions[this.modifiedActions.length - 1].type = 'TableFormat';
            operations.push(this.modifiedActions[this.modifiedActions.length - 1].getFormatOperation());
            break;
        case 'BordersAndShading':
            if (this.modifiedActions[0].action === 'TableFormat') {
                this.modifiedActions[0].type = 'TableFormat';
                this.modifiedActions[0].createTableFormat('BordersAndShading');
                operations.push(this.modifiedActions[0].getFormatOperation());
            } else {
                this.modifiedActions[0].createCellFormat('BordersAndShading');
                this.modifiedActions[0].type = 'CellFormat';
                operations = this.modifiedActions[0].getSelectedCellOperation('BordersAndShading', undefined, true, true, true);
            }
            break;
        case 'AutoList':
            for (let i: number = 0; i < this.modifiedActions.length; i++) {
                const currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                const autoListOperations: Operation[] = currentHistory.getActionInfo();
                operations.push(...autoListOperations);
            }
            break;
        case 'TableProperties':
            for (let i: number = 0; i < this.modifiedActions.length; i++) {
                const tablePropHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                if (tablePropHistory.action === 'TableFormat') {
                    tablePropHistory.createTableFormat(tablePropHistory.action);
                    tablePropHistory.type = 'TableFormat';
                    operations.push(tablePropHistory.getFormatOperation());
                } else if (tablePropHistory.action === 'RowFormat') {
                    if (this.editorHistory.isUndoing || this.editorHistory.isRedoing &&
                        tablePropHistory.modifiedProperties.length > 1) {
                        operations = tablePropHistory.modifiedFormatOperation;
                        tablePropHistory.modifiedFormatOperation = [];
                    } else {
                        tablePropHistory.createRowFormat(tablePropHistory.action);
                        tablePropHistory.type = 'RowFormat';
                        operations.push(tablePropHistory.getFormatOperation());
                    }
                } else if (tablePropHistory.action === 'CellFormat') {
                    tablePropHistory.createCellFormat(tablePropHistory.action);
                    tablePropHistory.type = 'CellFormat';
                    const cellProp: Operation[] =
                        tablePropHistory.getSelectedCellOperation(tablePropHistory.action, false, false, false, true);
                    for (let i: number = 0; i < cellProp.length; i++) {
                        operations.push(cellProp[parseInt(i.toString(), 10)]);
                    }
                }
            }
            break;
        case 'CellMarginsSelection':
            this.modifiedActions[this.modifiedActions.length - 1].createCellFormat('CellOptions');
            this.modifiedActions[this.modifiedActions.length - 1].type = 'CellFormat';
            operations = this.modifiedActions[this.modifiedActions.length - 1].getSelectedCellOperation('CellOptions', false, false, false, true).slice();
            break;
        }
        return operations;
    }
    public revert(): void {
        this.editorHistory.currentHistoryInfo = this;
        if (this.action === 'BordersAndShading') {
            this.owner.editorModule.isBordersAndShadingDialog = true;
        }
        if (!isNullOrUndefined(this.modifiedActions)) {
            if (this.editorHistory.isUndoing) {
                let i: number = this.modifiedActions.length;
                while (i > 0) {
                    const baseHistoryInfo: BaseHistoryInfo = this.modifiedActions[i - 1];
                    baseHistoryInfo.revert();
                    i = i - 1;
                }
            } else {
                let i: number = 0;
                while (i < this.modifiedActions.length) {
                    const baseHistoryInfo: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                    baseHistoryInfo.revert();
                    i = i + 1;
                }
            }
        }

        if (this.action === 'RestrictEditing') {
            const user: string = this.editRangeStart.user !== '' ? this.editRangeStart.user : this.editRangeStart.group;
            if (this.editorHistory.isUndoing) {
                const index: number = this.owner.documentHelper.editRanges.get(user).indexOf(this.editRangeStart);
                if (index !== -1) {
                    this.owner.documentHelper.editRanges.get(user).splice(index, 1);
                }
            } else {
                this.owner.editorModule.updateRangeCollection(this.editRangeStart, user);
            }
            this.owner.selectionModule.updateEditRangeCollection();
        }
        if (!this.isChildHistoryInfo) {
            this.editorHistory.updateComplexHistory();
        } else {
            this.editorHistory.updateComplexHistoryInternal();
        }
    }
    public destroy(): void {
        if (!isNullOrUndefined(this.modifiedActions)) {
            while (this.modifiedActions.length > 0) {
                const baseHistoryInfo: BaseHistoryInfo = this.modifiedActions[this.modifiedActions.length - 1];
                baseHistoryInfo.destroy();
                this.modifiedActions.splice(this.modifiedActions.indexOf(baseHistoryInfo), 1);
            }
            this.modifiedActions = undefined;
        }
        super.destroy();
    }
}
