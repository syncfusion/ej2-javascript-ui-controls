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
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {string} event - specifies the event.
 * @param {string} path - specifies the path.
 * @returns {void}
 * @private
 */
export function read(parent: IFileManager, event: string, path: string): void {
    // eslint-disable-next-line
    const itemData: Object[] = parent.itemData;
    for (let i: number = 0; i < itemData.length; i++) {
        if (isNOU(getValue('hasChild', itemData[i]))) { setValue('hasChild', false, itemData[i]); }
    }
    // eslint-disable-next-line
    const data: Object = { action: 'read', path: path, showHiddenItems: parent.showHiddenItems, data: itemData };
    createAjax(parent, data, readSuccess, event);
}

/**
 * Function to create new folder in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {string} itemName - specifies the item name.
 * @returns {void}
 * @private
 */
export function createFolder(parent: IFileManager, itemName: string): void {
    // eslint-disable-next-line
    const data: Object = { action: 'create', path: parent.path, name: itemName, data: parent.itemData };
    createAjax(parent, data, createSuccess, itemName);
}

/**
 * Function to filter the files in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {string}  event - specifies the event.
 * @returns {void}
 * @private
 */
export function filter(parent: IFileManager, event: string): void {
    // eslint-disable-next-line
    const data: Object = { action: 'filter', path: parent.path, showHiddenItems: parent.showHiddenItems, data: [getPathObject(parent)] };
    // eslint-disable-next-line
    let filterData: Object;
    // eslint-disable-next-line
    const filterDataVal: Object = parent.filterData ? extend(filterData, data, parent.filterData) : data;
    createAjax(parent, filterData, filterSuccess, event, getValue('action', filterDataVal));
}

/**
 * Function to rename the folder/file in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {string} path - specifies the path.
 * @param {string} itemNewName - specifies the item's new name.
 * @returns {void}
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
    // eslint-disable-next-line
    const data: Object = {
        action: 'rename', path: path, name: name, newName: newName, data: parent.itemData
    };
    createAjax(parent, data, renameSuccess, path);
}


/**
 * Function to paste file's and folder's in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {string} path - specifies the path.
 * @param {string[]} names - specifies the names.
 * @param {string} targetPath - specifies the target path.
 * @param {string} pasteOperation - specifies the paste operation.
 * @param {string[]} renameItems - specifies the rename items.
 * @param {Object[]} actionRecords - specifies the action records.
 * @returns {void}
 * @private
 */
export function paste(
    parent: IFileManager, path: string, names: string[], targetPath: string, pasteOperation: string,
    // eslint-disable-next-line
    renameItems?: string[], actionRecords?: Object[]): void {
    // eslint-disable-next-line
    const data: Object = {
        action: pasteOperation, path: path, targetData: parent.itemData[0],
        targetPath: targetPath, names: names, renameFiles: renameItems, data: actionRecords
    };
    parent.destinationPath = targetPath;
    createAjax(parent, data, pasteSuccess, path, pasteOperation, targetPath);
}

/**
 * Function to delete file's and folder's in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {string[]} items - specifies the items.
 * @param {string} path - specifies the path.
 * @param {string} operation - specifies the operation.
 * @returns {void}
 * @private
 */
export function Delete(parent: IFileManager, items: string[], path: string, operation: string): void {
    // eslint-disable-next-line
    const data: Object = { action: operation, path: path, names: items, data: parent.itemData };
    createAjax(parent, data, deleteSuccess, path);
}

/* istanbul ignore next */
/**
 * Function to get details of file's and folder's in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {string[]} names - specifies the names.
 * @param {string} path - specifies the path.
 * @param {string} operation - specifies the operation data.
 * @returns {void}
 * @private
 */
export function GetDetails(parent: IFileManager, names: string[], path: string, operation: string): void {
    // eslint-disable-next-line
    const data: Object = { action: operation, path: path, names: names, data: parent.itemData };
    createAjax(parent, data, detailsSuccess, path, operation);
}
/**
 * Function for createAjax in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {Object} data - specifies the data.
 * @param {Function} fn - specifies the fn.
 * @param {string} event - specifies the event.
 * @param {string} operation - specifies the operation.
 * @param {string} targetPath - specifies the target path.
 * @returns {void}
 * @private
 */
