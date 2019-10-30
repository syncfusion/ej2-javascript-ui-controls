import { Dialog, BeforeOpenEventArgs, BeforeCloseEventArgs } from '@syncfusion/ej2-popups';
import { select, isNullOrUndefined as isNOU, createElement, Internationalization } from '@syncfusion/ej2-base';
import { getValue, remove, selectAll, isBlazor } from '@syncfusion/ej2-base';
import { IFileManager, ReadArgs, DialogOptions, FileDetails, FileDragEventArgs } from '../base/interface';
import { BeforePopupOpenCloseEventArgs, PopupOpenCloseEventArgs } from '../base/interface';
import { createFolder } from '../common/operations';
import * as CLS from '../base/classes';
import * as events from '../base/constant';
import { paste, rename } from '../common/operations';
import { getLocaleText, getDuplicateData, getParentPath, objectToString } from '../common/utility';
import { SelectedEventArgs, FileInfo, Input } from '@syncfusion/ej2-inputs';
import { CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';

// tslint:disable-next-line
export function createDialog(parent: IFileManager, text: string, e?: ReadArgs | SelectedEventArgs, details?: FileDetails, replaceItems?: string[]): void {
    let options: DialogOptions = getOptions(parent, text, e, details, replaceItems);
    if (isNOU(parent.dialogObj)) {
        parent.dialogObj = new Dialog({
            beforeOpen: keydownAction.bind(this, parent, options.dialogName),
            beforeClose: (args: BeforeCloseEventArgs) => {
                triggerPopupBeforeClose(parent, parent.dialogObj, args, options.dialogName);
            },
            header: options.header,
            content: options.content,
            buttons: options.buttons,
            animationSettings: { effect: 'None' },
            showCloseIcon: true,
            closeOnEscape: true,
            visible: true,
            allowDragging: true,
            isModal: true,
            target: '#' + parent.element.id,
            width: '350px',
            open: options.open,
            close: options.close,
            enableRtl: parent.enableRtl,
            locale: parent.locale
        });
        parent.dialogObj.isStringTemplate = true;
        parent.dialogObj.appendTo('#' + parent.element.id + CLS.DIALOG_ID);
    } else {
        changeOptions(parent, options);
    }
}
export function createExtDialog(parent: IFileManager, text: string, replaceItems?: string[], newPath?: string): void {
    let extOptions: DialogOptions = getExtOptions(parent, text, replaceItems, newPath);
    parent.isApplySame = false;
    if (isNOU(parent.extDialogObj)) {
        parent.extDialogObj = new Dialog({
            beforeOpen: beforeExtOpen.bind(this, parent, extOptions.dialogName),
            beforeClose: (args: BeforeCloseEventArgs) => {
                triggerPopupBeforeClose(parent, parent.extDialogObj, args, extOptions.dialogName);
            },
            content: extOptions.content,
            header: extOptions.header,
            closeOnEscape: true,
            allowDragging: true,
            animationSettings: { effect: 'None' },
            target: '#' + parent.element.id,
            enableRtl: parent.enableRtl,
            showCloseIcon: true,
            isModal: true,
            width: 350,
            buttons: extOptions.buttons,
            open: extOptions.open,
            close: extOptions.close,
            locale: parent.locale
        });
        parent.extDialogObj.isStringTemplate = true;
        parent.extDialogObj.appendTo('#' + parent.element.id + CLS.EXTN_DIALOG_ID);
    } else {
        parent.extDialogObj.header = extOptions.header;
        parent.extDialogObj.close = extOptions.close;
        parent.extDialogObj.open = extOptions.open;
        parent.extDialogObj.close = extOptions.close;
        parent.extDialogObj.content = extOptions.content;
        parent.extDialogObj.buttons = extOptions.buttons;
        parent.extDialogObj.enableRtl = parent.enableRtl;
        parent.extDialogObj.locale = parent.locale;
        parent.extDialogObj.dataBind();
        parent.extDialogObj.show();
    }
}

function triggerPopupBeforeOpen(parent: IFileManager, dlgModule: Dialog, args: BeforeOpenEventArgs, dialogName: string): void {
    let eventArgs: BeforePopupOpenCloseEventArgs = {
        cancel: args.cancel, popupName: dialogName, popupModule: dlgModule
    };
    /* istanbul ignore next */
    if (isBlazor()) { delete eventArgs.popupModule; }
    parent.trigger('beforePopupOpen', eventArgs, (eventargs: BeforePopupOpenCloseEventArgs) => {
        args.cancel = eventargs.cancel;
    });
}
function triggerPopupBeforeClose(parent: IFileManager, dlgModule: Dialog, args: BeforeCloseEventArgs, dialogName: string): void {
    let eventArgs: BeforePopupOpenCloseEventArgs = {
        cancel: args.cancel, popupModule: dlgModule, popupName: dialogName
    };
    /* istanbul ignore next */
    if (isBlazor()) { delete eventArgs.popupModule; }
    parent.trigger('beforePopupClose', eventArgs, (eventargs: BeforePopupOpenCloseEventArgs) => {
        args.cancel = eventargs.cancel;
        if (!args.cancel && args.isInteracted && ((dialogName === 'Rename') || (dialogName === 'Create Folder'))) {
            parent.trigger(events.actionFailure, {});
        }
    });
}
function triggerPopupOpen(parent: IFileManager, dlgModule: Dialog, dialogName: string): void {
    let args: PopupOpenCloseEventArgs = { popupModule: dlgModule, element: dlgModule.element, popupName: dialogName };
    /* istanbul ignore next */
    if (isBlazor()) { delete args.popupModule; }
    parent.trigger('popupOpen', args);
}

function triggerPopupClose(parent: IFileManager, dlgModule: Dialog, dialogName: string): void {
    let args: PopupOpenCloseEventArgs = { popupModule: dlgModule, element: dlgModule.element, popupName: dialogName };
    /* istanbul ignore next */
    if (isBlazor()) { delete args.popupModule; }
    parent.trigger('popupClose', args);
}

// tslint:disable-next-line:max-func-body-length
function getExtOptions(parent: IFileManager, text: string, replaceItems?: string[], newPath?: string): DialogOptions {
    let options: DialogOptions = {
        header: '', content: '', buttons: [], dialogName: ''
    };
    options.open = () => { triggerPopupOpen(parent, parent.extDialogObj, options.dialogName); };
    options.close = () => { triggerPopupClose(parent, parent.extDialogObj, options.dialogName); };
    switch (text) {
        case 'Extension':
            options.header = getLocaleText(parent, 'Header-Rename-Confirmation');
            options.content = '<div>' + getLocaleText(parent, 'Content-Rename-Confirmation') + '</div>';
            options.buttons = [{
                buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                click: () => {
                    parent.extDialogObj.hide();
                    rename(parent, newPath, parent.renameText);
                }
            },
            {
                buttonModel: { content: getLocaleText(parent, 'Button-No') },
                click: () => {
                    parent.extDialogObj.hide();
                    parent.dialogObj.hide();
                }
            }];
            options.dialogName = 'Extension Change';
            break;
        case 'DuplicateItems':
            options.dialogName = 'Duplicate Items';
            parent.replaceItems = replaceItems;
            let item: string = parent.replaceItems[parent.fileLength];
            let index: number = item.lastIndexOf('/');
            item = index === -1 ? item : item.substring(index);
            options.header = getLocaleText(parent, 'Header-Duplicate');
            let duplicateContent: string = '<div>' + getLocaleText(parent, 'Content-Duplicate') + '</div>';
            options.content = (duplicateContent).replace('{0}', item);
            options.close = () => {
                if (!parent.isDropEnd && parent.duplicateItems.length === 0) {
                    let args: FileDragEventArgs = { fileDetails: parent.droppedObjects };
                    parent.trigger('fileDropped', args);
                    parent.isDropEnd = parent.isDragDrop = false;
                }
                triggerPopupClose(parent, parent.extDialogObj, options.dialogName);
            };
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                    click: () => {
                        parent.duplicateItems.push(parent.replaceItems[parent.fileLength]);
                        parent.duplicateRecords.push(getDuplicateData(parent, parent.replaceItems[parent.fileLength]));
                        parent.fileLength++;
                        if (replaceItems[parent.fileLength]) {
                            let item: string = parent.replaceItems[parent.fileLength];
                            let indexval: number = item.lastIndexOf('/');
                            item = indexval === -1 ? item : item.substring(indexval);
                            parent.extDialogObj.content = (duplicateContent).replace('{0}', item);
                            parent.extDialogObj.show();
                        } else {
                            parent.extDialogObj.hide();
                            let targetPath: string = parent.isDragDrop ? parent.dragPath : parent.targetPath;
                            let path: string = parent.isDragDrop ? parent.dropPath : ((parent.folderPath === '') ? parent.path :
                                parent.folderPath);
                            let action: string = parent.isDragDrop ? 'move' : parent.fileAction;
                            paste(
                                parent, targetPath, parent.duplicateItems, path,
                                action, parent.duplicateItems, parent.duplicateRecords);
                        }
                    }
                },
                {
                    buttonModel: { content: getLocaleText(parent, 'Button-No') },
                    click: () => {
                        parent.fileLength++;
                        if (replaceItems[parent.fileLength]) {
                            let item: string = parent.replaceItems[parent.fileLength];
                            let ind: number = item.lastIndexOf('/');
                            item = ind === -1 ? item : item.substring(ind);
                            parent.extDialogObj.content = (duplicateContent).replace('{0}', item);
                            parent.extDialogObj.show();
                        } else {
                            parent.extDialogObj.hide();
                            if (parent.duplicateItems.length !== 0) {
                                let action: string = parent.isDragDrop ? 'move' : parent.fileAction;
                                let targetPath: string = parent.isDragDrop ? parent.dragPath : parent.targetPath;
                                let path: string = parent.isDragDrop ? parent.dropPath : ((parent.folderPath === '') ? parent.path :
                                    parent.folderPath);
                                paste(
                                    parent, targetPath, parent.duplicateItems, path,
                                    action, parent.duplicateItems, parent.duplicateRecords);
                            }
                        }
                    },
                }
            ];
            break;
        case 'UploadRetry':
            options.dialogName = 'Retry Upload';
            options.header = getLocaleText(parent, 'Header-Retry');
            options.content = parent.retryFiles[0].name + '<div class="e-fe-retrycontent">' +
                (getLocaleText(parent, 'Content-Retry')) + '</div>';
            options.open = onRetryOpen.bind(this, parent);
            options.close = () => {
                parent.isRetryOpened = false;
                retryDlgClose(parent);
                triggerPopupClose(parent, parent.extDialogObj, options.dialogName);
            };
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Keep-Both') },
                    click: () => {
                        retryDlgUpdate(parent, true);
                    }
                },
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Replace') },
                    click: () => {
                        retryDlgUpdate(parent, false);
                    }
                },
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Skip') },
                    click: () => {
                        if (parent.isApplySame) {
                            parent.retryFiles = [];
                            retryDlgClose(parent);
                        } else {
                            parent.retryFiles.splice(0, 1);
                            (parent.retryFiles.length !== 0) ? createExtDialog(parent, 'UploadRetry') : retryDlgClose(parent);
                        }
                    }
                }
            ];
            break;
    }
    return options;
}
function retryDlgUpdate(parent: IFileManager, isKeepBoth: boolean): void {
    if (parent.isApplySame) {
        isKeepBoth ? onKeepBothAll(parent) : onReplaceAll(parent);
        retryDlgClose(parent);
    } else {
        parent.retryArgs.push({
            action: isKeepBoth ? 'keepboth' : 'replace',
            file: parent.retryFiles[0]
        });
        parent.uploadObj.retry(parent.retryFiles[0]);
        parent.retryFiles.splice(0, 1);
        (parent.retryFiles.length !== 0) ? createExtDialog(parent, 'UploadRetry') : retryDlgClose(parent);
    }
}

