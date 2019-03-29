import { Dialog } from '@syncfusion/ej2-popups';
import { select, isNullOrUndefined as isNOU, createElement, Internationalization } from '@syncfusion/ej2-base';
import { IFileManager, ReadArgs, DialogOptions, FileDetails, ITreeView } from '../base/interface';
import { createFolder } from '../common/operations';
import * as CLS from '../base/classes';
import { paste, rename } from '../common/operations';
import { activeElement, getLocaleText } from '../common/utility';
import { SelectedEventArgs, FileInfo, Input } from '@syncfusion/ej2-inputs';

/**
 * Function to create the dialog for new folder in File Manager.
 * @private
 */
// tslint:disable-next-line
export function createDialog(parent: IFileManager, text: string, e?: ReadArgs | SelectedEventArgs, details?: FileDetails, replaceItems?: string[]): void {
    let options: DialogOptions = getOptions(parent, text, e, details, replaceItems);
    if (isNOU(parent.dialogObj)) {
        parent.dialogObj = new Dialog({
            header: options.header,
            content: options.content,
            buttons: options.buttons,
            animationSettings: { effect: 'None' },
            showCloseIcon: true,
            closeOnEscape: true,
            visible: true,
            isModal: true,
            target: '#' + parent.element.id,
            width: '350px',
            open: options.open,
            enableRtl: parent.enableRtl,
            locale: parent.locale
        });
        parent.dialogObj.appendTo('#' + parent.element.id + CLS.DIALOG_ID);
    } else {
        changeOptions(parent, options);
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
}

function onFocusRenameInput(parent: IFileManager, inputEle: HTMLInputElement): void {
    inputEle.focus();
    inputEle.value = parent.currentItemText;
    if (parent.isFile && (parent.isFile && inputEle.value.indexOf('.') !== -1)) {
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
    let options: DialogOptions = { header: '', content: '', buttons: [], open: null };
    text = (details && details.multipleFiles === true) ? 'MultipleFileDetails' : text;
    switch (text) {
        case 'NewFolder':
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
                        if (e.type === 'keydown') { return; }
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
        case 'DuplicateItems':
            parent.replaceItems = replaceItems;
            options.header = getLocaleText(parent, 'Header-Duplicate');
            // tslint:disable-next-line
            options.content = '<div>' + parent.replaceItems[parent.fileLength].substring(parent.replaceItems[parent.fileLength].lastIndexOf('/') + 1) + getLocaleText(parent, 'Content-Duplicate') + '</div>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                    click: (e: KeyboardEvent) => {
                        if (e.type === 'keydown') { return; }
                        // tslint:disable-next-line
                        let item: string = parent.replaceItems[parent.fileLength].substring(parent.replaceItems[parent.fileLength].lastIndexOf('/') + 1);
                        parent.duplicateItems.push(item);
                        parent.fileLength++;
                        if (replaceItems[parent.fileLength]) {
                            // tslint:disable-next-line
                            parent.dialogObj.content = '<div>' + parent.replaceItems[parent.fileLength].substring(parent.replaceItems[parent.fileLength].lastIndexOf('/') + 1) + getLocaleText(parent, 'Content-Duplicate') + '</div>';
                            parent.dialogObj.show();
                        } else {
                            parent.dialogObj.hide();
                            paste(
                                // tslint:disable-next-line
                                parent as IFileManager, parent.targetPath, parent.selectedNodes,
                                parent.path, parent.fileAction, parent.navigationpaneModule as ITreeView, parent.duplicateItems);
                        }
                    },
                },
                {
                    buttonModel: { content: getLocaleText(parent, 'Button-No') },
                    click: () => {
                        parent.fileLength++;
                        if (replaceItems[parent.fileLength]) {
                            // tslint:disable-next-line
                            let item: string = parent.replaceItems[parent.fileLength].substring(parent.replaceItems[parent.fileLength].lastIndexOf('/') + 1);
                            // tslint:disable-next-line
                            parent.dialogObj.content = '<div>' + item + ' already exists. Are you sure you want to replace it ?</div>';
                            parent.dialogObj.show();
                        } else {
                            parent.dialogObj.hide();
                            if (parent.duplicateItems.length !== 0) {
                                paste(
                                    // tslint:disable-next-line
                                    parent as IFileManager, parent.targetPath, parent.duplicateItems,
                                    parent.path, parent.fileAction, parent.navigationpaneModule as ITreeView, parent.duplicateItems);
                            }
                        }
                    },
                }
            ];
            break;
        case 'GetDetails':
            let intl: Internationalization = new Internationalization();
            let parseDate: Date = intl.parseDate(details.modified, { format: 'MM/dd/yyy hh:mm:ss' });
            let formattedString: string = intl.formatDate(new Date(details.modified), { format: 'MMMM dd, yyyy HH:mm:ss' });
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
                + '</table>';
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
        case 'MultipleFileDetails':
            let location: string = details.location;
            options.header = details.name;
            options.content = '<table><tr><td>' + getLocaleText(parent, 'Type')
                + ':</td><td class="' + CLS.VALUE + '">Multiple Types</td></tr>' +
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
            let event: ReadArgs = (<ReadArgs>e);
            if (event.error.code === '523') {
                options.header = 'Access Denied';
            } else {
                options.header = getLocaleText(parent, 'Error');
            }
            options.content = '<div class="' + CLS.ERROR_CONTENT + '">' + event.error.message + '</div>';
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
    }
    return options;
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
    parent.renameText = ele.value;
    if (parent.currentItemText === text) {
        parent.dialogObj.hide();
        return;
    }
    if (parent.selectedItems.length === 0) {
        parent.parentPath = parent.path;
        let treePath: string[] = parent.path.split('/');
        let newPath: string = parent.path.replace(treePath[treePath.length - 2] + '/', '');
        parent.setProperties({ path: newPath }, true);
    }
    if (parent.isFile) {
        let oldExtension: string = parent.currentItemText.substr(parent.currentItemText.lastIndexOf('.'));
        let newExtension: string = text.substr(text.lastIndexOf('.'));
        if (oldExtension !== newExtension) {
            if (isNOU(parent.extDialogObj)) {
                parent.extDialogObj = new Dialog({
                    header: getLocaleText(parent, 'Header-Rename-Confirmation'),
                    content: '<div>' + getLocaleText(parent, 'Content-Rename-Confirmation') + '</div>',
                    animationSettings: { effect: 'None' },
                    target: '#' + parent.element.id,
                    showCloseIcon: true,
                    closeOnEscape: true,
                    isModal: true,
                    width: 350,
                    buttons: [{
                        buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                        click: () => {
                            parent.extDialogObj.hide();
                            rename(parent, parent.renameText);
                        },
                    },
                    {
                        buttonModel: { content: getLocaleText(parent, 'Button-No') },
                        click: () => {
                            parent.extDialogObj.hide();
                            parent.dialogObj.hide();
                        },
                    }],
                });
                parent.extDialogObj.appendTo('#' + parent.element.id + CLS.EXTN_DIALOG_ID);
            } else {
                parent.extDialogObj.show();
            }
        } else {
            rename(parent, text);
        }
    } else {
        rename(parent, text);
    }
}

