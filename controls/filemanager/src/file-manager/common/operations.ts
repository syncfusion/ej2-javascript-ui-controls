import { Ajax, createElement, select, extend } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, setValue, getValue } from '@syncfusion/ej2-base';
import { IFileManager, ReadArgs, BeforeSendEventArgs, BeforeDownloadEventArgs } from '../base/interface';
import * as events from '../base/constant';
import { createDialog, createExtDialog } from '../pop-up/dialog';
import { FileDetails, FileDragEventArgs, FailureEventArgs, SuccessEventArgs } from '../../index';
import { fileType, setNodeId, getLocaleText, setDateObject, doPasteUpdate, getParentPath, getPathObject } from '../common/utility';
import { generatePath } from '../common/utility';

/**
 * Function to read the content from given path in File Manager.
 * @private
 */
export function read(parent: IFileManager, event: string, path: string): void {
    let itemData: Object[] = parent.itemData;
    for (let i: number = 0; i < itemData.length; i++) {
        if (isNOU(getValue('hasChild', itemData[i]))) { setValue('hasChild', false, itemData[i]); }
    }
    let data: Object = { action: 'read', path: path, showHiddenItems: parent.showHiddenItems, data: itemData };
    createAjax(parent, data, readSuccess, event);
}

/**
 * Function to create new folder in File Manager.
 * @private
 */
export function createFolder(parent: IFileManager, itemName: string): void {
    let data: Object = { action: 'create', path: parent.path, name: itemName, data: parent.itemData };
    createAjax(parent, data, createSuccess, itemName);
}

/**
 * Function to filter the files in File Manager.
 * @private
 */
export function filter(parent: IFileManager, event: string): void {
    let data: Object = { action: 'filter', path: parent.path, showHiddenItems: parent.showHiddenItems, data: [getPathObject(parent)] };
    let filterData: Object;
    filterData = parent.filterData ? extend(filterData, data, parent.filterData) : data;
    createAjax(parent, filterData, filterSuccess, event, getValue('action', filterData));
}

/**
 * Function to rename the folder/file in File Manager.
 * @private
 */
export function rename(parent: IFileManager, path: string, itemNewName: string): void {
    let name: string;
    let newName: string;
    if (parent.breadcrumbbarModule.searchObj.element.value === '' && !parent.isFiltered) {
        name = parent.currentItemText;
        newName = itemNewName;
    } else {
        let fPath: string = parent.filterPath;
        if (parent.hasId) {
            name = parent.currentItemText;
            newName = itemNewName;
        } else {
            fPath = fPath.replace(/\\/g, '/');
            name = fPath.replace(path, '') + parent.currentItemText;
            newName = fPath.replace(path, '') + itemNewName;
        }
    }
    let data: Object = {
        action: 'rename', path: path, name: name, newName: newName, data: parent.itemData
    };
    createAjax(parent, data, renameSuccess, path);
}


/**
 * Function to paste file's and folder's in File Manager.
 * @private
 */
export function paste(
    // tslint:disable-next-line
    parent: IFileManager, path: string, names: string[], targetPath: string, pasteOperation: string,
    renameItems?: string[], actionRecords?: Object[]): void {
    let data: Object = {
        action: pasteOperation, path: path, targetData: parent.itemData[0],
        targetPath: targetPath, names: names, renameFiles: renameItems, data: actionRecords
    };
    parent.destinationPath = targetPath;
    createAjax(parent, data, pasteSuccess, path, pasteOperation, targetPath);
}

/**
 * Function to delete file's and folder's in File Manager.
 * @private
 */
export function Delete(parent: IFileManager, items: string[], path: string, operation: string): void {
    let data: Object = { action: operation, path: path, names: items, data: parent.itemData };
    createAjax(parent, data, deleteSuccess, path);
}

/**
 * Function to get details of file's and folder's in File Manager.
 * @private
 */
/* istanbul ignore next */
export function GetDetails(parent: IFileManager, names: string[], path: string, operation: string): void {
    let data: Object = { action: operation, path: path, names: names, data: parent.itemData };
    createAjax(parent, data, detailsSuccess, path, operation);
}