function retryDlgClose(parent: IFileManager): void {
    let flag: boolean = true;
    if (parent.isRetryOpened) { parent.isRetryOpened = false; } else { flag = false; }
    let ele: Element = select('.e-dlg-checkbox', parent.extDialogObj.element);
    if (ele) { remove(ele); }
    if (flag) { parent.extDialogObj.hide(); } else {
        parent.retryFiles = [];
    }
}

function onRetryOpen(parent: IFileManager, args: object): void {
    parent.isRetryOpened = true;
    let dialogEle: Element = getValue('element', args);
    let container: Element = select('.e-dlg-content', dialogEle);
    let checkContainer: Element = parent.createElement('div', {
        className: 'e-dlg-checkbox'
    });
    let checkbox: Element = parent.createElement('input', {
        id: parent.element.id + '_applyall'
    });
    checkContainer.appendChild(checkbox);
    container.appendChild(checkContainer);
    let checkBoxObj: CheckBox = new CheckBox({
        label: getLocaleText(parent, 'ApplyAll-Label'),
        change: (args: ChangeEventArgs) => {
            parent.isApplySame = args.checked;
        }
    });
    checkBoxObj.appendTo('#' + parent.element.id + '_applyall');
    triggerPopupOpen(parent, parent.extDialogObj, 'Retry Upload');
}

