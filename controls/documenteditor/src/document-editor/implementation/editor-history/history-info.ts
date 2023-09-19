import { DocumentEditor } from '../../document-editor';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BaseHistoryInfo, MarkerData, Operation } from './base-history-info';
import { CommentCharacterElementBox, EditRangeStartElementBox } from '../viewer/page';
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
     * @private
     */
    public getActionInfo(isInvertOperation?: boolean): Operation[] {
        let action: Action = this.action;
        let operations: Operation[] = [];
        switch (action) {
            case 'InsertBookmark':
            case 'RestrictEditing':
                    for (let i: number = 0; i < this.modifiedActions.length; i++ ) {
                        let currentHistory = this.modifiedActions[parseInt(i.toString(), 10)];
                        if (currentHistory.action === 'DeleteBookmark') {
                            operations.push(currentHistory.getDeleteOperation('DeleteBookmark'));
                            operations.push(currentHistory.getDeleteOperation('DeleteBookmark', true));
                            continue;
                        }
                        operations.push(currentHistory.getInsertOperation(action));
                    }
                break;
            case 'BackSpace':
            case 'Delete':
            case 'RemoveEditRange':
                for (let i:number = 0; i < this.modifiedActions.length; i++) {
                    let currentHistory = this.modifiedActions[parseInt(i.toString(), 10)];
                    if (currentHistory.action === 'InsertInline') {
                        var operation = currentHistory.getInsertOperation('InsertBookmark');
                        operations.push(operation);
                    } else {
                        operations.push(currentHistory.getDeleteOperation(action));
                        if (currentHistory.action === 'RemoveEditRange') {
                            operations.push(currentHistory.getDeleteOperation(action, true));
                        }
                    }
                }
                break;
            case 'PageBreak':
            case 'ColumnBreak':
                if (this.owner.enableTrackChanges) {
                    for (let i:number = 0; i < this.modifiedActions.length; i++) {
                        let currentHistory = this.modifiedActions[parseInt(i.toString(), 10)];
                        if (currentHistory.removedNodes.length > 0) {
                            operations = operations.concat(currentHistory.getDeleteOperationsForTrackChanges());
                        }
                        let markerData: MarkerData = currentHistory.markerData[currentHistory.markerData.length - 1];
                        let operation: Operation = currentHistory.getInsertOperation('Enter');
                        let breakOperation: Operation = this.getInsertOperation(action);
                        operation.markerData = markerData;
                        breakOperation.markerData = this.owner.editor.getMarkerData(undefined, undefined, this.owner.editor.getRevision(markerData.revisionId));
                        operations.push(operation);
                        operations.push(breakOperation);
                        operations.push(operation);
                        operation.markerData.skipOperation = true;
                    }
                } else {
                    for (let i:number = 0; i < this.modifiedActions.length; i++) {
                        let currentHistory = this.modifiedActions[parseInt(i.toString(), 10)];
                        if (currentHistory.removedNodes.length > 0) {
                            operations.push(currentHistory.getDeleteOperation(action));
                        }
                    }
                    operations.push(this.getInsertOperation('Enter'));
                    operations.push(this.getInsertOperation(action));
                    operations.push(this.getInsertOperation('Enter'));
                }
                break;
            case 'InsertHyperlink':
            case 'AutoFormatHyperlink':
            case 'RemoveHyperlink':
                for (var i = 0; i < this.modifiedActions.length; i++) {
                    var currentHistory = this.modifiedActions[parseInt(i.toString(), 10)];
                    if (currentHistory.action === 'InsertInline') {
                        if (currentHistory.insertedText === CONTROL_CHARACTERS.Marker_Start || currentHistory.insertedText === CONTROL_CHARACTERS.Marker_End) {
                            operations.push(currentHistory.getInsertOperation('InsertHyperlink'));
                        } else {
                            operations.push(currentHistory.getInsertOperation('Insert'));
                        }
                    }
                    else if (currentHistory.action === 'Delete') {
                        operations.push(currentHistory.getDeleteOperation(currentHistory.action));
                    }
                }
                break;
            case 'InsertComment':
                for (let i:number = 0; i < this.modifiedActions.length; i++) {
                    let currentHistory = this.modifiedActions[parseInt(i.toString(), 10)];
                    let operation: Operation = currentHistory.getInsertOperation(currentHistory.action);
                    if ((currentHistory.insertedElement instanceof CommentCharacterElementBox && currentHistory.action === 'InsertInline')) {
                        operations.push(currentHistory.getCommentOperation(operation));
                    } else if (currentHistory.action === 'InsertCommentWidget') {
                        operation = this.getUpdateOperation();
                        operations.push(currentHistory.getCommentOperation(operation));
                    }
                }
                break;
            case 'RemoveComment':
                for (let i:number = 0; i < this.modifiedActions.length; i++) {
                    let currentHistory = this.modifiedActions[parseInt(i.toString(), 10)];
                    let operation: Operation = undefined;
                    let operationCollection: Operation[] = [];
                    if (currentHistory.action === 'RemoveInline' && currentHistory.removedNodes[0] instanceof CommentCharacterElementBox) {
                        operation = currentHistory.getDeleteOperation(currentHistory.action);
                        operationCollection.push(currentHistory.getCommentOperation(operation));
                    } else if (currentHistory.action === 'InsertInline' && currentHistory.insertedElement instanceof CommentCharacterElementBox) {
                        operation = currentHistory.getInsertOperation(currentHistory.action);
                        operationCollection.push(currentHistory.getCommentOperation(operation));
                    } else {
                        operationCollection = currentHistory.getActionInfo();
                    }
                    operations = [...operations, ...operationCollection];
                }
                break;
            case 'DeleteComment':
                this.getDeleteCommentOperation(this.modifiedActions, operations);
                break;
            case 'FormField':
                var currentHistory = this.modifiedActions.pop();
                operations = currentHistory.getFieldOperation();
                break;
            case 'IMEInput':
                if (isInvertOperation) {
                    if (this.modifiedActions[0].removedNodes.length > 0) {
                        let removeOperation: Operation = this.modifiedActions[0].getDeleteOperation('Delete');
                        removeOperation.length = removeOperation.text.length;
                        operations.push(removeOperation);
                    }
                    let insertOperation: Operation = this.modifiedActions[this.modifiedActions.length - 1].getInsertOperation('Insert');
                    insertOperation.length = insertOperation.text.length;
                    operations.push(insertOperation);
                    operations.reverse();
                    for (let i = 0; i < operations.length; i++) {
                        let operation: Operation = operations[parseInt(i.toString(), 10)];
                        if (operation.action === 'Insert') {
                            operation.action = 'Delete';
                        } else if (operation.action === 'Delete') {
                            operation.action = 'Insert';
                        }
                    }
                } else {
                    let currentHistory: BaseHistoryInfo = this.modifiedActions[this.modifiedActions.length - 1];
                    if (currentHistory.removedNodes.length > 0) {
                        operations.push(currentHistory.getDeleteOperation(action));
                    }
                    operations.push(currentHistory.getInsertOperation(this.action));
                }
                break;
            case 'Accept All':
            case 'ReplaceAll':
            case 'Reject All':
                let isSkip: boolean = false;
                for (let i = 0; i < this.modifiedActions.length; i++) {
                    let currentHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                    if (!isNullOrUndefined(currentHistory.cellOperation) && currentHistory.cellOperation.length > 0) {
                        operations.push(currentHistory.cellOperation[0]);
                        isSkip = true;
                    } else {
                        let operationsCollection: Operation[] = currentHistory.getActionInfo();
                        operations.push(...operationsCollection);
                    }
                }
                if (!isSkip && (action === 'Accept All' || action === 'Reject All')) {
                    operations.reverse();
                }
                break;
            case 'Paste':
                for (let i: number = 0; i < this.modifiedActions.length; i++) {
                    let currentHistory = this.modifiedActions[parseInt(i.toString(), 10)];
                    currentHistory.type = this.type === 'PasteToc' ? this.type : 'Paste';
                    let pasteOperations = currentHistory.getActionInfo();
                    operations.push(...pasteOperations);
                }
                break;
            case 'TOC':
                for (let i: number = 0; i < this.modifiedActions.length; i++) {
                    let currentHistory = this.modifiedActions[parseInt(i.toString(), 10)];
                    currentHistory.type = currentHistory.action === 'Paste' ? 'PasteToc' : undefined;
                    let tocOperations: Operation[] = currentHistory.getActionInfo();
                    operations.push(...tocOperations);
                }
                break;
            case 'DragAndDropContent':
                for (let i: number = 0; i < this.modifiedActions.length; i++) {
                    let currentHistory = this.modifiedActions[parseInt(i.toString(), 10)];
                    currentHistory.type = currentHistory.action === 'Paste' ? 'Paste' : undefined;
                    let ddcOperations = currentHistory.getActionInfo();
                    operations.push(...ddcOperations);
                }
                break;
            case 'ClearFormat':
                let clearHistory: BaseHistoryInfo = this.modifiedActions[this.modifiedActions.length - 1];
                let formatOperation: Operation[] = clearHistory.buildFormatOperation('ClearFormat', true, false);
                operations = formatOperation.slice();
                break;
            case 'ApplyStyle':
                let styleHistory: BaseHistoryInfo;
                let formatstyleOperation: Operation[] = [];
                if(this.modifiedActions[0] instanceof HistoryInfo) {
                    let historyInfo: HistoryInfo = this.modifiedActions[0] as HistoryInfo;
                    styleHistory = historyInfo.modifiedActions[0];
                    formatstyleOperation = styleHistory.buildFormatOperation('ClearFormat', true, false);
                    operations = formatstyleOperation.slice();
                }
                if(!(this.modifiedActions[this.modifiedActions.length - 1] instanceof HistoryInfo)) {
                    formatstyleOperation = (this.modifiedActions[this.modifiedActions.length - 1] as BaseHistoryInfo).buildFormatOperation(action, true, false);
                    for(let i: number =0; i < formatstyleOperation.length; i++) {
                        operations.push(formatstyleOperation[parseInt(i.toString(), 10)]);
                    }
                }
                break;
            case 'TableMarginsSelection':
                this.modifiedActions[this.modifiedActions.length - 1].createTableFormat(this.modifiedActions[this.modifiedActions.length - 1].action);
                operations.push(this.modifiedActions[this.modifiedActions.length - 1].getFormatOperation());
                break;
            case 'BordersAndShading':
                if (this.modifiedActions[0].action === 'TableFormat') {
                    this.modifiedActions[0].createTableFormat('BordersAndShading');
                    operations.push(this.modifiedActions[0].getFormatOperation());
                } else {
                    this.modifiedActions[0].createCellFormat('BordersAndShading');
                    operations = this.modifiedActions[0].getSelectedCellOperation('BordersAndShading', undefined, true, true);
                }
                break;
            case 'AutoList':
                for (let i: number = 0; i < this.modifiedActions.length; i++) {
                    let currentHistory = this.modifiedActions[parseInt(i.toString(), 10)];
                    let autoListOperations = currentHistory.getActionInfo();
                    operations.push(...autoListOperations);
                }
                break;
            case 'TableProperties':
                for(let i: number = 0; i < this.modifiedActions.length; i++) {
                    let tablePropHistory: BaseHistoryInfo = this.modifiedActions[parseInt(i.toString(), 10)];
                    if(tablePropHistory.action === 'TableFormat') {
                        tablePropHistory.createTableFormat(tablePropHistory.action);
                        operations.push(tablePropHistory.getFormatOperation());
                    } else if(tablePropHistory.action === 'RowFormat') {
                        tablePropHistory.createRowFormat(tablePropHistory.action);
                        operations.push(tablePropHistory.getFormatOperation());
                    } else if(tablePropHistory.action === 'CellFormat') {
                        tablePropHistory.createCellFormat(tablePropHistory.action);
                        let cellProp: Operation[] = tablePropHistory.getSelectedCellOperation(tablePropHistory.action);
                        for(let i:number = 0; i < cellProp.length; i++) {
                            operations.push(cellProp[parseInt(i.toString(), 10)]);
                        }
                    }
                }
                break;
            case 'CellMarginsSelection':
                this.modifiedActions[this.modifiedActions.length - 1].createCellFormat('CellOptions');
                operations = this.modifiedActions[this.modifiedActions.length - 1].getSelectedCellOperation('CellOptions').slice();
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
                this.owner.editor.updateRangeCollection(this.editRangeStart, user);
            }
            this.owner.selection.updateEditRangeCollection();
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
