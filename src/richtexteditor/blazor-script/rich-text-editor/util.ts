import { extend, isNullOrUndefined as isNOU, SanitizeHtmlHelper, Browser, createElement, detach, isNullOrUndefined } from '../../base'; /*externalscript*/
import { addClass, removeClass } from '../../base'; /*externalscript*/
import * as classes from './classes';
import { SfRichTextEditor } from './sf-richtexteditor-fn';
import { ISetToolbarStatusArgs, ToolsItem } from './interfaces';
import { BeforeSanitizeHtmlArgs, IDropDownItemModel, IExecutionGroup, SanitizeRemoveAttrs } from '../src/common/interface';

/**
 * Util functions
 */

const inlineNode: string[] = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
    'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
    'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
    'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'strike', 'sub', 'sup', 'svg',
    'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];

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
        subCommand: 'Image'
    },
    'insertAudio': {
        command: 'Audios',
        subCommand: 'Audio'
    },
    'insertVideo': {
        command: 'Videos',
        subCommand: 'Video'
    },
    'editImage': {
        command: 'Images',
        subCommand: 'Image'
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
    },
    'insertCodeBlock': {
        command: 'CodeBlock',
        subCommand: 'CodeBlock'
    }
};

export function sanitizeHelper(value: string, parent?: SfRichTextEditor): string {
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
        if (!isNOU(parent.deniedSanitizeSelectors) && parent.deniedSanitizeSelectors.length > 0) {
            for (let i: number = 0; i < parent.deniedSanitizeSelectors.length; i++) {
                for (let j: number = 0; j < item.selectors.tags.length; j++) {
                    if (item.selectors.tags[j as number] === parent.deniedSanitizeSelectors[i as number]) {
                        item.selectors.tags = item.selectors.tags.filter((values: string) => values !==
                        parent.deniedSanitizeSelectors[i as number]);
                    }
                }
                for (let k: number = 0; k < item.selectors.attributes.length; k++) {
                    if ((item.selectors.attributes[k as number].attribute ||
                        item.selectors.attributes[k as number].selector) === parent.deniedSanitizeSelectors[i as number]) {
                        item.selectors.attributes = item.selectors.attributes.filter((values: SanitizeRemoveAttrs) =>
                            values !== item.selectors.attributes[k as number]);
                    }
                }
            }
        }
        if (!isNOU(parent.additionalSanitizeAttributes) && parent.additionalSanitizeAttributes.length > 0) {
            item.selectors.attributes = item.selectors.attributes.concat(parent.additionalSanitizeAttributes);
        }
        if (!isNOU(parent.additionalSanitizeTags) && parent.additionalSanitizeTags.length > 0) {
            item.selectors.tags = item.selectors.tags.concat(parent.additionalSanitizeTags);
        }
        if (!item.cancel) {
            value = SanitizeHtmlHelper.serializeValue(item, value);
        }
    }
    value = parseHelper(value);
    return value;
}