function onKeepBothAll(parent: IFileManager): void {
    while (parent.retryFiles.length !== 0) {
        parent.retryArgs.push({ action: 'keepboth', file: parent.retryFiles[0] });
        parent.uploadObj.retry(parent.retryFiles[0]);
        parent.retryFiles.splice(0, 1);
    }
}

function onReplaceAll(parent: IFileManager): void {
    while (parent.retryFiles.length !== 0) {
        parent.retryArgs.push({ action: 'replace', file: parent.retryFiles[0] });
        parent.uploadObj.retry(parent.retryFiles[0]);
        parent.retryFiles.splice(0, 1);
    }
}

function focusInput(parent: IFileManager): void {
    let ele: HTMLInputElement = (select('#newname', parent.dialogObj.element) as HTMLInputElement);
    ele.focus();
    ele.value = '';
    let len: number = ele.value.length;
    ele.setSelectionRange(0, len);
}

function onFolderDialogOpen(parent: IFileManager): void {
    let ele: HTMLInputElement = (select('#newname', parent.dialogObj.element) as HTMLInputElement);
    if (!ele.parentElement.classList.contains('e-control-wrapper')) {
        createInput(ele, getLocaleText(parent, 'Content-NewFolder'));
    }
    ele.parentElement.nextElementSibling.innerHTML = '';
    ele.oninput = () => {
        onValidate(parent, ele);
    };
    ele.onkeyup = (e: KeyboardEvent) => {
        let code: number = getKeyCode(e);
        if (code === 13) {
            onSubmit(parent);
        }
    };
    focusInput(parent);
    triggerPopupOpen(parent, parent.dialogObj, 'Create Folder');
}