function createAjax(
    parent: IFileManager, data: Object, fn: Function, event?: string,
    operation?: string, targetPath?: string): void {
    let ajaxSettings: Object = {
        url: parent.ajaxSettings.url,
        type: 'POST',
        mode: true,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        onSuccess: null,
        onFailure: null,
        beforeSend: null
    };
    let eventArgs: BeforeSendEventArgs = { action: getValue('action', data), ajaxSettings: ajaxSettings, cancel: false };
    parent.trigger('beforeSend', eventArgs, (beforeSendArgs: BeforeSendEventArgs) => {
        if (!beforeSendArgs.cancel) {
            parent.notify(events.beforeRequest, {});
            let ajax: Ajax = new Ajax({
                url: getValue('url', beforeSendArgs.ajaxSettings),
                type: getValue('type', beforeSendArgs.ajaxSettings),
                mode: getValue('mode', beforeSendArgs.ajaxSettings),
                dataType: getValue('dataType', beforeSendArgs.ajaxSettings),
                contentType: getValue('contentType', beforeSendArgs.ajaxSettings),
                data: getValue('data', beforeSendArgs.ajaxSettings),
                beforeSend: getValue('beforeSend', beforeSendArgs.ajaxSettings),
                onSuccess: (result: ReadArgs) => {
                    if (isNOU(result)) {
                        let result: ReadArgs = {
                            error: {
                                fileExists: null,
                                message: 'ServerError: Invalid response from ' + parent.ajaxSettings.url,
                                code: '406',
                            },
                            files: null,
                        };
                        triggerAjaxFailure(parent, beforeSendArgs, fn, result, event, operation, targetPath);
                        return;
                    }
                    if (typeof (result) === 'string') {
                        result = JSON.parse(result);
                    }
                    parent.notify(events.afterRequest, { action: 'success' });
                    let id: string = parent.expandedId ? parent.expandedId : parent.pathId[parent.pathId.length - 1];
                    if (!isNOU(result.cwd) && (getValue('action', data) === 'read')) {
                        result.cwd.name = parent.rootAliasName || result.cwd.name;
                        setValue('_fm_id', id, result.cwd);
                        setValue(id, result.cwd, parent.feParent);
                        if (!isNOU(result.files) || result.error.code === '401') {
                            if ((event === 'finalize-end' || event === 'initial-end') && parent.pathNames.length === 0) {
                                let root: Object = getValue(parent.pathId[0], parent.feParent);
                                parent.pathNames[0] = getValue('name', root);
                                parent.hasId = !isNOU(getValue('id', root));
                            }
                            if (event === 'finalize-end') {
                                generatePath(parent);
                            }
                        }
                    }
                    if (!isNOU(result.files)) {
                        // tslint:disable-next-line
                        setDateObject(result.files);
                        for (let i: number = 0, len: number = result.files.length; i < len; i++) {
                            let item: Object = result.files[i];
                            setValue('_fm_iconClass', fileType(item), item);
                        }
                        if (getValue('action', data) === 'read') {
                            setNodeId(result, id);
                            setValue(id, result.files, parent.feFiles);
                        }
                    }
                    if (!isNOU(result.details) && !isNOU(parent.rootAliasName)) {
                        let rootName: string = parent.rootAliasName || getValue('name', result.details);
                        let location: string = getValue('location', result.details).replace(new RegExp('/', 'g'), '\\');
                        if ((getValue('path', data) === '/') || (parent.hasId && getValue('path', data).match(/[/]/g).length === 1)) {
                            if (getValue('names', data).length === 0) {
                                setValue('name', rootName, result.details);
                                location = rootName;
                            } else {
                                location = location.replace(location.substring(0, location.indexOf('\\')), rootName);
                            }
                        } else {
                            location = location.replace(location.substring(0, location.indexOf('\\')), rootName);
                        }
                        setValue('location', location, result.details);
                    }
                    fn(parent, result, event, operation, targetPath);
                    if (!isNOU(result.files) && (event === 'path-changed' || event === 'finalize-end' || event === 'open-end')) {
                        parent.notify(events.searchTextChange, result);
                    }
                    if (typeof getValue('onSuccess', beforeSendArgs.ajaxSettings) === 'function') {
                        getValue('onSuccess', beforeSendArgs.ajaxSettings)();
                    }
                },
                onFailure: () => {
                    let result: ReadArgs = {
                        files: null,
                        error: {
                            code: '404',
                            message: 'NetworkError: Failed to send on XMLHTTPRequest: Failed to load ' + parent.ajaxSettings.url,
                            fileExists: null
                        },
                    };
                    triggerAjaxFailure(parent, beforeSendArgs, fn, result, event, operation, targetPath);
                }
            });
            ajax.send();
        }
    });
}
function triggerAjaxFailure(
    parent: IFileManager, beforeSendArgs: BeforeSendEventArgs, fn: Function,
    result: ReadArgs, event?: string, operation?: string, targetPath?: string): void {
    parent.notify(events.afterRequest, { action: 'failure' });
    fn(parent, result, event, operation, targetPath);
    if (typeof getValue('onFailure', beforeSendArgs.ajaxSettings) === 'function') {
        getValue('onFailure', beforeSendArgs.ajaxSettings)();
    }
}
function readSuccess(parent: IFileManager, result: ReadArgs, event: string): void {
    if (!isNOU(result.files)) {
        parent.notify(event, result);
        parent.notify(events.selectionChanged, {});
        let args: SuccessEventArgs = { action: 'read', result: result };
        parent.trigger('success', args);
    } else {
        if (result.error.code === '401') {
            result.files = [];
            parent.notify(event, result);
            parent.notify(events.selectionChanged, {});
        }
        onFailure(parent, result, 'read');
    }
    if (parent.isDragDrop && parent.isDropEnd) {
        if (parent.droppedObjects.length !== 0) {
            let args: FileDragEventArgs = { fileDetails: parent.droppedObjects };
            parent.trigger('fileDropped', args);
        }
        parent.isDropEnd = parent.isDragDrop = false;
    }
}

