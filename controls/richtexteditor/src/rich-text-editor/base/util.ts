/**
 * Defines util methods used by Rich Text Editor.
 */
import { isNullOrUndefined as isNOU, addClass, removeClass, L10n, selectAll, createElement, Browser, detach } from '@syncfusion/ej2-base';
import * as classes from '../base/classes';
import * as model from '../models/items';
import { IToolsItemConfigs, IRichTextEditor, BeforeSanitizeHtmlArgs } from '../base/interface';
import { toolsLocale } from '../models/default-locale';
import { IToolbarItems, IDropDownItemModel, ISetToolbarStatusArgs, IToolbarItemModel } from './interface';
import { BaseToolbar } from '../actions/base-toolbar';
import { DropDownButtons } from '../actions/dropdown-buttons';
import { ServiceLocator } from '../services/service-locator';
import { SanitizeHtmlHelper, extend, isNullOrUndefined } from '@syncfusion/ej2-base';

let undoRedoItems: string[] = ['Undo', 'Redo'];
let inlineNode: string[] = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'strike', 'sub', 'sup', 'svg',
'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];

export function getIndex(val: string, items: (string | IToolbarItems)[]): number {
    let index: number = -1;
    items.some((item: string, i: number) => {
        if (typeof item === 'string' && val === item.toLocaleLowerCase()) {
            index = i;
            return true;
        }
        return false;
    });
    return index;
}

export function hasClass(element: Element | HTMLElement, className: string): boolean {
    let hasClass: boolean = false;
    if (element.classList.contains(className)) {
        hasClass = true;
    }
    return hasClass;
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
            case 'iconCss':
                result = data.iconCss;
                break;
        }
    }
    return result;
}

export function isIDevice(): boolean {
    let result: boolean = false;
    if (Browser.isDevice && Browser.isIos) {
        result = true;
    }
    return result;
}

export function getFormattedFontSize(value: string): string {
    if (isNOU(value)) { return ''; }
    return value;
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

export function getTooltipText(item: string, serviceLocator: ServiceLocator): string {
    let i10n: L10n = serviceLocator.getService<L10n>('rteLocale');
    let itemLocale: string = toolsLocale[item];
    let tooltipText: string = i10n.getConstant(itemLocale);
    return tooltipText;
}

export function setToolbarStatus(e: ISetToolbarStatusArgs, isPopToolbar: boolean): void {
    let dropDown: DropDownButtons = e.dropDownModule;
    let data: { [key: string]: string | boolean } = <{ [key: string]: string | boolean }>e.args;
    let keys: string[] = Object.keys(e.args);
    for (let key of keys) {
        for (let j: number = 0; j < e.tbItems.length; j++) {
            let item: string = e.tbItems[j].subCommand;
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
                    getIndex(key, e.parent.toolbarSettings.items) > -1) {
                    let value: string = ((data[key]) ? data[key] : '') as string;
                    let result: string = '';
                    switch (key) {
                        case 'formats':
                            if (isNOU(dropDown.formatDropDown) || isPopToolbar ||
                                (!isNOU(dropDown.formatDropDown) && dropDown.formatDropDown.isDestroyed)) { return; }
                            let formatItems: IDropDownItemModel[] = e.parent.format.types;
                            result = getDropDownValue(formatItems, value, 'subCommand', 'text');
                            let formatContent: string = isNOU(e.parent.format.default) ? formatItems[0].text :
                                e.parent.format.default;
                            dropDown.formatDropDown.content = ('<span style="display: inline-flex;' +
                                'width:' + e.parent.format.width + '" >' +
                                '<span class="e-rte-dropdown-btn-text">'
                                + (isNOU(result) ? formatContent : result) +
                                '</span></span>');
                            dropDown.formatDropDown.dataBind();
                            break;
                        case 'alignments':
                            if (isNOU(dropDown.alignDropDown) ||
                                (!isNOU(dropDown.alignDropDown) && dropDown.alignDropDown.isDestroyed)) { return; }
                            let alignItems: IDropDownItemModel[] = model.alignmentItems;
                            result = getDropDownValue(alignItems, value, 'subCommand', 'iconCss');
                            dropDown.alignDropDown.iconCss = isNOU(result) ? 'e-icons e-justify-left' : result;
                            dropDown.alignDropDown.dataBind();
                            break;
                        case 'fontname':
                            if (isNOU(dropDown.fontNameDropDown) || isPopToolbar ||
                                (!isNOU(dropDown.fontNameDropDown) && dropDown.fontNameDropDown.isDestroyed)) { return; }
                            let fontNameItems: IDropDownItemModel[] = e.parent.fontFamily.items;
                            result = getDropDownValue(fontNameItems, value, 'value', 'text');
                            let fontNameContent: string = isNOU(e.parent.fontFamily.default) ? fontNameItems[0].text :
                                e.parent.fontFamily.default;
                            let name: string = (isNOU(result) ? fontNameContent : result);
                            e.tbElements[j].title = name;
                            dropDown.fontNameDropDown.content = ('<span style="display: inline-flex;' +
                                'width:' + e.parent.fontFamily.width + '" >' +
                                '<span class="e-rte-dropdown-btn-text">'
                                + name + '</span></span>');
                            dropDown.fontNameDropDown.dataBind();
                            break;
                        case 'fontsize':
                            if (isNOU(dropDown.fontSizeDropDown) ||
                                (!isNOU(dropDown.fontSizeDropDown) && dropDown.fontSizeDropDown.isDestroyed)) { return; }
                            let fontSizeItems: IDropDownItemModel[] = e.parent.fontSize.items;
                            let fontSizeContent: string = isNOU(e.parent.fontSize.default) ? fontSizeItems[1].text :
                                e.parent.fontSize.default;
                            result = getDropDownValue(
                                fontSizeItems, (value === '' ? fontSizeContent.replace(/\s/g, '') : value), 'value', 'text');
                            dropDown.fontSizeDropDown.content = ('<span style="display: inline-flex;' +
                                'width:' + e.parent.fontSize.width + '" >' +
                                '<span class="e-rte-dropdown-btn-text">'
                                + getFormattedFontSize(result) + '</span></span>');
                            dropDown.fontSizeDropDown.dataBind();
                            break;
                    }
                }
            }
        }
    }
}