function onRenameDialogOpen(parent: IFileManager): void {
    let inputEle: HTMLInputElement = (select('#rename', parent.dialogObj.element) as HTMLInputElement);
    if (!inputEle.parentElement.classList.contains('e-control-wrapper')) {
        createInput(inputEle, getLocaleText(parent, 'Content-Rename'));
    }
    inputEle.parentElement.nextElementSibling.innerHTML = '';
    inputEle.oninput = () => {
        onValidate(parent, inputEle);
    };
    inputEle.onkeyup = (e: KeyboardEvent) => {
        let code: number = getKeyCode(e);
        if (code === 13) {
            onReSubmit(parent);
        }
    };
    onFocusRenameInput(parent, inputEle);
    triggerPopupOpen(parent, parent.dialogObj, 'Rename');
}

function onFocusRenameInput(parent: IFileManager, inputEle: HTMLInputElement): void {
    inputEle.focus();
    let txt: string = '';
    if (parent.isFile && !parent.showFileExtension) {
        let index: number = parent.currentItemText.lastIndexOf('.');
        txt = (index === -1) ? parent.currentItemText : parent.currentItemText.substring(0, index);
    } else {
        txt = parent.currentItemText;
    }
    inputEle.value = txt;
    if (parent.isFile && parent.showFileExtension && (inputEle.value.indexOf('.') !== -1)) {
        inputEle.setSelectionRange(0, inputEle.value.lastIndexOf('.'));
    } else {
        inputEle.setSelectionRange(0, inputEle.value.length);
    }
}

