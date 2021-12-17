import { Dialog, BeforeOpenEventArgs, BeforeCloseEventArgs } from '@syncfusion/ej2-popups';
import { select, isNullOrUndefined as isNOU, createElement, Internationalization } from '@syncfusion/ej2-base';
import { getValue, remove, selectAll } from '@syncfusion/ej2-base';
import { IFileManager, ReadArgs, DialogOptions, FileDetails, FileDragEventArgs } from '../base/interface';
import { BeforePopupOpenCloseEventArgs, PopupOpenCloseEventArgs } from '../base/interface';
import { createFolder } from '../common/operations';
import * as CLS from '../base/classes';
import * as events from '../base/constant';
import { paste, rename } from '../common/operations';
import { getLocaleText, getDuplicateData, getParentPath, objectToString, getCssClass } from '../common/utility';
import { SelectedEventArgs, FileInfo, Input } from '@syncfusion/ej2-inputs';
import { CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';

// eslint:disable-next-line
/**
 *
 * @param {IFileManager} parent - Specifies the parent element
 * @param {string} text - specifies the text string.
 * @param {ReadArgs | SelectedEventArgs} e - specifies the type of event args.
 * @param {FileDetails} details - specifies the file details.
 * @param {string[]} replaceItems - specifies the replacement.
 * @returns {void}
 * @private
 */
export function createDialog(parent: IFileManager,
                             text: string, e?: ReadArgs | SelectedEventArgs, details?: FileDetails, replaceItems?: string[]): void {
    const options: DialogOptions = getOptions(parent, text, e, details, replaceItems);
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
            target: parent.popupTarget ? parent.popupTarget : '#' + parent.element.id,
            cssClass: getCssClass(parent, parent.isMobile ? CLS.MOB_POPUP : CLS.ROOT_POPUP),
            width: '350px',
            open: options.open,
            close: options.close,
            enableRtl: parent.enableRtl,
            enableHtmlSanitizer: parent.enableHtmlSanitizer,
            locale: parent.locale
        });
        parent.dialogObj.isStringTemplate = true;
        parent.dialogObj.appendTo('#' + parent.element.id + CLS.DIALOG_ID);
    } else {
        changeOptions(parent, options);
    }
}
/**
 *
 * @param {IFileManager} parent - Specifies the parent element.
 * @param {string} text - specifies the text string.
 * @param {string[]} replaceItems - specifies the replacement items.
 * @param {string} newPath - specifies the new path.
 * @returns {void}
 * @private
 */
export function createExtDialog(parent: IFileManager, text: string, replaceItems?: string[], newPath?: string): void {
    const extOptions: DialogOptions = getExtOptions(parent, text, replaceItems, newPath);
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
            target: parent.popupTarget ? parent.popupTarget : '#' + parent.element.id,
            cssClass: getCssClass(parent, parent.isMobile ? CLS.MOB_POPUP : CLS.ROOT_POPUP),
            enableRtl: parent.enableRtl,
            showCloseIcon: true,
            isModal: true,
            width: 350,
            buttons: extOptions.buttons,
            open: extOptions.open,
            close: extOptions.close,
            enableHtmlSanitizer: parent.enableHtmlSanitizer,
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
        parent.extDialogObj.beforeOpen = beforeExtOpen.bind(this, parent, extOptions.dialogName);
        parent.extDialogObj.beforeClose = (args: BeforeCloseEventArgs) => {
            triggerPopupBeforeClose(parent, parent.extDialogObj, args, extOptions.dialogName);
        };
        parent.extDialogObj.dataBind();
        parent.extDialogObj.show();
    }
}
/**
 *
 * @param {IFileManager} parent - Specifies the parent element.
 * @param {Dialog} dlgModule - Specifies the dialog module.
 * @param {BeforeOpenEventArgs} args - specifies the before open arguements.
 * @param {string} dialogName - specifies the dialog name.
 * @returns {void}
 * @private
 */
