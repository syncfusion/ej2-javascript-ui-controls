import { Ajax, isNullOrUndefined, createElement, select } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, setValue, getValue } from '@syncfusion/ej2-base';
import { IFileManager, ReadArgs, FileBeforeSendEventArgs, ITreeView } from '../base/interface';
import * as events from '../base/constant';
import { createDialog } from '../pop-up/dialog';
import { FileDetails } from '../../index';
import { fileType, setNodeId, getLocaleText, setDateObject } from '../common/utility';

/**
 * Function to read the content from given path in File Manager.
 * @private
 */
export function read(parent: IFileManager, event: string, path: string): void {
    let data: Object = { action: 'Read', path: path, showHiddenItems: parent.showHiddenItems, data: parent.itemData };
    createAjax(parent, data, readSuccess, event);
}

/**
 * Function to create new folder in File Manager.
 * @private
 */
export function createFolder(parent: IFileManager, itemName: string): void {
    let data: Object = { action: 'CreateFolder', path: parent.path, name: itemName, data: parent.itemData };
    createAjax(parent, data, createSuccess);
}

/* Function to rename the folder/file in File Manager.
* @private
*/
export function rename(parent: IFileManager, itemNewName: string): void {
    let data: Object = {
        action: 'Rename', path: parent.path, name: parent.currentItemText, itemNewName: itemNewName,
        data: parent.itemData
    };
    createAjax(parent, data, renameSuccess, parent.path);
}


/**
 * Function to paste file's and folder's in File Manager.
 * @private
 */
export function paste(
    // tslint:disable-next-line
    parent: IFileManager, path: string, names: string[], targetPath: string, pasteOperation: string,
    navigationPane?: ITreeView, replaceItems?: string[]): void {
    let data: Object = {
        action: pasteOperation, path: path,
        targetPath: targetPath, itemNames: names, CommonFiles: replaceItems
    };
    createAjax(parent, data, pasteSuccess, path, navigationPane, pasteOperation, targetPath);
}

/**
 * Function to delete file's and folder's in File Manager.
 * @private
 */
export function Delete(parent: IFileManager, items: string[], path: string, operation: string, treeView: ITreeView): void {
    let data: Object = { action: operation, targetPath: path, itemNames: items };
    createAjax(parent, data, deleteSuccess, path, treeView);
}

/**
 * Function to get details of file's and folder's in File Manager.
 * @private
 */
/* istanbul ignore next */
export function GetDetails(parent: IFileManager, itemNames: string[], path: string, operation: string): void {
    let data: Object = { action: operation, targetPath: path, itemNames: itemNames };
    createAjax(parent, data, detailsSuccess, path, null, operation);
}

function createAjax(
    parent: IFileManager, data: Object, fn: Function, event?: string,
    navigationPane?: ITreeView, operation?: string, targetPath?: string): void {
    let ajaxSettings: Object = {
        url: parent.ajaxSettings.url,
        type: 'POST',
        mode: true,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        onSuccess: null,
        onFailure: null,
    };
    let eventArgs: FileBeforeSendEventArgs = { action: getValue('action', data), ajaxSettings: ajaxSettings, cancel: false };
    parent.trigger('beforeSend', eventArgs);
    if (eventArgs.cancel) {
        return;
    }
    parent.notify(events.beforeRequest, {});
    let ajax: Ajax = new Ajax({
        url: getValue('url', eventArgs.ajaxSettings),
        type: getValue('type', eventArgs.ajaxSettings),
        mode: getValue('mode', eventArgs.ajaxSettings),
        dataType: getValue('dataType', eventArgs.ajaxSettings),
        contentType: getValue('contentType', eventArgs.ajaxSettings),
        data: getValue('data', eventArgs.ajaxSettings),
        onSuccess: (result: ReadArgs) => {
            parent.notify(events.afterRequest, { action: 'success' });
            if (!isNOU(result.files)) {
                // tslint:disable-next-line
                setDateObject(result.files);
                for (let i: number = 0, len: number = result.files.length; i < len; i++) {
                    let item: Object = result.files[i];
                    setValue('iconClass', fileType(item), item);
                }
            }
            if (getValue('action', data) === 'Read') {
                let path: string = getValue('path', data);
                setNodeId(result, parent.expandedId ? parent.expandedId : parent.pathId[parent.pathId.length - 1]);
                setValue(path, result.files, parent.feFiles);
                setValue(path, result.cwd, parent.feParent);
            }
            fn(parent, result, event, navigationPane, operation, targetPath);
            if (typeof getValue('onSuccess', eventArgs.ajaxSettings) === 'function') {
                getValue('onSuccess', eventArgs.ajaxSettings)();
            }
        },
        onFailure: () => {
            let result: ReadArgs = {
                files: null,
                error: {
                    code: '404',
                    message: 'NetworkError: Faild to send on XMLHTTPRequest: Failed to load ' + parent.ajaxSettings.url,
                    fileExists: null
                },
            };
            parent.notify(events.afterRequest, { action: 'failure' });
            fn(parent, result, event, navigationPane, operation, targetPath);
            if (typeof getValue('onFailure', eventArgs.ajaxSettings) === 'function') {
                getValue('onFailure', eventArgs.ajaxSettings)();
            }
        }
    });
    ajax.send();
}