function filterSuccess(parent: IFileManager, result: ReadArgs, event: string, action: string): void {
    if (!isNOU(result.files)) {
        parent.notify(event, result);
        let args: SuccessEventArgs = { action: action, result: result };
        parent.trigger('success', args);
    } else {
        onFailure(parent, result, action);
    }
}

/* istanbul ignore next */
function createSuccess(parent: IFileManager, result: ReadArgs, itemName: string): void {
    if (!isNOU(result.files)) {
        if (parent.dialogObj && parent.dialogObj.visible) { parent.dialogObj.hide(); }
        parent.createdItem = result.files[0];
        parent.breadcrumbbarModule.searchObj.value = '';
        let args: SuccessEventArgs = { action: 'create', result: result };
        parent.trigger('success', args);
        parent.itemData = [getPathObject(parent)];
        read(parent, events.createEnd, parent.path);
    } else {
        if (result.error.code === '400') {
            if (parent.dialogObj && parent.dialogObj.visible) {
                let ele: HTMLInputElement = select('#newname', parent.dialogObj.element) as HTMLInputElement;
                let error: string = getLocaleText(parent, 'Validation-NewFolder-Exists').replace('{0}', '"' + ele.value + '"');
                ele.parentElement.nextElementSibling.innerHTML = error;
            } else {
                let result: ReadArgs = {
                    files: null,
                    error: {
                        code: '400',
                        message: getLocaleText(parent, 'Validation-NewFolder-Exists').replace('{0}', '"' + itemName + '"'),
                        fileExists: null
                    }
                };
                createDialog(parent, 'Error', result);
            }
            let args: FailureEventArgs = { action: 'create', error: result.error };
            parent.trigger('failure', args);
        } else {
            if (parent.dialogObj && parent.dialogObj.visible) { parent.dialogObj.hide(); }
            onFailure(parent, result, 'create');
        }
    }
}

/**
 * Function to rename the folder/file in File Manager.
 * @private
 */
/* istanbul ignore next */
function renameSuccess(parent: IFileManager, result: ReadArgs, path: string): void {
    if (!isNOU(result.files)) {
        if (!isNOU(parent.dialogObj)) { parent.dialogObj.hide(); }
        let args: SuccessEventArgs = { action: 'rename', result: result };
        parent.trigger('success', args);
        parent.renamedItem = result.files[0];
        if (parent.activeModule === 'navigationpane') {
            parent.pathId.pop();
            parent.itemData = [getValue(parent.pathId[parent.pathId.length - 1], parent.feParent)];
            read(parent, events.renameEndParent, getParentPath(parent.path));
        } else {
            parent.itemData = [getPathObject(parent)];
            if (parent.breadcrumbbarModule.searchObj.value !== '') {
                Search(parent, events.renameEnd, parent.path, parent.searchWord, parent.showHiddenItems, !parent.searchSettings.ignoreCase);
            } else {
                if (parent.isFiltered) {
                    filter(parent, events.renameEnd);
                } else {
                    read(parent, events.renameEnd, parent.path);
                }
            }
        }
    } else {
        if (result.error.code === '400' && parent.dialogObj && parent.dialogObj.visible) {
            let ele: HTMLInputElement = select('#rename', parent.dialogObj.element) as HTMLInputElement;
            let error: string = getLocaleText(parent, 'Validation-Rename-Exists').replace('{0}', '"' + parent.currentItemText + '"');
            error = error.replace('{1}', '"' + ele.value + '"');
            ele.parentElement.nextElementSibling.innerHTML = error;
            let args: FailureEventArgs = { action: 'rename', error: result.error };
            parent.trigger('failure', args);
        } else {
            if (!isNOU(parent.dialogObj)) { parent.dialogObj.hide(); }
            onFailure(parent, result, 'rename');
        }
    }
}


