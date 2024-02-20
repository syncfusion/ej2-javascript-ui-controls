/**
 * Defines util methods used by Rich Text Editor.
 */
import { isNullOrUndefined as isNOU, addClass, removeClass, L10n, selectAll, createElement } from '@syncfusion/ej2-base';
import { Browser, detach, SanitizeHtmlHelper, extend } from '@syncfusion/ej2-base';
import * as classes from '../base/classes';
import * as CONSTANT from '../base/constant';
import * as model from '../models/items';
import { BaseToolbar } from '../actions/base-toolbar';
import { DropDownButtons } from '../actions/dropdown-buttons';
import { ServiceLocator } from '../services/service-locator';
import { toolsLocale, fontNameLocale, formatsLocale, numberFormatListLocale, bulletFormatListLocale, defaultLocale} from '../models/default-locale';
import { IToolsItemConfigs, IRichTextEditor, BeforeSanitizeHtmlArgs } from '../base/interface';
import { IToolbarItems, IDropDownItemModel, ISetToolbarStatusArgs, IToolbarItemModel } from './interface';

const undoRedoItems: string[] = ['Undo', 'Redo'];
const inlineNode: string[] = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
    'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
    'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
    'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'strike', 'sub', 'sup', 'svg',
    'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];
/**
 * @param {string} val - specifies the string value
 * @param {string} items - specifies the value
 * @returns {number} - returns the number value
 * @hidden
 */
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

/**
 * @param {Element} element - specifies the element
 * @param {string} className - specifies the string value
 * @returns {boolean} - returns the boolean value
 * @hidden
 */
export function hasClass(element: Element | HTMLElement, className: string): boolean {
    let hasClass: boolean = false;
    if (element.classList.contains(className)) {
        hasClass = true;
    }
    return hasClass;
}

/**
 * @param {IDropDownItemModel} items - specifies the item model
 * @param {string} value - specifies the string value
 * @param {string} type - specifies the string value
 * @param {string} returnType - specifies the return type
 * @returns {string} - returns the string value
 * @hidden
 */