export function parseHelper(value: string): string {
    const temp: HTMLElement = createElement('div');
    value = value.replace(/&(times|divide|ne)/g, '&amp;amp;$1');
    temp.innerHTML = value;
    const fontElements: NodeListOf<HTMLFontElement> = temp.querySelectorAll('font');
    fontElements.forEach((font: HTMLFontElement) => {
        const span: HTMLSpanElement = document.createElement('span');
        let style: string = (font.getAttribute('style') || '').replace(/style:/gi, '').trim();
        if (!isNOU(style) && style.trim() !== '' && !style.endsWith(';')) {
            style += ';';
        }
        Array.from(font.attributes).forEach((attr: Attr) => {
            const name: string = attr.name.toLowerCase();
            const value: string = attr.value;
            switch (name) {
            case 'size':
                style += `font-size:${value};`;
                break;
            case 'face':
                style += `font-family:${value};`;
                break;
            case 'bgcolor':
                style += `background-color:${value};`;
                break;
            case 'style':
                break;
            default:
                style += `${name}:${value};`;
                break;
            }
        });
        if (!isNOU(style) && style.trim() !== '') {
            style = style.replace(/;;+/g, ';');
            span.style.cssText =  style;
        }
        span.innerHTML = font.innerHTML;
        if (!isNOU(font.parentNode)) {
            font.parentNode.replaceChild(span, font);
        }
    });
    const parsedValue: string = temp.innerHTML;
    temp.remove();
    return parsedValue;
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
        val = rteObj.enableHtmlEncode ? rteObj.encode(updateTextNode(decode(value), rteObj)) : updateTextNode(value, rteObj);
        rteObj.value = val;
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
 * @param {SfRichTextEditor} rteObj - specifies the rte object
 * @returns {string} - returns the value based on enter configuration.
 * @hidden
 */
export function getDefaultValue(rteObj: SfRichTextEditor): string {
    let currentVal: string;
    if (rteObj.enterKey === 'DIV') {
        currentVal = '<div><br/></div>';
    } else if (rteObj.enterKey === 'BR') {
        currentVal = '<br/>';
    } else {
        currentVal = '<p><br/></p>';
    }
    return currentVal;
}

/**
 * @param {string} value - specifies the value
 * @param {SfRichTextEditor} rteObj - The instance of SfRichTextEditor to update.
 * @returns {string} - returns the string
 * @hidden
 */
export function updateTextNode(value: string, rteObj: SfRichTextEditor): string {
    const tempNode: HTMLElement = document.createElement('div');
    const resultElm: HTMLElement = document.createElement('div');
    const childNodes: NodeListOf<Node> = tempNode.childNodes as NodeListOf<Node>;
    tempNode.innerHTML = value.trim();
    tempNode.setAttribute('class', 'tempDiv');
    if (childNodes.length > 0) {
        let isPreviousInlineElem: boolean;
        let previousParent: HTMLElement;
        let insertElem: HTMLElement;
        while (tempNode.firstChild) {
            let isEmptySpace: boolean = false;
            if (tempNode.firstChild.nodeName === '#text' && tempNode.firstChild.textContent === ' ') {
                const inlineElements: string[] = [
                    'A', 'ABBR', 'ACRONYM', 'B', 'BDO', 'BIG', 'BR', 'BUTTON', 'CITE', 'CODE', 'DFN', 'EM', 'I', 'INPUT',
                    'KBD', 'LABEL', 'MAP', 'OBJECT', 'Q', 'SAMP', 'SCRIPT', 'SELECT', 'SMALL', 'SPAN', 'STRONG', 'SUB', 'SUP',
                    'TEXTAREA', 'TIME', 'TT', 'U', 'VAR', 'WBR'
                ];
                if (!isNullOrUndefined(tempNode.firstChild.nextSibling)
                    && inlineElements.indexOf(tempNode.firstChild.nextSibling.nodeName) !== -1) {
                    isEmptySpace = false;
                } else {
                    isEmptySpace = true;
                }
            }
            if (rteObj.enterKey !== 'BR' && ((tempNode.firstChild.nodeName === '#text' &&
            (tempNode.firstChild.textContent.indexOf('\n') < 0 || tempNode.firstChild.textContent.trim() !== '')) ||
            inlineNode.indexOf(tempNode.firstChild.nodeName.toLocaleLowerCase()) >= 0) && !isEmptySpace) {
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
            (tempNode.firstChild.textContent.indexOf('\n') >= 0 && tempNode.firstChild.textContent.trim() === '') || isEmptySpace)) {
                detach(tempNode.firstChild);
            } else {
                resultElm.appendChild(tempNode.firstChild);
                isPreviousInlineElem = false;
            }
        }
        const imageElm: NodeListOf<HTMLElement> = resultElm.querySelectorAll('img');
        for (let i: number = 0; i < imageElm.length; i++) {
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

export function decode(value: string): string {
    return value.replace(/&amp;/g, '&').replace(/&amp;lt;/g, '<')
        .replace(/&lt;/g, '<').replace(/&amp;gt;/g, '>')
        .replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
        .replace(/&amp;nbsp;/g, ' ').replace(/&quot;/g, '');
}

export function dispatchEvent(element: Element | HTMLDocument, type: string): void {
    const evt: Event = new Event(type, {
        bubbles: false, // set to true if you want the event to bubble
        cancelable: true // set to false if the event should not be cancelable
    });
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
    const tempNode: HTMLTemplateElement = <HTMLTemplateElement>createElement('template');
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
        const iFrame: HTMLDocument = rte.getDocument();
        target = iFrame.querySelector('body');
    } else {
        target = rte.element;
    }
    if (Object.keys(htmlAttributes).length) {
        for (const htmlAttr of Object.keys(htmlAttributes)) {
            if (htmlAttr === 'class') {
                target.classList.add(htmlAttributes[htmlAttr as string]);
            } else if (htmlAttr === 'disabled' && htmlAttributes[htmlAttr as string] === 'disabled') {
                rte.enabled = false;
                rte.setEnable();
            } else if (htmlAttr === 'readonly' && htmlAttributes[htmlAttr as string] === 'readonly') {
                rte.readonly = true;
                rte.setReadOnly(initial);
            } else if (htmlAttr === 'style') {
                target.style.cssText = htmlAttributes[htmlAttr as string];
            } else if (htmlAttr === 'tabindex') {
                rte.inputElement.setAttribute('tabindex', htmlAttributes[htmlAttr as string]);
            } else if (htmlAttr === 'placeholder') {
                rte.placeholder = htmlAttributes[htmlAttr as string];
                rte.setPlaceHolder();
            } else {
                const validateAttr: string[] = ['name', 'required'];
                if (validateAttr.indexOf(htmlAttr) > -1) {
                    rte.valueContainer.setAttribute(htmlAttr, htmlAttributes[htmlAttr as string]);
                } else {
                    target.setAttribute(htmlAttr, htmlAttributes[htmlAttr as string]);
                }
            }
        }
    }
}
export function getFormattedFontSize(value: string): string {
    if (isNOU(value)) { return ''; }
    return value;
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

export function setToolbarStatus(e: ISetToolbarStatusArgs, isPopToolbar: boolean): void {
    const dropDown: { [key: string]: object } = e.dropDownModule as { [key: string]: object };
    const data: { [key: string]: string | boolean } = <{ [key: string]: string | boolean }>e.args;
    const keys: string[] = Object.keys(e.args);
    let fontSizeContent: string;
    let fontSizeItems: IDropDownItemModel[];
    let name: string;
    let fontNameContent: string;
    let fontNameItems: IDropDownItemModel[];
    let formatContent: string;
    let formatItems: IDropDownItemModel[];
    for (const key of keys) {
        for (let j: number = 0; j < e.tbItems.length; j++) {
            const item: string = e.tbItems[j as number] && e.tbItems[j as number].subCommand;
            const itemStr: string = item && item.toLocaleLowerCase();
            if (item && (itemStr === key) || (item === 'UL' && key === 'unorderedlist') || (item === 'OL' && key === 'orderedlist') || (item === 'CodeBlock' && key === 'isCodeBlock') ||
                (itemStr === 'pre' && key === 'insertcode') || (item === 'NumberFormatList' && key === 'numberFormatList' ||
                item === 'BulletFormatList' && key === 'bulletFormatList')) {
                if (typeof data[key as string] === 'boolean') {
                    if (data[key as string] === true) {
                        addClass([e.tbElements[j as number]], [classes.CLS_ACTIVE]);
                    } else {
                        removeClass([e.tbElements[j as number]], [classes.CLS_ACTIVE]);
                    }
                } else if ((typeof data[key as string] === 'string' || data[key as string] === null) &&
                    getIndex(key, e.parent.toolbarSettings.items as ToolsItem[]) >= -1) {
                    const value: string = ((data[key as string]) ? data[key as string] : '') as string;
                    let result: string = '';
                    let dropdownBtnText: HTMLElement;
                    switch (key) {
                    case 'formats':
                        formatItems = e.parent.format.items;
                        result = value === 'empty' ? '' : getDropDownValue(formatItems, value, 'subCommand', 'text');
                        formatContent = (isNOU(e.parent.format.default) ? formatItems[0].text :
                            e.parent.format.default);
                        dropdownBtnText = e.tbElements[j as number].querySelector('.e-rte-dropdown-btn-text') as HTMLElement;
                        dropdownBtnText.innerText = (isNOU(result) ? formatContent : result);
                        dropdownBtnText.parentElement.style.width = e.parent.format.width;
                        break;
                    case 'alignments':
                        result = getDropDownValue(e.parent.alignments as IDropDownItemModel[], value, 'subCommand', 'cssClass');
                        dropdownBtnText = e.tbElements[j as number].querySelector('.e-btn-icon.e-icons');
                        removeClass([dropdownBtnText], ['e-justify-left', 'e-justify-center', 'e-justify-right', 'e-justify-full']);
                        addClass([dropdownBtnText], (isNOU(result) ? ['e-icons', 'e-justify-left'] : result.split(' ')));
                        break;
                    case 'fontname':
                        fontNameItems = e.parent.fontFamily.items;
                        result = value === 'empty' ? '' : getDropDownValue(fontNameItems, value, 'value', 'text');
                        fontNameContent = isNOU(e.parent.fontFamily.default) ? fontNameItems[0].text :
                            e.parent.fontFamily.default;
                        name = (isNOU(result) ? fontNameContent : result);
                        dropdownBtnText = e.tbElements[j as number].querySelector('.e-rte-dropdown-btn-text') as HTMLElement;
                        dropdownBtnText.innerText = (name === 'Default' ? 'Font Name' : name);
                        dropdownBtnText.parentElement.style.width = e.parent.fontFamily.width;
                        break;
                    case 'fontsize':
                        fontSizeItems = e.parent.fontSize.items;
                        fontSizeContent = (isNOU(e.parent.fontSize.default) ? fontSizeItems[0].value :
                            e.parent.fontSize.default);
                        result = value === 'empty' ? '' : getDropDownValue(
                            fontSizeItems, (value === '' ? fontSizeContent.replace(/\s/g, '') : value), 'value', 'text');
                        dropdownBtnText = e.tbElements[j as number].querySelector('.e-rte-dropdown-btn-text') as HTMLElement;
                        dropdownBtnText.innerText = (getFormattedFontSize(result) === 'Default' ? 'Font Size' : getFormattedFontSize(result));
                        dropdownBtnText.parentElement.style.width = e.parent.fontSize.width;
                        break;
                    case 'bulletFormatList':
                    case 'numberFormatList':
                        if (value !== '') {
                            addClass([e.tbElements[j as number]], [classes.CLS_ACTIVE]);
                        } else {
                            removeClass([e.tbElements[j as number]], [classes.CLS_ACTIVE]);
                        }
                    }
                }
            }
        }
    }
}

export function scrollY(e: MouseEvent | Touch, parentElement: HTMLElement, isIFrame: boolean): number {
    let y: number = 0;
    if (isIFrame) {
        y = window.scrollY + parentElement.getBoundingClientRect().top + e.clientY;
    } else {
        y = e.pageY;
    }
    return y;
}