function readSuccess(parent: IFileManager, result: ReadArgs, event: string): void {
    if (!isNOU(result.files)) {
        parent.notify(event, result);
        parent.notify(events.selectionChanged, {});
        parent.trigger('onSuccess', { action: 'Read', result: result });
    } else {
        onFailure(parent, result, 'Read');
    }
}
/* istanbul ignore next */
function createSuccess(parent: IFileManager, result: ReadArgs): void {
    if (!isNOU(result.files)) {
        parent.dialogObj.hide();
        parent.createdItem = result.files[0];
        parent.trigger('onSuccess', { action: 'CreateFolder', result: result });
        read(parent, events.createEnd, parent.path);
    } else {
        if (result.error.code === '400') {
            let ele: HTMLInputElement = select('#newname', parent.dialogObj.element) as HTMLInputElement;
            let error: string = getLocaleText(parent, 'Validation-NewFolder-Exists').replace('{0}', '"' + ele.value + '"');
            ele.parentElement.nextElementSibling.innerHTML = error;
        } else {
            parent.dialogObj.hide();
            onFailure(parent, result, 'CreateFolder');
        }
    }
}

/* Function to rename the folder/file in File Manager.
 * @private
 */
/* istanbul ignore next */
function renameSuccess(parent: IFileManager, result: ReadArgs, path: string): void {
    if (!isNOU(result.files)) {
        parent.dialogObj.hide();
        parent.trigger('onSuccess', { action: 'Rename', result: result });
        parent.renamedItem = result.files[0];
        if (parent.selectedItems.length === 0 && parent.navigationpaneModule) {
            let treePath: string[] = parent.parentPath.split('/');
            let newPath: string = parent.parentPath.replace(treePath[treePath.length - 2] + '/', parent.renameText + '/');
            parent.setProperties({ path: newPath }, true);
        }
        read(parent, events.renameEnd, parent.path);
    } else {
        if (result.error.code === '400') {
            let ele: HTMLInputElement = select('#rename', parent.dialogObj.element) as HTMLInputElement;
            let error: string = getLocaleText(parent, 'Validation-Rename-Exists').replace('{0}', '"' + parent.currentItemText + '"');
            error = error.replace('{1}', '"' + ele.value + '"');
            ele.parentElement.nextElementSibling.innerHTML = error;
        } else {
            parent.dialogObj.hide();
            onFailure(parent, result, 'Rename');
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
    parent: IFileManager, result: ReadArgs, path: string, treeView: ITreeView, operation: string): void {
    if (result.error && result.error.fileExists) {
        parent.fileLength = 0;
        for (let i: number = 0; i < result.files.length; i++) {
            createDialog(parent, 'DuplicateItems', result, null, result.error.fileExists);
        }
        parent.detailsviewModule.pasteOperation = true;
        parent.largeiconsviewModule.pasteOperation = true;
        parent.duplicateItems = [];
    } else if (!result.error && !isNOU(result.files)) {
        parent.detailsviewModule.pasteOperation = true;
        parent.largeiconsviewModule.pasteOperation = true;
        parent.pasteNodes = parent.selectedNodes;
        read(parent as IFileManager, events.pathChanged, parent.path);
        if (operation === 'MoveTo' && treeView.treeNodes.length !== 0) {
            parent.selectedNodes = [];
            treeView.moveNode();
        } else if (operation === 'CopyTo' && treeView.copyNodes.length !== 0) {
            treeView.copyNode();
        }
        if (operation === 'MoveTo') {
            parent.enablePaste = false;
            parent.notify(events.hidePaste, {});
        }
        parent.trigger('onSuccess', { action: operation, result: result });
    } else {
        onFailure(parent, result, operation);
    }
}

/* istanbul ignore next */
function deleteSuccess(parent: IFileManager, result: ReadArgs, path: string): void {
    if (!isNOU(result.files)) {
        parent.setProperties({ path: path }, true);
        read(parent, events.deleteEnd, parent.path);
        parent.trigger('onSuccess', { action: 'Remove', result: result });
    } else {
        onFailure(parent, result, 'Remove');
    }
}
/* istanbul ignore next */
function detailsSuccess(
    // tslint:disable-next-line
    parent: IFileManager, result: ReadArgs, path: string, treeView: ITreeView, operation: string): void {
    if (!isNOU(result.details)) {
        createDialog(parent as IFileManager, operation, null, <FileDetails>result.details);
        parent.trigger('onSuccess', { action: 'GetDetails', result: result });
    } else {
        onFailure(parent, result, 'GetDetails');
    }
}

function onFailure(parent: IFileManager, result: ReadArgs, action: string): void {
    createDialog(parent, 'Error', result);
    parent.trigger('onError', { action: action, error: result.error });
}
/* istanbul ignore next */
export function Search(
    // tslint:disable-next-line
    parent: IFileManager, event: string, path: string, searchString: string, showHiddenItems?: boolean, caseSensitive?: boolean): void {
    let data: Object = { action: 'Search', path: path, searchString: searchString, showHiddenItems: showHiddenItems, caseSensitive: caseSensitive };
    createAjax(parent, data, searchSuccess, event);
}
/* istanbul ignore next */
function searchSuccess(parent: IFileManager, result: ReadArgs, event: string): void {
    if (!isNOU(result.files)) {
        parent.notify(event, result);
        parent.trigger('onSuccess', { action: 'Search', result: result });
    } else {
        onFailure(parent, result, 'Search');
    }
}
/* istanbul ignore next */
// tslint:disable-next-line
export function Download(parent: IFileManager, selectedRecords: Array<any>): void {
    let itemNames: string[] = [];
    let itemPath: string;
    let downloadUrl: string = parent.ajaxSettings.downloadUrl ? parent.ajaxSettings.downloadUrl : parent.ajaxSettings.url;
    for (let item: number = 0; item < selectedRecords.length; item++) {
        itemNames.push(selectedRecords[item].name);
        itemPath = selectedRecords[item].filterPath;
    }
    let data: Object = {
        'action': 'Download',
        'path': !isNullOrUndefined(itemPath) ? itemPath : parent.path,
        'itemNames': itemNames
    };
    let form: HTMLElement = createElement('form', {
        id: parent.element.id + '_downloadForm',
        attrs: { action: downloadUrl, method: 'post', name: 'downloadForm', 'download': '' }
    });
    let input: HTMLElement =
        createElement('input', {
            id: parent.element.id + '_hiddenForm',
            attrs: { name: 'downloadInput', value: JSON.stringify(data), type: 'hidden' }
        });
    form.appendChild(input);
    parent.element.appendChild(form);
    document.forms.namedItem('downloadForm').submit();
    parent.element.removeChild(form);
}