function createInput(ele: HTMLInputElement, placeholder: string): void {
    Input.createInput({
        element: ele,
        properties: {
            placeholder: placeholder
        }
    });
}

// tslint:disable-next-line
/* istanbul ignore next */
function getOptions(parent: IFileManager, text: string, e?: ReadArgs | SelectedEventArgs, details?: FileDetails, replaceItems?: string[]): DialogOptions {
    let options: DialogOptions = {
        header: '', content: '', buttons: [], dialogName: ''
    };
    options.open = () => { triggerPopupOpen(parent, parent.dialogObj, options.dialogName); };
    options.close = () => { triggerPopupClose(parent, parent.dialogObj, options.dialogName); };
    text = (details && details.multipleFiles === true) ? 'MultipleFileDetails' : text;
    switch (text) {
        case 'NewFolder':
            options.dialogName = 'Create Folder';
            options.header = getLocaleText(parent, 'Header-NewFolder');
            options.content = '<input type="text" value="New folder" id="newname"><div class="e-fe-error"></div>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Create') },
                    click: (e: KeyboardEvent) => {
                        if (e.type === 'keydown') { return; }
                        onSubmit(parent);
                    },
                }
            ];
            options.open = onFolderDialogOpen.bind(this, parent);
            break;
        case 'Delete':
            options.dialogName = 'Delete';
            if (parent.selectedItems.length > 1) {
                options.content = ('<div>' + getLocaleText(parent, 'Content-Multiple-Delete') + '</div>')
                    .replace('{0}', parent.selectedItems.length.toString());
                options.header = getLocaleText(parent, 'Header-Multiple-Delete');
            } else {
                options.content = '<div>' + getLocaleText(parent, 'Content-Delete') + '</div>';
                options.header = getLocaleText(parent, 'Header-Delete');
            }
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                    click: (e: KeyboardEvent) => {
                        onDeleteSubmit(parent);
                    },
                },
                {
                    buttonModel: { content: getLocaleText(parent, 'Button-No') },
                    click: () => {
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
        case 'Rename':
            options.dialogName = 'Rename';
            options.header = getLocaleText(parent, 'Header-Rename');
            options.content = '<input type="text" class="e-input" id="rename"><div class="e-fe-error"></div>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Save') },
                    click: (e: KeyboardEvent) => {
                        if (e.type === 'keydown') { return; }
                        onReSubmit(parent);
                    },
                }
            ];
            options.open = onRenameDialogOpen.bind(this, parent);
            break;
        case 'details':
            options.dialogName = 'File Details';
            let intl: Internationalization = new Internationalization();
            let formattedString: string = intl.formatDate(new Date(details.modified), { format: 'MMMM dd, yyyy HH:mm:ss' });
            let permission: string = '';
            if (!isNOU(details.permission)) {
                permission = '<tr><td>' + getLocaleText(parent, 'Permission') + '</td><td class="' + CLS.VALUE + '" >'
                    + objectToString(details.permission) + '</td></tr>';
            }
            options.header = details.name;
            options.content = '<table>' +
                '<tr><td>' + getLocaleText(parent, 'Type') + '</td><td class="' + CLS.VALUE + '" title="' +
                (details.isFile ? 'File' : 'Folder') + '">' + (details.isFile ? 'File' : 'Folder') + '</td></tr>' +
                '<tr><td>' + getLocaleText(parent, 'Size') + '</td><td><span class="' + CLS.VALUE + '" title ="' +
                details.size + '">' + details.size + '</span></td></tr>' +
                '<tr><td>' + getLocaleText(parent, 'Location') + '</td><td class="' + CLS.VALUE + '" title="' +
                details.location + '">' + details.location + '</td></tr>' +
                '<tr><td>' + getLocaleText(parent, 'Modified') + '</td><td class="' + CLS.VALUE + '" >'
                + formattedString + '</td></tr>'
                + permission + '</table>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Ok') },
                    click: (e: KeyboardEvent) => {
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
        case 'MultipleFileDetails':
            options.dialogName = 'File Details';
            let strArr: string[] = details.name.split(',').map((val: string) => {
                let index: number = val.indexOf('.') + 1;
                return (index === 0) ? 'Folder' : val.substr(index).replace(' ', '');
            });
            let fileType: string = strArr.every((val: string, i: number, arr: string[]) => val === arr[0]) ?
                ((strArr[0] === 'Folder') ? 'Folder' : strArr[0].toLocaleUpperCase() + ' Type') : 'Multiple Types';
            let location: string = details.location;
            options.header = details.name;
            options.content = '<table><tr><td>' + getLocaleText(parent, 'Type')
                + ':</td><td class="' + CLS.VALUE + '">' + fileType + '</td></tr>' +
                '<tr><td>' + getLocaleText(parent, 'Size') + ':</td><td>' +
                details.size + '<span class="' + CLS.VALUE + '" title ="' + details.size
                + '"></span></td></tr>' + '<tr><td>' + getLocaleText(parent, 'Location') +
                ':</td><td class="' + CLS.VALUE + '" title="' + location + '">'
                + location + '</td></tr>' + '</table>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Ok') },
                    click: (e: KeyboardEvent) => {
                        if (e.type === 'keydown') { return; }
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
        case 'Error':
            parent.notify(events.actionFailure, {});
            options.dialogName = 'Error';
            let event: ReadArgs = (<ReadArgs>e);
            if (event.error.code === '401') {
                options.header = '<span class="e-fe-icon e-fe-access-error"></span><div class="e-fe-access-header">' + 
                getLocaleText(parent, 'Access-Denied')+'</div>';
            } else {
                options.header = getLocaleText(parent, 'Error');
            }
            options.content = '<div class="' + CLS.ERROR_CONTENT + '">' + event.error.message + '</div>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Ok') },
                    click: (e: KeyboardEvent) => {
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
    }
    return options;
}

