/**
 * crud-actions.ts file
 */
import { ITreeData } from '../base/interface';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { TreeGrid } from '../base';
import { DataManager } from '@syncfusion/ej2-data';
import { extendArray, getPlainData } from '../utils';


export function editAction(details: { value: ITreeData, action: string }, control: TreeGrid, isSelfReference: boolean,
                           addRowIndex: number, selectedIndex: number, columnName?: string, addRowRecord?: ITreeData): void {
    let value: ITreeData = details.value;
    let action: string = details.action;
    let i: number; let j: number;
    let key: string = control.grid.getPrimaryKeyFieldNames()[0];
    let treeData: ITreeData[] = control.dataSource instanceof DataManager ?
        control.dataSource.dataSource.json : <Object[]>control.dataSource;
    let modifiedData: object[] = [];
    let originalData: ITreeData = value;
    let isSkip: boolean = false;
    let currentViewRecords: ITreeData[] = <ITreeData[]>control.grid.getCurrentViewRecords();
    if (action === 'add') {
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
            let keys: string[] = Object.keys(modifiedData[k]);
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
                                if (treeData[i].hasOwnProperty(keys[j]) && (control.editSettings.mode !== 'Cell'
                                || keys[j] === columnName)) {
                                    treeData[i][keys[j]] = modifiedData[k][keys[j]];
                                }
                            }
                        } else if (action === 'add') {
                            let index: number;
                            if (control.editSettings.newRowPosition === 'Child') {
                                if (isSelfReference) {
                                    originalData[control.parentIdMapping] = treeData[i][control.idMapping];
                                    treeData.splice(i + 1, 0, originalData);
                                } else {
                                    if (!(<Object>treeData[i]).hasOwnProperty(control.childMapping)) {
                                        treeData[i][control.childMapping] = [];
                                    }
                                    treeData[i][control.childMapping].push(originalData);
                                    updateParentRow(key, treeData[i], action, control, isSelfReference);
                                }
                            } else if (control.editSettings.newRowPosition === 'Below') {
                                treeData.splice(i + 1, 0, originalData);
                            } else if (!addRowIndex) {
                                index = 0;
                                treeData.splice(index, 0, originalData);
                            } else if (control.editSettings.newRowPosition === 'Above') {
                                treeData.splice(i, 0, originalData);
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
                value = addRowRecord;
            } else {
                value = currentViewRecords[addRowIndex + 1];
            }
            break;
        case 'Below':
        case 'Child':
            if (!isNullOrUndefined(addRowRecord)) {
                value = addRowRecord;
            } else {
                value = currentViewRecords[addRowIndex];
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
                for (let i: number = 0; i < keys.length; i++) {
                    if (childRecords[j].hasOwnProperty(keys[i]) && (control.editSettings.mode !== 'Cell' || keys[i] === columnName)) {
                        childRecords[j][keys[i]] = modifiedData[keys[i]];
                    }
                }
                break;
            } else if (action === 'add') {
                if (control.editSettings.newRowPosition === 'Child') {
                    if (isSelfReference) {
                        originalData[control.parentIdMapping] = childRecords[j][control.idMapping];
                        childRecords.splice(j + 1, 0, originalData);
                        updateParentRow(key, childRecords[j], action, control, isSelfReference);
                    } else {
                        if (!(<Object>childRecords[j]).hasOwnProperty(control.childMapping)) {
                            childRecords[j][control.childMapping] = [];
                        }
                        childRecords[j][control.childMapping].push(originalData);
                        updateParentRow(key, childRecords[j], action, control, isSelfReference);
                    }
                } else if (control.editSettings.newRowPosition === 'Above') {
                    childRecords.splice(j, 0, originalData);
                } else if (control.editSettings.newRowPosition === 'Below') {
                    childRecords.splice(j + 1, 0, originalData);
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
    let currentRecords: ITreeData[] = control.grid.getCurrentViewRecords();
    let index: number;
    currentRecords.map((e: ITreeData, i: number) => { if (e[key] === record[key]) { index = i; return; } });
    record = currentRecords[index];
    record.hasChildRecords = false;
    if (action === 'add') {
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
        if (!(<Object>record).hasOwnProperty('childRecords')) {
            record.childRecords = [];
        }
        if (record.childRecords.indexOf(childRecords) === -1) {
            record.childRecords.unshift(childRecords);
        }
        if (isSelfReference) {
            if (!(<Object>record).hasOwnProperty(control.childMapping)) {
                record[control.childMapping] = [];
            }
            if (record.childRecords.indexOf(childRecords) === -1) {
                record[control.childMapping].unshift(childRecords);
            }
        }
    }
    control.grid.setRowData(key, record);
    let row: HTMLTableRowElement = <HTMLTableRowElement>control.getRowByIndex(index);
    control.renderModule.cellRender({
        data: record, cell: row.cells[control.treeColumnIndex],
        column: control.grid.getColumns()[control.treeColumnIndex]
    });
}