function triggerPopupBeforeOpen(parent: IFileManager, dlgModule: Dialog, args: BeforeOpenEventArgs, dialogName: string): void {
    const eventArgs: BeforePopupOpenCloseEventArgs = {
        cancel: args.cancel, popupName: dialogName, popupModule: dlgModule
    };
    parent.trigger('beforePopupOpen', eventArgs, (eventargs: BeforePopupOpenCloseEventArgs) => {
        args.cancel = eventargs.cancel;
    });
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {Dialog} dlgModule - specifies the dialog module.
 * @param {BeforeCloseEventArgs} args - specifies the before close event arguements.
 * @param {string} dialogName - specifies the dialog name.
 * @returns {void}
 * @private
 */
function triggerPopupBeforeClose(parent: IFileManager, dlgModule: Dialog, args: BeforeCloseEventArgs, dialogName: string): void {
    const eventArgs: BeforePopupOpenCloseEventArgs = {
        cancel: args.cancel, popupModule: dlgModule, popupName: dialogName
    };
    parent.trigger('beforePopupClose', eventArgs, (eventargs: BeforePopupOpenCloseEventArgs) => {
        args.cancel = eventargs.cancel;
        if (!args.cancel && args.isInteracted && ((dialogName === 'Rename') || (dialogName === 'Create Folder'))) {
            parent.trigger(events.actionFailure, {});
        }
    });
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {Dialog} dlgModule - specifies the dialog module.
 * @param {string} dialogName - specifies the dialog name.
 * @returns {void}
 * @private
 */
function triggerPopupOpen(parent: IFileManager, dlgModule: Dialog, dialogName: string): void {
    const args: PopupOpenCloseEventArgs = { popupModule: dlgModule, element: dlgModule.element, popupName: dialogName };
    parent.trigger('popupOpen', args);
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {Dialog} dlgModule - specifies the dialog module.
 * @param {string} dialogName - specifies the dialog name.
 * @returns {void}
 * @private
 */
function triggerPopupClose(parent: IFileManager, dlgModule: Dialog, dialogName: string): void {
    const args: PopupOpenCloseEventArgs = { popupModule: dlgModule, element: dlgModule.element, popupName: dialogName };
    parent.trigger('popupClose', args);
}

// eslint:disable-next-line
/**
 *
 * @param {IFileManager} parent - Specifies the parent element.
 * @param {string} text - specifies the text string.
 * @param {string[]} replaceItems - specifies the replacement items.
 * @param {string} newPath - specifies the new path.
 * @returns {DialogOptions} - returns the dialog options.
 * @private
 */
function getExtOptions(parent: IFileManager, text: string, replaceItems?: string[], newPath?: string): DialogOptions {
    const options: DialogOptions = {
        header: '', content: '', buttons: [], dialogName: ''
    };
    let duplicateContent: string;
    let item: string;
    let index: number;
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
        item = parent.replaceItems[parent.fileLength];
        index = item.lastIndexOf('/');
        item = index === -1 ? item : item.substring(index);
        options.header = getLocaleText(parent, 'Header-Duplicate');
        duplicateContent = '<div>' + getLocaleText(parent, 'Content-Duplicate') + '</div>';
        options.content = (duplicateContent).replace('{0}', item);
        options.close = () => {
            if (!parent.isDropEnd && parent.duplicateItems.length === 0) {
                const args: FileDragEventArgs = { fileDetails: parent.droppedObjects };
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
                        const indexval: number = item.lastIndexOf('/');
                        item = indexval === -1 ? item : item.substring(indexval);
                        parent.extDialogObj.content = (duplicateContent).replace('{0}', item);
                        parent.extDialogObj.show();
                    } else {
                        parent.extDialogObj.hide();
                        const targetPath: string = parent.isDragDrop ? parent.dragPath : parent.targetPath;
                        const path: string = parent.isDragDrop ? parent.dropPath : ((parent.folderPath === '') ? parent.path :
                            parent.folderPath);
                        const action: string = parent.isDragDrop ? 'move' : parent.fileAction;
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
                        const ind: number = item.lastIndexOf('/');
                        item = ind === -1 ? item : item.substring(ind);
                        parent.extDialogObj.content = (duplicateContent).replace('{0}', item);
                        parent.extDialogObj.show();
                    } else {
                        parent.extDialogObj.hide();
                        if (parent.duplicateItems.length !== 0) {
                            const action: string = parent.isDragDrop ? 'move' : parent.fileAction;
                            const targetPath: string = parent.isDragDrop ? parent.dragPath : parent.targetPath;
                            const path: string = parent.isDragDrop ? parent.dropPath : ((parent.folderPath === '') ? parent.path :
                                parent.folderPath);
                            paste(
                                parent, targetPath, parent.duplicateItems, path,
                                action, parent.duplicateItems, parent.duplicateRecords);
                        }
                    }
                }
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
                    let count: number = 0;
                    if (parent.isApplySame) {
                        count = parent.retryFiles.length;
                        parent.retryFiles = [];
                        retryDlgClose(parent);
                    } else {
                        count = 1;
                        parent.retryFiles.splice(0, 1);
                        if (parent.retryFiles.length !== 0) { createExtDialog(parent, 'UploadRetry'); } else { retryDlgClose(parent); }
                    }
                    parent.notify(events.skipUpload, { count: count });
                }
            }
        ];
        break;
    }
    return options;
}
/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {boolean} isKeepBoth - checks the arguement to keep both.
 * @returns {void}
 * @private
 */
