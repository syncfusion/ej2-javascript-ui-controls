/**
 * crud-actions.ts file
 */
import { ITreeData } from '../base/interface';
import { isNullOrUndefined, extend, getValue } from '@syncfusion/ej2-base';
import { TreeGrid } from '../base';
import { DataManager } from '@syncfusion/ej2-data';
import { extendArray, getPlainData, getParentData } from '../utils';


/**
 * Performs CRUD update to Tree Grid data source
 *
 * @param {{value: ITreeData, action: string }} details - Gets modified record value and CRUD action type
 * @param {TreeGrid} details.value - Gets modified record value
 * @param {string} details.action - CRUD action type
 * @param {TreeGrid} control - Tree Grid instance
 * @param {boolean} isSelfReference - Denotes whether Self Referential data binding
 * @param {number} addRowIndex - New add row index
 * @param {number} selectedIndex - Selected Row index
 * @param {string} columnName - Column field name
 * @param {ITreeData} addRowRecord - Newly added record
 * @returns {void}
 */
export function editAction(details: { value: ITreeData, action: string }, control: TreeGrid, isSelfReference: boolean,
                           addRowIndex: number, selectedIndex: number, columnName?: string, addRowRecord?: ITreeData): void {
    let value: ITreeData = details.value; const action: string = details.action; const changedRecords: string = 'changedRecords';
    let i: number; let j: number; const addedRecords: string = 'addedRecords'; let batchChanges: Object;
    const key: string = control.grid.getPrimaryKeyFieldNames()[0];
    const treeData: ITreeData[] = control.dataSource instanceof DataManager ?
        control.dataSource.dataSource.json : <Object[]>control.dataSource;
    let modifiedData: Object[] = []; const originalData: ITreeData = value; let isSkip: boolean = false;
    if (control.editSettings.mode === 'Batch') {
        batchChanges = control.grid.editModule.getBatchChanges();
    }
    if (action === 'add' || (action === 'batchsave' && (control.editSettings.mode === 'Batch'
        && batchChanges[`${addedRecords}`].length))) {
        const addAct: { value: Object, isSkip: boolean } = addAction(details, treeData, control, isSelfReference,
                                                                     addRowIndex, selectedIndex, addRowRecord);
        value = addAct.value; isSkip = addAct.isSkip;
    }
    if (value instanceof Array) {
        modifiedData = extendArray(value);
    } else {
        modifiedData.push(extend({}, value));
    }
    if (!isSkip && (action !== 'add' ||
        (control.editSettings.newRowPosition !== 'Top' && control.editSettings.newRowPosition !== 'Bottom'))) {
        for (let k: number = 0; k < modifiedData.length; k++) {
            if (typeof(modifiedData[parseInt(k.toString(), 10)][`${key}`]) === 'object') { modifiedData[parseInt(k.toString(), 10)] = modifiedData[parseInt(k.toString(), 10)][`${key}`]; }
            const keys: string[] = (modifiedData[parseInt(k.toString(), 10)] as ITreeData).taskData ?
                Object.keys((modifiedData[parseInt(k.toString(), 10)] as ITreeData).taskData) :
                Object.keys(modifiedData[parseInt(k.toString(), 10)]);
            i = treeData.length;
            while (i-- && i >= 0) {
                if (treeData[parseInt(i.toString(), 10)][`${key}`] === modifiedData[parseInt(k.toString(), 10)][`${key}`]) {
                    if (action === 'delete') {
                        const currentData: Object = treeData[parseInt(i.toString(), 10)]; treeData.splice(i, 1);
                        if (isSelfReference) {
                            if (!isNullOrUndefined(currentData[`${control.parentIdMapping}`])) {
                                const parentData: ITreeData = control.flatData.filter((e: ITreeData) =>
                                    e[`${control.idMapping}`] === currentData[`${control.parentIdMapping}`])[0];
                                const childRecords: Object[] = parentData ? parentData[`${control.childMapping}`] : [];
                                for (let p: number = childRecords.length - 1; p >= 0; p--) {
                                    if (childRecords[parseInt(p.toString(), 10)][`${control.idMapping}`] === currentData[`${control.idMapping}`]) {
                                        if (!control.enableImmutableMode && parentData.childRecords.length === parentData['Children'].length) {
                                            parentData['childRecords'].splice(p, 1);
                                        }
                                        childRecords.splice(p, 1);
                                        if (!childRecords.length) {
                                            parentData.hasChildRecords = false;
                                            updateParentRow(key, parentData, action, control, isSelfReference);
                                        }
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    } else {
                        if (action === 'edit') {
                            for (j = 0; j < keys.length; j++) {
                                if (Object.prototype.hasOwnProperty.call(treeData[parseInt(i.toString(), 10)], keys[parseInt(j.toString(), 10)]) && ((control.editSettings.mode !== 'Cell'
                                    || (!isNullOrUndefined(batchChanges) && batchChanges[`${changedRecords}`].length === 0))
                                    || keys[parseInt(j.toString(), 10)] === columnName)) {
                                    const editedData: ITreeData =
                                    getParentData(control, (<ITreeData>modifiedData[parseInt(k.toString(), 10)]).uniqueID);
                                    treeData[parseInt(i.toString(), 10)][keys[parseInt(j.toString(), 10)]] =
                                         modifiedData[parseInt(k.toString(), 10)][keys[parseInt(j.toString(), 10)]];
                                    if (editedData && editedData.taskData) {
                                        editedData.taskData[keys[parseInt(j.toString(), 10)]] = editedData[keys[parseInt(j.toString(), 10)]]
                                        = treeData[parseInt(i.toString(), 10)][keys[parseInt(j.toString(), 10)]];
                                    }
                                }
                            }
                        } else if (action === 'add' || action === 'batchsave') {
                            let index: number;
                            if (control.editSettings.newRowPosition === 'Child') {
                                if (isSelfReference) {
                                    originalData.taskData[`${control.parentIdMapping}`] = treeData[parseInt(i.toString(), 10)][`${control.idMapping}`];
                                    treeData.splice(i + 1, 0, originalData.taskData);
                                } else {
                                    if (!Object.prototype.hasOwnProperty.call(treeData[parseInt(i.toString(), 10)], control.childMapping)) {
                                        treeData[parseInt(i.toString(), 10)][`${control.childMapping}`] = [];
                                    }
                                    treeData[parseInt(i.toString(), 10)][`${control.childMapping}`].push(originalData.taskData);
                                    updateParentRow(key, treeData[parseInt(i.toString(), 10)], action, control,
                                                    isSelfReference, originalData);
                                }
                            } else if (control.editSettings.newRowPosition === 'Below') {
                                treeData.splice(i + 1, 0, originalData.taskData);
                                if (!isNullOrUndefined(originalData.parentItem)) {
                                    updateParentRow(key, treeData[i + 1], action, control, isSelfReference, originalData);
                                }
                            } else if (!addRowIndex) { index = 0; treeData.splice(index, 0, originalData.taskData);
                            } else if (control.editSettings.newRowPosition === 'Above') {
                                treeData.splice(i, 0, originalData.taskData);
                                if (!isNullOrUndefined(originalData.parentItem)) {
                                    updateParentRow(key, treeData[parseInt(i.toString(), 10)], action, control,
                                                    isSelfReference, originalData);
                                }
                            }
                        }
                        break;
                    }
                } else if (!isNullOrUndefined(treeData[parseInt(i.toString(), 10)][`${control.childMapping}`])) {
                    if (removeChildRecords(treeData[parseInt(i.toString(), 10)][`${control.childMapping}`], modifiedData[parseInt(k.toString(), 10)], action, key, control,
                                           isSelfReference, originalData, columnName)) {
                        updateParentRow(key, treeData[parseInt(i.toString(), 10)], action, control, isSelfReference);
                    }
                }
            }
        }
    }
}

/**
 * Performs Add action to Tree Grid data source
 *
 * @param {{value: ITreeData, action: string }} details - Gets modified record value and CRUD action type
 * @param {TreeGrid} details.value - Gets modified record value
 * @param {string} details.action - CRUD action type
 * @param {Object[]} treeData - Tree Grid data source
 * @param {TreeGrid} control - Tree Grid instance
 * @param {boolean} isSelfReference - Denotes whether Self Referential data binding
 * @param {number} addRowIndex - New add row index
 * @param {number} selectedIndex - Selected Row index
 * @param {ITreeData} addRowRecord - Newly added record
 * @returns {void}
 */
export function addAction(details: { value: ITreeData, action: string }, treeData: Object[], control: TreeGrid, isSelfReference: boolean,
                          addRowIndex: number, selectedIndex: number, addRowRecord: ITreeData): { value: Object, isSkip: boolean } {
    let value: Object; let isSkip: boolean = false;
    const currentViewRecords: ITreeData[] = <ITreeData[]>control.grid.getCurrentViewRecords();
    value = extend({}, details.value);
    value = getPlainData(value);
    switch (control.editSettings.newRowPosition) {
    case 'Top':
        treeData.unshift(value);
        isSkip = true;
        break;
    case 'Bottom':
        treeData.push(value);
        isSkip = true;
        break;
    case 'Above':
        if (!isNullOrUndefined(addRowRecord)) {
            value = extend({}, addRowRecord);
            value = getPlainData(value);
        } else {
            value = extend({}, currentViewRecords[addRowIndex + 1]);
            value = getPlainData(value);
        }
        break;
    case 'Below':
    case 'Child':
        if (!isNullOrUndefined(addRowRecord)) {
            value = extend({}, addRowRecord);
            value = getPlainData(value);
        } else {
            const primaryKeys: string = control.grid.getPrimaryKeyFieldNames()[0];
            const currentdata: Object = currentViewRecords[parseInt(addRowIndex.toString(), 10)];
            if (!isNullOrUndefined(currentdata) && currentdata[`${primaryKeys}`] === details.value[`${primaryKeys}`] || selectedIndex !== -1) {
                value = extend({}, currentdata);
            } else {
                value = extend({}, details.value);
            }
            value = getPlainData(value);
            const internalProperty: string = 'internalProperties';
            (control.editModule[`${internalProperty}`] as ITreeData).taskData = value;
        }
        if (selectedIndex === -1) {
            treeData.unshift(value);
            isSkip = true;
        }
    }
    return { value: value, isSkip: isSkip };
}

/**
 * @param {ITreeData[]} childRecords - Child Records collection
 * @param {Object} modifiedData - Modified data in crud action
 * @param {string} action - crud action type
 * @param {string} key - Primary key field name
 * @param {TreeGrid} control - Tree Grid instance
 * @param {boolean} isSelfReference - Specified whether Self Referential data binding
 * @param {ITreeData} originalData - Non updated data from data source, of edited data
 * @param {string} columnName - column field name
 * @returns {boolean} Returns whether child records exists
 */
export function removeChildRecords(childRecords: ITreeData[], modifiedData: Object, action: string, key: string, control: TreeGrid,
                                   isSelfReference: boolean, originalData?: ITreeData, columnName?: string): boolean {
    let isChildAll: boolean = false;
    let j: number = childRecords.length;
    while (j-- && j >= 0) {
        if (childRecords[parseInt(j.toString(), 10)][`${key}`] === modifiedData[`${key}`] ||
            (isSelfReference && childRecords[parseInt(j.toString(), 10)][control.parentIdMapping] === modifiedData[control.idMapping])) {
            if (action === 'edit') {
                const keys: string[] = Object.keys(modifiedData);
                const editedData: ITreeData = getParentData(control, (<ITreeData>modifiedData).uniqueID);
                for (let i: number = 0; i < keys.length; i++) {
                    if (Object.prototype.hasOwnProperty.call(childRecords[parseInt(j.toString(), 10)], keys[parseInt(i.toString(), 10)]) &&
                     (control.editSettings.mode !== 'Cell' || keys[parseInt(i.toString(), 10)] === columnName)) {
                        editedData[keys[parseInt(i.toString(), 10)]] =
                        editedData.taskData[keys[parseInt(i.toString(), 10)]] =
                        childRecords[parseInt(j.toString(), 10)][keys[parseInt(i.toString(), 10)]] =
                        modifiedData[keys[parseInt(i.toString(), 10)]];
                        if (control.grid.editSettings.mode === 'Normal' && control.editSettings.mode === 'Cell' && !isNullOrUndefined(control.grid.editModule)) {
                            const editModule: string = 'editModule';
                            control.grid.editModule[`${editModule}`].editRowIndex = (<ITreeData>modifiedData).index;
                            control.grid.editModule[`${editModule}`].updateCurrentViewData(modifiedData);
                        }
                    }
                }
                break;
            } else if (action === 'add' || action === 'batchsave') {
                if (control.editSettings.newRowPosition === 'Child') {
                    if (isSelfReference) {
                        originalData[`${control.parentIdMapping}`] = childRecords[parseInt(j.toString(), 10)][control.idMapping];
                        childRecords.splice(j + 1, 0, originalData);
                        updateParentRow(key, childRecords[parseInt(j.toString(), 10)], action, control, isSelfReference, originalData);
                    } else {
                        if (!Object.prototype.hasOwnProperty.call(childRecords[parseInt(j.toString(), 10)], control.childMapping)) {
                            childRecords[parseInt(j.toString(), 10)][control.childMapping] = [];
                        }
                        childRecords[parseInt(j.toString(), 10)][control.childMapping].push(originalData.taskData);
                        updateParentRow(key, childRecords[parseInt(j.toString(), 10)], action, control, isSelfReference, originalData);
                    }
                } else if (control.editSettings.newRowPosition === 'Above') {
                    childRecords.splice(j, 0, originalData.taskData);
                    if (!isNullOrUndefined(originalData.parentItem)) {
                        updateParentRow(key, childRecords[parseInt(j.toString(), 10)], action, control, isSelfReference, originalData);
                    }
                } else if (control.editSettings.newRowPosition === 'Below') {
                    childRecords.splice(j + 1, 0, originalData.taskData);
                    if (!isNullOrUndefined(originalData.parentItem)) {
                        updateParentRow(key, childRecords[parseInt(j.toString(), 10)], action, control, isSelfReference, originalData);
                    }
                }
            } else {
                childRecords.splice(j, 1);
                if (!childRecords.length) {
                    isChildAll = true;
                }
            }
        } else if (!isNullOrUndefined(childRecords[parseInt(j.toString(), 10)][control.childMapping])) {
            if (removeChildRecords(childRecords[parseInt(j.toString(), 10)][control.childMapping], modifiedData, action, key,
                                   control, isSelfReference, originalData, columnName)) {
                updateParentRow(key, childRecords[parseInt(j.toString(), 10)], action, control, isSelfReference);
            }
        }
    }
    return isChildAll;
}

/**
 * @param {string} key - Primary key field name
 * @param {ITreeData} record - Parent Record which has to be updated
 * @param {string} action - CRUD action type
 * @param {TreeGrid} control - Tree Grid instance
 * @param {boolean} isSelfReference - Specified whether self referential data binding
 * @param {ITreeData} child - Specifies child record
 * @returns {void}
 */
export function updateParentRow(key: string, record: ITreeData, action: string, control: TreeGrid, isSelfReference: boolean,
                                child?: ITreeData): void {

    if ((control.editSettings.newRowPosition === 'Above' || control.editSettings.newRowPosition === 'Below')
        && ((action === 'add' || action === 'batchsave')) && !isNullOrUndefined(child.parentItem)) {
        const parentData: ITreeData = getParentData(control, child.parentItem.uniqueID);
        parentData.childRecords.push(child);
    } else {
        const currentRecords: ITreeData[] = control.grid.getCurrentViewRecords();
        let index: number;
        currentRecords.map((e: ITreeData, i: number) => { if (e[`${key}`] === record[`${key}`]) { index = i; return; } });
        if (control.enableVirtualization && isNullOrUndefined(index)) {
            const updatedParent: ITreeData = getValue('uniqueIDCollection.' + child.parentUniqueID, control);
            record = updatedParent;
        }
        if (!isNullOrUndefined(index)) {
            record = currentRecords[parseInt(index.toString(), 10)];
        }
        if (control.enableVirtualization && isNullOrUndefined(record) && !isNullOrUndefined(child)) {
            record = getValue('uniqueIDCollection.' + child.parentUniqueID, control);
        }
        if (!isSelfReference && !isNullOrUndefined(record.childRecords) && record.childRecords.length) {
            record.hasChildRecords = true;
        }
        else {
            record.hasChildRecords = false;
        }
        if (action === 'add' || action === 'batchsave') {
            record.expanded = true;
            record.hasChildRecords = true;
            if (control.sortSettings.columns.length && isNullOrUndefined(child)) {
                child = <ITreeData>currentRecords.filter((e: ITreeData) => {
                    if (e.parentUniqueID === record.uniqueID) {
                        return e;
                    } else {
                        return null;
                    }
                });
            }
            const childRecords: ITreeData = child ? child instanceof Array ? child[0] : child : currentRecords[index + 1];
            if (control.editSettings.newRowPosition !== 'Below') {
                if (!Object.prototype.hasOwnProperty.call(record, 'childRecords')) {
                    record.childRecords = [];
                } else {
                    if (!isNullOrUndefined(child) && record[`${key}`] !== child[`${key}`]) {
                        record.childRecords.push(child);
                    }
                }
                if (record.childRecords.indexOf(childRecords) === -1 && record[`${key}`] !== child[`${key}`]) {
                    record.childRecords.unshift(childRecords);
                }
                if (isSelfReference) {
                    if (!Object.prototype.hasOwnProperty.call(record, control.childMapping)) {
                        record[control.childMapping] = [];
                    }
                    if (record[`${control.childMapping}`].indexOf(childRecords) === -1 && record[`${key}`] !== child[`${key}`]) {
                        record[control.childMapping].unshift(childRecords);
                    }
                }
            }
        }
        const primaryKeys: string = control.grid.getPrimaryKeyFieldNames()[0];
        const data: ITreeData[] = control.grid.dataSource instanceof DataManager ?
            control.grid.dataSource.dataSource.json : <Object[]>control.grid.dataSource;
        for (let i: number = 0; i < data.length; i++) {
            if (data[parseInt(i.toString(), 10)][`${primaryKeys}`] === record[`${primaryKeys}`]) {
                data[parseInt(i.toString(), 10)] = record;
                break;
            }
        }
        control.grid.setRowData(key, record);
        let row: HTMLTableRowElement = <HTMLTableRowElement>control.getRowByIndex(index);
        if (control.editSettings.mode === 'Batch') {
            if (action === 'add') {
                row = <HTMLTableRowElement>control.getRows()[control.grid.getCurrentViewRecords().indexOf(record)];
            } else {
                row = <HTMLTableRowElement>control.getRows()[control.grid.getRowIndexByPrimaryKey(record[`${key}`])];
            }
        }
        let movableRow: HTMLTableRowElement;
        if (control.frozenRows || control.getFrozenColumns()) {
            movableRow = <HTMLTableRowElement>control.getRowByIndex(index);
        }
        if (!control.enableVirtualization && !isNullOrUndefined(row) || !isNullOrUndefined(movableRow)) {
            let index: number = control.treeColumnIndex;
            if (control.allowRowDragAndDrop && control.enableImmutableMode) {
                index = index + 1;
            }
            control.renderModule.cellRender({
                data: record, cell: row.cells[parseInt(index.toString(), 10)] ? row.cells[parseInt(index.toString(), 10)]
                    : movableRow.cells[index - control.getFrozenColumns()],
                column: control.grid.getColumns()[control.treeColumnIndex],
                requestType: action
            });
            if (control.enableImmutableMode && control['action'] === 'indenting' || control['action'] === 'outdenting') {
                control.renderModule.RowModifier({
                    data: record, row: row
                });
            }
        }
    }
}