function keydownAction(parent: IFileManager, dialogName: string, args: BeforeOpenEventArgs): void {
    let btnElement: HTMLInputElement[] = (selectAll('.e-btn', parent.dialogObj.element) as HTMLInputElement[]);
    preventKeydown(btnElement);
    triggerPopupBeforeOpen(parent, parent.dialogObj, args, dialogName);
}

function beforeExtOpen(parent: IFileManager, dlgName: string, args: BeforeOpenEventArgs): void {
    let btnElement: HTMLInputElement[] = (selectAll('.e-btn', parent.extDialogObj.element) as HTMLInputElement[]);
    preventKeydown(btnElement);
    triggerPopupBeforeOpen(parent, parent.extDialogObj, args, dlgName);
}

function preventKeydown(btnElement: HTMLInputElement[]): void {
    for (let btnCount: number = 0; btnCount < btnElement.length; btnCount++) {
        btnElement[btnCount].onkeydown = (e: KeyboardEvent) => {
            if (e.keyCode === 13) {
                e.preventDefault();
            }
        };
        btnElement[btnCount].onkeyup = (e: KeyboardEvent) => {
            if (e.keyCode === 13) {
                btnElement[btnCount].click();
            }
        };
    }
}

/* istanbul ignore next */
function getFilesName(data: SelectedEventArgs): HTMLElement {
    let parent: HTMLElement = createElement('div', { id: 'uploadDialog' });
    let ulElement: HTMLElement = createElement('ul');
    let filesData: FileInfo[] = data.isModified ? data.modifiedFilesData : data.filesData;
    for (let fileCount: number = 0; fileCount < filesData.length; fileCount++) {
        let liElement: HTMLElement = createElement('li', { className: 'dialogFiles' });
        liElement.innerHTML = filesData[fileCount].name;
        ulElement.appendChild(liElement);
    }
    parent.appendChild(ulElement);
    let errorTag: HTMLElement = createElement('div', { className: 'e-fe-error' });
    parent.appendChild(errorTag);
    return parent;
}