function createAjax(
    // eslint-disable-next-line
    parent: IFileManager, data: Object, fn: Function, event?: string,
    operation?: string, targetPath?: string): void {
    // eslint-disable-next-line
    const ajaxSettings: Object = {
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
    const eventArgs: BeforeSendEventArgs = { action: getValue('action', data), ajaxSettings: ajaxSettings, cancel: false };
    parent.trigger('beforeSend', eventArgs, (beforeSendArgs: BeforeSendEventArgs) => {
        if (!beforeSendArgs.cancel) {
            parent.notify(events.beforeRequest, {});
            const ajax: Ajax = new Ajax({
                url: getValue('url', beforeSendArgs.ajaxSettings),
                type: getValue('type', beforeSendArgs.ajaxSettings),
                mode: getValue('mode', beforeSendArgs.ajaxSettings),
                dataType: getValue('dataType', beforeSendArgs.ajaxSettings),
                contentType: getValue('contentType', beforeSendArgs.ajaxSettings),
                data: getValue('data', beforeSendArgs.ajaxSettings),
                beforeSend: getValue('beforeSend', beforeSendArgs.ajaxSettings),
                onSuccess: (result: ReadArgs) => {
                    if (isNOU(result)) {
                        const result: ReadArgs = {
                            error: {
                                fileExists: null,
                                message: getLocaleText(parent, 'Server-Error') + ' ' + parent.ajaxSettings.url,
                                code: '406'
                            },
                            files: null
                        };
                        triggerAjaxFailure(parent, beforeSendArgs, fn, result, event, operation, targetPath);
                        return;
                    }
                    if (typeof (result) === 'string') {
                        result = JSON.parse(result);
                    }
                    parent.notify(events.afterRequest, { action: 'success' });
                    const id: string = parent.expandedId ? parent.expandedId : parent.pathId[parent.pathId.length - 1];
                    if (!isNOU(result.cwd) && (getValue('action', data) === 'read')) {
                        result.cwd.name = (parent.pathId.length === 1) ? (parent.rootAliasName || result.cwd.name) : result.cwd.name;
                        setValue('_fm_id', id, result.cwd);
                        setValue(id, result.cwd, parent.feParent);
                        if (!isNOU(result.files) || result.error.code === '401') {
                            if ((event === 'finalize-end' || event === 'initial-end') && parent.pathNames.length === 0) {
                                // eslint-disable-next-line
                                const root: Object = getValue(parent.pathId[0], parent.feParent);
                                parent.pathNames[0] = getValue('name', root);
                                parent.hasId = !isNOU(getValue('id', root));
                            }
                            if (event === 'finalize-end') {
                                generatePath(parent);
                            }
                        }
                    }
                    if (!isNOU(result.files)) {
                        setDateObject(result.files);
                        for (let i: number = 0, len: number = result.files.length; i < len; i++) {
                            // eslint-disable-next-line
                            const item: Object = result.files[i];
                            setValue('_fm_iconClass', fileType(item), item);
                        }
                        if (getValue('action', data) === 'read') {
                            setNodeId(result, id);
                            setValue(id, result.files, parent.feFiles);
                        }
                    }
                    if (!isNOU(result.details) && !isNOU(parent.rootAliasName)) {
                        const rootName: string = parent.rootAliasName || getValue('name', result.details);
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
                    const result: ReadArgs = {
                        files: null,
                        error: {
                            code: '404',
                            message: getLocaleText(parent, 'Network-Error') + ' ' + parent.ajaxSettings.url,
                            fileExists: null
                        }
                    };
                    triggerAjaxFailure(parent, beforeSendArgs, fn, result, event, operation, targetPath);
                }
            });
            ajax.send();
        }
    });
}
/**
 * Function for trigger Ajax failure in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {BeforeSendEventArgs} beforeSendArgs - specifies the beforeSendArgs.
 * @param {Function} fn - specifies the function.
 * @param {ReadArgs} result - specifies the result.
 * @param {string} event - specifies the event.
 * @param {string} operation - specifies the operation.
 * @param {string} targetPath - specifies the targetPath.
 * @returns {void}
 * @private
 */
function triggerAjaxFailure(
    // eslint-disable-next-line
    parent: IFileManager, beforeSendArgs: BeforeSendEventArgs, fn: Function,
    result: ReadArgs, event?: string, operation?: string, targetPath?: string): void {
    parent.notify(events.afterRequest, { action: 'failure' });
    fn(parent, result, event, operation, targetPath);
    if (typeof getValue('onFailure', beforeSendArgs.ajaxSettings) === 'function') {
        getValue('onFailure', beforeSendArgs.ajaxSettings)();
    }
}
/**
 * Function for read success in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {ReadArgs} result - specifies the result.
 * @param {string} event - specifies the event.
 * @returns {void}
 * @private
 */
function readSuccess(parent: IFileManager, result: ReadArgs, event: string): void {
    if (!isNOU(result.files)) {
        parent.notify(event, result);
        parent.notify(events.selectionChanged, {});
        const args: SuccessEventArgs = { action: 'read', result: result };
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
            const args: FileDragEventArgs = { fileDetails: parent.droppedObjects };
            parent.trigger('fileDropped', args);
        }
        parent.isDropEnd = parent.isDragDrop = false;
    }
}

/**
 * Function for filter success in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {ReadArgs} result - specifies the result.
 * @param {string} event - specifies the event.
 * @param {string} action - specifies the action.
 * @returns {void}
 * @private
 */
function filterSuccess(parent: IFileManager, result: ReadArgs, event: string, action: string): void {
    if (!isNOU(result.files)) {
        parent.notify(event, result);
        const args: SuccessEventArgs = { action: action, result: result };
        parent.trigger('success', args);
    } else {
        onFailure(parent, result, action);
    }
}

/* istanbul ignore next */
/**
 * Function for create success in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {ReadArgs} result - specifies the result.
 * @param {string} itemName - specifies the item name.
 * @returns {void}
 * @private
 */
function createSuccess(parent: IFileManager, result: ReadArgs, itemName: string): void {
    if (!isNOU(result.files)) {
        if (parent.dialogObj && parent.dialogObj.visible) { parent.dialogObj.hide(); }
        parent.createdItem = result.files[0];
        parent.breadcrumbbarModule.searchObj.value = '';
        const args: SuccessEventArgs = { action: 'create', result: result };
        parent.trigger('success', args);
        parent.itemData = [getPathObject(parent)];
        read(parent, events.createEnd, parent.path);
    } else {
        if (result.error.code === '400') {
            if (parent.dialogObj && parent.dialogObj.visible) {
                const ele: HTMLInputElement = select('#newname', parent.dialogObj.element) as HTMLInputElement;
                const error: string = getLocaleText(parent, 'Validation-NewFolder-Exists').replace('{0}', '"' + ele.value + '"');
                ele.parentElement.nextElementSibling.innerHTML = error;
            } else {
                const result: ReadArgs = {
                    files: null,
                    error: {
                        code: '400',
                        message: getLocaleText(parent, 'Validation-NewFolder-Exists').replace('{0}', '"' + itemName + '"'),
                        fileExists: null
                    }
                };
                createDialog(parent, 'Error', result);
            }
            const args: FailureEventArgs = { action: 'create', error: result.error };
            parent.trigger('failure', args);
        } else {
            if (parent.dialogObj && parent.dialogObj.visible) { parent.dialogObj.hide(); }
            onFailure(parent, result, 'create');
        }
    }
}

/* istanbul ignore next */
/**
 * Function to rename the folder/file in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {ReadArgs} result - specifies the result.
 * @param {string} path - specifies the path
 * @returns {void}
 * @private
 */
function renameSuccess(parent: IFileManager, result: ReadArgs, path: string): void {
    if (!isNOU(result.files)) {
        if (!isNOU(parent.dialogObj)) { parent.dialogObj.hide(); }
        const args: SuccessEventArgs = { action: 'rename', result: result };
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
            const ele: HTMLInputElement = select('#rename', parent.dialogObj.element) as HTMLInputElement;
            let error: string = getLocaleText(parent, 'Validation-Rename-Exists').replace('{0}', '"' + parent.currentItemText + '"');
            error = error.replace('{1}', '"' + ele.value + '"');
            ele.parentElement.nextElementSibling.innerHTML = error;
            const args: FailureEventArgs = { action: 'rename', error: result.error };
            parent.trigger('failure', args);
        } else {
            if (!isNOU(parent.dialogObj)) { parent.dialogObj.hide(); }
            onFailure(parent, result, 'rename');
        }
    }
}

