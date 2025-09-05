/* eslint-disable security/detect-object-injection */

import { isNullOrUndefined as isNOU, detach, createElement, addClass } from '@syncfusion/ej2-base';
import { BlockEditor } from '../base/blockeditor';
import { IPasteCleanupOptions, ListItemProperties } from '../base/interface';

const UPPER_ALPHA: string = 'upper-alpha';
const UPPER_ROMAN: string = 'upper-roman';
const LOWER_ROMAN: string = 'lower-roman';
const LOWER_GREEK: string = 'lower-greek';
const LOWER_ALPHA: string = 'lower-alpha';
const DECIMAL_LD_ZERO: string = 'decimal-leading-zero';
const DECIMAL: string = 'decimal';
const CIRCLE: string = 'circle';
const SQUARE: string = 'square';
const DISC: string = 'disc';

/**
 * Handles cleanup of pasted content for the Block Editor.
 */
export class ClipboardCleanupModule {
    private editor: BlockEditor;
    private static inlineNode: string[] = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
        'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
        'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
        'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'svg',
        'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];
    private static blockNode: string[] = ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'address', 'blockquote', 'button', 'center', 'dd', 'dir', 'dl', 'dt', 'fieldset',
        'frameset', 'hr', 'iframe', 'isindex', 'li', 'map', 'menu', 'noframes', 'noscript',
        'object', 'ol', 'pre', 'td', 'tr', 'th', 'tbody', 'tfoot', 'thead', 'table', 'ul',
        'header', 'article', 'nav', 'footer', 'section', 'aside', 'main', 'figure', 'figcaption'];
    private static removableElements: string[] = ['o:p', 'style', 'w:sdt', 'xml', 'script', 'meta', 'link'];
    private static ignorableNodes: string[] = ['A', 'APPLET', 'B', 'BLOCKQUOTE', 'BR',
        'BUTTON', 'CENTER', 'CODE', 'COL', 'COLGROUP', 'DD', 'DEL', 'DFN', 'DIR', 'DIV',
        'DL', 'DT', 'EM', 'FIELDSET', 'FONT', 'FORM', 'FRAME', 'FRAMESET', 'H1', 'H2',
        'H3', 'H4', 'H5', 'H6', 'HR', 'I', 'IMG', 'IFRAME', 'INPUT', 'INS', 'LABEL',
        'LI', 'OL', 'OPTION', 'P', 'PARAM', 'PRE', 'Q', 'S', 'SELECT', 'SPAN', 'STRIKE',
        'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TD', 'TEXTAREA', 'TFOOT', 'TH',
        'THEAD', 'TITLE', 'TR', 'TT', 'U', 'UL'];
    private static upperRomanNumber: string[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX',
        'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
    private static lowerRomanNumber: string[] = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix',
        'x', 'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx'];
    private static lowerGreekNumber: string[] = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ',
        'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'];
    private static msWordPatterns: RegExp[] = [
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
    private listContents: string[] = [];

    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Handles the paste cleanup process.
     * It checks if the paste content is plain text or from MS Word and processes accordingly.
     *
     * @param {IPasteCleanupOptions} args - The arguments for paste cleanup.
     * @returns {string} - The cleaned HTML content.
     * @hidden
     */
    public cleanupPaste(args: IPasteCleanupOptions): string {
        const { html, plainText }: IPasteCleanupOptions = args;
        if (this.editor.pasteSettings.plainText) {
            return this.plainFormatting(plainText);
        }

        const isFromMsWord: boolean = this.isFromMsWord(html);
        if (isFromMsWord) {
            return this.cleanMsWordContent(html);
        }

        return this.cleanupHtml(html, this.editor.pasteSettings.keepFormat);
    }

    private isFromMsWord(html: string): boolean {
        return ClipboardCleanupModule.msWordPatterns.some((pattern: RegExp) => pattern.test(html));
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
            if (ClipboardCleanupModule.ignorableNodes.indexOf(allNodes[index as number].nodeName) === -1 ||
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
            if (prevflagState && (ClipboardCleanupModule.blockNode.indexOf(allNodes[index as number].nodeName.toLowerCase()) !== -1) &&
                !((allNodes[index as number] as Element).className &&
                    (allNodes[index as number] as Element).className.toLowerCase().indexOf('msolistparagraph') !== -1 && !isNOU(allNodes[index as number].getAttribute('style')) &&
                    allNodes[index as number].getAttribute('style').indexOf('mso-list:') >= 0)) {
                listNodes.push(null);
            }
            if (ClipboardCleanupModule.blockNode.indexOf(allNodes[index as number].nodeName.toLowerCase()) !== -1) {
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
                        if (listStyleType === DECIMAL) {
                            if (!isNaN(parseInt(startString, 10))) {
                                startAttr = parseInt(startString, 10);
                            }
                        } else if (listStyleType === DECIMAL_LD_ZERO) {
                            if (!isNaN(parseInt(startString, 10))) {
                                startAttr = parseInt(startString, 10);
                            }
                        } else if (listStyleType === UPPER_ALPHA) {
                            startAttr = (startString.split('.')[0].charCodeAt(0) - 64);
                        } else if (listStyleType === LOWER_ALPHA) {
                            startAttr = (startString.split('.')[0].charCodeAt(0) - 96);
                        } else if (listStyleType === UPPER_ROMAN) {
                            startAttr = ClipboardCleanupModule.upperRomanNumber.indexOf(this.listContents[0].split('.')[0]) + 1;
                        } else if (listStyleType === LOWER_ROMAN) {
                            startAttr = ClipboardCleanupModule.lowerRomanNumber.indexOf(this.listContents[0].split('.')[0]) + 1;
                        } else if (listStyleType === LOWER_GREEK) {
                            startAttr = ClipboardCleanupModule.lowerGreekNumber.indexOf(this.listContents[0].split('.')[0]) + 1;
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
            case ClipboardCleanupModule.upperRomanNumber.indexOf(listContent.split('.')[0]) > -1:
                currentListClass = UPPER_ROMAN;
                break;
            case ClipboardCleanupModule.lowerRomanNumber.indexOf(listContent.split('.')[0]) > -1:
                currentListClass = LOWER_ROMAN;
                break;
            case ClipboardCleanupModule.lowerGreekNumber.indexOf(listContent.split('.')[0]) > -1:
                currentListClass = LOWER_GREEK;
                break;
            case (charCode > 64 && charCode < 91):
                currentListClass = UPPER_ALPHA;
                break;
            case (charCode > 96 && charCode < 123):
                currentListClass = LOWER_ALPHA;
                break;
            case (listContent.split('.')[0].length > 1 && listContent.split('.')[0][0] === '0' && !isNaN(Number(listContent.split('.')[0]))):
                currentListClass = DECIMAL_LD_ZERO;
                break;
            default:
                currentListClass = DECIMAL;
                break;
            }
        } else {
            switch (listContent.split('.')[0]) {
            case 'o':
                currentListClass = CIRCLE;
                break;
            case '§':
                currentListClass = SQUARE;
                break;
            default:
                currentListClass = DISC;
                break;
            }
        }
        return currentListClass;
    }

    /* Converts a collection of MSWord list items into HTML list elements */
    private makeConversion(collection: ListItemProperties[]): HTMLElement {
        const rootElement: HTMLElement = createElement('div');
        const CURRENT_ITEM_CLASS: string = 'e-current-list-item';
        let currentListElement: HTMLElement;
        let currentNestingLevel: number = 1;
        let currentListItem: HTMLElement;
        let listItemCount: number = 0;
        let currentFormatOverride: number = collection[0].listFormatOverride;
        for (let i: number = 0; i < collection.length; i++) {
            const currentItem: ListItemProperties = collection[i as number];
            const isStandardList: boolean = this.isStandardListType(currentItem.class);
            if (currentListItem) {
                currentListItem.classList.remove(CURRENT_ITEM_CLASS);
            }
            if (this.shouldResetListItem(currentListItem, i, collection, isStandardList)) {
                currentListItem = null;
            }
            const paragraphElement: Element = this.createParagraphWithContent(currentItem);
            if (this.isNewRootList(currentItem, listItemCount, currentFormatOverride)) {
                currentListElement = this.createRootList(rootElement, currentItem, paragraphElement);
                currentListItem = currentListElement.querySelector('.' + CURRENT_ITEM_CLASS);
            } else if (this.isSameLevelList(currentItem, currentNestingLevel, currentFormatOverride)) {
                currentListElement = this.addToSameLevelList(
                    currentItem, currentListElement, paragraphElement, currentListItem, rootElement
                );
                currentListItem = currentListElement.querySelector('.' + CURRENT_ITEM_CLASS);
            } else if (this.isDeeperNestedList(currentItem, currentNestingLevel)) {
                currentListElement = this.createNestedList(
                    currentItem, currentListItem, paragraphElement, isStandardList, rootElement, currentNestingLevel
                );
                currentListItem = currentListElement.querySelector('.' + CURRENT_ITEM_CLASS);
            } else if (this.isTopLevelList(currentItem)) {
                currentListElement = this.handleTopLevelList(currentItem, rootElement, paragraphElement);
                currentListItem = currentListElement.querySelector('.' + CURRENT_ITEM_CLASS);
            } else {
                this.handleOtherNestingScenarios(currentItem, currentListItem, paragraphElement, currentFormatOverride);
                currentListItem = rootElement.querySelector('.' + CURRENT_ITEM_CLASS);
            }
            this.applyListItemStyles(currentListItem, currentItem);
            currentNestingLevel = currentItem.nestedLevel;
            currentFormatOverride = currentItem.listFormatOverride;
            listItemCount++;
            this.setStartAttributeIfNeeded(currentListElement, currentItem);
        }
        const trackedItems: NodeListOf<Element> = rootElement.querySelectorAll('.' + CURRENT_ITEM_CLASS);
        for (let i: number = 0; i < trackedItems.length; i++) {
            trackedItems[i as number].classList.remove(CURRENT_ITEM_CLASS);
            if (trackedItems[i as number].className === '') {
                trackedItems[i as number].removeAttribute('class');
            }
        }
        return rootElement;
    }

    /* Checks if the list item is a standard list type */
    private isStandardListType(className: string): boolean {
        const standardListClasses: string[] = [
            'MsoListParagraphCxSpFirst',
            'MsoListParagraphCxSpMiddle',
            'MsoListParagraphCxSpLast'
        ];
        for (let i: number = 0; i < standardListClasses.length; i++) {
            if (!isNOU(className) && standardListClasses[i as number].indexOf(className) >= 0) {
                return true;
            }
        }
        return false;
    }

    /* Determines if the list item should be reset */
    private shouldResetListItem(
        listItem: HTMLElement,
        index: number,
        collection: ListItemProperties[],
        isStandardList: boolean
    ): boolean {
        return !isNOU(listItem) &&
            index !== 0 &&
            collection[index - 1].listType !== collection[index as number].listType &&
            !isStandardList;
    }

    /* Creates a paragraph element with content */
    private createParagraphWithContent(item: ListItemProperties): Element {
        const paragraphElement: Element = createElement('p', { className: 'MsoNoSpacing' });
        paragraphElement.innerHTML = item.content.join(' ');
        return paragraphElement;
    }

    /* Checks if this is a new root list */
    private isNewRootList(item: ListItemProperties, listCount: number, formatOverride: number): boolean {
        return item.nestedLevel === 1 &&
            (listCount === 0 || formatOverride !== item.listFormatOverride) &&
            item.content.length > 0;
    }

    /* Creates a root list element */
    private createRootList(rootElement: HTMLElement, item: ListItemProperties, paragraphElement: Element): HTMLElement {
        const listElement: HTMLElement = createElement(item.listType, { className: item.class });
        const listItem: HTMLElement = createElement('li');
        listItem.appendChild(paragraphElement);
        listElement.appendChild(listItem);
        rootElement.appendChild(listElement);
        listElement.setAttribute('level', item.nestedLevel.toString());
        if (item.class !== 'msolistparagraph') {
            listElement.style.marginLeft = item.styleMarginLeft;
        } else {
            addClass([listElement], 'marginLeftIgnore');
        }
        listElement.style.listStyleType = item.listStyleTypeName;
        listItem.classList.add('e-current-list-item');
        return listElement;
    }

    /* Checks if this is a same level list item */
    private isSameLevelList(item: ListItemProperties, currentLevel: number, formatOverride: number): boolean {
        return item.nestedLevel === currentLevel && formatOverride === item.listFormatOverride;
    }

    /* Adds an item to a same level list */
    private addToSameLevelList(
        item: ListItemProperties,
        listElement: HTMLElement,
        paragraphElement: Element,
        listItem: HTMLElement,
        rootElement: HTMLElement
    ): HTMLElement {
        if (!isNOU(listItem) && !isNOU(listItem.parentElement) &&
            listItem.parentElement.tagName.toLowerCase() === item.listType) {
            const newListItem: HTMLElement = this.createAndAppendElement(paragraphElement);
            listItem.parentElement.appendChild(newListItem);
            return listItem.parentElement;
        } else if (isNOU(listItem)) {
            const newListElement: HTMLElement = createElement(item.listType);
            newListElement.style.listStyleType = item.listStyleTypeName;
            const newListItem: HTMLElement = this.createAndAppendElement(paragraphElement);
            newListElement.appendChild(newListItem);
            newListElement.setAttribute('level', item.nestedLevel.toString());
            rootElement.appendChild(newListElement);
            return newListElement;
        } else {
            const newListElement: HTMLElement = createElement(item.listType);
            newListElement.style.listStyleType = item.listStyleTypeName;
            const newListItem: HTMLElement = this.createAndAppendElement(paragraphElement);
            newListElement.appendChild(newListItem);
            newListElement.setAttribute('level', item.nestedLevel.toString());
            listItem.parentElement.parentElement.appendChild(newListElement);
            return newListElement;
        }
    }

    private createAndAppendElement(children: Element): HTMLElement {
        const newListItem: HTMLElement = createElement('li');
        newListItem.classList.add('e-current-list-item');
        newListItem.appendChild(children);
        return newListItem;
    }

    /* Checks if this is a deeper nested list */
    private isDeeperNestedList(item: ListItemProperties, currentLevel: number): boolean {
        return item.nestedLevel > currentLevel;
    }

    /* Creates a nested list */
    private createNestedList(
        item: ListItemProperties,
        listItem: HTMLElement,
        paragraphElement: Element,
        isStandardList: boolean,
        rootElement: HTMLElement,
        currentNestingLevel: number
    ): HTMLElement {
        let listElement: HTMLElement;
        if (!isNOU(listItem)) {
            const levelDifference: number = item.nestedLevel - currentNestingLevel;
            for (let j: number = 0; j < levelDifference; j++) {
                listElement = createElement(item.listType);
                listItem.appendChild(listElement);
                listItem = createElement('li');
                if (j !== levelDifference - 1 && levelDifference > 1) {
                    listItem.style.listStyleType = 'none';
                }
                listElement.appendChild(listItem);
            }
            listItem.classList.add('e-current-list-item');
            listItem.appendChild(paragraphElement);
            listElement.setAttribute('level', item.nestedLevel.toString());
            listElement.style.listStyleType = item.listStyleTypeName;
            return listElement;
        } else if (isStandardList) {
            return this.createStandardNestedList(item, paragraphElement, rootElement);
        } else {
            return this.createRootList(rootElement, item, paragraphElement);
        }
    }

    /* Creates a standard nested list */
    private createStandardNestedList(
        item: ListItemProperties,
        paragraphElement: Element,
        rootElement: HTMLElement
    ): HTMLElement {
        const initialNode: HTMLElement = createElement(item.listType);
        let listItem: HTMLElement = createElement('li');
        let listElement: HTMLElement;
        initialNode.appendChild(listItem);
        initialNode.style.listStyleType = 'none';
        for (let j: number = 0; j < item.nestedLevel - 1; j++) {
            listElement = createElement(item.listType);
            listItem.appendChild(listElement);
            listItem = createElement('li');
            listElement.appendChild(listItem);
            listElement.style.listStyleType = 'none';
        }
        listItem.classList.add('e-current-list-item');
        listItem.appendChild(paragraphElement);
        rootElement.appendChild(initialNode);
        listElement.setAttribute('level', item.nestedLevel.toString());
        listElement.style.listStyleType = item.listStyleTypeName;
        return listElement;
    }

    /* Checks if this is a top-level list */
    private isTopLevelList(item: ListItemProperties): boolean {
        return item.nestedLevel === 1;
    }

    /* Handles top-level list creation or reuse */
    private handleTopLevelList(
        item: ListItemProperties,
        rootElement: HTMLElement,
        paragraphElement: Element
    ): HTMLElement {
        let listElement: HTMLElement;
        const lastChild: HTMLElement = rootElement.lastChild as HTMLElement;
        if (lastChild && lastChild.tagName.toLowerCase() === item.listType) {
            listElement = lastChild;
        } else {
            listElement = createElement(item.listType);
            listElement.style.listStyleType = item.listStyleTypeName;
            rootElement.appendChild(listElement);
        }
        const listItem: HTMLElement = createElement('li');
        listItem.appendChild(paragraphElement);
        listElement.appendChild(listItem);
        listElement.setAttribute('level', item.nestedLevel.toString());
        listItem.classList.add('e-current-list-item');
        return listElement;
    }

    /* Handles other nesting scenarios */
    private handleOtherNestingScenarios(
        item: ListItemProperties,
        listItem: HTMLElement,
        paragraphElement: Element,
        currentFormatOverride: number
    ): void {
        let currentElement: HTMLElement = listItem;
        let listElement: HTMLElement;
        while (currentElement.parentElement) {
            currentElement = currentElement.parentElement;
            const levelAttribute: Attr = currentElement.attributes.getNamedItem('level');
            if (levelAttribute) {
                const elementLevel: number = parseInt(levelAttribute.textContent, 10);
                if (elementLevel === item.nestedLevel && currentFormatOverride === item.listFormatOverride) {
                    const newListItem: HTMLElement = createElement('li');
                    newListItem.appendChild(paragraphElement);
                    currentElement.appendChild(newListItem);
                    newListItem.classList.add('e-current-list-item');
                    break;
                } else if (elementLevel === item.nestedLevel && currentFormatOverride !== item.listFormatOverride) {
                    this.createDifferentFormatList(item, currentElement, paragraphElement);
                    break;
                } else if (item.nestedLevel > elementLevel) {
                    listElement = createElement(item.listType);
                    const newListItem: HTMLElement = createElement('li');
                    newListItem.appendChild(paragraphElement);
                    listElement.appendChild(newListItem);
                    currentElement.appendChild(listElement);
                    listElement.setAttribute('level', item.nestedLevel.toString());
                    listElement.style.listStyleType = item.listStyleTypeName;
                    newListItem.classList.add('e-current-list-item');
                    break;
                }
            }
        }
    }

    /* Creates a list with different format override */
    private createDifferentFormatList(
        item: ListItemProperties,
        parentElement: HTMLElement,
        paragraphElement: Element
    ): void {
        let listElement: HTMLElement = createElement(item.listType);
        let listItem: HTMLElement = createElement('li');
        listElement.appendChild(listItem);
        if (item.nestedLevel > 1) {
            for (let k: number = 0; k < item.nestedLevel - 1; k++) {
                listItem.appendChild(listElement = createElement(item.listType));
                listItem = createElement('li');
                listElement.appendChild(listItem);
                listElement.style.listStyleType = 'none';
            }
        }
        listItem.appendChild(paragraphElement);
        listItem.classList.add('e-current-list-item');
        parentElement.appendChild(listElement);
        listElement.setAttribute('level', item.nestedLevel.toString());
        listElement.style.listStyleType = item.listStyleTypeName;
    }

    /* Applies styles and attributes to a list item */
    private applyListItemStyles(listItem: HTMLElement, item: ListItemProperties): void {
        if (isNOU(listItem)) {
            return;
        }
        listItem.setAttribute('class', item.class);
        listItem.style.cssText = !isNOU(item.listStyle) ? item.listStyle : '';
    }

    /* Sets start attribute if needed */
    private setStartAttributeIfNeeded(listElement: HTMLElement, item: ListItemProperties): void {
        const needsStartAttribute: boolean = !isNOU(item.start) &&
            item.start !== 1 && item.listType === 'ol';
        if (needsStartAttribute) {
            listElement.setAttribute('start', item.start.toString());
        }
    }

    /* Extracts list content from an element */
    private getListContent(element: Element): void {
        const firstChild: Element = element.firstElementChild;
        if (this.isImageList(firstChild)) {
            this.handleImageList(element);
        } else if (firstChild.childNodes.length > 0) {
            this.handleTextList(element, firstChild);
        }
        this.listContents.push(element.innerHTML);
    }

    /* Checks if this is an image list */
    private isImageList(firstChild: Element): boolean {
        return firstChild.textContent.trim() === '' &&
            !isNOU(firstChild.firstElementChild) &&
            firstChild.firstElementChild.nodeName === 'IMG';
    }

    /* Handles image list content */
    private handleImageList(element: Element): void {
        const content: string = element.innerHTML.trim();
        this.listContents.push('');
        this.listContents.push(content);
    }

    /* Handles text list content */
    private handleTextList(element: Element, firstChild: Element): void {
        this.cleanupListIgnoreTags(firstChild);
        const listOrderElement: Element = this.cleanupListOrder(firstChild);
        this.processListOrderElement(element, firstChild, listOrderElement);
    }

    /* Cleans up list ignore tags */
    private cleanupListIgnoreTags(firstChild: Element): void {
        const listIgnoreTags: NodeListOf<Element> = firstChild.querySelectorAll('[style*="mso-list"]');
        for (let i: number = 0; i < listIgnoreTags.length; i++) {
            const tag: Element = listIgnoreTags[i as number];
            const style: string = tag.getAttribute('style').replace(/\n/g, '');
            tag.setAttribute('style', style);
        }
    }

    /* Cleans up list order element */
    private cleanupListOrder(firstChild: Element): Element {
        const listOrderCleanup: Element = firstChild.querySelector('span[style*="mso-list"]');
        if (listOrderCleanup) {
            let style: string = listOrderCleanup.getAttribute('style');
            if (style) {
                style = style.replace(/\s*:\s*/g, ':');
                listOrderCleanup.setAttribute('style', style);
            }
        }
        return firstChild.querySelector('span[style="mso-list:Ignore"]');
    }

    /* Processes list order element */
    private processListOrderElement(element: Element, firstChild: Element, listOrderElement: Element): void {
        const isEmptyMarkerSpan: boolean = isNOU(listOrderElement);
        listOrderElement =  isEmptyMarkerSpan ? firstChild : listOrderElement;
        if (!isNOU(listOrderElement)) {
            let textContent: string = listOrderElement.textContent.trim();
            if (isEmptyMarkerSpan) {
                textContent = this.extractBulletMarker(listOrderElement, textContent);
            }
            this.listContents.push(textContent);
            if (!isEmptyMarkerSpan) {
                detach(listOrderElement);
            }
            this.removeComments(element as HTMLElement);
            this.removeUnwantedElements(element as HTMLElement);
        }
    }

    /* Extracts bullet marker from text content */
    private extractBulletMarker(listOrderElement: Element, textContent: string): string {
        const bulletPattern: RegExp = /^(\d{1,2}|[a-zA-Z]|[*#~•○■])(\.|\)|-)\s*/;
        const textContentMatch: RegExpMatchArray | null = textContent.match(bulletPattern);
        if (!isNOU(textContentMatch)) {
            const markerText: string = textContentMatch[0].trim();
            listOrderElement.textContent = listOrderElement.textContent.trim().substring(markerText.length).trim();
            return markerText;
        }
        return textContent;
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
        for (let i: number = 0; i < ClipboardCleanupModule.removableElements.length; i++) {
            // eslint-disable-next-line security/detect-non-literal-regexp
            const regExpStartElem: RegExp = new RegExp('<' + ClipboardCleanupModule.removableElements[i] + '\\s*[^>]*>', 'g');
            // eslint-disable-next-line security/detect-non-literal-regexp
            const regExpEndElem: RegExp = new RegExp('</' + ClipboardCleanupModule.removableElements[i] + '>', 'g');
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
            if (emptyElements[(i as number)].tagName !== 'IMG' &&
                emptyElements[(i as number)].tagName !== 'BR' &&
                emptyElements[(i as number)].tagName !== 'IFRAME' &&
                emptyElements[(i as number)].tagName !== 'TD' &&
                emptyElements[(i as number)].tagName !== 'HR'
            ) {
                const detachableElement: HTMLElement = this.findDetachEmptyElem(emptyElements[(i as number)]);
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
            const classList: DOMTokenList = elementsWithClass[(i as number)].classList;
            const classesToRemove: string[] = [];

            for (let j: number = 0; j < classList.length; j++) {
                if (classList[(j as number)].indexOf('Mso') === 0) {
                    classesToRemove.push(classList[(j as number)]);
                }
            }

            classesToRemove.forEach((className: string) => {
                elementsWithClass[(i as number)].classList.remove(className);
            });

            if (elementsWithClass[(i as number)].classList.length === 0) {
                elementsWithClass[(i as number)].removeAttribute('class');
            }
        }
    }

    private cleanupStyles(element: HTMLElement, allowedStyles: string[]): void {
        const elementsWithStyle: NodeListOf<HTMLElement> = element.querySelectorAll('*[style]') as NodeListOf<HTMLElement>;
        for (let i: number = 0; i < elementsWithStyle.length; i++) {
            const styleAttr: string = elementsWithStyle[(i as number)].getAttribute('style');
            if (!styleAttr) { continue; }

            const styles: string[] = styleAttr.split(';');
            let newStyles: string = '';

            for (let j: number = 0; j < styles.length; j++) {
                const style: string = styles[(j as number)].trim();
                if (!style) { continue; }

                const [property, value]: string[] = style.split(':').map((s: string) => s.trim());

                if (property.indexOf('mso-') === 0) { continue; }

                if (allowedStyles.indexOf(property) !== -1) {
                    newStyles += `${property}: ${value}; `;
                }
            }

            if (newStyles) {
                elementsWithStyle[(i as number)].setAttribute('style', newStyles.trim());
            } else {
                elementsWithStyle[(i as number)].removeAttribute('style');
            }
        }
    }

    private processWordTables(element: HTMLElement): void {
        const tables: NodeListOf<HTMLTableElement> = element.querySelectorAll('table') as NodeListOf<HTMLTableElement>;
        for (let i: number = 0; i < tables.length; i++) {
            tables[(i as number)].classList.add('e-blockeditor-table');

            const wordAttrs: string[] = ['border', 'cellpadding', 'cellspacing', 'width', 'height'];
            wordAttrs.forEach((attr: string) => {
                if (tables[(i as number)].hasAttribute(attr)) {
                    tables[(i as number)].removeAttribute(attr);
                }
            });

            const cells: NodeListOf<HTMLTableCellElement> = tables[(i as number)].querySelectorAll('td, th') as NodeListOf<HTMLTableCellElement>;
            for (let j: number = 0; j < cells.length; j++) {
                wordAttrs.forEach((attr: string) => {
                    if (cells[(j as number)].hasAttribute(attr)) {
                        cells[(j as number)].removeAttribute(attr);
                    }
                });

                if (cells[(j as number)].textContent.trim() === '' && !cells[(j as number)].querySelector('img')) {
                    cells[(j as number)].innerHTML = '&nbsp;';
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
            const parentElem: Node = replacableElem[(j as number)].parentNode;
            while (replacableElem[(j as number)].firstChild) {
                parentElem.insertBefore(replacableElem[(j as number)].firstChild, replacableElem[(j as number)]);
            }
            const closestListElem: HTMLElement = this.findClosestListElem(replacableElem[(j as number)]);
            if (closestListElem) {
                this.insertAfter(replacableElem[(j as number)], closestListElem);
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
            const paragraph: HTMLElement = listParagraphs[(i as number)] as HTMLElement;

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
            const img: HTMLImageElement = images[(i as number)];

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
            const removableElements: NodeListOf<HTMLElement> = element.querySelectorAll(deniedTags[i]) as NodeListOf<HTMLElement>;

            for (let j: number = removableElements.length - 1; j >= 0; j--) {
                const parentElem: Node = removableElements[(j as number)].parentNode;

                while (removableElements[(j as number)].firstChild) {
                    parentElem.insertBefore(removableElements[(j as number)].firstChild, removableElements[(j as number)]);
                }

                parentElem.removeChild(removableElements[(j as number)]);
            }
        }

        return element;
    }

    private deniedAttributes(element: HTMLElement, clean: boolean): HTMLElement {
        const deniedAttrs: string[] = clean ? ['style', 'class'] : this.editor.pasteSettings.deniedTags;

        for (let i: number = 0; i < deniedAttrs.length; i++) {
            const elementsWithAttr: NodeListOf<HTMLElement> = (element
                .querySelectorAll(`[${deniedAttrs[(i as number)]}]`) as NodeListOf<HTMLElement>);
            for (let j: number = 0; j < elementsWithAttr.length; j++) {
                elementsWithAttr[(j as number)].removeAttribute(deniedAttrs[(i as number)]);
            }
        }

        return element;
    }

    private allowedStyle(element: HTMLElement): HTMLElement {
        const allowedStyles: string[] = this.editor.pasteSettings.allowedStyles;
        const styleElements: NodeListOf<HTMLElement> = element.querySelectorAll('[style]') as NodeListOf<HTMLElement>;

        for (let i: number = 0; i < styleElements.length; i++) {
            let allowedStyleValue: string = '';
            const styleValue: string[] = styleElements[(i as number)].getAttribute('style').split(';');

            for (let j: number = 0; j < styleValue.length; j++) {
                const stylePair: string = styleValue[(j as number)].trim();
                if (!stylePair) { continue; }

                const [property]: string[] = stylePair.split(':').map((s: string) => s.trim());

                if (allowedStyles.indexOf(property) !== -1) {
                    allowedStyleValue += stylePair + ';';
                }
            }

            styleElements[(i as number)].removeAttribute('style');
            if (allowedStyleValue) {
                styleElements[(i as number)].setAttribute('style', allowedStyleValue);
            }
        }

        return element;
    }

    private detachInlineElements(element: HTMLElement): void {
        for (let i: number = 0; i < ClipboardCleanupModule.inlineNode.length; i++) {
            const inlineElements: NodeListOf<HTMLElement> = element.querySelectorAll(
                ClipboardCleanupModule.inlineNode[(i as number)]
            ) as NodeListOf<HTMLElement>;

            for (let j: number = 0; j < inlineElements.length; j++) {
                const parentElem: HTMLElement = inlineElements[(j as number)].parentElement;

                if (!parentElem) { continue; }

                while (inlineElements[(j as number)].firstChild) {
                    parentElem.insertBefore(inlineElements[(j as number)].firstChild, inlineElements[(j as number)]);
                }

                parentElem.removeChild(inlineElements[(j as number)]);
            }
        }
    }

    private getTextContent(element: HTMLElement): void {
        for (let i: number = 0; i < ClipboardCleanupModule.blockNode.length; i++) {
            const blockElements: NodeListOf<HTMLElement> = element.querySelectorAll(
                ClipboardCleanupModule.blockNode[(i as number)]
            ) as NodeListOf<HTMLElement>;

            for (let j: number = 0; j < blockElements.length; j++) {
                const paragraph: HTMLElement = document.createElement('p');
                paragraph.textContent = blockElements[(j as number)].textContent;
                blockElements[(j as number)].parentNode.replaceChild(paragraph, blockElements[(j as number)]);
            }
        }
        const allElements: NodeListOf<HTMLElement> = element.querySelectorAll('*') as NodeListOf<HTMLElement>;
        for (let i: number = 0; i < allElements.length; i++) {
            const attributes: NamedNodeMap = allElements[(i as number)].attributes;
            for (let j: number = attributes.length - 1; j >= 0; j--) {
                allElements[(i as number)].removeAttribute(attributes[(j as number)].name);
            }
        }
    }
}