function changeOptions(parent: IFileManager, options: DialogOptions): void {
    parent.dialogObj.header = options.header;
    parent.dialogObj.content = options.content;
    parent.dialogObj.buttons = options.buttons;
    parent.dialogObj.enableRtl = parent.enableRtl;
    parent.dialogObj.open = options.open;
    parent.dialogObj.close = options.close;
    parent.dialogObj.dataBind();
    parent.dialogObj.show();
}

function onSubmit(parent: IFileManager): void {
    let ele: HTMLInputElement = select('#newname', parent.dialogObj.element) as HTMLInputElement;
    onSubmitValidate(parent, ele);
    if (ele.parentElement.nextElementSibling.innerHTML !== '') {
        return;
    }
    createFolder(parent, ele.value);
}
/* istanbul ignore next */
function onReSubmit(parent: IFileManager): void {
    let ele: HTMLInputElement = select('#rename', parent.dialogObj.element) as HTMLInputElement;
    onSubmitValidate(parent, ele);
    if (ele.parentElement.nextElementSibling.innerHTML !== '') {
        return;
    }
    let text: string = ele.value;
    let oIndex: number = parent.currentItemText.lastIndexOf('.');
    if (parent.isFile && !parent.showFileExtension) {
        let extn: string = (oIndex === -1) ? '' : parent.currentItemText.substr(oIndex);
        text += extn;
    }
    parent.renameText = text;
    if (parent.currentItemText === text) {
        parent.dialogObj.hide();
        return;
    }
    let newPath: string = (parent.activeModule === 'navigationpane') ? getParentPath(parent.path) : parent.path;
    parent.renamedId = getValue('id', parent.itemData[0]);
    if (parent.isFile) {
        let oldExtension: string = (oIndex === -1) ? '' : parent.currentItemText.substr(oIndex);
        let nIndex: number = text.lastIndexOf('.');
        let newExtension: string = (nIndex === -1) ? '' : text.substr(nIndex);
        if (parent.showFileExtension && oldExtension !== newExtension) {
            createExtDialog(parent, 'Extension', null, newPath);
        } else {
            rename(parent, newPath, text);
        }
    } else {
        rename(parent, newPath, text);
    }
}

function onDeleteSubmit(parent: IFileManager): void {
    parent.dialogObj.hide();
    parent.notify(events.deleteInit, {});
}

