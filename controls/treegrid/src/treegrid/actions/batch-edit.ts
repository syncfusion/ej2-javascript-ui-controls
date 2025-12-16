import { ITreeData } from '../base/interface';
import { isNullOrUndefined, extend, setValue, getValue } from '@syncfusion/ej2-base';
import { TreeGrid } from '../base';
import * as events from '../base/constant';
import { DataManager } from '@syncfusion/ej2-data';
import { findChildrenRecords, getParentData, extendArray } from '../utils';
import { BeforeBatchSaveArgs, getUid, CellSaveArgs, NotifyArgs, Column, Row, BatchChanges, BeforeBatchDeleteArgs, CellFocusArgs } from '@syncfusion/ej2-grids';
import { BatchAddArgs, BeforeBatchAddArgs } from '@syncfusion/ej2-grids';
import { updateParentRow, editAction } from './crud-actions';
import { FocusStrategy } from '@syncfusion/ej2-grids/src/grid/services/focus-strategy';
import { classList } from '@syncfusion/ej2-base';
import { RowPosition } from '../enum';

/**
 * `BatchEdit` module is used to handle batch editing actions.
 *
 * @hidden
 */
export class BatchEdit {
    private parent: TreeGrid;
    private isSelfReference: boolean;
    private addRowRecord: ITreeData;
    private batchChildCount: number = 0;
    private addedRecords: string = 'addedRecords';
    private deletedRecords: string = 'deletedRecords';
    private matrix: Object[];
    private batchRecords: Object[];
    private currentViewRecords: Object[];
    private batchAddedRecords: Object[] = [];
    private batchDeletedRecords: Object[] = [];
    private batchIndex: number;
    private batchAddRowRecord: Object[] = [];
    private isAdd: boolean;
    private newBatchRowAdded: boolean;
    private selectedIndex: number;
    private addRowIndex: number;

    constructor(parent: TreeGrid) {
        this.parent = parent;
        this.isSelfReference = !isNullOrUndefined(parent.parentIdMapping);
        this.batchRecords = [];
        this.currentViewRecords = [];
        this.isAdd = false;
        this.addEventListener();
    }