function onDeleteSubmit(parent: IFileManager): void {
    parent.dialogObj.hide();
    let delItems: Object[] = activeElement('Delete', null, parent as IFileManager);
    parent.deleteHandler(delItems);
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
    if (ele.value !== '' && ((ele.value.lastIndexOf('.') === len) || (ele.value.lastIndexOf(' ') === len))) {
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
    let image: HTMLElement = createElement('img', { className: 'e-image', attrs: { src: imageUrl } });
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
            resizing: updateImage.bind(this, parent),
            resizeStop: updateImage.bind(this, parent)
        });
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
}

function updateImage(parent: IFileManager): void {
    let content: HTMLElement = <HTMLElement>select('.e-dlg-content', parent.viewerObj.element);
    let imgWrap: HTMLElement = <HTMLElement>select('.e-image-wrap', parent.viewerObj.element);
    let cssObj: CSSStyleDeclaration = window.getComputedStyle(content, null);
    let paddingWidth : number = cssObj ? (2 * parseFloat(cssObj.paddingRight)) : 36;
    let paddingHeight: number = cssObj ? (2 * parseFloat(cssObj.paddingBottom)) : 20;
    imgWrap.style.width = (content.offsetWidth - paddingWidth) + 'px';
    imgWrap.style.height = (content.offsetHeight - paddingHeight) + 'px';
}