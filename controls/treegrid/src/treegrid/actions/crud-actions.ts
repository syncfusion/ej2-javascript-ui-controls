/**
 * crud-actions.ts file
 */
import { ITreeData } from '../base/interface';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { TreeGrid } from '../base';
import { DataManager } from '@syncfusion/ej2-data';
import { extendArray, getPlainData, getParentData } from '../utils';


export function editAction(details: { value: ITreeData, action: string }, control: TreeGrid, isSelfReference: boolean,
                           addRowIndex: number, selectedIndex: number, columnName?: string, addRowRecord?: ITreeData): void {
    let value: ITreeData = details.value; let action: string = details.action; let changedRecords: string = 'changedRecords';
    let i: number; let j: number; let addedRecords: string = 'addedRecords'; let batchChanges: Object;
    let key: string = control.grid.getPrimaryKeyFieldNames()[0];
    let treeData: ITreeData[] = control.dataSource instanceof DataManager ?
        control.dataSource.dataSource.json : <Object[]>control.dataSource;
    let modifiedData: object[] = []; let originalData: ITreeData = value; let isSkip: boolean = false;
    if (control.editSettings.mode === 'Batch') {
        batchChanges = control.grid.editModule.getBatchChanges();
    }
    if (action === 'add' || (action === 'batchsave' && (control.editSettings.mode === 'Batch'
        && batchChanges[addedRecords].length))) {
        let addAct: { value: Object, isSkip: boolean } = addAction(details, treeData, control, isSelfReference,
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
            if (typeof(modifiedData[k][key]) === 'object') {
                modifiedData[k] = modifiedData[k][key];
            }
            let keys: string[] = Object.keys((modifiedData[k] as ITreeData).taskData);
            i = treeData.length;
            while (i-- && i >= 0) {
                if (treeData[i][key] === modifiedData[k][key]) {
                    if (action === 'delete') {
                        let currentData: Object = treeData[i];
                        treeData.splice(i, 1);
                        if (isSelfReference) {
                            if (!isNullOrUndefined(currentData[control.parentIdMapping])) {
                                let parentData: ITreeData = control.flatData.filter((e: ITreeData) =>
                                    e[control.idMapping] === currentData[control.parentIdMapping])[0];
                                let childRecords: Object[] = parentData ? parentData[control.childMapping] : [];
                                for (let p: number = childRecords.length - 1; p >= 0; p--) {
                                    if (childRecords[p][control.idMapping] === currentData[control.idMapping]) {
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
                                if (treeData[i].hasOwnProperty(keys[j]) && ((control.editSettings.mode !== 'Cell'
                                    || (!isNullOrUndefined(batchChanges) && batchChanges[changedRecords].length === 0))
                                    || keys[j] === columnName)) {
                                    let editedData: ITreeData = getParentData(control, (<ITreeData>modifiedData[k]).uniqueID);
                                    editedData.taskData[keys[j]] = treeData[i][keys[j]] = modifiedData[k][keys[j]];
                                }
                            }
                        } else if (action === 'add' || action === 'batchsave') {
                            let index: number;
                            if (control.editSettings.newRowPosition === 'Child') {
                                if (isSelfReference) {
                                    originalData.taskData[control.parentIdMapping] = treeData[i][control.idMapping];
                                    treeData.splice(i + 1, 0, originalData.taskData);
                                } else {
                                    if (!(<Object>treeData[i]).hasOwnProperty(control.childMapping)) {
                                        treeData[i][control.childMapping] = [];
                                    }
                                    treeData[i][control.childMapping].push(originalData.taskData);
                                    updateParentRow(key, treeData[i], action, control, isSelfReference, originalData);
                                }
                            } else if (control.editSettings.newRowPosition === 'Below') {
                                treeData.splice(i + 1, 0, originalData.taskData);
                                updateParentRow(key, treeData[i], action, control, isSelfReference, originalData);
                            } else if (!addRowIndex) {
                                index = 0;
                                treeData.splice(index, 0, originalData.taskData);
                            } else if (control.editSettings.newRowPosition === 'Above') {
                                treeData.splice(i, 0, originalData.taskData);
                                updateParentRow(key, treeData[i], action, control, isSelfReference, originalData);
                            }
                        }
                        break;
                    }
                } else if (!isNullOrUndefined(treeData[i][control.childMapping])) {
                    if (removeChildRecords(treeData[i][control.childMapping], modifiedData[k], action, key, control,
                                           isSelfReference, originalData, columnName)) {
                        updateParentRow(key, treeData[i], action, control, isSelfReference);
                    }
                }
            }
        }
    }
}

export function addAction(details: { value: ITreeData, action: string }, treeData: Object[], control: TreeGrid, isSelfReference: boolean,
                          addRowIndex: number, selectedIndex: number, addRowRecord: ITreeData): { value: Object, isSkip: boolean } {
    let value: Object; let isSkip: boolean = false;
    let currentViewRecords: ITreeData[] = <ITreeData[]>control.grid.getCurrentViewRecords();
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
                let primaryKeys: string = control.grid.getPrimaryKeyFieldNames()[0];
                let currentdata: Object = currentViewRecords[addRowIndex];
                if (!isNullOrUndefined(currentdata) && currentdata[primaryKeys] === details.value[primaryKeys] || selectedIndex !== -1) {
                    value = extend({}, currentdata);
                } else {
                    value = extend({}, details.value);
                }
                value = getPlainData(value);
            }
            if (selectedIndex === -1) {
                treeData.unshift(value);
                isSkip = true;
            }
    }
    return { value: value, isSkip: isSkip };
}

