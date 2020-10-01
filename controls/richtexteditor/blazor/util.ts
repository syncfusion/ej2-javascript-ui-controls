import { extend, isNullOrUndefined as isNOU, SanitizeHtmlHelper, Browser, createElement } from '@syncfusion/ej2-base';
import { addClass, removeClass, } from '@syncfusion/ej2-base';
import * as classes from './classes';
import { SfRichTextEditor } from './sf-richtexteditor-fn';
import { ISetToolbarStatusArgs, ToolsItem } from './interfaces';
import { updateTextNode } from '../src/rich-text-editor/base/util';
import { BeforeSanitizeHtmlArgs, IDropDownItemModel, IExecutionGroup } from '../src/rich-text-editor/base/interface';

/**
 * Util functions
 */

export const executeGroup: { [key: string]: IExecutionGroup } = {
    'bold': {
        command: 'Style',
        subCommand: 'Bold',
        value: 'strong'
    },
    'italic': {
        command: 'Style',
        subCommand: 'Italic',
        value: 'em'
    },
    'underline': {
        command: 'Style',
        subCommand: 'Underline',
        value: 'span'
    },
    'strikeThrough': {
        command: 'Style',
        subCommand: 'StrikeThrough',
        value: 'span'
    },
    'insertCode': {
        command: 'Formats',
        subCommand: 'Pre',
        value: 'pre'
    },
    'superscript': {
        command: 'Effects',
        subCommand: 'SuperScript',
        value: 'sup'
    },
    'subscript': {
        command: 'Effects',
        subCommand: 'SubScript',
        value: 'sub'
    },
    'uppercase': {
        command: 'Casing',
        subCommand: 'UpperCase'
    },
    'lowercase': {
        command: 'Casing',
        subCommand: 'LowerCase'
    },
    'fontColor': {
        command: 'font',
        subCommand: 'fontcolor',
        value: '#ff0000'
    },
    'fontName': {
        command: 'font',
        subCommand: 'fontname',
        value: 'Segoe UI'
    },
    'fontSize': {
        command: 'font',
        subCommand: 'fontsize',
        value: '10pt'
    },
    'backColor': {
        command: 'font',
        subCommand: 'backgroundcolor',
        value: '#ffff00'
    },
    'justifyCenter': {
        command: 'Alignments',
        subCommand: 'JustifyCenter'
    },
    'justifyFull': {
        command: 'Alignments',
        subCommand: 'JustifyFull'
    },
    'justifyLeft': {
        command: 'Alignments',
        subCommand: 'JustifyLeft'
    },
    'justifyRight': {
        command: 'Alignments',
        subCommand: 'JustifyRight'
    },
    'undo': {
        command: 'Actions',
        subCommand: 'Undo'
    },
    'redo': {
        command: 'Actions',
        subCommand: 'Redo'
    },
    'createLink': {
        command: 'Links',
        subCommand: 'createLink'
    },
    'editLink': {
        command: 'Links',
        subCommand: 'createLink'
    },
    'createImage': {
        command: 'Images',
        subCommand: 'Images'
    },
    'formatBlock': {
        command: 'Formats',
        value: 'P'
    },
    'heading': {
        command: 'Formats',
        value: 'H1'
    },
    'indent': {
        command: 'Indents',
        subCommand: 'Indent'
    },
    'outdent': {
        command: 'Indents',
        subCommand: 'Outdent'
    },
    'insertHTML': {
        command: 'InsertHTML',
        subCommand: 'InsertHTML',
        value: ''
    },
    'insertText': {
        command: 'InsertText',
        subCommand: 'InsertText',
        value: ''
    },
    'insertHorizontalRule': {
        command: 'InsertHTML',
        subCommand: 'InsertHTML',
        value: '<hr/>'
    },
    'insertImage': {
        command: 'Images',
        subCommand: 'Image',
    },
    'editImage': {
        command: 'Images',
        subCommand: 'Image',
    },
    'insertTable': {
        command: 'Table',
        subCommand: 'CreateTable'
    },
    'insertBrOnReturn': {
        command: 'InsertHTML',
        subCommand: 'InsertHTML',
        value: '<br/>'
    },
    'insertOrderedList': {
        command: 'Lists',
        value: 'OL'
    },
    'insertUnorderedList': {
        command: 'Lists',
        value: 'UL'
    },
    'insertParagraph': {
        command: 'Formats',
        value: 'P'
    },
    'removeFormat': {
        command: 'Clear',
        subCommand: 'ClearFormat'
    }
};

export function sanitizeHelper(value: string, parent?: SfRichTextEditor): string {
    if (parent.enableHtmlSanitizer) {
        let item: BeforeSanitizeHtmlArgs = SanitizeHtmlHelper.beforeSanitize();
        let beforeEvent: BeforeSanitizeHtmlArgs = {
            cancel: false,
            helper: null
        };
        extend(item, item, beforeEvent);
        // @ts-ignore-start
        //  parent.dotNetRef.invokeMethodAsync('BeforeSanitizeHtmlEvent', item).then((sanitizeArgs: BeforeSanitizeHtmlArgs) => {
        // @ts-ignore-end
        if (!item.cancel) {
            value = SanitizeHtmlHelper.serializeValue(item, value);
        }
        return value;
        // });
    }
    return value;
}