export function getCollection(items: string | string[]): string[] {
    if (typeof items === 'object') {
        return items;
    } else {
        return [items];
    }
}

export function getTBarItemsIndex(items: string[], toolbarItems: IToolbarItemModel[]): number[] {
    let itemsIndex: number[] = [];
    for (let i: number = 0; i < items.length; i++) {
        for (let j: number = 0; j < toolbarItems.length; j++) {
            if (toolbarItems[j].type === 'Separator') {
                continue;
            } else {
                if (items[i] === 'OrderedList' && toolbarItems[j].subCommand === 'OL') {
                    itemsIndex.push(j);
                    break;
                } else if (items[i] === 'UnorderedList' && toolbarItems[j].subCommand === 'UL') {
                    itemsIndex.push(j);
                    break;
                } else if (items[i] === 'InsertCode' && toolbarItems[j].subCommand === 'Pre') {
                    itemsIndex.push(j);
                    break;
                } else if (items[i] === toolbarItems[j].subCommand) {
                    itemsIndex.push(j);
                    break;
                }
            }
        }
    }
    return itemsIndex;
}

export function updateUndoRedoStatus(baseToolbar: BaseToolbar, undoRedoStatus: { [key: string]: boolean }): void {
    let i: number = 0;
    let trgItems: number[] = getTBarItemsIndex(getCollection(undoRedoItems), baseToolbar.toolbarObj.items);
    let tbItems: HTMLElement[] = selectAll('.' + classes.CLS_TB_ITEM, baseToolbar.toolbarObj.element);
    let keys: string[] = Object.keys(undoRedoStatus);
    for (let key of keys) {
        let target: HTMLElement = tbItems[trgItems[i]];
        if (target) { baseToolbar.toolbarObj.enableItems(target, undoRedoStatus[key]); }
        i++;
    }
}

/**
 * To dispatch the event manually
 * @hidden
 * @deprecated
 */
