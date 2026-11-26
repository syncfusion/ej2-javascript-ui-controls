import { EventHandler, isNullOrUndefined, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { IGrid, NotifyArgs, ICommittedAction, ICommittedRecord, BeforeBatchSaveArgs, SaveEventArgs } from '../base/interface';
import * as events from '../base/constant';
import { getObject } from '../base/util';
import { Data } from './data';

/**
 * `UndoRedo` module owns the committed CRUD history of the Grid.
 *
 * An entry is captured only after a CRUD operation has been persisted successfully and the inverse
 * (or the forward) operation is replayed through the regular Grid CRUD path, so the data source
 * stays consistent for both local and remote sources.
 *
 * @hidden
 */
export class UndoRedo {
    protected parent: IGrid;
    /** @hidden */
    public undoStack: ICommittedAction[] = [];
    /** @hidden */
    public redoStack: ICommittedAction[] = [];
    /** @hidden */
    public isReplaying: boolean = false;
    private sequence: number = 0;
    private actionCompleteFunction: Function;
    private actionFailureFunction: Function;
    private keyPressFunction: Function;
    private destroyFunction: Function;
    private cancelBeginFunction: Function;
    private pendingBatchTransaction: ICommittedAction = null;
    private pendingRecords: { [key: string]: Object } = {};
    private pendingRecordTypes: { [key: string]: string } = {};
    private pendingRecordIndexes: { [key: string]: number } = {};
    private replayExpectedAction: string;
    private replayRequestType: string;
    private replayFailed: boolean = false;
    private replayCancelled: boolean = false;

    constructor(parent?: IGrid) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.actionCompleteFunction = this.onActionComplete.bind(this);
        this.actionFailureFunction = this.onActionFailure.bind(this);
        this.destroyFunction = this.destroy.bind(this);
        this.cancelBeginFunction = this.onReplayCancelBegin.bind(this);
        this.parent.on(events.cancelBegin, this.cancelBeginFunction, this);
        this.parent.addEventListener(events.actionComplete, this.actionCompleteFunction);
        this.parent.addEventListener(events.actionFailure, this.actionFailureFunction);
        EventHandler.add(document.body, 'keydown', this.onKeyPressed, this);
        this.parent.addEventListener(events.destroy, this.destroyFunction);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.cancelBegin, this.cancelBeginFunction);
        this.parent.removeEventListener(events.actionComplete, this.actionCompleteFunction);
        this.parent.removeEventListener(events.actionFailure, this.actionFailureFunction);
        EventHandler.remove(document.body, 'keydown', this.onKeyPressed);
        this.parent.removeEventListener(events.destroy, this.destroyFunction);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.clearStacks();
    }

    /**
     * Clears both the undo and the redo stack.
     *
     * @returns {void}
     * @hidden
     */
    public clearStacks(): void {
        this.undoStack = [];
        this.redoStack = [];
        this.pendingBatchTransaction = null;
        this.pendingRecords = {};
        this.pendingRecordTypes = {};
        this.pendingRecordIndexes = {};
    }

    /**
     * Pushes an entry to the given stack and enforces the configured history limit.
     *
     * @param {ICommittedAction[]} stack - The stack to push the entry to.
     * @param {ICommittedAction} action - The entry to push.
     * @returns {void}
     * @hidden
     */
    public pushToStack(stack: ICommittedAction[], action: ICommittedAction): void {
        stack.push(action);
        const limit: number = this.parent.editSettings.undoRedoLimit;
        while (stack.length > limit) {
            stack.shift();
        }
        this.parent.notify(events.toolbarRefresh, {});
    }

    /**
     * Defines whether an undo action is available.
     *
     * @returns {boolean} - True if the undo stack has actions
     * @hidden
     */
    public isUndoStackAvailable(): boolean {
        return this.parent.editSettings.enableUndoRedo && this.undoStack.length > 0;
    }

    /**
     * Defines whether a redo action is available.
     *
     * @returns {boolean} - True if the redo stack has actions
     * @hidden
     */
    public isRedoStackAvailable(): boolean {
        return this.parent.editSettings.enableUndoRedo && this.redoStack.length > 0;
    }

    /**
     * Reverses the most recent committed operation.
     *
     * @returns {void}
     * @hidden
     */
    public undo(): void {
        if (!this.parent.editSettings.enableUndoRedo || this.isReplaying || this.undoStack.length === 0) {
            return;
        }
        if (this.isEditorOpen()) {
            return;
        }
        const action: ICommittedAction = this.undoStack[this.undoStack.length - 1];
        if (!action) {
            return;
        }
        if (action.type === 'batch-transaction') {
            this.replayTransaction(action, true, (succeeded: boolean): void => {
                if (succeeded) {
                    this.undoStack.pop();
                    this.pushToStack(this.redoStack, action);
                }
            });
            return;
        }
        this.replay(action, true, (succeeded: boolean): void => {
            if (succeeded && this.undoStack[this.undoStack.length - 1] === action) {
                this.undoStack.pop();
                this.pushToStack(this.redoStack, action);
            }
        });
    }

    /**
     * Reapplies the most recently undone committed operation.
     *
     * @returns {void}
     * @hidden
     */
    public redo(): void {
        if (!this.parent.editSettings.enableUndoRedo || this.isReplaying || this.redoStack.length === 0) {
            return;
        }
        if (this.isEditorOpen()) {
            return;
        }
        const action: ICommittedAction = this.redoStack[this.redoStack.length - 1];
        if (!action) {
            return;
        }
        if (action.type === 'batch-transaction') {
            this.replayTransaction(action, false, (succeeded: boolean): void => {
                if (succeeded) {
                    this.redoStack.pop();
                    this.pushToStack(this.undoStack, action);
                }
            });
            return;
        }
        this.replay(action, false, (succeeded: boolean): void => {
            if (succeeded) {
                if (this.redoStack[this.redoStack.length - 1] === action) {
                    this.redoStack.pop();
                    this.pushToStack(this.undoStack, action);
                }
            }
        });
    }

    /**
     * Stores the pending Batch transaction so that it can be committed after the save succeeds.
     *
     * @param {ICommittedAction} transaction - The pending Batch transaction.
     * @returns {void}
     * @hidden
     */
    public setPendingBatchTransaction(transaction: ICommittedAction): void {
        this.pendingBatchTransaction = transaction;
    }

    /**
     * Stores the record state before a CRUD operation, so that the entry can be created once the
     * operation has been persisted successfully.
     *
     * @param {Object} record - The record state before the operation.
     * @param {string} type - The kind of the operation: `add`, `edit` or `delete`.
     * @param {number} rowIndex - The index of the record in the data source.
     * @returns {void}
     * @hidden
     */
    public setPendingRecord(record: Object, type: string, rowIndex: number): void {
        const primaryKey: string = this.parent.getPrimaryKeyFieldNames()[0];
        const keyValue: string | number = this.getKeyValue(record, primaryKey);
        const index: number = rowIndex >= 0 ? rowIndex : this.findRecordIndex(keyValue, primaryKey);
        const snapshot: Object = this.cloneRecord(record);
        this.pendingRecords[`${primaryKey}|${keyValue}`] = snapshot;
        this.pendingRecordTypes[`${primaryKey}|${keyValue}`] = type;
        this.pendingRecordIndexes[`${primaryKey}|${keyValue}`] = index;
    }

    /**
     * Determines whether an editor currently owns keyboard or undo/redo input.
     *
     * @returns {boolean} True if an editor is open.
     * @hidden
     */
    public isEditorOpen(): boolean {
        if (this.parent.isEdit) {
            return true;
        }
        const element: HTMLElement = this.parent.element;
        return !!(element.querySelector('.e-editedrow') || element.querySelector('.e-addedrow') ||
            element.querySelector('.e-dlgeditrow'));
    }

    private onActionComplete(args: NotifyArgs): void {
        if (!args || this.isReplaying || !this.parent.editSettings.enableUndoRedo) {
            return;
        }
        const requestType: string = args.requestType;
        if (requestType === 'save') {
            this.captureSave(args);
        } else if (requestType === 'delete') {
            this.captureDelete(args);
        } else if (requestType === 'batchsave') {
            this.commitPendingBatchTransaction();
        }
    }

    private onActionFailure(args: NotifyArgs): void {
        if (this.isReplaying && (!args || args.requestType === this.replayRequestType)) {
            this.replayFailed = true;
        }
        if (!args) {
            return;
        }
        if (args.requestType === 'batchsave') {
            this.pendingBatchTransaction = null;
        } else if (args.requestType === 'save' || args.requestType === 'delete') {
            const primaryKey: string = this.parent.getPrimaryKeyFieldNames()[0];
            const data: Object = (args as { data?: Object }).data;
            const records: Object[] = Array.isArray(data) ? data as Object[] : [data];
            if (primaryKey) {
                for (let i: number = 0; i < records.length; i++) {
                    const keyValue: string | number = this.getKeyValue(records[parseInt(i.toString(), 10)], primaryKey);
                    if (!isNullOrUndefined(keyValue)) {
                        this.clearPendingRecord(primaryKey, keyValue);
                    }
                }
            }
        }
    }

    private onReplayCancelBegin(args: NotifyArgs): void {
        if (!this.isReplaying || !args) {
            return;
        }
        const isDelete: boolean = this.replayExpectedAction === 'delete' && args.requestType === 'delete';
        const isSave: boolean = this.replayExpectedAction !== 'delete' && args.action === this.replayExpectedAction;
        if (isDelete || isSave) {
            this.replayCancelled = true;
        }
    }

    private clearPendingRecord(primaryKey: string, keyValue: string | number): void {
        const pendingKey: string = `${primaryKey}|${keyValue}`;
        // The key is composed from the configured primary key and its record value.
        // eslint-disable-next-line security/detect-object-injection
        delete this.pendingRecords[pendingKey];
        // eslint-disable-next-line security/detect-object-injection
        delete this.pendingRecordTypes[pendingKey];
        // eslint-disable-next-line security/detect-object-injection
        delete this.pendingRecordIndexes[pendingKey];
    }

    private onKeyPressed(e: KeyboardEventArgs): void {
        if (!e || this.parent.editSettings.mode === 'Batch' ||
            !this.parent.editSettings.enableUndoRedo || this.isEditorOpen()) {
            return;
        }
        if (this.isComposing(e)) {
            return;
        }
        const isMacLike: boolean = /(Mac)/i.test(navigator.platform);
        const key: string = (e.key || '').toLowerCase();
        const modifierPressed: boolean = isMacLike ? e.metaKey : e.ctrlKey;
        const isUndo: boolean = (modifierPressed && key === 'z' && !e.shiftKey) ||
            (!isMacLike && e.action === 'ctrlPlusZ') || (isMacLike && e.action === 'cmdPlusZ');
        const isRedo: boolean = (!isMacLike && modifierPressed && key === 'y' && !e.shiftKey) ||
            (modifierPressed && key === 'z' && e.shiftKey) ||
            (!isMacLike && e.action === 'ctrlPlusY') || (isMacLike && e.action === 'cmdShiftPlusZ');
        if (isUndo) {
            e.preventDefault();
            this.parent.undoEdit();
        } else if (isRedo) {
            e.preventDefault();
            this.parent.redoEdit();
        }
    }

    private isComposing(e: KeyboardEventArgs): boolean {
        const event: Object = getObject('originalEvent', e) || e;
        return getObject('isComposing', event) === true;
    }

    private getKeyValue(record: Object, primaryKey: string): string | number {
        if (!record || !primaryKey) {
            return undefined;
        }
        const value: Object = getObject(primaryKey, record);
        return (typeof value === 'number' || typeof value === 'string') ? value : undefined;
    }

    private findRecordIndex(keyValue: string | number, primaryKey: string): number {
        const records: Object[] = this.parent.getCurrentViewRecords();
        for (let i: number = 0; i < records.length; i++) {
            if (this.getKeyValue(records[parseInt(i.toString(), 10)], primaryKey) === keyValue) {
                return i;
            }
        }
        return -1;
    }

    private captureSave(args: SaveEventArgs): void {
        const primaryKey: string = this.parent.getPrimaryKeyFieldNames()[0];
        const data: Object = (args as { data?: Object }).data;
        const keyValue: string | number = this.getKeyValue(data, primaryKey);
        const pendingKey: string = `${primaryKey}|${keyValue}`;
        // The key is composed from the configured primary key and its record value.
        // eslint-disable-next-line security/detect-object-injection
        const previousRecord: Object = this.pendingRecords[pendingKey];
        // eslint-disable-next-line security/detect-object-injection
        const pendingType: string = this.pendingRecordTypes[pendingKey];
        // eslint-disable-next-line security/detect-object-injection
        const pendingIndex: number = this.pendingRecordIndexes[pendingKey];
        this.clearPendingRecord(primaryKey, keyValue);
        if (!pendingType) {
            return;
        }
        if (pendingType === 'edit' && this.isSameRecord(previousRecord, data)) {
            return;
        }
        const entry: ICommittedAction = {
            type: pendingType === 'add' ? 'row-add' : 'cell-edit',
            primaryKey: primaryKey,
            keyValue: keyValue,
            rowIndex: isNullOrUndefined(pendingIndex) ? this.findRecordIndex(keyValue, primaryKey) : pendingIndex,
            field: args.columnName,
            previousRecord: previousRecord ? this.cloneRecord(previousRecord) : undefined,
            newRecord: this.cloneRecord(data),
            sequence: ++this.sequence
        };
        this.pushToStack(this.undoStack, entry);
        this.redoStack = [];
        this.parent.notify(events.toolbarRefresh, {});
    }

    private captureDelete(args: NotifyArgs): void {
        const primaryKey: string = this.parent.getPrimaryKeyFieldNames()[0];
        const deleted: Object[] = ((args as { data?: Object[] }).data) || [];
        for (let i: number = 0; i < deleted.length; i++) {
            const record: Object = deleted[parseInt(i.toString(), 10)];
            const keyValue: string | number = this.getKeyValue(record, primaryKey);
            if (isNullOrUndefined(keyValue)) {
                continue;
            }
            const pendingKey: string = `${primaryKey}|${keyValue}`;
            // The key is composed from the configured primary key and its record value.
            // eslint-disable-next-line security/detect-object-injection
            const pendingIndex: number = this.pendingRecordIndexes[pendingKey];
            const index: number = isNullOrUndefined(pendingIndex) ? this.findRecordIndex(keyValue, primaryKey) : pendingIndex;
            this.clearPendingRecord(primaryKey, keyValue);
            const entry: ICommittedAction = {
                type: 'row-delete',
                primaryKey: primaryKey,
                keyValue: keyValue,
                rowIndex: index,
                previousRecord: this.cloneRecord(record),
                newRecord: undefined,
                sequence: ++this.sequence
            };
            this.pushToStack(this.undoStack, entry);
        }
        if (deleted.length) {
            this.redoStack = [];
            this.parent.notify(events.toolbarRefresh, {});
        }
    }

    private commitPendingBatchTransaction(): void {
        const transaction: ICommittedAction = this.pendingBatchTransaction;
        this.pendingBatchTransaction = null;
        if (!transaction || !this.parent.editSettings.enableUndoRedo) {
            return;
        }
        transaction.sequence = ++this.sequence;
        this.pushToStack(this.undoStack, transaction);
        this.redoStack = [];
        this.parent.notify(events.toolbarRefresh, {});
    }

    private isSameRecord(previousRecord: Object, newRecord: Object): boolean {
        const previous: Object = previousRecord;
        const current: Object = newRecord;
        if (!previous || !current) {
            return false;
        }
        const keys: string[] = Object.keys(current);
        for (let i: number = 0; i < keys.length; i++) {
            const key: string = keys[parseInt(i.toString(), 10)];
            const before: Object = getObject(key, previous);
            const after: Object = getObject(key, current);
            if (before instanceof Date && after instanceof Date) {
                if (before.getTime() !== after.getTime()) {
                    return false;
                }
            } else if (before !== after) {
                return false;
            }
        }
        return true;
    }

    private replay(action: ICommittedAction, isUndo: boolean, complete: (succeeded: boolean) => void): void {
        this.isReplaying = true;
        this.replayExpectedAction = action.type === 'row-add' ? (isUndo ? 'delete' : 'add') :
            (action.type === 'row-delete' ? (isUndo ? 'add' : 'delete') : 'edit');
        this.replayRequestType = this.replayExpectedAction === 'delete' ? 'delete' : 'save';
        this.replayFailed = false;
        this.replayCancelled = false;
        this.replayRecord(action, isUndo).then((): void => {
            if (this.replayCancelled) {
                this.parent.trigger(events.actionFailure, {
                    error: new Error('The undo/redo operation was cancelled.'),
                    requestType: this.replayRequestType
                });
            }
            this.finishReplay(!this.replayFailed && !this.replayCancelled, complete);
        }, (error: Error): void => {
            if (!this.replayFailed) {
                this.parent.trigger(events.actionFailure, { error: error, requestType: this.replayRequestType });
            }
            this.finishReplay(false, complete);
        });
    }

    private finishReplay(succeeded: boolean, complete: (succeeded: boolean) => void): void {
        this.isReplaying = false;
        this.replayExpectedAction = null;
        this.replayRequestType = null;
        complete(succeeded);
        this.parent.notify(events.toolbarRefresh, {});
    }

    private replayTransaction(action: ICommittedAction, isUndo: boolean, complete: (succeeded: boolean) => void): void {
        const changed: ICommittedRecord[] = action.changedRecords;
        const added: ICommittedRecord[] = action.addedRecords;
        const deleted: ICommittedRecord[] = action.deletedRecords;
        const records: ICommittedRecord[] = action.records || changed.concat(added, deleted);
        const changes: { changedRecords: Object[], addedRecords: Object[], deletedRecords: Object[] } = {
            changedRecords: [], addedRecords: [], deletedRecords: []
        };
        for (let i: number = 0; i < records.length; i++) {
            const record: ICommittedRecord = records[parseInt(i.toString(), 10)];
            if (record.changeType === 'changed') {
                changes.changedRecords.push(isUndo ? record.previousRecord : record.newRecord);
            } else if ((record.changeType === 'added') !== isUndo) {
                changes.addedRecords.push(record.newRecord || record.previousRecord);
            } else {
                changes.deletedRecords.push(record.newRecord || record.previousRecord);
            }
        }
        const beforeBatchSaveArgs: BeforeBatchSaveArgs = { batchChanges: changes, cancel: false };
        this.isReplaying = true;
        this.parent.trigger(events.beforeBatchSave, beforeBatchSaveArgs, (args: BeforeBatchSaveArgs): void => {
            if (args.cancel) {
                this.isReplaying = false;
                this.parent.trigger(events.actionFailure, {
                    error: new Error('The Batch undo/redo operation was cancelled.'),
                    requestType: 'batchsave'
                });
                complete(false);
                return;
            }
            const replayNext: (index: number) => void = (index: number): void => {
                if (index >= records.length) {
                    this.isReplaying = false;
                    this.parent.refresh();
                    this.parent.notify(events.toolbarRefresh, {});
                    complete(true);
                    return;
                }
                Promise.resolve().then(() => this.replayCommittedRecord(records[parseInt(index.toString(), 10)], isUndo)).then(() => {
                    replayNext(index + 1);
                }, (error: Error) => {
                    this.isReplaying = false;
                    this.parent.refresh();
                    this.parent.trigger(events.actionFailure, { error: error, requestType: 'batchsave' });
                    complete(false);
                });
            };
            replayNext(0);
        });
    }

    private replayCommittedRecord(record: ICommittedRecord, isUndo: boolean): Promise<void> {
        const primaryKey: string = record.primaryKey;
        const keyValue: string | number = record.keyValue;
        const dataModule: Data = this.parent.getDataModule();
        const query: Query = dataModule.generateQuery();
        const dataManager: DataManager = dataModule.dataManager;
        if (record.changeType === 'added') {
            return isUndo ?
                Promise.resolve(dataManager.remove(primaryKey, keyValue, query.fromTable, query)).then(() => undefined) :
                Promise.resolve(dataManager.insert(record.newRecord, query.fromTable, query, record.rowIndex)).then(() => undefined);
        }
        if (record.changeType === 'deleted') {
            return isUndo ?
                Promise.resolve(dataManager.insert(record.previousRecord, query.fromTable, query, record.rowIndex)).then(() => undefined) :
                Promise.resolve(dataManager.remove(primaryKey, keyValue, query.fromTable, query)).then(() => undefined);
        }
        const target: Object = isUndo ? record.previousRecord : record.newRecord;
        const previousRecord: Object = isUndo ? record.newRecord : record.previousRecord;
        return Promise.resolve(dataManager.update(primaryKey, target, query.fromTable, query, previousRecord)).then(() => undefined);
    }

    private replayRecord(action: ICommittedAction, isUndo: boolean): Promise<void> {
        if (action.type === 'row-add') {
            return isUndo ? this.deleteRecordAsync(action.primaryKey, action.newRecord) :
                this.addRecordAsync(action.newRecord, action.rowIndex);
        }
        if (action.type === 'row-delete') {
            return isUndo ? this.addRecordAsync(action.previousRecord, action.rowIndex) :
                this.deleteRecordAsync(action.primaryKey, action.previousRecord);
        }
        const index: number = this.findRecordIndex(action.keyValue, action.primaryKey);
        return this.updateRowAsync(index, isUndo ? action.previousRecord : action.newRecord);
    }

    private addRecordAsync(record: Object, index: number): Promise<void> {
        return this.parent.addRecordAsync(this.cloneRecord(record), index > -1 ? index : 0);
    }

    private deleteRecordAsync(primaryKey: string, record: Object): Promise<void> {
        return this.parent.deleteRecordAsync(primaryKey, this.cloneRecord(record));
    }

    private updateRowAsync(index: number, record: Object): Promise<void> {
        const viewRecords: Object[] = this.parent.getCurrentViewRecords();
        const args: SaveEventArgs = {
            requestType: 'save',
            action: 'edit',
            data: this.cloneRecord(record),
            previousData: viewRecords[parseInt(index.toString(), 10)],
            cancel: false
        };
        return new Promise<void>((resolve: () => void, reject: (reason?: Error) => void): void => {
            this.parent.trigger(events.actionBegin, args, (actionArgs: SaveEventArgs): void => {
                if (actionArgs.cancel) {
                    this.replayCancelled = true;
                    resolve();
                    return;
                }
                this.parent.updateRowAsync(index, this.cloneRecord(actionArgs.data || record)).then(resolve, reject);
            });
        });
    }

    /**
     * Creates a deep copy of the given value. Plain objects and arrays are copied recursively and
     * `Date` instances are copied by value. Every other value is retained by reference.
     *
     * @param {Object} value - The value to copy.
     * @returns {Object} The copied value.
     * @hidden
     */
    public cloneRecord(value: Object): Object {
        if (isNullOrUndefined(value)) {
            return value;
        }
        const structuredCloneFunction: (value: Object) => Object =
            typeof window !== 'undefined' ? getObject('structuredClone', window) : undefined;
        if (typeof structuredCloneFunction === 'function') {
            try {
                return structuredCloneFunction.call(window, value);
            } catch (error) {
                if (getObject('name', error) !== 'DataCloneError') {
                    throw error;
                }
            }
        }
        return this.manualClone(value);
    }

    private manualClone(value: Object): Object {
        if (value === null || typeof value !== 'object') {
            return value;
        }
        if (value instanceof Date) {
            return new Date(value.getTime());
        }
        if (Array.isArray(value)) {
            const result: Object[] = [];
            for (let i: number = 0; i < value.length; i++) {
                result.push(this.manualClone(value[parseInt(i.toString(), 10)]));
            }
            return result;
        }
        const prototype: Object = Object.getPrototypeOf(value);
        if (prototype !== Object.prototype && prototype !== null) {
            return value;
        }
        const result: { [key: string]: Object } = {};
        const keys: string[] = Object.keys(value);
        for (let i: number = 0; i < keys.length; i++) {
            const key: string = keys[parseInt(i.toString(), 10)];
            // defineProperty copies own keys without invoking setters such as __proto__.
            Object.defineProperty(result, key, {
                value: this.manualClone(getObject(key, value)),
                enumerable: true,
                configurable: true,
                writable: true
            });
        }
        return result;
    }
}