export function getIndex(val: string, items: ToolsItem[]): number {
    let index: number = -1;
    items.some((item: ToolsItem, i: number) => {
        if (!isNOU(item) && typeof item.subCommand === 'string' && val === item.subCommand.toLocaleLowerCase()) {
            index = i;
            return true;
        }
        return false;
    });
    return index;
}

export function getDropDownValue(items: IDropDownItemModel[], value: string, type: string, returnType: string): string {
    let data: IDropDownItemModel;
    let result: string;
    for (let k: number = 0; k < items.length; k++) {
        if (type === 'value' && items[k].value.toLocaleLowerCase() === value.toLocaleLowerCase()) {
            data = items[k];
            break;
        } else if (type === 'text' && items[k].text.toLocaleLowerCase() === value.toLocaleLowerCase()) {
            data = items[k];
            break;
        } else if (type === 'subCommand' && items[k].subCommand.toLocaleLowerCase() === value.toLocaleLowerCase()) {
            data = items[k];
            break;
        }
    }
    if (!isNOU(data)) {
        switch (returnType) {
            case 'text':
                result = data.text;
                break;
            case 'value':
                result = data.value;
                break;
            case 'cssClass':
                result = data.cssClass;
                break;
        }
    }
    return result;
}

export function getEditValue(value: string, rteObj: SfRichTextEditor): string {
    let val: string;
    if (value !== null && value !== '') {
        val = rteObj.enableHtmlEncode ? rteObj.encode(updateTextNode(decode(value))) : updateTextNode(value);
        rteObj.value = val;
    } else {
        val = rteObj.enableHtmlEncode ? '&lt;p&gt;&lt;br/&gt;&lt;/p&gt;' : '<p><br/></p>';
    }
    return val;
}

export function isIDevice(): boolean {
    return Browser.isDevice as boolean && Browser.isIos as boolean;
}

export function decode(value: string): string {
    return value.replace(/&amp;/g, '&').replace(/&amp;lt;/g, '<')
        .replace(/&lt;/g, '<').replace(/&amp;gt;/g, '>')
        .replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
        .replace(/&amp;nbsp;/g, ' ').replace(/&quot;/g, '');
}

export function dispatchEvent(element: Element | HTMLDocument, type: string): void {
    let evt: Event = document.createEvent('HTMLEvents');
    evt.initEvent(type, false, true);
    element.dispatchEvent(evt);
}

export function hasClass(element: Element | HTMLElement, className: string): boolean {
    let hasClass: boolean = false;
    if (element.classList.contains(className)) {
        hasClass = true;
    }
    return hasClass;
}

export function parseHtml(value: string): DocumentFragment {
    let tempNode: HTMLTemplateElement = <HTMLTemplateElement>createElement('template');
    tempNode.innerHTML = value;
    if (tempNode.content instanceof DocumentFragment) {
        return tempNode.content;
    } else {
        return document.createRange().createContextualFragment(value);
    }
}