export function dispatchEvent(element: Element | HTMLDocument, type: string): void {
    let evt: Event = document.createEvent('HTMLEvents');
    evt.initEvent(type, false, true);
    element.dispatchEvent(evt);
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
export function getTextNodesUnder(docElement: Document, node: Element): Node[] {
    let nodes: Node[] = [];
    for (node = node.firstChild as Element; node; node = node.nextSibling as Element) {
        if (node.nodeType === 3) {
            nodes.push(node);
        } else {
            nodes = nodes.concat(getTextNodesUnder(docElement, node));
        }
    }
    return nodes;
}
export function toObjectLowerCase(obj: { [key: string]: IToolsItemConfigs }): { [key: string]: IToolsItemConfigs } {
    let convertedValue: { [key: string]: IToolsItemConfigs } = {};
    let keys: string[] = Object.keys(obj);
    for (let i: number = 0; i < Object.keys(obj).length; i++) {
        convertedValue[keys[i].toLocaleLowerCase()] = obj[keys[i]];
    }
    return convertedValue;
}
export function getEditValue(value: string, rteObj: IRichTextEditor): string {
    let val: string;
    if (value !== null && value !== '') {
        val = rteObj.enableHtmlEncode ? updateTextNode(decode(value)) : updateTextNode(value);
        rteObj.setProperties({ value: val }, true);
    } else {
        val = rteObj.enableHtmlEncode ? '&lt;p&gt;&lt;br/&gt;&lt;/p&gt;' : '<p><br/></p>';
    }
    return val;
}
export function updateTextNode(value: string): string {
    let tempNode: HTMLElement = document.createElement('div');
    tempNode.innerHTML = value;
    tempNode.setAttribute('class', 'tempDiv');
    let resultElm: HTMLElement = document.createElement('div');
    let childNodes: NodeListOf<Node> = tempNode.childNodes as NodeListOf<Node>;
    if (childNodes.length > 0) {
        let isPreviousInlineElem: boolean;
        let previousParent: HTMLElement;
        let paraElm: HTMLElement;
        while (tempNode.firstChild) {
            if ((tempNode.firstChild.nodeName === '#text' &&
            (tempNode.firstChild.textContent.indexOf('\n') < 0 || tempNode.firstChild.textContent.trim() !== '')) ||
            inlineNode.indexOf(tempNode.firstChild.nodeName.toLocaleLowerCase()) >= 0 ) {
                if (!isPreviousInlineElem) {
                    paraElm = createElement('p');
                    resultElm.appendChild(paraElm);
                    paraElm.appendChild(tempNode.firstChild);
                } else {
                    previousParent.appendChild(tempNode.firstChild);
                }
                previousParent = paraElm;
                isPreviousInlineElem = true;
            } else if (tempNode.firstChild.nodeName === '#text' && (tempNode.firstChild.textContent === '\n' ||
            (tempNode.firstChild.textContent.indexOf('\n') >= 0 && tempNode.firstChild.textContent.trim() === ''))) {
                detach(tempNode.firstChild);
            } else {
                resultElm.appendChild(tempNode.firstChild);
                isPreviousInlineElem = false;
            }
        }
        let imageElm: NodeListOf<HTMLElement> = resultElm.querySelectorAll('img');
        for (let i: number = 0; i < imageElm.length; i++) {
            if (!imageElm[i].classList.contains(classes.CLS_RTE_IMAGE)) {
                imageElm[i].classList.add(classes.CLS_RTE_IMAGE);
            }
            if (!(imageElm[i].classList.contains(classes.CLS_IMGINLINE) ||
            imageElm[i].classList.contains(classes.CLS_IMGBREAK))) {
                imageElm[i].classList.add(classes.CLS_IMGINLINE);
            }
        }
    }
    return resultElm.innerHTML;
}

export function isEditableValueEmpty(value: string): boolean {
    return (value === '<p><br></p>' || value === '&lt;p&gt;&lt;br&gt;&lt;/p&gt;' || value === '') ? true : false;
}

export function decode(value: string): string {
    return value.replace(/&amp;/g, '&').replace(/&amp;lt;/g, '<')
        .replace(/&lt;/g, '<').replace(/&amp;gt;/g, '>')
        .replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
        .replace(/&amp;nbsp;/g, ' ').replace(/&quot;/g, '');
}

export function sanitizeHelper(value: string, parent?: IRichTextEditor): string {
    if (parent.enableHtmlSanitizer) {
        let item: BeforeSanitizeHtmlArgs = SanitizeHtmlHelper.beforeSanitize();
        let beforeEvent: BeforeSanitizeHtmlArgs = {
            cancel: false,
            helper: null
        };
        extend(item, item, beforeEvent);
        parent.trigger('beforeSanitizeHtml', item);
        if (item.cancel && !isNullOrUndefined(item.helper)) {
            value = item.helper(value);
        } else if (!item.cancel) {
            value = SanitizeHtmlHelper.serializeValue(item, value);
        }
    }
    return value;
}

//Converting the base64 url to blob
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