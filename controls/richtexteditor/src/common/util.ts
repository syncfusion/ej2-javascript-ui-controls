/**
 * Defines common util methods used by Rich Text Editor.
 */
import { isNullOrUndefined, Browser, removeClass } from '@syncfusion/ej2-base';
import { IToolbarStatus } from './interface';

/**
 * @returns {void}
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
 * @param {Element} editableElement - specifies the editable element.
 * @param {string} selector - specifies the string values.
 * @returns {void}
 * @hidden
 */
export function setEditFrameFocus(editableElement: Element, selector: string): void {
    if (editableElement.nodeName === 'BODY' && !isNullOrUndefined(selector)) {
        const iframe: HTMLIFrameElement = <HTMLIFrameElement>top.window.document.querySelector(selector);
        if (!isNullOrUndefined(iframe)) {
            iframe.contentWindow.focus();
        }
    }
}

/**
 * @param {string} value - specifies the string value
 * @returns {void}
 * @hidden
 */
export function updateTextNode(value: string): string {
    const resultElm: HTMLElement = document.createElement('div');
    resultElm.innerHTML = value;
    const tableElm: NodeListOf<HTMLElement> = resultElm.querySelectorAll('table');
    for (let i: number = 0; i < tableElm.length; i++) {
        if (tableElm[i as number].classList.length > 0 &&
        !tableElm[i as number].classList.contains('e-rte-table') && !tableElm[i as number].classList.contains('e-rte-custom-table')) {
            tableElm[i as number].classList.add('e-rte-paste-table');
            if (tableElm[i as number].classList.contains('e-rte-paste-word-table')) {
                tableElm[i as number].classList.remove('e-rte-paste-word-table');
                continue; // Skiping the removal of the border if the source is from word.
            } else if (tableElm[i as number].classList.contains('e-rte-paste-excel-table')) {
                tableElm[i as number].classList.remove('e-rte-paste-excel-table');
                if (tableElm[i as number].getAttribute('border') === '0') {
                    tableElm[i as number].removeAttribute('border');
                }
                const tdElm: NodeListOf<HTMLElement> = tableElm[i as number].querySelectorAll('td');
                for (let j: number = 0; j < tdElm.length; j++) {
                    if (tdElm[j as number].style.borderLeft === 'none') {
                        tdElm[j as number].style.removeProperty('border-left');
                    }
                    if (tdElm[j as number].style.borderRight === 'none') {
                        tdElm[j as number].style.removeProperty('border-right');
                    }
                    if (tdElm[j as number].style.borderBottom === 'none') {
                        tdElm[j as number].style.removeProperty('border-bottom');
                    }
                    if (tdElm[j as number].style.borderTop === 'none') {
                        tdElm[j as number].style.removeProperty('border-top');
                    }
                    if (tdElm[j as number].style.border === 'none') {
                        tdElm[j as number].style.removeProperty('border');
                    }
                }
            } else if (tableElm[i as number].classList.contains('e-rte-paste-onenote-table')) {
                tableElm[i as number].classList.remove('e-rte-paste-onenote-table');
                continue;
            } else if (tableElm[i as number].classList.contains('e-rte-paste-html-table')) {
                tableElm[i as number].classList.remove('e-rte-paste-html-table');
                continue;
            }
        }
    }
    const imageElm: NodeListOf<HTMLElement> = resultElm.querySelectorAll('img');
    for (let i: number = 0; i < imageElm.length; i++) {
        if ((imageElm[i as number] as HTMLImageElement).classList.contains('e-rte-image-unsupported')) {
            continue; // Should not add the class if the image is Broken.
        }
        if (!imageElm[i as number].classList.contains('e-rte-image')) {
            imageElm[i as number].classList.add('e-rte-image');
        }
        if (!(imageElm[i as number].classList.contains('e-imginline') ||
        imageElm[i as number].classList.contains('e-imgbreak'))) {
            imageElm[i as number].classList.add('e-imginline');
        }
    }
    return resultElm.innerHTML;
}

/**
 * @param {Node} startChildNodes - specifies the node
 * @returns {void}
 * @hidden
 */
export function getLastTextNode(startChildNodes: Node): Node {
    let finalNode: Node = startChildNodes;
    do {
        if (finalNode.childNodes.length > 0) {
            finalNode = finalNode.childNodes[0];
        }
    }
    while (finalNode.childNodes.length > 0);
    return finalNode;
}

/**
 * @returns {void}
 * @hidden
 */
export function getDefaultHtmlTbStatus(): IToolbarStatus {
    return {
        bold: false,
        italic: false,
        subscript: false,
        superscript: false,
        strikethrough: false,
        orderedlist: false,
        unorderedlist: false,
        numberFormatList: false,
        bulletFormatList: false,
        underline: false,
        alignments: null,
        backgroundcolor: null,
        fontcolor: null,
        fontname: null,
        fontsize: null,
        formats: null,
        createlink: false,
        insertcode: false,
        blockquote: false,
        inlinecode: false
    };
}

/**
 * @returns {void}
 * @hidden
 */
export function getDefaultMDTbStatus(): IToolbarStatus {
    return {
        bold: false,
        italic: false,
        subscript: false,
        superscript: false,
        strikethrough: false,
        orderedlist: false,
        uppercase: false,
        lowercase: false,
        inlinecode: false,
        unorderedlist: false,
        formats: null
    };
}

/**
 * @param {Range} range - specifies the range
 * @returns {void}
 * @hidden
 */