export function removeChildRecords(childRecords: ITreeData[], modifiedData: object, action: string, key: string, control: TreeGrid,
                                   isSelfReference: boolean, originalData?: ITreeData, columnName?: string): boolean {
    let isChildAll: boolean = false;
    let j: number = childRecords.length;
    while (j-- && j >= 0) {
        if (childRecords[j][key] === modifiedData[key] ||
            (isSelfReference && childRecords[j][control.parentIdMapping] === modifiedData[control.idMapping])) {
            if (action === 'edit') {
                let keys: string[] = Object.keys(modifiedData);
                let editedData: ITreeData = getParentData(control, (<ITreeData>modifiedData).uniqueID);
                for (let i: number = 0; i < keys.length; i++) {
                    if (childRecords[j].hasOwnProperty(keys[i]) && (control.editSettings.mode !== 'Cell' || keys[i] === columnName)) {
                        editedData[keys[i]] = editedData.taskData[keys[i]] = childRecords[j][keys[i]] = modifiedData[keys[i]];
                    }
                }
                break;
            } else if (action === 'add' || action === 'batchsave') {
                if (control.editSettings.newRowPosition === 'Child') {
                    if (isSelfReference) {
                        originalData[control.parentIdMapping] = childRecords[j][control.idMapping];
                        childRecords.splice(j + 1, 0, originalData);
                        updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                    } else {
                        if (!(<Object>childRecords[j]).hasOwnProperty(control.childMapping)) {
                            childRecords[j][control.childMapping] = [];
                        }
                        childRecords[j][control.childMapping].push(originalData.taskData);
                        updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                    }
                } else if (control.editSettings.newRowPosition === 'Above') {
                    childRecords.splice(j, 0, originalData.taskData);
                    updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                } else if (control.editSettings.newRowPosition === 'Below') {
                    childRecords.splice(j + 1, 0, originalData.taskData);
                    updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                }
            } else {
                let parentItem: ITreeData = childRecords[j].parentItem;
                childRecords.splice(j, 1);
                if (!childRecords.length) {
                    isChildAll = true;
                }
            }
        } else if (!isNullOrUndefined(childRecords[j][control.childMapping])) {
            if (removeChildRecords(childRecords[j][control.childMapping], modifiedData, action, key,
                                   control, isSelfReference, originalData, columnName)) {
                updateParentRow(key, childRecords[j], action, control, isSelfReference);
            }
        }
    }
    return isChildAll;
}

export function updateParentRow(key: string, record: ITreeData, action: string, control: TreeGrid, isSelfReference: boolean,
                                child?: ITreeData): void {

    if ((control.editSettings.newRowPosition === 'Above' || control.editSettings.newRowPosition === 'Below')
        && ((action === 'add' || action === 'batchsave')) && !isNullOrUndefined(child.parentItem)) {
        let parentData: ITreeData = getParentData(control, child.parentItem.uniqueID);
        parentData.childRecords.push(child);
    } else {
        let currentRecords: ITreeData[] = control.grid.getCurrentViewRecords();
        let index: number;
        currentRecords.map((e: ITreeData, i: number) => { if (e[key] === record[key]) { index = i; return; } });
        record = currentRecords[index];
        record.hasChildRecords = false;
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
            let childRecords: ITreeData = child ? child instanceof Array ? child[0] : child : currentRecords[index + 1];
            if (control.editSettings.newRowPosition !== 'Below') {
                if (!(<Object>record).hasOwnProperty('childRecords')) {
                    record.childRecords = [];
                } else {
                    if (!isNullOrUndefined(child) && record[key] !== child[key]) {
                        record.childRecords.push(child);
                    }
                }
                if (record.childRecords.indexOf(childRecords) === -1 && record[key] !== child[key]) {
                    record.childRecords.unshift(childRecords);
                }
                if (isSelfReference) {
                    if (!(<Object>record).hasOwnProperty(control.childMapping)) {
                        record[control.childMapping] = [];
                    }
                    if (record[control.childMapping].indexOf(childRecords) === -1 && record[key] !== child[key]) {
                        record[control.childMapping].unshift(childRecords);
                    }
                }
            }
        }
        let primaryKeys: string = control.grid.getPrimaryKeyFieldNames()[0];
        let data: ITreeData[] = control.grid.dataSource instanceof DataManager ?
            control.grid.dataSource.dataSource.json : <Object[]>control.grid.dataSource;
        for (let i: number = 0; i < data.length; i++) {
            if (data[i][primaryKeys] === record[primaryKeys]) {
                data[i] = record;
                break;
            }
        }
        control.grid.setRowData(key, record);
        let row: HTMLTableRowElement = <HTMLTableRowElement>control.getRowByIndex(index);
        if (control.editSettings.mode === 'Batch') {
            row = <HTMLTableRowElement>control.getRows()[control.grid.getRowIndexByPrimaryKey(record[key])];
        }
        let movableRow: HTMLTableRowElement;
        if (control.frozenRows || control.getFrozenColumns()) {
            movableRow = <HTMLTableRowElement>control.getMovableRowByIndex(index);
        }
        control.renderModule.cellRender({
            data: record, cell: row.cells[control.treeColumnIndex] ? row.cells[control.treeColumnIndex]
                : movableRow.cells[control.treeColumnIndex - control.frozenColumns],
            column: control.grid.getColumns()[control.treeColumnIndex],
            requestType: action
        });
    }
}