/* istanbul ignore next */
/**
 * Function to create new folder in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {ReadArgs} result - specifies the result.
 * @param {string} path - specifies the path.
 * @param {string} operation - specifies the operation.
 * @returns {void}
 * @private
 */
function pasteSuccess(
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

/**
 * Function to delete success in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {ReadArgs} result - specifies the result.
 * @param {string} path - specifies the path.
 * @returns {void}
 * @private
 */
function deleteSuccess(parent: IFileManager, result: ReadArgs, path: string): void {
    if (!isNOU(result.files)) {
        parent.setProperties({ path: path }, true);
        parent.itemData = [getPathObject(parent)];
        read(parent, events.deleteEnd, parent.path);
        if (result.error) {
            onFailure(parent, result, 'delete');
        } else {
            const args: SuccessEventArgs = { action: 'delete', result: result };
            parent.trigger('success', args);
        }
    } else {
        onFailure(parent, result, 'delete');
    }
}
/**
 * Function for details success in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {ReadArgs} result - specifies the result.
 * @param {string} path - specifies the path.
 * @param {string} operation - specifies the operation.
 * @returns {void}
 * @private
 */
function detailsSuccess(
    // eslint:disable-next-line
    parent: IFileManager, result: ReadArgs, path: string, operation: string): void {
    if (!isNOU(result.details)) {
        createDialog(parent, operation, null, <FileDetails>result.details);
        const args: SuccessEventArgs = { action: 'details', result: result };
        parent.trigger('success', args);
    } else {
        onFailure(parent, result, 'details');
    }
}
/**
 * Function for on failure event in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {ReadArgs} result - specifies the result.
 * @param {string} action - specifies the action.
 * @returns {void}
 * @private
 */
function onFailure(parent: IFileManager, result: ReadArgs, action: string): void {
    createDialog(parent, 'Error', result);
    const args: FailureEventArgs = { action: action, error: result.error };
    parent.trigger('failure', args);
}
/**
 * Function for search in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {string} event - specifies the event.
 * @param {string} path - specifies the path.
 * @param {string} searchString - specifies the search string.
 * @param {boolean} showHiddenItems - specifies the hidden items.
 * @param {boolean} caseSensitive - specifies the casing of search text.
 * @returns {void}
 * @private
 */
export function Search(
    // eslint:disable-next-line
    parent: IFileManager, event: string, path: string, searchString: string, showHiddenItems?: boolean, caseSensitive?: boolean): void {
    // eslint-disable-next-line
    const data: Object = {
        action: 'search', path: path, searchString: searchString, showHiddenItems: showHiddenItems, caseSensitive: caseSensitive,
        data: parent.itemData
    };
    createAjax(parent, data, searchSuccess, event);
}

/* istanbul ignore next */
/**
 * Function for search success in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {ReadArgs} result - specifies the result.
 * @param {string} event - specifies the event.
 * @returns {void}
 * @private
 */
function searchSuccess(parent: IFileManager, result: ReadArgs, event: string): void {
    if (!isNOU(result.files)) {
        parent.notify(event, result);
        const args: SuccessEventArgs = { action: 'search', result: result };
        parent.trigger('success', args);
    } else {
        onFailure(parent, result, 'search');
    }
}
/* istanbul ignore next */
/**
 * Function for download in File Manager.
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {string} path - specifies the path.
 * @param {string[]} items - specifies the items.
 * @returns {void}
 * @private
 */
export function Download(parent: IFileManager, path: string, items: string[]): void {
    const downloadUrl: string = parent.ajaxSettings.downloadUrl ? parent.ajaxSettings.downloadUrl : parent.ajaxSettings.url;
    // eslint-disable-next-line
    const data: Object = { 'action': 'download', 'path': path, 'names': items, 'data': parent.itemData };
    const eventArgs: BeforeDownloadEventArgs = { data: data, cancel: false };
    parent.trigger('beforeDownload', eventArgs, (downloadArgs: BeforeDownloadEventArgs) => {
        if (!downloadArgs.cancel) {
            const form: HTMLElement = createElement('form', {
                id: parent.element.id + '_downloadForm',
                attrs: { action: downloadUrl, method: 'post', name: 'downloadForm', 'download': '' }
            });
            const input: HTMLElement =
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