function retryDlgUpdate(parent: IFileManager, isKeepBoth: boolean): void {
    if (parent.isApplySame) {
        if (isKeepBoth) { onKeepBothAll(parent); } else { onReplaceAll(parent); }
        retryDlgClose(parent);
    } else {
        parent.retryArgs.push({
            action: isKeepBoth ? 'keepboth' : 'replace',
            file: parent.retryFiles[0]
        });
        parent.uploadObj.retry(parent.retryFiles[0]);
        parent.retryFiles.splice(0, 1);
        if (parent.retryFiles.length !== 0) { createExtDialog(parent, 'UploadRetry'); } else { retryDlgClose(parent); }
    }
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @returns {void}
 * @private
 */
function retryDlgClose(parent: IFileManager): void {
    let flag: boolean = true;
    if (parent.isRetryOpened) { parent.isRetryOpened = false; } else { flag = false; }
    const ele: Element = select('.e-dlg-checkbox', parent.extDialogObj.element);
    if (ele) { remove(ele); }
    if (flag) { parent.extDialogObj.hide(); } else {
        parent.retryFiles = [];
    }
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {object} args - specifies the arguements.
 * @returns {void}
 * @private
 */
// eslint-disable-next-line
function onRetryOpen(parent: IFileManager, args: object): void {
    parent.isRetryOpened = true;
    const dialogEle: Element = getValue('element', args);
    const container: Element = select('.e-dlg-content', dialogEle);
    const checkContainer: Element = parent.createElement('div', {
        className: 'e-dlg-checkbox'
    });
    const checkbox: Element = parent.createElement('input', {
        id: parent.element.id + '_applyall'
    });
    checkContainer.appendChild(checkbox);
    container.appendChild(checkContainer);
    const checkBoxObj: CheckBox = new CheckBox({
        label: getLocaleText(parent, 'ApplyAll-Label'),
        change: (args: ChangeEventArgs) => {
            parent.isApplySame = args.checked;
        }
    });
    checkBoxObj.appendTo('#' + parent.element.id + '_applyall');
    triggerPopupOpen(parent, parent.extDialogObj, 'Retry Upload');
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @returns {void}
 * @private
 */
function onKeepBothAll(parent: IFileManager): void {
    while (parent.retryFiles.length !== 0) {
        parent.retryArgs.push({ action: 'keepboth', file: parent.retryFiles[0] });
        parent.uploadObj.retry(parent.retryFiles[0]);
        parent.retryFiles.splice(0, 1);
    }
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @returns {void}
 * @private
 */
function onReplaceAll(parent: IFileManager): void {
    while (parent.retryFiles.length !== 0) {
        parent.retryArgs.push({ action: 'replace', file: parent.retryFiles[0] });
        parent.uploadObj.retry(parent.retryFiles[0]);
        parent.retryFiles.splice(0, 1);
    }
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @returns {void}
 * @private
 */
function focusInput(parent: IFileManager): void {
    const ele: HTMLInputElement = (select('#newname', parent.dialogObj.element) as HTMLInputElement);
    ele.focus();
    ele.value = '';
    const len: number = ele.value.length;
    ele.setSelectionRange(0, len);
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @returns {void}
 * @private
 */
function onFolderDialogOpen(parent: IFileManager): void {
    const ele: HTMLInputElement = (select('#newname', parent.dialogObj.element) as HTMLInputElement);
    if (!ele.parentElement.classList.contains('e-control-wrapper')) {
        createInput(ele, getLocaleText(parent, 'Content-NewFolder'));
    }
    ele.parentElement.nextElementSibling.innerHTML = '';
    ele.oninput = () => {
        onValidate(parent, ele);
    };
    ele.onkeyup = (e: KeyboardEvent) => {
        const code: number = getKeyCode(e);
        if (code === 13) {
            onSubmit(parent);
        }
    };
    focusInput(parent);
    triggerPopupOpen(parent, parent.dialogObj, 'Create Folder');
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @returns {void}
 * @private
 */
function onRenameDialogOpen(parent: IFileManager): void {
    const inputEle: HTMLInputElement = (select('#rename', parent.dialogObj.element) as HTMLInputElement);
    if (!inputEle.parentElement.classList.contains('e-control-wrapper')) {
        createInput(inputEle, getLocaleText(parent, 'Content-Rename'));
    }
    inputEle.parentElement.nextElementSibling.innerHTML = '';
    inputEle.oninput = () => {
        onValidate(parent, inputEle);
    };
    inputEle.onkeyup = (e: KeyboardEvent) => {
        const code: number = getKeyCode(e);
        if (code === 13) {
            onReSubmit(parent);
        }
    };
    onFocusRenameInput(parent, inputEle);
    triggerPopupOpen(parent, parent.dialogObj, 'Rename');
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {HTMLInputElement} inputEle - specifies the input element.
 * @returns {void}
 * @private
 */
function onFocusRenameInput(parent: IFileManager, inputEle: HTMLInputElement): void {
    inputEle.focus();
    let txt: string = '';
    if (parent.isFile && !parent.showFileExtension) {
        const index: number = parent.currentItemText.lastIndexOf('.');
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

/**
 *
 * @param {HTMLInputElement} ele - specifies the element.
 * @param {string} placeholder - specifies the place holder.
 * @returns {void}
 * @private
 */
function createInput(ele: HTMLInputElement, placeholder: string): void {
    Input.createInput({
        element: ele,
        properties: {
            placeholder: placeholder
        }
    });
}

/* istanbul ignore next */
// eslint:disable-next-line
/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {string} text - specifies the text string.
 * @param {ReadArgs | SelectedEventArgs} e - specifies the event arguements.
 * @param {FileDetails} details - specifies the file details.
 * @param {string[]} replaceItems - specifies the replacement items.
 * @returns {DialogOptions} - specifies the dialog options.
 * @private
 */
function getOptions(parent: IFileManager, text: string, e?: ReadArgs | SelectedEventArgs,
                    details?: FileDetails, replaceItems?: string[]): DialogOptions {
    const options: DialogOptions = {
        header: '', content: '', buttons: [], dialogName: ''
    };
    let permission: string; let formattedString: string; let intl: Internationalization;
    let strArr: string[]; let fileType: string; let location: string;
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
                }
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
            options.content = '<div>' + getLocaleText(parent, parent.isFile ? 'Content-Delete' : 'Content-Folder-Delete') + '</div>';
            options.header = getLocaleText(parent, parent.isFile ? 'Header-Delete' : 'Header-Folder-Delete');
        }
        options.buttons = [
            {
                buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                click: (e: KeyboardEvent) => {
                    onDeleteSubmit(parent);
                }
            },
            {
                buttonModel: { content: getLocaleText(parent, 'Button-No') },
                click: () => {
                    parent.dialogObj.hide();
                }
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
                }
            }
        ];
        options.open = onRenameDialogOpen.bind(this, parent);
        break;
    case 'details':
        options.dialogName = 'File Details';
        intl = new Internationalization(parent.locale);
        formattedString = intl.formatDate(new Date(details.modified), { format: 'MMMM dd, yyyy HH:mm:ss' });
        permission = '';
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
                }
            }
        ];
        break;
    case 'MultipleFileDetails':
        options.dialogName = 'File Details';
        strArr = details.name.split(',').map((val: string) => {
            const index: number = val.indexOf('.') + 1;
            return (index === 0) ? 'Folder' : val.substr(index).replace(' ', '');
        });
        fileType = strArr.every((val: string, i: number, arr: string[]) => val === arr[0]) ?
            ((strArr[0] === 'Folder') ? 'Folder' : strArr[0].toLocaleUpperCase() + ' Type') : 'Multiple Types';
        location = details.location;
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
                }
            }
        ];
        break;
    case 'Error':
        parent.notify(events.actionFailure, {});
        options.dialogName = 'Error';
        if ((<ReadArgs>e).error.code === '401') {
            options.header = '<span class="e-fe-icon e-fe-access-error"></span><div class="e-fe-access-header">' +
                getLocaleText(parent, 'Access-Denied') + '</div>';
        } else {
            options.header = getLocaleText(parent, 'Error');
        }
        options.content = '<div class="' + CLS.ERROR_CONTENT + '">' + (<ReadArgs>e).error.message + '</div>';
        options.buttons = [
            {
                buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Ok') },
                click: (e: KeyboardEvent) => {
                    parent.dialogObj.hide();
                }
            }
        ];
        break;
    }
    return options;
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {string} dialogName - specifies the dialog name.
 * @param {BeforeOpenEventArgs} args - specifies the before open event arguements.
 * @returns {void}
 * @private
 */
function keydownAction(parent: IFileManager, dialogName: string, args: BeforeOpenEventArgs): void {
    const btnElement: HTMLInputElement[] = (selectAll('.e-btn', parent.dialogObj.element) as HTMLInputElement[]);
    preventKeydown(btnElement);
    triggerPopupBeforeOpen(parent, parent.dialogObj, args, dialogName);
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {string} dlgName - specifies the dialog name.
 * @param {BeforeOpenEventArgs} args - specifies the before open event arguements.
 * @returns {void}
 * @private
 */
function beforeExtOpen(parent: IFileManager, dlgName: string, args: BeforeOpenEventArgs): void {
    const btnElement: HTMLInputElement[] = (selectAll('.e-btn', parent.extDialogObj.element) as HTMLInputElement[]);
    preventKeydown(btnElement);
    triggerPopupBeforeOpen(parent, parent.extDialogObj, args, dlgName);
}

/**
 *
 * @param {HTMLInputElement[]} btnElement - specifies the button element.
 * @returns {void}
 * @private
 */
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
/**
 *
 * @param {SelectedEventArgs} data - specifies the data.
 * @returns {HTMLElement} - returns the HTML element.
 * @private
 */
function getFilesName(data: SelectedEventArgs): HTMLElement {
    const parent: HTMLElement = createElement('div', { id: 'uploadDialog' });
    const ulElement: HTMLElement = createElement('ul');
    const filesData: FileInfo[] = data.isModified ? data.modifiedFilesData : data.filesData;
    for (let fileCount: number = 0; fileCount < filesData.length; fileCount++) {
        const liElement: HTMLElement = createElement('li', { className: 'dialogFiles' });
        liElement.innerHTML = filesData[fileCount].name;
        ulElement.appendChild(liElement);
    }
    parent.appendChild(ulElement);
    const errorTag: HTMLElement = createElement('div', { className: 'e-fe-error' });
    parent.appendChild(errorTag);
    return parent;
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {DialogOptions} options - specifies the dialog options.
 * @returns {void}
 * @private
 */
function changeOptions(parent: IFileManager, options: DialogOptions): void {
    parent.dialogObj.header = options.header;
    parent.dialogObj.content = options.content;
    parent.dialogObj.buttons = options.buttons;
    parent.dialogObj.enableRtl = parent.enableRtl;
    parent.dialogObj.open = options.open;
    parent.dialogObj.close = options.close;
    parent.dialogObj.beforeOpen = keydownAction.bind(this, parent, options.dialogName);
    parent.dialogObj.beforeClose = (args: BeforeCloseEventArgs) => {
        triggerPopupBeforeClose(parent, parent.dialogObj, args, options.dialogName);
    };
    parent.dialogObj.dataBind();
    parent.dialogObj.show();
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @returns {void}
 * @private
 */
function onSubmit(parent: IFileManager): void {
    const ele: HTMLInputElement = select('#newname', parent.dialogObj.element) as HTMLInputElement;
    onSubmitValidate(parent, ele);
    if (ele.parentElement.nextElementSibling.innerHTML !== '') {
        return;
    }
    createFolder(parent, ele.value);
}
/* istanbul ignore next */
/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @returns {void}
 * @private
 */
function onReSubmit(parent: IFileManager): void {
    const ele: HTMLInputElement = select('#rename', parent.dialogObj.element) as HTMLInputElement;
    onSubmitValidate(parent, ele);
    if (ele.parentElement.nextElementSibling.innerHTML !== '') {
        return;
    }
    let text: string = ele.value;
    const oIndex: number = parent.currentItemText.lastIndexOf('.');
    if (parent.isFile && !parent.showFileExtension) {
        const extn: string = (oIndex === -1) ? '' : parent.currentItemText.substr(oIndex);
        text += extn;
    }
    parent.renameText = text;
    if (parent.currentItemText === text) {
        parent.dialogObj.hide();
        return;
    }
    const newPath: string = (parent.activeModule === 'navigationpane') ? getParentPath(parent.path) : parent.path;
    parent.renamedId = getValue('id', parent.itemData[0]);
    if (parent.isFile) {
        const oldExtension: string = (oIndex === -1) ? '' : parent.currentItemText.substr(oIndex);
        const nIndex: number = text.lastIndexOf('.');
        const newExtension: string = (nIndex === -1) ? '' : text.substr(nIndex);
        if (parent.showFileExtension && oldExtension !== newExtension) {
            createExtDialog(parent, 'Extension', null, newPath);
        } else {
            rename(parent, newPath, text);
        }
    } else {
        rename(parent, newPath, text);
    }
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @returns {void}
 * @private
 */
function onDeleteSubmit(parent: IFileManager): void {
    parent.dialogObj.hide();
    parent.notify(events.deleteInit, {});
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {HTMLInputElement} ele - specifies the input element.
 * @returns {void}
 * @private
 */
function onValidate(parent: IFileManager, ele: HTMLInputElement): void {
    if (/[/\\|*?"<>:]/.test(ele.value)) {
        addInvalid(parent, ele);
    } else if (ele.value === '') {
        ele.parentElement.nextElementSibling.innerHTML = getLocaleText(parent, 'Validation-Empty');
    } else {
        ele.parentElement.nextElementSibling.innerHTML = '';
    }
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {HTMLInputElement} ele - specifies the input element.
 * @returns {void}
 * @private
 */
function onSubmitValidate(parent: IFileManager, ele: HTMLInputElement): void {
    onValidate(parent, ele);
    const len: number = ele.value.length - 1;
    if (ele.value !== '' && ((ele.value.lastIndexOf('.') === len) || (ele.value.lastIndexOf(' ') === len)) &&
        (parent.showFileExtension || (parent.currentItemText.lastIndexOf('.') === -1))) {
        addInvalid(parent, ele);
    }
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {HTMLInputElement} ele - specifies the input element.
 * @returns {void}
 * @private
 */
function addInvalid(parent: IFileManager, ele: HTMLInputElement): void {
    const error: string = getLocaleText(parent, 'Validation-Invalid').replace('{0}', '"' + ele.value + '"');
    if (parent.enableHtmlSanitizer) {
        ele.parentElement.nextElementSibling.textContent = error;
    }
    else {
        ele.parentElement.nextElementSibling.innerHTML = error;
    }
}

/**
 *
 * @param {KeyboardEvent} e - specifies the keyboard event.
 * @returns {number} - returns the key code.
 * @private
 */
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

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @param {string} header - specifies the header element.
 * @param {string} imageUrl - specifies the image URL.
 * @returns {void}
 * @private
 */
export function createImageDialog(parent: IFileManager, header: string, imageUrl: string): void {
    const content: HTMLElement = createElement('div', { className: 'e-image-wrap' });
    const image: HTMLElement = createElement('img', { className: 'e-image', attrs: { src: imageUrl, alt: header } });
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
            target: parent.popupTarget ? parent.popupTarget : '#' + parent.element.id,
            cssClass: getCssClass(parent, parent.isMobile ? CLS.MOB_POPUP : CLS.ROOT_POPUP),
            locale: parent.locale,
            enableResize: true,
            allowDragging: true,
            enableHtmlSanitizer: parent.enableHtmlSanitizer,
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

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @returns {void}
 * @private
 */
function openImage(parent: IFileManager): void {
    setTimeout(() => {
        if (parent.viewerObj) {
            parent.viewerObj.element.focus();
        }
    });
    updateImage(parent);
    triggerPopupOpen(parent, parent.viewerObj, 'Image Preview');
}

/**
 *
 * @param {IFileManager} parent - specifies the parent element.
 * @returns {void}
 * @private
 */
function updateImage(parent: IFileManager): void {
    const content: HTMLElement = <HTMLElement>select('.e-dlg-content', parent.viewerObj.element);
    const imgWrap: HTMLElement = <HTMLElement>select('.e-image-wrap', parent.viewerObj.element);
    const cssObj: CSSStyleDeclaration = window.getComputedStyle(content, null);
    const paddingWidth: number = cssObj ? (2 * parseFloat(cssObj.paddingRight)) : 36;
    const paddingHeight: number = cssObj ? (2 * parseFloat(cssObj.paddingBottom)) : 20;
    imgWrap.style.width = (content.offsetWidth - paddingWidth) + 'px';
    imgWrap.style.height = (content.offsetHeight - paddingHeight) + 'px';
}
