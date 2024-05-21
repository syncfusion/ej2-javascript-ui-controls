/**
 * Defines common util methods used by Rich Text Editor.
 */
import { isNullOrUndefined, Browser, createElement, detach } from '@syncfusion/ej2-base';
import { IToolbarStatus } from './interface';

const inlineNode: string[] = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
    'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
    'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
    'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'strike', 'sub', 'sup', 'svg',
    'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];

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
 * @param {string} enterAction - specifies the enter key action API
 * @returns {void}
 * @hidden
 */
export function updateTextNode(value: string, enterAction?: string): string {
    const tempNode: HTMLElement = document.createElement('div');
    tempNode.innerHTML = value;
    tempNode.setAttribute('class', 'tempDiv');
    const resultElm: HTMLElement = document.createElement('div');
    const childNodes: NodeListOf<Node> = tempNode.childNodes as NodeListOf<Node>;
    if (childNodes.length > 0) {
        let isPreviousInlineElem: boolean;
        let previousParent: HTMLElement;
        let paraElm: HTMLElement;
        while (tempNode.firstChild) {
            if ((tempNode.firstChild.nodeName === '#text' &&
            (tempNode.firstChild.textContent.indexOf('\n') < 0 || tempNode.firstChild.textContent.trim() !== '')) ||
            inlineNode.indexOf(tempNode.firstChild.nodeName.toLocaleLowerCase()) >= 0 ) {
                if (!isPreviousInlineElem) {
                    if (enterAction === 'BR') {
                        resultElm.appendChild(tempNode.firstChild);
                        previousParent = resultElm;
                    } else {
                        paraElm = createElement('p');
                        resultElm.appendChild(paraElm);
                        paraElm.appendChild(tempNode.firstChild);
                        previousParent = paraElm;
                        isPreviousInlineElem = true;
                    }
                } else {
                    previousParent.appendChild(tempNode.firstChild);
                    previousParent = paraElm;
                    isPreviousInlineElem = true;
                }
            } else if (tempNode.firstChild.nodeName === '#text' && (tempNode.firstChild.textContent === '\n' ||
            (tempNode.firstChild.textContent.indexOf('\n') >= 0 && tempNode.firstChild.textContent.trim() === ''))) {
                detach(tempNode.firstChild);
            } else {
                resultElm.appendChild(tempNode.firstChild);
                isPreviousInlineElem = false;
            }
        }
        const tableElm: NodeListOf<HTMLElement> = resultElm.querySelectorAll('table');
        for (let i: number = 0; i < tableElm.length; i++) {
            if (tableElm[i as number].classList.length > 0 && !tableElm[i as number].classList.contains('e-rte-table')) {
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
        insertcode: false
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
        while ((range.startContainer.nodeName === "#text" ? range.startContainer.parentElement : range.startContainer as HTMLElement).querySelectorAll('li :empty').length > 0 ||
        (range.startContainer.nodeName === "#text" ? range.startContainer.parentElement : range.startContainer as HTMLElement).querySelectorAll('ol :empty').length > 0) {
            let emptyLI = (range.startContainer.nodeName === "#text" ? range.startContainer.parentElement : range.startContainer as HTMLElement).querySelectorAll('li :empty');
            if (emptyLI.length > 0) {
                emptyLI.forEach((item) => {
                    item.remove();
                });
            }
            else {
                break;
            }
        }
        let liElem = (range.startContainer.nodeName === "#text" ? range.startContainer.parentElement : range.startContainer as HTMLElement).querySelectorAll("li");
        if (liElem.length > 0) {
            liElem.forEach((item) => {
                if(!isNullOrUndefined(item.firstChild) && (item.firstChild.nodeName === "OL" || item.firstChild.nodeName === "UL")){
                    item.style.listStyleType = "none";
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
}