function onValidate(parent: IFileManager, ele: HTMLInputElement): void {
    if (/[/\\|*?"<>:]/.test(ele.value)) {
        addInvalid(parent, ele);
    } else if (ele.value === '') {
        ele.parentElement.nextElementSibling.innerHTML = getLocaleText(parent, 'Validation-Empty');
    } else {
        ele.parentElement.nextElementSibling.innerHTML = '';
    }
}

function onSubmitValidate(parent: IFileManager, ele: HTMLInputElement): void {
    onValidate(parent, ele);
    let len: number = ele.value.length - 1;
    if (ele.value !== '' && ((ele.value.lastIndexOf('.') === len) || (ele.value.lastIndexOf(' ') === len)) &&
        (parent.showFileExtension || (parent.currentItemText.lastIndexOf('.') === -1))) {
        addInvalid(parent, ele);
    }
}

function addInvalid(parent: IFileManager, ele: HTMLInputElement): void {
    let error: string = getLocaleText(parent, 'Validation-Invalid').replace('{0}', '"' + ele.value + '"');
    ele.parentElement.nextElementSibling.innerHTML = error;
}

function getKeyCode(e: KeyboardEvent): number {
    let code: number;
    if (e.keyCode) {
        code = e.keyCode;
    } else if (e.which) {
        code = e.which;
    } else {
        code = e.charCode;
    }
    return code;
}

export function createImageDialog(parent: IFileManager, header: string, imageUrl: string): void {
    let content: HTMLElement = createElement('div', { className: 'e-image-wrap' });
    let image: HTMLElement = createElement('img', { className: 'e-image', attrs: { src: imageUrl, alt: header } });
    content.appendChild(image);
    if (isNOU(parent.viewerObj)) {
        parent.viewerObj = new Dialog({
            header: header,
            content: content,
            animationSettings: { effect: 'None' },
            showCloseIcon: true,
            closeOnEscape: true,
            visible: true,
            isModal: true,
            width: '350px',
            height: '350px',
            target: '#' + parent.element.id,
            locale: parent.locale,
            enableResize: true,
            allowDragging: true,
            position: { X: 'center', Y: 'center' },
            enableRtl: parent.enableRtl,
            open: openImage.bind(this, parent),
            close: () => { triggerPopupClose(parent, parent.viewerObj, 'Image Preview'); },
            beforeOpen: (args: BeforeOpenEventArgs) => {
                triggerPopupBeforeOpen(parent, parent.viewerObj, args, 'Image Preview');
            },
            beforeClose: (args: BeforeCloseEventArgs) => {
                triggerPopupBeforeClose(parent, parent.viewerObj, args, 'Image Preview');
            },
            resizing: updateImage.bind(this, parent),
            resizeStop: updateImage.bind(this, parent)
        });
        parent.viewerObj.isStringTemplate = true;
        parent.viewerObj.appendTo('#' + parent.element.id + CLS.IMG_DIALOG_ID);
    } else {
        parent.viewerObj.refresh();
        parent.viewerObj.header = header;
        parent.viewerObj.content = content;
        parent.viewerObj.enableRtl = parent.enableRtl;
        parent.viewerObj.dataBind();
        parent.viewerObj.show();
    }
}

function openImage(parent: IFileManager): void {
    setTimeout(() => {
        if (parent.viewerObj) {
            parent.viewerObj.element.focus();
        }
    });
    updateImage(parent);
    triggerPopupOpen(parent, parent.viewerObj, 'Image Preview');
}

function updateImage(parent: IFileManager): void {
    let content: HTMLElement = <HTMLElement>select('.e-dlg-content', parent.viewerObj.element);
    let imgWrap: HTMLElement = <HTMLElement>select('.e-image-wrap', parent.viewerObj.element);
    let cssObj: CSSStyleDeclaration = window.getComputedStyle(content, null);
    let paddingWidth: number = cssObj ? (2 * parseFloat(cssObj.paddingRight)) : 36;
    let paddingHeight: number = cssObj ? (2 * parseFloat(cssObj.paddingBottom)) : 20;
    imgWrap.style.width = (content.offsetWidth - paddingWidth) + 'px';
    imgWrap.style.height = (content.offsetHeight - paddingHeight) + 'px';
}