    public addEventListener(): void {
        this.parent.on(events.cellSaved, this.cellSaved, this);
        this.parent.on(events.batchAdd, this.batchAdd, this);
        this.parent.on(events.beforeBatchAdd, this.beforeBatchAdd, this);
        this.parent.on(events.batchSave, this.batchSave, this);
        this.parent.on(events.beforeBatchDelete, this.beforeBatchDelete, this);
        this.parent.on(events.beforeBatchSave, this.beforeBatchSave, this);
        this.parent.on('batchPageAction', this.batchPageAction, this);
        this.parent.on('batchCancelAction', this.batchCancelAction, this);
        this.parent.grid.on('immutable-batch-cancel', this.immutableBatchAction, this);
        this.parent.grid.on('next-cell-index', this.nextCellIndex, this);
        this.parent.grid.on('cellfocused', this.onCellFocused, this);
    }
    /**
     * @hidden
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.cellSaved, this.cellSaved);
        this.parent.off(events.batchAdd, this.batchAdd);
        this.parent.off(events.batchSave, this.batchSave);
        this.parent.off(events.beforeBatchAdd, this.beforeBatchAdd);
        this.parent.off(events.beforeBatchDelete, this.beforeBatchDelete);
        this.parent.off(events.beforeBatchSave, this.beforeBatchSave);
        this.parent.off('batchPageAction', this.batchPageAction);
        this.parent.off('batchCancelAction', this.batchCancelAction);
        this.parent.grid.off('immutable-batch-cancel', this.immutableBatchAction);
        this.parent.grid.off('next-cell-index', this.nextCellIndex);
        this.parent.grid.off('cellfocused', this.onCellFocused);
    }
    /**
     * To destroy the editModule
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }
    /**
     * @hidden
     * @returns {Object[]} Returns modified records in batch editing.
     */
    public getBatchRecords(): Object[] {
        return this.batchRecords;
    }
    /**
     * @hidden
     * @returns {number} Returns index of newly add row
     */
    public getAddRowIndex(): number {
        return this.addRowIndex;
    }
    /**
     * @hidden
     * @returns {number} Returns selected row index
     */
    public getSelectedIndex(): number {
        return this.selectedIndex;
    }
    /**
     * @hidden
     * @returns {number} Returns newly added child count
     */
    public getBatchChildCount(): number {
        return this.batchChildCount;
    }
    private batchPageAction(): void {
        const data: Object[] = <Object[]>(this.parent.grid.dataSource instanceof DataManager ?
            this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
        const primaryKeyField: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
        let index: number;
        if (!isNullOrUndefined(this.batchAddedRecords) && this.batchAddedRecords.length) {
            for (let i: number = 0; i < this.batchAddedRecords.length; i++) {
                index = data.findIndex((e: Object) => { return e[`${primaryKeyField}`] === this.batchAddedRecords[parseInt(i.toString(), 10)][`${primaryKeyField}`]; });
                data.splice(index, 1);
            }
        }
        this.batchAddedRecords = this.batchRecords = this.batchAddRowRecord = this.batchDeletedRecords = this.currentViewRecords = [];
    }
    private cellSaved(args: CellSaveArgs): void {
        const actualCellIndex: number = args.column.index;
        if (actualCellIndex === this.parent.treeColumnIndex) {
            this.parent.renderModule.cellRender({ data: args.rowData, cell: args.cell,
                column: this.parent.grid.getColumnByIndex(args.column.index)
            });
        }
        if (this.isAdd && this.parent.editSettings.mode === 'Batch' && this.parent.editSettings.newRowPosition !== 'Bottom') {
            const data: Object[] = <Object[]>(this.parent.grid.dataSource instanceof DataManager ?
                this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
            let added: ITreeData; const level: string = 'level';
            const primaryKey: string = this.parent.grid.getPrimaryKeyFieldNames()[0]; let currentDataIndex: number;
            let indexvalue: number;
            const parentItem: string = 'parentItem'; const uniqueID: string = 'uniqueID';
            const parentRecord: ITreeData = this.selectedIndex > -1 ? this.batchRecords[parseInt(this.addRowIndex.toString(), 10)][`${parentItem}`] : null;
            let idMapping: Object; let parentUniqueID: string; let parentIdMapping: string;
            let rowObjectIndex: number = this.parent.editSettings.newRowPosition === 'Top' || this.selectedIndex === -1 ? 0 :
                this.parent.editSettings.newRowPosition === 'Above' ? this.addRowIndex
                    : this.addRowIndex + 1;
            rowObjectIndex = this.getActualRowObjectIndex(rowObjectIndex);
            if (this.newBatchRowAdded) {
                if (this.batchRecords.length) {
                    idMapping = this.batchRecords[this.addRowIndex][this.parent.idMapping];
                    parentIdMapping = this.batchRecords[this.addRowIndex][this.parent.parentIdMapping];
                    if (this.batchRecords[parseInt(this.addRowIndex.toString(), 10)][`${parentItem}`]) {
                        parentUniqueID = this.batchRecords[parseInt(this.addRowIndex.toString(), 10)][`${parentItem}`][`${uniqueID}`];
                    }
                }
                this.batchAddedRecords = extendArray(this.batchAddedRecords);
                this.batchAddRowRecord = extendArray(this.batchAddRowRecord);
                this.batchAddRowRecord.push(this.batchRecords[this.addRowIndex]);
                added = this.parent.grid.getRowsObject()[parseInt(rowObjectIndex.toString(), 10)].changes;
                if (!isNullOrUndefined(added)) {
                    added.uniqueID = getUid(this.parent.element.id + '_data_');
                    setValue('uniqueIDCollection.' + added.uniqueID, added, this.parent);
                    if (!Object.prototype.hasOwnProperty.call(added, 'level')) {
                        this.batchIndex = this.selectedIndex === -1 ? 0 : this.batchIndex;
                        if (this.parent.editSettings.newRowPosition === 'Child') {
                            added.primaryParent = parentRecord;
                            if (this.selectedIndex > -1) {
                                added.parentItem = extend({}, this.batchRecords[this.addRowIndex]);
                                added.parentUniqueID = added.parentItem.uniqueID;
                                delete added.parentItem.childRecords; delete added.parentItem[this.parent.childMapping];
                                added.level = added.parentItem.level + 1; added.index = this.batchIndex;
                                const childRecordCount: number = findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                                let record: ITreeData = findChildrenRecords(this.batchRecords[this.addRowIndex])[childRecordCount - 1];
                                record = isNullOrUndefined(record) ? this.batchRecords[this.addRowIndex] : record;
                                currentDataIndex = data.map((e: Object) => { return e[`${primaryKey}`]; }).indexOf(record[`${primaryKey}`]);
                                if (this.isSelfReference) {
                                    added[this.parent.parentIdMapping] = idMapping;
                                }
                                updateParentRow(primaryKey, added.parentItem, 'add', this.parent, this.isSelfReference, added);
                            }
                        } else if ((this.parent.editSettings.newRowPosition === 'Above' || this.parent.editSettings.newRowPosition === 'Below')
                            && !isNullOrUndefined(this.batchRecords[this.addRowIndex])) {
                            added.level = this.batchRecords[parseInt(this.addRowIndex.toString(), 10)][`${level}`];
                            if (added.level && this.selectedIndex > -1) {
                                added.parentItem = parentRecord; added.parentUniqueID = parentUniqueID;
                                delete added.parentItem.childRecords; delete added.parentItem[this.parent.childMapping];
                            }
                            added.index = this.parent.editSettings.newRowPosition === 'Below' ? this.batchIndex : this.batchIndex - 1;
                            if (this.parent.editSettings.newRowPosition === 'Below' && this.selectedIndex > -1) {
                                const childRecordCount: number = findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                                let record: ITreeData = findChildrenRecords(this.batchRecords[this.addRowIndex])[childRecordCount - 1];
                                record = isNullOrUndefined(record) ? this.batchRecords[this.addRowIndex] : record;
                                currentDataIndex = data.map((e: Object) => { return e[`${primaryKey}`]; }).indexOf(record[`${primaryKey}`]);
                            }
                            if (this.parent.editSettings.newRowPosition === 'Above' && this.selectedIndex > -1) {
                                const record: ITreeData = this.batchRecords[this.addRowIndex];
                                currentDataIndex = data.map((e: Object) => { return e[`${primaryKey}`]; }).indexOf(record[`${primaryKey}`]);
                            }
                            if (this.isSelfReference) {
                                added[this.parent.parentIdMapping] = parentIdMapping;
                            }
                        }
                        added.index = added.index === -1 ? 0 : added.index;
                        added.hasChildRecords = false; added.childRecords = [];
                        this.batchRecords.splice(added.index, 0, added);
                        this.currentViewRecords.splice(added.index, 0, added);
                        if (currentDataIndex) {
                            indexvalue = currentDataIndex;
                        } else { indexvalue = added.index; }
                        if (this.parent.editSettings.newRowPosition !== 'Above') {
                            indexvalue = added.index === 0 ? indexvalue : indexvalue + 1;
                        }
                        data.splice(indexvalue, 0, added);
                        this.batchAddedRecords.push(added);
                    }
                }
                this.parent.grid.getRowsObject()[parseInt(rowObjectIndex.toString(), 10)].data = added;
                this.newBatchRowAdded = false;
            }
        }
    }

    private beforeBatchAdd(e: BeforeBatchAddArgs): void {
        const isTabLastRow: string = 'isTabLastRow';
        if (this.parent.editSettings.mode === 'Cell' && this.parent.editModule[`${isTabLastRow}`]) {
            e.cancel = true;
            this.parent.editModule[`${isTabLastRow}`] = false;
            return;
        }
        if (this.parent.editModule['isAddedRowByMethod'] && !isNullOrUndefined(this.parent.editModule['addRowIndex']) &&
        !this.parent.editModule['isAddedRowByContextMenu'] && (this.parent.grid.selectedRowIndex === -1 || this.parent.editModule['batchEditModule'].isAdd)) {
            this.selectedIndex = this.parent.editModule['selectedIndex'];
            this.addRowIndex = this.parent.editModule['addRowIndex'];
            this.addRowRecord = this.batchRecords.length ? this.batchRecords[this.selectedIndex]
                : this.parent.getCurrentViewRecords()[this.selectedIndex];
        }
        else {
            this.selectedIndex = this.parent.grid.selectedRowIndex;
            this.addRowIndex = this.parent.grid.selectedRowIndex > -1 ? this.parent.grid.selectedRowIndex : 0;
            this.parent.editModule['addRowIndex'] = this.parent.grid.selectedRowIndex > -1 ? this.parent.grid.selectedRowIndex : 0;
            this.addRowRecord = this.parent.getSelectedRecords()[0];
        }
    }

    private batchAdd(e: BatchAddArgs): void {
        if (this.parent.editSettings.newRowPosition !== 'Bottom') {
            this.isAdd = true; this.newBatchRowAdded = true; let actualIndex: number = 0;
            if (!this.batchRecords.length) {
                this.batchAddedRecords = [];
                this.batchRecords = extendArray(this.parent.grid.getCurrentViewRecords());
                this.currentViewRecords = extendArray(this.parent.grid.getCurrentViewRecords());
            }
            if (this.parent.editModule['isAddedRowByMethod'] && !isNullOrUndefined(this.parent.editModule['addRowIndex'])) {
                classList(this.parent.grid.getDataRows()[0], ['e-batchrow'], []);
            }
            if (this.parent.editSettings.newRowPosition !== 'Top') {
                let records: Object[] = this.parent.grid.getCurrentViewRecords();
                if (this.parent.editSettings.mode === 'Batch' && (this.parent.getBatchChanges()[this.addedRecords].length > 1
              || this.parent.getBatchChanges()[this.deletedRecords].length)) {
                    records = this.batchRecords;
                }
                this.updateChildCount(records);
                this.parent.notify(events.beginAdd, {});
                this.batchChildCount = 0;
            }
            this.updateRowIndex();
            // update focus module, need to refix this once grid source modified.
            const focusModule: FocusStrategy = getValue('focusModule', this.parent.grid);
            const table: Element = this.parent.getContentTable();
            if (this.parent.getBatchChanges()[this.deletedRecords].length && this.parent.editSettings.newRowPosition === 'Above') {
                actualIndex = (e.row as HTMLTableRowElement).rowIndex;
                focusModule.getContent().matrix.matrix = this.matrix as number[][];
            } else {
                if (this.parent.frozenRows) {
                    actualIndex = this.batchIndex;
                }else if (this.parent.editModule.isAddedMultipleRowsByMethod) {
                    actualIndex = (e as any).index;
                }else {
                    actualIndex = (table.getElementsByClassName('e-batchrow')[0] as HTMLTableRowElement).rowIndex;
                }
            // if (this.parent.frozenRows || this.parent.frozenColumns) {
            //   actualIndex = this.batchIndex;
            // }
            }
            focusModule.getContent().matrix.current = [actualIndex, focusModule.getContent().matrix.current[1]];
            if (this.parent.editModule['isAddedRowByMethod'] && !isNullOrUndefined(this.parent.editModule['addRowIndex']) &&
            !this.parent.editModule['isAddedRowByContextMenu'] && !this.parent.editModule.isAddedMultipleRowsByMethod) {
                const newlyAddedRecords: ITreeData[] = this.parent.getBatchChanges()['addedRecords'];
                const index: number = parseInt(this.parent.getContentTable().getElementsByClassName('e-insertedrow')[newlyAddedRecords.length - 1].getAttribute('aria-rowindex'), 10) - 1;
                this.batchRecords.splice(index, 0, newlyAddedRecords[newlyAddedRecords.length - 1]);
            }
        }
    }
    private beforeBatchDelete(args?: BeforeBatchDeleteArgs): void {
        if (!this.batchRecords.length) {
            this.batchRecords  = extendArray(this.parent.grid.getCurrentViewRecords());
            this.currentViewRecords = extendArray(this.parent.grid.getCurrentViewRecords());
        }
        const focusModule: FocusStrategy = getValue('focusModule', this.parent.grid);
        this.matrix = focusModule.getContent().matrix.matrix;
        const row: Element[] = []; let records: ITreeData[] = [];
        const primarykey: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
        let data: ITreeData;
        let childs: ITreeData[];
        let uid: string;
        const rowElement: Element = Array.isArray(args.row) ? args.row[0] : args.row;
        if (!isNullOrUndefined(rowElement) && this.parent.getSelectedRows().indexOf(rowElement) === -1) {
            data = args.rowData;
            childs = findChildrenRecords(data);
            uid = rowElement.getAttribute('data-uid');
        }
        else {
            data = this.parent.grid.getSelectedRecords()[this.parent.grid.getSelectedRecords().length - 1];
            childs = findChildrenRecords(data);
            uid = this.parent.getSelectedRows()[0].getAttribute('data-uid');
        }
        const parentRowIndex: number = parseInt(this.parent.grid.getRowElementByUID(uid).getAttribute('aria-rowindex'), 10) - 1;
        if (childs.length){
            const totalCount: number = parentRowIndex + childs.length; const firstChildIndex: number = parentRowIndex + 1;
            for (let i: number = firstChildIndex; i <= totalCount; i++) {
                row.push(this.parent.grid.getDataRows()[parseInt(i.toString(), 10)] as Element);
                if (this.parent.frozenRows || this.parent.frozenColumns || this.parent.getFrozenColumns()) {
                    row.push(this.parent.grid.getHeaderContent()[parseInt(i.toString(), 10)] as Element);
                }
            }
        }
        if (!isNullOrUndefined(data.parentItem)) {
            const parentItem: ITreeData = getParentData(this.parent, data.parentItem.uniqueID);
            if (!isNullOrUndefined(parentItem) && parentItem.hasChildRecords) {
                const childIndex: number = parentItem.childRecords.indexOf(data);
                parentItem.childRecords.splice(childIndex, 1);
            }
            this.batchDeletedRecords = extendArray(this.batchDeletedRecords);
            this.batchDeletedRecords.push(data);
        }
        childs.push(data);
        records = childs;
        for (let i: number = 0; i < records.length; i++) {
            const indexvalue: number = this.batchRecords.findIndex((e: Object) => { return e[`${primarykey}`] === records[parseInt(i.toString(), 10)][`${primarykey}`]; });
            if (indexvalue !== -1) {
                this.batchRecords.splice(indexvalue , 1);
            }
        }
        for (let i: number = 0; i < row.length; i++) {
            if (!isNullOrUndefined(row[parseInt(i.toString(), 10)])) {
                this.parent.grid.selectionModule.selectedRecords.push(row[parseInt(i.toString(), 10)]);
            }
        }
    }
    private updateRowIndex(): void {
        const rows: Element[] = this.parent.grid.getDataRows();
        for (let i: number = 0; i < rows.length; i++) {
            rows[parseInt(i.toString(), 10)].setAttribute('aria-rowindex', (i + 1).toString());
        }
    }
    private updateChildCount(records: Object[]): void {
        const primaryKey: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
        const addedRecords: any = (<any>this.parent.getBatchChanges()).addedRecords || [];
        const parentItem: string = this.parent.editSettings.newRowPosition === 'Child' ? 'primaryParent' : 'parentItem';
        for (let i: number = 0; i < addedRecords.length; i++ ) {
            if (!isNullOrUndefined(addedRecords[parseInt(i.toString(), 10)][`${parentItem}`])) {
                if (addedRecords[parseInt(i.toString(), 10)][`${parentItem}`][`${primaryKey}`] === records[parseInt(this.addRowIndex.toString(), 10)][`${primaryKey}`]) {
                    this.batchChildCount = this.batchChildCount + 1;
                }
            }
        }
    }

    private beforeBatchSave(e: BeforeBatchSaveArgs): void {
        const changeRecords: string = 'changedRecords'; const deleterecords: string = 'deletedRecords';
        const changedRecords: ITreeData[] = e.batchChanges[`${changeRecords}`];
        if (e.batchChanges[`${changeRecords}`].length) {
            let columnName: string;
            for (let i: number = 0; i < changedRecords.length; i++) {
                editAction({ value: <ITreeData>changedRecords[parseInt(i.toString(), 10)], action: 'edit' }, this.parent,
                           this.isSelfReference, this.addRowIndex, this.selectedIndex, columnName);
            }
        }
        if (e.batchChanges[`${deleterecords}`].length) {
            const deletedRecords: ITreeData[] = e.batchChanges[`${deleterecords}`];
            const record: ITreeData[] = deletedRecords;
            for (let i: number = 0; i < record.length; i++) {
                this.deleteUniqueID(record[parseInt(i.toString(), 10)].uniqueID);
                const childs: ITreeData[] = findChildrenRecords(record[parseInt(i.toString(), 10)]);
                for (let c: number = 0; c < childs.length; c++) {
                    this.deleteUniqueID(childs[parseInt(c.toString(), 10)].uniqueID);
                }
                e.batchChanges[`${deleterecords}`] = [...e.batchChanges[`${deleterecords}`], ...childs];
            }
        }
        this.isAdd = false;
    }
    private deleteUniqueID( value: string) : void {
        const idFilter: string = 'uniqueIDFilterCollection';
        delete this.parent[`${idFilter}`][`${value}`];
        const id: string = 'uniqueIDCollection';
        delete this.parent[`${id}`][`${value}`];
    }

    private batchCancelAction() : void {
        const targetElement: string = 'targetElement'; let index: number; const parentItem: string = 'parentItem';
        const indexvalue: string = 'index';
        const currentViewRecords: Object[] = this.parent.grid.getCurrentViewRecords(); const childRecords: string = 'childRecords';
        const data: Object[] = <Object[]>(this.parent.grid.dataSource instanceof DataManager ?
            this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
        const primaryKey: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
        if (!isNullOrUndefined(this.batchAddedRecords)) {
            for (let i: number = 0; i < this.batchAddedRecords.length; i++) {
                index = data.findIndex((e: Object) => { return e[`${primaryKey}`] === this.batchAddedRecords[parseInt(i.toString(), 10)][`${primaryKey}`]; });
                if (index !== -1) {
                    data.splice(index, 1);
                }
                if (this.parent.editSettings.newRowPosition === 'Child') {
                    index = currentViewRecords.map((e: Object) => { return e[`${primaryKey}`]; })
                        .indexOf(this.batchAddedRecords[parseInt(i.toString(), 10)][`${parentItem}`] ? this.batchAddedRecords[parseInt(i.toString(), 10)][`${parentItem}`][`${primaryKey}`]
                            : this.batchAddedRecords[parseInt(i.toString(), 10)][`${primaryKey}`]);
                    if (!isNullOrUndefined(currentViewRecords[parseInt(index.toString(), 10)])) {
                        const children: Object[] = currentViewRecords[parseInt(index.toString(), 10)][`${childRecords}`];
                        for (let j: number = 0; children && j < children.length; j++) {
                            if (children[parseInt(j.toString(), 10)][`${primaryKey}`] === this.batchAddedRecords[parseInt(i.toString(), 10)][`${primaryKey}`]) {
                                children.splice(j, 1);
                            }
                        }
                    }
                }
            }
        }
        if (!isNullOrUndefined(this.parent[`${targetElement}`])) {
            const row: HTMLTableRowElement = this.parent[`${targetElement}`].closest('tr');
            this.parent.collapseRow(row);
            this.parent[`${targetElement}`] = null;
        }
        if (!isNullOrUndefined(this.batchDeletedRecords)) {
            for (let i: number = 0; i < this.batchDeletedRecords.length; i++) {
                if (!isNullOrUndefined(this.batchDeletedRecords[parseInt(i.toString(), 10)][`${parentItem}`])) {
                    index = currentViewRecords.map((e: Object) => { return e[`${primaryKey}`]; })
                        .indexOf(this.batchDeletedRecords[parseInt(i.toString(), 10)][`${parentItem}`][`${primaryKey}`]);
                    const positionIndex: number = this.batchDeletedRecords[parseInt(i.toString(), 10)][`${indexvalue}`] === 0 ? this.batchDeletedRecords[parseInt(i.toString(), 10)][`${indexvalue}`] :
                        this.batchDeletedRecords[parseInt(i.toString(), 10)][`${indexvalue}`] - 1;
                    if (!isNullOrUndefined(currentViewRecords[parseInt(index.toString(), 10)])) {
                        currentViewRecords[parseInt(index.toString(), 10)][`${childRecords}`].splice(positionIndex, 0, this.batchDeletedRecords[parseInt(i.toString(), 10)]);
                    }
                }
            }
        }
        this.batchAddedRecords = this.batchRecords = this.batchAddRowRecord = this.currentViewRecords = [];
        this.batchRecords = extendArray(this.parent.grid.getCurrentViewRecords()); this.batchIndex = 0;
        this.currentViewRecords = extendArray(this.parent.grid.getCurrentViewRecords());
        this.batchDeletedRecords = [];
        this.parent.grid.renderModule.refresh();
    }

    private batchSave(args: { updatedRecords: BatchChanges, index: number }) : void {
        if (this.parent.editSettings.mode === 'Batch') {
            let i: number; const batchChanges: Object = Object.hasOwnProperty.call(args, 'updatedRecords') ? args.updatedRecords : this.parent.getBatchChanges(); const deletedRecords: string = 'deletedRecords';
            const addedRecords: string = 'addedRecords'; const index: string = 'index'; const uniqueID: string = 'uniqueID';
            const data: Object[] = <Object[]>(this.parent.grid.dataSource instanceof DataManager ?
                this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
            let currentViewRecords: Object[] = this.parent.grid.getCurrentViewRecords();
            const primarykey: string = this.parent.grid.getPrimaryKeyFieldNames()[0]; const level: string = 'level';
            const addRecords: ITreeData[] = batchChanges[`${addedRecords}`]; const parentItem: string = 'parentItem';
            let selectedIndex: number; let addRowIndex: number; let columnName: string;
            let addRowRecord: ITreeData; const childRecords: string = 'childRecords';
            if (addRecords.length > 1 && this.parent.editSettings.newRowPosition !== 'Bottom') {
                addRecords.reverse();
            }
            if (this.parent.editSettings.newRowPosition !== 'Bottom' && !Object.hasOwnProperty.call(args, 'updatedRecords')) {
                data.splice(data.length - addRecords.length, addRecords.length);
                if (this.parent.editModule['isAddedRowByMethod'] && addRecords.length && !isNullOrUndefined(this.parent.editModule['addRowIndex']) && !this.parent.editModule['isAddedRowByContextMenu']) {
                    addRecords.reverse();
                    for (let i: number = 0; i < addRecords.length; i++) {
                        const index: number = parseInt(this.parent.getContentTable().getElementsByClassName('e-insertedrow')[parseInt(i.toString(), 10)].getAttribute('aria-rowindex'), 10) - 1;
                        data.splice(index, 0, addRecords[parseInt(i.toString(), 10)]);
                    }
                }
                if (!this.parent.allowPaging && data.length !== currentViewRecords.length) {
                    if (currentViewRecords.length > addRecords.length) {
                        currentViewRecords.splice(currentViewRecords.length - addRecords.length, addRecords.length);
                    }
                } else {
                    const totalRecords: Object[] = extendArray(data);
                    if (totalRecords.length && currentViewRecords.length !== 0) {
                        const startIndex: number = totalRecords.map((e: Object) => { return e[`${primarykey}`]; })
                            .indexOf(currentViewRecords[0][`${primarykey}`]);
                        const endIndex: number = startIndex + this.parent.grid.pageSettings.pageSize;
                        currentViewRecords = totalRecords.splice(startIndex, endIndex);
                    }
                }
            }
            if (this.batchAddRowRecord.length === 0) { this.batchAddRowRecord.push(this.parent.flatData[args.index]); }
            if (this.parent.editModule['isAddedRowByContextMenu']) {
                addRecords.reverse();
            }
            for (i = 0; i < addRecords.length; i++) {
                const taskData: ITreeData = extend({}, addRecords[parseInt(i.toString(), 10)]);
                delete taskData.parentItem; delete taskData.uniqueID; delete taskData.index; delete taskData.level;
                delete taskData.hasChildRecords; delete taskData.childRecords; delete taskData.parentUniqueID;
                if (!isNullOrUndefined(taskData.primaryParent)) {
                    delete taskData.primaryParent;
                }
                if (addRecords.length > 1 && this.parent.editModule['isAddedRowByContextMenu']) {
                    const rowPosition: RowPosition = this.parent.editSettings.newRowPosition;
                    this.parent.editSettings.newRowPosition = this.parent.editModule['previousNewRowPosition'];
                    this.parent.editModule['previousNewRowPosition'] = rowPosition;
                }
                addRecords[parseInt(i.toString(), 10)].taskData = taskData;
                if (this.batchAddRowRecord.length > 1) {
                    addRowRecord = this.batchAddRowRecord[parseInt(i.toString(), 10)];
                } else {
                    addRowRecord = this.batchAddRowRecord[0];
                }
                if (isNullOrUndefined(addRowRecord)) {
                    addRowRecord = this.batchAddRowRecord[i - 1];
                }
                if (this.isSelfReference) {
                    if (!isNullOrUndefined(addRecords[parseInt(i.toString(), 10)].parentItem)) {
                        updateParentRow(primarykey, addRecords[parseInt(i.toString(), 10)].parentItem, 'add', this.parent, this.isSelfReference, addRecords[parseInt(i.toString(), 10)]);
                    }
                }
                if (!isNullOrUndefined(addRowRecord)) {
                    addRowIndex = addRowRecord.index;
                }
                if (isNullOrUndefined(addRecords[parseInt(i.toString(), 10)].index)) {
                    addRowIndex = 0;
                }
                if (this.parent.editModule.isAddedMultipleRowsByMethod && this.isSelfReference && (this.parent.editSettings.newRowPosition === 'Above' || this.parent.editSettings.newRowPosition === 'Below')) {
                    addRowIndex = args.index;
                    addRowRecord = this.parent.flatData[args.index];
                }
                if (this.parent.editSettings.newRowPosition !== 'Top' && this.parent.editSettings.newRowPosition !== 'Bottom') {
                    if (isNullOrUndefined(addRecords[parseInt(i.toString(), 10)].parentItem) && this.selectedIndex === -1) {
                        selectedIndex = -1;
                        addRowRecord = null;
                    }
                }
                editAction({ value: addRecords[parseInt(i.toString(), 10)], action: 'add' }, this.parent,
                           this.isSelfReference, addRowIndex, selectedIndex, columnName, addRowRecord);
                selectedIndex = null;
                if (this.parent.editSettings.newRowPosition === 'Child' && !isNullOrUndefined(addRecords[parseInt(i.toString(), 10)][`${parentItem}`]) &&
                (isNullOrUndefined(this.parent.editModule['addRowIndex']) || this.isSelfReference)) {
                    const indexValue: number = currentViewRecords.map((e: Object) => { return e[`${primarykey}`]; })
                        .indexOf(addRecords[parseInt(i.toString(), 10)][`${parentItem}`][`${primarykey}`]);
                    const children: Object[] = currentViewRecords[parseInt(indexValue.toString(), 10)][`${childRecords}`];
                    if (!isNullOrUndefined(addRowIndex) && children.some((records: ITreeData) =>
                        records.uniqueID === addRowRecord.uniqueID)) {
                        for (let j: number = 0; j < children.length; j++) {
                            if (children[parseInt(j.toString(), 10)][`${primarykey}`] === addRecords[parseInt(i.toString(), 10)][`${primarykey}`]) {
                                currentViewRecords[parseInt(indexValue.toString(), 10)][`${childRecords}`].splice(j, 1);
                            }
                        }
                    }
                }
            }
            if (batchChanges[`${deletedRecords}`].length) {
                for (i = 0; i < batchChanges[`${deletedRecords}`].length; i++) {
                    editAction({ value: batchChanges[`${deletedRecords}`][parseInt(i.toString(), 10)], action: 'delete' }, this.parent,
                               this.isSelfReference, addRowIndex, selectedIndex, columnName, addRowRecord);
                }
            }
            this.parent.parentData = [];
            for (let i: number = 0; i < data.length; i++) {
                data[parseInt(i.toString(), 10)][`${index}`] = i;
                setValue('uniqueIDCollection.' + data[parseInt(i.toString(), 10)][`${uniqueID}`] + '.index', i, this.parent);
                if (!data[parseInt(i.toString(), 10)][`${level}`]) {
                    this.parent.parentData.push(data[parseInt(i.toString(), 10)]);
                }
            }
        }
        this.batchAddRowRecord = this.batchAddedRecords = this.batchRecords = this.batchDeletedRecords = this.currentViewRecords = [];
        if (this.parent.editModule['isAddedRowByContextMenu']) {
            this.parent.editModule['isAddedRowByContextMenu'] = false;
        }
    }

    private getActualRowObjectIndex(index: number): number {
        const rows: Element[] = this.parent.grid.getDataRows();
        if ((this.parent.editSettings.newRowPosition === 'Below' || this.parent.editSettings.newRowPosition === 'Child')
                && this.selectedIndex > -1) {
            if (!isNullOrUndefined(this.batchRecords[this.addRowIndex]) && (this.batchRecords[this.addRowIndex] as ITreeData).expanded) {
                if (this.parent.getBatchChanges()[this.addedRecords].length > 1
                    || this.parent.getBatchChanges()[this.deletedRecords].length) {
                    index += findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                    if (this.parent.editSettings.newRowPosition !== 'Child') {
                        const batchChildCount: number = this.getBatchChildCount();
                        index = index + batchChildCount;
                    }
                } else {
                    index += findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                }
            }
            if (index >= rows.length) {
                index = rows.length - 1;
            }
            this.updateChildCount(this.parent.grid.getCurrentViewRecords());
            if (this.batchChildCount) {
                index += this.batchChildCount;
            }
            this.batchChildCount = 0;
        }
        return index;
    }

    private immutableBatchAction(e: { rows: Row<Column>[], args?: NotifyArgs }): void {
        e.args.cancel = true;
        const changes: Object = this.parent.grid.getBatchChanges();
        let addedRecords: Object[] = []; const index: string = 'index';
        if (Object.keys(changes).length) {
            addedRecords = (<{ addedRecords?: Object[] }>changes).addedRecords;
        }
        for (let i: number = 0; i < addedRecords.length; i++) {
            e.rows.splice(addedRecords[parseInt(i.toString(), 10)][`${index}`], 1);
        }
    }

    private nextCellIndex(args: NotifyArgs): void {
        const index: string = 'index'; const rowIndex: string = 'rowIndex';
        const batchChanges : any = this.parent.getBatchChanges();
        const deletedRecords : any = batchChanges.deletedRecords;
        if (this.parent.getSelectedRows().length) {
            if (this.isAdd && deletedRecords.length > 0) {
                args[`${index}`] = this.parent.getSelectedRecords()[0][`${index}`];
            }
            else {
                args[`${index}`] = this.parent.getSelectedRows()[0][`${rowIndex}`];
            }
        }
        else {
            args[`${index}`] = this.batchIndex;
        }
    }

    private onCellFocused(e: CellFocusArgs): void {
        if (this.parent.editSettings.mode === 'Cell' && this.parent.grid.isEdit && e.keyArgs) {
            if (e.keyArgs.action === 'shiftEnter') {
                e.keyArgs.preventDefault();
                this.parent.endEdit();
                return;
            }
        }
    }

}
