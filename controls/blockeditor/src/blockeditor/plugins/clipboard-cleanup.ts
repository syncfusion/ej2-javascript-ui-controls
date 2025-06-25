/* eslint-disable security/detect-object-injection */

import { isNullOrUndefined as isNOU, detach, createElement, addClass } from '@syncfusion/ej2-base';
import { BlockEditor } from '../base/blockeditor';
import { IPasteCleanupArgs } from '../base/interface';

/**
 * Handles cleanup of pasted content for the Block Editor.
 */
export class ClipboardCleanupModule {
    private editor: BlockEditor;
    private inlineNode: string[] = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
        'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
        'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
        'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'svg',
        'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];
    private blockNode: string[] = ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'address', 'blockquote', 'button', 'center', 'dd', 'dir', 'dl', 'dt', 'fieldset',
        'frameset', 'hr', 'iframe', 'isindex', 'li', 'map', 'menu', 'noframes', 'noscript',
        'object', 'ol', 'pre', 'td', 'tr', 'th', 'tbody', 'tfoot', 'thead', 'table', 'ul',
        'header', 'article', 'nav', 'footer', 'section', 'aside', 'main', 'figure', 'figcaption'];
    private removableElements: string[] = ['o:p', 'style', 'w:sdt', 'xml', 'script', 'meta', 'link'];
    private ignorableNodes: string[] = ['A', 'APPLET', 'B', 'BLOCKQUOTE', 'BR',
        'BUTTON', 'CENTER', 'CODE', 'COL', 'COLGROUP', 'DD', 'DEL', 'DFN', 'DIR', 'DIV',
        'DL', 'DT', 'EM', 'FIELDSET', 'FONT', 'FORM', 'FRAME', 'FRAMESET', 'H1', 'H2',
        'H3', 'H4', 'H5', 'H6', 'HR', 'I', 'IMG', 'IFRAME', 'INPUT', 'INS', 'LABEL',
        'LI', 'OL', 'OPTION', 'P', 'PARAM', 'PRE', 'Q', 'S', 'SELECT', 'SPAN', 'STRIKE',
        'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TD', 'TEXTAREA', 'TFOOT', 'TH',
        'THEAD', 'TITLE', 'TR', 'TT', 'U', 'UL'];
    private borderStyle: string[] = ['border-top', 'border-right', 'border-bottom', 'border-left'];
    private upperRomanNumber: string[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX',
        'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
    private lowerRomanNumber: string[] = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix',
        'x', 'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx'];
    private lowerGreekNumber: string[] = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ',
        'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'];
    private listContents: string[] = [];
    private msWordPatterns: RegExp[] = [
        /class='?Mso|style='[^ ]*\bmso-/i,
        /class="?Mso|style="[^ ]*\bmso-/i,
        /(class="?Mso|class='?Mso|class="?Xl|class='?Xl|class=Xl|style="[^"]*\bmso-|style='[^']*\bmso-|w:WordDocument)/gi,
        /style='mso-width-source:/i,

        // New Office 365 patterns
        /\bOutlineElement\b/i,
        /\bSCXW\d+\b/i,  // e.g., SCXW218690740
        /\bBCX\d+\b/i,   // e.g., BCX0
        /\bTextRun\b/i,
        /\bEOP\b/i,
        /\bpara(id|eid)=/i,  // e.g., paraid="292866517"
        /data-ccp-/i,        // e.g., data-ccp-parastyle
        /\bWACImageContainer\b/i  // Word's image container
    ];

    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    public cleanupPaste(args: IPasteCleanupArgs): string {
        const { e, html, plainText }: IPasteCleanupArgs = args;
        if (this.editor.pasteSettings.plainText) {
            return this.plainFormatting(plainText);
        }

        const isFromMsWord: boolean = this.isFromMsWord(html);
        if (isFromMsWord) {
            return this.cleanMsWordContent(html);
        }

        return this.cleanupHtml(html, this.editor.pasteSettings.keepFormat);
    }

    public isFromMsWord(html: string): boolean {
        return this.msWordPatterns.some((pattern: RegExp) => pattern.test(html));
    }

    private cleanMsWordContent(html: string): string {
        const tempDiv: HTMLElement = createElement('div') as HTMLElement;
        tempDiv.innerHTML = html;
        let listNodes: Element[] = [];

        this.addListClass(tempDiv);
        listNodes = this.cleanUp(tempDiv, listNodes);
        if (!isNOU(listNodes[0]) && listNodes[0].parentElement.tagName !== 'UL' &&
            listNodes[0].parentElement.tagName !== 'OL') {
            this.listConverter(listNodes);
        }

        // Remove Word-specific elements
        this.removeUnwantedElements(tempDiv);

        // Clean up lists
        this.cleanupLists(tempDiv);

        // Process tables
        this.processWordTables(tempDiv);

        // Remove Word-specific classes
        this.removeWordClasses(tempDiv);

        // Clean up styles
        this.cleanupStyles(tempDiv, this.editor.pasteSettings.allowedStyles);

        // Remove empty elements
        this.removeEmptyElements(tempDiv);

        // Remove comments
        this.removeComments(tempDiv);

        // Process images
        this.processImages(tempDiv);

        return tempDiv.innerHTML;
    }

    private addListClass(elm: HTMLElement): void {
        const allNodes: NodeListOf<Element> = elm.querySelectorAll('*');
        for (let index: number = 0; index < allNodes.length; index++) {
            if (!isNOU(allNodes[index as number].getAttribute('style')) && allNodes[index as number].getAttribute('style').replace(/ /g, '').replace('\n', '').indexOf('mso-list:l') >= 0 &&
                (allNodes[index as number] as Element).className.toLowerCase().indexOf('msolistparagraph') === -1 &&
                allNodes[index as number].tagName.charAt(0) !== 'H' && allNodes[index as number].tagName !== 'LI' &&
                allNodes[index as number].tagName !== 'OL' && allNodes[index as number].tagName !== 'UL') {
                allNodes[index as number].classList.add('msolistparagraph');
            }
        }
    }

    private cleanUp(node: HTMLElement, listNodes: Element[]): Element[] {
        const tempCleaner: Element[] = [];
        let prevflagState: boolean;
        const allNodes: NodeListOf<Element> = node.querySelectorAll('*');
        for (let index: number = 0; index < allNodes.length; index++) {
            if (this.ignorableNodes.indexOf(allNodes[index as number].nodeName) === -1 ||
                (allNodes[index as number].nodeType === 3 && allNodes[index as number].textContent.trim() === '')) {
                tempCleaner.push(allNodes[index as number] as Element);
                continue;
            } else if ((allNodes[index as number] as Element).className &&
                (allNodes[index as number] as Element).className.toLowerCase().indexOf('msolistparagraph') !== -1 &&
                !isNOU(allNodes[index as number].getAttribute('style')) &&
                allNodes[index as number].getAttribute('style').indexOf('mso-list:') >= 0) {
                if (allNodes[index as number].className.indexOf('MsoListParagraphCxSpFirst') >= 0 && listNodes.length > 0 &&
                    listNodes[listNodes.length - 1] !== null) {
                    listNodes.push(null);
                }
                listNodes.push(allNodes[index as number] as Element);
            }
            if (prevflagState && (this.blockNode.indexOf(allNodes[index as number].nodeName.toLowerCase()) !== -1) &&
                !((allNodes[index as number] as Element).className &&
                    (allNodes[index as number] as Element).className.toLowerCase().indexOf('msolistparagraph') !== -1 && !isNOU(allNodes[index as number].getAttribute('style')) &&
                    allNodes[index as number].getAttribute('style').indexOf('mso-list:') >= 0)) {
                listNodes.push(null);
            }
            if (this.blockNode.indexOf(allNodes[index as number].nodeName.toLowerCase()) !== -1) {
                if ((allNodes[index as number] as Element).className &&
                    (allNodes[index as number] as Element).className.toLowerCase().indexOf('msolistparagraph') !== -1 && !isNOU(allNodes[index as number].getAttribute('style')) &&
                    allNodes[index as number].getAttribute('style').indexOf('mso-list:') >= 0) {
                    prevflagState = true;
                } else {
                    prevflagState = false;
                }
            }
        }
        if (listNodes.length && (listNodes[listNodes.length - 1] !== null)) {
            listNodes.push(null);
        }
        return listNodes;
    }

    private listConverter(listNodes: Element[]): void {
        let level: number;
        const data: { content: HTMLElement; node: Element }[] = [];
        let listFormatOverride: number;
        let collection: {
            listType: string; content: string[]; nestedLevel: number; listFormatOverride: number,
            class: string, listStyle: string, listStyleTypeName: string, start: number, styleMarginLeft: string
        }[] = [];
        let content: string = '';
        let stNode: Element;
        let currentListStyle: string = '';
        for (let i: number = 0; i < listNodes.length; i++) {
            if (listNodes[i as number] === null) {
                data.push({ content: this.makeConversion(collection), node: listNodes[i - 1] });
                collection = [];
                continue;
            }
            if (listNodes[i as number].getAttribute('style') && listNodes[i as number].getAttribute('style').indexOf('mso-outline-level') !== -1) {
                listNodes[i as number].setAttribute('style', listNodes[i as number].getAttribute('style').replace('mso-outline-level', 'mso-outline'));
            }
            content = listNodes[i as number].getAttribute('style');
            if (content && content.indexOf('level') !== -1) {
                // eslint-disable-next-line
                level = parseInt(content.charAt(content.indexOf('level') + 5), null);
            } else {
                level = 1;
            }
            if (content && content.indexOf('mso-list:') !== -1) {
                let msoListValue: string[];
                if (content.match(/mso-list:[^;]+;?/)) {
                    const changedContent: string = content.replace(new RegExp('\\n', 'g'), '').split(' ').join('');
                    msoListValue = changedContent.match(/mso-list:[^;]+;?/)[0].split(':l');
                    listFormatOverride = isNOU(msoListValue) ? null : parseInt(msoListValue[1].split('level')[0], 10);
                } else {
                    listFormatOverride = null;
                }
            }
            this.listContents = [];
            this.getListContent(listNodes[i as number]);
            let type: string;
            let listStyleType: string;
            let startAttr: number;
            let styleMarginLeft: string;
            if (!isNOU(this.listContents[0])) {
                type = this.listContents[0].trim().length > 1 ? 'ol' : 'ul';
                listStyleType = this.getlistStyleType(this.listContents[0], type);
                if (type === 'ol' && (i === 0 || listNodes[i as number - 1] === null)) {
                    const startString: string = this.listContents[0].split('.')[0];
                    const listTypes: string[] = ['A', 'a', 'I', 'i', 'α', '1', '01', '1-']; // Add '1-' for rare list type.
                    if (listTypes.indexOf(startString) === -1) {
                        if (listStyleType === 'decimal') {
                            // Bug in getlistStyleType() list style stype is returned as decimal for nested list with start attribute
                            if (!isNaN(parseInt(startString, 10))) {
                                startAttr = parseInt(startString, 10);
                            }
                        } else if (listStyleType === 'decimal-leading-zero') {
                            if (!isNaN(parseInt(startString, 10))) {
                                startAttr = parseInt(startString, 10);
                            }
                        } else if (listStyleType === 'upper-alpha') {
                            startAttr = (startString.split('.')[0].charCodeAt(0) - 64);
                        } else if (listStyleType === 'lower-alpha') {
                            startAttr = (startString.split('.')[0].charCodeAt(0) - 96);
                        } else if (listStyleType === 'upper-roman') {
                            startAttr = this.upperRomanNumber.indexOf(this.listContents[0].split('.')[0]) + 1;
                        } else if (listStyleType === 'lower-roman') {
                            startAttr = this.lowerRomanNumber.indexOf(this.listContents[0].split('.')[0]) + 1;
                        } else if (listStyleType === 'lower-greek') {
                            startAttr = this.lowerGreekNumber.indexOf(this.listContents[0].split('.')[0]) + 1;
                        }
                    }
                }
                if ((listNodes[i as number] as HTMLElement).style.marginLeft !== '') {
                    styleMarginLeft = (listNodes[i as number] as HTMLElement).style.marginLeft;
                }
                const tempNode: string[] = [];
                for (let j: number = 1; j < this.listContents.length; j++) {
                    tempNode.push(this.listContents[j as number]);
                }
                let currentClassName: string;
                if (!isNOU(listNodes[i as number].className)) {
                    currentClassName = listNodes[i as number].className;
                }
                if (!isNOU(listNodes[i as number].getAttribute('style'))) {
                    listNodes[i as number].setAttribute('style', listNodes[i as number].getAttribute('style').replace('text-align:start;', ''));
                    (listNodes[i as number] as HTMLElement).style.textIndent = '';
                    currentListStyle = listNodes[i as number].getAttribute('style');
                }
                collection.push({
                    listType: type, content: tempNode, nestedLevel: level,
                    listFormatOverride: listFormatOverride, class: currentClassName,
                    listStyle: currentListStyle, listStyleTypeName: listStyleType, start: startAttr, styleMarginLeft: styleMarginLeft
                });
            }
        }
        stNode = listNodes.shift();
        while (stNode) {
            const elemColl: Element[] = [];
            for (let temp1: number = 0; temp1 < data.length; temp1++) {
                if (data[temp1 as number].node === stNode) {
                    for (let index: number = 0; index < data[temp1 as number].content.childNodes.length; index++) {
                        elemColl.push(data[temp1 as number].content.childNodes[index as number] as HTMLElement);
                    }
                    for (let index: number = 0; index < elemColl.length; index++) {
                        stNode.parentElement.insertBefore(elemColl[index as number], stNode);
                    }
                    break;
                }
            }
            stNode.remove();
            stNode = listNodes.shift();
            if (!stNode) {
                stNode = listNodes.shift();
            }
        }
    }
    private getlistStyleType(listContent: string, type: string): string {
        let currentListClass: string;
        if (type === 'ol') {
            const charCode: number = listContent.split('.')[0].charCodeAt(0);
            switch (true) {
            case this.upperRomanNumber.indexOf(listContent.split('.')[0]) > -1:
                currentListClass = 'upper-roman';
                break;
            case this.lowerRomanNumber.indexOf(listContent.split('.')[0]) > -1:
                currentListClass = 'lower-roman';
                break;
            case this.lowerGreekNumber.indexOf(listContent.split('.')[0]) > -1:
                currentListClass = 'lower-greek';
                break;
            case (charCode > 64 && charCode < 91):
                currentListClass = 'upper-alpha';
                break;
            case (charCode > 96 && charCode < 123):
                currentListClass = 'lower-alpha';
                break;
            case (listContent.split('.')[0].length > 1 && listContent.split('.')[0][0] === '0' && !isNaN(Number(listContent.split('.')[0]))):
                currentListClass = 'decimal-leading-zero';
                break;
            default:
                currentListClass = 'decimal';
                break;
            }
        } else {
            switch (listContent.split('.')[0]) {
            case 'o':
                currentListClass = 'circle';
                break;
            case '§':
                currentListClass = 'square';
                break;
            default:
                currentListClass = 'disc';
                break;
            }
        }
        return currentListClass;
    }

    private makeConversion(
        collection: {
            listType: string; content: string[]; nestedLevel: number; listFormatOverride: number; class: string,
            listStyle: string, listStyleTypeName: string, start: number, styleMarginLeft: string
        }[]): HTMLElement {
        const root: HTMLElement = createElement('div');
        let temp: HTMLElement;
        let pLevel: number = 1;
        let prevList: HTMLElement;
        let listCount: number = 0;
        let elem: HTMLElement;
        let lfo: number = collection[0].listFormatOverride;
        for (let index: number = 0; index < collection.length; index++) {
            const listClass: string[] = ['MsoListParagraphCxSpFirst', 'MsoListParagraphCxSpMiddle', 'MsoListParagraphCxSpLast'];
            let isNormalList: boolean = false;
            for (let i: number = 0; i < listClass.length; i++) {
                if (listClass[i as number].indexOf(collection[index as number].class) >= 0) {
                    isNormalList = true;
                    break;
                }
            }
            if (!isNOU(prevList) && index !== 0 &&
                collection[index as number - 1].listType !== collection[index as number].listType &&
                !isNormalList) {
                prevList = null;
            }
            const pElement: Element = createElement('p', { className: 'MsoNoSpacing'});
            pElement.innerHTML = collection[index as number].content.join(' ');
            if ((collection[index as number].nestedLevel === 1) &&
            (listCount === 0 || lfo !== collection[index as number].listFormatOverride) &&
            collection[index as number].content) {
                root.appendChild(
                    temp = createElement(collection[index as number].listType,
                                         { className: collection[index as number].class }));
                prevList = createElement('li');
                prevList.appendChild(pElement);
                temp.appendChild(prevList);
                temp.setAttribute('level', collection[index as number].nestedLevel.toString());
                if (collection[index as number].class !== 'msolistparagraph') {
                    temp.style.marginLeft = collection[index as number].styleMarginLeft;
                } else {
                    addClass([temp], 'marginLeftIgnore');
                }
                temp.style.listStyleType = collection[index as number].listStyleTypeName;
            } else if (collection[index as number].nestedLevel === pLevel &&
                lfo === collection[index as number].listFormatOverride) {
                if (!isNOU(prevList) && !isNOU(prevList.parentElement)
                    && prevList.parentElement.tagName.toLowerCase() === collection[index as number].listType) {
                    prevList.parentElement.appendChild(prevList = createElement('li'));
                    prevList.appendChild(pElement);
                } else if (isNOU(prevList)) {
                    temp = createElement(collection[index as number].listType);
                    temp.style.listStyleType = collection[index as number].listStyleTypeName;
                    prevList = createElement('li');
                    prevList.appendChild(pElement);
                    temp.appendChild(prevList);
                    temp.setAttribute('level', collection[index as number].nestedLevel.toString());
                    root.appendChild(temp);
                } else {
                    temp = createElement(collection[index as number].listType);
                    temp.style.listStyleType = collection[index as number].listStyleTypeName;
                    prevList.parentElement.parentElement.appendChild(temp);
                    prevList = createElement('li');
                    prevList.appendChild(pElement);
                    temp.appendChild(prevList);
                    temp.setAttribute('level', collection[index as number].nestedLevel.toString());
                }
            } else if (collection[index as number].nestedLevel > pLevel) {
                if (!isNOU(prevList)) {
                    for (let j: number = 0; j < collection[index as number].nestedLevel - pLevel; j++) {
                        prevList.appendChild(temp = createElement(collection[index as number].listType));
                        prevList = createElement('li');
                        if (j !== collection[index as number].nestedLevel - pLevel - 1 &&
                            collection[index as number].nestedLevel - pLevel > 1) {
                            prevList.style.listStyleType = 'none';
                        }
                        temp.appendChild(prevList);
                    }
                    prevList.appendChild(pElement);
                    temp.setAttribute('level', collection[index as number].nestedLevel.toString());
                    temp.style.listStyleType = collection[index as number].listStyleTypeName;
                } else {
                    if (collection[index as number].nestedLevel > pLevel && isNormalList) {
                        const initialNode: HTMLElement = createElement(collection[index as number].listType);
                        prevList = createElement('li');
                        initialNode.appendChild(prevList);
                        initialNode.style.listStyleType = 'none';
                        for (let j: number = 0; j < collection[index as number].nestedLevel - 1; j++) {
                            prevList.appendChild(temp = createElement(collection[index as number].listType));
                            prevList = createElement('li');
                            temp.appendChild(prevList);
                            temp.style.listStyleType = 'none';
                        }
                        prevList.appendChild(pElement);
                        root.appendChild(initialNode);
                        temp.setAttribute('level', collection[index as number].nestedLevel.toString());
                        temp.style.listStyleType = collection[index as number].listStyleTypeName;
                    } else {
                        root.appendChild(temp = createElement(collection[index as number].listType));
                        prevList = createElement('li');
                        prevList.appendChild(pElement);
                        temp.appendChild(prevList);
                        temp.setAttribute('level', collection[index as number].nestedLevel.toString());
                        if (collection[index as number].class !== 'msolistparagraph') {
                            temp.style.marginLeft = collection[index as number].styleMarginLeft;
                        } else {
                            addClass([temp], 'marginLeftIgnore');
                        }
                        temp.style.listStyleType = collection[index as number].listStyleTypeName;
                    }
                }
            } else if (collection[index as number].nestedLevel === 1) {
                if ((root.lastChild as HTMLElement).tagName.toLowerCase() === collection[index as number].listType) {
                    temp = root.lastChild as HTMLElement;
                } else {
                    root.appendChild(temp = createElement(collection[index as number].listType));
                    temp.style.listStyleType = collection[index as number].listStyleTypeName;
                }
                prevList = createElement('li');
                prevList.appendChild(pElement);
                temp.appendChild(prevList);
                temp.setAttribute('level', collection[index as number].nestedLevel.toString());
            } else {
                elem = prevList;
                while (elem.parentElement) {
                    elem = elem.parentElement;
                    if (elem.attributes.getNamedItem('level')) {
                        if (parseInt(elem.attributes.getNamedItem('level').textContent, 10) === collection[index as number].nestedLevel &&
                        lfo === collection[index as number].listFormatOverride) {
                            prevList = createElement('li');
                            prevList.appendChild(pElement);
                            elem.appendChild(prevList);
                            break;
                            // eslint-disable-next-line
                        } else if (parseInt(elem.attributes.getNamedItem('level').textContent, null) === collection[index as number].nestedLevel &&
                        lfo !== collection[index as number].listFormatOverride) {
                            temp = createElement(collection[index as number].listType);
                            prevList = createElement('li');
                            temp.appendChild(prevList);
                            if (collection[index as number].nestedLevel > 1) {
                                for (let k: number = 0; k < collection[index as number].nestedLevel - 1; k++) {
                                    prevList.appendChild(temp = createElement(collection[index as number].listType));
                                    prevList = createElement('li');
                                    temp.appendChild(prevList);
                                    temp.style.listStyleType = 'none';
                                }
                            }
                            prevList.appendChild(pElement);
                            elem.appendChild(temp);
                            temp.setAttribute('level', collection[index as number].nestedLevel.toString());
                            temp.style.listStyleType = collection[index as number].listStyleTypeName;
                            break;
                        } else if (collection[index as number].nestedLevel > parseInt(elem.attributes.getNamedItem('level').textContent, 10)) {
                            elem.appendChild(temp = createElement(collection[index as number].listType));
                            prevList = createElement('li');
                            prevList.appendChild(pElement);
                            temp.appendChild(prevList);
                            temp.setAttribute('level', collection[index as number].nestedLevel.toString());
                            temp.style.listStyleType = collection[index as number].listStyleTypeName;
                            break;
                        }
                    }
                    continue;
                }
            }
            prevList.setAttribute('class', collection[index as number].class);
            prevList.setAttribute('style', (!isNOU(collection[index as number].listStyle) ? collection[index as number].listStyle : ''));
            pLevel = collection[index as number].nestedLevel;
            lfo = collection[index as number].listFormatOverride;
            listCount++;
            if (!isNOU(collection[index as number].start && collection[index as number].start !== 1 && collection[index as number].listType === 'ol')) {
                temp.setAttribute('start', collection[index as number].start.toString());
            }
        }
        return root;
    }

    private getListContent(elem: Element): void {
        let pushContent: string = '';
        const firstChild: Element = elem.firstElementChild;
        if (firstChild.textContent.trim() === '' && !isNOU(firstChild.firstElementChild) &&
            firstChild.firstElementChild.nodeName === 'IMG') {
            pushContent = elem.innerHTML.trim();
            this.listContents.push('');
            this.listContents.push(pushContent);
        } else {
            //Add to support separate list which looks like same list and also to add all tags as it is inside list
            if (firstChild.childNodes.length > 0) {
                const listIgnoreTag: NodeListOf<Element> = firstChild.querySelectorAll('[style*="mso-list"]');
                for (let i: number = 0; i < listIgnoreTag.length; i++) {
                    listIgnoreTag[i as number].setAttribute('style', listIgnoreTag[i as number].getAttribute('style').replace(/\n/g, ''));
                }
                const listOrderCleanup: Element = firstChild.querySelector('span[style*="mso-list"]');
                if (listOrderCleanup) {
                    let style: string = listOrderCleanup.getAttribute('style');
                    if (style) {
                        style = style.replace(/\s*:\s*/g, ':');
                        listOrderCleanup.setAttribute('style', style);
                    }
                }
                let listOrder: Element = firstChild.querySelector('span[style="mso-list:Ignore"]');
                const isEmptyMarkerSpan: boolean = isNOU(listOrder);
                listOrder =  isEmptyMarkerSpan ? firstChild : listOrder;
                if (!isNOU(listOrder)) {
                    let textContent: string = listOrder.textContent.trim();
                    if (isEmptyMarkerSpan) {
                        const bulletPattern: RegExp = /^(\d{1,2}|[a-zA-Z]|[*#~•○■])(\.|\)|-)\s*/;
                        const textContentMatch: RegExpMatchArray | null = textContent.match(bulletPattern);
                        if (!isNOU(textContentMatch)) {
                            textContent = textContentMatch[0].trim();
                            listOrder.textContent = listOrder.textContent.trim().substring(textContent.length).trim();
                        }
                    }
                    this.listContents.push(textContent);
                    if (!isEmptyMarkerSpan){
                        detach(listOrder);
                    }
                    this.removeComments(elem as HTMLElement);
                    this.removeUnwantedElements(elem as HTMLElement);
                }
            }
        }
        this.listContents.push(elem.innerHTML);
    }

    private cleanupHtml(html: string, keepFormat: boolean): string {
        const tempDiv: HTMLElement = createElement('div') as HTMLElement;
        tempDiv.innerHTML = html;

        this.removeUnwantedElements(tempDiv);

        if (!keepFormat) {
            this.deniedAttributes(tempDiv, true);
        } else if (this.editor.pasteSettings.deniedTags && this.editor.pasteSettings.deniedTags.length > 0) {
            this.deniedAttributes(tempDiv, false);
        }

        if (this.editor.pasteSettings.allowedStyles && this.editor.pasteSettings.allowedStyles.length > 0) {
            this.allowedStyle(tempDiv);
        }

        if (this.editor.pasteSettings.deniedTags && this.editor.pasteSettings.deniedTags.length > 0) {
            this.deniedTags(tempDiv);
        }

        this.removeEmptyElements(tempDiv);

        this.removeComments(tempDiv);

        this.processImages(tempDiv);

        this.cleanupCssPatterns(tempDiv);

        return tempDiv.innerHTML;
    }

    private plainFormatting(html: string): string {
        const tempDiv: HTMLElement = createElement('div') as HTMLElement;
        tempDiv.innerHTML = html;

        this.detachInlineElements(tempDiv);

        this.getTextContent(tempDiv);

        this.removeEmptyElements(tempDiv);

        this.removeComments(tempDiv);

        return tempDiv.innerHTML;
    }

    private removeUnwantedElements(element: HTMLElement): void {
        this.removeStyleElements(element);

        let innerElement: string = element.innerHTML;
        for (let i: number = 0; i < this.removableElements.length; i++) {
            // eslint-disable-next-line security/detect-non-literal-regexp
            const regExpStartElem: RegExp = new RegExp('<' + this.removableElements[i] + '\\s*[^>]*>', 'g');
            // eslint-disable-next-line security/detect-non-literal-regexp
            const regExpEndElem: RegExp = new RegExp('</' + this.removableElements[i] + '>', 'g');
            innerElement = innerElement.replace(regExpStartElem, '');
            innerElement = innerElement.replace(regExpEndElem, '');
        }
        element.innerHTML = innerElement;
    }

    private removeStyleElements(element: HTMLElement): void {
        const styleElement: HTMLElement = element.querySelector('style');
        if (!isNOU(styleElement)) {
            detach(styleElement);
        }
    }

    private removeComments(element: HTMLElement): void {
        let innerElement: string = element.innerHTML;
        innerElement = innerElement.replace(/<!--[\s\S]*?-->/g, '');
        element.innerHTML = innerElement;
    }

    private removeEmptyElements(element: HTMLElement): void {
        const emptyElements: NodeListOf<Element> = element.querySelectorAll(':empty');
        for (let i: number = 0; i < emptyElements.length; i++) {
            const index: number = parseInt(i.toString(), 10);
            if (emptyElements[index].tagName !== 'IMG' &&
                emptyElements[index].tagName !== 'BR' &&
                emptyElements[index].tagName !== 'IFRAME' &&
                emptyElements[index].tagName !== 'TD' &&
                emptyElements[index].tagName !== 'HR'
            ) {
                const detachableElement: HTMLElement = this.findDetachEmptyElem(emptyElements[index]);
                if (!isNOU(detachableElement)) {
                    detach(detachableElement);
                }
            }
        }
    }

    private findDetachEmptyElem(element: Element): HTMLElement {
        let removableElement: HTMLElement;
        if (!isNOU(element.parentElement)) {
            const hasNbsp: boolean = element.parentElement.textContent.length > 0 &&
                element.parentElement.textContent.match(/\u00a0/g) &&
                element.parentElement.textContent.match(/\u00a0/g).length > 0;
            if (!hasNbsp && element.parentElement.textContent.trim() === '' &&
                isNOU(element.parentElement.querySelector('img'))) {
                removableElement = this.findDetachEmptyElem(element.parentElement);
            } else {
                removableElement = element as HTMLElement;
            }
        } else {
            removableElement = null;
        }
        return removableElement;
    }

    private removeWordClasses(element: HTMLElement): void {
        const elementsWithClass: NodeListOf<HTMLElement> = element.querySelectorAll('*[class]') as NodeListOf<HTMLElement>;
        for (let i: number = 0; i < elementsWithClass.length; i++) {
            const index: number = parseInt(i.toString(), 10);
            const classList: DOMTokenList = elementsWithClass[index].classList;
            const classesToRemove: string[] = [];

            for (let j: number = 0; j < classList.length; j++) {
                const jIndex: number = parseInt(j.toString(), 10);
                if (classList[jIndex].indexOf('Mso') === 0) {
                    classesToRemove.push(classList[jIndex]);
                }
            }

            classesToRemove.forEach((className: string) => {
                elementsWithClass[index].classList.remove(className);
            });

            if (elementsWithClass[index].classList.length === 0) {
                elementsWithClass[index].removeAttribute('class');
            }
        }
    }

    private cleanupStyles(element: HTMLElement, allowedStyles: string[]): void {
        const elementsWithStyle: NodeListOf<HTMLElement> = element.querySelectorAll('*[style]') as NodeListOf<HTMLElement>;
        for (let i: number = 0; i < elementsWithStyle.length; i++) {
            const index: number = parseInt(i.toString(), 10);
            const styleAttr: string = elementsWithStyle[index].getAttribute('style');
            if (!styleAttr) { continue; }

            const styles: string[] = styleAttr.split(';');
            let newStyles: string = '';

            for (let j: number = 0; j < styles.length; j++) {
                const jIndex: number = parseInt(j.toString(), 10);
                const style: string = styles[jIndex].trim();
                if (!style) { continue; }

                const [property, value]: string[] = style.split(':').map((s: string) => s.trim());

                if (property.indexOf('mso-') === 0) { continue; }

                if (allowedStyles.indexOf(property) !== -1) {
                    newStyles += `${property}: ${value}; `;
                }
            }

            if (newStyles) {
                elementsWithStyle[index].setAttribute('style', newStyles.trim());
            } else {
                elementsWithStyle[index].removeAttribute('style');
            }
        }
    }

    private processWordTables(element: HTMLElement): void {
        const tables: NodeListOf<HTMLTableElement> = element.querySelectorAll('table') as NodeListOf<HTMLTableElement>;
        for (let i: number = 0; i < tables.length; i++) {
            const index: number = parseInt(i.toString(), 10);
            tables[index].classList.add('e-blockeditor-table');

            const wordAttrs: string[] = ['border', 'cellpadding', 'cellspacing', 'width', 'height'];
            wordAttrs.forEach((attr: string) => {
                if (tables[index].hasAttribute(attr)) {
                    tables[index].removeAttribute(attr);
                }
            });

            const cells: NodeListOf<HTMLTableCellElement> = tables[index].querySelectorAll('td, th') as NodeListOf<HTMLTableCellElement>;
            for (let j: number = 0; j < cells.length; j++) {
                const jIndex: number = parseInt(j.toString(), 10);
                wordAttrs.forEach((attr: string) => {
                    if (cells[jIndex].hasAttribute(attr)) {
                        cells[jIndex].removeAttribute(attr);
                    }
                });

                if (cells[jIndex].textContent.trim() === '' && !cells[jIndex].querySelector('img')) {
                    cells[jIndex].innerHTML = '&nbsp;';
                }
            }
        }
    }

    private cleanupLists(element: HTMLElement): void {
        this.cleanList(element, 'UL');

        this.cleanList(element, 'OL');

        this.convertWordListParagraphs(element);
    }

    private cleanList(element: HTMLElement, listTag: string): void {
        const replacableElem: NodeListOf<HTMLElement> = element.querySelectorAll(`${listTag} div`) as NodeListOf<HTMLElement>;
        for (let j: number = replacableElem.length - 1; j >= 0; j--) {
            const jIndex: number = parseInt(j.toString(), 10);
            const parentElem: Node = replacableElem[jIndex].parentNode;
            while (replacableElem[jIndex].firstChild) {
                parentElem.insertBefore(replacableElem[jIndex].firstChild, replacableElem[jIndex]);
            }
            const closestListElem: HTMLElement = this.findClosestListElem(replacableElem[jIndex]);
            if (closestListElem) {
                this.insertAfter(replacableElem[jIndex], closestListElem);
            }
        }
    }

    private findClosestListElem(listElem: HTMLElement): HTMLElement {
        let closestListElem: HTMLElement;
        while (!isNOU(listElem)) {
            listElem = !isNOU(listElem.closest('ul')) && listElem.tagName !== 'UL'
                ? listElem.closest('ul')
                : (listElem.tagName !== 'OL' ? listElem.closest('ol') : null);
            closestListElem = !isNOU(listElem) ? listElem : closestListElem;
        }
        return closestListElem;
    }

    private insertAfter(newNode: Element, referenceNode: Element): void {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    private convertWordListParagraphs(element: HTMLElement): void {
        const listParagraphs: NodeListOf<HTMLElement> = element.querySelectorAll('p[style*="mso-list"]') as NodeListOf<HTMLElement>;
        if (listParagraphs.length === 0) { return; }

        let currentList: HTMLElement = null;
        let currentListType: string = null;
        let currentLevel: number = 0;

        for (let i: number = 0; i < listParagraphs.length; i++) {
            const index: number = parseInt(i.toString(), 10);
            const paragraph: HTMLElement = listParagraphs[index] as HTMLElement;

            let listType: string = 'ul';
            const textContent: string = paragraph.textContent.trim();
            if (/^\d+\./.test(textContent) || /^[a-zA-Z]\./.test(textContent) || /^[ivxIVX]+\./.test(textContent)) {
                listType = 'ol';
            }

            let level: number = 1;
            const styleAttr: string = paragraph.getAttribute('style');
            if (styleAttr) {
                const levelMatch: RegExpMatchArray = styleAttr.match(/level(\d+)/);
                if (levelMatch) {
                    level = parseInt(levelMatch[1], 10);
                }
            }
            let content: string = paragraph.innerHTML;
            content = content.replace(/^[\s\u00A0]*(?:\d+\.|\w\.|\u2022|\u25CF|\u25CB|\u25A0|\u25A1)[\s\u00A0]+/, '');

            if (!currentList || currentListType !== listType || level < currentLevel) {
                currentList = document.createElement(listType);
                currentListType = listType;
                paragraph.parentNode.insertBefore(currentList, paragraph);
            }

            const listItem: HTMLElement = document.createElement('li');
            listItem.innerHTML = content;
            currentList.appendChild(listItem);

            currentLevel = level;
            paragraph.parentNode.removeChild(paragraph);
        }
    }

    private processImages(element: HTMLElement): void {
        const images: NodeListOf<HTMLImageElement> = element.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
        for (let i: number = 0; i < images.length; i++) {
            const index: number = parseInt(i.toString(), 10);
            const img: HTMLImageElement = images[index];

            img.classList.add('e-blockeditor-pasted-img');

            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', 'Pasted image');
            }
        }
    }

    private cleanupCssPatterns(root: HTMLElement): void {
        const walker: TreeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: (node: Text) => {
                const text: string = node.textContent.trim();
                const isInlineStyle: RegExpMatchArray = text.match(/^\s*(ol|ul|li)[\s\S]*?\{[\s\S]*?\}/i);
                return isInlineStyle ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        });

        const nodesToRemove: Text[] = [];
        while (walker.nextNode()) {
            const node: Text = walker.currentNode as Text;
            nodesToRemove.push(node);
        }

        for (const node of nodesToRemove) {
            node.remove();
        }
    }

    private deniedTags(element: HTMLElement): HTMLElement {
        const deniedTags: string[] = this.editor.pasteSettings.deniedTags;

        for (let i: number = 0; i < deniedTags.length; i++) {
            const index: number = parseInt(i.toString(), 10);
            const removableElements: NodeListOf<HTMLElement> = element.querySelectorAll(deniedTags[i]) as NodeListOf<HTMLElement>;

            for (let j: number = removableElements.length - 1; j >= 0; j--) {
                const jIndex: number = parseInt(j.toString(), 10);
                const parentElem: Node = removableElements[jIndex].parentNode;

                while (removableElements[jIndex].firstChild) {
                    parentElem.insertBefore(removableElements[jIndex].firstChild, removableElements[jIndex]);
                }

                parentElem.removeChild(removableElements[jIndex]);
            }
        }

        return element;
    }

    private deniedAttributes(element: HTMLElement, clean: boolean): HTMLElement {
        const deniedAttrs: string[] = clean ? ['style', 'class'] : this.editor.pasteSettings.deniedTags;

        for (let i: number = 0; i < deniedAttrs.length; i++) {
            const index: number = parseInt(i.toString(), 10);
            const elementsWithAttr: NodeListOf<HTMLElement> = (element
                .querySelectorAll(`[${deniedAttrs[index]}]`) as NodeListOf<HTMLElement>);
            for (let j: number = 0; j < elementsWithAttr.length; j++) {
                const jIndex: number = parseInt(j.toString(), 10);
                elementsWithAttr[jIndex].removeAttribute(deniedAttrs[index]);
            }
        }

        return element;
    }

    private allowedStyle(element: HTMLElement): HTMLElement {
        const allowedStyles: string[] = this.editor.pasteSettings.allowedStyles;
        const styleElements: NodeListOf<HTMLElement> = element.querySelectorAll('[style]') as NodeListOf<HTMLElement>;

        for (let i: number = 0; i < styleElements.length; i++) {
            const iIndex: number = parseInt(i.toString(), 10);
            let allowedStyleValue: string = '';
            const styleValue: string[] = styleElements[iIndex].getAttribute('style').split(';');

            for (let j: number = 0; j < styleValue.length; j++) {
                const jIndex: number = parseInt(j.toString(), 10);
                const stylePair: string = styleValue[jIndex].trim();
                if (!stylePair) { continue; }

                const [property]: string[] = stylePair.split(':').map((s: string) => s.trim());

                if (allowedStyles.indexOf(property) !== -1) {
                    allowedStyleValue += stylePair + ';';
                }
            }

            styleElements[iIndex].removeAttribute('style');
            if (allowedStyleValue) {
                styleElements[iIndex].setAttribute('style', allowedStyleValue);
            }
        }

        return element;
    }

    private detachInlineElements(element: HTMLElement): void {
        for (let i: number = 0; i < this.inlineNode.length; i++) {
            const iIndex: number = parseInt(i.toString(), 10);
            const inlineElements: NodeListOf<HTMLElement> = element.querySelectorAll(this.inlineNode[iIndex]) as NodeListOf<HTMLElement>;

            for (let j: number = 0; j < inlineElements.length; j++) {
                const jIndex: number = parseInt(j.toString(), 10);
                const parentElem: HTMLElement = inlineElements[jIndex].parentElement;

                if (!parentElem) { continue; }

                while (inlineElements[jIndex].firstChild) {
                    parentElem.insertBefore(inlineElements[jIndex].firstChild, inlineElements[jIndex]);
                }

                parentElem.removeChild(inlineElements[jIndex]);
            }
        }
    }

    private getTextContent(element: HTMLElement): void {
        for (let i: number = 0; i < this.blockNode.length; i++) {
            const iIndex: number = parseInt(i.toString(), 10);
            const blockElements: NodeListOf<HTMLElement> = element.querySelectorAll(this.blockNode[iIndex]) as NodeListOf<HTMLElement>;

            for (let j: number = 0; j < blockElements.length; j++) {
                const jIndex: number = parseInt(j.toString(), 10);
                const paragraph: HTMLElement = document.createElement('p');
                paragraph.textContent = blockElements[jIndex].textContent;
                blockElements[jIndex].parentNode.replaceChild(paragraph, blockElements[jIndex]);
            }
        }
        const allElements: NodeListOf<HTMLElement> = element.querySelectorAll('*') as NodeListOf<HTMLElement>;
        for (let i: number = 0; i < allElements.length; i++) {
            const iIndex: number = parseInt(i.toString(), 10);
            const attributes: NamedNodeMap = allElements[iIndex].attributes;
            for (let j: number = attributes.length - 1; j >= 0; j--) {
                const jIndex: number = parseInt(j.toString(), 10);
                allElements[iIndex].removeAttribute(attributes[jIndex].name);
            }
        }
    }

    private splitBreakLine(text: string): string {
        const lines: string[] = text.split(/\r\n\r\n|\n\n/);
        let result: string = '';

        for (let i: number = 0; i < lines.length; i++) {
            const iIndex: number = parseInt(i.toString(), 10);
            if (!lines[iIndex].trim()) { continue; }

            const lineWithBreaks: string = lines[iIndex].replace(/\r\n|\n/g, '<br>');

            if (i === 0) {
                result += lineWithBreaks;
            } else {
                result += `<p>${lineWithBreaks}</p>`;
            }
        }

        return result;
    }

    public destroy(): void {
        this.editor = null;
        // this.cropImageData = [];
    }
}