export function setAttributes(htmlAttributes: { [key: string]: string }, rte: SfRichTextEditor, isFrame: boolean, initial: boolean): void {
    let target: HTMLElement;
    if (isFrame) {
        let iFrame: HTMLDocument = rte.getDocument();
        target = iFrame.querySelector('body');
    } else {
        target = rte.element;
    }
    if (Object.keys(htmlAttributes).length) {
        for (let htmlAttr of Object.keys(htmlAttributes)) {
            if (htmlAttr === 'class') {
                target.classList.add(htmlAttributes[htmlAttr]);
            } else if (htmlAttr === 'disabled' && htmlAttributes[htmlAttr] === 'disabled') {
                rte.enabled = false;
                rte.setEnable();
            } else if (htmlAttr === 'readonly' && htmlAttributes[htmlAttr] === 'readonly') {
                rte.readonly = true;
                rte.setReadOnly(initial);
            } else if (htmlAttr === 'style') {
                target.setAttribute('style', htmlAttributes[htmlAttr]);
            } else if (htmlAttr === 'tabindex') {
                rte.inputElement.setAttribute('tabindex', htmlAttributes[htmlAttr]);
            } else if (htmlAttr === 'placeholder') {
                rte.placeholder = htmlAttributes[htmlAttr];
                rte.setPlaceHolder();
            } else {
                let validateAttr: string[] = ['name', 'required'];
                if (validateAttr.indexOf(htmlAttr) > -1) {
                    rte.valueContainer.setAttribute(htmlAttr, htmlAttributes[htmlAttr]);
                } else {
                    target.setAttribute(htmlAttr, htmlAttributes[htmlAttr]);
                }
            }
        }
    }
}
export function convertToBlob(dataUrl: string): Blob {
    let arr: string[] = dataUrl.split(',');
    let mime: string = arr[0].match(/:(.*?);/)[1];
    let bstr: string = atob(arr[1]);
    let n: number = bstr.length;
    let u8arr: Uint8Array = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
export function getFormattedFontSize(value: string): string {
    if (isNOU(value)) { return ''; }
    return value;
}
export function setToolbarStatus(e: ISetToolbarStatusArgs, isPopToolbar: boolean): void {
    let dropDown: { [key: string]: object } = e.dropDownModule as { [key: string]: object };
    let data: { [key: string]: string | boolean } = <{ [key: string]: string | boolean }>e.args;
    let keys: string[] = Object.keys(e.args);
    for (let key of keys) {
        for (let j: number = 0; j < e.tbItems.length; j++) {
            let item: string = e.tbItems[j] && e.tbItems[j].subCommand;
            let itemStr: string = item && item.toLocaleLowerCase();
            if (item && (itemStr === key) || (item === 'UL' && key === 'unorderedlist') || (item === 'OL' && key === 'orderedlist') ||
                (itemStr === 'pre' && key === 'insertcode')) {
                if (typeof data[key] === 'boolean') {
                    if (data[key] === true) {
                        addClass([e.tbElements[j]], [classes.CLS_ACTIVE]);
                    } else {
                        removeClass([e.tbElements[j]], [classes.CLS_ACTIVE]);
                    }
                } else if ((typeof data[key] === 'string' || data[key] === null) &&
                    getIndex(key, e.parent.toolbarSettings.items as ToolsItem[]) > -1) {
                    let value: string = ((data[key]) ? data[key] : '') as string;
                    let result: string = '';
                    let dropdownBtnText: HTMLElement;
                    switch (key) {
                        case 'formats':
                            if (isPopToolbar) { break; }
                            let formatItems: IDropDownItemModel[] = e.parent.format.items;
                            result = getDropDownValue(formatItems, value, 'subCommand', 'text');
                            let formatContent: string = (isNOU(e.parent.format.default) ? formatItems[0].text :
                                e.parent.format.default);
                            dropdownBtnText = e.tbElements[j].querySelector('.e-rte-dropdown-btn-text') as HTMLElement;
                            dropdownBtnText.innerText = (isNOU(result) ? formatContent : result);
                            dropdownBtnText.parentElement.style.width = e.parent.format.width;
                            break;
                        case 'alignments':
                            result = getDropDownValue(e.parent.alignments as IDropDownItemModel[], value, 'subCommand', 'cssClass');
                            dropdownBtnText = e.tbElements[j].querySelector('.e-btn-icon.e-icons');
                            removeClass([dropdownBtnText], ['e-justify-left', 'e-justify-center', 'e-justify-right', 'e-justify-full']);
                            addClass([dropdownBtnText], (isNOU(result) ? ['e-icons', 'e-justify-left'] : result.split(' ')));
                            break;
                        case 'fontname':
                            if (isPopToolbar) { break; }
                            let fontNameItems: IDropDownItemModel[] = e.parent.fontFamily.items;
                            result = getDropDownValue(fontNameItems, value, 'value', 'text');
                            let fontNameContent: string = isNOU(e.parent.fontFamily.default) ? fontNameItems[0].text :
                                e.parent.fontFamily.default;
                            let name: string = (isNOU(result) ? fontNameContent : result);
                            e.tbElements[j].title = name;
                            dropdownBtnText = e.tbElements[j].querySelector('.e-rte-dropdown-btn-text') as HTMLElement;
                            dropdownBtnText.innerText = name;
                            dropdownBtnText.parentElement.style.width = e.parent.fontFamily.width;
                            break;
                        case 'fontsize':
                            let fontSizeItems: IDropDownItemModel[] = e.parent.fontSize.items;
                            let fontSizeContent: string = (isNOU(e.parent.fontSize.default) ? fontSizeItems[1].text :
                                e.parent.fontSize.default);
                            result = getDropDownValue(
                                fontSizeItems, (value === '' ? fontSizeContent.replace(/\s/g, '') : value), 'value', 'text');
                            dropdownBtnText = e.tbElements[j].querySelector('.e-rte-dropdown-btn-text') as HTMLElement;
                            dropdownBtnText.innerText = getFormattedFontSize(result);
                            dropdownBtnText.parentElement.style.width = e.parent.fontSize.width;
                            break;
                    }
                }
            }
        }
    }
}

export function pageYOffset(e: MouseEvent | Touch, parentElement: HTMLElement, isIFrame: boolean): number {
    let y: number = 0;
    if (isIFrame) {
        y = window.pageYOffset + parentElement.getBoundingClientRect().top + e.clientY;
    } else {
        y = e.pageY;
    }
    return y;
}