export function getDropDownValue(items: IDropDownItemModel[], value: string, type: string, returnType: string): string {
    let data: IDropDownItemModel;
    let result: string;
    for (let k: number = 0; k < items.length; k++) {
        if (type === 'value' && items[k as number].value.toLocaleLowerCase() === value.toLocaleLowerCase()) {
            data = items[k as number];
            break;
        } else if (type === 'text' && items[k as number].text.toLocaleLowerCase() === value.toLocaleLowerCase()) {
            data = items[k as number];
            break;
        } else if (type === 'subCommand' && items[k as number].subCommand.toLocaleLowerCase() === value.toLocaleLowerCase()) {
            data = items[k as number];
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

/**
 * @returns {boolean} - returns the boolean value
 * @hidden
 */
export function isIDevice(): boolean {
    let result: boolean = false;
    if (Browser.isDevice && Browser.isIos) {
        result = true;
    }
    return result;
}

/**
 * @param {string} value - specifies the value
 * @returns {string} - returns the string value
 * @hidden
 */
export function getFormattedFontSize(value: string): string {
    if (isNOU(value)) {
        return '';
    }
    return value;
}

/**
 * @param {MouseEvent} e - specifies the mouse event
 * @param {HTMLElement} parentElement - specifies the parent element
 * @param {boolean} isIFrame - specifies the boolean value
 * @returns {number} - returns the number
 * @hidden
 */
export function pageYOffset(e: MouseEvent | Touch, parentElement: HTMLElement, isIFrame: boolean): number {
    let y: number = 0;
    if (isIFrame) {
        y = window.pageYOffset + parentElement.getBoundingClientRect().top + e.clientY;
    } else {
        y = e.pageY;
    }
    return y;
}

/**
 * @param {string} item - specifies the string
 * @param {ServiceLocator} serviceLocator - specifies the service locator
 * @returns {string} - returns the string
 * @hidden
 */
export function getTooltipText(item: string, serviceLocator: ServiceLocator): string {
    const i10n: L10n = serviceLocator.getService<L10n>('rteLocale');
    const itemLocale: string = toolsLocale[`${item}`];
    const tooltipText: string = i10n.getConstant(itemLocale);
    return tooltipText;
}

export function getTooltipTextDropdownItems(item: string, serviceLocator: ServiceLocator, localeItems: { [ket: string]: string }[], rteObj?: IRichTextEditor): string {
    if (localeItems) {
        const i10n: L10n = serviceLocator.getService<L10n>('rteLocale');
        for (let i: number = 0; i < localeItems.length; i++) {
            const itemLocale: string = localeItems[i as number].value.toLocaleLowerCase();
            const numberValue: string = localeItems[i as number].locale;
            const numberLocale: string = defaultLocale[`${numberValue}`].toLocaleLowerCase();
            if (item === itemLocale || item === numberLocale) {
                const tooltipText: string = localeItems[i as number].locale;
                return i10n.getConstant(tooltipText);
            }
        }
    } else {
        const fontsize: IDropDownItemModel[] = rteObj.fontSize.items
        for (let i: number = 0; i < fontsize.length; i++) {
            if (item === rteObj.fontSize.items[i as number].value) {
                const fontSize: string = rteObj.fontSize.items[i as number].text;
                return fontSize;
            }
        }
    }
    return '';
}

export function getQuickToolbarTooltipText(item: string): string {
    const keys: string[] = Object.keys(defaultLocale);
    for (let i: number = 0; i < keys.length; i++) {
        const tooltipText: string  = defaultLocale[`${keys[i as number]}`];
        if (item === tooltipText) {
            return tooltipText;
        }
    }
    return '';
}

/**
 * @param {ISetToolbarStatusArgs} e - specifies the e element
 * @param {boolean} isPopToolbar - specifies the boolean value
 * @param {IRichTextEditor} self - specifies the parent element
 * @returns {void}
 * @hidden
 */
export function setToolbarStatus(e: ISetToolbarStatusArgs, isPopToolbar: boolean, self: IRichTextEditor): void {
    updateDropDownFontFormatLocale(self);
    const dropDown: DropDownButtons = e.dropDownModule;
    const data: { [key: string]: string | boolean } = <{ [key: string]: string | boolean }>e.args;
    const keys: string[] = Object.keys(e.args);
    for (const key of keys) {
        for (let j: number = 0; j < e.tbItems.length; j++) {
            const item: string = e.tbItems[j as number].subCommand;
            const itemStr: string = item && item.toLocaleLowerCase();
            if (item && (itemStr === key) || (item === 'UL' && key === 'unorderedlist') || (item === 'OL' && key === 'orderedlist') ||
            (itemStr === 'pre' && key === 'insertcode') || (item === 'NumberFormatList' && key === 'numberFormatList' ||
            item === 'BulletFormatList' && key === 'bulletFormatList')) {
                if (typeof data[`${key}`] === 'boolean') {
                    if (data[`${key}`] === true) {
                        addClass([e.tbElements[j as number]], [classes.CLS_ACTIVE]);
                    } else {
                        removeClass([e.tbElements[j as number]], [classes.CLS_ACTIVE]);
                    }
                } else if ((typeof data[`${key}`] === 'string' || data[`${key}`] === null) &&
                    getIndex(key, e.parent.toolbarSettings.items) >= -1) {
                    const value: string = ((data[`${key}`]) ? data[`${key}`] : '') as string;
                    let result: string = '';
                    switch (key) {
                    case 'formats': {
                        if (isNOU(dropDown.formatDropDown) || isPopToolbar ||
                                (!isNOU(dropDown.formatDropDown) && dropDown.formatDropDown.isDestroyed)) {
                            break;
                        }
                        const formatItems: IDropDownItemModel[] = e.parent.format.types;
                        const formatContent: string = isNOU(e.parent.format.default) ? formatItems[0].text :
                            e.parent.format.default;
                        result = value === 'empty' ? '' : getDropDownValue(formatItems, value, 'subCommand', 'text');
                        dropDown.formatDropDown.content = ('<span style="display: inline-flex;' +
                                'width:' + e.parent.format.width + '" >' +
                                '<span class="e-rte-dropdown-btn-text' + (isNOU(e.parent.cssClass) ? '' : ' ' + e.parent.cssClass) + '">'
                                + (isNOU(result) ? formatContent : result) +
                                '</span></span>');
                        dropDown.formatDropDown.dataBind();
                        break; }
                    case 'alignments': {
                        if (isNOU(dropDown.alignDropDown) ||
                                (!isNOU(dropDown.alignDropDown) && dropDown.alignDropDown.isDestroyed)) {
                            break;
                        }
                        const alignItems: IDropDownItemModel[] = model.alignmentItems;
                        result = getDropDownValue(alignItems, value, 'subCommand', 'iconCss');
                        dropDown.alignDropDown.iconCss = isNOU(result) ? 'e-icons e-justify-left' : result;
                        dropDown.alignDropDown.dataBind();
                        break; }
                    case 'fontname': {
                        if (isNOU(dropDown.fontNameDropDown) || isPopToolbar ||
                            (!isNOU(dropDown.fontNameDropDown) && dropDown.fontNameDropDown.isDestroyed)) {
                            break;
                        }
                        const fontNameItems: IDropDownItemModel[] = e.parent.fontFamily.items;
                        result = value === 'empty' ? '' : getDropDownValue(fontNameItems, value, 'value', 'text');
                        const fontNameContent: string = isNOU(e.parent.fontFamily.default) ? fontNameItems[0].text :
                            e.parent.fontFamily.default;
                        const name: string = (isNOU(result) ? fontNameContent : result);
                        dropDown.fontNameDropDown.content = ('<span style="display: inline-flex;' +
                            'width:' + e.parent.fontFamily.width + '" >' +
                            '<span class="e-rte-dropdown-btn-text' + (isNOU(e.parent.cssClass) ? '' : ' ' + e.parent.cssClass) + '">'
                            + name + '</span></span>');
                        dropDown.fontNameDropDown.dataBind();
                        break; }
                    case 'fontsize': {
                        if (isNOU(dropDown.fontSizeDropDown) ||
                            (!isNOU(dropDown.fontSizeDropDown) && dropDown.fontSizeDropDown.isDestroyed)) {
                            break;
                        }
                        const fontSizeItems: IDropDownItemModel[] = e.parent.fontSize.items;
                        const fontSizeContent: string = isNOU(e.parent.fontSize.default) ? fontSizeItems[1].text :
                            e.parent.fontSize.default;
                        result = value === 'empty' ? '' : getDropDownValue(
                            fontSizeItems, (value === '' ? fontSizeContent.replace(/\s/g, '') : value), 'value', 'text');
                        dropDown.fontSizeDropDown.content = ('<span style="display: inline-flex;' +
                            'width:' + e.parent.fontSize.width + '" >' +
                            '<span class="e-rte-dropdown-btn-text' + (isNOU(e.parent.cssClass) ? '' : ' ' + e.parent.cssClass) + '">'
                            + getFormattedFontSize(result) + '</span></span>');
                        dropDown.fontSizeDropDown.dataBind();
                        break; }
                    case 'bulletFormatList':
                    case 'numberFormatList': {
                        removeClass([e.tbElements[j as number]], [classes.CLS_ACTIVE]); }
                    }
                }
            }
        }
    }
}

/**
 * @param {string} items - specifies the string value
 * @returns {string[]} - returns the array value
 * @hidden
 */
export function getCollection(items: string | string[]): string[] {
    if (typeof items === 'object') {
        return items;
    } else {
        return [items];
    }
}

/**
 * @param {string[]} items - specifies the array of string value
 * @param {IToolbarItemModel} toolbarItems - specifies the tool bar model
 * @returns {number} - returns the number
 * @hidden
 */
export function getTBarItemsIndex(items: string[], toolbarItems: IToolbarItemModel[]): number[] {
    const itemsIndex: number[] = [];
    for (let i: number = 0; i < items.length; i++) {
        for (let j: number = 0; j < toolbarItems.length; j++) {
            if (toolbarItems[j as number].type === 'Separator') {
                continue;
            } else {
                if ((items[i as number] === 'OrderedList' || items[i as number] === 'NumberFormatList') && toolbarItems[j as number].subCommand === 'OL') {
                    itemsIndex.push(j);
                    break;
                } else if ((items[i as number] === 'UnorderedList' || items[i as number] === 'BulletFormatList') && toolbarItems[j as number].subCommand === 'UL') {
                    itemsIndex.push(j);
                    break;
                } else if (items[i as number] === 'InsertCode' && toolbarItems[j as number].subCommand === 'Pre') {
                    itemsIndex.push(j);
                    break;
                } else if (items[i as number] === 'FileManager' && toolbarItems[j as number].subCommand === 'File') {
                    itemsIndex.push(j);
                    break;
                } else if (typeof (items[i as number]) === 'object' && (items[i as number] as IToolbarItems).command === 'Custom') {
                    itemsIndex.push(i);
                    break;
                } else if (items[i as number] === toolbarItems[j as number].subCommand) {
                    itemsIndex.push(j);
                    break;
                }
            }
        }
    }
    return itemsIndex;
}

/**
 * @param {BaseToolbar} baseToolbar - specifies the base
 * @param {boolean} undoRedoStatus - specifies the boolean value
 * @returns {void}
 * @hidden
 */
export function updateUndoRedoStatus(baseToolbar: BaseToolbar, undoRedoStatus: { [key: string]: boolean }): void {
    let i: number = 0;
    const trgItems: number[] = getTBarItemsIndex(getCollection(undoRedoItems), baseToolbar.toolbarObj.items);
    const tbItems: HTMLElement[] = selectAll('.' + classes.CLS_TB_ITEM, baseToolbar.toolbarObj.element);
    const  keys: string[] = Object.keys(undoRedoStatus);
    for (const key of keys) {
        const target: HTMLElement = tbItems[trgItems[i as number]];
        if (target) {
            baseToolbar.toolbarObj.enableItems(target, undoRedoStatus[`${key}`]);
        }
        i++;
    }
}

/**
 * To dispatch the event manually
 *
 * @param {Element} element - specifies the element.
 * @param {string} type - specifies the string type.
 * @returns {void}
 * @hidden
 * @deprecated
 */
export function dispatchEvent(element: Element | HTMLDocument, type: string): void {
    const evt: Event = document.createEvent('HTMLEvents');
    evt.initEvent(type, false, true);
    element.dispatchEvent(evt);
}
/**
 * To parse the HTML
 *
 * @param {string} value - specifies the string value
 * @returns {DocumentFragment} - returns the document
 * @hidden
 */
export function parseHtml(value: string): DocumentFragment {
    const tempNode: HTMLTemplateElement = <HTMLTemplateElement>createElement('template');
    tempNode.innerHTML = value;
    if (tempNode.content instanceof DocumentFragment) {
        return tempNode.content;
    } else {
        return document.createRange().createContextualFragment(value);
    }
}
/**
 * @param {Document} docElement - specifies the document element
 * @param {Element} node - specifies the node
 * @returns {Node[]} - returns the node array
 * @hidden
 */
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
/**
 * @param {IToolsItemConfigs} obj - specifies the configuration
 * @returns {void}
 * @hidden
 */
export function toObjectLowerCase(obj: { [key: string]: IToolsItemConfigs }): { [key: string]: IToolsItemConfigs } {
    const convertedValue: { [key: string]: IToolsItemConfigs } = {};
    const keys: string[] = Object.keys(obj);
    for (let i: number = 0; i < Object.keys(obj).length; i++) {
        convertedValue[keys[i as number].toLocaleLowerCase()] = obj[keys[i as number]];
    }
    return convertedValue;
}
/**
 * @param {string} value - specifies the string value
 * @param {IRichTextEditor} rteObj - specifies the rte object
 * @returns {string} - returns the string
 * @hidden
 */
export function getEditValue(value: string, rteObj: IRichTextEditor): string {
    let val: string;
    if (value !== null && value !== '') {
        val = rteObj.enableHtmlEncode ? updateTextNode(decode(value), rteObj) : updateTextNode(value, rteObj);
        rteObj.setProperties({ value: val }, true);
    } else {
        if (rteObj.enterKey === 'DIV') {
            val = rteObj.enableHtmlEncode ? '&lt;div&gt;&lt;br/&gt;&lt;/div&gt;' : '<div><br/></div>';
        } else if (rteObj.enterKey === 'BR') {
            val = rteObj.enableHtmlEncode ? '&lt;br/&gt;' : '<br/>';
        } else {
            val = rteObj.enableHtmlEncode ? '&lt;p&gt;&lt;br/&gt;&lt;/p&gt;' : '<p><br/></p>';
        }
    }
    return val;
}
/**
 * @param {string} value - specifies the value
 * @param {IRichTextEditor} rteObj - specifies the rich text editor instance.
 * @returns {string} - returns the string
 * @hidden
 */
export function updateTextNode(value: string, rteObj?: IRichTextEditor): string {
    const tempNode: HTMLElement = document.createElement('div');
    const resultElm: HTMLElement = document.createElement('div');
    const childNodes: NodeListOf<Node> = tempNode.childNodes as NodeListOf<Node>;
    tempNode.innerHTML = value;
    tempNode.setAttribute('class', 'tempDiv');
    if (childNodes.length > 0) {
        let isPreviousInlineElem: boolean;
        let previousParent: HTMLElement;
        let insertElem: HTMLElement;
        while (tempNode.firstChild) {
            const emptyBlockElem: NodeListOf<Element> = tempNode.querySelectorAll(CONSTANT.blockEmptyNodes);
            for (let i: number = 0; i < emptyBlockElem.length; i++) {
                emptyBlockElem[i as number].innerHTML = '<br>';
            }
            // To handle the Empty block node with \n
            const allPNodes: NodeListOf<Element> = tempNode.querySelectorAll('p');
            for (let i: number = 0; i < allPNodes.length; i++) {
                if (allPNodes[i as number].textContent.trim().length === 0 && allPNodes[i as number].childNodes.length === 1
                    && allPNodes[i as number].childNodes[0].nodeName === '#text' &&
                    isNOU(allPNodes[i as number].childNodes[0].textContent.match(/\u00a0/g))) {
                    allPNodes[i as number].innerHTML = '<br>';
                }
            }
            const emptyInlineElem: NodeListOf<Element> = tempNode.querySelectorAll(CONSTANT.inlineEmptyNodes);
            for (let i: number = 0; i < emptyInlineElem.length; i++) {
                emptyInlineElem[i as number].innerHTML = '&ZeroWidthSpace;';
            }
            if (rteObj.enterKey !== 'BR' && ((tempNode.firstChild.nodeName === '#text' &&
            (tempNode.firstChild.textContent.indexOf('\n') < 0 || tempNode.firstChild.textContent.trim() !== '')) ||
            inlineNode.indexOf(tempNode.firstChild.nodeName.toLocaleLowerCase()) >= 0)) {
                if (!isPreviousInlineElem) {
                    if (rteObj.enterKey === 'DIV') {
                        insertElem = createElement('div');
                    } else {
                        insertElem = createElement('p');
                    }
                    resultElm.appendChild(insertElem);
                    insertElem.appendChild(tempNode.firstChild);
                } else {
                    previousParent.appendChild(tempNode.firstChild);
                }
                previousParent = insertElem;
                isPreviousInlineElem = true;
            } else if (tempNode.firstChild.nodeName === '#text' && (tempNode.firstChild.textContent === '\n' ||
            (tempNode.firstChild.textContent.indexOf('\n') >= 0 && tempNode.firstChild.textContent.trim() === ''))) {
                detach(tempNode.firstChild);
            } else {
                resultElm.appendChild(tempNode.firstChild);
                isPreviousInlineElem = false;
            }
        }
        const imageElm: NodeListOf<HTMLElement> = resultElm.querySelectorAll('img');
        for (let i: number = 0; i < imageElm.length; i++) {
            if ((imageElm[i as number] as HTMLImageElement).classList.contains('e-rte-image-unsupported')) {
                continue; // Should not add the class if the image is Broken.
            }
            if (!imageElm[i as number].classList.contains(classes.CLS_RTE_IMAGE)) {
                imageElm[i as number].classList.add(classes.CLS_RTE_IMAGE);
            }
            if (!(imageElm[i as number].classList.contains(classes.CLS_IMGINLINE) ||
            imageElm[i as number].classList.contains(classes.CLS_IMGBREAK))) {
                imageElm[i as number].classList.add(classes.CLS_IMGINLINE);
            }
        }
    }
    return resultElm.innerHTML;
}

/**
 * @param {IRichTextEditor} rteObj - specifies the rte object
 * @returns {string} - returns the value based on enter configuration.
 * @hidden
 */
export function getDefaultValue(rteObj: IRichTextEditor): string {
    let currentVal: string;
    if (rteObj.enterKey === 'DIV') {
        currentVal = rteObj.enableHtmlEncode ? '&lt;div&gt;&lt;br/&gt;&lt;/div&gt;' : '<div><br/></div>';
    } else if (rteObj.enterKey === 'BR') {
        currentVal = rteObj.enableHtmlEncode ? '&lt;br/&gt;' : '<br/>';
    } else {
        currentVal = rteObj.enableHtmlEncode ? '&lt;p&gt;&lt;br/&gt;&lt;/p&gt;' : '<p><br/></p>';
    }
    return currentVal;
}

/**
 * @param {string} value - specifies the value
 * @returns {boolean} - returns the boolean value
 * @hidden
 */
export function isEditableValueEmpty(value: string): boolean {
    return (value === '<p><br></p>' || value === '&lt;p&gt;&lt;br&gt;&lt;/p&gt;'
    || value === '<div><br></div>' || value === '&lt;div&gt;&lt;br&gt;&lt;/div&gt;'
    || value === '<br>' || value === '&lt;br&gt;'
    || value === '') ? true : false;
}

/**
 * @param {string} value - specifies the string value
 * @returns {string} - returns the string
 * @hidden
 */
export function decode(value: string): string {
    return value.replace(/&amp;/g, '&').replace(/&amp;lt;/g, '<')
        .replace(/&lt;/g, '<').replace(/&amp;gt;/g, '>')
        .replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
        .replace(/&amp;nbsp;/g, ' ').replace(/&quot;/g, '');
}

/**
 * @param {string} value - specifies the string value
 * @param {IRichTextEditor} parent - specifies the rte
 * @returns {string} - returns the string value
 * @hidden
 */
export function sanitizeHelper(value: string, parent?: IRichTextEditor): string {
    if (parent.enableHtmlSanitizer) {
        const item: BeforeSanitizeHtmlArgs = SanitizeHtmlHelper.beforeSanitize();
        if (item.selectors.tags[2] && item.selectors.tags[2].indexOf('iframe') > -1) {
            item.selectors.tags[2] = 'iframe:not(.e-rte-embed-url)';
        }
        const beforeEvent: BeforeSanitizeHtmlArgs = {
            cancel: false,
            helper: null
        };
        extend(item, item, beforeEvent);
        parent.trigger('beforeSanitizeHtml', item);
        if (item.cancel && !isNOU(item.helper)) {
            value = item.helper(value);
        } else if (!item.cancel) {
            value = SanitizeHtmlHelper.serializeValue(item, value);
        }
    }
    return value;
}
/**
 * @param {string} dataUrl - specifies the string value
 * @returns {BaseToolbar} - returns the value
 * @hidden
 */
//Converting the base64 url to blob
export function convertToBlob(dataUrl: string): Blob {
    const arr: string[] = dataUrl.split(',');
    const mime: string = arr[0].match(/:(.*?);/)[1];
    const bstr: string = atob(arr[1]);
    let n: number = bstr.length;
    const u8arr: Uint8Array = new Uint8Array(n);
    while (n--) {
        u8arr[n as number] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

/**
 * @param {IRichTextEditor} self - specifies the rte
 * @param {string} localeItems - specifies the locale items
 * @param {IDropDownItemModel} item - specifies the dropdown item
 * @returns {string} - returns the value
 * @hidden
 */
export function getLocaleFontFormat(self: IRichTextEditor, localeItems: { [ket: string]: string }[], item: IDropDownItemModel): string {
    for (let i: number = 0; localeItems.length > i; i++) {
        if (localeItems[i as number].value === item.value || localeItems[i as number].value === item.subCommand) {
            return self.localeObj.getConstant(localeItems[i as number].locale);
        }
    }
    return item.text;
}

/**
 * @param {IRichTextEditor} self - specifies the rte
 * @returns {void}
 * @hidden
 */
export function updateDropDownFontFormatLocale(self: IRichTextEditor): void {
    model.fontFamily.forEach((item: IDropDownItemModel, i: number) => {
        model.fontFamily[i as number].text = getLocaleFontFormat(self, fontNameLocale, model.fontFamily[i as number]);
    });
    model.formatItems.forEach((item: IDropDownItemModel, i: number) => {
        model.formatItems[i as number].text = getLocaleFontFormat(self, formatsLocale, model.formatItems[i as number]);
    });
    model.numberFormatList.forEach((item: IDropDownItemModel, i: number) => {
        model.numberFormatList[i as number].text = getLocaleFontFormat(self, numberFormatListLocale, model.numberFormatList[i as number]);
    });
    model.bulletFormatList.forEach((item: IDropDownItemModel, i: number) => {
        model.bulletFormatList[i as number].text = getLocaleFontFormat(self, bulletFormatListLocale, model.bulletFormatList[i as number]);
    });
}