export function nestedListCleanUp(range: Range): void {
    if (range.startContainer.parentElement.closest('ol,ul') !== null && range.endContainer.parentElement.closest('ol,ul') !== null) {
        range.extractContents();
        while ((range.startContainer.nodeName === '#text' ? range.startContainer.parentElement : range.startContainer as HTMLElement).querySelectorAll('li :empty').length > 0 ||
        (range.startContainer.nodeName === '#text' ? range.startContainer.parentElement : range.startContainer as HTMLElement).querySelectorAll('ol :empty').length > 0) {
            const emptyLI: NodeListOf<Element> = (range.startContainer.nodeName === '#text' ? range.startContainer.parentElement : range.startContainer as HTMLElement).querySelectorAll('li :empty');
            if (emptyLI.length > 0) {
                emptyLI.forEach((item: Element) => {
                    item.remove();
                });
            }
            else {
                break;
            }
        }
        const liElem: NodeListOf<HTMLLIElement> = (range.startContainer.nodeName === '#text' ? range.startContainer.parentElement : range.startContainer as HTMLElement).querySelectorAll('li');
        if (liElem.length > 0) {
            liElem.forEach((item: HTMLLIElement) => {
                if (!isNullOrUndefined(item.firstChild) && (item.firstChild.nodeName === 'OL' || item.firstChild.nodeName === 'UL')){
                    item.style.listStyleType = 'none';
                }
            });
        }
    }
}

/**
 * Method to scroll the content to the cursor position
 *
 * @param {Document} document - specifies the document.
 * @param {HTMLElement | HTMLBodyElement} inputElement - specifies the input element.
 * @returns {void}
 */
export function scrollToCursor(
    document: Document, inputElement: HTMLElement | HTMLBodyElement) : void {
    const rootElement: HTMLElement = inputElement.nodeName === 'BODY' ?
        inputElement.ownerDocument.defaultView.frameElement.closest('.e-richtexteditor') as HTMLElement :
        inputElement.closest('.e-richtexteditor') as HTMLElement;
    const height: string = rootElement.style.height;
    if (document.getSelection().rangeCount === 0) {
        return;
    }
    const range: Range = document.getSelection().getRangeAt(0);
    const finalFocusElement: HTMLElement = range.startContainer.nodeName === '#text' ? range.startContainer.parentElement as HTMLElement :
        range.startContainer as HTMLElement;
    const rect: DOMRect = finalFocusElement.getBoundingClientRect() as DOMRect;
    const cursorTop: number = rect.top;
    const cursorBottom: number = rect.bottom;
    const rootRect : DOMRect = rootElement.getBoundingClientRect() as DOMRect;
    const hasMargin: boolean = rootElement.querySelectorAll('.e-count-enabled, .e-resize-enabled').length > 0;
    if (inputElement.nodeName === 'BODY') {
        if (height === 'auto') {
            if (window.innerHeight < cursorTop) {
                finalFocusElement.scrollIntoView(false);
            }
        } else {
            if (cursorTop > inputElement.getBoundingClientRect().height) {
                finalFocusElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            }
        }
    } else {
        if (height === 'auto') {
            if (window.innerHeight < cursorTop) {
                finalFocusElement.scrollIntoView({ block: 'end', inline: 'nearest' });
            }
        } else {
            if (cursorBottom > rootRect.bottom) {
                rootElement.querySelector('.e-rte-content').scrollTop += (cursorBottom - rootRect.bottom) + (hasMargin ? 20 : 0);
            }
        }
    }
    const scrollVal: HTMLElement = inputElement.closest('div[style*="overflow-y: scroll"]') as HTMLElement;
    if (!isNullOrUndefined(scrollVal)) {
        const parentRect: DOMRect = scrollVal.getBoundingClientRect() as DOMRect;
        if (cursorBottom > parentRect.bottom) {
            scrollVal.scrollTop += (cursorBottom - parentRect.bottom);
        }
    }
}

/**
 * Inserts items at a specific index in an array.
 *
 * @template T
 * @param {Array<T>} oldArray - Specifies the old array.
 * @param {Array<T>} newArray - Specifies the elements to insert.
 * @param {number} indexToInsert - Specifies the index to insert.
 * @returns {Array<T>} - Returns the array after inserting the elements.
 */
export function insertItemsAtIndex<T>(oldArray: Array<T>, newArray: Array<T>, indexToInsert: number): Array<T> {
    // This is a work around for ES6 ...spread operator usage.
    // Usecase: When a new array is inserted into an existing array at a specific index.
    for (let i: number = 0; i < newArray.length; i++) {
        if (i === 0) {
            oldArray.splice(indexToInsert + i, 1, newArray[i as number]);
        } else {
            oldArray.splice(indexToInsert + i, 0, newArray[i as number]);
        }
    }
    return oldArray;
}

/**
 * Wrapper function to remove a class from the element and remove the attribute if the class is empty.
 *
 * @param  {Element[]|NodeList} elements - An array of elements that need to remove a list of classes
 * @param  {string|string[]} classes - String or array of string that need to add an individual element as a class
 *
 * @returns {Element[]|NodeList} - Returns the array of elements after removing the class.
 * @private
 */
export function removeClassWithAttr(elements: Element[] | NodeList, classes: string | string[]): Element[] | NodeList {
    removeClass(elements, classes);
    for (let i: number = 0; i < elements.length; i++) {
        if ((elements[i as number] as Element).classList.length === 0 && (elements[i as number] as Element).getAttribute('class')) {
            (elements[i as number] as Element).removeAttribute('class');
        }
    }
    return elements;
}