/**
 * Function to create new folder in File Manager.
 * @private
 */
/* istanbul ignore next */
function pasteSuccess(
    // tslint:disable-next-line
    parent: IFileManager, result: ReadArgs, path: string, operation: string): void {
    if (result.error && result.error.fileExists) {
        parent.fileLength = 0;
        if (!isNOU(result.files)) {
            parent.isPasteError = true;
            doPasteUpdate(parent, operation, result);
        }
        createExtDialog(parent, 'DuplicateItems', result.error.fileExists);
        if (result.error.code === '404') {
            createDialog(parent, 'Error', result);
        }
    } else if (!result.error && !isNOU(result.files)) {
        parent.isPasteError = false;
        doPasteUpdate(parent, operation, result);
    } else if (result.error && !isNOU(result.files)) {
        parent.isPasteError = true;
        doPasteUpdate(parent, operation, result);
        createDialog(parent, 'Error', result);
    } else {
        onFailure(parent, result, operation);
    }
}

/* istanbul ignore next */
function deleteSuccess(parent: IFileManager, result: ReadArgs, path: string): void {
    if (!isNOU(result.files)) {
        parent.setProperties({ path: path }, true);
        parent.itemData = [getPathObject(parent)];
        read(parent, events.deleteEnd, parent.path);
        if (result.error) {
            onFailure(parent, result, 'delete');
        } else {
            let args: SuccessEventArgs = { action: 'delete', result: result };
            parent.trigger('success', args);
        }
    } else {
        onFailure(parent, result, 'delete');
    }
}
/* istanbul ignore next */
function detailsSuccess(
    // tslint:disable-next-line
    parent: IFileManager, result: ReadArgs, path: string, operation: string): void {
    if (!isNOU(result.details)) {
        createDialog(parent, operation, null, <FileDetails>result.details);
        let args: SuccessEventArgs = { action: 'details', result: result };
        parent.trigger('success', args);
    } else {
        onFailure(parent, result, 'details');
    }
}

function onFailure(parent: IFileManager, result: ReadArgs, action: string): void {
    createDialog(parent, 'Error', result);
    let args: FailureEventArgs = { action: action, error: result.error };
    parent.trigger('failure', args);
}
/* istanbul ignore next */
export function Search(
    // tslint:disable-next-line
    parent: IFileManager, event: string, path: string, searchString: string, showHiddenItems?: boolean, caseSensitive?: boolean): void {
    let data: Object = {
        action: 'search', path: path, searchString: searchString, showHiddenItems: showHiddenItems, caseSensitive: caseSensitive,
        data: parent.itemData
    };
    createAjax(parent, data, searchSuccess, event);
}
/* istanbul ignore next */
function searchSuccess(parent: IFileManager, result: ReadArgs, event: string): void {
    if (!isNOU(result.files)) {
        parent.notify(event, result);
        let args: SuccessEventArgs = { action: 'search', result: result };
        parent.trigger('success', args);
    } else {
        onFailure(parent, result, 'search');
    }
}
/* istanbul ignore next */
export function Download(parent: IFileManager, path: string, items: string[]): void {
    let downloadUrl: string = parent.ajaxSettings.downloadUrl ? parent.ajaxSettings.downloadUrl : parent.ajaxSettings.url;
    let data: Object = { 'action': 'download', 'path': path, 'names': items, 'data': parent.itemData };
    let eventArgs: BeforeDownloadEventArgs = { data: data, cancel: false };
    parent.trigger('beforeDownload', eventArgs, (downloadArgs: BeforeDownloadEventArgs) => {
        if (!downloadArgs.cancel) {
            let form: HTMLElement = createElement('form', {
                id: parent.element.id + '_downloadForm',
                attrs: { action: downloadUrl, method: 'post', name: 'downloadForm', 'download': '' }
            });
            let input: HTMLElement =
                createElement('input', {
                    id: parent.element.id + '_hiddenForm',
                    attrs: { name: 'downloadInput', value: JSON.stringify(downloadArgs.data), type: 'hidden' }
                });
            form.appendChild(input);
            parent.element.appendChild(form);
            document.forms.namedItem('downloadForm').submit();
            parent.element.removeChild(form);
        }
    });
}
